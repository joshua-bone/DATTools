import type { DatLevelJson } from "../src/dat/datLevelsetJsonV1";

import type { WallGrid, WallMask32 } from "./walls-core";

export type WallMask32Input = WallMask32 | string | Uint8Array;

export type DatWallGridFrame = Readonly<{
  layoutWidth: number;
  layoutHeight: number;
}>;

export declare function buildDatLevelMapFromWallMask32(mask: WallMask32Input): DatLevelJson["map"];
export declare function createDatWallsPreviewLevel(
  mask: WallMask32Input,
  metadata?: Partial<Pick<DatLevelJson, "number" | "title">>,
): DatLevelJson;
export declare function applyWallMask32ToDatLevel(
  level: DatLevelJson,
  mask: WallMask32Input,
): DatLevelJson;
export declare function frameWallGridToDatMask32(
  grid: WallGrid,
  frame: DatWallGridFrame,
): WallMask32;
export declare function applyGeneratedWallGridToDatLevel(
  level: DatLevelJson,
  grid: WallGrid,
  frame: DatWallGridFrame,
): DatLevelJson;

export declare const datWallsHostAdapter: Readonly<{
  applyBankMask32: typeof applyWallMask32ToDatLevel;
  applyGeneratedGrid: typeof applyGeneratedWallGridToDatLevel;
}>;
