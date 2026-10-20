import type { RgbaImage } from "@/src/dat/render/rgbaImage";
import { buildCc1SpriteSet, type CC1SpriteSet } from "@/src/dat/render/cc1SpriteSet";
import { extractSpriteOverridesFromAtlas, parseSpriteAtlasKey } from "@/src/dat/render/spriteAtlas";

const EXPANSION_ATLAS_URL = `${import.meta.env.BASE_URL}expansion_artwork/expansion.png`;
const EXPANSION_ATLAS_KEY_URL = `${import.meta.env.BASE_URL}expansion_artwork/expansion.json`;
const MEME_ATLAS_URL = `${import.meta.env.BASE_URL}meme_artwork/meme.png`;
const MEME_ATLAS_KEY_URL = `${import.meta.env.BASE_URL}meme_artwork/meme.json`;

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

async function loadJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON: ${url} (${response.status} ${response.statusText})`);
  }
  return await response.json();
}

async function loadArtwork(
  tileSize: number,
  imageUrl: string,
  keyUrl: string,
  scaleFrames = false,
): Promise<Readonly<Record<string, RgbaImage>>> {
  const [atlasImage, atlasKeyValue] = await Promise.all([
    loadHtmlImage(imageUrl),
    loadJson(keyUrl),
  ]);
  return extractSpriteOverridesFromAtlas(
    htmlImageToRgba(atlasImage),
    parseSpriteAtlasKey(atlasKeyValue),
    tileSize,
    { scaleFrames },
  );
}

export async function loadCc1SpriteSet(url: string): Promise<CC1SpriteSet> {
  const img = await loadHtmlImage(url);
  const rgba = htmlImageToRgba(img);
  const tileSize = rgba.height / 16;
  const [expansionArtwork, memeArtwork] = await Promise.all([
    loadArtwork(tileSize, EXPANSION_ATLAS_URL, EXPANSION_ATLAS_KEY_URL),
    loadArtwork(tileSize, MEME_ATLAS_URL, MEME_ATLAS_KEY_URL, true),
  ]);
  return buildCc1SpriteSet(rgba, { ...expansionArtwork, ...memeArtwork });
}
