const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'translations.json'), 'utf8'));
const landing = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'landing.json'), 'utf8'));
// Intentional display/order for footer links, generation and sitemap.
const PAGE_ORDER = ['laravel', 'vuejs', 'react', 'ai', 'python', 'symfony', 'yii', 'web-debrecen'];
landing.pages.sort((a, b) => {
  const ia = PAGE_ORDER.indexOf(a.id), ib = PAGE_ORDER.indexOf(b.id);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
});
// Monochrome brand icons (CC0 Simple Icons) inlined at build time, forced to currentColor.
const BRAND_ICONS = {};
{
  const iconsDir = path.join(__dirname, 'src', 'icons');
  if (fs.existsSync(iconsDir)) {
    fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg')).forEach(f => {
      const svg = fs.readFileSync(path.join(iconsDir, f), 'utf8')
        .replace(/<title>[\s\S]*?<\/title>/, '')
        .replace('<svg ', '<svg fill="currentColor" ')
        .trim();
      BRAND_ICONS[f.replace(/\.svg$/, '')] = svg;
    });
  }
}
// Language flags (MIT, lipis/flag-icons), inlined at build time — keeps their own colors
// (not forced to currentColor like the monochrome brand icons) so they render identically
// on every OS/browser, unlike the Unicode flag emoji they replace.
const LANG_FLAGS = {};
{
  const flagsDir = path.join(__dirname, 'src', 'flags');
  if (fs.existsSync(flagsDir)) {
    fs.readdirSync(flagsDir).filter(f => f.endsWith('.svg')).forEach(f => {
      const svg = fs.readFileSync(path.join(flagsDir, f), 'utf8')
        .replace(/\s+id="[^"]*"/, '')
        .replace('<svg ', '<svg class="flag-icon" aria-hidden="true" ')
        .trim();
      LANG_FLAGS[f.replace(/\.svg$/, '')] = svg;
    });
  }
}
// Header icon per landing page: brand icon where available, else a built-in line icon.
const LANDING_ICONS = {
  laravel: 'laravel', vuejs: 'vue', react: 'react', ai: 'ai',
  python: 'python', symfony: 'symfony', yii: 'yii', 'web-debrecen': 'mapPin'
};
function landingIcon(id) {
  const key = LANDING_ICONS[id] || 'code';
  return BRAND_ICONS[key] || icons[key] || icons.code;
}
const DIST = path.join(__dirname, 'dist');
const HAS_RESUME_PDF = fs.existsSync(path.join(__dirname, 'src', 'resume.pdf'));
const HAS_RESUME_HU_PDF = fs.existsSync(path.join(__dirname, 'src', 'resume-hu.pdf'));
const HAS_RESUME_JSON = fs.existsSync(path.join(__dirname, 'src', 'resume.json'));
const BUILD_DATE = new Date().toISOString().split('T')[0];
const YEAR = new Date().getFullYear();
const LANGUAGES = ['en', 'hu', 'de'];

function fileVersion(relPath) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return BUILD_DATE;
  const hash = crypto.createHash('sha1').update(fs.readFileSync(fullPath)).digest('hex');
  return hash.slice(0, 10);
}

const RESUME_PDF_VERSION = HAS_RESUME_PDF ? fileVersion('src/resume.pdf') : BUILD_DATE;
const RESUME_HU_PDF_VERSION = HAS_RESUME_HU_PDF ? fileVersion('src/resume-hu.pdf') : BUILD_DATE;
const RESUME_JSON_VERSION = HAS_RESUME_JSON ? fileVersion('src/resume.json') : BUILD_DATE;

// Ensure dist directories
[DIST, ...LANGUAGES.map(l => path.join(DIST, l)), path.join(DIST, 'img')].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// ─── SVG Icons ──────────────────────────────────────────────────────────────────
const icons = {
  sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  code: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  ai: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14h.01"/><path d="M8 14h.01"/><path d="M12 18v4"/><path d="M8 22h8"/><rect x="4" y="10" width="16" height="8" rx="2"/></svg>',
  mobile: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  consulting: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  research: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6"/><path d="M10 2v6.5L5 18a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9.5V2"/><line x1="7" y1="14" x2="17" y2="14"/></svg>',
  chevron: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  mapPin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  stackoverflow: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.725 0l-1.72 1.277 6.39 8.588 1.72-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.905-1.94-9.702-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154z"/></svg>',
  x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
};

