import { activeTake, activeVideoTake, songDuration } from "./store";
import type { EchoPreset, JobId, MasterStyle, RoomPreset, Song, TonePreset, Trick } from "./types";

export type Ask = "hor" | "frekk" | "klar" | "prov";

export type Move = {
  id: string;
  label: string;
  job?: JobId;
  drums?: Song["drums"];
  master?: MasterStyle;
  trick?: Trick;
  room?: RoomPreset;
  echo?: EchoPreset;
  tone?: TonePreset;
  twin?: number;
  even?: number;
};

export type Consult = { text: string; moves: Move[] };

export function consult(song: Song, ask: Ask): Consult {
  const heard = song.tracks.filter((track) => activeTake(track));
  const name = song.title.trim() || "låten";
  const vocal = heard.find((track) => track.kind === "stemme" || track.kind === "samtidig" || track.kind === "kor");
  const hot = heard.find((track) => (activeTake(track)?.peak ?? 0) > 0.94);
  const quiet = heard.find((track) => {
    const take = activeTake(track);
    return !!take && take.peak < 0.06 && take.duration > 0.8;
  });
  const seconds = songDuration(song);

  if (ask === "hor") {
    if (heard.length === 0) {
      return {
        text: "Jeg hører ingenting. Det er ikke anstrengelsesastma, det er et tomt spor. Ta opp stemmen, så kan jeg være frekk med grunn.",
        moves: [{ id: "opp", label: "Ta opp", job: "opptak" }],
      };
    }
    const notes = [
      hot ? `${hot.name} slår i taket.` : "",
      quiet ? `${quiet.name} er nesten borte.` : "",
      song.bpm >= 140 ? "Tempoet er en bakke." : "",
      !song.lyrics.trim() ? "Teksten er tom." : "",
      vocal?.room === "tort" ? "Stemmen står i et skap." : "",
      vocal?.trick && vocal.trick !== "ingen" ? `Du har allerede ${vocal.trick} på stemmen.` : "",
    ].filter(Boolean);
    return {
      text: notes.length
        ? `Jeg har hørt på ${name}. ${notes.join(" ")} Resten kan få være. Frisbeegolf hadde vært verre.`
        : `Jeg har hørt på ${name}. Den står. Ikke rot den til med en runde til. Vil du, gjør vi den frekkere.`,
      moves: [
        ...(hot ? [{ id: "nytt", label: "Ta et nytt forsøk", job: "opptak" as const }] : []),
        ...(quiet ? [{ id: "bal", label: "Åpne balanse", job: "balanse" as const }] : []),
        { id: "frekk", label: "Gjør den frekk", tone: "radio", echo: "kort", twin: 0.4, even: 0.55, master: "radio" },
      ],
    };
  }

  if (ask === "frekk") {
    return {
      text: "Frekk er ikke høyere. Frekk er tettere. Radio på klangen, et kort ekko, og en tvilling rett bak deg. Du blir sittende. Det er poenget.",
      moves: [{ id: "frekk", label: "Legg på det frekke", tone: "radio", echo: "kort", twin: 0.42, even: 0.55, master: "radio", room: "stue" }],
    };
  }

  if (ask === "klar") {
    const gaps = [
      heard.length === 0 ? "Det finnes ikke noe å legge ut ennå." : "",
      seconds > 180 ? "Den er lengre enn tre minutter. Korte filmer orker ikke det." : "",
      !song.lyrics.trim() ? "Uten tekst blir Smule bare en film av deg som mimrer." : "",
      !activeVideoTake(song) ? "Det er lyd, men ikke bilde." : "",
      hot ? "Noe slår i taket. Det høres ikke dyrt ut, det høres ødelagt ut." : "",
    ].filter(Boolean);
    return {
      text: gaps.length
        ? `${name} er ikke klar. ${gaps.join(" ")}`
        : `${name} kan gå. Velg hvor den skal bo, og lim inn selv. Jeg sender ingenting.`,
      moves: [
        ...(seconds > 180 ? [{ id: "klipp", label: "Klipp den ned", job: "klipp" as const }] : []),
        ...(!song.lyrics.trim() ? [{ id: "tekst", label: "Skriv teksten", job: "tekst" as const }] : []),
        ...(!activeVideoTake(song) ? [{ id: "bilde", label: "Ta bilde", job: "bilde" as const }] : []),
        { id: "ut", label: "Velg sted", job: "ut" },
      ],
    };
  }

  return {
    text: "Tre ting du kan prøve uten å reise deg. Telefonen ringer fra hull sju. Koret er deg, litt sein. Roboten puster i takt og trenger ikke inhalator. Nattkjøkkenet er stort og mykt.",
    moves: [
      { id: "telefon", label: "Anrop fra banen", trick: "telefon", room: "tort", tone: "radio" },
      { id: "kor", label: "To av deg", trick: "kor", room: "stue", twin: 0.35 },
      { id: "robot", label: "Metallpust", trick: "robot", even: 0.35 },
      { id: "natt", label: "Nattkjøkken", trick: "ingen", room: "kirke", echo: "syng", master: "myk", drums: "ballade" },
    ],
  };
}
