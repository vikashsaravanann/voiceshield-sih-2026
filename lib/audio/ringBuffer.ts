/**
 * VoiceShield — Circular Audio Ring Buffer
 * Retains the last N seconds of raw PCM16 audio in volatile RAM
 * to enable zero-loss replay upon WebSocket session resumption.
 * SIH26104 | voiceshield-team/voiceshield-sih-2026
 */

export interface BufferedChunk {
  index: number;
  pcm: Int16Array;
  timestamp: number;
}

export class AudioRingBuffer {
  private buffer: BufferedChunk[] = [];
  private maxChunks: number;

  /**
   * @param ringSeconds Duration of audio in seconds to buffer (default 4s)
   * @param chunkMs Duration of each chunk in ms (default 333ms)
   */
  constructor(ringSeconds = 4, chunkMs = 333) {
    this.maxChunks = Math.ceil((ringSeconds * 1000) / chunkMs);
  }

  /**
   * Push a new chunk into circular memory.
   * Discards oldest chunk if capacity exceeded.
   */
  push(chunk: BufferedChunk): void {
    this.buffer.push(chunk);
    if (this.buffer.length > this.maxChunks) {
      this.buffer.shift();
    }
  }

  /**
   * Retrieve all chunks with chunk_index > fromIndex for replay.
   */
  getReplayChunks(fromIndex: number): BufferedChunk[] {
    return this.buffer.filter((chunk) => chunk.index > fromIndex);
  }

  /**
   * Number of buffered chunks currently held.
   */
  get length(): number {
    return this.buffer.length;
  }

  /**
   * Flush buffer.
   */
  clear(): void {
    this.buffer = [];
  }
}