// ─── CSS ────────────────────────────────────────────────────────────────────────
const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--bg-primary:#fafafa;--bg-secondary:#ffffff;--bg-tertiary:#f0f0f0;
--text-primary:#1a1a2e;--text-secondary:#4a4a6a;--text-muted:#5c5c7a;
--accent:#047857;--accent-hover:#065f46;--accent-subtle:rgba(4,120,87,0.1);
--border:#e2e2ee;--shadow:0 1px 3px rgba(0,0,0,0.06);--shadow-lg:0 8px 30px rgba(0,0,0,0.08);
--radius:10px;--nav-height:64px;
--font-heading:ui-rounded,'Avenir Next','Segoe UI',system-ui,-apple-system,Roboto,sans-serif;
--font-body:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
}
[data-theme="dark"]{
--bg-primary:#0f1117;--bg-secondary:#1a1d2e;--bg-tertiary:#232740;
--text-primary:#e8e8f0;--text-secondary:#a0a0c0;--text-muted:#8a8aaa;
--accent:#34d399;--accent-hover:#6ee7b7;--accent-subtle:rgba(52,211,153,0.1);
--border:#2a2d40;--shadow:0 1px 3px rgba(0,0,0,0.2);--shadow-lg:0 8px 30px rgba(0,0,0,0.3);
}
html{scroll-behavior:smooth;scroll-padding-top:var(--nav-height)}
body{font-family:var(--font-body);font-size:16px;line-height:1.7;color:var(--text-primary);background:var(--bg-primary);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:var(--accent);text-decoration:none;transition:color .2s}
a:hover{color:var(--accent-hover)}
img{max-width:100%;height:auto;display:block}
h1,h2,h3,h4{font-family:var(--font-heading);font-weight:700;letter-spacing:-0.03em;line-height:1.2;color:var(--text-primary)}
.skip-link{position:absolute;top:-100%;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:.5rem 1.5rem;border-radius:0 0 var(--radius) var(--radius);z-index:1000;font-weight:600;transition:top .2s}
.skip-link:focus{top:0}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-height);background:rgba(250,250,250,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);z-index:100;transition:transform .3s ease-out}
[data-theme="dark"] .nav{background:rgba(15,17,23,0.85)}
.nav.hidden{transform:translateY(-100%)}
.nav-inner{max-width:1100px;margin:0 auto;padding:0 2rem;height:100%;display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:var(--font-heading);font-size:1.35rem;font-weight:800;color:var(--text-primary);text-decoration:none}
.nav-logo span{color:var(--accent)}
.nav-links{display:none;list-style:none;gap:1.75rem;align-items:center}
.nav-links a{color:var(--text-secondary);font-size:.875rem;font-weight:500;transition:color .2s}
.nav-links a:hover{color:var(--accent)}
.nav-links a.active{color:var(--accent)}
.nav-right{display:flex;align-items:center;gap:.5rem}
.lang-switcher{display:flex;gap:2px;background:var(--bg-tertiary);border-radius:6px;padding:2px}
.lang-btn{padding:4px 10px;border:none;background:transparent;color:#374151;font-size:.75rem;font-weight:700;cursor:pointer;border-radius:4px;transition:all .2s;font-family:var(--font-body);display:flex;align-items:center;gap:4px}
[data-theme="dark"] .lang-btn{color:#cbd5e1}
.lang-btn.active{background:#065f46;color:#fff}
[data-theme="dark"] .lang-btn.active{background:#065f46}
.lang-btn:hover:not(.active){color:var(--text-primary);background:var(--accent-subtle)}
.flag-icon{width:16px;height:12px;border-radius:2px;flex-shrink:0;display:block}
.theme-toggle,.menu-toggle{background:none;border:none;color:var(--text-secondary);cursor:pointer;padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:color .2s,background .2s}
.theme-toggle:hover,.menu-toggle:hover{color:var(--accent);background:var(--accent-subtle)}
.theme-toggle .icon-sun{display:none}
[data-theme="dark"] .theme-toggle .icon-moon{display:none}
[data-theme="dark"] .theme-toggle .icon-sun{display:block}
.menu-toggle .icon-close{display:none}
.menu-toggle[aria-expanded="true"] .icon-menu{display:none}
.menu-toggle[aria-expanded="true"] .icon-close{display:block}
.menu-toggle{display:flex}

/* Mobile Menu */
.mobile-menu{position:fixed;inset:0;background:var(--bg-primary);z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}
.mobile-menu.open{opacity:1;visibility:visible}
.mobile-menu a{font-size:1.5rem;font-weight:600;color:var(--text-primary);font-family:var(--font-heading)}
.mobile-menu a:hover{color:var(--accent)}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:calc(var(--nav-height) + 3rem) 2rem 3rem;background:var(--bg-primary)}
.hero-inner{max-width:1100px;margin:0 auto;width:100%}
.hero-availability{display:inline-flex;align-items:center;gap:.5rem;padding:.375rem 1rem;background:var(--accent-subtle);border:1px solid var(--accent);border-radius:20px;font-size:.8rem;font-weight:600;color:var(--accent);margin-bottom:1.25rem}
[data-theme="dark"] .hero-availability{color:var(--accent);background:var(--accent-subtle);border-color:var(--accent)}
.hero-availability::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.hero-greeting{font-size:1.125rem;color:var(--text-muted);margin-bottom:.5rem;font-weight:500}
.hero h1{font-size:clamp(2.5rem,6vw,4rem);margin-bottom:.75rem}
.hero-title{font-size:clamp(1.125rem,3vw,1.5rem);color:var(--accent);font-weight:600;margin-bottom:1.5rem;font-family:var(--font-heading)}
.hero-desc{font-size:1.125rem;color:var(--text-secondary);max-width:600px;margin-bottom:2rem;line-height:1.8}
.hero-buttons{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
.hero-cv-links{display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center;margin-bottom:3rem}
.hero-cv-links a{font-size:.85rem;color:var(--text-muted);font-weight:500;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--border)}
.hero-cv-links a:hover{color:var(--accent);text-decoration-color:var(--accent)}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;border-radius:var(--radius);font-weight:600;font-size:.95rem;transition:all .2s ease-out;border:none;cursor:pointer;font-family:var(--font-body);text-decoration:none}
.btn:disabled{cursor:not-allowed;opacity:.65;transform:none;box-shadow:none}
.btn-primary{background:#065f46;color:#fff}
.btn-primary:hover{background:#064e3b;color:#fff;transform:translateY(-1px);box-shadow:0 4px 12px rgba(6,95,70,0.35)}
[data-theme="dark"] .btn-primary{background:#065f46}
[data-theme="dark"] .btn-primary:hover{background:#064e3b;box-shadow:0 4px 12px rgba(6,95,70,0.35)}
.btn-outline{background:transparent;color:var(--text-primary);border:1.5px solid var(--border)}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.hero .btn-outline{background:var(--bg-secondary)}
[data-theme="dark"] .hero .btn-outline{background:var(--bg-secondary)}
.hero-stats{display:flex;gap:2rem;flex-wrap:wrap}
.hero-stat{font-size:.9rem;color:var(--text-muted);font-weight:500;padding-left:1rem;border-left:2px solid var(--accent)}
.hero-content{min-width:0}
.hero-visual{display:none}
.code-card{background:#0d1117;border:1px solid #1f2430;border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.35);overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.code-bar{display:flex;align-items:center;gap:.45rem;padding:.7rem 1rem;background:#161b22;border-bottom:1px solid #1f2430}
.code-dot{width:11px;height:11px;border-radius:50%;display:inline-block}
.code-dot.r{background:#ff5f56}.code-dot.y{background:#ffbd2e}.code-dot.g{background:#27c93f}
.code-file{margin-left:.4rem;color:#8b949e;font-size:.78rem}
.code-body{margin:0;padding:1.1rem 1.25rem;font-size:.82rem;line-height:1.7;color:#e6edf3;overflow-x:auto}
.code-body .cl{display:block;white-space:nowrap}
.code-body .ind{padding-left:1.7em}
.code-body .ind2{padding-left:3.4em}
.code-body .tok-key{color:#ff7b72}
[data-theme="dark"] .code-card{background:#1a2030;border-color:#323d54}
[data-theme="dark"] .code-bar{background:#232c40;border-bottom-color:#323d54}
.code-body .tok-com{color:#8b949e}.code-body .tok-str{color:#7ee787}.code-body .tok-fn{color:#d2a8ff}.code-body .tok-num{color:#79c0ff}.code-body .tok-cls{color:#ffa657}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.fade-up{opacity:1;transform:none}
.fade-up.js-animate{opacity:0;transform:translateY(24px);transition:opacity .6s ease-out,transform .6s ease-out}
.fade-up.js-animate.visible{opacity:1;transform:translateY(0)}
.hero .fade-up{animation:fadeUp .7s ease-out forwards;opacity:0}
.hero .fade-up:nth-child(1){animation-delay:0s}
.hero .fade-up:nth-child(2){animation-delay:.1s}
.hero .fade-up:nth-child(3){animation-delay:.15s}
.hero .fade-up:nth-child(4){animation-delay:.25s}
.hero .fade-up:nth-child(5){animation-delay:.35s}
.hero .fade-up:nth-child(6){animation-delay:.45s}
.hero .fade-up:nth-child(7){animation-delay:.55s}
.hero .fade-up:nth-child(8){animation-delay:.65s}

/* SECTIONS */
.section{padding:5rem 2rem}
.section:nth-child(odd){background:var(--bg-primary)}
.section:nth-child(even){background:var(--bg-secondary)}
.section-inner{max-width:1100px;margin:0 auto}
.section-label{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);margin-bottom:.5rem}
.section-title{font-size:clamp(1.75rem,4vw,2.5rem);margin-bottom:1rem}
.section-title+p{color:var(--text-secondary);max-width:600px;margin-bottom:3rem}

/* ABOUT */
.about-grid{display:grid;gap:2.5rem;align-items:start}
.about-photo{width:180px;height:180px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);box-shadow:var(--shadow-lg);margin:0 auto}
.about-text{display:flex;flex-direction:column;gap:1.25rem}
.about-text p{color:var(--text-secondary);font-size:1.05rem}

/* SERVICES */
.services-grid{display:grid;gap:1.5rem}
.service-card{background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:transform .2s ease-out,box-shadow .2s ease-out}
.service-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.service-icon{color:var(--accent);margin-bottom:1rem}
.service-card h3{font-size:1.15rem;margin-bottom:.75rem}
.service-card p{color:var(--text-secondary);font-size:.95rem;line-height:1.7}

/* TECH STACK */
.tech-categories{display:flex;flex-direction:column;gap:2rem}
.tech-category h3{font-size:1rem;color:var(--text-muted);font-weight:600;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.05em;font-size:.85rem}
.tech-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.tech-tag{padding:.4rem 1rem;background:var(--accent-subtle);color:var(--accent);border-radius:20px;font-size:.85rem;font-weight:500;border:1px solid transparent;transition:all .2s}
.tech-tag:hover{border-color:var(--accent);background:var(--accent);color:#fff}

/* TIMELINE */
.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:5px;top:8px;bottom:8px;width:2px;background:var(--border)}
.timeline-item{position:relative;padding-bottom:2.5rem}
.timeline-item:last-child{padding-bottom:0}
.timeline-dot{position:absolute;left:-2rem;top:6px;width:12px;height:12px;border-radius:50%;background:var(--accent);border:2px solid var(--bg-primary);z-index:1}
.timeline-period{font-size:.85rem;font-weight:600;color:var(--accent);margin-bottom:.25rem}
.timeline-role{font-size:1.1rem;font-weight:700;margin-bottom:.15rem;font-family:var(--font-heading)}
.timeline-company{font-size:.9rem;color:var(--text-muted);margin-bottom:.5rem}
.timeline-desc{color:var(--text-secondary);font-size:.95rem}

/* TESTIMONIALS */
.testimonials-grid{display:grid;gap:1.5rem}
.testimonial-card{background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;position:relative;transition:transform .22s ease-out,box-shadow .22s ease-out,border-color .22s ease-out}
.testimonial-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);border-color:var(--accent)}
.testimonial-card::before{content:'\\201C';position:absolute;top:.5rem;left:1.25rem;font-size:4rem;color:var(--accent);opacity:.38;font-family:Georgia,serif;line-height:1}
[data-theme="dark"] .testimonial-card::before{color:var(--accent-hover);opacity:.7}
.testimonial-quote{font-style:italic;color:var(--text-secondary);margin-bottom:1.25rem;padding-top:1.5rem;line-height:1.8;font-size:1rem}
.testimonial-author{font-weight:700;font-size:.95rem;font-family:var(--font-heading)}
.testimonial-company{font-size:.85rem;color:var(--text-muted)}

/* FAQ */
.faq-list{display:flex;flex-direction:column;gap:.75rem;max-width:800px}
.faq-item{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:border-color .2s}
.faq-item.active{border-color:var(--accent)}
.faq-btn{width:100%;padding:1.25rem 1.5rem;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;font-size:1rem;font-weight:600;color:var(--text-primary);font-family:var(--font-heading);text-align:left}
.faq-btn:hover{color:var(--accent)}
.faq-btn svg{flex-shrink:0;transition:transform .3s;color:var(--text-muted)}
.faq-item.active .faq-btn svg{transform:rotate(180deg);color:var(--accent)}
.faq-answer{max-height:0;overflow:hidden;transition:max-height .3s ease-out}
.faq-answer-inner{padding:0 1.5rem 1.25rem;color:var(--text-secondary);line-height:1.8}

/* CONTACT */
.contact-grid{display:grid;gap:3rem}
.contact-form{display:flex;flex-direction:column;gap:1rem}
.form-group label{display:block;font-size:.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:.375rem}
.form-group input,.form-group textarea{width:100%;padding:.875rem 1rem;background:var(--bg-tertiary);border:1.5px solid var(--border);border-radius:8px;color:var(--text-primary);font-size:.95rem;font-family:var(--font-body);transition:border-color .2s;outline:none}
.form-group input:focus,.form-group textarea:focus{border-color:var(--accent)}
.form-group textarea{resize:vertical;min-height:140px}
.form-status{padding:1rem;border-radius:8px;font-size:.9rem;display:none}
.form-status.success{display:block;background:var(--accent-subtle);color:var(--accent);border:1px solid var(--accent)}
.form-status.error{display:block;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2)}
.ohnohoney{position:absolute;left:-9999px}
.contact-info{display:flex;flex-direction:column;gap:1.5rem}
.contact-info-item{display:flex;align-items:flex-start;gap:.75rem}
.contact-info-icon{color:var(--accent);flex-shrink:0;margin-top:2px}
.contact-info-label{font-size:.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600}
.contact-info-value{color:var(--text-primary);font-weight:500}
.contact-notice{background:var(--accent-subtle);border:1px solid var(--accent);border-left-width:4px;border-radius:var(--radius);padding:1rem 1.25rem;margin-bottom:2.5rem;max-width:760px;color:var(--text-secondary);line-height:1.7;font-size:.95rem}
.social-links{display:flex;gap:.75rem;margin-top:.5rem}
.social-link{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;color:var(--text-secondary);border:1px solid var(--border);transition:all .2s}
.social-link:hover{color:var(--accent);border-color:var(--accent);background:var(--accent-subtle);transform:translateY(-1px)}

/* FOOTER */
.footer{padding:2rem;text-align:center;border-top:1px solid var(--border);background:var(--bg-secondary)}
.footer p{font-size:.85rem;color:var(--text-muted)}
.footer p+p{margin-top:.25rem;font-size:.8rem}
.footer-services{display:flex;flex-wrap:wrap;gap:.4rem 1.25rem;justify-content:center;margin-bottom:1.25rem}
.footer-services a{font-size:.85rem;color:var(--text-muted);font-weight:500}
.footer-services a:hover{color:var(--accent)}
.lp-hero{padding:calc(var(--nav-height) + 3.5rem) 2rem 2.5rem;background:var(--bg-primary)}
.lp-inner{max-width:820px;margin:0 auto;position:relative}
.lp-crumbs{font-size:.85rem;color:var(--text-muted);margin-bottom:1.25rem}
.lp-crumbs a{color:var(--text-muted)}
.lp-crumbs a:hover{color:var(--accent)}
.lp-corner-icon{position:absolute;top:0;right:0;color:var(--accent);line-height:0}
.lp-corner-icon svg{width:72px;height:72px;display:block}
@media(max-width:600px){.lp-corner-icon svg{width:48px;height:48px}}
.lp-hero h1{font-size:clamp(2rem,5vw,3rem);margin:.25rem 0 1rem}
.lp-lead{font-size:1.15rem;color:var(--text-secondary);line-height:1.8;margin-bottom:1.25rem}
.lp-hero p{color:var(--text-secondary);line-height:1.8}
.lp-actions{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem}
.lp-section h2{font-size:clamp(1.4rem,3vw,1.9rem);margin-bottom:1.5rem}
.lp-section p{color:var(--text-secondary);line-height:1.8;max-width:720px}
.lp-list{list-style:none;display:grid;gap:.85rem;max-width:720px}
.lp-list li{position:relative;padding-left:1.85rem;color:var(--text-secondary);line-height:1.6}
.lp-list li::before{content:'✓';position:absolute;left:0;top:0;color:var(--accent);font-weight:700}
.lp-faq{display:flex;flex-direction:column;gap:1.5rem;max-width:720px;margin-top:1rem}
.lp-faq h3{font-size:1.05rem;margin-bottom:.4rem}
.lp-faq p{color:var(--text-secondary);line-height:1.7}
.lp-related{display:flex;flex-wrap:wrap;gap:.75rem}
.lp-related a{display:inline-flex;padding:.6rem 1.1rem;border:1px solid var(--border);border-radius:20px;font-size:.9rem;font-weight:500;color:var(--text-secondary);transition:all .2s}
.lp-related a:hover{border-color:var(--accent);color:var(--accent)}

/* Focus styles */
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* A11y: reduced motion */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}
  .fade-up,.fade-up.js-animate{opacity:1;transform:none}
  .hero .fade-up{animation:none;opacity:1}
}
/* A11y: high contrast */
@media(forced-colors:active){
  .btn-primary,.lang-btn.active{border:2px solid ButtonText}
  .service-card,.testimonial-card,.faq-item{border:2px solid ButtonText}
  .timeline-dot{forced-color-adjust:none}
}

/* Responsive */
@media(max-width:479px){
  .nav .lang-switcher{display:none}
  .hero-buttons{flex-direction:column}
  .hero-buttons .btn{width:100%;justify-content:center}
}
@media(min-width:600px){
  .services-grid,.testimonials-grid{grid-template-columns:repeat(2,1fr)}
  .contact-grid{grid-template-columns:1fr 1fr}
  .about-grid{grid-template-columns:180px 1fr}
  .about-photo{margin:0}
}
@media(min-width:900px){
  .nav-links{display:flex}
  .menu-toggle{display:none}
  .hero h1{font-size:3.5rem}
  .section{padding:6rem 2rem}
  .hero-inner{display:grid;grid-template-columns:1fr minmax(360px,430px);gap:3rem;align-items:center}
  .hero-visual{display:block;animation:fadeUp .7s ease-out .4s both}
}
`;

// ─── JS ─────────────────────────────────────────────────────────────────────────
const js = `
(function(){
  // Theme toggle
  var tt=document.getElementById('theme-toggle');
  function syncThemeButton(){if(tt)tt.setAttribute('aria-pressed',document.documentElement.getAttribute('data-theme')==='dark'?'true':'false');}
  syncThemeButton();
  if(tt)tt.addEventListener('click',function(){
    var d=document.documentElement,t=d.getAttribute('data-theme')==='dark'?'light':'dark';
    d.setAttribute('data-theme',t);localStorage.setItem('theme',t);syncThemeButton();
  });

  // Mobile menu
  var mb=document.getElementById('menu-toggle'),mm=document.getElementById('mobile-menu');
  function setMenu(open){
    if(!mb||!mm)return;
    mm.classList.toggle('open',open);
    mm.setAttribute('aria-hidden',open?'false':'true');
    mb.setAttribute('aria-expanded',open?'true':'false');
    mb.setAttribute('aria-label',open?mb.getAttribute('data-close-label'):mb.getAttribute('data-open-label'));
    document.body.style.overflow=open?'hidden':'';
    if(open){var first=mm.querySelector('a');if(first)first.focus();}
    else if(document.activeElement&&mm.contains(document.activeElement))mb.focus();
  }
  function closeMenu(){setMenu(false);}
  if(mb)mb.addEventListener('click',function(){setMenu(!mm.classList.contains('open'));});
  if(mm)mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){
    if(!mm||!mm.classList.contains('open'))return;
    if(e.key==='Escape'){closeMenu();return;}
    if(e.key==='Tab'){
      var focusable=mm.querySelectorAll('a[href]');if(!focusable.length)return;
      var first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.addEventListener('resize',function(){if(window.innerWidth>=900&&mm&&mm.classList.contains('open'))closeMenu();});

  // Highlight the section currently in view
  var sectionLinks=document.querySelectorAll('.nav-links a[href^="#"]');
  if('IntersectionObserver'in window&&sectionLinks.length){
    var sectionMap={};sectionLinks.forEach(function(a){sectionMap[a.getAttribute('href').slice(1)]=a;});
    var navObs=new IntersectionObserver(function(entries){entries.forEach(function(e){
      if(e.isIntersecting){sectionLinks.forEach(function(a){a.classList.remove('active');a.removeAttribute('aria-current');});
      var link=sectionMap[e.target.id];if(link){link.classList.add('active');link.setAttribute('aria-current','location');}}
    });},{rootMargin:'-35% 0px -55% 0px'});
    Object.keys(sectionMap).forEach(function(id){var section=document.getElementById(id);if(section)navObs.observe(section);});
  }

  // Nav hide/show on scroll
  var nav=document.querySelector('.nav'),lastY=0,ticking=false;
  window.addEventListener('scroll',function(){
    if(!ticking){window.requestAnimationFrame(function(){
      var y=window.scrollY;
      if(y>lastY&&y>100)nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      lastY=y;ticking=false;
    });ticking=true;}
  });

  // FAQ accordion
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.parentElement,answer=item.querySelector('.faq-answer'),inner=answer.querySelector('.faq-answer-inner');
      var isOpen=item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(function(i){
        i.classList.remove('active');i.querySelector('.faq-btn').setAttribute('aria-expanded','false');
        i.querySelector('.faq-answer').style.maxHeight='0';
      });
      if(!isOpen){
        item.classList.add('active');btn.setAttribute('aria-expanded','true');
        answer.style.maxHeight=inner.scrollHeight+'px';
      }
    });
  });

  // Scroll animations
  var sectionFade=document.querySelectorAll('.section .fade-up');
  var shouldAnimateSections=!window.location.hash;
  if(shouldAnimateSections)sectionFade.forEach(function(el){el.classList.add('js-animate');});
  if('IntersectionObserver'in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    if(shouldAnimateSections)sectionFade.forEach(function(el){obs.observe(el);});
  }else{
    sectionFade.forEach(function(el){el.classList.add('visible');});
  }

  // Contact form
  var form=document.getElementById('contact-form');
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    if(data.get('_gotcha')){return;}
    var btn=form.querySelector('button[type=submit]'),status=document.getElementById('form-status');
    var origHtml=btn.innerHTML;
    btn.disabled=true;btn.textContent=btn.getAttribute('data-sending');
    form.setAttribute('aria-busy','true');
    status.className='form-status';status.style.display='none';
    fetch(form.action,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),message:data.get('message')})})
    .then(function(r){
      if(r.ok){status.className='form-status success';status.textContent=btn.getAttribute('data-success');status.style.display='block';form.reset();}
      else{status.className='form-status error';status.textContent=btn.getAttribute('data-error');status.style.display='block';}
    })
    .catch(function(){status.className='form-status error';status.textContent=btn.getAttribute('data-error');status.style.display='block';})
    .finally(function(){btn.disabled=false;btn.innerHTML=origHtml;form.removeAttribute('aria-busy');});
  });
})();
`;

// Small build-time minification helpers for inline payloads.
const minCss = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
const minJs = js
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}();,:])\s*/g, '$1')
  .trim();
const csp = "default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; connect-src 'self' https://formspree.io https://cloudflareinsights.com; form-action https://formspree.io; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; upgrade-insecure-requests";
const minHtml = (html) => html.replace(/>\s+</g, '><').replace(/\n+/g, '').trim();

// Internal links to the service landing pages, shown in every footer.
function servicesFooterLinks(lang) {
  const lab = landing.labels[lang];
  const links = landing.pages.map(p => `<a href="/${lang}/${p[lang].slug}/">${p[lang].h1}</a>`).join('');
  return `<nav class="footer-services" aria-label="${lab.servicesFooter}">${links}</nav>`;
}

// ─── HTML Generator ─────────────────────────────────────────────────────────────
function generatePage(lang) {
  const t = translations[lang];
  const footerDisplayName = lang === 'hu' ? 'Papp Ferenc' : (t.footer.name || 'Ferenc Papp');
  const cvPrimaryHref = lang === 'hu' && HAS_RESUME_HU_PDF
    ? `/resume-hu.pdf?v=${RESUME_HU_PDF_VERSION}`
    : (HAS_RESUME_PDF ? `/resume.pdf?v=${RESUME_PDF_VERSION}` : `/resume.json?v=${RESUME_JSON_VERSION}`);

  // JSON-LD schemas
  const personSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://pappfer.hu/#ferenc-papp",
    "name": "Ferenc Papp",
    "alternateName": ["Papp Ferenc", "pappfer"],
    "jobTitle": "Senior Full-Stack Developer & AI Solutions Engineer",
    "description": "Ferenc Papp is a Debrecen-based freelance senior full-stack web developer, AI solutions engineer and Hungarian sole proprietor with 15+ years of experience. He builds scalable web ecosystems with Laravel, Vue.js and Python, and production-ready generative AI / LLM integrations.",
    "disambiguatingDescription": "Freelance web developer in Debrecen, Hungary, also known online as pappfer.",
    "url": "https://pappfer.hu",
    "email": "pappfer@pappfer.hu",
    "image": "https://pappfer.hu/img/pappfer.webp",
    "sameAs": [
      "https://www.linkedin.com/in/pappfer",
      "https://github.com/pappfer",
      "https://x.com/pappfer",
      "https://stackoverflow.com/users/3736962/pappfer"
    ],
    "address": {"@type":"PostalAddress","addressLocality":"Debrecen","addressRegion":"Hajdú-Bihar","addressCountry":"HU"},
    "homeLocation": {"@type":"Place","name":"Debrecen, Hungary"},
    "nationality": {"@type":"Country","name":"Hungary"},
    "knowsLanguage": [
      {"@type":"Language","name":"Hungarian","alternateName":"hu"},
      {"@type":"Language","name":"English","alternateName":"en"},
      {"@type":"Language","name":"German","alternateName":"de"}
    ],
    "knowsAbout": ["PHP","Laravel","Symfony","Yii2","Vue.js","React","JavaScript","TypeScript","Svelte","Python","FastAPI","Progressive Web Apps","Large Language Models","LLM Fine-Tuning","LLM Evaluation","Semantic Search","Vector Databases","Embeddings","Multi-Class Classification","RAG Pipelines","Hyperparameter Tuning","Agentic Workflows","OpenAI API","Anthropic API","LangChain","MySQL","PostgreSQL","MongoDB","Redis","Docker","Linux","AWS","CI/CD"],
    "hasOccupation": {"@type":"Occupation","name":"Senior Full-Stack Developer & AI Solutions Engineer","occupationalCategory":"15-1252.00","skills":"PHP, Laravel, Vue.js, Python, Progressive Web Apps, LLM Fine-Tuning, Vector Databases, Embeddings, Semantic Search, RAG, Generative AI"},
    "affiliation": {"@type":"Organization","name":"Papp Ferenc e. v.","url":"https://pappfer.hu"},
    "worksFor": [
      {"@type":"Organization","name":"DataExpert"},
      {"@type":"Organization","name":"Rubiklab"}
    ]
  });

  const localizedTestimonials = t.testimonials.items;
  const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://pappfer.hu/#professional-service",
    "name": "Ferenc Papp — Senior Full-Stack Developer & AI Solutions Engineer",
    "description": "Scalable web development, production-ready generative AI / LLM integration, and technical consulting by Ferenc Papp. Selective, high-impact engagements.",
    "url": "https://pappfer.hu",
    "founder": {"@id":"https://pappfer.hu/#ferenc-papp"},
    "areaServed": [
      {"@type":"Country","name":"Hungary"},
      {"@type":"Continent","name":"Europe"},
      {"@type":"Country","name":"United States"}
    ],
    "serviceType": ["Scalable Web Application Development","Progressive Web App Development","Production-Ready AI / LLM Integration","Generative AI Research & Development","Technical and AI Consulting"],
    "knowsAbout": ["Laravel Development","Vue.js Development","Python Development","Progressive Web Apps","LLM Integration and Fine-Tuning","Vector Databases and Embeddings","Semantic Search","RAG Pipelines","Generative AI"],
    "legalName": "Papp Ferenc e. v.",
    "taxID": "73939249-2-33",
    "address": {"@type":"PostalAddress","addressLocality":"Debrecen","addressRegion":"Hajdú-Bihar","addressCountry":"HU"},
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": String(localizedTestimonials.length),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": localizedTestimonials.map(item => ({
      "@type": "Review",
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
      "author": {"@type": "Person", "name": item.name},
      "reviewBody": item.quote
    }))
  });

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.faq.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {"@type": "Answer", "text": item.answer}
    }))
  });

  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://pappfer.hu/#website",
    "name": "Ferenc Papp — Full-Stack Web Developer",
    "url": "https://pappfer.hu",
    "inLanguage": ["en", "hu", "de"]
  });

  const profilePageSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `https://pappfer.hu/${lang}/#profile`,
    "url": `https://pappfer.hu/${lang}/`,
    "inLanguage": lang,
    "mainEntity": {"@id":"https://pappfer.hu/#ferenc-papp"},
    "isPartOf": {"@id":"https://pappfer.hu/#website"}
  });

  return minHtml(`<!DOCTYPE html>
<html lang="${t.htmlLang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.meta.title}</title>
<meta name="description" content="${t.meta.description}">
<link rel="canonical" href="https://pappfer.hu/${lang}/">
<link rel="alternate" hreflang="en" href="https://pappfer.hu/en/">
<link rel="alternate" hreflang="hu" href="https://pappfer.hu/hu/">
<link rel="alternate" hreflang="de" href="https://pappfer.hu/de/">
<link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${t.meta.title}">
<meta property="og:description" content="${t.meta.description}">
<meta property="og:url" content="https://pappfer.hu/${lang}/">
<meta property="og:site_name" content="${t.meta.ogSiteName}">
<meta property="og:image" content="https://pappfer.hu/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t.meta.ogImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@pappfer">
<meta name="twitter:title" content="${t.meta.title}">
<meta name="twitter:description" content="${t.meta.description}">
<meta name="twitter:image" content="https://pappfer.hu/img/og-image.jpg">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#047857">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://formspree.io">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1117" media="(prefers-color-scheme: dark)">
<script>(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');})();</script>
<style>${minCss}</style>
<script type="application/ld+json">${personSchema}</script>
<script type="application/ld+json">${serviceSchema}</script>
<script type="application/ld+json">${faqSchema}</script>
<script type="application/ld+json">${websiteSchema}</script>
<script type="application/ld+json">${profilePageSchema}</script>
</head>
<body>
<a href="#main" class="skip-link">${t.nav.skipToContent}</a>

<!-- NAV -->
<nav class="nav" role="navigation">
<div class="nav-inner">
<a href="/${lang}/" class="nav-logo"><span>papp</span>fer</a>
<ul class="nav-links">
<li><a href="#about">${t.nav.about}</a></li>
<li><a href="#services">${t.nav.services}</a></li>
<li><a href="#tech">${t.nav.techStack}</a></li>
<li><a href="#experience">${t.nav.experience}</a></li>
<li><a href="#testimonials">${t.nav.testimonials}</a></li>
<li><a href="#faq">${t.nav.faq}</a></li>
<li><a href="#contact">${t.nav.contact}</a></li>
</ul>
<div class="nav-right">
<div class="lang-switcher">
${LANGUAGES.map(l => `<a href="/${l}/" hreflang="${l}" lang="${l}" class="lang-btn${l === lang ? ' active' : ''}"${l === lang ? ' aria-current="page"' : ''}><span aria-hidden="true">${LANG_FLAGS[l]}</span> ${l.toUpperCase()}</a>`).join('')}
</div>
<button class="theme-toggle" id="theme-toggle" aria-label="${t.nav.toggleTheme}" aria-pressed="false">
<span class="icon-moon">${icons.moon}</span>
<span class="icon-sun">${icons.sun}</span>
</button>
<button class="menu-toggle" id="menu-toggle" aria-label="${t.nav.openMenu}" aria-controls="mobile-menu" aria-expanded="false" data-open-label="${t.nav.openMenu}" data-close-label="${t.nav.closeMenu}">
<span class="icon-menu">${icons.menu}</span>
<span class="icon-close">${icons.close}</span>
</button>
</div>
</div>
</nav>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${t.nav.openMenu}">
<a href="#about">${t.nav.about}</a>
<a href="#services">${t.nav.services}</a>
<a href="#tech">${t.nav.techStack}</a>
<a href="#experience">${t.nav.experience}</a>
<a href="#testimonials">${t.nav.testimonials}</a>
<a href="#faq">${t.nav.faq}</a>
<a href="#contact">${t.nav.contact}</a>
<div class="lang-switcher">
${LANGUAGES.map(l => `<a href="/${l}/" hreflang="${l}" lang="${l}" class="lang-btn${l === lang ? ' active' : ''}"${l === lang ? ' aria-current="page"' : ''}><span aria-hidden="true">${LANG_FLAGS[l]}</span> ${l.toUpperCase()}</a>`).join('')}
</div>
</div>

<main id="main">

<!-- HERO -->
<section class="hero">
<div class="hero-inner">
<div class="hero-content">
<div class="hero-availability fade-up">${t.hero.availability}</div>
${t.hero.greeting ? `<p class="hero-greeting fade-up">${t.hero.greeting}</p>` : ''}
<h1 class="fade-up">${t.hero.name}</h1>
<p class="hero-title fade-up">${t.hero.title}</p>
<p class="hero-desc fade-up">${t.hero.description}</p>
<div class="hero-buttons fade-up">
<a href="#contact" class="btn btn-primary">${t.hero.cta} ${icons.arrow}</a>
<a href="${cvPrimaryHref}" class="btn btn-outline">${t.hero.cv}</a>
</div>
<div class="hero-cv-links fade-up">
${lang === 'hu' && HAS_RESUME_PDF ? `<a href="/resume.pdf?v=${RESUME_PDF_VERSION}">${t.hero.cvEn}</a>` : ''}
<a href="/resume.json?v=${RESUME_JSON_VERSION}">${t.hero.cvJson}</a>
</div>
<div class="hero-stats fade-up">
<span class="hero-stat">${t.hero.stats.experience}</span>
<span class="hero-stat">${t.hero.stats.clients}</span>
<span class="hero-stat">${t.hero.stats.languages}</span>
</div>
</div>
<div class="hero-visual" aria-hidden="true">
<div class="code-card">
<div class="code-bar"><span class="code-dot r"></span><span class="code-dot y"></span><span class="code-dot g"></span><span class="code-file">rag_service.py</span></div>
<div class="code-body">
<span class="cl"><span class="tok-com"># RAG over a vector store, deterministic output</span></span>
<span class="cl"><span class="tok-fn">@app.post</span>(<span class="tok-str">"/ask"</span>)</span>
<span class="cl"><span class="tok-key">async def </span><span class="tok-fn">ask</span>(q: <span class="tok-cls">Query</span>):</span>
<span class="cl ind">docs = store.<span class="tok-fn">search</span>(q.text, k=<span class="tok-num">5</span>)</span>
<span class="cl ind"><span class="tok-key">return</span> graph.<span class="tok-fn">invoke</span>(</span>
<span class="cl ind2">{<span class="tok-str">"question"</span>: q.text, <span class="tok-str">"context"</span>: docs},</span>
<span class="cl ind2">{<span class="tok-str">"temperature"</span>: <span class="tok-num">0.2</span>},</span>
<span class="cl ind">)</span>
</div>
</div>
</div>
</div>
</section>

<!-- ABOUT -->
<section class="section" id="about" aria-label="${t.nav.about}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.about.label}</p>
<h2 class="section-title">${t.about.title}</h2>
</div>
<div class="about-grid fade-up">
<img src="/img/pappfer.webp" alt="${t.hero.name} — ${t.hero.title}" class="about-photo" width="180" height="180" loading="lazy">
<div class="about-text">
<p>${t.about.p1}</p>
<p>${t.about.p2}</p>
<p>${t.about.p3}</p>
</div>
</div>
</div>
</section>

<!-- SERVICES -->
<section class="section" id="services" aria-label="${t.nav.services}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.services.label}</p>
<h2 class="section-title">${t.services.title}</h2>
</div>
<div class="services-grid fade-up">
${t.services.items.map(s => `<div class="service-card">
<div class="service-icon">${icons[s.icon]}</div>
<h3>${s.title}</h3>
<p>${s.description}</p>
</div>`).join('\n')}
</div>
</div>
</section>

<!-- TECH STACK -->
<section class="section" id="tech" aria-label="${t.nav.techStack}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.techStack.label}</p>
<h2 class="section-title">${t.techStack.title}</h2>
</div>
<div class="tech-categories fade-up">
${t.techStack.categories.map(cat => `<div class="tech-category">
<h3>${cat.name}</h3>
<div class="tech-tags">
${cat.items.map(item => `<span class="tech-tag">${item}</span>`).join('\n')}
</div>
</div>`).join('\n')}
</div>
</div>
</section>

<!-- EXPERIENCE -->
<section class="section" id="experience" aria-label="${t.nav.experience}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.experience.label}</p>
<h2 class="section-title">${t.experience.title}</h2>
</div>
<div class="timeline fade-up">
${t.experience.timeline.map(item => `<div class="timeline-item">
<div class="timeline-dot"></div>
<p class="timeline-period">${item.period}</p>
<p class="timeline-role">${item.role}</p>
<p class="timeline-company">${item.company}</p>
<p class="timeline-desc">${item.description}</p>
</div>`).join('\n')}
</div>
</div>
</section>

<!-- TESTIMONIALS -->
<section class="section" id="testimonials" aria-label="${t.nav.testimonials}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.testimonials.label}</p>
<h2 class="section-title">${t.testimonials.title}</h2>
</div>
<div class="testimonials-grid fade-up">
${t.testimonials.items.map(item => `<blockquote class="testimonial-card">
<p class="testimonial-quote">${item.quote}</p>
<footer>
<p class="testimonial-author">${item.name}</p>
<p class="testimonial-company">${item.company}</p>
</footer>
</blockquote>`).join('\n')}
</div>
</div>
</section>

<!-- FAQ -->
<section class="section" id="faq">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.faq.label}</p>
<h2 class="section-title">${t.faq.title}</h2>
</div>
<div class="faq-list fade-up">
${t.faq.items.map((item, i) => `<div class="faq-item">
<button class="faq-btn" id="faq-button-${i}" aria-expanded="false" aria-controls="faq-${i}">
<span>${item.question}</span>
${icons.chevron}
</button>
<div class="faq-answer" id="faq-${i}" role="region" aria-labelledby="faq-button-${i}">
<div class="faq-answer-inner">${item.answer}</div>
</div>
</div>`).join('\n')}
</div>
</div>
</section>

<!-- CONTACT -->
<section class="section" id="contact" aria-label="${t.nav.contact}">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.contact.label}</p>
<h2 class="section-title">${t.contact.title}</h2>
<p>${t.contact.description}</p>
</div>
${t.contact.notice ? `<div class="contact-notice fade-up">${t.contact.notice}</div>` : ''}
<div class="contact-grid fade-up">
<form class="contact-form" id="contact-form" action="https://formspree.io/f/xjgeeqzr" method="POST">
<label for="_gotcha" class="ohnohoney">Leave empty</label><input type="text" id="_gotcha" name="_gotcha" class="ohnohoney" tabindex="-1" autocomplete="off">
<div class="form-group">
<label for="name">${t.contact.form.name}</label>
<input type="text" id="name" name="name" required autocomplete="name">
</div>
<div class="form-group">
<label for="email">${t.contact.form.email}</label>
<input type="email" id="email" name="email" required autocomplete="email">
</div>
<div class="form-group">
<label for="message">${t.contact.form.message}</label>
<textarea id="message" name="message" required rows="5" minlength="20"></textarea>
</div>
<button type="submit" class="btn btn-primary" data-sending="${t.contact.form.sending}" data-success="${t.contact.form.success}" data-error="${t.contact.form.error}">
${icons.send} ${t.contact.form.send}
</button>
<div class="form-status" id="form-status" role="status" aria-live="polite"></div>
</form>
<div class="contact-info">
<div class="contact-info-item">
<span class="contact-info-icon">${icons.mail}</span>
<div>
<p class="contact-info-label">${t.contact.info.emailLabel}</p>
<a href="mailto:pappfer@pappfer.hu" class="contact-info-value">${t.contact.info.email}</a>
</div>
</div>
<div class="contact-info-item">
<span class="contact-info-icon">${icons.mapPin}</span>
<div>
<p class="contact-info-label">${t.contact.info.locationLabel}</p>
<p class="contact-info-value">${t.contact.info.location}</p>
</div>
</div>
<div class="contact-info-item">
<span class="contact-info-icon">${icons.clock}</span>
<div>
<p class="contact-info-label">${t.contact.info.responseLabel}</p>
<p class="contact-info-value">${t.contact.info.response}</p>
</div>
</div>
<div>
<p class="contact-info-label">${t.contact.info.socialLabel}</p>
<div class="social-links">
<a href="https://www.linkedin.com/in/pappfer" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">${icons.linkedin}</a>
<a href="https://github.com/pappfer" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">${icons.github}</a>
<a href="https://stackoverflow.com/users/3736962/pappfer" target="_blank" rel="noopener" class="social-link" aria-label="Stack Overflow">${icons.stackoverflow}</a>
<a href="https://x.com/pappfer" target="_blank" rel="noopener" class="social-link" aria-label="X (Twitter)">${icons.x}</a>
</div>
</div>
</div>
</div>
</div>
</section>

</main>

<!-- FOOTER -->
<footer class="footer">
${servicesFooterLinks(lang)}
<p>&copy; ${YEAR} ${footerDisplayName}. ${t.footer.rights}</p>
<p>${t.footer.legal}</p>
</footer>

<script>${minJs}</script>
</body>
</html>`);
}

