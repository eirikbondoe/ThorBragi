import type { Section, SectionName, Song, Track, VideoSession } from "./types";

function uid(): string {
  return crypto.randomUUID();
}

function video(): VideoSession {
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

function code(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

function track(kind: Track["kind"], name: string): Track {
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
    tone: kind === "stemme" ? "varm" : "rett",
    even: kind === "stemme" ? 0.45 : 0.25,
    room: kind === "stemme" ? "stue" : "tort",
    echo: "av",
    hush: 0.2,
    twin: 0,
    trick: "ingen",
  };
}

function part(name: SectionName, bars: number): Section {
  return { id: uid(), name, bars };
}

function sheet(
  slug: string,
  title: string,
  bpm: number,
  keyName: Song["keyName"],
  lyrics: string,
  sections: Section[],
): Song {
  const now = Date.now();
  return {
    id: `ovelse-${slug}`,
    title,
    bpm,
    keyName,
    click: true,
    drums: "ingen",
    lyrics,
    sections,
    tracks: [track("gitar", "Gitar"), track("stemme", "Stemme")],
    master: "hjemme",
    compareDry: false,
    video: video(),
    roomCode: code(),
    outlet: null,
    updatedAt: now,
    createdAt: now,
  };
}

export function practiceSongs(): Song[] {
  return [
    sheet(
      "cycling-trivialities",
      "Cycling Trivialities",
      108,
      "B",
      "Øving\nJosé González. Cycling Trivialities.\nToneart B. 108 slag her, eller tell halvparten.\nStandard stemming. Uten capo.\n\nVers\nF#  ·  G#m  ·  E\nFire rolige slag på hver. Fingerplukk.\n\nRefreng\nSamme tre grep, ikke større.\nOriginalteksten er vernet og ligger ikke her. Skriv linjene du øver på, under.",
      [part("intro", 4), part("vers", 8), part("refreng", 8)],
    ),
    sheet(
      "harvest",
      "Harvest",
      63,
      "Em",
      "Øving\nOpeth. Harvest.\nE-moll. 63 slag. Tell i tre: én-to-tre.\nStandard stemming.\n\nIntro\nEm, langt og stille.\n\nVers\nCm · Csus2 · Ab · Gm · G\nAppen har ikke alle disse som knapper. Teksten er kartet.\n\nRefreng\nAm · Bm · Em\nOriginalteksten er vernet. Skriv den selv hvis du vil ha den i teleprompteren.",
      [part("intro", 8), part("vers", 8), part("refreng", 8)],
    ),
    sheet(
      "know-how",
      "Know-How",
      80,
      "D",
      "Øving\nKings of Convenience. Know-How.\nOmtrent 80 slag. De bruker ofte capo.\nAppen øver i D, så fingrene har et sted å lande.\n\nVers\nRolige plukk. To gitarer blir to spor: ta den ene, så den andre oppå.\n\nRefreng\nHold det lite. Ikke et korps.\nOriginalteksten er vernet og ligger ikke her. Lim inn linjene du øver på.",
      [part("vers", 8), part("refreng", 8)],
    ),
  ];
}
