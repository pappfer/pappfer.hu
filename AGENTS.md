# AGENTS.md — Portfolio Website Rebuild Specification
# Owner: Ferenc Papp (pappfer) | DataExpert
# Purpose: Complete spec for AI coding agents to implement a high-performance, SEO-optimized, AI-visible multilingual developer portfolio

---

## 1. PROJECT OVERVIEW

Build a static, multilingual (EN/HU/DE) personal developer portfolio for **Ferenc Papp**, a freelance full-stack developer and AI integration specialist based in Debrecen, Hungary, working as a sole proprietor (egyéni vállalkozó).

### Primary Goals (in priority order)
1. **Lead generation** — the site must convert visitors into client inquiries
2. **SEO dominance** — rank for "freelance laravel developer", "AI integration developer Hungary", "full-stack developer Europe" etc.
3. **AI visibility** — be correctly represented and recommended by LLMs (ChatGPT, Claude, Perplexity, Google AI Overview) via structured data, semantic content, and clear factual statements
4. **Performance** — Lighthouse/PageSpeed 100/100 across all categories (Performance, Accessibility, Best Practices, SEO)
5. **Professional design** — clean, modern, mobile-first with dark/light toggle

### Non-Goals
- No CMS, no database, no server-side runtime
- No client-side frameworks (React, Vue, etc.) — this is a static site
- No bloat: no jQuery, no Bootstrap, no Tailwind, no icon libraries loaded via CDN
- No cookie banners needed (no tracking cookies used)

---

## 2. TECH STACK & ARCHITECTURE

### Build System
- **Node.js build script** (`build.js`) that reads translations from JSON and outputs static HTML
- Alternatively: a simple PHP CLI script, Python script, or shell script — whatever generates the HTML files
- The build tool itself is NOT deployed — only the `/dist` output is deployed

### Output Structure
```
dist/
├── index.html              ← Root: auto-redirects to browser language (en/hu/de)
├── en/
│   └── index.html          ← English version
├── hu/
│   └── index.html          ← Hungarian version
├── de/
│   └── index.html          ← German version
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── img/
    ├── pappfer.webp         ← Profile photo (WebP, optimized)
    └── og-image.jpg          ← OG image 1200x630
```

### CSS Strategy
- **Inline all CSS** in `<style>` within `<head>` — eliminates render-blocking requests
- Vanilla CSS only, no preprocessors needed in output
- CSS custom properties (variables) for theming (light/dark)
- Mobile-first responsive design with `min-width` media queries

### JavaScript Strategy
- **Inline all JS** before `</body>` — minimal, no external dependencies
- JS is only for: theme toggle, mobile menu, FAQ accordion, scroll animations, contact form submission
- Total JS should be under 2KB minified
- Use `IntersectionObserver` for scroll animations (no scroll event listeners)

### Fonts
- **Self-host** the chosen font OR use `font-display: swap` with Google Fonts preconnect
- Preferred: use a system font stack as primary, with one distinctive display font for headings only
- Suggested: `font-family: system-ui, -apple-system, 'Segoe UI', sans-serif` for body, one Google Font for headings

### Images
- Profile photo: WebP format, explicitly set `width` and `height` attributes, lazy-load below fold
- OG image: 1200x630 JPG for social sharing
- All decorative elements: CSS only (no image files)
- NO hero background images — use CSS gradients or solid colors for performance

