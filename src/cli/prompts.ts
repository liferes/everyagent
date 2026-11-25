import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getAdapter } from '../adapters/registry.js';
import type { DetectionResult } from '../adapters/types.js';
import {
  detectLocalProjectSource,
  detectTargetFormats,
} from '../core/detector.js';
import { parseGitHubSource } from '../core/fetcher.js';
import {
  FORMAT_IDS,
  FORMAT_META,
  type FormatId,
  type UniskillPackage,
} from '../core/ir.js';
import {
  convertAndWrite,
  fetchAndDetect,
  filterPackage,
  parseDetectedPackage,
  shouldPromptTranslationScope,
} from '../core/pipeline.js';
import type { WriteSummary } from '../core/writer.js';
import { formatActionLine, formatSummaryCounts } from './logger.js';

export type WriteActionChoice =
  | 'write'
  | 'dry_run'
  | 'force'
  | 'change_target'
  | 'cancel';

function assertNotCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
}

function truncateText(text: string, maxLen = 60): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxLen) {
    return collapsed;
  }
  return `${collapsed.slice(0, maxLen - 3)}...`;
}

export function formatDetectedHeader(
  sourceLabel: string,
  format: FormatId,
): string {
  return `Detected ${sourceLabel} (${FORMAT_META[format].configDir})`;
}

export function formatSelectionCounts(pkg: UniskillPackage): string {
  const parts: string[] = [];
  if (pkg.skills.length > 0) {
    parts.push(`${pkg.skills.length} skill${pkg.skills.length === 1 ? '' : 's'}`);
  }
  for (const rule of pkg.rootRules) {
    parts.push(rule.sourceFilename);
  }
  if (pkg.sharedAssets.length > 0) {
    parts.push(
      `${pkg.sharedAssets.length} shared asset${pkg.sharedAssets.length === 1 ? '' : 's'}`,
    );
  }
  return parts.join(', ');
}

export function formatPackageOverview(
  pkg: UniskillPackage,
  maxSkills = 12,
): string {
  const lines: string[] = [];
  const visibleSkills = pkg.skills.slice(0, maxSkills);

  for (const skill of visibleSkills) {
    const desc = skill.description ? ` — ${truncateText(skill.description, 60)}` : '';
    const assets =
      skill.assets.length > 0
        ? ` [${skill.assets.length} asset${skill.assets.length === 1 ? '' : 's'}]`
        : '';
    lines.push(`• ${skill.name}${desc}${assets}`);
  }

  if (pkg.skills.length > maxSkills) {
    const extra = pkg.skills.length - maxSkills;
    lines.push(`... and ${extra} more skill${extra === 1 ? '' : 's'}`);
  }

  for (const rule of pkg.rootRules) {
    lines.push(`• ${rule.sourceFilename} (root rule)`);
  }

  if (pkg.sharedAssets.length > 0) {
    lines.push(
      `• Shared config assets (${pkg.sharedAssets.length} file${pkg.sharedAssets.length === 1 ? '' : 's'})`,
    );
  }

  return lines.join('\n');
}

export async function promptSourceFormatSelection(
  detections: DetectionResult[],
): Promise<DetectionResult> {
  const selected = assertNotCancelled(
    await p.select({
      message: 'Multiple formats detected. Which source format should Uniskill read from?',
      options: detections.map((d) => ({
        value: d.format,
        label: d.summary,
      })),
    }),
  );

  const match = detections.find((d) => d.format === selected);
  if (!match) {
    throw new Error(`Selected format "${String(selected)}" not found.`);
  }
  return match;
}

