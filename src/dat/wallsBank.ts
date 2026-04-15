import { base64ToBytes, bytesToBase64 } from "@/src/dat/base64";
import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";

const WALL_MASK_WIDTH = 32;
const WALL_MASK_HEIGHT = 32;
const WALL_MASK_CELL_COUNT = WALL_MASK_WIDTH * WALL_MASK_HEIGHT;
const WALL_MASK_BYTE_LENGTH = WALL_MASK_CELL_COUNT / 8;
const FLOOR_TILE = "FLOOR";
const WALL_TILE = "WALL";

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

export const WALL_BANK_SCHEMA = "datTools.walls.bank.v1";
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

export type WallsBankOccurrence = Readonly<{
  packId: number;
  setName: string;
  packType: string;
  fileName: string;
  levelNumber: number;
  levelTitle: string;
  author?: string;
}>;

export type WallsBankJson = Readonly<{
  schema: typeof WALL_BANK_SCHEMA;
  generatedAt: string;
  source: Readonly<{
    apiBaseUrl: string;
    downloadablePackCount: number;
    skippedPackCount: number;
    failedPackCount: number;
    levelCount: number;
    uniqueWallCount: number;
    wallTileNames: ReadonlyArray<string>;
  }>;
  masks: Readonly<Record<string, ReadonlyArray<WallsBankOccurrence>>>;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseString(value: unknown, path: string): string {
  if (typeof value !== "string") throw new Error(`Invalid ${path}: expected string`);
  return value;
}

function parseStringOpt(value: unknown, path: string): string | undefined {
  if (value === undefined) return undefined;
  return parseString(value, path);
}

function parseInteger(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value))
    throw new Error(`Invalid ${path}: expected integer`);
  return value;
}

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(base64Url: string): string {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingLength);
}

function maskBitIsSet(bytes: Uint8Array, index: number): boolean {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  return (bytes[byteIndex] ?? 0) & (1 << bitIndex) ? true : false;
}

function setMaskBit(bytes: Uint8Array, index: number): void {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  bytes[byteIndex] = (bytes[byteIndex] ?? 0) | (1 << bitIndex);
}

function resolveTerrainTile(level: DatLevelJson, index: number): string {
  const top = level.map.top[index] ?? FLOOR_TILE;
  const bottom = level.map.bottom[index] ?? FLOOR_TILE;

  if (CC1_ACTOR_TILE_NAMES.has(top)) return bottom;
  if (top === FLOOR_TILE && bottom !== FLOOR_TILE) return bottom;
  return top;
}

function buildMaskLevelMap(bytes: Uint8Array): DatLevelJson["map"] {
  const top = Array<string>(WALL_MASK_CELL_COUNT).fill(FLOOR_TILE);
  const bottom = Array<string>(WALL_MASK_CELL_COUNT).fill(FLOOR_TILE);

  for (let index = 0; index < WALL_MASK_CELL_COUNT; index++) {
    if (!maskBitIsSet(bytes, index)) continue;
    top[index] = WALL_TILE;
  }

  return {
    width: WALL_MASK_WIDTH,
    height: WALL_MASK_HEIGHT,
    top,
    bottom,
  };
}

function parseOccurrence(value: unknown, path: string): WallsBankOccurrence {
  if (!isRecord(value)) throw new Error(`Invalid ${path}: expected object`);
  const author = parseStringOpt(value.author, `${path}.author`);
  return {
    packId: parseInteger(value.packId, `${path}.packId`),
    setName: parseString(value.setName, `${path}.setName`),
    packType: parseString(value.packType, `${path}.packType`),
    fileName: parseString(value.fileName, `${path}.fileName`),
    levelNumber: parseInteger(value.levelNumber, `${path}.levelNumber`),
    levelTitle: parseString(value.levelTitle, `${path}.levelTitle`),
    ...(author ? { author } : {}),
  };
}

export function isWallBankTerrainTile(name: string): boolean {
  return WALL_BANK_TILE_NAME_SET.has(name);
}

export function buildWallMaskBytes(level: DatLevelJson): Uint8Array {
  const bytes = new Uint8Array(WALL_MASK_BYTE_LENGTH);

  for (let index = 0; index < WALL_MASK_CELL_COUNT; index++) {
    if (!isWallBankTerrainTile(resolveTerrainTile(level, index))) continue;
    setMaskBit(bytes, index);
  }

  return bytes;
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

export function buildWallMaskKey(level: DatLevelJson): string {
  return wallMaskKeyFromBytes(buildWallMaskBytes(level));
}

export function createWallsPreviewLevel(
  wallKey: string,
  metadata?: Partial<Pick<DatLevelJson, "number" | "title">>,
): DatLevelJson {
  return {
    number: metadata?.number ?? 1,
    time: 0,
    chips: 0,
    mapDetail: 1,
    ...(metadata?.title ? { title: metadata.title } : {}),
    map: buildMaskLevelMap(wallMaskBytesFromKey(wallKey)),
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [],
    extraFields: [],
  };
}

export function applyWallMaskToLevel(level: DatLevelJson, wallKey: string): DatLevelJson {
  return {
    ...level,
    chips: 0,
    map: buildMaskLevelMap(wallMaskBytesFromKey(wallKey)),
    trapControls: [],
    cloneControls: [],
    movement: [],
  };
}

export function parseWallsBank(input: unknown): WallsBankJson {
  if (!isRecord(input)) throw new Error("Invalid walls bank: expected object");
  if (input.schema !== WALL_BANK_SCHEMA) {
    throw new Error(`Invalid walls bank schema: expected '${WALL_BANK_SCHEMA}'`);
  }
  if (!isRecord(input.source)) throw new Error("Invalid walls bank source: expected object");
  if (!isRecord(input.masks)) throw new Error("Invalid walls bank masks: expected object");

  const masks: Record<string, ReadonlyArray<WallsBankOccurrence>> = {};
  for (const [key, value] of Object.entries(input.masks)) {
    wallMaskBytesFromKey(key);
    if (!Array.isArray(value)) throw new Error(`Invalid masks.${key}: expected array`);
    masks[key] = value.map((item, index) => parseOccurrence(item, `masks.${key}[${index}]`));
  }

  return {
    schema: WALL_BANK_SCHEMA,
    generatedAt: parseString(input.generatedAt, "generatedAt"),
    source: {
      apiBaseUrl: parseString(input.source.apiBaseUrl, "source.apiBaseUrl"),
      downloadablePackCount: parseInteger(
        input.source.downloadablePackCount,
        "source.downloadablePackCount",
      ),
      skippedPackCount: parseInteger(input.source.skippedPackCount, "source.skippedPackCount"),
      failedPackCount: parseInteger(input.source.failedPackCount, "source.failedPackCount"),
      levelCount: parseInteger(input.source.levelCount, "source.levelCount"),
      uniqueWallCount: parseInteger(input.source.uniqueWallCount, "source.uniqueWallCount"),
      wallTileNames: Array.isArray(input.source.wallTileNames)
        ? input.source.wallTileNames.map((value, index) =>
            parseString(value, `source.wallTileNames[${index}]`),
          )
        : (() => {
            throw new Error("Invalid source.wallTileNames: expected array");
          })(),
    },
    masks,
  };
}
