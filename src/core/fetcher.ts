import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { normalizePosixPath, type SourceFile } from './ir.js';

export type ParsedSource =
  | {
      type: 'github';
      owner: string;
      repo: string;
      ref?: string;
      subpath?: string;
      fileFilter?: string;
      displayLabel: string;
    }
  | {
      type: 'local';
      localPath: string;
      displayLabel: string;
    };

export interface FetchResult {
  source: ParsedSource;
  files: SourceFile[];
  subpathName?: string;
}

const VALID_SEGMENT_RE = /^[A-Za-z0-9_.-]+$/;
const IGNORED_LOCAL_DIRS = new Set(['.git', 'node_modules', 'dist']);

/** Parse a GitHub URL, `owner/repo`, `owner/repo/tree/<ref>/<subpath>`, or local directory path. */
export function parseGitHubSource(rawInput: string): ParsedSource {
  const input = rawInput.trim();
  if (!input) {
    throw new Error('Source repository or path cannot be empty.');
  }

  // A real folder wins over GitHub parsing: it exists, so read it.
  if (fs.existsSync(input)) {
    const stat = fs.statSync(input);
    if (stat.isDirectory()) {
      const resolved = path.resolve(input);
      return {
        type: 'local',
        localPath: resolved,
        displayLabel: path.basename(resolved) || resolved,
      };
    }
  }

  let normalized = input.replace(/^git\s+clone\s+/i, '').trim();

  // Strip markdown link syntax if accidentally pasted as [url](url)
  const mdLinkMatch = normalized.match(/^\[[^\]]+\]\((https?:\/\/[^)]+)\)$/);
  if (mdLinkMatch) {
    normalized = mdLinkMatch[1];
  }

  // Strip query parameters or hash fragments from pasted browser URLs
  normalized = normalized.replace(/[?#].*$/, '');

  // Support SSH clone URLs: git@github.com:owner/repo(.git) or ssh://git@github.com/owner/repo(.git)
  const scpSshMatch = normalized.match(/^git@github\.com:(.+)$/i);
  if (scpSshMatch) {
    normalized = scpSshMatch[1];
  } else if (/^ssh:\/\/git@github\.com\//i.test(normalized)) {
    normalized = normalized.replace(/^ssh:\/\/git@github\.com\//i, '');
  } else if (/^https?:\/\//i.test(normalized)) {
    let url: URL;
    try {
      url = new URL(normalized);
    } catch {
      throw new Error(`Invalid GitHub URL: "${input}"`);
    }
    if (/^raw\.githubusercontent\.com$/i.test(url.hostname)) {
      const rawSegments = url.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
      if (rawSegments.length < 4) {
        throw new Error(`Invalid raw GitHub URL: "${input}"`);
      }
      const [rawOwner, rawRepo, ...rest] = rawSegments;
      const trimmedRest =
        rest[0] === 'refs' && (rest[1] === 'heads' || rest[1] === 'tags') && rest.length >= 4
          ? rest.slice(2)
          : rest;
      normalized = [rawOwner, rawRepo, 'blob', ...trimmedRest].join('/');
    } else if (/^(?:www\.)?github\.com$/i.test(url.hostname)) {
      normalized = url.pathname.replace(/^\/+/, '');
    } else {
      throw new Error(`Only github.com repositories are supported (got "${url.hostname}").`);
    }
  } else if (/^(?:www\.)?github\.com\//i.test(normalized)) {
    normalized = normalized.replace(/^(?:www\.)?github\.com\//i, '');
  }

  normalized = normalized.replace(/\/+$/, '');
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length < 2) {
    throw new Error(
      `Invalid GitHub source "${input}". Expected "owner/repo", a GitHub URL, or a local directory.`,
    );
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, '');

  if (
    !VALID_SEGMENT_RE.test(owner) ||
    !VALID_SEGMENT_RE.test(repo) ||
    owner === '.' ||
    owner === '..' ||
    repo === '.' ||
    repo === '..'
  ) {
    throw new Error(`Invalid GitHub owner/repo in "${input}".`);
  }

  let ref: string | undefined;
  let subpath: string | undefined;
  let fileFilter: string | undefined;

  if (segments.length > 2) {
    if (segments[2] === 'tree' && segments.length >= 4) {
      ref = segments[3];
      if (segments.length > 4) {
        subpath = segments.slice(4).join('/');
      }
    } else if (segments[2] === 'blob' && segments.length >= 5) {
      ref = segments[3];
      const fileSegments = segments.slice(4);
      const fileName = fileSegments[fileSegments.length - 1];
      const parentDir = fileSegments.slice(0, -1).join('/') || undefined;
      const lowerFile = fileName.toLowerCase();

      if (lowerFile === 'skill.md') {
        // Step up to the skill folder so scripts, references, and assets travel with it.
        subpath = parentDir;
      } else if (
        lowerFile.endsWith('.mdc') ||
        lowerFile === 'claude.md' ||
        lowerFile === 'agents.md' ||
        lowerFile === 'gemini.md' ||
        lowerFile === '.cursorrules'
      ) {
        subpath = parentDir;
        fileFilter = fileName;
      } else {
        subpath = parentDir;
      }
    } else {
      throw new Error(
        `Unsupported GitHub path "${input}". Expected "owner/repo" or "owner/repo/tree/<branch>/<subpath>".`,
      );
    }
  }

  const displayPath = [subpath, fileFilter].filter(Boolean).join('/');
  const displayLabel = displayPath
    ? `${owner}/${repo}/${displayPath}`
    : ref
      ? `${owner}/${repo}@${ref}`
      : `${owner}/${repo}`;

  return {
    type: 'github',
    owner,
    repo,
    ref,
    subpath,
    ...(fileFilter ? { fileFilter } : {}),
    displayLabel,
  };
}

function readTarString(buf: Buffer, start: number, length: number): string {
  const slice = buf.subarray(start, start + length);
  const nulIdx = slice.indexOf(0);
  const end = nulIdx === -1 ? slice.length : nulIdx;
  return slice.subarray(0, end).toString('utf8');
}

function readTarSize(buf: Buffer, start: number, length: number): number {
  const slice = buf.subarray(start, start + length);
  if ((slice[0] & 0x80) !== 0) {
    // Base-256 (GNU/POSIX) size encoding
    let value = 0;
    for (let i = 1; i < slice.length; i++) {
      value = value * 256 + slice[i];
    }
    return value;
  }
  const raw = readTarString(buf, start, length).trim();
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 8);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePaxHeaders(data: Buffer): Record<string, string> {
  const headers: Record<string, string> = {};
  const text = data.toString('utf8');
  let cursor = 0;
  while (cursor < text.length) {
    const spaceIdx = text.indexOf(' ', cursor);
    if (spaceIdx === -1) break;
    const len = Number.parseInt(text.slice(cursor, spaceIdx), 10);
    if (!Number.isFinite(len) || len <= 0) break;
    const record = text.slice(spaceIdx + 1, cursor + len).replace(/\n$/, '');
    const eqIdx = record.indexOf('=');
    if (eqIdx !== -1) {
      headers[record.slice(0, eqIdx)] = record.slice(eqIdx + 1);
    }
    cursor += len;
  }
  return headers;
}

function isSafeRelativePath(posixPath: string): boolean {
  if (!posixPath || posixPath.startsWith('/')) {
    return false;
  }
  const parts = posixPath.split('/');
  return !parts.some((part) => part === '..' || part === '');
}

/**
 * Untar in memory. Drops the `owner-repo-sha/` wrapper, and when `subpath` is
 * given keeps only files underneath it.
 */
export function extractTarGz(
  gzipBuffer: Buffer,
  subpath?: string,
  fileFilter?: string,
): SourceFile[] {
  const tarBuffer = zlib.gunzipSync(gzipBuffer);
  const normalizedSubpath = subpath ? normalizePosixPath(subpath) : '';
  const normalizedFilter = fileFilter ? normalizePosixPath(fileFilter) : '';
  const files: SourceFile[] = [];

  let offset = 0;
  let nextLongName: string | undefined;
  let nextPaxPath: string | undefined;

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);
    offset += 512;

    // Two or more zero blocks mark end of archive
    if (header.every((b) => b === 0)) {
      break;
    }

    const name = readTarString(header, 0, 100);
    const size = readTarSize(header, 124, 12);
    const typeFlag = String.fromCharCode(header[156] || 0);
    const prefix = readTarString(header, 345, 155);

    const paddedSize = Math.ceil(size / 512) * 512;
    const dataEnd = Math.min(offset + size, tarBuffer.length);
    const content = Buffer.from(tarBuffer.subarray(offset, dataEnd));
    offset += paddedSize;

    if (typeFlag === 'L') {
      // GNU tar LongName for the following entry
      nextLongName = content.toString('utf8').replace(/\0+$/, '');
      continue;
    }

    if (typeFlag === 'x') {
      // PAX extended header for the following entry
      const pax = parsePaxHeaders(content);
      if (pax.path) {
        nextPaxPath = pax.path;
      }
      continue;
    }

    if (typeFlag === 'g') {
      // Global PAX header (e.g., GitHub archive `pax_global_header` commit hash)
      continue;
    }

    let rawEntryPath = nextPaxPath ?? nextLongName ?? (prefix ? `${prefix}/${name}` : name);
    nextLongName = undefined;
    nextPaxPath = undefined;

    // Only extract regular files ('0', '\0')
    if (typeFlag !== '0' && typeFlag !== '\0') {
      continue;
    }

    rawEntryPath = rawEntryPath.replace(/\\/g, '/').replace(/^\.\//, '');
    // Strip GitHub tarball's top-level directory (`owner-repo-sha/...`)
    const firstSlash = rawEntryPath.indexOf('/');
    if (firstSlash === -1) {
      continue;
    }
    let relPath = normalizePosixPath(rawEntryPath.slice(firstSlash + 1));
    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }

    if (normalizedSubpath) {
      const subPrefix = `${normalizedSubpath}/`;
      if (relPath.startsWith(subPrefix)) {
        relPath = relPath.slice(subPrefix.length);
      } else {
        continue;
      }
    }

    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }

    if (normalizedFilter) {
      if (normalizedFilter.toLowerCase().endsWith('.mdc')) {
        const stem = normalizedFilter.slice(0, -'.mdc'.length);
        if (relPath !== normalizedFilter && !relPath.startsWith(`${stem}/`)) {
          continue;
        }
      } else if (relPath !== normalizedFilter) {
        continue;
      }
    }

    files.push({ path: relPath, content });
  }

  return files;
}

