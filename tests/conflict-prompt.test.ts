import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const selectMock = vi.fn();
const noteMock = vi.fn();

vi.mock('@clack/prompts', () => ({
  select: (...args: unknown[]) => selectMock(...args),
  note: (...args: unknown[]) => noteMock(...args),
  multiselect: vi.fn(),
  text: vi.fn(),
  confirm: vi.fn(),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  log: { step: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  isCancel: () => false,
}));

import { formatShortDiff } from '../src/cli/diff.js';
import { promptConflictResolution } from '../src/cli/prompts.js';
import type { WriteAction } from '../src/core/writer.js';

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'everyagent-prompt-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  selectMock.mockReset();
  noteMock.mockReset();
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

describe('formatShortDiff & promptConflictResolution', () => {
  it('formats concise text and binary diffs', () => {
    const textDiff = formatShortDiff(
      Buffer.from('line1\nold line\nline3\n'),
      Buffer.from('line1\nnew line\nline3\n'),
      'SKILL.md',
    );
    expect(textDiff).toContain('- old line');
    expect(textDiff).toContain('+ new line');

    const binDiff = formatShortDiff(
      Buffer.from([0, 1, 2]),
      Buffer.from([0, 1, 2, 3, 4]),
      'icon.png',
    );
    expect(binDiff).toContain('Binary file differs');
  });

  it('supports replace_all, keep_all, and one-by-one review with per-file choice', async () => {
    const dir = makeTempDir();
    const fileA = path.join(dir, 'a.md');
    const fileB = path.join(dir, 'b.md');
    const fileC = path.join(dir, 'c.md');
    fs.writeFileSync(fileA, 'old a\n');
    fs.writeFileSync(fileB, 'old b\n');
    fs.writeFileSync(fileC, 'old c\n');

    const actions: WriteAction[] = [
      {
        relativePath: 'a.md',
        absolutePath: fileA,
        status: 'skipped',
        targetFormat: 'claude',
        dryRun: true,
        wouldBeContent: Buffer.from('new a\n'),
      },
      {
        relativePath: 'b.md',
        absolutePath: fileB,
        status: 'skipped',
        targetFormat: 'claude',
        dryRun: true,
        wouldBeContent: Buffer.from('new b\n'),
      },
      {
        relativePath: 'c.md',
        absolutePath: fileC,
        status: 'skipped',
        targetFormat: 'claude',
        dryRun: true,
        wouldBeContent: Buffer.from('new c\n'),
      },
    ];

    selectMock.mockResolvedValueOnce('keep_all');
    expect(Array.from(await promptConflictResolution(actions))).toEqual([]);

    selectMock.mockResolvedValueOnce('replace_all');
    expect(Array.from(await promptConflictResolution(actions))).toEqual([
      fileA,
      fileB,
      fileC,
    ]);

    // Review one-by-one: keep A, replace B, keep_all C
    selectMock
      .mockResolvedValueOnce('review')
      .mockResolvedValueOnce('keep')
      .mockResolvedValueOnce('replace')
      .mockResolvedValueOnce('keep_all');

    const selected = await promptConflictResolution(actions);
    expect(Array.from(selected)).toEqual([fileB]);
    expect(noteMock).toHaveBeenCalledTimes(3);
  });
});
