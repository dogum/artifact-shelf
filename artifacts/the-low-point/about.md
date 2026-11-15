---
title: The Low Point
summary: Everything under one Manhattan intersection, drawn from the investigation of its 2007 steam explosion, with the day the pipe burst run hour by hour.
shelf: explainers
tags: [isometric, svg, webgl, infrastructure, new-york, steam]
made: 2026-11-05
status: published
featured: false
autorun: true
capture_wait: 3000
capture_click: "[data-poster]"
capture_motion: reduce
---

The ground under Lexington Avenue and East 41st Street, cut open from the pavement to the schist. A brick sewer from about 1852 crosses over a 20-inch steam main laid in 1924, which dips to fifteen feet below the street to pass under the avenue. An 8 by 8 foot sewer runs through the rock below. On July 18, 2007, rainwater collected around the bottom of that dip, condensate filled the pipe, and at 5:56 in the evening a water hammer burst it. It is drawn from the investigation Con Edison commissioned afterwards and from the city's open data; the notes say what had to be guessed.

## How to use it

- In the first drawing, pick a system (steam, sewers and drains, water, gas, electric, boreholes) to see it alone, or point at any part to read what it is, how big it is and when it was laid.
- The second drawing is cut along the steam main's axis, so the inside of the pipe shows. Drag the clock or play the day. The pool of condensate in the dip, the floodwater in the housing and manholes, the rain and the vapor from the flange manhole all follow the time.
- Switch the traps between "as found" (the 20 lb an hour they passed when tested afterwards) and "as designed" (3,700) to see the day without the clogged traps.
- The strip chart under it shows rain, the water levels round and inside the pipe, and the pressure difference across the intersection. Drag along it to move the clock, or pick one of the day's moments below it.
- In "Two things had to go wrong", drag the point across the investigators' chart of trap function against flood level.
- In "The hammer", set the speed of the water at impact and read the pressure it makes.

## How it works

The drawings are built in Node with the Anatomy isometric kit. Every pipe, chamber, sewer and duct bank is a solid placed at the elevations in the investigation's drawings, and the build ray-casts every pair of parts that overlap on screen to set the order they are painted in. A second pass checks that no pipe runs through anything and that every pipe ends on something.

The day is a small model of the steam main's dip. Heat lost through the insulation condenses about half a pound of steam per foot of pipe per hour, and where floodwater reaches bare steel it boils and condenses much more, up to 323 lb per foot per hour. The model fills the pipe's bore from those rates, less what the traps take away, minute by minute from 6 AM. With half the steel exposed and the floodwater standing at about 27.6 ft, the dip fills at about 10:07, which is when the security camera stopped seeing vapor, and the pool reaches the bend in the late afternoon. The vapor and the steam column are a WebGL layer marched through the drawing's own camera.

The street opening permits come from NYC DOT's permit data on NYC Open Data, filtered to the four blocks that meet at the corner. The corner buildings come from the city's building footprints and PLUTO.

## Notes

- Positions of the steam main, its manholes, the trap station, the sewers and the water mains follow the investigation's figures, with sizes, years and elevations where it gives them. Gas mains and electric manholes come from the utility plan under its boring plan. The electric duct banks are drawn as typical concrete-encased banks. Telephone conduits are not drawn.
- The report does not show how the 1852 and 1863 sewers meet, or how deep the 1863 sewer and the water mains are. Those are drawn as reasonable guesses.
- The rock surface is set from the report's "about elevation 24 on the west side" and a USGS depth-to-rock point of 27.2 a few feet from the intersection, smoothed between them. Its small undulations are invented.
- The street is drawn level at elevation 41.7. The real street falls about a foot from the west curb to the east curb.
- Elevations are on Manhattan datum, whose zero is about 1.7 ft above NAVD 88's. North is Manhattan's grid north, about 29 degrees east of true north.
- The rain, the pressure difference and the control valve's position are read from the report's charts. The chart of trap function against flood level is the report's own, redrawn.
- The traps' function on the day is not known. The page runs them at the 0.5% they managed when tested afterwards, from 6 AM, when the rain began.
- Grand Central's subway platforms and the 7 train are a block north, not under this corner, and are not drawn.
- Built with [Anatomy](https://github.com/wheresryan22/anatomy) (MIT), an agent skill for isometric figures.
