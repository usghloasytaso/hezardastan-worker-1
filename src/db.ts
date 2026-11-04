import { Source, Article } from './types';

export async function initDatabase(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        site_url TEXT NOT NULL,
        rss_url TEXT NOT NULL,
        category TEXT DEFAULT 'عمومی',
        is_active INTEGER NOT NULL DEFAULT 1,
        title_selector TEXT DEFAULT 'h1',
        content_selector TEXT DEFAULT 'article, .post-content, .entry-content, .article-body, .story-body',
        remove_selectors TEXT DEFAULT '.advertisement, .ads, .related-posts, .share-buttons, .social-share, .tags, nav, footer, script, style, iframe, .comments',
        custom_script TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        source_name TEXT NOT NULL,
        category TEXT DEFAULT 'عمومی',
        url TEXT NOT NULL UNIQUE,
        title TEXT,
        cleaned_content TEXT,
        html_content TEXT,
        json_content TEXT,
        featured_image TEXT,
        excerpt TEXT,
        published_at TEXT,
        scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'آماده پردازش',
        error_message TEXT
      );
    `),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_url ON articles(url);`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(is_active);`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);`)
  ]);
}

export async function getActiveSources(db: D1Database): Promise<Source[]> {
  const { results } = await db
    .prepare('SELECT * FROM sources WHERE is_active = 1 ORDER BY id DESC')
    .all<Source>();
  return results || [];
}

export async function getAllSources(db: D1Database): Promise<Source[]> {
  const { results } = await db
    .prepare('SELECT * FROM sources ORDER BY id DESC')
    .all<Source>();
  return results || [];
}

export async function getSourceById(db: D1Database, id: number): Promise<Source | null> {
  return await db
    .prepare('SELECT * FROM sources WHERE id = ?')
    .bind(id)
    .first<Source>();
}

export async function createSource(db: D1Database, source: Source): Promise<number> {
  const result = await db
    .prepare(`
      INSERT INTO sources (name, site_url, rss_url, category, is_active, title_selector, content_selector, remove_selectors, custom_script)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      source.name || '',
      source.site_url || '',
      source.rss_url || '',
      source.category || 'عمومی',
      source.is_active ?? 1,
      source.title_selector || 'h1',
      source.content_selector || 'article, .post-content, .entry-content',
      source.remove_selectors || '',
      source.custom_script || ''
    )
    .run();

  return Number(result.meta.last_row_id || 0);
}

export async function updateSource(
  db: D1Database,
  id: number,
  source: Partial<Source>
): Promise<boolean> {
  const current = await getSourceById(db, id);
  if (!current) return false;

  await db
    .prepare(`
      UPDATE sources
      SET name = ?, site_url = ?, rss_url = ?, category = ?, is_active = ?,
          title_selector = ?, content_selector = ?, remove_selectors = ?, custom_script = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(
      source.name ?? current.name,
      source.site_url ?? current.site_url,
      source.rss_url ?? current.rss_url,
      source.category ?? current.category,
      source.is_active ?? current.is_active,
      source.title_selector ?? current.title_selector,
      source.content_selector ?? current.content_selector,
      source.remove_selectors ?? current.remove_selectors,
      source.custom_script ?? current.custom_script,
      id
    )
    .run();

  return true;
}

export async function deleteSource(db: D1Database, id: number): Promise<boolean> {
  await db.prepare('DELETE FROM sources WHERE id = ?').bind(id).run();
  return true;
}

export async function toggleSourceStatus(
  db: D1Database,
  id: number,
  isActive: number
): Promise<boolean> {
  await db
    .prepare('UPDATE sources SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(isActive, id)
    .run();
  return true;
}

export async function isArticleDuplicate(db: D1Database, url: string): Promise<boolean> {
  const found = await db
    .prepare('SELECT id FROM articles WHERE url = ? LIMIT 1')
    .bind(url)
    .first();
  return !!found;
}

export async function saveArticle(db: D1Database, article: Article): Promise<void> {
  await db
    .prepare(`
      INSERT INTO articles (source_id, source_name, category, url, title, cleaned_content, html_content, json_content, featured_image, excerpt, author_name, tags, published_at, status, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(url) DO UPDATE SET
        title = excluded.title,
        cleaned_content = excluded.cleaned_content,
        html_content = excluded.html_content,
        json_content = excluded.json_content,
        featured_image = excluded.featured_image,
        excerpt = excluded.excerpt,
        author_name = excluded.author_name,
        tags = excluded.tags,
        status = excluded.status,
        error_message = excluded.error_message
    `)
    .bind(
      article.source_id,
      article.source_name,
      article.category || 'عمومی',
      article.url,
      article.title || '',
      article.cleaned_content || '',
      article.html_content || '',
      article.json_content || '',
      article.featured_image || '',
      article.excerpt || '',
      article.author_name || 'هیئت تحریریه',
      article.tags || '',
      article.published_at || new Date().toISOString(),
      article.status,
      article.error_message || null
    )
    .run();
}

export async function getArticleById(db: D1Database, id: number): Promise<Article | null> {
  return await db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .bind(id)
    .first<Article>();
}

export async function listRecentArticles(db: D1Database, limit = 50): Promise<Article[]> {
  const { results } = await db
    .prepare('SELECT * FROM articles ORDER BY id DESC LIMIT ?')
    .bind(limit)
    .all<Article>();
  return results || [];
}

export async function clearAllArticles(db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM articles').run();
}

export async function getDashboardStats(db: D1Database) {
  const totalSources = await db.prepare('SELECT COUNT(*) as count FROM sources').first<{ count: number }>();
  const activeSources = await db.prepare('SELECT COUNT(*) as count FROM sources WHERE is_active = 1').first<{ count: number }>();
  const readyArticles = await db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'آماده پردازش'").first<{ count: number }>();
  const errorArticles = await db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'خطا در استخراج'").first<{ count: number }>();

  return {
    totalSources: totalSources?.count || 0,
    activeSources: activeSources?.count || 0,
    readyArticles: readyArticles?.count || 0,
    errorArticles: errorArticles?.count || 0
  };
}
