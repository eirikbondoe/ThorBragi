import type { VideoFrame, VideoLook } from "./types";

export const LOOK_FILTER: Record<VideoLook, string> = {
  rett: "none",
  varm: "sepia(0.28) saturate(1.2) contrast(1.04)",
  kveld: "contrast(1.08) saturate(0.8) brightness(0.9)",
  svartkvitt: "grayscale(1) contrast(1.08)",
};

export function frameSize(frame: VideoFrame): { width: number; height: number } {
  return frame === "skjerm" ? { width: 1280, height: 720 } : { width: 720, height: 1280 };
}

export function lyricLine(lyrics: string, ratio: number): string {
  const lines = lyrics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";
  const index = Math.min(lines.length - 1, Math.max(0, Math.floor(ratio * lines.length)));
  return lines[index] ?? "";
}

export function pickVideoMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function measureVideo(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(url);
      if (!Number.isFinite(duration)) reject(new Error("Fant ikke lengden på filmen."));
      else resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Klarte ikke å lese filmen."));
    };
    video.src = url;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
  mirror: boolean,
) {
  const sourceWidth = video.videoWidth || width;
  const sourceHeight = video.videoHeight || height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;
  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, x, y, drawWidth, drawHeight);
  ctx.restore();
}

function drawCaption(ctx: CanvasRenderingContext2D, width: number, height: number, title: string, line: string) {
  const bar = Math.round(height * 0.16);
  ctx.fillStyle = "rgba(10, 17, 40, 0.82)";
  ctx.fillRect(0, height - bar, width, bar);
  ctx.fillStyle = "#2ec8e6";
  ctx.fillRect(0, height - bar, Math.max(4, Math.round(width * 0.008)), bar);
  ctx.fillStyle = "#f4efea";
  ctx.font = `500 ${Math.round(width * 0.04)}px Montserrat, sans-serif`;
  ctx.fillText(title.slice(0, 42), Math.round(width * 0.04), height - bar + bar * 0.42);
  if (!line) return;
  ctx.fillStyle = "#f4efea";
  ctx.font = `400 ${Math.round(width * 0.03)}px Inter, sans-serif`;
  ctx.fillText(line.slice(0, 64), Math.round(width * 0.04), height - bar + bar * 0.76);
}

export async function renderEditedVideo(options: {
  blob: Blob;
  trimStart: number;
  trimEnd: number;
  look: VideoLook;
  frame: VideoFrame;
  mirror: boolean;
  title: string;
  lyrics: string;
  showTitle: boolean;
  showLyrics: boolean;
  mime?: string;
}): Promise<Blob> {
  if (typeof HTMLCanvasElement.prototype.captureStream !== "function") {
    throw new Error("Denne nettleseren kan ikke brenne tekst og klipp inn i filmen. Prøv Chrome.");
  }
  const url = URL.createObjectURL(options.blob);
  const video = document.createElement("video");
  video.src = url;
  video.playsInline = true;
  video.volume = 0.8;
  await new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error("Klarte ikke å åpne filmen."));
  });
  const end = Math.max(options.trimStart + 0.2, video.duration - options.trimEnd);
  video.currentTime = options.trimStart;
  await new Promise<void>((resolve) => {
    video.onseeked = () => resolve();
  });

  const { width, height } = frameSize(options.frame);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Klarte ikke å tegne filmen.");
  const picture = canvas.captureStream(30);

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(video);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);
  const mixed = new MediaStream([...picture.getVideoTracks(), ...dest.stream.getAudioTracks()]);
  const mime =
    options.mime && typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(options.mime)
      ? options.mime
      : pickVideoMime();
  const recorder = new MediaRecorder(mixed, mime ? { mimeType: mime, videoBitsPerSecond: 2_500_000 } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });
  recorder.start(200);
  await video.play();

  await new Promise<void>((resolve) => {
    const draw = () => {
      if (video.ended || video.currentTime >= end - 0.03) {
        resolve();
        return;
      }
      ctx.filter = LOOK_FILTER[options.look];
      drawCover(ctx, video, width, height, options.mirror);
      ctx.filter = "none";
      if (options.showTitle || options.showLyrics) {
        const span = Math.max(0.1, end - options.trimStart);
        const ratio = (video.currentTime - options.trimStart) / span;
        drawCaption(
          ctx,
          width,
          height,
          options.showTitle ? options.title || "Uten navn" : "",
          options.showLyrics ? lyricLine(options.lyrics, ratio) : "",
        );
      }
      requestAnimationFrame(draw);
    };
    draw();
  });

  video.pause();
  if (recorder.state !== "inactive") recorder.stop();
  await stopped;
  source.disconnect();
  await audioCtx.close();
  URL.revokeObjectURL(url);
  const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
  if (blob.size < 500) throw new Error("Filmen ble tom. Prøv en gang til.");
  return blob;
}

export async function posterJpeg(blob: Blob, atSeconds: number, mirror: boolean): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;
  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Klarte ikke å lage forsidebildet."));
    });
    const at = Math.min(Math.max(0, atSeconds), Math.max(0, (video.duration || 1) - 0.05));
    if (at > 0) {
      video.currentTime = at;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Klarte ikke å lage forsidebildet.");
    drawCover(ctx, video, 1280, 720, mirror);
    const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!jpeg) throw new Error("Klarte ikke å lage forsidebildet.");
    return jpeg;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type ClipPart = { index: number; start: number; end: number };

export const SPLIT_TARGETS = [
  { id: "to", label: "Del i to", seconds: 0, text: "Ett kutt der du vil." },
  { id: "tiktok", label: "TikTok", seconds: 60, text: "60 sekunder per del. Stående." },
  { id: "instagram", label: "Instagram", seconds: 90, text: "90 sekunder per del. Stående." },
  { id: "shorts", label: "Shorts", seconds: 180, text: "Tre minutter per del. Stående." },
] as const;

export type SplitId = (typeof SPLIT_TARGETS)[number]["id"];

export function planParts(duration: number, trimStart: number, trimEnd: number, seconds: number): ClipPart[] {
  const start = Math.max(0, trimStart);
  const end = Math.max(start, duration - Math.max(0, trimEnd));
  if (end - start < 0.4 || seconds < 1) return [];
  const parts: ClipPart[] = [];
  let cursor = start;
  let index = 1;
  while (cursor < end - 0.2 && parts.length < 24) {
    const next = Math.min(end, cursor + seconds);
    if (next - cursor < 0.4) break;
    parts.push({ index, start: cursor, end: next });
    cursor = next;
    index += 1;
  }
  return parts;
}

export function splitInTwo(duration: number, trimStart: number, trimEnd: number, at: number): ClipPart[] {
  const start = Math.max(0, trimStart);
  const end = Math.max(start, duration - Math.max(0, trimEnd));
  const cut = Math.min(end - 0.4, Math.max(start + 0.4, at));
  if (end - start < 0.8) return [{ index: 1, start, end }];
  return [
    { index: 1, start, end: cut },
    { index: 2, start: cut, end },
  ];
}
