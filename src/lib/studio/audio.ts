import { getAudio, putAudio } from "./idb";
import { activeTake } from "./store";
import { detectPitch, pitchHint } from "./theory";
import type { DrumPattern, EchoPreset, MasterStyle, RoomPreset, Song, TonePreset } from "./types";
import { encodeWav, measureBuffer } from "./wav";

export type EngineSnap = {
  playing: boolean;
  recording: boolean;
  counting: boolean;
  listening: boolean;
  countLeft: number | null;
  position: number;
  level: number;
  note: string | null;
  hint: string | null;
  error: string | null;
  notice: string | null;
};

export const EMPTY_SNAP: EngineSnap = {
  playing: false,
  recording: false,
  counting: false,
  listening: false,
  countLeft: null,
  position: 0,
  level: 0,
  note: null,
  hint: null,
  error: null,
  notice: null,
};

const PATTERNS: Record<DrumPattern, { kick: number[]; snare: number[]; hat: number[] }> = {
  ingen: {
    kick: [0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0, 0, 0, 0],
    hat: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  ro: {
    kick: [1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 1, 0, 0, 0, 1, 0],
    hat: [1, 0, 1, 0, 1, 0, 1, 0],
  },
  sprett: {
    kick: [1, 0, 0, 1, 0, 0, 1, 0],
    snare: [0, 0, 1, 0, 0, 0, 1, 0],
    hat: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  ballade: {
    kick: [1, 0, 0, 0, 0, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 0, 1, 0, 1, 0, 1, 1],
  },
};

type TrackNodes = {
  low: BiquadFilterNode;
  mid: BiquadFilterNode;
  high: BiquadFilterNode;
  hp: BiquadFilterNode;
  comp: DynamicsCompressorNode;
  makeup: GainNode;
  fader: GainNode;
  dry: GainNode;
  twin: GainNode;
  echoMix: GainNode;
  echoFb: GainNode;
  echoDelay: DelayNode;
  verbSend: GainNode;
  phoneMix: GainNode;
  chorusMix: GainNode;
  ringMix: GainNode;
  extras: AudioScheduledSourceNode[];
  gate?: AudioWorkletNode;
};

type Live = {
  tracks: Map<string, TrackNodes>;
  masterLow: BiquadFilterNode;
  masterHigh: BiquadFilterNode;
  masterComp: DynamicsCompressorNode;
  out: GainNode;
  drum: GainNode;
};

function createContext(): AudioContext {
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) throw new Error("Denne nettleseren kan ikke spille lyd.");
  return new Ctor();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function micError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Mikrofonen er ikke tillatt. Si ja til mikrofon i nettleseren, og prøv igjen.";
  }
  if (name === "NotFoundError") return "Fant ingen mikrofon.";
  return "Fikk ikke tak i mikrofonen. Sjekk at den er koblet til.";
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function makeNoise(ctx: BaseAudioContext): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function makeImpulse(ctx: BaseAudioContext): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * 2.2);
  const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * (1 - t) ** 2.4;
    }
  }
  return buffer;
}

function glide(param: AudioParam, value: number, ctx: BaseAudioContext) {
  if (typeof OfflineAudioContext !== "undefined" && ctx instanceof OfflineAudioContext) {
    param.setValueAtTime(value, 0);
    return;
  }
  param.setTargetAtTime(value, ctx.currentTime, 0.04);
}

function structureKey(song: Song): string {
  return JSON.stringify({
    bpm: song.bpm,
    click: song.click,
    drums: song.drums,
    tracks: song.tracks.map((track) => [track.id, track.activeTakeId, track.trimStart, track.trimEnd]),
  });
}

function envGain(ctx: BaseAudioContext, when: number, peak: number, dur: number): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  return gain;
}

function toneGains(tone: TonePreset): { low: number; mid: number; high: number } {
  if (tone === "varm") return { low: 4, mid: -1, high: -2.5 };
  if (tone === "klar") return { low: -1.5, mid: 3.2, high: 2 };
  if (tone === "radio") return { low: -2, mid: 4, high: 3.2 };
  return { low: 0, mid: 0, high: 0 };
}

