// src/dat/render/cc1SpriteSet.ts
import { CC1_TILE_COUNT, tileNameFromCode } from "../cc1Tiles.js";
import type { RgbaImage } from "./rgbaImage.js";
import { cropRect, createImage } from "./rgbaImage.js";

export type CC1SpriteSet = Readonly<{
  tileSize: number;
  get(name: string): RgbaImage;
}>;

function makeTransparentByRgb(img: RgbaImage, keyR: number, keyG: number, keyB: number): void {
  for (let i = 0; i < img.width * img.height; i++) {
    const o = i * 4;
    const r = img.data[o + 0]!;
    const g = img.data[o + 1]!;
    const b = img.data[o + 2]!;
    const a = img.data[o + 3]!;
    if (a !== 0 && r === keyR && g === keyG && b === keyB) {
      img.data[o + 3] = 0;
    }
  }
}

function applyAlphaMask(white: RgbaImage, black: RgbaImage): RgbaImage {
  if (white.width !== black.width || white.height !== black.height) {
    throw new Error("applyAlphaMask size mismatch");
  }
  const out = createImage(white.width, white.height, [0, 0, 0, 0]);

  for (let i = 0; i < white.width * white.height; i++) {
    const o = i * 4;
    const wr = white.data[o + 0]!;
    const wg = white.data[o + 1]!;
    const wb = white.data[o + 2]!;

    const br = black.data[o + 0]!;
    const bg = black.data[o + 1]!;
    const bb = black.data[o + 2]!;

    // PIL L conversion approximation
    const alpha = Math.max(0, Math.min(255, Math.round(0.299 * br + 0.587 * bg + 0.114 * bb)));

    out.data[o + 0] = wr;
    out.data[o + 1] = wg;
    out.data[o + 2] = wb;
    out.data[o + 3] = alpha;
  }

  return out;
}

export function buildCc1SpriteSet(sheet: RgbaImage): CC1SpriteSet {
  if (sheet.height % 16 !== 0)
    throw new Error(`Spritesheet height must be divisible by 16, got ${sheet.height}`);
  const size = sheet.height / 16;
  const mscc = sheet.width === size * 13;

  // If mscc: treat magenta as transparent
  if (mscc) {
    makeTransparentByRgb(sheet, 255, 0, 255);
  } else {
    // If not mscc: use top-right pixel as chroma key if not already transparent
    const x = sheet.width - 1;
    const y = 0;
    const o = (y * sheet.width + x) * 4;
    const r = sheet.data[o + 0]!;
    const g = sheet.data[o + 1]!;
    const b = sheet.data[o + 2]!;
    const a = sheet.data[o + 3]!;
    if (a !== 0) {
      makeTransparentByRgb(sheet, r, g, b);
    }
  }

  const tile = (xi: number, yi: number): RgbaImage => {
    const l = xi * size;
    const t = yi * size;
    return cropRect(sheet, l, t, l + size, t + size);
  };

  const sprites = new Map<string, RgbaImage>();

  for (let code = 0; code < CC1_TILE_COUNT; code++) {
    const x = Math.floor(code / 16);
    const y = code % 16;

    let sprite: RgbaImage;
    if (mscc && x > 3) {
      const white = tile(x + 3, y);
      const black = tile(x + 6, y);
      sprite = applyAlphaMask(white, black);
    } else {
      sprite = tile(x, y);
    }

    sprites.set(tileNameFromCode(code), sprite);
  }

  return {
    tileSize: size,
    get(name: string): RgbaImage {
      const hit = sprites.get(name);
      if (hit) return hit;
      // unknown tile -> fully transparent placeholder
      return createImage(size, size, [0, 0, 0, 0]);
    },
  };
}
