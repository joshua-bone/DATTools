import { writeFileSync } from "node:fs";
import { encodeDatBytes } from "../src/dat/datCodec";
import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1";
import { createEmptyLevel, paintLevelCells } from "../web/src/levelEditing";

/** Reproduce with: npx tsx scripts/memeAcceptanceFixture.ts --write */
export function createMemeAcceptanceFixture(): DatLevelsetJsonV1 {
  let level = createEmptyLevel(1, {
    title: "Meme tiles acceptance",
    author: "DATTools",
    password: "MEME",
    hint: "A B",
    time: 200,
    chips: 0,
  });
  level = paintLevelCells(level, [33], "PLAYER_E");
  level = paintLevelCells(level, [34], "HINT_BOOTS");
  level = paintLevelCells(level, [35], "RED_TANK_BUTTON_CW");
  level = paintLevelCells(level, [36], "RED_TANK_BUTTON_CCW");
  level = paintLevelCells(level, [40], "EXIT");
  for (const [index, name] of [
    [330, "RED_TANK_N"],
    [334, "RED_TANK_W"],
    [458, "RED_TANK_S"],
    [462, "RED_TANK_E"],
    [338, "TANK_E"],
  ] as const) {
    level = paintLevelCells(level, [index - 32, index - 1, index + 1, index + 32], "WALL");
    level = paintLevelCells(level, [index], "GRAVEL");
    level = paintLevelCells(level, [index], name);
  }
  return { schema: "datTools.dat.levelset.json.v1", magicNumber: 0x0002aaac, levels: [level] };
}

if (process.argv.includes("--write")) {
  writeFileSync(
    new URL("../fixtures/dat/MEME_ACCEPTANCE.dat", import.meta.url),
    encodeDatBytes(createMemeAcceptanceFixture()),
  );
}
