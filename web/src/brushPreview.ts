import { DAT_3D_AIR_TILE } from "@/src/dat/dat3dLevels";
import type { BoardDisplayContext } from "@/web/src/boardEditorStatus";

export function brushPreviewNeedsTransientBoard(
  tile: string,
  displayContext: BoardDisplayContext,
): boolean {
  return displayContext.threeDEnabled && displayContext.layerZ > 1 && tile === DAT_3D_AIR_TILE;
}
