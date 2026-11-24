# uniskill

Point it at a skill repo, name the agent you use, and it lays the files out the way that agent expects. Cursor rules in, Claude skills out. Or OpenCode, or Codex. Any direction you need.

Every source gets parsed into one intermediate shape and rebuilt for the target, which is how it avoids a converter for every format pair. Paths inside the markdown get rewritten on the way through: a `.cursor/scripts/` reference becomes `.claude/scripts/` when Claude is the destination, and the `.cursorrules` root file comes out as `CLAUDE.md`. Whatever sits next to a skill travels with it.

Nothing on your disk gets overwritten unless you pass `--force`.

## Install

Not on npm yet. Install from GitHub:

```bash
npm i -g --allow-git=all github:liferes/uniskill
```

npm 12 blocks git installs by default, so that flag isn't optional. It ships prebuilt, so there's nothing to compile.

Prefer it uninstalled:

```bash
npx --yes --allow-git=all github:liferes/uniskill owner/repo -t claude
```

## Usage

Bare, with no arguments, it asks you questions:

```bash
uniskill
```

Give it everything up front and it skips the questions. First argument is the source, either `owner/repo` or a full URL:

```bash
uniskill owner/repo -t claude
```

More of the same:

```bash
# detect the source format, write into .claude/ here
uniskill owner/repo -t claude

# full URL, custom directory, no confirmation prompt
uniskill https://github.com/owner/repo -t opencode ./my-app -y

# pull one folder out of a monorepo
uniskill owner/repo/tree/main/skills/ui -t codex

# two targets in one pass
uniskill owner/repo -t claude,opencode

# everything at once
uniskill owner/repo -t all -y

# straight into your user-level agent config
uniskill owner/repo -t opencode -g

# see what would happen, touch nothing
uniskill owner/repo -t claude --dry-run

# overwrite what's already there
uniskill owner/repo -t cursor --force
```

## Formats

| Format | Skills live in | Root rule | Frontmatter | `-g` target |
| :--- | :--- | :--- | :--- | :--- |
| Cursor | `.cursor/rules/<name>.mdc` | `.cursorrules` | `description`, `globs`, `alwaysApply` | `~/.cursor/` |
| Claude Code | `.claude/skills/<name>/SKILL.md` | `CLAUDE.md` | `name`, `description`, `allowed-tools` | `~/.claude/` |
| OpenCode | `.opencode/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.config/opencode/` |
| Codex CLI | `.codex/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.codex/` |

### Cursor is the odd one

Cursor keeps rules as single `.mdc` files instead of a folder with a `SKILL.md` inside, so converting in that direction loses a bit of shape. Glob patterns have nowhere to live in `SKILL.md` frontmatter, so they get folded into the description as `(Applies to: ...)`. Going back the other way, `description` lands in the `.mdc` frontmatter and `alwaysApply` comes out as `false`.

## Flags

| Flag | What it does | Default |
| :--- | :--- | :--- |
| `-t, --to <targets>` | Target format(s): `claude`, `opencode`, `codex`, `cursor`, `all`. Comma-separated. | Prompted in a TTY |
| `-p, --path <dir>` | Destination project directory, or pass it as the second positional arg | `.` |
| `-f, --from <format>` | Override source detection: `auto`, `cursor`, `claude`, `opencode`, `codex` | `auto` |
| `-g, --global` | Install into your user-level agent config directory | `false` |
| `-y, --yes` | Skip the confirmation prompt | `false` |
| `-d, --dry-run` | Print the plan without touching disk | `false` |
| `--force` | Overwrite existing files | `false` |
| `-h, --help` | Print help | |
| `-v, --version` | Print version | |

## Skipping, and the one collision

Existing files get skipped, not replaced:

```text
⚠ Skipped .claude/skills/react-hooks/SKILL.md (already exists)
```

`--dry-run` shows you the whole plan first, and `--force` overrides the skip.

One case is worth knowing about. OpenCode and Codex both call their root rule `AGENTS.md`, but each rewrites internal paths for its own config directory, so the two copies differ. Convert to both in a single run and the second one loses:

```text
✔ Created AGENTS.md
⚠ Conflict AGENTS.md (second target wanted different content; first kept)
```

That counts as a conflict rather than a skip, since no file of yours was involved. Install them separately if you need both:

```bash
uniskill owner/repo -t opencode
uniskill owner/repo -t codex --force
```

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
uniskill --help
```

The 32 tests cover the 4x4 conversion matrix, the tar extractor, the writer's skip and conflict paths, and skill-name sanitising.

## License

MIT. See [LICENSE](LICENSE).
