/**
 * wavRecorder — captura mic via Web Audio API e encoda para um WAV 16-bit mono 16kHz.
 * Necessário para o endpoint STT: MediaRecorder produz containers (webm/mp4)
 * que a OpenAI recusa se o nome do ficheiro não bater — WAV é neutro e universal.
 */

export class WavRecorder {
  private ctx: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Float32Array[] = [];
  private sampleRate = 16000;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.processor = this.ctx.createScriptProcessor(4096, 1, 1);
    this.chunks = [];
    this.processor.onaudioprocess = (e) => {
      this.chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };
    this.source.connect(this.processor);
    this.processor.connect(this.ctx.destination);
  }

  async stop(): Promise<Blob> {
    const inputRate = this.ctx?.sampleRate ?? 44100;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.processor?.disconnect();
    this.source?.disconnect();
    await this.ctx?.close();
    this.ctx = null;
    this.source = null;
    this.processor = null;
    this.stream = null;

    // Concatena todos os Float32
    const totalLen = this.chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Float32Array(totalLen);
    let offset = 0;
    for (const c of this.chunks) {
      merged.set(c, offset);
      offset += c.length;
    }

    // Downsample para 16kHz
    const downsampled = downsample(merged, inputRate, this.sampleRate);
    return encodeWAV(downsampled, this.sampleRate);
  }
}

function downsample(buffer: Float32Array, inputRate: number, outRate: number): Float32Array {
  if (outRate === inputRate) return buffer;
  const ratio = inputRate / outRate;
  const newLen = Math.round(buffer.length / ratio);
  const out = new Float32Array(newLen);
  let idx = 0;
  let pos = 0;
  while (idx < newLen) {
    const next = Math.round((idx + 1) * ratio);
    let sum = 0, count = 0;
    for (let i = pos; i < next && i < buffer.length; i++) { sum += buffer[i]; count++; }
    out[idx] = count ? sum / count : 0;
    idx++;
    pos = next;
  }
  return out;
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}