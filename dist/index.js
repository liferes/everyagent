#!/usr/bin/env node

// src/index.ts
import pc3 from "picocolors";

// src/adapters/claude.ts
import os from "os";
import path from "path";

// src/adapters/types.ts
import matter from "gray-matter";

// src/core/ir.ts
var FORMAT_IDS = ["cursor", "claude", "opencode", "codex"];
var FORMAT_META = {
  cursor: {
    id: "cursor",
    label: "Cursor (.cursor/)",
    configDir: ".cursor",
    rootRuleFile: ".cursorrules"
  },
  claude: {
    id: "claude",
    label: "Claude Code (.claude/)",
    configDir: ".claude",
    rootRuleFile: "CLAUDE.md"
  },
  opencode: {
    id: "opencode",
    label: "OpenCode (.opencode/)",
    configDir: ".opencode",
    rootRuleFile: "AGENTS.md"
  },
  codex: {
    id: "codex",
    label: "Codex CLI (.codex/)",
    configDir: ".codex",
    rootRuleFile: "AGENTS.md"
  }
};
var TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
  ".md",
  ".mdc",
  ".txt",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".bat",
  ".cmd",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".cfg",
  ".conf",
  ".py",
  ".rb",
  ".go",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".cpp",
  ".h",
  ".hpp",
  ".cs",
  ".php",
  ".sql",
  ".css",
  ".scss",
  ".less",
  ".html",
  ".htm",
  ".xml",
  ".svg",
  ".env",
  ".gitignore",
  ".dockerignore"
]);
function normalizePosixPath(inputPath) {
  return inputPath.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^(?:\.\/)+/, "").replace(/^\/+/, "").replace(/\/+$/, "");
}
function isTextFile(filePath, content) {
  const normalized = normalizePosixPath(filePath).toLowerCase();
  const lastDot = normalized.lastIndexOf(".");
  if (lastDot !== -1) {
    const ext = normalized.slice(lastDot);
    if (TEXT_EXTENSIONS.has(ext)) {
      return true;
    }
  }
  const sampleLen = Math.min(content.length, 8192);
  for (let i = 0; i < sampleLen; i++) {
    if (content[i] === 0) {
      return false;
    }
  }
  return true;
}

// src/core/rewriter.ts
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function formatSkillDescriptionForSkillMd(skill) {
  const base = skill.description.trim();
  const globs = skill.globs?.map((g) => g.trim()).filter(Boolean) ?? [];
  if (globs.length === 0) {
    return base;
  }
  const globText = globs.join(", ");
  if (base.includes(globText)) {
    return base;
  }
  const hint = `(Applies to: ${globText})`;
  return base ? `${base} ${hint}` : hint;
}
function rewritePaths(text2, sourceFormat, targetFormat) {
  if (sourceFormat === targetFormat || !text2) {
    return text2;
  }
  const sourceMeta = FORMAT_META[sourceFormat];
  const targetMeta = FORMAT_META[targetFormat];
  let result = text2;
  if (sourceFormat === "cursor") {
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\//g,
      `${targetMeta.configDir}/skills/$1/`
    );
    result = result.replace(
      /\.cursor\/rules\//g,
      `${targetMeta.configDir}/skills/`
    );
  } else if (targetFormat === "cursor") {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/([^/\\s\`'")\\]]+)\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRe, ".cursor/rules/$1/");
    const sourceSkillsRootRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRootRe, ".cursor/rules/");
  } else {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRe, `${targetMeta.configDir}/skills/`);
  }
  const configDirRe = new RegExp(
    `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.configDir)}\\/`,
    "g"
  );
  result = result.replace(configDirRe, `$1${targetMeta.configDir}/`);
  if (sourceMeta.rootRuleFile !== targetMeta.rootRuleFile) {
    const rootRuleRe = new RegExp(
      `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.rootRuleFile)}(?=$|[^A-Za-z0-9_.-])`,
      "g"
    );
    result = result.replace(rootRuleRe, `$1${targetMeta.rootRuleFile}`);
  }
  return result;
}
function rewriteAsset(asset, sourceFormat, targetFormat) {
  if (!asset.isText) {
    return {
      relativePath: asset.relativePath,
      content: Buffer.from(asset.content),
      isText: false
    };
  }
  const rewritten = rewritePaths(
    asset.content.toString("utf8"),
    sourceFormat,
    targetFormat
  );
  return {
    relativePath: asset.relativePath,
    content: Buffer.from(rewritten, "utf8"),
    isText: true
  };
}
function rewritePackage(pkg, targetFormat) {
  const skills = pkg.skills.map((skill) => ({
    ...skill,
    globs: skill.globs ? [...skill.globs] : void 0,
    allowedTools: Array.isArray(skill.allowedTools) ? [...skill.allowedTools] : skill.allowedTools,
    extraFrontmatter: skill.extraFrontmatter ? { ...skill.extraFrontmatter } : void 0,
    body: rewritePaths(skill.body, pkg.sourceFormat, targetFormat),
    assets: skill.assets.map(
      (asset) => rewriteAsset(asset, pkg.sourceFormat, targetFormat)
    )
  }));
  const rootRules = pkg.rootRules.map((rule) => ({
    sourceFilename: rule.sourceFilename,
    content: rewritePaths(rule.content, pkg.sourceFormat, targetFormat)
  }));
  const sharedAssets = pkg.sharedAssets.map(
    (asset) => rewriteAsset(asset, pkg.sourceFormat, targetFormat)
  );
  return {
    sourceFormat: pkg.sourceFormat,
    sourceLabel: pkg.sourceLabel,
    skills,
    rootRules,
    sharedAssets
  };
}

// src/adapters/types.ts
function parseMarkdownWithFrontmatter(raw) {
  const parsed = matter(raw);
  return {
    data: { ...parsed.data },
    body: parsed.content.replace(/^\r?\n/, "")
  };
}
function serializeMarkdownWithFrontmatter(body, frontmatter) {
  const cleanData = {};
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== void 0) {
      cleanData[key] = value;
    }
  }
  const normalizedBody = body.replace(/\r\n/g, "\n").replace(/^\n+/, "");
  const withTrailingNewline = normalizedBody.length === 0 ? "" : normalizedBody.endsWith("\n") ? normalizedBody : `${normalizedBody}
`;
  if (Object.keys(cleanData).length === 0) {
    return Buffer.from(withTrailingNewline, "utf8");
  }
  const output = matter.stringify(withTrailingNewline, cleanData);
  const ensured = output.endsWith("\n") ? output : `${output}