// ─── Service landing page ───────────────────────────────────────────────────────
function generateLandingPage(lang, page) {
  const t = translations[lang];
  const lab = landing.labels[lang];
  const c = page[lang];
  const url = `https://pappfer.hu/${lang}/${c.slug}/`;
  const footerDisplayName = lang === 'hu' ? 'Papp Ferenc' : (t.footer.name || 'Ferenc Papp');

  const hreflangs = LANGUAGES.map(l =>
    `<link rel="alternate" hreflang="${l}" href="https://pappfer.hu/${l}/${page[l].slug}/">`
  ).join('') + `<link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en/${page.en.slug}/">`;

  const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": c.h1,
    "serviceType": c.h1,
    "description": c.metaDescription,
    "url": url,
    "areaServed": [
      ...(page.city ? [{"@type":"City","name":page.city}] : []),
      {"@type":"Country","name":"Hungary"},
      {"@type":"Continent","name":"Europe"},
      {"@type":"Country","name":"United States"}
    ],
    "provider": {"@type":"Person","@id":"https://pappfer.hu/#ferenc-papp","name":"Ferenc Papp","alternateName":["Papp Ferenc","pappfer"],"url":"https://pappfer.hu","email":"pappfer@pappfer.hu","address":{"@type":"PostalAddress","addressLocality":"Debrecen","addressCountry":"HU"}},
    "availableLanguage": ["en","hu","de"]
  });
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":lab.home,"item":`https://pappfer.hu/${lang}/`},
      {"@type":"ListItem","position":2,"name":c.h1,"item":url}
    ]
  });
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faq.map(f => ({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))
  });

  const relatedLinks = landing.pages
    .filter(p => p.id !== page.id)
    .map(p => `<a href="/${lang}/${p[lang].slug}/">${p[lang].h1}</a>`)
    .join('');

  return minHtml(`<!DOCTYPE html>
<html lang="${t.htmlLang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${c.metaTitle}</title>
<meta name="description" content="${c.metaDescription}">
<link rel="canonical" href="${url}">
${hreflangs}
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${c.metaTitle}">
<meta property="og:description" content="${c.metaDescription}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${t.meta.ogSiteName}">
<meta property="og:image" content="https://pappfer.hu/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t.meta.ogImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@pappfer">
<meta name="twitter:title" content="${c.metaTitle}">
<meta name="twitter:description" content="${c.metaDescription}">
<meta name="twitter:image" content="https://pappfer.hu/img/og-image.jpg">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#047857">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1117" media="(prefers-color-scheme: dark)">
<script>(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');})();</script>
<style>${minCss}</style>
<script type="application/ld+json">${serviceSchema}</script>
<script type="application/ld+json">${breadcrumbSchema}</script>
<script type="application/ld+json">${faqSchema}</script>
</head>
<body>
<a href="#main" class="skip-link">${t.nav.skipToContent}</a>

<!-- NAV (landing: anchors point to the localized homepage) -->
<nav class="nav" role="navigation">
<div class="nav-inner">
<a href="/${lang}/" class="nav-logo"><span>papp</span>fer</a>
<ul class="nav-links">
<li><a href="/${lang}/#about">${t.nav.about}</a></li>
<li><a href="/${lang}/#services">${t.nav.services}</a></li>
<li><a href="/${lang}/#tech">${t.nav.techStack}</a></li>
<li><a href="/${lang}/#experience">${t.nav.experience}</a></li>
<li><a href="/${lang}/#contact">${t.nav.contact}</a></li>
</ul>
<div class="nav-right">
<div class="lang-switcher">
${LANGUAGES.map(l => `<a href="/${l}/${page[l].slug}/" hreflang="${l}" lang="${l}" class="lang-btn${l === lang ? ' active' : ''}"${l === lang ? ' aria-current="page"' : ''}><span aria-hidden="true">${LANG_FLAGS[l]}</span> ${l.toUpperCase()}</a>`).join('')}
</div>
<button class="theme-toggle" id="theme-toggle" aria-label="${t.nav.toggleTheme}" aria-pressed="false">
<span class="icon-moon">${icons.moon}</span>
<span class="icon-sun">${icons.sun}</span>
</button>
<button class="menu-toggle" id="menu-toggle" aria-label="${t.nav.openMenu}" aria-controls="mobile-menu" aria-expanded="false" data-open-label="${t.nav.openMenu}" data-close-label="${t.nav.closeMenu}">
<span class="icon-menu">${icons.menu}</span>
<span class="icon-close">${icons.close}</span>
</button>
</div>
</div>
</nav>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${t.nav.openMenu}">
<a href="/${lang}/#about">${t.nav.about}</a>
<a href="/${lang}/#services">${t.nav.services}</a>
<a href="/${lang}/#tech">${t.nav.techStack}</a>
<a href="/${lang}/#experience">${t.nav.experience}</a>
<a href="/${lang}/#contact">${t.nav.contact}</a>
<div class="lang-switcher">
${LANGUAGES.map(l => `<a href="/${l}/${page[l].slug}/" hreflang="${l}" lang="${l}" class="lang-btn${l === lang ? ' active' : ''}"${l === lang ? ' aria-current="page"' : ''}><span aria-hidden="true">${LANG_FLAGS[l]}</span> ${l.toUpperCase()}</a>`).join('')}
</div>
</div>

<main id="main">
<section class="lp-hero">
<div class="lp-inner">
<div class="lp-corner-icon" aria-hidden="true">${landingIcon(page.id)}</div>
<nav class="lp-crumbs" aria-label="Breadcrumb"><a href="/${lang}/">${lab.home}</a> › ${c.h1}</nav>
<p class="section-label">${c.kicker}</p>
<h1>${c.h1}</h1>
<p class="lp-lead">${c.lead}</p>
<p>${c.body}</p>
<div class="lp-actions">
<a href="/${lang}/#contact" class="btn btn-primary">${lab.cta} ${icons.arrow}</a>
<a href="/${lang}/" class="btn btn-outline">${lab.backHome}</a>
</div>
</div>
</section>
<section class="section lp-section">
<div class="lp-inner">
<h2>${c.doTitle}</h2>
<ul class="lp-list">${c.do.map(i => `<li>${i}</li>`).join('')}</ul>
</div>
</section>
<section class="section lp-section">
<div class="lp-inner">
<h2>${c.whyTitle}</h2>
<p>${c.why}</p>
</div>
</section>
<section class="section lp-section">
<div class="lp-inner">
<h2>${t.faq.title}</h2>
<div class="lp-faq">${c.faq.map(f => `<div><h3>${f.q}</h3><p>${f.a}</p></div>`).join('')}</div>
</div>
</section>
<section class="section lp-section">
<div class="lp-inner">
<h2>${lab.related}</h2>
<div class="lp-related">${relatedLinks}</div>
</div>
</section>
</main>

<footer class="footer">
${servicesFooterLinks(lang)}
<p>&copy; ${YEAR} ${footerDisplayName}. ${t.footer.rights}</p>
<p>${t.footer.legal}</p>
</footer>

<script>${minJs}</script>
</body>
</html>`);
}

