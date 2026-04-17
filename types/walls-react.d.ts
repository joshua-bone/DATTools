import type { JSX } from "react";

import type { WallGrid, WallsBankRecord } from "./walls-core";

export type WallsBrowserLoadState = "idle" | "loading" | "ready" | "error";

export type BrowseWallsDialogLabels = Readonly<{
  eyebrow: string;
  title: string;
  closeAriaLabel: string;
}>;

export type BrowseWallsDialogProps = Readonly<{
  records: ReadonlyArray<WallsBankRecord>;
  loadState: WallsBrowserLoadState;
  errorMessage: string | null;
  starredKeys: ReadonlySet<string>;
  hiddenKeys: ReadonlySet<string>;
  onToggleStar: (wallKey: string) => void;
  onToggleHidden: (wallKey: string) => void;
  onImport: (wallKey: string) => void;
  onClose: () => void;
  labels?: Partial<BrowseWallsDialogLabels>;
}>;

export type GeneratedLayoutFrame = Readonly<{
  width: number;
  height: number;
}>;

export type GeneratedLayoutRecord = Readonly<{
  recordKey: string;
  wallKey?: string;
  grid?: WallGrid;
  layout?: GeneratedLayoutFrame;
  algorithm: string;
  title: string;
  summary: string;
  seedLabel: string;
  inverted: boolean;
  params: unknown;
}>;

export type GeneratedLayoutSizeLimits = Readonly<{
  min: number;
  max: number;
}>;

export type GenerateWallsDialogLabels = Readonly<{
  eyebrow: string;
  title: string;
  closeAriaLabel: string;
}>;

export type GenerateDialogSizeLimits = Readonly<
  GeneratedLayoutSizeLimits & {
    initialWidth?: number;
    initialHeight?: number;
  }
>;

export type GenerateWallsDialogProps = Readonly<{
  starredRecords: ReadonlyArray<GeneratedLayoutRecord>;
  onToggleStar: (record: GeneratedLayoutRecord) => void;
  onImport: (record: GeneratedLayoutRecord) => void;
  onClose: () => void;
  labels?: Partial<GenerateWallsDialogLabels>;
  sizeLimits?: GenerateDialogSizeLimits;
  frameToMask?: boolean;
  starUiEnabled?: boolean;
}>;

export declare function BrowseWallsDialog(props: BrowseWallsDialogProps): JSX.Element;
export declare function GenerateWallsDialog(props: GenerateWallsDialogProps): JSX.Element;

export declare const GENERATED_LAYOUT_STARRED_STORAGE_KEY = "dattools-generate-starred";
export declare function parsePersistedGeneratedLayoutRecordList(
  value: string | null,
): ReadonlyArray<GeneratedLayoutRecord>;
export declare function serializePersistedGeneratedLayoutRecordList(
  records: ReadonlyArray<GeneratedLayoutRecord>,
): string;
