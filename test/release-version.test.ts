import { describe, expect, it } from "vitest";

// @ts-ignore -- The release helper is a plain .mjs workflow module.
import { incrementSemver, inferReleaseType } from "../scripts/release-version-lib.mjs";

describe("release version helpers", () => {
  it("defaults to patch releases for plain-English commits", () => {
    expect(inferReleaseType(["Polish desktop release assets and docs"])).toBe("patch");
  });

  it("treats feat commits as minor releases", () => {
    expect(inferReleaseType(["feat: add desktop help link", "Fix follow-up layout issue"])).toBe(
      "minor",
    );
  });

  it("treats breaking-change commits as major releases", () => {
    expect(inferReleaseType(["feat!: replace DAT export format", "Some supporting refactor"])).toBe(
      "major",
    );
    expect(
      inferReleaseType([
        "feat: replace DAT export format\n\nBREAKING CHANGE: Old DAT exports are no longer supported.",
      ]),
    ).toBe("major");
  });

  it("increments semver values correctly", () => {
    expect(incrementSemver("1.2.3", "patch")).toBe("1.2.4");
    expect(incrementSemver("1.2.3", "minor")).toBe("1.3.0");
    expect(incrementSemver("1.2.3", "major")).toBe("2.0.0");
  });
});
