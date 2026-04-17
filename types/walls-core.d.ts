export declare const WALL_BANK_SCHEMA = "datTools.walls.bank.v1";

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

export type WallsBankRecord = Readonly<{
  wallKey: string;
  entries: ReadonlyArray<WallsBankOccurrence>;
  occurrenceCount: number;
  primaryEntry: WallsBankOccurrence;
  searchText: string;
}>;

export type FilterWallsBankOptions = Readonly<{
  query: string;
  starredOnly: boolean;
  includeHidden: boolean;
  starredKeys: ReadonlySet<string>;
  hiddenKeys: ReadonlySet<string>;
}>;

export type BuildWallsBankRecordsOptions = Readonly<{
  includeOccurrence?: (entry: WallsBankOccurrence) => boolean;
}>;

export declare function parseWallsBank(value: unknown): WallsBankJson;
export declare function buildWallsBankRecords(
  bank: WallsBankJson,
  options?: BuildWallsBankRecordsOptions,
): ReadonlyArray<WallsBankRecord>;
export declare function filterWallsBankRecords(
  records: ReadonlyArray<WallsBankRecord>,
  options: FilterWallsBankOptions,
): ReadonlyArray<WallsBankRecord>;
export declare function pickRandomWallsBankRecords(
  records: ReadonlyArray<WallsBankRecord>,
  count: number,
  seed: number,
): ReadonlyArray<WallsBankRecord>;
export declare function findWallsBankRecord(
  records: ReadonlyArray<WallsBankRecord>,
  wallKey: string | null,
): WallsBankRecord | null;

export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function base64ToBytes(base64: string): Uint8Array;

export type WallGrid = Readonly<{
  width: number;
  height: number;
  cells: Uint8Array;
}>;

export declare function createWallGrid(width: number, height: number, fill?: 0 | 1): WallGrid;
export declare function cloneWallGrid(grid: WallGrid): WallGrid;
export declare function invertWallGrid(grid: WallGrid): WallGrid;
export declare function wallGridToMaskBytes(grid: WallGrid): Uint8Array;
export declare function wallGridFromMaskBytes(bytes: Uint8Array): WallGrid;
export declare function wallGridKeyFromGrid(grid: WallGrid): string;
export declare function wallGridFromKey(key: string): WallGrid;

export declare const WALL_MASK_WIDTH = 32;
export declare const WALL_MASK_HEIGHT = 32;
export declare const WALL_MASK_CELL_COUNT: number;
export declare const WALL_MASK_BYTE_LENGTH: number;

export type WallMask32 = Readonly<{
  key: string;
  bytes: Uint8Array;
}>;

export declare function wallMaskKeyFromBytes(bytes: Uint8Array): string;
export declare function wallMaskBytesFromKey(key: string): Uint8Array;
export declare function wallMask32FromBytes(bytes: Uint8Array): WallMask32;
export declare function wallMask32FromKey(key: string): WallMask32;
export declare function cloneWallMaskBytes(bytes: Uint8Array): Uint8Array;
export declare function wallMaskBitIsSet(bytes: Uint8Array, index: number): boolean;
export declare function setWallMaskBit(bytes: Uint8Array, index: number, wall: boolean): void;
