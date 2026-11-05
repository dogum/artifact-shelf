---
title: The Office
summary: Every NHL goal Alex Ovechkin has scored, placed on the ice where he shot it, with a playback of his career and his climb past Howe and Gretzky.
shelf: explainers
tags: [hockey, sports-analytics, data-visualization, expected-goals, kernel-density, canvas-2d]
made: 2026-11-03
status: published
autorun: true
capture_wait: 3000
---

A map of every goal Alex Ovechkin has scored in the NHL, 930 in the regular season and 77 in the playoffs as of early November 2026, each one a dot on the half rink where he shot it. Press play and the goals land in order while his line on the chart beside the rink climbs past Howe and then Gretzky. The name is the hockey nickname for his spot in the left faceoff circle on the power play, where almost three in ten of these goals came from.

## How to use it

- **Play his career** on the rink, or **▶ Play** under the chase, runs every goal in order in about half a minute, with pauses at goal 1, 500, 802 (passing Howe), 894, 895 (passing Gretzky), 900 and the latest goal. **All goals** jumps to the end.
- Drag or tap on **The chase** to scrub to any point in his career. **Raw** and **Era-adjusted** switch between real totals and totals rescaled to a common scoring rate; **By games** and **By age** change the bottom axis.
- Hover or tap a dot to see that goal. The card gives the date, opponent, period and time, strength, shot type, expected goals, assists and goalie, with previous and next (the arrow keys also step through goals). Almost every goal from 2023-24 on also has **▶ Tracking replay**, which plays the last seconds of the goal from NHL tracking data, and **Watch it**, a link to the NHL video. **Esc** closes the card.
- **Look closer** switches the lens between **Goals**, **Heat** and **Finishing**, colours the dots by **Strength**, **Shot** or **Season**, and filters to **Regular season** or **Playoffs**, **Game-winners**, **Overtime**, **Hat-trick games**, one opponent (**Against**) or one **Goalie**. **Reset** clears the filters.
- Further down: **Twenty-two seasons** (goals against expected goals by season), **The game clock** (goals by minute of the game), **Who fed him** (every player who assisted on his goals), **Ovi on your birthday** (pick a month and day), **Every opponent** and **The goalies**. Tapping a row filters the map to those goals.
- **Share this goal**, and the team, goalie, set-up man and date versions, draw a 1080 × 1350 card to save or post. Links such as `#goal-895`, `#vs-pit` or `#date-03-01` open the page on that goal or set.

## How it works

The goals come from the NHL's play-by-play feed for every game he scored in, with shootout goals left out. Each shot location is flipped so Washington always attacks the same net, using the side the home team defended (2019 on), the zone code of the shot (2009 on), and for 2005 to 2009 the shot distance printed in the official game reports. Strength is worked out from the number of skaters on the ice, so a pulled goalie doesn't turn an even-strength goal into a power-play one, and where the feed disagrees with the official report the report wins. The totals reconcile with his official line: 331 power-play goals, 141 game-winners and 72 empty-netters in the regular season.

The **Heat** lens is a kernel density estimate: goals are counted on a one-foot grid and blurred with a separable Gaussian (σ = 2.7 ft). **Finishing** uses MoneyPuck's shot data from 2007-08 on, about ten thousand unblocked attempts in hexagonal bins, and colours each bin by goals scored against expected goals. **Era-adjusted** scales each season to 3.0 goals per team per game using league totals, with shootout winners taken out of the league goal counts.

The replays are NHL EDGE puck and player tracking, ten positions a second, packed as gzip-compressed 16-bit integers inside the page and unpacked in the browser with `DecompressionStream`; positions between frames are linearly interpolated. The rink, charts, scoreboard and share cards are all drawn on canvas 2D.

## Notes

- Data: NHL play-by-play and official game reports, NHL stats API for league scoring, [MoneyPuck](https://moneypuck.com) for expected goals, NHL EDGE for tracking. Fan-made and not affiliated with the NHL, the Washington Capitals or MoneyPuck. No logos are used.
- This copy is a snapshot: its data runs through early November 2026, partway through what he has said is his final season.
- One goal from 2022 has no MoneyPuck record, and penalty shots have no expected-goals value.
