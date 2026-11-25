import { FORMAT_IDS, type FormatId } from './ir.js';

const FORMAT_ALIASES: Record<string, FormatId> = {
  claude: 'claude',
  claudecode: 'claude',
  cc: 'claude',
  claudemd: 'claude',
  opencode: 'opencode',
  oc: 'opencode',
  codex: 'codex',
  codexcli: 'codex',
  openaicodex: 'codex',
  cursor: 'cursor',
  cursorrules: 'cursor',
  mdc: 'cursor',
  antigravity: 'antigravity',
  agy: 'antigravity',
  agents: 'antigravity',
  agent: 'antigravity',
  googleantigravity: 'antigravity',
  windsurf: 'windsurf',
  ws: 'windsurf',
  windsurfrules: 'windsurf',
  codeium: 'windsurf',
  copilot: 'copilot',
  ghcopilot: 'copilot',
  githubcopilot: 'copilot',
  github: 'copilot',
  cline: 'cline',
  clinerules: 'cline',
  roo: 'roo',
  roocode: 'roo',
  roorules: 'roo',
};

/** Normalize a user token for forgiving matching (case, dots, hyphens, underscores, spaces). */
export function normalizeToken(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^\.+/, '')
    .replace(/[-_\s]+/g, '');
}

/** Classic DP table with the memory trimmed to two rows. */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const ca = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = ca === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[b.length];
}

/** Resolve exact format IDs or common aliases (e.g. `claude-code`, `open-code`, `.cursor`). */
export function resolveFormatAlias(raw: string): FormatId | null {
  const normalized = normalizeToken(raw);
  if (!normalized) return null;
  return FORMAT_ALIASES[normalized] ?? null;
}

/** Suggest the closest supported FormatId for a typo (edit distance <= 2). */
export function suggestFormat(raw: string): FormatId | null {
  const normalized = normalizeToken(raw);
  if (!normalized) return null;

  let bestFormat: FormatId | null = null;
  let bestDistance = 3;

  for (const id of FORMAT_IDS) {
    const d = levenshteinDistance(normalized, id);
    if (d < bestDistance) {
      bestDistance = d;
      bestFormat = id;
    }
  }

  for (const [alias, target] of Object.entries(FORMAT_ALIASES)) {
    const d = levenshteinDistance(normalized, alias);
    if (d < bestDistance) {
      bestDistance = d;
      bestFormat = target;
    }
  }

  return bestDistance <= 2 ? bestFormat : null;
}

// Suggestion scores sort ascending, and the bands must not overlap or a fuzzy
// match could outrank an exact one.
const SCORE_EXACT = -1;
const SCORE_CONTAINS = 0.5;
const SCORE_CONTAINS_LENGTH_PENALTY = 0.01;
const SCORE_BY_DISTANCE = 1;

// Below this length every candidate is "close", so a two-character typo is the
// smallest correction worth suggesting.
const MIN_EDIT_DISTANCE = 2;
const LENGTH_TOLERANCE = 0.4;

/**
 * Exact match, then substring match, then edit distance, all in one ranked list.
 * Used for "Did you mean…" on skill names.
 */
export function findClosestMatches(
  query: string,
  candidates: readonly string[],
  maxSuggestions = 3,
): string[] {
  const normQuery = normalizeToken(query);
  if (!normQuery || candidates.length === 0) {
    return [];
  }

  const maxDist = Math.max(
    MIN_EDIT_DISTANCE,
    Math.floor(normQuery.length * LENGTH_TOLERANCE),
  );
  const scored: Array<{ candidate: string; score: number }> = [];

  for (const candidate of candidates) {
    const normCand = normalizeToken(candidate);
    if (!normCand) continue;

    if (normCand === normQuery) {
      scored.push({ candidate, score: SCORE_EXACT });
      continue;
    }

    if (normCand.includes(normQuery) || normQuery.includes(normCand)) {
      const lengthDiff = Math.abs(normCand.length - normQuery.length);
      scored.push({
        candidate,
        score: SCORE_CONTAINS + lengthDiff * SCORE_CONTAINS_LENGTH_PENALTY,
      });
      continue;
    }

    const dist = levenshteinDistance(normQuery, normCand);
    if (dist <= maxDist) {
      scored.push({ candidate, score: SCORE_BY_DISTANCE + dist });
    }
  }

  scored.sort((a, b) => a.score - b.score || a.candidate.localeCompare(b.candidate));
  return scored.slice(0, maxSuggestions).map((entry) => entry.candidate);
}
