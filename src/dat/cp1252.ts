// src/dat/cp1252.ts
//
// Minimal, correct windows-1252 codec.
// Node's "latin1" is ISO-8859-1, not cp1252 for 0x80..0x9F.

const BYTE_TO_CODEPOINT: ReadonlyArray<number> = (() => {
  const arr = new Array<number>(256);
  for (let i = 0; i < 256; i++) arr[i] = i;

  // CP1252 overrides
  arr[0x80] = 0x20ac;
  arr[0x82] = 0x201a;
  arr[0x83] = 0x0192;
  arr[0x84] = 0x201e;
  arr[0x85] = 0x2026;
  arr[0x86] = 0x2020;
  arr[0x87] = 0x2021;
  arr[0x88] = 0x02c6;
  arr[0x89] = 0x2030;
  arr[0x8a] = 0x0160;
  arr[0x8b] = 0x2039;
  arr[0x8c] = 0x0152;
  arr[0x8e] = 0x017d;
  arr[0x91] = 0x2018;
  arr[0x92] = 0x2019;
  arr[0x93] = 0x201c;
  arr[0x94] = 0x201d;
  arr[0x95] = 0x2022;
  arr[0x96] = 0x2013;
  arr[0x97] = 0x2014;
  arr[0x98] = 0x02dc;
  arr[0x99] = 0x2122;
  arr[0x9a] = 0x0161;
  arr[0x9b] = 0x203a;
  arr[0x9c] = 0x0153;
  arr[0x9e] = 0x017e;
  arr[0x9f] = 0x0178;

  return arr;
})();

const CODEPOINT_TO_BYTE: ReadonlyMap<number, number> = (() => {
  const m = new Map<number, number>();
  for (let b = 0; b < 256; b++) {
    m.set(BYTE_TO_CODEPOINT[b]!, b);
  }
  return m;
})();

export function decodeCp1252(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) {
    out += String.fromCodePoint(BYTE_TO_CODEPOINT[b]!);
  }
  return out;
}

export function encodeCp1252(text: string): Uint8Array {
  const out: number[] = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const b = CODEPOINT_TO_BYTE.get(cp);
    if (b === undefined) {
      throw new Error(
        `String contains non-windows-1252 character U+${cp.toString(16).toUpperCase()}`,
      );
    }
    out.push(b);
  }
  return new Uint8Array(out);
}
