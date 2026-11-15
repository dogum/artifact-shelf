---
title: Put your own artifact on the shelf
summary: Made a small interactive page that runs as one HTML file? Send it in and it gets a spot on a shelf, its own page and your name on it.
---

Everything here so far is mine, but it doesn't have to stay that way. If you've made something that runs as a single HTML file (a simulation, an explainer, a toy, a game, a small tool), I'd like to see it, and it can stand on a shelf next to the rest with your name on its page.

## What fits

Most things do. The few that don't, and why:

- **It has to be one HTML file** that runs in a browser from a plain web host. Libraries from a public CDN are fine. Anything that needs a server, an API key or a login will break for visitors.
- **It should be yours.** Made with Claude, another model or by hand all count. If you borrowed a shader, a dataset or some code, say where it came from and I'll credit it in the writeup.
- **Leave out anything private.** Personal details and work material, mostly. Private `claude.ai/artifact/…` links are worth checking for too: they only open for you, so they're dead for everyone else. No tracking or ads.
- **Let people start it.** Sound waits for the first click, and the camera or microphone waits until someone asks for it.

If you're not sure, send it anyway and ask.

## Two ways to send one

**The easy way.** [Open a submission](https://github.com/dogum/artifact-shelf/issues/new?template=submit-artifact.yml) on GitHub with a link to your file (a published artifact, a gist or a CodePen), the shelf you think it belongs on, a few lines about what it does, and the name you'd like credited. I'll write it up, add it and reply on the issue when it's live.

**The pull request way.** Fork the [repository](https://github.com/dogum/artifact-shelf) and add your file with one command:

```bash
npm run add -- thing.html --shelf toys --author "Your Name | https://github.com/you"
```

Then write its `about.md` (the [writing guide](https://github.com/dogum/artifact-shelf/blob/main/docs/WRITEUPS.md) has the fields), run `npm run check`, and open a PR. A GitHub Action builds the whole site with your piece on it, so you'll know it works before I look. The full steps are in [CONTRIBUTING.md](https://github.com/dogum/artifact-shelf/blob/main/CONTRIBUTING.md).

If you use Claude Code, the repo ships the same skill I use to shelve my own pieces. Install it from the repo's plugin marketplace, hand it your file and say "shelve this, credit me as Your Name".

## What happens next

I'll play with it and read the writeup. If I tidy the writing, I'll tell you what I changed. Once it's merged, the site rebuilds and your piece is live a few minutes later, credited to you on its page and in the feed. If something doesn't fit, I'll say why, and we can usually sort it out.

Contributions go out under the same MIT License as the rest of the repository unless you name another open license. The copyright stays yours.

## Fixing the site

Bug reports, accessibility fixes and improvements to the generator are welcome too. [Open an issue](https://github.com/dogum/artifact-shelf/issues/new/choose) if something's broken, or read CONTRIBUTING.md for how the code is laid out.
