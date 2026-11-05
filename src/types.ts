export interface Source {
  id?: number;
  name: string;
  site_url: string;
  rss_url: string;
  category?: string;
  is_active: number; // 1 for active, 0 for inactive
  title_selector?: string;
  content_selector?: string;
  author_selector?: string;
  tags_selector?: string;
  category_selector?: string;
  image_selector?: string;
  date_selector?: string;
  remove_selectors?: string;
  custom_script?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExtractedImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ExtractedHeading {
  tag: string;
  text: string;
}

export interface ExtractedLink {
  text: string;
  url: string;
  is_external: boolean;
}

export interface WpAuthor {
  id?: number;
  name: string;
  url?: string;
  avatar?: string;
}

export interface WpFaqItem {
  question: string;
  answer: string;
}

export interface WpFeaturedMedia {
  id?: number;
  source_url: string;
  alt_text: string;
  title?: string;
  caption?: string;
  description?: string;
}

export interface WpSeoMeta {
  yoast_wpseo_title?: string;
  yoast_wpseo_metadesc?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}

export interface WpSchemaData {
  news_article?: {
    headline?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    publisher?: string;
    description?: string;
    image?: string;
  };
  faq?: WpFaqItem[];
  raw_json_ld?: any[];
}

/**
 * ساختار رسمی پست خبری در WP REST API (سازگار کامل با /wp-json/wp/v2/posts)
 */
export interface WpRestPost {
  id?: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft';
  type: 'post';
  link: string;
  title: {
    rendered: string;
    raw?: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: WpAuthor;
  featured_media: WpFeaturedMedia;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  categories: string[];
  tags: string[];
  meta: WpSeoMeta;
  schema: WpSchemaData;
  stats: {
    reading_time_minutes: number;
    word_count: number;
    headings_count: number;
    images_count: number;
  };
  headings: ExtractedHeading[];
  images: ExtractedImage[];
  links: ExtractedLink[];
  cleaned_text: string;
}

export interface Article {
  id?: number;
  source_id: number;
  source_name: string;
  category?: string;
  url: string;
  title?: string;
  author_name?: string;
  tags?: string; // JSON array string or comma separated
  cleaned_content?: string; // متن کاملاً تمیز بدون تگ
  html_content?: string;    // کد استاندارد و تمیز وردپرس (Gutenberg)
  json_content?: string;    // خروجی استاندارد WP REST API
  featured_image?: string;  // تصویر شاخص
  excerpt?: string;         // چکیده مطلب
  published_at?: string;
  scraped_at?: string;
  status: 'آماده پردازش' | 'خطا در استخراج' | 'پردازش شده';
  error_message?: string;
}

export interface ExtractedResult {
  success: boolean;
  title: string;
  cleaned_content: string;
  html_content: string;
  featured_image: string;
  excerpt: string;
  author: WpAuthor;
  categories: string[];
  tags: string[];
  date: string;
  modified: string;
  slug: string;
  faq: WpFaqItem[];
  seo_meta: WpSeoMeta;
  wp_post: WpRestPost;
  error?: string;
}

export interface Env {
  DB: D1Database;
}
