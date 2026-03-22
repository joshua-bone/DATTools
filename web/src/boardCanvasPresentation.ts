type SizedCanvas = {
  width: number;
  height: number;
};

type DrawImageContext<TLayer> = {
  clearRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (image: TLayer, dx: number, dy: number) => void;
};

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
