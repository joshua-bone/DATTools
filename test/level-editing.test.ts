import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "../src/dat/datLevelsetJsonV1.js";
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
  fillLevelArea,
  getInvalidCellIndices,
  isConnectionEndpointCell,
  paintLevelCells,
  paintLevelLine,
  pasteLevelRegion,
  redoLevelsetEvent,
  selectLevelInHistory,
  shiftLevelWrap,
  undoLevelsetEvent,
} from "../web/src/levelEditing.js";

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

  it("can deliberately bury a tile in the bottom layer when requested", () => {
    let level = createEmptyLevel(1);
    level = paintLevelCells(level, [0], "WALL");
    level = paintLevelCells(level, [0], "FIRE", { buryOnBottom: true });

    expect(level.map.top[0]).toBe("WALL");
    expect(level.map.bottom[0]).toBe("FIRE");
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
