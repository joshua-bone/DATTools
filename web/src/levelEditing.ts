import type { DatLevelsetJsonV1 } from "../../src/dat/datLevelsetJsonV1.js";

type DatLevel = DatLevelsetJsonV1["levels"][number];

const LEVEL_TILE_COUNT = 32 * 32;

function filledLayer(tile: string): string[] {
  return Array<string>(LEVEL_TILE_COUNT).fill(tile);
}

export function replaceSelectedLevel(
  doc: DatLevelsetJsonV1,
  selectedIndex: number,
  updater: (level: DatLevel) => DatLevel,
): DatLevelsetJsonV1 {
  return {
    ...doc,
    levels: doc.levels.map((level: DatLevel, index: number) =>
      index === selectedIndex ? updater(level) : level,
    ),
  };
}

export function clearLevel(level: DatLevel): DatLevel {
  return {
    ...level,
    chips: 0,
    map: {
      ...level.map,
      top: filledLayer("FLOOR"),
      bottom: filledLayer("FLOOR"),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
  };
}
