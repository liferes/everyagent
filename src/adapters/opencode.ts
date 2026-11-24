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

export const opencodeAdapter: Adapter = {
  id: 'opencode',
  label: 'OpenCode (.opencode/)',
  configDir: '.opencode',
  rootRuleFile: 'AGENTS.md',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.config', 'opencode');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat('opencode', files, options);
  },

  parse(files: SourceFile[], options?: ParseOptions): UniskillPackage {
    return parseSkillMdFormat('opencode', files, options);
  },

  emit(pkg: UniskillPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('opencode', pkg, options, false);
  },
};
