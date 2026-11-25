import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { afterEach, describe, expect, it } from 'vitest';
import { parseSourceFormat, parseTargetFormats } from '../src/cli/args.js';
import { formatActionLine, formatSummaryCounts } from '../src/cli/logger.js';
import {
  detectLocalProjectSource,
  detectTargetFormats,
} from '../src/core/detector.js';
import { extractTarGz, parseGitHubSource } from '../src/core/fetcher.js';
import type { FormatId, UniskillPackage } from '../src/core/ir.js';
import {
  filterPackage,
  shouldPromptTranslationScope,
} from '../src/core/pipeline.js';
import { writeEmittedFiles } from '../src/core/writer.js';

const tempDirs: string[] = [];

function makeTempDir(prefix = 'uniskill-smart-'): string {
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
    header.fill(0x20, 148, 156);
    header.write('0', 156, 1, 'utf8');
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

  blocks.push(Buffer.alloc(1024, 0));
  return zlib.gzipSync(Buffer.concat(blocks));
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('Feature 1: Target auto-detection', () => {
  it('detects project-level agent markers in FORMAT_IDS order', () => {
    const dir = makeTempDir();
    fs.mkdirSync(path.join(dir, '.opencode'));
    fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# claude\n');

    const res = detectTargetFormats({
      targetDir: dir,
      globalDirResolver: () => path.join(dir, 'nonexistent'),
    });

    expect(res).toEqual({
      formats: ['claude', 'opencode'],
      scope: 'project',
    });
  });

  it('detects cursor (.cursorrules or .cursor) and codex (.codex)', () => {
    const dir = makeTempDir();
    fs.writeFileSync(path.join(dir, '.cursorrules'), '# rules\n');
    fs.mkdirSync(path.join(dir, '.codex'));

    const res = detectTargetFormats({
      targetDir: dir,
      globalDirResolver: () => path.join(dir, 'nonexistent'),
    });

    expect(res).toEqual({
      formats: ['cursor', 'codex'],
      scope: 'project',
    });
  });

  it('ignores bare AGENTS.md so OpenCode and Codex do not collide', () => {
    const dir = makeTempDir();
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# shared\n');

    const res = detectTargetFormats({
      targetDir: dir,
      globalDirResolver: () => path.join(dir, 'nonexistent'),
    });

    expect(res).toEqual({ formats: [], scope: 'none' });
  });

  it('falls back to global machine config dirs when project has no markers', () => {
    const projectDir = makeTempDir('empty-proj-');
    const fakeGlobalRoot = makeTempDir('fake-global-');
    const fakeOpencode = path.join(fakeGlobalRoot, 'opencode');
    fs.mkdirSync(fakeOpencode);

    const resolver = (id: FormatId): string =>
      id === 'opencode' ? fakeOpencode : path.join(fakeGlobalRoot, `missing-${id}`);

    const res = detectTargetFormats({
      targetDir: projectDir,
      globalDirResolver: resolver,
    });

    expect(res).toEqual({
      formats: ['opencode'],
      scope: 'global',
    });
  });

  it('excludes sourceFormat when excludeSourceWhenLocal is enabled', () => {
    const dir = makeTempDir();
    fs.mkdirSync(path.join(dir, '.claude'));
    fs.mkdirSync(path.join(dir, '.opencode'));

    const res = detectTargetFormats({
      targetDir: dir,
      sourceFormat: 'claude',
      excludeSourceWhenLocal: true,
      globalDirResolver: () => path.join(dir, 'nonexistent'),
    });

    expect(res).toEqual({
      formats: ['opencode'],
      scope: 'project',
    });
  });
});

describe('Feature 2: Flexible GitHub URL & tarball handling', () => {
  it('resolves /blob/.../SKILL.md to its parent skill folder', () => {
    expect(
      parseGitHubSource(
        'https://github.com/ComposioHQ/awesome-claude-skills/blob/main/youtube-downloader/SKILL.md',
      ),
    ).toEqual({
      type: 'github',
      owner: 'ComposioHQ',
      repo: 'awesome-claude-skills',
      ref: 'main',
      subpath: 'youtube-downloader',
      displayLabel: 'ComposioHQ/awesome-claude-skills/youtube-downloader',
    });

    expect(
      parseGitHubSource('https://github.com/acme/single-skill/blob/main/SKILL.md'),
    ).toEqual({
      type: 'github',
      owner: 'acme',
      repo: 'single-skill',
      ref: 'main',
      subpath: undefined,
      displayLabel: 'acme/single-skill@main',
    });
  });

  it('resolves /blob/.../*.mdc with fileFilter and preserves companion assets', () => {
    const parsed = parseGitHubSource(
      'https://github.com/acme/rules/blob/main/.cursor/rules/react.mdc',
    );
    expect(parsed).toEqual({
      type: 'github',
      owner: 'acme',
      repo: 'rules',
      ref: 'main',
      subpath: '.cursor/rules',
      fileFilter: 'react.mdc',
      displayLabel: 'acme/rules/.cursor/rules/react.mdc',
    });

    const tarGz = createTarGzBuffer([
      { path: 'acme-rules-123/.cursor/rules/react.mdc', content: 'react rule' },
      {
        path: 'acme-rules-123/.cursor/rules/react/ref.md',
        content: 'react asset',
      },
      { path: 'acme-rules-123/.cursor/rules/other.mdc', content: 'other rule' },
    ]);

    const files = extractTarGz(tarGz, '.cursor/rules', 'react.mdc');
    expect(files.map((f) => f.path)).toEqual(['react.mdc', 'react/ref.md']);
  });

  it('parses SSH URLs, raw.githubusercontent.com, query/hash fragments, and git clone prefix', () => {
    expect(parseGitHubSource('git@github.com:acme/skills.git')).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
    });

    expect(
      parseGitHubSource('ssh://git@github.com/acme/skills.git'),
    ).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
    });

    expect(
      parseGitHubSource(
        'https://raw.githubusercontent.com/acme/skills/refs/heads/main/ui/SKILL.md',
      ),
    ).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
      ref: 'main',
      subpath: 'ui',
    });

    expect(
      parseGitHubSource(
        'git clone https://github.com/acme/skills?tab=readme-ov-file#top',
      ),
    ).toMatchObject({
      type: 'github',
      owner: 'acme',
      repo: 'skills',
    });
  });
});

