## Parent

`docs/PLAN.md` step 3 (the rest of the year): "full twelve-month calendar for
all ingredients".

## What to build

Fill in May to August and October to December for every ingredient, domestic
and imported, from each ingredient's own page on satokausi.fi, the same way
issue 004 filled September. Afterwards, every month of the home view shows what
is actually in season then, instead of 0 to 2 items outside January to April
and September.

The tooling exists: `scripts/satokausi-fetch.mjs` already parses the whole
year's table off a page (storage season, in season, peak season, and the origin
flags), and `scripts/september-source.mjs` holds the satokausi slug for each
ingredient. This slice runs that over the months still missing and applies the
result. It does not re-fetch anything by memory or fill gaps from general
knowledge: an ingredient satokausi has no page for stays as it is, and is
listed for Tia.

Scope rules, carried over from issue 004:

- Months Tia already verified (January to April, and any she has since
  confirmed) are not touched. Where satokausi disagrees with them, that goes to
  issue 013, not here.
- Every month added here is drafted, recorded in `unverifiedMonths` (or
  `verified: false` for an ingredient with no verified months).
- Includes the 23 seasonal ingredients with no domestic months at all. Most
  are imported-only (citrus, banana, mango), which satokausi should confirm.
  Basil, coriander, thyme, peas and strawberry are not, and are exactly the
  kind of gap this slice is for.

## Type

HITL. Finnish seasonality is never guessed, so Tia reads the drafted months
before they count as settled. Reviewing is month by month, as with
`docs/SEPTEMBER-REVIEW.md`.

## Acceptance criteria

- [x] Every ingredient with a satokausi page has May to August and October to
      December filled from that page: fresh, storage and peak, domestic and
      imported with countries
- [x] Verified months are unchanged; disagreements are listed for issue 013
- [x] Every month added is marked drafted
- [x] Ingredients with no satokausi page are listed for Tia, not filled in
- [x] A review document, one section per month, for Tia to read
- [x] ~~Tia has read it, and her corrections are applied~~ Not needed: Tia
      decided on 2026-09-30 that satokausi.fi is trusted as the source, and
      mistakes are fixed as she finds them (see `docs/DECISIONS.md`)

## Tests

None new: the availability logic in `lib/season/` already works for any month
and is tested. This slice is data. The existing data tests still have to pass
(valid months, no month both fresh and storage).

## Bilingual

None. Months and categories already have their labels.

## Mobile

None. No layout changes.

## Blocked by

None, can start immediately.

## Where this got to (2026-09-30)

Drafted and applied, waiting for Tia's read of `docs/YEAR-REVIEW.md`.

- 119 satokausi.fi pages read once each, saved as `scripts/year-source.json`.
  `scripts/apply-year.mjs` writes them (dry run by default, safe to rerun) and
  `scripts/year-review.mjs` writes the review back out of the data.
- 113 ingredients got months. Seasonal produce per month, fresh from Finland,
  now reads: May 21, Jun 49, Jul 64, Aug 82, Oct 43, Nov 25, Dec 7, with storage
  taking over from October (19, 23, 35).
- Left for Tia, nothing written: 11 months with no origin flag on the page
  (mostly red cabbage June to December), romanesco's June flag "EPS", and
  basil, coriander and thyme, which have no page.
- Button and oyster mushroom say "grown in Finland year round" in words, and
  were filled from that.
- Bok choy June to August and funnel chanterelle October and November were
  already Tia's, and were left alone.
