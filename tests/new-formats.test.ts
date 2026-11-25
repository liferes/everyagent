import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectFormats, getAdapter } from '../src/adapters/registry.js';
import { parseSourceFormat, parseTargetFormats } from '../src/cli/args.js';
import { logWriteSummary } from '../src/cli/logger.js';
import {
  detectLocalProjectSource,
  detectTargetFormats,
} from '../src/core/detector.js';
import { parseGitHubSource } from '../src/core/fetcher.js';
import type { SourceFile } from '../src/core/ir.js';
import { lintSourceFiles } from '../src/core/lint.js';
import {
  getManifestPath,
  hashBuffer,
  readManifest,
  recordManifestEntries,
  resolveManifestSourceForFetch,
} from '../src/core/manifest.js';
import { convertAndWrite, fetchAndDetect, parseDetectedPackage } from '../src/core/pipeline.js';
import { rewritePaths } from '../src/core/rewriter.js';
import { applyRemovePlan, applySyncPlan, planRemove, planSyncForEntry } from '../src/core/sync.js';

const tempDirs: string[] = [];

function makeTempDir(prefix = 'everyagent-newfmt-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function file(filePath: string, content: string): SourceFile {
  return { path: filePath, content: Buffer.from(content, 'utf8') };
}

function skill(name: string, body = 'body\n'): string {
  return `---\nname: ${name}\ndescription: ${name} skill\n---\n\n${body}`;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

describe('Copilot .github/ isolation', () => {
  it('ignores non-Copilot .github/ files such as workflows in all detection entry points', () => {
    const workflowOnly: SourceFile[] = [
      file('.github/workflows/ci.yml', 'name: ci\non: [push]\n'),
      file('.github/ISSUE_TEMPLATE/bug.md', '# bug\n'),
    ];
    expect(detectFormats(workflowOnly)).toEqual([]);
    expect(getAdapter('copilot').detect(workflowOnly)).toBeNull();

    const dir = makeTempDir('gh-workflows-');
    fs.mkdirSync(path.join(dir, '.github', 'workflows'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.github', 'workflows', 'ci.yml'),
      'name: ci\n',
    );

    expect(
      detectTargetFormats({
        targetDir: dir,
        globalDirResolver: () => path.join(dir, 'nonexistent'),
      }),
    ).toEqual({ formats: [], scope: 'none' });
    expect(detectLocalProjectSource(dir)).toBeNull();
  });

  it('keeps .github/workflows/ links intact while rewriting Copilot skills and instructions', () => {
    const body =
      'Check `.github/workflows/ci.yml`, `.github/skills/pr-review/references/checklist.md`, and `.github/copilot-instructions.md`.\n';

    const toClaude = rewritePaths(body, 'copilot', 'claude');
    expect(toClaude).toContain('.github/workflows/ci.yml');
    expect(toClaude).toContain('.claude/skills/pr-review/references/checklist.md');
    expect(toClaude).toContain('CLAUDE.md');

    const toCursor = rewritePaths(
      'Run `.github/skills/pr-review/SKILL.md` after `.github/workflows/ci.yml` passes.\n',
      'copilot',
      'cursor',
    );
    expect(toCursor).toContain('.github/workflows/ci.yml');
    expect(toCursor).toContain('.cursor/rules/pr-review.mdc');
  });
});

describe('Windsurf, Copilot, Cline, and Roo detection, URLs, and aliases', () => {
  it('detects project targets and local sources for the four new formats', () => {
    const dir = makeTempDir('new-proj-');
    fs.mkdirSync(path.join(dir, '.windsurf', 'skills', 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.windsurf', 'skills', 'docs', 'SKILL.md'),
      skill('docs'),
    );
    fs.mkdirSync(path.join(dir, '.github', 'skills', 'review'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.github', 'skills', 'review', 'SKILL.md'),
      skill('review'),
    );
    fs.writeFileSync(
      path.join(dir, '.github', 'copilot-instructions.md'),
      '# copilot\n',
    );
    // Directory-form .clinerules/ must not crash local detection when reading top-level files.
    fs.mkdirSync(path.join(dir, '.clinerules'));
    fs.writeFileSync(path.join(dir, '.roorules'), '# roo\n');

    expect(
      detectTargetFormats({
        targetDir: dir,
        globalDirResolver: () => path.join(dir, 'nonexistent'),
      }),
    ).toEqual({
      formats: ['windsurf', 'copilot', 'cline', 'roo'],
      scope: 'project',
    });

    const local = detectLocalProjectSource(dir);
    expect(local).not.toBeNull();
    expect(local!.detections.map((d) => d.format)).toEqual([
      'windsurf',
      'copilot',
      'roo',
    ]);
  });

  it('parses /blob/main/ URLs for the new root rule files', () => {
    expect(
      parseGitHubSource(
        'https://github.com/acme/repo/blob/main/.github/copilot-instructions.md',
      ),
    ).toMatchObject({
      type: 'github',
      subpath: undefined,
      fileFilter: '.github/copilot-instructions.md',
    });

    for (const rootRule of ['.windsurfrules', '.clinerules', '.roorules']) {
      expect(
        parseGitHubSource(`https://github.com/acme/repo/blob/main/${rootRule}`),
      ).toMatchObject({
        type: 'github',
        subpath: undefined,
        fileFilter: rootRule,
      });
    }
  });

  it('resolves aliases and suggests typos for the new formats', () => {
    expect(
      parseTargetFormats('ws, gh-copilot, clinerules, roo-code'),
    ).toEqual(['windsurf', 'copilot', 'cline', 'roo']);
    expect(parseSourceFormat('windsurf')).toBe('windsurf');
    expect(() => parseTargetFormats('windsrf')).toThrow(/Did you mean "windsurf"\?/);
    expect(() => parseTargetFormats('copilt')).toThrow(/Did you mean "copilot"\?/);
  });

  it('lints all four formats and restricts strict Copilot lint to .github/skills/', () => {
    for (const fmt of ['windsurf', 'copilot', 'cline', 'roo'] as const) {
      const cfg = fmt === 'copilot' ? '.github' : `.${fmt}`;
      const findings = lintSourceFiles(
        [file(`${cfg}/skills/demo/SKILL.md`, skill('demo'))],
        fmt,
      );
      expect(findings).toEqual([]);
    }

    const copilotFindings = lintSourceFiles(
      [
        file('.github/skills/real/SKILL.md', skill('real')),
        file('docs/SKILL.md', '---\nname: [broken\n---\n'),
      ],
      'copilot',
    );
    expect(copilotFindings).toEqual([]);
  });
});

describe('Manifest, sync, remove, and double-check note for new formats', () => {
  it('syncs and removes copilot installs cleanly', async () => {
    const workspace = makeTempDir('sync-new-');
    const sourceDir = path.join(workspace, 'src');
    const destDir = path.join(workspace, 'dest');
    fs.mkdirSync(path.join(sourceDir, '.windsurf', 'skills', 'audit'), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(sourceDir, '.windsurf', 'skills', 'audit', 'SKILL.md'),
      skill('audit', 'v1\n'),
    );
    fs.mkdirSync(destDir, { recursive: true });

    const initialFetch = await fetchAndDetect(sourceDir, 'windsurf');
    const initialRun = convertAndWrite({
      files: initialFetch.fetchResult.files,
      sourceFormat: 'windsurf',
      targetFormats: ['copilot'],
      targetDir: destDir,
    });
    recordManifestEntries({
      targetDir: destDir,
      global: false,
      parsedSource: initialFetch.fetchResult.source,
      sourceFormat: 'windsurf',
      plannedTargets: initialRun.plannedTargets,
      summary: initialRun.summary,
    });

    const manifestPath = getManifestPath({ targetDir: destDir, global: false });
    let manifest = readManifest(manifestPath)!;
    expect(manifest.installs[0].targetFormat).toBe('copilot');

    fs.writeFileSync(
      path.join(sourceDir, '.windsurf', 'skills', 'audit', 'SKILL.md'),
      skill('audit', 'v2\n'),
    );

    const entry = manifest.installs[0];
    const fetchTarget = resolveManifestSourceForFetch(entry, destDir);
    const nextFetch = await fetchAndDetect(fetchTarget, entry.sourceFormat);
    const pkg = parseDetectedPackage(
      nextFetch.fetchResult.files,
      nextFetch.detections[0],
      nextFetch.fetchResult.subpathName,
    );
    const { plannedTargets } = convertAndWrite({
      files: [],
      pkg,
      sourceFormat: entry.sourceFormat,
      targetFormats: [entry.targetFormat],
      targetDir: destDir,
      dryRun: true,
    });
    const diskHashes = new Map<string, string | null>();
    for (const f of entry.files) {
      const abs = path.resolve(destDir, f.path);
      diskHashes.set(f.path, fs.existsSync(abs) ? hashBuffer(fs.readFileSync(abs)) : null);
    }

    const syncPlan = planSyncForEntry(entry, plannedTargets[0].files, diskHashes, destDir);
    expect(syncPlan.actions.map((a) => a.kind)).toEqual(['update']);
    applySyncPlan(syncPlan);

    const syncedSkill = path.join(destDir, '.github', 'skills', 'audit', 'SKILL.md');
    expect(fs.readFileSync(syncedSkill, 'utf8')).toContain('v2');

    manifest = {
      version: 1,
      installs: [{ ...entry, files: syncPlan.nextFiles }],
    };
    const removePlan = planRemove(manifest, { all: true }, destDir);
    applyRemovePlan(removePlan);
    expect(fs.existsSync(syncedSkill)).toBe(false);
  });

  it('prints the always double-check reminder at the end of write summaries', () => {
    const logs: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args) => {
      logs.push(args.join(' '));
    });

    logWriteSummary({
      created: 1,
      overwritten: 0,
      unchanged: 0,
      skipped: 0,
      duplicate: 0,
      conflict: 0,
      actions: [
        {
          relativePath: '.cline/skills/a/SKILL.md',
          absolutePath: '/tmp/.cline/skills/a/SKILL.md',
          status: 'created',
          targetFormat: 'cline',
          dryRun: false,
        },
      ],
    });

    expect(logs.join('\n')).toContain(
      'Always double-check the output in case some skills were not detected.',
    );
  });
});
