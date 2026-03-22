import {
  forwardRef,
  memo,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  CC1_INVALID_TILE_NAMES,
  CC1_LEGACY_INVALID_TILE_NAMES,
  CC1_VALID_TILE_NAMES,
  rotateDirectionalTileName,
  tileCodeFromName,
} from "@/src/dat/cc1Tiles";
import { decodeDatBytes, encodeDatBytes } from "@/src/dat/datCodec";
import {
  DAT_3D_AIR_TILE,
  buildLogical3dLevelset,
  cloneCanonicalMetadata,
  cloneDatLevel,
  countChipsInLogical3dLevel,
  editable3dLevelsFromDoc,
  export3dLevelsetDoc,
  getLogical3dLevelForRawIndex,
  logicalLevelIndexForRawIndex,
  rawDocFromEditable3dLevels,
  withInsertedBottomLayer,
  withInsertedTopLayer,
  withRemovedBottomLayer,
  withRemovedTopLayer,
  type Editable3dLevel,
  type Logical3dLevel,
} from "@/src/dat/dat3dLevels";
import {
  createDat3dDisplayCell,
  createDat3dDisplayLevel,
  getAirAboveElevatorIndices,
  getDat3dTileDisplayName,
} from "@/src/dat/dat3dDisplay";
import { transformLevel, type DatTransformKind } from "@/src/dat/datTransforms";
import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelJson,
  type DatLevelsetJsonV1,
} from "@/src/dat/datLevelsetJsonV1";
import type { CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import {
  drawCc1CellToContext,
  drawCc1CellsToContext,
  drawCc1LevelToCanvas,
  drawCc1LevelToContext,
} from "@/web/src/canvasLevelRenderer";
import {
  boardPointToCell,
  drawPresentedBoardLayers,
  drawViewportPresentedBoardLayers,
  ensureCanvasSize,
  resolveBoardScreenRect,
  viewportClientPointToBoardPoint,
} from "@/web/src/boardCanvasPresentation";
import { createCanvasSpriteCache, type CanvasSpriteCache } from "@/web/src/canvasSpriteCache";
import { resolveBoardTileRedrawPlan } from "@/web/src/boardRenderInvalidation";
import { buildLexysLabyrinthSharedUrl } from "@/web/src/lexysLabyrinth";
import { loadCc1SpriteSet } from "@/web/src/loadCc1SpriteSet";
import {
  APP_PREFERENCES_STORAGE_KEY,
  EDITOR_SESSION_STORAGE_KEY,
  parsePersistedAppPreferences,
  parsePersistedEditorSession,
  serializePersistedAppPreferences,
  serializePersistedEditorSession,
  type PersistedAppPreferences,
} from "@/web/src/persistedAppState";
import {
  buildHoverCellSummary,
  createBoardEditorStatusStore,
  resolveBrushPreviewDirtyCells,
  resolveBrushPreviewRenderCells,
  type BoardDisplayContext,
  type BoardEditorStatusStore,
} from "@/web/src/boardEditorStatus";
import { buildTworldUrl } from "@/web/src/tworld";
import {
  clearLevel,
  classifyTilePlacement,
  clampPoint,
  commitLevelsetEvent,
  connectLevelButtons,
  countChipsInLevel,
  copyLevelRegion,
  createEmptyLevel,
  createLevelsetEditorHistory,
  extendPaintStroke,
  fillLevelArea,
  getInvalidCellIndices,
  isConnectionEndpointCell,
  normalizeRect,
  paintLevelCells,
  paintLevelLine,
  pasteLevelRegion,
  previewPaintLevelCells,
  redoLevelsetEvent,
  selectLevelInHistory,
  shiftLevelWrap,
  createRandomLevelPassword,
  type GridPoint,
  type GridRect,
  type LevelClipboard,
  type LevelsetEditorHistory,
  undoLevelsetEvent,
} from "@/web/src/levelEditing";
import { TilePreview } from "@/web/src/TilePreview";

type ToolMode = "brush" | "line" | "fill" | "select" | "connect";
type LeftPanelTab = "levels" | "controls";
type InspectorTab = "palette" | "metadata";
type PaletteTab = "normal" | "invalid";
type LayoutModePreference = "auto" | "desktop" | "tablet";
type TabletDrawerSide = "left" | "right" | null;
type PaletteAssignmentTarget = "primary" | "secondary";

type MetadataDraft = Readonly<{
  number: string;
  title: string;
  author: string;
  password: string;
  chips: string;
  time: string;
  mapDetail: string;
  hint: string;
  movement: string;
  trapControls: string;
  cloneControls: string;
  fieldOrder: string;
  extraFields: string;
}>;

type BrushDragState = Readonly<{
  tool: "brush";
  pointerId: number;
  lastPoint: GridPoint;
  cells: ReadonlyArray<number>;
  dirtyCells: ReadonlyArray<number>;
  tile: string;
  buryOnBottom: boolean;
}>;

type LineDragState = Readonly<{
  tool: "line";
  pointerId: number;
  start: GridPoint;
  current: GridPoint;
  tile: string;
  buryOnBottom: boolean;
}>;

type SelectDragState = Readonly<{
  tool: "select";
  pointerId: number;
  start: GridPoint;
  current: GridPoint;
}>;

type DragState = BrushDragState | LineDragState | SelectDragState;

type BoardPanState = Readonly<{
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPanX: number;
  startPanY: number;
}>;

type BoardCursorPoint = Readonly<{
  x: number;
  y: number;
}>;

type ViewportSize = Readonly<{
  width: number;
  height: number;
}>;

type TouchPoint = Readonly<{
  clientX: number;
  clientY: number;
}>;

type TouchGestureState = Readonly<{
  pointerIds: readonly [number, number];
  startPanX: number;
  startPanY: number;
  startZoom: number;
  startCenterX: number;
  startCenterY: number;
  startDistance: number;
}> | null;

type LayoutResizeState = Readonly<{
  side: "left" | "right";
  pointerId: number;
  startClientX: number;
  startWidth: number;
}>;

type LevelContextMenuState = Readonly<{
  index: number;
  x: number;
  y: number;
}> | null;

type LevelDropState = Readonly<{
  index: number;
  position: "before" | "after";
}> | null;

type PendingConnectionState = Readonly<{
  startIndex: number;
  cursor: BoardCursorPoint;
}> | null;

type BoardEditorHandle = Readonly<{
  resetInteractionState: (options?: { resetView?: boolean }) => void;
  resetBoardView: (nextZoom?: number) => void;
}>;

type BoardControlsSectionProps = Readonly<{
  statusStore: BoardEditorStatusStore;
  canUndo: boolean;
  canRedo: boolean;
  activeLevel: DatLevelJson | null;
  selection: GridRect | null;
  clipboard: LevelClipboard | null;
  tool: ToolMode;
  setTool: (tool: ToolMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopySelection: () => void;
  onPasteClipboard: () => void;
  onEraseSelection: () => void;
  onClearLevel: () => void;
  onResetBoardView: () => void;
  isTabletLayout: boolean;
  threeDLevelsEnabled: boolean;
  selectedLogicalLevel: Logical3dLevel | null;
  selectedLayerZ: number;
  onSelectLayerUp: () => void;
  onSelectLayerDown: () => void;
  onAddTopLayer: () => void;
  onAddBottomLayer: () => void;
  onRemoveTopLayer: () => void;
  onRemoveBottomLayer: () => void;
  onOpenThreeDHelp: () => void;
}>;

type BoardEditorSurfaceProps = Readonly<{
  statusStore: BoardEditorStatusStore;
  interactionResetToken: number;
  viewResetToken: number;
  activeLevel: DatLevelJson | null;
  activeDisplayContext: BoardDisplayContext;
  selectedLogicalLevel: Logical3dLevel | null;
  selectedLayerZ: number;
  spriteSet: CC1SpriteSet | null;
  canvasSpriteCache: CanvasSpriteCache | null;
  boardSize: number;
  showSecrets: boolean;
  showConnections: boolean;
  showMonsterOrder: boolean;
  showValidityWarnings: boolean;
  threeDLevelsEnabled: boolean;
  experimentalViewportRenderer: boolean;
  tool: ToolMode;
  primaryTile: string;
  secondaryTile: string;
  selection: GridRect | null;
  clipboard: LevelClipboard | null;
  pastePreviewActive: boolean;
  onSelectionChange: (selection: GridRect | null) => void;
  onClearMetadataError: () => void;
  onSetErrorMessage: (message: string | null) => void;
  onCommitSelectedLevelUpdate: (updater: (level: DatLevelJson) => DatLevelJson) => void;
  onApplySelectedLevelTransform: (kind: DatTransformKind) => void;
  onShiftVisibleLevel: (dx: number, dy: number) => void;
  isTabletLayout: boolean;
}>;

const CC1_TILESET_URL = `${import.meta.env.BASE_URL}cc1/spritesheet.bmp`;
const TOOL_LABELS: Array<{ id: ToolMode; label: string; shortcut: string }> = [
  { id: "brush", label: "Brush", shortcut: "B" },
  { id: "line", label: "Line", shortcut: "L" },
  { id: "fill", label: "Bucket", shortcut: "F" },
  { id: "select", label: "Select", shortcut: "V" },
  { id: "connect", label: "Connect", shortcut: "C" },
];
const MIN_LEFT_PANEL_WIDTH = 180;
const MAX_LEFT_PANEL_WIDTH = 420;
const MIN_RIGHT_PANEL_WIDTH = 220;
const MAX_RIGHT_PANEL_WIDTH = 520;
const MIN_BOARD_COLUMN_WIDTH = 420;
const SPLITTER_WIDTH = 10;
const THREE_D_STACK_DEPTH = 3;
const MIN_PALETTE_TILE_SIZE = 36;
const MAX_PALETTE_TILE_SIZE = 144;
const KEYBOARD_PAN_SPEED = 520;
const TABLET_LAYOUT_MIN_VIEWPORT = 700;
const TABLET_LAYOUT_MAX_VIEWPORT = 1400;
const LAYOUT_MODE_PREFERENCE_STORAGE_KEY = "dattools-layout-mode";
const DOCUMENT_PERSIST_DEBOUNCE_MS = 300;
const DAT_3D_VALID_TERRAIN_TILES = new Set<string>([DAT_3D_AIR_TILE, "CHIP_EXIT"]);
const DEFAULT_LEVELSET_FILENAME = "NEW_LEVELSET.DAT";
const DEFAULT_MAGIC_NUMBER = 174764;
const BOARD_PARTIAL_REDRAW_THRESHOLD = 128;
const TRANSFORM_MENU_ITEMS: ReadonlyArray<Readonly<{ kind: DatTransformKind; label: string }>> = [
  { kind: "ROTATE_90", label: "Rotate 90°" },
  { kind: "ROTATE_180", label: "Rotate 180°" },
  { kind: "ROTATE_270", label: "Rotate 270°" },
  { kind: "FLIP_H", label: "Flip Horizontal" },
  { kind: "FLIP_V", label: "Flip Vertical" },
  { kind: "FLIP_DIAG_NWSE", label: "Flip Diagonal NW-SE" },
  { kind: "FLIP_DIAG_NESW", label: "Flip Diagonal NE-SW" },
];

type BoardBaseRenderSnapshot = Readonly<{
  level: DatLevelJson | null;
  renderKey: string | null;
  mode: "committed" | "transient";
  canvasSpriteCache: CanvasSpriteCache | null;
  boardSize: number;
}>;

function getBoardBaseCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  return canvas.getContext("2d", { alpha: false });
}

function getOverlayCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  return canvas.getContext("2d", { desynchronized: true });
}

function getOrCreateInternalCanvas(ref: { current: HTMLCanvasElement | null }): HTMLCanvasElement {
  if (!ref.current) {
    ref.current = document.createElement("canvas");
  }
  return ref.current;
}

function readLocalStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function asErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function isLayoutModePreference(value: string | null): value is LayoutModePreference {
  return value === "auto" || value === "desktop" || value === "tablet";
}

