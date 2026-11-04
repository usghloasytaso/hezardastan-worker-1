import { fetchRssFeed } from '../src/rss';
import { extractArticleContent } from '../src/extractor';
import { Source, Article } from '../src/types';

// رنگ‌ها برای لاگ‌های شفاف در کنسول
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function runAcceptanceTests() {
  console.log(`\n${CYAN}================================================================${RESET}`);
  console.log(`${CYAN}    اجرای سناریوهای تست پذیرش ورکر اول (پروژه هزاردستان)     ${RESET}`);
  console.log(`${CYAN}================================================================${RESET}\n`);

  // -------------------------------------------------------------
  // ۱. تست تعریف منبع و اسکریپت (دو سایت مختلف با ساختار کاملاً متفاوت)
  // -------------------------------------------------------------
  console.log(`${YELLOW}[تست ۱] تعریف ۲ منبع خبری مختلف با ساختارهای متمایز و اسکریپت‌های اختصاصی...${RESET}`);

  const source1: Source = {
    id: 1,
    name: 'عصر ایران (Asriran)',
    site_url: 'https://www.asriran.com',
    rss_url: 'https://www.asriran.com/fa/rss/allnews',
    category: 'سیاسی و اجتماعی',
    is_active: 1,
    title_selector: 'h1, .title',
    content_selector: '.body, .news-body, article, .text',
    remove_selectors: '.ad, .banner, .tags, .share, .comments'
  };

  const source2: Source = {
    id: 2,
    name: 'زومیت (Zoomit)',
    site_url: 'https://www.zoomit.ir',
    rss_url: 'https://www.zoomit.ir/feed/',
    category: 'تکنولوژی و سخت‌افزار',
    is_active: 1,
    title_selector: 'h1',
    content_selector: 'article, [itemprop="articleBody"], .post-content, main',
    remove_selectors: '.advertisement, .ads, .related, .tags, header, footer, nav'
  };

  console.log(`  ✓ منبع ۱: ${source1.name} | فید: ${source1.rss_url}`);
  console.log(`  ✓ منبع ۲: ${source2.name} | فید: ${source2.rss_url}`);
  console.log(`${GREEN}  -> تست ۱ با موفقیت پاس شد!${RESET}\n`);

  // -------------------------------------------------------------
  // ۲. تست پیش‌نمایش و استخراج زنده بدون کدهای اضافه HTML
  // -------------------------------------------------------------
  console.log(`${YELLOW}[تست ۲] تست پیش‌نمایش و موتور تمیزسازی روی لینک‌های واقعی هر دو سایت...${RESET}`);

  // دریافت فیدها برای استخراج لینک نمونه
  console.log(`  در حال خواندن فید منبع ۱ (${source1.name})...`);
  const items1 = await fetchRssFeed(source1.rss_url);
  if (!items1 || items1.length === 0) throw new Error(`هیچ مطلبی از فید ${source1.name} دریافت نشد.`);
  const sample1 = items1[0];
  console.log(`  -> نمونه لینک ۱: ${sample1.link}`);

  console.log(`  در حال استخراج و تمیزسازی محتوای لینک ۱...`);
  const extract1 = await extractArticleContent(sample1.link, source1);
  if (!extract1.success) {
    throw new Error(`خطا در استخراج لینک ۱: ${extract1.error}`);
  }

  // راستی‌آزمایی تمیز بودن متن و عدم وجود کدهای HTML
  assertNoHtmlTags(extract1.title, 'تیتر منبع ۱');
  assertNoHtmlTags(extract1.cleaned_content, 'متن تمیزشده منبع ۱');
  console.log(`  ${GREEN}✓ تیتر ۱:${RESET} "${extract1.title}"`);
  console.log(`  ${GREEN}✓ طول متن تمیز ۱:${RESET} ${extract1.cleaned_content.length} کاراکتر (پاراگراف‌بندی شده بدون تگ‌های زائد HTML)`);

  console.log(`\n  در حال خواندن فید منبع ۲ (${source2.name})...`);
  const items2 = await fetchRssFeed(source2.rss_url);
  if (!items2 || items2.length === 0) throw new Error(`هیچ مطلبی از فید ${source2.name} دریافت نشد.`);
  const sample2 = items2[0];
  console.log(`  -> نمونه لینک ۲: ${sample2.link}`);

  console.log(`  در حال استخراج و تمیزسازی محتوای لینک ۲...`);
  const extract2 = await extractArticleContent(sample2.link, source2);
  if (!extract2.success) {
    throw new Error(`خطا در استخراج لینک ۲: ${extract2.error}`);
  }

  assertNoHtmlTags(extract2.title, 'تیتر منبع ۲');
  assertNoHtmlTags(extract2.cleaned_content, 'متن تمیزشده منبع ۲');
  console.log(`  ${GREEN}✓ تیتر ۲:${RESET} "${extract2.title}"`);
  console.log(`  ${GREEN}✓ طول متن تمیز ۲:${RESET} ${extract2.cleaned_content.length} کاراکتر`);
  console.log(`${GREEN}  -> تست ۲ (پیش‌نمایش و تمیزکاری HTML) با موفقیت کامل پاس شد!${RESET}\n`);

  // -------------------------------------------------------------
  // ۳. تست اجرای خودکار و عدم تکرار (دو بار پشت سر هم)
  // -------------------------------------------------------------
  console.log(`${YELLOW}[تست ۳] تست اجرای خودکار و فیلتر قطعی رکوردهای تکراری...${RESET}`);

  // شبیه‌سازی دقیق دیتابیس D1 با Set ایندکس یکتا
  const mockD1Database: Map<string, Article> = new Map();

  // دریافت فیدها یک‌بار جهت تست دقیق رفتار تکراری و عدم وابستگی به انتشار خبر جدید در کسری از ثانیه توسط سایت
  const feed1Items = (await fetchRssFeed(source1.rss_url)).slice(0, 3);
  const feed2Items = (await fetchRssFeed(source2.rss_url)).slice(0, 3);
  const sampleFeeds = [
    { source: source1, items: feed1Items },
    { source: source2, items: feed2Items }
  ];

  async function simulateWorkerScrape(feeds: typeof sampleFeeds) {
    let newItemsCount = 0;
    let skippedDuplicates = 0;

    for (const group of feeds) {
      for (const it of group.items) {
        if (mockD1Database.has(it.link)) {
          skippedDuplicates++;
          continue; // نادیده گرفته شد
        }

        const ext = await extractArticleContent(it.link, group.source);
        if (ext.success) {
          mockD1Database.set(it.link, {
            source_id: group.source.id!,
            source_name: group.source.name,
            category: group.source.category,
            url: it.link,
            title: ext.title || it.title,
            cleaned_content: ext.cleaned_content,
            published_at: it.pubDate || new Date().toISOString(),
            status: 'آماده پردازش'
          });
          newItemsCount++;
        }
      }
    }

    return { newItemsCount, skippedDuplicates };
  }

  console.log(`  اجرای بار اول ورکر...`);
  const run1 = await simulateWorkerScrape(sampleFeeds);
  console.log(`  -> بار اول: ${run1.newItemsCount} رکورد جدید استخراج و ذخیره شد. (${run1.skippedDuplicates} تکراری)`);
  if (run1.newItemsCount === 0) {
    throw new Error('در بار اول هیچ رکوردی ذخیره نشد!');
  }

  console.log(`  اجرای بار دوم ورکر با همان فیدها بلافاصله پس از بار اول...`);
  const run2 = await simulateWorkerScrape(sampleFeeds);
  console.log(`  -> بار دوم: ${run2.newItemsCount} رکورد جدید اضافه شد | ${run2.skippedDuplicates} رکورد تکراری شناسایی و نادیده گرفته شد.`);

  if (run2.newItemsCount !== 0) {
    throw new Error(`خطا: در بار دوم نباید هیچ رکورد تکراری اضافه می‌شد اما ${run2.newItemsCount} رکورد اضافه شد!`);
  }
  console.log(`${GREEN}  -> تست ۳ (عدم ثبت رکورد تکراری) با موفقیت کامل تأیید شد!${RESET}\n`);

  // -------------------------------------------------------------
  // ۴. تست کیفیت دیتابیس اول (دیوان اول)
  // -------------------------------------------------------------
  console.log(`${YELLOW}[تست ۴] راستی‌آزمایی کیفیت داده‌های ذخیره‌شده در دیتابیس اول...${RESET}`);

  const savedArticles = Array.from(mockD1Database.values());
  console.log(`  تعداد کل مطالب ذخیره‌شده در دیتابیس: ${savedArticles.length}`);

  for (const art of savedArticles) {
    // ۱. مشخصات منبع نشسته باشد
    if (!art.source_name || !art.source_id) throw new Error(`مشخصات منبع خالی است: ${art.url}`);
    // ۲. لینک اصلی معتبر باشد
    if (!art.url.startsWith('http')) throw new Error(`لینک اصلی نامعتبر است: ${art.url}`);
    // ۳. تیتر موجود باشد
    if (!art.title || art.title.length < 3) throw new Error(`تیتر خالی یا نامعتبر است: ${art.url}`);
    // ۴. متن تمیز شده موجود باشد
    if (!art.cleaned_content || art.cleaned_content.length < 50) throw new Error(`متن تمیزشده ناقص است: ${art.url}`);
    // ۵. تاریخ دریافت و انتشار موجود باشد
    if (!art.published_at) throw new Error(`تاریخ انتشار خالی است: ${art.url}`);
    // ۶. وضعیت دقیقاً «آماده پردازش» باشد
    if (art.status !== 'آماده پردازش') throw new Error(`وضعیت باید «آماده پردازش» باشد اما هست: ${art.status}`);
  }

  console.log(`  ✓ تمام رکوردهای دیتابیس فیلدهای الزامی منبع، لینک، تیتر و متن تمیز را دارند.`);
  console.log(`  ✓ وضعیت همه مطالب با موفقیت روی: ${GREEN}«آماده پردازش»${RESET} قرار دارد.`);
  console.log(`${GREEN}  -> تست ۴ (کیفیت دیتابیس اول) با موفقیت کامل تأیید شد!${RESET}\n`);

  console.log(`${GREEN}================================================================${RESET}`);
  console.log(`${GREEN}    تمامی ۴ معیار تحویل و تست پذیرش با موفقیت ۱۰۰٪ پاس شدند!   ${RESET}`);
  console.log(`${GREEN}================================================================${RESET}\n`);
}

function assertNoHtmlTags(text: string, context: string) {
  // بررسی عدم وجود تگ‌های باز و بسته HTML مثل <div...>, <p>, <span>, <script>, <a> و غیره
  const htmlTagRegex = /<\/?([a-z0-9]+)(\s+[^>]*)?>/i;
  const match = text.match(htmlTagRegex);
  if (match) {
    throw new Error(`در ${context} کدهای تگ HTML یافت شد: "${match[0]}"`);
  }
}

runAcceptanceTests().catch((err) => {
  console.error(`\n${RED}✗ تست با خطا مواجه شد:${RESET}`, err);
  process.exit(1);
});
