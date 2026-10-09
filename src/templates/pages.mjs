import { html, raw, jsonScript } from '../lib/html.mjs';
import { formatBytes } from '../lib/detect.mjs';
import { icons, poster, tag, shelfRow, shelfGrid, pad, fmtDate } from './parts.mjs';

/* ---------- structured data ---------- */

const person = (config) => ({ '@type': 'Person', name: config.author.name, url: config.author.url });

function crumbs(ctx, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ctx.site.abs(p) })),
  };
}

function itemLd(ctx, it) {
  const { config, site } = ctx;
  const m = ctx.media(it.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: it.title,
    description: it.summary,
    url: site.abs(`a/${it.slug}/`),
    applicationCategory: it.shelfInfo.schemaCategory || 'WebApplication',
    genre: it.shelfInfo.name,
    keywords: [...it.tags, ...it.medium].join(', '),
    operatingSystem: 'Any (runs in a web browser)',
    browserRequirements: 'Requires JavaScript and a modern browser',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    dateCreated: it.made,
    datePublished: it.made,
    dateModified: it.updated || it.made,
    fileSize: formatBytes(it.tech.bytes),
    author: person(config),
    creator: person(config),
    image: m.og ? site.abs(m.og) : m.poster ? site.abs(m.poster) : undefined,
    screenshot: m.poster ? site.abs(m.poster) : undefined,
    isPartOf: { '@type': 'CollectionPage', name: config.title, url: site.abs('') },
    isBasedOn: it.repoUrl ? { '@type': 'SoftwareSourceCode', name: it.project ? it.project.name : it.repo, codeRepository: it.repoUrl } : undefined,
  };
}


/* ---------- bigger projects ---------- */

export function projectCards(ctx, L, { id = 'projects' } = {}) {
  const list = ctx.projects || [];
  if (!list.length) return '';
  const heading = list.length === 1 ? 'The bigger project' : 'Bigger projects';
  return html`<section id="${id}" class="projects" aria-labelledby="h-${id}">
    <header class="projects-head">
      <h2 id="h-${id}">${heading}</h2>
      <p>${list.length === 1 ? 'One piece on this shelf comes from a full repository' : 'Some pieces on this shelf come from full repositories'}, with skills, tests and a site of its own.</p>
    </header>
    <ul class="project-list" role="list">
      ${list.map((p) => html`<li class="project">
        ${poster(ctx, L, p.items[0], { sizes: '(max-width: 760px) 90vw, 300px', cls: 'poster project-poster' })}
        <p class="project-meta">${icons.github({ size: 14 })}<span>${p.repo}</span></p>
        <h3 class="project-name"><a href="https://github.com/${p.repo}">${p.name}</a></h3>
        <p class="project-blurb">${p.blurb}</p>
        <p class="project-onshelf">On the shelf: ${p.items.map((it, k) => html`${k ? ', ' : ''}<a href="${L(`a/${it.slug}/`)}">${it.title}</a>`)}</p>
        <p class="project-links"><a href="https://github.com/${p.repo}">Repository ${icons.external({ size: 13 })}</a>${p.url ? html`<a href="${p.url}">Live site ${icons.external({ size: 13 })}</a>` : ''}</p>
      </li>`)}
    </ul>
  </section>`;
}

/* ---------- home ---------- */

