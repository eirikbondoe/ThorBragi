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
      text: "Syng og spill i ett opptak. Headset på, så høyttaleren ikke blir med.",
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
        text: "Lydnivået slo i taket. Hold mikrofonen litt lenger unna, og ta opp på nytt.",
        job: "opptak",
      });
    } else if (take.peak < 0.06 && take.duration > 0.8) {
      notes.push({
        id: `quiet-${track.id}`,
        title: `${track.name} er nesten borte`,
        text: "Hold mikrofonen nærmere, eller skru sporet opp i Balanse.",
        job: "balanse",
      });
    }
    const silentHead = take.peaks.slice(0, 4).every((p) => p < 0.04) && take.peaks.some((p) => p > 0.18);
    if (silentHead) {
      notes.push({
        id: `trim-${track.id}`,
        title: `Stille før ${track.name.toLowerCase()}`,
        text: "Det er stille før lyden starter. Klipp det vekk.",
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
      text: "Skru stemmen opp, eller gitaren ned, i Balanse.",
      job: "balanse",
    });
  }

  if (vocal && vocal.room === "tort") {
    notes.push({
      id: "room",
      title: "Stemmen er tørr",
      text: "Velg Stue under Romklang hvis stemmen høres tørr ut.",
      job: "rom",
    });
  }

  if (song.tracks.length === 1 && song.tracks[0]?.kind !== "samtidig" && withAudio.length === 1) {
    notes.push({
      id: "layer",
      title: "Ett lag til",
      text: "Ta opp det som mangler oppå det du har. Headset på.",
      job: "opptak",
    });
  }

  if (!activeVideoTake(song)) {
    notes.push({
      id: "video",
      title: "Film det samtidig",
      text: "Kamera og mikrofon i samme opptak. Filmen lagres på telefonen.",
      job: "bilde",
    });
  } else {
    notes.push({
      id: "koble",
      title: "Bilde til OBS eller Prism",
      text: "En lenke OBS eller Prism kan legge oppå kameraet. ThorBragi sender ikke.",
      job: "koble",
    });
  }

  if (song.lyrics.trim()) {
    notes.push({
      id: "sammen",
      title: "Flere kan se teksten",
      text: "Si koden. Teksten går nedover på de andre skjermene.",
      job: "sammen",
    });
  }

  if (withAudio.length > 0 || activeVideoTake(song)) {
    notes.push({
      id: "ut",
      title: "Klar til å legge ut",
      text: "YouTube, Smule eller en kort film. Du limer inn selv.",
      job: "ut",
    });
  }

  if (!song.lyrics.trim()) {
    notes.push({
      id: "lyrics",
      title: "Teksten er tom",
      text: "Skriv linjene. De vises store neste gang du tar opp.",
      job: "tekst",
    });
  }

  if (song.sections.length === 0) {
    notes.push({
      id: "form",
      title: "Låten har ingen deler",
      text: "Merk vers og refreng, så formen er synlig.",
      job: "deler",
    });
  }

  if (song.bpm >= 140) {
    notes.push({
      id: "bpm",
      title: "Tempoet er høyt",
      text: "Det går fort. Senk tempoet hvis ordene ikke rekker fram.",
      job: "tempo",
    });
  }

  if (withAudio.length > 0 && notes.filter((n) => n.id !== "lyrics" && n.id !== "form").length === 0) {
    notes.push({
      id: "finish",
      title: "Klar for å høres ferdig ut",
      text: "Velg Ferdig lyd, og hør før og etter.",
      job: "ferdig",
    });
  }

  return notes.slice(0, 5);
}