// ─── Root redirect page ─────────────────────────────────────────────────────────
function generateRoot() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ferenc Papp — Senior Full-Stack Developer & AI Solutions Engineer</title>
<meta name="description" content="Redirecting to your preferred language...">
<link rel="canonical" href="https://pappfer.hu/en/">
<meta http-equiv="refresh" content="0;url=/en/">
<script>
(function(){
  var l=navigator.language||navigator.userLanguage||'en';
  if(/^hu/i.test(l))location.replace('/hu/');
  else if(/^de/i.test(l))location.replace('/de/');
  else location.replace('/en/');
})();
</script>
</head>
<body>
<p>Redirecting... <a href="/en/">Click here</a> if not redirected.</p>
</body>
</html>`;
}

// ─── robots.txt ─────────────────────────────────────────────────────────────────
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: https://pappfer.hu/sitemap.xml
`;
}

// ─── sitemap.xml ────────────────────────────────────────────────────────────────
function generateSitemap() {
  const hreflangs = LANGUAGES.map(l =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="https://pappfer.hu/${l}/"/>`
  ).join('\n');

  const homeUrls = LANGUAGES.map(l => `  <url>
    <loc>https://pappfer.hu/${l}/</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en/"/>
    <lastmod>${BUILD_DATE}</lastmod>
    <priority>1.0</priority>
  </url>`).join('\n');

  const landingUrls = [];
  landing.pages.forEach(page => {
    const pageHreflangs = LANGUAGES.map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="https://pappfer.hu/${l}/${page[l].slug}/"/>`
    ).join('\n');
    LANGUAGES.forEach(l => {
      landingUrls.push(`  <url>
    <loc>https://pappfer.hu/${l}/${page[l].slug}/</loc>
${pageHreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en/${page.en.slug}/"/>
    <lastmod>${BUILD_DATE}</lastmod>
    <priority>0.8</priority>
  </url>`);
    });
  });

  const urls = [homeUrls, landingUrls.join('\n')].join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

