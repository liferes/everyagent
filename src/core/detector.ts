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
const KNOWN_CONFIG_DIRS = [
  '.cursor',
  '.claude',
  '.opencode',
  '.codex',
  '.agents',
  '.agent',
  '.windsurf',
  '.cline',
  '.roo',
] as const;
const KNOWN_ROOT_FILES = new Set([
  '.cursorrules',
  'CLAUDE.md',
  'AGENTS.md',
  'GEMINI.md',
  '.windsurfrules',
  '.clinerules',
  '.roorules',
  'SKILL.md',
]);

type PathKind = 'any' | 'dir' | 'file';

/** A missing path and a path the OS refuses to stat are the same answer here: absent. */
function pathHasKind(targetPath: string, kind: PathKind = 'any'): boolean {
  let stats: fs.Stats;
  try {
    stats = fs.statSync(targetPath);
  } catch {
    return false;
  }
  if (kind === 'dir') return stats.isDirectory();
  if (kind === 'file') return stats.isFile();
  return true;
}

interface ProjectMarker {
  readonly segments: readonly string[];
  readonly kind: PathKind;
}

/**
 * What a project looks like on disk, per format. Order inside a format does not
 * matter; `FORMAT_IDS` sets the order formats are reported in.
 *
 * Single-name markers use `any` on purpose: Cline ships a directory-form
 * `.clinerules/`, and checking the exact kind would miss it.
 */
const PROJECT_MARKERS: Record<FormatId, readonly ProjectMarker[]> = {
  cursor: [
    { segments: ['.cursor'], kind: 'any' },
    { segments: ['.cursorrules'], kind: 'any' },
  ],
  claude: [
    { segments: ['.claude'], kind: 'any' },
    { segments: ['CLAUDE.md'], kind: 'any' },
  ],
  opencode: [{ segments: ['.opencode'], kind: 'any' }],
  codex: [{ segments: ['.codex'], kind: 'any' }],
  // `.agents/` only. GEMINI.md is shared with Gemini CLI, so on its own it
  // cannot say which tool the project belongs to.
  antigravity: [
    { segments: ['.agents'], kind: 'any' },
    { segments: ['.agent'], kind: 'any' },
  ],
  windsurf: [
    { segments: ['.windsurf'], kind: 'any' },
    { segments: ['.windsurfrules'], kind: 'any' },
  ],
  // Copilot shares `.github/` with workflows, so only these two paths count.
  copilot: [
    { segments: ['.github', 'skills'], kind: 'dir' },
    { segments: ['.github', 'copilot-instructions.md'], kind: 'file' },
  ],
  cline: [
    { segments: ['.cline'], kind: 'any' },
    { segments: ['.clinerules'], kind: 'any' },
  ],
  roo: [
    { segments: ['.roo'], kind: 'any' },
    { segments: ['.roorules'], kind: 'any' },
  ],
};

function hasProjectMarker(rootDir: string, format: FormatId): boolean {
  return PROJECT_MARKERS[format].some((marker) =>
    pathHasKind(path.join(rootDir, ...marker.segments), marker.kind),
  );
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
    if (pathHasKind(resolvedDir, 'dir')) {
      const projectFormats = FORMAT_IDS.filter((id) =>
        hasProjectMarker(resolvedDir, id),
      );

      const filtered = maybeExcludeSource(projectFormats, options);
      if (filtered.length > 0) {
        return { formats: filtered, scope: 'project' };
      }
    }
  }

  const resolveGlobal =
    options.globalDirResolver ?? ((id: FormatId) => getAdapter(id).getGlobalDir());
  const globalFormats = FORMAT_IDS.filter((id) =>
    pathHasKind(resolveGlobal(id)),
  );

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
  if (!pathHasKind(startDir, 'dir')) {
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
  if (!pathHasKind(resolvedDir, 'dir')) {
    return null;
  }

  const files: SourceFile[] = [];

  for (const configDir of KNOWN_CONFIG_DIRS) {
    collectDirFiles(resolvedDir, configDir, files);
  }

  collectDirFiles(resolvedDir, path.join('.github', 'skills'), files);
  const copilotInstructionsPath = path.join(
    resolvedDir,
    '.github',
    'copilot-instructions.md',
  );
  if (pathHasKind(copilotInstructionsPath, 'file')) {
    files.push({
      path: '.github/copilot-instructions.md',
      content: fs.readFileSync(copilotInstructionsPath),
    });
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
