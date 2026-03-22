import { applySpriteEffectInPlace, type SpriteEffect } from "@/src/dat/render/cc1CellRenderPlan";
import { makeArrow, type Dir } from "@/src/dat/render/cc1Secrets";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { cloneImage, type RgbaImage } from "@/src/dat/render/rgbaImage";
import { drawRgbaImageToCanvas } from "@/web/src/canvasDrawing";

export type CanvasSpriteCache = Readonly<{
  tileSize: number;
  getSprite: (name: string, effect?: SpriteEffect) => HTMLCanvasElement;
  getArrow: (dir: Dir) => HTMLCanvasElement;
}>;

function createCanvasFromImage(image: RgbaImage): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  drawRgbaImageToCanvas(canvas, image);
  return canvas;
}

export function createCanvasSpriteCache(spriteSet: CC1SpriteSet): CanvasSpriteCache {
  const spriteCache = new Map<string, HTMLCanvasElement>();
  const arrowCache = new Map<Dir, HTMLCanvasElement>();

  return {
    tileSize: spriteSet.tileSize,
    getSprite(name, effect = "none") {
      const key = `${name}:${effect}`;
      const hit = spriteCache.get(key);
      if (hit) return hit;

      const baseImage = spriteSet.get(name);
      const variantImage = effect === "none" ? baseImage : cloneImage(baseImage);
      applySpriteEffectInPlace(variantImage, effect);

      const canvas = createCanvasFromImage(variantImage);
      spriteCache.set(key, canvas);
      return canvas;
    },
    getArrow(dir) {
      const hit = arrowCache.get(dir);
      if (hit) return hit;

      const canvas = createCanvasFromImage(makeArrow(spriteSet.tileSize, dir));
      arrowCache.set(dir, canvas);
      return canvas;
    },
  };
}
