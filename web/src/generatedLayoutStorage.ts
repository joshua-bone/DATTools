import {
  wallGridFromKey,
  wallGridFromMaskBytes,
  wallGridKeyFromGrid,
  wallMaskBytesFromKey,
} from "@/src/walls-core";
import {
  GENERATE_ALGORITHM_IDS,
  type GeneratedLayoutRecord,
  type GeneratedLayoutFrame,
  type GenerateRecordAlgorithm,
} from "@/web/src/generatedLayouts";

export const GENERATED_LAYOUT_STARRED_STORAGE_KEY = "dattools-generate-starred";

const GENERATED_LAYOUT_KEY_SET_SCHEMA_V1 = "datTools.web.generate.keySet.v1";
const GENERATED_LAYOUT_RECORD_LIST_SCHEMA_V2 = "datTools.web.generate.recordList.v2";

type PersistedGeneratedLayoutRecord = Readonly<{
  recordKey: string;
  wallKey?: string;
  gridKey: string;
  layout?: GeneratedLayoutFrame;
  algorithm: string;
  title: string;
  summary: string;
  seedLabel: string;
  inverted: boolean;
  params: unknown;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStoredLayoutFrame(value: unknown): GeneratedLayoutFrame | undefined {
  if (!isRecord(value)) return undefined;
  const width = value.width;
  const height = value.height;
  if (
    typeof width !== "number" ||
    !Number.isInteger(width) ||
    width < 1 ||
    typeof height !== "number" ||
    !Number.isInteger(height) ||
    height < 1
  ) {
    return undefined;
  }
  return { width, height };
}

function normalizeStoredAlgorithm(value: unknown): GenerateRecordAlgorithm {
  if (typeof value !== "string") return "starred";
  if (value === "starred") return value;
  return GENERATE_ALGORITHM_IDS.includes(value as (typeof GENERATE_ALGORITHM_IDS)[number])
    ? (value as GenerateRecordAlgorithm)
    : "starred";
}

function compareGeneratedLayoutRecords(
  left: Readonly<Pick<GeneratedLayoutRecord, "title" | "recordKey">>,
  right: Readonly<Pick<GeneratedLayoutRecord, "title" | "recordKey">>,
): number {
  return (
    left.title.localeCompare(right.title, "en") ||
    left.recordKey.localeCompare(right.recordKey, "en")
  );
}

function buildLegacyStarredRecord(wallKey: string): GeneratedLayoutRecord {
  return {
    recordKey: wallKey,
    wallKey,
    grid: wallGridFromMaskBytes(wallMaskBytesFromKey(wallKey)),
    algorithm: "starred",
    title: "Starred Layout",
    summary: "Saved locally from Generate",
    seedLabel: "Saved locally",
    inverted: false,
    params: null,
  };
}

function normalizeRecordList(
  records: ReadonlyArray<GeneratedLayoutRecord>,
): ReadonlyArray<GeneratedLayoutRecord> {
  const deduped = new Map<string, GeneratedLayoutRecord>();
  for (const record of records) {
    deduped.set(record.recordKey, record);
  }
  return [...deduped.values()].sort(compareGeneratedLayoutRecords);
}

function buildPersistedRecord(
  record: GeneratedLayoutRecord,
): PersistedGeneratedLayoutRecord | null {
  const grid =
    record.grid ??
    (record.wallKey ? wallGridFromMaskBytes(wallMaskBytesFromKey(record.wallKey)) : null);
  if (!grid) return null;

  return {
    recordKey: record.recordKey,
    ...(record.wallKey ? { wallKey: record.wallKey } : {}),
    gridKey: wallGridKeyFromGrid(grid),
    ...(record.layout ? { layout: record.layout } : {}),
    algorithm: record.algorithm,
    title: record.title,
    summary: record.summary,
    seedLabel: record.seedLabel,
    inverted: record.inverted,
    params: record.params,
  };
}

function parsePersistedRecord(value: unknown): GeneratedLayoutRecord | null {
  if (!isRecord(value)) return null;
  if (typeof value.recordKey !== "string") return null;
  if (typeof value.gridKey !== "string") return null;
  if (typeof value.title !== "string") return null;
  if (typeof value.summary !== "string") return null;
  if (typeof value.seedLabel !== "string") return null;
  if (typeof value.inverted !== "boolean") return null;
  if (value.wallKey !== undefined && typeof value.wallKey !== "string") return null;

  try {
    return {
      recordKey: value.recordKey,
      ...(typeof value.wallKey === "string" ? { wallKey: value.wallKey } : {}),
      grid: wallGridFromKey(value.gridKey),
      ...(normalizeStoredLayoutFrame(value.layout)
        ? { layout: normalizeStoredLayoutFrame(value.layout) }
        : {}),
      algorithm: normalizeStoredAlgorithm(value.algorithm),
      title: value.title,
      summary: value.summary,
      seedLabel: value.seedLabel,
      inverted: value.inverted,
      params:
        normalizeStoredAlgorithm(value.algorithm) === "starred" ? null : (value.params ?? null),
    } as GeneratedLayoutRecord;
  } catch {
    return null;
  }
}

export function parsePersistedGeneratedLayoutRecordList(
  value: string | null,
): ReadonlyArray<GeneratedLayoutRecord> {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return [];

    if (parsed.schema === GENERATED_LAYOUT_KEY_SET_SCHEMA_V1 && Array.isArray(parsed.keys)) {
      return normalizeRecordList(
        parsed.keys
          .filter((key): key is string => typeof key === "string")
          .map((wallKey) => buildLegacyStarredRecord(wallKey)),
      );
    }

    if (
      parsed.schema !== GENERATED_LAYOUT_RECORD_LIST_SCHEMA_V2 ||
      !Array.isArray(parsed.records)
    ) {
      return [];
    }

    return normalizeRecordList(
      parsed.records
        .map((entry) => parsePersistedRecord(entry))
        .filter((record): record is GeneratedLayoutRecord => record !== null),
    );
  } catch {
    return [];
  }
}

export function serializePersistedGeneratedLayoutRecordList(
  records: ReadonlyArray<GeneratedLayoutRecord>,
): string {
  return JSON.stringify({
    schema: GENERATED_LAYOUT_RECORD_LIST_SCHEMA_V2,
    records: normalizeRecordList(records)
      .map((record) => buildPersistedRecord(record))
      .filter((record): record is PersistedGeneratedLayoutRecord => record !== null),
  });
}
