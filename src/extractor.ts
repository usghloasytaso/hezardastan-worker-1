import * as cheerio from 'cheerio';
import {
  Source,
  ExtractedResult,
  StructuredArticleJson,
  ExtractedHeading,
  ExtractedImage,
  ExtractedLink
} from './types';

export async function extractArticleContent(
  url: string,
  source: Partial<Source>
): Promise<ExtractedResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fa,en-US;q=0.9,en;q=0.8'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        title: '',
        cleaned_content: '',
        html_content: '',
        featured_image: '',
        excerpt: '',
        error: `خطای دریافت صفحه: کد وضعیت ${response.status} (${response.statusText})`
      };
    }

    const html = await response.text();
    return cleanAndParseHtml(html, source, url);
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      title: '',
      cleaned_content: '',
      html_content: '',
      featured_image: '',
      excerpt: '',
      error: `عدم پاسخگویی یا خطای شبکه: ${err.message || String(err)}`
    };
  }
}

export function cleanAndParseHtml(
  html: string,
  source: Partial<Source>,
  baseUrl = ''
): ExtractedResult {
  try {
    const $ = cheerio.load(html);

    // ۱. استخراج تصویر شاخص (Featured Image)
    let featuredImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      '';
    if (featuredImage && baseUrl) {
      featuredImage = resolveUrl(featuredImage, baseUrl);
    }

    // ۲. استخراج تیتر اصلی (Title)
    let title = '';
    if (source.title_selector && source.title_selector.trim()) {
      try {
        title = $(source.title_selector).first().text().trim();
      } catch {}
    }
    if (!title) {
      title =
        $('meta[property="og:title"]').attr('content')?.trim() ||
        $('meta[name="twitter:title"]').attr('content')?.trim() ||
        $('h1').first().text().trim() ||
        $('title').text().trim();
    }
    title = cleanWhitespace(title);

    // ۳. حذف عناصر زائد سراسری مخرب (اسکریپت، استایل، منوهای اصلی، فرم‌ها، نظرات، فوترها)
    const dangerousElements = [
      'script',
      'style',
      'noscript',
      'iframe[src*="google"]',
      'iframe[src*="ad"]',
      'svg',
      'canvas',
      'header',
      'footer',
      'nav',
      'form',
      'button',
      'input',
      'select',
      'textarea',
      '.comments',
      '#comments',
      '.comment-section',
      '.social-share',
      '.share-buttons',
      '.tags-list'
    ];
    $(dangerousElements.join(', ')).remove();

    // حذف سلکتورهای اختصاصی منبع (در صورتی که کاربر مشخص کرده باشد)
    if (source.remove_selectors && source.remove_selectors.trim()) {
      try {
        $(source.remove_selectors).remove();
      } catch (e) {
        console.warn('خطا در اعمال remove_selectors:', e);
      }
    }

    // ۴. یافتن کانتینر بدنه مقاله
    let $root: any = null;
    if (source.content_selector && source.content_selector.trim()) {
      try {
        const found = $(source.content_selector);
        if (found.length > 0) $root = found.first();
      } catch {}
    }

    if (!$root || $root.length === 0) {
      const fallbacks = [
        'article',
        '[itemprop="articleBody"]',
        '.post-content',
        '.entry-content',
        '.article-content',
        '.article-body',
        '.story-body',
        '.news-body',
        '.content-text',
        '.main-content',
        'main'
      ];
      for (const sel of fallbacks) {
        const el = $(sel);
        if (el.length > 0) {
          $root = el.first();
          break;
        }
      }
    }

    if (!$root || $root.length === 0) {
      $root = $('body');
    }

    // ۵. استخراج و تبدیل ساختارها به فرمت تمیز و استاندارد وردپرس (Gutenberg Ready)
    const headings: ExtractedHeading[] = [];
    const images: ExtractedImage[] = [];
    const links: ExtractedLink[] = [];

    // الف) پردازش و استانداردسازی تصاویر داخل متن
    $root.find('img').each((_: any, el: any) => {
      const $img = $(el);
      // رفع مشکل Lazy-loading (بررسی data-src, data-lazy-src, data-original)
      let src =
        $img.attr('data-src') ||
        $img.attr('data-lazy-src') ||
        $img.attr('data-original') ||
        $img.attr('src') ||
        '';

      if (!src || src.startsWith('data:image/svg') || src.includes('pixel.gif') || src.length < 5) {
        $img.remove();
        return;
      }

      if (baseUrl) {
        src = resolveUrl(src, baseUrl);
      }

      const alt = cleanWhitespace($img.attr('alt') || title);

      // یافتن کپشن عکس (از figcaption یا کادرهای توضیحات زیر عکس)
      let caption = '';
      const $parentFigure = $img.closest('figure');
      if ($parentFigure.length > 0) {
        caption = cleanWhitespace($parentFigure.find('figcaption').text());
      }
      if (!caption) {
        const $next = $img.next('.caption, .image-caption, p.caption');
        if ($next.length > 0) caption = cleanWhitespace($next.text());
      }

      // اضافه به لیست تصاویر ساخت‌یافته
      images.push({ src, alt, caption });

      // ساخت تگ استاندارد وردپرس
      const captionHtml = caption ? `<figcaption class="wp-element-caption">${escapeHtml(caption)}</figcaption>` : '';
      const wpFigure = $(`
        <figure class="wp-block-image size-large">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
          ${captionHtml}
        </figure>
      `);

      if ($parentFigure.length > 0) {
        $parentFigure.replaceWith(wpFigure);
      } else {
        $img.replaceWith(wpFigure);
      }
    });

    // اگر تصویر شاخص پیدا نشده بود، اولین تصویر بدنه را شاخص در نظر می‌گیریم
    if (!featuredImage && images.length > 0) {
      featuredImage = images[0].src;
    }

    // ب) پردازش تیترهای داخلی (h2, h3, h4)
    $root.find('h1, h2, h3, h4, h5, h6').each((_: any, el: any) => {
      const $h = $(el);
      const tag = el.tagName.toLowerCase();
      // تبدیل h1های داخل متن به h2 (در وردپرس h1 فقط برای تیتر اصلی صفحه است)
      const targetTag = tag === 'h1' ? 'h2' : tag;
      const text = cleanWhitespace($h.text());

      if (text.length > 1) {
        headings.push({ tag: targetTag, text });
        $h.replaceWith(`<${targetTag} class="wp-block-heading">${escapeHtml(text)}</${targetTag}>`);
      } else {
        $h.remove();
      }
    });

    // ج) پردازش لینک‌ها (داخلی و خارجی + حفظ ریلیتدها)
    $root.find('a').each((_: any, el: any) => {
      const $a = $(el);
      let href = $a.attr('href') || '';
      const linkText = cleanWhitespace($a.text());

      if (!href || href.startsWith('javascript:') || href.startsWith('#')) {
        $a.replaceWith(linkText);
        return;
      }

      if (baseUrl) {
        href = resolveUrl(href, baseUrl);
      }

      const isExternal = baseUrl ? !href.includes(new URL(baseUrl).hostname) : false;
      links.push({ text: linkText, url: href, is_external: isExternal });

      // پاکسازی اتریبیوت‌های اضافه و اضافه کردن target برای لینک‌های خارجی
      $a.removeAttr('class')
        .removeAttr('id')
        .removeAttr('style')
        .removeAttr('onclick')
        .attr('href', href);

      if (isExternal) {
        $a.attr('target', '_blank').attr('rel', 'noopener noreferrer');
      }
    });

    // د) استانداردسازی پاراگراف‌ها، نقل قول‌ها و لیست‌ها
    $root.find('p').each((_: any, el: any) => {
      const $p = $(el);
      // حذف اتریبیوت‌های مزاحم
      $p.removeAttr('style').removeAttr('class').removeAttr('id');
      const text = cleanWhitespace($p.text());
      if (!text && $p.find('img, figure').length === 0) {
        $p.remove();
      }
    });

    $root.find('blockquote').each((_: any, el: any) => {
      const $b = $(el);
      $b.removeAttr('style').removeAttr('id');
      $b.addClass('wp-block-quote');
    });

    $root.find('ul, ol').each((_: any, el: any) => {
      const $list = $(el);
      $list.removeAttr('style').removeAttr('id').removeAttr('class');
    });

    // هـ) پاکسازی اتریبیوت‌های style و class از کلیه تگ‌های باقی‌مانده داخل بدنه
    $root.find('*').each((_: any, el: any) => {
      const $el = $(el);
      // از کلاس‌های استاندارد wp-block که خودمان اضافه کردیم محافظت می‌کنیم
      const cls = $el.attr('class') || '';
      if (!cls.includes('wp-block-') && !cls.includes('wp-element-')) {
        $el.removeAttr('class');
      }
      $el.removeAttr('style').removeAttr('id').removeAttr('onclick');
    });

    // حذف تگ‌های خالی و باز کردن (unwrap) دیوهای زائد برای تولید کد بسیار تمیز و خالص وردپرس
    for (let i = 0; i < 3; i++) {
      $root.find('div:empty, span:empty, p:empty').remove();
      $root.find('div, section, article').each((_: any, el: any) => {
        const $div = $(el);
        const cls = $div.attr('class') || '';
        if (!cls.includes('wp-block-')) {
          const contents = $div.contents();
          if (contents.length > 0) {
            $div.replaceWith(contents);
          }
        }
      });
    }

    // ۶. تولید خروجی HTML تمیز وردپرس
    let cleanWpHtml = $root.html() || '';
    // پاکسازی خطوط و فاصله‌های اضافه بین تگ‌ها
    cleanWpHtml = cleanWpHtml
      .replace(/\n\s*\n/g, '\n')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<div>\s*<\/div>/g, '')
      .trim();

    // ۷. تولید خروجی متن خالص بدون تگ (Clean Plain Text)
    const plainText = extractCleanText(cleanWpHtml);

    // ۸. تولید چکیده (Excerpt) از پاراگراف اول یا دوم
    const paragraphs = plainText.split('\n\n').filter((p) => p.length > 30);
    const excerpt = paragraphs.length > 0 ? paragraphs[0].slice(0, 280) + '...' : '';

    // ۹. محاسبه زمان مطالعه و تعداد کلمات
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // ۱۰. ساختار نهایی JSON
    const structuredJson: StructuredArticleJson = {
      title,
      featured_image: featuredImage,
      excerpt,
      headings,
      images,
      links,
      reading_time_minutes: readingTime,
      word_count: wordCount,
      cleaned_text: plainText,
      html_content: cleanWpHtml
    };

    if (plainText.length < 20 && cleanWpHtml.length < 50) {
      return {
        success: false,
        title,
        cleaned_content: plainText,
        html_content: cleanWpHtml,
        featured_image: featuredImage,
        excerpt,
        json_data: structuredJson,
        error: 'محتوای صفحه استخراج نشد یا ساختار آن تغییر کرده است.'
      };
    }

    return {
      success: true,
      title,
      cleaned_content: plainText,
      html_content: cleanWpHtml,
      featured_image: featuredImage,
      excerpt,
      json_data: structuredJson
    };
  } catch (err: any) {
    return {
      success: false,
      title: '',
      cleaned_content: '',
      html_content: '',
      featured_image: '',
      excerpt: '',
      error: `خطا در تجزیه ساختار مقاله: ${err.message || String(err)}`
    };
  }
}

/**
 * تبدیل HTML به متن کاملاً تمیز و خالص بدون هیچ تگی
 */
function extractCleanText(htmlContent: string): string {
  const $ = cheerio.load(htmlContent);
  $('h1, h2, h3, h4, h5, h6, p, li, blockquote, tr, figure').each((_: any, el: any) => {
    $(el).prepend('\n');
    $(el).append('\n');
  });
  $('br').replaceWith('\n');

  const lines = $.text().split('\n');
  const cleaned: string[] = [];

  for (let l of lines) {
    l = cleanWhitespace(l);
    if (l.length > 0) cleaned.push(l);
  }

  return cleaned.join('\n\n');
}

function resolveUrl(relativeOrAbsolute: string, base: string): string {
  try {
    return new URL(relativeOrAbsolute, base).href;
  } catch {
    return relativeOrAbsolute;
  }
}

function cleanWhitespace(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\r\t]+/g, ' ')
    .replace(/ +/g, ' ')
    .trim();
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m] || m)
  );
}
