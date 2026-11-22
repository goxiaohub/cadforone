---
title: FreeCAD Plugins
toc: false
---

Browse extensions in the official FreeCAD add-on catalog. Search by name, description, or repository owner; filter by repository host and sort by name or owner. The catalog does not supply comparable release dates, stars, or download totals, so those sorts are not offered here.

## How to install a FreeCAD add-on

1. **Choose an add-on below.** Open **Add-on repository** and read its README for supported FreeCAD versions, dependencies, and any extra setup. Note its name.
2. **Open FreeCAD on your computer.** Save your work, then choose **Tools → Addon Manager** from the application menu.
3. **Let the catalog load.** Search for the add-on name inside Addon Manager and select the matching entry. Check the description and compatibility information; choose a compatible branch if the manager offers alternatives.
4. **Install it.** Click the entry's **Install** action (button wording can differ by FreeCAD version). Follow dependency prompts and wait for completion. Check the reported result before closing the manager.
5. **Restart FreeCAD when prompted.** Save any remaining work first. Installed workbenches may not appear until the application restarts.
6. **Open the installed tool.** For a workbench, select its name in the workbench selector. For a macro or preference pack, follow that add-on's README for its entry point and activation steps. Try it in a new document first.

### If installation does not work

- **The name is missing:** clear Addon Manager's search or filters, let its catalog refresh, and check the repository's supported versions. This website is a browsing directory; the available list in your FreeCAD version may differ.
- **Download or dependency error:** read the manager's error details, check connectivity, and follow the author's dependency instructions before trying again.
- **Installed but not visible:** restart, check the workbench selector, and consult the README. Use Addon Manager to manage updates or removal; do not install a second manual copy over the same add-on.

Official references: [FreeCAD installation guidance](https://github.com/FreeCAD/FreeCAD-addons/blob/master/Documentation/Installation/README.md) and [Addon Manager documentation](https://github.com/FreeCAD/FreeCAD-documentation-docusaurus/blob/Stable/src/pages/std-addonMgr.md). Menu labels and available actions can vary by release.

## Browse add-ons

{{< solidcraft-directory freecad >}}

Source: [FreeCAD AddonCatalog on GitHub](https://github.com/FreeCAD/FreeCAD-addons/blob/master/AddonCatalog.json).
