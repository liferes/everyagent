import os from 'node:os';
import path from 'node:path';
import {
  isTextFile,
  normalizePosixPath,
  type EmittedFile,
  type RootRule,
  type Skill,
  type SourceFile,
  type EveryagentPackage,
} from '../core/ir.js';
import {
  normalizeGlobs,
  parseMarkdownWithFrontmatter,
  serializeMarkdownWithFrontmatter,
  type Adapter,
  type DetectionResult,
  type EmitOptions,
  type ParseOptions,
} from './types.js';

const RULES_PREFIX = '.cursor/rules/';
const CONFIG_PREFIX = '.cursor/';
const ROOT_RULE_FILE = '.cursorrules';

export const cursorAdapter: Adapter = {
  id: 'cursor',
  label: 'Cursor (.cursor/)',
  configDir: '.cursor',
  rootRuleFile: ROOT_RULE_FILE,

  getGlobalDir(): string {
    return path.join(os.homedir(), '.cursor');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    const rulePaths: string[] = [];
    const otherConfigPaths: string[] = [];
    let hasRootRule = false;

    for (const file of files) {
      const p = normalizePosixPath(file.path);
      if (p.startsWith(RULES_PREFIX) && p.endsWith('.mdc')) {
        rulePaths.push(p);
      } else if (p.startsWith(CONFIG_PREFIX)) {
        otherConfigPaths.push(p);
      } else if (p === ROOT_RULE_FILE) {
        hasRootRule = true;
      }
    }

    let allowLoose = false;
    if (
      options?.allowLoose &&
      rulePaths.length === 0 &&
      otherConfigPaths.length === 0
    ) {
      for (const file of files) {
        const p = normalizePosixPath(file.path);
        if (p.endsWith('.mdc')) {
          rulePaths.push(p);
          allowLoose = true;
        }
      }
    }

    if (rulePaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
      return null;
    }

    const matchedPaths = [...rulePaths, ...otherConfigPaths];
    if (hasRootRule) {
      matchedPaths.push(ROOT_RULE_FILE);
    }

    const parts: string[] = [];
    if (rulePaths.length > 0) {
      parts.push(`${rulePaths.length} skill${rulePaths.length === 1 ? '' : 's'} found`);
    }
    if (hasRootRule) {
      parts.push(ROOT_RULE_FILE);
    }
    if (parts.length === 0) {
      parts.push(`${otherConfigPaths.length} config asset${otherConfigPaths.length === 1 ? '' : 's'}`);
    }

    return {
      format: 'cursor',
      label: this.label,
      skillCount: rulePaths.length,
      hasRootRule,
      summary: `${this.label} — ${parts.join(', ')}`,
      matchedPaths,
      allowLoose,
    };
  },

  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage {
    const skillsByName = new Map<string, Skill>();
    const rootRules: RootRule[] = [];
    const sharedAssets: EveryagentPackage['sharedAssets'] = [];

    const mdcFiles: Array<{ skillName: string; file: SourceFile }> = [];

    for (const file of files) {
      const p = normalizePosixPath(file.path);
      if (p.startsWith(RULES_PREFIX) && p.endsWith('.mdc')) {
        const skillName = p.slice(RULES_PREFIX.length, -'.mdc'.length);
        if (skillName) {
          mdcFiles.push({ skillName, file });
        }
      }
    }

    if (options?.allowLoose && mdcFiles.length === 0) {
      for (const file of files) {
        const p = normalizePosixPath(file.path);
        if (p.endsWith('.mdc')) {
          const skillName = p.slice(0, -'.mdc'.length);
          if (skillName) {
            mdcFiles.push({ skillName, file });
          }
        }
      }
    }

    for (const entry of mdcFiles) {
      const raw = entry.file.content.toString('utf8');
      const { data, body } = parseMarkdownWithFrontmatter(raw);
      const { description, globs, alwaysApply, ...rest } = data;

      skillsByName.set(entry.skillName, {
        name: entry.skillName,
        description: typeof description === 'string' ? description.trim() : '',
        body,
        globs: normalizeGlobs(globs),
        alwaysApply: typeof alwaysApply === 'boolean' ? alwaysApply : undefined,
        assets: [],
        extraFrontmatter: Object.keys(rest).length > 0 ? rest : undefined,
      });
    }

    const mdcPathSet = new Set(mdcFiles.map((m) => normalizePosixPath(m.file.path)));

    for (const file of files) {
      const p = normalizePosixPath(file.path);
      if (mdcPathSet.has(p)) {
        continue;
      }

      if (p === ROOT_RULE_FILE) {
        rootRules.push({
          sourceFilename: ROOT_RULE_FILE,
          content: file.content.toString('utf8'),
        });
        continue;
      }

      if (p.startsWith(RULES_PREFIX)) {
        const rest = p.slice(RULES_PREFIX.length);
        let attached = false;
        for (const [skillName, skill] of skillsByName.entries()) {
          const companionPrefix = `${skillName}/`;
          if (rest.startsWith(companionPrefix)) {
            const rel = rest.slice(companionPrefix.length);
            if (rel) {
              skill.assets.push({
                relativePath: rel,
                content: file.content,
                isText: isTextFile(p, file.content),
              });
              attached = true;
              break;
            }
          }
        }
        if (attached) {
          continue;
        }
      }

      if (p.startsWith(CONFIG_PREFIX)) {
        const rel = p.slice(CONFIG_PREFIX.length);
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
      sourceFormat: 'cursor',
      sourceLabel: this.label,
      skills: Array.from(skillsByName.values()),
      rootRules,
      sharedAssets,
    };
  },

  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[] {
    const isGlobal = Boolean(options?.global);
    const basePrefix = isGlobal ? '' : CONFIG_PREFIX;
    const emitted: EmittedFile[] = [];

    for (const skill of pkg.skills) {
      const frontmatter: Record<string, unknown> = {
        description: skill.description,
      };
      if (skill.globs && skill.globs.length > 0) {
        frontmatter.globs = skill.globs.join(', ');
      }
      frontmatter.alwaysApply = skill.alwaysApply ?? false;

      emitted.push({
        relativePath: `${basePrefix}rules/${skill.name}.mdc`,
        content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
        targetFormat: 'cursor',
      });

      for (const asset of skill.assets) {
        emitted.push({
          relativePath: `${basePrefix}rules/${skill.name}/${normalizePosixPath(asset.relativePath)}`,
          content: asset.content,
          targetFormat: 'cursor',
        });
      }
    }

    for (const asset of pkg.sharedAssets) {
      emitted.push({
        relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: 'cursor',
      });
    }

    for (const rule of pkg.rootRules) {
      const normalized = rule.content.replace(/\r\n/g, '\n');
      const content = normalized.endsWith('\n') ? normalized : `${normalized}\n`;
      emitted.push({
        relativePath: ROOT_RULE_FILE,
        content: Buffer.from(content, 'utf8'),
        targetFormat: 'cursor',
      });
    }

    return emitted;
  },
};
