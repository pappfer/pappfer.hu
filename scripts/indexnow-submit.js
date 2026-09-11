#!/usr/bin/env node
/**
 * IndexNow submitter for pappfer.hu.
 *
 * Notifies Bing, Yandex, Seznam, Naver (and everything else in the IndexNow
 * network — one endpoint fans out to all participants) that URLs have changed.
 * Google is not an IndexNow participant; it still comes via the sitemap.
 *
 * Usage:
 *   npm run indexnow                       # submit every URL in dist/sitemap.xml
 *   npm run indexnow -- --changed          # only what the last build changed
 *   npm run indexnow -- --changed --since=HEAD~1   # ...by comparing manifests
 *   npm run indexnow -- /hu/ /en/laravel-developer/   # submit only these
 *   npm run indexnow -- --dry-run          # print the payload, send nothing
 *
 * Run it AFTER the new content is live — the engines fetch the URLs shortly
 * after the ping, and a ping for content that is not deployed yet is wasted.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://pappfer.hu';
const HOST = new URL(SITE).host;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const ROOT = path.join(__dirname, '..');

function readKey() {
  const keyPath = path.join(ROOT, 'src', 'indexnow-key.txt');
  if (!fs.existsSync(keyPath)) {
    fail('src/indexnow-key.txt is missing. Run `npm run build` to generate one, then commit it.');
  }
  const key = fs.readFileSync(keyPath, 'utf8').trim();
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    fail('src/indexnow-key.txt must contain 8-128 characters of [A-Za-z0-9-].');
  }
  return key;
}

// Written by build.js from the src/lastmod.json hash comparison, so this is
// exactly the set of pages whose content changed in the last build.
function changedUrls() {
  const pendingPath = path.join(ROOT, '.indexnow-pending.json');
  if (!fs.existsSync(pendingPath)) {
    fail('.indexnow-pending.json not found. Run `npm run build` first.');
  }
  return JSON.parse(fs.readFileSync(pendingPath, 'utf8')).urls || [];
}

// CI variant of the same question. A local build writes the pending file before
// src/lastmod.json is committed, so the two agree there — but in CI the manifest
// arrives already updated inside the commit, which makes the rebuild find no
// changes at all. Comparing the manifest against an earlier revision is what
// actually answers "what did this push change".
function urlsChangedSince(ref) {
  if (!/^[A-Za-z0-9._\/^~-]{1,200}$/.test(ref)) fail(`Invalid git ref: ${ref}`);
  const current = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'lastmod.json'), 'utf8'));
  let previous = {};
  try {
    previous = JSON.parse(execSync(`git show ${ref}:src/lastmod.json`, {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
    }));
  } catch {
    // No manifest at that revision (or the ref is unreachable in a shallow
    // clone) — every page counts as new, which errs towards over-submitting.
    console.log(`  (no src/lastmod.json at ${ref} — treating every page as changed)`);
  }
  return Object.entries(current)
    .filter(([urlPath, entry]) => !previous[urlPath] || previous[urlPath].hash !== entry.hash)
    .map(([urlPath]) => `${SITE}${urlPath}`);
}

function sitemapUrls() {
  const sitemapPath = path.join(ROOT, 'dist', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    fail('dist/sitemap.xml not found. Run `npm run build` first.');
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

// Accepts full URLs or site-relative paths, so `npm run indexnow -- /hu/` works.
function normalize(arg) {
  const url = arg.startsWith('http') ? new URL(arg) : new URL(arg, SITE);
  if (url.host !== HOST) fail(`URL is not on ${HOST}: ${arg}`);
  return url.toString();
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// The engines refuse the whole submission if the key file isn't reachable, so
// check it first — it also catches "I pinged before the deploy finished".
async function verifyKeyIsLive(key) {
  const keyUrl = `${SITE}/${key}.txt`;
  try {
    const res = await fetch(keyUrl);
    if (!res.ok) return `${keyUrl} returned HTTP ${res.status}`;
    const body = (await res.text()).trim();
    if (body !== key) return `${keyUrl} does not contain the expected key`;
    return null;
  } catch (err) {
    return `${keyUrl} could not be fetched (${err.message})`;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const changedOnly = args.includes('--changed');
  const since = (args.find(a => a.startsWith('--since=')) || '').slice('--since='.length);
  const explicit = args.filter(a => !a.startsWith('--'));

  const key = readKey();
  const urlList = explicit.length ? explicit.map(normalize)
    : since ? urlsChangedSince(since)
    : changedOnly ? changedUrls()
    : sitemapUrls();

  // Nothing changed is a normal outcome for --changed (a CSS-only deploy), not
  // a failure — otherwise it would break the deploy workflow on every such push.
  if (!urlList.length) {
    if (changedOnly || since) {
      console.log('No content changed in the last build — nothing to submit.');
      return;
    }
    fail('No URLs to submit.');
  }

  const payload = {
    host: HOST,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList
  };

  console.log(`IndexNow → ${ENDPOINT}`);
  console.log(`  host: ${HOST}`);
  console.log(`  key:  ${key} (${payload.keyLocation})`);
  console.log(`  urls: ${urlList.length}`);
  urlList.forEach(u => console.log(`    - ${u}`));

  if (dryRun) {
    console.log('\n(dry run — nothing submitted)');
    return;
  }

  const keyProblem = await verifyKeyIsLive(key);
  if (keyProblem) {
    fail(`${keyProblem}\n  Deploy the current build first — the key file must be live before submitting.`);
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });

  // 200 = accepted, 202 = accepted but the key is still being validated.
  if (res.status === 200 || res.status === 202) {
    console.log(`\n✓ Submitted ${urlList.length} URL(s) — HTTP ${res.status}`);
    return;
  }
  const body = await res.text().catch(() => '');
  fail(`IndexNow returned HTTP ${res.status}${body ? `\n  ${body.trim()}` : ''}`);
}

main().catch(err => fail(err.stack || err.message));
