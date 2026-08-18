# Fixture: MUST FAIL (folder map cites a file that does not exist)

A folder card citing a filename-shaped file that is not in any registered folder index.

# Deploy scripts  (live)

**Source:** folder hfs-airtable-mapping, `deploy_v9_ghostfile.ps1`
**What it is:** claims a deploy script that is not actually in the folder.
**Hits:** the live workflow.
**Does not hit:** the Airtable schema.
