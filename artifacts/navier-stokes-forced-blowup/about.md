---
title: Forced Blowup for Navier–Stokes
summary: "The mathematics behind the 2026 forced blowup results for Navier–Stokes: Clay's four statements, the BKM criterion, a collapsing vortex and a ladder."
shelf: explainers
tags: [navier-stokes, fluid-dynamics, pde, finite-time-blowup, vortex-dynamics, canvas]
made: 2026-09-09
updated: 2026-10-08
status: published
autorun: true
capture_wait: 3000
---

An explainer on finite-time blowup for the 3D incompressible Navier–Stokes equations, written around the September 2026 preprints that construct singularities with a smooth external force. It sets out what the Clay problem's four statements ask, why a force changes the question, how the vortex and multiscale constructions work, and what is still open. Seven figures compute their numbers from the equations printed beside them.

## How to use it

- The section bar along the top, `01 The question` through `11 Still open` and `Sources`, jumps between sections. The `◐` button switches between light and dark.
- **Fig. 1, Burgers' equation:** drag `viscosity ν` to zero and `max |∂ₓu|` climbs toward a finite-time singularity; raise it and the slope levels off. `Pause` and `Reset` control the run.
- **Fig. 3, Beale–Kato–Majda:** set `growth rate α` and `time to T`, or press `α = ½`, `α = 1` or `core of §06`. The readout shows whether the vorticity integral stays finite and gives the verdict.
- **Fig. 4, the Burgers vortex:** drag `strain a` and `viscosity ν` and watch the core radius, peak swirl and centre vorticity change while the core stays steady.
- **Fig. 5, the self-similar core:** drag `anisotropy h` and `time to blowup τ` and read the peak speed, core energy, aspect ratio and volume. `Pause` and `Restart` control the animation.
- **Fig. 6, the multiscale ladder:** set `stages k`, `time t` and `frequency ratio`, and compare the bounded field with its runaway slope.
- **The timeline (§09):** filter by `Navier–Stokes`, `Euler` or `Model equations`, and tick `proofs only` to hide numerical work.

## How it works

The page starts from equation (1), ∂ₜu + (u·∇)u = νΔu − ∇p + f with ∇·u = 0, and the Clay description's four statements: (A) and (B) ask for global smooth solutions with the force set to zero, (C) and (D) ask for a breakdown and allow a smooth force. A forced construction defines the force as the residual of a designed flow, so the whole difficulty is keeping that residual smooth through the singular time.

Fig. 1 integrates Burgers' equation, uₜ + (u²/2)ₓ = ν·uₓₓ, from sin x on a periodic 1,024-cell grid with a finite-volume scheme (Rusanov flux, minmod limiter, explicit diffusion). Fig. 3 uses the model growth ‖ω‖∞ = (T − t)^(−α) and integrates it in closed form, which shows the Beale–Kato–Majda threshold at α = 1. Fig. 4 advects fluid parcels in the exact Burgers vortex, u_θ = Γ/(2πr)·(1 − e^(−r²/r_c²)) with r_c = √(4ν/a), the steady balance between vortex stretching and viscosity.

Fig. 5 draws the contracting core of the Navier–Stokes construction from its scaling exponents: radius τ^(1/2), height τ^(1/2−h), peak speed τ^(−1/2−h) and core energy τ^(1/2−3h), so the speed diverges while the energy goes to zero. Fig. 6 is a one-dimensional caricature of the Córdoba–Martínez-Zoroa ladder: sine waves at lacunary frequencies whose amplitudes grow from N^−6 at t = 0 to N^(−1+ε) at t = 1, with the norms measured from the samples. The hero background is a canvas particle field following an inward spiral that speeds up as the radius shrinks.

## Notes

The September 2026 results are preprints and had not been refereed when this was written. Theorem statements are restated from the papers, page counts and section numbers were checked against the PDFs, and every entry in the timeline links to its journal or arXiv record.

This version replaces an earlier one that also covered the public dispute over credit around the announcements. That material is gone; the page now covers the mathematics only.
