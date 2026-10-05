import { useEffect, useRef, useState } from "react";
import { EMPTY_SNAP, StudioEngine, type EngineSnap } from "@/lib/studio/audio";
import type { Song } from "@/lib/studio/types";

export function useEngine(song: Song | null) {
  const [snap, setSnap] = useState<EngineSnap>(EMPTY_SNAP);
  const engine = useRef<StudioEngine | null>(null);
  const songRef = useRef(song);
  songRef.current = song;

  useEffect(() => {
    const next = new StudioEngine(setSnap);
    engine.current = next;
    if (songRef.current) next.setSong(songRef.current);
    return () => next.dispose();
  }, []);

  useEffect(() => {
    if (song) engine.current?.setSong(song);
  }, [song]);

  return { snap, engine };
}
