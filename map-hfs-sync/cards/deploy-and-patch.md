# Deploy & patch scripts (live)

**Source:** `patch_v3_upsert.ps1` (2026-04-08, the newest structural change), plus `deploy_v2.ps1`, `redeploy_v2.ps1`, `update_wf_sql_cred.ps1`, `update_wf_new_cred.ps1`. All PUT to `https://[n8n-instance]/api/v1/workflows/6j8NPHZc9CFwQ5KP`.
**Tag:** live.
**What it is:** the only correct mechanism for changing the live workflow. Because the running workflow lives in n8n cloud, you do not edit a file and "save". You either edit in the n8n UI or run one of these scripts to fetch-modify-PUT the workflow by id.
**Shape:**
- `patch_v3_upsert.ps1` is the canonical example: GETs the live workflow, mutates nodes (remove/rename/add), rebuilds connections, PUTs. This is what turned v2 into v3.
- `deploy_v2.ps1` / `redeploy_v2.ps1` push a full workflow body. Note `deploy_v2.ps1` pushes the now-stale `hfs_sync_v2_workflow.json`, so running it today would REVERT the live workflow from v3 back to v2.
- The `patch_v2_*.ps1` family (Build filter, typecast, buyer link, etc.) are the incremental edits that built v2; historical, not the current shape.
**Hits:** running any deploy/patch script rewrites the live workflow `6j8NPHZc9CFwQ5KP` immediately. There is no staging. `deploy_v2.ps1` in particular un-does the v3 upsert change. Editing credentials scripts repoints the live SQL/Airtable connections.
**Does not hit:** HFS or Airtable data directly. These scripts change the workflow definition, not records; data only moves when the workflow next runs. They also do not update the docs. After a structural change you must hand-edit `HFS_AIRTABLE_MAPPING.md` (see cards/current-mapping-doc.md).