export function homePage(ctx, L) {
  const { config, listed, shelves, tags, site } = ctx;
  const featured = listed.filter((i) => i.featured);
  // Every featured piece takes a turn in the display window (one per day). Hidden cases cost
  // little: their posters are lazy-loaded and only the day's pick ever runs.
  const showcase = featured.length ? featured : listed.slice(0, 1);
  const latest = listed.reduce((d, i) => ((i.updated || i.made) > d ? i.updated || i.made : d), '');
  const bytes = listed.reduce((s, i) => s + i.tech.bytes, 0);

  const data = listed.map((i) => ({
    s: i.slug,
    t: i.title,
    sh: i.shelf,
    u: L(`a/${i.slug}/`),
    p: L(`a/${i.slug}/play/`),
    i: L(ctx.media(i.slug).posterSmall || ctx.media(i.slug).poster || ctx.media(i.slug).placeholder),
    a: i.autorun,
  }));

  const body = html`<main id="main" class="home">
  <section class="window" aria-labelledby="window-title">
    <div class="window-copy">
      <p class="eyebrow"><span class="dot"></span>${listed.length} things on the shelf · updated ${fmtDate(latest)}</p>
      <h1 id="window-title" class="display"><span class="drop" style="--i:0">Pick</span> <span class="drop" style="--i:1">one</span> <span class="drop" style="--i:2">up.</span></h1>
      <div class="display-ledge" aria-hidden="true"></div>
      <p class="lede">${config.description}</p>
      <div class="cta">
        <a class="btn btn--primary" href="#shelves">Browse the shelves ${icons.arrow({ size: 16 })}</a>
        <a class="btn" href="${L('random/')}">${icons.dice({ size: 16 })} Surprise me</a>
      </div>
      <dl class="window-stats">
        <div><dt>Artifacts</dt><dd>${pad(listed.length)}</dd></div>
        <div><dt>Shelves</dt><dd>${pad(shelves.length)}</dd></div>
        <div><dt>Total weight</dt><dd>${formatBytes(bytes)}</dd></div>
        <div><dt>Build step</dt><dd>None</dd></div>
      </dl>
    </div>
    <div class="window-cases" data-showcase>
      ${showcase.map((it, k) => html`<figure class="case" data-case="${k}" data-slug="${it.slug}" style="--hue:${it.shelfInfo.hue}"${k ? raw(' hidden') : ''}>
        <div class="case-glass" data-play="${L(`a/${it.slug}/play/`)}" data-autorun="${it.autorun ? 'true' : 'false'}" data-title="${it.title}">
          ${poster(ctx, L, it, { eager: k === 0, sizes: '(max-width: 900px) 92vw, 720px', cls: 'poster case-poster' })}
          <button class="case-run" type="button">${icons.play({ size: 16 })}<span>Run it here</span></button>
          <span class="case-sheen" aria-hidden="true"></span>
        </div>
        <div class="case-base" aria-hidden="true"></div>
        <figcaption class="case-label">
          <a href="${L(`a/${it.slug}/`)}">${tag(it)}</a>
          <span class="case-sum">${it.summary}</span>
          <a class="case-open" href="${L(`a/${it.slug}/`)}">Open ${it.title} ${icons.arrow({ size: 14 })}</a>
        </figcaption>
      </figure>`)}
    </div>
  </section>

  <div id="shelves" class="shelves">
    ${shelves.map((s) => html`<section class="shelf" id="shelf-${s.id}" style="--hue:${s.hue}" aria-labelledby="h-${s.id}">
      <header class="shelf-head">
        <h2 id="h-${s.id}"><a href="${L(`shelf/${s.id}/`)}">${s.name}</a></h2>
        <span class="shelf-count">${pad(s.items.length)}</span>
        <p class="shelf-blurb">${s.blurb}</p>
        <div class="shelf-nav">
          <a class="shelf-all" href="${L(`shelf/${s.id}/`)}">Whole shelf ${icons.arrow({ size: 14 })}</a>
          <button type="button" class="nudge" data-nudge="-1" aria-label="Scroll ${s.name} left">${icons.left({ size: 16 })}</button>
          <button type="button" class="nudge" data-nudge="1" aria-label="Scroll ${s.name} right">${icons.right({ size: 16 })}</button>
        </div>
      </header>
      ${shelfRow(ctx, L, s.items, { label: s.name })}
    </section>`)}
  </div>

  ${projectCards(ctx, L)}

  <section id="index" class="index" aria-labelledby="h-index">
    <header class="index-head">
      <h2 id="h-index">Index</h2>
      <p>Every artifact by number. Type to filter by title, tag, shelf or technique.</p>
      <div class="index-controls">
        <label class="search">${icons.search({ size: 16 })}<span class="sr">Filter the index</span>
          <input id="q" type="search" placeholder="webgl, physics, games…" autocomplete="off" spellcheck="false"><kbd>/</kbd>
        </label>
        <div class="chips" role="group" aria-label="Filter by shelf">
          <button type="button" class="chip is-on" data-shelf="">All</button>
          ${shelves.map((s) => html`<button type="button" class="chip" data-shelf="${s.id}" style="--hue:${s.hue}">${s.name}</button>`)}
        </div>
        <label class="sort"><span class="sr">Sort</span>
          <select id="sort"><option value="new">Newest</option><option value="no">By number</option><option value="az">A–Z</option><option value="size">Heaviest</option></select>
        </label>
      </div>
    </header>
    <div class="index-scroll">
    <table class="index-table">
      <thead><tr><th scope="col">No.</th><th scope="col">Artifact</th><th scope="col">Shelf</th><th scope="col">Made of</th><th scope="col" class="num">Size</th><th scope="col" class="num">Made</th></tr></thead>
      <tbody>
      ${listed.map((it) => html`<tr data-slug="${it.slug}" data-shelf="${it.shelf}" data-no="${it.no}" data-made="${it.made}" data-size="${it.tech.bytes}" data-title="${it.title.toLowerCase()}" data-search="${[it.title, it.summary, it.shelfInfo.name, ...it.tags, ...it.medium, ...it.tech.libraries].join(' ').toLowerCase()}" data-img="${L(ctx.media(it.slug).posterSmall || ctx.media(it.slug).poster || ctx.media(it.slug).placeholder)}" style="--hue:${it.shelfInfo.hue}">
        <td class="no">${pad(it.no)}</td>
        <td class="ttl"><a href="${L(`a/${it.slug}/`)}">${it.title}</a><span class="sum">${it.summary}</span></td>
        <td class="shf"><span class="hue-dot"></span>${it.shelfInfo.name}</td>
        <td class="med">${it.medium.join(' · ')}</td>
        <td class="num">${formatBytes(it.tech.bytes)}</td>
        <td class="num">${fmtDate(it.made)}</td>
      </tr>`)}
      </tbody>
    </table>
    </div>
    <p class="index-empty" hidden>Nothing on the shelf matches that. Try a technique like “canvas” or a shelf name.</p>
    <img class="peek" alt="" aria-hidden="true" hidden>
  </section>

  <section class="tagwall" aria-labelledby="h-tags">
    <h2 id="h-tags">Tags</h2>
    <ul class="tagwall-list" role="list">
      ${tags.filter((t) => t.items.length > 1).map((t) => html`<li><a href="${L(`tag/${t.id}/`)}">${t.id}<span>${t.items.length}</span></a></li>`)}
    </ul>
    ${tags.some((t) => t.items.length === 1) ? html`<details class="tagwall-more"><summary>${tags.filter((t) => t.items.length === 1).length} more tags with one artifact each</summary>
      <ul class="tagwall-list" role="list">
        ${tags.filter((t) => t.items.length === 1).map((t) => html`<li><a href="${L(`tag/${t.id}/`)}">${t.id}<span>1</span></a></li>`)}
      </ul>
    </details>` : ''}
  </section>
  <script type="application/json" id="shelf-data">${jsonScript(data)}</script>
</main>`;

  return {
    path: 'index.html',
    canonical: '',
    fullTitle: `${config.title} · ${config.tagline}`,
    title: config.title,
    description: config.description,
    bodyClass: 'is-home',
    body,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.title,
        url: site.abs(''),
        description: config.description,
        author: person(config),
        inLanguage: config.language,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: config.title,
        url: site.abs(''),
        description: config.description,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: listed.length,
          itemListElement: listed.map((it, k) => ({ '@type': 'ListItem', position: k + 1, url: site.abs(`a/${it.slug}/`), name: it.title })),
        },
      },
    ],
  };
}

