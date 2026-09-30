## Parent

`docs/PLAN.md` step 3, the full twelve-month calendar: the part that touches
months Tia already verified.

## What to build

Settle the 28 January-to-April cases in `docs/SATOKAUSI-CONFLICTS.md` where
Tia's Notion data has a month as fresh and satokausi.fi calls it storage season,
plus any new ones issue 012 adds to that list. Each is a decision about Tia's own
verified data, so each gets one: move the month to `storageMonths`, keep it as
fresh, or something else she says.

The likely answer for most is "storage", since Notion had one column and could
not tell the two apart. That is Tia's call, not a default to apply in bulk.

Afterwards, the home view stops calling January carrots fresh, and the card and
panel say "from storage" where that is true.

## Type

HITL. It changes months Tia verified herself.

## Acceptance criteria

- [x] Tia has decided each case in `docs/SATOKAUSI-CONFLICTS.md`: all of
      them, at once, by trusting satokausi.fi (2026-09-30)
- [x] The decisions are applied to `data/ingredients/`, and the months stay
      verified, since Tia made the call
- [x] `docs/SATOKAUSI-CONFLICTS.md` records what was decided, or is retired
      with a line in `docs/DECISIONS.md`

## Tests

None new. Data only; the existing data tests still have to pass.

## Bilingual

None.

## Mobile

None.

## Blocked by

None, can start immediately. Best done after issue 012, so any new
disagreements it finds are settled in the same pass.

## Added by issue 012

- Button mushroom and oyster mushroom: satokausi says grown in Finland year
  round, and issue 012 filled May to December from that. Tia's Notion data has
  no January to April for them. Adding those months is a change to her months,
  so it is decided here.

## Done (2026-09-30)

Tia trusts satokausi.fi, so its reading of January to April replaces the
Notion one, applied by `scripts/apply-jan-apr.mjs`. 38 ingredients changed:
the fresh-to-storage splits listed in `docs/SATOKAUSI-CONFLICTS.md`, the 14
storage months satokausi lists that Notion left out, and January to April for
the two year-round mushrooms. Black salsify loses April, which satokausi does
not list. Twelve months are left as they were because the page gives no origin
flag for them: chicory in January, garlic January to March, and potato onion
and silverskin onion January to April.
