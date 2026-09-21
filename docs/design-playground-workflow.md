# Design Playground Workflow

This repo is an internal playground for exploring product, UI, and design initiatives that reuse the same agent skills. The recommended setup is one shared repository with repo-level skills, plus one Cursor branch and chat per initiative.

Do not use Git submodules for normal initiatives in this repo. Submodules are only worth it when an initiative must live as a separate repository with its own independent history, permissions, release lifecycle, or deployment ownership.

## Recommended Structure

Keep shared skills at the repo root:

```text
.agents/
  skills/
.claude/
  skills/
.cursor/
  mcp.json
.mcp.json
initiatives/
  onboarding-flow/
  homepage-concept/
  pricing-experiment/
AGENTS.md
README.md
```

Use `initiatives/<initiative-name>/` for experiments. Keep each initiative self-contained unless it intentionally shares components, assets, or research with another initiative.

## Create A New Initiative In Cursor

1. Open **Design Playground** in Cursor.
2. Create a branch named after the initiative, for example:

   ```text
   cursor/onboarding-flow
   ```

3. Start a new Cursor chat on that branch.
4. Tell the agent where the initiative should live:

   ```text
   Create this initiative under initiatives/onboarding-flow. Use the shared repo skills in .agents/skills.
   ```

Use Cursor Cloud Agents when the work should run remotely or in parallel. Keep each initiative on its own branch so it has an independent diff and review path without requiring a separate GitHub repository.

## Configure Shared Project Guidance

Use a root `AGENTS.md` for project-wide instructions that should apply to every initiative. Recommended starter content:

```md
# Design Playground

This repo is for internal design experiments and initiative exploration.

## Structure

- Put each initiative under `initiatives/<initiative-name>/`.
- Reuse repo-level skills from `.agents/skills/`.
- Keep experiments self-contained unless asked otherwise.
- Do not use Git submodules for initiatives.
- Do not assume work is client-facing.
```

Add initiative-specific guidance only when needed:

```text
initiatives/
  onboarding-flow/
    AGENTS.md
```

Use nested `AGENTS.md` files for local rules such as design direction, framework constraints, target audience, or testing expectations for that initiative.

## Cursor Environment Setup

Only add shared environment configuration when the repo has repeatable setup or run commands. Keep initiative-specific commands in that initiative's `README.md` or nested `AGENTS.md`.

Use `.cursor/environment.json` when Cursor Cloud Agents need predictable dependencies, services, or setup commands. Keep static ignored files such as `.env.local`, local config, or certificates out of Git and document how contributors should provide them.

Pure design docs, mockups, and experiments do not need an environment file.

## When To Use Each Option

Use a **new initiative folder** when the work is part of the shared playground and should reuse the same skills.

Use a **new Cursor branch and chat** when an initiative or task should have its own context, diff, and review path.

Use **multiple chats on one branch** when agents need to collaborate on the same current file state.

Use **user-level skills** at `~/.agents/skills/` when the same skills should be available across all repositories on the machine.

Use a **plugin** when skills need to be distributed as an installable package to other people or bundled with connectors.

Use **Git submodules** only when the initiative truly needs to remain a separate repository while still appearing inside this repo.

## Useful References

- Cursor Cloud Agents: https://docs.cursor.com/cloud-agent
- Cursor rules and `AGENTS.md`: https://docs.cursor.com/context/rules
- Cursor project MCP: https://docs.cursor.com/context/model-context-protocol
