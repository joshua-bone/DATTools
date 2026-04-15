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
export const NOISE_TERRAIN_THRESHOLD_MIN = 0.32;
export const NOISE_TERRAIN_THRESHOLD_MAX = 0.68;
export const NOISE_TERRAIN_THRESHOLD_STEP = 0.02;
export const NOISE_TERRAIN_SCALE_MIN = 1;
export const NOISE_TERRAIN_SCALE_MAX = 9;
export const NOISE_TERRAIN_SCALE_STEP = 0.25;
export const NOISE_TERRAIN_OCTAVES_MIN = 1;
export const NOISE_TERRAIN_OCTAVES_MAX = 5;
export const VALUE_FRACTAL_GAIN_MIN = 0.35;
export const VALUE_FRACTAL_GAIN_MAX = 0.85;
export const VALUE_FRACTAL_GAIN_STEP = 0.05;
export const WORLEY_CELL_COUNT_MIN = 2;
export const WORLEY_CELL_COUNT_MAX = 9;
export const WORLEY_JITTER_MIN = 0.1;
export const WORLEY_JITTER_MAX = 1;
export const WORLEY_JITTER_STEP = 0.05;
export const THRESHOLDED_GRADIENT_ANGLE_MIN = 0;
export const THRESHOLDED_GRADIENT_ANGLE_MAX = 165;
export const THRESHOLDED_GRADIENT_ANGLE_STEP = 15;
export const THRESHOLDED_GRADIENT_ROUGHNESS_MIN = 0;
export const THRESHOLDED_GRADIENT_ROUGHNESS_MAX = 1;
export const THRESHOLDED_GRADIENT_ROUGHNESS_STEP = 0.05;
export const DOMAIN_WARP_SCALE_MIN = 0.75;
export const DOMAIN_WARP_SCALE_MAX = 5;
export const DOMAIN_WARP_SCALE_STEP = 0.25;
export const DOMAIN_WARP_STRENGTH_MIN = 0.1;
export const DOMAIN_WARP_STRENGTH_MAX = 0.75;
export const DOMAIN_WARP_STRENGTH_STEP = 0.05;

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
export const SIDEWINDER_SKEW_MIN = 0;
export const SIDEWINDER_SKEW_MAX = 1;
export const SIDEWINDER_SKEW_STEP = 0.05;
export const CELLULAR_AUTOMATON_COMPLEXITY_MIN = 0.1;
export const CELLULAR_AUTOMATON_COMPLEXITY_MAX = 1;
export const CELLULAR_AUTOMATON_COMPLEXITY_STEP = 0.05;
export const CELLULAR_AUTOMATON_DENSITY_MIN = 0.1;
export const CELLULAR_AUTOMATON_DENSITY_MAX = 1;
export const CELLULAR_AUTOMATON_DENSITY_STEP = 0.05;
export const DUNGEON_ROOM_COUNT_MIN = 1;
export const DUNGEON_ROOM_COUNT_MAX = 6;
export const DUNGEON_ROOM_SIZE_MIN = 1;
export const DUNGEON_ROOM_SIZE_MAX = 5;

export type GenerateAlgorithmId =
  | "random-noise"
  | "perlin-noise"
  | "value-fractal-noise"
  | "worley-noise"
  | "thresholded-gradient-noise"
  | "domain-warped-noise"
  | "backtracking-generator"
  | "growing-tree"
  | "prims"
  | "recursive-division"
  | "kruskals"
  | "sidewinder"
  | "binary-tree"
  | "hunt-and-kill"
  | "wilsons"
  | "aldous-broder"
  | "ellers"
  | "cellular-automaton"
  | "dungeon-rooms"
  | "trivial-maze";
export type GenerateAlgorithmChoice = GenerateAlgorithmId | "any";
export type GenerateRecordAlgorithm = GenerateAlgorithmId | "starred";
export type RandomNoiseMirrorMode = "none" | "horizontal" | "vertical" | "quad";
export type MazeBlockSize = (typeof MAZE_BLOCK_SIZE_OPTIONS)[number]["value"];
export type BinaryTreeSkew = "NW" | "NE" | "SW" | "SE";
export type HuntOrder = "random" | "serpentine";
export type TrivialMazeType = "spiral" | "serpentine";

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

type NoiseTerrainBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  threshold: number;
  invert: boolean;
}>;

export type PerlinNoiseParameters = NoiseTerrainBaseParameters &
  Readonly<{
    scale: number;
    octaves: number;
  }>;

export type ValueFractalNoiseParameters = NoiseTerrainBaseParameters &
  Readonly<{
    scale: number;
    octaves: number;
    gain: number;
  }>;

export type WorleyNoiseParameters = NoiseTerrainBaseParameters &
  Readonly<{
    cellCount: number;
    jitter: number;
  }>;

export type ThresholdedGradientNoiseParameters = NoiseTerrainBaseParameters &
  Readonly<{
    scale: number;
    angle: number;
    roughness: number;
  }>;

export type DomainWarpedNoiseParameters = NoiseTerrainBaseParameters &
  Readonly<{
    scale: number;
    octaves: number;
    warpScale: number;
    warpStrength: number;
  }>;

export type MazeAlgorithmParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  startColumn: number;
  startRow: number;
}>;

export type BacktrackingParameters = MazeAlgorithmParameters;
export type PrimsParameters = MazeAlgorithmParameters;
export type KruskalsParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
}>;
export type SidewinderParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  skew: number;
}>;
export type BinaryTreeParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  skew: BinaryTreeSkew;
}>;
export type HuntAndKillParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  huntOrder: HuntOrder;
}>;
export type WilsonsParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  huntOrder: HuntOrder;
}>;
export type AldousBroderParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
}>;
export type EllersParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  xskew: number;
  yskew: number;
}>;
export type CellularAutomatonParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  complexity: number;
  density: number;
}>;
export type DungeonRoomsParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  huntOrder: HuntOrder;
  roomCount: number;
  roomSize: number;
}>;
export type TrivialMazeParameters = Readonly<{
  seed: number;
  blockSize: MazeBlockSize;
  mazeType: TrivialMazeType;
}>;

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

type NoiseTerrainBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  threshold: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

export type PerlinNoiseControlState = NoiseTerrainBaseControlState &
  Readonly<{
    scale: RandomizableValue<number>;
    octaves: RandomizableValue<number>;
  }>;

export type ValueFractalNoiseControlState = NoiseTerrainBaseControlState &
  Readonly<{
    scale: RandomizableValue<number>;
    octaves: RandomizableValue<number>;
    gain: RandomizableValue<number>;
  }>;

export type WorleyNoiseControlState = NoiseTerrainBaseControlState &
  Readonly<{
    cellCount: RandomizableValue<number>;
    jitter: RandomizableValue<number>;
  }>;

export type ThresholdedGradientNoiseControlState = NoiseTerrainBaseControlState &
  Readonly<{
    scale: RandomizableValue<number>;
    angle: RandomizableValue<number>;
    roughness: RandomizableValue<number>;
  }>;

export type DomainWarpedNoiseControlState = NoiseTerrainBaseControlState &
  Readonly<{
    scale: RandomizableValue<number>;
    octaves: RandomizableValue<number>;
    warpScale: RandomizableValue<number>;
    warpStrength: RandomizableValue<number>;
  }>;

type MazeBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<MazeBlockSize>;
  startColumn: RandomizableValue<number>;
  startRow: RandomizableValue<number>;
}>;

type MazeSeedBlockControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<MazeBlockSize>;
}>;

export type BacktrackingControlState = MazeBaseControlState;
export type PrimsControlState = MazeBaseControlState;
export type KruskalsControlState = MazeSeedBlockControlState;
export type SidewinderControlState = MazeSeedBlockControlState &
  Readonly<{
    skew: RandomizableValue<number>;
  }>;
export type BinaryTreeControlState = MazeSeedBlockControlState &
  Readonly<{
    skew: RandomizableValue<BinaryTreeSkew>;
  }>;
export type HuntAndKillControlState = MazeSeedBlockControlState &
  Readonly<{
    huntOrder: RandomizableValue<HuntOrder>;
  }>;
export type WilsonsControlState = MazeSeedBlockControlState &
  Readonly<{
    huntOrder: RandomizableValue<HuntOrder>;
  }>;
export type AldousBroderControlState = MazeSeedBlockControlState;
export type EllersControlState = MazeSeedBlockControlState &
  Readonly<{
    xskew: RandomizableValue<number>;
    yskew: RandomizableValue<number>;
  }>;
export type CellularAutomatonControlState = MazeSeedBlockControlState &
  Readonly<{
    complexity: RandomizableValue<number>;
    density: RandomizableValue<number>;
  }>;
export type DungeonRoomsControlState = MazeSeedBlockControlState &
  Readonly<{
    huntOrder: RandomizableValue<HuntOrder>;
    roomCount: RandomizableValue<number>;
    roomSize: RandomizableValue<number>;
  }>;
export type TrivialMazeControlState = MazeSeedBlockControlState &
  Readonly<{
    mazeType: RandomizableValue<TrivialMazeType>;
  }>;

export type GrowingTreeControlState = MazeBaseControlState &
  Readonly<{
    backtrackChance: RandomizableValue<number>;
  }>;

export type RecursiveDivisionControlState = MazeSeedBlockControlState;

type BaseGeneratedLayoutRecord<
  Algorithm extends GenerateRecordAlgorithm,
  Params extends
    | RandomNoiseParameters
    | PerlinNoiseParameters
    | ValueFractalNoiseParameters
    | WorleyNoiseParameters
    | ThresholdedGradientNoiseParameters
    | DomainWarpedNoiseParameters
    | BacktrackingParameters
    | PrimsParameters
    | KruskalsParameters
    | SidewinderParameters
    | BinaryTreeParameters
    | HuntAndKillParameters
    | WilsonsParameters
    | AldousBroderParameters
    | EllersParameters
    | CellularAutomatonParameters
    | DungeonRoomsParameters
    | TrivialMazeParameters
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

export type PerlinNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "perlin-noise",
  PerlinNoiseParameters
>;

export type ValueFractalNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "value-fractal-noise",
  ValueFractalNoiseParameters
>;

export type WorleyNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "worley-noise",
  WorleyNoiseParameters
>;

export type ThresholdedGradientNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "thresholded-gradient-noise",
  ThresholdedGradientNoiseParameters
>;

export type DomainWarpedNoiseGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "domain-warped-noise",
  DomainWarpedNoiseParameters
>;

export type BacktrackingGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "backtracking-generator",
  BacktrackingParameters
>;

export type PrimsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"prims", PrimsParameters>;

export type KruskalsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "kruskals",
  KruskalsParameters
>;

export type SidewinderGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "sidewinder",
  SidewinderParameters
>;

export type BinaryTreeGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "binary-tree",
  BinaryTreeParameters
>;
export type HuntAndKillGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "hunt-and-kill",
  HuntAndKillParameters
>;
export type WilsonsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"wilsons", WilsonsParameters>;
export type AldousBroderGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "aldous-broder",
  AldousBroderParameters
>;
export type EllersGeneratedLayoutRecord = BaseGeneratedLayoutRecord<"ellers", EllersParameters>;
export type CellularAutomatonGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "cellular-automaton",
  CellularAutomatonParameters
>;
export type DungeonRoomsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "dungeon-rooms",
  DungeonRoomsParameters
>;
export type TrivialMazeGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "trivial-maze",
  TrivialMazeParameters
>;

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
  | PerlinNoiseGeneratedLayoutRecord
  | ValueFractalNoiseGeneratedLayoutRecord
  | WorleyNoiseGeneratedLayoutRecord
  | ThresholdedGradientNoiseGeneratedLayoutRecord
  | DomainWarpedNoiseGeneratedLayoutRecord
  | BacktrackingGeneratedLayoutRecord
  | PrimsGeneratedLayoutRecord
  | KruskalsGeneratedLayoutRecord
  | SidewinderGeneratedLayoutRecord
  | BinaryTreeGeneratedLayoutRecord
  | HuntAndKillGeneratedLayoutRecord
  | WilsonsGeneratedLayoutRecord
  | AldousBroderGeneratedLayoutRecord
  | EllersGeneratedLayoutRecord
  | CellularAutomatonGeneratedLayoutRecord
  | DungeonRoomsGeneratedLayoutRecord
  | TrivialMazeGeneratedLayoutRecord
  | GrowingTreeGeneratedLayoutRecord
  | RecursiveDivisionGeneratedLayoutRecord
  | StarredGeneratedLayoutRecord;

