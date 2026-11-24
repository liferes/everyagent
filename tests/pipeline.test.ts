import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import matter from 'gray-matter';
import { afterEach, describe, expect, it } from 'vitest';
import { getAdapter } from '../src/adapters/registry.js';
import { extractTarGz, parseGitHubSource } from '../src/core/fetcher.js';
import { FORMAT_IDS, FORMAT_META, type FormatId } from '../src/core/ir.js';
import { convertAndWrite, fetchAndDetect } from '../src/core/pipeline.js';
import { parseCliArgs, parseTargetFormats } from '../src/cli/args.js';

const FIXTURES_DIR = path.resolve(import.meta.dirname, 'fixtures');
const tempDirs: string[] = [];

function makeTempDir(prefix = 'uniskill-test-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function createTarGzBuffer(
  entries: Array<{ path: string; content: string }>,
): Buffer {
  const blocks: Buffer[] = [];

  for (const entry of entries) {
    const contentBuf = Buffer.from(entry.content, 'utf8');
    const header = Buffer.alloc(512, 0);

    header.write(entry.path, 0, Math.min(entry.path.length, 100), 'utf8');
    header.write('0000644\0', 100, 8, 'utf8');
    header.write('0000000\0', 108, 8, 'utf8');
    header.write('0000000\0', 116, 8, 'utf8');
    const sizeOctal = contentBuf.length.toString(8).padStart(11, '0') + '\0';
    header.write(sizeOctal, 124, 12, 'utf8');
    header.write('00000000000\0', 136, 12, 'utf8');
    header.fill(0x20, 148, 156); // checksum placeholder spaces
    header.write('0', 156, 1, 'utf8'); // regular file
    header.write('ustar\0', 257, 6, 'utf8');
    header.write('00', 263, 2, 'utf8');

    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.write(checksumStr, 148, 8, 'utf8');

    blocks.push(header);
    if (contentBuf.length > 0) {
      const paddedLen = Math.ceil(contentBuf.length / 512) * 512;
      const dataBlock = Buffer.alloc(paddedLen, 0);
      contentBuf.copy(dataBlock);
      blocks.push(dataBlock);
    }
  }

  // Two 512-byte zero blocks at EOF
  blocks.push(Buffer.alloc(1024, 0));
  return zlib.gzipSync(Buffer.concat(blocks));
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('CLI argument parsing', () => {
  it('routes empty args to interactive mode', () => {
    const res = parseCliArgs(['node', 'uniskill']);
    expect(res).toEqual({ kind: 'interactive' });
  });

  it('parses one-liner positional destination and multi-targets', () => {
    const res = parseCliArgs([
      'node',
      'uniskill',
      'https://github.com/u/r',
      '-t',
      'claude,opencode',
      './app',
      '-y',
      '--dry-run',
    ]);
    expect(res).toEqual({
      kind: 'command',
      source: 'https://github.com/u/r',
      targets: ['claude', 'opencode'],
      from: 'auto',
      targetDir: './app',
      global: false,
      yes: true,
      dryRun: true,
      force: false,
    });
  });

  it('expands `all` target cleanly without duplicates', () => {
    expect(parseTargetFormats('claude,all')).toEqual([
      'claude',
      'cursor',
      'opencode',
      'codex',
    ]);
  });
});

describe('GitHub source parser & tarball extractor', () => {
  it('parses shorthand, full URL, and monorepo subpaths', () => {
    expect(parseGitHubSource('acme/skills')).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
      ref: undefined,
      subpath: undefined,
    });

    expect(
      parseGitHubSource('https://github.com/acme/skills.git'),
    ).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
    });

    expect(
      parseGitHubSource('acme/monorepo/tree/main/skills/react-ui'),
    ).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'monorepo',
      ref: 'main',
      subpath: 'skills/react-ui',
    });
  });

  it('extracts files from tar.gz, filters by subpath, and rejects traversal', () => {
    const tarGz = createTarGzBuffer([
      {
        path: 'acme-monorepo-abc123/README.md',
        content: '# Root',
      },
      {
        path: 'acme-monorepo-abc123/skills/react-ui/SKILL.md',
        content: '---\nname: react-ui\ndescription: UI patterns\n---\nBody\n',
      },
      {
        path: 'acme-monorepo-abc123/skills/react-ui/scripts/check.sh',
        content: 'echo ok\n',
      },
      {
        path: 'acme-monorepo-abc123/skills/react-ui/../../evil.txt',
        content: 'nope',
      },
    ]);

    const files = extractTarGz(tarGz, 'skills/react-ui');
    expect(files.map((f) => f.path)).toEqual([
      'SKILL.md',
      'scripts/check.sh',
    ]);
  });
});

