import type { FormatId, SourceFile } from '../core/ir.js';
import { antigravityAdapter } from './antigravity.js';
import { claudeAdapter } from './claude.js';
import { clineAdapter } from './cline.js';
import { codexAdapter } from './codex.js';
import { copilotAdapter } from './copilot.js';
import { cursorAdapter } from './cursor.js';
import { opencodeAdapter } from './opencode.js';
import { rooAdapter } from './roo.js';
import { windsurfAdapter } from './windsurf.js';
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
  windsurfAdapter,
  copilotAdapter,
  clineAdapter,
  rooAdapter,
];

const ADAPTER_MAP: Record<FormatId, Adapter> = {
  cursor: cursorAdapter,
  claude: claudeAdapter,
  opencode: opencodeAdapter,
  codex: codexAdapter,
  antigravity: antigravityAdapter,
  windsurf: windsurfAdapter,
  copilot: copilotAdapter,
  cline: clineAdapter,
  roo: rooAdapter,
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
 * Only Claude and Cursor can match without a config dir, which is what a subpath
 * fetch or a plain `skills/` folder leaves behind.
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

  // Only a SKILL.md says the project holds skills. A config folder alone is
  // not evidence: repos that serve many harnesses ship `.opencode/plugins/` and
  // `.agents/` manifests beside their real `skills/` folder, and those used to
  // read as two competing formats that blocked the run. So when no config dir
  // holds a SKILL.md, a repo-wide `skills/<name>/SKILL.md` layout answers
  // better than any of them.
  if (!strictResults.some((r) => r.skillCount > 0)) {
    const looseResults: DetectionResult[] = [];
    for (const candidate of [claudeAdapter, cursorAdapter]) {
      const detected = candidate.detect(files, { ...options, allowLoose: true });
      if (detected) {
        looseResults.push(detected);
      }
    }
    if (looseResults.length > 0) {
      return looseResults;
    }
  }

  if (strictResults.length > 0) {
    // A shared root rule (AGENTS.md, GEMINI.md) does not say which tool owns the
    // project, so it only stands when nothing else turned up.
    const winners = strictResults.filter(
      (r) => !SHARED_ROOT_RULE_FORMATS.has(r.format) || !isRootRuleOnly(r),
    );

    // Leave a shared root rule standing only when its sibling folders are gone
    // too, because then the choice is genuinely the user's.
    return winners.length > 0 ? winners : strictResults;
  }

  return [];
}
