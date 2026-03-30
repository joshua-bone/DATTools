import { describe, expect, it } from "vitest";

import { getLevelsetFileKind } from "@/src/levelsetFiles";

describe("levelset file helpers", () => {
  it("detects DAT filenames case-insensitively", () => {
    expect(getLevelsetFileKind("LEVELS.DAT")).toBe("dat");
    expect(getLevelsetFileKind("set.dat")).toBe("dat");
  });

  it("treats non-DAT filenames as JSON exports", () => {
    expect(getLevelsetFileKind("levelset.json")).toBe("json");
    expect(getLevelsetFileKind("levelset")).toBe("json");
  });
});
