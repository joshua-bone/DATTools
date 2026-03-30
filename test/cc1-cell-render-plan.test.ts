import { describe, expect, it } from "vitest";

import {
  buildCc1CellRenderSteps,
  buildPalettePreviewRenderSteps,
  getPalettePreviewSpriteEffect,
} from "@/src/dat/render/cc1CellRenderPlan";

describe("CC1 cell render plan", () => {
  it("draws only the bottom terrain when the top tile is FLOOR", () => {
    expect(
      buildCc1CellRenderSteps("FLOOR", "WALL", {
        showSecrets: false,
      }),
    ).toEqual([{ kind: "sprite", spriteName: "WALL", effect: "none" }]);
  });

  it("overlays non-floor top tiles above the bottom terrain", () => {
    expect(
      buildCc1CellRenderSteps("CHIP", "WALL", {
        showSecrets: false,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "WALL", effect: "none" },
      { kind: "sprite", spriteName: "CHIP", effect: "none" },
    ]);
  });

  it("adds secret arrows for ambiguous directional tiles", () => {
    expect(
      buildCc1CellRenderSteps("BALL_N", "FLOOR", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "sprite", spriteName: "BALL_N", effect: "none" },
      { kind: "arrow", dir: "N" },
    ]);
  });

  it("lightens fake blue walls when secrets are visible", () => {
    expect(
      buildCc1CellRenderSteps("BLUE_WALL_FAKE", "FLOOR", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "sprite", spriteName: "BLUE_WALL_FAKE", effect: "lighten" },
    ]);
  });

  it("uses the same preview sprite effect for fake blue walls in the palette", () => {
    expect(
      getPalettePreviewSpriteEffect("BLUE_WALL_FAKE", {
        showSecrets: true,
      }),
    ).toBe("lighten");

    expect(
      getPalettePreviewSpriteEffect("BLUE_WALL_FAKE", {
        showSecrets: false,
      }),
    ).toBe("none");
  });

  it("reveals appearing invisible walls with the custom marker when secrets are visible", () => {
    expect(
      buildCc1CellRenderSteps("INV_WALL_APP", "FLOOR", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "secretWall", variant: "appearing" },
    ]);
  });

  it("reveals permanent invisible walls over floor when secrets are visible", () => {
    expect(
      buildCc1CellRenderSteps("INV_WALL_PERM", "WALL", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "secretWall", variant: "permanent" },
    ]);
  });

  it("always uses the custom invisible-wall graphics in palette previews", () => {
    expect(
      buildPalettePreviewRenderSteps("INV_WALL_APP", "INV_WALL_APP", {
        showSecrets: false,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "secretWall", variant: "appearing" },
    ]);

    expect(
      buildPalettePreviewRenderSteps("INV_WALL_PERM", "INV_WALL_PERM", {
        showSecrets: false,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "secretWall", variant: "permanent" },
    ]);
  });

  it("makes block overlays semi-transparent when secrets are visible", () => {
    expect(
      buildCc1CellRenderSteps("BLOCK", "FLOOR", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "sprite", spriteName: "BLOCK", effect: "semiTransparent" },
    ]);
  });

  it("makes custom ice-block overlays semi-transparent when secrets are visible", () => {
    expect(
      buildCc1CellRenderSteps("UNKNOWN_0x74", "FLOOR", {
        showSecrets: true,
      }),
    ).toEqual([
      { kind: "sprite", spriteName: "FLOOR", effect: "none" },
      { kind: "sprite", spriteName: "UNKNOWN_0x74", effect: "semiTransparent" },
    ]);
  });
});
