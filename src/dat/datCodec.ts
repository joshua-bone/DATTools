// src/dat/datCodec.ts
import { BinaryReader, BinaryWriter } from "./binary.js";
import { decodeCp1252, encodeCp1252 } from "./cp1252.js";
import type {
  Base64Blob,
  DatExtraField,
  DatLevelJson,
  DatLevelsetJsonV1,
} from "./datLevelsetJsonV1.js";

const TITLE_FIELD = 3;
const TRAPS_FIELD = 4;
const CLONERS_FIELD = 5;
const PASSWORD_FIELD = 6;
const HINT_FIELD = 7;
const AUTHOR_FIELD = 9;
const MOVEMENT_FIELD = 10;

const STANDARD_FIELDS: ReadonlyArray<number> = [
  TITLE_FIELD,
  TRAPS_FIELD,
  CLONERS_FIELD,
  PASSWORD_FIELD,
  HINT_FIELD,
  AUTHOR_FIELD,
  MOVEMENT_FIELD,
];

// CC1 tile name mapping (from your Enum)
const TILE_NAME_BY_CODE = new Map<number, string>([
  [0, "FLOOR"],
  [1, "WALL"],
  [2, "CHIP"],
  [3, "WATER"],
  [4, "FIRE"],
  [5, "INV_WALL_PERM"],
  [6, "PANEL_N"],
  [7, "PANEL_W"],
  [8, "PANEL_S"],
  [9, "PANEL_E"],
  [10, "BLOCK"],
  [11, "DIRT"],
  [12, "ICE"],
  [13, "FORCE_S"],
  [14, "CLONE_BLOCK_N"],
  [15, "CLONE_BLOCK_W"],
  [16, "CLONE_BLOCK_S"],
  [17, "CLONE_BLOCK_E"],
  [18, "FORCE_N"],
  [19, "FORCE_E"],
  [20, "FORCE_W"],
  [21, "EXIT"],
  [22, "BLUE_DOOR"],
  [23, "RED_DOOR"],
  [24, "GREEN_DOOR"],
  [25, "YELLOW_DOOR"],
  [26, "ICE_SE"],
  [27, "ICE_SW"],
  [28, "ICE_NW"],
  [29, "ICE_NE"],
  [30, "BLUE_WALL_FAKE"],
  [31, "BLUE_WALL_REAL"],
  [32, "NOT_USED_0"],
  [33, "THIEF"],
  [34, "SOCKET"],
  [35, "GREEN_BUTTON"],
  [36, "CLONE_BUTTON"],
  [37, "TOGGLE_WALL"],
  [38, "TOGGLE_FLOOR"],
  [39, "TRAP_BUTTON"],
  [40, "TANK_BUTTON"],
  [41, "TELEPORT"],
  [42, "BOMB"],
  [43, "TRAP"],
  [44, "INV_WALL_APP"],
  [45, "GRAVEL"],
  [46, "POP_UP_WALL"],
  [47, "HINT"],
  [48, "PANEL_SE"],
  [49, "CLONER"],
  [50, "FORCE_RANDOM"],
  [51, "DROWN_CHIP"],
  [52, "BURNED_CHIP0"],
  [53, "BURNED_CHIP1"],
  [54, "NOT_USED_1"],
  [55, "NOT_USED_2"],
  [56, "NOT_USED_3"],
  [57, "CHIP_EXIT"],
  [58, "UNUSED_EXIT_0"],
  [59, "UNUSED_EXIT_1"],
  [60, "CHIP_SWIMMING_N"],
  [61, "CHIP_SWIMMING_W"],
  [62, "CHIP_SWIMMING_S"],
  [63, "CHIP_SWIMMING_E"],
  [64, "ANT_N"],
  [65, "ANT_W"],
  [66, "ANT_S"],
  [67, "ANT_E"],
  [68, "FIREBALL_N"],
  [69, "FIREBALL_W"],
  [70, "FIREBALL_S"],
  [71, "FIREBALL_E"],
  [72, "BALL_N"],
  [73, "BALL_W"],
  [74, "BALL_S"],
  [75, "BALL_E"],
  [76, "TANK_N"],
  [77, "TANK_W"],
  [78, "TANK_S"],
  [79, "TANK_E"],
  [80, "GLIDER_N"],
  [81, "GLIDER_W"],
  [82, "GLIDER_S"],
  [83, "GLIDER_E"],
  [84, "TEETH_N"],
  [85, "TEETH_W"],
  [86, "TEETH_S"],
  [87, "TEETH_E"],
  [88, "WALKER_N"],
  [89, "WALKER_W"],
  [90, "WALKER_S"],
  [91, "WALKER_E"],
  [92, "BLOB_N"],
  [93, "BLOB_W"],
  [94, "BLOB_S"],
  [95, "BLOB_E"],
  [96, "PARAMECIUM_N"],
  [97, "PARAMECIUM_W"],
  [98, "PARAMECIUM_S"],
  [99, "PARAMECIUM_E"],
  [100, "BLUE_KEY"],
  [101, "RED_KEY"],
  [102, "GREEN_KEY"],
  [103, "YELLOW_KEY"],
  [104, "FLIPPERS"],
  [105, "FIRE_BOOTS"],
  [106, "SKATES"],
  [107, "SUCTION_BOOTS"],
  [108, "PLAYER_N"],
  [109, "PLAYER_W"],
  [110, "PLAYER_S"],
  [111, "PLAYER_E"],
]);

