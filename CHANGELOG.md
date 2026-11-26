# Changelog

Versioning: `x` big update, `y` mid fix, `z` small change.

Releases before 1.1.0 shipped as `uniskill`. The entries below are left as they were written.

## 1.4.1 (2026-11-26)

The published package installs nothing but itself.

- `dist/index.js` has always been one self-contained bundle, but the four libraries it is built from were still listed as runtime dependencies, so `npm i -g everyagent` pulled 15 packages that were never loaded. They moved to `devDependencies`. Installing now adds one package, and the CLI behaves identically.
- Same bundle, same behaviour, same flags.

Tests: 173.

## 1.4.0 (2026-11-26)

Skill folders that serve many harnesses at once no longer need `--from`.

- A config folder only counts as evidence when it holds a `SKILL.md`. Repos like `obra/superpowers` ship `.opencode/plugins/`, `.agents/`, and a plugin manifest for every tool next to one real `skills/` folder; those used to read as two competing formats and stopped the run with `Multiple formats detected`. Now the repo-wide `skills/` folder wins and the run just goes. A source that truly holds no skills gets `No SKILL.md found` and the config paths it did find, instead of a format menu.
- `remove -s <names>` drops named skills and keeps the rest of the install tracked, including root rules and shared config. A name that is not installed exits `1` and lists what is there, so a typo deletes nothing.
- `list` prints the skill names under each install and marks edited ones with `*`, which is the set `remove -s` would refuse to delete.
- An edited file during `remove` is now kept and reported instead of failing the command. The deletion had already happened before the old `exit 1`, so scripts and agents read a success as a failure and retried.

Tests: 173.

## 1.3.0 (2026-11-26)

Added four more formats: **Windsurf** (`.windsurf/skills/`, `.windsurfrules`), **GitHub Copilot** (`.github/skills/`, `.github/copilot-instructions.md`), **Cline** (`.cline/skills/`, `.clinerules`), and **Roo Code** (`.roo/skills/`, `.roorules`). All nine formats convert in any direction.

- Copilot detection and path rewriting only touch `.github/skills/` and `.github/copilot-instructions.md`. Workflows and templates under `.github/` are ignored, and links like `.github/workflows/ci.yml` inside skill bodies stay as written. With `-g`, Copilot writes `copilot-instructions.md` flat inside `~/.copilot/`.
- Kept the CLI flags and commands unchanged, trimmed the interactive target hints so 9 formats stay easy to scan, and added a reminder after writes to double-check the output in case any skills went undetected.

Tests: 162.

## 1.2.0 (2026-11-25)

Config files stop riding along by default.

- `settings.json`, `settings.local.json`, `mcp.json`, `.mcp.json`, and anything under `hooks/` are no longer copied. They can contain API keys and env vars, and only the tool that wrote them understands the format.
- `--with-config` copies them anyway. The wizard shows them as their own group, labelled, so picking them is a deliberate choice.
- Everything else still travels: skills, root rules, companion files, `commands/`, `agents/`.
- An install made before 1.2.0 keeps whatever config files it already tracks, so the first `sync` after upgrading deletes nothing.

Tests: 98.

## 1.1.0 (2026-11-25)

Renamed to **everyagent**: package, binary, repo, and the manifest folder. Installs record `.everyagent/manifest.json` in the project (or `~/.everyagent/manifest.json` with `-g`). Nothing reads the old `.uniskill` path.

Three fixes, all of them from installing into a project that already had files:

- A file that exists on disk, differs from the source, and was never recorded in the manifest now shows as `Not tracked` and stays untouched. Before, `sync --check` exited 1 forever on that project while `list` called the same install clean.
- `sync` and `remove` now refuse a manifest entry whose path points outside the install directory. A hand-written `.everyagent/manifest.json` with `../` in it could delete a file elsewhere on disk.
- Re-running an install against an unchanged file list no longer rewrites `installedAt`, so the manifest stops churning in git.

Tests: 93.

## 1.0.0 (2026-11-25)

