export type LevelsetFileKind = "dat" | "json";

export function getLevelsetFileKind(fileName: string): LevelsetFileKind {
  return fileName.toLowerCase().endsWith(".dat") ? "dat" : "json";
}
