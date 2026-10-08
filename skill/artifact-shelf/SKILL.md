---
name: artifact-shelf
description: Put an HTML artifact on an Artifact Shelf gallery repo. Use when the user says "shelve this", "put this on the shelf", "add this to Artifact Shelf", or hands over a claude.ai artifact link or .html file for the gallery.
---

# Shelving an artifact

Artifact Shelf is a static site generated from `artifacts/<slug>/index.html` plus
`artifacts/<slug>/about.md`. Your job is to get a new artifact into that shape with a
writeup good enough that a stranger arriving from Google understands it in ten
seconds, then show the owner how it looks.

Repo: wherever the user keeps their Artifact Shelf clone. The writing guide is
`docs/WRITEUPS.md` in the repo. Read it before writing anything.

## 1. Get the HTML

- **claude.ai artifact link**: read it with the Artifact tool using `path: "index.html"`
  so the file is saved to disk instead of pasted into context. Published claude.ai pages
  are sometimes fragments with no `<!doctype html>`; the add tool fixes that.
- **A file**: use it as is.
- **HTML from this conversation**: write it to a scratch file first.

## 2. Vet it before it goes anywhere public

Read enough of the file to be sure about each of these. Stop and ask the user if any fail.

- **Work material.** Anything from the user's job, employer or clients stays off the
  shelf unless they say otherwise.
- **Family and private names**, local file paths, private repo names.
- **Private links**: `claude.ai/artifact/...` links are dead for visitors. If the
  target is also on the shelf, point the link at `../../<slug>/` instead.
- **Third-party IP**: named characters, logos, copied artwork.
- **The claude.ai runtime**: `window.claude` calls must be guarded
  (`window.claude?.x`, `if (window.claude)`) or the page throws on a normal host.
- **Real people and claims about them**: anything that reads as an allegation needs
  the user's explicit OK.

## 3. Add it

```bash
cd path/to/artifact-shelf
npm run add -- /path/to/file.html --shelf <simulations|explainers|generative-art|games|toys|tools>
```

This creates `artifacts/<slug>/index.html` (wrapped into a full document if it was a
fragment) and a stub `about.md` with `status: draft`.

## 4. Look at it, then write about.md

Render it before writing. Load it at 1280×800 in a headless browser, take a screenshot,
look at it, click the obvious start button if there is one, look again. Read the code for
the controls (key handlers, button labels) and the technique.

Then fill in `about.md` exactly as `docs/WRITEUPS.md` describes:

- `summary`: one sentence, 110–155 characters. Count them.
- `tags`: 3–6, lowercase-hyphenated, mixing technique and subject.
- `capture_click` / `capture_wait` if the poster needs a click or time to look good.
- `autorun: false` if it is heavy, makes sound on load, or opens on a menu.
- Body: opening paragraph, `## How to use it` (real keys and labels), `## How it works`
  (named techniques, only what the code does), optional `## Notes`.
- Voice: plain and specific. No "it's not X, it's Y", no delve / seamless / stunning,
  no exclamation marks, no invented backstory.

Set `status: published` only when the user has said it can go public.

## 5. Check, capture, build

```bash
npm run check -- <slug>     # fix every ✗ and every writeup-voice warning
npm run capture -- <slug>   # poster.webp, poster-640.webp, og.jpg
npm run build
```

Open `media/<slug>/poster-640.webp` and look at it. If it shows a loading screen or a
menu, adjust `capture_click` / `capture_wait` and capture again.

## 6. Show the result

Screenshot the new item page (`npm run preview`, then
`http://localhost:4173/artifact-shelf/a/<slug>/`) and its spot on the home shelf, and
send both. Say which shelf it went on and anything you flagged in step 2.

Do not commit or push unless asked. When you are, the GitHub Pages workflow builds
and deploys on push to `main`.