export async function promptTranslationScope(
  pkg: UniskillPackage,
): Promise<{
  skillNames?: string[];
  includeRootRules?: boolean;
  includeSharedAssets?: boolean;
} | null> {
  const counts = formatSelectionCounts(pkg);
  const scope = assertNotCancelled(
    await p.select<'all' | 'selected' | 'cancel'>({
      message: 'What would you like to translate?',
      options: [
        {
          value: 'all',
          label: 'Translate all',
          hint: counts || undefined,
        },
        {
          value: 'selected',
          label: 'Translate selected',
          hint: 'pick specific skills & rules',
        },
        {
          value: 'cancel',
          label: 'Cancel',
        },
      ],
    }),
  );

  if (scope === 'cancel') {
    return null;
  }

  if (scope === 'all') {
    return {
      includeRootRules: true,
      includeSharedAssets: true,
    };
  }

  const options: Array<{ value: string; label: string; hint?: string }> = [];

  for (const skill of pkg.skills) {
    const hintParts: string[] = [];
    if (skill.description) {
      hintParts.push(truncateText(skill.description, 48));
    }
    if (skill.assets.length > 0) {
      hintParts.push(
        `${skill.assets.length} asset${skill.assets.length === 1 ? '' : 's'}`,
      );
    }
    options.push({
      value: `skill:${skill.name}`,
      label: skill.name,
      ...(hintParts.length > 0 ? { hint: hintParts.join(' · ') } : {}),
    });
  }

  if (pkg.rootRules.length > 0) {
    options.push({
      value: '__root_rules__',
      label: `${pkg.rootRules.map((r) => r.sourceFilename).join(', ')} (root rule)`,
      hint: 'root instruction file',
    });
  }

  if (pkg.sharedAssets.length > 0) {
    const sample = pkg.sharedAssets
      .slice(0, 2)
      .map((a) => a.relativePath)
      .join(', ');
    options.push({
      value: '__shared_assets__',
      label: `Shared config assets (${pkg.sharedAssets.length} file${pkg.sharedAssets.length === 1 ? '' : 's'})`,
      hint: pkg.sharedAssets.length > 2 ? `${sample}, ...` : sample,
    });
  }

  const picked = assertNotCancelled(
    await p.multiselect({
      message: 'Select skills and rules to translate:',
      options,
      required: true,
    }),
  );

  const pickedSet = new Set(picked);
  const skillNames = picked
    .filter((value) => value.startsWith('skill:'))
    .map((value) => value.slice('skill:'.length));

  return {
    skillNames,
    includeRootRules: pickedSet.has('__root_rules__'),
    includeSharedAssets: pickedSet.has('__shared_assets__'),
  };
}

export async function promptTargetFormatSelection(
  sourceFormat?: FormatId,
  detectedTargets?: FormatId[],
): Promise<FormatId[]> {
  const otherFormats = sourceFormat
    ? FORMAT_IDS.filter((id) => id !== sourceFormat)
    : [...FORMAT_IDS];
  const detectedSet = new Set(detectedTargets ?? []);

  const formatHints = (id: FormatId): string | undefined => {
    const parts: string[] = [];
    if (id === sourceFormat) {
      parts.push('detected source');
    }
    if (detectedSet.has(id)) {
      parts.push('detected');
    }
    return parts.length > 0 ? parts.join(' · ') : undefined;
  };

  const options: Array<{
    value: FormatId | 'all' | 'all_other';
    label: string;
    hint?: string;
  }> = sourceFormat
    ? [
        {
          value: 'all_other',
          label: 'All other formats',
          hint: otherFormats.map((id) => FORMAT_META[id].configDir).join(', '),
        },
        {
          value: 'all',
          label: 'All formats',
          hint: FORMAT_IDS.map((id) => FORMAT_META[id].configDir).join(', '),
        },
        ...FORMAT_IDS.map((id) => {
          const hint = formatHints(id);
          return {
            value: id,
            label: FORMAT_META[id].label,
            ...(hint ? { hint } : {}),
          };
        }),
      ]
    : [
        { value: 'all', label: 'All supported formats' },
        ...FORMAT_IDS.map((id) => {
          const hint = formatHints(id);
          return {
            value: id,
            label: FORMAT_META[id].label,
            ...(hint ? { hint } : {}),
          };
        }),
      ];

  const selected = assertNotCancelled(
    await p.multiselect({
      message: 'Select target format(s) to generate:',
      options,
      ...(detectedTargets && detectedTargets.length > 0
        ? { initialValues: detectedTargets }
        : {}),
      required: true,
    }),
  );

  if (selected.includes('all')) {
    return [...FORMAT_IDS];
  }

  const chosen = new Set<FormatId>();
  if (selected.includes('all_other')) {
    for (const id of otherFormats) {
      chosen.add(id);
    }
  }
  for (const id of FORMAT_IDS) {
    if (selected.includes(id)) {
      chosen.add(id);
    }
  }

  return FORMAT_IDS.filter((id) => chosen.has(id));
}

