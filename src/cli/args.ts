import { cac } from 'cac';
import pkg from '../../package.json' with { type: 'json' };
import { resolveFormatAlias, suggestFormat } from '../core/fuzzy.js';
import { FORMAT_IDS, type FormatId } from '../core/ir.js';

export class CliUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliUsageError';
  }
}

export type CliParseResult =
  | { kind: 'help_or_version' }
  | { kind: 'interactive' }
  | {
      kind: 'command';
      source: string;
      targets?: FormatId[];
      skills?: string[];
      from: FormatId | 'auto';
      targetDir: string;
      global: boolean;
      yes: boolean;
      dryRun: boolean;
      force: boolean;
      withConfig: boolean;
    }
  | {
      kind: 'sync';
      targetDir: string;
      global: boolean;
      yes: boolean;
      dryRun: boolean;
      check: boolean;
      json: boolean;
    }
  | {
      kind: 'list';
      targetDir: string;
      global: boolean;
      json: boolean;
    }
  | {
      kind: 'remove';
      source?: string;
      skills?: string[];
      all: boolean;
      targetDir: string;
      global: boolean;
      dryRun: boolean;
    }
  | {
      kind: 'lint';
      source: string;
      from: FormatId | 'auto';
      json: boolean;
    };

export function parseTargetFormats(raw: string): FormatId[] {
  const tokens = raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new CliUsageError(
      `Target format cannot be empty. Expected: ${FORMAT_IDS.join(', ')}, or all.`,
    );
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

    const fmt = resolveFormatAlias(token);
    if (!fmt) {
      const suggestion = suggestFormat(token);
      throw new CliUsageError(
        `Unsupported target format "${token}".${suggestion ? ` Did you mean "${suggestion}"?` : ''} Valid targets: ${FORMAT_IDS.join(', ')}, all.`,
      );
    }

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
  const resolved = resolveFormatAlias(value);
  if (!resolved) {
    const suggestion = suggestFormat(value);
    throw new CliUsageError(
      `Unsupported source format "${value}".${suggestion ? ` Did you mean "${suggestion}"?` : ''} Valid formats: auto, ${FORMAT_IDS.join(', ')}.`,
    );
  }
  return resolved;
}

/** Parse `-s, --skill` values (comma-separated and/or repeated), deduplicating case-insensitively. */
export function parseSkillSelection(raw: unknown): string[] {
  const entries = Array.isArray(raw) ? raw : [raw];
  const seen = new Set<string>();
  const resolved: string[] = [];

  for (const entry of entries) {
    if (typeof entry !== 'string') {
      continue;
    }
    for (const part of entry.split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        resolved.push(trimmed);
      }
    }
  }

  if (resolved.length === 0) {
    throw new CliUsageError(
      'Skill selection cannot be empty. Provide one or more comma-separated skill names.',
    );
  }

  return resolved;
}

function resolveExplicitPath(
  argv: string[],
  opts: Record<string, unknown>,
  positionalDest?: string,
): string {
  const explicitPathFlag =
    argv.includes('-p') ||
    argv.includes('--path') ||
    argv.some((a) => a.startsWith('--path='));

  return explicitPathFlag
    ? String(opts.path ?? '.')
    : (positionalDest ?? String(opts.path ?? '.'));
}