`;
  return Buffer.from(ensured, "utf8");
}
function normalizeGlobs(value) {
  if (Array.isArray(value)) {
    const items = value.map((item) => String(item).trim()).filter(Boolean);
    return items.length > 0 ? items : void 0;
  }
  if (typeof value === "string") {
    const items = value.split(",").map((item) => item.trim()).filter(Boolean);
    return items.length > 0 ? items : void 0;
  }
  return void 0;
}
function sanitizeSkillName(raw) {
  const segments = normalizePosixPath(raw).split("/").map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, "-")).filter((segment) => segment && segment !== "." && segment !== "..");
  return segments.join("/") || "skill";
}
function detectSkillMdFormat(format, files, options) {
  const meta = FORMAT_META[format];
  const prefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;
  const skillPaths = [];
  const otherConfigPaths = [];
  let hasRootRule = false;
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2.startsWith(prefix) && p2.endsWith("/SKILL.md")) {
      skillPaths.push(p2);
    } else if (p2.startsWith(configPrefix)) {
      otherConfigPaths.push(p2);
    } else if (p2 === meta.rootRuleFile) {
      hasRootRule = true;
    }
  }
  let allowLoose = false;
  if (options?.allowLoose && skillPaths.length === 0 && otherConfigPaths.length === 0) {
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2 === "SKILL.md" || /^[^/]+\/SKILL\.md$/.test(p2)) {
        skillPaths.push(p2);
        allowLoose = true;
      }
    }
  }
  if (skillPaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
    return null;
  }
  const matchedPaths = [...skillPaths, ...otherConfigPaths];
  if (hasRootRule) {
    matchedPaths.push(meta.rootRuleFile);
  }
  const parts = [];
  if (skillPaths.length > 0) {
    parts.push(`${skillPaths.length} skill${skillPaths.length === 1 ? "" : "s"} found`);
  }
  if (hasRootRule) {
    parts.push(meta.rootRuleFile);
  }
  if (parts.length === 0) {
    parts.push(`${otherConfigPaths.length} config asset${otherConfigPaths.length === 1 ? "" : "s"}`);
  }
  return {
    format,
    label: meta.label,
    skillCount: skillPaths.length,
    hasRootRule,
    summary: `${meta.label} \u2014 ${parts.join(", ")}`,
    matchedPaths,
    allowLoose
  };
}
function parseSkillMdFormat(format, files, options) {
  const meta = FORMAT_META[format];
  const skillsPrefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;
  const skillsMap = /* @__PURE__ */ new Map();
  const looseAssetsBySkill = /* @__PURE__ */ new Map();
  const rootRules = [];
  const sharedAssets = [];
  const skillRoots = [];
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2.startsWith(skillsPrefix) && p2.endsWith("/SKILL.md")) {
      const rest = p2.slice(skillsPrefix.length);
      const skillDir = rest.slice(0, -"/SKILL.md".length);
      if (!skillDir) continue;
      skillRoots.push({
        skillName: skillDir,
        rootDir: `${skillsPrefix}${skillDir}/`,
        file
      });
    }
  }
  if (options?.allowLoose && skillRoots.length === 0) {
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2 === "SKILL.md") {
        const parsed = parseMarkdownWithFrontmatter(file.content.toString("utf8"));
        const inferred = typeof parsed.data.name === "string" && parsed.data.name.trim() || options.subpathName || "skill";
        skillRoots.push({
          skillName: sanitizeSkillName(inferred),
          rootDir: "",
          file
        });
      } else if (/^[^/]+\/SKILL\.md$/.test(p2)) {
        const skillDir = p2.slice(0, -"/SKILL.md".length);
        skillRoots.push({
          skillName: sanitizeSkillName(skillDir),
          rootDir: `${skillDir}/`,
          file
        });
      }
    }
  }
  for (const entry of skillRoots) {
    const raw = entry.file.content.toString("utf8");
    const { data, body } = parseMarkdownWithFrontmatter(raw);
    const {
      name,
      description,
      "allowed-tools": allowedToolsRaw,
      globs,
      alwaysApply,
      ...rest
    } = data;
    const skillName = typeof name === "string" && name.trim() ? sanitizeSkillName(name.trim()) : sanitizeSkillName(entry.skillName);
    let allowedTools;
    if (typeof allowedToolsRaw === "string" && allowedToolsRaw.trim()) {
      allowedTools = allowedToolsRaw.trim();
    } else if (Array.isArray(allowedToolsRaw)) {
      allowedTools = allowedToolsRaw.map((t) => String(t).trim()).filter(Boolean);
    }
    skillsMap.set(entry.rootDir || "__ROOT__", {
      name: skillName,
      description: typeof description === "string" ? description.trim() : "",
      body,
      globs: normalizeGlobs(globs),
      alwaysApply: typeof alwaysApply === "boolean" ? alwaysApply : void 0,
      allowedTools,
      assets: [],
      extraFrontmatter: Object.keys(rest).length > 0 ? rest : void 0
    });
  }
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2 === meta.rootRuleFile) {
      rootRules.push({
        sourceFilename: meta.rootRuleFile,
        content: file.content.toString("utf8")
      });
      continue;
    }
    const matchedRoot = skillRoots.find((sr) => normalizePosixPath(sr.file.path) === p2);
    if (matchedRoot) {
      continue;
    }
    let attachedToSkill = false;
    for (const sr of skillRoots) {
      if (sr.rootDir && p2.startsWith(sr.rootDir)) {
        const rel = p2.slice(sr.rootDir.length);
        const skill = skillsMap.get(sr.rootDir);
        if (skill && rel) {
          skill.assets.push({
            relativePath: rel,
            content: file.content,
            isText: isTextFile(p2, file.content)
          });
          attachedToSkill = true;
          break;
        }
      } else if (!sr.rootDir && !p2.startsWith(configPrefix)) {
        const skill = skillsMap.get("__ROOT__");
        if (skill) {
          skill.assets.push({
            relativePath: p2,
            content: file.content,
            isText: isTextFile(p2, file.content)
          });
          attachedToSkill = true;
          break;
        }
      }
    }
    if (attachedToSkill) {
      continue;
    }
    if (p2.startsWith(configPrefix)) {
      const rel = p2.slice(configPrefix.length);
      if (rel) {
        sharedAssets.push({
          relativePath: rel,
          content: file.content,
          isText: isTextFile(p2, file.content)
        });
      }
    }
  }
  for (const [key, assets] of looseAssetsBySkill.entries()) {
    const skill = skillsMap.get(key);
    if (skill) {
      skill.assets.push(...assets);
    }
  }
  return {
    sourceFormat: format,
    sourceLabel: meta.label,
    skills: Array.from(skillsMap.values()),
    rootRules,
    sharedAssets
  };
}
function emitSkillMdFormat(format, pkg, options, includeAllowedTools = false) {
  const meta = FORMAT_META[format];
  const isGlobal = Boolean(options?.global);
  const basePrefix = isGlobal ? "" : `${meta.configDir}/`;
  const emitted = [];
  for (const skill of pkg.skills) {
    const frontmatter = {
      name: skill.name,
      description: formatSkillDescriptionForSkillMd(skill)
    };
    if (includeAllowedTools && skill.allowedTools !== void 0) {
      frontmatter["allowed-tools"] = skill.allowedTools;
    }
    const skillDir = `${basePrefix}skills/${skill.name}`;
    emitted.push({
      relativePath: `${skillDir}/SKILL.md`,
      content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
      targetFormat: format
    });
    for (const asset of skill.assets) {
      emitted.push({
        relativePath: `${skillDir}/${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: format
      });
    }
  }
  for (const asset of pkg.sharedAssets) {
    emitted.push({
      relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
      content: asset.content,
      targetFormat: format
    });
  }
  for (const rule of pkg.rootRules) {
    const normalized = rule.content.replace(/\r\n/g, "\n");
    const content = normalized.endsWith("\n") ? normalized : `${normalized}
`;
    emitted.push({
      relativePath: meta.rootRuleFile,
      content: Buffer.from(content, "utf8"),
      targetFormat: format
    });
  }
  return emitted;
}

