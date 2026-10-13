import { createServerFn } from "@tanstack/react-start";
import type { MakeKind, MakeResult } from "./make.server";

export type { MakeKind, MakeResult };

function clean(input: unknown) {
  const data = input as { kind?: string; note?: string; image?: string; images?: string[] };
  const kind = data.kind === "bilde" || data.kind === "video" ? data.kind : "sang";
  const note = String(data.note ?? "").slice(0, 4000);
  const images = (Array.isArray(data.images) ? data.images : [])
    .filter((item) => typeof item === "string" && item.startsWith("data:image/"))
    .slice(0, 2)
    .map((item) => item.slice(0, 1_800_000));
  const image =
    images[0] || (typeof data.image === "string" && data.image.startsWith("data:image/") ? data.image.slice(0, 1_800_000) : "");
  if (!note.trim() && !image) throw new Error("Legg inn tekst eller et bilde først.");
  return { kind: kind as MakeKind, note, image, images: images.length ? images : image ? [image] : [] };
}

export const startMake = createServerFn({ method: "POST" })
  .validator(clean)
  .handler(async ({ data }): Promise<MakeResult> => {
    const { runMake } = await import("./make.server");
    return runMake(data);
  });

export const pollMake = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const id = String((input as { requestId?: string }).requestId ?? "");
    if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) throw new Error("Ukjent film.");
    return { requestId: id };
  })
  .handler(async ({ data }): Promise<MakeResult> => {
    const { runPoll } = await import("./make.server");
    return runPoll(data.requestId);
  });

export const planDj = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { style?: string; note?: string; clips?: { name?: string; text?: string }[] };
    const style = data.style === "rap" ? "rap" : "sang";
    const clips = Array.isArray(data.clips) ? data.clips.slice(0, 4) : [];
    const cleanClips = clips.map((clip) => ({
      name: String(clip.name ?? "lyd").slice(0, 80),
      text: String(clip.text ?? "").slice(0, 300),
    }));
    if (cleanClips.length === 0) throw new Error("Last opp minst én kort lyd.");
    return { style: style as "sang" | "rap", note: String(data.note ?? "").slice(0, 800), clips: cleanClips };
  })
  .handler(async ({ data }) => {
    const { runDj } = await import("./make.server");
    return runDj(data);
  });

export const speakDj = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const text = String((input as { text?: string }).text ?? "").trim().slice(0, 600);
    if (text.length < 2) throw new Error("Ingen tekst å lese.");
    return { text };
  })
  .handler(async ({ data }) => {
    const { runSpeak } = await import("./make.server");
    return runSpeak(data.text);
  });
