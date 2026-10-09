---
title: "A Great Variety of Colours"
summary: "A live soap film and soap bubble whose colours come from exact thin-film optics, as the film drains, turns black and bursts."
shelf: simulations
stage: tall
tags: [thin-film-interference, soap-film, optics, colour-science, fluid-dynamics, webgl]
made: 2026-10-09
status: published
featured: true
autorun: true
capture_wait: 30000
---

A long scrolling explainer on why soap films are coloured, built around a live soap film and bubble. Light reflects from the film's front and its back, the two reflections interfere, and which colours survive depends only on the thickness, so the colours are a map of the film as it drains, thins to black and bursts. Every colour on the page is computed from the reflected spectrum, and the film itself is a small fluid model running on the GPU. The title is Newton's phrase from *Opticks* (1704).

## How to use it

- **The title bubble** drifts on its own, its colours swirling as it drains. **Tap** it to pop it. It also pops by itself once its black cap grows, and a new one inflates.
- The contents bar jumps to **I Two reflections**, **II Draining**, **III Black film**, **IV Bursting**, **V Lamps & angles**, **VI Lab** and **Notes**.
- From I onward a film on a wire frame stays pinned beside the text, with the light and a **film age** clock above it. Its toolbar has **Measure** (tap the film to read the thickness and reflected colour there), **Stir**, **Blow** and **Pop**, which change what a drag or tap on the film does, a **True colour** / **Thickness map** switch, **New film** and **Pause**.
- **I** holds the film as a perfect wedge, thin at the top, so it reads like a ruler. **Film thickness** (0 to 1,200 nm) drives a two-wave diagram, the reflected spectrum and the colour seen, and a computed strip lines up with Newton's 1704 list of the colour sequence.
- **II** lets the film drain, with an average-thickness readout and **New film**. **III** follows the black film as it spreads, with its share of the area and how much light it reflects. **IV** pops the film and replays the burst 500 times slower, with the rim speed in micrometre film and in black film, and a **Replay** button.
- **V** switches the light between **Daylight**, **Sodium lamp**, **Tungsten** and **RGB LED**, and **Viewing angle** (0° to 80°) tilts the line of sight.
- **VI Lab** opens everything: **Time-lapse** (0.5× to 8×), **Glycerol** for slower draining, **Air humidity** (10 to 95%), **Viewing angle**, a **Vertical (drains)** or **Horizontal (no draining)** film, **Common black film** or **Newton black film**, and the four lights.

## How it works

Colour comes from a table built when the page loads. For each thickness from 0 to 3,200 nm and each viewing angle up to 80°, the Airy formula for a free film gives the reflectance with all its multiple reflections, for both polarisations, at 81 wavelengths from 380 to 780 nm. Water's refractive index follows n(λ) = 1.324 + 3046/λ² with λ in nm. The reflected spectrum is multiplied by the light source and the CIE 1931 colour-matching functions and converted to linear sRGB, with the brightest reflection, about 8% at a quarter-wave thickness, shown as white. The CIE tables and the D65 and A illuminants are embedded in the page, and the sodium lamp is a single line at 589.3 nm. Each light gets its own 2048 × 12 table texture, so the shader looks up every pixel's colour from its thickness and angle.

The film is a reduced model, and the page says so. It is a two-dimensional sheet of incompressible fluid, solved on the GPU with stable fluids and MacCormack advection of the thickness in half-float textures, 168 × 220 cells on a desktop and 120 × 156 on small screens. Thinner film weighs less, so buoyancy measured against the local mean thickness lifts thin film and sinks thick film. The thickness changes through gravity drainage, with a flux that grows as the cube of the thickness, slow evaporation set by the humidity, and marginal regeneration along the side wires, where thin film is pulled out of the thick meniscus and rises in plumes. Below 45 nm a cell jumps to black film, common or Newton, and black film spreads into neighbouring film that is thin enough. A hole spreads cell by cell at the Taylor–Culick speed √(2γ/ρh) with γ = 30 mN/m, so it races through the thinnest film. The burst in the frame is shown 500 times slower and the bubble's 150 times.

The title bubble runs the same model on a latitude–longitude grid and is drawn as a sphere, with front and back reflections of a studio environment.

## Notes

- The Model notes at the foot of the page include a validation table computed live in the page: first-order red, the Michel-Lévy "sensitive tint", against a 206 nm film; the sodium fringe spacing λ/2n against 221 nm; the quarter-wave reflectance against 7.8%; a 10 nm black film against about 0.20%; and the rim speed in 1 µm film against 7.7 m/s. The notes add that a soap film in white light at normal incidence shows the colours of the Michel-Lévy chart at a retardation of 2nh, which served as an independent check of the colour engine.
- The colours for any thickness are exact. The draining is a reduced model with sliders standing in for real recipes, as the page states.
- The films need WebGL2 with floating-point render targets. Without them a notice takes the place of each film.
- The timeline **Three centuries of bubbles** and the page's source list run from Hooke's *Micrographia* (1665) and Newton's *Opticks* through Young, Plateau, Boys, Perrin, Mysels, Taylor and Culick, to Kellay, Wu and Goldburg's soap-film experiments and the IUPAC definitions of the two black films.
- This copy fixes two things in the original. Each frame reset the frame clock after its own work, so on a slow GPU the draining, evaporation and the bubble's life ran slower than real time; they now keep time. And a swipe that started on the title bubble popped it; it now pops on a tap.
