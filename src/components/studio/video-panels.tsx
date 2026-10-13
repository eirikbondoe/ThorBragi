import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EngineSnap, StudioEngine } from "@/lib/studio/audio";
import { getAudio, putAudio } from "@/lib/studio/idb";
import { activeVideoTake, useStudio } from "@/lib/studio/store";
import type { Song, VideoLook, VideoSession } from "@/lib/studio/types";
import { lyricLine, measureVideo, pickVideoMime, planParts, renderEditedVideo, SPLIT_TARGETS, splitInTwo, type ClipPart, type SplitId } from "@/lib/studio/video";
import { downloadBlob } from "@/lib/studio/formats";
import { FormatPick, useSaveFormats } from "./format-pick";
import { Choices, formatTime, PanelHead, Slider } from "./bits";

type Props = { song: Song; engine: RefObject<StudioEngine | null>; snap: EngineSnap };

const LOOKS: { id: VideoLook; label: string; text: string }[] = [
  { id: "rett", label: "Rett", text: "Slik kameraet ser deg" },
  { id: "varm", label: "Varm", text: "Litt kveldslampe" },
  { id: "kveld", label: "Kveld", text: "Mørkere, roligere" },
  { id: "svartkvitt", label: "Svart-hvitt", text: "Uten farger" },
];

function useBlobUrl(id: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let dead = false;
    let current: string | null = null;
    void getAudio(id).then((blob) => {
      if (dead || !blob) return;
      current = URL.createObjectURL(blob);
      setUrl(current);
    });
    return () => {
      dead = true;
      if (current) URL.revokeObjectURL(current);
    };
  }, [id]);
  return url;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cameraError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Kamera eller mikrofon er ikke tillatt. Si ja i nettleseren, og prøv igjen.";
  }
  if (name === "NotFoundError") return "Fant ikke kamera.";
  return "Fikk ikke tak i kamera og mikrofon.";
}

function Stage({
  frame,
  children,
}: {
  frame: VideoSession["frame"];
  children: ReactNode;
}) {
  return (
    <div className={`relative mx-auto overflow-hidden rounded-2xl bg-raised ${frame === "skjerm" ? "frame-skjerm" : "frame-telefon"}`}>
      {children}
    </div>
  );
}

function LowerThird({ title, line }: { title: string; line: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-bg/80 px-3 py-3">
      {title ? <p className="text-sm font-medium">{title}</p> : null}
      {line ? <p className="text-sm text-muted">{line}</p> : null}
    </div>
  );
}

