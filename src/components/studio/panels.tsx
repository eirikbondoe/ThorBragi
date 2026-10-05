import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { producerAdvice } from "@/lib/studio/advice";
import type { EngineSnap, StudioEngine } from "@/lib/studio/audio";
import { activeTake, useStudio } from "@/lib/studio/store";
import { KEYS, keyInfo } from "@/lib/studio/theory";
import type { JobId, SectionName, Song, TrackKind } from "@/lib/studio/types";
import { KIND_LABEL, SECTION_LABEL } from "@/lib/studio/types";
import { Choices, formatTime, Meter, PanelHead, Slider, TrackChips, Wave } from "./bits";
import { BildePanel, FilmklippPanel, FilmLagrePanel, SendingPanel } from "./video-panels";
import { SammenPanel } from "./lyric-link";
import { UtPanel } from "./community-panel";
import { KoblePanel } from "./connect-panel";
import { AdvisorPanel, TryPanel } from "./advisor-panel";
import { GearGuide } from "./gear-guide";
import { lyricIndex, lyricLines } from "@/lib/studio/lyrics";
import { Prompter } from "./prompter";

type Common = {
  song: Song;
  engine: RefObject<StudioEngine | null>;
  snap: EngineSnap;
  focusId: string | null;
  setFocusId: (id: string) => void;
  go: (job: JobId | null) => void;
};

const KINDS: { id: TrackKind; label: string; text: string }[] = [
  { id: "samtidig", label: "Samtidig", text: "Syng og spill i ett opptak" },
  { id: "stemme", label: "Bare stemme", text: "Mikrofonen nær munnen" },
  { id: "gitar", label: "Bare gitar", text: "Et spor du kan legge sang oppå" },
  { id: "piano", label: "Piano", text: "Eller et annet tangentinstrument" },
  { id: "kor", label: "Kor", text: "En stemme til, over eller under" },
  { id: "annet", label: "Annet", text: "Det instrumentet du har i hånda" },
];

const SECTION_NAMES: SectionName[] = ["intro", "vers", "refreng", "bro", "outro"];

function focusedTrack(song: Song, focusId: string | null) {
  return song.tracks.find((track) => track.id === focusId) ?? song.tracks[0] ?? null;
}

function levelText(level: number, listening: boolean): string {
  if (!listening) return "Trykk under, og snakk eller spill som du skal gjøre på opptaket.";
  if (level > 0.9) return "For sterkt. Litt lenger unna mikrofonen.";
  if (level < 0.06) return "Vi hører nesten ingenting. Kom nærmere.";
  return "Bra styrke. Sånn skal det ligge.";
}

export function JobPanel({ job, ...props }: Common & { job: JobId }) {
  switch (job) {
    case "opptak":
      return <RecordPanel {...props} />;
    case "monitor":
      return <MonitorPanel {...props} />;
    case "tempo":
      return <TempoPanel {...props} />;
    case "trommer":
      return <DrumPanel {...props} />;
    case "grep":
      return <KeyPanel {...props} />;
    case "tekst":
      return <LyricsPanel {...props} />;
    case "sammen":
      return <SammenPanel song={props.song} />;
    case "ut":
      return <UtPanel song={props.song} engine={props.engine} />;
    case "koble":
      return <KoblePanel song={props.song} />;
    case "prov":
      return <TryPanel song={props.song} focusId={props.focusId} setFocusId={props.setFocusId} />;
    case "ai":
      return <AdvisorPanel song={props.song} go={props.go} />;
    case "utstyr":
      return <GearGuide go={props.go} />;
    case "deler":
      return <SectionsPanel {...props} />;
    case "forsok":
      return <TakesPanel {...props} />;
    case "klipp":
      return <TrimPanel {...props} />;
    case "balanse":
      return <BalancePanel {...props} />;
    case "tone":
      return <TonePanel {...props} />;
    case "jevn":
      return <EvenPanel {...props} />;
    case "rom":
      return <RoomPanel {...props} />;
    case "ekko":
      return <EchoPanel {...props} />;
    case "sus":
      return <HushPanel {...props} />;
    case "tvilling":
      return <TwinPanel {...props} />;
    case "ab":
      return <ComparePanel {...props} />;
    case "ferdig":
      return <MasterPanel {...props} />;
    case "rad":
      return <AdvicePanel {...props} />;
    case "del":
      return <SharePanel {...props} />;
    case "bilde":
      return <BildePanel {...props} />;
    case "sending":
      return <SendingPanel {...props} />;
    case "filmklipp":
      return <FilmklippPanel {...props} />;
    case "filmlagre":
      return <FilmLagrePanel {...props} />;
    default:
      return null;
  }
}

