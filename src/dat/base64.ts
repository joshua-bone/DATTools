// src/dat/base64.ts
//
// Browser + Node safe base64 helpers.
// - In Node, uses globalThis.Buffer if present.
// - In browsers, uses btoa/atob.

function nodeBuffer(): any | undefined {
  const g = globalThis as unknown as { Buffer?: any };
  return g.Buffer;
}

export function bytesToBase64(bytes: Uint8Array): string {
  const B = nodeBuffer();
  if (B) return B.from(bytes).toString("base64");

  // Browser path
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    bin += String.fromCharCode(...slice);
  }
  return btoa(bin);
}

export function base64ToBytes(b64: string): Uint8Array {
  const B = nodeBuffer();
  if (B) return new Uint8Array(B.from(b64, "base64"));

  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 0xff;
  return out;
}
