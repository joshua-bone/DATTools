import { describe, expect, it } from "vitest";

import { buildCc1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { createImage } from "@/src/dat/render/rgbaImage";

function setPixel(
  img: ReturnType<typeof createImage>,
  x: number,
  y: number,
  rgba: readonly [number, number, number, number],
): void {
  const offset = (y * img.width + x) * 4;
  img.data[offset + 0] = rgba[0];
  img.data[offset + 1] = rgba[1];
  img.data[offset + 2] = rgba[2];
  img.data[offset + 3] = rgba[3];
}

function readPixel(
  img: ReturnType<typeof createImage>,
  x: number,
  y: number,
): readonly [number, number, number, number] {
  const offset = (y * img.width + x) * 4;
  return [
    img.data[offset + 0]!,
    img.data[offset + 1]!,
    img.data[offset + 2]!,
    img.data[offset + 3]!,
  ];
}

function columnMatches(
  a: ReturnType<typeof createImage>,
  b: ReturnType<typeof createImage>,
  x: number,
): boolean {
  for (let y = 0; y < a.height; y++) {
    if (readPixel(a, x, y).join(",") !== readPixel(b, x, y).join(",")) return false;
  }
  return true;
}

describe("CC1 sprite set fallbacks", () => {
  it("renders unknown invalid bytes as centered labels over the floor tile art", () => {
    const size = 8;
    const sheet = createImage(size * 13, size * 16, [255, 0, 255, 255]);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        setPixel(sheet, x, y, x === 0 || x === size - 1 ? [70, 82, 96, 255] : [132, 144, 156, 255]);
      }
    }
    const spriteSet = buildCc1SpriteSet(sheet);
    const floor = spriteSet.get("FLOOR");
    const sprite = spriteSet.get("UNKNOWN_0xF0");

    expect(sprite.width).toBe(size);
    expect(sprite.height).toBe(size);

    expect(columnMatches(sprite, floor, 0)).toBe(true);
    expect(columnMatches(sprite, floor, size - 1)).toBe(true);

    const hasOpaquePixel = sprite.data.some((channel, index) => index % 4 === 3 && channel > 0);
    const hasDarkGlyphPixel = sprite.data.some(
      (channel, index) => index % 4 === 0 && channel < 40 && (sprite.data[index + 3] ?? 0) === 255,
    );

    expect(hasOpaquePixel).toBe(true);
    expect(hasDarkGlyphPixel).toBe(true);
  });
});
