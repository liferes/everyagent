import path from 'node:path';

export const FORMAT_IDS = ['cursor', 'claude', 'opencode', 'codex', 'antigravity'] as const;

export type FormatId = (typeof FORMAT_IDS)[number];

export interface FormatMeta {
  id: FormatId;
  label: string;
  configDir: string;
  rootRuleFile: string;
}

export const FORMAT_META: Record<FormatId, FormatMeta> = {
  cursor: {
    id: 'cursor',
    label: 'Cursor (.cursor/)',
    configDir: '.cursor',
    rootRuleFile: '.cursorrules',
  },
  claude: {
    id: 'claude',
    label: 'Claude Code (.claude/)',
    configDir: '.claude',
    rootRuleFile: 'CLAUDE.md',
  },
  opencode: {
    id: 'opencode',
    label: 'OpenCode (.opencode/)',
    configDir: '.opencode',
    rootRuleFile: 'AGENTS.md',
  },
  codex: {
    id: 'codex',
    label: 'Codex CLI (.codex/)',
    configDir: '.codex',
    rootRuleFile: 'AGENTS.md',
  },
  antigravity: {
    id: 'antigravity',
    label: 'Antigravity (.agents/)',
    configDir: '.agents',
    rootRuleFile: 'GEMINI.md',
  },
};

export interface SourceFile {
  /** POSIX-normalized path relative to the fetched source root. */
  path: string;
  content: Buffer;
}

export interface Asset {
  relativePath: string;
  content: Buffer;
  isText: boolean;
}

export interface Skill {
  name: string;
  description: string;
  body: string;
  globs?: string[];
  alwaysApply?: boolean;
  allowedTools?: string | string[];
  assets: Asset[];
  extraFrontmatter?: Record<string, unknown>;
}

export interface RootRule {
  sourceFilename: string;
  content: string;
}

export interface EveryagentPackage {
  sourceFormat: FormatId;
  sourceLabel: string;
  skills: Skill[];
  rootRules: RootRule[];
  sharedAssets: Asset[];
}

export interface EmittedFile {
  relativePath: string;
  content: Buffer;
  targetFormat: FormatId;
}

const TEXT_EXTENSIONS = new Set([
  '.md',
  '.mdc',
  '.txt',
  '.sh',
  '.bash',
  '.zsh',
  '.fish',
  '.ps1',
  '.bat',
  '.cmd',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.json',
  '.jsonc',
  '.yaml',
  '.yml',
  '.toml',
  '.ini',
  '.cfg',
  '.conf',
  '.py',
  '.rb',
  '.go',
  '.rs',
  '.java',
  '.kt',
  '.swift',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.cs',
  '.php',
  '.sql',
  '.css',
  '.scss',
  '.less',
  '.html',
  '.htm',
  '.xml',
  '.svg',
  '.env',
  '.gitignore',
  '.dockerignore',
]);

/** Forward slashes, no leading or trailing slash. */
export function normalizePosixPath(inputPath: string): string {
  return inputPath
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^(?:\.\/)+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

/** Resolve `relativePath` under `root` and refuse anything that lands outside it. */
export function resolveWithin(root: string, relativePath: string): string {
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, relativePath);
  if (target !== resolvedRoot && !target.startsWith(resolvedRoot + path.sep)) {
    throw new Error(
      `Refusing path outside the install directory: "${relativePath}".`,
    );
  }
  return target;
}

const CONFIG_ASSET_FILES = new Set([
  'settings.json',
  'settings.local.json',
  'mcp.json',
  '.mcp.json',
]);

/**
 * Settings, hooks, and MCP files are tool-specific and can hold secrets, so
 * they are left out unless `--with-config` asks for them.
 */
export function isConfigAssetPath(relativePath: string): boolean {
  const p = normalizePosixPath(relativePath).replace(/^\.\//, '');
  return CONFIG_ASSET_FILES.has(p) || p.startsWith('hooks/');
}

/** Extension first, then a NUL-byte sniff for the rest. */
export function isTextFile(filePath: string, content: Buffer): boolean {
  const normalized = normalizePosixPath(filePath).toLowerCase();
  const lastDot = normalized.lastIndexOf('.');
  if (lastDot !== -1) {
    const ext = normalized.slice(lastDot);
    if (TEXT_EXTENSIONS.has(ext)) {
      return true;
    }
  }
  const sampleLen = Math.min(content.length, 8192);
  for (let i = 0; i < sampleLen; i++) {
    if (content[i] === 0) {
      return false;
    }
  }
  return true;
}
