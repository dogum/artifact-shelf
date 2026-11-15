---
title: Orbital Data Center
summary: Eighty-one GPU nodes flying as one data center 1,400 km up, followed from Starship's payload bay to the cluster in a 3D drawing you can turn.
shelf: explainers
tags: [webgl, isometric, spacecraft, starship, data-centers, thermal]
made: 2026-10-21
updated: 2026-11-15
status: published
featured: false
autorun: true
capture_wait: 3000
capture_click: "[data-poster]"
capture_motion: reduce
---

A data center in orbit as it might fly around 2030: 81 compute nodes, each about 1.15 MW of GPUs in a 15.9 t spacecraft, flying in formation 1,400 km up in a dawn-dusk orbit. The page follows one node from Starship's payload bay, through its unfolding and its climb, to its place in the cluster, then opens it up. Two findings shape the sequence: three folded nodes fill the bay at less than half of Starship's 100 t, and the radiator wings have to stay folded until the climb is over.

## How to use it

- In Fig 1, press Play or pick a step: In the bay, Release, Unfold, Climb, Radiators, Cluster. The slider scrubs the whole sequence. Pause stops all motion, the cluster's turn included, and the 0.5×, 1× and 2× buttons set the speed.
- Drag the drawing to turn it. Pinch, hold ⌘ or Ctrl while scrolling, or use the − and + buttons to zoom. Double-click to go back to the step's own view. The arrow keys step through, and Space plays or pauses.
- Point at any part to read what it is. In the cluster, it also says which of the 81 nodes it belongs to.
- Fig 2 shows the formation seen square to the Sun over one orbit. Drag the slider to stop it at any point and read the distance between neighbours.
- Fig 3 is the node cutaway: hover to lift the compute bay's lid, use the numbered buttons to pick an assembly, the 0.8×, 1.0× and 1.2× buttons to set the GPU clock, and Thermal (or T) for a false-colour view from 260 K to 360 K.

## How it works

Fig 1 is drawn by a small hand-written WebGL2 renderer that copies the Anatomy kit's drawing style in 3D. The camera is orthographic, so the picture stays an isometric drawing at any angle. Each part is shaded between five tones of paper by how it faces a light that turns with the camera. A second pass draws ink outlines wherever the part under a pixel changes, the depth jumps or the surface turns sharply, read from a buffer of part ids, normals and depth. Thin detail lines (panel ribs, tile seams, hull welds) are drawn on top and tested against depth. The same id buffer answers what the pointer is over.

Every part of the node is built in the browser in metres, and every part that moves while the node unfolds has a pose for any point in the sequence. The spine's masts grow one bay at a time from canisters in its centre section. The four booms unroll and pull the array's folded quarters out with them. Each radiator wing slides out to its root, unfolds every panel at mid-height, then opens like an accordion while a lazy-tongs scissor behind it stretches with it. The deployed node is merged into one mesh and drawn 81 times with instancing for the cluster.

The numbers come from the node's sizing model, extended for launch, climb and formation. A folded node is 7.3 m long, so the 22 m bay holds three (47.7 t), where Starship's mass limit would allow six. The climb from 270 km to 1,400 km costs the difference of the two orbital speeds, 585 m/s, which two 12 kW krypton Hall thrusters at 1,500 s supply in about 60 days for 620 kg of propellant. At 270 km the open radiator would take about 2.8 N of drag against 1.8 N of thrust, so it opens only at the top. The formation is a solution of Hill's equations: every node rides a 2:1 ellipse about the cluster's centre once an orbit, so the grid turns as one, and the distance between neighbours swings between 130 and 260 m.

Fig 3 is the original isometric cutaway of one node, built in Node with the Anatomy kit, with every overlapping pair of parts ray-cast to set the painter's order and an audit that checks no pipe runs through anything. Its thermal view is a WebGL layer on the radiator face.

## Notes

- The payload bay is drawn as a plain cylinder 8 m across and 22 m tall, the extended volume in SpaceX's 2020 Starship payload guide. The real volume narrows into the nose, so three nodes is the optimistic count. The ship is drawn a little longer than the real one to fit it.
- The clamshell nose and the dispenser rails are illustration. SpaceX has published neither a door nor a dispenser for payloads this size; Starlink satellites leave through a slot in the side.
- The cluster's 81 nodes, its size and the 800 Gbps links follow Google's Project Suncatcher study, which plans 81 satellites within a kilometre at 100 to 200 m spacing. Each node here has four laser telescopes, two on each radiator post, one per neighbour.
- Drag at 270 km uses an air density of 5 × 10⁻¹¹ kg/m³. The real value swings several times over with solar activity.
- The radiation dose at 1,400 km is the least certain number in the model: the node sits near the inner proton belt.
- Changes to Fig 3 in this version: each laser terminal now carries two telescopes, and the node's mass includes 620 kg of krypton for the climb, which takes it from 15.3 t to 15.9 t.
- The node cutaway is built with [Anatomy](https://github.com/wheresryan22/anatomy) (MIT), an agent skill for isometric figures. The 3D renderer follows its drawing rules.