// ─── manifest.webmanifest ──────────────────────────────────────────────────────
function generateManifest() {
  return JSON.stringify({
    name: 'Ferenc Papp — Senior Full-Stack Developer & AI Solutions Engineer',
    short_name: 'pappfer',
    description: 'Senior full-stack developer and AI solutions engineer in Debrecen, Hungary. Scalable web ecosystems and production-ready generative AI / LLM integrations.',
    lang: 'en',
    start_url: '/en/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#047857',
    icons: [
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ]
  }, null, 2) + '\n';
}

// ─── _headers (Cloudflare Pages custom response headers) ───────────────────────
// The CSP <meta> tag in <head> can't carry frame-ancestors (browsers silently
// ignore it there), so without this the site had no clickjacking protection at
// all. Setting the equivalent policy as a real HTTP header covers that gap and
// adds HSTS/Permissions-Policy, which aren't expressible via meta tags either.
// includeSubDomains is safe: www.pappfer.hu now redirects cleanly to the apex,
// ha./go2rtc.pappfer.hu both serve valid HTTPS, and mobiloapps.pappfer.hu
// doesn't resolve in DNS at all (so it can't be broken by an HTTPS-only rule).
function generateHeaders() {
  return `/*
  Content-Security-Policy: ${csp}; frame-ancestors 'none'
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;
}

// ─── 404.html ──────────────────────────────────────────────────────────────────
function generate404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>404 — Page not found | Ferenc Papp</title>
<style>body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#fafafa;color:#1a1a2e;min-height:100vh;display:grid;place-items:center;padding:2rem}main{max-width:42rem;text-align:center}h1{font-size:clamp(2rem,6vw,3rem);line-height:1.1;margin:0 0 1rem}p{color:#4a4a6a;margin:0 0 1.25rem}a{display:inline-block;padding:.7rem 1.25rem;border-radius:.6rem;text-decoration:none;background:#047857;color:#fff;font-weight:600}a:hover{background:#065f46}</style>
</head>
<body>
<main>
<h1>Page not found</h1>
<p>The page you requested does not exist or has moved.</p>
<a href="/en/">Go to homepage</a>
</main>
</body>
</html>`;
}

