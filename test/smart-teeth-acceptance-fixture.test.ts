import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { createSmartTeethAcceptanceFixture } from "../scripts/smartTeethAcceptanceFixture";
import { decodeDatBytes, encodeDatBytes } from "@/src/dat/datCodec";

describe("shared Smart Teeth acceptance DAT fixture", () => {
  it("reproduces the committed binary through real editor placement and DAT export", async () => {
    const bytes = new Uint8Array(
      await readFile(new URL("../fixtures/dat/SMART_TEETH_ACCEPTANCE.dat", import.meta.url)),
    );
    expect(encodeDatBytes(createSmartTeethAcceptanceFixture())).toEqual(bytes);
    expect(decodeDatBytes(bytes).levels[0]).toMatchObject({
      title: "Smart Teeth acceptance",
      author: "DATTools",
      password: "BRAI",
    });
  });
  it("exports an isolated helper button corridor that opens the buddy's only path to Chip", () => {
    const levels = decodeDatBytes(encodeDatBytes(createSmartTeethAcceptanceFixture())).levels;
    expect(levels).toHaveLength(2);
    const level = levels[1]!;
    expect(level).toMatchObject({
      number: 2,
      title: "Smart Teeth teamwork",
      author: "DATTools",
      password: "HELP",
      chips: 0,
    });
    expect(level.movement).toEqual([99, 194]);
    expect(level.map.top.slice(98, 107)).toEqual([
      "FLOOR",
      "SMART_TEETH_E",
      "FLOOR",
      "FLOOR",
      "TOGGLE_WALL",
      "FLOOR",
      "FLOOR",
      "PLAYER_W",
      "EXIT",
    ]);
    expect(level.map.top.slice(194, 197)).toEqual(["SMART_TEETH_E", "FLOOR", "GREEN_BUTTON"]);
    expect([99, 194].map((index) => level.map.bottom[index])).toEqual(["FLOOR", "FLOOR"]);
    const corridor = new Set([98, 99, 100, 101, 102, 103, 104, 105, 106, 194, 195, 196]);
    expect(
      level.map.top.filter((_tile, index) => !corridor.has(index)).every((tile) => tile === "WALL"),
    ).toBe(true);
    expect(levels.every((candidate) => candidate.password?.length === 4)).toBe(true);
  });

  it("places three ordered actors, a key-crossing wall detour and a shorter direct pursuer", () => {
    const level = decodeDatBytes(encodeDatBytes(createSmartTeethAcceptanceFixture())).levels[0]!;
    expect(level.map.top[104]).toBe("PLAYER_W");
    expect(level.map.top[105]).toBe("EXIT");
    expect(level.movement).toEqual([100, 227, 232]);
    expect([100, 227, 232].map((index) => level.map.top[index])).toEqual([
      "SMART_TEETH_E",
      "SMART_TEETH_E",
      "SMART_TEETH_N",
    ]);
    expect([100, 227, 232].map((index) => level.map.bottom[index])).toEqual([
      "FLOOR",
      "FLOOR",
      "FLOOR",
    ]);
    expect([70, 102, 134, 166].map((index) => level.map.top[index])).toEqual([
      "WALL",
      "WALL",
      "WALL",
      "WALL",
    ]);
    expect(level.map.top[38]).toBe("BLUE_KEY");
    expect(level.map.top[101]).toBe("RED_KEY");
    expect(level.map.top[198]).toBe("GREEN_KEY");
    expect([136, 168, 200].map((index) => level.map.top[index])).toEqual([
      "FLOOR",
      "FLOOR",
      "FLOOR",
    ]);
    for (let y = 0; y <= 9; y++) {
      expect(level.map.top[y * 32]).toBe("WALL");
      expect(level.map.top[y * 32 + 11]).toBe("WALL");
    }
    for (let x = 0; x <= 11; x++) {
      expect(level.map.top[x]).toBe("WALL");
      expect(level.map.top[9 * 32 + x]).toBe("WALL");
    }
  });
});
