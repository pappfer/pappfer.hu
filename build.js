const fs = require('fs');
const path = require('path');

const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'translations.json'), 'utf8'));
const DIST = path.join(__dirname, 'dist');
const HAS_RESUME_PDF = fs.existsSync(path.join(__dirname, 'src', 'resume.pdf'));
const HAS_RESUME_HU_PDF = fs.existsSync(path.join(__dirname, 'src', 'resume-hu.pdf'));
const BUILD_DATE = new Date().toISOString().split('T')[0];
const YEAR = new Date().getFullYear();
const LANGUAGES = ['en', 'hu', 'de'];

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
--accent:#10b981;--accent-hover:#059669;--accent-subtle:rgba(16,185,129,0.08);
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
.nav-right{display:flex;align-items:center;gap:.5rem}
.lang-switcher{display:flex;gap:2px;background:var(--bg-tertiary);border-radius:6px;padding:2px}
.lang-btn{padding:4px 10px;border:none;background:transparent;color:#374151;font-size:.75rem;font-weight:700;cursor:pointer;border-radius:4px;transition:all .2s;text-transform:uppercase;font-family:var(--font-body)}
[data-theme="dark"] .lang-btn{color:#cbd5e1}
.lang-btn.active{background:#065f46;color:#fff}
[data-theme="dark"] .lang-btn.active{background:#065f46}
.lang-btn:hover:not(.active){color:var(--text-primary);background:var(--accent-subtle)}
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
.hero-buttons{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3rem}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;border-radius:var(--radius);font-weight:600;font-size:.95rem;transition:all .2s ease-out;border:none;cursor:pointer;font-family:var(--font-body);text-decoration:none}
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
.testimonial-card{background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;position:relative}
.testimonial-card::before{content:'\\201C';position:absolute;top:.5rem;left:1.25rem;font-size:4rem;color:var(--accent);opacity:.15;font-family:Georgia,serif;line-height:1}
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
.social-links{display:flex;gap:.75rem;margin-top:.5rem}
.social-link{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;color:var(--text-secondary);border:1px solid var(--border);transition:all .2s}
.social-link:hover{color:var(--accent);border-color:var(--accent);background:var(--accent-subtle);transform:translateY(-1px)}

/* FOOTER */
.footer{padding:2rem;text-align:center;border-top:1px solid var(--border);background:var(--bg-secondary)}
.footer p{font-size:.85rem;color:var(--text-muted)}
.footer p+p{margin-top:.25rem;font-size:.8rem}

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
}
`;

// ─── JS ─────────────────────────────────────────────────────────────────────────
const js = `
(function(){
  // Theme toggle
  var tt=document.getElementById('theme-toggle');
  if(tt)tt.addEventListener('click',function(){
    var d=document.documentElement,t=d.getAttribute('data-theme')==='dark'?'light':'dark';
    d.setAttribute('data-theme',t);localStorage.setItem('theme',t);
  });

  // Mobile menu
  var mb=document.getElementById('menu-toggle'),mm=document.getElementById('mobile-menu');
  function setMenu(open){
    if(!mb||!mm)return;
    mm.classList.toggle('open',open);
    mb.setAttribute('aria-expanded',open?'true':'false');
    mb.setAttribute('aria-label',open?mb.getAttribute('data-close-label'):mb.getAttribute('data-open-label'));
    document.body.style.overflow=open?'hidden':'';
  }
  function closeMenu(){setMenu(false);}
  if(mb)mb.addEventListener('click',function(){setMenu(!mm.classList.contains('open'));});
  if(mm)mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mm&&mm.classList.contains('open'))closeMenu();});
  window.addEventListener('resize',function(){if(window.innerWidth>=900&&mm&&mm.classList.contains('open'))closeMenu();});

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
    var origText=btn.textContent;
    btn.disabled=true;btn.textContent=btn.getAttribute('data-sending');
    status.className='form-status';status.style.display='none';
    fetch(form.action,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),message:data.get('message')})})
    .then(function(r){
      if(r.ok){status.className='form-status success';status.textContent=btn.getAttribute('data-success');status.style.display='block';form.reset();}
      else{status.className='form-status error';status.textContent=btn.getAttribute('data-error');status.style.display='block';}
    })
    .catch(function(){status.className='form-status error';status.textContent=btn.getAttribute('data-error');status.style.display='block';})
    .finally(function(){btn.disabled=false;btn.textContent=origText;});
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
const csp = "default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; connect-src 'self' https://formspree.io; form-action https://formspree.io; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; upgrade-insecure-requests";
const minHtml = (html) => html.replace(/>\s+</g, '><').replace(/\n+/g, '').trim();

