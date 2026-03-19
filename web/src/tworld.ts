import { gzipSync } from "fflate";

import { bytesToBase64 } from "@/src/dat/base64";
import { encodeDatBytes } from "@/src/dat/datCodec";
import type { DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";

function bytesToUrlSafeBase64(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function buildTworldUrl(
  doc: DatLevelsetJsonV1,
  level: number,
  ruleset: "MS" | "Lynx",
  slot: string,
): string {
  const compressed = gzipSync(encodeDatBytes(doc));
  const url = new URL("http://www.joshua-bone.github.io/tworld/");
  url.searchParams.set("level", String(level));
  url.searchParams.set("ruleset", ruleset);
  url.searchParams.set("slot", slot);
  url.hash = `dat=${bytesToUrlSafeBase64(compressed)}`;
  return url.toString();
}
