import { describe, expect, it } from "vitest";

import {
  filterWallsBankRecords,
  findWallsBankRecord,
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
});
