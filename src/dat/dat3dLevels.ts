import type { DatLevelJson, DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { tileNameFromCode } from "@/src/dat/cc1Tiles";

export const DAT_3D_AIR_TILE = tileNameFromCode(32);
export const DAT_3D_ELEVATOR_TILE = tileNameFromCode(57);
export const DAT_3D_CLOUD_TILE = tileNameFromCode(0x72);
export const DAT_3D_FULL_CELL_TERRAIN_TILES = new Set<string>([DAT_3D_AIR_TILE, DAT_3D_CLOUD_TILE]);
export const DAT_3D_VALID_TERRAIN_TILES = new Set<string>([
  ...DAT_3D_FULL_CELL_TERRAIN_TILES,
  "CHIP_EXIT",
]);

const BOARD_TILE_COUNT = 32 * 32;
const FLOOR_TILE = "FLOOR";
const TITLE_SUFFIX_RE = /^(.*)\\([1-9]\d*)$/;

export function getDat3dPaintTile(tile: string, layerZ: number): string {
  return layerZ <= 1 && DAT_3D_FULL_CELL_TERRAIN_TILES.has(tile) ? FLOOR_TILE : tile;
}

type MutableLevel = {
  -readonly [K in keyof DatLevelJson]: DatLevelJson[K];
};

export type Parsed3dTitle = Readonly<{
  baseTitle: string;
  z: number;
}>;

export type Logical3dLayer = Readonly<{
  z: number;
  rawIndex: number;
  level: DatLevelJson;
}>;

export type Logical3dLevel = Readonly<{
  groupedIndex: number;
  displayNumber: number;
  displayTitle: string;
  baseTitle: string;
  uses3dEncoding: boolean;
  docStartIndex: number;
  docEndIndex: number;
  layers: ReadonlyArray<Logical3dLayer>;
}>;

export type Logical3dLevelset = Readonly<{
  levels: ReadonlyArray<Logical3dLevel>;
  rawToLogicalIndex: ReadonlyArray<number>;
}>;

export type Editable3dLevel = Readonly<{
  baseTitle: string;
  displayTitle: string;
  uses3dEncoding: boolean;
  layers: ReadonlyArray<DatLevelJson>;
}>;

function cloneMapLayer(tiles: ReadonlyArray<string>): string[] {
  return [...tiles];
}

export function cloneDatLevel(level: DatLevelJson): DatLevelJson {
  return {
    ...level,
    map: {
      ...level.map,
      top: cloneMapLayer(level.map.top),
      bottom: cloneMapLayer(level.map.bottom),
    },
    trapControls: level.trapControls.map((item) => ({ ...item })),
    cloneControls: level.cloneControls.map((item) => ({ ...item })),
    movement: [...level.movement],
    fieldOrder: [...level.fieldOrder],
    extraFields: level.extraFields.map((field) => ({
      field: field.field,
      data: { ...field.data },
    })),
  };
}

function cloneLevels(levels: ReadonlyArray<DatLevelJson>): DatLevelJson[] {
  return levels.map(cloneDatLevel);
}

function isGlobalFieldKey(key: keyof DatLevelJson): boolean {
  return (
    key === "number" ||
    key === "time" ||
    key === "chips" ||
    key === "mapDetail" ||
    key === "title" ||
    key === "author" ||
    key === "password" ||
    key === "fieldOrder" ||
    key === "extraFields"
  );
}

export function cloneCanonicalMetadata(canonical: DatLevelJson, layer: DatLevelJson): DatLevelJson {
  const next: MutableLevel = {
    ...layer,
    time: canonical.time,
    chips: canonical.chips,
    mapDetail: canonical.mapDetail,
    fieldOrder: [...canonical.fieldOrder],
    extraFields: canonical.extraFields.map((field) => ({
      field: field.field,
      data: { ...field.data },
    })),
  };

  if (canonical.author !== undefined) next.author = canonical.author;
  else delete next.author;

  if (canonical.password !== undefined) next.password = canonical.password;
  else delete next.password;

  return next;
}

export function createFilledLevelFromTemplate(
  template: DatLevelJson,
  topTile: string,
  bottomTile: string,
): DatLevelJson {
  const nextLevel: DatLevelJson = {
    ...cloneDatLevel(template),
    map: {
      width: 32,
      height: 32,
      top: Array<string>(BOARD_TILE_COUNT).fill(topTile),
      bottom: Array<string>(BOARD_TILE_COUNT).fill(bottomTile),
    },
    trapControls: [],
    cloneControls: [],
    movement: [],
  };

  const { hint: _hint, ...withoutHint } = nextLevel;
  return cloneCanonicalMetadata(template, withoutHint);
}

export function parse3dTitle(title?: string): Parsed3dTitle | null {
  if (!title) return null;
  const match = TITLE_SUFFIX_RE.exec(title);
  if (!match) return null;
  return {
    baseTitle: match[1] ?? "",
    z: Number(match[2]),
  };
}

function buildDescendingRun(
  levels: ReadonlyArray<DatLevelJson>,
  startIndex: number,
  parsed: Parsed3dTitle,
): Logical3dLevel | null {
  if (parsed.z <= 1) return null;

  const run: Array<{ rawIndex: number; parsed: Parsed3dTitle; level: DatLevelJson }> = [];
  let expectedZ = parsed.z;
  let index = startIndex;

  while (index < levels.length) {
    const level = levels[index]!;
    const parsedTitle = parse3dTitle(level.title);
    if (!parsedTitle || parsedTitle.baseTitle !== parsed.baseTitle || parsedTitle.z !== expectedZ) {
      break;
    }
    run.push({ rawIndex: index, parsed: parsedTitle, level });
    if (expectedZ === 1) break;
    expectedZ -= 1;
    index += 1;
  }

  if (run.length !== parsed.z || run[run.length - 1]?.parsed.z !== 1) return null;

  const layers = [...run].reverse().map((entry) => ({
    z: entry.parsed.z,
    rawIndex: entry.rawIndex,
    level: entry.level,
  }));

  return {
    groupedIndex: -1,
    displayNumber: -1,
    displayTitle: parsed.baseTitle,
    baseTitle: parsed.baseTitle,
    uses3dEncoding: true,
    docStartIndex: startIndex,
    docEndIndex: startIndex + run.length,
    layers,
  };
}

function buildAscendingRun(
  levels: ReadonlyArray<DatLevelJson>,
  startIndex: number,
  parsed: Parsed3dTitle,
): Logical3dLevel {
  const run: Array<{ rawIndex: number; parsed: Parsed3dTitle; level: DatLevelJson }> = [];
  let expectedZ = 1;
  let index = startIndex;

  while (index < levels.length) {
    const level = levels[index]!;
    const parsedTitle = parse3dTitle(level.title);
    if (!parsedTitle || parsedTitle.baseTitle !== parsed.baseTitle || parsedTitle.z !== expectedZ) {
      break;
    }
    run.push({ rawIndex: index, parsed: parsedTitle, level });
    expectedZ += 1;
    index += 1;
  }

  return {
    groupedIndex: -1,
    displayNumber: -1,
    displayTitle: parsed.baseTitle,
    baseTitle: parsed.baseTitle,
    uses3dEncoding: true,
    docStartIndex: startIndex,
    docEndIndex: startIndex + run.length,
    layers: run.map((entry) => ({
      z: entry.parsed.z,
      rawIndex: entry.rawIndex,
      level: entry.level,
    })),
  };
}

function makeSingleLogicalLevel(
  level: DatLevelJson,
  rawIndex: number,
  parsedTitle: Parsed3dTitle | null,
): Logical3dLevel {
  const uses3dEncoding = parsedTitle?.z === 1;
  return {
    groupedIndex: -1,
    displayNumber: -1,
    displayTitle: uses3dEncoding ? parsedTitle.baseTitle : (level.title ?? `Level ${level.number}`),
    baseTitle: uses3dEncoding ? parsedTitle.baseTitle : (level.title ?? `Level ${level.number}`),
    uses3dEncoding,
    docStartIndex: rawIndex,
    docEndIndex: rawIndex + 1,
    layers: [
      {
        z: 1,
        rawIndex,
        level,
      },
    ],
  };
}

export function buildLogical3dLevelset(doc: DatLevelsetJsonV1): Logical3dLevelset {
  const levels: Logical3dLevel[] = [];
  const rawToLogicalIndex: number[] = Array<number>(doc.levels.length).fill(0);

  for (let index = 0; index < doc.levels.length; ) {
    const level = doc.levels[index]!;
    const parsedTitle = parse3dTitle(level.title);

    let logicalLevel: Logical3dLevel;
    if (!parsedTitle) {
      logicalLevel = makeSingleLogicalLevel(level, index, null);
    } else if (parsedTitle.z === 1) {
      logicalLevel = buildAscendingRun(doc.levels, index, parsedTitle);
    } else {
      logicalLevel =
        buildDescendingRun(doc.levels, index, parsedTitle) ??
        makeSingleLogicalLevel(level, index, null);
    }

    const groupedIndex = levels.length;
    const withOrdinal: Logical3dLevel = {
      ...logicalLevel,
      groupedIndex,
      displayNumber: groupedIndex + 1,
    };
    levels.push(withOrdinal);

    for (let rawIndex = withOrdinal.docStartIndex; rawIndex < withOrdinal.docEndIndex; rawIndex++) {
      rawToLogicalIndex[rawIndex] = groupedIndex;
    }

    index = withOrdinal.docEndIndex;
  }

  return {
    levels,
    rawToLogicalIndex,
  };
}

export function logicalLevelIndexForRawIndex(
  logicalLevelset: Logical3dLevelset,
  rawIndex: number,
): number {
  if (rawIndex < 0 || rawIndex >= logicalLevelset.rawToLogicalIndex.length) return 0;
  return logicalLevelset.rawToLogicalIndex[rawIndex] ?? 0;
}

export function getLogical3dLevelForRawIndex(
  logicalLevelset: Logical3dLevelset,
  rawIndex: number,
): Logical3dLevel | null {
  const logicalIndex = logicalLevelIndexForRawIndex(logicalLevelset, rawIndex);
  return logicalLevelset.levels[logicalIndex] ?? null;
}

export function editable3dLevelsFromDoc(doc: DatLevelsetJsonV1): Editable3dLevel[] {
  return buildLogical3dLevelset(doc).levels.map((level) => ({
    baseTitle: level.baseTitle,
    displayTitle: level.displayTitle,
    uses3dEncoding: level.uses3dEncoding || level.layers.length > 1,
    layers: cloneLevels(level.layers.map((layer) => layer.level)),
  }));
}

function buildEncodedRawLevels(
  group: Editable3dLevel,
  groupedOrdinal: number,
  numberMode: "slot" | "group",
): DatLevelJson[] {
  const canonical = group.layers[0]!;
  const nextLevels: DatLevelJson[] = [];

  for (let z = group.layers.length; z >= 1; z--) {
    const layer = group.layers[z - 1]!;
    const merged = cloneCanonicalMetadata(canonical, layer);
    const nextTitle = `${group.baseTitle}\\${z}`;
    const nextLevelBase = {
      ...cloneDatLevel(merged),
      title: nextTitle,
      map: {
        ...layer.map,
        top: cloneMapLayer(layer.map.top),
        bottom: cloneMapLayer(layer.map.bottom),
      },
      trapControls: layer.trapControls.map((item) => ({ ...item })),
      cloneControls: layer.cloneControls.map((item) => ({ ...item })),
      movement: [...layer.movement],
      number: numberMode === "group" ? groupedOrdinal : 0,
    };
    const nextLevel: MutableLevel =
      layer.hint !== undefined ? { ...nextLevelBase, hint: layer.hint } : nextLevelBase;
    nextLevels.push(nextLevel);
  }

  return nextLevels;
}

function buildSingleRawLevel(
  group: Editable3dLevel,
  groupedOrdinal: number,
  numberMode: "slot" | "group",
): DatLevelJson {
  const base = cloneDatLevel(group.layers[0]!);
  const next: MutableLevel = {
    ...base,
    number: numberMode === "group" ? groupedOrdinal : 0,
  };

  if (group.layers.length > 1 || group.uses3dEncoding) {
    next.title = `${group.baseTitle}\\1`;
  } else if (group.displayTitle) {
    next.title = group.displayTitle;
  } else {
    delete next.title;
  }

  return next;
}

export function rawDocFromEditable3dLevels(
  magicNumber: number,
  groups: ReadonlyArray<Editable3dLevel>,
  options: Readonly<{
    numberMode?: "slot" | "group";
  }> = {},
): DatLevelsetJsonV1 {
  const numberMode = options.numberMode ?? "slot";
  const rawLevels: DatLevelJson[] = [];

  groups.forEach((group, groupedIndex) => {
    const groupedOrdinal = groupedIndex + 1;
    if (group.layers.length > 1 || group.uses3dEncoding) {
      rawLevels.push(...buildEncodedRawLevels(group, groupedOrdinal, numberMode));
      return;
    }
    rawLevels.push(buildSingleRawLevel(group, groupedOrdinal, numberMode));
  });

  const numberedLevels =
    numberMode === "slot"
      ? rawLevels.map((level, index) => ({
          ...level,
          number: index + 1,
        }))
      : rawLevels;

  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels: numberedLevels,
  };
}