describe('Feature 3: Unchanged vs changed file detection', () => {
  it('marks identical files as unchanged even when force is true, and skipped/overwritten when different', () => {
    const dir = makeTempDir();
    const sameFile = {
      relativePath: 'AGENTS.md',
      content: Buffer.from('# same\n'),
      targetFormat: 'opencode' as const,
    };
    const changedFile = {
      relativePath: '.opencode/skills/demo/SKILL.md',
      content: Buffer.from('# v1\n'),
      targetFormat: 'opencode' as const,
    };

    writeEmittedFiles([sameFile, changedFile], dir);

    const updated = {
      ...changedFile,
      content: Buffer.from('# v2\n'),
    };

    const withoutForce = writeEmittedFiles([sameFile, updated], dir);
    expect(withoutForce.unchanged).toBe(1);
    expect(withoutForce.skipped).toBe(1);
    expect(withoutForce.overwritten).toBe(0);
    expect(formatSummaryCounts(withoutForce)).toBe('1 up to date, 1 skipped');
    expect(formatActionLine(withoutForce.actions[0])).toContain('Up to date');
    expect(formatActionLine(withoutForce.actions[1])).toContain('differs on disk');

    const withForce = writeEmittedFiles([sameFile, updated], dir, {
      force: true,
    });
    expect(withForce.unchanged).toBe(1);
    expect(withForce.overwritten).toBe(1);
    expect(withForce.skipped).toBe(0);
    expect(
      fs.readFileSync(path.join(dir, '.opencode', 'skills', 'demo', 'SKILL.md'), 'utf8'),
    ).toBe('# v2\n');
  });
});

