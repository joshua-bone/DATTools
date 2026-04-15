import { useEffect, useMemo, useState, type JSX, type SyntheticEvent } from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  GENERATE_ALGORITHM_OPTIONS,
  GENERATED_LAYOUT_CARD_COUNT,
  GENERATED_LAYOUT_GRID_SIZE,
  GROWING_TREE_BACKTRACK_CHANCE_MAX,
  GROWING_TREE_BACKTRACK_CHANCE_MIN,
  GROWING_TREE_BACKTRACK_CHANCE_STEP,
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
  createDefaultBacktrackingControlState,
  createDefaultGrowingTreeControlState,
  createDefaultRandomNoiseControlState,
  generateLayoutRecords,
  mazeGridDimensionsForBlockSize,
  nextRandomSeed,
  randomSeedFromClock,
  recordsFromStarredKeys,
  type BacktrackingControlState,
  type GeneratedLayoutRecord,
  type GenerateAlgorithmChoice,
  type GrowingTreeControlState,
  type MazeBlockSize,
  type RandomNoiseControlState,
  type RandomNoiseMirrorMode,
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
          <div className="fieldHint">Chooses between 1x1, 2x2, 1x2, and 2x1 blocks.</div>
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
          <div className="fieldHint">Chooses between 1x1, 2x2, 1x2, and 2x1 blocks.</div>
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
  const [growingTreeControls, setGrowingTreeControls] = useState<GrowingTreeControlState>(() =>
    createDefaultGrowingTreeControlState(),
  );

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
            growingTreeControls: selectedAlgorithm === "growing-tree" ? growingTreeControls : null,
          }),
    [
      backtrackingControls,
      growingTreeControls,
      randomNoiseControls,
      randomSeed,
      selectedAlgorithm,
      starredKeys,
      starredOnly,
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
    } else if (record.algorithm === "growing-tree") {
      setSelectedAlgorithm("growing-tree");
      setGrowingTreeControls({
        seed: { randomize: true, value: record.params.seed },
        blockSize: { randomize: false, value: record.params.blockSize },
        startColumn: { randomize: false, value: record.params.startColumn },
        startRow: { randomize: false, value: record.params.startRow },
        backtrackChance: { randomize: false, value: record.params.backtrackChance },
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
                ) : selectedAlgorithm === "growing-tree" ? (
                  <GrowingTreeSettingsPanel
                    controls={growingTreeControls}
                    onUpdate={updateGrowingTreeControl}
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
