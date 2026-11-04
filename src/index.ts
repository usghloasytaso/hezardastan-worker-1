import { Hono } from 'hono';
import { Env, Source } from './types';
import {
  initDatabase,
  getAllSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
  toggleSourceStatus,
  listRecentArticles,
  getArticleById,
  clearAllArticles,
  getDashboardStats
} from './db';
import { extractArticleContent } from './extractor';
import { runCollectionPipeline } from './crawler';
import { renderDashboardHtml } from './dashboard';

const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
  console.error('[Hezardastan Error]', err);
  return c.json({ error: err.message, stack: err.stack }, 500);
});



// ۱. روت صفحه اصلی داشبورد
app.get('/', (c) => {
  return c.html(renderDashboardHtml());
});
app.get('/dashboard', (c) => {
  return c.html(renderDashboardHtml());
});

// ۲. API آمار داشبورد
app.get('/api/stats', async (c) => {
  const stats = await getDashboardStats(c.env.DB);
  return c.json(stats);
});

// ۳. API مدیریت منابع (Sources)
app.get('/api/sources', async (c) => {
  const sources = await getAllSources(c.env.DB);
  return c.json(sources);
});

app.get('/api/sources/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const source = await getSourceById(c.env.DB, id);
  if (!source) return c.json({ error: 'منبع یافت نشد' }, 404);
  return c.json(source);
});

app.post('/api/sources', async (c) => {
  const body = await c.req.json<Source>();
  const newId = await createSource(c.env.DB, body);
  return c.json({ success: true, id: newId });
});

app.put('/api/sources/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json<Partial<Source>>();
  const ok = await updateSource(c.env.DB, id, body);
  return c.json({ success: ok });
});

app.delete('/api/sources/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const ok = await deleteSource(c.env.DB, id);
  return c.json({ success: ok });
});

app.post('/api/sources/:id/toggle', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const { is_active } = await c.req.json<{ is_active: number }>();
  const ok = await toggleSourceStatus(c.env.DB, id, is_active);
  return c.json({ success: ok });
});

// ۴. API تست در لحظه استخراج (Live Tester)
app.post('/api/extract/test', async (c) => {
  const body = await c.req.json<{
    url: string;
    title_selector?: string;
    content_selector?: string;
    remove_selectors?: string;
    custom_script?: string;
  }>();

  if (!body.url) {
    return c.json({ success: false, error: 'آدرس URL الزامی است' }, 400);
  }

  const result = await extractArticleContent(body.url, {
    title_selector: body.title_selector,
    content_selector: body.content_selector,
    remove_selectors: body.remove_selectors,
    custom_script: body.custom_script
  });

  return c.json(result);
});

// ۵. API دریافت لیست مطالب دیوان اول
app.get('/api/articles', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  const articles = await listRecentArticles(c.env.DB, limit);
  return c.json(articles);
});

app.get('/api/articles/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const article = await getArticleById(c.env.DB, id);
  if (!article) return c.json({ error: 'مطلب یافت نشد' }, 404);
  return c.json(article);
});

app.post('/api/articles/clear', async (c) => {
  await clearAllArticles(c.env.DB);
  return c.json({ success: true, message: 'تمام مطالب دیوان اول با موفقیت پاکسازی شدند.' });
});

// ۶. API اجرای دستی پایش فیدها
app.post('/api/crawler/run', async (c) => {
  const sourceIdParam = c.req.query('source_id');
  const sourceId = sourceIdParam ? parseInt(sourceIdParam, 10) : undefined;
  const report = await runCollectionPipeline(c.env, sourceId);
  return c.json(report);
});

// ۷. صادر کردن هندلر ورکر شامل Fetch و Scheduled (Cron Trigger)
export default {
  fetch: app.fetch,

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`[Hezardastan Cron] اجرای پایش خودکار در زمان: ${new Date(event.scheduledTime).toISOString()}`);
    ctx.waitUntil(
      runCollectionPipeline(env)
        .then((report) => {
          console.log('[Hezardastan Cron] گزارش پایش:', JSON.stringify(report));
        })
        .catch((err) => {
          console.error('[Hezardastan Cron] خطا در پایش خودکار:', err);
        })
    );
  }
};
