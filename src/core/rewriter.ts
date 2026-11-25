import {
  FORMAT_META,
  type Asset,
  type FormatId,
  type RootRule,
  type Skill,
  type EveryagentPackage,
} from './ir.js';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * SKILL.md has no globs field, so Cursor's patterns ride along in the
 * description where the target agent will still see them.
 */
export function formatSkillDescriptionForSkillMd(skill: Skill): string {
  const base = skill.description.trim();
  const globs = skill.globs?.map((g) => g.trim()).filter(Boolean) ?? [];
  if (globs.length === 0) {
    return base;
  }

  const globText = globs.join(', ');
  if (base.includes(globText)) {
    return base;
  }

  const hint = `(Applies to: ${globText})`;
  return base ? `${base} ${hint}` : hint;
}

/**
 * Point a body's internal paths at the target layout. Runs on skill bodies,
 * root rules and text assets alike.
 */
export function rewritePaths(
  text: string,
  sourceFormat: FormatId,
  targetFormat: FormatId,
): string {
  if (!text) {
    return text;
  }

  let result = text;

  // Antigravity moved from `.agent/` to `.agents/`. The alias has to be fixed
  // even when source and target are the same format, since renaming the folder
  // is exactly what a `.agent/` -> antigravity run is for.
  if (sourceFormat === 'antigravity') {
    result = result.replace(/\.agent\/skills\//g, '.agents/skills/');
    result = result.replace(/(^|[^A-Za-z0-9_.-])\.agent\//g, '$1.agents/');
  }

  if (sourceFormat === targetFormat) {
    return result;
  }

  const sourceMeta = FORMAT_META[sourceFormat];
  const targetMeta = FORMAT_META[targetFormat];

  // 1. Skill folders first, so `.cursor/rules/<name>/` lands on `<target>/skills/<name>/`.
  if (sourceFormat === 'cursor') {
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\.mdc\b/g,
      `${targetMeta.configDir}/skills/$1/SKILL.md`,
    );
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\//g,
      `${targetMeta.configDir}/skills/$1/`,
    );
    result = result.replace(
      /\.cursor\/rules\//g,
      `${targetMeta.configDir}/skills/`,
    );
  } else if (targetFormat === 'cursor') {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/([^/\\s\`'")\\]]+)\\/`,
      'g',
    );
    result = result.replace(sourceSkillsRe, '.cursor/rules/$1/');
    const sourceSkillsRootRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      'g',
    );
    result = result.replace(sourceSkillsRootRe, '.cursor/rules/');
    // Cursor keeps one file per rule, not a folder with SKILL.md.
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\/SKILL\.md\b/g,
      '.cursor/rules/$1.mdc',
    );
  } else {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      'g',
    );
    result = result.replace(sourceSkillsRe, `${targetMeta.configDir}/skills/`);
  }

  // 2. Whatever is left: `.cursor/scripts/` -> `.claude/scripts/`.
  const configDirRe = new RegExp(
    `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.configDir)}\\/`,
    'g',
  );
  result = result.replace(configDirRe, `$1${targetMeta.configDir}/`);

  // 3. Root rule names differ too: `.cursorrules` -> `CLAUDE.md`.
  if (sourceMeta.rootRuleFile !== targetMeta.rootRuleFile) {
    const rootRuleRe = new RegExp(
      `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.rootRuleFile)}(?=$|[^A-Za-z0-9_.-])`,
      'g',
    );
    result = result.replace(rootRuleRe, `$1${targetMeta.rootRuleFile}`);
  }

  return result;
}

function rewriteAsset(
  asset: Asset,
  sourceFormat: FormatId,
  targetFormat: FormatId,
): Asset {
  if (!asset.isText) {
    return {
      relativePath: asset.relativePath,
      content: Buffer.from(asset.content),
      isText: false,
    };
  }
  const rewritten = rewritePaths(
    asset.content.toString('utf8'),
    sourceFormat,
    targetFormat,
  );
  return {
    relativePath: asset.relativePath,
    content: Buffer.from(rewritten, 'utf8'),
    isText: true,
  };
}

/**
 * Copy, don't mutate: the same IR feeds every target in a run.
 */
export function rewritePackage(
  pkg: EveryagentPackage,
  targetFormat: FormatId,
): EveryagentPackage {
  const skills: Skill[] = pkg.skills.map((skill) => ({
    ...skill,
    globs: skill.globs ? [...skill.globs] : undefined,
    allowedTools: Array.isArray(skill.allowedTools)
      ? [...skill.allowedTools]
      : skill.allowedTools,
    extraFrontmatter: skill.extraFrontmatter
      ? { ...skill.extraFrontmatter }
      : undefined,
    body: rewritePaths(skill.body, pkg.sourceFormat, targetFormat),
    assets: skill.assets.map((asset) =>
      rewriteAsset(asset, pkg.sourceFormat, targetFormat),
    ),
  }));

  const rootRules: RootRule[] = pkg.rootRules.map((rule) => ({
    sourceFilename: rule.sourceFilename,
    content: rewritePaths(rule.content, pkg.sourceFormat, targetFormat),
  }));

  const sharedAssets: Asset[] = pkg.sharedAssets.map((asset) =>
    rewriteAsset(asset, pkg.sourceFormat, targetFormat),
  );

  return {
    sourceFormat: pkg.sourceFormat,
    sourceLabel: pkg.sourceLabel,
    skills,
    rootRules,
    sharedAssets,
  };
}
