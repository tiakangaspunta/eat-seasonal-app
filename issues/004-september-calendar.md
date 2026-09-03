## Parent

`docs/PLAN.md` step 1.

## What to build

For every ingredient in `data/ingredients/`, add September to `freshMonths` and,
where relevant, `storageMonths`, sourced from satokausi.fi. This applies broadly,
not only to the two ingredients that already had a September entry (bok choy,
suppilovahvero), since Tia's own data only ever covered January through April and
says nothing about whether carrots, cabbage, or potatoes are in season in
September, even though they plausibly are. Every month added this way is
`verified: false`.

## Type

HITL. Drafted Finnish seasonality is exactly the thing that must never be
invented confidently. Tia reviews the draft, corrects wrong entries, and the
unverified badge stays until she does.

## Acceptance criteria

- [ ] Every ingredient's September availability reflects satokausi.fi, domestic
      and imported both where relevant
- [ ] Every month added in this slice is `verified: false`
- [ ] Existing `verified: true` months from Tia's own data are untouched
- [ ] The set of ingredients now showing as in-season in September is listed
      somewhere reviewable (a script output is fine)

## Tests

None, this is content, not logic.

## Bilingual

None.

## Mobile

None.

## Blocked by

Blocked by `issues/002-import-ingredients.md`.
