import { describe, expect, it } from "vitest";

import {
  parsePersistedWallsKeySet,
  serializePersistedWallsKeySet,
} from "@/web/src/wallsBankStorage";

describe("walls bank local storage helpers", () => {
  it("round-trips sorted wall key sets", () => {
    const serialized = serializePersistedWallsKeySet(new Set(["beta", "alpha"]));
    expect(parsePersistedWallsKeySet(serialized)).toEqual(new Set(["alpha", "beta"]));
  });

  it("ignores invalid blobs", () => {
    expect(parsePersistedWallsKeySet(null)).toEqual(new Set());
    expect(parsePersistedWallsKeySet("nope")).toEqual(new Set());
    expect(parsePersistedWallsKeySet('{"schema":"wrong","keys":["x"]}')).toEqual(new Set());
  });
});
