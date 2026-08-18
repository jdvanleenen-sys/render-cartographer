# Catalogue Items   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000001`. Categories `tblEXAMPLE0000002` and Packages `tblEXAMPLE0000003` group them.
**What it is:** one product a buyer can pick (an appliance, a finish, a fixture). Items group into Categories and bundle into Packages.
**Shape:** `Item Name` · `Category` · `Tier` · `Price` · `Homeowner Portal Selections` (the live link to where it is used)
**Hits:** change an item's spec and every Render Variant built on it is stale. Retire an item and the Selections that reference it need a replacement.
**Does not hit:** Margin Analysis / deal pricing. `Price` here is the menu price, not the negotiated deal.
