import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { getAdapter, isWeakRootRuleOnly } from './adapters/registry.js';
import { plural } from './adapters/types.js';
import { detectTargetFormats } from './core/detector.js';
import {
  FORMAT_IDS,
  FORMAT_META,
  isConfigAssetPath,
  normalizePosixPath,
  resolveWithin,
  type EmittedFile,
  type FormatId,
  type EveryagentPackage,
} from './core/ir.js';
import { lintSourceFiles } from './core/lint.js';
import {
  getInstallDir,
  getManifestPath,
  hashFile,
  inspectInstallDrift,
  readManifest,
  recordManifestEntries,
  resolveManifestSourceForFetch,
  writeManifest,
  type ManifestInstallEntry,
  type EveryagentManifest,
} from './core/manifest.js';
import {
  convertAndWrite,
  fetchAndDetect,
  filterPackage,
  parseDetectedPackage,
  shouldPromptTranslationScope,
  type PackageSelection,
} from './core/pipeline.js';
import { rewritePackage } from './core/rewriter.js';
import {
  applyRemovePlan,
  applySyncPlan,
  entryKeepsConfigAssets,
  planRemove,
  planSyncForEntry,
  groupSkills,
  type SyncEntryPlan,
} from './core/sync.js';
import type { WriteSummary } from './core/writer.js';
import { CliUsageError, parseCliArgs } from './cli/args.js';
import {
  formatActionLine,
  formatSummaryCounts,
  logError,
  logInfo,
  logSuccess,
  logWarn,
  logWriteSummary,
} from './cli/logger.js';
import {
  formatDetectedHeader,
  formatPackageOverview,
  formatSelectionCounts,
  promptConfirmSyncDeletions,
  promptConflictResolution,
  promptSourceFormatSelection,
  promptTargetFormatSelection,
  promptTranslationScope,
  promptWriteAction,
  runInteractiveWizard,
  type WriteActionChoice,
} from './cli/prompts.js';

function emitForSyncEntry(
  pkg: EveryagentPackage,
  entry: ManifestInstallEntry,
): EmittedFile[] {
  let skills = pkg.skills;
  if (entry.skills !== undefined) {
    const wanted = new Set(entry.skills.map((s) => s.toLowerCase()));
    skills = pkg.skills.filter((s) => wanted.has(s.name.toLowerCase()));
  }

  const sharedAssets =
    entry.includeSharedAssets === false
      ? []
      : entryKeepsConfigAssets(entry)
        ? pkg.sharedAssets
        : pkg.sharedAssets.filter((a) => !isConfigAssetPath(a.relativePath));

  const scopedPkg: EveryagentPackage = {
    ...pkg,
    skills,
    rootRules: entry.includeRootRules === false ? [] : pkg.rootRules,
    sharedAssets,
  };

  return getAdapter(entry.targetFormat).emit(
    rewritePackage(scopedPkg, entry.targetFormat),
    { global: entry.global },
  );
}

function requireManifest(
  targetDir: string,
  global: boolean,
): { manifestPath: string; manifest: EveryagentManifest } {
  const manifestPath = getManifestPath({ targetDir, global });
  let manifest: EveryagentManifest | null;
  try {
    manifest = readManifest(manifestPath);
  } catch (err) {
    logError(
      `${err instanceof Error ? err.message : String(err)} Reinstall once with \`everyagent <source>\` to rebuild it.`,
    );
    process.exit(1);
  }
  if (!manifest) {
    logError(
      `No manifest found at ${manifestPath}. Reinstall your skills once with \`everyagent <source>\` to create one.`,
    );
    process.exit(1);
  }
  return { manifestPath, manifest };
}

type SyncActionKind = SyncEntryPlan['actions'][number]['kind'];

interface SyncActionStyle {
  readonly verb: string;
  readonly colour: (text: string) => string;
  readonly summary: string;
  readonly note?: string;
  /** `unchanged` is counted in the total but not worth a line per file. */
  readonly silent?: boolean;
}

