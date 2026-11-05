# Changelog

All notable changes to this project are documented here. Versions follow [semantic versioning](https://semver.org/).

## [Unreleased]

### Site
- A link to an item page with a hash (`a/the-office/#goal-895`) passes the hash on to the piece in the stage, so links to a spot inside a piece open there. A hash that names something on the item page itself stays with the page.
- Artifact pages let the stage's frame use the share sheet (`web-share`), so a piece's own Share button works on phones.
- `detect.mjs` no longer counts a page's own `Chart` class as Chart.js (it now looks for a Chart.js script URL or `Chart.register`), and treats three.js r163 and later as needing WebGL2, so the stage note checks for the right context.
- Artifact pages for pieces that draw with WebGL or WebGL2 check the browser for that context and, when it is missing, show a paper label by the stage saying the piece runs on the graphics card and is best seen in a current browser or on another device. `detect.mjs` now records which context a piece needs.
- The home display window rotates through every featured artifact; it was capped at seven.
- `stage: tall` in an artifact's front matter gives it the tall stage on any shelf (documented in docs/WRITEUPS.md). The Navier–Stokes page's figures now work only while on screen.

### Tools
- `capture_motion: reduce` in an artifact's front matter runs the poster browser with reduced motion, for pages that animate into the state the poster should show. The capture browser renders slowly, so a fade or a tour could be caught halfway (documented in docs/WRITEUPS.md and the shelf skill).

### Artifacts
- Never Itself, on the Explainers shelf: a working Enigma I drawn with the Anatomy isometric kit, set from a month's key sheet, with lamp light in WebGL, plug cords that follow the day's key, and a wheel stack that lifts on its spindle to show where the current crossed. A message form sends what you type as a link that the receiver's machine reads back, a flat wiring diagram traces each key press, and the page ends in the codebreakers' hut: crib-dragging a real July 1941 intercept, then reading it on the machine with that day's key.
- Three pieces on Alex Ovechkin's goals, in the Capitals' navy, red and white. The Office, on the Explainers shelf: every NHL goal he has scored on the half rink where he shot it, with a career playback, his chase past Howe and Gretzky (raw or era-adjusted), heat and finishing lenses, and tracking replays. Who Could Catch Him?, on the Simulations shelf with a tall stage: 10,000 simulated careers for each of 117 active scorers, run in the browser. The Last Three Seconds, on the Explainers shelf: the 111 goals with NHL EDGE tracking, overlaid so every puck reaches the net at once, and the timing of his one-timer. The shelf copies are data snapshots from early November 2026.
- Folded Sky, on the Explainers shelf: Yohei Nishitsuji's 280-character twigl cloud shader, run verbatim with credit and annotated fragment by fragment, beside a physically based volumetric cloud renderer you can light and fly through. It starts paused behind a Run button because both halves are GPU-heavy.
- Collision Course, on the Simulations shelf: the Milky Way and Andromeda and five classic galaxy encounters as restricted many-body simulations on the GPU, with a Local Group scene that runs hundreds of possible futures from today's measurements.
- Orbital Compute Node, on the Explainers shelf: an isometric cutaway of a 1 MW orbital data center node around 2030, with an exploding compute bay, GPU clock settings and a thermal view that follows the heat from chips to radiator. The page inlines the Anatomy isometric kit and carries its MIT notice.
- Landfall, on the Generative Art shelf and in the display case: an island world raymarched in a fragment shader from one 32-bit seed, with fjords, mesas and atolls, a physically scattered sky, clouds and water, a survey map, postcards and a Web Audio score. The shelf copy gives the page an inline icon so its request counter reads zero.
- Raindrop, on the Explainers shelf: tap anywhere in the US and follow a raindrop down the USGS river network to wherever it ends, with live gauge readings. The shelf copy keeps the camera above the terrain (MapLibre left it at sea level under the hills, which turned the screen black), smooths the hand-off from the landing to the river, steadies the view over meanders and eases the drop in and out of lakes.
- Electric Fire, on the Simulations shelf with a tall stage and in the display case: lightning grown by the dielectric breakdown model, with return strokes, thunder synthesised from the bolt's shape and Lichtenberg figures in acrylic. The shelf copy keeps real time, loads its Canvas 2D parts and checks without WebGL2, plays thunder that was on its way when sound is turned on, holds back automatic flashes under reduced motion, and drops a build note from the footer.
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
