import { html, raw, jsonScript } from '../lib/html.mjs';
import { header, footer } from './parts.mjs';

// Wraps a page body in the full document: SEO head, header, footer.
export function layout(ctx, L, page) {
  const { config, site, assets } = ctx;
  const title = page.fullTitle || (page.title ? `${page.title} · ${config.title}` : config.title);
  const canonical = site.abs(page.canonical ?? '');
  const image = page.image || ctx.siteImage;
  const jsonld = (page.jsonld || []).filter(Boolean);

  return `<!doctype html>
${html`<html lang="${config.language}" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
${page.noindex ? raw('<meta name="robots" content="noindex, follow">\n') : ''}<meta property="og:site_name" content="${config.title}">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:title" content="${page.title || config.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
${image ? html`<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${page.imageAlt || page.title || config.title}">
<meta name="twitter:card" content="summary_large_image">` : raw('<meta name="twitter:card" content="summary">')}
<meta name="theme-color" content="#ECE6DA" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141518" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${L('assets/favicon.svg')}" type="image/svg+xml">
<link rel="manifest" href="${L('site.webmanifest')}">
<link rel="alternate" type="application/atom+xml" title="${config.title}" href="${L('feed.xml')}">
<link rel="preload" href="${L('assets/fonts/bricolage-grotesque-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${L(assets.css)}">
${config.verification?.google ? html`<meta name="google-site-verification" content="${config.verification.google}">\n` : ''}<script>(function(d){try{var t=localStorage.getItem('shelf-theme');if(t)d.dataset.theme=t}catch(e){}d.classList.add('js-anim');setTimeout(function(){if(!window.__shelf)d.classList.remove('js-anim')},2500)})(document.documentElement)</script>
${jsonld.map((j) => html`<script type="application/ld+json">${jsonScript(j)}</script>\n`)}<script src="${L(assets.js)}" defer></script>
</head>
<body class="${page.bodyClass || ''}">
${header(ctx, L)}
${page.body}
${footer(ctx, L)}
</body>
</html>`}
`;
}
