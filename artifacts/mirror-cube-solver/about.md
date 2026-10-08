---
title: Mirror Cube Solver
summary: Paint a mirror cube's sticker thicknesses onto a net and get a turn-by-turn solution, played out on a 3D model built to the cube's real shape.
shelf: tools
tags: [three-js, twisty-puzzle, mirror-cube, breadth-first-search, dijkstra, backtracking]
made: 2026-09-19
status: published
featured: true
autorun: true
capture_wait: 3000
capture_click: "#btnSolve"
---

A solver for the mirror cube, the 3×3 twisty puzzle whose pieces are all one colour and differ only in how far they stick out. You describe the scramble by thickness instead of colour, and it gives back a list of turns, shown one at a time on a 3D model that takes the same lumpy shape as the cube in your hand.

## How to use it

- Under **Your cube's thickness levels**, pick how many levels you can tell apart. Two (thin and thick) suits most cubes; it goes up to six.
- Hold the cube with one face toward you as **Front** and keep it that way. Choose a level from the palette, then click stickers on the net to paint them. Start with the six outlined centres: setting one fills in its opposite. Clicking a sticker again with the same level clears it.
- Hover a sticker to highlight it, and the other stickers on the same piece, on the 3D model.
- **Fill what's forced** fills every sticker that has only one possible answer. **Demo scramble**, **Fill as solved** and **Start fresh** load test states.
- Press **Solve it**, then step with **Next move ▶** and **◀ Back**, or press **▶︎** to play straight through. On a keyboard: → for the next move, ← to go back, space to replay the current turn.
- Drag the 3D view to turn it over; pinch or scroll to zoom. **Other side** flips it, and when the face you need to turn is out of sight that button becomes **Show that face**.

## How it works

The cube is modelled at the piece level: a position and orientation for each of the 8 corners and 12 edges, with every face turn stored as a permutation and applied by composition. Thickness levels stand in for colours, but with only two levels many pieces look alike, so one set of entries can describe several real cube states. The app enumerates corner and edge assignments by backtracking, discards any that break the cube's invariants (corner twists summing to a multiple of three, an even number of flipped edges, matching corner and edge permutation parity), keeps up to 14 candidates with the most pieces already home, solves each, and shows the shortest. **Fill what's forced** runs the same search with blanks left open and fills only the stickers on which every consistent state agrees.

The solver follows the layer-by-layer method a person would use. The bottom cross comes from a breadth-first search over a packed coordinate of the four cross edges (24⁴ states), so that stage is optimal. Each of the four first-two-layer pairs is found with Dijkstra's algorithm over short macro moves such as R U R′, searching a 576-state key that tracks only that pair's corner and edge. The last layer is solved in two phases, orient then permute, from shortest-path lookup tables built once from a short list of standard last-layer algorithms. A final pass cancels and merges consecutive turns of the same face, including across stage boundaries.

The 3D model is drawn with three.js. A mirror cube's cuts sit at fixed planes either side of the core and each piece sticks out by its own thickness, which forces opposite faces to add up to the same depth. The model is built from that rule, with procedurally drawn brushed-metal textures and thicker levels tinted warmer so they read at a glance. Each move is animated with an arrow and a plain-language hint, such as "the front column of the right layer lifts up".

## Notes

Turns use standard notation, read from how you are holding the cube: U, D, L, R, F and B, with ′ for counter-clockwise and 2 for a half turn. Set six levels and it works for an ordinary 3×3 as well, with each colour standing in for a level. Your entries are kept in the browser between visits.
