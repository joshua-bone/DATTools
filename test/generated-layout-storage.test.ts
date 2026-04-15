import { describe, expect, it } from "vitest";

import {
  parsePersistedGeneratedLayoutKeySet,
  serializePersistedGeneratedLayoutKeySet,
} from "@/web/src/generatedLayoutStorage";

describe("generated layout local storage helpers", () => {
  it("round-trips sorted generated layout key sets", () => {
    const serialized = serializePersistedGeneratedLayoutKeySet(new Set(["beta", "alpha"]));
    expect(parsePersistedGeneratedLayoutKeySet(serialized)).toEqual(new Set(["alpha", "beta"]));
  });

  it("ignores invalid blobs", () => {
    expect(parsePersistedGeneratedLayoutKeySet(null)).toEqual(new Set());
    expect(parsePersistedGeneratedLayoutKeySet("nope")).toEqual(new Set());
    expect(parsePersistedGeneratedLayoutKeySet('{"schema":"wrong","keys":["x"]}')).toEqual(
      new Set(),
    );
  });
});
