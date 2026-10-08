#!/usr/bin/env node
// Puts a new artifact on the shelf.
//
//   node tools/add.mjs ~/Downloads/thing.html                 slug from the <title>
//   node tools/add.mjs thing.html --slug orbit-toy --shelf toys
//   node tools/add.mjs --fix <slug>                            wrap a claude.ai fragment in place
//
// New artifacts start as status: draft with a stub about.md, so nothing goes
// live until the writeup is done.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../src/lib/collection.mjs';
import { wrapFragment, detect, formatBytes, medium } from '../src/lib/detect.mjs';
import { slugify } from '../src/lib/markdown.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : null;
};
const config = loadConfig(ROOT);

if (argv[0] === '--fix') {
  const slug = argv[1];
  const file = path.join(ROOT, 'artifacts', slug || '', 'index.html');
  if (!slug || !fs.existsSync(file)) die(`no artifact called "${slug}"`);
  const src = fs.readFileSync(file, 'utf8');
  const out = wrapFragment(src, { title: slug, lang: config.language });
  if (out === src) console.log(`${slug} is already a complete document.`);
  else { fs.writeFileSync(file, out); console.log(`Wrapped ${slug}/index.html in a full HTML document.`); }
  process.exit(0);
}

const input = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
if (!input) die('usage: npm run add -- <file.html> [--slug name] [--shelf id] [--title "Title"]');
if (!fs.existsSync(input)) die(`can't find ${input}`);

let source = fs.readFileSync(input, 'utf8');
const tech0 = detect(source);
const title = flag('title') || tech0.title?.replace(/\.(tsx|jsx|html)$/i, '') || path.basename(input, path.extname(input));
const slug = flag('slug') || slugify(title) || slugify(path.basename(input, path.extname(input)));
const shelfId = flag('shelf') || 'toys';
if (!config.shelves.some((s) => s.id === shelfId)) die(`shelf must be one of: ${config.shelves.map((s) => s.id).join(', ')}`);

const dir = path.join(ROOT, 'artifacts', slug);
if (fs.existsSync(dir)) die(`artifacts/${slug} already exists. Pass --slug to pick another name.`);

source = wrapFragment(source, { title, lang: config.language });
const tech = detect(source);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), source);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dir, 'about.md'), `---
title: ${/[:#\[\]{}"']/.test(title) ? JSON.stringify(title) : title}
summary: TODO one sentence, 110–155 characters. What it is and why it's worth a click.
shelf: ${shelfId}
tags: [${medium(tech).map((m) => slugify(m)).join(', ')}]
made: ${today}
status: draft
autorun: true
---

TODO Two or three sentences: what you are looking at, and the one thing that makes it interesting.

## How to use it

- TODO the real controls, keys and gestures

## How it works

TODO The technique, named properly. Read the code; describe only what it does.
`);

console.log(`
  Added artifacts/${slug}/  (${formatBytes(tech.bytes)}, ${medium(tech).join(' · ')})
${tech0.doctype ? '' : '  · it was a fragment, so it now has a proper <!doctype html> document around it\n'}${tech.usesClaude && !tech.claudeGuarded ? '  ✗ it calls window.claude without a guard; that will throw off claude.ai\n' : ''}${tech.privateLinks.length ? `  ! it links to private claude.ai pages: ${tech.privateLinks.join(', ')}\n` : ''}
  Next:
    1. write artifacts/${slug}/about.md   (guide: docs/WRITEUPS.md), then set status: published
    2. npm run check -- ${slug}
    3. npm run capture -- ${slug}
    4. npm run dev
`);

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
