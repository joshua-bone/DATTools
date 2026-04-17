import { describe, expect, it } from "vitest";

import { createWallGrid, wallGridKeyFromGrid } from "@/src/walls-core";
import { wallMaskKeyFromBytes } from "@/src/walls-core/mask32";
import type { GeneratedLayoutRecord } from "@/web/src/generatedLayouts";
import {
  parsePersistedGeneratedLayoutRecordList,
  serializePersistedGeneratedLayoutRecordList,
} from "@/web/src/generatedLayoutStorage";

describe("generated layout local storage helpers", () => {
  it("round-trips generated layout records including exact-size grids", () => {
    const grid = createWallGrid(40, 24);
    grid.cells[0] = 1;
    grid.cells[17] = 1;
    grid.cells[grid.cells.length - 1] = 1;

    const record: GeneratedLayoutRecord = {
      recordKey: wallGridKeyFromGrid(grid),
      grid,
      layout: { width: 42, height: 26 },
      algorithm: "random-noise",
      title: "Random Noise",
      summary: "42% density",
      seedLabel: "Seed 123",
      inverted: true,
      params: {
        seed: 123,
        density: 0.42,
        blockSize: 1,
        mirror: "horizontal",
      },
    } as GeneratedLayoutRecord;

    const parsed = parsePersistedGeneratedLayoutRecordList(
      serializePersistedGeneratedLayoutRecordList([record]),
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.recordKey).toBe(record.recordKey);
    expect(parsed[0]?.algorithm).toBe("random-noise");
    expect(parsed[0]?.layout).toEqual({ width: 42, height: 26 });
    expect(parsed[0]?.grid?.width).toBe(40);
    expect(parsed[0]?.grid?.height).toBe(24);
    expect(parsed[0]?.wallKey).toBeUndefined();
    expect(parsed[0]?.params).toEqual(record.params);
  });

  it("migrates legacy key-set blobs into legacy starred records", () => {
    const wallKey = wallMaskKeyFromBytes(new Uint8Array(128));
    const parsed = parsePersistedGeneratedLayoutRecordList(
      JSON.stringify({
        schema: "datTools.web.generate.keySet.v1",
        keys: [wallKey],
      }),
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.recordKey).toBe(wallKey);
    expect(parsed[0]?.wallKey).toBe(wallKey);
    expect(parsed[0]?.algorithm).toBe("starred");
  });

  it("ignores invalid blobs", () => {
    expect(parsePersistedGeneratedLayoutRecordList(null)).toEqual([]);
    expect(parsePersistedGeneratedLayoutRecordList("nope")).toEqual([]);
    expect(parsePersistedGeneratedLayoutRecordList('{"schema":"wrong","records":["x"]}')).toEqual(
      [],
    );
  });
});
