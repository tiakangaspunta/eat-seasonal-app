## Parent

`docs/PLAN.md` step 1, section 3.

## What to build

Pick roughly 10 recipes from the 30 that use September produce (once slice 4
lands, this includes more than just bok choy and suppilovahvero recipes). For
each: read the source page once, extract the real ingredient list with
quantities, map each line to an ingredient id where one exists or leave it as
`freeText`, fill in effort and time where still missing, and draft vegan and
seasonal substitutions per the `Substitution` type. For the two recipes touching
`Other unusual` and `Spices`, resolve what those actually were from the source
page rather than leaving a placeholder.

Cooking steps are not copied. Only the ingredient list, quantities, and Tia's own
substitution notes go into the app; the method stays a link.

## Type

HITL. Substitutions and notes are original content presented as Tia's own advice,
and she should read them before they're shown that way, even though drafting them
does not require her to be present.

## Acceptance criteria

- [ ] ~10 recipes have complete, real ingredient lists with quantities
      (4 of 10 done, 6 blocked, see Paused below)
- [x] Every mapped ingredient references a real ingredient id from slice 2
      (now enforced by a test in `lib/data/recipes.test.ts`, which nothing
      checked before)
- [ ] Effort and time are filled for all ~10 (time filled for the 4 done;
      `effort` deliberately left as Notion had it, since how hard a recipe is
      to cook is Tia's judgment)
- [ ] Each has at least one substitution where a sensible one exists (vegan or
      seasonal) (true for the 4 done, and tested)
- [x] The `Other unusual` and `Spices` recipes have their real ingredients, not
      a placeholder
- [ ] No cooking steps copied from the source pages (holds so far)
- [ ] Tia has read the drafted substitutions, per the HITL note above

The `Other unusual` and `Spices` line above says "the two recipes", which was
wrong: `Spices` appears on one recipe and `Other unusual` on four. Both are now
resolved for the recipes rebuilt so far. The remaining `Other unusual` recipes
are Herby oven-baked tofu, Suppilovahvero pasta, and Carrot pancakes with
avocado salad.

## Paused: the k-ruoka.fi recipes

Paused 2026-09-03, at Tia's request. Nothing here is a code problem, so it can
sit until she has time.

**Done, 4 of 10.** Lime noodles and Red cabbage bao buns (satokausi.fi),
Mushroom filling for tacos (yhteishyva.fi), Aubergine pasta (sydanmerkki.fi).

**Blocked, 6 of 10.** All on k-ruoka.fi, which answers an automated fetch with a
Cloudflare "Just a moment... Enable JavaScript and cookies to continue"
interstitial rather than the page. Its `robots.txt` allows `/reseptit/`, so this
is a bot challenge and not a policy refusal, and getting past it would mean
evading bot protection. So the page genuinely cannot be read here, and the
project rule against drafting from memory applies.

| Recipe | URL |
| --- | --- |
| Chickpea patties | `https://www.k-ruoka.fi/reseptit/kikhernepihvit` |
| Green peppercorn salmon with fennel stew | `https://www.k-ruoka.fi/reseptit/viherpippurilohi-ja-fenkolimuhennos` |
| Herby oven-baked tofu | `https://www.k-ruoka.fi/reseptit/yrttinen-uunitofu` |
| Palak paneer | `https://www.k-ruoka.fi/reseptit/palak-paneer` |
| Summer soup | `https://www.k-ruoka.fi/reseptit/varikas-kesakeitto` |
| Suppilovahvero pasta | `https://www.k-ruoka.fi/reseptit/suppilovahveropasta` |

**To unblock, paste per recipe:** the ingredient list exactly as printed, in
Finnish, with quantities, units, and any sub-headings (`Kastikkeeseen:`) kept;
the servings figure, and which servings number it was copied at if the page has
a selector; and the total time if shown. Not the method: steps stay a link.
Not the effort rating either, which is already set and is Tia's call.

This is not only slice 5's problem. **17 of the 30 recipes are k-ruoka.fi**, so
steps 2 and 3 hit the same wall. The other 11: Baked feta and asparagus pasta,
Carrot pancakes with avocado salad, Chanterelle pie, Chanterelle sauce, Creamed
vegetable soup, Indian lentil soup, Rich peanut curry, Root vegetable and
mushroom pie, Shakshuka, Spinach pancakes, Sweet potato curry.

## Open: kantarelli is not an ingredient

`funnel-chanterelle` (Suppilovahvero, fresh September to November, verified by
Tia) exists. Ordinary kantarelli does not, because Notion never had a row for
it, so slice 2 had nothing to import and slice 4 nothing to source.

Chanterelle sauce and Chanterelle pie are named after it and have nothing to
point at. Rebuilt as-is, their main ingredient becomes `freeText` and drops out
of seasonal matching, so the app would never surface chanterelle sauce in
chanterelle season. They are different mushrooms with different seasons,
roughly July to September against September to November, so one entry cannot
cover both.

Not urgent: both recipes are k-ruoka.fi and blocked anyway. Needs Tia's call on
whether to add it now, with its months fetched from satokausi.fi and flagged
drafted, or leave it to step 3.

## Tests

None in `lib/season/` from this slice directly, but this is the first data that
exercises the availability logic in slice 6 meaningfully, so it's worth a manual
check that at least one rebuilt recipe reads as in-season for September once both
land.

## Bilingual

None, recipe content is single-field or plan-exempted.

## Mobile

None.

## Blocked by

Blocked by `issues/002-import-ingredients.md`, `issues/003-import-recipe-metadata.md`,
and `issues/004-september-calendar.md`.
