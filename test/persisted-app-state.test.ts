import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { createEmptyLevel } from "@/web/src/levelEditing";
import {
  DEFAULT_PERSISTED_APP_PREFERENCES,
  parsePersistedAppPreferences,
  parsePersistedEditorSession,
  serializePersistedAppPreferences,
  serializePersistedEditorSession,
} from "@/web/src/persistedAppState";

function makeDoc(): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [createEmptyLevel(1, { title: "One" }), createEmptyLevel(2, { title: "Two" })],
  };
}

describe("persisted app preferences", () => {
  it("round-trips the persisted toggle state", () => {
    const serialized = serializePersistedAppPreferences({
      showSecrets: false,
      showConnections: true,
      showMonsterOrder: false,
      showValidityWarnings: true,
      threeDLevelsEnabled: true,
      threeDParallaxView: true,
      lowDetailRendering: true,
    });

    expect(parsePersistedAppPreferences(serialized)).toEqual({
      showSecrets: false,
      showConnections: true,
      showMonsterOrder: false,
      showValidityWarnings: true,
      threeDLevelsEnabled: true,
      threeDParallaxView: true,
      lowDetailRendering: true,
    });
  });

  it("falls back to defaults for invalid or partial stored values", () => {
    expect(parsePersistedAppPreferences(null)).toEqual(DEFAULT_PERSISTED_APP_PREFERENCES);
    expect(parsePersistedAppPreferences('{"schema":"wrong"}')).toEqual(
      DEFAULT_PERSISTED_APP_PREFERENCES,
    );
    expect(
      parsePersistedAppPreferences(
        JSON.stringify({
          schema: "datTools.web.appPreferences.v1",
          showSecrets: false,
          showConnections: "yes",
        }),
      ),
    ).toEqual({
      ...DEFAULT_PERSISTED_APP_PREFERENCES,
      showSecrets: false,
    });
  });

  it("reads the previous viewport-renderer flag for compatibility", () => {
    expect(
      parsePersistedAppPreferences(
        JSON.stringify({
          schema: "datTools.web.appPreferences.v1",
          experimentalViewportRenderer: true,
        }),
      ),
    ).toEqual({
      ...DEFAULT_PERSISTED_APP_PREFERENCES,
      lowDetailRendering: true,
    });
  });

  it("migrates the previous orthographic-view flag into the parallax toggle", () => {
    expect(
      parsePersistedAppPreferences(
        JSON.stringify({
          schema: "datTools.web.appPreferences.v1",
          threeDOrthographicView: false,
        }),
      ),
    ).toEqual({
      ...DEFAULT_PERSISTED_APP_PREFERENCES,
      threeDParallaxView: true,
    });
  });
});

describe("persisted editor session", () => {
  it("round-trips the current document snapshot", () => {
    const doc = makeDoc();
    const serialized = serializePersistedEditorSession({
      doc,
      fileName: "LEVELS.DAT",
      selectedIndex: 1,
    });

    expect(parsePersistedEditorSession(serialized, "FALLBACK.DAT")).toEqual({
      doc,
      fileName: "LEVELS.DAT",
      selectedIndex: 1,
    });
  });

  it("clamps the selected level and falls back on invalid names", () => {
    const doc = makeDoc();
    const parsed = parsePersistedEditorSession(
      JSON.stringify({
        schema: "datTools.web.editorSession.v1",
        fileName: "   ",
        selectedIndex: 99,
        documentJson: JSON.stringify(doc),
      }),
      "FALLBACK.DAT",
    );

    expect(parsed).toEqual({
      doc,
      fileName: "FALLBACK.DAT",
      selectedIndex: 1,
    });
  });

  it("ignores invalid stored session blobs", () => {
    expect(parsePersistedEditorSession(null, "FALLBACK.DAT")).toBeNull();
    expect(parsePersistedEditorSession("not-json", "FALLBACK.DAT")).toBeNull();
    expect(
      parsePersistedEditorSession(
        JSON.stringify({
          schema: "datTools.web.editorSession.v1",
          documentJson: '{"schema":"bad"}',
        }),
        "FALLBACK.DAT",
      ),
    ).toBeNull();
  });
});
