import { describe, expect, it } from "vitest";

import {
  decodeTwsBytes,
  encodeTwsBytes,
  mergeTwsFiles,
  TWS_RULESET_LYNX,
  TWS_SIGNATURE,
  type TwsFile,
  type TwsLevelRecord,
} from "@/src/tws/twsCodec";

function asciiBytes(text: string): number[] {
  return [...text].map((ch) => ch.charCodeAt(0));
}

function levelRaw(number: number, password: string, extra: number[] = []): Uint8Array {
  return Uint8Array.of(number & 0xff, (number >>> 8) & 0xff, ...asciiBytes(password), ...extra);
}

function setNameRaw(name: string): Uint8Array {
  return Uint8Array.of(...new Array<number>(16).fill(0), ...asciiBytes(name), 0);
}

function makeFile(records: TwsFile["records"]): TwsFile {
  return {
    header: {
      signature: TWS_SIGNATURE,
      ruleset: TWS_RULESET_LYNX,
      currentLevel: 1,
      extraBytes: new Uint8Array(),
    },
    records,
  };
}

describe("TWS codec", () => {
  it("round-trips headers, set names, padding, and level records", () => {
    const original = makeFile([
      {
        kind: "setName",
        rawData: setNameRaw("CCLP5Voting"),
        name: "CCLP5Voting",
      },
      { kind: "padding" },
      {
        kind: "level",
        rawData: levelRaw(1, "ABCD"),
        levelNumber: 1,
        password: "ABCD",
      },
      {
        kind: "level",
        rawData: levelRaw(2, "EFGH", [0, 0, 0, 0, 25, 0, 0, 0, 1, 2]),
        levelNumber: 2,
        password: "EFGH",
      },
    ]);

    const reparsed = decodeTwsBytes(encodeTwsBytes(original));

    expect(reparsed.header).toEqual(original.header);
    expect(reparsed.records).toHaveLength(4);
    expect(reparsed.records[0]).toMatchObject({ kind: "setName", name: "CCLP5Voting" });
    expect(reparsed.records[1]).toEqual({ kind: "padding" });
    expect(reparsed.records[2]).toMatchObject({ kind: "level", levelNumber: 1, password: "ABCD" });
    expect(reparsed.records[3]).toMatchObject({ kind: "level", levelNumber: 2, password: "EFGH" });
  });

  it("merges level records by applying pack offsets", () => {
    const fileA = makeFile([
      {
        kind: "setName",
        rawData: setNameRaw("Pack A"),
        name: "Pack A",
      },
      {
        kind: "level",
        rawData: levelRaw(1, "ABCD"),
        levelNumber: 1,
        password: "ABCD",
      },
      {
        kind: "level",
        rawData: levelRaw(2, "EFGH"),
        levelNumber: 2,
        password: "EFGH",
      },
    ]);
    const fileAWithProgress: TwsFile = {
      ...fileA,
      header: {
        ...fileA.header,
        currentLevel: 2,
      },
    };
    const fileB = makeFile([
      {
        kind: "level",
        rawData: levelRaw(1, "IJKL"),
        levelNumber: 1,
        password: "IJKL",
      },
      {
        kind: "level",
        rawData: levelRaw(3, "MNOP"),
        levelNumber: 3,
        password: "MNOP",
      },
    ]);
    const fileBWithProgress: TwsFile = {
      ...fileB,
      header: {
        ...fileB.header,
        currentLevel: 3,
      },
    };

    const merged = mergeTwsFiles([
      { file: fileAWithProgress, levelCount: 2 },
      { file: fileBWithProgress, levelCount: 3 },
    ]);
    expect(merged.header.currentLevel).toBe(5);
    expect(merged.records[0]).toMatchObject({ kind: "setName", name: "Pack A" });
    const mergedLevels = merged.records.filter(
      (record): record is TwsLevelRecord => record.kind === "level",
    );

    expect(mergedLevels.map((record) => record.levelNumber)).toEqual([1, 2, 3, 5]);
    expect(mergedLevels.map((record) => record.password)).toEqual(["ABCD", "EFGH", "IJKL", "MNOP"]);

    const reparsed = decodeTwsBytes(encodeTwsBytes(merged));
    expect(
      reparsed.records
        .filter((record): record is TwsLevelRecord => record.kind === "level")
        .map((record) => record.levelNumber),
    ).toEqual([1, 2, 3, 5]);
  });

  it("stops at the EOF marker if present", () => {
    const base = encodeTwsBytes(
      makeFile([
        {
          kind: "level",
          rawData: levelRaw(1, "ABCD"),
          levelNumber: 1,
          password: "ABCD",
        },
      ]),
    );

    const bytes = Uint8Array.of(...base, 0xff, 0xff, 0xff, 0xff, 1, 2, 3, 4);
    const parsed = decodeTwsBytes(bytes);
    const levels = parsed.records.filter(
      (record): record is TwsLevelRecord => record.kind === "level",
    );

    expect(levels).toHaveLength(1);
    expect(levels[0]!.levelNumber).toBe(1);
  });
});
