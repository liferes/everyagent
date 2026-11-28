import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAdapter } from '../adapters/registry.js';
import { parseGitHubSource, type ParsedSource } from './fetcher.js';
import { normalizePosixPath, resolveWithin, type EmittedFile, type FormatId } from './ir.js';
import type { WriteSummary } from './writer.js';

export interface ManifestFileEntry {
  path: string;
  sha256: string;
}

export interface ManifestInstallEntry {
  source: string;
  ref: string | null;
  subpath: string | null;
  sourceFormat: FormatId;
  targetFormat: FormatId;
  global: boolean;
  targetDir: string | null;
  skills?: string[];
  includeRootRules?: boolean;
  includeSharedAssets?: boolean;
  includeConfigAssets?: boolean;
  installedAt: string;
  files: ManifestFileEntry[];
}

export interface EveryagentManifest {
  version: 1;
  installs: ManifestInstallEntry[];
}

export type FileDriftStatus = 'ok' | 'modified' | 'missing';

export interface FileDriftInfo {
  path: string;
  recordedSha256: string;
  diskSha256: string | null;
  status: FileDriftStatus;
}

export interface InstallDriftReport {
  installDir: string;
  files: FileDriftInfo[];
  modifiedCount: number;
  missingCount: number;
}

export function hashBuffer(buf: Buffer): string {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export function hashFile(filePath: string): string | null {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return null;
    }
    return hashBuffer(fs.readFileSync(filePath));
  } catch {
    return null;
  }
}

export function getManifestPath(options: {
  targetDir?: string;
  global?: boolean;
  homeDir?: string;
}): string {
  if (options.global) {
    const home = options.homeDir ?? os.homedir();
    return path.join(path.resolve(home), '.everyagent', 'manifest.json');
  }
  return path.join(
    path.resolve(options.targetDir ?? '.'),
    '.everyagent',
    'manifest.json',
  );
}

export function createEmptyManifest(): EveryagentManifest {
  return { version: 1, installs: [] };
}

export function readManifest(manifestPath: string): EveryagentManifest | null {
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  let raw: string;
  try {
    raw = fs.readFileSync(manifestPath, 'utf8');
  } catch (err) {
    throw new Error(
      `Failed to read manifest "${manifestPath}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Invalid JSON in manifest "${manifestPath}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as Record<string, unknown>).version !== 1 ||
    !Array.isArray((parsed as Record<string, unknown>).installs)
  ) {
    throw new Error(
      `Unsupported or malformed manifest "${manifestPath}". Expected version 1.`,
    );
  }

  return parsed as EveryagentManifest;
}

function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      if (obj[key] !== undefined) {
        sorted[key] = sortJsonKeys(obj[key]);
      }
    }
    return sorted;
  }
  return value;
}

function normalizeInstallEntry(entry: ManifestInstallEntry): ManifestInstallEntry {
  const files = entry.files
    .map((f) => ({
      path: normalizePosixPath(f.path),
      sha256: f.sha256,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  return {
    source: entry.source,
    ref: entry.ref ?? null,
    subpath: entry.subpath ?? null,
    sourceFormat: entry.sourceFormat,
    targetFormat: entry.targetFormat,
    global: Boolean(entry.global),
    targetDir: entry.global
      ? path.resolve(
          entry.targetDir ?? getAdapter(entry.targetFormat).getGlobalDir(),
        )
      : null,
    ...(entry.skills ? { skills: [...entry.skills] } : {}),
    ...(entry.includeRootRules !== undefined
      ? { includeRootRules: entry.includeRootRules }
      : {}),
    ...(entry.includeSharedAssets !== undefined
      ? { includeSharedAssets: entry.includeSharedAssets }
      : {}),
    ...(entry.includeConfigAssets !== undefined
      ? { includeConfigAssets: entry.includeConfigAssets }
      : {}),
    installedAt: entry.installedAt,
    files,
  };
}

export function writeManifest(
  manifestPath: string,
  manifest: EveryagentManifest,
): void {
  const installs = manifest.installs
    .map(normalizeInstallEntry)
    .sort(
      (a, b) =>
        a.source.localeCompare(b.source) ||
        (a.subpath ?? '').localeCompare(b.subpath ?? '') ||
        a.targetFormat.localeCompare(b.targetFormat) ||
        (a.targetDir ?? '').localeCompare(b.targetDir ?? ''),
    );

  const normalized: EveryagentManifest = {
    version: 1,
    installs,
  };

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  const tmpPath = `${manifestPath}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(
      tmpPath,
      `${JSON.stringify(sortJsonKeys(normalized), null, 2)}\n`,
      'utf8',
    );
    fs.renameSync(tmpPath, manifestPath);
  } catch (err) {
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      // ignore cleanup error
    }
    throw err;
  }
}

