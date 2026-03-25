import { describe, expect, it } from "vitest";

import {
  buildCc1CellRenderSteps,
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
});
