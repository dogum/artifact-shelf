// A small front-matter reader for about.md files.
// Supports the YAML subset the shelf needs: scalars, quoted strings,
// inline lists [a, b], block lists (- a), booleans, numbers and comments.

export function parseFrontmatter(text) {
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const m = src.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!m) return { data: {}, body: src.trim() };
  return { data: parseYamlSubset(m[1]), body: src.slice(m[0].length).trim() };
}

export function parseYamlSubset(block) {
  const data = {};
  const lines = block.split('\n');
  let listKey = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const item = line.match(/^\s+-\s+(.*)$/) || (listKey && line.match(/^-\s+(.*)$/));
    if (item && listKey) {
      data[listKey].push(scalar(stripComment(item[1])));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) throw new Error(`front matter line ${i + 1} is not "key: value": ${line}`);
    const [, key, rest] = kv;
    const value = stripComment(rest);
    if (value === '') {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = value.startsWith('[') ? inlineList(value) : scalar(value);
      listKey = null;
    }
  }
  return data;
}

function stripComment(s) {
  let quote = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) {
      return s.slice(0, i).trim();
    }
  }
  return s.trim();
}

function inlineList(s) {
  const inner = s.trim().replace(/^\[/, '').replace(/\]$/, '');
  const out = [];
  let buf = '';
  let quote = null;
  for (const c of inner) {
    if (quote) {
      buf += c;
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      buf += c;
      quote = c;
    } else if (c === ',') {
      if (buf.trim()) out.push(scalar(buf.trim()));
      buf = '';
    } else {
      buf += c;
    }
  }
  if (buf.trim()) out.push(scalar(buf.trim()));
  return out;
}

function scalar(s) {
  const v = s.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    const inner = v.slice(1, -1);
    return v[0] === '"'
      ? inner.replace(/\\(["\\nt])/g, (_, c) => ({ n: '\n', t: '\t' })[c] ?? c)
      : inner.replace(/''/g, "'");
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}
