import type { RgbaImage } from "@/src/dat/render/rgbaImage";

export function drawRgbaImageToCanvas(canvas: HTMLCanvasElement, image: RgbaImage): void {
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const clamped = new Uint8ClampedArray(image.data);
  ctx.putImageData(new ImageData(clamped, image.width, image.height), 0, 0);
}
