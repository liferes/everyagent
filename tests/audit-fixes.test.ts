import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getAdapter, detectFormats } from '../src/adapters/registry.js';
import { formatSummaryCounts } from '../src/cli/logger.js';
import { convertAndWrite } from '../src/core/pipeline.js';
import { rewritePaths } from '../src/core/rewriter.js';
import type { SourceFile } from '../src/core/ir.js';

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'everyagent-audit-'));
  tempDirs.push(dir);
  return dir;
}

function file(filePath: string, content: string): SourceFile {
  return { path: filePath, content: Buffer.from(content, 'utf8') };
}

function skill(name: string, body = 'body\n'): string {
  return `---\nname: ${name}\ndescription: ${name} skill\n---\n\n${body}`;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

describe('repo-root skill layouts', () => {
  it('finds skills nested under a bare skills/ directory', () => {
    const files = [
      file('skills/alpha/SKILL.md', skill('alpha')),
      file('skills/beta/SKILL.md', skill('beta')),
      file('skills/beta/references/guide.md', '# guide\n'),
    ];

    const detected = getAdapter('claude').detect(files, { allowLoose: true });
    expect(detected?.skillCount).toBe(2);

    const pkg = getAdapter('claude').parse(files, { allowLoose: true });
    expect(pkg.skills.map((s) => s.name).sort()).toEqual(['alpha', 'beta']);
    const beta = pkg.skills.find((s) => s.name === 'beta')!;
    expect(beta.assets.map((a) => a.relativePath)).toEqual(['references/guide.md']);
  });

  it('gives companion files to the deepest skill folder', () => {
    const files = [
      file('skills/outer/SKILL.md', skill('outer')),
      file('skills/outer/notes.md', 'outer notes\n'),
      file('skills/outer/inner/SKILL.md', skill('inner')),
      file('skills/outer/inner/notes.md', 'inner notes\n'),
    ];

    const pkg = getAdapter('claude').parse(files, { allowLoose: true });
    const inner = pkg.skills.find((s) => s.name === 'inner')!;
    const outer = pkg.skills.find((s) => s.name === 'outer')!;

    expect(inner.assets.map((a) => a.relativePath)).toEqual(['notes.md']);
    expect(outer.assets.map((a) => a.relativePath)).toEqual(['notes.md']);
  });

  it('still resolves a bare subpath SKILL.md to the subpath name', () => {
    const pkg = getAdapter('claude').parse([file('SKILL.md', 'plain body\n')], {
      allowLoose: true,
      subpathName: 'webapp-testing',
    });

    expect(pkg.skills.map((s) => s.name)).toEqual(['webapp-testing']);
  });
});

describe('frontmatter edge cases', () => {
  it('keeps a body that starts with a horizontal rule intact', () => {
    const dir = makeTempDir();
    const body = '---\n\nAfter rule.\n';

    convertAndWrite({
      files: [file('.claude/skills/hr/SKILL.md', skill('hr', body))],
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dir,
    });

    const written = fs.readFileSync(
      path.join(dir, '.opencode', 'skills', 'hr', 'SKILL.md'),
      'utf8',
    );
    expect(written).toBe(`---\nname: hr\ndescription: hr skill\n---\n${body}`);
  });

  it('names the file when frontmatter cannot be parsed', () => {
    const dir = makeTempDir();

    expect(() =>
      convertAndWrite({
        files: [file('.claude/skills/bad/SKILL.md', '---\nname: [oops\n---\n\nbody\n')],
        sourceFormat: 'claude',
        targetFormats: ['opencode'],
        targetDir: dir,
      }),
    ).toThrow(/\.claude\/skills\/bad\/SKILL\.md/);
  });
});

describe('path rewriting for Cursor rule files', () => {
  it('points .cursor/rules/<name>.mdc at the SKILL.md it becomes', () => {
    expect(rewritePaths('See .cursor/rules/ui-review.mdc', 'cursor', 'claude')).toBe(
      'See .claude/skills/ui-review/SKILL.md',
    );
  });

  it('points .cursor/rules/<name>/ at the skill folder', () => {
    expect(rewritePaths('.cursor/rules/ui-review/notes.md', 'cursor', 'opencode')).toBe(
      '.opencode/skills/ui-review/notes.md',
    );
  });

  it('flattens SKILL.md back to a single .mdc when targeting Cursor', () => {
    expect(rewritePaths('.claude/skills/ui-review/SKILL.md', 'claude', 'cursor')).toBe(
      '.cursor/rules/ui-review.mdc',
    );
  });
});

describe('duplicate skill names', () => {
  it('refuses to let one skill overwrite another instead of dropping it', () => {
    const dir = makeTempDir();

    expect(() =>
      convertAndWrite({
        files: [
          file('.claude/skills/a/SKILL.md', skill('same', 'Body A.\n')),
          file('.claude/skills/b/SKILL.md', skill('same', 'Body B.\n')),
        ],
        sourceFormat: 'claude',
        targetFormats: ['opencode'],
        targetDir: dir,
      }),
    ).toThrow(/skills\/same\/SKILL\.md/);

    expect(fs.existsSync(path.join(dir, '.opencode'))).toBe(false);
  });
});

describe('summary counts', () => {
  it('reports files written once for two targets', () => {
    expect(
      formatSummaryCounts({
        created: 2,
        overwritten: 0,
        unchanged: 0,
        skipped: 0,
        duplicate: 1,
        conflict: 0,
        actions: [],
      }),
    ).toBe('2 created, 0 skipped, 1 shared');
  });
});

describe('loose detection stays strict about real formats', () => {
  it('prefers the config dir when one exists', () => {
    const detected = detectFormats([
      file('.claude/skills/demo/SKILL.md', skill('demo')),
      file('skills/other/SKILL.md', skill('other')),
    ]);

    expect(detected.map((d) => d.format)).toEqual(['claude']);
  });
});

describe('config assets', () => {
  const files = () => [
    file('.claude/skills/demo/SKILL.md', skill('demo')),
    file('.claude/commands/review.md', '# review\n'),
    file('.claude/settings.json', '{"env":{"TOKEN":"secret"}}\n'),
    file('.claude/settings.local.json', '{}\n'),
    file('.claude/.mcp.json', '{"servers":{}}\n'),
    file('.claude/hooks/pre.sh', '#!/bin/sh\n'),
  ];

  it('leaves settings, hooks, and MCP files behind by default', () => {
    const dest = makeTempDir();
    const run = convertAndWrite({
      files: files(),
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });

    const paths = run.summary.actions.map((a) => a.relativePath).sort();
    expect(paths).toEqual([
      '.opencode/commands/review.md',
      '.opencode/skills/demo/SKILL.md',
    ]);
    expect(fs.existsSync(path.join(dest, '.opencode', 'settings.json'))).toBe(
      false,
    );
    expect(fs.existsSync(path.join(dest, '.opencode', 'hooks'))).toBe(false);
  });

  it('copies them when includeConfigAssets is set', () => {
    const dest = makeTempDir();
    const run = convertAndWrite({
      files: files(),
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
      selection: { includeConfigAssets: true },
    });

    const paths = run.summary.actions.map((a) => a.relativePath).sort();
    expect(paths).toEqual([
      '.opencode/.mcp.json',
      '.opencode/commands/review.md',
      '.opencode/hooks/pre.sh',
      '.opencode/settings.json',
      '.opencode/settings.local.json',
      '.opencode/skills/demo/SKILL.md',
    ]);
  });
});
