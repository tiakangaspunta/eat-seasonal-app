# Adding a recipe

There is no form in the app for this. A recipe is added by pasting its URL into
Claude Code, which writes one JSON file into `data/recipes/`. The reasons are in
`docs/PLAN.md` section 3; an in-app form is reconsidered at the mobile step.

## The workflow

1. **Tia pastes the recipe's URL.** One recipe at a time, from a page she chose.
2. **Claude reads that one page**, if the site allows it (see the table below).
   If it does not, Tia pastes the ingredient list instead (see "Pasting by
   hand").
3. **Claude drafts the entry and shows it before writing anything:**
   - the ingredient list with quantities, each line mapped to an ingredient id
     in `data/ingredients/` where one exists, or kept as `freeText` where it is
     not produce the app tracks (soy sauce, hoisin);
   - servings and total time, where the page gives them;
   - meal type, tags and effort, proposed. Effort is Tia's call, so it is a
     question, not a guess;
   - vegan and seasonal substitutions, drafted as Tia's own advice for her to
     read and correct.
4. **Tia approves or corrects.** Anything about Finnish seasonality that is not
   already in `data/`, and anything about her own cooking, is asked, not
   guessed.
5. **Claude writes `data/recipes/<id>.json`.** The id is an English slug
   (`lime-noodles`) and never changes; the title can be in any language and is
   renamed in the app.
6. **The checks run.** `npm test` confirms every `ingredientId` points at a real
   ingredient. If an ingredient the recipe needs does not exist yet, adding it
   is a separate question for Tia, since its months have to come from a source.

## What never goes in

- **Cooking steps.** The method stays on the source page, reached through the
  "method" link, which opens in a new tab. Only recipes Tia writes herself have
  `steps`.
- **Anything drafted from memory and presented as the source's.** If the page
  cannot be read, the ingredient list comes from Tia, not from a guess at what
  the recipe probably contains.

## Which sites can be read

Tested 2026-09-30, one recipe page per site, and each site's `robots.txt` read
for rules about AI assistants. A site can add a bot check at any time, so this is
a starting point, not a promise. When a fetch fails, the answer is to paste by
hand, not to retry or to look for a way around the block.

| Site | Result | Adding a recipe |
| --- | --- | --- |
| satokausi.fi | Readable | Claude reads it |
| yhteishyva.fi | Readable | Claude reads it |
| sydanmerkki.fi | Readable | Claude reads it |
| ravintolanepal.fi | Readable | Claude reads it |
| arla.fi | Readable | Claude reads it |
| valio.fi | Readable | Claude reads it |
| kotikokki.net | Readable. Recipes are written by its users, so quality varies | Claude reads it |
| k-ruoka.fi | Cloudflare bot check instead of the page | Tia pastes |
| soppa365.fi | Refused by Claude Code's fetch tool, and its `robots.txt` turns away AI assistants by name | Tia pastes |
| fazer.com | The page loads its recipe with JavaScript, so a fetch gets an empty shell | Tia pastes |

## Pasting by hand

For a site Claude cannot read, paste from the page:

- the ingredient list exactly as printed, in Finnish, with quantities, units and
  any sub-headings (`Kastikkeeseen:`) kept;
- the servings figure, and which servings number it was copied at if the page
  has a selector;
- the total time, if shown.

Not the method, which stays a link. Not the effort either, which is Tia's call.
The rest of the workflow is the same as for a site Claude can read.
