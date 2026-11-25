import fs from 'node:fs';
import path from 'node:path';
import { normalizePosixPath, resolveWithin, isConfigAssetPath, type EmittedFile } from './ir.js';
import {
  getInstallDir,
  hashBuffer,
  hashFile,
  matchesInstallSource,
  type ManifestFileEntry,
  type ManifestInstallEntry,
  type EveryagentManifest,
} from './manifest.js';

/**
 * Manifests written before 1.2.0 copied settings and hooks by default and had
 * no flag saying so. Fall back to the recorded file list, otherwise a plain
 * `sync` from an older install would delete the config files it once placed.
 */
export function entryKeepsConfigAssets(entry: ManifestInstallEntry): boolean {
  if (entry.includeConfigAssets !== undefined) {
    return entry.includeConfigAssets;
  }
  return entry.files.some((file) => {
    const normalized = normalizePosixPath(file.path);
    if (isConfigAssetPath(normalized)) {
      return true;
    }
    const withoutConfigDir = normalized.split('/').slice(1).join('/');
    return withoutConfigDir !== '' && isConfigAssetPath(withoutConfigDir);
  });
}

export type SyncActionKind =
  | 'create'
  | 'update'
  | 'delete'
  | 'unchanged'
  | 'keep-local'
  | 'keep-missing'
  | 'untracked';

export interface SyncAction {
  kind: SyncActionKind;
  relativePath: string;
  absolutePath: string;
  content?: Buffer;
  recordedHash?: string;
  diskHash: string | null;
  newHash?: string;
}

export interface SyncEntryPlan {
  entry: ManifestInstallEntry;
  installDir: string;
  actions: SyncAction[];
  nextFiles: ManifestFileEntry[];
  hasDrift: boolean;
}

export interface RemovePlan {
  matchedEntries: ManifestInstallEntry[];
  deletedPaths: string[];
  refusedPaths: string[];
  alreadyMissingPaths: string[];
  nextManifest: EveryagentManifest;
  privateTargets: Array<{ absolutePath: string; installDir: string }>;
}

/** Pure sync planner comparing manifest records, freshly emitted files, and disk hashes. */
export function planSyncForEntry(
  entry: ManifestInstallEntry,
  emittedFiles: EmittedFile[],
  diskHashes: ReadonlyMap<string, string | null>,
  installDir: string,
): SyncEntryPlan {
  const resolvedRoot = path.resolve(installDir);
  const recordedByPath = new Map<string, string>();
  for (const f of entry.files) {
    recordedByPath.set(normalizePosixPath(f.path), f.sha256);
  }

  const emittedByPath = new Map<string, EmittedFile>();
  for (const f of emittedFiles) {
    const rel = normalizePosixPath(f.relativePath);
    if (!emittedByPath.has(rel)) {
      emittedByPath.set(rel, f);
    }
  }

  const allPaths = Array.from(
    new Set([...recordedByPath.keys(), ...emittedByPath.keys()]),
  ).sort((a, b) => a.localeCompare(b));

  const actions: SyncAction[] = [];
  const nextFiles: ManifestFileEntry[] = [];
  let hasDrift = false;

  for (const rel of allPaths) {
    const absolutePath = resolveWithin(resolvedRoot, rel);
    const recordedHash = recordedByPath.get(rel);
    const emitted = emittedByPath.get(rel);
    const diskHash = diskHashes.has(rel)
      ? (diskHashes.get(rel) ?? null)
      : hashFile(absolutePath);

    if (emitted) {
      const newHash = hashBuffer(emitted.content);

      if (recordedHash !== undefined) {
        if (diskHash === null) {
          actions.push({
            kind: 'keep-missing',
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: recordedHash });
          hasDrift = true;
        } else if (diskHash === newHash) {
          actions.push({
            kind: 'unchanged',
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: newHash });
        } else if (diskHash === recordedHash) {
          actions.push({
            kind: 'update',
            relativePath: rel,
            absolutePath,
            content: emitted.content,
            recordedHash,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: newHash });
          hasDrift = true;
        } else {
          actions.push({
            kind: 'keep-local',
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: recordedHash });
          hasDrift = true;
        }
      } else {
        if (diskHash === null) {
          actions.push({
            kind: 'create',
            relativePath: rel,
            absolutePath,
            content: emitted.content,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: newHash });
          hasDrift = true;
        } else if (diskHash === newHash) {
          actions.push({
            kind: 'unchanged',
            relativePath: rel,
            absolutePath,
            diskHash,
            newHash,
          });
          nextFiles.push({ path: rel, sha256: newHash });
        } else {
          actions.push({
            kind: 'untracked',
            relativePath: rel,
            absolutePath,
            diskHash,
            newHash,
          });
        }
      }
    } else if (recordedHash !== undefined) {
      if (diskHash === null) {
        actions.push({
          kind: 'keep-missing',
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash,
        });
        hasDrift = true;
      } else if (diskHash === recordedHash) {
        actions.push({
          kind: 'delete',
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash,
        });
        hasDrift = true;
      } else {
        actions.push({
          kind: 'keep-local',
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash,
        });
        nextFiles.push({ path: rel, sha256: recordedHash });
        hasDrift = true;
      }
    }
  }

  return {
    entry,
    installDir: resolvedRoot,
    actions,
    nextFiles,
    hasDrift,
  };
}

