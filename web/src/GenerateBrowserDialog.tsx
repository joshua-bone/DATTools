import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction,
  type SyntheticEvent,
} from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  BINARY_TREE_SKEW_OPTIONS,
  BLUEPRINT_CHAMBER_DEPTH_MAX,
  BLUEPRINT_CHAMBER_DEPTH_MIN,
  BLUEPRINT_HALL_WIDTH_MAX,
  BLUEPRINT_HALL_WIDTH_MIN,
  BLUEPRINT_PILLAR_SPACING_MAX,
  BLUEPRINT_PILLAR_SPACING_MIN,
  BLUEPRINT_WING_COUNT_MAX,
  BLUEPRINT_WING_COUNT_MIN,
  CHECKER_DIAMOND_CELL_SIZE_MAX,
  CHECKER_DIAMOND_CELL_SIZE_MIN,
  CHECKER_DIAMOND_LATTICE_STYLE_OPTIONS,
  CHECKER_DIAMOND_LINE_WIDTH_MAX,
  CHECKER_DIAMOND_LINE_WIDTH_MIN,
  CHECKER_DIAMOND_PHASE_MAX,
  CHECKER_DIAMOND_PHASE_MIN,
  BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MAX,
  BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MIN,
  BSP_ROOM_PARTITIONER_ROOM_PADDING_MAX,
  BSP_ROOM_PARTITIONER_ROOM_PADDING_MIN,
  BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MAX,
  BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MIN,
  CELLULAR_AUTOMATON_COMPLEXITY_MAX,
  CELLULAR_AUTOMATON_COMPLEXITY_MIN,
  CELLULAR_AUTOMATON_COMPLEXITY_STEP,
  CELLULAR_AUTOMATON_DENSITY_MAX,
  CELLULAR_AUTOMATON_DENSITY_MIN,
  CELLULAR_AUTOMATON_DENSITY_STEP,
  CIRCLE_PACKING_COUNT_MAX,
  CIRCLE_PACKING_COUNT_MIN,
  CIRCLE_PACKING_MAX_RADIUS_MAX,
  CIRCLE_PACKING_MAX_RADIUS_MIN,
  CIRCLE_PACKING_MIN_RADIUS_MAX,
  CIRCLE_PACKING_MIN_RADIUS_MIN,
  CONCENTRIC_BOX_DRIFT_MAX,
  CONCENTRIC_BOX_DRIFT_MIN,
  CONCENTRIC_BOX_LINE_WIDTH_MAX,
  CONCENTRIC_BOX_LINE_WIDTH_MIN,
  CONCENTRIC_BOX_RING_COUNT_MAX,
  CONCENTRIC_BOX_RING_COUNT_MIN,
  CONCENTRIC_BOX_SPACING_MAX,
  CONCENTRIC_BOX_SPACING_MIN,
  CUTOUT_COLLAGE_MAX_SIZE_MAX,
  CUTOUT_COLLAGE_MAX_SIZE_MIN,
  CUTOUT_COLLAGE_MIN_SIZE_MAX,
  CUTOUT_COLLAGE_MIN_SIZE_MIN,
  CUTOUT_COLLAGE_SHAPE_COUNT_MAX,
  CUTOUT_COLLAGE_SHAPE_COUNT_MIN,
  CUTOUT_COLLAGE_SUBTRACT_CHANCE_MAX,
  CUTOUT_COLLAGE_SUBTRACT_CHANCE_MIN,
  CUTOUT_COLLAGE_SUBTRACT_CHANCE_STEP,
  CORRIDOR_GRID_COLUMN_SPACING_MAX,
  CORRIDOR_GRID_COLUMN_SPACING_MIN,
  CORRIDOR_GRID_GAP_CHANCE_MAX,
  CORRIDOR_GRID_GAP_CHANCE_MIN,
  CORRIDOR_GRID_GAP_CHANCE_STEP,
  CORRIDOR_GRID_ROW_SPACING_MAX,
  CORRIDOR_GRID_ROW_SPACING_MIN,
  CORRIDOR_GRID_WALL_THICKNESS_MAX,
  CORRIDOR_GRID_WALL_THICKNESS_MIN,
  COURTYARD_GATE_WIDTH_MAX,
  COURTYARD_GATE_WIDTH_MIN,
  COURTYARD_OFFSET_MAX,
  COURTYARD_OFFSET_MIN,
  COURTYARD_RING_COUNT_MAX,
  COURTYARD_RING_COUNT_MIN,
  COURTYARD_RING_GAP_MAX,
  COURTYARD_RING_GAP_MIN,
  DLA_SEED_MODE_OPTIONS,
  DLA_STICKINESS_MAX,
  DLA_STICKINESS_MIN,
  DLA_STICKINESS_STEP,
  DLA_WALKERS_MAX,
  DLA_WALKERS_MIN,
  DUNGEON_ROOM_COUNT_MAX,
  DUNGEON_ROOM_COUNT_MIN,
  DUNGEON_ROOM_SIZE_MAX,
  DUNGEON_ROOM_SIZE_MIN,
  DRUNK_WALK_BRUSH_SIZE_MAX,
  DRUNK_WALK_BRUSH_SIZE_MIN,
  DRUNK_WALK_ROOM_CHANCE_MAX,
  DRUNK_WALK_ROOM_CHANCE_MIN,
  DRUNK_WALK_ROOM_CHANCE_STEP,
  DRUNK_WALK_STEPS_MAX,
  DRUNK_WALK_STEPS_MIN,
  DRUNK_WALK_WALKER_COUNT_MAX,
  DRUNK_WALK_WALKER_COUNT_MIN,
  DOMAIN_WARP_SCALE_MAX,
  DOMAIN_WARP_SCALE_MIN,
  DOMAIN_WARP_SCALE_STEP,
  DOMAIN_WARP_STRENGTH_MAX,
  DOMAIN_WARP_STRENGTH_MIN,
  DOMAIN_WARP_STRENGTH_STEP,
  EROSION_DILATION_DENSITY_MAX,
  EROSION_DILATION_DENSITY_MIN,
  EROSION_DILATION_DENSITY_STEP,
  EROSION_DILATION_GROW_STEPS_MAX,
  EROSION_DILATION_GROW_STEPS_MIN,
  EROSION_DILATION_PUNCTURE_MAX,
  EROSION_DILATION_PUNCTURE_MIN,
  EROSION_DILATION_PUNCTURE_STEP,
  EROSION_DILATION_SHRINK_STEPS_MAX,
  EROSION_DILATION_SHRINK_STEPS_MIN,
  GAME_OF_LIFE_DENSITY_MAX,
  GAME_OF_LIFE_DENSITY_MIN,
  GAME_OF_LIFE_DENSITY_STEP,
  GAME_OF_LIFE_STEPS_MAX,
  GAME_OF_LIFE_STEPS_MIN,
  GAME_OF_LIFE_VARIANT_OPTIONS,
  GENERATE_ALGORITHM_OPTIONS,
  GENERATED_LAYOUT_CARD_COUNT,
  GENERATED_LAYOUT_GRID_SIZE,
  GENERATED_LAYOUT_MAX_SIZE,
  GENERATED_LAYOUT_MIN_SIZE,
  GLITCH_BLOCK_BAND_COUNT_MAX,
  GLITCH_BLOCK_BAND_COUNT_MIN,
  GLITCH_BLOCK_CELL_SIZE_MAX,
  GLITCH_BLOCK_CELL_SIZE_MIN,
  GLITCH_BLOCK_OFFSET_RANGE_MAX,
  GLITCH_BLOCK_OFFSET_RANGE_MIN,
  GLITCH_BLOCK_STRIPE_CHANCE_MAX,
  GLITCH_BLOCK_STRIPE_CHANCE_MIN,
  GLITCH_BLOCK_STRIPE_CHANCE_STEP,
  GROWING_TREE_BACKTRACK_CHANCE_MAX,
  GROWING_TREE_BACKTRACK_CHANCE_MIN,
  GROWING_TREE_BACKTRACK_CHANCE_STEP,
  HUNT_ORDER_OPTIONS,
  KALEIDOSCOPE_SCALE_MAX,
  KALEIDOSCOPE_SCALE_MIN,
  KALEIDOSCOPE_SCALE_STEP,
  KALEIDOSCOPE_SEGMENTS_MAX,
  KALEIDOSCOPE_SEGMENTS_MIN,
  MAZE_BLOCK_SIZE_OPTIONS,
  MAZE_SEED_MAX,
  MAZE_SEED_MIN,
  LSYSTEM_ITERATIONS_MAX,
  LSYSTEM_ITERATIONS_MIN,
  LSYSTEM_PRESET_OPTIONS,
  LSYSTEM_STROKE_WIDTH_MAX,
  LSYSTEM_STROKE_WIDTH_MIN,
  LSYSTEM_TURN_ANGLE_MAX,
  LSYSTEM_TURN_ANGLE_MIN,
  LSYSTEM_TURN_ANGLE_STEP,
  NOISE_TERRAIN_OCTAVES_MAX,
  NOISE_TERRAIN_OCTAVES_MIN,
  NOISE_TERRAIN_SCALE_MAX,
  NOISE_TERRAIN_SCALE_MIN,
  NOISE_TERRAIN_SCALE_STEP,
  NOISE_TERRAIN_THRESHOLD_MAX,
  NOISE_TERRAIN_THRESHOLD_MIN,
  NOISE_TERRAIN_THRESHOLD_STEP,
  PARTICLE_FLOW_AGENT_COUNT_MAX,
  PARTICLE_FLOW_AGENT_COUNT_MIN,
  PARTICLE_FLOW_FIELD_SCALE_MAX,
  PARTICLE_FLOW_FIELD_SCALE_MIN,
  PARTICLE_FLOW_FIELD_SCALE_STEP,
  PARTICLE_FLOW_STEPS_MAX,
  PARTICLE_FLOW_STEPS_MIN,
  PARTICLE_FLOW_STROKE_WIDTH_MAX,
  PARTICLE_FLOW_STROKE_WIDTH_MIN,
  RANDOM_NOISE_BLOCK_SIZE_OPTIONS,
  RANDOM_NOISE_DENSITY_MAX,
  RANDOM_NOISE_DENSITY_MIN,
  RANDOM_NOISE_DENSITY_STEP,
  RANDOM_NOISE_MIRROR_OPTIONS,
  RANDOM_NOISE_SEED_MAX,
  RANDOM_NOISE_SEED_MIN,
  SIDEWINDER_SKEW_MAX,
  SIDEWINDER_SKEW_MIN,
  SIDEWINDER_SKEW_STEP,
  RADIAL_SYMMETRY_FOLDS_MAX,
  RADIAL_SYMMETRY_FOLDS_MIN,
  RADIAL_SYMMETRY_RINGS_MAX,
  RADIAL_SYMMETRY_RINGS_MIN,
  RADIAL_SYMMETRY_THICKNESS_MAX,
  RADIAL_SYMMETRY_THICKNESS_MIN,
  RADIAL_SYMMETRY_THICKNESS_STEP,
  RADIAL_SYMMETRY_TWIST_MAX,
  RADIAL_SYMMETRY_TWIST_MIN,
  RADIAL_SYMMETRY_TWIST_STEP,
  RIGHT_ANGLE_ROTATION_OPTIONS,
  ROSE_CURVE_HARMONIC_MAX,
  ROSE_CURVE_HARMONIC_MIN,
  ROSE_CURVE_PETALS_MAX,
  ROSE_CURVE_PETALS_MIN,
  ROSE_CURVE_ROTATION_MAX,
  ROSE_CURVE_ROTATION_MIN,
  ROSE_CURVE_ROTATION_STEP,
  ROSE_CURVE_STROKE_WIDTH_MAX,
  ROSE_CURVE_STROKE_WIDTH_MIN,
  THRESHOLDED_GRADIENT_ANGLE_MAX,
  THRESHOLDED_GRADIENT_ANGLE_MIN,
  THRESHOLDED_GRADIENT_ANGLE_STEP,
  THRESHOLDED_GRADIENT_ROUGHNESS_MAX,
  THRESHOLDED_GRADIENT_ROUGHNESS_MIN,
  THRESHOLDED_GRADIENT_ROUGHNESS_STEP,
  VALUE_FRACTAL_GAIN_MAX,
  VALUE_FRACTAL_GAIN_MIN,
  VALUE_FRACTAL_GAIN_STEP,
  WORLEY_CELL_COUNT_MAX,
  WORLEY_CELL_COUNT_MIN,
  WORLEY_JITTER_MAX,
  WORLEY_JITTER_MIN,
  WORLEY_JITTER_STEP,
  createDefaultAldousBroderControlState,
  createDefaultBacktrackingControlState,
  createDefaultBinaryTreeControlState,
  createDefaultBlueprintGeneratorControlState,
  createDefaultBspRoomPartitionerControlState,
  createDefaultCellularAutomatonControlState,
  createDefaultCheckerDiamondLatticeControlState,
  createDefaultCirclePackingControlState,
  createDefaultConcentricBoxesControlState,
  createDefaultCorridorGridControlState,
  createDefaultCourtyardGeneratorControlState,
  createDefaultCutoutCollageControlState,
  createDefaultDiffusionLimitedAggregationControlState,
  createDefaultDrunkWalkPainterControlState,
  createDefaultDomainWarpedNoiseControlState,
  createDefaultDungeonRoomsControlState,
  createDefaultEllersControlState,
  createDefaultErosionDilationPipelineControlState,
  createDefaultGameOfLifeVariantsControlState,
  createDefaultGlitchBlocksControlState,
  createDefaultGrowingTreeControlState,
  createDefaultHuntAndKillControlState,
  createDefaultKaleidoscopeControlState,
  createDefaultKruskalsControlState,
  createDefaultLSystemTurtleControlState,
  createDefaultLineInterferenceControlState,
  createDefaultParticleFlowFieldControlState,
  createDefaultPerlinNoiseControlState,
  createDefaultPrimsControlState,
  createDefaultRandomNoiseControlState,
  createDefaultRadialSymmetryControlState,
  createDefaultReactionDiffusionApproximationControlState,
  createDefaultRecursiveDivisionControlState,
  createDefaultRoomScatterControlState,
  createDefaultRoseCurvesControlState,
  createDefaultSidewinderControlState,
  createDefaultStampBrushGeneratorControlState,
  createDefaultStripePlaidGeneratorControlState,
  createDefaultThresholdedGradientNoiseControlState,
  createDefaultTileableMotifRepeaterControlState,
  createDefaultTrivialMazeControlState,
  createDefaultValueFractalNoiseControlState,
  createDefaultVoronoiRegionCarverControlState,
  createDefaultWilsonsControlState,
  createDefaultWorleyNoiseControlState,
  dungeonRoomParameterLimits,
  generateLayoutRecords,
  mazeGridDimensionsForBlockSize,
  nextRandomSeed,
  randomSeedFromClock,
  recordsFromStarredKeys,
  type AldousBroderControlState,
  type BacktrackingControlState,
  type BinaryTreeControlState,
  type BinaryTreeSkew,
  type BlueprintGeneratorControlState,
  type BspRoomPartitionerControlState,
  type CellularAutomatonControlState,
  type CheckerDiamondLatticeControlState,
  type CheckerDiamondLatticeStyle,
  type CirclePackingControlState,
  type ConcentricBoxesControlState,
  type CorridorGridControlState,
  type CourtyardGeneratorControlState,
  type CutoutCollageControlState,
  type DiffusionLimitedAggregationControlState,
  type DlaSeedMode,
  type DrunkWalkPainterControlState,
  type DomainWarpedNoiseControlState,
  type DungeonRoomsControlState,
  type EllersControlState,
  type ErosionDilationPipelineControlState,
  type GameOfLifeVariant,
  type GameOfLifeVariantsControlState,
  type GeneratedLayoutRecord,
  type GenerateAlgorithmChoice,
  type GlitchBlocksControlState,
  type GrowingTreeControlState,
  type HuntAndKillControlState,
  type HuntOrder,
  type KaleidoscopeControlState,
  type KruskalsControlState,
  type LSystemPreset,
  type LSystemTurtleControlState,
  LINE_INTERFERENCE_SPACING_MAX,
  LINE_INTERFERENCE_SPACING_MIN,
  LINE_INTERFERENCE_STROKE_WIDTH_MAX,
  LINE_INTERFERENCE_STROKE_WIDTH_MIN,
  type LineInterferenceControlState,
  type MazeBlockSize,
  type ParticleFlowFieldControlState,
  type PerlinNoiseControlState,
  type PrimsControlState,
  type RadialSymmetryControlState,
  type RandomNoiseControlState,
  type RandomNoiseMirrorMode,
  REACTION_DIFFUSION_FEED_MAX,
  REACTION_DIFFUSION_FEED_MIN,
  REACTION_DIFFUSION_FEED_STEP,
  REACTION_DIFFUSION_ITERATIONS_MAX,
  REACTION_DIFFUSION_ITERATIONS_MIN,
  REACTION_DIFFUSION_KILL_MAX,
  REACTION_DIFFUSION_KILL_MIN,
  REACTION_DIFFUSION_KILL_STEP,
  REACTION_DIFFUSION_SPOT_COUNT_MAX,
  REACTION_DIFFUSION_SPOT_COUNT_MIN,
  type ReactionDiffusionApproximationControlState,
  type RecursiveDivisionControlState,
  ROOM_SCATTER_CONNECTOR_CHANCE_MAX,
  ROOM_SCATTER_CONNECTOR_CHANCE_MIN,
  ROOM_SCATTER_CONNECTOR_CHANCE_STEP,
  ROOM_SCATTER_GAP_MAX,
  ROOM_SCATTER_GAP_MIN,
  ROOM_SCATTER_ROOM_COUNT_MAX,
  ROOM_SCATTER_ROOM_COUNT_MIN,
  ROOM_SCATTER_ROOM_SIZE_MAX,
  ROOM_SCATTER_ROOM_SIZE_MIN,
  type RoomScatterControlState,
  type RoseCurvesControlState,
  type SidewinderControlState,
  type StampBrushGeneratorControlState,
  type StampBrushType,
  STAMP_BRUSH_COUNT_MAX,
  STAMP_BRUSH_COUNT_MIN,
  STAMP_BRUSH_SCATTER_MAX,
  STAMP_BRUSH_SCATTER_MIN,
  STAMP_BRUSH_SIZE_MAX,
  STAMP_BRUSH_SIZE_MIN,
  STAMP_BRUSH_TYPE_OPTIONS,
  STRIPE_PLAID_BAND_WIDTH_MAX,
  STRIPE_PLAID_BAND_WIDTH_MIN,
  STRIPE_PLAID_MODE_OPTIONS,
  STRIPE_PLAID_OFFSET_MAX,
  STRIPE_PLAID_OFFSET_MIN,
  STRIPE_PLAID_SPACING_MAX,
  STRIPE_PLAID_SPACING_MIN,
  type StripePlaidGeneratorControlState,
  type StripePlaidMode,
  type ThresholdedGradientNoiseControlState,
  type TileableMotifRepeaterControlState,
  type TileableMotifType,
  type TrivialMazeControlState,
  type TrivialMazeType,
  TILEABLE_MOTIF_JITTER_MAX,
  TILEABLE_MOTIF_JITTER_MIN,
  TILEABLE_MOTIF_SIZE_MAX,
  TILEABLE_MOTIF_SIZE_MIN,
  TILEABLE_MOTIF_SPACING_MAX,
  TILEABLE_MOTIF_SPACING_MIN,
  TILEABLE_MOTIF_TYPE_OPTIONS,
  TRIVIAL_MAZE_TYPE_OPTIONS,
  type ValueFractalNoiseControlState,
  VORONOI_JITTER_MAX,
  VORONOI_JITTER_MIN,
  VORONOI_JITTER_STEP,
  VORONOI_RIDGE_WIDTH_MAX,
  VORONOI_RIDGE_WIDTH_MIN,
  VORONOI_RIDGE_WIDTH_STEP,
  VORONOI_SITE_COUNT_MAX,
  VORONOI_SITE_COUNT_MIN,
  type VoronoiRegionCarverControlState,
  type WilsonsControlState,
  type WorleyNoiseControlState,
} from "@/web/src/generatedLayouts";

type GenerateBrowserDialogProps = Readonly<{
  starredKeys: ReadonlySet<string>;
  onToggleStar: (wallKey: string) => void;
  onImport: (wallKey: string) => void;
  onClose: () => void;
}>;

type GeneratedRecordCardProps = Readonly<{
  record: GeneratedLayoutRecord;
  selected: boolean;
  starred: boolean;
  onSelect: (wallKey: string) => void;
  onImport: (wallKey: string) => void;
  onToggleStar: (wallKey: string) => void;
}>;

type ParameterToggleProps = Readonly<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}>;

type RandomNoiseSettingsPanelProps = Readonly<{
  controls: RandomNoiseControlState;
  onUpdate: <K extends keyof RandomNoiseControlState>(
    key: K,
    nextValue: Partial<RandomNoiseControlState[K]>,
  ) => void;
}>;

type PerlinNoiseSettingsPanelProps = Readonly<{
  controls: PerlinNoiseControlState;
  onUpdate: <K extends keyof PerlinNoiseControlState>(
    key: K,
    nextValue: Partial<PerlinNoiseControlState[K]>,
  ) => void;
}>;

type ValueFractalNoiseSettingsPanelProps = Readonly<{
  controls: ValueFractalNoiseControlState;
  onUpdate: <K extends keyof ValueFractalNoiseControlState>(
    key: K,
    nextValue: Partial<ValueFractalNoiseControlState[K]>,
  ) => void;
}>;

type WorleyNoiseSettingsPanelProps = Readonly<{
  controls: WorleyNoiseControlState;
  onUpdate: <K extends keyof WorleyNoiseControlState>(
    key: K,
    nextValue: Partial<WorleyNoiseControlState[K]>,
  ) => void;
}>;

type ThresholdedGradientNoiseSettingsPanelProps = Readonly<{
  controls: ThresholdedGradientNoiseControlState;
  onUpdate: <K extends keyof ThresholdedGradientNoiseControlState>(
    key: K,
    nextValue: Partial<ThresholdedGradientNoiseControlState[K]>,
  ) => void;
}>;

type DomainWarpedNoiseSettingsPanelProps = Readonly<{
  controls: DomainWarpedNoiseControlState;
  onUpdate: <K extends keyof DomainWarpedNoiseControlState>(
    key: K,
    nextValue: Partial<DomainWarpedNoiseControlState[K]>,
  ) => void;
}>;

type RadialSymmetrySettingsPanelProps = Readonly<{
  controls: RadialSymmetryControlState;
  onUpdate: <K extends keyof RadialSymmetryControlState>(
    key: K,
    nextValue: Partial<RadialSymmetryControlState[K]>,
  ) => void;
}>;

type KaleidoscopeSettingsPanelProps = Readonly<{
  controls: KaleidoscopeControlState;
  onUpdate: <K extends keyof KaleidoscopeControlState>(
    key: K,
    nextValue: Partial<KaleidoscopeControlState[K]>,
  ) => void;
}>;

type LSystemTurtleSettingsPanelProps = Readonly<{
  controls: LSystemTurtleControlState;
  onUpdate: <K extends keyof LSystemTurtleControlState>(
    key: K,
    nextValue: Partial<LSystemTurtleControlState[K]>,
  ) => void;
}>;

type RoseCurvesSettingsPanelProps = Readonly<{
  controls: RoseCurvesControlState;
  onUpdate: <K extends keyof RoseCurvesControlState>(
    key: K,
    nextValue: Partial<RoseCurvesControlState[K]>,
  ) => void;
}>;

type TileableMotifRepeaterSettingsPanelProps = Readonly<{
  controls: TileableMotifRepeaterControlState;
  onUpdate: <K extends keyof TileableMotifRepeaterControlState>(
    key: K,
    nextValue: Partial<TileableMotifRepeaterControlState[K]>,
  ) => void;
}>;

type BspRoomPartitionerSettingsPanelProps = Readonly<{
  controls: BspRoomPartitionerControlState;
  onUpdate: <K extends keyof BspRoomPartitionerControlState>(
    key: K,
    nextValue: Partial<BspRoomPartitionerControlState[K]>,
  ) => void;
}>;

type CorridorGridSettingsPanelProps = Readonly<{
  controls: CorridorGridControlState;
  onUpdate: <K extends keyof CorridorGridControlState>(
    key: K,
    nextValue: Partial<CorridorGridControlState[K]>,
  ) => void;
}>;

type RoomScatterSettingsPanelProps = Readonly<{
  controls: RoomScatterControlState;
  onUpdate: <K extends keyof RoomScatterControlState>(
    key: K,
    nextValue: Partial<RoomScatterControlState[K]>,
  ) => void;
}>;

