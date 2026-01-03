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

type ViewMode = "json" | "image";

const TRANSFORMS: Array<{ label: string; op: DatTransformKind }> = [
  { label: "Rot 90", op: "ROTATE_90" },
  { label: "Rot 180", op: "ROTATE_180" },
  { label: "Rot 270", op: "ROTATE_270" },
  { label: "Flip H", op: "FLIP_H" },
  { label: "Flip V", op: "FLIP_V" },
  { label: "Flip NW/SE", op: "FLIP_DIAG_NWSE" },
  { label: "Flip NE/SW", op: "FLIP_DIAG_NESW" },
];

function asErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
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

  const [viewMode, setViewMode] = useState<ViewMode>("json");

  const [doc, setDoc] = useState<DatLevelsetJsonV1 | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [jsonText, setJsonText] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [spriteSet, setSpriteSet] = useState<CC1SpriteSet | null>(null);
  const [spriteError, setSpriteError] = useState<string | null>(null);

  const [showSecrets, setShowSecrets] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showMonsterOrder, setShowMonsterOrder] = useState(true);

  const selectedLevel = useMemo(() => {
    if (!doc) return null;
    return doc.levels[selectedIndex] ?? null;
  }, [doc, selectedIndex]);

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

  const openLevelsetJsonText = useCallback((text: string) => {
    try {
      const u: unknown = JSON.parse(text);
      const d = parseDatLevelsetJsonV1(u);
      setDoc(d);
      setJsonText(stringifyDatLevelsetJsonV1(d));
      setSelectedIndex(0);
      setParseError(null);
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, []);

  const openJson = useCallback(
    async (file: File) => {
      setFileName(file.name);
      const text = await file.text();
      openLevelsetJsonText(text);
    },
    [openLevelsetJsonText],
  );

  const openDat = useCallback(async (file: File) => {
    setFileName(file.name);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const d = decodeDatBytes(bytes);
      setDoc(d);
      setJsonText(stringifyDatLevelsetJsonV1(d));
      setSelectedIndex(0);
      setParseError(null);
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, []);

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

  const onDownloadPng = useCallback(async () => {
    const canvas = canvasRef.current;
    const level = selectedLevel;
    if (!canvas || !level) return;

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve));
    if (!blob) return;

    downloadBlob(`level_${level.number}.png`, blob);
  }, [selectedLevel]);

  const applyTransform = useCallback(
    (op: DatTransformKind) => {
      if (!doc || parseError) return;
      const next = transformLevelset(doc, op);
      setDoc(next);
      setJsonText(stringifyDatLevelsetJsonV1(next));
    },
    [doc, parseError],
  );

  // Render image view
  useEffect(() => {
    if (viewMode !== "image") return;
    if (!selectedLevel) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!spriteSet) return;

    try {
      const img = renderCc1LevelToRgba(selectedLevel, spriteSet, { showSecrets });

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas 2D context unavailable");

      const clamped = new Uint8ClampedArray(img.data);
      const imageData = new ImageData(clamped, img.width, img.height);
      ctx.putImageData(imageData, 0, 0);

      if (showConnections) {
        drawConnections(
          ctx,
          spriteSet.tileSize,
          selectedLevel.trapControls,
          selectedLevel.cloneControls,
        );
      }

      if (showMonsterOrder) {
        drawMonsterOrder(ctx, spriteSet.tileSize, selectedLevel.movement);
      }
    } catch (e: unknown) {
      setParseError(asErrorMessage(e));
    }
  }, [viewMode, selectedLevel, spriteSet, showSecrets, showConnections, showMonsterOrder]);

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
        <button onClick={onOpenClick}>Open DAT/JSON…</button>

        <button onClick={onDownloadDat} disabled={!doc || !!parseError}>
          Download DAT
        </button>

        <button onClick={onDownloadJson} disabled={!doc || !!parseError}>
          Download JSON
        </button>

        <button onClick={onDownloadPng} disabled={!selectedLevel || viewMode !== "image"}>
          Download PNG
        </button>

        <div className="tabs">
          <button onClick={() => setViewMode("json")} disabled={viewMode === "json"}>
            JSON
          </button>
          <button onClick={() => setViewMode("image")} disabled={viewMode === "image"}>
            Image
          </button>
        </div>

        <div className="tabs">
          {TRANSFORMS.map((t) => (
            <button key={t.op} onClick={() => applyTransform(t.op)} disabled={!doc || !!parseError}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="tabs">
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showSecrets}
              onChange={(e) => setShowSecrets(e.target.checked)}
            />
            Secrets
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showConnections}
              onChange={(e) => setShowConnections(e.target.checked)}
            />
            Connections
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showMonsterOrder}
              onChange={(e) => setShowMonsterOrder(e.target.checked)}
            />
            Monster order
          </label>
        </div>

        <div className="spacer" />
        <span className="badge">{fileName ?? "no file"}</span>
        <span className="badge">{doc ? `levels=${doc.levels.length}` : "no doc"}</span>
        <span className="badge">{parseError ? "INVALID" : "OK"}</span>
        <span className="badge">
          {spriteSet ? `tileset=${spriteSet.tileSize}px` : "tileset=missing"}
        </span>

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
        </div>
      </div>
    </div>
  );
}
