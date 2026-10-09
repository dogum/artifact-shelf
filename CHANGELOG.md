# Changelog

All notable changes to this project are documented here. Versions follow [semantic versioning](https://semver.org/).

## [Unreleased]

### Site
- `stage: tall` in an artifact's front matter gives it the tall stage on any shelf (documented in docs/WRITEUPS.md). The Navier–Stokes page's figures now work only while on screen.

### Artifacts
- Belousov's Clock, on the Simulations shelf and in the home display case: the Belousov–Zhabotinsky reaction run live from the Oregonator equations in WebGL2, from a stirred chemical clock to spiral waves and the heart. The shelf copy fixes slow-GPU timing and draws the non-dish figures when WebGL2 is missing.
- Forced Blowup for Navier–Stokes, on the Explainers shelf: the mathematics of the September 2026 forced blowup preprints, with figures for Burgers' equation, the Beale–Kato–Majda criterion, the Burgers vortex, the self-similar core and the multiscale ladder, and a filterable timeline of results from 1757 to 2026. It is the oldest piece on the shelf, so every other item number moves up by one.

## [0.1.0] - 2026-10-08

The first public version.

### Site
- Home page with a display window that runs one featured artifact live (desktop, after idle; the pick changes daily), shelves of items on ledges with paper tags, a bigger-projects card, an index and a tag wall.
- Hover an item on a desktop for about 0.4 s and it wakes up as a live miniature; moving away tears the iframe down.
- Index with `/` to search, shelf chips, four sort orders and filters kept in the URL.
- Artifact pages with a framed stage, Restart, Fullscreen, Open on its own, Download .html, Source, Share and Embed, keyboard shortcuts (`R`, `F`, `←`, `→`), a writeup and a details label.
- Cross-document view transitions: the poster you click grows into the stage.
- Light and dark themes, phone layouts, and a site that reads and links with JavaScript off.
- Canonical URLs, Open Graph cards, `WebApplication` and breadcrumb structured data, sitemap, Atom feed, `index.json` and `llms.txt`.

### Tools
- `npm run add` to put a new artifact on the shelf as a draft, wrapping claude.ai fragments into full documents.
- `npm run check` to lint artifacts and writeups, including unguarded `window.claude` calls and banned phrases.
- `npm run capture` for posters and share cards in headless Chromium, skipping anything unchanged; `--cards` redraws only the share cards.
- `npm run dev` with live reload, `HOST=0.0.0.0` for testing on a phone.
- `npm test` and `npm run test:browser` smoke tests, and a GitHub Pages workflow that checks, captures missing posters, builds, tests and deploys.

### Claude skill
- `skills/artifact-shelf`, packaged as a Claude Code plugin: say "shelve this" and it vets, adds, writes up, captures and shows a new artifact.

### Artifacts
- Thirteen on six shelves: Desk, by daylight; Catching Booster 12; Shortest-Path Bound Explorer; ORDINAL; Benthos; Masis & Sis; Merrow Pocket Plan; Infestation; Benthos reef; Lamplight Shadow Theater; Stave; Recipe Diagram; Mirror Cube Solver.

[0.1.0]: https://github.com/dogum/artifact-shelf/releases/tag/v0.1.0
