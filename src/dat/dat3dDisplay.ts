import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { DAT_3D_AIR_TILE, DAT_3D_ELEVATOR_TILE } from "@/src/dat/dat3dLevels";
import { DAT_3D_AIR_SPRITE_NAME, DAT_3D_ELEVATOR_SPRITE_NAME } from "@/src/dat/render/cc1SpriteSet";

const FLOOR_TILE = "FLOOR";
const OVERLAY_BUFFER_TILE_NAME = "OVERLAY_BUFFER";

export type Dat3dDisplayContext = Readonly<{
  threeDEnabled: boolean;
  layerZ: number;
  layerCount: number;
}>;

export type Dat3dDisplayCell = Readonly<{
  top: string;
  bottom: string;
}>;

export function getDat3dTileDisplayName(tile: string, context: Dat3dDisplayContext): string {
  if (context.threeDEnabled && tile === DAT_3D_AIR_TILE) return "AIR";
  if (context.threeDEnabled && tile === DAT_3D_ELEVATOR_TILE) {
    return "ELEVATOR";
  }
  if (!context.threeDEnabled && tile === "NOT_USED_0") {
    return OVERLAY_BUFFER_TILE_NAME;
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
  return topTile === FLOOR_TILE && bottomTile === DAT_3D_AIR_TILE;
}

export function createDat3dDisplayCell(
  topTile: string,
  bottomTile: string,
  context: Dat3dDisplayContext,
): Dat3dDisplayCell {
  if (!context.threeDEnabled) {
    return {
      top: topTile,
      bottom: bottomTile,
    };
  }

  if (cellShouldRenderAsAir(topTile, bottomTile, context)) {
    return {
      top: DAT_3D_AIR_SPRITE_NAME,
      bottom: DAT_3D_AIR_SPRITE_NAME,
    };
  }

  return {
    top: getDat3dTileSpriteName(topTile, context),
    bottom:
      context.layerZ > 1 && topTile === DAT_3D_AIR_TILE && bottomTile === FLOOR_TILE
        ? DAT_3D_AIR_SPRITE_NAME
        : getDat3dTileSpriteName(bottomTile, context),
  };
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
    const displayCell = createDat3dDisplayCell(topTile, bottomTile, context);
    nextTop[index] = displayCell.top;
    nextBottom[index] = displayCell.bottom;
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

export function getAirAboveElevatorIndices(
  upperLevel: DatLevelJson,
  lowerLevel: DatLevelJson,
  context: Dat3dDisplayContext,
): number[] {
  if (!context.threeDEnabled || context.layerZ <= 1) return [];

  const indices: number[] = [];

  for (let index = 0; index < upperLevel.map.top.length; index++) {
    const upperTop = upperLevel.map.top[index] ?? FLOOR_TILE;
    const upperBottom = upperLevel.map.bottom[index] ?? FLOOR_TILE;
    if (!cellShouldRenderAsAir(upperTop, upperBottom, context)) continue;

    const lowerTop = lowerLevel.map.top[index] ?? FLOOR_TILE;
    const lowerBottom = lowerLevel.map.bottom[index] ?? FLOOR_TILE;
    if (lowerTop === DAT_3D_ELEVATOR_TILE || lowerBottom === DAT_3D_ELEVATOR_TILE) {
      indices.push(index);
    }
  }

  return indices;
}
