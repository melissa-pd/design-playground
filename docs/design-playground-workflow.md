# Design Playground Workflow

This repo is an internal playground for exploring product, UI, and design initiatives that reuse the same agent skills. The recommended setup is one shared repository with repo-level skills, plus one Conductor workspace or branch per initiative.

Do not use Git submodules for normal initiatives in this repo. Submodules are only worth it when an initiative must live as a separate repository with its own independent history, permissions, release lifecycle, or deployment ownership.

## Recommended Structure

Keep shared skills at the repo root:

```text
.agents/
  skills/
.claude/
  skills/
initiatives/
  onboarding-flow/
  homepage-concept/
  pricing-experiment/
AGENTS.md
README.md
```

Use `initiatives/<initiative-name>/` for experiments. Keep each initiative self-contained unless it intentionally shares components, assets, or research with another initiative.

## Create A New Initiative In Conductor

1. Open **Conductor**.
2. In the left sidebar, select **Design Playground**.
3. Press `Cmd + Shift + N`, or click the `...` menu next to **New workspace**.
4. Choose a new task or workspace.
5. Name the branch after the initiative, for example:

   ```text
   initiative-onboarding-flow
   ```

6. Start the workspace.
7. Open a Codex or Claude Code chat inside that workspace.
8. Tell the agent where the initiative should live:

   ```text
   Create this initiative under initiatives/onboarding-flow. Use the shared repo skills in .agents/skills.
   ```

Conductor creates a separate branch and working tree for the workspace, so the initiative can move independently without creating a separate GitHub repository.

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

## Conductor Settings To Check

Use these settings only if the repo needs repeatable setup or run commands.

1. Open **Conductor**.
2. Select **Design Playground** in the sidebar.
3. Open **Settings**.
4. Select the **Design Playground** project or repository settings.
5. Look for **Setup script**, **Run scripts**, and **Files to copy**.

Use **Files to copy** for static ignored files such as `.env.local`, local config, or certificates.

Use a **Setup script** for commands that prepare every new workspace, such as dependency installs or generated files.

Example shared settings file:

```toml
"$schema" = "https://conductor.build/schemas/settings.repo.schema.json"

[scripts]
setup = "pnpm install"
run_mode = "concurrent"

[scripts.run.dev]
available_in = [ "local" ]
command = "pnpm dev --port $CONDUCTOR_PORT"
default = true
icon = "play"
```

Only add this file if the repo has a real setup or run command. For pure design docs, mockups, and experiments, it is fine to leave Conductor scripts empty.

## When To Use Each Option

Use a **new initiative folder** when the work is part of the shared playground and should reuse the same skills.

Use a **new Conductor workspace** when an initiative or task should have its own branch, agent chat, diff, and review path.

Use **multiple chats in one workspace** when agents need to collaborate on the same current branch and file state.

Use **user-level skills** at `~/.agents/skills/` when the same skills should be available across all repositories on the machine.

Use a **plugin** when skills need to be distributed as an installable package to other people or bundled with connectors.

Use **Git submodules** only when the initiative truly needs to remain a separate repository while still appearing inside this repo.

## Useful References

- Conductor workspaces: https://www.conductor.build/docs/concepts/workspaces-and-branches
- Conductor first workspace: https://www.conductor.build/docs/first-workspace
- Conductor scripts: https://www.conductor.build/docs/reference/scripts
- Codex skills: https://learn.chatgpt.com/docs/build-skills
- Codex `AGENTS.md`: https://learn.chatgpt.com/docs/agent-configuration/agents-md
