import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteAudio } from "./idb";
import { practiceSongs } from "./practice-songs";
import type { CommunityId, DrumPattern, KeyName, MasterStyle, Section, SectionName, Song, Take, Track, TrackKind, VideoSession, VideoTake } from "./types";
import { KIND_LABEL } from "./types";

function uid(): string {
  return crypto.randomUUID();
}

export function makeTrack(kind: TrackKind, name: string): Track {
  return {
    id: uid(),
    kind,
    name,
    takes: [],
    activeTakeId: null,
    trimStart: 0,
    trimEnd: 0,
    volume: kind === "gitar" ? 0.78 : 0.9,
    muted: false,
    solo: false,
    tone: kind === "stemme" || kind === "kor" ? "varm" : "rett",
    even: kind === "stemme" || kind === "kor" || kind === "samtidig" ? 0.45 : 0.25,
    room: kind === "stemme" || kind === "kor" || kind === "samtidig" ? "stue" : "tort",
    echo: "av",
    hush: 0.2,
    twin: 0,
    trick: "ingen",
  };
}

export function makeSong(title: string): Song {
  const now = Date.now();
  const sections: Section[] = [
    { id: uid(), name: "vers", bars: 8 },
    { id: uid(), name: "refreng", bars: 8 },
  ];
  return {
    id: uid(),
    title,
    bpm: 96,
    keyName: "G",
    click: false,
    drums: "ro",
    lyrics: "Vers\nJeg skulle gått en runde\nmen beina sa nei\n\nRefreng\nJeg blir her\njeg synger i stedet\nfrisbeegolf får vente",
    sections,
    tracks: [],
    master: "hjemme",
    compareDry: false,
    video: emptyVideo(),
    roomCode: makeRoomCode(),
    outlet: null,
    updatedAt: now,
    createdAt: now,
  };
}

export function emptyVideo(): VideoSession {
  return {
    takes: [],
    activeTakeId: null,
    trimStart: 0,
    trimEnd: 0,
    look: "varm",
    frame: "telefon",
    mirror: true,
    showTitle: true,
    showLyrics: true,
  };
}

export function ensureVideo(song: Song): Song {
  if (song.video?.takes && song.video.look && song.video.frame) return song;
  return { ...song, video: { ...emptyVideo(), ...song.video } };
}

export function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return code;
}

export function ensureRoom(song: Song): Song {
  let next = ensureVideo(song);
  if (!/^[A-Z0-9]{4}$/.test(next.roomCode ?? "")) next = { ...next, roomCode: makeRoomCode() };
  const outlet = next.outlet;
  const known = outlet === null || outlet === "youtube" || outlet === "shorts" || outlet === "smule" || outlet === "kort";
  if (!known) next = { ...next, outlet: null };
  const tracks = next.tracks.map((track) => {
    if (track.trick === "ingen" || track.trick === "telefon" || track.trick === "kor" || track.trick === "robot") return track;
    return { ...track, trick: "ingen" as const };
  });
  if (tracks.some((track, index) => track !== next.tracks[index])) next = { ...next, tracks };
  return next;
}

function nextTrackName(song: Song, kind: TrackKind): string {
  const count = song.tracks.filter((t) => t.kind === kind).length;
  const base = KIND_LABEL[kind];
  return count === 0 ? base : `${base} ${count + 1}`;
}

type StudioState = {
  songs: Song[];
  seeded: boolean;
  seed: () => void;
  createSong: (title?: string) => string;
  deleteSong: (id: string) => void;
  renameSong: (id: string, title: string) => void;
  patchSong: (id: string, patch: Partial<Song>) => void;
  setBpm: (id: string, bpm: number) => void;
  setKey: (id: string, keyName: KeyName) => void;
  setDrums: (id: string, drums: DrumPattern) => void;
  setClick: (id: string, click: boolean) => void;
  setMaster: (id: string, master: MasterStyle) => void;
  setCompareDry: (id: string, compareDry: boolean) => void;
  setLyrics: (id: string, lyrics: string) => void;
  addSection: (id: string, name: SectionName) => void;
  updateSection: (songId: string, sectionId: string, patch: Partial<Section>) => void;
  moveSection: (songId: string, sectionId: string, dir: -1 | 1) => void;
  removeSection: (songId: string, sectionId: string) => void;
  addTrack: (songId: string, kind: TrackKind) => string;
  ensureTrack: (songId: string, kind: TrackKind) => string;
  removeTrack: (songId: string, trackId: string) => void;
  patchTrack: (songId: string, trackId: string, patch: Partial<Track>) => void;
  addTake: (songId: string, trackId: string, take: Take) => void;
  useTake: (songId: string, trackId: string, takeId: string) => void;
  removeTake: (songId: string, trackId: string, takeId: string) => void;
  patchVideo: (songId: string, patch: Partial<VideoSession>) => void;
  addVideoTake: (songId: string, take: VideoTake) => void;
  useVideoTake: (songId: string, takeId: string) => void;
  removeVideoTake: (songId: string, takeId: string) => void;
};

