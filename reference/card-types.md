# Card types (closed set)

A map uses only these card types. Do not invent others.

1. **Catalog.** The front door. One per map. It lists the cards by name with a one-line "what it is," grouped by walk order. It points to cards and holds no detail. It names the ghosts and the wrong neighbour inline, so a reader is warned before they open anything. It may open with a **task index** ("Came here to do X, open this one card") so a reader who arrives with a task, not a noun, still lands in two hops. The index is part of the catalog, so it adds no hop. State the **observed vs not-observed surfaces**. No map may imply completeness beyond what was actually walked, and a "zero records" or "no reference" finding holds only within the observed scope (which environment, which identity or tenant).

2. **Noun card.** One per live or leftover noun. Lines: Name, Tag (live / leftover), Source, What it is **and why it matters** (the load-bearing why, the business meaning, the reason a change here is consequential and not just a definition. A rarely-run rollback path still matters), Shape (the parts that matter, not all of them), Hits, Does not hit. Optionally an **Observed** line (date plus source state) and what would invalidate the card, and a **Before you change this** line. That last line gives a human three cues: what is safe to edit, what needs review, what to never change alone. It doubles as the one-card escape hatch. When a change here is cross-cutting, it names the sibling cards to open before acting.

3. **Ghost card.** Kept short. Lines: Name, Tag (ghost), Source, Evidence it is dead, What a reader will mistake it for. Group same-pattern ghosts (for example several empty text shadows of real links) into **one** ghost card. One card per distinct trap, not one per dead field.

4. **Change walk.** Optional. One noun, one realistic change, traced through its Hits. It shows the map in motion. A change that is planned but not built is walked as a **planned extension**: where it attaches, and the spine it must not break.

**Card file format.** Each `cards/*.md` file holds exactly one card, and its heading ends with the tag in parentheses. For example `# Sale price (live)`, `# Legacy sync fields (leftover)`, or `# Text-shadow links (ghost)`. The verifier keys on that heading, so a card written as a plain `# Name` with a separate `Tag:` line will fail the one-card check.

**Starting a new map.** Copy the blanks in `templates/` (catalog, card, ghost, change-walk) and fill the placeholders. Start by copying, not by imitating an existing map.

**Group cards and coverage.** A card that stands for many files (a scaffolding group, a set of snapshots) claims them with a `**Covers:** <comma-separated globs>` line, for example `**Covers:** *.ps1`. `verify/coverage.mjs` then confirms every real file is accounted for (named in a card, claimed by a Covers glob, a registered ghost, or excluded-with-reason) so a map cannot quietly omit part of the system.

Nothing else is a card. A findings list is not a card. A how-to is not a card. A narrative of the week is not a card.
