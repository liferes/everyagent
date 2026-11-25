import type { FormatId, SourceFile } from '../core/ir.js';
import { claudeAdapter } from './claude.js';
import { codexAdapter } from './codex.js';
import { cursorAdapter } from './cursor.js';
import { opencodeAdapter } from './opencode.js';
import type { Adapter, DetectionResult, ParseOptions } from './types.js';

const ADAPTERS: readonly Adapter[] = [
  cursorAdapter,
  claudeAdapter,
  opencodeAdapter,
  codexAdapter,
];

const ADAPTER_MAP: Record<FormatId, Adapter> = {
  cursor: cursorAdapter,
  claude: claudeAdapter,
  opencode: opencodeAdapter,
  codex: codexAdapter,
};

export function getAdapter(id: FormatId): Adapter {
  return ADAPTER_MAP[id];
}

export function getAllAdapters(): readonly Adapter[] {
  return ADAPTERS;
}

/**
 * Ask every adapter. AGENTS.md is shared by OpenCode and Codex, so the
 * ambiguous votes get sorted out afterwards.
 */
export function detectFormats(
  files: SourceFile[],
  options?: ParseOptions,
): DetectionResult[] {
  const strictResults: DetectionResult[] = [];

  for (const adapter of ADAPTERS) {
    const detected = adapter.detect(files, { ...options, allowLoose: false });
    if (detected) {
      strictResults.push(detected);
    }
  }

  if (strictResults.length > 0) {
    const hasOpencodeDir = strictResults.some(
      (r) =>
        r.format === 'opencode' &&
        r.matchedPaths.some((p) => p.startsWith('.opencode/')),
    );
    const hasCodexDir = strictResults.some(
      (r) =>
        r.format === 'codex' &&
        r.matchedPaths.some((p) => p.startsWith('.codex/')),
    );

    // AGENTS.md is the root rule for both OpenCode and Codex. On its own it
    // proves neither, so a Claude repo that happens to carry one must not come
    // back as a three-format repo. Both stay only when AGENTS.md is the sole
    // signal, because then the choice is genuinely the user's.
    const hasUnambiguousFormat = strictResults.some((r) => {
      if (r.format !== 'opencode' && r.format !== 'codex') {
        return true;
      }
      const configDir = r.format === 'opencode' ? '.opencode/' : '.codex/';
      return r.matchedPaths.some((p) => p.startsWith(configDir));
    });

    return strictResults.filter((r) => {
      if (r.format !== 'opencode' && r.format !== 'codex') {
        return true;
      }
      const hasOwnDir = r.format === 'opencode' ? hasOpencodeDir : hasCodexDir;
      if (hasOwnDir) {
        return true;
      }
      const siblingHasDir = r.format === 'opencode' ? hasCodexDir : hasOpencodeDir;
      // Another format was identified, or the sibling owns AGENTS.md.
      return !hasUnambiguousFormat && !siblingHasDir;
    });
  }

  // Fallback: loose detection when the config dir is gone, as with a subpath
  // fetch or a repo that keeps skills in a plain `skills/` folder.
  const looseResults: DetectionResult[] = [];
  for (const candidate of [claudeAdapter, cursorAdapter]) {
    const detected = candidate.detect(files, { ...options, allowLoose: true });
    if (detected) {
      looseResults.push(detected);
    }
  }

  return looseResults;
}