/** Insertion order is the order the closing summary prints its counts in. */
const SYNC_ACTION_STYLES: Record<SyncActionKind, SyncActionStyle> = {
  create: { verb: '✔ Created', colour: pc.green, summary: 'created' },
  update: { verb: '✔ Updated', colour: pc.green, summary: 'updated' },
  delete: { verb: '✖ Deleted', colour: pc.red, summary: 'deleted' },
  'keep-local': {
    verb: '⚠ Local change',
    colour: pc.yellow,
    note: '(kept)',
    summary: 'local changes kept',
  },
  'keep-missing': {
    verb: '⚠ Missing on disk',
    colour: pc.yellow,
    note: '(left absent)',
    summary: 'missing',
  },
  untracked: {
    verb: '⚠ Not tracked',
    colour: pc.yellow,
    note: '(file exists, kept)',
    summary: 'not tracked',
  },
  unchanged: {
    verb: '= Up to date',
    colour: pc.dim,
    summary: 'up to date',
    silent: true,
  },
};

function printSyncPlanActions(
  plans: SyncEntryPlan[],
  prefix: string,
): Map<SyncActionKind, number> {
  const counts = new Map<SyncActionKind, number>();

  for (const plan of plans) {
    for (const action of plan.actions) {
      counts.set(action.kind, (counts.get(action.kind) ?? 0) + 1);
      const style = SYNC_ACTION_STYLES[action.kind];
      if (style.silent) continue;

      const display = plan.entry.global
        ? action.absolutePath
        : action.relativePath;
      const note = style.note ? ` ${pc.dim(style.note)}` : '';
      console.log(`${prefix}${style.colour(style.verb)} ${display}${note}`);
    }
  }

  return counts;
}

function formatSyncCounts(counts: Map<SyncActionKind, number>): string {
  return (Object.keys(SYNC_ACTION_STYLES) as SyncActionKind[])
    .filter((kind) => (counts.get(kind) ?? 0) > 0)
    .map((kind) => `${counts.get(kind)} ${SYNC_ACTION_STYLES[kind].summary}`)
    .join(', ');
}

function syncHeadline(parsed: {
  check: boolean;
  dryRun: boolean;
  anyDrift: boolean;
}): string {
  if (parsed.check) {
    return parsed.anyDrift ? 'Drift detected!' : 'All up to date!';
  }
  return parsed.dryRun ? 'Dry run complete!' : 'Sync complete!';
}

async function handleSync(parsed: {
  targetDir: string;
  global: boolean;
  yes: boolean;
  dryRun: boolean;
  check: boolean;
  json: boolean;
}): Promise<void> {
  const projectDir = path.resolve(parsed.targetDir);
  const { manifestPath, manifest } = requireManifest(projectDir, parsed.global);

  if (manifest.installs.length === 0) {
    if (parsed.json) {
      console.log(JSON.stringify({ entries: [], hasDrift: false }, null, 2));
    } else {
      logInfo('Manifest has no installed entries.');
    }
    return;
  }

  const groups = new Map<
    string,
    { fetchTarget: string; sourceFormat: FormatId; entries: ManifestInstallEntry[] }
  >();

  for (const entry of manifest.installs) {
    const fetchTarget = resolveManifestSourceForFetch(entry, projectDir);
    const key = `${fetchTarget}\0${entry.sourceFormat}`;
    const existing = groups.get(key);
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(key, {
        fetchTarget,
        sourceFormat: entry.sourceFormat,
        entries: [entry],
      });
    }
  }

  const plans: SyncEntryPlan[] = [];
  for (const group of groups.values()) {
    const { fetchResult, detections } = await fetchAndDetect(
      group.fetchTarget,
      group.sourceFormat,
    );
    const detection = detections[0];
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detection,
      fetchResult.subpathName,
    );

    for (const entry of group.entries) {
      const installDir = getInstallDir(entry, projectDir);
      const emitted = emitForSyncEntry(pkg, entry);
      const diskHashes = new Map<string, string | null>();
      for (const f of entry.files) {
        const rel = normalizePosixPath(f.path);
        diskHashes.set(rel, hashFile(resolveWithin(installDir, rel)));
      }
      for (const f of emitted) {
        const rel = normalizePosixPath(f.relativePath);
        if (!diskHashes.has(rel)) {
          diskHashes.set(rel, hashFile(resolveWithin(installDir, rel)));
        }
      }
      plans.push(planSyncForEntry(entry, emitted, diskHashes, installDir));
    }
  }

  const anyDrift = plans.some((p) => p.hasDrift);
  const deletePaths = plans.flatMap((p) =>
    p.actions
      .filter((a) => a.kind === 'delete')
      .map((a) => (p.entry.global ? a.absolutePath : a.relativePath)),
  );

  if (
    !parsed.check &&
    !parsed.dryRun &&
    deletePaths.length > 0 &&
    process.stdin.isTTY &&
    !parsed.yes &&
    !parsed.json
  ) {
    const confirmed = await promptConfirmSyncDeletions(deletePaths);
    if (!confirmed) {
      logInfo(pc.dim('Aborted. No files were changed.'));
      return;
    }
  }

  if (!parsed.check && !parsed.dryRun) {
    for (const plan of plans) {
      applySyncPlan(plan, { dryRun: false });
    }
    const now = new Date().toISOString();
    const updatedInstalls = plans.map((plan) => {
      const changed = plan.actions.some(
        (a) => a.kind === 'create' || a.kind === 'update' || a.kind === 'delete',
      );
      return {
        ...plan.entry,
        installedAt: changed ? now : plan.entry.installedAt,
        files: plan.nextFiles,
      };
    });
    writeManifest(manifestPath, { version: 1, installs: updatedInstalls });
  }

  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          dryRun: parsed.dryRun || parsed.check,
          hasDrift: anyDrift,
          entries: plans.map((p) => ({
            source: p.entry.source,
            subpath: p.entry.subpath,
            targetFormat: p.entry.targetFormat,
            installDir: p.installDir,
            hasDrift: p.hasDrift,
            actions: p.actions.map((a) => ({
              kind: a.kind,
              path: a.relativePath,
            })),
          })),
        },
        null,
        2,
      ),
    );
  } else {
    const prefix = parsed.dryRun || parsed.check ? `${pc.dim('[dry-run]')} ` : '';
    const counts = printSyncPlanActions(plans, prefix);

    const headline = syncHeadline({
      check: parsed.check,
      dryRun: parsed.dryRun,
      anyDrift,
    });
    const colouredHeadline =
      anyDrift && parsed.check ? pc.yellow(headline) : pc.green(headline);

    console.log('');
    console.log(`${pc.bold(colouredHeadline)} ${formatSyncCounts(counts)}.`);
  }

  if (parsed.check && anyDrift) {
    process.exit(1);
  }
}

