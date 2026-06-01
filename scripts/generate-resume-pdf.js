#!/usr/bin/env node
'use strict';

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
const outputPdfPath = path.join(rootDir, 'src', 'resume.pdf');
const outputHuPdfPath = path.join(rootDir, 'src', 'resume-hu.pdf');
const profileImagePath = path.join(rootDir, 'src', 'pappfer.webp');

function loadProfileImageDataUri() {
  try {
    if (!fs.existsSync(profileImagePath)) return null;
    const raw = fs.readFileSync(profileImagePath);
    return `data:image/webp;base64,${raw.toString('base64')}`;
  } catch (_) {
    return null;
  }
}

const PROFILE_IMAGE_URI = loadProfileImageDataUri();

function escHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(isoDate, locale = 'en-GB') {
  if (!isoDate) return locale === 'hu-HU' ? 'Jelenleg' : 'Present';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
}

function dateRange(startDate, endDate, locale = 'en-GB') {
  return `${formatDate(startDate, locale)} – ${formatDate(endDate, locale)}`;
}

function trHu(text) {
  const map = new Map([
    ['Freelance full-stack web developer and AI integration specialist with over 15 years of professional experience. I build fast, scalable web applications using PHP/Laravel, Vue.js, React, and Python, and integrate AI solutions (LLMs, RAG pipelines, vector databases) into business workflows. Based in Debrecen, Hungary, serving clients across Europe and the United States.',
      'Szabadúszó full-stack webfejlesztő és AI integrációs szakértő vagyok, több mint 15 év szakmai tapasztalattal. Gyors, skálázható alkalmazásokat készítek PHP/Laravel, Vue.js, React és Python technológiákkal, valamint AI megoldásokat integrálok (LLM, RAG, vektor adatbázisok) üzleti folyamatokba. Debrecenből dolgozom, európai és amerikai ügyfeleknek.'],
    ['Freelance developer building custom web applications, survey systems, and AI integrations for clients including market research companies across Europe and the US.',
      'Szabadúszó fejlesztőként egyedi webalkalmazásokat, kérdőíves rendszereket és AI integrációkat készítek európai és amerikai ügyfeleknek, köztük piackutató cégeknek.'],
    ['Led web application and API development using Yii2 framework. Set up the company\'s Git infrastructure and worked on the internal Flow project.',
      'Yii2 alapú webalkalmazás- és API-fejlesztést vezettem. Kialakítottam a cég Git infrastruktúráját és dolgoztam a belső Flow projekten.'],
    ['Developed a startup web application using AngularJS, JavaScript, HTML5, and CSS3.',
      'Startup webalkalmazást fejlesztettem AngularJS, JavaScript, HTML5 és CSS3 használatával.'],
    ['Built websites for individuals and companies using PHP, Yii, Laravel, and WordPress. Acquired clients through freelancer platforms.',
      'Magánszemélyeknek és cégeknek készítettem weboldalakat PHP, Yii, Laravel és WordPress technológiákkal. Ügyfeleket freelancer platformokon szereztem.'],
    ['Configured network devices (routers, switches) for global network support. Communicated with clients worldwide in English.',
      'Globális hálózati támogatáshoz konfiguráltam hálózati eszközöket (routerek, switchek). Nemzetközi ügyfelekkel kommunikáltam angol nyelven.'],
    ['Maintained Linux and Windows servers, administered Avaya IP phones. Co-developed a PHP automation tool that saved 3+ hours daily for the team, receiving an innovation award.',
      'Linux és Windows szervereket üzemeltettem, Avaya IP telefonrendszert adminisztráltam. Társszerzőként készített PHP automatizmus napi 3+ óra megtakarítást hozott a csapatnak, innovációs díjat kaptunk.'],
    ['Remote PHP development. Maintained and improved existing codebases, gaining experience with diverse implementation patterns and architectures.',
      'Távoli PHP fejlesztést végeztem. Meglévő kódbázisokat karbantartottam és fejlesztettem, különböző architektúrákban szerezve tapasztalatot.'],
    ['Custom Laravel/Vue.js web applications for market research clients', 'Egyedi Laravel/Vue.js webalkalmazások piackutató ügyfeleknek'],
    ['AI integration: LLMs, RAG pipelines, vector databases, agentic workflows', 'AI integráció: LLM-ek, RAG pipeline-ok, vektor adatbázisok, agent workflow-k'],
    ['Multi-tenant SaaS platforms and survey systems', 'Multi-tenant SaaS platformok és kérdőíves rendszerek'],
    ['Technical consulting and architecture reviews', 'Technikai tanácsadás és architektúra review'],
    ['Web app and API development with Yii2', 'Webalkalmazás- és API-fejlesztés Yii2-vel'],
    ['Set up Git infrastructure for the development team', 'Git infrastruktúra kialakítása a fejlesztőcsapatnak'],
    ['Worked on internal Flow project', 'Részvétel a belső Flow projektben'],
    ['PHP, Yii framework, WordPress, Laravel', 'PHP, Yii keretrendszer, WordPress, Laravel'],
    ['Facebook, LinkedIn, Box.com, Stripe integrations', 'Facebook, LinkedIn, Box.com és Stripe integrációk'],
    ['Yii console applications with scheduled tasks', 'Yii konzolalkalmazások időzített feladatokkal'],
    ['IT Services innovation award for PHP automation tool', 'IT Services innovációs díj a PHP automatizálási eszközért'],
    ['Linux and Windows server administration', 'Linux és Windows szerverüzemeltetés'],
    ['Avaya IP phone administration', 'Avaya IP telefonrendszer-adminisztráció'],
    ['Bachelor\'s program', 'Alapképzés'],
    ['Secondary school', 'Középiskola'],
    ['Backend', 'Backend'],
    ['Frontend', 'Frontend'],
    ['AI & Data', 'AI & Adat'],
    ['DevOps & Tools', 'DevOps & Eszközök'],
    ['Mobile', 'Mobil'],
    // positions
    ['Full-Stack Developer & Technical Consultant', 'Full-stack webfejlesztő és technikai tanácsadó'],
    ['Senior PHP Developer', 'Senior PHP fejlesztő'],
    ['Frontend Developer', 'Frontend fejlesztő'],
    ['Full-Stack Web Developer', 'Full-stack webfejlesztő'],
    ['Service Desk Analyst 2nd Line', 'Service Desk elemző, 2nd Line'],
    ['Contact Center Server Administrator', 'Contact Center szerver-adminisztrátor'],
    ['PHP Developer', 'PHP fejlesztő'],
    // company names
    ['Self-employed (Sole Proprietor)', 'Egyéni vállalkozó'],
    ['pappfer.hu (Freelancer)', 'pappfer.hu (szabadúszó)'],
    // updated profile summary
    ['Senior full-stack developer and AI solutions engineer with over 15 years of professional experience. I build scalable, high-performance web ecosystems with PHP/Laravel, Vue.js and Python, and engineer production-ready generative AI / LLM systems — fine-tuning, semantic search, vector databases, embeddings and RAG pipelines. Since October 2024 I work dedicatedly with DataExpert and its sister company Rubiklab on flagship projects. Based in Debrecen, Hungary, working with teams across Europe and the United States.',
      'Szenior full-stack fejlesztő és AI Solutions Engineer vagyok, több mint 15 év szakmai tapasztalattal. Skálázható, nagy teljesítményű webes ökoszisztémákat építek PHP/Laravel, Vue.js és Python alapokon, és éles környezetbe szánt generatív AI / LLM rendszereket fejlesztek — finomhangolás, szemantikus keresés, vektor adatbázisok, embeddings és RAG pipeline-ok. 2024 októbere óta dedikáltan a DataExpert és testvércége, a Rubiklab kiemelt projektjein dolgozom. Debrecenből, európai és amerikai csapatokkal.'],
    // DataExpert
    ['Architecting and building scalable, high-performance Progressive Web Apps for flagship projects.',
      'Skálázható, nagy teljesítményű Progresszív Webalkalmazások (PWA) tervezése és fejlesztése kiemelt projekteken.'],
    ['Scalable, high-performance Progressive Web Apps (PWA)', 'Skálázható, nagy teljesítményű Progresszív Webalkalmazások (PWA)'],
    ['Laravel backend with a Vue.js frontend', 'Laravel backend Vue.js frontenddel'],
    ['Python scripts and microservices', 'Python szkriptek és mikroszolgáltatások'],
    // Rubiklab
    ['Generative AI integrations and R&D, including the in-house LabIQ product.',
      'Generatív AI integrációk és kutatás-fejlesztés, beleértve a saját LabIQ terméket.'],
    ['LLM fine-tuning, benchmarking and comparison', 'LLM finomhangolás, benchmark és összehasonlítás'],
    ['Semantic search with vector databases and embeddings', 'Szemantikus keresés vektor adatbázisokkal és embeddingekkel'],
    ['LLM-based multi-class classification systems', 'LLM-alapú többosztályos klasszifikációs rendszerek'],
    ['Hyperparameter optimization (temperature, top-k/top-p) for deterministic output', 'Hiperparaméter-optimalizálás (temperature, top-k/top-p) a determinisztikus kimenetért'],
    // Self-employed (updated summary)
    ['Independent practice as a sole proprietor: custom web applications and AI integrations (LLM-powered features, RAG pipelines, vector search) plus survey systems for market research clients across the EU and US.',
      'Egyéni vállalkozói tevékenység: egyedi webalkalmazások és AI integrációk (LLM-alapú funkciók, RAG pipeline-ok, vektoros keresés), valamint kérdőíves rendszerek európai és amerikai piackutató ügyfeleknek.'],
    // skill category names
    ['Backend Development', 'Backend fejlesztés'],
    ['Frontend Development', 'Frontend fejlesztés'],
    ['Databases', 'Adatbázisok'],
    ['AI & LLM', 'AI & LLM'],
  ]);
  return map.get(text) || text;
}

