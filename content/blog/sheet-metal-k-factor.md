---
title: 'Sheet Metal Bend Neutral Factor (K-Factor)'
date: 2026-07-21
description: 'Complete K-factor reference table for sheet metal bending - steel, aluminum, copper, stainless steel.'
tags: ['Sheet Metal', 'NX', 'Reference']
draft: false
---

> Data source: E:\FDM\折弯中性因子\折弯中性因子.xlsx (author: 光軍)
> Applicable to: UG NX bend coefficient table

<!-- TODO: Replace placeholder with actual screenshot uploaded to R2 -->

## What is K-Factor

When sheet metal is bent, the inside is compressed and the outside is stretched. There is a **neutral layer** in between that is neither compressed nor stretched. The position of this neutral layer is expressed as the **K-factor**:

```
K = distance from neutral layer to inner surface / material thickness
```

- **K = 0** → Neutral layer at inner surface (material fully compressed)
- **K = 0.5** → Neutral layer in the middle (ideal case)
- **Higher K** → Neutral layer closer to outer surface, longer flat pattern

---

### Comprehensive Table: R/T vs Material K-Value + K1/K2 General Values

| R/T  | Steel | Aluminum | Copper/Brass | Stainless | K1 (General) | K2  |
| :---: | :---: | :---: | :---: | :---: | :----: | :---: |
| 0.10  |   —   |   —   |   —   |   —   | 0.230  | 0.300 |
| 0.15  |   —   |   —   |   —   |   —   | 0.260  | 0.320 |
| 0.20  | 0.300 | 0.300 | 0.300 | 0.300 | 0.290  | 0.330 |
| 0.25  | 0.300 | 0.300 | 0.300 | 0.300 | 0.310  | 0.350 |
| 0.30  | 0.300 | 0.300 | 0.300 | 0.300 | 0.320  | 0.360 |
| 0.40  | 0.355 | 0.355 | 0.365 | 0.370 | 0.350  | 0.370 |
| 0.50  | 0.370 | 0.370 | 0.375 | 0.380 | 0.370  | 0.380 |
| 0.60  | 0.380 | 0.385 | 0.390 | 0.390 | 0.380  | 0.390 |
| 0.70  | 0.390 | 0.395 | 0.400 | 0.400 | 0.390  | 0.400 |
| 0.80  | 0.400 | 0.405 | 0.408 | 0.408 | 0.400  | 0.408 |
| 0.90  | 0.405 | 0.405 | 0.410 | 0.414 | 0.405  | 0.414 |
| 1.00  | 0.410 | 0.410 | 0.420 | 0.420 | 0.410  | 0.420 |
| 1.10  | 0.420 | 0.422 | 0.424 | 0.425 | 0.420  | 0.425 |
| 1.20  | 0.424 | 0.426 | 0.428 | 0.430 | 0.424  | 0.430 |
| 1.30  | 0.429 | 0.430 | 0.432 | 0.433 | 0.429  | 0.433 |
| 1.40  | 0.433 | 0.433 | 0.436 | 0.436 | 0.433  | 0.436 |
| 1.50  | 0.436 | 0.438 | 0.440 | 0.440 | 0.436  | 0.440 |
| 1.60  | 0.439 | 0.442 | 0.443 | 0.443 | 0.439  | 0.443 |
| 1.70  | 0.440 | 0.442 | 0.445 | 0.446 | 0.440  | 0.446 |
| 1.80  | 0.445 | 0.445 | 0.450 | 0.450 | 0.445  | 0.450 |
| 1.90  | 0.447 | 0.450 | 0.452 | 0.452 | 0.447  | 0.452 |
| 2.00  | 0.449 | 0.452 | 0.455 | 0.455 | 0.449  | 0.455 |
| 2.50  | 0.458 | 0.458 | 0.460 | 0.460 | 0.458  | 0.460 |
| 3.00  | 0.464 | 0.468 | 0.468 | 0.470 | 0.464  | 0.470 |
| 3.50  | 0.468 | 0.468 | 0.470 | 0.473 | 0.468  | 0.473 |
| 3.75  | 0.470 | 0.470 | 0.472 | 0.475 | 0.470  | 0.475 |
| 4.00  | 0.472 | 0.472 | 0.474 | 0.476 | 0.472  | 0.476 |
| 4.50  | 0.474 | 0.474 | 0.478 | 0.478 | 0.474  | 0.478 |
| 5.00  | 0.477 | 0.480 | 0.480 | 0.480 | 0.477  | 0.480 |
| 6.00  | 0.480 | 0.485 | 0.485 | 0.485 | 0.479  | 0.482 |
| 10.00 | 0.490 | 0.500 | 0.500 | 0.500 | 0.488  | 0.490 |
| 15.00 | 0.500 | 0.500 | 0.500 | 0.500 | 0.493  | 0.495 |
| 30.00 |   —   |   —   |   —   |   —   | 0.496  | 0.498 |

> Note: Material-specific values (Steel/Aluminum/Copper/Stainless) are K1 values. For R/T < 0.2 and R/T > 15, use K1 general values.

> **Pattern**: Higher R/T → K closer to 0.5 (neutral layer approaches center). For R/T < 0.3, K ≈ 0.3.

---

### Quick Reference (by r/t ratio)

| #  | Inner R / Thickness (r/t) | K-Value  |
| :-: | :-----------: | :--: |
|  1  |      0.1      | 0.23 |
|  2  |     0.25      | 0.34 |
|  3  |      0.5      | 0.37 |
|  4  |      1.0      | 0.41 |
|  5  |      1.5      | 0.44 |
|  6  |      2.0      | 0.45 |
|  7  |      2.5      | 0.46 |
|  8  |      3.0      | 0.46 |
|  9  |      4.0      | 0.47 |
| 10  |      5.0      | 0.48 |
| 11  |      6.0      | 0.50 |

> This table is for quick lookup; precision is lower than the comprehensive table above.

---

## Usage

### Standard Steps

```
1. Calculate R/T ratio (inner bend radius / material thickness)
2. Find the K-value for your material (from the material column or K1 column)
3. K-value × material thickness = neutral layer offset distance
4. Measure the bend line length after offset in CAD = flat pattern length
```

### Bend Flat Pattern Formula

```
L = L1 + L2 + (π × (R + K × T) × θ) / 180

Where:
  L  = total flat length
  L1 = straight section 1
  L2 = straight section 2
  R  = inner bend radius
  K  = K-factor
  T  = material thickness
  θ  = bend angle (degrees)
```

**Example**: Thickness 1mm, inner R 4mm, bend angle 120°, two straight edges 30mm each

```
Flat length = 30 + 30 + (3.14 × (4 + 0.33 × 1) × 120) / 180
            = 60 + (3.14 × 4.33 × 120) / 180
            = 60 + 9.07
            = 69.07 mm
```

---

## Setting K-Factor in UG NX

In NX Sheet Metal module:

```
File → Utilities → Sheet Metal Preferences
  → Bend Allowance
    → Type: Bend Table or Formula
    → Enter K-factor value
```

You can also create a custom bend coefficient table (.bnd file), import the data above, and auto-match by material.

---

## K-Factor Pattern Summary

| R/T Range | K-Value Range | Description |
|:--------:|:--------:|------|
| < 0.3 | 0.23 ~ 0.30 | Small radius bending, severe material compression |
| 0.3 ~ 2.0 | 0.30 ~ 0.45 | Standard bending range, K increases with R/T |
| 2.0 ~ 5.0 | 0.45 ~ 0.48 | Large radius bending, neutral layer near center |
| > 5.0 | 0.48 ~ 0.50 | Very large radius, neutral layer approximately at center |
