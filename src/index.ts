import pc from 'picocolors';
import { getAdapter } from './adapters/registry.js';
import { FORMAT_META } from './core/ir.js';
import { convertAndWrite, fetchAndDetect } from './core/pipeline.js';
import { parseCliArgs } from './cli/args.js';
import { logError, logInfo, logWriteSummary } from './cli/logger.js';
import {
  promptConfirmation,
  promptSourceFormatSelection,
  promptTargetFormatSelection,
  runInteractiveWizard,
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

  for (const d of detections) {
    logInfo(`Detected: ${d.summary}`);
  }

  let chosenDetection = detections[0];
  if (detections.length > 1) {
    if (!process.stdin.isTTY) {
      throw new Error(
        `Multiple formats detected (${detections.map((d) => d.format).join(', ')}). Specify one with --from <format>.`,
      );
    }
    chosenDetection = await promptSourceFormatSelection(detections);
  }

  let targetFormats = parsed.targets;
  if (!targetFormats) {
    if (!process.stdin.isTTY) {
      throw new Error(
        'Missing target format. Specify -t, --to <claude|opencode|codex|cursor|all>.',
      );
    }
    targetFormats = await promptTargetFormatSelection();
  }

  const destinationLabel = parsed.global
    ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
    : parsed.targetDir;

  if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY) {
    const sourceName = FORMAT_META[chosenDetection.format].label.split(' ')[0];
    const ok = await promptConfirmation(
      sourceName,
      targetFormats,
      destinationLabel,
    );
    if (!ok) {
      logInfo(pc.dim('Aborted. No files were written.'));
      return;
    }
  }

  const { summary } = convertAndWrite({
    files: fetchResult.files,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir: parsed.targetDir,
    global: parsed.global,
    force: parsed.force,
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
