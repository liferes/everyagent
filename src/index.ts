import path from 'node:path';
import pc from 'picocolors';
import { getAdapter } from './adapters/registry.js';
import { detectTargetFormats } from './core/detector.js';
import { FORMAT_META } from './core/ir.js';
import {
  convertAndWrite,
  fetchAndDetect,
  filterPackage,
  parseDetectedPackage,
  shouldPromptTranslationScope,
  type PackageSelection,
} from './core/pipeline.js';
import { parseCliArgs } from './cli/args.js';
import {
  formatActionLine,
  formatSummaryCounts,
  logError,
  logInfo,
  logWriteSummary,
} from './cli/logger.js';
import {
  formatDetectedHeader,
  formatPackageOverview,
  formatSelectionCounts,
  promptSourceFormatSelection,
  promptTargetFormatSelection,
  promptTranslationScope,
  promptWriteAction,
  runInteractiveWizard,
  type WriteActionChoice,
} from './cli/prompts.js';

async function main(): Promise<void> {
  const parsed = parseCliArgs(process.argv);

  if (parsed.kind === 'help_or_version') {
    return;
  }

  if (parsed.kind === 'interactive') {
    await runInteractiveWizard();
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
      // AGENTS.md is the root rule for both OpenCode and Codex. When it is the
      // only evidence, both adapters read the exact same file, so asking for
      // --from just to break a tie that changes nothing is noise.
      const sharedRootOnly = detections.every(
        (d) =>
          d.skillCount === 0 &&
          d.matchedPaths.length > 0 &&
          d.matchedPaths.every((p) => p === 'AGENTS.md'),
      );
      if (!sharedRootOnly) {
        throw new Error(
          `Multiple formats detected (${detections.map((d) => d.format).join(', ')}). Specify one with --from <format>.`,
        );
      }
      logInfo(
        `AGENTS.md is shared by OpenCode and Codex; reading it as ${FORMAT_META[detections[0].format].label}.`,
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

  const filteredPkg = selection ? filterPackage(pkg, selection) : pkg;

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
          'Could not auto-detect any target format. Specify -t, --to <claude|opencode|codex|cursor|all>.',
        );
      }
      targetFormats = await promptTargetFormatSelection(chosenDetection.format);
    }
  }

  let destinationLabel = parsed.global
    ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
    : parsed.targetDir;

  let effectiveForce = parsed.force;
  if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY) {
    const sourceName = FORMAT_META[chosenDetection.format].label.split(' ')[0];
    const selectionSummary = formatSelectionCounts(filteredPkg);
    let alreadyPreviewed = false;
    let actionChoice: WriteActionChoice = 'cancel';

    while (true) {
      const { summary: preview } = convertAndWrite({
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
        logInfo(`Already up to date! ${formatSummaryCounts(preview)}.`);
        return;
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
          console.log(formatActionLine(action, parsed.global));
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

      break;
    }

    if (actionChoice === 'cancel') {
      logInfo(pc.dim('Aborted. No files were written.'));
      return;
    }

    effectiveForce = actionChoice === 'force';
  }

  const { summary } = convertAndWrite({
    files: fetchResult.files,
    pkg: filteredPkg,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir: parsed.targetDir,
    global: parsed.global,
    force: effectiveForce,
    dryRun: parsed.dryRun,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose,
  });

  logWriteSummary(summary, {
    dryRun: parsed.dryRun,
    global: parsed.global,
  });
}

main().catch((err) => {
  logError(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
