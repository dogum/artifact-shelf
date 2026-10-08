# Artifact Shelf: notes for coding agents

A static gallery of single-file HTML artifacts. One Node script turns `artifacts/` into
a site in `dist/`; GitHub Pages serves it at `https://dogum.github.io/artifact-shelf/`.

## Commands

```bash
npm run dev            # build + serve at http://localhost:4173/artifact-shelf/ with live reload
HOST=0.0.0.0 npm run dev   # same, reachable from a phone on the LAN (prints the URL)
npm test               # build, then check every internal link, JSON-LD block and feed file
npm run test:browser   # same, plus open every page in headless Chromium; fails on script errors
npm run check          # lint artifacts + writeups (errors block the deploy)
npm run capture        # posters + share cards for new/changed artifacts (Playwright)
npm run add -- f.html --shelf toys   # put a new artifact on the shelf (starts as draft)
npm run build:portable # dist/ that opens from disk (file://) or any subpath
```

Run `npm test` before calling anything done. Run `npm run test:browser` after touching
`src/assets/shelf.js` or templates.

## Layout

```
artifacts/<slug>/index.html   the artifact, a complete single-file page (keep it as made)
artifacts/<slug>/about.md     front matter + writeup; schema and voice rules in docs/WRITEUPS.md
media/<slug>/                 poster.webp, poster-640.webp, og.jpg, capture.json (committed)
media/_site/og.jpg            the site's share card
pages/about.md                About page
shelf.config.json             title, url/base, author, shelves, projects (other repos)
src/build.mjs                 the generator
src/lib/                      frontmatter, markdown, detect (tech sniffing), collection (loading), html
src/templates/                layout.mjs, pages.mjs, parts.mjs (cards, tags, header, footer)
src/assets/                   shelf.css (all styling, design tokens at the top), shelf.js, fonts
tools/                        add, check, capture, serve, smoke
skill/artifact-shelf/         the companion Claude skill ("shelve this")
```

## Rules

- **No runtime dependencies.** The generator and site use Node built-ins and hand-written
  code only. Playwright is the single dev dependency, and only `capture` and
  `test:browser` use it. Don't add a framework, bundler or markdown library.
- **Relative links everywhere.** Templates get a linker `L(path)` per page; never hardcode
  `/artifact-shelf/`. Absolute URLs (canonical, OG, sitemap, feed) come from `site.abs()`.
  The 404 page is the one exception and uses absolute paths on purpose.
- **Artifacts are the owner's work.** Don't restyle or refactor `artifacts/*/index.html`.
  Small fixes that a public page needs (a private link, a hard-coded personal location) are
  allowed; record each one under Notes in that artifact's `about.md`.
- **Status:** `published` is listed everywhere; `unlisted` is built but not listed or in the
  sitemap; `draft` is not built and its media is not shipped.
- **Not ready for the public repo:** pieces Greg isn't ready to share live in `drafts/`
  (`drafts/artifacts/<slug>`, `drafts/media/<slug>`), which git ignores. To shelve one, move both
  folders back under `artifacts/` and `media/` and set `status: published`. A `status: draft`
  folder inside `artifacts/` still gets pushed as source, so use `drafts/` for anything private.
- **Privacy:** nothing about the owner's day job, family, home location, or private
  `claude.ai/artifact/…` links goes into a published artifact, writeup or the README.
  `origins.local.json` maps slugs to their claude.ai originals and is gitignored. Keep it
  that way.
- **Writing voice:** plain and specific; see docs/WRITEUPS.md. No "it's not X, it's Y",
  no delve/seamless/stunning, no exclamation marks, no invented backstory.
- **Look at it.** The owner is visual. After UI changes, take screenshots (desktop
  1440×900, phone 390×844, light and dark) and show them instead of describing them.
- **Never push** or create the GitHub repo unless the owner asks. He pushes releases himself.

## Design tokens

Light: plaster wall `--wall #ece6da`, ink `#1c1a16`, accent `#d1461b`, birch ledges.
Dark: `#141518` wall, walnut ledges, warm light pools behind items. Fonts: Bricolage
Grotesque (display and body, variable width/weight/opsz) and DM Mono (tags, meta).
Shelf metaphor: items stand on a ledge (`.ledge` / `.item-ledge`) with a paper `.tag`
clipped to its edge. Keep new UI inside this vocabulary (paper labels, clips, ledges).
