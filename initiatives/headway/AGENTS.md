# Headway Search Results Riff

This initiative is a speculative, code-first prototype for a Headway job application.

## Product intent

- Treat search as a decision surface, not a provider directory.
- Help patients understand why a provider matches, what is available next, and what action to take.
- Cover ranked cards, conversion-oriented filters and sort, match explanations, and full, sparse, and empty result states.
- Build a distinct point of view rather than a pixel clone.

## Source boundaries

- Public references: `https://headway.co/`, `https://care.headway.co/therapists`, and Headway's Senior Product Designer, Search Results role.
- Use mock therapist data only. Do not scrape or reuse real provider names, photos, or profile copy.
- Extracted tokens are starter evidence from public pages, not a complete or authoritative Headway design system.
- If extraction is blocked, label manually observed brand values as observed rather than extracted.

## Technical direction

- Keep this Next.js app self-contained inside `initiatives/headway/`.
- Import starter tokens from `design-system/tokens.css`; keep riff-specific semantic variables in app CSS.
- No backend, authentication, booking flow, provider profile, or real Headway API.
- Verify the working experience on desktop and mobile, including keyboard operation.
- Deploy a Vercel preview as the sendable artifact; do not deploy to production.
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
