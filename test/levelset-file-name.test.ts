import { describe, expect, it } from "vitest";

import { createNewLevelsetFileName } from "@/web/src/levelsetFileName";

describe("new levelset file naming", () => {
  it("formats the timestamp as YY-MM-DD-HH-MM", () => {
    expect(createNewLevelsetFileName(new Date(2026, 2, 25, 8, 42))).toBe(
      "NewLevelset26-03-25-08-42.dat",
    );
  });

  it("zero-pads single-digit date parts", () => {
    expect(createNewLevelsetFileName(new Date(2026, 0, 5, 4, 7))).toBe(
      "NewLevelset26-01-05-04-07.dat",
    );
  });
});