export const GENERATE_ALGORITHM_OPTIONS: ReadonlyArray<
  Readonly<{ value: GenerateAlgorithmChoice; label: string }>
> = [
  { value: "any", label: "Any" },
  { value: "random-noise", label: "Random Noise" },
  { value: "perlin-noise", label: "Perlin Noise" },
  { value: "value-fractal-noise", label: "Value Noise / Fractal Noise" },
  { value: "worley-noise", label: "Worley / Cellular Noise" },
  { value: "thresholded-gradient-noise", label: "Thresholded Gradient Noise" },
  { value: "domain-warped-noise", label: "Domain-Warped Noise" },
  { value: "backtracking-generator", label: "Backtracking Generator" },
  { value: "growing-tree", label: "Growing Tree" },
  { value: "prims", label: "Prim's" },
  { value: "recursive-division", label: "Recursive Division" },
  { value: "kruskals", label: "Kruskal's" },
  { value: "sidewinder", label: "Sidewinder" },
  { value: "binary-tree", label: "Binary Tree" },
  { value: "hunt-and-kill", label: "Hunt-and-Kill" },
  { value: "wilsons", label: "Wilson's" },
  { value: "aldous-broder", label: "Aldous-Broder" },
  { value: "ellers", label: "Eller's" },
  { value: "cellular-automaton", label: "Cellular Automaton" },
  { value: "dungeon-rooms", label: "Dungeon Rooms" },
  { value: "trivial-maze", label: "Trivial Maze" },
];

const RANDOM_NOISE_LABEL = "Random Noise";
const PERLIN_NOISE_LABEL = "Perlin Noise";
const VALUE_FRACTAL_NOISE_LABEL = "Value Noise / Fractal Noise";
const WORLEY_NOISE_LABEL = "Worley / Cellular Noise";
const THRESHOLDED_GRADIENT_NOISE_LABEL = "Thresholded Gradient Noise";
const DOMAIN_WARPED_NOISE_LABEL = "Domain-Warped Noise";
const BACKTRACKING_LABEL = "Backtracking Generator";
const PRIMS_LABEL = "Prim's";
const KRUSKALS_LABEL = "Kruskal's";
const SIDEWINDER_LABEL = "Sidewinder";
const BINARY_TREE_LABEL = "Binary Tree";
const HUNT_AND_KILL_LABEL = "Hunt-and-Kill";
const WILSONS_LABEL = "Wilson's";
const ALDOUS_BRODER_LABEL = "Aldous-Broder";
const ELLERS_LABEL = "Eller's";
const CELLULAR_AUTOMATON_LABEL = "Cellular Automaton";
const DUNGEON_ROOMS_LABEL = "Dungeon Rooms";
const TRIVIAL_MAZE_LABEL = "Trivial Maze";
const GROWING_TREE_LABEL = "Growing Tree";
const RECURSIVE_DIVISION_LABEL = "Recursive Division";
const GENERATED_LAYOUT_MIN_WALL_COUNT = 24;
const GENERATED_LAYOUT_MAX_WALL_COUNT = 1000;
const AVAILABLE_GENERATE_ALGORITHMS: ReadonlyArray<GenerateAlgorithmId> = [
  "random-noise",
  "perlin-noise",
  "value-fractal-noise",
  "worley-noise",
  "thresholded-gradient-noise",
  "domain-warped-noise",
  "backtracking-generator",
  "growing-tree",
  "prims",
  "recursive-division",
  "kruskals",
  "sidewinder",
  "binary-tree",
  "hunt-and-kill",
  "wilsons",
  "aldous-broder",
  "ellers",
  "cellular-automaton",
  "dungeon-rooms",
  "trivial-maze",
];
const MAZE_RANDOM_BLOCK_SIZE_VALUES: ReadonlyArray<MazeBlockSize> = [
  "1x1",
  "1x1",
  "2x2",
  "2x2",
  "1x2",
  "2x1",
];
const GROWING_TREE_BACKTRACK_CHANCE_VALUES = [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1];
const SIDEWINDER_SKEW_VALUES = [0.15, 0.3, 0.5, 0.7, 0.85];
const ELLERS_SKEW_VALUES = [0.15, 0.3, 0.5, 0.7, 0.85];
const CELLULAR_AUTOMATON_COMPLEXITY_VALUES = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
const CELLULAR_AUTOMATON_DENSITY_VALUES = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
const DUNGEON_ROOM_COUNT_VALUES = [1, 2, 3, 4, 5, 6];
const DUNGEON_ROOM_SIZE_VALUES = [1, 2, 3, 4, 5];
const NOISE_TERRAIN_THRESHOLD_VALUES = [0.36, 0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64];
const NOISE_TERRAIN_SCALE_VALUES = [1.25, 1.75, 2.25, 3, 4, 5, 6, 7.5, 9];
const NOISE_TERRAIN_OCTAVE_VALUES = [1, 2, 3, 4, 5];
const VALUE_FRACTAL_GAIN_VALUES = [0.35, 0.45, 0.55, 0.65, 0.75, 0.85];
const WORLEY_CELL_COUNT_VALUES = [2, 3, 4, 5, 6, 7, 8, 9];
const WORLEY_JITTER_VALUES = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
const THRESHOLDED_GRADIENT_ANGLE_VALUES = [0, 30, 45, 60, 90, 120, 135, 150];
const THRESHOLDED_GRADIENT_ROUGHNESS_VALUES = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
const DOMAIN_WARP_SCALE_VALUES = [0.75, 1, 1.5, 2, 2.5, 3.5, 5];
const DOMAIN_WARP_STRENGTH_VALUES = [0.1, 0.2, 0.3, 0.4, 0.55, 0.7];
export const BINARY_TREE_SKEW_OPTIONS: ReadonlyArray<BinaryTreeSkew> = ["NW", "NE", "SW", "SE"];
export const HUNT_ORDER_OPTIONS: ReadonlyArray<HuntOrder> = ["random", "serpentine"];
export const TRIVIAL_MAZE_TYPE_OPTIONS: ReadonlyArray<TrivialMazeType> = ["spiral", "serpentine"];

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
    perlinNoiseControls?: PerlinNoiseControlState | null;
    valueFractalNoiseControls?: ValueFractalNoiseControlState | null;
    worleyNoiseControls?: WorleyNoiseControlState | null;
    thresholdedGradientNoiseControls?: ThresholdedGradientNoiseControlState | null;
    domainWarpedNoiseControls?: DomainWarpedNoiseControlState | null;
    backtrackingControls?: BacktrackingControlState | null;
    primsControls?: PrimsControlState | null;
    kruskalsControls?: KruskalsControlState | null;
    sidewinderControls?: SidewinderControlState | null;
    binaryTreeControls?: BinaryTreeControlState | null;
    huntAndKillControls?: HuntAndKillControlState | null;
    wilsonsControls?: WilsonsControlState | null;
    aldousBroderControls?: AldousBroderControlState | null;
    ellersControls?: EllersControlState | null;
    cellularAutomatonControls?: CellularAutomatonControlState | null;
    dungeonRoomsControls?: DungeonRoomsControlState | null;
    trivialMazeControls?: TrivialMazeControlState | null;
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
      perlinNoiseControls: options.perlinNoiseControls ?? null,
      valueFractalNoiseControls: options.valueFractalNoiseControls ?? null,
      worleyNoiseControls: options.worleyNoiseControls ?? null,
      thresholdedGradientNoiseControls: options.thresholdedGradientNoiseControls ?? null,
      domainWarpedNoiseControls: options.domainWarpedNoiseControls ?? null,
      backtrackingControls: options.backtrackingControls ?? null,
      primsControls: options.primsControls ?? null,
      kruskalsControls: options.kruskalsControls ?? null,
      sidewinderControls: options.sidewinderControls ?? null,
      binaryTreeControls: options.binaryTreeControls ?? null,
      huntAndKillControls: options.huntAndKillControls ?? null,
      wilsonsControls: options.wilsonsControls ?? null,
      aldousBroderControls: options.aldousBroderControls ?? null,
      ellersControls: options.ellersControls ?? null,
      cellularAutomatonControls: options.cellularAutomatonControls ?? null,
      dungeonRoomsControls: options.dungeonRoomsControls ?? null,
      trivialMazeControls: options.trivialMazeControls ?? null,
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

export function createDefaultPerlinNoiseControlState(): PerlinNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: true, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 3 },
  };
}

export function createDefaultValueFractalNoiseControlState(): ValueFractalNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: true, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 4 },
    gain: { randomize: true, value: 0.55 },
  };
}

export function createDefaultWorleyNoiseControlState(): WorleyNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: true, value: false },
    cellCount: { randomize: true, value: 5 },
    jitter: { randomize: true, value: 0.6 },
  };
}

export function createDefaultThresholdedGradientNoiseControlState(): ThresholdedGradientNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: true, value: false },
    scale: { randomize: true, value: 3 },
    angle: { randomize: true, value: 45 },
    roughness: { randomize: true, value: 0.45 },
  };
}

export function createDefaultDomainWarpedNoiseControlState(): DomainWarpedNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: true, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 3 },
    warpScale: { randomize: true, value: 1.5 },
    warpStrength: { randomize: true, value: 0.3 },
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

export function createDefaultKruskalsControlState(): KruskalsControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
  };
}

export function createDefaultSidewinderControlState(): SidewinderControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    skew: { randomize: true, value: 0.5 },
  };
}

export function createDefaultBinaryTreeControlState(): BinaryTreeControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    skew: { randomize: true, value: "NW" },
  };
}

export function createDefaultHuntAndKillControlState(): HuntAndKillControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    huntOrder: { randomize: true, value: "random" },
  };
}

export function createDefaultWilsonsControlState(): WilsonsControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    huntOrder: { randomize: true, value: "random" },
  };
}

export function createDefaultAldousBroderControlState(): AldousBroderControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
  };
}

export function createDefaultEllersControlState(): EllersControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    xskew: { randomize: true, value: 0.5 },
    yskew: { randomize: true, value: 0.5 },
  };
}

export function createDefaultCellularAutomatonControlState(): CellularAutomatonControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    complexity: { randomize: true, value: 0.75 },
    density: { randomize: true, value: 0.6 },
  };
}

export function createDefaultDungeonRoomsControlState(): DungeonRoomsControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    huntOrder: { randomize: true, value: "random" },
    roomCount: { randomize: true, value: 3 },
    roomSize: { randomize: true, value: 3 },
  };
}

