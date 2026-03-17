import { useEffect, useRef } from "react";

import { getDat3dTileSpriteName, type Dat3dDisplayContext } from "../../src/dat/dat3dDisplay";
import {
  dirFromTileName,
  renderTileWithArrow,
  shouldShowDirectionArrowInPalette,
} from "../../src/dat/render/cc1Secrets";
import type { CC1SpriteSet } from "../../src/dat/render/cc1SpriteSet";
import { drawRgbaImageToCanvas } from "./canvasDrawing";

type TilePreviewProps = Readonly<{
  spriteSet: CC1SpriteSet | null;
  tile: string;
  displayContext?: Dat3dDisplayContext;
  className?: string;
  pixelSize?: number;
  showPaletteDirectionArrow?: boolean;
}>;

export function TilePreview({
  spriteSet,
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
    if (!spriteSet) {
      canvas.width = 1;
      canvas.height = 1;
      return;
    }
    const spriteName = displayContext ? getDat3dTileSpriteName(tile, displayContext) : tile;
    const baseImage = spriteSet.get(spriteName);
    const overlayDir =
      showPaletteDirectionArrow && shouldShowDirectionArrowInPalette(tile)
        ? dirFromTileName(tile)
        : null;
    const previewImage = overlayDir ? renderTileWithArrow(baseImage, overlayDir) : baseImage;
    drawRgbaImageToCanvas(canvas, previewImage);
  }, [displayContext, showPaletteDirectionArrow, spriteSet, tile]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={pixelSize ? { width: pixelSize, height: pixelSize } : undefined}
    />
  );
}
