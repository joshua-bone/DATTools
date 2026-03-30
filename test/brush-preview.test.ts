import { describe, expect, it } from "vitest";

import { DAT_3D_AIR_TILE } from "@/src/dat/dat3dLevels";
import { brushPreviewNeedsTransientBoard } from "@/web/src/brushPreview";

describe("brush preview", () => {
  it("uses the transient board render path for upper-layer 3D air strokes", () => {
    expect(
      brushPreviewNeedsTransientBoard(DAT_3D_AIR_TILE, {
        threeDEnabled: true,
        layerZ: 2,
        layerCount: 2,
      }),
    ).toBe(true);
  });

  it("keeps opaque brushes on the overlay path", () => {
    expect(
      brushPreviewNeedsTransientBoard("WALL", {
        threeDEnabled: true,
        layerZ: 2,
        layerCount: 2,
      }),
    ).toBe(false);
    expect(
      brushPreviewNeedsTransientBoard(DAT_3D_AIR_TILE, {
        threeDEnabled: true,
        layerZ: 1,
        layerCount: 2,
      }),
    ).toBe(false);
    expect(
      brushPreviewNeedsTransientBoard(DAT_3D_AIR_TILE, {
        threeDEnabled: false,
        layerZ: 1,
        layerCount: 1,
      }),
    ).toBe(false);
  });
});