export function formatSourceForManifest(
  parsedSource: ParsedSource,
  targetDir: string,
  global: boolean,
): { source: string; ref: string | null; subpath: string | null } {
  if (parsedSource.type === 'github') {
    return {
      source: `${parsedSource.owner}/${parsedSource.repo}`,
      ref: parsedSource.ref ?? null,
      subpath: parsedSource.subpath ?? null,
    };
  }

  if (!global) {
    const rel = path.relative(path.resolve(targetDir), parsedSource.localPath);
    if (!path.isAbsolute(rel)) {
      return {
        source: rel === '' ? '.' : normalizePosixPath(rel),
        ref: null,
        subpath: null,
      };
    }
  }

  return {
    source: parsedSource.localPath,
    ref: null,
    subpath: null,
  };
}

export function getInstallDir(
  entry: ManifestInstallEntry,
  projectDir: string,
): string {
  if (entry.global) {
    return path.resolve(
      entry.targetDir ?? getAdapter(entry.targetFormat).getGlobalDir(),
    );
  }
  return path.resolve(projectDir);
}

export function resolveManifestSourceForFetch(
  entry: ManifestInstallEntry,
  projectDir: string,
): string {
  if (entry.ref !== null || entry.subpath !== null) {
    const ref = entry.ref ?? 'HEAD';
    if (entry.subpath) {
      return `${entry.source}/tree/${ref}/${entry.subpath}`;
    }
    return `${entry.source}/tree/${ref}`;
  }

  if (path.isAbsolute(entry.source)) {
    return entry.source;
  }

  if (
    entry.source === '.' ||
    entry.source.startsWith('./') ||
    entry.source.startsWith('../')
  ) {
    return path.resolve(projectDir, entry.source);
  }

  const candidateLocal = path.resolve(projectDir, entry.source);
  if (fs.existsSync(candidateLocal)) {
    return candidateLocal;
  }

  return entry.source;
}

export function upsertManifestInstall(
  manifest: EveryagentManifest,
  entry: ManifestInstallEntry,
): EveryagentManifest {
  const normalized = normalizeInstallEntry(entry);
  const filtered = manifest.installs.filter(
    (existing) =>
      !(
        existing.source === normalized.source &&
        (existing.subpath ?? null) === normalized.subpath &&
        existing.targetFormat === normalized.targetFormat &&
        Boolean(existing.global) === normalized.global &&
        (existing.targetDir ?? null) === normalized.targetDir
      ),
  );
  return {
    version: 1,
    installs: [...filtered, normalized],
  };
}

export function matchesInstallSource(
  entry: ManifestInstallEntry,
  query: string,
  projectDir: string,
): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();

  if (entry.source.toLowerCase() === lower) {
    return true;
  }

  const combined = entry.subpath
    ? `${entry.source}/${entry.subpath}`.toLowerCase()
    : '';
  if (combined && combined === lower) {
    return true;
  }

  if (path.basename(entry.source).toLowerCase() === lower) {
    return true;
  }

  try {
    const parsedQuery = parseGitHubSource(trimmed);
    if (parsedQuery.type === 'github') {
      const ghSlug = `${parsedQuery.owner}/${parsedQuery.repo}`.toLowerCase();
      if (entry.source.toLowerCase() === ghSlug) {
        if (!parsedQuery.subpath || entry.subpath === parsedQuery.subpath) {
          return true;
        }
      }
    } else {
      const resolvedEntry = path.resolve(
        projectDir,
        resolveManifestSourceForFetch(entry, projectDir),
      );
      if (resolvedEntry.toLowerCase() === parsedQuery.localPath.toLowerCase()) {
        return true;
      }
    }
  } catch {
    // Ignore parse errors for plain name queries.
  }

  const resolvedQuery = path.resolve(projectDir, trimmed).toLowerCase();
  const resolvedEntry = path
    .resolve(projectDir, resolveManifestSourceForFetch(entry, projectDir))
    .toLowerCase();
  return resolvedQuery === resolvedEntry;
}

