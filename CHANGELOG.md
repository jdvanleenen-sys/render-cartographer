# Hardening log

Three independent cold-reader passes. Each pass: a fresh agent with no context loaded the skill, mapped a real body of work using only the skill, and kept a friction log. Real instruction gaps were fixed before the next pass. Territory artifacts were discarded; only instruction fixes were kept. The verifier stayed green on the shipped maps and red on all seven negative fixtures throughout.

## Pass 1 — Projects & Addresses (159 fields)
Verdict: map passed the verifier, but only because the agent read the verifier source. A cold reader following the prose would have failed.
Root cause: the method prose and the verifier (`verify_map.mjs` + `source-index.json`) were two unreconciled specs.
Fixed:
- Documented `source-index.json` and added `reference/verifier-and-source-index.md` (the register-a-slice recipe).
- Three verifier false-positives removed: ids after the word "field", field-level "N records" counts, and ghosts named in a legitimate "Does not hit" line.
- Added the noun-altitude rule (single large table → one card per field cluster).
- Group same-pattern ghosts into one card; two-hop rule may point to one sibling; database reads take more than one call; blind-run reframed as a conditional stronger check.

## Pass 2 — Contract (75 fields)
Verdict: map clean first pass, but found a genuine design flaw.
- **F4 (the flaw):** `ghost_names` is a substring match, so registering a dead field whose name collides with a live table would false-fail correct live cards — the exact collision case the skill exists to catch. Fixed by documenting: for a colliding name, register the `fld` id in `ghost_fields`, never the name.
- Shipped `verify/build-source-index.mjs` — the generator both agents had to hand-write.
- Documented the required card-heading format (`# Name (live)`), a cluster-size heuristic (~5–12 fields), the negligible-nonzero ghost rule, the Hits-vs-navigation clarification, the partial-entry trap, and pointed single-table mappers to `map-margin-analysis/`.

## Pass 3 — Models (46 fields, a shared dependency)
Verdict: **the skill alone carried a cold reader to a compliant, wanderable map on the first verifier pass, including the hard shared-dependency case.** The agent actively tried to break the pass-2 collision fix and confirmed both the hazard and the documented workaround. Remaining items were polish, not blockers.
Fixed:
- Finished the generator: it now emits the `fields` id-map, not just `table_fields`, so no `fld` id is hand-typed.
- Documented how to obtain the base dump when the list-tables call overflows the token limit.
- Made the ghost rule scale-free and added the duplicate-name-vs-evidence test (`… copy` with distinct data is a live field with a bad name, not a ghost).
- A neighbour named only in Hits needs only a `tables` entry; slurp warnings must be phrased subject-first.

## Pass 4 — HFS → Airtable n8n folder (183 files, a non-database territory)
Verdict: the **method** carried a cold reader to a compliant folder map on the first pass — it isolated a ~2-file live system from ~181 files of scaffolding and caught a real landmine (`deploy_v2.ps1` would revert the live sync from v3 to v2). But the **verifier** was Airtable-shaped and failed *open* on a folder: only the structural checks did any work, so "clean" proved shape, not truth.
Fixed (folder ground truth):
- Generator gains a folder mode: `build-source-index.mjs --dir <folder> --key <name> --write` indexes every real file path into `folders[<name>].files`.
- Verifier gains a **path anchor** (every filename-shaped file a card cites must exist in the index), **ghost-file-as-live**, and a **fail-loud** guard when a folder map cites files with no folder registered.
- Fixed a false positive: `item.json` (n8n code) was read as a file; the check now requires a distinctive filename stem.
- Two new negative fixtures (`fail_uncited-file`, `fail_ghost-file-as-live`); promoted `map-hfs-sync/` as the worked folder example.

