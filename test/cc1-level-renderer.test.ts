import { describe, expect, it } from "vitest";

import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { renderCc1LevelToRgba } from "@/src/dat/render/cc1LevelRenderer";
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
});
