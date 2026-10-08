---
title: Stave
summary: A typeface drawn on twelve tuned strings. Type a line and each letter plays where its strokes end, turn and cross, as plucked strings, bows and bells.
shelf: toys
tags: [web-audio, karplus-strong, fm-synthesis, typography, canvas-2d, music]
made: 2026-10-05
status: published
autorun: true
capture_wait: 2000
capture_click: "#view-score"
featured: true
---

Stave is a typeface and a musical instrument on one page. Its letters are drawn across twelve horizontal strings tuned to a pentatonic scale, and a playhead reads each glyph from left to right, sounding a string wherever the ink ends, turns, runs along it or crosses it. Type, and every new letter plays as it appears.

## How to use it

- Click or tap the ruled stage under **Play line** and type. Each new letter plays as you type it, and **Backspace** damps every string that is still ringing. Sound starts after your first tap or key press.
- **Play line** (or ⌘/Ctrl + Enter) runs the playhead across the whole text. Press it again, or Esc, to stop. **Clear** empties the stage.
- The chips next to **Try** load and play example lines, several of which show off punctuation: `(quietly) and then — silence...`, `<swell and >fade`, `bdpq qpdb`.
- **Read** shows the text. **Score** marks every sounding point on it: brass dots for melody, red dots on the drone strings, rings for bells, bars for bowed notes and small grey dots for grace notes.
- Under **Type settings are the instrument's controls**: **Weight** (heavier ink plays louder and brighter), **Slant** (italic rolls each chord into an arpeggio), **Tracking** (the gap between notes), **Reading speed**, **Ornament** (from melody only up to a grace note on every string a stroke crosses), **Room** (dry to hall), and **Tuning**: Bright, Dusk or Open pentatonic, in any of twelve keys.
- **Your name has a melody**: type a name and press **Play name** or Enter. **Loop** repeats it, and the strip below plots the tune with its note names.
- **The full set**: tap any of the 52 letters, 10 figures and 39 marks to hear it. The panel beside the grid lists each feature of the glyph and the note it plays.
- The **Liner notes** tab explains the design, with figures you can play.

## How it works

Every glyph is defined in code from three primitives: straight lines, elliptical arcs and cubic Bézier curves, on a grid where one unit of height is one string. The five lines a type designer works between (descender, baseline, x-height, cap height and ascender) are strings, tuned by default to E3, C4, C5, E5 and G5, with seven more strings between them. Because the scale is pentatonic, any two notes sound consonant together. Some letters are generated from others: d is b mirrored left to right, p is b flipped about the middle of the x-height, and q is both, which makes them the retrograde, inversion and retrograde inversion of one phrase. Accented letters fall back to their base form through Unicode decomposition.

To read a glyph, each stroke is flattened to a polyline and scanned. A stroke end more than 0.22 units from any other stroke is a free terminal and plucks the nearest string. Crests and troughs come from sign changes in the vertical direction along the pen path. A vertical line strums both its ends, a horizontal line lying on a string becomes a bowed note held for its length, and a dot rings a bell. String crossings are found by intersecting every polyline segment with each integer string height; those become quiet grace notes scaled by Ornament. Notes snap to the nearest string and duplicates merge. The baseline and x-height are both C, and nearly every lowercase letter touches them, so those two strings play softly as a drone and the highest note off them leads.

Horizontal position is time, so the type's spacing is its rhythm: advance widths, sidebearings and tracking set the gaps between notes, and a word space is a rest. Slant shears each event's x position by (y − 2.5)·tan(angle), so in italic the foot of a stem sounds before its top and every stem becomes a rising arpeggio. Punctuation works as score markings. A full stop plays a tonic cadence and a rest, a question mark a half cadence on the dominant, parentheses mute what they enclose, quotation marks raise it an octave, < and > swell or fade the next word, and a capital adds a bass note on the downbeat. Playback is a look-ahead scheduler that queues events against the Web Audio clock every 25 ms.

All sound is synthesized with the Web Audio API, with no samples. Plucks are Karplus–Strong strings rendered in JavaScript at the moment they are scheduled: a burst of low-passed noise, comb-filtered for pick position, circulating in a delay line with a two-point averaging filter and a first-order all-pass for exact tuning, after Jaffe and Smith. Plucking a string again cuts off the note it was holding. Bowed notes are two detuned sawtooth oscillators and a sine through a low-pass filter that opens on the attack, with vibrato that fades in. Bells are two-operator FM. Room mixes in a convolution reverb whose impulse response is synthesized noise that darkens as it decays, and a compressor and limiter keep dense strums from clipping. The stage is drawn on a 2D canvas; the glyph tiles and liner-note figures are SVG built from the same stroke data.

## Notes

The liner notes include the approaches that were tried and dropped, such as reading letter outlines as waveforms, and credit earlier drawn-sound instruments: Daphne Oram's Oramics machine, Iannis Xenakis's UPIC and Evgeny Murzin's ANS synthesizer. Your text, name and settings are kept in the browser between visits.
