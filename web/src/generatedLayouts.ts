import { wallMaskKeyFromBytes } from "@/src/dat/wallsBank";

export const GENERATED_LAYOUT_CARD_COUNT = 18;
export const GENERATED_LAYOUT_GRID_SIZE = 32;
export const GENERATED_LAYOUT_PREVIEW_SIZE = 128;

export const RANDOM_NOISE_SEED_MIN = 1;
export const RANDOM_NOISE_SEED_MAX = 0x7ffffffe;
export const RANDOM_NOISE_DENSITY_MIN = 0.12;
export const RANDOM_NOISE_DENSITY_MAX = 0.66;
export const RANDOM_NOISE_DENSITY_STEP = 0.02;
export const RANDOM_NOISE_BLOCK_SIZE_OPTIONS: ReadonlyArray<number> = [1, 2, 3, 4];
export const RANDOM_NOISE_MIRROR_OPTIONS: ReadonlyArray<RandomNoiseMirrorMode> = [
  "none",
  "horizontal",
  "vertical",
  "quad",
];

export const BACKTRACKING_SEED_MIN = 1;
export const BACKTRACKING_SEED_MAX = 0x7ffffffe;
export const BACKTRACKING_START_MIN = 1;
export const BACKTRACKING_START_MAX = 15;

export type GenerateAlgorithmId = "random-noise" | "backtracking-generator";
export type GenerateAlgorithmChoice = GenerateAlgorithmId | "any";
export type GenerateRecordAlgorithm = GenerateAlgorithmId | "starred";
export type RandomNoiseMirrorMode = "none" | "horizontal" | "vertical" | "quad";

export type RandomizableValue<T> = Readonly<{
  randomize: boolean;
  value: T;
}>;

export type RandomNoiseParameters = Readonly<{
  seed: number;
  density: number;
  blockSize: number;
  mirror: RandomNoiseMirrorMode;
  invert: boolean;
}>;

export type BacktrackingParameters = Readonly<{
  seed: number;
  startColumn: number;
  startRow: number;
}>;

export type RandomNoiseControlState = Readonly<{
  seed: RandomizableValue<number>;
  density: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  mirror: RandomizableValue<RandomNoiseMirrorMode>;
  invert: RandomizableValue<boolean>;
}>;

export type BacktrackingControlState = Readonly<{
  seed: RandomizableValue<number>;
  startColumn: RandomizableValue<number>;
  startRow: RandomizableValue<number>;
}>;

type BaseGeneratedLayoutRecord<
  Algorithm extends GenerateRecordAlgorithm,
  Params extends RandomNoiseParameters | BacktrackingParameters | null,
> = Readonly<{
  wallKey: string;
  algorithm: Algorithm;
  title: string;
  summary: string;
  seedLabel: string;
  params: Params;
}>;

export type RandomNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "random-noise",
  RandomNoiseParameters
>;

export type BacktrackingGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "backtracking-generator",
  BacktrackingParameters
>;

export type StarredGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"starred", null>;

export type GeneratedLayoutRecord =
  | RandomNoiseGeneratedLayoutRecord
  | BacktrackingGeneratedLayoutRecord
  | StarredGeneratedLayoutRecord;

export const GENERATE_ALGORITHM_OPTIONS: ReadonlyArray<
  Readonly<{ value: GenerateAlgorithmChoice; label: string }>
> = [
  { value: "any", label: "Any" },
  { value: "random-noise", label: "Random Noise" },
  { value: "backtracking-generator", label: "Backtracking Generator" },
];

