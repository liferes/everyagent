# everyagent

Point it at a skill repo, name the agent you use, and it lays the files out the way that agent expects. Cursor rules in, Claude skills out. Or OpenCode, Codex, Antigravity, Windsurf, GitHub Copilot, Cline, and Roo Code. Any direction you need.

Every source gets parsed into one intermediate shape and rebuilt for the target, which is how it avoids a converter for every format pair. Paths inside the markdown get rewritten on the way through: a `.cursor/scripts/` reference becomes `.claude/scripts/` when Claude is the destination, and the `.cursorrules` root file comes out as `CLAUDE.md`. Whatever sits next to a skill travels with it.

Nothing on your disk gets overwritten without your say-so: `--force` up front, or the prompt that shows a diff and asks per file.

## Install

Not on npm yet. Install from GitHub:

```bash
npm i -g --allow-git=all github:liferes/everyagent
```

npm 12 blocks git installs by default, so that flag isn't optional. It ships prebuilt, so there's nothing to compile.

Prefer it uninstalled:

```bash
npx --yes --allow-git=all github:liferes/everyagent owner/repo -t claude
```

## Usage

Bare, with no arguments, it asks you questions:

```bash
everyagent
```

Give it everything up front and it skips the questions. First argument is the source, either `owner/repo` or a full URL:

```bash
everyagent owner/repo -t claude
```

More of the same:

```bash
# detect the source format, write into .claude/ here
everyagent owner/repo -t claude

# full URL, custom directory, no confirmation prompt
everyagent https://github.com/owner/repo -t opencode ./my-app -y

# pull one folder out of a monorepo
everyagent owner/repo/tree/main/skills/ui -t codex

# two targets in one pass
everyagent owner/repo -t claude,opencode

# everything at once
everyagent owner/repo -t all -y

# straight into your user-level agent config
everyagent owner/repo -t opencode -g

# see what would happen, touch nothing
everyagent owner/repo -t claude --dry-run

# overwrite what's already there
everyagent owner/repo -t cursor --force

# sync, list, remove, lint
everyagent sync
everyagent sync --check
everyagent list
everyagent remove owner/repo
everyagent lint
```

## Formats

| Format | Skills live in | Root rule | Frontmatter | `-g` target |
| :--- | :--- | :--- | :--- | :--- |
| Cursor | `.cursor/rules/<name>.mdc` | `.cursorrules` | `description`, `globs`, `alwaysApply` | `~/.cursor/` |
| Claude Code | `.claude/skills/<name>/SKILL.md` | `CLAUDE.md` | `name`, `description`, `allowed-tools` | `~/.claude/` |
| OpenCode | `.opencode/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.config/opencode/` |
| Codex CLI | `.codex/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.codex/` |
| Antigravity | `.agents/skills/<name>/SKILL.md` | `GEMINI.md` | `name`, `description` | `~/.gemini/config/` |
| Windsurf | `.windsurf/skills/<name>/SKILL.md` | `.windsurfrules` | `name`, `description` | `~/.codeium/windsurf/` |
| Copilot | `.github/skills/<name>/SKILL.md` | `.github/copilot-instructions.md` | `name`, `description` | `~/.copilot/` |
| Cline | `.cline/skills/<name>/SKILL.md` | `.clinerules` | `name`, `description` | `~/.cline/` |
| Roo Code | `.roo/skills/<name>/SKILL.md` | `.roorules` | `name`, `description` | `~/.roo/` |

### Cursor is the odd one

Cursor keeps rules as single `.mdc` files instead of a folder with a `SKILL.md` inside, so converting in that direction loses a bit of shape. Glob patterns have nowhere to live in `SKILL.md` frontmatter, so they get folded into the description as `(Applies to: ...)`. Going back the other way, `description` lands in the `.mdc` frontmatter and `alwaysApply` comes out as `false`.

### Antigravity and its old folder name

Antigravity used to keep skills in `.agent/` before moving to `.agents/`. Both get read, and the files come out under `.agents/` even when Antigravity is the target too. If a repo has a copy in each, the `.agents/` one wins.

`GEMINI.md` is not a giveaway on its own, since Gemini CLI writes the same file. It only counts as Antigravity when `.agents/` or `.agent/` is there, or when you say `-f antigravity`. Otherwise a Claude project carrying a `GEMINI.md` stays a Claude project.

### Copilot shares `.github/`

Because `.github/` holds CI workflows, issue templates, and PR templates too, Copilot detection only reads `.github/skills/` and `.github/copilot-instructions.md`. Everything else under `.github/` is ignored, and links like `.github/workflows/ci.yml` inside skill bodies stay untouched. With `-g`, Copilot writes `copilot-instructions.md` straight into `~/.copilot/` instead of nesting `.github/` inside it.

