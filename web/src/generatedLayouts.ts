import { wallMaskBytesFromKey, wallMaskKeyFromBytes } from "@/src/walls-core/mask32";
import { invertWallGrid, type WallGrid, wallGridFromMaskBytes } from "@/src/walls-core/grid";

export const GENERATED_LAYOUT_CARD_COUNT = 18;
export const GENERATED_LAYOUT_GRID_SIZE = 32;
export const GENERATED_LAYOUT_PREVIEW_SIZE = 128;
export const GENERATED_LAYOUT_MIN_SIZE = 10;
export const GENERATED_LAYOUT_MAX_SIZE = 32;

export const RANDOM_NOISE_SEED_MIN = 1;
export const RANDOM_NOISE_SEED_MAX = 0x7ffffffe;
export const RANDOM_NOISE_DENSITY_MIN = 0.12;
export const RANDOM_NOISE_DENSITY_MAX = 0.66;
export const RANDOM_NOISE_DENSITY_STEP = 0.02;
export const RANDOM_NOISE_BLOCK_SIZE_OPTIONS: ReadonlyArray<number> = [1, 2];
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
export const RADIAL_SYMMETRY_FOLDS_MIN = 3;
export const RADIAL_SYMMETRY_FOLDS_MAX = 12;
export const RADIAL_SYMMETRY_RINGS_MIN = 1;
export const RADIAL_SYMMETRY_RINGS_MAX = 7;
export const RADIAL_SYMMETRY_TWIST_MIN = 0;
export const RADIAL_SYMMETRY_TWIST_MAX = 1;
export const RADIAL_SYMMETRY_TWIST_STEP = 0.05;
export const RADIAL_SYMMETRY_THICKNESS_MIN = 0.06;
export const RADIAL_SYMMETRY_THICKNESS_MAX = 0.26;
export const RADIAL_SYMMETRY_THICKNESS_STEP = 0.02;
export const KALEIDOSCOPE_SEGMENTS_MIN = 3;
export const KALEIDOSCOPE_SEGMENTS_MAX = 12;
export const KALEIDOSCOPE_SCALE_MIN = 1;
export const KALEIDOSCOPE_SCALE_MAX = 8;
export const KALEIDOSCOPE_SCALE_STEP = 0.25;
export const LSYSTEM_ITERATIONS_MIN = 2;
export const LSYSTEM_ITERATIONS_MAX = 5;
export const LSYSTEM_TURN_ANGLE_MIN = 15;
export const LSYSTEM_TURN_ANGLE_MAX = 90;
export const LSYSTEM_TURN_ANGLE_STEP = 15;
export const LSYSTEM_STROKE_WIDTH_MIN = 1;
export const LSYSTEM_STROKE_WIDTH_MAX = 3;
export const ROSE_CURVE_PETALS_MIN = 2;
export const ROSE_CURVE_PETALS_MAX = 12;
export const ROSE_CURVE_HARMONIC_MIN = 1;
export const ROSE_CURVE_HARMONIC_MAX = 5;
export const ROSE_CURVE_ROTATION_MIN = 0;
export const ROSE_CURVE_ROTATION_MAX = 330;
export const ROSE_CURVE_ROTATION_STEP = 15;
export const ROSE_CURVE_STROKE_WIDTH_MIN = 1;
export const ROSE_CURVE_STROKE_WIDTH_MAX = 3;
export const TILEABLE_MOTIF_SPACING_MIN = 3;
export const TILEABLE_MOTIF_SPACING_MAX = 10;
export const TILEABLE_MOTIF_SIZE_MIN = 1;
export const TILEABLE_MOTIF_SIZE_MAX = 4;
export const TILEABLE_MOTIF_JITTER_MIN = 0;
export const TILEABLE_MOTIF_JITTER_MAX = 2;
export const BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MIN = 2;
export const BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MAX = 6;
export const BSP_ROOM_PARTITIONER_ROOM_PADDING_MIN = 0;
export const BSP_ROOM_PARTITIONER_ROOM_PADDING_MAX = 3;
export const BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MIN = 1;
export const BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MAX = 3;
export const CORRIDOR_GRID_COLUMN_SPACING_MIN = 4;
export const CORRIDOR_GRID_COLUMN_SPACING_MAX = 10;
export const CORRIDOR_GRID_ROW_SPACING_MIN = 4;
export const CORRIDOR_GRID_ROW_SPACING_MAX = 10;
export const CORRIDOR_GRID_WALL_THICKNESS_MIN = 1;
export const CORRIDOR_GRID_WALL_THICKNESS_MAX = 3;
export const CORRIDOR_GRID_GAP_CHANCE_MIN = 0;
export const CORRIDOR_GRID_GAP_CHANCE_MAX = 0.75;
export const CORRIDOR_GRID_GAP_CHANCE_STEP = 0.05;
export const ROOM_SCATTER_ROOM_COUNT_MIN = 3;
export const ROOM_SCATTER_ROOM_COUNT_MAX = 14;
export const ROOM_SCATTER_ROOM_SIZE_MIN = 4;
export const ROOM_SCATTER_ROOM_SIZE_MAX = 9;
export const ROOM_SCATTER_GAP_MIN = 0;
export const ROOM_SCATTER_GAP_MAX = 3;
export const ROOM_SCATTER_CONNECTOR_CHANCE_MIN = 0;
export const ROOM_SCATTER_CONNECTOR_CHANCE_MAX = 1;
export const ROOM_SCATTER_CONNECTOR_CHANCE_STEP = 0.05;
export const COURTYARD_RING_COUNT_MIN = 1;
export const COURTYARD_RING_COUNT_MAX = 6;
export const COURTYARD_RING_GAP_MIN = 1;
export const COURTYARD_RING_GAP_MAX = 4;
export const COURTYARD_GATE_WIDTH_MIN = 1;
export const COURTYARD_GATE_WIDTH_MAX = 3;
export const COURTYARD_OFFSET_MIN = 0;
export const COURTYARD_OFFSET_MAX = 4;
export const BLUEPRINT_WING_COUNT_MIN = 1;
export const BLUEPRINT_WING_COUNT_MAX = 4;
export const BLUEPRINT_HALL_WIDTH_MIN = 3;
export const BLUEPRINT_HALL_WIDTH_MAX = 8;
export const BLUEPRINT_PILLAR_SPACING_MIN = 0;
export const BLUEPRINT_PILLAR_SPACING_MAX = 6;
export const BLUEPRINT_CHAMBER_DEPTH_MIN = 4;
export const BLUEPRINT_CHAMBER_DEPTH_MAX = 10;
export const STRIPE_PLAID_SPACING_MIN = 3;
export const STRIPE_PLAID_SPACING_MAX = 10;
export const STRIPE_PLAID_BAND_WIDTH_MIN = 1;
export const STRIPE_PLAID_BAND_WIDTH_MAX = 4;
export const STRIPE_PLAID_OFFSET_MIN = 0;
export const STRIPE_PLAID_OFFSET_MAX = 6;
export const CHECKER_DIAMOND_CELL_SIZE_MIN = 2;
export const CHECKER_DIAMOND_CELL_SIZE_MAX = 8;
export const CHECKER_DIAMOND_LINE_WIDTH_MIN = 1;
export const CHECKER_DIAMOND_LINE_WIDTH_MAX = 3;
export const CHECKER_DIAMOND_PHASE_MIN = 0;
export const CHECKER_DIAMOND_PHASE_MAX = 6;
export const CONCENTRIC_BOX_RING_COUNT_MIN = 2;
export const CONCENTRIC_BOX_RING_COUNT_MAX = 9;
export const CONCENTRIC_BOX_SPACING_MIN = 1;
export const CONCENTRIC_BOX_SPACING_MAX = 4;
export const CONCENTRIC_BOX_LINE_WIDTH_MIN = 1;
export const CONCENTRIC_BOX_LINE_WIDTH_MAX = 3;
export const CONCENTRIC_BOX_DRIFT_MIN = 0;
export const CONCENTRIC_BOX_DRIFT_MAX = 4;
export const LINE_INTERFERENCE_SPACING_MIN = 3;
export const LINE_INTERFERENCE_SPACING_MAX = 9;
export const LINE_INTERFERENCE_STROKE_WIDTH_MIN = 1;
export const LINE_INTERFERENCE_STROKE_WIDTH_MAX = 3;
export const CIRCLE_PACKING_COUNT_MIN = 3;
export const CIRCLE_PACKING_COUNT_MAX = 14;
export const CIRCLE_PACKING_MIN_RADIUS_MIN = 1;
export const CIRCLE_PACKING_MIN_RADIUS_MAX = 4;
export const CIRCLE_PACKING_MAX_RADIUS_MIN = 2;
export const CIRCLE_PACKING_MAX_RADIUS_MAX = 8;
export const DRUNK_WALK_WALKER_COUNT_MIN = 1;
export const DRUNK_WALK_WALKER_COUNT_MAX = 6;
export const DRUNK_WALK_STEPS_MIN = 24;
export const DRUNK_WALK_STEPS_MAX = 160;
export const DRUNK_WALK_BRUSH_SIZE_MIN = 1;
export const DRUNK_WALK_BRUSH_SIZE_MAX = 4;
export const DRUNK_WALK_ROOM_CHANCE_MIN = 0;
export const DRUNK_WALK_ROOM_CHANCE_MAX = 0.35;
export const DRUNK_WALK_ROOM_CHANCE_STEP = 0.05;
export const PARTICLE_FLOW_AGENT_COUNT_MIN = 8;
export const PARTICLE_FLOW_AGENT_COUNT_MAX = 36;
export const PARTICLE_FLOW_STEPS_MIN = 12;
export const PARTICLE_FLOW_STEPS_MAX = 48;
export const PARTICLE_FLOW_FIELD_SCALE_MIN = 0.75;
export const PARTICLE_FLOW_FIELD_SCALE_MAX = 5;
export const PARTICLE_FLOW_FIELD_SCALE_STEP = 0.25;
export const PARTICLE_FLOW_STROKE_WIDTH_MIN = 1;
export const PARTICLE_FLOW_STROKE_WIDTH_MAX = 3;
export const STAMP_BRUSH_COUNT_MIN = 8;
export const STAMP_BRUSH_COUNT_MAX = 48;
export const STAMP_BRUSH_SIZE_MIN = 1;
export const STAMP_BRUSH_SIZE_MAX = 5;
export const STAMP_BRUSH_SCATTER_MIN = 0;
export const STAMP_BRUSH_SCATTER_MAX = 6;
export const CUTOUT_COLLAGE_SHAPE_COUNT_MIN = 4;
export const CUTOUT_COLLAGE_SHAPE_COUNT_MAX = 18;
export const CUTOUT_COLLAGE_MIN_SIZE_MIN = 1;
export const CUTOUT_COLLAGE_MIN_SIZE_MAX = 4;
export const CUTOUT_COLLAGE_MAX_SIZE_MIN = 3;
export const CUTOUT_COLLAGE_MAX_SIZE_MAX = 10;
export const CUTOUT_COLLAGE_SUBTRACT_CHANCE_MIN = 0.15;
export const CUTOUT_COLLAGE_SUBTRACT_CHANCE_MAX = 0.75;
export const CUTOUT_COLLAGE_SUBTRACT_CHANCE_STEP = 0.05;
export const GLITCH_BLOCK_BAND_COUNT_MIN = 4;
export const GLITCH_BLOCK_BAND_COUNT_MAX = 18;
export const GLITCH_BLOCK_OFFSET_RANGE_MIN = 0;
export const GLITCH_BLOCK_OFFSET_RANGE_MAX = 8;
export const GLITCH_BLOCK_STRIPE_CHANCE_MIN = 0.2;
export const GLITCH_BLOCK_STRIPE_CHANCE_MAX = 0.9;
export const GLITCH_BLOCK_STRIPE_CHANCE_STEP = 0.05;
export const GLITCH_BLOCK_CELL_SIZE_MIN = 1;
export const GLITCH_BLOCK_CELL_SIZE_MAX = 5;

export const MAZE_SEED_MIN = 1;
export const MAZE_SEED_MAX = 0x7ffffffe;
export const MAZE_START_MIN = 1;
export const MAZE_BLOCK_SIZE_OPTIONS = [
  { value: "1x1", label: "1x1", width: 1, height: 1 },
  { value: "2x2", label: "2x2", width: 2, height: 2 },
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
export const GAME_OF_LIFE_DENSITY_MIN = 0.12;
export const GAME_OF_LIFE_DENSITY_MAX = 0.68;
export const GAME_OF_LIFE_DENSITY_STEP = 0.02;
export const GAME_OF_LIFE_STEPS_MIN = 2;
export const GAME_OF_LIFE_STEPS_MAX = 8;
export const DLA_WALKERS_MIN = 120;
export const DLA_WALKERS_MAX = 960;
export const DLA_STICKINESS_MIN = 0.2;
export const DLA_STICKINESS_MAX = 1;
export const DLA_STICKINESS_STEP = 0.05;
export const REACTION_DIFFUSION_SPOT_COUNT_MIN = 2;
export const REACTION_DIFFUSION_SPOT_COUNT_MAX = 8;
export const REACTION_DIFFUSION_ITERATIONS_MIN = 6;
export const REACTION_DIFFUSION_ITERATIONS_MAX = 24;
export const REACTION_DIFFUSION_FEED_MIN = 0.018;
export const REACTION_DIFFUSION_FEED_MAX = 0.07;
export const REACTION_DIFFUSION_FEED_STEP = 0.002;
export const REACTION_DIFFUSION_KILL_MIN = 0.045;
export const REACTION_DIFFUSION_KILL_MAX = 0.075;
export const REACTION_DIFFUSION_KILL_STEP = 0.002;
export const VORONOI_SITE_COUNT_MIN = 4;
export const VORONOI_SITE_COUNT_MAX = 14;
export const VORONOI_RIDGE_WIDTH_MIN = 0.5;
export const VORONOI_RIDGE_WIDTH_MAX = 2.5;
export const VORONOI_RIDGE_WIDTH_STEP = 0.1;
export const VORONOI_JITTER_MIN = 0;
export const VORONOI_JITTER_MAX = 0.35;
export const VORONOI_JITTER_STEP = 0.05;
export const EROSION_DILATION_DENSITY_MIN = 0.12;
export const EROSION_DILATION_DENSITY_MAX = 0.68;
export const EROSION_DILATION_DENSITY_STEP = 0.02;
export const EROSION_DILATION_GROW_STEPS_MIN = 0;
export const EROSION_DILATION_GROW_STEPS_MAX = 4;
export const EROSION_DILATION_SHRINK_STEPS_MIN = 0;
export const EROSION_DILATION_SHRINK_STEPS_MAX = 4;
export const EROSION_DILATION_PUNCTURE_MIN = 0;
export const EROSION_DILATION_PUNCTURE_MAX = 0.5;
export const EROSION_DILATION_PUNCTURE_STEP = 0.05;

export type GenerateAlgorithmId =
  | "random-noise"
  | "perlin-noise"
  | "value-fractal-noise"
  | "worley-noise"
  | "thresholded-gradient-noise"
  | "domain-warped-noise"
  | "radial-symmetry"
  | "kaleidoscope"
  | "l-system-turtle"
  | "rose-curves"
  | "tileable-motif-repeater"
  | "bsp-room-partitioner"
  | "corridor-grid"
  | "room-scatter"
  | "courtyard-generator"
  | "blueprint-generator"
  | "stripe-plaid-generator"
  | "checker-diamond-lattice"
  | "concentric-boxes"
  | "line-interference"
  | "circle-packing"
  | "drunk-walk-painter"
  | "particle-flow-field"
  | "stamp-brush-generator"
  | "cutout-collage"
  | "glitch-blocks"
  | "game-of-life-variants"
  | "diffusion-limited-aggregation"
  | "reaction-diffusion-approximation"
  | "voronoi-region-carver"
  | "erosion-dilation-pipeline"
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
export type LSystemPreset = "plant" | "dragon" | "bush";
export type TileableMotifType = "cross" | "diamond" | "box" | "chevron" | "petal";
export type StripePlaidMode = "horizontal" | "vertical" | "plaid";
export type CheckerDiamondLatticeStyle = "checker" | "diamond" | "lattice";
export type GameOfLifeVariant = "life" | "highlife" | "maze";
export type DlaSeedMode = "point" | "line" | "cross";
export type StampBrushType = "mixed" | "square" | "circle" | "cross" | "bar";

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

type OrnamentBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  invert: boolean;
}>;

type ArchitectureBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  invert: boolean;
}>;

type PatternedGeometricBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  invert: boolean;
}>;

type ChaoticProceduralBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  invert: boolean;
}>;

type GrowthBaseParameters = Readonly<{
  seed: number;
  blockSize: number;
  invert: boolean;
}>;

export type RadialSymmetryParameters = OrnamentBaseParameters &
  Readonly<{
    folds: number;
    rings: number;
    twist: number;
    thickness: number;
  }>;

export type KaleidoscopeParameters = OrnamentBaseParameters &
  Readonly<{
    segments: number;
    scale: number;
    threshold: number;
  }>;

export type LSystemTurtleParameters = OrnamentBaseParameters &
  Readonly<{
    preset: LSystemPreset;
    iterations: number;
    turnAngle: number;
    strokeWidth: number;
  }>;

export type RoseCurvesParameters = OrnamentBaseParameters &
  Readonly<{
    petals: number;
    harmonic: number;
    rotation: number;
    strokeWidth: number;
  }>;

export type TileableMotifRepeaterParameters = OrnamentBaseParameters &
  Readonly<{
    motif: TileableMotifType;
    spacing: number;
    motifSize: number;
    jitter: number;
    rotation: number;
  }>;

export type BspRoomPartitionerParameters = ArchitectureBaseParameters &
  Readonly<{
    splitDepth: number;
    roomPadding: number;
    corridorWidth: number;
  }>;

export type CorridorGridParameters = ArchitectureBaseParameters &
  Readonly<{
    columnSpacing: number;
    rowSpacing: number;
    wallThickness: number;
    gapChance: number;
  }>;

export type RoomScatterParameters = ArchitectureBaseParameters &
  Readonly<{
    roomCount: number;
    roomSize: number;
    gap: number;
    connectorChance: number;
  }>;

export type CourtyardGeneratorParameters = ArchitectureBaseParameters &
  Readonly<{
    ringCount: number;
    ringGap: number;
    gateWidth: number;
    offset: number;
  }>;

export type BlueprintGeneratorParameters = ArchitectureBaseParameters &
  Readonly<{
    wingCount: number;
    hallWidth: number;
    pillarSpacing: number;
    chamberDepth: number;
  }>;

export type StripePlaidGeneratorParameters = PatternedGeometricBaseParameters &
  Readonly<{
    mode: StripePlaidMode;
    spacing: number;
    bandWidth: number;
    offset: number;
  }>;

export type CheckerDiamondLatticeParameters = PatternedGeometricBaseParameters &
  Readonly<{
    style: CheckerDiamondLatticeStyle;
    cellSize: number;
    lineWidth: number;
    phase: number;
  }>;

export type ConcentricBoxesParameters = PatternedGeometricBaseParameters &
  Readonly<{
    ringCount: number;
    spacing: number;
    lineWidth: number;
    drift: number;
  }>;

export type LineInterferenceParameters = PatternedGeometricBaseParameters &
  Readonly<{
    angleA: number;
    angleB: number;
    spacing: number;
    strokeWidth: number;
  }>;

export type CirclePackingParameters = PatternedGeometricBaseParameters &
  Readonly<{
    circleCount: number;
    minRadius: number;
    maxRadius: number;
    outline: boolean;
  }>;

export type DrunkWalkPainterParameters = ChaoticProceduralBaseParameters &
  Readonly<{
    walkerCount: number;
    steps: number;
    brushSize: number;
    roomChance: number;
  }>;

export type ParticleFlowFieldParameters = ChaoticProceduralBaseParameters &
  Readonly<{
    agentCount: number;
    steps: number;
    fieldScale: number;
    strokeWidth: number;
  }>;

export type StampBrushGeneratorParameters = ChaoticProceduralBaseParameters &
  Readonly<{
    stampCount: number;
    stampSize: number;
    stampType: StampBrushType;
    scatter: number;
  }>;

export type CutoutCollageParameters = ChaoticProceduralBaseParameters &
  Readonly<{
    shapeCount: number;
    minSize: number;
    maxSize: number;
    subtractChance: number;
  }>;

export type GlitchBlocksParameters = ChaoticProceduralBaseParameters &
  Readonly<{
    bandCount: number;
    offsetRange: number;
    stripeChance: number;
    cellSize: number;
  }>;

export type GameOfLifeVariantsParameters = GrowthBaseParameters &
  Readonly<{
    density: number;
    steps: number;
    variant: GameOfLifeVariant;
  }>;

export type DiffusionLimitedAggregationParameters = GrowthBaseParameters &
  Readonly<{
    walkers: number;
    stickiness: number;
    seedMode: DlaSeedMode;
  }>;

export type ReactionDiffusionApproximationParameters = GrowthBaseParameters &
  Readonly<{
    spotCount: number;
    iterations: number;
    feed: number;
    kill: number;
  }>;

export type VoronoiRegionCarverParameters = GrowthBaseParameters &
  Readonly<{
    siteCount: number;
    ridgeWidth: number;
    jitter: number;
  }>;

