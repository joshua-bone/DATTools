import { cropRect, type RgbaImage } from "@/src/dat/render/rgbaImage";

export type SpriteAtlasFrame = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type SpriteAtlasKey = Readonly<{
  image?: string;
  frames: Readonly<Record<string, SpriteAtlasFrame>>;
}>;

function readNonNegativeInteger(value: unknown, fieldName: string, frameName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(
      `Sprite atlas frame '${frameName}' has invalid '${fieldName}' value ${String(value)}`,
    );
  }
  return value;
}

export function parseSpriteAtlasKey(value: unknown): SpriteAtlasKey {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Sprite atlas key must be an object");
  }

  const raw = value as Record<string, unknown>;
  const image = raw.image;
  if (image !== undefined && typeof image !== "string") {
    throw new Error("Sprite atlas key 'image' must be a string when present");
  }

  const framesValue = raw.frames;
  if (!framesValue || typeof framesValue !== "object" || Array.isArray(framesValue)) {
    throw new Error("Sprite atlas key must contain a 'frames' object");
  }

  const frames: Record<string, SpriteAtlasFrame> = {};
  for (const [name, frameValue] of Object.entries(framesValue as Record<string, unknown>)) {
    if (!frameValue || typeof frameValue !== "object" || Array.isArray(frameValue)) {
      throw new Error(`Sprite atlas frame '${name}' must be an object`);
    }

    const rawFrame = frameValue as Record<string, unknown>;
    frames[name] = {
      x: readNonNegativeInteger(rawFrame.x, "x", name),
      y: readNonNegativeInteger(rawFrame.y, "y", name),
      width: readNonNegativeInteger(rawFrame.width, "width", name),
      height: readNonNegativeInteger(rawFrame.height, "height", name),
    };
  }

  return typeof image === "string" ? { image, frames } : { frames };
}

export function extractSpriteOverridesFromAtlas(
  atlasImage: RgbaImage,
  atlasKey: SpriteAtlasKey,
  spriteSize: number,
): Readonly<Record<string, RgbaImage>> {
  const overrides: Record<string, RgbaImage> = {};

  for (const [name, frame] of Object.entries(atlasKey.frames)) {
    if (frame.width !== spriteSize || frame.height !== spriteSize) {
      throw new Error(
        `Sprite atlas frame '${name}' must be ${spriteSize}x${spriteSize}, got ${frame.width}x${frame.height}`,
      );
    }

    overrides[name] = cropRect(
      atlasImage,
      frame.x,
      frame.y,
      frame.x + frame.width,
      frame.y + frame.height,
    );
  }

  return overrides;
}
