import { wallMaskKeyFromBytes } from "@/src/dat/wallsBank";

export const GENERATED_LAYOUT_CARD_COUNT = 18;
export const GENERATED_LAYOUT_GRID_SIZE = 32;
export const GENERATED_LAYOUT_PREVIEW_SIZE = 128;

export type GenerateAlgorithmId = "random-noise";
export type GenerateAlgorithmChoice = GenerateAlgorithmId | "any";
export type RandomNoiseMirrorMode = "none" | "horizontal" | "vertical" | "quad";

export type RandomNoiseParameters = Readonly<{
  seed: number;
  density: number;
  blockSize: number;
  mirror: RandomNoiseMirrorMode;
  invert: boolean;
}>;

export type GeneratedLayoutRecord = Readonly<{
  wallKey: string;
  algorithm: GenerateAlgorithmId;
  title: string;
  summary: string;
  seedLabel: string;
  params: RandomNoiseParameters | null;
}>;

export const GENERATE_ALGORITHM_OPTIONS: ReadonlyArray<
  Readonly<{ value: GenerateAlgorithmChoice; label: string }>
> = [
  { value: "any", label: "Any" },
  { value: "random-noise", label: "Random Noise" },
];

const RANDOM_NOISE_LABEL = "Random Noise";
const GENERATED_LAYOUT_MIN_WALL_COUNT = 24;
const GENERATED_LAYOUT_MAX_WALL_COUNT = 1000;
const AVAILABLE_GENERATE_ALGORITHMS: ReadonlyArray<GenerateAlgorithmId> = ["random-noise"];
const RANDOM_NOISE_MIRROR_OPTIONS: ReadonlyArray<RandomNoiseMirrorMode> = [
  "none",
  "horizontal",
  "vertical",
  "quad",
];

export function randomSeedFromClock(): number {
  return Date.now() & 0x7fffffff;
}

export function nextRandomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

export function generateLayoutRecords(
  options: Readonly<{
    algorithm: GenerateAlgorithmChoice;
    count?: number;
    seed: number;
  }>,
): GeneratedLayoutRecord[] {
  const count = Math.max(1, options.count ?? GENERATED_LAYOUT_CARD_COUNT);
  const rng = createSeededRandom(options.seed);
  const records: GeneratedLayoutRecord[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 64;

  for (let attempt = 0; attempt < maxAttempts && records.length < count; attempt++) {
    const algorithm = pickAlgorithm(options.algorithm, rng);
    const record = generateRecordForAlgorithm(algorithm, rng);
    if (seen.has(record.wallKey)) continue;
    seen.add(record.wallKey);
    records.push(record);
  }

  return records;
}

export function recordsFromStarredKeys(
  starredKeys: ReadonlySet<string>,
  selectedAlgorithm: GenerateAlgorithmChoice,
): GeneratedLayoutRecord[] {
  const keys = [...starredKeys].sort((a, b) => a.localeCompare(b, "en"));
  const records = keys.map((wallKey) => buildStarredRecord(wallKey));
  if (selectedAlgorithm === "any") return records;
  return records.filter((record) => record.algorithm === selectedAlgorithm);
}

function pickAlgorithm(
  selectedAlgorithm: GenerateAlgorithmChoice,
  rng: () => number,
): GenerateAlgorithmId {
  if (selectedAlgorithm !== "any") return selectedAlgorithm;
  return sampleOne(rng, AVAILABLE_GENERATE_ALGORITHMS);
}

function generateRecordForAlgorithm(
  algorithm: GenerateAlgorithmId,
  rng: () => number,
): GeneratedLayoutRecord {
  switch (algorithm) {
    case "random-noise":
      return buildRandomNoiseRecord(rng);
  }
}

function buildRandomNoiseRecord(rng: () => number): GeneratedLayoutRecord {
  for (let attempt = 0; attempt < 24; attempt++) {
    const params = randomizeRandomNoiseParameters(rng);
    const bytes = buildRandomNoiseMaskBytes(params);
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: "random-noise",
      title: RANDOM_NOISE_LABEL,
      summary: buildRandomNoiseSummary(params),
      seedLabel: `Seed ${params.seed}`,
      params,
    };
  }

  const fallback = {
    seed: 1,
    density: 0.38,
    blockSize: 2,
    mirror: "quad",
    invert: false,
  } satisfies RandomNoiseParameters;

  return {
    wallKey: wallMaskKeyFromBytes(buildRandomNoiseMaskBytes(fallback)),
    algorithm: "random-noise",
    title: RANDOM_NOISE_LABEL,
    summary: buildRandomNoiseSummary(fallback),
    seedLabel: `Seed ${fallback.seed}`,
    params: fallback,
  };
}