## Cold ICM Architect audit
A fresh reviewer loaded the ICM Architect skill (audit mode) and checked this folder against ICM's own conventions, with no knowledge of how it was built. Verdict: **mostly clean, "unusually rigorous where it counts"** — it confirmed guards-in-code (ran the verifier: 36 files clean, 9 fixtures fail), source-vs-derived separation, catalog-points-only, one-card-per-file, closed sets, and the correct system-map form. One moderate finding acted on:
- **`examples.md` was a hand-maintained duplicate of `map/`** (a one-home-per-fact risk). Fixed: `examples.md` is now generated from `map/` by `verify/build-examples.mjs` — a derived twin that cannot drift, the same discipline as `source-index.json`.
- Minor items noted (blank `_templates/`, per-folder `CONTEXT.md`, ICM vocabulary): added an "In ICM terms" bridge to the README; the rest are optional polish (a system map is dropped standalone, and its catalog already serves as the folder contract, so a separate CONTEXT.md would itself duplicate the catalog).
Disclosure for submission: **hand-built to the ICM system-map form, then verified against the ICM Architect skill.**

## Third-party generality test + comp-10 lessons
- **"Anyone, any system" proven:** a cold agent with no knowledge of the repo or its owner mapped a third-party code repo (`claude-office-skills-ref`, 134 files) using only the skill — clean map, verifier clean across all maps. The `map-hfs-sync/` example served as the folder template. Found a real ghost (an orphan byte-copy) by md5.
- **Generator bug fixed** (found by that test): folder mode `--dir … --write` wrote correctly but fell through into database mode and exited 2; now exits 0.
- **Folder discoverability:** added a signpost at the top of `verifier-and-source-index.md` so a repo/vault user isn't misled that the skill is Airtable-only.
- **Comp-10 tie-breaker incorporated** (Jodi Paige-Lee lost a tied card for it; Marcelo Michelsohn won his lane with it): *well-formed is not correct.* Added `rules.md` §8 — trace load-bearing claims to source (verified) or mark them inferred; the independent keys are the source trace and a blind cold-reader run, never the verifier checking itself. Matching note in `SKILL.md`.

