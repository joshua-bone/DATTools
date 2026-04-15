import { useEffect, useMemo, useState, type JSX, type SyntheticEvent } from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  BINARY_TREE_SKEW_OPTIONS,
  CELLULAR_AUTOMATON_COMPLEXITY_MAX,
  CELLULAR_AUTOMATON_COMPLEXITY_MIN,
  CELLULAR_AUTOMATON_COMPLEXITY_STEP,
  CELLULAR_AUTOMATON_DENSITY_MAX,
  CELLULAR_AUTOMATON_DENSITY_MIN,
  CELLULAR_AUTOMATON_DENSITY_STEP,
  DUNGEON_ROOM_COUNT_MAX,
  DUNGEON_ROOM_COUNT_MIN,
  DUNGEON_ROOM_SIZE_MAX,
  DUNGEON_ROOM_SIZE_MIN,
  DOMAIN_WARP_SCALE_MAX,
  DOMAIN_WARP_SCALE_MIN,
  DOMAIN_WARP_SCALE_STEP,
  DOMAIN_WARP_STRENGTH_MAX,
  DOMAIN_WARP_STRENGTH_MIN,
  DOMAIN_WARP_STRENGTH_STEP,
  GENERATE_ALGORITHM_OPTIONS,
  GENERATED_LAYOUT_CARD_COUNT,
  GENERATED_LAYOUT_GRID_SIZE,
  GROWING_TREE_BACKTRACK_CHANCE_MAX,
  GROWING_TREE_BACKTRACK_CHANCE_MIN,
  GROWING_TREE_BACKTRACK_CHANCE_STEP,
  HUNT_ORDER_OPTIONS,
  MAZE_BLOCK_SIZE_OPTIONS,
  MAZE_SEED_MAX,
  MAZE_SEED_MIN,
  NOISE_TERRAIN_OCTAVES_MAX,
  NOISE_TERRAIN_OCTAVES_MIN,
  NOISE_TERRAIN_SCALE_MAX,
  NOISE_TERRAIN_SCALE_MIN,
  NOISE_TERRAIN_SCALE_STEP,
  NOISE_TERRAIN_THRESHOLD_MAX,
  NOISE_TERRAIN_THRESHOLD_MIN,
  NOISE_TERRAIN_THRESHOLD_STEP,
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
  createDefaultCellularAutomatonControlState,
  createDefaultDomainWarpedNoiseControlState,
  createDefaultDungeonRoomsControlState,
  createDefaultEllersControlState,
  createDefaultGrowingTreeControlState,
  createDefaultHuntAndKillControlState,
  createDefaultKruskalsControlState,
  createDefaultPerlinNoiseControlState,
  createDefaultPrimsControlState,
  createDefaultRandomNoiseControlState,
  createDefaultRecursiveDivisionControlState,
  createDefaultSidewinderControlState,
  createDefaultThresholdedGradientNoiseControlState,
  createDefaultTrivialMazeControlState,
  createDefaultValueFractalNoiseControlState,
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
  type CellularAutomatonControlState,
  type DomainWarpedNoiseControlState,
  type DungeonRoomsControlState,
  type EllersControlState,
  type GeneratedLayoutRecord,
  type GenerateAlgorithmChoice,
  type GrowingTreeControlState,
  type HuntAndKillControlState,
  type HuntOrder,
  type KruskalsControlState,
  type MazeBlockSize,
  type PerlinNoiseControlState,
  type PrimsControlState,
  type RandomNoiseControlState,
  type RandomNoiseMirrorMode,
  type RecursiveDivisionControlState,
  type SidewinderControlState,
  type ThresholdedGradientNoiseControlState,
  type TrivialMazeControlState,
  type TrivialMazeType,
  TRIVIAL_MAZE_TYPE_OPTIONS,
  type ValueFractalNoiseControlState,
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

type BacktrackingSettingsPanelProps = Readonly<{
  controls: BacktrackingControlState;
  onUpdate: <K extends keyof BacktrackingControlState>(
    key: K,
    nextValue: Partial<BacktrackingControlState[K]>,
  ) => void;
}>;

type GrowingTreeSettingsPanelProps = Readonly<{
  controls: GrowingTreeControlState;
  onUpdate: <K extends keyof GrowingTreeControlState>(
    key: K,
    nextValue: Partial<GrowingTreeControlState[K]>,
  ) => void;
}>;

