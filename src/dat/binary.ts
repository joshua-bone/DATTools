// src/dat/binary.ts
export class BinaryReader {
  private off = 0;

  public constructor(private readonly buf: Uint8Array) {}

  public pos(): number {
    return this.off;
  }

  public remaining(): number {
    return this.buf.length - this.off;
  }

  public readU8(): number {
    if (this.remaining() < 1) throw new Error("Unexpected EOF reading u8");
    return this.buf[this.off++]!;
  }

  public readU16LE(): number {
    if (this.remaining() < 2) throw new Error("Unexpected EOF reading u16");
    const b0 = this.buf[this.off++]!;
    const b1 = this.buf[this.off++]!;
    return b0 | (b1 << 8);
  }

  public readU32LE(): number {
    if (this.remaining() < 4) throw new Error("Unexpected EOF reading u32");
    const b0 = this.buf[this.off++]!;
    const b1 = this.buf[this.off++]!;
    const b2 = this.buf[this.off++]!;
    const b3 = this.buf[this.off++]!;
    return (b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0;
  }

  public readBytes(n: number): Uint8Array {
    if (n < 0) throw new Error("readBytes: n < 0");
    if (this.remaining() < n) throw new Error(`Unexpected EOF reading ${n} bytes`);
    const out = this.buf.subarray(this.off, this.off + n);
    this.off += n;
    return out;
  }
}

export class BinaryWriter {
  private chunks: Uint8Array[] = [];

  public writeU8(v: number): void {
    if (!Number.isInteger(v) || v < 0 || v > 0xff) throw new Error(`u8 out of range: ${v}`);
    this.chunks.push(Uint8Array.of(v));
  }

  public writeU16LE(v: number): void {
    if (!Number.isInteger(v) || v < 0 || v > 0xffff) throw new Error(`u16 out of range: ${v}`);
    this.chunks.push(Uint8Array.of(v & 0xff, (v >>> 8) & 0xff));
  }

  public writeU32LE(v: number): void {
    if (!Number.isInteger(v) || v < 0 || v > 0xffffffff) throw new Error(`u32 out of range: ${v}`);
    const x = v >>> 0;
    this.chunks.push(
      Uint8Array.of(x & 0xff, (x >>> 8) & 0xff, (x >>> 16) & 0xff, (x >>> 24) & 0xff),
    );
  }

  public writeBytes(b: Uint8Array): void {
    this.chunks.push(b);
  }

  public toBytes(): Uint8Array {
    const total = this.chunks.reduce((a, c) => a + c.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const c of this.chunks) {
      out.set(c, o);
      o += c.length;
    }
    return out;
  }
}
