import { describe, expect, it } from "vitest";

import {
  decodeDatBytes,
  encodeDatBytes,
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
} from "dattools/dat";

function appendU16(bytes: number[], value: number): void {
  bytes.push(value & 0xff, (value >>> 8) & 0xff);
}

function appendU32(bytes: number[], value: number): void {
  appendU16(bytes, value & 0xffff);
  appendU16(bytes, (value >>> 16) & 0xffff);
}

function compressedFloorLayer(): number[] {
  return [0xff, 0xff, 0x00, 0xff, 0xff, 0x00, 0xff, 0xff, 0x00, 0xff, 0xff, 0x00, 0xff, 0x04, 0x00];
}

function datWithDistinctRepeatedFieldTwoOccurrences(): Uint8Array {
  const layer = compressedFloorLayer();
  const fields = [
    0x02,
    0x02,
    0x03,
    0x00, // valid chip-count override: 3
    0x03,
    0x02,
    0x58,
    0x00, // title: X
    0x02,
    0x01,
    0xff, // distinct short occurrence
  ];
  const level: number[] = [];
  appendU16(level, 1); // level number
  appendU16(level, 0); // time
  appendU16(level, 0); // chips
  appendU16(level, 1); // map detail
  appendU16(level, layer.length);
  level.push(...layer);
  appendU16(level, layer.length);
  level.push(...layer);
  appendU16(level, fields.length);
  level.push(...fields);

  const dat: number[] = [];
  appendU32(dat, 0x0002aaac);
  appendU16(dat, 1);
  appendU16(dat, level.length);
  dat.push(...level);
  return Uint8Array.from(dat);
}

describe("DAT ordered metadata occurrences", () => {
  it("round-trips distinct repeated unknown fields byte-identically through the public JSON API", () => {
    const original = datWithDistinctRepeatedFieldTwoOccurrences();
    const decoded = decodeDatBytes(original);
    const level = decoded.levels[0];

    expect(level?.fieldOrder).toEqual([2, 3, 2]);
    expect(level?.title).toBe("X");
    expect(level?.extraFields).toEqual([
      {
        field: 2,
        data: { encoding: "base64", dataBase64: "AwA=" },
      },
      {
        field: 2,
        data: { encoding: "base64", dataBase64: "/w==" },
      },
    ]);

    const reparsed = parseDatLevelsetJsonV1(
      JSON.parse(stringifyDatLevelsetJsonV1(decoded)) as unknown,
    );
    expect(reparsed).toEqual(decoded);
    expect(encodeDatBytes(reparsed)).toEqual(original);
  });

  it("emits every authored occurrence when field order is omitted", () => {
    const decoded = decodeDatBytes(datWithDistinctRepeatedFieldTwoOccurrences());
    const level = decoded.levels[0];
    expect(level).toBeDefined();
    if (!level) return;

    const authored = {
      ...decoded,
      levels: [{ ...level, fieldOrder: [] }],
    };
    const rebuilt = decodeDatBytes(encodeDatBytes(authored));

    expect(rebuilt.levels[0]?.fieldOrder).toEqual([3, 2, 2]);
    expect(rebuilt.levels[0]?.extraFields).toEqual(level.extraFields);
  });
});
