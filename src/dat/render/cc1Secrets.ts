// src/dat/render/cc1Secrets.ts
import type { RgbaImage } from "./rgbaImage.js";
import { createImage, blit } from "./rgbaImage.js";

export type Dir = "N" | "E" | "S" | "W";

export function lightenImageInPlace(img: RgbaImage, pct: number): void {
  const factor = 1 + pct / 100;
  for (let i = 0; i < img.width * img.height; i++) {
    const o = i * 4;
    img.data[o + 0] = Math.min(255, Math.round(img.data[o + 0]! * factor));
    img.data[o + 1] = Math.min(255, Math.round(img.data[o + 1]! * factor));
    img.data[o + 2] = Math.min(255, Math.round(img.data[o + 2]! * factor));
  }
}

// Matches your Python make_semi_transparent: center becomes more transparent, edges opaque.
export function makeSemiTransparentInPlace(img: RgbaImage): void {
  const n = img.width;
  if (img.width !== img.height) throw new Error("makeSemiTransparent requires square image");
  const cx = n / 2 - 0.5;
  const cy = n / 2 - 0.5;
  const maxDist = Math.min(cx, cy);

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
      const alphaMask = Math.max(0, Math.min(255, Math.round(255 * Math.pow(dist / maxDist, 2))));
      const o = (y * n + x) * 4;
      // Replace alpha channel (like putalpha)
      img.data[o + 3] = Math.round((img.data[o + 3]! * alphaMask) / 255);
    }
  }
}

function pointInTri(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const v0x = cx - ax,
    v0y = cy - ay;
  const v1x = bx - ax,
    v1y = by - ay;
  const v2x = px - ax,
    v2y = py - ay;

  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;

  const invDen = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDen;
  const v = (dot00 * dot12 - dot01 * dot02) * invDen;

  return u >= 0 && v >= 0 && u + v <= 1;
}

export function makeArrow(
  size: number,
  dir: Dir,
  color: readonly [number, number, number, number] = [255, 0, 0, 255],
): RgbaImage {
  const img = createImage(size, size, [0, 0, 0, 0]);
  const arrowSize = Math.floor(size / 4);
  const offset = Math.floor(size / 8);

  let pts: Array<[number, number]> = [];
  if (dir === "N")
    pts = [
      [size / 2, offset],
      [size / 2 - arrowSize, offset + arrowSize],
      [size / 2 + arrowSize, offset + arrowSize],
    ];
  else if (dir === "S")
    pts = [
      [size / 2, size - offset],
      [size / 2 - arrowSize, size - offset - arrowSize],
      [size / 2 + arrowSize, size - offset - arrowSize],
    ];
  else if (dir === "W")
    pts = [
      [offset, size / 2],
      [offset + arrowSize, size / 2 - arrowSize],
      [offset + arrowSize, size / 2 + arrowSize],
    ];
  else
    pts = [
      [size - offset, size / 2],
      [size - offset - arrowSize, size / 2 - arrowSize],
      [size - offset - arrowSize, size / 2 + arrowSize],
    ];

  const [ax, ay] = pts[0]!;
  const [bx, by] = pts[1]!;
  const [cx, cy] = pts[2]!;

  const [r, g, b, a] = color;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      if (!pointInTri(px, py, ax, ay, bx, by, cx, cy)) continue;
      const o = (y * size + x) * 4;
      img.data[o + 0] = r;
      img.data[o + 1] = g;
      img.data[o + 2] = b;
      img.data[o + 3] = a;
    }
  }

  return img;
}

export function overlayArrowInPlace(tileImg: RgbaImage, arrow: RgbaImage): void {
  blit(tileImg, arrow, 0, 0);
}
