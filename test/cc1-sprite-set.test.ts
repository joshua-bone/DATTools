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

describe("CC1 sprite set fallbacks", () => {
  it("renders unknown invalid bytes as centered labels over the floor tile art", () => {
    const size = 32;
    const floorColor = [132, 144, 156, 255] as const;
    const sheet = createImage(size * 13, size * 16, [255, 0, 255, 255]);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        setPixel(sheet, x, y, floorColor);
      }
    }
    const spriteSet = buildCc1SpriteSet(sheet);
    const floor = spriteSet.get("FLOOR");
    const sprite = spriteSet.get("UNKNOWN_0xF0");

    expect(sprite.width).toBe(size);
    expect(sprite.height).toBe(size);

    expect(readPixel(sprite, 0, 0)).toEqual(floorColor);
    expect(readPixel(sprite, size - 1, 0)).toEqual(floorColor);
    expect(readPixel(sprite, 0, size - 1)).toEqual(floorColor);
    expect(readPixel(sprite, size - 1, size - 1)).toEqual(floorColor);

    const changedPixels: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (readPixel(sprite, x, y).join(",") !== readPixel(floor, x, y).join(",")) {
          changedPixels.push({ x, y });
        }
      }
    }

    expect(changedPixels.length).toBeGreaterThan(0);

    const xs = changedPixels.map((point) => point.x);
    const ys = changedPixels.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    expect(maxX - minX + 1).toBeLessThanOrEqual(24);
    expect(maxY - minY + 1).toBeLessThanOrEqual(20);
    expect(Math.abs(centerX - (size - 1) / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(centerY - (size - 1) / 2)).toBeLessThanOrEqual(1);
    expect(minX).toBeGreaterThanOrEqual(4);
    expect(maxX).toBeLessThanOrEqual(size - 5);
    expect(minY).toBeGreaterThanOrEqual(6);
    expect(maxY).toBeLessThanOrEqual(size - 7);
  });

  it("uses explicit sprite overrides for named invalid tile artwork", () => {
    const size = 32;
    const sheet = createImage(size * 13, size * 16, [255, 0, 255, 255]);
    const sandbag = createImage(size, size, [0, 0, 0, 0]);
    setPixel(sandbag, 4, 5, [210, 180, 120, 255]);
    setPixel(sandbag, 18, 24, [92, 68, 48, 255]);

    const spriteSet = buildCc1SpriteSet(sheet, { UNKNOWN_0x70: sandbag });
    const sprite = spriteSet.get("UNKNOWN_0x70");

    expect(sprite.width).toBe(size);
    expect(sprite.height).toBe(size);
    expect(readPixel(sprite, 4, 5)).toEqual([210, 180, 120, 255]);
    expect(readPixel(sprite, 18, 24)).toEqual([92, 68, 48, 255]);
  });
});
