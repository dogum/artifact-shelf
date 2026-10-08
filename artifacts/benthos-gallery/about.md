---
title: Benthos
summary: Thirty-four sea creatures, each a cloud of parametric points from a few dozen lines of trigonometry. Orbit any one, tune its sliders and read its source.
shelf: generative-art
tags: [point-cloud, parametric-geometry, canvas-2d, p5js, sea-creatures]
made: 2026-09-28
status: published
featured: true
autorun: true
capture_wait: 3000
---

A bestiary of 34 marine animals, from octopus and nautilus to copepods and sea-urchin larvae, where every animal is a set of points computed from parametric curves. There are no meshes, textures or lights. Brightness comes only from how many points land on the same pixel and how far away they are, and opening any card shows the exact function that drew it.

## How to use it

- Scroll the five groups: cephalopods; crustaceans; echinoderms and cnidarians; fish, and one reptile; plankton and larvae. Each card animates in place.
- Click a card to open the animal on a larger stage, then drag the canvas to orbit it.
- The view buttons jump to preset angles such as ¾, front, side or above. The set varies by animal.
- **❚❚** pauses the animation and **auto-orbit** toggles the slow spin.
- Every animal has its own sliders. The octopus has arm curl, undulation and mantle pulse; the staghorn coral has a branching depth.
- **show code** prints the drawing function. **copy sketch** copies a standalone p5.js file with the helpers, the camera and your current slider values.
- **close ✕** or Esc returns to the grid.

## How it works

Each animal is one JavaScript function that calls `cast(x, y, z, brightness)` a few thousand times. The shapes come from a handful of shared helpers: Catmull-Rom splines through control points for spines and limbs, swept tubes that run a ring of points along a path using a frame built from the path's tangent, flat blades for fins and paddles, and a deterministic hash in place of `Math.random` so every frame is repeatable. Time enters as a phase inside the sines, which is how arms coil, fins ripple and bells pulse.

Some animals carry real geometry. The nautilus shell is a logarithmic spiral, r = A·e^(bθ), with a tube radius of tanh(πb)·r, which keeps each whorl tangent to the one inside it at any tightness. The shrimp's five pairs of swimmerets share one beat function offset by 1.15 radians per pair, producing a metachronal wave. The staghorn coral is a recursive function in which each branch spawns two or three shorter children at angles drawn from a hash of its own seed.

The renderer is a small software rasterizer on a 2D canvas. Each point is rotated by the orbit yaw and pitch, projected orthographically, and blended into floating-point RGB buffers. Its colour is interpolated between a near tint and a far tint by depth, and every hit pushes the pixel further toward that colour, so dense regions read bright and sparse ones faint. Grid tiles redraw every third frame and only while on screen, tracked with an IntersectionObserver.

## Notes

The source panel reads the function with `Function.prototype.toString()`, so the code shown is always the code running. The same species functions, copied verbatim, populate the playable Benthos reef elsewhere on this shelf.
