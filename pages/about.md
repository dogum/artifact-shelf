---
title: About the shelf
summary: What this collection is, how each piece is made, and how to take one home.
---

Artifact Shelf is a collection of small interactive things that run in a browser: simulations, explainers, generative art, games and toys. Each one is a single HTML file. There is no app to install and no account to make. Open one, play with it, and if you like it, download the file and keep it.

## How they're made

Every artifact here started as a conversation with Claude. I describe what I want, we go back and forth, and the result is one self-contained page: markup, styles and code in the same file, with an occasional library pulled from a public CDN. Some went through a dozen versions.

Keeping each one to a single file is a deliberate constraint. It means an artifact can't quietly depend on a server that disappears, it can be read top to bottom by anyone curious about how it works, and it will still open in ten years.

## Taking one home

Every artifact page has the same toolbar under the running piece:

- **Open on its own** loads the raw file at full size, with nothing around it.
- **Download .html** saves the exact file from the repository. Double-click it later and it runs, offline if it doesn't load a library.
- **Source** shows the file on GitHub.
- **Embed** gives you an iframe snippet to put it on your own page.

## How the site works

The site is generated from a folder of artifacts by one Node script with no dependencies. Each artifact lives in its own folder next to an `about.md` that holds its label and writeup. The script turns those into this site, plus a sitemap, an Atom feed, a JSON catalog and an `llms.txt`. Posters are screenshots taken with a headless browser.

The whole thing is open source. If you make artifacts too, fork the repository, empty the `artifacts/` folder, drop yours in, and you'll have a shelf of your own.