export function createDefaultTrivialMazeControlState(): TrivialMazeControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: true, value: "1x1" },
    mazeType: { randomize: true, value: "spiral" },
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
    perlinNoiseControls: PerlinNoiseControlState | null;
    valueFractalNoiseControls: ValueFractalNoiseControlState | null;
    worleyNoiseControls: WorleyNoiseControlState | null;
    thresholdedGradientNoiseControls: ThresholdedGradientNoiseControlState | null;
    domainWarpedNoiseControls: DomainWarpedNoiseControlState | null;
    backtrackingControls: BacktrackingControlState | null;
    primsControls: PrimsControlState | null;
    kruskalsControls: KruskalsControlState | null;
    sidewinderControls: SidewinderControlState | null;
    binaryTreeControls: BinaryTreeControlState | null;
    huntAndKillControls: HuntAndKillControlState | null;
    wilsonsControls: WilsonsControlState | null;
    aldousBroderControls: AldousBroderControlState | null;
    ellersControls: EllersControlState | null;
    cellularAutomatonControls: CellularAutomatonControlState | null;
    dungeonRoomsControls: DungeonRoomsControlState | null;
    trivialMazeControls: TrivialMazeControlState | null;
    growingTreeControls: GrowingTreeControlState | null;
    recursiveDivisionControls: RecursiveDivisionControlState | null;
  }>,
): GeneratedLayoutRecord {
  switch (algorithm) {
    case "random-noise":
      return buildRandomNoiseRecord(rng, controls.randomNoiseControls);
    case "perlin-noise":
      return buildPerlinNoiseRecord(rng, controls.perlinNoiseControls);
    case "value-fractal-noise":
      return buildValueFractalNoiseRecord(rng, controls.valueFractalNoiseControls);
    case "worley-noise":
      return buildWorleyNoiseRecord(rng, controls.worleyNoiseControls);
    case "thresholded-gradient-noise":
      return buildThresholdedGradientNoiseRecord(rng, controls.thresholdedGradientNoiseControls);
    case "domain-warped-noise":
      return buildDomainWarpedNoiseRecord(rng, controls.domainWarpedNoiseControls);
    case "backtracking-generator":
      return buildBacktrackingRecord(rng, controls.backtrackingControls);
    case "prims":
      return buildPrimsRecord(rng, controls.primsControls);
    case "kruskals":
      return buildKruskalsRecord(rng, controls.kruskalsControls);
    case "sidewinder":
      return buildSidewinderRecord(rng, controls.sidewinderControls);
    case "binary-tree":
      return buildBinaryTreeRecord(rng, controls.binaryTreeControls);
    case "hunt-and-kill":
      return buildHuntAndKillRecord(rng, controls.huntAndKillControls);
    case "wilsons":
      return buildWilsonsRecord(rng, controls.wilsonsControls);
    case "aldous-broder":
      return buildAldousBroderRecord(rng, controls.aldousBroderControls);
    case "ellers":
      return buildEllersRecord(rng, controls.ellersControls);
    case "cellular-automaton":
      return buildCellularAutomatonRecord(rng, controls.cellularAutomatonControls);
    case "dungeon-rooms":
      return buildDungeonRoomsRecord(rng, controls.dungeonRoomsControls);
    case "trivial-maze":
      return buildTrivialMazeRecord(rng, controls.trivialMazeControls);
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

function buildNoiseTerrainRecord<
  Algorithm extends
    | "perlin-noise"
    | "value-fractal-noise"
    | "worley-noise"
    | "thresholded-gradient-noise"
    | "domain-warped-noise",
  Params extends
    | PerlinNoiseParameters
    | ValueFractalNoiseParameters
    | WorleyNoiseParameters
    | ThresholdedGradientNoiseParameters
    | DomainWarpedNoiseParameters,
>(
  rng: () => number,
  options: Readonly<{
    algorithm: Algorithm;
    title: string;
    randomize: () => Params;
    buildBytes: (params: Params) => Uint8Array;
    buildSummary: (params: Params) => string;
    fallback: Params;
  }>,
): BaseGeneratedLayoutRecord<Algorithm, Params> {
  for (let attempt = 0; attempt < 24; attempt++) {
    const params = options.randomize();
    const bytes = options.buildBytes(params);
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: options.algorithm,
      title: options.title,
      summary: options.buildSummary(params),
      seedLabel: `Seed ${params.seed}`,
      params,
    };
  }

  return {
    wallKey: wallMaskKeyFromBytes(options.buildBytes(options.fallback)),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(options.fallback),
    seedLabel: `Seed ${options.fallback.seed}`,
    params: options.fallback,
  };
}

function buildPerlinNoiseRecord(
  rng: () => number,
  controls: PerlinNoiseControlState | null,
): PerlinNoiseGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultPerlinNoiseControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    threshold: 0.52,
    invert: false,
    scale: 3,
    octaves: 3,
  } satisfies PerlinNoiseParameters;

  return buildNoiseTerrainRecord(rng, {
    algorithm: "perlin-noise",
    title: PERLIN_NOISE_LABEL,
    randomize: () => randomizePerlinNoiseParameters(rng, defaults),
    buildBytes: buildPerlinNoiseMaskBytes,
    buildSummary: buildPerlinNoiseSummary,
    fallback,
  });
}

function buildValueFractalNoiseRecord(
  rng: () => number,
  controls: ValueFractalNoiseControlState | null,
): ValueFractalNoiseGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultValueFractalNoiseControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    threshold: 0.5,
    invert: false,
    scale: 3,
    octaves: 4,
    gain: 0.55,
  } satisfies ValueFractalNoiseParameters;

  return buildNoiseTerrainRecord(rng, {
    algorithm: "value-fractal-noise",
    title: VALUE_FRACTAL_NOISE_LABEL,
    randomize: () => randomizeValueFractalNoiseParameters(rng, defaults),
    buildBytes: buildValueFractalNoiseMaskBytes,
    buildSummary: buildValueFractalNoiseSummary,
    fallback,
  });
}

function buildWorleyNoiseRecord(
  rng: () => number,
  controls: WorleyNoiseControlState | null,
): WorleyNoiseGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultWorleyNoiseControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    threshold: 0.54,
    invert: false,
    cellCount: 5,
    jitter: 0.7,
  } satisfies WorleyNoiseParameters;

  return buildNoiseTerrainRecord(rng, {
    algorithm: "worley-noise",
    title: WORLEY_NOISE_LABEL,
    randomize: () => randomizeWorleyNoiseParameters(rng, defaults),
    buildBytes: buildWorleyNoiseMaskBytes,
    buildSummary: buildWorleyNoiseSummary,
    fallback,
  });
}

function buildThresholdedGradientNoiseRecord(
  rng: () => number,
  controls: ThresholdedGradientNoiseControlState | null,
): ThresholdedGradientNoiseGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultThresholdedGradientNoiseControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    threshold: 0.5,
    invert: false,
    scale: 3,
    angle: 45,
    roughness: 0.45,
  } satisfies ThresholdedGradientNoiseParameters;

  return buildNoiseTerrainRecord(rng, {
    algorithm: "thresholded-gradient-noise",
    title: THRESHOLDED_GRADIENT_NOISE_LABEL,
    randomize: () => randomizeThresholdedGradientNoiseParameters(rng, defaults),
    buildBytes: buildThresholdedGradientNoiseMaskBytes,
    buildSummary: buildThresholdedGradientNoiseSummary,
    fallback,
  });
}

