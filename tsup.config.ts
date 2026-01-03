import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";
import type { Plugin } from "esbuild";

function resolveJsToTs(): Plugin {
  return {
    name: "resolve-js-to-ts",
    setup(build) {
      build.onResolve({ filter: /^\.\.?\// }, (args) => {
        if (!args.path.endsWith(".js")) return null;

        const absJs = path.resolve(args.resolveDir, args.path);
        const absTs = absJs.slice(0, -3) + ".ts";
        const absTsx = absJs.slice(0, -3) + ".tsx";

        if (fs.existsSync(absTs)) return { path: absTs };
        if (fs.existsSync(absTsx)) return { path: absTsx };

        return null;
      });
    },
  };
}

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",
  dts: false,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [resolveJsToTs()],
});