// src/adapters/claude.ts
var claudeAdapter = {
  id: "claude",
  label: "Claude Code (.claude/)",
  configDir: ".claude",
  rootRuleFile: "CLAUDE.md",
  getGlobalDir() {
    return path.join(os.homedir(), ".claude");
  },
  detect(files, options) {
    return detectSkillMdFormat("claude", files, options);
  },
  parse(files, options) {
    return parseSkillMdFormat("claude", files, options);
  },
  emit(pkg, options) {
    return emitSkillMdFormat("claude", pkg, options, true);
  }
};

// src/adapters/codex.ts
import os2 from "os";
import path2 from "path";
var codexAdapter = {
  id: "codex",
  label: "Codex CLI (.codex/)",
  configDir: ".codex",
  rootRuleFile: "AGENTS.md",
  getGlobalDir() {
    return path2.join(os2.homedir(), ".codex");
  },
  detect(files, options) {
    return detectSkillMdFormat("codex", files, options);
  },
  parse(files, options) {
    return parseSkillMdFormat("codex", files, options);
  },
  emit(pkg, options) {
    return emitSkillMdFormat("codex", pkg, options, false);
  }
};

// src/adapters/cursor.ts
import os3 from "os";
import path3 from "path";
var RULES_PREFIX = ".cursor/rules/";
var CONFIG_PREFIX = ".cursor/";
var ROOT_RULE_FILE = ".cursorrules";
var cursorAdapter = {
  id: "cursor",
  label: "Cursor (.cursor/)",
  configDir: ".cursor",
  rootRuleFile: ROOT_RULE_FILE,
  getGlobalDir() {
    return path3.join(os3.homedir(), ".cursor");
  },
  detect(files, options) {
    const rulePaths = [];
    const otherConfigPaths = [];
    let hasRootRule = false;
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2.startsWith(RULES_PREFIX) && p2.endsWith(".mdc")) {
        rulePaths.push(p2);
      } else if (p2.startsWith(CONFIG_PREFIX)) {
        otherConfigPaths.push(p2);
      } else if (p2 === ROOT_RULE_FILE) {
        hasRootRule = true;
      }
    }
    let allowLoose = false;
    if (options?.allowLoose && rulePaths.length === 0 && otherConfigPaths.length === 0) {
      for (const file of files) {
        const p2 = normalizePosixPath(file.path);
        if (p2.endsWith(".mdc")) {
          rulePaths.push(p2);
          allowLoose = true;
        }
      }
    }
    if (rulePaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
      return null;
    }
    const matchedPaths = [...rulePaths, ...otherConfigPaths];
    if (hasRootRule) {
      matchedPaths.push(ROOT_RULE_FILE);
    }
    const parts = [];
    if (rulePaths.length > 0) {
      parts.push(`${rulePaths.length} skill${rulePaths.length === 1 ? "" : "s"} found`);
    }
    if (hasRootRule) {
      parts.push(ROOT_RULE_FILE);
    }
    if (parts.length === 0) {
      parts.push(`${otherConfigPaths.length} config asset${otherConfigPaths.length === 1 ? "" : "s"}`);
    }
    return {
      format: "cursor",
      label: this.label,
      skillCount: rulePaths.length,
      hasRootRule,
      summary: `${this.label} \u2014 ${parts.join(", ")}`,
      matchedPaths,
      allowLoose
    };
  },
  parse(files, options) {
    const skillsByName = /* @__PURE__ */ new Map();
    const rootRules = [];
    const sharedAssets = [];
    const mdcFiles = [];
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2.startsWith(RULES_PREFIX) && p2.endsWith(".mdc")) {
        const skillName = p2.slice(RULES_PREFIX.length, -".mdc".length);
        if (skillName) {
          mdcFiles.push({ skillName, file });
        }
      }
    }
    if (options?.allowLoose && mdcFiles.length === 0) {
      for (const file of files) {
        const p2 = normalizePosixPath(file.path);
        if (p2.endsWith(".mdc")) {
          const skillName = p2.slice(0, -".mdc".length);
          if (skillName) {
            mdcFiles.push({ skillName, file });
          }
        }
      }
    }
    for (const entry of mdcFiles) {
      const raw = entry.file.content.toString("utf8");
      const { data, body } = parseMarkdownWithFrontmatter(raw);
      const { description, globs, alwaysApply, ...rest } = data;
      skillsByName.set(entry.skillName, {
        name: entry.skillName,
        description: typeof description === "string" ? description.trim() : "",
        body,
        globs: normalizeGlobs(globs),
        alwaysApply: typeof alwaysApply === "boolean" ? alwaysApply : void 0,
        assets: [],
        extraFrontmatter: Object.keys(rest).length > 0 ? rest : void 0
      });
    }
    const mdcPathSet = new Set(mdcFiles.map((m) => normalizePosixPath(m.file.path)));
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (mdcPathSet.has(p2)) {
        continue;
      }
      if (p2 === ROOT_RULE_FILE) {
        rootRules.push({
          sourceFilename: ROOT_RULE_FILE,
          content: file.content.toString("utf8")
        });
        continue;
      }
      if (p2.startsWith(RULES_PREFIX)) {
        const rest = p2.slice(RULES_PREFIX.length);
        let attached = false;
        for (const [skillName, skill] of skillsByName.entries()) {
          const companionPrefix = `${skillName}/`;
          if (rest.startsWith(companionPrefix)) {
            const rel = rest.slice(companionPrefix.length);
            if (rel) {
              skill.assets.push({
                relativePath: rel,
                content: file.content,
                isText: isTextFile(p2, file.content)
              });
              attached = true;
              break;
            }
          }
        }
        if (attached) {
          continue;
        }
      }
      if (p2.startsWith(CONFIG_PREFIX)) {
        const rel = p2.slice(CONFIG_PREFIX.length);
        if (rel) {
          sharedAssets.push({
            relativePath: rel,
            content: file.content,
            isText: isTextFile(p2, file.content)
          });
        }
      }
    }
    return {
      sourceFormat: "cursor",
      sourceLabel: this.label,
      skills: Array.from(skillsByName.values()),
      rootRules,
      sharedAssets
    };
  },
  emit(pkg, options) {
    const isGlobal = Boolean(options?.global);
    const basePrefix = isGlobal ? "" : CONFIG_PREFIX;
    const emitted = [];
    for (const skill of pkg.skills) {
      const frontmatter = {
        description: skill.description
      };
      if (skill.globs && skill.globs.length > 0) {
        frontmatter.globs = skill.globs.join(", ");
      }
      frontmatter.alwaysApply = skill.alwaysApply ?? false;
      emitted.push({
        relativePath: `${basePrefix}rules/${skill.name}.mdc`,
        content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
        targetFormat: "cursor"
      });
      for (const asset of skill.assets) {
        emitted.push({
          relativePath: `${basePrefix}rules/${skill.name}/${normalizePosixPath(asset.relativePath)}`,
          content: asset.content,
          targetFormat: "cursor"
        });
      }
    }
    for (const asset of pkg.sharedAssets) {
      emitted.push({
        relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: "cursor"
      });
    }
    for (const rule of pkg.rootRules) {
      const normalized = rule.content.replace(/\r\n/g, "\n");
      const content = normalized.endsWith("\n") ? normalized : `${normalized}
`;
      emitted.push({
        relativePath: ROOT_RULE_FILE,
        content: Buffer.from(content, "utf8"),
        targetFormat: "cursor"
      });
    }
    return emitted;
  }
};

