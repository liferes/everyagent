import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { detectFormats } from '../src/adapters/registry.js';
import { convertAndWrite } from '../src/core/pipeline.js';
import type { SourceFile } from '../src/core/ir.js';
import { writeEmittedFiles, type WriteOptions } from '../src/core/writer.js';

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uniskill-regression-'));
  tempDirs.push(dir);
  return dir;
}

function file(filePath: string, content: string): SourceFile {
  return { path: filePath, content: Buffer.from(content, 'utf8') };
}

const SKILL_MD = (name: string): string =>
  `---\nname: ${name}\ndescription: demo skill\n---\n\nbody\n`;

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('AGENTS.md is not proof of both OpenCode and Codex', () => {
  it('ignores the shared root rule when a real format is present', () => {
    const detected = detectFormats([
      file('AGENTS.md', '# agents\n'),
      file('.claude/skills/demo/SKILL.md', SKILL_MD('demo')),
    ]);

    expect(detected.map((d) => d.format)).toEqual(['claude']);
  });

  it('keeps both agent formats when AGENTS.md is the only signal', () => {
    const detected = detectFormats([file('AGENTS.md', '# agents\n')]);

    expect(detected.map((d) => d.format)).toEqual(['opencode', 'codex']);
  });

  it('keeps the format that owns a config directory', () => {
    const detected = detectFormats([
      file('AGENTS.md', '# agents\n'),
      file('.codex/skills/review/SKILL.md', SKILL_MD('review')),
    ]);

    expect(detected.map((d) => d.format)).toEqual(['codex']);
  });
});

describe('multi-target writes to a shared file name', () => {
  it('reports differing content as a conflict and keeps the first version', () => {
    const dir = makeTempDir();
    const seenPaths: NonNullable<WriteOptions['seenPaths']> = new Map();

    const opencode = writeEmittedFiles(
      [
        {
          relativePath: 'AGENTS.md',
          content: Buffer.from('opencode version\n'),
          targetFormat: 'opencode',
        },
      ],
      dir,
      { seenPaths },
    );

    const codex = writeEmittedFiles(
      [
        {
          relativePath: 'AGENTS.md',
          content: Buffer.from('codex version\n'),
          targetFormat: 'codex',
        },
      ],
      dir,
      { seenPaths },
    );

    expect(opencode.created).toBe(1);
    expect(codex.conflict).toBe(1);
    expect(codex.skipped).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8')).toBe(
      'opencode version\n',
    );
  });

  it('treats identical content as a duplicate rather than a user conflict', () => {
    const dir = makeTempDir();
    const seenPaths: NonNullable<WriteOptions['seenPaths']> = new Map();
    const emitted = [
      {
        relativePath: 'AGENTS.md',
        content: Buffer.from('same\n'),
        targetFormat: 'opencode' as const,
      },
    ];

    writeEmittedFiles(emitted, dir, { seenPaths });
    const second = writeEmittedFiles(
      [{ ...emitted[0], targetFormat: 'codex' }],
      dir,
      { seenPaths },
    );

    expect(second.duplicate).toBe(1);
    expect(second.skipped).toBe(0);
    expect(second.created).toBe(0);
  });
});

describe('untrusted skill names', () => {
  it('collapses parent-directory segments instead of aborting the run', () => {
    const dir = makeTempDir();

    const { summary } = convertAndWrite({
      files: [file('.claude/skills/a/SKILL.md', SKILL_MD('../../pwned'))],
      sourceFormat: 'claude',
      targetFormats: ['claude'],
      targetDir: dir,
    });

    expect(summary.created).toBe(1);
    expect(fs.existsSync(path.join(dir, '.claude', 'skills', 'pwned', 'SKILL.md'))).toBe(
      true,
    );
    expect(fs.existsSync(path.join(dir, 'pwned'))).toBe(false);
  });
});