export function inspectInstallDrift(
  entry: ManifestInstallEntry,
  projectDir: string,
): InstallDriftReport {
  const installDir = getInstallDir(entry, projectDir);
  const files: FileDriftInfo[] = [];
  let modifiedCount = 0;
  let missingCount = 0;

  for (const recorded of entry.files) {
    const rel = normalizePosixPath(recorded.path);
    const abs = resolveWithin(installDir, rel);
    const diskSha256 = hashFile(abs);
    let status: FileDriftStatus;
    if (diskSha256 === null) {
      status = 'missing';
      missingCount += 1;
    } else if (diskSha256 !== recorded.sha256) {
      status = 'modified';
      modifiedCount += 1;
    } else {
      status = 'ok';
    }
    files.push({
      path: rel,
      recordedSha256: recorded.sha256,
      diskSha256,
      status,
    });
  }

  return {
    installDir,
    files,
    modifiedCount,
    missingCount,
  };
}

export function recordManifestEntries(options: {
  targetDir: string;
  global: boolean;
  parsedSource: ParsedSource;
  sourceFormat: FormatId;
  selection?: {
    skillNames?: string[];
    includeRootRules?: boolean;
    includeSharedAssets?: boolean;
    includeConfigAssets?: boolean;
  };
  plannedTargets: Array<{
    targetFormat: FormatId;
    destination: string;
    files: EmittedFile[];
  }>;
  summary: WriteSummary;
}): void {
  const manifestPath = getManifestPath({
    targetDir: options.targetDir,
    global: options.global,
  });
  let manifest: EveryagentManifest;
  try {
    manifest = readManifest(manifestPath) ?? createEmptyManifest();
  } catch (err) {
    const backupPath = `${manifestPath}.corrupt`;
    try {
      if (fs.existsSync(manifestPath)) {
        fs.renameSync(manifestPath, backupPath);
      }
    } catch {
      // best effort backup
    }
    process.stderr.write(
      `Warning: ${err instanceof Error ? err.message : String(err)} Rebuilding manifest (backed up to ${backupPath}).\n`,
    );
    manifest = createEmptyManifest();
  }
  const formattedSource = formatSourceForManifest(
    options.parsedSource,
    options.targetDir,
    options.global,
  );

  const priorByTarget = new Map<
    FormatId,
    { installedAt: string; files: Map<string, string> }
  >();
  for (const existing of manifest.installs) {
    if (
      existing.source === formattedSource.source &&
      (existing.subpath ?? null) === formattedSource.subpath &&
      Boolean(existing.global) === options.global
    ) {
      priorByTarget.set(existing.targetFormat, {
        installedAt: existing.installedAt,
        files: new Map(
          existing.files.map((f) => [normalizePosixPath(f.path), f.sha256]),
        ),
      });
    }
  }

  const now = new Date().toISOString();
  for (const planned of options.plannedTargets) {
    const prior = priorByTarget.get(planned.targetFormat);
    const priorFiles = prior?.files ?? new Map<string, string>();
    const contentByRel = new Map<string, Buffer>();
    for (const file of planned.files) {
      contentByRel.set(normalizePosixPath(file.relativePath), file.content);
    }

    const files: ManifestFileEntry[] = [];
    for (const action of options.summary.actions) {
      if (action.targetFormat !== planned.targetFormat) continue;
      const rel = normalizePosixPath(action.relativePath);
      if (
        action.status === 'created' ||
        action.status === 'overwritten' ||
        action.status === 'unchanged' ||
        action.status === 'duplicate'
      ) {
        const content = contentByRel.get(rel);
        if (content) {
          files.push({ path: rel, sha256: hashBuffer(content) });
        }
      } else if (action.status === 'skipped') {
        const prevHash = priorFiles.get(rel);
        if (prevHash) {
          files.push({ path: rel, sha256: prevHash });
        }
      }
    }

    const sameAsPrior =
      prior !== undefined &&
      files.length === priorFiles.size &&
      files.every((f) => priorFiles.get(f.path) === f.sha256);

    manifest = upsertManifestInstall(manifest, {
      source: formattedSource.source,
      ref: formattedSource.ref,
      subpath: formattedSource.subpath,
      sourceFormat: options.sourceFormat,
      targetFormat: planned.targetFormat,
      global: options.global,
      targetDir: options.global ? path.resolve(planned.destination) : null,
      ...(options.selection?.skillNames
        ? { skills: options.selection.skillNames }
        : {}),
      ...(options.selection?.includeRootRules !== undefined
        ? { includeRootRules: options.selection.includeRootRules }
        : {}),
      ...(options.selection?.includeSharedAssets !== undefined
        ? { includeSharedAssets: options.selection.includeSharedAssets }
        : {}),
      ...(options.selection?.includeConfigAssets !== undefined
        ? { includeConfigAssets: options.selection.includeConfigAssets }
        : {}),
      installedAt: sameAsPrior ? prior.installedAt : now,
      files,
    });
  }

  writeManifest(manifestPath, manifest);
}
