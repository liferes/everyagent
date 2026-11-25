import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CliUsageError, parseCliArgs } from '../src/cli/args.js';
import { logWriteSummary } from '../src/cli/logger.js';
import type { SourceFile } from '../src/core/ir.js';
import { lintSourceFiles } from '../src/core/lint.js';
import {
  createEmptyManifest,
  formatSourceForManifest,
  getManifestPath,
  hashBuffer,
  inspectInstallDrift,
  readManifest,
  recordManifestEntries,
  resolveManifestSourceForFetch,
  writeManifest,
  type ManifestInstallEntry,
} from '../src/core/manifest.js';
import { convertAndWrite, fetchAndDetect, parseDetectedPackage } from '../src/core/pipeline.js';
import {
  applyRemovePlan,
  applySyncPlan,
  entryKeepsConfigAssets,
  planRemove,
  planSyncForEntry,
} from '../src/core/sync.js';

const tempDirs: string[] = [];

function makeTempDir(prefix = 'everyagent-v1-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function file(filePath: string, content: string): SourceFile {
  return { path: filePath, content: Buffer.from(content, 'utf8') };
}

function makeSkill(name: string, body = 'Default body.\n'): string {
  return `---\nname: ${name}\ndescription: ${name} description\n---\n\n${body}`;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

describe('Job A: check before skipping & selective replace', () => {
  it('treats identical rerun as unchanged without rewriting or prompting', () => {
    const dest = makeTempDir('rerun-');
    const files = [file('.claude/skills/review/SKILL.md', makeSkill('review'))];

    const first = convertAndWrite({
      files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });
    expect(first.summary.created).toBe(1);

    const second = convertAndWrite({
      files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });
    expect(second.summary.unchanged).toBe(1);
    expect(second.summary.skipped).toBe(0);
    expect(second.summary.overwritten).toBe(0);
    expect(second.summary.actions[0].wouldBeContent).toBeUndefined();
  });

  it('replaces only paths approved in overwrite set and preserves kept files', () => {
    const dest = makeTempDir('selective-');
    const initialFiles = [
      file('.claude/skills/alpha/SKILL.md', makeSkill('alpha', 'v1 alpha\n')),
      file('.claude/skills/beta/SKILL.md', makeSkill('beta', 'v1 beta\n')),
    ];
    convertAndWrite({
      files: initialFiles,
      sourceFormat: 'claude',
      targetFormats: ['codex'],
      targetDir: dest,
    });

    const updatedFiles = [
      file('.claude/skills/alpha/SKILL.md', makeSkill('alpha', 'v2 alpha\n')),
      file('.claude/skills/beta/SKILL.md', makeSkill('beta', 'v2 beta\n')),
    ];

    const preview = convertAndWrite({
      files: updatedFiles,
      sourceFormat: 'claude',
      targetFormats: ['codex'],
      targetDir: dest,
      dryRun: true,
    });
    expect(preview.summary.skipped).toBe(2);
    expect(preview.summary.actions.every((a) => Buffer.isBuffer(a.wouldBeContent))).toBe(true);

    const alphaAbs = path.resolve(dest, '.codex/skills/alpha/SKILL.md');
    const betaAbs = path.resolve(dest, '.codex/skills/beta/SKILL.md');

    const applied = convertAndWrite({
      files: updatedFiles,
      sourceFormat: 'claude',
      targetFormats: ['codex'],
      targetDir: dest,
      overwrite: new Set([alphaAbs]),
    });

    expect(applied.summary.overwritten).toBe(1);
    expect(applied.summary.skipped).toBe(1);
    expect(fs.readFileSync(alphaAbs, 'utf8')).toContain('v2 alpha');
    expect(fs.readFileSync(betaAbs, 'utf8')).toContain('v1 beta');
  });

  it('prints differing files under one heading and a --force hint without listing unchanged files', () => {
    const logs: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args) => {
      logs.push(args.join(' '));
    });

    logWriteSummary(
      {
        created: 0,
        overwritten: 0,
        unchanged: 2,
        skipped: 2,
        duplicate: 0,
        conflict: 0,
        actions: [
          {
            relativePath: '.codex/skills/same/SKILL.md',
            absolutePath: '/tmp/same',
            status: 'unchanged',
            targetFormat: 'codex',
            dryRun: false,
          },
          {
            relativePath: '.codex/skills/a/SKILL.md',
            absolutePath: '/tmp/a',
            status: 'skipped',
            targetFormat: 'codex',
            dryRun: false,
          },
          {
            relativePath: '.codex/skills/b/SKILL.md',
            absolutePath: '/tmp/b',
            status: 'skipped',
            targetFormat: 'codex',
            dryRun: false,
          },
        ],
      },
      { showForceHint: true },
    );

    const output = logs.join('\n');
    expect(output).toContain('Differs on disk:');
    expect(output).toContain('.codex/skills/a/SKILL.md');
    expect(output).toContain('.codex/skills/b/SKILL.md');
    expect(output).not.toContain('.codex/skills/same/SKILL.md');
    expect(output).toContain('--force');
  });
});

