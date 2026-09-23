# Headway search page explorer

A speculative prototype of Headway's couples search page. It is not affiliated with Headway and it does not book visits. Provider cards use the names, photos, and copy from the Figma frame.

The page follows the Figma frame `1440w default`: a Washington couples search with zip, insurance, provider cards, local proof, and a short FAQ. An explorer rail switches viewport and variant.

## Viewports

- Mobile, 390 wide
- Desktop, 1440 wide
- Both, side by side

## Variants

Each variant includes the one before it.

- Sort order: a count line and a sort dropdown above the results
- Filter bar: availability, free consultation, specialty, and approach chips
- Top 3 picks: a ranked "Best matches" row with reasons, above the full list

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
