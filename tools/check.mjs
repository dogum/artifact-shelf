#!/usr/bin/env node
// Lints every artifact and writeup before it goes on the shelf.
//   node tools/check.mjs            all artifacts, drafts included
//   node tools/check.mjs masis      just one

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, loadShelf } from '../src/lib/collection.mjs';
import { formatBytes } from '../src/lib/detect.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const config = loadConfig(ROOT);
const shelf = loadShelf(ROOT, config, { includeDrafts: true });

const KNOWN_CDNS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com', 'esm.sh', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.tailwindcss.com', 'code.jquery.com'];
const AI_ISMS = [
  [/\bit'?s not (just )?[^.]{1,40}[,;—-]+ it'?s\b/i, '"it\'s not X, it\'s Y"'],
  [/\bmore than just an?\b/i, '"more than just a"'],
  [/\b(delve|dive into|unleash|unlock|seamless(ly)?|tapestry|testament to|realm of|elevate|effortless(ly)?|cutting-edge|mesmeri[sz]ing|stunning|breathtaking|game-changer)\b/i, null],
  [/\bwhether you'?re an? [^.]+ or an? /i, '"whether you\'re a … or a …"'],
  [/\bimagine\b/i, '"Imagine …"'],
  [/!(\s|$)/, 'exclamation mark'],
];

const byslug = new Map();
const add = (slug, level, msg) => byslug.set(slug, [...(byslug.get(slug) || []), { level, msg }]);
for (const p of shelf.problems) add(p.slug, p.level, p.msg);

for (const it of shelf.items) {
  const t = it.tech;
  if (!t.doctype) add(it.slug, 'warn', 'no <!doctype html>: looks like a claude.ai fragment (the build wraps it; npm run add -- --fix ' + it.slug + ' makes it permanent)');
  if (!t.viewport) add(it.slug, 'warn', 'no <meta name="viewport">: it will render zoomed-out on phones');
  if (t.usesClaude && !t.claudeGuarded) add(it.slug, 'error', 'calls window.claude without a guard: it will throw off claude.ai (use window.claude?.… or if (window.claude))');
  else if (t.usesClaude) add(it.slug, 'info', 'uses the claude.ai runtime behind a guard; those features stay hidden here');
  for (const link of t.privateLinks) add(it.slug, 'warn', `private claude.ai link (dead for visitors): ${link}`);
  const odd = t.hosts.filter((h) => !KNOWN_CDNS.includes(h));
  if (odd.length) add(it.slug, 'info', `loads from ${odd.join(', ')}`);
  if (t.bytes > 1.5 * 1024 * 1024) add(it.slug, 'warn', `large file: ${formatBytes(t.bytes)}`);

  const about = it.body;
  if (/\bTODO\b/.test(about + it.summary)) add(it.slug, it.status === 'published' ? 'error' : 'warn', 'about.md still has TODO placeholders');
  for (const [re, label] of AI_ISMS) {
    const m = about.match(re);
    if (m) add(it.slug, 'warn', `writeup voice: ${label || `"${m[0]}"`} (see docs/WRITEUPS.md)`);
  }
  const h2 = [...about.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase());
  if (!h2.some((h) => h.startsWith('how to use'))) add(it.slug, 'warn', 'writeup has no "## How to use it" section');
  if (!h2.some((h) => h.startsWith('how it works'))) add(it.slug, 'warn', 'writeup has no "## How it works" section');

  const mediaDir = path.join(ROOT, 'media', it.slug);
  const capFile = path.join(mediaDir, 'capture.json');
  if (!fs.existsSync(path.join(mediaDir, 'poster.webp'))) add(it.slug, 'info', 'no poster yet → npm run capture');
  else if (fs.existsSync(capFile)) {
    const cap = JSON.parse(fs.readFileSync(capFile, 'utf8'));
    if (cap.hash !== t.hash) add(it.slug, 'info', 'poster is older than the artifact → npm run capture');
  }
}

const ICON = { error: '\x1b[31m✗\x1b[0m', warn: '\x1b[33m!\x1b[0m', info: '\x1b[2m·\x1b[0m' };
let errors = 0;
let warns = 0;
const slugs = [...new Set([...shelf.items.map((i) => i.slug), ...byslug.keys()])].sort();
for (const slug of slugs) {
  if (only.length && !only.includes(slug)) continue;
  const it = shelf.items.find((i) => i.slug === slug);
  const list = byslug.get(slug) || [];
  errors += list.filter((x) => x.level === 'error').length;
  warns += list.filter((x) => x.level === 'warn').length;
  const status = it ? (it.status === 'published' ? '' : ` \x1b[2m[${it.status}]\x1b[0m`) : '';
  const head = list.some((x) => x.level !== 'info') ? slug : `\x1b[32m✓\x1b[0m ${slug}`;
  console.log(`${head}${status}${it ? `  \x1b[2m${it.shelf} · ${formatBytes(it.tech.bytes)} · ${it.words} words\x1b[0m` : ''}`);
  for (const x of list) console.log(`   ${ICON[x.level]} ${x.msg}`);
}
console.log(`\n${shelf.items.length} artifacts · ${errors} errors · ${warns} warnings`);
process.exit(errors ? 1 : 0);
