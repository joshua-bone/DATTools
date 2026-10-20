import { gunzipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { base64ToBytes } from "@/src/dat/base64";
import { tileCodeFromName, tileNameFromCode, rotateDirectionalTileName } from "@/src/dat/cc1Tiles";
import { decodeDatBytes, encodeDatBytes } from "@/src/dat/datCodec";
import { getDat3dTileDisplayName } from "@/src/dat/dat3dDisplay";
import type { DatLevelJson, DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { transformDatTileName, transformLevel } from "@/src/dat/datTransforms";
import { buildCc1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { createImage } from "@/src/dat/render/rgbaImage";
import { buildWallMaskBytes } from "@/src/dat/wallsBank";
import {
  classifyTilePlacement,
  copyLevelRegion,
  createEmptyLevel,
  getInvalidCellIndices,
  paintLevelCells,
  pasteLevelRegion,
  transformLevelClipboard,
} from "@/web/src/levelEditing";
import { getPaletteSections } from "@/web/src/paletteSections";
import { buildTworldUrl } from "@/web/src/tworld";

const MEME_NAMES = [
  "HINT_BOOTS",
  "RED_TANK_N",
  "RED_TANK_W",
  "RED_TANK_S",
  "RED_TANK_E",
  "RED_TANK_BUTTON_CW",
  "RED_TANK_BUTTON_CCW",
];
const DISPLAY_CONTEXT = { threeDEnabled: false, layerZ: 1, layerCount: 1 } as const;

function makeDoc(level: DatLevelJson): DatLevelsetJsonV1 {
  return { schema: "datTools.dat.levelset.json.v1", magicNumber: 0x0002aaac, levels: [level] };
}

function memeLevel(): DatLevelJson {
  const level = createEmptyLevel(1, { hint: "A B", password: "MEME" });
  return { ...level, map: { ...level.map, top: [...MEME_NAMES, ...level.map.top.slice(7)] } };
}

describe("Meme tiles editor and DAT contract", () => {
  it("decodes all seven byte aliases into semantic names and exports them losslessly", () => {
    const level = memeLevel();
    const aliases = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((name, i) =>
          i < 7 ? `UNKNOWN_0x${(0x76 + i).toString(16).toUpperCase()}` : name,
        ),
      },
    };
    const bytes = encodeDatBytes(makeDoc(aliases));
    const decoded = decodeDatBytes(bytes);
    expect(decoded.levels[0]?.map.top.slice(0, 7)).toEqual(MEME_NAMES);
    expect(encodeDatBytes(decoded)).toEqual(bytes);
    expect(encodeDatBytes(makeDoc(level))).toEqual(bytes);
    MEME_NAMES.forEach((name, i) => {
      expect(tileCodeFromName(name)).toBe(0x76 + i);
      expect(tileNameFromCode(0x76 + i)).toBe(name);
    });
  });

  it.each(["MS", "Lynx"] as const)(
    "includes semantic Meme tiles in the real %s play export",
    (ruleset) => {
      const url = new URL(buildTworldUrl(makeDoc(memeLevel()), 1, ruleset, "MEME.dat"));
      const payload = url.hash.slice(5).replaceAll("-", "+").replaceAll("_", "/");
      const bytes = base64ToBytes(payload + "=".repeat((4 - (payload.length % 4)) % 4));
      expect(decodeDatBytes(gunzipSync(bytes)).levels[0]?.map.top.slice(0, 7)).toEqual(MEME_NAMES);
    },
  );

  it("offers Meme tiles once, after Expanded, and excludes supported tiles from Invalid", () => {
    const options = { query: "", displayContext: DISPLAY_CONTEXT, threeDLevelsEnabled: false };
    const sections = getPaletteSections({ ...options, paletteTab: "normal" });
    expect(sections.map((section) => section.title)).toEqual([
      null,
      "Expanded Tiles",
      "Meme Tiles",
    ]);
    expect(sections[2]?.tiles).toEqual(MEME_NAMES);
    expect(sections[0]?.tiles.some((tile) => MEME_NAMES.includes(tile))).toBe(false);
    const invalid = getPaletteSections({ ...options, paletteTab: "invalid" }).flatMap(
      (section) => section.tiles,
    );
    expect(invalid).not.toContain("UNKNOWN_0x70");
    for (const name of MEME_NAMES) expect(invalid).not.toContain(name);
    expect(invalid).toContain("UNKNOWN_0x7D");
  });

  it.each([
    ["hint boots", ["HINT_BOOTS"]],
    ["red tank (north)", ["RED_TANK_N"]],
    ["counterclockwise", ["RED_TANK_BUTTON_CCW"]],
  ])("searches by friendly name %s", (query, names) => {
    const sections = getPaletteSections({
      paletteTab: "normal",
      query: query as string,
      displayContext: DISPLAY_CONTEXT,
      threeDLevelsEnabled: false,
    });
    expect(sections.flatMap((section) => section.tiles)).toEqual(names);
  });

  it("displays friendly names for semantic and legacy alias names", () => {
    expect(MEME_NAMES.map((name) => getDat3dTileDisplayName(name, DISPLAY_CONTEXT))).toEqual([
      "Hint Boots",
      "Red Tank (North)",
      "Red Tank (West)",
      "Red Tank (South)",
      "Red Tank (East)",
      "Red Tank Button (Clockwise)",
      "Red Tank Button (Counterclockwise)",
    ]);
    expect(getDat3dTileDisplayName("UNKNOWN_0x76", DISPLAY_CONTEXT)).toBe("Hint Boots");
  });

  it.each(["RED_TANK_N", "UNKNOWN_0x77"])(
    "places %s over terrain and tracks creature order through copy, transform, paste and erase",
    (tank) => {
      let level = paintLevelCells(createEmptyLevel(1), [33], "WALL");
      level = paintLevelCells(level, [65], "ANT_N");
      level = paintLevelCells(level, [33], tank);
      expect(classifyTilePlacement(tank)).toBe("actor");
      expect(level.map.bottom[33]).toBe("WALL");
      expect(level.movement).toEqual([65, 33]);
      expect(getInvalidCellIndices(level)).toEqual([]);
      expect(buildWallMaskBytes(level)[4]! & 64).toBe(64);
      const clipboard = transformLevelClipboard(
        copyLevelRegion(level, { x: 1, y: 1, width: 1, height: 1 }),
        "FLIP_V",
      );
      const pasted = pasteLevelRegion(createEmptyLevel(2), { x: 4, y: 3 }, clipboard);
      expect(pasted.map.top[100]).toBe("RED_TANK_S");
      expect(pasted.map.bottom[100]).toBe("WALL");
      expect(pasted.movement).toEqual([100]);
      const rotated = transformLevel(level, "ROTATE_90");
      expect(rotated.map.top[62]).toBe("RED_TANK_E");
      expect(rotated.map.bottom[62]).toBe("WALL");
      expect(rotated.movement).toEqual([61, 62]);
      expect(paintLevelCells(level, [33], "FLOOR").movement).toEqual([65]);
    },
  );

  it("keeps hint boots and turn buttons out of creature order", () => {
    let level = createEmptyLevel(1);
    for (const [i, name] of ["HINT_BOOTS", "RED_TANK_BUTTON_CW", "RED_TANK_BUTTON_CCW"].entries()) {
      expect(classifyTilePlacement(name)).toBe("terrain");
      level = paintLevelCells(level, [i], name);
    }
    expect(level.movement).toEqual([]);
  });

  it("rotates tanks while reflecting the handedness of turn buttons on every flip", () => {
    expect(rotateDirectionalTileName("RED_TANK_N", "clockwise")).toBe("RED_TANK_E");
    expect(rotateDirectionalTileName("UNKNOWN_0x77", "counterclockwise")).toBe("RED_TANK_W");
    for (const flip of ["FLIP_H", "FLIP_V", "FLIP_DIAG_NWSE", "FLIP_DIAG_NESW"] as const) {
      expect(transformDatTileName("RED_TANK_BUTTON_CW", flip)).toBe("RED_TANK_BUTTON_CCW");
      expect(transformDatTileName("RED_TANK_BUTTON_CCW", flip)).toBe("RED_TANK_BUTTON_CW");
      expect(transformDatTileName("UNKNOWN_0x7B", flip)).toBe("RED_TANK_BUTTON_CCW");
    }
    expect(transformDatTileName("RED_TANK_BUTTON_CW", "ROTATE_90")).toBe("RED_TANK_BUTTON_CW");
    expect(transformDatTileName("RED_TANK_E", "FLIP_H")).toBe("RED_TANK_W");
  });

  it("renders semantic atlas overrides for legacy numeric aliases", () => {
    const sprites = buildCc1SpriteSet(createImage(13 * 32, 16 * 32, [255, 0, 255, 255]), {
      HINT_BOOTS: createImage(32, 32, [255, 220, 0, 255]),
      RED_TANK_N: createImage(32, 32, [220, 10, 10, 255]),
    });
    expect([...sprites.get("UNKNOWN_0x76").data.slice(0, 4)]).toEqual([255, 220, 0, 255]);
    expect([...sprites.get("UNKNOWN_0x77").data.slice(0, 4)]).toEqual([220, 10, 10, 255]);
  });
});
