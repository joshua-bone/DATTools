import { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";

import { decodeDatBytes, encodeDatBytes } from "./dat/datCodec.js";
import { parseDatLevelsetJsonV1, stringifyDatLevelsetJsonV1 } from "./dat/datLevelsetJsonV1.js";
import { parseTransformKind } from "./dat/transformCli.js";
import { transformLevelset } from "./dat/datTransforms.js";

const program = new Command();

program.name("dattools").description("DATTools (CC1 DAT levelset tools)").version("0.2.0");

program
  .command("to-json")
  .description("Convert .dat to levelset JSON")
  .argument("<input>", "Path to .dat file")
  .option("-o, --output <path>", "Write JSON to a file (default: stdout)")
  .action(async (input: string, opts: { output?: string }) => {
    const bytes = await readFile(input);
    const doc = decodeDatBytes(new Uint8Array(bytes));
    const text = stringifyDatLevelsetJsonV1(doc);
    if (opts.output) await writeFile(opts.output, text, "utf8");
    else process.stdout.write(text);
  });

program
  .command("from-json")
  .description("Convert levelset JSON back to .dat")
  .argument("<input>", "Path to JSON file")
  .requiredOption("-o, --output <path>", "Write .dat to this path")
  .action(async (input: string, opts: { output: string }) => {
    const text = await readFile(input, "utf8");
    const parsed: unknown = JSON.parse(text);
    const doc = parseDatLevelsetJsonV1(parsed);
    const bytes = encodeDatBytes(doc);
    await writeFile(opts.output, bytes);
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