describe('Job B: manifest, sync, list, and remove', () => {
  it('writes readable sorted manifest with null targetDir for project and absolute targetDir for global', () => {
    const proj = makeTempDir('manifest-proj-');
    const home = makeTempDir('manifest-home-');

    const projManifestPath = getManifestPath({ targetDir: proj, global: false });
    expect(projManifestPath).toBe(path.join(path.resolve(proj), '.everyagent', 'manifest.json'));

    const globalManifestPath = getManifestPath({ global: true, homeDir: home });
    expect(globalManifestPath).toBe(path.join(path.resolve(home), '.everyagent', 'manifest.json'));

    const formattedLocal = formatSourceForManifest(
      {
        type: 'local',
        localPath: path.join(proj, 'src-skills'),
        displayLabel: 'src-skills',
      },
      proj,
      false,
    );
    expect(formattedLocal.source).toBe('src-skills');

    let manifest = createEmptyManifest();
    manifest.installs.push({
      source: 'z/repo',
      ref: 'main',
      subpath: null,
      sourceFormat: 'claude',
      targetFormat: 'codex',
      global: false,
      targetDir: null,
      installedAt: '2026-11-25T00:00:00.000Z',
      files: [
        { path: '.codex/skills/b/SKILL.md', sha256: '222' },
        { path: '.codex/skills/a/SKILL.md', sha256: '111' },
      ],
    });
    manifest.installs.push({
      source: 'a/repo',
      ref: null,
      subpath: null,
      sourceFormat: 'cursor',
      targetFormat: 'claude',
      global: true,
      targetDir: path.join(home, '.claude'),
      installedAt: '2026-11-25T00:00:00.000Z',
      files: [{ path: 'skills/x/SKILL.md', sha256: '333' }],
    });

    writeManifest(projManifestPath, manifest);
    const readBack = readManifest(projManifestPath)!;
    expect(readBack.installs.map((i) => i.source)).toEqual(['a/repo', 'z/repo']);
    expect(readBack.installs[1].files.map((f) => f.path)).toEqual([
      '.codex/skills/a/SKILL.md',
      '.codex/skills/b/SKILL.md',
    ]);
    expect(readBack.installs[1].targetDir).toBeNull();
    expect(readBack.installs[0].targetDir).toBe(path.resolve(home, '.claude'));
  });

  it('sync updates untouched changed files, preserves edited files, and deletes removed upstream skills', async () => {
    const workspace = makeTempDir('sync-ws-');
    const sourceDir = path.join(workspace, 'upstream');
    const destDir = path.join(workspace, 'project');
    fs.mkdirSync(path.join(sourceDir, '.claude', 'skills', 'keep-me'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, '.claude', 'skills', 'edit-me'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, '.claude', 'skills', 'drop-me'), { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });

    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'keep-me', 'SKILL.md'),
      makeSkill('keep-me', 'v1 keep\n'),
    );
    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'edit-me', 'SKILL.md'),
      makeSkill('edit-me', 'v1 edit\n'),
    );
    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'drop-me', 'SKILL.md'),
      makeSkill('drop-me', 'v1 drop\n'),
    );

    const initialFetch = await fetchAndDetect(sourceDir, 'claude');
    const initialRun = convertAndWrite({
      files: initialFetch.fetchResult.files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: destDir,
    });
    recordManifestEntries({
      targetDir: destDir,
      global: false,
      parsedSource: initialFetch.fetchResult.source,
      sourceFormat: 'claude',
      plannedTargets: initialRun.plannedTargets,
      summary: initialRun.summary,
    });

    const manifestPath = getManifestPath({ targetDir: destDir, global: false });
    const manifest = readManifest(manifestPath)!;
    expect(manifest.installs).toHaveLength(1);
    expect(manifest.installs[0].files).toHaveLength(3);

    // Hand-edit one installed file on disk.
    const editMeTarget = path.join(destDir, '.opencode', 'skills', 'edit-me', 'SKILL.md');
    fs.writeFileSync(editMeTarget, '# custom user tweak\n');

    // Drift inspection for list should catch the 1 modified file.
    const drift = inspectInstallDrift(manifest.installs[0], destDir);
    expect(drift.modifiedCount).toBe(1);
    expect(drift.missingCount).toBe(0);

    // Mutate upstream source: update keep-me & edit-me, remove drop-me, add new-me.
    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'keep-me', 'SKILL.md'),
      makeSkill('keep-me', 'v2 keep\n'),
    );
    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'edit-me', 'SKILL.md'),
      makeSkill('edit-me', 'v2 upstream edit\n'),
    );
    fs.rmSync(path.join(sourceDir, '.claude', 'skills', 'drop-me'), {
      recursive: true,
      force: true,
    });
    fs.mkdirSync(path.join(sourceDir, '.claude', 'skills', 'new-me'), { recursive: true });
    fs.writeFileSync(
      path.join(sourceDir, '.claude', 'skills', 'new-me', 'SKILL.md'),
      makeSkill('new-me', 'v1 new\n'),
    );

    const entry = manifest.installs[0];
    const fetchTarget = resolveManifestSourceForFetch(entry, destDir);
    const syncedFetch = await fetchAndDetect(fetchTarget, entry.sourceFormat);
    const pkg = parseDetectedPackage(
      syncedFetch.fetchResult.files,
      syncedFetch.detections[0],
      syncedFetch.fetchResult.subpathName,
    );
    const { plannedTargets } = convertAndWrite({
      files: [],
      pkg,
      sourceFormat: entry.sourceFormat,
      targetFormats: [entry.targetFormat],
      targetDir: destDir,
      dryRun: true,
    });
    const emitted = plannedTargets[0].files;
    const diskHashes = new Map<string, string | null>();
    for (const f of entry.files) {
      diskHashes.set(
        f.path,
        fs.existsSync(path.resolve(destDir, f.path))
          ? hashBuffer(fs.readFileSync(path.resolve(destDir, f.path)))
          : null,
      );
    }

    const plan = planSyncForEntry(entry, emitted, diskHashes, destDir);
    expect(plan.hasDrift).toBe(true);
    expect(plan.actions.find((a) => a.relativePath.includes('keep-me'))?.kind).toBe('update');
    expect(plan.actions.find((a) => a.relativePath.includes('edit-me'))?.kind).toBe('keep-local');
    expect(plan.actions.find((a) => a.relativePath.includes('drop-me'))?.kind).toBe('delete');
    expect(plan.actions.find((a) => a.relativePath.includes('new-me'))?.kind).toBe('create');

    applySyncPlan(plan);

    expect(
      fs.readFileSync(path.join(destDir, '.opencode/skills/keep-me/SKILL.md'), 'utf8'),
    ).toContain('v2 keep');
    expect(fs.readFileSync(editMeTarget, 'utf8')).toBe('# custom user tweak\n');
    expect(
      fs.existsSync(path.join(destDir, '.opencode/skills/drop-me/SKILL.md')),
    ).toBe(false);
    expect(
      fs.existsSync(path.join(destDir, '.opencode/skills/new-me/SKILL.md')),
    ).toBe(true);

    // Remove must delete untouched files and refuse the hand-edited file.
    writeManifest(manifestPath, {
      version: 1,
      installs: [{ ...entry, files: plan.nextFiles }],
    });
    const currentManifest = readManifest(manifestPath)!;
    const removePlan = planRemove(currentManifest, { all: true }, destDir);
    expect(removePlan.deletedPaths).toHaveLength(2);
    expect(removePlan.refusedPaths).toEqual(['.opencode/skills/edit-me/SKILL.md']);

    applyRemovePlan(removePlan);
    writeManifest(manifestPath, removePlan.nextManifest);

    expect(fs.existsSync(editMeTarget)).toBe(true);
    expect(
      fs.existsSync(path.join(destDir, '.opencode/skills/keep-me/SKILL.md')),
    ).toBe(false);
    expect(readManifest(manifestPath)!.installs[0].files).toHaveLength(1);
  });

  it('returns null when manifest is missing', () => {
    const empty = makeTempDir('no-manifest-');
    expect(readManifest(getManifestPath({ targetDir: empty, global: false }))).toBeNull();
  });

  it('refuses manifest paths that escape the install directory', () => {
    const proj = makeTempDir('escape-');
    const entry: ManifestInstallEntry = {
      source: 'x/y',
      ref: null,
      subpath: null,
      sourceFormat: 'claude',
      targetFormat: 'opencode',
      global: false,
      targetDir: null,
      installedAt: '2026-11-25T00:00:00.000Z',
      files: [{ path: '../outside.txt', sha256: 'abc' }],
    };

    expect(() => inspectInstallDrift(entry, proj)).toThrow(/outside the install directory/);
    expect(() =>
      planRemove({ version: 1, installs: [entry] }, { all: true }, proj),
    ).toThrow(/outside the install directory/);
    expect(() => planSyncForEntry(entry, [], new Map(), proj)).toThrow(
      /outside the install directory/,
    );
  });

  it('leaves a kept pre-existing file untracked instead of reporting drift', () => {
    const dest = makeTempDir('untracked-');
    const target = path.join(dest, '.opencode', 'skills', 'alpha', 'SKILL.md');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, '# mine, not yours\n');

    const files = [file('.claude/skills/alpha/SKILL.md', makeSkill('alpha', 'v1\n'))];
    const run = convertAndWrite({
      files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });
    expect(run.summary.skipped).toBe(1);

    recordManifestEntries({
      targetDir: dest,
      global: false,
      parsedSource: { type: 'local', localPath: dest, displayLabel: 'local' },
      sourceFormat: 'claude',
      plannedTargets: run.plannedTargets,
      summary: run.summary,
    });

    const manifest = readManifest(getManifestPath({ targetDir: dest, global: false }))!;
    expect(manifest.installs[0].files).toHaveLength(0);
    expect(fs.readFileSync(target, 'utf8')).toBe('# mine, not yours\n');

    const plan = planSyncForEntry(
      manifest.installs[0],
      run.plannedTargets[0].files,
      new Map(),
      dest,
    );
    expect(plan.actions.map((a) => a.kind)).toEqual(['untracked']);
    expect(plan.hasDrift).toBe(false);
  });

  it('keeps installedAt when a rerun records the same files', () => {
    const dest = makeTempDir('stable-stamp-');
    const files = [file('.claude/skills/alpha/SKILL.md', makeSkill('alpha', 'v1\n'))];

    const first = convertAndWrite({
      files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });
    recordManifestEntries({
      targetDir: dest,
      global: false,
      parsedSource: { type: 'local', localPath: dest, displayLabel: 'local' },
      sourceFormat: 'claude',
      plannedTargets: first.plannedTargets,
      summary: first.summary,
    });

    const manifestPath = getManifestPath({ targetDir: dest, global: false });
    const stamped = readManifest(manifestPath)!;
    stamped.installs[0].installedAt = '2020-01-01T00:00:00.000Z';
    writeManifest(manifestPath, stamped);

    const second = convertAndWrite({
      files,
      sourceFormat: 'claude',
      targetFormats: ['opencode'],
      targetDir: dest,
    });
    recordManifestEntries({
      targetDir: dest,
      global: false,
      parsedSource: { type: 'local', localPath: dest, displayLabel: 'local' },
      sourceFormat: 'claude',
      plannedTargets: second.plannedTargets,
      summary: second.summary,
    });

    expect(readManifest(manifestPath)!.installs[0].installedAt).toBe(
      '2020-01-01T00:00:00.000Z',
    );
  });
});

