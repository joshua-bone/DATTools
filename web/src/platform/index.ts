import { isTauri } from "@tauri-apps/api/core";
import { browserPlatform } from "./browser";
import type { EditorPlatform } from "./types";

let tauriPlatformPromise: Promise<EditorPlatform> | null = null;

async function resolvePlatform(): Promise<EditorPlatform> {
  if (!isTauri()) return browserPlatform;

  tauriPlatformPromise ??= import("./tauri").then(({ tauriPlatform }) => tauriPlatform);
  return tauriPlatformPromise;
}

export const platform: EditorPlatform = {
  async openLevelsetFile() {
    return (await resolvePlatform()).openLevelsetFile();
  },
  async saveDatFile(filename, bytes) {
    return (await resolvePlatform()).saveDatFile(filename, bytes);
  },
  async saveJsonFile(filename, text) {
    return (await resolvePlatform()).saveJsonFile(filename, text);
  },
  async openExternalUrl(url) {
    return (await resolvePlatform()).openExternalUrl(url);
  },
  async getAppVersion() {
    return (await resolvePlatform()).getAppVersion();
  },
};

export type { EditorPlatform, OpenedLevelsetFile } from "./types";
