import { describe, expect, it } from "vitest";

import { rotateDirectionalTileName } from "@/src/dat/cc1Tiles";

describe("rotateDirectionalTileName", () => {
  it("rotates orthogonal directional tiles", () => {
    expect(rotateDirectionalTileName("ANT_N", "counterclockwise")).toBe("ANT_W");
    expect(rotateDirectionalTileName("ANT_N", "clockwise")).toBe("ANT_E");
    expect(rotateDirectionalTileName("FORCE_W", "clockwise")).toBe("FORCE_N");
  });

  it("rotates diagonal directional tiles", () => {
    expect(rotateDirectionalTileName("ICE_NE", "counterclockwise")).toBe("ICE_NW");
    expect(rotateDirectionalTileName("ICE_NE", "clockwise")).toBe("ICE_SE");
  });

  it("skips tiles without rotational analogues", () => {
    expect(rotateDirectionalTileName("PANEL_SE", "clockwise")).toBeNull();
    expect(rotateDirectionalTileName("WALL", "clockwise")).toBeNull();
  });
});
