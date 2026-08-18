# Render Variants   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000005`. 98 records at walk time (2026-08-15).
**What it is:** one rendered image of one room, for one exact combination of buyer selections. The output of the factory.
**Shape (the fields that matter, not all of them):** `Render Key` · `Selection Signature` (the drift key) · `Room` (Kitchen / Main Bath / Exterior) · `Generation Mode` · `Status` · `QA Status` · `Required Items` · `Required Packages` · `Source Asset Path` · `Render Image` · `Regeneration Reason` · `Regeneration Queued At`
**Hits:** change a Selection and its `Selection Signature` drifts, so every variant on the old signature is stale and regenerates (`Regeneration Reason` fires). Change a Catalogue Item's spec and every variant built on it is stale.
**Does not hit:** Documents / Document Checks. A render passing or failing QA does nothing to document verification. Same portal, different pipeline.
