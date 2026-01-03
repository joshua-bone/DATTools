import type { RgbaImage } from "../../src/dat/render/rgbaImage";
import { buildCc1SpriteSet, type CC1SpriteSet } from "../../src/dat/render/cc1SpriteSet";

async function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function htmlImageToRgba(img: HTMLImageElement): RgbaImage {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = new Uint8Array(imageData.data.buffer.slice(0));
  return { width: canvas.width, height: canvas.height, data };
}

export async function loadCc1SpriteSet(url: string): Promise<CC1SpriteSet> {
  const img = await loadHtmlImage(url);
  const rgba = htmlImageToRgba(img);
  return buildCc1SpriteSet(rgba);
}