function pruneEmptyParentDirs(filePath: string, stopDir: string): void {
  const resolvedStop = path.resolve(stopDir);
  let current = path.dirname(path.resolve(filePath));

  while (
    current !== resolvedStop &&
    current.startsWith(resolvedStop + path.sep)
  ) {
    try {
      const entries = fs.readdirSync(current);
      if (entries.length > 0) {
        break;
      }
      fs.rmdirSync(current);
      current = path.dirname(current);
    } catch {
      break;
    }
  }
}

export function applySyncPlan(
  plan: SyncEntryPlan,
  options: { dryRun?: boolean } = {},
): void {
  if (options.dryRun) {
    return;
  }

  for (const action of plan.actions) {
    if (
      (action.kind === 'create' || action.kind === 'update') &&
      action.content
    ) {
      fs.mkdirSync(path.dirname(action.absolutePath), { recursive: true });
      fs.writeFileSync(action.absolutePath, action.content);
    } else if (action.kind === 'delete') {
      if (fs.existsSync(action.absolutePath)) {
        fs.unlinkSync(action.absolutePath);
        pruneEmptyParentDirs(action.absolutePath, plan.installDir);
      }
    }
  }
}

export function planRemove(
  manifest: EveryagentManifest,
  selector: { source?: string; all?: boolean },
  projectDir: string,
): RemovePlan {
  const matchedEntries = selector.all
    ? [...manifest.installs]
    : manifest.installs.filter((entry) =>
        matchesInstallSource(entry, selector.source ?? '', projectDir),
      );

  const matchedSet = new Set(matchedEntries);
  const deletedPaths: string[] = [];
  const refusedPaths: string[] = [];
  const alreadyMissingPaths: string[] = [];
  const privateTargets: Array<{ absolutePath: string; installDir: string }> = [];
  const nextInstalls: ManifestInstallEntry[] = [];

  for (const entry of manifest.installs) {
    if (!matchedSet.has(entry)) {
      nextInstalls.push(entry);
      continue;
    }

    const installDir = getInstallDir(entry, projectDir);
    const remainingFiles: ManifestFileEntry[] = [];

    for (const file of entry.files) {
      const rel = normalizePosixPath(file.path);
      const abs = resolveWithin(installDir, rel);
      const diskHash = hashFile(abs);
      const display = entry.global ? abs : rel;

      if (diskHash === null) {
        alreadyMissingPaths.push(display);
      } else if (diskHash === file.sha256) {
        deletedPaths.push(display);
        privateTargets.push({ absolutePath: abs, installDir });
      } else {
        refusedPaths.push(display);
        remainingFiles.push(file);
      }
    }

    if (remainingFiles.length > 0) {
      nextInstalls.push({
        ...entry,
        files: remainingFiles,
      });
    }
  }

  return {
    matchedEntries,
    deletedPaths,
    refusedPaths,
    alreadyMissingPaths,
    nextManifest: {
      version: 1,
      installs: nextInstalls,
    },
    privateTargets,
  };
}

export function applyRemovePlan(
  plan: RemovePlan,
  options: { dryRun?: boolean } = {},
): void {
  if (options.dryRun) {
    return;
  }

  for (const target of plan.privateTargets) {
    if (fs.existsSync(target.absolutePath)) {
      fs.unlinkSync(target.absolutePath);
      pruneEmptyParentDirs(target.absolutePath, target.installDir);
    }
  }
}
