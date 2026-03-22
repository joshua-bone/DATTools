import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelsetJsonV1,
} from "@/src/dat/datLevelsetJsonV1";

export const APP_PREFERENCES_STORAGE_KEY = "dattools-app-preferences";
export const EDITOR_SESSION_STORAGE_KEY = "dattools-editor-session";

const PERSISTED_APP_PREFERENCES_SCHEMA = "datTools.web.appPreferences.v1";
const PERSISTED_EDITOR_SESSION_SCHEMA = "datTools.web.editorSession.v1";

export type PersistedAppPreferences = Readonly<{
  showSecrets: boolean;
  showConnections: boolean;
  showMonsterOrder: boolean;
  showValidityWarnings: boolean;
  threeDLevelsEnabled: boolean;
}>;

export type PersistedEditorSession = Readonly<{
  doc: DatLevelsetJsonV1;
  fileName: string;
  selectedIndex: number;
}>;

export const DEFAULT_PERSISTED_APP_PREFERENCES: PersistedAppPreferences = {
  showSecrets: true,
  showConnections: true,
  showMonsterOrder: true,
  showValidityWarnings: true,
  threeDLevelsEnabled: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readBoolean(
  record: Record<string, unknown>,
  key: keyof PersistedAppPreferences,
  fallback: boolean,
): boolean {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
}

function clampSelectedIndex(doc: DatLevelsetJsonV1, selectedIndex: number): number {
  if (doc.levels.length === 0) return 0;
  return Math.min(Math.max(Math.trunc(selectedIndex), 0), doc.levels.length - 1);
}

export function parsePersistedAppPreferences(value: string | null): PersistedAppPreferences {
  if (!value) return DEFAULT_PERSISTED_APP_PREFERENCES;

  try {
    const parsed = JSON.parse(value);
    if (!isRecord(parsed) || parsed.schema !== PERSISTED_APP_PREFERENCES_SCHEMA) {
      return DEFAULT_PERSISTED_APP_PREFERENCES;
    }

    return {
      showSecrets: readBoolean(
        parsed,
        "showSecrets",
        DEFAULT_PERSISTED_APP_PREFERENCES.showSecrets,
      ),
      showConnections: readBoolean(
        parsed,
        "showConnections",
        DEFAULT_PERSISTED_APP_PREFERENCES.showConnections,
      ),
      showMonsterOrder: readBoolean(
        parsed,
        "showMonsterOrder",
        DEFAULT_PERSISTED_APP_PREFERENCES.showMonsterOrder,
      ),
      showValidityWarnings: readBoolean(
        parsed,
        "showValidityWarnings",
        DEFAULT_PERSISTED_APP_PREFERENCES.showValidityWarnings,
      ),
      threeDLevelsEnabled: readBoolean(
        parsed,
        "threeDLevelsEnabled",
        DEFAULT_PERSISTED_APP_PREFERENCES.threeDLevelsEnabled,
      ),
    };
  } catch {
    return DEFAULT_PERSISTED_APP_PREFERENCES;
  }
}

export function serializePersistedAppPreferences(preferences: PersistedAppPreferences): string {
  return JSON.stringify({
    schema: PERSISTED_APP_PREFERENCES_SCHEMA,
    ...preferences,
  });
}

export function parsePersistedEditorSession(
  value: string | null,
  fallbackFileName: string,
): PersistedEditorSession | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (!isRecord(parsed) || parsed.schema !== PERSISTED_EDITOR_SESSION_SCHEMA) {
      return null;
    }

    const documentJson = parsed.documentJson;
    if (typeof documentJson !== "string") return null;

    const doc = parseDatLevelsetJsonV1(JSON.parse(documentJson));
    const fileName =
      typeof parsed.fileName === "string" && parsed.fileName.trim().length > 0
        ? parsed.fileName
        : fallbackFileName;
    const selectedIndex =
      typeof parsed.selectedIndex === "number" && Number.isFinite(parsed.selectedIndex)
        ? clampSelectedIndex(doc, parsed.selectedIndex)
        : 0;

    return {
      doc,
      fileName,
      selectedIndex,
    };
  } catch {
    return null;
  }
}

export function serializePersistedEditorSession(session: PersistedEditorSession): string {
  return JSON.stringify({
    schema: PERSISTED_EDITOR_SESSION_SCHEMA,
    fileName: session.fileName,
    selectedIndex: clampSelectedIndex(session.doc, session.selectedIndex),
    documentJson: stringifyDatLevelsetJsonV1(session.doc),
  });
}