const RANDOM_NOISE_LABEL = "Random Noise";
const BACKTRACKING_LABEL = "Backtracking Generator";
const GENERATED_LAYOUT_MIN_WALL_COUNT = 24;
const GENERATED_LAYOUT_MAX_WALL_COUNT = 1000;
const AVAILABLE_GENERATE_ALGORITHMS: ReadonlyArray<GenerateAlgorithmId> = [
  "random-noise",
  "backtracking-generator",
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
    randomNoiseControls?: RandomNoiseControlState | null;
    backtrackingControls?: BacktrackingControlState | null;
  }>,
): GeneratedLayoutRecord[] {
  const count = Math.max(1, options.count ?? GENERATED_LAYOUT_CARD_COUNT);
  const rng = createSeededRandom(options.seed);
  const records: GeneratedLayoutRecord[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 64;

  for (let attempt = 0; attempt < maxAttempts && records.length < count; attempt++) {
    const algorithm = pickAlgorithm(options.algorithm, rng);
    const record = generateRecordForAlgorithm(algorithm, rng, {
      randomNoiseControls: options.randomNoiseControls ?? null,
      backtrackingControls: options.backtrackingControls ?? null,
    });
    if (seen.has(record.wallKey)) continue;
    seen.add(record.wallKey);
    records.push(record);
  }

  return records;
}

export function recordsFromStarredKeys(starredKeys: ReadonlySet<string>): GeneratedLayoutRecord[] {
  const keys = [...starredKeys].sort((a, b) => a.localeCompare(b, "en"));
  return keys.map((wallKey) => buildStarredRecord(wallKey));
}

export function createDefaultRandomNoiseControlState(): RandomNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    density: { randomize: true, value: 0.36 },
    blockSize: { randomize: true, value: 1 },
    mirror: { randomize: true, value: "none" },
    invert: { randomize: true, value: false },
  };
}

export function createDefaultBacktrackingControlState(): BacktrackingControlState {
  return {
    seed: { randomize: true, value: 1 },
    startColumn: { randomize: true, value: 8 },
    startRow: { randomize: true, value: 8 },
  };
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
  controls: Readonly<{
    randomNoiseControls: RandomNoiseControlState | null;
    backtrackingControls: BacktrackingControlState | null;
  }>,
): GeneratedLayoutRecord {
  switch (algorithm) {
    case "random-noise":
      return buildRandomNoiseRecord(rng, controls.randomNoiseControls);
    case "backtracking-generator":
      return buildBacktrackingRecord(rng, controls.backtrackingControls);
  }
}

