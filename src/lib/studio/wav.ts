export function encodeWav(buffer: AudioBuffer): Blob {
  const channels = Math.min(2, buffer.numberOfChannels);
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2;
  const block = channels * bytesPerSample;
  const dataSize = length * block;
  const header = 44;
  const out = new ArrayBuffer(header + dataSize);
  const view = new DataView(out);
  writeStr(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(view, 8, "WAVE");
  writeStr(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * block, true);
  view.setUint16(32, block, true);
  view.setUint16(34, 16, true);
  writeStr(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const chans: Float32Array[] = [];
  for (let c = 0; c < channels; c++) chans.push(buffer.getChannelData(c));
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < channels; c++) {
      const sample = Math.max(-1, Math.min(1, chans[c]![i] ?? 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([out], { type: "audio/wav" });
}

function writeStr(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}

export function measureBuffer(buffer: AudioBuffer, bars = 72): { peaks: number[]; peak: number } {
  const data = buffer.getChannelData(0);
  const size = Math.max(1, Math.floor(data.length / bars));
  const peaks: number[] = [];
  let peak = 0;
  for (let i = 0; i < bars; i++) {
    let max = 0;
    const start = i * size;
    const end = Math.min(data.length, start + size);
    for (let j = start; j < end; j += 8) max = Math.max(max, Math.abs(data[j] ?? 0));
    peaks.push(max);
    peak = Math.max(peak, max);
  }
  return { peaks, peak };
}
