import { BinaryReader, BinaryWriter } from "@/src/dat/binary";

export const TWS_SIGNATURE = 0x999b3335;
export const TWS_RULESET_LYNX = 1;
export const TWS_RULESET_MS = 2;
const TWS_EOF_MARKER = 0xffffffff;

export type TwsHeader = Readonly<{
  signature: number;
  ruleset: number;
  currentLevel: number;
  extraBytes: Uint8Array;
}>;

export type TwsPaddingRecord = Readonly<{
  kind: "padding";
}>;

export type TwsSetNameRecord = Readonly<{
  kind: "setName";
  rawData: Uint8Array;
  name: string;
}>;

export type TwsLevelRecord = Readonly<{
  kind: "level";
  rawData: Uint8Array;
  levelNumber: number;
  password: string;
}>;

export type TwsRecord = TwsPaddingRecord | TwsSetNameRecord | TwsLevelRecord;

export type TwsFile = Readonly<{
  header: TwsHeader;
  records: ReadonlyArray<TwsRecord>;
}>;

export type TwsMergeInput = Readonly<{
  file: TwsFile;
  levelCount: number;
}>;

function isValidCurrentLevel(currentLevel: number, levelCount: number): boolean {
  return Number.isInteger(currentLevel) && currentLevel >= 1 && currentLevel <= levelCount;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function decodeAscii(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += String.fromCharCode(byte);
  return out;
}

function isSetNameRecord(data: Uint8Array): boolean {
  if (data.length < 16) return false;
  for (let i = 0; i < 6; i++) {
    if (data[i] !== 0) return false;
  }
  return true;
}

function decodeZeroTerminatedAscii(bytes: Uint8Array): string {
  let end = 0;
  while (end < bytes.length && bytes[end] !== 0) end += 1;
  return decodeAscii(bytes.subarray(0, end));
}

function cloneBytes(bytes: Uint8Array): Uint8Array {
  return new Uint8Array(bytes);
}

function cloneRecord(record: TwsRecord): TwsRecord {
  if (record.kind === "padding") return record;
  if (record.kind === "setName") {
    return {
      ...record,
      rawData: cloneBytes(record.rawData),
    };
  }
  return {
    ...record,
    rawData: cloneBytes(record.rawData),
  };
}

function cloneLevelRecord(record: TwsLevelRecord): TwsLevelRecord {
  return {
    ...record,
    rawData: cloneBytes(record.rawData),
  };
}

function cloneHeader(header: TwsHeader): TwsHeader {
  return {
    ...header,
    extraBytes: cloneBytes(header.extraBytes),
  };
}

export function decodeTwsBytes(bytes: Uint8Array): TwsFile {
  const reader = new BinaryReader(bytes);
  const signature = reader.readU32LE();
  if (signature !== TWS_SIGNATURE) {
    throw new Error(`Invalid TWS signature: 0x${signature.toString(16)}`);
  }

  const ruleset = reader.readU8();
  const currentLevel = reader.readU16LE();
  const extraByteCount = reader.readU8();
  const extraBytes = cloneBytes(reader.readBytes(extraByteCount));

  const records: TwsRecord[] = [];
  while (reader.remaining() > 0) {
    if (reader.remaining() < 4) throw new Error("Invalid TWS file: truncated record length");

    const size = reader.readU32LE();
    if (size === TWS_EOF_MARKER) break;
    if (size === 0) {
      records.push({ kind: "padding" });
      continue;
    }

    const data = cloneBytes(reader.readBytes(size));
    if (data.length < 6 || (data.length < 16 && data.length !== 6)) {
      throw new Error(`Invalid TWS record length: ${data.length}`);
    }

    if (isSetNameRecord(data)) {
      records.push({
        kind: "setName",
        rawData: data,
        name: decodeZeroTerminatedAscii(data.subarray(16)),
      });
      continue;
    }

    records.push({
      kind: "level",
      rawData: data,
      levelNumber: data[0]! | (data[1]! << 8),
      password: decodeAscii(data.subarray(2, 6)),
    });
  }

  return {
    header: { signature, ruleset, currentLevel, extraBytes },
    records,
  };
}

export function encodeTwsBytes(file: TwsFile): Uint8Array {
  const writer = new BinaryWriter();

  writer.writeU32LE(file.header.signature);
  writer.writeU8(file.header.ruleset);
  writer.writeU16LE(file.header.currentLevel);
  writer.writeU8(file.header.extraBytes.length);
  writer.writeBytes(file.header.extraBytes);

  for (const record of file.records) {
    if (record.kind === "padding") {
      writer.writeU32LE(0);
      continue;
    }

    const data = cloneBytes(record.rawData);
    if (record.kind === "level") {
      data[0] = record.levelNumber & 0xff;
      data[1] = (record.levelNumber >>> 8) & 0xff;
    }

    writer.writeU32LE(data.length);
    writer.writeBytes(data);
  }

  return writer.toBytes();
}

export function mergeTwsFiles(inputs: ReadonlyArray<TwsMergeInput>): TwsFile {
  if (inputs.length === 0) throw new Error("At least one TWS file is required");

  const header = cloneHeader(inputs[0]!.file.header);
  const records: TwsRecord[] = [];
  let levelOffset = 0;
  let mergedCurrentLevel = 0;
  let setNameRecord: TwsSetNameRecord | null = null;

  for (const input of inputs) {
    const { file, levelCount } = input;

    if (file.header.signature !== header.signature) {
      throw new Error("TWS signature mismatch");
    }
    if (file.header.ruleset !== header.ruleset) {
      throw new Error("TWS ruleset mismatch");
    }
    if (!bytesEqual(file.header.extraBytes, header.extraBytes)) {
      throw new Error("TWS header extra bytes mismatch");
    }
    if (isValidCurrentLevel(file.header.currentLevel, levelCount)) {
      mergedCurrentLevel = Math.max(mergedCurrentLevel, levelOffset + file.header.currentLevel);
    }

    for (const record of file.records) {
      if (record.kind === "setName") {
        if (!setNameRecord) setNameRecord = cloneRecord(record) as TwsSetNameRecord;
        continue;
      }
      if (record.kind !== "level") continue;
      if (record.levelNumber < 1 || record.levelNumber > levelCount) {
        throw new Error(`TWS level number ${record.levelNumber} is outside 1..${levelCount}`);
      }

      records.push({
        ...cloneLevelRecord(record),
        levelNumber: levelOffset + record.levelNumber,
      });
    }

    levelOffset += levelCount;
  }

  const mergedRecords = setNameRecord ? [setNameRecord, ...records] : records;

  return {
    header: {
      ...header,
      currentLevel: mergedCurrentLevel,
    },
    records: mergedRecords,
  };
}
