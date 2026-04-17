import { base64ToBytes, bytesToBase64 } from "./base64.js";

export const WALL_MASK_WIDTH = 32;
export const WALL_MASK_HEIGHT = 32;
export const WALL_MASK_CELL_COUNT = WALL_MASK_WIDTH * WALL_MASK_HEIGHT;
export const WALL_MASK_BYTE_LENGTH = WALL_MASK_CELL_COUNT / 8;

export type WallMask32 = Readonly<{
  key: string;
  bytes: Uint8Array;
}>;

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(base64Url: string): string {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingLength);
}

export function wallMaskBitIsSet(bytes: Uint8Array, index: number): boolean {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  return (bytes[byteIndex] ?? 0) & (1 << bitIndex) ? true : false;
}

export function setWallMaskBit(bytes: Uint8Array, index: number): void {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  bytes[byteIndex] = (bytes[byteIndex] ?? 0) | (1 << bitIndex);
}

export function wallMaskKeyFromBytes(bytes: Uint8Array): string {
  if (bytes.length !== WALL_MASK_BYTE_LENGTH) {
    throw new Error(`Wall mask must be ${WALL_MASK_BYTE_LENGTH} bytes`);
  }
  return toBase64Url(bytesToBase64(bytes));
}

export function wallMaskBytesFromKey(key: string): Uint8Array {
  const bytes = base64ToBytes(fromBase64Url(key));
  if (bytes.length !== WALL_MASK_BYTE_LENGTH) {
    throw new Error(
      `Invalid wall mask key '${key}': expected ${WALL_MASK_BYTE_LENGTH} decoded bytes`,
    );
  }
  return bytes;
}

export function wallMask32FromBytes(bytes: Uint8Array): WallMask32 {
  const normalized = new Uint8Array(bytes);
  return {
    key: wallMaskKeyFromBytes(normalized),
    bytes: normalized,
  };
}

export function wallMask32FromKey(key: string): WallMask32 {
  return {
    key,
    bytes: wallMaskBytesFromKey(key),
  };
}
