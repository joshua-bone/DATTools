import { describe, expect, it } from "vitest";

import { applyGeneratedWallGridToDatLevel, datWallsHostAdapter } from "@/src/walls-dat/adapter";
import { createWallGrid } from "@/src/walls-core/grid";
import { wallMaskKeyFromBytes } from "@/src/walls-core/mask32";
import { createEmptyLevel } from "@/web/src/levelEditing";

function topTileAt(level: ReturnType<typeof createEmptyLevel>, x: number, y: number): string {
  return level.map.top[y * 32 + x] ?? "FLOOR";
}

describe("DAT walls host adapter", () => {
  it("applies generated wall grids using centered DAT framing", () => {
    const grid = createWallGrid(3, 2);
    grid.cells[0] = 1;
    grid.cells[5] = 1;

    const next = applyGeneratedWallGridToDatLevel(createEmptyLevel(1), grid, {
      layoutWidth: 7,
      layoutHeight: 6,
    });

    expect(topTileAt(next, 12, 13)).toBe("WALL");
    expect(topTileAt(next, 18, 18)).toBe("WALL");
    expect(topTileAt(next, 13, 14)).toBe("WALL");
    expect(topTileAt(next, 15, 15)).toBe("WALL");
    expect(topTileAt(next, 14, 14)).toBe("FLOOR");
    expect(topTileAt(next, 0, 0)).toBe("FLOOR");
    expect(new Set(next.map.bottom)).toEqual(new Set(["FLOOR"]));
    expect(next.chips).toBe(0);
    expect(next.trapControls).toEqual([]);
    expect(next.cloneControls).toEqual([]);
    expect(next.movement).toEqual([]);
  });

  it("exposes the bank-mask path through the DAT host adapter", () => {
    const bytes = new Uint8Array(128);
    bytes[0] = 0x80;
    const next = datWallsHostAdapter.applyBankMask32(
      createEmptyLevel(2),
      wallMaskKeyFromBytes(bytes),
    );

    expect(topTileAt(next, 0, 0)).toBe("WALL");
    expect(topTileAt(next, 1, 0)).toBe("FLOOR");
  });
});
