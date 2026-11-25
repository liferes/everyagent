import { detectFormats, getAdapter } from '../adapters/registry.js';
import type { DetectionResult } from '../adapters/types.js';
import { fetchSource, type FetchResult } from './fetcher.js';
import { findClosestMatches, normalizeToken } from './fuzzy.js';
import type { FormatId, Skill, SourceFile, EveryagentPackage } from './ir.js';
import {
  FORMAT_META,
  isConfigAssetPath,
  normalizePosixPath,
  type EmittedFile,
} from './ir.js';
import { rewritePackage } from './rewriter.js';
import { writeEmittedFiles, type WriteSummary } from './writer.js';

export interface DetectSourceResult {
  fetchResult: FetchResult;
  detections: DetectionResult[];
}

export interface PackageSelection {
  /** Skill names to include. Undefined means include all skills. */
  skillNames?: string[];
  /** Include root rules (CLAUDE.md, .cursorrules, AGENTS.md). Default: true. */
  includeRootRules?: boolean;
  /** Include shared config assets. Default: true. */
  includeSharedAssets?: boolean;
  /** Include settings, hooks, and MCP files. Default: false. */
  includeConfigAssets?: boolean;
}

export interface ConvertAndWriteOptions {
  files: SourceFile[];
  sourceFormat: FormatId;
  targetFormats: FormatId[];
  targetDir: string;
  global?: boolean;
  force?: boolean;
  dryRun?: boolean;
  subpathName?: string;
  allowLoose?: boolean;
  pkg?: EveryagentPackage;
  selection?: PackageSelection;
  overwrite?: ReadonlySet<string>;
}

export interface PlannedTargetOutput {
  targetFormat: FormatId;
  destination: string;
  files: EmittedFile[];
}

export interface ConvertAndWriteResult {
  pkg: EveryagentPackage;
  summary: WriteSummary;
  plannedTargets: PlannedTargetOutput[];
}

/** Explicit `--from` skips the vote; otherwise every adapter gets a say. */
export async function fetchAndDetect(
  source: string,
  fromFormat: FormatId | 'auto' = 'auto',
): Promise<DetectSourceResult> {
  const fetchResult = await fetchSource(source);

  if (fromFormat !== 'auto') {
    const adapter = getAdapter(fromFormat);
    const detected =
      adapter.detect(fetchResult.files, {
        subpathName: fetchResult.subpathName,
        allowLoose: false,
      }) ??
      adapter.detect(fetchResult.files, {
        subpathName: fetchResult.subpathName,
        allowLoose: true,
      });

    if (!detected) {
      throw new Error(
        `No ${adapter.label} skills or rules found in "${fetchResult.source.displayLabel}".`,
      );
    }

    return {
      fetchResult,
      detections: [detected],
    };
  }

  const detections = detectFormats(fetchResult.files, {
    subpathName: fetchResult.subpathName,
  });

  if (detections.length === 0) {
    throw new Error(
      `Could not detect any supported skill format in "${fetchResult.source.displayLabel}".`,
    );
  }

  return { fetchResult, detections };
}

/** `allowLoose` has to reach the parser, or a subpath fetch finds nothing to parse. */
export function parseDetectedPackage(
  files: SourceFile[],
  detection: DetectionResult,
  subpathName?: string,
): EveryagentPackage {
  return getAdapter(detection.format).parse(files, {
    subpathName,
    allowLoose: detection.allowLoose,
  });
}

/** One choice needs no prompt: there is nothing to choose between. */
export function shouldPromptTranslationScope(pkg: EveryagentPackage): boolean {
  const totalChoices =
    pkg.skills.length +
    (pkg.rootRules.length > 0 ? 1 : 0) +
    (pkg.sharedAssets.length > 0 ? 1 : 0);
  return totalChoices > 1;
}

