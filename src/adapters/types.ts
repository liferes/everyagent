import matter from 'gray-matter';
import {
  FORMAT_META,
  isTextFile,
  normalizePosixPath,
  type Asset,
  type EmittedFile,
  type FormatId,
  type RootRule,
  type Skill,
  type SourceFile,
  type EveryagentPackage,
} from '../core/ir.js';
import { formatSkillDescriptionForSkillMd } from '../core/rewriter.js';

export interface DetectionResult {
  format: FormatId;
  label: string;
  skillCount: number;
  hasRootRule: boolean;
  summary: string;
  matchedPaths: string[];
  allowLoose?: boolean;
}

/**
 * True when the only evidence for a format is its root rule file: no skills,
 * no config folder. Those detections say the file exists, not that the project
 * belongs to that tool, so they lose to any detection that found real content.
 */
export function isRootRuleOnly(detection: DetectionResult): boolean {
  return (
    detection.skillCount === 0 &&
    detection.matchedPaths.length === 1 &&
    detection.matchedPaths[0] === FORMAT_META[detection.format].rootRuleFile
  );
}

export interface EmitOptions {
  global?: boolean;
}

export interface ParseOptions {
  subpathName?: string;
  allowLoose?: boolean;
}

export interface Adapter {
  readonly id: FormatId;
  readonly label: string;
  readonly configDir: string;
  readonly rootRuleFile: string;
  getGlobalDir(): string;
  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null;
  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage;
  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[];
}

export interface ParsedMarkdown {
  data: Record<string, unknown>;
  body: string;
}

/** Frontmatter and body, with the leading blank line dropped. */
export function parseMarkdownWithFrontmatter(raw: string): ParsedMarkdown {
  const parsed = matter(raw);
  return {
    data: { ...(parsed.data as Record<string, unknown>) },
    body: parsed.content.replace(/^\r?\n/, ''),
  };
}

/** Body plus frontmatter; undefined keys are skipped. */
export function serializeMarkdownWithFrontmatter(
  body: string,
  frontmatter: Record<string, unknown>,
): Buffer {
  const cleanData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }

  const normalizedBody = body.replace(/\r\n/g, '\n').replace(/^\n+/, '');
  const withTrailingNewline =
    normalizedBody.length === 0
      ? ''
      : normalizedBody.endsWith('\n')
        ? normalizedBody
        : `${normalizedBody}\n`;

  if (Object.keys(cleanData).length === 0) {
    return Buffer.from(withTrailingNewline, 'utf8');
  }

  // An object carries the body through untouched; a bare string gets parsed
  // as frontmatter again when it starts with `---`, which mangles the data.
  const output = matter.stringify({ content: withTrailingNewline }, cleanData);
  const ensured = output.endsWith('\n') ? output : `${output}\n`;
  return Buffer.from(ensured, 'utf8');
}

/** Cursor writes globs as a list, a comma string, or one plain string. */
export function normalizeGlobs(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => String(item).trim())
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  if (typeof value === 'string') {
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  return undefined;
}

/**
 * Untrusted skill name (frontmatter or path) to a safe path segment. `.` and
 * `..` are dropped, not rewritten, so `../../pwned` collapses to `pwned`.
 */
function sanitizeSkillName(raw: string): string {
  const segments = normalizePosixPath(raw)
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '-'))
    .filter((segment) => segment && segment !== '.' && segment !== '..');
  return segments.join('/') || 'skill';
}

