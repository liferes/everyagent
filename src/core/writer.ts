import fs from 'node:fs';
import path from 'node:path';
import { normalizePosixPath, type EmittedFile, type FormatId } from './ir.js';

export type WriteStatus =
  | 'created'
  | 'overwritten'
  | 'unchanged'
  | 'skipped'
  | 'duplicate'
  | 'conflict';

export interface WriteAction {
  relativePath: string;
  absolutePath: string;
  status: WriteStatus;
  targetFormat: FormatId;
  dryRun: boolean;
}

export interface WriteSummary {
  created: number;
  overwritten: number;
  unchanged: number;
  skipped: number;
  duplicate: number;
  conflict: number;
  actions: WriteAction[];
}

export interface WriteOptions {
  force?: boolean;
  dryRun?: boolean;
  /** Paths already emitted earlier in this run, mapped to their content. */
  seenPaths?: Map<string, Buffer>;
}

/**
 * Writes emitted files into `targetDir`. Nothing gets clobbered unless `force`
 * is set, and `dryRun` counts the actions without touching disk.
 */
export function writeEmittedFiles(
  files: EmittedFile[],
  targetDir: string,
  options: WriteOptions = {},
): WriteSummary {
  const force = Boolean(options.force);
  const dryRun = Boolean(options.dryRun);
  const seenPaths = options.seenPaths ?? new Map<string, Buffer>();

  const resolvedRoot = path.resolve(targetDir);
  const summary: WriteSummary = {
    created: 0,
    overwritten: 0,
    unchanged: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: [],
  };

  for (const file of files) {
    const rel = normalizePosixPath(file.relativePath);
    if (!rel || rel.split('/').some((seg) => seg === '..')) {
      throw new Error(`Refusing unsafe target path "${file.relativePath}".`);
    }

    const absolutePath = path.resolve(resolvedRoot, rel);
    if (
      absolutePath !== resolvedRoot &&
      !absolutePath.startsWith(resolvedRoot + path.sep)
    ) {
      throw new Error(`Target path escapes destination directory: "${file.relativePath}".`);
    }

    const emittedEarlier = seenPaths.get(absolutePath);
    const exists = fs.existsSync(absolutePath);
    let status: WriteStatus;

    if (emittedEarlier) {
      // Two targets in one run want the same file. First writer wins, and
      // differing content gets its own status so it never reads as a user skip.
      if (emittedEarlier.equals(file.content)) {
        status = 'duplicate';
        summary.duplicate += 1;
      } else {
        status = 'conflict';
        summary.conflict += 1;
      }
    } else if (exists) {
      let existingBuffer: Buffer | undefined;
      try {
        existingBuffer = fs.readFileSync(absolutePath);
      } catch {
        existingBuffer = undefined;
      }

      if (existingBuffer && existingBuffer.equals(file.content)) {
        status = 'unchanged';
        summary.unchanged += 1;
      } else if (!force) {
        status = 'skipped';
        summary.skipped += 1;
      } else {
        status = 'overwritten';
        summary.overwritten += 1;
        if (!dryRun) {
          fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
          fs.writeFileSync(absolutePath, file.content);
        }
      }
    } else {
      status = 'created';
      summary.created += 1;
      if (!dryRun) {
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, file.content);
      }
    }

    if (!emittedEarlier) {
      seenPaths.set(absolutePath, file.content);
    }
    summary.actions.push({
      relativePath: rel,
      absolutePath,
      status,
      targetFormat: file.targetFormat,
      dryRun,
    });
  }

  return summary;
}
