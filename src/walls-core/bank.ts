import { wallMaskBytesFromKey } from "@/src/walls-core/mask32";

export const WALL_BANK_SCHEMA = "datTools.walls.bank.v1";

export type WallsBankOccurrence = Readonly<{
  packId: number;
  setName: string;
  packType: string;
  fileName: string;
  levelNumber: number;
  levelTitle: string;
  author?: string;
}>;

export type WallsBankJson = Readonly<{
  schema: typeof WALL_BANK_SCHEMA;
  generatedAt: string;
  source: Readonly<{
    apiBaseUrl: string;
    downloadablePackCount: number;
    skippedPackCount: number;
    failedPackCount: number;
    levelCount: number;
    uniqueWallCount: number;
    wallTileNames: ReadonlyArray<string>;
  }>;
  masks: Readonly<Record<string, ReadonlyArray<WallsBankOccurrence>>>;
}>;

export type WallsBankRecord = Readonly<{
  wallKey: string;
  entries: ReadonlyArray<WallsBankOccurrence>;
  occurrenceCount: number;
  primaryEntry: WallsBankOccurrence;
  searchText: string;
}>;

export type FilterWallsBankOptions = Readonly<{
  query: string;
  starredOnly: boolean;
  includeHidden: boolean;
  starredKeys: ReadonlySet<string>;
  hiddenKeys: ReadonlySet<string>;
}>;

type BuildWallsBankRecordsOptions = Readonly<{
  includeOccurrence?: (entry: WallsBankOccurrence) => boolean;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseString(value: unknown, path: string): string {
  if (typeof value !== "string") throw new Error(`Invalid ${path}: expected string`);
  return value;
}

function parseStringOpt(value: unknown, path: string): string | undefined {
  if (value === undefined) return undefined;
  return parseString(value, path);
}

function parseInteger(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value))
    throw new Error(`Invalid ${path}: expected integer`);
  return value;
}

function parseOccurrence(value: unknown, path: string): WallsBankOccurrence {
  if (!isRecord(value)) throw new Error(`Invalid ${path}: expected object`);
  const author = parseStringOpt(value.author, `${path}.author`);
  return {
    packId: parseInteger(value.packId, `${path}.packId`),
    setName: parseString(value.setName, `${path}.setName`),
    packType: parseString(value.packType, `${path}.packType`),
    fileName: parseString(value.fileName, `${path}.fileName`),
    levelNumber: parseInteger(value.levelNumber, `${path}.levelNumber`),
    levelTitle: parseString(value.levelTitle, `${path}.levelTitle`),
    ...(author ? { author } : {}),
  };
}

function buildSearchText(entries: ReadonlyArray<WallsBankOccurrence>): string {
  return entries
    .map((entry) =>
      `${entry.setName} ${entry.levelNumber} ${entry.levelTitle} ${entry.author ?? ""}`.toLocaleLowerCase(),
    )
    .join("\n");
}

function matchesQuery(record: WallsBankRecord, query: string): boolean {
  const tokens = query
    .toLocaleLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  if (tokens.length === 0) return true;
  return tokens.every((token) => record.searchText.includes(token));
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function parseWallsBank(input: unknown): WallsBankJson {
  if (!isRecord(input)) throw new Error("Invalid walls bank: expected object");
  if (input.schema !== WALL_BANK_SCHEMA) {
    throw new Error(`Invalid walls bank schema: expected '${WALL_BANK_SCHEMA}'`);
  }
  if (!isRecord(input.source)) throw new Error("Invalid walls bank source: expected object");
  if (!isRecord(input.masks)) throw new Error("Invalid walls bank masks: expected object");

  const masks: Record<string, ReadonlyArray<WallsBankOccurrence>> = {};
  for (const [key, value] of Object.entries(input.masks)) {
    wallMaskBytesFromKey(key);
    if (!Array.isArray(value)) throw new Error(`Invalid masks.${key}: expected array`);
    masks[key] = value.map((item, index) => parseOccurrence(item, `masks.${key}[${index}]`));
  }

  return {
    schema: WALL_BANK_SCHEMA,
    generatedAt: parseString(input.generatedAt, "generatedAt"),
    source: {
      apiBaseUrl: parseString(input.source.apiBaseUrl, "source.apiBaseUrl"),
      downloadablePackCount: parseInteger(
        input.source.downloadablePackCount,
        "source.downloadablePackCount",
      ),
      skippedPackCount: parseInteger(input.source.skippedPackCount, "source.skippedPackCount"),
      failedPackCount: parseInteger(input.source.failedPackCount, "source.failedPackCount"),
      levelCount: parseInteger(input.source.levelCount, "source.levelCount"),
      uniqueWallCount: parseInteger(input.source.uniqueWallCount, "source.uniqueWallCount"),
      wallTileNames: Array.isArray(input.source.wallTileNames)
        ? input.source.wallTileNames.map((value, index) =>
            parseString(value, `source.wallTileNames[${index}]`),
          )
        : (() => {
            throw new Error("Invalid source.wallTileNames: expected array");
          })(),
    },
    masks,
  };
}

export function buildWallsBankRecords(
  bank: WallsBankJson,
  options: BuildWallsBankRecordsOptions = {},
): WallsBankRecord[] {
  const includeOccurrence = options.includeOccurrence ?? (() => true);
  return Object.entries(bank.masks).flatMap(([wallKey, entries]) => {
    const visibleEntries = entries.filter(includeOccurrence);
    if (visibleEntries.length === 0) return [];

    const primaryEntry = visibleEntries[0];
    if (!primaryEntry) throw new Error(`Wall mask '${wallKey}' has no occurrences`);

    return {
      wallKey,
      entries: visibleEntries,
      occurrenceCount: visibleEntries.length,
      primaryEntry,
      searchText: buildSearchText(visibleEntries),
    };
  });
}

export function filterWallsBankRecords(
  records: ReadonlyArray<WallsBankRecord>,
  options: FilterWallsBankOptions,
): WallsBankRecord[] {
  return records.filter((record) => {
    if (!options.includeHidden && options.hiddenKeys.has(record.wallKey)) return false;
    if (options.starredOnly && !options.starredKeys.has(record.wallKey)) return false;
    return matchesQuery(record, options.query);
  });
}

export function pickRandomWallsBankRecords(
  records: ReadonlyArray<WallsBankRecord>,
  count: number,
  seed: number,
): WallsBankRecord[] {
  if (count <= 0 || records.length === 0) return [];
  if (records.length <= count) return [...records];

  const rng = mulberry32(seed);
  const indices = records.map((_, index) => index);

  for (let index = indices.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const current = indices[index]!;
    indices[index] = indices[swapIndex]!;
    indices[swapIndex] = current;
  }

  return indices.slice(0, count).map((index) => records[index]!);
}

export function findWallsBankRecord(
  records: ReadonlyArray<WallsBankRecord>,
  wallKey: string | null,
): WallsBankRecord | null {
  if (!wallKey) return null;
  return records.find((record) => record.wallKey === wallKey) ?? null;
}
