import { html, raw } from '../lib/html.mjs';
import { formatBytes } from '../lib/detect.mjs';

const svg = (body, { size = 18, label } = {}) =>
  raw(
    `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${
      label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'
    }>${body}</svg>`,
  );

export const icons = {
  dice: (o) => svg('<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor"/>', o),
  sun: (o) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>', o),
  moon: (o) => svg('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>', o),
  github: (o) => svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>', o),
  left: (o) => svg('<path d="M15 5l-7 7 7 7"/>', o),
  right: (o) => svg('<path d="M9 5l7 7-7 7"/>', o),
  arrow: (o) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', o),
  expand: (o) => svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', o),
  restart: (o) => svg('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>', o),
  external: (o) => svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', o),
  download: (o) => svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', o),
  code: (o) => svg('<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>', o),
  share: (o) => svg('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"/>', o),
  embed: (o) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10l-2 2 2 2M14 10l2 2-2 2"/>', o),
  play: (o) => svg('<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>', o),
  search: (o) => svg('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>', o),
  feed: (o) => svg('<path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.2" fill="currentColor"/>', o),
};

export const brandMark = raw(
  `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect class="bm-a" x="3" y="9.5" width="8" height="11.5" rx="1.6"/><circle class="bm-b" cx="16.5" cy="16.5" r="4.5"/><path class="bm-c" d="M22.5 21l4.2-9 4.3 9z"/><rect class="bm-top" x="1" y="21" width="30" height="2.6" rx=".6"/><rect class="bm-face" x="1" y="23.4" width="30" height="3.4" rx=".6"/></svg>`,
);

export const pad = (n) => String(n).padStart(2, '0');

export function fmtDate(iso, style = 'short') {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', style === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
    : { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function poster(ctx, L, item, { eager = false, sizes = '(max-width: 700px) 70vw, 320px', cls = 'poster' } = {}) {
  const m = ctx.media(item.slug);
  const alt = `${item.title}: ${item.summary}`;
  if (m.poster) {
    return html`<img class="${cls}" src="${L(m.posterSmall || m.poster)}" srcset="${m.posterSmall ? `${L(m.posterSmall)} 640w, ` : ''}${L(m.poster)} 1280w" sizes="${sizes}" width="1280" height="800" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`;
  }
  return html`<img class="${cls} is-placeholder" src="${L(m.placeholder)}" width="1280" height="800" alt="${alt}" ${raw(eager ? '' : 'loading="lazy"')} decoding="async">`;
}

// The paper label that hangs on the shelf edge under each item.
export function tag(item, { showShelf = true, el = 'span' } = {}) {
  return html`<${raw(el)} class="tag">
    <span class="tag-meta"><span class="tag-no">No.&nbsp;${pad(item.no)}</span>${showShelf ? html`<span class="tag-shelf">${item.shelfInfo.name}</span>` : ''}</span>
    <span class="tag-title">${item.title}</span>
    <span class="tag-medium">${item.medium.join(' · ')} · ${formatBytes(item.tech.bytes)}</span>
  </${raw(el)}>`;
}

export function itemCard(ctx, L, item, { showShelf = false, sizes } = {}) {
  const live = item.autorun ? 'true' : 'false';
  return html`<li class="item" style="--hue:${item.shelfInfo.hue}">
    <a class="item-link" href="${L(`a/${item.slug}/`)}" data-slug="${item.slug}">
      <span class="item-box" data-play="${L(`a/${item.slug}/play/`)}" data-live="${live}">
        ${poster(ctx, L, item, { sizes })}
        <span class="item-live" aria-hidden="true">Live</span>
      </span>
      <span class="item-shadow" aria-hidden="true"></span>
      <span class="item-ledge" aria-hidden="true"></span>
      ${tag(item, { showShelf })}
    </a>
  </li>`;
}

export function shelfRow(ctx, L, items, { showShelf = false, label } = {}) {
  return html`<div class="shelf-unit">
    <ul class="shelf-row" role="list"${label ? html` aria-label="${label}"` : ''}>
      ${items.map((it) => itemCard(ctx, L, it, { showShelf }))}
    </ul>
    <div class="ledge" aria-hidden="true"></div>
  </div>`;
}

export function shelfGrid(ctx, L, items, { showShelf = true } = {}) {
  return html`<ul class="shelf-grid" role="list">
    ${items.map((it) => itemCard(ctx, L, it, { showShelf, sizes: '(max-width: 700px) 90vw, 360px' }))}
  </ul>`;
}

export function header(ctx, L) {
  const { config } = ctx;
  return html`<a class="skip" href="#main">Skip to content</a>
  <header class="site-head">
    <a class="brand" href="${L('')}" aria-label="${config.title}, home">${brandMark}<span class="brand-name">${config.title}</span></a>
    <nav class="site-nav" aria-label="Main">
      <a href="${L('')}#shelves">Shelves</a>
      <a href="${L('')}#index">Index</a>
      <a href="${L('about/')}">About</a>
    </nav>
    <div class="site-tools">
      <a class="tool tool--dice" href="${L('random/')}" title="Pick one at random">${icons.dice()}<span>Surprise me</span></a>
      <button class="tool" type="button" data-theme-toggle title="Switch light / dark">${icons.sun()}${icons.moon()}<span class="sr">Switch light or dark theme</span></button>
      <a class="tool" href="${config.repo}" title="Source on GitHub">${icons.github()}<span class="sr">Source on GitHub</span></a>
    </div>
  </header>`;
}

export function footer(ctx, L) {
  const { config, listed } = ctx;
  const bytes = listed.reduce((s, i) => s + i.tech.bytes, 0);
  return html`<footer class="site-foot">
    <div class="foot-inner">
      <a class="brand brand--foot" href="${L('')}">${brandMark}<span class="brand-name">${config.title}</span></a>
      <p class="foot-stats">${listed.length} artifacts · ${formatBytes(bytes)} of hand-made HTML · every one a single file</p>
      <p class="foot-made">${config.madeWith}. Built by <a href="${config.author.url}">${config.author.name}</a>.</p>
      <nav class="foot-links" aria-label="Elsewhere">
        <a href="${L('about/')}">About</a>
        ${ctx.projects && ctx.projects.length ? html`<a href="${L('')}#projects">Projects</a>` : ''}
        <a href="${L('feed.xml')}">${icons.feed({ size: 15 })} Feed</a>
        <a href="${L('llms.txt')}">llms.txt</a>
        <a href="${L('index.json')}">index.json</a>
        <a href="${config.repo}">${icons.github({ size: 15 })} GitHub</a>
      </nav>
    </div>
  </footer>`;
}
