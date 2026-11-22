---
title: SolidCraft Plugins
toc: false
---

Find community tools for modeling, fabrication, and workflow automation. This directory is independent of Tangency Labs. Each plugin belongs to its author.

## How to install a SolidCraft plugin

1. **Choose a plugin below.** Open its repository and read the supported versions and setup requirements.
2. **Download the installable release ZIP.** Use **Download ZIP** on the card, or open the repository's **Releases** page and find its plugin ZIP under **Assets**. GitHub's automatic **Source code (zip)** is not necessarily an installable package. Keep the plugin ZIP intact.
3. **Open SolidCraft.** Save your design. Open **Preferences → Plugins → Install plugin…**. Some versions also offer **Install plugin…** directly in the **Plugins** menu.
4. **Select the downloaded ZIP.** In the file chooser, open your Downloads folder, select the plugin package, and open it.
5. **Review the confirmation.** Check the plugin identity and requested permissions. If folders are requested, choose the intended locations; confirm installation when ready.
6. **Run the plugin.** Find its entry in **Plugins**; it may also appear in a ribbon tab. Complete its inputs and test in a new design. An importer adds its supported format to **File → Open**.

### If installation does not work

Check that the ZIP is a packaged release for your SolidCraft version. Share the exact error and version with the author through the repository's issue tracker; the installation dialog's error is more useful than a screenshot of this directory.

Official reference: [SolidCraft plugin installation guide](https://docs.solidcraft.io/dev/plugins.html#step-8-install-it).

## Browse plugins

{{< solidcraft-directory >}}

Directory data comes from [Tharje's community index on GitHub](https://github.com/tharje/solidcraft-plugins). To submit a plugin, add the `solidcraft-plugin` topic and attach the installable ZIP to a GitHub release.
