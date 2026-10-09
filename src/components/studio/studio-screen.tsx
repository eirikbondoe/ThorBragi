import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Circle, Play, Square } from "lucide-react";
import { producerAdvice } from "@/lib/studio/advice";
import { hydrateStudio, songDuration, useStudio } from "@/lib/studio/store";
import type { JobId } from "@/lib/studio/types";
import { formatTime } from "./bits";
import { JOB_GROUPS, JOBS } from "./jobs";
import { JobPanel } from "./panels";
import { Shell } from "./shell";
import { useEngine } from "./use-engine";
import { LyricLink } from "./lyric-link";

export function StudioScreen({ id }: { id: string }) {
  const [ready, setReady] = useState(false);
  const [job, setJob] = useState<JobId | null>(null);
  const [more, setMore] = useState(false);
  const openedFor = useRef<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const song = useStudio((state) => state.songs.find((item) => item.id === id) ?? null);
  const renameSong = useStudio((state) => state.renameSong);
  const { snap, engine } = useEngine(song);

  useEffect(() => {
    void hydrateStudio().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!song) return;
    if (focusId && song.tracks.some((track) => track.id === focusId)) return;
    setFocusId(song.tracks[0]?.id ?? null);
  }, [song, focusId]);

  useEffect(() => {
    if (!song || openedFor.current === song.id) return;
    openedFor.current = song.id;
    setMore(false);
    setJob(null);
  }, [song]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [job]);

  if (!ready || !song) {
    return (
      <Shell>
        <main className="mx-auto min-h-dvh w-full max-w-3xl px-5 pt-8">
          <Link to="/" className="inline-flex min-h-11 items-center text-sm text-muted">
            Til sangene
          </Link>
          <h1 className="mt-4 font-display text-3xl">{ready ? "Fant ikke sangen" : "ThorSound"}</h1>
          {ready ? <p className="mt-2 text-muted">Den kan ha blitt slettet i denne nettleseren.</p> : null}
        </main>
      </Shell>
    );
  }

  const length = songDuration(song);
  const looping = length < 0.05 && (song.drums !== "ingen" || song.click);
  const advice = producerAdvice(song)[0];
  const locked = snap.recording || snap.counting;
  const hasAudio = length >= 0.05;
  const groups = hasAudio || more ? JOB_GROUPS : JOB_GROUPS.filter((group) => group.title === "Start");

  return (
    <LyricLink song={song} snap={snap}>
    <Shell back={{ to: "/", label: "Sanger" }}>
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5">
      <input
        aria-label="Navn på sangen"
        placeholder="Uten navn"
        value={song.title}
        onChange={(event) => renameSong(song.id, event.target.value)}
        className="w-full min-h-12 bg-transparent font-display text-3xl leading-tight text-fg"
      />
      <p className="mt-1 text-sm text-muted">
        {song.keyName} · {song.bpm} slag · {song.tracks.length} spor
      </p>

      <div className="mt-4 flex-1 pb-4">
        {job ? (
          <>
            <button
              type="button"
              onClick={() => setJob(null)}
              className="mb-2 inline-flex min-h-11 items-center gap-1 text-sm text-muted"
            >
              <ChevronLeft className="size-4" />
              Tilbake
            </button>
            <div className="rounded-md border border-line bg-raised p-4">
              <JobPanel
                job={job}
                song={song}
                engine={engine}
                snap={snap}
                focusId={focusId}
                setFocusId={setFocusId}
                go={setJob}
              />
            </div>
          </>
        ) : (
          <>
            {advice && hasAudio ? (
              <button
                type="button"
                onClick={() => setJob(advice.job)}
                className="mb-3 w-full rounded-md border border-line bg-raised px-4 py-3 text-left"
              >
                <span className="text-xs font-medium tracking-widest text-lamp uppercase">Neste</span>
                <span className="mt-1 block font-medium">{advice.title}</span>
                <span className="mt-1 block text-sm text-muted">{advice.text}</span>
              </button>
            ) : null}
            {length < 0.05 ? (
              <div className="mb-4 rounded-md border border-line bg-raised p-4">
                <p className="font-medium">Ingen lyd ennå</p>
                <p className="mt-1 text-sm text-muted">Trykk Ta opp. Telefonen spør om mikrofonen. Den teller fire slag, så starter opptaket.</p>
                <button
                  type="button"
                  onClick={() => setJob("opptak")}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-md bg-signal text-sm font-medium text-signal-ink"
                >
                  Ta opp
                </button>
              </div>
            ) : null}
            {groups.map((group) => (
              <section key={group.title} className="mb-4">
                <h2 className="mb-2 text-xs font-medium tracking-widest text-muted uppercase">{group.title}</h2>
                <ul className="overflow-hidden rounded-md border border-line bg-raised">
                  {group.ids.map((id) => {
                    const item = JOBS.find((jobItem) => jobItem.id === id);
                    if (!item) return null;
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="border-b border-line last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setJob(item.id)}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface text-crystal">
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{item.title}</span>
                            <span className="mt-0.5 block truncate text-sm text-muted">{item.text}</span>
                          </span>
                          <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            {!hasAudio && !more ? (
              <button
                type="button"
                onClick={() => setMore(true)}
                className="mb-4 min-h-11 text-sm text-muted"
              >
                Vis alle verktøy
              </button>
            ) : null}
          </>
        )}
      </div>

      {snap.error ? (
        <p role="status" className="mb-2 text-sm text-signal">
          {snap.error}
        </p>
      ) : null}
      {snap.notice ? (
        <p role="status" className="mb-2 text-sm text-muted">
          {snap.notice}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-5 mt-auto border-t border-line bg-raised/95 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={snap.recording ? "Opptak pågår" : "Ta opp"}
            onClick={() => setJob("opptak")}
            className="flex size-12 shrink-0 items-center justify-center rounded-md bg-signal text-signal-ink"
          >
            <Circle className="size-4 fill-current" />
          </button>
          <button
            type="button"
            disabled={locked}
            aria-label={snap.playing ? "Stopp" : "Spill"}
            onClick={() => void engine.current?.toggle()}
            className="flex size-12 shrink-0 items-center justify-center rounded-md bg-fg text-ink disabled:opacity-40"
          >
            {snap.playing ? <Square className="size-5" /> : <Play className="size-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <input
              className="studio-range w-full"
              type="range"
              min={0}
              max={Math.max(length, 0.1)}
              step={0.1}
              disabled={looping || locked || length < 0.05}
              value={Math.min(snap.position, Math.max(length, 0.1))}
              aria-label="Hvor i låten"
              onChange={(event) => void engine.current?.seek(Number(event.target.value))}
            />
            <div className="flex justify-between text-xs text-muted tabular-nums">
              <span>{formatTime(snap.position)}</span>
              <span>{looping ? "Trommene går til du stopper" : formatTime(length)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    </Shell>
    </LyricLink>
  );
}
