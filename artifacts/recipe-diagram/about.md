---
title: Recipe Diagram
summary: Write a recipe as indented plain text and get a flow-table diagram, a written method, pan-size scaling and a step-by-step cook mode with timers.
shelf: tools
tags: [recipes, recipe-scaling, unit-conversion, plain-text-format, tree-layout, html-table]
made: 2026-10-08
status: published
featured: false
autorun: true
capture_wait: 3000
---

A recipe tool that draws each dish as a table. Every ingredient is a row on the left, every operation is a merged cell spanning the ingredients it takes in, and the cells funnel rightward into the finished dish. The table is computed from an indented plain-text recipe, so changing the pan, the batch size or the units redraws the amounts, the written method and the cooking steps together.

## How to use it

- Pick a recipe from **Recipe**. Five come built in: Espresso Brownies, Buttermilk Pancakes, Everyday Vinaigrette, Skillet Cornbread and Overnight Focaccia. **+** starts a new one.
- **Diagram**, **Recipe** and **Edit** switch between the table, the written-out recipe and the source text. Hover a box, or press Tab to enter the table and move with the arrow keys, to highlight everything that flows into it.
- **Pan** scales by pan area when the recipe names a pan size. Without one the control reads **Batch** and goes from half to triple. **Units** shows US, metric or both.
- **Cook this** steps through the method one operation at a time, lighting the current box and listing its ingredients as tick boxes. A step with a time in it offers a timer. Keys: ← and → to move, space for next, t to start the timer, esc to leave. On a narrow screen it shows a step list in place of the table.
- **Paste a recipe** turns an ordinary ingredients-and-method recipe into the format and lists what it had to guess. **Copy prompt for an LLM** copies instructions for getting the same result from any AI assistant; paste its answer back into the box and it is used as written.
- **Share**, **Copy** (plain text), **PNG** and **Print** take it elsewhere. Recipes you write are saved in your browser.

In **Edit** the recipe is plain text. A line with lines indented under it is an operation, written `verb | detail`. A line with nothing under it is an ingredient, written `US | metric | name | note`, where the metric and the note are optional and an amount with no number (`pinch`, `to taste`) is left alone when scaling. Header lines sit at zero indent, and `{pan}` and `{oven}` anywhere in the text are filled in from them. `@dry` after a verb names a branch, and a line starting `>` sets aside part of an ingredient declared elsewhere for a later step. A trimmed version of the built-in cornbread:

```
title: Skillet Cornbread
pan: 9-in round
oven: 425F | 220C
prep: Heat the skillet in the oven while it comes up to {oven}

bake | {oven}, 20 to 24 min, until the top springs back
  swirl in | to coat the hot skillet, then pour in the batter
    stir | until just combined
      whisk @dry
        1 1/4 cups | 175 g | fine cornmeal
        2 tsp | 9 g | baking powder
      whisk @wet
        1 1/4 cups | 300 mL | buttermilk
        6 Tbs | 85 g | unsalted butter | melted
    > 2 Tbs | 28 g | unsalted butter
```

## How it works

The parser reads the text line by line. Zero-indent lines with a known key become metadata and `#` lines are comments. Everything else goes into a tree through an indentation stack: each new line pops the stack until the top is less indented than itself, then becomes that line's child. Lines with children are operations; the rest are ingredients, with amounts parsed as whole numbers, decimals, fractions or mixed numbers, or kept as literal text. A second line at the outermost level is an error, because everything has to flow into one final step. Regular expressions pull durations (`30 to 40 min`, `1 hr 30 min`) and an `until…` doneness cue out of each operation's detail; anything over six hours, or marked `overnight`, counts as a rest and gets no countdown.

The diagram is an HTML table with merged cells. Each ingredient gets one row, in source order. Each operation's column is its height above the ingredients (one more than its tallest child), its rowspan is the number of ingredient rows beneath it, and it is written into the row of its first ingredient. Every cell's colspan runs from its own column to its parent's, so an ingredient that goes straight into a late step stretches across the empty columns to reach it. Prep and finish lines become full-width banner rows above and below. On a narrow screen a CSS transform shrinks the table to fit, with an **Actual size** button to scroll it at full size instead.

Scaling multiplies both amount columns by one factor. When the `pan:` line gives dimensions (`8x8 in`, `9-in round`, centimetres too), the app works out the area, offers a list of ten common rectangular, round and loaf pans, and scales by the ratio of areas, which keeps the batter the same depth. Batch scaling keeps the vessel, so at 1.5× or more a note warns that the batter sits deeper and will take longer, and for an oven recipe suggests dropping the temperature about 25°F (15°C). Both amount columns come from the recipe text, so nothing is converted between cups and grams; **Units** chooses which to show. Scaled US volumes are re-expressed in whichever of teaspoons, tablespoons or cups lands on a measurable fraction (6 tsp becomes 2 Tbs, 12 Tbs becomes ¾ cup, 9 Tbs stays 9 Tbs) and printed as eighths, thirds or sixths. Metric amounts round more coarsely as they grow and roll over to kg and L at 1000. Counted items such as eggs that stop landing on a whole number get a † and a note to beat them and weigh out the metric amount.

The written recipe comes from the same tree. A post-order walk, children before parents, puts each operation after the steps that feed it, and each becomes one sentence: the verb, then its ingredients as a list ("Whisk the buttermilk, eggs, and unsalted butter"). An operation that joins branches names them from their `@` labels ("Stir the dry and wet mixtures together") or counts them when they have none. Verbs ending in a preposition, like `fold in` or `swirl in`, take their ingredients directly, a `>` ingredient becomes "the reserved unsalted butter", and the detail joins with or without a comma depending on whether it reads on from the verb (`until…`, `for…`). Prep lines open the method and finish lines close it. Cook mode and the plain-text copy use the same sequence.

## Notes

- **Paste a recipe** is rule-based. It splits the paste at Ingredients and Method headings, or works through the lines in order when there are none, reads each ingredient line into the four-column form (a parenthetical like `(125 g)` becomes the metric amount), splits the method into sentences, sets aside preheat-style prep and serving-style finish sentences, and gives each ingredient to the first step that names it. Steps come out as one straight chain, so branches have to be indented by hand, and the dialog says so.
- Timers run off wall-clock end times, so several can run at once and they survive leaving cook mode or reloading the page. They beep through Web Audio and vibrate where the device allows, and the screen is kept awake with the Wake Lock API while cooking or while a timer runs.
- On an ordinary web address, **Share** deflates the recipe text with CompressionStream into the link's `#` fragment; inside a frame or a saved file it hands over the recipe as plain text instead. **PNG** runs html2canvas on a clean offscreen copy of the diagram, with an SVG `foreignObject` render as the fallback.
- On claude.ai the paste dialog also offers **Convert with Claude**. Here that button is hidden and recipes are kept in the browser's local storage.
- This copy fixes the diagram for recipes that set aside part of an ingredient with a `>` line. The reserved row used to leave an empty box to its right; it now runs across to the step that uses it, as in the Skillet Cornbread sample.