// src/adapters/opencode.ts
import os4 from "os";
import path4 from "path";
var opencodeAdapter = {
  id: "opencode",
  label: "OpenCode (.opencode/)",
  configDir: ".opencode",
  rootRuleFile: "AGENTS.md",
  getGlobalDir() {
    return path4.join(os4.homedir(), ".config", "opencode");
  },
  detect(files, options) {
    return detectSkillMdFormat("opencode", files, options);
  },
  parse(files, options) {
    return parseSkillMdFormat("opencode", files, options);
  },
  emit(pkg, options) {
    return emitSkillMdFormat("opencode", pkg, options, false);
  }
};

// src/adapters/registry.ts
var ADAPTERS = [
  cursorAdapter,
  claudeAdapter,
  opencodeAdapter,
  codexAdapter
];
var ADAPTER_MAP = {
  cursor: cursorAdapter,
  claude: claudeAdapter,
  opencode: opencodeAdapter,
  codex: codexAdapter
};
function getAdapter(id) {
  return ADAPTER_MAP[id];
}
function detectFormats(files, options) {
  const strictResults = [];
  for (const adapter of ADAPTERS) {
    const detected = adapter.detect(files, { ...options, allowLoose: false });
    if (detected) {
      strictResults.push(detected);
    }
  }
  if (strictResults.length > 0) {
    const hasOpencodeDir = strictResults.some(
      (r) => r.format === "opencode" && r.matchedPaths.some((p2) => p2.startsWith(".opencode/"))
    );
    const hasCodexDir = strictResults.some(
      (r) => r.format === "codex" && r.matchedPaths.some((p2) => p2.startsWith(".codex/"))
    );
    const hasUnambiguousFormat = strictResults.some((r) => {
      if (r.format !== "opencode" && r.format !== "codex") {
        return true;
      }
      const configDir = r.format === "opencode" ? ".opencode/" : ".codex/";
      return r.matchedPaths.some((p2) => p2.startsWith(configDir));
    });
    return strictResults.filter((r) => {
      if (r.format !== "opencode" && r.format !== "codex") {
        return true;
      }
      const hasOwnDir = r.format === "opencode" ? hasOpencodeDir : hasCodexDir;
      if (hasOwnDir) {
        return true;
      }
      const siblingHasDir = r.format === "opencode" ? hasCodexDir : hasOpencodeDir;
      return !hasUnambiguousFormat && !siblingHasDir;
    });
  }
  const looseResults = [];
  for (const candidate of [claudeAdapter, cursorAdapter]) {
    const detected = candidate.detect(files, { ...options, allowLoose: true });
    if (detected) {
      looseResults.push(detected);
    }
  }
  return looseResults;
}

