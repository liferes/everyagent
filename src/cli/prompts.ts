import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getAdapter } from '../adapters/registry.js';
import type { DetectionResult } from '../adapters/types.js';
import { parseGitHubSource } from '../core/fetcher.js';
import { FORMAT_IDS, FORMAT_META, type FormatId } from '../core/ir.js';
import { convertAndWrite, fetchAndDetect } from '../core/pipeline.js';
import { formatActionLine } from './logger.js';

function assertNotCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
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

export async function promptTargetFormatSelection(): Promise<FormatId[]> {
  const selected = assertNotCancelled(
    await p.multiselect({
      message: 'Select target format(s) to generate:',
      options: [
        { value: 'all', label: 'All supported formats' },
        ...FORMAT_IDS.map((id) => ({
          value: id,
          label: FORMAT_META[id].label,
        })),
      ],
      required: true,
    }),
  );

  if (selected.includes('all')) {
    return [...FORMAT_IDS];
  }
  return selected as FormatId[];
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

/** No arguments: ask for everything. */
export async function runInteractiveWizard(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(' uniskill ')));

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

  let fetchResult;
  let detections: DetectionResult[];
  try {
    const res = await fetchAndDetect(sourceInput.trim(), 'auto');
    fetchResult = res.fetchResult;
    detections = res.detections;
    spin.stop(`Detected: ${detections.map((d) => d.summary).join(' | ')}`);
  } catch (err) {
    spin.stop('Fetch failed');
    p.log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  const chosenDetection =
    detections.length === 1
      ? detections[0]
      : await promptSourceFormatSelection(detections);

  const targetFormats = await promptTargetFormatSelection();

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

  const destinationLabel = isGlobal
    ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(', ')
    : targetDir;

  const sourceName = FORMAT_META[chosenDetection.format].label.split(' ')[0];
  const confirmed = await promptConfirmation(
    sourceName,
    targetFormats,
    destinationLabel,
  );

  if (!confirmed) {
    p.cancel('Aborted. No files were written.');
    return;
  }

  const { summary } = convertAndWrite({
    files: fetchResult.files,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir,
    global: isGlobal,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose,
  });

  for (const action of summary.actions) {
    console.log(formatActionLine(action, isGlobal));
  }

  p.outro(
    `${pc.green('Done!')} ${summary.created} created, ${summary.skipped} skipped.`,
  );
}