export function export3dLevelsetDoc(doc: DatLevelsetJsonV1): DatLevelsetJsonV1 {
  return rawDocFromEditable3dLevels(doc.magicNumber, editable3dLevelsFromDoc(doc), {
    numberMode: "group",
  });
}

export function countChipsInLogical3dLevel(level: Logical3dLevel): number {
  let count = 0;

  for (const layer of level.layers) {
    for (let index = 0; index < BOARD_TILE_COUNT; index++) {
      if (layer.level.map.top[index] === "CHIP" || layer.level.map.bottom[index] === "CHIP") {
        count += 1;
      }
    }
  }

  return count;
}

export function withInsertedTopLayer(group: Editable3dLevel): Editable3dLevel {
  const canonical = group.layers[0]!;
  const nextLayer = createFilledLevelFromTemplate(canonical, DAT_3D_AIR_TILE, DAT_3D_AIR_TILE);
  return {
    ...group,
    uses3dEncoding: true,
    layers: [...cloneLevels(group.layers), nextLayer],
  };
}

export function withInsertedBottomLayer(group: Editable3dLevel): Editable3dLevel {
  const canonical = group.layers[0]!;
  const nextBottom = createFilledLevelFromTemplate(canonical, FLOOR_TILE, FLOOR_TILE);
  return {
    ...group,
    uses3dEncoding: true,
    layers: [
      nextBottom,
      ...cloneLevels(group.layers).map((layer) => cloneCanonicalMetadata(canonical, layer)),
    ],
  };
}

export function withRemovedTopLayer(group: Editable3dLevel): Editable3dLevel {
  if (group.layers.length <= 1) return group;
  return {
    ...group,
    uses3dEncoding: group.layers.length - 1 > 1 || group.uses3dEncoding,
    layers: cloneLevels(group.layers.slice(0, -1)),
  };
}

export function withRemovedBottomLayer(group: Editable3dLevel): Editable3dLevel {
  if (group.layers.length <= 1) return group;
  const canonical = group.layers[0]!;
  const remaining = cloneLevels(group.layers.slice(1));
  const nextLowest = cloneCanonicalMetadata(canonical, remaining[0]!);
  return {
    ...group,
    uses3dEncoding: remaining.length > 1 || group.uses3dEncoding,
    layers: [nextLowest, ...remaining.slice(1)],
  };
}
