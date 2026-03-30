#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";

import { incrementSemver, inferReleaseType } from "./release-version-lib.mjs";

const packageJsonPath = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const currentHead = git(["rev-parse", "HEAD"]);
const latestTag =
  gitOrEmpty(["tag", "--list", "v*", "--sort=-version:refname"]).split("\n")[0] || "";
const latestTaggedCommit = latestTag ? git(["rev-parse", latestTag]) : "";
const latestTaggedParent = latestTag ? gitOrEmpty(["rev-parse", `${latestTag}^`]) : "";

if (latestTag && (latestTaggedCommit === currentHead || latestTaggedParent === currentHead)) {
  writeOutputs({
    should_release: "true",
    release_exists: "true",
    create_release_commit: "false",
    release_type: "existing",
    release_tag: latestTag,
    release_version: latestTag.slice(1),
    source_sha: currentHead,
  });
  process.exit(0);
}

const commitRange = latestTag ? `${latestTag}..HEAD` : "HEAD";
const commits = getCommits(commitRange);

if (commits.length === 0) {
  writeOutputs({
    should_release: "false",
    release_exists: "false",
    create_release_commit: "false",
    release_type: "none",
    release_tag: "",
    release_version: "",
    source_sha: currentHead,
  });
  process.exit(0);
}

const releaseType = latestTag ? inferReleaseType(commits) : "initial";
const releaseVersion = latestTag
  ? incrementSemver(latestTag.slice(1), releaseType)
  : packageJson.version;

writeOutputs({
  should_release: "true",
  release_exists: "false",
  create_release_commit: String(releaseVersion !== packageJson.version),
  release_type: releaseType,
  release_tag: `v${releaseVersion}`,
  release_version: releaseVersion,
  source_sha: currentHead,
});

function getCommits(range) {
  const raw = gitOrEmpty(["log", "--format=%B%x1e", range]);
  if (!raw) {
    return [];
  }

  return raw
    .split("\x1e")
    .map((message) => message.trim())
    .filter(Boolean);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function gitOrEmpty(args) {
  try {
    return git(args);
  } catch {
    return "";
  }
}

function writeOutputs(outputs) {
  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join("\n")}\n`);
    return;
  }

  process.stdout.write(`${lines.join("\n")}\n`);
}
