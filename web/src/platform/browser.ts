import { getLevelsetFileKind, type LevelsetFileKind } from "@/src/levelsetFiles";
import type { EditorPlatform, OpenedLevelsetFile } from "./types";

type SaveFilePickerHandle = {
  createWritable(): Promise<{
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
  }>;
};

type WindowWithFilePickers = Window &
  typeof globalThis & {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<SaveFilePickerHandle>;
  };

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function saveBlobLocally(
  filename: string,
  blob: Blob,
  fileType: {
    description: string;
    mimeType: string;
    extensions: string[];
  },
): Promise<void> {
  const savePicker = (window as WindowWithFilePickers).showSaveFilePicker;
  if (!savePicker) {
    downloadBlob(filename, blob);
    return;
  }

  const handle = await savePicker({
    suggestedName: filename,
    excludeAcceptAllOption: false,
    types: [
      {
        description: fileType.description,
        accept: {
          [fileType.mimeType]: fileType.extensions,
        },
      },
    ],
  });
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function pickLevelsetFileFromInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".dat,.json";
    input.hidden = true;

    const parent = document.body ?? document.documentElement;
    let settled = false;

    const finish = (file: File | null) => {
      if (settled) return;
      settled = true;
      input.removeEventListener("cancel", handleCancel);
      input.remove();
      resolve(file);
    };
    const handleCancel = () => {
      finish(null);
    };

    input.addEventListener(
      "change",
      () => {
        finish(input.files?.item(0) ?? null);
      },
      { once: true },
    );
    input.addEventListener("cancel", handleCancel, { once: true });
    parent.appendChild(input);
    input.click();
  });
}

async function openLevelsetFile(): Promise<OpenedLevelsetFile | null> {
  const file = await pickLevelsetFileFromInput();
  if (!file) return null;

  const kind: LevelsetFileKind = getLevelsetFileKind(file.name);
  if (kind === "dat") {
    return {
      kind,
      name: file.name,
      bytes: new Uint8Array(await file.arrayBuffer()),
    };
  }

  return {
    kind,
    name: file.name,
    text: await file.text(),
  };
}

async function saveDatFile(filename: string, bytes: Uint8Array): Promise<void> {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  await saveBlobLocally(filename, new Blob([ab], { type: "application/octet-stream" }), {
    description: "CC1 DAT levelset",
    mimeType: "application/octet-stream",
    extensions: [".dat"],
  });
}

async function saveJsonFile(filename: string, text: string): Promise<void> {
  downloadBlob(filename, new Blob([text], { type: "application/json" }));
}

async function openExternalUrl(url: string): Promise<void> {
  window.open(url, "_blank", "noopener,noreferrer");
}

async function getAppVersion(): Promise<string | null> {
  return null;
}

export const browserPlatform: EditorPlatform = {
  openLevelsetFile,
  saveDatFile,
  saveJsonFile,
  openExternalUrl,
  getAppVersion,
};
