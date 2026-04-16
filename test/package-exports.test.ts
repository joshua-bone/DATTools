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
        types: "./src/walls-core/index.ts",
        import: "./dist/walls-core.js",
      },
      "./walls-core": {
        types: "./src/walls-core/index.ts",
        import: "./dist/walls-core.js",
      },
      "./walls-dat": {
        types: "./src/walls-dat/index.ts",
        import: "./dist/walls-dat.js",
      },
      "./walls-react": {
        types: "./src/walls-react/index.ts",
        import: "./dist/walls-react.js",
      },
      "./package.json": "./package.json",
    });
  });
});
