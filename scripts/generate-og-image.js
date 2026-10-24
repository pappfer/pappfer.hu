#!/usr/bin/env node
'use strict';

// Generates the Open Graph / Twitter share images (1200x630) with Chromium:
//   src/og-image.jpg            — the site card, built from resume.json so the
//                                 social preview always matches name + job title
//   src/og/<lang>-<slug>.jpg    — one card per service landing page and for the
//                                 glossary, per language
//   src/og/<lang>-blog-<slug>.jpg — one card per blog article translation
//
// These are committed, because the Cloudflare Pages build has no Chromium — the
// site build only copies them and falls back to the site card if one is missing.
//
// Usage:
//   npm run generate-og                  # every card
//   npm run generate-og -- --site-only   # just src/og-image.jpg
//   npm run generate-og -- --blog-only   # just the blog article cards

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Chrome/Chromium not found. Install Chrome or set CHROME_PATH env var.');
}

const rootDir = path.resolve(__dirname, '..');
const resumePath = path.join(rootDir, 'src', 'resume.json');
const landingPath = path.join(rootDir, 'src', 'landing.json');
const glossaryPath = path.join(rootDir, 'src', 'glossary.json');
const outputPath = path.join(rootDir, 'src', 'og-image.jpg');
const ogDir = path.join(rootDir, 'src', 'og');
const blogDir = path.join(rootDir, 'src', 'blog');
const profileImagePath = path.join(rootDir, 'src', 'pappfer.webp');
const coverDir = path.join(blogDir, 'cover');

const WIDTH = 1200;
const HEIGHT = 630;
const LANGUAGES = ['en', 'hu', 'de'];
const NAME_BY_LANG = { en: 'Ferenc Papp', hu: 'Papp Ferenc', de: 'Ferenc Papp' };

