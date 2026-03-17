import { describe, expect, it } from "vitest";

import {
  dirFromTileName,
  renderTileWithArrow,
  shouldShowDirectionArrowInPalette,
  shouldShowDirectionArrowInSecrets,
} from "../src/dat/render/cc1Secrets.js";
import { createImage } from "../src/dat/render/rgbaImage.js";

describe("CC1 secret arrow helpers", () => {
  it("only marks ambiguous directional tiles for palette arrows", () => {
    expect(shouldShowDirectionArrowInPalette("CLONE_BLOCK_N")).toBe(true);
    expect(shouldShowDirectionArrowInPalette("BALL_W")).toBe(true);
    expect(shouldShowDirectionArrowInPalette("WALKER_S")).toBe(true);
    expect(shouldShowDirectionArrowInPalette("FIREBALL_E")).toBe(true);
    expect(shouldShowDirectionArrowInPalette("BLOB_N")).toBe(true);
    expect(shouldShowDirectionArrowInPalette("PARAMECIUM_W")).toBe(true);

    expect(shouldShowDirectionArrowInPalette("ANT_W")).toBe(false);
    expect(shouldShowDirectionArrowInPalette("PLAYER_N")).toBe(false);
    expect(shouldShowDirectionArrowInPalette("WALL")).toBe(false);
  });

  it("does not mark thin-wall panels for board secret arrows", () => {
    expect(shouldShowDirectionArrowInSecrets("ANT_W")).toBe(true);
    expect(shouldShowDirectionArrowInSecrets("FORCE_S")).toBe(true);
    expect(shouldShowDirectionArrowInSecrets("PANEL_N")).toBe(false);
    expect(shouldShowDirectionArrowInSecrets("PANEL_W")).toBe(false);
  });

  it("extracts tile direction suffixes", () => {
    expect(dirFromTileName("BALL_N")).toBe("N");
    expect(dirFromTileName("BALL_E")).toBe("E");
    expect(dirFromTileName("BALL_S")).toBe("S");
    expect(dirFromTileName("BALL_W")).toBe("W");
    expect(dirFromTileName("BLOCK")).toBeNull();
  });

  it("renders arrows without mutating the source tile image", () => {
    const base = createImage(16, 16, [10, 20, 30, 255]);
    const rendered = renderTileWithArrow(base, "N");

    expect(rendered).not.toBe(base);
    expect(Array.from(base.data.slice(0, 4))).toEqual([10, 20, 30, 255]);

    let hasOpaqueRedPixel = false;
    for (let index = 0; index < rendered.data.length; index += 4) {
      if (
        rendered.data[index + 0] === 255 &&
        rendered.data[index + 1] === 0 &&
        rendered.data[index + 2] === 0 &&
        rendered.data[index + 3] === 255
      ) {
        hasOpaqueRedPixel = true;
        break;
      }
    }

    expect(hasOpaqueRedPixel).toBe(true);
  });
});
