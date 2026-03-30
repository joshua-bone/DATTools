import { getLevelsetFileKind } from "@/src/levelsetFiles";
import type { EditorPlatform, OpenedLevelsetFile } from "./types";

function createAbortError(): DOMException {
  return new DOMException("The operation was aborted.", "AbortError");
}

function getFileNameFromPath(path: string): string {
  const normalizedPath = path.replace(/^file:\/\//, "");
  const parts = normalizedPath.split(/[\\/]/);
  return parts[parts.length - 1] || normalizedPath;
}

async function openLevelsetFile(): Promise<OpenedLevelsetFile | null> {
  const [{ open }, { readFile, readTextFile }] = await Promise.all([
    import("@tauri-apps/plugin-dialog"),
    import("@tauri-apps/plugin-fs"),
  ]);

  const selectedPath = await open({
    title: "Open levelset",
    multiple: false,
    filters: [
      { name: "Levelsets", extensions: ["dat", "json"] },
      { name: "CC1 DAT levelsets", extensions: ["dat"] },
      { name: "Levelset JSON", extensions: ["json"] },
    ],
    fileAccessMode: "scoped",
  });

  if (!selectedPath || Array.isArray(selectedPath)) return null;

  const name = getFileNameFromPath(selectedPath);
  const kind = getLevelsetFileKind(name);
  if (kind === "dat") {
    return {
      kind,
      name,
      bytes: await readFile(selectedPath),
    };
  }

  return {
    kind,
    name,
    text: await readTextFile(selectedPath),
  };
}

async function saveDatFile(filename: string, bytes: Uint8Array): Promise<void> {
  const [{ save }, { writeFile }] = await Promise.all([
    import("@tauri-apps/plugin-dialog"),
    import("@tauri-apps/plugin-fs"),
  ]);

  const selectedPath = await save({
    title: "Save DAT levelset",
    defaultPath: filename,
    filters: [{ name: "CC1 DAT levelsets", extensions: ["dat"] }],
  });
  if (!selectedPath) throw createAbortError();

  await writeFile(selectedPath, bytes);
}

async function saveJsonFile(filename: string, text: string): Promise<void> {
  const [{ save }, { writeTextFile }] = await Promise.all([
    import("@tauri-apps/plugin-dialog"),
    import("@tauri-apps/plugin-fs"),
  ]);

  const selectedPath = await save({
    title: "Save levelset JSON",
    defaultPath: filename,
    filters: [{ name: "Levelset JSON", extensions: ["json"] }],
  });
  if (!selectedPath) throw createAbortError();

  await writeTextFile(selectedPath, text);
}

async function openExternalUrl(url: string): Promise<void> {
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(url);
}

async function getAppVersion(): Promise<string> {
  const { getVersion } = await import("@tauri-apps/api/app");
  return getVersion();
}

export const tauriPlatform: EditorPlatform = {
  openLevelsetFile,
  saveDatFile,
  saveJsonFile,
  openExternalUrl,
  getAppVersion,
};
