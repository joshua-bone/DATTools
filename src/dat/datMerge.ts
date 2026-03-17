import type { DatLevelJson, DatLevelsetJsonV1 } from "@/src/dat/datLevelsetJsonV1";

function cloneLevel(level: DatLevelJson, number: number): DatLevelJson {
  return {
    ...level,
    number,
    map: {
      ...level.map,
      top: [...level.map.top],
      bottom: [...level.map.bottom],
    },
    trapControls: [...level.trapControls],
    cloneControls: [...level.cloneControls],
    movement: [...level.movement],
    fieldOrder: [...level.fieldOrder],
    extraFields: [...level.extraFields],
  };
}

export function mergeDatLevelsets(docs: ReadonlyArray<DatLevelsetJsonV1>): DatLevelsetJsonV1 {
  if (docs.length === 0) throw new Error("At least one DAT levelset is required");

  const magicNumber = docs[0]!.magicNumber;
  const levels: DatLevelJson[] = [];
  let nextLevelNumber = 1;

  for (const doc of docs) {
    if (doc.magicNumber !== magicNumber) {
      throw new Error(
        `DAT magic number mismatch: expected 0x${magicNumber.toString(16)}, got 0x${doc.magicNumber.toString(16)}`,
      );
    }

    for (const level of doc.levels) {
      levels.push(cloneLevel(level, nextLevelNumber));
      nextLevelNumber += 1;
    }
  }

  return {
    schema: "datTools.dat.levelset.json.v1",
    magicNumber,
    levels,
  };
}
