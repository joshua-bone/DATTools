import { gunzipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { base64ToBytes } from "@/src/dat/base64";
import { decodeDatBytes } from "@/src/dat/datCodec";
import type { DatLevelJson, DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { buildTworldUrl } from "@/web/src/tworld";

function makeLevel(number: number, title: string, topTile = "FLOOR"): DatLevelJson {
  return {
    number,
    time: number * 10,
    chips: number,
    mapDetail: 1,
    title,
    map: {
      width: 32,
      height: 32,
      top: Array<string>(1024).fill(topTile),
      bottom: Array<string>(1024).fill("FLOOR"),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder: [3],
    extraFields: [],
  };
}

function makeDoc(levels: ReadonlyArray<DatLevelJson>): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels,
  };
}

function decodeUrlSafeBase64(value: string): Uint8Array {
  const padding = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  return base64ToBytes(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
}

describe("Tile World DAT export", () => {
  it("embeds the current DAT pack as a gzip-compressed hash payload", () => {
    const doc = makeDoc([makeLevel(1, "Alpha", "WALL"), makeLevel(2, "Beta", "CHIP")]);
    const url = new URL(buildTworldUrl(doc, 2, "MS", "MY_PACK.dat"));
    const encoded = url.hash.replace(/^#dat=/u, "");
    const decoded = decodeDatBytes(gunzipSync(decodeUrlSafeBase64(encoded)));

    expect(url.origin + url.pathname).toBe("https://joshua-bone.github.io/tworld/");
    expect(url.searchParams.get("level")).toBe("2");
    expect(url.searchParams.get("ruleset")).toBe("MS");
    expect(url.searchParams.get("slot")).toBe("MY_PACK.dat");
    expect(decoded).toEqual(doc);
  });

  it("supports Lynx launch URLs", () => {
    const doc = makeDoc([makeLevel(7, "Gamma", "ICE_NE")]);
    const url = new URL(buildTworldUrl(doc, 1, "Lynx", "3D_CHIPS.dat"));

    expect(url.searchParams.get("level")).toBe("1");
    expect(url.searchParams.get("ruleset")).toBe("Lynx");
    expect(url.searchParams.get("slot")).toBe("3D_CHIPS.dat");
  });
});
