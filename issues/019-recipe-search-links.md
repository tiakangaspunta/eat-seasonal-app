## Parent

`docs/PLAN.md` step 3: "the recipe search shortcut". Section 7, Recipe search
shortcut.

## What to build

Next to an ingredient in its panel, links that open k-ruoka's, soppa365's and
yhteishyva's own recipe search for that ingredient, each in a new tab. Nothing is
fetched, read or stored by the app. The search runs in Finnish, so it uses
`searchTermFi` where an ingredient's name is not Finnish, and the name
otherwise.

**Before building, Tia confirms each site's search address by hand**: open the
site, search a known term (for example "fenkoli"), and paste the address that
results. They are not guessed, and k-ruoka cannot be checked automatically.

`searchTermFi` is filled for ingredients whose name is English, from the Finnish
name on their satokausi.fi page where there is one (already recorded as the slug
in `scripts/september-source.mjs`). Anything without a source is asked, not
translated.

## Type

HITL. The three search addresses only Tia can confirm, and the Finnish terms are
checked by her.

## Acceptance criteria

- [ ] Tia has pasted the three confirmed search addresses
- [ ] The ingredient panel has the three links, opening in a new tab with
      `rel="noopener noreferrer"`
- [ ] The search term is Finnish for every ingredient: its name, or its
      `searchTermFi`
- [ ] `searchTermFi` values come from a source or from Tia, never a machine
      translation
- [ ] `docs/FLOWS.md` and `docs/RESPONSIVE.md` updated

## Tests

Building the search address for an ingredient: Finnish name used as is,
`searchTermFi` preferred when present, and the term encoded (ä, ö, spaces).
Small, but a wrong address fails silently as a dead search.

## Bilingual

`search.heading: { en: 'Find more recipes', fi: '' }`, and one accessible label
per link, for example
`search.link: { en: 'Search {site} for {term} (opens in a new tab)', fi: '' }`.
Site names are proper nouns and stay as they are.

## Mobile

Three links in a row on desktop, wrapping to a stack on narrow screens, each at
least 44 pixels high.

## Blocked by

None, can start as soon as Tia has confirmed the three addresses.
