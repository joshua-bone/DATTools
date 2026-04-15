export const WALLS_BANK_STARRED_STORAGE_KEY = "dattools-walls-starred";
export const WALLS_BANK_HIDDEN_STORAGE_KEY = "dattools-walls-hidden";

const WALLS_KEY_SET_SCHEMA = "datTools.web.walls.keySet.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parsePersistedWallsKeySet(value: string | null): ReadonlySet<string> {
  if (!value) return new Set<string>();

  try {
    const parsed = JSON.parse(value);
    if (
      !isRecord(parsed) ||
      parsed.schema !== WALLS_KEY_SET_SCHEMA ||
      !Array.isArray(parsed.keys)
    ) {
      return new Set<string>();
    }

    return new Set(parsed.keys.filter((key): key is string => typeof key === "string"));
  } catch {
    return new Set<string>();
  }
}

export function serializePersistedWallsKeySet(keys: ReadonlySet<string>): string {
  return JSON.stringify({
    schema: WALLS_KEY_SET_SCHEMA,
    keys: [...keys].sort((a, b) => a.localeCompare(b, "en")),
  });
}
