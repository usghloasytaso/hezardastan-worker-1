-- =====================================================================
-- پروژه هزاردستان - ساختار دیتابیس دیوان اول (Cloudflare D1)
-- =====================================================================

-- ۱. جدول منابع و وب‌سایت‌ها (با تفکیک و شفافیت کامل تمام سلکتورهای استخراج)
CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    site_url TEXT NOT NULL,
    rss_url TEXT NOT NULL,
    category TEXT DEFAULT 'عمومی',
    is_active INTEGER NOT NULL DEFAULT 1,
    title_selector TEXT DEFAULT 'h1, .entry-title, .post-title',
    content_selector TEXT DEFAULT 'article, .post-content, .entry-content, .article-body, .story-body, main',
    author_selector TEXT DEFAULT '[rel="author"], .author-name, .author, .byline, a[href*="/author/"]',
    tags_selector TEXT DEFAULT 'a[href*="/tags/"], a[href*="/tag/"], .tags a, .tag a, .post-tags a, [rel="tag"], .jeg_post_tags a',
    category_selector TEXT DEFAULT '.breadcrumb a, .post-category a, .entry-category a',
    image_selector TEXT DEFAULT 'meta[property="og:image"], .featured-image img, article img',
    date_selector TEXT DEFAULT 'time[datetime], meta[property="article:published_time"], .post-date',
    remove_selectors TEXT DEFAULT '.advertisement, .ads, .related-posts, .share-buttons, .social-share, nav, footer, script, style, iframe, .comments',
    custom_script TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ۲. جدول مطالب استخراج‌شده (سازگار با وردپرس و خروجی چندگانه)
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    category TEXT DEFAULT 'عمومی',
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    cleaned_content TEXT,    -- متن کاملاً خالص بدون تگ
    html_content TEXT,       -- HTML تمیز و استاندارد وردپرس (Gutenberg blocks)
    json_content TEXT,       -- خروجی کامل و ساخت‌یافته WP REST API JSON
    featured_image TEXT,     -- عکس شاخص مقاله
    excerpt TEXT,            -- چکیده مطلب
    author_name TEXT,        -- نام نویسنده / خبرنگار
    tags TEXT,               -- برچسب‌ها و کلمات کلیدی (JSON یا کاما)
    published_at TEXT,
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'آماده پردازش',
    error_message TEXT
);

-- ایندکس‌ها برای سرعت بالا در چک کردن لینک‌های تکراری و کوئری وضعیت
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
