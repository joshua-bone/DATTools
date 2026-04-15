import { useEffect, useMemo, useState, type JSX, type SyntheticEvent } from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  BINARY_TREE_SKEW_OPTIONS,
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
  createDefaultAldousBroderControlState,
  createDefaultBacktrackingControlState,
  createDefaultBinaryTreeControlState,
  createDefaultEllersControlState,
  createDefaultGrowingTreeControlState,
  createDefaultHuntAndKillControlState,
  createDefaultKruskalsControlState,
  createDefaultPrimsControlState,
  createDefaultRandomNoiseControlState,
  createDefaultRecursiveDivisionControlState,
  createDefaultSidewinderControlState,
  createDefaultWilsonsControlState,
  generateLayoutRecords,
  mazeGridDimensionsForBlockSize,
  nextRandomSeed,
  randomSeedFromClock,
  recordsFromStarredKeys,
  type AldousBroderControlState,
  type BacktrackingControlState,
  type BinaryTreeControlState,
  type BinaryTreeSkew,
  type EllersControlState,
  type GeneratedLayoutRecord,
  type GenerateAlgorithmChoice,
  type GrowingTreeControlState,
  type HuntAndKillControlState,
  type HuntOrder,
  type KruskalsControlState,
  type MazeBlockSize,
  type PrimsControlState,
  type RandomNoiseControlState,
  type RandomNoiseMirrorMode,
  type RecursiveDivisionControlState,
  type SidewinderControlState,
  type WilsonsControlState,
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
            growingTreeControls: selectedAlgorithm === "growing-tree" ? growingTreeControls : null,
            recursiveDivisionControls:
              selectedAlgorithm === "recursive-division" ? recursiveDivisionControls : null,
          }),
    [
      aldousBroderControls,
      backtrackingControls,
      binaryTreeControls,
      ellersControls,
      growingTreeControls,
      huntAndKillControls,
      kruskalsControls,
      primsControls,
      randomNoiseControls,
      randomSeed,
      recursiveDivisionControls,
      selectedAlgorithm,
      sidewinderControls,
      starredKeys,
      starredOnly,
      wilsonsControls,
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
