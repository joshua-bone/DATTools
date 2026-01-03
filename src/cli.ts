// src/cli.ts
import { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";

import { parseDatLevelsetJsonV1, stringifyDatLevelsetJsonV1 } from "./dat/datLevelsetJsonV1.js";
import { transformLevelset, parseTransformKind } from "./dat/transformCli.js";

const program = new Command();

program.name("dattools").description("DATTools (DAT levelset tools)").version("0.1.0");

program
  .command("to-json")
  .description("Convert .dat to JSON (NOT IMPLEMENTED YET)")
  .argument("<input>", "Path to .dat file")
  .action(async () => {
    throw new Error("DAT codec not implemented yet.");
  });

program
  .command("from-json")
  .description("Convert JSON back to .dat (NOT IMPLEMENTED YET)")
  .argument("<input>", "Path to JSON file")
  .requiredOption("-o, --output <path>", "Write .dat to this path")
  .action(async () => {
    throw new Error("DAT codec not implemented yet.");
  });

program
  .command("transform-json")
  .description("Transform a levelset JSON (rot/flip). Writes a new JSON file.")
  .argument("<op>", "rot90|rot180|rot270|flip-h|flip-v|flip-nwse|flip-nesw")
  .argument("<input>", "Path to levelset JSON")
  .requiredOption("-o, --output <path>", "Output JSON path")
  .action(async (op: string, input: string, opts: { output: string }) => {
    const text = await readFile(input, "utf8");
    const doc = parseDatLevelsetJsonV1(JSON.parse(text) as unknown);
    const kind = parseTransformKind(op);
    const out = transformLevelset(doc, kind);
    await writeFile(opts.output, stringifyDatLevelsetJsonV1(out), "utf8");
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(msg + "\n");
  process.exitCode = 1;
});
