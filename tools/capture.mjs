#!/usr/bin/env node
// Takes the poster screenshots and share cards with headless Chromium.
//
//   node tools/capture.mjs              capture anything new or changed since its last capture
//   node tools/capture.mjs masis stave  just these
//   node tools/capture.mjs --force      recapture everything
//   node tools/capture.mjs --cards      redraw every share card from its existing poster
//                                       (numbers shift when an older piece is added or removed)
//
// Writes media/<slug>/poster.webp (1280×800), poster-640.webp, og.jpg (1200×630)
// and capture.json (the artifact hash, so unchanged artifacts are skipped next time).
// Needs the one dev dependency: npm install && npx playwright install chromium

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, loadShelf } from '../src/lib/collection.mjs';
import { serveDir } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const force = argv.includes('--force');
const listOnly = argv.includes('--list');
const cardsOnly = argv.includes('--cards');
const only = argv.filter((a) => !a.startsWith('-'));

const config = loadConfig(ROOT);
const shelf = loadShelf(ROOT, config, { includeDrafts: true });
const todo = shelf.items.filter((it) => {
  if (cardsOnly) return it.status !== 'draft' && (!only.length || only.includes(it.slug));
  if (only.length) return only.includes(it.slug);
  if (force) return true;
  const cap = path.join(ROOT, 'media', it.slug, 'capture.json');
  if (!fs.existsSync(cap) || !fs.existsSync(path.join(ROOT, 'media', it.slug, 'poster.webp'))) return true;
  return JSON.parse(fs.readFileSync(cap, 'utf8')).hash !== it.tech.hash;
});

// --list: print what needs capturing (used by CI to skip installing a browser).
if (listOnly) {
  console.log(todo.map((i) => i.slug).join(' '));
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('✗ Playwright is not installed. Run: npm install && npx playwright install chromium');
  process.exit(1);
}

const font64 = (f) => fs.readFileSync(path.join(ROOT, 'src/assets/fonts', f)).toString('base64');
const FONTS = `
@font-face{font-family:B;src:url(data:font/woff2;base64,${font64('bricolage-grotesque-latin.woff2')}) format('woff2');font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:M;src:url(data:font/woff2;base64,${font64('dm-mono-500-latin.woff2')}) format('woff2');font-weight:500}`;
const LEDGE = `background:linear-gradient(#efe2c8,#dfcaa5) top/100% 12px no-repeat,linear-gradient(#c7aa7c,#b4966a) bottom/100% 20px no-repeat;height:32px;box-shadow:0 26px 30px -20px rgba(72,46,10,.4)`;

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const { server, url: base } = await serveDir(path.join(ROOT, 'artifacts'), { mount: '/' });
const tools = await browser.newPage();
await tools.setContent('<!doctype html><title>tools</title>');

async function toWebp(png, width, height, quality = 0.84) {
  const dataUrl = await tools.evaluate(async ({ src, width, height, quality }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, width, height);
    return c.toDataURL('image/webp', quality);
  }, { src: `data:image/png;base64,${png.toString('base64')}`, width, height, quality });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function card(html, out) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: 'jpeg', quality: 86 });
  await page.close();
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function ogHtml(it, posterB64) {
  const hue = it.shelfInfo.hue;
  return `<!doctype html><html><head><style>${FONTS}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#ece6da;font-family:B;color:#1c1a16;position:relative;overflow:hidden}
.case{position:absolute;left:56px;top:54px;width:720px;height:450px;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.16),0 0 0 14px #f6f2ea,0 0 0 15px rgba(0,0,0,.14),0 40px 60px -36px rgba(0,0,0,.6)}
.case img{width:100%;height:100%;object-fit:cover;display:block}
.ledge{position:absolute;left:0;right:0;top:519px;${LEDGE}}
.tag{position:absolute;left:820px;top:96px;width:330px;background:#fbf8f1;padding:24px 24px 26px;border-radius:3px 3px 8px 8px;box-shadow:0 18px 30px -18px rgba(0,0,0,.45);transform:rotate(1.2deg)}
.tag:before{content:"";position:absolute;top:-9px;left:50%;margin-left:-24px;width:48px;height:12px;border-radius:2px;background:#3a352d}
.meta{font:500 15px M;letter-spacing:.08em;text-transform:uppercase;color:#8f8778;display:flex;justify-content:space-between}
.meta b{font-weight:500;display:flex;align-items:center;gap:8px}.meta b:before{content:"";width:11px;height:11px;border-radius:2px;background:hsl(${hue} 62% 46%)}
h1{font-weight:800;font-stretch:76%;font-size:${it.title.length > 22 ? 46 : 58}px;line-height:.95;letter-spacing:-.015em;margin:16px 0 14px}
p{font-size:21px;line-height:1.35;color:#4c473e}
.brand{position:absolute;right:52px;bottom:30px;font-weight:760;font-stretch:78%;font-size:26px;display:flex;align-items:center;gap:10px;color:#1c1a16}
.brand i{display:inline-block;width:12px;height:16px;background:#d1461b;border-radius:2px}
</style></head><body>
<div class="case"><img src="data:image/webp;base64,${posterB64}"></div>
<div class="ledge"></div>
<div class="tag"><div class="meta"><span>No. ${String(it.no || 0).padStart(2, '0')}</span><b>${esc(it.shelfInfo.name)}</b></div>
<h1>${esc(it.title)}</h1><p>${esc(it.summary.length > 120 ? it.summary.slice(0, 118).replace(/\s+\S*$/, '') + '…' : it.summary)}</p></div>
<div class="brand"><i></i>${esc(config.title)}</div>
</body></html>`;
}

