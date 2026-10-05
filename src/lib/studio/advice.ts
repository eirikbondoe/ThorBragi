import { activeTake, activeVideoTake } from "./store";
import type { JobId, Song } from "./types";

export type Advice = { id: string; title: string; text: string; job: JobId };

export function producerAdvice(song: Song): Advice[] {
  const notes: Advice[] = [];
  const withAudio = song.tracks.filter((track) => activeTake(track));

  if (song.tracks.length === 0) {
    notes.push({
      id: "start",
      title: "Begynn i ett spor",
      text: "Syng og spill samtidig. Ett opptak er en hel låt. Headset på. Frisbeegolf får ikke være med på opptaket, og det får ikke høyttaleren heller.",
      job: "opptak",
    });
  }

  for (const track of withAudio) {
    const take = activeTake(track);
    if (!take) continue;
    if (take.peak > 0.94) {
      notes.push({
        id: `hot-${track.id}`,
        title: `${track.name} er for sterk`,
        text: "Du slo i taket. Hold mikrofonen litt unna, og ta et nytt forsøk. Dette er ikke en bakke du skal løpe opp.",
        job: "opptak",
      });
    } else if (take.peak < 0.06 && take.duration > 0.8) {
      notes.push({
        id: `quiet-${track.id}`,
        title: `${track.name} er nesten borte`,
        text: "Nærmere mikrofonen, eller opp i Balanse. Hvisking er søtt. Borte er det ikke.",
        job: "balanse",
      });
    }
    const silentHead = take.peaks.slice(0, 4).every((p) => p < 0.04) && take.peaks.some((p) => p > 0.18);
    if (silentHead) {
      notes.push({
        id: `trim-${track.id}`,
        title: `Stille før ${track.name.toLowerCase()}`,
        text: "Et tomt strekk før du tør. Klipp det. Låten skal starte når du gjør det.",
        job: "klipp",
      });
    }
  }

  const vocal = withAudio.find((t) => t.kind === "stemme" || t.kind === "samtidig" || t.kind === "kor");
  const guitar = withAudio.find((t) => t.kind === "gitar");
  if (vocal && guitar && vocal.volume + 0.12 < guitar.volume) {
    notes.push({
      id: "mask",
      title: "Gitaren tar stemmen",
      text: "Stemmen skal sitte foran. Gitaren er kjekk. Den skal ikke snakke over deg.",
      job: "balanse",
    });
  }

  if (vocal && vocal.room === "tort") {
    notes.push({
      id: "room",
      title: "Stemmen står i et skap",
      text: "Litt stue gjør at stemmen setter seg. Kirke er for dem som vil høres ut som de har gått seg vill.",
      job: "rom",
    });
  }

  if (song.tracks.length === 1 && song.tracks[0]?.kind !== "samtidig" && withAudio.length === 1) {
    notes.push({
      id: "layer",
      title: "Ett lag til",
      text: "Ta opp det som mangler oppå det du har. Headset. Du jogger ikke mellom sporene.",
      job: "opptak",
    });
  }

  if (!activeVideoTake(song)) {
    notes.push({
      id: "video",
      title: "Film det samtidig",
      text: "Kamera og mikrofon i samme forsøk. Du får en film. Den stikker ikke av gårde selv.",
      job: "bilde",
    });
  } else {
    notes.push({
      id: "koble",
      title: "Bilde til OBS eller Prism",
      text: "En lenke de kan legge oppå kameraet. Thorøisjen sender ikke. Han sitter pent.",
      job: "koble",
    });
  }

  if (song.lyrics.trim()) {
    notes.push({
      id: "sammen",
      title: "Flere kan se teksten",
      text: "Si koden. Teksten går nedover på de andre skjermene. Ingen må løpe etter den.",
      job: "sammen",
    });
  }

  if (withAudio.length > 0 || activeVideoTake(song)) {
    notes.push({
      id: "ut",
      title: "Klar til å legge ut",
      text: "YouTube, Smule eller en kort film. Du limer inn. Banen får ingen kredit.",
      job: "ut",
    });
  }

  if (!song.lyrics.trim()) {
    notes.push({
      id: "lyrics",
      title: "Teksten er tom",
      text: "Skriv linjene. De ligger foran deg neste gang du trykker på den røde.",
      job: "tekst",
    });
  }

  if (song.sections.length === 0) {
    notes.push({
      id: "form",
      title: "Låten har ingen deler",
      text: "Merk vers og refreng. Formen husker du. Banekartet kan noen andre ta.",
      job: "deler",
    });
  }

  if (song.bpm >= 140) {
    notes.push({
      id: "bpm",
      title: "Tempoet er en bakke",
      text: "Ordene rekker ikke fram. Senk det. Sangen skal pustes, ikke løpes.",
      job: "tempo",
    });
  }

  if (withAudio.length > 0 && notes.filter((n) => n.id !== "lyrics" && n.id !== "form").length === 0) {
    notes.push({
      id: "finish",
      title: "Klar for å høres ferdig ut",
      text: "Prøv Ferdig lyd på Radio, og skru mellom Før og etter. Du mikser ikke. Du velger den frekke.",
      job: "ferdig",
    });
  }

  return notes.slice(0, 5);
}
