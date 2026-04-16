import { describe, expect, it } from "vitest";

import { wallMaskKeyFromBytes } from "@/src/walls-core/mask32";
import {
  filterWallsBankRecords,
  findWallsBankRecord,
  loadWallsBank,
  pickRandomWallsBankRecords,
  type WallsBankRecord,
} from "@/web/src/wallsBank";

function makeRecord(
  wallKey: string,
  setName: string,
  levelNumber: number,
  levelTitle: string,
  author?: string,
): WallsBankRecord {
  const primaryEntry = {
    packId: levelNumber,
    setName,
    packType: "Regular set",
    fileName: `${setName}.dat`,
    levelNumber,
    levelTitle,
    ...(author ? { author } : {}),
  };
  return {
    wallKey,
    entries: [primaryEntry],
    occurrenceCount: 1,
    primaryEntry,
    searchText: `${setName} ${levelNumber} ${levelTitle} ${author ?? ""}`.toLowerCase(),
  };
}

function makeWallKey(firstByte: number): string {
  const bytes = new Uint8Array(128);
  bytes[0] = firstByte;
  return wallMaskKeyFromBytes(bytes);
}

describe("walls bank browser helpers", () => {
  it("filters by query, starred state, and hidden state", () => {
    const alpha = makeRecord("alpha", "Alpha Pack", 3, "Blue Maze", "Alice");
    const beta = makeRecord("beta", "Beta Pack", 7, "Red Maze", "Bob");

    expect(
      filterWallsBankRecords([alpha, beta], {
        query: "alpha alice",
        starredOnly: false,
        includeHidden: false,
        starredKeys: new Set(),
        hiddenKeys: new Set(),
      }),
    ).toEqual([alpha]);

    expect(
      filterWallsBankRecords([alpha, beta], {
        query: "",
        starredOnly: true,
        includeHidden: false,
        starredKeys: new Set(["beta"]),
        hiddenKeys: new Set(),
      }),
    ).toEqual([beta]);

    expect(
      filterWallsBankRecords([alpha, beta], {
        query: "",
        starredOnly: false,
        includeHidden: false,
        starredKeys: new Set(),
        hiddenKeys: new Set(["alpha"]),
      }),
    ).toEqual([beta]);
  });

  it("picks deterministic random subsets and can resolve by key", () => {
    const records = [
      makeRecord("a", "Set A", 1, "One"),
      makeRecord("b", "Set B", 2, "Two"),
      makeRecord("c", "Set C", 3, "Three"),
      makeRecord("d", "Set D", 4, "Four"),
    ];

    const first = pickRandomWallsBankRecords(records, 2, 12345);
    const second = pickRandomWallsBankRecords(records, 2, 12345);

    expect(first).toEqual(second);
    expect(first).toHaveLength(2);
    expect(new Set(first.map((record) => record.wallKey)).size).toBe(2);
    expect(findWallsBankRecord(records, first[0]!.wallKey)).toEqual(first[0]);
    expect(findWallsBankRecord(records, null)).toBeNull();
  });

  it("filters blocklisted set occurrences when loading the bank", async () => {
    const originalFetch = globalThis.fetch;
    const alphaKey = makeWallKey(0x80);
    const betaKey = makeWallKey(0x40);

    globalThis.fetch = async () =>
      ({
        ok: true,
        json: async () => ({
          schema: "datTools.walls.bank.v1",
          generatedAt: "2026-04-15T00:00:00.000Z",
          source: {
            apiBaseUrl: "https://api.bitbusters.club/custom-packs/cc1",
            downloadablePackCount: 2,
            skippedPackCount: 0,
            failedPackCount: 0,
            levelCount: 2,
            uniqueWallCount: 2,
            wallTileNames: ["WALL"],
          },
          masks: {
            [alphaKey]: [
              {
                packId: 1,
                setName: "Bad_Apple",
                packType: "Regular set",
                fileName: "bad_apple.dat",
                levelNumber: 1,
                levelTitle: "Blocked",
              },
            ],
            [betaKey]: [
              {
                packId: 2,
                setName: "Bad_Apple",
                packType: "Regular set",
                fileName: "bad_apple.dat",
                levelNumber: 2,
                levelTitle: "Shared blocked",
              },
              {
                packId: 3,
                setName: "Good_Set",
                packType: "Regular set",
                fileName: "good.dat",
                levelNumber: 7,
                levelTitle: "Shared visible",
              },
            ],
          },
        }),
      }) as Response;

    try {
      const loaded = await loadWallsBank();
      expect(loaded.records).toHaveLength(1);
      expect(loaded.records[0]?.wallKey).toBe(betaKey);
      expect(loaded.records[0]?.occurrenceCount).toBe(1);
      expect(loaded.records[0]?.primaryEntry.setName).toBe("Good_Set");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
