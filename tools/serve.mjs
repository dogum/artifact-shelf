#!/usr/bin/env node
// Zero-dependency static server for dist/, mounted at the configured base path.
//
//   node tools/serve.mjs            serve dist/ on http://localhost:4173<base>
//   node tools/serve.mjs --watch    rebuild on changes and reload open tabs
//   PORT=8080 node tools/serve.mjs
//   HOST=0.0.0.0 npm run dev     also reachable from a phone on the same network

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../src/lib/collection.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wasm': 'application/wasm',
  '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary',
};

// Serve a directory at a mount path. Returns { server, url }.
export function serveDir(dir, { port = 0, mount = '/', inject = '', host = '127.0.0.1' } = {}) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    if (inject && p === '/__reload') return reloadStream(req, res);
    if (!p.startsWith(mount)) {
      res.writeHead(302, { Location: mount });
      return res.end();
    }
    p = p.slice(mount.length);
    let file = path.join(dir, p);
    if (!file.startsWith(dir)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!p.endsWith('/') && p !== '') { res.writeHead(301, { Location: url.pathname + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    let status = 200;
    if (!fs.existsSync(file)) {
      status = 404;
      file = path.join(dir, '404.html');
      if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    }
    const ext = path.extname(file).toLowerCase();
    let body = fs.readFileSync(file);
    if (inject && ext === '.html') body = Buffer.from(body.toString().replace(/<\/body>(?![\s\S]*<\/body>)/i, `${inject}</body>`));
    res.writeHead(status, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  });
  return new Promise((resolve) => server.listen(port, host, () => {
    resolve({ server, url: `http://localhost:${server.address().port}${mount}` });
  }));
}

const clients = new Set();
function reloadStream(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
  res.write(': hi\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const watch = process.argv.includes('--watch');
  const config = loadConfig(ROOT);
  const dist = path.join(ROOT, 'dist');
  const build = () => new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join(ROOT, 'src/build.mjs')], { stdio: 'inherit' });
    p.on('exit', resolve);
  });
  if (watch || !fs.existsSync(dist)) await build();
  const inject = watch ? `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>` : '';
  const host = process.env.HOST || '127.0.0.1';
  const { url, server } = await serveDir(dist, { port: Number(process.env.PORT || 4173), mount: config.base, inject, host });
  console.log(`\n  Artifact Shelf → ${url}${watch ? '   (watching for changes)' : ''}`);
  if (host === '0.0.0.0') {
    const { networkInterfaces } = await import('node:os');
    const lan = Object.values(networkInterfaces()).flat().find((n) => n && n.family === 'IPv4' && !n.internal);
    if (lan) console.log(`  On your phone (same Wi-Fi) → http://${lan.address}:${server.address().port}${config.base}`);
  }
  console.log('');

  if (watch) {
    let timer = 0;
    const kick = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await build();
        for (const c of clients) c.write('data: reload\n\n');
      }, 150);
    };
    for (const d of ['artifacts', 'src', 'pages', 'media']) {
      const full = path.join(ROOT, d);
      if (fs.existsSync(full)) fs.watch(full, { recursive: true }, kick);
    }
    fs.watch(path.join(ROOT, 'shelf.config.json'), kick);
  }
}
