import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";
import {
  buildLogical3dLevelset,
  cloneDatLevel,
  countChipsInLogical3dLevel,
  editable3dLevelsFromDoc,
  export3dLevelsetDoc,
  rawDocFromEditable3dLevels,
  withInsertedBottomLayer,
  withInsertedTopLayer,
  withRemovedBottomLayer,
  withRemovedTopLayer,
} from "../src/dat/dat3dLevels.js";
import { createEmptyLevel } from "../web/src/levelEditing.js";

function makeLevel(
  number: number,
  title: string,
  patch: Partial<ReturnType<typeof createEmptyLevel>> = {},
) {
  return {
    ...createEmptyLevel(number, { title }),
    ...patch,
  };
}

describe("DAT 3D grouping helpers", () => {
  it("groups descending and ascending contiguous runs while leaving incomplete runs alone", () => {
    const doc: DatLevelsetJsonV1 = {
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x2aaac,
      levels: [
        makeLevel(1, "Tower\\3"),
        makeLevel(2, "Tower\\2"),
        makeLevel(3, "Tower\\1"),
        makeLevel(4, "Ramp\\1"),
        makeLevel(5, "Ramp\\2"),
        makeLevel(6, "Odd\\2"),
        makeLevel(7, "Plain"),
      ],
    };

    const logical = buildLogical3dLevelset(doc);

    expect(logical.levels).toHaveLength(4);
    expect(logical.levels.map((level) => level.displayTitle)).toEqual([
      "Tower",
      "Ramp",
      "Odd\\2",
      "Plain",
    ]);
    expect(logical.levels.map((level) => level.layers.length)).toEqual([3, 2, 1, 1]);
    expect(logical.levels[0]?.layers.map((layer) => layer.level.title)).toEqual([
      "Tower\\1",
      "Tower\\2",
      "Tower\\3",
    ]);
    expect(logical.levels[1]?.layers.map((layer) => layer.level.title)).toEqual([
      "Ramp\\1",
      "Ramp\\2",
    ]);
    expect(logical.levels[2]?.uses3dEncoding).toBe(false);
  });

  it("exports grouped levels in descending order with grouped ordinals and z1 metadata", () => {
    const z1 = {
      ...makeLevel(1, "Tower\\1", {
        time: 77,
        chips: 12,
        password: "ABCD",
        hint: "base hint",
      }),
      map: {
        width: 32 as const,
        height: 32 as const,
        top: Array<string>(1024).fill("CHIP"),
        bottom: Array<string>(1024).fill("FLOOR"),
      },
      movement: [5],
      trapControls: [{ button: 1, trap: 2, openOrShut: 0 }],
      cloneControls: [{ button: 3, cloner: 4 }],
    };
    const z2 = {
      ...makeLevel(2, "Tower\\2", {
        time: 1,
        chips: 0,
        password: "ZZZZ",
        hint: "upper hint",
      }),
      movement: [8],
      trapControls: [],
      cloneControls: [],
    };
    const doc: DatLevelsetJsonV1 = {
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x2aaac,
      levels: [z1, z2, makeLevel(3, "Plain")],
    };

    const exported = export3dLevelsetDoc(doc);

    expect(exported.levels.map((level) => level.title)).toEqual(["Tower\\2", "Tower\\1", "Plain"]);
    expect(exported.levels.map((level) => level.number)).toEqual([1, 1, 2]);
    expect(exported.levels[0]?.time).toBe(77);
    expect(exported.levels[0]?.chips).toBe(12);
    expect(exported.levels[0]?.password).toBe("ABCD");
    expect(exported.levels[0]?.hint).toBe("upper hint");
    expect(exported.levels[0]?.movement).toEqual([8]);
    expect(exported.levels[1]?.hint).toBe("base hint");
    expect(exported.levels[1]?.trapControls).toEqual([{ button: 1, trap: 2, openOrShut: 0 }]);
  });

  it("counts chips across all grouped layers", () => {
    const doc: DatLevelsetJsonV1 = {
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x2aaac,
      levels: [
        makeLevel(1, "Tower\\2", {
          map: {
            width: 32 as const,
            height: 32 as const,
            top: Array<string>(1024).fill("FLOOR"),
            bottom: Array<string>(1024).fill("CHIP"),
          },
        }),
        makeLevel(2, "Tower\\1", {
          map: {
            width: 32 as const,
            height: 32 as const,
            top: Array<string>(1024).fill("CHIP"),
            bottom: Array<string>(1024).fill("FLOOR"),
          },
        }),
      ],
    };

    const logical = buildLogical3dLevelset(doc);
    expect(countChipsInLogical3dLevel(logical.levels[0]!)).toBe(2048);
  });

  it("adds and removes top and bottom layers while keeping canonical metadata on the lowest layer", () => {
    const baseGroup = editable3dLevelsFromDoc({
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x2aaac,
      levels: [
        makeLevel(1, "Tower\\2", { hint: "top" }),
        makeLevel(2, "Tower\\1", {
          hint: "base",
          password: "ABCD",
          time: 90,
          chips: 4,
        }),
      ],
    })[0]!;

    const withTop = withInsertedTopLayer(baseGroup);
    expect(withTop.layers).toHaveLength(3);

    const withBottom = withInsertedBottomLayer(baseGroup);
    expect(withBottom.layers).toHaveLength(3);
    expect(withBottom.layers[0]?.password).toBe("ABCD");
    expect(new Set(withBottom.layers[0]!.map.top)).toEqual(new Set(["FLOOR"]));

    const removedTop = withRemovedTopLayer(withTop);
    expect(removedTop.layers).toHaveLength(2);

    const removedBottom = withRemovedBottomLayer(withBottom);
    expect(removedBottom.layers).toHaveLength(2);
    expect(removedBottom.layers[0]?.password).toBe("ABCD");
    expect(removedBottom.layers[0]?.time).toBe(90);
  });

  it("can rebuild raw slot-numbered docs from editable grouped levels", () => {
    const groups = editable3dLevelsFromDoc({
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x2aaac,
      levels: [makeLevel(1, "Tower\\1"), makeLevel(2, "Plain")],
    });
    const cloned = {
      ...groups[0]!,
      layers: [...groups[0]!.layers.map(cloneDatLevel), cloneDatLevel(groups[0]!.layers[0]!)],
    };
    const rebuilt = rawDocFromEditable3dLevels(0x2aaac, [cloned, groups[1]!]);

    expect(rebuilt.levels.map((level) => level.title)).toEqual(["Tower\\2", "Tower\\1", "Plain"]);
    expect(rebuilt.levels.map((level) => level.number)).toEqual([1, 2, 3]);
  });
});
