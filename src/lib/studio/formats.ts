import { Mp3Encoder } from "@breezystack/lamejs";
import { encodeWav } from "./wav";

export type SaveFormat = {
  id: string;
  label: string;
  ext: string;
  mime: string;
  kind: "audio" | "video";
};

const AUDIO_ALWAYS: SaveFormat[] = [
  { id: "wav", label: "WAV", ext: "wav", mime: "audio/wav", kind: "audio" },
  { id: "mp3", label: "MP3", ext: "mp3", mime: "audio/mpeg", kind: "audio" },
];

const AUDIO_IF_BROWSER: { id: string; label: string; ext: string; mimes: string[] }[] = [
  { id: "m4a", label: "M4A", ext: "m4a", mimes: ["audio/mp4", "audio/mp4;codecs=mp4a.40.2"] },
  { id: "ogg", label: "Ogg", ext: "ogg", mimes: ["audio/ogg;codecs=opus", "audio/ogg"] },
  { id: "opus", label: "Opus", ext: "webm", mimes: ["audio/webm;codecs=opus", "audio/webm"] },
];

const VIDEO_IF_BROWSER: { id: string; label: string; ext: string; mimes: string[] }[] = [
  { id: "webm", label: "WebM", ext: "webm", mimes: ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"] },
  { id: "mp4", label: "MP4", ext: "mp4", mimes: ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4"] },
  { id: "ogg", label: "Ogg", ext: "ogv", mimes: ["video/ogg;codecs=theora,vorbis", "video/ogg"] },
];

function supportedMime(mimes: string[]) {
  if (typeof MediaRecorder === "undefined") return "";
  return mimes.find((mime) => MediaRecorder.isTypeSupported(mime)) ?? "";
}

export function audioFormats(): SaveFormat[] {
  const extra = AUDIO_IF_BROWSER.flatMap((item) => {
    const mime = supportedMime(item.mimes);
    return mime ? [{ id: item.id, label: item.label, ext: item.ext, mime, kind: "audio" as const }] : [];
  });
  return [...AUDIO_ALWAYS, ...extra];
}

export function videoFormats(): SaveFormat[] {
  return VIDEO_IF_BROWSER.flatMap((item) => {
    const mime = supportedMime(item.mimes);
    return mime ? [{ id: item.id, label: item.label, ext: item.ext, mime, kind: "video" as const }] : [];
  });
}

export function formatById(formats: SaveFormat[], id: string) {
  return formats.find((format) => format.id === id) ?? formats[0];
}

export async function encodeAudio(buffer: AudioBuffer, format: SaveFormat): Promise<Blob> {
  if (format.id === "wav") return encodeWav(buffer);
  if (format.id === "mp3") return encodeMp3(buffer);
  return recordBuffer(buffer, format.mime);
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function floatTo16(input: Float32Array) {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i] ?? 0));
    out[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return out;
}

function encodeMp3(buffer: AudioBuffer) {
  const channels = Math.min(2, buffer.numberOfChannels);
  const encoder = new Mp3Encoder(channels, buffer.sampleRate, 320);
  const left = floatTo16(buffer.getChannelData(0));
  const right = channels > 1 ? floatTo16(buffer.getChannelData(1)) : left;
  const chunks: Uint8Array[] = [];
  const block = 1152;
  for (let i = 0; i < left.length; i += block) {
    const l = left.subarray(i, i + block);
    const r = right.subarray(i, i + block);
    const mp3 = channels > 1 ? encoder.encodeBuffer(l, r) : encoder.encodeBuffer(l);
    if (mp3.length) chunks.push(mp3);
  }
  const end = encoder.flush();
  if (end.length) chunks.push(end);
  return new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
}

function recordBuffer(buffer: AudioBuffer, mime: string) {
  const ctx = new AudioContext();
  const dest = ctx.createMediaStreamDestination();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(dest);
  const recorder = new MediaRecorder(dest.stream, { mimeType: mime });
  const chunks: Blob[] = [];
  return new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onerror = () => {
      void ctx.close();
      reject(new Error("Klarte ikke å lage filen."));
    };
    recorder.onstop = () => {
      source.disconnect();
      void ctx.close();
      resolve(new Blob(chunks, { type: recorder.mimeType || mime }));
    };
    recorder.start();
    source.onended = () => {
      if (recorder.state !== "inactive") recorder.stop();
    };
    source.start();
  });
}
