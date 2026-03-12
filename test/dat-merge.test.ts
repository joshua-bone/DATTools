import { describe, expect, it } from "vitest";

import { mergeDatLevelsets } from "../src/dat/datMerge.js";
import type { DatLevelJson, DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";

function makeLevel(number: number, title: string): DatLevelJson {
  return {
    number,
    time: number * 10,
    chips: number,
    mapDetail: 1,
    title,
    map: {
      width: 32,
      height: 32,
      top: Array<string>(1024).fill("FLOOR"),
      bottom: Array<string>(1024).fill("FLOOR"),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [],
    extraFields: [],
  };
}

function makeDoc(levels: ReadonlyArray<DatLevelJson>, magicNumber = 0x0002aaac): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels,
  };
}

describe("mergeDatLevelsets", () => {
  it("concatenates levelsets and renumbers levels sequentially", () => {
    const merged = mergeDatLevelsets([
      makeDoc([makeLevel(4, "Alpha"), makeLevel(7, "Beta")]),
      makeDoc([makeLevel(99, "Gamma")]),
    ]);

    expect(merged.magicNumber).toBe(0x0002aaac);
    expect(merged.levels.map((level) => level.number)).toEqual([1, 2, 3]);
    expect(merged.levels.map((level) => level.title)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("rejects mixed DAT magic numbers", () => {
    expect(() =>
      mergeDatLevelsets([
        makeDoc([makeLevel(1, "Alpha")], 0x0002aaac),
        makeDoc([makeLevel(1, "Beta")], 0x0002aaad),
      ]),
    ).toThrow(/magic number/i);
  });
});
