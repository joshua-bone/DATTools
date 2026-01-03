import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseDatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";
import { transformLevelset } from "../src/dat/datTransforms.js";

const SAMPLE = path.resolve(process.cwd(), "web", "public", "sample.levelset.json");

describe("DATTools transforms: group laws (sample)", () => {
  it("rotate^4 and flip^2 return original", async () => {
    const text = await readFile(SAMPLE, "utf8");
    const doc = parseDatLevelsetJsonV1(JSON.parse(text) as unknown);

    const r90 = transformLevelset(
      transformLevelset(
        transformLevelset(transformLevelset(doc, "ROTATE_90"), "ROTATE_90"),
        "ROTATE_90",
      ),
      "ROTATE_90",
    );
    expect(r90).toEqual(doc);

    const r180 = transformLevelset(transformLevelset(doc, "ROTATE_180"), "ROTATE_180");
    expect(r180).toEqual(doc);

    const fh = transformLevelset(transformLevelset(doc, "FLIP_H"), "FLIP_H");
    expect(fh).toEqual(doc);

    const fv = transformLevelset(transformLevelset(doc, "FLIP_V"), "FLIP_V");
    expect(fv).toEqual(doc);

    const d1 = transformLevelset(transformLevelset(doc, "FLIP_DIAG_NWSE"), "FLIP_DIAG_NWSE");
    expect(d1).toEqual(doc);

    const d2 = transformLevelset(transformLevelset(doc, "FLIP_DIAG_NESW"), "FLIP_DIAG_NESW");
    expect(d2).toEqual(doc);
  });
});
