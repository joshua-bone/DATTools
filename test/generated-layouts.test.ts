import { describe, expect, it } from "vitest";

import {
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
  createDefaultDiffusionLimitedAggregationControlState,
  createDefaultDomainWarpedNoiseControlState,
  createDefaultDungeonRoomsControlState,
  createDefaultEllersControlState,
  createDefaultErosionDilationPipelineControlState,
  createDefaultGameOfLifeVariantsControlState,
  createDefaultGrowingTreeControlState,
  createDefaultHuntAndKillControlState,
  createDefaultKaleidoscopeControlState,
  createDefaultKruskalsControlState,
  createDefaultLSystemTurtleControlState,
  createDefaultLineInterferenceControlState,
  createDefaultPerlinNoiseControlState,
  createDefaultPrimsControlState,
  createDefaultRandomNoiseControlState,
  createDefaultRadialSymmetryControlState,
  createDefaultReactionDiffusionApproximationControlState,
  createDefaultRecursiveDivisionControlState,
  createDefaultRoomScatterControlState,
  createDefaultRoseCurvesControlState,
  createDefaultSidewinderControlState,
  createDefaultStripePlaidGeneratorControlState,
  createDefaultThresholdedGradientNoiseControlState,
  createDefaultTileableMotifRepeaterControlState,
  createDefaultTrivialMazeControlState,
  createDefaultValueFractalNoiseControlState,
  createDefaultVoronoiRegionCarverControlState,
  createDefaultWilsonsControlState,
  createDefaultWorleyNoiseControlState,
  generateLayoutRecords,
  recordsFromStarredKeys,
} from "@/web/src/generatedLayouts";

