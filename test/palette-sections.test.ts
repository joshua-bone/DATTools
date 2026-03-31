import { describe, expect, it } from "vitest";

import { getPaletteSections } from "@/web/src/paletteSections";

const DISPLAY_CONTEXT = {
  threeDEnabled: false,
  layerZ: 1,
  layerCount: 1,
} as const;

describe("palette sections", () => {
  it("places expanded tiles in a dedicated section at the bottom of the normal palette", () => {
    const sections = getPaletteSections({
      paletteTab: "normal",
      query: "",
      displayContext: DISPLAY_CONTEXT,
      threeDLevelsEnabled: false,
    });

    expect(sections.map((section) => section.title)).toEqual([null, "Expanded Tiles"]);
    expect(sections[0]?.tiles).not.toContain("UNKNOWN_0x70");
    expect(sections[1]?.tiles).toEqual([
      "UNKNOWN_0x70",
      "UNKNOWN_0x71",
      "UNKNOWN_0x72",
      "UNKNOWN_0x73",
      "UNKNOWN_0x74",
      "UNKNOWN_0x75",
    ]);
  });

  it("matches expanded tiles by their friendly display names", () => {
    const sections = getPaletteSections({
      paletteTab: "normal",
      query: "pet carrier",
      displayContext: DISPLAY_CONTEXT,
      threeDLevelsEnabled: false,
    });

    expect(sections).toEqual([
      {
        key: "expanded",
        title: "Expanded Tiles",
        tiles: ["UNKNOWN_0x75"],
      },
    ]);
  });
});
