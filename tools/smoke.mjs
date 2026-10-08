#!/usr/bin/env node
// Smoke test for the built site.
//
//   node tools/smoke.mjs            build, then check every internal link, the JSON-LD and the feeds
//   node tools/smoke.mjs --browser  also open every page in headless Chromium and fail on script errors
//
// Exits non-zero on any failure, so it can gate a push.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../src/lib/collection.mjs';
import { serveDir } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const browser = process.argv.includes('--browser');
const fails = [];
const fail = (m) => fails.push(m);

const b = spawnSync(process.execPath, [path.join(ROOT, 'src/build.mjs')], { stdio: 'inherit' });
if (b.status) process.exit(b.status);

const pages = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
};
walk(DIST);

let links = 0;
let ld = 0;
for (const file of pages) {
  const rel = path.relative(DIST, file);
  if (/\/play\/index\.html$/.test(rel) || /^a\/[^/]+\/[^/]+\.html$/.test(rel)) continue; // artifacts themselves
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); ld++; } catch (e) { fail(`${rel}: JSON-LD does not parse (${e.message})`); }
  }
  if (rel === '404.html') continue; // absolute links by design
  const urls = [...src.matchAll(/(?:href|src)="([^"#?]+)/g)].map((m) => m[1]);
  for (const m of src.matchAll(/srcset="([^"]+)"/g)) urls.push(...m[1].split(',').map((x) => x.trim().split(' ')[0]));
  for (const u of urls) {
    if (/^(https?:|mailto:|data:)/.test(u)) continue;
    links++;
    let t = path.resolve(path.dirname(file), u);
    if (fs.existsSync(t) && fs.statSync(t).isDirectory()) t = path.join(t, 'index.html');
    if (!fs.existsSync(t)) fail(`${rel}: broken link ${u}`);
  }
}

for (const f of ['sitemap.xml', 'feed.xml', 'robots.txt', 'llms.txt', 'index.json', 'site.webmanifest', '404.html', '.nojekyll']) {
  if (!fs.existsSync(path.join(DIST, f))) fail(`missing ${f}`);
}
try { JSON.parse(fs.readFileSync(path.join(DIST, 'index.json'), 'utf8')); } catch { fail('index.json does not parse'); }
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
if (!/^<\?xml[\s\S]*<\/urlset>\s*$/.test(sitemap)) fail('sitemap.xml looks truncated');

let crawled = 0;
if (browser) {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { console.error('--browser needs Playwright: npm install && npx playwright install chromium'); process.exit(1); }
  const config = loadConfig(ROOT);
  const { server, url } = await serveDir(DIST, { mount: config.base });
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  await ctx.route('**/play/**', (r) => r.abort()); // site chrome only; artifacts have their own quirks
  for (const file of pages) {
    const rel = path.relative(DIST, file);
    if (!rel.endsWith('index.html') || rel.includes('/play/') || rel.startsWith('random/')) continue;
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(url + rel.replace(/index\.html$/, ''), { waitUntil: 'load' });
    await page.waitForTimeout(100);
    if (errs.length) fail(`${rel}: ${errs[0]}`);
    crawled++;
    await page.close();
  }
  const p = await ctx.newPage();
  const r = await p.goto(url + 'no/such/page/', { waitUntil: 'load' });
  if (r.status() !== 404) fail(`missing pages return ${r.status()}, expected 404`);
  await br.close();
  server.close();
}

console.log(`\n${pages.length} html files · ${links} internal links · ${ld} JSON-LD blocks${browser ? ` · ${crawled} pages opened in Chromium` : ''}`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('  ✓ smoke test passed');