function roomSend(room: RoomPreset): number {
  if (room === "stue") return 0.18;
  if (room === "scene") return 0.34;
  if (room === "kirke") return 0.52;
  return 0;
}

function echoSettings(echo: EchoPreset, bpm: number): { time: number; fb: number; mix: number } {
  if (echo === "kort") return { time: 0.16, fb: 0.22, mix: 0.22 };
  if (echo === "syng") return { time: Math.min(1.2, (60 / bpm) * 0.75), fb: 0.36, mix: 0.28 };
  return { time: 0.16, fb: 0, mix: 0 };
}

function masterSettings(style: MasterStyle): { low: number; high: number; threshold: number; ratio: number; out: number } {
  if (style === "radio") return { low: 0.4, high: 2.6, threshold: -18, ratio: 3.6, out: 1.2 };
  if (style === "myk") return { low: 3, high: -2.2, threshold: -14, ratio: 1.7, out: 1 };
  return { low: 1.4, high: 0.6, threshold: -12, ratio: 2, out: 1.05 };
}

export function audioLength(song: Song, buffers: Map<string, AudioBuffer>): number {
  let max = 0;
  for (const track of song.tracks) {
    const take = activeTake(track);
    if (!take) continue;
    const buffer = buffers.get(take.audioId);
    const total = buffer?.duration ?? take.duration;
    max = Math.max(max, total - track.trimStart - track.trimEnd);
  }
  return Math.max(0, max);
}

export function arrangementLength(song: Song): number {
  const bars = song.sections.reduce((sum, section) => sum + section.bars, 0) || 8;
  return bars * 4 * (60 / song.bpm);
}

function hit(
  ctx: BaseAudioContext,
  dest: AudioNode,
  noise: AudioBuffer,
  song: Song,
  index: number,
  when: number,
  hold: AudioScheduledSourceNode[],
) {
  const step = index % 8;
  const pattern = PATTERNS[song.drums];
  if (pattern.kick[step]) {
    const osc = ctx.createOscillator();
    const gain = envGain(ctx, when, 0.85, 0.22);
    osc.type = "sine";
    osc.frequency.setValueAtTime(148, when);
    osc.frequency.exponentialRampToValueAtTime(46, when + 0.09);
    osc.connect(gain).connect(dest);
    osc.start(when);
    osc.stop(when + 0.24);
    hold.push(osc);
  }
  if (pattern.snare[step]) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.7;
    const gain = envGain(ctx, when, 0.45, 0.16);
    src.connect(filter).connect(gain).connect(dest);
    src.start(when);
    src.stop(when + 0.18);
    hold.push(src);
  }
  if (pattern.hat[step]) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;
    const gain = envGain(ctx, when, 0.16, 0.05);
    src.connect(filter).connect(gain).connect(dest);
    src.start(when);
    src.stop(when + 0.06);
    hold.push(src);
  }
  if (song.click && step % 2 === 0) {
    const osc = ctx.createOscillator();
    const accent = step === 0;
    const gain = envGain(ctx, when, accent ? 0.14 : 0.07, 0.04);
    osc.type = "square";
    osc.frequency.value = accent ? 1400 : 900;
    osc.connect(gain).connect(dest);
    osc.start(when);
    osc.stop(when + 0.05);
    hold.push(osc);
  }
}

function scheduleSpan(
  ctx: BaseAudioContext,
  dest: AudioNode,
  noise: AudioBuffer,
  song: Song,
  offset: number,
  duration: number,
  t0: number,
  hold: AudioScheduledSourceNode[],
) {
  if (duration <= 0) return;
  if (song.drums === "ingen" && !song.click) return;
  const step = 60 / song.bpm / 2;
  const first = Math.floor(offset / step + 1e-6);
  const last = Math.ceil((offset + duration) / step - 1e-6);
  for (let i = first; i <= last; i++) {
    const when = t0 + (i * step - offset);
    if (when < t0 - 0.001) continue;
    hit(ctx, dest, noise, song, i, when, hold);
  }
}

