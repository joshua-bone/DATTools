import { describe, expect, it, vi } from "vitest";

import { DAT_3D_AIR_TILE } from "@/src/dat/dat3dLevels";
import { createEmptyLevel } from "@/web/src/levelEditing";
import {
  buildHoverCellSummary,
  createBoardEditorStatusStore,
  resolveBrushPreviewDirtyCells,
  resolveBrushPreviewRenderCells,
} from "@/web/src/boardEditorStatus";

describe("board editor status store", () => {
  it("notifies subscribers only when the snapshot meaningfully changes", () => {
    const store = createBoardEditorStatusStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.update({ boardZoom: 1 });
    store.update({ hoverPoint: { x: 1, y: 2 } });
    store.update({ hoverPoint: { x: 1, y: 2 } });
    store.update({ hasPendingConnection: true });
    store.update({ hoverCellSummary: { index: 65, top: "WALL", bottom: "FLOOR" } });
    store.update({ hoverCellSummary: { index: 65, top: "WALL", bottom: "FLOOR" } });

    expect(listener).toHaveBeenCalledTimes(3);
    expect(store.getSnapshot()).toEqual({
      boardZoom: 1,
      hoverPoint: { x: 1, y: 2 },
      hoverCellSummary: { index: 65, top: "WALL", bottom: "FLOOR" },
      hasPendingConnection: true,
      isBrushDragging: false,
    });

    unsubscribe();
    store.reset();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("resets back to the default idle snapshot", () => {
    const store = createBoardEditorStatusStore();
    store.update({
      boardZoom: 2,
      hoverPoint: { x: 5, y: 6 },
      hoverCellSummary: { index: 197, top: "WALL", bottom: "FLOOR" },
      hasPendingConnection: true,
      isBrushDragging: true,
    });

    store.reset();

    expect(store.getSnapshot()).toEqual({
      boardZoom: 1,
      hoverPoint: null,
      hoverCellSummary: null,
      hasPendingConnection: false,
      isBrushDragging: false,
    });
  });
});

describe("resolveBrushPreviewDirtyCells", () => {
  it("keeps the full stroke dirty until the first preview frame has painted", () => {
    expect(resolveBrushPreviewDirtyCells([0, 1], [1], false)).toEqual([0, 1]);
    expect(resolveBrushPreviewDirtyCells([0, 1], [1], true)).toEqual([1]);
  });

  it("replays the full stroke after the overlay canvas was rebuilt", () => {
    expect(resolveBrushPreviewRenderCells([0, 1], [1], true, true)).toEqual([0, 1]);
    expect(resolveBrushPreviewRenderCells([0, 1], [1], true, false)).toEqual([1]);
  });
});

describe("buildHoverCellSummary", () => {
  it("reports the hovered 2D cell stack using display names", () => {
    const level = createEmptyLevel(1);
    const withTiles = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 33 ? "WALL" : tile)),
        bottom: level.map.bottom.map((tile, index) => (index === 33 ? "WATER" : tile)),
      },
    };

    expect(
      buildHoverCellSummary(
        withTiles,
        { x: 1, y: 1 },
        { threeDEnabled: false, layerZ: 1, layerCount: 1 },
      ),
    ).toEqual({
      index: 33,
      top: "WALL",
      bottom: "WATER",
    });
  });

  it("shows AIR as the bottom label for transparent upper 3D cells", () => {
    const level = createEmptyLevel(1);
    const withAir = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 0 ? DAT_3D_AIR_TILE : tile)),
        bottom: level.map.bottom.map((tile, index) => (index === 0 ? "WALL" : tile)),
      },
    };

    expect(
      buildHoverCellSummary(
        withAir,
        { x: 0, y: 0 },
        { threeDEnabled: true, layerZ: 2, layerCount: 2 },
      ),
    ).toEqual({
      index: 0,
      top: "AIR",
      bottom: "AIR",
    });
  });
});
