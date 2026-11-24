import { detectFormats, getAdapter } from '../adapters/registry.js';
import type { DetectionResult } from '../adapters/types.js';
import { fetchSource, type FetchResult } from './fetcher.js';
import type { FormatId, SourceFile, UniskillPackage } from './ir.js';
import { rewritePackage } from './rewriter.js';
import { writeEmittedFiles, type WriteSummary } from './writer.js';

export interface DetectSourceResult {
  fetchResult: FetchResult;
  detections: DetectionResult[];
}

export interface ConvertAndWriteOptions {
  files: SourceFile[];
  sourceFormat: FormatId;
  targetFormats: FormatId[];
  targetDir: string;
  global?: boolean;
  force?: boolean;
  dryRun?: boolean;
  subpathName?: string;
  allowLoose?: boolean;
}

export interface ConvertAndWriteResult {
  pkg: UniskillPackage;
  summary: WriteSummary;
}

/** Fetch first, then let each adapter say what it recognises. */
export async function fetchAndDetect(
  source: string,
  fromFormat: FormatId | 'auto' = 'auto',
): Promise<DetectSourceResult> {
  const fetchResult = await fetchSource(source);

  if (fromFormat !== 'auto') {
    const adapter = getAdapter(fromFormat);
    const detected =
      adapter.detect(fetchResult.files, {
        subpathName: fetchResult.subpathName,
        allowLoose: false,
      }) ??
      adapter.detect(fetchResult.files, {
        subpathName: fetchResult.subpathName,
        allowLoose: true,
      });

    if (!detected) {
      throw new Error(
        `No ${adapter.label} skills or rules found in "${fetchResult.source.displayLabel}".`,
      );
    }

    return {
      fetchResult,
      detections: [detected],
    };
  }

  const detections = detectFormats(fetchResult.files, {
    subpathName: fetchResult.subpathName,
  });

  if (detections.length === 0) {
    throw new Error(
      `Could not detect any supported skill format (.cursor, .claude, .opencode, .codex) in "${fetchResult.source.displayLabel}".`,
    );
  }

  return { fetchResult, detections };
}

/** Source files in, one rewritten copy per target out, written to disk. */
export function convertAndWrite(
  options: ConvertAndWriteOptions,
): ConvertAndWriteResult {
  const sourceAdapter = getAdapter(options.sourceFormat);
  const pkg = sourceAdapter.parse(options.files, {
    subpathName: options.subpathName,
    allowLoose: options.allowLoose,
  });

  const combined: WriteSummary = {
    created: 0,
    overwritten: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: [],
  };

  const seenPaths = new Map<string, Buffer>();

  for (const targetFormat of options.targetFormats) {
    const targetAdapter = getAdapter(targetFormat);
    const rewrittenPkg = rewritePackage(pkg, targetFormat);
    const emitted = targetAdapter.emit(rewrittenPkg, {
      global: options.global,
    });
    const destination = options.global
      ? targetAdapter.getGlobalDir()
      : options.targetDir;

    const result = writeEmittedFiles(emitted, destination, {
      force: options.force,
      dryRun: options.dryRun,
      seenPaths,
    });

    combined.created += result.created;
    combined.overwritten += result.overwritten;
    combined.skipped += result.skipped;
    combined.duplicate += result.duplicate;
    combined.conflict += result.conflict;
    combined.actions.push(...result.actions);
  }

  return { pkg, summary: combined };
}
