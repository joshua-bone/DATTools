export type OpenedLevelsetFile = Readonly<
  | {
      kind: "dat";
      name: string;
      bytes: Uint8Array;
    }
  | {
      kind: "json";
      name: string;
      text: string;
    }
>;

export type EditorPlatform = Readonly<{
  openLevelsetFile: () => Promise<OpenedLevelsetFile | null>;
  saveDatFile: (filename: string, bytes: Uint8Array) => Promise<void>;
  saveJsonFile: (filename: string, text: string) => Promise<void>;
  openExternalUrl: (url: string) => Promise<void>;
}>;