/** Applies a selection, or returns the package untouched when there is none. */
export function filterPackage(
  pkg: EveryagentPackage,
  selection?: PackageSelection,
): EveryagentPackage {
  if (!selection) {
    return stripConfigAssets(pkg);
  }

  let skills = pkg.skills;
  if (selection.skillNames !== undefined) {
    const byLowerName = new Map<string, Skill>();
    const byNormalizedName = new Map<string, Skill | 'ambiguous'>();
    for (const skill of pkg.skills) {
      const key = skill.name.toLowerCase();
      if (!byLowerName.has(key)) {
        byLowerName.set(key, skill);
      }
      const normKey = normalizeToken(skill.name);
      if (normKey) {
        const existing = byNormalizedName.get(normKey);
        if (!existing) {
          byNormalizedName.set(normKey, skill);
        } else if (existing !== 'ambiguous' && existing.name.toLowerCase() !== key) {
          byNormalizedName.set(normKey, 'ambiguous');
        }
      }
    }

    const selectedKeys = new Set<string>();
    const missing: string[] = [];
    for (const rawName of selection.skillNames) {
      const trimmed = rawName.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (byLowerName.has(key)) {
        selectedKeys.add(key);
        continue;
      }

      const normMatch = byNormalizedName.get(normalizeToken(trimmed));
      if (normMatch && normMatch !== 'ambiguous') {
        selectedKeys.add(normMatch.name.toLowerCase());
      } else {
        missing.push(trimmed);
      }
    }

    if (missing.length > 0) {
      const missingText = missing.map((n) => `"${n}"`).join(', ');
      if (pkg.skills.length === 0) {
        throw new Error(
          `Skill(s) not found: ${missingText}. No skills were found in this source.`,
        );
      }
      const availableNames = pkg.skills.map((s) => s.name);
      const suggestions = new Set<string>();
      for (const missed of missing) {
        for (const match of findClosestMatches(missed, availableNames)) {
          suggestions.add(match);
        }
      }
      const suggestionText =
        suggestions.size > 0
          ? ` Did you mean: ${Array.from(suggestions).join(', ')}?`
          : '';
      throw new Error(
        `Skill(s) not found: ${missingText}.${suggestionText} Available skills: ${availableNames.join(', ')}.`,
      );
    }

    skills = pkg.skills.filter((skill) =>
      selectedKeys.has(skill.name.toLowerCase()),
    );
  }

  const rootRules = selection.includeRootRules === false ? [] : pkg.rootRules;
  const sharedAssets =
    selection.includeSharedAssets === false
      ? []
      : selection.includeConfigAssets === true
        ? pkg.sharedAssets
        : pkg.sharedAssets.filter((a) => !isConfigAssetPath(a.relativePath));

  if (
    skills.length === 0 &&
    rootRules.length === 0 &&
    sharedAssets.length === 0
  ) {
    throw new Error(
      'Nothing selected to translate. Select at least one skill, root rule, or shared asset.',
    );
  }

  return {
    ...pkg,
    skills,
    rootRules,
    sharedAssets,
  };
}

/** Drop settings, hooks, and MCP files unless the caller opted in. */
export function stripConfigAssets(pkg: EveryagentPackage): EveryagentPackage {
  const sharedAssets = pkg.sharedAssets.filter(
    (a) => !isConfigAssetPath(a.relativePath),
  );
  return sharedAssets.length === pkg.sharedAssets.length
    ? pkg
    : { ...pkg, sharedAssets };
}

/**
 * Two source items can resolve to the same output path (same `name:` in two
 * folders, or an asset that shadows a neighbour). Writing one silently would
 * lose the other, so refuse before anything touches disk.
 */
function assertUniqueOutputs(
  emitted: EmittedFile[],
  targetFormat: FormatId,
): void {
  const seen = new Map<string, Buffer>();
  for (const file of emitted) {
    const rel = normalizePosixPath(file.relativePath);
    const previous = seen.get(rel);
    if (!previous) {
      seen.set(rel, file.content);
      continue;
    }
    if (previous.equals(file.content)) {
      continue;
    }
    throw new Error(
      `Two source items both write "${rel}" for ${FORMAT_META[targetFormat].label} with different content. Rename one of them, or install them separately with --skill.`,
    );
  }
}

export function convertAndWrite(
  options: ConvertAndWriteOptions,
): ConvertAndWriteResult {
  const sourceAdapter = getAdapter(options.sourceFormat);
  const parsedPkg =
    options.pkg ??
    sourceAdapter.parse(options.files, {
      subpathName: options.subpathName,
      allowLoose: options.allowLoose,
    });
  const pkg = options.selection
    ? filterPackage(parsedPkg, options.selection)
    : options.pkg
      ? parsedPkg
      : stripConfigAssets(parsedPkg);

  // Build and validate every target first, so a collision in the last format
  // cannot leave the earlier ones half-written.
  const planned = options.targetFormats.map((targetFormat) => {
    const targetAdapter = getAdapter(targetFormat);
    const emitted = targetAdapter.emit(rewritePackage(pkg, targetFormat), {
      global: options.global,
    });
    assertUniqueOutputs(emitted, targetFormat);
    return { targetFormat, emitted };
  });

  const combined: WriteSummary = {
    created: 0,
    overwritten: 0,
    unchanged: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: [],
  };

  const seenPaths = new Map<string, Buffer>();
  const plannedTargets: PlannedTargetOutput[] = [];

  for (const { targetFormat, emitted } of planned) {
    const destination = options.global
      ? getAdapter(targetFormat).getGlobalDir()
      : options.targetDir;

    plannedTargets.push({
      targetFormat,
      destination,
      files: emitted,
    });

    const result = writeEmittedFiles(emitted, destination, {
      force: options.force,
      dryRun: options.dryRun,
      seenPaths,
      overwrite: options.overwrite,
    });

    combined.created += result.created;
    combined.overwritten += result.overwritten;
    combined.unchanged += result.unchanged;
    combined.skipped += result.skipped;
    combined.duplicate += result.duplicate;
    combined.conflict += result.conflict;
    combined.actions.push(...result.actions);
  }

  return { pkg, summary: combined, plannedTargets };
}
