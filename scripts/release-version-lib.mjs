export function incrementSemver(version, releaseType) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Unsupported semver version: ${version}`);
  }

  let [major, minor, patch] = match.slice(1).map((part) => Number(part));

  if (releaseType === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (releaseType === "minor") {
    minor += 1;
    patch = 0;
  } else if (releaseType === "patch") {
    patch += 1;
  } else {
    throw new Error(`Unsupported release type: ${releaseType}`);
  }

  return `${major}.${minor}.${patch}`;
}

export function inferReleaseType(commits) {
  if (commits.some(isBreakingChangeCommit)) {
    return "major";
  }

  if (commits.some(isFeatureCommit)) {
    return "minor";
  }

  return "patch";
}

function isBreakingChangeCommit(message) {
  return (
    /\bBREAKING CHANGE:\s/m.test(message) ||
    /^[A-Za-z]+(?:\([^)]+\))?!:/.test(getCommitHeader(message))
  );
}

function isFeatureCommit(message) {
  return /^feat(?:\([^)]+\))?:\s/.test(getCommitHeader(message));
}

function getCommitHeader(message) {
  return message.split("\n", 1)[0] ?? "";
}
