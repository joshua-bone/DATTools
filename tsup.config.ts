import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

function withAlias(options: { alias?: Record<string, string> }): void {
  options.alias = {
    ...(options.alias ?? {}),
    "@": repoRoot,
  };
}

export default defineConfig([
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    platform: "node",
    target: "node18",
    dts: false,
    sourcemap: true,
    clean: true,
    esbuildOptions: withAlias,
  },
  {
    entry: {
      "walls-core": "src/walls-core/index.ts",
      "walls-dat": "src/walls-dat/index.ts",
      "walls-react": "src/walls-react/index.ts",
    },
    format: ["esm"],
    platform: "neutral",
    target: "es2022",
    dts: false,
    tsconfig: "tsconfig.lib.json",
    splitting: false,
    sourcemap: true,
    clean: false,
    esbuildOptions: withAlias,
  },
]);
