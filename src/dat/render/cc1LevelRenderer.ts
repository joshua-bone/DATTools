// src/dat/render/cc1LevelRenderer.ts
import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import {
  applySpriteEffectInPlace,
  buildCc1CellRenderSteps,
  type RenderOptions,
} from "@/src/dat/render/cc1CellRenderPlan";
import type { RgbaImage } from "@/src/dat/render/rgbaImage";
import { createImage, cloneImage, blit } from "@/src/dat/render/rgbaImage";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { makeArrow, overlayArrowInPlace } from "@/src/dat/render/cc1Secrets";

function renderCc1CellToRgbaWithArrowCache(
  topName: string,
  bottomName: string,
  sprites: CC1SpriteSet,
  opts: RenderOptions,
  arrowCache: Map<string, RgbaImage>,
): RgbaImage {
  const size = sprites.tileSize;
  const getArrow = (dir: "N" | "E" | "S" | "W"): RgbaImage => {
    const key = `${size}:${dir}`;
    const hit = arrowCache.get(key);
    if (hit) return hit;
    const arrow = makeArrow(size, dir);
    arrowCache.set(key, arrow);
    return arrow;
  };

  const steps = buildCc1CellRenderSteps(topName, bottomName, opts);
  let tileImg: RgbaImage | null = null;

  for (const step of steps) {
    if (step.kind === "sprite") {
      const sprite = cloneImage(sprites.get(step.spriteName));
      applySpriteEffectInPlace(sprite, step.effect);
      if (!tileImg) tileImg = sprite;
      else blit(tileImg, sprite, 0, 0);
      continue;
    }

    if (!tileImg) {
      tileImg = createImage(size, size, [0, 0, 0, 0]);
    }

    overlayArrowInPlace(tileImg, getArrow(step.dir));
  }

  return tileImg ?? createImage(size, size, [0, 0, 0, 0]);
}

export function renderCc1CellToRgba(
  topName: string,
  bottomName: string,
  sprites: CC1SpriteSet,
  opts: RenderOptions,
): RgbaImage {
  return renderCc1CellToRgbaWithArrowCache(topName, bottomName, sprites, opts, new Map());
}

export function renderCc1LevelToRgba(
  level: DatLevelJson,
  sprites: CC1SpriteSet,
  opts: RenderOptions,
): RgbaImage {
  const size = sprites.tileSize;
  const out = createImage(32 * size, 32 * size, [0, 0, 0, 0]);
  const arrowCache = new Map<string, RgbaImage>();

  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      const p = j * 32 + i;

      const bottomName = level.map.bottom[p] ?? "FLOOR";
      const topName = level.map.top[p] ?? bottomName;
      const tileImg = renderCc1CellToRgbaWithArrowCache(
        topName,
        bottomName,
        sprites,
        opts,
        arrowCache,
      );

      blit(out, tileImg, i * size, j * size);
    }
  }

  return out;
}