function touch(song: Song, patch: Partial<Song>): Song {
  return { ...song, ...patch, updatedAt: Date.now() };
}

function mapSong(songs: Song[], id: string, fn: (song: Song) => Song): Song[] {
  return songs.map((song) => (song.id === id ? fn(song) : song));
}

const memoryStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      songs: [],
      seeded: false,
      seed: () => {
        if (get().seeded) return;
        set({ songs: [makeSong("Første låt")], seeded: true });
      },
      createSong: (title) => {
        const song = makeSong(title?.trim() || "Ny sang");
        set({ songs: [song, ...get().songs], seeded: true });
        return song.id;
      },
      deleteSong: (id) => {
        const song = get().songs.find((s) => s.id === id);
        song?.tracks.forEach((track) => {
          track.takes.forEach((take) => {
            void deleteAudio(take.audioId);
          });
        });
        song?.video?.takes.forEach((take) => {
          void deleteAudio(take.videoId);
        });
        set({ songs: get().songs.filter((s) => s.id !== id) });
      },
      renameSong: (id, title) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { title })) }),
      patchSong: (id, patch) => set({ songs: mapSong(get().songs, id, (s) => touch(s, patch)) }),
      setBpm: (id, bpm) =>
        set({
          songs: mapSong(get().songs, id, (s) => touch(s, { bpm: Math.max(60, Math.min(180, Math.round(bpm))) })),
        }),
      setKey: (id, keyName) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { keyName })) }),
      setDrums: (id, drums) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { drums })) }),
      setClick: (id, click) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { click })) }),
      setMaster: (id, master) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { master })) }),
      setCompareDry: (id, compareDry) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { compareDry })) }),
      setLyrics: (id, lyrics) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { lyrics })) }),
      addSection: (id, name) =>
        set({
          songs: mapSong(get().songs, id, (s) =>
            touch(s, { sections: [...s.sections, { id: uid(), name, bars: 8 }] }),
          ),
        }),
      updateSection: (songId, sectionId, patch) =>
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, {
              sections: s.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
            }),
          ),
        }),
      moveSection: (songId, sectionId, dir) =>
        set({
          songs: mapSong(get().songs, songId, (s) => {
            const index = s.sections.findIndex((section) => section.id === sectionId);
            const next = index + dir;
            if (index < 0 || next < 0 || next >= s.sections.length) return s;
            const sections = s.sections.slice();
            const [item] = sections.splice(index, 1);
            sections.splice(next, 0, item!);
            return touch(s, { sections });
          }),
        }),
      removeSection: (songId, sectionId) =>
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, { sections: s.sections.filter((section) => section.id !== sectionId) }),
          ),
        }),
      addTrack: (songId, kind) => {
        let trackId = "";
        set({
          songs: mapSong(get().songs, songId, (s) => {
            const track = makeTrack(kind, nextTrackName(s, kind));
            trackId = track.id;
            return touch(s, { tracks: [...s.tracks, track] });
          }),
        });
        return trackId;
      },
      ensureTrack: (songId, kind) => {
        const song = get().songs.find((s) => s.id === songId);
        const existing = song?.tracks.find((t) => t.kind === kind);
        if (existing) return existing.id;
        return get().addTrack(songId, kind);
      },
      removeTrack: (songId, trackId) => {
        const song = get().songs.find((s) => s.id === songId);
        const track = song?.tracks.find((t) => t.id === trackId);
        track?.takes.forEach((take) => {
          void deleteAudio(take.audioId);
        });
        set({
          songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.filter((t) => t.id !== trackId) })),
        });
      },
      patchTrack: (songId, trackId, patch) =>
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, {
              tracks: s.tracks.map((track) => (track.id === trackId ? { ...track, ...patch } : track)),
            }),
          ),
        }),
      addTake: (songId, trackId, take) =>
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, {
              tracks: s.tracks.map((track) =>
                track.id === trackId
                  ? { ...track, takes: [...track.takes, take], activeTakeId: take.id, trimStart: 0, trimEnd: 0 }
                  : track,
              ),
            }),
          ),
        }),
      useTake: (songId, trackId, takeId) =>
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, {
              tracks: s.tracks.map((track) =>
                track.id === trackId ? { ...track, activeTakeId: takeId, trimStart: 0, trimEnd: 0 } : track,
              ),
            }),
          ),
        }),
      removeTake: (songId, trackId, takeId) => {
        const song = get().songs.find((s) => s.id === songId);
        const take = song?.tracks.find((t) => t.id === trackId)?.takes.find((t) => t.id === takeId);
        if (take) void deleteAudio(take.audioId);
        set({
          songs: mapSong(get().songs, songId, (s) =>
            touch(s, {
              tracks: s.tracks.map((track) => {
                if (track.id !== trackId) return track;
                const takes = track.takes.filter((item) => item.id !== takeId);
                const activeTakeId =
                  track.activeTakeId === takeId ? (takes[takes.length - 1]?.id ?? null) : track.activeTakeId;
                return { ...track, takes, activeTakeId, trimStart: 0, trimEnd: 0 };
              }),
            }),
          ),
        });
      },
      patchVideo: (songId, patch) =>
        set({
          songs: mapSong(get().songs, songId, (song) => touch(ensureVideo(song), { video: { ...ensureVideo(song).video, ...patch } })),
        }),
      addVideoTake: (songId, take) =>
        set({
          songs: mapSong(get().songs, songId, (song) => {
            const video = ensureVideo(song).video;
            return touch(song, {
              video: { ...video, takes: [...video.takes, take], activeTakeId: take.id, trimStart: 0, trimEnd: 0 },
            });
          }),
        }),
      useVideoTake: (songId, takeId) =>
        set({
          songs: mapSong(get().songs, songId, (song) =>
            touch(song, { video: { ...ensureVideo(song).video, activeTakeId: takeId, trimStart: 0, trimEnd: 0 } }),
          ),
        }),
      removeVideoTake: (songId, takeId) => {
        const song = get().songs.find((item) => item.id === songId);
        const take = song?.video?.takes.find((item) => item.id === takeId);
        if (take) void deleteAudio(take.videoId);
        set({
          songs: mapSong(get().songs, songId, (current) => {
            const video = ensureVideo(current).video;
            const takes = video.takes.filter((item) => item.id !== takeId);
            const activeTakeId = video.activeTakeId === takeId ? (takes[takes.length - 1]?.id ?? null) : video.activeTakeId;
            return touch(current, { video: { ...video, takes, activeTakeId, trimStart: 0, trimEnd: 0 } });
          }),
        });
      },
    }),
    {
      name: "lydvenn-v1",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (state) => ({ songs: state.songs, seeded: state.seeded }),
    },
  ),
);

