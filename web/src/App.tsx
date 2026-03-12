import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelsetJsonV1,
} from "../../src/dat/datLevelsetJsonV1";
import { decodeDatBytes, encodeDatBytes } from "../../src/dat/datCodec";
import { transformLevelset, type DatTransformKind } from "../../src/dat/datTransforms";

import { renderCc1LevelToRgba } from "../../src/dat/render/cc1LevelRenderer";
import type { CC1SpriteSet } from "../../src/dat/render/cc1SpriteSet";
import { loadCc1SpriteSet } from "./loadCc1SpriteSet";
import {
  NOISE_TYPE_OPTIONS,
  TILE_OPTIONS,
  applyNoiseToLevel,
  createDefaultNoiseSettings,
  type NoiseSettings,
} from "./generate/noise";
import { clearLevel, replaceSelectedLevel } from "./levelEditing";

type ViewMode = "json" | "image";
type MenuKey = "file" | "edit" | "transform" | "generate" | "view";
type GenerateModule = "noise";
type NoiseNumberKey = Exclude<keyof NoiseSettings, "type" | "tile">;

const TRANSFORMS: Array<{ label: string; op: DatTransformKind }> = [
  { label: "Rot 90", op: "ROTATE_90" },
  { label: "Rot 180", op: "ROTATE_180" },
  { label: "Rot 270", op: "ROTATE_270" },
  { label: "Flip H", op: "FLIP_H" },
  { label: "Flip V", op: "FLIP_V" },
  { label: "Flip NW/SE", op: "FLIP_DIAG_NWSE" },
  { label: "Flip NE/SW", op: "FLIP_DIAG_NESW" },
];

const GENERATE_MODULES: Array<{ key: GenerateModule; label: string }> = [
  { key: "noise", label: "Noise" },
];

function makeRandomSeed(): number {
  return Math.floor(Math.random() * 0x100000000);
}

function makeDefaultNoiseSettings(): NoiseSettings {
  return {
    ...createDefaultNoiseSettings(),
    seed: makeRandomSeed(),
  };
}

function asErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadBytes(filename: string, bytes: Uint8Array): void {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  downloadBlob(filename, new Blob([ab], { type: "application/octet-stream" }));
}

