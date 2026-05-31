#!/usr/bin/env node
'use strict';

// Generates the Open Graph / Twitter share image (1200x630) from resume.json,
// so the social preview always matches the current name and job title.
// Renders an HTML card with Chromium (puppeteer-core) and saves a JPEG.

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
const outputPath = path.join(rootDir, 'src', 'og-image.jpg');
const profileImagePath = path.join(rootDir, 'src', 'pappfer.webp');

const WIDTH = 1200;
const HEIGHT = 630;

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

function buildHtml(name, label, photo) {
  // Break the title onto a second line after the central "&" to mirror the
  // original two-line layout (e.g. "... Developer &" / "AI Solutions Engineer").
  const title = escapeHtml(label).replace(/ &amp; /, ' &amp;<br>');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap" rel="stylesheet">
<style>
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
    width:300px;height:300px;flex-shrink:0;border-radius:50%;
    object-fit:cover;border:4px solid rgba(52,211,153,.35);
    box-shadow:0 20px 60px rgba(0,0,0,.45);
  }
  .name{font-size:80px;font-weight:700;line-height:1.05;letter-spacing:-.01em;color:#fff}
  .title{font-size:38px;font-weight:600;line-height:1.25;color:#34d399;margin-top:18px}
  .url{font-size:28px;font-weight:500;color:#8a8aaa;margin-top:26px}
</style>
</head>
<body>
  ${photo ? `<img class="photo" src="${photo}" alt="">` : ''}
  <div class="text">
    <div class="name">${escapeHtml(name)}</div>
    <div class="title">${title}</div>
    <div class="url">pappfer.hu</div>
  </div>
</body>
</html>`;
}

async function main() {
  if (!fs.existsSync(resumePath)) {
    throw new Error(`Missing ${resumePath}`);
  }
  const resume = JSON.parse(fs.readFileSync(resumePath, 'utf8'));
  const name = resume.basics.name;
  const label = resume.basics.label;
  const photo = loadProfileImageDataUri();

  console.log('Generating Open Graph image with Chromium...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(buildHtml(name, label, photo), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 90,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    console.log(`  ✓ ${path.relative(rootDir, outputPath)} (${WIDTH}x${HEIGHT})`);
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
