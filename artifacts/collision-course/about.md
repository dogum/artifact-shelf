---
title: Collision Course
summary: The Milky Way–Andromeda collision and five famous galaxy encounters, run live on the GPU with hundreds of thousands of stars and real measurements.
shelf: simulations
tags: [galaxy-collision, n-body, andromeda, astronomy, transform-feedback, webgl]
made: 2026-10-30
status: published
featured: false
autorun: true
capture_wait: 45000
---

A galaxy collision simulator in the tradition of Toomre and Toomre's 1972 paper on tidal tails. It opens on the Milky Way and Andromeda falling together over the next few billion years, with captions that follow the first pass, the tails, the second pass and the merger. A Local Group scene starts from today's measured positions and velocities and runs hundreds of possible futures to show why a 2025 study puts the odds of a merger at about one in two.

## How to use it

- Pick an encounter from the list on the left, or press **1** to **6**: **Milky Way × Andromeda**, **The Local Group**, **The Antennae**, **The Mice**, **Cartwheel** and **Whirlpool**.
- **Drag** to orbit the camera and **scroll** (or pinch) to zoom. The bar at the bottom has play and pause (**Space**), restart (**R**), a timeline you can drag or step with the arrow keys, and speeds from **¼×** to **4×**. The timeline marks each pass and the merger.
- **Throw a galaxy** (or **T**, or **Shift-drag**) launches a dwarf galaxy: drag from the launch point in the direction of travel, and a line previews its path before you let go.
- **True color**, **Origin** and **Doppler** recolor the stars (**C** cycles them): old, young and gas tracers; which galaxy each star came from; or red and blue for receding and approaching along your line of sight.
- In the first two scenes, **Sun** (or **S**) shows a marker that starts where the Sun is today and traces its path through the collision.
- In **The Local Group**, the **Possible futures** panel charts the Milky Way–Andromeda distance for every future run so far, with the running share that merge. **LMC** and **M33** switch those satellites on and off, and **Roll another future** loads a different draw from the measurement errors.
- **About** opens the notes, live stats, and buttons to set the star count from 64k to 1M.

## How it works

This is a restricted many-body simulation. Each galaxy is a dark-matter halo modelled as a softened point mass (a Plummer sphere), carrying an exponential disk with two logarithmic spiral arms and a bulge of stars. The halos attract each other, and the stars feel every halo but have no mass of their own. Halo orbits are integrated on the CPU; every star is advanced on the GPU with a leapfrog integrator through WebGL2 transform feedback, ping-ponging between two vertex buffers. One eighth of the buffer is held back for a thrown dwarf.

Without some way to lose orbital energy, two point-mass halos would pass through each other and fly apart. In the classic encounters a drag switches on as the halos overlap. The Local Group scene follows the recipe in Sawala et al. (2025) instead: Chandrasekhar dynamical friction computed from NFW halo profiles inside the host's virial radius, 20 kpc softening, and satellites absorbed, or the Milky Way and Andromeda counted as merged, once they come within 20 kpc. Each future draws positions, velocities and masses from their measurement errors, and up to 400 futures (240 on touch devices) are run in the background a few milliseconds per frame. The page reports the share that merge next to the published figure for the same satellite combination.

Stars are drawn as additive point sprites into a half-float buffer, with brightness falling off with distance from the camera and pink gas tracers drawn as larger, softer discs. The star count is picked from the GPU (64k under software rendering, 256k on touch devices, up to a million on recent discrete and Apple GPUs), and the page lowers its render resolution, then halves the star count, if frames stay slow. One simulation unit is 10 kpc and 45 million years.

## Notes

- The model leaves out gas dynamics, star formation and the stars' own gravity, so there are no bars and the starting spiral arms wind up rather than persist. Point-like halos make tidal tails longer than in nature. The page lists these limits itself.
- Sources cited on the page: Toomre and Toomre (1972), Lynds and Toomre (1976) on ring galaxies, van der Marel et al. (2012) on the M31 velocity vector, and Sawala et al. (2025), "No certainty of a Milky Way–Andromeda collision", Nature Astronomy.
- Each encounter has its own link: `#andromeda`, `#localgroup`, `#antennae`, `#mice`, `#cartwheel`, `#whirlpool`.
- Needs WebGL2. Without it the page shows a notice instead of the sky.