const TILE_CODE_BY_NAME = new Map<string, number>();
for (const [k, v] of TILE_NAME_BY_CODE.entries()) TILE_CODE_BY_NAME.set(v, k);

function tileNameFromCode(code: number): string {
  const name = TILE_NAME_BY_CODE.get(code);
  if (name) return name;
  return `UNKNOWN_0x${code.toString(16).padStart(2, "0").toUpperCase()}`;
}

function tileCodeFromName(name: string): number {
  const known = TILE_CODE_BY_NAME.get(name);
  if (known !== undefined) return known;

  const m = /^UNKNOWN_0x([0-9A-Fa-f]{2})$/.exec(name);
  if (m) return parseInt(m[1]!, 16);

  throw new Error(`Unknown tile name '${name}' (expected known name or UNKNOWN_0xNN)`);
}

function b64(bytes: Uint8Array): Base64Blob {
  return { encoding: "base64", dataBase64: Buffer.from(bytes).toString("base64") };
}

function unb64(blob: Base64Blob): Uint8Array {
  return new Uint8Array(Buffer.from(blob.dataBase64, "base64"));
}

function decryptPassword(enc: Uint8Array): string {
  const out = new Uint8Array(enc.length);
  for (let i = 0; i < enc.length; i++) out[i] = enc[i]! ^ 0x99;
  return decodeCp1252(out);
}

function encryptPassword(plain: string): Uint8Array {
  const bytes = encodeCp1252(plain);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i]! ^ 0x99;
  return out;
}

function parseLayer(layerBytes: Uint8Array): number[] {
  const r = new BinaryReader(layerBytes);
  const out: number[] = [];
  while (out.length < 32 * 32) {
    const b = r.readU8();
    if (b === 0xff) {
      const len = r.readU8();
      const tile = r.readU8();
      for (let i = 0; i < len; i++) out.push(tile);
    } else {
      out.push(b);
    }
  }
  if (out.length !== 1024) throw new Error(`Layer length mismatch: ${out.length}`);
  return out;
}

function compressLayer(layer: ReadonlyArray<number>): Uint8Array {
  const w = new BinaryWriter();
  let index = 0;

  while (index < layer.length) {
    const c = layer[index]!;
    let end = index;
    while (end + 1 < layer.length && layer[end + 1] === c && end + 1 - index < 255) {
      end += 1;
    }
    const length = end + 1 - index;

    if (length <= 3) {
      for (let i = 0; i < length; i++) w.writeU8(c);
    } else {
      w.writeU8(0xff);
      w.writeU8(length);
      w.writeU8(c);
    }

    index += length;
  }

  return w.toBytes();
}

function parseTraps(content: Uint8Array): DatLevelJson["trapControls"] {
  if (content.length % 10 !== 0)
    throw new Error(`TRAPS field length not multiple of 10: ${content.length}`);
  const r = new BinaryReader(content);
  const out: Array<DatLevelJson["trapControls"][number]> = [];
  const n = content.length / 10;
  for (let i = 0; i < n; i++) {
    const bx = r.readU16LE();
    const by = r.readU16LE();
    const tx = r.readU16LE();
    const ty = r.readU16LE();
    const openOrShut = r.readU16LE();
    out.push({ button: by * 32 + bx, trap: ty * 32 + tx, openOrShut });
  }
  return out;
}

function parseCloners(content: Uint8Array): DatLevelJson["cloneControls"] {
  if (content.length % 8 !== 0)
    throw new Error(`CLONERS field length not multiple of 8: ${content.length}`);
  const r = new BinaryReader(content);
  const out: Array<DatLevelJson["cloneControls"][number]> = [];
  const n = content.length / 8;
  for (let i = 0; i < n; i++) {
    const bx = r.readU16LE();
    const by = r.readU16LE();
    const cx = r.readU16LE();
    const cy = r.readU16LE();
    out.push({ button: by * 32 + bx, cloner: cy * 32 + cx });
  }
  return out;
}

