import { describe, expect, it, vi } from "vitest";

import { drawPresentedBoardLayers, ensureCanvasSize } from "@/web/src/boardCanvasPresentation";

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
});
