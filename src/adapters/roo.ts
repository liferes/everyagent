import os from 'node:os';
import path from 'node:path';
import type { EmittedFile, SourceFile, EveryagentPackage } from '../core/ir.js';
import {
  detectSkillMdFormat,
  emitSkillMdFormat,
  parseSkillMdFormat,
  type Adapter,
  type DetectionResult,
  type EmitOptions,
  type ParseOptions,
} from './types.js';

export const rooAdapter: Adapter = {
  id: 'roo',
  label: 'Roo Code (.roo/)',
  configDir: '.roo',
  rootRuleFile: '.roorules',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.roo');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat('roo', files, options);
  },

  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage {
    return parseSkillMdFormat('roo', files, options);
  },

  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('roo', pkg, options, false);
  },
};