export class StudioEngine {
  private ctx: AudioContext | null = null;
  private song: Song | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private live: Live | null = null;
  private hold: AudioScheduledSourceNode[] = [];
  private noise: AudioBuffer | null = null;
  private drumTimer: number | null = null;
  private raf = 0;
  private dead = false;
  private gen = 0;
  private playing = false;
  private looping = false;
  private recording = false;
  private counting = false;
  private listening = false;
  private recordAbort = false;
  private startedCtx = 0;
  private startedOffset = 0;
  private pausedAt = 0;
  private recordStarted = 0;
  private countLeft: number | null = null;
  private level = 0;
  private note: string | null = null;
  private hint: string | null = null;
  private error: string | null = null;
  private notice: string | null = null;
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private analyser: AnalyserNode | null = null;
  private meterSource: MediaStreamAudioSourceNode | null = null;
  private meterData = new Float32Array(2048);
  private gateReady = false;
  private lastEmit = 0;

  constructor(private onChange: (snap: EngineSnap) => void) {
    this.raf = requestAnimationFrame(this.tick);
  }

  dispose() {
    this.dead = true;
    this.gen += 1;
    this.recordAbort = true;
    cancelAnimationFrame(this.raf);
    this.stopPerformance();
    this.stopStream();
    void this.ctx?.close();
  }

  setSong(song: Song) {
    const prev = this.song;
    this.song = song;
    if (!prev || !this.playing || !this.live) return;
    if (structureKey(prev) !== structureKey(song)) {
      const pos = this.position();
      void this.play(Math.max(0, pos));
    } else {
      this.applyMix(song);
    }
  }

  async toggle() {
    if (this.playing) this.pause();
    else await this.play(this.pausedAt);
  }

  async seek(position: number) {
    const pos = Math.max(0, position);
    this.pausedAt = pos;
    if (this.playing) await this.play(pos);
    else this.emit();
  }

  async play(offset = 0) {
    const song = this.song;
    if (!song || this.dead) return;
    const token = ++this.gen;
    try {
      const ctx = this.ensureCtxSync();
      await this.ensureBuffers(this.song ?? song);
      const current = this.song;
      if (!current || token !== this.gen || this.dead) return;
      const length = audioLength(current, this.buffers);
      const musical = current.drums !== "ingen" || current.click;
      if (length < 0.05 && !musical) {
        this.playing = false;
        this.notice = "Ingenting å spille av ennå. Ta opp, eller skru på trommer.";
        this.emit();
        return;
      }
      this.stopPerformance();
      this.notice = null;
      this.error = null;
      this.looping = length < 0.05;
      this.playing = true;
      this.startedOffset = offset;
      this.startedCtx = ctx.currentTime;
      this.pausedAt = offset;
      const when = ctx.currentTime + 0.05;
      const hold: AudioScheduledSourceNode[] = [];
      this.hold = hold;
      this.live = this.build(
        ctx,
        current,
        this.noise!,
        ctx.destination,
        when,
        offset,
        this.looping ? 0 : Math.max(0, length - offset),
        hold,
      );
      if (this.looping && this.live) this.startLoop(current, this.live.drum);
      this.emit();
    } catch (err) {
      this.playing = false;
      this.error = err instanceof Error ? err.message : "Kunne ikke spille av.";
      this.emit();
    }
  }

  pause() {
    if (!this.playing && !this.live) {
      this.emit();
      return;
    }
    const pos = this.playing ? this.position() : this.pausedAt;
    const length = this.song ? audioLength(this.song, this.buffers) : 0;
    this.pausedAt = this.looping ? 0 : Math.max(0, Math.min(pos, length || pos));
    this.playing = false;
    this.looping = false;
    this.stopPerformance();
    this.emit();
  }