/* ---------- item ---------- */

export function itemPage(ctx, L, it) {
  const { config, site } = ctx;
  const m = ctx.media(it.slug);
  const stage = it.stage || it.shelfInfo.stage || 'wide';
  const playUrl = L(`a/${it.slug}/play/`);
  const sourceUrl = `${config.repo}/blob/${config.branch}/artifacts/${it.slug}/index.html`;
  const embed = `<iframe src="${site.abs(`a/${it.slug}/play/`)}" title="${it.title.replace(/"/g, '&quot;')}" width="960" height="600" style="border:0;max-width:100%" allow="fullscreen" loading="lazy"></iframe>`;

  const body = html`<main id="main" class="item-page" style="--hue:${it.shelfInfo.hue}">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="${L('')}">${config.title}</a><span aria-hidden="true">/</span>
    <a href="${L(`shelf/${it.shelf}/`)}">${it.shelfInfo.name}</a><span aria-hidden="true">/</span>
    <span aria-current="page">${it.title}</span>
  </nav>

  <header class="item-head">
    <p class="eyebrow"><span class="dot"></span>No. ${pad(it.no)} · ${it.shelfInfo.name} · ${fmtDate(it.made, 'long')}</p>
    <h1 class="item-title">${it.title}</h1>
    <p class="lede">${it.summary}</p>
    ${it.repoUrl ? html`<p class="item-project">
      <a class="item-project-main" href="${it.repoUrl}">${icons.github({ size: 16 })}<span>Part of <strong>${it.project ? it.project.name : it.repo}</strong> on GitHub</span>${icons.external({ size: 13 })}</a>
      ${it.links.map((l) => html`<a href="${l.url}">${l.label} ${icons.external({ size: 13 })}</a>`)}
    </p>` : it.links.length ? html`<p class="item-project">${it.links.map((l) => html`<a href="${l.url}">${l.label} ${icons.external({ size: 13 })}</a>`)}</p>` : ''}
  </header>

  <section class="stage stage--${stage}" aria-label="${it.title}, running">
    <div class="stage-frame" data-src="${playUrl}" data-title="${it.title}">
      ${it.autorun
        ? html`<iframe class="stage-iframe" src="${playUrl}" title="${it.title}" allow="fullscreen; autoplay; clipboard-write; gamepad; accelerometer; gyroscope; geolocation; camera" allowfullscreen></iframe>`
        : html`${poster(ctx, L, it, { eager: true, sizes: '(max-width: 1100px) 100vw, 1100px', cls: 'poster stage-poster' })}
          <button class="stage-run" type="button">${icons.play({ size: 18 })}<span>Run ${it.title}</span></button>`}
    </div>
    <div class="case-base" aria-hidden="true"></div>
    ${it.tech.gl ? html`<aside class="gl-note" data-gl="${it.tech.gl}" role="note" hidden>
      <span class="gl-note-meta">Runs on the graphics card</span>
      <span class="gl-note-text">This piece draws with ${it.tech.gl === 'webgl2' ? 'WebGL2' : 'WebGL'}, which this browser isn't making available. It's best seen in a current browser or on another device.</span>
    </aside>` : ''}
    <div class="stage-bar" role="toolbar" aria-label="Artifact controls">
      <button type="button" class="sbtn" data-act="restart" title="Restart (R)">${icons.restart({ size: 16 })}<span>Restart</span></button>
      <button type="button" class="sbtn" data-act="fullscreen" title="Fullscreen (F)">${icons.expand({ size: 16 })}<span>Fullscreen</span></button>
      <a class="sbtn" href="${playUrl}" target="_blank" rel="noopener">${icons.external({ size: 16 })}<span>Open on its own</span></a>
      <span class="sbar-gap"></span>
      <a class="sbtn" href="${L(`a/${it.slug}/${it.slug}.html`)}" download="${it.slug}.html">${icons.download({ size: 16 })}<span>Download .html</span></a>
      <a class="sbtn" href="${sourceUrl}">${icons.code({ size: 16 })}<span>Source</span></a>
      <button type="button" class="sbtn" data-act="share">${icons.share({ size: 16 })}<span>Share</span></button>
      <button type="button" class="sbtn" data-act="embed">${icons.embed({ size: 16 })}<span>Embed</span></button>
    </div>
  </section>

  <div class="item-body">
    <article class="prose">
      ${raw(it.html)}
    </article>
    <aside class="label-card" aria-label="Details">
      <div class="label">
        <div class="label-top"><span>No.&nbsp;${pad(it.no)}</span><a href="${L(`shelf/${it.shelf}/`)}">${it.shelfInfo.name}</a></div>
        <p class="label-title">${it.title}</p>
        <dl class="label-dl">
          <div><dt>Made</dt><dd><time datetime="${it.made}">${fmtDate(it.made)}</time></dd></div>
          ${it.updated ? html`<div><dt>Updated</dt><dd><time datetime="${it.updated}">${fmtDate(it.updated)}</time></dd></div>` : ''}
          <div><dt>Made of</dt><dd>${it.medium.join(', ')}</dd></div>
          ${it.tech.libraries.length ? html`<div><dt>Libraries</dt><dd>${it.tech.libraries.join(', ')}</dd></div>` : ''}
          <div><dt>File</dt><dd>1 HTML file, ${formatBytes(it.tech.bytes)} <span class="muted">(${formatBytes(it.tech.gzip)} gzipped)</span></dd></div>
          <div><dt>Lines</dt><dd>${it.tech.lines.toLocaleString('en-US')}</dd></div>
          ${it.repoUrl ? html`<div><dt>Project</dt><dd><a href="${it.repoUrl}">${it.project ? it.project.name : it.repo}</a></dd></div>` : ''}
        </dl>
        <ul class="label-tags" role="list">${it.tags.map((t) => html`<li><a href="${L(`tag/${t}/`)}">#${t}</a></li>`)}</ul>
        <p class="label-made">${config.madeWith}.</p>
      </div>
    </aside>
  </div>

  ${it.related.length ? html`<section class="more" aria-labelledby="h-more">
    <h2 id="h-more">Also on the shelf</h2>
    ${shelfRow(ctx, L, it.related, { showShelf: true, label: 'Related artifacts' })}
  </section>` : ''}

  <nav class="pager" aria-label="${it.shelfInfo.name} shelf">
    ${it.prev ? html`<a class="pager-prev" rel="prev" href="${L(`a/${it.prev.slug}/`)}" data-key="prev">${icons.left({ size: 16 })}<span><small>Newer on ${it.shelfInfo.name}</small>${it.prev.title}</span></a>` : html`<span></span>`}
    ${it.next ? html`<a class="pager-next" rel="next" href="${L(`a/${it.next.slug}/`)}" data-key="next"><span><small>Older on ${it.shelfInfo.name}</small>${it.next.title}</span>${icons.right({ size: 16 })}</a>` : ''}
  </nav>

  <dialog class="embed-dialog" aria-labelledby="h-embed">
    <form method="dialog">
      <h2 id="h-embed">Embed ${it.title}</h2>
      <p>Paste this where you want it to run. It loads from this site.</p>
      <textarea readonly rows="4">${embed}</textarea>
      <div class="dialog-actions"><button type="button" class="btn btn--primary" data-act="copy-embed">Copy</button><button class="btn" value="close">Close</button></div>
    </form>
  </dialog>
</main>`;

  return {
    path: `a/${it.slug}/index.html`,
    canonical: `a/${it.slug}/`,
    title: it.title,
    fullTitle: `${it.title} · ${it.shelfInfo.name} · ${config.title}`,
    description: it.summary,
    ogType: 'article',
    image: m.og ? site.abs(m.og) : m.poster ? site.abs(m.poster) : null,
    imageAlt: `${it.title}, a screenshot`,
    noindex: it.status === 'unlisted',
    bodyClass: 'is-item',
    body,
    jsonld: [itemLd(ctx, it), crumbs(ctx, [[config.title, ''], [it.shelfInfo.name, `shelf/${it.shelf}/`], [it.title, `a/${it.slug}/`]])],
  };
}

/* ---------- shelf + tag listings ---------- */

export function shelfPage(ctx, L, s) {
  const { config, site } = ctx;
  const others = ctx.shelves.filter((o) => o.id !== s.id);
  const body = html`<main id="main" class="list-page" style="--hue:${s.hue}">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${L('')}">${config.title}</a><span aria-hidden="true">/</span><span aria-current="page">${s.name}</span></nav>
  <header class="list-head">
    <p class="eyebrow"><span class="dot"></span>Shelf · ${pad(s.items.length)} artifacts</p>
    <h1 class="list-title">${s.name}</h1>
    <p class="lede">${s.blurb}</p>
  </header>
  ${shelfGrid(ctx, L, s.items, { showShelf: false })}
  <nav class="other-shelves" aria-label="Other shelves"><span>Other shelves</span>${others.map((o) => html`<a href="${L(`shelf/${o.id}/`)}" style="--hue:${o.hue}"><span class="hue-dot"></span>${o.name} <small>${o.items.length}</small></a>`)}</nav>
</main>`;
  return {
    path: `shelf/${s.id}/index.html`,
    canonical: `shelf/${s.id}/`,
    title: `${s.name}`,
    fullTitle: `${s.name}: ${s.blurb.replace(/\.$/, '')} · ${config.title}`,
    description: `${s.blurb} ${s.items.length} single-file HTML ${s.items.length === 1 ? 'artifact' : 'artifacts'}: ${s.items.slice(0, 4).map((i) => i.title).join(', ')}${s.items.length > 4 ? ' and more' : ''}.`,
    body,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${s.name} · ${config.title}`,
        url: site.abs(`shelf/${s.id}/`),
        description: s.blurb,
        mainEntity: { '@type': 'ItemList', itemListElement: s.items.map((it, k) => ({ '@type': 'ListItem', position: k + 1, url: site.abs(`a/${it.slug}/`), name: it.title })) },
      },
      crumbs(ctx, [[config.title, ''], [s.name, `shelf/${s.id}/`]]),
    ],
  };
}

