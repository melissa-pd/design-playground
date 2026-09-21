# Starter design evidence

`tokens.json` and `tokens.css` were generated from `https://headway.co/` with `extract-design-system` on September 21, 2026.

The primary patient search URL (`https://care.headway.co/therapists`) returned a Cloudflare verification shell to the extractor: zero colors and only `system-ui`. The marketing-site fallback loaded Headway's bundled Helix CSS and exposed:

- 121 `--hlx-color-*` variables plus a six-color rendered palette sample
- 28 typography observations using Honey Regular and PostGrotesk
- 20 spacing values, seven radius values, and two shadow recipes

The upstream normalizer expected strings where Dembrandt returns objects such
as `{ value, lch, oklch }`. The repository post-normalizer preserves those
structured values when generating these files.

This is still not a complete or authoritative copy of Headway's Helix design
system: it represents CSS loaded by one public marketing page, not the entire
patient product. The prototype keeps these generated files intact and defines
riff-specific semantic values in `app/globals.css`.
