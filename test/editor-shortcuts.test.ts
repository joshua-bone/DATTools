import { describe, expect, it } from "vitest";

import {
  TOOL_SHORTCUTS,
  isEditableShortcutTarget,
  resolveEditorShortcut,
} from "../web/src/editorShortcuts.js";

const DEFAULT_CONTEXT = {
  hasActiveLevel: true,
  hasSelection: false,
  hasClipboard: false,
  hasPendingConnection: false,
  selectionToolActive: false,
  threeDLevelsEnabled: false,
  hasSelectedLogicalLevel: false,
} as const;

describe("editor shortcuts", () => {
  it("publishes the DAT tool shortcuts in toolbar order", () => {
    expect(TOOL_SHORTCUTS).toEqual([
      { id: "brush", label: "Brush", shortcut: "B" },
      { id: "text", label: "Text", shortcut: "T" },
      { id: "line", label: "Line", shortcut: "L" },
      { id: "fill", label: "Bucket", shortcut: "F" },
      { id: "select", label: "Select", shortcut: "V" },
      { id: "connect", label: "Connect", shortcut: "C" },
    ]);
  });

  it("resolves undo, redo, select-all, copy, cut, paste, and DAT test commands", () => {
    expect(
      resolveEditorShortcut(
        {
          key: "z",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "undo" });

    expect(
      resolveEditorShortcut(
        {
          key: "y",
          metaKey: false,
          ctrlKey: true,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "redo" });

    expect(
      resolveEditorShortcut(
        {
          key: "a",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "select-all" });

    expect(
      resolveEditorShortcut(
        {
          key: "c",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, hasSelection: true },
      ),
    ).toEqual({ type: "copy-selection" });

    expect(
      resolveEditorShortcut(
        {
          key: "x",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, hasSelection: true },
      ),
    ).toEqual({ type: "cut-selection" });

    expect(
      resolveEditorShortcut(
        {
          key: "v",
          metaKey: false,
          ctrlKey: true,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, hasClipboard: true },
      ),
    ).toEqual({ type: "start-paste-preview" });

    expect(
      resolveEditorShortcut(
        {
          key: "5",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "test-ms" });

    expect(
      resolveEditorShortcut(
        {
          key: "F6",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "test-lynx" });

    expect(
      resolveEditorShortcut(
        {
          key: "F7",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "test-lexy" });
  });

  it("resolves navigation, rotate, layer, cancel, erase, and tool commands", () => {
    expect(
      resolveEditorShortcut(
        {
          key: "n",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "next-level" });

    expect(
      resolveEditorShortcut(
        {
          key: "p",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "previous-level" });

    expect(
      resolveEditorShortcut(
        {
          key: ",",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "rotate-left" });

    expect(
      resolveEditorShortcut(
        {
          key: ">",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "rotate-right" });

    expect(
      resolveEditorShortcut(
        {
          key: "Escape",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, hasPendingConnection: true, selectionToolActive: true },
      ),
    ).toEqual({ type: "cancel-pending-connection" });

    expect(
      resolveEditorShortcut(
        {
          key: "Escape",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, selectionToolActive: true },
      ),
    ).toEqual({ type: "cancel-selection" });

    expect(
      resolveEditorShortcut(
        {
          key: "Delete",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, hasSelection: true },
      ),
    ).toEqual({ type: "erase-selection" });

    expect(
      resolveEditorShortcut(
        {
          key: "q",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, threeDLevelsEnabled: true, hasSelectedLogicalLevel: true },
      ),
    ).toEqual({ type: "select-layer-up" });

    expect(
      resolveEditorShortcut(
        {
          key: "z",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        { ...DEFAULT_CONTEXT, threeDLevelsEnabled: true, hasSelectedLogicalLevel: true },
      ),
    ).toEqual({ type: "select-layer-down" });

    expect(
      resolveEditorShortcut(
        {
          key: "c",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "set-tool", tool: "connect" });

    expect(
      resolveEditorShortcut(
        {
          key: "v",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        },
        DEFAULT_CONTEXT,
      ),
    ).toEqual({ type: "set-tool", tool: "select" });
  });

  it("detects editable shortcut targets", () => {
    expect(isEditableShortcutTarget({ tagName: "input" } as unknown as EventTarget)).toBe(true);
    expect(isEditableShortcutTarget({ tagName: "TEXTAREA" } as unknown as EventTarget)).toBe(true);
    expect(isEditableShortcutTarget({ isContentEditable: true } as unknown as EventTarget)).toBe(
      true,
    );
    expect(isEditableShortcutTarget({ tagName: "button" } as unknown as EventTarget)).toBe(false);
  });
});
