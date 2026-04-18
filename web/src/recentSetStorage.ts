import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelsetJsonV1,
} from "@/src/dat/datLevelsetJsonV1";

export const RECENT_SETS_STORAGE_KEY = "dattools-recent-sets";

const PERSISTED_RECENT_SETS_SCHEMA = "datTools.web.recentSets.v1";

export type PersistedRecentSetEntry = Readonly<{
  id: string;
  fileName: string;
  title: string;
  updatedAt: number;
  levelCount: number;
  selectedIndex: number;
  selectedLevelTitle: string;
  width: number | null;
  height: number | null;
  thumbnailDataUrl: string | null;
  documentJson: string;
}>;

export type DecodedRecentSetEntry = Readonly<{
  doc: DatLevelsetJsonV1;
  fileName: string;
  selectedIndex: number;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clampSelectedIndex(doc: DatLevelsetJsonV1, selectedIndex: number): number {
  if (doc.levels.length <= 0) return 0;
  return Math.max(0, Math.min(Math.trunc(selectedIndex), doc.levels.length - 1));
}

function normalizeRecentSetTitle(fileName: string): string {
  const trimmed = fileName.trim();
  if (trimmed.length === 0) return "Untitled Levelset";
  const dotIndex = trimmed.lastIndexOf(".");
  return dotIndex > 0 ? trimmed.slice(0, dotIndex) : trimmed;
}

export function createRecentSetId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `recent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createPersistedRecentSetEntry(
  options: Readonly<{
    id: string;
    doc: DatLevelsetJsonV1;
    fileName: string;
    selectedIndex: number;
    thumbnailDataUrl?: string | null;
    updatedAt?: number;
  }>,
): PersistedRecentSetEntry {
  const nextSelectedIndex = clampSelectedIndex(options.doc, options.selectedIndex);
  const selectedLevel = options.doc.levels[nextSelectedIndex] ?? null;
  return {
    id: options.id,
    fileName: options.fileName,
    title: normalizeRecentSetTitle(options.fileName),
    updatedAt: options.updatedAt ?? Date.now(),
    levelCount: options.doc.levels.length,
    selectedIndex: nextSelectedIndex,
    selectedLevelTitle: selectedLevel?.title?.trim() || `Level ${nextSelectedIndex + 1}`,
    width: selectedLevel ? 32 : null,
    height: selectedLevel ? 32 : null,
    thumbnailDataUrl: options.thumbnailDataUrl ?? null,
    documentJson: stringifyDatLevelsetJsonV1(options.doc),
  };
}

export function decodePersistedRecentSetEntry(
  entry: PersistedRecentSetEntry,
): DecodedRecentSetEntry {
  const doc = parseDatLevelsetJsonV1(JSON.parse(entry.documentJson) as unknown);
  return {
    doc,
    fileName: entry.fileName,
    selectedIndex: clampSelectedIndex(doc, entry.selectedIndex),
  };
}

export function findMatchingRecentSetId(
  entries: ReadonlyArray<PersistedRecentSetEntry>,
  doc: DatLevelsetJsonV1,
  fileName: string,
): string | null {
  const documentJson = stringifyDatLevelsetJsonV1(doc);
  const match = entries.find(
    (entry) => entry.fileName === fileName && entry.documentJson === documentJson,
  );
  return match?.id ?? null;
}

export function upsertRecentSetEntry(
  entries: ReadonlyArray<PersistedRecentSetEntry>,
  nextEntry: PersistedRecentSetEntry,
): PersistedRecentSetEntry[] {
  return [
    nextEntry,
    ...entries
      .filter((entry) => entry.id !== nextEntry.id)
      .sort((a, b) => b.updatedAt - a.updatedAt || a.title.localeCompare(b.title)),
  ];
}

export function removeRecentSetEntry(
  entries: ReadonlyArray<PersistedRecentSetEntry>,
  id: string,
): PersistedRecentSetEntry[] {
  return entries.filter((entry) => entry.id !== id);
}

export function parsePersistedRecentSets(value: string | null): PersistedRecentSetEntry[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!isRecord(parsed) || parsed.schema !== PERSISTED_RECENT_SETS_SCHEMA) return [];
    if (!Array.isArray(parsed.entries)) return [];

    return parsed.entries.flatMap((entry) => {
      if (!isRecord(entry)) return [];
      if (typeof entry.id !== "string" || entry.id.trim().length === 0) return [];
      if (typeof entry.fileName !== "string" || entry.fileName.trim().length === 0) return [];
      if (typeof entry.title !== "string" || entry.title.trim().length === 0) return [];
      if (typeof entry.updatedAt !== "number" || !Number.isFinite(entry.updatedAt)) return [];
      if (
        typeof entry.levelCount !== "number" ||
        !Number.isFinite(entry.levelCount) ||
        entry.levelCount < 1
      )
        return [];
      if (
        typeof entry.selectedIndex !== "number" ||
        !Number.isFinite(entry.selectedIndex) ||
        entry.selectedIndex < 0
      ) {
        return [];
      }
      if (
        typeof entry.selectedLevelTitle !== "string" ||
        entry.selectedLevelTitle.trim().length === 0
      ) {
        return [];
      }
      if (entry.width !== null && (typeof entry.width !== "number" || entry.width < 0)) return [];
      if (entry.height !== null && (typeof entry.height !== "number" || entry.height < 0))
        return [];
      if (entry.thumbnailDataUrl !== null && typeof entry.thumbnailDataUrl !== "string") return [];
      if (typeof entry.documentJson !== "string" || entry.documentJson.trim().length === 0)
        return [];

      try {
        const doc = parseDatLevelsetJsonV1(JSON.parse(entry.documentJson) as unknown);
        const selectedIndex = clampSelectedIndex(doc, entry.selectedIndex);
        const selectedLevel = doc.levels[selectedIndex] ?? null;
        return [
          {
            id: entry.id,
            fileName: entry.fileName,
            title: entry.title,
            updatedAt: entry.updatedAt,
            levelCount: doc.levels.length,
            selectedIndex,
            selectedLevelTitle: selectedLevel?.title?.trim() || `Level ${selectedIndex + 1}`,
            width: selectedLevel ? 32 : null,
            height: selectedLevel ? 32 : null,
            thumbnailDataUrl: entry.thumbnailDataUrl,
            documentJson: stringifyDatLevelsetJsonV1(doc),
          } satisfies PersistedRecentSetEntry,
        ];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

export function serializePersistedRecentSets(
  entries: ReadonlyArray<PersistedRecentSetEntry>,
): string {
  return JSON.stringify({
    schema: PERSISTED_RECENT_SETS_SCHEMA,
    entries,
  });
}
