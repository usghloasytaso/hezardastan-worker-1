export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>پروژه هزاردستان — ورکر اول: استخراج ساختاریافته محتوا و WP REST API</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Vazirmatn', sans-serif; background-color: #090d16; color: #f1f5f9; }
    .glass { background: rgba(19, 27, 44, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card { background: #131d2e; border: 1px solid #1e2d42; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }

    /* استایل‌های استاندارد پیش‌نمایش محتوای وردپرس (Gutenberg Standard) با پشتیبانی خودکار از متون فارسی و انگلیسی */
    .wp-rendered-content { line-height: 1.9; font-size: 0.95rem; color: #cbd5e1; direction: auto; text-align: start; }
    .wp-rendered-content h2 { font-size: 1.4rem; font-weight: 800; color: #38bdf8; margin-top: 1.75rem; margin-bottom: 0.85rem; border-inline-start: 4px solid #38bdf8; padding-inline-start: 0.65rem; direction: auto; text-align: start; }
    .wp-rendered-content h3 { font-size: 1.2rem; font-weight: 700; color: #7dd3fc; margin-top: 1.4rem; margin-bottom: 0.6rem; direction: auto; text-align: start; }
    .wp-rendered-content h4 { font-size: 1.05rem; font-weight: 600; color: #bae6fd; margin-top: 1.1rem; margin-bottom: 0.4rem; direction: auto; text-align: start; }
    .wp-rendered-content p { margin-bottom: 1.15rem; text-align: start; direction: auto; }
    .wp-rendered-content figure.wp-block-image { margin: 1.75rem 0; text-align: center; }
    .wp-rendered-content figure.wp-block-image img { border-radius: 0.75rem; max-width: 100%; height: auto; margin: 0 auto; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .wp-rendered-content figcaption { font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem; text-align: center; direction: auto; }
    .wp-rendered-content a { color: #38bdf8; text-decoration: underline; text-underline-offset: 3px; }
    .wp-rendered-content a:hover { color: #0284c7; }
    .wp-rendered-content blockquote.wp-block-quote { border-inline-start: 4px solid #6366f1; background: rgba(99, 102, 241, 0.08); padding: 0.85rem 1.15rem; border-radius: 0.5rem; margin: 1.35rem 0; color: #e2e8f0; font-style: italic; direction: auto; text-align: start; }
    .wp-rendered-content ul { list-style-type: disc; margin-inline-start: 1.6rem; margin-bottom: 1.15rem; direction: auto; text-align: start; }
    .wp-rendered-content ol { list-style-type: decimal; margin-inline-start: 1.6rem; margin-bottom: 1.15rem; direction: auto; text-align: start; }
    .wp-rendered-content li { margin-bottom: 0.4rem; direction: auto; text-align: start; }
    .wp-rendered-content figure.wp-block-table table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem; }
    .wp-rendered-content figure.wp-block-table th, .wp-rendered-content figure.wp-block-table td { border: 1px solid #334155; padding: 0.5rem 0.75rem; text-align: start; }
    .wp-rendered-content figure.wp-block-table th { background: rgba(30,41,59,0.7); color: #f1f5f9; }
  </style>
</head>
<body class="min-h-screen pb-20 selection:bg-cyan-500 selection:text-white">

  <!-- توست پیام عملیات -->
  <div id="toastMessage" class="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm shadow-2xl shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span id="toastText">با موفقیت انجام شد!</span>
  </div>

  <!-- هدر اصلی -->
  <header class="glass sticky top-0 z-40 px-4 sm:px-8 py-3.5 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              پروژه هزاردستان
            </h1>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">WP REST API v2</span>
          </div>
          <p class="text-[11px] text-slate-400">ورکر اول: شکارچی محتوا، استخراج داده‌های آشکار و نهان وردپرس و دیتابیس D1</p>
        </div>
      </div>

      <!-- دکمه‌های عملیات سریع هدر -->
      <div class="flex items-center gap-2 sm:gap-3 self-end sm:self-auto w-full sm:w-auto justify-end flex-wrap">
        <button onclick="openNewSourceModal()" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          منبع جدید
        </button>
        <button id="btnClearAndCrawl" onclick="clearAndReCrawl()" class="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-500 transition text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          پاکسازی و استخراج مجدد
        </button>
        <button id="btnRunCrawler" onclick="triggerManualCrawl()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 transition text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          پایش فوری (Crawler)
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">

    <!-- کارت‌های آمار و ارقام دیتابیس دیوان اول -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">کل منابع ثبت‌شده</div>
        <div id="statTotalSources" class="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">منابع فعال در حال رصد</div>
        <div id="statActiveSources" class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-cyan-500/10 rounded-full blur-xl"></div>
      </div>
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">مطالب کامل دیوان اول (D1)</div>
        <div id="statReadyArticles" class="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-emerald-500/10 rounded-full blur-xl"></div>
      </div>
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">موارد نیازمند بررسی (خطا)</div>
        <div id="statErrorArticles" class="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-rose-500/10 rounded-full blur-xl"></div>
      </div>
    </div>

    <!-- آزمایشگاه تست زنده استخراج با ۴ خروجی استاندارد وردپرس -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-100">آزمایشگاه تست زنده استخراج رسمی وردپرس (WP REST API)</h2>
            <p class="text-[11px] text-slate-400">استخراج داده‌های آشکار (عنوان، گوتنبرگ، عکس، نویسنده، دسته‌ها، برچسب‌ها) و نهان (سئو، اسکیما، متادیتا، FAQ)</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <!-- فرم تنظیمات و ورودی تست -->
        <div class="lg:col-span-5 space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">اتصال به منبع (جهت فراخوانی یا ذخیره قواعد):</label>
            <select id="testSourceSelect" onchange="loadSourceIntoTester()" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
              <option value="">-- حالت تست آزاد (بدون انتساب به منبع) --</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">لینک نمونه مقاله جهت تست (URL):</label>
            <input type="url" id="testUrl" placeholder="https://example.com/news/1234" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>

          <!-- تنظیم سلکتورهای استخراج (ساده، متمرکز، بدون کادرهای اضافی، با کنترل ۱۰۰٪ بر تمام عناصر) -->
          <div class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور تیتر خبر (Title):</label>
                <input type="text" id="testTitleSelector" value="h1, .entry-title, .post-title, .mkd-post-title, .jeg_post_title" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور کانتینر محتوا (Content):</label>
                <input type="text" id="testContentSelector" value=".mkd-post-text-inner, .mkd-post-text, .entry-content, .content-inner, .jeg_inner_content, .post-content, article" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">عناصر مزاحم و تبلیغاتی حذفی (Remove):</label>
              <input type="text" id="testRemoveSelectors" value=".code-block, [class*=&quot;code-block-&quot;], .vv-wrap, [class*=&quot;sponsored&quot;], .sponsored, .dc-vibe-inline, .user-sentiment-vote, .dc-newsletter-cta, .advertisement, .ads, .share, .comments" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
            </div>

            <!-- کشوی کنترل سایر عناصر (برچسب‌ها، نویسنده، عکس شاخص، دسته، تاریخ) بدون شلوغ کردن صفحه -->
            <details class="group bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all">
              <summary class="flex items-center justify-between px-3.5 py-2 cursor-pointer text-xs font-semibold text-slate-300 hover:text-cyan-400 select-none bg-slate-900/90">
                <span class="flex items-center gap-1.5 font-bold">
                  <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                  <span>سایر سلکتورها (برچسب‌ها، نویسنده، عکس شاخص، دسته، تاریخ)</span>
                </span>
                <span class="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div class="p-3 border-t border-slate-800/80 space-y-2.5 bg-slate-950/40">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور برچسب‌ها (Tags):</label>
                    <input type="text" id="testTagsSelector" value="a[href*=&quot;/tags/&quot;], a[href*=&quot;/tag/&quot;], .tags a, .tag a, .post-tags a, [rel=&quot;tag&quot;], .jeg_post_tags a" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور نویسنده (Author):</label>
                    <input type="text" id="testAuthorSelector" value="[rel=&quot;author&quot;], .author-name, .author, .byline, a[href*=&quot;/author/&quot;], .jeg_meta_author a, .jeg_author_name" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور تصویر شاخص (Featured Image):</label>
                    <input type="text" id="testImageSelector" value="meta[property=&quot;og:image&quot;], .featured-image img, article img, .entry-content img" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور دسته‌بندی (Category):</label>
                    <input type="text" id="testCategorySelector" value=".breadcrumb a, .post-category a, .entry-category a, a[href*=&quot;/category/&quot;], meta[property=&quot;article:section&quot;]" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور تاریخ انتشار (Date):</label>
                  <input type="text" id="testDateSelector" value="time[datetime], meta[property=&quot;article:published_time&quot;], .post-date, .entry-date" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                    سلکتورهای اختصاصی (Custom Selectors):
                    <span class="text-[10px] text-cyan-400 font-normal">کلید: سلکتور (برای روتیتر، منبع، قیمت، کد خبر و...)</span>
                  </label>
                  <textarea id="testCustomSelectors" rows="2" placeholder="روتیتر: .mkd-post-subtitle&#10;منبع: .source-url" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left custom-scroll"></textarea>
                </div>
              </div>
            </details>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <button id="btnRunTest" onclick="runLiveTest()" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 transition text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              تست در لحظه استخراج
            </button>
            <button id="btnSaveToSource" onclick="saveTesterFormulaToSource()" disabled class="px-4 py-2.5 bg-emerald-600/50 cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5">
              ذخیره روی منبع
            </button>
          </div>
        </div>

        <!-- جعبه چند زبانه پیش‌نمایش خروجی‌های ۴ گانه -->
        <div class="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-[460px]">
          <!-- هدر تب‌های آزمایشگاه -->
          <div class="flex items-center justify-between px-3 pt-2 bg-slate-900/80 border-b border-slate-800 flex-wrap gap-2">
            <div class="flex items-center space-x-1 space-x-reverse text-xs overflow-x-auto custom-scroll py-1">
              <button onclick="switchOutputTab('visual')" id="tabBtnVisual" class="px-3 py-1.5 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition whitespace-nowrap">
                <span>👁️</span> پیش‌نمایش وردپرس
              </button>
              <button onclick="switchOutputTab('html')" id="tabBtnHtml" class="px-3 py-1.5 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
                <span>🌐</span> کد HTML وردپرس
              </button>
              <button onclick="switchOutputTab('text')" id="tabBtnText" class="px-3 py-1.5 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
                <span>📄</span> متن تمیز
              </button>
              <button onclick="switchOutputTab('json')" id="tabBtnJson" class="px-3 py-1.5 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
                <span>⚙️</span> خروجی WP REST API JSON
              </button>
            </div>

            <button onclick="copyCurrentTabContent()" class="text-xs px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition font-medium flex items-center gap-1 shadow">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              کپی این تب
            </button>
          </div>

          <!-- وضعیت استخراج و متادیتاهای زنده -->
          <div class="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span id="testMetaStats">منتظر ثبت آدرس و کلیک روی دکمه تست...</span>
            <span id="testBadgeStatus" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">آماده</span>
          </div>

          <!-- محتوای ۴ تب -->
          <div class="flex-1 p-3 sm:p-4 overflow-y-auto custom-scroll relative max-h-[560px]">
            <!-- ۱. تب پیش‌نمایش زنده وردپرس -->
            <div id="tabContentVisual" class="space-y-4">
              <div class="text-center text-slate-500 py-24 text-xs">
                یک آدرس را در فیلد سمت راست وارد کرده و دکمه «تست در لحظه استخراج» را بزنید.
              </div>
            </div>

            <!-- ۲. تب کد HTML تمیز وردپرس -->
            <div id="tabContentHtml" class="hidden h-full flex flex-col">
              <textarea id="outputHtmlTextarea" class="w-full h-96 bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-y dir-ltr text-left" placeholder="کد HTML استاندارد وردپرس اینجا قرار می‌گیرد..."></textarea>
            </div>

            <!-- ۳. تب متن خالص و تمیز -->
            <div id="tabContentText" class="hidden h-full flex flex-col">
              <textarea id="outputTextTextarea" class="w-full h-96 bg-slate-900 text-slate-200 font-sans text-xs sm:text-sm p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-y leading-relaxed" placeholder="متن خالص و تمیز بدون هیچ تگی..."></textarea>
            </div>

            <!-- ۴. تب خروجی کامل JSON رسمی WP REST API -->
            <div id="tabContentJson" class="hidden h-full flex flex-col">
              <textarea id="outputJsonTextarea" class="w-full h-96 bg-slate-900 text-amber-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-y dir-ltr text-left" placeholder="ساختار رسمی /wp-json/wp/v2/posts اینجا قرار می‌گیرد..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- مدیریت منابع و وب‌سایت‌های خبری -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-100">منابع خبری و سایت‌های در حال رصد</h2>
          <p class="text-[11px] text-slate-400">فیدهای RSS و سلکتورهای استخراج تمیز هر رسانه</p>
        </div>
        <button onclick="openNewSourceModal()" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          + افزودن منبع
        </button>
      </div>

      <div class="mt-4 overflow-x-auto custom-scroll -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full text-right text-xs sm:text-sm divide-y divide-slate-800">
            <thead class="bg-slate-900/70 text-slate-400">
              <tr>
                <th class="px-3 sm:px-4 py-3">نام منبع</th>
                <th class="px-3 sm:px-4 py-3 hidden sm:table-cell">دسته‌بندی</th>
                <th class="px-3 sm:px-4 py-3">فید RSS</th>
                <th class="px-3 sm:px-4 py-3 text-center">وضعیت</th>
                <th class="px-3 sm:px-4 py-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody id="sourcesTableBody" class="divide-y divide-slate-800/60">
              <tr>
                <td colspan="5" class="text-center py-8 text-slate-500">در حال دریافت منابع...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- آخرین مطالب استخراج‌شده در دیوان اول با ساختار وردپرس -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-100">آخرین مطالب استخراج‌شده در دیوان اول (Cloudflare D1)</h2>
          <p class="text-[11px] text-slate-400">تمام مطالب با ساختار رسمی WP REST API، عکس‌های شاخص، نویسندگان، برچسب‌ها و سئو ذخیره شده‌اند.</p>
        </div>
        <button onclick="loadArticles()" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-end sm:self-auto">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          به‌روزرسانی جدول
        </button>
      </div>

      <div class="mt-4 overflow-x-auto custom-scroll -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full text-right text-xs sm:text-sm divide-y divide-slate-800">
            <thead class="bg-slate-900/70 text-slate-400">
              <tr>
                <th class="px-3 sm:px-4 py-3">ردیف</th>
                <th class="px-3 sm:px-4 py-3">منبع</th>
                <th class="px-3 sm:px-4 py-3">عنوان اصلی (تیتر)</th>
                <th class="px-3 sm:px-4 py-3 hidden md:table-cell">نویسنده</th>
                <th class="px-3 sm:px-4 py-3 hidden lg:table-cell">دسته و برچسب‌ها</th>
                <th class="px-3 sm:px-4 py-3 hidden sm:table-cell">تاریخ</th>
                <th class="px-3 sm:px-4 py-3 text-center">وضعیت</th>
                <th class="px-3 sm:px-4 py-3 text-center">خروجی‌ها</th>
              </tr>
            </thead>
            <tbody id="articlesTableBody" class="divide-y divide-slate-800/60">
              <tr>
                <td colspan="8" class="text-center py-8 text-slate-500">در حال بارگذاری مطالب...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <!-- مودال افزودن / ویرایش منبع -->
  <div id="sourceModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto custom-scroll">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 id="modalTitle" class="text-sm sm:text-base font-bold text-slate-100">افزودن منبع جدید</h3>
        <button onclick="closeSourceModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>

      <input type="hidden" id="modalSourceId">

      <div class="space-y-4">
        <!-- اطلاعات پایه منبع -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">نام منبع (Title):</label>
            <input type="text" id="modalName" placeholder="میهن بلاکچین" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">دسته‌بندی موضوعی:</label>
            <input type="text" id="modalCategory" value="فناوری" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">آدرس اصلی وب‌سایت (URL):</label>
            <input type="url" id="modalSiteUrl" placeholder="https://mihanblockchain.com/" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">آدرس فید RSS یا Atom:</label>
            <input type="url" id="modalRssUrl" placeholder="https://mihanblockchain.com/feed/" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>
        </div>

        <!-- تنظیم سلکتورهای استخراج وردپرس (طراحی خلوت و متمرکز، بدون کادرهای اضافی، با کنترل ۱۰۰٪ بر تمام عناصر) -->
        <div class="space-y-3 pt-1 border-t border-slate-800/80">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور تیتر خبر (Title):</label>
              <input type="text" id="modalTitleSelector" value="h1, .entry-title, .post-title, .mkd-post-title, .jeg_post_title" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور محتوا (Content):</label>
              <input type="text" id="modalContentSelector" value=".mkd-post-text-inner, .mkd-post-text, .entry-content, .content-inner, .jeg_inner_content, .post-content, article" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">عناصر مزاحم و تبلیغاتی حذفی (Remove):</label>
            <input type="text" id="modalRemoveSelectors" value=".code-block, [class*=&quot;code-block-&quot;], .vv-wrap, [class*=&quot;sponsored&quot;], .sponsored, .dc-vibe-inline, .user-sentiment-vote, .dc-newsletter-cta, .advertisement, .ads, .share, .comments" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>

          <!-- کشوی تنظیم سایر سلکتورها -->
          <details class="group bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden transition-all">
            <summary class="flex items-center justify-between px-3.5 py-2 cursor-pointer text-xs font-semibold text-slate-300 hover:text-cyan-400 select-none bg-slate-950/90">
              <span class="flex items-center gap-1.5 font-bold">
                <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                <span>سایر سلکتورها (برچسب‌ها، نویسنده، عکس شاخص، دسته، تاریخ)</span>
              </span>
              <span class="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div class="p-3 border-t border-slate-800/80 space-y-2.5 bg-slate-950">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور برچسب‌ها (Tags):</label>
                  <input type="text" id="modalTagsSelector" value="a[href*=&quot;/tags/&quot;], a[href*=&quot;/tag/&quot;], .tags a, .tag a, .post-tags a, [rel=&quot;tag&quot;], .jeg_post_tags a" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور نویسنده (Author):</label>
                  <input type="text" id="modalAuthorSelector" value="[rel=&quot;author&quot;], .author-name, .author, .byline, a[href*=&quot;/author/&quot;], .jeg_meta_author a, .jeg_author_name" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور تصویر شاخص (Featured Image):</label>
                  <input type="text" id="modalImageSelector" value="meta[property=&quot;og:image&quot;], .featured-image img, article img, .entry-content img" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور دسته‌بندی (Category):</label>
                  <input type="text" id="modalCategorySelector" value=".breadcrumb a, .post-category a, .entry-category a, a[href*=&quot;/category/&quot;], meta[property=&quot;article:section&quot;]" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">سلکتور تاریخ انتشار (Date):</label>
                <input type="text" id="modalDateSelector" value="time[datetime], meta[property=&quot;article:published_time&quot;], .post-date, .entry-date" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                  سلکتورهای اختصاصی (Custom Selectors):
                  <span class="text-[10px] text-cyan-400 font-normal">کلید: سلکتور (جهت استخراج داده‌های فرعی دلخواه روی این منبع)</span>
                </label>
                <textarea id="modalCustomSelectors" rows="2" placeholder="روتیتر: .mkd-post-subtitle&#10;منبع: .source-url" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-cyan-500 focus:outline-none dir-ltr text-left custom-scroll"></textarea>
              </div>
            </div>
          </details>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
        <button onclick="closeSourceModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium">انصراف</button>
        <button onclick="saveSourceModal()" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg">ذخیره منبع</button>
      </div>
    </div>
  </div>

  <!-- مودال نمایش کامل خروجی‌های مطلب انتخاب‌شده -->
  <div id="articleModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-6">
    <div class="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[92vh] overflow-hidden">
      
      <!-- هدر مودال -->
      <div class="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div class="min-w-0">
          <h3 id="modalArticleTitle" class="text-sm sm:text-base font-bold text-slate-100 truncate">تیتر مطلب</h3>
          <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span id="modalArticleMeta">منبع: --</span>
            <a id="modalArticleLink" href="#" target="_blank" class="text-cyan-400 hover:underline">مشاهده در سایت اصلی ↗</a>
          </div>
        </div>
        <button onclick="closeArticleModal()" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">&times;</button>
      </div>

      <!-- تب‌های مودال -->
      <div class="flex items-center justify-between px-4 pt-2 bg-slate-900 border-b border-slate-800 shrink-0 flex-wrap gap-2">
        <div class="flex items-center space-x-1 space-x-reverse text-xs overflow-x-auto custom-scroll py-1">
          <button onclick="switchModalTab('visual')" id="modalTabBtnVisual" class="px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition whitespace-nowrap">
            <span>👁️</span> پیش‌نمایش وردپرس
          </button>
          <button onclick="switchModalTab('html')" id="modalTabBtnHtml" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
            <span>🌐</span> کد HTML وردپرس
          </button>
          <button onclick="switchModalTab('text')" id="modalTabBtnText" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
            <span>📄</span> متن تمیز
          </button>
          <button onclick="switchModalTab('json')" id="modalTabBtnJson" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap">
            <span>⚙️</span> خروجی WP REST API JSON
          </button>
        </div>

        <button onclick="copyModalCurrentTab()" class="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition font-medium flex items-center gap-1 shadow">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          کپی محتوای این تب
        </button>
      </div>

      <!-- محتوای تب‌های مودال -->
      <div class="flex-1 overflow-hidden p-4 bg-slate-950">
        
        <div id="modalContentVisual" class="h-full overflow-y-auto custom-scroll p-2">
          <!-- رندر ساختار کامل وردپرس با تابع buildWordPressVisualHtml -->
        </div>

        <div id="modalContentHtml" class="h-full hidden flex flex-col">
          <textarea id="modalHtmlTextarea" class="w-full flex-1 bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none dir-ltr text-left"></textarea>
        </div>

        <div id="modalContentText" class="h-full hidden flex flex-col">
          <textarea id="modalTextTextarea" class="w-full flex-1 bg-slate-900 text-slate-200 font-sans text-xs sm:text-sm p-4 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none leading-relaxed"></textarea>
        </div>

        <div id="modalContentJson" class="h-full hidden flex flex-col">
          <textarea id="modalJsonTextarea" class="w-full flex-1 bg-slate-900 text-amber-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none dir-ltr text-left"></textarea>
        </div>

      </div>

    </div>
  </div>

  <script>
    let cachedSources = [];
    let cachedArticles = [];
    let activeOutputTab = 'visual';
    let activeModalTab = 'visual';
    let currentTestData = null;
    let currentModalArticle = null;

    document.addEventListener('DOMContentLoaded', () => {
      loadStats();
      loadSources();
      loadArticles();
    });

    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statTotalSources').innerText = data.totalSources || 0;
        document.getElementById('statActiveSources').innerText = data.activeSources || 0;
        document.getElementById('statReadyArticles').innerText = data.readyArticles || 0;
        document.getElementById('statErrorArticles').innerText = data.errorArticles || 0;
      } catch (e) {
        console.error('خطا در دریافت آمار:', e);
      }
    }

    async function loadSources() {
      try {
        const res = await fetch('/api/sources');
        cachedSources = await res.json();
        renderSourcesTable();
        populateTestSourceDropdown();
      } catch (e) {
        console.error('خطا در دریافت منابع:', e);
      }
    }

    function renderSourcesTable() {
      const tbody = document.getElementById('sourcesTableBody');
      if (cachedSources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">هیچ منبعی ثبت نشده است. از دکمه «منبع جدید» استفاده کنید.</td></tr>';
        return;
      }

      tbody.innerHTML = cachedSources.map(s => \`
        <tr class="hover:bg-slate-800/40 transition">
          <td class="px-3 sm:px-4 py-3 font-bold text-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full \${s.is_active ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
              \${escapeHtml(s.name)}
            </div>
            <a href="\${s.site_url}" target="_blank" class="text-[11px] text-cyan-400 font-mono hover:underline block truncate max-w-[180px] sm:max-w-xs">\${escapeHtml(s.site_url)}</a>
          </td>
          <td class="px-3 sm:px-4 py-3 text-slate-300 text-xs hidden sm:table-cell">
            <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px]">\${escapeHtml(s.category || 'عمومی')}</span>
          </td>
          <td class="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs max-w-[150px] sm:max-w-xs truncate">
            <a href="\${s.rss_url}" target="_blank" class="hover:text-cyan-300 transition">\${escapeHtml(s.rss_url)}</a>
          </td>
          <td class="px-3 sm:px-4 py-3 text-center">
            <button onclick="toggleSource(\${s.id}, \${s.is_active ? 0 : 1})" class="px-2.5 py-1 rounded-full text-xs font-semibold transition \${s.is_active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              \${s.is_active ? 'فعال ✓' : 'غیرفعال'}
            </button>
          </td>
          <td class="px-3 sm:px-4 py-3 text-center space-x-1 space-x-reverse whitespace-nowrap">
            <button onclick="sendToTester(\${s.id})" title="تست در آزمایشگاه" class="p-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 rounded-lg transition inline-block">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </button>
            <button onclick="editSource(\${s.id})" title="ویرایش منبع" class="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg transition inline-block">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            <button onclick="deleteSource(\${s.id})" title="حذف منبع" class="p-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 rounded-lg transition inline-block">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </td>
        </tr>
      \`).join('');
    }


    function populateTestSourceDropdown() {
      const select = document.getElementById('testSourceSelect');
      const curVal = select.value;
      select.innerHTML = '<option value="">-- حالت تست آزاد (بدون انتساب به منبع) --</option>' +
        cachedSources.map(s => \`<option value="\${s.id}">\${escapeHtml(s.name)} (\${escapeHtml(s.site_url)})</option>\`).join('');
      select.value = curVal;
    }

    async function toggleSource(id, newStatus) {
      try {
        await fetch(\`/api/sources/\${id}/toggle\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: newStatus })
        });
        loadSources();
        loadStats();
      } catch (e) {
        alert('خطا در تغییر وضعیت منبع');
      }
    }

    async function deleteSource(id) {
      if (!confirm('آیا از حذف این منبع و رکوردهای مرتبط با آن اطمینان دارید؟')) return;
      try {
        await fetch(\`/api/sources/\${id}\`, { method: 'DELETE' });
        loadSources();
        loadStats();
      } catch (e) {
        alert('خطا در حذف منبع');
      }
    }

    const DEFAULT_SELECTORS = {
      title_selector: 'h1, .entry-title, .post-title, .mkd-post-title, .jeg_post_title',
      content_selector: '.mkd-post-text-inner, .mkd-post-text, .entry-content, .content-inner, .jeg_inner_content, .post-content, article',
      tags_selector: '.mkd-single-tags-share-holder a, .post-tags a, .entry-tags a, .article-tags a, [rel="tag"], .tags-links a, .jeg_post_tags a, .tags a',
      author_selector: '[rel="author"], .author-name, .author, .byline, a[href*="/author/"], .jeg_meta_author a, .jeg_author_name',
      image_selector: 'meta[property="og:image"], .featured-image img, article img, .entry-content img',
      category_selector: '.breadcrumb a, .post-category a, .entry-category a, a[href*="/category/"], meta[property="article:section"]',
      date_selector: 'time[datetime], meta[property="article:published_time"], .post-date, .entry-date',
      remove_selectors: '.code-block, [class*="code-block-"], .vv-wrap, [class*="sponsored"], .sponsored, .dc-vibe-inline, .user-sentiment-vote, .dc-newsletter-cta, .advertisement, .ads, .share, .comments',
      custom_selectors: ''
    };

    function openNewSourceModal() {
      document.getElementById('modalTitle').innerText = 'افزودن منبع جدید';
      document.getElementById('modalSourceId').value = '';
      document.getElementById('modalName').value = '';
      document.getElementById('modalCategory').value = 'فناوری';
      document.getElementById('modalSiteUrl').value = '';
      document.getElementById('modalRssUrl').value = '';
      document.getElementById('modalTitleSelector').value = DEFAULT_SELECTORS.title_selector;
      document.getElementById('modalContentSelector').value = DEFAULT_SELECTORS.content_selector;
      document.getElementById('modalTagsSelector').value = DEFAULT_SELECTORS.tags_selector;
      document.getElementById('modalAuthorSelector').value = DEFAULT_SELECTORS.author_selector;
      document.getElementById('modalImageSelector').value = DEFAULT_SELECTORS.image_selector;
      document.getElementById('modalCategorySelector').value = DEFAULT_SELECTORS.category_selector;
      document.getElementById('modalDateSelector').value = DEFAULT_SELECTORS.date_selector;
      document.getElementById('modalRemoveSelectors').value = DEFAULT_SELECTORS.remove_selectors;
      document.getElementById('modalCustomSelectors').value = DEFAULT_SELECTORS.custom_selectors;
      document.getElementById('sourceModal').classList.remove('hidden');
    }

    function editSource(id) {
      const s = cachedSources.find(x => x.id === id);
      if (!s) return;
      document.getElementById('modalTitle').innerText = 'ویرایش منبع: ' + s.name;
      document.getElementById('modalSourceId').value = s.id;
      document.getElementById('modalName').value = s.name || '';
      document.getElementById('modalCategory').value = s.category || 'عمومی';
      document.getElementById('modalSiteUrl').value = s.site_url || '';
      document.getElementById('modalRssUrl').value = s.rss_url || '';
      document.getElementById('modalTitleSelector').value = s.title_selector || DEFAULT_SELECTORS.title_selector;
      document.getElementById('modalContentSelector').value = s.content_selector || DEFAULT_SELECTORS.content_selector;
      document.getElementById('modalTagsSelector').value = s.tags_selector || DEFAULT_SELECTORS.tags_selector;
      document.getElementById('modalAuthorSelector').value = s.author_selector || DEFAULT_SELECTORS.author_selector;
      document.getElementById('modalImageSelector').value = s.image_selector || DEFAULT_SELECTORS.image_selector;
      document.getElementById('modalCategorySelector').value = s.category_selector || DEFAULT_SELECTORS.category_selector;
      document.getElementById('modalDateSelector').value = s.date_selector || DEFAULT_SELECTORS.date_selector;
      document.getElementById('modalRemoveSelectors').value = s.remove_selectors || DEFAULT_SELECTORS.remove_selectors;
      document.getElementById('modalCustomSelectors').value = s.custom_selectors || DEFAULT_SELECTORS.custom_selectors;
      document.getElementById('sourceModal').classList.remove('hidden');
    }

    function closeSourceModal() {
      document.getElementById('sourceModal').classList.add('hidden');
    }

    async function saveSourceModal() {
      const id = document.getElementById('modalSourceId').value;
      const body = {
        name: document.getElementById('modalName').value.trim(),
        category: document.getElementById('modalCategory').value.trim(),
        site_url: document.getElementById('modalSiteUrl').value.trim(),
        rss_url: document.getElementById('modalRssUrl').value.trim(),
        title_selector: document.getElementById('modalTitleSelector').value.trim(),
        content_selector: document.getElementById('modalContentSelector').value.trim(),
        author_selector: document.getElementById('modalAuthorSelector').value.trim(),
        tags_selector: document.getElementById('modalTagsSelector').value.trim(),
        category_selector: document.getElementById('modalCategorySelector').value.trim(),
        image_selector: document.getElementById('modalImageSelector').value.trim(),
        date_selector: document.getElementById('modalDateSelector').value.trim(),
        remove_selectors: document.getElementById('modalRemoveSelectors').value.trim(),
        custom_selectors: document.getElementById('modalCustomSelectors').value.trim(),
      };

      if (!body.name || !body.site_url || !body.rss_url) {
        alert('لطفاً فیلدهای الزامی (نام، آدرس وب‌سایت و فید) را تکمیل کنید.');
        return;
      }

      try {
        if (id) {
          await fetch(\`/api/sources/\${id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
        } else {
          await fetch('/api/sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
        }
        closeSourceModal();
        loadSources();
        loadStats();
        showToast('منبع با تمامی سلکتورها ذخیره شد ✓');
      } catch (e) {
        alert('خطا در ذخیره منبع');
      }
    }

    function sendToTester(id) {
      const s = cachedSources.find(x => x.id === id);
      if (!s) return;
      document.getElementById('testSourceSelect').value = s.id;
      loadSourceIntoTester();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }

    function loadSourceIntoTester() {
      const selId = document.getElementById('testSourceSelect').value;
      const btnSave = document.getElementById('btnSaveToSource');
      if (!selId) {
        btnSave.disabled = true;
        btnSave.classList.add('opacity-50', 'cursor-not-allowed');
        return;
      }

      const s = cachedSources.find(x => String(x.id) === String(selId));
      if (s) {
        document.getElementById('testTitleSelector').value = s.title_selector || DEFAULT_SELECTORS.title_selector;
        document.getElementById('testContentSelector').value = s.content_selector || DEFAULT_SELECTORS.content_selector;
        document.getElementById('testTagsSelector').value = s.tags_selector || DEFAULT_SELECTORS.tags_selector;
        document.getElementById('testAuthorSelector').value = s.author_selector || DEFAULT_SELECTORS.author_selector;
        document.getElementById('testImageSelector').value = s.image_selector || DEFAULT_SELECTORS.image_selector;
        document.getElementById('testCategorySelector').value = s.category_selector || DEFAULT_SELECTORS.category_selector;
        document.getElementById('testDateSelector').value = s.date_selector || DEFAULT_SELECTORS.date_selector;
        document.getElementById('testRemoveSelectors').value = s.remove_selectors || DEFAULT_SELECTORS.remove_selectors;
        document.getElementById('testCustomSelectors').value = s.custom_selectors || DEFAULT_SELECTORS.custom_selectors;
        btnSave.disabled = false;
        btnSave.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    function switchOutputTab(tab) {
      activeOutputTab = tab;
      const tabs = ['visual', 'html', 'text', 'json'];
      tabs.forEach(t => {
        const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        const content = document.getElementById('tabContent' + t.charAt(0).toUpperCase() + t.slice(1));
        if (t === tab) {
          btn.className = 'px-3 py-1.5 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition whitespace-nowrap';
          content.classList.remove('hidden');
        } else {
          btn.className = 'px-3 py-1.5 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap';
          content.classList.add('hidden');
        }
      });
    }

    function copyCurrentTabContent() {
      let textToCopy = '';
      if (activeOutputTab === 'html') {
        textToCopy = document.getElementById('outputHtmlTextarea').value;
      } else if (activeOutputTab === 'text') {
        textToCopy = document.getElementById('outputTextTextarea').value;
      } else if (activeOutputTab === 'json') {
        textToCopy = document.getElementById('outputJsonTextarea').value;
      } else {
        textToCopy = document.getElementById('outputHtmlTextarea').value || document.getElementById('outputTextTextarea').value;
      }

      if (!textToCopy) {
        showToast('محتوایی برای کپی وجود ندارد', true);
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('محتوای تب در کلیپ‌بورد کپی شد ✓');
      });
    }

    // اجرای تست زنده استخراج
    async function runLiveTest() {
      const url = document.getElementById('testUrl').value.trim();
      if (!url) {
        alert('لطفاً آدرس یک لینک نمونه را وارد کنید.');
        return;
      }

      const visualBox = document.getElementById('tabContentVisual');
      const badge = document.getElementById('testBadgeStatus');
      const metaStats = document.getElementById('testMetaStats');
      const btnTest = document.getElementById('btnRunTest');

      badge.innerText = 'در حال استخراج...';
      badge.className = 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold';
      metaStats.innerText = 'در حال استخراج داده‌های آشکار (گوتنبرگ، تصاویر، نویسنده) و داده‌های نهان (سئو، اسکیما)...';
      btnTest.disabled = true;

      visualBox.innerHTML = '<div class="text-center text-slate-400 py-24 text-sm animate-pulse">در حال تحلیل کدهای HTML، ساختار گوتنبرگ، نویسنده، برچسب‌ها، اسکیما و سئو...</div>';

      try {
        const res = await fetch('/api/extract/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url,
            title_selector: document.getElementById('testTitleSelector').value.trim(),
            content_selector: document.getElementById('testContentSelector').value.trim(),
            author_selector: document.getElementById('testAuthorSelector').value.trim(),
            tags_selector: document.getElementById('testTagsSelector').value.trim(),
            category_selector: document.getElementById('testCategorySelector').value.trim(),
            image_selector: document.getElementById('testImageSelector').value.trim(),
            date_selector: document.getElementById('testDateSelector').value.trim(),
            remove_selectors: document.getElementById('testRemoveSelectors').value.trim(),
            custom_selectors: (document.getElementById('testCustomSelectors')?.value || '').trim()
          })
        });

        const data = await res.json();
        btnTest.disabled = false;

        if (data.success) {
          currentTestData = data;
          badge.innerText = 'استخراج موفق ✓';
          badge.className = 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold';

          const wp = data.wp_post || {};
          const wordCount = wp.stats?.word_count || 0;
          const authorName = wp.author?.name ? wp.author.name : '(بدون نویسنده)';
          const tagCount = wp.tags?.length || 0;
          const faqCount = wp.schema?.faq?.length || 0;
          const customCount = Object.keys(wp.custom_fields || {}).length;
          metaStats.innerText = \`نویسنده: \${authorName} | کلمات: \${wordCount} | برچسب‌ها: \${tagCount}\${customCount ? \` | فیلدهای اختصاصی: \${customCount}\` : ''} | سوالات متداول: \${faqCount}\`;

          // ۱. تب پیش‌نمایش بصری رسمی وردپرس
          visualBox.innerHTML = buildWordPressVisualHtml(wp, 'تست زنده', url);

          // ۲. تب HTML تمیز گوتنبرگ
          document.getElementById('outputHtmlTextarea').value = data.html_content;

          // ۳. تب متن تمیز
          document.getElementById('outputTextTextarea').value = data.cleaned_content;

          // ۴. تب ساختار کامل WP REST API JSON
          document.getElementById('outputJsonTextarea').value = JSON.stringify(wp, null, 2);

        } else {
          badge.innerText = 'خطا ✗';
          badge.className = 'px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold';
          metaStats.innerText = 'خطا در فرآیند استخراج محتوا';
          visualBox.innerHTML = \`
            <div class="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs sm:text-sm">
              <div class="font-bold mb-1">خطای استخراج:</div>
              <div>\${escapeHtml(data.error || 'عدم توانایی در دریافت محتوای صفحه')}</div>
            </div>
          \`;
        }
      } catch (err) {
        btnTest.disabled = false;
        badge.innerText = 'خطای شبکه';
        metaStats.innerText = 'عدم دریافت پاسخ از سرور ورکر';
        visualBox.innerHTML = '<div class="text-rose-400 p-4 text-xs">خطا در ارسال درخواست به ورکر.</div>';
      }
    }

    async function saveTesterFormulaToSource() {
      const selId = document.getElementById('testSourceSelect').value;
      if (!selId) return;

      const body = {
        title_selector: document.getElementById('testTitleSelector').value.trim(),
        content_selector: document.getElementById('testContentSelector').value.trim(),
        author_selector: document.getElementById('testAuthorSelector').value.trim(),
        tags_selector: document.getElementById('testTagsSelector').value.trim(),
        category_selector: document.getElementById('testCategorySelector').value.trim(),
        image_selector: document.getElementById('testImageSelector').value.trim(),
        date_selector: document.getElementById('testDateSelector').value.trim(),
        remove_selectors: document.getElementById('testRemoveSelectors').value.trim(),
        custom_selectors: (document.getElementById('testCustomSelectors')?.value || '').trim()
      };

      try {
        await fetch(\`/api/sources/\${selId}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        showToast('تمام سلکتورها بر روی منبع ذخیره شدند ✓');
        loadSources();
      } catch (e) {
        alert('خطا در ذخیره‌سازی سلکتورها بر روی منبع');
      }
    }

    // بارگذاری لیست مقالات دیوان اول
    async function loadArticles() {
      try {
        const res = await fetch('/api/articles?limit=50');
        cachedArticles = await res.json();
        renderArticlesTable();
      } catch (e) {
        console.error('خطا در بارگذاری مطالب:', e);
      }
    }

    function renderArticlesTable() {
      const tbody = document.getElementById('articlesTableBody');
      if (cachedArticles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-slate-500">هنوز مطلبی در دیوان اول ذخیره نشده است. دکمه «پایش فوری» یا «پاکسازی و استخراج مجدد» را بزنید.</td></tr>';
        return;
      }

      tbody.innerHTML = cachedArticles.map((a, idx) => {
        let tagList = [];
        try {
          tagList = JSON.parse(a.tags || '[]');
        } catch {
          if (a.tags) tagList = a.tags.split(',').map(t => t.trim());
        }

        return \`
          <tr class="hover:bg-slate-800/40 transition">
            <td class="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs">\${a.id || (idx + 1)}</td>
            <td class="px-3 sm:px-4 py-3 font-semibold text-slate-300 text-xs whitespace-nowrap">\${escapeHtml(a.source_name)}</td>
            <td class="px-3 sm:px-4 py-3 text-slate-100 font-medium max-w-[200px] sm:max-w-xs truncate">
              <a href="\${a.url}" target="_blank" class="hover:text-cyan-400 transition">\${escapeHtml(a.title || '(بدون تیتر)')}</a>
            </td>
            <td class="px-3 sm:px-4 py-3 text-slate-300 text-xs hidden md:table-cell whitespace-nowrap">
              <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                \${escapeHtml(a.author_name || 'هیئت تحریریه')}
              </span>
            </td>
            <td class="px-3 sm:px-4 py-3 text-xs hidden lg:table-cell max-w-[200px] truncate">
              <span class="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] ml-1">\${escapeHtml(a.category || 'عمومی')}</span>
              \${tagList.slice(0, 2).map(t => \`<span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] ml-1">#\${escapeHtml(t)}</span>\`).join('')}
              \${tagList.length > 2 ? \`<span class="text-[10px] text-slate-500">+\${tagList.length - 2}</span>\` : ''}
            </td>
            <td class="px-3 sm:px-4 py-3 text-slate-400 text-xs font-mono hidden sm:table-cell whitespace-nowrap">\${formatDate(a.published_at || a.scraped_at)}</td>
            <td class="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
              <span class="px-2 py-0.5 rounded-full text-[11px] font-bold \${a.status === 'آماده پردازش' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}">
                \${escapeHtml(a.status)}
              </span>
            </td>
            <td class="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
              <button onclick="viewArticleDetails(\${a.id})" class="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition flex items-center gap-1 mx-auto">
                <span>خروجی‌ها</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // باز کردن مودال مشاهده جزئیات کامل مقاله
    async function viewArticleDetails(id) {
      let a = cachedArticles.find(x => x.id === id);
      try {
        const res = await fetch(\`/api/articles/\${id}\`);
        if (res.ok) a = await res.json();
      } catch (e) {}

      if (!a) return;
      currentModalArticle = a;

      document.getElementById('modalArticleTitle').innerText = a.title || 'بدون تیتر';
      document.getElementById('modalArticleMeta').innerText = \`منبع: \${a.source_name} | نویسنده: \${a.author_name || 'هیئت تحریریه'} | وضعیت: \${a.status}\`;
      document.getElementById('modalArticleLink').href = a.url;

      let wp = null;
      try {
        wp = JSON.parse(a.json_content || '{}');
      } catch {
        wp = {};
      }

      // ۱. رندر تب بصری جامع وردپرس
      document.getElementById('modalContentVisual').innerHTML = buildWordPressVisualHtml(wp.title ? wp : {
        title: { rendered: a.title },
        author: { name: a.author_name || 'هیئت تحریریه' },
        category: a.category,
        date: a.published_at,
        featured_media: { source_url: a.featured_image, alt_text: a.title },
        content: { rendered: a.html_content || a.cleaned_content },
        excerpt: { rendered: a.excerpt },
        tags: wp.tags || (a.tags ? JSON.parse(a.tags) : []),
        schema: wp.schema || {},
        meta: wp.meta || {},
        slug: wp.slug || ''
      }, a.source_name, a.url);

      // ۲. تب HTML وردپرس
      document.getElementById('modalHtmlTextarea').value = a.html_content || (wp.content ? wp.content.rendered : '');

      // ۳. تب متن تمیز
      document.getElementById('modalTextTextarea').value = a.cleaned_content || wp.cleaned_text || '';
      
      // ۴. تب ساختار رسمی WP REST API JSON
      document.getElementById('modalJsonTextarea').value = JSON.stringify(wp, null, 2);

      switchModalTab('visual');
      document.getElementById('articleModal').classList.remove('hidden');
    }

    function closeArticleModal() {
      document.getElementById('articleModal').classList.add('hidden');
    }

    function switchModalTab(tab) {
      activeModalTab = tab;
      const tabs = ['visual', 'html', 'text', 'json'];
      tabs.forEach(t => {
        const btn = document.getElementById('modalTabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        const content = document.getElementById('modalContent' + t.charAt(0).toUpperCase() + t.slice(1));
        if (t === tab) {
          btn.className = 'px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition whitespace-nowrap';
          content.classList.remove('hidden');
        } else {
          btn.className = 'px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition whitespace-nowrap';
          content.classList.add('hidden');
        }
      });
    }

    function copyModalCurrentTab() {
      let textToCopy = '';
      if (activeModalTab === 'html') {
        textToCopy = document.getElementById('modalHtmlTextarea').value;
      } else if (activeModalTab === 'text') {
        textToCopy = document.getElementById('modalTextTextarea').value;
      } else if (activeModalTab === 'json') {
        textToCopy = document.getElementById('modalJsonTextarea').value;
      } else {
        textToCopy = document.getElementById('modalHtmlTextarea').value;
      }

      if (!textToCopy) {
        showToast('محتوایی برای کپی وجود ندارد', true);
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('محتوای تب در کلیپ‌بورد کپی شد ✓');
      });
    }

    // ساختار رندر بصری استاندارد وردپرس با تمام متادیتاها و اجزای آشکار و نهان
    function buildWordPressVisualHtml(wpPost, sourceName, fallbackUrl) {
      if (!wpPost) return '<div class="text-slate-500 p-8 text-center">محتوایی یافت نشد.</div>';

      const title = (wpPost.title && wpPost.title.rendered) || wpPost.title || '';
      const authorName = (wpPost.author && wpPost.author.name) || wpPost.author_name || '';
      const authorUrl = (wpPost.author && wpPost.author.url) || '#';
      const authorAvatar = (wpPost.author && wpPost.author.avatar) || '';
      const datePublished = wpPost.date || wpPost.published_at ? formatDate(wpPost.date || wpPost.published_at) : '';
      const dateModified = wpPost.modified && wpPost.modified !== wpPost.date ? formatDate(wpPost.modified) : '';
      const categories = Array.isArray(wpPost.categories) ? wpPost.categories : (wpPost.category ? [wpPost.category] : []);
      let tags = wpPost.tags || [];
      if (typeof tags === 'string') {
        try { tags = JSON.parse(tags); } catch { tags = tags.split(','); }
      }
      const featuredMedia = wpPost.featured_media || { source_url: wpPost.featured_image || '' };
      const contentHtml = (wpPost.content && wpPost.content.rendered) || wpPost.html_content || wpPost.cleaned_content || '';
      const readingTime = (wpPost.stats && wpPost.stats.reading_time_minutes) || Math.max(1, Math.ceil((wpPost.stats?.word_count || 120) / 200));
      const wordCount = (wpPost.stats && wpPost.stats.word_count) || (contentHtml.split(/\s+/).length);
      const faqs = (wpPost.schema && wpPost.schema.faq) || wpPost.faq || [];
      const seoMeta = wpPost.meta || wpPost.seo_meta || {};
      const customFields = wpPost.custom_fields || (wpPost.wp_post && wpPost.wp_post.custom_fields) || {};
      const slug = wpPost.slug || '';
      const canonical = (seoMeta && seoMeta.canonical_url) || wpPost.link || fallbackUrl || '#';

      return \`
        <div class="space-y-5 max-w-4xl mx-auto pb-6 text-start" dir="auto">

          \${categories && categories.length > 0 ? \`
          <!-- نوار دسته‌بندی‌ها -->
          <div class="flex flex-wrap items-center gap-1.5" dir="auto">
            <span class="text-[11px] font-bold text-slate-400 ml-1">دسته‌بندی‌ها:</span>
            \${categories.map(c => \`<span class="px-2.5 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold">\${escapeHtml(c)}</span>\`).join('')}
          </div>
          \` : ''}

          <!-- تیتر اصلی خبر -->
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug tracking-tight text-start" dir="auto">
            \${escapeHtml(title || '(بدون تیتر)')}
          </h1>

          <!-- نوار مشخصات نویسنده، تاریخ و زمان مطالعه -->
          <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <div class="flex items-center gap-2.5">
              \${authorName ? (authorAvatar ? \`<img src="\${escapeHtml(authorAvatar)}" class="w-8 h-8 rounded-full border border-slate-700 object-cover" alt="Author" />\` : \`
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                \${escapeHtml(authorName.charAt(0) || 'ن')}
              </div>\`) : \`
              <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
                —
              </div>
              \`}
              <div>
                <div class="font-bold text-slate-100 flex items-center gap-1">
                  <span>\${authorName ? \`نویسنده: \${escapeHtml(authorName)}\` : '<span class="text-slate-500 font-normal">بدون نویسنده</span>'}</span>
                  \${authorUrl && authorUrl !== '#' ? \`<a href="\${escapeHtml(authorUrl)}" target="_blank" class="text-cyan-400 hover:underline text-[10px]">(پروفایل ↗)</a>\` : ''}
                </div>
                \${datePublished ? \`
                <div class="text-[11px] text-slate-400 font-mono">
                  انتشار: \${datePublished}
                  \${dateModified ? \` | ویرایش: \${dateModified}\` : ''}
                </div>
                \` : '<div class="text-[11px] text-slate-500 font-mono">تاریخ انتشار ثبت نشده</div>'}
              </div>
            </div>

            <div class="flex items-center gap-3 text-[11px] font-mono text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                مطالعه: \${readingTime} دقیقه
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                \${wordCount} کلمه
              </span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans text-[10px]">
                منبع: \${escapeHtml(sourceName || 'اصلی')}
              </span>
            </div>
          </div>

          <!-- فیلدهای اختصاصی استخراج‌شده (Custom Fields) -->
          \${customFields && Object.keys(customFields).length > 0 ? \`
            <div class="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2.5 shadow-lg">
              <div class="text-xs font-bold text-cyan-300 flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>فیلدهای اختصاصی استخراج‌شده (Custom Fields):</span>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">\${Object.keys(customFields).length} مورد</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                \${Object.entries(customFields).map(([k, v]) => \`
                  <div class="p-3 rounded-lg bg-slate-800/90 border border-slate-700/80 flex flex-col gap-1">
                    <span class="text-cyan-400 font-bold text-[11px]">\${escapeHtml(k)}:</span>
                    <span class="text-slate-100 font-medium leading-relaxed">\${Array.isArray(v) ? v.map(item => escapeHtml(item)).join('، ') : escapeHtml(String(v))}</span>
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : ''}

          <!-- تصویر شاخص همراه با متن جایگزین و کپشن -->
          \${featuredMedia && featuredMedia.source_url ? \`
            <div class="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl">
              <div class="relative">
                <img src="\${escapeHtml(featuredMedia.source_url)}" class="w-full max-h-96 object-cover" alt="\${escapeHtml(featuredMedia.alt_text || title)}" />
                <span class="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur text-purple-300 border border-purple-500/30">
                  تصویر شاخص (Featured Image)
                </span>
              </div>
              <div class="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div class="text-slate-300 truncate max-w-md">
                  <span class="font-bold text-slate-400">متن جایگزین (Alt Text):</span>
                  <span class="text-slate-200">\${escapeHtml(featuredMedia.alt_text || title)}</span>
                </div>
                \${featuredMedia.caption ? \`
                <div class="text-slate-400 text-[11px] italic">
                  <span class="font-bold">کپشن:</span> \${escapeHtml(featuredMedia.caption)}
                </div>\` : ''}
              </div>
            </div>
          \` : ''}

          <!-- محتوای اصلی رندر شده با قالب گوتنبرگ وردپرس -->
          <div class="pt-2">
            <div class="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              محتوای ساختاریافته گوتنبرگ (Gutenberg Content):
            </div>
            <div class="wp-rendered-content bg-slate-900/70 p-5 sm:p-7 rounded-2xl border border-slate-800 text-start" dir="auto">
              \${contentHtml}
            </div>
          </div>

          <!-- سوالات متداول (FAQ) در صورت وجود -->
          \${faqs && faqs.length > 0 ? \`
            <div class="p-4 sm:p-5 rounded-2xl border border-sky-500/30 bg-sky-950/20 space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-sky-500/20">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                  <h3 class="text-sm sm:text-base font-bold text-sky-200">سوالات متداول (FAQ)</h3>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">FAQPage Schema (\${faqs.length})</span>
              </div>
              <div class="space-y-2">
                \${faqs.map((f, i) => \`
                  <details class="group p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <summary class="font-bold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                      <span>\${i + 1}. \${escapeHtml(f.question)}</span>
                      <span class="text-slate-400 transition group-open:rotate-180">▼</span>
                    </summary>
                    <p class="mt-2 text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60">\${escapeHtml(f.answer)}</p>
                  </details>
                \`).join('')}
              </div>
            </div>
          \` : ''}

          <!-- برچسب‌ها و کلمات کلیدی (Tags Cloud) -->
          \${tags && tags.length > 0 ? \`
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div class="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                برچسب‌ها و کلمات کلیدی (Tags):
              </div>
              <div class="flex flex-wrap gap-1.5">
                \${tags.map(t => \`<span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium cursor-default">#\${escapeHtml(t)}</span>\`).join('')}
              </div>
            </div>
          \` : ''}

          <!-- جعبه بازرسی سئو، داده‌های نهان و اسکیما (SEO & Meta Inspector) -->
          <details class="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 text-xs space-y-3">
            <summary class="font-bold text-slate-300 cursor-pointer flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>تحلیل داده‌های نهان، فنی و سئو (SEO Meta & Schema)</span>
              </div>
              <span class="text-cyan-400 text-xs">مشاهده جزئیات سئو و اسکیما ▼</span>
            </summary>

            <div class="pt-3 space-y-3 border-t border-slate-800">
              <!-- پیش‌نمایش در نتایج گوگل (Google SERP Preview) -->
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 mb-1">پیش‌نمایش در نتایج جستجوی گوگل (Google SERP Preview):</div>
                <div class="text-[11px] font-mono text-emerald-400 truncate dir-ltr text-left">\${escapeHtml(canonical)}</div>
                <div class="text-sm font-bold text-blue-400 hover:underline mt-0.5 truncate">\${escapeHtml(seoMeta.yoast_wpseo_title || title)}</div>
                <div class="text-xs text-slate-400 mt-1 line-clamp-2">\${escapeHtml(seoMeta.yoast_wpseo_metadesc || wpPost.excerpt?.rendered || 'بدون متا دیسکریپشن')}</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span class="text-slate-500 font-sans">نامک (Slug): </span>
                  <span class="text-cyan-300">\${escapeHtml(slug || 'default-slug')}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span class="text-slate-500 font-sans">نوع پست: </span>
                  <span class="text-amber-300">\${escapeHtml(wpPost.type || 'post')}</span> (وضعیت: \${escapeHtml(wpPost.status || 'publish')})
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">NewsArticle Schema ✓</span>
                <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold">OpenGraph Tags ✓</span>
                <span class="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-bold">Twitter Cards ✓</span>
                \${faqs.length > 0 ? \`<span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">FAQPage Schema ✓ (\${faqs.length})</span>\` : ''}
              </div>
            </div>
          </details>

        </div>
      \`;
    }

    // پاکسازی کامل دیتابیس دیوان اول و استخراج مجدد و تازه
    async function clearAndReCrawl() {
      if (!confirm('آیا از پاکسازی تمام رکوردهای قبلی و استخراج تازه و مجدد از فیدهای RSS اطمینان دارید؟\\n(مطالب قبلی حذف شده و فیدها با ساختار کامل وردپرس، عکس‌ها، تیترها، نویسندگان و برچسب‌ها از نو استخراج خواهند شد)')) return;
      
      const btn = document.getElementById('btnClearAndCrawl');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'در حال پاکسازی...';
      }

      try {
        const res = await fetch('/api/articles/clear', { method: 'POST' });
        const data = await res.json();
        showToast(data.message || 'دیوان اول پاکسازی شد ✓');
        await loadStats();
        await loadArticles();
        
        // اجرای خودکار پایش تازه
        await triggerManualCrawl();
      } catch (e) {
        alert('خطا در پاکسازی دیوان اول');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> پاکسازی و استخراج مجدد';
        }
      }
    }

    // پایش دستی فیدها
    async function triggerManualCrawl() {
      const btn = document.getElementById('btnRunCrawler');
      btn.disabled = true;
      btn.innerText = 'در حال پایش...';

      try {
        const res = await fetch('/api/crawler/run', { method: 'POST' });
        const data = await res.json();
        alert(\`پایش فیدها با موفقیت انجام شد!\\nمنابع پایش‌شده: \${data.processedSources}\\nمطالب جدید استخراج‌شده: \${data.newArticlesScraped}\\nرکوردهای تکراری نادیده‌گرفته‌شده: \${data.duplicatesSkipped}\\nخطاها: \${data.errorsCount}\`);
        loadStats();
        loadArticles();
      } catch (e) {
        alert('خطا در اجرای پایش');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> پایش فوری (Crawler)';
      }
    }

    function showToast(text, isError = false) {
      const toast = document.getElementById('toastMessage');
      const toastText = document.getElementById('toastText');
      toastText.innerText = text;
      toast.className = \`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-2xl flex items-center gap-2 transition-all duration-300 \${isError ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-emerald-500/30'}\`;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2500);
    }

    function formatDate(dateStr) {
      if (!dateStr) return '--';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateStr;
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m] || m));
    }
  </script>
</body>
</html>`;
}
