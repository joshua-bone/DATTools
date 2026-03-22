import type { DatLevelJson } from "@/src/dat/datLevelsetJsonV1";

export type BoardTileRedrawPlan =
  | Readonly<{
      kind: "full";
    }>
  | Readonly<{
      kind: "partial";
      indices: ReadonlyArray<number>;
    }>;

export function diffLevelTileIndices(
  previousLevel: DatLevelJson,
  nextLevel: DatLevelJson,
): number[] {
  const dirtyIndices: number[] = [];
  const tileCount = Math.max(
    previousLevel.map.top.length,
    previousLevel.map.bottom.length,
    nextLevel.map.top.length,
    nextLevel.map.bottom.length,
  );

  for (let index = 0; index < tileCount; index++) {
    if (
      previousLevel.map.top[index] !== nextLevel.map.top[index] ||
      previousLevel.map.bottom[index] !== nextLevel.map.bottom[index]
    ) {
      dirtyIndices.push(index);
    }
  }

  return dirtyIndices;
}

export function resolveBoardTileRedrawPlan(
  previousLevel: DatLevelJson | null,
  nextLevel: DatLevelJson,
  options: Readonly<{
    canReuseCanvas: boolean;
    partialThreshold: number;
  }>,
): BoardTileRedrawPlan {
  if (!previousLevel || !options.canReuseCanvas) {
    return { kind: "full" };
  }

  const dirtyIndices = diffLevelTileIndices(previousLevel, nextLevel);
  if (dirtyIndices.length > options.partialThreshold) {
    return { kind: "full" };
  }

  return {
    kind: "partial",
    indices: dirtyIndices,
  };
}
