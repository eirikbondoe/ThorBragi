import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { EngineSnap, StudioEngine } from "@/lib/studio/audio";
import { songDuration, useStudio } from "@/lib/studio/store";
import type { Song } from "@/lib/studio/types";
import { formatTime, PanelHead, Slider } from "./bits";

export function LoopPanel({
  song,
  snap,
  engine,
}: {
  song: Song;
  snap: EngineSnap;
  engine: RefObject<StudioEngine | null>;
}) {
  const patchSong = useStudio((state) => state.patchSong);
  const recorded = songDuration(song);
  const max = recorded > 0.2 ? recorded : 32;
  const loop = song.loop;

  function setLoop(start: number, end: number) {
    const from = Math.max(0, Math.min(start, max - 0.3));
    const to = Math.max(from + 0.3, Math.min(end, max));
    patchSong(song.id, { loop: { start: from, end: to } });
  }

  return (
    <section>
      <PanelHead
        title="Loop"
        lede="Velg et stykke. Når loopen er på, går avspillingen tilbake til starten av stykket. Skru den av, så spilles låten én gang."
      />
      {loop ? (
        <div className="space-y-4">
          <p className="text-sm">
            Fra {formatTime(loop.start)} til {formatTime(loop.end)}. Det er {formatTime(loop.end - loop.start)}.
          </p>
          <Slider
            label="Start"
            min={0}
            max={Math.max(0.3, loop.end - 0.3)}
            step={0.1}
            value={loop.start}
            display={formatTime(loop.start)}
            onChange={(value) => setLoop(value, loop.end)}
          />
          <Slider
            label="Slutt"
            min={Math.min(max, loop.start + 0.3)}
            max={max}
            step={0.1}
            value={Math.min(max, loop.end)}
            display={formatTime(loop.end)}
            onChange={(value) => setLoop(loop.start, value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="quiet" onClick={() => setLoop(snap.position, loop.end)}>
              Start her
            </Button>
            <Button variant="quiet" onClick={() => setLoop(loop.start, Math.max(loop.start + 0.3, snap.position))}>
              Slutt her
            </Button>
            <Button variant="quiet" onClick={() => patchSong(song.id, { loop: null })}>
              Skru av
            </Button>
          </div>
          <Button onClick={() => void engine.current?.toggle()}>{snap.playing ? "Stopp" : "Spill loopen"}</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">Ingen loop. Spill, og sett start og slutt der du står. Eller lag fire takter fra der du er.</p>
          <Button
            onClick={() => {
              const start = Math.min(snap.position, Math.max(0, max - 0.5));
              const fourBars = (60 / song.bpm) * 16;
              setLoop(start, start + fourBars);
            }}
          >
            Lag en loop
          </Button>
        </div>
      )}
    </section>
  );
}
