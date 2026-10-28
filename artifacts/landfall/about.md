---
title: Landfall
summary: "A world you can glide or fly over, raymarched from a 32-bit seed: terrain, physical sky, water, clouds and a generative score, in one HTML file."
shelf: generative-art
tags: [ray-marching, terrain, atmospheric-scattering, procedural-generation, webgl, web-audio]
made: 2026-10-26
status: published
featured: true
autorun: false
capture_wait: 9000
---

An island world drawn by a fragment shader from one 32-bit seed: fjords, volcanic isles, terraced desert mesas, atolls, arctic coast and autumn forest, under a sky that runs from golden hour through twilight to stars. The camera glides on its own until you take it. The survey map, the collision and the floating peak labels run a JavaScript copy of the shader's terrain function, so the labels sit on the summits the GPU draws.

## How to use it

- **Drag** to take the camera. **W A S D** fly, **Q** and **E** go down and up, **Shift** is faster, **G** goes back to the glide and **F** flies. **Glide** and **Fly** switch the same two modes.
- **Click the map** to travel to that spot. Hovering over it shows the height or depth under the cursor.
- **Drag the day dial** to set the time. The pause button stops the clock, and the rate label cycles ¼, 1, 4 and 15 game minutes per second. **[** and **]** step half an hour, **T** pauses.
- **New world** (N) rolls a new seed. **World code** (K) shows the eight hex digits of the current world and takes a code to visit another; a code in the address, like `#f10a7ed0`, opens that world.
- **Postcard** (P) renders the view at full resolution with six samples per pixel and frames it with the world's name and coordinates. Outside claude.ai it has a **Download PNG** button.
- **Sound** (M) starts the score. **Inspect** (I) cycles the render views: raymarch cost per pixel, clay and depth, with the sky lookup table drawn above them. **H** hides the instruments, and **V** or the **view source** badge opens the source viewer.

## How it works

The ground is a heightfield of derivative-damped fractal value noise: each octave is divided by one plus the squared gradient of the octaves before it, which reads like erosion. The noise is rotated off its lattice and domain-warped, and the lattice is 256×256 random bytes drawn from the seed. The fragment shader marches each pixel's ray against the heightfield in steps of 0.45 times the height above ground, bisects when a step lands inside a cliff, and chooses how many octaves go into the surface normal from the pixel's footprint at that distance. Shadows are soft shadows marched toward the sun or moon. The mesa biome terraces only the first five octaves, so the steps stay put as detail octaves come and go.

Each frame starts by integrating single scattering through a spherical atmosphere, with Rayleigh, Mie and an ozone term, into a 128×64 sky-view lookup table. The sky, the haze on distant ridges and the ambient light all read from it, and the JavaScript runs the same integral along the sun's direction to colour the sunlight, so the light reddens at sunset without any hand-set palette. Clouds are a slab of 2D coverage noise eroded by 3D noise, marched with Beer–Lambert extinction, a two-lobe Henyey–Greenstein phase function and a powder term, and they cast shadows on the ground. Water reflects through a cheaper terrain march, absorbs light by depth and foams where it gets shallow. After that come a bloom chain, screen-space light shafts from a mask of open sky, ACES tone mapping, and contrast-adaptive sharpening when the frame is drawn below native resolution, which a controller lowers or raises to hold the frame rate.

On the CPU, a Web Worker built at run time from the terrain functions' own source text (`Function.prototype.toString`) draws the map sheet with hypsometric tints, hillshade and 50 m contours, and finds the summits. A label hides when a march along the line of sight hits a ridge. The score is Web Audio only: a convolution reverb whose impulse response is written sample by sample, filtered noise for wind and surf, detuned pads and FM bells in a mode chosen by the biome.

The source viewer reads a copy of the page taken from the DOM before any script changed it. It counts the page's network requests with the Resource Timing API and gzips its own text with `CompressionStream` to report the compressed size.

## Notes

- It needs WebGL 2 and leans hard on the GPU. On a slower machine the render resolution drops to keep it moving, and the picture gets softer.
- The colour ramp in the raymarch cost view is Google's Turbo colormap, using its polynomial fit. The tone curve is Krzysztof Narkowicz's fit of ACES, and the sharpening follows AMD's FidelityFX CAS.
- The page loads no libraries, images, fonts or audio files, and it makes no network requests.
- This copy adds an empty inline icon to the page's head. Without one the browser asked for a favicon on its own, and the page's request counter showed 2 requests on the shelf.
