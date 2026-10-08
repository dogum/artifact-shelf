---
title: Masis & Sis
summary: Ararat's two peaks, Masis and Sis, rebuilt from real elevation data and drawn live in six print styles, from engraved ridgelines to risograph and woodcut.
shelf: generative-art
tags: [terrain, elevation-data, hidden-line-removal, marching-squares, canvas-2d, generative-print]
made: 2026-09-23
status: published
featured: true
autorun: true
capture_wait: 2500
capture_click: '[data-style="woodcut"]'
repo: dogum/procedural-art
links: ["Any mountain, in your browser | https://dogum.github.io/procedural-art/app/"]
---

Mount Ararat, called Masis in Armenian, and its smaller neighbour Sis, seen from Yerevan and drawn from a real elevation grid embedded in the page. A perspective camera and hidden-line removal turn the heights into a print, and six styles reuse the same depth information: Survey, Topo, Nocturne, Stipple, Risograph and Woodcut. Everything is rendered in the browser with plain Canvas 2D, and any view can be saved as a 3000×1000 header image.

## How to use it

- Pick a style from the six tiles under the picture.
- **Camera**: Orbit, Altitude, Zoom, Relief, Pan ↔ and Pan ↕.
- **Light**: Direction and Height of the light, Snowline, and Sun height for the sun or moon disc.
- **Ink & detail**: Line gap, Weight, and the paper, ink and accent colours.
- **Ornaments**: Sun / moon, Network, Labels, and Photo guide, which marks where an X / Twitter profile picture would cover a header. The guide is never included in the saved image.
- **▶ Orbit** swings the camera slowly back and forth. **Reseed** changes the random parts (stars, stipple, paper grain). **Reset style** restores the preset. **Copy settings** copies every parameter as JSON.
- **Save PNG · 3000×1000** renders the full-size image. Outside claude.ai it opens in a dialog, where you right-click or long-press to save.
- **◐ theme** switches the page between light and dark.

## How it works

The terrain is a 512×512 grid of SRTM-derived elevation from AWS Terrain Tiles, about 240 m per sample, stored in the page as base64-encoded 16-bit heights. For each view the grid is resampled with bilinear interpolation into a new grid aligned with the line of sight from Yerevan and rotated by the orbit angle, so that its rows run away from the viewer. Central-difference surface normals give a Lambert shade for the chosen light direction, and a snow mask combines height above the snowline with a slope test.

Hidden lines are removed with a floating horizon. Rows are projected near to far through a perspective camera, and each pixel column remembers the highest point drawn so far; a later row is drawn only where it rises above that horizon. The same pass fills a buffer recording which terrain row owns each pixel, a simple G-buffer, so any style can look up height, shade and snow at any pixel.

Each style reads that buffer differently. Survey, Nocturne and Woodcut draw ridgelines whose opacity and width follow shade and snow, batched into Path2D buckets by alpha and width. Topo runs marching squares over the heights at a 40 m interval at the default line gap, projects the contour segments, keeps only the visible ones, and draws every fifth line heavier. Stipple places jittered dots with a probability set by how dark the pixel is. Risograph composites two spot-colour layers with a rotated halftone screen and a few pixels of misregistration. Woodcut fills the mountain solid and carves paper-coloured lines that widen where the light is strongest.

The paper texture is five octaves of value noise plus grain and a vignette. While a slider moves, the picture renders at reduced resolution, and the full-quality pass follows about a quarter of a second after it stops.

## Notes

Elevation: AWS Terrain Tiles (SRTM and other public sources). Peak labels use Noto Serif Armenian from Google Fonts. The offline Python version of this pipeline, along with photographic and painted renders, is in the procedural-art repository linked above.
