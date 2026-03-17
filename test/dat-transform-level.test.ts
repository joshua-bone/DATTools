import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";
import { transformLevel } from "../src/dat/datTransforms.js";
import { createEmptyLevel, paintLevelCells } from "../web/src/levelEditing.js";

describe("selected level transforms", () => {
  it("can transform one level without mutating its neighbors", () => {
    let first = createEmptyLevel(1, { title: "Level 1" });
    first = paintLevelCells(first, [0], "WALL");
    first = {
      ...first,
      movement: [0],
    };

    let second = createEmptyLevel(2, { title: "Level 2" });
    second = paintLevelCells(second, [1], "FIRE");

    const doc: DatLevelsetJsonV1 = {
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x0002aaac,
      levels: [first, second],
    };

    const nextDoc: DatLevelsetJsonV1 = {
      ...doc,
      levels: [transformLevel(doc.levels[0]!, "ROTATE_90"), doc.levels[1]!],
    };

    expect(nextDoc.levels[0]!.map.top[31]).toBe("WALL");
    expect(nextDoc.levels[0]!.movement).toEqual([31]);
    expect(nextDoc.levels[1]).toEqual(doc.levels[1]);
    expect(nextDoc.levels[1]!.map.top[1]).toBe("FIRE");
    expect(nextDoc.levels[1]!.map.top[31]).toBe("FLOOR");
  });
});
