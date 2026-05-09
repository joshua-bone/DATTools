import { describe, expect, it } from "vitest";

import {
  DAT_3D_AIR_TILE,
  DAT_3D_CLOUD_TILE,
  DAT_3D_FULL_CELL_TERRAIN_TILES,
  DAT_3D_TERRAIN_BOTTOM_OVERRIDES,
  DAT_3D_VALID_TERRAIN_TILES,
  getDat3dPaintTile,
} from "@/src/dat/dat3dLevels";
import type { DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import {
  classifyTilePlacement,
  clearLevel,
  commitLevelsetEvent,
  connectLevelButtons,
  countChipsInLevel,
  copyLevelRegion,
  createEmptyLevel,
  createRandomLevelPassword,
  createLevelsetEditorHistory,
  extendPaintStroke,
  fillLevelArea,
  getInvalidCellIndices,
  isConnectionEndpointCell,
  paintLevelCells,
  paintLevelLine,
  pasteLevelRegion,
  moveLevelRegion,
  previewPaintLevelCells,
  redoLevelsetEvent,
  selectLevelInHistory,
  shiftLevelWrap,
  transformLevelClipboard,
  undoLevelsetEvent,
} from "@/web/src/levelEditing";

function makeDoc(): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [createEmptyLevel(1, { title: "One" }), createEmptyLevel(2, { title: "Two" })],
  };
}

