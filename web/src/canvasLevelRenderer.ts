import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { buildCc1CellRenderSteps, type RenderOptions } from "@/src/dat/render/cc1CellRenderPlan";
import type { CanvasSpriteCache } from "@/web/src/canvasSpriteCache";

export function drawCc1CellToContext(
  ctx: CanvasRenderingContext2D,
  topName: string,
  bottomName: string,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
  dx = 0,
  dy = 0,
): void {
  const steps = buildCc1CellRenderSteps(topName, bottomName, opts);
  for (const step of steps) {
    if (step.kind === "sprite") {
      ctx.drawImage(spriteCache.getSprite(step.spriteName, step.effect), dx, dy);
      continue;
    }
    ctx.drawImage(spriteCache.getArrow(step.dir), dx, dy);
  }
}

export function drawCc1LevelToContext(
  ctx: CanvasRenderingContext2D,
  level: DatLevelJson,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
): void {
  const size = spriteCache.tileSize;
  for (let row = 0; row < 32; row++) {
    for (let column = 0; column < 32; column++) {
      const index = row * 32 + column;
      drawCc1CellToContext(
        ctx,
        level.map.top[index] ?? level.map.bottom[index] ?? "FLOOR",
        level.map.bottom[index] ?? "FLOOR",
        spriteCache,
        opts,
        column * size,
        row * size,
      );
    }
  }
}

export function drawCc1LevelToCanvas(
  canvas: HTMLCanvasElement,
  level: DatLevelJson,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
): void {
  canvas.width = spriteCache.tileSize * 32;
  canvas.height = spriteCache.tileSize * 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  drawCc1LevelToContext(ctx, level, spriteCache, opts);
}