### Contact Form
- Use **Formspree** (https://formspree.io) — zero backend needed
- Form action: `https://formspree.io/f/{FORM_ID}` (owner will register and replace)
- Submit via `fetch()` with JSON, show success/error inline
- Fields: Name, Email, Message (all required)
- Include honeypot field for spam prevention

### Hosting Target
- **Recommended: Cloudflare Pages** — free, global CDN, automatic HTTPS, git-based deploy
  - Connect the GitHub repo, set build command: `node build.js`, output directory: `dist/`
  - Point pappfer.hu DNS to Cloudflare Pages (CNAME)
  - Automatic brotli compression, edge caching, HTTP/3, early hints — all free
  - This gives better performance than a VPS for static content
- Alternative: GitHub Pages (also free, simpler, but fewer features)
- The repo already has the domain on a VPS with Cloudflare in front — migration is just changing the DNS target from VPS IP to Cloudflare Pages

### Git Strategy
- Tag the current codebase as `v1.0` before any changes
- Create a fresh `v2.0` branch, remove all legacy files
- Place `AGENTS.md` and the build system in the repo root
- Cloudflare Pages will auto-deploy on push to `main`

---

## 3. TRANSLATIONS

Store all translatable strings in a single `translations.json` (or similar). The build script reads this and generates per-language HTML.

### Languages
| Code | Language  | hreflang | og:locale |
|------|-----------|----------|-----------|
| en   | English   | en       | en_US     |
| hu   | Hungarian | hu       | hu_HU     |
| de   | German    | de       | de_DE     |

### Root Redirect Logic
The root `index.html` should detect `navigator.language` and redirect:
- `hu*` → `/hu/`
- `de*` → `/de/`
- Everything else → `/en/`
- Include `<meta http-equiv="refresh" content="0;url=/en/">` as noscript fallback
- Set `<link rel="canonical" href="https://pappfer.hu/en">` on root

---

## 4. PAGE SECTIONS & CONTENT

### 4.1 Navigation (sticky, top)
- Logo: `<span>papp</span>fer` (accent color on "papp")
- Links: About, Services, Tech Stack, Experience, Testimonials, FAQ, Contact
- Language switcher: EN | HU | DE (compact, inline buttons)
- Theme toggle: sun/moon icon (SVG inline, no icon library)
- Mobile: hamburger → full-screen overlay menu
- Behavior: hide on scroll down, show on scroll up (CSS transform, toggled by minimal JS)

### 4.2 Hero Section
**This is the most important section for conversions and AI visibility.**

Content:
- Greeting: "Hello, I'm" / "Üdvözlöm, én vagyok" / "Hallo, ich bin"
- Name: **Ferenc Papp** (in `<h1>`)
- Title: **Full-Stack Developer & AI Integration Specialist** (prominent, colored)
- Value proposition (1-2 sentences): "I build fast, scalable web applications and integrate AI solutions that give your business a competitive edge. 15+ years of experience, clients worldwide."
- CTA button: "Let's Talk" → scrolls to #contact
- Secondary: "Download CV" → link to resume.json or PDF
- Stats bar: "15+ years experience" | "Clients worldwide" | "EN / HU / DE"

Design:
- Full viewport height
- Staggered fade-up animations on load (CSS `@keyframes` + `animation-delay`)
- No background image (performance)

### 4.3 About Section
3 paragraphs covering:
1. Who I am — full-stack developer, 15+ years, specialties (Laravel, Vue.js, React, Python, AI)
2. What I deliver — custom web apps, survey platforms, multi-tenant SaaS, AI automation
3. Where I work — Debrecen Hungary, clients in Europe and US, fluent English, native Hungarian, basic German

**Important for AI visibility**: Write in clear, factual, third-person-friendly sentences that LLMs can extract. Example: "Ferenc Papp is a freelance full-stack web developer based in Debrecen, Hungary, with over 15 years of professional experience."

### 4.4 Services Section (CRITICAL for lead generation)
4 service cards with icon, title, description:

1. **Custom Web Applications**
   - Laravel, Symfony, Vue.js, React
   - MVPs to enterprise multi-tenant platforms
   - Clean architecture, tested code, production-ready

2. **AI Integration & Automation**
   - LLM integration (OpenAI, Anthropic APIs)
   - Vector databases, RAG pipelines
   - Agentic workflows, intelligent automation
   - Practical AI for real business problems

3. **Mobile & PWA Development**
   - Progressive Web Apps, offline-first
   - Cross-platform mobile solutions
   - Fast loading, works without connectivity

4. **Technical Consulting**
   - Architecture reviews
   - Technology selection
   - Performance optimization
   - Dev team mentoring

### 4.5 Tech Stack Section
Display as categorized tag/badge groups (NOT percentage bars — those are outdated and subjective):

**Backend:** PHP, Laravel, Symfony, Yii2, Python, FastAPI, MySQL, PostgreSQL, MongoDB, Redis
**Frontend:** Vue.js, React, JavaScript/TypeScript, Svelte, HTML5/CSS3, Tailwind CSS
**AI & Data:** LLM Integration, Vector Databases (Pinecone, ChromaDB), RAG Pipelines, Agentic Coding, OpenAI API, Anthropic API, LangChain
**DevOps & Tools:** Linux, Docker, Git, CI/CD, AWS, Nginx, Deployer
**Mobile:** PWA, Offline-First Architecture, React Native, Ionic

### 4.6 Experience Timeline
Vertical timeline, left-aligned, with dot markers:

| Period | Company | Role | Description |
|--------|---------|------|-------------|
| 2017–Present | Self-employed (Sole Proprietor) | Full-Stack Developer & Technical Consultant | Freelance developer building custom web apps, survey systems, and AI integrations for clients including market research companies across Europe and US. |
| 2015–2017 | Fathom Minds | Senior PHP Developer | Led web app and API development with Yii2. Set up Git infrastructure. |
| 2014–2015 | Oktafone | Frontend Developer | Startup web application with AngularJS, JS, HTML5, CSS3. |
| 2012–2014 | Freelancer (pappfer.hu) | PHP Developer | Websites for individuals and companies. PHP, Yii, Laravel, WordPress. |
| 2009–2012 | British Telecom / IT Services | Network & System Admin | Global network management. Created PHP automation saving 3+ hours/day — innovation award. |

### 4.7 Testimonials
3 client testimonials in a grid (not a carousel — carousels hurt accessibility and SEO):

1. **Mészáros Tibor** — Sentonard Media
   "Reliable and fast. We have been working with him for years. He built several of our websites from scratch. I can only recommend him."

2. **Phil Guegan** — CEO & Founder, Infogems
   "Excellent freelancer and very easy to work with. Great knowledge of PHP frameworks, excellent English and very good communicator, and very reliable."

3. **DanD** — Client
   "Ferenc is a very talented PHP developer. He quickly got to grips with what was required and delivered everything (and more) that I expected. I would happily work with him again."

Use `<blockquote>` with `<footer>` for semantic markup.

### 4.8 FAQ Section (CRITICAL for AI visibility)
FAQ with accordion (one open at a time). Must include both JSON-LD FAQPage schema AND microdata attributes.

Questions (translate to all 3 languages):

1. **What technologies do you specialize in?**
   My core stack is PHP/Laravel for backend, Vue.js and React for frontend, and Python/FastAPI for AI integrations. I also work with MySQL, PostgreSQL, MongoDB, Redis, Docker, and various cloud platforms.

2. **Do you work with international clients?**
   Yes, I regularly work with clients across Europe and the United States. I speak fluent English and communicate across time zones daily. Most of my current clients are based outside Hungary.

3. **What kind of AI integrations do you offer?**
   I integrate LLMs (OpenAI, Anthropic) into business workflows, build RAG pipelines with vector databases, create agentic automation systems, and develop AI-powered features for existing applications.

4. **How do you handle project communication?**
   I'm flexible — Slack, Teams, email, or video calls, whatever works best for your team. I provide regular updates and believe in transparent, proactive communication.

5. **What is your typical project timeline?**
   It depends on scope. Small features take days, MVPs take 4–8 weeks, larger platforms 2–6 months. I always provide detailed estimates upfront and keep you informed of progress.

6. **What is your hourly rate / pricing model?**
   I work with both hourly and fixed-price models depending on the project. Contact me with your project details for a personalized quote.

### 4.9 Contact Section
Two-column layout:
- Left: Contact form (Name, Email, Message, Send button)
- Right: Direct email, location, response time, social links

Social links (inline SVG icons):
- LinkedIn: https://www.linkedin.com/in/pappfer
- GitHub: https://github.com/pappfer
- StackOverflow: https://stackoverflow.com/users/3736962/pappfer
- X (Twitter): https://x.com/pappfer

### 4.10 Footer
Minimal: © 2025 Ferenc Papp. All rights reserved.
Subtitle: "Built with semantic HTML, vanilla CSS, and zero frameworks."

---

## 5. SEO REQUIREMENTS

### Meta Tags (per language page)
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{translated full title}</title>
<meta name="description" content="{translated meta description, 150-160 chars}">
<link rel="canonical" href="https://pappfer.hu/{lang}">
<link rel="alternate" hreflang="en" href="https://pappfer.hu/en">
<link rel="alternate" hreflang="hu" href="https://pappfer.hu/hu">
<link rel="alternate" hreflang="de" href="https://pappfer.hu/de">
<link rel="alternate" hreflang="x-default" href="https://pappfer.hu/en">
```

### Open Graph Tags
```html
<meta property="og:type" content="website">
<meta property="og:locale" content="{locale}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="https://pappfer.hu/{lang}">
<meta property="og:site_name" content="Ferenc Papp — Full-Stack Developer">
<meta property="og:image" content="https://pappfer.hu/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Ferenc Papp — Full-Stack Developer & AI Integration Specialist">
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@pappfer">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="https://pappfer.hu/img/og-image.jpg">
```

### Structured Data (JSON-LD) — MUST INCLUDE ALL OF THESE

#### 1. Person Schema
```json
{
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
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Debrecen",
    "addressRegion": "Hajdú-Bihar",
    "addressCountry": "HU"
  },
  "nationality": {
    "@type": "Country",
    "name": "Hungary"
  },
  "knowsLanguage": [
    {"@type": "Language", "name": "Hungarian", "alternateName": "hu"},
    {"@type": "Language", "name": "English", "alternateName": "en"},
    {"@type": "Language", "name": "German", "alternateName": "de"}
  ],
  "knowsAbout": [
    "PHP", "Laravel", "Symfony", "Yii2",
    "Vue.js", "React", "JavaScript", "TypeScript", "Svelte",
    "Python", "FastAPI",
    "AI Integration", "Large Language Models", "RAG Pipelines", "Vector Databases",
    "Agentic Coding", "OpenAI API", "Anthropic API", "LangChain",
    "MySQL", "PostgreSQL", "MongoDB", "Redis",
    "Docker", "Linux", "AWS", "CI/CD",
    "Progressive Web Apps", "React Native"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Full-Stack Web Developer",
    "occupationalCategory": "15-1252.00",
    "skills": "PHP, Laravel, Vue.js, React, Python, AI Integration, Database Design, API Development"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Self-employed",
    "url": "https://pappfer.hu"
  }
}
```

#### 2. ProfessionalService Schema
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Ferenc Papp — Full-Stack Developer",
  "description": "Freelance full-stack web development, AI integration, and technical consulting services by Ferenc Papp.",
  "url": "https://pappfer.hu",
  "founder": {"@type": "Person", "name": "Ferenc Papp"},
  "areaServed": [
    {"@type": "Country", "name": "Hungary"},
    {"@type": "Continent", "name": "Europe"},
    {"@type": "Country", "name": "United States"}
  ],
  "serviceType": [
    "Custom Web Application Development",
    "AI Integration and Automation",
    "Mobile and PWA Development",
    "Technical Consulting"
  ],
  "knowsAbout": [
    "Laravel Development", "Vue.js Development", "React Development",
    "Python Development", "AI/LLM Integration", "Database Architecture"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Debrecen",
    "addressCountry": "HU"
  },
  "priceRange": "$$"
}
```

