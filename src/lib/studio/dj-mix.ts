export type DjPlan = {
  title: string;
  bpm: number;
  lyrics: string;
  order: number[];
};

export function parseDjPlan(text: string, clipCount: number): DjPlan {
  const raw = text.replace(/```json|```/g, "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  let title = "AI-DJ";
  let bpm = 96;
  let lyrics = "";
  let order: number[] = [];
  if (start >= 0 && end > start) {
    try {
      const data = JSON.parse(raw.slice(start, end + 1)) as {
        title?: string;
        bpm?: number;
        lyrics?: string;
        order?: number[];
      };
      if (data.title) title = String(data.title).trim().slice(0, 80);
      if (typeof data.bpm === "number" && data.bpm >= 70 && data.bpm <= 160) bpm = Math.round(data.bpm);
      if (data.lyrics) lyrics = String(data.lyrics).trim().slice(0, 1200);
      if (Array.isArray(data.order)) order = data.order.filter((n) => Number.isInteger(n) && n >= 0 && n < clipCount);
    } catch {
      lyrics = "";
    }
  }
  if (order.length === 0 && clipCount > 0) {
    order = Array.from({ length: Math.min(8, Math.max(4, clipCount * 2)) }, (_, i) => i % clipCount);
  }
  return { title, bpm, lyrics, order: order.slice(0, 8) };
}

function noise(ctx: BaseAudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function env(ctx: BaseAudioContext, when: number, peak: number, dur: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  return gain;
}

const ROOTS = [130.81, 98, 110, 87.31];

export async function mixClips(
  clips: AudioBuffer[],
  plan: DjPlan,
  vocal: AudioBuffer | null,
  rap: boolean,
): Promise<AudioBuffer> {
  const rate = clips[0]?.sampleRate || 48000;
  const bar = (60 / plan.bpm) * 4;
  const slot = bar * 2;
  const total = Math.max(slot, plan.order.length * slot);
  const ctx = new OfflineAudioContext(2, Math.ceil((total + 0.4) * rate), rate);
  const drumBus = ctx.createGain();
  drumBus.gain.value = rap ? 0.5 : 0.38;
  const clipBus = ctx.createGain();
  clipBus.gain.value = 0.72;
  const bassBus = ctx.createGain();
  bassBus.gain.value = rap ? 0.22 : 0.16;
  drumBus.connect(ctx.destination);
  clipBus.connect(ctx.destination);
  bassBus.connect(ctx.destination);
  const hat = noise(ctx);

  plan.order.forEach((index, slotIndex) => {
    const clip = clips[index];
    const when = slotIndex * slot;
    if (clip) {
      const source = ctx.createBufferSource();
      source.buffer = clip;
      source.loop = true;
      source.loopEnd = Math.min(clip.duration, 8);
      source.connect(clipBus);
      source.start(when, 0, slot);
      source.stop(when + slot);
    }
    const root = ROOTS[slotIndex % ROOTS.length] ?? 110;
    const bass = ctx.createOscillator();
    const bassGain = env(ctx, when, 0.7, slot * 0.9);
    bass.type = "sine";
    bass.frequency.value = root / 2;
    bass.connect(bassGain).connect(bassBus);
    bass.start(when);
    bass.stop(when + slot);
  });

  const step = 60 / plan.bpm / 2;
  const steps = Math.floor(total / step);
  for (let i = 0; i < steps; i++) {
    const when = i * step;
    const place = i % 8;
    if (place === 0 || (rap && place === 3) || (!rap && place === 4)) {
      const osc = ctx.createOscillator();
      const gain = env(ctx, when, 0.8, 0.2);
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, when);
      osc.frequency.exponentialRampToValueAtTime(48, when + 0.08);
      osc.connect(gain).connect(drumBus);
      osc.start(when);
      osc.stop(when + 0.22);
    }
    if (place === 4 || (rap && place === 2)) {
      const src = ctx.createBufferSource();
      src.buffer = hat;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      const gain = env(ctx, when, 0.4, 0.14);
      src.connect(filter).connect(gain).connect(drumBus);
      src.start(when);
      src.stop(when + 0.16);
    }
    if (place % 2 === 0) {
      const src = ctx.createBufferSource();
      src.buffer = hat;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7000;
      const gain = env(ctx, when, 0.12, 0.04);
      src.connect(filter).connect(gain).connect(drumBus);
      src.start(when);
      src.stop(when + 0.05);
    }
  }

  if (vocal) {
    const voice = ctx.createGain();
    voice.gain.value = 0.9;
    voice.connect(ctx.destination);
    const source = ctx.createBufferSource();
    source.buffer = vocal;
    source.connect(voice);
    const start = bar * 2;
    source.start(start);
  }

  return ctx.startRendering();
}
