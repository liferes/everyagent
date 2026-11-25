import fs from 'node:fs';
import path from 'node:path';
import { detectFormats, getAdapter } from '../adapters/registry.js';
import type { DetectionResult } from '../adapters/types.js';
import type { FetchResult } from './fetcher.js';
import {
  FORMAT_IDS,
  normalizePosixPath,
  type FormatId,
  type SourceFile,
} from './ir.js';

export interface TargetDetectionResult {
  formats: FormatId[];
  scope: 'project' | 'global' | 'none';
}

export interface TargetDetectionOptions {
  targetDir: string;
  global?: boolean;
  sourceFormat?: FormatId;
  excludeSourceWhenLocal?: boolean;
  globalDirResolver?: (format: FormatId) => string;
}

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist']);
const KNOWN_CONFIG_DIRS = ['.cursor', '.claude', '.opencode', '.codex'] as const;
const KNOWN_ROOT_FILES = new Set([
  '.cursorrules',
  'CLAUDE.md',
  'AGENTS.md',
  'SKILL.md',
]);

function existsSafe(targetPath: string): boolean {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}

function isDirSafe(targetPath: string): boolean {
  try {
    return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function maybeExcludeSource(
  formats: FormatId[],
  options: TargetDetectionOptions,
): FormatId[] {
  if (options.excludeSourceWhenLocal && options.sourceFormat) {
    return formats.filter((id) => id !== options.sourceFormat);
  }
  return formats;
}

/**
 * Scan the destination project (or global machine config dirs) to infer
 * which agent format(s) the user wants without requiring `-t`.
 */
export function detectTargetFormats(
  options: TargetDetectionOptions,
): TargetDetectionResult {
  if (!options.global) {
    const resolvedDir = path.resolve(options.targetDir);
    if (isDirSafe(resolvedDir)) {
      const projectFormats: FormatId[] = [];

      for (const id of FORMAT_IDS) {
        if (id === 'cursor') {
          if (
            existsSafe(path.join(resolvedDir, '.cursor')) ||
            existsSafe(path.join(resolvedDir, '.cursorrules'))
          ) {
            projectFormats.push(id);
          }
        } else if (id === 'claude') {
          if (
            existsSafe(path.join(resolvedDir, '.claude')) ||
            existsSafe(path.join(resolvedDir, 'CLAUDE.md'))
          ) {
            projectFormats.push(id);
          }
        } else if (id === 'opencode') {
          if (existsSafe(path.join(resolvedDir, '.opencode'))) {
            projectFormats.push(id);
          }
        } else if (id === 'codex') {
          if (existsSafe(path.join(resolvedDir, '.codex'))) {
            projectFormats.push(id);
          }
        }
      }

      const filtered = maybeExcludeSource(projectFormats, options);
      if (filtered.length > 0) {
        return { formats: filtered, scope: 'project' };
      }
    }
  }

  const resolveGlobal =
    options.globalDirResolver ?? ((id: FormatId) => getAdapter(id).getGlobalDir());
  const globalFormats: FormatId[] = [];

  for (const id of FORMAT_IDS) {
    if (existsSafe(resolveGlobal(id))) {
      globalFormats.push(id);
    }
  }

  const filteredGlobal = maybeExcludeSource(globalFormats, options);
  if (filteredGlobal.length > 0) {
    return { formats: filteredGlobal, scope: 'global' };
  }

  return { formats: [], scope: 'none' };
}

function collectDirFiles(
  rootDir: string,
  subDir: string,
  out: SourceFile[],
): void {
  const startDir = path.join(rootDir, subDir);
  if (!isDirSafe(startDir)) {
    return;
  }

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) {
          continue;
        }
        walk(path.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        const abs = path.join(currentDir, entry.name);
        const rel = normalizePosixPath(path.relative(rootDir, abs));
        if (rel) {
          out.push({ path: rel, content: fs.readFileSync(abs) });
        }
      }
    }
  }

  walk(startDir);
}

/**
 * Check known top-level agent config folders and root rule files in `dir`
 * without recursively walking the whole workspace.
 */
export function detectLocalProjectSource(
  dir: string,
): { fetchResult: FetchResult; detections: DetectionResult[] } | null {
  const resolvedDir = path.resolve(dir);
  if (!isDirSafe(resolvedDir)) {
    return null;
  }

  const files: SourceFile[] = [];

  for (const configDir of KNOWN_CONFIG_DIRS) {
    collectDirFiles(resolvedDir, configDir, files);
  }

  let topEntries: fs.Dirent[] = [];
  try {
    topEntries = fs.readdirSync(resolvedDir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of topEntries) {
    if (!entry.isFile()) continue;
    if (KNOWN_ROOT_FILES.has(entry.name) || entry.name.endsWith('.mdc')) {
      const abs = path.join(resolvedDir, entry.name);
      files.push({
        path: entry.name,
        content: fs.readFileSync(abs),
      });
    }
  }

  if (files.length === 0) {
    return null;
  }

  const detections = detectFormats(files);
  if (detections.length === 0) {
    return null;
  }

  return {
    fetchResult: {
      source: {
        type: 'local',
        localPath: resolvedDir,
        displayLabel: path.basename(resolvedDir) || resolvedDir,
      },
      files,
    },
    detections,
  };
}
