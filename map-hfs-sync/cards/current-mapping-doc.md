# Current mapping doc (live)

**Source:** `HFS_AIRTABLE_MAPPING.md` (2026-04-07/09) and its rendered twin `HFS_AIRTABLE_MAPPING.html`.
**Tag:** live.
**What it is:** the one document that describes the workflow as it actually runs. It states the v3 workflow (`6j8NPHZc9CFwQ5KP`, 9 nodes), the exact SELECT, the intermediate-to-Airtable column map, and — importantly — the list of columns the sync deliberately does NOT write.
**Shape:**
- Stage 1-5 walkthrough matching the live nodes.
- The HFS-column -> intermediate -> Airtable-column table (the reference a change starts from).
- "What is NOT synced (and why)" and "Known data issues" (e.g. ~45 orphan contracts, ~119 pre-HFS buyers without an HFS Customer No) — dated 2026-04-07, so treat counts as of that date.
- Header says "v3, 9 nodes"; this is the tell that separates it from the older docs.
**Hits:** this doc is the human contract for the sync — when you change the live workflow, this is the file to update so it and the workflow stay in agreement. A reader onboarding to the sync should start here after the catalog.
**Does not hit:** the running system. It is documentation; editing it changes nobody's behaviour until someone acts on it. If this doc and the live workflow ever disagree, the workflow wins and the doc is stale (the same rule that already retired the two prior-era docs).
