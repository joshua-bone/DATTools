import { describe, expect, it } from "vitest";

import * as dat from "dattools/dat";
import type { DatLevelsetJsonV1 } from "dattools/dat";

function makeDocument(): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [
      {
        number: 1,
        time: 0,
        chips: 0,
        mapDetail: 1,
        title: "Public DAT API",
        hint: "Round-trip this level.",
        map: {
          width: 32,
          height: 32,
          top: Array.from({ length: 1024 }, (_, index) => (index === 33 ? "PLAYER_N" : "FLOOR")),
          bottom: Array.from({ length: 1024 }, () => "FLOOR"),
        },
        trapControls: [],
        cloneControls: [],
        movement: [33],
        fieldOrder: [],
        extraFields: [],
      },
    ],
  };
}

describe("public DAT package facade", () => {
  it("keeps the runtime surface intentionally narrow", () => {
    expect(Object.keys(dat).sort()).toEqual([
      "decodeDatBytes",
      "encodeDatBytes",
      "parseDatLevelsetJsonV1",
      "stringifyDatLevelsetJsonV1",
    ]);
  });

  it("round-trips binary and canonical JSON through the supported exports", () => {
    const source = makeDocument();
    const bytes = dat.encodeDatBytes(source);
    const decoded = dat.decodeDatBytes(bytes);
    const reparsed = dat.parseDatLevelsetJsonV1(
      JSON.parse(dat.stringifyDatLevelsetJsonV1(decoded)) as unknown,
    );

    expect(reparsed).toEqual(decoded);
    expect(dat.encodeDatBytes(reparsed)).toEqual(bytes);
    expect(decoded.levels[0]?.title).toBe("Public DAT API");
  });
});
