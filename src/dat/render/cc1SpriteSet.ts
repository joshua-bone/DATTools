// src/dat/render/cc1SpriteSet.ts
import { CC1_TILE_COUNT, tileNameFromCode } from "../cc1Tiles.js";
import type { RgbaImage } from "./rgbaImage.js";
import { cropRect, createImage } from "./rgbaImage.js";

export const DAT_3D_AIR_SPRITE_NAME = "__DAT3D_AIR__";
export const DAT_3D_ELEVATOR_SPRITE_NAME = "__DAT3D_ELEVATOR__";

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

function drawNotUsedCrossInPlace(img: RgbaImage): void {
  const thickness = Math.max(1, Math.floor(img.width / 8));

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const onForwardSlash = Math.abs(x - y) < thickness;
      const onBackSlash = Math.abs(x + y - (img.width - 1)) < thickness;
      if (!onForwardSlash && !onBackSlash) continue;

      const offset = (y * img.width + x) * 4;
      img.data[offset + 0] = 0;
      img.data[offset + 1] = 0;
      img.data[offset + 2] = 0;
      img.data[offset + 3] = 255;
    }
  }
}

function fillRect(
  img: RgbaImage,
  x: number,
  y: number,
  width: number,
  height: number,
  rgba: readonly [number, number, number, number],
): void {
  const [r, g, b, a] = rgba;
  const x0 = Math.max(0, x);
  const y0 = Math.max(0, y);
  const x1 = Math.min(img.width, x + width);
  const y1 = Math.min(img.height, y + height);

  for (let py = y0; py < y1; py++) {
    for (let px = x0; px < x1; px++) {
      const offset = (py * img.width + px) * 4;
      img.data[offset + 0] = r;
      img.data[offset + 1] = g;
      img.data[offset + 2] = b;
      img.data[offset + 3] = a;
    }
  }
}

function strokeRect(
  img: RgbaImage,
  x: number,
  y: number,
  width: number,
  height: number,
  thickness: number,
  rgba: readonly [number, number, number, number],
): void {
  fillRect(img, x, y, width, thickness, rgba);
  fillRect(img, x, y + height - thickness, width, thickness, rgba);
  fillRect(img, x, y, thickness, height, rgba);
  fillRect(img, x + width - thickness, y, thickness, height, rgba);
}

const ELEVATOR_UP_GLYPHS: Readonly<Record<"U" | "P", ReadonlyArray<string>>> = {
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
};

function drawBitmapGlyph(
  img: RgbaImage,
  x: number,
  y: number,
  rows: ReadonlyArray<string>,
  scale: number,
  rgba: readonly [number, number, number, number],
): void {
  rows.forEach((row, rowIndex) => {
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      if (row[columnIndex] !== "1") continue;
      fillRect(img, x + columnIndex * scale, y + rowIndex * scale, scale, scale, rgba);
    }
  });
}

function makeDat3dElevatorSprite(size: number): RgbaImage {
  const base = createImage(size, size, [47, 159, 74, 255]);
  const edge = [14, 64, 29, 255] as const;
  const baseHighlight = [72, 184, 93, 255] as const;
  const baseShadow = [28, 119, 51, 255] as const;
  const panel = [21, 77, 35, 255] as const;
  const panelHighlight = [31, 95, 45, 255] as const;
  const panelShadow = [11, 45, 21, 255] as const;
  const text = [217, 255, 215, 255] as const;
  const textShadow = [104, 156, 102, 255] as const;
  const border = Math.max(1, Math.round(size / 24));
  const bevel = Math.max(1, Math.round(size / 16));

  strokeRect(base, 0, 0, size, size, border, edge);
  fillRect(base, border, border, size - border * 2, bevel, baseHighlight);
  fillRect(base, border, border, bevel, size - border * 2, baseHighlight);
  fillRect(base, border, size - border - bevel, size - border * 2, bevel, baseShadow);
  fillRect(base, size - border - bevel, border, bevel, size - border * 2, baseShadow);

  const panelWidth = Math.max(20, Math.round(size * 0.62));
  const panelHeight = Math.max(10, Math.round(size * 0.28));
  const panelX = Math.floor((size - panelWidth) / 2);
  const panelY = Math.max(border + bevel + 1, Math.round(size * 0.36));
  strokeRect(base, panelX, panelY, panelWidth, panelHeight, border, edge);
  fillRect(
    base,
    panelX + border,
    panelY + border,
    panelWidth - border * 2,
    panelHeight - border * 2,
    panel,
  );
  fillRect(base, panelX + border, panelY + border, panelWidth - border * 2, border, panelHighlight);
  fillRect(
    base,
    panelX + border,
    panelY + border,
    border,
    panelHeight - border * 2,
    panelHighlight,
  );
  fillRect(
    base,
    panelX + border,
    panelY + panelHeight - border * 2,
    panelWidth - border * 2,
    border,
    panelShadow,
  );
  fillRect(
    base,
    panelX + panelWidth - border * 2,
    panelY + border,
    border,
    panelHeight - border * 2,
    panelShadow,
  );

  const glyphScale = Math.max(1, Math.floor(size / 20));
  const glyphSpacing = glyphScale * 2;
  const glyphHeight = ELEVATOR_UP_GLYPHS.U.length * glyphScale;
  const glyphWidth = ELEVATOR_UP_GLYPHS.U[0]!.length * glyphScale;
  const totalTextWidth = glyphWidth * 2 + glyphSpacing;
  const textX = Math.floor((size - totalTextWidth) / 2);
  const textY = Math.floor(panelY + (panelHeight - glyphHeight) / 2);

  drawBitmapGlyph(
    base,
    textX + glyphScale,
    textY + glyphScale,
    ELEVATOR_UP_GLYPHS.U,
    glyphScale,
    textShadow,
  );
  drawBitmapGlyph(
    base,
    textX + glyphWidth + glyphSpacing + glyphScale,
    textY + glyphScale,
    ELEVATOR_UP_GLYPHS.P,
    glyphScale,
    textShadow,
  );
  drawBitmapGlyph(base, textX, textY, ELEVATOR_UP_GLYPHS.U, glyphScale, text);
  drawBitmapGlyph(
    base,
    textX + glyphWidth + glyphSpacing,
    textY,
    ELEVATOR_UP_GLYPHS.P,
    glyphScale,
    text,
  );

  return base;
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
    const name = tileNameFromCode(code);

    let sprite: RgbaImage;
    if (mscc && x > 3) {
      const white = tile(x + 3, y);
      const black = tile(x + 6, y);
      sprite = applyAlphaMask(white, black);
    } else {
      sprite = tile(x, y);
    }

    if (name.startsWith("NOT_USED_")) {
      drawNotUsedCrossInPlace(sprite);
    }

    sprites.set(name, sprite);
  }

  sprites.set(DAT_3D_AIR_SPRITE_NAME, createImage(size, size, [0, 0, 0, 0]));
  sprites.set(DAT_3D_ELEVATOR_SPRITE_NAME, makeDat3dElevatorSprite(size));

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
