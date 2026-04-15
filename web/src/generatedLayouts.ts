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

export const MAZE_SEED_MIN = 1;
export const MAZE_SEED_MAX = 0x7ffffffe;
export const MAZE_START_MIN = 1;
export const MAZE_BLOCK_SIZE_OPTIONS = [
  { value: "1x1", label: "1x1", width: 1, height: 1 },
  { value: "2x2", label: "2x2", width: 2, height: 2 },
  { value: "1x2", label: "1x2", width: 1, height: 2 },
  { value: "2x1", label: "2x1", width: 2, height: 1 },
] as const;
export const GROWING_TREE_BACKTRACK_CHANCE_MIN = 0;
export const GROWING_TREE_BACKTRACK_CHANCE_MAX = 1;
export const GROWING_TREE_BACKTRACK_CHANCE_STEP = 0.05;

export type GenerateAlgorithmId =
  | "random-noise"
  | "backtracking-generator"
  | "growing-tree"
  | "prims"
  | "recursive-division";
export type GenerateAlgorithmChoice = GenerateAlgorithmId | "any";
export type GenerateRecordAlgorithm = GenerateAlgorithmId | "starred";
export type RandomNoiseMirrorMode = "none" | "horizontal" | "vertical" | "quad";
export type MazeBlockSize = (typeof MAZE_BLOCK_SIZE_OPTIONS)[number]["value"];

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

export type MazeAlgorithmParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  startColumn: number;
  startRow: number;
}>;

export type BacktrackingParameters = MazeAlgorithmParameters;
export type PrimsParameters = MazeAlgorithmParameters;

export type GrowingTreeParameters = MazeAlgorithmParameters &
  Readonly<{
    backtrackChance: number;
  }>;

export type RecursiveDivisionParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
}>;

export type RandomNoiseControlState = Readonly<{
  seed: RandomizableValue<number>;
  density: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  mirror: RandomizableValue<RandomNoiseMirrorMode>;
  invert: RandomizableValue<boolean>;
}>;

type MazeBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<MazeBlockSize>;
  startColumn: RandomizableValue<number>;
  startRow: RandomizableValue<number>;
}>;

export type BacktrackingControlState = MazeBaseControlState;
export type PrimsControlState = MazeBaseControlState;

export type GrowingTreeControlState = MazeBaseControlState &
  Readonly<{
    backtrackChance: RandomizableValue<number>;
  }>;

export type RecursiveDivisionControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<MazeBlockSize>;
}>;

type BaseGeneratedLayoutRecord<
  Algorithm extends GenerateRecordAlgorithm,
  Params extends
    | RandomNoiseParameters
    | BacktrackingParameters
    | PrimsParameters
    | GrowingTreeParameters
    | RecursiveDivisionParameters
    | null,
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

export type PrimsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"prims", PrimsParameters>;

export type GrowingTreeGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "growing-tree",
  GrowingTreeParameters
>;

export type RecursiveDivisionGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "recursive-division",
  RecursiveDivisionParameters
>;

export type StarredGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"starred", null>;

export type GeneratedLayoutRecord =
  | RandomNoiseGeneratedLayoutRecord
  | BacktrackingGeneratedLayoutRecord
  | PrimsGeneratedLayoutRecord
  | GrowingTreeGeneratedLayoutRecord
  | RecursiveDivisionGeneratedLayoutRecord
  | StarredGeneratedLayoutRecord;

export const GENERATE_ALGORITHM_OPTIONS: ReadonlyArray<
  Readonly<{ value: GenerateAlgorithmChoice; label: string }>
> = [
  { value: "any", label: "Any" },
  { value: "random-noise", label: "Random Noise" },
  { value: "backtracking-generator", label: "Backtracking Generator" },
  { value: "growing-tree", label: "Growing Tree" },
  { value: "prims", label: "Prim's" },
  { value: "recursive-division", label: "Recursive Division" },
];

const RANDOM_NOISE_LABEL = "Random Noise";
const BACKTRACKING_LABEL = "Backtracking Generator";
const PRIMS_LABEL = "Prim's";
const GROWING_TREE_LABEL = "Growing Tree";
const RECURSIVE_DIVISION_LABEL = "Recursive Division";
const GENERATED_LAYOUT_MIN_WALL_COUNT = 24;
const GENERATED_LAYOUT_MAX_WALL_COUNT = 1000;
const AVAILABLE_GENERATE_ALGORITHMS: ReadonlyArray<GenerateAlgorithmId> = [
  "random-noise",
  "backtracking-generator",
  "growing-tree",
  "prims",
  "recursive-division",
];
const GROWING_TREE_BACKTRACK_CHANCE_VALUES = [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1];