export type ErosionDilationPipelineParameters = GrowthBaseParameters &
  Readonly<{
    density: number;
    growSteps: number;
    shrinkSteps: number;
    punctureChance: number;
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

type OrnamentBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

type ArchitectureBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

type PatternedGeometricBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

type ChaoticProceduralBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

type GrowthBaseControlState = Readonly<{
  seed: RandomizableValue<number>;
  blockSize: RandomizableValue<number>;
  invert: RandomizableValue<boolean>;
}>;

export type RadialSymmetryControlState = OrnamentBaseControlState &
  Readonly<{
    folds: RandomizableValue<number>;
    rings: RandomizableValue<number>;
    twist: RandomizableValue<number>;
    thickness: RandomizableValue<number>;
  }>;

export type KaleidoscopeControlState = OrnamentBaseControlState &
  Readonly<{
    segments: RandomizableValue<number>;
    scale: RandomizableValue<number>;
    threshold: RandomizableValue<number>;
  }>;

export type LSystemTurtleControlState = OrnamentBaseControlState &
  Readonly<{
    preset: RandomizableValue<LSystemPreset>;
    iterations: RandomizableValue<number>;
    turnAngle: RandomizableValue<number>;
    strokeWidth: RandomizableValue<number>;
  }>;

export type RoseCurvesControlState = OrnamentBaseControlState &
  Readonly<{
    petals: RandomizableValue<number>;
    harmonic: RandomizableValue<number>;
    rotation: RandomizableValue<number>;
    strokeWidth: RandomizableValue<number>;
  }>;

export type TileableMotifRepeaterControlState = OrnamentBaseControlState &
  Readonly<{
    motif: RandomizableValue<TileableMotifType>;
    spacing: RandomizableValue<number>;
    motifSize: RandomizableValue<number>;
    jitter: RandomizableValue<number>;
    rotation: RandomizableValue<number>;
  }>;

export type BspRoomPartitionerControlState = ArchitectureBaseControlState &
  Readonly<{
    splitDepth: RandomizableValue<number>;
    roomPadding: RandomizableValue<number>;
    corridorWidth: RandomizableValue<number>;
  }>;

export type CorridorGridControlState = ArchitectureBaseControlState &
  Readonly<{
    columnSpacing: RandomizableValue<number>;
    rowSpacing: RandomizableValue<number>;
    wallThickness: RandomizableValue<number>;
    gapChance: RandomizableValue<number>;
  }>;

export type RoomScatterControlState = ArchitectureBaseControlState &
  Readonly<{
    roomCount: RandomizableValue<number>;
    roomSize: RandomizableValue<number>;
    gap: RandomizableValue<number>;
    connectorChance: RandomizableValue<number>;
  }>;

export type CourtyardGeneratorControlState = ArchitectureBaseControlState &
  Readonly<{
    ringCount: RandomizableValue<number>;
    ringGap: RandomizableValue<number>;
    gateWidth: RandomizableValue<number>;
    offset: RandomizableValue<number>;
  }>;

export type BlueprintGeneratorControlState = ArchitectureBaseControlState &
  Readonly<{
    wingCount: RandomizableValue<number>;
    hallWidth: RandomizableValue<number>;
    pillarSpacing: RandomizableValue<number>;
    chamberDepth: RandomizableValue<number>;
  }>;

export type StripePlaidGeneratorControlState = PatternedGeometricBaseControlState &
  Readonly<{
    mode: RandomizableValue<StripePlaidMode>;
    spacing: RandomizableValue<number>;
    bandWidth: RandomizableValue<number>;
    offset: RandomizableValue<number>;
  }>;

export type CheckerDiamondLatticeControlState = PatternedGeometricBaseControlState &
  Readonly<{
    style: RandomizableValue<CheckerDiamondLatticeStyle>;
    cellSize: RandomizableValue<number>;
    lineWidth: RandomizableValue<number>;
    phase: RandomizableValue<number>;
  }>;

export type ConcentricBoxesControlState = PatternedGeometricBaseControlState &
  Readonly<{
    ringCount: RandomizableValue<number>;
    spacing: RandomizableValue<number>;
    lineWidth: RandomizableValue<number>;
    drift: RandomizableValue<number>;
  }>;

export type LineInterferenceControlState = PatternedGeometricBaseControlState &
  Readonly<{
    angleA: RandomizableValue<number>;
    angleB: RandomizableValue<number>;
    spacing: RandomizableValue<number>;
    strokeWidth: RandomizableValue<number>;
  }>;

export type CirclePackingControlState = PatternedGeometricBaseControlState &
  Readonly<{
    circleCount: RandomizableValue<number>;
    minRadius: RandomizableValue<number>;
    maxRadius: RandomizableValue<number>;
    outline: RandomizableValue<boolean>;
  }>;

export type DrunkWalkPainterControlState = ChaoticProceduralBaseControlState &
  Readonly<{
    walkerCount: RandomizableValue<number>;
    steps: RandomizableValue<number>;
    brushSize: RandomizableValue<number>;
    roomChance: RandomizableValue<number>;
  }>;

export type ParticleFlowFieldControlState = ChaoticProceduralBaseControlState &
  Readonly<{
    agentCount: RandomizableValue<number>;
    steps: RandomizableValue<number>;
    fieldScale: RandomizableValue<number>;
    strokeWidth: RandomizableValue<number>;
  }>;

export type StampBrushGeneratorControlState = ChaoticProceduralBaseControlState &
  Readonly<{
    stampCount: RandomizableValue<number>;
    stampSize: RandomizableValue<number>;
    stampType: RandomizableValue<StampBrushType>;
    scatter: RandomizableValue<number>;
  }>;

export type CutoutCollageControlState = ChaoticProceduralBaseControlState &
  Readonly<{
    shapeCount: RandomizableValue<number>;
    minSize: RandomizableValue<number>;
    maxSize: RandomizableValue<number>;
    subtractChance: RandomizableValue<number>;
  }>;

export type GlitchBlocksControlState = ChaoticProceduralBaseControlState &
  Readonly<{
    bandCount: RandomizableValue<number>;
    offsetRange: RandomizableValue<number>;
    stripeChance: RandomizableValue<number>;
    cellSize: RandomizableValue<number>;
  }>;

export type GameOfLifeVariantsControlState = GrowthBaseControlState &
  Readonly<{
    density: RandomizableValue<number>;
    steps: RandomizableValue<number>;
    variant: RandomizableValue<GameOfLifeVariant>;
  }>;

export type DiffusionLimitedAggregationControlState = GrowthBaseControlState &
  Readonly<{
    walkers: RandomizableValue<number>;
    stickiness: RandomizableValue<number>;
    seedMode: RandomizableValue<DlaSeedMode>;
  }>;

export type ReactionDiffusionApproximationControlState = GrowthBaseControlState &
  Readonly<{
    spotCount: RandomizableValue<number>;
    iterations: RandomizableValue<number>;
    feed: RandomizableValue<number>;
    kill: RandomizableValue<number>;
  }>;

export type VoronoiRegionCarverControlState = GrowthBaseControlState &
  Readonly<{
    siteCount: RandomizableValue<number>;
    ridgeWidth: RandomizableValue<number>;
    jitter: RandomizableValue<number>;
  }>;

export type ErosionDilationPipelineControlState = GrowthBaseControlState &
  Readonly<{
    density: RandomizableValue<number>;
    growSteps: RandomizableValue<number>;
    shrinkSteps: RandomizableValue<number>;
    punctureChance: RandomizableValue<number>;
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
    | RadialSymmetryParameters
    | KaleidoscopeParameters
    | LSystemTurtleParameters
    | RoseCurvesParameters
    | TileableMotifRepeaterParameters
    | BspRoomPartitionerParameters
    | CorridorGridParameters
    | RoomScatterParameters
    | CourtyardGeneratorParameters
    | BlueprintGeneratorParameters
    | StripePlaidGeneratorParameters
    | CheckerDiamondLatticeParameters
    | ConcentricBoxesParameters
    | LineInterferenceParameters
    | CirclePackingParameters
    | DrunkWalkPainterParameters
    | ParticleFlowFieldParameters
    | StampBrushGeneratorParameters
    | CutoutCollageParameters
    | GlitchBlocksParameters
    | GameOfLifeVariantsParameters
    | DiffusionLimitedAggregationParameters
    | ReactionDiffusionApproximationParameters
    | VoronoiRegionCarverParameters
    | ErosionDilationPipelineParameters
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
  grid?: WallGrid;
  algorithm: Algorithm;
  title: string;
  summary: string;
  seedLabel: string;
  inverted: boolean;
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

export type RadialSymmetryGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "radial-symmetry",
  RadialSymmetryParameters
>;

export type KaleidoscopeGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "kaleidoscope",
  KaleidoscopeParameters
>;

export type LSystemTurtleGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "l-system-turtle",
  LSystemTurtleParameters
>;

export type RoseCurvesGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "rose-curves",
  RoseCurvesParameters
>;

export type TileableMotifRepeaterGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "tileable-motif-repeater",
  TileableMotifRepeaterParameters
>;

export type BspRoomPartitionerGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "bsp-room-partitioner",
  BspRoomPartitionerParameters
>;

export type CorridorGridGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "corridor-grid",
  CorridorGridParameters
>;

export type RoomScatterGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "room-scatter",
  RoomScatterParameters
>;

export type CourtyardGeneratorGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "courtyard-generator",
  CourtyardGeneratorParameters
>;

export type BlueprintGeneratorGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "blueprint-generator",
  BlueprintGeneratorParameters
>;

export type StripePlaidGeneratorGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "stripe-plaid-generator",
  StripePlaidGeneratorParameters
>;

export type CheckerDiamondLatticeGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "checker-diamond-lattice",
  CheckerDiamondLatticeParameters
>;

export type ConcentricBoxesGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "concentric-boxes",
  ConcentricBoxesParameters
>;

export type LineInterferenceGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "line-interference",
  LineInterferenceParameters
>;

export type CirclePackingGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "circle-packing",
  CirclePackingParameters
>;

export type DrunkWalkPainterGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "drunk-walk-painter",
  DrunkWalkPainterParameters
>;

export type ParticleFlowFieldGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "particle-flow-field",
  ParticleFlowFieldParameters
>;

export type StampBrushGeneratorGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "stamp-brush-generator",
  StampBrushGeneratorParameters
>;

export type CutoutCollageGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "cutout-collage",
  CutoutCollageParameters
>;

export type GlitchBlocksGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "glitch-blocks",
  GlitchBlocksParameters
>;

export type GameOfLifeVariantsGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "game-of-life-variants",
  GameOfLifeVariantsParameters
>;

export type DiffusionLimitedAggregationGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "diffusion-limited-aggregation",
  DiffusionLimitedAggregationParameters
>;

export type ReactionDiffusionApproximationGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "reaction-diffusion-approximation",
  ReactionDiffusionApproximationParameters
>;

export type VoronoiRegionCarverGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "voronoi-region-carver",
  VoronoiRegionCarverParameters
>;

export type ErosionDilationPipelineGeneratedLayoutRecord = BaseGeneratedLayoutRecord<
  "erosion-dilation-pipeline",
  ErosionDilationPipelineParameters
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
  | RadialSymmetryGeneratedLayoutRecord
  | KaleidoscopeGeneratedLayoutRecord
  | LSystemTurtleGeneratedLayoutRecord
  | RoseCurvesGeneratedLayoutRecord
  | TileableMotifRepeaterGeneratedLayoutRecord
  | BspRoomPartitionerGeneratedLayoutRecord
  | CorridorGridGeneratedLayoutRecord
  | RoomScatterGeneratedLayoutRecord
  | CourtyardGeneratorGeneratedLayoutRecord
  | BlueprintGeneratorGeneratedLayoutRecord
  | StripePlaidGeneratorGeneratedLayoutRecord
  | CheckerDiamondLatticeGeneratedLayoutRecord
  | ConcentricBoxesGeneratedLayoutRecord
  | LineInterferenceGeneratedLayoutRecord
  | CirclePackingGeneratedLayoutRecord
  | DrunkWalkPainterGeneratedLayoutRecord
  | ParticleFlowFieldGeneratedLayoutRecord
  | StampBrushGeneratorGeneratedLayoutRecord
  | CutoutCollageGeneratedLayoutRecord
  | GlitchBlocksGeneratedLayoutRecord
  | GameOfLifeVariantsGeneratedLayoutRecord
  | DiffusionLimitedAggregationGeneratedLayoutRecord
  | ReactionDiffusionApproximationGeneratedLayoutRecord
  | VoronoiRegionCarverGeneratedLayoutRecord
  | ErosionDilationPipelineGeneratedLayoutRecord
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
  { value: "radial-symmetry", label: "Radial Symmetry" },
  { value: "kaleidoscope", label: "Kaleidoscope" },
  { value: "l-system-turtle", label: "L-System / Turtle Patterns" },
  { value: "rose-curves", label: "Rose Curves / Polar Patterns" },
  { value: "tileable-motif-repeater", label: "Tileable Motif Repeater" },
  { value: "bsp-room-partitioner", label: "BSP Room Partitioner" },
  { value: "corridor-grid", label: "Corridor Grid" },
  { value: "room-scatter", label: "Room Scatter" },
  { value: "courtyard-generator", label: "Courtyard Generator" },
  { value: "blueprint-generator", label: "Blueprint Generator" },
  { value: "stripe-plaid-generator", label: "Stripe / Plaid Generator" },
  { value: "checker-diamond-lattice", label: "Checker / Diamond / Lattice" },
  { value: "concentric-boxes", label: "Concentric Boxes" },
  { value: "line-interference", label: "Line Interference" },
  { value: "circle-packing", label: "Circle Packing" },
  { value: "drunk-walk-painter", label: "Drunk Walk Painter" },
  { value: "particle-flow-field", label: "Particle Flow Field" },
  { value: "stamp-brush-generator", label: "Stamp Brush Generator" },
  { value: "cutout-collage", label: "Cutout Collage" },
  { value: "glitch-blocks", label: "Glitch Blocks" },
  { value: "game-of-life-variants", label: "Game of Life Variants" },
  { value: "diffusion-limited-aggregation", label: "Diffusion-Limited Aggregation" },
  {
    value: "reaction-diffusion-approximation",
    label: "Reaction-Diffusion Approximation",
  },
  { value: "voronoi-region-carver", label: "Voronoi Region Carver" },
  { value: "erosion-dilation-pipeline", label: "Erosion / Dilation Pipeline" },
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
const RADIAL_SYMMETRY_LABEL = "Radial Symmetry";
const KALEIDOSCOPE_LABEL = "Kaleidoscope";
const LSYSTEM_TURTLE_LABEL = "L-System / Turtle Patterns";
const ROSE_CURVES_LABEL = "Rose Curves / Polar Patterns";
const TILEABLE_MOTIF_REPEATER_LABEL = "Tileable Motif Repeater";
const BSP_ROOM_PARTITIONER_LABEL = "BSP Room Partitioner";
const CORRIDOR_GRID_LABEL = "Corridor Grid";
const ROOM_SCATTER_LABEL = "Room Scatter";
const COURTYARD_GENERATOR_LABEL = "Courtyard Generator";
const BLUEPRINT_GENERATOR_LABEL = "Blueprint Generator";
const STRIPE_PLAID_GENERATOR_LABEL = "Stripe / Plaid Generator";
const CHECKER_DIAMOND_LATTICE_LABEL = "Checker / Diamond / Lattice";
const CONCENTRIC_BOXES_LABEL = "Concentric Boxes";
const LINE_INTERFERENCE_LABEL = "Line Interference";
const CIRCLE_PACKING_LABEL = "Circle Packing";
const DRUNK_WALK_PAINTER_LABEL = "Drunk Walk Painter";
const PARTICLE_FLOW_FIELD_LABEL = "Particle Flow Field";
const STAMP_BRUSH_GENERATOR_LABEL = "Stamp Brush Generator";
const CUTOUT_COLLAGE_LABEL = "Cutout Collage";
const GLITCH_BLOCKS_LABEL = "Glitch Blocks";
const GAME_OF_LIFE_VARIANTS_LABEL = "Game of Life Variants";
const DIFFUSION_LIMITED_AGGREGATION_LABEL = "Diffusion-Limited Aggregation";
const REACTION_DIFFUSION_APPROXIMATION_LABEL = "Reaction-Diffusion Approximation";
const VORONOI_REGION_CARVER_LABEL = "Voronoi Region Carver";
const EROSION_DILATION_PIPELINE_LABEL = "Erosion / Dilation Pipeline";
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
  "radial-symmetry",
  "kaleidoscope",
  "l-system-turtle",
  "rose-curves",
  "tileable-motif-repeater",
  "bsp-room-partitioner",
  "corridor-grid",
  "room-scatter",
  "courtyard-generator",
  "blueprint-generator",
  "stripe-plaid-generator",
  "checker-diamond-lattice",
  "concentric-boxes",
  "line-interference",
  "circle-packing",
  "drunk-walk-painter",
  "particle-flow-field",
  "stamp-brush-generator",
  "cutout-collage",
  "glitch-blocks",
  "game-of-life-variants",
  "diffusion-limited-aggregation",
  "reaction-diffusion-approximation",
  "voronoi-region-carver",
  "erosion-dilation-pipeline",
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
const MAZE_RANDOM_BLOCK_SIZE_VALUES: ReadonlyArray<MazeBlockSize> = ["1x1", "2x2"];
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
const RADIAL_SYMMETRY_FOLDS_VALUES = [3, 4, 5, 6, 8, 10, 12];
const RADIAL_SYMMETRY_RINGS_VALUES = [1, 2, 3, 4, 5, 6, 7];
const RADIAL_SYMMETRY_TWIST_VALUES = [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1];
const RADIAL_SYMMETRY_THICKNESS_VALUES = [0.08, 0.1, 0.12, 0.16, 0.2, 0.24];
const KALEIDOSCOPE_SEGMENT_VALUES = [3, 4, 5, 6, 8, 10, 12];
const KALEIDOSCOPE_SCALE_VALUES = [1.25, 1.75, 2.5, 3.5, 5, 6.5, 8];
const LSYSTEM_ITERATION_VALUES = [2, 3, 4, 5];
const LSYSTEM_TURN_ANGLE_VALUES = [15, 30, 45, 60, 75, 90];
const LSYSTEM_STROKE_WIDTH_VALUES = [1, 2, 3];
const ROSE_CURVE_PETAL_VALUES = [2, 3, 4, 5, 6, 7, 8, 10, 12];
const ROSE_CURVE_HARMONIC_VALUES = [1, 2, 3, 4, 5];
const ROSE_CURVE_ROTATION_VALUES = [0, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300];
const TILEABLE_MOTIF_SPACING_VALUES = [3, 4, 5, 6, 7, 8, 9, 10];
const TILEABLE_MOTIF_SIZE_VALUES = [1, 2, 3, 4];
const TILEABLE_MOTIF_JITTER_VALUES = [0, 1, 2];
const BSP_ROOM_PARTITIONER_SPLIT_DEPTH_VALUES = [2, 3, 4, 5, 6];
const BSP_ROOM_PARTITIONER_ROOM_PADDING_VALUES = [0, 1, 2, 3];
const BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_VALUES = [1, 2, 3];
const CORRIDOR_GRID_SPACING_VALUES = [4, 5, 6, 7, 8, 9, 10];
const CORRIDOR_GRID_WALL_THICKNESS_VALUES = [1, 2, 3];
const CORRIDOR_GRID_GAP_CHANCE_VALUES = [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75];
const ROOM_SCATTER_ROOM_COUNT_VALUES = [3, 4, 5, 6, 8, 10, 12, 14];
const ROOM_SCATTER_ROOM_SIZE_VALUES = [4, 5, 6, 7, 8, 9];
const ROOM_SCATTER_GAP_VALUES = [0, 1, 2, 3];
const ROOM_SCATTER_CONNECTOR_CHANCE_VALUES = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
const COURTYARD_RING_COUNT_VALUES = [1, 2, 3, 4, 5, 6];
const COURTYARD_RING_GAP_VALUES = [1, 2, 3, 4];
const COURTYARD_GATE_WIDTH_VALUES = [1, 2, 3];
const COURTYARD_OFFSET_VALUES = [0, 1, 2, 3, 4];
const BLUEPRINT_WING_COUNT_VALUES = [1, 2, 3, 4];
const BLUEPRINT_HALL_WIDTH_VALUES = [3, 4, 5, 6, 7, 8];
const BLUEPRINT_PILLAR_SPACING_VALUES = [0, 3, 4, 5, 6];
const BLUEPRINT_CHAMBER_DEPTH_VALUES = [4, 5, 6, 7, 8, 9, 10];
const STRIPE_PLAID_SPACING_VALUES = [3, 4, 5, 6, 7, 8, 9, 10];
const STRIPE_PLAID_BAND_WIDTH_VALUES = [1, 2, 3, 4];
const STRIPE_PLAID_OFFSET_VALUES = [0, 1, 2, 3, 4, 5, 6];
const CHECKER_DIAMOND_CELL_SIZE_VALUES = [2, 3, 4, 5, 6, 7, 8];
const CHECKER_DIAMOND_LINE_WIDTH_VALUES = [1, 2, 3];
const CHECKER_DIAMOND_PHASE_VALUES = [0, 1, 2, 3, 4, 5, 6];
const CONCENTRIC_BOX_RING_COUNT_VALUES = [2, 3, 4, 5, 6, 7, 8, 9];
const CONCENTRIC_BOX_SPACING_VALUES = [1, 2, 3, 4];
const CONCENTRIC_BOX_LINE_WIDTH_VALUES = [1, 2, 3];
const CONCENTRIC_BOX_DRIFT_VALUES = [0, 1, 2, 3, 4];
const LINE_INTERFERENCE_SPACING_VALUES = [3, 4, 5, 6, 7, 8, 9];
const LINE_INTERFERENCE_STROKE_WIDTH_VALUES = [1, 2, 3];
const CIRCLE_PACKING_COUNT_VALUES = [3, 4, 5, 6, 7, 8, 10, 12, 14];
const CIRCLE_PACKING_MIN_RADIUS_VALUES = [1, 2, 3, 4];
const CIRCLE_PACKING_MAX_RADIUS_VALUES = [2, 3, 4, 5, 6, 7, 8];
const DRUNK_WALK_WALKER_COUNT_VALUES = [1, 2, 3, 4, 5, 6];
const DRUNK_WALK_STEPS_VALUES = [24, 36, 48, 64, 80, 96, 128, 160];
const DRUNK_WALK_BRUSH_SIZE_VALUES = [1, 2, 3, 4];
const DRUNK_WALK_ROOM_CHANCE_VALUES = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35];
const PARTICLE_FLOW_AGENT_COUNT_VALUES = [8, 12, 16, 20, 24, 30, 36];
const PARTICLE_FLOW_STEPS_VALUES = [12, 18, 24, 32, 40, 48];
const PARTICLE_FLOW_FIELD_SCALE_VALUES = [0.75, 1, 1.5, 2, 3, 4, 5];
const PARTICLE_FLOW_STROKE_WIDTH_VALUES = [1, 2, 3];
const STAMP_BRUSH_COUNT_VALUES = [8, 12, 16, 20, 28, 36, 48];
const STAMP_BRUSH_SIZE_VALUES = [1, 2, 3, 4, 5];
const STAMP_BRUSH_SCATTER_VALUES = [0, 1, 2, 3, 4, 5, 6];
const CUTOUT_COLLAGE_SHAPE_COUNT_VALUES = [4, 6, 8, 10, 12, 15, 18];
const CUTOUT_COLLAGE_MIN_SIZE_VALUES = [1, 2, 3, 4];
const CUTOUT_COLLAGE_MAX_SIZE_VALUES = [3, 4, 5, 6, 8, 10];
const CUTOUT_COLLAGE_SUBTRACT_CHANCE_VALUES = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75];
const GLITCH_BLOCK_BAND_COUNT_VALUES = [4, 6, 8, 10, 12, 15, 18];
const GLITCH_BLOCK_OFFSET_RANGE_VALUES = [0, 1, 2, 3, 4, 6, 8];
const GLITCH_BLOCK_STRIPE_CHANCE_VALUES = [0.2, 0.35, 0.5, 0.65, 0.8, 0.9];
const GLITCH_BLOCK_CELL_SIZE_VALUES = [1, 2, 3, 4, 5];
const GAME_OF_LIFE_DENSITY_VALUES = [0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6];
const GAME_OF_LIFE_STEPS_VALUES = [2, 3, 4, 5, 6, 7, 8];
const DLA_WALKER_VALUES = [120, 180, 240, 360, 480, 720, 960];
const DLA_STICKINESS_VALUES = [0.25, 0.4, 0.55, 0.7, 0.85, 1];
const REACTION_DIFFUSION_SPOT_COUNT_VALUES = [2, 3, 4, 5, 6, 7, 8];
const REACTION_DIFFUSION_ITERATION_VALUES = [6, 8, 10, 12, 15, 18, 24];
const REACTION_DIFFUSION_FEED_VALUES = [0.022, 0.028, 0.034, 0.042, 0.05, 0.058, 0.066];
const REACTION_DIFFUSION_KILL_VALUES = [0.048, 0.053, 0.058, 0.062, 0.067, 0.072];
const VORONOI_SITE_COUNT_VALUES = [4, 5, 6, 7, 8, 10, 12, 14];
const VORONOI_RIDGE_WIDTH_VALUES = [0.6, 0.8, 1, 1.2, 1.5, 1.8, 2.2];
const VORONOI_JITTER_VALUES = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
const EROSION_DILATION_DENSITY_VALUES = [0.18, 0.24, 0.3, 0.38, 0.46, 0.54, 0.62];
const EROSION_DILATION_STEP_VALUES = [0, 1, 2, 3, 4];
const EROSION_DILATION_PUNCTURE_VALUES = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
export const LSYSTEM_PRESET_OPTIONS: ReadonlyArray<LSystemPreset> = ["plant", "dragon", "bush"];
export const TILEABLE_MOTIF_TYPE_OPTIONS: ReadonlyArray<TileableMotifType> = [
  "cross",
  "diamond",
  "box",
  "chevron",
  "petal",
];
export const STRIPE_PLAID_MODE_OPTIONS: ReadonlyArray<StripePlaidMode> = [
  "horizontal",
  "vertical",
  "plaid",
];
export const CHECKER_DIAMOND_LATTICE_STYLE_OPTIONS: ReadonlyArray<CheckerDiamondLatticeStyle> = [
  "checker",
  "diamond",
  "lattice",
];
export const STAMP_BRUSH_TYPE_OPTIONS: ReadonlyArray<StampBrushType> = [
  "mixed",
  "square",
  "circle",
  "cross",
  "bar",
];
export const RIGHT_ANGLE_ROTATION_OPTIONS: ReadonlyArray<number> = [0, 90, 180, 270];
export const BINARY_TREE_SKEW_OPTIONS: ReadonlyArray<BinaryTreeSkew> = ["NW", "NE", "SW", "SE"];
export const HUNT_ORDER_OPTIONS: ReadonlyArray<HuntOrder> = ["random", "serpentine"];
export const TRIVIAL_MAZE_TYPE_OPTIONS: ReadonlyArray<TrivialMazeType> = ["spiral", "serpentine"];
export const GAME_OF_LIFE_VARIANT_OPTIONS: ReadonlyArray<GameOfLifeVariant> = [
  "life",
  "highlife",
  "maze",
];
export const DLA_SEED_MODE_OPTIONS: ReadonlyArray<DlaSeedMode> = ["point", "line", "cross"];

type GeneratedContentSize = Readonly<{
  width: number;
  height: number;
}>;

let activeGeneratedContentSize: GeneratedContentSize = {
  width: GENERATED_LAYOUT_GRID_SIZE,
  height: GENERATED_LAYOUT_GRID_SIZE,
};

export function randomSeedFromClock(): number {
  return Date.now() & 0x7fffffff;
}

export function nextRandomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

export function mazeGridDimensionsForBlockSize(
  blockSize: MazeBlockSize,
  contentWidth = activeGeneratedContentSize.width,
  contentHeight = activeGeneratedContentSize.height,
): Readonly<{ columns: number; rows: number }> {
  const dims = mazeBlockDimensions(blockSize);
  return {
    columns: Math.max(1, Math.floor((contentWidth - 1) / (dims.width + 1))),
    rows: Math.max(1, Math.floor((contentHeight - 1) / (dims.height + 1))),
  };
}

function generatedContentDimensionsForLayout(
  layoutWidth: number,
  layoutHeight: number,
): GeneratedContentSize {
  return {
    width: Math.max(1, sanitizeGeneratedLayoutSize(layoutWidth) - 2),
    height: Math.max(1, sanitizeGeneratedLayoutSize(layoutHeight) - 2),
  };
}

function withGeneratedContentSize<T>(width: number, height: number, callback: () => T): T {
  const previous = activeGeneratedContentSize;
  activeGeneratedContentSize = { width, height };
  try {
    return callback();
  } finally {
    activeGeneratedContentSize = previous;
  }
}

export function generateLayoutRecords(
  options: Readonly<{
    algorithm: GenerateAlgorithmChoice;
    count?: number;
    seed: number;
    layoutWidth?: number;
    layoutHeight?: number;
    invert?: boolean;
    randomNoiseControls?: RandomNoiseControlState | null;
    perlinNoiseControls?: PerlinNoiseControlState | null;
    valueFractalNoiseControls?: ValueFractalNoiseControlState | null;
    worleyNoiseControls?: WorleyNoiseControlState | null;
    thresholdedGradientNoiseControls?: ThresholdedGradientNoiseControlState | null;
    domainWarpedNoiseControls?: DomainWarpedNoiseControlState | null;
    radialSymmetryControls?: RadialSymmetryControlState | null;
    kaleidoscopeControls?: KaleidoscopeControlState | null;
    lSystemTurtleControls?: LSystemTurtleControlState | null;
    roseCurvesControls?: RoseCurvesControlState | null;
    tileableMotifRepeaterControls?: TileableMotifRepeaterControlState | null;
    bspRoomPartitionerControls?: BspRoomPartitionerControlState | null;
    corridorGridControls?: CorridorGridControlState | null;
    roomScatterControls?: RoomScatterControlState | null;
    courtyardGeneratorControls?: CourtyardGeneratorControlState | null;
    blueprintGeneratorControls?: BlueprintGeneratorControlState | null;
    stripePlaidGeneratorControls?: StripePlaidGeneratorControlState | null;
    checkerDiamondLatticeControls?: CheckerDiamondLatticeControlState | null;
    concentricBoxesControls?: ConcentricBoxesControlState | null;
    lineInterferenceControls?: LineInterferenceControlState | null;
    circlePackingControls?: CirclePackingControlState | null;
    drunkWalkPainterControls?: DrunkWalkPainterControlState | null;
    particleFlowFieldControls?: ParticleFlowFieldControlState | null;
    stampBrushGeneratorControls?: StampBrushGeneratorControlState | null;
    cutoutCollageControls?: CutoutCollageControlState | null;
    glitchBlocksControls?: GlitchBlocksControlState | null;
    gameOfLifeVariantsControls?: GameOfLifeVariantsControlState | null;
    diffusionLimitedAggregationControls?: DiffusionLimitedAggregationControlState | null;
    reactionDiffusionApproximationControls?: ReactionDiffusionApproximationControlState | null;
    voronoiRegionCarverControls?: VoronoiRegionCarverControlState | null;
    erosionDilationPipelineControls?: ErosionDilationPipelineControlState | null;
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
  const layoutWidth = sanitizeGeneratedLayoutSize(options.layoutWidth ?? GENERATED_LAYOUT_MAX_SIZE);
  const layoutHeight = sanitizeGeneratedLayoutSize(
    options.layoutHeight ?? GENERATED_LAYOUT_MAX_SIZE,
  );
  const contentSize = generatedContentDimensionsForLayout(layoutWidth, layoutHeight);
  const invert = !!options.invert;
  const records: GeneratedLayoutRecord[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 64;

  for (let attempt = 0; attempt < maxAttempts && records.length < count; attempt++) {
    const algorithm = pickAlgorithm(options.algorithm, rng);
    const rawRecord = withGeneratedContentSize(contentSize.width, contentSize.height, () =>
      generateRecordForAlgorithm(algorithm, rng, {
        randomNoiseControls: options.randomNoiseControls ?? null,
        perlinNoiseControls: options.perlinNoiseControls ?? null,
        valueFractalNoiseControls: options.valueFractalNoiseControls ?? null,
        worleyNoiseControls: options.worleyNoiseControls ?? null,
        thresholdedGradientNoiseControls: options.thresholdedGradientNoiseControls ?? null,
        domainWarpedNoiseControls: options.domainWarpedNoiseControls ?? null,
        radialSymmetryControls: options.radialSymmetryControls ?? null,
        kaleidoscopeControls: options.kaleidoscopeControls ?? null,
        lSystemTurtleControls: options.lSystemTurtleControls ?? null,
        roseCurvesControls: options.roseCurvesControls ?? null,
        tileableMotifRepeaterControls: options.tileableMotifRepeaterControls ?? null,
        bspRoomPartitionerControls: options.bspRoomPartitionerControls ?? null,
        corridorGridControls: options.corridorGridControls ?? null,
        roomScatterControls: options.roomScatterControls ?? null,
        courtyardGeneratorControls: options.courtyardGeneratorControls ?? null,
        blueprintGeneratorControls: options.blueprintGeneratorControls ?? null,
        stripePlaidGeneratorControls: options.stripePlaidGeneratorControls ?? null,
        checkerDiamondLatticeControls: options.checkerDiamondLatticeControls ?? null,
        concentricBoxesControls: options.concentricBoxesControls ?? null,
        lineInterferenceControls: options.lineInterferenceControls ?? null,
        circlePackingControls: options.circlePackingControls ?? null,
        drunkWalkPainterControls: options.drunkWalkPainterControls ?? null,
        particleFlowFieldControls: options.particleFlowFieldControls ?? null,
        stampBrushGeneratorControls: options.stampBrushGeneratorControls ?? null,
        cutoutCollageControls: options.cutoutCollageControls ?? null,
        glitchBlocksControls: options.glitchBlocksControls ?? null,
        gameOfLifeVariantsControls: options.gameOfLifeVariantsControls ?? null,
        diffusionLimitedAggregationControls: options.diffusionLimitedAggregationControls ?? null,
        reactionDiffusionApproximationControls:
          options.reactionDiffusionApproximationControls ?? null,
        voronoiRegionCarverControls: options.voronoiRegionCarverControls ?? null,
        erosionDilationPipelineControls: options.erosionDilationPipelineControls ?? null,
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
      }),
    );
    const record = frameGeneratedLayoutRecord(
      rawRecord,
      contentSize,
      layoutWidth,
      layoutHeight,
      invert,
    );
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
    blockSize: { randomize: false, value: 1 },
    mirror: { randomize: true, value: "none" },
    invert: { randomize: false, value: false },
  };
}

export function createDefaultPerlinNoiseControlState(): PerlinNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: false, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 3 },
  };
}

