# Design Playground

This repo is for internal design experiments and initiative exploration. Work here is not client-facing unless the user explicitly says otherwise.

## Repository Structure

- Put each initiative under `initiatives/<initiative-name>/`.
- Keep experiments self-contained unless the user asks to share components, assets, or research across initiatives.
- Reuse repo-level skills from `.agents/skills/`.
- Do not use Git submodules for initiatives.
- Use a separate GitHub repository only when an initiative needs independent history, permissions, deployment ownership, or release lifecycle.

## Cursor Workflow

- Use a new Cursor branch and chat when an initiative or task should have its own diff, context, and review path.
- Use multiple chats on one branch only when agents need the same current file state.
- Keep non-committed collaboration notes in `.context/`.
- Do not rename the current branch unless the user explicitly requests it.

## Initiative Guidance

- Add an `AGENTS.md` inside an initiative folder only when that initiative needs local rules.
- Keep nested guidance focused on product intent, design direction, framework constraints, testing expectations, or known tradeoffs for that initiative.
- Prefer durable repo guidance in this file over repeating the same setup instructions in every prompt.

## Skills

- Treat `.agents/skills/` as the source of shared reusable workflows for this repo.
- Keep `.claude/skills/` symlinks aligned with `.agents/skills/` when adding or renaming skills.
- If skills should apply across all repositories on this machine, use `~/.agents/skills/` instead of copying them into every project.
- If skills need to be distributed to other people as an installable package, use a plugin instead of Git submodules.

## Extract Design System

When extracting design tokens from a public website, prefer the project MCP server `extract-design-system` if it is connected:

- `extract_design_system` — fetch a public URL and write starter token files
- `init_design_system` — regenerate token files from the last cached extraction
- `get_tokens` — read `design-system/tokens.json` without re-fetching
- `audit_design_system` — scan source files for hardcoded values that already have tokens

If MCP is not connected, follow `.agents/skills/extract-design-system` and run `npx extract-design-system`. Ask before applying extracted tokens to existing app styles or config.
