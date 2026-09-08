# What each desktop layout becomes on mobile

One line per layout, written when the layout is built, not afterwards. The point
is that step 7 is an adaptation rather than a rewrite.

`docs/PLAN.md` section 8 holds the intended answers for the layouts that do not
exist yet. This file records what was actually built.

## Built

- **Home grid** (`app/page.tsx`, `components/ProduceGrid.tsx`, issue 007): one
  column of ingredient cards on mobile, two columns on tablet (`md:`), four on
  desktop (`lg:`). The imported-produce toggle is a single checkbox with a
  44-pixel-plus touch target, full width on every size since there is nothing to
  reflow.

## Not built yet

Side panel, month strip, combine control, name editing, and filters. See
`docs/PLAN.md` section 8 for the intended mobile form of each.
