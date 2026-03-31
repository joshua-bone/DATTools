import { describe, expect, it } from "vitest";

import { extractSpriteOverridesFromAtlas, parseSpriteAtlasKey } from "@/src/dat/render/spriteAtlas";
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

describe("sprite atlas", () => {
  it("extracts named sprite overrides from atlas frames", () => {
    const atlasImage = createImage(192, 32, [0, 0, 0, 0]);
    setPixel(atlasImage, 4, 5, [210, 180, 120, 255]);
    setPixel(atlasImage, 32 + 18, 24, [92, 68, 48, 255]);
    setPixel(atlasImage, 64 + 11, 9, [188, 220, 255, 255]);
    setPixel(atlasImage, 96 + 16, 14, [48, 160, 216, 255]);
    setPixel(atlasImage, 128 + 9, 12, [166, 244, 255, 255]);
    setPixel(atlasImage, 160 + 12, 17, [132, 120, 104, 255]);

    const atlasKey = parseSpriteAtlasKey({
      image: "expansion.png",
      frames: {
        UNKNOWN_0x70: { x: 0, y: 0, width: 32, height: 32 },
        UNKNOWN_0x71: { x: 32, y: 0, width: 32, height: 32 },
        UNKNOWN_0x72: { x: 64, y: 0, width: 32, height: 32 },
        UNKNOWN_0x73: { x: 96, y: 0, width: 32, height: 32 },
        UNKNOWN_0x74: { x: 128, y: 0, width: 32, height: 32 },
        UNKNOWN_0x75: { x: 160, y: 0, width: 32, height: 32 },
      },
    });

    const overrides = extractSpriteOverridesFromAtlas(atlasImage, atlasKey, 32);

    expect(readPixel(overrides.UNKNOWN_0x70!, 4, 5)).toEqual([210, 180, 120, 255]);
    expect(readPixel(overrides.UNKNOWN_0x71!, 18, 24)).toEqual([92, 68, 48, 255]);
    expect(readPixel(overrides.UNKNOWN_0x72!, 11, 9)).toEqual([188, 220, 255, 255]);
    expect(readPixel(overrides.UNKNOWN_0x73!, 16, 14)).toEqual([48, 160, 216, 255]);
    expect(readPixel(overrides.UNKNOWN_0x74!, 9, 12)).toEqual([166, 244, 255, 255]);
    expect(readPixel(overrides.UNKNOWN_0x75!, 12, 17)).toEqual([132, 120, 104, 255]);
  });

  it("rejects non-square tile frames", () => {
    const atlasImage = createImage(64, 32, [0, 0, 0, 0]);
    const atlasKey = parseSpriteAtlasKey({
      frames: {
        UNKNOWN_0x70: { x: 0, y: 0, width: 16, height: 32 },
      },
    });

    expect(() => extractSpriteOverridesFromAtlas(atlasImage, atlasKey, 32)).toThrow(
      "Sprite atlas frame 'UNKNOWN_0x70' must be 32x32, got 16x32",
    );
  });
});
