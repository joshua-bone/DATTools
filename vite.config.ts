import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const base = command === "build" && repo ? `/${repo}/` : "/";

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