describe("level editing helpers", () => {
  it("clearLevel resets gameplay state while preserving metadata", () => {
    const level = {
      ...createEmptyLevel(1, {
        title: "One",
        author: "Author",
        password: "ABCD",
        hint: "Hint",
        time: 100,
        chips: 7,
        mapDetail: 2,
      }),
      map: {
        width: 32 as const,
        height: 32 as const,
        top: Array<string>(1024).fill("CHIP"),
        bottom: Array<string>(1024).fill("WALL"),
      },
      trapControls: [{ button: 1, trap: 2, openOrShut: 0 }],
      cloneControls: [{ button: 3, cloner: 4 }],
      movement: [5, 6],
    };

    const cleared = clearLevel(level);

    expect(cleared.title).toBe("One");
    expect(cleared.author).toBe("Author");
    expect(cleared.password).toBe("ABCD");
    expect(cleared.hint).toBe("Hint");
    expect(cleared.time).toBe(100);
    expect(cleared.mapDetail).toBe(2);
    expect(cleared.chips).toBe(0);
    expect(new Set(cleared.map.top)).toEqual(new Set(["FLOOR"]));
    expect(new Set(cleared.map.bottom)).toEqual(new Set(["FLOOR"]));
    expect(cleared.trapControls).toEqual([]);
    expect(cleared.cloneControls).toEqual([]);
    expect(cleared.movement).toEqual([]);
  });

  it("routes terrain and actors into valid CC1 layer stacks", () => {
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0], "WALL");
    expect(level.map.top[0]).toBe("WALL");
    expect(level.map.bottom[0]).toBe("FLOOR");
    expect(level.movement).toEqual([]);

    level = paintLevelCells(level, [0], "ANT_N");
    expect(level.map.top[0]).toBe("ANT_N");
    expect(level.map.bottom[0]).toBe("WALL");
    expect(level.movement).toEqual([0]);

    level = paintLevelCells(level, [0], "WATER");
    expect(level.map.top[0]).toBe("WATER");
    expect(level.map.bottom[0]).toBe("FLOOR");
    expect(level.movement).toEqual([]);

    level = paintLevelCells(level, [1], "WALL");
    level = paintLevelCells(level, [1], "UNKNOWN_0x70");
    expect(level.map.top[1]).toBe("UNKNOWN_0x70");
    expect(level.map.bottom[1]).toBe("WALL");
    expect(level.movement).toEqual([]);

    level = paintLevelCells(level, [2], "UNKNOWN_0x73");
    expect(level.map.top[2]).toBe("UNKNOWN_0x73");
    expect(level.map.bottom[2]).toBe("FLOOR");
    expect(level.movement).toEqual([]);

    level = paintLevelCells(level, [3], "UNKNOWN_0x74");
    expect(level.map.top[3]).toBe("UNKNOWN_0x74");
    expect(level.map.bottom[3]).toBe("FLOOR");
    expect(level.movement).toEqual([]);

    level = paintLevelCells(level, [4], "UNKNOWN_0x75");
    expect(level.map.top[4]).toBe("UNKNOWN_0x75");
    expect(level.map.bottom[4]).toBe("FLOOR");
    expect(level.movement).toEqual([]);
  });

  it("tracks monster movement order while painting and erasing", () => {
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0, 1], "ANT_E");
    expect(level.movement).toEqual([0, 1]);

    level = paintLevelCells(level, [0], "WALL");
    expect(level.movement).toEqual([1]);

    level = paintLevelCells(level, [0], "BALL_S");
    expect(level.movement).toEqual([1, 0]);
  });

  it("supports line paint and terrain-aware bucket fill", () => {
    let level = createEmptyLevel(1);

    level = paintLevelLine(level, { x: 0, y: 0 }, { x: 0, y: 2 }, "WALL");
    level = fillLevelArea(level, { x: 1, y: 1 }, "WATER");

    expect(level.map.top[0]).toBe("WALL");
    expect(level.map.top[32]).toBe("WALL");
    expect(level.map.top[64]).toBe("WALL");
    expect(level.map.top[33]).toBe("WATER");
    expect(level.map.top[34]).toBe("WATER");
    expect(level.map.top[1]).toBe("WATER");
  });

  it("extends paint strokes without re-adding existing cells", () => {
    const first = extendPaintStroke([0], { x: 0, y: 0 }, { x: 0, y: 2 });
    expect(first.cells).toEqual([0, 32, 64]);
    expect(first.dirtyCells).toEqual([32, 64]);
    expect(first.lastPoint).toEqual({ x: 0, y: 2 });

    const second = extendPaintStroke(first.cells, first.lastPoint, { x: 0, y: 0 });
    expect(second.cells).toEqual([0, 32, 64]);
    expect(second.dirtyCells).toEqual([]);
    expect(second.lastPoint).toEqual({ x: 0, y: 0 });
  });

  it("previews only changed painted cells without mutating the level", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "WALL");

    const preview = previewPaintLevelCells(level, [0, 1, 1], "ANT_N");

    expect(preview).toEqual([
      { index: 0, top: "ANT_N", bottom: "WALL" },
      { index: 1, top: "ANT_N", bottom: "FLOOR" },
    ]);
    expect(level.map.top[0]).toBe("WALL");
    expect(level.map.bottom[0]).toBe("FLOOR");

    const unchangedPreview = previewPaintLevelCells(level, [0], "WALL");
    expect(unchangedPreview).toEqual([]);
  });

  it("can deliberately bury a tile in the bottom layer when requested", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "WALL");
    level = paintLevelCells(level, [0], "FIRE", { buryOnBottom: true });

    expect(level.map.top[0]).toBe("WALL");
    expect(level.map.bottom[0]).toBe("FIRE");
  });

  it("treats cloud as a valid upper-layer terrain overlay in 3D paint mode", () => {
    const z1CloudTile = getDat3dPaintTile(DAT_3D_CLOUD_TILE, 1);
    const z2CloudTile = getDat3dPaintTile(DAT_3D_CLOUD_TILE, 2);
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0], z1CloudTile, {
      treatAsTerrainTiles: DAT_3D_VALID_TERRAIN_TILES,
      allowedInvalidTiles: DAT_3D_VALID_TERRAIN_TILES,
    });
    expect(z1CloudTile).toBe("FLOOR");
    expect(level.map.top[0]).toBe("FLOOR");
    expect(level.map.bottom[0]).toBe("FLOOR");

    level = paintLevelCells(level, [1], z2CloudTile, {
      treatAsTerrainTiles: DAT_3D_VALID_TERRAIN_TILES,
      allowedInvalidTiles: DAT_3D_VALID_TERRAIN_TILES,
      fullCellTerrainTiles: DAT_3D_FULL_CELL_TERRAIN_TILES,
      terrainBottomOverrides: DAT_3D_TERRAIN_BOTTOM_OVERRIDES,
    });
    expect(z2CloudTile).toBe(DAT_3D_CLOUD_TILE);
    expect(level.map.top[1]).toBe(DAT_3D_CLOUD_TILE);
    expect(level.map.bottom[1]).toBe(DAT_3D_AIR_TILE);
    expect(
      getInvalidCellIndices(level, {
        treatAsTerrainTiles: DAT_3D_VALID_TERRAIN_TILES,
        allowedInvalidTiles: DAT_3D_VALID_TERRAIN_TILES,
        fullCellTerrainTiles: DAT_3D_FULL_CELL_TERRAIN_TILES,
        terrainBottomOverrides: DAT_3D_TERRAIN_BOTTOM_OVERRIDES,
      }),
    ).toEqual([]);

    level = paintLevelCells(level, [1], "BALL_N", {
      treatAsTerrainTiles: DAT_3D_VALID_TERRAIN_TILES,
      allowedInvalidTiles: DAT_3D_VALID_TERRAIN_TILES,
      fullCellTerrainTiles: DAT_3D_FULL_CELL_TERRAIN_TILES,
      terrainBottomOverrides: DAT_3D_TERRAIN_BOTTOM_OVERRIDES,
    });
    expect(level.map.top[1]).toBe("BALL_N");
    expect(level.map.bottom[1]).toBe(DAT_3D_CLOUD_TILE);
  });

  it("counts chip tiles present in either layer once per cell", () => {
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0], "CHIP");
    level = paintLevelCells(level, [1], "WALL");
    level = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 1 ? "ANT_N" : tile)),
        bottom: level.map.bottom.map((tile, index) => (index === 1 ? "CHIP" : tile)),
      },
    };

    expect(countChipsInLevel(level)).toBe(2);
  });

  it("creates new level passwords as four capital letters unless overridden", () => {
    const password = createRandomLevelPassword();
    const generatedLevel = createEmptyLevel(1);
    const explicitLevel = createEmptyLevel(2, { password: "ABCD" });

    expect(password).toMatch(/^[A-Z]{4}$/);
    expect(generatedLevel.password).toMatch(/^[A-Z]{4}$/);
    expect(explicitLevel.password).toBe("ABCD");
  });

  it("copies and pastes map regions with movement and connections", () => {
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0], "TRAP_BUTTON");
    level = paintLevelCells(level, [1], "TRAP");
    level = paintLevelCells(level, [32], "ANT_N");
    level = {
      ...level,
      trapControls: [{ button: 0, trap: 1, openOrShut: 0 }],
      movement: [32],
    };

    const clipboard = copyLevelRegion(level, { x: 0, y: 0, width: 2, height: 2 });
    const pasted = pasteLevelRegion(level, { x: 5, y: 5 }, clipboard);

    const pastedButton = 5 + 5 * 32;
    const pastedTrap = 6 + 5 * 32;
    const pastedMonster = 5 + 6 * 32;

    expect(pasted.map.top[pastedButton]).toBe("TRAP_BUTTON");
    expect(pasted.map.top[pastedTrap]).toBe("TRAP");
    expect(pasted.map.top[pastedMonster]).toBe("ANT_N");
    expect(pasted.trapControls).toContainEqual({
      button: pastedButton,
      trap: pastedTrap,
      openOrShut: 0,
    });
    expect(pasted.movement).toEqual([32, pastedMonster]);
  });

  it("transforms clipped level regions with tile directions, masks, and connections", () => {
    const transformed = transformLevelClipboard(
      {
        width: 2,
        height: 3,
        top: ["ANT_N", "WALL", "FIREBALL_E", "BLOCK", "FLOOR", "BUG_W"],
        bottom: ["FLOOR", "WATER", "ICE", "CLONE_MACHINE", "TRAP", "BUTTON_BLUE"],
        mask: [true, false, true, true, false, true],
        movement: [0, 5],
        trapControls: [{ button: 0, trap: 4, openOrShut: 1 }],
        cloneControls: [{ button: 1, cloner: 3 }],
      },
      "ROTATE_90",
    );

    expect(transformed).toEqual({
      width: 3,
      height: 2,
      top: ["FLOOR", "FIREBALL_S", "ANT_E", "BUG_N", "BLOCK", "WALL"],
      bottom: ["TRAP", "ICE", "FLOOR", "BUTTON_BLUE", "CLONE_MACHINE", "WATER"],
      mask: [false, true, true, true, true, false],
      movement: [2, 3],
      trapControls: [{ button: 2, trap: 0, openOrShut: 1 }],
      cloneControls: [{ button: 5, cloner: 4 }],
    });
  });

  it("moves masked selections while leaving floor behind at the source", () => {
    let level = createEmptyLevel(1);

    level = paintLevelCells(level, [0], "TRAP_BUTTON");
    level = paintLevelCells(level, [1], "TRAP");
    level = paintLevelCells(level, [32], "ANT_N");
    level = paintLevelCells(level, [33], "WALL");
    level = {
      ...level,
      trapControls: [{ button: 0, trap: 1, openOrShut: 0 }],
      movement: [32],
    };

    const moved = moveLevelRegion(
      level,
      { x: 0, y: 0, width: 2, height: 2 },
      { x: 4, y: 4 },
      [0, 1, 32],
    );

    const movedButton = 4 + 4 * 32;
    const movedTrap = 5 + 4 * 32;
    const movedMonster = 4 + 5 * 32;

    expect(moved.map.top[0]).toBe("FLOOR");
    expect(moved.map.top[1]).toBe("FLOOR");
    expect(moved.map.top[32]).toBe("FLOOR");
    expect(moved.map.top[33]).toBe("WALL");
    expect(moved.map.top[movedButton]).toBe("TRAP_BUTTON");
    expect(moved.map.top[movedTrap]).toBe("TRAP");
    expect(moved.map.top[movedMonster]).toBe("ANT_N");
    expect(moved.trapControls).toEqual([
      {
        button: movedButton,
        trap: movedTrap,
        openOrShut: 0,
      },
    ]);
    expect(moved.movement).toEqual([movedMonster]);
  });

  it("wrap-shifts maps, movement, and connections together", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "WALL");
    level = paintLevelCells(level, [1], "TRAP_BUTTON");
    level = paintLevelCells(level, [2], "TRAP");
    level = paintLevelCells(level, [33], "ANT_N");
    level = {
      ...level,
      trapControls: [{ button: 1, trap: 2, openOrShut: 0 }],
      movement: [33],
    };

    const shifted = shiftLevelWrap(level, -1, 0);

    expect(shifted.map.top[31]).toBe("WALL");
    expect(shifted.map.top[0]).toBe("TRAP_BUTTON");
    expect(shifted.map.top[1]).toBe("TRAP");
    expect(shifted.map.top[32]).toBe("ANT_N");
    expect(shifted.trapControls).toEqual([{ button: 0, trap: 1, openOrShut: 0 }]);
    expect(shifted.movement).toEqual([32]);
  });

  it("toggles trap and cloner connections while recognizing valid endpoints", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "TRAP_BUTTON");
    level = paintLevelCells(level, [1], "TRAP");
    level = paintLevelCells(level, [2], "CLONE_BUTTON");
    level = paintLevelCells(level, [3], "CLONER");

    expect(isConnectionEndpointCell(level, 0)).toBe(true);
    expect(isConnectionEndpointCell(level, 1)).toBe(true);
    expect(isConnectionEndpointCell(level, 2)).toBe(true);
    expect(isConnectionEndpointCell(level, 3)).toBe(true);
    expect(isConnectionEndpointCell(level, 4)).toBe(false);

    level = connectLevelButtons(level, 0, 1);
    expect(level.trapControls).toEqual([{ button: 0, trap: 1, openOrShut: 0 }]);

    level = connectLevelButtons(level, 0, 1);
    expect(level.trapControls).toEqual([]);

    level = connectLevelButtons(level, 2, 3);
    expect(level.cloneControls).toEqual([{ button: 2, cloner: 3 }]);

    level = connectLevelButtons(level, 2, 3);
    expect(level.cloneControls).toEqual([]);
  });

  it("keeps connections when trap and cloner endpoints are buried under actors", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "TRAP_BUTTON");
    level = paintLevelCells(level, [1], "TRAP");
    level = paintLevelCells(level, [2], "CLONE_BUTTON");
    level = paintLevelCells(level, [3], "CLONER");
    level = connectLevelButtons(level, 0, 1);
    level = connectLevelButtons(level, 2, 3);

    const withBuriedTrap = paintLevelCells(level, [1], "ANT_N");
    expect(withBuriedTrap.map.top[1]).toBe("ANT_N");
    expect(withBuriedTrap.map.bottom[1]).toBe("TRAP");
    expect(withBuriedTrap.trapControls).toEqual([{ button: 0, trap: 1, openOrShut: 0 }]);
    expect(withBuriedTrap.cloneControls).toEqual([{ button: 2, cloner: 3 }]);

    const withBuriedCloner = paintLevelCells(withBuriedTrap, [3], "BLOCK");
    expect(withBuriedCloner.map.top[3]).toBe("BLOCK");
    expect(withBuriedCloner.map.bottom[3]).toBe("CLONER");
    expect(withBuriedCloner.trapControls).toEqual([{ button: 0, trap: 1, openOrShut: 0 }]);
    expect(withBuriedCloner.cloneControls).toEqual([{ button: 2, cloner: 3 }]);

    const withoutTrap = paintLevelCells(withBuriedCloner, [1], "WALL");
    expect(withoutTrap.trapControls).toEqual([]);
    expect(withoutTrap.cloneControls).toEqual([{ button: 2, cloner: 3 }]);
  });

  it("replays levelset edit events for undo and redo", () => {
    const base = createLevelsetEditorHistory(makeDoc());
    const inserted = commitLevelsetEvent(base, {
      type: "insert-level",
      index: 1,
      level: createEmptyLevel(99, { title: "Inserted" }),
    });
    const moved = commitLevelsetEvent(inserted, {
      type: "move-level",
      from: 1,
      to: 2,
    });
    const renamed = commitLevelsetEvent(moved, {
      type: "replace-level",
      index: 2,
      level: {
        ...moved.doc.levels[2]!,
        title: "Moved",
      },
    });

    expect(renamed.doc.levels.map((level) => level.title)).toEqual(["One", "Two", "Moved"]);
    expect(renamed.selectedIndex).toBe(2);

    const undone = undoLevelsetEvent(renamed);
    expect(undone.doc.levels.map((level) => level.title)).toEqual(["One", "Two", "Inserted"]);
    expect(undone.selectedIndex).toBe(2);

    const redone = redoLevelsetEvent(undone);
    expect(redone.doc.levels.map((level) => level.title)).toEqual(["One", "Two", "Moved"]);
    expect(redone.selectedIndex).toBe(2);
  });

  it("keeps the manually selected level when undoing a later edit", () => {
    const base = createLevelsetEditorHistory(makeDoc());
    const inserted = commitLevelsetEvent(base, {
      type: "insert-level",
      index: 1,
      level: createEmptyLevel(99, { title: "Inserted" }),
    });

    const reselected = selectLevelInHistory(inserted, 0);
    const renamed = commitLevelsetEvent(reselected, {
      type: "replace-level",
      index: 0,
      level: {
        ...reselected.doc.levels[0]!,
        title: "Edited One",
      },
    });

    const undone = undoLevelsetEvent(renamed);

    expect(undone.doc.levels.map((level) => level.title)).toEqual(["One", "Inserted", "Two"]);
    expect(undone.selectedIndex).toBe(0);
  });

  it("undoes a whole-document replacement back to the prior levelset and selection", () => {
    const base = selectLevelInHistory(createLevelsetEditorHistory(makeDoc()), 1);
    const replacement: DatLevelsetJsonV1 = {
      schema: "datTools.dat.levelset.json.v1",
      magicNumber: 0x0002aaac,
      levels: [createEmptyLevel(1, { title: "Fresh" })],
    };

    const replaced = commitLevelsetEvent(base, {
      type: "replace-doc",
      doc: replacement,
    });

    expect(replaced.doc.levels.map((level) => level.title)).toEqual(["Fresh"]);
    expect(replaced.selectedIndex).toBe(0);

    const undone = undoLevelsetEvent(replaced);
    expect(undone.doc.levels.map((level) => level.title)).toEqual(["One", "Two"]);
    expect(undone.selectedIndex).toBe(1);

    const redone = redoLevelsetEvent(undone);
    expect(redone.doc.levels.map((level) => level.title)).toEqual(["Fresh"]);
    expect(redone.selectedIndex).toBe(0);
  });

  it("renumbers levels to match their slot after insert and move operations", () => {
    const base = createLevelsetEditorHistory(makeDoc());
    const inserted = commitLevelsetEvent(base, {
      type: "insert-level",
      index: 1,
      level: createEmptyLevel(150, { title: "Copy" }),
    });

    expect(inserted.doc.levels.map((level) => level.number)).toEqual([1, 2, 3]);
    expect(inserted.doc.levels[1]?.title).toBe("Copy");

    const moved = commitLevelsetEvent(inserted, {
      type: "move-level",
      from: 0,
      to: 2,
    });

    expect(moved.doc.levels.map((level) => level.number)).toEqual([1, 2, 3]);
    expect(moved.doc.levels.map((level) => level.title)).toEqual(["Copy", "Two", "One"]);
  });

  it("classifies actors separately from terrain for tool routing", () => {
    expect(classifyTilePlacement("ANT_N")).toBe("actor");
    expect(classifyTilePlacement("BLOCK")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x70")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x71")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x72")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x73")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x74")).toBe("actor");
    expect(classifyTilePlacement("UNKNOWN_0x75")).toBe("actor");
    expect(classifyTilePlacement("WALL")).toBe("terrain");
    expect(classifyTilePlacement("TRAP_BUTTON")).toBe("terrain");
    expect(
      classifyTilePlacement("CHIP_EXIT", {
        treatAsTerrainTiles: new Set(["CHIP_EXIT", "NOT_USED_0"]),
      }),
    ).toBe("terrain");
  });

  it("detects invalid cells but allows 3D air/elevator exceptions", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "NOT_USED_0");
    level = paintLevelCells(level, [1], "WALL", { buryOnBottom: true });
    level = paintLevelCells(level, [2], "ANT_N", { buryOnBottom: true });

    expect(getInvalidCellIndices(level)).toEqual([0, 1, 2]);

    const airLayer = {
      ...level,
      map: {
        ...level.map,
        top: level.map.top.map((tile, index) => (index === 3 ? "NOT_USED_0" : tile)),
        bottom: level.map.bottom.map((tile, index) => (index === 3 ? "NOT_USED_0" : tile)),
      },
    };
    const threeDOptions = {
      treatAsTerrainTiles: new Set(["CHIP_EXIT", "NOT_USED_0"]),
      allowedInvalidTiles: new Set(["CHIP_EXIT", "NOT_USED_0"]),
      fullCellTerrainTiles: new Set(["NOT_USED_0"]),
    };

    expect(getInvalidCellIndices(airLayer, threeDOptions)).toEqual([1, 2]);
  });
});
