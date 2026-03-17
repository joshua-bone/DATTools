import { unzlibSync } from "fflate";
import { describe, expect, it } from "vitest";

import { base64ToBytes } from "@/src/dat/base64";
import { decodeDatBytes } from "@/src/dat/datCodec";
import type { DatLevelJson, DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import {
  buildLexysLabyrinthSharedDat,
  buildLexysLabyrinthSharedUrl,
} from "@/web/src/lexysLabyrinth";

function makeLevel(number: number, title: string, topTile = "FLOOR"): DatLevelJson {
  return {
    number,
    time: number * 10,
    chips: number,
    mapDetail: 1,
    title,
    map: {
      width: 32,
      height: 32,
      top: Array<string>(1024).fill(topTile),
      bottom: Array<string>(1024).fill("FLOOR"),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [],
    extraFields: [],
  };
}

function makeDoc(levels: ReadonlyArray<DatLevelJson>): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels,
  };
}

function decodeUrlSafeBase64(value: string): Uint8Array {
  const padding = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  return base64ToBytes(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
}

describe("Lexy's Labyrinth DAT export", () => {
  it("repeats the selected level across fallback level numbers", () => {
    const level = makeLevel(7, "Beta", "WALL");
    const decoded = decodeDatBytes(
      buildLexysLabyrinthSharedDat(makeDoc([makeLevel(1, "Alpha"), level]), level, 4),
    );

    expect(decoded.levels).toHaveLength(4);
    expect(decoded.levels.map((entry) => entry.number)).toEqual([1, 2, 3, 4]);
    expect(decoded.levels.every((entry) => entry.title === "Beta")).toBe(true);
    expect(decoded.levels.every((entry) => entry.map.top[0] === "WALL")).toBe(true);
  });

  it("compresses the repeated DAT payload into the shared level hash", () => {
    const level = makeLevel(9, "Gamma", "CHIP");
    const url = new URL(buildLexysLabyrinthSharedUrl(makeDoc([level]), level, 3));
    const encoded = url.hash.replace(/^#level=/u, "");
    const decoded = decodeDatBytes(unzlibSync(decodeUrlSafeBase64(encoded)));

    expect(decoded.levels).toHaveLength(3);
    expect(decoded.levels.map((entry) => entry.number)).toEqual([1, 2, 3]);
    expect(decoded.levels.every((entry) => entry.title === "Gamma")).toBe(true);
    expect(decoded.levels.every((entry) => entry.map.top[0] === "CHIP")).toBe(true);
  });
});
