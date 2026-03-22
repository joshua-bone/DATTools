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
