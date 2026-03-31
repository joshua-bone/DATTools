import { describe, expect, it, vi } from "vitest";

import {
  boardPointToCell,
  drawPresentedBoardLayers,
  drawViewportPresentedBoardLayers,
  enumerateVisibleBoardCellWindow,
  ensureCanvasSize,
  isIndexVisibleInBoardCellWindow,
  resolveBoardScreenRect,
  resolveThreeDLayerDrawMetrics,
  resolveVisibleBoardCellWindow,
  viewportClientPointToBoardPoint,
} from "@/web/src/boardCanvasPresentation";

describe("board canvas presentation", () => {
  it("resizes canvases only when the dimensions changed", () => {
    const canvas = { width: 32, height: 32 };

    expect(ensureCanvasSize(canvas, 32, 32)).toBe(false);
    expect(canvas).toEqual({ width: 32, height: 32 });

    expect(ensureCanvasSize(canvas, 64, 48)).toBe(true);
    expect(canvas).toEqual({ width: 64, height: 48 });
  });

  it("clears once and draws non-null layers in order", () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const baseLayer = { id: "base" };
    const staticLayer = { id: "static" };
    const interactionLayer = { id: "interaction" };

    drawPresentedBoardLayers({ clearRect, drawImage }, 128, 128, [
      baseLayer,
      null,
      staticLayer,
      interactionLayer,
    ]);

    expect(clearRect).toHaveBeenCalledWith(0, 0, 128, 128);
    expect(drawImage.mock.calls).toEqual([
      [baseLayer, 0, 0],
      [staticLayer, 0, 0],
      [interactionLayer, 0, 0],
    ]);
  });

  it("projects board layers into a viewport-sized canvas", () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const baseLayer = { id: "base" };

    drawViewportPresentedBoardLayers(
      { clearRect, drawImage },
      640,
      480,
      [baseLayer],
      { x: 12, y: 24, width: 320, height: 320 },
      256,
    );

    expect(clearRect).toHaveBeenCalledWith(0, 0, 640, 480);
    expect(drawImage).toHaveBeenCalledWith(baseLayer, 0, 0, 256, 256, 12, 24, 320, 320);
  });

  it("resolves the onscreen board rect from pan and zoom", () => {
    expect(
      resolveBoardScreenRect({
        boardSize: 256,
        boardPan: { x: -32, y: 48 },
        boardZoom: 1.5,
      }),
    ).toEqual({
      x: -32,
      y: 48,
      width: 384,
      height: 384,
    });
  });

  it("applies depth scaling and pan lag in the default 3D stack projection", () => {
    const metrics = resolveThreeDLayerDrawMetrics(
      2,
      256,
      { x: 24, y: -12 },
      2,
      { width: 640, height: 480 },
      false,
    );

    expect(metrics.offsetX).toBeCloseTo(30.72);
    expect(metrics.offsetY).toBeCloseTo(23.68);
    expect(metrics.width).toBeCloseTo(207.36);
    expect(metrics.height).toBeCloseTo(207.36);
    expect(metrics.scaleX).toBeCloseTo(0.81);
    expect(metrics.scaleY).toBeCloseTo(0.81);
  });

  it("keeps lower 3D layers aligned to the active grid in orthographic mode", () => {
    expect(
      resolveThreeDLayerDrawMetrics(
        2,
        256,
        { x: 24, y: -12 },
        2,
        { width: 640, height: 480 },
        true,
      ),
    ).toEqual({
      offsetX: 0,
      offsetY: 0,
      width: 256,
      height: 256,
      scaleX: 1,
      scaleY: 1,
    });
  });

  it("maps viewport client points back into board pixels and cells", () => {
    const boardPoint = viewportClientPointToBoardPoint(
      { left: 100, top: 50, width: 800, height: 600 },
      { clientX: 180, clientY: 130 },
      { x: 40, y: 20, width: 320, height: 320 },
      256,
    );

    expect(boardPoint).toEqual({ x: 32, y: 48 });
    expect(boardPointToCell(boardPoint, 256)).toEqual({ x: 4, y: 6 });
    expect(
      viewportClientPointToBoardPoint(
        { left: 100, top: 50, width: 800, height: 600 },
        { clientX: 110, clientY: 70 },
        { x: 40, y: 20, width: 320, height: 320 },
        256,
      ),
    ).toBeNull();
  });

  it("resolves only the visible board cells for viewport rendering", () => {
    const window = resolveVisibleBoardCellWindow(
      { x: -10, y: -10, width: 80, height: 80 },
      320,
      40,
      40,
    );

    expect(window).toEqual({
      startColumn: 4,
      endColumn: 19,
      startRow: 4,
      endRow: 19,
    });
    expect(enumerateVisibleBoardCellWindow(window!)).toHaveLength(16 * 16);
    expect(isIndexVisibleInBoardCellWindow(4 * 32 + 4, window!)).toBe(true);
    expect(isIndexVisibleInBoardCellWindow(3 * 32 + 4, window!)).toBe(false);
  });
});
