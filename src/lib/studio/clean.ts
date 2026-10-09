import { encodeWav } from "./wav";

const MAX_SECONDS = 20 * 60;

export async function cleanSpeech(blob: Blob): Promise<{ listen: Blob; speech: Blob; duration: number }> {
  const ctx = new AudioContext();
  try {
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    if (decoded.duration > MAX_SECONDS) throw new Error("For langt. Klipp det ned til tjue minutter.");
    const filtered = await filterVoice(mixMono(decoded), decoded.sampleRate);
    const lifted = gateAndLift(filtered, decoded.sampleRate);
    const listenBuf = ctx.createBuffer(1, lifted.length, decoded.sampleRate);
    listenBuf.getChannelData(0).set(lifted);
    const speechBuf = speechBuffer(resampleLinear(lifted, decoded.sampleRate, 16000), 16000);
    return { listen: encodeWav(listenBuf), speech: encodeWav(speechBuf), duration: decoded.duration };
  } finally {
    await ctx.close();
  }
}

function mixMono(buffer: AudioBuffer) {
  const out = new Float32Array(buffer.length);
  const channels = buffer.numberOfChannels;
  for (let c = 0; c < channels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) out[i] += data[i]! / channels;
  }
  return out;
}

async function filterVoice(samples: Float32Array, sampleRate: number) {
  const offline = new OfflineAudioContext(1, samples.length, sampleRate);
  const buffer = offline.createBuffer(1, samples.length, sampleRate);
  buffer.getChannelData(0).set(samples);
  const src = offline.createBufferSource();
  src.buffer = buffer;
  const high = offline.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 110;
  high.Q.value = 0.7;
  const mud = offline.createBiquadFilter();
  mud.type = "peaking";
  mud.frequency.value = 240;
  mud.gain.value = -4;
  mud.Q.value = 0.7;
  const presence = offline.createBiquadFilter();
  presence.type = "peaking";
  presence.frequency.value = 2800;
  presence.gain.value = 4.5;
  presence.Q.value = 0.9;
  const low = offline.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 7200;
  const comp = offline.createDynamicsCompressor();
  comp.threshold.value = -26;
  comp.knee.value = 12;
  comp.ratio.value = 5;
  comp.attack.value = 0.004;
  comp.release.value = 0.22;
  src.connect(high).connect(mud).connect(presence).connect(low).connect(comp).connect(offline.destination);
  src.start();
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

export function gateAndLift(samples: Float32Array, sampleRate: number) {
  const hop = Math.max(1, Math.floor(sampleRate * 0.01));
  const frame = hop * 2;
  const rms: number[] = [];
  for (let i = 0; i < samples.length; i += hop) {
    let sum = 0;
    const end = Math.min(samples.length, i + frame);
    for (let j = i; j < end; j++) sum += samples[j]! * samples[j]!;
    rms.push(Math.sqrt(sum / (end - i)));
  }
  const sorted = [...rms].sort((a, b) => a - b);
  const noise = sorted[Math.floor(sorted.length * 0.2)] ?? 0.01;
  const open = Math.max(noise * 2.6, 0.012);
  const out = new Float32Array(samples.length);
  let gain = 0.08;
  for (let i = 0; i < samples.length; i++) {
    const level = rms[Math.min(rms.length - 1, Math.floor(i / hop))] ?? 0;
    const target = level < open ? 0.05 : 1;
    gain += (target - gain) * (target > gain ? 0.03 : 0.004);
    out[i] = samples[i]! * gain;
  }
  let peak = 0;
  for (let i = 0; i < out.length; i++) peak = Math.max(peak, Math.abs(out[i]!));
  const lift = peak > 0.001 ? Math.min(0.82 / peak, 4) : 1;
  for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i]! * lift);
  return out;
}

function resampleLinear(samples: Float32Array, from: number, to: number) {
  const length = Math.max(1, Math.ceil((samples.length / from) * to));
  const out = new Float32Array(length);
  const ratio = from / to;
  const last = samples.length - 1;
  for (let i = 0; i < length; i++) {
    const pos = Math.min(last, i * ratio);
    const i0 = Math.floor(pos);
    const i1 = Math.min(last, i0 + 1);
    const frac = pos - i0;
    out[i] = samples[i0]! * (1 - frac) + samples[i1]! * frac;
  }
  return out;
}

function speechBuffer(samples: Float32Array, sampleRate: number) {
  const ctx = new OfflineAudioContext(1, samples.length, sampleRate);
  const buffer = ctx.createBuffer(1, samples.length, sampleRate);
  buffer.getChannelData(0).set(samples);
  return buffer;
}
