// src/dat/datLevelsetJsonV1.ts
export type Dir = "N" | "E" | "S" | "W";

export type DatTileSpec = string | Readonly<{ tile: string; dir?: Dir }>;

export type DatMapJson = Readonly<{
  width: 32;
  height: 32;
  tiles: ReadonlyArray<DatTileSpec>; // length = 1024
}>;

export type DatLevelJson = Readonly<{
  index: number;
  title?: string;
  map: DatMapJson;
}>;

export type DatLevelsetJsonV1 = Readonly<{
  schema: "datTools.dat.levelset.json.v1";
  levels: ReadonlyArray<DatLevelJson>;
}>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseU8Fixed32(v: unknown, path: string): 32 {
  if (v !== 32) throw new Error(`Invalid ${path}: expected 32`);
  return 32;
}

function parseInt(v: unknown, path: string): number {
  if (typeof v !== "number" || !Number.isInteger(v))
    throw new Error(`Invalid ${path}: expected integer`);
  return v;
}

function parseDir(v: unknown, path: string): Dir {
  if (v !== "N" && v !== "E" && v !== "S" && v !== "W")
    throw new Error(`Invalid ${path}: expected N|E|S|W`);
  return v;
}

function parseTileSpec(v: unknown, path: string): DatTileSpec {
  if (typeof v === "string") return v;
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected string or object`);
  const tile = v.tile;
  if (typeof tile !== "string") throw new Error(`Invalid ${path}.tile: expected string`);
  const out: { tile: string; dir?: Dir } = { tile };
  if (v.dir !== undefined) out.dir = parseDir(v.dir, `${path}.dir`);
  return out;
}

function parseMap(v: unknown, path: string): DatMapJson {
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected object`);
  const width = parseU8Fixed32(v.width, `${path}.width`);
  const height = parseU8Fixed32(v.height, `${path}.height`);
  const tiles = v.tiles;
  if (!Array.isArray(tiles)) throw new Error(`Invalid ${path}.tiles: expected array`);
  if (tiles.length !== 32 * 32) throw new Error(`Invalid ${path}.tiles: expected length 1024`);
  const parsed = tiles.map((t, i) => parseTileSpec(t, `${path}.tiles[${i}]`));
  return { width, height, tiles: parsed };
}

function parseLevel(v: unknown, path: string): DatLevelJson {
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected object`);
  const index = parseInt(v.index, `${path}.index`);
  const title = v.title;
  if (title !== undefined && typeof title !== "string") throw new Error(`Invalid ${path}.title`);
  const map = parseMap(v.map, `${path}.map`);
  const out: { index: number; title?: string; map: DatMapJson } = { index, map };
  if (title !== undefined) out.title = title;
  return out;
}

export function parseDatLevelsetJsonV1(input: unknown): DatLevelsetJsonV1 {
  if (!isRecord(input)) throw new Error("Invalid JSON: expected object");
  if (input.schema !== "datTools.dat.levelset.json.v1") throw new Error("Invalid schema");
  const levels = input.levels;
  if (!Array.isArray(levels)) throw new Error("Invalid levels: expected array");
  const parsed = levels.map((lv, i) => parseLevel(lv, `levels[${i}]`));
  return { schema: "datTools.dat.levelset.json.v1", levels: parsed };
}

export function stringifyDatLevelsetJsonV1(doc: DatLevelsetJsonV1): string {
  return JSON.stringify(doc, null, 2) + "\n";
}