function buildDomainWarpedNoiseRecord(
  rng: () => number,
  controls: DomainWarpedNoiseControlState | null,
): DomainWarpedNoiseGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultDomainWarpedNoiseControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    threshold: 0.5,
    invert: false,
    scale: 3,
    octaves: 3,
    warpScale: 1.5,
    warpStrength: 0.3,
  } satisfies DomainWarpedNoiseParameters;

  return buildNoiseTerrainRecord(rng, {
    algorithm: "domain-warped-noise",
    title: DOMAIN_WARPED_NOISE_LABEL,
    randomize: () => randomizeDomainWarpedNoiseParameters(rng, defaults),
    buildBytes: buildDomainWarpedNoiseMaskBytes,
    buildSummary: buildDomainWarpedNoiseSummary,
    fallback,
  });
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
    wallKey: wallMaskKeyFromBytes(
      buildMazeMaskBytes(params, "backtracking", createSeededRandom(params.seed)),
    ),
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
    wallKey: wallMaskKeyFromBytes(
      buildMazeMaskBytes(params, "prims", createSeededRandom(params.seed)),
    ),
    algorithm: "prims",
    title: PRIMS_LABEL,
    summary: buildPrimsSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildKruskalsRecord(
  rng: () => number,
  controls: KruskalsControlState | null,
): KruskalsGeneratedLayoutRecord {
  const params = randomizeMazeSeedBlockParameters(
    rng,
    controls ?? createDefaultKruskalsControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(buildKruskalsMaskBytes(params, createSeededRandom(params.seed))),
    algorithm: "kruskals",
    title: KRUSKALS_LABEL,
    summary: buildKruskalsSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildSidewinderRecord(
  rng: () => number,
  controls: SidewinderControlState | null,
): SidewinderGeneratedLayoutRecord {
  const params = randomizeSidewinderParameters(
    rng,
    controls ?? createDefaultSidewinderControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildSidewinderMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "sidewinder",
    title: SIDEWINDER_LABEL,
    summary: buildSidewinderSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildBinaryTreeRecord(
  rng: () => number,
  controls: BinaryTreeControlState | null,
): BinaryTreeGeneratedLayoutRecord {
  const params = randomizeBinaryTreeParameters(
    rng,
    controls ?? createDefaultBinaryTreeControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildBinaryTreeMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "binary-tree",
    title: BINARY_TREE_LABEL,
    summary: buildBinaryTreeSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildHuntAndKillRecord(
  rng: () => number,
  controls: HuntAndKillControlState | null,
): HuntAndKillGeneratedLayoutRecord {
  const params = randomizeHuntOrderParameters(
    rng,
    controls ?? createDefaultHuntAndKillControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildHuntAndKillMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "hunt-and-kill",
    title: HUNT_AND_KILL_LABEL,
    summary: buildHuntAndKillSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildWilsonsRecord(
  rng: () => number,
  controls: WilsonsControlState | null,
): WilsonsGeneratedLayoutRecord {
  const params = randomizeHuntOrderParameters(rng, controls ?? createDefaultWilsonsControlState());
  return {
    wallKey: wallMaskKeyFromBytes(buildWilsonsMaskBytes(params, createSeededRandom(params.seed))),
    algorithm: "wilsons",
    title: WILSONS_LABEL,
    summary: buildWilsonsSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildAldousBroderRecord(
  rng: () => number,
  controls: AldousBroderControlState | null,
): AldousBroderGeneratedLayoutRecord {
  const params = randomizeMazeSeedBlockParameters(
    rng,
    controls ?? createDefaultAldousBroderControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildAldousBroderMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "aldous-broder",
    title: ALDOUS_BRODER_LABEL,
    summary: buildAldousBroderSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildEllersRecord(
  rng: () => number,
  controls: EllersControlState | null,
): EllersGeneratedLayoutRecord {
  const params = randomizeEllersParameters(rng, controls ?? createDefaultEllersControlState());
  return {
    wallKey: wallMaskKeyFromBytes(buildEllersMaskBytes(params, createSeededRandom(params.seed))),
    algorithm: "ellers",
    title: ELLERS_LABEL,
    summary: buildEllersSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildCellularAutomatonRecord(
  rng: () => number,
  controls: CellularAutomatonControlState | null,
): CellularAutomatonGeneratedLayoutRecord {
  for (let attempt = 0; attempt < 24; attempt++) {
    const params = randomizeCellularAutomatonParameters(
      rng,
      controls ?? createDefaultCellularAutomatonControlState(),
    );
    const bytes = buildCellularAutomatonMaskBytes(params, createSeededRandom(params.seed));
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: "cellular-automaton",
      title: CELLULAR_AUTOMATON_LABEL,
      summary: buildCellularAutomatonSummary(params),
      seedLabel: `Seed ${params.seed}`,
      params,
    };
  }

  const fallback = {
    seed: 1,
    blockSize: "1x1",
    complexity: 0.75,
    density: 0.6,
  } satisfies CellularAutomatonParameters;

  return {
    wallKey: wallMaskKeyFromBytes(
      buildCellularAutomatonMaskBytes(fallback, createSeededRandom(fallback.seed)),
    ),
    algorithm: "cellular-automaton",
    title: CELLULAR_AUTOMATON_LABEL,
    summary: buildCellularAutomatonSummary(fallback),
    seedLabel: `Seed ${fallback.seed}`,
    params: fallback,
  };
}

function buildDungeonRoomsRecord(
  rng: () => number,
  controls: DungeonRoomsControlState | null,
): DungeonRoomsGeneratedLayoutRecord {
  const params = randomizeDungeonRoomsParameters(
    rng,
    controls ?? createDefaultDungeonRoomsControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildDungeonRoomsMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "dungeon-rooms",
    title: DUNGEON_ROOMS_LABEL,
    summary: buildDungeonRoomsSummary(params),
    seedLabel: `Seed ${params.seed}`,
    params,
  };
}

function buildTrivialMazeRecord(
  rng: () => number,
  controls: TrivialMazeControlState | null,
): TrivialMazeGeneratedLayoutRecord {
  const params = randomizeTrivialMazeParameters(
    rng,
    controls ?? createDefaultTrivialMazeControlState(),
  );
  return {
    wallKey: wallMaskKeyFromBytes(
      buildTrivialMazeMaskBytes(params, createSeededRandom(params.seed)),
    ),
    algorithm: "trivial-maze",
    title: TRIVIAL_MAZE_LABEL,
    summary: buildTrivialMazeSummary(params),
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
    wallKey: wallMaskKeyFromBytes(
      buildMazeMaskBytes(params, "growing-tree", createSeededRandom(params.seed)),
    ),
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
    wallKey: wallMaskKeyFromBytes(
      buildRecursiveDivisionMaskBytes(params, createSeededRandom(params.seed)),
    ),
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

function randomizeNoiseTerrainBaseParameters(
  rng: () => number,
  defaults: NoiseTerrainBaseControlState,
): NoiseTerrainBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: resolveRandomizableValue(
      defaults.blockSize,
      () => sampleOne(rng, [1, 1, 1, 2, 2, 2, 3, 4]),
      sampleClosestNoiseBlockSize,
    ),
    threshold: resolveRandomizableValue(
      defaults.threshold,
      () => sampleOne(rng, NOISE_TERRAIN_THRESHOLD_VALUES),
      sanitizeNoiseTerrainThreshold,
    ),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.18,
      (value) => !!value,
    ),
  };
}

function randomizePerlinNoiseParameters(
  rng: () => number,
  defaults: PerlinNoiseControlState,
): PerlinNoiseParameters {
  const base = randomizeNoiseTerrainBaseParameters(rng, defaults);
  return {
    ...base,
    scale: resolveRandomizableValue(
      defaults.scale,
      () => sampleOne(rng, NOISE_TERRAIN_SCALE_VALUES),
      sanitizeNoiseTerrainScale,
    ),
    octaves: resolveRandomizableValue(
      defaults.octaves,
      () => sampleOne(rng, NOISE_TERRAIN_OCTAVE_VALUES),
      sanitizeNoiseTerrainOctaves,
    ),
  };
}

function randomizeValueFractalNoiseParameters(
  rng: () => number,
  defaults: ValueFractalNoiseControlState,
): ValueFractalNoiseParameters {
  const base = randomizeNoiseTerrainBaseParameters(rng, defaults);
  return {
    ...base,
    scale: resolveRandomizableValue(
      defaults.scale,
      () => sampleOne(rng, NOISE_TERRAIN_SCALE_VALUES),
      sanitizeNoiseTerrainScale,
    ),
    octaves: resolveRandomizableValue(
      defaults.octaves,
      () => sampleOne(rng, NOISE_TERRAIN_OCTAVE_VALUES),
      sanitizeNoiseTerrainOctaves,
    ),
    gain: resolveRandomizableValue(
      defaults.gain,
      () => sampleOne(rng, VALUE_FRACTAL_GAIN_VALUES),
      sanitizeValueFractalGain,
    ),
  };
}

function randomizeWorleyNoiseParameters(
  rng: () => number,
  defaults: WorleyNoiseControlState,
): WorleyNoiseParameters {
  const base = randomizeNoiseTerrainBaseParameters(rng, defaults);
  return {
    ...base,
    cellCount: resolveRandomizableValue(
      defaults.cellCount,
      () => sampleOne(rng, WORLEY_CELL_COUNT_VALUES),
      sanitizeWorleyCellCount,
    ),
    jitter: resolveRandomizableValue(
      defaults.jitter,
      () => sampleOne(rng, WORLEY_JITTER_VALUES),
      sanitizeWorleyJitter,
    ),
  };
}

function randomizeThresholdedGradientNoiseParameters(
  rng: () => number,
  defaults: ThresholdedGradientNoiseControlState,
): ThresholdedGradientNoiseParameters {
  const base = randomizeNoiseTerrainBaseParameters(rng, defaults);
  return {
    ...base,
    scale: resolveRandomizableValue(
      defaults.scale,
      () => sampleOne(rng, NOISE_TERRAIN_SCALE_VALUES),
      sanitizeNoiseTerrainScale,
    ),
    angle: resolveRandomizableValue(
      defaults.angle,
      () => sampleOne(rng, THRESHOLDED_GRADIENT_ANGLE_VALUES),
      sanitizeThresholdedGradientAngle,
    ),
    roughness: resolveRandomizableValue(
      defaults.roughness,
      () => sampleOne(rng, THRESHOLDED_GRADIENT_ROUGHNESS_VALUES),
      sanitizeThresholdedGradientRoughness,
    ),
  };
}

function randomizeDomainWarpedNoiseParameters(
  rng: () => number,
  defaults: DomainWarpedNoiseControlState,
): DomainWarpedNoiseParameters {
  const base = randomizeNoiseTerrainBaseParameters(rng, defaults);
  return {
    ...base,
    scale: resolveRandomizableValue(
      defaults.scale,
      () => sampleOne(rng, NOISE_TERRAIN_SCALE_VALUES),
      sanitizeNoiseTerrainScale,
    ),
    octaves: resolveRandomizableValue(
      defaults.octaves,
      () => sampleOne(rng, NOISE_TERRAIN_OCTAVE_VALUES),
      sanitizeNoiseTerrainOctaves,
    ),
    warpScale: resolveRandomizableValue(
      defaults.warpScale,
      () => sampleOne(rng, DOMAIN_WARP_SCALE_VALUES),
      sanitizeDomainWarpScale,
    ),
    warpStrength: resolveRandomizableValue(
      defaults.warpStrength,
      () => sampleOne(rng, DOMAIN_WARP_STRENGTH_VALUES),
      sanitizeDomainWarpStrength,
    ),
  };
}

function randomizeMazeBaseParameters(
  rng: () => number,
  defaults: MazeBaseControlState,
): MazeAlgorithmParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  const dims = mazeGridDimensionsForBlockSize(base.blockSize);
  return {
    ...base,
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

function randomizeMazeSeedBlockParameters(
  rng: () => number,
  defaults: MazeSeedBlockControlState,
): Readonly<{ seed: number; blockSize: MazeBlockSize }> {
  const blockSize = resolveRandomizableValue(
    defaults.blockSize,
    () => sampleOne(rng, MAZE_RANDOM_BLOCK_SIZE_VALUES),
    sanitizeMazeBlockSize,
  );
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, MAZE_SEED_MIN, MAZE_SEED_MAX),
      (value) => clamp(Math.round(value), MAZE_SEED_MIN, MAZE_SEED_MAX),
    ),
    blockSize,
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

function randomizeSidewinderParameters(
  rng: () => number,
  defaults: SidewinderControlState,
): SidewinderParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    skew: resolveRandomizableValue(
      defaults.skew,
      () => sampleOne(rng, SIDEWINDER_SKEW_VALUES),
      (value) => clamp(value, SIDEWINDER_SKEW_MIN, SIDEWINDER_SKEW_MAX),
    ),
  };
}

function randomizeBinaryTreeParameters(
  rng: () => number,
  defaults: BinaryTreeControlState,
): BinaryTreeParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    skew: resolveRandomizableValue(
      defaults.skew,
      () => sampleOne(rng, BINARY_TREE_SKEW_OPTIONS),
      sanitizeBinaryTreeSkew,
    ),
  };
}

function randomizeHuntOrderParameters(
  rng: () => number,
  defaults: HuntAndKillControlState | WilsonsControlState,
): HuntAndKillParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    huntOrder: resolveRandomizableValue(
      defaults.huntOrder,
      () => sampleOne(rng, HUNT_ORDER_OPTIONS),
      sanitizeHuntOrder,
    ),
  };
}

function randomizeEllersParameters(
  rng: () => number,
  defaults: EllersControlState,
): EllersParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    xskew: resolveRandomizableValue(
      defaults.xskew,
      () => sampleOne(rng, ELLERS_SKEW_VALUES),
      (value) => clamp(value, SIDEWINDER_SKEW_MIN, SIDEWINDER_SKEW_MAX),
    ),
    yskew: resolveRandomizableValue(
      defaults.yskew,
      () => sampleOne(rng, ELLERS_SKEW_VALUES),
      (value) => clamp(value, SIDEWINDER_SKEW_MIN, SIDEWINDER_SKEW_MAX),
    ),
  };
}

function randomizeCellularAutomatonParameters(
  rng: () => number,
  defaults: CellularAutomatonControlState,
): CellularAutomatonParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    complexity: resolveRandomizableValue(
      defaults.complexity,
      () => sampleOne(rng, CELLULAR_AUTOMATON_COMPLEXITY_VALUES),
      (value) =>
        normalizeSteppedValue(
          value,
          CELLULAR_AUTOMATON_COMPLEXITY_STEP,
          CELLULAR_AUTOMATON_COMPLEXITY_MIN,
          CELLULAR_AUTOMATON_COMPLEXITY_MAX,
        ),
    ),
    density: resolveRandomizableValue(
      defaults.density,
      () => sampleOne(rng, CELLULAR_AUTOMATON_DENSITY_VALUES),
      (value) =>
        normalizeSteppedValue(
          value,
          CELLULAR_AUTOMATON_DENSITY_STEP,
          CELLULAR_AUTOMATON_DENSITY_MIN,
          CELLULAR_AUTOMATON_DENSITY_MAX,
        ),
    ),
  };
}

function randomizeDungeonRoomsParameters(
  rng: () => number,
  defaults: DungeonRoomsControlState,
): DungeonRoomsParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  const limits = dungeonRoomParameterLimits(base.blockSize);
  return {
    ...base,
    huntOrder: resolveRandomizableValue(
      defaults.huntOrder,
      () => sampleOne(rng, HUNT_ORDER_OPTIONS),
      sanitizeHuntOrder,
    ),
    roomCount: resolveRandomizableValue(
      defaults.roomCount,
      () =>
        sampleOne(
          rng,
          DUNGEON_ROOM_COUNT_VALUES.filter((value) => value <= limits.roomCountMax),
        ),
      (value) => clamp(Math.round(value), DUNGEON_ROOM_COUNT_MIN, limits.roomCountMax),
    ),
    roomSize: resolveRandomizableValue(
      defaults.roomSize,
      () =>
        sampleOne(
          rng,
          DUNGEON_ROOM_SIZE_VALUES.filter((value) => value <= limits.roomSizeMax),
        ),
      (value) => clamp(Math.round(value), DUNGEON_ROOM_SIZE_MIN, limits.roomSizeMax),
    ),
  };
}

function randomizeTrivialMazeParameters(
  rng: () => number,
  defaults: TrivialMazeControlState,
): TrivialMazeParameters {
  const base = randomizeMazeSeedBlockParameters(rng, defaults);
  return {
    ...base,
    mazeType: resolveRandomizableValue(
      defaults.mazeType,
      () => sampleOne(rng, TRIVIAL_MAZE_TYPE_OPTIONS),
      sanitizeTrivialMazeType,
    ),
  };
}

function randomizeRecursiveDivisionParameters(
  rng: () => number,
  defaults: RecursiveDivisionControlState,
): RecursiveDivisionParameters {
  return randomizeMazeSeedBlockParameters(rng, defaults);
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

function buildPerlinNoiseMaskBytes(params: PerlinNoiseParameters): Uint8Array {
  return buildNoiseTerrainMaskBytes(params, (sampleX, sampleY) =>
    fractalNoise(
      params.seed,
      sampleX * params.scale,
      sampleY * params.scale,
      params.octaves,
      0.5,
      gradientNoise2D,
    ),
  );
}

function buildValueFractalNoiseMaskBytes(params: ValueFractalNoiseParameters): Uint8Array {
  return buildNoiseTerrainMaskBytes(params, (sampleX, sampleY) =>
    fractalNoise(
      params.seed,
      sampleX * params.scale,
      sampleY * params.scale,
      params.octaves,
      params.gain,
      valueNoise2D,
    ),
  );
}

function buildWorleyNoiseMaskBytes(params: WorleyNoiseParameters): Uint8Array {
  return buildNoiseTerrainMaskBytes(params, (sampleX, sampleY) =>
    worleyNoise2D(params.seed, sampleX, sampleY, params.cellCount, params.jitter),
  );
}

function buildThresholdedGradientNoiseMaskBytes(
  params: ThresholdedGradientNoiseParameters,
): Uint8Array {
  return buildNoiseTerrainMaskBytes(params, (sampleX, sampleY) =>
    thresholdedGradientNoise(
      params.seed,
      sampleX,
      sampleY,
      params.scale,
      params.angle,
      params.roughness,
    ),
  );
}

function buildDomainWarpedNoiseMaskBytes(params: DomainWarpedNoiseParameters): Uint8Array {
  return buildNoiseTerrainMaskBytes(params, (sampleX, sampleY) =>
    domainWarpedNoise(
      params.seed,
      sampleX,
      sampleY,
      params.scale,
      params.octaves,
      params.warpScale,
      params.warpStrength,
    ),
  );
}

function buildNoiseTerrainMaskBytes(
  params: NoiseTerrainBaseParameters,
  sampleField: (sampleX: number, sampleY: number) => number,
): Uint8Array {
  const bytes = new Uint8Array(128);
  const sourceWidth = Math.ceil(GENERATED_LAYOUT_GRID_SIZE / params.blockSize);
  const sourceHeight = Math.ceil(GENERATED_LAYOUT_GRID_SIZE / params.blockSize);
  const cells = new Uint8Array(sourceWidth * sourceHeight);

  for (let sourceY = 0; sourceY < sourceHeight; sourceY++) {
    for (let sourceX = 0; sourceX < sourceWidth; sourceX++) {
      const sampleX = (sourceX + 0.5) / sourceWidth;
      const sampleY = (sourceY + 0.5) / sourceHeight;
      const value = clamp01(sampleField(sampleX, sampleY));
      const filled = params.invert ? value < params.threshold : value >= params.threshold;
      cells[sourceY * sourceWidth + sourceX] = filled ? 1 : 0;
    }
  }

  for (let y = 0; y < GENERATED_LAYOUT_GRID_SIZE; y++) {
    for (let x = 0; x < GENERATED_LAYOUT_GRID_SIZE; x++) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor(x / params.blockSize));
      const sourceY = Math.min(sourceHeight - 1, Math.floor(y / params.blockSize));
      if (cells[sourceY * sourceWidth + sourceX] !== 1) continue;
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
  const walls = createFilledMazeWalls();
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

  return wallsToMaskBytes(walls);
}

function buildKruskalsMaskBytes(params: KruskalsParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const cellCount = metrics.columns * metrics.rows;
  const parent = Array.from({ length: cellCount }, (_, index) => index);
  const rank = new Uint8Array(cellCount);
  const edges: Array<
    Readonly<{
      from: Readonly<{ x: number; y: number }>;
      to: Readonly<{ x: number; y: number }>;
    }>
  > = [];

  for (let y = 0; y < metrics.rows; y++) {
    for (let x = 0; x < metrics.columns; x++) {
      carveMazeCell(walls, metrics, x, y);
      if (x + 1 < metrics.columns) {
        edges.push({
          from: { x, y },
          to: { x: x + 1, y },
        });
      }
      if (y + 1 < metrics.rows) {
        edges.push({
          from: { x, y },
          to: { x, y: y + 1 },
        });
      }
    }
  }

  shuffleInPlace(edges, rng);

  for (const edge of edges) {
    const fromIndex = edge.from.y * metrics.columns + edge.from.x;
    const toIndex = edge.to.y * metrics.columns + edge.to.x;
    if (!unionDisjointSets(parent, rank, fromIndex, toIndex)) continue;
    carveMazePassage(walls, metrics, edge.from, edge.to);
  }

  return wallsToMaskBytes(walls);
}

function buildSidewinderMaskBytes(params: SidewinderParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const topRowY = 0;

  for (let x = 0; x < metrics.columns; x++) {
    carveMazeCell(walls, metrics, x, topRowY);
    if (x > 0) {
      carveMazePassage(walls, metrics, { x: x - 1, y: topRowY }, { x, y: topRowY });
    }
  }

  for (let y = 1; y < metrics.rows; y++) {
    const run: Array<Readonly<{ x: number; y: number }>> = [];

    for (let x = 0; x < metrics.columns; x++) {
      const current = { x, y };
      carveMazeCell(walls, metrics, current.x, current.y);
      run.push(current);

      const canCarveEast = x < metrics.columns - 1;
      const carveEast = canCarveEast && rng() > params.skew;

      if (carveEast) {
        carveMazePassage(walls, metrics, current, { x: x + 1, y });
        continue;
      }

      const north = sampleOne(rng, run);
      carveMazePassage(walls, metrics, north, { x: north.x, y: north.y - 1 });
      run.length = 0;
    }
  }

  return wallsToMaskBytes(walls);
}

function buildBinaryTreeMaskBytes(params: BinaryTreeParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const directionOffsets = resolveBinaryTreeDirectionOffsets(params.skew);

  for (let y = 0; y < metrics.rows; y++) {
    for (let x = 0; x < metrics.columns; x++) {
      const current = { x, y };
      const candidates = directionOffsets
        .map((offset) => ({ x: x + offset.x, y: y + offset.y }))
        .filter(
          (candidate) =>
            candidate.x >= 0 &&
            candidate.x < metrics.columns &&
            candidate.y >= 0 &&
            candidate.y < metrics.rows,
        );

      carveMazeCell(walls, metrics, x, y);
      if (candidates.length === 0) continue;
      carveMazePassage(walls, metrics, current, sampleOne(rng, candidates));
    }
  }

  return wallsToMaskBytes(walls);
}

function buildHuntAndKillMaskBytes(params: HuntAndKillParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const visited = new Uint8Array(metrics.columns * metrics.rows);
  let current: Readonly<{ x: number; y: number }> | null = {
    x: randomInt(rng, 0, metrics.columns - 1),
    y: randomInt(rng, 0, metrics.rows - 1),
  };

  markVisited(visited, metrics.columns, current.x, current.y);
  carveMazeCell(walls, metrics, current.x, current.y);

  while (current) {
    let neighbors = listMazeNeighbors(current.x, current.y, visited, metrics.columns, metrics.rows);
    while (neighbors.length > 0) {
      const next = sampleOne(rng, neighbors);
      carveMazePassage(walls, metrics, current, next);
      markVisited(visited, metrics.columns, next.x, next.y);
      current = next;
      neighbors = listMazeNeighbors(current.x, current.y, visited, metrics.columns, metrics.rows);
    }

    current = huntMazeCellWithUnvisitedNeighbors(
      params.huntOrder,
      visited,
      metrics.columns,
      metrics.rows,
      rng,
    );
  }

  return wallsToMaskBytes(walls);
}

function buildWilsonsMaskBytes(params: WilsonsParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const visited = new Uint8Array(metrics.columns * metrics.rows);
  const root = {
    x: randomInt(rng, 0, metrics.columns - 1),
    y: randomInt(rng, 0, metrics.rows - 1),
  };

  markVisited(visited, metrics.columns, root.x, root.y);
  carveMazeCell(walls, metrics, root.x, root.y);

  while (true) {
    const start = pickUnvisitedMazeCell(
      params.huntOrder,
      visited,
      metrics.columns,
      metrics.rows,
      rng,
    );
    if (!start) break;

    const walk = new Map<number, Readonly<{ x: number; y: number }>>();
    let current = start;

    while (!isMazeCellVisited(visited, metrics.columns, current.x, current.y)) {
      const next = sampleOne(
        rng,
        listMazeNeighborCells(current.x, current.y, metrics.columns, metrics.rows),
      );
      walk.set(mazeCellIndex(metrics.columns, current.x, current.y), next);
      current = next;
    }

    current = start;
    carveMazeCell(walls, metrics, current.x, current.y);

    while (!isMazeCellVisited(visited, metrics.columns, current.x, current.y)) {
      markVisited(visited, metrics.columns, current.x, current.y);
      const next = walk.get(mazeCellIndex(metrics.columns, current.x, current.y));
      if (!next) break;
      carveMazePassage(walls, metrics, current, next);
      current = next;
    }
  }

  return wallsToMaskBytes(walls);
}

function buildAldousBroderMaskBytes(params: AldousBroderParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  const visited = new Uint8Array(metrics.columns * metrics.rows);
  const totalCells = metrics.columns * metrics.rows;
  let current = {
    x: randomInt(rng, 0, metrics.columns - 1),
    y: randomInt(rng, 0, metrics.rows - 1),
  };
  let visitedCount = 1;

  markVisited(visited, metrics.columns, current.x, current.y);
  carveMazeCell(walls, metrics, current.x, current.y);

  while (visitedCount < totalCells) {
    const next = sampleOne(
      rng,
      listMazeNeighborCells(current.x, current.y, metrics.columns, metrics.rows),
    );
    if (!isMazeCellVisited(visited, metrics.columns, next.x, next.y)) {
      carveMazePassage(walls, metrics, current, next);
      markVisited(visited, metrics.columns, next.x, next.y);
      visitedCount += 1;
    }
    current = next;
  }

  return wallsToMaskBytes(walls);
}

function buildEllersMaskBytes(params: EllersParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const walls = createFilledMazeWalls();
  let nextSetId = 0;
  let rowSets = new Array<number | null>(metrics.columns).fill(null);

  for (let y = 0; y < metrics.rows; y++) {
    for (let x = 0; x < metrics.columns; x++) {
      carveMazeCell(walls, metrics, x, y);
      if (rowSets[x] !== null) continue;
      rowSets[x] = nextSetId;
      nextSetId += 1;
    }

    if (y === metrics.rows - 1) {
      for (let x = 0; x < metrics.columns - 1; x++) {
        const currentSet = rowSets[x] ?? null;
        const nextSet = rowSets[x + 1] ?? null;
        if (currentSet === nextSet) continue;
        carveMazePassage(walls, metrics, { x, y }, { x: x + 1, y });
        mergeEllersRowSets(rowSets, nextSet, currentSet);
      }
      continue;
    }

    for (let x = 0; x < metrics.columns - 1; x++) {
      const currentSet = rowSets[x] ?? null;
      const nextSet = rowSets[x + 1] ?? null;
      if (currentSet === nextSet) continue;
      if (rng() >= params.xskew) continue;
      carveMazePassage(walls, metrics, { x, y }, { x: x + 1, y });
      mergeEllersRowSets(rowSets, nextSet, currentSet);
    }

    const nextRowSets = new Array<number | null>(metrics.columns).fill(null);
    const columnsBySet = new Map<number, number[]>();

    for (let x = 0; x < metrics.columns; x++) {
      const setId = rowSets[x] ?? null;
      if (setId === null) continue;
      const columns = columnsBySet.get(setId) ?? [];
      columns.push(x);
      columnsBySet.set(setId, columns);
    }

    for (const [setId, columns] of columnsBySet) {
      const requiredColumn = sampleOne(rng, columns);
      nextRowSets[requiredColumn] = setId;
      carveMazePassage(walls, metrics, { x: requiredColumn, y }, { x: requiredColumn, y: y + 1 });

      for (const column of columns) {
        if (column === requiredColumn || nextRowSets[column] !== null) continue;
        if (rng() >= params.yskew) continue;
        nextRowSets[column] = setId;
        carveMazePassage(walls, metrics, { x: column, y }, { x: column, y: y + 1 });
      }
    }

    rowSets = nextRowSets;
  }

  return wallsToMaskBytes(walls);
}

function buildCellularAutomatonMaskBytes(
  params: CellularAutomatonParameters,
  rng: () => number,
): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const { grid, width, height } = createSourceMazeGrid(metrics, 0);
  const logicalDensity = Math.max(1, Math.round(params.density * (metrics.columns * metrics.rows)));
  const logicalComplexity = Math.max(
    1,
    Math.round(params.complexity * (metrics.columns + metrics.rows)),
  );

  for (let x = 0; x < width; x++) {
    setSourceGridValue(grid, width, x, 0, 1);
    setSourceGridValue(grid, width, x, height - 1, 1);
  }
  for (let y = 0; y < height; y++) {
    setSourceGridValue(grid, width, 0, y, 1);
    setSourceGridValue(grid, width, width - 1, y, 1);
  }

  for (let index = 0; index < logicalDensity * 2; index++) {
    let current =
      index < logicalDensity
        ? randomBoundarySourcePoint(width, height, rng)
        : randomEvenSourcePoint(width, height, rng);
    setSourceGridValue(grid, width, current.x, current.y, 1);

    for (let step = 0; step < logicalComplexity; step++) {
      const wallNeighbors = listSourceGridNeighbors(current.x, current.y, grid, width, height, 1);
      if (wallNeighbors.length === 0 || wallNeighbors.length >= 4) continue;

      const openNeighbors = listSourceGridNeighbors(current.x, current.y, grid, width, height, 0);
      if (openNeighbors.length === 0) continue;

      const next = sampleOne(rng, openNeighbors);
      if (sourceGridValue(grid, width, next.x, next.y) !== 0) continue;
      setSourceGridValue(grid, width, next.x, next.y, 1);
      setSourceGridValue(
        grid,
        width,
        current.x + Math.trunc((next.x - current.x) / 2),
        current.y + Math.trunc((next.y - current.y) / 2),
        1,
      );
      current = next;
    }
  }

  return sourceGridToMaskBytes(grid, metrics);
}

function buildDungeonRoomsMaskBytes(params: DungeonRoomsParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const { grid, width, height } = createSourceMazeGrid(metrics, 1);
  const rooms = placeDungeonRooms(metrics, params.roomCount, params.roomSize, rng);

  for (const room of rooms) {
    carveDungeonRoom(grid, width, height, room);
    carveDungeonDoor(grid, width, height, room, rng);
  }

  let current = chooseDungeonStartCell(grid, width, height, rng);
  if (current) {
    setSourceGridValue(grid, width, current.x, current.y, 0);
  } else {
    current = huntSourceOpenCellWithWalls(params.huntOrder, grid, width, height, rng);
  }

  while (current) {
    current = walkDungeonSourceGrid(current, grid, width, height, rng);
    current = huntSourceOpenCellWithWalls(params.huntOrder, grid, width, height, rng);
  }

  reconnectDungeonSourceGrid(grid, width, height, rng);
  return sourceGridToMaskBytes(grid, metrics);
}

function buildTrivialMazeMaskBytes(params: TrivialMazeParameters, rng: () => number): Uint8Array {
  const metrics = resolveMazeMetrics(params.blockSize);
  const { grid, width, height } = createSourceMazeGrid(metrics, 1);

  if (params.mazeType === "serpentine") {
    const verticalSkew = rng() < 0.5;
    if (verticalSkew) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x += 2) {
          setSourceGridValue(grid, width, x, y, 0);
        }
      }
      for (let x = 2; x < width - 1; x += 4) setSourceGridValue(grid, width, x, 1, 0);
      for (let x = 4; x < width - 1; x += 4) setSourceGridValue(grid, width, x, height - 2, 0);
    } else {
      for (let y = 1; y < height - 1; y += 2) {
        for (let x = 1; x < width - 1; x++) {
          setSourceGridValue(grid, width, x, y, 0);
        }
      }
      for (let y = 2; y < height - 1; y += 4) setSourceGridValue(grid, width, 1, y, 0);
      for (let y = 4; y < height - 1; y += 4) setSourceGridValue(grid, width, width - 2, y, 0);
    }
  } else {
    const clockwise = rng() < 0.5;
    const directions = clockwise
      ? [
          { x: 0, y: -2 },
          { x: 2, y: 0 },
          { x: 0, y: 2 },
          { x: -2, y: 0 },
        ]
      : [
          { x: -2, y: 0 },
          { x: 0, y: 2 },
          { x: 2, y: 0 },
          { x: 0, y: -2 },
        ];

    let current = { x: 1, y: 1 };
    let directionIndex = 0;
    setSourceGridValue(grid, width, current.x, current.y, 0);

    while (true) {
      const next = {
        x: current.x + directions[directionIndex]!.x,
        y: current.y + directions[directionIndex]!.y,
      };
      const wallNeighbors = listSourceGridNeighbors(current.x, current.y, grid, width, height, 1);
      if (wallNeighbors.some((candidate) => candidate.x === next.x && candidate.y === next.y)) {
        openSourcePassage(grid, width, current, next);
        current = next;
      } else if (wallNeighbors.length === 0) {
        break;
      } else {
        directionIndex = (directionIndex + 1) % directions.length;
      }
    }
  }

  if (rng() < 0.5) flipSourceGridHorizontally(grid, width, height);
  if (rng() < 0.5) flipSourceGridVertically(grid, width, height);
  openRandomSourceBoundary(grid, width, height, rng);

  return sourceGridToMaskBytes(grid, metrics);
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

  return wallsToMaskBytes(walls);
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

