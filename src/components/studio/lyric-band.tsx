import { useEffect, useRef } from "react";
import { lyricIndex, lyricLines } from "@/lib/studio/lyrics";
import { keyInfo } from "@/lib/studio/theory";
import type { Song } from "@/lib/studio/types";

export function chordAt(song: Song, position: number): number {
  const count = keyInfo(song.keyName).chords.length;
  if (count === 0) return -1;
  const bar = (60 / Math.max(40, song.bpm)) * 4;
  return Math.floor(Math.max(0, position) / bar) % count;
}

export function ChordBand({ song, position, active }: { song: Song; position: number; active: boolean }) {
  const chords = keyInfo(song.keyName).chords;
  const on = active ? chordAt(song, position) : -1;
  return (
    <div className="chord-band" aria-label="Grep">
      {chords.map((chord, index) => (
        <span key={`${chord.name}-${index}`} className={index === on ? "is-on" : undefined}>
          {chord.name}
        </span>
      ))}
    </div>
  );
}

export function LyricRead({ song, position, active }: { song: Song; position: number; active: boolean }) {
  const current = useRef<HTMLLIElement>(null);
  const lines = song.lyrics.trim() ? lyricLines(song.lyrics) : [];
  const on = active && lines.length > 0 ? Math.round(lyricIndex(song, position)) : -1;
  useEffect(() => {
    current.current?.scrollIntoView({ block: "nearest" });
  }, [on]);
  if (lines.length === 0) return null;
  return (
    <ol className="lyric-read" aria-live="polite">
      {lines.map((line, index) => (
        <li key={`${index}-${line}`} ref={index === on ? current : undefined} className={index === on ? "lyric-line is-on" : "lyric-line"}>
          {line}
        </li>
      ))}
    </ol>
  );
}