function isKeyboardPanKey(key: string): boolean {
  return (
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d" ||
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright"
  );
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadBytes(filename: string, bytes: Uint8Array): void {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  downloadBlob(filename, new Blob([ab], { type: "application/octet-stream" }));
}

function downloadText(filename: string, text: string): void {
  downloadBlob(filename, new Blob([text], { type: "application/json" }));
}

type SaveFilePickerHandle = {
  createWritable(): Promise<{
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
  }>;
};

type WindowWithSavePicker = Window &
  typeof globalThis & {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<SaveFilePickerHandle>;
  };

async function saveBytesLocally(filename: string, bytes: Uint8Array): Promise<void> {
  const savePicker = (window as WindowWithSavePicker).showSaveFilePicker;
  if (!savePicker) {
    downloadBytes(filename, bytes);
    return;
  }

  const handle = await savePicker({
    suggestedName: filename,
    excludeAcceptAllOption: false,
    types: [
      {
        description: "CC1 DAT levelset",
        accept: {
          "application/octet-stream": [".dat"],
        },
      },
    ],
  });
  const writable = await handle.createWritable();
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  await writable.write(new Blob([ab], { type: "application/octet-stream" }));
  await writable.close();
}

function createDefaultLevelsetDocument(): DatLevelsetJsonV1 {
  return parseDatLevelsetJsonV1({
    schema: "datTools.dat.levelset.json.v1",
    magicNumber: DEFAULT_MAGIC_NUMBER,
    levels: [createEmptyLevel(1, { title: "Level 1" })],
  });
}

type InitialAppState = Readonly<{
  editor: LevelsetEditorHistory;
  fileName: string;
  preferences: PersistedAppPreferences;
}>;

function createInitialAppState(): InitialAppState {
  const fallbackDoc = createDefaultLevelsetDocument();
  if (typeof window === "undefined") {
    return {
      editor: createLevelsetEditorHistory(fallbackDoc),
      fileName: DEFAULT_LEVELSET_FILENAME,
      preferences: parsePersistedAppPreferences(null),
    };
  }

  const session = parsePersistedEditorSession(
    readLocalStorage(EDITOR_SESSION_STORAGE_KEY),
    DEFAULT_LEVELSET_FILENAME,
  );
  const preferences = parsePersistedAppPreferences(readLocalStorage(APP_PREFERENCES_STORAGE_KEY));
  const editor = session
    ? selectLevelInHistory(createLevelsetEditorHistory(session.doc), session.selectedIndex)
    : createLevelsetEditorHistory(fallbackDoc);

  return {
    editor,
    fileName: session?.fileName ?? DEFAULT_LEVELSET_FILENAME,
    preferences,
  };
}

function normalizeDatFileName(filename: string): string {
  const trimmed = filename.trim();
  if (trimmed.length === 0) return DEFAULT_LEVELSET_FILENAME;
  if (trimmed.toLowerCase().endsWith(".dat")) return trimmed;
  return `${trimmed}.dat`;
}

function gridPointsEqual(a: GridPoint | null, b: GridPoint | null): boolean {
  return a?.x === b?.x && a?.y === b?.y;
}

function metadataDraftEquals(a: MetadataDraft, b: MetadataDraft): boolean {
  return (
    a.number === b.number &&
    a.title === b.title &&
    a.author === b.author &&
    a.password === b.password &&
    a.chips === b.chips &&
    a.time === b.time &&
    a.mapDetail === b.mapDetail &&
    a.hint === b.hint &&
    a.movement === b.movement &&
    a.trapControls === b.trapControls &&
    a.cloneControls === b.cloneControls &&
    a.fieldOrder === b.fieldOrder &&
    a.extraFields === b.extraFields
  );
}

function makeMetadataDraft(
  canonicalLevel: DatLevelJson,
  layerLevel: DatLevelJson = canonicalLevel,
  levelNumber = canonicalLevel.number,
  title = canonicalLevel.title,
): MetadataDraft {
  return {
    number: String(levelNumber),
    title: title ?? "",
    author: canonicalLevel.author ?? "",
    password: canonicalLevel.password ?? "",
    chips: String(canonicalLevel.chips),
    time: String(canonicalLevel.time),
    mapDetail: String(canonicalLevel.mapDetail),
    hint: layerLevel.hint ?? "",
    movement: JSON.stringify(layerLevel.movement, null, 2),
    trapControls: JSON.stringify(layerLevel.trapControls, null, 2),
    cloneControls: JSON.stringify(layerLevel.cloneControls, null, 2),
    fieldOrder: JSON.stringify(canonicalLevel.fieldOrder, null, 2),
    extraFields: JSON.stringify(canonicalLevel.extraFields, null, 2),
  };
}

function blankToUndefined(value: string): string | undefined {
  return value.length === 0 ? undefined : value;
}

function parseLevelFromDraft(
  currentLevel: DatLevelJson,
  draft: MetadataDraft,
  magicNumber: number,
): DatLevelJson {
  const candidate: Record<string, unknown> = {
    ...currentLevel,
    number: Number(draft.number),
    time: Number(draft.time),
    chips: Number(draft.chips),
    mapDetail: Number(draft.mapDetail),
    map: currentLevel.map,
    trapControls: JSON.parse(draft.trapControls),
    cloneControls: JSON.parse(draft.cloneControls),
    movement: JSON.parse(draft.movement),
    fieldOrder: JSON.parse(draft.fieldOrder),
    extraFields: JSON.parse(draft.extraFields),
  };

  const title = blankToUndefined(draft.title);
  const author = blankToUndefined(draft.author);
  const password = blankToUndefined(draft.password);
  const hint = blankToUndefined(draft.hint);

  if (title !== undefined) candidate.title = title;
  else delete candidate.title;
  if (author !== undefined) candidate.author = author;
  else delete candidate.author;
  if (password !== undefined) candidate.password = password;
  else delete candidate.password;
  if (hint !== undefined) candidate.hint = hint;
  else delete candidate.hint;

  return parseDatLevelsetJsonV1({
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels: [candidate],
  }).levels[0]!;
}

function parseThreeDLevelsFromDraft(
  canonicalLevel: DatLevelJson,
  activeLayerLevel: DatLevelJson,
  draft: MetadataDraft,
  magicNumber: number,
  isCanonicalLayerActive: boolean,
): { canonicalLevel: DatLevelJson; activeLayerLevel: DatLevelJson } {
  const fieldOrder = JSON.parse(draft.fieldOrder);
  const extraFields = JSON.parse(draft.extraFields);
  const movement = JSON.parse(draft.movement);
  const trapControls = JSON.parse(draft.trapControls);
  const cloneControls = JSON.parse(draft.cloneControls);

  const canonicalCandidate: Record<string, unknown> = {
    ...canonicalLevel,
    number: Number(draft.number),
    time: Number(draft.time),
    chips: Number(draft.chips),
    mapDetail: Number(draft.mapDetail),
    map: canonicalLevel.map,
    fieldOrder,
    extraFields,
    hint: isCanonicalLayerActive ? blankToUndefined(draft.hint) : canonicalLevel.hint,
    movement: isCanonicalLayerActive ? movement : canonicalLevel.movement,
    trapControls: isCanonicalLayerActive ? trapControls : canonicalLevel.trapControls,
    cloneControls: isCanonicalLayerActive ? cloneControls : canonicalLevel.cloneControls,
  };

  const title = blankToUndefined(draft.title);
  const author = blankToUndefined(draft.author);
  const password = blankToUndefined(draft.password);

  if (title !== undefined) canonicalCandidate.title = title;
  else delete canonicalCandidate.title;
  if (author !== undefined) canonicalCandidate.author = author;
  else delete canonicalCandidate.author;
  if (password !== undefined) canonicalCandidate.password = password;
  else delete canonicalCandidate.password;

  const parsedCanonical = parseDatLevelsetJsonV1({
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels: [canonicalCandidate],
  }).levels[0]!;

  if (isCanonicalLayerActive) {
    return {
      canonicalLevel: parsedCanonical,
      activeLayerLevel: parsedCanonical,
    };
  }

  const activeCandidate: Record<string, unknown> = {
    ...activeLayerLevel,
    map: activeLayerLevel.map,
    hint: blankToUndefined(draft.hint),
    movement,
    trapControls,
    cloneControls,
  };

  const parsedActive = parseDatLevelsetJsonV1({
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels: [activeCandidate],
  }).levels[0]!;

  return {
    canonicalLevel: parsedCanonical,
    activeLayerLevel: parsedActive,
  };
}

function cloneLevel(level: DatLevelJson, nextNumber: number): DatLevelJson {
  return {
    ...level,
    number: nextNumber,
    password: createRandomLevelPassword(),
    ...(level.title ? { title: `${level.title} Copy` } : {}),
    map: {
      ...level.map,
      top: [...level.map.top],
      bottom: [...level.map.bottom],
    },
    trapControls: level.trapControls.map((control) => ({ ...control })),
    cloneControls: level.cloneControls.map((control) => ({ ...control })),
    movement: [...level.movement],
    fieldOrder: [...level.fieldOrder],
    extraFields: level.extraFields.map((field) => ({
      field: field.field,
      data: { ...field.data },
    })),
  };
}

function canvasPointToCell(
  canvas: HTMLCanvasElement,
  event: Pick<PointerEvent, "clientX" | "clientY">,
  options: Readonly<{
    boardSize: number;
    boardPan: Readonly<{ x: number; y: number }>;
    boardZoom: number;
    experimentalViewportRenderer: boolean;
  }>,
): GridPoint | null {
  const boardPoint = canvasPointToBoard(canvas, event, options);
  const cell = boardPointToCell(boardPoint, options.boardSize);
  return cell ? clampPoint(cell) : null;
}

function canvasPointToBoard(
  canvas: HTMLCanvasElement,
  event: Pick<PointerEvent, "clientX" | "clientY">,
  options: Readonly<{
    boardSize: number;
    boardPan: Readonly<{ x: number; y: number }>;
    boardZoom: number;
    experimentalViewportRenderer: boolean;
  }>,
): BoardCursorPoint | null {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  if (options.experimentalViewportRenderer) {
    return viewportClientPointToBoardPoint(
      rect,
      event,
      resolveBoardScreenRect({
        boardSize: options.boardSize,
        boardPan: options.boardPan,
        boardZoom: options.boardZoom,
      }),
      options.boardSize,
    );
  }

  return {
    x: ((event.clientX - rect.left) / rect.width) * options.boardSize,
    y: ((event.clientY - rect.top) / rect.height) * options.boardSize,
  };
}

function getPasteAnchor(selection: GridRect | null, hoverPoint: GridPoint | null): GridPoint {
  if (selection) return { x: selection.x, y: selection.y };
  if (hoverPoint) return hoverPoint;
  return { x: 0, y: 0 };
}

function isSupportedCanvasPointerButton(button: number): boolean {
  return button === 0 || button === 2;
}

function isBoardPanGesture(event: Pick<PointerEvent, "button" | "metaKey" | "ctrlKey">): boolean {
  return event.button === 1 || (event.button === 0 && (event.metaKey || event.ctrlKey));
}

function isTouchPointer(event: Pick<PointerEvent, "pointerType">): boolean {
  return event.pointerType === "touch";
}

function getTouchCenter(a: TouchPoint, b: TouchPoint): TouchPoint {
  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
}

function getTouchDistance(a: TouchPoint, b: TouchPoint): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getPaintTileForButton(button: number, primaryTile: string, secondaryTile: string): string {
  return button === 2 ? secondaryTile : primaryTile;
}

function makePaintOptions(threeDEnabled: boolean, layerZ: number, buryOnBottom = false) {
  return {
    ...(threeDEnabled
      ? {
          treatAsTerrainTiles: DAT_3D_VALID_TERRAIN_TILES,
          allowedInvalidTiles: DAT_3D_VALID_TERRAIN_TILES,
        }
      : {}),
    ...(threeDEnabled && layerZ > 1
      ? { fullCellTerrainTiles: new Set<string>([DAT_3D_AIR_TILE]) }
      : {}),
    ...(buryOnBottom ? { buryOnBottom: true } : {}),
  };
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  size: number,
  traps: DatLevelJson["trapControls"],
  cloners: DatLevelJson["cloneControls"],
): void {
  ctx.save();
  ctx.strokeStyle = "rgba(196, 55, 55, 0.9)";
  ctx.lineWidth = Math.max(1, Math.round(size / 18));

  const drawLine = (fromIndex: number, toIndex: number) => {
    const x1 = (fromIndex % 32) * size + size / 2;
    const y1 = Math.floor(fromIndex / 32) * size + size / 2;
    const x2 = (toIndex % 32) * size + size / 2;
    const y2 = Math.floor(toIndex / 32) * size + size / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  for (const trap of traps) drawLine(trap.button, trap.trap);
  for (const cloner of cloners) drawLine(cloner.button, cloner.cloner);

  ctx.restore();
}

function drawPendingConnection(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  startIndex: number,
  cursor: BoardCursorPoint,
): void {
  const startX = (startIndex % 32) * tileSize + tileSize / 2;
  const startY = Math.floor(startIndex / 32) * tileSize + tileSize / 2;
  const radius = Math.max(2, Math.round(tileSize / 8));

  ctx.save();
  ctx.strokeStyle = "rgba(196, 55, 55, 0.96)";
  ctx.fillStyle = "rgba(196, 55, 55, 0.96)";
  ctx.lineWidth = Math.max(2, Math.round(tileSize / 14));
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(cursor.x, cursor.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, Math.max(1.5, radius * 0.75), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const LEVEL_SHIFT_ARROWS = [
  { direction: "north", dx: 0, dy: -1, label: "Shift level north" },
  { direction: "south", dx: 0, dy: 1, label: "Shift level south" },
  { direction: "west", dx: -1, dy: 0, label: "Shift level west" },
  { direction: "east", dx: 1, dy: 0, label: "Shift level east" },
] as const;

const BOARD_TRANSFORM_BUTTONS: ReadonlyArray<
  Readonly<{
    kind: DatTransformKind;
    position: "corner-nw" | "corner-ne" | "top-center" | "left-center" | "corner-sw" | "corner-se";
    label: string;
  }>
> = [
  { kind: "ROTATE_270", position: "corner-nw", label: "Rotate 270 degrees" },
  { kind: "ROTATE_90", position: "corner-ne", label: "Rotate 90 degrees" },
  { kind: "FLIP_H", position: "top-center", label: "Flip horizontally" },
  { kind: "FLIP_V", position: "left-center", label: "Flip vertically" },
  { kind: "FLIP_DIAG_NESW", position: "corner-sw", label: "Flip along the NE-SW diagonal" },
  { kind: "FLIP_DIAG_NWSE", position: "corner-se", label: "Flip along the NW-SE diagonal" },
];

function renderRotateTransformIcon(mirrored: boolean): ReactNode {
  const markerId = mirrored ? "rotate-transform-head-mirrored" : "rotate-transform-head";

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 6 6"
          refX="5.05"
          refY="3"
          markerWidth="6"
          markerHeight="6"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path
            d="M0.9 1 5.1 3 2.9 5.95"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <g transform={mirrored ? "translate(20 0) scale(-1 1)" : undefined}>
        <path
          d="M10 3.25a6.75 6.75 0 1 0 5.74 10.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerStart={`url(#${markerId})`}
        />
      </g>
    </svg>
  );
}

function renderBoardTransformIcon(kind: DatTransformKind): ReactNode {
  switch (kind) {
    case "ROTATE_90":
      return renderRotateTransformIcon(true);
    case "ROTATE_270":
      return renderRotateTransformIcon(false);
    case "FLIP_H":
      return (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <line
            x1="10"
            y1="3"
            x2="10"
            y2="17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <polyline
            points="3.5 7 7 10 3.5 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="16.5 7 13 10 16.5 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "FLIP_V":
      return (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <line
            x1="3"
            y1="10"
            x2="17"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <polyline
            points="7 3.5 10 7 13 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="7 16.5 10 13 13 16.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "FLIP_DIAG_NWSE":
      return (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <line
            x1="4"
            y1="4"
            x2="16"
            y2="16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <polyline
            points="12.5 4 16 7.5 12.5 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="4 12.5 7.5 16 11 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "FLIP_DIAG_NESW":
      return (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <line
            x1="16"
            y1="4"
            x2="4"
            y2="16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <polyline
            points="7.5 4 4 7.5 7.5 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="16 12.5 12.5 16 9 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ROTATE_180":
      return null;
  }
}

function drawMonsterOrder(
  ctx: CanvasRenderingContext2D,
  size: number,
  movement: ReadonlyArray<number>,
): void {
  if (size < 20) return;

  ctx.save();
  ctx.font = `${Math.max(10, Math.round(size * 0.32))}px "Avenir Next", "Segoe UI", sans-serif`;
  ctx.textBaseline = "top";

  for (let idx = 0; idx < movement.length; idx++) {
    const point = movement[idx]!;
    const x = (point % 32) * size + size * 0.55;
    const y = Math.floor(point / 32) * size + size * 0.56;
    const text = String(idx);
    const metrics = ctx.measureText(text);

    ctx.fillStyle = "rgba(15, 20, 18, 0.88)";
    ctx.fillRect(x - 3, y - 2, metrics.width + 6, size * 0.28 + 6);
    ctx.fillStyle = "rgba(251, 250, 244, 0.95)";
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, tileSize: number): void {
  ctx.save();
  ctx.strokeStyle = "rgba(48, 77, 68, 0.16)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 32; i++) {
    const offset = i * tileSize + 0.5;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, tileSize * 32);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(tileSize * 32, offset);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGridForVisibleCells(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  visibleIndices: ReadonlyArray<number>,
): void {
  if (visibleIndices.length === 0) return;

  ctx.save();
  ctx.beginPath();
  for (const index of visibleIndices) {
    const x = (index % 32) * tileSize;
    const y = Math.floor(index / 32) * tileSize;
    ctx.rect(x, y, tileSize, tileSize);
  }
  ctx.clip();

  ctx.strokeStyle = "rgba(48, 77, 68, 0.16)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 32; i++) {
    const offset = i * tileSize + 0.5;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, tileSize * 32);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(tileSize * 32, offset);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGridCellOutline(ctx: CanvasRenderingContext2D, tileSize: number, index: number): void {
  const x = (index % 32) * tileSize + 0.5;
  const y = Math.floor(index / 32) * tileSize + 0.5;

  ctx.save();
  ctx.strokeStyle = "rgba(48, 77, 68, 0.16)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, tileSize, tileSize);
  ctx.restore();
}

function isTransparentAirCell(
  level: DatLevelJson,
  index: number,
  layerZ: number,
  threeDEnabled: boolean,
): boolean {
  return (
    threeDEnabled &&
    layerZ > 1 &&
    (level.map.top[index] ?? "FLOOR") === DAT_3D_AIR_TILE &&
    (level.map.bottom[index] ?? "FLOOR") === DAT_3D_AIR_TILE
  );
}

type ThreeDLayerDrawMetrics = Readonly<{
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}>;

type ThreeDLayerClipRegion = Readonly<{
  metrics: ThreeDLayerDrawMetrics;
  airIndices: ReadonlyArray<number>;
}>;

function getThreeDLayerDrawMetrics(
  depth: number,
  boardSize: number,
  boardPan: Readonly<{ x: number; y: number }>,
  boardZoom: number,
  viewport: Pick<HTMLDivElement, "clientWidth" | "clientHeight"> | null,
): ThreeDLayerDrawMetrics {
  const baseScale = Math.pow(0.9, depth);
  const centeredPanX = viewport ? (viewport.clientWidth - boardSize * boardZoom) / 2 : boardPan.x;
  const centeredPanY = viewport ? (viewport.clientHeight - boardSize * boardZoom) / 2 : boardPan.y;
  const normalizedPanX = boardZoom > 0 ? (boardPan.x - centeredPanX) / boardZoom : 0;
  const normalizedPanY = boardZoom > 0 ? (boardPan.y - centeredPanY) / boardZoom : 0;
  const lagFactor = Math.min(0.45, depth * 0.16);
  const width = boardSize * baseScale;
  const height = boardSize * baseScale;
  const offsetX = (boardSize - width) / 2 - normalizedPanX * lagFactor;
  const offsetY = (boardSize - height) / 2 - normalizedPanY * lagFactor;

  return {
    offsetX,
    offsetY,
    width,
    height,
    scaleX: baseScale,
    scaleY: baseScale,
  };
}

function drawHighlightedCells(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  indices: ReadonlyArray<number>,
  fillStyle: string,
  strokeStyle: string,
): void {
  if (indices.length === 0) return;

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = Math.max(1, Math.round(tileSize / 14));

  for (const index of indices) {
    const x = (index % 32) * tileSize;
    const y = Math.floor(index / 32) * tileSize;
    ctx.fillRect(x, y, tileSize, tileSize);
    ctx.strokeRect(x + 0.5, y + 0.5, tileSize - 1, tileSize - 1);
  }

  ctx.restore();
}

function drawInvalidCells(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  indices: ReadonlyArray<number>,
): void {
  if (indices.length === 0) return;

  ctx.save();
  ctx.strokeStyle = "rgba(194, 58, 45, 0.98)";
  ctx.fillStyle = "rgba(194, 58, 45, 0.18)";
  ctx.lineWidth = Math.max(2, Math.round(tileSize / 10));
  ctx.font = `700 ${Math.max(11, Math.round(tileSize * 0.34))}px "Avenir Next", "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const index of indices) {
    const x = (index % 32) * tileSize;
    const y = Math.floor(index / 32) * tileSize;
    ctx.fillRect(x, y, tileSize, tileSize);
    ctx.strokeRect(x + 1, y + 1, Math.max(0, tileSize - 2), Math.max(0, tileSize - 2));
    ctx.fillStyle = "rgba(255, 245, 242, 0.98)";
    ctx.fillText("!", x + tileSize * 0.78, y + tileSize * 0.24);
    ctx.fillStyle = "rgba(194, 58, 45, 0.18)";
  }

  ctx.restore();
}

function drawSecretAirElevatorCells(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  indices: ReadonlyArray<number>,
): void {
  if (indices.length === 0) return;

  ctx.save();
  ctx.strokeStyle = "rgba(64, 151, 232, 0.98)";
  ctx.lineWidth = Math.max(2, Math.round(tileSize / 10));

  for (const index of indices) {
    const x = (index % 32) * tileSize;
    const y = Math.floor(index / 32) * tileSize;
    ctx.strokeRect(x + 1, y + 1, Math.max(0, tileSize - 2), Math.max(0, tileSize - 2));
  }

  ctx.restore();
}

function drawRectOverlay(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  rect: GridRect,
  fillStyle: string,
  strokeStyle: string,
  dashed = false,
): void {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = Math.max(2, Math.round(tileSize / 12));
  if (dashed) ctx.setLineDash([tileSize * 0.4, tileSize * 0.2]);

  ctx.fillRect(rect.x * tileSize, rect.y * tileSize, rect.width * tileSize, rect.height * tileSize);
  ctx.strokeRect(
    rect.x * tileSize + 0.5,
    rect.y * tileSize + 0.5,
    rect.width * tileSize - 1,
    rect.height * tileSize - 1,
  );

  ctx.restore();
}

function drawLayerAlignedHoverCell(
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  point: GridPoint,
  metrics: ThreeDLayerDrawMetrics,
  fillStyle: string,
  strokeStyle: string,
  clipRegions: ReadonlyArray<ThreeDLayerClipRegion> = [],
): void {
  ctx.save();
  for (const clipRegion of clipRegions) {
    if (clipRegion.airIndices.length === 0) {
      ctx.restore();
      return;
    }

    ctx.beginPath();
    for (const index of clipRegion.airIndices) {
      ctx.rect(
        clipRegion.metrics.offsetX + (index % 32) * tileSize * clipRegion.metrics.scaleX,
        clipRegion.metrics.offsetY + Math.floor(index / 32) * tileSize * clipRegion.metrics.scaleY,
        tileSize * clipRegion.metrics.scaleX,
        tileSize * clipRegion.metrics.scaleY,
      );
    }
    ctx.clip();
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = Math.max(
    1,
    Math.round((tileSize * Math.min(metrics.scaleX, metrics.scaleY)) / 12),
  );

  const x = metrics.offsetX + point.x * tileSize * metrics.scaleX;
  const y = metrics.offsetY + point.y * tileSize * metrics.scaleY;
  const width = tileSize * metrics.scaleX;
  const height = tileSize * metrics.scaleY;

  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x + 0.5, y + 0.5, Math.max(0, width - 1), Math.max(0, height - 1));
  ctx.restore();
}

function drawBrushPreviewCellsToContext(
  ctx: CanvasRenderingContext2D,
  canvasSpriteCache: CanvasSpriteCache,
  level: DatLevelJson,
  previewIndices: ReadonlyArray<number>,
  brushState: Readonly<{
    tile: string;
    buryOnBottom: boolean;
  }>,
  displayContext: BoardDisplayContext,
  showSecrets: boolean,
): void {
  const previewCells = previewPaintLevelCells(
    level,
    previewIndices,
    brushState.tile,
    makePaintOptions(displayContext.threeDEnabled, displayContext.layerZ, brushState.buryOnBottom),
  );

  for (const previewCell of previewCells) {
    const displayCell = createDat3dDisplayCell(previewCell.top, previewCell.bottom, displayContext);
    const x = (previewCell.index % 32) * canvasSpriteCache.tileSize;
    const y = Math.floor(previewCell.index / 32) * canvasSpriteCache.tileSize;

    ctx.clearRect(x, y, canvasSpriteCache.tileSize, canvasSpriteCache.tileSize);
    drawCc1CellToContext(
      ctx,
      displayCell.top,
      displayCell.bottom,
      canvasSpriteCache,
      { showSecrets },
      x,
      y,
    );
    drawGridCellOutline(ctx, canvasSpriteCache.tileSize, previewCell.index);
  }
}

function useBoardEditorStatus(statusStore: BoardEditorStatusStore) {
  return useSyncExternalStore(
    statusStore.subscribe,
    statusStore.getSnapshot,
    statusStore.getSnapshot,
  );
}

const BoardControlsSection = memo(function BoardControlsSection({
  statusStore,
  canUndo,
  canRedo,
  activeLevel,
  selection,
  clipboard,
  tool,
  setTool,
  onUndo,
  onRedo,
  onCopySelection,
  onPasteClipboard,
  onEraseSelection,
  onClearLevel,
  onResetBoardView,
  isTabletLayout,
  threeDLevelsEnabled,
  selectedLogicalLevel,
  selectedLayerZ,
  onSelectLayerUp,
  onSelectLayerDown,
  onAddTopLayer,
  onAddBottomLayer,
  onRemoveTopLayer,
  onRemoveBottomLayer,
  onOpenThreeDHelp,
}: BoardControlsSectionProps) {
  const { boardZoom, hoverPoint, hoverCellSummary } = useBoardEditorStatus(statusStore);

  return (
    <section className="panelSection leftPanelTabBody controlsPanelSection">
      <div className="sectionHeader">
        <div>
          <div className="sectionEyebrow">Board</div>
          <h2 className="sectionTitle">Controls</h2>
        </div>
      </div>

      <div className="boardControlRow boardCommandRow">
        <button type="button" className="actionButton" disabled={!canUndo} onClick={onUndo}>
          Undo
        </button>
        <button type="button" className="actionButton" disabled={!canRedo} onClick={onRedo}>
          Redo
        </button>
        <button
          type="button"
          className="secondaryButton"
          disabled={!selection || !activeLevel}
          onClick={onCopySelection}
        >
          Copy
        </button>
        <button
          type="button"
          className="secondaryButton"
          disabled={!clipboard || !activeLevel}
          onClick={onPasteClipboard}
        >
          Paste
        </button>
        <button
          type="button"
          className="secondaryButton"
          disabled={!selection || !activeLevel}
          onClick={onEraseSelection}
        >
          Erase
        </button>
        <button
          type="button"
          className="secondaryButton"
          disabled={!activeLevel}
          onClick={onClearLevel}
        >
          Clear
        </button>
      </div>

      <div className="toggleGroup boardToolRow">
        {TOOL_LABELS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`toolButton ${tool === entry.id ? "active" : ""}`}
            onClick={() => setTool(entry.id)}
          >
            {entry.label}
            <span className="toolShortcut">{entry.shortcut}</span>
          </button>
        ))}
      </div>

      <div className="boardMeta">
        <span className="statusBadge">{`zoom ${Math.round(boardZoom * 100)}%`}</span>
        <button
          type="button"
          className="statusBadge statusBadgeButton"
          disabled={!activeLevel}
          onClick={onResetBoardView}
        >
          Reset
        </button>
        {clipboard ? (
          <span className="statusBadge">{`clipboard ${clipboard.width}x${clipboard.height}`}</span>
        ) : null}
        {selection ? (
          <span className="statusBadge">{`selection ${selection.width}x${selection.height}`}</span>
        ) : null}
        {hoverPoint ? (
          <span className="statusBadge">{`cell ${hoverPoint.x},${hoverPoint.y}`}</span>
        ) : null}
      </div>

      {hoverCellSummary ? (
        <div className="hoverSummary">
          <span>{`index ${hoverCellSummary.index}`}</span>
          <span>{`top ${hoverCellSummary.top}`}</span>
          <span>{`bottom ${hoverCellSummary.bottom}`}</span>
        </div>
      ) : (
        <div className="hoverSummary">
          {isTabletLayout
            ? "Tap a cell to inspect a cell stack."
            : "Hover the map to inspect a cell stack."}
        </div>
      )}

      {threeDLevelsEnabled && selectedLogicalLevel ? (
        <section className="leftPanelSubsection">
          <div className="sectionHeader leftPanelSubsectionHeader">
            <div>
              <div className="sectionEyebrow">3D Levels</div>
              <h3 className="sectionTitle">Layers</h3>
            </div>
            <div className="sectionActions">
              <button
                type="button"
                className="boardIconButton"
                aria-label="Explain DAT 3D levels"
                title="Explain DAT 3D levels"
                onClick={onOpenThreeDHelp}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.25" fill="none" />
                  <path
                    d="M6.7 6.1a1.55 1.55 0 1 1 2.5 1.2c-.72.56-1.15.95-1.15 1.7v.35"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="11.95" r="0.75" stroke="none" />
                </svg>
              </button>
            </div>
          </div>

          <div className="boardMeta">
            <span className="statusBadge">{`z ${selectedLayerZ}/${selectedLogicalLevel.layers.length}`}</span>
            <span className="statusBadge">{`${selectedLogicalLevel.layers.length} layers`}</span>
          </div>

          <div className="board3dButtonGrid">
            <button
              type="button"
              className="secondaryButton shortcutButton"
              disabled={selectedLayerZ >= selectedLogicalLevel.layers.length}
              onClick={onSelectLayerUp}
            >
              Layer Up
              <span className="toolShortcut">Q</span>
            </button>
            <button type="button" className="secondaryButton" onClick={onAddTopLayer}>
              + Top
            </button>
            <button
              type="button"
              className="secondaryButton"
              disabled={selectedLogicalLevel.layers.length <= 1}
              onClick={onRemoveTopLayer}
            >
              - Top
            </button>
            <button
              type="button"
              className="secondaryButton shortcutButton"
              disabled={selectedLayerZ <= 1}
              onClick={onSelectLayerDown}
            >
              Layer Down
              <span className="toolShortcut">Z</span>
            </button>
            <button type="button" className="secondaryButton" onClick={onAddBottomLayer}>
              + Bottom
            </button>
            <button
              type="button"
              className="secondaryButton"
              disabled={selectedLogicalLevel.layers.length <= 1}
              onClick={onRemoveBottomLayer}
            >
              - Bottom
            </button>
          </div>

          <div className="boardHelpText">Use Q to move up a z-layer and Z to move down.</div>
        </section>
      ) : null}
    </section>
  );
});

const BoardEditorSurface = forwardRef<BoardEditorHandle, BoardEditorSurfaceProps>(
  function BoardEditorSurface(
    {
      statusStore,
      interactionResetToken,
      viewResetToken,
      activeLevel,
      activeDisplayContext,
      selectedLogicalLevel,
      selectedLayerZ,
      spriteSet,
      canvasSpriteCache,
      boardSize,
      showSecrets,
      showConnections,
      showMonsterOrder,
      showValidityWarnings,
      threeDLevelsEnabled,
      experimentalViewportRenderer,
      tool,
      primaryTile,
      secondaryTile,
      selection,
      clipboard,
      pastePreviewActive,
      onSelectionChange,
      onClearMetadataError,
      onSetErrorMessage,
      onCommitSelectedLevelUpdate,
      onApplySelectedLevelTransform,
      onShiftVisibleLevel,
      isTabletLayout,
    },
    ref,
  ) {
    const keyboardPanKeysRef = useRef<Set<string>>(new Set());
    const keyboardPanFrameRef = useRef<number | null>(null);
    const keyboardPanLastTimeRef = useRef<number | null>(null);
    const brushDragFrameRef = useRef<number | null>(null);
    const brushDragPendingPointRef = useRef<GridPoint | null>(null);
    const brushDragStateRef = useRef<BrushDragState | null>(null);
    const brushPreviewReplayKeyRef = useRef<string | null>(null);
    const touchBoardPointsRef = useRef<Map<number, TouchPoint>>(new Map());
    const boardViewportRef = useRef<HTMLDivElement>(null);
    const presentedBoardCanvasRef = useRef<HTMLCanvasElement>(null);
    const boardCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const boardAnnotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const boardStaticOverlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const boardBaseRenderSnapshotRef = useRef<BoardBaseRenderSnapshot>({
      level: null,
      renderKey: null,
      mode: "transient",
      canvasSpriteCache: null,
      boardSize: 0,
    });

    const [pendingConnection, setPendingConnection] = useState<PendingConnectionState>(null);
    const [hoverPoint, setHoverPoint] = useState<GridPoint | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [boardPanState, setBoardPanState] = useState<BoardPanState | null>(null);
    const [boardZoom, setBoardZoom] = useState(1);
    const [boardPan, setBoardPan] = useState({ x: 0, y: 0 });
    const [boardViewportSize, setBoardViewportSize] = useState({ width: 0, height: 0 });
    const [boardViewInitialized, setBoardViewInitialized] = useState(false);
    const [touchGestureState, setTouchGestureState] = useState<TouchGestureState>(null);

    function setHoverPointIfChanged(nextPoint: GridPoint | null): void {
      setHoverPoint((current) => (gridPointsEqual(current, nextPoint) ? current : nextPoint));
    }

    function cancelScheduledBrushDrag(): GridPoint | null {
      const pendingPoint = brushDragPendingPointRef.current;
      brushDragPendingPointRef.current = null;
      if (brushDragFrameRef.current !== null) {
        cancelAnimationFrame(brushDragFrameRef.current);
        brushDragFrameRef.current = null;
      }
      return pendingPoint;
    }

    function scheduleBrushDrag(point: GridPoint): void {
      brushDragPendingPointRef.current = point;
      if (brushDragFrameRef.current !== null) return;

      brushDragFrameRef.current = requestAnimationFrame(() => {
        brushDragFrameRef.current = null;
        const nextPoint = brushDragPendingPointRef.current;
        brushDragPendingPointRef.current = null;
        if (!nextPoint) return;

        const current = brushDragStateRef.current;
        if (!current) return;

        const nextStroke = extendPaintStroke(current.cells, current.lastPoint, nextPoint);
        if (
          nextStroke.dirtyCells.length === 0 &&
          gridPointsEqual(current.lastPoint, nextStroke.lastPoint)
        ) {
          return;
        }

        const nextState: BrushDragState = {
          ...current,
          cells: nextStroke.cells,
          dirtyCells: resolveBrushPreviewDirtyCells(
            nextStroke.cells,
            nextStroke.dirtyCells,
            brushPreviewReplayKeyRef.current !== null,
          ),
          lastPoint: nextStroke.lastPoint,
        };
        brushDragStateRef.current = nextState;

        if (nextStroke.dirtyCells.length === 0) return;

        setDragState((existing) =>
          existing?.tool === "brush" && existing.pointerId === current.pointerId
            ? nextState
            : existing,
        );
      });
    }

    function clearKeyboardPan(): void {
      keyboardPanKeysRef.current.clear();
      if (keyboardPanFrameRef.current !== null) {
        cancelAnimationFrame(keyboardPanFrameRef.current);
        keyboardPanFrameRef.current = null;
      }
      keyboardPanLastTimeRef.current = null;
    }

    function resetBoardView(nextZoom = 1): void {
      const viewport = boardViewportRef.current;
      if (!viewport || boardSize <= 0) return;

      setBoardZoom(nextZoom);
      setBoardPan({
        x: Math.round((viewport.clientWidth - boardSize * nextZoom) / 2),
        y: Math.round((viewport.clientHeight - boardSize * nextZoom) / 2),
      });
    }

    function resetInteractionState(options?: { resetView?: boolean }): void {
      clearKeyboardPan();
      cancelScheduledBrushDrag();
      brushDragStateRef.current = null;
      brushPreviewReplayKeyRef.current = null;
      touchBoardPointsRef.current.clear();
      setPendingConnection(null);
      setHoverPointIfChanged(null);
      setDragState(null);
      setBoardPanState(null);
      setTouchGestureState(null);
      if (options?.resetView) {
        setBoardZoom(1);
        setBoardPan({ x: 0, y: 0 });
        setBoardViewInitialized(false);
      }
    }

    function presentBoardLayers(): void {
      const canvas = presentedBoardCanvasRef.current;
      if (!canvas) return;

      const ctx = getBoardBaseCanvasContext(canvas);
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;

      const layers = [
        boardCanvasRef.current,
        boardAnnotationCanvasRef.current,
        boardStaticOverlayCanvasRef.current,
        overlayCanvasRef.current,
      ];

      if (experimentalViewportRenderer) {
        const viewportWidth = Math.max(1, Math.floor(boardViewportSize.width || boardSize));
        const viewportHeight = Math.max(1, Math.floor(boardViewportSize.height || boardSize));
        ensureCanvasSize(canvas, viewportWidth, viewportHeight);
        drawViewportPresentedBoardLayers(
          ctx,
          viewportWidth,
          viewportHeight,
          layers,
          resolveBoardScreenRect({
            boardSize,
            boardPan,
            boardZoom,
          }),
          boardSize,
        );
        return;
      }

      ensureCanvasSize(canvas, boardSize, boardSize);
      drawPresentedBoardLayers(ctx, boardSize, boardSize, layers);
    }

    useImperativeHandle(
      ref,
      () => ({
        resetInteractionState,
        resetBoardView,
      }),
      [boardSize],
    );

    const boardPanActive = !!boardPanState || !!touchGestureState;
    const isBrushDragging = dragState?.tool === "brush";
    const shouldDrawConnections = showConnections && !isBrushDragging;
    const shouldDrawMonsterOrder = showMonsterOrder;
    const shouldDrawValidityWarnings = showValidityWarnings && !isBrushDragging;

    const previewLevel = useMemo(() => {
      if (!activeLevel || !dragState) return activeLevel;
      if (dragState.tool === "line") {
        return paintLevelLine(
          activeLevel,
          dragState.start,
          dragState.current,
          dragState.tile,
          makePaintOptions(threeDLevelsEnabled, selectedLayerZ, dragState.buryOnBottom),
        );
      }
      return activeLevel;
    }, [activeLevel, dragState, selectedLayerZ, threeDLevelsEnabled]);

    const invalidCellIndices = useMemo(
      () =>
        previewLevel && !isBrushDragging
          ? getInvalidCellIndices(
              previewLevel,
              makePaintOptions(threeDLevelsEnabled, selectedLayerZ),
            )
          : [],
      [isBrushDragging, previewLevel, selectedLayerZ, threeDLevelsEnabled],
    );

    const hoverCellSummary = useMemo(
      () =>
        isBrushDragging
          ? null
          : buildHoverCellSummary(previewLevel, hoverPoint, activeDisplayContext),
      [activeDisplayContext, hoverPoint, isBrushDragging, previewLevel],
    );

    const liveSelection = useMemo(() => {
      if (dragState?.tool !== "select") return selection;
      return normalizeRect(dragState.start, dragState.current);
    }, [dragState, selection]);

    const pastePreview = useMemo(() => {
      if (!pastePreviewActive || tool !== "select" || !clipboard || dragState) return null;
      const anchor = hoverPoint ?? (selection ? { x: selection.x, y: selection.y } : null);
      if (!anchor) return null;

      return {
        x: anchor.x,
        y: anchor.y,
        width: Math.min(clipboard.width, 32 - anchor.x),
        height: Math.min(clipboard.height, 32 - anchor.y),
      };
    }, [clipboard, dragState, hoverPoint, pastePreviewActive, selection, tool]);

    useEffect(() => {
      statusStore.update({
        boardZoom,
        hoverPoint,
        hoverCellSummary,
        hasPendingConnection: !!pendingConnection,
        isBrushDragging,
      });
    }, [boardZoom, hoverCellSummary, hoverPoint, isBrushDragging, pendingConnection, statusStore]);

    useEffect(() => () => statusStore.reset(), [statusStore]);

    useEffect(() => {
      if (dragState?.tool === "brush") return;
      brushDragStateRef.current = null;
      brushPreviewReplayKeyRef.current = null;
      cancelScheduledBrushDrag();
    }, [dragState]);

    useEffect(() => {
      return () => {
        cancelScheduledBrushDrag();
      };
    }, []);

    useEffect(() => {
      if (!activeLevel) {
        clearKeyboardPan();
      }
    }, [activeLevel]);

    useEffect(() => {
      const viewport = boardViewportRef.current;
      if (!viewport) return;

      const syncViewportSize = () => {
        setBoardViewportSize({
          width: viewport.clientWidth,
          height: viewport.clientHeight,
        });
      };

      syncViewportSize();

      const resizeObserver = new ResizeObserver(syncViewportSize);
      resizeObserver.observe(viewport);
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      if (!activeLevel || !spriteSet || boardViewInitialized) return;
      resetBoardView(1);
      setBoardViewInitialized(true);
    }, [activeLevel, boardSize, boardViewInitialized, spriteSet]);

    useEffect(() => {
      resetInteractionState();
    }, [interactionResetToken]);

    useEffect(() => {
      resetInteractionState({ resetView: true });
    }, [viewResetToken]);

    useEffect(() => {
      if (tool === "connect" && activeLevel) return;
      setPendingConnection(null);
    }, [activeLevel, tool]);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (isEditableTarget(event.target) || !activeLevel) return;
        const key = event.key.toLowerCase();
        if (!isKeyboardPanKey(key)) return;

        event.preventDefault();
        keyboardPanKeysRef.current.add(key);
        if (keyboardPanFrameRef.current !== null) return;

        keyboardPanLastTimeRef.current = null;
        keyboardPanFrameRef.current = requestAnimationFrame(function tick(timestamp) {
          const pressedKeys = keyboardPanKeysRef.current;
          if (pressedKeys.size === 0) {
            keyboardPanFrameRef.current = null;
            keyboardPanLastTimeRef.current = null;
            return;
          }

          const lastTimestamp = keyboardPanLastTimeRef.current ?? timestamp;
          const deltaSeconds = Math.max(0, (timestamp - lastTimestamp) / 1000);
          keyboardPanLastTimeRef.current = timestamp;

          let velocityX = 0;
          let velocityY = 0;

          if (pressedKeys.has("a") || pressedKeys.has("arrowleft")) velocityX += 1;
          if (pressedKeys.has("d") || pressedKeys.has("arrowright")) velocityX -= 1;
          if (pressedKeys.has("w") || pressedKeys.has("arrowup")) velocityY += 1;
          if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) velocityY -= 1;

          const magnitude = Math.hypot(velocityX, velocityY);
          if (magnitude > 0) {
            const distance = KEYBOARD_PAN_SPEED * deltaSeconds;
            const stepX = (velocityX / magnitude) * distance;
            const stepY = (velocityY / magnitude) * distance;
            setBoardPan((current) => ({
              x: current.x + stepX,
              y: current.y + stepY,
            }));
          }

          keyboardPanFrameRef.current = requestAnimationFrame(tick);
        });
      };

      const onKeyUp = (event: KeyboardEvent) => {
        keyboardPanKeysRef.current.delete(event.key.toLowerCase());
      };

      window.addEventListener("blur", clearKeyboardPan);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      return () => {
        window.removeEventListener("blur", clearKeyboardPan);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }, [activeLevel]);

    useEffect(() => {
      if (!previewLevel || !spriteSet || !canvasSpriteCache) return;

      try {
        const canvas = getOrCreateInternalCanvas(boardCanvasRef);
        const ctx = getBoardBaseCanvasContext(canvas);
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        const sizeChanged = ensureCanvasSize(canvas, boardSize, boardSize);

        const renderLayerCanvas = (level: DatLevelJson, layerZ: number, layerCount: number) => {
          const displayLevel = createDat3dDisplayLevel(level, {
            threeDEnabled: threeDLevelsEnabled,
            layerZ,
            layerCount,
          });
          const tempCanvas = document.createElement("canvas");
          drawCc1LevelToCanvas(tempCanvas, displayLevel, canvasSpriteCache, { showSecrets });
          return tempCanvas;
        };

        const isTransientBoardRender = threeDLevelsEnabled || previewLevel !== activeLevel;
        const renderKey = [
          activeDisplayContext.threeDEnabled ? "3d" : "2d",
          activeDisplayContext.layerZ,
          activeDisplayContext.layerCount,
          showSecrets ? "secrets" : "plain",
        ].join(":");

        if (threeDLevelsEnabled && selectedLogicalLevel) {
          ctx.clearRect(0, 0, boardSize, boardSize);

          const layerCount = selectedLogicalLevel.layers.length;
          const activeCanvas = renderLayerCanvas(previewLevel, selectedLayerZ, layerCount);
          const viewport = boardViewportRef.current;

          for (let depth = Math.min(THREE_D_STACK_DEPTH, selectedLayerZ - 1); depth >= 1; depth--) {
            const lowerLayer = selectedLogicalLevel.layers[selectedLayerZ - 1 - depth];
            if (!lowerLayer) continue;

            const layerCanvas = renderLayerCanvas(lowerLayer.level, lowerLayer.z, layerCount);
            const metrics = getThreeDLayerDrawMetrics(
              depth,
              boardSize,
              boardPan,
              boardZoom,
              viewport,
            );

            ctx.save();
            ctx.filter = `blur(${depth}px) brightness(${Math.max(0.25, 1 - depth * 0.25)})`;
            ctx.drawImage(
              layerCanvas,
              metrics.offsetX,
              metrics.offsetY,
              metrics.width,
              metrics.height,
            );
            ctx.restore();
          }

          ctx.drawImage(activeCanvas, 0, 0);
        } else if (activeLevel) {
          const previousSnapshot = boardBaseRenderSnapshotRef.current;
          const redrawPlan = resolveBoardTileRedrawPlan(previousSnapshot.level, activeLevel, {
            canReuseCanvas:
              !sizeChanged &&
              !isTransientBoardRender &&
              previousSnapshot.mode === "committed" &&
              previousSnapshot.renderKey === renderKey &&
              previousSnapshot.canvasSpriteCache === canvasSpriteCache &&
              previousSnapshot.boardSize === boardSize,
            partialThreshold: BOARD_PARTIAL_REDRAW_THRESHOLD,
          });
          const displayLevel = createDat3dDisplayLevel(
            isTransientBoardRender ? previewLevel : activeLevel,
            activeDisplayContext,
          );

          if (redrawPlan.kind === "full") {
            ctx.clearRect(0, 0, boardSize, boardSize);
            drawCc1LevelToContext(ctx, displayLevel, canvasSpriteCache, { showSecrets });
          } else if (redrawPlan.indices.length > 0) {
            drawCc1CellsToContext(ctx, displayLevel, redrawPlan.indices, canvasSpriteCache, {
              showSecrets,
            });
          }
        }

        boardBaseRenderSnapshotRef.current = {
          level: activeLevel,
          renderKey,
          mode: isTransientBoardRender ? "transient" : "committed",
          canvasSpriteCache,
          boardSize,
        };
      } catch (error: unknown) {
        onSetErrorMessage(asErrorMessage(error));
      }
    }, [
      activeDisplayContext,
      activeLevel,
      boardPan,
      boardSize,
      boardZoom,
      previewLevel,
      selectedLayerZ,
      selectedLogicalLevel,
      showSecrets,
      spriteSet,
      canvasSpriteCache,
      threeDLevelsEnabled,
      onSetErrorMessage,
    ]);

    useEffect(() => {
      if (!previewLevel || !spriteSet) return;

      try {
        const canvas = getOrCreateInternalCanvas(boardAnnotationCanvasRef);
        ensureCanvasSize(canvas, boardSize, boardSize);

        const ctx = getOverlayCanvasContext(canvas);
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        ctx.clearRect(0, 0, boardSize, boardSize);

        if (shouldDrawConnections) {
          drawConnections(
            ctx,
            spriteSet.tileSize,
            previewLevel.trapControls,
            previewLevel.cloneControls,
          );
        }

        if (shouldDrawMonsterOrder) {
          drawMonsterOrder(ctx, spriteSet.tileSize, previewLevel.movement);
        }
      } catch (error: unknown) {
        onSetErrorMessage(asErrorMessage(error));
      }
    }, [
      boardSize,
      previewLevel,
      shouldDrawConnections,
      shouldDrawMonsterOrder,
      spriteSet,
      onSetErrorMessage,
    ]);

    useEffect(() => {
      if (!spriteSet) return;

      try {
        const size = spriteSet.tileSize * 32;
        const canvas = getOrCreateInternalCanvas(boardStaticOverlayCanvasRef);
        ensureCanvasSize(canvas, size, size);

        const ctx = getOverlayCanvasContext(canvas);
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        ctx.clearRect(0, 0, size, size);
        if (previewLevel) {
          const visibleGridIndices =
            threeDLevelsEnabled && selectedLayerZ > 1
              ? Array.from({ length: 32 * 32 }, (_, index) => index).filter(
                  (index) =>
                    !isTransparentAirCell(previewLevel, index, selectedLayerZ, threeDLevelsEnabled),
                )
              : null;

          if (visibleGridIndices)
            drawGridForVisibleCells(ctx, spriteSet.tileSize, visibleGridIndices);
          else drawGrid(ctx, spriteSet.tileSize);
        }

        if (shouldDrawValidityWarnings) {
          drawInvalidCells(ctx, spriteSet.tileSize, invalidCellIndices);
        }

        if (
          showSecrets &&
          previewLevel &&
          threeDLevelsEnabled &&
          selectedLogicalLevel &&
          selectedLayerZ > 1
        ) {
          const lowerLayerLevel = selectedLogicalLevel.layers[selectedLayerZ - 2]?.level ?? null;
          if (lowerLayerLevel) {
            drawSecretAirElevatorCells(
              ctx,
              spriteSet.tileSize,
              getAirAboveElevatorIndices(previewLevel, lowerLayerLevel, {
                threeDEnabled: true,
                layerZ: selectedLayerZ,
                layerCount: selectedLogicalLevel.layers.length,
              }),
            );
          }
        }
      } catch (error: unknown) {
        onSetErrorMessage(asErrorMessage(error));
      }
    }, [
      invalidCellIndices,
      previewLevel,
      selectedLayerZ,
      selectedLogicalLevel,
      shouldDrawValidityWarnings,
      showSecrets,
      spriteSet,
      threeDLevelsEnabled,
      onSetErrorMessage,
    ]);

    useEffect(() => {
      if (!spriteSet) return;

      const size = spriteSet.tileSize * 32;
      const canvas = getOrCreateInternalCanvas(overlayCanvasRef);
      ensureCanvasSize(canvas, size, size);

      const ctx = getOverlayCanvasContext(canvas);
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      if (threeDLevelsEnabled && hoverPoint && selectedLogicalLevel && selectedLayerZ > 1) {
        const viewport = boardViewportRef.current;
        const activeLayerMetrics: ThreeDLayerDrawMetrics = {
          offsetX: 0,
          offsetY: 0,
          width: size,
          height: size,
          scaleX: 1,
          scaleY: 1,
        };

        for (let depth = Math.min(THREE_D_STACK_DEPTH, selectedLayerZ - 1); depth >= 1; depth--) {
          const lowerLayer = selectedLogicalLevel.layers[selectedLayerZ - 1 - depth];
          if (!lowerLayer) continue;
          const metrics = getThreeDLayerDrawMetrics(depth, size, boardPan, boardZoom, viewport);
          const clipRegions: ThreeDLayerClipRegion[] = [];
          let isVisibleThroughAir = true;

          for (let layerZ = selectedLayerZ; layerZ > lowerLayer.z; layerZ--) {
            const layerLevel =
              layerZ === selectedLayerZ
                ? previewLevel
                : (selectedLogicalLevel.layers[layerZ - 1]?.level ?? null);
            if (!layerLevel) {
              isVisibleThroughAir = false;
              break;
            }

            const airIndices = Array.from({ length: 32 * 32 }, (_, index) => index).filter(
              (index) => isTransparentAirCell(layerLevel, index, layerZ, threeDLevelsEnabled),
            );
            if (airIndices.length === 0) {
              isVisibleThroughAir = false;
              break;
            }

            clipRegions.push({
              metrics:
                layerZ === selectedLayerZ
                  ? activeLayerMetrics
                  : getThreeDLayerDrawMetrics(
                      selectedLayerZ - layerZ,
                      size,
                      boardPan,
                      boardZoom,
                      viewport,
                    ),
              airIndices,
            });
          }

          if (!isVisibleThroughAir) continue;
          const alpha = Math.max(0.12, 0.34 - depth * 0.07);
          const tint = Math.min(255, 13 + depth * 40);
          const fillTint = Math.min(255, 149 + depth * 18);
          drawLayerAlignedHoverCell(
            ctx,
            spriteSet.tileSize,
            hoverPoint,
            metrics,
            `rgba(${tint}, ${Math.min(255, 140 + depth * 12)}, ${fillTint}, ${alpha * 0.18})`,
            `rgba(${Math.min(255, 170 + depth * 20)}, ${Math.min(255, 220 + depth * 10)}, 255, ${alpha})`,
            clipRegions,
          );
        }
      }

      if (liveSelection) {
        drawRectOverlay(
          ctx,
          spriteSet.tileSize,
          liveSelection,
          "rgba(12, 121, 156, 0.18)",
          "rgba(12, 121, 156, 0.96)",
        );
      }

      if (pastePreview && pastePreview.width > 0 && pastePreview.height > 0) {
        drawRectOverlay(
          ctx,
          spriteSet.tileSize,
          pastePreview,
          "rgba(197, 151, 44, 0.08)",
          "rgba(197, 151, 44, 0.92)",
          true,
        );
      }

      if (!isBrushDragging && hoverPoint) {
        drawRectOverlay(
          ctx,
          spriteSet.tileSize,
          { x: hoverPoint.x, y: hoverPoint.y, width: 1, height: 1 },
          "rgba(0, 0, 0, 0)",
          "rgba(24, 34, 30, 0.82)",
        );
      }

      if (pendingConnection) {
        drawRectOverlay(
          ctx,
          spriteSet.tileSize,
          {
            x: pendingConnection.startIndex % 32,
            y: Math.floor(pendingConnection.startIndex / 32),
            width: 1,
            height: 1,
          },
          "rgba(196, 55, 55, 0.12)",
          "rgba(196, 55, 55, 0.96)",
        );
        drawPendingConnection(
          ctx,
          spriteSet.tileSize,
          pendingConnection.startIndex,
          pendingConnection.cursor,
        );
      }

      const brushState = dragState?.tool === "brush" ? dragState : null;
      if (brushState && activeLevel && canvasSpriteCache) {
        drawBrushPreviewCellsToContext(
          ctx,
          canvasSpriteCache,
          activeLevel,
          resolveBrushPreviewRenderCells(brushState.cells, brushState.dirtyCells, true, true),
          brushState,
          activeDisplayContext,
          showSecrets,
        );
      }
    }, [
      activeDisplayContext,
      activeLevel,
      boardPan,
      boardZoom,
      hoverPoint,
      isBrushDragging,
      liveSelection,
      pastePreview,
      pendingConnection,
      previewLevel,
      selectedLayerZ,
      selectedLogicalLevel,
      showSecrets,
      spriteSet,
      canvasSpriteCache,
      threeDLevelsEnabled,
    ]);

    useEffect(() => {
      const brushState = dragState?.tool === "brush" ? dragState : null;
      if (!brushState || !spriteSet || !canvasSpriteCache || !activeLevel) {
        brushPreviewReplayKeyRef.current = null;
        return;
      }

      const canvas = getOrCreateInternalCanvas(overlayCanvasRef);
      const ctx = getOverlayCanvasContext(canvas);
      if (!ctx) return;

      const replayKey = [
        brushState.pointerId,
        activeDisplayContext.threeDEnabled ? "3d" : "2d",
        activeDisplayContext.layerZ,
        activeDisplayContext.layerCount,
        selectedLayerZ,
        showSecrets ? "secrets" : "plain",
        boardPan.x,
        boardPan.y,
        boardZoom,
      ].join(":");
      const previewIndices = resolveBrushPreviewRenderCells(
        brushState.cells,
        brushState.dirtyCells,
        brushPreviewReplayKeyRef.current !== null,
        brushPreviewReplayKeyRef.current !== replayKey,
      );
      if (previewIndices.length === 0) return;

      drawBrushPreviewCellsToContext(
        ctx,
        canvasSpriteCache,
        activeLevel,
        previewIndices,
        brushState,
        activeDisplayContext,
        showSecrets,
      );

      brushPreviewReplayKeyRef.current = replayKey;
    }, [
      activeDisplayContext,
      activeLevel,
      boardPan,
      boardZoom,
      dragState,
      selectedLayerZ,
      showSecrets,
      spriteSet,
      canvasSpriteCache,
      threeDLevelsEnabled,
    ]);

    useEffect(() => {
      if (!spriteSet) return;

      try {
        presentBoardLayers();
      } catch (error: unknown) {
        onSetErrorMessage(asErrorMessage(error));
      }
    }, [
      activeDisplayContext,
      activeLevel,
      boardViewportSize,
      boardPan,
      boardSize,
      boardZoom,
      dragState,
      experimentalViewportRenderer,
      hoverPoint,
      invalidCellIndices,
      liveSelection,
      pastePreview,
      pendingConnection,
      previewLevel,
      selectedLayerZ,
      selectedLogicalLevel,
      shouldDrawConnections,
      shouldDrawMonsterOrder,
      shouldDrawValidityWarnings,
      showSecrets,
      spriteSet,
      canvasSpriteCache,
      threeDLevelsEnabled,
      onSetErrorMessage,
    ]);

    function beginBoardPanGesture(pointerId: number, clientX: number, clientY: number): void {
      setBoardPanState({
        pointerId,
        startClientX: clientX,
        startClientY: clientY,
        startPanX: boardPan.x,
        startPanY: boardPan.y,
      });
      setHoverPointIfChanged(null);
    }

    function beginTouchBoardGesture(): void {
      const entries = Array.from(touchBoardPointsRef.current.entries());
      if (entries.length < 2) return;

      const [firstPointer, secondPointer] = entries;
      if (!firstPointer || !secondPointer) return;
      const [firstPointerId, firstPoint] = firstPointer;
      const [secondPointerId, secondPoint] = secondPointer;
      const startCenter = getTouchCenter(firstPoint, secondPoint);

      setTouchGestureState({
        pointerIds: [firstPointerId, secondPointerId],
        startPanX: boardPan.x,
        startPanY: boardPan.y,
        startZoom: boardZoom,
        startCenterX: startCenter.clientX,
        startCenterY: startCenter.clientY,
        startDistance: Math.max(1, getTouchDistance(firstPoint, secondPoint)),
      });
      setDragState(null);
      setPendingConnection(null);
      setBoardPanState(null);
      setHoverPointIfChanged(null);
    }

    function updateTouchBoardGesture(): void {
      if (!touchGestureState) return;

      const [firstPointerId, secondPointerId] = touchGestureState.pointerIds;
      const firstPoint = touchBoardPointsRef.current.get(firstPointerId);
      const secondPoint = touchBoardPointsRef.current.get(secondPointerId);
      if (!firstPoint || !secondPoint) {
        setTouchGestureState(null);
        return;
      }

      const currentCenter = getTouchCenter(firstPoint, secondPoint);
      const currentDistance = Math.max(1, getTouchDistance(firstPoint, secondPoint));
      const nextZoom = clampNumber(
        touchGestureState.startZoom * (currentDistance / touchGestureState.startDistance),
        0.25,
        6,
      );
      const worldX =
        (touchGestureState.startCenterX - touchGestureState.startPanX) /
        touchGestureState.startZoom;
      const worldY =
        (touchGestureState.startCenterY - touchGestureState.startPanY) /
        touchGestureState.startZoom;

      setBoardZoom(nextZoom);
      setBoardPan({
        x: currentCenter.clientX - worldX * nextZoom,
        y: currentCenter.clientY - worldY * nextZoom,
      });
    }

    function updateBoardPanGesture(clientX: number, clientY: number): void {
      if (!boardPanState) return;
      setBoardPan({
        x: boardPanState.startPanX + (clientX - boardPanState.startClientX),
        y: boardPanState.startPanY + (clientY - boardPanState.startClientY),
      });
    }

    function handleViewportPointerDown(event: React.PointerEvent<HTMLDivElement>): void {
      if (!activeLevel || event.target !== event.currentTarget) return;
      if (event.button !== 0 && !isBoardPanGesture(event.nativeEvent)) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      beginBoardPanGesture(event.pointerId, event.clientX, event.clientY);
    }

    function handleViewportPointerMove(event: React.PointerEvent<HTMLDivElement>): void {
      if (!boardPanState || boardPanState.pointerId !== event.pointerId) return;
      event.preventDefault();
      updateBoardPanGesture(event.clientX, event.clientY);
    }

    function handleViewportPointerUp(event: React.PointerEvent<HTMLDivElement>): void {
      if (!boardPanState || boardPanState.pointerId !== event.pointerId) return;
      event.preventDefault();
      setBoardPanState(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    function handleViewportPointerCancel(event: React.PointerEvent<HTMLDivElement>): void {
      if (!boardPanState || boardPanState.pointerId !== event.pointerId) return;
      setBoardPanState(null);
    }

    function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>): void {
      if (!activeLevel) return;

      const isTabletTouchPointer = isTabletLayout && isTouchPointer(event.nativeEvent);
      if (isTabletTouchPointer) {
        event.currentTarget.setPointerCapture(event.pointerId);
        touchBoardPointsRef.current.set(event.pointerId, {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        if (touchBoardPointsRef.current.size >= 2) {
          event.preventDefault();
          beginTouchBoardGesture();
          return;
        }
      }

      event.preventDefault();

      if (isBoardPanGesture(event.nativeEvent)) {
        event.currentTarget.setPointerCapture(event.pointerId);
        beginBoardPanGesture(event.pointerId, event.clientX, event.clientY);
        return;
      }

      const point = canvasPointToCell(event.currentTarget, event.nativeEvent, {
        boardSize,
        boardPan,
        boardZoom,
        experimentalViewportRenderer,
      });
      const boardPoint = canvasPointToBoard(event.currentTarget, event.nativeEvent, {
        boardSize,
        boardPan,
        boardZoom,
        experimentalViewportRenderer,
      });
      setHoverPointIfChanged(point);
      onClearMetadataError();

      if (tool === "connect") {
        if (event.button !== 0 || !point || !boardPoint) return;

        const index = point.y * 32 + point.x;
        if (!isConnectionEndpointCell(activeLevel, index)) {
          setPendingConnection(null);
          return;
        }

        if (!pendingConnection) {
          setPendingConnection({
            startIndex: index,
            cursor: boardPoint,
          });
          return;
        }

        if (pendingConnection.startIndex !== index) {
          onCommitSelectedLevelUpdate((level) =>
            connectLevelButtons(level, pendingConnection.startIndex, index),
          );
        }

        setPendingConnection(null);
        return;
      }

      if (!isSupportedCanvasPointerButton(event.button) || !point) return;

      if (tool === "fill") {
        onCommitSelectedLevelUpdate((level) =>
          fillLevelArea(
            level,
            point,
            getPaintTileForButton(event.button, primaryTile, secondaryTile),
            makePaintOptions(threeDLevelsEnabled, selectedLayerZ, event.shiftKey),
          ),
        );
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      const dragTile = getPaintTileForButton(event.button, primaryTile, secondaryTile);

      if (tool === "brush") {
        const nextDragState: BrushDragState = {
          tool: "brush",
          pointerId: event.pointerId,
          lastPoint: point,
          cells: [point.y * 32 + point.x],
          dirtyCells: [point.y * 32 + point.x],
          tile: dragTile,
          buryOnBottom: event.shiftKey,
        };
        brushPreviewReplayKeyRef.current = null;
        brushDragStateRef.current = nextDragState;
        const interactionCanvas = getOrCreateInternalCanvas(overlayCanvasRef);
        const ctx = getOverlayCanvasContext(interactionCanvas);
        if (ctx && canvasSpriteCache) {
          drawBrushPreviewCellsToContext(
            ctx,
            canvasSpriteCache,
            activeLevel,
            nextDragState.cells,
            nextDragState,
            activeDisplayContext,
            showSecrets,
          );
          presentBoardLayers();
        }
        setDragState(nextDragState);
      } else if (tool === "line") {
        brushDragStateRef.current = null;
        setDragState({
          tool: "line",
          pointerId: event.pointerId,
          start: point,
          current: point,
          tile: dragTile,
          buryOnBottom: event.shiftKey,
        });
      } else {
        brushDragStateRef.current = null;
        setDragState({
          tool: "select",
          pointerId: event.pointerId,
          start: point,
          current: point,
        });
      }
    }

    function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>): void {
      const isTrackedTabletTouch =
        isTabletLayout &&
        isTouchPointer(event.nativeEvent) &&
        touchBoardPointsRef.current.has(event.pointerId);
      if (isTrackedTabletTouch) {
        touchBoardPointsRef.current.set(event.pointerId, {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        if (touchGestureState) {
          event.preventDefault();
          setHoverPointIfChanged(null);
          updateTouchBoardGesture();
          return;
        }
      }

      if (boardPanState && boardPanState.pointerId === event.pointerId) {
        event.preventDefault();
        setHoverPointIfChanged(null);
        updateBoardPanGesture(event.clientX, event.clientY);
        return;
      }

      const point = canvasPointToCell(event.currentTarget, event.nativeEvent, {
        boardSize,
        boardPan,
        boardZoom,
        experimentalViewportRenderer,
      });
      const boardPoint = canvasPointToBoard(event.currentTarget, event.nativeEvent, {
        boardSize,
        boardPan,
        boardZoom,
        experimentalViewportRenderer,
      });
      if (dragState?.tool === "brush") setHoverPointIfChanged(null);
      else setHoverPointIfChanged(point);

      if (tool === "connect" && pendingConnection && boardPoint) {
        setPendingConnection((current) =>
          current
            ? {
                ...current,
                cursor: boardPoint,
              }
            : current,
        );
      }

      if (!point || !dragState || dragState.pointerId !== event.pointerId) return;

      if (dragState.tool === "brush") {
        const currentBrushState = brushDragStateRef.current ?? dragState;
        if (gridPointsEqual(currentBrushState.lastPoint, point)) return;
        scheduleBrushDrag(point);
        return;
      }

      if (gridPointsEqual(dragState.current, point)) return;
      setDragState({
        ...dragState,
        current: point,
      });
    }

    function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>): void {
      const isTrackedTabletTouch =
        isTabletLayout &&
        isTouchPointer(event.nativeEvent) &&
        touchBoardPointsRef.current.has(event.pointerId);
      if (touchGestureState && isTrackedTabletTouch) {
        event.preventDefault();
        touchBoardPointsRef.current.delete(event.pointerId);
        setTouchGestureState(null);
        setHoverPointIfChanged(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
      if (isTrackedTabletTouch) {
        touchBoardPointsRef.current.delete(event.pointerId);
      }

      if (boardPanState && boardPanState.pointerId === event.pointerId) {
        event.preventDefault();
        setBoardPanState(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }

      if (tool === "connect") {
        if (isTrackedTabletTouch) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }

      const activeBrushDragState =
        brushDragStateRef.current?.pointerId === event.pointerId
          ? brushDragStateRef.current
          : dragState?.tool === "brush" && dragState.pointerId === event.pointerId
            ? dragState
            : null;
      const activeDragState = activeBrushDragState ?? dragState;

      if (!activeDragState || activeDragState.pointerId !== event.pointerId) {
        if (isTrackedTabletTouch) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }
      event.preventDefault();

      const point = canvasPointToCell(event.currentTarget, event.nativeEvent, {
        boardSize,
        boardPan,
        boardZoom,
        experimentalViewportRenderer,
      });

      if (activeDragState.tool === "brush") {
        const pendingBrushPoint = cancelScheduledBrushDrag();
        const finalPoint = point ?? pendingBrushPoint ?? activeDragState.lastPoint;
        const finalCells = extendPaintStroke(
          activeDragState.cells,
          activeDragState.lastPoint,
          finalPoint,
        ).cells;
        onCommitSelectedLevelUpdate((level) =>
          paintLevelCells(
            level,
            finalCells,
            activeDragState.tile,
            makePaintOptions(threeDLevelsEnabled, selectedLayerZ, activeDragState.buryOnBottom),
          ),
        );
        brushDragStateRef.current = null;
        brushPreviewReplayKeyRef.current = null;
        setHoverPointIfChanged(finalPoint);
      } else if (activeDragState.tool === "line") {
        onCommitSelectedLevelUpdate((level) =>
          paintLevelLine(
            level,
            activeDragState.start,
            point ?? activeDragState.current,
            activeDragState.tile,
            makePaintOptions(threeDLevelsEnabled, selectedLayerZ, activeDragState.buryOnBottom),
          ),
        );
      } else {
        onSelectionChange(normalizeRect(activeDragState.start, point ?? activeDragState.current));
      }

      setDragState(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    function handlePointerCancel(event: React.PointerEvent<HTMLCanvasElement>): void {
      const isTrackedTabletTouch =
        isTabletLayout &&
        isTouchPointer(event.nativeEvent) &&
        touchBoardPointsRef.current.has(event.pointerId);
      if (isTrackedTabletTouch) {
        touchBoardPointsRef.current.delete(event.pointerId);
        if (touchGestureState) {
          setTouchGestureState(null);
          cancelScheduledBrushDrag();
          brushDragStateRef.current = null;
          brushPreviewReplayKeyRef.current = null;
          setHoverPointIfChanged(null);
          return;
        }
      }

      if (boardPanState && boardPanState.pointerId === event.pointerId) {
        setBoardPanState(null);
        setHoverPointIfChanged(null);
        return;
      }

      if (tool === "connect") {
        if (isTrackedTabletTouch) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }

      const activeBrushDragState =
        brushDragStateRef.current?.pointerId === event.pointerId
          ? brushDragStateRef.current
          : dragState?.tool === "brush" && dragState.pointerId === event.pointerId
            ? dragState
            : null;
      const activeDragState = activeBrushDragState ?? dragState;

      if (!activeDragState || activeDragState.pointerId !== event.pointerId) {
        if (isTrackedTabletTouch) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }
      cancelScheduledBrushDrag();
      brushDragStateRef.current = null;
      brushPreviewReplayKeyRef.current = null;
      setDragState(null);
      setHoverPointIfChanged(null);
    }

    function handleBoardWheel(event: React.WheelEvent<HTMLDivElement>): void {
      if (!activeLevel || boardSize <= 0) return;
      event.preventDefault();

      const viewport = boardViewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const nextZoom = clampNumber(boardZoom * Math.exp(-event.deltaY * 0.0015), 0.25, 6);
      if (Math.abs(nextZoom - boardZoom) < 0.001) return;

      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const worldX = (pointerX - boardPan.x) / boardZoom;
      const worldY = (pointerY - boardPan.y) / boardZoom;

      setBoardZoom(nextZoom);
      setBoardPan({
        x: pointerX - worldX * nextZoom,
        y: pointerY - worldY * nextZoom,
      });
    }

    const boardScreenRect = resolveBoardScreenRect({
      boardSize,
      boardPan,
      boardZoom,
    });
    const boardChromeFrameStyle = experimentalViewportRenderer
      ? ({
          left: boardScreenRect.x,
          top: boardScreenRect.y,
          width: boardScreenRect.width,
          height: boardScreenRect.height,
        } as CSSProperties)
      : undefined;
    const boardStageTransformStyle = experimentalViewportRenderer
      ? ({
          width: "100%",
          height: "100%",
        } as CSSProperties)
      : ({
          width: boardSize,
          height: boardSize,
          transform: `translate(${boardPan.x}px, ${boardPan.y}px) scale(${boardZoom})`,
        } as CSSProperties);
    const boardStageStyle = experimentalViewportRenderer
      ? ({
          width: "100%",
          height: "100%",
        } as CSSProperties)
      : ({
          width: boardSize,
          height: boardSize,
        } as CSSProperties);
    const boardChrome = (
      <>
        {BOARD_TRANSFORM_BUTTONS.map((button) => (
          <button
            key={button.kind}
            type="button"
            className={`boardTransformButton ${button.position}`}
            aria-label={button.label}
            title={button.label}
            onClick={() => onApplySelectedLevelTransform(button.kind)}
          >
            {renderBoardTransformIcon(button.kind)}
          </button>
        ))}
        {LEVEL_SHIFT_ARROWS.map((arrow) => (
          <button
            key={arrow.direction}
            type="button"
            className={`boardShiftArrow ${arrow.direction}`}
            aria-label={arrow.label}
            title={arrow.label}
            onClick={() => onShiftVisibleLevel(arrow.dx, arrow.dy)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <polygon points="8,3 13,12 3,12" />
            </svg>
          </button>
        ))}
      </>
    );

    return (
      <section className="panel boardPanel">
        <div
          className={`boardViewport ${boardPanActive ? "panning" : ""}`}
          ref={boardViewportRef}
          onWheel={handleBoardWheel}
          onPointerDown={handleViewportPointerDown}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={handleViewportPointerUp}
          onPointerCancel={handleViewportPointerCancel}
        >
          {activeLevel && spriteSet && canvasSpriteCache ? (
            <div
              className={`boardStageTransform ${boardPanActive ? "panning" : ""}`}
              style={boardStageTransformStyle}
            >
              {experimentalViewportRenderer ? null : boardChrome}
              <div className="boardStage" style={boardStageStyle}>
                <canvas
                  ref={presentedBoardCanvasRef}
                  className="boardCanvas overlayCanvas"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  onContextMenu={(event) => event.preventDefault()}
                  onPointerLeave={() => {
                    if (!dragState && !boardPanActive) setHoverPointIfChanged(null);
                  }}
                />
              </div>
              {experimentalViewportRenderer ? (
                <div className="boardChromeFrame" style={boardChromeFrameStyle}>
                  {boardChrome}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="emptyState largeEmptyState">
              Select a level and load the sprite set to edit.
            </div>
          )}
        </div>
      </section>
    );
  },
);

export default function App() {
  const previousThreeDEnabledRef = useRef(false);
  const sessionPersistTimeoutRef = useRef<number | null>(null);
  const latestSessionSnapshotRef = useRef<{
    doc: DatLevelsetJsonV1;
    fileName: string;
    selectedIndex: number;
  } | null>(null);
  const boardEditorRef = useRef<BoardEditorHandle>(null);
  const editorLayoutRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paletteGridRef = useRef<HTMLDivElement>(null);
  const [boardStatusStore] = useState(() => createBoardEditorStatusStore());
  const [initialAppState] = useState(() => createInitialAppState());

  const [editor, setEditor] = useState<LevelsetEditorHistory | null>(initialAppState.editor);
  const [fileName, setFileName] = useState<string>(initialAppState.fileName);

  const [spriteSet, setSpriteSet] = useState<CC1SpriteSet | null>(null);
  const [spriteError, setSpriteError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const [tool, setTool] = useState<ToolMode>("brush");
  const [primaryTile, setPrimaryTile] = useState<string>("WALL");
  const [secondaryTile, setSecondaryTile] = useState<string>("FLOOR");
  const [lastPaletteAssignmentTarget, setLastPaletteAssignmentTarget] =
    useState<PaletteAssignmentTarget>("primary");
  const [paletteQuery, setPaletteQuery] = useState("");
  const deferredPaletteQuery = useDeferredValue(paletteQuery);
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>("levels");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("palette");
  const [paletteTab, setPaletteTab] = useState<PaletteTab>("normal");

  const [selection, setSelection] = useState<GridRect | null>(null);
  const [clipboard, setClipboard] = useState<LevelClipboard | null>(null);
  const [pastePreviewActive, setPastePreviewActive] = useState(false);
  const [layoutResizeState, setLayoutResizeState] = useState<LayoutResizeState | null>(null);
  const [draggedLevelIndex, setDraggedLevelIndex] = useState<number | null>(null);
  const [levelDropState, setLevelDropState] = useState<LevelDropState>(null);
  const [levelContextMenu, setLevelContextMenu] = useState<LevelContextMenuState>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(236);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [boardMenuOpen, setBoardMenuOpen] = useState<
    "file" | "view" | "options" | "transform" | null
  >(null);
  const [openDialog, setOpenDialog] = useState<"brandingHelp" | "threeDHelp" | null>(null);
  const [threeDLevelsEnabled, setThreeDLevelsEnabled] = useState(
    initialAppState.preferences.threeDLevelsEnabled,
  );
  const [experimentalViewportRenderer, setExperimentalViewportRenderer] = useState(
    initialAppState.preferences.experimentalViewportRenderer,
  );
  const [paletteViewportWidth, setPaletteViewportWidth] = useState(0);
  const [paletteTileSizeTarget, setPaletteTileSizeTarget] = useState(MIN_PALETTE_TILE_SIZE);
  const [layoutModePreference, setLayoutModePreference] = useState<LayoutModePreference>(() => {
    if (typeof window === "undefined") return "auto";
    const storedPreference = readLocalStorage(LAYOUT_MODE_PREFERENCE_STORAGE_KEY);
    return isLayoutModePreference(storedPreference) ? storedPreference : "auto";
  });
  const [viewportSize, setViewportSize] = useState<ViewportSize>(() => ({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  }));
  const [hasCoarsePointer, setHasCoarsePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const [hasAnyCoarsePointer, setHasAnyCoarsePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(any-pointer: coarse)").matches,
  );
  const [hasHoverPointer, setHasHoverPointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
  );
  const [hasTouchCapability, setHasTouchCapability] = useState(
    () => typeof navigator !== "undefined" && navigator.maxTouchPoints > 0,
  );
  const [viewSubmenuOpen, setViewSubmenuOpen] = useState<"layout" | null>(null);
  const [tabletDrawerSide, setTabletDrawerSide] = useState<TabletDrawerSide>(null);
  const [paletteAssignmentTarget, setPaletteAssignmentTarget] =
    useState<PaletteAssignmentTarget>("primary");
  const [boardInteractionResetToken, setBoardInteractionResetToken] = useState(0);
  const [boardViewResetToken, setBoardViewResetToken] = useState(0);

  const [showSecrets, setShowSecrets] = useState(initialAppState.preferences.showSecrets);
  const [showConnections, setShowConnections] = useState(
    initialAppState.preferences.showConnections,
  );
  const [showMonsterOrder, setShowMonsterOrder] = useState(
    initialAppState.preferences.showMonsterOrder,
  );
  const [showValidityWarnings, setShowValidityWarnings] = useState(
    initialAppState.preferences.showValidityWarnings,
  );

  const [metadataDraft, setMetadataDraft] = useState<MetadataDraft | null>(null);

  const shortestViewportSide = Math.min(viewportSize.width, viewportSize.height);
  const longestViewportSide = Math.max(viewportSize.width, viewportSize.height);
  const autoTabletLayout =
    (hasCoarsePointer || (hasAnyCoarsePointer && hasTouchCapability)) &&
    !hasHoverPointer &&
    shortestViewportSide >= TABLET_LAYOUT_MIN_VIEWPORT &&
    longestViewportSide <= TABLET_LAYOUT_MAX_VIEWPORT;
  const isTabletLayout =
    layoutModePreference === "tablet"
      ? true
      : layoutModePreference === "desktop"
        ? false
        : autoTabletLayout;
  const isTabletPortrait = isTabletLayout && viewportSize.width < viewportSize.height;

  const doc = editor?.doc ?? null;
  const selectedIndex = editor?.selectedIndex ?? 0;
  const selectedLevel = doc?.levels[selectedIndex] ?? null;
  const logicalLevelset = useMemo(() => (doc ? buildLogical3dLevelset(doc) : null), [doc]);
  const selectedLogicalIndex = logicalLevelset
    ? logicalLevelIndexForRawIndex(logicalLevelset, selectedIndex)
    : 0;
  const selectedLogicalLevel = logicalLevelset?.levels[selectedLogicalIndex] ?? null;
  const selectedLayerZ = selectedLogicalLevel
    ? (selectedLogicalLevel.layers.find((layer) => layer.rawIndex === selectedIndex)?.z ??
      selectedLogicalLevel.layers[selectedLogicalLevel.layers.length - 1]?.z ??
      1)
    : 1;
  const displayedExternalTestLevelNumber = selectedLogicalIndex + 1;
  const singleLevelExternalTestLevel =
    selectedLogicalLevel && selectedLogicalLevel.layers.length === 1
      ? (selectedLogicalLevel.layers[0]?.level ?? null)
      : null;
  const canTestSelectedLevelInLexysLabyrinth = !!doc && !!singleLevelExternalTestLevel;
  const activeLevel = threeDLevelsEnabled
    ? (selectedLogicalLevel?.layers[selectedLayerZ - 1]?.level ?? null)
    : selectedLevel;
  const canonicalLevel = threeDLevelsEnabled
    ? (selectedLogicalLevel?.layers[0]?.level ?? null)
    : selectedLevel;
  const canvasSpriteCache = useMemo(
    () => (spriteSet ? createCanvasSpriteCache(spriteSet) : null),
    [spriteSet],
  );
  const boardSize = spriteSet ? spriteSet.tileSize * 32 : 0;
  const canUndo = (editor?.cursor ?? 0) > 0;
  const canRedo = editor ? editor.cursor < editor.events.length : false;
  const displayedLevelCount = threeDLevelsEnabled
    ? (logicalLevelset?.levels.length ?? 0)
    : (doc?.levels.length ?? 0);
  const canMoveDisplayedLevelUp = threeDLevelsEnabled
    ? selectedLogicalIndex > 0
    : selectedIndex > 0;
  const canMoveDisplayedLevelDown = threeDLevelsEnabled
    ? selectedLogicalIndex < displayedLevelCount - 1
    : selectedIndex < displayedLevelCount - 1;
  const actualChipCount = useMemo(
    () =>
      threeDLevelsEnabled
        ? selectedLogicalLevel
          ? countChipsInLogical3dLevel(selectedLogicalLevel)
          : 0
        : selectedLevel
          ? countChipsInLevel(selectedLevel)
          : 0,
    [selectedLevel, selectedLogicalLevel, threeDLevelsEnabled],
  );

  const chipFieldTone = useMemo(() => {
    if (!metadataDraft) return "neutral";
    const draftChipCount = Number(metadataDraft.chips);
    if (!Number.isFinite(draftChipCount)) return "neutral";
    if (actualChipCount > draftChipCount) return "higher";
    if (actualChipCount < draftChipCount) return "lower";
    return "neutral";
  }, [actualChipCount, metadataDraft]);

  const activeDisplayContext = useMemo(
    () => ({
      threeDEnabled: threeDLevelsEnabled,
      layerZ: selectedLayerZ,
      layerCount: selectedLogicalLevel?.layers.length ?? 1,
    }),
    [selectedLayerZ, selectedLogicalLevel, threeDLevelsEnabled],
  );
  const paletteDisplayContext = useMemo(
    () => ({
      threeDEnabled: threeDLevelsEnabled,
      layerZ: threeDLevelsEnabled ? Math.max(2, selectedLayerZ) : selectedLayerZ,
      layerCount: threeDLevelsEnabled
        ? Math.max(2, selectedLogicalLevel?.layers.length ?? 1)
        : (selectedLogicalLevel?.layers.length ?? 1),
    }),
    [selectedLayerZ, selectedLogicalLevel, threeDLevelsEnabled],
  );

  const filteredTiles = useMemo(() => {
    const promoted3dTiles = threeDLevelsEnabled ? [DAT_3D_AIR_TILE, "CHIP_EXIT"] : [];
    const sourceTiles =
      paletteTab === "normal"
        ? [...promoted3dTiles, ...CC1_VALID_TILE_NAMES]
        : [
            ...CC1_LEGACY_INVALID_TILE_NAMES.filter(
              (tile) => !threeDLevelsEnabled || (tile !== DAT_3D_AIR_TILE && tile !== "CHIP_EXIT"),
            ),
            ...CC1_INVALID_TILE_NAMES,
          ];
    const query = deferredPaletteQuery.trim().toLowerCase();
    if (query.length === 0) return sourceTiles;
    return sourceTiles.filter((tile) =>
      `${tile} ${getDat3dTileDisplayName(tile, paletteDisplayContext)}`
        .toLowerCase()
        .includes(query),
    );
  }, [deferredPaletteQuery, paletteDisplayContext, paletteTab, threeDLevelsEnabled]);

  const editorLayoutStyle = useMemo(
    () =>
      ({
        "--left-panel-width": `${leftPanelWidth}px`,
        "--right-panel-width": `${rightPanelWidth}px`,
      }) as CSSProperties,
    [leftPanelWidth, rightPanelWidth],
  );
  const appShellClassName = `appShell ${isTabletLayout ? "tabletLayout" : ""} ${isTabletPortrait ? "tabletPortrait" : ""}`;
  const editorLayoutClassName = `editorLayout ${isTabletLayout ? "tabletEditorLayout" : ""} ${tabletDrawerSide ? `tabletDrawerOpen drawer-${tabletDrawerSide}` : ""}`;
  const automaticLayoutLabel = `Automatic Layout (${autoTabletLayout ? "Tablet" : "Desktop"})`;
  const paletteColumnCount = useMemo(() => {
    if (paletteViewportWidth <= 0) return 4;
    return Math.max(1, Math.floor(paletteViewportWidth / paletteTileSizeTarget));
  }, [paletteTileSizeTarget, paletteViewportWidth]);
  const paletteCellSize = useMemo(() => {
    if (paletteViewportWidth <= 0) return paletteTileSizeTarget;
    return Math.max(28, paletteViewportWidth / paletteColumnCount);
  }, [paletteColumnCount, paletteTileSizeTarget, paletteViewportWidth]);
  const paletteGridStyle = useMemo(
    () =>
      ({
        gridTemplateColumns: `repeat(${paletteColumnCount}, minmax(0, 1fr))`,
        gridAutoRows: `${paletteCellSize}px`,
      }) as CSSProperties,
    [paletteCellSize, paletteColumnCount],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const anyCoarsePointerQuery = window.matchMedia("(any-pointer: coarse)");
    const hoverPointerQuery = window.matchMedia("(hover: hover)");
    const updateViewportState = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setHasCoarsePointer(coarsePointerQuery.matches);
      setHasAnyCoarsePointer(anyCoarsePointerQuery.matches);
      setHasHoverPointer(hoverPointerQuery.matches);
      setHasTouchCapability(typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState);
    coarsePointerQuery.addEventListener("change", updateViewportState);
    anyCoarsePointerQuery.addEventListener("change", updateViewportState);
    hoverPointerQuery.addEventListener("change", updateViewportState);
    return () => {
      window.removeEventListener("resize", updateViewportState);
      coarsePointerQuery.removeEventListener("change", updateViewportState);
      anyCoarsePointerQuery.removeEventListener("change", updateViewportState);
      hoverPointerQuery.removeEventListener("change", updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeLocalStorage(LAYOUT_MODE_PREFERENCE_STORAGE_KEY, layoutModePreference);
  }, [layoutModePreference]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeLocalStorage(
      APP_PREFERENCES_STORAGE_KEY,
      serializePersistedAppPreferences({
        showSecrets,
        showConnections,
        showMonsterOrder,
        showValidityWarnings,
        threeDLevelsEnabled,
        experimentalViewportRenderer,
      }),
    );
  }, [
    experimentalViewportRenderer,
    showConnections,
    showMonsterOrder,
    showSecrets,
    showValidityWarnings,
    threeDLevelsEnabled,
  ]);

  useEffect(() => {
    latestSessionSnapshotRef.current = doc
      ? {
          doc,
          fileName,
          selectedIndex,
        }
      : null;
  }, [doc, fileName, selectedIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flushPersistedSession = () => {
      const session = latestSessionSnapshotRef.current;
      if (!session) return;

      if (
        !writeLocalStorage(EDITOR_SESSION_STORAGE_KEY, serializePersistedEditorSession(session))
      ) {
        setErrorMessage("Couldn't save the current levelset locally.");
      }
    };

    window.addEventListener("pagehide", flushPersistedSession);
    return () => {
      window.removeEventListener("pagehide", flushPersistedSession);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !doc) return;

    if (sessionPersistTimeoutRef.current !== null) {
      window.clearTimeout(sessionPersistTimeoutRef.current);
    }

    const persistSession = () => {
      if (
        !writeLocalStorage(
          EDITOR_SESSION_STORAGE_KEY,
          serializePersistedEditorSession({
            doc,
            fileName,
            selectedIndex,
          }),
        )
      ) {
        setErrorMessage("Couldn't save the current levelset locally.");
      }
      sessionPersistTimeoutRef.current = null;
    };

    sessionPersistTimeoutRef.current = window.setTimeout(
      persistSession,
      DOCUMENT_PERSIST_DEBOUNCE_MS,
    );

    return () => {
      if (sessionPersistTimeoutRef.current !== null) {
        window.clearTimeout(sessionPersistTimeoutRef.current);
      }
    };
  }, [doc, fileName, selectedIndex]);

  useEffect(() => {
    if (isTabletLayout) return;
    setTabletDrawerSide(null);
    setPaletteAssignmentTarget("primary");
  }, [isTabletLayout]);

  useEffect(() => {
    if (!isTabletLayout) return;
    setPaletteTileSizeTarget((current) => Math.max(current, 56));
  }, [isTabletLayout]);

  useEffect(() => {
    if (!tabletDrawerSide) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setTabletDrawerSide(null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [tabletDrawerSide]);

  function loadDocument(nextDoc: DatLevelsetJsonV1, nextFileName?: string | null): void {
    setEditor(createLevelsetEditorHistory(nextDoc));
    setFileName(nextFileName ?? fileName);
    setSelection(null);
    setLayoutResizeState(null);
    setDraggedLevelIndex(null);
    setLevelDropState(null);
    setLevelContextMenu(null);
    setBoardMenuOpen(null);
    setBoardInteractionResetToken((current) => current + 1);
    setBoardViewResetToken((current) => current + 1);
    setMetadataDraft(null);
    setErrorMessage(null);
    setMetadataError(null);
  }

  function commitEvent(event: Parameters<typeof commitLevelsetEvent>[1]): void {
    setEditor((current) => (current ? commitLevelsetEvent(current, event) : current));
    setErrorMessage(null);
  }

  function commitSelectedLevelUpdate(updater: (level: DatLevelJson) => DatLevelJson): void {
    setEditor((current) => {
      if (!current) return current;
      const level = current.doc.levels[current.selectedIndex];
      if (!level) return current;

      const nextLevel = updater(level);
      if (nextLevel === level) return current;

      return commitLevelsetEvent(current, {
        type: "replace-level",
        index: current.selectedIndex,
        level: nextLevel,
      });
    });
    setErrorMessage(null);
  }

  function replaceDocument(nextDoc: DatLevelsetJsonV1, nextSelectedRawIndex = 0): void {
    commitEvent({
      type: "replace-doc",
      doc: nextDoc,
      selectedIndex: nextSelectedRawIndex,
    });
  }

  function cloneEditableGroup(group: Editable3dLevel): Editable3dLevel {
    return {
      ...group,
      layers: group.layers.map(cloneDatLevel),
    };
  }

  function commitLogicalLevelsetUpdate(
    updater: (groups: Editable3dLevel[]) => Readonly<{
      groups: Editable3dLevel[];
      selectedLogicalIndex?: number;
      selectedLayerZ?: number;
    }> | null,
  ): void {
    if (!doc) return;

    const groups = editable3dLevelsFromDoc(doc).map(cloneEditableGroup);
    const nextState = updater(groups);
    if (!nextState) return;

    const nextDoc = rawDocFromEditable3dLevels(doc.magicNumber, nextState.groups, {
      numberMode: "slot",
    });
    const nextLogical = buildLogical3dLevelset(nextDoc);
    const nextLogicalIndex = clampNumber(
      nextState.selectedLogicalIndex ?? selectedLogicalIndex,
      0,
      Math.max(0, nextLogical.levels.length - 1),
    );
    const nextLogicalLevel = nextLogical.levels[nextLogicalIndex];
    const nextLayerZ = nextLogicalLevel
      ? clampNumber(
          nextState.selectedLayerZ ??
            nextLogicalLevel.layers[nextLogicalLevel.layers.length - 1]?.z ??
            1,
          1,
          nextLogicalLevel.layers.length,
        )
      : 1;
    const nextSelectedRawIndex =
      nextLogicalLevel?.layers[nextLayerZ - 1]?.rawIndex ??
      nextLogicalLevel?.layers[0]?.rawIndex ??
      0;

    replaceDocument(nextDoc, nextSelectedRawIndex);
  }

  function openLevelsetJsonText(text: string, nextFileName?: string | null): void {
    try {
      const parsed = parseDatLevelsetJsonV1(JSON.parse(text));
      loadDocument(parsed, nextFileName);
    } catch (error: unknown) {
      setErrorMessage(asErrorMessage(error));
    }
  }

  async function openJson(file: File): Promise<void> {
    openLevelsetJsonText(await file.text(), file.name);
  }

  async function openDat(file: File): Promise<void> {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      loadDocument(decodeDatBytes(bytes), file.name);
    } catch (error: unknown) {
      setErrorMessage(asErrorMessage(error));
    }
  }

  function chooseRawLevel(index: number): void {
    setEditor((current) => (current ? selectLevelInHistory(current, index) : current));
    setSelection(null);
    setBoardInteractionResetToken((current) => current + 1);
    setLevelContextMenu(null);
    setMetadataError(null);
  }

  function chooseLogicalLevel(logicalIndex: number): void {
    if (!logicalLevelset) return;
    const clampedIndex = clampNumber(
      logicalIndex,
      0,
      Math.max(0, logicalLevelset.levels.length - 1),
    );
    const logicalLevel = logicalLevelset.levels[clampedIndex];
    if (!logicalLevel) return;
    const topLayer = logicalLevel.layers[logicalLevel.layers.length - 1] ?? logicalLevel.layers[0];
    if (!topLayer) return;
    chooseRawLevel(topLayer.rawIndex);
  }

  function selectLayerUp(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel) return;
    const nextLayer = selectedLogicalLevel.layers[selectedLayerZ] ?? null;
    if (nextLayer) chooseRawLevel(nextLayer.rawIndex);
  }

  function selectLayerDown(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel) return;
    const nextLayer = selectedLogicalLevel.layers[selectedLayerZ - 2] ?? null;
    if (nextLayer) chooseRawLevel(nextLayer.rawIndex);
  }

  function choosePreviousLevelInList(): void {
    if (threeDLevelsEnabled) {
      if (!logicalLevelset || selectedLogicalIndex <= 0) return;
      chooseLogicalLevel(selectedLogicalIndex - 1);
      return;
    }

    if (!doc || selectedIndex <= 0) return;
    chooseRawLevel(selectedIndex - 1);
  }

  function chooseNextLevelInList(): void {
    if (threeDLevelsEnabled) {
      const logicalLevelCount = logicalLevelset?.levels.length ?? 0;
      if (logicalLevelCount <= 0 || selectedLogicalIndex >= logicalLevelCount - 1) return;
      chooseLogicalLevel(selectedLogicalIndex + 1);
      return;
    }

    const rawLevelCount = doc?.levels.length ?? 0;
    if (rawLevelCount <= 0 || selectedIndex >= rawLevelCount - 1) return;
    chooseRawLevel(selectedIndex + 1);
  }

  function updateMetadataDraft<K extends keyof MetadataDraft>(
    field: K,
    value: MetadataDraft[K],
  ): void {
    setMetadataDraft((current) => (current ? { ...current, [field]: value } : current));
    setMetadataError(null);
  }

  function applyMetadataDraft(nextDraft = metadataDraft): void {
    if (!doc || !activeLevel || !canonicalLevel || !nextDraft) return;
    const currentDraft = makeMetadataDraft(
      canonicalLevel,
      activeLevel,
      threeDLevelsEnabled ? selectedLogicalIndex + 1 : activeLevel.number,
      threeDLevelsEnabled ? selectedLogicalLevel?.displayTitle : canonicalLevel.title,
    );
    if (metadataDraftEquals(nextDraft, currentDraft)) {
      setMetadataError(null);
      return;
    }

    try {
      if (threeDLevelsEnabled && selectedLogicalLevel) {
        const parsed = parseThreeDLevelsFromDraft(
          canonicalLevel,
          activeLevel,
          nextDraft,
          doc.magicNumber,
          selectedLayerZ === 1,
        );
        commitLogicalLevelsetUpdate((groups) => {
          const nextGroups = [...groups];
          const group = cloneEditableGroup(nextGroups[selectedLogicalIndex]!);
          const nextLayers = [...group.layers];
          nextLayers[0] =
            selectedLayerZ === 1
              ? parsed.canonicalLevel
              : cloneCanonicalMetadata(parsed.canonicalLevel, nextLayers[0]!);
          if (selectedLayerZ > 1) {
            nextLayers[selectedLayerZ - 1] = parsed.activeLayerLevel;
          }
          nextGroups[selectedLogicalIndex] = {
            ...group,
            baseTitle: blankToUndefined(nextDraft.title) ?? "",
            displayTitle: blankToUndefined(nextDraft.title) ?? "",
            uses3dEncoding: group.uses3dEncoding || nextLayers.length > 1,
            layers: nextLayers,
          };
          return {
            groups: nextGroups,
            selectedLogicalIndex,
            selectedLayerZ,
          };
        });
      } else {
        const nextLevel = parseLevelFromDraft(activeLevel, nextDraft, doc.magicNumber);
        commitEvent({
          type: "replace-level",
          index: selectedIndex,
          level: nextLevel,
        });
      }
      setMetadataError(null);
    } catch (error: unknown) {
      setMetadataError(asErrorMessage(error));
    }
  }

  function addLevelAfterSelection(): void {
    if (!doc) return;

    if (threeDLevelsEnabled) {
      commitLogicalLevelsetUpdate((groups) => {
        const insertAt = selectedLogicalLevel ? selectedLogicalIndex + 1 : groups.length;
        const title = `Level ${insertAt + 1}`;
        const nextGroups = [...groups];
        nextGroups.splice(insertAt, 0, {
          baseTitle: title,
          displayTitle: title,
          uses3dEncoding: false,
          layers: [createEmptyLevel(insertAt + 1, { title })],
        });
        return {
          groups: nextGroups,
          selectedLogicalIndex: insertAt,
          selectedLayerZ: 1,
        };
      });
      return;
    }

    const nextNumber = doc.levels.reduce((max, level) => Math.max(max, level.number), 0) + 1;
    const insertAt = selectedLevel ? selectedIndex + 1 : doc.levels.length;

    commitEvent({
      type: "insert-level",
      index: insertAt,
      level: createEmptyLevel(nextNumber),
    });
  }

  function duplicateLevelAt(index: number): void {
    if (!doc) return;

    if (threeDLevelsEnabled) {
      commitLogicalLevelsetUpdate((groups) => {
        const source = groups[index];
        if (!source) return null;
        const copyTitle = `${source.displayTitle || source.baseTitle} Copy`;
        const nextGroups = [...groups];
        const nextLayers = source.layers.map(cloneDatLevel);
        nextLayers[0] = {
          ...nextLayers[0]!,
          password: createRandomLevelPassword(),
        };
        nextGroups.splice(index + 1, 0, {
          baseTitle: copyTitle,
          displayTitle: copyTitle,
          uses3dEncoding: source.uses3dEncoding || source.layers.length > 1,
          layers: nextLayers,
        });
        return {
          groups: nextGroups,
          selectedLogicalIndex: index + 1,
          selectedLayerZ: nextLayers.length,
        };
      });
      return;
    }

    const sourceLevel = doc.levels[index];
    if (!sourceLevel) return;

    const nextNumber = doc.levels.reduce((max, level) => Math.max(max, level.number), 0) + 1;
    commitEvent({
      type: "insert-level",
      index: index + 1,
      level: cloneLevel(sourceLevel, nextNumber),
    });
  }

  function deleteLevelAt(index: number): void {
    if (!doc) return;

    if (threeDLevelsEnabled) {
      commitLogicalLevelsetUpdate((groups) => {
        if (!groups[index]) return null;
        const nextGroups = [...groups];
        nextGroups.splice(index, 1);
        return {
          groups: nextGroups,
          selectedLogicalIndex: Math.max(0, index - 1),
          selectedLayerZ: 1,
        };
      });
      return;
    }

    if (!doc.levels[index]) return;
    commitEvent({ type: "remove-level", index });
  }

  function addTopLayer(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel) return;
    commitLogicalLevelsetUpdate((groups) => {
      const nextGroups = [...groups];
      nextGroups[selectedLogicalIndex] = withInsertedTopLayer(
        cloneEditableGroup(nextGroups[selectedLogicalIndex]!),
      );
      return {
        groups: nextGroups,
        selectedLogicalIndex,
        selectedLayerZ: nextGroups[selectedLogicalIndex]!.layers.length,
      };
    });
  }

  function addBottomLayer(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel) return;
    commitLogicalLevelsetUpdate((groups) => {
      const nextGroups = [...groups];
      nextGroups[selectedLogicalIndex] = withInsertedBottomLayer(
        cloneEditableGroup(nextGroups[selectedLogicalIndex]!),
      );
      return {
        groups: nextGroups,
        selectedLogicalIndex,
        selectedLayerZ: selectedLayerZ + 1,
      };
    });
  }

  function removeTopLayer(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel || selectedLogicalLevel.layers.length <= 1)
      return;
    commitLogicalLevelsetUpdate((groups) => {
      const nextGroups = [...groups];
      nextGroups[selectedLogicalIndex] = withRemovedTopLayer(
        cloneEditableGroup(nextGroups[selectedLogicalIndex]!),
      );
      return {
        groups: nextGroups,
        selectedLogicalIndex,
        selectedLayerZ: Math.min(selectedLayerZ, nextGroups[selectedLogicalIndex]!.layers.length),
      };
    });
  }

  function removeBottomLayer(): void {
    if (!threeDLevelsEnabled || !selectedLogicalLevel || selectedLogicalLevel.layers.length <= 1)
      return;
    commitLogicalLevelsetUpdate((groups) => {
      const nextGroups = [...groups];
      nextGroups[selectedLogicalIndex] = withRemovedBottomLayer(
        cloneEditableGroup(nextGroups[selectedLogicalIndex]!),
      );
      return {
        groups: nextGroups,
        selectedLogicalIndex,
        selectedLayerZ: Math.max(1, selectedLayerZ - 1),
      };
    });
  }

  function copySelection(): void {
    if (!activeLevel || !selection) return;
    setClipboard(copyLevelRegion(activeLevel, selection));
    setPastePreviewActive(true);
  }

  function pasteClipboard(): void {
    if (!activeLevel || !clipboard) return;
    const anchor = getPasteAnchor(selection, boardStatusStore.getSnapshot().hoverPoint);
    setPastePreviewActive(true);
    commitSelectedLevelUpdate((level) => pasteLevelRegion(level, anchor, clipboard));
    setSelection({
      x: anchor.x,
      y: anchor.y,
      width: Math.min(clipboard.width, 32 - anchor.x),
      height: Math.min(clipboard.height, 32 - anchor.y),
    });
  }

  function eraseSelection(): void {
    if (!activeLevel || !selection) return;
    const indices: number[] = [];
    for (let y = 0; y < selection.height; y++) {
      for (let x = 0; x < selection.width; x++) {
        indices.push((selection.y + y) * 32 + selection.x + x);
      }
    }
    commitSelectedLevelUpdate((level) => paintLevelCells(level, indices, "FLOOR"));
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const nextSpriteSet = await loadCc1SpriteSet(CC1_TILESET_URL);
        if (cancelled) return;
        setSpriteSet(nextSpriteSet);
        setSpriteError(null);
      } catch (error: unknown) {
        if (cancelled) return;
        setSpriteSet(null);
        setSpriteError(
          `CC1 tileset not loaded.\nExpected: web/public/cc1/spritesheet.bmp\nTried URL: ${CC1_TILESET_URL}\nError: ${asErrorMessage(error)}`,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMetadataDraft(
      canonicalLevel && activeLevel
        ? makeMetadataDraft(
            canonicalLevel,
            activeLevel,
            threeDLevelsEnabled ? selectedLogicalIndex + 1 : canonicalLevel.number,
            threeDLevelsEnabled ? selectedLogicalLevel?.displayTitle : canonicalLevel.title,
          )
        : null,
    );
    setMetadataError(null);
  }, [
    activeLevel,
    canonicalLevel,
    selectedLogicalIndex,
    selectedLogicalLevel,
    threeDLevelsEnabled,
  ]);

  useEffect(() => {
    if (!logicalLevelset) {
      previousThreeDEnabledRef.current = threeDLevelsEnabled;
      return;
    }

    const toggledOn = threeDLevelsEnabled && !previousThreeDEnabledRef.current;
    previousThreeDEnabledRef.current = threeDLevelsEnabled;
    if (!toggledOn) return;

    const logicalLevel = getLogical3dLevelForRawIndex(logicalLevelset, selectedIndex);
    const topLayer =
      logicalLevel?.layers[logicalLevel.layers.length - 1] ?? logicalLevel?.layers[0];
    if (!topLayer || topLayer.rawIndex === selectedIndex) return;
    chooseRawLevel(topLayer.rawIndex);
  }, [logicalLevelset, selectedIndex, threeDLevelsEnabled]);

  useEffect(() => {
    if (tool === "select") return;
    setPastePreviewActive(false);
  }, [tool]);

  useEffect(() => {
    const paletteGrid = paletteGridRef.current;
    if (!paletteGrid) return;

    const syncPaletteWidth = () => {
      setPaletteViewportWidth(paletteGrid.clientWidth);
    };

    syncPaletteWidth();

    const resizeObserver = new ResizeObserver(syncPaletteWidth);
    resizeObserver.observe(paletteGrid);
    return () => {
      resizeObserver.disconnect();
    };
  }, [inspectorTab, paletteTab]);

  useEffect(() => {
    if (!layoutResizeState) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== layoutResizeState.pointerId) return;

      const editorWidth = editorLayoutRef.current?.clientWidth ?? window.innerWidth;
      const deltaX = event.clientX - layoutResizeState.startClientX;

      if (layoutResizeState.side === "left") {
        const maxWidth = Math.min(
          MAX_LEFT_PANEL_WIDTH,
          editorWidth - rightPanelWidth - SPLITTER_WIDTH * 2 - MIN_BOARD_COLUMN_WIDTH,
        );
        setLeftPanelWidth(
          clampNumber(layoutResizeState.startWidth + deltaX, MIN_LEFT_PANEL_WIDTH, maxWidth),
        );
        return;
      }

      const maxWidth = Math.min(
        MAX_RIGHT_PANEL_WIDTH,
        editorWidth - leftPanelWidth - SPLITTER_WIDTH * 2 - MIN_BOARD_COLUMN_WIDTH,
      );
      setRightPanelWidth(
        clampNumber(layoutResizeState.startWidth - deltaX, MIN_RIGHT_PANEL_WIDTH, maxWidth),
      );
    };

    const stopResize = (event: PointerEvent) => {
      if (event.pointerId !== layoutResizeState.pointerId) return;
      setLayoutResizeState(null);
    };

    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", stopResize);
    document.addEventListener("pointercancel", stopResize);
    return () => {
      document.body.style.userSelect = "";
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", stopResize);
      document.removeEventListener("pointercancel", stopResize);
    };
  }, [layoutResizeState, leftPanelWidth, rightPanelWidth]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const meta = event.metaKey || event.ctrlKey;

      if (meta && !event.altKey) {
        if (!event.shiftKey && key === "z") {
          event.preventDefault();
          setEditor((current) => (current ? undoLevelsetEvent(current) : current));
          return;
        }

        if ((event.shiftKey && key === "z") || key === "y") {
          event.preventDefault();
          setEditor((current) => (current ? redoLevelsetEvent(current) : current));
          return;
        }

        if (key === "c" && selection) {
          event.preventDefault();
          copySelection();
          return;
        }

        if (key === "v" && clipboard) {
          event.preventDefault();
          pasteClipboard();
          return;
        }

        if (key === "5") {
          event.preventDefault();
          if (doc) openSelectedLevelInTworld("MS");
          return;
        }

        if (key === "6") {
          event.preventDefault();
          if (doc) openSelectedLevelInTworld("Lynx");
          return;
        }

        if (key === "7") {
          event.preventDefault();
          if (canTestSelectedLevelInLexysLabyrinth) openSelectedLevelInLexysLabyrinth();
          return;
        }

        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (key === "f5") {
        event.preventDefault();
        if (doc) openSelectedLevelInTworld("MS");
        return;
      }

      if (key === "f6") {
        event.preventDefault();
        if (doc) openSelectedLevelInTworld("Lynx");
        return;
      }

      if (key === "f7") {
        event.preventDefault();
        if (canTestSelectedLevelInLexysLabyrinth) openSelectedLevelInLexysLabyrinth();
        return;
      }

      if (key === "n") {
        event.preventDefault();
        chooseNextLevelInList();
        return;
      }

      if (key === "p") {
        event.preventDefault();
        choosePreviousLevelInList();
        return;
      }

      if (key === "<" || key === ",") {
        event.preventDefault();
        rotateSelectedPaletteTile("counterclockwise");
        return;
      }

      if (key === ">" || key === ".") {
        event.preventDefault();
        rotateSelectedPaletteTile("clockwise");
        return;
      }

      if (key === "escape" && boardStatusStore.getSnapshot().hasPendingConnection) {
        event.preventDefault();
        setBoardInteractionResetToken((current) => current + 1);
        return;
      }

      if (key === "escape" && tool === "select") {
        event.preventDefault();
        setBoardInteractionResetToken((current) => current + 1);
        setSelection(null);
        setPastePreviewActive(false);
        return;
      }

      if (threeDLevelsEnabled && selectedLogicalLevel && key === "q") {
        event.preventDefault();
        selectLayerUp();
      } else if (threeDLevelsEnabled && selectedLogicalLevel && key === "z") {
        event.preventDefault();
        selectLayerDown();
      } else if (key === "b") setTool("brush");
      else if (key === "c") setTool("connect");
      else if (key === "l") setTool("line");
      else if (key === "f") setTool("fill");
      else if (key === "v") setTool("select");
      else if ((key === "backspace" || key === "delete") && selection) {
        event.preventDefault();
        eraseSelection();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    boardStatusStore,
    clipboard,
    canTestSelectedLevelInLexysLabyrinth,
    doc,
    displayedExternalTestLevelNumber,
    fileName,
    isTabletLayout,
    lastPaletteAssignmentTarget,
    paletteAssignmentTarget,
    primaryTile,
    secondaryTile,
    selection,
    selectedLogicalLevel,
    threeDLevelsEnabled,
    tool,
  ]);

  useEffect(() => {
    if (!levelContextMenu) return;

    const close = () => setLevelContextMenu(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [levelContextMenu]);

  useEffect(() => {
    if (!boardMenuOpen) return;

    const close = () => setBoardMenuOpen(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [boardMenuOpen]);

  useEffect(() => {
    if (boardMenuOpen === "view") return;
    setViewSubmenuOpen(null);
  }, [boardMenuOpen]);

  useEffect(() => {
    if (!openDialog) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDialog(null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDialog]);

  function beginLayoutResize(
    event: React.PointerEvent<HTMLDivElement>,
    side: "left" | "right",
  ): void {
    event.preventDefault();
    setLayoutResizeState({
      side,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startWidth: side === "left" ? leftPanelWidth : rightPanelWidth,
    });
  }

  function toggleBoardMenu(menu: "file" | "view" | "options" | "transform"): void {
    setBoardMenuOpen((current) => (current === menu ? null : menu));
  }

  function toggleViewSubmenu(submenu: "layout"): void {
    setViewSubmenuOpen((current) => (current === submenu ? null : submenu));
  }

  function applySelectedLevelTransform(kind: DatTransformKind): void {
    if (!activeLevel) return;

    if (threeDLevelsEnabled && selectedLogicalLevel) {
      commitLogicalLevelsetUpdate((groups) => {
        const group = groups[selectedLogicalIndex];
        if (!group) return null;

        const nextGroups = [...groups];
        nextGroups[selectedLogicalIndex] = {
          ...group,
          layers: group.layers.map((layer) => transformLevel(layer, kind)),
        };

        return {
          groups: nextGroups,
          selectedLogicalIndex,
          selectedLayerZ,
        };
      });
    } else {
      commitSelectedLevelUpdate((level) => transformLevel(level, kind));
    }

    setSelection(null);
    setBoardInteractionResetToken((current) => current + 1);
    setBoardMenuOpen(null);
    setErrorMessage(null);
  }

  function shiftVisibleLevel(dx: number, dy: number): void {
    if (!doc || !activeLevel) return;

    if (threeDLevelsEnabled && selectedLogicalLevel) {
      commitLogicalLevelsetUpdate((groups) => {
        const group = groups[selectedLogicalIndex];
        if (!group) return null;

        const nextGroups = [...groups];
        nextGroups[selectedLogicalIndex] = {
          ...group,
          layers: group.layers.map((layer) => shiftLevelWrap(layer, dx, dy)),
        };

        return {
          groups: nextGroups,
          selectedLogicalIndex,
          selectedLayerZ,
        };
      });
      return;
    }

    commitSelectedLevelUpdate((level) => shiftLevelWrap(level, dx, dy));
  }

  function getLevelCountForDisplay(): number {
    return threeDLevelsEnabled ? (logicalLevelset?.levels.length ?? 0) : (doc?.levels.length ?? 0);
  }

  function getDropInsertionIndex(): number | null {
    if (draggedLevelIndex === null || !levelDropState) return null;
    const levelCount = getLevelCountForDisplay();
    return clampNumber(
      levelDropState.index + (levelDropState.position === "after" ? 1 : 0),
      0,
      levelCount,
    );
  }

  function getReorderedTargetIndex(insertionIndex: number, levelCount: number): number {
    if (draggedLevelIndex === null) return 0;
    const adjusted = insertionIndex > draggedLevelIndex ? insertionIndex - 1 : insertionIndex;
    return clampNumber(adjusted, 0, Math.max(0, levelCount - 1));
  }

  function getLevelDropStateFromList(listElement: HTMLDivElement, clientY: number): LevelDropState {
    const items = Array.from(listElement.querySelectorAll<HTMLElement>(".levelListItem"));
    if (items.length === 0) return null;

    let bestMatch: LevelDropState = { index: 0, position: "before" };
    let bestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const beforeDistance = Math.abs(clientY - rect.top);
      if (beforeDistance < bestDistance) {
        bestDistance = beforeDistance;
        bestMatch = { index, position: "before" };
      }

      const afterDistance = Math.abs(clientY - rect.bottom);
      if (afterDistance < bestDistance) {
        bestDistance = afterDistance;
        bestMatch = { index, position: "after" };
      }
    });

    return bestMatch;
  }

  function handleLevelDragStart(index: number): void {
    setDraggedLevelIndex(index);
    setLevelDropState(null);
    setLevelContextMenu(null);
  }

  function handleLevelDragOver(
    event: React.DragEvent<HTMLButtonElement | HTMLDivElement>,
    index: number,
  ): void {
    event.preventDefault();
    const target = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < target.top + target.height / 2 ? "before" : "after";
    setLevelDropState((current) =>
      current?.index === index && current.position === position ? current : { index, position },
    );
  }

  function handleLevelDrop(): void {
    const insertionIndex = getDropInsertionIndex();
    const levelCount = getLevelCountForDisplay();
    if (draggedLevelIndex === null || insertionIndex === null || levelCount <= 0) return;

    const targetIndex = getReorderedTargetIndex(insertionIndex, levelCount);
    if (draggedLevelIndex !== targetIndex) {
      if (threeDLevelsEnabled) {
        commitLogicalLevelsetUpdate((groups) => {
          const nextGroups = [...groups];
          const [moved] = nextGroups.splice(draggedLevelIndex, 1);
          if (!moved) return null;
          nextGroups.splice(targetIndex, 0, moved);
          return {
            groups: nextGroups,
            selectedLogicalIndex: targetIndex,
            selectedLayerZ: moved.layers.length,
          };
        });
      } else {
        commitEvent({
          type: "move-level",
          from: draggedLevelIndex,
          to: targetIndex,
        });
      }
    }

    setDraggedLevelIndex(null);
    setLevelDropState(null);
  }

  function handleLevelContextMenu(event: React.MouseEvent, index: number): void {
    event.preventDefault();
    if (threeDLevelsEnabled) chooseLogicalLevel(index);
    else chooseRawLevel(index);
    setLevelContextMenu({
      index,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function toggleTabletLeftPanel(tab: LeftPanelTab): void {
    setLeftPanelTab(tab);
    setBoardMenuOpen(null);
    setLevelContextMenu(null);
    setTabletDrawerSide((current) => (current === "left" && leftPanelTab === tab ? null : "left"));
  }

  function toggleTabletRightPanel(tab: InspectorTab): void {
    setInspectorTab(tab);
    setBoardMenuOpen(null);
    setLevelContextMenu(null);
    setTabletDrawerSide((current) =>
      current === "right" && inspectorTab === tab ? null : "right",
    );
  }

  function closeTabletDrawers(): void {
    setTabletDrawerSide(null);
  }

  function assignPaletteTile(tile: string, target: PaletteAssignmentTarget): void {
    setLastPaletteAssignmentTarget(target);
    if (target === "secondary") setSecondaryTile(tile);
    else setPrimaryTile(tile);
  }

  function rotateSelectedPaletteTile(direction: "clockwise" | "counterclockwise"): void {
    const target = isTabletLayout ? paletteAssignmentTarget : lastPaletteAssignmentTarget;
    const currentTile = target === "secondary" ? secondaryTile : primaryTile;
    const rotatedTile = rotateDirectionalTileName(currentTile, direction);
    if (!rotatedTile) return;
    assignPaletteTile(rotatedTile, target);
  }

  function moveDisplayedLevelBy(offset: -1 | 1): void {
    if (!doc) return;

    if (threeDLevelsEnabled) {
      const sourceIndex = selectedLogicalIndex;
      const targetIndex = sourceIndex + offset;
      if (targetIndex < 0 || targetIndex >= displayedLevelCount) return;

      commitLogicalLevelsetUpdate((groups) => {
        const nextGroups = [...groups];
        const [moved] = nextGroups.splice(sourceIndex, 1);
        if (!moved) return null;
        nextGroups.splice(targetIndex, 0, moved);
        return {
          groups: nextGroups,
          selectedLogicalIndex: targetIndex,
          selectedLayerZ: Math.min(selectedLayerZ, moved.layers.length),
        };
      });
      return;
    }

    const sourceIndex = selectedIndex;
    const targetIndex = sourceIndex + offset;
    if (targetIndex < 0 || targetIndex >= displayedLevelCount) return;
    commitEvent({
      type: "move-level",
      from: sourceIndex,
      to: targetIndex,
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.item(0);
    if (!file) return;

    if (file.name.toLowerCase().endsWith(".dat")) {
      void openDat(file);
    } else {
      void openJson(file);
    }

    event.target.value = "";
  }

  function triggerOpenDialog(): void {
    fileInputRef.current?.click();
  }

  function openSelectedLevelInTworld(ruleset: "MS" | "Lynx"): void {
    if (!doc) return;
    window.open(
      buildTworldUrl(
        doc,
        displayedExternalTestLevelNumber,
        ruleset,
        normalizeDatFileName(fileName),
      ),
      "_blank",
      "noopener,noreferrer",
    );
  }

  function openSelectedLevelInLexysLabyrinth(): void {
    if (!doc || !singleLevelExternalTestLevel) return;
    window.open(
      buildLexysLabyrinthSharedUrl(doc, singleLevelExternalTestLevel),
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function saveCurrentDat(): Promise<void> {
    if (!doc) return;
    try {
      const output = normalizeDatFileName(fileName);
      const exportDoc = threeDLevelsEnabled ? export3dLevelsetDoc(doc) : doc;
      await saveBytesLocally(output, encodeDatBytes(exportDoc));
      setErrorMessage(null);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setErrorMessage(asErrorMessage(error));
    }
  }

  function handlePaletteWheel(event: React.WheelEvent<HTMLDivElement>): void {
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    event.stopPropagation();
    setPaletteTileSizeTarget((current) =>
      clampNumber(
        current * Math.exp(-event.deltaY * 0.0025),
        MIN_PALETTE_TILE_SIZE,
        MAX_PALETTE_TILE_SIZE,
      ),
    );
  }

  return (
    <div className={appShellClassName}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dat,.json"
        hidden
        onChange={handleFileChange}
      />

      {spriteError ? <div className="banner errorBanner">{spriteError}</div> : null}
      {errorMessage ? <div className="banner errorBanner">{errorMessage}</div> : null}

      <main className={editorLayoutClassName} ref={editorLayoutRef} style={editorLayoutStyle}>
        {isTabletLayout && tabletDrawerSide ? (
          <button
            type="button"
            className="tabletDrawerScrim"
            aria-label="Close side panel"
            onClick={closeTabletDrawers}
          />
        ) : null}

        {isTabletLayout ? (
          <>
            <div className="tabletPanelToggleCluster left">
              <button
                type="button"
                className={`tabletPanelToggleButton ${tabletDrawerSide === "left" && leftPanelTab === "levels" ? "active" : ""}`}
                onClick={() => toggleTabletLeftPanel("levels")}
              >
                Levels
              </button>
              <button
                type="button"
                className={`tabletPanelToggleButton ${tabletDrawerSide === "left" && leftPanelTab === "controls" ? "active" : ""}`}
                onClick={() => toggleTabletLeftPanel("controls")}
              >
                Controls
              </button>
            </div>
            <div className="tabletPanelToggleCluster right">
              <button
                type="button"
                className={`tabletPanelToggleButton ${tabletDrawerSide === "right" && inspectorTab === "palette" ? "active" : ""}`}
                onClick={() => toggleTabletRightPanel("palette")}
              >
                Palette
              </button>
              <button
                type="button"
                className={`tabletPanelToggleButton ${tabletDrawerSide === "right" && inspectorTab === "metadata" ? "active" : ""}`}
                onClick={() => toggleTabletRightPanel("metadata")}
              >
                Metadata
              </button>
            </div>
          </>
        ) : null}

        <aside
          className={`panel levelPanel ${isTabletLayout ? "tabletDrawerPanel tabletDrawerLeft" : ""} ${tabletDrawerSide === "left" ? "open" : ""}`}
        >
          <section className="panelSection">
            <div className="panelBrand">
              <div className="panelBrandCopy">
                <div className="panelBrandHeader">
                  <div className="brandTitle">DATTools Editor</div>
                  <button
                    type="button"
                    className="boardIconButton brandHelpButton"
                    aria-label="Open editor help"
                    title="Open editor help"
                    onClick={() => setOpenDialog("brandingHelp")}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <circle cx="8" cy="8" r="6.25" fill="none" />
                      <path
                        d="M6.7 6.1a1.55 1.55 0 1 1 2.5 1.2c-.72.56-1.15.95-1.15 1.7v.35"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="8" cy="11.95" r="0.75" stroke="none" />
                    </svg>
                  </button>
                </div>
                <div className="brandSubtitle">Level and levelset authoring for CC1 DAT files</div>
                <div className="panelMetaStrip">
                  <input
                    className="brandingFileInput"
                    type="text"
                    aria-label="Levelset filename"
                    value={fileName}
                    spellCheck={false}
                    onChange={(event) => setFileName(event.target.value)}
                  />
                  <span className="statusBadge">
                    {doc
                      ? `${threeDLevelsEnabled ? (logicalLevelset?.levels.length ?? 0) : doc.levels.length} levels`
                      : "no document"}
                  </span>
                  <button
                    type="button"
                    className="actionButton brandingActionButton"
                    onClick={triggerOpenDialog}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="actionButton brandingActionButton"
                    disabled={!doc}
                    onClick={() => {
                      void saveCurrentDat();
                    }}
                  >
                    Save As
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="panelSection leftPanelMenuSection">
            <div className="boardMenuBar">
              <div className="menuWrap" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="menuButton"
                  aria-expanded={boardMenuOpen === "file"}
                  onClick={() => toggleBoardMenu("file")}
                >
                  File
                </button>
                {boardMenuOpen === "file" ? (
                  <div className="dropdownMenu">
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => {
                        setBoardMenuOpen(null);
                        triggerOpenDialog();
                      }}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      disabled={!doc}
                      onClick={() => {
                        if (!doc) return;
                        setBoardMenuOpen(null);
                        const exportDoc = threeDLevelsEnabled ? export3dLevelsetDoc(doc) : doc;
                        downloadText("levelset.json", stringifyDatLevelsetJsonV1(exportDoc));
                      }}
                    >
                      Download JSON
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      disabled={!doc}
                      onClick={() => {
                        setBoardMenuOpen(null);
                        void saveCurrentDat();
                      }}
                    >
                      Save DAT As...
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      disabled={!doc}
                      onClick={() => {
                        if (!doc) return;
                        setBoardMenuOpen(null);
                        openSelectedLevelInTworld("MS");
                      }}
                    >
                      Test in MS (F5)
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      disabled={!doc}
                      onClick={() => {
                        if (!doc) return;
                        setBoardMenuOpen(null);
                        openSelectedLevelInTworld("Lynx");
                      }}
                    >
                      Test in Lynx (F6)
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      disabled={!canTestSelectedLevelInLexysLabyrinth}
                      onClick={() => {
                        if (!canTestSelectedLevelInLexysLabyrinth) return;
                        setBoardMenuOpen(null);
                        openSelectedLevelInLexysLabyrinth();
                      }}
                    >
                      Test in Lexy's Labyrinth (F7)
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="menuWrap" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="menuButton"
                  aria-expanded={boardMenuOpen === "view"}
                  onClick={() => toggleBoardMenu("view")}
                >
                  View
                </button>
                {boardMenuOpen === "view" ? (
                  <div className="dropdownMenu">
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setShowSecrets((current) => !current)}
                    >
                      {`${showSecrets ? "Hide" : "Show"} Secrets`}
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setShowConnections((current) => !current)}
                    >
                      {`${showConnections ? "Hide" : "Show"} Connections`}
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setShowMonsterOrder((current) => !current)}
                    >
                      {`${showMonsterOrder ? "Hide" : "Show"} Monster Order`}
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setShowValidityWarnings((current) => !current)}
                    >
                      {`${showValidityWarnings ? "Hide" : "Show"} Validity Warnings`}
                    </button>
                    <div className="dropdownSubmenuWrap">
                      <button
                        type="button"
                        className="dropdownMenuItem dropdownMenuItemWithCaret"
                        aria-expanded={viewSubmenuOpen === "layout"}
                        onClick={() => toggleViewSubmenu("layout")}
                      >
                        Layout
                      </button>
                      {viewSubmenuOpen === "layout" ? (
                        <div className="dropdownMenu dropdownSubmenu">
                          <button
                            type="button"
                            className="dropdownMenuItem"
                            disabled={layoutModePreference === "auto"}
                            onClick={() => setLayoutModePreference("auto")}
                          >
                            {`${automaticLayoutLabel}${layoutModePreference === "auto" ? " (Current)" : ""}`}
                          </button>
                          <button
                            type="button"
                            className="dropdownMenuItem"
                            disabled={layoutModePreference === "desktop"}
                            onClick={() => setLayoutModePreference("desktop")}
                          >
                            {`Desktop${layoutModePreference === "desktop" ? " (Current)" : ""}`}
                          </button>
                          <button
                            type="button"
                            className="dropdownMenuItem"
                            disabled={layoutModePreference === "tablet"}
                            onClick={() => setLayoutModePreference("tablet")}
                          >
                            {`Tablet${layoutModePreference === "tablet" ? " (Current)" : ""}`}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="menuWrap" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="menuButton"
                  aria-expanded={boardMenuOpen === "options"}
                  onClick={() => toggleBoardMenu("options")}
                >
                  Options
                </button>
                {boardMenuOpen === "options" ? (
                  <div className="dropdownMenu">
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setThreeDLevelsEnabled((current) => !current)}
                    >
                      {`${threeDLevelsEnabled ? "Disable" : "Enable"} 3D Levels`}
                    </button>
                    <button
                      type="button"
                      className="dropdownMenuItem"
                      onClick={() => setExperimentalViewportRenderer((current) => !current)}
                    >
                      {`${experimentalViewportRenderer ? "Disable" : "Enable"} Experimental: Viewport Renderer`}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="menuWrap" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="menuButton"
                  aria-expanded={boardMenuOpen === "transform"}
                  onClick={() => toggleBoardMenu("transform")}
                >
                  Transform
                </button>
                {boardMenuOpen === "transform" ? (
                  <div className="dropdownMenu">
                    {TRANSFORM_MENU_ITEMS.map((item) => (
                      <button
                        key={item.kind}
                        type="button"
                        className="dropdownMenuItem"
                        disabled={!doc}
                        onClick={() => applySelectedLevelTransform(item.kind)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="inspectorTabs levelPanelTabs" role="tablist" aria-label="Left panel tabs">
            <button
              type="button"
              role="tab"
              aria-selected={leftPanelTab === "levels"}
              className={`inspectorTab ${leftPanelTab === "levels" ? "active" : ""}`}
              onClick={() => setLeftPanelTab("levels")}
            >
              Levels
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={leftPanelTab === "controls"}
              className={`inspectorTab ${leftPanelTab === "controls" ? "active" : ""}`}
              onClick={() => setLeftPanelTab("controls")}
            >
              Controls
            </button>
          </div>

          {leftPanelTab === "levels" ? (
            <section className="panelSection leftPanelTabBody levelManagerSection">
              <div className="sectionHeader">
                <div>
                  <div className="sectionEyebrow">Levels</div>
                  <h2 className="sectionTitle">Manager</h2>
                </div>
                {!isTabletLayout ? (
                  <div className="sectionActions">
                    <button type="button" className="iconButton" onClick={addLevelAfterSelection}>
                      Add
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="levelManagerHint">
                {isTabletLayout
                  ? "Tap to select. Use the actions below to duplicate, delete, or move the selected level."
                  : "Drag to reorder. Right-click for duplicate or delete."}
              </div>

              {isTabletLayout ? (
                <div className="boardControlRow tabletLevelActionRow">
                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={addLevelAfterSelection}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    disabled={displayedLevelCount <= 0}
                    onClick={() =>
                      duplicateLevelAt(threeDLevelsEnabled ? selectedLogicalIndex : selectedIndex)
                    }
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    disabled={displayedLevelCount <= 0}
                    onClick={() =>
                      deleteLevelAt(threeDLevelsEnabled ? selectedLogicalIndex : selectedIndex)
                    }
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    disabled={!canMoveDisplayedLevelUp}
                    onClick={() => moveDisplayedLevelBy(-1)}
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    disabled={!canMoveDisplayedLevelDown}
                    onClick={() => moveDisplayedLevelBy(1)}
                  >
                    Move Down
                  </button>
                </div>
              ) : null}

              <div
                className="levelList"
                role="list"
                aria-label="Level list"
                onDragOver={(event) => {
                  if (event.target !== event.currentTarget) return;
                  event.preventDefault();
                  const nextDropState = getLevelDropStateFromList(
                    event.currentTarget,
                    event.clientY,
                  );
                  if (!nextDropState) return;
                  setLevelDropState((current) =>
                    current?.index === nextDropState.index &&
                    current.position === nextDropState.position
                      ? current
                      : nextDropState,
                  );
                }}
                onDrop={(event) => {
                  if (event.target !== event.currentTarget) return;
                  event.preventDefault();
                  handleLevelDrop();
                }}
              >
                {(threeDLevelsEnabled ? logicalLevelset?.levels.length : doc?.levels.length) ? (
                  (threeDLevelsEnabled ? (logicalLevelset?.levels ?? []) : (doc?.levels ?? [])).map(
                    (entry, index) => {
                      const isLogical = threeDLevelsEnabled;
                      const logicalLevel = isLogical ? (entry as Logical3dLevel) : null;
                      const rawLevel = !isLogical ? (entry as DatLevelJson) : null;
                      const itemNumber = isLogical ? logicalLevel!.displayNumber : rawLevel!.number;
                      const itemTitle = isLogical
                        ? logicalLevel!.displayTitle || `Level ${logicalLevel!.displayNumber}`
                        : (rawLevel!.title ?? `Level ${rawLevel!.number}`);
                      const isSelected = isLogical
                        ? index === selectedLogicalIndex
                        : index === selectedIndex;
                      const showsDropBefore =
                        draggedLevelIndex !== null &&
                        levelDropState?.index === index &&
                        levelDropState.position === "before";
                      const showsDropAfter =
                        draggedLevelIndex !== null &&
                        levelDropState?.index === index &&
                        levelDropState.position === "after";

                      return (
                        <button
                          key={
                            isLogical
                              ? `${logicalLevel!.docStartIndex}-${index}`
                              : `${rawLevel!.number}-${index}`
                          }
                          type="button"
                          draggable={!isTabletLayout}
                          className={`levelListItem ${isSelected ? "selected" : ""} ${draggedLevelIndex === index ? "dragging" : ""} ${showsDropBefore ? "dropBefore" : ""} ${showsDropAfter ? "dropAfter" : ""}`}
                          onClick={() =>
                            isLogical ? chooseLogicalLevel(index) : chooseRawLevel(index)
                          }
                          onContextMenu={(event) => handleLevelContextMenu(event, index)}
                          onDragStart={() => handleLevelDragStart(index)}
                          onDragOver={(event) => {
                            event.stopPropagation();
                            handleLevelDragOver(event, index);
                          }}
                          onDrop={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleLevelDrop();
                          }}
                          onDragEnd={() => {
                            setDraggedLevelIndex(null);
                            setLevelDropState(null);
                          }}
                        >
                          <span className="levelDragGrip" aria-hidden="true">
                            ::
                          </span>
                          <span className="levelListNumber">{itemNumber}</span>
                          <span className="levelListTitle">{itemTitle}</span>
                        </button>
                      );
                    },
                  )
                ) : (
                  <div className="emptyState">Open a DAT or JSON levelset to start editing.</div>
                )}
              </div>
            </section>
          ) : null}

          {leftPanelTab === "controls" ? (
            <BoardControlsSection
              statusStore={boardStatusStore}
              canUndo={canUndo}
              canRedo={canRedo}
              activeLevel={activeLevel}
              selection={selection}
              clipboard={clipboard}
              tool={tool}
              setTool={setTool}
              onUndo={() =>
                setEditor((current) => (current ? undoLevelsetEvent(current) : current))
              }
              onRedo={() =>
                setEditor((current) => (current ? redoLevelsetEvent(current) : current))
              }
              onCopySelection={copySelection}
              onPasteClipboard={pasteClipboard}
              onEraseSelection={eraseSelection}
              onClearLevel={() => commitSelectedLevelUpdate(clearLevel)}
              onResetBoardView={() => boardEditorRef.current?.resetBoardView(1)}
              isTabletLayout={isTabletLayout}
              threeDLevelsEnabled={threeDLevelsEnabled}
              selectedLogicalLevel={selectedLogicalLevel}
              selectedLayerZ={selectedLayerZ}
              onSelectLayerUp={selectLayerUp}
              onSelectLayerDown={selectLayerDown}
              onAddTopLayer={addTopLayer}
              onAddBottomLayer={addBottomLayer}
              onRemoveTopLayer={removeTopLayer}
              onRemoveBottomLayer={removeBottomLayer}
              onOpenThreeDHelp={() => setOpenDialog("threeDHelp")}
            />
          ) : null}
        </aside>

        <div
          className={`panelSplitter ${layoutResizeState?.side === "left" ? "active" : ""}`}
          onPointerDown={(event) => beginLayoutResize(event, "left")}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize level manager"
        />

        <BoardEditorSurface
          ref={boardEditorRef}
          statusStore={boardStatusStore}
          interactionResetToken={boardInteractionResetToken}
          viewResetToken={boardViewResetToken}
          activeLevel={activeLevel}
          activeDisplayContext={activeDisplayContext}
          selectedLogicalLevel={selectedLogicalLevel}
          selectedLayerZ={selectedLayerZ}
          spriteSet={spriteSet}
          canvasSpriteCache={canvasSpriteCache}
          boardSize={boardSize}
          showSecrets={showSecrets}
          showConnections={showConnections}
          showMonsterOrder={showMonsterOrder}
          showValidityWarnings={showValidityWarnings}
          threeDLevelsEnabled={threeDLevelsEnabled}
          experimentalViewportRenderer={experimentalViewportRenderer}
          tool={tool}
          primaryTile={primaryTile}
          secondaryTile={secondaryTile}
          selection={selection}
          clipboard={clipboard}
          pastePreviewActive={pastePreviewActive}
          onSelectionChange={setSelection}
          onClearMetadataError={() => setMetadataError(null)}
          onSetErrorMessage={setErrorMessage}
          onCommitSelectedLevelUpdate={commitSelectedLevelUpdate}
          onApplySelectedLevelTransform={applySelectedLevelTransform}
          onShiftVisibleLevel={shiftVisibleLevel}
          isTabletLayout={isTabletLayout}
        />

        <div
          className={`panelSplitter ${layoutResizeState?.side === "right" ? "active" : ""}`}
          onPointerDown={(event) => beginLayoutResize(event, "right")}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize inspector"
        />

        <aside
          className={`panel inspectorPanel ${isTabletLayout ? "tabletDrawerPanel tabletDrawerRight" : ""} ${tabletDrawerSide === "right" ? "open" : ""}`}
        >
          <div className="inspectorTabs" role="tablist" aria-label="Inspector tabs">
            <button
              type="button"
              role="tab"
              aria-selected={inspectorTab === "palette"}
              className={`inspectorTab ${inspectorTab === "palette" ? "active" : ""}`}
              onClick={() => setInspectorTab("palette")}
            >
              Palette
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={inspectorTab === "metadata"}
              className={`inspectorTab ${inspectorTab === "metadata" ? "active" : ""}`}
              onClick={() => setInspectorTab("metadata")}
            >
              Metadata
            </button>
          </div>

          {inspectorTab === "palette" ? (
            <section className="panelSection inspectorBody paletteSection compactPaletteSection">
              <div className="activeTileStrip">
                {isTabletLayout ? (
                  <>
                    <button
                      type="button"
                      className={`activeTileCompactCard touchTargetButton ${paletteAssignmentTarget === "primary" ? "targeted" : ""}`}
                      onClick={() => setPaletteAssignmentTarget("primary")}
                    >
                      <div className="activeTileSlotLabel primary">Primary</div>
                      <TilePreview
                        canvasSpriteCache={canvasSpriteCache}
                        tile={primaryTile}
                        displayContext={paletteDisplayContext}
                        className="activeTileCompactCanvas"
                        pixelSize={40}
                        showPaletteDirectionArrow
                      />
                      <div className="activeTileCompactBody">
                        <div className="activeTileCompactName">
                          {getDat3dTileDisplayName(primaryTile, paletteDisplayContext)}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`activeTileCompactCard touchTargetButton ${paletteAssignmentTarget === "secondary" ? "targeted" : ""}`}
                      onClick={() => setPaletteAssignmentTarget("secondary")}
                    >
                      <div className="activeTileSlotLabel secondary">Secondary</div>
                      <TilePreview
                        canvasSpriteCache={canvasSpriteCache}
                        tile={secondaryTile}
                        displayContext={paletteDisplayContext}
                        className="activeTileCompactCanvas"
                        pixelSize={40}
                        showPaletteDirectionArrow
                      />
                      <div className="activeTileCompactBody">
                        <div className="activeTileCompactName">
                          {getDat3dTileDisplayName(secondaryTile, paletteDisplayContext)}
                        </div>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="activeTileCompactCard">
                      <div className="activeTileSlotLabel primary">LMB</div>
                      <TilePreview
                        canvasSpriteCache={canvasSpriteCache}
                        tile={primaryTile}
                        displayContext={paletteDisplayContext}
                        className="activeTileCompactCanvas"
                        pixelSize={40}
                        showPaletteDirectionArrow
                      />
                      <div className="activeTileCompactBody">
                        <div className="activeTileCompactName">
                          {getDat3dTileDisplayName(primaryTile, paletteDisplayContext)}
                        </div>
                      </div>
                    </div>
                    <div className="activeTileCompactCard">
                      <div className="activeTileSlotLabel secondary">RMB</div>
                      <TilePreview
                        canvasSpriteCache={canvasSpriteCache}
                        tile={secondaryTile}
                        displayContext={paletteDisplayContext}
                        className="activeTileCompactCanvas"
                        pixelSize={40}
                        showPaletteDirectionArrow
                      />
                      <div className="activeTileCompactBody">
                        <div className="activeTileCompactName">
                          {getDat3dTileDisplayName(secondaryTile, paletteDisplayContext)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <input
                id="palette-search"
                className="textInput"
                type="text"
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                placeholder="Filter by DAT tile name"
              />

              <div className="paletteTabs" role="tablist" aria-label="Palette tile groups">
                <button
                  type="button"
                  role="tab"
                  aria-selected={paletteTab === "normal"}
                  className={`paletteTab ${paletteTab === "normal" ? "active" : ""}`}
                  onClick={() => setPaletteTab("normal")}
                >
                  Normal
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={paletteTab === "invalid"}
                  className={`paletteTab ${paletteTab === "invalid" ? "active" : ""}`}
                  onClick={() => setPaletteTab("invalid")}
                >
                  Invalid
                </button>
              </div>

              <div
                ref={paletteGridRef}
                className="paletteGrid"
                style={paletteGridStyle}
                onWheel={handlePaletteWheel}
              >
                {filteredTiles.map((tile) => {
                  const tileId = tileCodeFromName(tile);
                  const displayTileName = getDat3dTileDisplayName(tile, paletteDisplayContext);
                  const tileTooltip = `${displayTileName} (id ${tileId}, ${classifyTilePlacement(
                    tile,
                    makePaintOptions(threeDLevelsEnabled, selectedLayerZ),
                  )})`;
                  const isPrimaryTile = tile === primaryTile;
                  const isSecondaryTile = tile === secondaryTile;
                  const isAirTile = threeDLevelsEnabled && tile === DAT_3D_AIR_TILE;

                  return (
                    <button
                      key={tile}
                      type="button"
                      className={`paletteGridItem ${isPrimaryTile ? "selectedPrimary" : ""} ${isSecondaryTile ? "selectedSecondary" : ""} ${isPrimaryTile && isSecondaryTile ? "selectedBoth" : ""}`}
                      title={tileTooltip}
                      aria-label={tileTooltip}
                      onClick={() =>
                        assignPaletteTile(
                          tile,
                          isTabletLayout ? paletteAssignmentTarget : "primary",
                        )
                      }
                      onPointerDown={(event) => {
                        if (isTabletLayout) return;
                        if (event.button !== 2) return;
                        event.preventDefault();
                        assignPaletteTile(tile, "secondary");
                      }}
                      onContextMenu={(event) => event.preventDefault()}
                    >
                      <TilePreview
                        canvasSpriteCache={canvasSpriteCache}
                        tile={tile}
                        displayContext={paletteDisplayContext}
                        className="paletteGridCanvas"
                        pixelSize={paletteCellSize}
                        showPaletteDirectionArrow
                      />
                      {paletteTab === "invalid" ? (
                        <span className="paletteGridBadge">
                          {tileId.toString(16).padStart(2, "0").toUpperCase()}
                        </span>
                      ) : null}
                      {isAirTile ? (
                        <span className="paletteGridBadge paletteGridAirBadge">AIR</span>
                      ) : null}
                      {isPrimaryTile ? <span className="paletteGridMarker primary">L</span> : null}
                      {isSecondaryTile ? (
                        <span className="paletteGridMarker secondary">R</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {inspectorTab === "metadata" ? (
            <section className="panelSection metadataSection inspectorBody">
              <div className="sectionHeader">
                <div>
                  <div className="sectionEyebrow">Metadata</div>
                  <h2 className="sectionTitle">
                    {threeDLevelsEnabled && selectedLogicalLevel
                      ? `Level ${selectedLogicalIndex + 1} / z${selectedLayerZ}`
                      : "Selected Level"}
                  </h2>
                </div>
                <div className="sectionActions">
                  <button
                    type="button"
                    className="secondaryButton"
                    disabled={!canonicalLevel || !activeLevel || !metadataDraft}
                    onClick={() =>
                      canonicalLevel &&
                      activeLevel &&
                      setMetadataDraft(
                        makeMetadataDraft(
                          canonicalLevel,
                          activeLevel,
                          threeDLevelsEnabled ? selectedLogicalIndex + 1 : canonicalLevel.number,
                          threeDLevelsEnabled
                            ? selectedLogicalLevel?.displayTitle
                            : canonicalLevel.title,
                        ),
                      )
                    }
                  >
                    Reset
                  </button>
                </div>
              </div>

              {metadataError ? (
                <div className="banner subtleErrorBanner">{metadataError}</div>
              ) : null}

              {metadataDraft ? (
                <>
                  <div className="formGrid">
                    <label className="fieldGroup">
                      <span className="fieldLabel">Number</span>
                      <input
                        className="textInput"
                        type="number"
                        value={metadataDraft.number}
                        disabled={threeDLevelsEnabled}
                        onChange={(event) => updateMetadataDraft("number", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                    </label>
                    <label className="fieldGroup">
                      <span className="fieldLabel">Title</span>
                      <input
                        className="textInput"
                        type="text"
                        value={metadataDraft.title}
                        onChange={(event) => updateMetadataDraft("title", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                    </label>
                    <label className="fieldGroup">
                      <span className="fieldLabel">Author</span>
                      <input
                        className="textInput"
                        type="text"
                        value={metadataDraft.author}
                        onChange={(event) => updateMetadataDraft("author", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                    </label>
                    <label className="fieldGroup">
                      <span className="fieldLabel">Password</span>
                      <input
                        className="textInput"
                        type="text"
                        value={metadataDraft.password}
                        onChange={(event) => updateMetadataDraft("password", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                    </label>
                    <label className="fieldGroup">
                      <span className="fieldLabelRow">
                        <span className="fieldLabel">Chips</span>
                        <button
                          type="button"
                          className="refreshIconButton"
                          title={`Set chips to map count (${actualChipCount})`}
                          aria-label={`Set chips to map count (${actualChipCount})`}
                          onClick={() => {
                            if (!metadataDraft) return;
                            const nextDraft = {
                              ...metadataDraft,
                              chips: String(actualChipCount),
                            };
                            setMetadataDraft(nextDraft);
                            setMetadataError(null);
                            applyMetadataDraft(nextDraft);
                          }}
                        >
                          <svg viewBox="0 0 16 16" aria-hidden="true" className="refreshIcon">
                            <path
                              d="M13 3v4H9"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.2 7A5 5 0 1 0 13 8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </span>
                      <input
                        className={`textInput ${chipFieldTone === "higher" ? "chipFieldHigher" : ""} ${chipFieldTone === "lower" ? "chipFieldLower" : ""}`}
                        type="number"
                        value={metadataDraft.chips}
                        onChange={(event) => updateMetadataDraft("chips", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                      <span
                        className={`fieldHint ${chipFieldTone === "higher" ? "chipHintHigher" : ""} ${chipFieldTone === "lower" ? "chipHintLower" : ""}`}
                      >
                        {`Map count: ${actualChipCount}`}
                      </span>
                    </label>
                    <label className="fieldGroup">
                      <span className="fieldLabel">Time</span>
                      <input
                        className="textInput"
                        type="number"
                        value={metadataDraft.time}
                        onChange={(event) => updateMetadataDraft("time", event.target.value)}
                        onBlur={() => applyMetadataDraft()}
                      />
                    </label>
                  </div>

                  <label className="fieldGroup">
                    <span className="fieldLabel">
                      {threeDLevelsEnabled ? `Hint (z${selectedLayerZ})` : "Hint"}
                    </span>
                    <textarea
                      className="textArea"
                      rows={4}
                      value={metadataDraft.hint}
                      onChange={(event) => updateMetadataDraft("hint", event.target.value)}
                      onBlur={() => applyMetadataDraft()}
                    />
                  </label>

                  <details className="advancedMetadataPanel">
                    <summary className="advancedMetadataSummary">Advanced</summary>
                    <div className="advancedMetadataBody">
                      <label className="fieldGroup">
                        <span className="fieldLabel">Map Detail</span>
                        <input
                          className="textInput"
                          type="number"
                          value={metadataDraft.mapDetail}
                          onChange={(event) => updateMetadataDraft("mapDetail", event.target.value)}
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>

                      <label className="fieldGroup">
                        <span className="fieldLabel">
                          {threeDLevelsEnabled
                            ? `Movement JSON (z${selectedLayerZ})`
                            : "Movement JSON"}
                        </span>
                        <textarea
                          className="textArea codeArea"
                          rows={3}
                          value={metadataDraft.movement}
                          onChange={(event) => updateMetadataDraft("movement", event.target.value)}
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>

                      <label className="fieldGroup">
                        <span className="fieldLabel">
                          {threeDLevelsEnabled
                            ? `Trap Controls JSON (z${selectedLayerZ})`
                            : "Trap Controls JSON"}
                        </span>
                        <textarea
                          className="textArea codeArea"
                          rows={5}
                          value={metadataDraft.trapControls}
                          onChange={(event) =>
                            updateMetadataDraft("trapControls", event.target.value)
                          }
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>

                      <label className="fieldGroup">
                        <span className="fieldLabel">
                          {threeDLevelsEnabled
                            ? `Clone Controls JSON (z${selectedLayerZ})`
                            : "Clone Controls JSON"}
                        </span>
                        <textarea
                          className="textArea codeArea"
                          rows={5}
                          value={metadataDraft.cloneControls}
                          onChange={(event) =>
                            updateMetadataDraft("cloneControls", event.target.value)
                          }
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>

                      <label className="fieldGroup">
                        <span className="fieldLabel">Field Order JSON</span>
                        <textarea
                          className="textArea codeArea"
                          rows={3}
                          value={metadataDraft.fieldOrder}
                          onChange={(event) =>
                            updateMetadataDraft("fieldOrder", event.target.value)
                          }
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>

                      <label className="fieldGroup">
                        <span className="fieldLabel">Extra Fields JSON</span>
                        <textarea
                          className="textArea codeArea"
                          rows={5}
                          value={metadataDraft.extraFields}
                          onChange={(event) =>
                            updateMetadataDraft("extraFields", event.target.value)
                          }
                          onBlur={() => applyMetadataDraft()}
                        />
                      </label>
                    </div>
                  </details>
                </>
              ) : (
                <div className="emptyState">Select a level to edit its metadata.</div>
              )}
            </section>
          ) : null}
        </aside>
      </main>

      {levelContextMenu ? (
        <div
          className="contextMenu"
          style={{ left: levelContextMenu.x, top: levelContextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="contextMenuItem"
            onClick={() => {
              duplicateLevelAt(levelContextMenu.index);
              setLevelContextMenu(null);
            }}
          >
            Duplicate
          </button>
          <button
            type="button"
            className="contextMenuItem danger"
            onClick={() => {
              deleteLevelAt(levelContextMenu.index);
              setLevelContextMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      ) : null}

      {openDialog === "threeDHelp" ? (
        <div
          className="modalBackdrop"
          onClick={() => setOpenDialog(null)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div
            className="modalCard"
            role="dialog"
            aria-modal="true"
            aria-labelledby="three-d-help-title"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <div className="sectionEyebrow">3D Levels</div>
                <h2 id="three-d-help-title" className="modalTitle">
                  DAT 3D Encoding
                </h2>
              </div>
              <button
                type="button"
                className="modalCloseButton"
                aria-label="Close 3D help"
                onClick={() => setOpenDialog(null)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <p>
                3D levels are encoded as contiguous <code>Title\N</code> through{" "}
                <code>Title\1</code> DAT runs.
              </p>
              <p>Only engines that support DAT 3D rules will play them correctly.</p>
              <p>
                The editor starts you on the top layer. Press <code>Q</code> to move up a z-layer
                and <code>Z</code> to move down.
              </p>
            </div>
            <div className="modalActions">
              <button type="button" className="actionButton" onClick={() => setOpenDialog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : openDialog === "brandingHelp" ? (
        <div
          className="modalBackdrop"
          onClick={() => setOpenDialog(null)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div
            className="modalCard modalCardWide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="branding-help-title"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <div className="sectionEyebrow">Editor Help</div>
                <h2 id="branding-help-title" className="modalTitle">
                  DATTools Overview
                </h2>
              </div>
              <button
                type="button"
                className="modalCloseButton"
                aria-label="Close editor help"
                onClick={() => setOpenDialog(null)}
              >
                ×
              </button>
            </div>
            <div className="modalBody modalColumns">
              <section className="modalColumn">
                <h3 className="modalSectionTitle">Info</h3>
                <ul className="modalList">
                  <li>
                    Edit CC1 DAT levelsets directly or open the JSON representation used by this
                    editor.
                  </li>
                  <li>
                    The filename in the left rail defines the default name offered by `Save As` and
                    `Save DAT As...`.
                  </li>
                  <li>
                    The level manager supports add, duplicate, delete, and drag-reorder operations.
                  </li>
                  <li>
                    3D mode groups contiguous `Title\N ... Title\1` DAT runs into one logical level.
                  </li>
                  <li>
                    Palette tabs separate normal tiles from invalid DAT codes while keeping 3D
                    reinterpretations visible.
                  </li>
                </ul>
              </section>
              <section className="modalColumn">
                <h3 className="modalSectionTitle">Controls</h3>
                <ul className="modalList">
                  <li>
                    Paint with left and right mouse buttons using the two active palette
                    assignments.
                  </li>
                  <li>
                    Pan with middle mouse or `Cmd`/`Ctrl` plus drag. Zoom the board with the mouse
                    wheel.
                  </li>
                  <li>
                    Hold `W`, `A`, `S`, `D` or the arrow keys to move the camera continuously.
                  </li>
                  <li>Tool shortcuts: `B` Brush, `L` Line, `F` Bucket, `V` Select, `C` Connect.</li>
                  <li>
                    `N` moves to the next level in the level list and `P` moves to the previous one.
                  </li>
                  <li>
                    `,`/`&lt;` and `.`/`&gt;` rotate the active palette assignment counterclockwise
                    or clockwise.
                  </li>
                  <li>
                    `F5` tests the current DAT in Tile World MS rules, `F6` tests it in Tile World
                    Lynx rules, and `F7` tests the current non-3D level in Lexy&apos;s Labyrinth.
                    `Ctrl`/`Cmd` + `5`/`6`/`7` trigger the same launches.
                  </li>
                  <li>In 3D mode, `Q` moves up a z-layer and `Z` moves down a z-layer.</li>
                </ul>
              </section>
            </div>
            <div className="modalActions">
              <button type="button" className="actionButton" onClick={() => setOpenDialog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