describe('CLI subcommand dispatch & lint', () => {
  it('dispatches sync, list, remove, and lint without breaking sources named sync', () => {
    expect(parseCliArgs(['node', 'everyagent', 'sync', './proj', '--check', '--json'])).toEqual({
      kind: 'sync',
      targetDir: './proj',
      global: false,
      yes: false,
      dryRun: false,
      check: true,
      json: true,
    });

    expect(parseCliArgs(['node', 'everyagent', 'list', '-g', '--json'])).toEqual({
      kind: 'list',
      targetDir: '.',
      global: true,
      json: true,
    });

    expect(parseCliArgs(['node', 'everyagent', 'remove', 'owner/repo', './proj'])).toEqual({
      kind: 'remove',
      source: 'owner/repo',
      all: false,
      targetDir: './proj',
      global: false,
      dryRun: false,
    });

    expect(() => parseCliArgs(['node', 'everyagent', 'remove'])).toThrow(CliUsageError);

    expect(parseCliArgs(['node', 'everyagent', './sync', '-t', 'claude'])).toMatchObject({
      kind: 'command',
      source: './sync',
      targets: ['claude'],
    });

    expect(parseCliArgs(['node', 'everyagent', 'owner/sync', '-t', 'codex'])).toMatchObject({
      kind: 'command',
      source: 'owner/sync',
      targets: ['codex'],
    });
  });

  it('lints invalid frontmatter, duplicate names, broken links, and description length', () => {
    const findings = lintSourceFiles(
      [
        file('.claude/skills/bad/SKILL.md', '---\nname: [broken\n---\nbody\n'),
        file('.claude/skills/a/SKILL.md', makeSkill('dup', 'See [missing](./nope.md)\n')),
        file(
          '.claude/skills/b/SKILL.md',
          `---\nname: dup\ndescription: ${'x'.repeat(1100)}\n---\n\nok\n`,
        ),
      ],
      'claude',
    );

    const rules = findings.map((f) => f.rule);
    expect(rules).toContain('invalid-frontmatter');
    expect(rules).toContain('duplicate-name');
    expect(rules).toContain('broken-link');
    expect(rules).toContain('description-length');
  });
});

