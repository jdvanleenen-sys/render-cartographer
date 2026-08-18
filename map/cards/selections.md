# Selections   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000006`.
**What it is:** one home's chosen options (siding, trim, appliances, packages). The input the factory renders.
**Shape:** `Selection Key` · `Project` · per-category links (`Appliance Package`, `Style Package`, `Lighting Package`, `Plumbing Selections`, `Millwork Selections`) · `Selection Signature` · `Portal Status` · `Signed At` · `Version`
**Hits:** editing any chosen option changes `Selection Signature`, which strands every Render Variant on the old signature. Bumping `Version` after signing triggers a regeneration pass.
**Does not hit:** pricing / Margin Analysis. Selections drive renders, not deal economics; those live outside the slice.