// src/core/fetcher.ts
import fs from "fs";
import path5 from "path";
import zlib from "zlib";
var VALID_SEGMENT_RE = /^[A-Za-z0-9_.-]+$/;
var IGNORED_LOCAL_DIRS = /* @__PURE__ */ new Set([".git", "node_modules", "dist"]);
function parseGitHubSource(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    throw new Error("Source repository or path cannot be empty.");
  }
  if (fs.existsSync(input)) {
    const stat = fs.statSync(input);
    if (stat.isDirectory()) {
      const resolved = path5.resolve(input);
      return {
        type: "local",
        localPath: resolved,
        displayLabel: path5.basename(resolved) || resolved
      };
    }
  }
  let normalized = input;
  const mdLinkMatch = normalized.match(/^\[[^\]]+\]\((https?:\/\/[^)]+)\)$/);
  if (mdLinkMatch) {
    normalized = mdLinkMatch[1];
  }
  if (/^https?:\/\//i.test(normalized)) {
    let url;
    try {
      url = new URL(normalized);
    } catch {
      throw new Error(`Invalid GitHub URL: "${input}"`);
    }
    if (!/^(?:www\.)?github\.com$/i.test(url.hostname)) {
      throw new Error(`Only github.com repositories are supported (got "${url.hostname}").`);
    }
    normalized = url.pathname.replace(/^\/+/, "");
  } else if (/^(?:www\.)?github\.com\//i.test(normalized)) {
    normalized = normalized.replace(/^(?:www\.)?github\.com\//i, "");
  }
  normalized = normalized.replace(/\/+$/, "");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error(
      `Invalid GitHub source "${input}". Expected "owner/repo", a GitHub URL, or a local directory.`
    );
  }
  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, "");
  if (!VALID_SEGMENT_RE.test(owner) || !VALID_SEGMENT_RE.test(repo) || owner === "." || owner === ".." || repo === "." || repo === "..") {
    throw new Error(`Invalid GitHub owner/repo in "${input}".`);
  }
  let ref;
  let subpath;
  if (segments.length > 2) {
    if (segments[2] === "tree" && segments.length >= 4) {
      ref = segments[3];
      if (segments.length > 4) {
        subpath = segments.slice(4).join("/");
      }
    } else {
      throw new Error(
        `Unsupported GitHub path "${input}". Expected "owner/repo" or "owner/repo/tree/<branch>/<subpath>".`
      );
    }
  }
  const displayLabel = subpath ? `${owner}/${repo}/${subpath}` : ref ? `${owner}/${repo}@${ref}` : `${owner}/${repo}`;
  return {
    type: "github",
    owner,
    repo,
    ref,
    subpath,
    displayLabel
  };
}
function readTarString(buf, start, length) {
  const slice = buf.subarray(start, start + length);
  const nulIdx = slice.indexOf(0);
  const end = nulIdx === -1 ? slice.length : nulIdx;
  return slice.subarray(0, end).toString("utf8");
}
function readTarSize(buf, start, length) {
  const slice = buf.subarray(start, start + length);
  if ((slice[0] & 128) !== 0) {
    let value = 0;
    for (let i = 1; i < slice.length; i++) {
      value = value * 256 + slice[i];
    }
    return value;
  }
  const raw = readTarString(buf, start, length).trim();
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 8);
  return Number.isFinite(parsed) ? parsed : 0;
}
function parsePaxHeaders(data) {
  const headers = {};
  const text2 = data.toString("utf8");
  let cursor = 0;
  while (cursor < text2.length) {
    const spaceIdx = text2.indexOf(" ", cursor);
    if (spaceIdx === -1) break;
    const len = Number.parseInt(text2.slice(cursor, spaceIdx), 10);
    if (!Number.isFinite(len) || len <= 0) break;
    const record = text2.slice(spaceIdx + 1, cursor + len).replace(/\n$/, "");
    const eqIdx = record.indexOf("=");
    if (eqIdx !== -1) {
      headers[record.slice(0, eqIdx)] = record.slice(eqIdx + 1);
    }
    cursor += len;
  }
  return headers;
}
function isSafeRelativePath(posixPath) {
  if (!posixPath || posixPath.startsWith("/")) {
    return false;
  }
  const parts = posixPath.split("/");
  return !parts.some((part) => part === ".." || part === "");
}
function extractTarGz(gzipBuffer, subpath) {
  const tarBuffer = zlib.gunzipSync(gzipBuffer);
  const normalizedSubpath = subpath ? normalizePosixPath(subpath) : "";
  const files = [];
  let offset = 0;
  let nextLongName;
  let nextPaxPath;
  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);
    offset += 512;
    if (header.every((b) => b === 0)) {
      break;
    }
    const name = readTarString(header, 0, 100);
    const size = readTarSize(header, 124, 12);
    const typeFlag = String.fromCharCode(header[156] || 0);
    const prefix = readTarString(header, 345, 155);
    const paddedSize = Math.ceil(size / 512) * 512;
    const dataEnd = Math.min(offset + size, tarBuffer.length);
    const content = Buffer.from(tarBuffer.subarray(offset, dataEnd));
    offset += paddedSize;
    if (typeFlag === "L") {
      nextLongName = content.toString("utf8").replace(/\0+$/, "");
      continue;
    }
    if (typeFlag === "x") {
      const pax = parsePaxHeaders(content);
      if (pax.path) {
        nextPaxPath = pax.path;
      }
      continue;
    }
    if (typeFlag === "g") {
      continue;
    }
    let rawEntryPath = nextPaxPath ?? nextLongName ?? (prefix ? `${prefix}/${name}` : name);
    nextLongName = void 0;
    nextPaxPath = void 0;
    if (typeFlag !== "0" && typeFlag !== "\0") {
      continue;
    }
    rawEntryPath = rawEntryPath.replace(/\\/g, "/").replace(/^\.\//, "");
    const firstSlash = rawEntryPath.indexOf("/");
    if (firstSlash === -1) {
      continue;
    }
    let relPath = normalizePosixPath(rawEntryPath.slice(firstSlash + 1));
    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }
    if (normalizedSubpath) {
      const subPrefix = `${normalizedSubpath}/`;
      if (relPath.startsWith(subPrefix)) {
        relPath = relPath.slice(subPrefix.length);
      } else {
        continue;
      }
    }
    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }
    files.push({ path: relPath, content });
  }
  return files;
}
function readLocalDirectory(rootDir) {
  const files = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_LOCAL_DIRS.has(entry.name)) {
          continue;
        }
        walk(path5.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        const abs = path5.join(currentDir, entry.name);
        const rel = normalizePosixPath(path5.relative(rootDir, abs));
        if (rel) {
          files.push({
            path: rel,
            content: fs.readFileSync(abs)
          });
        }
      }
    }
  }
  walk(rootDir);
  return files;
}
async function downloadGitHubTarball(owner, repo, ref) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = {
    "User-Agent": "uniskill-cli",
    Accept: "application/vnd.github+json"
  };
  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tarball${ref ? `/${encodeURIComponent(ref)}` : ""}`;
  const codeloadUrl = `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tar.gz/${encodeURIComponent(ref ?? "HEAD")}`;
  const urls = token ? [apiUrl, codeloadUrl] : [codeloadUrl, apiUrl];
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  let lastStatus = 0;
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: url.startsWith("https://api.github.com") ? headers : { "User-Agent": "uniskill-cli" },
        redirect: "follow"
      });
      if (response.ok) {
        const arr = await response.arrayBuffer();
        return Buffer.from(arr);
      }
      lastStatus = response.status;
      lastError = `${response.status} ${response.statusText}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  if (lastStatus === 404) {
    throw new Error(
      `Repository or branch not found on GitHub: "${owner}/${repo}"${ref ? ` (ref: ${ref})` : ""}.`
    );
  }
  throw new Error(
    `Failed to fetch "${owner}/${repo}" from GitHub${lastError ? ` (${lastError})` : ""}.`
  );
}
async function fetchSource(input) {
  const source = parseGitHubSource(input);
  if (source.type === "local") {
    const files2 = readLocalDirectory(source.localPath);
    if (files2.length === 0) {
      throw new Error(`No files found in local directory "${source.localPath}".`);
    }
    return { source, files: files2 };
  }
  const tarball = await downloadGitHubTarball(
    source.owner,
    source.repo,
    source.ref
  );
  const files = extractTarGz(tarball, source.subpath);
  if (files.length === 0) {
    if (source.subpath) {
      throw new Error(
        `No files found at subpath "${source.subpath}" in "${source.owner}/${source.repo}".`
      );
    }
    throw new Error(`Repository "${source.owner}/${source.repo}" appears to be empty.`);
  }
  const subpathName = source.subpath ? path5.posix.basename(normalizePosixPath(source.subpath)) : void 0;
  return {
    source,
    files,
    subpathName
  };
}