function buildPerlinNoiseSummary(params: PerlinNoiseParameters): string {
  return buildNoiseTerrainSummary(
    [`${formatNoiseScale(params.scale)} scale`, `${params.octaves} octaves`],
    params,
  );
}

function buildValueFractalNoiseSummary(params: ValueFractalNoiseParameters): string {
  return buildNoiseTerrainSummary(
    [
      `${formatNoiseScale(params.scale)} scale`,
      `${params.octaves} octaves`,
      `${Math.round(params.gain * 100)}% gain`,
    ],
    params,
  );
}

function buildWorleyNoiseSummary(params: WorleyNoiseParameters): string {
  return buildNoiseTerrainSummary(
    [`${params.cellCount} cells`, `${Math.round(params.jitter * 100)}% jitter`],
    params,
  );
}

function buildThresholdedGradientNoiseSummary(params: ThresholdedGradientNoiseParameters): string {
  return buildNoiseTerrainSummary(
    [
      `${formatNoiseScale(params.scale)} band scale`,
      `${params.angle}°`,
      `${Math.round(params.roughness * 100)}% roughness`,
    ],
    params,
  );
}

function buildDomainWarpedNoiseSummary(params: DomainWarpedNoiseParameters): string {
  return buildNoiseTerrainSummary(
    [
      `${formatNoiseScale(params.scale)} scale`,
      `${params.octaves} octaves`,
      `${formatNoiseScale(params.warpScale)} warp scale`,
      `${Math.round(params.warpStrength * 100)}% warp`,
    ],
    params,
  );
}

