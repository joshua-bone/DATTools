import { describe, expect, it } from "vitest";

import type { DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { createEmptyLevel } from "@/web/src/levelEditing";
import {
  createPersistedRecentSetEntry,
  decodePersistedRecentSetEntry,
  findMatchingRecentSetId,
  parsePersistedRecentSets,
  removeRecentSetEntry,
  serializePersistedRecentSets,
  upsertRecentSetEntry,
} from "@/web/src/recentSetStorage";

function makeDoc(): DatLevelsetJsonV1 {
  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: 0x0002aaac,
    levels: [createEmptyLevel(1, { title: "One" }), createEmptyLevel(2, { title: "Two" })],
  };
}

describe("recent set storage", () => {
  it("round-trips a persisted recent set entry", () => {
    const doc = makeDoc();
    const encoded = serializePersistedRecentSets([
      createPersistedRecentSetEntry({
        id: "recent-1",
        doc,
        fileName: "LEVELS.DAT",
        selectedIndex: 1,
        thumbnailDataUrl: "data:image/png;base64,AAAA",
        updatedAt: 1_776_254_400_000,
      }),
    ]);

    const [entry] = parsePersistedRecentSets(encoded);
    expect(entry).toBeDefined();
    if (!entry) throw new Error("Expected persisted recent set entry");
    expect(entry).toEqual(
      expect.objectContaining({
        id: "recent-1",
        fileName: "LEVELS.DAT",
        title: "LEVELS",
        updatedAt: 1_776_254_400_000,
        levelCount: 2,
        selectedIndex: 1,
        selectedLevelTitle: "Two",
        width: 32,
        height: 32,
        thumbnailDataUrl: "data:image/png;base64,AAAA",
      }),
    );

    expect(decodePersistedRecentSetEntry(entry)).toEqual({
      doc,
      fileName: "LEVELS.DAT",
      selectedIndex: 1,
    });
  });

  it("upserts by id and keeps the latest entry first", () => {
    const doc = makeDoc();
    const older = createPersistedRecentSetEntry({
      id: "recent-1",
      doc,
      fileName: "OLDER.DAT",
      selectedIndex: 0,
      updatedAt: 10,
    });
    const newer = createPersistedRecentSetEntry({
      id: "recent-2",
      doc,
      fileName: "NEWER.DAT",
      selectedIndex: 0,
      updatedAt: 20,
    });
    const updatedOlder = createPersistedRecentSetEntry({
      id: "recent-1",
      doc,
      fileName: "OLDER.DAT",
      selectedIndex: 1,
      updatedAt: 30,
    });

    expect(upsertRecentSetEntry([older, newer], updatedOlder).map((entry) => entry.id)).toEqual([
      "recent-1",
      "recent-2",
    ]);
  });

  it("removes entries by id", () => {
    const doc = makeDoc();
    const entries = [
      createPersistedRecentSetEntry({
        id: "recent-1",
        doc,
        fileName: "ONE.DAT",
        selectedIndex: 0,
        updatedAt: 1,
      }),
      createPersistedRecentSetEntry({
        id: "recent-2",
        doc,
        fileName: "TWO.DAT",
        selectedIndex: 0,
        updatedAt: 2,
      }),
    ];

    expect(removeRecentSetEntry(entries, "recent-1").map((entry) => entry.id)).toEqual([
      "recent-2",
    ]);
  });

  it("matches the current session document to an existing recent set", () => {
    const doc = makeDoc();
    const entry = createPersistedRecentSetEntry({
      id: "recent-1",
      doc,
      fileName: "MATCH.DAT",
      selectedIndex: 0,
    });

    expect(findMatchingRecentSetId([entry], doc, "MATCH.DAT")).toBe("recent-1");
    expect(findMatchingRecentSetId([entry], doc, "OTHER.DAT")).toBeNull();
  });

  it("drops invalid persisted entries", () => {
    expect(
      parsePersistedRecentSets(
        JSON.stringify({
          schema: "datTools.web.recentSets.v1",
          entries: [
            {
              id: "recent-1",
              fileName: "VALID.DAT",
              title: "VALID",
              updatedAt: 1,
              levelCount: 2,
              selectedIndex: 0,
              selectedLevelTitle: "One",
              width: 32,
              height: 32,
              thumbnailDataUrl: null,
              documentJson: JSON.stringify(makeDoc()),
            },
            {
              id: "",
              fileName: "INVALID.DAT",
              title: "INVALID",
              updatedAt: 2,
              levelCount: 2,
              selectedIndex: 0,
              selectedLevelTitle: "One",
              width: 32,
              height: 32,
              thumbnailDataUrl: null,
              documentJson: JSON.stringify(makeDoc()),
            },
          ],
        }),
      ).map((entry) => entry.id),
    ).toEqual(["recent-1"]);
  });
});
