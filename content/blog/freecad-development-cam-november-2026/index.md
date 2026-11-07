---
title: "FreeCAD Development Watch: Counterbores, Adaptive Clearing, and the CAM Changes Worth Testing"
date: 2026-11-07T00:00:00+08:00
draft: false
description: "Recent FreeCAD CAM merges explained through practical machining checks: stepped holes, rest machining, and updated Profile and PocketShape panels."
tags: [FreeCAD, Development, CAM]
cover: cover.webp
images: [cover.webp]
---

A counterbore is a useful test of CAM software because two circular features share a center but do different jobs. The larger recess seats a fastener; the smaller bore continues below it. Confuse those two diameters and a plausible-looking toolpath can still machine the wrong feature.

That is why FreeCAD's recent development activity deserves more attention than another feature checklist. Several CAM changes merged around November 6–7 address the connection between selected geometry, machining depth, and the controls used to define an operation.

**Checked November 7, 2026.** This article reports upstream development and proposes validation tasks. It is not a machining test or a claim that the current release candidate contains every change below.

## Know which build you are evaluating

The official release listing currently includes **26.3 RC2** and a **November 4 weekly development build**. Weekly builds are explicitly intended for testing rather than production. The RC2 announcement asks users to verify fixes and report regressions against 1.1. [Official releases](https://github.com/FreeCAD/FreeCAD/releases).

The CAM PRs discussed here merged after that November 4 weekly snapshot. Do not download that weekly and expect these later changes to be present. Check the build's commit and relevant branch; a merge into main is not proof of inclusion in the 26.3 release branch.

## Helix: keep the recess and the bore separate

[PR #34027](https://github.com/FreeCAD/FreeCAD/pull/34027), merged November 6 UTC, fixes Helix handling of counterbored holes. The description explains that concentric features could previously be treated as one hole, losing the smaller bore. The revised operation retains both steps and their respective floors.

The useful verification is a stepped-hole model, not a plain cylinder. Create a 20 mm recess over a 10 mm through bore in a plate, then inspect the operation at each depth. Those dimensions are an editorial test example, not an upstream benchmark.

Check three things: the upper operation follows the recess diameter, the lower operation follows the bore diameter, and the transition occurs at the modeled shoulder. Then change only the recess depth and regenerate. A convincing top view is insufficient; inspect the side view and simulated remaining stock too.

Before machining, validate the posted program using your normal machine-specific process. A geometry-handling fix does not independently validate the tool, feeds, clearance, work offset, or postprocessor.

## Adaptive: the interesting part is rest machining

[PR #33739](https://github.com/FreeCAD/FreeCAD/pull/33739) migrates Adaptive from Clipper 1 to Clipper 2 and removes the former library's remaining use. Its description also identifies corrections involving arc-containing cleared paths and the depth used when checking previous paths. The author separated those fixes into another PR for potential backporting; that intention should not be mistaken for confirmed release inclusion.

For a user, the library name matters less than whether a second operation understands what the first tool actually removed.

Try a pocket with internal corners and two tools. Save the first tool's result, generate a smaller-tool rest operation, and inspect the corners and depth transitions. Repeat at a second depth. Compare the remaining material, unexpected recutting, and any newly missed regions. Keep the tool definitions and operation settings identical between builds so the comparison has meaning.

Do not infer a general speed gain from a library migration. This PR is evidence of implementation work; a performance conclusion requires comparable jobs and timings.

## Profile and PocketShape: review saved workflows

[PR #33100](https://github.com/FreeCAD/FreeCAD/pull/33100) updates the Profile and PocketShape task panels and property descriptions. Its change list also says ramps were removed, with a separate implementation proposed for follow-up.

That makes existing procedures worth checking. Reopen a copied job, inspect its properties, regenerate, and compare the result with the original setup. If a tutorial or shop procedure refers to an old panel control, establish its current behavior before updating the instructions. Do not assume a renamed or reorganized panel guarantees identical operation semantics.

## A useful development report fits on one page

| Include | Why it helps |
| --- | --- |
| Application version, commit, OS, and workbench | Identifies the actual code being tested |
| Small model plus tool and operation settings | Makes the geometry problem reproducible |
| Expected diameter and depth versus observed result | Gives a concrete acceptance condition |
| Last known working build | Separates a regression from an older limitation |
| Screenshot and saved project | Preserves both visible evidence and editable inputs |

For this development cycle, I would prioritize the stepped-hole and two-tool pocket tests over an elaborate demonstration part. Each isolates a specific failure mode and produces evidence that another user can check.

These changes are promising because they address machining intent rather than presentation alone. Their practical value will be established by the jobs they regenerate correctly—and by the edge cases testers can still reproduce.
