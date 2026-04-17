import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(npmCommand, ["run", "build"]);

const initCwd = process.env.INIT_CWD;
if (existsSync(".git") && initCwd === process.cwd()) {
  run(npxCommand, ["husky"]);
}