function buildNoiseTerrainSummary(parts: string[], params: NoiseTerrainBaseParameters): string {
  return [
    `${params.blockSize}x${params.blockSize} blocks`,
    ...parts,
    `${Math.round(params.threshold * 100)}% threshold`,
    params.invert ? "inverted" : null,
  ]
    .filter((value): value is string => value !== null)
    .join(" • ");
}

function buildBacktrackingSummary(params: BacktrackingParameters): string {
  return `${params.blockSize} blocks • start ${params.startColumn}, ${params.startRow}`;
}

function buildPrimsSummary(params: PrimsParameters): string {
  return `${params.blockSize} blocks • start ${params.startColumn}, ${params.startRow}`;
}

function buildKruskalsSummary(params: KruskalsParameters): string {
  return `${params.blockSize} blocks`;
}

function buildSidewinderSummary(params: SidewinderParameters): string {
  return `${params.blockSize} blocks • ${Math.round(params.skew * 100)}% north carve`;
}

function buildBinaryTreeSummary(params: BinaryTreeParameters): string {
  return `${params.blockSize} blocks • ${params.skew} bias`;
}

function buildHuntAndKillSummary(params: HuntAndKillParameters): string {
  return `${params.blockSize} blocks • ${params.huntOrder} hunt`;
}

function buildWilsonsSummary(params: WilsonsParameters): string {
  return `${params.blockSize} blocks • ${params.huntOrder} hunt`;
}

function buildAldousBroderSummary(params: AldousBroderParameters): string {
  return `${params.blockSize} blocks`;
}

function buildEllersSummary(params: EllersParameters): string {
  return [
    `${params.blockSize} blocks`,
    `${Math.round(params.xskew * 100)}% horizontal merge`,
    `${Math.round(params.yskew * 100)}% extra drops`,
  ].join(" • ");
}

function buildCellularAutomatonSummary(params: CellularAutomatonParameters): string {
  return [
    `${params.blockSize} blocks`,
    `${Math.round(params.complexity * 100)}% complexity`,
    `${Math.round(params.density * 100)}% density`,
  ].join(" • ");
}

function buildDungeonRoomsSummary(params: DungeonRoomsParameters): string {
  return [
    `${params.blockSize} blocks`,
    `${params.roomCount} rooms`,
    `up to ${params.roomSize}x${params.roomSize}`,
    `${params.huntOrder} hunt`,
  ].join(" • ");
}

function buildTrivialMazeSummary(params: TrivialMazeParameters): string {
  return `${params.blockSize} blocks • ${params.mazeType}`;
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
  const candidates = listMazeNeighborCells(x, y, columns, rows);

  for (const candidate of candidates) {
    const isVisited = isMazeCellVisited(visited, columns, candidate.x, candidate.y);
    if (mode === "unvisited" && isVisited) continue;
    if (mode === "visited" && !isVisited) continue;
    neighbors.push(candidate);
  }

  return neighbors;
}

function listMazeNeighborCells(
  x: number,
  y: number,
  columns: number,
  rows: number,
): Array<Readonly<{ x: number; y: number }>> {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ].filter(
    (candidate) =>
      candidate.x >= 0 && candidate.x < columns && candidate.y >= 0 && candidate.y < rows,
  );
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

function mazeCellIndex(columns: number, x: number, y: number): number {
  return y * columns + x;
}

function wallsToMaskBytes(walls: Uint8Array): Uint8Array {
  const bytes = new Uint8Array(128);
  for (let index = 0; index < walls.length; index++) {
    if (walls[index] !== 1) continue;
    setMaskBit(bytes, index);
  }
  return bytes;
}

function createFilledMazeWalls(): Uint8Array {
  const walls = new Uint8Array(GENERATED_LAYOUT_GRID_SIZE * GENERATED_LAYOUT_GRID_SIZE);
  walls.fill(1);
  return walls;
}

function markVisited(visited: Uint8Array, width: number, x: number, y: number): void {
  visited[mazeCellIndex(width, x, y)] = 1;
}

function isMazeCellVisited(visited: Uint8Array, width: number, x: number, y: number): boolean {
  return visited[mazeCellIndex(width, x, y)] === 1;
}

function sanitizeMazeBlockSize(value: MazeBlockSize): MazeBlockSize {
  return MAZE_BLOCK_SIZE_OPTIONS.some((option) => option.value === value) ? value : "1x1";
}

function sanitizeBinaryTreeSkew(value: BinaryTreeSkew): BinaryTreeSkew {
  return BINARY_TREE_SKEW_OPTIONS.includes(value) ? value : "NW";
}

function sanitizeHuntOrder(value: HuntOrder): HuntOrder {
  return HUNT_ORDER_OPTIONS.includes(value) ? value : "random";
}

function sanitizeTrivialMazeType(value: TrivialMazeType): TrivialMazeType {
  return TRIVIAL_MAZE_TYPE_OPTIONS.includes(value) ? value : "spiral";
}

export function dungeonRoomParameterLimits(
  blockSize: MazeBlockSize,
): Readonly<{ roomCountMax: number; roomSizeMax: number }> {
  const dims = mazeGridDimensionsForBlockSize(blockSize);
  return {
    roomCountMax: Math.max(
      DUNGEON_ROOM_COUNT_MIN,
      Math.min(DUNGEON_ROOM_COUNT_MAX, Math.max(1, Math.floor((dims.columns * dims.rows) / 16))),
    ),
    roomSizeMax: Math.max(
      DUNGEON_ROOM_SIZE_MIN,
      Math.min(DUNGEON_ROOM_SIZE_MAX, dims.columns, dims.rows),
    ),
  };
}

function resolveBinaryTreeDirectionOffsets(
  skew: BinaryTreeSkew,
): ReadonlyArray<Readonly<{ x: number; y: number }>> {
  switch (skew) {
    case "NW":
      return [
        { x: 0, y: -1 },
        { x: -1, y: 0 },
      ];
    case "NE":
      return [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
      ];
    case "SW":
      return [
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ];
    case "SE":
      return [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ];
  }
}

