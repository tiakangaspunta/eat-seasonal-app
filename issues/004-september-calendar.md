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

**Sourcing note:** satokausi.fi has an individual page per ingredient at
`satokausi.fi/raaka-aineet/<finnish-name>/`, each with a real month breakdown into
storage season, in season, and peak season (Finnish: Varastosesonki, Sesongissa,
Huippusesonki), which maps directly onto `storageMonths`, `freshMonths`, and
`peakMonths`. Confirmed working on `porkkana` (carrot) already. Claude Code likely
has no web access, so this data should be pulled in the Cowork session that has
`WebFetch`, not guessed here from general knowledge: come back to that session
with this issue, ask it to fetch each September ingredient's page, and bring the
results back as the source for this file's changes.

## Type

HITL. Drafted Finnish seasonality is exactly the thing that must never be
invented confidently. Tia reviews the draft, corrects wrong entries, and the
unverified badge stays until she does.

## Acceptance criteria

- [ ] Every ingredient's September availability reflects satokausi.fi's actual
      per-ingredient page, not general knowledge, domestic and imported both
      where relevant
- [ ] `peakMonths` is filled where satokausi.fi distinguishes peak season
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
