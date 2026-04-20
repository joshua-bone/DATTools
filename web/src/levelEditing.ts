import { CC1_LEGACY_INVALID_TILE_NAMES } from "@/src/dat/cc1Tiles";
import { transformDatTileName, type DatTransformKind } from "@/src/dat/datTransforms";
import type {
  CloneControl,
  DatExtraField,
  DatLevelJson,
  DatLevelsetJsonV1,
  TrapControl,
} from "@/src/dat/datLevelsetJsonV1";

type DatLevel = DatLevelsetJsonV1["levels"][number];

export type GridPoint = Readonly<{
  x: number;
  y: number;
}>;

export type GridRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type PaintPreviewCell = Readonly<{
  index: number;
  top: string;
  bottom: string;
}>;

export type ExtendedPaintStroke = Readonly<{
  cells: ReadonlyArray<number>;
  dirtyCells: ReadonlyArray<number>;
  lastPoint: GridPoint;
}>;

export type LevelClipboard = Readonly<{
  width: number;
  height: number;
  top: ReadonlyArray<string>;
  bottom: ReadonlyArray<string>;
  mask?: ReadonlyArray<boolean>;
  movement: ReadonlyArray<number>;
  trapControls: ReadonlyArray<TrapControl>;
  cloneControls: ReadonlyArray<CloneControl>;
}>;

export type ButtonConnection =
  | Readonly<{ kind: "trap"; button: number; trap: number; openOrShut: number }>
  | Readonly<{ kind: "cloner"; button: number; cloner: number }>;

export type PaintLevelOptions = Readonly<{
  fullCellTerrainTiles?: ReadonlySet<string>;
  terrainBottomOverrides?: ReadonlyMap<string, string>;
  treatAsTerrainTiles?: ReadonlySet<string>;
  allowedInvalidTiles?: ReadonlySet<string>;
  buryOnBottom?: boolean;
}>;

export type LevelsetEditorEvent =
  | Readonly<{ type: "set-magic-number"; magicNumber: number }>
  | Readonly<{ type: "replace-level"; index: number; level: DatLevel }>
  | Readonly<{ type: "insert-level"; index: number; level: DatLevel }>
  | Readonly<{ type: "remove-level"; index: number }>
  | Readonly<{ type: "move-level"; from: number; to: number }>
  | Readonly<{ type: "replace-doc"; doc: DatLevelsetJsonV1; selectedIndex?: number }>;

export type LevelsetEditorHistory = Readonly<{
  baseDoc: DatLevelsetJsonV1;
  events: ReadonlyArray<LevelsetEditorEvent>;
  selectionByCursor: ReadonlyArray<number>;
  cursor: number;
  doc: DatLevelsetJsonV1;
  selectedIndex: number;
}>;

const BOARD_SIZE = 32;
const LEVEL_TILE_COUNT = BOARD_SIZE * BOARD_SIZE;
const FLOOR_TILE = "FLOOR";

const ACTOR_TILES = new Set<string>([
  "BLOCK",
  "CLONE_BLOCK_N",
  "CLONE_BLOCK_W",
  "CLONE_BLOCK_S",
  "CLONE_BLOCK_E",
  "UNKNOWN_0x70",
  "UNKNOWN_0x71",
  "UNKNOWN_0x72",
  "UNKNOWN_0x73",
  "UNKNOWN_0x74",
  "UNKNOWN_0x75",
  "CHIP_EXIT",
  "DROWN_CHIP",
  "BURNED_CHIP0",
  "BURNED_CHIP1",
  "CHIP_SWIMMING_N",
  "CHIP_SWIMMING_W",
  "CHIP_SWIMMING_S",
  "CHIP_SWIMMING_E",
  "ANT_N",
  "ANT_W",
  "ANT_S",
  "ANT_E",
  "FIREBALL_N",
  "FIREBALL_W",
  "FIREBALL_S",
  "FIREBALL_E",
  "BALL_N",
  "BALL_W",
  "BALL_S",
  "BALL_E",
  "TANK_N",
  "TANK_W",
  "TANK_S",
  "TANK_E",
  "GLIDER_N",
  "GLIDER_W",
  "GLIDER_S",
  "GLIDER_E",
  "TEETH_N",
  "TEETH_W",
  "TEETH_S",
  "TEETH_E",
  "WALKER_N",
  "WALKER_W",
  "WALKER_S",
  "WALKER_E",
  "BLOB_N",
  "BLOB_W",
  "BLOB_S",
  "BLOB_E",
  "PARAMECIUM_N",
  "PARAMECIUM_W",
  "PARAMECIUM_S",
  "PARAMECIUM_E",
  "PLAYER_N",
  "PLAYER_W",
  "PLAYER_S",
  "PLAYER_E",
]);

const MOVING_MONSTER_TILES = new Set<string>([
  "ANT_N",
  "ANT_W",
  "ANT_S",
  "ANT_E",
  "FIREBALL_N",
  "FIREBALL_W",
  "FIREBALL_S",
  "FIREBALL_E",
  "BALL_N",
  "BALL_W",
  "BALL_S",
  "BALL_E",
  "TANK_N",
  "TANK_W",
  "TANK_S",
  "TANK_E",
  "GLIDER_N",
  "GLIDER_W",
  "GLIDER_S",
  "GLIDER_E",
  "TEETH_N",
  "TEETH_W",
  "TEETH_S",
  "TEETH_E",
  "WALKER_N",
  "WALKER_W",
  "WALKER_S",
  "WALKER_E",
  "BLOB_N",
  "BLOB_W",
  "BLOB_S",
  "BLOB_E",
  "PARAMECIUM_N",
  "PARAMECIUM_W",
  "PARAMECIUM_S",
  "PARAMECIUM_E",
]);
const INVALID_CELL_TILES = new Set<string>(CC1_LEGACY_INVALID_TILE_NAMES);

