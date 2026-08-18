# Commission Stack   (live)

**Source:** table `tblEXAMPLE0000007`.
**What it is:** what 5th Ave gets paid on the deal.
**Shape:** `5th Ave Commission %` (`fldEXAMPLE0000005`, set in 183 of 347 records) × the three net-revenue components → `5th Ave Commission $ House / Extras / Land` (`fldEXAMPLE0000006` / `fldEXAMPLE0000007` / `fldEXAMPLE0000008`) → `5th Ave Total Commission $` (`fldEXAMPLE0000009`) → `Net Commission Payable $` (`fldEXAMPLE0000010` = total + `MLS Commission $` `fldEXAMPLE0000011` − the commission rebate `fldEXAMPLE0000012`).
Evidence notes: `MLS Commission $` is non-zero in 1 of 347 records, and the rebate has never held a non-zero value. `MLS Commission` (`fldEXAMPLE0000013`) is a free-text note; the formula reads the $ field, not the note.
**Hits:** the commission percent moves all three component figures, the total, and the payable. Upstream discounts shrink commission too, since it keys off net revenue, not retail.
**Does not hit:** margin. Commission sits beside the margin chain, not inside it. `Final Projected Margin $` subtracts overhead only, never commission. If commission is meant to come out of margin, that arithmetic happens outside this table.
