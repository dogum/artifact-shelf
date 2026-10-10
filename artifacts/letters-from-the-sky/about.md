---
title: "Letters from the Sky"
summary: "Snow crystals grown on the GPU from a published lattice model, steered through the temperatures and humidities of Nakaya's snow crystal diagram."
shelf: simulations
stage: tall
tags: [snow-crystals, crystal-growth, lattice-model, nakaya-diagram, ice, webgl]
made: 2026-10-09
status: published
featured: true
autorun: true
capture_wait: 150000
---

A long scrolling explainer on snow crystals and why they look the way they do. A crystal grows on the GPU from Gravner and Griffeath's published lattice model, one water-vapour step at a time, and the air it grows in is set by the temperature and humidity of Nakaya's diagram. Its shape then records the conditions it met on the way down. The title is from Ukichiro Nakaya: "Snowflakes are letters sent from heaven."

## How to use it

- **The title crystal** grows on its own over drifting flakes, with its form, the air it grew in and a scale bar under it. **Grow another** starts a new one.
- The contents bar jumps to **01 Why six** through **08 Your cloud**, and **Notes**.
- From 01 onward a crystal stays pinned beside the text. Its **View** switches between **Photo** (lit like a micrograph), **Bentley** (white on black), **Record** (each part coloured by the air it froze in), **Vapour** (the depleted air around it) and **3D** (a turning ice plate, or a column when there is one), with **Grow again** and **Pause**.
- **01 Why six** grows a single hexagonal plate from one cell of ice and shows the ice lattice. **03 Why it branches** reads the vapour at the tips live. **04 Why it has flat faces** has an **Excess vapour at −15 °C** slider that changes the growth while it happens, so each change is written into the edge it reaches.
- **05 Nakaya's diagram** grows a crystal wherever you tap the full diagram. In the column bands, the crystal grows along its axis; switch to **3D** to see it from the side.
- **06 Letters from the sky** plays four journeys in the Record view: **Plates on the tips**, **Capped column**, **Bands** and **A long fall**. **07 Twins and strangers** has a **Turbulence** toggle and a live readout of the largest difference between arms.
- **08 Your cloud** opens everything. **Tap sets the air** lets you tap or drag the cloud chart at any moment; **Draw a journey** lets you draw a path, then **Fall along the path** or **Clear path**. There are sliders for **Temperature**, **Excess vapour**, **Growth speed** and **Turbulence**, a table of the six published **Model parameters**, and readouts of the form, diameter, supersaturation over ice, water saturation, model steps and column length.

## How it works

The growth model is Gravner and Griffeath's (2008). Each cell of a hexagonal lattice holds an attachment flag, the mass of a thin quasi-liquid boundary layer, ice mass and vapour. Each step runs diffusion (reflecting at the crystal), freezing, attachment and melting. Whether an edge cell joins the crystal depends on how many ice neighbours it has: tips and flat faces need more mass than nooks, which is how the model tells facets from branches. Noise can be added to the vapour for turbulence. On the GPU the state lives in 32-bit float textures in axial coordinates, 512 cells across on a computer and 384 on a phone, inside a hexagonal domain whose rim is held at the cloud's vapour density. One step is three shader passes, plus a growth record of the time, temperature, humidity and kind of growth for every cell as it freezes. Neighbour sums are added in an order that does not depend on direction, so the six arms stay identical to the last bit unless turbulence is on.

The model itself knows nothing about temperature, so the page maps the diagram onto it. Vapour pressures over ice and supercooled water come from Murphy and Koop (2005), and the chart's vertical axis is the excess vapour density over ice saturation, with the water-saturation line drawn in. In the plate bands (−1 to −3.5 °C and −10 to −22 °C), the humidity picks one of six published parameter sets, from hexagonal plate through ribbed, sectored and stellar plates to stellar dendrites and fernlike crystals. Near −2 °C only plates grow. In the column bands, the lattice runs at half the vapour and a column length grows at a rate that peaks near −5 °C. The 3D view draws it as a hexagonal prism with the lattice crystal at each end, so capped columns form naturally. The number of steps per frame adapts toward about 14 seconds per crystal.

The Photo view averages the field once over each hexagon and lights the edges and ridges with a warm lamp from low left and a cool one from high right over a blue backlight. The 3D view draws a thin double-sided ice sheet with Fresnel reflection, refraction and glints.

## Notes

- The notes include live checks. Murphy–Koop vapour pressures at −15 °C agree with Goff–Gratch to within a few tenths of a pascal. The supersaturation of water-saturated air at −15 °C comes out at about 16%. And the arms are compared live while a crystal grows without turbulence.
- The habit mapping follows the observed diagram, and the columns are drawn rather than grown in 3D, as the page states.
- The crystals need WebGL2 with floating-point render targets. Without them a notice takes the place of each crystal.
- The history runs from Kepler's *On the Six-Cornered Snowflake* (1611) and Bentley's first photomicrograph of a snow crystal (1885) to Nakaya's laboratory crystals of 1936 and Kobayashi's extension of the diagram (1961).
- This copy fixes the frame clock in the original. Each frame reset the clock after its own work, so the step budget never saw a slow frame and pacing on slow GPUs was off; the clock now resets only when a loop starts from idle.