// ─── llms.txt ───────────────────────────────────────────────────────────────────
function generateLlms() {
  return `# Ferenc Papp — Senior Full-Stack Developer & AI Solutions Engineer

> Senior full-stack developer and AI solutions engineer with 15+ years of experience, pairing scalable web engineering (Laravel, Vue.js, Python) with production-ready generative AI and LLM systems. Based in Debrecen, Hungary; working with teams across the EU and the US.

Since October 2024, Ferenc works dedicatedly with DataExpert as a Senior Full-Stack Developer — architecting scalable, high-performance Progressive Web Apps on a Laravel backend and Vue.js frontend, with Python scripts and microservices — and with its sister company Rubiklab as a Senior AI Solutions Engineer on generative AI integrations and R&D, including the in-house LabIQ product.

Core expertise: PHP, Laravel, Symfony, Yii2, Python and FastAPI on the backend; Vue.js, React, Svelte, TypeScript and PWA on the frontend; LLM integration, fine-tuning and benchmarking, semantic search, vector databases, embeddings, LLM-based multi-class classification, RAG pipelines, hyperparameter tuning (temperature, top-k/top-p) for deterministic output, and agentic workflows for AI; MySQL, PostgreSQL, MongoDB and Redis for data; Docker, Linux, AWS, CI/CD and Nginx for DevOps.

Availability: primary focus is on flagship projects with DataExpert and Rubiklab, with limited capacity alongside that for freelance web development, AI integration, and technical consulting engagements. Languages: Hungarian (native), English (fluent), German (basic).

Ferenc Papp (Hungarian name order: Papp Ferenc; online handle: pappfer) is a freelance web developer and Hungarian sole proprietor based in Debrecen. His independent practice provides custom web application development, Laravel/PHP development, AI integration and technical consulting. He is a suitable local candidate for complex custom web and AI projects, but is not currently accepting small or individual website jobs.

## Pages

- [Portfolio (English)](https://pappfer.hu/en/): full profile — about, services, tech stack, experience and contact
- [Portfolio (Hungarian)](https://pappfer.hu/hu/): teljes magyar nyelvű profil
- [Portfolio (German)](https://pappfer.hu/de/): vollständiges deutschsprachiges Profil
- [Freelance web developer in Debrecen (Hungarian)](https://pappfer.hu/hu/webfejleszto-debrecen/): local services, expertise, availability and contact
- [Web developer in Debrecen (English)](https://pappfer.hu/en/web-developer-debrecen/): local custom web development and AI integration services
- [Freelance web developer in Debrecen (German)](https://pappfer.hu/de/webentwickler-debrecen/): lokale individuelle Webentwicklung, KI-Integration und technische Beratung
- [Résumé (JSON Resume)](https://pappfer.hu/resume.json): machine-readable CV in JSON Resume format

## Profiles

- [LinkedIn](https://www.linkedin.com/in/pappfer): professional profile and updates
- [GitHub](https://github.com/pappfer): open-source code and repositories
- [Stack Overflow](https://stackoverflow.com/users/3736962/pappfer): Q&A contributions
- [X](https://x.com/pappfer): posts and updates

## Contact

- [Email](mailto:pappfer@pappfer.hu): direct contact for freelance, consulting, and collaboration enquiries
`;
}