function parseMovement(content: Uint8Array): number[] {
  if (content.length % 2 !== 0)
    throw new Error(`MOVEMENT field length not multiple of 2: ${content.length}`);
  const r = new BinaryReader(content);
  const out: number[] = [];
  const n = content.length / 2;
  for (let i = 0; i < n; i++) {
    const x = r.readU8();
    const y = r.readU8();
    out.push(y * 32 + x);
  }
  return out;
}

function encodeTraps(traps: ReadonlyArray<DatLevelJson["trapControls"][number]>): Uint8Array {
  const w = new BinaryWriter();
  for (const t of traps) {
    const bx = t.button % 32;
    const by = Math.floor(t.button / 32);
    const tx = t.trap % 32;
    const ty = Math.floor(t.trap / 32);
    w.writeU16LE(bx);
    w.writeU16LE(by);
    w.writeU16LE(tx);
    w.writeU16LE(ty);
    w.writeU16LE(t.openOrShut);
  }
  return w.toBytes();
}

function encodeCloners(cloners: ReadonlyArray<DatLevelJson["cloneControls"][number]>): Uint8Array {
  const w = new BinaryWriter();
  for (const c of cloners) {
    const bx = c.button % 32;
    const by = Math.floor(c.button / 32);
    const cx = c.cloner % 32;
    const cy = Math.floor(c.cloner / 32);
    w.writeU16LE(bx);
    w.writeU16LE(by);
    w.writeU16LE(cx);
    w.writeU16LE(cy);
  }
  return w.toBytes();
}

function encodeMovement(movement: ReadonlyArray<number>): Uint8Array {
  const w = new BinaryWriter();
  for (const p of movement) {
    w.writeU8(p % 32);
    w.writeU8(Math.floor(p / 32));
  }
  return w.toBytes();
}

export function decodeDatBytes(dat: Uint8Array): DatLevelsetJsonV1 {
  const r = new BinaryReader(dat);

  const magicNumber = r.readU32LE();
  const numLevels = r.readU16LE();

  const levels: DatLevelJson[] = [];

  for (let i = 0; i < numLevels; i++) {
    const levelSize = r.readU16LE();
    const levelBytes = r.readBytes(levelSize);
    const lr = new BinaryReader(levelBytes);

    const number = lr.readU16LE();
    const time = lr.readU16LE();
    const chips = lr.readU16LE();
    const mapDetail = lr.readU16LE();

    const topLen = lr.readU16LE();
    const topComp = lr.readBytes(topLen);
    const bottomLen = lr.readU16LE();
    const bottomComp = lr.readBytes(bottomLen);

    const top = parseLayer(topComp).map(tileNameFromCode);
    const bottom = parseLayer(bottomComp).map(tileNameFromCode);

    const bytesRemaining = lr.readU16LE();
    const fieldsBytes = lr.readBytes(bytesRemaining);
    const fr = new BinaryReader(fieldsBytes);

    let title: string | undefined;
    let password: string | undefined;
    let hint: string | undefined;
    let author: string | undefined;

    let trapControls: DatLevelJson["trapControls"] = [];
    let cloneControls: DatLevelJson["cloneControls"] = [];
    let movement: number[] = [];

    const fieldOrder: number[] = [];
    const extraFields: DatExtraField[] = [];

    let remaining = bytesRemaining;
    while (remaining > 0) {
      const field = fr.readU8();
      const len = fr.readU8();
      const content = fr.readBytes(len);
      remaining -= len + 2;

      fieldOrder.push(field);

      if (field === TITLE_FIELD)
        title = decodeCp1252(content.subarray(0, Math.max(0, content.length - 1)));
      else if (field === PASSWORD_FIELD)
        password = decryptPassword(content.subarray(0, Math.max(0, content.length - 1)));
      else if (field === HINT_FIELD)
        hint = decodeCp1252(content.subarray(0, Math.max(0, content.length - 1)));
      else if (field === AUTHOR_FIELD)
        author = decodeCp1252(content.subarray(0, Math.max(0, content.length - 1)));
      else if (field === TRAPS_FIELD) trapControls = parseTraps(content);
      else if (field === CLONERS_FIELD) cloneControls = parseCloners(content);
      else if (field === MOVEMENT_FIELD) movement = parseMovement(content);
      else extraFields.push({ field, data: b64(content) });
    }

    if (lr.remaining() !== 0) {
      throw new Error(`Level ${i + 1}: unconsumed bytes in level block: ${lr.remaining()}`);
    }

    levels.push({
      number,
      time,
      chips,
      mapDetail,
      ...(title !== undefined && { title }),
      ...(author !== undefined && { author }),
      ...(hint !== undefined && { hint }),
      ...(password !== undefined && { password }),
      map: { width: 32, height: 32, top, bottom },
      trapControls,
      cloneControls,
      movement,
      fieldOrder,
      extraFields,
    });
  }

  return { schema: "datTools.dat.levelset.json.v1", magicNumber, levels };
}

