# Format quirks

The things that don't fit the clean story. Read this before converting an older repo.

## Cursor is the odd one

Cursor keeps rules as single `.mdc` files instead of a folder with a `SKILL.md` inside, so converting in that direction loses a bit of shape. Glob patterns have nowhere to live in `SKILL.md` frontmatter, so they get folded into the description as `(Applies to: ...)`. Going back the other way, `description` lands in the `.mdc` frontmatter and `alwaysApply` comes out as `false`.

## Antigravity and its old folder name

Antigravity used to keep skills in `.agent/` before moving to `.agents/`. Both get read, and the files come out under `.agents/` even when Antigravity is the target too. If a repo has a copy in each, the `.agents/` one wins.

`GEMINI.md` is not a giveaway on its own, since Gemini CLI writes the same file. It only counts as Antigravity when `.agents/` or `.agent/` is there, or when you say `-f antigravity`. Otherwise a Claude project carrying a `GEMINI.md` stays a Claude project.

## Copilot shares `.github/`

Because `.github/` holds CI workflows, issue templates, and PR templates too, Copilot detection only reads `.github/skills/` and `.github/copilot-instructions.md`. Everything else under `.github/` is ignored, and links like `.github/workflows/ci.yml` inside skill bodies stay untouched. With `-g`, Copilot writes `copilot-instructions.md` straight into `~/.copilot/` instead of nesting `.github/` inside it.

## OpenCode and Codex both call their root rule `AGENTS.md`

Each rewrites internal paths for its own config directory, so the two copies differ. Convert to both in a single run and the second one loses:

```text
✔ Created AGENTS.md
⚠ Conflict AGENTS.md (second target wanted different content; first kept)
```

That counts as a conflict rather than a skip, since no file of yours was involved. Install them separately if you need both:

```bash
everyagent owner/repo -t opencode
everyagent owner/repo -t codex --force
```

## Legacy rule folders

These are not parsed as skills yet, so double-check the generated files after converting an older repo:

- `.windsurf/rules/`
- `.github/instructions/`
- `.clinerules/`
- `.roo/rules/`

## Two skills with the same name

They would land on the same file. The run stops before writing anything instead of letting one silently win:

```text
✖ Two source items both write ".claude/skills/review/SKILL.md" with different content.
  Rename one of them, or install them separately with --skill.
```

## Detection is a guess

Detection reads the destination first, then your home directory. A repo carrying configs for three agents at once is ambiguous; `-f <format>` settles it. `obra/superpowers` is the known case: it ships both OpenCode and Antigravity layouts, so it needs `-f claude` to be read as the Claude repo it actually is.
