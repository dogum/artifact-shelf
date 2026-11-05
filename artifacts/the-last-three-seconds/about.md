---
title: The Last Three Seconds
summary: All 111 Ovechkin goals with NHL puck and player tracking, replayed together so every puck hits the net at once, with one-timer timing and goalie speed.
shelf: explainers
tags: [player-tracking, event-detection, sports-analytics, hockey, animation, canvas-2d]
made: 2026-11-03
status: published
autorun: true
capture_wait: 6000
---

Every Alex Ovechkin goal since 2023-24 that has an NHL EDGE tracking replay, 111 of them, drawn on one rink and lined up so that all the pucks reach the net at the same instant. Each trail changes colour with the play: blue while the pass travels, white while the puck is on his stick, red once he shoots. Below the overlay, the same data takes apart the one-timer: a median 0.9 seconds from the pass leaving a teammate's stick to the goal, with the goalie still sliding across as it goes in on about half of them.

## How to use it

- The overlay plays on a loop from three seconds before the goal to half a second after. **❚❚ Pause** stops it, and the slider scrubs through time.
- **Pick a set** filters the overlay and every number under it: how he shot it (**One-timers**, **Held it first**, **No pass**), the strength (**Power play**, **Even strength**) and who passed it (Strome, Carlson, Protas and the rest, with their counts).
- **In this set** gives the medians for the current set: time from pass to net, time on his stick, shot distance, and the share of goals with the goalie still moving faster than 5 ft/s.
- **The one-timer, in physics** compares one-timers with shots he held: race bars for each phase, a scatter of pass-to-goal time against goalie speed (tap a dot to replay that goal), and a rink of where each kind was released.
- **Replay** plays any single goal with the camera following the puck, the passer ringed blue and the goalie ringed gold. **▶ Play**, **½ speed**, and **Share this goal** for a card of that goal; the list under it picks any of the 111. It opens on goal 894, the one that tied Gretzky.
- **Share** at the top draws a card of the overlay for the current set. Links such as `#goal-894` open a goal directly.

## How it works

The NHL publishes EDGE tracking for recent goals as position samples for the puck and every player, ten times a second. Each replay is re-oriented so Washington attacks the top of the screen, then the page finds the moments in it. The puck counts as on a player's stick when it is within 6.5 feet of his tracked position. The shot is the last frame with the puck on Ovechkin's stick before the goal; walking back from there, the touch starts where the puck first came within range of him; the pass is the last Washington teammate the puck was near in the four seconds before that. A one-timer is 0.1 seconds or less on his stick, which at ten frames a second means a single frame.

As a check on the detection, the detected passer matches the official first assist on 83 of the 99 goals where a pass was found. Goalie speed is the fastest frame-to-frame movement of the goalie while the shot was in the air. Puck speed is the best average over two or three frames right after the release, so it reads lower than a radar gun.

All 111 replays ship inside the page as gzip-compressed 16-bit integers, unpacked in the browser with `DecompressionStream` and drawn on canvas 2D. The overlay aligns every goal on its goal frame and interpolates between samples for smooth playback.

## Notes

- Data: NHL EDGE puck and player tracking, and the NHL play-by-play for goal details and rosters. Fan-made and not affiliated with the NHL or the Washington Capitals.
- Ten samples a second blur anything shorter than a tenth of a second, so a one-timer's contact time and the true release speed are below what the data can resolve. The page lists these limits.
- This copy is a snapshot. Its goals run through mid-October 2026.
