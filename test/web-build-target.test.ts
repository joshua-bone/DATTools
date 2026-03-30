import { describe, expect, it } from "vitest";

import {
  getGithubRepositoryName,
  getWebBuildTarget,
  resolveWebBuildBasePath,
} from "@/src/webBuildTarget";

describe("web build target helpers", () => {
  it("detects explicit Pages mode", () => {
    expect(getWebBuildTarget("pages")).toBe("pages");
    expect(getWebBuildTarget("production")).toBe("local");
  });

  it("extracts the repository name from GitHub Actions format", () => {
    expect(getGithubRepositoryName("joshua-bone/DATTools")).toBe("DATTools");
    expect(getGithubRepositoryName(undefined)).toBeNull();
    expect(getGithubRepositoryName("DATTools")).toBeNull();
  });

  it("uses root-relative paths only for explicit Pages builds", () => {
    expect(resolveWebBuildBasePath("serve", "pages", "joshua-bone/DATTools")).toBe("/");
    expect(resolveWebBuildBasePath("build", "local")).toBe("./");
    expect(resolveWebBuildBasePath("build", "pages", "joshua-bone/DATTools")).toBe("/DATTools/");
  });

  it("rejects Pages builds without a repository name", () => {
    expect(() => resolveWebBuildBasePath("build", "pages")).toThrow(
      "Pages builds require GITHUB_REPOSITORY=owner/repo",
    );
  });
});
