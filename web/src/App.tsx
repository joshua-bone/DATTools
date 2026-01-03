import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelsetJsonV1,
} from "../../src/dat/datLevelsetJsonV1";
import { decodeDatBytes, encodeDatBytes } from "../../src/dat/datCodec";
import { transformLevelset, type DatTransformKind } from "../../src/dat/datTransforms";

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
  downloadBlob(filename, new Blob([text], { type: "application/json" }));
}

function renderPlaceholderLevel(
  canvas: HTMLCanvasElement,
  level: DatLevelsetJsonV1["levels"][number],
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = level.map.width;
  const H = level.map.height;
  const cell = 10;

  canvas.width = W * cell;
  canvas.height = H * cell;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // bottom layer as base; top overlay as small inset if not FLOOR
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const bot = level.map.bottom[i] ?? "FLOOR";
      const top = level.map.top[i] ?? "FLOOR";

      // hash -> rgb
      const hashColor = (name: string): [number, number, number] => {
        let h = 2166136261;
        for (let k = 0; k < name.length; k++) h = (h ^ name.charCodeAt(k)) * 16777619;
        return [(h >>> 0) & 255, (h >>> 8) & 255, (h >>> 16) & 255];
      };

      const [br, bg, bb] = hashColor(bot);
      ctx.fillStyle = `rgb(${br},${bg},${bb})`;
      ctx.fillRect(x * cell, y * cell, cell, cell);

      if (top !== "FLOOR") {
        const [tr, tg, tb] = hashColor(top);
        ctx.fillStyle = `rgb(${tr},${tg},${tb})`;
        const inset = Math.max(2, Math.floor(cell / 3));
        ctx.fillRect(x * cell + inset, y * cell + inset, cell - 2 * inset, cell - 2 * inset);
      }
    }
  }
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("json");

  const [doc, setDoc] = useState<DatLevelsetJsonV1 | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [jsonText, setJsonText] = useState<string>(""); // full levelset JSON (for download)
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const selectedLevel = useMemo(() => {
    if (!doc) return null;
    return doc.levels[selectedIndex] ?? null;
  }, [doc, selectedIndex]);

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

  useEffect(() => {
    if (viewMode !== "image") return;
    if (!selectedLevel) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPlaceholderLevel(canvas, selectedLevel);
  }, [viewMode, selectedLevel]);

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

        <div className="spacer" />
        <span className="badge">{fileName ?? "no file"}</span>
        <span className="badge">{doc ? `levels=${doc.levels.length}` : "no doc"}</span>
        <span className="badge">{parseError ? "INVALID" : "OK"}</span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".dat,.json"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </div>

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
