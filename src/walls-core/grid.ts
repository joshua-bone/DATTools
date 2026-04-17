import {
  setWallMaskBit,
  WALL_MASK_HEIGHT,
  WALL_MASK_WIDTH,
  wallMaskBitIsSet,
} from "@/src/walls-core/mask32";
import { base64ToBytes, bytesToBase64 } from "@/src/walls-core/base64";

export type WallGrid = Readonly<{
  width: number;
  height: number;
  cells: Uint8Array;
}>;

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(base64Url: string): string {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingLength);
}

function validateGridDimension(name: string, value: number): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

function validateMask32Dimension(name: string, value: number, max: number): number {
  const validValue = validateGridDimension(name, value);
  if (validValue > max) {
    throw new Error(`${name} must be between 1 and ${max} for a 32x32 wall mask`);
  }
  return validValue;
}

export function createWallGrid(width: number, height: number, fill: 0 | 1 = 0): WallGrid {
  const validWidth = validateGridDimension("width", width);
  const validHeight = validateGridDimension("height", height);
  const cells = new Uint8Array(validWidth * validHeight);
  if (fill === 1) cells.fill(1);
  return {
    width: validWidth,
    height: validHeight,
    cells,
  };
}

export function wallGridFromMaskBytes(
  bytes: Uint8Array,
  width: number = WALL_MASK_WIDTH,
  height: number = WALL_MASK_HEIGHT,
): WallGrid {
  validateMask32Dimension("width", width, WALL_MASK_WIDTH);
  validateMask32Dimension("height", height, WALL_MASK_HEIGHT);
  const grid = createWallGrid(width, height);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const maskIndex = y * WALL_MASK_WIDTH + x;
      if (!wallMaskBitIsSet(bytes, maskIndex)) continue;
      grid.cells[y * grid.width + x] = 1;
    }
  }
  return grid;
}

export function wallGridToMaskBytes(grid: WallGrid): Uint8Array {
  validateMask32Dimension("grid.width", grid.width, WALL_MASK_WIDTH);
  validateMask32Dimension("grid.height", grid.height, WALL_MASK_HEIGHT);
  if (grid.cells.length !== grid.width * grid.height) {
    throw new Error("grid.cells length must match grid.width * grid.height");
  }

  const bytes = new Uint8Array((WALL_MASK_WIDTH * WALL_MASK_HEIGHT) / 8);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (grid.cells[y * grid.width + x] !== 1) continue;
      setWallMaskBit(bytes, y * WALL_MASK_WIDTH + x);
    }
  }
  return bytes;
}

export function invertWallGrid(grid: WallGrid): WallGrid {
  const cells = new Uint8Array(grid.cells.length);
  for (let index = 0; index < grid.cells.length; index += 1) {
    cells[index] = grid.cells[index] === 1 ? 0 : 1;
  }
  return {
    width: grid.width,
    height: grid.height,
    cells,
  };
}

export function wallGridKeyFromGrid(grid: WallGrid): string {
  if (grid.cells.length !== grid.width * grid.height) {
    throw new Error("grid.cells length must match grid.width * grid.height");
  }

  const bytes = new Uint8Array(Math.ceil(grid.cells.length / 8));
  for (let index = 0; index < grid.cells.length; index += 1) {
    if (grid.cells[index] !== 1) continue;
    setWallMaskBit(bytes, index);
  }

  return `${grid.width}x${grid.height}:${toBase64Url(bytesToBase64(bytes))}`;
}

export function wallGridFromKey(key: string): WallGrid {
  const match = /^(\d+)x(\d+):(.+)$/.exec(key);
  if (!match) throw new Error(`Invalid wall grid key '${key}'`);

  const width = validateGridDimension("width", Number(match[1]));
  const height = validateGridDimension("height", Number(match[2]));
  const bytes = base64ToBytes(fromBase64Url(match[3] ?? ""));
  const expectedByteLength = Math.ceil((width * height) / 8);
  if (bytes.length !== expectedByteLength) {
    throw new Error(`Invalid wall grid key '${key}': expected ${expectedByteLength} decoded bytes`);
  }

  const grid = createWallGrid(width, height);
  for (let index = 0; index < grid.cells.length; index += 1) {
    if (!wallMaskBitIsSet(bytes, index)) continue;
    grid.cells[index] = 1;
  }
  return grid;
}
