# Contributing

Small tool, small rules.

## Adding a format

A format is one file in `src/adapters/`. It exports a detector, a parser (files → intermediate shape), and an emitter (shape → files). Add the id to `FORMAT_IDS` and `FORMAT_META` in `src/core/ir.ts`, register the adapter in `src/adapters/registry.ts`, and the matrix test picks it up on its own: `tests/pipeline.test.ts` loops over `FORMAT_IDS` in both directions, so no test needs editing by hand.

Two things that will bite you:

- Detection must be able to say "not me". Returning a match for a bare `AGENTS.md` makes every Claude and Codex repo look like OpenCode.
- Every emitted path goes through the rewriter. If you emit a link without rewriting it, it breaks the moment the folder depth changes.

## Before you open a PR

```bash
npm run typecheck
npm test
npm run build
```

CI runs the same three on Node 18, 20 and 22. All three need to pass.

`dist/` is committed because git installs run it straight, so include a rebuild if you touched `src/`.

## Commits and releases

Conventional-ish subject lines: `1.5.0: add X` for a release, `fix: ...` / `docs: ...` for everything else. The changelog is hand-written, one section per version.
