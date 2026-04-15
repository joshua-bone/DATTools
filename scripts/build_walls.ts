import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { decodeDatBytes } from "@/src/dat/datCodec";
import {
  WALL_BANK_SCHEMA,
  WALL_BANK_TILE_NAMES,
  buildWallMaskKey,
  type WallsBankJson,
  type WallsBankOccurrence,
} from "@/src/dat/wallsBank";

type ApiPack = Readonly<{
  id: number;
  pack_name: string;
  display_name: string;
  game: string;
  pack_type: string;
  level_count: number;
  file_name: string;
  download_url: string | null;
}>;

const API_BASE_URL = "https://api.bitbusters.club/custom-packs/cc1";
const DEFAULT_CONCURRENCY = 10;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputPath = path.join(repoRoot, "web/public/walls/walls-bank.json");

function compareText(a: string, b: string): number {
  return a.localeCompare(b, "en");
}

function compareOccurrence(a: WallsBankOccurrence, b: WallsBankOccurrence): number {
  return (
    compareText(a.setName, b.setName) ||
    a.levelNumber - b.levelNumber ||
    compareText(a.levelTitle, b.levelTitle) ||
    compareText(a.author ?? "", b.author ?? "")
  );
}

function resolveSetName(pack: ApiPack): string {
  const displayName = pack.display_name.trim();
  if (displayName.length > 0) return displayName;
  return pack.pack_name.trim();
}

function normalizeAuthor(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isUnavailablePackError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /HTTP (403|404|410)\b/.test(message);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
  }
  return (await response.json()) as T;
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function mapConcurrent<T>(
  items: ReadonlyArray<T>,
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0;

  async function runWorker(): Promise<void> {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      await worker(items[index]!, index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(concurrency, items.length || 1)) }, () =>
      runWorker(),
    ),
  );
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  const concurrency = Number.parseInt(process.env.WALLS_BUILD_CONCURRENCY ?? "", 10);
  const packConcurrency =
    Number.isFinite(concurrency) && concurrency > 0 ? concurrency : DEFAULT_CONCURRENCY;

  console.log(`Fetching pack index from ${API_BASE_URL}`);
  const packs = (await fetchJson<ApiPack[]>(API_BASE_URL))
    .filter((pack) => pack.game === "CC1")
    .sort((a, b) => a.id - b.id);
  const downloadablePacks = packs.filter((pack) => typeof pack.download_url === "string");
  const skippedPacks = packs.filter((pack) => typeof pack.download_url !== "string");

  console.log(
    `Found ${packs.length} CC1 packs (${downloadablePacks.length} downloadable, ${skippedPacks.length} skipped)`,
  );

  const masks = new Map<string, WallsBankOccurrence[]>();
  let levelCount = 0;
  const unavailablePacks: ApiPack[] = [];
  const failedPacks: Array<{ pack: ApiPack; error: unknown }> = [];

  await mapConcurrent(downloadablePacks, packConcurrency, async (pack, index) => {
    try {
      const bytes = await fetchBytes(pack.download_url!);
      const doc = decodeDatBytes(bytes);
      const setName = resolveSetName(pack);

      for (const level of doc.levels) {
        const key = buildWallMaskKey(level);
        const occurrences = masks.get(key) ?? [];
        occurrences.push({
          packId: pack.id,
          setName,
          packType: pack.pack_type,
          fileName: pack.file_name,
          levelNumber: level.number,
          levelTitle: level.title?.trim() || `Level ${level.number}`,
          ...(normalizeAuthor(level.author) ? { author: normalizeAuthor(level.author) } : {}),
        });
        masks.set(key, occurrences);
        levelCount += 1;
      }

      if ((index + 1) % 25 === 0 || index === downloadablePacks.length - 1) {
        console.log(`Processed ${index + 1}/${downloadablePacks.length} packs`);
      }
    } catch (error: unknown) {
      if (isUnavailablePackError(error)) {
        unavailablePacks.push(pack);
        return;
      }
      failedPacks.push({ pack, error });
    }
  });

  if (failedPacks.length > 0) {
    for (const failure of failedPacks.slice(0, 10)) {
      const message =
        failure.error instanceof Error ? failure.error.message : String(failure.error);
      console.error(`Failed pack ${failure.pack.id} (${resolveSetName(failure.pack)}): ${message}`);
    }
    throw new Error(`Failed to process ${failedPacks.length} downloadable pack(s)`);
  }

  if (unavailablePacks.length > 0) {
    console.log(
      `Skipped ${unavailablePacks.length} listed pack${unavailablePacks.length === 1 ? "" : "s"} with broken download links`,
    );
  }

  const sortedMasks = Object.fromEntries(
    Array.from(masks.entries())
      .sort(([leftKey], [rightKey]) => compareText(leftKey, rightKey))
      .map(([key, occurrences]) => [key, [...occurrences].sort(compareOccurrence)]),
  );

  const output: WallsBankJson = {
    schema: WALL_BANK_SCHEMA,
    generatedAt: new Date().toISOString(),
    source: {
      apiBaseUrl: API_BASE_URL,
      downloadablePackCount: downloadablePacks.length - unavailablePacks.length,
      skippedPackCount: skippedPacks.length + unavailablePacks.length,
      failedPackCount: 0,
      levelCount,
      uniqueWallCount: Object.keys(sortedMasks).length,
      wallTileNames: [...WALL_BANK_TILE_NAMES],
    },
    masks: sortedMasks,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(output) + "\n", "utf8");

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`Wrote ${outputPath}`);
  console.log(
    `Built ${output.source.uniqueWallCount} unique wall masks from ${output.source.levelCount} levels in ${elapsedSeconds}s`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  console.error(message);
  process.exitCode = 1;
});