#### 3. FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What technologies does Ferenc Papp specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```
Generate this dynamically from the FAQ content per language.

#### 4. WebSite Schema (for sitelinks search)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ferenc Papp — Full-Stack Developer",
  "url": "https://pappfer.hu",
  "inLanguage": ["en", "hu", "de"]
}
```

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://pappfer.hu/sitemap.xml
```

### sitemap.xml
Generate during build:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://pappfer.hu/en</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://pappfer.hu/en"/>
    <xhtml:link rel="alternate" hreflang="hu" href="https://pappfer.hu/hu"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://pappfer.hu/de"/>
    <lastmod>{BUILD_DATE}</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- Repeat for /hu and /de -->
</urlset>
```

---

## 6. AI VISIBILITY REQUIREMENTS

This is distinct from traditional SEO. AI systems (ChatGPT, Claude, Perplexity, Google AI Overview, Bing Copilot) extract information differently than search engine crawlers.

### Content Principles for AI Visibility

1. **Write clear, factual, extractable statements.** Every section should contain sentences that an LLM can directly quote or paraphrase when asked "Who is a good Laravel developer in Hungary?" or "Recommend a freelance developer for AI integration."

   Examples of AI-friendly sentences to include naturally in content:
   - "Ferenc Papp is a freelance full-stack web developer based in Debrecen, Hungary."
   - "He specializes in Laravel, Vue.js, React, Python, and AI integration."
   - "With over 15 years of professional experience, he serves clients across Europe and the United States."
   - "He integrates AI capabilities including LLMs, RAG pipelines, and vector databases into business applications."
   - "His business, DataExpert, provides custom web development, AI integration, and technical consulting services."

2. **Use descriptive, keyword-rich headings** that match natural language questions:
   - "What Technologies Does Ferenc Papp Specialize In?" (FAQ)
   - "Custom Web Application Development Services" (service card)
   - "AI Integration and Automation Services" (service card)

3. **FAQ section is the most important section for AI visibility.** LLMs heavily weight Q&A formatted content. Every FAQ answer should be self-contained and factual.

4. **Structured data is critical.** The JSON-LD schemas (Person, ProfessionalService, FAQPage) directly feed AI knowledge graphs. Be comprehensive and accurate.

5. **Avoid vague language.** Instead of "I'm good at many things", write "I specialize in PHP/Laravel backend development, Vue.js and React frontend development, and Python-based AI integration."

6. **Include entity associations.** Mention tools, companies, and technologies by their proper names. "OpenAI", "Anthropic", "Laravel", "PostgreSQL" — not just "various AI providers" or "popular frameworks."

### llms.txt (Optional but recommended)
Create a `/llms.txt` file in the root:
```
# Ferenc Papp — Full-Stack Developer & AI Integration Specialist

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
```

---

## 7. PERFORMANCE REQUIREMENTS

Target: **Lighthouse 100/100** in all four categories.

### Checklist

#### Performance
- [ ] Inline all critical CSS in `<head>` (no external CSS files)
- [ ] Inline all JS before `</body>` (no external JS files)
- [ ] No render-blocking resources
- [ ] Total page weight under 50KB (HTML + inline CSS + inline JS, excluding fonts)
- [ ] Use `font-display: swap` for any web fonts
- [ ] Preconnect to font origins: `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- [ ] All images: WebP format, explicit `width`/`height`, `loading="lazy"` for below-fold
- [ ] No layout shift (CLS = 0): all media has explicit dimensions
- [ ] No unused CSS (every rule is used)
- [ ] Minify inline CSS and JS in production build