## External cold-read incorporations (Perplexity)
An outside model reviewed the concept. Genuine gaps folded in:
- **Runtime/operational reality** (their #1, our biggest real gap): `rules.md` §4 now requires Hits/Does-not-hit to consider runtime dependencies (schedules, flags, permissions, credentials, env/external config, manual steps, timing), not just static structure — a card can cite files correctly and still be wrong about impact.
- **Why it matters** (convergent with the ICM audit): the noun card now carries the load-bearing *why / business meaning*, and liveness is defined as being *in force, not frequency* (a yearly rollback path is live and critical). `rules.md` §2, `card-types.md`.
- **Provenance enriched**: §8 now distinguishes verified-static / verified-runtime / inferred (a static trace does not prove runtime behaviour), and holds **"Does not hit"** to that standard as an absence claim that ages badly.
- **Lightweight freshness**: cards stamp *observed + when* and *what would invalidate this* (§8). The full drift-alarm engine was judged over-scope.
Noted, not built (over-scope or already seeded): domain packs (legal/Notion/marketing), a lifecycle/supersession engine, visuals, a reader-mission index (change-walks already are task paths).

## External cold-read incorporations (Claude Desktop)
Converged with Perplexity on freshness and the "does not hit" absence problem (already added) — convergence raised confidence those were right. New, folded in:
- **"Unknown" fourth state** — ambiguous evidence no longer defaults upward to a false "live"; the verifier accepts `unknown` and still requires Hits/Does-not-hit on it. `rules.md` §2.
- **Coverage doctrine** — account for every noun (its own card, a named group card, or an explicit excluded-with-reason list); the catalog's "everything else is X" line is a coverage claim, and must be true. `rules.md` §1.
- **Scope boundary stated out loud** — `identity.md` now names where the method is trustworthy (deterministic, citeable structure: code, DBs, folders) vs where it degrades toward inference (legal, marketing, freeform Notion) and the voice must soften.
Already done that CD suggested: a rendered human view (the HTML map viewers).
Recommended next build (CD's sharpest gap, not yet code-enforced): a **machine coverage-check** — every registered file/table is carded, grouped, or excluded — turning the coverage doctrine into a guard.

## External cold-read incorporations (ChatGPT)
Third independent review. It converged with the other two on freshness, bounded non-impact, unknown, and coverage — three-way convergence confirmed those were real. Folded in:
- **Bounded non-impact** (`rules.md` §4): a bare "does not hit X" is no longer allowed; it must name the surfaces checked and the revision. Absence within a stated scope is honest; absence stated as fact is a trap.
- **Freshness pinned to revision; stale ≠ wrong** (`rules.md` §8): load-bearing claims pin to the source state they were checked against; a changed source makes a claim *stale* (flag for re-check), not silently trusted or silently regenerated. States kept distinct: verified / stale / unknown.
- **Observation scope per map** (`card-types.md`, catalog template): the catalog states observed vs not-observed surfaces; no map implies completeness beyond what was walked; a "zero"/"no reference" finding holds only within the observed scope.
- **"Before you change this"** (optional card element): safe / needs-review / never-change-alone — a human-facing field that doubles as the one-card escape hatch for cross-cutting changes.
Deeper v2 ideas (edges-as-first-class, an object/edge/claim/evidence schema, evidence classes, status×activation, a mutation-test "blast-radius" metric, domain packs) are captured in `ROADMAP.md`, not built — ChatGPT itself flagged them as v2, and they would rearchitect the tool rather than sharpen this entry.

## Coverage check built (the last convergent code gap)
Turned the coverage doctrine into a guard. `verify/coverage.mjs <map-dir> <folder-key>` fails loud unless every real file is accounted for — named in a card, claimed by a card's `**Covers:** <glob>`, a registered ghost, or an excluded-with-reason entry. Proven red-then-green on the HFS map: **162 unaccounted scripts before, 0 after** adding `**Covers:** *.ps1` to the scaffolding card (21 named + 162 grouped = all 183). This closes the completeness gap two of three cold reviews ranked sharpest: a citation-check proves what is *in* the map is real; coverage proves the map did not omit the object that breaks four "does not hit" claims.

## Fifth shape proven — Obsidian vault (spark #4)
A cold agent mapped a 180-file Obsidian vault (`claude-obsidian`) — both gates clean, all 180 files accounted for (128 named, 27 grouped, 25 excluded-with-reason). It used the `[[wikilink]]` graph as real citeable edges (a 27-inbound-link page flagged a stale-but-load-bearing roadmap), separated a live plugin toolkit from an empty knowledge scaffold, and passed the spark test (a collaborator can add a note without breaking the spine). The tool is now proven on **five shapes**: multi-table base, single big table, n8n folder, third-party code repo, linked vault.
Three real fixes it surfaced:
- **coverage `referenced()`** — a full-path citation (`tests/foo.py`) now counts as referenced (was forcing a bare-basename re-mention).
- **tag qualifiers** — a card heading may carry a qualifier: `(live, opt-in)`, `(live, empty scaffold)`. Also gives the "live wiring over empty data" expressiveness the vault needed.
- **path-scoped globs** — `Covers:` / `excluded` globs containing a `/` now match the relative path, not just the basename (no cross-folder basename collision).
Roadmapped: an opt-in `.md`/wikilink anchor mode for vaults (see `ROADMAP.md`).

## State at close
- Verifier: 36 shipped map files clean across three territory shapes (multi-table base, single large table, folder/automation pack); 9 negative fixtures all fail by name.
- Proven on three source shapes: `map/` (Render Factory), `map-margin-analysis/` (single table), `map-hfs-sync/` (n8n folder).
- Skill installed at `~/.claude/skills/cartographer` and verifies clean from there.
- The method generalised across all three; the only territory-specific work was teaching the verifier to check folder file-paths, now done.
