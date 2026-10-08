# Writing an about.md

Every artifact on the shelf has two files:

```
artifacts/<slug>/
  index.html   the artifact itself, a complete single-file HTML page
  about.md     the label and writeup that the site wraps around it
```

The artifact is the thing people play with. The writeup is the thing Google reads.
A canvas full of moving particles has almost no indexable text, so the words in
`about.md` are what make a page findable. Write them for a curious person who
arrived from a search, has never heard of you, and has ten seconds to decide
whether to click Run.

## Front matter

```yaml
---
title: Benthos Reef
summary: A living reef of point-cloud sea creatures that drift, school and feed, drawn as thousands of glowing dots with three.js.
shelf: generative-art
tags: [three-js, point-cloud, ocean, procedural, webgl]
made: 2026-09-22
updated: 2026-09-28
status: published
featured: false
autorun: true
capture_wait: 2500
capture_click: "#start"
---
```

| field | required | notes |
|---|---|---|
| `title` | yes | The artifact's own name. Keep its capitalisation (ORDINAL stays ORDINAL). |
| `summary` | yes | One sentence, 110–155 characters. Becomes the meta description, the card blurb and the share text. Say what it is and what makes it worth a click. No trailing hype. |
| `shelf` | yes | One of the shelf ids in `shelf.config.json` (`simulations`, `explainers`, `generative-art`, `games`, `toys`, `tools`). |
| `tags` | yes | 3–6 lowercase, hyphenated. Mix technique (`webgl`, `verlet-integration`) and subject (`ocean`, `rockets`). Technique tags connect artifacts across shelves. |
| `made` | yes | `YYYY-MM-DD`, when it was first made. |
| `updated` | no | Last meaningful change. |
| `status` | no | `published` (default), `unlisted` (built and reachable by URL, kept out of listings, sitemap and feed), `draft` (not built). |
| `featured` | no | `true` puts it in the rotation for the home page display window. |
| `autorun` | no | Default `true`. Set `false` for anything heavy, anything that plays sound on load, or anything that asks for input first; the item page then shows the poster with a Run button. |
| `capture_wait` | no | Milliseconds to wait before the poster screenshot. Default 2500. |
| `capture_click` | no | CSS selector to click before the poster screenshot (a Start button, a splash screen). |
| `capture_time` | no | Pin the clock for the poster, e.g. `2026-06-21T16:30:00Z`. For anything that shows the time, the sun or the sky. |
| `capture_timezone` | no | Time zone for the poster browser, e.g. `America/New_York`. |
| `repo` | no | The bigger project this belongs to: `owner/name` or a URL. Shows a "Part of … on GitHub" link on the page. If it matches an entry in `projects` in `shelf.config.json`, that project's name is used. |
| `links` | no | Extra links shown beside it, as `["Label \| https://…"]`. |

## Body

Three parts, in this order.

**Opening paragraph, no heading.** Two or three sentences. What you are looking
at, and the one thing that makes it interesting. Concrete nouns. If it simulates
something, name the something.

**`## How to use it`** A short bullet list. Use the real labels from the UI,
the real keys, the real gestures. "Drag a creature to fling it", not
"interact with the creatures".

**`## How it works`** Two to four short paragraphs on the technique. Name the
actual methods: position-based dynamics, fractional Brownian motion, a
Dijkstra frontier, a learned surrogate fit to simulator runs. This section is
where most search traffic comes from, because people search for techniques.
Only describe what the code actually does. Read it.

**`## Notes`** is optional: sources, credits, known limits, what changed
between versions.

## Voice

Plain, specific, a little dry. Write like a good museum label or a good README.

Do not use:

- "It's not X, it's Y" and its cousins ("more than just", "isn't merely")
- delve, dive into, unleash, unlock, seamless, journey, tapestry, testament,
  realm, elevate, effortless, robust, cutting-edge, stunning, mesmerizing
- "Whether you're a … or a …"
- rhetorical questions, "Imagine …", exclamation marks
- invented backstory or motives. If you don't know why it was made, don't say.
- stacked em-dashes. One per paragraph at most.

Good: "Each creature is a cloud of 4,000 points whose positions come from a
signed-distance function, so the shapes stay crisp at any zoom."

Bad: "Dive into a mesmerizing underwater world where stunning creatures come
alive in a seamless dance of light!"

## Before publishing

- No work material, no family names, no private links (`claude.ai/artifact/…`
  links are private to their owner and will be dead for visitors).
- Features that rely on the claude.ai runtime (`window.claude`) must be guarded
  so the artifact still runs on a plain web host. `npm run check` reports them.
- Run `npm run check`, then `npm run capture`, then `npm run build`.
