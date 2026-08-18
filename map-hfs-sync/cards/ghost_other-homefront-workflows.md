# Other HomeFront workflows (ghost)

**Source:** `wf_cdqt2TIh0MqWkJ8I.json` (72 KB) and `wf_hAS9mIvFppbDTXma.json` (40 KB), full n8n exports dumped by `inspect_hfs_workflows.ps1`, named after their workflow ids.
**Tag:** ghost.
**Evidence it is dead (for this sync):** neither is the live sync. `wf_cdqt2TIh0MqWkJ8I.json` is a workflow named "HomeFront Contact API -> Airtable Sync (Scheduled)" built on webhook + set + filter nodes; `wf_hAS9mIvFppbDTXma.json` is "HomeFront Sales -> Airtable Sync (Webhook)", a respondToWebhook design. Both are webhook-driven and contain no Microsoft SQL node, the opposite architecture from the live SQL-poll sync `6j8NPHZc9CFwQ5KP`. They are captured exports sitting in the folder, wired to nothing here.
**What a reader will mistake it for:** the running sync. Their names ("HomeFront ... Airtable Sync") and their size make them look like the main workflow. A reader who edits or deploys one of these is working on a different, webhook-based pipeline and will not change the daily SQL sync at all. If you need the live workflow, it is `6j8NPHZc9CFwQ5KP` (see cards/live-workflow.md), which is not saved as a `wf_*.json` file.
