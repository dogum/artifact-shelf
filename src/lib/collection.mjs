// Loads every artifacts/<slug>/ folder into a list of items with derived fields.

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { renderMarkdown, plainText, slugify } from './markdown.mjs';
import { detect, medium } from './detect.mjs';

export const STATUSES = ['published', 'unlisted', 'draft'];

export function loadConfig(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'shelf.config.json'), 'utf8'));
  if (process.env.SHELF_URL) config.url = process.env.SHELF_URL;
  if (process.env.SHELF_BASE) config.base = process.env.SHELF_BASE;
  config.base = ('/' + config.base.replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');
  config.url = config.url.replace(/\/+$/, '');
  return config;
}

export function loadShelf(root, config, { includeDrafts = false } = {}) {
  const dir = path.join(root, 'artifacts');
  const problems = [];
  const items = [];
  const shelfIds = new Set(config.shelves.map((s) => s.id));
  const report = (slug, level, msg) => problems.push({ slug, level, msg });

  for (const slug of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
    const folder = path.join(dir, slug);
    if (slug.startsWith('.') || slug.startsWith('_') || !fs.statSync(folder).isDirectory()) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) report(slug, 'error', 'folder name must be a lowercase-hyphenated slug');
    const htmlPath = path.join(folder, 'index.html');
    const aboutPath = path.join(folder, 'about.md');
    if (!fs.existsSync(htmlPath)) { report(slug, 'error', 'missing index.html'); continue; }
    if (!fs.existsSync(aboutPath)) { report(slug, 'error', 'missing about.md (run: npm run add -- <file>)'); continue; }

    let data, body;
    try {
      ({ data, body } = parseFrontmatter(fs.readFileSync(aboutPath, 'utf8')));
    } catch (e) {
      report(slug, 'error', `about.md front matter: ${e.message}`);
      continue;
    }
    const source = fs.readFileSync(htmlPath, 'utf8');
    const tech = detect(source);
    const md = renderMarkdown(body, { headingOffset: 0 });

    const item = {
      slug,
      title: String(data.title ?? tech.title ?? slug),
      summary: String(data.summary ?? '').trim(),
      shelf: String(data.shelf ?? ''),
      tags: (Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []).map((t) => slugify(t)).filter(Boolean),
      made: normDate(data.made),
      updated: normDate(data.updated) || null,
      status: String(data.status ?? 'published'),
      featured: data.featured === true,
      autorun: data.autorun !== false,
      stage: data.stage || null,
      capture: {
        wait: Number(data.capture_wait ?? 2500),
        click: data.capture_click || null,
        time: data.capture_time ? String(data.capture_time) : null,
        timezone: data.capture_timezone || null,
      },
      repo: data.repo ? String(data.repo) : null,
      links: (Array.isArray(data.links) ? data.links : data.links ? [data.links] : []).map(parseLink).filter(Boolean),
      body,
      html: md.html,
      toc: md.toc,
      words: plainText(body).split(' ').filter(Boolean).length,
      source,
      tech,
      medium: medium(tech),
      folder,
    };

    if (!data.title) report(slug, 'warn', 'no title in about.md; using <title> or the slug');
    if (!item.summary) report(slug, 'error', 'summary is required');
    else if (item.summary.length < 70 || item.summary.length > 160)
      report(slug, 'warn', `summary is ${item.summary.length} chars; aim for 110–155 (it becomes the meta description)`);
    if (!shelfIds.has(item.shelf)) report(slug, 'error', `shelf "${item.shelf}" is not one of: ${[...shelfIds].join(', ')}`);
    if (!item.made) report(slug, 'error', 'made: YYYY-MM-DD is required');
    if (!STATUSES.includes(item.status)) report(slug, 'error', `status must be one of ${STATUSES.join(', ')}`);
    if (item.tags.length < 2) report(slug, 'warn', 'add a few tags (3–6) so it connects to other artifacts');
    if (item.words < 80) report(slug, 'warn', `writeup is ${item.words} words; search engines need more to go on (aim for 150+)`);

    if (item.status === 'draft' && !includeDrafts) continue;
    items.push(item);
  }

  // Shelf numbers: oldest first, stable within a day by slug.
  items.forEach((it) => (it.no = 0));
  items
    .filter((it) => it.status !== 'draft')
    .sort((a, b) => (a.made || '').localeCompare(b.made || '') || a.slug.localeCompare(b.slug))
    .forEach((it, i) => (it.no = i + 1));

  items.sort((a, b) => (b.made || '').localeCompare(a.made || '') || a.title.localeCompare(b.title));

  const listed = items.filter((i) => i.status === 'published');
  const shelves = config.shelves
    .map((s) => ({ ...s, items: listed.filter((i) => i.shelf === s.id) }))
    .filter((s) => s.items.length);

  const tagMap = new Map();
  for (const it of listed) for (const t of it.tags) tagMap.set(t, [...(tagMap.get(t) || []), it]);
  const tags = [...tagMap.entries()]
    .map(([id, its]) => ({ id, items: its }))
    .sort((a, b) => b.items.length - a.items.length || a.id.localeCompare(b.id));

  const projects = (config.projects || []).filter((p) => p.public !== false);
  for (const it of items) {
    // An artifact can belong to a bigger project: match by repo, else by project id.
    it.repoUrl = repoUrl(it.repo);
    it.project = projects.find((p) => it.repo && (p.repo === it.repo || p.id === it.repo || repoUrl(p.repo) === it.repoUrl)) || null;
    if (it.repo && !it.repoUrl) problems.push({ slug: it.slug, level: 'warn', msg: `repo "${it.repo}" isn't owner/name or a URL` });
    it.shelfInfo = config.shelves.find((s) => s.id === it.shelf) || { id: it.shelf, name: it.shelf, hue: 0 };
    it.related = listed
      .filter((o) => o !== it)
      .map((o) => ({ o, score: (o.shelf === it.shelf ? 2 : 0) + o.tags.filter((t) => it.tags.includes(t)).length }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || (b.o.made || '').localeCompare(a.o.made || ''))
      .slice(0, 6)
      .map((r) => r.o);
    const sameShelf = listed.filter((o) => o.shelf === it.shelf);
    const k = sameShelf.indexOf(it);
    it.prev = k > 0 ? sameShelf[k - 1] : null;
    it.next = k >= 0 && k < sameShelf.length - 1 ? sameShelf[k + 1] : null;
  }

  // Only projects that something on the shelf actually belongs to get shown site-wide.
  const linked = projects
    .map((p) => ({ ...p, items: listed.filter((it) => it.project && it.project.id === p.id) }))
    .filter((p) => p.items.length);
  return { items, listed, shelves, tags, problems, projects: linked };
}

function normDate(v) {
  if (!v) return '';
  const s = String(v).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

// "owner/name", "github.com/owner/name" or any https URL → a full URL.
export function repoUrl(repo) {
  if (!repo) return null;
  const r = String(repo).trim();
  if (/^https?:\/\//.test(r)) return r.replace(/\/+$/, '');
  if (/^github\.com\//.test(r)) return 'https://' + r.replace(/\/+$/, '');
  if (/^[\w.-]+\/[\w.-]+$/.test(r)) return `https://github.com/${r}`;
  return null;
}

// links: ["Label | https://…", …]
function parseLink(s) {
  const [label, url] = String(s).split('|').map((x) => x.trim());
  return url && /^https?:\/\//.test(url) ? { label, url } : null;
}
