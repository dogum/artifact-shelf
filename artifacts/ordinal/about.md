---
title: ORDINAL
summary: Connect-the-dots taken apart into points, numbering and rule: solve and print 21 puzzles, or change the rule and draw times tables, roses and fractals.
shelf: generative-art
tags: [connect-the-dots, mathematical-art, ramer-douglas-peucker, fourier-epicycles, l-systems, canvas-2d]
made: 2026-09-30
status: published
featured: true
autorun: true
capture_wait: 18000
capture_click: "#cardsMath .card:nth-child(2)"
---

A connect-the-dots page broken into its working parts: a set of points, a numbering, a rule for which numbers join, and a way of drawing each join, played out over time. Leave the rule at n → n + 1 and you get a book of 21 mystery pictures to solve by tapping, with printable puzzle and solution sheets. Change it to n → 2n on 200 dots around a circle and the same machinery draws a cardioid.

## How to use it

- The page opens by drawing Puzzle No. 1 for you. After that, pick any card under **Library → Puzzles**. The title reads "What is it?" until you finish. Tap the dots in order or drag through them like a pencil; **Z** steps back and **Enter** connects the next dot. When you finish, a toast shows your dot count, slips and time.
- **Mathematics** holds 15 figures: a times table, Maurer rose, sunflower, star polygon, Lissajous curve, spirograph, Fay's butterfly, a superformula starfish, the Koch snowflake, Sierpiński arrowhead, dragon and Hilbert curves, a π walk and the Lorenz attractor.
- The right-hand panel is the formula, one row per symbol. **P** sets the number of dots. **σ Numbering** reorders them (as drawn, shortest tour, sweep, Hilbert, shuffled, reversed). **f Rule** takes any expression in n, N and k, with chips for n+1, k·n, n+k, n² and N+1−n, a **k** slider, **Sweep k** and **wrap mod N**. **γ Stroke** joins with line, curve, arc or step. **τ Hand** switches between **You**, **Machine** and **Circles**.
- With the machine drawing, drag the ruler under the paper to scrub τ, or use ← and →. Space plays and pauses, R restarts, F fits the view, and 1, 2, 3 pick a hand. Scroll or pinch to zoom, drag to pan. **View** toggles Numbers, Dots, Ghost (a faint preview of every join) and Sound.
- **Make** turns other things into puzzles: **Type** (letters or emoji), **Equation** (x(t), y(t) or r(θ)), **Image** (a dropped picture, as Outline or One line), **Sketch** (draw with a finger or mouse) and **Score** (paste or open a drawing's JSON).
- **Ask** has Claude draw a subject you describe. On this site it uses your own Anthropic API key: paste it into **Your Anthropic API key**, pick a model, and requests go straight from your browser to api.anthropic.com, billed to that key. The key is held only for the visit unless you tick **Remember on this device**, which stores it in this browser's local storage.
- **Export** gives a printable puzzle and a solution sheet (US Letter SVG), a PNG of the stage, the score as JSON, a video of the drawing, or a link that carries the drawing in the address. **Save** keeps drawings under **Yours** in this browser. **Theory** opens six short facts about dots, each with buttons that load a live example.

## How it works

The formula in the header, γ ∘ f ∘ σ(P) with τ ∈ [0, N], is how the code is organised. P is the point set, σ the numbering of those points, f the rule that says which numbers connect, γ how one connection is drawn, and τ the time that plays the connections out. Every drawing is stored as a score: layers of SVG path data, splines, simple shapes, longitude and latitude, equations, L-systems or raw points. Each layer is sampled densely, then reduced to dots with Ramer–Douglas–Peucker, which keeps a point only if dropping it would pull the line more than ε off the true shape, so corners and tips survive at any count. When a layer asks for an exact number of dots, ε is bisected to the largest count within budget, then the closest pairs are thinned and the longest arcs split at their arc-length midpoints until the count is exact.

Silhouettes made of circles, ellipses, capsules, jointed limbs and polygons are signed distance functions combined with a smooth minimum, traced at their zero contour with marching squares, with true polygon corners snapped back afterwards. Typed text is drawn on a hidden canvas and traced the same way. An uploaded picture becomes a darkness field, thresholded by Otsu's method and contoured with marching squares; **One line** instead stipples it by darkness (rejection sampling, then six rounds of Lloyd relaxation toward weighted centroids) and threads every dot on a nearest-neighbour tour improved by 2-opt. Maps use an equirectangular projection about the middle latitude, and L-systems are expanded by string rewriting and walked by a turtle.

σ is a permutation of the dots: shortest tour uses the same nearest-neighbour and 2-opt tour, sweep sorts by angle around the centroid, Hilbert sorts by position along a Hilbert curve, and shuffled is a seeded Fisher–Yates shuffle. With f = n + 1 the dots are joined as a path. Any other rule is compiled by a small expression parser and drawn as a chord diagram, one chord from each n to f(n), wrapped mod N. A target that is not a whole number lands between two neighbouring dots, which lets **Sweep k** slide k smoothly: on 200 points around a circle, k = 2 gives a cardioid and k = 3 a nephroid. The sunflower places seed n at radius √n and angle n × 137.5°, the golden angle, and the rule n → n + 34 picks out one family of its Fibonacci spirals. The star polygon {12/5} is n → n + 5 on twelve points.

γ draws each join as a straight line, a cubic Bézier with Catmull–Rom tangents taken from the neighbouring dots (sharp turns stay sharp), a quadratic arc bowed to one side, or a right-angle step. At τ = k the first k joins are drawn; the machine hand gives each join time in proportion to a blend of its length and the average, so the pen moves at a roughly even speed. **Circles** resamples the finished path to 512 evenly spaced points (1,024 for long paths), takes a discrete Fourier transform, sorts the terms largest first and redraws the path with a chain of rotating circles; the Circles slider sets how many. Number labels are placed one at a time, each tried at 16 angles around its dot and scored against nearby dots, lines and labels already placed. With Sound on, each dot's height picks a note from a pentatonic scale and its horizontal position sets the stereo pan.

## Notes

**Ask** sends Claude a description of the score format and gets one back as JSON. With **Careful** ticked, the page compiles the draft, measures it as a printed puzzle (strokes that cross or touch, numbers printed too close together, dots hidden under filled decoration), writes a coarse text picture of the solved drawing, attaches an image of it, and asks Claude for a revision. **Look again** runs the same check on the drawing on the stage. The 12 pictures under **Drawn by Claude** were written with a companion ORDINAL skill. The **From Claude** shelf and the **Pin to From Claude shelf** export work only when the page is opened inside Claude, so on this site that shelf stays empty. The π walk and the Lorenz attractor are stored as precomputed points.
