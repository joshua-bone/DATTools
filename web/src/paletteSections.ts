import {
  CC1_INVALID_TILE_NAMES,
  CC1_LEGACY_INVALID_TILE_NAMES,
  CC1_VALID_TILE_NAMES,
} from "@/src/dat/cc1Tiles";
import { CC1_EXPANDED_TILE_NAMES } from "@/src/dat/cc1ExpandedTiles";
import { DAT_3D_AIR_TILE } from "@/src/dat/dat3dLevels";
import { getDat3dTileDisplayName, type Dat3dDisplayContext } from "@/src/dat/dat3dDisplay";

type PaletteTab = "normal" | "invalid";

export type PaletteTileSection = Readonly<{
  key: string;
  title: string | null;
  tiles: ReadonlyArray<string>;
}>;

type PaletteSectionsOptions = Readonly<{
  paletteTab: PaletteTab;
  query: string;
  displayContext: Dat3dDisplayContext;
  threeDLevelsEnabled: boolean;
}>;

function filterTilesByQuery(
  tiles: ReadonlyArray<string>,
  query: string,
  displayContext: Dat3dDisplayContext,
): string[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) return [...tiles];
  return tiles.filter((tile) =>
    `${tile} ${getDat3dTileDisplayName(tile, displayContext)}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getPaletteSections(options: PaletteSectionsOptions): PaletteTileSection[] {
  const { paletteTab, query, displayContext, threeDLevelsEnabled } = options;

  if (paletteTab === "invalid") {
    const invalidTiles = filterTilesByQuery(
      [
        ...CC1_LEGACY_INVALID_TILE_NAMES.filter(
          (tile) => !threeDLevelsEnabled || (tile !== DAT_3D_AIR_TILE && tile !== "CHIP_EXIT"),
        ),
        ...CC1_INVALID_TILE_NAMES,
      ],
      query,
      displayContext,
    );
    return invalidTiles.length === 0
      ? []
      : [
          {
            key: "invalid",
            title: null,
            tiles: invalidTiles,
          },
        ];
  }

  const regularTiles = filterTilesByQuery(
    [...(threeDLevelsEnabled ? [DAT_3D_AIR_TILE, "CHIP_EXIT"] : []), ...CC1_VALID_TILE_NAMES],
    query,
    displayContext,
  );
  const expandedTiles = filterTilesByQuery(CC1_EXPANDED_TILE_NAMES, query, displayContext);
  const sections: PaletteTileSection[] = [];

  if (regularTiles.length > 0) {
    sections.push({
      key: "normal",
      title: null,
      tiles: regularTiles,
    });
  }

  if (expandedTiles.length > 0) {
    sections.push({
      key: "expanded",
      title: "Expanded Tiles",
      tiles: expandedTiles,
    });
  }

  return sections;
}
