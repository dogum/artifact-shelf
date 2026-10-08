#!/usr/bin/env node
// Builds the static site into dist/. No dependencies beyond Node itself.
//
//   node src/build.mjs                 pretty URLs for GitHub Pages
//   node src/build.mjs --portable      explicit index.html links; open dist/ from disk or any subpath
//   node src/build.mjs --drafts        include status: draft artifacts
//   SHELF_URL / SHELF_BASE env vars    override url/base from shelf.config.json

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadConfig, loadShelf } from './lib/collection.mjs';
import { parseFrontmatter } from './lib/frontmatter.mjs';
import { renderMarkdown } from './lib/markdown.mjs';
import { wrapFragment, formatBytes } from './lib/detect.mjs';
import { xmlEsc, esc } from './lib/html.mjs';
import { layout } from './templates/layout.mjs';
import { homePage, itemPage, shelfPage, tagPage, aboutPage, randomPage, notFoundPage } from './templates/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const portable = args.has('--portable');
const includeDrafts = args.has('--drafts');
const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT = path.resolve(ROOT, outArg ? outArg.slice(6) : 'dist');

const t0 = Date.now();
const config = loadConfig(ROOT);
const shelf = loadShelf(ROOT, config, { includeDrafts });

for (const p of shelf.problems.filter((p) => p.level === 'error')) console.error(`✗ ${p.slug}: ${p.msg}`);
if (shelf.problems.some((p) => p.level === 'error')) {
  console.error('\nFix the errors above (npm run check lists everything).');
  process.exit(1);
}

/* ---------- url helpers ---------- */

