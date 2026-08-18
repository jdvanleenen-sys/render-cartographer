# Roadmap: v2 directions (deliberately not built for this entry)

Three independent cold reviews (Perplexity, Claude Desktop, ChatGPT) converged on a set of deeper ideas. The cheap convergent ones are already folded into the method (see `CHANGELOG.md`). These are the bigger ones. They are genuinely good, but they are a v2 rearchitecture, not a competition deliverable. Captured here so they are not lost. The reviewers themselves flagged most of these as "do not build now."

## Near-term
- **Machine coverage-check. BUILT** (`verify/coverage.mjs` plus the `Covers:` convention). Every registered file is carded, grouped by a `Covers:` glob, marked a ghost, or excluded-with-reason. Unaccounted files fail loud. Proven red to green on the HFS folder (162 to 0) and clean on a 180-file vault.
- **`.md` and wikilink anchor mode (next).** In a note vault, `.md` is the primary content, but the path-anchor excludes `.md` (so a card's own sibling references are not flagged). The result is that note and wikilink citations get no existence check. Coverage still catches a *missing* note, but not a card citing a note that is not there. Add an opt-in vault mode that anchors `.md` and `[[wikilink]]` citations against the folder index while skipping map-internal paths (`cards/`, `change-walks/`).

## v2 primitives: the reframe worth designing before building
The card is one *renderer*. The durable model underneath is a small schema:
- **Object, Edge, Claim, Evidence, Observation-scope, Freshness, Change-impact, Non-impact-boundary.**
- **Edges as first-class, evidence-bearing objects** (`A --[condition / evidence / failure-mode]--> B`), because the dangerous facts (runtime, conditions, fallback, timing, permissions, manual handoffs) live *between* nouns, not inside them.
- **Evidence classes (how we know), not a confidence percentage:** existence, static-dependency, config-wiring, observed-runtime, controlled-intervention, human-attested. Avoid confidence percentages. They are epistemic theatre.
- **Two axes for lifecycle:** status = live / leftover / ghost / unknown. activation = always / conditional / dormant / manual / external.
- **Claim-level freshness index:** a reverse map from source to the claims it backs, so a changed file marks *only its claims* stale, not the whole map.

## Stronger correctness test (v2)
**Blast-radius challenge (a mutation test for the map):** predict what a change hits, make the change in a sandbox, diff prediction against reality, score the miss. Measure **blast-radius recall** (of what a change actually touched, how much did the map predict, and recall has to dominate) and **precision** (of what it warned about, how much mattered). A real acceptance metric, stronger than "a fresh reader navigated it."

## Domain packs (v2)
Per-domain definitions of noun, proof, and status: notebooks (execution-state, reproducibility), legal (governs / superseded, precedence, effective dates), marketing (rights / licensing, brand version, expiry), physical plant (system-of-record vs physical-verification), freeform Notion (social wiring: owner-confirmed / observed-use / inferred).

## The through-line
All of it serves one principle, the maturity step from "clever AI documentation" to "compressed system knowledge with falsifiable provenance":

> The map has to expose what it does not know as aggressively as what it knows.
