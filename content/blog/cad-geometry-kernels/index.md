---
title: "Five CAD Geometry Kernels Compared: What Actually Matters When You Model?"
slug: cad-geometry-kernels-parasolid-acis-cgm-occt-smlib
date: 2026-11-06T00:00:00+08:00
draft: false
cover: cover.webp
images: [cover.webp]
description: "A practical comparison of Parasolid, ACIS, CGM, OCCT, and SMLib, with a repeatable test plan for booleans, fillets, tolerances, and file exchange."
tags: [CAD, Geometry Kernels, B-Rep, FreeCAD]
---

A fillet fails. You reduce the radius, select the edges again, and try a different order. Eventually, the operation succeeds—or the model needs rebuilding. That familiar moment is a useful starting point for understanding a CAD geometry kernel.

The kernel is the layer that calculates and maintains the model's geometry. Yet a failed command does not, by itself, tell you whether the kernel, the application's feature logic, or the input geometry caused the problem.

This article takes its starting point from LearnCAD's video, [Five Engines: A Comparison of CAD Geometry Kernels](https://www.bilibili.com/video/BV1fZ4A65EYV/), covering Parasolid, ACIS, CGM, Open CASCADE, and SMLib. It is an editorial comparison, not a timed five-kernel benchmark. The video’s public description distinguishes community opinions from verified implementation facts. Public subtitles were unavailable during preparation, so this article uses that description and chapter outline alongside the primary sources linked below; it does not reproduce the video's full narration or its eleven comparison dimensions.

## First, separate the solid from its display

A boundary representation, or B-Rep, describes a model through connected topological entities and their supporting geometry. The topology establishes how boundaries connect; curves and surfaces define their shapes. Triangles used for display are a separate representation.

That distinction has a practical consequence: a smooth-looking viewport is not a sufficient check of the underlying solid. Conversely, visible faceting can be a display-quality issue rather than an error in the designed surface. NVIDIA's USD BRep project explicitly separates solid modeling, topology validation, and tessellation into different tools. [Source: USD BRep architecture](https://github.com/NVIDIA-Omniverse/usd-brep).

## What do the five kernels offer?

| Kernel | Documented position | What I would investigate before committing |
| --- | --- | --- |
| **Parasolid** | Siemens' commercial geometric modeling component, supporting solids, surfaces, and additional geometry representations. | Whether the application exposes the operations and exchange workflow my suppliers need. |
| **ACIS** | Spatial's established commercial modeling SDK. | How the actual application handles my imported parts and repeated design revisions. |
| **CGM** | Spatial's modeling technology associated with the Dassault Systèmes ecosystem. | Which capabilities are included in the product or SDK package being evaluated. |
| **Open CASCADE Technology (OCCT)** | An open-source platform with modeling and data-exchange components. | Whether its available operations and development workflow suit my model collection. |
| **SMLib / USD BRep** | NVIDIA's public project includes the SMLib kernel and tools for B-Rep geometry in OpenUSD. | Whether the specific operations, converters, build environment, and validation tools meet my requirements. |

These are product positions, not performance scores. See [Siemens Parasolid](https://www.siemens.com/en-us/products/plm-components/parasolid/), [Spatial's ACIS and CGM overview](https://www.spatial.com/solutions/3d-modeling), [OCCT documentation](https://dev.opencascade.org/doc/overview/html/), and [NVIDIA USD BRep](https://github.com/NVIDIA-Omniverse/usd-brep).

## Commercial maturity is useful—but it is not a benchmark

Siemens and Spatial describe extensive industrial use of their components. That is relevant when evaluating support and integration, but it does not establish that every operation will succeed on every part. [Sources: Siemens](https://www.siemens.com/en-us/products/plm-components/parasolid/) and [Spatial](https://www.spatial.com/solutions/3d-modeling).

I would resist any ranking that gives a kernel a single “robustness” score without publishing the models and failure criteria. A rectangular block with four rounded edges tells us little about an imported housing containing tiny faces and nearly tangent intersections.

The useful question is narrower: does this version, inside this application, complete the operations my work requires, and can I verify the result?

## A test plan that produces useful evidence

The following is a proposed evaluation method, not a report of tests already performed.

| Test | Example | Record more than success or failure |
| --- | --- | --- |
| Boolean operations | Intersecting bores, near-tangent cuts, thin remaining walls | Solid count, volume, validity, unexpected fragments |
| Fillets | Adjacent rounds, tight corners, increasing radius | Largest successful radius, resulting corner shape, validity |
| Shells and offsets | A housing with ribs and changing wall thickness | Open boundaries, self-intersections, remaining thickness |
| Imported geometry | Supplier parts with small gaps or sliver faces | Repairs required, changed geometry, usable downstream features |
| Revisions | Change an upstream dimension and rebuild | Broken references, changed selections, feature failures |
| File exchange | Export, reimport, and compare the result | Units, volume, bounding box, body count, missing surfaces |

Use identical dimensions, units, tolerances, and operation order wherever the applications allow it. Record the kernel and application versions. For timing, separate modeling from import, display meshing, and export, and repeat the operation under comparable conditions.

## File exchange deserves its own evaluation

A successful import is only the beginning. Ask whether the received part is a valid solid, whether dimensions and volume agree, and whether the next manufacturing feature can be created reliably.

NVIDIA's project, for example, documents both OCCT conversion tools and a B-Rep schema for USD. Those capabilities should be tested against the geometry you exchange; the existence of a converter is not evidence of lossless handling of every model. [Source: USD BRep converters and schema](https://github.com/NVIDIA-Omniverse/usd-brep).

For an acceptance check, export a familiar part, reimport it, measure it, and perform a cut and a fillet. Keep the original available for comparison. Treat preserved editable feature history as a separate requirement from preserved solid geometry.

## Which kernel would I choose?

As a CAD user, I would choose the application that survives my revision and supplier-exchange tests with the least repair work. Kernel identity is useful background, but the complete workflow determines the result.

As a developer, I would also evaluate licensing, deployment, diagnostics, documentation, and the ability to reproduce failures. Source access makes investigation possible; commercial support can provide another route to resolving difficult cases. Neither replaces testing.

The strongest comparison ends with reproducible evidence: the input model, the operation, the exact versions, and the resulting geometry. Bring those to the discussion, and “this kernel is better” becomes a claim someone else can actually check.

