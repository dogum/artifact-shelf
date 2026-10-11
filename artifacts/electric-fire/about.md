---
title: "Electric Fire"
summary: "Lightning and thunder computed from the physics: a leader grown through the electric field, the return stroke, and thunder built from the bolt's shape."
shelf: simulations
stage: tall
tags: [lightning, thunder, dielectric-breakdown, lichtenberg-figures, atmospheric-electricity, webgl]
made: 2026-10-10
status: published
featured: true
autorun: true
capture_wait: 30000
---

A scrolling film of one lightning flash, told over a night sky that stays pinned behind the page. Each caption moves the camera and replays one stage of the flash: the cloud charging, the stepped leader feeling its way down, the attachment, the return stroke and the thunder. Every bolt is grown from the electric field by the dielectric breakdown model, and the thunder you hear is synthesised from that bolt's own shape and your distance from it. The title is from Franklin's 1752 letter on the kite: "the pointed wire will draw the electric fire from them".

## How to use it

- **The title sky** strikes on its own about 7 km away, with a field-mill readout in the corner and a scale bar. **Turn on sound** plays the rain and the thunder after its true delay, and **Strike now** starts a flash.
- Scroll to walk through one flash. **01 A cloud charges itself** shows the charge centres and the field at the ground. **02 Feeling its way down** grows the stepped leader at ×700, with **Show the field** to draw the equipotentials and **Grow another**. **03 Who gets struck** zooms in on a tower, with the striking-distance circle and the upward leader, and names what was hit; **Again** replays it.
- **04 The flash runs upward** plays the return stroke and the dart leaders that follow it. **Slow it down ×160,000** makes the return stroke a visible wave. **05 Thunder, read from the bolt** colours the channel by when its sound reaches you, with a **How far away** slider (0.5 to 20 km) and the length of the thunder. **06 The kite and the key** tells the 1752 experiments with Franklin's kite in the scene.
- **07 Your storm** is the instrument deck. **Strike**, **Storm on its own** for automatic flashes, or **tap the sky** to start a leader there. Sliders set **Branching η**, **Peak current**, **Strokes**, **Distance** and **Air temperature**. **Speed** picks **Real time**, **×700** or **×160,000**. **On the ground** toggles the **Tower**, **House** and **Tree**, and **Show** adds the **Field**, **Sound map** or **Striking distance**. Gauges report what was struck, the leader steps, the main channel length, the striking distance, the flash-to-thunder delay and how long the thunder lasts, beside a 30-second field-mill trace and the computed thunder waveform.
- **Lightning in a block** grows a Lichtenberg figure in a slab of acrylic. **Branching η** changes the fronds, **Charge a new block** starts again, and **Classic model** switches to the 1984 set-up and measures the fractal dimension live.

## How it works

The leader grows by the dielectric breakdown model of Niemeyer, Pietronero and Wiesmann (1984), on a vertical slice of air 2.4 km wide and 1.8 km tall in 20 m cells. The cloud base at 1.26 km is held at the cloud's potential, and the ground, tower, house and tree at zero. The potential is relaxed by SOR each time the channel grows, warm-started from the last solution. Each step goes to one of the eight neighbouring cells with odds proportional to (potential drop / distance)^η, and the channel counts as a conductor that loses some potential along its length. When the lowest tip comes within the striking distance r = 10·I^0.65 m of the ground or a grounded object, that point grows an upward leader by the same rule, and the flash attaches where the two meet.

For drawing, each 20 m step is split into eight kinked pieces and given a random wander in depth. The leader front comes down at 1.5 × 10⁵ m/s. The return stroke climbs from the struck point at 10⁸ m/s, and each branch carries current in proportion to the square root of the channel below it. A flash has three or four strokes 30 to 150 ms apart, the later ones led down the main channel by dart leaders. A stroke's light is a sum of decays from 40 µs to 40 ms, integrated over each frame's exposure. The bolt is drawn as instanced ribbons into a half-float target with a six-level bloom. One bloom level doubles as a light map, so each flash lights the cloud base, the rain and the ground of a procedural storm scene.

The thunder is built in a Web Worker from the same bolt. Every piece of channel sends out a short N-wave, loudest at right angles to the piece, falling off as 1/r and arriving after its own distance divided by the speed of sound at the chosen air temperature. Air absorption removes the high frequencies with distance. Sound from low down is cut beyond the refraction shadow zone, √(2Rz) with R ≈ 88 km for air cooling 6.5 K per km. A few dozen ground echoes are added. The field mill sums three charge centres (+40 C at 10 km, −40 C at 6 km, +4 C at 2 km) and their images, plus the fair-weather field. Each flash drains part of the negative charge, which rebuilds over tens of seconds. The Lichtenberg block solves Poisson's equation with a uniform trapped charge and a grounded rim and channels.

## Notes

- The Checks table is computed in the page: the speed of sound at 20 °C against the "3 seconds per kilometre" rule; the peak current whose striking distance matches the 45.7 m rolling sphere of IEEE 998 and NFPA 780; the edge of the thunder shadow zone, about 30 km, against thunder rarely being heard beyond about 25 km; the fractal dimension of the classic model, about 1.7 at η = 1 as in 1984; and the thunder's peak frequency against Few (1969) and Glassner (2000).
- The leader is grown in a two-dimensional slice, and its wander in depth is random, as the page states.
- The sky needs WebGL2 with floating-point render targets. Without it the page shows a notice, and the Lichtenberg block, the timeline and most of the Checks table still work.
- The history runs from Franklin's kite, Dalibard's rod at Marly-la-Ville and Richmann's death in 1753 to Lichtenberg's figures of 1777 and Schonland and Collens's photographs of the stepped leader in 1934, with a twelve-item source list.
- This copy fixes three things in the original. Without WebGL2 the script stopped partway, so the Lichtenberg block, the Checks table and the timeline stayed empty; they now load. Each frame reset the frame clock after its own work, so the storm ran about a tenth slower than real time; it now keeps time. And a leftover build note is gone from the footer.
- It also fixes five smaller things. Thunder already on its way now plays if you turn on sound before it arrives, including from earlier flashes. Changing the distance or air temperature after a flash replaces the thunder you hear, not only the waveform. The Checks table compares the first thunder with the distance it was computed for. And with reduced motion set in the system, nothing strikes on its own: flashes start from **Strike now**, **Again** or the lab, and the Lichtenberg block waits for a tap. And the **Peak current** slider starts at the 30 kA its label shows; it sat at about 24 kA.
