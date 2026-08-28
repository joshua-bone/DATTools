export type Base64Blob = Readonly<{
  encoding: "base64";
  dataBase64: string;
}>;

export type DatLayer = ReadonlyArray<string>;

export type DatMapJson = Readonly<{
  width: 32;
  height: 32;
  top: DatLayer;
  bottom: DatLayer;
}>;

export type TrapControl = Readonly<{
  button: number;
  trap: number;
  openOrShut: number;
}>;

export type CloneControl = Readonly<{
  button: number;
  cloner: number;
}>;

export type DatExtraField = Readonly<{
  field: number;
  data: Base64Blob; // one raw occurrence; repeated field IDs remain distinct
}>;

export type DatLevelJson = Readonly<{
  number: number;
  time: number;
  chips: number;
  mapDetail: number;
  title?: string;
  author?: string;
  hint?: string;
  password?: string;
  map: DatMapJson;
  trapControls: ReadonlyArray<TrapControl>;
  cloneControls: ReadonlyArray<CloneControl>;
  movement: ReadonlyArray<number>;
  fieldOrder: ReadonlyArray<number>; // every metadata field ID in encountered order
  extraFields: ReadonlyArray<DatExtraField>; // unknown occurrences in encountered order, including repeats
}>;

export type DatLevelsetJsonV1 = Readonly<{
  schema: "datTools.dat.levelset.json.v1";
  magicNumber: number;
  levels: ReadonlyArray<DatLevelJson>;
}>;

export declare function decodeDatBytes(dat: Uint8Array): DatLevelsetJsonV1;
export declare function encodeDatBytes(doc: DatLevelsetJsonV1): Uint8Array;
export declare function parseDatLevelsetJsonV1(input: unknown): DatLevelsetJsonV1;
export declare function stringifyDatLevelsetJsonV1(doc: DatLevelsetJsonV1): string;
