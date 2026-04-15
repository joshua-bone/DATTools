import { describe, expect, it } from "vitest";

import {
  createDefaultBacktrackingControlState,
  createDefaultRandomNoiseControlState,
  generateLayoutRecords,
  recordsFromStarredKeys,
} from "@/web/src/generatedLayouts";

describe("generated layouts", () => {
  it("produces deterministic layout sets for Any selection", () => {
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
    expect(
      first.every(
        (record) =>
          record.algorithm === "random-noise" || record.algorithm === "backtracking-generator",
      ),
    ).toBe(true);
  });

  it("builds stable starred records from saved wall keys", () => {
    const records = recordsFromStarredKeys(new Set(["beta", "alpha"]));

    expect(records.map((record) => record.wallKey)).toEqual(["alpha", "beta"]);
    expect(records[0]?.title).toBe("Starred Layout");
    expect(records[0]?.seedLabel).toBe("Saved locally");
    expect(records[0]?.algorithm).toBe("starred");
  });

  it("keeps locked random-noise parameters fixed across generated cards", () => {
    const controls = createDefaultRandomNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "random-noise",
      count: 6,
      seed: 12345,
      randomNoiseControls: {
        ...controls,
        density: { randomize: false, value: 0.24 },
        blockSize: { randomize: false, value: 4 },
        mirror: { randomize: false, value: "vertical" },
        invert: { randomize: false, value: true },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "random-noise" &&
          record.params.density === 0.24 &&
          record.params.blockSize === 4 &&
          record.params.mirror === "vertical" &&
          record.params.invert === true,
      ),
    ).toBe(true);
  });

  it("produces deterministic backtracking layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 24680,
    });
    const second = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 24680,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "backtracking-generator")).toBe(true);
  });

  it("keeps locked backtracking parameters fixed across generated cards", () => {
    const controls = createDefaultBacktrackingControlState();
    const records = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 13579,
      backtrackingControls: {
        ...controls,
        startColumn: { randomize: false, value: 3 },
        startRow: { randomize: false, value: 11 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "backtracking-generator" &&
          record.params.startColumn === 3 &&
          record.params.startRow === 11,
      ),
    ).toBe(true);
  });
});
