// src/dat/render/cc1LevelRenderer.ts
import type { DatLevelJson } from "../datLevelsetJsonV1.js";
import type { RgbaImage } from "./rgbaImage.js";
import { createImage, cloneImage, blit } from "./rgbaImage.js";
import type { CC1SpriteSet } from "./cc1SpriteSet.js";
import {
  lightenImageInPlace,
  makeSemiTransparentInPlace,
  makeArrow,
  overlayArrowInPlace,
} from "./cc1Secrets.js";

export type RenderOptions = Readonly<{
  showSecrets: boolean;
}>;

const BLOCKS = new Set<string>([
  "BLOCK",
  "CLONE_BLOCK_N",
  "CLONE_BLOCK_W",
  "CLONE_BLOCK_S",
  "CLONE_BLOCK_E",
]);

function mobDirFromName(name: string): "N" | "E" | "S" | "W" | null {
  const m = /_(N|E|S|W)$/.exec(name);
  return m ? (m[1]! as "N" | "E" | "S" | "W") : null;
}

function isMobTile(name: string): boolean {
  // Anything with directional suffix in CC1 is considered a mob/dir tile for secrets overlay.
  return mobDirFromName(name) !== null;
}

export function renderCc1LevelToRgba(
  level: DatLevelJson,
  sprites: CC1SpriteSet,
  opts: RenderOptions,
): RgbaImage {
  const size = sprites.tileSize;
  const out = createImage(32 * size, 32 * size, [0, 0, 0, 0]);

  // Cache arrows by dir
  const arrowCache = new Map<string, RgbaImage>();
  const getArrow = (d: "N" | "E" | "S" | "W"): RgbaImage => {
    const key = `${size}:${d}`;
    const hit = arrowCache.get(key);
    if (hit) return hit;
    const a = makeArrow(size, d);
    arrowCache.set(key, a);
    return a;
  };

  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      const p = j * 32 + i;

      const bottomName = level.map.bottom[p] ?? "FLOOR";
      const topName = level.map.top[p] ?? bottomName;

      let tileImg = cloneImage(sprites.get(bottomName));

      if (topName !== bottomName) {
        const topImg = cloneImage(sprites.get(topName));

        if (opts.showSecrets && BLOCKS.has(topName)) {
          makeSemiTransparentInPlace(topImg);
        }

        if (opts.showSecrets && topName === "BLUE_WALL_FAKE") {
          lightenImageInPlace(topImg, 40);
        }

        blit(tileImg, topImg, 0, 0);

        if (opts.showSecrets && isMobTile(topName)) {
          const d = mobDirFromName(topName);
          if (d) overlayArrowInPlace(tileImg, getArrow(d));
        }
      }

      blit(out, tileImg, i * size, j * size);
    }
  }

  return out;
}