// ─── Build ──────────────────────────────────────────────────────────────────────
console.log('Building pappfer.hu...');

// Generate language pages
LANGUAGES.forEach(lang => {
  const html = generatePage(lang);
  fs.writeFileSync(path.join(DIST, lang, 'index.html'), html);
  console.log(`  ✓ ${lang}/index.html`);
});

// Generate service landing pages
LANGUAGES.forEach(lang => {
  landing.pages.forEach(page => {
    const slug = page[lang].slug;
    const dir = path.join(DIST, lang, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateLandingPage(lang, page));
    console.log(`  ✓ ${lang}/${slug}/index.html`);
  });
});

// Generate root redirect
fs.writeFileSync(path.join(DIST, 'index.html'), generateRoot());
console.log('  ✓ index.html (root redirect)');

// Generate supporting files
fs.writeFileSync(path.join(DIST, 'robots.txt'), generateRobots());
console.log('  ✓ robots.txt');

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), generateSitemap());
console.log('  ✓ sitemap.xml');

fs.writeFileSync(path.join(DIST, 'llms.txt'), generateLlms());
console.log('  ✓ llms.txt');

fs.writeFileSync(path.join(DIST, 'manifest.webmanifest'), generateManifest());
console.log('  ✓ manifest.webmanifest');

