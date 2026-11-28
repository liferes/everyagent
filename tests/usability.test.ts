import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { detectFormats } from '../src/adapters/registry.js';
import { CliUsageError, parseCliArgs } from '../src/cli/args.js';
import type { SourceFile } from '../src/core/ir.js';
import {
  createEmptyManifest,
  hashBuffer,
  hashFile,
  type EveryagentManifest,
} from '../src/core/manifest.js';
import { groupSkills, planRemove } from '../src/core/sync.js';

const tempDirs: string[] = [];

function makeTempDir(prefix = 'everyagent-usability-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

function file(filePath: string, content: string): SourceFile {
  return { path: filePath, content: Buffer.from(content, 'utf8') };
}

const skillMd = (name: string): string =>
  `---\nname: ${name}\ndescription: ${name} skill\n---\n\nbody\n`;

/**
 * A repo laid out the way multi-harness skill collections are: every tool gets
 * a config folder holding a plugin manifest, and the real skills live in one
 * repo-wide `skills/` folder.
 */
function multiHarnessRepo(withSkills: boolean): SourceFile[] {
  const files = [
    file('.opencode/INSTALL.md', '# install\n'),
    file('.opencode/plugins/superpowers.js', 'export default {}\n'),
    file('.agents/plugins/superpowers.js', 'export default {}\n'),
    file('AGENTS.md', '# agents\n'),
    file('GEMINI.md', '# gemini\n'),
  ];
  if (withSkills) {
    files.push(
      file('skills/alpha/SKILL.md', skillMd('alpha')),
      file('skills/beta/SKILL.md', skillMd('beta')),
    );
  }
  return files;
}

describe('multi-harness repos are not ambiguous', () => {
  it('reads the repo-wide skills folder instead of asking for --from', () => {
    const detected = detectFormats(multiHarnessRepo(true));

    expect(detected.map((d) => d.format)).toEqual(['claude']);
    expect(detected[0].skillCount).toBe(2);
    expect(detected[0].allowLoose).toBe(true);
  });

  it('still reports the config-only formats when the repo holds no skills', () => {
    const detected = detectFormats(multiHarnessRepo(false));

    expect(detected.map((d) => d.format).sort()).toEqual([
      'antigravity',
      'opencode',
    ]);
    expect(detected.every((d) => d.skillCount === 0)).toBe(true);
  });

  it('keeps a config folder that owns real skills ahead of a loose folder', () => {
    const detected = detectFormats([
      file('.claude/skills/owned/SKILL.md', skillMd('owned')),
      file('skills/other/SKILL.md', skillMd('other')),
    ]);

    expect(detected.map((d) => d.format)).toEqual(['claude']);
    expect(detected[0].skillCount).toBe(1);
    expect(detected[0].allowLoose).toBe(false);
  });
});

describe('remove --skill narrows the job', () => {
  const SOURCE = 'acme/skills';

  function installFixture(): { dir: string; manifest: EveryagentManifest } {
    const dir = makeTempDir();
    const written: Array<[string, string]> = [
      ['.claude/skills/alpha/SKILL.md', skillMd('alpha')],
      ['.claude/skills/beta/SKILL.md', skillMd('beta')],
      ['.claude/skills/beta/notes.md', '# notes\n'],
      ['CLAUDE.md', '# rules\n'],
    ];
    const files = written.map(([rel, content]) => {
      const abs = path.join(dir, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
      return { path: rel, sha256: hashBuffer(Buffer.from(content, 'utf8')) };
    });

    const manifest = createEmptyManifest();
    manifest.installs.push({
      source: SOURCE,
      ref: 'main',
      subpath: null,
      sourceFormat: 'claude',
      targetFormat: 'claude',
      global: false,
      targetDir: null,
      installedAt: '2026-11-26T00:00:00.000Z',
      files,
    });
    return { dir, manifest };
  }

  it('removes one skill and keeps the rest of the install tracked', () => {
    const { dir, manifest } = installFixture();

    const plan = planRemove(manifest, { source: SOURCE, skills: ['alpha'] }, dir);

    expect(plan.deletedPaths).toEqual(['.claude/skills/alpha/SKILL.md']);
    expect(plan.missingSkills).toEqual([]);
    expect(plan.nextManifest.installs).toHaveLength(1);
    expect(plan.nextManifest.installs[0].files.map((f) => f.path).sort()).toEqual([
      '.claude/skills/beta/SKILL.md',
      '.claude/skills/beta/notes.md',
      'CLAUDE.md',
    ]);
  });

  it('matches skill names case-insensitively', () => {
    const { dir, manifest } = installFixture();

    const plan = planRemove(manifest, { source: SOURCE, skills: ['ALPHA'] }, dir);

    expect(plan.deletedPaths).toEqual(['.claude/skills/alpha/SKILL.md']);
  });

  it('reports unknown skill names and touches nothing', () => {
    const { dir, manifest } = installFixture();

    const plan = planRemove(manifest, { source: SOURCE, skills: ['nope'] }, dir);

    expect(plan.missingSkills).toEqual(['nope']);
    expect(plan.deletedPaths).toEqual([]);
    expect(plan.nextManifest.installs[0].files).toHaveLength(4);
  });

  it('keeps an edited skill file and still removes the untouched one', () => {
    const { dir, manifest } = installFixture();
    fs.writeFileSync(
      path.join(dir, '.claude/skills/alpha/SKILL.md'),
      '# my own rewrite\n',
    );

    const plan = planRemove(
      manifest,
      { source: SOURCE, skills: ['alpha', 'beta'] },
      dir,
    );

    expect(plan.refusedPaths).toEqual(['.claude/skills/alpha/SKILL.md']);
    expect(plan.deletedPaths.sort()).toEqual([
      '.claude/skills/beta/SKILL.md',
      '.claude/skills/beta/notes.md',
    ]);
    expect(plan.nextManifest.installs[0].files.map((f) => f.path)).toEqual([
      '.claude/skills/alpha/SKILL.md',
      'CLAUDE.md',
    ]);
  });

  it('parses -s on remove and refuses it next to --all', () => {
    expect(
      parseCliArgs(['node', 'everyagent', 'remove', 'acme/skills', '-s', 'a,b']),
    ).toMatchObject({ kind: 'remove', source: 'acme/skills', skills: ['a', 'b'] });

    expect(() =>
      parseCliArgs(['node', 'everyagent', 'remove', '--all', '-s', 'a']),
    ).toThrow(CliUsageError);
  });
});

describe('groupSkills describes what list shows', () => {
  it('names each skill folder and stars the edited ones', () => {
    const groups = groupSkills([
      { path: '.claude/skills/alpha/SKILL.md' },
      { path: '.claude/skills/alpha/ref.md', status: 'modified' },
      { path: '.claude/skills/beta/SKILL.md' },
      { path: 'CLAUDE.md' },
    ]);

    expect(groups.map((g) => g.name)).toEqual(['alpha', 'beta']);
    expect(groups.find((g) => g.name === 'alpha')?.drifted).toBe(true);
    expect(groups.find((g) => g.name === 'beta')?.drifted).toBe(false);
  });

  it('does not star a skill whose file merely went missing', () => {
    // `remove -s` deletes a skill with a missing file, so a star would promise
    // something the removal does not do.
    const groups = groupSkills([
      { path: '.claude/skills/alpha/SKILL.md' },
      { path: '.claude/skills/alpha/ref.md', status: 'missing' },
    ]);

    expect(groups[0].drifted).toBe(false);
  });

  it('returns nothing for a config-only install', () => {
    expect(groupSkills([{ path: '.claude/commands/review.md' }])).toEqual([]);
  });

  it('groups Cursor .mdc rule skills and scoped remove removes only the named skill', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ea-cursor-rm-'));
    try {
      const demoFile = path.join(root, '.cursor/rules/demo.mdc');
      const otherFile = path.join(root, '.cursor/rules/other.mdc');
      fs.mkdirSync(path.dirname(demoFile), { recursive: true });
      fs.writeFileSync(demoFile, 'demo rule\n');
      fs.writeFileSync(otherFile, 'other rule\n');

      const files = [
        { path: '.cursor/rules/demo.mdc', sha256: hashFile(demoFile)! },
        { path: '.cursor/rules/other.mdc', sha256: hashFile(otherFile)! },
      ];
      expect(groupSkills(files).map((g) => g.name)).toEqual(['demo', 'other']);

      const plan = planRemove(
        {
          version: 1,
          installs: [
            {
              source: 'cursor/pkg',
              ref: null,
              subpath: null,
              sourceFormat: 'cursor',
              targetFormat: 'cursor',
              global: false,
              targetDir: null,
              installedAt: '2026-11-28T00:00:00.000Z',
              files,
            },
          ],
        },
        { source: 'cursor/pkg', skills: ['demo'] },
        root,
      );
      expect(plan.missingSkills).toEqual([]);
      expect(plan.deletedPaths).toEqual(['.cursor/rules/demo.mdc']);
      expect(plan.nextManifest.installs[0].files.map((f) => f.path)).toEqual([
        '.cursor/rules/other.mdc',
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
