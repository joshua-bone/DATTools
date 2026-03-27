import { describe, expect, it } from "vitest";

import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { renderCc1CellToRgba, renderCc1LevelToRgba } from "@/src/dat/render/cc1LevelRenderer";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { createImage } from "@/src/dat/render/rgbaImage";

function makeLevel(topTile: string, bottomTile: string): DatLevelJson {
  const top = Array<string>(1024).fill("FLOOR");
  const bottom = Array<string>(1024).fill("FLOOR");
  top[0] = topTile;
  bottom[0] = bottomTile;

  return {
    number: 1,
    time: 0,
    chips: 0,
    mapDetail: 1,
    map: {
      width: 32,
      height: 32,
      top,
      bottom,
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [],
    extraFields: [],
  };
}

function makeSpriteSet(): CC1SpriteSet {
  const colors = new Map<string, readonly [number, number, number, number]>([
    ["FLOOR", [10, 20, 30, 255]],
    ["WALL", [200, 40, 30, 255]],
    ["CHIP", [30, 200, 80, 255]],
    ["BALL_N", [20, 40, 220, 255]],
    ["ANT_N", [30, 180, 60, 255]],
    ["BLUE_WALL_FAKE", [100, 100, 100, 255]],
    ["INV_WALL_APP", [210, 210, 210, 255]],
    ["INV_WALL_PERM", [220, 220, 220, 255]],
  ]);

  return {
    tileSize: 8,
    get(name: string) {
      return createImage(8, 8, colors.get(name) ?? [0, 0, 0, 0]);
    },
  };
}

function pixelAt0(img: ReturnType<typeof renderCc1LevelToRgba>): number[] {
  return Array.from(img.data.slice(0, 4));
}

function imageHasPixel(
  img: ReturnType<typeof renderCc1LevelToRgba>,
  color: readonly [number, number, number, number],
): boolean {
  for (let index = 0; index < img.data.length; index += 4) {
    if (
      img.data[index + 0] === color[0] &&
      img.data[index + 1] === color[1] &&
      img.data[index + 2] === color[2] &&
      img.data[index + 3] === color[3]
    ) {
      return true;
    }
  }

  return false;
}

describe("CC1 level renderer", () => {
  it("shows bottom terrain when top layer is FLOOR", () => {
    const img = renderCc1LevelToRgba(makeLevel("FLOOR", "WALL"), makeSpriteSet(), {
      showSecrets: false,
    });

    expect(pixelAt0(img)).toEqual([200, 40, 30, 255]);
  });

  it("still overlays non-floor top tiles", () => {
    const img = renderCc1LevelToRgba(makeLevel("CHIP", "WALL"), makeSpriteSet(), {
      showSecrets: false,
    });

    expect(pixelAt0(img)).toEqual([30, 200, 80, 255]);
  });

  it("shows secret arrows for ambiguous directional tiles", () => {
    const img = renderCc1LevelToRgba(makeLevel("BALL_N", "FLOOR"), makeSpriteSet(), {
      showSecrets: true,
    });

    let hasOpaqueRedPixel = false;
    for (let index = 0; index < img.data.length; index += 4) {
      if (
        img.data[index + 0] === 255 &&
        img.data[index + 1] === 0 &&
        img.data[index + 2] === 0 &&
        img.data[index + 3] === 255
      ) {
        hasOpaqueRedPixel = true;
        break;
      }
    }

    expect(hasOpaqueRedPixel).toBe(true);
  });

  it("renders single-cell previews with the same sprite composition rules", () => {
    const img = renderCc1CellToRgba("CHIP", "WALL", makeSpriteSet(), {
      showSecrets: false,
    });

    expect(pixelAt0(img)).toEqual([30, 200, 80, 255]);
  });

  it("does not show secret arrows for visually clear directional tiles", () => {
    const img = renderCc1LevelToRgba(makeLevel("ANT_N", "FLOOR"), makeSpriteSet(), {
      showSecrets: true,
    });

    let hasOpaqueRedPixel = false;
    for (let index = 0; index < img.data.length; index += 4) {
      if (
        img.data[index + 0] === 255 &&
        img.data[index + 1] === 0 &&
        img.data[index + 2] === 0 &&
        img.data[index + 3] === 255
      ) {
        hasOpaqueRedPixel = true;
        break;
      }
    }

    expect(hasOpaqueRedPixel).toBe(false);
  });

  it("lightens fake blue walls when secrets are visible", () => {
    const img = renderCc1CellToRgba("BLUE_WALL_FAKE", "FLOOR", makeSpriteSet(), {
      showSecrets: true,
    });

    expect(pixelAt0(img)).toEqual([140, 140, 140, 255]);
  });

  it("keeps appearing invisible walls on their base sprite when secrets are hidden", () => {
    const img = renderCc1CellToRgba("INV_WALL_APP", "FLOOR", makeSpriteSet(), {
      showSecrets: false,
    });

    expect(pixelAt0(img)).toEqual([210, 210, 210, 255]);
  });

  it("reveals appearing invisible walls as a black frame over floor", () => {
    const img = renderCc1CellToRgba("INV_WALL_APP", "FLOOR", makeSpriteSet(), {
      showSecrets: true,
    });

    expect(pixelAt0(img)).toEqual([0, 0, 0, 255]);
    expect(imageHasPixel(img, [10, 20, 30, 255])).toBe(true);
  });

  it("reveals permanent invisible walls as a black X over floor", () => {
    const img = renderCc1CellToRgba("INV_WALL_PERM", "FLOOR", makeSpriteSet(), {
      showSecrets: true,
    });

    expect(imageHasPixel(img, [0, 0, 0, 255])).toBe(true);
    expect(imageHasPixel(img, [10, 20, 30, 255])).toBe(true);
  });
});
