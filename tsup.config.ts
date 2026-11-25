import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: false,
  dts: false,
  // Everything in one file, so the built CLI runs without node_modules.
  noExternal: [/.*/],
  banner: {
    // Bundled CJS deps still call require(), which ESM has no binding for.
    js: `#!/usr/bin/env node
import { createRequire as __everyagentCreateRequire } from "node:module";
const require = __everyagentCreateRequire(import.meta.url);`,
  },
});
