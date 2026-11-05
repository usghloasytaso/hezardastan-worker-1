import * as cheerio from 'cheerio';
import {
  Source,
  ExtractedResult,
  WpRestPost,
  WpAuthor,
  WpFaqItem,
  WpFeaturedMedia,
  WpSeoMeta,
  WpSchemaData,
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
      return createEmptyResult(`خطای دریافت صفحه: کد وضعیت ${response.status} (${response.statusText})`, url);
    }

    const html = await response.text();
    return cleanAndParseHtml(html, source, url);
  } catch (err: any) {
    clearTimeout(timeoutId);
    return createEmptyResult(`عدم پاسخگویی یا خطای شبکه: ${err.message || String(err)}`, url);
  }
}

/**
 * پردازش جامع و استخراج تمامی داده‌های آشکار، نهان و سئوی ساختاریافته وردپرس
 */
export function cleanAndParseHtml(
  html: string,
  source: Partial<Source>,
  baseUrl = ''
): ExtractedResult {
  try {
    const $ = cheerio.load(html);

    // =========================================================================
    // ۱. استخراج داده‌های ساخت‌یافته JSON-LD (NewsArticle, Article, FAQPage)
    // =========================================================================
    const jsonLdInfo = extractJsonLdBlocks($);

    // =========================================================================
    // ۲. استخراج متادیتاهای سئو و متاتگ‌های نهان (Yoast / OpenGraph / Twitter)
    // =========================================================================
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || baseUrl;
    const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || '';
    const twitterTitle = $('meta[name="twitter:title"]').attr('content')?.trim() || '';
    const pageTitle = $('title').text().trim() || '';
    const ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || '';
    const twitterDescription = $('meta[name="twitter:description"]').attr('content')?.trim() || '';
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || ogDescription || twitterDescription;
    const ogImage = $('meta[property="og:image"]').attr('content')?.trim() || '';
    const twitterImage = $('meta[name="twitter:image"]').attr('content')?.trim() || '';

    const seoMeta: WpSeoMeta = {
      yoast_wpseo_title: ogTitle || twitterTitle || pageTitle,
      yoast_wpseo_metadesc: metaDescription,
      canonical_url: canonicalUrl,
      og_title: ogTitle,
      og_description: ogDescription,
      og_image: ogImage ? resolveUrl(ogImage, baseUrl) : '',
      twitter_title: twitterTitle,
      twitter_description: twitterDescription,
      twitter_image: twitterImage ? resolveUrl(twitterImage, baseUrl) : ''
    };

    // =========================================================================
    // ۳. استخراج تیتر اصلی (Title)
    // =========================================================================
    let title = '';
    if (source.title_selector !== undefined) {
      if (source.title_selector.trim()) {
        const candidates = splitSelectors(source.title_selector);
        for (const sel of candidates) {
          try {
            const found = $(sel).first();
            if (found.length > 0) {
              const t = cleanWhitespace(found.text());
              if (t) { title = t; break; }
            }
          } catch {}
        }
      }
      // در صورتی که کاربر سلکتور تیتر را کلاً خالی کرده باشد، تیتر استخراج نمی‌شود
    } else {
      if (jsonLdInfo.newsArticle?.headline) {
        title = String(jsonLdInfo.newsArticle.headline).trim();
      }
      if (!title) {
        title = ogTitle || twitterTitle || $('h1').first().text().trim() || pageTitle;
      }
    }
    title = cleanWhitespace(title);

    // =========================================================================
    // ۴. استخراج نامک / اسلاگ (Slug)
    // =========================================================================
    let slug = generateSlug(baseUrl, title);

    // =========================================================================
    // ۵. استخراج تاریخ‌های انتشار و ویرایش (date & modified)
    // =========================================================================
    let validPublishedDate = '';
    let validModifiedDate = '';
    if (source.date_selector !== undefined) {
      if (source.date_selector.trim()) {
        const d = extractDate($, jsonLdInfo, source);
        validPublishedDate = d.publishedDate;
        validModifiedDate = d.modifiedDate;
      }
      // اگر کاربر سلکتور تاریخ را خالی کرده باشد، تاریخ خالی می‌ماند و استخراج نمی‌شود
    } else {
      const d = extractDate($, jsonLdInfo, source);
      validPublishedDate = d.publishedDate;
      validModifiedDate = d.modifiedDate;
    }

    // =========================================================================
    // ۶. استخراج نویسنده / خبرنگار (Author)
    // =========================================================================
    let author: WpAuthor = { name: '', url: '', avatar: '' };
    if (source.author_selector !== undefined) {
      if (source.author_selector.trim()) {
        author = extractAuthor($, jsonLdInfo, baseUrl, source);
      }
      // اگر کاربر سلکتور نویسنده را خالی کرده باشد، نویسنده خالی می‌ماند
    } else {
      author = extractAuthor($, jsonLdInfo, baseUrl, source);
    }

    // =========================================================================
    // ۷. استخراج دسته‌بندی‌ها (Categories)
    // =========================================================================
    let categories: string[] = [];
    if (source.category_selector !== undefined) {
      if (source.category_selector.trim()) {
        categories = extractCategories($, jsonLdInfo, source);
      }
      // اگر کاربر سلکتور دسته‌بندی را خالی کرده باشد، دسته‌ها خالی می‌مانند
    } else {
      categories = extractCategories($, jsonLdInfo, source);
    }

    // =========================================================================
    // ۸. استخراج برچسب‌ها و کلمات کلیدی (Tags)
    // =========================================================================
    let tags: string[] = [];
    if (source.tags_selector !== undefined) {
      if (source.tags_selector.trim()) {
        tags = extractTags($, jsonLdInfo, source);
      }
      // اگر کاربر سلکتور برچسب را خالی کرده باشد، برچسب‌ها خالی می‌مانند
    } else {
      tags = extractTags($, jsonLdInfo, source);
    }

    // =========================================================================
    // ۹. استخراج سوالات متداول (FAQ Schema & Blocks)
    // =========================================================================
    const faqs = extractFaqs($, jsonLdInfo);

    // =========================================================================
    // ۱۰. استخراج تصویر شاخص اولیه (Featured Image)
    // =========================================================================
    let featuredImage = '';
    if (source.image_selector !== undefined) {
      if (source.image_selector.trim()) {
        featuredImage = extractFeaturedImage($, jsonLdInfo, baseUrl, source, ogImage, twitterImage);
      }
      // اگر کاربر سلکتور تصویر را خالی کرده باشد، عکس شاخص خالی می‌ماند
    } else {
      featuredImage = extractFeaturedImage($, jsonLdInfo, baseUrl, source, ogImage, twitterImage);
    }

    // =========================================================================
    // ۱۰.۵. استخراج فیلدهای اختصاصی تعریف‌شده توسط کاربر (Custom Fields)
    // =========================================================================
    const customFields = extractCustomFields($, source.custom_selectors || '');

    // =========================================================================
    // ۱۱. تمیزسازی و یافتن کانتینر بدنه مقاله برای خروجی گوتنبرگ
    // =========================================================================
    // حذف عناصر زائد سراسری مخرب (اسکریپت‌ها، بنرهای تبلیغاتی، ویجت‌های شرط‌بندی، نظرخواهی، منوها، فرم‌ها، فوترها)
    const dangerousElements = [
      'script',
      'style',
      'noscript',
      'iframe[src*="google"]',
      'iframe[src*="doubleclick"]',
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
      '.code-block',
      '[class*="code-block-"]',
      '[id*="code-block-"]',
      '.vv-wrap',
      '.vv-head',
      '[class*="vv-"]',
      '[class*="sponsored"]',
      '[id*="sponsored"]',
      '.sponsored',
      '.dc-vibe-inline',
      '.user-sentiment-vote',
      '[class*="vibe-inline"]',
      '[class*="sentiment-vote"]',
      '.dc-newsletter-cta',
      '[class*="newsletter-cta"]',
      '[class*="newsletter-box"]',
      '.mkd-breadcrumbs',
      '.breadcrumb',
      '.breadcrumbs',
      '.yoast-breadcrumbs',
      '.rank-math-breadcrumb',
      '.mkd-post-info',
      '.mkd-author-description',
      '.mkd-single-tags-share-holder',
      '.entry-meta',
      '.post-meta'
    ];
    $(dangerousElements.join(', ')).remove();

    // حذف سلکتورهای اختصاصی منبع (در صورتی که در تنظیمات منبع ثبت شده باشد)
    if (source.remove_selectors && source.remove_selectors.trim()) {
      const rmList = source.remove_selectors.split(',').map((s: string) => s.trim()).filter(Boolean);
      for (const sel of rmList) {
        try {
          $(sel).remove();
        } catch (e) {
          console.warn('خطا در اعمال remove_selector:', sel, e);
        }
      }
    }

    // یافتن کانتینر بدنه مقاله (بررسی ترتیبی کاندیداها به جای ارزیابی همزمان درختی)
    let $root: any = null;
    if (source.content_selector && source.content_selector.trim()) {
      const candidates = source.content_selector.split(',').map((s: string) => s.trim()).filter(Boolean);
      for (const sel of candidates) {
        try {
          const found = $(sel);
          if (found.length > 0) {
            $root = found.first();
            break;
          }
        } catch {}
      }
    }

    if (!$root || $root.length === 0) {
      const fallbacks = [
        '.mkd-post-text-inner',
        '.mkd-post-text',
        '.post-content',
        '.entry-content',
        '.content-inner',
        '.jeg_inner_content',
        '.article-content',
        '.article-body',
        '.story-body',
        '.news-body',
        '.content-text',
        '.main-content',
        '[itemprop="articleBody"]',
        'article',
        'main'
      ];
      for (const sel of fallbacks) {
        try {
          const el = $(sel);
          if (el.length > 0) {
            $root = el.first();
            break;
          }
        } catch {}
      }
    }

    if (!$root || $root.length === 0) {
      $root = $('body');
    }

    // پاکسازی عناصر هدر و تبلیغات تکراری از درون کانتینر انتخاب‌شده
    if ($root && $root.length > 0) {
      $root.find('h1, .entry-title, .post-title, .mkd-post-title').remove();
      $root.find('.mkd-post-image, .featured-image, .post-thumbnail, .post-featured-image, .entry-thumbnail, .mkd-post-info, .mkd-breadcrumbs').remove();
      $root.find('.code-block, [class*="code-block-"], .vv-wrap, [class*="sponsored"], .dc-vibe-inline, .dc-newsletter-cta').remove();
    }

    // =========================================================================
    // ۱۲. استانداردسازی بلاک‌های گوتنبرگ وردپرس (WP Blocks Normalization)
    // =========================================================================
    const headings: ExtractedHeading[] = [];
    const images: ExtractedImage[] = [];
    const links: ExtractedLink[] = [];

    // الف) پردازش و استانداردسازی تصاویر داخل محتوا
    $root.find('img').each((_: any, el: any) => {
      const $img = $(el);
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

      // واکشی کپشن تصویر
      let caption = '';
      const $parentFigure = $img.closest('figure');
      if ($parentFigure.length > 0) {
        caption = cleanWhitespace($parentFigure.find('figcaption').text());
      }
      if (!caption) {
        const $next = $img.next('.caption, .image-caption, p.caption');
        if ($next.length > 0) caption = cleanWhitespace($next.text());
      }

      images.push({ src, alt, caption });

      // تولید بلاک تصویر گوتنبرگ وردپرس
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

    // اگر تصویر شاخص تا کنون پیدا نشده باشد، و کاربر فیلد تصویر را عمداً پاک نکرده باشد، اولین تصویر محتوا را شاخص قرار می‌دهیم
    if (!featuredImage && images.length > 0 && !(source.image_selector !== undefined && !source.image_selector.trim())) {
      featuredImage = images[0].src;
    }

    // ب) استانداردسازی تیترهای داخلی (h1-h6)
    $root.find('h1, h2, h3, h4, h5, h6').each((_: any, el: any) => {
      const $h = $(el);
      const tag = el.tagName.toLowerCase();
      // تبدیل h1 به h2 (در وردپرس h1 اختصاصی عنوان مطلب است)
      const targetTag = tag === 'h1' ? 'h2' : tag;
      const text = cleanWhitespace($h.text());

      if (text.length > 1) {
        headings.push({ tag: targetTag, text });
        $h.replaceWith(`<${targetTag} class="wp-block-heading">${escapeHtml(text)}</${targetTag}>`);
      } else {
        $h.remove();
      }
    });

    // ج) استانداردسازی پیوندها (لینک‌های داخلی، خارجی و ارجاعات)
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

      $a.removeAttr('class')
        .removeAttr('id')
        .removeAttr('style')
        .removeAttr('onclick')
        .attr('href', href);

      if (isExternal) {
        $a.attr('target', '_blank').attr('rel', 'noopener noreferrer');
      }
    });

    // د) استانداردسازی پاراگراف‌ها، لیست‌ها و نقل قول‌ها
    $root.find('p').each((_: any, el: any) => {
      const $p = $(el);
      $p.removeAttr('style').removeAttr('class').removeAttr('id');
      const text = cleanWhitespace($p.text());
      if (!text && $p.find('img, figure').length === 0) {
        $p.remove();
      }
    });

    $root.find('blockquote').each((_: any, el: any) => {
      const $b = $(el);
      $b.removeAttr('style').removeAttr('id').addClass('wp-block-quote');
    });

    $root.find('ul, ol').each((_: any, el: any) => {
      const $list = $(el);
      $list.removeAttr('style').removeAttr('id').removeAttr('class');
    });

    $root.find('table').each((_: any, el: any) => {
      const $tbl = $(el);
      $tbl.removeAttr('style').removeAttr('id').addClass('wp-block-table');
    });

    // هـ) پاکسازی اتریبیوت‌های نامناسب باقی‌مانده از تگ‌های فرعی
    $root.find('*').each((_: any, el: any) => {
      const $el = $(el);
      const cls = $el.attr('class') || '';
      if (!cls.includes('wp-block-') && !cls.includes('wp-element-')) {
        $el.removeAttr('class');
      }
      $el.removeAttr('style').removeAttr('id').removeAttr('onclick');
    });

    // باز کردن (unwrap) دیوهای زائد برای تولید خروجی خالص گوتنبرگ
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

    // =========================================================================
    // ۱۳. اضافه کردن بلاک پرسش‌های متداول (FAQ) به محتوای گوتنبرگ (در صورت وجود)
    // =========================================================================
    if (faqs.length > 0) {
      const faqBlockHtml = `
        <div class="wp-block-group wp-block-faq-section" style="margin-top:2.5rem; padding:1.25rem; border:1px solid #334155; border-radius:0.75rem; background:rgba(30,41,59,0.3);">
          <h2 class="wp-block-heading" style="color:#38bdf8; margin-bottom:1rem;">پرسش‌های متداول (FAQ)</h2>
          ${faqs
            .map(
              (f) => `
            <details class="wp-block-details" style="margin-bottom:0.75rem; padding:0.75rem; background:rgba(15,23,42,0.6); border-radius:0.5rem; border:1px solid #1e293b;">
              <summary style="font-weight:700; cursor:pointer; color:#f1f5f9;">${escapeHtml(f.question)}</summary>
              <p style="margin-top:0.5rem; color:#cbd5e1; font-size:0.95rem;">${escapeHtml(f.answer)}</p>
            </details>
          `
            )
            .join('')}
        </div>
      `;
      $root.append(faqBlockHtml);
    }

    // ۱۴. خروجی نهایی کد تمیز HTML وردپرس
    let cleanWpHtml = $root.html() || '';
    cleanWpHtml = cleanWpHtml
      .replace(/\n\s*\n/g, '\n')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<div>\s*<\/div>/g, '')
      .trim();

    // ۱۵. متن کاملاً تمیز بدون تگ (Clean Plain Text)
    const plainText = extractCleanText(cleanWpHtml);

    // ۱۶. چکیده (Excerpt)
    let excerpt = metaDescription;
    if (!excerpt || excerpt.length < 20) {
      const paragraphs = plainText.split('\n\n').filter((p) => p.length > 30);
      excerpt = paragraphs.length > 0 ? paragraphs[0].slice(0, 260) + '...' : '';
    }

    // ۱۷. آمار تعداد کلمات و زمان مطالعه
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // ۱۸. ساخت شیء رسانه شاخص (Featured Media)
    const featuredMedia: WpFeaturedMedia = {
      source_url: featuredImage,
      alt_text: cleanWhitespace(images[0]?.alt || title),
      title: title,
      caption: images[0]?.caption || '',
      description: excerpt
    };

    // ۱۹. ساخت شیء اسکیما (Schema Data)
    const schemaData: WpSchemaData = {
      news_article: {
        headline: title,
        datePublished: validPublishedDate,
        dateModified: validModifiedDate,
        author: author.name,
        publisher: jsonLdInfo.newsArticle?.publisher?.name || source.name || '',
        description: excerpt,
        image: featuredImage
      },
      faq: faqs,
      raw_json_ld: jsonLdInfo.rawJsonLd
    };

    // ۲۰. تولید خروجی رسمی و کامل مطابق با WP REST API (/wp/v2/posts)
    const wpRestPost: WpRestPost = {
      date: validPublishedDate,
      date_gmt: toUtcIso(validPublishedDate),
      modified: validModifiedDate,
      modified_gmt: toUtcIso(validModifiedDate),
      slug: slug,
      status: 'publish',
      type: 'post',
      link: canonicalUrl,
      title: {
        rendered: title,
        raw: title
      },
      content: {
        rendered: cleanWpHtml,
        protected: false
      },
      excerpt: {
        rendered: `<p>${escapeHtml(excerpt)}</p>`,
        protected: false
      },
      author: author,
      featured_media: featuredMedia,
      comment_status: 'open',
      ping_status: 'open',
      categories: categories,
      tags: tags,
      meta: seoMeta,
      schema: schemaData,
      custom_fields: customFields,
      stats: {
        reading_time_minutes: readingTime,
        word_count: wordCount,
        headings_count: headings.length,
        images_count: images.length
      },
      headings: headings,
      images: images,
      links: links,
      cleaned_text: plainText
    };

    if (plainText.length < 20 && cleanWpHtml.length < 50) {
      return {
        success: false,
        title,
        cleaned_content: plainText,
        html_content: cleanWpHtml,
        featured_image: featuredImage,
        excerpt,
        author,
        categories,
        tags,
        date: validPublishedDate,
        modified: validModifiedDate,
        slug,
        faq: faqs,
        seo_meta: seoMeta,
        custom_fields: customFields,
        wp_post: wpRestPost,
        error: 'محتوای متنی صفحه استخراج نشد یا ساختار آن محافظت شده است.'
      };
    }

    return {
      success: true,
      title,
      cleaned_content: plainText,
      html_content: cleanWpHtml,
      featured_image: featuredImage,
      excerpt,
      author,
      categories,
      tags,
      date: validPublishedDate,
      modified: validModifiedDate,
      slug,
      faq: faqs,
      seo_meta: seoMeta,
      custom_fields: customFields,
      wp_post: wpRestPost
    };
  } catch (err: any) {
    return createEmptyResult(`خطا در تجزیه ساختار مقاله: ${err.message || String(err)}`, baseUrl);
  }
}