const site = {
  abs: (p = '') => config.url + config.base + String(p).replace(/^\//, ''),
};

function linker(pagePath, { absolute = false } = {}) {
  const depth = pagePath.split('/').length - 1;
  const prefix = absolute ? config.base : depth ? '../'.repeat(depth) : '';
  return (to = '') => {
    let t = String(to).replace(/^\//, '');
    if (/^(https?:)?\/\//.test(t) || t.startsWith('#') || t.startsWith('mailto:')) return t;
    const [p, hash = ''] = t.split('#');
    let q = p;
    if (portable && !absolute && (q === '' || q.endsWith('/'))) q += 'index.html';
    const out = prefix + q;
    return (out || './') + (hash ? '#' + hash : '');
  };
}

/* ---------- output helpers ---------- */

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const write = (rel, content) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const copyDir = (from, to) => fs.existsSync(from) && fs.cpSync(from, to, { recursive: true });
const hashOf = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0, 10);

/* ---------- assets + media ---------- */

copyDir(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'));
const assets = {
  css: `assets/shelf.css?v=${hashOf(path.join(ROOT, 'src/assets/shelf.css'))}`,
  js: `assets/shelf.js?v=${hashOf(path.join(ROOT, 'src/assets/shelf.js'))}`,
};
// Only media for what's being built, so drafts' screenshots never ship.
for (const slug of ['_site', ...shelf.items.map((i) => i.slug)]) {
  copyDir(path.join(ROOT, 'media', slug), path.join(OUT, 'media', slug));
}

function media(slug) {
  const dir = path.join(ROOT, 'media', slug);
  const has = (f) => fs.existsSync(path.join(dir, f));
  return {
    poster: has('poster.webp') ? `media/${slug}/poster.webp` : has('poster.png') ? `media/${slug}/poster.png` : has('poster.jpg') ? `media/${slug}/poster.jpg` : null,
    posterSmall: has('poster-640.webp') ? `media/${slug}/poster-640.webp` : null,
    og: has('og.jpg') ? `media/${slug}/og.jpg` : has('og.png') ? `media/${slug}/og.png` : null,
    placeholder: `media/${slug}/placeholder.svg`,
  };
}

function placeholderSvg(it) {
  const h = it.shelfInfo.hue;
  const title = esc(it.title.length > 28 ? it.title.slice(0, 27) + '…' : it.title);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
<defs><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="28" height="28" fill="hsl(${h} 32% 84%)"/><rect width="9" height="28" fill="hsl(${h} 30% 79%)"/></pattern></defs>
<rect width="1280" height="800" fill="url(#p)"/>
<rect x="390" y="190" width="500" height="340" rx="22" fill="hsl(${h} 38% 92%)" stroke="hsl(${h} 25% 30%)" stroke-opacity=".25" stroke-width="3"/>
<text x="640" y="380" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="800" font-size="64" fill="hsl(${h} 30% 22%)">${title}</text>
<text x="640" y="440" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="24" letter-spacing="3" fill="hsl(${h} 20% 35%)">NO. ${String(it.no).padStart(2, '0')} · ${esc(it.shelfInfo.name.toUpperCase())}</text>
<text x="640" y="610" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="20" fill="hsl(${h} 15% 40%)">run npm run capture for a real poster</text>
</svg>`;
}

const siteOg = ['og.jpg', 'og.png'].map((f) => `media/_site/${f}`).find((f) => fs.existsSync(path.join(ROOT, f)));
const siteOgUrl = siteOg ? site.abs(siteOg) : null;

/* ---------- the about page source ---------- */

const aboutSrc = fs.existsSync(path.join(ROOT, 'pages/about.md'))
  ? parseFrontmatter(fs.readFileSync(path.join(ROOT, 'pages/about.md'), 'utf8'))
  : { data: { title: 'About', summary: config.description }, body: '' };
const about = { title: aboutSrc.data.title || 'About', summary: aboutSrc.data.summary || config.description, html: renderMarkdown(aboutSrc.body).html };

/* ---------- context shared by templates ---------- */

const ctx = { config, site, assets, media, siteImage: siteOgUrl, ...shelf };
const pages = [];
const render = (page, L) => {
  write(page.path, layout(ctx, L, page));
  pages.push(page);
};

/* ---------- pages ---------- */

render(homePage(ctx, linker('index.html')), linker('index.html'));

for (const it of shelf.items) {
  const L = linker(`a/${it.slug}/index.html`);
  render(itemPage(ctx, L, it), L);

  // The artifact itself, untouched except for a noindex tag and a small way back.
  const playPath = `a/${it.slug}/play/index.html`;
  write(playPath, injectPlay(wrapFragment(it.source, { title: it.title, lang: config.language }), it, linker(playPath)));
  // Exactly what's in the repo, for the Download button.
  fs.copyFileSync(path.join(it.folder, 'index.html'), path.join(OUT, `a/${it.slug}/${it.slug}.html`));

  if (!media(it.slug).poster) write(`media/${it.slug}/placeholder.svg`, placeholderSvg(it));
}

for (const s of shelf.shelves) {
  const L = linker(`shelf/${s.id}/index.html`);
  render(shelfPage(ctx, L, s), L);
}
for (const t of shelf.tags) {
  const L = linker(`tag/${t.id}/index.html`);
  render(tagPage(ctx, L, t), L);
}
{
  const L = linker('about/index.html');
  render(aboutPage(ctx, L, about), L);
}
{
  const L = linker('random/index.html');
  render(randomPage(ctx, L), L);
}
{
  // GitHub Pages serves 404.html for any missing path, so its links must be absolute.
  const L = portable ? linker('404.html') : linker('404.html', { absolute: true });
  render(notFoundPage(ctx, L), L);
}

function injectPlay(source, it, L) {
  const back = L(`a/${it.slug}/`);
  const head = `<meta name="robots" content="noindex, follow">`;
  let out = /<head[^>]*>/i.test(source)
    ? source.replace(/<head[^>]*>/i, (m) => `${m}\n${head}`)
    : source.replace(/<html[^>]*>/i, (m) => `${m}\n<head>${head}</head>`);
  if (config.backlink !== false && it.backlink !== false) {
    const script = `<script>/* Artifact Shelf: a small way back when opened on its own */(function(){try{if(window.top!==window.self)return}catch(e){return}function m(){var h=document.createElement('div');h.style.cssText='position:fixed;left:12px;bottom:12px;z-index:2147483647';var r=h.attachShadow({mode:'open'});r.innerHTML='<style>:host{all:initial}div{display:flex;align-items:center;gap:2px;font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;background:#FBF8F2;color:#1C1A16;border:1px solid rgba(0,0,0,.16);border-radius:999px;box-shadow:0 2px 12px rgba(0,0,0,.18);opacity:.9}a{color:inherit;text-decoration:none;padding:8px 6px 8px 11px}a b{color:#D4471C;font-weight:600}button{all:unset;cursor:pointer;color:#857D6F;padding:8px 10px 8px 4px}</style><div><a href="${back}" title="${esc(it.title)} on ${esc(config.title)}"><b>&#8598;</b> ${esc(config.title)}</a><button aria-label="Hide">&#215;</button></div>';r.querySelector('button').onclick=function(){h.remove()};document.body.appendChild(h)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',m);else m()})();</script>`;
    out = /<\/body>/i.test(out) ? out.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${script}\n</body>`) : out + script;
  }
  return out;
}

/* ---------- machine-readable files ---------- */

const listed = shelf.listed;
const lastmod = (it) => it.updated || it.made;
const newest = listed.map(lastmod).sort().pop() || new Date().toISOString().slice(0, 10);

const urls = [
  ['', newest, '1.0'],
  ['about/', newest, '0.4'],
  ...shelf.shelves.map((s) => [`shelf/${s.id}/`, s.items.map(lastmod).sort().pop(), '0.7']),
  ...shelf.tags.filter((t) => t.items.length > 1).map((t) => [`tag/${t.id}/`, t.items.map(lastmod).sort().pop(), '0.4']),
  ...listed.map((it) => [`a/${it.slug}/`, lastmod(it), '0.9']),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, d, pr]) => `  <url><loc>${xmlEsc(site.abs(p))}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.abs('sitemap.xml')}\n`);

write('feed.xml', `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlEsc(config.title)}</title>
  <subtitle>${xmlEsc(config.description)}</subtitle>
  <link href="${xmlEsc(site.abs(''))}"/>
  <link rel="self" href="${xmlEsc(site.abs('feed.xml'))}"/>
  <id>${xmlEsc(site.abs(''))}</id>
  <updated>${newest}T12:00:00Z</updated>
  <author><name>${xmlEsc(config.author.name)}</name><uri>${xmlEsc(config.author.url)}</uri></author>
${listed.slice(0, 50).map((it) => {
    const m = media(it.slug);
    const img = m.poster ? `<p><img src="${site.abs(m.poster)}" alt="" width="640"/></p>` : '';
    return `  <entry>
    <title>${xmlEsc(it.title)}</title>
    <link href="${xmlEsc(site.abs(`a/${it.slug}/`))}"/>
    <id>${xmlEsc(site.abs(`a/${it.slug}/`))}</id>
    <published>${it.made}T12:00:00Z</published>
    <updated>${lastmod(it)}T12:00:00Z</updated>
    <category term="${xmlEsc(it.shelfInfo.name)}"/>
    <summary>${xmlEsc(it.summary)}</summary>
    <content type="html">${xmlEsc(img + `<p>${esc(it.summary)}</p>` + it.html)}</content>
  </entry>`;
  }).join('\n')}
</feed>
`);

write('index.json', JSON.stringify({
  title: config.title,
  description: config.description,
  url: site.abs(''),
  generated: new Date().toISOString(),
  count: listed.length,
  items: listed.map((it) => ({
    no: it.no,
    slug: it.slug,
    title: it.title,
    summary: it.summary,
    shelf: it.shelf,
    tags: it.tags,
    made: it.made,
    updated: it.updated,
    url: site.abs(`a/${it.slug}/`),
    play: site.abs(`a/${it.slug}/play/`),
    download: site.abs(`a/${it.slug}/${it.slug}.html`),
    poster: media(it.slug).poster ? site.abs(media(it.slug).poster) : null,
    bytes: it.tech.bytes,
    madeOf: it.medium,
    libraries: it.tech.libraries,
  })),
}, null, 2));

write('llms.txt', `# ${config.title}

> ${config.description}

Every artifact is one self-contained HTML file. Each item page explains what the artifact is, how to use it and how it works. The artifact itself runs at \`a/<slug>/play/\` and can be downloaded from \`a/<slug>/<slug>.html\`. A JSON catalog is at ${site.abs('index.json')}.

${shelf.shelves.map((s) => `## ${s.name}\n\n${s.items.map((it) => `- [${it.title}](${site.abs(`a/${it.slug}/`)}): ${it.summary}`).join('\n')}`).join('\n\n')}

${(shelf.projects || []).length ? `## Projects\n\n${shelf.projects.map((p) => `- [${p.name}](https://github.com/${p.repo}): ${p.blurb}`).join('\n')}\n\n` : ''}## Optional

- [About](${site.abs('about/')}): what this collection is and how it is built
- [Source](${config.repo}): the repository, including every artifact's HTML
`);

write('site.webmanifest', JSON.stringify({
  name: config.title,
  short_name: config.title,
  description: config.description,
  start_url: config.base,
  scope: config.base,
  display: 'standalone',
  background_color: '#ECE6DA',
  theme_color: '#ECE6DA',
  icons: [{ src: 'assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
}, null, 2));

write('.nojekyll', '');

/* ---------- report ---------- */

const warns = shelf.problems.filter((p) => p.level === 'warn');
const unl = shelf.items.filter((i) => i.status === 'unlisted').length;
console.log(`Built ${pages.length} pages for ${listed.length} artifacts${unl ? ` (+${unl} unlisted)` : ''} across ${shelf.shelves.length} shelves in ${Date.now() - t0} ms → ${path.relative(ROOT, OUT) || '.'}/${portable ? ' (portable)' : ''}`);
const noPoster = shelf.items.filter((i) => !media(i.slug).poster).map((i) => i.slug);
if (noPoster.length) console.log(`  ${noPoster.length} without posters (placeholders used): ${noPoster.join(', ')}  → npm run capture`);
if (warns.length) console.log(`  ${warns.length} warnings → npm run check`);
console.log(`  total artifact weight ${formatBytes(listed.reduce((s, i) => s + i.tech.bytes, 0))}`);
