---
title: Folded Sky
summary: A 280-character cloud shader by Yohei Nishitsuji, taken apart line by line next to a physically based cloud renderer you can light and fly through.
shelf: explainers
tags: [shader-golf, ray-marching, volumetric-clouds, atmospheric-scattering, fractals, webgl]
made: 2026-10-19
updated: 2026-10-30
status: published
featured: false
autorun: false
capture_wait: 18000
---

Yohei Nishitsuji posted a cloud shader on X that fits in 280 characters. This page runs his code unchanged on the left, explains every fragment of it, and puts a conventional volumetric cloud renderer on the right, built the long way, so you can compare the shortcut with the physics it imitates.

## How to use it

- **Side by side**, **Original** and **Rebuilt** switch views. In Side by side, drag the round handle to move the divider (arrow keys work when it has focus).
- Drag the sky to look around the rebuilt scene.
- **Sun** sets the sun's elevation, from just below the horizon to 70°. **Altitude** moves the camera from the ground up through the cloud layer to 9 km. **Coverage**, **Density** and **Wind** shape and move the clouds.
- **Steps** is the number of ray-march samples per frame. **Pixels** is the render resolution; with **auto** on it adjusts itself to hold the frame rate.
- **Space** or **Pause** stops time. A paused view keeps refining.
- **How it works** opens the anatomy panel. Hover any fragment of the one-liner to see what it does.
- On a phone, **Tune** shows the sliders.

## How it works

The original is a 98-step ray march through a kaleidoscopic IFS fractal. Each step folds space 19 times with `abs()`, a scale and an offset, and a sphere inversion (`7.1/dot(p,p*.51)`) rounds the folds into billows. The camera is orthographic, tilted about 63° by `rotate3D`. The colour comes from subtraction: every step subtracts a faint orange, so dense structure stays near white and empty air ends up as the complement, blue.

The rebuild does each of those things explicitly:

- **Shape:** a 128³ Perlin–Worley noise volume baked on the GPU at load, eroded by a Worley detail channel, placed by a two-scale weather map and a cumulus height profile. It is mipmapped and sampled at each step's footprint so distant cloud doesn't shimmer.
- **World:** a perspective camera on a planet of radius 6360 km, with clouds in a shell from 1.5 to 4.2 km.
- **Light:** Beer–Lambert transmittance, a four-octave multiple-scattering approximation with a Henyey–Greenstein phase function, a six-sample light march toward the sun, and sky light averaged over the hemisphere.
- **Sky and ground:** Rayleigh, Mie and ozone single scattering with aerial perspective on clouds and ground. The ground has cloud shadows that drift with the wind.
- **Speed:** about 40 jittered samples per frame, blended with reprojected earlier frames, so a still view converges to hundreds of samples per pixel.

## Notes

The original shader is by [Yohei Nishitsuji](https://x.com/YoheiNishitsuji), posted on X as a twigl one-liner, and appears here verbatim. Its two twigl built-ins, `hsv` and `rotate3D`, are defined inline so it runs outside twigl.

Needs WebGL2. Without it, the anatomy panel still works. If only the rebuilt renderer fails on a GPU, the page shows the original alone. On software rendering it starts at 30% resolution.
