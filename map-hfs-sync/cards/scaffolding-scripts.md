# Build & diagnostic scripts (leftover)

**Source:** ~165 `.ps1` files in the folder root, plus the pointer files `created_cred_ids.txt`, `sql_cred_id.txt`. Dates span 2026-03-14 to 2026-04-10.
**Tag:** leftover.
**Covers:** *.ps1
**What it is:** the build-time and diagnostic scaffolding used to design, deploy, verify, and repair the sync. They ran during the build; they are not part of the scheduled pipeline. Do not read them individually to understand the sync — the live-spine cards already carry the running behaviour. They are grouped here by prefix so you can find the right one if you need to re-run a probe.
**Shape (the families, by prefix and count):**
- `check_*` (35), `find_*` (12), `inspect_*` (6), `trace_*` (3), `compare_*` (3), `audit_*` (6), `dryrun_*` (4), `investigate_*`/`debug_*` — read-only probes against HFS or Airtable to answer a one-off question (e.g. `check_scullion*`, `trace_bettencourt`).
- `get_*` (20), `explore_*` (4), `query_*` (5), `sample_*` — schema and data fetchers (e.g. `get_buildpro_schema`, `explore_hfs_jobs_schema`).
- `patch_v2_*` / `patch_v3_upsert` / `deploy_*` / `redeploy_*` / `update_wf_*` — the workflow-mutation scripts (the live-relevant ones are carded separately under cards/deploy-and-patch.md).
- `backfill_*` (3), `dedup_*` (6), `fix_*` (5), `classify_*` (2), `convert_*`, `patch_remove_*` — one-off DATA repairs already applied to Airtable (e.g. buyer/customer-no backfills, duplicate-contract dedup). These mutate records; they are spent, not scheduled.
- `verify_*` (7), `test_*` (4) — post-change validation checks.
**Hits:** the mutation scripts (deploy/patch/backfill/dedup/fix) write to the live workflow or live Airtable records if re-run; treat them as loaded weapons, not documentation. The read-only probes hit nothing.
**Does not hit:** the scheduled sync. None of these are wired into workflow `6j8NPHZc9CFwQ5KP`; nothing runs them automatically. Understanding the sync does not require opening any of them.