#### Accessibility
- [ ] Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<blockquote>`, `<footer>`
- [ ] Proper heading hierarchy: one `<h1>` per page, then `<h2>`, `<h3>` in order
- [ ] All interactive elements keyboard accessible
- [ ] `aria-label` on icon buttons (theme toggle, mobile menu, social links)
- [ ] `aria-expanded` on FAQ buttons and mobile menu toggle
- [ ] Sufficient color contrast (WCAG AA minimum, aim for AAA)
- [ ] Focus visible styles on all interactive elements
- [ ] `<html lang="{lang}">` attribute set correctly per language
- [ ] Skip to content link (hidden, visible on focus)
- [ ] Form labels properly associated with inputs

#### Best Practices
- [ ] HTTPS (handled by hosting)
- [ ] No console errors
- [ ] No deprecated APIs
- [ ] Proper `rel="noopener"` on external links with `target="_blank"`
- [ ] No document.write
- [ ] CSP-compatible (no inline event handlers in HTML)

#### SEO
- [ ] Unique `<title>` per language
- [ ] `<meta name="description">` per language (150-160 chars)
- [ ] `<link rel="canonical">` per page
- [ ] `hreflang` tags for all language variants
- [ ] robots.txt allows crawling
- [ ] sitemap.xml with all pages
- [ ] All JSON-LD structured data valid (test at https://validator.schema.org)
- [ ] No broken links
- [ ] Descriptive link text (no "click here")

---

## 8. DESIGN SPECIFICATION

### Visual Direction
Clean, professional, modern — but NOT generic. The site should look like it was designed by a real designer, not generated by AI. Think: Linear.app, Vercel, Resend, Raycast — that level of polish.

**Key design principles:**
- **Whitespace is your friend** — generous padding, breathing room between elements, don't cram content
- **Visual hierarchy** — the eye should flow naturally: Hero name → title → CTA → scroll down
- **Subtle depth** — light shadows, border separations, alternating backgrounds to create layers
- **Micro-interactions** — hover states on every interactive element (buttons lift, cards elevate, links color-shift)
- **Consistency** — same border-radius, same spacing scale, same transition timing everywhere
- **Typography contrast** — big bold headings vs lightweight body text creates visual interest

**What to avoid:**
- Generic "developer portfolio" look with neon green/purple gradients
- Overly dark themes that feel like a terminal
- Flat, lifeless layouts with no depth or movement
- Walls of text without visual breaks
- Too many colors — stick to the accent color + neutrals

**Visual details that make it feel premium:**
- Subtle border on cards (1px, very light)
- Backdrop blur on sticky nav (glassmorphism, subtle)
- Staggered animation delays on hero elements (not everything at once)
- Quote marks styled differently in testimonials (large, faded accent color)
- Dot markers on timeline with accent color
- Hover transitions that feel smooth (200-300ms ease-out)
- Active language in switcher highlighted with accent background
- Section labels (small, uppercase, accent color) above section titles
- Alternating section backgrounds (white/off-white in light, dark/darker in dark mode)

### Color System (CSS Custom Properties)

#### Light Theme
```css
--bg-primary: #fafafa;
--bg-secondary: #ffffff;
--bg-tertiary: #f0f0f0;
--text-primary: #1a1a2e;
--text-secondary: #4a4a6a;
--text-muted: #5c5c7a;
--accent: #047857;         /* Emerald 700 — WCAG AA compliant on #fafafa (5.25:1) */
--accent-hover: #065f46;
--accent-subtle: rgba(4, 120, 87, 0.1);
--border: #e2e2ee;
```

#### Dark Theme
```css
--bg-primary: #0f1117;
--bg-secondary: #1a1d2e;
--bg-tertiary: #232740;
--text-primary: #e8e8f0;
--text-secondary: #a0a0c0;
--text-muted: #8a8aaa;
--accent: #34d399;
--accent-hover: #6ee7b7;
--accent-subtle: rgba(52, 211, 153, 0.1);
--border: #2a2d40;
```

### Theme Toggle Behavior
1. Check `localStorage` for saved preference
2. If none, check `prefers-color-scheme: dark`
3. Default to light if no preference
4. Toggle sets `data-theme` attribute on `<html>` and saves to `localStorage`
5. Apply theme BEFORE first paint (script in `<head>`, before CSS):
```html
<script>
(function(){
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
  else if (matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.setAttribute('data-theme','dark');
})();
</script>
```

### Typography
- Headings: One distinctive Google Font (suggestion: "DM Sans" 700/800, or "General Sans", or "Satoshi") — self-host or preconnect
- Body: System font stack: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
- Base size: 16px
- Line height: 1.7 for body text
- Letter spacing: tight on headings (-0.03em), normal on body

### Layout
- Max content width: 1100px, centered
- Section padding: 5rem vertical, 2rem horizontal (3.5rem / 1.25rem on mobile)
- Cards: 2-column grid on desktop, 1-column on mobile
- Border radius: 8-12px on cards and buttons
- Alternating section backgrounds (primary/secondary) for visual rhythm

### Animations
- Hero: staggered fade-up on load (CSS `@keyframes fadeUp` with `animation-delay`)
- Sections: fade-up on scroll into view (IntersectionObserver adding `.visible` class)
- Buttons: subtle `translateY(-1px)` + shadow on hover
- Cards: `translateY(-2px)` + elevated shadow on hover
- Keep all animations under 600ms, use `ease-out`

### Responsive Breakpoints
- Mobile: default (< 600px)
- Tablet: `@media (min-width: 600px)`
- Desktop: `@media (min-width: 900px)`
- Nav links hidden below 900px, hamburger menu shown instead

---

## 9. CONTACT INFORMATION

Use these exact values everywhere:
- **Name:** Ferenc Papp
- **Business:** DataExpert
- **Email:** pappfer@pappfer.hu
- **Location:** Debrecen, Hungary
- **LinkedIn:** https://www.linkedin.com/in/pappfer
- **GitHub:** https://github.com/pappfer
- **StackOverflow:** https://stackoverflow.com/users/3736962/pappfer
- **X (Twitter):** https://x.com/pappfer
- **Website:** https://pappfer.hu

---

## 10. BUILD & DEPLOY INSTRUCTIONS

### Build
```bash
node build.js
# Outputs to /dist
```

### Test Locally
```bash
npx serve dist
# Or: python3 -m http.server -d dist 8000
```

### Validate
After build, check:
1. **Lighthouse**: Run in Chrome DevTools → all 4 categories 100
2. **Schema validation**: https://validator.schema.org — paste each JSON-LD block
3. **Rich Results Test**: https://search.google.com/test/rich-results
4. **HTML validation**: https://validator.w3.org
5. **Social card preview**: https://www.opengraph.xyz
6. **PageSpeed Insights**: https://pagespeed.web.dev — test all 3 language URLs
7. **GTmetrix**: https://gtmetrix.com

### Deploy
**Cloudflare Pages (recommended):**
1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect your GitHub repo
3. Build settings: Build command = `node build.js`, Output directory = `dist`
4. Deploy — Cloudflare handles compression, caching, CDN, HTTPS automatically
5. Add custom domain: pappfer.hu → Cloudflare Pages will give you a CNAME target
6. In Cloudflare DNS: change pappfer.hu from A record (VPS IP) to CNAME (pages target)

Cloudflare Pages automatically provides:
- Brotli compression
- Global CDN (300+ edge locations)
- HTTP/3 and Early Hints
- Automatic HTTPS
- Cache headers optimized for static sites
- Preview deploys for branches/PRs

No manual server configuration needed.

---

## 11. IMPLEMENTATION NOTES FOR AI AGENTS

### DO:
- Generate complete, valid, production-ready HTML
- Inline all CSS and JS — no external files except fonts
- Use semantic HTML5 elements throughout
- Include ALL structured data schemas listed above
- Make every section translatable via the translations file
- Test that dark/light toggle works correctly
- Ensure zero layout shift (explicit dimensions on everything)
- Write clean, readable, well-commented build code

### DON'T:
- Don't add any npm dependencies for the output (build script can use whatever it needs)
- Don't use CSS frameworks (Tailwind, Bootstrap, etc.)
- Don't use JavaScript frameworks (React, Vue, etc.)
- Don't add analytics/tracking scripts (owner will add separately)
- Don't add cookie consent banners
- Don't use icon font libraries (Font Awesome, etc.) — use inline SVG
- Don't add a preloader/loading animation
- Don't use CSS `@import` statements
- Don't use JavaScript `document.write()`
- Don't lazy-load above-the-fold content
- Don't use percentage-based skill bars (outdated pattern)

### IMPORTANT REMINDERS:
- The Formspree form ID (`YOUR_FORMSPREE_ID`) is a placeholder — owner will replace it
- The OG image (`og-image.jpg`) and profile photo (`pappfer.webp`) are placeholders — owner will provide
- The resume link can point to `resume.json` or `resume.pdf` — owner will provide the file
- Run the build and verify the output HTML is valid before considering the task complete
- The theme detection script MUST be in `<head>` before `<style>` to prevent flash of wrong theme

---

## 12. SUMMARY OF KEY FILES TO CREATE

| File | Purpose |
|------|---------|
| `build.js` | Node.js build script |
| `src/translations.json` | All translatable strings (EN/HU/DE) |
| `dist/index.html` | Root redirect page |
| `dist/en/index.html` | English page |
| `dist/hu/index.html` | Hungarian page |
| `dist/de/index.html` | German page |
| `dist/robots.txt` | Crawler instructions |
| `dist/sitemap.xml` | Sitemap with hreflang |
| `dist/llms.txt` | AI/LLM information file |
| `dist/favicon.ico` | Favicon (owner provides) |
| `dist/img/og-image.jpg` | Social sharing image (owner provides) |
| `dist/img/pappfer.webp` | Profile photo (owner provides) |
