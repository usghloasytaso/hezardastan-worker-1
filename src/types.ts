export interface Source {
  id?: number;
  name: string;
  site_url: string;
  rss_url: string;
  category?: string;
  is_active: number; // 1 for active, 0 for inactive
  title_selector?: string;
  content_selector?: string;
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

export interface StructuredArticleJson {
  title: string;
  featured_image: string;
  excerpt: string;
  headings: ExtractedHeading[];
  images: ExtractedImage[];
  links: ExtractedLink[];
  reading_time_minutes: number;
  word_count: number;
  cleaned_text: string;
  html_content: string;
}

export interface Article {
  id?: number;
  source_id: number;
  source_name: string;
  category?: string;
  url: string;
  title?: string;
  cleaned_content?: string; // متن کاملاً تمیز بدون تگ
  html_content?: string;    // کد استاندارد و تمیز وردپرس
  json_content?: string;    // ساختار کامل جیسون
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
  json_data?: StructuredArticleJson;
  error?: string;
}

export interface Env {
  DB: D1Database;
}
