// Sniffs an artifact's source for the libraries and browser APIs it uses,
// its size, and anything that might break once it leaves claude.ai.

import zlib from 'node:zlib';
import crypto from 'node:crypto';

const LIBS = [
  ['three.js', /three(?:\.module)?(?:\.min)?\.js|three@\d|\/three\/build|\bTHREE\.(?:WebGLRenderer|Scene|Vector3)/],
  ['p5.js', /p5(?:\.min)?\.js|p5@\d|new p5\(/],
  ['D3', /d3(?:\.v\d)?(?:\.min)?\.js|\/d3@\d|\bd3\.(?:select|scale|geo)/],
  ['Tone.js', /Tone(?:\.min)?\.js|tone@\d|\bTone\.(?:Synth|start|Transport)/],
  ['React', /react(?:-dom)?(?:\.production)?(?:\.min)?\.js|react@\d|React\.createElement|ReactDOM\.|createRoot\(/],
  ['Pyodide', /pyodide/i],
  ['KaTeX', /katex(?:\.min)?\.(?:js|css)|katex@\d/],
  // A script URL or Chart.register, not `new Chart(`: pages often have a Chart class of their own.
  ['Chart.js', /chart\.js@\d|\/Chart\.js\/\d|\/chart(?:\.umd)?(?:\.min)?\.js|Chart\.register\(/],
  ['Plotly', /plotly(?:-[\w.]+)?(?:\.min)?\.js|Plotly\.newPlot/],
  ['Matter.js', /matter(?:\.min)?\.js|Matter\.Engine/],
  ['Leaflet', /leaflet(?:\.min)?\.js|leaflet@\d|\bL\.map\(\s*['"]/],
  ['MediaPipe', /@mediapipe\//],
  ['MapLibre', /maplibre-gl/],
  ['Mermaid', /mermaid(?:\.min)?\.js|mermaid@\d/],
  ['GSAP', /gsap(?:\.min)?\.js|gsap@\d|\bgsap\.to\(/],
];

const APIS = [
  ['WebGPU', /navigator\.gpu\b/],
  ['WebGL', /getContext\(\s*['"`](?:webgl2?|experimental-webgl)['"`]|WebGLRenderer|WebGL2RenderingContext/],
  ['Canvas 2D', /getContext\(\s*['"`]2d['"`]/],
  ['SVG', /<svg[\s>]|createElementNS\([^)]*svg/],
  ['Web Audio', /AudioContext|webkitAudioContext|\bTone\./],
  ['Web Workers', /new Worker\(/],
  ['WebAssembly', /WebAssembly\.(?:instantiate|compile)/],
  ['Pointer Events', /pointerdown|pointermove/],
  ['Gamepad', /navigator\.getGamepads/],
  ['Device Motion', /devicemotion|deviceorientation/],
];

export function detect(source) {
  const libraries = LIBS.filter(([, re]) => re.test(source)).map(([n]) => n);
  const apis = APIS.filter(([, re]) => re.test(source)).map(([n]) => n);
  const bytes = Buffer.byteLength(source);
  const gzip = zlib.gzipSync(source, { level: 9 }).length;
  const hash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 16);

  const hosts = new Set();
  for (const m of source.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"'\s]+)["']|(?:from|import)\s*\(?\s*["'](https?:\/\/[^"'\s]+)["']|fetch\(\s*["'](https?:\/\/[^"'\s]+)["']/g)) {
    const u = m[1] || m[2] || m[3];
    const isLoad = !/href\s*=/.test(m[0]) || /\.css(\?|$)/.test(u) || /fonts\.googleapis/.test(u);
    if (isLoad) {
      try { hosts.add(new URL(u).host); } catch {}
    }
  }

  const usesClaude = /window\.claude/.test(source);
  // Guarded if every use sits inside or right after a check such as
  // `window.claude?.x`, `if (window.claude)` or `window.claude && …`.
  const GUARD = /window\.claude\s*\?\.|window\.claude\s*&&|if\s*\(\s*!?\s*window\.claude|typeof\s+window\.claude|&&\s*window\.claude|window\.claude\s*\?\s/;
  const claudeGuarded =
    !usesClaude ||
    [...source.matchAll(/window\.claude/g)].every((m) => GUARD.test(source.slice(Math.max(0, m.index - 400), m.index + 24)));

  const privateLinks = [...new Set([...source.matchAll(/https:\/\/claude\.ai\/(?:artifact|public\/artifacts|chat)\/[\w-]+/g)].map((m) => m[0]))];
  const title = (source.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || null;

  return {
    libraries,
    apis,
    bytes,
    gzip,
    hash,
    lines: source.split('\n').length,
    hosts: [...hosts].sort(),
    doctype: /^\s*(?:<!--[\s\S]*?-->\s*)*<!doctype html/i.test(source),
    viewport: /<meta[^>]+name=["']?viewport/i.test(source),
    title,
    usesClaude,
    claudeGuarded,
    privateLinks,
    localStorage: /localStorage/.test(source),
    // Which GPU context the piece needs, so its page can say when the browser has none.
    gl: /getContext\(\s*['"`]webgl2['"`]|WebGL2RenderingContext/.test(source) || threeRevision(source) >= 163
      ? 'webgl2'
      : apis.includes('WebGL') || libraries.includes('three.js') ? 'webgl' : null,
    animated: /requestAnimationFrame/.test(source),
  };
}

// three.js revision from a CDN URL (three@0.170.0, three.js/0.170.0, three.js/r128) or an inlined
// REVISION constant. From r163 on, three.js runs on WebGL2 only.
function threeRevision(source) {
  const m = source.match(/three(?:\.js)?(?:@|\/)(?:0\.|r)(\d{2,3})\b/) || source.match(/REVISION\s*=\s*["'](\d{2,3})/);
  return m ? Number(m[1]) : 0;
}

// The one-line "medium" shown on tags: what it is made of.
export function medium(tech) {
  const parts = [];
  for (const lib of ['three.js', 'p5.js', 'D3', 'React', 'MediaPipe', 'Pyodide', 'Tone.js', 'Matter.js', 'Leaflet', 'MapLibre', 'Plotly', 'Chart.js']) {
    if (tech.libraries.includes(lib)) parts.push(lib);
  }
  for (const api of ['WebGPU', 'WebGL', 'Canvas 2D', 'SVG', 'Web Audio', 'WebAssembly']) {
    if (tech.apis.includes(api) && !(api === 'WebGL' && parts.includes('three.js'))) parts.push(api);
  }
  if (!parts.length) parts.push('HTML + CSS');
  return parts.slice(0, 3);
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// Wrap a claude.ai-style fragment (no doctype/html/head) into a full document.
export function wrapFragment(source, { title = 'Untitled', lang = 'en' } = {}) {
  if (/^\s*(?:<!--[\s\S]*?-->\s*)*<!doctype html/i.test(source)) return source;
  if (/<html[\s>]/i.test(source)) return `<!doctype html>\n${source}`;
  // Lift the leading run of head-only tags (title, meta, link, base) into <head>.
  const lead = source.match(/^(?:\s*(?:<title[\s\S]*?<\/title>|<meta[^>]*>|<link[^>]*>|<base[^>]*>))+/i);
  const lifted = lead ? lead[0].trim().replace(/>\s+</g, '>\n<') : '';
  const rest = lead ? source.slice(lead[0].length) : source;
  const hasCharset = /<meta[^>]+charset/i.test(lifted);
  const hasViewport = /<meta[^>]+name=["']?viewport/i.test(source);
  const hasTitle = /<title[\s>]/i.test(source);
  const head = [
    hasCharset ? '' : '<meta charset="utf-8">',
    hasViewport ? '' : '<meta name="viewport" content="width=device-width, initial-scale=1">',
    hasTitle ? '' : `<title>${title.replace(/[<&]/g, '')}</title>`,
    lifted,
  ].filter(Boolean).join('\n');
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n${head}\n</head>\n<body>\n${rest.trim()}\n</body>\n</html>\n`;
}