type CourtyardGeneratorSettingsPanelProps = Readonly<{
  controls: CourtyardGeneratorControlState;
  onUpdate: <K extends keyof CourtyardGeneratorControlState>(
    key: K,
    nextValue: Partial<CourtyardGeneratorControlState[K]>,
  ) => void;
}>;

type BlueprintGeneratorSettingsPanelProps = Readonly<{
  controls: BlueprintGeneratorControlState;
  onUpdate: <K extends keyof BlueprintGeneratorControlState>(
    key: K,
    nextValue: Partial<BlueprintGeneratorControlState[K]>,
  ) => void;
}>;

type StripePlaidGeneratorSettingsPanelProps = Readonly<{
  controls: StripePlaidGeneratorControlState;
  onUpdate: <K extends keyof StripePlaidGeneratorControlState>(
    key: K,
    nextValue: Partial<StripePlaidGeneratorControlState[K]>,
  ) => void;
}>;

type CheckerDiamondLatticeSettingsPanelProps = Readonly<{
  controls: CheckerDiamondLatticeControlState;
  onUpdate: <K extends keyof CheckerDiamondLatticeControlState>(
    key: K,
    nextValue: Partial<CheckerDiamondLatticeControlState[K]>,
  ) => void;
}>;

type ConcentricBoxesSettingsPanelProps = Readonly<{
  controls: ConcentricBoxesControlState;
  onUpdate: <K extends keyof ConcentricBoxesControlState>(
    key: K,
    nextValue: Partial<ConcentricBoxesControlState[K]>,
  ) => void;
}>;

type LineInterferenceSettingsPanelProps = Readonly<{
  controls: LineInterferenceControlState;
  onUpdate: <K extends keyof LineInterferenceControlState>(
    key: K,
    nextValue: Partial<LineInterferenceControlState[K]>,
  ) => void;
}>;

type CirclePackingSettingsPanelProps = Readonly<{
  controls: CirclePackingControlState;
  onUpdate: <K extends keyof CirclePackingControlState>(
    key: K,
    nextValue: Partial<CirclePackingControlState[K]>,
  ) => void;
}>;

type DrunkWalkPainterSettingsPanelProps = Readonly<{
  controls: DrunkWalkPainterControlState;
  onUpdate: <K extends keyof DrunkWalkPainterControlState>(
    key: K,
    nextValue: Partial<DrunkWalkPainterControlState[K]>,
  ) => void;
}>;

type ParticleFlowFieldSettingsPanelProps = Readonly<{
  controls: ParticleFlowFieldControlState;
  onUpdate: <K extends keyof ParticleFlowFieldControlState>(
    key: K,
    nextValue: Partial<ParticleFlowFieldControlState[K]>,
  ) => void;
}>;

type StampBrushGeneratorSettingsPanelProps = Readonly<{
  controls: StampBrushGeneratorControlState;
  onUpdate: <K extends keyof StampBrushGeneratorControlState>(
    key: K,
    nextValue: Partial<StampBrushGeneratorControlState[K]>,
  ) => void;
}>;

type CutoutCollageSettingsPanelProps = Readonly<{
  controls: CutoutCollageControlState;
  onUpdate: <K extends keyof CutoutCollageControlState>(
    key: K,
    nextValue: Partial<CutoutCollageControlState[K]>,
  ) => void;
}>;

type GlitchBlocksSettingsPanelProps = Readonly<{
  controls: GlitchBlocksControlState;
  onUpdate: <K extends keyof GlitchBlocksControlState>(
    key: K,
    nextValue: Partial<GlitchBlocksControlState[K]>,
  ) => void;
}>;

type GameOfLifeVariantsSettingsPanelProps = Readonly<{
  controls: GameOfLifeVariantsControlState;
  onUpdate: <K extends keyof GameOfLifeVariantsControlState>(
    key: K,
    nextValue: Partial<GameOfLifeVariantsControlState[K]>,
  ) => void;
}>;

type DiffusionLimitedAggregationSettingsPanelProps = Readonly<{
  controls: DiffusionLimitedAggregationControlState;
  onUpdate: <K extends keyof DiffusionLimitedAggregationControlState>(
    key: K,
    nextValue: Partial<DiffusionLimitedAggregationControlState[K]>,
  ) => void;
}>;

type ReactionDiffusionApproximationSettingsPanelProps = Readonly<{
  controls: ReactionDiffusionApproximationControlState;
  onUpdate: <K extends keyof ReactionDiffusionApproximationControlState>(
    key: K,
    nextValue: Partial<ReactionDiffusionApproximationControlState[K]>,
  ) => void;
}>;

type VoronoiRegionCarverSettingsPanelProps = Readonly<{
  controls: VoronoiRegionCarverControlState;
  onUpdate: <K extends keyof VoronoiRegionCarverControlState>(
    key: K,
    nextValue: Partial<VoronoiRegionCarverControlState[K]>,
  ) => void;
}>;

type ErosionDilationPipelineSettingsPanelProps = Readonly<{
  controls: ErosionDilationPipelineControlState;
  onUpdate: <K extends keyof ErosionDilationPipelineControlState>(
    key: K,
    nextValue: Partial<ErosionDilationPipelineControlState[K]>,
  ) => void;
}>;

type BacktrackingSettingsPanelProps = Readonly<{
  controls: BacktrackingControlState;
  contentWidth: number;
  contentHeight: number;
  onUpdate: <K extends keyof BacktrackingControlState>(
    key: K,
    nextValue: Partial<BacktrackingControlState[K]>,
  ) => void;
}>;

type GrowingTreeSettingsPanelProps = Readonly<{
  controls: GrowingTreeControlState;
  contentWidth: number;
  contentHeight: number;
  onUpdate: <K extends keyof GrowingTreeControlState>(
    key: K,
    nextValue: Partial<GrowingTreeControlState[K]>,
  ) => void;
}>;

type PrimsSettingsPanelProps = Readonly<{
  controls: PrimsControlState;
  contentWidth: number;
  contentHeight: number;
  onUpdate: <K extends keyof PrimsControlState>(
    key: K,
    nextValue: Partial<PrimsControlState[K]>,
  ) => void;
}>;

type RecursiveDivisionSettingsPanelProps = Readonly<{
  controls: RecursiveDivisionControlState;
  onUpdate: <K extends keyof RecursiveDivisionControlState>(
    key: K,
    nextValue: Partial<RecursiveDivisionControlState[K]>,
  ) => void;
}>;

type KruskalsSettingsPanelProps = Readonly<{
  controls: KruskalsControlState;
  onUpdate: <K extends keyof KruskalsControlState>(
    key: K,
    nextValue: Partial<KruskalsControlState[K]>,
  ) => void;
}>;

type SidewinderSettingsPanelProps = Readonly<{
  controls: SidewinderControlState;
  onUpdate: <K extends keyof SidewinderControlState>(
    key: K,
    nextValue: Partial<SidewinderControlState[K]>,
  ) => void;
}>;

type BinaryTreeSettingsPanelProps = Readonly<{
  controls: BinaryTreeControlState;
  onUpdate: <K extends keyof BinaryTreeControlState>(
    key: K,
    nextValue: Partial<BinaryTreeControlState[K]>,
  ) => void;
}>;

type HuntAndKillSettingsPanelProps = Readonly<{
  controls: HuntAndKillControlState;
  onUpdate: <K extends keyof HuntAndKillControlState>(
    key: K,
    nextValue: Partial<HuntAndKillControlState[K]>,
  ) => void;
}>;

type WilsonsSettingsPanelProps = Readonly<{
  controls: WilsonsControlState;
  onUpdate: <K extends keyof WilsonsControlState>(
    key: K,
    nextValue: Partial<WilsonsControlState[K]>,
  ) => void;
}>;

type AldousBroderSettingsPanelProps = Readonly<{
  controls: AldousBroderControlState;
  onUpdate: <K extends keyof AldousBroderControlState>(
    key: K,
    nextValue: Partial<AldousBroderControlState[K]>,
  ) => void;
}>;

type EllersSettingsPanelProps = Readonly<{
  controls: EllersControlState;
  onUpdate: <K extends keyof EllersControlState>(
    key: K,
    nextValue: Partial<EllersControlState[K]>,
  ) => void;
}>;

type CellularAutomatonSettingsPanelProps = Readonly<{
  controls: CellularAutomatonControlState;
  onUpdate: <K extends keyof CellularAutomatonControlState>(
    key: K,
    nextValue: Partial<CellularAutomatonControlState[K]>,
  ) => void;
}>;

type DungeonRoomsSettingsPanelProps = Readonly<{
  controls: DungeonRoomsControlState;
  contentWidth: number;
  contentHeight: number;
  onUpdate: <K extends keyof DungeonRoomsControlState>(
    key: K,
    nextValue: Partial<DungeonRoomsControlState[K]>,
  ) => void;
}>;

type TrivialMazeSettingsPanelProps = Readonly<{
  controls: TrivialMazeControlState;
  onUpdate: <K extends keyof TrivialMazeControlState>(
    key: K,
    nextValue: Partial<TrivialMazeControlState[K]>,
  ) => void;
}>;

function stopEvent(event: SyntheticEvent): void {
  event.stopPropagation();
}

function formatMirrorLabel(mirror: RandomNoiseMirrorMode): string {
  switch (mirror) {
    case "horizontal":
      return "Horizontal";
    case "vertical":
      return "Vertical";
    case "quad":
      return "Quad";
    case "none":
      return "None";
  }
}

function formatNoiseBlockSizeLabel(blockSize: number): string {
  return `${blockSize}x${blockSize}`;
}

function sanitizeGeneratedLayoutDimension(value: number): number {
  return Math.max(
    GENERATED_LAYOUT_MIN_SIZE,
    Math.min(GENERATED_LAYOUT_MAX_SIZE, Math.round(value)),
  );
}

function formatCompactNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function formatLSystemPresetLabel(preset: LSystemPreset): string {
  switch (preset) {
    case "plant":
      return "Plant";
    case "dragon":
      return "Dragon";
    case "bush":
      return "Bush";
  }
}

function formatTileableMotifLabel(motif: TileableMotifType): string {
  switch (motif) {
    case "cross":
      return "Cross";
    case "diamond":
      return "Diamond";
    case "box":
      return "Box";
    case "chevron":
      return "Chevron";
    case "petal":
      return "Petal";
  }
}

function formatStripePlaidModeLabel(mode: StripePlaidMode): string {
  switch (mode) {
    case "horizontal":
      return "Horizontal";
    case "vertical":
      return "Vertical";
    case "plaid":
      return "Plaid";
  }
}

function formatCheckerDiamondLatticeStyleLabel(style: CheckerDiamondLatticeStyle): string {
  switch (style) {
    case "checker":
      return "Checker";
    case "diamond":
      return "Diamond";
    case "lattice":
      return "Lattice";
  }
}

function formatStampBrushTypeLabel(type: StampBrushType): string {
  switch (type) {
    case "mixed":
      return "Mixed";
    case "square":
      return "Square";
    case "circle":
      return "Circle";
    case "cross":
      return "Cross";
    case "bar":
      return "Bar";
  }
}

function formatGameOfLifeVariantLabel(variant: GameOfLifeVariant): string {
  switch (variant) {
    case "life":
      return "Life";
    case "highlife":
      return "HighLife";
    case "maze":
      return "Maze";
  }
}

function formatDlaSeedModeLabel(seedMode: DlaSeedMode): string {
  switch (seedMode) {
    case "point":
      return "Point";
    case "line":
      return "Line";
    case "cross":
      return "Cross";
  }
}

function formatMazeBlockSizeLabel(blockSize: MazeBlockSize): string {
  return MAZE_BLOCK_SIZE_OPTIONS.find((option) => option.value === blockSize)?.label ?? "1x1";
}

function formatBinaryTreeSkewLabel(skew: BinaryTreeSkew): string {
  switch (skew) {
    case "NW":
      return "North-West";
    case "NE":
      return "North-East";
    case "SW":
      return "South-West";
    case "SE":
      return "South-East";
  }
}

function formatHuntOrderLabel(huntOrder: HuntOrder): string {
  switch (huntOrder) {
    case "random":
      return "Random";
    case "serpentine":
      return "Serpentine";
  }
}

function GenerateSizeField({
  label,
  value,
  inputValue,
  disabled,
  onInputChange,
  onCommit,
  onValueChange,
  onStep,
}: Readonly<{
  label: string;
  value: number;
  inputValue: string;
  disabled: boolean;
  onInputChange: (next: string) => void;
  onCommit: () => void;
  onValueChange: (next: number) => void;
  onStep: (delta: number) => void;
}>): JSX.Element {
  return (
    <label className="fieldGroup generateField generateSizeField">
      <span className="fieldLabel">{label}</span>
      <div className="generateToolbarRangeRow">
        <input
          type="range"
          className="generateRangeInput generateToolbarRangeInput"
          min={GENERATED_LAYOUT_MIN_SIZE}
          max={GENERATED_LAYOUT_MAX_SIZE}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(event) => onValueChange(Number(event.target.value))}
        />
        <div className="generateStepperField">
          <input
            type="number"
            className="textInput generateSizeNumberInput"
            min={GENERATED_LAYOUT_MIN_SIZE}
            max={GENERATED_LAYOUT_MAX_SIZE}
            step={1}
            inputMode="numeric"
            value={inputValue}
            disabled={disabled}
            onChange={(event) => onInputChange(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              onCommit();
            }}
          />
          <div className="generateStepperButtons">
            <button
              type="button"
              className="generateStepperButton"
              disabled={disabled || value >= GENERATED_LAYOUT_MAX_SIZE}
              onClick={() => onStep(1)}
              aria-label={`Increase ${label.toLowerCase()}`}
            >
              +
            </button>
            <button
              type="button"
              className="generateStepperButton"
              disabled={disabled || value <= GENERATED_LAYOUT_MIN_SIZE}
              onClick={() => onStep(-1)}
              aria-label={`Decrease ${label.toLowerCase()}`}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </label>
  );
}

function formatTrivialMazeTypeLabel(mazeType: TrivialMazeType): string {
  switch (mazeType) {
    case "spiral":
      return "Spiral";
    case "serpentine":
      return "Serpentine";
  }
}

function GeneratedMaskPreview({ wallKey }: Readonly<{ wallKey: string }>): JSX.Element {
  const cells = useMemo(() => {
    const maskBytes = wallMaskBytesFromKey(wallKey);
    return Array.from(
      { length: GENERATED_LAYOUT_GRID_SIZE * GENERATED_LAYOUT_GRID_SIZE },
      (_, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        return ((maskBytes[byteIndex] ?? 0) & (1 << bitIndex)) !== 0;
      },
    );
  }, [wallKey]);

  return (
    <div className="generatePreviewGrid" aria-hidden="true">
      {cells.map((isWall, index) => (
        <span key={index} className={`generatePreviewCell ${isWall ? "wall" : "floor"}`} />
      ))}
    </div>
  );
}

function ParameterToggle({ checked, onChange }: ParameterToggleProps): JSX.Element {
  return (
    <label className="generateParameterToggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>Randomize</span>
    </label>
  );
}

