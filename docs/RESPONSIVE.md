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

- **Name editing** (`components/EditableName.tsx`, issue 009): a click on
  desktop, a press and hold on a touch screen, because a tap has to stay free
  for opening things and on a recipe title it will mean exactly that from step 2
  on. The field is sized from the text it holds and capped at the width of its
  column, so a long Finnish name never forces a horizontal scrollbar and a short
  one never collapses to a sliver. Both the name and the field it becomes are at
  least 44 pixels high at every size.

- **Photo contact sheet** (`components/ContactSheet.tsx`, issue 010,
  development only): one candidate tile per row on a phone, two from `sm:` up
  and four from `lg:`, so a row of four is one glance on a laptop and a short
  scroll on a phone. Tiles are a fixed height with `object-cover` rather than a
  fixed width, so photos of any shape line up. Every tile, its source link and
  the "None of these" button are at least 44 pixels high. Images are lazy
  loaded, which matters because the full September sheet is around 400 of them.
- **Half-blind row warning and carried-over choice** (`components/ContactSheet.tsx`,
  issue 010): both are full-width blocks inside the row at every size, above and
  within the tile grid rather than beside it, so nothing about them needs to
  reflow. The warning wraps to as many lines as it needs and is never truncated,
  since a truncated warning is worse than none.
- **Photo credits** (`app/credits/page.tsx`, issue 010): one list at every size,
  each entry wrapping to a second line rather than truncating, since an author
  and licence line is the whole content and hiding it would defeat the page.

## Not built yet

Month strip, combine control (its space is reserved in the panel, its logic is
step 5), name editing, and filters. See `docs/PLAN.md` section 8 for the
intended mobile form of each.
