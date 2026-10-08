---
title: Desk, by daylight
summary: A desk seen from above, lit by the real sun and moon for any place and time, with a working sundial, window-pane shadows and a ray-marched WebGL scene.
shelf: simulations
tags: [webgl, ray-marching, sundial, solar-position, analemma, moon-phase]
made: 2026-10-07
status: published
autorun: true
capture_wait: 4000
featured: true
capture_time: "2026-06-21T14:40:00-04:00"
capture_timezone: America/New_York
---

A wooden desk seen from straight above, lit by the sun or the moon as they stand at this moment over a chosen place on Earth. The shadows of a mug, a succulent, a pencil and a glass ball swing round through the day, sunlight comes in through the panes of a window, and a brass sundial laid out for the desk's latitude reads solar time beside a card that shows the clock. Every shadow is traced from the computed sun or moon direction, so the scene matches the sky outside.

## How to use it

- It opens **Live**, following the real clock. Drag the **Day** slider to move through today and the **Year** slider to move through the year at the same clock time. **Back to now** returns to the present.
- **▶** plays the day (one day every 40 seconds). The figure-eight button holds the clock time and plays the year, about eight days a second.
- Click the card, or press C, to turn it over. Its five sides cover the moment, the sundial against the clock, the light on the desk in lux, the planets that are up, and the year at this place.
- The compass button at the right end of the strip opens **Place, window and time**:
  - **Find a city**, type **Latitude** and **Longitude** and press **Set position**, or press **Use my location**. The quick trips (Tromsø, Reykjavík, Kashgar, Quito, Honolulu, Singapore, Sydney, Ushuaia) are places where the light behaves differently, each with a note. **Back home** returns to your own position. **Clock** overrides the time zone.
  - **Which way the screen faces**: drag the compass rose or the slider, or use the **N**, **E**, **S** and **W** buttons. On a phone, **Follow this phone's compass** reads the device's orientation.
  - **The window**: put it **Ahead**, **Left**, **Right** or **Behind**, or choose **Open sky** to take the walls away.
  - **Jump ahead to** the next **Equinox**, **Solstice**, **Full moon** or **New moon**.
- Keys: ← and → move ten minutes (with Shift, an hour), ↑ and ↓ move a day (with Shift, a week), Space plays the day, Y plays the year, C turns the card, N returns to now.

## How it works

The sun's position comes from the low-precision NOAA and Meeus formulas: mean longitude and anomaly, the equation of centre, a correction for nutation and aberration, and the obliquity of the ecliptic, turned into altitude and azimuth through Greenwich mean sidereal time and the local hour angle, with Bennett's formula for refraction. The moon uses a truncated form of the series in chapter 47 of Meeus, corrected for parallax, and the card draws its phase with the bright limb tilted by the parallactic angle, as it would look in your sky. Sunrise, sunset, civil twilight and golden hour are found by sampling the sun's elevation every ten minutes and bisecting the crossings of −0.833°, −6° and +6°. Solar noon comes from Newton steps on the hour angle. The planets side solves Kepler's equation from JPL's approximate orbital elements for Mercury through Saturn.

Light is modelled in lux. Direct sunlight is dimmed per colour channel by Beer–Lambert extinction through Rayleigh, aerosol and ozone optical depths, with the Kasten–Young air mass formula, which is what turns a low sun orange. Skylight follows a table of illuminance against solar elevation down through astronomical twilight, and moonlight scales with phase by the Krisciunas–Schaefer law. An automatic exposure maps the total onto the screen through an ACES filmic curve, and in dim light the colour drains toward blue-grey, as it does when the eye switches from cones to rods. The paper strip of controls is tinted by a CPU copy of the same lighting, and its CSS shadow moves with the sun as if it floated 1.4 cm above the desk.

The scene is one WebGL fragment shader that ray-marches signed distance fields for the card, the dial, the mug of coffee, the potted succulent, a hexagonal pencil and a sheet of graph paper with a pin. Shadows use the SDF soft-shadow method, with the penumbra set by the sun's angular size. Surfaces get GGX specular highlights with Schlick Fresnel, SDF ambient occlusion and fBm wood grain. The glass ball is traced analytically: it refracts the desk behind it and focuses a caustic at the ball-lens focal distance nR/2(n−1), slightly different for red, green and blue. The window is a wall plane with a grid of small panes; light reaches the desk only through the glass, and the bar shadows blur with distance from it. While you drag, a low-resolution pass draws; the full image then fills in a strip at a time.

The sundial is a horizontal dial. Its quarter-hour lines, from 4 am to 8 pm solar time, follow tan θ = sin φ · tan H, the gnomon's edge rises at the latitude angle, and the plate turns to true north whichever way the screen faces. On the graph paper the pinhead works as a nodus: dots mark where its shadow falls at each whole hour today, a line traces the whole day, and a figure eight (the analemma) shows where it falls at one clock hour on every third day of the year. All calendar arithmetic runs in the time zone of the place on the desk, through `Intl.DateTimeFormat`, so the card can explain the gap between dial and clock in parts: daylight saving, the place's distance from its zone's central meridian, and the equation of time.

## Notes

Until you set a position, the desk uses a fixed default one and your device's time zone. **Use my location** rounds the position to about a kilometre; if the browser blocks location, the button hides itself, and **Find a city** or typed coordinates work instead. Your position, screen direction and window choice are kept in this browser. The Year slider's track is a small daylight map, one column per day and one row per half hour of clock time, so the switch to and from daylight saving shows as a step. The motto on the dial, SINE SOLE SILEO, means "without the sun I am silent".

This copy differs from the original in two ways: its default position is one of the cities from its own list, and it reads your location only after you press **Use my location** (or on load, if you have already allowed it for this site).