function pickUnvisitedMazeCell(
  huntOrder: HuntOrder,
  visited: Uint8Array,
  columns: number,
  rows: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> | null {
  if (huntOrder === "random") {
    const unvisited = listMazeCellsMatching(
      visited,
      columns,
      rows,
      (x, y) => !isMazeCellVisited(visited, columns, x, y),
    );
    return unvisited.length > 0 ? sampleOne(rng, unvisited) : null;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (!isMazeCellVisited(visited, columns, x, y)) return { x, y };
    }
  }

  return null;
}

function huntMazeCellWithUnvisitedNeighbors(
  huntOrder: HuntOrder,
  visited: Uint8Array,
  columns: number,
  rows: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> | null {
  const hasUnvisitedNeighbor = (x: number, y: number): boolean =>
    listMazeNeighbors(x, y, visited, columns, rows).length > 0;

  if (huntOrder === "random") {
    const candidates = listMazeCellsMatching(
      visited,
      columns,
      rows,
      (x, y) => isMazeCellVisited(visited, columns, x, y) && hasUnvisitedNeighbor(x, y),
    );
    return candidates.length > 0 ? sampleOne(rng, candidates) : null;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (isMazeCellVisited(visited, columns, x, y) && hasUnvisitedNeighbor(x, y)) {
        return { x, y };
      }
    }
  }

  return null;
}

function listMazeCellsMatching(
  visited: Uint8Array,
  columns: number,
  rows: number,
  predicate: (x: number, y: number) => boolean,
): Array<Readonly<{ x: number; y: number }>> {
  const cells: Array<Readonly<{ x: number; y: number }>> = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (!predicate(x, y)) continue;
      cells.push({ x, y });
    }
  }
  return cells;
}

function mergeEllersRowSets(
  rowSets: Array<number | null>,
  fromSet: number | null,
  toSet: number | null,
): void {
  if (fromSet === null || toSet === null || fromSet === toSet) return;
  for (let index = 0; index < rowSets.length; index++) {
    if (rowSets[index] === fromSet) rowSets[index] = toSet;
  }
}

function createSourceMazeGrid(
  metrics: Readonly<{ columns: number; rows: number }>,
  fillValue: 0 | 1,
): Readonly<{ grid: Uint8Array; width: number; height: number }> {
  const width = metrics.columns * 2 + 1;
  const height = metrics.rows * 2 + 1;
  const grid = new Uint8Array(width * height);
  if (fillValue === 1) grid.fill(1);
  return { grid, width, height };
}

function sourceGridIndex(width: number, x: number, y: number): number {
  return y * width + x;
}

function sourceGridValue(grid: Uint8Array, width: number, x: number, y: number): number {
  return grid[sourceGridIndex(width, x, y)] ?? 0;
}

function setSourceGridValue(
  grid: Uint8Array,
  width: number,
  x: number,
  y: number,
  value: 0 | 1,
): void {
  grid[sourceGridIndex(width, x, y)] = value;
}

function listSourceGridNeighbors(
  x: number,
  y: number,
  grid: Uint8Array,
  width: number,
  height: number,
  targetValue: 0 | 1,
): Array<Readonly<{ x: number; y: number }>> {
  return [
    { x: x + 2, y },
    { x: x - 2, y },
    { x, y: y + 2 },
    { x, y: y - 2 },
  ].filter(
    (candidate) =>
      candidate.x >= 0 &&
      candidate.x < width &&
      candidate.y >= 0 &&
      candidate.y < height &&
      sourceGridValue(grid, width, candidate.x, candidate.y) === targetValue,
  );
}

function openSourcePassage(
  grid: Uint8Array,
  width: number,
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
): void {
  setSourceGridValue(grid, width, from.x, from.y, 0);
  setSourceGridValue(grid, width, (from.x + to.x) / 2, (from.y + to.y) / 2, 0);
  setSourceGridValue(grid, width, to.x, to.y, 0);
}

function randomEvenSourcePoint(
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> {
  return {
    x: randomInt(rng, 0, Math.floor((width - 1) / 2)) * 2,
    y: randomInt(rng, 0, Math.floor((height - 1) / 2)) * 2,
  };
}

function randomBoundarySourcePoint(
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> {
  if (rng() < 0.5) {
    return {
      x: randomInt(rng, 0, Math.floor((width - 1) / 2)) * 2,
      y: rng() < 0.5 ? 0 : height - 1,
    };
  }

  return {
    x: rng() < 0.5 ? 0 : width - 1,
    y: randomInt(rng, 0, Math.floor((height - 1) / 2)) * 2,
  };
}

function sourceGridToMaskBytes(
  sourceGrid: Uint8Array,
  metrics: Readonly<{ blockWidth: number; blockHeight: number; columns: number; rows: number }>,
): Uint8Array {
  const walls = createFilledMazeWalls();
  const width = metrics.columns * 2 + 1;
  const height = metrics.rows * 2 + 1;

  for (let sourceY = 0; sourceY < height; sourceY++) {
    for (let sourceX = 0; sourceX < width; sourceX++) {
      if (sourceGridValue(sourceGrid, width, sourceX, sourceY) !== 0) continue;
      const rect = sourceGridRect(metrics, sourceX, sourceY);
      carveRect(walls, rect.x, rect.y, rect.width, rect.height);
    }
  }

  return wallsToMaskBytes(walls);
}

function sourceGridRect(
  metrics: Readonly<{ blockWidth: number; blockHeight: number }>,
  sourceX: number,
  sourceY: number,
): Readonly<{ x: number; y: number; width: number; height: number }> {
  return {
    x:
      sourceX % 2 === 0
        ? (sourceX / 2) * (metrics.blockWidth + 1)
        : Math.floor(sourceX / 2) * (metrics.blockWidth + 1) + 1,
    y:
      sourceY % 2 === 0
        ? (sourceY / 2) * (metrics.blockHeight + 1)
        : Math.floor(sourceY / 2) * (metrics.blockHeight + 1) + 1,
    width: sourceX % 2 === 0 ? 1 : metrics.blockWidth,
    height: sourceY % 2 === 0 ? 1 : metrics.blockHeight,
  };
}

type DungeonRoomPlacement = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

function placeDungeonRooms(
  metrics: Readonly<{ columns: number; rows: number }>,
  targetRoomCount: number,
  targetRoomSize: number,
  rng: () => number,
): DungeonRoomPlacement[] {
  const roomCountMax = Math.max(
    DUNGEON_ROOM_COUNT_MIN,
    Math.min(
      DUNGEON_ROOM_COUNT_MAX,
      Math.max(1, Math.floor((metrics.columns * metrics.rows) / 16)),
    ),
  );
  const roomSizeMax = Math.max(
    DUNGEON_ROOM_SIZE_MIN,
    Math.min(DUNGEON_ROOM_SIZE_MAX, metrics.columns, metrics.rows),
  );
  const roomCount = clamp(Math.round(targetRoomCount), DUNGEON_ROOM_COUNT_MIN, roomCountMax);
  const roomSize = clamp(Math.round(targetRoomSize), DUNGEON_ROOM_SIZE_MIN, roomSizeMax);
  const rooms: DungeonRoomPlacement[] = [];

  for (let attempt = 0; attempt < roomCount * 24 && rooms.length < roomCount; attempt++) {
    const width = randomInt(rng, 1, Math.min(roomSize, metrics.columns));
    const height = randomInt(rng, 1, Math.min(roomSize, metrics.rows));
    const x = randomInt(rng, 0, metrics.columns - width);
    const y = randomInt(rng, 0, metrics.rows - height);
    const room = { x, y, width, height } satisfies DungeonRoomPlacement;
    if (rooms.some((existing) => dungeonRoomsOverlap(existing, room))) continue;
    rooms.push(room);
  }

  return rooms;
}

function dungeonRoomsOverlap(a: DungeonRoomPlacement, b: DungeonRoomPlacement): boolean {
  return !(
    a.x + a.width + 1 <= b.x ||
    b.x + b.width + 1 <= a.x ||
    a.y + a.height + 1 <= b.y ||
    b.y + b.height + 1 <= a.y
  );
}

function carveDungeonRoom(
  grid: Uint8Array,
  width: number,
  height: number,
  room: DungeonRoomPlacement,
): void {
  const left = room.x * 2 + 1;
  const top = room.y * 2 + 1;
  const right = left + (room.width - 1) * 2;
  const bottom = top + (room.height - 1) * 2;

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      setSourceGridValue(grid, width, x, y, 0);
    }
  }
}

function carveDungeonDoor(
  grid: Uint8Array,
  width: number,
  height: number,
  room: DungeonRoomPlacement,
  rng: () => number,
): void {
  const left = room.x * 2 + 1;
  const top = room.y * 2 + 1;
  const right = left + (room.width - 1) * 2;
  const bottom = top + (room.height - 1) * 2;
  const possibleDoors: Array<Readonly<{ x: number; y: number }>> = [];

  if (top > 1) {
    for (let x = left; x <= right; x += 2) possibleDoors.push({ x, y: top - 1 });
  }
  if (left > 1) {
    for (let y = top; y <= bottom; y += 2) possibleDoors.push({ x: left - 1, y });
  }
  if (bottom < height - 2) {
    for (let x = left; x <= right; x += 2) possibleDoors.push({ x, y: bottom + 1 });
  }
  if (right < width - 2) {
    for (let y = top; y <= bottom; y += 2) possibleDoors.push({ x: right + 1, y });
  }

  if (possibleDoors.length === 0) return;
  const door = sampleOne(rng, possibleDoors);
  setSourceGridValue(grid, width, door.x, door.y, 0);
}

function chooseDungeonStartCell(
  grid: Uint8Array,
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> | null {
  const candidates = listSourceOddCellsMatching(grid, width, height, (x, y) => {
    return sourceGridValue(grid, width, x, y) === 1;
  });
  return candidates.length > 0 ? sampleOne(rng, candidates) : null;
}

function walkDungeonSourceGrid(
  start: Readonly<{ x: number; y: number }>,
  grid: Uint8Array,
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> {
  let current = start;
  while (true) {
    const wallNeighbors = listSourceGridNeighbors(current.x, current.y, grid, width, height, 1);
    if (wallNeighbors.length === 0) return current;
    const next = sampleOne(rng, wallNeighbors);
    openSourcePassage(grid, width, current, next);
    current = next;
  }
}

function huntSourceOpenCellWithWalls(
  huntOrder: HuntOrder,
  grid: Uint8Array,
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> | null {
  const predicate = (x: number, y: number): boolean =>
    sourceGridValue(grid, width, x, y) === 0 &&
    listSourceGridNeighbors(x, y, grid, width, height, 1).length > 0;

  if (huntOrder === "random") {
    const candidates = listSourceOddCellsMatching(grid, width, height, predicate);
    return candidates.length > 0 ? sampleOne(rng, candidates) : null;
  }

  for (let y = 1; y < height; y += 2) {
    for (let x = 1; x < width; x += 2) {
      if (predicate(x, y)) return { x, y };
    }
  }

  return null;
}

function listSourceOddCellsMatching(
  grid: Uint8Array,
  width: number,
  height: number,
  predicate: (x: number, y: number) => boolean,
): Array<Readonly<{ x: number; y: number }>> {
  const matches: Array<Readonly<{ x: number; y: number }>> = [];
  for (let y = 1; y < height; y += 2) {
    for (let x = 1; x < width; x += 2) {
      if (!predicate(x, y)) continue;
      matches.push({ x, y });
    }
  }
  return matches;
}

function reconnectDungeonSourceGrid(
  grid: Uint8Array,
  width: number,
  height: number,
  rng: () => number,
): void {
  while (true) {
    const componentIds = new Int32Array(width * height);
    componentIds.fill(-1);
    let componentCount = 0;

    for (let y = 1; y < height; y += 2) {
      for (let x = 1; x < width; x += 2) {
        if (sourceGridValue(grid, width, x, y) !== 0) continue;
        const startIndex = sourceGridIndex(width, x, y);
        if (componentIds[startIndex] !== -1) continue;

        const stack = [{ x, y }];
        componentIds[startIndex] = componentCount;

        while (stack.length > 0) {
          const current = stack.pop()!;
          const neighbors = listSourceGridNeighbors(
            current.x,
            current.y,
            grid,
            width,
            height,
            0,
          ).filter((neighbor) => {
            const midpointX = (current.x + neighbor.x) / 2;
            const midpointY = (current.y + neighbor.y) / 2;
            return sourceGridValue(grid, width, midpointX, midpointY) === 0;
          });

          for (const neighbor of neighbors) {
            const neighborIndex = sourceGridIndex(width, neighbor.x, neighbor.y);
            if (componentIds[neighborIndex] !== -1) continue;
            componentIds[neighborIndex] = componentCount;
            stack.push(neighbor);
          }
        }

        componentCount += 1;
      }
    }

    if (componentCount <= 1) return;

    const candidateDoors: Array<Readonly<{ x: number; y: number }>> = [];
    for (let y = 1; y < height; y += 2) {
      for (let x = 1; x < width; x += 2) {
        if (sourceGridValue(grid, width, x, y) !== 0) continue;
        const currentId = componentIds[sourceGridIndex(width, x, y)];
        for (const neighbor of listSourceGridNeighbors(x, y, grid, width, height, 0)) {
          const neighborId = componentIds[sourceGridIndex(width, neighbor.x, neighbor.y)];
          if (neighborId === currentId || neighborId === -1 || currentId === -1) continue;
          const midpoint = { x: (x + neighbor.x) / 2, y: (y + neighbor.y) / 2 };
          if (sourceGridValue(grid, width, midpoint.x, midpoint.y) !== 1) continue;
          candidateDoors.push(midpoint);
        }
      }
    }

    if (candidateDoors.length === 0) return;
    const door = sampleOne(rng, candidateDoors);
    setSourceGridValue(grid, width, door.x, door.y, 0);
  }
}

function flipSourceGridHorizontally(grid: Uint8Array, width: number, height: number): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < Math.floor(width / 2); x++) {
      const leftIndex = sourceGridIndex(width, x, y);
      const rightIndex = sourceGridIndex(width, width - 1 - x, y);
      const current = grid[leftIndex]!;
      grid[leftIndex] = grid[rightIndex]!;
      grid[rightIndex] = current;
    }
  }
}

