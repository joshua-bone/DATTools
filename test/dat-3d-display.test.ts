import { describe, expect, it } from "vitest";

import { tileNameFromCode } from "../src/dat/cc1Tiles.js";
import {
  createDat3dDisplayLevel,
  getDat3dTileDisplayName,
  getDat3dTileSpriteName,
} from "../src/dat/dat3dDisplay.js";
import { DAT_3D_ELEVATOR_TILE } from "../src/dat/dat3dLevels.js";
import { DAT_3D_ELEVATOR_SPRITE_NAME } from "../src/dat/render/cc1SpriteSet.js";
import { createEmptyLevel } from "../web/src/levelEditing.js";

describe("3D display elevator rendering", () => {
  it("always treats tile 57 as elevator while 3D mode is enabled", () => {
    const context = {
      threeDEnabled: true,
      layerZ: 1,
      layerCount: 1,
    } as const;

    expect(DAT_3D_ELEVATOR_TILE).toBe(tileNameFromCode(57));
    expect(getDat3dTileDisplayName(DAT_3D_ELEVATOR_TILE, context)).toBe("ELEVATOR");
    expect(getDat3dTileSpriteName(DAT_3D_ELEVATOR_TILE, context)).toBe(DAT_3D_ELEVATOR_SPRITE_NAME);

    const level = {
      ...createEmptyLevel(1),
      map: {
        width: 32 as const,
        height: 32 as const,
        top: Array<string>(1024).fill(DAT_3D_ELEVATOR_TILE),
        bottom: Array<string>(1024).fill("FLOOR"),
      },
    };
    const displayLevel = createDat3dDisplayLevel(level, context);

    expect(displayLevel.map.top[0]).toBe(DAT_3D_ELEVATOR_SPRITE_NAME);
    expect(displayLevel.map.bottom[0]).toBe("FLOOR");
  });
});
