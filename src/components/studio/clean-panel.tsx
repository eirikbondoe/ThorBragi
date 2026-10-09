import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cleanSpeech } from "@/lib/studio/clean";
import { getAudio } from "@/lib/studio/idb";
import { useStudio } from "@/lib/studio/store";
import type { JobId, Song } from "@/lib/studio/types";
import { PanelHead } from "./bits";

export function CleanPanel({ song, go }: { song: Song; go: (job: JobId | null) => void }) {
  const setLyrics = useStudio((state) => state.setLyrics);
  const [source, setSource] = useState<Blob | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [text, setText] = useState("");
  const [listenUrl, setListenUrl] = useState("");
  const [listenBlob, setListenBlob] = useState<Blob | null>(null);
  const urlRef = useRef("");
  const takes = song.tracks.flatMap((track) =>
    track.takes.map((take) => ({ id: take.audioId, label: `${track.name} · ${Math.round(take.duration)}s` })),
  );

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  async function run() {
    if (!source || busy) return;
    setBusy("Renser…");
    setError("");
    setNote("");
    try {
      const cleaned = await cleanSpeech(source);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(cleaned.listen);
      urlRef.current = url;
      setListenBlob(cleaned.listen);
      setListenUrl(url);
      setBusy("Skriver teksten…");
      const form = new FormData();
      form.append("file", cleaned.speech, "tale.wav");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const body = (await res.json()) as { ok?: boolean; text?: string; error?: string };
      if (!res.ok || !body.ok || !body.text) {
        setText("");
        setError(body.error || "Lyden er renset. Teksten kom ikke.");
        return;
      }
      setText(body.text);
      setNote("Lyden er renset. Les gjennom teksten før du bruker den.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Klarte ikke å lese filen.");
    } finally {
      setBusy("");
    }
  }

  async function mail() {
    const title = song.title || "Samtale";
    const body = `${title}\n\n${text}`;
    if (body.length > 1800) {
      await navigator.clipboard.writeText(body);
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Teksten er kopiert. Lim den inn her.")}`;
      setNote("Teksten var lang, så den ligger i utklippstavlen. Lim den inn i e-posten.");
      return;
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section>
      <PanelHead
        title="Rens og tekst"
        lede="Lomme, asfalt og den som puster i mikrofonen blir svakere. Stemmene blir stående. Teksten kan bli sangtekst, eller en e-post. Opptil tjue minutter."
      />
      <label className="block text-sm">
        Lydfil
        <input
          type="file"
          accept="audio/*"
          className="mt-1 block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setSource(file);
            setSourceName(file?.name ?? "");
            setError("");
          }}
        />
      </label>
      {takes.length ? (
        <div className="mt-4">
          <p className="text-sm">Eller et opptak i låten</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {takes.map((take) => (
              <Button
                key={take.id}
                variant={sourceName === take.label ? "primary" : "quiet"}
                onClick={() => {
                  void getAudio(take.id).then((blob) => {
                    if (!blob) {
                      setError("Fant ikke opptaket.");
                      return;
                    }
                    setSource(blob);
                    setSourceName(take.label);
                    setError("");
                  });
                }}
              >
                {take.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="mt-3 text-sm text-muted">{sourceName || "Ingen lyd valgt."}</p>
      <Button className="mt-3" disabled={!source || Boolean(busy)} onClick={() => void run()}>
        {busy || "Rens og skriv tekst"}
      </Button>
      {error ? <p className="mt-3 text-sm text-signal">{error}</p> : null}
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      {listenUrl ? <audio className="mt-4 w-full" controls src={listenUrl} /> : null}
      {listenBlob ? (
        <Button
          className="mt-2"
          variant="quiet"
          onClick={() => {
            const url = URL.createObjectURL(listenBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${song.title || "samtale"}-rent.wav`;
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          Last ned ren lyd
        </Button>
      ) : null}
      {text || listenUrl ? (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          aria-label="Tekst fra samtalen"
          placeholder="Teksten kommer her."
          className="mt-4 w-full rounded-md border border-line px-4 py-3 text-sm leading-relaxed"
        />
      ) : null}
      {text ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setLyrics(song.id, text);
              go("tekst");
            }}
          >
            Bruk som sangtekst
          </Button>
          <Button variant="quiet" onClick={() => void mail()}>
            Send på e-post
          </Button>
        </div>
      ) : null}
    </section>
  );
}