describe('config assets survive an upgrade from a pre-1.2.0 manifest', () => {
  function legacyEntry(files: string[]): ManifestInstallEntry {
    return {
      source: 'owner/repo',
      ref: null,
      subpath: null,
      sourceFormat: 'claude',
      targetFormat: 'opencode',
      global: false,
      targetDir: null,
      installedAt: '2026-11-24T00:00:00.000Z',
      files: files.map((p) => ({ path: p, sha256: 'a'.repeat(64) })),
    };
  }

  it('reads the recorded files when the flag is missing', () => {
    expect(
      entryKeepsConfigAssets(
        legacyEntry(['.opencode/skills/demo/SKILL.md', '.opencode/settings.json']),
      ),
    ).toBe(true);
    expect(entryKeepsConfigAssets(legacyEntry(['.opencode/hooks/pre.sh']))).toBe(
      true,
    );
    expect(
      entryKeepsConfigAssets(legacyEntry(['.opencode/skills/demo/SKILL.md'])),
    ).toBe(false);
  });

  it('lets an explicit flag win over the recorded files', () => {
    expect(
      entryKeepsConfigAssets({ ...legacyEntry([]), includeConfigAssets: false }),
    ).toBe(false);
    expect(
      entryKeepsConfigAssets({ ...legacyEntry([]), includeConfigAssets: true }),
    ).toBe(true);
  });

  it('does not delete a settings file a legacy entry still tracks', () => {
    const dest = makeTempDir('legacy-config-');
    const settingsRel = '.opencode/settings.json';
    const settingsPath = path.join(dest, settingsRel);
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, '{"env":{"A":"1"}}\n');

    const entry = legacyEntry([settingsRel]);
    expect(entryKeepsConfigAssets(entry)).toBe(true);

    const emitted = [
      {
        targetFormat: 'opencode' as const,
        relativePath: settingsRel,
        content: Buffer.from('{"env":{"A":"1"}}\n', 'utf8'),
      },
    ];
    const plan = planSyncForEntry(entry, emitted, new Map(), dest);

    expect(plan.actions.find((a) => a.relativePath === settingsRel)?.kind).toBe(
      'unchanged',
    );
    expect(plan.actions.some((a) => a.kind === 'delete')).toBe(false);
  });
});
