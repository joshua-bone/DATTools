import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("package exports", () => {
  it("publishes the stable walls subpath exports", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );

    expect(packageJson.name).toBe("dattools");
    expect(packageJson.exports).toEqual({
      ".": {
        types: "./types/walls-core.d.ts",
        import: "./dist/walls-core.js",
      },
      "./walls-core": {
        types: "./types/walls-core.d.ts",
        import: "./dist/walls-core.js",
      },
      "./walls-dat": {
        types: "./types/walls-dat.d.ts",
        import: "./dist/walls-dat.js",
      },
      "./walls-react": {
        types: "./types/walls-react.d.ts",
        import: "./dist/walls-react.js",
      },
      "./walls-bank.json": "./web/public/walls/walls-bank.json",
      "./package.json": "./package.json",
    });
  });
});
