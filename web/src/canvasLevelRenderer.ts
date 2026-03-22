import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import type { CanvasSpriteCache } from "@/web/src/canvasSpriteCache";
import type { RenderOptions } from "@/src/dat/render/cc1CellRenderPlan";

export function drawCc1CellToContext(
  ctx: CanvasRenderingContext2D,
  topName: string,
  bottomName: string,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
  dx = 0,
  dy = 0,
): void {
  spriteCache.drawSource(ctx, spriteCache.getComposedCell(topName, bottomName, opts), dx, dy);
}

export function drawCc1LevelToContext(
  ctx: CanvasRenderingContext2D,
  level: DatLevelJson,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
): void {
  drawCc1CellsToContext(
    ctx,
    level,
    Array.from({ length: 32 * 32 }, (_, index) => index),
    spriteCache,
    opts,
  );
}

export function drawCc1CellsToContext(
  ctx: CanvasRenderingContext2D,
  level: DatLevelJson,
  indices: ReadonlyArray<number>,
  spriteCache: CanvasSpriteCache,
  opts: RenderOptions,
): void {
  const size = spriteCache.tileSize;
  for (const index of indices) {
    const column = index % 32;
    const row = Math.floor(index / 32);
    const dx = column * size;
    const dy = row * size;
    ctx.clearRect(dx, dy, size, size);
    drawCc1CellToContext(
      ctx,
      level.map.top[index] ?? level.map.bottom[index] ?? "FLOOR",
      level.map.bottom[index] ?? "FLOOR",
      spriteCache,
      opts,
      dx,
      dy,
    );
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
