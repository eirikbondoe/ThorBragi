import { useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { StudioEngine } from "@/lib/studio/audio";
import { COMMUNITIES, communityPack, communityPreset, keptSeconds, trimEndForMax } from "@/lib/studio/community";
import { getAudio } from "@/lib/studio/idb";
import { activeVideoTake, songDuration, useStudio } from "@/lib/studio/store";
import type { CommunityId, Song } from "@/lib/studio/types";
import { posterJpeg, renderEditedVideo } from "@/lib/studio/video";
import { formatTime, PanelHead } from "./bits";

function fileSafe(title: string): string {
  return title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "lat";
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function UtPanel({ song, engine }: { song: Song; engine: RefObject<StudioEngine | null> }) {
  const patchSong = useStudio((state) => state.patchSong);
  const patchVideo = useStudio((state) => state.patchVideo);
  const setMaster = useStudio((state) => state.setMaster);
  const [busy, setBusy] = useState<"film" | "lyd" | "bilde" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<"tittel" | "tekst" | null>(null);
  const choice = song.outlet;
  const preset = choice ? communityPreset(choice) : null;
  const pack = choice ? communityPack(song, choice) : null;
  const take = activeVideoTake(song);
  const seconds = take
    ? keptSeconds(take.duration, song.video.trimStart, song.video.trimEnd)
    : songDuration(song);

  function choose(id: CommunityId) {
    const next = communityPreset(id);
    patchSong(song.id, { outlet: id, compareDry: false });
    setMaster(song.id, "radio");
    patchVideo(song.id, {
      frame: next.frame,
      look: next.look,
      showTitle: true,
      showLyrics: next.lyrics,
      mirror: next.mirror,
    });
    setMessage(null);
    setCopied(null);
  }

  function fit() {
    if (!take || !preset?.maxSeconds) return;
    patchVideo(song.id, { trimEnd: trimEndForMax(take.duration, song.video.trimStart, preset.maxSeconds) });
  }

  async function copy(kind: "tittel" | "tekst", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setMessage("Merk teksten og kopier den selv.");
    }
  }

  async function downloadFilm() {
    if (!take || !preset) return;
    setBusy("film");
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
        showTitle: true,
        showLyrics: preset.lyrics,
      });
      saveBlob(edited, `${fileSafe(song.title)}-${preset.id}.webm`);
      setMessage("Filmen er lastet ned i riktig format. Lim inn tittel og tekst i appen.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage filmen.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadAudio() {
    const engineRef = engine.current;
    if (!engineRef || !preset) return;
    setBusy("lyd");
    setMessage(null);
    try {
      const blob = await engineRef.renderWav(song);
      saveBlob(blob, `${fileSafe(song.title)}-${preset.id}.wav`);
      setMessage("Lyden er lastet ned, ferdig og samlet, slik den ligger ved siden av andre sanger.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage lydfilen.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadPoster() {
    if (!take) return;
    setBusy("bilde");
    setMessage(null);
    try {
      const blob = await getAudio(take.videoId);
      if (!blob) throw new Error("Fant ikke filmen på telefonen.");
      const jpeg = await posterJpeg(blob, song.video.trimStart + 1, song.video.mirror);
      saveBlob(jpeg, `${fileSafe(song.title)}-forside.jpg`);
      setMessage("Forsidebildet er lastet ned. Det passer under videoen på YouTube.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage forsidebildet.");
    } finally {
      setBusy(null);
    }
  }

  const tooLong = preset?.maxSeconds != null && seconds > preset.maxSeconds + 0.2;

  return (
    <section>
      <PanelHead
        title="Legg ut"
        lede="Velg hvor sangen skal bo. Bildet, lengden og teksten tilpasses. Thorøisjen legger ikke ut selv. Du limer inn."
      />
      <div className="grid gap-2">
        {COMMUNITIES.map((item) => {
          const on = choice === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(item.id)}
              className={`min-h-11 rounded-md border px-4 py-3 text-left ${on ? "border-lamp bg-surface-2" : "border-line bg-surface"}`}
            >
              <span className="block font-medium">{item.label}</span>
              <span className="mt-1 block text-sm text-muted">{item.text}</span>
            </button>
          );
        })}
      </div>
      {preset && pack ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted">
            {preset.frame === "skjerm" ? "Liggende bilde." : "Stående bilde."} Lyden settes til Radio, så den sitter sammen med andre sanger.
            {seconds > 0 ? ` Lengde nå: ${formatTime(seconds)}.` : ""}
          </p>
          {tooLong && preset.maxSeconds ? (
            <div className="rounded-md border border-lamp/40 bg-surface px-4 py-3">
              <p className="text-sm">Denne er {formatTime(seconds)}. {preset.label} treffer best under {formatTime(preset.maxSeconds)}.</p>
              {take ? (
                <Button className="mt-3" variant="quiet" onClick={fit}>
                  Kutt til {formatTime(preset.maxSeconds)}
                </Button>
              ) : null}
            </div>
          ) : null}
          {choice === "youtube" && seconds > 0 && seconds < 60 ? (
            <p className="text-sm text-muted">Den er kort nok til Shorts, hvis du heller vil ha den stående.</p>
          ) : null}
          {choice === "smule" ? (
            <p className="text-sm text-muted">
              Kode <span className="code-mark text-lamp">{song.roomCode}</span>. Den som vil synge med, skriver den på forsiden. Teksten går av seg selv.
            </p>
          ) : null}
          <label className="block text-sm text-muted" htmlFor="ut-tittel">
            Tittel
          </label>
          <textarea id="ut-tittel" readOnly rows={2} value={pack.title} className="w-full rounded-md border border-line bg-surface px-4 py-3" />
          <Button variant="quiet" onClick={() => void copy("tittel", pack.title)}>
            {copied === "tittel" ? "Tittelen er kopiert" : "Kopier tittel"}
          </Button>
          <label className="block text-sm text-muted" htmlFor="ut-tekst">
            Tekst til innlegget
          </label>
          <textarea id="ut-tekst" readOnly rows={6} value={pack.body} className="w-full rounded-md border border-line bg-surface px-4 py-3" />
          <Button variant="quiet" onClick={() => void copy("tekst", pack.body)}>
            {copied === "tekst" ? "Teksten er kopiert" : "Kopier tekst"}
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void downloadFilm()} disabled={busy !== null || !take}>
              {busy === "film" ? "Klipper…" : "Last ned filmen"}
            </Button>
            <Button variant="quiet" onClick={() => void downloadAudio()} disabled={busy !== null}>
              {busy === "lyd" ? "Gjør klar…" : "Last ned lyden"}
            </Button>
            {choice === "youtube" ? (
              <Button variant="quiet" onClick={() => void downloadPoster()} disabled={busy !== null || !take}>
                {busy === "bilde" ? "Lager bilde…" : "Forsidebilde"}
              </Button>
            ) : null}
          </div>
          {!take ? <p className="text-sm text-muted">Uten kamera får du lyden. Ta opp bilde og lyd hvis du vil ha en film.</p> : null}
        </div>
      ) : null}
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </section>
  );
}