function buildHtml(resume, lang = 'en') {
  const basics = resume.basics || {};
  const work = Array.isArray(resume.work) ? resume.work : [];
  const education = Array.isArray(resume.education) ? resume.education.slice(0, 2) : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const profiles = Array.isArray(basics.profiles) ? basics.profiles.slice(0, 4) : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];

  const isHu = lang === 'hu';
  const locale = isHu ? 'hu-HU' : 'en-GB';
  const name = isHu ? 'Papp Ferenc' : (basics.name || 'Ferenc Papp');
  const label = isHu
    ? 'Szenior full-stack fejlesztő & AI Solutions Engineer'
    : (basics.label || '');
  const locationCountry = isHu ? 'Magyarország' : 'Hungary';
  const location = [basics.location?.city, locationCountry].filter(Boolean).join(', ');

  const labels = {
    contact: isHu ? 'KAPCSOLAT' : 'CONTACT',
    profiles: isHu ? 'PROFILOK' : 'PROFILES',
    stack: isHu ? 'TECHNOLÓGIAI STACK' : 'CORE STACK',
    languages: isHu ? 'NYELVEK' : 'LANGUAGES',
    profile: isHu ? 'PROFIL' : 'PROFILE',
    experience: isHu ? 'SZAKMAI TAPASZTALAT' : 'SELECTED EXPERIENCE',
    experienceCont: isHu ? 'SZAKMAI TAPASZTALAT (folyt.)' : 'EXPERIENCE (CONTINUED)',
    education: isHu ? 'TANULMÁNYOK' : 'EDUCATION',
    serviceFocus: isHu ? 'FÓKUSZTERÜLETEK' : 'SERVICE FOCUS',
    email: isHu ? 'Email' : 'Email',
    web: isHu ? 'Web' : 'Web',
    locationLabel: isHu ? 'Hely' : 'Location',
  };

  const email = basics.email || '';
  const urlHref = basics.url || '';
  const urlDisplay = urlHref.replace(/^https?:\/\//, '');
  const summary = (isHu ? trHu(basics.summary) : basics.summary) || '';

  // Chips
  const chips = [
    isHu ? '15+ év tapasztalat' : '15+ years experience',
    isHu ? 'EU + US ügyfelek' : 'EU + US clients',
    isHu ? 'HU / EN / DE' : 'EN / HU / DE',
  ];

  // Left: profiles
  const profilesHtml = profiles.map(p => {
    const netLabel = p.network === 'Stack Overflow' ? 'StackOverflow' : (p.network || 'Profile');
    const display = p.username ? `@${p.username}` : String(p.url || '').replace(/^https?:\/\//, '').replace(/^www\./, '');
    const href = p.url || '#';
    return `<p><a href="${escHtml(href)}">${escHtml(netLabel)}: ${escHtml(display)}</a></p>`;
  }).join('');

  // Left: stack
  const stackHtml = (skills || []).slice(0, 6).map(group => {
    const gname = isHu ? trHu(group.name || '') : (group.name || '');
    const top = Array.isArray(group.keywords) ? group.keywords.slice(0, 12).join(', ') : '';
    return `<div class="stack-item"><div class="stack-cat">${escHtml(gname)}</div><div class="stack-kw">${escHtml(top)}</div></div>`;
  }).join('');

  // Left: languages
  const langHtml = languages.map(l => {
    if (!isHu) return `<p>${escHtml(`${l.language}: ${l.fluency}`)}</p>`;
    const fluency = l.fluency === 'Native speaker' ? 'anyanyelvi' : (l.fluency === 'Fluent' ? 'folyékony' : 'alapszint');
    const language = l.language === 'Hungarian' ? 'Magyar' : (l.language === 'English' ? 'Angol' : 'Német');
    return `<p>${escHtml(`${language}: ${fluency}`)}</p>`;
  }).join('');

  // Right: work — rendered per item, split across two pages
  const renderWorkItem = (item, isLast, maxHl) => {
    const position = (isHu ? trHu(item.position) : item.position) || '';
    const company = (isHu ? trHu(item.name) : item.name) || '';
    const dates = dateRange(item.startDate, item.endDate, locale);
    const itemSummary = (isHu ? trHu(item.summary) : item.summary) || '';
    const highlights = (Array.isArray(item.highlights) ? item.highlights : []).slice(0, maxHl);
    return `
<div class="work-item${isLast ? ' last' : ''}">
  <div class="work-header">
    <span class="work-position">${escHtml(position)}</span>
    <span class="work-date">${escHtml(dates)}</span>
  </div>
  <div class="work-company">${escHtml(company)}</div>
  ${itemSummary ? `<div class="work-summary">${escHtml(itemSummary)}</div>` : ''}
  ${highlights.map(h => `<div class="work-highlight">• ${escHtml(isHu ? trHu(h) : h)}</div>`).join('')}
</div>`;
  };
  const PAGE1_ROLES = 5;
  const page1Work = work.slice(0, PAGE1_ROLES)
    .map((item, i, arr) => renderWorkItem(item, i === arr.length - 1, 4)).join('');
  const page2WorkArr = work.slice(PAGE1_ROLES);
  const page2Work = page2WorkArr
    .map((item, i, arr) => renderWorkItem(item, i === arr.length - 1, 2)).join('');
  const hasPage2Work = page2WorkArr.length > 0;

  // Right: education
  const educationHtml = education.map(item => {
    const studyType = isHu ? trHu(item.studyType || '') : (item.studyType || '');
    return `
<div class="edu-item">
  <div class="edu-institution">${escHtml(item.institution || '')}</div>
  <div class="edu-study">${escHtml(`${studyType} · ${item.area || ''}`)}</div>
  <div class="edu-date">${escHtml(dateRange(item.startDate, item.endDate, locale))}</div>
</div>`;
  }).join('');

  // Right: service focus
  const serviceLines = isHu ? [
    'Egyedi webalkalmazás-fejlesztés (Laravel, Vue.js, React)',
    'AI integrációs automatizálás (OpenAI, Anthropic, RAG)',
    'Architektúra tanácsadás és teljesítményoptimalizálás',
  ] : [
    'Custom web application development (Laravel, Vue.js, React)',
    'AI integration and automation (OpenAI, Anthropic, RAG)',
    'Technical architecture consulting and performance optimization',
  ];

  const photoHtml = PROFILE_IMAGE_URI
    ? `<img class="photo" src="${PROFILE_IMAGE_URI}" alt="${escHtml(name)}">`
    : `<div class="photo-placeholder"></div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { margin: 0 !important; padding: 0 !important; }
body { margin: 0 !important; padding: 0 !important; }

@page { size: A4; margin: 0; }

html, body {
  width: 210mm;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  font-family: 'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif;
  font-size: 7pt;
  color: #334155;
  background: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}
a:hover { text-decoration: underline; }

/* ── PAGE ─────────────────────────────────── */
.page {
  width: 210mm;
  height: 297mm;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── HEADER ───────────────────────────────── */
.header {
  flex-shrink: 0;
  position: relative;
  background: #f8fafc;
  border-bottom: 5px solid #e2e8f0;
  padding: 5mm 10mm 5mm 13mm;
  display: flex;
  align-items: flex-start;
  gap: 4mm;
}

.header-accent {
  position: absolute;
  left: 0; top: -4px; bottom: 0;
  width: 3.5mm;
  background: #0f766e;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.header-photo-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 1mm;
}

.photo {
  width: 24mm;
  height: 24mm;
  border-radius: 50%;
  border: 0.6mm solid #cbd5e1;
  object-fit: cover;
  background: #eef2ff;
  display: block;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
}

.photo-placeholder {
  width: 24mm;
  height: 24mm;
  border-radius: 50%;
  background: #e2e8f0;
}

.name {
  font-size: 29pt;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.4pt;
  line-height: 1.1;
  margin-bottom: 1.5mm;
}

.header-label {
  font-size: 12pt;
  font-weight: 600;
  color: #334155;
  margin-bottom: 2.5mm;
}

.header-meta {
  font-size: 7.2pt;
  font-weight: 500;
  color: #475569;
  margin-bottom: 3mm;
}

.header-meta a {
  color: #475569;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1.8mm;
}

.chip {
  display: inline-block;
  border: 0.3mm solid #94a3b8;
  border-radius: 4mm;
  padding: 1mm 3mm;
  font-size: 6.5pt;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  white-space: nowrap;
}

/* ── BODY ─────────────────────────────────── */
.body {
  flex: 1;
  display: grid;
  grid-template-columns: 55mm 1fr;
  gap: 0;
  min-height: 0;
  overflow: hidden;
}

/* ── LEFT COLUMN ──────────────────────────── */
.left {
  background: #f8fafc;
  border-right: 0.4mm solid #e2e8f0;
  padding: 5mm 5mm 5mm 7.5mm;
  overflow: hidden;
}

.left-section {
  margin-bottom: 4.8mm;
}

.left-title {
  font-size: 6.5pt;
  font-weight: 700;
  color: #0b5f59;
  letter-spacing: 1pt;
  margin-bottom: 1.5mm;
}

.left-rule {
  height: 0.3mm;
  background: #dbeafe;
  margin-bottom: 2.5mm;
}

.left-content p {
  font-size: 7.3pt;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.72;
}

.left-content a {
  color: #2f6f74;
}

.contact-label {
  font-weight: 600;
  color: #374151;
}

.stack-item {
  margin-bottom: 2.5mm;
}

.stack-cat {
  font-size: 5.8pt;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.7pt;
  margin-bottom: 0.3mm;
}

.stack-kw {
  font-size: 6.8pt;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
}

/* ── RIGHT COLUMN ─────────────────────────── */
.right {
  padding: 2.6mm 7.8mm 2.6mm 5.8mm;
  overflow: hidden;
}

.right-section {
  margin-bottom: 2.3mm;
}

.right-section-head {
  display: flex;
  align-items: center;
  gap: 2.5mm;
  margin-bottom: 1.1mm;
}

.right-accent {
  width: 1.8mm;
  height: 6.5mm;
  background: #0f766e;
  border-radius: 1mm;
  flex-shrink: 0;
}

.right-title {
  font-size: 10pt;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.2pt;
}

.right-rule {
  height: 0.3mm;
  background: #dbeafe;
  margin-bottom: 1.1mm;
}

.summary {
  font-size: 7.5pt;
  color: #2b3d52;
  line-height: 1.72;
}

/* ── WORK ITEMS ───────────────────────────── */
.work-item {
  padding-bottom: 1.8mm;
  margin-bottom: 1.8mm;
  border-bottom: 0.25mm solid #e2e8f0;
}

.work-item.last {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2mm;
  margin-bottom: 0.5mm;
}

.work-position {
  font-size: 8.5pt;
  font-weight: 700;
  color: #0f172a;
}

.work-date {
  font-size: 6.5pt;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
  flex-shrink: 0;
}

.work-company {
  font-size: 7pt;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.7mm;
}

.work-summary {
  font-size: 7.1pt;
  color: #2b3d52;
  line-height: 1.72;
  margin-bottom: 0.8mm;
}

.work-highlight {
  font-size: 6.5pt;
  color: #64748b;
  line-height: 1.6;
}

/* ── EDUCATION ────────────────────────────── */
.edu-item {
  margin-bottom: 2.4mm;
}

.edu-institution {
  font-size: 8pt;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.8mm;
}

.edu-study {
  font-size: 6.8pt;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5mm;
}

.edu-date {
  font-size: 6.5pt;
  color: #64748b;
}

/* ── SERVICE FOCUS ────────────────────────── */
.service-line {
  font-size: 7pt;
  color: #334155;
  line-height: 1.62;
}

/* ── FOOTER RULE ──────────────────────────── */
.footer-rule {
  flex-shrink: 0;
  height: 0.3mm;
  background: #e2e8f0;
  margin: 0 8mm;
}

/* ── PAGE 2 ───────────────────────────────── */
.page--two { page-break-before: always; }

.mini-header {
  flex-shrink: 0;
  position: relative;
  background: #f8fafc;
  border-bottom: 5px solid #e2e8f0;
  padding: 4mm 10mm 4mm 13mm;
  display: flex;
  align-items: center;
  gap: 3mm;
}
.mini-name { font-size: 13pt; font-weight: 700; color: #0f172a; }
.mini-label { font-size: 8pt; font-weight: 600; color: #475569; }
</style>
</head>
<body>
<div class="page">

  <header class="header">
    <div class="header-accent"></div>
    <div class="header-main">
      <h1 class="name">${escHtml(name)}</h1>
      <p class="header-label">${escHtml(label)}</p>
      <p class="header-meta">
        <a href="mailto:${escHtml(email)}">${escHtml(email)}</a>
        &nbsp;•&nbsp;
        <a href="${escHtml(urlHref)}">${escHtml(urlDisplay)}</a>
        &nbsp;•&nbsp;${escHtml(location)}
      </p>
      <div class="chips">
        ${chips.map(c => `<span class="chip">${escHtml(c)}</span>`).join('\n        ')}
      </div>
    </div>
    <div class="header-photo-wrap">
      ${photoHtml}
    </div>
  </header>

  <div class="body">

    <aside class="left">

      <div class="left-section">
        <div class="left-title">${labels.contact}</div>
        <div class="left-rule"></div>
        <div class="left-content">
          <p><span class="contact-label">${labels.email}:</span> <a href="mailto:${escHtml(email)}">${escHtml(email)}</a></p>
          <p><span class="contact-label">${labels.web}:</span> <a href="${escHtml(urlHref)}">${escHtml(urlDisplay)}</a></p>
          <p><span class="contact-label">${labels.locationLabel}:</span> ${escHtml(location)}</p>
        </div>
      </div>

      <div class="left-section">
        <div class="left-title">${labels.profiles}</div>
        <div class="left-rule"></div>
        <div class="left-content">${profilesHtml}</div>
      </div>

      <div class="left-section">
        <div class="left-title">${labels.stack}</div>
        <div class="left-rule"></div>
        <div class="left-content">${stackHtml}</div>
      </div>

      <div class="left-section">
        <div class="left-title">${labels.languages}</div>
        <div class="left-rule"></div>
        <div class="left-content">${langHtml}</div>
      </div>

    </aside>

    <main class="right">

      <div class="right-section">
        <div class="right-section-head">
          <div class="right-accent"></div>
          <h2 class="right-title">${labels.profile}</h2>
        </div>
        <div class="right-rule"></div>
        <p class="summary">${escHtml(summary)}</p>
      </div>

      <div class="right-section">
        <div class="right-section-head">
          <div class="right-accent"></div>
          <h2 class="right-title">${labels.experience}</h2>
        </div>
        <div class="right-rule"></div>
        ${page1Work}
      </div>

    </main>

  </div>

  <div class="footer-rule"></div>

</div>

<div class="page page--two">

  <header class="mini-header">
    <div class="header-accent"></div>
    <span class="mini-name">${escHtml(name)}</span>
    <span class="mini-label">— ${escHtml(label)}</span>
  </header>

  <div class="body">

    <aside class="left">

      <div class="left-section">
        <div class="left-title">${labels.education}</div>
        <div class="left-rule"></div>
        <div class="left-content">${educationHtml}</div>
      </div>

      <div class="left-section">
        <div class="left-title">${labels.serviceFocus}</div>
        <div class="left-rule"></div>
        <div class="left-content">${serviceLines.map(l => `<p class="service-line">• ${escHtml(l)}</p>`).join('\n          ')}</div>
      </div>

    </aside>

    <main class="right">

      <div class="right-section">
        <div class="right-section-head">
          <div class="right-accent"></div>
          <h2 class="right-title">${labels.experienceCont}</h2>
        </div>
        <div class="right-rule"></div>
        ${page2Work}
      </div>

    </main>

  </div>

  <div class="footer-rule"></div>

</div>
</body>
</html>`;
}

async function generatePdf(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(`  ✓ ${path.relative(rootDir, outputPath)}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  if (!fs.existsSync(resumePath)) {
    throw new Error(`Missing ${resumePath}`);
  }
  const resume = JSON.parse(fs.readFileSync(resumePath, 'utf8'));

  console.log('Generating resume PDFs with Chromium...');
  await generatePdf(buildHtml(resume, 'en'), outputPdfPath);
  await generatePdf(buildHtml(resume, 'hu'), outputHuPdfPath);
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
