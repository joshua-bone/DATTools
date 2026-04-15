import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type SyntheticEvent,
} from "react";

import { createWallsPreviewLevel } from "@/src/dat/wallsBank";
import { drawCc1LevelToCanvas } from "@/web/src/canvasLevelRenderer";
import type { CanvasSpriteCache } from "@/web/src/canvasSpriteCache";
import {
  filterWallsBankRecords,
  findWallsBankRecord,
  pickRandomWallsBankRecords,
  type LoadedWallsBank,
  type WallsBankRecord,
} from "@/web/src/wallsBank";

const WALLS_BROWSER_CARD_COUNT = 18;

type WallsBankLoadState = "idle" | "loading" | "ready" | "error";

type WallsBrowserDialogProps = Readonly<{
  spriteCache: CanvasSpriteCache | null;
  wallsBank: LoadedWallsBank | null;
  wallsBankLoadState: WallsBankLoadState;
  wallsBankError: string | null;
  starredKeys: ReadonlySet<string>;
  hiddenKeys: ReadonlySet<string>;
  onToggleStar: (wallKey: string) => void;
  onToggleHidden: (wallKey: string) => void;
  onImport: (wallKey: string) => void;
  onClose: () => void;
}>;

type WallsRecordCardProps = Readonly<{
  record: WallsBankRecord;
  spriteCache: CanvasSpriteCache | null;
  selected: boolean;
  starred: boolean;
  hidden: boolean;
  onSelect: (wallKey: string) => void;
  onToggleStar: (wallKey: string) => void;
  onToggleHidden: (wallKey: string) => void;
  onOpenDetails: (wallKey: string) => void;
}>;

function nextRandomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

function stopEvent(event: SyntheticEvent): void {
  event.stopPropagation();
}

function WallsPreviewCanvas({
  record,
  spriteCache,
}: Readonly<{
  record: WallsBankRecord;
  spriteCache: CanvasSpriteCache | null;
}>): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!spriteCache || !canvasRef.current) return;
    drawCc1LevelToCanvas(
      canvasRef.current,
      createWallsPreviewLevel(record.wallKey, { title: record.primaryEntry.levelTitle }),
      spriteCache,
      { showSecrets: false },
    );
  }, [record.primaryEntry.levelTitle, record.wallKey, spriteCache]);

  if (!spriteCache) {
    return <div className="wallsPreviewPlaceholder">Loading tiles...</div>;
  }

  return <canvas ref={canvasRef} className="wallsPreviewCanvas" aria-hidden="true" />;
}

