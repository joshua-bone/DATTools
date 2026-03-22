import { describe, expect, it } from "vitest";

import { createEmptyLevel } from "@/web/src/levelEditing";
import {
  diffLevelTileIndices,
  resolveBoardTileRedrawPlan,
} from "@/web/src/boardRenderInvalidation";

describe("board render invalidation", () => {
  it("diffs changed top and bottom cells", () => {
    const level = createEmptyLevel(1);
    const nextLevel = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 1 ? "WALL" : tile)),
        bottom: level.map.bottom.map((tile, index) => (index === 33 ? "WATER" : tile)),
      },
    };

    expect(diffLevelTileIndices(level, nextLevel)).toEqual([1, 33]);
  });

  it("uses partial redraw when the existing 2D board canvas can be reused", () => {
    const level = createEmptyLevel(1);
    const nextLevel = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 0 ? "WALL" : tile)),
        bottom: level.map.bottom,
      },
    };

    expect(
      resolveBoardTileRedrawPlan(level, nextLevel, {
        canReuseCanvas: true,
        partialThreshold: 8,
      }),
    ).toEqual({
      kind: "partial",
      indices: [0],
    });
  });

  it("falls back to a full redraw when the canvas cannot be reused", () => {
    const level = createEmptyLevel(1);

    expect(
      resolveBoardTileRedrawPlan(level, level, {
        canReuseCanvas: false,
        partialThreshold: 8,
      }),
    ).toEqual({
      kind: "full",
    });
  });

  it("falls back to a full redraw when too many cells changed", () => {
    const level = createEmptyLevel(1);
    const nextLevel = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index < 4 ? "WALL" : tile)),
        bottom: level.map.bottom,
      },
    };

    expect(
      resolveBoardTileRedrawPlan(level, nextLevel, {
        canReuseCanvas: true,
        partialThreshold: 2,
      }),
    ).toEqual({
      kind: "full",
    });
  });
});