function GeneratedRecordCard({
  record,
  selected,
  starred,
  onSelect,
  onImport,
  onToggleStar,
}: GeneratedRecordCardProps): JSX.Element {
  const cardTitle = record.summary ? `${record.title}: ${record.summary}` : record.title;

  return (
    <article
      className={`generateCard ${selected ? "selected" : ""}`}
      title={cardTitle}
      onClick={() => onSelect(record.wallKey)}
      onDoubleClick={() => onImport(record.wallKey)}
      onPointerDown={stopEvent}
    >
      <div className="generateCardPreview">
        <GeneratedMaskPreview wallKey={record.wallKey} />
      </div>
      <div className="generateCardTitle">{record.title}</div>
      <div className="generateCardFooter">
        <button
          type="button"
          className="secondaryButton generateCardImportButton"
          onClick={(event) => {
            stopEvent(event);
            onImport(record.wallKey);
          }}
        >
          Import
        </button>
        <button
          type="button"
          className={`generateStarButton ${starred ? "active" : ""}`}
          aria-label={starred ? "Remove star" : "Star generated layout"}
          title={starred ? "Remove star" : "Star generated layout"}
          onClick={(event) => {
            stopEvent(event);
            onToggleStar(record.wallKey);
          }}
        >
          {starred ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

function RandomNoiseSettingsPanel({
  controls,
  onUpdate,
}: RandomNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Random Noise</h3>
      <div className="fieldHint">Locked values stay fixed when you press Randomize.</div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Density</span>
          <ParameterToggle
            checked={controls.density.randomize}
            onChange={(checked) => onUpdate("density", { randomize: checked })}
          />
        </div>
        {controls.density.randomize ? (
          <div className="fieldHint">Varies between 12% and 66% per card.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={RANDOM_NOISE_DENSITY_MIN}
              max={RANDOM_NOISE_DENSITY_MAX}
              step={RANDOM_NOISE_DENSITY_STEP}
              value={controls.density.value}
              onChange={(event) => onUpdate("density", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.density.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
        </div>
        <div className="fieldHint">Defaults to 1x1. Switch to 2x2 for chunkier noise.</div>
        <select
          className="generateSelect"
          value={controls.blockSize.value}
          onChange={(event) => onUpdate("blockSize", { value: Number(event.target.value) })}
        >
          {RANDOM_NOISE_BLOCK_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Mirror</span>
          <ParameterToggle
            checked={controls.mirror.randomize}
            onChange={(checked) => onUpdate("mirror", { randomize: checked })}
          />
        </div>
        {controls.mirror.randomize ? (
          <div className="fieldHint">Can vary between none, horizontal, vertical, and quad.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.mirror.value}
            onChange={(event) =>
              onUpdate("mirror", { value: event.target.value as RandomNoiseMirrorMode })
            }
          >
            {RANDOM_NOISE_MIRROR_OPTIONS.map((mirror) => (
              <option key={mirror} value={mirror}>
                {formatMirrorLabel(mirror)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={RANDOM_NOISE_SEED_MIN}
            max={RANDOM_NOISE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function PerlinNoiseSettingsPanel({
  controls,
  onUpdate,
}: PerlinNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Perlin Noise</h3>
      <div className="fieldHint">
        Smooth gradient noise for coastlines, caves, and landmass shapes.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Scale</span>
          <ParameterToggle
            checked={controls.scale.randomize}
            onChange={(checked) => onUpdate("scale", { randomize: checked })}
          />
        </div>
        {controls.scale.randomize ? (
          <div className="fieldHint">
            Varies the feature size from broad masses to tighter blobs.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_SCALE_MIN}
              max={NOISE_TERRAIN_SCALE_MAX}
              step={NOISE_TERRAIN_SCALE_STEP}
              value={controls.scale.value}
              onChange={(event) => onUpdate("scale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.scale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Octaves</span>
          <ParameterToggle
            checked={controls.octaves.randomize}
            onChange={(checked) => onUpdate("octaves", { randomize: checked })}
          />
        </div>
        {controls.octaves.randomize ? (
          <div className="fieldHint">Higher octaves add smaller secondary detail to the field.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_OCTAVES_MIN}
              max={NOISE_TERRAIN_OCTAVES_MAX}
              step={1}
              value={controls.octaves.value}
              onChange={(event) => onUpdate("octaves", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.octaves.value}</div>
          </div>
        )}
      </section>

      <NoiseTerrainBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ValueFractalNoiseSettingsPanel({
  controls,
  onUpdate,
}: ValueFractalNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Value Noise / Fractal Noise</h3>
      <div className="fieldHint">Layered value noise with explicit octave and gain control.</div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Scale</span>
          <ParameterToggle
            checked={controls.scale.randomize}
            onChange={(checked) => onUpdate("scale", { randomize: checked })}
          />
        </div>
        {controls.scale.randomize ? (
          <div className="fieldHint">Controls how large the broad value-noise regions are.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_SCALE_MIN}
              max={NOISE_TERRAIN_SCALE_MAX}
              step={NOISE_TERRAIN_SCALE_STEP}
              value={controls.scale.value}
              onChange={(event) => onUpdate("scale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.scale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Octaves</span>
          <ParameterToggle
            checked={controls.octaves.randomize}
            onChange={(checked) => onUpdate("octaves", { randomize: checked })}
          />
        </div>
        {controls.octaves.randomize ? (
          <div className="fieldHint">Adds progressively smaller layers of value noise.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_OCTAVES_MIN}
              max={NOISE_TERRAIN_OCTAVES_MAX}
              step={1}
              value={controls.octaves.value}
              onChange={(event) => onUpdate("octaves", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.octaves.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Gain</span>
          <ParameterToggle
            checked={controls.gain.randomize}
            onChange={(checked) => onUpdate("gain", { randomize: checked })}
          />
        </div>
        {controls.gain.randomize ? (
          <div className="fieldHint">
            Lower gain keeps later octaves subtle; higher gain keeps them visible.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={VALUE_FRACTAL_GAIN_MIN}
              max={VALUE_FRACTAL_GAIN_MAX}
              step={VALUE_FRACTAL_GAIN_STEP}
              value={controls.gain.value}
              onChange={(event) => onUpdate("gain", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.gain.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <NoiseTerrainBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function WorleyNoiseSettingsPanel({
  controls,
  onUpdate,
}: WorleyNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Worley / Cellular Noise</h3>
      <div className="fieldHint">
        Nearest-point distance fields for cells, cracks, islands, and chambers.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Cell Count</span>
          <ParameterToggle
            checked={controls.cellCount.randomize}
            onChange={(checked) => onUpdate("cellCount", { randomize: checked })}
          />
        </div>
        {controls.cellCount.randomize ? (
          <div className="fieldHint">Controls how many feature cells span the map.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={WORLEY_CELL_COUNT_MIN}
              max={WORLEY_CELL_COUNT_MAX}
              step={1}
              value={controls.cellCount.value}
              onChange={(event) => onUpdate("cellCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.cellCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Jitter</span>
          <ParameterToggle
            checked={controls.jitter.randomize}
            onChange={(checked) => onUpdate("jitter", { randomize: checked })}
          />
        </div>
        {controls.jitter.randomize ? (
          <div className="fieldHint">
            Higher jitter pushes feature points off-center for messier cells.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={WORLEY_JITTER_MIN}
              max={WORLEY_JITTER_MAX}
              step={WORLEY_JITTER_STEP}
              value={controls.jitter.value}
              onChange={(event) => onUpdate("jitter", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.jitter.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <NoiseTerrainBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ThresholdedGradientNoiseSettingsPanel({
  controls,
  onUpdate,
}: ThresholdedGradientNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Thresholded Gradient Noise</h3>
      <div className="fieldHint">
        Directional banding with roughness for dunes, ridges, and cliff lines.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Band Scale</span>
          <ParameterToggle
            checked={controls.scale.randomize}
            onChange={(checked) => onUpdate("scale", { randomize: checked })}
          />
        </div>
        {controls.scale.randomize ? (
          <div className="fieldHint">Controls how many directional bands cross the map.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_SCALE_MIN}
              max={NOISE_TERRAIN_SCALE_MAX}
              step={NOISE_TERRAIN_SCALE_STEP}
              value={controls.scale.value}
              onChange={(event) => onUpdate("scale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.scale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Angle</span>
          <ParameterToggle
            checked={controls.angle.randomize}
            onChange={(checked) => onUpdate("angle", { randomize: checked })}
          />
        </div>
        {controls.angle.randomize ? (
          <div className="fieldHint">Rotates the directional bands through the map.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={THRESHOLDED_GRADIENT_ANGLE_MIN}
              max={THRESHOLDED_GRADIENT_ANGLE_MAX}
              step={THRESHOLDED_GRADIENT_ANGLE_STEP}
              value={controls.angle.value}
              onChange={(event) => onUpdate("angle", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.angle.value}°</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Roughness</span>
          <ParameterToggle
            checked={controls.roughness.randomize}
            onChange={(checked) => onUpdate("roughness", { randomize: checked })}
          />
        </div>
        {controls.roughness.randomize ? (
          <div className="fieldHint">Adds noise into the bands so they break and wobble.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={THRESHOLDED_GRADIENT_ROUGHNESS_MIN}
              max={THRESHOLDED_GRADIENT_ROUGHNESS_MAX}
              step={THRESHOLDED_GRADIENT_ROUGHNESS_STEP}
              value={controls.roughness.value}
              onChange={(event) => onUpdate("roughness", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.roughness.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <NoiseTerrainBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function DomainWarpedNoiseSettingsPanel({
  controls,
  onUpdate,
}: DomainWarpedNoiseSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Domain-Warped Noise</h3>
      <div className="fieldHint">
        Warps a smooth noise field through a second field for chaotic terrain.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Scale</span>
          <ParameterToggle
            checked={controls.scale.randomize}
            onChange={(checked) => onUpdate("scale", { randomize: checked })}
          />
        </div>
        {controls.scale.randomize ? (
          <div className="fieldHint">
            Controls the underlying noise feature size before warping.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_SCALE_MIN}
              max={NOISE_TERRAIN_SCALE_MAX}
              step={NOISE_TERRAIN_SCALE_STEP}
              value={controls.scale.value}
              onChange={(event) => onUpdate("scale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.scale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Octaves</span>
          <ParameterToggle
            checked={controls.octaves.randomize}
            onChange={(checked) => onUpdate("octaves", { randomize: checked })}
          />
        </div>
        {controls.octaves.randomize ? (
          <div className="fieldHint">Adds smaller post-warp detail into the sampled field.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_OCTAVES_MIN}
              max={NOISE_TERRAIN_OCTAVES_MAX}
              step={1}
              value={controls.octaves.value}
              onChange={(event) => onUpdate("octaves", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.octaves.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Warp Scale</span>
          <ParameterToggle
            checked={controls.warpScale.randomize}
            onChange={(checked) => onUpdate("warpScale", { randomize: checked })}
          />
        </div>
        {controls.warpScale.randomize ? (
          <div className="fieldHint">Controls how broad the warping field is.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DOMAIN_WARP_SCALE_MIN}
              max={DOMAIN_WARP_SCALE_MAX}
              step={DOMAIN_WARP_SCALE_STEP}
              value={controls.warpScale.value}
              onChange={(event) => onUpdate("warpScale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.warpScale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Warp Strength</span>
          <ParameterToggle
            checked={controls.warpStrength.randomize}
            onChange={(checked) => onUpdate("warpStrength", { randomize: checked })}
          />
        </div>
        {controls.warpStrength.randomize ? (
          <div className="fieldHint">Controls how far the sample positions get displaced.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DOMAIN_WARP_STRENGTH_MIN}
              max={DOMAIN_WARP_STRENGTH_MAX}
              step={DOMAIN_WARP_STRENGTH_STEP}
              value={controls.warpStrength.value}
              onChange={(event) => onUpdate("warpStrength", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.warpStrength.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <NoiseTerrainBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function NoiseTerrainBaseSections<
  T extends {
    seed: { randomize: boolean; value: number };
    blockSize: { randomize: boolean; value: number };
    threshold: { randomize: boolean; value: number };
  },
>({
  controls,
  onUpdate,
}: Readonly<{
  controls: T;
  onUpdate: <K extends keyof T>(key: K, nextValue: Partial<T[K]>) => void;
}>): JSX.Element {
  return (
    <>
      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Threshold</span>
          <ParameterToggle
            checked={controls.threshold.randomize}
            onChange={(checked) =>
              onUpdate(
                "threshold" as keyof T,
                { randomize: checked } as unknown as Partial<T[keyof T]>,
              )
            }
          />
        </div>
        {controls.threshold.randomize ? (
          <div className="fieldHint">
            Varies the cutoff used to turn the field into walls and floors.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_THRESHOLD_MIN}
              max={NOISE_TERRAIN_THRESHOLD_MAX}
              step={NOISE_TERRAIN_THRESHOLD_STEP}
              value={controls.threshold.value}
              onChange={(event) =>
                onUpdate(
                  "threshold" as keyof T,
                  { value: Number(event.target.value) } as unknown as Partial<T[keyof T]>,
                )
              }
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.threshold.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
        </div>
        <div className="fieldHint">Defaults to 1x1. Switch to 2x2 for chunkier terrain.</div>
        <select
          className="generateSelect"
          value={controls.blockSize.value}
          onChange={(event) =>
            onUpdate(
              "blockSize" as keyof T,
              { value: Number(event.target.value) } as unknown as Partial<T[keyof T]>,
            )
          }
        >
          {RANDOM_NOISE_BLOCK_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {formatNoiseBlockSizeLabel(size)}
            </option>
          ))}
        </select>
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) =>
              onUpdate("seed" as keyof T, { randomize: checked } as unknown as Partial<T[keyof T]>)
            }
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={RANDOM_NOISE_SEED_MIN}
            max={RANDOM_NOISE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) =>
              onUpdate(
                "seed" as keyof T,
                { value: Number(event.target.value) } as unknown as Partial<T[keyof T]>,
              )
            }
          />
        )}
      </section>
    </>
  );
}

function OrnamentBaseSections<
  T extends {
    seed: { randomize: boolean; value: number };
    blockSize: { randomize: boolean; value: number };
  },
>({
  controls,
  onUpdate,
}: Readonly<{
  controls: T;
  onUpdate: <K extends keyof T>(key: K, nextValue: Partial<T[K]>) => void;
}>): JSX.Element {
  return (
    <>
      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
        </div>
        <div className="fieldHint">Defaults to 1x1. Switch to 2x2 for chunkier layouts.</div>
        <select
          className="generateSelect"
          value={controls.blockSize.value}
          onChange={(event) =>
            onUpdate(
              "blockSize" as keyof T,
              { value: Number(event.target.value) } as unknown as Partial<T[keyof T]>,
            )
          }
        >
          {RANDOM_NOISE_BLOCK_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {formatNoiseBlockSizeLabel(size)}
            </option>
          ))}
        </select>
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) =>
              onUpdate("seed" as keyof T, { randomize: checked } as unknown as Partial<T[keyof T]>)
            }
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={RANDOM_NOISE_SEED_MIN}
            max={RANDOM_NOISE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) =>
              onUpdate(
                "seed" as keyof T,
                { value: Number(event.target.value) } as unknown as Partial<T[keyof T]>,
              )
            }
          />
        )}
      </section>
    </>
  );
}

function RadialSymmetrySettingsPanel({
  controls,
  onUpdate,
}: RadialSymmetrySettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Radial Symmetry</h3>
      <div className="fieldHint">
        Builds rings and spokes into medallion-like symmetric wall sets.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Folds</span>
          <ParameterToggle
            checked={controls.folds.randomize}
            onChange={(checked) => onUpdate("folds", { randomize: checked })}
          />
        </div>
        {controls.folds.randomize ? (
          <div className="fieldHint">Varies the number of repeated spokes around the center.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={RADIAL_SYMMETRY_FOLDS_MIN}
              max={RADIAL_SYMMETRY_FOLDS_MAX}
              step={1}
              value={controls.folds.value}
              onChange={(event) => onUpdate("folds", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.folds.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Rings</span>
          <ParameterToggle
            checked={controls.rings.randomize}
            onChange={(checked) => onUpdate("rings", { randomize: checked })}
          />
        </div>
        {controls.rings.randomize ? (
          <div className="fieldHint">
            Controls how many radial bands appear from center to edge.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={RADIAL_SYMMETRY_RINGS_MIN}
              max={RADIAL_SYMMETRY_RINGS_MAX}
              step={1}
              value={controls.rings.value}
              onChange={(event) => onUpdate("rings", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.rings.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Twist</span>
          <ParameterToggle
            checked={controls.twist.randomize}
            onChange={(checked) => onUpdate("twist", { randomize: checked })}
          />
        </div>
        {controls.twist.randomize ? (
          <div className="fieldHint">Rotates spoke alignment as the pattern moves outward.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={RADIAL_SYMMETRY_TWIST_MIN}
              max={RADIAL_SYMMETRY_TWIST_MAX}
              step={RADIAL_SYMMETRY_TWIST_STEP}
              value={controls.twist.value}
              onChange={(event) => onUpdate("twist", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.twist.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Band Width</span>
          <ParameterToggle
            checked={controls.thickness.randomize}
            onChange={(checked) => onUpdate("thickness", { randomize: checked })}
          />
        </div>
        {controls.thickness.randomize ? (
          <div className="fieldHint">Controls how thick the rings and spokes render.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={RADIAL_SYMMETRY_THICKNESS_MIN}
              max={RADIAL_SYMMETRY_THICKNESS_MAX}
              step={RADIAL_SYMMETRY_THICKNESS_STEP}
              value={controls.thickness.value}
              onChange={(event) => onUpdate("thickness", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.thickness.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function KaleidoscopeSettingsPanel({
  controls,
  onUpdate,
}: KaleidoscopeSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Kaleidoscope</h3>
      <div className="fieldHint">
        Samples a mirrored wedge field and repeats it around the center.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Segments</span>
          <ParameterToggle
            checked={controls.segments.randomize}
            onChange={(checked) => onUpdate("segments", { randomize: checked })}
          />
        </div>
        {controls.segments.randomize ? (
          <div className="fieldHint">
            Controls how many mirrored wedges repeat around the circle.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={KALEIDOSCOPE_SEGMENTS_MIN}
              max={KALEIDOSCOPE_SEGMENTS_MAX}
              step={1}
              value={controls.segments.value}
              onChange={(event) => onUpdate("segments", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.segments.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Scale</span>
          <ParameterToggle
            checked={controls.scale.randomize}
            onChange={(checked) => onUpdate("scale", { randomize: checked })}
          />
        </div>
        {controls.scale.randomize ? (
          <div className="fieldHint">Controls how dense the mirrored motif becomes.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={KALEIDOSCOPE_SCALE_MIN}
              max={KALEIDOSCOPE_SCALE_MAX}
              step={KALEIDOSCOPE_SCALE_STEP}
              value={controls.scale.value}
              onChange={(event) => onUpdate("scale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.scale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Threshold</span>
          <ParameterToggle
            checked={controls.threshold.randomize}
            onChange={(checked) => onUpdate("threshold", { randomize: checked })}
          />
        </div>
        {controls.threshold.randomize ? (
          <div className="fieldHint">
            Adjusts how much of the mirrored field becomes solid wall.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={NOISE_TERRAIN_THRESHOLD_MIN}
              max={NOISE_TERRAIN_THRESHOLD_MAX}
              step={NOISE_TERRAIN_THRESHOLD_STEP}
              value={controls.threshold.value}
              onChange={(event) => onUpdate("threshold", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.threshold.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function LSystemTurtleSettingsPanel({
  controls,
  onUpdate,
}: LSystemTurtleSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">L-System / Turtle Patterns</h3>
      <div className="fieldHint">
        Expands a rewrite system, then traces it with a turtle line drawer.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Preset</span>
          <ParameterToggle
            checked={controls.preset.randomize}
            onChange={(checked) => onUpdate("preset", { randomize: checked })}
          />
        </div>
        {controls.preset.randomize ? (
          <div className="fieldHint">
            Randomly switches between plant, dragon, and bush grammars.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.preset.value}
            onChange={(event) => onUpdate("preset", { value: event.target.value as LSystemPreset })}
          >
            {LSYSTEM_PRESET_OPTIONS.map((preset) => (
              <option key={preset} value={preset}>
                {formatLSystemPresetLabel(preset)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Iterations</span>
          <ParameterToggle
            checked={controls.iterations.randomize}
            onChange={(checked) => onUpdate("iterations", { randomize: checked })}
          />
        </div>
        {controls.iterations.randomize ? (
          <div className="fieldHint">Higher iterations create denser, more recursive linework.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={LSYSTEM_ITERATIONS_MIN}
              max={LSYSTEM_ITERATIONS_MAX}
              step={1}
              value={controls.iterations.value}
              onChange={(event) => onUpdate("iterations", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.iterations.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Turn Angle</span>
          <ParameterToggle
            checked={controls.turnAngle.randomize}
            onChange={(checked) => onUpdate("turnAngle", { randomize: checked })}
          />
        </div>
        {controls.turnAngle.randomize ? (
          <div className="fieldHint">Controls the turtle turn used by the grammar output.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={LSYSTEM_TURN_ANGLE_MIN}
              max={LSYSTEM_TURN_ANGLE_MAX}
              step={LSYSTEM_TURN_ANGLE_STEP}
              value={controls.turnAngle.value}
              onChange={(event) => onUpdate("turnAngle", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.turnAngle.value}°</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stroke Width</span>
          <ParameterToggle
            checked={controls.strokeWidth.randomize}
            onChange={(checked) => onUpdate("strokeWidth", { randomize: checked })}
          />
        </div>
        {controls.strokeWidth.randomize ? (
          <div className="fieldHint">Changes how thick the turtle path is drawn.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={LSYSTEM_STROKE_WIDTH_MIN}
              max={LSYSTEM_STROKE_WIDTH_MAX}
              step={1}
              value={controls.strokeWidth.value}
              onChange={(event) => onUpdate("strokeWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.strokeWidth.value}px</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function RoseCurvesSettingsPanel({
  controls,
  onUpdate,
}: RoseCurvesSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Rose Curves / Polar Patterns</h3>
      <div className="fieldHint">
        Draws polar curves that form petals, stars, and emblem shapes.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Petals</span>
          <ParameterToggle
            checked={controls.petals.randomize}
            onChange={(checked) => onUpdate("petals", { randomize: checked })}
          />
        </div>
        {controls.petals.randomize ? (
          <div className="fieldHint">Controls the primary petal count in the rose formula.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROSE_CURVE_PETALS_MIN}
              max={ROSE_CURVE_PETALS_MAX}
              step={1}
              value={controls.petals.value}
              onChange={(event) => onUpdate("petals", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.petals.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Harmonic</span>
          <ParameterToggle
            checked={controls.harmonic.randomize}
            onChange={(checked) => onUpdate("harmonic", { randomize: checked })}
          />
        </div>
        {controls.harmonic.randomize ? (
          <div className="fieldHint">Changes how many loops the rose uses before it closes.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROSE_CURVE_HARMONIC_MIN}
              max={ROSE_CURVE_HARMONIC_MAX}
              step={1}
              value={controls.harmonic.value}
              onChange={(event) => onUpdate("harmonic", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.harmonic.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Rotation</span>
          <ParameterToggle
            checked={controls.rotation.randomize}
            onChange={(checked) => onUpdate("rotation", { randomize: checked })}
          />
        </div>
        {controls.rotation.randomize ? (
          <div className="fieldHint">Rotates the entire curve before rasterizing it.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROSE_CURVE_ROTATION_MIN}
              max={ROSE_CURVE_ROTATION_MAX}
              step={ROSE_CURVE_ROTATION_STEP}
              value={controls.rotation.value}
              onChange={(event) => onUpdate("rotation", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.rotation.value}°</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stroke Width</span>
          <ParameterToggle
            checked={controls.strokeWidth.randomize}
            onChange={(checked) => onUpdate("strokeWidth", { randomize: checked })}
          />
        </div>
        {controls.strokeWidth.randomize ? (
          <div className="fieldHint">Changes how thick the rose path is drawn.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROSE_CURVE_STROKE_WIDTH_MIN}
              max={ROSE_CURVE_STROKE_WIDTH_MAX}
              step={1}
              value={controls.strokeWidth.value}
              onChange={(event) => onUpdate("strokeWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.strokeWidth.value}px</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function TileableMotifRepeaterSettingsPanel({
  controls,
  onUpdate,
}: TileableMotifRepeaterSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Tileable Motif Repeater</h3>
      <div className="fieldHint">
        Stamps a repeated motif grid with spacing, jitter, and rotation.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Motif</span>
          <ParameterToggle
            checked={controls.motif.randomize}
            onChange={(checked) => onUpdate("motif", { randomize: checked })}
          />
        </div>
        {controls.motif.randomize ? (
          <div className="fieldHint">
            Randomly switches between several simple geometric motif stamps.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.motif.value}
            onChange={(event) =>
              onUpdate("motif", { value: event.target.value as TileableMotifType })
            }
          >
            {TILEABLE_MOTIF_TYPE_OPTIONS.map((motif) => (
              <option key={motif} value={motif}>
                {formatTileableMotifLabel(motif)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Spacing</span>
          <ParameterToggle
            checked={controls.spacing.randomize}
            onChange={(checked) => onUpdate("spacing", { randomize: checked })}
          />
        </div>
        {controls.spacing.randomize ? (
          <div className="fieldHint">Controls the distance between motif centers.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={TILEABLE_MOTIF_SPACING_MIN}
              max={TILEABLE_MOTIF_SPACING_MAX}
              step={1}
              value={controls.spacing.value}
              onChange={(event) => onUpdate("spacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.spacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Motif Size</span>
          <ParameterToggle
            checked={controls.motifSize.randomize}
            onChange={(checked) => onUpdate("motifSize", { randomize: checked })}
          />
        </div>
        {controls.motifSize.randomize ? (
          <div className="fieldHint">Changes the local size of each stamped motif.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={TILEABLE_MOTIF_SIZE_MIN}
              max={TILEABLE_MOTIF_SIZE_MAX}
              step={1}
              value={controls.motifSize.value}
              onChange={(event) => onUpdate("motifSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.motifSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Jitter</span>
          <ParameterToggle
            checked={controls.jitter.randomize}
            onChange={(checked) => onUpdate("jitter", { randomize: checked })}
          />
        </div>
        {controls.jitter.randomize ? (
          <div className="fieldHint">
            Offsets each motif center by a small deterministic amount.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={TILEABLE_MOTIF_JITTER_MIN}
              max={TILEABLE_MOTIF_JITTER_MAX}
              step={1}
              value={controls.jitter.value}
              onChange={(event) => onUpdate("jitter", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.jitter.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Rotation</span>
          <ParameterToggle
            checked={controls.rotation.randomize}
            onChange={(checked) => onUpdate("rotation", { randomize: checked })}
          />
        </div>
        {controls.rotation.randomize ? (
          <div className="fieldHint">Rotates the motif stamp in 90-degree steps.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.rotation.value}
            onChange={(event) => onUpdate("rotation", { value: Number(event.target.value) })}
          >
            {RIGHT_ANGLE_ROTATION_OPTIONS.map((rotation) => (
              <option key={rotation} value={rotation}>
                {rotation}°
              </option>
            ))}
          </select>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function BspRoomPartitionerSettingsPanel({
  controls,
  onUpdate,
}: BspRoomPartitionerSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">BSP Room Partitioner</h3>
      <div className="fieldHint">
        Recursively splits the map into leaves, carves inset rooms, then reconnects siblings.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Split Depth</span>
          <ParameterToggle
            checked={controls.splitDepth.randomize}
            onChange={(checked) => onUpdate("splitDepth", { randomize: checked })}
          />
        </div>
        {controls.splitDepth.randomize ? (
          <div className="fieldHint">Controls how many recursive subdivisions get applied.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MIN}
              max={BSP_ROOM_PARTITIONER_SPLIT_DEPTH_MAX}
              step={1}
              value={controls.splitDepth.value}
              onChange={(event) => onUpdate("splitDepth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.splitDepth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Padding</span>
          <ParameterToggle
            checked={controls.roomPadding.randomize}
            onChange={(checked) => onUpdate("roomPadding", { randomize: checked })}
          />
        </div>
        {controls.roomPadding.randomize ? (
          <div className="fieldHint">Leaves more wall margin around each carved room.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BSP_ROOM_PARTITIONER_ROOM_PADDING_MIN}
              max={BSP_ROOM_PARTITIONER_ROOM_PADDING_MAX}
              step={1}
              value={controls.roomPadding.value}
              onChange={(event) => onUpdate("roomPadding", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.roomPadding.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Corridor Width</span>
          <ParameterToggle
            checked={controls.corridorWidth.randomize}
            onChange={(checked) => onUpdate("corridorWidth", { randomize: checked })}
          />
        </div>
        {controls.corridorWidth.randomize ? (
          <div className="fieldHint">Adjusts how thick the BSP reconnection hallways are.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MIN}
              max={BSP_ROOM_PARTITIONER_CORRIDOR_WIDTH_MAX}
              step={1}
              value={controls.corridorWidth.value}
              onChange={(event) => onUpdate("corridorWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.corridorWidth.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function CorridorGridSettingsPanel({
  controls,
  onUpdate,
}: CorridorGridSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Corridor Grid</h3>
      <div className="fieldHint">
        Draws a Manhattan-style wall grid and punches deterministic door openings through it.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Column Spacing</span>
          <ParameterToggle
            checked={controls.columnSpacing.randomize}
            onChange={(checked) => onUpdate("columnSpacing", { randomize: checked })}
          />
        </div>
        {controls.columnSpacing.randomize ? (
          <div className="fieldHint">Sets the distance between vertical wall bands.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CORRIDOR_GRID_COLUMN_SPACING_MIN}
              max={CORRIDOR_GRID_COLUMN_SPACING_MAX}
              step={1}
              value={controls.columnSpacing.value}
              onChange={(event) => onUpdate("columnSpacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.columnSpacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Row Spacing</span>
          <ParameterToggle
            checked={controls.rowSpacing.randomize}
            onChange={(checked) => onUpdate("rowSpacing", { randomize: checked })}
          />
        </div>
        {controls.rowSpacing.randomize ? (
          <div className="fieldHint">Sets the distance between horizontal wall bands.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CORRIDOR_GRID_ROW_SPACING_MIN}
              max={CORRIDOR_GRID_ROW_SPACING_MAX}
              step={1}
              value={controls.rowSpacing.value}
              onChange={(event) => onUpdate("rowSpacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.rowSpacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Wall Thickness</span>
          <ParameterToggle
            checked={controls.wallThickness.randomize}
            onChange={(checked) => onUpdate("wallThickness", { randomize: checked })}
          />
        </div>
        {controls.wallThickness.randomize ? (
          <div className="fieldHint">Makes the grid walls more delicate or more blocky.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CORRIDOR_GRID_WALL_THICKNESS_MIN}
              max={CORRIDOR_GRID_WALL_THICKNESS_MAX}
              step={1}
              value={controls.wallThickness.value}
              onChange={(event) => onUpdate("wallThickness", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.wallThickness.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Door Chance</span>
          <ParameterToggle
            checked={controls.gapChance.randomize}
            onChange={(checked) => onUpdate("gapChance", { randomize: checked })}
          />
        </div>
        {controls.gapChance.randomize ? (
          <div className="fieldHint">Higher values open more gaps through each wall segment.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CORRIDOR_GRID_GAP_CHANCE_MIN}
              max={CORRIDOR_GRID_GAP_CHANCE_MAX}
              step={CORRIDOR_GRID_GAP_CHANCE_STEP}
              value={controls.gapChance.value}
              onChange={(event) => onUpdate("gapChance", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.gapChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function RoomScatterSettingsPanel({
  controls,
  onUpdate,
}: RoomScatterSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Room Scatter</h3>
      <div className="fieldHint">
        Drops independent rooms into the field, then optionally reconnects some of them.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Count</span>
          <ParameterToggle
            checked={controls.roomCount.randomize}
            onChange={(checked) => onUpdate("roomCount", { randomize: checked })}
          />
        </div>
        {controls.roomCount.randomize ? (
          <div className="fieldHint">Controls how many rooms get attempted before linking.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROOM_SCATTER_ROOM_COUNT_MIN}
              max={ROOM_SCATTER_ROOM_COUNT_MAX}
              step={1}
              value={controls.roomCount.value}
              onChange={(event) => onUpdate("roomCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.roomCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Size</span>
          <ParameterToggle
            checked={controls.roomSize.randomize}
            onChange={(checked) => onUpdate("roomSize", { randomize: checked })}
          />
        </div>
        {controls.roomSize.randomize ? (
          <div className="fieldHint">Caps the maximum width and height of each scattered room.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROOM_SCATTER_ROOM_SIZE_MIN}
              max={ROOM_SCATTER_ROOM_SIZE_MAX}
              step={1}
              value={controls.roomSize.value}
              onChange={(event) => onUpdate("roomSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.roomSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Gap</span>
          <ParameterToggle
            checked={controls.gap.randomize}
            onChange={(checked) => onUpdate("gap", { randomize: checked })}
          />
        </div>
        {controls.gap.randomize ? (
          <div className="fieldHint">Enforces extra wall space between neighboring rooms.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROOM_SCATTER_GAP_MIN}
              max={ROOM_SCATTER_GAP_MAX}
              step={1}
              value={controls.gap.value}
              onChange={(event) => onUpdate("gap", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.gap.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Connector Chance</span>
          <ParameterToggle
            checked={controls.connectorChance.randomize}
            onChange={(checked) => onUpdate("connectorChance", { randomize: checked })}
          />
        </div>
        {controls.connectorChance.randomize ? (
          <div className="fieldHint">Higher values connect more rooms together with corridors.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={ROOM_SCATTER_CONNECTOR_CHANCE_MIN}
              max={ROOM_SCATTER_CONNECTOR_CHANCE_MAX}
              step={ROOM_SCATTER_CONNECTOR_CHANCE_STEP}
              value={controls.connectorChance.value}
              onChange={(event) =>
                onUpdate("connectorChance", { value: Number(event.target.value) })
              }
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.connectorChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function CourtyardGeneratorSettingsPanel({
  controls,
  onUpdate,
}: CourtyardGeneratorSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Courtyard Generator</h3>
      <div className="fieldHint">
        Stacks nested rectangular walls and punches aligned gates through each ring.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Ring Count</span>
          <ParameterToggle
            checked={controls.ringCount.randomize}
            onChange={(checked) => onUpdate("ringCount", { randomize: checked })}
          />
        </div>
        {controls.ringCount.randomize ? (
          <div className="fieldHint">Determines how many nested courtyards get drawn.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={COURTYARD_RING_COUNT_MIN}
              max={COURTYARD_RING_COUNT_MAX}
              step={1}
              value={controls.ringCount.value}
              onChange={(event) => onUpdate("ringCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.ringCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Ring Gap</span>
          <ParameterToggle
            checked={controls.ringGap.randomize}
            onChange={(checked) => onUpdate("ringGap", { randomize: checked })}
          />
        </div>
        {controls.ringGap.randomize ? (
          <div className="fieldHint">Leaves more open courtyard space between rings.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={COURTYARD_RING_GAP_MIN}
              max={COURTYARD_RING_GAP_MAX}
              step={1}
              value={controls.ringGap.value}
              onChange={(event) => onUpdate("ringGap", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.ringGap.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Gate Width</span>
          <ParameterToggle
            checked={controls.gateWidth.randomize}
            onChange={(checked) => onUpdate("gateWidth", { randomize: checked })}
          />
        </div>
        {controls.gateWidth.randomize ? (
          <div className="fieldHint">Controls how wide each courtyard gate is carved.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={COURTYARD_GATE_WIDTH_MIN}
              max={COURTYARD_GATE_WIDTH_MAX}
              step={1}
              value={controls.gateWidth.value}
              onChange={(event) => onUpdate("gateWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.gateWidth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Gate Offset</span>
          <ParameterToggle
            checked={controls.offset.randomize}
            onChange={(checked) => onUpdate("offset", { randomize: checked })}
          />
        </div>
        {controls.offset.randomize ? (
          <div className="fieldHint">
            Shifts gate placement away from dead center for each ring.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={COURTYARD_OFFSET_MIN}
              max={COURTYARD_OFFSET_MAX}
              step={1}
              value={controls.offset.value}
              onChange={(event) => onUpdate("offset", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.offset.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function BlueprintGeneratorSettingsPanel({
  controls,
  onUpdate,
}: BlueprintGeneratorSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Blueprint Generator</h3>
      <div className="fieldHint">
        Carves a central hall, selected wings, and optional pillar grids into a rigid floor plan.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Wing Count</span>
          <ParameterToggle
            checked={controls.wingCount.randomize}
            onChange={(checked) => onUpdate("wingCount", { randomize: checked })}
          />
        </div>
        {controls.wingCount.randomize ? (
          <div className="fieldHint">Chooses how many of the four cardinal wings are active.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BLUEPRINT_WING_COUNT_MIN}
              max={BLUEPRINT_WING_COUNT_MAX}
              step={1}
              value={controls.wingCount.value}
              onChange={(event) => onUpdate("wingCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.wingCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Hall Width</span>
          <ParameterToggle
            checked={controls.hallWidth.randomize}
            onChange={(checked) => onUpdate("hallWidth", { randomize: checked })}
          />
        </div>
        {controls.hallWidth.randomize ? (
          <div className="fieldHint">Sets the width of the main blueprint corridors.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BLUEPRINT_HALL_WIDTH_MIN}
              max={BLUEPRINT_HALL_WIDTH_MAX}
              step={1}
              value={controls.hallWidth.value}
              onChange={(event) => onUpdate("hallWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.hallWidth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Pillar Spacing</span>
          <ParameterToggle
            checked={controls.pillarSpacing.randomize}
            onChange={(checked) => onUpdate("pillarSpacing", { randomize: checked })}
          />
        </div>
        {controls.pillarSpacing.randomize ? (
          <div className="fieldHint">Zero disables pillars; larger values spread them out.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BLUEPRINT_PILLAR_SPACING_MIN}
              max={BLUEPRINT_PILLAR_SPACING_MAX}
              step={1}
              value={controls.pillarSpacing.value}
              onChange={(event) => onUpdate("pillarSpacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.pillarSpacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Chamber Depth</span>
          <ParameterToggle
            checked={controls.chamberDepth.randomize}
            onChange={(checked) => onUpdate("chamberDepth", { randomize: checked })}
          />
        </div>
        {controls.chamberDepth.randomize ? (
          <div className="fieldHint">Extends the outer wing chambers away from the main hall.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={BLUEPRINT_CHAMBER_DEPTH_MIN}
              max={BLUEPRINT_CHAMBER_DEPTH_MAX}
              step={1}
              value={controls.chamberDepth.value}
              onChange={(event) => onUpdate("chamberDepth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.chamberDepth.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function StripePlaidGeneratorSettingsPanel({
  controls,
  onUpdate,
}: StripePlaidGeneratorSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Stripe / Plaid Generator</h3>
      <div className="fieldHint">
        Builds horizontal bands, vertical bands, or plaid overlays from repeating stripe spacing.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Mode</span>
          <ParameterToggle
            checked={controls.mode.randomize}
            onChange={(checked) => onUpdate("mode", { randomize: checked })}
          />
        </div>
        {controls.mode.randomize ? (
          <div className="fieldHint">Can render horizontal, vertical, or plaid band sets.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.mode.value}
            onChange={(event) => onUpdate("mode", { value: event.target.value as StripePlaidMode })}
          >
            {STRIPE_PLAID_MODE_OPTIONS.map((mode) => (
              <option key={mode} value={mode}>
                {formatStripePlaidModeLabel(mode)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Spacing</span>
          <ParameterToggle
            checked={controls.spacing.randomize}
            onChange={(checked) => onUpdate("spacing", { randomize: checked })}
          />
        </div>
        {controls.spacing.randomize ? (
          <div className="fieldHint">Controls how far apart each stripe band repeats.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STRIPE_PLAID_SPACING_MIN}
              max={STRIPE_PLAID_SPACING_MAX}
              step={1}
              value={controls.spacing.value}
              onChange={(event) => onUpdate("spacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.spacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Band Width</span>
          <ParameterToggle
            checked={controls.bandWidth.randomize}
            onChange={(checked) => onUpdate("bandWidth", { randomize: checked })}
          />
        </div>
        {controls.bandWidth.randomize ? (
          <div className="fieldHint">Wider bands make heavier woven blocks and bars.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STRIPE_PLAID_BAND_WIDTH_MIN}
              max={STRIPE_PLAID_BAND_WIDTH_MAX}
              step={1}
              value={controls.bandWidth.value}
              onChange={(event) => onUpdate("bandWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.bandWidth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Offset</span>
          <ParameterToggle
            checked={controls.offset.randomize}
            onChange={(checked) => onUpdate("offset", { randomize: checked })}
          />
        </div>
        {controls.offset.randomize ? (
          <div className="fieldHint">
            Shifts the repeat phase so the bands don’t always start at zero.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STRIPE_PLAID_OFFSET_MIN}
              max={STRIPE_PLAID_OFFSET_MAX}
              step={1}
              value={controls.offset.value}
              onChange={(event) => onUpdate("offset", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.offset.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function CheckerDiamondLatticeSettingsPanel({
  controls,
  onUpdate,
}: CheckerDiamondLatticeSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Checker / Diamond / Lattice</h3>
      <div className="fieldHint">
        Chooses a regular tiling style, then scales and phases it across the source grid.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Style</span>
          <ParameterToggle
            checked={controls.style.randomize}
            onChange={(checked) => onUpdate("style", { randomize: checked })}
          />
        </div>
        {controls.style.randomize ? (
          <div className="fieldHint">
            Can switch between checkerboard fills, diamonds, and lattices.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.style.value}
            onChange={(event) =>
              onUpdate("style", {
                value: event.target.value as CheckerDiamondLatticeStyle,
              })
            }
          >
            {CHECKER_DIAMOND_LATTICE_STYLE_OPTIONS.map((style) => (
              <option key={style} value={style}>
                {formatCheckerDiamondLatticeStyleLabel(style)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Cell Size</span>
          <ParameterToggle
            checked={controls.cellSize.randomize}
            onChange={(checked) => onUpdate("cellSize", { randomize: checked })}
          />
        </div>
        {controls.cellSize.randomize ? (
          <div className="fieldHint">Larger cells make chunkier tilings with fewer repeats.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CHECKER_DIAMOND_CELL_SIZE_MIN}
              max={CHECKER_DIAMOND_CELL_SIZE_MAX}
              step={1}
              value={controls.cellSize.value}
              onChange={(event) => onUpdate("cellSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.cellSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Line Width</span>
          <ParameterToggle
            checked={controls.lineWidth.randomize}
            onChange={(checked) => onUpdate("lineWidth", { randomize: checked })}
          />
        </div>
        {controls.lineWidth.randomize ? (
          <div className="fieldHint">
            Controls how heavy the lattice or diamond outline becomes.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CHECKER_DIAMOND_LINE_WIDTH_MIN}
              max={CHECKER_DIAMOND_LINE_WIDTH_MAX}
              step={1}
              value={controls.lineWidth.value}
              onChange={(event) => onUpdate("lineWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.lineWidth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Phase</span>
          <ParameterToggle
            checked={controls.phase.randomize}
            onChange={(checked) => onUpdate("phase", { randomize: checked })}
          />
        </div>
        {controls.phase.randomize ? (
          <div className="fieldHint">
            Offsets the tiling so the pattern lands on different grid phases.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CHECKER_DIAMOND_PHASE_MIN}
              max={CHECKER_DIAMOND_PHASE_MAX}
              step={1}
              value={controls.phase.value}
              onChange={(event) => onUpdate("phase", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.phase.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ConcentricBoxesSettingsPanel({
  controls,
  onUpdate,
}: ConcentricBoxesSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Concentric Boxes</h3>
      <div className="fieldHint">
        Stacks nested rectangle strokes into target forms, ziggurats, and stepped frames.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Ring Count</span>
          <ParameterToggle
            checked={controls.ringCount.randomize}
            onChange={(checked) => onUpdate("ringCount", { randomize: checked })}
          />
        </div>
        {controls.ringCount.randomize ? (
          <div className="fieldHint">Determines how many nested rectangles are drawn.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CONCENTRIC_BOX_RING_COUNT_MIN}
              max={CONCENTRIC_BOX_RING_COUNT_MAX}
              step={1}
              value={controls.ringCount.value}
              onChange={(event) => onUpdate("ringCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.ringCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Gap</span>
          <ParameterToggle
            checked={controls.spacing.randomize}
            onChange={(checked) => onUpdate("spacing", { randomize: checked })}
          />
        </div>
        {controls.spacing.randomize ? (
          <div className="fieldHint">Sets how quickly each inner rectangle steps inward.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CONCENTRIC_BOX_SPACING_MIN}
              max={CONCENTRIC_BOX_SPACING_MAX}
              step={1}
              value={controls.spacing.value}
              onChange={(event) => onUpdate("spacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.spacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Line Width</span>
          <ParameterToggle
            checked={controls.lineWidth.randomize}
            onChange={(checked) => onUpdate("lineWidth", { randomize: checked })}
          />
        </div>
        {controls.lineWidth.randomize ? (
          <div className="fieldHint">Wider box lines make bolder stepped silhouettes.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CONCENTRIC_BOX_LINE_WIDTH_MIN}
              max={CONCENTRIC_BOX_LINE_WIDTH_MAX}
              step={1}
              value={controls.lineWidth.value}
              onChange={(event) => onUpdate("lineWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.lineWidth.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Drift</span>
          <ParameterToggle
            checked={controls.drift.randomize}
            onChange={(checked) => onUpdate("drift", { randomize: checked })}
          />
        </div>
        {controls.drift.randomize ? (
          <div className="fieldHint">Offsets each ring so the stack can skew into ziggurats.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CONCENTRIC_BOX_DRIFT_MIN}
              max={CONCENTRIC_BOX_DRIFT_MAX}
              step={1}
              value={controls.drift.value}
              onChange={(event) => onUpdate("drift", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.drift.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function LineInterferenceSettingsPanel({
  controls,
  onUpdate,
}: LineInterferenceSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Line Interference</h3>
      <div className="fieldHint">
        Layers two angled line fields on top of each other to create technical interference
        patterns.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Angle A</span>
          <ParameterToggle
            checked={controls.angleA.randomize}
            onChange={(checked) => onUpdate("angleA", { randomize: checked })}
          />
        </div>
        {controls.angleA.randomize ? (
          <div className="fieldHint">Controls the first line-field angle.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={THRESHOLDED_GRADIENT_ANGLE_MIN}
              max={THRESHOLDED_GRADIENT_ANGLE_MAX}
              step={THRESHOLDED_GRADIENT_ANGLE_STEP}
              value={controls.angleA.value}
              onChange={(event) => onUpdate("angleA", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.angleA.value}°</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Angle B</span>
          <ParameterToggle
            checked={controls.angleB.randomize}
            onChange={(checked) => onUpdate("angleB", { randomize: checked })}
          />
        </div>
        {controls.angleB.randomize ? (
          <div className="fieldHint">Controls the second field that crosses the first.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={THRESHOLDED_GRADIENT_ANGLE_MIN}
              max={THRESHOLDED_GRADIENT_ANGLE_MAX}
              step={THRESHOLDED_GRADIENT_ANGLE_STEP}
              value={controls.angleB.value}
              onChange={(event) => onUpdate("angleB", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.angleB.value}°</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Spacing</span>
          <ParameterToggle
            checked={controls.spacing.randomize}
            onChange={(checked) => onUpdate("spacing", { randomize: checked })}
          />
        </div>
        {controls.spacing.randomize ? (
          <div className="fieldHint">
            Tighter spacing increases moire density and crosshatching.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={LINE_INTERFERENCE_SPACING_MIN}
              max={LINE_INTERFERENCE_SPACING_MAX}
              step={1}
              value={controls.spacing.value}
              onChange={(event) => onUpdate("spacing", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.spacing.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stroke Width</span>
          <ParameterToggle
            checked={controls.strokeWidth.randomize}
            onChange={(checked) => onUpdate("strokeWidth", { randomize: checked })}
          />
        </div>
        {controls.strokeWidth.randomize ? (
          <div className="fieldHint">Thicker strokes create denser interference blocks.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={LINE_INTERFERENCE_STROKE_WIDTH_MIN}
              max={LINE_INTERFERENCE_STROKE_WIDTH_MAX}
              step={1}
              value={controls.strokeWidth.value}
              onChange={(event) => onUpdate("strokeWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.strokeWidth.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function CirclePackingSettingsPanel({
  controls,
  onUpdate,
}: CirclePackingSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Circle Packing</h3>
      <div className="fieldHint">
        Packs discs or rings into the source grid and turns their overlap into rounded wall
        clusters.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Circle Count</span>
          <ParameterToggle
            checked={controls.circleCount.randomize}
            onChange={(checked) => onUpdate("circleCount", { randomize: checked })}
          />
        </div>
        {controls.circleCount.randomize ? (
          <div className="fieldHint">More circles creates denser bubble fields and clumps.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CIRCLE_PACKING_COUNT_MIN}
              max={CIRCLE_PACKING_COUNT_MAX}
              step={1}
              value={controls.circleCount.value}
              onChange={(event) => onUpdate("circleCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.circleCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Min Radius</span>
          <ParameterToggle
            checked={controls.minRadius.randomize}
            onChange={(checked) => onUpdate("minRadius", { randomize: checked })}
          />
        </div>
        {controls.minRadius.randomize ? (
          <div className="fieldHint">
            Smaller minimums allow tight filler circles around larger ones.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CIRCLE_PACKING_MIN_RADIUS_MIN}
              max={CIRCLE_PACKING_MIN_RADIUS_MAX}
              step={1}
              value={controls.minRadius.value}
              onChange={(event) => onUpdate("minRadius", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.minRadius.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Max Radius</span>
          <ParameterToggle
            checked={controls.maxRadius.randomize}
            onChange={(checked) => onUpdate("maxRadius", { randomize: checked })}
          />
        </div>
        {controls.maxRadius.randomize ? (
          <div className="fieldHint">
            Larger maximums create dominant discs and wider rounded voids.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CIRCLE_PACKING_MAX_RADIUS_MIN}
              max={CIRCLE_PACKING_MAX_RADIUS_MAX}
              step={1}
              value={controls.maxRadius.value}
              onChange={(event) => onUpdate("maxRadius", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.maxRadius.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Outline</span>
          <ParameterToggle
            checked={controls.outline.randomize}
            onChange={(checked) => onUpdate("outline", { randomize: checked })}
          />
        </div>
        {controls.outline.randomize ? (
          <div className="fieldHint">
            Can switch between filled discs and hollow ring silhouettes.
          </div>
        ) : (
          <label className="generateBooleanField">
            <input
              type="checkbox"
              checked={controls.outline.value}
              onChange={(event) => onUpdate("outline", { value: event.target.checked })}
            />
            <span>Use ring outlines instead of filled discs</span>
          </label>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function DrunkWalkPainterSettingsPanel({
  controls,
  onUpdate,
}: DrunkWalkPainterSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Drunk Walk Painter</h3>
      <div className="fieldHint">
        Sends wandering painters through the grid, occasionally stamping chunky rooms into the
        scribble.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Walker Count</span>
          <ParameterToggle
            checked={controls.walkerCount.randomize}
            onChange={(checked) => onUpdate("walkerCount", { randomize: checked })}
          />
        </div>
        {controls.walkerCount.randomize ? (
          <div className="fieldHint">More walkers create layered trails and thicker tangles.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DRUNK_WALK_WALKER_COUNT_MIN}
              max={DRUNK_WALK_WALKER_COUNT_MAX}
              step={1}
              value={controls.walkerCount.value}
              onChange={(event) => onUpdate("walkerCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.walkerCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Steps</span>
          <ParameterToggle
            checked={controls.steps.randomize}
            onChange={(checked) => onUpdate("steps", { randomize: checked })}
          />
        </div>
        {controls.steps.randomize ? (
          <div className="fieldHint">
            Longer walks drift farther and overlap into bolder masses.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DRUNK_WALK_STEPS_MIN}
              max={DRUNK_WALK_STEPS_MAX}
              step={1}
              value={controls.steps.value}
              onChange={(event) => onUpdate("steps", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.steps.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Brush Size</span>
          <ParameterToggle
            checked={controls.brushSize.randomize}
            onChange={(checked) => onUpdate("brushSize", { randomize: checked })}
          />
        </div>
        {controls.brushSize.randomize ? (
          <div className="fieldHint">A larger brush thickens paths and smears out corners.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DRUNK_WALK_BRUSH_SIZE_MIN}
              max={DRUNK_WALK_BRUSH_SIZE_MAX}
              step={1}
              value={controls.brushSize.value}
              onChange={(event) => onUpdate("brushSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.brushSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Chance</span>
          <ParameterToggle
            checked={controls.roomChance.randomize}
            onChange={(checked) => onUpdate("roomChance", { randomize: checked })}
          />
        </div>
        {controls.roomChance.randomize ? (
          <div className="fieldHint">
            Occasional room stamps break trails into chambered graffiti.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DRUNK_WALK_ROOM_CHANCE_MIN}
              max={DRUNK_WALK_ROOM_CHANCE_MAX}
              step={DRUNK_WALK_ROOM_CHANCE_STEP}
              value={controls.roomChance.value}
              onChange={(event) => onUpdate("roomChance", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.roomChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ParticleFlowFieldSettingsPanel({
  controls,
  onUpdate,
}: ParticleFlowFieldSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Particle Flow Field</h3>
      <div className="fieldHint">
        Releases agents into a seeded vector field and traces their streamlines into wall ribbons.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Agent Count</span>
          <ParameterToggle
            checked={controls.agentCount.randomize}
            onChange={(checked) => onUpdate("agentCount", { randomize: checked })}
          />
        </div>
        {controls.agentCount.randomize ? (
          <div className="fieldHint">More agents produce denser braided currents.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={PARTICLE_FLOW_AGENT_COUNT_MIN}
              max={PARTICLE_FLOW_AGENT_COUNT_MAX}
              step={1}
              value={controls.agentCount.value}
              onChange={(event) => onUpdate("agentCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.agentCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Steps</span>
          <ParameterToggle
            checked={controls.steps.randomize}
            onChange={(checked) => onUpdate("steps", { randomize: checked })}
          />
        </div>
        {controls.steps.randomize ? (
          <div className="fieldHint">Longer traces let each particle ride the field farther.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={PARTICLE_FLOW_STEPS_MIN}
              max={PARTICLE_FLOW_STEPS_MAX}
              step={1}
              value={controls.steps.value}
              onChange={(event) => onUpdate("steps", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.steps.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Field Scale</span>
          <ParameterToggle
            checked={controls.fieldScale.randomize}
            onChange={(checked) => onUpdate("fieldScale", { randomize: checked })}
          />
        </div>
        {controls.fieldScale.randomize ? (
          <div className="fieldHint">
            Higher scale makes the flow twist and change direction faster.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={PARTICLE_FLOW_FIELD_SCALE_MIN}
              max={PARTICLE_FLOW_FIELD_SCALE_MAX}
              step={PARTICLE_FLOW_FIELD_SCALE_STEP}
              value={controls.fieldScale.value}
              onChange={(event) => onUpdate("fieldScale", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {formatCompactNumber(controls.fieldScale.value)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stroke Width</span>
          <ParameterToggle
            checked={controls.strokeWidth.randomize}
            onChange={(checked) => onUpdate("strokeWidth", { randomize: checked })}
          />
        </div>
        {controls.strokeWidth.randomize ? (
          <div className="fieldHint">Wider strokes turn the field into bolder flowing bands.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={PARTICLE_FLOW_STROKE_WIDTH_MIN}
              max={PARTICLE_FLOW_STROKE_WIDTH_MAX}
              step={1}
              value={controls.strokeWidth.value}
              onChange={(event) => onUpdate("strokeWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.strokeWidth.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function StampBrushGeneratorSettingsPanel({
  controls,
  onUpdate,
}: StampBrushGeneratorSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Stamp Brush Generator</h3>
      <div className="fieldHint">
        Repeats simple stamp primitives across the source grid for poster-like and glyph-like
        compositions.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stamp Type</span>
          <ParameterToggle
            checked={controls.stampType.randomize}
            onChange={(checked) => onUpdate("stampType", { randomize: checked })}
          />
        </div>
        {controls.stampType.randomize ? (
          <div className="fieldHint">Can mix squares, circles, crosses, and bars.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.stampType.value}
            onChange={(event) =>
              onUpdate("stampType", { value: event.target.value as StampBrushType })
            }
          >
            {STAMP_BRUSH_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {formatStampBrushTypeLabel(type)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stamp Count</span>
          <ParameterToggle
            checked={controls.stampCount.randomize}
            onChange={(checked) => onUpdate("stampCount", { randomize: checked })}
          />
        </div>
        {controls.stampCount.randomize ? (
          <div className="fieldHint">More stamps make the layout feel busier and more layered.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STAMP_BRUSH_COUNT_MIN}
              max={STAMP_BRUSH_COUNT_MAX}
              step={1}
              value={controls.stampCount.value}
              onChange={(event) => onUpdate("stampCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.stampCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stamp Size</span>
          <ParameterToggle
            checked={controls.stampSize.randomize}
            onChange={(checked) => onUpdate("stampSize", { randomize: checked })}
          />
        </div>
        {controls.stampSize.randomize ? (
          <div className="fieldHint">Larger primitives read more like symbols than texture.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STAMP_BRUSH_SIZE_MIN}
              max={STAMP_BRUSH_SIZE_MAX}
              step={1}
              value={controls.stampSize.value}
              onChange={(event) => onUpdate("stampSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.stampSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Scatter</span>
          <ParameterToggle
            checked={controls.scatter.randomize}
            onChange={(checked) => onUpdate("scatter", { randomize: checked })}
          />
        </div>
        {controls.scatter.randomize ? (
          <div className="fieldHint">
            Scatter loosens the lattice and makes the stamping less orderly.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={STAMP_BRUSH_SCATTER_MIN}
              max={STAMP_BRUSH_SCATTER_MAX}
              step={1}
              value={controls.scatter.value}
              onChange={(event) => onUpdate("scatter", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.scatter.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function CutoutCollageSettingsPanel({
  controls,
  onUpdate,
}: CutoutCollageSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Cutout Collage</h3>
      <div className="fieldHint">
        Adds and subtracts bold primitives to build chunky silhouettes and hard-edged holes.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Shape Count</span>
          <ParameterToggle
            checked={controls.shapeCount.randomize}
            onChange={(checked) => onUpdate("shapeCount", { randomize: checked })}
          />
        </div>
        {controls.shapeCount.randomize ? (
          <div className="fieldHint">More shapes create richer overlaps and cutout layering.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CUTOUT_COLLAGE_SHAPE_COUNT_MIN}
              max={CUTOUT_COLLAGE_SHAPE_COUNT_MAX}
              step={1}
              value={controls.shapeCount.value}
              onChange={(event) => onUpdate("shapeCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.shapeCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Min Size</span>
          <ParameterToggle
            checked={controls.minSize.randomize}
            onChange={(checked) => onUpdate("minSize", { randomize: checked })}
          />
        </div>
        {controls.minSize.randomize ? (
          <div className="fieldHint">Controls the smallest primitive that can appear.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CUTOUT_COLLAGE_MIN_SIZE_MIN}
              max={CUTOUT_COLLAGE_MIN_SIZE_MAX}
              step={1}
              value={controls.minSize.value}
              onChange={(event) => onUpdate("minSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.minSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Max Size</span>
          <ParameterToggle
            checked={controls.maxSize.randomize}
            onChange={(checked) => onUpdate("maxSize", { randomize: checked })}
          />
        </div>
        {controls.maxSize.randomize ? (
          <div className="fieldHint">
            Larger maximums let a few shapes dominate the composition.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CUTOUT_COLLAGE_MAX_SIZE_MIN}
              max={CUTOUT_COLLAGE_MAX_SIZE_MAX}
              step={1}
              value={controls.maxSize.value}
              onChange={(event) => onUpdate("maxSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.maxSize.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Subtract Chance</span>
          <ParameterToggle
            checked={controls.subtractChance.randomize}
            onChange={(checked) => onUpdate("subtractChance", { randomize: checked })}
          />
        </div>
        {controls.subtractChance.randomize ? (
          <div className="fieldHint">
            Higher subtraction punches more holes through the collage.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CUTOUT_COLLAGE_SUBTRACT_CHANCE_MIN}
              max={CUTOUT_COLLAGE_SUBTRACT_CHANCE_MAX}
              step={CUTOUT_COLLAGE_SUBTRACT_CHANCE_STEP}
              value={controls.subtractChance.value}
              onChange={(event) =>
                onUpdate("subtractChance", { value: Number(event.target.value) })
              }
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.subtractChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function GlitchBlocksSettingsPanel({
  controls,
  onUpdate,
}: GlitchBlocksSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Glitch Blocks</h3>
      <div className="fieldHint">
        Breaks scanlines and bands into offset fragments for corrupted-grid and video-noise layouts.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Band Count</span>
          <ParameterToggle
            checked={controls.bandCount.randomize}
            onChange={(checked) => onUpdate("bandCount", { randomize: checked })}
          />
        </div>
        {controls.bandCount.randomize ? (
          <div className="fieldHint">
            More bands add more broken scanlines and interference bars.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GLITCH_BLOCK_BAND_COUNT_MIN}
              max={GLITCH_BLOCK_BAND_COUNT_MAX}
              step={1}
              value={controls.bandCount.value}
              onChange={(event) => onUpdate("bandCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.bandCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Offset Range</span>
          <ParameterToggle
            checked={controls.offsetRange.randomize}
            onChange={(checked) => onUpdate("offsetRange", { randomize: checked })}
          />
        </div>
        {controls.offsetRange.randomize ? (
          <div className="fieldHint">
            Wider offsets make the fragments look more torn and unstable.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GLITCH_BLOCK_OFFSET_RANGE_MIN}
              max={GLITCH_BLOCK_OFFSET_RANGE_MAX}
              step={1}
              value={controls.offsetRange.value}
              onChange={(event) => onUpdate("offsetRange", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.offsetRange.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stripe Chance</span>
          <ParameterToggle
            checked={controls.stripeChance.randomize}
            onChange={(checked) => onUpdate("stripeChance", { randomize: checked })}
          />
        </div>
        {controls.stripeChance.randomize ? (
          <div className="fieldHint">
            Higher stripe chance fills more of each band with fragments.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GLITCH_BLOCK_STRIPE_CHANCE_MIN}
              max={GLITCH_BLOCK_STRIPE_CHANCE_MAX}
              step={GLITCH_BLOCK_STRIPE_CHANCE_STEP}
              value={controls.stripeChance.value}
              onChange={(event) => onUpdate("stripeChance", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.stripeChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Cell Size</span>
          <ParameterToggle
            checked={controls.cellSize.randomize}
            onChange={(checked) => onUpdate("cellSize", { randomize: checked })}
          />
        </div>
        {controls.cellSize.randomize ? (
          <div className="fieldHint">
            Small cells look noisy; large cells look like broken macroblocks.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GLITCH_BLOCK_CELL_SIZE_MIN}
              max={GLITCH_BLOCK_CELL_SIZE_MAX}
              step={1}
              value={controls.cellSize.value}
              onChange={(event) => onUpdate("cellSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.cellSize.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function GameOfLifeVariantsSettingsPanel({
  controls,
  onUpdate,
}: GameOfLifeVariantsSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Game of Life Variants</h3>
      <div className="fieldHint">
        Evolves a seeded binary field through a Life-family rule set to form chambers and tunnel
        clusters.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Variant</span>
          <ParameterToggle
            checked={controls.variant.randomize}
            onChange={(checked) => onUpdate("variant", { randomize: checked })}
          />
        </div>
        {controls.variant.randomize ? (
          <div className="fieldHint">Switches between Life, HighLife, and Maze-like rules.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.variant.value}
            onChange={(event) =>
              onUpdate("variant", { value: event.target.value as GameOfLifeVariant })
            }
          >
            {GAME_OF_LIFE_VARIANT_OPTIONS.map((variant) => (
              <option key={variant} value={variant}>
                {formatGameOfLifeVariantLabel(variant)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed Density</span>
          <ParameterToggle
            checked={controls.density.randomize}
            onChange={(checked) => onUpdate("density", { randomize: checked })}
          />
        </div>
        {controls.density.randomize ? (
          <div className="fieldHint">Controls how full the starting binary field is.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GAME_OF_LIFE_DENSITY_MIN}
              max={GAME_OF_LIFE_DENSITY_MAX}
              step={GAME_OF_LIFE_DENSITY_STEP}
              value={controls.density.value}
              onChange={(event) => onUpdate("density", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.density.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Steps</span>
          <ParameterToggle
            checked={controls.steps.randomize}
            onChange={(checked) => onUpdate("steps", { randomize: checked })}
          />
        </div>
        {controls.steps.randomize ? (
          <div className="fieldHint">
            Higher values let the automaton settle into larger shapes.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GAME_OF_LIFE_STEPS_MIN}
              max={GAME_OF_LIFE_STEPS_MAX}
              step={1}
              value={controls.steps.value}
              onChange={(event) => onUpdate("steps", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.steps.value}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function DiffusionLimitedAggregationSettingsPanel({
  controls,
  onUpdate,
}: DiffusionLimitedAggregationSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Diffusion-Limited Aggregation</h3>
      <div className="fieldHint">
        Random walkers stick to an existing cluster to grow coral-, lightning-, and crystal-like
        silhouettes.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed Shape</span>
          <ParameterToggle
            checked={controls.seedMode.randomize}
            onChange={(checked) => onUpdate("seedMode", { randomize: checked })}
          />
        </div>
        {controls.seedMode.randomize ? (
          <div className="fieldHint">
            Randomizes the starting aggregate between point, line, and cross.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.seedMode.value}
            onChange={(event) => onUpdate("seedMode", { value: event.target.value as DlaSeedMode })}
          >
            {DLA_SEED_MODE_OPTIONS.map((seedMode) => (
              <option key={seedMode} value={seedMode}>
                {formatDlaSeedModeLabel(seedMode)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Walkers</span>
          <ParameterToggle
            checked={controls.walkers.randomize}
            onChange={(checked) => onUpdate("walkers", { randomize: checked })}
          />
        </div>
        {controls.walkers.randomize ? (
          <div className="fieldHint">More walkers usually means denser, branchier accretions.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DLA_WALKERS_MIN}
              max={DLA_WALKERS_MAX}
              step={1}
              value={controls.walkers.value}
              onChange={(event) => onUpdate("walkers", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.walkers.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Stickiness</span>
          <ParameterToggle
            checked={controls.stickiness.randomize}
            onChange={(checked) => onUpdate("stickiness", { randomize: checked })}
          />
        </div>
        {controls.stickiness.randomize ? (
          <div className="fieldHint">
            Higher values make walkers attach faster to the aggregate.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DLA_STICKINESS_MIN}
              max={DLA_STICKINESS_MAX}
              step={DLA_STICKINESS_STEP}
              value={controls.stickiness.value}
              onChange={(event) => onUpdate("stickiness", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.stickiness.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ReactionDiffusionApproximationSettingsPanel({
  controls,
  onUpdate,
}: ReactionDiffusionApproximationSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Reaction-Diffusion Approximation</h3>
      <div className="fieldHint">
        A lightweight Gray-Scott-style field that grows stripe and spot structures from seeded
        activator patches.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Spot Count</span>
          <ParameterToggle
            checked={controls.spotCount.randomize}
            onChange={(checked) => onUpdate("spotCount", { randomize: checked })}
          />
        </div>
        {controls.spotCount.randomize ? (
          <div className="fieldHint">
            Controls how many seeded activator patches the field starts with.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={REACTION_DIFFUSION_SPOT_COUNT_MIN}
              max={REACTION_DIFFUSION_SPOT_COUNT_MAX}
              step={1}
              value={controls.spotCount.value}
              onChange={(event) => onUpdate("spotCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.spotCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Iterations</span>
          <ParameterToggle
            checked={controls.iterations.randomize}
            onChange={(checked) => onUpdate("iterations", { randomize: checked })}
          />
        </div>
        {controls.iterations.randomize ? (
          <div className="fieldHint">
            Higher values let the spots diffuse and self-organize longer.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={REACTION_DIFFUSION_ITERATIONS_MIN}
              max={REACTION_DIFFUSION_ITERATIONS_MAX}
              step={1}
              value={controls.iterations.value}
              onChange={(event) => onUpdate("iterations", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.iterations.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Feed</span>
          <ParameterToggle
            checked={controls.feed.randomize}
            onChange={(checked) => onUpdate("feed", { randomize: checked })}
          />
        </div>
        {controls.feed.randomize ? (
          <div className="fieldHint">Controls how quickly fresh material re-enters the field.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={REACTION_DIFFUSION_FEED_MIN}
              max={REACTION_DIFFUSION_FEED_MAX}
              step={REACTION_DIFFUSION_FEED_STEP}
              value={controls.feed.value}
              onChange={(event) => onUpdate("feed", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.feed.value.toFixed(3)}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Kill</span>
          <ParameterToggle
            checked={controls.kill.randomize}
            onChange={(checked) => onUpdate("kill", { randomize: checked })}
          />
        </div>
        {controls.kill.randomize ? (
          <div className="fieldHint">Controls how quickly the reacting material decays away.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={REACTION_DIFFUSION_KILL_MIN}
              max={REACTION_DIFFUSION_KILL_MAX}
              step={REACTION_DIFFUSION_KILL_STEP}
              value={controls.kill.value}
              onChange={(event) => onUpdate("kill", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.kill.value.toFixed(3)}</div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function VoronoiRegionCarverSettingsPanel({
  controls,
  onUpdate,
}: VoronoiRegionCarverSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Voronoi Region Carver</h3>
      <div className="fieldHint">
        Builds walls on Voronoi region boundaries so the result feels like cracked cells or tiled
        partitions.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Site Count</span>
          <ParameterToggle
            checked={controls.siteCount.randomize}
            onChange={(checked) => onUpdate("siteCount", { randomize: checked })}
          />
        </div>
        {controls.siteCount.randomize ? (
          <div className="fieldHint">More sites create smaller cells and denser boundaries.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={VORONOI_SITE_COUNT_MIN}
              max={VORONOI_SITE_COUNT_MAX}
              step={1}
              value={controls.siteCount.value}
              onChange={(event) => onUpdate("siteCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.siteCount.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Ridge Width</span>
          <ParameterToggle
            checked={controls.ridgeWidth.randomize}
            onChange={(checked) => onUpdate("ridgeWidth", { randomize: checked })}
          />
        </div>
        {controls.ridgeWidth.randomize ? (
          <div className="fieldHint">Thickens or thins the extracted Voronoi boundaries.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={VORONOI_RIDGE_WIDTH_MIN}
              max={VORONOI_RIDGE_WIDTH_MAX}
              step={VORONOI_RIDGE_WIDTH_STEP}
              value={controls.ridgeWidth.value}
              onChange={(event) => onUpdate("ridgeWidth", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {controls.ridgeWidth.value.toFixed(1)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Jitter</span>
          <ParameterToggle
            checked={controls.jitter.randomize}
            onChange={(checked) => onUpdate("jitter", { randomize: checked })}
          />
        </div>
        {controls.jitter.randomize ? (
          <div className="fieldHint">Adds a small noisy wobble to the boundary evaluation.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={VORONOI_JITTER_MIN}
              max={VORONOI_JITTER_MAX}
              step={VORONOI_JITTER_STEP}
              value={controls.jitter.value}
              onChange={(event) => onUpdate("jitter", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.jitter.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function ErosionDilationPipelineSettingsPanel({
  controls,
  onUpdate,
}: ErosionDilationPipelineSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Erosion / Dilation Pipeline</h3>
      <div className="fieldHint">
        Starts from noise, grows it outward, erodes it back, and then punctures dense pockets.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed Density</span>
          <ParameterToggle
            checked={controls.density.randomize}
            onChange={(checked) => onUpdate("density", { randomize: checked })}
          />
        </div>
        {controls.density.randomize ? (
          <div className="fieldHint">Sets how full the starting binary mask is.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={EROSION_DILATION_DENSITY_MIN}
              max={EROSION_DILATION_DENSITY_MAX}
              step={EROSION_DILATION_DENSITY_STEP}
              value={controls.density.value}
              onChange={(event) => onUpdate("density", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.density.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Grow Steps</span>
          <ParameterToggle
            checked={controls.growSteps.randomize}
            onChange={(checked) => onUpdate("growSteps", { randomize: checked })}
          />
        </div>
        {controls.growSteps.randomize ? (
          <div className="fieldHint">Dilation passes that thicken and merge nearby blobs.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={EROSION_DILATION_GROW_STEPS_MIN}
              max={EROSION_DILATION_GROW_STEPS_MAX}
              step={1}
              value={controls.growSteps.value}
              onChange={(event) => onUpdate("growSteps", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.growSteps.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Shrink Steps</span>
          <ParameterToggle
            checked={controls.shrinkSteps.randomize}
            onChange={(checked) => onUpdate("shrinkSteps", { randomize: checked })}
          />
        </div>
        {controls.shrinkSteps.randomize ? (
          <div className="fieldHint">Erosion passes that cut back the merged shapes.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={EROSION_DILATION_SHRINK_STEPS_MIN}
              max={EROSION_DILATION_SHRINK_STEPS_MAX}
              step={1}
              value={controls.shrinkSteps.value}
              onChange={(event) => onUpdate("shrinkSteps", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">{controls.shrinkSteps.value}</div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Puncture Chance</span>
          <ParameterToggle
            checked={controls.punctureChance.randomize}
            onChange={(checked) => onUpdate("punctureChance", { randomize: checked })}
          />
        </div>
        {controls.punctureChance.randomize ? (
          <div className="fieldHint">
            Removes some solid pockets to break up otherwise massive walls.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={EROSION_DILATION_PUNCTURE_MIN}
              max={EROSION_DILATION_PUNCTURE_MAX}
              step={EROSION_DILATION_PUNCTURE_STEP}
              value={controls.punctureChance.value}
              onChange={(event) =>
                onUpdate("punctureChance", { value: Number(event.target.value) })
              }
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.punctureChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <OrnamentBaseSections controls={controls} onUpdate={onUpdate} />
    </>
  );
}

function BacktrackingSettingsPanel({
  controls,
  contentWidth,
  contentHeight,
  onUpdate,
}: BacktrackingSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1", contentWidth, contentHeight);
  const maxColumns = fixedBlockSize
    ? dims.columns
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).columns;
  const maxRows = fixedBlockSize
    ? dims.rows
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).rows;

  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Backtracking Generator</h3>
      <div className="fieldHint">
        Recursive depth-first carving based on mazelib&apos;s generator.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Column</span>
          <ParameterToggle
            checked={controls.startColumn.randomize}
            onChange={(checked) => onUpdate("startColumn", { randomize: checked })}
          />
        </div>
        {controls.startColumn.randomize ? (
          <div className="fieldHint">Random starting column within the current maze width.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxColumns}
              step={1}
              value={Math.min(controls.startColumn.value, maxColumns)}
              onChange={(event) => onUpdate("startColumn", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startColumn.value, maxColumns)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Row</span>
          <ParameterToggle
            checked={controls.startRow.randomize}
            onChange={(checked) => onUpdate("startRow", { randomize: checked })}
          />
        </div>
        {controls.startRow.randomize ? (
          <div className="fieldHint">Random starting row within the current maze height.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxRows}
              step={1}
              value={Math.min(controls.startRow.value, maxRows)}
              onChange={(event) => onUpdate("startRow", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startRow.value, maxRows)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function PrimsSettingsPanel({
  controls,
  contentWidth,
  contentHeight,
  onUpdate,
}: PrimsSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1", contentWidth, contentHeight);
  const maxColumns = fixedBlockSize
    ? dims.columns
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).columns;
  const maxRows = fixedBlockSize
    ? dims.rows
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).rows;

  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Prim&apos;s</h3>
      <div className="fieldHint">
        Frontier-based carving using the randomized Prim&apos;s pattern.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Column</span>
          <ParameterToggle
            checked={controls.startColumn.randomize}
            onChange={(checked) => onUpdate("startColumn", { randomize: checked })}
          />
        </div>
        {controls.startColumn.randomize ? (
          <div className="fieldHint">Random starting column within the current maze width.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxColumns}
              step={1}
              value={Math.min(controls.startColumn.value, maxColumns)}
              onChange={(event) => onUpdate("startColumn", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startColumn.value, maxColumns)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Row</span>
          <ParameterToggle
            checked={controls.startRow.randomize}
            onChange={(checked) => onUpdate("startRow", { randomize: checked })}
          />
        </div>
        {controls.startRow.randomize ? (
          <div className="fieldHint">Random starting row within the current maze height.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxRows}
              step={1}
              value={Math.min(controls.startRow.value, maxRows)}
              onChange={(event) => onUpdate("startRow", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startRow.value, maxRows)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function KruskalsSettingsPanel({ controls, onUpdate }: KruskalsSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Kruskal&apos;s</h3>
      <div className="fieldHint">
        Builds a spanning tree by joining disjoint cell sets at random.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function SidewinderSettingsPanel({
  controls,
  onUpdate,
}: SidewinderSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Sidewinder</h3>
      <div className="fieldHint">
        Carves long eastbound runs, then periodically punches one passage north.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Skew</span>
          <ParameterToggle
            checked={controls.skew.randomize}
            onChange={(checked) => onUpdate("skew", { randomize: checked })}
          />
        </div>
        {controls.skew.randomize ? (
          <div className="fieldHint">
            Varies how often a run closes upward instead of continuing east.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={SIDEWINDER_SKEW_MIN}
              max={SIDEWINDER_SKEW_MAX}
              step={SIDEWINDER_SKEW_STEP}
              value={controls.skew.value}
              onChange={(event) => onUpdate("skew", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.skew.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function BinaryTreeSettingsPanel({
  controls,
  onUpdate,
}: BinaryTreeSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Binary Tree</h3>
      <div className="fieldHint">Each cell carves one passage toward the selected corner bias.</div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Skew</span>
          <ParameterToggle
            checked={controls.skew.randomize}
            onChange={(checked) => onUpdate("skew", { randomize: checked })}
          />
        </div>
        {controls.skew.randomize ? (
          <div className="fieldHint">Randomly picks a corner bias from NW, NE, SW, and SE.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.skew.value}
            onChange={(event) => onUpdate("skew", { value: event.target.value as BinaryTreeSkew })}
          >
            {BINARY_TREE_SKEW_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatBinaryTreeSkewLabel(option)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function HuntAndKillSettingsPanel({
  controls,
  onUpdate,
}: HuntAndKillSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Hunt-and-Kill</h3>
      <div className="fieldHint">
        Alternates random carving walks with hunts for the next usable starting cell.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Hunt Order</span>
          <ParameterToggle
            checked={controls.huntOrder.randomize}
            onChange={(checked) => onUpdate("huntOrder", { randomize: checked })}
          />
        </div>
        {controls.huntOrder.randomize ? (
          <div className="fieldHint">
            Randomly switches between random and serpentine hunt order.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.huntOrder.value}
            onChange={(event) => onUpdate("huntOrder", { value: event.target.value as HuntOrder })}
          >
            {HUNT_ORDER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatHuntOrderLabel(option)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function WilsonsSettingsPanel({ controls, onUpdate }: WilsonsSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Wilson&apos;s</h3>
      <div className="fieldHint">
        Uses loop-erased random walks to grow a uniform spanning tree.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Hunt Order</span>
          <ParameterToggle
            checked={controls.huntOrder.randomize}
            onChange={(checked) => onUpdate("huntOrder", { randomize: checked })}
          />
        </div>
        {controls.huntOrder.randomize ? (
          <div className="fieldHint">
            Randomly switches between random and serpentine hunt order.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.huntOrder.value}
            onChange={(event) => onUpdate("huntOrder", { value: event.target.value as HuntOrder })}
          >
            {HUNT_ORDER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatHuntOrderLabel(option)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function AldousBroderSettingsPanel({
  controls,
  onUpdate,
}: AldousBroderSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Aldous-Broder</h3>
      <div className="fieldHint">
        Uses a full random walk, only carving when it first reaches a new cell.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function EllersSettingsPanel({ controls, onUpdate }: EllersSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Eller&apos;s</h3>
      <div className="fieldHint">
        Builds sets row by row, with separate controls for horizontal merges and vertical carry.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Horizontal Merge</span>
          <ParameterToggle
            checked={controls.xskew.randomize}
            onChange={(checked) => onUpdate("xskew", { randomize: checked })}
          />
        </div>
        {controls.xskew.randomize ? (
          <div className="fieldHint">Varies how often adjacent sets merge within a row.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={SIDEWINDER_SKEW_MIN}
              max={SIDEWINDER_SKEW_MAX}
              step={SIDEWINDER_SKEW_STEP}
              value={controls.xskew.value}
              onChange={(event) => onUpdate("xskew", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.xskew.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Vertical Carry</span>
          <ParameterToggle
            checked={controls.yskew.randomize}
            onChange={(checked) => onUpdate("yskew", { randomize: checked })}
          />
        </div>
        {controls.yskew.randomize ? (
          <div className="fieldHint">
            Varies how many extra downward connections survive into the next row.
          </div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={SIDEWINDER_SKEW_MIN}
              max={SIDEWINDER_SKEW_MAX}
              step={SIDEWINDER_SKEW_STEP}
              value={controls.yskew.value}
              onChange={(event) => onUpdate("yskew", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.yskew.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function CellularAutomatonSettingsPanel({
  controls,
  onUpdate,
}: CellularAutomatonSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Cellular Automaton</h3>
      <div className="fieldHint">
        Grows wall systems from seeded border and interior points using the mazelib automaton rules.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Complexity</span>
          <ParameterToggle
            checked={controls.complexity.randomize}
            onChange={(checked) => onUpdate("complexity", { randomize: checked })}
          />
        </div>
        {controls.complexity.randomize ? (
          <div className="fieldHint">Controls how long each seeded wall keeps spreading.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CELLULAR_AUTOMATON_COMPLEXITY_MIN}
              max={CELLULAR_AUTOMATON_COMPLEXITY_MAX}
              step={CELLULAR_AUTOMATON_COMPLEXITY_STEP}
              value={controls.complexity.value}
              onChange={(event) => onUpdate("complexity", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.complexity.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Density</span>
          <ParameterToggle
            checked={controls.density.randomize}
            onChange={(checked) => onUpdate("density", { randomize: checked })}
          />
        </div>
        {controls.density.randomize ? (
          <div className="fieldHint">Controls how many distinct wall systems get seeded.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={CELLULAR_AUTOMATON_DENSITY_MIN}
              max={CELLULAR_AUTOMATON_DENSITY_MAX}
              step={CELLULAR_AUTOMATON_DENSITY_STEP}
              value={controls.density.value}
              onChange={(event) => onUpdate("density", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.density.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function DungeonRoomsSettingsPanel({
  controls,
  contentWidth,
  contentHeight,
  onUpdate,
}: DungeonRoomsSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const limits = dungeonRoomParameterLimits(fixedBlockSize ?? "1x1", contentWidth, contentHeight);

  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Dungeon Rooms</h3>
      <div className="fieldHint">
        Randomizes room placement first, then fills the remaining space with hunt-and-kill walks.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Count</span>
          <ParameterToggle
            checked={controls.roomCount.randomize}
            onChange={(checked) => onUpdate("roomCount", { randomize: checked })}
          />
        </div>
        {controls.roomCount.randomize ? (
          <div className="fieldHint">Varies how many rooms are placed before corridor carving.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DUNGEON_ROOM_COUNT_MIN}
              max={limits.roomCountMax}
              step={1}
              value={Math.min(controls.roomCount.value, limits.roomCountMax)}
              onChange={(event) => onUpdate("roomCount", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.roomCount.value, limits.roomCountMax)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Room Size</span>
          <ParameterToggle
            checked={controls.roomSize.randomize}
            onChange={(checked) => onUpdate("roomSize", { randomize: checked })}
          />
        </div>
        {controls.roomSize.randomize ? (
          <div className="fieldHint">Caps the width and height of each randomized room.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={DUNGEON_ROOM_SIZE_MIN}
              max={limits.roomSizeMax}
              step={1}
              value={Math.min(controls.roomSize.value, limits.roomSizeMax)}
              onChange={(event) => onUpdate("roomSize", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.roomSize.value, limits.roomSizeMax)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Hunt Order</span>
          <ParameterToggle
            checked={controls.huntOrder.randomize}
            onChange={(checked) => onUpdate("huntOrder", { randomize: checked })}
          />
        </div>
        {controls.huntOrder.randomize ? (
          <div className="fieldHint">
            Randomly switches between random and serpentine room-to-room hunts.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.huntOrder.value}
            onChange={(event) => onUpdate("huntOrder", { value: event.target.value as HuntOrder })}
          >
            {HUNT_ORDER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatHuntOrderLabel(option)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function TrivialMazeSettingsPanel({
  controls,
  onUpdate,
}: TrivialMazeSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Trivial Maze</h3>
      <div className="fieldHint">
        Generates simple unicursal patterns using the upstream spiral and serpentine modes.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Maze Type</span>
          <ParameterToggle
            checked={controls.mazeType.randomize}
            onChange={(checked) => onUpdate("mazeType", { randomize: checked })}
          />
        </div>
        {controls.mazeType.randomize ? (
          <div className="fieldHint">Randomly switches between spiral and serpentine layouts.</div>
        ) : (
          <select
            className="generateSelect"
            value={controls.mazeType.value}
            onChange={(event) =>
              onUpdate("mazeType", { value: event.target.value as TrivialMazeType })
            }
          >
            {TRIVIAL_MAZE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatTrivialMazeTypeLabel(option)}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function GrowingTreeSettingsPanel({
  controls,
  contentWidth,
  contentHeight,
  onUpdate,
}: GrowingTreeSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1", contentWidth, contentHeight);
  const maxColumns = fixedBlockSize
    ? dims.columns
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).columns;
  const maxRows = fixedBlockSize
    ? dims.rows
    : mazeGridDimensionsForBlockSize("1x1", contentWidth, contentHeight).rows;

  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Growing Tree</h3>
      <div className="fieldHint">Switches between backtracking and random active-cell picks.</div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Column</span>
          <ParameterToggle
            checked={controls.startColumn.randomize}
            onChange={(checked) => onUpdate("startColumn", { randomize: checked })}
          />
        </div>
        {controls.startColumn.randomize ? (
          <div className="fieldHint">Random starting column within the current maze width.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxColumns}
              step={1}
              value={Math.min(controls.startColumn.value, maxColumns)}
              onChange={(event) => onUpdate("startColumn", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startColumn.value, maxColumns)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Start Row</span>
          <ParameterToggle
            checked={controls.startRow.randomize}
            onChange={(checked) => onUpdate("startRow", { randomize: checked })}
          />
        </div>
        {controls.startRow.randomize ? (
          <div className="fieldHint">Random starting row within the current maze height.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={1}
              max={maxRows}
              step={1}
              value={Math.min(controls.startRow.value, maxRows)}
              onChange={(event) => onUpdate("startRow", { value: Number(event.target.value) })}
            />
            <div className="statusBadge generateValueBadge">
              {Math.min(controls.startRow.value, maxRows)}
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Backtrack Chance</span>
          <ParameterToggle
            checked={controls.backtrackChance.randomize}
            onChange={(checked) => onUpdate("backtrackChance", { randomize: checked })}
          />
        </div>
        {controls.backtrackChance.randomize ? (
          <div className="fieldHint">Blends recursive backtracking with Prim-like picks.</div>
        ) : (
          <div className="generateSettingBody">
            <input
              type="range"
              className="generateRangeInput"
              min={GROWING_TREE_BACKTRACK_CHANCE_MIN}
              max={GROWING_TREE_BACKTRACK_CHANCE_MAX}
              step={GROWING_TREE_BACKTRACK_CHANCE_STEP}
              value={controls.backtrackChance.value}
              onChange={(event) =>
                onUpdate("backtrackChance", { value: Number(event.target.value) })
              }
            />
            <div className="statusBadge generateValueBadge">
              {Math.round(controls.backtrackChance.value * 100)}%
            </div>
          </div>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function RecursiveDivisionSettingsPanel({
  controls,
  onUpdate,
}: RecursiveDivisionSettingsPanelProps): JSX.Element {
  return (
    <>
      <div className="sectionEyebrow">Parameters</div>
      <h3 className="sectionTitle">Recursive Division</h3>
      <div className="fieldHint">
        Starts open and recursively adds walls with a single doorway per split.
      </div>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Block Size</span>
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">
            Weighted randomization: 1x1 and 2x2 are favored over rectangular blocks.
          </div>
        ) : (
          <select
            className="generateSelect"
            value={controls.blockSize.value}
            onChange={(event) =>
              onUpdate("blockSize", { value: event.target.value as MazeBlockSize })
            }
          >
            {MAZE_BLOCK_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Seed</span>
          <ParameterToggle
            checked={controls.seed.randomize}
            onChange={(checked) => onUpdate("seed", { randomize: checked })}
          />
        </div>
        {controls.seed.randomize ? (
          <div className="fieldHint">Each card gets its own seed from the current reroll.</div>
        ) : (
          <input
            type="number"
            className="textInput"
            min={MAZE_SEED_MIN}
            max={MAZE_SEED_MAX}
            step={1}
            value={controls.seed.value}
            onChange={(event) => onUpdate("seed", { value: Number(event.target.value) })}
          />
        )}
      </section>
    </>
  );
}

function GeneratedRecordDetails({
  record,
  starred,
  onImport,
  onToggleStar,
  onMoreLikeThis,
}: Readonly<{
  record: GeneratedLayoutRecord | null;
  starred: boolean;
  onImport: (wallKey: string) => void;
  onToggleStar: (wallKey: string) => void;
  onMoreLikeThis: (record: GeneratedLayoutRecord) => void;
}>): JSX.Element {
  if (!record) {
    return (
      <>
        <div className="sectionEyebrow">Selection</div>
        <h3 className="sectionTitle">Nothing Selected</h3>
        <div className="fieldHint generateDetailEmpty">
          Select a generated card to inspect its parameters here.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sectionEyebrow">Selection</div>
      <h3 className="sectionTitle">{record.title}</h3>
      <div className="fieldHint">{record.summary}</div>
      <div className="generateSidebarPreview">
        <GeneratedMaskPreview wallKey={record.wallKey} />
      </div>
      <div className="generateDetailActions">
        <button
          type="button"
          className="secondaryButton"
          onClick={() => onToggleStar(record.wallKey)}
        >
          {starred ? "Unstar Selected" : "Star Selected"}
        </button>
        <button
          type="button"
          className="secondaryButton"
          disabled={record.algorithm === "starred"}
          onClick={() => onMoreLikeThis(record)}
        >
          More like this
        </button>
      </div>
      {record.algorithm === "random-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Density</span>
            <div>{Math.round(record.params.density * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>
              {record.params.blockSize}x{record.params.blockSize}
            </div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Mirror</span>
            <div>{formatMirrorLabel(record.params.mirror)}</div>
          </div>
        </div>
      ) : record.algorithm === "perlin-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Scale</span>
            <div>{formatCompactNumber(record.params.scale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Octaves</span>
            <div>{record.params.octaves}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "value-fractal-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Scale</span>
            <div>{formatCompactNumber(record.params.scale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Octaves</span>
            <div>{record.params.octaves}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Gain</span>
            <div>{Math.round(record.params.gain * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "worley-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Cell Count</span>
            <div>{record.params.cellCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Jitter</span>
            <div>{Math.round(record.params.jitter * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "thresholded-gradient-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Band Scale</span>
            <div>{formatCompactNumber(record.params.scale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Angle</span>
            <div>{record.params.angle}°</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Roughness</span>
            <div>{Math.round(record.params.roughness * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "domain-warped-noise" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Scale</span>
            <div>{formatCompactNumber(record.params.scale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Octaves</span>
            <div>{record.params.octaves}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Warp Scale</span>
            <div>{formatCompactNumber(record.params.warpScale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Warp Strength</span>
            <div>{Math.round(record.params.warpStrength * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "radial-symmetry" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Folds</span>
            <div>{record.params.folds}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Rings</span>
            <div>{record.params.rings}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Twist</span>
            <div>{Math.round(record.params.twist * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Band Width</span>
            <div>{Math.round(record.params.thickness * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "kaleidoscope" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Segments</span>
            <div>{record.params.segments}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Scale</span>
            <div>{formatCompactNumber(record.params.scale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Threshold</span>
            <div>{Math.round(record.params.threshold * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "l-system-turtle" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Preset</span>
            <div>{formatLSystemPresetLabel(record.params.preset)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Iterations</span>
            <div>{record.params.iterations}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Turn Angle</span>
            <div>{record.params.turnAngle}°</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stroke Width</span>
            <div>{record.params.strokeWidth}px</div>
          </div>
        </div>
      ) : record.algorithm === "rose-curves" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Petals</span>
            <div>{record.params.petals}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Harmonic</span>
            <div>{record.params.harmonic}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Rotation</span>
            <div>{record.params.rotation}°</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stroke Width</span>
            <div>{record.params.strokeWidth}px</div>
          </div>
        </div>
      ) : record.algorithm === "tileable-motif-repeater" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Motif</span>
            <div>{formatTileableMotifLabel(record.params.motif)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Spacing</span>
            <div>{record.params.spacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Motif Size</span>
            <div>{record.params.motifSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Jitter</span>
            <div>{record.params.jitter}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Rotation</span>
            <div>{record.params.rotation}°</div>
          </div>
        </div>
      ) : record.algorithm === "bsp-room-partitioner" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Split Depth</span>
            <div>{record.params.splitDepth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Padding</span>
            <div>{record.params.roomPadding}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Corridor Width</span>
            <div>{record.params.corridorWidth}</div>
          </div>
        </div>
      ) : record.algorithm === "corridor-grid" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Column Spacing</span>
            <div>{record.params.columnSpacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Row Spacing</span>
            <div>{record.params.rowSpacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Wall Thickness</span>
            <div>{record.params.wallThickness}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Door Chance</span>
            <div>{Math.round(record.params.gapChance * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "room-scatter" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Count</span>
            <div>{record.params.roomCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Size</span>
            <div>{record.params.roomSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Gap</span>
            <div>{record.params.gap}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Connector Chance</span>
            <div>{Math.round(record.params.connectorChance * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "courtyard-generator" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Ring Count</span>
            <div>{record.params.ringCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Ring Gap</span>
            <div>{record.params.ringGap}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Gate Width</span>
            <div>{record.params.gateWidth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Gate Offset</span>
            <div>{record.params.offset}</div>
          </div>
        </div>
      ) : record.algorithm === "blueprint-generator" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Wing Count</span>
            <div>{record.params.wingCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Hall Width</span>
            <div>{record.params.hallWidth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Pillar Spacing</span>
            <div>{record.params.pillarSpacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Chamber Depth</span>
            <div>{record.params.chamberDepth}</div>
          </div>
        </div>
      ) : record.algorithm === "stripe-plaid-generator" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Mode</span>
            <div>{formatStripePlaidModeLabel(record.params.mode)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Spacing</span>
            <div>{record.params.spacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Band Width</span>
            <div>{record.params.bandWidth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Offset</span>
            <div>{record.params.offset}</div>
          </div>
        </div>
      ) : record.algorithm === "checker-diamond-lattice" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Style</span>
            <div>{formatCheckerDiamondLatticeStyleLabel(record.params.style)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Cell Size</span>
            <div>{record.params.cellSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Line Width</span>
            <div>{record.params.lineWidth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Phase</span>
            <div>{record.params.phase}</div>
          </div>
        </div>
      ) : record.algorithm === "concentric-boxes" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Ring Count</span>
            <div>{record.params.ringCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Gap</span>
            <div>{record.params.spacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Line Width</span>
            <div>{record.params.lineWidth}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Drift</span>
            <div>{record.params.drift}</div>
          </div>
        </div>
      ) : record.algorithm === "line-interference" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Angle A</span>
            <div>{record.params.angleA}°</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Angle B</span>
            <div>{record.params.angleB}°</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Spacing</span>
            <div>{record.params.spacing}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stroke Width</span>
            <div>{record.params.strokeWidth}</div>
          </div>
        </div>
      ) : record.algorithm === "circle-packing" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Circle Count</span>
            <div>{record.params.circleCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Min Radius</span>
            <div>{record.params.minRadius}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Max Radius</span>
            <div>{record.params.maxRadius}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Render</span>
            <div>{record.params.outline ? "Outline" : "Filled"}</div>
          </div>
        </div>
      ) : record.algorithm === "drunk-walk-painter" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Walker Count</span>
            <div>{record.params.walkerCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Steps</span>
            <div>{record.params.steps}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Brush Size</span>
            <div>{record.params.brushSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Chance</span>
            <div>{Math.round(record.params.roomChance * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "particle-flow-field" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Agent Count</span>
            <div>{record.params.agentCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Steps</span>
            <div>{record.params.steps}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Field Scale</span>
            <div>{formatCompactNumber(record.params.fieldScale)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stroke Width</span>
            <div>{record.params.strokeWidth}</div>
          </div>
        </div>
      ) : record.algorithm === "stamp-brush-generator" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stamp Type</span>
            <div>{formatStampBrushTypeLabel(record.params.stampType)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stamp Count</span>
            <div>{record.params.stampCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stamp Size</span>
            <div>{record.params.stampSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Scatter</span>
            <div>{record.params.scatter}</div>
          </div>
        </div>
      ) : record.algorithm === "cutout-collage" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Shape Count</span>
            <div>{record.params.shapeCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Min Size</span>
            <div>{record.params.minSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Max Size</span>
            <div>{record.params.maxSize}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Subtract Chance</span>
            <div>{Math.round(record.params.subtractChance * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "glitch-blocks" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatNoiseBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Band Count</span>
            <div>{record.params.bandCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Offset Range</span>
            <div>{record.params.offsetRange}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Stripe Chance</span>
            <div>{Math.round(record.params.stripeChance * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Cell Size</span>
            <div>{record.params.cellSize}</div>
          </div>
        </div>
      ) : record.algorithm === "backtracking-generator" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Column</span>
            <div>{record.params.startColumn}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Row</span>
            <div>{record.params.startRow}</div>
          </div>
        </div>
      ) : record.algorithm === "prims" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Column</span>
            <div>{record.params.startColumn}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Row</span>
            <div>{record.params.startRow}</div>
          </div>
        </div>
      ) : record.algorithm === "kruskals" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
        </div>
      ) : record.algorithm === "sidewinder" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Skew</span>
            <div>{Math.round(record.params.skew * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "binary-tree" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Skew</span>
            <div>{formatBinaryTreeSkewLabel(record.params.skew)}</div>
          </div>
        </div>
      ) : record.algorithm === "hunt-and-kill" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Hunt Order</span>
            <div>{formatHuntOrderLabel(record.params.huntOrder)}</div>
          </div>
        </div>
      ) : record.algorithm === "wilsons" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Hunt Order</span>
            <div>{formatHuntOrderLabel(record.params.huntOrder)}</div>
          </div>
        </div>
      ) : record.algorithm === "aldous-broder" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
        </div>
      ) : record.algorithm === "ellers" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Horizontal Merge</span>
            <div>{Math.round(record.params.xskew * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Vertical Carry</span>
            <div>{Math.round(record.params.yskew * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "cellular-automaton" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Complexity</span>
            <div>{Math.round(record.params.complexity * 100)}%</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Density</span>
            <div>{Math.round(record.params.density * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "dungeon-rooms" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Count</span>
            <div>{record.params.roomCount}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Room Size</span>
            <div>
              Up to {record.params.roomSize}x{record.params.roomSize}
            </div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Hunt Order</span>
            <div>{formatHuntOrderLabel(record.params.huntOrder)}</div>
          </div>
        </div>
      ) : record.algorithm === "trivial-maze" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Maze Type</span>
            <div>{formatTrivialMazeTypeLabel(record.params.mazeType)}</div>
          </div>
        </div>
      ) : record.algorithm === "growing-tree" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Column</span>
            <div>{record.params.startColumn}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Start Row</span>
            <div>{record.params.startRow}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Backtrack Chance</span>
            <div>{Math.round(record.params.backtrackChance * 100)}%</div>
          </div>
        </div>
      ) : record.algorithm === "recursive-division" ? (
        <div className="generateDetailList">
          <div className="generateDetailRow">
            <span className="fieldLabel">Seed</span>
            <div>{record.params.seed}</div>
          </div>
          <div className="generateDetailRow">
            <span className="fieldLabel">Block Size</span>
            <div>{formatMazeBlockSizeLabel(record.params.blockSize)}</div>
          </div>
        </div>
      ) : (
        <div className="fieldHint generateDetailEmpty">
          This layout was starred locally. Only the wall mask was saved, not the original generator
          parameters.
        </div>
      )}
      <button
        type="button"
        className="actionButton generateDetailImportButton"
        onClick={() => onImport(record.wallKey)}
      >
        Import Selected
      </button>
    </>
  );
}

export function GenerateBrowserDialog({
  starredKeys,
  onToggleStar,
  onImport,
  onClose,
}: GenerateBrowserDialogProps): JSX.Element {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<GenerateAlgorithmChoice>("any");
  const [starredOnly, setStarredOnly] = useState(false);
  const [randomSeed, setRandomSeed] = useState(() => randomSeedFromClock());
  const [globalInvert, setGlobalInvert] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(GENERATED_LAYOUT_MAX_SIZE);
  const [layoutHeight, setLayoutHeight] = useState(GENERATED_LAYOUT_MAX_SIZE);
  const [layoutWidthInput, setLayoutWidthInput] = useState(() => String(GENERATED_LAYOUT_MAX_SIZE));
  const [layoutHeightInput, setLayoutHeightInput] = useState(() =>
    String(GENERATED_LAYOUT_MAX_SIZE),
  );
  const [selectedWallKey, setSelectedWallKey] = useState<string | null>(null);
  const [randomNoiseControls, setRandomNoiseControls] = useState<RandomNoiseControlState>(() =>
    createDefaultRandomNoiseControlState(),
  );
  const [perlinNoiseControls, setPerlinNoiseControls] = useState<PerlinNoiseControlState>(() =>
    createDefaultPerlinNoiseControlState(),
  );
  const [valueFractalNoiseControls, setValueFractalNoiseControls] =
    useState<ValueFractalNoiseControlState>(() => createDefaultValueFractalNoiseControlState());
  const [worleyNoiseControls, setWorleyNoiseControls] = useState<WorleyNoiseControlState>(() =>
    createDefaultWorleyNoiseControlState(),
  );
  const [thresholdedGradientNoiseControls, setThresholdedGradientNoiseControls] =
    useState<ThresholdedGradientNoiseControlState>(() =>
      createDefaultThresholdedGradientNoiseControlState(),
    );
  const [domainWarpedNoiseControls, setDomainWarpedNoiseControls] =
    useState<DomainWarpedNoiseControlState>(() => createDefaultDomainWarpedNoiseControlState());
  const [radialSymmetryControls, setRadialSymmetryControls] = useState<RadialSymmetryControlState>(
    () => createDefaultRadialSymmetryControlState(),
  );
  const [kaleidoscopeControls, setKaleidoscopeControls] = useState<KaleidoscopeControlState>(() =>
    createDefaultKaleidoscopeControlState(),
  );
  const [lSystemTurtleControls, setLSystemTurtleControls] = useState<LSystemTurtleControlState>(
    () => createDefaultLSystemTurtleControlState(),
  );
  const [roseCurvesControls, setRoseCurvesControls] = useState<RoseCurvesControlState>(() =>
    createDefaultRoseCurvesControlState(),
  );
  const [tileableMotifRepeaterControls, setTileableMotifRepeaterControls] =
    useState<TileableMotifRepeaterControlState>(() =>
      createDefaultTileableMotifRepeaterControlState(),
    );
  const [bspRoomPartitionerControls, setBspRoomPartitionerControls] =
    useState<BspRoomPartitionerControlState>(() => createDefaultBspRoomPartitionerControlState());
  const [corridorGridControls, setCorridorGridControls] = useState<CorridorGridControlState>(() =>
    createDefaultCorridorGridControlState(),
  );
  const [roomScatterControls, setRoomScatterControls] = useState<RoomScatterControlState>(() =>
    createDefaultRoomScatterControlState(),
  );
  const [courtyardGeneratorControls, setCourtyardGeneratorControls] =
    useState<CourtyardGeneratorControlState>(() => createDefaultCourtyardGeneratorControlState());
  const [blueprintGeneratorControls, setBlueprintGeneratorControls] =
    useState<BlueprintGeneratorControlState>(() => createDefaultBlueprintGeneratorControlState());
  const [stripePlaidGeneratorControls, setStripePlaidGeneratorControls] =
    useState<StripePlaidGeneratorControlState>(() =>
      createDefaultStripePlaidGeneratorControlState(),
    );
  const [checkerDiamondLatticeControls, setCheckerDiamondLatticeControls] =
    useState<CheckerDiamondLatticeControlState>(() =>
      createDefaultCheckerDiamondLatticeControlState(),
    );
  const [concentricBoxesControls, setConcentricBoxesControls] =
    useState<ConcentricBoxesControlState>(() => createDefaultConcentricBoxesControlState());
  const [lineInterferenceControls, setLineInterferenceControls] =
    useState<LineInterferenceControlState>(() => createDefaultLineInterferenceControlState());
  const [circlePackingControls, setCirclePackingControls] = useState<CirclePackingControlState>(
    () => createDefaultCirclePackingControlState(),
  );
  const [drunkWalkPainterControls, setDrunkWalkPainterControls] =
    useState<DrunkWalkPainterControlState>(() => createDefaultDrunkWalkPainterControlState());
  const [particleFlowFieldControls, setParticleFlowFieldControls] =
    useState<ParticleFlowFieldControlState>(() => createDefaultParticleFlowFieldControlState());
  const [stampBrushGeneratorControls, setStampBrushGeneratorControls] =
    useState<StampBrushGeneratorControlState>(() => createDefaultStampBrushGeneratorControlState());
  const [cutoutCollageControls, setCutoutCollageControls] = useState<CutoutCollageControlState>(
    () => createDefaultCutoutCollageControlState(),
  );
  const [glitchBlocksControls, setGlitchBlocksControls] = useState<GlitchBlocksControlState>(() =>
    createDefaultGlitchBlocksControlState(),
  );
  const [gameOfLifeVariantsControls, setGameOfLifeVariantsControls] =
    useState<GameOfLifeVariantsControlState>(() => createDefaultGameOfLifeVariantsControlState());
  const [diffusionLimitedAggregationControls, setDiffusionLimitedAggregationControls] =
    useState<DiffusionLimitedAggregationControlState>(() =>
      createDefaultDiffusionLimitedAggregationControlState(),
    );
  const [reactionDiffusionApproximationControls, setReactionDiffusionApproximationControls] =
    useState<ReactionDiffusionApproximationControlState>(() =>
      createDefaultReactionDiffusionApproximationControlState(),
    );
  const [voronoiRegionCarverControls, setVoronoiRegionCarverControls] =
    useState<VoronoiRegionCarverControlState>(() => createDefaultVoronoiRegionCarverControlState());
  const [erosionDilationPipelineControls, setErosionDilationPipelineControls] =
    useState<ErosionDilationPipelineControlState>(() =>
      createDefaultErosionDilationPipelineControlState(),
    );
  const [backtrackingControls, setBacktrackingControls] = useState<BacktrackingControlState>(() =>
    createDefaultBacktrackingControlState(),
  );
  const [primsControls, setPrimsControls] = useState<PrimsControlState>(() =>
    createDefaultPrimsControlState(),
  );
  const [kruskalsControls, setKruskalsControls] = useState<KruskalsControlState>(() =>
    createDefaultKruskalsControlState(),
  );
  const [sidewinderControls, setSidewinderControls] = useState<SidewinderControlState>(() =>
    createDefaultSidewinderControlState(),
  );
  const [binaryTreeControls, setBinaryTreeControls] = useState<BinaryTreeControlState>(() =>
    createDefaultBinaryTreeControlState(),
  );
  const [huntAndKillControls, setHuntAndKillControls] = useState<HuntAndKillControlState>(() =>
    createDefaultHuntAndKillControlState(),
  );
  const [wilsonsControls, setWilsonsControls] = useState<WilsonsControlState>(() =>
    createDefaultWilsonsControlState(),
  );
  const [aldousBroderControls, setAldousBroderControls] = useState<AldousBroderControlState>(() =>
    createDefaultAldousBroderControlState(),
  );
  const [ellersControls, setEllersControls] = useState<EllersControlState>(() =>
    createDefaultEllersControlState(),
  );
  const [cellularAutomatonControls, setCellularAutomatonControls] =
    useState<CellularAutomatonControlState>(() => createDefaultCellularAutomatonControlState());
  const [dungeonRoomsControls, setDungeonRoomsControls] = useState<DungeonRoomsControlState>(() =>
    createDefaultDungeonRoomsControlState(),
  );
  const [trivialMazeControls, setTrivialMazeControls] = useState<TrivialMazeControlState>(() =>
    createDefaultTrivialMazeControlState(),
  );
  const [growingTreeControls, setGrowingTreeControls] = useState<GrowingTreeControlState>(() =>
    createDefaultGrowingTreeControlState(),
  );
  const [recursiveDivisionControls, setRecursiveDivisionControls] =
    useState<RecursiveDivisionControlState>(() => createDefaultRecursiveDivisionControlState());
  const generatedContentWidth = Math.max(1, layoutWidth - 2);
  const generatedContentHeight = Math.max(1, layoutHeight - 2);

  const showParameterSidebar = !starredOnly && selectedAlgorithm !== "any";
  const visibleRecords = useMemo(
    () =>
      starredOnly
        ? recordsFromStarredKeys(starredKeys)
        : generateLayoutRecords({
            algorithm: selectedAlgorithm,
            count: GENERATED_LAYOUT_CARD_COUNT,
            seed: randomSeed,
            invert: globalInvert,
            layoutWidth,
            layoutHeight,
            randomNoiseControls: selectedAlgorithm === "random-noise" ? randomNoiseControls : null,
            perlinNoiseControls: selectedAlgorithm === "perlin-noise" ? perlinNoiseControls : null,
            valueFractalNoiseControls:
              selectedAlgorithm === "value-fractal-noise" ? valueFractalNoiseControls : null,
            worleyNoiseControls: selectedAlgorithm === "worley-noise" ? worleyNoiseControls : null,
            thresholdedGradientNoiseControls:
              selectedAlgorithm === "thresholded-gradient-noise"
                ? thresholdedGradientNoiseControls
                : null,
            domainWarpedNoiseControls:
              selectedAlgorithm === "domain-warped-noise" ? domainWarpedNoiseControls : null,
            radialSymmetryControls:
              selectedAlgorithm === "radial-symmetry" ? radialSymmetryControls : null,
            kaleidoscopeControls:
              selectedAlgorithm === "kaleidoscope" ? kaleidoscopeControls : null,
            lSystemTurtleControls:
              selectedAlgorithm === "l-system-turtle" ? lSystemTurtleControls : null,
            roseCurvesControls: selectedAlgorithm === "rose-curves" ? roseCurvesControls : null,
            tileableMotifRepeaterControls:
              selectedAlgorithm === "tileable-motif-repeater"
                ? tileableMotifRepeaterControls
                : null,
            bspRoomPartitionerControls:
              selectedAlgorithm === "bsp-room-partitioner" ? bspRoomPartitionerControls : null,
            corridorGridControls:
              selectedAlgorithm === "corridor-grid" ? corridorGridControls : null,
            roomScatterControls: selectedAlgorithm === "room-scatter" ? roomScatterControls : null,
            courtyardGeneratorControls:
              selectedAlgorithm === "courtyard-generator" ? courtyardGeneratorControls : null,
            blueprintGeneratorControls:
              selectedAlgorithm === "blueprint-generator" ? blueprintGeneratorControls : null,
            stripePlaidGeneratorControls:
              selectedAlgorithm === "stripe-plaid-generator" ? stripePlaidGeneratorControls : null,
            checkerDiamondLatticeControls:
              selectedAlgorithm === "checker-diamond-lattice"
                ? checkerDiamondLatticeControls
                : null,
            concentricBoxesControls:
              selectedAlgorithm === "concentric-boxes" ? concentricBoxesControls : null,
            lineInterferenceControls:
              selectedAlgorithm === "line-interference" ? lineInterferenceControls : null,
            circlePackingControls:
              selectedAlgorithm === "circle-packing" ? circlePackingControls : null,
            drunkWalkPainterControls:
              selectedAlgorithm === "drunk-walk-painter" ? drunkWalkPainterControls : null,
            particleFlowFieldControls:
              selectedAlgorithm === "particle-flow-field" ? particleFlowFieldControls : null,
            stampBrushGeneratorControls:
              selectedAlgorithm === "stamp-brush-generator" ? stampBrushGeneratorControls : null,
            cutoutCollageControls:
              selectedAlgorithm === "cutout-collage" ? cutoutCollageControls : null,
            glitchBlocksControls:
              selectedAlgorithm === "glitch-blocks" ? glitchBlocksControls : null,
            gameOfLifeVariantsControls:
              selectedAlgorithm === "game-of-life-variants" ? gameOfLifeVariantsControls : null,
            diffusionLimitedAggregationControls:
              selectedAlgorithm === "diffusion-limited-aggregation"
                ? diffusionLimitedAggregationControls
                : null,
            reactionDiffusionApproximationControls:
              selectedAlgorithm === "reaction-diffusion-approximation"
                ? reactionDiffusionApproximationControls
                : null,
            voronoiRegionCarverControls:
              selectedAlgorithm === "voronoi-region-carver" ? voronoiRegionCarverControls : null,
            erosionDilationPipelineControls:
              selectedAlgorithm === "erosion-dilation-pipeline"
                ? erosionDilationPipelineControls
                : null,
            backtrackingControls:
              selectedAlgorithm === "backtracking-generator" ? backtrackingControls : null,
            primsControls: selectedAlgorithm === "prims" ? primsControls : null,
            kruskalsControls: selectedAlgorithm === "kruskals" ? kruskalsControls : null,
            sidewinderControls: selectedAlgorithm === "sidewinder" ? sidewinderControls : null,
            binaryTreeControls: selectedAlgorithm === "binary-tree" ? binaryTreeControls : null,
            huntAndKillControls: selectedAlgorithm === "hunt-and-kill" ? huntAndKillControls : null,
            wilsonsControls: selectedAlgorithm === "wilsons" ? wilsonsControls : null,
            aldousBroderControls:
              selectedAlgorithm === "aldous-broder" ? aldousBroderControls : null,
            ellersControls: selectedAlgorithm === "ellers" ? ellersControls : null,
            cellularAutomatonControls:
              selectedAlgorithm === "cellular-automaton" ? cellularAutomatonControls : null,
            dungeonRoomsControls:
              selectedAlgorithm === "dungeon-rooms" ? dungeonRoomsControls : null,
            trivialMazeControls: selectedAlgorithm === "trivial-maze" ? trivialMazeControls : null,
            growingTreeControls: selectedAlgorithm === "growing-tree" ? growingTreeControls : null,
            recursiveDivisionControls:
              selectedAlgorithm === "recursive-division" ? recursiveDivisionControls : null,
          }),
    [
      aldousBroderControls,
      backtrackingControls,
      binaryTreeControls,
      blueprintGeneratorControls,
      bspRoomPartitionerControls,
      cellularAutomatonControls,
      corridorGridControls,
      courtyardGeneratorControls,
      checkerDiamondLatticeControls,
      circlePackingControls,
      concentricBoxesControls,
      cutoutCollageControls,
      diffusionLimitedAggregationControls,
      drunkWalkPainterControls,
      domainWarpedNoiseControls,
      dungeonRoomsControls,
      erosionDilationPipelineControls,
      ellersControls,
      gameOfLifeVariantsControls,
      globalInvert,
      glitchBlocksControls,
      growingTreeControls,
      huntAndKillControls,
      kaleidoscopeControls,
      kruskalsControls,
      lSystemTurtleControls,
      lineInterferenceControls,
      layoutHeight,
      layoutWidth,
      particleFlowFieldControls,
      perlinNoiseControls,
      primsControls,
      randomNoiseControls,
      randomSeed,
      radialSymmetryControls,
      reactionDiffusionApproximationControls,
      recursiveDivisionControls,
      roomScatterControls,
      roseCurvesControls,
      selectedAlgorithm,
      sidewinderControls,
      stampBrushGeneratorControls,
      stripePlaidGeneratorControls,
      starredKeys,
      starredOnly,
      thresholdedGradientNoiseControls,
      tileableMotifRepeaterControls,
      trivialMazeControls,
      valueFractalNoiseControls,
      voronoiRegionCarverControls,
      wilsonsControls,
      worleyNoiseControls,
    ],
  );
  const selectedRecord =
    visibleRecords.find((record) => record.wallKey === selectedWallKey) ??
    visibleRecords[0] ??
    null;

  useEffect(() => {
    if (visibleRecords.length === 0) {
      if (selectedWallKey !== null) setSelectedWallKey(null);
      return;
    }

    if (!selectedRecord) {
      setSelectedWallKey(visibleRecords[0]!.wallKey);
    }
  }, [selectedRecord, selectedWallKey, visibleRecords]);

  function setLayoutWidthValue(nextValue: number): void {
    const next = sanitizeGeneratedLayoutDimension(nextValue);
    setLayoutWidth(next);
    setLayoutWidthInput(String(next));
  }

  function setLayoutHeightValue(nextValue: number): void {
    const next = sanitizeGeneratedLayoutDimension(nextValue);
    setLayoutHeight(next);
    setLayoutHeightInput(String(next));
  }

  function commitLayoutWidthInput(): void {
    const parsed = Number(layoutWidthInput);
    if (!Number.isFinite(parsed)) {
      setLayoutWidthInput(String(layoutWidth));
      return;
    }
    setLayoutWidthValue(parsed);
  }

  function commitLayoutHeightInput(): void {
    const parsed = Number(layoutHeightInput);
    if (!Number.isFinite(parsed)) {
      setLayoutHeightInput(String(layoutHeight));
      return;
    }
    setLayoutHeightValue(parsed);
  }

  function updateRandomNoiseControl<K extends keyof RandomNoiseControlState>(
    key: K,
    nextValue: Partial<RandomNoiseControlState[K]>,
  ): void {
    setRandomNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updatePerlinNoiseControl<K extends keyof PerlinNoiseControlState>(
    key: K,
    nextValue: Partial<PerlinNoiseControlState[K]>,
  ): void {
    setPerlinNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateValueFractalNoiseControl<K extends keyof ValueFractalNoiseControlState>(
    key: K,
    nextValue: Partial<ValueFractalNoiseControlState[K]>,
  ): void {
    setValueFractalNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateWorleyNoiseControl<K extends keyof WorleyNoiseControlState>(
    key: K,
    nextValue: Partial<WorleyNoiseControlState[K]>,
  ): void {
    setWorleyNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateThresholdedGradientNoiseControl<
    K extends keyof ThresholdedGradientNoiseControlState,
  >(key: K, nextValue: Partial<ThresholdedGradientNoiseControlState[K]>): void {
    setThresholdedGradientNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateDomainWarpedNoiseControl<K extends keyof DomainWarpedNoiseControlState>(
    key: K,
    nextValue: Partial<DomainWarpedNoiseControlState[K]>,
  ): void {
    setDomainWarpedNoiseControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateRadialSymmetryControl<K extends keyof RadialSymmetryControlState>(
    key: K,
    nextValue: Partial<RadialSymmetryControlState[K]>,
  ): void {
    setRadialSymmetryControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateKaleidoscopeControl<K extends keyof KaleidoscopeControlState>(
    key: K,
    nextValue: Partial<KaleidoscopeControlState[K]>,
  ): void {
    setKaleidoscopeControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateLSystemTurtleControl<K extends keyof LSystemTurtleControlState>(
    key: K,
    nextValue: Partial<LSystemTurtleControlState[K]>,
  ): void {
    setLSystemTurtleControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateRoseCurvesControl<K extends keyof RoseCurvesControlState>(
    key: K,
    nextValue: Partial<RoseCurvesControlState[K]>,
  ): void {
    setRoseCurvesControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateTileableMotifRepeaterControl<K extends keyof TileableMotifRepeaterControlState>(
    key: K,
    nextValue: Partial<TileableMotifRepeaterControlState[K]>,
  ): void {
    setTileableMotifRepeaterControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateBspRoomPartitionerControl<K extends keyof BspRoomPartitionerControlState>(
    key: K,
    nextValue: Partial<BspRoomPartitionerControlState[K]>,
  ): void {
    setBspRoomPartitionerControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCorridorGridControl<K extends keyof CorridorGridControlState>(
    key: K,
    nextValue: Partial<CorridorGridControlState[K]>,
  ): void {
    setCorridorGridControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateRoomScatterControl<K extends keyof RoomScatterControlState>(
    key: K,
    nextValue: Partial<RoomScatterControlState[K]>,
  ): void {
    setRoomScatterControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCourtyardGeneratorControl<K extends keyof CourtyardGeneratorControlState>(
    key: K,
    nextValue: Partial<CourtyardGeneratorControlState[K]>,
  ): void {
    setCourtyardGeneratorControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateBlueprintGeneratorControl<K extends keyof BlueprintGeneratorControlState>(
    key: K,
    nextValue: Partial<BlueprintGeneratorControlState[K]>,
  ): void {
    setBlueprintGeneratorControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateStripePlaidGeneratorControl<K extends keyof StripePlaidGeneratorControlState>(
    key: K,
    nextValue: Partial<StripePlaidGeneratorControlState[K]>,
  ): void {
    setStripePlaidGeneratorControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCheckerDiamondLatticeControl<K extends keyof CheckerDiamondLatticeControlState>(
    key: K,
    nextValue: Partial<CheckerDiamondLatticeControlState[K]>,
  ): void {
    setCheckerDiamondLatticeControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateConcentricBoxesControl<K extends keyof ConcentricBoxesControlState>(
    key: K,
    nextValue: Partial<ConcentricBoxesControlState[K]>,
  ): void {
    setConcentricBoxesControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateLineInterferenceControl<K extends keyof LineInterferenceControlState>(
    key: K,
    nextValue: Partial<LineInterferenceControlState[K]>,
  ): void {
    setLineInterferenceControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCirclePackingControl<K extends keyof CirclePackingControlState>(
    key: K,
    nextValue: Partial<CirclePackingControlState[K]>,
  ): void {
    setCirclePackingControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateDrunkWalkPainterControl<K extends keyof DrunkWalkPainterControlState>(
    key: K,
    nextValue: Partial<DrunkWalkPainterControlState[K]>,
  ): void {
    setDrunkWalkPainterControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateParticleFlowFieldControl<K extends keyof ParticleFlowFieldControlState>(
    key: K,
    nextValue: Partial<ParticleFlowFieldControlState[K]>,
  ): void {
    setParticleFlowFieldControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateStampBrushGeneratorControl<K extends keyof StampBrushGeneratorControlState>(
    key: K,
    nextValue: Partial<StampBrushGeneratorControlState[K]>,
  ): void {
    setStampBrushGeneratorControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCutoutCollageControl<K extends keyof CutoutCollageControlState>(
    key: K,
    nextValue: Partial<CutoutCollageControlState[K]>,
  ): void {
    setCutoutCollageControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateGlitchBlocksControl<K extends keyof GlitchBlocksControlState>(
    key: K,
    nextValue: Partial<GlitchBlocksControlState[K]>,
  ): void {
    setGlitchBlocksControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateGameOfLifeVariantsControl<K extends keyof GameOfLifeVariantsControlState>(
    key: K,
    nextValue: Partial<GameOfLifeVariantsControlState[K]>,
  ): void {
    setGameOfLifeVariantsControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateDiffusionLimitedAggregationControl<
    K extends keyof DiffusionLimitedAggregationControlState,
  >(key: K, nextValue: Partial<DiffusionLimitedAggregationControlState[K]>): void {
    setDiffusionLimitedAggregationControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateReactionDiffusionApproximationControl<
    K extends keyof ReactionDiffusionApproximationControlState,
  >(key: K, nextValue: Partial<ReactionDiffusionApproximationControlState[K]>): void {
    setReactionDiffusionApproximationControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateVoronoiRegionCarverControl<K extends keyof VoronoiRegionCarverControlState>(
    key: K,
    nextValue: Partial<VoronoiRegionCarverControlState[K]>,
  ): void {
    setVoronoiRegionCarverControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateErosionDilationPipelineControl<
    K extends keyof ErosionDilationPipelineControlState,
  >(key: K, nextValue: Partial<ErosionDilationPipelineControlState[K]>): void {
    setErosionDilationPipelineControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateBacktrackingControl<K extends keyof BacktrackingControlState>(
    key: K,
    nextValue: Partial<BacktrackingControlState[K]>,
  ): void {
    setBacktrackingControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateGrowingTreeControl<K extends keyof GrowingTreeControlState>(
    key: K,
    nextValue: Partial<GrowingTreeControlState[K]>,
  ): void {
    setGrowingTreeControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateKruskalsControl<K extends keyof KruskalsControlState>(
    key: K,
    nextValue: Partial<KruskalsControlState[K]>,
  ): void {
    setKruskalsControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateSidewinderControl<K extends keyof SidewinderControlState>(
    key: K,
    nextValue: Partial<SidewinderControlState[K]>,
  ): void {
    setSidewinderControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateBinaryTreeControl<K extends keyof BinaryTreeControlState>(
    key: K,
    nextValue: Partial<BinaryTreeControlState[K]>,
  ): void {
    setBinaryTreeControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateHuntAndKillControl<K extends keyof HuntAndKillControlState>(
    key: K,
    nextValue: Partial<HuntAndKillControlState[K]>,
  ): void {
    setHuntAndKillControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateWilsonsControl<K extends keyof WilsonsControlState>(
    key: K,
    nextValue: Partial<WilsonsControlState[K]>,
  ): void {
    setWilsonsControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateAldousBroderControl<K extends keyof AldousBroderControlState>(
    key: K,
    nextValue: Partial<AldousBroderControlState[K]>,
  ): void {
    setAldousBroderControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateEllersControl<K extends keyof EllersControlState>(
    key: K,
    nextValue: Partial<EllersControlState[K]>,
  ): void {
    setEllersControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateCellularAutomatonControl<K extends keyof CellularAutomatonControlState>(
    key: K,
    nextValue: Partial<CellularAutomatonControlState[K]>,
  ): void {
    setCellularAutomatonControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateDungeonRoomsControl<K extends keyof DungeonRoomsControlState>(
    key: K,
    nextValue: Partial<DungeonRoomsControlState[K]>,
  ): void {
    setDungeonRoomsControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateTrivialMazeControl<K extends keyof TrivialMazeControlState>(
    key: K,
    nextValue: Partial<TrivialMazeControlState[K]>,
  ): void {
    setTrivialMazeControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updatePrimsControl<K extends keyof PrimsControlState>(
    key: K,
    nextValue: Partial<PrimsControlState[K]>,
  ): void {
    setPrimsControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function updateRecursiveDivisionControl<K extends keyof RecursiveDivisionControlState>(
    key: K,
    nextValue: Partial<RecursiveDivisionControlState[K]>,
  ): void {
    setRecursiveDivisionControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...nextValue,
      },
    }));
  }

  function setControlsWithHiddenInvert<
    T extends Readonly<{ invert: Readonly<{ randomize: boolean; value: boolean }> }>,
  >(setter: Dispatch<SetStateAction<T>>, controls: Omit<T, "invert">): void {
    setter({
      ...controls,
      invert: { randomize: false, value: false },
    } as T);
  }

  function applyMoreLikeThis(record: GeneratedLayoutRecord): void {
    if (record.algorithm === "starred") return;

    setStarredOnly(false);
    setSelectedWallKey(null);
    setGlobalInvert(record.inverted);

    if (record.algorithm === "random-noise") {
      setSelectedAlgorithm("random-noise");
      setControlsWithHiddenInvert(setRandomNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        density: { randomize: false, value: record.params.density },
        blockSize: { randomize: false, value: record.params.blockSize },
        mirror: { randomize: false, value: record.params.mirror },
      });
    } else if (record.algorithm === "perlin-noise") {
      setSelectedAlgorithm("perlin-noise");
      setControlsWithHiddenInvert(setPerlinNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
      });
    } else if (record.algorithm === "value-fractal-noise") {
      setSelectedAlgorithm("value-fractal-noise");
      setControlsWithHiddenInvert(setValueFractalNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
        gain: { randomize: false, value: record.params.gain },
      });
    } else if (record.algorithm === "worley-noise") {
      setSelectedAlgorithm("worley-noise");
      setControlsWithHiddenInvert(setWorleyNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        cellCount: { randomize: false, value: record.params.cellCount },
        jitter: { randomize: false, value: record.params.jitter },
      });
    } else if (record.algorithm === "thresholded-gradient-noise") {
      setSelectedAlgorithm("thresholded-gradient-noise");
      setControlsWithHiddenInvert(setThresholdedGradientNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        scale: { randomize: false, value: record.params.scale },
        angle: { randomize: false, value: record.params.angle },
        roughness: { randomize: false, value: record.params.roughness },
      });
    } else if (record.algorithm === "domain-warped-noise") {
      setSelectedAlgorithm("domain-warped-noise");
      setControlsWithHiddenInvert(setDomainWarpedNoiseControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
        warpScale: { randomize: false, value: record.params.warpScale },
        warpStrength: { randomize: false, value: record.params.warpStrength },
      });
    } else if (record.algorithm === "radial-symmetry") {
      setSelectedAlgorithm("radial-symmetry");
      setControlsWithHiddenInvert(setRadialSymmetryControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        folds: { randomize: false, value: record.params.folds },
        rings: { randomize: false, value: record.params.rings },
        twist: { randomize: false, value: record.params.twist },
        thickness: { randomize: false, value: record.params.thickness },
      });
    } else if (record.algorithm === "kaleidoscope") {
      setSelectedAlgorithm("kaleidoscope");
      setControlsWithHiddenInvert(setKaleidoscopeControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        segments: { randomize: false, value: record.params.segments },
        scale: { randomize: false, value: record.params.scale },
        threshold: { randomize: false, value: record.params.threshold },
      });
    } else if (record.algorithm === "l-system-turtle") {
      setSelectedAlgorithm("l-system-turtle");
      setControlsWithHiddenInvert(setLSystemTurtleControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        preset: { randomize: false, value: record.params.preset },
        iterations: { randomize: false, value: record.params.iterations },
        turnAngle: { randomize: false, value: record.params.turnAngle },
        strokeWidth: { randomize: false, value: record.params.strokeWidth },
      });
    } else if (record.algorithm === "rose-curves") {
      setSelectedAlgorithm("rose-curves");
      setControlsWithHiddenInvert(setRoseCurvesControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        petals: { randomize: false, value: record.params.petals },
        harmonic: { randomize: false, value: record.params.harmonic },
        rotation: { randomize: false, value: record.params.rotation },
        strokeWidth: { randomize: false, value: record.params.strokeWidth },
      });
    } else if (record.algorithm === "tileable-motif-repeater") {
      setSelectedAlgorithm("tileable-motif-repeater");
      setControlsWithHiddenInvert(setTileableMotifRepeaterControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        motif: { randomize: false, value: record.params.motif },
        spacing: { randomize: false, value: record.params.spacing },
        motifSize: { randomize: false, value: record.params.motifSize },
        jitter: { randomize: false, value: record.params.jitter },
        rotation: { randomize: false, value: record.params.rotation },
      });
    } else if (record.algorithm === "bsp-room-partitioner") {
      setSelectedAlgorithm("bsp-room-partitioner");
      setControlsWithHiddenInvert(setBspRoomPartitionerControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        splitDepth: { randomize: false, value: record.params.splitDepth },
        roomPadding: { randomize: false, value: record.params.roomPadding },
        corridorWidth: { randomize: false, value: record.params.corridorWidth },
      });
    } else if (record.algorithm === "corridor-grid") {
      setSelectedAlgorithm("corridor-grid");
      setControlsWithHiddenInvert(setCorridorGridControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        columnSpacing: { randomize: false, value: record.params.columnSpacing },
        rowSpacing: { randomize: false, value: record.params.rowSpacing },
        wallThickness: { randomize: false, value: record.params.wallThickness },
        gapChance: { randomize: false, value: record.params.gapChance },
      });
    } else if (record.algorithm === "room-scatter") {
      setSelectedAlgorithm("room-scatter");
      setControlsWithHiddenInvert(setRoomScatterControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        roomCount: { randomize: false, value: record.params.roomCount },
        roomSize: { randomize: false, value: record.params.roomSize },
        gap: { randomize: false, value: record.params.gap },
        connectorChance: { randomize: false, value: record.params.connectorChance },
      });
    } else if (record.algorithm === "courtyard-generator") {
      setSelectedAlgorithm("courtyard-generator");
      setControlsWithHiddenInvert(setCourtyardGeneratorControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        ringCount: { randomize: false, value: record.params.ringCount },
        ringGap: { randomize: false, value: record.params.ringGap },
        gateWidth: { randomize: false, value: record.params.gateWidth },
        offset: { randomize: false, value: record.params.offset },
      });
    } else if (record.algorithm === "blueprint-generator") {
      setSelectedAlgorithm("blueprint-generator");
      setControlsWithHiddenInvert(setBlueprintGeneratorControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        wingCount: { randomize: false, value: record.params.wingCount },
        hallWidth: { randomize: false, value: record.params.hallWidth },
        pillarSpacing: { randomize: false, value: record.params.pillarSpacing },
        chamberDepth: { randomize: false, value: record.params.chamberDepth },
      });
    } else if (record.algorithm === "stripe-plaid-generator") {
      setSelectedAlgorithm("stripe-plaid-generator");
      setControlsWithHiddenInvert(setStripePlaidGeneratorControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        mode: { randomize: false, value: record.params.mode },
        spacing: { randomize: false, value: record.params.spacing },
        bandWidth: { randomize: false, value: record.params.bandWidth },
        offset: { randomize: false, value: record.params.offset },
      });
    } else if (record.algorithm === "checker-diamond-lattice") {
      setSelectedAlgorithm("checker-diamond-lattice");
      setControlsWithHiddenInvert(setCheckerDiamondLatticeControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        style: { randomize: false, value: record.params.style },
        cellSize: { randomize: false, value: record.params.cellSize },
        lineWidth: { randomize: false, value: record.params.lineWidth },
        phase: { randomize: false, value: record.params.phase },
      });
    } else if (record.algorithm === "concentric-boxes") {
      setSelectedAlgorithm("concentric-boxes");
      setControlsWithHiddenInvert(setConcentricBoxesControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        ringCount: { randomize: false, value: record.params.ringCount },
        spacing: { randomize: false, value: record.params.spacing },
        lineWidth: { randomize: false, value: record.params.lineWidth },
        drift: { randomize: false, value: record.params.drift },
      });
    } else if (record.algorithm === "line-interference") {
      setSelectedAlgorithm("line-interference");
      setControlsWithHiddenInvert(setLineInterferenceControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        angleA: { randomize: false, value: record.params.angleA },
        angleB: { randomize: false, value: record.params.angleB },
        spacing: { randomize: false, value: record.params.spacing },
        strokeWidth: { randomize: false, value: record.params.strokeWidth },
      });
    } else if (record.algorithm === "circle-packing") {
      setSelectedAlgorithm("circle-packing");
      setControlsWithHiddenInvert(setCirclePackingControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        circleCount: { randomize: false, value: record.params.circleCount },
        minRadius: { randomize: false, value: record.params.minRadius },
        maxRadius: { randomize: false, value: record.params.maxRadius },
        outline: { randomize: false, value: record.params.outline },
      });
    } else if (record.algorithm === "drunk-walk-painter") {
      setSelectedAlgorithm("drunk-walk-painter");
      setControlsWithHiddenInvert(setDrunkWalkPainterControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        walkerCount: { randomize: false, value: record.params.walkerCount },
        steps: { randomize: false, value: record.params.steps },
        brushSize: { randomize: false, value: record.params.brushSize },
        roomChance: { randomize: false, value: record.params.roomChance },
      });
    } else if (record.algorithm === "particle-flow-field") {
      setSelectedAlgorithm("particle-flow-field");
      setControlsWithHiddenInvert(setParticleFlowFieldControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        agentCount: { randomize: false, value: record.params.agentCount },
        steps: { randomize: false, value: record.params.steps },
        fieldScale: { randomize: false, value: record.params.fieldScale },
        strokeWidth: { randomize: false, value: record.params.strokeWidth },
      });
    } else if (record.algorithm === "stamp-brush-generator") {
      setSelectedAlgorithm("stamp-brush-generator");
      setControlsWithHiddenInvert(setStampBrushGeneratorControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        stampCount: { randomize: false, value: record.params.stampCount },
        stampSize: { randomize: false, value: record.params.stampSize },
        stampType: { randomize: false, value: record.params.stampType },
        scatter: { randomize: false, value: record.params.scatter },
      });
    } else if (record.algorithm === "cutout-collage") {
      setSelectedAlgorithm("cutout-collage");
      setControlsWithHiddenInvert(setCutoutCollageControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        shapeCount: { randomize: false, value: record.params.shapeCount },
        minSize: { randomize: false, value: record.params.minSize },
        maxSize: { randomize: false, value: record.params.maxSize },
        subtractChance: { randomize: false, value: record.params.subtractChance },
      });
    } else if (record.algorithm === "glitch-blocks") {
      setSelectedAlgorithm("glitch-blocks");
      setControlsWithHiddenInvert(setGlitchBlocksControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        bandCount: { randomize: false, value: record.params.bandCount },
        offsetRange: { randomize: false, value: record.params.offsetRange },
        stripeChance: { randomize: false, value: record.params.stripeChance },
        cellSize: { randomize: false, value: record.params.cellSize },
      });
    } else if (record.algorithm === "game-of-life-variants") {
      setSelectedAlgorithm("game-of-life-variants");
      setControlsWithHiddenInvert(setGameOfLifeVariantsControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        density: { randomize: false, value: record.params.density },
        steps: { randomize: false, value: record.params.steps },
        variant: { randomize: false, value: record.params.variant },
      });
    } else if (record.algorithm === "diffusion-limited-aggregation") {
      setSelectedAlgorithm("diffusion-limited-aggregation");
      setControlsWithHiddenInvert(setDiffusionLimitedAggregationControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        walkers: { randomize: false, value: record.params.walkers },
        stickiness: { randomize: false, value: record.params.stickiness },
        seedMode: { randomize: false, value: record.params.seedMode },
      });
    } else if (record.algorithm === "reaction-diffusion-approximation") {
      setSelectedAlgorithm("reaction-diffusion-approximation");
      setControlsWithHiddenInvert(setReactionDiffusionApproximationControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        spotCount: { randomize: false, value: record.params.spotCount },
        iterations: { randomize: false, value: record.params.iterations },
        feed: { randomize: false, value: record.params.feed },
        kill: { randomize: false, value: record.params.kill },
      });
    } else if (record.algorithm === "voronoi-region-carver") {
      setSelectedAlgorithm("voronoi-region-carver");
      setControlsWithHiddenInvert(setVoronoiRegionCarverControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        siteCount: { randomize: false, value: record.params.siteCount },
        ridgeWidth: { randomize: false, value: record.params.ridgeWidth },
        jitter: { randomize: false, value: record.params.jitter },
      });
    } else if (record.algorithm === "erosion-dilation-pipeline") {
      setSelectedAlgorithm("erosion-dilation-pipeline");
      setControlsWithHiddenInvert(setErosionDilationPipelineControls, {
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        density: { randomize: false, value: record.params.density },
        growSteps: { randomize: false, value: record.params.growSteps },
        shrinkSteps: { randomize: false, value: record.params.shrinkSteps },
        punctureChance: { randomize: false, value: record.params.punctureChance },
      });
    } else if (record.algorithm === "backtracking-generator") {
      setSelectedAlgorithm("backtracking-generator");
      setBacktrackingControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        startColumn: { randomize: false, value: record.params.startColumn },
        startRow: { randomize: false, value: record.params.startRow },
      });
    } else if (record.algorithm === "prims") {
      setSelectedAlgorithm("prims");
      setPrimsControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        startColumn: { randomize: false, value: record.params.startColumn },
        startRow: { randomize: false, value: record.params.startRow },
      });
    } else if (record.algorithm === "kruskals") {
      setSelectedAlgorithm("kruskals");
      setKruskalsControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
      });
    } else if (record.algorithm === "sidewinder") {
      setSelectedAlgorithm("sidewinder");
      setSidewinderControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        skew: { randomize: false, value: record.params.skew },
      });
    } else if (record.algorithm === "binary-tree") {
      setSelectedAlgorithm("binary-tree");
      setBinaryTreeControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        skew: { randomize: false, value: record.params.skew },
      });
    } else if (record.algorithm === "hunt-and-kill") {
      setSelectedAlgorithm("hunt-and-kill");
      setHuntAndKillControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        huntOrder: { randomize: false, value: record.params.huntOrder },
      });
    } else if (record.algorithm === "wilsons") {
      setSelectedAlgorithm("wilsons");
      setWilsonsControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        huntOrder: { randomize: false, value: record.params.huntOrder },
      });
    } else if (record.algorithm === "aldous-broder") {
      setSelectedAlgorithm("aldous-broder");
      setAldousBroderControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
      });
    } else if (record.algorithm === "ellers") {
      setSelectedAlgorithm("ellers");
      setEllersControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        xskew: { randomize: false, value: record.params.xskew },
        yskew: { randomize: false, value: record.params.yskew },
      });
    } else if (record.algorithm === "cellular-automaton") {
      setSelectedAlgorithm("cellular-automaton");
      setCellularAutomatonControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        complexity: { randomize: false, value: record.params.complexity },
        density: { randomize: false, value: record.params.density },
      });
    } else if (record.algorithm === "dungeon-rooms") {
      setSelectedAlgorithm("dungeon-rooms");
      setDungeonRoomsControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        huntOrder: { randomize: false, value: record.params.huntOrder },
        roomCount: { randomize: false, value: record.params.roomCount },
        roomSize: { randomize: false, value: record.params.roomSize },
      });
    } else if (record.algorithm === "trivial-maze") {
      setSelectedAlgorithm("trivial-maze");
      setTrivialMazeControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        mazeType: { randomize: false, value: record.params.mazeType },
      });
    } else if (record.algorithm === "growing-tree") {
      setSelectedAlgorithm("growing-tree");
      setGrowingTreeControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        startColumn: { randomize: false, value: record.params.startColumn },
        startRow: { randomize: false, value: record.params.startRow },
        backtrackChance: { randomize: false, value: record.params.backtrackChance },
      });
    } else if (record.algorithm === "recursive-division") {
      setSelectedAlgorithm("recursive-division");
      setRecursiveDivisionControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
      });
    }

    setRandomSeed(nextRandomSeed());
  }

  return (
    <div
      className="modalBackdrop"
      onClick={onClose}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div
        className="modalCard modalCardWide generateDialogCard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-browser-title"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <div className="sectionEyebrow">File</div>
            <h2 id="generate-browser-title" className="modalTitle">
              Generate
            </h2>
          </div>
          <button
            type="button"
            className="modalCloseButton"
            aria-label="Close generate dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modalBody generateDialogBody">
          <div className="generateToolbar">
            <label className="fieldGroup generateField">
              <span className="fieldLabel">Algorithm</span>
              <select
                className="generateSelect"
                value={selectedAlgorithm}
                disabled={starredOnly}
                onChange={(event) => {
                  setSelectedAlgorithm(event.target.value as GenerateAlgorithmChoice);
                  setRandomSeed(nextRandomSeed());
                }}
              >
                {GENERATE_ALGORITHM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <GenerateSizeField
              label="Width"
              value={layoutWidth}
              inputValue={layoutWidthInput}
              disabled={starredOnly}
              onInputChange={setLayoutWidthInput}
              onCommit={commitLayoutWidthInput}
              onValueChange={setLayoutWidthValue}
              onStep={(delta) => setLayoutWidthValue(layoutWidth + delta)}
            />
            <GenerateSizeField
              label="Height"
              value={layoutHeight}
              inputValue={layoutHeightInput}
              disabled={starredOnly}
              onInputChange={setLayoutHeightInput}
              onCommit={commitLayoutHeightInput}
              onValueChange={setLayoutHeightValue}
              onStep={(delta) => setLayoutHeightValue(layoutHeight + delta)}
            />
            <label className="wallsToggle generateToggle">
              <input
                type="checkbox"
                checked={globalInvert}
                disabled={starredOnly}
                onChange={(event) => setGlobalInvert(event.target.checked)}
              />
              <span>Invert</span>
            </label>
            <label className="wallsToggle generateToggle">
              <input
                type="checkbox"
                checked={starredOnly}
                onChange={(event) => setStarredOnly(event.target.checked)}
              />
              <span>Starred only</span>
            </label>
            <div className="statusBadge generateStatusBadge">
              {visibleRecords.length} {starredOnly ? "starred" : "generated"}
            </div>
            <div className="statusBadge generateStatusBadge">{starredKeys.size} total starred</div>
          </div>

          <div className={`generateWorkspace ${showParameterSidebar ? "withParameters" : ""}`}>
            {showParameterSidebar ? (
              <aside className="generateSidebar generateParameterSidebar">
                {selectedAlgorithm === "random-noise" ? (
                  <RandomNoiseSettingsPanel
                    controls={randomNoiseControls}
                    onUpdate={updateRandomNoiseControl}
                  />
                ) : selectedAlgorithm === "perlin-noise" ? (
                  <PerlinNoiseSettingsPanel
                    controls={perlinNoiseControls}
                    onUpdate={updatePerlinNoiseControl}
                  />
                ) : selectedAlgorithm === "value-fractal-noise" ? (
                  <ValueFractalNoiseSettingsPanel
                    controls={valueFractalNoiseControls}
                    onUpdate={updateValueFractalNoiseControl}
                  />
                ) : selectedAlgorithm === "worley-noise" ? (
                  <WorleyNoiseSettingsPanel
                    controls={worleyNoiseControls}
                    onUpdate={updateWorleyNoiseControl}
                  />
                ) : selectedAlgorithm === "thresholded-gradient-noise" ? (
                  <ThresholdedGradientNoiseSettingsPanel
                    controls={thresholdedGradientNoiseControls}
                    onUpdate={updateThresholdedGradientNoiseControl}
                  />
                ) : selectedAlgorithm === "domain-warped-noise" ? (
                  <DomainWarpedNoiseSettingsPanel
                    controls={domainWarpedNoiseControls}
                    onUpdate={updateDomainWarpedNoiseControl}
                  />
                ) : selectedAlgorithm === "radial-symmetry" ? (
                  <RadialSymmetrySettingsPanel
                    controls={radialSymmetryControls}
                    onUpdate={updateRadialSymmetryControl}
                  />
                ) : selectedAlgorithm === "kaleidoscope" ? (
                  <KaleidoscopeSettingsPanel
                    controls={kaleidoscopeControls}
                    onUpdate={updateKaleidoscopeControl}
                  />
                ) : selectedAlgorithm === "l-system-turtle" ? (
                  <LSystemTurtleSettingsPanel
                    controls={lSystemTurtleControls}
                    onUpdate={updateLSystemTurtleControl}
                  />
                ) : selectedAlgorithm === "rose-curves" ? (
                  <RoseCurvesSettingsPanel
                    controls={roseCurvesControls}
                    onUpdate={updateRoseCurvesControl}
                  />
                ) : selectedAlgorithm === "tileable-motif-repeater" ? (
                  <TileableMotifRepeaterSettingsPanel
                    controls={tileableMotifRepeaterControls}
                    onUpdate={updateTileableMotifRepeaterControl}
                  />
                ) : selectedAlgorithm === "bsp-room-partitioner" ? (
                  <BspRoomPartitionerSettingsPanel
                    controls={bspRoomPartitionerControls}
                    onUpdate={updateBspRoomPartitionerControl}
                  />
                ) : selectedAlgorithm === "corridor-grid" ? (
                  <CorridorGridSettingsPanel
                    controls={corridorGridControls}
                    onUpdate={updateCorridorGridControl}
                  />
                ) : selectedAlgorithm === "room-scatter" ? (
                  <RoomScatterSettingsPanel
                    controls={roomScatterControls}
                    onUpdate={updateRoomScatterControl}
                  />
                ) : selectedAlgorithm === "courtyard-generator" ? (
                  <CourtyardGeneratorSettingsPanel
                    controls={courtyardGeneratorControls}
                    onUpdate={updateCourtyardGeneratorControl}
                  />
                ) : selectedAlgorithm === "blueprint-generator" ? (
                  <BlueprintGeneratorSettingsPanel
                    controls={blueprintGeneratorControls}
                    onUpdate={updateBlueprintGeneratorControl}
                  />
                ) : selectedAlgorithm === "stripe-plaid-generator" ? (
                  <StripePlaidGeneratorSettingsPanel
                    controls={stripePlaidGeneratorControls}
                    onUpdate={updateStripePlaidGeneratorControl}
                  />
                ) : selectedAlgorithm === "checker-diamond-lattice" ? (
                  <CheckerDiamondLatticeSettingsPanel
                    controls={checkerDiamondLatticeControls}
                    onUpdate={updateCheckerDiamondLatticeControl}
                  />
                ) : selectedAlgorithm === "concentric-boxes" ? (
                  <ConcentricBoxesSettingsPanel
                    controls={concentricBoxesControls}
                    onUpdate={updateConcentricBoxesControl}
                  />
                ) : selectedAlgorithm === "line-interference" ? (
                  <LineInterferenceSettingsPanel
                    controls={lineInterferenceControls}
                    onUpdate={updateLineInterferenceControl}
                  />
                ) : selectedAlgorithm === "circle-packing" ? (
                  <CirclePackingSettingsPanel
                    controls={circlePackingControls}
                    onUpdate={updateCirclePackingControl}
                  />
                ) : selectedAlgorithm === "drunk-walk-painter" ? (
                  <DrunkWalkPainterSettingsPanel
                    controls={drunkWalkPainterControls}
                    onUpdate={updateDrunkWalkPainterControl}
                  />
                ) : selectedAlgorithm === "particle-flow-field" ? (
                  <ParticleFlowFieldSettingsPanel
                    controls={particleFlowFieldControls}
                    onUpdate={updateParticleFlowFieldControl}
                  />
                ) : selectedAlgorithm === "stamp-brush-generator" ? (
                  <StampBrushGeneratorSettingsPanel
                    controls={stampBrushGeneratorControls}
                    onUpdate={updateStampBrushGeneratorControl}
                  />
                ) : selectedAlgorithm === "cutout-collage" ? (
                  <CutoutCollageSettingsPanel
                    controls={cutoutCollageControls}
                    onUpdate={updateCutoutCollageControl}
                  />
                ) : selectedAlgorithm === "glitch-blocks" ? (
                  <GlitchBlocksSettingsPanel
                    controls={glitchBlocksControls}
                    onUpdate={updateGlitchBlocksControl}
                  />
                ) : selectedAlgorithm === "game-of-life-variants" ? (
                  <GameOfLifeVariantsSettingsPanel
                    controls={gameOfLifeVariantsControls}
                    onUpdate={updateGameOfLifeVariantsControl}
                  />
                ) : selectedAlgorithm === "diffusion-limited-aggregation" ? (
                  <DiffusionLimitedAggregationSettingsPanel
                    controls={diffusionLimitedAggregationControls}
                    onUpdate={updateDiffusionLimitedAggregationControl}
                  />
                ) : selectedAlgorithm === "reaction-diffusion-approximation" ? (
                  <ReactionDiffusionApproximationSettingsPanel
                    controls={reactionDiffusionApproximationControls}
                    onUpdate={updateReactionDiffusionApproximationControl}
                  />
                ) : selectedAlgorithm === "voronoi-region-carver" ? (
                  <VoronoiRegionCarverSettingsPanel
                    controls={voronoiRegionCarverControls}
                    onUpdate={updateVoronoiRegionCarverControl}
                  />
                ) : selectedAlgorithm === "erosion-dilation-pipeline" ? (
                  <ErosionDilationPipelineSettingsPanel
                    controls={erosionDilationPipelineControls}
                    onUpdate={updateErosionDilationPipelineControl}
                  />
                ) : selectedAlgorithm === "backtracking-generator" ? (
                  <BacktrackingSettingsPanel
                    controls={backtrackingControls}
                    contentWidth={generatedContentWidth}
                    contentHeight={generatedContentHeight}
                    onUpdate={updateBacktrackingControl}
                  />
                ) : selectedAlgorithm === "prims" ? (
                  <PrimsSettingsPanel
                    controls={primsControls}
                    contentWidth={generatedContentWidth}
                    contentHeight={generatedContentHeight}
                    onUpdate={updatePrimsControl}
                  />
                ) : selectedAlgorithm === "kruskals" ? (
                  <KruskalsSettingsPanel
                    controls={kruskalsControls}
                    onUpdate={updateKruskalsControl}
                  />
                ) : selectedAlgorithm === "sidewinder" ? (
                  <SidewinderSettingsPanel
                    controls={sidewinderControls}
                    onUpdate={updateSidewinderControl}
                  />
                ) : selectedAlgorithm === "binary-tree" ? (
                  <BinaryTreeSettingsPanel
                    controls={binaryTreeControls}
                    onUpdate={updateBinaryTreeControl}
                  />
                ) : selectedAlgorithm === "hunt-and-kill" ? (
                  <HuntAndKillSettingsPanel
                    controls={huntAndKillControls}
                    onUpdate={updateHuntAndKillControl}
                  />
                ) : selectedAlgorithm === "wilsons" ? (
                  <WilsonsSettingsPanel
                    controls={wilsonsControls}
                    onUpdate={updateWilsonsControl}
                  />
                ) : selectedAlgorithm === "aldous-broder" ? (
                  <AldousBroderSettingsPanel
                    controls={aldousBroderControls}
                    onUpdate={updateAldousBroderControl}
                  />
                ) : selectedAlgorithm === "ellers" ? (
                  <EllersSettingsPanel controls={ellersControls} onUpdate={updateEllersControl} />
                ) : selectedAlgorithm === "cellular-automaton" ? (
                  <CellularAutomatonSettingsPanel
                    controls={cellularAutomatonControls}
                    onUpdate={updateCellularAutomatonControl}
                  />
                ) : selectedAlgorithm === "dungeon-rooms" ? (
                  <DungeonRoomsSettingsPanel
                    controls={dungeonRoomsControls}
                    contentWidth={generatedContentWidth}
                    contentHeight={generatedContentHeight}
                    onUpdate={updateDungeonRoomsControl}
                  />
                ) : selectedAlgorithm === "trivial-maze" ? (
                  <TrivialMazeSettingsPanel
                    controls={trivialMazeControls}
                    onUpdate={updateTrivialMazeControl}
                  />
                ) : selectedAlgorithm === "growing-tree" ? (
                  <GrowingTreeSettingsPanel
                    controls={growingTreeControls}
                    contentWidth={generatedContentWidth}
                    contentHeight={generatedContentHeight}
                    onUpdate={updateGrowingTreeControl}
                  />
                ) : selectedAlgorithm === "recursive-division" ? (
                  <RecursiveDivisionSettingsPanel
                    controls={recursiveDivisionControls}
                    onUpdate={updateRecursiveDivisionControl}
                  />
                ) : null}
              </aside>
            ) : null}

            <div className="generateCardsPane">
              {visibleRecords.length === 0 ? (
                <div className="banner">
                  {starredOnly
                    ? "No starred generated layouts yet. Save one from the generated view first."
                    : "No generated layouts were available for the current settings. Try Randomize."}
                </div>
              ) : (
                <div className="generateGrid">
                  {visibleRecords.map((record) => (
                    <GeneratedRecordCard
                      key={record.wallKey}
                      record={record}
                      selected={record.wallKey === selectedRecord?.wallKey}
                      starred={starredKeys.has(record.wallKey)}
                      onSelect={setSelectedWallKey}
                      onImport={onImport}
                      onToggleStar={onToggleStar}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="generateSidebar generateDetailSidebar">
              <GeneratedRecordDetails
                record={selectedRecord}
                starred={selectedRecord ? starredKeys.has(selectedRecord.wallKey) : false}
                onImport={onImport}
                onToggleStar={onToggleStar}
                onMoreLikeThis={applyMoreLikeThis}
              />
            </aside>
          </div>
        </div>
        <div className="modalActions generateDialogActions">
          <button
            type="button"
            className="secondaryButton"
            disabled={starredOnly}
            onClick={() => setRandomSeed(nextRandomSeed())}
          >
            Randomize
          </button>
          <button
            type="button"
            className="actionButton"
            disabled={!selectedRecord}
            onClick={() => {
              if (!selectedRecord) return;
              onImport(selectedRecord.wallKey);
            }}
          >
            Import Selected
          </button>
          <button type="button" className="secondaryButton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
