---
title: Merrow Pocket Plan
summary: A pocket street map of an invented city, scored into 32 panels you fold like real paper in 3D. Somewhere in its folds is a walk the city forgot.
shelf: games
tags: [three-js, canvas-2d, paper-folding, puzzle, procedural-city, maps]
made: 2026-10-05
status: published
autorun: true
capture_wait: 2500
capture_click: "#mValley"
featured: true
---

A folding street plan of Merrow, an invented river city, printed as a 1958 pocket map and lying on a wooden desk in 3D. The sheet is scored into 32 panels and behaves like paper: valley and mountain folds, flaps that carry whatever lies on them, and creases that stay in after you open it out. Somewhere in its folds is a walk the city forgot, and it only joins up when the sheet is folded the right way.

## How to use it

- The map starts folded as bought, cover up. Press **Open the map** to let it fall open, or drag the cover downward to open it panel by panel yourself.
- To fold, press on a panel and drag it across one of the scored creases. Let go past halfway and it folds. A dashed guide shows the crease; if the paper can't fold that way, the flap wobbles and the reason appears ("no crease there", "the whole sheet would move").
- **Valley** (V) brings the flap over toward you and **Mountain** (M) sends it behind. Hold Shift while dragging to swap. A valley fold carries everything lying on the flap; a mountain fold carries everything under it.
- **Turn over** (T) shows the reverse: cover, street index, places of interest, notes on the city and its old walks. **Turn around** (R) spins the sheet half a turn on the desk.
- **Undo** (Z) takes back the last fold, **Unfold** flattens everything, and **Fit** (F) frames the sheet in the window.
- Scroll or pinch to zoom, drag the desk to slide the map, and right-drag (or Alt-drag) to tilt and look along the folds.
- **Lamp** sets the light's direction and height, with presets for **Raking light**, **Overhead** and **Desk lamp**. A low lamp makes the creases easy to read.
- **Cartographer's key** holds four hints that open one at a time, then the answer with a **Fold it for me** button. **Sound** turns the paper noises on and off.

## How it works

The fold engine treats the sheet as an 8 × 4 grid. Since every fold runs along a scored line, each panel's position is an axis-aligned reflection plus offset (a flip in x, a flip in y, and a translation in whole cells), and the whole stack is one bottom-to-top ordering of panel ids. A fold reflects the moving panels across the crease and puts them on top (valley) or underneath (mountain) in reverse order. The moving set is the connected paper on the grabbed side of the line, plus anything lying on a lifted flap or under a tucked one. Each candidate state is then checked along every crease segment with the taco and tortilla non-crossing tests from flat-folding theory: layers hinged at the same edge must nest rather than interleave, so a fold that would push paper through paper is refused. The puzzle check samples points every few map units along the hidden route and around its destination, and passes when every point is on top of its stack, face up, and all of them sit in one rigid placement on the desk. Any sequence of folds that gets there counts.

The street plan is drawn in a 960 × 660 map space with a seeded random generator, so the city is the same on every load. The river is a Catmull-Rom spline that widens downstream, with its banks offset from the centreline. The parades, main streets, parks, docks, gasworks and railway are laid by hand, and each of the eight areas between the main roads gets a few named streets. Everything else comes from recursive polygon subdivision: each block is cut across its longest extent with a gap the width of a street, until it falls below a target size set by the part of town it is in. The old town has small blocks cut at loose angles, so its lanes come out crooked; the docks get large, regular ones. Cuts that would leave slivers, fail a roundness test, or run along one of the authored lanes are retried. The hidden walk was drawn first, on the picture the folded sheet shows, and then split back onto the flat sheet, so on the open plan its pieces lie apart.

Both sides of the sheet are painted onto 2D canvases and used as three.js textures. Labels are placed with oriented-box collision tests and kept off the creases; street names follow curved roads letter by letter, and a placement that would bend a name too sharply is skipped for another spot along the road. Streets the generator made get names from a shuffled pool of about 120. The street index on the reverse is built from the labels that actually landed on the front, with their grid squares. Paper grain, mottling and edge toning are multiplied over both sides.

Each panel is a subdivided mesh with a front and a back material. The page counts how many times each crease segment has been folded each way, starting with the printer's folds, and turns that count into a normal map for the crease lines, a wear map that cracks the ink and adds grime along the folds (mixed into the standard material with a small shader patch), and a gentle tenting of the vertices so an opened map doesn't lie flat. Folded edges get half-cylinder strips for the paper's thickness, and a directional lamp casts soft shadows on a procedurally drawn wooden desk. The paper sound is synthesised with the Web Audio API: a burst of noise with random crackles, band-passed into the range of a rustle.

## Notes

There is a false lead on the sheet as well, and the key will show it once you ask. The plan needs WebGL. Adding `#lite` to the artifact's own address lowers the texture sizes, shadow resolution and pixel ratio for slower machines. Type is set in IM Fell English, EB Garamond and Alegreya Sans from Google Fonts.
