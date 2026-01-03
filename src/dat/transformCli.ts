import type { DatTransformKind } from "./datTransforms.js";
export { transformLevelset } from "./datTransforms.js";

export function parseTransformKind(op: string): DatTransformKind {
  const s = op.trim().toLowerCase().replace(/_/g, "-");
  if (s === "rot90" || s === "rotate-90" || s === "rotate90") return "ROTATE_90";
  if (s === "rot180" || s === "rotate-180" || s === "rotate180") return "ROTATE_180";
  if (s === "rot270" || s === "rotate-270" || s === "rotate270") return "ROTATE_270";
  if (s === "flip-h" || s === "fliph" || s === "flip-horizontal") return "FLIP_H";
  if (s === "flip-v" || s === "flipv" || s === "flip-vertical") return "FLIP_V";
  if (s === "flip-nwse" || s === "diag-nwse") return "FLIP_DIAG_NWSE";
  if (s === "flip-nesw" || s === "diag-nesw") return "FLIP_DIAG_NESW";
  throw new Error(`Unknown transform '${op}'`);
}
