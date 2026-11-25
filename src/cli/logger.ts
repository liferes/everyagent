import pc from 'picocolors';
import type { WriteAction, WriteSummary } from '../core/writer.js';

export function logInfo(message: string): void {
  console.log(`${pc.cyan('ℹ')} ${message}`);
}

export function logSuccess(message: string): void {
  console.log(`${pc.green('✔')} ${message}`);
}

export function logWarn(message: string): void {
  console.log(`${pc.yellow('⚠')} ${message}`);
}

export function logError(message: string): void {
  console.error(`${pc.red('✖')} ${message}`);
}

export function formatActionLine(action: WriteAction, globalMode = false): string {
  const prefix = action.dryRun ? `${pc.dim('[dry-run]')} ` : '';
  const displayPath = globalMode ? action.absolutePath : action.relativePath;

  switch (action.status) {
    case 'created':
      return `${prefix}${pc.green('✔ Created')} ${displayPath}`;
    case 'overwritten':
      return `${prefix}${pc.green('✔ Overwrote')} ${displayPath}`;
    case 'unchanged':
      return `${prefix}${pc.dim(`= Up to date ${displayPath}`)}`;
    case 'skipped':
      return `${prefix}${pc.yellow('⚠ Skipped')} ${displayPath} ${pc.dim('(differs on disk)')}`;
    case 'duplicate':
      return `${prefix}${pc.dim(`≡ ${displayPath} (written once for both targets)`)}`;
    case 'conflict':
      return `${prefix}${pc.yellow('⚠ Conflict')} ${displayPath} ${pc.dim('(second target wanted different content; first kept)')}`;
  }
}

export function formatSummaryCounts(summary: WriteSummary): string {
  const parts: string[] = [];
  if (
    summary.created > 0 ||
    (summary.overwritten === 0 && summary.unchanged === 0)
  ) {
    parts.push(`${summary.created} created`);
  }
  if (summary.overwritten > 0) {
    parts.push(`${summary.overwritten} overwritten`);
  }
  if (summary.unchanged > 0) {
    parts.push(`${summary.unchanged} up to date`);
  }
  if (summary.skipped > 0 || summary.unchanged === 0) {
    parts.push(`${summary.skipped} skipped`);
  }
  if (summary.duplicate > 0) {
    parts.push(`${summary.duplicate} shared`);
  }
  if (summary.conflict > 0) {
    parts.push(`${summary.conflict} conflict${summary.conflict === 1 ? '' : 's'}`);
  }
  return parts.join(', ');
}

export function logWriteSummary(
  summary: WriteSummary,
  options: { dryRun?: boolean; global?: boolean; showForceHint?: boolean } = {},
): void {
  const skippedActions: WriteAction[] = [];

  for (const action of summary.actions) {
    if (action.status === 'unchanged') {
      continue;
    }
    if (action.status === 'skipped') {
      skippedActions.push(action);
      continue;
    }
    console.log(formatActionLine(action, options.global));
  }

  if (skippedActions.length > 0) {
    const prefix = options.dryRun ? `${pc.dim('[dry-run]')} ` : '';
    console.log(`${prefix}${pc.yellow('⚠ Differs on disk:')}`);
    for (const action of skippedActions) {
      const displayPath = options.global ? action.absolutePath : action.relativePath;
      console.log(`  ${displayPath}`);
    }
  }

  const isAllUpToDate =
    !options.dryRun &&
    summary.created === 0 &&
    summary.overwritten === 0 &&
    summary.skipped === 0 &&
    summary.conflict === 0 &&
    summary.unchanged > 0;
  const verb = options.dryRun
    ? 'Dry run complete!'
    : isAllUpToDate
      ? 'Already up to date!'
      : 'Done!';
  console.log('');
  console.log(`${pc.bold(pc.green(verb))} ${formatSummaryCounts(summary)}.`);

  if (skippedActions.length > 0 && options.showForceHint !== false) {
    logWarn(
      `${skippedActions.length} file${skippedActions.length === 1 ? '' : 's'} differ${skippedActions.length === 1 ? 's' : ''} on disk and ${skippedActions.length === 1 ? 'was' : 'were'} kept. Re-run with --force to replace ${skippedActions.length === 1 ? 'it' : 'them'}.`,
    );
  }

  if (summary.conflict > 0) {
    logWarn(
      'Two target formats share a file name and produced different content. Install them one at a time with -t <format> if you need both.',
    );
  }

  console.log(
    pc.dim('Always double-check the output in case some skills were not detected.'),
  );
}
