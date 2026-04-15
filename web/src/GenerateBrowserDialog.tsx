import { useEffect, useMemo, useState, type JSX, type SyntheticEvent } from "react";

import { wallMaskBytesFromKey } from "@/src/dat/wallsBank";
import {
  GENERATE_ALGORITHM_OPTIONS,
  GENERATED_LAYOUT_CARD_COUNT,
  GENERATED_LAYOUT_GRID_SIZE,
  generateLayoutRecords,
  nextRandomSeed,
  randomSeedFromClock,
  recordsFromStarredKeys,
  type GenerateAlgorithmChoice,
  type GeneratedLayoutRecord,
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

function stopEvent(event: SyntheticEvent): void {
  event.stopPropagation();
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

function GeneratedRecordCard({
  record,
  selected,
  starred,
  onSelect,
  onImport,
  onToggleStar,
}: GeneratedRecordCardProps): JSX.Element {
  const cardTitle = `${record.title}: ${record.summary}`;

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
      <div className="generateCardMeta">
        <div className="generateCardTitle">{record.title}</div>
        <div className="generateCardSummary">{record.summary}</div>
        <div className="generateCardSeed">{record.seedLabel}</div>
      </div>
      <div className="generateCardFooter">
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

  const visibleRecords = useMemo(
    () =>
      starredOnly
        ? recordsFromStarredKeys(starredKeys, selectedAlgorithm)
        : generateLayoutRecords({
            algorithm: selectedAlgorithm,
            count: GENERATED_LAYOUT_CARD_COUNT,
            seed: randomSeed,
          }),
    [randomSeed, selectedAlgorithm, starredKeys, starredOnly],
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
