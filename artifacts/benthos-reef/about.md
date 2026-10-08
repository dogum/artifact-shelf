---
title: Benthos reef
summary: A one-minute predator-and-prey game on a reef of point-cloud sea animals. Pick one of six species, eat what it eats and hide from what hunts it.
shelf: games
tags: [webgl2, point-cloud, steering-behaviors, predator-prey, sea-creatures]
made: 2026-09-22
status: published
featured: false
autorun: false
capture_wait: 3500
capture_click: "#go"
---

A small reef built from the same point-cloud animals as the Benthos bestiary, turned into a game of eating and hiding. Each round lasts sixty seconds: you play one animal, eat whatever it can eat, and stay out of reach of whatever hunts it. Everything else on the reef, from copepod swarms to sharks and manta rays, is running the same food web at the same time.

## How to use it

- Under **Play as**, choose an animal. Each has one move: Lionfish **Flare**, Clownfish **Home**, Pufferfish **Inflate**, Octopus **Ink**, Moray eel **Lunge**, Sea turtle **Tuck**.
- Under **Reef**, choose a level. **Morning**, **Noon**, **Dusk** and **Midnight** open in order as you clear each one, with rising points goals and more or different hunters.
- Press **Dive in**.
- Keyboard: arrow keys or WASD to steer, Space to sprint, E for your animal's move, and 1, 2 and 3 for the **Chase**, **Side** and **Top** cameras.
- Touch: drag anywhere to steer with an on-screen stick, hold **dash** to sprint, and press the move button for the ability.
- Coral, the caves under the rock arches, and anemones are hiding places. Which ones you fit depends on your size, and only a clownfish is safe in an anemone. Banners at the top tell you when something is after you and when you are hidden.
- Reaching the goal earns one star, half again the goal earns a second, and not being eaten earns the third. Stars are kept in this browser.
- Sound starts off. The **off** button in the top corner turns it on.

## How it works

The animals are the bestiary's own drawing functions, included verbatim. While the menu loads, the game runs each function at 8 to 16 points in its swim or pulse cycle and packs the point positions into RGBA32F float textures, about 390,000 points per keyframe across 26 species, plus the sand, rock arches, boulders and drifting marine snow. To hide the jump where a cycle wraps, each keyframe is cross-faded with its twin one period earlier.

Drawing uses WebGL 2 with no vertex buffers. The vertex shader takes `gl_VertexID`, fetches that point from the texture with `texelFetch`, interpolates between the two nearest keyframes, and places it using the animal's position and rotation. Point size scales with distance, colour moves between a near and far tint by depth, and exponential fog fades the far reef into the water colour. The pufferfish has a second baked set for its inflated shape, and the shader blends between the two.

Every creature moves by Reynolds-style steering. Each frame it works out a desired velocity (seek prey, flee threats, wander between waypoints near a home, push away from shelters it cannot enter) and turns toward it with a capped acceleration. Predators lock onto the nearest visible prey within sensing range, drop targets that hide or turn out to be protected, and rest for a few seconds after a kill. Jellyfish and siphonophores sting small animals that drift beneath them; sea turtles are immune and eat the jellyfish.

All sound is synthesised with the Web Audio API: low-pass-filtered brown noise for the sea, short oscillator sweeps for bites and moves, and a heartbeat that quickens as a hunter closes in.

## Notes

Needs a browser with WebGL 2. Preparing the reef takes a few seconds before **Dive in** becomes available. The **Save result card** button only appears where the claude.ai downloads feature is available.
