import type { KeyName } from "./types";

export type Chord = { name: string; freqs: number[] };

export type KeyInfo = {
  id: KeyName;
  root: number;
  chords: Chord[];
};

export const KEYS: KeyInfo[] = [
  {
    id: "C",
    root: 261.63,
    chords: [
      { name: "C", freqs: [261.63, 329.63, 392] },
      { name: "F", freqs: [174.61, 220, 261.63] },
      { name: "G", freqs: [196, 246.94, 293.66] },
      { name: "Am", freqs: [220, 261.63, 329.63] },
    ],
  },
  {
    id: "G",
    root: 196,
    chords: [
      { name: "G", freqs: [196, 246.94, 293.66] },
      { name: "C", freqs: [261.63, 329.63, 392] },
      { name: "D", freqs: [146.83, 185, 220] },
      { name: "Em", freqs: [164.81, 196, 246.94] },
    ],
  },
  {
    id: "D",
    root: 293.66,
    chords: [
      { name: "D", freqs: [146.83, 185, 220] },
      { name: "G", freqs: [196, 246.94, 293.66] },
      { name: "A", freqs: [220, 277.18, 329.63] },
      { name: "Bm", freqs: [246.94, 293.66, 369.99] },
    ],
  },
  {
    id: "A",
    root: 220,
    chords: [
      { name: "A", freqs: [220, 277.18, 329.63] },
      { name: "D", freqs: [146.83, 185, 220] },
      { name: "E", freqs: [164.81, 207.65, 246.94] },
      { name: "F#m", freqs: [185, 220, 277.18] },
    ],
  },
  {
    id: "E",
    root: 164.81,
    chords: [
      { name: "E", freqs: [164.81, 207.65, 246.94] },
      { name: "A", freqs: [220, 277.18, 329.63] },
      { name: "B", freqs: [246.94, 311.13, 369.99] },
      { name: "C#m", freqs: [138.59, 164.81, 207.65] },
    ],
  },
  {
    id: "B",
    root: 246.94,
    chords: [
      { name: "B", freqs: [246.94, 311.13, 369.99] },
      { name: "F#", freqs: [185, 233.08, 277.18] },
      { name: "G#m", freqs: [207.65, 246.94, 311.13] },
      { name: "E", freqs: [164.81, 207.65, 246.94] },
    ],
  },
  {
    id: "Am",
    root: 220,
    chords: [
      { name: "Am", freqs: [220, 261.63, 329.63] },
      { name: "F", freqs: [174.61, 220, 261.63] },
      { name: "C", freqs: [261.63, 329.63, 392] },
      { name: "G", freqs: [196, 246.94, 293.66] },
    ],
  },
  {
    id: "Em",
    root: 164.81,
    chords: [
      { name: "Em", freqs: [164.81, 196, 246.94] },
      { name: "C", freqs: [261.63, 329.63, 392] },
      { name: "G", freqs: [196, 246.94, 293.66] },
      { name: "D", freqs: [146.83, 185, 220] },
    ],
  },
];

export function keyInfo(name: KeyName): KeyInfo {
  return KEYS.find((k) => k.id === name) ?? KEYS[1]!;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function detectPitch(samples: Float32Array, sampleRate: number): { note: string; cents: number } | null {
  const size = samples.length;
  if (size < 256) return null;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += samples[i]! * samples[i]!;
  rms = Math.sqrt(rms / size);
  if (rms < 0.012) return null;

  const minLag = Math.floor(sampleRate / 880);
  const maxLag = Math.min(Math.floor(sampleRate / 70), size - 2);
  let bestLag = -1;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < size - lag; i += 2) sum += samples[i]! * samples[i + lag]!;
    if (sum > best) {
      best = sum;
      bestLag = lag;
    }
  }
  if (bestLag < 0) return null;
  const freq = sampleRate / bestLag;
  if (freq < 70 || freq > 880) return null;
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const exact = 69 + 12 * Math.log2(freq / 440);
  const cents = Math.round((exact - midi) * 100);
  const note = NOTE_NAMES[((midi % 12) + 12) % 12] ?? "?";
  return { note, cents };
}

export function pitchHint(cents: number): string {
  if (Math.abs(cents) <= 12) return "treffer";
  return cents < 0 ? "litt under" : "litt over";
}
