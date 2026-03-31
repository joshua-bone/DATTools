export const CC1_EXPANDED_TILE_DISPLAY_NAMES = {
  UNKNOWN_0x70: "Sandbag",
  UNKNOWN_0x71: "Bowling Ball",
  UNKNOWN_0x72: "Cloud",
  UNKNOWN_0x73: "Hook",
  UNKNOWN_0x74: "Ice Block",
  UNKNOWN_0x75: "Pet Carrier",
} as const;

export const CC1_EXPANDED_TILE_NAMES = Object.keys(CC1_EXPANDED_TILE_DISPLAY_NAMES) as Array<
  keyof typeof CC1_EXPANDED_TILE_DISPLAY_NAMES
>;
