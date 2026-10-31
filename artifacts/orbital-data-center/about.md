---
title: Orbital Compute Node
summary: An isometric cutaway of a 1 MW orbital data center node, about 2030, showing how sunlight becomes compute and how every watt leaves as infrared.
shelf: explainers
tags: [isometric, svg, webgl, spacecraft, thermal, data-centers]
made: 2026-10-21
status: published
featured: false
autorun: true
capture_wait: 1500
---

A drawing of one node of an orbital data center as it might fly around 2030: about 1.15 MW of GPUs in a 15 t spacecraft, 1,400 km up in a dawn-dusk orbit. The thin-film array is the floor of the drawing and faces the Sun, which is below it, so everything above the array sits in its shade. The figure follows one idea: power is easy to collect in orbit, and the hard part is getting rid of the heat.

## How to use it

- Hover the node, or tap it on a phone, to lift the lid of the compute bay. Inside are the compute sleds, with battery and converter packs on either side, where their mass shields the chips.
- Hover a part, or press the numbered buttons under the card, to highlight one assembly and read its numbers in the corner.
- Use the arrow keys to step through the assemblies, Space to open or close the bay, and Escape to reset.
- The 0.8×, 1.0× and 1.2× buttons (or the keys 1, 2 and 3) set the GPU clock. The readout follows: chip power, heat to reject and the radiator temperature.
- Thermal (or the T key) switches to a false-colour view from 260 K to 360 K: chips, cold-plate water, the ammonia loop and the radiator wall. Change the clock while it is on and the new coolant temperature climbs the radiator panels from the bottom manifold.

## How it works

The drawing is built in Node with the Anatomy isometric kit. Every part is a solid of its own: prisms, turned profiles and pipes split into depth-sorted chunks. Painter's order is not set by hand. Each part records its true 3D shape, and the build ray-casts every pair that overlaps on screen, in every frame of the lid lifting, then solves the sort keys. The same recorded shapes feed an audit that passes with nothing left over: no pipe or cable passes through anything at rest or in any frame of the lid lifting, every pipe and cable ends on a real mount, and every part rests on another part. That audit is why the compute bay is six-sided with a lid. A closed cylinder cannot be lifted off its contents, because its lower wall would sweep through the stack.

The numbers come from a coupled sizing model of one node: orbit geometry, radiator, array, drag, radiation and cost, solved together. Its most robust design across thousands of possible futures was a dawn-dusk orbit at 1,400 km, a thin-film array at 600 W/kg, stock-temperature chips at a 1.2× clock and 10% cold spares. This drawing keeps that design, swaps the model's droplet radiator for deployable panels at 3 kg/m², and flies a small droplet sheet as a pilot. Chip power follows a DVFS model: voltage tracks clock, dynamic power goes as f·v² and leakage as v. The radiator area is fixed at the design point, so a slower clock lets the wall run cooler, as the fourth root of the heat.

The thermal view is a second WebGL layer, drawn on the plane of the radiator face. Every pixel on a panel finds its height, reads the coolant inlet temperature from a short history (the coolant takes about 2.6 s to climb a panel here, sped up for viewing), subtracts the loop's temperature drop, and cools the face slightly between flow tubes. The temperatures come from the same model as the readout: 355 K at the chips, 340 K and 328 K in the cold-plate water, 336 K and 324 K in the ammonia, and a wall that averages 330 K at the design clock. Parts that can cover the wall are drawn in a separate SVG above that layer. The build picks them by ray-casting every overlapping pair, then checks that nothing above the layer sits behind a panel, and a pixel diff with the thermal view off matches the single-layer drawing.

The droplet sheet is a WebGL shader drawn in the same isometric camera as the SVG. It sits on the plane x = const of the pilot frame, between a back SVG (the node) and a front SVG (the generator, collector and posts). The coolant marks on the pipes are dashes phased by screen arc length along each whole route, so they run through every chunk joint.

## Notes

- The radiation dose at 1,400 km is the least certain number here. Published dose figures exist for about 650 km (Google's Suncatcher work); at 1,400 km the node sits near the inner proton belt, and the real dose is probably far higher than the model's bracket.
- Power runs from converters on the array hub up three cables to an umbilical panel on the bay. Coolant runs from cold plates in each sled to a heat exchanger in the pump package, then out to both radiator wings in an ammonia loop.
- Hardware references: ISS radiator panels (honeycomb, 22 flow tubes per panel, flex hoses between panels, scissor deployment), the ISS pump module with its bellows accumulator, roll-out solar array booms, Starlink's argon Hall thrusters and current laser terminals.
- The Sun-from-below layout follows from the orbit. In a dawn-dusk orbit the Sun stays near the orbit normal, so the array never needs to turn, and the radiator wall stands edge-on to both the Sun and the Earth.
- Built with [Anatomy](https://github.com/wheresryan22/anatomy) (MIT), an agent skill for isometric figures.
