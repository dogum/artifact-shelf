---
title: Catching Booster 12
summary: The first tower catch of a Super Heavy booster, rebuilt from webcast telemetry as eight drawing sheets, ending in a catch sandbox you can fly.
shelf: explainers
tags: [rockets, starship, telemetry, monte-carlo, svg-diagrams]
made: 2026-10-07
status: published
featured: true
autorun: true
capture_wait: 3000
---

Eight interactive engineering-drawing sheets about Starship Flight 5 on 13 October 2024, when Super Heavy Booster 12 came back from 96 km and was caught by the arms of its launch tower. The flight path is reconstructed from the altitude and speed readouts on the SpaceX webcast, and every number on the page is tagged HUD, SRC, CALC or EST, so you can see which figures were read off the video, which come from a published source, which were calculated and which are estimates.

## How to use it

- Scroll through the sheets: 01 Delete the legs, 02 Mechazilla, 03 Flight profile, 04 Go / no-go, 05 Boostback & entry, 06 The divert, 07 The grab, 08 Try the catch. The page ends with a "What to trust" table and the full source list.
- Sheet 02: drag the slider to take the arms from open to closed to loaded.
- Sheet 03: drag across the charts or press **Play** at 1×, 5×, 15× or 40×. The event chips jump to liftoff, max-q, MECO, hot staging, boostback, apogee, the landing burn and the catch. With the chart focused, arrow keys step 1 s (Shift for 10 s) and Space plays.
- Sheet 04: click the switches in the commit-logic diagram, or load **Flight 5**, **Flight 6** or **Command too late**.
- Sheet 08: choose **Auto**, **Throttle** or **Manual**, set the faults (ignition timing, crosswind gusts, position error, booster mass error, propellant at ignition, arm close delay, engine failure) and press **Light engines**. When you have the controls, W and S or the up and down arrows change throttle, A and D or left and right tilt the booster, and Space closes the arms. **Run 300** scatters 300 autopilot attempts at the current settings.

## How it works

The speed trace is an OCR of the webcast HUD, taken frame by frame from an open-source telemetry extractor and stored in the page at 0.5 s intervals. The HUD shows altitude only in whole kilometres, so a smooth curve is fitted through the moments the digit changes. Horizontal speed is the square root of speed squared minus climb rate squared, integrated over time to get downrange distance; the reconstructed path closes on the tower within 0.12 km after an 88 km excursion, and that residual is removed as a linear drift.

Mach number, dynamic pressure and g-loads are derived from the path with a standard atmosphere. The unpowered fall implies a ballistic coefficient near 2,500 kg/m². Propellant has no published figures, so it comes from running the rocket equation backwards from an assumed catch mass through the burns seen in the telemetry.

The sandbox is a 2-D point-mass model stepped at 120 Hz, started from the reconstructed state at landing-burn ignition: 1.77 km up, 148 m/s west, 317 m/s down. It uses Raptor 2 sea-level thrust of 2.26 MN, an assumed 327 s specific impulse, a 40 percent throttle floor and drag from the measured ballistic coefficient. The autopilot follows the reconstructed descent for the 13-engine phase, then flies a re-planned constant-deceleration descent with throttle and tilt limits, steering sideways along a quintic reference curve to the rail centre. The Monte Carlo batch runs 300 seeded attempts with Gaussian jitter on ignition time and mass, and plots where each one met the rails and how fast.

The drawings are hand-built SVG with dimension lines, part balloons and hidden lines, and the sandbox draws to a canvas. No libraries are loaded.

## Notes

A fan explainer, not affiliated with SpaceX. Catch tolerances in the sandbox (±1.5 m along the rail, under 2 m/s for a clean catch) are the author's estimates, since SpaceX has not published them. The telemetry comes from the MIT-licensed StarshipTelemetryExtractor CSV for Flight 5; other sources include SpaceX's mission page, NASASpaceflight, SpaceNews, Space.com, IMechE and Wikipedia, all linked at the bottom of the page.
