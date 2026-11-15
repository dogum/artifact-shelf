---
title: Put your own artifact on the shelf
summary: Made a small interactive page that runs as one HTML file? Send it in and it gets a place on a shelf, a page with a writeup and your name on it.
---

The shelf takes artifacts from anyone. If you made something that runs as a single HTML file (a simulation, an explainer, a toy, a game, a small tool), it can stand here next to the rest, with your name on its page.

## What fits

- **One HTML file** that runs in a current browser from a plain web host. Libraries from a public CDN are fine. Nothing that needs a server, an API key or a login.
- **Your own work**, with credit in the writeup for any shader, dataset or code you borrowed.
- **Nothing private.** No personal details, no tracking, no ads, and no links to private `claude.ai/artifact/…` pages, which are dead for everyone but their owner.
- **Quiet until asked.** No sound before the first click, no camera or microphone before the visitor asks for it.

## Two ways to send one

**Without git.** [Open a submission](https://github.com/dogum/artifact-shelf/issues/new?template=submit-artifact.yml) on GitHub: a link to your file (a published artifact, a gist or a CodePen), the shelf it belongs on, a few lines about what it does, and the name you want credited. I write it up, add it and tell you on the issue when it's live.

**With a pull request.** Fork the [repository](https://github.com/dogum/artifact-shelf), then run one command to add your file:

```bash
npm run add -- thing.html --shelf toys --author "Your Name | https://github.com/you"
```

Write its `about.md` using the [writing guide](https://github.com/dogum/artifact-shelf/blob/main/docs/WRITEUPS.md), check it with `npm run check`, and open a PR. A GitHub Action builds the whole site with your piece on it, so you know it works before I review it. The full steps are in [CONTRIBUTING.md](https://github.com/dogum/artifact-shelf/blob/main/CONTRIBUTING.md).

If you use Claude Code, the repo ships a skill that does most of this: install it from the repo's plugin marketplace, hand it your file and say "shelve this, credit me as Your Name".

## What happens next

I play with every submission and read its writeup. I may make small edits to the writeup, and I'll say what I changed. Once it's merged, the site rebuilds and your piece is live within a few minutes, credited to you on its page and in the feed.

Contributions are shared under the same MIT License as the rest of the repository unless you name another open license. You keep the copyright.

## Fixing the site

Bug reports, accessibility fixes and improvements to the generator are welcome too. [Open an issue](https://github.com/dogum/artifact-shelf/issues/new/choose) to report something, or read CONTRIBUTING.md for how the code is laid out.
