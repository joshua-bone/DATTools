import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { createMemeAcceptanceFixture } from "../scripts/memeAcceptanceFixture";
import { decodeDatBytes, encodeDatBytes } from "@/src/dat/datCodec";

describe("shared Meme acceptance DAT fixture", () => {
  it("reproduces the committed binary through real editor placement and DAT export", async () => {
    const bytes = new Uint8Array(
      await readFile(new URL("../fixtures/dat/MEME_ACCEPTANCE.dat", import.meta.url)),
    );
    expect(encodeDatBytes(createMemeAcceptanceFixture())).toEqual(bytes);
    const level = decodeDatBytes(bytes).levels[0]!;
    expect(level).toMatchObject({
      title: "Meme tiles acceptance",
      author: "DATTools",
      password: "MEME",
      hint: "A B",
    });
    expect(level.map.top.slice(33, 37)).toEqual([
      "PLAYER_E",
      "HINT_BOOTS",
      "RED_TANK_BUTTON_CW",
      "RED_TANK_BUTTON_CCW",
    ]);
    expect(level.movement).toEqual([330, 334, 458, 462, 338]);
    expect([330, 334, 458, 462].map((index) => level.map.top[index])).toEqual([
      "RED_TANK_N",
      "RED_TANK_W",
      "RED_TANK_S",
      "RED_TANK_E",
    ]);
    expect([330, 334, 458, 462].map((index) => level.map.bottom[index])).toEqual([
      "GRAVEL",
      "GRAVEL",
      "GRAVEL",
      "GRAVEL",
    ]);
  });
});
