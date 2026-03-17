import { zlibSync } from "fflate";

import { bytesToBase64 } from "../../src/dat/base64.js";
import { encodeDatBytes } from "../../src/dat/datCodec.js";
import { cloneDatLevel } from "../../src/dat/dat3dLevels.js";
import type { DatLevelJson, DatLevelsetJsonV1 } from "../../src/dat/datLevelsetJsonV1.js";

export const LEXYS_LABYRINTH_SHARED_LEVEL_FALLBACK_COUNT = 512;

function bytesToUrlSafeBase64(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function buildLexysLabyrinthSharedDat(
  doc: DatLevelsetJsonV1,
  level: DatLevelJson,
  fallbackCount = LEXYS_LABYRINTH_SHARED_LEVEL_FALLBACK_COUNT,
): Uint8Array {
  const levelCount = Math.max(fallbackCount, doc.levels.length);
  const levels: DatLevelJson[] = Array.from({ length: levelCount }, (_, index) => ({
    ...cloneDatLevel(level),
    number: index + 1,
  }));

  return encodeDatBytes({
    ...doc,
    levels,
  });
}

export function buildLexysLabyrinthSharedUrl(
  doc: DatLevelsetJsonV1,
  level: DatLevelJson,
  fallbackCount = LEXYS_LABYRINTH_SHARED_LEVEL_FALLBACK_COUNT,
): string {
  // Lexy's shared DAT loader reuses saved progress under a fixed "shared" identifier.
  // Repeat the selected level across a bounded range so any reused current_level still opens it.
  const compressed = zlibSync(buildLexysLabyrinthSharedDat(doc, level, fallbackCount));
  const url = new URL("https://c.eev.ee/lexys-labyrinth/");
  url.hash = `level=${bytesToUrlSafeBase64(compressed)}`;
  return url.toString();
}
