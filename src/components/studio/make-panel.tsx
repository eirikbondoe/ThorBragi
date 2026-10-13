import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mixClips, parseDjPlan } from "@/lib/studio/dj-mix";
import { putAudio } from "@/lib/studio/idb";
import { planDj, pollMake, speakDj, startMake, type MakeKind } from "@/lib/studio/make";
import { useStudio } from "@/lib/studio/store";
import type { Song } from "@/lib/studio/types";
import { encodeWav, measureBuffer } from "@/lib/studio/wav";
import { PanelHead } from "./bits";

type Choice = MakeKind | "rap";

const KINDS: { id: Choice; label: string; text: string }[] = [
  { id: "sang", label: "Sang", text: "Lydene dine blir rytmen. Teksten kan du synge selv." },
  { id: "rap", label: "Rap", text: "Samme miks, og en stemme leser teksten oppå beatet. Den synger ikke." },
  { id: "bilde", label: "Forside", text: "Ett bilde." },
  { id: "video", label: "Musikkvideo", text: "Bilde av deg og av den du spiller med. Filmen er 6 sekunder." },
];

type Clip = { name: string; text: string; file: File };
type FileNote = { name: string; detail: string };

async function stillOf(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("Klarte ikke å lese videoen."));
      });
      video.currentTime = Math.min(0.4, Math.max(0, (video.duration || 1) / 4));
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
      return draw(video);
    }
    const image = new Image();
    image.src = url;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Klarte ikke å lese bildet."));
    });
    return draw(image);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function draw(source: CanvasImageSource & { videoWidth?: number; videoHeight?: number; naturalWidth?: number; naturalHeight?: number }) {
  const width = source.videoWidth || source.naturalWidth || 768;
  const height = source.videoHeight || source.naturalHeight || 768;
  const scale = Math.min(1, 768 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(width * scale));
  canvas.height = Math.max(2, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Klarte ikke å lese bildet.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function MakePanel({ song }: { song: Song }) {
  const patchSong = useStudio((state) => state.patchSong);
  const setLyrics = useStudio((state) => state.setLyrics);
  const addTrack = useStudio((state) => state.addTrack);
  const patchTrack = useStudio((state) => state.patchTrack);
  const addTake = useStudio((state) => state.addTake);
  const setBpm = useStudio((state) => state.setBpm);
  const [kind, setKind] = useState<Choice>("sang");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<FileNote[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [image, setImage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyricsOut] = useState("");
  const [chords, setChords] = useState("");
  const [picture, setPicture] = useState("");
  const [film, setFilm] = useState("");
  const [mixUrl, setMixUrl] = useState("");
  const [mixBlob, setMixBlob] = useState<Blob | null>(null);
  const [bpm, setBpmOut] = useState(96);

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const next = [...files];
    let still = image;
    const added: string[] = [];
    for (const file of Array.from(list).slice(0, 4)) {
      if (next.length >= 4) break;
      if (file.type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg|webm)$/i.test(file.name)) {
        if (file.size > 15 * 1024 * 1024) {
          setError("Lydfilen er for stor. Maks 15 MB.");
          continue;
        }
        const body = new FormData();
        body.append("file", file, file.name);
        const res = await fetch("/api/transcribe", { method: "POST", body });
        const data = (await res.json()) as { ok?: boolean; text?: string; error?: string };
        const heard = data.ok && data.text ? data.text : "";
        setClips((current) => [...current, { name: file.name, text: heard, file }].slice(0, 4));
        next.push({ name: file.name, detail: heard ? "Lyd, med tekst" : "Lyd, uten ord" });
      } else if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        still = await stillOf(file);
        if (file.type.startsWith("image/")) added.push(still);
        next.push({ name: file.name, detail: file.type.startsWith("video/") ? "Ett bilde fra videoen" : "Bilde" });
      } else {
        const text = (await file.text()).slice(0, 4000);
        setNote((current) => `${current}\n${text}`.trim().slice(0, 4000));
        next.push({ name: file.name, detail: "Tekst" });
      }
    }
    setFiles(next);
    setImage(still);
    if (added.length) setPhotos((current) => [...current, ...added].slice(0, 2));
  }

  async function setSlot(index: 0 | 1, file: File | undefined) {
    if (!file) return;
    setError("");
    const still = await stillOf(file);
    setPhotos((current) => {
      const next = [current[0] ?? "", current[1] ?? ""];
      next[index] = still;
      return next;
    });
    setImage(still);
  }

  async function mixSong() {
    if (clips.length === 0) throw new Error("Last opp minst én kort lyd.");
    setBusy(kind === "rap" ? "Skriver rappen og mikser." : "Skriver sangen og mikser.");
    const planned = await planDj({
      data: { style: kind === "rap" ? "rap" : "sang", note, clips: clips.map((clip) => ({ name: clip.name, text: clip.text })) },
    });
    if (!planned.ok) throw new Error(planned.error);
    const plan = parseDjPlan(planned.text, clips.length);
    let vocal: AudioBuffer | null = null;
    const ctx = new AudioContext();
    if (kind === "rap" && plan.lyrics) {
      const spoken = await speakDj({ data: { text: plan.lyrics } });
      if (spoken.ok) {
        const binary = atob(spoken.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        vocal = await ctx.decodeAudioData(bytes.buffer.slice(0));
      } else {
        setError("Beatet er klart. Stemmen kom ikke.");
      }
    }
    const buffers: AudioBuffer[] = [];
    for (const clip of clips) {
      const raw = await clip.file.arrayBuffer();
      buffers.push(await ctx.decodeAudioData(raw.slice(0)));
    }
    const mixed = await mixClips(buffers, plan, vocal, kind === "rap");
    const blob = encodeWav(mixed);
    if (mixUrl) URL.revokeObjectURL(mixUrl);
    setMixBlob(blob);
    setMixUrl(URL.createObjectURL(blob));
    setTitle(plan.title);
    setLyricsOut(plan.lyrics);
    setBpmOut(plan.bpm);
    setChords("");
    await ctx.close();
  }

  async function run() {
    setError("");
    setTitle("");
    setLyricsOut("");
    setChords("");
    setPicture("");
    setFilm("");
    try {
      if (kind === "sang" || kind === "rap") {
        await mixSong();
        return;
      }
      const visual = kind === "video" ? "video" : "bilde";
      setBusy(visual === "video" ? "Lager filmen. Vent." : "Lager bildet.");
      const faces = photos.filter(Boolean).slice(0, 2);
      const result = await startMake({ data: { kind: visual, note, image: faces[0] || image, images: visual === "video" ? faces : [] } });
      if (!result.ok) throw new Error(result.error);
      if (result.kind === "sang") {
        setTitle(result.title);
        setLyricsOut(result.lyrics);
        setChords(result.chords);
        return;
      }
      if (result.kind === "bilde") {
        setPicture(result.image);
        return;
      }
      if (result.kind !== "video") throw new Error("Fikk ikke startet filmen.");
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        const status = await pollMake({ data: { requestId: result.requestId } });
        if (!status.ok) throw new Error(status.error);
        if (status.kind === "status" && status.url) {
          setFilm(status.url);
          return;
        }
      }
      throw new Error("Filmen tok for lang tid. Prøv én gang til.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fikk ikke laget det.");
    } finally {
      setBusy("");
    }
  }

  const chosen = KINDS.find((item) => item.id === kind);

  return (
    <section>
      <PanelHead
        title="AI-DJ"
        lede="Last opp korte lyder. AI-DJ-en setter dem etter hverandre, legger på beat og skriver tekst. Rap får en stemme oppå. Den synger ikke. Ingenting lages før du trykker."
      />
      <div className="flex flex-wrap gap-2">
        {KINDS.map((item) => (
          <Button key={item.id} variant={kind === item.id ? "primary" : "quiet"} aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{chosen?.text}</p>
      {kind === "video" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["Bilde av deg", "Bilde av den du spiller med"] as const).map((label, index) => (
            <label key={label} className="text-sm">
              {label}
              <input
                className="mt-1 block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  void setSlot(index as 0 | 1, event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              {photos[index] ? <img src={photos[index]} alt="" className="mt-2 h-28 w-full rounded-md object-cover" /> : null}
            </label>
          ))}
          <p className="col-span-2 text-sm text-muted">Begge bildene brukes. Ansiktene skal ligne bildene. Filmen er 6 sekunder.</p>
        </div>
      ) : null}
      <label className="mt-4 block text-sm" htmlFor="make-note">
        Tekst
      </label>
      <textarea
        id="make-note"
        rows={5}
        value={note}
        onChange={(event) => setNote(event.target.value.slice(0, 4000))}
        placeholder="Skriv, eller lim inn."
        className="mt-1 w-full rounded-md border border-line bg-surface px-4 py-3"
      />
      <label className="mt-3 inline-flex cursor-pointer">
        <input
          className="sr-only"
          type="file"
          accept="audio/*,image/*,video/*,.txt,.md"
          multiple
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm">Last opp filer</span>
      </label>
      {files.length ? (
        <ul className="mt-3 space-y-1 text-sm">
          {files.map((file) => (
            <li key={file.name}>
              {file.name}
              <span className="text-muted"> · {file.detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-sm text-muted">Maks fire lyder. Hver lyd brukes i biter. Fra en video til forside eller film brukes ett bilde.</p>
      <Button className="mt-4" disabled={Boolean(busy)} onClick={() => void run()}>
        {busy || (kind === "sang" || kind === "rap" ? "Miks" : "Lag")}
      </Button>
      {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
      {mixUrl ? <audio className="mt-4 w-full" src={mixUrl} controls /> : null}
      {lyrics || mixUrl ? (
        <div className="mt-4 space-y-3">
          <p className="font-medium">{title}</p>
          <pre className="whitespace-pre-wrap font-sans text-sm">{lyrics}</pre>
          {chords ? <p className="text-sm text-muted">Grep: {chords}</p> : null}
          <Button
            variant="quiet"
            onClick={() => {
              if (title) patchSong(song.id, { title });
              setLyrics(song.id, lyrics);
              if (mixBlob) {
                const audioId = crypto.randomUUID();
                void putAudio(audioId, mixBlob).then(() => {
                  const trackId = addTrack(song.id, "annet");
                  patchTrack(song.id, trackId, { name: kind === "rap" ? "AI-DJ rap" : "AI-DJ" });
                  const probe = new AudioContext();
                  void mixBlob.arrayBuffer().then(async (raw) => {
                    const buffer = await probe.decodeAudioData(raw.slice(0));
                    const { peaks, peak } = measureBuffer(buffer);
                    addTake(song.id, trackId, {
                      id: crypto.randomUUID(),
                      audioId,
                      duration: buffer.duration,
                      peak,
                      peaks,
                      createdAt: Date.now(),
                    });
                    void probe.close();
                  });
                });
                setBpm(song.id, bpm);
              }
            }}
          >
            {mixBlob ? "Legg miksen og teksten inn i denne låten. Tittelen byttes også." : "Legg teksten inn i denne låten. Tittelen byttes også."}
          </Button>
        </div>
      ) : null}
      {picture ? (
        <div className="mt-4 space-y-3">
          <img src={picture} alt="Forsidebilde" className="max-h-80 rounded-md border border-line" />
          <a className="text-sm text-lamp" href={picture} download={`${song.title || "forside"}.jpg`}>
            Last ned bildet
          </a>
        </div>
      ) : null}
      {film ? (
        <div className="mt-4 space-y-3">
          <video src={film} controls playsInline className="max-h-96 w-full rounded-md border border-line bg-black" />
          <a className="text-sm text-lamp" href={film} target="_blank" rel="noreferrer">
            Åpne filmen
          </a>
          <p className="text-sm text-muted">Lenken virker en stund. Lagre filmen hvis du vil beholde den.</p>
        </div>
      ) : null}
    </section>
  );
}
