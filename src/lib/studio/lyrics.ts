import { songDuration } from "./store";
import type { Song } from "./types";

export function lyricLines(lyrics: string): string[] {
  const lines = lyrics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : ["Skriv teksten først"];
}

export function lyricSeconds(song: Song): number {
  const audio = songDuration(song);
  if (audio > 1) return audio;
  const bars = song.sections.reduce((sum, section) => sum + section.bars, 0) || 8;
  return bars * (60 / Math.max(40, song.bpm)) * 4;
}

/** 0 at the first line, lines.length - 1 at the end. */
export function lyricIndex(song: Song, position: number): number {
  const lines = lyricLines(song.lyrics);
  if (lines.length <= 1) return 0;
  const span = lyricSeconds(song);
  const ratio = span > 0 ? Math.min(1, Math.max(0, position / span)) : 0;
  return ratio * (lines.length - 1);
}