let readyPromise: Promise<void> | null = null;

export function hydrateStudio(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!readyPromise) {
    readyPromise = (async () => {
      if (!useStudio.persist.hasHydrated()) await useStudio.persist.rehydrate();
      const base = useStudio.getState().songs.map(ensureRoom);
      const seeded = useStudio.getState().seeded;
      const withFirst = seeded ? base : [makeSong("Første låt"), ...base];
      const have = new Set(withFirst.map((song) => song.id));
      const songs = [...practiceSongs().filter((song) => !have.has(song.id)), ...withFirst];
      useStudio.setState({ songs, seeded: true });
    })();
  }
  return readyPromise;
}

export function activeTake(track: Track): Take | null {
  return track.takes.find((take) => take.id === track.activeTakeId) ?? track.takes[track.takes.length - 1] ?? null;
}

export function trimmedDuration(track: Track): number {
  const take = activeTake(track);
  if (!take) return 0;
  return Math.max(0, take.duration - track.trimStart - track.trimEnd);
}

export function songDuration(song: Song): number {
  return Math.max(0, ...song.tracks.map((track) => trimmedDuration(track)));
}

export function activeVideoTake(song: Song): VideoTake | null {
  const video = song.video;
  if (!video) return null;
  return video.takes.find((take) => take.id === video.activeTakeId) ?? video.takes[video.takes.length - 1] ?? null;
}
