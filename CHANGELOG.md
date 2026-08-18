# Hardening log

Three independent cold-reader passes. Each pass worked the same way. A fresh agent with no context loaded the skill, mapped a real body of work using only the skill, and kept a friction log. Real instruction gaps got fixed before the next pass. The territory artifacts were thrown away. Only the instruction fixes were kept. The verifier stayed green on the shipped maps and red on all seven negative fixtures the whole time.

## Pass 1: Projects & Addresses (159 fields)
Verdict: the map passed the verifier, but only because the agent read the verifier source. A cold reader following the prose would have failed.
Root cause: the method prose and the verifier (`verify_map.mjs` plus `source-index.json`) were two specs that had never been reconciled.
Fixed:
- Documented `source-index.json` and added `reference/verifier-and-source-index.md` (the register-a-slice recipe).
- Removed three verifier false positives: ids after the word "field", field-level "N records" counts, and ghosts named in a legitimate "Does not hit" line.
- Added the noun-altitude rule (a single large table gets one card per field cluster).
- Group same-pattern ghosts into one card. The two-hop rule may point to one sibling. Database reads take more than one call. The blind run was reframed as a conditional stronger check.

## Pass 2: Contract (75 fields)
Verdict: the map was clean on the first pass, but it found a real design flaw.
- **F4 (the flaw):** `ghost_names` is a substring match, so registering a dead field whose name collides with a live table would false-fail correct live cards. That is the exact collision case the skill exists to catch. Fixed by documenting it: for a colliding name, register the `fld` id in `ghost_fields`, never the name.
- Shipped `verify/build-source-index.mjs`, the generator both agents had to hand-write.
- Documented the required card-heading format (`# Name (live)`), a cluster-size rule of thumb (about 5 to 12 fields), the negligible-nonzero ghost rule, the Hits-vs-navigation clarification, the partial-entry trap, and pointed single-table mappers to `map-margin-analysis/`.

## Pass 3: Models (46 fields, a shared dependency)
Verdict: **the skill alone carried a cold reader to a compliant, walkable map on the first verifier pass, including the hard shared-dependency case.** The agent actively tried to break the pass-2 collision fix and confirmed both the hazard and the documented workaround. What was left was polish, not blockers.
Fixed:
- Finished the generator. It now emits the `fields` id-map, not just `table_fields`, so no `fld` id is hand-typed.
- Documented how to get the base dump when the list-tables call is bigger than the token limit.
- Made the ghost rule scale-free and added the duplicate-name-vs-evidence test (`… copy` with distinct data is a live field with a bad name, not a ghost).
- A neighbour named only in Hits needs only a `tables` entry. Slurp warnings have to be phrased subject-first.

## Pass 4: HFS to Airtable n8n folder (183 files, a non-database territory)
Verdict: the **method** carried a cold reader to a compliant folder map on the first pass. It isolated a roughly 2-file live system from about 181 files of scaffolding and caught a real landmine (`deploy_v2.ps1` would revert the live sync from v3 to v2). But the **verifier** was Airtable-shaped and failed *open* on a folder. Only the structural checks did any work, so "clean" proved shape, not truth.
Fixed (folder ground truth):
- The generator got a folder mode: `build-source-index.mjs --dir <folder> --key <name> --write` indexes every real file path into `folders[<name>].files`.
- The verifier got a **path anchor** (every filename-shaped file a card cites has to exist in the index), **ghost-file-as-live**, and a **fail-loud** guard when a folder map cites files with no folder registered.
- Fixed a false positive: `item.json` (n8n code) was read as a file. The check now requires a distinctive filename stem.
- Two new negative fixtures (`fail_uncited-file`, `fail_ghost-file-as-live`). Promoted `map-hfs-sync/` as the worked folder example.

