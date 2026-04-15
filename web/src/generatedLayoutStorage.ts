export const GENERATED_LAYOUT_STARRED_STORAGE_KEY = "dattools-generate-starred";

const GENERATED_LAYOUT_KEY_SET_SCHEMA = "datTools.web.generate.keySet.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parsePersistedGeneratedLayoutKeySet(value: string | null): ReadonlySet<string> {
  if (!value) return new Set<string>();

  try {
    const parsed = JSON.parse(value);
    if (
      !isRecord(parsed) ||
      parsed.schema !== GENERATED_LAYOUT_KEY_SET_SCHEMA ||
      !Array.isArray(parsed.keys)
    ) {
      return new Set<string>();
    }

    return new Set(parsed.keys.filter((key): key is string => typeof key === "string"));
  } catch {
    return new Set<string>();
  }
}

export function serializePersistedGeneratedLayoutKeySet(keys: ReadonlySet<string>): string {
  return JSON.stringify({
    schema: GENERATED_LAYOUT_KEY_SET_SCHEMA,
    keys: [...keys].sort((a, b) => a.localeCompare(b, "en")),
  });
}
