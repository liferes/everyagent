# everyagent

Nine agents, nine folder layouts, nine frontmatter dialects. everyagent reads skills, rules, and companion files out of one and writes them into any other.

Cursor rules in, Claude skills out. Or OpenCode, Codex, Antigravity, Windsurf, GitHub Copilot, Cline, Roo Code. Any direction you need.

[![npm](https://img.shields.io/npm/v/everyagent.svg)](https://www.npmjs.com/package/everyagent)
[![CI](https://github.com/liferes/everyagent/actions/workflows/ci.yml/badge.svg)](https://github.com/liferes/everyagent/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)

```text
$ everyagent obra/superpowers -t opencode
✔ Created .opencode/skills/brainstorming/SKILL.md
✔ Created .opencode/skills/writing-plans/SKILL.md
✔ Created AGENTS.md
```

## Why not just copy the folder

Because a copied file usually loads as nothing, and nothing is silent.

- Frontmatter keys are per-tool. Cursor wants `description`/`globs`/`alwaysApply`, Claude wants `name`/`description`/`allowed-tools`, and an unknown key is ignored or rejected depending on the agent.
- Relative links break as soon as the folder depth changes. A `.cursor/scripts/build.sh` reference has to become `.claude/scripts/build.sh` or the skill is dead.
- Root rules have nine different names. Copying `.cursorrules` into a Claude project gives you a file Claude never reads.
- Re-running by hand clobbers your edits.

Nine formats is 81 pairs, so everyagent doesn't do pairs. Every source gets parsed into one intermediate shape and rebuilt for the target. Paths inside the markdown get rewritten on the way through, and whatever sits next to a skill travels with it.

Nothing on your disk gets overwritten without your say-so: `--force` up front, or the prompt that shows a diff and asks per file.

## Install

Node 18 or newer.

```bash
npm i -g everyagent
```

Or skip the install:

```bash
npx everyagent owner/repo -t claude
```

No npm at all? Grab the single file from [Releases](https://github.com/liferes/everyagent/releases) and run it with plain Node, no `node_modules`:

```bash
node everyagent-1.4.0.mjs owner/repo -t claude
```

Bleeding edge from git: `npm i -g --allow-git=all github:liferes/everyagent`. The flag isn't optional, npm 12 blocks git installs by default.

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
# auto-detect source and target from the current project
everyagent owner/repo

# detect the source format, write into .claude/ here
everyagent owner/repo -t claude

# full URL, custom directory, no confirmation prompt
everyagent https://github.com/owner/repo -t opencode ./my-app -y

# pull one folder or a single SKILL.md link out of a monorepo
everyagent owner/repo/tree/main/skills/ui -t codex
everyagent https://github.com/owner/repo/blob/main/skills/ui/SKILL.md -t windsurf

# convert from a local folder
everyagent ./other-repo -t copilot

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
everyagent remove owner/repo -s brainstorming
everyagent lint
```

### Sources and shortcuts

Sources can be `owner/repo`, a GitHub `tree/` or `blob/` URL (pointing at `SKILL.md` grabs its whole skill folder), an SSH URL (`git@github.com:owner/repo.git`), a `raw.githubusercontent.com` link, or a local directory. Set `GITHUB_TOKEN` or `GH_TOKEN` to fetch private repositories.

If you omit `-t`, `everyagent` checks the destination folder for existing agent configs, then falls back to the tools installed in your home directory. Format names also accept common shorthands (`ws`, `oc`, `agy`, `gh-copilot`, `roocode`, `claude-code`, `.cursor`).

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

Some formats have edges that don't fit the table: Cursor's single-file rules, Antigravity's old `.agent/` folder, Copilot sharing `.github/` with CI, the `AGENTS.md` collision between OpenCode and Codex. All of it is in [docs/quirks.md](docs/quirks.md).

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

## Skipping, replacing, and conflicts

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
everyagent list [dest]          # show installed sources, formats, skills, and local drift
everyagent remove <source|--all> [dest]  # delete untouched files, keep edited ones
everyagent remove <source> -s <names> [dest]  # drop named skills, keep the rest of the install
everyagent lint [source]         # check frontmatter, duplicates, naming, description length, links
```

`remove -s` deletes the folders you name and leaves everything else tracked, so the rest of the install keeps working. Root rules and shared config stay, because dropping those would break skills you asked to keep. An edited file is kept and reported instead of deleted, and that is not an error: the exit code stays `0`. A name that is not installed exits `1` and lists what is there, so a typo removes nothing.

`list` prints the skill names under each install, with a `*` on any skill you have edited, which is exactly the set `remove -s` would refuse to delete.

`sync`, `list`, and `lint` accept `--json`. Exit codes: `0` clean, `1` on drift (`--check`), an unknown skill name, or lint errors, `2` on bad arguments.

## Tested against

Real repos, not fixtures:

| Source | What happened |
| :--- | :--- |
| [`obra/superpowers`](https://github.com/obra/superpowers) | 15 skills, read as Claude, installed into OpenCode. Needs `-f claude`: the repo ships OpenCode and Antigravity layouts too, so auto-detection is ambiguous. |
| [`anthropics/skills`](https://github.com/anthropics/skills) | 19 skills / 442 files out of a repo that keeps them outside any config dir. |
| A local `~/.config/opencode/skills` folder | 30 skills / 276 files into Antigravity's `~/.gemini/config/skills`. |

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

## Tips and tricks

- **Paste whatever GitHub URL is in your browser.** You don't need to trim `/blob/main/.../SKILL.md` down to `owner/repo` or strip `git clone ` off the front. Pointing at a `SKILL.md` automatically grabs its sibling `scripts/` and `references/` folders too.
- **Let `-t` figure itself out.** Inside a repo that already has `.claude/` or `.windsurf/`, you can omit `-t` and `everyagent` will target what's already there. If the folder is empty, it checks your home directory for installed agents instead.
- **Grab one skill without clobbering root rules.** Pass `-s react-hooks` when you only want a single skill; `CLAUDE.md`, `.cursorrules`, and shared assets stay untouched.
- **Keep local tweaks safe during updates.** Skip `--force` in an interactive terminal to review diffs one file at a time, and keep what you edited. Those skipped files stay out of `.everyagent/manifest.json`, so `everyagent sync` won't overwrite them later.
- **Wire `lint` and `sync --check` into CI.** `everyagent lint` flags duplicate names, broken relative links, and descriptions over 500 chars for Cursor (or 1,024 for other tools). `everyagent sync --check` exits `1` when tracked skills drift.
- **Use `GITHUB_TOKEN` for private skill repos.** Export `GITHUB_TOKEN` or `GH_TOKEN` in your shell and `everyagent` sends it when pulling tarballs from private GitHub repositories.

## License

MIT. See [LICENSE](LICENSE).