## Cold ICM Architect audit
A fresh reviewer loaded the ICM Architect skill (audit mode) and checked this folder against ICM's own conventions, with no knowledge of how it was built. Verdict: **mostly clean, "unusually rigorous where it counts".** It confirmed guards-in-code (ran the verifier: 36 files clean, 9 fixtures fail), source-vs-derived separation, catalog-points-only, one-card-per-file, closed sets, and the correct system-map form. One moderate finding got acted on:
- **`examples.md` was a hand-maintained duplicate of `map/`** (a one-home-per-fact risk). Fixed: `examples.md` is now generated from `map/` by `verify/build-examples.mjs`, a derived twin that cannot drift, the same discipline as `source-index.json`.
- Minor items noted (blank `_templates/`, per-folder `CONTEXT.md`, ICM vocabulary): added an "In ICM terms" bridge to the README. The rest are optional polish (a system map is dropped standalone, and its catalog already serves as the folder contract, so a separate CONTEXT.md would just duplicate the catalog).
Disclosure for submission: **hand-built to the ICM system-map form, then verified against the ICM Architect skill.**

## Third-party generality test plus comp-10 lessons
- **"Anyone, any system" proven:** a cold agent with no knowledge of the repo or its owner mapped a third-party code repo (`claude-office-skills-ref`, 134 files) using only the skill. Clean map, verifier clean across all maps. The `map-hfs-sync/` example served as the folder template. It found a real ghost (an orphan byte-copy) by md5.
- **Generator bug fixed** (found by that test): folder mode `--dir … --write` wrote correctly but then fell through into database mode and exited 2. It now exits 0.
- **Folder discoverability:** added a signpost at the top of `verifier-and-source-index.md` so a repo or vault user is not misled that the skill is Airtable-only.
- **Comp-10 tie-breaker incorporated** (one competitor lost a tied card for it, another won their lane with it): *well-formed is not correct.* Added `rules.md` §8. Trace load-bearing claims to source (verified) or mark them inferred. The independent keys are the source trace and a blind cold-reader run, never the verifier checking itself. Matching note in `SKILL.md`.

