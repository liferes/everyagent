import os from 'node:os';
import path from 'node:path';
import type { EmittedFile, SourceFile, UniskillPackage } from '../core/ir.js';
import {
  detectSkillMdFormat,
  emitSkillMdFormat,
  parseSkillMdFormat,
  type Adapter,
  type DetectionResult,
  type EmitOptions,
  type ParseOptions,
} from './types.js';

export const codexAdapter: Adapter = {
  id: 'codex',
  label: 'Codex CLI (.codex/)',
  configDir: '.codex',
  rootRuleFile: 'AGENTS.md',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.codex');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat('codex', files, options);
  },

  parse(files: SourceFile[], options?: ParseOptions): UniskillPackage {
    return parseSkillMdFormat('codex', files, options);
  },

  emit(pkg: UniskillPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('codex', pkg, options, false);
  },
};
