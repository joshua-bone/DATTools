import { describe, expect, it } from "vitest";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import { decodeDatBytes, encodeDatBytes } from "../src/dat/datCodec.js";
import { transformLevelset } from "../src/dat/datTransforms.js";

const FIXTURES_DIR = path.resolve(process.cwd(), "fixtures", "dat");

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function applyN<T>(x: T, n: number, f: (v: T) => T): T {
  let cur = x;
  for (let i = 0; i < n; i++) cur = f(cur);
  return cur;
}

describe("DAT fixtures: transform group laws on binary output", () => {
  it("rotate^4 and flip^2 return original bytes for each fixture", async () => {
    const entries = await readdir(FIXTURES_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".dat"))
      .map((e) => e.name)
      .sort();

    if (files.length === 0) return;

    for (const name of files) {
      const full = path.join(FIXTURES_DIR, name);
      const original = new Uint8Array(await readFile(full));
      const doc = decodeDatBytes(original);

      const r90 = applyN(doc, 4, (d) => transformLevelset(d, "ROTATE_90"));
      expect(bytesEqual(encodeDatBytes(r90), original), `${name}: rot90^4`).toBe(true);

      const r180 = applyN(doc, 2, (d) => transformLevelset(d, "ROTATE_180"));
      expect(bytesEqual(encodeDatBytes(r180), original), `${name}: rot180^2`).toBe(true);

      const fh = applyN(doc, 2, (d) => transformLevelset(d, "FLIP_H"));
      expect(bytesEqual(encodeDatBytes(fh), original), `${name}: flipH^2`).toBe(true);

      const fv = applyN(doc, 2, (d) => transformLevelset(d, "FLIP_V"));
      expect(bytesEqual(encodeDatBytes(fv), original), `${name}: flipV^2`).toBe(true);

      const d1 = applyN(doc, 2, (d) => transformLevelset(d, "FLIP_DIAG_NWSE"));
      expect(bytesEqual(encodeDatBytes(d1), original), `${name}: diagNWSE^2`).toBe(true);

      const d2 = applyN(doc, 2, (d) => transformLevelset(d, "FLIP_DIAG_NESW"));
      expect(bytesEqual(encodeDatBytes(d2), original), `${name}: diagNESW^2`).toBe(true);
    }
  });
});