  async beginRecord() {
    if (this.recording || this.counting || !this.song) return;
    if (typeof MediaRecorder === "undefined") {
      this.error = "Denne nettleseren kan ikke ta opp lyd.";
      this.emit();
      return;
    }
    this.recordAbort = false;
    this.pause();
    const ctx = this.ensureCtxSync();
    try {
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        this.attachMeter(this.stream);
      }
    } catch (err) {
      this.error = micError(err);
      this.emit();
      return;
    }
    this.listening = true;
    this.counting = true;
    this.error = null;
    this.emit();
    await this.countIn(this.song);
    if (this.recordAbort || this.dead) {
      this.counting = false;
      this.countLeft = null;
      this.emit();
      return;
    }
    const mime = pickMime();
    const rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    rec.ondataavailable = (event) => {
      if (event.data.size) this.chunks.push(event.data);
    };
    this.recorder = rec;
    rec.start();
    this.counting = false;
    this.countLeft = null;
    this.recording = true;
    this.recordStarted = performance.now();
    this.emit();
    await this.play(0);
    void ctx;
  }

  async endRecord(): Promise<Blob | null> {
    const rec = this.recorder;
    if (!rec) {
      this.recording = false;
      this.counting = false;
      this.emit();
      return null;
    }
    const blob = await new Promise<Blob>((resolve) => {
      rec.addEventListener("stop", () => resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" })), {
        once: true,
      });
      if (rec.state !== "inactive") rec.stop();
      else resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" }));
    });
    this.recorder = null;
    this.recording = false;
    this.pause();
    this.stopStream();
    this.emit();
    return blob.size > 0 ? blob : null;
  }

  cancelRecord() {
    this.recordAbort = true;
    const rec = this.recorder;
    this.recorder = null;
    this.chunks = [];
    if (rec && rec.state !== "inactive") rec.stop();
    this.recording = false;
    this.counting = false;
    this.countLeft = null;
    this.pause();
    this.stopStream();
    this.emit();
  }

  async startListen() {
    if (this.recording || this.counting) return;
    this.ensureCtxSync();
    try {
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        this.attachMeter(this.stream);
      }
      this.listening = true;
      this.error = null;
      this.emit();
    } catch (err) {
      this.error = micError(err);
      this.emit();
    }
  }

  stopListen() {
    if (this.recording || this.counting) return;
    this.listening = false;
    this.stopStream();
    this.emit();
  }

  previewChord(freqs: number[]) {
    const ctx = this.ensureCtxSync();
    const now = ctx.currentTime + 0.03;
    const bus = ctx.createGain();
    bus.gain.value = 0.22;
    bus.connect(ctx.destination);
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      const gain = envGain(ctx, now, 0.45, 1.05);
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(gain).connect(bus);
      osc.start(now);
      osc.stop(now + 1.1);
    }
  }

  async decodeTake(blob: Blob): Promise<{ audioId: string; duration: number; peak: number; peaks: number[] }> {
    const ctx = this.ensureCtxSync();
    const raw = await blob.arrayBuffer();
    const audio = await ctx.decodeAudioData(raw.slice(0));
    const { peaks, peak } = measureBuffer(audio);
    const audioId = crypto.randomUUID();
    await putAudio(audioId, blob);
    this.buffers.set(audioId, audio);
    return { audioId, duration: audio.duration, peak, peaks };
  }

  async renderWav(song: Song): Promise<Blob> {
    const live = this.ensureCtxSync();
    await this.ensureBuffers(song);
    const recorded = audioLength(song, this.buffers);
    const span = recorded > 0.05 ? recorded : arrangementLength(song);
    const rate = live.sampleRate;
    const offline = new OfflineAudioContext(2, Math.max(1, Math.ceil((span + 1.4) * rate)), rate);
    const noise = makeNoise(offline);
    const when = 0.02;
    this.build(offline, song, noise, offline.destination, when, 0, span, []);
    const rendered = await offline.startRendering();
    return encodeWav(rendered);
  }

  private ensureCtxSync(): AudioContext {
    if (!this.ctx) {
      this.ctx = createContext();
      void this.ctx.audioWorklet
        .addModule("/worklets/gate.js")
        .then(() => {
          this.gateReady = true;
        })
        .catch(() => {
          this.gateReady = false;
        });
      this.noise = makeNoise(this.ctx);
    }
    void this.ctx.resume();
    return this.ctx;
  }

  private async ensureBuffers(song: Song) {
    const ctx = this.ensureCtxSync();
    for (const track of song.tracks) {
      const take = activeTake(track);
      if (!take || this.buffers.has(take.audioId)) continue;
      const blob = await getAudio(take.audioId);
      if (!blob) continue;
      const raw = await blob.arrayBuffer();
      try {
        const audio = await ctx.decodeAudioData(raw.slice(0));
        this.buffers.set(take.audioId, audio);
      } catch {
        this.notice = `Klarte ikke å lese ${track.name}. Ta opp det sporet på nytt.`;
      }
    }
  }

  private async countIn(song: Song) {
    const ctx = this.ensureCtxSync();
    const beat = 60 / Math.max(60, song.bpm);
    const gain = ctx.createGain();
    gain.gain.value = 0.9;
    gain.connect(ctx.destination);
    for (let i = 0; i < 4; i++) {
      if (this.recordAbort || this.dead) return;
      this.countLeft = 4 - i;
      this.emit();
      const osc = ctx.createOscillator();
      const env = envGain(ctx, ctx.currentTime, i === 0 ? 0.16 : 0.1, 0.05);
      osc.type = "square";
      osc.frequency.value = 1200;
      osc.connect(env).connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
      await sleep(beat * 1000);
    }
    gain.disconnect();
  }

  private build(
    ctx: BaseAudioContext,
    song: Song,
    noise: AudioBuffer,
    destination: AudioNode,
    when: number,
    offset: number,
    span: number,
    hold: AudioScheduledSourceNode[],
  ): Live {
    const bus = ctx.createGain();
    const masterLow = ctx.createBiquadFilter();
    masterLow.type = "lowshelf";
    masterLow.frequency.value = 220;
    const masterHigh = ctx.createBiquadFilter();
    masterHigh.type = "highshelf";
    masterHigh.frequency.value = 6500;
    const masterComp = ctx.createDynamicsCompressor();
    masterComp.attack.value = 0.012;
    masterComp.release.value = 0.24;
    masterComp.knee.value = 10;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -2.2;
    limiter.knee.value = 0;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.12;
    const out = ctx.createGain();
    const verb = ctx.createConvolver();
    verb.buffer = makeImpulse(ctx);
    const verbTone = ctx.createBiquadFilter();
    verbTone.type = "lowpass";
    verbTone.frequency.value = 6500;
    verb.connect(verbTone).connect(bus);
    const drum = ctx.createGain();
    drum.gain.value = 0.4;
    drum.connect(bus);
    bus.connect(masterLow).connect(masterHigh).connect(masterComp).connect(out).connect(limiter).connect(destination);

    const live: Live = { tracks: new Map(), masterLow, masterHigh, masterComp, out, drum };

    for (const track of song.tracks) {
      const take = activeTake(track);
      if (!take) continue;
      const buffer = this.buffers.get(take.audioId);
      if (!buffer) continue;
      const start = track.trimStart + offset;
      const dur = buffer.duration - track.trimStart - track.trimEnd - offset;
      if (dur <= 0.03 || start >= buffer.duration) continue;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const nodes = this.wireTrack(ctx, verb, bus);
      source.connect(nodes.hp);
      source.start(when, start, dur);
      hold.push(source);
      live.tracks.set(track.id, nodes);
      hold.push(...nodes.extras);
    }

    if (span > 0) scheduleSpan(ctx, drum, noise, song, offset, span, when, hold);
    this.applyMix(song, live, ctx);
    return live;
  }

  private wireTrack(ctx: BaseAudioContext, verb: ConvolverNode, bus: GainNode): TrackNodes {
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 70;
    hp.Q.value = 0.7;
    const low = ctx.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = 240;
    const mid = ctx.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 2800;
    mid.Q.value = 0.8;
    const high = ctx.createBiquadFilter();
    high.type = "highshelf";
    high.frequency.value = 8000;
    const comp = ctx.createDynamicsCompressor();
    comp.attack.value = 0.015;
    comp.release.value = 0.2;
    comp.knee.value = 14;
    const makeup = ctx.createGain();
    const fader = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 1;
    const twinDelay = ctx.createDelay(0.1);
    twinDelay.delayTime.value = 0.024;
    const twin = ctx.createGain();
    twin.gain.value = 0;
    const echoDelay = ctx.createDelay(1.5);
    const echoFb = ctx.createGain();
    const echoMix = ctx.createGain();
    const verbSend = ctx.createGain();
    const phone = ctx.createBiquadFilter();
    phone.type = "bandpass";
    phone.frequency.value = 1400;
    phone.Q.value = 0.85;
    const phoneMix = ctx.createGain();
    phoneMix.gain.value = 0;
    const chorusDelay = ctx.createDelay(0.05);
    chorusDelay.delayTime.value = 0.018;
    const chorusLfo = ctx.createOscillator();
    chorusLfo.frequency.value = 0.33;
    const chorusDepth = ctx.createGain();
    chorusDepth.gain.value = 0.005;
    const chorusMix = ctx.createGain();
    chorusMix.gain.value = 0;
    const ring = ctx.createGain();
    ring.gain.value = 0;
    const ringOsc = ctx.createOscillator();
    ringOsc.frequency.value = 48;
    const ringMix = ctx.createGain();
    ringMix.gain.value = 0;
    let gate: AudioWorkletNode | undefined;
    let head: AudioNode = hp;
    if (this.gateReady && ctx instanceof AudioContext) {
      gate = new AudioWorkletNode(ctx, "lydvenn-gate");
      hp.connect(gate);
      head = gate;
    }
    head.connect(low).connect(mid).connect(high).connect(comp).connect(makeup).connect(fader);
    fader.connect(dry).connect(bus);
    fader.connect(phone).connect(phoneMix).connect(bus);
    chorusLfo.connect(chorusDepth).connect(chorusDelay.delayTime);
    fader.connect(chorusDelay).connect(chorusMix).connect(bus);
    ringOsc.connect(ring.gain);
    fader.connect(ring).connect(ringMix).connect(bus);
    const started = ctx.currentTime;
    chorusLfo.start(started);
    ringOsc.start(started);
    fader.connect(twinDelay).connect(twin);
    twin.connect(bus);
    fader.connect(echoDelay);
    echoDelay.connect(echoFb).connect(echoDelay);
    echoDelay.connect(echoMix);
    echoMix.connect(bus);
    fader.connect(verbSend).connect(verb);
    return {
      low,
      mid,
      high,
      hp,
      comp,
      makeup,
      fader,
      dry,
      twin,
      echoMix,
      echoFb,
      echoDelay,
      verbSend,
      phoneMix,
      chorusMix,
      ringMix,
      extras: [chorusLfo, ringOsc],
      gate,
    };
  }

  private applyMix(song: Song, live: Live | null = this.live, ctx: BaseAudioContext | null = this.ctx) {
    if (!live || !ctx) return;
    const dry = song.compareDry;
    const anySolo = song.tracks.some((track) => track.solo);
    for (const track of song.tracks) {
      const nodes = live.tracks.get(track.id);
      if (!nodes) continue;
      const on = !track.muted && (!anySolo || track.solo);
      glide(nodes.fader.gain, on ? track.volume : 0, ctx);
      const tone = dry ? { low: 0, mid: 0, high: 0 } : toneGains(track.tone);
      glide(nodes.low.gain, tone.low, ctx);
      glide(nodes.mid.gain, tone.mid, ctx);
      glide(nodes.high.gain, tone.high, ctx);
      glide(nodes.hp.frequency, dry ? 45 : 45 + track.hush * 190, ctx);
      const even = dry ? 0 : track.even;
      glide(nodes.comp.threshold, -8 - even * 24, ctx);
      glide(nodes.comp.ratio, 1 + even * 5, ctx);
      glide(nodes.makeup.gain, 1 + even * 1.15, ctx);
      glide(nodes.twin.gain, dry ? 0 : track.twin * 0.5, ctx);
      const trick = dry ? "ingen" : (track.trick ?? "ingen");
      glide(nodes.dry.gain, trick === "telefon" ? 0.16 : trick === "robot" ? 0.72 : 1, ctx);
      glide(nodes.phoneMix.gain, trick === "telefon" ? 0.95 : 0, ctx);
      glide(nodes.chorusMix.gain, trick === "kor" ? 0.5 : 0, ctx);
      glide(nodes.ringMix.gain, trick === "robot" ? 0.32 : 0, ctx);
      const echo = dry ? { time: 0.16, fb: 0, mix: 0 } : echoSettings(track.echo, song.bpm);
      glide(nodes.echoDelay.delayTime, echo.time, ctx);
      glide(nodes.echoFb.gain, echo.fb, ctx);
      glide(nodes.echoMix.gain, echo.mix, ctx);
      glide(nodes.verbSend.gain, dry ? 0 : roomSend(track.room), ctx);
      nodes.gate?.port.postMessage({ threshold: dry ? 0 : track.hush * 0.04 });
    }
    const master = dry
      ? { low: 0, high: 0, threshold: 0, ratio: 1, out: 1 }
      : masterSettings(song.master);
    glide(live.masterLow.gain, master.low, ctx);
    glide(live.masterHigh.gain, master.high, ctx);
    glide(live.masterComp.threshold, master.threshold, ctx);
    glide(live.masterComp.ratio, master.ratio, ctx);
    glide(live.out.gain, master.out, ctx);
  }

  private startLoop(song: Song, drum: GainNode) {
    const ctx = this.ctx;
    const noise = this.noise;
    if (!ctx || !noise) return;
    let index = 0;
    let next = ctx.currentTime + 0.08;
    this.drumTimer = window.setInterval(() => {
      if (!this.playing || !this.looping || !this.song) return;
      const step = 60 / this.song.bpm / 2;
      const horizon = ctx.currentTime + 0.28;
      while (next < horizon) {
        hit(ctx, drum, noise, this.song ?? song, index, next, this.hold);
        index += 1;
        next += step;
        if (this.hold.length > 80) this.hold.splice(0, 40);
      }
    }, 40);
  }

  private stopPerformance() {
    if (this.drumTimer != null) {
      window.clearInterval(this.drumTimer);
      this.drumTimer = null;
    }
    for (const node of this.hold) {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    }
    this.hold = [];
    this.live?.out.disconnect();
    this.live = null;
  }

  private attachMeter(stream: MediaStream) {
    if (!this.ctx || this.analyser) return;
    const source = this.ctx.createMediaStreamSource(stream);
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    this.meterSource = source;
    this.analyser = analyser;
    this.meterData = new Float32Array(analyser.fftSize);
  }

  private stopStream() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.listening = false;
    this.meterSource?.disconnect();
    this.meterSource = null;
    this.analyser = null;
    this.level = 0;
    this.note = null;
    this.hint = null;
  }

  private readMeter() {
    if (!this.analyser || !this.ctx) return;
    this.analyser.getFloatTimeDomainData(this.meterData);
    let peak = 0;
    for (let i = 0; i < this.meterData.length; i += 4) peak = Math.max(peak, Math.abs(this.meterData[i] ?? 0));
    this.level = peak;
    const pitch = detectPitch(this.meterData, this.ctx.sampleRate);
    this.note = pitch?.note ?? null;
    this.hint = pitch ? pitchHint(pitch.cents) : null;
  }

  private position(): number {
    if (!this.playing || !this.ctx) return this.pausedAt;
    return this.startedOffset + (this.ctx.currentTime - this.startedCtx);
  }

  private tick = () => {
    if (this.dead) return;
    this.readMeter();
    if (this.playing && !this.looping && this.song) {
      const length = audioLength(this.song, this.buffers);
      if (length > 0.05 && this.position() >= length + 0.35) this.pause();
    }
    const active = this.playing || this.recording || this.counting || this.listening;
    const now = performance.now();
    if (active && now - this.lastEmit > 80) {
      this.lastEmit = now;
      this.emit();
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  private emit() {
    if (this.dead) return;
    this.lastEmit = performance.now();
    this.onChange(this.snapshot());
  }

  private snapshot(): EngineSnap {
    return {
      playing: this.playing,
      recording: this.recording,
      counting: this.counting,
      listening: this.listening,
      countLeft: this.countLeft,
      position: this.position(),
      level: this.level,
      note: this.note,
      hint: this.hint,
      error: this.error,
      notice: this.notice,
    };
  }
}
