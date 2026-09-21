# Headway search page explorer

This initiative is a speculative prototype of Headway's couples search page, built for a product design application.

## Product intent

- Show the couples search page from the Figma reference: hero, cost estimate, provider cards, local proof, FAQ, and footer.
- Compare that page at mobile and desktop widths, including both at once.
- Explore three variants of the same page: baseline directory, match reasons on the card, and a short ranked list.
- Provider cards use the names, photos, and profile copy from the Figma frame. Do not invent stand-in therapists.

## Source boundaries

- Visual reference: the `1440w default` frame in the Headway Exploration Figma file.
- Public references: `https://headway.co/` and Headway's Senior Product Designer, Search Results role.
- Extracted tokens are starter evidence from one public marketing page, not a complete Helix system.

## Technical direction

- Keep this Next.js app self-contained inside `initiatives/headway/`.
- Import starter tokens from `design-system/tokens.css`.
- Viewport and variant live in the URL.
- No backend, authentication, booking flow, provider profile, or real Headway API.
- Verify Mobile, Desktop, Both, and each variant, including keyboard operation.
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