export async function promptWriteAction(options: {
  sourceLabel: string;
  targetFormats: FormatId[];
  destinationLabel: string;
  selectionSummary: string;
  alreadyPreviewed?: boolean;
  defaultForce?: boolean;
  preview?: WriteSummary;
  allowChangeTarget?: boolean;
}): Promise<WriteActionChoice> {
  const targetNames = options.targetFormats
    .map((id) => FORMAT_META[id].label.split(' ')[0])
    .join(', ');

  const message = options.alreadyPreviewed
    ? 'Proceed with writing these files?'
    : `Translate [${options.sourceLabel}] ➔ [${targetNames}] into ${options.destinationLabel} (${options.selectionSummary})?`;

  const preview = options.preview;
  let writeOption: { value: 'write'; label: string; hint: string };
  let forceOption: { value: 'force'; label: string; hint: string } | undefined;

  if (preview) {
    if (preview.skipped > 0) {
      writeOption = {
        value: 'write',
        label:
          preview.created > 0
            ? 'Write new & keep existing'
            : 'Keep existing files',
        hint: `${preview.created} new, skip ${preview.skipped} changed${preview.unchanged > 0 ? `, ${preview.unchanged} up to date` : ''}`,
      };
      forceOption = {
        value: 'force',
        label: `Update ${preview.skipped} changed file${preview.skipped === 1 ? '' : 's'}`,
        hint:
          preview.created > 0
            ? `+ ${preview.created} new`
            : 'overwrite differing files',
      };
    } else {
      writeOption = {
        value: 'write',
        label: 'Translate & write files',
        hint:
          preview.unchanged > 0
            ? `${preview.created} new, ${preview.unchanged} up to date`
            : `${preview.created} new file${preview.created === 1 ? '' : 's'}`,
      };
    }
  } else {
    writeOption = {
      value: 'write',
      label: 'Translate & write files',
      hint: 'skip existing files',
    };
    forceOption = {
      value: 'force',
      label: 'Translate & overwrite existing',
      hint: '--force',
    };
  }

  const dryRunOption = {
    value: 'dry_run' as const,
    label: 'Preview plan (dry-run)',
    hint: 'inspect files without writing',
  };
  const changeTargetOption = {
    value: 'change_target' as const,
    label: 'Change target format',
  };
  const cancelOption = {
    value: 'cancel' as const,
    label: 'Cancel',
  };

  const orderedOptions =
    options.defaultForce && forceOption
      ? [
          forceOption,
          writeOption,
          ...(options.alreadyPreviewed ? [] : [dryRunOption]),
          ...(options.allowChangeTarget ? [changeTargetOption] : []),
          cancelOption,
        ]
      : [
          writeOption,
          ...(options.alreadyPreviewed ? [] : [dryRunOption]),
          ...(forceOption ? [forceOption] : []),
          ...(options.allowChangeTarget ? [changeTargetOption] : []),
          cancelOption,
        ];

  return assertNotCancelled(
    await p.select<WriteActionChoice>({
      message,
      options: orderedOptions,
    }),
  );
}

export async function promptConfirmation(
  sourceLabel: string,
  targetFormats: FormatId[],
  destinationLabel: string,
): Promise<boolean> {
  const targetNames = targetFormats
    .map((id) => FORMAT_META[id].label.split(' ')[0])
    .join(', ');

  return assertNotCancelled(
    await p.confirm({
      message: `Convert [${sourceLabel}] ➔ [${targetNames}] into ${destinationLabel}?`,
      initialValue: true,
    }),
  );
}

