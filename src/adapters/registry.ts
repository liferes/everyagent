import type { FormatId, SourceFile } from '../core/ir.js';
import { antigravityAdapter } from './antigravity.js';
import { claudeAdapter } from './claude.js';
import { codexAdapter } from './codex.js';
import { cursorAdapter } from './cursor.js';
import { opencodeAdapter } from './opencode.js';
import {
  isRootRuleOnly,
  type Adapter,
  type DetectionResult,
  type ParseOptions,
} from './types.js';

const ADAPTERS: readonly Adapter[] = [
  cursorAdapter,
  claudeAdapter,
  opencodeAdapter,
  codexAdapter,
  antigravityAdapter,
];

const ADAPTER_MAP: Record<FormatId, Adapter> = {
  cursor: cursorAdapter,
  claude: claudeAdapter,
  opencode: opencodeAdapter,
  codex: codexAdapter,
  antigravity: antigravityAdapter,
};

export function getAdapter(id: FormatId): Adapter {
  return ADAPTER_MAP[id];
}

export function getAllAdapters(): readonly Adapter[] {
  return ADAPTERS;
}

/**
 * AGENTS.md serves OpenCode and Codex, GEMINI.md serves Antigravity and Gemini
 * CLI, so a root rule on its own says nothing about which tool owns the project.
 * Those detections only count when nothing better turned up.
 */
const SHARED_ROOT_RULE_FORMATS = new Set<FormatId>([
  'opencode',
  'codex',
  'antigravity',
]);

export function isWeakRootRuleOnly(detection: DetectionResult): boolean {
  return (
    SHARED_ROOT_RULE_FORMATS.has(detection.format) &&
    isRootRuleOnly(detection)
  );
}

/**
 * Ask every adapter. AGENTS.md is shared by OpenCode and Codex, GEMINI.md by
 * Antigravity and Gemini CLI, so the ambiguous votes get sorted out afterwards.
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
    // A format that found skills or a config folder owns the project. One that
    // only matched its root rule file does not, or a Claude repo carrying a
    // GEMINI.md would come back as two formats and block every non-TTY run.
    const winners = strictResults.filter(
      (r) => !SHARED_ROOT_RULE_FORMATS.has(r.format) || !isRootRuleOnly(r),
    );

    // Leave a shared root rule standing only when its sibling folders are gone
    // too, because then the choice is genuinely the user's.
    return winners.length > 0 ? winners : strictResults;
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
