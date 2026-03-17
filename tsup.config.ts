import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",
  dts: false,
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      ...(options.alias ?? {}),
      "@": repoRoot,
    };
  },
});
