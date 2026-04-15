import { describe, expect, it } from "vitest";

import {
  createDefaultBacktrackingControlState,
  createDefaultBinaryTreeControlState,
  createDefaultGrowingTreeControlState,
  createDefaultKruskalsControlState,
  createDefaultPrimsControlState,
  createDefaultRandomNoiseControlState,
  createDefaultRecursiveDivisionControlState,
  createDefaultSidewinderControlState,
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
          record.algorithm === "random-noise" ||
          record.algorithm === "backtracking-generator" ||
          record.algorithm === "growing-tree" ||
          record.algorithm === "prims" ||
          record.algorithm === "recursive-division" ||
          record.algorithm === "kruskals" ||
          record.algorithm === "sidewinder" ||
          record.algorithm === "binary-tree",
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
        blockSize: { randomize: false, value: "2x1" },
        startColumn: { randomize: false, value: 3 },
        startRow: { randomize: false, value: 11 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "backtracking-generator" &&
          record.params.blockSize === "2x1" &&
          record.params.startColumn === 3 &&
          record.params.startRow === 11,
      ),
    ).toBe(true);
  });

  it("produces deterministic growing-tree layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 98765,
    });
    const second = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 98765,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "growing-tree")).toBe(true);
  });

  it("keeps locked growing-tree parameters fixed across generated cards", () => {
    const controls = createDefaultGrowingTreeControlState();
    const records = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 24601,
      growingTreeControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        startColumn: { randomize: false, value: 4 },
        startRow: { randomize: false, value: 7 },
        backtrackChance: { randomize: false, value: 0.65 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "growing-tree" &&
          record.params.blockSize === "1x2" &&
          record.params.startColumn === 4 &&
          record.params.startRow === 7 &&
          record.params.backtrackChance === 0.65,
      ),
    ).toBe(true);
  });

  it("produces deterministic prim's layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 11223,
    });
    const second = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 11223,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "prims")).toBe(true);
  });

  it("keeps locked prim's parameters fixed across generated cards", () => {
    const controls = createDefaultPrimsControlState();
    const records = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 99887,
      primsControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
        startColumn: { randomize: false, value: 5 },
        startRow: { randomize: false, value: 6 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "prims" &&
          record.params.blockSize === "2x2" &&
          record.params.startColumn === 5 &&
          record.params.startRow === 6,
      ),
    ).toBe(true);
  });

  it("produces deterministic kruskal's layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 73124,
    });
    const second = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 73124,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "kruskals")).toBe(true);
  });

  it("keeps locked kruskal's parameters fixed across generated cards", () => {
    const controls = createDefaultKruskalsControlState();
    const records = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 24816,
      kruskalsControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) => record.algorithm === "kruskals" && record.params.blockSize === "2x2",
      ),
    ).toBe(true);
  });

  it("produces deterministic sidewinder layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 86420,
    });
    const second = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 86420,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "sidewinder")).toBe(true);
  });

  it("keeps locked sidewinder parameters fixed across generated cards", () => {
    const controls = createDefaultSidewinderControlState();
    const records = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 97231,
      sidewinderControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        skew: { randomize: false, value: 0.7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "sidewinder" &&
          record.params.blockSize === "1x2" &&
          record.params.skew === 0.7,
      ),
    ).toBe(true);
  });

  it("produces deterministic binary-tree layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 32145,
    });
    const second = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 32145,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "binary-tree")).toBe(true);
  });

  it("keeps locked binary-tree parameters fixed across generated cards", () => {
    const controls = createDefaultBinaryTreeControlState();
    const records = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 67890,
      binaryTreeControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x1" },
        skew: { randomize: false, value: "SE" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "binary-tree" &&
          record.params.blockSize === "2x1" &&
          record.params.skew === "SE",
      ),
    ).toBe(true);
  });

  it("produces deterministic recursive-division layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 44556,
    });
    const second = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 44556,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "recursive-division")).toBe(true);
  });

  it("keeps locked recursive-division parameters fixed across generated cards", () => {
    const controls = createDefaultRecursiveDivisionControlState();
    const records = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 55443,
      recursiveDivisionControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) => record.algorithm === "recursive-division" && record.params.blockSize === "1x2",
      ),
    ).toBe(true);
  });

  it("weights random maze block sizes toward 1x1 and 2x2", () => {
    const records = Array.from(
      { length: 240 },
      (_, index) =>
        generateLayoutRecords({
          algorithm: "recursive-division",
          count: 1,
          seed: index + 1,
        })[0]!,
    );
    const counts = records.reduce<Record<string, number>>((acc, record) => {
      const blockSize =
        record.algorithm === "recursive-division" ? record.params.blockSize : "nope";
      acc[blockSize] = (acc[blockSize] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts["1x1"]).toBeGreaterThan(60);
    expect(counts["2x2"]).toBeGreaterThan(60);
    expect(counts["1x2"]).toBeGreaterThan(20);
    expect(counts["1x2"]).toBeLessThan(60);
    expect(counts["2x1"]).toBeGreaterThan(20);
    expect(counts["2x1"]).toBeLessThan(60);
  });
});
