---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared
understanding. Walk down each branch of the design tree, resolving dependencies
between decisions one by one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, `docs/PLAN.md`, or
`docs/DECISIONS.md`, do that instead of asking.

Tia is not a professional developer. Ask in plain language: what the choice means
in practice, not what it is called. If a question only matters to the code and not
to how the app behaves, answer it yourself.

Two kinds of thing must never be invented as a plausible-sounding recommended
answer, because only Tia can settle them:

- Facts about Finnish seasonality: harvest months, storage seasons, what actually
  turns up at a Finnish market in a given month. If it is not already in `data/`
  or `docs/PLAN.md`, ask. A confident wrong month is worse than a question.
- Her own cooking: what she will actually make, what counts as easy or hard, how
  much effort is too much, which substitutions she would really accept.

Product decisions already settled live in `docs/PLAN.md` and `docs/DECISIONS.md`.
Do not reopen them unless the new question genuinely undermines one, in which case
say which decision and why.
