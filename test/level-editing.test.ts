import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";
import { clearLevel, replaceSelectedLevel } from "../web/src/levelEditing.js";

function makeDoc(): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [
      {
        number: 1,
        time: 100,
        chips: 7,
        mapDetail: 1,
        title: "One",
        map: {
          width: 32,
          height: 32,
          top: Array<string>(1024).fill("CHIP"),
          bottom: Array<string>(1024).fill("WALL"),
        },
        trapControls: [{ button: 1, trap: 2, openOrShut: 0 }],
        cloneControls: [{ button: 3, cloner: 4 }],
        movement: [5, 6],
        fieldOrder: [],
        extraFields: [],
      },
      {
        number: 2,
        time: 0,
        chips: 0,
        mapDetail: 1,
        title: "Two",
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
      },
    ],
  };
}

describe("level editing helpers", () => {
  it("clearLevel resets map contents and gameplay links but preserves metadata", () => {
    const level = clearLevel(makeDoc().levels[0]!);

    expect(level.title).toBe("One");
    expect(level.time).toBe(100);
    expect(level.chips).toBe(0);
    expect(new Set(level.map.top)).toEqual(new Set(["FLOOR"]));
    expect(new Set(level.map.bottom)).toEqual(new Set(["FLOOR"]));
    expect(level.trapControls).toEqual([]);
    expect(level.cloneControls).toEqual([]);
    expect(level.movement).toEqual([]);
  });

  it("replaceSelectedLevel only updates the targeted level", () => {
    const original = makeDoc();
    const updated = replaceSelectedLevel(original, 1, clearLevel);

    expect(updated.levels[0]).toEqual(original.levels[0]);
    expect(updated.levels[1]?.map.top[0]).toBe("FLOOR");
    expect(updated.levels[1]?.map.bottom[0]).toBe("FLOOR");
  });
});
