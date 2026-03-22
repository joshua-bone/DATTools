import { describe, expect, it } from "vitest";

import { buildCc1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { createImage } from "@/src/dat/render/rgbaImage";

describe("CC1 sprite set fallbacks", () => {
  it("renders unknown invalid bytes as labeled gray placeholders instead of transparency", () => {
    const size = 8;
    const sheet = createImage(size * 13, size * 16, [12, 34, 56, 255]);
    const spriteSet = buildCc1SpriteSet(sheet);
    const sprite = spriteSet.get("UNKNOWN_0xF0");

    expect(sprite.width).toBe(size);
    expect(sprite.height).toBe(size);

    const hasOpaquePixel = sprite.data.some((channel, index) => index % 4 === 3 && channel > 0);
    const hasDarkGlyphPixel = sprite.data.some(
      (channel, index) => index % 4 === 0 && channel < 80 && (sprite.data[index + 3] ?? 0) === 255,
    );

    expect(hasOpaquePixel).toBe(true);
    expect(hasDarkGlyphPixel).toBe(true);
  });
});