export function createDefaultValueFractalNoiseControlState(): ValueFractalNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: false, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 4 },
    gain: { randomize: true, value: 0.55 },
  };
}

export function createDefaultWorleyNoiseControlState(): WorleyNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: false, value: false },
    cellCount: { randomize: true, value: 5 },
    jitter: { randomize: true, value: 0.6 },
  };
}

export function createDefaultThresholdedGradientNoiseControlState(): ThresholdedGradientNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: false, value: false },
    scale: { randomize: true, value: 3 },
    angle: { randomize: true, value: 45 },
    roughness: { randomize: true, value: 0.45 },
  };
}

export function createDefaultDomainWarpedNoiseControlState(): DomainWarpedNoiseControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    threshold: { randomize: true, value: 0.5 },
    invert: { randomize: false, value: false },
    scale: { randomize: true, value: 3 },
    octaves: { randomize: true, value: 3 },
    warpScale: { randomize: true, value: 1.5 },
    warpStrength: { randomize: true, value: 0.3 },
  };
}

export function createDefaultRadialSymmetryControlState(): RadialSymmetryControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    folds: { randomize: true, value: 6 },
    rings: { randomize: true, value: 3 },
    twist: { randomize: true, value: 0.3 },
    thickness: { randomize: true, value: 0.14 },
  };
}

export function createDefaultKaleidoscopeControlState(): KaleidoscopeControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    segments: { randomize: true, value: 6 },
    scale: { randomize: true, value: 3.5 },
    threshold: { randomize: true, value: 0.5 },
  };
}

export function createDefaultLSystemTurtleControlState(): LSystemTurtleControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    preset: { randomize: true, value: "plant" },
    iterations: { randomize: true, value: 3 },
    turnAngle: { randomize: true, value: 45 },
    strokeWidth: { randomize: true, value: 1 },
  };
}

export function createDefaultRoseCurvesControlState(): RoseCurvesControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    petals: { randomize: true, value: 5 },
    harmonic: { randomize: true, value: 2 },
    rotation: { randomize: true, value: 0 },
    strokeWidth: { randomize: true, value: 1 },
  };
}

export function createDefaultTileableMotifRepeaterControlState(): TileableMotifRepeaterControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    motif: { randomize: true, value: "cross" },
    spacing: { randomize: true, value: 5 },
    motifSize: { randomize: true, value: 2 },
    jitter: { randomize: true, value: 1 },
    rotation: { randomize: true, value: 0 },
  };
}

export function createDefaultBspRoomPartitionerControlState(): BspRoomPartitionerControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    splitDepth: { randomize: true, value: 4 },
    roomPadding: { randomize: true, value: 1 },
    corridorWidth: { randomize: true, value: 1 },
  };
}

export function createDefaultCorridorGridControlState(): CorridorGridControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    columnSpacing: { randomize: true, value: 6 },
    rowSpacing: { randomize: true, value: 6 },
    wallThickness: { randomize: true, value: 1 },
    gapChance: { randomize: true, value: 0.3 },
  };
}

export function createDefaultRoomScatterControlState(): RoomScatterControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    roomCount: { randomize: true, value: 6 },
    roomSize: { randomize: true, value: 7 },
    gap: { randomize: true, value: 1 },
    connectorChance: { randomize: true, value: 0.45 },
  };
}

export function createDefaultCourtyardGeneratorControlState(): CourtyardGeneratorControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    ringCount: { randomize: true, value: 3 },
    ringGap: { randomize: true, value: 2 },
    gateWidth: { randomize: true, value: 2 },
    offset: { randomize: true, value: 1 },
  };
}

export function createDefaultBlueprintGeneratorControlState(): BlueprintGeneratorControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    wingCount: { randomize: true, value: 3 },
    hallWidth: { randomize: true, value: 5 },
    pillarSpacing: { randomize: true, value: 4 },
    chamberDepth: { randomize: true, value: 6 },
  };
}

export function createDefaultStripePlaidGeneratorControlState(): StripePlaidGeneratorControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    mode: { randomize: true, value: "plaid" },
    spacing: { randomize: true, value: 6 },
    bandWidth: { randomize: true, value: 2 },
    offset: { randomize: true, value: 1 },
  };
}

export function createDefaultCheckerDiamondLatticeControlState(): CheckerDiamondLatticeControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    style: { randomize: true, value: "checker" },
    cellSize: { randomize: true, value: 4 },
    lineWidth: { randomize: true, value: 1 },
    phase: { randomize: true, value: 0 },
  };
}

export function createDefaultConcentricBoxesControlState(): ConcentricBoxesControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    ringCount: { randomize: true, value: 5 },
    spacing: { randomize: true, value: 2 },
    lineWidth: { randomize: true, value: 1 },
    drift: { randomize: true, value: 1 },
  };
}

export function createDefaultLineInterferenceControlState(): LineInterferenceControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    angleA: { randomize: true, value: 45 },
    angleB: { randomize: true, value: 135 },
    spacing: { randomize: true, value: 5 },
    strokeWidth: { randomize: true, value: 1 },
  };
}

export function createDefaultCirclePackingControlState(): CirclePackingControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    circleCount: { randomize: true, value: 7 },
    minRadius: { randomize: true, value: 1 },
    maxRadius: { randomize: true, value: 4 },
    outline: { randomize: true, value: false },
  };
}

export function createDefaultDrunkWalkPainterControlState(): DrunkWalkPainterControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    walkerCount: { randomize: true, value: 3 },
    steps: { randomize: true, value: 64 },
    brushSize: { randomize: true, value: 2 },
    roomChance: { randomize: true, value: 0.15 },
  };
}

export function createDefaultParticleFlowFieldControlState(): ParticleFlowFieldControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    agentCount: { randomize: true, value: 16 },
    steps: { randomize: true, value: 24 },
    fieldScale: { randomize: true, value: 2 },
    strokeWidth: { randomize: true, value: 1 },
  };
}

export function createDefaultStampBrushGeneratorControlState(): StampBrushGeneratorControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    stampCount: { randomize: true, value: 20 },
    stampSize: { randomize: true, value: 2 },
    stampType: { randomize: true, value: "mixed" },
    scatter: { randomize: true, value: 2 },
  };
}

export function createDefaultCutoutCollageControlState(): CutoutCollageControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    shapeCount: { randomize: true, value: 8 },
    minSize: { randomize: true, value: 2 },
    maxSize: { randomize: true, value: 6 },
    subtractChance: { randomize: true, value: 0.45 },
  };
}

export function createDefaultGlitchBlocksControlState(): GlitchBlocksControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    bandCount: { randomize: true, value: 10 },
    offsetRange: { randomize: true, value: 3 },
    stripeChance: { randomize: true, value: 0.5 },
    cellSize: { randomize: true, value: 2 },
  };
}

export function createDefaultGameOfLifeVariantsControlState(): GameOfLifeVariantsControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    density: { randomize: true, value: 0.36 },
    steps: { randomize: true, value: 4 },
    variant: { randomize: true, value: "life" },
  };
}

export function createDefaultDiffusionLimitedAggregationControlState(): DiffusionLimitedAggregationControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    walkers: { randomize: true, value: 360 },
    stickiness: { randomize: true, value: 0.7 },
    seedMode: { randomize: true, value: "point" },
  };
}

export function createDefaultReactionDiffusionApproximationControlState(): ReactionDiffusionApproximationControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    spotCount: { randomize: true, value: 4 },
    iterations: { randomize: true, value: 12 },
    feed: { randomize: true, value: 0.042 },
    kill: { randomize: true, value: 0.062 },
  };
}

export function createDefaultVoronoiRegionCarverControlState(): VoronoiRegionCarverControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    siteCount: { randomize: true, value: 8 },
    ridgeWidth: { randomize: true, value: 1.2 },
    jitter: { randomize: true, value: 0.1 },
  };
}

export function createDefaultErosionDilationPipelineControlState(): ErosionDilationPipelineControlState {
  return {
    seed: { randomize: true, value: 1 },
    blockSize: { randomize: false, value: 1 },
    invert: { randomize: false, value: false },
    density: { randomize: true, value: 0.36 },
    growSteps: { randomize: true, value: 2 },
    shrinkSteps: { randomize: true, value: 1 },
    punctureChance: { randomize: true, value: 0.2 },
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
    radialSymmetryControls: RadialSymmetryControlState | null;
    kaleidoscopeControls: KaleidoscopeControlState | null;
    lSystemTurtleControls: LSystemTurtleControlState | null;
    roseCurvesControls: RoseCurvesControlState | null;
    tileableMotifRepeaterControls: TileableMotifRepeaterControlState | null;
    bspRoomPartitionerControls: BspRoomPartitionerControlState | null;
    corridorGridControls: CorridorGridControlState | null;
    roomScatterControls: RoomScatterControlState | null;
    courtyardGeneratorControls: CourtyardGeneratorControlState | null;
    blueprintGeneratorControls: BlueprintGeneratorControlState | null;
    stripePlaidGeneratorControls: StripePlaidGeneratorControlState | null;
    checkerDiamondLatticeControls: CheckerDiamondLatticeControlState | null;
    concentricBoxesControls: ConcentricBoxesControlState | null;
    lineInterferenceControls: LineInterferenceControlState | null;
    circlePackingControls: CirclePackingControlState | null;
    drunkWalkPainterControls: DrunkWalkPainterControlState | null;
    particleFlowFieldControls: ParticleFlowFieldControlState | null;
    stampBrushGeneratorControls: StampBrushGeneratorControlState | null;
    cutoutCollageControls: CutoutCollageControlState | null;
    glitchBlocksControls: GlitchBlocksControlState | null;
    gameOfLifeVariantsControls: GameOfLifeVariantsControlState | null;
    diffusionLimitedAggregationControls: DiffusionLimitedAggregationControlState | null;
    reactionDiffusionApproximationControls: ReactionDiffusionApproximationControlState | null;
    voronoiRegionCarverControls: VoronoiRegionCarverControlState | null;
    erosionDilationPipelineControls: ErosionDilationPipelineControlState | null;
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
    case "radial-symmetry":
      return buildRadialSymmetryRecord(rng, controls.radialSymmetryControls);
    case "kaleidoscope":
      return buildKaleidoscopeRecord(rng, controls.kaleidoscopeControls);
    case "l-system-turtle":
      return buildLSystemTurtleRecord(rng, controls.lSystemTurtleControls);
    case "rose-curves":
      return buildRoseCurvesRecord(rng, controls.roseCurvesControls);
    case "tileable-motif-repeater":
      return buildTileableMotifRepeaterRecord(rng, controls.tileableMotifRepeaterControls);
    case "bsp-room-partitioner":
      return buildBspRoomPartitionerRecord(rng, controls.bspRoomPartitionerControls);
    case "corridor-grid":
      return buildCorridorGridRecord(rng, controls.corridorGridControls);
    case "room-scatter":
      return buildRoomScatterRecord(rng, controls.roomScatterControls);
    case "courtyard-generator":
      return buildCourtyardGeneratorRecord(rng, controls.courtyardGeneratorControls);
    case "blueprint-generator":
      return buildBlueprintGeneratorRecord(rng, controls.blueprintGeneratorControls);
    case "stripe-plaid-generator":
      return buildStripePlaidGeneratorRecord(rng, controls.stripePlaidGeneratorControls);
    case "checker-diamond-lattice":
      return buildCheckerDiamondLatticeRecord(rng, controls.checkerDiamondLatticeControls);
    case "concentric-boxes":
      return buildConcentricBoxesRecord(rng, controls.concentricBoxesControls);
    case "line-interference":
      return buildLineInterferenceRecord(rng, controls.lineInterferenceControls);
    case "circle-packing":
      return buildCirclePackingRecord(rng, controls.circlePackingControls);
    case "drunk-walk-painter":
      return buildDrunkWalkPainterRecord(rng, controls.drunkWalkPainterControls);
    case "particle-flow-field":
      return buildParticleFlowFieldRecord(rng, controls.particleFlowFieldControls);
    case "stamp-brush-generator":
      return buildStampBrushGeneratorRecord(rng, controls.stampBrushGeneratorControls);
    case "cutout-collage":
      return buildCutoutCollageRecord(rng, controls.cutoutCollageControls);
    case "glitch-blocks":
      return buildGlitchBlocksRecord(rng, controls.glitchBlocksControls);
    case "game-of-life-variants":
      return buildGameOfLifeVariantsRecord(rng, controls.gameOfLifeVariantsControls);
    case "diffusion-limited-aggregation":
      return buildDiffusionLimitedAggregationRecord(
        rng,
        controls.diffusionLimitedAggregationControls,
      );
    case "reaction-diffusion-approximation":
      return buildReactionDiffusionApproximationRecord(
        rng,
        controls.reactionDiffusionApproximationControls,
      );
    case "voronoi-region-carver":
      return buildVoronoiRegionCarverRecord(rng, controls.voronoiRegionCarverControls);
    case "erosion-dilation-pipeline":
      return buildErosionDilationPipelineRecord(rng, controls.erosionDilationPipelineControls);
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
      inverted: false,
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
    inverted: false,
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
      inverted: false,
      params,
    };
  }

  return {
    wallKey: wallMaskKeyFromBytes(options.buildBytes(options.fallback)),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(options.fallback),
    seedLabel: `Seed ${options.fallback.seed}`,
    inverted: false,
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

function buildOrnamentRecord<
  Algorithm extends
    | "radial-symmetry"
    | "kaleidoscope"
    | "l-system-turtle"
    | "rose-curves"
    | "tileable-motif-repeater",
  Params extends
    | RadialSymmetryParameters
    | KaleidoscopeParameters
    | LSystemTurtleParameters
    | RoseCurvesParameters
    | TileableMotifRepeaterParameters,
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
      inverted: false,
      params,
    };
  }

  return {
    wallKey: wallMaskKeyFromBytes(options.buildBytes(options.fallback)),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(options.fallback),
    seedLabel: `Seed ${options.fallback.seed}`,
    inverted: false,
    params: options.fallback,
  };
}

function buildRadialSymmetryRecord(
  rng: () => number,
  controls: RadialSymmetryControlState | null,
): RadialSymmetryGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultRadialSymmetryControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    folds: 6,
    rings: 3,
    twist: 0.3,
    thickness: 0.14,
  } satisfies RadialSymmetryParameters;

  return buildOrnamentRecord(rng, {
    algorithm: "radial-symmetry",
    title: RADIAL_SYMMETRY_LABEL,
    randomize: () => randomizeRadialSymmetryParameters(rng, defaults),
    buildBytes: buildRadialSymmetryMaskBytes,
    buildSummary: buildRadialSymmetrySummary,
    fallback,
  });
}

function buildKaleidoscopeRecord(
  rng: () => number,
  controls: KaleidoscopeControlState | null,
): KaleidoscopeGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultKaleidoscopeControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    segments: 6,
    scale: 3.5,
    threshold: 0.5,
  } satisfies KaleidoscopeParameters;

  return buildOrnamentRecord(rng, {
    algorithm: "kaleidoscope",
    title: KALEIDOSCOPE_LABEL,
    randomize: () => randomizeKaleidoscopeParameters(rng, defaults),
    buildBytes: buildKaleidoscopeMaskBytes,
    buildSummary: buildKaleidoscopeSummary,
    fallback,
  });
}

function buildLSystemTurtleRecord(
  rng: () => number,
  controls: LSystemTurtleControlState | null,
): LSystemTurtleGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultLSystemTurtleControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    preset: "plant",
    iterations: 3,
    turnAngle: 45,
    strokeWidth: 1,
  } satisfies LSystemTurtleParameters;

  return buildOrnamentRecord(rng, {
    algorithm: "l-system-turtle",
    title: LSYSTEM_TURTLE_LABEL,
    randomize: () => randomizeLSystemTurtleParameters(rng, defaults),
    buildBytes: buildLSystemTurtleMaskBytes,
    buildSummary: buildLSystemTurtleSummary,
    fallback,
  });
}

function buildRoseCurvesRecord(
  rng: () => number,
  controls: RoseCurvesControlState | null,
): RoseCurvesGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultRoseCurvesControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    petals: 5,
    harmonic: 2,
    rotation: 0,
    strokeWidth: 1,
  } satisfies RoseCurvesParameters;

  return buildOrnamentRecord(rng, {
    algorithm: "rose-curves",
    title: ROSE_CURVES_LABEL,
    randomize: () => randomizeRoseCurvesParameters(rng, defaults),
    buildBytes: buildRoseCurvesMaskBytes,
    buildSummary: buildRoseCurvesSummary,
    fallback,
  });
}

function buildTileableMotifRepeaterRecord(
  rng: () => number,
  controls: TileableMotifRepeaterControlState | null,
): TileableMotifRepeaterGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultTileableMotifRepeaterControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    motif: "cross",
    spacing: 5,
    motifSize: 2,
    jitter: 1,
    rotation: 0,
  } satisfies TileableMotifRepeaterParameters;

  return buildOrnamentRecord(rng, {
    algorithm: "tileable-motif-repeater",
    title: TILEABLE_MOTIF_REPEATER_LABEL,
    randomize: () => randomizeTileableMotifRepeaterParameters(rng, defaults),
    buildBytes: buildTileableMotifRepeaterMaskBytes,
    buildSummary: buildTileableMotifRepeaterSummary,
    fallback,
  });
}

function buildArchitectureRecord<
  Algorithm extends
    | "bsp-room-partitioner"
    | "corridor-grid"
    | "room-scatter"
    | "courtyard-generator"
    | "blueprint-generator",
  Params extends
    | BspRoomPartitionerParameters
    | CorridorGridParameters
    | RoomScatterParameters
    | CourtyardGeneratorParameters
    | BlueprintGeneratorParameters,
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
      inverted: false,
      params,
    };
  }

  return {
    wallKey: wallMaskKeyFromBytes(options.buildBytes(options.fallback)),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(options.fallback),
    seedLabel: `Seed ${options.fallback.seed}`,
    inverted: false,
    params: options.fallback,
  };
}

function buildBspRoomPartitionerRecord(
  rng: () => number,
  controls: BspRoomPartitionerControlState | null,
): BspRoomPartitionerGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultBspRoomPartitionerControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    splitDepth: 4,
    roomPadding: 1,
    corridorWidth: 1,
  } satisfies BspRoomPartitionerParameters;

  return buildArchitectureRecord(rng, {
    algorithm: "bsp-room-partitioner",
    title: BSP_ROOM_PARTITIONER_LABEL,
    randomize: () => randomizeBspRoomPartitionerParameters(rng, defaults),
    buildBytes: buildBspRoomPartitionerMaskBytes,
    buildSummary: buildBspRoomPartitionerSummary,
    fallback,
  });
}

function buildCorridorGridRecord(
  rng: () => number,
  controls: CorridorGridControlState | null,
): CorridorGridGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultCorridorGridControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    columnSpacing: 6,
    rowSpacing: 6,
    wallThickness: 1,
    gapChance: 0.3,
  } satisfies CorridorGridParameters;

  return buildArchitectureRecord(rng, {
    algorithm: "corridor-grid",
    title: CORRIDOR_GRID_LABEL,
    randomize: () => randomizeCorridorGridParameters(rng, defaults),
    buildBytes: buildCorridorGridMaskBytes,
    buildSummary: buildCorridorGridSummary,
    fallback,
  });
}

function buildRoomScatterRecord(
  rng: () => number,
  controls: RoomScatterControlState | null,
): RoomScatterGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultRoomScatterControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    roomCount: 6,
    roomSize: 7,
    gap: 1,
    connectorChance: 0.45,
  } satisfies RoomScatterParameters;

  return buildArchitectureRecord(rng, {
    algorithm: "room-scatter",
    title: ROOM_SCATTER_LABEL,
    randomize: () => randomizeRoomScatterParameters(rng, defaults),
    buildBytes: buildRoomScatterMaskBytes,
    buildSummary: buildRoomScatterSummary,
    fallback,
  });
}

function buildCourtyardGeneratorRecord(
  rng: () => number,
  controls: CourtyardGeneratorControlState | null,
): CourtyardGeneratorGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultCourtyardGeneratorControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    ringCount: 3,
    ringGap: 2,
    gateWidth: 2,
    offset: 1,
  } satisfies CourtyardGeneratorParameters;

  return buildArchitectureRecord(rng, {
    algorithm: "courtyard-generator",
    title: COURTYARD_GENERATOR_LABEL,
    randomize: () => randomizeCourtyardGeneratorParameters(rng, defaults),
    buildBytes: buildCourtyardGeneratorMaskBytes,
    buildSummary: buildCourtyardGeneratorSummary,
    fallback,
  });
}

function buildBlueprintGeneratorRecord(
  rng: () => number,
  controls: BlueprintGeneratorControlState | null,
): BlueprintGeneratorGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultBlueprintGeneratorControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    wingCount: 3,
    hallWidth: 5,
    pillarSpacing: 4,
    chamberDepth: 6,
  } satisfies BlueprintGeneratorParameters;

  return buildArchitectureRecord(rng, {
    algorithm: "blueprint-generator",
    title: BLUEPRINT_GENERATOR_LABEL,
    randomize: () => randomizeBlueprintGeneratorParameters(rng, defaults),
    buildBytes: buildBlueprintGeneratorMaskBytes,
    buildSummary: buildBlueprintGeneratorSummary,
    fallback,
  });
}

function buildPatternedGeometricRecord<
  Algorithm extends
    | "stripe-plaid-generator"
    | "checker-diamond-lattice"
    | "concentric-boxes"
    | "line-interference"
    | "circle-packing",
  Params extends
    | StripePlaidGeneratorParameters
    | CheckerDiamondLatticeParameters
    | ConcentricBoxesParameters
    | LineInterferenceParameters
    | CirclePackingParameters,
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
  let lastAttempt: Readonly<{ params: Params; bytes: Uint8Array }> | null = null;

  for (let attempt = 0; attempt < 24; attempt++) {
    const params = options.randomize();
    const bytes = options.buildBytes(params);
    lastAttempt = { params, bytes };
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: options.algorithm,
      title: options.title,
      summary: options.buildSummary(params),
      seedLabel: `Seed ${params.seed}`,
      inverted: false,
      params,
    };
  }

  const fallbackParams = lastAttempt?.params ?? options.fallback;
  const fallbackBytes = lastAttempt?.bytes ?? options.buildBytes(options.fallback);

  return {
    wallKey: wallMaskKeyFromBytes(fallbackBytes),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(fallbackParams),
    seedLabel: `Seed ${fallbackParams.seed}`,
    inverted: false,
    params: fallbackParams,
  };
}

function buildStripePlaidGeneratorRecord(
  rng: () => number,
  controls: StripePlaidGeneratorControlState | null,
): StripePlaidGeneratorGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultStripePlaidGeneratorControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    mode: "plaid",
    spacing: 6,
    bandWidth: 2,
    offset: 1,
  } satisfies StripePlaidGeneratorParameters;

  return buildPatternedGeometricRecord(rng, {
    algorithm: "stripe-plaid-generator",
    title: STRIPE_PLAID_GENERATOR_LABEL,
    randomize: () => randomizeStripePlaidGeneratorParameters(rng, defaults),
    buildBytes: buildStripePlaidGeneratorMaskBytes,
    buildSummary: buildStripePlaidGeneratorSummary,
    fallback,
  });
}

function buildCheckerDiamondLatticeRecord(
  rng: () => number,
  controls: CheckerDiamondLatticeControlState | null,
): CheckerDiamondLatticeGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultCheckerDiamondLatticeControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    style: "checker",
    cellSize: 4,
    lineWidth: 1,
    phase: 0,
  } satisfies CheckerDiamondLatticeParameters;

  return buildPatternedGeometricRecord(rng, {
    algorithm: "checker-diamond-lattice",
    title: CHECKER_DIAMOND_LATTICE_LABEL,
    randomize: () => randomizeCheckerDiamondLatticeParameters(rng, defaults),
    buildBytes: buildCheckerDiamondLatticeMaskBytes,
    buildSummary: buildCheckerDiamondLatticeSummary,
    fallback,
  });
}

function buildConcentricBoxesRecord(
  rng: () => number,
  controls: ConcentricBoxesControlState | null,
): ConcentricBoxesGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultConcentricBoxesControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    ringCount: 5,
    spacing: 2,
    lineWidth: 1,
    drift: 1,
  } satisfies ConcentricBoxesParameters;

  return buildPatternedGeometricRecord(rng, {
    algorithm: "concentric-boxes",
    title: CONCENTRIC_BOXES_LABEL,
    randomize: () => randomizeConcentricBoxesParameters(rng, defaults),
    buildBytes: buildConcentricBoxesMaskBytes,
    buildSummary: buildConcentricBoxesSummary,
    fallback,
  });
}

function buildLineInterferenceRecord(
  rng: () => number,
  controls: LineInterferenceControlState | null,
): LineInterferenceGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultLineInterferenceControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    angleA: 45,
    angleB: 135,
    spacing: 5,
    strokeWidth: 1,
  } satisfies LineInterferenceParameters;

  return buildPatternedGeometricRecord(rng, {
    algorithm: "line-interference",
    title: LINE_INTERFERENCE_LABEL,
    randomize: () => randomizeLineInterferenceParameters(rng, defaults),
    buildBytes: buildLineInterferenceMaskBytes,
    buildSummary: buildLineInterferenceSummary,
    fallback,
  });
}

