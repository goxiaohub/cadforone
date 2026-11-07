---
title: "SolidCraft Development Watch: Equal-Length Curve Points, Saved Workspaces, and Render Startup Fixes"
date: 2026-11-07T00:00:00+08:00
draft: false
description: "What recent SolidCraft development merges mean for sketch layout, repeatable workspaces, and software-GPU rendering—and what remains outside the shipped RC."
tags: [SolidCraft, Development, Sketcher]
cover: cover.webp
images: [cover.webp]
---

Imagine placing six stations along a curved flange. Dividing a spline's parameter into equal increments is not necessarily the same as spacing those stations equally along its length. The difference becomes obvious when the control points bunch up or the curve is edited.

SolidCraft's recent **Divide Curve** work tackles that practical layout problem. Alongside it, new workspace-layout controls and a targeted renderer fix make this a useful development snapshot for people doing more than simple extrusions.

**Checked November 7, 2026.** These are merged development changes, not hands-on results from our own build. Treat the test exercises below as suggested checks, not verified performance claims.

## Main branch is ahead of the downloadable RC

The release listing still identifies **0.40.0-rc.2** as a prerelease and **0.30.1** as stable. RC2 saves format 50, which RC1 and 0.30.1 cannot reopen. [Official release notes](https://github.com/tangency-labs/solidcraft/releases/tag/v0.40.0-rc.2).

The PRs below merged after RC2. Their presence on main does not make them available in the RC2 installer. If you build development code, record its commit, work on copies, and inspect that build's compatibility notes rather than assuming RC2's format rules still describe it.

## Divide Curve: station points that track the shape

[PR #9664](https://github.com/tangency-labs/solidcraft/pull/9664) adds Divide Curve to Sketch Create. It places points at equal shares of curve length without cutting the original curve. Open curves receive N−1 interior points; closed curves receive N points. The constraints preserve their proportional positions as the supporting curve changes.

The distinction matters on a curved mounting rail. You can use the points as layout references while keeping the rail's shape editable. Point creation alone does not manufacture holes or guarantee downstream feature references; verify those separately in your model.

There are meaningful limits. This implementation targets 2D sketch curves, not arbitrary 3D model edges. Changing N afterward is not an editable pattern operation. Trimming or breaking the curve loosens the proportional constraints to ordinary point-on-curve constraints. For splines and conics, the PR describes numerical length estimation rather than an assertion of exact symbolic arc length.

Try a spline with unevenly spaced fit points, divide it, and move one fit point substantially. Inspect both whether the points remain on the curve and whether their spacing follows the revised shape. Then trim a copy and check the changed constraint behavior. That second step catches a limitation a simple before-and-after screenshot would miss.

## Workspace layouts: repeat the arrangement, not the setup work

[PR #12587](https://github.com/tangency-labs/solidcraft/pull/12587) adds named panel layouts by workspace, including save, apply, replacement, thumbnails, and recovery behavior. Classic remains the default. The description distinguishes current workspace arrangements from the named-layout library when exporting profiles.

For a repeatable teaching or review session, that distinction is useful. A modeling arrangement may emphasize the feature browser and properties; a rendering arrangement may need different panels. Test switching between them, then cancel a preferences change and check that the previous arrangement returns.

Do not assume a profile export includes the entire layout library or native window geometry. Keep a short record of the panels required for your workflow until you have tested the export-and-import route you intend to use.

One qualification deserves attention: the PR body retains a warning about pending foreground keyboard verification even though GitHub reports it merged. Merge status establishes integration, not that every written validation caveat disappeared. Keyboard navigation and focus behavior remain worthwhile checks.

## Rendering: a narrower fix than “everything is faster”

[PR #12692](https://github.com/tangency-labs/solidcraft/pull/12692) addresses long GPU path-tracing preparation on Mesa lavapipe, a software Vulkan driver. It specializes mapped opaque rendering paths and introduces a preparation window with elapsed time and cancellation. Glass and volume work retain more complex transport code.

The author's isolated probe reports roughly 279 seconds before and 45 seconds after for one mapped-opaque setup; those figures are not an application-wide benchmark. The PR also records unresolved cold-start performance qualification and lengthy glass preparation.

If you encounter this problem, separate preparation from actual rendering. Record the driver, whether rendering is software-backed, material type, and whether the shader cache is cold. A slow first render and a slow sampling phase need different investigations.

## What to test first

| Your work | Start here | Evidence to keep |
| --- | --- | --- |
| Curved sketch layouts | Divide a spline, reshape it, then trim a copy | Point positions and constraint changes |
| Long modeling sessions | Save two arrangements, switch, cancel, reopen | Panel state and keyboard focus behavior |
| Software-GPU rendering | Compare opaque mapped material with glass | Preparation time separately from render time |

The useful direction here is greater control over dependencies: points depend on curve length, panels belong to workspaces, and render preparation becomes visible. That is more actionable than treating every merged PR as another feature already available in the download you installed yesterday.