function WallsRecordCard({
  record,
  spriteCache,
  selected,
  starred,
  hidden,
  onSelect,
  onToggleStar,
  onToggleHidden,
  onOpenDetails,
}: WallsRecordCardProps): JSX.Element {
  const authorLabel = record.primaryEntry.author?.trim() || "Unknown author";
  const levelCountLabel = `${record.occurrenceCount} level${record.occurrenceCount === 1 ? "" : "s"}`;

  return (
    <article
      className={`wallsCard ${selected ? "selected" : ""}`}
      onClick={() => onSelect(record.wallKey)}
      onPointerDown={stopEvent}
    >
      <div className="wallsCardPreview">
        <WallsPreviewCanvas record={record} spriteCache={spriteCache} />
      </div>
      <div className="wallsCardBody">
        <div className="wallsCardHeader">
          <div className="wallsCardCopy">
            <div className="wallsCardTitle">{record.primaryEntry.levelTitle}</div>
            <div className="wallsCardMeta">
              {record.primaryEntry.setName} #{record.primaryEntry.levelNumber}
            </div>
            <div className="wallsCardMeta">{authorLabel}</div>
          </div>
          <button
            type="button"
            className={`wallsStarButton ${starred ? "active" : ""}`}
            aria-label={starred ? "Remove star" : "Star wall layout"}
            title={starred ? "Remove star" : "Star wall layout"}
            onClick={(event) => {
              stopEvent(event);
              onToggleStar(record.wallKey);
            }}
          >
            {starred ? "★" : "☆"}
          </button>
        </div>
        <div className="wallsCardActions">
          <button
            type="button"
            className="secondaryButton wallsInlineButton"
            onClick={(event) => {
              stopEvent(event);
              onOpenDetails(record.wallKey);
            }}
          >
            {levelCountLabel}
          </button>
          <button
            type="button"
            className="secondaryButton wallsInlineButton"
            onClick={(event) => {
              stopEvent(event);
              onToggleHidden(record.wallKey);
            }}
          >
            {hidden ? "Unhide" : "Hide"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function WallsBrowserDialog({
  spriteCache,
  wallsBank,
  wallsBankLoadState,
  wallsBankError,
  starredKeys,
  hiddenKeys,
  onToggleStar,
  onToggleHidden,
  onImport,
  onClose,
}: WallsBrowserDialogProps): JSX.Element {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [starredOnly, setStarredOnly] = useState(false);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [randomSeed, setRandomSeed] = useState(1);
  const [selectedWallKey, setSelectedWallKey] = useState<string | null>(null);
  const [detailsWallKey, setDetailsWallKey] = useState<string | null>(null);

  const allRecords = wallsBank?.records ?? [];
  const filteredRecords = useMemo(
    () =>
      filterWallsBankRecords(allRecords, {
        query: deferredQuery,
        starredOnly,
        includeHidden,
        starredKeys,
        hiddenKeys,
      }),
    [allRecords, deferredQuery, hiddenKeys, includeHidden, starredKeys, starredOnly],
  );
  const visibleRecords = useMemo(
    () => pickRandomWallsBankRecords(filteredRecords, WALLS_BROWSER_CARD_COUNT, randomSeed),
    [filteredRecords, randomSeed],
  );
  const selectedRecord = findWallsBankRecord(visibleRecords, selectedWallKey);
  const detailsRecord = findWallsBankRecord(allRecords, detailsWallKey);

  useEffect(() => {
    if (visibleRecords.length === 0) {
      if (selectedWallKey !== null) setSelectedWallKey(null);
      return;
    }

    if (!selectedRecord) {
      setSelectedWallKey(visibleRecords[0]!.wallKey);
    }
  }, [selectedRecord, selectedWallKey, visibleRecords]);

  const matchingCount = filteredRecords.length;
  const totalCount = wallsBank?.bank.source.uniqueWallCount ?? 0;

  return (
    <>
      <div
        className="modalBackdrop"
        onClick={onClose}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div
          className="modalCard modalCardWide wallsDialogCard"
          role="dialog"
          aria-modal="true"
          aria-labelledby="walls-browser-title"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="modalHeader">
            <div>
              <div className="sectionEyebrow">File</div>
              <h2 id="walls-browser-title" className="modalTitle">
                Walls Bank
              </h2>
            </div>
            <button
              type="button"
              className="modalCloseButton"
              aria-label="Close walls bank"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="modalBody wallsDialogBody">
            <div className="wallsToolbar">
              <label className="fieldGroup wallsSearchField">
                <span className="fieldLabel">Search</span>
                <input
                  type="text"
                  className="wallsSearchInput"
                  value={query}
                  placeholder="Set name, level number, title, author"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className="wallsToggle">
                <input
                  type="checkbox"
                  checked={starredOnly}
                  onChange={(event) => setStarredOnly(event.target.checked)}
                />
                <span>Starred only</span>
              </label>
              <label className="wallsToggle">
                <input
                  type="checkbox"
                  checked={includeHidden}
                  onChange={(event) => setIncludeHidden(event.target.checked)}
                />
                <span>Show hidden</span>
              </label>
              <div className="statusBadge">
                {matchingCount} match{matchingCount === 1 ? "" : "es"}
              </div>
              <div className="statusBadge">
                {totalCount} total wall layout{totalCount === 1 ? "" : "s"}
              </div>
            </div>

            {wallsBankLoadState === "idle" || wallsBankLoadState === "loading" ? (
              <div className="banner">Loading walls bank...</div>
            ) : wallsBankLoadState === "error" ? (
              <div className="banner errorBanner">
                {wallsBankError ?? "Failed to load walls bank."}
              </div>
            ) : visibleRecords.length === 0 ? (
              <div className="banner">
                No wall layouts match the current filters. Try clearing the search or un-hiding more
                layouts.
              </div>
            ) : (
              <div className="wallsGrid">
                {visibleRecords.map((record) => (
                  <WallsRecordCard
                    key={record.wallKey}
                    record={record}
                    spriteCache={spriteCache}
                    selected={record.wallKey === selectedRecord?.wallKey}
                    starred={starredKeys.has(record.wallKey)}
                    hidden={hiddenKeys.has(record.wallKey)}
                    onSelect={setSelectedWallKey}
                    onToggleStar={onToggleStar}
                    onToggleHidden={onToggleHidden}
                    onOpenDetails={setDetailsWallKey}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="modalActions wallsDialogActions">
            <button
              type="button"
              className="secondaryButton"
              disabled={matchingCount <= 1}
              onClick={() => setRandomSeed(nextRandomSeed())}
            >
              Random
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

      {detailsRecord ? (
        <div
          className="modalBackdrop"
          onClick={() => setDetailsWallKey(null)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div
            className="modalCard modalCardWide wallsDetailDialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="walls-detail-title"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <div className="sectionEyebrow">Wall Layout</div>
                <h2 id="walls-detail-title" className="modalTitle">
                  {detailsRecord.entries.length} level
                  {detailsRecord.entries.length === 1 ? "" : "s"} share this layout
                </h2>
              </div>
              <button
                type="button"
                className="modalCloseButton"
                aria-label="Close wall layout details"
                onClick={() => setDetailsWallKey(null)}
              >
                ×
              </button>
            </div>
            <div className="modalBody wallsDetailBody">
              <div className="wallsDetailPreview">
                <WallsPreviewCanvas record={detailsRecord} spriteCache={spriteCache} />
              </div>
              <div className="wallsDetailList">
                {detailsRecord.entries.map((entry) => (
                  <div
                    key={`${entry.packId}:${entry.levelNumber}:${entry.levelTitle}`}
                    className="wallsDetailRow"
                  >
                    <div className="wallsDetailTitle">
                      {entry.setName} #{entry.levelNumber}: {entry.levelTitle}
                    </div>
                    <div className="wallsDetailMeta">
                      {entry.author?.trim() || "Unknown author"} • {entry.packType} •{" "}
                      {entry.fileName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modalActions wallsDialogActions">
              <button
                type="button"
                className="actionButton"
                onClick={() => {
                  onImport(detailsRecord.wallKey);
                }}
              >
                Import This Layout
              </button>
              <button
                type="button"
                className="secondaryButton"
                onClick={() => setDetailsWallKey(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
