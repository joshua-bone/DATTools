// src/dat/datTransforms.ts
import type { DatLevelsetJsonV1, DatMapJson } from "./datLevelsetJsonV1.js";

export type DatTransformKind =
  | "ROTATE_90"
  | "ROTATE_180"
  | "ROTATE_270"
  | "FLIP_H"
  | "FLIP_V"
  | "FLIP_DIAG_NWSE"
  | "FLIP_DIAG_NESW";

type Corner = "NE" | "SE" | "SW" | "NW";
type Dir = "N" | "E" | "S" | "W";

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

function mapCorner(c: Corner, k: DatTransformKind): Corner {
  switch (k) {
    case "ROTATE_90":
      return c === "NE" ? "SE" : c === "SE" ? "SW" : c === "SW" ? "NW" : "NE";
    case "ROTATE_180":
      return c === "NE" ? "SW" : c === "SW" ? "NE" : c === "SE" ? "NW" : "SE";
    case "ROTATE_270":
      return c === "NE" ? "NW" : c === "NW" ? "SW" : c === "SW" ? "SE" : "NE";
    case "FLIP_H":
      return c === "NE" ? "NW" : c === "NW" ? "NE" : c === "SE" ? "SW" : "SE";
    case "FLIP_V":
      return c === "NE" ? "SE" : c === "SE" ? "NE" : c === "NW" ? "SW" : "NW";
    case "FLIP_DIAG_NWSE":
      return c === "NE" ? "SW" : c === "SW" ? "NE" : c;
    case "FLIP_DIAG_NESW":
      return c === "NW" ? "SE" : c === "SE" ? "NW" : c;
  }
}

function transformTileName(name: string, k: DatTransformKind): string {
  // suffix _N|_E|_S|_W
  {
    const m = /^(.*)_(N|E|S|W)$/.exec(name);
    if (m) {
      const prefix = m[1]!;
      const d = m[2]! as Dir;
      return `${prefix}_${mapDir(d, k)}`;
    }
  }
  // suffix _NE|_SE|_SW|_NW
  {
    const m = /^(.*)_(NE|SE|SW|NW)$/.exec(name);
    if (m) {
      const prefix = m[1]!;
      const c = m[2]! as Corner;
      return `${prefix}_${mapCorner(c, k)}`;
    }
  }
  return name;
}

function mapPos(x: number, y: number, k: DatTransformKind): { x: number; y: number } {
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

function mapIndex(idx: number, k: DatTransformKind): number {
  const x = idx % 32;
  const y = Math.floor(idx / 32);
  const p = mapPos(x, y, k);
  return p.y * 32 + p.x;
}

function transformLayer(layer: ReadonlyArray<string>, k: DatTransformKind): string[] {
  const out = new Array<string>(1024);
  for (let idx = 0; idx < 1024; idx++) {
    const t = layer[idx]!;
    const idx2 = mapIndex(idx, k);
    out[idx2] = transformTileName(t, k);
  }
  return out;
}

export function transformMap(map: DatMapJson, k: DatTransformKind): DatMapJson {
  return {
    width: 32,
    height: 32,
    top: transformLayer(map.top, k),
    bottom: transformLayer(map.bottom, k),
  };
}

export function transformLevelset(doc: DatLevelsetJsonV1, k: DatTransformKind): DatLevelsetJsonV1 {
  return {
    schema: doc.schema,
    magicNumber: doc.magicNumber,
    levels: doc.levels.map((lv) => ({
      ...lv,
      map: transformMap(lv.map, k),
      trapControls: lv.trapControls.map((t) => ({
        button: mapIndex(t.button, k),
        trap: mapIndex(t.trap, k),
        openOrShut: t.openOrShut,
      })),
      cloneControls: lv.cloneControls.map((c) => ({
        button: mapIndex(c.button, k),
        cloner: mapIndex(c.cloner, k),
      })),
      movement: lv.movement.map((p) => mapIndex(p, k)),
    })),
  };
}
