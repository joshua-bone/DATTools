// src/dat/datTransforms.ts
import type { DatLevelsetJsonV1, DatMapJson, DatTileSpec, Dir } from "./datLevelsetJsonV1.js";

export type DatTransformKind =
  | "ROTATE_90"
  | "ROTATE_180"
  | "ROTATE_270"
  | "FLIP_H"
  | "FLIP_V"
  | "FLIP_DIAG_NWSE"
  | "FLIP_DIAG_NESW";

function toObj(t: DatTileSpec): { tile: string; dir?: Dir } {
  return typeof t === "string" ? { tile: t } : t;
}

function minimize(obj: { tile: string; dir?: Dir }): DatTileSpec {
  return obj.dir ? obj : obj.tile;
}

function mapDir(d: Dir, k: DatTransformKind): Dir {
  switch (k) {
    case "ROTATE_90":
      return d === "N" ? "E" : d === "E" ? "S" : d === "S" ? "W" : "N";
    case "ROTATE_180":
      return d === "N" ? "S" : d === "S" ? "N" : d === "E" ? "W" : "E";
    case "ROTATE_270":
      return d === "N" ? "W" : d === "W" ? "S" : d === "S" ? "E" : "N";
    case "FLIP_H":
      return d === "E" ? "W" : d === "W" ? "E" : d;
    case "FLIP_V":
      return d === "N" ? "S" : d === "S" ? "N" : d;
    case "FLIP_DIAG_NWSE":
      return d === "N" ? "W" : d === "W" ? "N" : d === "E" ? "S" : "E";
    case "FLIP_DIAG_NESW":
      return d === "N" ? "E" : d === "E" ? "N" : d === "S" ? "W" : "S";
  }
}

function mapPos(x: number, y: number, k: DatTransformKind): { x: number; y: number } {
  // DAT maps are always 32x32
  const W = 32;
  const H = 32;

  switch (k) {
    case "ROTATE_90":
      return { x: H - 1 - y, y: x };
    case "ROTATE_180":
      return { x: W - 1 - x, y: H - 1 - y };
    case "ROTATE_270":
      return { x: y, y: W - 1 - x };
    case "FLIP_H":
      return { x: W - 1 - x, y };
    case "FLIP_V":
      return { x, y: H - 1 - y };
    case "FLIP_DIAG_NWSE":
      return { x: y, y: x };
    case "FLIP_DIAG_NESW":
      return { x: H - 1 - y, y: W - 1 - x };
  }
}

export function transformMap(map: DatMapJson, k: DatTransformKind): DatMapJson {
  const outTiles: DatTileSpec[] = new Array<DatTileSpec>(32 * 32);

  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const idx = y * 32 + x;
      const t = map.tiles[idx];
      if (t === undefined) throw new Error(`missing tile at ${idx}`);

      const p = mapPos(x, y, k);
      const idx2 = p.y * 32 + p.x;

      const obj = toObj(t);
      outTiles[idx2] = minimize(
        obj.dir ? { tile: obj.tile, dir: mapDir(obj.dir, k) } : { tile: obj.tile },
      );
    }
  }

  return { width: 32, height: 32, tiles: outTiles };
}

export function transformLevelset(doc: DatLevelsetJsonV1, k: DatTransformKind): DatLevelsetJsonV1 {
  return {
    schema: doc.schema,
    levels: doc.levels.map((lv: DatLevelsetJsonV1["levels"][number]) => ({
      ...lv,
      map: transformMap(lv.map, k),
    })),
  };
}
