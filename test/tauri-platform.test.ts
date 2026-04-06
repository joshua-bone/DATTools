import { beforeEach, describe, expect, it, vi } from "vitest";

const dialogMocks = vi.hoisted(() => ({
  open: vi.fn(),
  save: vi.fn(),
}));

const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  readTextFile: vi.fn(),
  writeFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-dialog", () => dialogMocks);
vi.mock("@tauri-apps/plugin-fs", () => fsMocks);
vi.mock("@tauri-apps/plugin-opener", () => ({
  openUrl: vi.fn(),
}));
vi.mock("@tauri-apps/api/app", () => ({
  getVersion: vi.fn(),
}));

import { tauriPlatform } from "@/web/src/platform/tauri";

describe("tauri platform", () => {
  beforeEach(() => {
    dialogMocks.open.mockReset();
    dialogMocks.save.mockReset();
    fsMocks.readFile.mockReset();
    fsMocks.readTextFile.mockReset();
    fsMocks.writeFile.mockReset();
    fsMocks.writeTextFile.mockReset();
  });

  it("opens DAT files from file URLs without forcing scoped access mode", async () => {
    const datBytes = new Uint8Array([0, 1, 2, 3]);
    dialogMocks.open.mockResolvedValue("file:///Users/test/3D%20Levels.dat");
    fsMocks.readFile.mockResolvedValue(datBytes);

    const file = await tauriPlatform.openLevelsetFile();

    expect(file).toEqual({
      kind: "dat",
      name: "3D Levels.dat",
      bytes: datBytes,
    });

    expect(dialogMocks.open).toHaveBeenCalledTimes(1);
    const options = dialogMocks.open.mock.calls[0]?.[0];
    expect(options?.title).toBe("Open levelset");
    expect(options?.multiple).toBe(false);
    expect(options?.fileAccessMode).toBeUndefined();

    const fsPath = fsMocks.readFile.mock.calls[0]?.[0];
    expect(fsPath).toBeInstanceOf(URL);
    expect(String(fsPath)).toBe("file:///Users/test/3D%20Levels.dat");
  });

  it("opens JSON files from regular filesystem paths", async () => {
    dialogMocks.open.mockResolvedValue("/Users/test/levelset.json");
    fsMocks.readTextFile.mockResolvedValue('{"schema":"datTools.dat.levelset.json.v1"}');

    const file = await tauriPlatform.openLevelsetFile();

    expect(file).toEqual({
      kind: "json",
      name: "levelset.json",
      text: '{"schema":"datTools.dat.levelset.json.v1"}',
    });
    expect(fsMocks.readTextFile).toHaveBeenCalledWith("/Users/test/levelset.json");
  });
});