export function detectSkillMdFormat(
  format: FormatId,
  files: SourceFile[],
  options?: ParseOptions,
): DetectionResult | null {
  const meta = FORMAT_META[format];
  const prefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;

  const skillPaths: string[] = [];
  const otherConfigPaths: string[] = [];
  let hasRootRule = false;

  for (const file of files) {
    const p = normalizePosixPath(file.path);
    if (p.startsWith(prefix) && p.endsWith('/SKILL.md')) {
      skillPaths.push(p);
    } else if (p.startsWith(configPrefix)) {
      otherConfigPaths.push(p);
    } else if (p === meta.rootRuleFile) {
      hasRootRule = true;
    }
  }

  let allowLoose = false;
  if (
    options?.allowLoose &&
    skillPaths.length === 0 &&
    otherConfigPaths.length === 0
  ) {
    for (const file of files) {
      const p = normalizePosixPath(file.path);
      // Any SKILL.md at any depth: repo roots carry them under `skills/<name>/`
      // (or deeper), and a subpath fetch strips the config dir entirely.
      if (p === 'SKILL.md' || p.endsWith('/SKILL.md')) {
        skillPaths.push(p);
        allowLoose = true;
      }
    }
  }

  if (skillPaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
    return null;
  }

  const matchedPaths = [...skillPaths, ...otherConfigPaths];
  if (hasRootRule) {
    matchedPaths.push(meta.rootRuleFile);
  }

  const parts: string[] = [];
  if (skillPaths.length > 0) {
    parts.push(`${skillPaths.length} skill${skillPaths.length === 1 ? '' : 's'} found`);
  }
  if (hasRootRule) {
    parts.push(meta.rootRuleFile);
  }
  if (parts.length === 0) {
    parts.push(`${otherConfigPaths.length} config asset${otherConfigPaths.length === 1 ? '' : 's'}`);
  }

  return {
    format,
    label: meta.label,
    skillCount: skillPaths.length,
    hasRootRule,
    summary: `${meta.label} — ${parts.join(', ')}`,
    matchedPaths,
    allowLoose,
  };
}

