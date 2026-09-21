# Outputs

## `.extract-design-system/raw.json`

Raw extraction output from `dembrandt`. Keep this for debugging and future schema upgrades.

## `.extract-design-system/normalized.json`

Stable internal representation used to generate downstream files. Run the
repository normalizer after the upstream CLI so object-shaped CSS variables,
palette entries, typography styles, radii, and shadows are retained.

## `design-system/tokens.json`

Copy of the normalized output for project-local inspection and reuse.

## `design-system/tokens.css`

Starter CSS variables file with extracted colors, fonts, spacing, radius, and shadows when available.

## Normalization regression check

Run:

```bash
node --test .agents/skills/extract-design-system/scripts/normalize-extraction.test.mjs
```

The test guards the Dembrandt shapes observed on Headway: CSS variables with
`{ value, lch, oklch }`, palette objects, context-aware font selection, radius
objects, and shadow objects.
