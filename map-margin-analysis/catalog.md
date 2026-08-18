# 🏗️ Margin Analysis catalog (front door)

Start here. Open ONE card, then stop. You never load this whole folder. The later reader may be a cold model with no memory of this base. This map assumes exactly that.

The territory: table `tblEXAMPLE0000007` (🏗️ Margin Analysis) in base `appEXAMPLE0000001`. 347 records at walk time (2026-08-15). One record is one margin snapshot of one build project at one deal stage (Base, Acceptance, Lockdown, Closing). The table is a spreadsheet folded into Airtable: about 110 fields, most of them formula plumbing between five blocks. The cards carve it at the blocks.

**The spine**
- Margin Snapshot (the record and its version spine) -> cards/margin-snapshot.md. What a row is, the stages, the active flag.
- Links (Project / Contract / Model / Community) -> cards/links.md. Identity, fallback inputs, and the contract revenue check.

**The money blocks**
- Cost stack -> cards/cost-stack.md. **Warning: TWO parallel cost bases live in this table.** This card sorts out which margin reads which.
- Revenue stack -> cards/revenue-stack.md. Retail down to net revenue, GST, grand total.
- Margin stack -> cards/margin-stack.md. Soft costs, overhead, Final Projected Margin, the traffic-light alert.
- Commission stack -> cards/commission-stack.md. What 5th Ave gets paid.

**Before you edit: ghosts**
- The AI summary panel (attachments and two AI fields, all dead) -> cards/ghost_ai-summary-panel.md
- Monthly Projections link (empty in every record) -> cards/ghost_monthly-projections-link.md
- Version Created Date (empty in every record) -> cards/ghost_version-created-date.md
- Total Mark Up $ (unwired manual box) -> cards/ghost_total-mark-up-dollar.md
- Sales Giveaways, the roll-up that isn't -> cards/ghost_sales-giveaways-rollup.md

**Before you edit: naming tripwires**
- "House Costs" (manual input) is not "House Cost" (computed from sq ft). "Total Costs" is not "Total Construction Costs". Two near-identical gross-margin fields exist with different formulas on different cost bases. All sorted out in cards/cost-stack.md.
- The stage-order formula still names a "Prelim" stage that no longer exists as a Status choice (cards/margin-snapshot.md).

**Wrong neighbour**
The other ~50 tables of this base (the Homeowner Portal and Render Factory tables, the several "Tasks" and "Deposits" tables) are not this territory. Editing them changes no margin number. The 🏗️ Contract table is an upstream input read through one lookup (cards/links.md). This map does not map the Contract table itself.

**Change walks**
- Head office bumps a model's cost per sq ft -> change-walks/model-cost-bump.md
