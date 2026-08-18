# Naming collisions in this territory

Write the collisions down. In this base the same word means different things, and a reader (or a model) will grab the wrong one. Chat is not always Chat.

## "QA" is two things on one noun

On **Render Variants**, the `Status` field can hold the value **"QA Passed"**, and there is a *separate* field `QA Status` holding **"Passed"**. A reader asked "is this render QA'd?" must know which field answers. `Status` is lifecycle (Ready then QA Passed). `QA Status` is the gate result (Passed or not).

## "Is it good?" is three different fields on three nouns

- Render Variants: `QA Status`
- Home Photography Assets: `Validation Status`
- Homeowner Portal Documents: `Verification Status`

Same question, three field names, three nouns. Do not assume one answers for another.

## "Selections" is not always the live link

On **Catalogue Items**, `Homeowner Portal Selections` is the live link. `Homeowner Portal Selections 2`, `3`, and `4` are ghosts (see the ghost card in `examples.md`). The right name is not the right field.

## "Tasks" and "Deposits" are base-wide traps

Outside the slice, the base has four tables that are some form of "Tasks" (`Tasks`, `Tasks`, `Asana Tasks`, `Task Templates`) and several "Deposits" (`Deposits`, `Deposits (Normalized)`, `Landscaping Deposits`). None are part of the Render Factory. Named here so a reader does not wander into them.
