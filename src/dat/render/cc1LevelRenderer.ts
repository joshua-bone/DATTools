// src/dat/render/cc1LevelRenderer.ts
import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import type { RgbaImage } from "@/src/dat/render/rgbaImage";
import { createImage, cloneImage, blit } from "@/src/dat/render/rgbaImage";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import {
  lightenImageInPlace,
  makeSemiTransparentInPlace,
  dirFromTileName,
  makeArrow,
  overlayArrowInPlace,
  shouldShowDirectionArrowInPalette,
} from "@/src/dat/render/cc1Secrets";

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

function shouldOverlayTopTile(topName: string, bottomName: string): boolean {
  if (topName === bottomName) return false;

  // DAT top-layer FLOOR acts like "no top tile", so the bottom terrain remains visible.
  if (topName === "FLOOR") return false;

  return true;
}

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

  let tileImg = cloneImage(sprites.get(bottomName));

  if (shouldOverlayTopTile(topName, bottomName)) {
    const topImg = cloneImage(sprites.get(topName));

    if (opts.showSecrets && BLOCKS.has(topName)) {
      makeSemiTransparentInPlace(topImg);
    }

    if (opts.showSecrets && topName === "BLUE_WALL_FAKE") {
      lightenImageInPlace(topImg, 40);
    }

    blit(tileImg, topImg, 0, 0);

    if (opts.showSecrets && shouldShowDirectionArrowInPalette(topName)) {
      const d = dirFromTileName(topName);
      if (d) overlayArrowInPlace(tileImg, getArrow(d));
    }
  }

  return tileImg;
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
