export type WebBuildTarget = "local" | "pages";

export function getGithubRepositoryName(githubRepository?: string): string | null {
  const [owner, repo] = githubRepository?.split("/") ?? [];
  if (!owner || !repo) return null;
  return repo;
}

export function getWebBuildTarget(mode: string): WebBuildTarget {
  return mode === "pages" ? "pages" : "local";
}

export function resolveWebBuildBasePath(
  command: "build" | "serve",
  buildTarget: WebBuildTarget,
  githubRepository?: string,
): string {
  if (command !== "build") return "/";
  if (buildTarget === "local") return "./";

  const repoName = getGithubRepositoryName(githubRepository);
  if (!repoName) {
    throw new Error("Pages builds require GITHUB_REPOSITORY=owner/repo");
  }

  return `/${repoName}/`;
}