Legacy rule folders such as `.windsurf/rules/`, `.github/instructions/`, `.clinerules/`, and `.roo/rules/` are not parsed as skills yet, so always double-check the generated files after converting an older repo.

## Flags

| Flag | What it does | Default |
| :--- | :--- | :--- |
| `-t, --to <targets>` | Target format(s): `cursor`, `claude`, `opencode`, `codex`, `antigravity`, `windsurf`, `copilot`, `cline`, `roo`, `all`. Comma-separated. | Prompted in a TTY |
| `-s, --skill <names>` | Only these skills. Root rules and shared config assets are left out. Comma-separated or repeated. | All skills |
| `-p, --path <dir>` | Destination project directory, or pass it as the second positional arg | `.` |
| `-f, --from <format>` | Override source detection: `auto`, `cursor`, `claude`, `opencode`, `codex`, `antigravity`, `windsurf`, `copilot`, `cline`, `roo` | `auto` |
| `-g, --global` | Install into your user-level agent config directory | `false` |
| `-y, --yes` | Skip the confirmation prompt | `false` |
| `-d, --dry-run` | Print the plan without touching disk | `false` |
| `--force` | Overwrite existing files | `false` |
| `--with-config` | Also copy `settings.json`, `.mcp.json`, and `hooks/` | `false` |
| `-h, --help` | Print help | |
| `-v, --version` | Print version | |

## What travels and what stays

Skills, root rules, companion assets (references, scripts), and shared assets like `commands/` and `agents/` are copied.

Settings, hooks, and MCP files are not. `settings.json`, `settings.local.json`, `mcp.json`, `.mcp.json`, and anything under `hooks/` stay behind unless you pass `--with-config`. They can hold API keys and env vars, and they only mean something to the tool that wrote them. The interactive wizard lists them as a separate group so you can pick them on purpose.

## Skipping, replacing, and the one collision

Identical files already on disk stay quiet as `unchanged`. When existing files differ:

- In a TTY without `--force`, `everyagent` asks whether to replace all differing files, review each one with a short diff, or keep them.
- In non-TTY runs, `--yes`, or `--dry-run`, differing files are listed under `Differs on disk:` with a `--force` reminder and nothing is overwritten.

```text
⚠ Differs on disk:
  .claude/skills/react-hooks/SKILL.md
```

`--dry-run` shows you the whole plan first, and `--force` replaces every differing file.

## Managing installed skills

Every install records a manifest at `.everyagent/manifest.json` (or `~/.everyagent/manifest.json` with `-g`) containing the source, format, and SHA-256 hash of each installed file. A file you kept instead of replacing never enters the manifest, so `sync` leaves it alone and reports it as `Not tracked` rather than drift.

```bash
everyagent sync [dest]          # update untouched files, keep local edits, prune removed upstream files
everyagent sync --check         # exit 1 if anything drifted (for CI)
everyagent list [dest]          # show installed sources, formats, and local drift
everyagent remove <source|--all> [dest]  # delete untouched files; refuse edited ones
everyagent lint [source]        # check frontmatter, duplicates, naming, description length, links
```

`sync` and `list` accept `--json`. Exit codes: `0` clean, `1` on drift (`--check`), refusal, or lint errors, `2` on bad arguments.

One case is worth knowing about. OpenCode and Codex both call their root rule `AGENTS.md`, but each rewrites internal paths for its own config directory, so the two copies differ. Convert to both in a single run and the second one loses:

```text
✔ Created AGENTS.md
⚠ Conflict AGENTS.md (second target wanted different content; first kept)
```

That counts as a conflict rather than a skip, since no file of yours was involved. Install them separately if you need both:

```bash
everyagent owner/repo -t opencode
everyagent owner/repo -t codex --force
```

Two skills that share the same `name:` would land on the same file. The run stops before writing anything instead of letting one silently win:

```text
✖ Two source items both write ".claude/skills/review/SKILL.md" with different content.
  Rename one of them, or install them separately with --skill.
```

## Changelog

What changed in each release, back to the first one: [CHANGELOG.md](CHANGELOG.md).

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

To try the binary before installing it for real:

```bash
npm link
everyagent --help
```

The tests cover the 9x9 conversion matrix, Copilot `.github/` isolation, the tar extractor, the writer's skip and conflict paths, the manifest and sync planners, and the repo layouts that carry skills outside a config dir.

## License

MIT. See [LICENSE](LICENSE).
