# Home Photography Assets   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000004`.
**What it is:** the library of real photos a render is built and checked against (marketing and reference shots keyed to a room and a look). Also the attach point for the planned construction-stage photos.
**Shape:** `Asset Key` · `Collection` · `Room Tags` · `View / Angle` · `Validation Status` · `Usage Status` · `Capture Date` · `Project` · `Model` · `Style Package`
**Hits:** swapping a room's reference photo changes what a regenerated variant is composed against; `Validation Status` gates whether a photo is allowed into a render. Anything filtering this table on `Usage Status` sees what you add.
**Does not hit:** `Selection Signature`. Adding or editing a photo does not restate what a buyer chose, so it does not by itself strand a variant.
