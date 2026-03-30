import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { getWebBuildTarget, resolveWebBuildBasePath } from "./src/webBuildTarget";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const buildTarget = getWebBuildTarget(mode);
  const base = resolveWebBuildBasePath(command, buildTarget, process.env.GITHUB_REPOSITORY);

  return {
    root: "web",
    base,
    plugins: [react()],
    resolve: {
      alias: {
        "@": repoRoot,
      },
    },
    server: { fs: { allow: [".."] } },
    build: { outDir: "../dist-web", emptyOutDir: true },
  };
});