function loadProfileImageDataUri() {
  if (!fs.existsSync(profileImagePath)) return '';
  const raw = fs.readFileSync(profileImagePath);
  return `data:image/webp;base64,${raw.toString('base64')}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const SHARED_STYLES = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${WIDTH}px;height:${HEIGHT}px}
  body{
    display:flex;align-items:center;gap:72px;
    padding:0 110px;
    font-family:'DM Sans',-apple-system,'Segoe UI',Roboto,sans-serif;
    background:radial-gradient(120% 140% at 100% 0%, #1e2336 0%, #14161f 60%, #101219 100%);
    color:#e8e8f0;-webkit-font-smoothing:antialiased;
  }
  .photo{
    flex-shrink:0;border-radius:50%;
    object-fit:cover;border:4px solid rgba(52,211,153,.35);
    box-shadow:0 20px 60px rgba(0,0,0,.45);
  }
  .cover{
    flex-shrink:0;width:230px;height:230px;border-radius:44px;
    display:flex;align-items:center;justify-content:center;
    background:linear-gradient(160deg,#232842 0%,#181b29 100%);
    border:2px solid rgba(52,211,153,.35);box-shadow:0 20px 60px rgba(0,0,0,.45);
  }
  .cover img{width:170px;height:170px;object-fit:contain}
  .url{font-size:28px;font-weight:500;color:#8a8aaa;margin-top:26px}
`;

function page(styles, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap" rel="stylesheet">
<style>${SHARED_STYLES}${styles}</style>
</head>
<body>${body}</body>
</html>`;
}

function buildSiteCard(name, label, photo) {
  // Break the title onto a second line after the central "&" to mirror the
  // original two-line layout (e.g. "... Developer &" / "AI Solutions Engineer").
  const title = escapeHtml(label).replace(/ &amp; /, ' &amp;<br>');
  return page(`
  .photo{width:300px;height:300px}
  .name{font-size:80px;font-weight:700;line-height:1.05;letter-spacing:-.01em;color:#fff}
  .title{font-size:38px;font-weight:600;line-height:1.25;color:#34d399;margin-top:18px}
`, `
  ${photo ? `<img class="photo" src="${photo}" alt="">` : ''}
  <div class="text">
    <div class="name">${escapeHtml(name)}</div>
    <div class="title">${title}</div>
    <div class="url">pappfer.hu</div>
  </div>
`);
}

// The h1 is the hero of a service card, so it gets the largest type — stepped
// down for the long ones ("Freelance Web Developer in Debrecen") so every card
// keeps the same three-line silhouette instead of overflowing.
function headingSize(text) {
  if (text.length > 34) return 58;
  if (text.length > 24) return 68;
  return 78;
}

// An article's card shows its topic instead of the photo when
// src/blog/cover/<slug>.svg exists (the project's logo, recoloured for the dark
// card where needed).
function loadCoverDataUri(slug) {
  const file = path.join(coverDir, `${slug}.svg`);
  if (!fs.existsSync(file)) return '';
  return `data:image/svg+xml;base64,${fs.readFileSync(file).toString('base64')}`;
}

function buildServiceCard(content, lang, photo, cover) {
  return page(`
  .photo{width:230px;height:230px}
  .kicker{font-size:27px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#34d399}
  .h1{font-size:${headingSize(content.h1)}px;font-weight:700;line-height:1.08;letter-spacing:-.01em;color:#fff;margin-top:20px}
  .byline{font-size:30px;font-weight:600;color:#c9c9dd;margin-top:30px}
  .url{margin-top:10px}
`, `
  ${cover ? `<div class="cover"><img src="${cover}" alt=""></div>` : photo ? `<img class="photo" src="${photo}" alt="">` : ''}
  <div class="text">
    <div class="kicker">${escapeHtml(content.kicker)}</div>
    <div class="h1">${escapeHtml(content.h1)}</div>
    <div class="byline">${escapeHtml(NAME_BY_LANG[lang])}</div>
    <div class="url">pappfer.hu</div>
  </div>
`);
}

// Front matter of src/blog/<id>.<lang>.md, mapped to the fields the card uses.
// The kicker is the category's name in src/blog/meta.json, as on the page.
function blogCards() {
  const blogMeta = JSON.parse(fs.readFileSync(path.join(blogDir, 'meta.json'), 'utf8'));
  return fs.readdirSync(blogDir).flatMap(file => {
    const m = file.match(/^.+\.([a-z]{2})\.md$/);
    const fm = m && fs.readFileSync(path.join(blogDir, file), 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!fm) return [];
    const meta = {};
    fm[1].split('\n').forEach(l => { const kv = l.match(/^(\w+):\s*(.*)$/); if (kv) meta[kv[1]] = kv[2]; });
    return [{ lang: m[1], file: `${m[1]}-blog-${meta.slug}.jpg`, cover: loadCoverDataUri(meta.slug), content: { kicker: blogMeta[m[1]].categories[meta.category].name, h1: meta.title } }];
  });
}

async function shoot(page_, html, file) {
  // 'load' + document.fonts.ready rather than networkidle0: the webfont is what
  // we actually have to wait for, and keep-alive sockets from the font CDN mean
  // the idle condition never fires on the second and later cards.
  await page_.setContent(html, { waitUntil: 'load' });
  await page_.evaluate(() => document.fonts.ready);
  await page_.screenshot({
    path: file,
    type: 'jpeg',
    quality: 90,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });
  console.log(`  ✓ ${path.relative(rootDir, file)}`);
}

async function main() {
  const siteOnly = process.argv.includes('--site-only');
  const blogOnly = process.argv.includes('--blog-only');
  if (!fs.existsSync(resumePath)) throw new Error(`Missing ${resumePath}`);
  const resume = JSON.parse(fs.readFileSync(resumePath, 'utf8'));
  const landing = JSON.parse(fs.readFileSync(landingPath, 'utf8'));
  const glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));
  const photo = loadProfileImageDataUri();

  console.log('Generating Open Graph images with Chromium...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const tab = await browser.newPage();
    await tab.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

    if (!blogOnly) await shoot(tab, buildSiteCard(resume.basics.name, resume.basics.label, photo), outputPath);
    if (siteOnly) return;

    fs.mkdirSync(ogDir, { recursive: true });
    for (const card of blogCards()) {
      await shoot(tab, buildServiceCard(card.content, card.lang, photo, card.cover), path.join(ogDir, card.file));
    }
    if (blogOnly) return;
    for (const lang of LANGUAGES) {
      const pages = [...landing.pages.map(p => p[lang]), glossary.meta[lang]];
      for (const content of pages) {
        const file = path.join(ogDir, `${lang}-${content.slug}.jpg`);
        await shoot(tab, buildServiceCard(content, lang, photo), file);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