// ─── HTML Generator ─────────────────────────────────────────────────────────────
function generatePage(lang) {
  const t = translations[lang];
  const otherLangs = LANGUAGES.filter(l => l !== lang);
  const footerDisplayName = lang === 'hu' ? 'Papp Ferenc' : (t.footer.name || 'Ferenc Papp');
  const cvPrimaryHref = lang === 'hu' && HAS_RESUME_HU_PDF
    ? '/resume-hu.pdf'
    : (HAS_RESUME_PDF ? '/resume.pdf' : '/resume.json');

  // JSON-LD schemas
  const personSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ferenc Papp",
    "alternateName": "pappfer",
    "jobTitle": "Full-Stack Developer & AI Integration Specialist",
    "description": "Freelance full-stack web developer with 15+ years of experience specializing in Laravel, Vue.js, React, Python, and AI integration.",
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
    "nationality": {"@type":"Country","name":"Hungary"},
    "knowsLanguage": [
      {"@type":"Language","name":"Hungarian","alternateName":"hu"},
      {"@type":"Language","name":"English","alternateName":"en"},
      {"@type":"Language","name":"German","alternateName":"de"}
    ],
    "knowsAbout": ["PHP","Laravel","Symfony","Yii2","Vue.js","React","JavaScript","TypeScript","Svelte","Python","FastAPI","AI Integration","Large Language Models","RAG Pipelines","Vector Databases","Agentic Coding","OpenAI API","Anthropic API","LangChain","MySQL","PostgreSQL","MongoDB","Redis","Docker","Linux","AWS","CI/CD","Progressive Web Apps","React Native"],
    "hasOccupation": {"@type":"Occupation","name":"Full-Stack Web Developer","occupationalCategory":"15-1252.00","skills":"PHP, Laravel, Vue.js, React, Python, AI Integration, Database Design, API Development"},
    "worksFor": {"@type":"Organization","name":"Self-employed","url":"https://pappfer.hu"}
  });

  const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ferenc Papp — Full-Stack Developer",
    "description": "Freelance full-stack web development, AI integration, and technical consulting services by Ferenc Papp.",
    "url": "https://pappfer.hu",
    "founder": {"@type":"Person","name":"Ferenc Papp"},
    "areaServed": [
      {"@type":"Country","name":"Hungary"},
      {"@type":"Continent","name":"Europe"},
      {"@type":"Country","name":"United States"}
    ],
    "serviceType": ["Custom Web Application Development","AI Integration and Automation","Mobile and PWA Development","Technical Consulting"],
    "knowsAbout": ["Laravel Development","Vue.js Development","React Development","Python Development","AI/LLM Integration","Database Architecture"],
    "address": {"@type":"PostalAddress","addressLocality":"Debrecen","addressCountry":"HU"},
    "priceRange": "$$"
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
    "name": "Ferenc Papp — Full-Stack Developer",
    "url": "https://pappfer.hu",
    "inLanguage": ["en", "hu", "de"]
  });

  return minHtml(`<!DOCTYPE html>
<html lang="${t.htmlLang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.meta.title}</title>
<meta name="description" content="${t.meta.description}">
<link rel="canonical" href="https://pappfer.hu/${lang}">
<link rel="alternate" hreflang="en" href="https://pappfer.hu/en">
<link rel="alternate" hreflang="hu" href="https://pappfer.hu/hu">
<link rel="alternate" hreflang="de" href="https://pappfer.hu/de">
<link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en">
<meta property="og:type" content="website">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${t.meta.title}">
<meta property="og:description" content="${t.meta.description}">
<meta property="og:url" content="https://pappfer.hu/${lang}">
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
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#10b981">
<link rel="shortcut icon" href="/favicon.ico">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1117" media="(prefers-color-scheme: dark)">
<script>(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');})();</script>
<style>${minCss}</style>
<script type="application/ld+json">${personSchema}</script>
<script type="application/ld+json">${serviceSchema}</script>
<script type="application/ld+json">${faqSchema}</script>
<script type="application/ld+json">${websiteSchema}</script>
</head>
<body>
<a href="#main" class="skip-link">${t.nav.skipToContent}</a>

<!-- NAV -->
<nav class="nav" role="navigation">
<div class="nav-inner">
<a href="/${lang}" class="nav-logo"><span>papp</span>fer</a>
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
${LANGUAGES.map(l => `<a href="/${l}" hreflang="${l}" lang="${l}" class="lang-btn${l === lang ? ' active' : ''}"${l === lang ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
</div>
<button class="theme-toggle" id="theme-toggle" aria-label="${t.nav.toggleTheme}">
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
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true">
<a href="#about">${t.nav.about}</a>
<a href="#services">${t.nav.services}</a>
<a href="#tech">${t.nav.techStack}</a>
<a href="#experience">${t.nav.experience}</a>
<a href="#testimonials">${t.nav.testimonials}</a>
<a href="#faq">${t.nav.faq}</a>
<a href="#contact">${t.nav.contact}</a>
</div>

<main id="main">

<!-- HERO -->
<section class="hero">
<div class="hero-inner">
<div class="hero-availability fade-up">${t.hero.availability}</div>
<p class="hero-greeting fade-up">${t.hero.greeting}</p>
<h1 class="fade-up">${t.hero.name}</h1>
<p class="hero-title fade-up">${t.hero.title}</p>
<p class="hero-desc fade-up">${t.hero.description}</p>
<div class="hero-buttons fade-up">
<a href="#contact" class="btn btn-primary">${t.hero.cta} ${icons.arrow}</a>
<a href="${cvPrimaryHref}" class="btn btn-outline">${t.hero.cv}</a>
${lang === 'hu' && HAS_RESUME_PDF ? `<a href="/resume.pdf" class="btn btn-outline">${t.hero.cvEn}</a>` : ''}
<a href="/resume.json" class="btn btn-outline">${t.hero.cvJson}</a>
</div>
<div class="hero-stats fade-up">
<span class="hero-stat">${t.hero.stats.experience}</span>
<span class="hero-stat">${t.hero.stats.clients}</span>
<span class="hero-stat">${t.hero.stats.languages}</span>
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
<img src="/img/pappfer.webp" alt="Ferenc Papp" class="about-photo" width="180" height="180" loading="lazy">
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
<section class="section" id="faq" itemscope itemtype="https://schema.org/FAQPage">
<div class="section-inner">
<div class="fade-up">
<p class="section-label">${t.faq.label}</p>
<h2 class="section-title">${t.faq.title}</h2>
</div>
<div class="faq-list fade-up">
${t.faq.items.map((item, i) => `<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<button class="faq-btn" aria-expanded="false" aria-controls="faq-${i}">
<span itemprop="name">${item.question}</span>
${icons.chevron}
</button>
<div class="faq-answer" id="faq-${i}" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div class="faq-answer-inner" itemprop="text">${item.answer}${t.faq.entityLine ? ` ${t.faq.entityLine}` : ''}</div>
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
<textarea id="message" name="message" required rows="5"></textarea>
</div>
<button type="submit" class="btn btn-primary" data-sending="${t.contact.form.sending}" data-success="${t.contact.form.success}" data-error="${t.contact.form.error}">
${icons.send} ${t.contact.form.send}
</button>
<div class="form-status" id="form-status"></div>
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
<p>&copy; ${YEAR} ${footerDisplayName}. ${t.footer.rights}</p>
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
<title>Ferenc Papp — Full-Stack Developer</title>
<meta name="description" content="Redirecting to your preferred language...">
<link rel="canonical" href="https://pappfer.hu/en">
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
    `    <xhtml:link rel="alternate" hreflang="${l}" href="https://pappfer.hu/${l}"/>`
  ).join('\n');

  const urls = LANGUAGES.map(l => `  <url>
    <loc>https://pappfer.hu/${l}</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en"/>
    <lastmod>${BUILD_DATE}</lastmod>
    <priority>1.0</priority>
  </url>`).join('\n');

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
    name: 'Ferenc Papp — Full-Stack Developer',
    short_name: 'pappfer',
    description: 'Freelance full-stack developer and AI integration specialist in Debrecen, Hungary.',
    lang: 'en',
    start_url: '/en/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#10b981',
    icons: [
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ]
  }, null, 2) + '\n';
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
<style>body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#fafafa;color:#1a1a2e;min-height:100vh;display:grid;place-items:center;padding:2rem}main{max-width:42rem;text-align:center}h1{font-size:clamp(2rem,6vw,3rem);line-height:1.1;margin:0 0 1rem}p{color:#4a4a6a;margin:0 0 1.25rem}a{display:inline-block;padding:.7rem 1.25rem;border-radius:.6rem;text-decoration:none;background:#10b981;color:#fff;font-weight:600}a:hover{background:#059669}</style>
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
  return `# Ferenc Papp — Full-Stack Developer & AI Integration Specialist

## About
Ferenc Papp is a freelance full-stack web developer and AI integration specialist based in Debrecen, Hungary, working as a sole proprietor. He has over 15 years of professional experience and works with clients across Europe and the United States.

## Core Expertise
- Backend: PHP, Laravel, Symfony, Yii2, Python, FastAPI
- Frontend: Vue.js, React, JavaScript/TypeScript, Svelte
- AI: LLM integration (OpenAI, Anthropic), RAG pipelines, vector databases, agentic workflows
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- DevOps: Docker, Linux, AWS, CI/CD, Nginx
- Mobile: PWA, offline-first architecture, React Native

## Services
- Custom web application development (Laravel, Vue.js, React)
- AI integration and automation (LLM, RAG, vector DB, agentic coding)
- Mobile and PWA development (offline-first)
- Technical consulting (architecture, technology selection, performance)

## Contact
- Email: pappfer@pappfer.hu
- LinkedIn: https://www.linkedin.com/in/pappfer
- GitHub: https://github.com/pappfer
- Website: https://pappfer.hu

## Languages
- Hungarian (native)
- English (fluent)
- German (basic)
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
