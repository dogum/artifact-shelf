---
title: Infestation
summary: A page that draws its own TypeScript source, then lets four species of bug eat it token by token while two spiders hunt them and their genes drift.
shelf: games
tags: [react, typescript, canvas-2d, evolution, predator-prey, agent-based]
made: 2026-10-01
status: published
featured: false
autorun: true
capture_wait: 12000
---

This page is drawn from its own source code, a React and TypeScript component rendered glyph by glyph onto a canvas. Four species of bug live in the text and each eats one kind of token: worms take strings and numbers, weevils keywords, beetles punctuation, moths comments. Nothing eats a type annotation, at least at first. Two kinds of spider hunt the bugs, and every creature carries genes that mutate when it breeds.

## How to use it

- Watch the visible part of the file assemble itself, then the bugs arrive. Scroll to see the rest of the file.
- Move the cursor over the code. It is a lamp that draws moths, and a loupe magnifies the text under it. **Loupe** (L) turns the magnifier off.
- Click or tap any bug or spider to pin it. Its genes appear on the **Evolution** tab.
- **Recompile** (R) sends every fallen glyph flying back to its place. **Release bugs** (B) and **Release spiders** (S) add more. **Pause** (Space) stops time.
- The **Field notes** panel has three tabs. **Census** shows population sparklines, a phase plot of bugs against spiders, and how much of the source is still intact. **Evolution** shows trait ranges per species, any new strains, and a mutation-rate slider from off to 4×. **Field log** records arrivals, extinctions and egg sacs.

## How it works

A small hand-written tokenizer splits the source into keywords, types, strings, numbers, comments, punctuation and identifiers. Each character becomes a glyph with a home cell, painted once to an offscreen canvas. A glyph is always in one of five states: home, loose, flying, piled or lost. When a bug finishes a bite the glyph is knocked loose, falls under gravity and lands in a heap at the bottom of the window. The heaps follow a sandpile rule: a glyph that lands on a column more than a line taller than its neighbours slides toward the lower side. Recompile flies every glyph home in reading order along an eased arc.

Bugs forage by sampling random spots within about fourteen character widths and steering toward anything edible, or pick up a scent from elsewhere in the file when nothing is close. Each bite adds energy. A bug that reaches its species' threshold splits in two, and bugs die of hunger or old age. Children inherit speed, size, wariness, a tendency to play dead, camouflage and an appetite for every token kind, each nudged by a Gaussian mutation and clamped to set bounds. Faster, larger and better-camouflaged bugs burn more energy, and nothing else steers the outcome. When a lineage starts eating a food its ancestors never touched, it is logged as a new strain.

The spiders are state machines. The jumping spider prowls, stalks, crouches and leaps at where its prey is heading, but camouflage shortens how far it can see unless its own acuity gene is high, and prey that notice it either flee or freeze. The orb weaver spins a web and waits; how firmly a bug sticks depends on its species and size, and some pull free. Well-fed spiders lay egg sacs that hatch into mutated young, and spiders turn up on their own once there are enough bugs to feed them.

The simulation lives in a mutable ref and is stepped and drawn on every animation frame. React only re-renders the side panel, four times a second, from a read-only snapshot of the world, which keeps the 60 fps work out of React state.

## Notes

The page's own heading calls it Infestation.tsx. The text you see is the component's TypeScript source; the page runs a compiled build of it with React bundled in. With reduced motion requested, the file appears already assembled.

The original was a page fragment; this copy wraps it in a complete HTML document so it runs on its own.
