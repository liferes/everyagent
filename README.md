# uniskill

**Convert and install skill repos between Cursor, Claude Code, OpenCode, and Codex CLI.**

Every repo gets parsed into one intermediate shape, then rewritten for whichever format you asked for: paths inside the markdown get repointed, frontmatter gets translated, `scripts/` and `references/` come along. Existing files are left alone unless you pass `--force`.

---

## Quickstart

Launch the interactive wizard with no arguments:

```bash
npx uniskill
```

Or skip the questions:

```bash
npx uniskill owner/repo -t claude
```

---

## Copy-Paste One-Liners

```bash
# Auto-detect source format and install into .claude/ in the current directory
npx uniskill owner/repo -t claude

# Full GitHub URL, custom destination directory, skip confirmation
npx uniskill https://github.com/owner/repo -t opencode ./my-app -y

# Monorepo subpath (only that folder's files get installed)
npx uniskill owner/repo/tree/main/skills/ui -t codex

# Multi-target conversion in one pass
npx uniskill owner/repo -t claude,opencode,codex

# Convert to all supported formats
npx uniskill owner/repo -t all -y

# Install into your global agent configuration directory
npx uniskill owner/repo -t opencode -g

# Preview planned file creates/skips without touching disk
npx uniskill owner/repo -t claude --dry-run

# Overwrite existing files explicitly
npx uniskill owner/repo -t cursor --force
```

---

## Supported Formats & Mappings

| Format | Skill / Rule Path | Root Rules | Frontmatter Fields | Global Path (`-g`) |
| :--- | :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/<name>.mdc` | `.cursorrules` | `description`, `globs`, `alwaysApply` | `~/.cursor/` |
| **Claude Code** | `.claude/skills/<name>/SKILL.md` | `CLAUDE.md` | `name`, `description`, `allowed-tools` | `~/.claude/` |
| **OpenCode** | `.opencode/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.config/opencode/` |
| **Codex CLI** | `.codex/skills/<name>/SKILL.md` | `AGENTS.md` | `name`, `description` | `~/.codex/` |

### Translation rules

* **Cursor `.mdc` ➔ `SKILL.md`:** `description` and `globs` get pulled out, the glob patterns get folded into the description as `(Applies to: ...)`, and the body comes across unchanged.
* **`SKILL.md` ➔ Cursor `.mdc`:** `description` goes into the `.mdc` frontmatter with `alwaysApply: false`.
* **Internal paths:** folder references inside bodies, root rules, and text assets get repointed (`.cursor/scripts/` ➔ `.claude/scripts/`, `.cursorrules` ➔ `CLAUDE.md`).
* **Companion assets:** `scripts/`, `references/`, and anything else sitting next to a skill travel with it.

---

## Flags

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-t, --to <targets>` | Target format(s): `claude`, `opencode`, `codex`, `cursor`, `all` (comma-separated) | Prompt in TTY |
| `-p, --path <dir>` | Destination project directory (or pass `<dir>` as 2nd positional arg) | `.` |
| `-f, --from <format>` | Override source auto-detection (`auto`, `cursor`, `claude`, `opencode`, `codex`) | `auto` |
| `-g, --global` | Install to the user's global agent config directory | `false` |
| `-y, --yes` | Skip confirmation prompt | `false` |
| `-d, --dry-run` | Print planned creates and skips without modifying disk | `false` |
| `--force` | Overwrite existing files (overrides default skip behavior) | `false` |
| `-h, --help` | Display CLI help | — |
| `-v, --version` | Display CLI version | — |

---

## Zero-Destruction Default

By default, `uniskill` **never overwrites existing files**. If a destination file already exists, it logs:

```text
⚠ Skipped .claude/skills/react-hooks/SKILL.md (already exists)
```

Use `--dry-run` to preview every file operation before writing, or `--force` to explicitly overwrite existing files.

### Multiple targets

OpenCode and Codex both use `AGENTS.md` as their root rule, and each rewrites internal paths for its own config directory. When you convert to both in one run, the file name collides and `uniskill` keeps the first version:

```text
✔ Created AGENTS.md
⚠ Conflict AGENTS.md (second target wanted different content; first kept)
```

A conflict is not a user file being protected, so it is counted separately from skips and printed with a warning. If you need both, install them one at a time:

```bash
npx uniskill owner/repo -t opencode
npx uniskill owner/repo -t codex --force
```

---

## Local Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

Test globally via `npm link`:

```bash
npm link
uniskill --help
```

## License

MIT
