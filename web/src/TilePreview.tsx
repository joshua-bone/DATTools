import { useEffect, useRef } from "react";

import { getDat3dTileSpriteName, type Dat3dDisplayContext } from "@/src/dat/dat3dDisplay";
import { dirFromTileName, shouldShowDirectionArrowInPalette } from "@/src/dat/render/cc1Secrets";
import type { CanvasSpriteCache } from "@/web/src/canvasSpriteCache";

type TilePreviewProps = Readonly<{
  canvasSpriteCache: CanvasSpriteCache | null;
  tile: string;
  displayContext?: Dat3dDisplayContext;
  className?: string;
  pixelSize?: number;
  showPaletteDirectionArrow?: boolean;
}>;

export function TilePreview({
  canvasSpriteCache,
  tile,
  displayContext,
  className,
  pixelSize,
  showPaletteDirectionArrow = false,
}: TilePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvasSpriteCache) {
      canvas.width = 1;
      canvas.height = 1;
      return;
    }

    canvas.width = canvasSpriteCache.tileSize;
    canvas.height = canvasSpriteCache.tileSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spriteName = displayContext ? getDat3dTileSpriteName(tile, displayContext) : tile;
    const overlayDir =
      showPaletteDirectionArrow && shouldShowDirectionArrowInPalette(tile)
        ? dirFromTileName(tile)
        : null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasSpriteCache.drawSource(ctx, canvasSpriteCache.getSprite(spriteName), 0, 0);
    if (overlayDir) {
      canvasSpriteCache.drawSource(ctx, canvasSpriteCache.getArrow(overlayDir), 0, 0);
    }
  }, [canvasSpriteCache, displayContext, showPaletteDirectionArrow, tile]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={pixelSize ? { width: pixelSize, height: pixelSize } : undefined}
    />
  );
}