function siteOgHtml(items) {
  const posters = items
    .map((it) => path.join(ROOT, 'media', it.slug, 'poster-640.webp'))
    .filter((f) => fs.existsSync(f))
    .slice(0, 3)
    .map((f) => fs.readFileSync(f).toString('base64'));
  return `<!doctype html><html><head><style>${FONTS}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#ece6da;font-family:B;color:#1c1a16;position:relative;overflow:hidden}
h1{position:absolute;left:60px;top:40px;font-weight:800;font-stretch:75%;font-size:136px;line-height:.86;letter-spacing:-.025em}
p{position:absolute;left:64px;top:300px;width:420px;font-size:25px;line-height:1.35;color:#4c473e}
.row{position:absolute;left:520px;top:258px;display:flex;gap:26px}
.row div{width:200px;height:125px;border-radius:5px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.16),0 14px 18px -12px rgba(0,0,0,.5)}
.row div:nth-child(2){transform:translateY(-6px) rotate(-1deg)}
.row img{width:100%;height:100%;object-fit:cover;display:block}
.ledge{position:absolute;left:0;right:0;top:383px;${LEDGE}}
.foot{position:absolute;left:64px;bottom:44px;font:500 18px M;letter-spacing:.06em;text-transform:uppercase;color:#847c6e}
</style></head><body>
<h1>Artifact<br>Shelf</h1>
<div class="row">${posters.map((b) => `<div><img src="data:image/webp;base64,${b}"></div>`).join('')}</div>
<div class="ledge"></div>
<p>${esc(config.tagline)}</p>
<div class="foot">${shelf.listed.length} artifacts · single HTML files · ${esc(config.url.replace(/^https?:\/\//, '') + config.base)}</div>
</body></html>`;
}

async function captureOne(it) {
  const dir = path.join(ROOT, 'media', it.slug);
  fs.mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    ...(it.capture.timezone ? { timezoneId: it.capture.timezone } : {}),
  });
  // Time-dependent artifacts (clocks, sun, sky) can pin the moment their poster shows.
  if (it.capture.time) await context.clock.setFixedTime(new Date(it.capture.time));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const t = Date.now();
  try {
    await page.goto(`${base}${it.slug}/index.html`, { waitUntil: 'load', timeout: 45000 });
  } catch (e) {
    errors.push(`load: ${e.message.split('\n')[0]}`);
  }
  if (it.capture.click) {
    await page.click(it.capture.click, { timeout: 40000 }).catch((e) => errors.push(`click ${it.capture.click}: ${e.message.split('\n')[0]}`));
  }
  await page.waitForTimeout(it.capture.wait);
  const png = await page.screenshot({ type: 'png', timeout: 120000 });
  await context.close();

  const poster = await toWebp(png, 1280, 800);
  fs.writeFileSync(path.join(dir, 'poster.webp'), poster);
  fs.writeFileSync(path.join(dir, 'poster-640.webp'), await toWebp(png, 640, 400, 0.8));
  await card(ogHtml(it, poster.toString('base64')), path.join(dir, 'og.jpg'));
  fs.writeFileSync(path.join(dir, 'capture.json'), JSON.stringify({
    hash: it.tech.hash, captured: new Date().toISOString(), wait: it.capture.wait, click: it.capture.click, time: it.capture.time,
  }, null, 2) + '\n');
  const secs = ((Date.now() - t) / 1000).toFixed(1);
  console.log(`  ✓ ${it.slug.padEnd(32)} ${secs}s${errors.length ? `  \x1b[33m(${errors.length} page error${errors.length > 1 ? 's' : ''}: ${errors[0].slice(0, 90)})\x1b[0m` : ''}`);
}

async function redrawCard(it) {
  const poster = path.join(ROOT, 'media', it.slug, 'poster.webp');
  if (!fs.existsSync(poster)) return console.log(`  · ${it.slug}: no poster yet, skipped`);
  await card(ogHtml(it, fs.readFileSync(poster).toString('base64')), path.join(ROOT, 'media', it.slug, 'og.jpg'));
  console.log(`  ✓ ${it.slug.padEnd(32)} card`);
}

if (!todo.length) console.log('All posters are up to date. (--force to recapture)');
else console.log(`${cardsOnly ? 'Redrawing cards for' : 'Capturing'} ${todo.length} artifact${todo.length > 1 ? 's' : ''}…`);

const queue = [...todo];
const workers = Array.from({ length: Math.min(3, queue.length) }, async () => {
  while (queue.length) {
    const it = queue.shift();
    try { await (cardsOnly ? redrawCard(it) : captureOne(it)); } catch (e) { console.log(`  ✗ ${it.slug}: ${e.message.split('\n')[0]}`); }
  }
});
await Promise.all(workers);

if (todo.length || cardsOnly || !fs.existsSync(path.join(ROOT, 'media/_site/og.jpg'))) {
  fs.mkdirSync(path.join(ROOT, 'media/_site'), { recursive: true });
  const pick = [...shelf.listed.filter((i) => i.featured), ...shelf.listed.filter((i) => !i.featured)];
  await card(siteOgHtml(pick), path.join(ROOT, 'media/_site/og.jpg'));
  console.log('  ✓ site share card');
}

await browser.close();
server.close();