function buildCirclePackingRecord(
  rng: () => number,
  controls: CirclePackingControlState | null,
): CirclePackingGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultCirclePackingControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    circleCount: 7,
    minRadius: 1,
    maxRadius: 4,
    outline: false,
  } satisfies CirclePackingParameters;

  return buildPatternedGeometricRecord(rng, {
    algorithm: "circle-packing",
    title: CIRCLE_PACKING_LABEL,
    randomize: () => randomizeCirclePackingParameters(rng, defaults),
    buildBytes: buildCirclePackingMaskBytes,
    buildSummary: buildCirclePackingSummary,
    fallback,
  });
}

function buildChaoticProceduralRecord<
  Algorithm extends
    | "drunk-walk-painter"
    | "particle-flow-field"
    | "stamp-brush-generator"
    | "cutout-collage"
    | "glitch-blocks",
  Params extends
    | DrunkWalkPainterParameters
    | ParticleFlowFieldParameters
    | StampBrushGeneratorParameters
    | CutoutCollageParameters
    | GlitchBlocksParameters,
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
  let lastAttempt: Readonly<{ params: Params; bytes: Uint8Array }> | null = null;

  for (let attempt = 0; attempt < 24; attempt++) {
    const params = options.randomize();
    const bytes = options.buildBytes(params);
    lastAttempt = { params, bytes };
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: options.algorithm,
      title: options.title,
      summary: options.buildSummary(params),
      seedLabel: `Seed ${params.seed}`,
      inverted: false,
      params,
    };
  }

  const fallbackParams = lastAttempt?.params ?? options.fallback;
  const fallbackBytes = lastAttempt?.bytes ?? options.buildBytes(options.fallback);

  return {
    wallKey: wallMaskKeyFromBytes(fallbackBytes),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(fallbackParams),
    seedLabel: `Seed ${fallbackParams.seed}`,
    inverted: false,
    params: fallbackParams,
  };
}

function buildDrunkWalkPainterRecord(
  rng: () => number,
  controls: DrunkWalkPainterControlState | null,
): DrunkWalkPainterGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultDrunkWalkPainterControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    walkerCount: 3,
    steps: 64,
    brushSize: 2,
    roomChance: 0.15,
  } satisfies DrunkWalkPainterParameters;

  return buildChaoticProceduralRecord(rng, {
    algorithm: "drunk-walk-painter",
    title: DRUNK_WALK_PAINTER_LABEL,
    randomize: () => randomizeDrunkWalkPainterParameters(rng, defaults),
    buildBytes: buildDrunkWalkPainterMaskBytes,
    buildSummary: buildDrunkWalkPainterSummary,
    fallback,
  });
}

function buildParticleFlowFieldRecord(
  rng: () => number,
  controls: ParticleFlowFieldControlState | null,
): ParticleFlowFieldGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultParticleFlowFieldControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    agentCount: 16,
    steps: 24,
    fieldScale: 2,
    strokeWidth: 1,
  } satisfies ParticleFlowFieldParameters;

  return buildChaoticProceduralRecord(rng, {
    algorithm: "particle-flow-field",
    title: PARTICLE_FLOW_FIELD_LABEL,
    randomize: () => randomizeParticleFlowFieldParameters(rng, defaults),
    buildBytes: buildParticleFlowFieldMaskBytes,
    buildSummary: buildParticleFlowFieldSummary,
    fallback,
  });
}

function buildStampBrushGeneratorRecord(
  rng: () => number,
  controls: StampBrushGeneratorControlState | null,
): StampBrushGeneratorGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultStampBrushGeneratorControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    stampCount: 20,
    stampSize: 2,
    stampType: "mixed",
    scatter: 2,
  } satisfies StampBrushGeneratorParameters;

  return buildChaoticProceduralRecord(rng, {
    algorithm: "stamp-brush-generator",
    title: STAMP_BRUSH_GENERATOR_LABEL,
    randomize: () => randomizeStampBrushGeneratorParameters(rng, defaults),
    buildBytes: buildStampBrushGeneratorMaskBytes,
    buildSummary: buildStampBrushGeneratorSummary,
    fallback,
  });
}

function buildCutoutCollageRecord(
  rng: () => number,
  controls: CutoutCollageControlState | null,
): CutoutCollageGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultCutoutCollageControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    shapeCount: 8,
    minSize: 2,
    maxSize: 6,
    subtractChance: 0.45,
  } satisfies CutoutCollageParameters;

  return buildChaoticProceduralRecord(rng, {
    algorithm: "cutout-collage",
    title: CUTOUT_COLLAGE_LABEL,
    randomize: () => randomizeCutoutCollageParameters(rng, defaults),
    buildBytes: buildCutoutCollageMaskBytes,
    buildSummary: buildCutoutCollageSummary,
    fallback,
  });
}

function buildGlitchBlocksRecord(
  rng: () => number,
  controls: GlitchBlocksControlState | null,
): GlitchBlocksGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultGlitchBlocksControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    bandCount: 10,
    offsetRange: 3,
    stripeChance: 0.5,
    cellSize: 2,
  } satisfies GlitchBlocksParameters;

  return buildChaoticProceduralRecord(rng, {
    algorithm: "glitch-blocks",
    title: GLITCH_BLOCKS_LABEL,
    randomize: () => randomizeGlitchBlocksParameters(rng, defaults),
    buildBytes: buildGlitchBlocksMaskBytes,
    buildSummary: buildGlitchBlocksSummary,
    fallback,
  });
}

function buildGrowthSystemRecord<
  Algorithm extends
    | "game-of-life-variants"
    | "diffusion-limited-aggregation"
    | "reaction-diffusion-approximation"
    | "voronoi-region-carver"
    | "erosion-dilation-pipeline",
  Params extends
    | GameOfLifeVariantsParameters
    | DiffusionLimitedAggregationParameters
    | ReactionDiffusionApproximationParameters
    | VoronoiRegionCarverParameters
    | ErosionDilationPipelineParameters,
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
  let lastAttempt: Readonly<{ params: Params; bytes: Uint8Array }> | null = null;

  for (let attempt = 0; attempt < 24; attempt++) {
    const params = options.randomize();
    const bytes = options.buildBytes(params);
    lastAttempt = { params, bytes };
    const wallCount = countSetBits(bytes);
    if (wallCount < GENERATED_LAYOUT_MIN_WALL_COUNT || wallCount > GENERATED_LAYOUT_MAX_WALL_COUNT)
      continue;

    return {
      wallKey: wallMaskKeyFromBytes(bytes),
      algorithm: options.algorithm,
      title: options.title,
      summary: options.buildSummary(params),
      seedLabel: `Seed ${params.seed}`,
      inverted: false,
      params,
    };
  }

  const fallbackParams = lastAttempt?.params ?? options.fallback;
  const fallbackBytes = lastAttempt?.bytes ?? options.buildBytes(options.fallback);

  return {
    wallKey: wallMaskKeyFromBytes(fallbackBytes),
    algorithm: options.algorithm,
    title: options.title,
    summary: options.buildSummary(fallbackParams),
    seedLabel: `Seed ${fallbackParams.seed}`,
    inverted: false,
    params: fallbackParams,
  };
}

function buildGameOfLifeVariantsRecord(
  rng: () => number,
  controls: GameOfLifeVariantsControlState | null,
): GameOfLifeVariantsGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultGameOfLifeVariantsControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    density: 0.36,
    steps: 4,
    variant: "life",
  } satisfies GameOfLifeVariantsParameters;

  return buildGrowthSystemRecord(rng, {
    algorithm: "game-of-life-variants",
    title: GAME_OF_LIFE_VARIANTS_LABEL,
    randomize: () => randomizeGameOfLifeVariantsParameters(rng, defaults),
    buildBytes: buildGameOfLifeVariantsMaskBytes,
    buildSummary: buildGameOfLifeVariantsSummary,
    fallback,
  });
}

function buildDiffusionLimitedAggregationRecord(
  rng: () => number,
  controls: DiffusionLimitedAggregationControlState | null,
): DiffusionLimitedAggregationGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultDiffusionLimitedAggregationControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    walkers: 360,
    stickiness: 0.7,
    seedMode: "point",
  } satisfies DiffusionLimitedAggregationParameters;

  return buildGrowthSystemRecord(rng, {
    algorithm: "diffusion-limited-aggregation",
    title: DIFFUSION_LIMITED_AGGREGATION_LABEL,
    randomize: () => randomizeDiffusionLimitedAggregationParameters(rng, defaults),
    buildBytes: buildDiffusionLimitedAggregationMaskBytes,
    buildSummary: buildDiffusionLimitedAggregationSummary,
    fallback,
  });
}

function buildReactionDiffusionApproximationRecord(
  rng: () => number,
  controls: ReactionDiffusionApproximationControlState | null,
): ReactionDiffusionApproximationGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultReactionDiffusionApproximationControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    spotCount: 4,
    iterations: 12,
    feed: 0.042,
    kill: 0.062,
  } satisfies ReactionDiffusionApproximationParameters;

  return buildGrowthSystemRecord(rng, {
    algorithm: "reaction-diffusion-approximation",
    title: REACTION_DIFFUSION_APPROXIMATION_LABEL,
    randomize: () => randomizeReactionDiffusionApproximationParameters(rng, defaults),
    buildBytes: buildReactionDiffusionApproximationMaskBytes,
    buildSummary: buildReactionDiffusionApproximationSummary,
    fallback,
  });
}

function buildVoronoiRegionCarverRecord(
  rng: () => number,
  controls: VoronoiRegionCarverControlState | null,
): VoronoiRegionCarverGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultVoronoiRegionCarverControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    siteCount: 8,
    ridgeWidth: 1.2,
    jitter: 0.1,
  } satisfies VoronoiRegionCarverParameters;

  return buildGrowthSystemRecord(rng, {
    algorithm: "voronoi-region-carver",
    title: VORONOI_REGION_CARVER_LABEL,
    randomize: () => randomizeVoronoiRegionCarverParameters(rng, defaults),
    buildBytes: buildVoronoiRegionCarverMaskBytes,
    buildSummary: buildVoronoiRegionCarverSummary,
    fallback,
  });
}

function buildErosionDilationPipelineRecord(
  rng: () => number,
  controls: ErosionDilationPipelineControlState | null,
): ErosionDilationPipelineGeneratedLayoutRecord {
  const defaults = controls ?? createDefaultErosionDilationPipelineControlState();
  const fallback = {
    seed: 1,
    blockSize: 1,
    invert: false,
    density: 0.36,
    growSteps: 2,
    shrinkSteps: 1,
    punctureChance: 0.2,
  } satisfies ErosionDilationPipelineParameters;

  return buildGrowthSystemRecord(rng, {
    algorithm: "erosion-dilation-pipeline",
    title: EROSION_DILATION_PIPELINE_LABEL,
    randomize: () => randomizeErosionDilationPipelineParameters(rng, defaults),
    buildBytes: buildErosionDilationPipelineMaskBytes,
    buildSummary: buildErosionDilationPipelineSummary,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
      inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    inverted: false,
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
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
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

function randomizeOrnamentBaseParameters(
  rng: () => number,
  defaults: OrnamentBaseControlState,
): OrnamentBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.15,
      (value) => !!value,
    ),
  };
}

function randomizeRadialSymmetryParameters(
  rng: () => number,
  defaults: RadialSymmetryControlState,
): RadialSymmetryParameters {
  const base = randomizeOrnamentBaseParameters(rng, defaults);
  return {
    ...base,
    folds: resolveRandomizableValue(
      defaults.folds,
      () => sampleOne(rng, RADIAL_SYMMETRY_FOLDS_VALUES),
      sanitizeRadialSymmetryFolds,
    ),
    rings: resolveRandomizableValue(
      defaults.rings,
      () => sampleOne(rng, RADIAL_SYMMETRY_RINGS_VALUES),
      sanitizeRadialSymmetryRings,
    ),
    twist: resolveRandomizableValue(
      defaults.twist,
      () => sampleOne(rng, RADIAL_SYMMETRY_TWIST_VALUES),
      sanitizeRadialSymmetryTwist,
    ),
    thickness: resolveRandomizableValue(
      defaults.thickness,
      () => sampleOne(rng, RADIAL_SYMMETRY_THICKNESS_VALUES),
      sanitizeRadialSymmetryThickness,
    ),
  };
}

function randomizeKaleidoscopeParameters(
  rng: () => number,
  defaults: KaleidoscopeControlState,
): KaleidoscopeParameters {
  const base = randomizeOrnamentBaseParameters(rng, defaults);
  return {
    ...base,
    segments: resolveRandomizableValue(
      defaults.segments,
      () => sampleOne(rng, KALEIDOSCOPE_SEGMENT_VALUES),
      sanitizeKaleidoscopeSegments,
    ),
    scale: resolveRandomizableValue(
      defaults.scale,
      () => sampleOne(rng, KALEIDOSCOPE_SCALE_VALUES),
      sanitizeKaleidoscopeScale,
    ),
    threshold: resolveRandomizableValue(
      defaults.threshold,
      () => sampleOne(rng, NOISE_TERRAIN_THRESHOLD_VALUES),
      sanitizeNoiseTerrainThreshold,
    ),
  };
}

function randomizeLSystemTurtleParameters(
  rng: () => number,
  defaults: LSystemTurtleControlState,
): LSystemTurtleParameters {
  const base = randomizeOrnamentBaseParameters(rng, defaults);
  return {
    ...base,
    preset: resolveRandomizableValue(
      defaults.preset,
      () => sampleOne(rng, LSYSTEM_PRESET_OPTIONS),
      sanitizeLSystemPreset,
    ),
    iterations: resolveRandomizableValue(
      defaults.iterations,
      () => sampleOne(rng, LSYSTEM_ITERATION_VALUES),
      sanitizeLSystemIterations,
    ),
    turnAngle: resolveRandomizableValue(
      defaults.turnAngle,
      () => sampleOne(rng, LSYSTEM_TURN_ANGLE_VALUES),
      sanitizeLSystemTurnAngle,
    ),
    strokeWidth: resolveRandomizableValue(
      defaults.strokeWidth,
      () => sampleOne(rng, LSYSTEM_STROKE_WIDTH_VALUES),
      sanitizeLSystemStrokeWidth,
    ),
  };
}

function randomizeRoseCurvesParameters(
  rng: () => number,
  defaults: RoseCurvesControlState,
): RoseCurvesParameters {
  const base = randomizeOrnamentBaseParameters(rng, defaults);
  return {
    ...base,
    petals: resolveRandomizableValue(
      defaults.petals,
      () => sampleOne(rng, ROSE_CURVE_PETAL_VALUES),
      sanitizeRoseCurvePetals,
    ),
    harmonic: resolveRandomizableValue(
      defaults.harmonic,
      () => sampleOne(rng, ROSE_CURVE_HARMONIC_VALUES),
      sanitizeRoseCurveHarmonic,
    ),
    rotation: resolveRandomizableValue(
      defaults.rotation,
      () => sampleOne(rng, ROSE_CURVE_ROTATION_VALUES),
      sanitizeRoseCurveRotation,
    ),
    strokeWidth: resolveRandomizableValue(
      defaults.strokeWidth,
      () => sampleOne(rng, LSYSTEM_STROKE_WIDTH_VALUES),
      sanitizeRoseCurveStrokeWidth,
    ),
  };
}

function randomizeTileableMotifRepeaterParameters(
  rng: () => number,
  defaults: TileableMotifRepeaterControlState,
): TileableMotifRepeaterParameters {
  const base = randomizeOrnamentBaseParameters(rng, defaults);
  return {
    ...base,
    motif: resolveRandomizableValue(
      defaults.motif,
      () => sampleOne(rng, TILEABLE_MOTIF_TYPE_OPTIONS),
      sanitizeTileableMotifType,
    ),
    spacing: resolveRandomizableValue(
      defaults.spacing,
      () => sampleOne(rng, TILEABLE_MOTIF_SPACING_VALUES),
      sanitizeTileableMotifSpacing,
    ),
    motifSize: resolveRandomizableValue(
      defaults.motifSize,
      () => sampleOne(rng, TILEABLE_MOTIF_SIZE_VALUES),
      sanitizeTileableMotifSize,
    ),
    jitter: resolveRandomizableValue(
      defaults.jitter,
      () => sampleOne(rng, TILEABLE_MOTIF_JITTER_VALUES),
      sanitizeTileableMotifJitter,
    ),
    rotation: resolveRandomizableValue(
      defaults.rotation,
      () => sampleOne(rng, RIGHT_ANGLE_ROTATION_OPTIONS),
      sanitizeRightAngleRotation,
    ),
  };
}

function randomizeArchitectureBaseParameters(
  rng: () => number,
  defaults: ArchitectureBaseControlState,
): ArchitectureBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.12,
      (value) => !!value,
    ),
  };
}

function randomizeBspRoomPartitionerParameters(
  rng: () => number,
  defaults: BspRoomPartitionerControlState,
): BspRoomPartitionerParameters {
  const base = randomizeArchitectureBaseParameters(rng, defaults);
  return {
    ...base,
    splitDepth: resolveRandomizableValue(
      defaults.splitDepth,
      () => sampleOne(rng, BSP_ROOM_PARTITIONER_SPLIT_DEPTH_VALUES),
      sanitizeBspRoomPartitionerSplitDepth,
    ),
    roomPadding: resolveRandomizableValue(
      defaults.roomPadding,
      () => sampleOne(rng, BSP_ROOM_PARTITIONER_ROOM_PADDING_VALUES),
      sanitizeBspRoomPartitionerRoomPadding,
    ),
    corridorWidth: resolveRandomizableValue(
      defaults.corridorWidth,
      () => sampleOne(rng, BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_VALUES),
      sanitizeBspRoomPartitionerCorridorWidth,
    ),
  };
}

function randomizeCorridorGridParameters(
  rng: () => number,
  defaults: CorridorGridControlState,
): CorridorGridParameters {
  const base = randomizeArchitectureBaseParameters(rng, defaults);
  return {
    ...base,
    columnSpacing: resolveRandomizableValue(
      defaults.columnSpacing,
      () => sampleOne(rng, CORRIDOR_GRID_SPACING_VALUES),
      sanitizeCorridorGridSpacing,
    ),
    rowSpacing: resolveRandomizableValue(
      defaults.rowSpacing,
      () => sampleOne(rng, CORRIDOR_GRID_SPACING_VALUES),
      sanitizeCorridorGridSpacing,
    ),
    wallThickness: resolveRandomizableValue(
      defaults.wallThickness,
      () => sampleOne(rng, CORRIDOR_GRID_WALL_THICKNESS_VALUES),
      sanitizeCorridorGridWallThickness,
    ),
    gapChance: resolveRandomizableValue(
      defaults.gapChance,
      () => sampleOne(rng, CORRIDOR_GRID_GAP_CHANCE_VALUES),
      sanitizeCorridorGridGapChance,
    ),
  };
}

function randomizeRoomScatterParameters(
  rng: () => number,
  defaults: RoomScatterControlState,
): RoomScatterParameters {
  const base = randomizeArchitectureBaseParameters(rng, defaults);
  return {
    ...base,
    roomCount: resolveRandomizableValue(
      defaults.roomCount,
      () => sampleOne(rng, ROOM_SCATTER_ROOM_COUNT_VALUES),
      sanitizeRoomScatterRoomCount,
    ),
    roomSize: resolveRandomizableValue(
      defaults.roomSize,
      () => sampleOne(rng, ROOM_SCATTER_ROOM_SIZE_VALUES),
      sanitizeRoomScatterRoomSize,
    ),
    gap: resolveRandomizableValue(
      defaults.gap,
      () => sampleOne(rng, ROOM_SCATTER_GAP_VALUES),
      sanitizeRoomScatterGap,
    ),
    connectorChance: resolveRandomizableValue(
      defaults.connectorChance,
      () => sampleOne(rng, ROOM_SCATTER_CONNECTOR_CHANCE_VALUES),
      sanitizeRoomScatterConnectorChance,
    ),
  };
}

function randomizeCourtyardGeneratorParameters(
  rng: () => number,
  defaults: CourtyardGeneratorControlState,
): CourtyardGeneratorParameters {
  const base = randomizeArchitectureBaseParameters(rng, defaults);
  return {
    ...base,
    ringCount: resolveRandomizableValue(
      defaults.ringCount,
      () => sampleOne(rng, COURTYARD_RING_COUNT_VALUES),
      sanitizeCourtyardRingCount,
    ),
    ringGap: resolveRandomizableValue(
      defaults.ringGap,
      () => sampleOne(rng, COURTYARD_RING_GAP_VALUES),
      sanitizeCourtyardRingGap,
    ),
    gateWidth: resolveRandomizableValue(
      defaults.gateWidth,
      () => sampleOne(rng, COURTYARD_GATE_WIDTH_VALUES),
      sanitizeCourtyardGateWidth,
    ),
    offset: resolveRandomizableValue(
      defaults.offset,
      () => sampleOne(rng, COURTYARD_OFFSET_VALUES),
      sanitizeCourtyardOffset,
    ),
  };
}

function randomizeBlueprintGeneratorParameters(
  rng: () => number,
  defaults: BlueprintGeneratorControlState,
): BlueprintGeneratorParameters {
  const base = randomizeArchitectureBaseParameters(rng, defaults);
  return {
    ...base,
    wingCount: resolveRandomizableValue(
      defaults.wingCount,
      () => sampleOne(rng, BLUEPRINT_WING_COUNT_VALUES),
      sanitizeBlueprintWingCount,
    ),
    hallWidth: resolveRandomizableValue(
      defaults.hallWidth,
      () => sampleOne(rng, BLUEPRINT_HALL_WIDTH_VALUES),
      sanitizeBlueprintHallWidth,
    ),
    pillarSpacing: resolveRandomizableValue(
      defaults.pillarSpacing,
      () => sampleOne(rng, BLUEPRINT_PILLAR_SPACING_VALUES),
      sanitizeBlueprintPillarSpacing,
    ),
    chamberDepth: resolveRandomizableValue(
      defaults.chamberDepth,
      () => sampleOne(rng, BLUEPRINT_CHAMBER_DEPTH_VALUES),
      sanitizeBlueprintChamberDepth,
    ),
  };
}

function randomizePatternedGeometricBaseParameters(
  rng: () => number,
  defaults: PatternedGeometricBaseControlState,
): PatternedGeometricBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.12,
      (value) => !!value,
    ),
  };
}

function randomizeStripePlaidGeneratorParameters(
  rng: () => number,
  defaults: StripePlaidGeneratorControlState,
): StripePlaidGeneratorParameters {
  const base = randomizePatternedGeometricBaseParameters(rng, defaults);
  return {
    ...base,
    mode: resolveRandomizableValue(
      defaults.mode,
      () => sampleOne(rng, STRIPE_PLAID_MODE_OPTIONS),
      sanitizeStripePlaidMode,
    ),
    spacing: resolveRandomizableValue(
      defaults.spacing,
      () => sampleOne(rng, STRIPE_PLAID_SPACING_VALUES),
      sanitizeStripePlaidSpacing,
    ),
    bandWidth: resolveRandomizableValue(
      defaults.bandWidth,
      () => sampleOne(rng, STRIPE_PLAID_BAND_WIDTH_VALUES),
      sanitizeStripePlaidBandWidth,
    ),
    offset: resolveRandomizableValue(
      defaults.offset,
      () => sampleOne(rng, STRIPE_PLAID_OFFSET_VALUES),
      sanitizeStripePlaidOffset,
    ),
  };
}

function randomizeCheckerDiamondLatticeParameters(
  rng: () => number,
  defaults: CheckerDiamondLatticeControlState,
): CheckerDiamondLatticeParameters {
  const base = randomizePatternedGeometricBaseParameters(rng, defaults);
  return {
    ...base,
    style: resolveRandomizableValue(
      defaults.style,
      () => sampleOne(rng, CHECKER_DIAMOND_LATTICE_STYLE_OPTIONS),
      sanitizeCheckerDiamondLatticeStyle,
    ),
    cellSize: resolveRandomizableValue(
      defaults.cellSize,
      () => sampleOne(rng, CHECKER_DIAMOND_CELL_SIZE_VALUES),
      sanitizeCheckerDiamondCellSize,
    ),
    lineWidth: resolveRandomizableValue(
      defaults.lineWidth,
      () => sampleOne(rng, CHECKER_DIAMOND_LINE_WIDTH_VALUES),
      sanitizeCheckerDiamondLineWidth,
    ),
    phase: resolveRandomizableValue(
      defaults.phase,
      () => sampleOne(rng, CHECKER_DIAMOND_PHASE_VALUES),
      sanitizeCheckerDiamondPhase,
    ),
  };
}

function randomizeConcentricBoxesParameters(
  rng: () => number,
  defaults: ConcentricBoxesControlState,
): ConcentricBoxesParameters {
  const base = randomizePatternedGeometricBaseParameters(rng, defaults);
  return {
    ...base,
    ringCount: resolveRandomizableValue(
      defaults.ringCount,
      () => sampleOne(rng, CONCENTRIC_BOX_RING_COUNT_VALUES),
      sanitizeConcentricBoxRingCount,
    ),
    spacing: resolveRandomizableValue(
      defaults.spacing,
      () => sampleOne(rng, CONCENTRIC_BOX_SPACING_VALUES),
      sanitizeConcentricBoxSpacing,
    ),
    lineWidth: resolveRandomizableValue(
      defaults.lineWidth,
      () => sampleOne(rng, CONCENTRIC_BOX_LINE_WIDTH_VALUES),
      sanitizeConcentricBoxLineWidth,
    ),
    drift: resolveRandomizableValue(
      defaults.drift,
      () => sampleOne(rng, CONCENTRIC_BOX_DRIFT_VALUES),
      sanitizeConcentricBoxDrift,
    ),
  };
}

function randomizeLineInterferenceParameters(
  rng: () => number,
  defaults: LineInterferenceControlState,
): LineInterferenceParameters {
  const base = randomizePatternedGeometricBaseParameters(rng, defaults);
  return {
    ...base,
    angleA: resolveRandomizableValue(
      defaults.angleA,
      () => sampleOne(rng, THRESHOLDED_GRADIENT_ANGLE_VALUES),
      sanitizeThresholdedGradientAngle,
    ),
    angleB: resolveRandomizableValue(
      defaults.angleB,
      () => sampleOne(rng, THRESHOLDED_GRADIENT_ANGLE_VALUES),
      sanitizeThresholdedGradientAngle,
    ),
    spacing: resolveRandomizableValue(
      defaults.spacing,
      () => sampleOne(rng, LINE_INTERFERENCE_SPACING_VALUES),
      sanitizeLineInterferenceSpacing,
    ),
    strokeWidth: resolveRandomizableValue(
      defaults.strokeWidth,
      () => sampleOne(rng, LINE_INTERFERENCE_STROKE_WIDTH_VALUES),
      sanitizeLineInterferenceStrokeWidth,
    ),
  };
}

