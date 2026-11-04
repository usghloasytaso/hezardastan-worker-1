export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>پروژه هزاردستان — ورکر اول: جمع‌آوری و استخراج وردپرس</title>
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

    /* استایل‌های استاندارد پیش‌نمایش محتوای وردپرس */
    .wp-rendered-content { line-height: 1.85; font-size: 0.95rem; color: #cbd5e1; }
    .wp-rendered-content h2 { font-size: 1.35rem; font-weight: 800; color: #38bdf8; margin-top: 1.5rem; margin-bottom: 0.75rem; border-right: 4px solid #38bdf8; padding-right: 0.5rem; }
    .wp-rendered-content h3 { font-size: 1.15rem; font-weight: 700; color: #7dd3fc; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    .wp-rendered-content p { margin-bottom: 1rem; text-align: justify; }
    .wp-rendered-content figure.wp-block-image { margin: 1.5rem 0; text-align: center; }
    .wp-rendered-content figure.wp-block-image img { border-radius: 0.75rem; max-width: 100%; height: auto; margin: 0 auto; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .wp-rendered-content figcaption { font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem; text-align: center; }
    .wp-rendered-content a { color: #38bdf8; text-decoration: underline; text-underline-offset: 3px; }
    .wp-rendered-content a:hover { color: #0284c7; }
    .wp-rendered-content blockquote { border-right: 4px solid #6366f1; background: rgba(99, 102, 241, 0.08); padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 1.25rem 0; color: #e2e8f0; font-style: italic; }
    .wp-rendered-content ul { list-style-type: disc; margin-right: 1.5rem; margin-bottom: 1rem; }
    .wp-rendered-content ol { list-style-type: decimal; margin-right: 1.5rem; margin-bottom: 1rem; }
    .wp-rendered-content li { margin-bottom: 0.35rem; }
  </style>
</head>
<body class="min-h-screen pb-20 selection:bg-cyan-500 selection:text-white">

  <!-- توست پیام کپی موفق -->
  <div id="toastMessage" class="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm shadow-2xl shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span id="toastText">با موفقیت کپی شد!</span>
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
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">نسخه وردپرس</span>
          </div>
          <p class="text-[11px] text-slate-400">ورکر اول: شکارچی، استخراج ساختاریافته محتوا و دیوان اول (D1)</p>
        </div>
      </div>

      <!-- دکمه‌های عملیات سریع -->
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
        <div class="text-[11px] text-slate-400 font-medium">منابع در حال پایش (فعال)</div>
        <div id="statActiveSources" class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-cyan-500/10 rounded-full blur-xl"></div>
      </div>
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">مطالب آماده پردازش (دیوان اول)</div>
        <div id="statReadyArticles" class="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-emerald-500/10 rounded-full blur-xl"></div>
      </div>
      <div class="glass-card p-4 rounded-2xl relative overflow-hidden">
        <div class="text-[11px] text-slate-400 font-medium">موارد نیازمند بررسی (خطا)</div>
        <div id="statErrorArticles" class="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1.5">--</div>
        <div class="absolute -left-2 -bottom-2 w-14 h-14 bg-rose-500/10 rounded-full blur-xl"></div>
      </div>
    </div>

    <!-- آزمایشگاه تست زنده و تزریق اسکریپت با خروجی‌های چندگانه وردپرس -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-100">آزمایشگاه تست زنده و موتور استخراج وردپرس</h2>
            <p class="text-[11px] text-slate-400">استخراج خودکار عکس‌های شاخص، تصاویر داخل متن، تیترهای H2 و H3، لینک‌ها و ساختار کامل وردپرس</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <!-- فرم تنظیمات و ورودی تست -->
        <div class="lg:col-span-5 space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">اتصال به منبع (جهت ذخیره):</label>
            <select id="testSourceSelect" onchange="loadSourceIntoTester()" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
              <option value="">-- حالت تست آزاد (بدون انتساب به منبع) --</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">لینک نمونه مقاله جهت تست (URL):</label>
            <input type="url" id="testUrl" placeholder="https://example.com/news/1234" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور تیتر (Title):</label>
              <input type="text" id="testTitleSelector" value="h1" placeholder="h1" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور محتوا (Content):</label>
              <input type="text" id="testContentSelector" value="article, .post-content, .entry-content" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">عناصر مزاحم حذفی (تبلیغات و کادرهای نامربوط):</label>
            <input type="text" id="testRemoveSelectors" value=".advertisement, .ads, .share, .tags, .comments" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
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

        <!-- باکس خروجی‌های چندگانه (پیش‌نمایش بصری، HTML وردپرس، متن تمیز، JSON) -->
        <div class="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
          
          <!-- نوارهای تب خروجی -->
          <div class="flex items-center justify-between px-3 pt-2 pb-0 bg-slate-900/80 border-b border-slate-800 flex-wrap gap-2">
            <div class="flex items-center space-x-1 space-x-reverse overflow-x-auto custom-scroll text-xs">
              <button onclick="switchOutputTab('visual')" id="tabBtnVisual" class="px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition">
                <span>👁️</span> پیش‌نمایش رندرشده
              </button>
              <button onclick="switchOutputTab('html')" id="tabBtnHtml" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
                <span>🌐</span> کد HTML وردپرس
              </button>
              <button onclick="switchOutputTab('text')" id="tabBtnText" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
                <span>📄</span> متن خالص
              </button>
              <button onclick="switchOutputTab('json')" id="tabBtnJson" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
                <span>⚙️</span> خروجی JSON
              </button>
            </div>

            <!-- دکمه کپی تب فعال -->
            <button id="btnCopyActiveTab" onclick="copyCurrentTabContent()" class="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              کپی خروجی
            </button>
          </div>

          <!-- بدنه تب‌ها -->
          <div class="flex-1 overflow-hidden relative p-3">
            
            <!-- تب ۱: پیش‌نمایش رندرشده بصری -->
            <div id="tabContentVisual" class="h-full overflow-y-auto custom-scroll p-3 space-y-4">
              <div class="text-center text-slate-500 py-24 text-xs sm:text-sm">
                لینک نمونه را وارد کرده و دکمه «تست در لحظه استخراج» را بزنید.
              </div>
            </div>

            <!-- تب ۲: کد HTML وردپرس (قابل ویرایش و کپی) -->
            <div id="tabContentHtml" class="h-full hidden flex flex-col">
              <textarea id="outputHtmlTextarea" class="w-full flex-1 bg-slate-900/90 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none dir-ltr text-left" placeholder="کد HTML وردپرس اینجا ظاهر می‌شود..."></textarea>
            </div>

            <!-- تب ۳: متن خالص بدون تگ (قابل ویرایش و کپی) -->
            <div id="tabContentText" class="h-full hidden flex flex-col">
              <textarea id="outputTextTextarea" class="w-full flex-1 bg-slate-900/90 text-slate-200 font-sans text-xs sm:text-sm p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none leading-relaxed" placeholder="متن تمیز و خالص بدون تگ اینجا ظاهر می‌شود..."></textarea>
            </div>

            <!-- تب ۴: خروجی کامل JSON (قابل ویرایش و کپی) -->
            <div id="tabContentJson" class="h-full hidden flex flex-col">
              <textarea id="outputJsonTextarea" class="w-full flex-1 bg-slate-900/90 text-amber-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none custom-scroll resize-none dir-ltr text-left" placeholder="خروجی ساخت‌یافته JSON اینجا ظاهر می‌شود..."></textarea>
            </div>

          </div>

          <!-- فوتر باکس پیش‌نمایش -->
          <div id="testFooterMeta" class="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span id="testMetaStats">وضعیت: آماده تست</span>
            <span id="testBadgeStatus" class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">آماده</span>
          </div>

        </div>
      </div>
    </section>

    <!-- مدیریت منابع و وب‌سایت‌های خبری -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-100">فهرست منابع و فیدهای پایش</h2>
          <p class="text-[11px] text-slate-400">منابع با سوییچ «فعال» به صورت خودکار توسط ترایگر Cron استخراج می‌شوند.</p>
        </div>
      </div>

      <div class="mt-4 overflow-x-auto custom-scroll -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full text-right text-xs sm:text-sm divide-y divide-slate-800">
            <thead class="bg-slate-900/70 text-slate-400">
              <tr>
                <th class="px-3 sm:px-4 py-3">شناسه</th>
                <th class="px-3 sm:px-4 py-3">نام منبع</th>
                <th class="px-3 sm:px-4 py-3 hidden sm:table-cell">دسته‌بندی</th>
                <th class="px-3 sm:px-4 py-3">فید RSS</th>
                <th class="px-3 sm:px-4 py-3 text-center">وضعیت</th>
                <th class="px-3 sm:px-4 py-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody id="sourcesTableBody" class="divide-y divide-slate-800/60">
              <tr>
                <td colspan="6" class="text-center py-8 text-slate-500">در حال دریافت منابع...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- آخرین مطالب استخراج‌شده در دیوان اول با پیش‌نمایش اختصاصی وردپرس -->
    <section class="glass rounded-2xl p-4 sm:p-6 border border-slate-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-100">آخرین مطالب استخراج‌شده در دیوان اول (D1)</h2>
          <p class="text-[11px] text-slate-400">مطالب موفق با وضعیت «آماده پردازش» ثبت شده و آماده ارسال به وردپرس یا ورکر دوم هستند.</p>
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
                <th class="px-3 sm:px-4 py-3 hidden md:table-cell">تاریخ</th>
                <th class="px-3 sm:px-4 py-3 text-center">وضعیت</th>
                <th class="px-3 sm:px-4 py-3 text-center">خروجی‌ها</th>
              </tr>
            </thead>
            <tbody id="articlesTableBody" class="divide-y divide-slate-800/60">
              <tr>
                <td colspan="6" class="text-center py-8 text-slate-500">در حال بارگذاری مطالب...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <!-- مودال افزودن / ویرایش منبع -->
  <div id="sourceModal" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-3.5">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 id="modalTitle" class="text-sm sm:text-base font-bold text-slate-100">افزودن منبع جدید</h3>
        <button onclick="closeSourceModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>

      <input type="hidden" id="modalSourceId">

      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">نام منبع:</label>
            <input type="text" id="modalName" placeholder="مثلاً: زومیت" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">دسته‌بندی:</label>
            <input type="text" id="modalCategory" value="فناوری" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">آدرس اصلی سایت (URL):</label>
          <input type="url" id="modalSiteUrl" placeholder="https://zoomit.ir" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">آدرس فید RSS:</label>
          <input type="url" id="modalRssUrl" placeholder="https://zoomit.ir/feed" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور تیتر:</label>
            <input type="text" id="modalTitleSelector" value="h1" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتور محتوا:</label>
            <input type="text" id="modalContentSelector" value="article, .post-content, .entry-content" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">سلکتورهای حذفی:</label>
          <input type="text" id="modalRemoveSelectors" value=".advertisement, .ads, .share, .tags, .comments" class="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none dir-ltr text-left">
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
    <div class="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
      
      <!-- هدر مودال -->
      <div class="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
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
        <div class="flex items-center space-x-1 space-x-reverse text-xs">
          <button onclick="switchModalTab('visual')" id="modalTabBtnVisual" class="px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition">
            <span>👁️</span> پیش‌نمایش وردپرس
          </button>
          <button onclick="switchModalTab('html')" id="modalTabBtnHtml" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
            <span>🌐</span> کد HTML وردپرس
          </button>
          <button onclick="switchModalTab('text')" id="modalTabBtnText" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
            <span>📄</span> متن خالص
          </button>
          <button onclick="switchModalTab('json')" id="modalTabBtnJson" class="px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
            <span>⚙️</span> ساختار JSON
          </button>
        </div>

        <button onclick="copyModalCurrentTab()" class="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition font-medium flex items-center gap-1 shadow">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          کپی محتوای این تب
        </button>
      </div>

      <!-- محتوای تب‌های مودال -->
      <div class="flex-1 overflow-hidden p-4 bg-slate-950">
        
        <div id="modalContentVisual" class="h-full overflow-y-auto custom-scroll p-2 space-y-4">
          <div id="modalFeaturedImageBox" class="hidden">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">تصویر شاخص (Featured Image)</span>
            <img id="modalFeaturedImage" src="" class="w-full max-h-80 object-cover rounded-xl border border-slate-800 shadow-xl mt-1.5" alt="Featured Image" />
          </div>
          <div id="modalRenderedBody" class="wp-rendered-content"></div>
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

    // اطلاعات آخرین استخراج تستی
    let currentTestData = {
      title: '',
      featured_image: '',
      html_content: '',
      cleaned_content: '',
      json_data: null
    };

    // اطلاعات مقاله بازشده در مودال
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
        updateSourceSelects();
      } catch (e) {
        console.error('خطا در بارگذاری منابع:', e);
      }
    }

    function renderSourcesTable() {
      const tbody = document.getElementById('sourcesTableBody');
      if (cachedSources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">هیچ منبعی ثبت نشده است. از دکمه «منبع جدید» اضافه کنید.</td></tr>';
        return;
      }

      tbody.innerHTML = cachedSources.map(s => \`
        <tr class="hover:bg-slate-800/40 transition">
          <td class="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs">\${s.id}</td>
          <td class="px-3 sm:px-4 py-3 font-semibold text-slate-200">
            <a href="\${s.site_url}" target="_blank" class="hover:text-cyan-400 transition">\${escapeHtml(s.name)}</a>
          </td>
          <td class="px-3 sm:px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">\${escapeHtml(s.category || 'عمومی')}</td>
          <td class="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs dir-ltr truncate max-w-[140px] sm:max-w-xs">
            <a href="\${s.rss_url}" target="_blank" class="hover:underline text-sky-400">\${escapeHtml(s.rss_url)}</a>
          </td>
          <td class="px-3 sm:px-4 py-3 text-center">
            <button onclick="toggleSource(\${s.id}, \${s.is_active ? 0 : 1})" class="px-2.5 py-1 rounded-full text-[11px] font-bold transition \${s.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              \${s.is_active ? 'فعال' : 'غیرفعال'}
            </button>
          </td>
          <td class="px-3 sm:px-4 py-3 text-center space-x-1 sm:space-x-2 space-x-reverse whitespace-nowrap">
            <button onclick="editSource(\${s.id})" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition">ویرایش</button>
            <button onclick="sendToTester(\${s.id})" class="px-2 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 rounded-lg text-xs transition">تست فرمول</button>
            <button onclick="deleteSource(\${s.id})" class="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 rounded-lg text-xs transition">حذف</button>
          </td>
        </tr>
      \`).join('');
    }

    function updateSourceSelects() {
      const select = document.getElementById('testSourceSelect');
      const curVal = select.value;
      select.innerHTML = '<option value="">-- حالت تست آزاد (بدون انتساب به منبع) --</option>' +
        cachedSources.map(s => \`<option value="\${s.id}">\${escapeHtml(s.name)} (\${s.site_url})</option>\`).join('');
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

    function openNewSourceModal() {
      document.getElementById('modalTitle').innerText = 'افزودن منبع جدید';
      document.getElementById('modalSourceId').value = '';
      document.getElementById('modalName').value = '';
      document.getElementById('modalCategory').value = 'فناوری';
      document.getElementById('modalSiteUrl').value = '';
      document.getElementById('modalRssUrl').value = '';
      document.getElementById('modalTitleSelector').value = 'h1';
      document.getElementById('modalContentSelector').value = 'article, .post-content, .entry-content';
      document.getElementById('modalRemoveSelectors').value = '.advertisement, .ads, .share, .tags, .comments';
      document.getElementById('sourceModal').classList.remove('hidden');
    }

    function editSource(id) {
      const s = cachedSources.find(x => x.id === id);
      if (!s) return;
      document.getElementById('modalTitle').innerText = 'ویرایش منبع: ' + s.name;
      document.getElementById('modalSourceId').value = s.id;
      document.getElementById('modalName').value = s.name;
      document.getElementById('modalCategory').value = s.category || 'عمومی';
      document.getElementById('modalSiteUrl').value = s.site_url;
      document.getElementById('modalRssUrl').value = s.rss_url;
      document.getElementById('modalTitleSelector').value = s.title_selector || 'h1';
      document.getElementById('modalContentSelector').value = s.content_selector || 'article';
      document.getElementById('modalRemoveSelectors').value = s.remove_selectors || '';
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
        remove_selectors: document.getElementById('modalRemoveSelectors').value.trim(),
      };

      if (!body.name || !body.site_url || !body.rss_url) {
        alert('لطفاً فیلدهای الزامی را تکمیل کنید.');
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
        showToast('منبع با موفقیت ذخیره شد');
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
        document.getElementById('testTitleSelector').value = s.title_selector || 'h1';
        document.getElementById('testContentSelector').value = s.content_selector || 'article';
        document.getElementById('testRemoveSelectors').value = s.remove_selectors || '';
        btnSave.disabled = false;
        btnSave.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    // تغییر تب‌های خروجی در آزمایشگاه
    function switchOutputTab(tab) {
      activeOutputTab = tab;
      const tabs = ['visual', 'html', 'text', 'json'];
      tabs.forEach(t => {
        const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        const content = document.getElementById('tabContent' + t.charAt(0).toUpperCase() + t.slice(1));
        if (t === tab) {
          btn.className = 'px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition';
          content.classList.remove('hidden');
        } else {
          btn.className = 'px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition';
          content.classList.add('hidden');
        }
      });
    }

    // کپی تب فعال در آزمایشگاه
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
        showToast('خروجی در کلیپ‌بورد کپی شد ✓');
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
      metaStats.innerText = 'در حال برقراری اتصال با سرور و استخراج ساختار وردپرس...';
      btnTest.disabled = true;

      visualBox.innerHTML = '<div class="text-center text-slate-400 py-24 text-sm animate-pulse">در حال تحلیل کدهای HTML، استخراج تصاویر، تیترها و استانداردسازی برای وردپرس...</div>';

      try {
        const res = await fetch('/api/extract/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url,
            title_selector: document.getElementById('testTitleSelector').value.trim(),
            content_selector: document.getElementById('testContentSelector').value.trim(),
            remove_selectors: document.getElementById('testRemoveSelectors').value.trim(),
          })
        });

        const data = await res.json();
        btnTest.disabled = false;

        if (data.success) {
          currentTestData = data;
          badge.innerText = 'استخراج موفق ✓';
          badge.className = 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold';

          const wordCount = data.json_data ? data.json_data.word_count : 0;
          const imgCount = data.json_data ? data.json_data.images.length : 0;
          const headingCount = data.json_data ? data.json_data.headings.length : 0;
          metaStats.innerText = \`تعداد کلمات: \${wordCount} | تصاویر: \${imgCount} | تیترهای H2/H3: \${headingCount}\`;

          // ۱. رندر تب بصری وردپرس
          let visualHtml = \`
            <div class="space-y-4">
              <div class="border-b border-slate-800 pb-3">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">تیتر اصلی (Title)</span>
                <h1 class="text-lg sm:text-xl font-extrabold text-white mt-1">\${escapeHtml(data.title)}</h1>
              </div>
          \`;

          if (data.featured_image) {
            visualHtml += \`
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">تصویر شاخص (Featured Image)</span>
                <img src="\${escapeHtml(data.featured_image)}" class="w-full max-h-72 object-cover rounded-xl border border-slate-800 mt-1.5 shadow-lg" alt="Featured Image" />
              </div>
            \`;
          }

          visualHtml += \`
              <div class="pt-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">محتوای رندرشده وردپرس (WordPress Content)</span>
                <div class="wp-rendered-content mt-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  \${data.html_content}
                </div>
              </div>
            </div>
          \`;
          visualBox.innerHTML = visualHtml;

          // ۲. پر کردن تب HTML وردپرس
          document.getElementById('outputHtmlTextarea').value = data.html_content;

          // ۳. پر کردن تب متن تمیز
          document.getElementById('outputTextTextarea').value = data.cleaned_content;

          // ۴. پر کردن تب ساختار کامل JSON
          document.getElementById('outputJsonTextarea').value = JSON.stringify(data.json_data || data, null, 2);

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
        remove_selectors: document.getElementById('testRemoveSelectors').value.trim(),
      };

      try {
        await fetch(\`/api/sources/\${selId}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        showToast('فرمول با موفقیت بر روی منبع ذخیره شد ✓');
        loadSources();
      } catch (e) {
        alert('خطا در ذخیره‌سازی اسکریپت');
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">هنوز مطلبی در دیوان اول ذخیره نشده است. دکمه «پایش فوری» را بزنید.</td></tr>';
        return;
      }

      tbody.innerHTML = cachedArticles.map((a, idx) => \`
        <tr class="hover:bg-slate-800/40 transition">
          <td class="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs">\${a.id || (idx + 1)}</td>
          <td class="px-3 sm:px-4 py-3 font-semibold text-slate-300 text-xs whitespace-nowrap">\${escapeHtml(a.source_name)}</td>
          <td class="px-3 sm:px-4 py-3 text-slate-100 font-medium max-w-[200px] sm:max-w-md truncate">
            <a href="\${a.url}" target="_blank" class="hover:text-cyan-400 transition">\${escapeHtml(a.title || '(بدون تیتر)')}</a>
          </td>
          <td class="px-3 sm:px-4 py-3 text-slate-400 text-xs font-mono hidden md:table-cell whitespace-nowrap">\${formatDate(a.scraped_at)}</td>
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
      \`).join('');
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
      document.getElementById('modalArticleMeta').innerText = \`منبع: \${a.source_name} | وضعیت: \${a.status}\`;
      document.getElementById('modalArticleLink').href = a.url;

      // نمایش تصویر شاخص
      const imgBox = document.getElementById('modalFeaturedImageBox');
      const imgEl = document.getElementById('modalFeaturedImage');
      if (a.featured_image) {
        imgEl.src = a.featured_image;
        imgBox.classList.remove('hidden');
      } else {
        imgBox.classList.add('hidden');
      }

      // محتوای بصری وردپرس
      const bodyHtml = a.html_content || a.cleaned_content || (a.error_message ? '<div class="text-rose-400">خطای ثبت‌شده: ' + escapeHtml(a.error_message) + '</div>' : 'بدون محتوا');
      document.getElementById('modalRenderedBody').innerHTML = bodyHtml;

      // تب‌های کد
      document.getElementById('modalHtmlTextarea').value = a.html_content || bodyHtml;
      document.getElementById('modalTextTextarea').value = a.cleaned_content || '';
      
      let parsedJson = '';
      try {
        parsedJson = JSON.stringify(JSON.parse(a.json_content || '{}'), null, 2);
      } catch {
        parsedJson = a.json_content || '{}';
      }
      document.getElementById('modalJsonTextarea').value = parsedJson;

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
          btn.className = 'px-3 py-2 font-bold border-b-2 border-cyan-400 text-cyan-300 flex items-center gap-1 transition';
          content.classList.remove('hidden');
        } else {
          btn.className = 'px-3 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1 transition';
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
        showToast('با موفقیت کپی شد ✓');
      });
    }

    // پاکسازی کامل دیتابیس دیوان اول و استخراج مجدد و تازه
    async function clearAndReCrawl() {
      if (!confirm('آیا از پاکسازی تمام رکوردهای قبلی و استخراج تازه و مجدد از فیدهای RSS اطمینان دارید؟\\n(مطالب قبلی حذف شده و فیدها با ساختار کامل وردپرس، عکس‌ها، تیترها و تگ‌های گوتنبرگ از نو استخراج خواهند شد)')) return;
      
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

    // پایش دستی
    async function triggerManualCrawl() {
      const btn = document.getElementById('btnRunCrawler');
      btn.disabled = true;
      btn.innerText = 'در حال پایش...';

      try {
        const res = await fetch('/api/crawler/run', { method: 'POST' });
        const data = await res.json();
        alert(\`پایش به پایان رسید!\\nمنابع بررسی‌شده: \${data.processedSources}\\nمطالب جدید استخراج‌شده: \${data.newArticlesScraped}\\nرکوردهای تکراری نادیده‌گرفته‌شده: \${data.duplicatesSkipped}\\nخطاها: \${data.errorsCount}\`);
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

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function formatDate(isoStr) {
      if (!isoStr) return '';
      try {
        const d = new Date(isoStr);
        return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('fa-IR');
      } catch {
        return isoStr;
      }
    }
  </script>
</body>
</html>`;
}