export function randomSeedFromClock(): number {
  return Date.now() & 0x7fffffff;
}

export function nextRandomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

export function mazeGridDimensionsForBlockSize(
  blockSize: MazeBlockSize,
): Readonly<{ columns: number; rows: number }> {
  const dims = mazeBlockDimensions(blockSize);
  return {
    columns: Math.floor((GENERATED_LAYOUT_GRID_SIZE - 1) / (dims.width + 1)),
    rows: Math.floor((GENERATED_LAYOUT_GRID_SIZE - 1) / (dims.height + 1)),
  };
}

export function generateLayoutRecords(
  options: Readonly<{
    algorithm: GenerateAlgorithmChoice;
    count?: number;
    seed: number;
    randomNoiseControls?: RandomNoiseControlState | null;
    backtrackingControls?: BacktrackingControlState | null;
    primsControls?: PrimsControlState | null;
    growingTreeControls?: GrowingTreeControlState | null;
    recursiveDivisionControls?: RecursiveDivisionControlState | null;
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
      primsControls: options.primsControls ?? null,
      growingTreeControls: options.growingTreeControls ?? null,
      recursiveDivisionControls: options.recursiveDivisionControls ?? null,
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
    blockSize: { randomize: true, value: "1x1" },
    startColumn: { randomize: true, value: 8 },
    startRow: { randomize: true, value: 8 },
  };
}

export function createDefaultPrimsControlState(): PrimsControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    startColumn: { randomize: true, value: 8 },
    startRow: { randomize: true, value: 8 },
  };
}

export function createDefaultGrowingTreeControlState(): GrowingTreeControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    startColumn: { randomize: true, value: 8 },
    startRow: { randomize: true, value: 8 },
    backtrackChance: { randomize: true, value: 1 },
  };
}

