/// <reference types="vite/client" />
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

import { createImage } from "@/src/dat/render/rgbaImage";
import { loadCc1SpriteSet } from "@/web/src/loadCc1SpriteSet";

afterEach(() => vi.unstubAllGlobals());

describe("browser CC1 atlas loading", () => {
  it("combines expanded, Meme and transparent Smart Teeth atlas pixels in the sprite set", async () => {
    // Only browser decoding and HTTP are replaced; extraction, scaling and sprite lookup run normally.
    const png = readFileSync(new URL("../web/public/meme_artwork/meme.png", import.meta.url));
    const memeKey = JSON.parse(
      readFileSync(new URL("../web/public/meme_artwork/meme.json", import.meta.url), "utf8"),
    );
    const dimensions = [png.readUInt32BE(16), png.readUInt32BE(20)] as const;
    expect(dimensions).toEqual([1774, 887]);
    const smartTeethKey = {
      frames: {
        SMART_TEETH_N: { x: 0, y: 0, width: 48, height: 48 },
        SMART_TEETH_W: { x: 48, y: 0, width: 48, height: 48 },
        SMART_TEETH_S: { x: 96, y: 0, width: 48, height: 48 },
        SMART_TEETH_E: { x: 144, y: 0, width: 48, height: 48 },
      },
    };
    const smartTeethImage = createImage(192, 48, [0, 0, 0, 0]);
    for (let direction = 0; direction < 4; direction++) {
      const pixel = (24 * 192 + direction * 48 + 24) * 4;
      smartTeethImage.data.set([40 + direction, 160, 80, 255], pixel);
    }
    const images = {
      "/smart_teeth_artwork/smart-teeth.png": smartTeethImage,
      "/cc1/spritesheet.bmp": createImage(624, 768, [255, 0, 255, 255]),
      "/expansion_artwork/expansion.png": createImage(48, 48, [180, 120, 60, 255]),
      "/meme_artwork/meme.png": createImage(dimensions[0], dimensions[1], [220, 20, 10, 255]),
    };
    class DecodedImage {
      naturalWidth = 0;
      naturalHeight = 0;
      pixels = new Uint8Array();
      onload = () => {};
      onerror = () => {};
      set src(url: string) {
        const image = images[url as keyof typeof images];
        if (!image) {
          queueMicrotask(() => this.onerror());
          return;
        }
        this.naturalWidth = image.width;
        this.naturalHeight = image.height;
        this.pixels = new Uint8Array(image.data);
        queueMicrotask(() => this.onload());
      }
    }
    vi.stubGlobal("Image", DecodedImage);
    vi.stubGlobal("document", {
      createElement(tag: string) {
        if (tag !== "canvas") throw new Error(`Unexpected element: ${tag}`);
        let image: DecodedImage;
        return {
          getContext() {
            return {
              drawImage(value: DecodedImage) {
                image = value;
              },
              getImageData() {
                return { data: image.pixels };
              },
            };
          },
        };
      },
    });
    vi.stubGlobal("fetch", async (url: string) => {
      if (url === "/smart_teeth_artwork/smart-teeth.json")
        return { ok: true, json: async () => smartTeethKey };
      if (url === "/meme_artwork/meme.json") return { ok: true, json: async () => memeKey };
      const name = url === "/expansion_artwork/expansion.json" ? "UNKNOWN_0x70" : null;
      if (!name) throw new Error(`Unexpected JSON URL: ${url}`);
      return {
        ok: true,
        json: async () => ({ frames: { [name]: { x: 0, y: 0, width: 48, height: 48 } } }),
      };
    });

    const sprites = await loadCc1SpriteSet("/cc1/spritesheet.bmp");
    expect([...sprites.get("UNKNOWN_0x70").data.slice(0, 4)]).toEqual([180, 120, 60, 255]);
    expect([...sprites.get("RED_TANK_N").data.slice(0, 4)]).toEqual([220, 20, 10, 255]);
    expect(sprites.tileSize).toBe(48);
    for (const [direction, name] of Object.keys(smartTeethKey.frames).entries()) {
      const sprite = sprites.get(name);
      expect([...sprite.data.slice((24 * 48 + 24) * 4, (24 * 48 + 24) * 4 + 4)]).toEqual([
        40 + direction,
        160,
        80,
        255,
      ]);
      expect(sprite.data[3]).toBe(0);
    }
    for (const name of Object.keys(memeKey.frames)) {
      expect(sprites.get(name).width).toBe(48);
      expect(sprites.get(name).height).toBe(48);
      expect([...sprites.get(name).data.slice(0, 4)]).toEqual([220, 20, 10, 255]);
    }
  });
});
