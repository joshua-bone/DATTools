// src/dat/datLevelsetJsonV1.ts
export type Base64Blob = Readonly<{
  encoding: "base64";
  dataBase64: string;
}>;

export type DatLayer = ReadonlyArray<string>; // 1024 tile names, e.g. "FLOOR", "ANT_N", "UNKNOWN_0xFE"

export type DatMapJson = Readonly<{
  width: 32;
  height: 32;
  top: DatLayer;
  bottom: DatLayer;
}>;

export type TrapControl = Readonly<{
  button: number; // 0..1023 (y*32+x)
  trap: number; // 0..1023 (y*32+x)
  openOrShut: number; // u16
}>;

export type CloneControl = Readonly<{
  button: number; // 0..1023
  cloner: number; // 0..1023
}>;

export type DatExtraField = Readonly<{
  field: number; // u8
  data: Base64Blob;
}>;

export type DatLevelJson = Readonly<{
  number: number; // u16
  time: number; // u16
  chips: number; // u16
  mapDetail: number; // u16

  title?: string;
  author?: string;
  hint?: string;
  password?: string; // decrypted plaintext

  map: DatMapJson;

  trapControls: ReadonlyArray<TrapControl>;
  cloneControls: ReadonlyArray<CloneControl>;
  movement: ReadonlyArray<number>; // indices 0..1023

  fieldOrder: ReadonlyArray<number>; // u8s in encountered order
  extraFields: ReadonlyArray<DatExtraField>;
}>;

export type DatLevelsetJsonV1 = Readonly<{
  schema: "datTools.dat.levelset.json.v1";
  magicNumber: number; // u32
  levels: ReadonlyArray<DatLevelJson>;
}>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseU8(v: unknown, path: string): number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > 0xff)
    throw new Error(`Invalid ${path}: expected u8`);
  return v;
}

function parseU16(v: unknown, path: string): number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > 0xffff)
    throw new Error(`Invalid ${path}: expected u16`);
  return v;
}

function parseU32(v: unknown, path: string): number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > 0xffffffff)
    throw new Error(`Invalid ${path}: expected u32`);
  return v;
}

function parseIndex(v: unknown, path: string): number {
  const n = parseU16(v, path);
  if (n < 0 || n > 1023) throw new Error(`Invalid ${path}: expected 0..1023`);
  return n;
}

function parseStringOpt(v: unknown, path: string): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "string") throw new Error(`Invalid ${path}: expected string`);
  return v;
}

function parseBase64Blob(v: unknown, path: string): Base64Blob {
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected object`);
  if (v.encoding !== "base64") throw new Error(`Invalid ${path}.encoding: expected "base64"`);
  if (typeof v.dataBase64 !== "string")
    throw new Error(`Invalid ${path}.dataBase64: expected string`);
  return { encoding: "base64", dataBase64: v.dataBase64 };
}

function parseLayer(v: unknown, path: string): DatLayer {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  if (v.length !== 1024) throw new Error(`Invalid ${path}: expected length 1024`);
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string") throw new Error(`Invalid ${path}[${i}]: expected string`);
  }
  return v as string[];
}

function parseMap(v: unknown, path: string): DatMapJson {
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected object`);
  if (v.width !== 32) throw new Error(`Invalid ${path}.width: expected 32`);
  if (v.height !== 32) throw new Error(`Invalid ${path}.height: expected 32`);
  const top = parseLayer(v.top, `${path}.top`);
  const bottom = parseLayer(v.bottom, `${path}.bottom`);
  return { width: 32, height: 32, top, bottom };
}

function parseTrapControls(v: unknown, path: string): TrapControl[] {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  return v.map((item, i) => {
    if (!isRecord(item)) throw new Error(`Invalid ${path}[${i}]: expected object`);
    return {
      button: parseIndex(item.button, `${path}[${i}].button`),
      trap: parseIndex(item.trap, `${path}[${i}].trap`),
      openOrShut: parseU16(item.openOrShut, `${path}[${i}].openOrShut`),
    };
  });
}

function parseCloneControls(v: unknown, path: string): CloneControl[] {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  return v.map((item, i) => {
    if (!isRecord(item)) throw new Error(`Invalid ${path}[${i}]: expected object`);
    return {
      button: parseIndex(item.button, `${path}[${i}].button`),
      cloner: parseIndex(item.cloner, `${path}[${i}].cloner`),
    };
  });
}

function parseMovement(v: unknown, path: string): number[] {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  return v.map((n, i) => parseIndex(n, `${path}[${i}]`));
}

function parseFieldOrder(v: unknown, path: string): number[] {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  return v.map((n, i) => parseU8(n, `${path}[${i}]`));
}

function parseExtraFields(v: unknown, path: string): DatExtraField[] {
  if (!Array.isArray(v)) throw new Error(`Invalid ${path}: expected array`);
  return v.map((item, i) => {
    if (!isRecord(item)) throw new Error(`Invalid ${path}[${i}]: expected object`);
    return {
      field: parseU8(item.field, `${path}[${i}].field`),
      data: parseBase64Blob(item.data, `${path}[${i}].data`),
    };
  });
}

function parseLevel(v: unknown, path: string): DatLevelJson {
  if (!isRecord(v)) throw new Error(`Invalid ${path}: expected object`);

  const level: DatLevelJson = {
    number: parseU16(v.number, `${path}.number`),
    time: parseU16(v.time, `${path}.time`),
    chips: parseU16(v.chips, `${path}.chips`),
    mapDetail: parseU16(v.mapDetail, `${path}.mapDetail`),

    map: parseMap(v.map, `${path}.map`),

    trapControls: parseTrapControls(v.trapControls ?? [], `${path}.trapControls`),
    cloneControls: parseCloneControls(v.cloneControls ?? [], `${path}.cloneControls`),
    movement: parseMovement(v.movement ?? [], `${path}.movement`),

    fieldOrder: parseFieldOrder(v.fieldOrder ?? [], `${path}.fieldOrder`),
    extraFields: parseExtraFields(v.extraFields ?? [], `${path}.extraFields`),
  };

  const title = parseStringOpt(v.title, `${path}.title`);
  if (title !== undefined) (level as { title: string }).title = title;

  const author = parseStringOpt(v.author, `${path}.author`);
  if (author !== undefined) (level as { author: string }).author = author;

  const hint = parseStringOpt(v.hint, `${path}.hint`);
  if (hint !== undefined) (level as { hint: string }).hint = hint;

  const password = parseStringOpt(v.password, `${path}.password`);
  if (password !== undefined) (level as { password: string }).password = password;

  return level;

  return level;
}

export function parseDatLevelsetJsonV1(input: unknown): DatLevelsetJsonV1 {
  if (!isRecord(input)) throw new Error("Invalid JSON: expected object");
  if (input.schema !== "datTools.dat.levelset.json.v1") throw new Error("Invalid schema");

  const magicNumber = parseU32(input.magicNumber, "magicNumber");

  const levelsV = input.levels;
  if (!Array.isArray(levelsV)) throw new Error("Invalid levels: expected array");

  const levels = levelsV.map((lv, i) => parseLevel(lv, `levels[${i}]`));

  return { schema: "datTools.dat.levelset.json.v1", magicNumber, levels };
}

export function stringifyDatLevelsetJsonV1(doc: DatLevelsetJsonV1): string {
  return JSON.stringify(doc, null, 2) + "\n";
}
