# design-playground
A sandbox for exploring product and UI design ideas, from concept work, interface explorations, component experiments, to half-formed thinking that isn't tied to a client deliverable. I use this space to brainstorm, iterate, and experiment design ideas.

For the recommended Cursor workflow, initiative structure, and guidance on why this repo should use shared skills instead of Git submodules, see [Design Playground Workflow](docs/design-playground-workflow.md).

## Agent skills

Eighteen skills live in `.agents/skills/`. Claude Code only discovers project skills under `.claude/skills/`, so that directory holds a symlink to each one. Both directories are committed — clone the repo and every skill works, no setup and no global install required.

**Design** — `ui-ux-pro-max`, `bencium-controlled-ux-designer`, `bencium-innovative-ux-designer`, `web-design-guidelines`, `extract-design-system`

**Accessibility** — `accessibility-audit`, `accessibility-scan`, `accessibility-inspect`, `accessibility-fix`, `accessibility-diff`

**Frontend** — `composition-patterns`, `react-best-practices`, `react-native-skills`, `vercel-react-view-transitions`

**Deploy & docs** — `deploy-to-vercel`, `vercel-cli-with-tokens`, `vercel-optimize`, `writing-guidelines`

`.agents/skills/shared/` is not a skill — it holds `methodology.md`, which the five accessibility skills reference as `../shared/methodology.md`. It is symlinked into `.claude/skills/` too so that path resolves either way. Leave it where it is.

Some are linked under a shorter name than their install directory (`composition-patterns` → `vercel-composition-patterns`, and likewise for `react-best-practices` and `react-native-skills`). That is deliberate: those names match the copies commonly found in `~/.claude/skills/`, so the repo's copy shadows the personal one instead of appearing as a second, identical entry. Keep the names in sync if you add more.

To add a skill:

```sh
npx skills add <source>                                  # installs into .agents/skills/
ln -s ../../.agents/skills/<name> .claude/skills/<name>  # makes Claude Code find it
```

### Sources

The nine Vercel skills plus [`extract-design-system`](https://github.com/arvindrk/extract-design-system) are managed by the `skills` CLI and pinned in `skills-lock.json`. The other eight were vendored by hand, all MIT:

| Skill | Source | Commit |
| --- | --- | --- |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `a38d04c` |
| `bencium-*-ux-designer` | [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) | `bda4647` |
| `accessibility-*`, `shared/` | [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace) | `3b75901` |

The bencium and accesslint repos declare MIT in their README rather than shipping a `LICENSE` file. The bencium skills were flattened out of the upstream `skills/<name>/` nesting so they load under a plain name.

`vercel-optimize`, `deploy-to-vercel`, and `vercel-cli-with-tokens` need the Vercel CLI (`npm i -g vercel`). The `accessibility-*` skills fetch their engine at run time via `npx @accesslint/…`, so they need network access and a page to point at. `extract-design-system` fetches a public website at run time and needs Chromium (`npx playwright install chromium`). The rest need nothing.

## MCP

`.cursor/mcp.json` (Cursor) and `.mcp.json` (Claude Code) both start the extract-design-system MCP server with `npx -y --package=extract-design-system extract-design-system-mcp`. Keep those two files in sync. After cloning, restart Cursor or Claude Code so the tools appear.

| Tool | Use it to |
| --- | --- |
| `extract_design_system` | Fetch a public URL and write starter token files |
| `init_design_system` | Regenerate token files from the last cached extraction |
| `get_tokens` | Read `design-system/tokens.json` without re-fetching |
| `audit_design_system` | Scan source files for hardcoded values that already have tokens |

Agents should prefer these tools when they are connected, and fall back to the `extract-design-system` skill CLI if they are not. The MCP server writes into the project working directory, same as the CLI.
