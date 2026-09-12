# pappfer.hu — Portfolio v2.0

Personal developer portfolio for Ferenc Papp — a multilingual (EN/HU/DE), static, SEO-optimized site with dark/light theme.

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally (http://localhost:3000)
npm run dev
```

Alternative local server:

```bash
python3 -m http.server -d dist 8000
```

Then open [http://localhost:3000](http://localhost:3000) (`npm run dev`) or [http://localhost:8000](http://localhost:8000) (`python3 -m http.server`).

## Project Structure

```
├── build.js                  # Build script (Node.js, zero deps)
├── .github/workflows/
│   └── indexnow.yml          # Pings IndexNow once a deploy is live
├── scripts/
│   ├── generate-og-image.js  # Share cards (needs Chromium)
│   └── indexnow-submit.js    # Submits URLs to IndexNow
├── src/
│   ├── translations.json     # All content in EN/HU/DE
│   ├── landing.json          # Service landing page content
│   ├── glossary.json         # AI & LLM glossary terms (EN/HU/DE)
│   ├── search.js             # Browser-side search for the glossary page
│   ├── lastmod.json          # Per-URL content hashes + lastmod dates
│   ├── og/                   # Per-page share cards (generated, committed)
│   └── indexnow-key.txt      # IndexNow key (public, must stay stable)
├── dist/                     # Build output (deploy this)
│   ├── index.html            # Language chooser — fallback for the Cloudflare rules
│   ├── en/index.html         # English (+ 9 service pages and the glossary per language)
│   ├── hu/index.html         # Hungarian
│   ├── de/index.html         # German
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── llms.txt              # AI/LLM visibility file (index)
│   ├── llms-full.txt         # Full site content, all languages, plain text
│   ├── <key>.txt             # IndexNow ownership key
│   ├── search-{en,hu,de}.json  # Search index, fetched on first keystroke
│   ├── _headers              # Security headers + noindex for the search index
│   └── img/
│       ├── pappfer.webp      # Profile photo
│       ├── og-image.jpg      # Social sharing image (1200x630)
│       └── og/               # Per-page share cards
├── AGENTS.md                 # Full specification for AI agents
└── README.md                 # This file
```

## How It Works

`build.js` reads `src/translations.json` and generates static HTML for each language. All CSS and JS are inlined — no external dependencies except Google Fonts (DM Sans). The output in `dist/` is ready for deployment as-is.

## Editing Content

All translatable content lives in three JSON files. Edit them, then run `npm run build` to regenerate.

- `src/translations.json` — the homepage: nav, hero, about, services, tech stack, experience, testimonials, FAQ, contact, footer and SEO meta tags.
- `src/landing.json` — the service landing pages (9 per language). Adding a page means adding one entry plus its id in `PAGE_ORDER` and `LANDING_ICONS` in `build.js`.
- `src/glossary.json` — the AI & LLM glossary: per-language page meta plus categories of terms. Each term has a stable `id` that becomes its anchor (`/hu/ai-szotar/#rag`) and its `@id` in the `DefinedTermSet` schema, so **never rename an id** — you would break every link and citation pointing at that definition.

After a content change, build locally so `src/lastmod.json` is updated in the same commit, and re-run `npm run generate-og` if a page's `h1` or `kicker` changed.

## Deployment (Cloudflare Pages)

1. Connect your GitHub repo in Cloudflare Dashboard > Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add custom domain: `pappfer.hu`

Cloudflare Pages provides automatic Brotli compression, global CDN, HTTP/3, and HTTPS.

## IndexNow

The site pings [IndexNow](https://www.indexnow.org) so Bing, Yandex, Seznam, Naver and
the rest of the network re-crawl changed pages within minutes instead of days.
(Google doesn't participate in IndexNow — it still picks changes up via `sitemap.xml`.)

The key lives in `src/indexnow-key.txt` (committed, public by design) and the build
publishes it as `dist/<key>.txt`, which is how the engines verify domain ownership.

**Automatic:** `.github/workflows/indexnow.yml` runs on every push to `master` that
touches content. It rebuilds the site, waits until `pappfer.hu/sitemap.xml` matches
the freshly built one (that's the "Cloudflare deploy is live" signal), then submits
only the changed URLs. Nothing to run by hand, and no secrets — the key is public.

The Cloudflare Pages build itself deliberately does *not* ping: it runs **before**
the deploy is published, so the crawlers would arrive at the old content.

**Manual**, from your own machine (or anywhere — it's just an HTTPS POST), once the
deploy is live:

```bash
npm run indexnow                      # submit every URL in dist/sitemap.xml
npm run indexnow -- --changed         # only what the last local build changed
npm run indexnow -- /hu/ /en/laravel-developer/   # submit only these
npm run indexnow -- --dry-run         # show the payload, send nothing
```

The script verifies that `/<key>.txt` is live before submitting and refuses if it
isn't, so a premature ping fails loudly instead of silently wasting the submission.

## Search

The glossary page carries a search box over everything the site publishes in that
language: all 50 definitions, the nine service pages and the homepage sections.

- **Index** — `build.js` writes `dist/search-<lang>.json` (~14 kB gzipped, 69
  documents). The browser fetches it on the first keystroke, so page load is
  unaffected.
- **Retrieval** — `src/search.js`, inlined on the glossary page only. BM25 with
  prefix matching in both directions, which is what makes Hungarian and German
  compounding work — "embeddingeket" finds "embedding" and "embed" finds it too.
  Question words are dropped before scoring, and results below a relevance floor
  are discarded rather than shown as weak guesses: the site has no pricing page,
  so "mennyibe kerül" should find nothing instead of returning whatever happens
  to share a common word.

Everything runs in the browser. There is no search backend, no API key and no
per-query cost.

## Root redirect

`https://pappfer.hu/` sends visitors to their language. **This is configured in
the Cloudflare dashboard, not in this repository** — three Redirect Rules on the
zone answer `/` with a 302 before the request ever reaches Pages, so there is no
HTML round trip and Googlebot gets a real redirect instead of a soft one.

The rules, in this order (the pre-existing www→apex rule stays first, and the
catch-all must be last):

| # | Expression | Action |
|---|------------|--------|
| 1 | `http.request.uri.path eq "/" and lower(http.request.headers["accept-language"][0]) contains "hu"` | 302 → `https://pappfer.hu/hu/` |
| 2 | `http.request.uri.path eq "/" and lower(http.request.headers["accept-language"][0]) contains "de"` | 302 → `https://pappfer.hu/de/` |
| 3 | `http.request.uri.path eq "/"` | 302 → `https://pappfer.hu/en/` |

Verified live after setup: `hu`/`de`/`en`/`fr` and a request with no
`Accept-Language` all land on the right page, every other path still answers 200
(no redirect loop), query strings survive the redirect, and www visitors chain
www→apex→language in two hops.

`contains`, not `starts_with`: the rule editor rejects `starts_with` here, and
`matches` (regex) needs a paid plan. The practical cost is that a browser asking
for `en-DE` — English UI in Germany — matches rule 2 and gets the German page.
Hungarian first, German second, because no other language tag contains "hu".

302, never 301: the destination depends on the visitor, so it must not be cached
as permanent. Scope every rule to `path eq "/"` — an unscoped rule redirects the
whole site into a loop.

`dist/index.html` stays as a **fallback** for the case where those rules are
removed or fail. It is a real language chooser (three links, native names) with
a JavaScript redirect on top — deliberately no `<meta http-equiv="refresh">`,
which Google reads as a soft redirect.

## Content freshness (`src/lastmod.json`)

`<lastmod>` in the sitemap must be truthful — Google ignores sitemap dates it finds
unreliable, and "everything changed today, again" is exactly that. So each URL gets
a hash of the content that feeds it (its slice of `translations.json` /
`landing.json`, not the rendered HTML), and the date only moves when that hash does.
A CSS change or a new footer year touches no dates.

`src/lastmod.json` holds those hashes and dates and **is committed**. Build locally
before committing a content change so the manifest travels with it:

```bash
npm run build   # updates src/lastmod.json if content changed
git add src/lastmod.json
```

The same hashes drive `dateModified` in the JSON-LD and the `--changed` URL list
for IndexNow.

## Share images

`npm run generate-og` renders the share cards with Chromium (`puppeteer-core`):

- `src/og-image.jpg` — the site card, from `resume.json`
- `src/og/<lang>-<slug>.jpg` — one card per service landing page, per language

They're committed, because the Cloudflare Pages build has no Chromium — it only
copies them into `dist/img/og/`. A landing page with no card falls back to the site
card, so a missing image never breaks the build. Re-run after changing an `h1`,
a `kicker`, the photo, or `resume.json`.

## Configuration

The contact form posts to Formspree; the form id lives in `build.js` and is already
set. Two things live outside this repository and are easy to forget:

- the **root redirect rules** in the Cloudflare dashboard (see above), and
- the **Workers AI binding** is deliberately *not* configured — there is no
  backend, and the site does not need one.

## Validation Checklist

- [Lighthouse](https://pagespeed.web.dev) — target 100/100 all categories
- [Schema Validator](https://validator.schema.org) — JSON-LD validation
- [Rich Results Test](https://search.google.com/test/rich-results)
- [HTML Validator](https://validator.w3.org)
- [OG Preview](https://www.opengraph.xyz)

## Tech Details

- Zero runtime dependencies
- Inline CSS with CSS custom properties for theming
- Inline JS (~2 kB on every page): theme toggle, mobile menu, FAQ accordion, scroll
  animations, form handler. The glossary page additionally inlines `src/search.js`
  (~4 kB) for in-browser search
- JSON-LD: Person, ProfessionalService, FAQPage, WebSite, ProfilePage (home);
  WebPage, Service, BreadcrumbList, FAQPage (landing pages);
  WebPage, DefinedTermSet, BreadcrumbList (glossary)
- Full SEO: canonical, hreflang, Open Graph, Twitter Cards
- Accessibility: skip link, ARIA attributes, semantic HTML, keyboard navigation
- Mobile-first responsive design (breakpoints: 600px, 900px)
