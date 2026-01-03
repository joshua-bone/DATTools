import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  parseDatLevelsetJsonV1,
  stringifyDatLevelsetJsonV1,
  type DatLevelsetJsonV1,
} from "../../src/dat/datLevelsetJsonV1";
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

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

  // Basic deterministic coloring based on tile string
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const t = level.map.top[i];
      if (!t) continue;
      const name = t;
      let h = 2166136261;
      for (let k = 0; k < name.length; k++) h = (h ^ name.charCodeAt(k)) * 16777619;
      const r = (h >>> 0) & 255;
      const g = (h >>> 8) & 255;
      const b = (h >>> 16) & 255;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("json");

  const [doc, setDoc] = useState<DatLevelsetJsonV1 | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [jsonText, setJsonText] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);

  const selectedLevel = useMemo(() => {
    if (!doc) return null;
    return doc.levels[selectedIndex] ?? null;
  }, [doc, selectedIndex]);

  const openJson = useCallback(async (file: File) => {
    const text = await file.text();
    setJsonText(text);
  }, []);

  const onOpenClick = useCallback(() => fileInputRef.current?.click(), []);
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      if (!file) return;
      void openJson(file);
      e.target.value = "";
    },
    [openJson],
  );

  // Parse JSON (debounced)
  useEffect(() => {
    if (!jsonText.trim()) return;
    const h = window.setTimeout(() => {
      try {
        const u: unknown = JSON.parse(jsonText);
        const d = parseDatLevelsetJsonV1(u);
        setDoc(d);
        setParseError(null);
        setSelectedIndex(0);
      } catch (e: unknown) {
        setParseError(asErrorMessage(e));
      }
    }, 300);
    return () => window.clearTimeout(h);
  }, [jsonText]);

  const onSaveJson = useCallback(() => {
    if (!doc) return;
    downloadText("levelset.json", stringifyDatLevelsetJsonV1(doc));
  }, [doc]);

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

  // Load sample by default (so the app works immediately)
  useEffect(() => {
    void (async () => {
      if (doc) return;
      const resp = await fetch(`${import.meta.env.BASE_URL}sample.levelset.json`);
      if (!resp.ok) return;
      setJsonText(await resp.text());
    })();
  }, [doc]);

  return (
    <div className="container">
      <div className="header">
        <button onClick={onOpenClick}>Open Levelset JSON…</button>
        <button onClick={onSaveJson} disabled={!doc || !!parseError}>
          Download JSON
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
        <span className="badge">{doc ? `levels=${doc.levels.length}` : "no doc"}</span>
        <span className="badge">{parseError ? "JSON: INVALID" : "JSON: OK"}</span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
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
          )) ?? <div className="sidebarItem">Load a levelset JSON…</div>}
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