function downloadText(filename: string, text: string): void {
  downloadBlob(filename, new Blob([text], { type: "application/octet-stream" }));
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return await new Promise((resolve) => canvas.toBlob(resolve));
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  size: number,
  traps: DatLevelsetJsonV1["levels"][number]["trapControls"],
  cloners: DatLevelsetJsonV1["levels"][number]["cloneControls"],
): void {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  const drawLine = (p1: number, p2: number) => {
    const x1 = (p1 % 32) * size + size / 2;
    const y1 = Math.floor(p1 / 32) * size + size / 2;
    const x2 = (p2 % 32) * size + size / 2;
    const y2 = Math.floor(p2 / 32) * size + size / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  for (const t of traps) drawLine(t.button, t.trap);
  for (const c of cloners) drawLine(c.button, c.cloner);

  ctx.restore();
}

function drawMonsterOrder(
  ctx: CanvasRenderingContext2D,
  size: number,
  movement: ReadonlyArray<number>,
): void {
  if (size < 32) return;

  const scale = size / 32;
  const fontSize = Math.max(10, Math.round(10 * scale));
  const padding = Math.max(2, Math.round(2 * scale));

  ctx.save();
  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "white";

  for (let idx = 0; idx < movement.length; idx++) {
    const p = movement[idx]!;
    const x = p % 32;
    const y = Math.floor(p / 32);

    const text = String(idx);

    const rightX = x * size + 30 * scale;
    const topY = y * size + 20 * scale;

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;

    const tx = rightX - textWidth;
    const ty = topY;

    // black box behind
    ctx.fillStyle = "black";
    ctx.fillRect(tx - padding, ty - padding, textWidth + padding * 2, fontSize + padding * 2);

    ctx.fillStyle = "white";
    ctx.fillText(text, tx, ty);
  }

  ctx.restore();
}

const CC1_TILESET_URL = `${import.meta.env.BASE_URL}cc1/spritesheet.bmp`;

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("image");
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [selectedGenerator, setSelectedGenerator] = useState<GenerateModule | null>(null);

  const [doc, setDoc] = useState<DatLevelsetJsonV1 | null>(null);
  const [undoStack, setUndoStack] = useState<DatLevelsetJsonV1[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [jsonText, setJsonText] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [spriteSet, setSpriteSet] = useState<CC1SpriteSet | null>(null);
  const [spriteError, setSpriteError] = useState<string | null>(null);

  const [showSecrets, setShowSecrets] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showMonsterOrder, setShowMonsterOrder] = useState(true);
  const [noiseSettings, setNoiseSettings] = useState<NoiseSettings>(() =>
    makeDefaultNoiseSettings(),
  );
  const [lastAppliedNoiseSeed, setLastAppliedNoiseSeed] = useState<number | null>(null);

  const selectedLevel = useMemo(() => {
    if (!doc) return null;
    return doc.levels[selectedIndex] ?? null;
  }, [doc, selectedIndex]);

  const selectedNoiseType = useMemo(
    () =>
      NOISE_TYPE_OPTIONS.find((option) => option.value === noiseSettings.type) ??
      NOISE_TYPE_OPTIONS[0]!,
    [noiseSettings.type],
  );

  // load spritesheet
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setSpriteError(null);
        const ss = await loadCc1SpriteSet(CC1_TILESET_URL);
        if (cancelled) return;
        setSpriteSet(ss);
      } catch (e: unknown) {
        if (cancelled) return;
        setSpriteSet(null);
        setSpriteError(
          `CC1 tileset not loaded.\nExpected: web/public/cc1/spritesheet.bmp\nTried URL: ${CC1_TILESET_URL}\nError: ${asErrorMessage(e)}`,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadDocument = useCallback((next: DatLevelsetJsonV1) => {
    setDoc(next);
    setUndoStack([]);
    setJsonText(stringifyDatLevelsetJsonV1(next));
    setSelectedIndex(0);
    setParseError(null);
  }, []);

  const commitDocumentEdit = useCallback((previous: DatLevelsetJsonV1, next: DatLevelsetJsonV1) => {
    if (previous === next) return;
    setUndoStack((history) => [...history, previous]);
    setDoc(next);
    setJsonText(stringifyDatLevelsetJsonV1(next));
    setParseError(null);
  }, []);

  const openLevelsetJsonText = useCallback(
    (text: string) => {
      try {
        const u: unknown = JSON.parse(text);
        const d = parseDatLevelsetJsonV1(u);
        loadDocument(d);
      } catch (e: unknown) {
        setParseError(asErrorMessage(e));
      }
    },
    [loadDocument],
  );

  const openJson = useCallback(
    async (file: File) => {
      setFileName(file.name);
      const text = await file.text();
      openLevelsetJsonText(text);
    },
    [openLevelsetJsonText],
  );

  const openDat = useCallback(
    async (file: File) => {
      setFileName(file.name);
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        const d = decodeDatBytes(bytes);
        loadDocument(d);
      } catch (e: unknown) {
        setParseError(asErrorMessage(e));
      }
    },
    [loadDocument],
  );

  const onOpenClick = useCallback(() => fileInputRef.current?.click(), []);
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      if (!file) return;

      if (file.name.toLowerCase().endsWith(".dat")) void openDat(file);
      else void openJson(file);

      e.target.value = "";
    },
    [openDat, openJson],
  );

  const onDownloadJson = useCallback(() => {
    if (!doc) return;
    downloadText("levelset.json", stringifyDatLevelsetJsonV1(doc));
  }, [doc]);

  const onDownloadDat = useCallback(() => {
    if (!doc || parseError) return;
    const bytes = encodeDatBytes(doc);
    const out = fileName && fileName.toLowerCase().endsWith(".dat") ? fileName : "levelset.dat";
    downloadBytes(out, bytes);
  }, [doc, parseError, fileName]);

  const drawLevelToCanvas = useCallback(
    (canvas: HTMLCanvasElement, level: DatLevelsetJsonV1["levels"][number]) => {
      if (!spriteSet) throw new Error("CC1 tileset not loaded");

      const img = renderCc1LevelToRgba(level, spriteSet, { showSecrets });

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas 2D context unavailable");

      const clamped = new Uint8ClampedArray(img.data);
      const imageData = new ImageData(clamped, img.width, img.height);
      ctx.putImageData(imageData, 0, 0);

      if (showConnections) {
        drawConnections(ctx, spriteSet.tileSize, level.trapControls, level.cloneControls);
      }

      if (showMonsterOrder) {
        drawMonsterOrder(ctx, spriteSet.tileSize, level.movement);
      }
    },
    [showConnections, showMonsterOrder, showSecrets, spriteSet],
  );

  const onDownloadPng = useCallback(async () => {
    const level = selectedLevel;
    if (!level || parseError || !spriteSet) return;

    try {
      const canvas = document.createElement("canvas");
      drawLevelToCanvas(canvas, level);

      const blob = await canvasToBlob(canvas);
      if (!blob) return;

      downloadBlob(`level_${level.number}.png`, blob);
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, [drawLevelToCanvas, parseError, selectedLevel, spriteSet]);

  const applyTransform = useCallback(
    (op: DatTransformKind) => {
      if (!doc || parseError) return;
      const next = transformLevelset(doc, op);
      commitDocumentEdit(doc, next);
    },
    [commitDocumentEdit, doc, parseError],
  );

  const setNoiseSetting = useCallback(
    <K extends keyof NoiseSettings>(key: K, value: NoiseSettings[K]) => {
      setNoiseSettings((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const setNoiseNumberSetting = useCallback((key: NoiseNumberKey, value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    setNoiseSettings((current) => ({ ...current, [key]: parsed }));
  }, []);

  const applyNoiseGenerator = useCallback(() => {
    if (!doc || !selectedLevel || parseError) return;

    try {
      const appliedSeed = noiseSettings.seed;
      const next = replaceSelectedLevel(doc, selectedIndex, (level) =>
        applyNoiseToLevel(level, noiseSettings),
      );
      commitDocumentEdit(doc, next);
      setLastAppliedNoiseSeed(appliedSeed);
      setNoiseSettings((current) => ({ ...current, seed: makeRandomSeed() }));
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, [commitDocumentEdit, doc, noiseSettings, parseError, selectedIndex, selectedLevel]);

  const undoLastEdit = useCallback(() => {
    setUndoStack((history) => {
      const previous = history[history.length - 1];
      if (!previous) return history;
      setDoc(previous);
      setJsonText(stringifyDatLevelsetJsonV1(previous));
      setParseError(null);
      return history.slice(0, -1);
    });
  }, []);

  const clearSelectedLevel = useCallback(() => {
    if (!doc || !selectedLevel || parseError) return;
    const next = replaceSelectedLevel(doc, selectedIndex, clearLevel);
    commitDocumentEdit(doc, next);
  }, [commitDocumentEdit, doc, parseError, selectedIndex, selectedLevel]);

  const toggleMenu = useCallback((menu: MenuKey) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  }, []);

  const openMenuOnHover = useCallback((menu: MenuKey) => {
    setOpenMenu((current) => (current === null ? null : menu));
  }, []);

  const runMenuAction = useCallback((action: () => void | Promise<void>) => {
    setOpenMenu(null);
    void action();
  }, []);

  useEffect(() => {
    if (!openMenu) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!menuBarRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if ((!event.metaKey && !event.ctrlKey) || event.altKey || event.shiftKey) return;

      const key = event.key.toLowerCase();
      if (key === "z" && undoStack.length > 0) {
        event.preventDefault();
        undoLastEdit();
      }

      if (key === "e" && doc && selectedLevel && !parseError) {
        event.preventDefault();
        clearSelectedLevel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [clearSelectedLevel, doc, parseError, selectedLevel, undoLastEdit, undoStack.length]);

  // Render image view
  useEffect(() => {
    if (viewMode !== "image") return;
    if (!selectedLevel) return;
    if (!spriteSet) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      drawLevelToCanvas(canvas, selectedLevel);
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, [drawLevelToCanvas, selectedLevel, spriteSet, viewMode]);

  // Load sample by default
  useEffect(() => {
    void (async () => {
      if (doc) return;
      const resp = await fetch(`${import.meta.env.BASE_URL}sample.levelset.json`);
      if (!resp.ok) return;
      openLevelsetJsonText(await resp.text());
    })();
  }, [doc, openLevelsetJsonText]);

  return (
    <div className="container">
      <div className="header">
        <div ref={menuBarRef} className="menuBar" role="menubar" aria-label="Application menu">
          <div className="menuShell" onMouseEnter={() => openMenuOnHover("file")}>
            <button
              className={`menuTrigger ${openMenu === "file" ? "open" : ""}`}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={openMenu === "file"}
              onClick={() => toggleMenu("file")}
            >
              File
            </button>
            {openMenu === "file" ? (
              <div className="menuPanel" role="menu" aria-label="File">
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  onClick={() => runMenuAction(onOpenClick)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Open...</span>
                </button>
                <div className="menuSeparator" />
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  disabled={!doc || !!parseError}
                  onClick={() => runMenuAction(onDownloadDat)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Download DAT</span>
                </button>
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  disabled={!doc || !!parseError}
                  onClick={() => runMenuAction(onDownloadJson)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Download JSON</span>
                </button>
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  disabled={!selectedLevel || !spriteSet || !!parseError}
                  onClick={() => runMenuAction(onDownloadPng)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Download PNG</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="menuShell" onMouseEnter={() => openMenuOnHover("edit")}>
            <button
              className={`menuTrigger ${openMenu === "edit" ? "open" : ""}`}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={openMenu === "edit"}
              onClick={() => toggleMenu("edit")}
            >
              Edit
            </button>
            {openMenu === "edit" ? (
              <div className="menuPanel" role="menu" aria-label="Edit">
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  disabled={undoStack.length === 0}
                  onClick={() => runMenuAction(undoLastEdit)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Undo</span>
                  <span className="menuShortcut">Cmd+Z</span>
                </button>
                <div className="menuSeparator" />
                <button
                  className="menuItem"
                  type="button"
                  role="menuitem"
                  disabled={!doc || !selectedLevel || !!parseError}
                  onClick={() => runMenuAction(clearSelectedLevel)}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Clear Level</span>
                  <span className="menuShortcut">Cmd+E</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="menuShell" onMouseEnter={() => openMenuOnHover("transform")}>
            <button
              className={`menuTrigger ${openMenu === "transform" ? "open" : ""}`}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={openMenu === "transform"}
              onClick={() => toggleMenu("transform")}
            >
              Transform
            </button>
            {openMenu === "transform" ? (
              <div className="menuPanel" role="menu" aria-label="Transform">
                {TRANSFORMS.map((t) => (
                  <button
                    key={t.op}
                    className="menuItem"
                    type="button"
                    role="menuitem"
                    disabled={!doc || !!parseError}
                    onClick={() => runMenuAction(() => applyTransform(t.op))}
                  >
                    <span className="menuMark" aria-hidden="true" />
                    <span className="menuLabel">{t.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="menuShell" onMouseEnter={() => openMenuOnHover("generate")}>
            <button
              className={`menuTrigger ${openMenu === "generate" ? "open" : ""}`}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={openMenu === "generate"}
              onClick={() => toggleMenu("generate")}
            >
              Generate
            </button>
            {openMenu === "generate" ? (
              <div className="menuPanel" role="menu" aria-label="Generate">
                {GENERATE_MODULES.map((module) => (
                  <button
                    key={module.key}
                    className={`menuItem ${selectedGenerator === module.key ? "checked" : ""}`}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selectedGenerator === module.key}
                    onClick={() => runMenuAction(() => setSelectedGenerator(module.key))}
                  >
                    <span className="menuMark" aria-hidden="true" />
                    <span className="menuLabel">{module.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="menuShell" onMouseEnter={() => openMenuOnHover("view")}>
            <button
              className={`menuTrigger ${openMenu === "view" ? "open" : ""}`}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={openMenu === "view"}
              onClick={() => toggleMenu("view")}
            >
              View
            </button>
            {openMenu === "view" ? (
              <div className="menuPanel" role="menu" aria-label="View">
                <button
                  className={`menuItem ${viewMode === "image" ? "checked" : ""}`}
                  type="button"
                  role="menuitemradio"
                  aria-checked={viewMode === "image"}
                  onClick={() => runMenuAction(() => setViewMode("image"))}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Image</span>
                </button>
                <button
                  className={`menuItem ${viewMode === "json" ? "checked" : ""}`}
                  type="button"
                  role="menuitemradio"
                  aria-checked={viewMode === "json"}
                  onClick={() => runMenuAction(() => setViewMode("json"))}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">JSON</span>
                </button>
                <div className="menuSeparator" />
                <button
                  className={`menuItem ${showSecrets ? "checked" : ""}`}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={showSecrets}
                  onClick={() => runMenuAction(() => setShowSecrets((value) => !value))}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Secrets</span>
                </button>
                <button
                  className={`menuItem ${showConnections ? "checked" : ""}`}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={showConnections}
                  onClick={() => runMenuAction(() => setShowConnections((value) => !value))}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Connections</span>
                </button>
                <button
                  className={`menuItem ${showMonsterOrder ? "checked" : ""}`}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={showMonsterOrder}
                  onClick={() => runMenuAction(() => setShowMonsterOrder((value) => !value))}
                >
                  <span className="menuMark" aria-hidden="true" />
                  <span className="menuLabel">Monster order</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="headerStatus">
          <span className="badge">{fileName ?? "no file"}</span>
          <span className="badge">{doc ? `levels=${doc.levels.length}` : "no doc"}</span>
          <span className="badge">{parseError ? "INVALID" : "OK"}</span>
          <span className="badge">
            {spriteSet ? `tileset=${spriteSet.tileSize}px` : "tileset=missing"}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".dat,.json"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </div>

      {spriteError ? (
        <div className="msg error" style={{ margin: 12 }}>
          {spriteError}
        </div>
      ) : null}

      <div className="main">
        <div className="sidebar">
          {doc?.levels.map((lv, i) => (
            <div
              key={lv.number}
              className={`sidebarItem ${i === selectedIndex ? "selected" : ""}`}
              onClick={() => setSelectedIndex(i)}
            >
              {lv.number}. {lv.title ?? `Level ${lv.number}`}
            </div>
          )) ?? <div className="sidebarItem">Open a .dat or .json…</div>}
        </div>

        <div className="content">
          <div className={`workspace ${selectedGenerator ? "hasGeneratorPanel" : ""}`}>
            <div className="pane">
              {parseError ? <div className="msg error">{parseError}</div> : null}

              {selectedLevel ? (
                viewMode === "json" ? (
                  <textarea
                    spellCheck={false}
                    readOnly
                    value={JSON.stringify(selectedLevel, null, 2) + "\n"}
                  />
                ) : (
                  <canvas ref={canvasRef} />
                )
              ) : (
                <div className="msg">No level selected.</div>
              )}
            </div>

            {selectedGenerator === "noise" ? (
              <aside className="generatorPanel">
                <div className="generatorHeader">
                  <div>
                    <div className="generatorEyebrow">Generate Options</div>
                    <div className="generatorTitle">Noise</div>
                  </div>
                  <button
                    type="button"
                    className="generatorClose"
                    onClick={() => setSelectedGenerator(null)}
                  >
                    Close
                  </button>
                </div>

                <p className="generatorSummary">{selectedNoiseType.description}</p>
                <p className="generatorSummary">Applies the selected tile to the bottom layer.</p>

                <div className="generatorField">
                  <label className="generatorLabel" htmlFor="noise-type">
                    Type
                  </label>
                  <select
                    id="noise-type"
                    className="generatorControl"
                    value={noiseSettings.type}
                    onChange={(e) =>
                      setNoiseSetting("type", e.target.value as NoiseSettings["type"])
                    }
                  >
                    {NOISE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="generatorField">
                  <label className="generatorLabel" htmlFor="noise-tile">
                    Tile
                  </label>
                  <select
                    id="noise-tile"
                    className="generatorControl"
                    value={noiseSettings.tile}
                    onChange={(e) => setNoiseSetting("tile", e.target.value)}
                  >
                    {TILE_OPTIONS.map((tileName) => (
                      <option key={tileName} value={tileName}>
                        {tileName}
                      </option>
                    ))}
                  </select>
                </div>

                {noiseSettings.type === "random" ? (
                  <>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-density">
                        Density
                      </label>
                      <input
                        id="noise-density"
                        className="generatorControl"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={noiseSettings.density}
                        onChange={(e) => setNoiseNumberSetting("density", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-seed-random">
                        Seed
                      </label>
                      <input
                        id="noise-seed-random"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.seed}
                        onChange={(e) => setNoiseNumberSetting("seed", e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                {noiseSettings.type === "perlin" ? (
                  <>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-scale">
                        Scale
                      </label>
                      <input
                        id="noise-scale"
                        className="generatorControl"
                        type="number"
                        min="1"
                        step="0.5"
                        value={noiseSettings.scale}
                        onChange={(e) => setNoiseNumberSetting("scale", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-threshold-perlin">
                        Threshold
                      </label>
                      <input
                        id="noise-threshold-perlin"
                        className="generatorControl"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={noiseSettings.threshold}
                        onChange={(e) => setNoiseNumberSetting("threshold", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-octaves">
                        Octaves
                      </label>
                      <input
                        id="noise-octaves"
                        className="generatorControl"
                        type="number"
                        min="1"
                        max="8"
                        step="1"
                        value={noiseSettings.octaves}
                        onChange={(e) => setNoiseNumberSetting("octaves", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-seed-perlin">
                        Seed
                      </label>
                      <input
                        id="noise-seed-perlin"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.seed}
                        onChange={(e) => setNoiseNumberSetting("seed", e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                {noiseSettings.type === "cellular" ? (
                  <>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-cell-size">
                        Cell Size
                      </label>
                      <input
                        id="noise-cell-size"
                        className="generatorControl"
                        type="number"
                        min="1"
                        step="1"
                        value={noiseSettings.cellSize}
                        onChange={(e) => setNoiseNumberSetting("cellSize", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-jitter">
                        Jitter
                      </label>
                      <input
                        id="noise-jitter"
                        className="generatorControl"
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={noiseSettings.jitter}
                        onChange={(e) => setNoiseNumberSetting("jitter", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-threshold-cell">
                        Threshold
                      </label>
                      <input
                        id="noise-threshold-cell"
                        className="generatorControl"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={noiseSettings.threshold}
                        onChange={(e) => setNoiseNumberSetting("threshold", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-seed-cell">
                        Seed
                      </label>
                      <input
                        id="noise-seed-cell"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.seed}
                        onChange={(e) => setNoiseNumberSetting("seed", e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                {noiseSettings.type === "stripes" ? (
                  <>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-spacing">
                        Spacing
                      </label>
                      <input
                        id="noise-spacing"
                        className="generatorControl"
                        type="number"
                        min="1"
                        step="1"
                        value={noiseSettings.spacing}
                        onChange={(e) => setNoiseNumberSetting("spacing", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-thickness">
                        Thickness
                      </label>
                      <input
                        id="noise-thickness"
                        className="generatorControl"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={noiseSettings.thickness}
                        onChange={(e) => setNoiseNumberSetting("thickness", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-angle">
                        Angle
                      </label>
                      <input
                        id="noise-angle"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.angle}
                        onChange={(e) => setNoiseNumberSetting("angle", e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                {noiseSettings.type === "checker" ? (
                  <>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-checker-size">
                        Cell Size
                      </label>
                      <input
                        id="noise-checker-size"
                        className="generatorControl"
                        type="number"
                        min="1"
                        step="1"
                        value={noiseSettings.checkerSize}
                        onChange={(e) => setNoiseNumberSetting("checkerSize", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-offset-x">
                        Offset X
                      </label>
                      <input
                        id="noise-offset-x"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.offsetX}
                        onChange={(e) => setNoiseNumberSetting("offsetX", e.target.value)}
                      />
                    </div>
                    <div className="generatorField">
                      <label className="generatorLabel" htmlFor="noise-offset-y">
                        Offset Y
                      </label>
                      <input
                        id="noise-offset-y"
                        className="generatorControl"
                        type="number"
                        step="1"
                        value={noiseSettings.offsetY}
                        onChange={(e) => setNoiseNumberSetting("offsetY", e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                <div className="generatorActions">
                  <button
                    type="button"
                    onClick={applyNoiseGenerator}
                    disabled={!doc || !selectedLevel || !!parseError}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoiseSettings(makeDefaultNoiseSettings())}
                  >
                    Reset
                  </button>
                </div>

                <div className="generatorMeta">
                  Last seed:{" "}
                  {lastAppliedNoiseSeed === null ? "not applied yet" : lastAppliedNoiseSeed}
                </div>

                {!selectedLevel ? (
                  <div className="msg">Open or select a level before generating.</div>
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
