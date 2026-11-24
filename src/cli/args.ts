import { cac } from 'cac';
import pkg from '../../package.json' with { type: 'json' };
import { FORMAT_IDS, type FormatId } from '../core/ir.js';

export type CliParseResult =
  | { kind: 'help_or_version' }
  | { kind: 'interactive' }
  | {
      kind: 'command';
      source: string;
      targets?: FormatId[];
      from: FormatId | 'auto';
      targetDir: string;
      global: boolean;
      yes: boolean;
      dryRun: boolean;
      force: boolean;
    };

const VALID_FORMAT_SET = new Set<string>(FORMAT_IDS);

/** `all` expands in place; repeats collapse. */
export function parseTargetFormats(raw: string): FormatId[] {
  const tokens = raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new Error('Target format cannot be empty. Expected: claude, opencode, codex, cursor, or all.');
  }

  const resolved: FormatId[] = [];
  for (const token of tokens) {
    if (token === 'all') {
      for (const id of FORMAT_IDS) {
        if (!resolved.includes(id)) {
          resolved.push(id);
        }
      }
      continue;
    }

    if (!VALID_FORMAT_SET.has(token)) {
      throw new Error(
        `Unsupported target format "${token}". Valid targets: ${FORMAT_IDS.join(', ')}, all.`,
      );
    }

    const fmt = token as FormatId;
    if (!resolved.includes(fmt)) {
      resolved.push(fmt);
    }
  }

  return resolved;
}

/** `--from` override. Anything unrecognised is a typo, not a guess. */
export function parseSourceFormat(raw?: string): FormatId | 'auto' {
  const value = (raw ?? 'auto').trim().toLowerCase();
  if (value === 'auto') {
    return 'auto';
  }
  if (!VALID_FORMAT_SET.has(value)) {
    throw new Error(
      `Unsupported source format "${value}". Valid formats: auto, ${FORMAT_IDS.join(', ')}.`,
    );
  }
  return value as FormatId;
}

export function parseCliArgs(argv: string[]): CliParseResult {
  const cli = cac('uniskill');

  cli
    .command(
      '[source] [dest]',
      'Convert and install AI-agent skills from a GitHub repo or local directory',
    )
    .option(
      '-t, --to <targets>',
      'Target format(s): claude, opencode, codex, cursor, or all',
    )
    .option('-p, --path <dir>', 'Destination project directory', {
      default: '.',
    })
    .option(
      '-f, --from <format>',
      'Override source auto-detection (auto, cursor, claude, opencode, codex)',
      { default: 'auto' },
    )
    .option('-g, --global', 'Install to user global agent config directory')
    .option('-y, --yes', 'Skip confirmation prompt')
    .option('-d, --dry-run', 'Preview planned actions without writing files')
    .option('--force', 'Overwrite existing files instead of skipping')
    .example('uniskill')
    .example('uniskill owner/repo -t claude')
    .example('uniskill https://github.com/u/r -t opencode ./app -y')
    .example('uniskill owner/repo/tree/main/skills/ui -t codex')
    .example('uniskill owner/repo -t claude,opencode,codex')
    .example('uniskill owner/repo -t opencode -g')
    .example('uniskill owner/repo -t claude --dry-run');

  cli.help();
  cli.version(pkg.version);

  const parsed = cli.parse(argv, { run: false });
  const opts = parsed.options as Record<string, unknown>;

  if (opts.help || opts.version) {
    return { kind: 'help_or_version' };
  }

  const sourceArg = parsed.args[0];
  const destArg = parsed.args[1];

  const hasActionFlags = Boolean(
    opts.to ||
      opts.global ||
      opts.yes ||
      opts.dryRun ||
      opts.force ||
      (opts.from && opts.from !== 'auto') ||
      (opts.path && opts.path !== '.'),
  );

  if (!sourceArg && !hasActionFlags) {
    return { kind: 'interactive' };
  }

  if (!sourceArg) {
    throw new Error(
      'Missing source repository or path. Run `uniskill` with no arguments for the interactive wizard, or `uniskill --help` for usage.',
    );
  }

  const from = parseSourceFormat(
    typeof opts.from === 'string' ? opts.from : undefined,
  );
  const targets =
    typeof opts.to === 'string' ? parseTargetFormats(opts.to) : undefined;

  const explicitPathFlag =
    argv.includes('-p') ||
    argv.includes('--path') ||
    argv.some((a) => a.startsWith('--path='));

  const targetDir = explicitPathFlag
    ? String(opts.path ?? '.')
    : (destArg ?? String(opts.path ?? '.'));

  return {
    kind: 'command',
    source: sourceArg,
    targets,
    from,
    targetDir,
    global: Boolean(opts.global),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    force: Boolean(opts.force),
  };
}