type PrimsSettingsPanelProps = Readonly<{
  controls: PrimsControlState;
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

function formatCompactNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
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
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) => onUpdate("blockSize", { randomize: checked })}
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">Chooses between 1x1 and 4x4 blocks.</div>
        ) : (
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
        )}
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
          <span className="fieldLabel">Invert</span>
          <ParameterToggle
            checked={controls.invert.randomize}
            onChange={(checked) => onUpdate("invert", { randomize: checked })}
          />
        </div>
        {controls.invert.randomize ? (
          <div className="fieldHint">Usually off, occasionally inverted.</div>
        ) : (
          <label className="generateBooleanField">
            <input
              type="checkbox"
              checked={controls.invert.value}
              onChange={(event) => onUpdate("invert", { value: event.target.checked })}
            />
            <span>Use inverted mask</span>
          </label>
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
    invert: { randomize: boolean; value: boolean };
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
          <ParameterToggle
            checked={controls.blockSize.randomize}
            onChange={(checked) =>
              onUpdate(
                "blockSize" as keyof T,
                { randomize: checked } as unknown as Partial<T[keyof T]>,
              )
            }
          />
        </div>
        {controls.blockSize.randomize ? (
          <div className="fieldHint">Chooses between 1x1 and 4x4 blocks for chunkier layouts.</div>
        ) : (
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
        )}
      </section>

      <section className="generateSettingCard">
        <div className="fieldLabelRow">
          <span className="fieldLabel">Invert</span>
          <ParameterToggle
            checked={controls.invert.randomize}
            onChange={(checked) =>
              onUpdate(
                "invert" as keyof T,
                { randomize: checked } as unknown as Partial<T[keyof T]>,
              )
            }
          />
        </div>
        {controls.invert.randomize ? (
          <div className="fieldHint">Usually off, but can occasionally flip walls and floors.</div>
        ) : (
          <label className="generateBooleanField">
            <input
              type="checkbox"
              checked={controls.invert.value}
              onChange={(event) =>
                onUpdate(
                  "invert" as keyof T,
                  { value: event.target.checked } as unknown as Partial<T[keyof T]>,
                )
              }
            />
            <span>Use inverted mask</span>
          </label>
        )}
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

function BacktrackingSettingsPanel({
  controls,
  onUpdate,
}: BacktrackingSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1");
  const maxColumns = fixedBlockSize ? dims.columns : mazeGridDimensionsForBlockSize("1x1").columns;
  const maxRows = fixedBlockSize ? dims.rows : mazeGridDimensionsForBlockSize("1x1").rows;

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

function PrimsSettingsPanel({ controls, onUpdate }: PrimsSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1");
  const maxColumns = fixedBlockSize ? dims.columns : mazeGridDimensionsForBlockSize("1x1").columns;
  const maxRows = fixedBlockSize ? dims.rows : mazeGridDimensionsForBlockSize("1x1").rows;

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
  onUpdate,
}: DungeonRoomsSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const limits = dungeonRoomParameterLimits(fixedBlockSize ?? "1x1");

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
  onUpdate,
}: GrowingTreeSettingsPanelProps): JSX.Element {
  const fixedBlockSize = controls.blockSize.randomize ? null : controls.blockSize.value;
  const dims = mazeGridDimensionsForBlockSize(fixedBlockSize ?? "1x1");
  const maxColumns = fixedBlockSize ? dims.columns : mazeGridDimensionsForBlockSize("1x1").columns;
  const maxRows = fixedBlockSize ? dims.rows : mazeGridDimensionsForBlockSize("1x1").rows;

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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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
          <div className="generateDetailRow">
            <span className="fieldLabel">Invert</span>
            <div>{record.params.invert ? "On" : "Off"}</div>
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

  const showParameterSidebar = !starredOnly && selectedAlgorithm !== "any";
  const visibleRecords = useMemo(
    () =>
      starredOnly
        ? recordsFromStarredKeys(starredKeys)
        : generateLayoutRecords({
            algorithm: selectedAlgorithm,
            count: GENERATED_LAYOUT_CARD_COUNT,
            seed: randomSeed,
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
      cellularAutomatonControls,
      domainWarpedNoiseControls,
      dungeonRoomsControls,
      ellersControls,
      growingTreeControls,
      huntAndKillControls,
      kruskalsControls,
      perlinNoiseControls,
      primsControls,
      randomNoiseControls,
      randomSeed,
      recursiveDivisionControls,
      selectedAlgorithm,
      sidewinderControls,
      starredKeys,
      starredOnly,
      thresholdedGradientNoiseControls,
      trivialMazeControls,
      valueFractalNoiseControls,
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

  function applyMoreLikeThis(record: GeneratedLayoutRecord): void {
    if (record.algorithm === "starred") return;

    setStarredOnly(false);
    setSelectedWallKey(null);

    if (record.algorithm === "random-noise") {
      setSelectedAlgorithm("random-noise");
      setRandomNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        density: { randomize: false, value: record.params.density },
        blockSize: { randomize: false, value: record.params.blockSize },
        mirror: { randomize: false, value: record.params.mirror },
        invert: { randomize: false, value: record.params.invert },
      });
    } else if (record.algorithm === "perlin-noise") {
      setSelectedAlgorithm("perlin-noise");
      setPerlinNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        invert: { randomize: false, value: record.params.invert },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
      });
    } else if (record.algorithm === "value-fractal-noise") {
      setSelectedAlgorithm("value-fractal-noise");
      setValueFractalNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        invert: { randomize: false, value: record.params.invert },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
        gain: { randomize: false, value: record.params.gain },
      });
    } else if (record.algorithm === "worley-noise") {
      setSelectedAlgorithm("worley-noise");
      setWorleyNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        invert: { randomize: false, value: record.params.invert },
        cellCount: { randomize: false, value: record.params.cellCount },
        jitter: { randomize: false, value: record.params.jitter },
      });
    } else if (record.algorithm === "thresholded-gradient-noise") {
      setSelectedAlgorithm("thresholded-gradient-noise");
      setThresholdedGradientNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        invert: { randomize: false, value: record.params.invert },
        scale: { randomize: false, value: record.params.scale },
        angle: { randomize: false, value: record.params.angle },
        roughness: { randomize: false, value: record.params.roughness },
      });
    } else if (record.algorithm === "domain-warped-noise") {
      setSelectedAlgorithm("domain-warped-noise");
      setDomainWarpedNoiseControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        threshold: { randomize: false, value: record.params.threshold },
        invert: { randomize: false, value: record.params.invert },
        scale: { randomize: false, value: record.params.scale },
        octaves: { randomize: false, value: record.params.octaves },
        warpScale: { randomize: false, value: record.params.warpScale },
        warpStrength: { randomize: false, value: record.params.warpStrength },
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
                ) : selectedAlgorithm === "backtracking-generator" ? (
                  <BacktrackingSettingsPanel
                    controls={backtrackingControls}
                    onUpdate={updateBacktrackingControl}
                  />
                ) : selectedAlgorithm === "prims" ? (
                  <PrimsSettingsPanel controls={primsControls} onUpdate={updatePrimsControl} />
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