describe("generated layouts", () => {
  it("produces deterministic layout sets for Any selection", () => {
    const first = generateLayoutRecords({
      algorithm: "any",
      count: 6,
      seed: 12345,
    });
    const second = generateLayoutRecords({
      algorithm: "any",
      count: 6,
      seed: 12345,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(new Set(first.map((record) => record.wallKey)).size).toBe(6);
    expect(
      first.every(
        (record) =>
          record.algorithm === "random-noise" ||
          record.algorithm === "perlin-noise" ||
          record.algorithm === "value-fractal-noise" ||
          record.algorithm === "worley-noise" ||
          record.algorithm === "thresholded-gradient-noise" ||
          record.algorithm === "domain-warped-noise" ||
          record.algorithm === "radial-symmetry" ||
          record.algorithm === "kaleidoscope" ||
          record.algorithm === "l-system-turtle" ||
          record.algorithm === "rose-curves" ||
          record.algorithm === "tileable-motif-repeater" ||
          record.algorithm === "bsp-room-partitioner" ||
          record.algorithm === "corridor-grid" ||
          record.algorithm === "room-scatter" ||
          record.algorithm === "courtyard-generator" ||
          record.algorithm === "blueprint-generator" ||
          record.algorithm === "stripe-plaid-generator" ||
          record.algorithm === "checker-diamond-lattice" ||
          record.algorithm === "concentric-boxes" ||
          record.algorithm === "line-interference" ||
          record.algorithm === "circle-packing" ||
          record.algorithm === "game-of-life-variants" ||
          record.algorithm === "diffusion-limited-aggregation" ||
          record.algorithm === "reaction-diffusion-approximation" ||
          record.algorithm === "voronoi-region-carver" ||
          record.algorithm === "erosion-dilation-pipeline" ||
          record.algorithm === "backtracking-generator" ||
          record.algorithm === "growing-tree" ||
          record.algorithm === "prims" ||
          record.algorithm === "recursive-division" ||
          record.algorithm === "kruskals" ||
          record.algorithm === "sidewinder" ||
          record.algorithm === "binary-tree" ||
          record.algorithm === "hunt-and-kill" ||
          record.algorithm === "wilsons" ||
          record.algorithm === "aldous-broder" ||
          record.algorithm === "ellers" ||
          record.algorithm === "cellular-automaton" ||
          record.algorithm === "dungeon-rooms" ||
          record.algorithm === "trivial-maze",
      ),
    ).toBe(true);
  });

  it("builds stable starred records from saved wall keys", () => {
    const records = recordsFromStarredKeys(new Set(["beta", "alpha"]));

    expect(records.map((record) => record.wallKey)).toEqual(["alpha", "beta"]);
    expect(records[0]?.title).toBe("Starred Layout");
    expect(records[0]?.seedLabel).toBe("Saved locally");
    expect(records[0]?.algorithm).toBe("starred");
  });

  it("keeps locked random-noise parameters fixed across generated cards", () => {
    const controls = createDefaultRandomNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "random-noise",
      count: 6,
      seed: 12345,
      randomNoiseControls: {
        ...controls,
        density: { randomize: false, value: 0.24 },
        blockSize: { randomize: false, value: 4 },
        mirror: { randomize: false, value: "vertical" },
        invert: { randomize: false, value: true },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "random-noise" &&
          record.params.density === 0.24 &&
          record.params.blockSize === 4 &&
          record.params.mirror === "vertical" &&
          record.params.invert === true,
      ),
    ).toBe(true);
  });

  it("produces deterministic perlin-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "perlin-noise",
      count: 6,
      seed: 42424,
    });
    const second = generateLayoutRecords({
      algorithm: "perlin-noise",
      count: 6,
      seed: 42424,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "perlin-noise")).toBe(true);
  });

  it("keeps locked perlin-noise parameters fixed across generated cards", () => {
    const controls = createDefaultPerlinNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "perlin-noise",
      count: 6,
      seed: 51515,
      perlinNoiseControls: {
        ...controls,
        blockSize: { randomize: false, value: 4 },
        threshold: { randomize: false, value: 0.58 },
        invert: { randomize: false, value: true },
        scale: { randomize: false, value: 4.5 },
        octaves: { randomize: false, value: 5 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "perlin-noise" &&
          record.params.blockSize === 4 &&
          record.params.threshold === 0.58 &&
          record.params.invert === true &&
          record.params.scale === 4.5 &&
          record.params.octaves === 5,
      ),
    ).toBe(true);
  });

  it("produces deterministic value-fractal-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "value-fractal-noise",
      count: 6,
      seed: 61616,
    });
    const second = generateLayoutRecords({
      algorithm: "value-fractal-noise",
      count: 6,
      seed: 61616,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "value-fractal-noise")).toBe(true);
  });

  it("keeps locked value-fractal-noise parameters fixed across generated cards", () => {
    const controls = createDefaultValueFractalNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "value-fractal-noise",
      count: 6,
      seed: 71717,
      valueFractalNoiseControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        threshold: { randomize: false, value: 0.46 },
        invert: { randomize: false, value: false },
        scale: { randomize: false, value: 6 },
        octaves: { randomize: false, value: 4 },
        gain: { randomize: false, value: 0.65 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "value-fractal-noise" &&
          record.params.blockSize === 2 &&
          record.params.threshold === 0.46 &&
          record.params.invert === false &&
          record.params.scale === 6 &&
          record.params.octaves === 4 &&
          record.params.gain === 0.65,
      ),
    ).toBe(true);
  });

  it("produces deterministic worley-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "worley-noise",
      count: 6,
      seed: 81818,
    });
    const second = generateLayoutRecords({
      algorithm: "worley-noise",
      count: 6,
      seed: 81818,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "worley-noise")).toBe(true);
  });

  it("keeps locked worley-noise parameters fixed across generated cards", () => {
    const controls = createDefaultWorleyNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "worley-noise",
      count: 6,
      seed: 91991,
      worleyNoiseControls: {
        ...controls,
        blockSize: { randomize: false, value: 3 },
        threshold: { randomize: false, value: 0.54 },
        invert: { randomize: false, value: true },
        cellCount: { randomize: false, value: 7 },
        jitter: { randomize: false, value: 0.75 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "worley-noise" &&
          record.params.blockSize === 3 &&
          record.params.threshold === 0.54 &&
          record.params.invert === true &&
          record.params.cellCount === 7 &&
          record.params.jitter === 0.75,
      ),
    ).toBe(true);
  });

  it("produces deterministic thresholded-gradient-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "thresholded-gradient-noise",
      count: 6,
      seed: 21212,
    });
    const second = generateLayoutRecords({
      algorithm: "thresholded-gradient-noise",
      count: 6,
      seed: 21212,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "thresholded-gradient-noise")).toBe(true);
  });

  it("keeps locked thresholded-gradient-noise parameters fixed across generated cards", () => {
    const controls = createDefaultThresholdedGradientNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "thresholded-gradient-noise",
      count: 6,
      seed: 31313,
      thresholdedGradientNoiseControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        threshold: { randomize: false, value: 0.6 },
        invert: { randomize: false, value: false },
        scale: { randomize: false, value: 5 },
        angle: { randomize: false, value: 135 },
        roughness: { randomize: false, value: 0.7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "thresholded-gradient-noise" &&
          record.params.blockSize === 1 &&
          record.params.threshold === 0.6 &&
          record.params.invert === false &&
          record.params.scale === 5 &&
          record.params.angle === 135 &&
          record.params.roughness === 0.7,
      ),
    ).toBe(true);
  });

  it("produces deterministic domain-warped-noise layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "domain-warped-noise",
      count: 6,
      seed: 41414,
    });
    const second = generateLayoutRecords({
      algorithm: "domain-warped-noise",
      count: 6,
      seed: 41414,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "domain-warped-noise")).toBe(true);
  });

  it("keeps locked domain-warped-noise parameters fixed across generated cards", () => {
    const controls = createDefaultDomainWarpedNoiseControlState();
    const records = generateLayoutRecords({
      algorithm: "domain-warped-noise",
      count: 6,
      seed: 51551,
      domainWarpedNoiseControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        threshold: { randomize: false, value: 0.48 },
        invert: { randomize: false, value: true },
        scale: { randomize: false, value: 4 },
        octaves: { randomize: false, value: 5 },
        warpScale: { randomize: false, value: 2.5 },
        warpStrength: { randomize: false, value: 0.4 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "domain-warped-noise" &&
          record.params.blockSize === 2 &&
          record.params.threshold === 0.48 &&
          record.params.invert === true &&
          record.params.scale === 4 &&
          record.params.octaves === 5 &&
          record.params.warpScale === 2.5 &&
          record.params.warpStrength === 0.4,
      ),
    ).toBe(true);
  });

  it("produces deterministic radial-symmetry layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "radial-symmetry",
      count: 6,
      seed: 62626,
    });
    const second = generateLayoutRecords({
      algorithm: "radial-symmetry",
      count: 6,
      seed: 62626,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "radial-symmetry")).toBe(true);
  });

  it("keeps locked radial-symmetry parameters fixed across generated cards", () => {
    const controls = createDefaultRadialSymmetryControlState();
    const records = generateLayoutRecords({
      algorithm: "radial-symmetry",
      count: 6,
      seed: 63636,
      radialSymmetryControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        folds: { randomize: false, value: 8 },
        rings: { randomize: false, value: 5 },
        twist: { randomize: false, value: 0.45 },
        thickness: { randomize: false, value: 0.18 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "radial-symmetry" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.folds === 8 &&
          record.params.rings === 5 &&
          record.params.twist === 0.45 &&
          record.params.thickness === 0.18,
      ),
    ).toBe(true);
  });

  it("produces deterministic kaleidoscope layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "kaleidoscope",
      count: 6,
      seed: 64646,
    });
    const second = generateLayoutRecords({
      algorithm: "kaleidoscope",
      count: 6,
      seed: 64646,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "kaleidoscope")).toBe(true);
  });

  it("keeps locked kaleidoscope parameters fixed across generated cards", () => {
    const controls = createDefaultKaleidoscopeControlState();
    const records = generateLayoutRecords({
      algorithm: "kaleidoscope",
      count: 6,
      seed: 65656,
      kaleidoscopeControls: {
        ...controls,
        blockSize: { randomize: false, value: 3 },
        invert: { randomize: false, value: false },
        segments: { randomize: false, value: 10 },
        scale: { randomize: false, value: 4.5 },
        threshold: { randomize: false, value: 0.56 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "kaleidoscope" &&
          record.params.blockSize === 3 &&
          record.params.invert === false &&
          record.params.segments === 10 &&
          record.params.scale === 4.5 &&
          record.params.threshold === 0.56,
      ),
    ).toBe(true);
  });

  it("produces deterministic l-system-turtle layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "l-system-turtle",
      count: 6,
      seed: 66666,
    });
    const second = generateLayoutRecords({
      algorithm: "l-system-turtle",
      count: 6,
      seed: 66666,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "l-system-turtle")).toBe(true);
  });

  it("keeps locked l-system-turtle parameters fixed across generated cards", () => {
    const controls = createDefaultLSystemTurtleControlState();
    const records = generateLayoutRecords({
      algorithm: "l-system-turtle",
      count: 6,
      seed: 67676,
      lSystemTurtleControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: true },
        preset: { randomize: false, value: "dragon" },
        iterations: { randomize: false, value: 4 },
        turnAngle: { randomize: false, value: 90 },
        strokeWidth: { randomize: false, value: 2 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "l-system-turtle" &&
          record.params.blockSize === 1 &&
          record.params.invert === true &&
          record.params.preset === "dragon" &&
          record.params.iterations === 4 &&
          record.params.turnAngle === 90 &&
          record.params.strokeWidth === 2,
      ),
    ).toBe(true);
  });

  it("produces deterministic rose-curves layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "rose-curves",
      count: 6,
      seed: 68686,
    });
    const second = generateLayoutRecords({
      algorithm: "rose-curves",
      count: 6,
      seed: 68686,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "rose-curves")).toBe(true);
  });

  it("keeps locked rose-curves parameters fixed across generated cards", () => {
    const controls = createDefaultRoseCurvesControlState();
    const records = generateLayoutRecords({
      algorithm: "rose-curves",
      count: 6,
      seed: 69696,
      roseCurvesControls: {
        ...controls,
        blockSize: { randomize: false, value: 4 },
        invert: { randomize: false, value: false },
        petals: { randomize: false, value: 7 },
        harmonic: { randomize: false, value: 3 },
        rotation: { randomize: false, value: 120 },
        strokeWidth: { randomize: false, value: 3 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "rose-curves" &&
          record.params.blockSize === 4 &&
          record.params.invert === false &&
          record.params.petals === 7 &&
          record.params.harmonic === 3 &&
          record.params.rotation === 120 &&
          record.params.strokeWidth === 3,
      ),
    ).toBe(true);
  });

  it("produces deterministic tileable-motif-repeater layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "tileable-motif-repeater",
      count: 6,
      seed: 70707,
    });
    const second = generateLayoutRecords({
      algorithm: "tileable-motif-repeater",
      count: 6,
      seed: 70707,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "tileable-motif-repeater")).toBe(true);
  });

  it("keeps locked tileable-motif-repeater parameters fixed across generated cards", () => {
    const controls = createDefaultTileableMotifRepeaterControlState();
    const records = generateLayoutRecords({
      algorithm: "tileable-motif-repeater",
      count: 6,
      seed: 71771,
      tileableMotifRepeaterControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        motif: { randomize: false, value: "diamond" },
        spacing: { randomize: false, value: 6 },
        motifSize: { randomize: false, value: 3 },
        jitter: { randomize: false, value: 2 },
        rotation: { randomize: false, value: 90 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "tileable-motif-repeater" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.motif === "diamond" &&
          record.params.spacing === 6 &&
          record.params.motifSize === 3 &&
          record.params.jitter === 2 &&
          record.params.rotation === 90,
      ),
    ).toBe(true);
  });

  it("produces deterministic bsp-room-partitioner layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "bsp-room-partitioner",
      count: 6,
      seed: 72727,
    });
    const second = generateLayoutRecords({
      algorithm: "bsp-room-partitioner",
      count: 6,
      seed: 72727,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "bsp-room-partitioner")).toBe(true);
  });

  it("keeps locked bsp-room-partitioner parameters fixed across generated cards", () => {
    const controls = createDefaultBspRoomPartitionerControlState();
    const records = generateLayoutRecords({
      algorithm: "bsp-room-partitioner",
      count: 6,
      seed: 73737,
      bspRoomPartitionerControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        splitDepth: { randomize: false, value: 5 },
        roomPadding: { randomize: false, value: 2 },
        corridorWidth: { randomize: false, value: 2 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "bsp-room-partitioner" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.splitDepth === 5 &&
          record.params.roomPadding === 2 &&
          record.params.corridorWidth === 2,
      ),
    ).toBe(true);
  });

  it("produces deterministic corridor-grid layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "corridor-grid",
      count: 6,
      seed: 74747,
    });
    const second = generateLayoutRecords({
      algorithm: "corridor-grid",
      count: 6,
      seed: 74747,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "corridor-grid")).toBe(true);
  });

  it("keeps locked corridor-grid parameters fixed across generated cards", () => {
    const controls = createDefaultCorridorGridControlState();
    const records = generateLayoutRecords({
      algorithm: "corridor-grid",
      count: 6,
      seed: 75757,
      corridorGridControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: false },
        columnSpacing: { randomize: false, value: 7 },
        rowSpacing: { randomize: false, value: 5 },
        wallThickness: { randomize: false, value: 2 },
        gapChance: { randomize: false, value: 0.45 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "corridor-grid" &&
          record.params.blockSize === 1 &&
          record.params.invert === false &&
          record.params.columnSpacing === 7 &&
          record.params.rowSpacing === 5 &&
          record.params.wallThickness === 2 &&
          record.params.gapChance === 0.45,
      ),
    ).toBe(true);
  });

  it("produces deterministic room-scatter layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "room-scatter",
      count: 6,
      seed: 76767,
    });
    const second = generateLayoutRecords({
      algorithm: "room-scatter",
      count: 6,
      seed: 76767,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "room-scatter")).toBe(true);
  });

  it("keeps locked room-scatter parameters fixed across generated cards", () => {
    const controls = createDefaultRoomScatterControlState();
    const records = generateLayoutRecords({
      algorithm: "room-scatter",
      count: 6,
      seed: 77777,
      roomScatterControls: {
        ...controls,
        blockSize: { randomize: false, value: 3 },
        invert: { randomize: false, value: true },
        roomCount: { randomize: false, value: 8 },
        roomSize: { randomize: false, value: 6 },
        gap: { randomize: false, value: 2 },
        connectorChance: { randomize: false, value: 0.6 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "room-scatter" &&
          record.params.blockSize === 3 &&
          record.params.invert === true &&
          record.params.roomCount === 8 &&
          record.params.roomSize === 6 &&
          record.params.gap === 2 &&
          record.params.connectorChance === 0.6,
      ),
    ).toBe(true);
  });

  it("produces deterministic courtyard-generator layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "courtyard-generator",
      count: 6,
      seed: 78787,
    });
    const second = generateLayoutRecords({
      algorithm: "courtyard-generator",
      count: 6,
      seed: 78787,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "courtyard-generator")).toBe(true);
  });

  it("keeps locked courtyard-generator parameters fixed across generated cards", () => {
    const controls = createDefaultCourtyardGeneratorControlState();
    const records = generateLayoutRecords({
      algorithm: "courtyard-generator",
      count: 6,
      seed: 79797,
      courtyardGeneratorControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: false },
        ringCount: { randomize: false, value: 4 },
        ringGap: { randomize: false, value: 2 },
        gateWidth: { randomize: false, value: 3 },
        offset: { randomize: false, value: 2 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "courtyard-generator" &&
          record.params.blockSize === 2 &&
          record.params.invert === false &&
          record.params.ringCount === 4 &&
          record.params.ringGap === 2 &&
          record.params.gateWidth === 3 &&
          record.params.offset === 2,
      ),
    ).toBe(true);
  });

  it("produces deterministic blueprint-generator layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "blueprint-generator",
      count: 6,
      seed: 80808,
    });
    const second = generateLayoutRecords({
      algorithm: "blueprint-generator",
      count: 6,
      seed: 80808,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "blueprint-generator")).toBe(true);
  });

  it("keeps locked blueprint-generator parameters fixed across generated cards", () => {
    const controls = createDefaultBlueprintGeneratorControlState();
    const records = generateLayoutRecords({
      algorithm: "blueprint-generator",
      count: 6,
      seed: 81818,
      blueprintGeneratorControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: true },
        wingCount: { randomize: false, value: 4 },
        hallWidth: { randomize: false, value: 6 },
        pillarSpacing: { randomize: false, value: 4 },
        chamberDepth: { randomize: false, value: 7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "blueprint-generator" &&
          record.params.blockSize === 1 &&
          record.params.invert === true &&
          record.params.wingCount === 4 &&
          record.params.hallWidth === 6 &&
          record.params.pillarSpacing === 4 &&
          record.params.chamberDepth === 7,
      ),
    ).toBe(true);
  });

  it("produces deterministic stripe-plaid-generator layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "stripe-plaid-generator",
      count: 6,
      seed: 60607,
    });
    const second = generateLayoutRecords({
      algorithm: "stripe-plaid-generator",
      count: 6,
      seed: 60607,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "stripe-plaid-generator")).toBe(true);
  });

  it("keeps locked stripe-plaid-generator parameters fixed across generated cards", () => {
    const controls = createDefaultStripePlaidGeneratorControlState();
    const records = generateLayoutRecords({
      algorithm: "stripe-plaid-generator",
      count: 6,
      seed: 61607,
      stripePlaidGeneratorControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        mode: { randomize: false, value: "plaid" },
        spacing: { randomize: false, value: 7 },
        bandWidth: { randomize: false, value: 3 },
        offset: { randomize: false, value: 4 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "stripe-plaid-generator" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.mode === "plaid" &&
          record.params.spacing === 7 &&
          record.params.bandWidth === 3 &&
          record.params.offset === 4,
      ),
    ).toBe(true);
  });

  it("produces deterministic checker-diamond-lattice layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "checker-diamond-lattice",
      count: 6,
      seed: 62607,
    });
    const second = generateLayoutRecords({
      algorithm: "checker-diamond-lattice",
      count: 6,
      seed: 62607,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "checker-diamond-lattice")).toBe(true);
  });

  it("keeps locked checker-diamond-lattice parameters fixed across generated cards", () => {
    const controls = createDefaultCheckerDiamondLatticeControlState();
    const records = generateLayoutRecords({
      algorithm: "checker-diamond-lattice",
      count: 6,
      seed: 63607,
      checkerDiamondLatticeControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: false },
        style: { randomize: false, value: "diamond" },
        cellSize: { randomize: false, value: 5 },
        lineWidth: { randomize: false, value: 2 },
        phase: { randomize: false, value: 3 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "checker-diamond-lattice" &&
          record.params.blockSize === 1 &&
          record.params.invert === false &&
          record.params.style === "diamond" &&
          record.params.cellSize === 5 &&
          record.params.lineWidth === 2 &&
          record.params.phase === 3,
      ),
    ).toBe(true);
  });

  it("produces deterministic concentric-boxes layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "concentric-boxes",
      count: 6,
      seed: 64607,
    });
    const second = generateLayoutRecords({
      algorithm: "concentric-boxes",
      count: 6,
      seed: 64607,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "concentric-boxes")).toBe(true);
  });

  it("keeps locked concentric-boxes parameters fixed across generated cards", () => {
    const controls = createDefaultConcentricBoxesControlState();
    const records = generateLayoutRecords({
      algorithm: "concentric-boxes",
      count: 6,
      seed: 65607,
      concentricBoxesControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        ringCount: { randomize: false, value: 6 },
        spacing: { randomize: false, value: 2 },
        lineWidth: { randomize: false, value: 2 },
        drift: { randomize: false, value: 3 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "concentric-boxes" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.ringCount === 6 &&
          record.params.spacing === 2 &&
          record.params.lineWidth === 2 &&
          record.params.drift === 3,
      ),
    ).toBe(true);
  });

  it("produces deterministic line-interference layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "line-interference",
      count: 6,
      seed: 66607,
    });
    const second = generateLayoutRecords({
      algorithm: "line-interference",
      count: 6,
      seed: 66607,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "line-interference")).toBe(true);
  });

  it("keeps locked line-interference parameters fixed across generated cards", () => {
    const controls = createDefaultLineInterferenceControlState();
    const records = generateLayoutRecords({
      algorithm: "line-interference",
      count: 6,
      seed: 67607,
      lineInterferenceControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: false },
        angleA: { randomize: false, value: 45 },
        angleB: { randomize: false, value: 135 },
        spacing: { randomize: false, value: 5 },
        strokeWidth: { randomize: false, value: 2 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "line-interference" &&
          record.params.blockSize === 1 &&
          record.params.invert === false &&
          record.params.angleA === 45 &&
          record.params.angleB === 135 &&
          record.params.spacing === 5 &&
          record.params.strokeWidth === 2,
      ),
    ).toBe(true);
  });

  it("produces deterministic circle-packing layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "circle-packing",
      count: 6,
      seed: 68607,
    });
    const second = generateLayoutRecords({
      algorithm: "circle-packing",
      count: 6,
      seed: 68607,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "circle-packing")).toBe(true);
  });

  it("keeps locked circle-packing parameters fixed across generated cards", () => {
    const controls = createDefaultCirclePackingControlState();
    const records = generateLayoutRecords({
      algorithm: "circle-packing",
      count: 6,
      seed: 69607,
      circlePackingControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: false },
        circleCount: { randomize: false, value: 8 },
        minRadius: { randomize: false, value: 2 },
        maxRadius: { randomize: false, value: 5 },
        outline: { randomize: false, value: true },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "circle-packing" &&
          record.params.blockSize === 1 &&
          record.params.invert === false &&
          record.params.circleCount === 8 &&
          record.params.minRadius === 2 &&
          record.params.maxRadius === 5 &&
          record.params.outline === true,
      ),
    ).toBe(true);
  });

  it("produces deterministic game-of-life-variants layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "game-of-life-variants",
      count: 6,
      seed: 60606,
    });
    const second = generateLayoutRecords({
      algorithm: "game-of-life-variants",
      count: 6,
      seed: 60606,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "game-of-life-variants")).toBe(true);
  });

  it("keeps locked game-of-life-variants parameters fixed across generated cards", () => {
    const controls = createDefaultGameOfLifeVariantsControlState();
    const records = generateLayoutRecords({
      algorithm: "game-of-life-variants",
      count: 6,
      seed: 61606,
      gameOfLifeVariantsControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: true },
        density: { randomize: false, value: 0.42 },
        steps: { randomize: false, value: 6 },
        variant: { randomize: false, value: "maze" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "game-of-life-variants" &&
          record.params.blockSize === 2 &&
          record.params.invert === true &&
          record.params.density === 0.42 &&
          record.params.steps === 6 &&
          record.params.variant === "maze",
      ),
    ).toBe(true);
  });

  it("produces deterministic diffusion-limited-aggregation layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "diffusion-limited-aggregation",
      count: 6,
      seed: 62606,
    });
    const second = generateLayoutRecords({
      algorithm: "diffusion-limited-aggregation",
      count: 6,
      seed: 62606,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "diffusion-limited-aggregation")).toBe(
      true,
    );
  });

  it("keeps locked diffusion-limited-aggregation parameters fixed across generated cards", () => {
    const controls = createDefaultDiffusionLimitedAggregationControlState();
    const records = generateLayoutRecords({
      algorithm: "diffusion-limited-aggregation",
      count: 6,
      seed: 63606,
      diffusionLimitedAggregationControls: {
        ...controls,
        blockSize: { randomize: false, value: 1 },
        invert: { randomize: false, value: false },
        walkers: { randomize: false, value: 480 },
        stickiness: { randomize: false, value: 0.55 },
        seedMode: { randomize: false, value: "cross" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "diffusion-limited-aggregation" &&
          record.params.blockSize === 1 &&
          record.params.invert === false &&
          record.params.walkers === 480 &&
          record.params.stickiness === 0.55 &&
          record.params.seedMode === "cross",
      ),
    ).toBe(true);
  });

  it("produces deterministic reaction-diffusion-approximation layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "reaction-diffusion-approximation",
      count: 6,
      seed: 64606,
    });
    const second = generateLayoutRecords({
      algorithm: "reaction-diffusion-approximation",
      count: 6,
      seed: 64606,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "reaction-diffusion-approximation")).toBe(
      true,
    );
  });

  it("keeps locked reaction-diffusion-approximation parameters fixed across generated cards", () => {
    const controls = createDefaultReactionDiffusionApproximationControlState();
    const records = generateLayoutRecords({
      algorithm: "reaction-diffusion-approximation",
      count: 6,
      seed: 65606,
      reactionDiffusionApproximationControls: {
        ...controls,
        blockSize: { randomize: false, value: 3 },
        invert: { randomize: false, value: true },
        spotCount: { randomize: false, value: 6 },
        iterations: { randomize: false, value: 18 },
        feed: { randomize: false, value: 0.05 },
        kill: { randomize: false, value: 0.067 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "reaction-diffusion-approximation" &&
          record.params.blockSize === 3 &&
          record.params.invert === true &&
          record.params.spotCount === 6 &&
          record.params.iterations === 18 &&
          record.params.feed === 0.05 &&
          record.params.kill === 0.067,
      ),
    ).toBe(true);
  });

  it("produces deterministic voronoi-region-carver layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "voronoi-region-carver",
      count: 6,
      seed: 66606,
    });
    const second = generateLayoutRecords({
      algorithm: "voronoi-region-carver",
      count: 6,
      seed: 66606,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "voronoi-region-carver")).toBe(true);
  });

  it("keeps locked voronoi-region-carver parameters fixed across generated cards", () => {
    const controls = createDefaultVoronoiRegionCarverControlState();
    const records = generateLayoutRecords({
      algorithm: "voronoi-region-carver",
      count: 6,
      seed: 67606,
      voronoiRegionCarverControls: {
        ...controls,
        blockSize: { randomize: false, value: 2 },
        invert: { randomize: false, value: false },
        siteCount: { randomize: false, value: 10 },
        ridgeWidth: { randomize: false, value: 1.5 },
        jitter: { randomize: false, value: 0.2 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "voronoi-region-carver" &&
          record.params.blockSize === 2 &&
          record.params.invert === false &&
          record.params.siteCount === 10 &&
          record.params.ridgeWidth === 1.5 &&
          record.params.jitter === 0.2,
      ),
    ).toBe(true);
  });

  it("produces deterministic erosion-dilation-pipeline layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "erosion-dilation-pipeline",
      count: 6,
      seed: 68606,
    });
    const second = generateLayoutRecords({
      algorithm: "erosion-dilation-pipeline",
      count: 6,
      seed: 68606,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "erosion-dilation-pipeline")).toBe(true);
  });

  it("keeps locked erosion-dilation-pipeline parameters fixed across generated cards", () => {
    const controls = createDefaultErosionDilationPipelineControlState();
    const records = generateLayoutRecords({
      algorithm: "erosion-dilation-pipeline",
      count: 6,
      seed: 69606,
      erosionDilationPipelineControls: {
        ...controls,
        blockSize: { randomize: false, value: 4 },
        invert: { randomize: false, value: true },
        density: { randomize: false, value: 0.46 },
        growSteps: { randomize: false, value: 3 },
        shrinkSteps: { randomize: false, value: 1 },
        punctureChance: { randomize: false, value: 0.3 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "erosion-dilation-pipeline" &&
          record.params.blockSize === 4 &&
          record.params.invert === true &&
          record.params.density === 0.46 &&
          record.params.growSteps === 3 &&
          record.params.shrinkSteps === 1 &&
          record.params.punctureChance === 0.3,
      ),
    ).toBe(true);
  });

  it("produces deterministic backtracking layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 24680,
    });
    const second = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 24680,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "backtracking-generator")).toBe(true);
  });

  it("keeps locked backtracking parameters fixed across generated cards", () => {
    const controls = createDefaultBacktrackingControlState();
    const records = generateLayoutRecords({
      algorithm: "backtracking-generator",
      count: 6,
      seed: 13579,
      backtrackingControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x1" },
        startColumn: { randomize: false, value: 3 },
        startRow: { randomize: false, value: 11 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "backtracking-generator" &&
          record.params.blockSize === "2x1" &&
          record.params.startColumn === 3 &&
          record.params.startRow === 11,
      ),
    ).toBe(true);
  });

  it("produces deterministic growing-tree layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 98765,
    });
    const second = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 98765,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "growing-tree")).toBe(true);
  });

  it("keeps locked growing-tree parameters fixed across generated cards", () => {
    const controls = createDefaultGrowingTreeControlState();
    const records = generateLayoutRecords({
      algorithm: "growing-tree",
      count: 6,
      seed: 24601,
      growingTreeControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        startColumn: { randomize: false, value: 4 },
        startRow: { randomize: false, value: 7 },
        backtrackChance: { randomize: false, value: 0.65 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "growing-tree" &&
          record.params.blockSize === "1x2" &&
          record.params.startColumn === 4 &&
          record.params.startRow === 7 &&
          record.params.backtrackChance === 0.65,
      ),
    ).toBe(true);
  });

  it("produces deterministic prim's layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 11223,
    });
    const second = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 11223,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "prims")).toBe(true);
  });

  it("keeps locked prim's parameters fixed across generated cards", () => {
    const controls = createDefaultPrimsControlState();
    const records = generateLayoutRecords({
      algorithm: "prims",
      count: 6,
      seed: 99887,
      primsControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
        startColumn: { randomize: false, value: 5 },
        startRow: { randomize: false, value: 6 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "prims" &&
          record.params.blockSize === "2x2" &&
          record.params.startColumn === 5 &&
          record.params.startRow === 6,
      ),
    ).toBe(true);
  });

  it("produces deterministic kruskal's layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 73124,
    });
    const second = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 73124,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "kruskals")).toBe(true);
  });

  it("keeps locked kruskal's parameters fixed across generated cards", () => {
    const controls = createDefaultKruskalsControlState();
    const records = generateLayoutRecords({
      algorithm: "kruskals",
      count: 6,
      seed: 24816,
      kruskalsControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) => record.algorithm === "kruskals" && record.params.blockSize === "2x2",
      ),
    ).toBe(true);
  });

  it("produces deterministic sidewinder layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 86420,
    });
    const second = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 86420,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "sidewinder")).toBe(true);
  });

  it("keeps locked sidewinder parameters fixed across generated cards", () => {
    const controls = createDefaultSidewinderControlState();
    const records = generateLayoutRecords({
      algorithm: "sidewinder",
      count: 6,
      seed: 97231,
      sidewinderControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        skew: { randomize: false, value: 0.7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "sidewinder" &&
          record.params.blockSize === "1x2" &&
          record.params.skew === 0.7,
      ),
    ).toBe(true);
  });

  it("produces deterministic binary-tree layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 32145,
    });
    const second = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 32145,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "binary-tree")).toBe(true);
  });

  it("keeps locked binary-tree parameters fixed across generated cards", () => {
    const controls = createDefaultBinaryTreeControlState();
    const records = generateLayoutRecords({
      algorithm: "binary-tree",
      count: 6,
      seed: 67890,
      binaryTreeControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x1" },
        skew: { randomize: false, value: "SE" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "binary-tree" &&
          record.params.blockSize === "2x1" &&
          record.params.skew === "SE",
      ),
    ).toBe(true);
  });

  it("produces deterministic hunt-and-kill layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "hunt-and-kill",
      count: 6,
      seed: 41357,
    });
    const second = generateLayoutRecords({
      algorithm: "hunt-and-kill",
      count: 6,
      seed: 41357,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "hunt-and-kill")).toBe(true);
  });

  it("keeps locked hunt-and-kill parameters fixed across generated cards", () => {
    const controls = createDefaultHuntAndKillControlState();
    const records = generateLayoutRecords({
      algorithm: "hunt-and-kill",
      count: 6,
      seed: 91357,
      huntAndKillControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
        huntOrder: { randomize: false, value: "serpentine" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "hunt-and-kill" &&
          record.params.blockSize === "2x2" &&
          record.params.huntOrder === "serpentine",
      ),
    ).toBe(true);
  });

  it("produces deterministic wilson's layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "wilsons",
      count: 6,
      seed: 77125,
    });
    const second = generateLayoutRecords({
      algorithm: "wilsons",
      count: 6,
      seed: 77125,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "wilsons")).toBe(true);
  });

  it("keeps locked wilson's parameters fixed across generated cards", () => {
    const controls = createDefaultWilsonsControlState();
    const records = generateLayoutRecords({
      algorithm: "wilsons",
      count: 6,
      seed: 88125,
      wilsonsControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        huntOrder: { randomize: false, value: "random" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "wilsons" &&
          record.params.blockSize === "1x2" &&
          record.params.huntOrder === "random",
      ),
    ).toBe(true);
  });

  it("produces deterministic aldous-broder layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "aldous-broder",
      count: 6,
      seed: 12121,
    });
    const second = generateLayoutRecords({
      algorithm: "aldous-broder",
      count: 6,
      seed: 12121,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "aldous-broder")).toBe(true);
  });

  it("keeps locked aldous-broder parameters fixed across generated cards", () => {
    const controls = createDefaultAldousBroderControlState();
    const records = generateLayoutRecords({
      algorithm: "aldous-broder",
      count: 6,
      seed: 34343,
      aldousBroderControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) => record.algorithm === "aldous-broder" && record.params.blockSize === "2x2",
      ),
    ).toBe(true);
  });

  it("produces deterministic ellers layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "ellers",
      count: 6,
      seed: 56565,
    });
    const second = generateLayoutRecords({
      algorithm: "ellers",
      count: 6,
      seed: 56565,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "ellers")).toBe(true);
  });

  it("keeps locked ellers parameters fixed across generated cards", () => {
    const controls = createDefaultEllersControlState();
    const records = generateLayoutRecords({
      algorithm: "ellers",
      count: 6,
      seed: 78787,
      ellersControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        xskew: { randomize: false, value: 0.3 },
        yskew: { randomize: false, value: 0.7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "ellers" &&
          record.params.blockSize === "1x2" &&
          record.params.xskew === 0.3 &&
          record.params.yskew === 0.7,
      ),
    ).toBe(true);
  });

  it("produces deterministic cellular-automaton layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "cellular-automaton",
      count: 6,
      seed: 91919,
    });
    const second = generateLayoutRecords({
      algorithm: "cellular-automaton",
      count: 6,
      seed: 91919,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "cellular-automaton")).toBe(true);
  });

  it("keeps locked cellular-automaton parameters fixed across generated cards", () => {
    const controls = createDefaultCellularAutomatonControlState();
    const records = generateLayoutRecords({
      algorithm: "cellular-automaton",
      count: 6,
      seed: 62626,
      cellularAutomatonControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x2" },
        complexity: { randomize: false, value: 0.45 },
        density: { randomize: false, value: 0.7 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "cellular-automaton" &&
          record.params.blockSize === "2x2" &&
          record.params.complexity === 0.45 &&
          record.params.density === 0.7,
      ),
    ).toBe(true);
  });

  it("produces deterministic dungeon-rooms layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "dungeon-rooms",
      count: 6,
      seed: 71717,
    });
    const second = generateLayoutRecords({
      algorithm: "dungeon-rooms",
      count: 6,
      seed: 71717,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "dungeon-rooms")).toBe(true);
  });

  it("keeps locked dungeon-rooms parameters fixed across generated cards", () => {
    const controls = createDefaultDungeonRoomsControlState();
    const records = generateLayoutRecords({
      algorithm: "dungeon-rooms",
      count: 6,
      seed: 81818,
      dungeonRoomsControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
        huntOrder: { randomize: false, value: "serpentine" },
        roomCount: { randomize: false, value: 2 },
        roomSize: { randomize: false, value: 3 },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "dungeon-rooms" &&
          record.params.blockSize === "1x2" &&
          record.params.huntOrder === "serpentine" &&
          record.params.roomCount === 2 &&
          record.params.roomSize === 3,
      ),
    ).toBe(true);
  });

  it("produces deterministic trivial-maze layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "trivial-maze",
      count: 6,
      seed: 92929,
    });
    const second = generateLayoutRecords({
      algorithm: "trivial-maze",
      count: 6,
      seed: 92929,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "trivial-maze")).toBe(true);
  });

  it("keeps locked trivial-maze parameters fixed across generated cards", () => {
    const controls = createDefaultTrivialMazeControlState();
    const records = generateLayoutRecords({
      algorithm: "trivial-maze",
      count: 6,
      seed: 30303,
      trivialMazeControls: {
        ...controls,
        blockSize: { randomize: false, value: "2x1" },
        mazeType: { randomize: false, value: "serpentine" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) =>
          record.algorithm === "trivial-maze" &&
          record.params.blockSize === "2x1" &&
          record.params.mazeType === "serpentine",
      ),
    ).toBe(true);
  });

  it("produces deterministic recursive-division layout sets for a seed", () => {
    const first = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 44556,
    });
    const second = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 44556,
    });

    expect(first).toEqual(second);
    expect(first).toHaveLength(6);
    expect(first.every((record) => record.algorithm === "recursive-division")).toBe(true);
  });

  it("keeps locked recursive-division parameters fixed across generated cards", () => {
    const controls = createDefaultRecursiveDivisionControlState();
    const records = generateLayoutRecords({
      algorithm: "recursive-division",
      count: 6,
      seed: 55443,
      recursiveDivisionControls: {
        ...controls,
        blockSize: { randomize: false, value: "1x2" },
      },
    });

    expect(records).toHaveLength(6);
    expect(
      records.every(
        (record) => record.algorithm === "recursive-division" && record.params.blockSize === "1x2",
      ),
    ).toBe(true);
  });

  it("weights random maze block sizes toward 1x1 and 2x2", () => {
    const records = Array.from(
      { length: 240 },
      (_, index) =>
        generateLayoutRecords({
          algorithm: "recursive-division",
          count: 1,
          seed: index + 1,
        })[0]!,
    );
    const counts = records.reduce<Record<string, number>>((acc, record) => {
      const blockSize =
        record.algorithm === "recursive-division" ? record.params.blockSize : "nope";
      acc[blockSize] = (acc[blockSize] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts["1x1"]).toBeGreaterThan(60);
    expect(counts["2x2"]).toBeGreaterThan(60);
    expect(counts["1x2"]).toBeGreaterThan(20);
    expect(counts["1x2"]).toBeLessThan(60);
    expect(counts["2x1"]).toBeGreaterThan(20);
    expect(counts["2x1"]).toBeLessThan(60);
  });
});
