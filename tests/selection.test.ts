import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parseCliArgs, parseSkillSelection } from '../src/cli/args.js';
import {
  formatDetectedHeader,
  formatPackageOverview,
  formatSelectionCounts,
} from '../src/cli/prompts.js';
import type { UniskillPackage } from '../src/core/ir.js';
import {
  convertAndWrite,
  fetchAndDetect,
  filterPackage,
  parseDetectedPackage,
} from '../src/core/pipeline.js';

const FIXTURES_DIR = path.resolve(import.meta.dirname, 'fixtures');
const CURSOR_FIXTURE = path.join(FIXTURES_DIR, 'cursor-repo');
const tempDirs: string[] = [];

function makeTempDir(prefix = 'uniskill-selection-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('CLI skill selection (--skill / -s)', () => {
  it('parses a single skill and comma-separated skills', () => {
    const single = parseCliArgs([
      'node',
      'uniskill',
      'owner/repo',
      '-t',
      'claude',
      '-s',
      'api-design',
    ]);
    expect(single).toMatchObject({
      kind: 'command',
      source: 'owner/repo',
      targets: ['claude'],
      skills: ['api-design'],
    });

    const multi = parseCliArgs([
      'node',
      'uniskill',
      'owner/repo',
      '--skill',
      'api-design, react-hooks',
    ]);
    expect(multi).toMatchObject({
      kind: 'command',
      skills: ['api-design', 'react-hooks'],
    });
  });

  it('supports repeated --skill flags and deduplicates case-insensitively', () => {
    const parsed = parseCliArgs([
      'node',
      'uniskill',
      'owner/repo',
      '-s',
      'api-design,React-Hooks',
      '-s',
      'API-DESIGN,extra',
    ]);
    expect(parsed).toMatchObject({
      kind: 'command',
      skills: ['api-design', 'React-Hooks', 'extra'],
    });
  });

  it('rejects empty skill selections and --skill without a source', () => {
    expect(() => parseSkillSelection(' , , ')).toThrow(
      /Skill selection cannot be empty/,
    );
    expect(() =>
      parseCliArgs(['node', 'uniskill', '-s', 'api-design']),
    ).toThrow(/Missing source repository or path/);
  });
});

describe('parseDetectedPackage & filterPackage', () => {
  it('preserves all items when selection is omitted or all-enabled', async () => {
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detections[0],
      fetchResult.subpathName,
    );

    expect(pkg.skills.map((s) => s.name)).toEqual(['api-design', 'react-hooks']);
    expect(pkg.rootRules).toHaveLength(1);
    expect(pkg.sharedAssets).toHaveLength(1);

    expect(filterPackage(pkg)).toBe(pkg);
    const allEnabled = filterPackage(pkg, {
      includeRootRules: true,
      includeSharedAssets: true,
    });
    expect(allEnabled.skills).toHaveLength(2);
    expect(allEnabled.rootRules).toHaveLength(1);
    expect(allEnabled.sharedAssets).toHaveLength(1);
  });

  it('filters to a single skill and keeps only its companion assets', async () => {
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detections[0],
      fetchResult.subpathName,
    );

    const filtered = filterPackage(pkg, {
      skillNames: ['API-DESIGN'],
      includeRootRules: false,
      includeSharedAssets: false,
    });

    expect(filtered.skills.map((s) => s.name)).toEqual(['api-design']);
    expect(filtered.skills[0].assets.map((a) => a.relativePath)).toEqual([
      'references/rest.md',
    ]);
    expect(filtered.rootRules).toHaveLength(0);
    expect(filtered.sharedAssets).toHaveLength(0);
  });

  it('supports selecting a skill plus root rule, or root rule / shared assets alone', async () => {
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detections[0],
      fetchResult.subpathName,
    );

    const withRoot = filterPackage(pkg, {
      skillNames: ['react-hooks'],
      includeRootRules: true,
      includeSharedAssets: false,
    });
    expect(withRoot.skills.map((s) => s.name)).toEqual(['react-hooks']);
    expect(withRoot.rootRules.map((r) => r.sourceFilename)).toEqual([
      '.cursorrules',
    ]);
    expect(withRoot.sharedAssets).toHaveLength(0);

    const onlyRoot = filterPackage(pkg, {
      skillNames: [],
      includeRootRules: true,
      includeSharedAssets: false,
    });
    expect(onlyRoot.skills).toHaveLength(0);
    expect(onlyRoot.rootRules).toHaveLength(1);

    const onlyShared = filterPackage(pkg, {
      skillNames: [],
      includeRootRules: false,
      includeSharedAssets: true,
    });
    expect(onlyShared.skills).toHaveLength(0);
    expect(onlyShared.rootRules).toHaveLength(0);
    expect(onlyShared.sharedAssets).toHaveLength(1);
  });

  it('throws clear errors for unknown skills or empty selections', async () => {
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detections[0],
      fetchResult.subpathName,
    );

    expect(() =>
      filterPackage(pkg, { skillNames: ['does-not-exist'] }),
    ).toThrow(/Available skills: api-design, react-hooks/);

    expect(() =>
      filterPackage(pkg, {
        skillNames: [],
        includeRootRules: false,
        includeSharedAssets: false,
      }),
    ).toThrow(/Nothing selected to translate/);

    const noSkillsPkg: UniskillPackage = {
      ...pkg,
      skills: [],
    };
    expect(() =>
      filterPackage(noSkillsPkg, { skillNames: ['anything'] }),
    ).toThrow(/No skills were found in this source/);
  });

  it('writes only the selected skill and its companion assets via convertAndWrite', async () => {
    const dest = makeTempDir();
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);

    const { summary } = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['claude'],
      targetDir: dest,
      subpathName: fetchResult.subpathName,
      allowLoose: detections[0].allowLoose,
      selection: {
        skillNames: ['api-design'],
        includeRootRules: false,
        includeSharedAssets: false,
      },
    });

    expect(summary.created).toBe(2);
    expect(
      fs.existsSync(
        path.join(dest, '.claude', 'skills', 'api-design', 'SKILL.md'),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          dest,
          '.claude',
          'skills',
          'api-design',
          'references',
          'rest.md',
        ),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(dest, '.claude', 'skills', 'react-hooks', 'SKILL.md'),
      ),
    ).toBe(false);
    expect(fs.existsSync(path.join(dest, 'CLAUDE.md'))).toBe(false);
    expect(
      fs.existsSync(path.join(dest, '.claude', 'scripts', 'check-hooks.sh')),
    ).toBe(false);
  });
});

describe('Interactive formatting helpers', () => {
  it('formats detected header, selection counts, and package overview', async () => {
    const { fetchResult, detections } = await fetchAndDetect(CURSOR_FIXTURE);
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detections[0],
      fetchResult.subpathName,
    );

    expect(formatDetectedHeader('owner/repo', 'claude')).toBe(
      'Detected owner/repo (.claude)',
    );
    expect(formatDetectedHeader(fetchResult.source.displayLabel, 'cursor')).toBe(
      'Detected cursor-repo (.cursor)',
    );

    expect(formatSelectionCounts(pkg)).toBe(
      '2 skills, .cursorrules, 1 shared asset',
    );

    const overview = formatPackageOverview(pkg, 1);
    expect(overview).toContain('• api-design — REST API design and error envelope standards [1 asset]');
    expect(overview).toContain('... and 1 more skill');
    expect(overview).toContain('• .cursorrules (root rule)');
    expect(overview).toContain('• Shared config assets (1 file)');
  });
});
