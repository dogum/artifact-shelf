---
title: "Grand Complication Atlas"
summary: "A working 3D model of a grand complication pocket watch that keeps real time from its own escapement, with a tourbillon, perpetual calendar and chimes."
shelf: explainers
stage: wide
tags: [watchmaking, horology, tourbillon, perpetual-calendar, minute-repeater, three-js]
made: 2026-10-09
status: published
featured: true
autorun: true
capture_wait: 20000
capture_time: "2026-10-09T10:09:30-04:00"
capture_timezone: America/New_York
---

A working 3D model of a grand complication pocket watch, Calibre A-1, laid out like a horological drawing and taken apart over twelve plates. It is modelled on the published figures of Vacheron Constantin's Les Cabinotiers Berkley Grand Complication, shown in 2024. The Berkley's gear layout has not been published, so the movement here is an original design, but every ratio in it is real. When the page opens, the hands are set to your local time, the calendar to today and the moon to tonight's phase. From then on the escapement keeps the time: every hand and indication is driven through the gear train from the beats of the balance, and nothing reads the device clock to point them.

## How to use it

- **Drag** to turn the watch over, **pinch** or **scroll** to zoom, and **tap** any part for a card with its tooth count, speed and job. Numbered callouts match the parts list.
- The plate panel on the right (a bottom sheet on phones) steps through **I to XII** with **‹ ›** or the numerals: the watch, its eleven layers, the mainspring, the going train, the escapement, the balance, the tourbillon, the motion works, the perpetual calendar, the moon phase, the minute repeater, and a closing plate that sets the model beside the Berkley. Each plate moves the camera and shows live readouts such as watch time, beats since midnight, balance amplitude and power reserve. A plate can be linked directly with `#plate1` to `#plate12`.
- The dock at the bottom sets the time rate: **1/100**, **1/10**, **1×**, **1 min/s**, **1 h/s** and **1 day/s**. **Back to now** runs the train forward or back to real time.
- **Explode** spreads the eleven layers along their arbors, and **Layers** hides or isolates each one, with **Show all** to bring them back. **Sound off** turns the chimes on.
- **The mainspring** plate has **Hold to wind**: the crown, winding pinion, crown wheel, ratchet and click turn, the spring coils redraw, and the balance swings wider. Left alone the watch runs down and stops.
- **The perpetual calendar** plate has buttons that jump to the end of February in 2027, 2028 and 2100, and **Back to today**.
- **The minute repeater** plate has **Strike the time**, a **Chimes in passing** choice of **Off**, **Hours** or **Westminster**, and **Night silence 22:00–08:00**.

## How it works

The going train runs from the mainspring barrel (80 teeth) through the centre wheel (pinion 10, wheel 80) and third wheel (pinion 10, wheel 75) to the tourbillon cage, which is the fourth wheel. Inside the cage, the escape pinion (8 leaves) rolls round a fixed 80-tooth wheel. The cage turns once a minute, and its blue arrow is the seconds hand. The balance beats at 18,000 vibrations an hour. Its phase follows real time, each zero crossing releases the escape wheel by 12°, and every wheel, hand and indication is computed from that beat count through the tooth ratios. On its plate the escapement runs at 1/100 speed, with a live Locked, Unlocking, Impulse or Drop readout. The balance amplitude falls as the power reserve runs down from 60 hours.

The perpetual calendar is driven by a 24-hour wheel. Date, day and month stars advance through jumpers, and a 48-month program cam sets each month's length by the depth of its notch. Like a real perpetual calendar, it follows the four-year rule, so in 2100 it shows a 29 February that the Gregorian calendar skips. The moon phase is geared from the 24-hour wheel through 8/56 and 16/135, which gives 59.0625 days per turn of a two-moon disc, about a day of error in 122 years.

The minute repeater reads the time from an hour snail with 12 steps, a quarter snail and a minute snail with four lobes of 15 steps. Racks fall on them, and five hammers strike five gongs while a governor sets the pace. The strikes are synthesised with Web Audio. The model is drawn with three.js: about 290 meshes and 146 parts, with gear teeth cut when the page loads.

## Notes

- The closing plate compares the model with the Berkley and lists its sources. The movement layout, the parts and the name Calibre A-1 belong to this model, not to the Berkley.
- The model needs WebGL. Without it the page says so and suggests a current browser with hardware acceleration on.
- The page remembers the last plate you opened.