function RecordPanel({ song, engine, snap }: Common) {
  const [kind, setKind] = useState<TrackKind>("samtidig");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const trackRef = useRef<string | null>(null);
  const ensureTrack = useStudio((state) => state.ensureTrack);
  const addTrack = useStudio((state) => state.addTrack);
  const addTake = useStudio((state) => state.addTake);
  const vocal = kind === "stemme" || kind === "kor" || kind === "samtidig";

  async function start(asNew: boolean) {
    setLocalError(null);
    trackRef.current = asNew ? addTrack(song.id, kind) : ensureTrack(song.id, kind);
    await engine.current?.beginRecord();
  }

  async function finish() {
    setSaving(true);
    setLocalError(null);
    try {
      const blob = await engine.current?.endRecord();
      const trackId = trackRef.current;
      if (!blob || !trackId) throw new Error("Opptaket ble tomt. Prøv en gang til.");
      const meta = await engine.current!.decodeTake(blob);
      addTake(song.id, trackId, { id: crypto.randomUUID(), createdAt: Date.now(), ...meta });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Kunne ikke lagre opptaket.");
    } finally {
      setSaving(false);
    }
  }

  const busy = snap.counting || snap.recording || saving;

  return (
    <section>
      <PanelHead
        title="Ta opp"
        lede="Headset på. Høyttaleren har anstrengelsesastma og blir med på opptaket hvis du lar den. Fire slag, så er du i gang."
      />
      {!busy ? (
        <div className="mb-5 grid grid-cols-2 gap-2">
          {KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={kind === item.id}
              onClick={() => setKind(item.id)}
              className={
                kind === item.id
                  ? "min-h-11 rounded-md border border-lamp bg-surface-2 px-3 py-3 text-left"
                  : "min-h-11 rounded-md border border-line bg-surface px-3 py-3 text-left"
              }
            >
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="mt-1 block text-sm text-muted">{item.text}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-4 py-4">
        {snap.counting ? (
          <>
            <p className="font-display text-6xl tabular-nums text-lamp">{snap.countLeft ?? 4}</p>
            <p className="text-muted">Gjør deg klar</p>
            <Button variant="quiet" onClick={() => engine.current?.cancelRecord()}>
              Avbryt
            </Button>
          </>
        ) : snap.recording ? (
          <>
            <button
              type="button"
              className="rec-pulse flex size-28 items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink"
              onClick={() => void finish()}
            >
              Stopp
            </button>
            <RecordClock />
          </>
        ) : (
          <button
            type="button"
            className="flex size-28 items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink"
            onClick={() => void start(false)}
            disabled={saving}
          >
            Ta opp
          </button>
        )}
      </div>
      {(snap.listening || snap.recording || snap.counting) && (
        <div className="space-y-2">
          <Meter level={snap.level} />
          <p className="text-sm text-muted">{levelText(snap.level, true)}</p>
          {vocal && snap.note ? (
            <p className="font-display text-2xl">
              {snap.note} <span className="text-base text-muted">{snap.hint}</span>
            </p>
          ) : null}
        </div>
      )}
      {localError ? <p className="mt-3 text-sm text-signal">{localError}</p> : null}
      {song.lyrics.trim() && (snap.recording || snap.counting || snap.playing) ? (
        <div className="mt-5">
          <Prompter compact lines={lyricLines(song.lyrics)} index={lyricIndex(song, snap.position)} />
        </div>
      ) : null}
      {!busy ? (
        <div className="mt-4">
          <Button variant="ghost" onClick={() => void start(true)}>
            Legg som nytt spor
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function RecordClock() {
  const started = useRef(performance.now());
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((performance.now() - started.current) / 1000), 200);
    return () => window.clearInterval(id);
  }, []);
  return <p className="tabular-nums text-muted">{formatTime(seconds)}</p>;
}

function MonitorPanel({ engine, snap }: Common) {
  useEffect(() => () => engine.current?.stopListen(), [engine]);
  return (
    <section>
      <PanelHead
        title="Sjekk mikrofon"
        lede="Vi sender ikke lyden ut i høyttaleren, så den ikke piper. Stolpen skal danse i midten når du spiller normalt."
      />
      <Button
        variant={snap.listening ? "quiet" : "primary"}
        onClick={() => (snap.listening ? engine.current?.stopListen() : void engine.current?.startListen())}
      >
        {snap.listening ? "Slutt å lytte" : "Lytt til mikrofonen"}
      </Button>
      <div className="mt-5 space-y-2">
        <Meter level={snap.level} />
        <p className="text-sm text-muted">{levelText(snap.level, snap.listening)}</p>
      </div>
      <ul className="mt-6 space-y-2 text-sm text-muted">
        <li>Headset på hodet, ikke mikrofonen mot en høyttaler.</li>
        <li>Syng og spill så høyt som du skal gjøre på ordentlig.</li>
        <li>Rød stolpe betyr for nærme. Nesten tom stolpe betyr for langt unna.</li>
      </ul>
    </section>
  );
}

function TempoPanel({ song }: Common) {
  const setBpm = useStudio((state) => state.setBpm);
  const setClick = useStudio((state) => state.setClick);
  const taps = useRef<number[]>([]);

  function tap() {
    const now = performance.now();
    taps.current = [...taps.current.filter((time) => now - time < 2200), now];
    if (taps.current.length < 2) return;
    const gaps: number[] = [];
    for (let i = 1; i < taps.current.length; i++) gaps.push(taps.current[i]! - taps.current[i - 1]!);
    const avg = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    setBpm(song.id, Math.round(60000 / avg));
  }

  return (
    <section>
      <PanelHead title="Tempo og klikk" lede="Tempo er hvor fort låten går. Ikke hvor fort du kommer deg til hull fire. Klikket er noe å spille mot, sittende." />
      <p className="font-display text-6xl tabular-nums">{song.bpm}</p>
      <p className="mb-4 text-sm text-muted">slag i minuttet</p>
      <Slider label="Tempo" min={60} max={180} value={song.bpm} display={String(song.bpm)} onChange={(value) => setBpm(song.id, value)} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="quiet" onClick={tap}>
          Bank tempo
        </Button>
        <Button variant={song.click ? "primary" : "quiet"} onClick={() => setClick(song.id, !song.click)} aria-pressed={song.click}>
          {song.click ? "Klikk er på" : "Klikk er av"}
        </Button>
      </div>
    </section>
  );
}

function DrumPanel({ song }: Common) {
  const setDrums = useStudio((state) => state.setDrums);
  return (
    <section>
      <PanelHead title="Trommer" lede="En rytme å hvile sangen på. Skru dem av når du vil være alene. De klager ikke, og de peser ikke." />
      <Choices
        value={song.drums}
        onChange={(drums) => setDrums(song.id, drums)}
        options={[
          { id: "ingen", label: "Ingen", text: "Bare det du spiller selv" },
          { id: "ro", label: "Ro", text: "Jevn og stille, fin til sang og gitar" },
          { id: "sprett", label: "Sprett", text: "Lettere på tå, mer fart" },
          { id: "ballade", label: "Ballade", text: "Store slag, god plass mellom" },
        ]}
      />
    </section>
  );
}

function KeyPanel({ song, engine, snap }: Common) {
  const setKey = useStudio((state) => state.setKey);
  const info = keyInfo(song.keyName);
  useEffect(() => () => engine.current?.stopListen(), [engine]);
  return (
    <section>
      <PanelHead title="Grep og stemming" lede="Velg toneart. Trykk på et grep for å høre det. Grunntonen er den du stemmer gitaren mot." />
      <div className="mb-4 flex flex-wrap gap-2">
        {KEYS.map((key) => (
          <button
            key={key.id}
            type="button"
            aria-pressed={song.keyName === key.id}
            onClick={() => setKey(song.id, key.id)}
            className={
              song.keyName === key.id
                ? "min-h-11 min-w-11 rounded-full border border-lamp bg-surface-2 px-4"
                : "min-h-11 min-w-11 rounded-full border border-line bg-surface px-4"
            }
          >
            {key.id}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {info.chords.map((chord) => (
          <Button key={chord.name} variant="quiet" onClick={() => engine.current?.previewChord(chord.freqs)}>
            Hør {chord.name}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => engine.current?.previewChord([info.root])}>
          Hør grunntonen
        </Button>
        <Button
          variant="quiet"
          onClick={() => (snap.listening ? engine.current?.stopListen() : void engine.current?.startListen())}
        >
          {snap.listening ? "Slutt å stemme" : "Stem med mikrofon"}
        </Button>
      </div>
      {snap.listening ? (
        <p className="mt-4 font-display text-4xl">
          {snap.note ?? "…"} <span className="text-lg text-muted">{snap.hint ?? "spill en tone"}</span>
        </p>
      ) : null}
    </section>
  );
}

function LyricsPanel({ song }: Common) {
  const setLyrics = useStudio((state) => state.setLyrics);
  return (
    <section>
      <PanelHead title="Tekst" lede="Skriv som du vil. Vers og refreng kan stå som overskrifter. Teksten blir stor når du tar opp, så du slipper å huske den i motvind." />
      <textarea
        value={song.lyrics}
        onChange={(event) => setLyrics(song.id, event.target.value)}
        rows={12}
        aria-label="Tekst"
        className="w-full rounded-md border border-line px-4 py-3 font-display text-xl leading-snug"
      />
    </section>
  );
}

function SectionsPanel({ song }: Common) {
  const addSection = useStudio((state) => state.addSection);
  const updateSection = useStudio((state) => state.updateSection);
  const moveSection = useStudio((state) => state.moveSection);
  const removeSection = useStudio((state) => state.removeSection);
  return (
    <section>
      <PanelHead title="Delene i låten" lede="Formen er kartet. Åtte takter er et vanlig vers. Du kan flytte delene opp og ned." />
      <ol className="space-y-3">
        {song.sections.map((section, index) => (
          <li key={section.id} className="rounded-md border border-line bg-surface p-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label={`Del ${index + 1}`}
                value={section.name}
                onChange={(event) => updateSection(song.id, section.id, { name: event.target.value as SectionName })}
                className="min-h-11 rounded-full border border-line px-3"
              >
                {SECTION_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {SECTION_LABEL[name]}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted tabular-nums">{section.bars} takter</span>
              <Button variant="quiet" onClick={() => updateSection(song.id, section.id, { bars: Math.max(1, section.bars - 1) })}>
                Færre
              </Button>
              <Button variant="quiet" onClick={() => updateSection(song.id, section.id, { bars: Math.min(32, section.bars + 1) })}>
                Flere
              </Button>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" aria-label="Flytt opp" onClick={() => moveSection(song.id, section.id, -1)} disabled={index === 0}>
                <ArrowUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                aria-label="Flytt ned"
                onClick={() => moveSection(song.id, section.id, 1)}
                disabled={index === song.sections.length - 1}
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button variant="danger" onClick={() => removeSection(song.id, section.id)}>
                Fjern
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        {SECTION_NAMES.map((name) => (
          <Button key={name} variant="quiet" onClick={() => addSection(song.id, name)}>
            Legg til {SECTION_LABEL[name].toLowerCase()}
          </Button>
        ))}
      </div>
    </section>
  );
}

function TakesPanel({ song }: Common) {
  const useTake = useStudio((state) => state.useTake);
  const removeTake = useStudio((state) => state.removeTake);
  if (song.tracks.length === 0) {
    return (
      <section>
        <PanelHead title="Velg forsøk" lede="Når du har tatt opp mer enn én gang, velger du hvilken som skal være med." />
        <p className="text-muted">Ingen spor ennå.</p>
      </section>
    );
  }
  return (
    <section>
      <PanelHead title="Velg forsøk" lede="Et forsøk er ett opptak. Den som er merket, er den som høres. De andre blir liggende." />
      <div className="space-y-5">
        {song.tracks.map((track) => (
          <div key={track.id}>
            <h3 className="mb-2 text-lg">{track.name}</h3>
            {track.takes.length === 0 ? <p className="text-sm text-muted">Ingen opptak.</p> : null}
            <ul className="space-y-2">
              {track.takes.map((take, index) => {
                const on = take.id === track.activeTakeId;
                return (
                  <li key={take.id} className="rounded-md border border-line bg-surface p-3">
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                      <span>Forsøk {index + 1}</span>
                      <span className="tabular-nums text-muted">{formatTime(take.duration)}</span>
                    </div>
                    <Wave peaks={take.peaks} />
                    <div className="mt-3 flex gap-2">
                      <Button variant={on ? "primary" : "quiet"} onClick={() => useTake(song.id, track.id, take.id)} aria-pressed={on}>
                        {on ? "Brukes nå" : "Bruk denne"}
                      </Button>
                      <Button variant="danger" aria-label="Slett forsøk" onClick={() => removeTake(song.id, track.id, take.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrimPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  const take = track ? activeTake(track) : null;
  return (
    <section>
      <PanelHead title="Klipp" lede="Dra bort det som er stille før du begynner, og det som henger igjen etterpå. Selve spillet blir liggende." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track && take ? (
        <div className="space-y-4">
          <Wave peaks={take.peaks} />
          <Slider
            label="Kutt starten"
            min={0}
            max={Math.max(0, take.duration - track.trimEnd - 0.1)}
            step={0.1}
            value={track.trimStart}
            display={formatTime(track.trimStart)}
            onChange={(value) => patchTrack(song.id, track.id, { trimStart: value })}
          />
          <Slider
            label="Kutt slutten"
            min={0}
            max={Math.max(0, take.duration - track.trimStart - 0.1)}
            step={0.1}
            value={track.trimEnd}
            display={formatTime(track.trimEnd)}
            onChange={(value) => patchTrack(song.id, track.id, { trimEnd: value })}
          />
        </div>
      ) : (
        <p className="text-muted">Dette sporet har ikke et opptak å klippe.</p>
      )}
    </section>
  );
}

function BalancePanel({ song }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const removeTrack = useStudio((state) => state.removeTrack);
  return (
    <section>
      <PanelHead title="Balanse" lede="Stemmen skal som regel sitte foran gitaren. Hysj skrur et spor av. Bare denne hører du alene." />
      {song.tracks.length === 0 ? <p className="text-muted">Ingen spor ennå.</p> : null}
      <ul className="space-y-4">
        {song.tracks.map((track) => (
          <li key={track.id} className="rounded-md border border-line bg-surface p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-medium">{track.name}</span>
              <span className="text-sm text-muted">{KIND_LABEL[track.kind]}</span>
            </div>
            <Slider
              label="Styrke"
              min={0}
              max={100}
              value={Math.round(track.volume * 100)}
              display={String(Math.round(track.volume * 100))}
              onChange={(value) => patchTrack(song.id, track.id, { volume: value / 100 })}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant={track.muted ? "primary" : "quiet"} aria-pressed={track.muted} onClick={() => patchTrack(song.id, track.id, { muted: !track.muted })}>
                {track.muted ? "Er stille" : "Hysj"}
              </Button>
              <Button variant={track.solo ? "primary" : "quiet"} aria-pressed={track.solo} onClick={() => patchTrack(song.id, track.id, { solo: !track.solo })}>
                Bare denne
              </Button>
              <Button variant="danger" onClick={() => removeTrack(song.id, track.id)}>
                Slett spor
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TonePanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead title="Tone" lede="Dette er klang, ikke volum. Varm er mørkere. Klar løfter stemmen. Radio er den som skjærer gjennom." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Choices
          value={track.tone}
          onChange={(tone) => patchTrack(song.id, track.id, { tone })}
          options={[
            { id: "rett", label: "Rett", text: "Slik mikrofonen hørte det" },
            { id: "varm", label: "Varm", text: "Mer kropp, mindre skarphet" },
            { id: "klar", label: "Klar", text: "Ordene blir lettere å høre" },
            { id: "radio", label: "Radio", text: "Tett og tydelig, litt mer push" },
          ]}
        />
      ) : null}
    </section>
  );
}

function EvenPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead title="Jevn lyd" lede="Hvisking og roping kommer nærmere hverandre. Mye jevning kan høres klemt ut. Litt er ofte nok." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Slider
          label="Hvor jevnt"
          min={0}
          max={100}
          value={Math.round(track.even * 100)}
          display={Math.round(track.even * 100) < 25 ? "lite" : Math.round(track.even * 100) > 70 ? "mye" : "passe"}
          onChange={(value) => patchTrack(song.id, track.id, { even: value / 100 })}
        />
      ) : null}
    </section>
  );
}

function RoomPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead title="Romklang" lede="Et tørt opptak høres ut som et skap. Stue er det de fleste sanger vil ha. Kirke er til det som skal være stort." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Choices
          value={track.room}
          onChange={(room) => patchTrack(song.id, track.id, { room })}
          options={[
            { id: "tort", label: "Tørt", text: "Ingen ekstra rom" },
            { id: "stue", label: "Stue", text: "Litt luft rundt stemmen" },
            { id: "scene", label: "Scene", text: "Som et lite lokale" },
            { id: "kirke", label: "Kirke", text: "Langt og stort" },
          ]}
        />
      ) : null}
    </section>
  );
}

function EchoPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead title="Ekko" lede="Et kort ekko svarer med en gang. Syng-med følger tempoet, som en stemme et lite stykke bak." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Choices
          value={track.echo}
          onChange={(echo) => patchTrack(song.id, track.id, { echo })}
          options={[
            { id: "av", label: "Av", text: "Ingen ekko" },
            { id: "kort", label: "Kort", text: "Et raskt svar" },
            { id: "syng", label: "Syng-med", text: "Følger slagene i låten" },
          ]}
        />
      ) : null}
    </section>
  );
}

function HushPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead title="Sus og romling" lede="Tar ned brum fra rommet og smålyder mellom setningene. For mye spiser av gitaren og pusten." />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Slider
          label="Hvor mye som dempes"
          min={0}
          max={100}
          value={Math.round(track.hush * 100)}
          display={String(Math.round(track.hush * 100))}
          onChange={(value) => patchTrack(song.id, track.id, { hush: value / 100 })}
        />
      ) : null}
    </section>
  );
}

function TwinPanel({ song, focusId, setFocusId }: Common) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = focusedTrack(song, focusId);
  return (
    <section>
      <PanelHead
        title="Tvillingstemme"
        lede="Ikke automatisk rensing av toner. En myk kopi like ved siden av, så én stemme høres fyldigere ut. Ekte kor tar du opp selv."
      />
      <TrackChips song={song} trackId={track?.id ?? null} onPick={setFocusId} />
      {track ? (
        <Slider
          label="Hvor tydelig tvillingen er"
          min={0}
          max={100}
          value={Math.round(track.twin * 100)}
          display={String(Math.round(track.twin * 100))}
          onChange={(value) => patchTrack(song.id, track.id, { twin: value / 100 })}
        />
      ) : null}
    </section>
  );
}

function ComparePanel({ song }: Common) {
  const setCompareDry = useStudio((state) => state.setCompareDry);
  return (
    <section>
      <PanelHead title="Før og etter" lede="Samme opptak. Før er uten klang, jevning og ferdig lyd. Etter er slik produsenten har satt det. Balanse og trommer blir." />
      <Choices
        value={song.compareDry ? "for" : "etter"}
        onChange={(value) => setCompareDry(song.id, value === "for")}
        options={[
          { id: "etter", label: "Etter", text: "Med tone, rom, jevning og ferdig lyd" },
          { id: "for", label: "Før", text: "Rått opptak, bare styrke" },
        ]}
      />
    </section>
  );
}

function MasterPanel({ song }: Common) {
  const setMaster = useStudio((state) => state.setMaster);
  return (
    <section>
      <PanelHead title="Ferdig lyd" lede="Det siste en produsent gjør: få låten til å sitte samlet, uten at du drar i ti knotter." />
      <Choices
        value={song.master}
        onChange={(master) => setMaster(song.id, master)}
        options={[
          { id: "hjemme", label: "Hjemme", text: "Nær og ærlig, lite pynt" },
          { id: "radio", label: "Radio", text: "Tydeligere og mer samlet" },
          { id: "myk", label: "Myk", text: "Varmere, mindre skarp" },
        ]}
      />
    </section>
  );
}

function AdvicePanel({ song, go }: Common) {
  const notes = producerAdvice(song);
  return (
    <section>
      <PanelHead title="Produsentens råd" lede="Ikke en fasit. Bare det jeg hadde sagt hvis jeg satt ved siden av deg." />
      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note.id}>
            <button type="button" onClick={() => go(note.job)} className="w-full rounded-md border border-line bg-surface px-4 py-3 text-left">
              <span className="block font-medium">{note.title}</span>
              <span className="mt-1 block text-sm text-muted">{note.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SharePanel({ song, engine }: Common) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function makeFile(): Promise<File | null> {
    const engineRef = engine.current;
    if (!engineRef) return null;
    setBusy(true);
    setMessage(null);
    try {
      const blob = await engineRef.renderWav(song);
      const name = `${safeName(song.title)}.wav`;
      return new File([blob], name, { type: "audio/wav" });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage lydfilen.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    const file = await makeFile();
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Lydfilen er lastet ned, slik låten høres ut nå.");
  }

  async function share() {
    const file = await makeFile();
    if (!file) return;
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: song.title });
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Deling fra nettleseren finnes ikke her. Filen ble lastet ned i stedet.");
  }

  return (
    <section>
      <PanelHead
        title="Lagre og del"
        lede="Låtene blir liggende i denne nettleseren, på telefonen. En lydfil kan du sende til noen, eller ta med videre."
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void download()} disabled={busy}>
          {busy ? "Gjør klar…" : "Last ned lydfil"}
        </Button>
        <Button variant="quiet" onClick={() => void share()} disabled={busy}>
          Del
        </Button>
      </div>
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </section>
  );
}

function safeName(title: string): string {
  const clean = title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim();
  return clean || "lat";
}
