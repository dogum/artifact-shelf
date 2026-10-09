---
title: "Klangfiguren"
summary: "Chladni figures from the real plate equation: a steel plate solved in the browser and driven at a chosen note, with up to 131,072 grains of sand on it."
shelf: simulations
stage: tall
tags: [chladni-figures, plate-vibration, acoustics, rayleigh-ritz, particles, webgl]
made: 2026-10-09
status: published
featured: true
autorun: true
capture_wait: 25000
---

A long scrolling explainer on Chladni figures, the lines that sand draws on a vibrating plate. The page solves the equation of a thin elastic plate in the browser, drives the plate at a chosen frequency from a post at its centre, and pours up to 131,072 grains of sand on the answer, so every pattern is a computed vibration mode. The title is Chladni's own word for them: sound figures. It runs from Hooke's flour-dusted glass in 1680 through Chladni, Sophie Germain and Ritz to the luthiers who tune guitar and violin plates by the same figures.

## How to use it

- **The title plate** steps through notes on its own, with the frequency, the mode number and the peak Γ under it. **Sound off** toggles a tone that swells at each resonance, and **Pour again** scatters fresh sand.
- The contents bar jumps to **01 A plate that sings** through **09 Your plate**, and **Notes**.
- From 01 onward a plate stays pinned beside the text. Its toolbar switches the **View** between **Sand**, **Motion** (the plate bending in 3D, exaggerated and slowed) and **Γ** (a heat map of how hard the plate throws sand), sets what a **Touch** does (**Move drive**, **Pour** or **Wipe**), and has the sound toggle and **Pour**.
- **03 Ritz's zoo** shows the first 24 modes as thumbnails. Tap one to drive it; the dim ones have a nodal line through the post, so the drive moves to where it can excite them.
- **04 Only the right notes** sweeps the frequency and draws the resonance curve under the plate. **Drag along the curve** to play the plate yourself; gold ticks mark modes the post can drive.
- **05 One g** shows Γ with its Γ = 1 contour and a **Drive force** slider: louder notes draw thinner lines. **06 Faraday's dust** adds yellow lycopodium, which heaps up where the plate moves most, and **Pump out the air** sends it to the still lines like the sand.
- **07 Round plates** switches between **Drive at centre** (rings) and **Drive near the rim** (petals) and plots the frequencies against Chladni's count of lines. **08 The luthier's plate** cycles through the modes of an unbraced spruce guitar top with **Next mode**.
- **09 Your plate** opens everything: **Square**, **Rectangle** (with **Aspect**), **Circle** or **Guitar top**; **Steel**, **Brass**, **Aluminium**, **Glass** or **Spruce**; **Thickness**, **Size**, **Frequency** with **◀ ▶** to jump between resonances and **Sweep**, **Drive force**, **Quality factor Q**; **Sand**, **Lycopodium** or **Both**, **Vacuum**, **Pour** and **Clear**. Readouts give the nearest mode, peak Γ, bending wavelength and wave speed, the largest amplitude and the number of modes below 4 kHz.

## How it works

The plate obeys Kirchhoff's thin-plate equation with every edge free. For the square and the rectangle, the deflection is written as a double sum of normalised Legendre polynomials, 576 in all (24 each way on the square, shared out by how many half-waves fit each way on other plates), and the Rayleigh–Ritz method turns the equation into a 576 × 576 eigenproblem. The basis is orthonormal, so the mass matrix is the identity, and the four symmetry classes split it into four problems of 144, solved in the browser with Householder reduction and the QL algorithm. Spruce enters as four separate stiffnesses (Dx, Dy, D12, D66). The circle is solved exactly with Bessel functions, w = [Jₙ(kr) + C·Iₙ(kr)] cos nθ, with the frequencies found as roots of the 2 × 2 free-edge determinant. The guitar top uses the same polynomial basis (18 × 26) over its outline with the soundhole removed, solved offline; only its coefficients ship with the page. Modes are solved once per shape, material and aspect, since thickness and size only rescale the frequencies as h/L².

The drive is a point force at the post. The forced response is a sum over all modes below 4 kHz, each with damping set by Q, and the post holds the plate's rigid-body motion out of the picture. The story plate is 24 cm of steel, 0.8 mm thick, with 111 modes below 4 kHz.

The sand is a reduced model, labelled as such on the page. Grains live in float textures on the GPU (131,072 on a desktop, 65,536 on phones). Where Γ = Ω²|w|/g exceeds 1, a grain is thrown up under real gravity with a take-off speed that grows with Γ − 1, lands a few millimetres away in a random direction with a slight lean down the amplitude slope, and rolls out a little. Below Γ = 1 it creeps slowly downhill in amplitude, which gives the crisp single lines. Grains that land off the plate fall off. Lycopodium drifts with the air currents in proportion to ∇Γ², and in vacuum it hops like sand. The sound is a sine at the drive frequency whose loudness follows how hard the plate is moving.

## Notes

- The Checks table in the notes is computed when the page loads. The free square plate's first frequencies (ν = 0.3) match Leissa's 1969 values to every digit shown. The Ritz solution converges to a few parts in a million at mode 60. The circle's Bessel roots match an independent solution, and the half-power width of a resonance equals f/Q.
- Grain collisions, the weight of the sand, air loading and large-amplitude effects are left out, as the page states. The guitar frequencies are converged to a few per cent, the square's to better than one part in a million.
- The page needs WebGL2 with floating-point render targets. Without them a notice takes the place of each plate.
- The timeline **Three centuries of figures** and the eleven-item source list run from Chladni's *Entdeckungen über die Theorie des Klanges* (1787), Germain, Faraday and Kirchhoff, through Ritz (1909) and Leissa's *Vibration of Plates*, to Hutchins on violin plates and a 2016 paper on steering objects across a Chladni plate.
- This copy fixes two things in the original. Each frame reset the frame clock after its own work, so the sand moved slower than real time; it now keeps time. And a leftover build note is gone from the footer.
