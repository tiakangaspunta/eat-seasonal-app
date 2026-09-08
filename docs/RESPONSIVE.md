# What each desktop layout becomes on mobile

One line per layout, written when the layout is built, not afterwards. The point
is that step 7 is an adaptation rather than a rewrite.

`docs/PLAN.md` section 8 holds the intended answers for the layouts that do not
exist yet. This file records what was actually built.

## Built

- **Home grid** (`app/page.tsx`, `components/ProduceGrid.tsx`, issues 007 and
  008): one column of ingredient cards on mobile, two on tablet (`md:`), three
  on desktop (`lg:`) and four on a wide screen (`xl:`), which is the plan's
  mobile case after all. Cards are wide and short rather than tall, so a single
  column on a phone is a readable row, not a wasted screen. The imported-produce
  toggle is a single checkbox with a 44-pixel-plus touch target, full width on
  every size since there is nothing to reflow.
- **Ingredient card** (`components/ProduceGrid.tsx`, issue 008): a thumbnail on
  the left, 64 pixels square and 80 from `sm:` up, with name, origin tag and
  season line filling the rest of the row. The text column is `min-w-0` so a
  long name wraps instead of pushing the card wider, and the unverified badge
  sits at the end of the name row and never shrinks.

- **Origin tag** (`components/OriginTag.tsx`, issue 008): the same pill at every
  size, wrapping to a second line rather than overflowing when a country list is
  long, with the dot staying on the first line. Cards show only "Imported", so
  the tag is one short line at every width; the panel opts in and lists the
  countries, where a wrap costs nothing.
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
