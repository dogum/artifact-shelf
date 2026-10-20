---
title: Raindrop
summary: "Tap anywhere in the US and follow a raindrop downhill, creek to river, to wherever it ends, on the USGS river network with live gauge readings."
shelf: explainers
tags: [hydrology, rivers, maps, maplibre, live-data, usgs]
made: 2026-10-19
status: published
featured: false
autorun: true
capture_wait: 9000
---

Tap a spot on a night map of the United States and a raindrop lands there. It runs overland to the nearest stream, and the camera follows it down the real river network until it reaches the sea, a lake with no outlet, or a border. Rain on Chicago's Loop flows away from Lake Michigan, through the canal that reversed the Chicago River in 1900, and reaches the Gulf about three and a half weeks and 1,518 miles later. Rain on Grand Junction, Colorado, takes about two years to reach Mexico, most of it spent in Lake Powell and Lake Mead.

## How to use it

- **Tap the map** anywhere in the lower 48 states or Hawaii. You can also type in **A town or an address**, press **Use my location**, or pick one of the **Or try** places: Denver, Grand Junction, Chicago, South Lake Tahoe, Fargo and Glacier National Park.
- During the trip the card at the top names each stream as the drop joins it, with its distance and average flow for the month. Notes pop up at working USGS gauges and at lakes and reservoirs. The panel at the bottom counts **Time**, **Traveled** and **Elevation**.
- **Skip** jumps to the end. On a keyboard, space or → toggles 4× speed and Esc starts over.
- At the end, the card lists every river in order with the distance, the travel time and the starting height. **Share** opens the share sheet with a portrait image of the route and a link, **Save image** downloads that image, **Copy link** copies a link that replays the same drop, and **Drop another** starts again.
- **mi** switches between miles and kilometres. **Sound on** toggles the sound, which starts with your first tap.

## How it works

The route comes from the USGS Network-Linked Data Index (NLDI). Its flowtrace process takes the tapped point and returns the raindrop's overland path to the nearest NHDPlus flowline. A downstream-mainstem navigation from that flowline then returns every reach to the end of the network, in order, often a couple of thousand of them. Each reach's attributes come from NHDPlus Version 2 through the USGS fabric API: the travel time at mean annual flow from the reach to the end of the network, the mean flow for the current month, smoothed elevations, the reach type and the waterbody it passes through. The drop's clock is the difference in travel time between where it entered and where it is now, so reservoirs and big lakes show up as long holds.

NHDPlus stops at coasts, borders and closed basins. A reach with no downstream neighbour and no drainage below it marks that end, and its four-digit hydrologic unit code says which one it is: the sea, a closed basin such as the Great Salt Lake or the Salton Sea, the Great Lakes, Canada or Mexico. Hand-drawn continuations finish the story where the network stops: the Great Lakes out through the St. Lawrence, the Red River north to Hudson Bay, the Colorado into the Gulf of California, and the Chesapeake, Delaware Bay, San Francisco Bay and Puget Sound out to the ocean. They show as a dashed line.

Working gauges along the route come from the NLDI's site navigation, and their latest discharge readings (parameter 00060, up to three days old) come from the USGS Water Data API. The map is MapLibre GL on a globe projection, with OpenFreeMap vector tiles restyled for night, Terrarium elevation tiles for hillshade and 3D terrain, and the route revealed by a line gradient on line progress. The camera's view widens as the drop travels farther, and the whole trip plays in 8 to 28 seconds on a logarithmic scale of its length. The sound is synthesised with Web Audio from looped noise through filters: a hiss of rain, a creek that gives way to a low river rumble as the flow grows, and slow sea swells at the end.

## Notes

- Travel times are the NHDPlus model's estimates at mean annual flow. A real drop in a flood or a drought moves faster or slower, and water held in reservoirs mixes rather than queueing.
- The tapped point goes to the USGS services and to Photon or Nominatim to name the nearest town; when those are busy the town comes from the map's own labels. Shared links round the point to two decimal places, about a kilometre, so they never point at a front door.
- The river network covers the lower 48 states and Hawaii. A tap off the network, in Alaska or out at sea, gets a message instead of a route.
- It needs WebGL2 and an internet connection, including for the downloaded .html.
- This copy smooths the trip's camera. MapLibre 5.24 leaves its elevation freeze on after the landing, so where a terrain tile was still loading the camera dropped to sea level under the hills and the screen went black, most often near Grand Junction. The camera now keeps its own ground height through those gaps. The hand-off from the landing to the river no longer jumps, the view aims at an average of the stretch ahead so meanders don't shake it, turns are limited to a steady rate, and the drop eases in, slows to a stop at big lakes and settles at the end. The trip runs about 10% longer, and phones draw at no more than twice their screen resolution.
- It also fixes two things in the ending. A drop that ends in a lake with no outlet now stops at the shore: the route, distance and time no longer include the river network's path across the lake. Routes into the Great Lakes are left whole, because the network already stops at their shore and the paths before it are wide rivers; the old check had cut the travel time on rivers such as the Maumee to a few kilometres' worth. The same cut applies when the river records arrive after the drop has set off. And tapping a new spot while the ending or the share card is still loading no longer brings back the old trip's card or camera. Pressing **Share** and **Save image** together draws one card, and a slow reply to an earlier search can no longer replace the current suggestions.