/** Names on as few lines as fit, so a 15-skill install stays readable. */
function wrapNames(names: string[], width: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const name of names) {
    if (current && current.length + 2 + name.length > width) {
      lines.push(current);
      current = name;
    } else {
      current = current ? `${current}  ${name}` : name;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

async function handleList(parsed: {
  targetDir: string;
  global: boolean;
  json: boolean;
}): Promise<void> {
  const projectDir = path.resolve(parsed.targetDir);
  const { manifest } = requireManifest(projectDir, parsed.global);

  const items = await Promise.all(
    manifest.installs.map(async (entry) => {
      const drift = inspectInstallDrift(entry, projectDir);
      let sourceDrifted = false;
      const fetchTarget = resolveManifestSourceForFetch(entry, projectDir);
      if (path.isAbsolute(fetchTarget) && fs.existsSync(fetchTarget)) {
        try {
          const { fetchResult, detections } = await fetchAndDetect(
            fetchTarget,
            entry.sourceFormat,
          );
          const pkg = parseDetectedPackage(
            fetchResult.files,
            detections[0],
            fetchResult.subpathName,
          );
          const emitted = emitForSyncEntry(pkg, entry);
          const diskHashes = new Map<string, string | null>();
          for (const f of drift.files) {
            diskHashes.set(f.path, f.diskSha256);
          }
          const plan = planSyncForEntry(entry, emitted, diskHashes, drift.installDir);
          sourceDrifted = plan.actions.some(
            (a) => a.kind === 'create' || a.kind === 'update' || a.kind === 'delete',
          );
        } catch {
          sourceDrifted = false;
        }
      }
      const status =
        drift.modifiedCount === 0 && drift.missingCount === 0 && !sourceDrifted
          ? 'clean'
          : 'drifted';

      return {
        source: entry.source,
        ref: entry.ref,
        subpath: entry.subpath,
        sourceFormat: entry.sourceFormat,
        targetFormat: entry.targetFormat,
        global: entry.global,
        installDir: drift.installDir,
        installedAt: entry.installedAt,
        fileCount: entry.files.length,
        modifiedCount: drift.modifiedCount,
        missingCount: drift.missingCount,
        sourceDrifted,
        status,
        files: drift.files,
        skills: groupSkills(drift.files),
      };
    }),
  );

  if (parsed.json) {
    console.log(JSON.stringify({ installs: items }, null, 2));
    return;
  }

  if (items.length === 0) {
    logInfo('No installs recorded in manifest.');
    return;
  }

  for (const item of items) {
    const srcLabel = item.subpath ? `${item.source}/${item.subpath}` : item.source;
    const driftParts: string[] = [];
    if (item.modifiedCount > 0) driftParts.push(`${item.modifiedCount} modified`);
    if (item.missingCount > 0) driftParts.push(`${item.missingCount} missing`);
    if (item.sourceDrifted) driftParts.push('source moved on');
    const driftText =
      driftParts.length > 0
        ? pc.yellow(` (${driftParts.join(', ')})`)
        : pc.green(' (clean)');

    const countLabel =
      item.skills.length > 0
        ? `${plural(item.skills.length, 'skill')}, ${plural(item.fileCount, 'file')}`
        : plural(item.fileCount, 'file');

    console.log(
      `${pc.cyan('•')} ${pc.bold(srcLabel)} → ${FORMAT_META[item.targetFormat].label} · ${countLabel}${driftText}`,
    );
    if (item.global) {
      console.log(`  ${pc.dim(item.installDir)}`);
    }
    if (item.skills.length > 0) {
      const names = item.skills.map((skill) =>
        skill.drifted ? `${skill.name}*` : skill.name,
      );
      for (const line of wrapNames(names, 74)) {
        console.log(`    ${line}`);
      }
    }
  }
}

async function handleRemove(parsed: {
  source?: string;
  skills?: string[];
  all: boolean;
  targetDir: string;
  global: boolean;
  dryRun: boolean;
}): Promise<void> {
  const projectDir = path.resolve(parsed.targetDir);
  const { manifestPath, manifest } = requireManifest(projectDir, parsed.global);

  const plan = planRemove(
    manifest,
    {
      source: parsed.source,
      all: parsed.all,
      ...(parsed.skills ? { skills: parsed.skills } : {}),
    },
    projectDir,
  );

  if (plan.matchedEntries.length === 0) {
    const available = [...new Set(manifest.installs.map((i) => i.source))];
    logError(
      `No matching install for "${parsed.source ?? '--all'}" in manifest.${available.length > 0 ? ` Installed sources: ${available.join(', ')}` : ''}`,
    );
    process.exit(1);
  }

  if (plan.missingSkills.length > 0) {
    logError(`Not installed: ${plan.missingSkills.join(', ')}.`);
    const available = [
      ...new Set(plan.matchedEntries.flatMap((e) => groupSkills(e.files).map((s) => s.name))),
    ];
    if (available.length > 0) {
      logInfo(`Installed skills: ${available.join(', ')}.`);
    }
    process.exit(1);
  }

  applyRemovePlan(plan, { dryRun: parsed.dryRun });
  if (!parsed.dryRun) {
    writeManifest(manifestPath, plan.nextManifest);
  }

  const prefix = parsed.dryRun ? `${pc.dim('[dry-run]')} ` : '';
  for (const rel of plan.deletedPaths) {
    console.log(`${prefix}${pc.red('✖ Removed')} ${rel}`);
  }
  for (const rel of plan.alreadyMissingPaths) {
    console.log(`${prefix}${pc.dim(`= Already missing ${rel}`)}`);
  }

  // Edited files stay on disk and stay tracked. That is the expected outcome,
  // not a failure, so the exit code has to say so.
  if (plan.refusedPaths.length > 0) {
    logWarn(
      `Kept ${plan.refusedPaths.length} locally edited file${plan.refusedPaths.length === 1 ? '' : 's'} (content differs from manifest):`,
    );
    for (const rel of plan.refusedPaths) {
      console.log(`  ${rel}`);
    }
  }

  logSuccess(
    `${parsed.dryRun ? 'Would remove' : 'Removed'} ${plan.deletedPaths.length} file${plan.deletedPaths.length === 1 ? '' : 's'}.`,
  );
}

async function handleLint(parsed: {
  source: string;
  from: FormatId | 'auto';
  json: boolean;
}): Promise<void> {
  const { fetchResult, detections } = await fetchAndDetect(
    parsed.source,
    parsed.from,
  );
  const detection = detections[0];
  const findings = lintSourceFiles(fetchResult.files, detection.format, {
    subpathName: fetchResult.subpathName,
    allowLoose: detection.allowLoose,
  });

  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warning');

  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          source: fetchResult.source.displayLabel,
          format: detection.format,
          errors: errors.length,
          warnings: warnings.length,
          findings,
        },
        null,
        2,
      ),
    );
  } else if (findings.length === 0) {
    logSuccess(
      `No issues found in ${fetchResult.source.displayLabel} (${FORMAT_META[detection.format].label}).`,
    );
  } else {
    for (const f of findings) {
      const icon =
        f.severity === 'error' ? pc.red('✖') : pc.yellow('⚠');
      console.log(`${icon} [${f.rule}] ${f.file}: ${f.message}`);
    }
    console.log('');
    console.log(
      `Lint finished: ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`,
    );
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const parsed = parseCliArgs(process.argv);

  if (parsed.kind === 'help_or_version') {
    return;
  }

  if (parsed.kind === 'interactive') {
    await runInteractiveWizard();
    return;
  }

  if (parsed.kind === 'sync') {
    await handleSync(parsed);
    return;
  }

  if (parsed.kind === 'list') {
    await handleList(parsed);
    return;
  }

  if (parsed.kind === 'remove') {
    await handleRemove(parsed);
    return;
  }

  if (parsed.kind === 'lint') {
    await handleLint(parsed);
    return;
  }

  const { fetchResult, detections } = await fetchAndDetect(
    parsed.source,
    parsed.from,
  );

  let chosenDetection = detections[0];
  if (detections.length > 1) {
    for (const d of detections) {
      logInfo(`Detected: ${d.summary}`);
    }
    if (!process.stdin.isTTY) {
      const allSharedRoots = detections.every(isWeakRootRuleOnly);
      if (!allSharedRoots) {
        if (detections.every((d) => d.skillCount === 0)) {
          throw new Error(
            `No SKILL.md found in ${fetchResult.source.displayLabel}. everyagent converts skills, and this source only carries config files (${detections
              .flatMap((d) => d.matchedPaths.slice(0, 2))
              .join(', ')}).`,
          );
        }
        throw new Error(
          `Multiple formats detected (${detections.map((d) => d.format).join(', ')}). Specify one with --from <format>.`,
        );
      }
      const chosenPath = detections[0].matchedPaths[0];
      const others = [
        ...new Set(detections.slice(1).map((d) => d.matchedPaths[0])),
      ].filter((p) => p && p !== chosenPath);
      logInfo(
        `Reading ${chosenPath} as ${FORMAT_META[detections[0].format].label}${others.length > 0 ? `; also found ${others.join(', ')}, pass --from to read that instead` : ''}.`,
      );
    } else {
      chosenDetection = await promptSourceFormatSelection(detections);
    }
  }

  const pkg = parseDetectedPackage(
    fetchResult.files,
    chosenDetection,
    fetchResult.subpathName,
  );

  logInfo(
    `${formatDetectedHeader(fetchResult.source.displayLabel, chosenDetection.format)} — ${formatSelectionCounts(pkg)}`,
  );

  let selection: PackageSelection | undefined;
  if (parsed.skills) {
    selection = {
      skillNames: parsed.skills,
      includeRootRules: false,
      includeSharedAssets: false,
    };
  } else if (
    !parsed.yes &&
    !parsed.dryRun &&
    process.stdin.isTTY &&
    shouldPromptTranslationScope(pkg)
  ) {
    const overview = formatPackageOverview(pkg);
    if (overview) {
      console.log(overview);
    }
    const pickedScope = await promptTranslationScope(pkg);
    if (!pickedScope) {
      logInfo(pc.dim('Aborted. No files were written.'));
      return;
    }
    selection = pickedScope;
  }

  if (parsed.withConfig) {
    selection = { ...(selection ?? {}), includeConfigAssets: true };
  }

  const filteredPkg = filterPackage(pkg, selection);

  let targetFormats = parsed.targets;
  let wasAutoDetected = false;
  if (!targetFormats) {
    const excludeSourceWhenLocal =
      fetchResult.source.type === 'local' &&
      !parsed.global &&
      path.resolve(fetchResult.source.localPath) === path.resolve(parsed.targetDir);

    const detected = detectTargetFormats({
      targetDir: parsed.targetDir,
      global: parsed.global,
      sourceFormat: chosenDetection.format,
      excludeSourceWhenLocal,
    });

    if (detected.formats.length > 0) {
      logInfo(
        `Auto-detected target${detected.formats.length === 1 ? '' : 's'} (${detected.scope === 'project' ? 'from project' : 'installed on this machine'}): ${detected.formats.map((id) => FORMAT_META[id].label).join(', ')}`,
      );
      if (
        !process.stdin.isTTY ||
        parsed.yes ||
        parsed.dryRun ||
        detected.formats.length === 1
      ) {
        targetFormats = detected.formats;
        wasAutoDetected = true;
      } else {
        targetFormats = await promptTargetFormatSelection(
          chosenDetection.format,
          detected.formats,
        );
      }
    } else {
      if (!process.stdin.isTTY) {
        throw new Error(
          `Could not auto-detect any target format. Specify -t, --to <${FORMAT_IDS.join('|')}|all>.`,
        );
      }
      targetFormats = await promptTargetFormatSelection(chosenDetection.format);
    }
  }

  let destinationLabel = parsed.global
    ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
    : parsed.targetDir;

  let effectiveForce = parsed.force;
  let overwritePaths = new Set<string>();

  if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY) {
    const sourceName = FORMAT_META[chosenDetection.format].label.split(' ')[0];
    const selectionSummary = formatSelectionCounts(filteredPkg);
    let alreadyPreviewed = false;
    let actionChoice: WriteActionChoice = 'cancel';

    while (true) {
      const { summary: preview, plannedTargets: previewTargets } = convertAndWrite({
        files: fetchResult.files,
        pkg: filteredPkg,
        sourceFormat: chosenDetection.format,
        targetFormats,
        targetDir: parsed.targetDir,
        global: parsed.global,
        force: parsed.force,
        dryRun: true,
        subpathName: fetchResult.subpathName,
        allowLoose: chosenDetection.allowLoose,
      });

      if (
        preview.created === 0 &&
        preview.skipped === 0 &&
        preview.conflict === 0 &&
        preview.unchanged > 0
      ) {
        recordManifestEntries({
          targetDir: parsed.targetDir,
          global: parsed.global,
          parsedSource: fetchResult.source,
          sourceFormat: chosenDetection.format,
          selection,
          plannedTargets: previewTargets,
          summary: preview,
        });
        logInfo(`Already up to date! ${formatSummaryCounts(preview)}.`);
        return;
      }

      if (preview.skipped > 0 && !parsed.force) {
        overwritePaths = await promptConflictResolution(
          preview.actions,
          parsed.global,
        );
        actionChoice = 'write';
        break;
      }

      actionChoice = await promptWriteAction({
        sourceLabel: sourceName,
        targetFormats,
        destinationLabel,
        selectionSummary,
        alreadyPreviewed,
        defaultForce: parsed.force,
        preview,
        allowChangeTarget: wasAutoDetected,
      });

      if (actionChoice === 'dry_run') {
        for (const action of preview.actions) {
          if (action.status !== 'unchanged') {
            console.log(formatActionLine(action, parsed.global));
          }
        }
        logInfo(`Dry run: ${formatSummaryCounts(preview)}.`);
        alreadyPreviewed = true;
        continue;
      }

      if (actionChoice === 'change_target') {
        targetFormats = await promptTargetFormatSelection(
          chosenDetection.format,
          targetFormats,
        );
        destinationLabel = parsed.global
          ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
          : parsed.targetDir;
        alreadyPreviewed = false;
        continue;
      }

      effectiveForce = actionChoice === 'force';
      break;
    }

    if (actionChoice === 'cancel') {
      logInfo(pc.dim('Aborted. No files were written.'));
      return;
    }
  }

  const { summary, plannedTargets } = convertAndWrite({
    files: fetchResult.files,
    pkg: filteredPkg,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir: parsed.targetDir,
    global: parsed.global,
    force: effectiveForce,
    overwrite: overwritePaths,
    dryRun: parsed.dryRun,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose,
  });

  if (!parsed.dryRun) {
    recordManifestEntries({
      targetDir: parsed.targetDir,
      global: parsed.global,
      parsedSource: fetchResult.source,
      sourceFormat: chosenDetection.format,
      selection,
      plannedTargets,
      summary,
    });
  }

  logWriteSummary(summary, {
    dryRun: parsed.dryRun,
    global: parsed.global,
    showForceHint:
      !effectiveForce &&
      (parsed.dryRun || parsed.yes || !process.stdin.isTTY),
  });
}

main().catch((err) => {
  logError(err instanceof Error ? err.message : String(err));
  process.exit(err instanceof CliUsageError ? 2 : 1);
});
