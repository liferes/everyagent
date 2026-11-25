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

// Ignore non-Copilot files under .github/ (workflows, templates).
function filterCopilotFiles(
  files: SourceFile[],
  allowLoose?: boolean,
): SourceFile[] {
  return files.filter((file) => {
    const p = normalizePosixPath(file.path);
    if (p.startsWith('.github/skills/') || p === '.github/copilot-instructions.md') {
      return true;
    }
    return Boolean(allowLoose) && !p.startsWith('.github/');
  });
}

export const copilotAdapter: Adapter = {
  id: 'copilot',
  label: 'Copilot (.github/skills/)',
  configDir: '.github',
  rootRuleFile: '.github/copilot-instructions.md',

  getGlobalDir(): string {
    return path.join(os.homedir(), '.copilot');
  },

  detect(files: SourceFile[], options?: ParseOptions): DetectionResult | null {
    return detectSkillMdFormat(
      'copilot',
      filterCopilotFiles(files, options?.allowLoose),
      options,
    );
  },

  parse(files: SourceFile[], options?: ParseOptions): EveryagentPackage {
    return parseSkillMdFormat(
      'copilot',
      filterCopilotFiles(files, options?.allowLoose),
      options,
    );
  },

  emit(pkg: EveryagentPackage, options?: EmitOptions): EmittedFile[] {
    return emitSkillMdFormat('copilot', pkg, options, false);
  },
};
