type Biquad = { b0: number; b1: number; b2: number; a1: number; a2: number };

/** ITU-R BS.1770 shelf + high-pass, then gated mean square. Result is LUFS. */
export function integratedLufs(samples: Float32Array, sampleRate: number): number {
  const weighted = kWeight(samples, sampleRate);
  const window = Math.max(1, Math.round(sampleRate * 0.4));
  const blocks: number[] = [];
  for (let i = 0; i + window <= weighted.length; i += window) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      const s = weighted[i + j] ?? 0;
      sum += s * s;
    }
    const mean = sum / window;
    if (mean > 1e-10) blocks.push(mean);
  }
  if (blocks.length === 0) return -90;
  const ungated = blocks.reduce((sum, value) => sum + value, 0) / blocks.length;
  const gate = ungated * Math.pow(10, -10 / 10);
  const kept = blocks.filter((value) => value >= gate);
  const use = kept.length > 0 ? kept : blocks;
  const mean = use.reduce((sum, value) => sum + value, 0) / use.length;
  return -0.691 + 10 * Math.log10(Math.max(mean, 1e-12));
}

export function peakOf(samples: Float32Array): number {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i] ?? 0));
  return peak;
}

/** Gain toward about -14 LUFS, then never past -1 dBFS. Caps a quiet file at +18 dB. */
export function youtubeGain(samples: Float32Array, sampleRate: number): { gain: number; lufs: number } {
  const lufs = integratedLufs(samples, sampleRate);
  const peak = peakOf(samples);
  if (peak < 1e-6 || lufs < -80) return { gain: 1, lufs };
  let gain = Math.pow(10, (-14 - lufs) / 20);
  gain = Math.min(gain, Math.pow(10, 18 / 20));
  const ceiling = Math.pow(10, -1 / 20);
  if (peak * gain > ceiling) gain = ceiling / peak;
  return { gain, lufs };
}

function kWeight(samples: Float32Array, sampleRate: number): Float32Array {
  const shelf = highShelf(sampleRate);
  const pass = highPass(sampleRate);
  const mid = new Float32Array(samples.length);
  const out = new Float32Array(samples.length);
  runBiquad(samples, mid, shelf);
  runBiquad(mid, out, pass);
  return out;
}

function highShelf(sampleRate: number): Biquad {
  const f0 = 1681.974450955533;
  const gainDb = 3.999843853973347;
  const q = 0.7071752369554196;
  const k = Math.tan(Math.PI * f0 / sampleRate);
  const vh = Math.pow(10, gainDb / 20);
  const vb = Math.pow(vh, 0.4996667741545416);
  const a0 = 1 + k / q + k * k;
  return {
    b0: (vh + (vb * k) / q + k * k) / a0,
    b1: (2 * (k * k - vh)) / a0,
    b2: (vh - (vb * k) / q + k * k) / a0,
    a1: (2 * (k * k - 1)) / a0,
    a2: (1 - k / q + k * k) / a0,
  };
}

function highPass(sampleRate: number): Biquad {
  const f0 = 38.13547087602444;
  const q = 0.5003270373238773;
  const k = Math.tan(Math.PI * f0 / sampleRate);
  const a0 = 1 + k / q + k * k;
  return {
    b0: 1 / a0,
    b1: -2 / a0,
    b2: 1 / a0,
    a1: (2 * (k * k - 1)) / a0,
    a2: (1 - k / q + k * k) / a0,
  };
}

function runBiquad(input: Float32Array, output: Float32Array, filter: Biquad) {
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x = input[i] ?? 0;
    const y = filter.b0 * x + filter.b1 * x1 + filter.b2 * x2 - filter.a1 * y1 - filter.a2 * y2;
    output[i] = y;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
}

export function monoMix(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const out = new Float32Array(length);
  const channels = buffer.numberOfChannels;
  for (let channel = 0; channel < channels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) out[i] = (out[i] ?? 0) + (data[i] ?? 0);
  }
  if (channels > 1) {
    for (let i = 0; i < length; i++) out[i] = (out[i] ?? 0) / channels;
  }
  return out;
}

export function applyGain(buffer: AudioBuffer, gain: number): AudioBuffer {
  const out = new AudioBuffer({
    length: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate,
  });
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const src = buffer.getChannelData(channel);
    const dst = out.getChannelData(channel);
    for (let i = 0; i < src.length; i++) dst[i] = Math.max(-1, Math.min(1, (src[i] ?? 0) * gain));
  }
  return out;
}

export function shapeForYoutube(buffer: AudioBuffer): { buffer: AudioBuffer; note: string } {
  const mix = monoMix(buffer);
  const { gain, lufs } = youtubeGain(mix, buffer.sampleRate);
  const shaped = applyGain(buffer, gain);
  const after = integratedLufs(monoMix(shaped), shaped.sampleRate);
  const reached = Math.abs(after + 14) < 1.5;
  const note = reached
    ? `Omtrent ${after.toFixed(0)} LUFS. Toppen er under -1. Målet for YouTube er -14.`
    : `Omtrent ${after.toFixed(0)} LUFS. Toppen er holdt under -1, så den kom ikke helt til -14. Utgangspunktet var ${lufs.toFixed(0)}.`;
  return { buffer: shaped, note };
}
