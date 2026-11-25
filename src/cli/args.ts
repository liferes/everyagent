import { cac } from 'cac';
import pkg from '../../package.json' with { type: 'json' };
import { resolveFormatAlias, suggestFormat } from '../core/fuzzy.js';
import { FORMAT_IDS, type FormatId } from '../core/ir.js';

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
    }

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

    const fmt = resolveFormatAlias(token);
    if (!fmt) {
      const suggestion = suggestFormat(token);
      throw new Error(
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
    throw new Error(
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
    throw new Error(
      'Skill selection cannot be empty. Provide one or more comma-separated skill names.',
    );
  }

  return resolved;
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
    .option(
      '-s, --skill <names>',
      'Only translate specific skill(s), comma-separated',
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
    .example('uniskill owner/repo -t claude -s react-hooks,api-design')
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
    throw new Error(
      'Missing source repository or path. Run `uniskill` with no arguments for the interactive wizard, or `uniskill --help` for usage.',
    );
  }

  const from = parseSourceFormat(
    typeof opts.from === 'string' ? opts.from : undefined,
  );
  const targets =
    typeof opts.to === 'string' ? parseTargetFormats(opts.to) : undefined;
  const skills =
    opts.skill !== undefined ? parseSkillSelection(opts.skill) : undefined;

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
    ...(skills ? { skills } : {}),
    from,
    targetDir,
    global: Boolean(opts.global),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    force: Boolean(opts.force),
  };
}
