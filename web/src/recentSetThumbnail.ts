import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { drawCc1LevelToCanvas } from "@/web/src/canvasLevelRenderer";
import { createCanvasSpriteCache } from "@/web/src/canvasSpriteCache";

const THUMBNAIL_MIME_TYPE = "image/png";
const THUMBNAIL_PIXEL_SIZE = 128;

export function renderRecentSetThumbnail(
  level: DatLevelJson | null,
  spriteSet: CC1SpriteSet | null,
  showSecrets: boolean,
): string | null {
  if (typeof document === "undefined" || !level || !spriteSet) return null;

  const sourceCanvas = document.createElement("canvas");
  drawCc1LevelToCanvas(sourceCanvas, level, createCanvasSpriteCache(spriteSet), {
    showSecrets,
  });

  const thumbnailCanvas = document.createElement("canvas");
  thumbnailCanvas.width = THUMBNAIL_PIXEL_SIZE;
  thumbnailCanvas.height = THUMBNAIL_PIXEL_SIZE;

  const ctx = thumbnailCanvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sourceCanvas, 0, 0, THUMBNAIL_PIXEL_SIZE, THUMBNAIL_PIXEL_SIZE);

  return thumbnailCanvas.toDataURL(THUMBNAIL_MIME_TYPE);
}
