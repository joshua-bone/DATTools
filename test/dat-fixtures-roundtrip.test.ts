import { describe, expect, it } from "vitest";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import { decodeDatBytes, encodeDatBytes } from "../src/dat/datCodec.js";
import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
} from "../src/dat/datLevelsetJsonV1.js";

const FIXTURES_DIR = path.resolve(process.cwd(), "fixtures", "dat");

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

describe("DAT fixtures: binary <-> JSON round-trip", () => {
  it("binary -> JSON -> binary is byte-identical for all fixtures", async () => {
    const entries = await readdir(FIXTURES_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".dat"))
      .map((e) => e.name)
      .sort();

    expect(files.length).toBeGreaterThan(0);

    for (const name of files) {
      const full = path.join(FIXTURES_DIR, name);
      const original = new Uint8Array(await readFile(full));

      const doc = decodeDatBytes(original);

      // Match real pipeline: stringify -> JSON.parse -> parseDatLevelsetJsonV1
      const text = stringifyDatLevelsetJsonV1(doc);
      const reparsed = parseDatLevelsetJsonV1(JSON.parse(text) as unknown);

      const rebuilt = encodeDatBytes(reparsed);

      expect(bytesEqual(rebuilt, original), `${name}: byte-identical`).toBe(true);
    }
  });
});
