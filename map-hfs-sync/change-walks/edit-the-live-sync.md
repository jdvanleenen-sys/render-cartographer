# Change walk — edit the live sync safely

The trap this pack sets for every newcomer: "I'll open the workflow file and change it." There is no live workflow file. Here is the safe path.

1. **Confirm what runs.** The live workflow is n8n cloud `6j8NPHZc9CFwQ5KP` (cards/live-workflow.md). The id is pinned in `hfs_sync_v2_workflow_id.txt`. It is the 9-node v3 shape.
2. **Read the current shape from the right place.** Use `HFS_AIRTABLE_MAPPING.md` (current) and `patch_v3_upsert.ps1` (the last structural PUT), not `hfs_sync_v2_workflow.json` (a pre-v3 snapshot) and not `MASTER_MAPPING.md` (calls v2 "current").
3. **Make the change in the workflow, not a file.** Edit in the n8n UI, or fetch-modify-PUT via a script modeled on `patch_v3_upsert.ps1`. Retrieve credentials from the n8n store (ids `[sql-cred-id]`, `[airtable-cred-id]`), not from any hardcoded literal (cards/ghost_hardcoded-secrets.md).
4. **Never run `deploy_v2.ps1` to "redeploy."** It pushes `hfs_sync_v2_workflow.json` and would revert the live workflow from v3 back to v2 (create-not-upsert, plus the removed dedup nodes).
5. **Sync the doc.** After the change, update `HFS_AIRTABLE_MAPPING.md`.

**Does not hit:** the ~165 diagnostic scripts and the `wf_*.json` exports — none are wired to the live workflow, so leaving them untouched changes nothing.
