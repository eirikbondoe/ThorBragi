import type { CommunityId, Song, VideoFrame, VideoLook } from "./types";

export type CommunityPreset = {
  id: CommunityId;
  label: string;
  text: string;
  frame: VideoFrame;
  look: VideoLook;
  lyrics: boolean;
  mirror: boolean;
  maxSeconds: number | null;
};

export const COMMUNITIES: CommunityPreset[] = [
  {
    id: "youtube",
    label: "YouTube",
    text: "Liggende bilde, tittel og en tekst til under videoen.",
    frame: "skjerm",
    look: "varm",
    lyrics: true,
    mirror: true,
    maxSeconds: null,
  },
  {
    id: "shorts",
    label: "Shorts",
    text: "Stående film til YouTube. Helst under tre minutter.",
    frame: "telefon",
    look: "rett",
    lyrics: true,
    mirror: true,
    maxSeconds: 180,
  },
  {
    id: "smule",
    label: "Smule",
    text: "Karaoke på høykant. Teksten ligger i bildet, og noen kan synge med.",
    frame: "telefon",
    look: "varm",
    lyrics: true,
    mirror: true,
    maxSeconds: null,
  },
  {
    id: "kort",
    label: "Korte filmer",
    text: "TikTok, Reels og lignende. Stående, helst under ett minutt.",
    frame: "telefon",
    look: "rett",
    lyrics: true,
    mirror: true,
    maxSeconds: 60,
  },
];

export function communityPreset(id: CommunityId): CommunityPreset {
  return COMMUNITIES.find((item) => item.id === id) ?? COMMUNITIES[0];
}

function lyricBlock(lyrics: string, maxLines: number): string {
  return lyrics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines)
    .join("\n");
}

export function communityPack(song: Song, id: CommunityId): { title: string; body: string } {
  const name = (song.title || "Min sang").trim().slice(0, 90);
  const lines = lyricBlock(song.lyrics, id === "kort" ? 2 : 8);
  const hook = lines.split("\n")[0] || name;
  if (id === "smule") {
    return {
      title: name,
      body: `${lines}\n\nSyng med meg. Kode ${song.roomCode}.\nÅpne ThorSound, trykk Tekstkode, og skriv koden.`.trim(),
    };
  }
  if (id === "kort") {
    return {
      title: hook.slice(0, 80),
      body: `${hook}\n\n#sang #musikk`.trim(),
    };
  }
  if (id === "shorts") {
    return {
      title: name.slice(0, 70),
      body: `${lines}\n\n#shorts #sang`.trim(),
    };
  }
  return {
    title: name,
    body: `${lines}\n\nSpilt inn hjemme.\n\nmusikk, sang, original`.trim(),
  };
}

export function keptSeconds(duration: number, trimStart: number, trimEnd: number): number {
  return Math.max(0, duration - trimStart - trimEnd);
}

export function trimEndForMax(duration: number, trimStart: number, maxSeconds: number): number {
  return Math.max(0, duration - trimStart - maxSeconds);
}
