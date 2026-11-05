---
title: Who Could Catch Him?
summary: A Monte Carlo model that plays out 10,000 careers for each of 117 active NHL scorers in your browser to see who could pass Ovechkin's goal record.
shelf: simulations
stage: tall
tags: [monte-carlo, aging-curves, poisson-process, backtesting, hockey, sports-analytics]
made: 2026-11-03
status: published
autorun: true
capture_wait: 15000
---

Alex Ovechkin passed Wayne Gretzky's NHL goal record in April 2025 and is playing what he has said is his last season. This page simulates the rest of the careers of 117 active scorers, 10,000 times each, and counts how often each one ends up past Ovechkin's final total. As of early November 2026 the leader is Macklin Celebrini, at about 1 in 14; everyone over 30 is close to zero.

## How to use it

- The page opens on the player with the best odds. The fan chart shows 160 of his simulated careers by age (the ones that pass Ovechkin in white), the middle 80% as a band, and Ovechkin, Gretzky, Howe and Jágr for scale.
- The panel beside it gives his chance, the median finish, the middle 80% and best 1% of outcomes, the goals he still needs, his recent scoring rate, and how many full seasons at that rate the gap would take. **▶ Run it again** redraws the careers.
- **The odds board** ranks every candidate. Tap a row to load that player, or use **Find a player**.
- The finish line at the top starts as **Simulate his last season**, where Ovechkin's own final total is drawn fresh in every simulated world. **Set it** fixes the line instead, and the slider moves it anywhere from 930 to 1,000 goals.
- **Share this card** draws a 1080 × 1350 image of the selected player's odds; links such as `#p-macklin-celebrini` open the page on that player.
- **Scoring by age**, **Staying in the league** and **Games played** chart the three curves the model runs on, and **Does it work?** shows the backtest.

## How it works

Each player's starting rate is his last three seasons of goals per game, weighted 3:2:1 and shrunk toward 0.30 by the equivalent of 140 games, so a short hot streak counts for less than a long one. Every simulated season, the player first faces a chance of leaving the league for good, taken from how often real scorers of that age came back the next year. If he stays, his rate is multiplied by an aging factor for his age and by a lognormal random shift (σ = 0.16), his games played are a real season's share of 82 drawn from players of the same age, and his goals are a Poisson draw from rate × games. Careers end at 45 or when the rate falls below 0.10 goals a game.

The aging factors come from the delta method: for every pair of consecutive seasons since 1979-80 by the same player, the change in goals per game at each age, weighted by games played and smoothed across neighbouring ages. Scoring rises until about 25, then falls, by about 9% a year at 30.

The 140-game shrinkage and the size of the random shift were picked by backtest. Starting from the ends of four past seasons (2001-02, 2003-04, 2007-08 and 2010-11), the model was run on 124 scorers aged 22 to 32 whose careers are now over, and 80% of their real totals landed inside its 10–90% band.

The simulation runs in the browser with a seeded mulberry32 random number generator, so the numbers are the same on every visit. It does a first pass of 2,500 careers per player to show results within a second, then extends everyone to 10,000 in the background. Ovechkin's own finish is simulated the same way for the rest of this season only.

## Notes

- Data: NHL stats API skater summaries for every season from 1979-80, skater birth dates, and games per team per season. Fan-made and not affiliated with the NHL or the Washington Capitals.
- The model leaves out lockouts, contracts, trades and rule changes, and a player who misses a whole season counts as having left. The backtest covered ages 22 to 32, so odds for players under 22 are the least certain; the page says so.
- This copy is a snapshot. Its season totals run through early November 2026.
