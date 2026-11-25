import os from 'node:os';
import path from 'node:path';
import {
  normalizePosixPath,
  type EmittedFile,
  type SourceFile,
  type EveryagentPackage,
} from '../core/ir.js';
import {
  detectSkillMdFormat,
  emitSkillMdFormat,
  parseSkillMdFormat,
  type Adapter,
  type DetectionResult,
  type EmitOptions,
  type ParseOptions,
} from './types.js';

/**
 * Map legacy singular `.agent/` paths to canonical `.agents/`. The canonical
 * file wins when both exist, so a half-migrated repo cannot fold two skills
 * with the same folder into one and mix their companion files.
 */
function normalizeAgentAliasPaths(files: SourceFile[]): SourceFile[] {
  const canonical = new Set(files.map((file) => normalizePosixPath(file.path)));

  return files.flatMap((file) => {
    const normalized = normalizePosixPath(file.path);
    if (!normalized.startsWith('.agent/')) {
      return [file];
    }
    const alias = `.agents/${normalized.slice('.agent/'.length)}`;
    if (canonical.has(alias)) {
      return [];
    }
    return [{ path: alias, content: file.content }];
  });
}

export const antigravityAdapter: Adapter = {
  id: 'antigravity',
  label: 'Antigravity (.agents/)',
  configDir: '.agents',
  rootRuleFile: 'GEMINI.md',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.gemini', 'config');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat(
      'antigravity',
      normalizeAgentAliasPaths(files),
      options,
    );
  },

  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage {
    return parseSkillMdFormat(
      'antigravity',
      normalizeAgentAliasPaths(files),
      options,
    );
  },

  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('antigravity', pkg, options, false);
  },
};
