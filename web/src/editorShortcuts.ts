export type EditorToolMode = "brush" | "text" | "line" | "fill" | "select" | "connect";

export type EditorShortcutCommand =
  | Readonly<{ type: "undo" }>
  | Readonly<{ type: "redo" }>
  | Readonly<{ type: "select-all" }>
  | Readonly<{ type: "copy-selection" }>
  | Readonly<{ type: "cut-selection" }>
  | Readonly<{ type: "start-paste-preview" }>
  | Readonly<{ type: "test-ms" }>
  | Readonly<{ type: "test-lynx" }>
  | Readonly<{ type: "test-lexy" }>
  | Readonly<{ type: "next-level" }>
  | Readonly<{ type: "previous-level" }>
  | Readonly<{ type: "rotate-left" }>
  | Readonly<{ type: "rotate-right" }>
  | Readonly<{ type: "cancel-pending-connection" }>
  | Readonly<{ type: "cancel-selection" }>
  | Readonly<{ type: "select-layer-up" }>
  | Readonly<{ type: "select-layer-down" }>
  | Readonly<{ type: "erase-selection" }>
  | Readonly<{ type: "set-tool"; tool: EditorToolMode }>;

export type EditorShortcutContext = Readonly<{
  hasActiveLevel: boolean;
  hasSelection: boolean;
  hasClipboard: boolean;
  hasPendingConnection: boolean;
  selectionToolActive: boolean;
  threeDLevelsEnabled: boolean;
  hasSelectedLogicalLevel: boolean;
}>;

export type ShortcutKeyEventLike = Readonly<{
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}>;

export const TOOL_SHORTCUTS: ReadonlyArray<
  Readonly<{
    id: EditorToolMode;
    label: string;
    shortcut: string;
  }>
> = Object.freeze([
  { id: "brush", label: "Brush", shortcut: "B" },
  { id: "text", label: "Text", shortcut: "T" },
  { id: "line", label: "Line", shortcut: "L" },
  { id: "fill", label: "Bucket", shortcut: "F" },
  { id: "select", label: "Select", shortcut: "V" },
  { id: "connect", label: "Connect", shortcut: "C" },
]);

export function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (typeof target !== "object" || target === null) return false;

  if ("isContentEditable" in target && target.isContentEditable === true) return true;
  if (!("tagName" in target) || typeof target.tagName !== "string") return false;

  const tagName = target.tagName.toUpperCase();
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

export function resolveEditorShortcut(
  event: ShortcutKeyEventLike,
  context: EditorShortcutContext,
): EditorShortcutCommand | null {
  const key = event.key.toLowerCase();
  const meta = event.metaKey || event.ctrlKey;

  if (meta && !event.altKey) {
    if (!event.shiftKey && key === "z") return { type: "undo" };
    if ((event.shiftKey && key === "z") || key === "y") return { type: "redo" };
    if (key === "a" && context.hasActiveLevel) return { type: "select-all" };
    if (key === "c" && context.hasSelection) return { type: "copy-selection" };
    if (key === "x" && context.hasSelection) return { type: "cut-selection" };
    if (key === "v" && context.hasClipboard) return { type: "start-paste-preview" };
    if (key === "5") return { type: "test-ms" };
    if (key === "6") return { type: "test-lynx" };
    if (key === "7") return { type: "test-lexy" };
    return null;
  }

  if (event.altKey || event.ctrlKey || event.metaKey) return null;

  if (key === "f5") return { type: "test-ms" };
  if (key === "f6") return { type: "test-lynx" };
  if (key === "f7") return { type: "test-lexy" };
  if (key === "n") return { type: "next-level" };
  if (key === "p") return { type: "previous-level" };
  if (key === "," || key === "<") return { type: "rotate-left" };
  if (key === "." || key === ">") return { type: "rotate-right" };
  if (key === "escape" && context.hasPendingConnection)
    return { type: "cancel-pending-connection" };
  if (key === "escape" && context.selectionToolActive) return { type: "cancel-selection" };
  if (context.threeDLevelsEnabled && context.hasSelectedLogicalLevel && key === "q") {
    return { type: "select-layer-up" };
  }
  if (context.threeDLevelsEnabled && context.hasSelectedLogicalLevel && key === "z") {
    return { type: "select-layer-down" };
  }
  if (key === "b") return { type: "set-tool", tool: "brush" };
  if (key === "t") return { type: "set-tool", tool: "text" };
  if (key === "c") return { type: "set-tool", tool: "connect" };
  if (key === "l") return { type: "set-tool", tool: "line" };
  if (key === "f") return { type: "set-tool", tool: "fill" };
  if (key === "v") return { type: "set-tool", tool: "select" };
  if ((key === "backspace" || key === "delete") && context.hasSelection) {
    return { type: "erase-selection" };
  }
  return null;
}
