export type TrackKind = "samtidig" | "stemme" | "gitar" | "piano" | "kor" | "annet";

export type TonePreset = "rett" | "varm" | "klar" | "radio";
export type RoomPreset = "tort" | "stue" | "scene" | "kirke";
export type EchoPreset = "av" | "kort" | "syng";
export type MasterStyle = "hjemme" | "radio" | "myk";
export type DrumPattern = "ingen" | "ro" | "sprett" | "ballade";
export type Trick = "ingen" | "telefon" | "kor" | "robot";
export type SectionName = "intro" | "vers" | "refreng" | "bro" | "outro";
export type KeyName = "C" | "G" | "D" | "A" | "E" | "B" | "Am" | "Em";
export type VideoLook = "rett" | "varm" | "kveld" | "svartkvitt";
export type VideoFrame = "telefon" | "skjerm";
export type CommunityId = "youtube" | "shorts" | "smule" | "kort";

export type VideoTake = {
  id: string;
  videoId: string;
  duration: number;
  createdAt: number;
};

export type VideoSession = {
  takes: VideoTake[];
  activeTakeId: string | null;
  trimStart: number;
  trimEnd: number;
  look: VideoLook;
  frame: VideoFrame;
  mirror: boolean;
  showTitle: boolean;
  showLyrics: boolean;
};

export type JobId =
  | "opptak"
  | "monitor"
  | "tempo"
  | "trommer"
  | "grep"
  | "tekst"
  | "deler"
  | "forsok"
  | "klipp"
  | "balanse"
  | "tone"
  | "jevn"
  | "rom"
  | "ekko"
  | "sus"
  | "tvilling"
  | "ab"
  | "ferdig"
  | "rad"
  | "del"
  | "bilde"
  | "sending"
  | "filmklipp"
  | "filmlagre"
  | "sammen"
  | "ut"
  | "koble"
  | "prov"
  | "ai"
  | "utstyr"
  | "rens";

export type Take = {
  id: string;
  audioId: string;
  duration: number;
  peak: number;
  peaks: number[];
  createdAt: number;
};

export type Track = {
  id: string;
  kind: TrackKind;
  name: string;
  takes: Take[];
  activeTakeId: string | null;
  trimStart: number;
  trimEnd: number;
  volume: number;
  muted: boolean;
  solo: boolean;
  tone: TonePreset;
  even: number;
  room: RoomPreset;
  echo: EchoPreset;
  hush: number;
  twin: number;
  trick: Trick;
};

export type Section = {
  id: string;
  name: SectionName;
  bars: number;
};

export type Song = {
  id: string;
  title: string;
  bpm: number;
  keyName: KeyName;
  click: boolean;
  drums: DrumPattern;
  lyrics: string;
  sections: Section[];
  tracks: Track[];
  master: MasterStyle;
  compareDry: boolean;
  video: VideoSession;
  roomCode: string;
  outlet: CommunityId | null;
  updatedAt: number;
  createdAt: number;
};

export const KIND_LABEL: Record<TrackKind, string> = {
  samtidig: "Stemme og gitar",
  stemme: "Stemme",
  gitar: "Gitar",
  piano: "Piano",
  kor: "Kor",
  annet: "Annet",
};

export const SECTION_LABEL: Record<SectionName, string> = {
  intro: "Intro",
  vers: "Vers",
  refreng: "Refreng",
  bro: "Bro",
  outro: "Outro",
};