export function createDefaultRecursiveDivisionControlState(): RecursiveDivisionControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
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
    primsControls: PrimsControlState | null;
    growingTreeControls: GrowingTreeControlState | null;
    recursiveDivisionControls: RecursiveDivisionControlState | null;
  }>,
): GeneratedLayoutRecord {
  switch (algorithm) {
    case "random-noise":
      return buildRandomNoiseRecord(rng, controls.randomNoiseControls);
    case "backtracking-generator":
      return buildBacktrackingRecord(rng, controls.backtrackingControls);
    case "prims":
      return buildPrimsRecord(rng, controls.primsControls);
    case "growing-tree":
      return buildGrowingTreeRecord(rng, controls.growingTreeControls);
    case "recursive-division":
      return buildRecursiveDivisionRecord(rng, controls.recursiveDivisionControls);
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
  const params = randomizeMazeBaseParameters(
    rng,
    controls ?? createDefaultBacktrackingControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(buildMazeMaskBytes(params, "backtracking", rng)),
    algorithm: "backtracking-generator",
    title: BACKTRACKING_LABEL,
    summary: buildBacktrackingSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildPrimsRecord(
  rng: () => number,
  controls: PrimsControlState | null,
): PrimsGeneratedLayoutRecord {
  const params = randomizeMazeBaseParameters(rng, controls ?? createDefaultPrimsControlState());
  return {
    wallKey: wallMaskKeyFromBytes(buildMazeMaskBytes(params, "prims", rng)),
    algorithm: "prims",
    title: PRIMS_LABEL,
    summary: buildPrimsSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildGrowingTreeRecord(
  rng: () => number,
  controls: GrowingTreeControlState | null,
): GrowingTreeGeneratedLayoutRecord {
  const params = randomizeGrowingTreeParameters(rng, controls);
  return {
    wallKey: wallMaskKeyFromBytes(buildMazeMaskBytes(params, "growing-tree", rng)),
    algorithm: "growing-tree",
    title: GROWING_TREE_LABEL,
    summary: buildGrowingTreeSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildRecursiveDivisionRecord(
  rng: () => number,
  controls: RecursiveDivisionControlState | null,
): RecursiveDivisionGeneratedLayoutRecord {
  const params = randomizeRecursiveDivisionParameters(
    rng,
    controls ?? createDefaultRecursiveDivisionControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(buildRecursiveDivisionMaskBytes(params, rng)),
    algorithm: "recursive-division",
    title: RECURSIVE_DIVISION_LABEL,
    summary: buildRecursiveDivisionSummary(params),
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
      sampleClosestNoiseBlockSize,
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

function randomizeMazeBaseParameters(
  rng: () => number,
  defaults: MazeBaseControlState,
): MazeAlgorithmParameters {
  const blockSize = resolveRandomizableValue(
    defaults.blockSize,
    () =>
      sampleOne(
        rng,
        MAZE_BLOCK_SIZE_OPTIONS.map((option) => option.value),
      ),
    sanitizeMazeBlockSize,
  );
  const dims = mazeGridDimensionsForBlockSize(blockSize);
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, MAZE_SEED_MIN, MAZE_SEED_MAX),
      (value) => clamp(Math.round(value), MAZE_SEED_MIN, MAZE_SEED_MAX),
    ),
    blockSize,
    startColumn: resolveRandomizableValue(
      defaults.startColumn,
      () => randomInt(rng, MAZE_START_MIN, dims.columns),
      (value) => clamp(Math.round(value), MAZE_START_MIN, dims.columns),
    ),
    startRow: resolveRandomizableValue(
      defaults.startRow,
      () => randomInt(rng, MAZE_START_MIN, dims.rows),
      (value) => clamp(Math.round(value), MAZE_START_MIN, dims.rows),
    ),
  };
}

function randomizeGrowingTreeParameters(
  rng: () => number,
  controls: GrowingTreeControlState | null,
): GrowingTreeParameters {
  const defaults = controls ?? createDefaultGrowingTreeControlState();
  const base = randomizeMazeBaseParameters(rng, defaults);
  return {
    ...base,
    backtrackChance: resolveRandomizableValue(
      defaults.backtrackChance,
      () => sampleOne(rng, GROWING_TREE_BACKTRACK_CHANCE_VALUES),
      (value) =>
        clamp(
          Math.round(value / GROWING_TREE_BACKTRACK_CHANCE_STEP) *
            GROWING_TREE_BACKTRACK_CHANCE_STEP,
          GROWING_TREE_BACKTRACK_CHANCE_MIN,
          GROWING_TREE_BACKTRACK_CHANCE_MAX,
        ),
    ),
  };
}

function randomizeRecursiveDivisionParameters(
  rng: () => number,
  defaults: RecursiveDivisionControlState,
): RecursiveDivisionParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, MAZE_SEED_MIN, MAZE_SEED_MAX),
      (value) => clamp(Math.round(value), MAZE_SEED_MIN, MAZE_SEED_MAX),
    ),
    blockSize: resolveRandomizableValue(
      defaults.blockSize,
      () =>
        sampleOne(
          rng,
          MAZE_BLOCK_SIZE_OPTIONS.map((option) => option.value),
        ),
      sanitizeMazeBlockSize,
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

function buildMazeMaskBytes(
  params: MazeAlgorithmParameters | GrowingTreeParameters,
  algorithm: "backtracking" | "growing-tree" | "prims",
  rng: () => number,
): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = new Uint8Array(GENERATED_LAYOUT_GRID_SIZE * GENERATED_LAYOUT_GRID_SIZE);
  walls.fill(1);
  const visited = new Uint8Array(metrics.columns * metrics.rows);
  const start = {
    x: clamp(params.startColumn, MAZE_START_MIN, metrics.columns) - 1,
    y: clamp(params.startRow, MAZE_START_MIN, metrics.rows) - 1,
  };

  markVisited(visited, metrics.columns, start.x, start.y);
  carveMazeCell(walls, metrics, start.x, start.y);

  if (algorithm === "backtracking") {
    const stack: Array<Readonly<{ x: number; y: number }>> = [start];

    while (stack.length > 0) {
      const current = stack[stack.length - 1]!;
      const neighbors = listMazeNeighbors(
        current.x,
        current.y,
        visited,
        metrics.columns,
        metrics.rows,
      );
      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }

      const next = sampleOne(rng, neighbors);
      carveMazePassage(walls, metrics, current, next);
      markVisited(visited, metrics.columns, next.x, next.y);
      stack.push(next);
    }
  } else if (algorithm === "growing-tree") {
    const active: Array<Readonly<{ x: number; y: number }>> = [start];
    const backtrackChance = (params as GrowingTreeParameters).backtrackChance;

    while (active.length > 0) {
      const currentIndex =
        rng() < backtrackChance ? active.length - 1 : randomInt(rng, 0, active.length - 1);
      const current = active[currentIndex]!;
      const neighbors = listMazeNeighbors(
        current.x,
        current.y,
        visited,
        metrics.columns,
        metrics.rows,
      );
      if (neighbors.length === 0) {
        active.splice(currentIndex, 1);
        continue;
      }

      const next = sampleOne(rng, neighbors);
      carveMazePassage(walls, metrics, current, next);
      markVisited(visited, metrics.columns, next.x, next.y);
      active.push(next);
    }
  } else {
    const frontier: Array<Readonly<{ x: number; y: number }>> = [];
    const frontierFlags = new Uint8Array(metrics.columns * metrics.rows);
    addFrontierNeighbors(frontier, frontierFlags, visited, metrics.columns, metrics.rows, start);

    while (frontier.length > 0) {
      const currentIndex = randomInt(rng, 0, frontier.length - 1);
      const current = frontier.splice(currentIndex, 1)[0]!;
      frontierFlags[current.y * metrics.columns + current.x] = 0;
      const visitedNeighbors = listMazeNeighbors(
        current.x,
        current.y,
        visited,
        metrics.columns,
        metrics.rows,
        "visited",
      );
      if (visitedNeighbors.length === 0) continue;

      const anchor = sampleOne(rng, visitedNeighbors);
      carveMazePassage(walls, metrics, anchor, current);
      markVisited(visited, metrics.columns, current.x, current.y);
      addFrontierNeighbors(
        frontier,
        frontierFlags,
        visited,
        metrics.columns,
        metrics.rows,
        current,
      );
    }
  }

  const bytes = new Uint8Array(128);
  for (let index = 0; index < walls.length; index++) {
    if (walls[index] !== 1) continue;
    setMaskBit(bytes, index);
  }
  return bytes;
}

function buildRecursiveDivisionMaskBytes(
  params: RecursiveDivisionParameters,
  rng: () => number,
): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = new Uint8Array(GENERATED_LAYOUT_GRID_SIZE * GENERATED_LAYOUT_GRID_SIZE);

  fillRect(walls, 0, 0, GENERATED_LAYOUT_GRID_SIZE, 1);
  fillRect(walls, 0, GENERATED_LAYOUT_GRID_SIZE - 1, GENERATED_LAYOUT_GRID_SIZE, 1);
  fillRect(walls, 0, 0, 1, GENERATED_LAYOUT_GRID_SIZE);
  fillRect(walls, GENERATED_LAYOUT_GRID_SIZE - 1, 0, 1, GENERATED_LAYOUT_GRID_SIZE);

  const regions: Array<Readonly<{ minX: number; minY: number; maxX: number; maxY: number }>> = [
    {
      minX: 0,
      minY: 0,
      maxX: metrics.columns - 1,
      maxY: metrics.rows - 1,
    },
  ];

  while (regions.length > 0) {
    const region = regions.pop()!;
    const width = region.maxX - region.minX + 1;
    const height = region.maxY - region.minY + 1;

    if (width <= 1 || height <= 1) continue;

    const cutDirection =
      width < height
        ? "horizontal"
        : width > height
          ? "vertical"
          : rng() < 0.5
            ? "vertical"
            : "horizontal";

    if (cutDirection === "vertical") {
      if (width < 2) continue;
      const split = randomInt(rng, region.minX + 1, region.maxX);
      const wallX = split * (metrics.blockWidth + 1);
      const startY = region.minY * (metrics.blockHeight + 1) + 1;
      const endY = region.maxY * (metrics.blockHeight + 1) + metrics.blockHeight;
      fillRect(walls, wallX, startY, 1, endY - startY + 1);

      const doorCellY = randomInt(rng, region.minY, region.maxY);
      carveRect(walls, wallX, doorCellY * (metrics.blockHeight + 1) + 1, 1, metrics.blockHeight);

      regions.push({
        minX: region.minX,
        minY: region.minY,
        maxX: split - 1,
        maxY: region.maxY,
      });
      regions.push({
        minX: split,
        minY: region.minY,
        maxX: region.maxX,
        maxY: region.maxY,
      });
    } else {
      if (height < 2) continue;
      const split = randomInt(rng, region.minY + 1, region.maxY);
      const wallY = split * (metrics.blockHeight + 1);
      const startX = region.minX * (metrics.blockWidth + 1) + 1;
      const endX = region.maxX * (metrics.blockWidth + 1) + metrics.blockWidth;
      fillRect(walls, startX, wallY, endX - startX + 1, 1);

      const doorCellX = randomInt(rng, region.minX, region.maxX);
      carveRect(walls, doorCellX * (metrics.blockWidth + 1) + 1, wallY, metrics.blockWidth, 1);

      regions.push({
        minX: region.minX,
        minY: region.minY,
        maxX: region.maxX,
        maxY: split - 1,
      });
      regions.push({
        minX: region.minX,
        minY: split,
        maxX: region.maxX,
        maxY: region.maxY,
      });
    }
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
  return `${params.blockSize} blocks • start ${params.startColumn}, ${params.startRow}`;
}

function buildPrimsSummary(params: PrimsParameters): string {
  return `${params.blockSize} blocks • start ${params.startColumn}, ${params.startRow}`;
}

function buildGrowingTreeSummary(params: GrowingTreeParameters): string {
  return [
    `${params.blockSize} blocks`,
    `start ${params.startColumn}, ${params.startRow}`,
    `${Math.round(params.backtrackChance * 100)}% backtrack`,
  ].join(" • ");
}

function buildRecursiveDivisionSummary(params: RecursiveDivisionParameters): string {
  return `${params.blockSize} blocks`;
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

function listMazeNeighbors(
  x: number,
  y: number,
  visited: Uint8Array,
  columns: number,
  rows: number,
  mode: "visited" | "unvisited" = "unvisited",
): Array<Readonly<{ x: number; y: number }>> {
  const neighbors: Array<Readonly<{ x: number; y: number }>> = [];
  const candidates = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];

  for (const candidate of candidates) {
    if (candidate.x < 0 || candidate.x >= columns || candidate.y < 0 || candidate.y >= rows) {
      continue;
    }
    const isVisited = visited[candidate.y * columns + candidate.x] === 1;
    if (mode === "unvisited" && isVisited) continue;
    if (mode === "visited" && !isVisited) continue;
    neighbors.push(candidate);
  }

  return neighbors;
}

function addFrontierNeighbors(
  frontier: Array<Readonly<{ x: number; y: number }>>,
  frontierFlags: Uint8Array,
  visited: Uint8Array,
  columns: number,
  rows: number,
  current: Readonly<{ x: number; y: number }>,
): void {
  const neighbors = listMazeNeighbors(current.x, current.y, visited, columns, rows, "unvisited");
  for (const neighbor of neighbors) {
    const index = neighbor.y * columns + neighbor.x;
    if (frontierFlags[index] === 1) continue;
    frontierFlags[index] = 1;
    frontier.push(neighbor);
  }
}

function resolveMazeMetrics(blockSize: MazeBlockSize): Readonly<{
  blockWidth: number;
  blockHeight: number;
  columns: number;
  rows: number;
}> {
  const dims = mazeBlockDimensions(blockSize);
  const grid = mazeGridDimensionsForBlockSize(blockSize);
  return {
    blockWidth: dims.width,
    blockHeight: dims.height,
    columns: grid.columns,
    rows: grid.rows,
  };
}

function mazeBlockDimensions(
  blockSize: MazeBlockSize,
): Readonly<{ width: number; height: number }> {
  const option = MAZE_BLOCK_SIZE_OPTIONS.find((entry) => entry.value === blockSize);
  return option ?? MAZE_BLOCK_SIZE_OPTIONS[0];
}

function carveMazeCell(
  walls: Uint8Array,
  metrics: Readonly<{ blockWidth: number; blockHeight: number }>,
  cellX: number,
  cellY: number,
): void {
  carveRect(
    walls,
    cellX * (metrics.blockWidth + 1) + 1,
    cellY * (metrics.blockHeight + 1) + 1,
    metrics.blockWidth,
    metrics.blockHeight,
  );
}

function carveMazePassage(
  walls: Uint8Array,
  metrics: Readonly<{ blockWidth: number; blockHeight: number }>,
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
): void {
  carveMazeCell(walls, metrics, to.x, to.y);

  const fromX = from.x * (metrics.blockWidth + 1) + 1;
  const fromY = from.y * (metrics.blockHeight + 1) + 1;

  if (to.x !== from.x) {
    const connectorX = fromX + (to.x > from.x ? metrics.blockWidth : -1);
    carveRect(walls, connectorX, fromY, 1, metrics.blockHeight);
    return;
  }

  const connectorY = fromY + (to.y > from.y ? metrics.blockHeight : -1);
  carveRect(walls, fromX, connectorY, metrics.blockWidth, 1);
}

function carveRect(walls: Uint8Array, x: number, y: number, width: number, height: number): void {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      walls[mazeTileIndex(x + dx, y + dy)] = 0;
    }
  }
}

function fillRect(walls: Uint8Array, x: number, y: number, width: number, height: number): void {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      walls[mazeTileIndex(x + dx, y + dy)] = 1;
    }
  }
}

function mazeTileIndex(x: number, y: number): number {
  return y * GENERATED_LAYOUT_GRID_SIZE + x;
}

function markVisited(visited: Uint8Array, width: number, x: number, y: number): void {
  visited[y * width + x] = 1;
}

function sanitizeMazeBlockSize(value: MazeBlockSize): MazeBlockSize {
  return MAZE_BLOCK_SIZE_OPTIONS.some((option) => option.value === value) ? value : "1x1";
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

function sampleClosestNoiseBlockSize(value: number): number {
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
