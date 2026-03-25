import {
  dirFromTileName,
  lightenImageInPlace,
  makeSemiTransparentInPlace,
  shouldShowDirectionArrowInPalette,
  type Dir,
} from "@/src/dat/render/cc1Secrets";
import type { RgbaImage } from "@/src/dat/render/rgbaImage";

export type RenderOptions = Readonly<{
  showSecrets: boolean;
}>;

export type SpriteEffect = "none" | "lighten" | "semiTransparent";

export type CellRenderStep =
  | Readonly<{
      kind: "sprite";
      spriteName: string;
      effect: SpriteEffect;
    }>
  | Readonly<{
      kind: "arrow";
      dir: Dir;
    }>;

const BLOCKS = new Set<string>([
  "BLOCK",
  "CLONE_BLOCK_N",
  "CLONE_BLOCK_W",
  "CLONE_BLOCK_S",
  "CLONE_BLOCK_E",
]);

export function shouldOverlayTopTile(topName: string, bottomName: string): boolean {
  if (topName === bottomName) return false;

  // DAT top-layer FLOOR acts like "no top tile", so the bottom terrain remains visible.
  if (topName === "FLOOR") return false;

  return true;
}

export function applySpriteEffectInPlace(image: RgbaImage, effect: SpriteEffect): void {
  if (effect === "semiTransparent") {
    makeSemiTransparentInPlace(image);
    return;
  }
  if (effect === "lighten") {
    lightenImageInPlace(image, 40);
  }
}

function getTopSpriteEffect(topName: string, opts: RenderOptions): SpriteEffect {
  if (!opts.showSecrets) return "none";
  if (BLOCKS.has(topName)) return "semiTransparent";
  if (topName === "BLUE_WALL_FAKE") return "lighten";
  return "none";
}

export function getPalettePreviewSpriteEffect(topName: string, opts: RenderOptions): SpriteEffect {
  if (topName !== "BLUE_WALL_FAKE") return "none";
  return getTopSpriteEffect(topName, opts);
}

export function buildCc1CellRenderSteps(
  topName: string,
  bottomName: string,
  opts: RenderOptions,
): CellRenderStep[] {
  const steps: CellRenderStep[] = [{ kind: "sprite", spriteName: bottomName, effect: "none" }];
  if (!shouldOverlayTopTile(topName, bottomName)) return steps;

  steps.push({
    kind: "sprite",
    spriteName: topName,
    effect: getTopSpriteEffect(topName, opts),
  });

  if (opts.showSecrets && shouldShowDirectionArrowInPalette(topName)) {
    const dir = dirFromTileName(topName);
    if (dir) steps.push({ kind: "arrow", dir });
  }

  return steps;
}