export function parseSkillMdFormat(
  format: FormatId,
  files: SourceFile[],
  options?: ParseOptions,
): EveryagentPackage {
  const meta = FORMAT_META[format];
  const skillsPrefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;

  const skillsMap = new Map<string, Skill>();
  const rootRules: RootRule[] = [];
  const sharedAssets: Asset[] = [];

  // Entry points first: every <name>/SKILL.md is one skill.
  const skillRoots: Array<{ skillName: string; rootDir: string; file: SourceFile }> = [];

  for (const file of files) {
    const p = normalizePosixPath(file.path);
    if (p.startsWith(skillsPrefix) && p.endsWith('/SKILL.md')) {
      const rest = p.slice(skillsPrefix.length);
      const skillDir = rest.slice(0, -'/SKILL.md'.length);
      if (!skillDir) continue;
      skillRoots.push({
        skillName: skillDir,
        rootDir: `${skillsPrefix}${skillDir}/`,
        file,
      });
    }
  }

  // Fallback for subpath fetches and repo-wide layouts (`skills/<name>/`): the
  // `.claude/skills/` prefix is gone, so any SKILL.md is an entry point and its
  // folder is the skill.
  if (options?.allowLoose && skillRoots.length === 0) {
    for (const file of files) {
      const p = normalizePosixPath(file.path);
      if (p !== 'SKILL.md' && !p.endsWith('/SKILL.md')) {
        continue;
      }
      const dir = p === 'SKILL.md' ? '' : p.slice(0, -'SKILL.md'.length);
      const folder = dir ? (dir.slice(0, -1).split('/').pop() ?? '') : '';
      skillRoots.push({
        skillName: folder ? sanitizeSkillName(folder) : '',
        rootDir: dir,
        file,
      });
    }
  }

  const entryPaths = new Set(
    skillRoots.map((sr) => normalizePosixPath(sr.file.path)),
  );

  for (const entry of skillRoots) {
    const raw = entry.file.content.toString('utf8');
    let parsed: ParsedMarkdown;
    try {
      parsed = parseMarkdownWithFrontmatter(raw);
    } catch (err) {
      throw new Error(
        `Could not parse frontmatter in "${entry.file.path}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    const { data, body } = parsed;
    const {
      name,
      description,
      'allowed-tools': allowedToolsRaw,
      globs,
      alwaysApply,
      ...rest
    } = data;

    const skillName =
      typeof name === 'string' && name.trim()
        ? sanitizeSkillName(name.trim())
        : sanitizeSkillName(
            entry.skillName || options?.subpathName || 'skill',
          );

    let allowedTools: string | string[] | undefined;
    if (typeof allowedToolsRaw === 'string' && allowedToolsRaw.trim()) {
      allowedTools = allowedToolsRaw.trim();
    } else if (Array.isArray(allowedToolsRaw)) {
      allowedTools = allowedToolsRaw.map((t) => String(t).trim()).filter(Boolean);
    }

    skillsMap.set(entry.rootDir || '__ROOT__', {
      name: skillName,
      description: typeof description === 'string' ? description.trim() : '',
      body,
      globs: normalizeGlobs(globs),
      alwaysApply: typeof alwaysApply === 'boolean' ? alwaysApply : undefined,
      allowedTools,
      assets: [],
      extraFrontmatter: Object.keys(rest).length > 0 ? rest : undefined,
    });
  }

  // Then everything else: companion files, shared config, root rule.
  for (const file of files) {
    const p = normalizePosixPath(file.path);

    if (p === meta.rootRuleFile) {
      rootRules.push({
        sourceFilename: meta.rootRuleFile,
        content: file.content.toString('utf8'),
      });
      continue;
    }

    // Already consumed as a skill entry point.
    if (entryPaths.has(p)) {
      continue;
    }

    // Everything under a skill's own folder belongs to that skill. Nested
    // skills exist (`skills/a/b/SKILL.md`), so the deepest folder wins.
    let owner: (typeof skillRoots)[number] | undefined;
    for (const sr of skillRoots) {
      if (!sr.rootDir || !p.startsWith(sr.rootDir)) continue;
      if (!owner || sr.rootDir.length > owner.rootDir.length) {
        owner = sr;
      }
    }
    if (owner) {
      const rel = p.slice(owner.rootDir.length);
      const skill = skillsMap.get(owner.rootDir);
      if (skill && rel) {
        skill.assets.push({
          relativePath: rel,
          content: file.content,
          isText: isTextFile(p, file.content),
        });
        continue;
      }
    }

    // Loose root SKILL.md: the whole subpath is the skill, so its companion
    // files are assets.
    if (skillRoots.some((sr) => !sr.rootDir) && !p.startsWith(configPrefix)) {
      const skill = skillsMap.get('__ROOT__');
      if (skill) {
        skill.assets.push({
          relativePath: p,
          content: file.content,
          isText: isTextFile(p, file.content),
        });
        continue;
      }
    }

    if (p.startsWith(configPrefix)) {
      const rel = p.slice(configPrefix.length);
      if (rel) {
        sharedAssets.push({
          relativePath: rel,
          content: file.content,
          isText: isTextFile(p, file.content),
        });
      }
    }
  }

  return {
    sourceFormat: format,
    sourceLabel: meta.label,
    skills: Array.from(skillsMap.values()),
    rootRules,
    sharedAssets,
  };
}

export function emitSkillMdFormat(
  format: FormatId,
  pkg: EveryagentPackage,
  options?: EmitOptions,
  includeAllowedTools = false,
): EmittedFile[] {
  const meta = FORMAT_META[format];
  const isGlobal = Boolean(options?.global);
  const basePrefix = isGlobal ? '' : `${meta.configDir}/`;
  const emitted: EmittedFile[] = [];

  for (const skill of pkg.skills) {
    const frontmatter: Record<string, unknown> = {
      name: skill.name,
      description: formatSkillDescriptionForSkillMd(skill),
    };

    if (includeAllowedTools && skill.allowedTools !== undefined) {
      frontmatter['allowed-tools'] = skill.allowedTools;
    }

    const skillDir = `${basePrefix}skills/${skill.name}`;
    emitted.push({
      relativePath: `${skillDir}/SKILL.md`,
      content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
      targetFormat: format,
    });

    for (const asset of skill.assets) {
      emitted.push({
        relativePath: `${skillDir}/${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: format,
      });
    }
  }

  for (const asset of pkg.sharedAssets) {
    emitted.push({
      relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
      content: asset.content,
      targetFormat: format,
    });
  }

  for (const rule of pkg.rootRules) {
    const normalized = rule.content.replace(/\r\n/g, '\n');
    const content = normalized.endsWith('\n') ? normalized : `${normalized}\n`;
    emitted.push({
      relativePath: meta.rootRuleFile,
      content: Buffer.from(content, 'utf8'),
      targetFormat: format,
    });
  }

  return emitted;
}
