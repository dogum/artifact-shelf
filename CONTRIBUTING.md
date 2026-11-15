# Contributing to Artifact Shelf

The shelf takes artifacts from anyone. If you made a small interactive page (with Claude, another model or by hand) and it runs as a single HTML file, it can go on a shelf here with your name on it. Fixes and improvements to the site itself are welcome too.

There are three ways in, from least to most git:

1. **[Send an artifact through an issue](https://github.com/dogum/artifact-shelf/issues/new?template=submit-artifact.yml).** Fill in a form with a link to the file and a few lines about it. I do the rest and credit you. No fork, no Node.
2. **[Open a pull request](#adding-an-artifact-with-a-pull-request)** that adds the artifact and its writeup. This is the fastest way onto the shelf, and the checks run on your PR so you know it builds.
3. **[Improve the site](#changing-the-site)**: a bug fix, an accessibility fix, a better tool. Open an issue first for anything large.

## What fits on the shelf

- **One HTML file** that runs in a current browser from a plain web host. Libraries from a public CDN (cdnjs, jsDelivr, unpkg, esm.sh) are fine. Anything that needs a server, an API key or a login doesn't fit.
- **Your own work.** You made it or directed it, and you have the right to share everything inside it. Credit any shader, dataset or code you borrowed in the writeup's Notes.
- **Something to do or look at.** Simulations, explainers, generative art, games, toys and small tools. The shelves are listed in [`shelf.config.json`](shelf.config.json).
- **Nothing private.** No personal details, no work material, no tracking or analytics, no ads, no links to private `claude.ai/artifact/…` pages (they are dead for everyone but you).
- **Polite on load.** No sound before the first click, no camera or microphone before the visitor asks for it. Heavy pieces are fine with `autorun: false`.
- **Under about 1.5 MB** if you can. Larger is allowed when the size is the point.

If you're unsure whether something fits, open the submission issue anyway and ask.

## Adding an artifact with a pull request

You need Node 20 or later and git.

1. **Fork** [dogum/artifact-shelf](https://github.com/dogum/artifact-shelf) on GitHub, clone your fork and make a branch:

   ```bash
   git clone https://github.com/<you>/artifact-shelf.git
   cd artifact-shelf
   git checkout -b add-<your-slug>
   npm install
   ```

2. **Add your file.** Pick the shelf and put your name (and optionally a link) in `--author`:

   ```bash
   npm run add -- ~/Downloads/thing.html --shelf toys --author "Your Name | https://github.com/you"
   ```

   This creates `artifacts/<slug>/index.html` and a stub `artifacts/<slug>/about.md`. A claude.ai fragment with no `<!doctype html>` is wrapped into a full page for you.

3. **Write `about.md`.** Follow [docs/WRITEUPS.md](docs/WRITEUPS.md): a one-sentence `summary` of 110–155 characters, 3–6 tags, an opening paragraph, `## How to use it` and `## How it works`. The writeup is what search engines read, so describe what the code really does. Then set `status: published`.

4. **Check it and look at it.**

   ```bash
   npm run check -- <slug>    # fix every ✗; read the ! warnings
   npm run dev                # http://localhost:4173/artifact-shelf/a/<slug>/
   ```

5. **Posters (optional).** `npm run capture -- <slug>` takes the poster and share card with headless Chromium (`npx playwright install chromium` the first time). If you skip this, the check on your PR takes them for you, and the deploy takes them again after merge. Commit `media/<slug>/` if you made them.

6. **Commit and open a PR** against `main`. Keep it to one artifact per PR, and only touch `artifacts/<slug>/` and `media/<slug>/`. The PR template has a short checklist.

### With Claude Code

The repo ships a Claude skill that does steps 2–5 for you. In your clone:

```
/plugin marketplace add dogum/artifact-shelf
/plugin install artifact-shelf@artifact-shelf
```

Then hand Claude your file or published artifact link and say "shelve this, credit me as Your Name, https://github.com/you". Read the writeup it produces before you open the PR; you know your piece better than it does.

### After you open it

- A GitHub Action runs `npm run check`, takes any missing posters and builds the whole site. If it fails, the log says why. (On your first PR, the run waits until I approve it; GitHub does that for every new contributor.)
- I read the file, play with it and read the writeup. I may push small edits to the writeup or the front matter, and I'll say so on the PR.
- When it's merged, the site redeploys and your piece is live within a few minutes at `https://dogum.github.io/artifact-shelf/a/<slug>/`, with your name on its page, in its structured data and in the feed.
- I may decline a piece that doesn't fit the shelf. I'll say why.

### Updating or removing your piece later

Send a PR that changes files in your own `artifacts/<slug>/` folder, and bump `updated:` in its front matter. To take a piece down, open an issue or a PR that deletes its two folders; I'll merge it.

## Changing the site

The generator is one Node script with no runtime dependencies. Before you start, read [CLAUDE.md](CLAUDE.md) (it's written for coding agents, but it's the shortest description of the rules) and the "How it's built" section of the [README](README.md#how-its-built). The main rules:

- **No runtime dependencies.** Node built-ins and hand-written code only. Playwright is the one dev dependency.
- **Relative links.** Templates get a linker `L(path)` per page; never hardcode `/artifact-shelf/`.
- **Don't restyle other people's artifacts.** Fixes inside an `artifacts/*/index.html` are limited to what a public page needs, and each one is recorded under Notes in that artifact's `about.md`.
- **Keep new UI in the shelf's vocabulary**: paper labels, clips, ledges, the tokens at the top of `src/assets/shelf.css`.

Before you open the PR:

```bash
npm test               # build, then check every link, JSON-LD block and feed
npm run test:browser   # if you touched shelf.js or a template
npm run check
```

For anything visible, attach screenshots: desktop (1440×900) and phone (390×844), light and dark.

## Licensing

By opening a PR or a submission issue, you agree that your artifact and writeup are shared under the [MIT License](LICENSE), the same as the rest of the repo, unless you name another open license in the writeup's Notes. You keep the copyright and the credit; the page names you as the author. Third-party code, data and fonts inside your piece stay under their owners' terms; say where they come from in Notes.

## Conduct

Be kind and specific in issues and reviews. Critique the work, not the person. No harassment, no spam, no artifacts about real private individuals. I'll remove anything that crosses those lines and block accounts that keep doing it.
