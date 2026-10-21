export const CC1_MEME_TILE_DISPLAY_NAMES = {
  HINT_BOOTS: "Hint Boots",
  RED_TANK_N: "Red Tank (North)",
  RED_TANK_W: "Red Tank (West)",
  RED_TANK_S: "Red Tank (South)",
  RED_TANK_E: "Red Tank (East)",
  RED_TANK_BUTTON_CW: "Red Tank Button (Clockwise)",
  RED_TANK_BUTTON_CCW: "Red Tank Button (Counterclockwise)",
  SMART_TEETH_N: "Smart Teeth (North)",
  SMART_TEETH_W: "Smart Teeth (West)",
  SMART_TEETH_S: "Smart Teeth (South)",
  SMART_TEETH_E: "Smart Teeth (East)",
} as const;

export const CC1_MEME_TILE_NAMES = Object.keys(CC1_MEME_TILE_DISPLAY_NAMES) as Array<
  keyof typeof CC1_MEME_TILE_DISPLAY_NAMES
>;

export const CC1_MEME_TILE_FIRST_CODE = 0x76;
export const CC1_RED_TANK_TILE_NAMES = CC1_MEME_TILE_NAMES.slice(1, 5);
export const CC1_SMART_TEETH_TILE_NAMES = CC1_MEME_TILE_NAMES.slice(7, 11);
export const CC1_MEME_ACTOR_TILE_NAMES = [
  ...CC1_RED_TANK_TILE_NAMES,
  ...CC1_SMART_TEETH_TILE_NAMES,
];

export function normalizeMemeTileName(name: string): string {
  const alias = /^UNKNOWN_0x([0-9A-Fa-f]{2})$/.exec(name);
  if (!alias) return name;
  return CC1_MEME_TILE_NAMES[parseInt(alias[1]!, 16) - CC1_MEME_TILE_FIRST_CODE] ?? name;
}