function filledLayer(tile: string): string[] {
  return Array<string>(LEVEL_TILE_COUNT).fill(tile);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function uniqueIndices(indices: ReadonlyArray<number>): number[] {
  const out: number[] = [];
  const seen = new Set<number>();

  for (const index of indices) {
    if (index < 0 || index >= LEVEL_TILE_COUNT) continue;
    if (seen.has(index)) continue;
    seen.add(index);
    out.push(index);
  }

  return out;
}

function removeConnectionsTouchingCells<T extends TrapControl | CloneControl>(
  items: ReadonlyArray<T>,
  changedSet: ReadonlySet<number>,
  endpointKey: keyof T,
): T[] {
  return items.filter((item) => {
    const button = item.button;
    const endpoint = item[endpointKey];
    return !changedSet.has(button) && !changedSet.has(endpoint as number);
  });
}

function isMovingMonsterTile(name: string): boolean {
  return MOVING_MONSTER_TILES.has(name);
}

export function isActorTile(name: string, options?: PaintLevelOptions): boolean {
  return !options?.treatAsTerrainTiles?.has(name) && ACTOR_TILES.has(name);
}

export function classifyTilePlacement(
  name: string,
  options?: PaintLevelOptions,
): "terrain" | "actor" {
  return isActorTile(name, options) ? "actor" : "terrain";
}

export function countChipsInLevel(level: DatLevel): number {
  let count = 0;

  for (let index = 0; index < LEVEL_TILE_COUNT; index++) {
    if (cellContainsTile(level, index, "CHIP")) count += 1;
  }

  return count;
}

export function createRandomLevelPassword(): string {
  let password = "";
  for (let index = 0; index < 4; index++) {
    password += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  return password;
}

export function createEmptyLevel(
  number: number,
  overrides: Partial<
    Pick<
      DatLevelJson,
      | "title"
      | "author"
      | "password"
      | "hint"
      | "time"
      | "chips"
      | "mapDetail"
      | "fieldOrder"
      | "extraFields"
    >
  > = {},
): DatLevel {
  const title = overrides.title ?? `Level ${number}`;
  const password = overrides.password ?? createRandomLevelPassword();
  const fieldOrder = overrides.fieldOrder ?? [];
  const extraFields = overrides.extraFields ?? [];

  return {
    number,
    time: overrides.time ?? 0,
    chips: overrides.chips ?? 0,
    mapDetail: overrides.mapDetail ?? 1,
    ...(title ? { title } : {}),
    ...(overrides.author ? { author: overrides.author } : {}),
    ...(password ? { password } : {}),
    ...(overrides.hint ? { hint: overrides.hint } : {}),
    map: {
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      top: filledLayer(FLOOR_TILE),
      bottom: filledLayer(FLOOR_TILE),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
    fieldOrder,
    extraFields,
  };
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

export function setLevelsetMagicNumber(
  doc: DatLevelsetJsonV1,
  magicNumber: number,
): DatLevelsetJsonV1 {
  return { ...doc, magicNumber };
}

function renumberLevelsBySlot(levels: ReadonlyArray<DatLevel>): DatLevel[] {
  return levels.map((level, index) =>
    level.number === index + 1
      ? level
      : {
          ...level,
          number: index + 1,
        },
  );
}

export function insertLevel(
  doc: DatLevelsetJsonV1,
  index: number,
  level: DatLevel,
): DatLevelsetJsonV1 {
  const insertAt = clamp(index, 0, doc.levels.length);
  return {
    ...doc,
    levels: renumberLevelsBySlot([
      ...doc.levels.slice(0, insertAt),
      level,
      ...doc.levels.slice(insertAt),
    ]),
  };
}

export function removeLevel(doc: DatLevelsetJsonV1, index: number): DatLevelsetJsonV1 {
  if (index < 0 || index >= doc.levels.length) return doc;
  return {
    ...doc,
    levels: renumberLevelsBySlot([...doc.levels.slice(0, index), ...doc.levels.slice(index + 1)]),
  };
}

export function moveLevel(doc: DatLevelsetJsonV1, from: number, to: number): DatLevelsetJsonV1 {
  if (from < 0 || from >= doc.levels.length) return doc;
  const target = clamp(to, 0, doc.levels.length - 1);
  if (from === target) return doc;

  const levels = [...doc.levels];
  const [moved] = levels.splice(from, 1);
  levels.splice(target, 0, moved!);
  return { ...doc, levels: renumberLevelsBySlot(levels) };
}

export function clearLevel(level: DatLevel): DatLevel {
  return {
    ...level,
    chips: 0,
    map: {
      ...level.map,
      top: filledLayer(FLOOR_TILE),
      bottom: filledLayer(FLOOR_TILE),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
  };
}

export function clampPoint(point: GridPoint): GridPoint {
  return {
    x: clamp(point.x, 0, BOARD_SIZE - 1),
    y: clamp(point.y, 0, BOARD_SIZE - 1),
  };
}

export function pointToIndex(point: GridPoint): number {
  return point.y * BOARD_SIZE + point.x;
}

export function indexToPoint(index: number): GridPoint {
  return {
    x: index % BOARD_SIZE,
    y: Math.floor(index / BOARD_SIZE),
  };
}

function wrapCoordinate(value: number): number {
  return ((value % BOARD_SIZE) + BOARD_SIZE) % BOARD_SIZE;
}

function shiftWrappedIndex(index: number, dx: number, dy: number): number {
  const point = indexToPoint(index);
  return pointToIndex({
    x: wrapCoordinate(point.x + dx),
    y: wrapCoordinate(point.y + dy),
  });
}

export function shiftLevelWrap(level: DatLevel, dx: number, dy: number): DatLevel {
  const normalizedDx = dx % BOARD_SIZE;
  const normalizedDy = dy % BOARD_SIZE;
  if (normalizedDx === 0 && normalizedDy === 0) return level;

  const nextTop = Array<string>(LEVEL_TILE_COUNT).fill(FLOOR_TILE);
  const nextBottom = Array<string>(LEVEL_TILE_COUNT).fill(FLOOR_TILE);

  for (let index = 0; index < LEVEL_TILE_COUNT; index++) {
    const shiftedIndex = shiftWrappedIndex(index, normalizedDx, normalizedDy);
    nextTop[shiftedIndex] = level.map.top[index] ?? FLOOR_TILE;
    nextBottom[shiftedIndex] = level.map.bottom[index] ?? FLOOR_TILE;
  }

  return {
    ...level,
    map: {
      ...level.map,
      top: nextTop,
      bottom: nextBottom,
    },
    trapControls: level.trapControls.map((item) => ({
      button: shiftWrappedIndex(item.button, normalizedDx, normalizedDy),
      trap: shiftWrappedIndex(item.trap, normalizedDx, normalizedDy),
      openOrShut: item.openOrShut,
    })),
    cloneControls: level.cloneControls.map((item) => ({
      button: shiftWrappedIndex(item.button, normalizedDx, normalizedDy),
      cloner: shiftWrappedIndex(item.cloner, normalizedDx, normalizedDy),
    })),
    movement: level.movement.map((index) => shiftWrappedIndex(index, normalizedDx, normalizedDy)),
  };
}

export function normalizeRect(a: GridPoint, b: GridPoint): GridRect {
  const left = Math.min(a.x, b.x);
  const right = Math.max(a.x, b.x);
  const top = Math.min(a.y, b.y);
  const bottom = Math.max(a.y, b.y);
  return {
    x: clamp(left, 0, BOARD_SIZE - 1),
    y: clamp(top, 0, BOARD_SIZE - 1),
    width: clamp(right, 0, BOARD_SIZE - 1) - clamp(left, 0, BOARD_SIZE - 1) + 1,
    height: clamp(bottom, 0, BOARD_SIZE - 1) - clamp(top, 0, BOARD_SIZE - 1) + 1,
  };
}

export function rectToIndices(rect: GridRect): number[] {
  const out: number[] = [];
  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      out.push(pointToIndex({ x: rect.x + x, y: rect.y + y }));
    }
  }
  return out;
}

export function getLineIndices(start: GridPoint, end: GridPoint): number[] {
  const out: number[] = [];

  let x0 = start.x;
  let y0 = start.y;
  const x1 = end.x;
  const y1 = end.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    out.push(pointToIndex(clampPoint({ x: x0, y: y0 })));
    if (x0 === x1 && y0 === y1) break;
    const err2 = err * 2;
    if (err2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (err2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return uniqueIndices(out);
}

export function extendPaintStroke(
  cells: ReadonlyArray<number>,
  lastPoint: GridPoint,
  nextPoint: GridPoint,
): ExtendedPaintStroke {
  const clampedNextPoint = clampPoint(nextPoint);
  if (lastPoint.x === clampedNextPoint.x && lastPoint.y === clampedNextPoint.y) {
    return {
      cells,
      dirtyCells: [],
      lastPoint: clampedNextPoint,
    };
  }

  const nextCells = [...cells];
  const dirtyCells: number[] = [];
  const seen = new Set(cells);

  for (const index of getLineIndices(lastPoint, clampedNextPoint)) {
    if (seen.has(index)) continue;
    seen.add(index);
    nextCells.push(index);
    dirtyCells.push(index);
  }

  return {
    cells: dirtyCells.length === 0 ? cells : nextCells,
    dirtyCells,
    lastPoint: clampedNextPoint,
  };
}

function getTerrainTile(top: string, bottom: string, options?: PaintLevelOptions): string {
  const pairedTerrainTile = options?.terrainBottomOverrides?.get(top);
  if (pairedTerrainTile && bottom === pairedTerrainTile) return top;
  if (bottom !== FLOOR_TILE && !isActorTile(bottom, options)) return bottom;
  if (!isActorTile(top, options)) return top;
  return FLOOR_TILE;
}

function cellContainsTile(level: DatLevel, index: number, tile: string): boolean {
  return level.map.top[index] === tile || level.map.bottom[index] === tile;
}

export function isConnectionEndpointCell(level: DatLevel, index: number): boolean {
  return (
    cellContainsTile(level, index, "TRAP_BUTTON") ||
    cellContainsTile(level, index, "TRAP") ||
    cellContainsTile(level, index, "CLONE_BUTTON") ||
    cellContainsTile(level, index, "CLONER")
  );
}

function applyTileToCell(
  top: string,
  bottom: string,
  tile: string,
  options?: PaintLevelOptions,
): { top: string; bottom: string } {
  if (options?.buryOnBottom) {
    return {
      top,
      bottom: tile,
    };
  }

  if (isActorTile(tile, options)) {
    return {
      top: tile,
      bottom: getTerrainTile(top, bottom, options),
    };
  }

  if (options?.fullCellTerrainTiles?.has(tile)) {
    return {
      top: tile,
      bottom: tile,
    };
  }

  const terrainBottomOverride = options?.terrainBottomOverrides?.get(tile);
  if (terrainBottomOverride) {
    return {
      top: tile,
      bottom: terrainBottomOverride,
    };
  }

  return {
    top: tile,
    bottom: FLOOR_TILE,
  };
}

export function previewPaintLevelCells(
  level: DatLevel,
  indices: ReadonlyArray<number>,
  tile: string,
  options?: PaintLevelOptions,
): PaintPreviewCell[] {
  const targets = uniqueIndices(indices);
  const previewCells: PaintPreviewCell[] = [];

  for (const index of targets) {
    const currentTop = level.map.top[index] ?? FLOOR_TILE;
    const currentBottom = level.map.bottom[index] ?? FLOOR_TILE;
    const nextCell = applyTileToCell(currentTop, currentBottom, tile, options);

    if (currentTop === nextCell.top && currentBottom === nextCell.bottom) continue;

    previewCells.push({
      index,
      top: nextCell.top,
      bottom: nextCell.bottom,
    });
  }

  return previewCells;
}

export function isLevelCellValid(
  level: DatLevel,
  index: number,
  options?: PaintLevelOptions,
): boolean {
  const top = level.map.top[index] ?? FLOOR_TILE;
  const bottom = level.map.bottom[index] ?? FLOOR_TILE;
  const invalidCode =
    (INVALID_CELL_TILES.has(top) && !options?.allowedInvalidTiles?.has(top)) ||
    (INVALID_CELL_TILES.has(bottom) && !options?.allowedInvalidTiles?.has(bottom));
  const buriedMob = isActorTile(bottom, options);
  const isAllowedFullCellTerrain = top === bottom && options?.fullCellTerrainTiles?.has(top);
  const isAllowedTerrainPair = options?.terrainBottomOverrides?.get(top) === bottom;
  const buried =
    !isActorTile(top, options) &&
    bottom !== FLOOR_TILE &&
    !isAllowedFullCellTerrain &&
    !isAllowedTerrainPair;
  return !(invalidCode || buriedMob || buried);
}

export function getInvalidCellIndices(level: DatLevel, options?: PaintLevelOptions): number[] {
  const invalid: number[] = [];
  for (let index = 0; index < LEVEL_TILE_COUNT; index++) {
    if (!isLevelCellValid(level, index, options)) invalid.push(index);
  }
  return invalid;
}

function syncMovement(
  level: DatLevel,
  previousMovement: ReadonlyArray<number>,
  changedIndices: ReadonlyArray<number>,
  preferredAppendOrder: ReadonlyArray<number> = changedIndices,
): number[] {
  const changedSet = new Set(changedIndices);
  const nextMovement = previousMovement.filter(
    (index) => !changedSet.has(index) && isMovingMonsterTile(level.map.top[index] ?? FLOOR_TILE),
  );
  const seen = new Set(nextMovement);

  for (const index of preferredAppendOrder) {
    if (seen.has(index)) continue;
    if (!isMovingMonsterTile(level.map.top[index] ?? FLOOR_TILE)) continue;
    seen.add(index);
    nextMovement.push(index);
  }

  return nextMovement;
}

function dedupeTrapControls(items: ReadonlyArray<TrapControl>): TrapControl[] {
  const seen = new Set<string>();
  const out: TrapControl[] = [];

  for (const item of items) {
    const key = `${item.button}:${item.trap}:${item.openOrShut}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function dedupeCloneControls(items: ReadonlyArray<CloneControl>): CloneControl[] {
  const seen = new Set<string>();
  const out: CloneControl[] = [];

  for (const item of items) {
    const key = `${item.button}:${item.cloner}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function syncTrapControls(
  level: DatLevel,
  previous: ReadonlyArray<TrapControl>,
  changedIndices: ReadonlyArray<number>,
  appended: ReadonlyArray<TrapControl> = [],
): TrapControl[] {
  const changedSet = new Set(changedIndices);
  const base = removeConnectionsTouchingCells(previous, changedSet, "trap");
  return dedupeTrapControls([...base, ...appended]).filter(
    (item) =>
      cellContainsTile(level, item.button, "TRAP_BUTTON") &&
      cellContainsTile(level, item.trap, "TRAP"),
  );
}

function syncCloneControls(
  level: DatLevel,
  previous: ReadonlyArray<CloneControl>,
  changedIndices: ReadonlyArray<number>,
  appended: ReadonlyArray<CloneControl> = [],
): CloneControl[] {
  const changedSet = new Set(changedIndices);
  const base = removeConnectionsTouchingCells(previous, changedSet, "cloner");
  return dedupeCloneControls([...base, ...appended]).filter(
    (item) =>
      cellContainsTile(level, item.button, "CLONE_BUTTON") &&
      cellContainsTile(level, item.cloner, "CLONER"),
  );
}

export function classifyButtonConnection(
  level: DatLevel,
  firstIndex: number,
  secondIndex: number,
): ButtonConnection | null {
  if (firstIndex < 0 || firstIndex >= LEVEL_TILE_COUNT) return null;
  if (secondIndex < 0 || secondIndex >= LEVEL_TILE_COUNT) return null;
  if (firstIndex === secondIndex) return null;

  if (
    cellContainsTile(level, firstIndex, "TRAP_BUTTON") &&
    cellContainsTile(level, secondIndex, "TRAP")
  ) {
    return { kind: "trap", button: firstIndex, trap: secondIndex, openOrShut: 0 };
  }

  if (
    cellContainsTile(level, secondIndex, "TRAP_BUTTON") &&
    cellContainsTile(level, firstIndex, "TRAP")
  ) {
    return { kind: "trap", button: secondIndex, trap: firstIndex, openOrShut: 0 };
  }

  if (
    cellContainsTile(level, firstIndex, "CLONE_BUTTON") &&
    cellContainsTile(level, secondIndex, "CLONER")
  ) {
    return { kind: "cloner", button: firstIndex, cloner: secondIndex };
  }

  if (
    cellContainsTile(level, secondIndex, "CLONE_BUTTON") &&
    cellContainsTile(level, firstIndex, "CLONER")
  ) {
    return { kind: "cloner", button: secondIndex, cloner: firstIndex };
  }

  return null;
}

export function connectLevelButtons(
  level: DatLevel,
  firstIndex: number,
  secondIndex: number,
): DatLevel {
  const connection = classifyButtonConnection(level, firstIndex, secondIndex);
  if (!connection) return level;

  if (connection.kind === "trap") {
    if (
      level.trapControls.some(
        (item) =>
          item.button === connection.button &&
          item.trap === connection.trap &&
          item.openOrShut === connection.openOrShut,
      )
    ) {
      return {
        ...level,
        trapControls: level.trapControls.filter(
          (item) =>
            !(
              item.button === connection.button &&
              item.trap === connection.trap &&
              item.openOrShut === connection.openOrShut
            ),
        ),
      };
    }

    return {
      ...level,
      trapControls: syncTrapControls(
        level,
        level.trapControls,
        [],
        [
          {
            button: connection.button,
            trap: connection.trap,
            openOrShut: connection.openOrShut,
          },
        ],
      ),
    };
  }

  if (
    level.cloneControls.some(
      (item) => item.button === connection.button && item.cloner === connection.cloner,
    )
  ) {
    return {
      ...level,
      cloneControls: level.cloneControls.filter(
        (item) => !(item.button === connection.button && item.cloner === connection.cloner),
      ),
    };
  }

  return {
    ...level,
    cloneControls: syncCloneControls(
      level,
      level.cloneControls,
      [],
      [
        {
          button: connection.button,
          cloner: connection.cloner,
        },
      ],
    ),
  };
}

function rebuildLevelWithMap(
  level: DatLevel,
  nextTop: ReadonlyArray<string>,
  nextBottom: ReadonlyArray<string>,
  changedIndices: ReadonlyArray<number>,
  preferredAppendOrder: ReadonlyArray<number> = changedIndices,
  appendedTrapControls: ReadonlyArray<TrapControl> = [],
  appendedCloneControls: ReadonlyArray<CloneControl> = [],
): DatLevel {
  const nextLevel: DatLevel = {
    ...level,
    map: {
      ...level.map,
      top: [...nextTop],
      bottom: [...nextBottom],
    },
  };

  return {
    ...nextLevel,
    movement: syncMovement(nextLevel, level.movement, changedIndices, preferredAppendOrder),
    trapControls: syncTrapControls(
      nextLevel,
      level.trapControls,
      changedIndices,
      appendedTrapControls,
    ),
    cloneControls: syncCloneControls(
      nextLevel,
      level.cloneControls,
      changedIndices,
      appendedCloneControls,
    ),
  };
}

export function paintLevelCells(
  level: DatLevel,
  indices: ReadonlyArray<number>,
  tile: string,
  options?: PaintLevelOptions,
): DatLevel {
  const targets = uniqueIndices(indices);
  if (targets.length === 0) return level;

  const nextTop = [...level.map.top];
  const nextBottom = [...level.map.bottom];
  const changed: number[] = [];

  for (const index of targets) {
    const currentTop = nextTop[index] ?? FLOOR_TILE;
    const currentBottom = nextBottom[index] ?? FLOOR_TILE;
    const nextCell = applyTileToCell(currentTop, currentBottom, tile, options);

    if (currentTop === nextCell.top && currentBottom === nextCell.bottom) continue;

    nextTop[index] = nextCell.top;
    nextBottom[index] = nextCell.bottom;
    changed.push(index);
  }

  if (changed.length === 0) return level;
  return rebuildLevelWithMap(level, nextTop, nextBottom, changed);
}

export function paintLevelLine(
  level: DatLevel,
  start: GridPoint,
  end: GridPoint,
  tile: string,
  options?: PaintLevelOptions,
): DatLevel {
  return paintLevelCells(level, getLineIndices(start, end), tile, options);
}

export function fillLevelArea(
  level: DatLevel,
  origin: GridPoint,
  tile: string,
  options?: PaintLevelOptions,
): DatLevel {
  return paintLevelCells(
    level,
    resolveFillLevelIndices(level, origin, tile, options),
    tile,
    options,
  );
}

export function resolveFillLevelIndices(
  level: DatLevel,
  origin: GridPoint,
  tile: string,
  options?: PaintLevelOptions,
): number[] {
  const start = clampPoint(origin);
  const startIndex = pointToIndex(start);

  const matcher =
    classifyTilePlacement(tile) === "actor"
      ? (index: number) =>
          (level.map.top[index] ?? FLOOR_TILE) === (level.map.top[startIndex] ?? FLOOR_TILE)
      : (index: number) =>
          getTerrainTile(
            level.map.top[index] ?? FLOOR_TILE,
            level.map.bottom[index] ?? FLOOR_TILE,
            options,
          ) ===
          getTerrainTile(
            level.map.top[startIndex] ?? FLOOR_TILE,
            level.map.bottom[startIndex] ?? FLOOR_TILE,
            options,
          );

  const visited = new Set<number>();
  const queue = [startIndex];
  const filled: number[] = [];

  while (queue.length > 0) {
    const index = queue.shift()!;
    if (visited.has(index)) continue;
    visited.add(index);
    if (!matcher(index)) continue;
    filled.push(index);

    const point = indexToPoint(index);
    if (point.x > 0) queue.push(index - 1);
    if (point.x < BOARD_SIZE - 1) queue.push(index + 1);
    if (point.y > 0) queue.push(index - BOARD_SIZE);
    if (point.y < BOARD_SIZE - 1) queue.push(index + BOARD_SIZE);
  }

  return filled;
}

export function copyLevelRegion(
  level: DatLevel,
  rect: GridRect,
  selectedIndices?: ReadonlyArray<number>,
): LevelClipboard {
  const top: string[] = [];
  const bottom: string[] = [];
  const selectedSet = selectedIndices ? new Set(selectedIndices) : null;
  const mask: boolean[] | null = selectedSet ? [] : null;
  const normalizedRect = {
    x: clamp(rect.x, 0, BOARD_SIZE - 1),
    y: clamp(rect.y, 0, BOARD_SIZE - 1),
    width: clamp(rect.width, 1, BOARD_SIZE - clamp(rect.x, 0, BOARD_SIZE - 1)),
    height: clamp(rect.height, 1, BOARD_SIZE - clamp(rect.y, 0, BOARD_SIZE - 1)),
  };

  for (let y = 0; y < normalizedRect.height; y++) {
    for (let x = 0; x < normalizedRect.width; x++) {
      const index = pointToIndex({ x: normalizedRect.x + x, y: normalizedRect.y + y });
      mask?.push(selectedSet?.has(index) ?? true);
      top.push(level.map.top[index] ?? FLOOR_TILE);
      bottom.push(level.map.bottom[index] ?? FLOOR_TILE);
    }
  }

  const toRelativeIndex = (absoluteIndex: number): number => {
    const point = indexToPoint(absoluteIndex);
    return (point.y - normalizedRect.y) * normalizedRect.width + (point.x - normalizedRect.x);
  };

  const containsAbsoluteIndex = (absoluteIndex: number): boolean => {
    const point = indexToPoint(absoluteIndex);
    const withinBounds =
      point.x >= normalizedRect.x &&
      point.x < normalizedRect.x + normalizedRect.width &&
      point.y >= normalizedRect.y &&
      point.y < normalizedRect.y + normalizedRect.height;
    return withinBounds && (selectedSet?.has(absoluteIndex) ?? true);
  };

  return {
    width: normalizedRect.width,
    height: normalizedRect.height,
    top,
    bottom,
    ...(mask ? { mask } : {}),
    movement: level.movement.filter(containsAbsoluteIndex).map(toRelativeIndex),
    trapControls: level.trapControls
      .filter((item) => containsAbsoluteIndex(item.button) && containsAbsoluteIndex(item.trap))
      .map((item) => ({
        button: toRelativeIndex(item.button),
        trap: toRelativeIndex(item.trap),
        openOrShut: item.openOrShut,
      })),
    cloneControls: level.cloneControls
      .filter((item) => containsAbsoluteIndex(item.button) && containsAbsoluteIndex(item.cloner))
      .map((item) => ({
        button: toRelativeIndex(item.button),
        cloner: toRelativeIndex(item.cloner),
      })),
  };
}

function relativeIndexToAbsoluteIndex(
  anchor: GridPoint,
  width: number,
  index: number,
): number | null {
  const point = {
    x: anchor.x + (index % width),
    y: anchor.y + Math.floor(index / width),
  };

  if (point.x < 0 || point.x >= BOARD_SIZE || point.y < 0 || point.y >= BOARD_SIZE) {
    return null;
  }

  return pointToIndex(point);
}

function clipboardTransformSwapsAxes(kind: DatTransformKind): boolean {
  return (
    kind === "ROTATE_90" ||
    kind === "ROTATE_270" ||
    kind === "FLIP_DIAG_NWSE" ||
    kind === "FLIP_DIAG_NESW"
  );
}

function transformClipboardPoint(
  x: number,
  y: number,
  width: number,
  height: number,
  kind: DatTransformKind,
): GridPoint {
  switch (kind) {
    case "ROTATE_90":
      return {
        x: height - 1 - y,
        y: x,
      };
    case "ROTATE_180":
      return {
        x: width - 1 - x,
        y: height - 1 - y,
      };
    case "ROTATE_270":
      return {
        x: y,
        y: width - 1 - x,
      };
    case "FLIP_H":
      return {
        x: width - 1 - x,
        y,
      };
    case "FLIP_V":
      return {
        x,
        y: height - 1 - y,
      };
    case "FLIP_DIAG_NWSE":
      return {
        x: y,
        y: x,
      };
    case "FLIP_DIAG_NESW":
      return {
        x: height - 1 - y,
        y: width - 1 - x,
      };
  }
}

function transformClipboardIndex(
  index: number,
  width: number,
  height: number,
  kind: DatTransformKind,
): number {
  const point = transformClipboardPoint(
    index % width,
    Math.floor(index / width),
    width,
    height,
    kind,
  );
  const nextWidth = clipboardTransformSwapsAxes(kind) ? height : width;
  return point.y * nextWidth + point.x;
}

export function transformLevelClipboard(
  clipboard: LevelClipboard,
  kind: DatTransformKind,
): LevelClipboard {
  const nextWidth = clipboardTransformSwapsAxes(kind) ? clipboard.height : clipboard.width;
  const nextHeight = clipboardTransformSwapsAxes(kind) ? clipboard.width : clipboard.height;
  const cellCount = nextWidth * nextHeight;
  const top = new Array<string>(cellCount).fill(FLOOR_TILE);
  const bottom = new Array<string>(cellCount).fill(FLOOR_TILE);
  const mask = clipboard.mask ? new Array<boolean>(cellCount).fill(false) : null;

  for (let index = 0; index < clipboard.width * clipboard.height; index += 1) {
    const nextIndex = transformClipboardIndex(index, clipboard.width, clipboard.height, kind);
    top[nextIndex] = transformDatTileName(clipboard.top[index] ?? FLOOR_TILE, kind);
    bottom[nextIndex] = transformDatTileName(clipboard.bottom[index] ?? FLOOR_TILE, kind);
    if (mask) mask[nextIndex] = clipboard.mask?.[index] ?? true;
  }

  return {
    width: nextWidth,
    height: nextHeight,
    top,
    bottom,
    ...(mask ? { mask } : {}),
    movement: clipboard.movement.map((index) =>
      transformClipboardIndex(index, clipboard.width, clipboard.height, kind),
    ),
    trapControls: clipboard.trapControls.map((item) => ({
      button: transformClipboardIndex(item.button, clipboard.width, clipboard.height, kind),
      trap: transformClipboardIndex(item.trap, clipboard.width, clipboard.height, kind),
      openOrShut: item.openOrShut,
    })),
    cloneControls: clipboard.cloneControls.map((item) => ({
      button: transformClipboardIndex(item.button, clipboard.width, clipboard.height, kind),
      cloner: transformClipboardIndex(item.cloner, clipboard.width, clipboard.height, kind),
    })),
  };
}

export function rotateLevelClipboard(
  clipboard: LevelClipboard,
  kind: "ROTATE_90" | "ROTATE_270",
): LevelClipboard {
  return transformLevelClipboard(clipboard, kind);
}

export function pasteLevelRegion(
  level: DatLevel,
  anchor: GridPoint,
  clipboard: LevelClipboard,
): DatLevel {
  const clampedAnchor = clampPoint(anchor);
  const nextTop = [...level.map.top];
  const nextBottom = [...level.map.bottom];
  const overwritten: number[] = [];

  for (let y = 0; y < clipboard.height; y++) {
    for (let x = 0; x < clipboard.width; x++) {
      const target = {
        x: clampedAnchor.x + x,
        y: clampedAnchor.y + y,
      };
      if (target.x >= BOARD_SIZE || target.y >= BOARD_SIZE) continue;

      const absoluteIndex = pointToIndex(target);
      const relativeIndex = y * clipboard.width + x;
      if (clipboard.mask && !clipboard.mask[relativeIndex]) continue;
      nextTop[absoluteIndex] = clipboard.top[relativeIndex] ?? FLOOR_TILE;
      nextBottom[absoluteIndex] = clipboard.bottom[relativeIndex] ?? FLOOR_TILE;
      overwritten.push(absoluteIndex);
    }
  }

  if (overwritten.length === 0) return level;

  const preferredAppendOrder = clipboard.movement
    .map((relativeIndex) =>
      relativeIndexToAbsoluteIndex(clampedAnchor, clipboard.width, relativeIndex),
    )
    .filter((index): index is number => index !== null);

  const appendedTrapControls = clipboard.trapControls
    .map((item) => {
      const button = relativeIndexToAbsoluteIndex(clampedAnchor, clipboard.width, item.button);
      const trap = relativeIndexToAbsoluteIndex(clampedAnchor, clipboard.width, item.trap);
      if (button === null || trap === null) return null;
      return { button, trap, openOrShut: item.openOrShut };
    })
    .filter((item): item is TrapControl => item !== null);

  const appendedCloneControls = clipboard.cloneControls
    .map((item) => {
      const button = relativeIndexToAbsoluteIndex(clampedAnchor, clipboard.width, item.button);
      const cloner = relativeIndexToAbsoluteIndex(clampedAnchor, clipboard.width, item.cloner);
      if (button === null || cloner === null) return null;
      return { button, cloner };
    })
    .filter((item): item is CloneControl => item !== null);

  return rebuildLevelWithMap(
    level,
    nextTop,
    nextBottom,
    overwritten,
    preferredAppendOrder,
    appendedTrapControls,
    appendedCloneControls,
  );
}

export function moveLevelRegion(
  level: DatLevel,
  rect: GridRect,
  anchor: GridPoint,
  selectedIndices?: ReadonlyArray<number>,
): DatLevel {
  const sourceIndices = selectedIndices ? [...selectedIndices] : rectToIndices(rect);
  if (sourceIndices.length === 0) return level;

  const clipboard = copyLevelRegion(level, rect, sourceIndices);
  const clearedLevel = paintLevelCells(level, sourceIndices, FLOOR_TILE);
  return pasteLevelRegion(clearedLevel, anchor, clipboard);
}

function applyEditorEvent(
  doc: DatLevelsetJsonV1,
  selectedIndex: number,
  event: LevelsetEditorEvent,
): { doc: DatLevelsetJsonV1; selectedIndex: number } {
  switch (event.type) {
    case "set-magic-number":
      return {
        doc: setLevelsetMagicNumber(doc, event.magicNumber),
        selectedIndex,
      };
    case "replace-level":
      if (event.index < 0 || event.index >= doc.levels.length) return { doc, selectedIndex };
      return {
        doc: {
          ...doc,
          levels: doc.levels.map((level, index) => (index === event.index ? event.level : level)),
        },
        selectedIndex,
      };
    case "insert-level": {
      const insertAt = clamp(event.index, 0, doc.levels.length);
      return {
        doc: insertLevel(doc, insertAt, event.level),
        selectedIndex: insertAt,
      };
    }
    case "remove-level": {
      if (event.index < 0 || event.index >= doc.levels.length) return { doc, selectedIndex };
      const nextDoc = removeLevel(doc, event.index);
      const nextSelectedIndex =
        nextDoc.levels.length === 0
          ? 0
          : clamp(
              selectedIndex > event.index ? selectedIndex - 1 : selectedIndex,
              0,
              nextDoc.levels.length - 1,
            );
      return {
        doc: nextDoc,
        selectedIndex: nextSelectedIndex,
      };
    }
    case "move-level": {
      if (event.from < 0 || event.from >= doc.levels.length) return { doc, selectedIndex };
      const target = clamp(event.to, 0, doc.levels.length - 1);
      if (target === event.from) return { doc, selectedIndex };

      let nextSelectedIndex = selectedIndex;
      if (selectedIndex === event.from) nextSelectedIndex = target;
      else if (event.from < selectedIndex && selectedIndex <= target) nextSelectedIndex -= 1;
      else if (target <= selectedIndex && selectedIndex < event.from) nextSelectedIndex += 1;

      return {
        doc: moveLevel(doc, event.from, target),
        selectedIndex: nextSelectedIndex,
      };
    }
    case "replace-doc":
      return {
        doc: event.doc,
        selectedIndex:
          event.doc.levels.length === 0
            ? 0
            : clamp(event.selectedIndex ?? selectedIndex, 0, event.doc.levels.length - 1),
      };
  }
}

export function replayLevelsetEvents(
  baseDoc: DatLevelsetJsonV1,
  events: ReadonlyArray<LevelsetEditorEvent>,
  cursor: number,
): { doc: DatLevelsetJsonV1; selectedIndex: number } {
  let doc = baseDoc;
  let selectedIndex = 0;

  for (let i = 0; i < cursor; i++) {
    const event = events[i];
    if (!event) break;
    const next = applyEditorEvent(doc, selectedIndex, event);
    doc = next.doc;
    selectedIndex = next.selectedIndex;
  }

  return { doc, selectedIndex };
}

export function createLevelsetEditorHistory(baseDoc: DatLevelsetJsonV1): LevelsetEditorHistory {
  return {
    baseDoc,
    events: [],
    selectionByCursor: [0],
    cursor: 0,
    doc: baseDoc,
    selectedIndex: 0,
  };
}

export function selectLevelInHistory(
  state: LevelsetEditorHistory,
  selectedIndex: number,
): LevelsetEditorHistory {
  const maxIndex = Math.max(0, state.doc.levels.length - 1);
  const nextSelectedIndex = state.doc.levels.length === 0 ? 0 : clamp(selectedIndex, 0, maxIndex);
  const selectionByCursor = [...state.selectionByCursor];
  selectionByCursor[state.cursor] = nextSelectedIndex;
  return {
    ...state,
    selectionByCursor,
    selectedIndex: nextSelectedIndex,
  };
}

export function commitLevelsetEvent(
  state: LevelsetEditorHistory,
  event: LevelsetEditorEvent,
): LevelsetEditorHistory {
  const events = [...state.events.slice(0, state.cursor), event];
  const next = applyEditorEvent(state.doc, state.selectedIndex, event);
  const selectionByCursor = [
    ...state.selectionByCursor.slice(0, state.cursor + 1),
    next.selectedIndex,
  ];

  return {
    ...state,
    events,
    selectionByCursor,
    cursor: events.length,
    doc: next.doc,
    selectedIndex: next.selectedIndex,
  };
}

export function undoLevelsetEvent(state: LevelsetEditorHistory): LevelsetEditorHistory {
  if (state.cursor === 0) return state;
  const cursor = state.cursor - 1;
  const replayed = replayLevelsetEvents(state.baseDoc, state.events, cursor);
  const selectedIndex =
    replayed.doc.levels.length === 0
      ? 0
      : clamp(
          state.selectionByCursor[cursor] ?? replayed.selectedIndex,
          0,
          replayed.doc.levels.length - 1,
        );
  return {
    ...state,
    cursor,
    doc: replayed.doc,
    selectedIndex,
  };
}

export function redoLevelsetEvent(state: LevelsetEditorHistory): LevelsetEditorHistory {
  if (state.cursor >= state.events.length) return state;
  const cursor = state.cursor + 1;
  const replayed = replayLevelsetEvents(state.baseDoc, state.events, cursor);
  const selectedIndex =
    replayed.doc.levels.length === 0
      ? 0
      : clamp(
          state.selectionByCursor[cursor] ?? replayed.selectedIndex,
          0,
          replayed.doc.levels.length - 1,
        );
  return {
    ...state,
    cursor,
    doc: replayed.doc,
    selectedIndex,
  };
}

export function updateLevelMetadata(
  level: DatLevel,
  patch: Readonly<{
    number: number;
    time: number;
    chips: number;
    mapDetail: number;
    title?: string;
    author?: string;
    password?: string;
    hint?: string;
    trapControls: ReadonlyArray<TrapControl>;
    cloneControls: ReadonlyArray<CloneControl>;
    movement: ReadonlyArray<number>;
    fieldOrder: ReadonlyArray<number>;
    extraFields: ReadonlyArray<DatExtraField>;
  }>,
): DatLevel {
  const { title: _title, author: _author, password: _password, hint: _hint, ...rest } = level;

  return {
    ...rest,
    number: patch.number,
    time: patch.time,
    chips: patch.chips,
    mapDetail: patch.mapDetail,
    ...(patch.title ? { title: patch.title } : {}),
    ...(patch.author ? { author: patch.author } : {}),
    ...(patch.password ? { password: patch.password } : {}),
    ...(patch.hint ? { hint: patch.hint } : {}),
    trapControls: [...patch.trapControls],
    cloneControls: [...patch.cloneControls],
    movement: [...patch.movement],
    fieldOrder: [...patch.fieldOrder],
    extraFields: [...patch.extraFields],
  };
}