function randomizeCirclePackingParameters(
  rng: () => number,
  defaults: CirclePackingControlState,
): CirclePackingParameters {
  const base = randomizePatternedGeometricBaseParameters(rng, defaults);
  const minRadius = resolveRandomizableValue(
    defaults.minRadius,
    () => sampleOne(rng, CIRCLE_PACKING_MIN_RADIUS_VALUES),
    sanitizeCirclePackingMinRadius,
  );
  const maxRadius = Math.max(
    minRadius,
    resolveRandomizableValue(
      defaults.maxRadius,
      () => sampleOne(rng, CIRCLE_PACKING_MAX_RADIUS_VALUES),
      sanitizeCirclePackingMaxRadius,
    ),
  );

  return {
    ...base,
    circleCount: resolveRandomizableValue(
      defaults.circleCount,
      () => sampleOne(rng, CIRCLE_PACKING_COUNT_VALUES),
      sanitizeCirclePackingCount,
    ),
    minRadius,
    maxRadius,
    outline: resolveRandomizableValue(
      defaults.outline,
      () => rng() < 0.4,
      (value) => !!value,
    ),
  };
}

function randomizeChaoticProceduralBaseParameters(
  rng: () => number,
  defaults: ChaoticProceduralBaseControlState,
): ChaoticProceduralBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.12,
      (value) => !!value,
    ),
  };
}

function randomizeDrunkWalkPainterParameters(
  rng: () => number,
  defaults: DrunkWalkPainterControlState,
): DrunkWalkPainterParameters {
  const base = randomizeChaoticProceduralBaseParameters(rng, defaults);
  return {
    ...base,
    walkerCount: resolveRandomizableValue(
      defaults.walkerCount,
      () => sampleOne(rng, DRUNK_WALK_WALKER_COUNT_VALUES),
      sanitizeDrunkWalkWalkerCount,
    ),
    steps: resolveRandomizableValue(
      defaults.steps,
      () => sampleOne(rng, DRUNK_WALK_STEPS_VALUES),
      sanitizeDrunkWalkSteps,
    ),
    brushSize: resolveRandomizableValue(
      defaults.brushSize,
      () => sampleOne(rng, DRUNK_WALK_BRUSH_SIZE_VALUES),
      sanitizeDrunkWalkBrushSize,
    ),
    roomChance: resolveRandomizableValue(
      defaults.roomChance,
      () => sampleOne(rng, DRUNK_WALK_ROOM_CHANCE_VALUES),
      sanitizeDrunkWalkRoomChance,
    ),
  };
}

function randomizeParticleFlowFieldParameters(
  rng: () => number,
  defaults: ParticleFlowFieldControlState,
): ParticleFlowFieldParameters {
  const base = randomizeChaoticProceduralBaseParameters(rng, defaults);
  return {
    ...base,
    agentCount: resolveRandomizableValue(
      defaults.agentCount,
      () => sampleOne(rng, PARTICLE_FLOW_AGENT_COUNT_VALUES),
      sanitizeParticleFlowAgentCount,
    ),
    steps: resolveRandomizableValue(
      defaults.steps,
      () => sampleOne(rng, PARTICLE_FLOW_STEPS_VALUES),
      sanitizeParticleFlowSteps,
    ),
    fieldScale: resolveRandomizableValue(
      defaults.fieldScale,
      () => sampleOne(rng, PARTICLE_FLOW_FIELD_SCALE_VALUES),
      sanitizeParticleFlowFieldScale,
    ),
    strokeWidth: resolveRandomizableValue(
      defaults.strokeWidth,
      () => sampleOne(rng, PARTICLE_FLOW_STROKE_WIDTH_VALUES),
      sanitizeParticleFlowStrokeWidth,
    ),
  };
}

function randomizeStampBrushGeneratorParameters(
  rng: () => number,
  defaults: StampBrushGeneratorControlState,
): StampBrushGeneratorParameters {
  const base = randomizeChaoticProceduralBaseParameters(rng, defaults);
  return {
    ...base,
    stampCount: resolveRandomizableValue(
      defaults.stampCount,
      () => sampleOne(rng, STAMP_BRUSH_COUNT_VALUES),
      sanitizeStampBrushCount,
    ),
    stampSize: resolveRandomizableValue(
      defaults.stampSize,
      () => sampleOne(rng, STAMP_BRUSH_SIZE_VALUES),
      sanitizeStampBrushSize,
    ),
    stampType: resolveRandomizableValue(
      defaults.stampType,
      () => sampleOne(rng, STAMP_BRUSH_TYPE_OPTIONS),
      sanitizeStampBrushType,
    ),
    scatter: resolveRandomizableValue(
      defaults.scatter,
      () => sampleOne(rng, STAMP_BRUSH_SCATTER_VALUES),
      sanitizeStampBrushScatter,
    ),
  };
}

function randomizeCutoutCollageParameters(
  rng: () => number,
  defaults: CutoutCollageControlState,
): CutoutCollageParameters {
  const base = randomizeChaoticProceduralBaseParameters(rng, defaults);
  const minSize = resolveRandomizableValue(
    defaults.minSize,
    () => sampleOne(rng, CUTOUT_COLLAGE_MIN_SIZE_VALUES),
    sanitizeCutoutCollageMinSize,
  );
  const maxSize = Math.max(
    Math.max(minSize, CUTOUT_COLLAGE_MAX_SIZE_MIN),
    resolveRandomizableValue(
      defaults.maxSize,
      () => sampleOne(rng, CUTOUT_COLLAGE_MAX_SIZE_VALUES),
      sanitizeCutoutCollageMaxSize,
    ),
  );
  return {
    ...base,
    shapeCount: resolveRandomizableValue(
      defaults.shapeCount,
      () => sampleOne(rng, CUTOUT_COLLAGE_SHAPE_COUNT_VALUES),
      sanitizeCutoutCollageShapeCount,
    ),
    minSize,
    maxSize,
    subtractChance: resolveRandomizableValue(
      defaults.subtractChance,
      () => sampleOne(rng, CUTOUT_COLLAGE_SUBTRACT_CHANCE_VALUES),
      sanitizeCutoutCollageSubtractChance,
    ),
  };
}

function randomizeGlitchBlocksParameters(
  rng: () => number,
  defaults: GlitchBlocksControlState,
): GlitchBlocksParameters {
  const base = randomizeChaoticProceduralBaseParameters(rng, defaults);
  return {
    ...base,
    bandCount: resolveRandomizableValue(
      defaults.bandCount,
      () => sampleOne(rng, GLITCH_BLOCK_BAND_COUNT_VALUES),
      sanitizeGlitchBlockBandCount,
    ),
    offsetRange: resolveRandomizableValue(
      defaults.offsetRange,
      () => sampleOne(rng, GLITCH_BLOCK_OFFSET_RANGE_VALUES),
      sanitizeGlitchBlockOffsetRange,
    ),
    stripeChance: resolveRandomizableValue(
      defaults.stripeChance,
      () => sampleOne(rng, GLITCH_BLOCK_STRIPE_CHANCE_VALUES),
      sanitizeGlitchBlockStripeChance,
    ),
    cellSize: resolveRandomizableValue(
      defaults.cellSize,
      () => sampleOne(rng, GLITCH_BLOCK_CELL_SIZE_VALUES),
      sanitizeGlitchBlockCellSize,
    ),
  };
}

function randomizeGrowthBaseParameters(
  rng: () => number,
  defaults: GrowthBaseControlState,
): GrowthBaseParameters {
  return {
    seed: resolveRandomizableValue(
      defaults.seed,
      () => randomInt(rng, RANDOM_NOISE_SEED_MIN, RANDOM_NOISE_SEED_MAX),
      sanitizeSeed,
    ),
    blockSize: sampleClosestNoiseBlockSize(defaults.blockSize.value),
    invert: resolveRandomizableValue(
      defaults.invert,
      () => rng() < 0.12,
      (value) => !!value,
    ),
  };
}

function randomizeGameOfLifeVariantsParameters(
  rng: () => number,
  defaults: GameOfLifeVariantsControlState,
): GameOfLifeVariantsParameters {
  const base = randomizeGrowthBaseParameters(rng, defaults);
  return {
    ...base,
    density: resolveRandomizableValue(
      defaults.density,
      () => sampleOne(rng, GAME_OF_LIFE_DENSITY_VALUES),
      sanitizeGameOfLifeDensity,
    ),
    steps: resolveRandomizableValue(
      defaults.steps,
      () => sampleOne(rng, GAME_OF_LIFE_STEPS_VALUES),
      sanitizeGameOfLifeSteps,
    ),
    variant: resolveRandomizableValue(
      defaults.variant,
      () => sampleOne(rng, GAME_OF_LIFE_VARIANT_OPTIONS),
      sanitizeGameOfLifeVariant,
    ),
  };
}

function randomizeDiffusionLimitedAggregationParameters(
  rng: () => number,
  defaults: DiffusionLimitedAggregationControlState,
): DiffusionLimitedAggregationParameters {
  const base = randomizeGrowthBaseParameters(rng, defaults);
  return {
    ...base,
    walkers: resolveRandomizableValue(
      defaults.walkers,
      () => sampleOne(rng, DLA_WALKER_VALUES),
      sanitizeDlaWalkers,
    ),
    stickiness: resolveRandomizableValue(
      defaults.stickiness,
      () => sampleOne(rng, DLA_STICKINESS_VALUES),
      sanitizeDlaStickiness,
    ),
    seedMode: resolveRandomizableValue(
      defaults.seedMode,
      () => sampleOne(rng, DLA_SEED_MODE_OPTIONS),
      sanitizeDlaSeedMode,
    ),
  };
}

function randomizeReactionDiffusionApproximationParameters(
  rng: () => number,
  defaults: ReactionDiffusionApproximationControlState,
): ReactionDiffusionApproximationParameters {
  const base = randomizeGrowthBaseParameters(rng, defaults);
  return {
    ...base,
    spotCount: resolveRandomizableValue(
      defaults.spotCount,
      () => sampleOne(rng, REACTION_DIFFUSION_SPOT_COUNT_VALUES),
      sanitizeReactionDiffusionSpotCount,
    ),
    iterations: resolveRandomizableValue(
      defaults.iterations,
      () => sampleOne(rng, REACTION_DIFFUSION_ITERATION_VALUES),
      sanitizeReactionDiffusionIterations,
    ),
    feed: resolveRandomizableValue(
      defaults.feed,
      () => sampleOne(rng, REACTION_DIFFUSION_FEED_VALUES),
      sanitizeReactionDiffusionFeed,
    ),
    kill: resolveRandomizableValue(
      defaults.kill,
      () => sampleOne(rng, REACTION_DIFFUSION_KILL_VALUES),
      sanitizeReactionDiffusionKill,
    ),
  };
}

function randomizeVoronoiRegionCarverParameters(
  rng: () => number,
  defaults: VoronoiRegionCarverControlState,
): VoronoiRegionCarverParameters {
  const base = randomizeGrowthBaseParameters(rng, defaults);
  return {
    ...base,
    siteCount: resolveRandomizableValue(
      defaults.siteCount,
      () => sampleOne(rng, VORONOI_SITE_COUNT_VALUES),
      sanitizeVoronoiSiteCount,
    ),
    ridgeWidth: resolveRandomizableValue(
      defaults.ridgeWidth,
      () => sampleOne(rng, VORONOI_RIDGE_WIDTH_VALUES),
      sanitizeVoronoiRidgeWidth,
    ),
    jitter: resolveRandomizableValue(
      defaults.jitter,
      () => sampleOne(rng, VORONOI_JITTER_VALUES),
      sanitizeVoronoiJitter,
    ),
  };
}

