import pc from 'picocolors';
import { isTextFile } from '../core/ir.js';

interface DiffLine {
  kind: 'same' | 'del' | 'add';
  text: string;
}

function computeLcsDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const m = oldLines.length;
  const n = newLines.length;
  const dp: Uint16Array[] = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      out.push({ kind: 'same', text: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ kind: 'del', text: oldLines[i] });
      i++;
    } else {
      out.push({ kind: 'add', text: newLines[j] });
      j++;
    }
  }
  while (i < m) {
    out.push({ kind: 'del', text: oldLines[i++] });
  }
  while (j < n) {
    out.push({ kind: 'add', text: newLines[j++] });
  }
  return out;
}

function computeRangeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  let start = 0;
  while (
    start < oldLines.length &&
    start < newLines.length &&
    oldLines[start] === newLines[start]
  ) {
    start++;
  }

  let oldEnd = oldLines.length - 1;
  let newEnd = newLines.length - 1;
  while (
    oldEnd >= start &&
    newEnd >= start &&
    oldLines[oldEnd] === newLines[newEnd]
  ) {
    oldEnd--;
    newEnd--;
  }

  const out: DiffLine[] = [];
  if (start > 0) {
    out.push({ kind: 'same', text: oldLines[start - 1] });
  }
  for (let i = start; i <= oldEnd; i++) {
    out.push({ kind: 'del', text: oldLines[i] });
  }
  for (let j = start; j <= newEnd; j++) {
    out.push({ kind: 'add', text: newLines[j] });
  }
  if (oldEnd + 1 < oldLines.length) {
    out.push({ kind: 'same', text: oldLines[oldEnd + 1] });
  }
  return out;
}

/** Render a compact colored line diff between disk bytes and incoming bytes. */
export function formatShortDiff(
  existing: Buffer,
  incoming: Buffer,
  filePath: string,
  maxLines = 16,
): string {
  if (!isTextFile(filePath, existing) || !isTextFile(filePath, incoming)) {
    return `Binary file differs (${existing.length} bytes on disk -> ${incoming.length} bytes incoming).`;
  }

  const oldLines = existing.toString('utf8').replace(/\r\n/g, '\n').split('\n');
  const newLines = incoming.toString('utf8').replace(/\r\n/g, '\n').split('\n');

  const diffLines =
    oldLines.length <= 400 && newLines.length <= 400
      ? computeLcsDiff(oldLines, newLines)
      : computeRangeDiff(oldLines, newLines);

  const include = new Set<number>();
  for (let i = 0; i < diffLines.length; i++) {
    if (diffLines[i].kind !== 'same') {
      if (i > 0) include.add(i - 1);
      include.add(i);
      if (i + 1 < diffLines.length) include.add(i + 1);
    }
  }

  const formatted: string[] = [];
  let prevIdx = -1;
  for (let i = 0; i < diffLines.length; i++) {
    if (!include.has(i)) continue;
    if (prevIdx !== -1 && i > prevIdx + 1) {
      formatted.push(pc.dim('...'));
    }
    const line = diffLines[i];
    if (line.kind === 'del') {
      formatted.push(pc.red(`- ${line.text}`));
    } else if (line.kind === 'add') {
      formatted.push(pc.green(`+ ${line.text}`));
    } else {
      formatted.push(pc.dim(`  ${line.text}`));
    }
    prevIdx = i;
  }

  if (formatted.length === 0) {
    return pc.dim('(whitespace or line-ending difference)');
  }

  if (formatted.length > maxLines) {
    const remaining = formatted.length - maxLines;
    return [...formatted.slice(0, maxLines), pc.dim(`... (+${remaining} more lines)`)].join('\n');
  }

  return formatted.join('\n');
}