function randomizeRandomNoiseParameters(rng: () => number): RandomNoiseParameters {
  const densitySteps = [0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66];
  const blockSizeOptions = [1, 1, 1, 2, 2, 2, 3, 4];
  return {
    seed: randomInt(rng, 1, 0x7ffffffe),
    density: sampleOne(rng, densitySteps),
    blockSize: sampleOne(rng, blockSizeOptions),
    mirror: sampleOne(rng, RANDOM_NOISE_MIRROR_OPTIONS),
    invert: rng() < 0.18,
  };
}

function buildRandomNoiseMaskBytes(params: RandomNoiseParameters): Uint8Array {
  const bytes = new Uint8Array(128);
  const sourceWidth = Math.ceil(GENERATED_LAYOUT_GRID_SIZE / params.blockSize);
  const sourceHeight = Math.ceil(GENERATED_LAYOUT_GRID_SIZE / params.blockSize);
  const cells = new Uint8Array(sourceWidth * sourceHeight);
  const rng = createSeededRandom(params.seed);

  for (let sourceY = 0; sourceY < sourceHeight; sourceY++) {
    for (let sourceX = 0; sourceX < sourceWidth; sourceX++) {
      const shouldFill = rng() < params.density;
      cells[sourceY * sourceWidth + sourceX] = shouldFill ? 1 : 0;
    }
  }

  for (let y = 0; y < GENERATED_LAYOUT_GRID_SIZE; y++) {
    for (let x = 0; x < GENERATED_LAYOUT_GRID_SIZE; x++) {
      const sample = sampleMirroredCell(
        cells,
        sourceWidth,
        sourceHeight,
        Math.floor(x / params.blockSize),
        Math.floor(y / params.blockSize),
        params.mirror,
      );
      const filled = params.invert ? !sample : sample;
      if (!filled) continue;
      setMaskBit(bytes, y * GENERATED_LAYOUT_GRID_SIZE + x);
    }
  }

  return bytes;
}

function sampleMirroredCell(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  mirror: RandomNoiseMirrorMode,
): boolean {
  const normalized = resolveMirroredPoint(x, y, width, height, mirror);
  return cells[normalized.y * width + normalized.x] === 1;
}

function resolveMirroredPoint(
  x: number,
  y: number,
  width: number,
  height: number,
  mirror: RandomNoiseMirrorMode,
): Readonly<{ x: number; y: number }> {
  switch (mirror) {
    case "horizontal":
      return {
        x: x < Math.ceil(width / 2) ? x : width - 1 - x,
        y,
      };
    case "vertical":
      return {
        x,
        y: y < Math.ceil(height / 2) ? y : height - 1 - y,
      };
    case "quad":
      return {
        x: x < Math.ceil(width / 2) ? x : width - 1 - x,
        y: y < Math.ceil(height / 2) ? y : height - 1 - y,
      };
    case "none":
      return { x, y };
  }
}

function buildRandomNoiseSummary(params: RandomNoiseParameters): string {
  const densityLabel = `${Math.round(params.density * 100)}% density`;
  const blockLabel = `${params.blockSize}x${params.blockSize} blocks`;
  const mirrorLabel =
    params.mirror === "none"
      ? "no mirror"
      : params.mirror === "quad"
        ? "quad mirror"
        : `${params.mirror} mirror`;
  return [densityLabel, blockLabel, mirrorLabel, params.invert ? "inverted" : null]
    .filter((value): value is string => value !== null)
    .join(" • ");
}

function buildStarredRecord(wallKey: string): GeneratedLayoutRecord {
  return {
    wallKey,
    algorithm: "random-noise",
    title: "Starred Layout",
    summary: "Saved from Generate",
    seedLabel: "Saved locally",
    params: null,
  };
}

function setMaskBit(bytes: Uint8Array, index: number): void {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  bytes[byteIndex] = (bytes[byteIndex] ?? 0) | (1 << bitIndex);
}

function countSetBits(bytes: Uint8Array): number {
  let count = 0;
  for (const byte of bytes) {
    count += POPCOUNT[byte] ?? 0;
  }
  return count;
}

function sampleOne<T>(rng: () => number, options: ReadonlyArray<T>): T {
  const index = Math.min(options.length - 1, Math.floor(rng() * options.length));
  return options[index]!;
}

function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let result = Math.imul(state ^ (state >>> 15), state | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

const POPCOUNT = Uint8Array.from(
  { length: 256 },
  (_, value) => value.toString(2).replaceAll("0", "").length,
);
