import { describe, expect, it } from "vitest";

import { compareReleaseVersions, parseLatestDesktopRelease } from "@/web/src/githubReleases";

describe("github releases", () => {
  it("parses the latest desktop release payload", () => {
    expect(
      parseLatestDesktopRelease({
        tag_name: "v1.2.3",
        html_url: "https://github.com/joshua-bone/DATTools/releases/tag/v1.2.3",
        published_at: "2026-03-30T18:22:00Z",
      }),
    ).toEqual({
      version: "v1.2.3",
      htmlUrl: "https://github.com/joshua-bone/DATTools/releases/tag/v1.2.3",
      publishedAt: "2026-03-30T18:22:00Z",
    });
  });

  it("rejects payloads that do not contain the required release fields", () => {
    expect(() => parseLatestDesktopRelease({ tag_name: "v1.2.3" })).toThrow(
      "Latest desktop release payload is missing html_url.",
    );
    expect(() =>
      parseLatestDesktopRelease({
        html_url: "https://github.com/joshua-bone/DATTools/releases/tag/v1.2.3",
      }),
    ).toThrow("Latest desktop release payload is missing tag_name.");
  });

  it("compares release versions with or without a leading v prefix", () => {
    expect(compareReleaseVersions("v1.2.4", "1.2.3")).toBeGreaterThan(0);
    expect(compareReleaseVersions("1.2.3", "v1.2.3")).toBe(0);
    expect(compareReleaseVersions("1.3.0", "v1.9.9")).toBeLessThan(0);
  });
});
