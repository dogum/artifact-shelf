# Changelog

All notable changes to this project are documented here. Versions follow [semantic versioning](https://semver.org/).

## [Unreleased]

### Site
- `detect.mjs` no longer counts a page's own `Chart` class as Chart.js (it now looks for a Chart.js script URL or `Chart.register`), and treats three.js r163 and later as needing WebGL2, so the stage note checks for the right context.
- Artifact pages for pieces that draw with WebGL or WebGL2 check the browser for that context and, when it is missing, show a paper label by the stage saying the piece runs on the graphics card and is best seen in a current browser or on another device. `detect.mjs` now records which context a piece needs.
- The home display window rotates through every featured artifact; it was capped at seven.
- `stage: tall` in an artifact's front matter gives it the tall stage on any shelf (documented in docs/WRITEUPS.md). The Navier–Stokes page's figures now work only while on screen.

### Artifacts
- The GPU simulations (Belousov's Clock, Kármán's Street, A Great Variety of Colours, Klangfiguren, Letters from the Sky) no longer take a long or negative time step when a tab or section comes back into view, which in Letters had been shrinking the step budget on every return.
- Letters from the Sky, on the Simulations shelf with a tall stage and in the display case: snow crystals grown on the GPU from the Gravner–Griffeath lattice model and steered through Nakaya's diagram. The shelf copy fixes the frame clock that kept its step budget from adapting.
- Grand Complication Atlas, on the Explainers shelf with a wide stage and in the display case: a working 3D grand complication pocket watch in three.js that keeps real time from its own escapement, with a twelve-plate tour of how it works. The shelf copy makes live mode run from the escapement (set to the clock on open and on return) and keeps fixed-rate plates at their rate.
- Kármán's Street, A Great Variety of Colours and Klangfiguren, on the Simulations shelf with tall stages and in the display case: vortex shedding in a lattice-Boltzmann wind tunnel, thin-film colours on a draining soap film, and Chladni figures with GPU sand. The shelf copies keep time on slow GPUs, and Kármán's Street keeps running without WebGL2; each about.md lists its fixes.
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