function FilmPreview({ song, video, url }: { song: Song; video: VideoSession; url: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState(0);
  const take = activeVideoTake(song);
  const end = Math.max(0.2, (take?.duration ?? 0) - video.trimEnd);

  return (
    <Stage frame={video.frame}>
      <video
        ref={ref}
        src={url}
        playsInline
        className={`h-full w-full object-cover look-${video.look} ${video.mirror ? "mirror-x" : ""}`}
        onPlay={() => {
          const el = ref.current;
          if (el && el.currentTime < video.trimStart) el.currentTime = video.trimStart;
        }}
        onTimeUpdate={() => {
          const el = ref.current;
          if (!el || !take) return;
          if (el.currentTime >= end) {
            el.currentTime = video.trimStart;
          }
          const span = Math.max(0.1, end - video.trimStart);
          setRatio(Math.min(1, Math.max(0, (el.currentTime - video.trimStart) / span)));
        }}
      />
      <button
        type="button"
        className="absolute top-3 left-3 min-h-11 rounded-full bg-bg/80 px-4 text-sm"
        onClick={() => {
          const el = ref.current;
          if (!el) return;
          if (el.paused) void el.play();
          else el.pause();
        }}
      >
        Spill filmen
      </button>
      {video.showTitle || video.showLyrics ? (
        <LowerThird title={video.showTitle ? song.title || "Uten navn" : ""} line={video.showLyrics ? lyricLine(song.lyrics, ratio) : ""} />
      ) : null}
    </Stage>
  );
}

function VideoBooth({ song, engine, snap, graphics }: Props & { graphics: boolean }) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const cancel = useRef(false);
  const discard = useRef(false);
  const countToken = useRef(0);
  const songId = useRef(song.id);
  songId.current = song.id;
  const [phase, setPhase] = useState<"off" | "live" | "count" | "rec" | "saving">("off");
  const [count, setCount] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ratio, setRatio] = useState(0);
  const addVideoTake = useStudio((state) => state.addVideoTake);
  const video = song.video;
  const take = activeVideoTake(song);
  const savedUrl = useBlobUrl(phase === "off" ? (take?.videoId ?? null) : null);

  useEffect(() => {
    return () => {
      cancel.current = true;
      countToken.current += 1;
      if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function arm() {
    setError(null);
    if (snap.recording || snap.counting) {
      setError("Stopp lydopptaket først. Kameraet trenger mikrofonen alene.");
      return;
    }
    engine.current?.stopListen();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setPhase("live");
    } catch (err) {
      setError(cameraError(err));
    }
  }

  useEffect(() => {
    const el = liveRef.current;
    const stream = streamRef.current;
    if (!el || !stream || phase === "off") return;
    el.srcObject = stream;
    void el.play().catch(() => undefined);
  }, [phase]);

  function disarm() {
    countToken.current += 1;
    discard.current = true;
    setCount(null);
    if (recRef.current && recRef.current.state !== "inactive") {
      recRef.current.stop();
      return;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setPhase("off");
  }

  async function record() {
    const stream = streamRef.current;
    if (!stream) return;
    const token = ++countToken.current;
    setPhase("count");
    for (const n of [3, 2, 1]) {
      if (token !== countToken.current) return;
      setCount(n);
      await sleep(700);
    }
    if (token !== countToken.current) return;
    setCount(null);
    const mime = pickVideoMime();
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 2_000_000 } : undefined);
    } catch {
      recorder = new MediaRecorder(stream);
    }
    chunks.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.current.push(event.data);
    };
    recorder.onstop = () => {
      void save(recorder.mimeType || mime || "video/webm");
    };
    recorder.start(250);
    recRef.current = recorder;
    setPhase("rec");
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = (performance.now() - started) / 1000;
      setSeconds(elapsed);
      setRatio(Math.min(1, elapsed / 45));
      if (elapsed >= 180 && recRef.current?.state === "recording") recRef.current.stop();
    }, 200);
    recorder.addEventListener(
      "stop",
      () => {
        window.clearInterval(timer);
      },
      { once: true },
    );
    void engine.current?.play(0);
  }

  async function save(mime: string) {
    engine.current?.pause();
    const dropped = discard.current;
    discard.current = false;
    if (cancel.current || dropped) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (!cancel.current) setPhase("off");
      return;
    }
    setPhase("saving");
    try {
      const blob = new Blob(chunks.current, { type: mime });
      if (blob.size < 800) throw new Error("Opptaket ble tomt. Prøv en gang til.");
      const duration = await measureVideo(blob);
      const videoId = crypto.randomUUID();
      await putAudio(videoId, blob);
      addVideoTake(songId.current, { id: crypto.randomUUID(), videoId, duration, createdAt: Date.now() });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lagre filmen.");
    } finally {
      if (streamRef.current) setPhase("live");
      else setPhase("off");
      setSeconds(0);
    }
  }

  const showLive = phase !== "off";
  const graphicsOn = graphics && video;

  return (
    <div className="space-y-4">
      {showLive ? (
        <Stage frame={video.frame}>
          <video
            ref={liveRef}
            muted
            playsInline
            autoPlay
            className={`h-full w-full object-cover look-${graphicsOn ? video.look : "rett"} ${graphicsOn && video.mirror ? "mirror-x" : ""}`}
          />
          {phase === "count" && count ? (
            <p className="absolute inset-0 flex items-center justify-center font-display text-7xl text-lamp">{count}</p>
          ) : null}
          {phase === "rec" ? (
            <p className="absolute top-3 right-3 rounded-full bg-signal px-3 py-2 text-sm text-signal-ink tabular-nums">
              {formatTime(seconds)}
            </p>
          ) : null}
          {graphicsOn && (video.showTitle || video.showLyrics) ? (
            <LowerThird
              title={video.showTitle ? song.title || "Uten navn" : ""}
              line={video.showLyrics ? lyricLine(song.lyrics, ratio) : ""}
            />
          ) : null}
        </Stage>
      ) : savedUrl ? (
        <FilmPreview song={song} video={video} url={savedUrl} />
      ) : (
        <div className="rounded-2xl border border-line bg-surface px-4 py-8 text-center text-sm text-muted">
          Kameraet er av. Skru det på når du vil synge og filme på en gang.
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {phase === "off" ? (
          <Button onClick={() => void arm()}>Skru på kamera</Button>
        ) : (
          <Button variant="quiet" onClick={disarm}>
            Slå av kamera
          </Button>
        )}
        {phase === "live" ? (
          <Button variant="signal" onClick={() => void record()}>
            Ta opp bilde og lyd
          </Button>
        ) : null}
        {phase === "count" ? (
          <Button
            variant="quiet"
            onClick={() => {
              countToken.current += 1;
              setPhase("live");
              setCount(null);
            }}
          >
            Avbryt
          </Button>
        ) : null}
        {phase === "rec" ? (
          <Button variant="signal" onClick={() => recRef.current?.stop()}>
            Stopp
          </Button>
        ) : null}
        {phase === "saving" ? <p className="text-sm text-muted">Lagrer filmen…</p> : null}
      </div>
      {error ? <p className="text-sm text-signal">{error}</p> : null}
      <p className="text-sm text-muted">Headset på. Sangen spiller mens du filmer, så høyttaleren ikke blir med i opptaket. Vi sender ikke dette ut på nettet.</p>
    </div>
  );
}

function TakeList({ song }: { song: Song }) {
  const useVideoTake = useStudio((state) => state.useVideoTake);
  const removeVideoTake = useStudio((state) => state.removeVideoTake);
  if (song.video.takes.length === 0) return <p className="text-sm text-muted">Ingen filmforsøk ennå.</p>;
  return (
    <ul className="space-y-2">
      {song.video.takes.map((take, index) => {
        const on = take.id === song.video.activeTakeId;
        return (
          <li key={take.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2">
            <span className="text-sm">
              Forsøk {index + 1} · <span className="tabular-nums text-muted">{formatTime(take.duration)}</span>
            </span>
            <Button variant={on ? "primary" : "quiet"} aria-pressed={on} onClick={() => useVideoTake(song.id, take.id)}>
              {on ? "Brukes nå" : "Bruk denne"}
            </Button>
            <Button variant="danger" aria-label="Slett filmforsøk" onClick={() => removeVideoTake(song.id, take.id)}>
              <Trash2 className="size-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function BildePanel(props: Props) {
  return (
    <section>
      <PanelHead
        title="Bilde og lyd"
        lede="Kamera og mikrofon tar opp samtidig, mens låten spiller i headsettet. Ett forsøk er en hel fremføring. Tre minutter er maks."
      />
      <VideoBooth {...props} graphics={false} />
      <div className="mt-5">
        <TakeList song={props.song} />
      </div>
    </section>
  );
}

export function SendingPanel(props: Props) {
  const patchVideo = useStudio((state) => state.patchVideo);
  const video = props.song.video;
  return (
    <section>
      <PanelHead
        title="Sending"
        lede="Slik en sending ser ut: tittel, tekst og et utseende oppå bildet. Du øver her. Filmen lagres på telefonen. Ingenting går ut på nett før du selv legger den ut."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={video.frame === "telefon" ? "primary" : "quiet"} aria-pressed={video.frame === "telefon"} onClick={() => patchVideo(props.song.id, { frame: "telefon" })}>
          Telefon
        </Button>
        <Button variant={video.frame === "skjerm" ? "primary" : "quiet"} aria-pressed={video.frame === "skjerm"} onClick={() => patchVideo(props.song.id, { frame: "skjerm" })}>
          Skjerm
        </Button>
        <Button variant={video.mirror ? "primary" : "quiet"} aria-pressed={video.mirror} onClick={() => patchVideo(props.song.id, { mirror: !video.mirror })}>
          Speil
        </Button>
        <Button variant={video.showTitle ? "primary" : "quiet"} aria-pressed={video.showTitle} onClick={() => patchVideo(props.song.id, { showTitle: !video.showTitle })}>
          Tittel
        </Button>
        <Button variant={video.showLyrics ? "primary" : "quiet"} aria-pressed={video.showLyrics} onClick={() => patchVideo(props.song.id, { showLyrics: !video.showLyrics })}>
          Tekst
        </Button>
      </div>
      <Choices value={video.look} onChange={(look) => patchVideo(props.song.id, { look })} options={LOOKS} />
      <div className="mt-4">
        <VideoBooth {...props} graphics />
      </div>
    </section>
  );
}

export function FilmklippPanel({ song }: Props) {
  const patchVideo = useStudio((state) => state.patchVideo);
  const take = activeVideoTake(song);
  const url = useBlobUrl(take?.videoId ?? null);
  const video = song.video;
  const [target, setTarget] = useState<SplitId | null>(null);
  const [cutAt, setCutAt] = useState(0);
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const { formats, id, setId, format } = useSaveFormats("video");
  const spanStart = video.trimStart;
  const spanEnd = take ? Math.max(spanStart, take.duration - video.trimEnd) : spanStart;
  const parts: ClipPart[] =
    !take || !target
      ? []
      : target === "to"
        ? splitInTwo(take.duration, video.trimStart, video.trimEnd, cutAt || (spanStart + spanEnd) / 2)
        : planParts(take.duration, video.trimStart, video.trimEnd, SPLIT_TARGETS.find((item) => item.id === target)?.seconds ?? 60);

  async function savePart(part: ClipPart) {
    if (!take || busy !== null) return;
    setBusy(part.index);
    setMessage("");
    try {
      const blob = await getAudio(take.videoId);
      if (!blob) throw new Error("Fant ikke filmen på telefonen.");
      if (!format) throw new Error("Denne nettleseren kan ikke lage en filmfil.");
      const social = target === "tiktok" || target === "instagram" || target === "shorts";
      const edited = await renderEditedVideo({
        blob,
        trimStart: part.start,
        trimEnd: Math.max(0, take.duration - part.end),
        look: video.look,
        frame: social ? "telefon" : video.frame,
        mirror: video.mirror,
        title: song.title,
        lyrics: song.lyrics,
        showTitle: video.showTitle,
        showLyrics: video.showLyrics,
        mime: format.mime,
      });
      const safe = song.title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "film";
      const stamp = target ?? "del";
      downloadBlob(edited, `${safe}-${stamp}-del-${part.index}.${format.ext}`);
      setMessage(`Del ${part.index} er lastet ned som ${format.label}. ${formatTime(part.end - part.start)} lang.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke dele filmen.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <PanelHead
        title="Klipp filmen"
        lede="Kutt stillhet i endene. Deretter kan du dele resten i to, eller i lengder som passer TikTok, Instagram og Shorts. Én del lastes ned om gangen."
      />
      {take && url ? (
        <div className="space-y-4">
          <FilmPreview song={song} video={video} url={url} />
          <Slider
            label="Kutt starten"
            min={0}
            max={Math.max(0, take.duration - video.trimEnd - 0.2)}
            step={0.1}
            value={video.trimStart}
            display={formatTime(video.trimStart)}
            onChange={(value) => patchVideo(song.id, { trimStart: value })}
          />
          <Slider
            label="Kutt slutten"
            min={0}
            max={Math.max(0, take.duration - video.trimStart - 0.2)}
            step={0.1}
            value={video.trimEnd}
            display={formatTime(video.trimEnd)}
            onChange={(value) => patchVideo(song.id, { trimEnd: value })}
          />
          <div>
            <p className="text-sm font-medium">Format</p>
            <div className="mt-2">
              <FormatPick formats={formats} value={id} onChange={setId} />
            </div>
            <p className="mt-4 text-sm font-medium">Del opp</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPLIT_TARGETS.map((item) => (
                <Button
                  key={item.id}
                  variant={target === item.id ? "primary" : "quiet"}
                  aria-pressed={target === item.id}
                  onClick={() => {
                    setTarget(item.id);
                    setCutAt((spanStart + spanEnd) / 2);
                    setMessage("");
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {target ? <p className="mt-2 text-sm text-muted">{SPLIT_TARGETS.find((item) => item.id === target)?.text}</p> : null}
          </div>
          {target === "to" && spanEnd - spanStart >= 0.8 ? (
            <Slider
              label="Kuttet"
              min={spanStart + 0.4}
              max={spanEnd - 0.4}
              step={0.1}
              value={Math.min(spanEnd - 0.4, Math.max(spanStart + 0.4, cutAt || (spanStart + spanEnd) / 2))}
              display={formatTime(cutAt || (spanStart + spanEnd) / 2)}
              onChange={setCutAt}
            />
          ) : null}
          {target && parts.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line">
              {parts.map((part) => (
                <li key={part.index} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm">
                    Del {part.index}
                    <span className="mt-0.5 block tabular-nums text-muted">
                      {formatTime(part.start)}–{formatTime(part.end)}
                    </span>
                  </span>
                  <Button variant="quiet" disabled={busy !== null} onClick={() => void savePart(part)}>
                    {busy === part.index ? "Lager…" : "Last ned"}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          {target && parts.length === 24 ? <p className="text-sm text-muted">De første 24 delene. Resten er ikke med.</p> : null}
          {message ? <p className="text-sm text-muted">{message}</p> : null}
        </div>
      ) : (
        <p className="text-muted">Ta opp et bilde først.</p>
      )}
    </section>
  );
}

export function FilmLagrePanel({ song }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const take = activeVideoTake(song);
  const { formats, id, setId, format } = useSaveFormats("video");

  async function download() {
    if (!take || !format) return;
    setBusy(true);
    setMessage(null);
    try {
      const blob = await getAudio(take.videoId);
      if (!blob) throw new Error("Fant ikke filmen på telefonen.");
      const edited = await renderEditedVideo({
        blob,
        trimStart: song.video.trimStart,
        trimEnd: song.video.trimEnd,
        look: song.video.look,
        frame: song.video.frame,
        mirror: song.video.mirror,
        title: song.title,
        lyrics: song.lyrics,
        showTitle: song.video.showTitle,
        showLyrics: song.video.showLyrics,
        mime: format.mime,
      });
      const name = `${song.title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "film"}.${format.ext}`;
      downloadBlob(edited, name);
      setMessage(`Filmen er lastet ned som ${format.label}, med klipp, utseende og tekst.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage filmen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <PanelHead
        title="Lagre filmen"
        lede="Velg format. WebM virker i de fleste nettlesere. MP4 vises bare hvis denne nettleseren kan skrive MP4. ThorSound legger ikke ut filen."
      />
      <FormatPick formats={formats} value={id} onChange={setId} />
      <Button className="mt-4" onClick={() => void download()} disabled={busy || !take || !format}>
        {busy ? "Klipper…" : `Last ned ${format?.label ?? "filmen"}`}
      </Button>
      {!take ? <p className="mt-3 text-sm text-muted">Ta opp et bilde først.</p> : null}
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </section>
  );
}
