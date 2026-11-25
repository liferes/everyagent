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

export const windsurfAdapter: Adapter = {
  id: 'windsurf',
  label: 'Windsurf (.windsurf/)',
  configDir: '.windsurf',
  rootRuleFile: '.windsurfrules',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.codeium', 'windsurf');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat('windsurf', files, options);
  },

  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage {
    return parseSkillMdFormat('windsurf', files, options);
  },

  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('windsurf', pkg, options, false);
  },
};