export function tagPage(ctx, L, t) {
  const { config } = ctx;
  const body = html`<main id="main" class="list-page list-page--tag">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${L('')}">${config.title}</a><span aria-hidden="true">/</span><a href="${L('')}#h-tags">Tags</a><span aria-hidden="true">/</span><span aria-current="page">#${t.id}</span></nav>
  <header class="list-head">
    <p class="eyebrow"><span class="dot"></span>Tag · ${pad(t.items.length)} artifacts</p>
    <h1 class="list-title">#${t.id}</h1>
  </header>
  ${shelfGrid(ctx, L, t.items, { showShelf: true })}
</main>`;
  return {
    path: `tag/${t.id}/index.html`,
    canonical: `tag/${t.id}/`,
    title: `#${t.id}`,
    description: `Single-file HTML artifacts tagged ${t.id}: ${t.items.map((i) => i.title).join(', ')}.`,
    noindex: t.items.length < 2,
    body,
    jsonld: [crumbs(ctx, [[config.title, ''], [`#${t.id}`, `tag/${t.id}/`]])],
  };
}

/* ---------- about, random, 404 ---------- */

export function aboutPage(ctx, L, about) {
  const { config } = ctx;
  const body = html`<main id="main" class="about-page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${L('')}">${config.title}</a><span aria-hidden="true">/</span><span aria-current="page">About</span></nav>
  <header class="list-head">
    <p class="eyebrow"><span class="dot"></span>About</p>
    <h1 class="list-title">${about.title}</h1>
    <p class="lede">${about.summary}</p>
  </header>
  <article class="prose prose--about">${raw(about.html)}</article>
  ${projectCards(ctx, L, { id: 'about-projects' })}
</main>`;
  return { path: 'about/index.html', canonical: 'about/', title: about.title, description: about.summary, body };
}

