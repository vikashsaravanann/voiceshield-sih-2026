/** Fixed-capacity circular buffer of PCM chunks with monotonic indexes. */

export type StoredChunk = {
  index: number;
  pcm: Float32Array;
  at: number;
};

export class ChunkRingBuffer {
  private buf: StoredChunk[];
  private head = 0;
  private _size = 0;
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buf = new Array(capacity);
  }

  get size() {
    return this._size;
  }

  push(chunk: StoredChunk) {
    this.buf[this.head] = chunk;
    this.head = (this.head + 1) % this.capacity;
    if (this._size < this.capacity) this._size += 1;
  }

  /** Chunks with index > afterIndex, in chronological order. */
  since(afterIndex: number): StoredChunk[] {
    const out: StoredChunk[] = [];
    const n = this._size;
    const start = (this.head - n + this.capacity) % this.capacity;
    for (let i = 0; i < n; i++) {
      const c = this.buf[(start + i) % this.capacity];
      if (c && c.index > afterIndex) out.push(c);
    }
    return out;
  }

  latest(): StoredChunk | undefined {
    if (this._size === 0) return undefined;
    return this.buf[(this.head - 1 + this.capacity) % this.capacity];
  }

  clear() {
    this.head = 0;
    this._size = 0;
  }
}
