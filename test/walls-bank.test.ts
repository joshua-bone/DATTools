import { describe, expect, it } from "vitest";

import {
  WALL_BANK_SCHEMA,
  applyWallMaskToLevel,
  buildWallMaskBytes,
  createWallsPreviewLevel,
  parseWallsBank,
  wallMaskBytesFromKey,
  wallMaskKeyFromBytes,
} from "@/src/dat/wallsBank";
import { createEmptyLevel } from "@/web/src/levelEditing";

describe("walls bank helpers", () => {
  it("encodes full-wall terrain into a stable 128-byte mask", () => {
    const level = createEmptyLevel(1, { title: "Mask Test" });
    const top = [...level.map.top];
    const bottom = [...level.map.bottom];
    top[0] = "WALL";
    top[1] = "ANT_N";
    bottom[1] = "POP_UP_WALL";
    top[2] = "PANEL_N";
    top[3] = "FLOOR";
    bottom[3] = "BLUE_WALL_REAL";

    const candidate = {
      ...level,
      map: {
        ...level.map,
        top,
        bottom,
      },
    };

    const bytes = buildWallMaskBytes(candidate);

    expect(bytes).toHaveLength(128);
    expect(Array.from(bytes.slice(0, 1))).toEqual([0b11010000]);

    const key = wallMaskKeyFromBytes(bytes);
    expect(wallMaskBytesFromKey(key)).toEqual(bytes);
  });

  it("rebuilds a wall-only level while preserving surrounding metadata", () => {
    const original = {
      ...createEmptyLevel(7, {
        title: "Imported",
        author: "Author",
        password: "ABCD",
        hint: "Hint",
        time: 120,
        chips: 9,
        mapDetail: 2,
      }),
      trapControls: [{ button: 1, trap: 2, openOrShut: 0 }],
      cloneControls: [{ button: 3, cloner: 4 }],
      movement: [5],
    };
    const originalWithWall = {
      ...original,
      map: {
        ...original.map,
        top: ["WALL", ...original.map.top.slice(1)],
        bottom: [...original.map.bottom],
      },
    };
    const next = applyWallMaskToLevel(
      originalWithWall,
      wallMaskKeyFromBytes(buildWallMaskBytes(originalWithWall)),
    );

    expect(next.number).toBe(7);
    expect(next.title).toBe("Imported");
    expect(next.author).toBe("Author");
    expect(next.password).toBe("ABCD");
    expect(next.hint).toBe("Hint");
    expect(next.time).toBe(120);
    expect(next.mapDetail).toBe(2);
    expect(next.chips).toBe(0);
    expect(next.map.top[0]).toBe("WALL");
    expect(next.map.top[1]).toBe("FLOOR");
    expect(new Set(next.map.bottom)).toEqual(new Set(["FLOOR"]));
    expect(next.trapControls).toEqual([]);
    expect(next.cloneControls).toEqual([]);
    expect(next.movement).toEqual([]);
  });

  it("parses persisted wall-bank JSON and can create previews from it", () => {
    const maskBytes = new Uint8Array(128);
    maskBytes[0] = 0x80;
    const wallKey = wallMaskKeyFromBytes(maskBytes);

    const bank = parseWallsBank({
      schema: WALL_BANK_SCHEMA,
      generatedAt: "2026-04-15T00:00:00.000Z",
      source: {
        apiBaseUrl: "https://api.bitbusters.club/custom-packs/cc1",
        downloadablePackCount: 1,
        skippedPackCount: 0,
        failedPackCount: 0,
        levelCount: 1,
        uniqueWallCount: 1,
        wallTileNames: ["WALL"],
      },
      masks: {
        [wallKey]: [
          {
            packId: 1,
            setName: "Test Set",
            packType: "Regular set",
            fileName: "test.dat",
            levelNumber: 3,
            levelTitle: "Maze",
            author: "Test Author",
          },
        ],
      },
    });

    const record = bank.masks[wallKey];
    expect(record).toHaveLength(1);

    const preview = createWallsPreviewLevel(wallKey, { title: "Preview" });
    expect(preview.title).toBe("Preview");
    expect(preview.map.top[0]).toBe("WALL");
    expect(preview.map.top[1]).toBe("FLOOR");
  });
});