// =========================================================================
// توابع کمکی واکشی و استخراج متادیتاها
// =========================================================================

/**
 * استخراج و پارس بلوک‌های JSON-LD
 */
function extractJsonLdBlocks($: cheerio.CheerioAPI): {
  newsArticle?: any;
  faqList: WpFaqItem[];
  rawJsonLd: any[];
} {
  const rawJsonLd: any[] = [];
  let newsArticle: any = null;
  const faqList: WpFaqItem[] = [];

  $('script[type="application/ld+json"]').each((_: any, el: any) => {
    try {
      const raw = $(el).html();
      if (!raw) return;
      const data = JSON.parse(raw);
      rawJsonLd.push(data);

      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];

      for (const item of items) {
        if (!item || typeof item !== 'object') continue;
        const type = item['@type'];

        // تشخیص NewsArticle یا Article
        if (
          !newsArticle &&
          (type === 'NewsArticle' ||
            type === 'Article' ||
            type === 'BlogPosting' ||
            type === 'TechArticle' ||
            (Array.isArray(type) && (type.includes('NewsArticle') || type.includes('Article'))))
        ) {
          newsArticle = item;
        }

        // تشخیص FAQPage
        if (type === 'FAQPage' || (Array.isArray(type) && type.includes('FAQPage'))) {
          const entities = item.mainEntity || item.questions || [];
          if (Array.isArray(entities)) {
            for (const q of entities) {
              const question = q.name || q.question || '';
              const answer = q.acceptedAnswer?.text || q.text || '';
              if (question && answer) {
                faqList.push({
                  question: cleanWhitespace(stripTags(question)),
                  answer: cleanWhitespace(stripTags(answer))
                });
              }
            }
          }
        }
      }
    } catch {}
  });

  return { newsArticle, faqList, rawJsonLd };
}

