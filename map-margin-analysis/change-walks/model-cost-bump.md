# Change walk — head office bumps a model's cost per sq ft

1. Someone raises the estimated construction cost per sq ft on a Model record (📍 Models, `tblEXAMPLE0000011`).
2. Every Margin Analysis snapshot linked to that model reads the new number through the lookup (`fldEXAMPLE0000100`) — except rows where the cost-per-sq-ft override (`fldEXAMPLE0000101`) is typed. 8 of 347 records carry that override; those rows do not move.
3. On the moving rows the chain is: Smart cost per sq ft (`fldEXAMPLE0000020`) → `House Cost` → `Total Construction Costs` → the plain `Gross Margin $` and `Gross Margin %` (cards/cost-stack.md, base B).
4. It stops there. Not hit: the hand-typed cost base (base A), so Gross Margin $ (Pre Soft Costs), the post-soft-costs chain, `Final Projected Margin $`, the alert, and every commission figure all stand still. If you expected the headline margin to move, you bumped the wrong base — that one is typed by hand on each snapshot (cards/cost-stack.md).
