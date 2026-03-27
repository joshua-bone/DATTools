import {
  applySpriteEffectInPlace,
  buildCc1CellRenderSteps,
  type RenderOptions,
  type SpriteEffect,
} from "@/src/dat/render/cc1CellRenderPlan";
import {
  makeArrow,
  makeSecretWallMarker,
  type Dir,
  type SecretWallVariant,
} from "@/src/dat/render/cc1Secrets";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { cloneImage, type RgbaImage } from "@/src/dat/render/rgbaImage";
import { drawRgbaImageToContext } from "@/web/src/canvasDrawing";

export type CanvasAtlasSource = Readonly<{
  canvas: HTMLCanvasElement;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}>;

export type CanvasSpriteCache = Readonly<{
  tileSize: number;
  getSprite: (name: string, effect?: SpriteEffect) => CanvasAtlasSource;
  getArrow: (dir: Dir) => CanvasAtlasSource;
  getSecretWall: (variant: SecretWallVariant) => CanvasAtlasSource;
  getComposedCell: (topName: string, bottomName: string, opts: RenderOptions) => CanvasAtlasSource;
  drawSource: (
    ctx: CanvasRenderingContext2D,
    source: CanvasAtlasSource,
    dx?: number,
    dy?: number,
  ) => void;
}>;

class CanvasAtlas {
  readonly canvas: HTMLCanvasElement;
  readonly tileSize: number;
  readonly columns: number;
  private ctx: CanvasRenderingContext2D;
  private slotCount = 0;

  constructor(tileSize: number, columns = 16) {
    this.tileSize = tileSize;
    this.columns = columns;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.tileSize * this.columns;
    this.canvas.height = this.tileSize;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
  }

  allocate(
    drawer: (ctx: CanvasRenderingContext2D, dx: number, dy: number) => void,
  ): CanvasAtlasSource {
    const slotIndex = this.slotCount;
    this.slotCount += 1;

    const row = Math.floor(slotIndex / this.columns);
    const nextHeight = (row + 1) * this.tileSize;
    if (nextHeight > this.canvas.height) {
      const previous = document.createElement("canvas");
      previous.width = this.canvas.width;
      previous.height = this.canvas.height;
      const previousCtx = previous.getContext("2d");
      if (!previousCtx) throw new Error("Canvas 2D context unavailable");
      previousCtx.drawImage(this.canvas, 0, 0);

      this.canvas.height = nextHeight;
      const nextCtx = this.canvas.getContext("2d");
      if (!nextCtx) throw new Error("Canvas 2D context unavailable");
      this.ctx = nextCtx;
      this.ctx.drawImage(previous, 0, 0);
    }

    const column = slotIndex % this.columns;
    const dx = column * this.tileSize;
    const dy = row * this.tileSize;
    drawer(this.ctx, dx, dy);

    return {
      canvas: this.canvas,
      sx: dx,
      sy: dy,
      sw: this.tileSize,
      sh: this.tileSize,
    };
  }
}

function createPrimitiveAtlasSource(atlas: CanvasAtlas, image: RgbaImage): CanvasAtlasSource {
  return atlas.allocate((ctx, dx, dy) => {
    drawRgbaImageToContext(ctx, image, dx, dy);
  });
}

export function createCanvasSpriteCache(spriteSet: CC1SpriteSet): CanvasSpriteCache {
  const primitiveAtlas = new CanvasAtlas(spriteSet.tileSize);
  const composedAtlas = new CanvasAtlas(spriteSet.tileSize);

  const spriteCache = new Map<string, CanvasAtlasSource>();
  const arrowCache = new Map<Dir, CanvasAtlasSource>();
  const secretWallCache = new Map<SecretWallVariant, CanvasAtlasSource>();
  const composedCellCache = new Map<string, CanvasAtlasSource>();

  const drawSource = (
    ctx: CanvasRenderingContext2D,
    source: CanvasAtlasSource,
    dx = 0,
    dy = 0,
  ): void => {
    ctx.drawImage(
      source.canvas,
      source.sx,
      source.sy,
      source.sw,
      source.sh,
      dx,
      dy,
      source.sw,
      source.sh,
    );
  };

  const getSprite = (name: string, effect: SpriteEffect = "none"): CanvasAtlasSource => {
    const key = `${name}:${effect}`;
    const hit = spriteCache.get(key);
    if (hit) return hit;

    const baseImage = spriteSet.get(name);
    const variantImage = effect === "none" ? baseImage : cloneImage(baseImage);
    applySpriteEffectInPlace(variantImage, effect);

    const source = createPrimitiveAtlasSource(primitiveAtlas, variantImage);
    spriteCache.set(key, source);
    return source;
  };

  const getArrow = (dir: Dir): CanvasAtlasSource => {
    const hit = arrowCache.get(dir);
    if (hit) return hit;

    const source = createPrimitiveAtlasSource(primitiveAtlas, makeArrow(spriteSet.tileSize, dir));
    arrowCache.set(dir, source);
    return source;
  };

  const getSecretWall = (variant: SecretWallVariant): CanvasAtlasSource => {
    const hit = secretWallCache.get(variant);
    if (hit) return hit;

    const source = createPrimitiveAtlasSource(
      primitiveAtlas,
      makeSecretWallMarker(spriteSet.tileSize, variant),
    );
    secretWallCache.set(variant, source);
    return source;
  };

  const getComposedCell = (
    topName: string,
    bottomName: string,
    opts: RenderOptions,
  ): CanvasAtlasSource => {
    const key = `${topName}|${bottomName}|${opts.showSecrets ? "secrets" : "plain"}`;
    const hit = composedCellCache.get(key);
    if (hit) return hit;

    const source = composedAtlas.allocate((ctx, dx, dy) => {
      for (const step of buildCc1CellRenderSteps(topName, bottomName, opts)) {
        if (step.kind === "sprite") {
          drawSource(ctx, getSprite(step.spriteName, step.effect), dx, dy);
          continue;
        }
        if (step.kind === "secretWall") {
          drawSource(ctx, getSecretWall(step.variant), dx, dy);
          continue;
        }
        drawSource(ctx, getArrow(step.dir), dx, dy);
      }
    });
    composedCellCache.set(key, source);
    return source;
  };

  return {
    tileSize: spriteSet.tileSize,
    getSprite,
    getArrow,
    getSecretWall,
    getComposedCell,
    drawSource,
  };
}
