import { describe, expect, it } from "vitest";

import { generateLayoutRecords, recordsFromStarredKeys } from "@/web/src/generatedLayouts";

describe("generated layouts", () => {
  it("produces deterministic random-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "any",
      count: 6,
      seed: 12345,
    });
    const second = generateLayoutRecords({
      algorithm: "any",
      count: 6,
      seed: 12345,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(new Set(first.map((record) => record.wallKey)).size).toBe(6);
    expect(first.every((record) => record.algorithm === "random-noise")).toBe(true);
    expect(first.every((record) => record.params !== null)).toBe(true);
  });

  it("builds stable starred records from saved wall keys", () => {
    const records = recordsFromStarredKeys(new Set(["beta", "alpha"]), "any");

    expect(records.map((record) => record.wallKey)).toEqual(["alpha", "beta"]);
    expect(records[0]?.title).toBe("Starred Layout");
    expect(records[0]?.seedLabel).toBe("Saved locally");
  });
});
