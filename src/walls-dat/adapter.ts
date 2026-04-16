import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import type { WallGrid } from "@/src/walls-core/grid";
import {
  WALL_MASK_CELL_COUNT,
  WALL_MASK_HEIGHT,
  WALL_MASK_WIDTH,
  wallMask32FromBytes,
  wallMask32FromKey,
  wallMaskBitIsSet,
  type WallMask32,
} from "@/src/walls-core/mask32";

const FLOOR_TILE = "FLOOR";
const WALL_TILE = "WALL";

type WallMask32Input = WallMask32 | string | Uint8Array;

export type DatWallGridFrame = Readonly<{
  layoutWidth: number;
  layoutHeight: number;
}>;

function normalizeWallMask32(mask: WallMask32Input): WallMask32 {
  if (typeof mask === "string") return wallMask32FromKey(mask);
  if (mask instanceof Uint8Array) return wallMask32FromBytes(mask);
  return mask;
}

function sanitizeDatWallLayoutDimension(name: string, value: number): number {
  if (!Number.isInteger(value) || value < 1 || value > WALL_MASK_WIDTH) {
    throw new Error(`${name} must be an integer between 1 and ${WALL_MASK_WIDTH}`);
  }
  return value;
}

export function buildDatLevelMapFromWallMask32(mask: WallMask32Input): DatLevelJson["map"] {
  const mask32 = normalizeWallMask32(mask);
  const top = Array<string>(WALL_MASK_CELL_COUNT).fill(FLOOR_TILE);
  const bottom = Array<string>(WALL_MASK_CELL_COUNT).fill(FLOOR_TILE);

  for (let index = 0; index < WALL_MASK_CELL_COUNT; index += 1) {
    if (!wallMaskBitIsSet(mask32.bytes, index)) continue;
    top[index] = WALL_TILE;
  }

  return {
    width: WALL_MASK_WIDTH,
    height: WALL_MASK_HEIGHT,
    top,
    bottom,
  };
}

export function createDatWallsPreviewLevel(
  mask: WallMask32Input,
  metadata?: Partial<Pick<DatLevelJson, "number" | "title">>,
): DatLevelJson {
  return {
    number: metadata?.number ?? 1,
    time: 0,
    chips: 0,
    mapDetail: 1,
    ...(metadata?.title ? { title: metadata.title } : {}),
    map: buildDatLevelMapFromWallMask32(mask),
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [],
    extraFields: [],
  };
}

export function applyWallMask32ToDatLevel(
  level: DatLevelJson,
  mask: WallMask32Input,
): DatLevelJson {
  return {
    ...level,
    chips: 0,
    map: buildDatLevelMapFromWallMask32(mask),
    trapControls: [],
    cloneControls: [],
    movement: [],
  };
}

export function frameWallGridToDatMask32(grid: WallGrid, frame: DatWallGridFrame): WallMask32 {
  const outerWidth = sanitizeDatWallLayoutDimension("layoutWidth", frame.layoutWidth);
  const outerHeight = sanitizeDatWallLayoutDimension("layoutHeight", frame.layoutHeight);
  const contentWidth = Math.min(grid.width, Math.max(1, outerWidth - 2));
  const contentHeight = Math.min(grid.height, Math.max(1, outerHeight - 2));
  const offsetX = Math.floor((WALL_MASK_WIDTH - outerWidth) / 2);
  const offsetY = Math.floor((WALL_MASK_HEIGHT - outerHeight) / 2);
  const bytes = new Uint8Array(WALL_MASK_CELL_COUNT / 8);

  for (let y = 0; y < outerHeight; y += 1) {
    for (let x = 0; x < outerWidth; x += 1) {
      const targetIndex = (offsetY + y) * WALL_MASK_WIDTH + (offsetX + x);
      const isBorder = x === 0 || y === 0 || x === outerWidth - 1 || y === outerHeight - 1;
      if (isBorder) {
        const byteIndex = Math.floor(targetIndex / 8);
        const bitIndex = 7 - (targetIndex % 8);
        bytes[byteIndex] = (bytes[byteIndex] ?? 0) | (1 << bitIndex);
        continue;
      }

      const sourceX = x - 1;
      const sourceY = y - 1;
      if (sourceX >= contentWidth || sourceY >= contentHeight) continue;
      if (grid.cells[sourceY * grid.width + sourceX] !== 1) continue;

      const byteIndex = Math.floor(targetIndex / 8);
      const bitIndex = 7 - (targetIndex % 8);
      bytes[byteIndex] = (bytes[byteIndex] ?? 0) | (1 << bitIndex);
    }
  }

  return wallMask32FromBytes(bytes);
}

export function applyGeneratedWallGridToDatLevel(
  level: DatLevelJson,
  grid: WallGrid,
  frame: DatWallGridFrame,
): DatLevelJson {
  return applyWallMask32ToDatLevel(level, frameWallGridToDatMask32(grid, frame));
}

export const datWallsHostAdapter = {
  applyBankMask32: applyWallMask32ToDatLevel,
  applyGeneratedGrid: applyGeneratedWallGridToDatLevel,
} as const;
