#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const resumePath = path.join(rootDir, 'src', 'resume.json');
const outputPdfPath = path.join(rootDir, 'src', 'resume.pdf');
const outputHuPdfPath = path.join(rootDir, 'src', 'resume-hu.pdf');
const tmpSvgPath = path.join(os.tmpdir(), 'pappfer-resume-v3.svg');
const tmpRawPdfPath = path.join(os.tmpdir(), 'pappfer-resume-v3-raw.pdf');

const PAGE = {
  width: 1240,
  height: 1754,
  margin: 64,
  headerH: 228,
  leftColW: 332
};

const THEME = {
  bg: '#ffffff',
  header: '#f3f4f6',
  headerStripe: '#d1d5db',
  leftPanel: '#fafafa',
  section: '#111827',
  line: '#d1d5db',
  text: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  leftText: '#1f2937',
  leftBody: '#475569'
};

const HU = {
  contact: 'KAPCSOLAT',
  profiles: 'PROFILOK',
  stack: 'TECHNOLÓGIAI STACK',
  languages: 'NYELVEK',
  profile: 'PROFIL',
  experience: 'SZAKMAI TAPASZTALAT',
  education: 'TANULMÁNYOK',
  serviceFocus: 'FÓKUSZTERÜLETEK',
  updated: 'Frissítve'
};

function escXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(isoDate, locale = 'en-GB') {
  if (!isoDate) return locale === 'hu-HU' ? 'Jelenleg' : 'Present';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
}

function dateRange(startDate, endDate, locale = 'en-GB') {
  return `${formatDate(startDate, locale)} - ${formatDate(endDate, locale)}`;
}