function parseSubcommand(
  subcmd: 'sync' | 'list' | 'remove' | 'lint',
  argv: string[],
): CliParseResult {
  const subArgv = [argv[0], argv[1], ...argv.slice(3)];
  const cli = cac(`everyagent ${subcmd}`);

  if (subcmd === 'sync') {
    cli
      .command('[dest]', 'Re-fetch and update installed skills without overwriting local edits')
      .option('-p, --path <dir>', 'Project directory', { default: '.' })
      .option('-g, --global', 'Sync global manifest (~/.everyagent/manifest.json)')
      .option('-y, --yes', 'Confirm deletions without prompting')
      .option('-d, --dry-run', 'Preview sync changes without touching disk')
      .option('--check', 'Exit with code 1 if any tracked file or source has drifted')
      .option('--json', 'Output sync report as JSON');
    cli.help();
    const parsed = cli.parse(subArgv, { run: false });
    const opts = parsed.options as Record<string, unknown>;
    if (opts.help || opts.version) return { kind: 'help_or_version' };
    if (parsed.args.length > 1) {
      throw new CliUsageError(`Unexpected argument "${parsed.args[1]}" for sync.`);
    }
    return {
      kind: 'sync',
      targetDir: resolveExplicitPath(subArgv, opts, parsed.args[0]),
      global: Boolean(opts.global),
      yes: Boolean(opts.yes),
      dryRun: Boolean(opts.dryRun),
      check: Boolean(opts.check),
      json: Boolean(opts.json),
    };
  }

  if (subcmd === 'list') {
    cli
      .command('[dest]', 'List installed skills and check for drift')
      .option('-p, --path <dir>', 'Project directory', { default: '.' })
      .option('-g, --global', 'List global manifest (~/.everyagent/manifest.json)')
      .option('--json', 'Output installed list as JSON');
    cli.help();
    const parsed = cli.parse(subArgv, { run: false });
    const opts = parsed.options as Record<string, unknown>;
    if (opts.help || opts.version) return { kind: 'help_or_version' };
    if (parsed.args.length > 1) {
      throw new CliUsageError(`Unexpected argument "${parsed.args[1]}" for list.`);
    }
    return {
      kind: 'list',
      targetDir: resolveExplicitPath(subArgv, opts, parsed.args[0]),
      global: Boolean(opts.global),
      json: Boolean(opts.json),
    };
  }

  if (subcmd === 'remove') {
    cli
      .command('[source] [dest]', 'Remove untouched files installed from a source')
      .option('--all', 'Remove all tracked installs in the manifest')
      .option(
        '-s, --skill <names>',
        'Only remove specific skill(s), comma-separated',
      )
      .option('-p, --path <dir>', 'Project directory', { default: '.' })
      .option('-g, --global', 'Remove from global manifest (~/.everyagent/manifest.json)')
      .option('-d, --dry-run', 'Preview removals without touching disk');
    cli.help();
    const parsed = cli.parse(subArgv, { run: false });
    const opts = parsed.options as Record<string, unknown>;
    if (opts.help || opts.version) return { kind: 'help_or_version' };
    const all = Boolean(opts.all);
    const skills =
      opts.skill !== undefined ? parseSkillSelection(opts.skill) : undefined;
    if (all && skills) {
      throw new CliUsageError('Use either --all or --skill, not both.');
    }
    const source = all ? undefined : parsed.args[0];
    const destArg = all ? parsed.args[0] : parsed.args[1];
    if (!all && !source) {
      throw new CliUsageError(
        'Missing source for remove. Specify <source> or --all.',
      );
    }
    if ((all && parsed.args.length > 1) || (!all && parsed.args.length > 2)) {
      throw new CliUsageError('Too many arguments for remove.');
    }
    return {
      kind: 'remove',
      ...(source ? { source } : {}),
      ...(skills ? { skills } : {}),
      all,
      targetDir: resolveExplicitPath(subArgv, opts, destArg),
      global: Boolean(opts.global),
      dryRun: Boolean(opts.dryRun),
    };
  }

  cli
    .command('[source]', 'Check skills for frontmatter, naming, and link issues')
    .option(
      '-f, --from <format>',
      `Override source auto-detection (auto, ${FORMAT_IDS.join(', ')})`,
      { default: 'auto' },
    )
    .option('--json', 'Output lint findings as JSON');
  cli.help();
  const parsed = cli.parse(subArgv, { run: false });
  const opts = parsed.options as Record<string, unknown>;
  if (opts.help || opts.version) return { kind: 'help_or_version' };
  if (parsed.args.length > 1) {
    throw new CliUsageError(`Unexpected argument "${parsed.args[1]}" for lint.`);
  }
  return {
    kind: 'lint',
    source: parsed.args[0] ?? '.',
    from: parseSourceFormat(typeof opts.from === 'string' ? opts.from : undefined),
    json: Boolean(opts.json),
  };
}

export function parseCliArgs(argv: string[]): CliParseResult {
  const firstArg = argv[2];
  if (
    firstArg === 'sync' ||
    firstArg === 'list' ||
    firstArg === 'remove' ||
    firstArg === 'lint'
  ) {
    return parseSubcommand(firstArg, argv);
  }

  const cli = cac('everyagent');

  cli
    .command(
      '[source] [dest]',
      'Convert and install AI-agent skills from a GitHub repo or local directory',
    )
    .option(
      '-t, --to <targets>',
      `Target format(s): ${FORMAT_IDS.join(', ')}, or all`,
    )
    .option(
      '-s, --skill <names>',
      'Only translate specific skill(s), comma-separated',
    )
    .option('-p, --path <dir>', 'Destination project directory', {
      default: '.',
    })
    .option(
      '-f, --from <format>',
      `Override source auto-detection (auto, ${FORMAT_IDS.join(', ')})`,
      { default: 'auto' },
    )
    .option('-g, --global', 'Install to user global agent config directory')
    .option('-y, --yes', 'Skip confirmation prompt')
    .option('-d, --dry-run', 'Preview planned actions without writing files')
    .option('--force', 'Overwrite existing files instead of skipping')
    .option(
      '--with-config',
      'Also copy settings, hooks, and MCP files (often hold secrets)',
    )
    .example('everyagent')
    .example('everyagent owner/repo -t claude')
    .example('everyagent owner/repo -t claude -s react-hooks,api-design')
    .example('everyagent https://github.com/u/r -t opencode ./app -y')
    .example('everyagent sync')
    .example('everyagent list')
    .example('everyagent remove owner/repo')
    .example('everyagent remove owner/repo -s react-hooks,api-design');

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
      opts.skill !== undefined ||
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
    throw new CliUsageError(
      'Missing source repository or path. Run `everyagent` with no arguments for the interactive wizard, or `everyagent --help` for usage.',
    );
  }

  const from = parseSourceFormat(
    typeof opts.from === 'string' ? opts.from : undefined,
  );
  const targets =
    typeof opts.to === 'string' ? parseTargetFormats(opts.to) : undefined;
  const skills =
    opts.skill !== undefined ? parseSkillSelection(opts.skill) : undefined;

  const targetDir = resolveExplicitPath(argv, opts, destArg);

  return {
    kind: 'command',
    source: sourceArg,
    targets,
    ...(skills ? { skills } : {}),
    from,
    targetDir,
    global: Boolean(opts.global),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    force: Boolean(opts.force),
    withConfig: Boolean(opts.withConfig),
  };
}