/** No arguments: ask for everything, auto-detecting local skills & targets when present. */
export async function runInteractiveWizard(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(' uniskill ')));

  let fetchResult;
  let detections: DetectionResult[];
  let usingCurrentDir = false;

  const localSource = detectLocalProjectSource(process.cwd());
  if (localSource) {
    const detectedSummary = localSource.detections
      .map((d) => d.summary)
      .join(' · ');
    const sourceChoice = assertNotCancelled(
      await p.select<'local' | 'remote'>({
        message: 'Detected skills in this project. What would you like to do?',
        options: [
          {
            value: 'local',
            label: 'Convert this project',
            hint: detectedSummary,
          },
          {
            value: 'remote',
            label: 'Import from a GitHub repo or another folder',
          },
        ],
      }),
    );

    if (sourceChoice === 'local') {
      fetchResult = localSource.fetchResult;
      detections = localSource.detections;
      usingCurrentDir = true;
      if (detections.length === 1) {
        p.log.step(
          formatDetectedHeader(
            fetchResult.source.displayLabel,
            detections[0].format,
          ),
        );
      }
    }
  }

  if (!usingCurrentDir) {
    const sourceInput = assertNotCancelled(
      await p.text({
        message: 'GitHub repository URL, owner/repo, or local folder:',
        placeholder: 'owner/repo or https://github.com/owner/repo',
        validate(value) {
          if (!value || !value.trim()) {
            return 'Please enter a GitHub repo or local path.';
          }
          try {
            parseGitHubSource(value);
            return undefined;
          } catch (err) {
            return err instanceof Error ? err.message : String(err);
          }
        },
      }),
    );

    const spin = p.spinner();
    spin.start(`Fetching ${sourceInput.trim()}...`);

    try {
      const res = await fetchAndDetect(sourceInput.trim(), 'auto');
      fetchResult = res.fetchResult;
      detections = res.detections;
      if (detections.length === 1) {
        spin.stop(
          formatDetectedHeader(
            fetchResult.source.displayLabel,
            detections[0].format,
          ),
        );
      } else {
        spin.stop(
          `Detected ${detections.length} formats in ${fetchResult.source.displayLabel}`,
        );
      }
    } catch (err) {
      spin.stop('Fetch failed');
      p.log.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  }

  let chosenDetection = detections![0];
  if (detections!.length > 1) {
    chosenDetection = await promptSourceFormatSelection(detections!);
    p.log.step(
      formatDetectedHeader(
        fetchResult!.source.displayLabel,
        chosenDetection.format,
      ),
    );
  }

  const pkg = parseDetectedPackage(
    fetchResult!.files,
    chosenDetection,
    fetchResult!.subpathName,
  );

  p.note(
    formatPackageOverview(pkg),
    `${fetchResult!.source.displayLabel} · ${FORMAT_META[chosenDetection.format].label}`,
  );

  let filteredPkg = pkg;
  if (shouldPromptTranslationScope(pkg)) {
    const selection = await promptTranslationScope(pkg);
    if (!selection) {
      p.cancel('Aborted. No files were written.');
      return;
    }
    filteredPkg = filterPackage(pkg, selection);
  }

  const detectedTargets = detectTargetFormats({
    targetDir: process.cwd(),
    sourceFormat: chosenDetection.format,
    excludeSourceWhenLocal: usingCurrentDir,
  });
  let targetFormats = await promptTargetFormatSelection(
    chosenDetection.format,
    detectedTargets.formats,
  );

  const destinationMode = assertNotCancelled(
    await p.select({
      message: 'Where should the converted skills be installed?',
      options: [
        { value: 'cwd', label: 'Current directory (.)' },
        { value: 'custom', label: 'Custom project path' },
        {
          value: 'global',
          label: 'Global config directories (~/.claude, ~/.config/opencode, ~/.codex, ~/.cursor)',
        },
      ],
    }),
  );

  let targetDir = '.';
  const isGlobal = destinationMode === 'global';

  if (destinationMode === 'custom') {
    targetDir = assertNotCancelled(
      await p.text({
        message: 'Target project directory:',
        initialValue: './my-project',
        validate(value) {
          return !value || !value.trim() ? 'Please provide a directory path.' : undefined;
        },
      }),
    );
  }

  let destinationLabel = isGlobal
    ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
    : targetDir;

  const sourceName = FORMAT_META[chosenDetection.format].label.split(' ')[0];
  const selectionSummary = formatSelectionCounts(filteredPkg);
  let alreadyPreviewed = false;
  let actionChoice: WriteActionChoice = 'cancel';

  while (true) {
    const { summary: preview } = convertAndWrite({
      files: fetchResult!.files,
      pkg: filteredPkg,
      sourceFormat: chosenDetection.format,
      targetFormats,
      targetDir,
      global: isGlobal,
      dryRun: true,
      subpathName: fetchResult!.subpathName,
      allowLoose: chosenDetection.allowLoose,
    });

    if (
      preview.created === 0 &&
      preview.skipped === 0 &&
      preview.conflict === 0 &&
      preview.unchanged > 0
    ) {
      p.outro(`${pc.green('Already up to date!')} ${formatSummaryCounts(preview)}.`);
      return;
    }

    actionChoice = await promptWriteAction({
      sourceLabel: sourceName,
      targetFormats,
      destinationLabel,
      selectionSummary,
      alreadyPreviewed,
      preview,
      allowChangeTarget: true,
    });

    if (actionChoice === 'dry_run') {
      for (const action of preview.actions) {
        console.log(formatActionLine(action, isGlobal));
      }
      p.log.info(`Dry run: ${formatSummaryCounts(preview)}.`);
      alreadyPreviewed = true;
      continue;
    }

    if (actionChoice === 'change_target') {
      targetFormats = await promptTargetFormatSelection(
        chosenDetection.format,
        targetFormats,
      );
      destinationLabel = isGlobal
        ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
        : targetDir;
      alreadyPreviewed = false;
      continue;
    }

    break;
  }

  if (actionChoice === 'cancel') {
    p.cancel('Aborted. No files were written.');
    return;
  }

  const { summary } = convertAndWrite({
    files: fetchResult!.files,
    pkg: filteredPkg,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir,
    global: isGlobal,
    force: actionChoice === 'force',
    subpathName: fetchResult!.subpathName,
    allowLoose: chosenDetection.allowLoose,
  });

  for (const action of summary.actions) {
    console.log(formatActionLine(action, isGlobal));
  }

  if (summary.conflict > 0) {
    p.log.warn(
      'Two target formats share a file name and produced different content. Install them one at a time if you need both.',
    );
  }

  p.outro(`${pc.green('Done!')} ${formatSummaryCounts(summary)}.`);
}
