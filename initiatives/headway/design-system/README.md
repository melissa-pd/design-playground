# Starter design evidence

`tokens.json` and `tokens.css` were generated from `https://headway.co/` with `extract-design-system` on September 21, 2026.

The primary patient search URL (`https://care.headway.co/therapists`) returned a Cloudflare verification shell to the extractor: zero colors and only `system-ui`. The marketing-site fallback exposed limited but usable evidence:

- `Honey Regular` as the detected display/body font
- `rgb(53, 53, 53)` as the detected dark neutral
- a 2–64px spacing sample

This is not a complete or authoritative copy of Headway's Helix design system. The prototype keeps these generated files intact and defines its product-specific semantic colors and fallbacks in `app/globals.css`. Those semantic values are an observed brand interpretation for this speculative riff, not extracted tokens.
