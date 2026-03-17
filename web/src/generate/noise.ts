import type { DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";
import { CC1_TILE_COUNT, tileNameFromCode } from "@/src/dat/cc1Tiles";

export type NoiseKind = "random" | "perlin" | "cellular" | "stripes" | "checker";

export type NoiseSettings = {
  type: NoiseKind;
  tile: string;
  seed: number;
  density: number;
  scale: number;
  threshold: number;
  octaves: number;
  cellSize: number;
  jitter: number;
  spacing: number;
  thickness: number;
  angle: number;
  checkerSize: number;
  offsetX: number;
  offsetY: number;
};

type DatLevel = DatLevelsetJsonV1["levels"][number];

export const TILE_OPTIONS = Array.from({ length: CC1_TILE_COUNT }, (_, code) =>
  tileNameFromCode(code),
);

export const NOISE_TYPE_OPTIONS: Array<{ value: NoiseKind; label: string; description: string }> = [
  {
    value: "random",
    label: "Random",
    description: "Scatter tiles with simple seeded coverage.",
  },
  {
    value: "perlin",
    label: "Perlin",
    description: "Layer smooth gradients into organic blobs.",
  },
  {
    value: "cellular",
    label: "Cellular",
    description: "Build island-like pockets from nearest-cell distance.",
  },
  {
    value: "stripes",
    label: "Stripes",
    description: "Lay down angled bands at a fixed cadence.",
  },
  {
    value: "checker",
    label: "Checker",
    description: "Stamp a repeating grid with optional offsets.",
  },
];

export function createDefaultNoiseSettings(): NoiseSettings {
  return {
    type: "random",
    tile: "WALL",
    seed: 1,
    density: 0.35,
    scale: 6,
    threshold: 0.56,
    octaves: 3,
    cellSize: 6,
    jitter: 0.85,
    spacing: 6,
    thickness: 2,
    angle: 45,
    checkerSize: 4,
    offsetX: 0,
    offsetY: 0,
  };
}

export function applyNoiseToLevel(level: DatLevel, settings: NoiseSettings): DatLevel {
  const bottom = [...level.map.bottom];

  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const idx = y * 32 + x;
      if (sampleNoiseMask(settings, x, y)) bottom[idx] = settings.tile;
    }
  }

  return {
    ...level,
    map: {
      ...level.map,
      bottom,
    },
  };
}

function sampleNoiseMask(settings: NoiseSettings, x: number, y: number): boolean {
  switch (settings.type) {
    case "random":
      return sampleRandom(settings.seed, x, y) < clamp(settings.density, 0, 1);
    case "perlin": {
      const scale = Math.max(1, settings.scale);
      const octaves = clamp(Math.round(settings.octaves), 1, 8);
      const threshold = clamp(settings.threshold, 0, 1);
      const value = samplePerlinFbm(settings.seed, x / scale, y / scale, octaves);
      return value >= threshold;
    }
    case "cellular": {
      const cellSize = Math.max(1, settings.cellSize);
      const jitter = clamp(settings.jitter, 0, 1);
      const threshold = clamp(settings.threshold, 0, 1);
      return sampleCellular(settings.seed, x, y, cellSize, jitter) >= threshold;
    }
    case "stripes":
      return sampleStripes(x, y, Math.max(1, settings.spacing), settings.thickness, settings.angle);
    case "checker":
      return sampleChecker(
        x,
        y,
        Math.max(1, settings.checkerSize),
        settings.offsetX,
        settings.offsetY,
      );
  }
}

function sampleRandom(seed: number, x: number, y: number): number {
  return hash01(seed, x, y);
}

function samplePerlinFbm(seed: number, x: number, y: number, octaves: number): number {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let weight = 0;

  for (let octave = 0; octave < octaves; octave++) {
    total += samplePerlin(seed + octave * 1013, x * frequency, y * frequency) * amplitude;
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return (total / Math.max(weight, 1) + 1) / 2;
}

function samplePerlin(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const tx = x - x0;
  const ty = y - y0;
  const sx = fade(tx);
  const sy = fade(ty);

  const n00 = gradientDot(seed, x0, y0, tx, ty);
  const n10 = gradientDot(seed, x1, y0, tx - 1, ty);
  const n01 = gradientDot(seed, x0, y1, tx, ty - 1);
  const n11 = gradientDot(seed, x1, y1, tx - 1, ty - 1);

  const nx0 = lerp(n00, n10, sx);
  const nx1 = lerp(n01, n11, sx);
  return lerp(nx0, nx1, sy);
}

function sampleCellular(
  seed: number,
  x: number,
  y: number,
  cellSize: number,
  jitter: number,
): number {
  const px = x / cellSize;
  const py = y / cellSize;
  const cellX = Math.floor(px);
  const cellY = Math.floor(py);
  let minDistance = Number.POSITIVE_INFINITY;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const sx = cellX + dx;
      const sy = cellY + dy;
      const featureX = sx + 0.5 + (hash01(seed, sx, sy) - 0.5) * jitter;
      const featureY = sy + 0.5 + (hash01(seed + 97, sx, sy) - 0.5) * jitter;
      const distX = featureX - px;
      const distY = featureY - py;
      const dist = Math.hypot(distX, distY);
      if (dist < minDistance) minDistance = dist;
    }
  }

  return 1 - clamp(minDistance / Math.SQRT2, 0, 1);
}

function sampleStripes(
  x: number,
  y: number,
  spacing: number,
  thickness: number,
  angleDegrees: number,
): boolean {
  const radians = (angleDegrees * Math.PI) / 180;
  const axis = x * Math.cos(radians) + y * Math.sin(radians);
  const distance = mod(axis, spacing);
  return distance < clamp(thickness, 0.25, spacing);
}

function sampleChecker(
  x: number,
  y: number,
  checkerSize: number,
  offsetX: number,
  offsetY: number,
): boolean {
  const col = Math.floor((x + offsetX) / checkerSize);
  const row = Math.floor((y + offsetY) / checkerSize);
  return (col + row) % 2 === 0;
}

function gradientDot(seed: number, gridX: number, gridY: number, dx: number, dy: number): number {
  const angle = hash01(seed, gridX, gridY) * Math.PI * 2;
  return Math.cos(angle) * dx + Math.sin(angle) * dy;
}

function hash01(seed: number, x: number, y: number): number {
  let h = seed | 0;
  h ^= Math.imul(x | 0, 0x27d4eb2d);
  h ^= Math.imul(y | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 0xffffffff;
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
