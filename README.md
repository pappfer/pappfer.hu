# pappfer.hu — Portfolio v2.0

Personal developer portfolio for Ferenc Papp — a multilingual (EN/HU/DE), static, SEO-optimized site with dark/light theme.

## Quick Start

```bash
# Build the site
node build.js

# Serve locally
npx serve dist
# or
python3 -m http.server -d dist 8000
```

Then open [http://localhost:3000](http://localhost:3000) (serve) or [http://localhost:8000](http://localhost:8000) (python).

## Project Structure

```
├── build.js                  # Build script (Node.js, zero deps)
├── src/
│   └── translations.json     # All content in EN/HU/DE
├── dist/                     # Build output (deploy this)
│   ├── index.html            # Root redirect (detects browser language)
│   ├── en/index.html         # English
│   ├── hu/index.html         # Hungarian
│   ├── de/index.html         # German
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── llms.txt              # AI/LLM visibility file
│   └── img/
│       ├── pappfer.webp      # Profile photo
│       └── og-image.jpg      # Social sharing image (1200x630)
├── AGENTS.md                 # Full specification for AI agents
└── README.md                 # This file
```

## How It Works

`build.js` reads `src/translations.json` and generates static HTML for each language. All CSS and JS are inlined — no external dependencies except Google Fonts (DM Sans). The output in `dist/` is ready for deployment as-is.

## Editing Content

All translatable content is in `src/translations.json`. Edit the JSON, then run `node build.js` to regenerate. Sections: nav, hero, about, services, tech stack, experience, testimonials, FAQ, contact, footer, and SEO meta tags.

## Deployment (Cloudflare Pages)

1. Connect your GitHub repo in Cloudflare Dashboard > Pages
2. Build command: `node build.js`
3. Output directory: `dist`
4. Add custom domain: `pappfer.hu`

Cloudflare Pages provides automatic Brotli compression, global CDN, HTTP/3, and HTTPS.

## Configuration

Replace `YOUR_FORMSPREE_ID` in `build.js` with your Formspree form ID after registering at [formspree.io](https://formspree.io).

## Validation Checklist

- [Lighthouse](https://pagespeed.web.dev) — target 100/100 all categories
- [Schema Validator](https://validator.schema.org) — JSON-LD validation
- [Rich Results Test](https://search.google.com/test/rich-results)
- [HTML Validator](https://validator.w3.org)
- [OG Preview](https://www.opengraph.xyz)

## Tech Details

- Zero runtime dependencies
- Inline CSS with CSS custom properties for theming
- Inline JS (~2KB): theme toggle, mobile menu, FAQ accordion, scroll animations, form handler
- 4 JSON-LD schemas: Person, ProfessionalService, FAQPage, WebSite
- Full SEO: canonical, hreflang, Open Graph, Twitter Cards
- Accessibility: skip link, ARIA attributes, semantic HTML, keyboard navigation
- Mobile-first responsive design (breakpoints: 600px, 900px)
