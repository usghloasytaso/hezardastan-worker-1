import { Env, Source } from './types';
import { getActiveSources, getSourceById, isArticleDuplicate, saveArticle } from './db';
import { fetchRssFeed } from './rss';
import { extractArticleContent } from './extractor';

export interface CrawlReport {
  timestamp: string;
  processedSources: number;
  totalFeedItems: number;
  newArticlesScraped: number;
  duplicatesSkipped: number;
  errorsCount: number;
  details: string[];
}

export async function runCollectionPipeline(
  env: Env,
  specificSourceId?: number
): Promise<CrawlReport> {
  const report: CrawlReport = {
    timestamp: new Date().toISOString(),
    processedSources: 0,
    totalFeedItems: 0,
    newArticlesScraped: 0,
    duplicatesSkipped: 0,
    errorsCount: 0,
    details: []
  };

  let sources: Source[] = [];
  if (specificSourceId) {
    const s = await getSourceById(env.DB, specificSourceId);
    if (s && s.is_active) {
      sources = [s];
    }
  } else {
    sources = await getActiveSources(env.DB);
  }

  report.processedSources = sources.length;

  for (const source of sources) {
    try {
      report.details.push(`شروع بررسی منبع: [${source.name}] (${source.rss_url})`);
      const items = await fetchRssFeed(source.rss_url);
      report.totalFeedItems += items.length;

      // پایش ۱۰ مورد جدید از هر فید در هر اجرا جهت مدیریت بهینه منابع و محدودیت‌های ورکر
      const targetItems = items.slice(0, 10);

      for (const item of targetItems) {
        // ۱. فیلتر کردن لینک‌های تکراری
        const isDuplicate = await isArticleDuplicate(env.DB, item.link);
        if (isDuplicate) {
          report.duplicatesSkipped++;
          continue; // کاملاً نادیده گرفته می‌شود
        }

        // ۲. استخراج و تمیزسازی محتوا با ساختار غنی و چندگانه (وردپرس / متنی / جیسون)
        const extractResult = await extractArticleContent(item.link, source);

        if (extractResult.success) {
          await saveArticle(env.DB, {
            source_id: source.id!,
            source_name: source.name,
            category: source.category,
            url: item.link,
            title: extractResult.title || item.title,
            cleaned_content: extractResult.cleaned_content,
            html_content: extractResult.html_content,
            json_content: JSON.stringify(extractResult.json_data || {}),
            featured_image: extractResult.featured_image,
            excerpt: extractResult.excerpt,
            published_at: item.pubDate || new Date().toISOString(),
            status: 'آماده پردازش'
          });
          report.newArticlesScraped++;
          report.details.push(`✓ استخراج موفق: ${extractResult.title || item.title}`);
        } else {
          // ۳. ثبت خطا بدون متوقف شدن ورکر
          await saveArticle(env.DB, {
            source_id: source.id!,
            source_name: source.name,
            category: source.category,
            url: item.link,
            title: item.title,
            cleaned_content: '',
            html_content: '',
            json_content: '{}',
            featured_image: '',
            excerpt: '',
            published_at: item.pubDate || new Date().toISOString(),
            status: 'خطا در استخراج',
            error_message: extractResult.error || 'خطای ناشناخته در استخراج'
          });
          report.errorsCount++;
          report.details.push(`✗ خطا در استخراج (${item.link}): ${extractResult.error}`);
        }
      }
    } catch (sourceErr: any) {
      report.errorsCount++;
      report.details.push(`خطا در پردازش فید منبع [${source.name}]: ${sourceErr.message}`);
    }
  }

  return report;
}
