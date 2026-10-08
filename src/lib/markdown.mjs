// A compact Markdown renderer for writeups. Covers what about.md needs:
// headings, paragraphs, nested lists, fenced code, blockquotes, rules,
// GitHub-style tables, and inline code / bold / italic / links / images.

import { esc } from './html.mjs';

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function inline(text) {
  const stash = [];
  const keep = (html) => `\u0000${stash.push(html) - 1}\u0000`;
  let s = text;
  s = s.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${esc(code)}</code>`));
  s = s.replace(/<(https?:\/\/[^>\s]+)>/g, (_, url) => keep(link(url, esc(url))));
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, src, title) =>
    keep(`<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''} loading="lazy">`),
  );
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => keep(link(href, label, true)));
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?![_\w])/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[i]);
}

function link(href, label, escaped = false) {
  const h = escaped ? href : esc(href);
  const ext = /^https?:\/\//.test(href);
  return `<a href="${h}"${ext ? ' rel="noopener"' : ''}>${label}</a>`;
}

export function renderMarkdown(src, { headingOffset = 0 } = {}) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  const toc = [];
  let i = 0;

  const isBlank = (l) => !l || !l.trim();
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) { i++; continue; }

    const fence = line.match(/^```\s*([\w-]*)\s*$/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const lang = fence[1] ? ` class="language-${esc(fence[1])}"` : '';
      out.push(`<pre><code${lang}>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) {
      const level = Math.min(6, h[1].length + headingOffset);
      const id = slugify(h[2]);
      toc.push({ level, id, text: h[2] });
      out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${renderMarkdown(buf.join('\n')).html}</blockquote>`);
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const head = cells(line);
      const aligns = cells(lines[i + 1]).map((c) => (c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : ''));
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && !isBlank(lines[i])) rows.push(cells(lines[i++]));
      const td = (tag, c, k) => `<${tag}${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c)}</${tag}>`;
      out.push(
        `<div class="table-wrap"><table><thead><tr>${head.map((c, k) => td('th', c, k)).join('')}</tr></thead>` +
          `<tbody>${rows.map((r) => `<tr>${r.map((c, k) => td('td', c, k)).join('')}</tr>`).join('')}</tbody></table></div>`,
      );
      continue;
    }

    if (listRe.test(line)) {
      const block = [];
      while (i < lines.length && (listRe.test(lines[i]) || (!isBlank(lines[i]) && /^\s{2,}\S/.test(lines[i])) ||
        (isBlank(lines[i]) && i + 1 < lines.length && listRe.test(lines[i + 1])))) {
        block.push(lines[i++]);
      }
      out.push(renderList(block.filter((l) => !isBlank(l))));
      continue;
    }

    const buf = [];
    while (i < lines.length && !isBlank(lines[i]) && !/^(#{1,6}\s|```|\s*>)/.test(lines[i]) && !listRe.test(lines[i])) {
      buf.push(lines[i++].trim());
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

function renderList(lines) {
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  const items = [];
  for (const l of lines) {
    const m = l.match(listRe);
    if (m) items.push({ indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3], children: [] });
    else if (items.length) items[items.length - 1].text += ' ' + l.trim();
  }
  const root = { indent: -1, children: [] };
  const stack = [root];
  for (const it of items) {
    while (stack.length > 1 && stack[stack.length - 1].indent >= it.indent) stack.pop();
    stack[stack.length - 1].children.push(it);
    stack.push(it);
  }
  const render = (nodes) => {
    const tag = nodes[0].ordered ? 'ol' : 'ul';
    return `<${tag}>${nodes
      .map((n) => `<li>${inline(n.text)}${n.children.length ? render(n.children) : ''}</li>`)
      .join('')}</${tag}>`;
  };
  return render(root.children);
}

export function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
