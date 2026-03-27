import { DAT_3D_AIR_TILE } from "@/src/dat/dat3dLevels";
import { getDat3dTileDisplayName } from "@/src/dat/dat3dDisplay";
import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";
import { shouldOverlayTopTile } from "@/src/dat/render/cc1CellRenderPlan";
import type { GridPoint } from "@/web/src/levelEditing";

export type BoardDisplayContext = Readonly<{
  threeDEnabled: boolean;
  layerZ: number;
  layerCount: number;
}>;

export type HoverCellSummary = Readonly<{
  index: number;
  top: string;
  bottom: string;
}>;

export type BoardEditorStatusSnapshot = Readonly<{
  boardZoom: number;
  hoverPoint: GridPoint | null;
  hoverCellSummary: HoverCellSummary | null;
  hasPendingConnection: boolean;
  isBrushDragging: boolean;
}>;

export type BoardEditorStatusStore = Readonly<{
  getSnapshot: () => BoardEditorStatusSnapshot;
  subscribe: (listener: () => void) => () => void;
  update: (partial: Partial<BoardEditorStatusSnapshot>) => void;
  reset: () => void;
}>;

const DEFAULT_SNAPSHOT: BoardEditorStatusSnapshot = {
  boardZoom: 1,
  hoverPoint: null,
  hoverCellSummary: null,
  hasPendingConnection: false,
  isBrushDragging: false,
};

function gridPointsEqual(a: GridPoint | null, b: GridPoint | null): boolean {
  return a?.x === b?.x && a?.y === b?.y;
}

function hoverCellSummariesEqual(a: HoverCellSummary | null, b: HoverCellSummary | null): boolean {
  return a?.index === b?.index && a?.top === b?.top && a?.bottom === b?.bottom;
}

function snapshotsEqual(a: BoardEditorStatusSnapshot, b: BoardEditorStatusSnapshot): boolean {
  return (
    a.boardZoom === b.boardZoom &&
    a.hasPendingConnection === b.hasPendingConnection &&
    a.isBrushDragging === b.isBrushDragging &&
    gridPointsEqual(a.hoverPoint, b.hoverPoint) &&
    hoverCellSummariesEqual(a.hoverCellSummary, b.hoverCellSummary)
  );
}

export function createBoardEditorStatusStore(): BoardEditorStatusStore {
  let snapshot = DEFAULT_SNAPSHOT;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    update(partial) {
      const nextSnapshot: BoardEditorStatusSnapshot = {
        ...snapshot,
        ...partial,
      };
      if (snapshotsEqual(snapshot, nextSnapshot)) return;
      snapshot = nextSnapshot;
      listeners.forEach((listener) => listener());
    },
    reset() {
      if (snapshotsEqual(snapshot, DEFAULT_SNAPSHOT)) return;
      snapshot = DEFAULT_SNAPSHOT;
      listeners.forEach((listener) => listener());
    },
  };
}

export function buildHoverCellSummary(
  level: DatLevelJson | null,
  hoverPoint: GridPoint | null,
  displayContext: BoardDisplayContext,
): HoverCellSummary | null {
  if (!level || !hoverPoint) return null;

  const index = hoverPoint.y * 32 + hoverPoint.x;
  const top = level.map.top[index] ?? "FLOOR";
  const bottom = level.map.bottom[index] ?? "FLOOR";

  return {
    index,
    top: getDat3dTileDisplayName(top, displayContext),
    bottom:
      displayContext.threeDEnabled && displayContext.layerZ > 1 && top === DAT_3D_AIR_TILE
        ? "AIR"
        : getDat3dTileDisplayName(bottom, displayContext),
  };
}

export function resolveEyedropperTile(
  level: DatLevelJson | null,
  point: GridPoint | null,
): string | null {
  if (!level || !point) return null;

  const index = point.y * 32 + point.x;
  const top = level.map.top[index] ?? "FLOOR";
  const bottom = level.map.bottom[index] ?? "FLOOR";
  return shouldOverlayTopTile(top, bottom) ? top : bottom;
}

export function resolveBrushPreviewDirtyCells(
  strokeCells: ReadonlyArray<number>,
  dirtyCells: ReadonlyArray<number>,
  previewPainted: boolean,
): ReadonlyArray<number> {
  return resolveBrushPreviewRenderCells(strokeCells, dirtyCells, previewPainted, false);
}

export function resolveBrushPreviewRenderCells(
  strokeCells: ReadonlyArray<number>,
  dirtyCells: ReadonlyArray<number>,
  previewPainted: boolean,
  forceFullReplay: boolean,
): ReadonlyArray<number> {
  return !previewPainted || forceFullReplay || dirtyCells.length === 0 ? strokeCells : dirtyCells;
}
