# What each desktop layout becomes on mobile

One line per layout, written when the layout is built, not afterwards. The point
is that step 7 is an adaptation rather than a rewrite.

`docs/PLAN.md` section 8 holds the intended answers for the layouts that do not
exist yet. This file records what was actually built.

## Built

- **Home grid** (`app/page.tsx`, `components/ProduceGrid.tsx`, issues 007 and
  008): two columns of ingredient cards on mobile, three on tablet (`md:`), four
  on desktop (`lg:`) and five on a wide screen (`xl:`). Revised from the plan's
  one-column mobile case after seeing it: a card is a photo, a name and a season
  line, which is legible at half a phone's width, and one column meant scrolling
  past six ingredients to reach forty. The imported-produce toggle is a single
  checkbox with a 44-pixel-plus touch target, full width on every size since
  there is nothing to reflow.
- **Ingredient card** (`components/ProduceGrid.tsx`, issue 008): the photo slot
  is 4:3 at every size, so cards shrink with the column rather than keeping a
  fixed height. The unverified badge sits in the photo's top corner instead of
  beside the name, because at two columns on a phone the two of them together
  left the name a single word per line.

- **Origin tag** (`components/OriginTag.tsx`, issue 008): the same pill at every
  size, wrapping to a second line rather than overflowing when a country list is
  long, with the dot staying on the first line. Cards cap the list at two
  countries and count the rest, so the tag stays one line on a phone; the panel
  passes no cap and lists them all.
- **Ingredient side panel** (`components/IngredientPanel.tsx`, issue 008): a
  bottom sheet on mobile, anchored to the bottom of the screen and starting
  below the top of the viewport so the grid stays visible above it; from `md:`
  up it becomes a full-height right-hand panel, its width capped by a max-width
  rather than fixed, so it narrows with the window instead of forcing a
  horizontal scrollbar. Nothing dims behind it at either size.
- **Twelve-month bar** (issue 008): twelve equal cells that share the panel's
  width at every size, so it shrinks rather than scrolls. Each cell shows the
  month's initial, with the full month name and its state read out for screen
  readers.
- **Panel controls** (issue 008): the close button, the meal-type filter chips,
  and the similar-ingredient chips are all at least 44 pixels high, and the chip
  rows wrap rather than scroll sideways.

## Not built yet

Month strip, combine control (its space is reserved in the panel, its logic is
step 5), name editing, and filters. See `docs/PLAN.md` section 8 for the
intended mobile form of each.