describe('Gate 2: 4x4 Matrix Conversions & Translation Rules', () => {
  const fixtureByFormat: Record<FormatId, string> = {
    cursor: path.join(FIXTURES_DIR, 'cursor-repo'),
    claude: path.join(FIXTURES_DIR, 'claude-repo'),
    opencode: path.join(FIXTURES_DIR, 'opencode-repo'),
    codex: path.join(FIXTURES_DIR, 'codex-repo'),
  };

  for (const sourceFormat of FORMAT_IDS) {
    for (const targetFormat of FORMAT_IDS) {
      it(`converts ${sourceFormat} -> ${targetFormat}`, async () => {
        const dest = makeTempDir(`matrix-${sourceFormat}-${targetFormat}-`);
        const { fetchResult, detections } = await fetchAndDetect(
          fixtureByFormat[sourceFormat],
        );

        expect(detections).toHaveLength(1);
        expect(detections[0].format).toBe(sourceFormat);

        const { pkg, summary } = convertAndWrite({
          files: fetchResult.files,
          sourceFormat: detections[0].format,
          targetFormats: [targetFormat],
          targetDir: dest,
          subpathName: fetchResult.subpathName,
          allowLoose: detections[0].allowLoose,
        });

        expect(summary.created).toBeGreaterThan(0);
        expect(summary.skipped).toBe(0);

        const targetMeta = FORMAT_META[targetFormat];
        const rootRulePath = path.join(dest, targetMeta.rootRuleFile);
        expect(fs.existsSync(rootRulePath)).toBe(true);

        const rootRuleContent = fs.readFileSync(rootRulePath, 'utf8');
        if (sourceFormat !== targetFormat) {
          expect(rootRuleContent).not.toContain(
            `${FORMAT_META[sourceFormat].configDir}/`,
          );
        }

        for (const skill of pkg.skills) {
          if (targetFormat === 'cursor') {
            const mdcPath = path.join(
              dest,
              '.cursor',
              'rules',
              `${skill.name}.mdc`,
            );
            expect(fs.existsSync(mdcPath)).toBe(true);
            const parsed = matter(fs.readFileSync(mdcPath, 'utf8'));
            expect(typeof parsed.data.description).toBe('string');
            if (sourceFormat !== 'cursor') {
              expect(parsed.data.alwaysApply).toBe(false);
            }
            for (const asset of skill.assets) {
              const assetPath = path.join(
                dest,
                '.cursor',
                'rules',
                skill.name,
                asset.relativePath,
              );
              expect(fs.existsSync(assetPath)).toBe(true);
            }
          } else {
            const skillPath = path.join(
              dest,
              targetMeta.configDir,
              'skills',
              skill.name,
              'SKILL.md',
            );
            expect(fs.existsSync(skillPath)).toBe(true);
            const parsed = matter(fs.readFileSync(skillPath, 'utf8'));
            expect(parsed.data.name).toBe(skill.name);
            expect(typeof parsed.data.description).toBe('string');

            if (sourceFormat === 'cursor' && skill.globs?.length) {
              expect(String(parsed.data.description)).toContain('Applies to:');
              expect(String(parsed.data.description)).toContain('*.tsx');
            }

            if (targetFormat === 'claude' && skill.allowedTools) {
              expect(parsed.data['allowed-tools']).toBe(skill.allowedTools);
            } else {
              expect(parsed.data['allowed-tools']).toBeUndefined();
            }

            if (sourceFormat !== targetFormat) {
              expect(parsed.content).not.toContain(
                `${FORMAT_META[sourceFormat].configDir}/`,
              );
            }

            for (const asset of skill.assets) {
              const assetPath = path.join(
                dest,
                targetMeta.configDir,
                'skills',
                skill.name,
                asset.relativePath,
              );
              expect(fs.existsSync(assetPath)).toBe(true);
              if (asset.isText && sourceFormat !== targetFormat) {
                const assetText = fs.readFileSync(assetPath, 'utf8');
                expect(assetText).not.toContain(
                  `${FORMAT_META[sourceFormat].configDir}/`,
                );
              }
            }
          }
        }
      });
    }
  }

  it('supports multi-target conversion without colliding on shared AGENTS.md', async () => {
    const dest = makeTempDir('multi-target-');
    const { fetchResult, detections } = await fetchAndDetect(
      path.join(FIXTURES_DIR, 'cursor-repo'),
    );

    const { summary } = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['claude', 'opencode', 'codex'],
      targetDir: dest,
    });

    expect(fs.existsSync(path.join(dest, 'CLAUDE.md'))).toBe(true);
    expect(fs.existsSync(path.join(dest, 'AGENTS.md'))).toBe(true);
    expect(
      fs.existsSync(path.join(dest, '.claude', 'skills', 'react-hooks', 'SKILL.md')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(dest, '.opencode', 'skills', 'react-hooks', 'SKILL.md')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(dest, '.codex', 'skills', 'react-hooks', 'SKILL.md')),
    ).toBe(true);
    // OpenCode and Codex both write AGENTS.md but rewrite internal paths
    // differently, so the second emission is a real conflict, not a user skip.
    expect(summary.conflict).toBe(1);
    expect(summary.skipped).toBe(0);
  });

  it('emits flat paths when global mode is enabled (no nested .claude/.claude)', async () => {
    const { fetchResult, detections } = await fetchAndDetect(
      path.join(FIXTURES_DIR, 'cursor-repo'),
    );
    const pkg = getAdapter(detections[0].format).parse(fetchResult.files);

    const claudeEmitted = getAdapter('claude').emit(pkg, { global: true });
    expect(claudeEmitted.some((f) => f.relativePath === 'skills/react-hooks/SKILL.md')).toBe(
      true,
    );
    expect(claudeEmitted.some((f) => f.relativePath.startsWith('.claude/'))).toBe(
      false,
    );

    const cursorEmitted = getAdapter('cursor').emit(pkg, { global: true });
    expect(cursorEmitted.some((f) => f.relativePath === 'rules/react-hooks.mdc')).toBe(
      true,
    );
    expect(cursorEmitted.some((f) => f.relativePath.startsWith('.cursor/'))).toBe(
      false,
    );
  });
});