Uniskill now tracks what it installs instead of writing files and forgetting them.

- Differing files get a prompt in a TTY: replace all, review one by one with a short diff, or keep them. Identical files stay quiet as `unchanged` and never trigger a question. Non-TTY, `--yes`, and `--dry-run` list differing paths under one heading and remind you about `--force`.
- Installs write `.uniskill/manifest.json` in project directories (or `~/.uniskill/manifest.json` for `-g`) with a SHA-256 hash per file.
- `uniskill sync [dest]` re-fetches recorded sources, updates untouched files that changed upstream, deletes untouched files that disappeared upstream, and leaves hand-edited files alone. Supports `--check` for CI and `--json`.
- `uniskill list [dest]` prints installed sources, target formats, and drift (`modified`, `missing`, or local source changes). Supports `--json`.
- `uniskill remove <source|--all> [dest]` removes only files whose disk hash still matches the manifest and refuses edited files by name.
- `uniskill lint [source]` checks frontmatter, duplicate names, naming rules, description length limits, and broken relative links. Supports `--json`.
- Exit codes: `0` clean, `1` on refusal or drift with `--check` or lint errors, `2` on bad arguments.

Tests: 90.

## 0.3.0 (2026-11-25)

Antigravity is the fifth format. Skills go to `.agents/skills/<name>/SKILL.md`, the root rule is `GEMINI.md`, and `-g` writes into `~/.gemini/config/`. The older `.agent/` folder still reads, and links inside skill bodies get renamed to `.agents/` even when Antigravity sits at both ends of the conversion. A repo carrying both folders keeps the `.agents/` copy and drops the legacy one instead of merging them. Freebuff and Codebuff load `.agents/skills/` too, so project installs land where those tools look.

The audit of that work found a few things worth listing.

- `-t gemini` wrote `.agents/` files. Gemini CLI is a different tool, so the alias is gone and the flag now errors.
- A bare `GEMINI.md` counted as Antigravity, as source and as target. Gemini CLI writes the same file, so only the folder counts now.
- A Claude repo with a `GEMINI.md` in it failed every non-interactive run with "Multiple formats detected". A format that only matched its root rule file loses to one that found skills or a config folder.
- The fallback message read "AGENTS.md, GEMINI.md is also present" while reading AGENTS.md. It names the file it picked and the ones it skipped.
- README had no Antigravity row and still claimed four formats and 65 tests.

Tests: 80.

## 0.2.0 (2026-11-25)

Most of this release went into detection and refusing to guess.

- Skills are found at any depth, so repos that keep them in a plain `skills/` folder work. `anthropics/skills` went from 1 detected skill to 20.
- A body starting with `---` stays a body instead of being parsed as frontmatter again.
- `.cursor/rules/<name>.mdc` and `<config>/skills/<name>/SKILL.md` rewrite to the file that actually exists on the other side.
- Two source skills sharing a `name:` stop the run before anything is written. One no longer wins by accident.
- `-s, --skill` converts only what you name and leaves root rules and shared assets alone.
- Detection got more forgiving: `-t` can be left out because the destination project and your installed config dirs get scanned, format names take shorthand and typos (`claude-code`, `oc`, `.cursor`), and a local project is read from its config folders and root rules with a picker when more than one turns up.
- `AGENTS.md`-only sources skip the `--from` demand in non-interactive runs.

Tests: 65.

## 0.1.0 (2026-11-25)

First release. One intermediate shape for skills, root rules and companion files, so any format converts to any other without a converter per pair.

- Four formats: Claude Code, OpenCode, Codex CLI, Cursor.
- Sources: `owner/repo`, a GitHub URL, a subpath inside a repo, or a local folder. Tarball download, no git binary.
- Existing files get skipped unless `--force`. `--dry-run` prints the plan and touches nothing.
- `-g` writes into the user-level config, `-y` skips the confirmation, and no arguments starts the wizard.
- Bundled into one file, so a git install runs without `node_modules`. npm 12 needs `--allow-git=all`.

Tests: 32.