function readLocalDirectory(rootDir: string): SourceFile[] {
  const files: SourceFile[] = [];

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_LOCAL_DIRS.has(entry.name)) {
          continue;
        }
        walk(path.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        const abs = path.join(currentDir, entry.name);
        const rel = normalizePosixPath(path.relative(rootDir, abs));
        if (rel) {
          files.push({
            path: rel,
            content: fs.readFileSync(abs),
          });
        }
      }
    }
  }

  walk(rootDir);
  return files;
}

async function downloadGitHubTarball(
  owner: string,
  repo: string,
  ref?: string,
): Promise<Buffer> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers: Record<string, string> = {
    'User-Agent': 'everyagent-cli',
    Accept: 'application/vnd.github+json',
  };

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tarball${ref ? `/${encodeURIComponent(ref)}` : ''}`;
  const codeloadUrl = `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tar.gz/${encodeURIComponent(ref ?? 'HEAD')}`;

  const urls = token
    ? [apiUrl, codeloadUrl]
    : [codeloadUrl, apiUrl];

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let lastStatus = 0;
  let lastError: string | undefined;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: url.startsWith('https://api.github.com')
          ? headers
          : { 'User-Agent': 'everyagent-cli' },
        redirect: 'follow',
      });

      if (response.ok) {
        const arr = await response.arrayBuffer();
        return Buffer.from(arr);
      }

      lastStatus = response.status;
      lastError = `${response.status} ${response.statusText}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  if (lastStatus === 404) {
    throw new Error(
      `Repository or branch not found on GitHub: "${owner}/${repo}"${ref ? ` (ref: ${ref})` : ''}.`,
    );
  }

  throw new Error(
    `Failed to fetch "${owner}/${repo}" from GitHub${lastError ? ` (${lastError})` : ''}.`,
  );
}

/** Local folder or GitHub tarball. No git binary involved. */
export async function fetchSource(input: string): Promise<FetchResult> {
  const source = parseGitHubSource(input);

  if (source.type === 'local') {
    const files = readLocalDirectory(source.localPath);
    if (files.length === 0) {
      throw new Error(`No files found in local directory "${source.localPath}".`);
    }
    return { source, files };
  }

  const tarball = await downloadGitHubTarball(
    source.owner,
    source.repo,
    source.ref,
  );
  const files = extractTarGz(tarball, source.subpath, source.fileFilter);

  if (files.length === 0) {
    if (source.subpath) {
      throw new Error(
        `No files found at subpath "${source.subpath}" in "${source.owner}/${source.repo}".`,
      );
    }
    throw new Error(`Repository "${source.owner}/${source.repo}" appears to be empty.`);
  }

  const subpathName = source.subpath
    ? path.posix.basename(normalizePosixPath(source.subpath))
    : undefined;

  return {
    source,
    files,
    subpathName,
  };
}
