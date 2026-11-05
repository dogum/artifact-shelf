---
title: Never Itself
summary: A working Enigma I drawn in isometric detail, a key sheet to set it, and the real 1941 intercept that its one flaw helped break.
shelf: explainers
tags: [isometric, svg, webgl, cryptography, enigma, history]
made: 2026-11-05
status: published
featured: false
autorun: true
capture_wait: 2500
capture_click: "[data-demo]"
capture_motion: reduce
---

A working Enigma I in its oak case, front flap down and inner lid open: 26 keys, 26 lamps, a plugboard of cords, and three cipher wheels between an entry wheel and a reflector. Type and the wheels step and a lamp lights, with the same wirings, notches and double step as the real machine. The page follows a message from the sender's key sheet to the codebreakers who read it, and turns on one fact: because the current comes back through a reflector, no letter is ever enciphered as itself.

## How to use it

- Type anywhere on the page, or click the keys. The lamp that lights is the cipher letter, and it stays lit while the key is down.
- Click a wheel to turn it forward one place, or Shift-click to turn it back. The windows show the Enigma I's numbers, 01 to 26.
- Lift the wheels to raise the stack and spread it along the spindle. The lit contacts and the gaps between the wheels show where the current crossed on the last key. Show me lifts the stack and types a word slowly.
- Pick a day on the key sheet to set the wheel order, ring settings and plug pairs. The cords on the plugboard follow.
- The message form writes what you type and what the lamps give in five-letter groups. Send it as a link and whoever opens it gets the day, the start position and the cipher. Their machine is set from the same sheet and reads it back.
- Where the current went lays the last key press out flat: plugboard, entry wheel, three wheels and reflector, with every wheel's wiring at its current position.
- In the codebreakers' section, slide a crib along a real 1941 intercept. Places where a crib letter would sit on the same cipher letter are struck out. Then set that day's key and read the whole message on this machine.

## How it works

The cipher is a small model of the Enigma I: wheels I to V and reflector B as wired, ring settings, the plugboard and the stepping. Before each letter the right wheel always moves. The middle wheel moves when the right wheel is at its notch, and also when it is at its own notch, carrying the left wheel with it: the double step. The model is checked against published test vectors and reads the 1941 message letter for letter, indicator included (start WXC, KCH gives the message key BLA).

The drawing is built in Node with the Anatomy isometric kit. Every part is a solid with its true 3D shape recorded, and the build ray-casts every pair of parts that overlap on screen, at rest and in every frame of the wheels lifting, to set the painter's order. The wheels turn about their own axis, so their outlines never change. Only what is painted on them moves: the numbers on each tyre are laid flat on the curved surface at their angle and faded toward the edge, the thumbwheel serrations switch between precomputed phases, and the turnover notch, the ratchet teeth and the 26 contacts are placed from the same angle each frame. The lamp light is a WebGL layer in the drawing's own camera, on the plane of the lampboard. The plug cords are drawn live, because the plugboard changes with the day.

## Notes

- The intercept is the first part of a German Army message from July 1941 (Operation Barbarossa), as reproduced in the Enigma literature with its key. The key sheet on this page is made up.
- Real key sheets ran from the last day of the month down to the first, so the day just used could be cut off the bottom and burned.
- The Enigma I's wheels carried the numbers 01 to 26 rather than letters; operators converted letters to numbers when setting them.
- The real message procedure added a step this page leaves out for your own messages: the operator chose a start position, enciphered a three-letter message key from it, and sent both. The 1941 read at the bottom of the page does it the real way.
- Lifting the wheels shows the entry wheel and reflector coming out with the three cipher wheels, spread along the axis. On the real machine the entry wheel stays fixed; the figure spreads it so its contacts can be seen.
- Built with [Anatomy](https://github.com/wheresryan22/anatomy) (MIT), an agent skill for isometric figures.
