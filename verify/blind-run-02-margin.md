# Blind run 02: Margin Analysis map (2026-08-15)

Cold reader: a fresh model session with no context, handed only the front door
(`map-margin-analysis/catalog.md`) and this question:

> "Head office wants to raise the estimated construction cost per square foot on one of our
> home models. Will that change the Final Projected Margin numbers our margin alerts are
> based on? And is there anything I should check per-record before trusting the effect?"

Constraint given: at most two more files from the map. No Airtable access.

## What the reader did

1. Opened `catalog.md` (front door).
2. Opened `change-walks/model-cost-bump.md`. The catalog listed the exact scenario.
3. Opened `cards/cost-stack.md`, to verify the walk's load-bearing claim, not out of need.

## The reader's answer (verbatim conclusion)

**No. Raising a Model's estimated construction cost per sq ft will NOT change Final
Projected Margin, and therefore will not move the margin alerts.** The Model bump flows
through base B (sq-ft derived) and stops at the plain Gross Margin pair; Final Projected
Margin, the alert, and commissions sit on base A, which is hand-typed on each snapshot.
Per-record check: the cost-per-sq-ft override wins over the Model lookup. 8 of 347 records
carry it, and those rows do not move at all.

This matches the source. Correct answer, correct caveat, two hops.

## Reader verdict on the map

- Two hops were comfortably enough; the second card was verification, not necessity.
- The territory's naming minefield (House Costs vs House Cost, the twin gross-margin fields)
  was anticipated by the catalog's tripwire section. "The confusion is the table's, not the map's."
- One nit, fixed after the run: the change walk cited the override only by id; it now names
  it in words ("the cost-per-sq-ft override").
