import { writeFileSync } from "node:fs";
import { encodeDatBytes } from "../src/dat/datCodec";
import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1";
import { createEmptyLevel, paintLevelCells } from "../web/src/levelEditing";

/** Reproduce with: npx tsx scripts/smartTeethAcceptanceFixture.ts --write */
export function createSmartTeethAcceptanceFixture(): DatLevelsetJsonV1 {
  let level = createEmptyLevel(1, {
    title: "Smart Teeth acceptance",
    author: "DATTools",
    password: "BRAI",
    hint: "Smart Teeth cross keys and plan around walls. The closest pursues; the others surround.",
    time: 200,
    chips: 0,
  });
  const walls: number[] = [];
  for (let y = 0; y <= 9; y++) walls.push(y * 32, y * 32 + 11);
  for (let x = 0; x <= 11; x++) walls.push(x, 9 * 32 + x);
  // The western actors must route around this barrier to approach Chip.
  for (let y = 2; y <= 5; y++) walls.push(y * 32 + 6);
  level = paintLevelCells(level, walls, "WALL");
  for (const [index, name] of [
    [104, "PLAYER_W"],
    [105, "EXIT"],
    [38, "BLUE_KEY"],
    [101, "RED_KEY"],
    [198, "GREEN_KEY"],
    [100, "SMART_TEETH_E"],
    [227, "SMART_TEETH_E"],
    // Four unobstructed steps to Chip make this the initial direct pursuer.
    [232, "SMART_TEETH_N"],
  ] as const) {
    level = paintLevelCells(level, [index], name);
  }
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [level, createCooperativeToggleLevel()],
  };
}

function createCooperativeToggleLevel() {
  let level = createEmptyLevel(2, {
    title: "Smart Teeth teamwork",
    author: "DATTools",
    password: "HELP",
    hint: "The southern Smart Teeth can open the toggle wall for its buddy, then wait safely.",
    time: 200,
    chips: 0,
  });
  level = paintLevelCells(
    level,
    Array.from({ length: 32 * 32 }, (_, index) => index),
    "WALL",
  );
  // These disconnected corridors require the helper to cooperate rather than pursue Chip itself.
  level = paintLevelCells(
    level,
    [98, 99, 100, 101, 102, 103, 104, 105, 106, 194, 195, 196],
    "FLOOR",
  );
  for (const [index, name] of [
    [102, "TOGGLE_WALL"],
    [105, "PLAYER_W"],
    [106, "EXIT"],
    [196, "GREEN_BUTTON"],
    [99, "SMART_TEETH_E"],
    [194, "SMART_TEETH_E"],
  ] as const) {
    level = paintLevelCells(level, [index], name);
  }
  return level;
}

if (process.argv.includes("--write")) {
  writeFileSync(
    new URL("../fixtures/dat/SMART_TEETH_ACCEPTANCE.dat", import.meta.url),
    encodeDatBytes(createSmartTeethAcceptanceFixture()),
  );
}
