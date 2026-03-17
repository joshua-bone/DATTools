import type { DatLevelJson } from "./datLevelsetJsonV1.js";
import { DAT_3D_AIR_TILE, DAT_3D_ELEVATOR_TILE } from "./dat3dLevels.js";
import { DAT_3D_AIR_SPRITE_NAME, DAT_3D_ELEVATOR_SPRITE_NAME } from "./render/cc1SpriteSet.js";

const FLOOR_TILE = "FLOOR";

export type Dat3dDisplayContext = Readonly<{
  threeDEnabled: boolean;
  layerZ: number;
  layerCount: number;
}>;

export function getDat3dTileDisplayName(tile: string, context: Dat3dDisplayContext): string {
  if (context.threeDEnabled && tile === DAT_3D_AIR_TILE) return "AIR";
  if (context.threeDEnabled && tile === DAT_3D_ELEVATOR_TILE) {
    return "ELEVATOR";
  }
  return tile;
}

export function getDat3dTileSpriteName(tile: string, context: Dat3dDisplayContext): string {
  if (context.threeDEnabled && tile === DAT_3D_AIR_TILE) return DAT_3D_AIR_SPRITE_NAME;
  if (context.threeDEnabled && tile === DAT_3D_ELEVATOR_TILE) {
    return DAT_3D_ELEVATOR_SPRITE_NAME;
  }
  return tile;
}

function cellShouldRenderAsAir(
  topTile: string,
  bottomTile: string,
  context: Dat3dDisplayContext,
): boolean {
  if (!context.threeDEnabled || context.layerZ <= 1) return false;
  if (topTile === DAT_3D_AIR_TILE) return true;
  return bottomTile === DAT_3D_AIR_TILE;
}

export function createDat3dDisplayLevel(
  level: DatLevelJson,
  context: Dat3dDisplayContext,
): DatLevelJson {
  if (!context.threeDEnabled) return level;

  const nextTop = [...level.map.top];
  const nextBottom = [...level.map.bottom];

  for (let index = 0; index < nextTop.length; index++) {
    const topTile = nextTop[index] ?? FLOOR_TILE;
    const bottomTile = nextBottom[index] ?? FLOOR_TILE;

    if (cellShouldRenderAsAir(topTile, bottomTile, context)) {
      nextTop[index] = DAT_3D_AIR_SPRITE_NAME;
      nextBottom[index] = DAT_3D_AIR_SPRITE_NAME;
      continue;
    }

    nextTop[index] = getDat3dTileSpriteName(topTile, context);
    nextBottom[index] = getDat3dTileSpriteName(bottomTile, context);

    if (context.layerZ > 1 && topTile === DAT_3D_AIR_TILE && bottomTile === FLOOR_TILE) {
      nextBottom[index] = DAT_3D_AIR_SPRITE_NAME;
    }
  }

  return {
    ...level,
    map: {
      ...level.map,
      top: nextTop,
      bottom: nextBottom,
    },
  };
}