function trimText(value, max) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function wrapLines(value, maxChars) {
  const words = String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (candidate.length <= maxChars) current = candidate;
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function textLine({
  x, y, size, weight = 400, color = '#111827', text, family = 'Avenir Next, Avenir, Helvetica, Arial, sans-serif'
}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${escXml(text)}</text>`;
}

function textBlock({ x, y, lines, size, lineHeight, weight = 400, color = '#111827' }) {
  return lines.map((line, i) => textLine({
    x,
    y: y + i * lineHeight,
    size,
    weight,
    color,
    text: line
  })).join('\n');
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
    ['Secondary school', 'Középiskola']
  ]);
  return map.get(text) || text;
}

function buildSvg(resume, lang = 'en') {
  const basics = resume.basics || {};
  const work = Array.isArray(resume.work) ? resume.work.slice(0, 7) : [];
  const education = Array.isArray(resume.education) ? resume.education.slice(0, 2) : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const profiles = Array.isArray(basics.profiles) ? basics.profiles.slice(0, 4) : [];
  const allSkills = Array.isArray(resume.skills) ? resume.skills.flatMap((s) => s.keywords || []) : [];

  const rightX = PAGE.margin + PAGE.leftColW + 40;
  const rightW = PAGE.width - rightX - PAGE.margin;
  const leftX = PAGE.margin;
  const leftW = PAGE.leftColW;

  const svg = [];
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE.width}" height="${PAGE.height}" viewBox="0 0 ${PAGE.width} ${PAGE.height}">`);
  svg.push(`<rect width="${PAGE.width}" height="${PAGE.height}" fill="${THEME.bg}"/>`);

  // Header band
  svg.push(`<rect x="0" y="0" width="${PAGE.width}" height="${PAGE.headerH}" fill="${THEME.header}"/>`);
  svg.push(`<rect x="0" y="${PAGE.headerH - 8}" width="${PAGE.width}" height="8" fill="${THEME.headerStripe}"/>`);

  const baseName = String(basics.name || 'Ferenc Papp').trim();
  const name = lang === 'hu' ? 'Papp Ferenc' : baseName;
  const labelText = lang === 'hu'
    ? 'Full-Stack fejlesztő és AI integrációs szakértő'
    : (basics.label || '');
  svg.push(textLine({ x: PAGE.margin, y: 108, size: 64, weight: 700, color: '#111827', text: name }));
  svg.push(textLine({ x: PAGE.margin, y: 152, size: 26, weight: 600, color: '#374151', text: trimText(labelText, 54) }));
  const headerMeta = [
    basics.email || '',
    basics.url ? basics.url.replace(/^https?:\/\//, '') : '',
    [basics.location?.city, 'Hungary'].filter(Boolean).join(', ')
  ].filter(Boolean).join('  •  ');
  svg.push(textLine({ x: PAGE.margin, y: 194, size: 16, weight: 500, color: '#4b5563', text: headerMeta }));

  // Left column surface
  const contentTop = PAGE.headerH + 34;
  svg.push(`<rect x="${leftX}" y="${contentTop}" width="${leftW}" height="${PAGE.height - contentTop - PAGE.margin}" rx="18" ry="18" fill="${THEME.leftPanel}"/>`);

  let ly = contentTop + 42;
  const leftSection = (title) => {
    svg.push(textLine({ x: leftX + 26, y: ly, size: 17, weight: 700, color: THEME.section, text: title }));
    ly += 18;
    svg.push(`<rect x="${leftX + 26}" y="${ly}" width="${leftW - 52}" height="1" fill="${THEME.line}"/>`);
    ly += 24;
  };

  leftSection(lang === 'hu' ? HU.contact : 'CONTACT');
  const contactLines = [
    basics.email || '',
    basics.url ? basics.url.replace(/^https?:\/\//, '') : '',
    [basics.location?.city, 'Hungary'].filter(Boolean).join(', ')
  ].filter(Boolean);
  svg.push(textBlock({ x: leftX + 26, y: ly, lines: contactLines, size: 14.5, lineHeight: 23, weight: 500, color: THEME.leftText }));
  ly += contactLines.length * 23 + 18;

  leftSection(lang === 'hu' ? HU.profiles : 'PROFILES');
  const profileLines = [];
  for (const p of profiles) {
    const label = p.network === 'Stack Overflow'
      ? 'StackOverflow'
      : (p.network || 'Profile');
    const value = p.username ? `@${p.username}` : String(p.url || '').replace(/^https?:\/\//, '').replace(/^www\./, '');
    profileLines.push(...wrapLines(`${label}: ${value}`, 30));
  }
  svg.push(textBlock({ x: leftX + 26, y: ly, lines: profileLines, size: 13.2, lineHeight: 20, color: THEME.leftBody }));
  ly += profileLines.length * 20 + 18;

  leftSection(lang === 'hu' ? HU.stack : 'CORE STACK');
  const stackLines = wrapLines(allSkills.slice(0, 20).join(', '), 35).slice(0, 10);
  svg.push(textBlock({ x: leftX + 26, y: ly, lines: stackLines, size: 12.7, lineHeight: 19, color: THEME.leftBody }));
  ly += stackLines.length * 19 + 18;

  leftSection(lang === 'hu' ? HU.languages : 'LANGUAGES');
  const langLines = languages.map((l) => {
    if (lang !== 'hu') return `${l.language}: ${l.fluency}`;
    const fluency = l.fluency === 'Native speaker' ? 'anyanyelvi' : (l.fluency === 'Fluent' ? 'folyékony' : 'alapszint');
    const language = l.language === 'Hungarian' ? 'Magyar' : (l.language === 'English' ? 'Angol' : 'Német');
    return `${language}: ${fluency}`;
  });
  svg.push(textBlock({ x: leftX + 26, y: ly, lines: langLines, size: 13.5, lineHeight: 22, color: THEME.leftBody }));

  // Right column
  let ry = contentTop + 6;
  const rightSection = (title) => {
    if (ry > contentTop + 6) {
      ry += 12;
    }
    svg.push(textLine({ x: rightX, y: ry, size: 21, weight: 700, color: THEME.section, text: title }));
    ry += 12;
    svg.push(`<rect x="${rightX}" y="${ry}" width="${rightW}" height="1.5" fill="${THEME.line}"/>`);
    ry += 30;
  };

  rightSection(lang === 'hu' ? HU.profile : 'PROFILE');
  const summary = trimText(
    (lang === 'hu' ? trHu(basics.summary) : basics.summary) || 'Freelance full-stack developer focused on Laravel, Vue.js/React, Python, and practical AI integration.',
    390
  );
  const summaryLines = wrapLines(summary, 76).slice(0, 6);
  svg.push(textBlock({ x: rightX, y: ry, lines: summaryLines, size: 15.5, lineHeight: 24, color: THEME.body }));
  ry += summaryLines.length * 24 + 28;

  rightSection(lang === 'hu' ? HU.experience : 'SELECTED EXPERIENCE');
  for (const item of work) {
    if (ry > PAGE.height - 290) break;
    const title = trimText(`${item.position} — ${item.name}`, 74);
    svg.push(textLine({ x: rightX, y: ry, size: 17, weight: 700, color: THEME.text, text: title }));
    ry += 21;
    svg.push(textLine({ x: rightX, y: ry, size: 13.5, weight: 600, color: THEME.muted, text: dateRange(item.startDate, item.endDate, lang === 'hu' ? 'hu-HU' : 'en-GB') }));
    ry += 21;
    const itemSummary = trimText(lang === 'hu' ? trHu(item.summary) : item.summary || '', 250);
    const itemLines = wrapLines(itemSummary, 74).slice(0, 3);
    svg.push(textBlock({ x: rightX, y: ry, lines: itemLines, size: 13.8, lineHeight: 20, color: THEME.body }));
    ry += itemLines.length * 20 + 6;
    const highlights = Array.isArray(item.highlights) ? item.highlights.slice(0, 1) : [];
    for (const h of highlights) {
      const hi = lang === 'hu' ? trHu(h) : h;
      const hLines = wrapLines(`• ${trimText(hi, 95)}`, 73).slice(0, 2);
      svg.push(textBlock({ x: rightX, y: ry, lines: hLines, size: 12.8, lineHeight: 18, color: THEME.muted }));
      ry += hLines.length * 18 + 4;
    }
    ry += 12;
  }

  rightSection(lang === 'hu' ? HU.education : 'EDUCATION');
  for (const item of education) {
    svg.push(textLine({ x: rightX, y: ry, size: 15.8, weight: 700, color: THEME.text, text: trimText(item.institution || '', 66) }));
    ry += 20;
    const studyType = lang === 'hu' ? trHu(item.studyType || '') : (item.studyType || '');
    svg.push(textLine({
      x: rightX,
      y: ry,
      size: 13.6,
      weight: 500,
      color: THEME.body,
      text: trimText(`${studyType} · ${item.area || ''}`, 76)
    }));
    ry += 18;
    svg.push(textLine({ x: rightX, y: ry, size: 12.8, color: THEME.muted, text: dateRange(item.startDate, item.endDate, lang === 'hu' ? 'hu-HU' : 'en-GB') }));
    ry += 24;
  }

  if (ry < PAGE.height - 170) {
    rightSection(lang === 'hu' ? HU.serviceFocus : 'SERVICE FOCUS');
    const serviceLines = lang === 'hu' ? [
      '• Egyedi webalkalmazás-fejlesztés (Laravel, Vue.js, React)',
      '• AI integráció és automatizálás (OpenAI, Anthropic, RAG)',
      '• Architektúra tanácsadás és teljesítményoptimalizálás'
    ] : [
      '• Custom web application development (Laravel, Vue.js, React)',
      '• AI integration and automation (OpenAI, Anthropic, RAG)',
      '• Technical architecture consulting and performance optimization'
    ];
    svg.push(textBlock({ x: rightX, y: ry, lines: serviceLines, size: 13.8, lineHeight: 22, color: THEME.body }));
    ry += serviceLines.length * 22 + 20;
  }

  if (ry < PAGE.height - 70) {
    svg.push(`<rect x="${rightX}" y="${PAGE.height - 86}" width="${rightW}" height="1" fill="${THEME.line}"/>`);
  }

  const footerLabel = lang === 'hu' ? HU.updated : 'Last updated';
  const footer = `${footerLabel}: ${resume.meta?.lastModified || new Date().toISOString().slice(0, 10)}`;
  svg.push(textLine({ x: rightX, y: PAGE.height - 36, size: 12, color: '#94a3b8', text: footer }));
  svg.push('</svg>');

  return svg.join('\n');
}

function main() {
  if (!fs.existsSync(resumePath)) {
    throw new Error(`Missing ${resumePath}`);
  }

  const resume = JSON.parse(fs.readFileSync(resumePath, 'utf8'));
  const svgEn = buildSvg(resume, 'en');
  fs.writeFileSync(tmpSvgPath, svgEn, 'utf8');
  execFileSync('magick', ['-density', '300', tmpSvgPath, tmpRawPdfPath], { stdio: 'inherit' });
  execFileSync('ps2pdf', ['-dPDFSETTINGS=/ebook', tmpRawPdfPath, outputPdfPath], { stdio: 'inherit' });

  const svgHu = buildSvg(resume, 'hu');
  fs.writeFileSync(tmpSvgPath, svgHu, 'utf8');
  execFileSync('magick', ['-density', '300', tmpSvgPath, tmpRawPdfPath], { stdio: 'inherit' });
  execFileSync('ps2pdf', ['-dPDFSETTINGS=/ebook', tmpRawPdfPath, outputHuPdfPath], { stdio: 'inherit' });

  try {
    fs.unlinkSync(tmpSvgPath);
    fs.unlinkSync(tmpRawPdfPath);
  } catch (_) {
    // no-op cleanup
  }

  console.log(`Generated ${path.relative(rootDir, outputPdfPath)} and ${path.relative(rootDir, outputHuPdfPath)}`);
}

main();