## External cold-read incorporations (Perplexity)
An outside model reviewed the concept. The real gaps got folded in:
- **Runtime and operational reality** (their #1, and our biggest real gap): `rules.md` §4 now requires Hits and Does-not-hit to consider runtime dependencies (schedules, flags, permissions, credentials, env and external config, manual steps, timing), not just static structure. A card can cite files correctly and still be wrong about impact.
- **Why it matters** (the same point the ICM audit made): the noun card now carries the load-bearing why and business meaning, and liveness is defined as being *in force, not frequency* (a yearly rollback path is live and critical). `rules.md` §2, `card-types.md`.
- **Provenance enriched:** §8 now separates verified-static / verified-runtime / inferred (a static trace does not prove runtime behaviour), and holds **"Does not hit"** to that standard as an absence claim that ages badly.
- **Lightweight freshness:** cards stamp *observed plus when* and *what would invalidate this* (§8). The full drift-alarm engine was judged over-scope.
Noted, not built (over-scope or already seeded): domain packs (legal, Notion, marketing), a lifecycle/supersession engine, visuals, a reader-mission index (the change-walks already are task paths).

## External cold-read incorporations (Claude Desktop)
Converged with Perplexity on freshness and the "does not hit" absence problem (already added), and that agreement raised confidence those were right. New, and folded in:
- **"Unknown" fourth state.** Ambiguous evidence no longer defaults upward to a false "live". The verifier accepts `unknown` and still requires Hits and Does-not-hit on it. `rules.md` §2.
- **Coverage doctrine.** Account for every noun (its own card, a named group card, or an explicit excluded-with-reason list). The catalog's "everything else is X" line is a coverage claim, and it has to be true. `rules.md` §1.
- **Scope boundary stated out loud.** `identity.md` now names where the method is trustworthy (deterministic, citeable structure: code, databases, folders) versus where it degrades toward inference (legal, marketing, freeform Notion), and how the voice has to soften.
Already done that CD suggested: a rendered human view (the HTML map viewers).
Recommended next build (CD's sharpest gap, not yet code-enforced at the time): a **machine coverage-check**, so every registered file or table is carded, grouped, or excluded, turning the coverage doctrine into a guard.

## External cold-read incorporations (ChatGPT)
Third independent review. It converged with the other two on freshness, bounded non-impact, unknown, and coverage. Three-way agreement confirmed those were real. Folded in:
- **Bounded non-impact** (`rules.md` §4): a bare "does not hit X" is no longer allowed. It has to name the surfaces checked and the revision. Absence within a stated scope is honest. Absence stated as fact is a trap.
- **Freshness pinned to revision, stale is not wrong** (`rules.md` §8): load-bearing claims pin to the source state they were checked against. A changed source makes a claim *stale* (flag for re-check), not silently trusted and not silently regenerated. States kept distinct: verified / stale / unknown.
- **Observation scope per map** (`card-types.md`, catalog template): the catalog states observed vs not-observed surfaces. No map implies completeness beyond what was walked. A "zero" or "no reference" finding holds only within the observed scope.
- **"Before you change this"** (an optional card element): safe / needs-review / never-change-alone. A human-facing field that doubles as the one-card escape hatch for cross-cutting changes.
Deeper v2 ideas (edges-as-first-class, an object/edge/claim/evidence schema, evidence classes, status by activation, a mutation-test "blast-radius" metric, domain packs) are captured in `ROADMAP.md`, not built. ChatGPT itself flagged them as v2, and they would rearchitect the tool rather than sharpen this entry.

## Coverage check built (the last convergent code gap)
Turned the coverage doctrine into a guard. `verify/coverage.mjs <map-dir> <folder-key>` fails loud unless every real file is accounted for (named in a card, claimed by a card's `**Covers:** <glob>`, a registered ghost, or an excluded-with-reason entry). Proven red-then-green on the HFS map: **162 unaccounted scripts before, 0 after** adding `**Covers:** *.ps1` to the scaffolding card (21 named plus 162 grouped is all 183). This closes the completeness gap two of three cold reviews ranked sharpest: a citation-check proves what is *in* the map is real. Coverage proves the map did not omit the object that breaks four "does not hit" claims.

## Fifth shape proven: Obsidian vault (spark #4)
A cold agent mapped a 180-file Obsidian vault (`claude-obsidian`). Both gates clean, all 180 files accounted for (128 named, 27 grouped, 25 excluded-with-reason). It used the `[[wikilink]]` graph as real citeable edges (a 27-inbound-link page flagged a stale-but-load-bearing roadmap), separated a live plugin toolkit from an empty knowledge scaffold, and passed the spark test (a collaborator can add a note without breaking the spine). The tool is now proven on **five shapes:** multi-table base, single big table, n8n folder, third-party code repo, linked vault.
Three real fixes it surfaced:
- **coverage `referenced()`:** a full-path citation (`tests/foo.py`) now counts as referenced (it was forcing a bare-basename re-mention).
- **tag qualifiers:** a card heading may carry a qualifier, like `(live, opt-in)` or `(live, empty scaffold)`. This also gives the "live wiring over empty data" expressiveness the vault needed.
- **path-scoped globs:** `Covers:` and `excluded` globs that contain a `/` now match the relative path, not just the basename (no cross-folder basename collision).
Roadmapped: an opt-in `.md` and wikilink anchor mode for vaults (see `ROADMAP.md`).

## State at close
- Verifier: the shipped map files are clean across three territory shapes (multi-table base, single large table, folder/automation pack). The 9 negative fixtures all fail by name.
- Proven on three source shapes in-repo: `map/` (Render Factory), `map-margin-analysis/` (single table), `map-hfs-sync/` (n8n folder), plus the code repo and the vault run cold.
- Skill installed at `~/.claude/skills/wayfinder-cartographer` and verifies clean from there.
- The method generalised across all of them. The only territory-specific work was teaching the verifier to check folder file-paths, which is done.
