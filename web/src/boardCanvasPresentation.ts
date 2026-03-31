type SizedCanvas = {
  width: number;
  height: number;
};

type DrawImageContext<TLayer> = {
  clearRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (image: TLayer, dx: number, dy: number) => void;
};

type DrawScaledImageContext<TLayer> = {
  clearRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (
    image: TLayer,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) => void;
};

export type BoardScreenRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type BoardViewportPresentationOptions = Readonly<{
  boardSize: number;
  boardPan: Readonly<{ x: number; y: number }>;
  boardZoom: number;
}>;

export type ThreeDLayerDrawMetrics = Readonly<{
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}>;

export type ClientPoint = Readonly<{
  clientX: number;
  clientY: number;
}>;

export type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export type BoardPoint = Readonly<{
  x: number;
  y: number;
}>;

export type VisibleBoardCellWindow = Readonly<{
  startColumn: number;
  endColumn: number;
  startRow: number;
  endRow: number;
}>;

export function ensureCanvasSize(canvas: SizedCanvas, width: number, height: number): boolean {
  if (canvas.width === width && canvas.height === height) return false;
  canvas.width = width;
  canvas.height = height;
  return true;
}

export function drawPresentedBoardLayers<TLayer>(
  ctx: DrawImageContext<TLayer>,
  width: number,
  height: number,
  layers: ReadonlyArray<TLayer | null>,
): void {
  ctx.clearRect(0, 0, width, height);
  for (const layer of layers) {
    if (!layer) continue;
    ctx.drawImage(layer, 0, 0);
  }
}

export function resolveBoardScreenRect(options: BoardViewportPresentationOptions): BoardScreenRect {
  return {
    x: options.boardPan.x,
    y: options.boardPan.y,
    width: options.boardSize * options.boardZoom,
    height: options.boardSize * options.boardZoom,
  };
}

export function resolveThreeDLayerDrawMetrics(
  depth: number,
  boardSize: number,
  boardPan: Readonly<{ x: number; y: number }>,
  boardZoom: number,
  viewport: Pick<RectLike, "width" | "height"> | null,
  parallaxView: boolean,
): ThreeDLayerDrawMetrics {
  if (!parallaxView) {
    return {
      offsetX: 0,
      offsetY: 0,
      width: boardSize,
      height: boardSize,
      scaleX: 1,
      scaleY: 1,
    };
  }

  const baseScale = Math.pow(0.9, depth);
  const centeredPanX = viewport ? (viewport.width - boardSize * boardZoom) / 2 : boardPan.x;
  const centeredPanY = viewport ? (viewport.height - boardSize * boardZoom) / 2 : boardPan.y;
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

function clampCellCoordinate(value: number): number {
  return Math.min(31, Math.max(0, value));
}

export function resolveVisibleBoardCellWindow(
  boardRect: BoardScreenRect,
  boardSize: number,
  viewportWidth: number,
  viewportHeight: number,
  overscanCells = 0,
): VisibleBoardCellWindow | null {
  if (
    boardSize <= 0 ||
    viewportWidth <= 0 ||
    viewportHeight <= 0 ||
    boardRect.width <= 0 ||
    boardRect.height <= 0
  ) {
    return null;
  }

  const visibleLeft = Math.max(0, boardRect.x);
  const visibleTop = Math.max(0, boardRect.y);
  const visibleRight = Math.min(viewportWidth, boardRect.x + boardRect.width);
  const visibleBottom = Math.min(viewportHeight, boardRect.y + boardRect.height);

  if (visibleLeft >= visibleRight || visibleTop >= visibleBottom) return null;

  const tileSize = boardSize / 32;
  const boardLeft = ((visibleLeft - boardRect.x) / boardRect.width) * boardSize;
  const boardTop = ((visibleTop - boardRect.y) / boardRect.height) * boardSize;
  const boardRight = ((visibleRight - boardRect.x) / boardRect.width) * boardSize;
  const boardBottom = ((visibleBottom - boardRect.y) / boardRect.height) * boardSize;

  return {
    startColumn: clampCellCoordinate(Math.floor(boardLeft / tileSize) - overscanCells),
    endColumn: clampCellCoordinate(Math.ceil(boardRight / tileSize) - 1 + overscanCells),
    startRow: clampCellCoordinate(Math.floor(boardTop / tileSize) - overscanCells),
    endRow: clampCellCoordinate(Math.ceil(boardBottom / tileSize) - 1 + overscanCells),
  };
}

export function enumerateVisibleBoardCellWindow(window: VisibleBoardCellWindow): number[] {
  const indices: number[] = [];
  for (let row = window.startRow; row <= window.endRow; row++) {
    for (let column = window.startColumn; column <= window.endColumn; column++) {
      indices.push(row * 32 + column);
    }
  }
  return indices;
}

export function isIndexVisibleInBoardCellWindow(
  index: number,
  window: VisibleBoardCellWindow,
): boolean {
  const column = index % 32;
  const row = Math.floor(index / 32);
  return (
    column >= window.startColumn &&
    column <= window.endColumn &&
    row >= window.startRow &&
    row <= window.endRow
  );
}

export function drawViewportPresentedBoardLayers<TLayer>(
  ctx: DrawScaledImageContext<TLayer>,
  viewportWidth: number,
  viewportHeight: number,
  layers: ReadonlyArray<TLayer | null>,
  boardRect: BoardScreenRect,
  boardSize: number,
): void {
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  for (const layer of layers) {
    if (!layer) continue;
    ctx.drawImage(
      layer,
      0,
      0,
      boardSize,
      boardSize,
      boardRect.x,
      boardRect.y,
      boardRect.width,
      boardRect.height,
    );
  }
}

export function viewportClientPointToBoardPoint(
  rect: RectLike,
  point: ClientPoint,
  boardRect: BoardScreenRect,
  boardSize: number,
): BoardPoint | null {
  if (rect.width <= 0 || rect.height <= 0 || boardRect.width <= 0 || boardRect.height <= 0) {
    return null;
  }

  const localX = point.clientX - rect.left - boardRect.x;
  const localY = point.clientY - rect.top - boardRect.y;

  if (localX < 0 || localY < 0 || localX >= boardRect.width || localY >= boardRect.height) {
    return null;
  }

  return {
    x: (localX / boardRect.width) * boardSize,
    y: (localY / boardRect.height) * boardSize,
  };
}

export function boardPointToCell(point: BoardPoint | null, boardSize: number): BoardPoint | null {
  if (!point || boardSize <= 0) return null;

  const px = (point.x / boardSize) * 32;
  const py = (point.y / boardSize) * 32;

  if (px < 0 || py < 0 || px >= 32 || py >= 32) return null;
  return {
    x: Math.floor(px),
    y: Math.floor(py),
  };
}
