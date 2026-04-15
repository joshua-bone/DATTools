import { useEffect, useMemo, useState, type JSX, type SyntheticEvent } from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  GENERATE_ALGORITHM_OPTIONS,
  GENERATED_LAYOUT_CARD_COUNT,
  GENERATED_LAYOUT_GRID_SIZE,
  RANDOM_NOISE_BLOCK_SIZE_OPTIONS,
  RANDOM_NOISE_DENSITY_MAX,
  RANDOM_NOISE_DENSITY_MIN,
  RANDOM_NOISE_DENSITY_STEP,
  RANDOM_NOISE_MIRROR_OPTIONS,
  RANDOM_NOISE_SEED_MAX,
  RANDOM_NOISE_SEED_MIN,
  createDefaultRandomNoiseControlState,
  generateLayoutRecords,
  nextRandomSeed,
  randomSeedFromClock,
  recordsFromStarredKeys,
  type GenerateAlgorithmChoice,
  type GeneratedLayoutRecord,
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

function algorithmLabel(record: GeneratedLayoutRecord): string {
  return record.algorithm === "random-noise" ? "Random Noise" : record.title;
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
  const title = algorithmLabel(record);

  return (
    <article
      className={`generateCard ${selected ? "selected" : ""}`}
      title={title}
      onClick={() => onSelect(record.wallKey)}
      onDoubleClick={() => onImport(record.wallKey)}
      onPointerDown={stopEvent}
    >
      <div className="generateCardPreview">
        <GeneratedMaskPreview wallKey={record.wallKey} />
      </div>
      <div className="generateCardTitle">{title}</div>
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

  const showParameterSidebar = !starredOnly && selectedAlgorithm !== "any";
  const visibleRecords = useMemo(
    () =>
      starredOnly
        ? recordsFromStarredKeys(starredKeys, selectedAlgorithm)
        : generateLayoutRecords({
            algorithm: selectedAlgorithm,
            count: GENERATED_LAYOUT_CARD_COUNT,
            seed: randomSeed,
            randomNoiseControls: selectedAlgorithm === "random-noise" ? randomNoiseControls : null,
          }),
    [randomNoiseControls, randomSeed, selectedAlgorithm, starredKeys, starredOnly],
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

          <div
            className={`generateWorkspace ${showParameterSidebar ? "withParameters" : ""} ${selectedRecord ? "withDetails" : ""}`}
          >
            {showParameterSidebar ? (
              <aside className="generateSidebar generateParameterSidebar">
                <div className="sectionEyebrow">Parameters</div>
                <h3 className="sectionTitle">Random Noise</h3>
                <div className="fieldHint">Locked values stay fixed when you press Randomize.</div>

                <section className="generateSettingCard">
                  <div className="fieldLabelRow">
                    <span className="fieldLabel">Density</span>
                    <ParameterToggle
                      checked={randomNoiseControls.density.randomize}
                      onChange={(checked) =>
                        updateRandomNoiseControl("density", { randomize: checked })
                      }
                    />
                  </div>
                  {randomNoiseControls.density.randomize ? (
                    <div className="fieldHint">Varies between 12% and 66% per card.</div>
                  ) : (
                    <div className="generateSettingBody">
                      <input
                        type="range"
                        className="generateRangeInput"
                        min={RANDOM_NOISE_DENSITY_MIN}
                        max={RANDOM_NOISE_DENSITY_MAX}
                        step={RANDOM_NOISE_DENSITY_STEP}
                        value={randomNoiseControls.density.value}
                        onChange={(event) =>
                          updateRandomNoiseControl("density", {
                            value: Number(event.target.value),
                          })
                        }
                      />
                      <div className="statusBadge generateValueBadge">
                        {Math.round(randomNoiseControls.density.value * 100)}%
                      </div>
                    </div>
                  )}
                </section>

                <section className="generateSettingCard">
                  <div className="fieldLabelRow">
                    <span className="fieldLabel">Block Size</span>
                    <ParameterToggle
                      checked={randomNoiseControls.blockSize.randomize}
                      onChange={(checked) =>
                        updateRandomNoiseControl("blockSize", { randomize: checked })
                      }
                    />
                  </div>
                  {randomNoiseControls.blockSize.randomize ? (
                    <div className="fieldHint">Chooses between 1x1 and 4x4 blocks.</div>
                  ) : (
                    <select
                      className="generateSelect"
                      value={randomNoiseControls.blockSize.value}
                      onChange={(event) =>
                        updateRandomNoiseControl("blockSize", {
                          value: Number(event.target.value),
                        })
                      }
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
                      checked={randomNoiseControls.mirror.randomize}
                      onChange={(checked) =>
                        updateRandomNoiseControl("mirror", { randomize: checked })
                      }
                    />
                  </div>
                  {randomNoiseControls.mirror.randomize ? (
                    <div className="fieldHint">
                      Can vary between none, horizontal, vertical, and quad.
                    </div>
                  ) : (
                    <select
                      className="generateSelect"
                      value={randomNoiseControls.mirror.value}
                      onChange={(event) =>
                        updateRandomNoiseControl("mirror", {
                          value: event.target.value as RandomNoiseMirrorMode,
                        })
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
                      checked={randomNoiseControls.invert.randomize}
                      onChange={(checked) =>
                        updateRandomNoiseControl("invert", { randomize: checked })
                      }
                    />
                  </div>
                  {randomNoiseControls.invert.randomize ? (
                    <div className="fieldHint">Usually off, occasionally inverted.</div>
                  ) : (
                    <label className="generateBooleanField">
                      <input
                        type="checkbox"
                        checked={randomNoiseControls.invert.value}
                        onChange={(event) =>
                          updateRandomNoiseControl("invert", {
                            value: event.target.checked,
                          })
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
                      checked={randomNoiseControls.seed.randomize}
                      onChange={(checked) =>
                        updateRandomNoiseControl("seed", { randomize: checked })
                      }
                    />
                  </div>
                  {randomNoiseControls.seed.randomize ? (
                    <div className="fieldHint">
                      Each card gets its own seed from the current reroll.
                    </div>
                  ) : (
                    <input
                      type="number"
                      className="textInput"
                      min={RANDOM_NOISE_SEED_MIN}
                      max={RANDOM_NOISE_SEED_MAX}
                      step={1}
                      value={randomNoiseControls.seed.value}
                      onChange={(event) =>
                        updateRandomNoiseControl("seed", {
                          value: Number(event.target.value),
                        })
                      }
                    />
                  )}
                </section>
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
              {selectedRecord ? (
                <>
                  <div className="sectionEyebrow">Selection</div>
                  <h3 className="sectionTitle">{algorithmLabel(selectedRecord)}</h3>
                  <div className="generateSidebarPreview">
                    <GeneratedMaskPreview wallKey={selectedRecord.wallKey} />
                  </div>
                  {selectedRecord.params ? (
                    <div className="generateDetailList">
                      <div className="generateDetailRow">
                        <span className="fieldLabel">Seed</span>
                        <div>{selectedRecord.params.seed}</div>
                      </div>
                      <div className="generateDetailRow">
                        <span className="fieldLabel">Density</span>
                        <div>{Math.round(selectedRecord.params.density * 100)}%</div>
                      </div>
                      <div className="generateDetailRow">
                        <span className="fieldLabel">Block Size</span>
                        <div>
                          {selectedRecord.params.blockSize}x{selectedRecord.params.blockSize}
                        </div>
                      </div>
                      <div className="generateDetailRow">
                        <span className="fieldLabel">Mirror</span>
                        <div>{formatMirrorLabel(selectedRecord.params.mirror)}</div>
                      </div>
                      <div className="generateDetailRow">
                        <span className="fieldLabel">Invert</span>
                        <div>{selectedRecord.params.invert ? "On" : "Off"}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="fieldHint generateDetailEmpty">
                      This layout was starred locally. Only the wall mask was saved, not the
                      original generator parameters.
                    </div>
                  )}
                  <button
                    type="button"
                    className="actionButton generateDetailImportButton"
                    onClick={() => onImport(selectedRecord.wallKey)}
                  >
                    Import Selected
                  </button>
                </>
              ) : (
                <>
                  <div className="sectionEyebrow">Selection</div>
                  <h3 className="sectionTitle">Nothing Selected</h3>
                  <div className="fieldHint generateDetailEmpty">
                    Select a generated card to inspect its parameters here.
                  </div>
                </>
              )}
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