function flipSourceGridVertically(grid: Uint8Array, width: number, height: number): void {
  for (let y = 0; y < Math.floor(height / 2); y++) {
    for (let x = 0; x < width; x++) {
      const topIndex = sourceGridIndex(width, x, y);
      const bottomIndex = sourceGridIndex(width, x, height - 1 - y);
      const current = grid[topIndex]!;
      grid[topIndex] = grid[bottomIndex]!;
      grid[bottomIndex] = current;
    }
  }
}

function openRandomSourceBoundary(
  grid: Uint8Array,
  width: number,
  height: number,
  rng: () => number,
): void {
  const candidates: Array<Readonly<{ x: number; y: number }>> = [];

  for (let x = 1; x < width - 1; x++) {
    if (sourceGridValue(grid, width, x, 1) === 0) candidates.push({ x, y: 0 });
    if (sourceGridValue(grid, width, x, height - 2) === 0) candidates.push({ x, y: height - 1 });
  }

  for (let y = 1; y < height - 1; y++) {
    if (sourceGridValue(grid, width, 1, y) === 0) candidates.push({ x: 0, y });
    if (sourceGridValue(grid, width, width - 2, y) === 0) candidates.push({ x: width - 1, y });
  }

  if (candidates.length === 0) return;
  const opening = sampleOne(rng, candidates);
  setSourceGridValue(grid, width, opening.x, opening.y, 0);
}

function shuffleInPlace<T>(items: T[], rng: () => number): void {
  for (let index = items.length - 1; index > 0; index--) {
    const swapIndex = randomInt(rng, 0, index);
    const current = items[index]!;
    items[index] = items[swapIndex]!;
    items[swapIndex] = current;
  }
}

function unionDisjointSets(parent: number[], rank: Uint8Array, a: number, b: number): boolean {
  const rootA = findDisjointSetRoot(parent, a);
  const rootB = findDisjointSetRoot(parent, b);

  if (rootA === rootB) return false;

  if (rank[rootA]! < rank[rootB]!) {
    parent[rootA] = rootB;
  } else if (rank[rootA]! > rank[rootB]!) {
    parent[rootB] = rootA;
  } else {
    parent[rootB] = rootA;
    rank[rootA] = (rank[rootA] ?? 0) + 1;
  }

  return true;
}

function findDisjointSetRoot(parent: number[], index: number): number {
  let current = index;
  while (parent[current] !== current) {
    parent[current] = parent[parent[current]!]!;
    current = parent[current]!;
  }
  return current;
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

function sanitizeSeed(value: number): number {
  return clamp(Math.round(value), RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX);
}

function sanitizeNoiseTerrainThreshold(value: number): number {
  return normalizeSteppedValue(
    value,
    NOISE_TERRAIN_THRESHOLD_STEP,
    NOISE_TERRAIN_THRESHOLD_MIN,
    NOISE_TERRAIN_THRESHOLD_MAX,
  );
}

function sanitizeNoiseTerrainScale(value: number): number {
  return normalizeSteppedValue(
    value,
    NOISE_TERRAIN_SCALE_STEP,
    NOISE_TERRAIN_SCALE_MIN,
    NOISE_TERRAIN_SCALE_MAX,
  );
}

function sanitizeNoiseTerrainOctaves(value: number): number {
  return clamp(Math.round(value), NOISE_TERRAIN_OCTAVES_MIN, NOISE_TERRAIN_OCTAVES_MAX);
}

function sanitizeValueFractalGain(value: number): number {
  return normalizeSteppedValue(
    value,
    VALUE_FRACTAL_GAIN_STEP,
    VALUE_FRACTAL_GAIN_MIN,
    VALUE_FRACTAL_GAIN_MAX,
  );
}

function sanitizeWorleyCellCount(value: number): number {
  return clamp(Math.round(value), WORLEY_CELL_COUNT_MIN, WORLEY_CELL_COUNT_MAX);
}

function sanitizeWorleyJitter(value: number): number {
  return normalizeSteppedValue(value, WORLEY_JITTER_STEP, WORLEY_JITTER_MIN, WORLEY_JITTER_MAX);
}

function sanitizeThresholdedGradientAngle(value: number): number {
  return clamp(
    Math.round(value / THRESHOLDED_GRADIENT_ANGLE_STEP) * THRESHOLDED_GRADIENT_ANGLE_STEP,
    THRESHOLDED_GRADIENT_ANGLE_MIN,
    THRESHOLDED_GRADIENT_ANGLE_MAX,
  );
}

function sanitizeThresholdedGradientRoughness(value: number): number {
  return normalizeSteppedValue(
    value,
    THRESHOLDED_GRADIENT_ROUGHNESS_STEP,
    THRESHOLDED_GRADIENT_ROUGHNESS_MIN,
    THRESHOLDED_GRADIENT_ROUGHNESS_MAX,
  );
}

function sanitizeDomainWarpScale(value: number): number {
  return normalizeSteppedValue(
    value,
    DOMAIN_WARP_SCALE_STEP,
    DOMAIN_WARP_SCALE_MIN,
    DOMAIN_WARP_SCALE_MAX,
  );
}

function sanitizeDomainWarpStrength(value: number): number {
  return normalizeSteppedValue(
    value,
    DOMAIN_WARP_STRENGTH_STEP,
    DOMAIN_WARP_STRENGTH_MIN,
    DOMAIN_WARP_STRENGTH_MAX,
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

function normalizeSteppedValue(value: number, step: number, min: number, max: number): number {
  return Number(clamp(Math.round(value / step) * step, min, max).toFixed(2));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function fade(value: number): number {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function fractalNoise(
  seed: number,
  x: number,
  y: number,
  octaves: number,
  gain: number,
  sampler: (seed: number, x: number, y: number) => number,
): number {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let amplitudeSum = 0;

  for (let octave = 0; octave < octaves; octave++) {
    total += sampler(seed + octave * 1013, x * frequency, y * frequency) * amplitude;
    amplitudeSum += amplitude;
    amplitude *= gain;
    frequency *= 2;
  }

  if (amplitudeSum === 0) return 0.5;
  return clamp01(total / amplitudeSum);
}

function valueNoise2D(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const tx = fade(x - x0);
  const ty = fade(y - y0);

  const v00 = hashFloat(seed, x0, y0);
  const v10 = hashFloat(seed, x1, y0);
  const v01 = hashFloat(seed, x0, y1);
  const v11 = hashFloat(seed, x1, y1);
  const top = lerp(v00, v10, tx);
  const bottom = lerp(v01, v11, tx);

  return lerp(top, bottom, ty);
}

function gradientNoise2D(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const tx = x - x0;
  const ty = y - y0;
  const fx = fade(tx);
  const fy = fade(ty);

  const g00 = gradientVector(seed, x0, y0);
  const g10 = gradientVector(seed, x1, y0);
  const g01 = gradientVector(seed, x0, y1);
  const g11 = gradientVector(seed, x1, y1);

  const d00 = g00.x * tx + g00.y * ty;
  const d10 = g10.x * (tx - 1) + g10.y * ty;
  const d01 = g01.x * tx + g01.y * (ty - 1);
  const d11 = g11.x * (tx - 1) + g11.y * (ty - 1);

  const top = lerp(d00, d10, fx);
  const bottom = lerp(d01, d11, fx);
  return clamp01((lerp(top, bottom, fy) + 1) / 2);
}

function thresholdedGradientNoise(
  seed: number,
  sampleX: number,
  sampleY: number,
  scale: number,
  angle: number,
  roughness: number,
): number {
  const radians = (angle * Math.PI) / 180;
  const projection = sampleX * Math.cos(radians) + sampleY * Math.sin(radians);
  const roughnessField = gradientNoise2D(seed + 271, sampleX * scale * 2, sampleY * scale * 2);
  const warpedPhase = projection * scale * Math.PI * 2 + (roughnessField - 0.5) * roughness * 4;
  return clamp01((Math.sin(warpedPhase) + 1) / 2);
}

function domainWarpedNoise(
  seed: number,
  sampleX: number,
  sampleY: number,
  scale: number,
  octaves: number,
  warpScale: number,
  warpStrength: number,
): number {
  const warpX = gradientNoise2D(seed + 911, sampleX * warpScale, sampleY * warpScale) * 2 - 1;
  const warpY = gradientNoise2D(seed + 1777, sampleX * warpScale, sampleY * warpScale) * 2 - 1;
  const warpedX = sampleX + warpX * warpStrength;
  const warpedY = sampleY + warpY * warpStrength;
  return fractalNoise(seed, warpedX * scale, warpedY * scale, octaves, 0.5, gradientNoise2D);
}

function worleyNoise2D(
  seed: number,
  sampleX: number,
  sampleY: number,
  cellCount: number,
  jitter: number,
): number {
  const scaledX = sampleX * cellCount;
  const scaledY = sampleY * cellCount;
  const cellX = Math.floor(scaledX);
  const cellY = Math.floor(scaledY);
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      const candidateCellX = cellX + offsetX;
      const candidateCellY = cellY + offsetY;
      const featureX =
        candidateCellX +
        0.5 +
        (hashFloat(seed + 37, candidateCellX, candidateCellY) - 0.5) * jitter;
      const featureY =
        candidateCellY +
        0.5 +
        (hashFloat(seed + 73, candidateCellX, candidateCellY) - 0.5) * jitter;
      const dx = featureX - scaledX;
      const dy = featureY - scaledY;
      nearestDistance = Math.min(nearestDistance, Math.hypot(dx, dy));
    }
  }

  const normalizedDistance = clamp01(nearestDistance / Math.SQRT2);
  return 1 - normalizedDistance;
}

function gradientVector(
  seed: number,
  gridX: number,
  gridY: number,
): Readonly<{ x: number; y: number }> {
  const angle = hashFloat(seed, gridX, gridY) * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function hashFloat(seed: number, x: number, y: number): number {
  let state = seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
  state = Math.imul(state ^ (state >>> 13), 1274126177);
  state ^= state >>> 16;
  return (state >>> 0) / 4294967295;
}

function formatNoiseScale(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
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