describe('Gate 3: Conflict Safety (Skip-Existing Default & --force)', () => {
  it('skips 100% of existing files on rerun and preserves user edits unless --force is passed', async () => {
    const dest = makeTempDir('conflict-');
    const { fetchResult, detections } = await fetchAndDetect(
      path.join(FIXTURES_DIR, 'cursor-repo'),
    );

    const run1 = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['claude'],
      targetDir: dest,
    });
    expect(run1.summary.created).toBeGreaterThan(0);
    expect(run1.summary.skipped).toBe(0);

    const targetSkillPath = path.join(
      dest,
      '.claude',
      'skills',
      'react-hooks',
      'SKILL.md',
    );
    const sentinel = '# USER CUSTOMIZATION - DO NOT OVERWRITE\n';
    fs.writeFileSync(targetSkillPath, sentinel, 'utf8');

    const run2 = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['claude'],
      targetDir: dest,
    });
    expect(run2.summary.created).toBe(0);
    expect(run2.summary.overwritten).toBe(0);
    expect(run2.summary.skipped).toBe(run1.summary.created);
    expect(fs.readFileSync(targetSkillPath, 'utf8')).toBe(sentinel);

    const run3 = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['claude'],
      targetDir: dest,
      force: true,
    });
    expect(run3.summary.created).toBe(0);
    expect(run3.summary.overwritten).toBe(run1.summary.created);
    expect(run3.summary.skipped).toBe(0);
    expect(fs.readFileSync(targetSkillPath, 'utf8')).not.toBe(sentinel);
    expect(fs.readFileSync(targetSkillPath, 'utf8')).toContain('react-hooks');
  });
});

describe('Gate 4: Dry-Run Isolation', () => {
  it('plans creates without creating the destination directory or files', async () => {
    const parent = makeTempDir('dry-run-parent-');
    const nonexistentDest = path.join(parent, 'does-not-exist');

    const { fetchResult, detections } = await fetchAndDetect(
      path.join(FIXTURES_DIR, 'claude-repo'),
    );

    const { summary } = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['opencode'],
      targetDir: nonexistentDest,
      dryRun: true,
    });

    expect(summary.created).toBeGreaterThan(0);
    expect(summary.actions.every((a) => a.dryRun)).toBe(true);
    expect(fs.existsSync(nonexistentDest)).toBe(false);
  });

  it('reports skips on existing files without modifying disk contents', async () => {
    const dest = makeTempDir('dry-run-existing-');
    const { fetchResult, detections } = await fetchAndDetect(
      path.join(FIXTURES_DIR, 'claude-repo'),
    );

    const first = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['codex'],
      targetDir: dest,
    });

    const agentsPath = path.join(dest, 'AGENTS.md');
    const customContent = '# Custom AGENTS.md\n';
    fs.writeFileSync(agentsPath, customContent, 'utf8');

    const dryForce = convertAndWrite({
      files: fetchResult.files,
      sourceFormat: detections[0].format,
      targetFormats: ['codex'],
      targetDir: dest,
      dryRun: true,
      force: true,
    });

    expect(dryForce.summary.overwritten).toBe(first.summary.created);
    expect(fs.readFileSync(agentsPath, 'utf8')).toBe(customContent);
  });
});