// src/core/writer.ts
import fs2 from "fs";
import path6 from "path";
function writeEmittedFiles(files, targetDir, options = {}) {
  const force = Boolean(options.force);
  const dryRun = Boolean(options.dryRun);
  const seenPaths = options.seenPaths ?? /* @__PURE__ */ new Map();
  const resolvedRoot = path6.resolve(targetDir);
  const summary = {
    created: 0,
    overwritten: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: []
  };
  for (const file of files) {
    const rel = normalizePosixPath(file.relativePath);
    if (!rel || rel.split("/").some((seg) => seg === "..")) {
      throw new Error(`Refusing unsafe target path "${file.relativePath}".`);
    }
    const absolutePath = path6.resolve(resolvedRoot, rel);
    if (absolutePath !== resolvedRoot && !absolutePath.startsWith(resolvedRoot + path6.sep)) {
      throw new Error(`Target path escapes destination directory: "${file.relativePath}".`);
    }
    const emittedEarlier = seenPaths.get(absolutePath);
    const exists = fs2.existsSync(absolutePath);
    let status;
    if (emittedEarlier) {
      if (emittedEarlier.equals(file.content)) {
        status = "duplicate";
        summary.duplicate += 1;
      } else {
        status = "conflict";
        summary.conflict += 1;
      }
    } else if (exists && !force) {
      status = "skipped";
      summary.skipped += 1;
    } else if (exists && force) {
      status = "overwritten";
      summary.overwritten += 1;
      if (!dryRun) {
        fs2.mkdirSync(path6.dirname(absolutePath), { recursive: true });
        fs2.writeFileSync(absolutePath, file.content);
      }
    } else {
      status = "created";
      summary.created += 1;
      if (!dryRun) {
        fs2.mkdirSync(path6.dirname(absolutePath), { recursive: true });
        fs2.writeFileSync(absolutePath, file.content);
      }
    }
    if (!emittedEarlier) {
      seenPaths.set(absolutePath, file.content);
    }
    summary.actions.push({
      relativePath: rel,
      absolutePath,
      status,
      targetFormat: file.targetFormat,
      dryRun
    });
  }
  return summary;
}

// src/core/pipeline.ts
async function fetchAndDetect(source, fromFormat = "auto") {
  const fetchResult = await fetchSource(source);
  if (fromFormat !== "auto") {
    const adapter = getAdapter(fromFormat);
    const detected = adapter.detect(fetchResult.files, {
      subpathName: fetchResult.subpathName,
      allowLoose: false
    }) ?? adapter.detect(fetchResult.files, {
      subpathName: fetchResult.subpathName,
      allowLoose: true
    });
    if (!detected) {
      throw new Error(
        `No ${adapter.label} skills or rules found in "${fetchResult.source.displayLabel}".`
      );
    }
    return {
      fetchResult,
      detections: [detected]
    };
  }
  const detections = detectFormats(fetchResult.files, {
    subpathName: fetchResult.subpathName
  });
  if (detections.length === 0) {
    throw new Error(
      `Could not detect any supported skill format (.cursor, .claude, .opencode, .codex) in "${fetchResult.source.displayLabel}".`
    );
  }
  return { fetchResult, detections };
}
function convertAndWrite(options) {
  const sourceAdapter = getAdapter(options.sourceFormat);
  const pkg = sourceAdapter.parse(options.files, {
    subpathName: options.subpathName,
    allowLoose: options.allowLoose
  });
  const combined = {
    created: 0,
    overwritten: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: []
  };
  const seenPaths = /* @__PURE__ */ new Map();
  for (const targetFormat of options.targetFormats) {
    const targetAdapter = getAdapter(targetFormat);
    const rewrittenPkg = rewritePackage(pkg, targetFormat);
    const emitted = targetAdapter.emit(rewrittenPkg, {
      global: options.global
    });
    const destination = options.global ? targetAdapter.getGlobalDir() : options.targetDir;
    const result = writeEmittedFiles(emitted, destination, {
      force: options.force,
      dryRun: options.dryRun,
      seenPaths
    });
    combined.created += result.created;
    combined.overwritten += result.overwritten;
    combined.skipped += result.skipped;
    combined.duplicate += result.duplicate;
    combined.conflict += result.conflict;
    combined.actions.push(...result.actions);
  }
  return { pkg, summary: combined };
}

// src/cli/args.ts
import { cac } from "cac";