function buildRandomNoiseRecord(
  rng: () => number,
  controls: RandomNoiseControlState | null,
): RandomNoiseGeneratedLayoutRecord {
  for (let attempt = 0; attempt < 24; attempt++) {
    const params = randomizeRandomNoiseParameters(rng, controls);
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

function buildBacktrackingRecord(
  rng: () => number,
  controls: BacktrackingControlState | null,
): BacktrackingGeneratedLayoutRecord {
  const params = randomizeBacktrackingParameters(rng, controls);
  return {
    wallKey: wallMaskKeyFromBytes(buildBacktrackingMaskBytes(params)),
    algorithm: "backtracking-generator",
    title: BACKTRACKING_LABEL,
    summary: buildBacktrackingSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function randomizeRandomNoiseParameters(
  rng: () => number,
  controls: RandomNoiseControlState | null,
): RandomNoiseParameters {
  const defaults = controls ?? createDefaultRandomNoiseControlState();
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      (value) => clamp(Math.round(value), RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
    ),
    density: resolveRandomizableValue(
      defaults.density,
      () => sampleOne(rng, [0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66]),
      (value) =>
        clamp(
          Math.round(value / RANDOM_NOISE_DENSITY_STEP) * RANDOM_NOISE_DENSITY_STEP,
          RANDOM_NOISE_DENSITY_MIN,
          RANDOM_NOISE_DENSITY_MAX,
        ),
    ),
    blockSize: resolveRandomizableValue(
      defaults.blockSize,
      () => sampleOne(rng, [1, 1, 1, 2, 2, 2, 3, 4]),
      sampleClosestBlockSize,
    ),
    mirror: resolveRandomizableValue(
      defaults.mirror,
      () => sampleOne(rng, RANDOM_NOISE_MIRROR_OPTIONS),
      (value) => (RANDOM_NOISE_MIRROR_OPTIONS.includes(value) ? value : "none"),
    ),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.18,
      (value) => !!value,
    ),
  };
}

function randomizeBacktrackingParameters(
  rng: () => number,
  controls: BacktrackingControlState | null,
): BacktrackingParameters {
  const defaults = controls ?? createDefaultBacktrackingControlState();
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, BACKTRACKING_SEED_MIN, BACKTRACKING_SEED_MAX),
      (value) => clamp(Math.round(value), BACKTRACKING_SEED_MIN, BACKTRACKING_SEED_MAX),
    ),
    startColumn: resolveRandomizableValue(
      defaults.startColumn,
      () => randomInt(rng, BACKTRACKING_START_MIN, BACKTRACKING_START_MAX),
      (value) => clamp(Math.round(value), BACKTRACKING_START_MIN, BACKTRACKING_START_MAX),
    ),
    startRow: resolveRandomizableValue(
      defaults.startRow,
      () => randomInt(rng, BACKTRACKING_START_MIN, BACKTRACKING_START_MAX),
      (value) => clamp(Math.round(value), BACKTRACKING_START_MIN, BACKTRACKING_START_MAX),
    ),
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
      cells[sourceY * sourceWidth + sourceX] = rng() < params.density ? 1 : 0;
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

function buildBacktrackingMaskBytes(params: BacktrackingParameters): Uint8Array {
  const walls = new Uint8Array(GENERATED_LAYOUT_GRID_SIZE * GENERATED_LAYOUT_GRID_SIZE);
  walls.fill(1);

  const logicalSize = BACKTRACKING_START_MAX;
  const visited = new Uint8Array(logicalSize * logicalSize);
  const rng = createSeededRandom(params.seed);
  const start = {
    x: params.startColumn - 1,
    y: params.startRow - 1,
  };
  const stack: Array<Readonly<{ x: number; y: number }>> = [start];

  markVisited(visited, logicalSize, start.x, start.y);
  carveBacktrackingCell(walls, start.x, start.y);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]!;
    const neighbors = listBacktrackingNeighbors(current.x, current.y, visited, logicalSize);
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const next = sampleOne(rng, neighbors);
    carveBacktrackingPassage(walls, current, next);
    markVisited(visited, logicalSize, next.x, next.y);
    stack.push(next);
  }

  const bytes = new Uint8Array(128);
  for (let index = 0; index < walls.length; index++) {
    if (walls[index] !== 1) continue;
    setMaskBit(bytes, index);
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
      return { x: x < Math.ceil(width / 2) ? x : width - 1 - x, y };
    case "vertical":
      return { x, y: y < Math.ceil(height / 2) ? y : height - 1 - y };
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

function buildBacktrackingSummary(params: BacktrackingParameters): string {
  return `Start column ${params.startColumn}, row ${params.startRow}`;
}

function buildStarredRecord(wallKey: string): StarredGeneratedLayoutRecord {
  return {
    wallKey,
    algorithm: "starred",
    title: "Starred Layout",
    summary: "Saved locally from Generate",
    seedLabel: "Saved locally",
    params: null,
  };
}

function listBacktrackingNeighbors(
  x: number,
  y: number,
  visited: Uint8Array,
  size: number,
): Array<Readonly<{ x: number; y: number }>> {
  const neighbors: Array<Readonly<{ x: number; y: number }>> = [];
  const candidates = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];

  for (const candidate of candidates) {
    if (candidate.x < 0 || candidate.x >= size || candidate.y < 0 || candidate.y >= size) {
      continue;
    }
    if (visited[candidate.y * size + candidate.x] === 1) continue;
    neighbors.push(candidate);
  }

  return neighbors;
}

function carveBacktrackingCell(walls: Uint8Array, cellX: number, cellY: number): void {
  walls[mazeTileIndex(cellX * 2 + 1, cellY * 2 + 1)] = 0;
}

function carveBacktrackingPassage(
  walls: Uint8Array,
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
): void {
  const fromTileX = from.x * 2 + 1;
  const fromTileY = from.y * 2 + 1;
  const toTileX = to.x * 2 + 1;
  const toTileY = to.y * 2 + 1;
  walls[mazeTileIndex(fromTileX, fromTileY)] = 0;
  walls[mazeTileIndex((fromTileX + toTileX) / 2, (fromTileY + toTileY) / 2)] = 0;
  walls[mazeTileIndex(toTileX, toTileY)] = 0;
}

function mazeTileIndex(x: number, y: number): number {
  return y * GENERATED_LAYOUT_GRID_SIZE + x;
}

function markVisited(visited: Uint8Array, size: number, x: number, y: number): void {
  visited[y * size + x] = 1;
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

function sampleClosestBlockSize(value: number): number {
  return RANDOM_NOISE_BLOCK_SIZE_OPTIONS.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest,
  );
}

function resolveRandomizableValue<T>(
  control: RandomizableValue<T>,
  randomize: () => T,
  sanitize: (value: T) => T,
): T {
  if (control.randomize) return randomize();
  return sanitize(control.value);
}

function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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