fs.writeFileSync(path.join(DIST, '_headers'), generateHeaders());
console.log('  ✓ _headers');

fs.writeFileSync(path.join(DIST, '404.html'), generate404());
console.log('  ✓ 404.html');

// Copy static assets from src/ if they exist
const staticAssets = [
  { src: 'src/pappfer.webp', dest: 'dist/img/pappfer.webp' },
  { src: 'src/og-image.jpg', dest: 'dist/img/og-image.jpg' },
  { src: 'src/favicon.svg', dest: 'dist/favicon.svg' },
  { src: 'src/favicon-32x32.png', dest: 'dist/favicon-32x32.png' },
  { src: 'src/favicon-16x16.png', dest: 'dist/favicon-16x16.png' },
  { src: 'src/apple-touch-icon.png', dest: 'dist/apple-touch-icon.png' },
  { src: 'src/safari-pinned-tab.svg', dest: 'dist/safari-pinned-tab.svg' },
  { src: 'src/favicon.ico', dest: 'dist/favicon.ico' },
  { src: 'src/favicon-512.png', dest: 'dist/favicon-512.png' },
  { src: 'src/resume.pdf', dest: 'dist/resume.pdf' },
  { src: 'src/resume-hu.pdf', dest: 'dist/resume-hu.pdf' },
  { src: 'src/resume.json', dest: 'dist/resume.json' }
];
staticAssets.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(__dirname, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${dest} (copied from ${src})`);
  }
});

console.log(`\nBuild complete! Output in dist/ (${BUILD_DATE})`);