describe('Feature 4: Skip translation scope prompt when only 1 choice exists', () => {
  const basePkg: UniskillPackage = {
    sourceFormat: 'claude',
    sourceLabel: 'Claude Code (.claude/)',
    skills: [
      {
        name: 'only-one',
        description: 'single skill',
        body: 'body',
        assets: [],
      },
    ],
    rootRules: [],
    sharedAssets: [],
  };

  it('returns false for a single skill or single root rule alone, and true when >1 choice exists', () => {
    expect(shouldPromptTranslationScope(basePkg)).toBe(false);

    expect(
      shouldPromptTranslationScope({
        ...basePkg,
        skills: [],
        rootRules: [{ sourceFilename: 'CLAUDE.md', content: '# root' }],
      }),
    ).toBe(false);

    expect(
      shouldPromptTranslationScope({
        ...basePkg,
        rootRules: [{ sourceFilename: 'CLAUDE.md', content: '# root' }],
      }),
    ).toBe(true);

    expect(
      shouldPromptTranslationScope({
        ...basePkg,
        skills: [
          ...basePkg.skills,
          { name: 'second', description: 'two', body: 'b', assets: [] },
        ],
      }),
    ).toBe(true);
  });
});

describe('Feature 5: Auto-detect local project source for bare command', () => {
  it('detects .claude and .cursor projects and ignores unrelated folders', () => {
    const claudeProj = makeTempDir('local-claude-');
    fs.mkdirSync(path.join(claudeProj, '.claude', 'skills', 'my-skill'), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(claudeProj, '.claude', 'skills', 'my-skill', 'SKILL.md'),
      '---\nname: my-skill\ndescription: demo\n---\nhello\n',
    );
    fs.mkdirSync(path.join(claudeProj, 'src'));
    fs.writeFileSync(path.join(claudeProj, 'src', 'index.ts'), 'export {};\n');

    const detected = detectLocalProjectSource(claudeProj);
    expect(detected).not.toBeNull();
    expect(detected!.detections.map((d) => d.format)).toEqual(['claude']);
    expect(detected!.fetchResult.files.map((f) => f.path)).toEqual([
      '.claude/skills/my-skill/SKILL.md',
    ]);

    const emptyProj = makeTempDir('local-empty-');
    fs.mkdirSync(path.join(emptyProj, 'src'));
    fs.writeFileSync(path.join(emptyProj, 'src', 'index.ts'), 'export {};\n');
    expect(detectLocalProjectSource(emptyProj)).toBeNull();
  });
});

describe('Feature 6: Forgiving aliases and typo suggestions', () => {
  it('resolves common format aliases and suggests closest format on typo', () => {
    expect(parseTargetFormats('claude-code, open-code, codex_cli, .cursor')).toEqual([
      'claude',
      'opencode',
      'codex',
      'cursor',
    ]);
    expect(parseSourceFormat('claude-code')).toBe('claude');
    expect(() => parseTargetFormats('claud')).toThrow(/Did you mean "claude"\?/);
    expect(() => parseSourceFormat('cursr')).toThrow(/Did you mean "cursor"\?/);
  });

  it('matches normalized skill names and suggests closest skills on typo', () => {
    const pkg: UniskillPackage = {
      sourceFormat: 'cursor',
      sourceLabel: 'Cursor (.cursor/)',
      skills: [
        { name: 'api-design', description: 'api', body: 'b', assets: [] },
        { name: 'react-hooks', description: 'hooks', body: 'b', assets: [] },
      ],
      rootRules: [],
      sharedAssets: [],
    };

    const filtered = filterPackage(pkg, {
      skillNames: ['api_design', 'react hooks'],
    });
    expect(filtered.skills.map((s) => s.name)).toEqual([
      'api-design',
      'react-hooks',
    ]);

    expect(() =>
      filterPackage(pkg, { skillNames: ['react-hook'] }),
    ).toThrow(/Did you mean: react-hooks\? Available skills: api-design, react-hooks/);
  });
});