export function randomPage(ctx, L) {
  const { config, listed } = ctx;
  const urls = listed.map((i) => L(`a/${i.slug}/`));
  const body = html`<main id="main" class="list-page">
  <header class="list-head"><p class="eyebrow"><span class="dot"></span>Surprise me</p><h1 class="list-title">Reaching for one…</h1></header>
  <noscript><ul class="plain-list">${listed.map((i) => html`<li><a href="${L(`a/${i.slug}/`)}">${i.title}</a></li>`)}</ul></noscript>
  <script>(function(){var u=${jsonScript(urls)};var k=Math.floor(Math.random()*u.length);try{var last=sessionStorage.getItem('shelf-last');if(u.length>1&&u[k]===last)k=(k+1)%u.length;sessionStorage.setItem('shelf-last',u[k])}catch(e){}location.replace(u[k])})()</script>
</main>`;
  return { path: 'random/index.html', canonical: 'random/', title: 'Surprise me', description: `A random artifact from ${config.title}.`, noindex: true, body };
}

export function notFoundPage(ctx, L) {
  const { config } = ctx;
  const body = html`<main id="main" class="list-page notfound">
  <header class="list-head">
    <p class="eyebrow"><span class="dot"></span>404</p>
    <h1 class="list-title">Nothing on this shelf.</h1>
    <p class="lede">That page isn’t here. It may have moved, or it was never made.</p>
    <div class="cta"><a class="btn btn--primary" href="${L('')}">Back to the shelves</a><a class="btn" href="${L('random/')}">${icons.dice({ size: 16 })} Surprise me</a></div>
  </header>
  ${shelfRow(ctx, L, ctx.listed.slice(0, 8), { showShelf: true, label: 'Recently added' })}
</main>`;
  return { path: '404.html', canonical: '404.html', title: 'Not found', description: 'Page not found.', noindex: true, body };
}
