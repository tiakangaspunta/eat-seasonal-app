# What each desktop layout becomes on mobile

One line per layout, written when the layout is built, not afterwards. The point
is that step 7 is an adaptation rather than a rewrite.

`docs/PLAN.md` section 8 holds the intended answers for the layouts that do not
exist yet. This file records what was actually built.

## Built

- **Data preview** (`app/preview/`, temporary, deleted at issue 007): each
  ingredient is a row with its name above a twelve-month bar on mobile, and name
  beside bar on desktop. The month bar wraps rather than scrolls, so twelve
  24-pixel squares stay reachable on a narrow screen. Recipe rows stack the
  title, the details, and the source link on mobile, and put them on one line
  with the link pushed right on desktop.

## Not built yet

Home grid, side panel, month strip, combine control, name editing, and filters.
See `docs/PLAN.md` section 8 for the intended mobile form of each.