export function splitSelectors(raw?: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/[\r\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * استخراج سلکتورهای اختصاصی تعریف‌شده توسط کاربر
 * پشتیبانی از فرمت‌های:
 * ۱. کلید: سلکتور (مثال: روتیتر: .mkd-post-subtitle)
 * ۲. سلکتور ساده (مثال: .mkd-post-subtitle)
 */
export function extractCustomFields(
  $: cheerio.CheerioAPI,
  rawSelectors?: string
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  if (!rawSelectors || !rawSelectors.trim()) return result;

  const lines = rawSelectors
    .split(/[\r\n;|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const line of lines) {
    let key = '';
    let selector = '';

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      key = cleanWhitespace(line.slice(0, colonIndex));
      selector = line.slice(colonIndex + 1).trim();
    } else {
      selector = line.trim();
      key = selector.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').replace(/^_+|_+$/g, '');
    }

    if (!key || !selector) continue;

    try {
      const elements = $(selector);
      if (elements.length === 0) continue;

      if (elements.length === 1) {
        const el = elements.first();
        if (el.is('img')) {
          result[key] = el.attr('src') || el.attr('data-src') || '';
        } else if (el.is('a') && el.attr('href') && !cleanWhitespace(el.text())) {
          result[key] = el.attr('href') || '';
        } else {
          result[key] = cleanWhitespace(el.text());
        }
      } else {
        const values: string[] = [];
        elements.each((_: any, el: any) => {
          const t = cleanWhitespace($(el).text());
          if (t) values.push(t);
        });
        result[key] = values.length > 0 ? (values.length === 1 ? values[0] : values) : '';
      }
    } catch (e) {
      console.warn(`خطا در پردازش سلکتور اختصاصی [${key}: ${selector}]:`, e);
    }
  }

  return result;
}

/**
 * استخراج نویسنده / خبرنگار
 */
function extractAuthor(
  $: cheerio.CheerioAPI,
  jsonLdInfo: { newsArticle?: any },
  baseUrl: string,
  source: Partial<Source> = {}
): WpAuthor {
  let name = '';
  let url = '';
  let avatar = '';

  // ۱. اولویت اول: بررسی سلکتورهای اختصاصی تعریف‌شده برای این منبع
  if (source.author_selector && source.author_selector.trim()) {
    const customSelectors = splitSelectors(source.author_selector);
    for (const sel of customSelectors) {
      try {
        const found = $(sel).first();
        if (found.length > 0) {
          const t = cleanWhitespace(found.text());
          if (t && t.length > 1 && t.length < 70) {
            name = t;
            const href = found.attr('href') || found.find('a').attr('href');
            if (href) url = resolveUrl(href, baseUrl);
            break;
          }
        }
      } catch {}
    }
    name = cleanWhitespace(name.replace(/^(نویسنده|خبرنگار|نوشته شده توسط|گزارش از|by|author)\s*[:：]/i, ''));
    return {
      name,
      url: url ? resolveUrl(url, baseUrl) : undefined,
      avatar: avatar || undefined
    };
  }

  // ۲. از داده‌های ساختاریافته JSON-LD
  if (!name && jsonLdInfo.newsArticle?.author) {
    const a = jsonLdInfo.newsArticle.author;
    if (typeof a === 'string') {
      name = a;
    } else if (Array.isArray(a) && a.length > 0) {
      name = a[0].name || '';
      url = a[0].url || '';
    } else if (typeof a === 'object') {
      name = a.name || '';
      url = a.url || '';
    }
  }

  // ۳. از متاتگ‌های سئو و شبکه‌های اجتماعی
  if (!name) {
    name =
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      $('meta[name="twitter:creator"]').attr('content') ||
      '';
  }

  // ۴. از سلکتورهای عمومی و پیش‌فرض هوشمند (Universal Fallbacks)
  if (!name) {
    const authorSelectors = [
      '[rel="author"]',
      '.author-name',
      '.author',
      '.byline',
      '.post-author',
      '.entry-author',
      '.article-author',
      '.author__name',
      '.c-author',
      '.jeg_meta_author a',
      '.jeg_author_name',
      '[itemprop="author"]',
      'a[href*="/author/"]'
    ];
    for (const sel of authorSelectors) {
      try {
        const found = $(sel).first();
        if (found.length > 0) {
          const t = cleanWhitespace(found.text());
          if (t && t.length > 1 && t.length < 70) {
            name = t;
            const href = found.attr('href') || found.find('a').attr('href');
            if (href) url = resolveUrl(href, baseUrl);
            break;
          }
        }
      } catch {}
    }
  }

  // استخراج تصویر آواتار نویسنده
  const avatarSelectors = [
    '.author-avatar img',
    '.author img',
    '.avatar img',
    '.jeg_author_avatar img',
    'img[alt*="avatar"]'
  ];
  for (const sel of avatarSelectors) {
    try {
      const img = $(sel).first();
      const src = img.attr('src') || img.attr('data-src');
      if (src) {
        avatar = resolveUrl(src, baseUrl);
        break;
      }
    } catch {}
  }

  name = cleanWhitespace(name.replace(/^(نویسنده|خبرنگار|نوشته شده توسط|گزارش از|by|author)\s*[:：]/i, ''));
  if (!name) name = 'هیئت تحریریه';

  return {
    name,
    url: url ? resolveUrl(url, baseUrl) : undefined,
    avatar: avatar || undefined
  };
}

/**
 * استخراج دسته‌بندی‌ها
 */
function extractCategories(
  $: cheerio.CheerioAPI,
  jsonLdInfo: { newsArticle?: any },
  source: Partial<Source> = {}
): string[] {
  const catSet = new Set<string>();

  // ۱. اولویت اول: بررسی سلکتورهای اختصاصی دسته‌بندی منبع
  if (source.category_selector && source.category_selector.trim()) {
    const customSelectors = splitSelectors(source.category_selector);
    for (const sel of customSelectors) {
      try {
        $(sel).each((_: any, el: any) => {
          const text = cleanWhitespace($(el).text());
          if (text && !['خانه', 'صفحه اصلی', 'home', 'main', 'اخبار', 'news'].includes(text.toLowerCase())) {
            catSet.add(text);
          }
        });
      } catch {}
    }
    return Array.from(catSet);
  }

  // ۲. دسته‌بندی پیش‌فرض منبع
  if (source.category && source.category.trim()) {
    catSet.add(source.category.trim());
  }

  // ۳. از داده‌های ساختاریافته JSON-LD
  if (jsonLdInfo.newsArticle?.articleSection) {
    const section = jsonLdInfo.newsArticle.articleSection;
    if (Array.isArray(section)) {
      section.forEach((s: any) => catSet.add(cleanWhitespace(String(s))));
    } else if (typeof section === 'string') {
      section.split(',').forEach((s: string) => catSet.add(cleanWhitespace(s)));
    }
  }

  // ۴. از متاتگ‌ها
  const metaCat =
    $('meta[property="article:section"]').attr('content') ||
    $('meta[name="category"]').attr('content') ||
    '';
  if (metaCat) {
    metaCat.split(',').forEach((s: string) => catSet.add(cleanWhitespace(s)));
  }

  // ۵. از ساختار خرده‌نان (Breadcrumbs) و لینک‌های دسته عمومی
  const categorySelectors = [
    '.breadcrumb a, .breadcrumbs a, .c-breadcrumb a',
    '.post-category a, .entry-category a, .article-category a, .category a'
  ];
  $(categorySelectors.join(', ')).each((_: any, el: any) => {
    const text = cleanWhitespace($(el).text());
    if (text && !['خانه', 'صفحه اصلی', 'home', 'main', 'اخبار', 'news'].includes(text.toLowerCase())) {
      catSet.add(text);
    }
  });

  const res = Array.from(catSet).filter((c) => c.length > 1 && c.length < 40);
  return res.length > 0 ? res : ['عمومی'];
}

/**
 * استخراج برچسب‌ها و کلمات کلیدی (Tags)
 */
function extractTags(
  $: cheerio.CheerioAPI,
  jsonLdInfo: { newsArticle?: any },
  source: Partial<Source> = {}
): string[] {
  const tagSet = new Set<string>();

  const addTag = (text: string) => {
    let t = cleanWhitespace(text);
    t = t.replace(/^#/, '').trim();
    const lower = t.toLowerCase();
    if (
      t.length > 1 &&
      t.length < 50 &&
      !['all tags', 'tags', 'برچسب‌ها', 'تگ‌ها', 'view all', 'more', 'اشتراک', 'share', 'دیدگاه‌ها', 'comments'].includes(lower)
    ) {
      tagSet.add(t);
    }
  };

  // ۱. اولویت اول: بررسی سلکتور اختصاصی برچسب‌های منبع
  if (source.tags_selector && source.tags_selector.trim()) {
    const customSelectors = splitSelectors(source.tags_selector);
    for (const sel of customSelectors) {
      try {
        $(sel).each((_: any, el: any) => {
          const $el = $(el);
          // فیلتر کردن قطعی لینک‌های هدر، فوتر، منو یا سایدبار
          if ($el.closest('header, footer, nav, aside, .sidebar, #sidebar, .tag-cloud, .widget, .menu, .navigation').length > 0) {
            return;
          }
          addTag($el.text());
        });
      } catch {}
    }
    // بازگرداندن برچسب‌های اختصاصی بدون اضافه کردن هیچ تگ متفرقه
    return Array.from(tagSet).filter((t) => t.length > 1 && t.length < 50);
  }

  // ۲. استخراج برچسب‌ها منحصراً از کانتینرهای تگ‌های مقاله (نه از کل بدنه یا لینک‌های سراسری سایت)
  const articleTagContainers = [
    '.mkd-single-tags-share-holder a',
    '.post-tags a',
    '.entry-tags a',
    '.article-tags a',
    '[rel="tag"]',
    '.tags-links a',
    '.jeg_post_tags a',
    '.post__tags a',
    '.c-tags a'
  ];
  for (const sel of articleTagContainers) {
    try {
      $(sel).each((_: any, el: any) => {
        const $el = $(el);
        if ($el.closest('header, footer, nav, aside, .sidebar, #sidebar, .tag-cloud, .widget, .menu, .navigation').length === 0) {
          addTag($el.text());
        }
      });
    } catch {}
  }

  // ۳. از داده‌های ساختاریافته اختصاصی همین مقاله (متا تگ article:tag و JSON-LD keywords)
  if (tagSet.size === 0) {
    $('meta[property="article:tag"]').each((_: any, el: any) => {
      const val = $(el).attr('content');
      if (val) addTag(val);
    });

    if (jsonLdInfo.newsArticle?.keywords) {
      const kw = jsonLdInfo.newsArticle.keywords;
      if (Array.isArray(kw)) {
        kw.forEach((k: any) => addTag(String(k)));
      } else if (typeof kw === 'string') {
        kw.split(/[,،]/).forEach((k: string) => addTag(k));
      }
    }
  }

  return Array.from(tagSet).filter((t) => t.length > 1 && t.length < 50);
}

/**
 * استخراج تصویر شاخص اولیه
 */
function extractFeaturedImage(
  $: cheerio.CheerioAPI,
  jsonLdInfo: { newsArticle?: any },
  baseUrl: string,
  source: Partial<Source> = {},
  ogImage = '',
  twitterImage = ''
): string {
  let imgUrl = '';

  // ۱. بررسی سلکتور اختصاصی منبع
  if (source.image_selector && source.image_selector.trim()) {
    const customSelectors = splitSelectors(source.image_selector);
    for (const sel of customSelectors) {
      try {
        const el = $(sel).first();
        if (el.length > 0) {
          const val =
            el.attr('content') ||
            el.attr('src') ||
            el.attr('data-src') ||
            el.attr('data-lazy-src') ||
            el.attr('data-original');
          if (val) {
            imgUrl = val;
            break;
          }
        }
      } catch {}
    }
    if (imgUrl && baseUrl) {
      imgUrl = resolveUrl(imgUrl, baseUrl);
    }
    return imgUrl;
  }

  // ۲. از JSON-LD
  if (!imgUrl && jsonLdInfo.newsArticle?.image) {
    imgUrl = parseJsonLdImage(jsonLdInfo.newsArticle.image);
  }

  // ۳. از متاتگ‌های OpenGraph و Twitter
  if (!imgUrl) {
    imgUrl = ogImage || twitterImage || $('link[rel="image_src"]').attr('href') || '';
  }

  // ۴. اولین تصویر بزرگ بدنه مقاله
  if (!imgUrl) {
    const firstImg = $('article img, .post-content img, .entry-content img, main img').first();
    imgUrl = firstImg.attr('src') || firstImg.attr('data-src') || '';
  }

  if (imgUrl && baseUrl) {
    imgUrl = resolveUrl(imgUrl, baseUrl);
  }

  return imgUrl;
}

/**
 * استخراج تاریخ انتشار و آخرین به‌روزرسانی
 */
function extractDate(
  $: cheerio.CheerioAPI,
  jsonLdInfo: { newsArticle?: any },
  source: Partial<Source> = {}
): { publishedDate: string; modifiedDate: string } {
  let datePublished = '';
  let dateModified = '';

  // ۱. بررسی سلکتور اختصاصی تاریخ منبع
  if (source.date_selector && source.date_selector.trim()) {
    const customSelectors = splitSelectors(source.date_selector);
    for (const sel of customSelectors) {
      try {
        const el = $(sel).first();
        if (el.length > 0) {
          datePublished = el.attr('datetime') || el.attr('content') || cleanWhitespace(el.text());
          if (datePublished) break;
        }
      } catch {}
    }
    const validPublishedDate = normalizeIsoDate(datePublished);
    const validModifiedDate = normalizeIsoDate(dateModified) || validPublishedDate;
    return { publishedDate: validPublishedDate, modifiedDate: validModifiedDate };
  }

  // ۲. از داده‌های ساختاریافته JSON-LD
  if (!datePublished) {
    datePublished = jsonLdInfo.newsArticle?.datePublished || '';
  }
  if (!dateModified) {
    dateModified = jsonLdInfo.newsArticle?.dateModified || '';
  }

  // ۳. از متاتگ‌ها
  if (!datePublished) {
    datePublished =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="pubdate"]').attr('content') ||
      $('meta[name="publish-date"]').attr('content') ||
      $('meta[name="date"]').attr('content') ||
      $('time[datetime]').first().attr('datetime') ||
      '';
  }

  if (!dateModified) {
    dateModified =
      $('meta[property="article:modified_time"]').attr('content') ||
      $('meta[name="last-modified"]').attr('content') ||
      datePublished;
  }

  const validPublishedDate = normalizeIsoDate(datePublished);
  const validModifiedDate = normalizeIsoDate(dateModified) || validPublishedDate;

  return { publishedDate: validPublishedDate, modifiedDate: validModifiedDate };
}

/**
 * استخراج سوالات متداول (FAQ) از اسکیما یا بدنه صفحه
 */
function extractFaqs($: cheerio.CheerioAPI, jsonLdInfo: { faqList: WpFaqItem[] }): WpFaqItem[] {
  const faqs = [...jsonLdInfo.faqList];

  // اسکن ساختارهای آکاردئونی و FAQ در بدنه HTML
  $('.faq-item, .faq, .faqs, [class*="faq"]').each((_: any, el: any) => {
    const $el = $(el);
    const q = $el.find('.question, .faq-question, h3, h4, summary').first().text();
    const a = $el.find('.answer, .faq-answer, p').first().text();
    const question = cleanWhitespace(q);
    const answer = cleanWhitespace(a);
    if (question.length > 5 && answer.length > 10) {
      if (!faqs.some((f) => f.question === question)) {
        faqs.push({ question, answer });
      }
    }
  });

  return faqs;
}

function parseJsonLdImage(img: any): string {
  if (typeof img === 'string') return img;
  if (Array.isArray(img) && img.length > 0) return parseJsonLdImage(img[0]);
  if (typeof img === 'object' && img !== null) return img.url || img.contentUrl || '';
  return '';
}

function normalizeIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function toUtcIso(dateStr: string): string {
  if (!dateStr || !dateStr.trim()) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString();
  } catch {
    return '';
  }
}

function generateSlug(url: string, title: string): string {
  if (url) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        const last = parts[parts.length - 1].replace(/\.(html|php|asp|htm)$/i, '');
        if (last && last.length > 2) {
          return decodeURIComponent(last);
        }
      }
    } catch {}
  }

  // در صورت عدم وجود اسلاگ معتبر در آدرس، از روی تیتر اسلاگ می‌سازیم
  return title
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

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

function stripTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
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

function createEmptyResult(errorMsg: string, url: string): ExtractedResult {
  const emptyWpPost: WpRestPost = {
    date: new Date().toISOString(),
    date_gmt: new Date().toISOString(),
    modified: new Date().toISOString(),
    modified_gmt: new Date().toISOString(),
    slug: '',
    status: 'draft',
    type: 'post',
    link: url,
    title: { rendered: '', raw: '' },
    content: { rendered: '', protected: false },
    excerpt: { rendered: '', protected: false },
    author: { name: 'نامشخص' },
    featured_media: { source_url: '', alt_text: '' },
    comment_status: 'open',
    ping_status: 'open',
    categories: [],
    tags: [],
    meta: {},
    schema: {},
    stats: { reading_time_minutes: 0, word_count: 0, headings_count: 0, images_count: 0 },
    headings: [],
    images: [],
    links: [],
    cleaned_text: ''
  };

  return {
    success: false,
    title: '',
    cleaned_content: '',
    html_content: '',
    featured_image: '',
    excerpt: '',
    author: { name: 'نامشخص' },
    categories: [],
    tags: [],
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    slug: '',
    faq: [],
    seo_meta: {},
    wp_post: emptyWpPost,
    error: errorMsg
  };
}
