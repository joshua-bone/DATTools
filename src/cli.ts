import { Command } from "commander";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { decodeDatBytes, encodeDatBytes } from "./dat/datCodec.js";
import { mergeDatLevelsets } from "./dat/datMerge.js";
import { parseDatLevelsetJsonV1, stringifyDatLevelsetJsonV1 } from "./dat/datLevelsetJsonV1.js";
import { parseTransformKind } from "./dat/transformCli.js";
import { transformLevelset } from "./dat/datTransforms.js";
import { decodeTwsBytes, encodeTwsBytes, mergeTwsFiles } from "./tws/twsCodec.js";

const program = new Command();

program.name("dattools").description("DATTools (CC1 DAT levelset tools)").version("0.2.0");

type VotingPackGroup = Readonly<{
  stem: string;
  datPath: string;
  lynxPath: string;
  msPath: string;
}>;

function compareLex(a: string, b: string): number {
  return a.localeCompare(b, "en");
}

async function discoverVotingPackGroups(rootDir: string): Promise<VotingPackGroup[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const stems = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".dat"))
    .map((entry) => entry.name.slice(0, -4))
    .sort(compareLex);

  if (stems.length === 0) throw new Error(`No .dat files found in ${rootDir}`);

  const solutionsDir = path.join(rootDir, "Solutions");
  return stems.map((stem) => ({
    stem,
    datPath: path.join(rootDir, `${stem}.dat`),
    lynxPath: path.join(solutionsDir, `${stem}-Lynx.tws`),
    msPath: path.join(solutionsDir, `${stem}-MS.tws`),
  }));
}

function inferOutputPrefix(groups: ReadonlyArray<VotingPackGroup>): string {
  const prefixes = groups.map((group) => {
    const dash = group.stem.lastIndexOf("-");
    if (dash <= 0 || dash === group.stem.length - 1) {
      throw new Error(`Cannot infer merged output prefix from ${group.stem}`);
    }
    return group.stem.slice(0, dash);
  });

  const prefix = prefixes[0]!;
  if (prefixes.some((candidate) => candidate !== prefix)) {
    throw new Error(`Cannot infer a single merged output prefix from ${prefixes.join(", ")}`);
  }
  return prefix;
}

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

program
  .command("merge-voting-packs")
  .description(
    "Merge a directory of voting pack DAT/TWS files into one DAT plus Lynx/MS solution files",
  )
  .argument("<inputDir>", "Directory containing pack .dat files and a Solutions/ subdirectory")
  .option(
    "-o, --output-dir <path>",
    "Directory to write merged outputs to (default: parent of inputDir)",
  )
  .option("--prefix <name>", "Filename prefix for merged outputs (default: inferred)")
  .action(async (inputDir: string, opts: { outputDir?: string; prefix?: string }) => {
    const rootDir = path.resolve(inputDir);
    const groups = await discoverVotingPackGroups(rootDir);
    const outputDir = path.resolve(opts.outputDir ?? path.dirname(rootDir));
    const prefix = opts.prefix ?? inferOutputPrefix(groups);

    const datDocs = [];
    const levelCounts: number[] = [];
    for (const group of groups) {
      const bytes = new Uint8Array(await readFile(group.datPath));
      const doc = decodeDatBytes(bytes);
      datDocs.push(doc);
      levelCounts.push(doc.levels.length);
    }

    const mergedDat = mergeDatLevelsets(datDocs);

    const lynxDocs = [];
    const msDocs = [];
    for (const group of groups) {
      lynxDocs.push(decodeTwsBytes(new Uint8Array(await readFile(group.lynxPath))));
      msDocs.push(decodeTwsBytes(new Uint8Array(await readFile(group.msPath))));
    }

    const mergedLynx = mergeTwsFiles(
      lynxDocs.map((file, index) => ({ file, levelCount: levelCounts[index]! })),
    );
    const mergedMs = mergeTwsFiles(
      msDocs.map((file, index) => ({ file, levelCount: levelCounts[index]! })),
    );

    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, `${prefix}.dat`), encodeDatBytes(mergedDat));
    await writeFile(path.join(outputDir, `${prefix}-Lynx.tws`), encodeTwsBytes(mergedLynx));
    await writeFile(path.join(outputDir, `${prefix}-MS.tws`), encodeTwsBytes(mergedMs));
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(msg + "\n");
  process.exitCode = 1;
});