function randomizeErosionDilationPipelineParameters(
  rng: () => number,
  defaults: ErosionDilationPipelineControlState,
): ErosionDilationPipelineParameters {
  const base = randomizeGrowthBaseParameters(rng, defaults);
  return {
    ...base,
    density: resolveRandomizableValue(
      defaults.density,
      () => sampleOne(rng, EROSION_DILATION_DENSITY_VALUES),
      sanitizeErosionDilationDensity,
    ),
    growSteps: resolveRandomizableValue(
      defaults.growSteps,
      () => sampleOne(rng, EROSION_DILATION_STEP_VALUES),
      sanitizeErosionDilationGrowSteps,
    ),
    shrinkSteps: resolveRandomizableValue(
      defaults.shrinkSteps,
      () => sampleOne(rng, EROSION_DILATION_STEP_VALUES),
      sanitizeErosionDilationShrinkSteps,
    ),
    punctureChance: resolveRandomizableValue(
      defaults.punctureChance,
      () => sampleOne(rng, EROSION_DILATION_PUNCTURE_VALUES),
      sanitizeErosionDilationPunctureChance,
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
  const contentWidth = activeGeneratedContentSize.width;
  const contentHeight = activeGeneratedContentSize.height;
  const sourceWidth = Math.ceil(contentWidth / params.blockSize);
  const sourceHeight = Math.ceil(contentHeight / params.blockSize);
  const cells = new Uint8Array(sourceWidth * sourceHeight);
  const rng = createSeededRandom(params.seed);

  for (let sourceY = 0; sourceY < sourceHeight; sourceY++) {
    for (let sourceX = 0; sourceX < sourceWidth; sourceX++) {
      cells[sourceY * sourceWidth + sourceX] = rng() < params.density ? 1 : 0;
    }
  }

  for (let y = 0; y < contentHeight; y++) {
    for (let x = 0; x < contentWidth; x++) {
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
  const contentWidth = activeGeneratedContentSize.width;
  const contentHeight = activeGeneratedContentSize.height;
  const sourceWidth = Math.ceil(contentWidth / params.blockSize);
  const sourceHeight = Math.ceil(contentHeight / params.blockSize);
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

  for (let y = 0; y < contentHeight; y++) {
    for (let x = 0; x < contentWidth; x++) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor(x / params.blockSize));
      const sourceY = Math.min(sourceHeight - 1, Math.floor(y / params.blockSize));
      if (cells[sourceY * sourceWidth + sourceX] !== 1) continue;
      setMaskBit(bytes, y * GENERATED_LAYOUT_GRID_SIZE + x);
    }
  }

  return bytes;
}

function buildRadialSymmetryMaskBytes(params: RadialSymmetryParameters): Uint8Array {
  const bytes = buildScalarPatternMaskBytes(params.blockSize, (sampleX, sampleY) => {
    const dx = sampleX * 2 - 1;
    const dy = sampleY * 2 - 1;
    const radius = Math.hypot(dx, dy);
    if (radius > 1) return false;

    const phase = hashFloat(params.seed, 11, 17) * Math.PI * 2;
    const sector = (Math.PI * 2) / params.folds;
    const angle = Math.atan2(dy, dx) + phase;
    const folded = normalizedFoldedAngle(angle, sector);
    const spokeWidth = params.thickness * (0.55 + (1 - radius) * 0.5);
    const twistPhase = radius * params.twist * Math.PI * 2;
    const ringWave = Math.abs(Math.sin(radius * params.rings * Math.PI * 2 + twistPhase + phase));
    const rosetteWave = Math.abs(
      Math.cos(radius * (params.rings + 1) * Math.PI + folded * params.folds * Math.PI * 0.5),
    );

    return (
      folded < spokeWidth ||
      ringWave > 1 - params.thickness * 2.25 ||
      (folded < params.thickness * 1.5 && rosetteWave > 0.55)
    );
  });
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildKaleidoscopeMaskBytes(params: KaleidoscopeParameters): Uint8Array {
  const bytes = buildScalarPatternMaskBytes(params.blockSize, (sampleX, sampleY) => {
    const dx = sampleX * 2 - 1;
    const dy = sampleY * 2 - 1;
    const radius = Math.hypot(dx, dy);
    if (radius > 1) return false;

    const sector = (Math.PI * 2) / params.segments;
    const angle = Math.atan2(dy, dx) + hashFloat(params.seed, 5, 9) * sector;
    const folded = normalizedFoldedAngle(angle, sector);
    const localX = folded * params.scale * 2.25 + radius * 0.35;
    const localY = radius * params.scale * 3.25;
    const primary = fractalNoise(params.seed, localX, localY, 3, 0.55, valueNoise2D);
    const secondary = gradientNoise2D(
      params.seed + 177,
      localX * 1.35 + radius,
      localY * 0.75 + folded * params.segments,
    );
    const field = clamp01(primary * 0.72 + secondary * 0.28);
    return field >= params.threshold;
  });
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildLSystemTurtleMaskBytes(params: LSystemTurtleParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  const preset = lSystemPresetConfig(params.preset);
  const sequence = expandLSystemSequence(preset.axiom, preset.rules, params.iterations);
  const seededAngleOffset = hashFloat(params.seed, 23, 41) * 270 - 135;
  const traced = traceLSystemSegments(
    sequence,
    preset.startAngle + seededAngleOffset,
    params.turnAngle,
  );
  drawScaledSegments(
    grid.cells,
    grid.width,
    grid.height,
    traced.segments,
    params.strokeWidth,
    1 + hashFloat(params.seed, 31, 59) * 1.5,
  );
  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildRoseCurvesMaskBytes(params: RoseCurvesParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  const centerX = (grid.width - 1) / 2;
  const centerY = (grid.height - 1) / 2;
  const radius =
    Math.max(1, Math.min(grid.width, grid.height) * 0.42) *
    (0.82 + hashFloat(params.seed, 61, 67) * 0.24);
  const rotation = (params.rotation * Math.PI) / 180 + hashFloat(params.seed, 71, 73) * Math.PI * 2;
  const k = params.petals / params.harmonic;
  const maxTheta = Math.PI * 2 * params.harmonic * 2;
  const steps = Math.max(360, params.petals * params.harmonic * 180);
  const phase = hashFloat(params.seed, 79, 83) * Math.PI * 2;
  const modulation = 0.82 + hashFloat(params.seed, 89, 97) * 0.28;
  let previous: Readonly<{ x: number; y: number }> | null = null;

  for (let index = 0; index <= steps; index++) {
    const theta = (index / steps) * maxTheta;
    const r =
      Math.cos(k * theta + phase) *
      radius *
      (modulation + 0.12 * Math.sin((params.harmonic + 1) * theta + phase));
    const point = {
      x: centerX + Math.cos(theta + rotation) * r,
      y: centerY + Math.sin(theta + rotation) * r,
    };
    if (previous) {
      drawSourceLine(
        grid.cells,
        grid.width,
        grid.height,
        previous.x,
        previous.y,
        point.x,
        point.y,
        params.strokeWidth,
      );
    }
    previous = point;
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildTileableMotifRepeaterMaskBytes(params: TileableMotifRepeaterParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);

  for (let tileY = 0; tileY < grid.height + params.spacing; tileY += params.spacing) {
    for (let tileX = 0; tileX < grid.width + params.spacing; tileX += params.spacing) {
      const centerX =
        tileX + Math.round((hashFloat(params.seed, tileX, tileY) * 2 - 1) * params.jitter);
      const centerY =
        tileY + Math.round((hashFloat(params.seed + 29, tileX, tileY) * 2 - 1) * params.jitter);
      drawTileableMotif(
        grid.cells,
        grid.width,
        grid.height,
        centerX,
        centerY,
        params.motif,
        params.motifSize,
        params.rotation,
      );
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildBspRoomPartitionerMaskBytes(params: BspRoomPartitionerParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createFilledPatternSourceGrid(params.blockSize);
  const root = {
    x: 1,
    y: 1,
    width: Math.max(3, grid.width - 2),
    height: Math.max(3, grid.height - 2),
  };
  const minLeafSpan = Math.max(4, params.roomPadding * 2 + params.corridorWidth + 3);

  const buildLeaf = (
    region: PatternRect,
  ): Readonly<{ center: Readonly<{ x: number; y: number }> }> => {
    const availableWidth = Math.max(3, region.width - params.roomPadding * 2);
    const availableHeight = Math.max(3, region.height - params.roomPadding * 2);
    const roomWidth = clamp(
      randomInt(rng, Math.max(3, availableWidth - 2), availableWidth),
      3,
      availableWidth,
    );
    const roomHeight = clamp(
      randomInt(rng, Math.max(3, availableHeight - 2), availableHeight),
      3,
      availableHeight,
    );
    const minX = region.x + params.roomPadding;
    const minY = region.y + params.roomPadding;
    const roomX = randomInt(rng, minX, Math.max(minX, region.x + region.width - roomWidth));
    const roomY = randomInt(rng, minY, Math.max(minY, region.y + region.height - roomHeight));
    fillPatternRect(grid.cells, grid.width, grid.height, roomX, roomY, roomWidth, roomHeight, 0);
    return {
      center: patternRectCenter({ x: roomX, y: roomY, width: roomWidth, height: roomHeight }),
    };
  };

  const splitRegion = (
    region: PatternRect,
    depth: number,
  ): Readonly<{ center: Readonly<{ x: number; y: number }> }> => {
    const canSplitVertical = region.width >= minLeafSpan * 2;
    const canSplitHorizontal = region.height >= minLeafSpan * 2;

    if (depth <= 0 || (!canSplitVertical && !canSplitHorizontal)) {
      return buildLeaf(region);
    }

    let splitVertical = canSplitVertical;
    if (canSplitVertical && canSplitHorizontal) {
      if (region.width > region.height + 2) splitVertical = true;
      else if (region.height > region.width + 2) splitVertical = false;
      else splitVertical = rng() < 0.5;
    } else {
      splitVertical = canSplitVertical;
    }

    if (splitVertical) {
      const splitOffset = randomInt(rng, minLeafSpan, region.width - minLeafSpan);
      const left = splitRegion(
        { x: region.x, y: region.y, width: splitOffset, height: region.height },
        depth - 1,
      );
      const right = splitRegion(
        {
          x: region.x + splitOffset,
          y: region.y,
          width: region.width - splitOffset,
          height: region.height,
        },
        depth - 1,
      );
      carvePatternCorridor(
        grid.cells,
        grid.width,
        grid.height,
        left.center,
        right.center,
        params.corridorWidth,
        rng,
      );
      return rng() < 0.5 ? left : right;
    }

    const splitOffset = randomInt(rng, minLeafSpan, region.height - minLeafSpan);
    const top = splitRegion(
      { x: region.x, y: region.y, width: region.width, height: splitOffset },
      depth - 1,
    );
    const bottom = splitRegion(
      {
        x: region.x,
        y: region.y + splitOffset,
        width: region.width,
        height: region.height - splitOffset,
      },
      depth - 1,
    );
    carvePatternCorridor(
      grid.cells,
      grid.width,
      grid.height,
      top.center,
      bottom.center,
      params.corridorWidth,
      rng,
    );
    return rng() < 0.5 ? top : bottom;
  };

  splitRegion(root, params.splitDepth);

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildCorridorGridMaskBytes(params: CorridorGridParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  strokePatternRect(grid.cells, grid.width, grid.height, 0, 0, grid.width, grid.height, 1, 1);

  const startX = 1 + randomInt(rng, 0, Math.max(0, params.columnSpacing - 1));
  const startY = 1 + randomInt(rng, 0, Math.max(0, params.rowSpacing - 1));
  const verticalLines: number[] = [];
  const horizontalLines: number[] = [];

  for (let x = startX; x < grid.width - 1; x += params.columnSpacing) {
    verticalLines.push(x);
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      x,
      1,
      params.wallThickness,
      Math.max(0, grid.height - 2),
      1,
    );
  }

  for (let y = startY; y < grid.height - 1; y += params.rowSpacing) {
    horizontalLines.push(y);
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      1,
      y,
      Math.max(0, grid.width - 2),
      params.wallThickness,
      1,
    );
  }

  const horizontalBounds = [...horizontalLines, grid.height - 1];
  for (const x of verticalLines) {
    let segmentStart = 1;
    for (const boundary of horizontalBounds) {
      const segmentEnd = boundary - 1;
      if (segmentEnd >= segmentStart) {
        const doorCount =
          1 + (rng() < params.gapChance ? 1 : 0) + (rng() < params.gapChance * 0.35 ? 1 : 0);
        for (let index = 0; index < doorCount; index++) {
          const doorY = randomInt(rng, segmentStart, segmentEnd);
          fillPatternRect(
            grid.cells,
            grid.width,
            grid.height,
            x,
            doorY,
            params.wallThickness,
            1,
            0,
          );
        }
      }
      segmentStart = boundary + params.wallThickness;
    }
  }

  const verticalBounds = [...verticalLines, grid.width - 1];
  for (const y of horizontalLines) {
    let segmentStart = 1;
    for (const boundary of verticalBounds) {
      const segmentEnd = boundary - 1;
      if (segmentEnd >= segmentStart) {
        const doorCount =
          1 + (rng() < params.gapChance ? 1 : 0) + (rng() < params.gapChance * 0.35 ? 1 : 0);
        for (let index = 0; index < doorCount; index++) {
          const doorX = randomInt(rng, segmentStart, segmentEnd);
          fillPatternRect(
            grid.cells,
            grid.width,
            grid.height,
            doorX,
            y,
            1,
            params.wallThickness,
            0,
          );
        }
      }
      segmentStart = boundary + params.wallThickness;
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildRoomScatterMaskBytes(params: RoomScatterParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createFilledPatternSourceGrid(params.blockSize);
  const rooms: PatternRect[] = [];
  const maxRoomSize = Math.min(params.roomSize, grid.width - 2, grid.height - 2);
  const attempts = Math.max(24, params.roomCount * 12);

  for (let attempt = 0; attempt < attempts && rooms.length < params.roomCount; attempt++) {
    const roomWidth = randomInt(rng, Math.min(3, maxRoomSize), maxRoomSize);
    const roomHeight = randomInt(rng, Math.min(3, maxRoomSize), maxRoomSize);
    const room = {
      x: randomInt(rng, 1, Math.max(1, grid.width - roomWidth - 1)),
      y: randomInt(rng, 1, Math.max(1, grid.height - roomHeight - 1)),
      width: roomWidth,
      height: roomHeight,
    };
    if (rooms.some((existing) => rectsOverlapWithGap(existing, room, params.gap))) continue;
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      room.x,
      room.y,
      room.width,
      room.height,
      0,
    );
    rooms.push(room);
  }

  if (rooms.length === 0) {
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      Math.max(1, Math.floor(grid.width / 4)),
      Math.max(1, Math.floor(grid.height / 4)),
      Math.max(3, Math.floor(grid.width / 2)),
      Math.max(3, Math.floor(grid.height / 2)),
      0,
    );
  }

  for (let index = 1; index < rooms.length; index++) {
    if (index !== 1 && rng() > params.connectorChance) continue;
    const room = rooms[index]!;
    let closest = rooms[0]!;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let candidateIndex = 0; candidateIndex < index; candidateIndex++) {
      const candidate = rooms[candidateIndex]!;
      const candidateDistance = rectCenterDistance(room, candidate);
      if (candidateDistance >= bestDistance) continue;
      closest = candidate;
      bestDistance = candidateDistance;
    }
    carvePatternCorridor(
      grid.cells,
      grid.width,
      grid.height,
      patternRectCenter(room),
      patternRectCenter(closest),
      1,
      rng,
    );
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildCourtyardGeneratorMaskBytes(params: CourtyardGeneratorParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const centerX = Math.floor(grid.width / 2);
  const centerY = Math.floor(grid.height / 2);
  const step = params.ringGap + 2;

  for (let ringIndex = 0; ringIndex < params.ringCount; ringIndex++) {
    const inset = 1 + ringIndex * step;
    const rect: PatternRect = {
      x: inset,
      y: inset,
      width: grid.width - inset * 2,
      height: grid.height - inset * 2,
    };
    if (rect.width < 4 || rect.height < 4) break;

    strokePatternRect(
      grid.cells,
      grid.width,
      grid.height,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      1,
      1,
    );

    const northX = clamp(
      centerX + randomInt(rng, -params.offset, params.offset) - Math.floor(params.gateWidth / 2),
      rect.x + 1,
      rect.x + rect.width - params.gateWidth - 1,
    );
    const southX = clamp(
      centerX + randomInt(rng, -params.offset, params.offset) - Math.floor(params.gateWidth / 2),
      rect.x + 1,
      rect.x + rect.width - params.gateWidth - 1,
    );
    const westY = clamp(
      centerY + randomInt(rng, -params.offset, params.offset) - Math.floor(params.gateWidth / 2),
      rect.y + 1,
      rect.y + rect.height - params.gateWidth - 1,
    );
    const eastY = clamp(
      centerY + randomInt(rng, -params.offset, params.offset) - Math.floor(params.gateWidth / 2),
      rect.y + 1,
      rect.y + rect.height - params.gateWidth - 1,
    );

    fillPatternRect(grid.cells, grid.width, grid.height, northX, rect.y, params.gateWidth, 1, 0);
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      southX,
      rect.y + rect.height - 1,
      params.gateWidth,
      1,
      0,
    );
    fillPatternRect(grid.cells, grid.width, grid.height, rect.x, westY, 1, params.gateWidth, 0);
    fillPatternRect(
      grid.cells,
      grid.width,
      grid.height,
      rect.x + rect.width - 1,
      eastY,
      1,
      params.gateWidth,
      0,
    );
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildBlueprintGeneratorMaskBytes(params: BlueprintGeneratorParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createFilledPatternSourceGrid(params.blockSize);
  const centerX = Math.floor(grid.width / 2);
  const centerY = Math.floor(grid.height / 2);
  const hallWidth = Math.min(params.hallWidth, grid.width - 4, grid.height - 4);
  const hallHalf = Math.floor(hallWidth / 2);
  const hallMargin = clamp(
    Math.floor(params.chamberDepth / 2) + 1,
    2,
    Math.max(2, Math.floor(Math.min(grid.width, grid.height) / 4)),
  );
  const verticalHall: PatternRect = {
    x: clamp(centerX - hallHalf, 1, Math.max(1, grid.width - hallWidth - 1)),
    y: hallMargin,
    width: hallWidth,
    height: Math.max(3, grid.height - hallMargin * 2),
  };
  const horizontalHall: PatternRect = {
    x: hallMargin,
    y: clamp(centerY - hallHalf, 1, Math.max(1, grid.height - hallWidth - 1)),
    width: Math.max(3, grid.width - hallMargin * 2),
    height: hallWidth,
  };

  fillPatternRect(
    grid.cells,
    grid.width,
    grid.height,
    verticalHall.x,
    verticalHall.y,
    verticalHall.width,
    verticalHall.height,
    0,
  );
  fillPatternRect(
    grid.cells,
    grid.width,
    grid.height,
    horizontalHall.x,
    horizontalHall.y,
    horizontalHall.width,
    horizontalHall.height,
    0,
  );

  const directions: Array<"N" | "E" | "S" | "W"> = ["N", "E", "S", "W"];
  shuffleInPlace(directions, rng);
  const selectedDirections = directions.slice(0, params.wingCount);
  for (const direction of selectedDirections) {
    const chamberBreadth = clamp(
      hallWidth + randomInt(rng, 2, Math.max(2, Math.floor(Math.min(grid.width, grid.height) / 4))),
      hallWidth + 1,
      Math.max(hallWidth + 1, Math.min(grid.width, grid.height) - 2),
    );

    if (direction === "N") {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        clamp(
          centerX - Math.floor(chamberBreadth / 2),
          1,
          Math.max(1, grid.width - chamberBreadth - 1),
        ),
        1,
        Math.min(chamberBreadth, grid.width - 2),
        Math.min(params.chamberDepth, verticalHall.y + hallWidth),
        0,
      );
    } else if (direction === "S") {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        clamp(
          centerX - Math.floor(chamberBreadth / 2),
          1,
          Math.max(1, grid.width - chamberBreadth - 1),
        ),
        Math.max(1, grid.height - params.chamberDepth - 1),
        Math.min(chamberBreadth, grid.width - 2),
        Math.min(params.chamberDepth, grid.height - 2),
        0,
      );
    } else if (direction === "W") {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        1,
        clamp(
          centerY - Math.floor(chamberBreadth / 2),
          1,
          Math.max(1, grid.height - chamberBreadth - 1),
        ),
        Math.min(params.chamberDepth, horizontalHall.x + hallWidth),
        Math.min(chamberBreadth, grid.height - 2),
        0,
      );
    } else {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        Math.max(1, grid.width - params.chamberDepth - 1),
        clamp(
          centerY - Math.floor(chamberBreadth / 2),
          1,
          Math.max(1, grid.height - chamberBreadth - 1),
        ),
        Math.min(params.chamberDepth, grid.width - 2),
        Math.min(chamberBreadth, grid.height - 2),
        0,
      );
    }
  }

  if (params.pillarSpacing > 0) {
    for (
      let y = horizontalHall.y + 1;
      y < horizontalHall.y + horizontalHall.height - 1;
      y += params.pillarSpacing
    ) {
      for (
        let x = horizontalHall.x + 1;
        x < horizontalHall.x + horizontalHall.width - 1;
        x += params.pillarSpacing
      ) {
        setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
      }
    }
    for (
      let y = verticalHall.y + 1;
      y < verticalHall.y + verticalHall.height - 1;
      y += params.pillarSpacing
    ) {
      for (
        let x = verticalHall.x + 1;
        x < verticalHall.x + verticalHall.width - 1;
        x += params.pillarSpacing
      ) {
        setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
      }
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildStripePlaidGeneratorMaskBytes(params: StripePlaidGeneratorParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  const spacing = Math.max(params.bandWidth + 1, params.spacing);
  const horizontalOffset = positiveModulo(
    params.offset + Math.floor(hashFloat(params.seed, 17, 29) * spacing),
    spacing,
  );
  const verticalOffset = positiveModulo(
    params.offset + Math.floor(hashFloat(params.seed, 31, 43) * spacing),
    spacing,
  );

  if (params.mode !== "vertical") {
    for (let y = horizontalOffset; y < grid.height; y += spacing) {
      fillPatternRect(grid.cells, grid.width, grid.height, 0, y, grid.width, params.bandWidth, 1);
    }
  }
  if (params.mode !== "horizontal") {
    for (let x = verticalOffset; x < grid.width; x += spacing) {
      fillPatternRect(grid.cells, grid.width, grid.height, x, 0, params.bandWidth, grid.height, 1);
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildCheckerDiamondLatticeMaskBytes(params: CheckerDiamondLatticeParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  const period = Math.max(2, params.cellSize * 2);
  const lineWidth = Math.min(params.lineWidth, params.cellSize);
  const phaseX = params.phase + Math.floor(hashFloat(params.seed, 13, 19) * period);
  const phaseY = params.phase + Math.floor(hashFloat(params.seed, 23, 37) * period);

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (params.style === "checker") {
        const cellX = Math.floor((x + phaseX) / params.cellSize);
        const cellY = Math.floor((y + phaseY) / params.cellSize);
        if ((cellX + cellY) % 2 === 0) {
          setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
        }
        continue;
      }

      if (params.style === "diamond") {
        const localX = positiveModulo(x + phaseX, period);
        const localY = positiveModulo(y + phaseY, period);
        const distance = Math.abs(localX - params.cellSize) + Math.abs(localY - params.cellSize);
        if (distance <= params.cellSize && distance >= params.cellSize - lineWidth + 1) {
          setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
        }
        continue;
      }

      const localX = positiveModulo(x + phaseX, params.cellSize);
      const localY = positiveModulo(y + phaseY, params.cellSize);
      if (
        localX < lineWidth ||
        localY < lineWidth ||
        localX >= params.cellSize - lineWidth ||
        localY >= params.cellSize - lineWidth
      ) {
        setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
      }
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildConcentricBoxesMaskBytes(params: ConcentricBoxesParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);

  for (let ring = 0; ring < params.ringCount; ring++) {
    const inset = ring * params.spacing;
    const shiftX = Math.round((hashFloat(params.seed, ring + 11, 17) * 2 - 1) * params.drift);
    const shiftY = Math.round((hashFloat(params.seed, ring + 23, 31) * 2 - 1) * params.drift);
    const leftInset = inset + Math.max(0, shiftX);
    const rightInset = inset + Math.max(0, -shiftX);
    const topInset = inset + Math.max(0, shiftY);
    const bottomInset = inset + Math.max(0, -shiftY);
    const rectWidth = grid.width - leftInset - rightInset;
    const rectHeight = grid.height - topInset - bottomInset;
    if (rectWidth < params.lineWidth * 2 + 1 || rectHeight < params.lineWidth * 2 + 1) break;

    strokePatternRect(
      grid.cells,
      grid.width,
      grid.height,
      leftInset,
      topInset,
      rectWidth,
      rectHeight,
      params.lineWidth,
      1,
    );
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildLineInterferenceMaskBytes(params: LineInterferenceParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  drawLineInterferenceField(
    grid.cells,
    grid.width,
    grid.height,
    params.angleA,
    params.spacing,
    params.strokeWidth,
    hashFloat(params.seed, 41, 53) * params.spacing,
  );
  drawLineInterferenceField(
    grid.cells,
    grid.width,
    grid.height,
    params.angleB,
    params.spacing,
    params.strokeWidth,
    hashFloat(params.seed, 67, 79) * params.spacing,
  );

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildCirclePackingMaskBytes(params: CirclePackingParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const maxAllowedRadius = Math.max(1, Math.floor((Math.min(grid.width, grid.height) - 1) / 2));
  const minRadius = Math.min(params.minRadius, maxAllowedRadius);
  const maxRadius = Math.max(minRadius, Math.min(params.maxRadius, maxAllowedRadius));
  const circles: Array<Readonly<{ x: number; y: number; radius: number }>> = [];

  for (
    let attempt = 0;
    attempt < params.circleCount * 40 && circles.length < params.circleCount;
    attempt++
  ) {
    const radius = randomInt(rng, minRadius, maxRadius);
    const x = randomInt(rng, radius, Math.max(radius, grid.width - 1 - radius));
    const y = randomInt(rng, radius, Math.max(radius, grid.height - 1 - radius));
    if (
      circles.some((circle) => {
        const dx = circle.x - x;
        const dy = circle.y - y;
        return dx * dx + dy * dy < (circle.radius + radius + 1) ** 2;
      })
    ) {
      continue;
    }
    circles.push({ x, y, radius });
  }

  if (circles.length === 0) {
    circles.push({
      x: Math.floor(grid.width / 2),
      y: Math.floor(grid.height / 2),
      radius: minRadius,
    });
  }

  for (const circle of circles) {
    stampPatternCircle(
      grid.cells,
      grid.width,
      grid.height,
      circle.x,
      circle.y,
      circle.radius,
      params.outline,
    );
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildDrunkWalkPainterMaskBytes(params: DrunkWalkPainterParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ] as const;

  for (let walkerIndex = 0; walkerIndex < params.walkerCount; walkerIndex++) {
    let x = randomInt(rng, 0, grid.width - 1);
    let y = randomInt(rng, 0, grid.height - 1);
    let directionIndex = randomInt(rng, 0, directions.length - 1);

    for (let step = 0; step < params.steps; step++) {
      stampSourceBrush(grid.cells, grid.width, grid.height, x, y, params.brushSize);
      if (rng() < params.roomChance) {
        const roomWidth = randomInt(
          rng,
          Math.max(2, params.brushSize + 1),
          Math.max(2, Math.min(grid.width, params.brushSize + 4)),
        );
        const roomHeight = randomInt(
          rng,
          Math.max(2, params.brushSize + 1),
          Math.max(2, Math.min(grid.height, params.brushSize + 4)),
        );
        fillPatternRect(
          grid.cells,
          grid.width,
          grid.height,
          x - Math.floor(roomWidth / 2),
          y - Math.floor(roomHeight / 2),
          roomWidth,
          roomHeight,
          1,
        );
      }

      if (rng() < 0.32 + params.roomChance * 0.5) {
        directionIndex = (directionIndex + randomInt(rng, 1, directions.length - 1)) % 4;
      }

      const stride = rng() < 0.18 ? 2 : 1;
      for (let strideStep = 0; strideStep < stride; strideStep++) {
        const direction = directions[directionIndex]!;
        x = clamp(x + direction.x, 0, grid.width - 1);
        y = clamp(y + direction.y, 0, grid.height - 1);
      }
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildParticleFlowFieldMaskBytes(params: ParticleFlowFieldParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);

  for (let agentIndex = 0; agentIndex < params.agentCount; agentIndex++) {
    let x = rng() * Math.max(1, grid.width - 1);
    let y = rng() * Math.max(1, grid.height - 1);

    for (let step = 0; step < params.steps; step++) {
      const angle = sampleParticleFlowAngle(params.seed, x, y, params.fieldScale, step);
      const nextX = wrapPatternCoordinateFloat(x + Math.cos(angle) * 1.2, grid.width);
      const nextY = wrapPatternCoordinateFloat(y + Math.sin(angle) * 1.2, grid.height);
      drawSourceLine(grid.cells, grid.width, grid.height, x, y, nextX, nextY, params.strokeWidth);
      x = nextX;
      y = nextY;
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildStampBrushGeneratorMaskBytes(params: StampBrushGeneratorParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const columns = Math.max(1, Math.round(Math.sqrt(params.stampCount)));
  const rows = Math.max(1, Math.ceil(params.stampCount / columns));
  const spacingX = Math.max(2, Math.floor(grid.width / columns));
  const spacingY = Math.max(2, Math.floor(grid.height / rows));

  for (let stampIndex = 0; stampIndex < params.stampCount; stampIndex++) {
    const column = stampIndex % columns;
    const row = Math.floor(stampIndex / columns);
    const baseX = Math.floor((column + 0.5) * spacingX);
    const baseY = Math.floor((row + 0.5) * spacingY);
    const x = clamp(
      baseX + randomInt(rng, -params.scatter, params.scatter),
      0,
      Math.max(0, grid.width - 1),
    );
    const y = clamp(
      baseY + randomInt(rng, -params.scatter, params.scatter),
      0,
      Math.max(0, grid.height - 1),
    );
    const type =
      params.stampType === "mixed"
        ? sampleOne(rng, ["square", "circle", "cross", "bar"] as const)
        : params.stampType;
    const size = clamp(
      params.stampSize + randomInt(rng, -1, 1),
      STAMP_BRUSH_SIZE_MIN,
      STAMP_BRUSH_SIZE_MAX,
    );

    if (type === "square") {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        x - size,
        y - size,
        size * 2 + 1,
        size * 2 + 1,
        1,
      );
    } else if (type === "circle") {
      stampPatternCircle(grid.cells, grid.width, grid.height, x, y, size, false);
    } else if (type === "cross") {
      stampPatternCross(grid.cells, grid.width, grid.height, x, y, size, 1, 1);
    } else {
      stampPatternBar(
        grid.cells,
        grid.width,
        grid.height,
        x,
        y,
        size * 3 + 1,
        Math.max(1, Math.ceil(size / 2)),
        rng() < 0.5,
        1,
      );
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildCutoutCollageMaskBytes(params: CutoutCollageParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const insetX = Math.max(1, Math.floor(grid.width * (0.12 + rng() * 0.12)));
  const insetY = Math.max(1, Math.floor(grid.height * (0.12 + rng() * 0.12)));
  fillPatternRect(
    grid.cells,
    grid.width,
    grid.height,
    insetX,
    insetY,
    Math.max(2, grid.width - insetX * 2),
    Math.max(2, grid.height - insetY * 2),
    1,
  );

  for (let shapeIndex = 0; shapeIndex < params.shapeCount; shapeIndex++) {
    const value: 0 | 1 = shapeIndex < 2 || rng() >= params.subtractChance ? 1 : 0;
    const width = randomInt(rng, params.minSize, params.maxSize);
    const height = randomInt(rng, params.minSize, params.maxSize);
    const x = randomInt(rng, 0, Math.max(0, grid.width - 1));
    const y = randomInt(rng, 0, Math.max(0, grid.height - 1));
    const primitive = randomInt(rng, 0, 3);

    if (primitive === 0) {
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        x - Math.floor(width / 2),
        y - Math.floor(height / 2),
        width,
        height,
        value,
      );
    } else if (primitive === 1) {
      stampPatternCircleValue(
        grid.cells,
        grid.width,
        grid.height,
        x,
        y,
        Math.max(1, Math.floor((width + height) / 4)),
        value,
      );
    } else if (primitive === 2) {
      stampPatternDiamond(
        grid.cells,
        grid.width,
        grid.height,
        x,
        y,
        Math.max(1, Math.floor((width + height) / 4)),
        value,
      );
    } else {
      stampPatternBar(
        grid.cells,
        grid.width,
        grid.height,
        x,
        y,
        Math.max(width, height) * 2 + 1,
        Math.max(1, Math.min(width, height)),
        rng() < 0.5,
        value,
      );
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildGlitchBlocksMaskBytes(params: GlitchBlocksParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);

  for (let bandIndex = 0; bandIndex < params.bandCount; bandIndex++) {
    const horizontal = rng() < 0.65;
    const thickness = randomInt(rng, 1, Math.max(1, params.cellSize));
    const offset = randomInt(rng, -params.offsetRange, params.offsetRange);

    if (horizontal) {
      const y = randomInt(rng, 0, Math.max(0, grid.height - 1));
      for (let x = 0; x < grid.width; x += params.cellSize) {
        if (rng() > params.stripeChance) continue;
        const segmentWidth = randomInt(
          rng,
          Math.max(1, params.cellSize),
          Math.max(1, params.cellSize * 3),
        );
        fillPatternRect(
          grid.cells,
          grid.width,
          grid.height,
          x + offset,
          y,
          segmentWidth,
          thickness,
          1,
        );
      }
    } else {
      const x = randomInt(rng, 0, Math.max(0, grid.width - 1));
      for (let y = 0; y < grid.height; y += params.cellSize) {
        if (rng() > params.stripeChance) continue;
        const segmentHeight = randomInt(
          rng,
          Math.max(1, params.cellSize),
          Math.max(1, params.cellSize * 3),
        );
        fillPatternRect(
          grid.cells,
          grid.width,
          grid.height,
          x,
          y + offset,
          thickness,
          segmentHeight,
          1,
        );
      }
    }

    if (rng() < 0.45) {
      const blockWidth = randomInt(
        rng,
        params.cellSize,
        Math.max(params.cellSize, params.cellSize * 3),
      );
      const blockHeight = randomInt(
        rng,
        params.cellSize,
        Math.max(params.cellSize, params.cellSize * 3),
      );
      fillPatternRect(
        grid.cells,
        grid.width,
        grid.height,
        randomInt(rng, 0, Math.max(0, grid.width - 1)),
        randomInt(rng, 0, Math.max(0, grid.height - 1)),
        blockWidth,
        blockHeight,
        1,
      );
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildGameOfLifeVariantsMaskBytes(params: GameOfLifeVariantsParameters): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  let current = new Uint8Array(grid.width * grid.height);
  for (let index = 0; index < current.length; index++) {
    current[index] = rng() < params.density ? 1 : 0;
  }

  for (let step = 0; step < params.steps; step++) {
    const next = new Uint8Array(current.length);
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const neighbors = countPatternNeighbors(current, grid.width, grid.height, x, y);
        const alive = current[y * grid.width + x] === 1;
        let survives = false;
        let born = false;
        if (params.variant === "life") {
          survives = neighbors === 2 || neighbors === 3;
          born = neighbors === 3;
        } else if (params.variant === "highlife") {
          survives = neighbors === 2 || neighbors === 3;
          born = neighbors === 3 || neighbors === 6;
        } else {
          survives = neighbors >= 1 && neighbors <= 5;
          born = neighbors === 3;
        }
        next[y * grid.width + x] = alive ? (survives ? 1 : 0) : born ? 1 : 0;
      }
    }
    current = next;
  }

  const bytes = expandPatternCellsToMaskBytes(current, grid.width, grid.height, params.blockSize);
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildDiffusionLimitedAggregationMaskBytes(
  params: DiffusionLimitedAggregationParameters,
): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const centerX = Math.floor(grid.width / 2);
  const centerY = Math.floor(grid.height / 2);
  if (params.seedMode === "point") {
    setPatternCell(grid.cells, grid.width, grid.height, centerX, centerY, 1);
  } else if (params.seedMode === "line") {
    for (
      let y = Math.max(0, centerY - Math.floor(grid.height / 4));
      y <= Math.min(grid.height - 1, centerY + Math.floor(grid.height / 4));
      y++
    ) {
      setPatternCell(grid.cells, grid.width, grid.height, centerX, y, 1);
    }
  } else {
    for (
      let y = Math.max(0, centerY - Math.floor(grid.height / 5));
      y <= Math.min(grid.height - 1, centerY + Math.floor(grid.height / 5));
      y++
    ) {
      setPatternCell(grid.cells, grid.width, grid.height, centerX, y, 1);
    }
    for (
      let x = Math.max(0, centerX - Math.floor(grid.width / 5));
      x <= Math.min(grid.width - 1, centerX + Math.floor(grid.width / 5));
      x++
    ) {
      setPatternCell(grid.cells, grid.width, grid.height, x, centerY, 1);
    }
  }

  const stepLimit = Math.max(32, grid.width * grid.height * 4);
  for (let walkerIndex = 0; walkerIndex < params.walkers; walkerIndex++) {
    let { x, y } = randomPatternEdgePoint(grid.width, grid.height, rng);
    for (let step = 0; step < stepLimit; step++) {
      if (
        grid.cells[y * grid.width + x] !== 1 &&
        hasAdjacentPatternValue(grid.cells, grid.width, grid.height, x, y, 1) &&
        rng() <= params.stickiness
      ) {
        setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
        break;
      }
      const direction = randomInt(rng, 0, 3);
      if (direction === 0) x = clamp(x + 1, 0, grid.width - 1);
      else if (direction === 1) x = clamp(x - 1, 0, grid.width - 1);
      else if (direction === 2) y = clamp(y + 1, 0, grid.height - 1);
      else y = clamp(y - 1, 0, grid.height - 1);
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildReactionDiffusionApproximationMaskBytes(
  params: ReactionDiffusionApproximationParameters,
): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  const size = grid.width * grid.height;
  let a = new Float32Array(size);
  let b = new Float32Array(size);
  a.fill(1);

  for (let index = 0; index < params.spotCount; index++) {
    const radius = randomInt(
      rng,
      1,
      Math.max(1, Math.floor(Math.min(grid.width, grid.height) / 8)),
    );
    const centerX = randomInt(rng, radius, Math.max(radius, grid.width - radius - 1));
    const centerY = randomInt(rng, radius, Math.max(radius, grid.height - radius - 1));
    stampFloatCircle(a, b, grid.width, grid.height, centerX, centerY, radius);
  }

  const steps = params.iterations * 4;
  const nextA = new Float32Array(size);
  const nextB = new Float32Array(size);
  for (let step = 0; step < steps; step++) {
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const index = y * grid.width + x;
        const lapA = laplacianAt(a, grid.width, grid.height, x, y);
        const lapB = laplacianAt(b, grid.width, grid.height, x, y);
        const cellA = a[index]!;
        const cellB = b[index]!;
        const reaction = cellA * cellB * cellB;
        nextA[index] = clamp01(cellA + (0.95 * lapA - reaction + params.feed * (1 - cellA)));
        nextB[index] = clamp01(
          cellB + (0.45 * lapB + reaction - (params.kill + params.feed) * cellB),
        );
      }
    }
    [a, b] = [nextA.slice(), nextB.slice()];
  }

  const cells = new Uint8Array(size);
  for (let index = 0; index < size; index++) {
    cells[index] = b[index]! > 0.22 ? 1 : 0;
  }
  const bytes = expandPatternCellsToMaskBytes(cells, grid.width, grid.height, params.blockSize);
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildVoronoiRegionCarverMaskBytes(params: VoronoiRegionCarverParameters): Uint8Array {
  const grid = createPatternSourceGrid(params.blockSize);
  const sites: Array<Readonly<{ x: number; y: number }>> = [];
  for (let index = 0; index < params.siteCount; index++) {
    sites.push({
      x: Math.floor(hashFloat(params.seed + 17, index, params.siteCount) * grid.width),
      y: Math.floor(hashFloat(params.seed + 31, params.siteCount, index) * grid.height),
    });
  }

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      let nearest = Number.POSITIVE_INFINITY;
      let second = Number.POSITIVE_INFINITY;
      for (let index = 0; index < sites.length; index++) {
        const site = sites[index]!;
        const dx = x + (hashFloat(params.seed + 53, x, index) * 2 - 1) * params.jitter - site.x;
        const dy = y + (hashFloat(params.seed + 71, y, index) * 2 - 1) * params.jitter - site.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearest) {
          second = nearest;
          nearest = distance;
        } else if (distance < second) {
          second = distance;
        }
      }
      if (second - nearest <= params.ridgeWidth) {
        setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
      }
    }
  }

  const bytes = expandPatternCellsToMaskBytes(
    grid.cells,
    grid.width,
    grid.height,
    params.blockSize,
  );
  return params.invert ? invertMaskBytes(bytes) : bytes;
}

function buildErosionDilationPipelineMaskBytes(
  params: ErosionDilationPipelineParameters,
): Uint8Array {
  const rng = createSeededRandom(params.seed);
  const grid = createPatternSourceGrid(params.blockSize);
  let current: Uint8Array = new Uint8Array(grid.width * grid.height);
  for (let index = 0; index < current.length; index++) {
    current[index] = rng() < params.density ? 1 : 0;
  }

  for (let step = 0; step < params.growSteps; step++) {
    current = dilatePatternCells(current, grid.width, grid.height);
  }
  for (let step = 0; step < params.shrinkSteps; step++) {
    current = erodePatternCells(current, grid.width, grid.height);
  }

  const smoothed = new Uint8Array(current.length);
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const neighbors = countPatternNeighbors(current, grid.width, grid.height, x, y);
      const index = y * grid.width + x;
      smoothed[index] = neighbors >= 4 || (current[index] === 1 && neighbors >= 2) ? 1 : 0;
    }
  }
  current = smoothed;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const index = y * grid.width + x;
      if (current[index] !== 1) continue;
      const neighbors = countPatternNeighbors(current, grid.width, grid.height, x, y);
      if (neighbors >= 5 && rng() < params.punctureChance) current[index] = 0;
    }
  }

  const bytes = expandPatternCellsToMaskBytes(current, grid.width, grid.height, params.blockSize);
  return params.invert ? invertMaskBytes(bytes) : bytes;
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
  const width = activeGeneratedContentSize.width;
  const height = activeGeneratedContentSize.height;
  const walls = createFilledMazeWalls();

  fillRect(walls, 0, 0, width, 1);
  fillRect(walls, 0, height - 1, width, 1);
  fillRect(walls, 0, 0, 1, height);
  fillRect(walls, width - 1, 0, 1, height);

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
  return [densityLabel, blockLabel, mirrorLabel].join(" • ");
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

function buildRadialSymmetrySummary(params: RadialSymmetryParameters): string {
  return buildOrnamentSummary(
    [
      `${params.folds} folds`,
      `${params.rings} rings`,
      `${Math.round(params.twist * 100)}% twist`,
      `${Math.round(params.thickness * 100)}% band`,
    ],
    params,
  );
}

function buildKaleidoscopeSummary(params: KaleidoscopeParameters): string {
  return buildOrnamentSummary(
    [
      `${params.segments} segments`,
      `${formatNoiseScale(params.scale)} scale`,
      `${Math.round(params.threshold * 100)}% threshold`,
    ],
    params,
  );
}

function buildLSystemTurtleSummary(params: LSystemTurtleParameters): string {
  return buildOrnamentSummary(
    [
      params.preset,
      `${params.iterations} iterations`,
      `${params.turnAngle}° turn`,
      `${params.strokeWidth}px stroke`,
    ],
    params,
  );
}

function buildRoseCurvesSummary(params: RoseCurvesParameters): string {
  return buildOrnamentSummary(
    [
      `${params.petals} petals`,
      `${params.harmonic} harmonic`,
      `${params.rotation}° rotate`,
      `${params.strokeWidth}px stroke`,
    ],
    params,
  );
}

function buildTileableMotifRepeaterSummary(params: TileableMotifRepeaterParameters): string {
  return buildOrnamentSummary(
    [
      params.motif,
      `${params.spacing} spacing`,
      `${params.motifSize} size`,
      `${params.jitter} jitter`,
    ],
    params,
  );
}

function buildBspRoomPartitionerSummary(params: BspRoomPartitionerParameters): string {
  return buildArchitectureSummary(
    [
      `${params.splitDepth} splits`,
      `${params.roomPadding} pad`,
      `${params.corridorWidth}-wide halls`,
    ],
    params,
  );
}

function buildCorridorGridSummary(params: CorridorGridParameters): string {
  return buildArchitectureSummary(
    [
      `${params.columnSpacing}x${params.rowSpacing} grid`,
      `${params.wallThickness}-wide walls`,
      `${Math.round(params.gapChance * 100)}% doors`,
    ],
    params,
  );
}

function buildRoomScatterSummary(params: RoomScatterParameters): string {
  return buildArchitectureSummary(
    [
      `${params.roomCount} rooms`,
      `${params.roomSize} max span`,
      `${Math.round(params.connectorChance * 100)}% connectors`,
    ],
    params,
  );
}

function buildCourtyardGeneratorSummary(params: CourtyardGeneratorParameters): string {
  return buildArchitectureSummary(
    [`${params.ringCount} rings`, `${params.ringGap} gap`, `${params.gateWidth}-wide gates`],
    params,
  );
}

function buildBlueprintGeneratorSummary(params: BlueprintGeneratorParameters): string {
  return buildArchitectureSummary(
    [
      `${params.wingCount} wings`,
      `${params.hallWidth}-wide hall`,
      params.pillarSpacing > 0 ? `${params.pillarSpacing} pillar spacing` : "no pillars",
    ],
    params,
  );
}

function buildStripePlaidGeneratorSummary(params: StripePlaidGeneratorParameters): string {
  return buildPatternedGeometricSummary(
    [
      formatStripePlaidModeLabel(params.mode),
      `${params.spacing} spacing`,
      `${params.bandWidth}-wide bands`,
      `${params.offset} offset`,
    ],
    params,
  );
}

function buildCheckerDiamondLatticeSummary(params: CheckerDiamondLatticeParameters): string {
  return buildPatternedGeometricSummary(
    [
      formatCheckerDiamondLatticeStyleLabel(params.style),
      `${params.cellSize} cell`,
      `${params.lineWidth}px line`,
      `${params.phase} phase`,
    ],
    params,
  );
}

function buildConcentricBoxesSummary(params: ConcentricBoxesParameters): string {
  return buildPatternedGeometricSummary(
    [
      `${params.ringCount} rings`,
      `${params.spacing} gap`,
      `${params.lineWidth}px line`,
      `${params.drift} drift`,
    ],
    params,
  );
}

function buildLineInterferenceSummary(params: LineInterferenceParameters): string {
  return buildPatternedGeometricSummary(
    [
      `${params.angleA}° / ${params.angleB}°`,
      `${params.spacing} spacing`,
      `${params.strokeWidth}px stroke`,
    ],
    params,
  );
}

function buildCirclePackingSummary(params: CirclePackingParameters): string {
  return buildPatternedGeometricSummary(
    [
      `${params.circleCount} circles`,
      `${params.minRadius}-${params.maxRadius} radius`,
      params.outline ? "outline" : "filled",
    ],
    params,
  );
}

function buildDrunkWalkPainterSummary(params: DrunkWalkPainterParameters): string {
  return buildChaoticProceduralSummary(
    [
      `${params.walkerCount} walkers`,
      `${params.steps} steps`,
      `${params.brushSize}px brush`,
      `${Math.round(params.roomChance * 100)}% rooms`,
    ],
    params,
  );
}

function buildParticleFlowFieldSummary(params: ParticleFlowFieldParameters): string {
  return buildChaoticProceduralSummary(
    [
      `${params.agentCount} agents`,
      `${params.steps} steps`,
      `${formatNoiseScale(params.fieldScale)} scale`,
      `${params.strokeWidth}px stroke`,
    ],
    params,
  );
}

function buildStampBrushGeneratorSummary(params: StampBrushGeneratorParameters): string {
  return buildChaoticProceduralSummary(
    [
      formatStampBrushTypeLabel(params.stampType),
      `${params.stampCount} stamps`,
      `${params.stampSize} size`,
      `${params.scatter} scatter`,
    ],
    params,
  );
}

function buildCutoutCollageSummary(params: CutoutCollageParameters): string {
  return buildChaoticProceduralSummary(
    [
      `${params.shapeCount} shapes`,
      `${params.minSize}-${params.maxSize} size`,
      `${Math.round(params.subtractChance * 100)}% subtract`,
    ],
    params,
  );
}

function buildGlitchBlocksSummary(params: GlitchBlocksParameters): string {
  return buildChaoticProceduralSummary(
    [
      `${params.bandCount} bands`,
      `${params.offsetRange} offset`,
      `${Math.round(params.stripeChance * 100)}% stripe`,
      `${params.cellSize} cell`,
    ],
    params,
  );
}

function buildNoiseTerrainSummary(parts: string[], params: NoiseTerrainBaseParameters): string {
  return [
    `${params.blockSize}x${params.blockSize} blocks`,
    ...parts,
    `${Math.round(params.threshold * 100)}% threshold`,
  ].join(" • ");
}

function buildOrnamentSummary(parts: string[], params: OrnamentBaseParameters): string {
  return [`${params.blockSize}x${params.blockSize} blocks`, ...parts].join(" • ");
}

function buildArchitectureSummary(parts: string[], params: ArchitectureBaseParameters): string {
  return [`${params.blockSize}x${params.blockSize} blocks`, ...parts].join(" • ");
}

function buildPatternedGeometricSummary(
  parts: string[],
  params: PatternedGeometricBaseParameters,
): string {
  return [`${params.blockSize}x${params.blockSize} blocks`, ...parts].join(" • ");
}

function buildChaoticProceduralSummary(
  parts: string[],
  params: ChaoticProceduralBaseParameters,
): string {
  return [`${params.blockSize}x${params.blockSize} blocks`, ...parts].join(" • ");
}

function buildGrowthSummary(parts: string[], params: GrowthBaseParameters): string {
  return [`${params.blockSize}x${params.blockSize} blocks`, ...parts].join(" • ");
}

function buildGameOfLifeVariantsSummary(params: GameOfLifeVariantsParameters): string {
  return buildGrowthSummary(
    [params.variant, `${Math.round(params.density * 100)}% seed`, `${params.steps} steps`],
    params,
  );
}

function buildDiffusionLimitedAggregationSummary(
  params: DiffusionLimitedAggregationParameters,
): string {
  return buildGrowthSummary(
    [params.seedMode, `${params.walkers} walkers`, `${Math.round(params.stickiness * 100)}% stick`],
    params,
  );
}

function buildReactionDiffusionApproximationSummary(
  params: ReactionDiffusionApproximationParameters,
): string {
  return buildGrowthSummary(
    [
      `${params.spotCount} spots`,
      `${params.iterations} iter`,
      `${params.feed.toFixed(3)} feed`,
      `${params.kill.toFixed(3)} kill`,
    ],
    params,
  );
}

function buildVoronoiRegionCarverSummary(params: VoronoiRegionCarverParameters): string {
  return buildGrowthSummary(
    [
      `${params.siteCount} sites`,
      `${formatCompactDecimal(params.ridgeWidth)} ridge`,
      `${Math.round(params.jitter * 100)}% jitter`,
    ],
    params,
  );
}

function buildErosionDilationPipelineSummary(params: ErosionDilationPipelineParameters): string {
  return buildGrowthSummary(
    [
      `${Math.round(params.density * 100)}% seed`,
      `${params.growSteps} grow`,
      `${params.shrinkSteps} shrink`,
      `${Math.round(params.punctureChance * 100)}% puncture`,
    ],
    params,
  );
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
    grid: wallGridFromMaskBytes(wallMaskBytesFromKey(wallKey)),
    algorithm: "starred",
    title: "Starred Layout",
    summary: "Saved locally from Generate",
    seedLabel: "Saved locally",
    inverted: false,
    params: null,
  };
}

function frameGeneratedLayoutRecord(
  record: GeneratedLayoutRecord,
  contentSize: GeneratedContentSize,
  layoutWidth: number,
  layoutHeight: number,
  invert: boolean,
): GeneratedLayoutRecord {
  if (record.algorithm === "starred" || !record.wallKey) return record;

  const sourceGrid = wallGridFromMaskBytes(
    wallMaskBytesFromKey(record.wallKey),
    contentSize.width,
    contentSize.height,
  );
  const grid = invert ? invertWallGrid(sourceGrid) : sourceGrid;
  const framedBytes = frameGeneratedGridToMaskBytes(grid, layoutWidth, layoutHeight);
  return {
    ...record,
    grid,
    inverted: invert,
    wallKey: wallMaskKeyFromBytes(framedBytes),
  };
}

function frameGeneratedGridToMaskBytes(
  grid: WallGrid,
  layoutWidth: number,
  layoutHeight: number,
): Uint8Array {
  const outerWidth = sanitizeGeneratedLayoutSize(layoutWidth);
  const outerHeight = sanitizeGeneratedLayoutSize(layoutHeight);
  const contentWidth = Math.min(grid.width, Math.max(1, outerWidth - 2));
  const contentHeight = Math.min(grid.height, Math.max(1, outerHeight - 2));
  const offsetX = Math.floor((GENERATED_LAYOUT_GRID_SIZE - outerWidth) / 2);
  const offsetY = Math.floor((GENERATED_LAYOUT_GRID_SIZE - outerHeight) / 2);
  const bytes = new Uint8Array(128);

  for (let y = 0; y < outerHeight; y++) {
    for (let x = 0; x < outerWidth; x++) {
      const targetX = offsetX + x;
      const targetY = offsetY + y;
      const isBorder = x === 0 || y === 0 || x === outerWidth - 1 || y === outerHeight - 1;
      if (isBorder) {
        setMaskBit(bytes, targetY * GENERATED_LAYOUT_GRID_SIZE + targetX);
        continue;
      }

      const sourceX = x - 1;
      const sourceY = y - 1;
      if (sourceX >= contentWidth || sourceY >= contentHeight) continue;
      if (grid.cells[sourceY * grid.width + sourceX] !== 1) continue;
      setMaskBit(bytes, targetY * GENERATED_LAYOUT_GRID_SIZE + targetX);
    }
  }

  return bytes;
}

function buildScalarPatternMaskBytes(
  blockSize: number,
  isFilled: (sampleX: number, sampleY: number) => boolean,
): Uint8Array {
  const grid = createPatternSourceGrid(blockSize);

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const sampleX = (x + 0.5) / grid.width;
      const sampleY = (y + 0.5) / grid.height;
      if (!isFilled(sampleX, sampleY)) continue;
      setPatternCell(grid.cells, grid.width, grid.height, x, y, 1);
    }
  }

  return expandPatternCellsToMaskBytes(grid.cells, grid.width, grid.height, blockSize);
}

function createPatternSourceGrid(
  blockSize: number,
): Readonly<{ cells: Uint8Array; width: number; height: number }> {
  const width = Math.ceil(activeGeneratedContentSize.width / blockSize);
  const height = Math.ceil(activeGeneratedContentSize.height / blockSize);
  return {
    cells: new Uint8Array(width * height),
    width,
    height,
  };
}

type PatternRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

function createFilledPatternSourceGrid(
  blockSize: number,
): Readonly<{ cells: Uint8Array; width: number; height: number }> {
  const grid = createPatternSourceGrid(blockSize);
  grid.cells.fill(1);
  return grid;
}

function expandPatternCellsToMaskBytes(
  cells: Uint8Array,
  width: number,
  height: number,
  blockSize: number,
): Uint8Array {
  const bytes = new Uint8Array(128);
  for (let y = 0; y < activeGeneratedContentSize.height; y++) {
    for (let x = 0; x < activeGeneratedContentSize.width; x++) {
      const sourceX = Math.min(width - 1, Math.floor(x / blockSize));
      const sourceY = Math.min(height - 1, Math.floor(y / blockSize));
      if (cells[sourceY * width + sourceX] !== 1) continue;
      setMaskBit(bytes, y * GENERATED_LAYOUT_GRID_SIZE + x);
    }
  }
  return bytes;
}

function fillPatternRect(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  value: 0 | 1,
): void {
  const startX = clamp(Math.floor(x), 0, width);
  const startY = clamp(Math.floor(y), 0, height);
  const endX = clamp(Math.floor(x + rectWidth), 0, width);
  const endY = clamp(Math.floor(y + rectHeight), 0, height);
  for (let drawY = startY; drawY < endY; drawY++) {
    for (let drawX = startX; drawX < endX; drawX++) {
      cells[drawY * width + drawX] = value;
    }
  }
}

function strokePatternRect(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  strokeWidth: number,
  value: 0 | 1,
): void {
  if (rectWidth <= 0 || rectHeight <= 0) return;
  const thickness = Math.max(1, Math.min(strokeWidth, rectWidth, rectHeight));
  fillPatternRect(cells, width, height, x, y, rectWidth, thickness, value);
  fillPatternRect(cells, width, height, x, y + rectHeight - thickness, rectWidth, thickness, value);
  fillPatternRect(cells, width, height, x, y, thickness, rectHeight, value);
  fillPatternRect(cells, width, height, x + rectWidth - thickness, y, thickness, rectHeight, value);
}

function carvePatternCorridor(
  cells: Uint8Array,
  width: number,
  height: number,
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
  corridorWidth: number,
  rng: () => number,
): void {
  const thickness = Math.max(1, corridorWidth);
  const half = Math.floor(thickness / 2);
  if (rng() < 0.5) {
    fillPatternRect(
      cells,
      width,
      height,
      Math.min(from.x, to.x),
      from.y - half,
      Math.abs(to.x - from.x) + 1,
      thickness,
      0,
    );
    fillPatternRect(
      cells,
      width,
      height,
      to.x - half,
      Math.min(from.y, to.y),
      thickness,
      Math.abs(to.y - from.y) + 1,
      0,
    );
    return;
  }
  fillPatternRect(
    cells,
    width,
    height,
    from.x - half,
    Math.min(from.y, to.y),
    thickness,
    Math.abs(to.y - from.y) + 1,
    0,
  );
  fillPatternRect(
    cells,
    width,
    height,
    Math.min(from.x, to.x),
    to.y - half,
    Math.abs(to.x - from.x) + 1,
    thickness,
    0,
  );
}

function patternRectCenter(rect: PatternRect): Readonly<{ x: number; y: number }> {
  return {
    x: rect.x + Math.floor(rect.width / 2),
    y: rect.y + Math.floor(rect.height / 2),
  };
}

function rectsOverlapWithGap(first: PatternRect, second: PatternRect, gap: number): boolean {
  return !(
    first.x + first.width + gap <= second.x ||
    second.x + second.width + gap <= first.x ||
    first.y + first.height + gap <= second.y ||
    second.y + second.height + gap <= first.y
  );
}

function rectCenterDistance(first: PatternRect, second: PatternRect): number {
  const firstCenter = patternRectCenter(first);
  const secondCenter = patternRectCenter(second);
  return Math.abs(firstCenter.x - secondCenter.x) + Math.abs(firstCenter.y - secondCenter.y);
}

function countPatternNeighbors(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
): number {
  let count = 0;
  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      if (offsetX === 0 && offsetY === 0) continue;
      const sampleX = x + offsetX;
      const sampleY = y + offsetY;
      if (sampleX < 0 || sampleX >= width || sampleY < 0 || sampleY >= height) continue;
      if (cells[sampleY * width + sampleX] === 1) count++;
    }
  }
  return count;
}

function hasAdjacentPatternValue(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  value: 0 | 1,
): boolean {
  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      if (offsetX === 0 && offsetY === 0) continue;
      const sampleX = x + offsetX;
      const sampleY = y + offsetY;
      if (sampleX < 0 || sampleX >= width || sampleY < 0 || sampleY >= height) continue;
      if (cells[sampleY * width + sampleX] === value) return true;
    }
  }
  return false;
}

function randomPatternEdgePoint(
  width: number,
  height: number,
  rng: () => number,
): Readonly<{ x: number; y: number }> {
  const edge = randomInt(rng, 0, 3);
  if (edge === 0) return { x: randomInt(rng, 0, width - 1), y: 0 };
  if (edge === 1) return { x: randomInt(rng, 0, width - 1), y: height - 1 };
  if (edge === 2) return { x: 0, y: randomInt(rng, 0, height - 1) };
  return { x: width - 1, y: randomInt(rng, 0, height - 1) };
}

function stampFloatCircle(
  a: Float32Array,
  b: Float32Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  const radiusSq = radius * radius;
  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy > radiusSq) continue;
      const index = y * width + x;
      a[index] = 0;
      b[index] = 1;
    }
  }
}

function laplacianAt(
  values: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
): number {
  const center = values[y * width + x] ?? 0;
  let sum = -center;
  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      if (offsetX === 0 && offsetY === 0) continue;
      const sampleX = clamp(x + offsetX, 0, width - 1);
      const sampleY = clamp(y + offsetY, 0, height - 1);
      const weight = offsetX === 0 || offsetY === 0 ? 0.2 : 0.05;
      sum += (values[sampleY * width + sampleX] ?? 0) * weight;
    }
  }
  return sum;
}

function dilatePatternCells(cells: Uint8Array, width: number, height: number): Uint8Array {
  const next = new Uint8Array(cells.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      next[index] =
        cells[index] === 1 || hasAdjacentPatternValue(cells, width, height, x, y, 1) ? 1 : 0;
    }
  }
  return next;
}

function erodePatternCells(cells: Uint8Array, width: number, height: number): Uint8Array {
  const next = new Uint8Array(cells.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      next[index] =
        cells[index] === 1 && countPatternNeighbors(cells, width, height, x, y) >= 4 ? 1 : 0;
    }
  }
  return next;
}

function setPatternCell(
  cells: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  value: 0 | 1,
): void {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  cells[y * width + x] = value;
}

function drawSourceLine(
  cells: Uint8Array,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  strokeWidth: number,
): void {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 3));
  for (let index = 0; index <= steps; index++) {
    const amount = index / steps;
    const x = lerp(x0, x1, amount);
    const y = lerp(y0, y1, amount);
    stampSourceBrush(cells, width, height, x, y, strokeWidth);
  }
}

function stampSourceBrush(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  strokeWidth: number,
): void {
  const radius = Math.max(0, Math.floor((strokeWidth - 1) / 2));
  const roundedX = Math.round(centerX);
  const roundedY = Math.round(centerY);

  for (let offsetY = -radius; offsetY <= radius; offsetY++) {
    for (let offsetX = -radius; offsetX <= radius; offsetX++) {
      setPatternCell(cells, width, height, roundedX + offsetX, roundedY + offsetY, 1);
    }
  }

  if (radius === 0) {
    setPatternCell(cells, width, height, roundedX, roundedY, 1);
  }
}

function drawLineInterferenceField(
  cells: Uint8Array,
  width: number,
  height: number,
  angleDegrees: number,
  spacing: number,
  strokeWidth: number,
  phase: number,
): void {
  const angle = (angleDegrees * Math.PI) / 180;
  const directionX = Math.cos(angle);
  const directionY = Math.sin(angle);
  const normalX = -directionY;
  const normalY = directionX;
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;
  const lineLength = Math.hypot(width, height) * 2;
  const offsetRange = Math.hypot(width, height);

  for (let offset = -offsetRange; offset <= offsetRange; offset += Math.max(1, spacing)) {
    const shiftedOffset = offset + phase;
    const lineCenterX = centerX + normalX * shiftedOffset;
    const lineCenterY = centerY + normalY * shiftedOffset;
    drawSourceLine(
      cells,
      width,
      height,
      lineCenterX - directionX * lineLength,
      lineCenterY - directionY * lineLength,
      lineCenterX + directionX * lineLength,
      lineCenterY + directionY * lineLength,
      strokeWidth,
    );
  }
}

function stampPatternCircle(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  outline: boolean,
): void {
  const radiusSq = radius * radius;
  const innerRadius = Math.max(0, radius - 1);
  const innerRadiusSq = innerRadius * innerRadius;

  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const dx = x - centerX;
      const dy = y - centerY;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq > radiusSq) continue;
      if (outline && distanceSq < innerRadiusSq) continue;
      setPatternCell(cells, width, height, x, y, 1);
    }
  }
}

function stampPatternCircleValue(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  value: 0 | 1,
): void {
  const radiusSq = radius * radius;

  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy > radiusSq) continue;
      setPatternCell(cells, width, height, x, y, value);
    }
  }
}

