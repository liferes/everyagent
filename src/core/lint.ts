import path from 'node:path';
import { getAdapter } from '../adapters/registry.js';
import {
  parseMarkdownWithFrontmatter,
  type ParseOptions,
} from '../adapters/types.js';
import {
  FORMAT_META,
  normalizePosixPath,
  type FormatId,
  type SourceFile,
} from './ir.js';

export interface LintFinding {
  severity: 'error' | 'warning';
  rule: string;
  file: string;
  message: string;
}

const MAX_DESCRIPTION_LEN: Record<FormatId, number> = {
  cursor: 500,
  claude: 1024,
  opencode: 1024,
  codex: 1024,
  antigravity: 1024,
  windsurf: 1024,
  copilot: 1024,
  cline: 1024,
  roo: 1024,
};

const VALID_SKILL_NAME_RE = /^[a-z0-9][a-z0-9._-]*$/;

function extractMarkdownLinks(body: string): string[] {
  const links: string[] = [];
  const re = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const raw = match[1].trim().replace(/^<|>$/g, '');
    const target = raw.split(/\s+/)[0];
    if (!target) continue;
    if (
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target) ||
      target.startsWith('#') ||
      target.startsWith('//')
    ) {
      continue;
    }
    const clean = target.split('#')[0].split('?')[0];
    if (clean) {
      links.push(clean);
    }
  }
  return links;
}

/** Lint skill/rule files for frontmatter, duplicates, naming, description length, and relative links. */
export function lintSourceFiles(
  files: SourceFile[],
  format: FormatId,
  options?: ParseOptions,
): LintFinding[] {
  const findings: LintFinding[] = [];
  const filePathSet = new Set(files.map((f) => normalizePosixPath(f.path)));
  const meta = FORMAT_META[format];

  // Check raw frontmatter parsing on entry files before adapter.parse throws.
  const entryFiles: SourceFile[] = [];
  for (const file of files) {
    const p = normalizePosixPath(file.path);
    const isEntry =
      format === 'cursor'
        ? p.endsWith('.mdc') &&
          (p.startsWith('.cursor/rules/') || Boolean(options?.allowLoose))
        : format === 'copilot' && !options?.allowLoose
          ? p.startsWith('.github/skills/') && p.endsWith('/SKILL.md')
          : p === 'SKILL.md' || p.endsWith('/SKILL.md');
    if (isEntry) {
      entryFiles.push(file);
    }
  }

  const seenNames = new Map<string, string>();
  const validFiles: SourceFile[] = [];

  for (const file of files) {
    if (!entryFiles.includes(file)) {
      validFiles.push(file);
      continue;
    }
    try {
      const parsed = parseMarkdownWithFrontmatter(file.content.toString('utf8'));
      const rawName = parsed.data.name;
      const p = normalizePosixPath(file.path);
      const fallbackName =
        format === 'cursor'
          ? path.posix.basename(p, '.mdc')
          : path.posix.basename(path.posix.dirname(p)) || 'skill';
      const resolvedName =
        typeof rawName === 'string' && rawName.trim()
          ? rawName.trim()
          : fallbackName;

      if (format !== 'cursor' && (!rawName || typeof rawName !== 'string' || !rawName.trim())) {
        findings.push({
          severity: 'error',
          rule: 'missing-name',
          file: p,
          message: 'SKILL.md frontmatter is missing a non-empty `name` field.',
        });
      } else if (!VALID_SKILL_NAME_RE.test(resolvedName)) {
        findings.push({
          severity: 'warning',
          rule: 'invalid-name',
          file: p,
          message: `Skill name "${resolvedName}" should use lowercase letters, digits, hyphens, dots, or underscores.`,
        });
      }

      const lowerKey = resolvedName.toLowerCase();
      const firstFile = seenNames.get(lowerKey);
      if (firstFile) {
        findings.push({
          severity: 'error',
          rule: 'duplicate-name',
          file: p,
          message: `Duplicate skill name "${resolvedName}" (already defined in ${firstFile}).`,
        });
      } else {
        seenNames.set(lowerKey, p);
      }

      const desc = parsed.data.description;
      if (typeof desc !== 'string' || !desc.trim()) {
        findings.push({
          severity: 'warning',
          rule: 'missing-description',
          file: p,
          message: 'Frontmatter is missing a `description` field.',
        });
      } else if (desc.trim().length > MAX_DESCRIPTION_LEN[format]) {
        findings.push({
          severity: 'warning',
          rule: 'description-length',
          file: p,
          message: `Description is ${desc.trim().length} characters (recommended max for ${meta.label} is ${MAX_DESCRIPTION_LEN[format]}).`,
        });
      }

      const dir = path.posix.dirname(p);
      for (const relLink of extractMarkdownLinks(parsed.body)) {
        const resolved =
          relLink.startsWith('/')
            ? normalizePosixPath(relLink)
            : normalizePosixPath(path.posix.join(dir === '.' ? '' : dir, relLink));
        if (!resolved) continue;
        const asPrefix = `${resolved}/`;
        const exists =
          filePathSet.has(resolved) ||
          filePathSet.has(normalizePosixPath(relLink)) ||
          Array.from(filePathSet).some((fp) => fp.startsWith(asPrefix));
        if (!exists) {
          findings.push({
            severity: 'warning',
            rule: 'broken-link',
            file: p,
            message: `Relative link target "${relLink}" was not found in the source package.`,
          });
        }
      }

      validFiles.push(file);
    } catch (err) {
      findings.push({
        severity: 'error',
        rule: 'invalid-frontmatter',
        file: normalizePosixPath(file.path),
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Also ensure the adapter can parse valid files cleanly without errors.
  try {
    getAdapter(format).parse(validFiles, options);
  } catch (err) {
    findings.push({
      severity: 'error',
      rule: 'parse-error',
      file: meta.configDir,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return findings;
}