export function encodeDatBytes(doc: DatLevelsetJsonV1): Uint8Array {
  const w = new BinaryWriter();
  w.writeU32LE(doc.magicNumber ?? 0x0002aaac);
  w.writeU16LE(doc.levels.length);

  for (let idx = 0; idx < doc.levels.length; idx++) {
    const level = doc.levels[idx]!;
    const lw = new BinaryWriter();

    lw.writeU16LE(level.number ?? idx + 1);
    lw.writeU16LE(level.time ?? 0);
    lw.writeU16LE(level.chips ?? 0);
    lw.writeU16LE(level.mapDetail ?? 1);

    const topCodes = level.map.top.map(tileCodeFromName);
    const bottomCodes = level.map.bottom.map(tileCodeFromName);

    const topComp = compressLayer(topCodes);
    const bottomComp = compressLayer(bottomCodes);

    lw.writeU16LE(topComp.length);
    lw.writeBytes(topComp);
    lw.writeU16LE(bottomComp.length);
    lw.writeBytes(bottomComp);

    // Fields
    const fw = new BinaryWriter();

    const order =
      level.fieldOrder && level.fieldOrder.length > 0
        ? [...level.fieldOrder]
        : [...STANDARD_FIELDS];

    // Append missing known fields if present
    const ensure = (field: number, present: boolean): void => {
      if (!present) return;
      if (!order.includes(field)) order.push(field);
    };

    ensure(TITLE_FIELD, !!level.title);
    ensure(TRAPS_FIELD, level.trapControls.length > 0);
    ensure(CLONERS_FIELD, level.cloneControls.length > 0);
    ensure(PASSWORD_FIELD, !!level.password);
    ensure(HINT_FIELD, !!level.hint);
    ensure(AUTHOR_FIELD, !!level.author);
    ensure(MOVEMENT_FIELD, level.movement.length > 0);

    const extraByField = new Map<number, Base64Blob>();
    for (const ef of level.extraFields) extraByField.set(ef.field, ef.data);

    for (const field of order) {
      if (field === TITLE_FIELD && level.title) {
        const b = Uint8Array.of(...encodeCp1252(level.title), 0x00);
        if (b.length > 255) throw new Error("TITLE field too long");
        fw.writeU8(field);
        fw.writeU8(b.length);
        fw.writeBytes(b);
      } else if (field === PASSWORD_FIELD && level.password) {
        const enc = encryptPassword(level.password);
        const b = new Uint8Array(enc.length + 1);
        b.set(enc, 0);
        b[b.length - 1] = 0x00;
        if (b.length > 255) throw new Error("PASSWORD field too long");
        fw.writeU8(field);
        fw.writeU8(b.length);
        fw.writeBytes(b);
      } else if (field === HINT_FIELD && level.hint) {
        const b = Uint8Array.of(...encodeCp1252(level.hint), 0x00);
        if (b.length > 255) throw new Error("HINT field too long");
        fw.writeU8(field);
        fw.writeU8(b.length);
        fw.writeBytes(b);
      } else if (field === AUTHOR_FIELD && level.author) {
        const b = Uint8Array.of(...encodeCp1252(level.author), 0x00);
        if (b.length > 255) throw new Error("AUTHOR field too long");
        fw.writeU8(field);
        fw.writeU8(b.length);
        fw.writeBytes(b);
      } else if (field === TRAPS_FIELD && level.trapControls.length > 0) {
        const content = encodeTraps(level.trapControls);
        if (content.length > 255) throw new Error("TRAPS field too long");
        fw.writeU8(field);
        fw.writeU8(content.length);
        fw.writeBytes(content);
      } else if (field === CLONERS_FIELD && level.cloneControls.length > 0) {
        const content = encodeCloners(level.cloneControls);
        if (content.length > 255) throw new Error("CLONERS field too long");
        fw.writeU8(field);
        fw.writeU8(content.length);
        fw.writeBytes(content);
      } else if (field === MOVEMENT_FIELD && level.movement.length > 0) {
        const content = encodeMovement(level.movement);
        if (content.length > 255) throw new Error("MOVEMENT field too long");
        fw.writeU8(field);
        fw.writeU8(content.length);
        fw.writeBytes(content);
      } else if (!STANDARD_FIELDS.includes(field)) {
        const blob = extraByField.get(field);
        if (blob) {
          const content = unb64(blob);
          if (content.length > 255) throw new Error(`Extra field ${field} too long`);
          fw.writeU8(field);
          fw.writeU8(content.length);
          fw.writeBytes(content);
        }
      }
    }

    const fieldsBytes = fw.toBytes();
    lw.writeU16LE(fieldsBytes.length);
    lw.writeBytes(fieldsBytes);

    const levelBytes = lw.toBytes();
    w.writeU16LE(levelBytes.length);
    w.writeBytes(levelBytes);
  }

  return w.toBytes();
}