function stampPatternDiamond(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  value: 0 | 1,
): void {
  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (Math.abs(x - centerX) + Math.abs(y - centerY) > radius) continue;
      setPatternCell(cells, width, height, x, y, value);
    }
  }
}

function stampPatternCross(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  value: 0 | 1,
): void {
  const lineThickness = Math.max(1, thickness);
  fillPatternRect(
    cells,
    width,
    height,
    centerX - radius,
    centerY - Math.floor(lineThickness / 2),
    radius * 2 + 1,
    lineThickness,
    value,
  );
  fillPatternRect(
    cells,
    width,
    height,
    centerX - Math.floor(lineThickness / 2),
    centerY - radius,
    lineThickness,
    radius * 2 + 1,
    value,
  );
}

function stampPatternBar(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  length: number,
  thickness: number,
  horizontal: boolean,
  value: 0 | 1,
): void {
  if (horizontal) {
    fillPatternRect(
      cells,
      width,
      height,
      centerX - Math.floor(length / 2),
      centerY - Math.floor(thickness / 2),
      length,
      thickness,
      value,
    );
    return;
  }

  fillPatternRect(
    cells,
    width,
    height,
    centerX - Math.floor(thickness / 2),
    centerY - Math.floor(length / 2),
    thickness,
    length,
    value,
  );
}

function wrapPatternCoordinateFloat(value: number, size: number): number {
  if (size <= 1) return 0;
  return positiveModulo(value, size);
}

function sampleParticleFlowAngle(
  seed: number,
  x: number,
  y: number,
  scale: number,
  step: number,
): number {
  const sampleX = Math.floor((x + 0.5) * scale);
  const sampleY = Math.floor((y + 0.5) * scale);
  const baseAngle = hashFloat(seed, sampleX, sampleY) * Math.PI * 2;
  const twist = (hashFloat(seed + 137, sampleY + step, sampleX - step) * 2 - 1) * (Math.PI / 3);
  return baseAngle + twist;
}

function invertMaskBytes(bytes: Uint8Array): Uint8Array {
  const inverted = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index++) {
    inverted[index] = ~bytes[index]! & 0xff;
  }
  return inverted;
}

function normalizedFoldedAngle(angle: number, sector: number): number {
  const wrapped = ((angle % sector) + sector) % sector;
  return Math.abs(wrapped - sector / 2) / (sector / 2);
}

type LSystemPresetConfig = Readonly<{
  axiom: string;
  rules: Readonly<Record<string, string>>;
  startAngle: number;
}>;

function lSystemPresetConfig(preset: LSystemPreset): LSystemPresetConfig {
  switch (preset) {
    case "plant":
      return {
        axiom: "X",
        rules: {
          X: "F[+X][-X]FX",
          F: "FF",
        },
        startAngle: -90,
      };
    case "dragon":
      return {
        axiom: "FX",
        rules: {
          X: "X+YF+",
          Y: "-FX-Y",
        },
        startAngle: 0,
      };
    case "bush":
      return {
        axiom: "F",
        rules: {
          F: "FF-[-F+F+F]+[+F-F-F]",
        },
        startAngle: -90,
      };
  }
}

function expandLSystemSequence(
  axiom: string,
  rules: Readonly<Record<string, string>>,
  iterations: number,
): string {
  let current = axiom;
  for (let iteration = 0; iteration < iterations; iteration++) {
    const next: string[] = [];
    let nextLength = 0;
    for (const token of current) {
      const replacement = rules[token] ?? token;
      next.push(replacement);
      nextLength += replacement.length;
      if (nextLength > 12000) break;
    }
    current = next.join("");
    if (current.length > 12000) break;
  }
  return current;
}

function traceLSystemSegments(
  sequence: string,
  startAngle: number,
  turnAngle: number,
): Readonly<{
  segments: ReadonlyArray<Readonly<{ x0: number; y0: number; x1: number; y1: number }>>;
  bounds: Readonly<{ minX: number; minY: number; maxX: number; maxY: number }>;
}> {
  const segments: Array<Readonly<{ x0: number; y0: number; x1: number; y1: number }>> = [];
  const stack: Array<Readonly<{ x: number; y: number; angle: number }>> = [];
  const turn = (turnAngle * Math.PI) / 180;
  let x = 0;
  let y = 0;
  let angle = (startAngle * Math.PI) / 180;
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;

  for (const token of sequence) {
    if (token === "F" || token === "G") {
      const nextX = x + Math.cos(angle);
      const nextY = y + Math.sin(angle);
      segments.push({ x0: x, y0: y, x1: nextX, y1: nextY });
      x = nextX;
      y = nextY;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    } else if (token === "+") {
      angle += turn;
    } else if (token === "-") {
      angle -= turn;
    } else if (token === "[") {
      stack.push({ x, y, angle });
    } else if (token === "]") {
      const state = stack.pop();
      if (state) {
        x = state.x;
        y = state.y;
        angle = state.angle;
      }
    }
  }

  return {
    segments,
    bounds: { minX, minY, maxX, maxY },
  };
}