// package.json
var package_default = {
  name: "uniskill",
  version: "0.1.0",
  description: "Convert and install AI-agent skills between Cursor, Claude Code, OpenCode, and Codex CLI",
  author: "liferes",
  repository: {
    type: "git",
    url: "git+https://github.com/liferes/uniskill.git"
  },
  homepage: "https://github.com/liferes/uniskill#readme",
  bugs: {
    url: "https://github.com/liferes/uniskill/issues"
  },
  type: "module",
  engines: {
    node: ">=18.0.0"
  },
  bin: {
    uniskill: "dist/index.js"
  },
  files: [
    "dist",
    "README.md"
  ],
  scripts: {
    build: "tsup",
    typecheck: "tsc --noEmit",
    test: "vitest run",
    "test:watch": "vitest",
    prepublishOnly: "npm run typecheck && npm run build && npm test"
  },
  keywords: [
    "ai",
    "agent",
    "skills",
    "cursor",
    "claude",
    "opencode",
    "codex",
    "cli"
  ],
  license: "MIT",
  dependencies: {
    "@clack/prompts": "^0.10.1",
    cac: "^6.7.14",
    "gray-matter": "^4.0.3",
    picocolors: "^1.1.1"
  },
  devDependencies: {
    "@types/node": "^22.15.3",
    tsup: "^8.5.0",
    typescript: "^5.8.3",
    vitest: "^3.1.3"
  }
};

// src/cli/args.ts
var VALID_FORMAT_SET = new Set(FORMAT_IDS);
function parseTargetFormats(raw) {
  const tokens = raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error("Target format cannot be empty. Expected: claude, opencode, codex, cursor, or all.");
  }
  const resolved = [];
  for (const token of tokens) {
    if (token === "all") {
      for (const id of FORMAT_IDS) {
        if (!resolved.includes(id)) {
          resolved.push(id);
        }
      }
      continue;
    }
    if (!VALID_FORMAT_SET.has(token)) {
      throw new Error(
        `Unsupported target format "${token}". Valid targets: ${FORMAT_IDS.join(", ")}, all.`
      );
    }
    const fmt = token;
    if (!resolved.includes(fmt)) {
      resolved.push(fmt);
    }
  }
  return resolved;
}
function parseSourceFormat(raw) {
  const value = (raw ?? "auto").trim().toLowerCase();
  if (value === "auto") {
    return "auto";
  }
  if (!VALID_FORMAT_SET.has(value)) {
    throw new Error(
      `Unsupported source format "${value}". Valid formats: auto, ${FORMAT_IDS.join(", ")}.`
    );
  }
  return value;
}
function parseCliArgs(argv) {
  const cli = cac("uniskill");
  cli.command(
    "[source] [dest]",
    "Convert and install AI-agent skills from a GitHub repo or local directory"
  ).option(
    "-t, --to <targets>",
    "Target format(s): claude, opencode, codex, cursor, or all"
  ).option("-p, --path <dir>", "Destination project directory", {
    default: "."
  }).option(
    "-f, --from <format>",
    "Override source auto-detection (auto, cursor, claude, opencode, codex)",
    { default: "auto" }
  ).option("-g, --global", "Install to user global agent config directory").option("-y, --yes", "Skip confirmation prompt").option("-d, --dry-run", "Preview planned actions without writing files").option("--force", "Overwrite existing files instead of skipping").example("uniskill").example("uniskill owner/repo -t claude").example("uniskill https://github.com/u/r -t opencode ./app -y").example("uniskill owner/repo/tree/main/skills/ui -t codex").example("uniskill owner/repo -t claude,opencode,codex").example("uniskill owner/repo -t opencode -g").example("uniskill owner/repo -t claude --dry-run");
  cli.help();
  cli.version(package_default.version);
  const parsed = cli.parse(argv, { run: false });
  const opts = parsed.options;
  if (opts.help || opts.version) {
    return { kind: "help_or_version" };
  }
  const sourceArg = parsed.args[0];
  const destArg = parsed.args[1];
  const hasActionFlags = Boolean(
    opts.to || opts.global || opts.yes || opts.dryRun || opts.force || opts.from && opts.from !== "auto" || opts.path && opts.path !== "."
  );
  if (!sourceArg && !hasActionFlags) {
    return { kind: "interactive" };
  }
  if (!sourceArg) {
    throw new Error(
      "Missing source repository or path. Run `uniskill` with no arguments for the interactive wizard, or `uniskill --help` for usage."
    );
  }
  const from = parseSourceFormat(
    typeof opts.from === "string" ? opts.from : void 0
  );
  const targets = typeof opts.to === "string" ? parseTargetFormats(opts.to) : void 0;
  const explicitPathFlag = argv.includes("-p") || argv.includes("--path") || argv.some((a) => a.startsWith("--path="));
  const targetDir = explicitPathFlag ? String(opts.path ?? ".") : destArg ?? String(opts.path ?? ".");
  return {
    kind: "command",
    source: sourceArg,
    targets,
    from,
    targetDir,
    global: Boolean(opts.global),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    force: Boolean(opts.force)
  };
}

// src/cli/logger.ts
import pc from "picocolors";
function logInfo(message) {
  console.log(`${pc.cyan("\u2139")} ${message}`);
}
function logWarn(message) {
  console.log(`${pc.yellow("\u26A0")} ${message}`);
}
function logError(message) {
  console.error(`${pc.red("\u2716")} ${message}`);
}
function formatActionLine(action, globalMode = false) {
  const prefix = action.dryRun ? `${pc.dim("[dry-run]")} ` : "";
  const displayPath = globalMode ? action.absolutePath : action.relativePath;
  switch (action.status) {
    case "created":
      return `${prefix}${pc.green("\u2714 Created")} ${displayPath}`;
    case "overwritten":
      return `${prefix}${pc.green("\u2714 Overwrote")} ${displayPath}`;
    case "skipped":
      return `${prefix}${pc.yellow("\u26A0 Skipped")} ${displayPath} ${pc.dim("(already exists)")}`;
    case "duplicate":
      return `${prefix}${pc.dim(`\u2261 ${displayPath} (written once for both targets)`)}`;
    case "conflict":
      return `${prefix}${pc.yellow("\u26A0 Conflict")} ${displayPath} ${pc.dim("(second target wanted different content; first kept)")}`;
  }
}
function logWriteSummary(summary, options = {}) {
  for (const action of summary.actions) {
    console.log(formatActionLine(action, options.global));
  }
  const parts = [];
  if (summary.created > 0 || summary.overwritten === 0) {
    parts.push(`${summary.created} created`);
  }
  if (summary.overwritten > 0) {
    parts.push(`${summary.overwritten} overwritten`);
  }
  parts.push(`${summary.skipped} skipped`);
  if (summary.conflict > 0) {
    parts.push(`${summary.conflict} conflict${summary.conflict === 1 ? "" : "s"}`);
  }
  const verb = options.dryRun ? "Dry run complete!" : "Done!";
  console.log("");
  console.log(`${pc.bold(pc.green(verb))} ${parts.join(", ")}.`);
  if (summary.conflict > 0) {
    logWarn(
      "Two target formats share a file name and produced different content. Install them one at a time with -t <format> if you need both."
    );
  }
}

