// src/dat/cc1Tiles.ts
//
// CC1 tile codes -> names (matches your Python Enum exactly).
// Used by DAT codec and CC1 spritesheet renderer.

const TILE_NAME_BY_CODE = new Map<number, string>([
  [0, "FLOOR"],
  [1, "WALL"],
  [2, "CHIP"],
  [3, "WATER"],
  [4, "FIRE"],
  [5, "INV_WALL_PERM"],
  [6, "PANEL_N"],
  [7, "PANEL_W"],
  [8, "PANEL_S"],
  [9, "PANEL_E"],
  [10, "BLOCK"],
  [11, "DIRT"],
  [12, "ICE"],
  [13, "FORCE_S"],
  [14, "CLONE_BLOCK_N"],
  [15, "CLONE_BLOCK_W"],
  [16, "CLONE_BLOCK_S"],
  [17, "CLONE_BLOCK_E"],
  [18, "FORCE_N"],
  [19, "FORCE_E"],
  [20, "FORCE_W"],
  [21, "EXIT"],
  [22, "BLUE_DOOR"],
  [23, "RED_DOOR"],
  [24, "GREEN_DOOR"],
  [25, "YELLOW_DOOR"],
  [26, "ICE_SE"],
  [27, "ICE_SW"],
  [28, "ICE_NW"],
  [29, "ICE_NE"],
  [30, "BLUE_WALL_FAKE"],
  [31, "BLUE_WALL_REAL"],
  [32, "NOT_USED_0"],
  [33, "THIEF"],
  [34, "SOCKET"],
  [35, "GREEN_BUTTON"],
  [36, "CLONE_BUTTON"],
  [37, "TOGGLE_WALL"],
  [38, "TOGGLE_FLOOR"],
  [39, "TRAP_BUTTON"],
  [40, "TANK_BUTTON"],
  [41, "TELEPORT"],
  [42, "BOMB"],
  [43, "TRAP"],
  [44, "INV_WALL_APP"],
  [45, "GRAVEL"],
  [46, "POP_UP_WALL"],
  [47, "HINT"],
  [48, "PANEL_SE"],
  [49, "CLONER"],
  [50, "FORCE_RANDOM"],
  [51, "DROWN_CHIP"],
  [52, "BURNED_CHIP0"],
  [53, "BURNED_CHIP1"],
  [54, "NOT_USED_1"],
  [55, "NOT_USED_2"],
  [56, "NOT_USED_3"],
  [57, "CHIP_EXIT"],
  [58, "UNUSED_EXIT_0"],
  [59, "UNUSED_EXIT_1"],
  [60, "CHIP_SWIMMING_N"],
  [61, "CHIP_SWIMMING_W"],
  [62, "CHIP_SWIMMING_S"],
  [63, "CHIP_SWIMMING_E"],
  [64, "ANT_N"],
  [65, "ANT_W"],
  [66, "ANT_S"],
  [67, "ANT_E"],
  [68, "FIREBALL_N"],
  [69, "FIREBALL_W"],
  [70, "FIREBALL_S"],
  [71, "FIREBALL_E"],
  [72, "BALL_N"],
  [73, "BALL_W"],
  [74, "BALL_S"],
  [75, "BALL_E"],
  [76, "TANK_N"],
  [77, "TANK_W"],
  [78, "TANK_S"],
  [79, "TANK_E"],
  [80, "GLIDER_N"],
  [81, "GLIDER_W"],
  [82, "GLIDER_S"],
  [83, "GLIDER_E"],
  [84, "TEETH_N"],
  [85, "TEETH_W"],
  [86, "TEETH_S"],
  [87, "TEETH_E"],
  [88, "WALKER_N"],
  [89, "WALKER_W"],
  [90, "WALKER_S"],
  [91, "WALKER_E"],
  [92, "BLOB_N"],
  [93, "BLOB_W"],
  [94, "BLOB_S"],
  [95, "BLOB_E"],
  [96, "PARAMECIUM_N"],
  [97, "PARAMECIUM_W"],
  [98, "PARAMECIUM_S"],
  [99, "PARAMECIUM_E"],
  [100, "BLUE_KEY"],
  [101, "RED_KEY"],
  [102, "GREEN_KEY"],
  [103, "YELLOW_KEY"],
  [104, "FLIPPERS"],
  [105, "FIRE_BOOTS"],
  [106, "SKATES"],
  [107, "SUCTION_BOOTS"],
  [108, "PLAYER_N"],
  [109, "PLAYER_W"],
  [110, "PLAYER_S"],
  [111, "PLAYER_E"],
]);

const TILE_CODE_BY_NAME = new Map<string, number>();
for (const [k, v] of TILE_NAME_BY_CODE.entries()) TILE_CODE_BY_NAME.set(v, k);

export const CC1_TILE_COUNT = 112;

export function tileNameFromCode(code: number): string {
  const name = TILE_NAME_BY_CODE.get(code);
  if (name) return name;
  return `UNKNOWN_0x${code.toString(16).padStart(2, "0").toUpperCase()}`;
}

export function tileCodeFromName(name: string): number {
  const known = TILE_CODE_BY_NAME.get(name);
  if (known !== undefined) return known;

  const m = /^UNKNOWN_0x([0-9A-Fa-f]{2})$/.exec(name);
  if (m) return parseInt(m[1]!, 16);

  throw new Error(`Unknown tile name '${name}' (expected known name or UNKNOWN_0xNN)`);
}
