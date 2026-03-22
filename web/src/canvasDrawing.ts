import type { RgbaImage } from "@/src/dat/render/rgbaImage";

export function drawRgbaImageToContext(
  ctx: CanvasRenderingContext2D,
  image: RgbaImage,
  dx = 0,
  dy = 0,
): void {
  const clamped = new Uint8ClampedArray(image.data);
  ctx.putImageData(new ImageData(clamped, image.width, image.height), dx, dy);
}

export function drawRgbaImageToCanvas(canvas: HTMLCanvasElement, image: RgbaImage): void {
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  drawRgbaImageToContext(ctx, image);
}
