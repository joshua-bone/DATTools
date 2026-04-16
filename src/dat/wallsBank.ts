import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { applyWallMask32ToDatLevel, createDatWallsPreviewLevel } from "@/src/walls-dat/adapter";
import {
  WALL_MASK_BYTE_LENGTH,
  WALL_MASK_CELL_COUNT,
  setWallMaskBit,
  wallMaskBytesFromKey,
  wallMaskKeyFromBytes,
} from "@/src/walls-core/mask32";

const FLOOR_TILE = "FLOOR";

const CC1_ACTOR_TILE_NAMES = new Set<string>([
  "BLOCK",
  "CLONE_BLOCK_N",
  "CLONE_BLOCK_W",
  "CLONE_BLOCK_S",
  "CLONE_BLOCK_E",
  "UNKNOWN_0x70",
  "UNKNOWN_0x71",
  "UNKNOWN_0x72",
  "UNKNOWN_0x73",
  "UNKNOWN_0x74",
  "UNKNOWN_0x75",
  "CHIP_EXIT",
  "DROWN_CHIP",
  "BURNED_CHIP0",
  "BURNED_CHIP1",
  "CHIP_SWIMMING_N",
  "CHIP_SWIMMING_W",
  "CHIP_SWIMMING_S",
  "CHIP_SWIMMING_E",
  "ANT_N",
  "ANT_W",
  "ANT_S",
  "ANT_E",
  "FIREBALL_N",
  "FIREBALL_W",
  "FIREBALL_S",
  "FIREBALL_E",
  "BALL_N",
  "BALL_W",
  "BALL_S",
  "BALL_E",
  "TANK_N",
  "TANK_W",
  "TANK_S",
  "TANK_E",
  "GLIDER_N",
  "GLIDER_W",
  "GLIDER_S",
  "GLIDER_E",
  "TEETH_N",
  "TEETH_W",
  "TEETH_S",
  "TEETH_E",
  "WALKER_N",
  "WALKER_W",
  "WALKER_S",
  "WALKER_E",
  "BLOB_N",
  "BLOB_W",
  "BLOB_S",
  "BLOB_E",
  "PARAMECIUM_N",
  "PARAMECIUM_W",
  "PARAMECIUM_S",
  "PARAMECIUM_E",
  "PLAYER_N",
  "PLAYER_W",
  "PLAYER_S",
  "PLAYER_E",
]);

export const WALL_BANK_TILE_NAMES = [
  "WALL",
  "INV_WALL_PERM",
  "BLUE_WALL_FAKE",
  "BLUE_WALL_REAL",
  "TOGGLE_WALL",
  "INV_WALL_APP",
  "POP_UP_WALL",
] as const;

const WALL_BANK_TILE_NAME_SET = new Set<string>(WALL_BANK_TILE_NAMES);

export { WALL_BANK_SCHEMA, parseWallsBank } from "@/src/walls-core/bank";
export type { WallsBankJson, WallsBankOccurrence } from "@/src/walls-core/bank";
export { wallMaskBytesFromKey, wallMaskKeyFromBytes } from "@/src/walls-core/mask32";

function resolveTerrainTile(level: DatLevelJson, index: number): string {
  const top = level.map.top[index] ?? FLOOR_TILE;
  const bottom = level.map.bottom[index] ?? FLOOR_TILE;

  if (CC1_ACTOR_TILE_NAMES.has(top)) return bottom;
  if (top === FLOOR_TILE && bottom !== FLOOR_TILE) return bottom;
  return top;
}

export function isWallBankTerrainTile(name: string): boolean {
  return WALL_BANK_TILE_NAME_SET.has(name);
}

export function buildWallMaskBytes(level: DatLevelJson): Uint8Array {
  const bytes = new Uint8Array(WALL_MASK_BYTE_LENGTH);

  for (let index = 0; index < WALL_MASK_CELL_COUNT; index++) {
    if (!isWallBankTerrainTile(resolveTerrainTile(level, index))) continue;
    setWallMaskBit(bytes, index);
  }

  return bytes;
}

export function buildWallMaskKey(level: DatLevelJson): string {
  return wallMaskKeyFromBytes(buildWallMaskBytes(level));
}

export function createWallsPreviewLevel(
  wallKey: string,
  metadata?: Partial<Pick<DatLevelJson, "number" | "title">>,
): DatLevelJson {
  return createDatWallsPreviewLevel(wallKey, metadata);
}

export function applyWallMaskToLevel(level: DatLevelJson, wallKey: string): DatLevelJson {
  return applyWallMask32ToDatLevel(level, wallKey);
}