function drawScaledSegments(
  cells: Uint8Array,
  width: number,
  height: number,
  segments: ReadonlyArray<Readonly<{ x0: number; y0: number; x1: number; y1: number }>>,
  strokeWidth: number,
  padding: number,
): void {
  if (segments.length === 0) return;
  const bounds = segments.reduce(
    (accumulator, segment) => ({
      minX: Math.min(accumulator.minX, segment.x0, segment.x1),
      minY: Math.min(accumulator.minY, segment.y0, segment.y1),
      maxX: Math.max(accumulator.maxX, segment.x0, segment.x1),
      maxY: Math.max(accumulator.maxY, segment.y0, segment.y1),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
  const patternWidth = Math.max(1, bounds.maxX - bounds.minX);
  const patternHeight = Math.max(1, bounds.maxY - bounds.minY);
  const availableWidth = Math.max(1, width - padding * 2 - 1);
  const availableHeight = Math.max(1, height - padding * 2 - 1);
  const scale = Math.min(availableWidth / patternWidth, availableHeight / patternHeight);
  const offsetX = padding + (availableWidth - patternWidth * scale) / 2 - bounds.minX * scale;
  const offsetY = padding + (availableHeight - patternHeight * scale) / 2 - bounds.minY * scale;

  for (const segment of segments) {
    drawSourceLine(
      cells,
      width,
      height,
      segment.x0 * scale + offsetX,
      segment.y0 * scale + offsetY,
      segment.x1 * scale + offsetX,
      segment.y1 * scale + offsetY,
      strokeWidth,
    );
  }
}

function drawTileableMotif(
  cells: Uint8Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  motif: TileableMotifType,
  motifSize: number,
  rotation: number,
): void {
  const drawLocalLine = (x0: number, y0: number, x1: number, y1: number, strokeWidth = 1): void => {
    const from = rotateRightAnglePoint(x0, y0, rotation);
    const to = rotateRightAnglePoint(x1, y1, rotation);
    drawSourceLine(
      cells,
      width,
      height,
      centerX + from.x,
      centerY + from.y,
      centerX + to.x,
      centerY + to.y,
      strokeWidth,
    );
  };

  switch (motif) {
    case "cross":
      drawLocalLine(-motifSize, 0, motifSize, 0);
      drawLocalLine(0, -motifSize, 0, motifSize);
      break;
    case "diamond":
      drawLocalLine(0, -motifSize, motifSize, 0);
      drawLocalLine(motifSize, 0, 0, motifSize);
      drawLocalLine(0, motifSize, -motifSize, 0);
      drawLocalLine(-motifSize, 0, 0, -motifSize);
      break;
    case "box":
      drawLocalLine(-motifSize, -motifSize, motifSize, -motifSize);
      drawLocalLine(motifSize, -motifSize, motifSize, motifSize);
      drawLocalLine(motifSize, motifSize, -motifSize, motifSize);
      drawLocalLine(-motifSize, motifSize, -motifSize, -motifSize);
      break;
    case "chevron":
      drawLocalLine(-motifSize, -motifSize, motifSize, 0);
      drawLocalLine(motifSize, 0, -motifSize, motifSize);
      break;
    case "petal":
      drawLocalLine(0, -motifSize, motifSize, 0);
      drawLocalLine(motifSize, 0, 0, motifSize);
      drawLocalLine(0, motifSize, -motifSize, 0);
      drawLocalLine(-motifSize, 0, 0, -motifSize);
      drawLocalLine(-motifSize, 0, motifSize, 0);
      drawLocalLine(0, -motifSize, 0, motifSize);
      break;
  }
}

function rotateRightAnglePoint(
  x: number,
  y: number,
  rotation: number,
): Readonly<{ x: number; y: number }> {
  switch ((((rotation % 360) + 360) % 360) as 0 | 90 | 180 | 270) {
    case 90:
      return { x: -y, y: x };
    case 180:
      return { x: -x, y: -y };
    case 270:
      return { x: y, y: -x };
    default:
      return { x, y };
  }
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
  return y * activeGeneratedContentSize.width + x;
}

function mazeCellIndex(columns: number, x: number, y: number): number {
  return y * columns + x;
}

function wallsToMaskBytes(walls: Uint8Array): Uint8Array {
  const bytes = new Uint8Array(128);
  for (let y = 0; y < activeGeneratedContentSize.height; y++) {
    for (let x = 0; x < activeGeneratedContentSize.width; x++) {
      if (walls[mazeTileIndex(x, y)] !== 1) continue;
      setMaskBit(bytes, y * GENERATED_LAYOUT_GRID_SIZE + x);
    }
  }
  return bytes;
}

function createFilledMazeWalls(): Uint8Array {
  const walls = new Uint8Array(
    activeGeneratedContentSize.width * activeGeneratedContentSize.height,
  );
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
  contentWidth = activeGeneratedContentSize.width,
  contentHeight = activeGeneratedContentSize.height,
): Readonly<{ roomCountMax: number; roomSizeMax: number }> {
  const dims = mazeGridDimensionsForBlockSize(blockSize, contentWidth, contentHeight);
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

function maskBitIsSet(bytes: Uint8Array, index: number): boolean {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = 7 - (index % 8);
  return ((bytes[byteIndex] ?? 0) & (1 << bitIndex)) !== 0;
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

function sanitizeGeneratedLayoutSize(value: number): number {
  return clamp(Math.round(value), GENERATED_LAYOUT_MIN_SIZE, GENERATED_LAYOUT_MAX_SIZE);
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

function sanitizeRadialSymmetryFolds(value: number): number {
  return clamp(Math.round(value), RADIAL_SYMMETRY_FOLDS_MIN, RADIAL_SYMMETRY_FOLDS_MAX);
}

function sanitizeRadialSymmetryRings(value: number): number {
  return clamp(Math.round(value), RADIAL_SYMMETRY_RINGS_MIN, RADIAL_SYMMETRY_RINGS_MAX);
}

function sanitizeRadialSymmetryTwist(value: number): number {
  return normalizeSteppedValue(
    value,
    RADIAL_SYMMETRY_TWIST_STEP,
    RADIAL_SYMMETRY_TWIST_MIN,
    RADIAL_SYMMETRY_TWIST_MAX,
  );
}

function sanitizeRadialSymmetryThickness(value: number): number {
  return normalizeSteppedValue(
    value,
    RADIAL_SYMMETRY_THICKNESS_STEP,
    RADIAL_SYMMETRY_THICKNESS_MIN,
    RADIAL_SYMMETRY_THICKNESS_MAX,
  );
}

function sanitizeKaleidoscopeSegments(value: number): number {
  return clamp(Math.round(value), KALEIDOSCOPE_SEGMENTS_MIN, KALEIDOSCOPE_SEGMENTS_MAX);
}

function sanitizeKaleidoscopeScale(value: number): number {
  return normalizeSteppedValue(
    value,
    KALEIDOSCOPE_SCALE_STEP,
    KALEIDOSCOPE_SCALE_MIN,
    KALEIDOSCOPE_SCALE_MAX,
  );
}

function sanitizeLSystemPreset(value: LSystemPreset): LSystemPreset {
  return LSYSTEM_PRESET_OPTIONS.includes(value) ? value : "plant";
}

function sanitizeLSystemIterations(value: number): number {
  return clamp(Math.round(value), LSYSTEM_ITERATIONS_MIN, LSYSTEM_ITERATIONS_MAX);
}

function sanitizeLSystemTurnAngle(value: number): number {
  return clamp(
    Math.round(value / LSYSTEM_TURN_ANGLE_STEP) * LSYSTEM_TURN_ANGLE_STEP,
    LSYSTEM_TURN_ANGLE_MIN,
    LSYSTEM_TURN_ANGLE_MAX,
  );
}

function sanitizeLSystemStrokeWidth(value: number): number {
  return clamp(Math.round(value), LSYSTEM_STROKE_WIDTH_MIN, LSYSTEM_STROKE_WIDTH_MAX);
}

function sanitizeRoseCurvePetals(value: number): number {
  return clamp(Math.round(value), ROSE_CURVE_PETALS_MIN, ROSE_CURVE_PETALS_MAX);
}

function sanitizeRoseCurveHarmonic(value: number): number {
  return clamp(Math.round(value), ROSE_CURVE_HARMONIC_MIN, ROSE_CURVE_HARMONIC_MAX);
}

function sanitizeRoseCurveRotation(value: number): number {
  return clamp(
    Math.round(value / ROSE_CURVE_ROTATION_STEP) * ROSE_CURVE_ROTATION_STEP,
    ROSE_CURVE_ROTATION_MIN,
    ROSE_CURVE_ROTATION_MAX,
  );
}

function sanitizeRoseCurveStrokeWidth(value: number): number {
  return clamp(Math.round(value), ROSE_CURVE_STROKE_WIDTH_MIN, ROSE_CURVE_STROKE_WIDTH_MAX);
}

function sanitizeTileableMotifType(value: TileableMotifType): TileableMotifType {
  return TILEABLE_MOTIF_TYPE_OPTIONS.includes(value) ? value : "cross";
}

function sanitizeTileableMotifSpacing(value: number): number {
  return clamp(Math.round(value), TILEABLE_MOTIF_SPACING_MIN, TILEABLE_MOTIF_SPACING_MAX);
}

function sanitizeTileableMotifSize(value: number): number {
  return clamp(Math.round(value), TILEABLE_MOTIF_SIZE_MIN, TILEABLE_MOTIF_SIZE_MAX);
}

function sanitizeTileableMotifJitter(value: number): number {
  return clamp(Math.round(value), TILEABLE_MOTIF_JITTER_MIN, TILEABLE_MOTIF_JITTER_MAX);
}

function sanitizeRightAngleRotation(value: number): number {
  return RIGHT_ANGLE_ROTATION_OPTIONS.includes(value) ? value : 0;
}

function sanitizeBspRoomPartitionerSplitDepth(value: number): number {
  return clamp(
    Math.round(value),
    BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MIN,
    BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MAX,
  );
}

function sanitizeBspRoomPartitionerRoomPadding(value: number): number {
  return clamp(
    Math.round(value),
    BSP_ROOM_PARTITIONER_ROOM_PADDING_MIN,
    BSP_ROOM_PARTITIONER_ROOM_PADDING_MAX,
  );
}

function sanitizeBspRoomPartitionerCorridorWidth(value: number): number {
  return clamp(
    Math.round(value),
    BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MIN,
    BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MAX,
  );
}

function sanitizeCorridorGridSpacing(value: number): number {
  return clamp(
    Math.round(value),
    CORRIDOR_GRID_COLUMN_SPACING_MIN,
    CORRIDOR_GRID_COLUMN_SPACING_MAX,
  );
}

function sanitizeCorridorGridWallThickness(value: number): number {
  return clamp(
    Math.round(value),
    CORRIDOR_GRID_WALL_THICKNESS_MIN,
    CORRIDOR_GRID_WALL_THICKNESS_MAX,
  );
}

function sanitizeCorridorGridGapChance(value: number): number {
  return normalizeSteppedValue(
    value,
    CORRIDOR_GRID_GAP_CHANCE_STEP,
    CORRIDOR_GRID_GAP_CHANCE_MIN,
    CORRIDOR_GRID_GAP_CHANCE_MAX,
  );
}

function sanitizeRoomScatterRoomCount(value: number): number {
  return clamp(Math.round(value), ROOM_SCATTER_ROOM_COUNT_MIN, ROOM_SCATTER_ROOM_COUNT_MAX);
}

function sanitizeRoomScatterRoomSize(value: number): number {
  return clamp(Math.round(value), ROOM_SCATTER_ROOM_SIZE_MIN, ROOM_SCATTER_ROOM_SIZE_MAX);
}

function sanitizeRoomScatterGap(value: number): number {
  return clamp(Math.round(value), ROOM_SCATTER_GAP_MIN, ROOM_SCATTER_GAP_MAX);
}

function sanitizeRoomScatterConnectorChance(value: number): number {
  return normalizeSteppedValue(
    value,
    ROOM_SCATTER_CONNECTOR_CHANCE_STEP,
    ROOM_SCATTER_CONNECTOR_CHANCE_MIN,
    ROOM_SCATTER_CONNECTOR_CHANCE_MAX,
  );
}

function sanitizeCourtyardRingCount(value: number): number {
  return clamp(Math.round(value), COURTYARD_RING_COUNT_MIN, COURTYARD_RING_COUNT_MAX);
}

function sanitizeCourtyardRingGap(value: number): number {
  return clamp(Math.round(value), COURTYARD_RING_GAP_MIN, COURTYARD_RING_GAP_MAX);
}

function sanitizeCourtyardGateWidth(value: number): number {
  return clamp(Math.round(value), COURTYARD_GATE_WIDTH_MIN, COURTYARD_GATE_WIDTH_MAX);
}

function sanitizeCourtyardOffset(value: number): number {
  return clamp(Math.round(value), COURTYARD_OFFSET_MIN, COURTYARD_OFFSET_MAX);
}

function sanitizeBlueprintWingCount(value: number): number {
  return clamp(Math.round(value), BLUEPRINT_WING_COUNT_MIN, BLUEPRINT_WING_COUNT_MAX);
}

function sanitizeBlueprintHallWidth(value: number): number {
  return clamp(Math.round(value), BLUEPRINT_HALL_WIDTH_MIN, BLUEPRINT_HALL_WIDTH_MAX);
}

function sanitizeBlueprintPillarSpacing(value: number): number {
  return clamp(Math.round(value), BLUEPRINT_PILLAR_SPACING_MIN, BLUEPRINT_PILLAR_SPACING_MAX);
}

function sanitizeBlueprintChamberDepth(value: number): number {
  return clamp(Math.round(value), BLUEPRINT_CHAMBER_DEPTH_MIN, BLUEPRINT_CHAMBER_DEPTH_MAX);
}

function sanitizeStripePlaidMode(value: StripePlaidMode): StripePlaidMode {
  return STRIPE_PLAID_MODE_OPTIONS.includes(value) ? value : "plaid";
}

function sanitizeStripePlaidSpacing(value: number): number {
  return clamp(Math.round(value), STRIPE_PLAID_SPACING_MIN, STRIPE_PLAID_SPACING_MAX);
}

function sanitizeStripePlaidBandWidth(value: number): number {
  return clamp(Math.round(value), STRIPE_PLAID_BAND_WIDTH_MIN, STRIPE_PLAID_BAND_WIDTH_MAX);
}

function sanitizeStripePlaidOffset(value: number): number {
  return clamp(Math.round(value), STRIPE_PLAID_OFFSET_MIN, STRIPE_PLAID_OFFSET_MAX);
}

function sanitizeCheckerDiamondLatticeStyle(
  value: CheckerDiamondLatticeStyle,
): CheckerDiamondLatticeStyle {
  return CHECKER_DIAMOND_LATTICE_STYLE_OPTIONS.includes(value) ? value : "checker";
}

function sanitizeCheckerDiamondCellSize(value: number): number {
  return clamp(Math.round(value), CHECKER_DIAMOND_CELL_SIZE_MIN, CHECKER_DIAMOND_CELL_SIZE_MAX);
}

function sanitizeCheckerDiamondLineWidth(value: number): number {
  return clamp(Math.round(value), CHECKER_DIAMOND_LINE_WIDTH_MIN, CHECKER_DIAMOND_LINE_WIDTH_MAX);
}

function sanitizeCheckerDiamondPhase(value: number): number {
  return clamp(Math.round(value), CHECKER_DIAMOND_PHASE_MIN, CHECKER_DIAMOND_PHASE_MAX);
}

function sanitizeConcentricBoxRingCount(value: number): number {
  return clamp(Math.round(value), CONCENTRIC_BOX_RING_COUNT_MIN, CONCENTRIC_BOX_RING_COUNT_MAX);
}

function sanitizeConcentricBoxSpacing(value: number): number {
  return clamp(Math.round(value), CONCENTRIC_BOX_SPACING_MIN, CONCENTRIC_BOX_SPACING_MAX);
}

function sanitizeConcentricBoxLineWidth(value: number): number {
  return clamp(Math.round(value), CONCENTRIC_BOX_LINE_WIDTH_MIN, CONCENTRIC_BOX_LINE_WIDTH_MAX);
}

function sanitizeConcentricBoxDrift(value: number): number {
  return clamp(Math.round(value), CONCENTRIC_BOX_DRIFT_MIN, CONCENTRIC_BOX_DRIFT_MAX);
}

function sanitizeLineInterferenceSpacing(value: number): number {
  return clamp(Math.round(value), LINE_INTERFERENCE_SPACING_MIN, LINE_INTERFERENCE_SPACING_MAX);
}

function sanitizeLineInterferenceStrokeWidth(value: number): number {
  return clamp(
    Math.round(value),
    LINE_INTERFERENCE_STROKE_WIDTH_MIN,
    LINE_INTERFERENCE_STROKE_WIDTH_MAX,
  );
}

function sanitizeCirclePackingCount(value: number): number {
  return clamp(Math.round(value), CIRCLE_PACKING_COUNT_MIN, CIRCLE_PACKING_COUNT_MAX);
}

function sanitizeCirclePackingMinRadius(value: number): number {
  return clamp(Math.round(value), CIRCLE_PACKING_MIN_RADIUS_MIN, CIRCLE_PACKING_MIN_RADIUS_MAX);
}

function sanitizeCirclePackingMaxRadius(value: number): number {
  return clamp(Math.round(value), CIRCLE_PACKING_MAX_RADIUS_MIN, CIRCLE_PACKING_MAX_RADIUS_MAX);
}

function sanitizeDrunkWalkWalkerCount(value: number): number {
  return clamp(Math.round(value), DRUNK_WALK_WALKER_COUNT_MIN, DRUNK_WALK_WALKER_COUNT_MAX);
}

function sanitizeDrunkWalkSteps(value: number): number {
  return clamp(Math.round(value), DRUNK_WALK_STEPS_MIN, DRUNK_WALK_STEPS_MAX);
}

function sanitizeDrunkWalkBrushSize(value: number): number {
  return clamp(Math.round(value), DRUNK_WALK_BRUSH_SIZE_MIN, DRUNK_WALK_BRUSH_SIZE_MAX);
}

function sanitizeDrunkWalkRoomChance(value: number): number {
  return normalizeSteppedValue(
    value,
    DRUNK_WALK_ROOM_CHANCE_STEP,
    DRUNK_WALK_ROOM_CHANCE_MIN,
    DRUNK_WALK_ROOM_CHANCE_MAX,
  );
}

function sanitizeParticleFlowAgentCount(value: number): number {
  return clamp(Math.round(value), PARTICLE_FLOW_AGENT_COUNT_MIN, PARTICLE_FLOW_AGENT_COUNT_MAX);
}

function sanitizeParticleFlowSteps(value: number): number {
  return clamp(Math.round(value), PARTICLE_FLOW_STEPS_MIN, PARTICLE_FLOW_STEPS_MAX);
}

function sanitizeParticleFlowFieldScale(value: number): number {
  return normalizeSteppedValue(
    value,
    PARTICLE_FLOW_FIELD_SCALE_STEP,
    PARTICLE_FLOW_FIELD_SCALE_MIN,
    PARTICLE_FLOW_FIELD_SCALE_MAX,
  );
}

function sanitizeParticleFlowStrokeWidth(value: number): number {
  return clamp(Math.round(value), PARTICLE_FLOW_STROKE_WIDTH_MIN, PARTICLE_FLOW_STROKE_WIDTH_MAX);
}

function sanitizeStampBrushCount(value: number): number {
  return clamp(Math.round(value), STAMP_BRUSH_COUNT_MIN, STAMP_BRUSH_COUNT_MAX);
}

function sanitizeStampBrushSize(value: number): number {
  return clamp(Math.round(value), STAMP_BRUSH_SIZE_MIN, STAMP_BRUSH_SIZE_MAX);
}

function sanitizeStampBrushType(value: StampBrushType): StampBrushType {
  return STAMP_BRUSH_TYPE_OPTIONS.includes(value) ? value : "mixed";
}

function sanitizeStampBrushScatter(value: number): number {
  return clamp(Math.round(value), STAMP_BRUSH_SCATTER_MIN, STAMP_BRUSH_SCATTER_MAX);
}

function sanitizeCutoutCollageShapeCount(value: number): number {
  return clamp(Math.round(value), CUTOUT_COLLAGE_SHAPE_COUNT_MIN, CUTOUT_COLLAGE_SHAPE_COUNT_MAX);
}

function sanitizeCutoutCollageMinSize(value: number): number {
  return clamp(Math.round(value), CUTOUT_COLLAGE_MIN_SIZE_MIN, CUTOUT_COLLAGE_MIN_SIZE_MAX);
}

function sanitizeCutoutCollageMaxSize(value: number): number {
  return clamp(Math.round(value), CUTOUT_COLLAGE_MAX_SIZE_MIN, CUTOUT_COLLAGE_MAX_SIZE_MAX);
}

function sanitizeCutoutCollageSubtractChance(value: number): number {
  return normalizeSteppedValue(
    value,
    CUTOUT_COLLAGE_SUBTRACT_CHANCE_STEP,
    CUTOUT_COLLAGE_SUBTRACT_CHANCE_MIN,
    CUTOUT_COLLAGE_SUBTRACT_CHANCE_MAX,
  );
}

function sanitizeGlitchBlockBandCount(value: number): number {
  return clamp(Math.round(value), GLITCH_BLOCK_BAND_COUNT_MIN, GLITCH_BLOCK_BAND_COUNT_MAX);
}

function sanitizeGlitchBlockOffsetRange(value: number): number {
  return clamp(Math.round(value), GLITCH_BLOCK_OFFSET_RANGE_MIN, GLITCH_BLOCK_OFFSET_RANGE_MAX);
}

function sanitizeGlitchBlockStripeChance(value: number): number {
  return normalizeSteppedValue(
    value,
    GLITCH_BLOCK_STRIPE_CHANCE_STEP,
    GLITCH_BLOCK_STRIPE_CHANCE_MIN,
    GLITCH_BLOCK_STRIPE_CHANCE_MAX,
  );
}

function sanitizeGlitchBlockCellSize(value: number): number {
  return clamp(Math.round(value), GLITCH_BLOCK_CELL_SIZE_MIN, GLITCH_BLOCK_CELL_SIZE_MAX);
}

function sanitizeGameOfLifeDensity(value: number): number {
  return normalizeSteppedValue(
    value,
    GAME_OF_LIFE_DENSITY_STEP,
    GAME_OF_LIFE_DENSITY_MIN,
    GAME_OF_LIFE_DENSITY_MAX,
  );
}

function sanitizeGameOfLifeSteps(value: number): number {
  return clamp(Math.round(value), GAME_OF_LIFE_STEPS_MIN, GAME_OF_LIFE_STEPS_MAX);
}

function sanitizeGameOfLifeVariant(value: GameOfLifeVariant): GameOfLifeVariant {
  return GAME_OF_LIFE_VARIANT_OPTIONS.includes(value) ? value : "life";
}

function sanitizeDlaWalkers(value: number): number {
  return clamp(Math.round(value), DLA_WALKERS_MIN, DLA_WALKERS_MAX);
}

function sanitizeDlaStickiness(value: number): number {
  return normalizeSteppedValue(value, DLA_STICKINESS_STEP, DLA_STICKINESS_MIN, DLA_STICKINESS_MAX);
}

function sanitizeDlaSeedMode(value: DlaSeedMode): DlaSeedMode {
  return DLA_SEED_MODE_OPTIONS.includes(value) ? value : "point";
}

function sanitizeReactionDiffusionSpotCount(value: number): number {
  return clamp(
    Math.round(value),
    REACTION_DIFFUSION_SPOT_COUNT_MIN,
    REACTION_DIFFUSION_SPOT_COUNT_MAX,
  );
}

function sanitizeReactionDiffusionIterations(value: number): number {
  return clamp(
    Math.round(value),
    REACTION_DIFFUSION_ITERATIONS_MIN,
    REACTION_DIFFUSION_ITERATIONS_MAX,
  );
}

function sanitizeReactionDiffusionFeed(value: number): number {
  return normalizeSteppedValue(
    value,
    REACTION_DIFFUSION_FEED_STEP,
    REACTION_DIFFUSION_FEED_MIN,
    REACTION_DIFFUSION_FEED_MAX,
  );
}

function sanitizeReactionDiffusionKill(value: number): number {
  return normalizeSteppedValue(
    value,
    REACTION_DIFFUSION_KILL_STEP,
    REACTION_DIFFUSION_KILL_MIN,
    REACTION_DIFFUSION_KILL_MAX,
  );
}

function sanitizeVoronoiSiteCount(value: number): number {
  return clamp(Math.round(value), VORONOI_SITE_COUNT_MIN, VORONOI_SITE_COUNT_MAX);
}

function sanitizeVoronoiRidgeWidth(value: number): number {
  return normalizeSteppedValue(
    value,
    VORONOI_RIDGE_WIDTH_STEP,
    VORONOI_RIDGE_WIDTH_MIN,
    VORONOI_RIDGE_WIDTH_MAX,
  );
}

function sanitizeVoronoiJitter(value: number): number {
  return normalizeSteppedValue(value, VORONOI_JITTER_STEP, VORONOI_JITTER_MIN, VORONOI_JITTER_MAX);
}

function sanitizeErosionDilationDensity(value: number): number {
  return normalizeSteppedValue(
    value,
    EROSION_DILATION_DENSITY_STEP,
    EROSION_DILATION_DENSITY_MIN,
    EROSION_DILATION_DENSITY_MAX,
  );
}

function sanitizeErosionDilationGrowSteps(value: number): number {
  return clamp(Math.round(value), EROSION_DILATION_GROW_STEPS_MIN, EROSION_DILATION_GROW_STEPS_MAX);
}

function sanitizeErosionDilationShrinkSteps(value: number): number {
  return clamp(
    Math.round(value),
    EROSION_DILATION_SHRINK_STEPS_MIN,
    EROSION_DILATION_SHRINK_STEPS_MAX,
  );
}

function sanitizeErosionDilationPunctureChance(value: number): number {
  return normalizeSteppedValue(
    value,
    EROSION_DILATION_PUNCTURE_STEP,
    EROSION_DILATION_PUNCTURE_MIN,
    EROSION_DILATION_PUNCTURE_MAX,
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
  return Number(
    clamp(min + Math.round((value - min) / step) * step, min, max).toFixed(
      resolveStepPrecision(step),
    ),
  );
}

function resolveStepPrecision(step: number): number {
  const serialized = step.toString();
  const exponentMatch = serialized.match(/e-(\d+)$/i);
  if (exponentMatch) return Number(exponentMatch[1]);
  const decimalIndex = serialized.indexOf(".");
  return decimalIndex === -1 ? 0 : serialized.length - decimalIndex - 1;
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

function positiveModulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function formatStripePlaidModeLabel(mode: StripePlaidMode): string {
  switch (mode) {
    case "horizontal":
      return "horizontal";
    case "vertical":
      return "vertical";
    case "plaid":
      return "plaid";
  }
}

function formatCheckerDiamondLatticeStyleLabel(style: CheckerDiamondLatticeStyle): string {
  switch (style) {
    case "checker":
      return "checker";
    case "diamond":
      return "diamond";
    case "lattice":
      return "lattice";
  }
}

function formatStampBrushTypeLabel(type: StampBrushType): string {
  switch (type) {
    case "mixed":
      return "mixed";
    case "square":
      return "square";
    case "circle":
      return "circle";
    case "cross":
      return "cross";
    case "bar":
      return "bar";
  }
}

function formatNoiseScale(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function formatCompactDecimal(value: number): string {
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