// src/cli/prompts.ts
import * as p from "@clack/prompts";
import pc2 from "picocolors";
function assertNotCancelled(value) {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }
  return value;
}
async function promptSourceFormatSelection(detections) {
  const selected = assertNotCancelled(
    await p.select({
      message: "Multiple formats detected. Which source format should Uniskill read from?",
      options: detections.map((d) => ({
        value: d.format,
        label: d.summary
      }))
    })
  );
  const match = detections.find((d) => d.format === selected);
  if (!match) {
    throw new Error(`Selected format "${String(selected)}" not found.`);
  }
  return match;
}
async function promptTargetFormatSelection() {
  const selected = assertNotCancelled(
    await p.multiselect({
      message: "Select target format(s) to generate:",
      options: [
        { value: "all", label: "All supported formats" },
        ...FORMAT_IDS.map((id) => ({
          value: id,
          label: FORMAT_META[id].label
        }))
      ],
      required: true
    })
  );
  if (selected.includes("all")) {
    return [...FORMAT_IDS];
  }
  return selected;
}
async function promptConfirmation(sourceLabel, targetFormats, destinationLabel) {
  const targetNames = targetFormats.map((id) => FORMAT_META[id].label.split(" ")[0]).join(", ");
  return assertNotCancelled(
    await p.confirm({
      message: `Convert [${sourceLabel}] \u2794 [${targetNames}] into ${destinationLabel}?`,
      initialValue: true
    })
  );
}
async function runInteractiveWizard() {
  p.intro(pc2.bgCyan(pc2.black(" uniskill ")));
  const sourceInput = assertNotCancelled(
    await p.text({
      message: "GitHub repository URL, owner/repo, or local folder:",
      placeholder: "owner/repo or https://github.com/owner/repo",
      validate(value) {
        if (!value || !value.trim()) {
          return "Please enter a GitHub repo or local path.";
        }
        try {
          parseGitHubSource(value);
          return void 0;
        } catch (err) {
          return err instanceof Error ? err.message : String(err);
        }
      }
    })
  );
  const spin = p.spinner();
  spin.start(`Fetching ${sourceInput.trim()}...`);
  let fetchResult;
  let detections;
  try {
    const res = await fetchAndDetect(sourceInput.trim(), "auto");
    fetchResult = res.fetchResult;
    detections = res.detections;
    spin.stop(`Detected: ${detections.map((d) => d.summary).join(" | ")}`);
  } catch (err) {
    spin.stop("Fetch failed");
    p.log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
  const chosenDetection = detections.length === 1 ? detections[0] : await promptSourceFormatSelection(detections);
  const targetFormats = await promptTargetFormatSelection();
  const destinationMode = assertNotCancelled(
    await p.select({
      message: "Where should the converted skills be installed?",
      options: [
        { value: "cwd", label: "Current directory (.)" },
        { value: "custom", label: "Custom project path" },
        {
          value: "global",
          label: "Global config directories (~/.claude, ~/.config/opencode, ~/.codex, ~/.cursor)"
        }
      ]
    })
  );
  let targetDir = ".";
  const isGlobal = destinationMode === "global";
  if (destinationMode === "custom") {
    targetDir = assertNotCancelled(
      await p.text({
        message: "Target project directory:",
        initialValue: "./my-project",
        validate(value) {
          return !value || !value.trim() ? "Please provide a directory path." : void 0;
        }
      })
    );
  }
  const destinationLabel = isGlobal ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : targetDir;
  const sourceName = FORMAT_META[chosenDetection.format].label.split(" ")[0];
  const confirmed = await promptConfirmation(
    sourceName,
    targetFormats,
    destinationLabel
  );
  if (!confirmed) {
    p.cancel("Aborted. No files were written.");
    return;
  }
  const { summary } = convertAndWrite({
    files: fetchResult.files,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir,
    global: isGlobal,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose
  });
  for (const action of summary.actions) {
    console.log(formatActionLine(action, isGlobal));
  }
  p.outro(
    `${pc2.green("Done!")} ${summary.created} created, ${summary.skipped} skipped.`
  );
}

// src/index.ts
async function main() {
  const parsed = parseCliArgs(process.argv);
  if (parsed.kind === "help_or_version") {
    return;
  }
  if (parsed.kind === "interactive") {
    await runInteractiveWizard();
    return;
  }
  const { fetchResult, detections } = await fetchAndDetect(
    parsed.source,
    parsed.from
  );
  for (const d of detections) {
    logInfo(`Detected: ${d.summary}`);
  }
  let chosenDetection = detections[0];
  if (detections.length > 1) {
    if (!process.stdin.isTTY) {
      throw new Error(
        `Multiple formats detected (${detections.map((d) => d.format).join(", ")}). Specify one with --from <format>.`
      );
    }
    chosenDetection = await promptSourceFormatSelection(detections);
  }
  let targetFormats = parsed.targets;
  if (!targetFormats) {
    if (!process.stdin.isTTY) {
      throw new Error(
        "Missing target format. Specify -t, --to <claude|opencode|codex|cursor|all>."
      );
    }
    targetFormats = await promptTargetFormatSelection();
  }
  const destinationLabel = parsed.global ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : parsed.targetDir;
  if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY) {
    const sourceName = FORMAT_META[chosenDetection.format].label.split(" ")[0];
    const ok = await promptConfirmation(
      sourceName,
      targetFormats,
      destinationLabel
    );
    if (!ok) {
      logInfo(pc3.dim("Aborted. No files were written."));
      return;
    }
  }
  const { summary } = convertAndWrite({
    files: fetchResult.files,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir: parsed.targetDir,
    global: parsed.global,
    force: parsed.force,
    dryRun: parsed.dryRun,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose
  });
  logWriteSummary(summary, {
    dryRun: parsed.dryRun,
    global: parsed.global
  });
}
main().catch((err) => {
  logError(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
