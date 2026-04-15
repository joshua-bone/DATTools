import { parseWallsBank, type WallsBankJson, type WallsBankOccurrence } from "@/src/dat/wallsBank";

type RuntimeImportMeta = ImportMeta & {
  env?: {
    BASE_URL?: string;
  };
};

const baseUrl = (import.meta as RuntimeImportMeta).env?.BASE_URL ?? "/";

export const WALLS_BANK_URL = `${baseUrl}walls/walls-bank.json`;
const BLOCKLISTED_SET_NAMES = new Set<string>(["Bad_Apple"]);

export type WallsBankRecord = Readonly<{
  wallKey: string;
  entries: ReadonlyArray<WallsBankOccurrence>;
  occurrenceCount: number;
  primaryEntry: WallsBankOccurrence;
  searchText: string;
}>;

export type LoadedWallsBank = Readonly<{
  bank: WallsBankJson;
  records: ReadonlyArray<WallsBankRecord>;
}>;

export type FilterWallsBankOptions = Readonly<{
  query: string;
  starredOnly: boolean;
  includeHidden: boolean;
  starredKeys: ReadonlySet<string>;
  hiddenKeys: ReadonlySet<string>;
}>;

function buildSearchText(entries: ReadonlyArray<WallsBankOccurrence>): string {
  return entries
    .map((entry) =>
      `${entry.setName} ${entry.levelNumber} ${entry.levelTitle} ${entry.author ?? ""}`.toLocaleLowerCase(),
    )
    .join("\n");
}

function isBlocklistedOccurrence(entry: WallsBankOccurrence): boolean {
  return BLOCKLISTED_SET_NAMES.has(entry.setName);
}

function buildWallsBankRecords(bank: WallsBankJson): WallsBankRecord[] {
  return Object.entries(bank.masks).flatMap(([wallKey, entries]) => {
    const visibleEntries = entries.filter((entry) => !isBlocklistedOccurrence(entry));
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

export async function loadWallsBank(signal?: AbortSignal): Promise<LoadedWallsBank> {
  const requestInit: RequestInit = {};
  if (signal) requestInit.signal = signal;

  const response = await fetch(WALLS_BANK_URL, requestInit);
  if (!response.ok) {
    throw new Error(
      `Failed to load walls bank: ${response.status} ${response.statusText}. Run npm run build_walls if the asset is missing.`,
    );
  }

  const bank = parseWallsBank((await response.json()) as unknown);
  return {
    bank,
    records: buildWallsBankRecords(bank),
  };
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

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
