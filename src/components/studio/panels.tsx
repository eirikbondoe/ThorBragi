import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { producerAdvice } from "@/lib/studio/advice";
import { encodeAudio, downloadBlob, audioFormats } from "@/lib/studio/formats";
import { gainSentence, readGain } from "@/lib/studio/level";
import { shapeForYoutube } from "@/lib/studio/loudness";
import { FormatPick, useSaveFormats } from "./format-pick";
import { LoopPanel } from "./loop-panel";
import { MakePanel } from "./make-panel";
import type { EngineSnap, StudioEngine } from "@/lib/studio/audio";
import { activeTake, useStudio } from "@/lib/studio/store";
import { KEYS, keyInfo, nearestString, OPEN_CHORDS, stringCents, STRINGS } from "@/lib/studio/theory";
import type { JobId, SectionName, Song, TrackKind } from "@/lib/studio/types";
import { KIND_LABEL, SECTION_LABEL } from "@/lib/studio/types";
import { Choices, formatTime, Meter, PanelHead, Slider, TrackChips, Wave } from "./bits";
import { BildePanel, FilmklippPanel, FilmLagrePanel, SendingPanel } from "./video-panels";
import { SammenPanel } from "./lyric-link";
import { UtPanel } from "./community-panel";
import { KoblePanel } from "./connect-panel";
import { AdvisorPanel, TryPanel } from "./advisor-panel";
import { GearGuide } from "./gear-guide";
import { CleanPanel } from "./clean-panel";
import { lyricIndex, lyricLines } from "@/lib/studio/lyrics";
import { ChordBand, LyricRead } from "./lyric-band";
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
  if (!listening) return "Trykk Test inngang, og snakk eller spill som du skal gjøre på opptaket.";
  return gainSentence(readGain(level));
}

function distanceLine(kind: TrackKind): string {
  if (kind === "gitar") return "Gitar: 20–30 cm mot 12. bånd. I et ekko-rom, nærmere.";
  if (kind === "piano") return "Piano: ikke inni lokket. En halv meter unna, mot strengene.";
  return "Stemme: 15–25 cm, litt til siden for munnen.";
}

export function JobPanel({ job, ...props }: Common & { job: JobId }) {
  switch (job) {
    case "opptak":
      return <RecordPanel {...props} />;
    case "monitor":
      return <MonitorPanel {...props} />;
    case "tempo":
      return <TempoPanel {...props} />;
    case "loop":
      return <LoopPanel song={props.song} snap={props.snap} engine={props.engine} />;
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
    case "rens":
      return <CleanPanel song={props.song} go={props.go} />;
    case "lagai":
      return <MakePanel song={props.song} />;
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
  const [heard, setHeard] = useState(0);
  const [mic, setMic] = useState("");
  const trackRef = useRef<string | null>(null);
  const ensureTrack = useStudio((state) => state.ensureTrack);
  const addTrack = useStudio((state) => state.addTrack);
  const addTake = useStudio((state) => state.addTake);
  const vocal = kind === "stemme" || kind === "kor" || kind === "samtidig";
  const live = snap.listening || snap.recording || snap.counting;

  useEffect(() => {
    if (live && snap.level > heard) setHeard(snap.level);
  }, [live, snap.level, heard]);

  async function start(asNew: boolean, count = true) {
    setLocalError(null);
    trackRef.current = asNew ? addTrack(song.id, kind) : ensureTrack(song.id, kind);
    await engine.current?.beginRecord(count);
  }

  async function finish() {
    setSaving(true);
    setLocalError(null);
    try {
      const blob = await engine.current?.endRecord();
      const trackId = trackRef.current;
      if (!blob || !trackId) throw new Error("Opptaket ble tomt. Prøv en gang til.");
      const meta = await engine.current!.decodeTake(blob);
      const when = new Date().toLocaleString("nb-NO");
      const note = [song.title || "Uten navn", when, KIND_LABEL[kind], mic.trim()].filter(Boolean).join(" · ");
      addTake(song.id, trackId, { id: crypto.randomUUID(), createdAt: Date.now(), note, ...meta });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Kunne ikke lagre opptaket.");
    } finally {
      setSaving(false);
    }
  }

  const busy = snap.counting || snap.recording || saving;
  const read = readGain(live ? Math.max(heard, snap.level) : heard);
  const silent = snap.listening && heard < 0.02;

  return (
    <section>
      <PanelHead
        title="Ta opp"
        lede="Test inngangen først. Hodetelefoner på, så høyttaleren ikke piper. Telefonen teller fire slag, så starter opptaket."
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
      {!busy ? (
        <div className="mb-4 space-y-3">
          <Button
            variant={snap.listening ? "quiet" : "primary"}
            onClick={() => (snap.listening ? engine.current?.stopListen() : void engine.current?.startListen())}
          >
            {snap.listening ? "Stopp testen" : "Test inngang"}
          </Button>
          <Meter level={Math.max(heard, snap.listening ? snap.level : 0)} />
          <p className="text-sm">{gainSentence(read)}</p>
          <p className="text-sm text-muted">{distanceLine(kind)}</p>
          {silent ? (
            <ul className="space-y-1 text-sm text-muted">
              <li>Måleren står stille. Sjekk disse, i denne rekkefølgen:</li>
              <li>1. Riktig mikrofon er valgt i telefonen.</li>
              <li>2. Kabel og adapter sitter i.</li>
              <li>3. Mikrofonen er på, ikke på standby. Kondensatormikrofon trenger 48 volt.</li>
              <li>4. Appen har fått lov til å bruke mikrofonen.</li>
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setHeard(0)}>
              Nullstill måleren
            </Button>
          </div>
          <label className="block text-sm text-muted" htmlFor="mic-note">
            Mikrofon, hvis du vil huske den
          </label>
          <input
            id="mic-note"
            value={mic}
            onChange={(event) => setMic(event.target.value)}
            className="w-full min-h-11 rounded-md border border-line px-3"
          />
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
            <p className="text-sm font-medium text-signal">Opptak pågår</p>
            <button
              type="button"
              className="flex size-28 items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink"
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
      {(snap.recording || snap.counting) && (
        <div className="space-y-2">
          <Meter level={snap.level} />
          <p className="text-sm text-muted">{gainSentence(readGain(snap.level))}</p>
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
          <ChordBand song={song} position={snap.position} active={snap.playing || snap.recording} />
        </div>
      ) : null}
      {!busy ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => void start(true)}>
            Legg som nytt spor
          </Button>
          <Button variant="ghost" onClick={() => void start(false, false)}>
            Ta opp uten telling
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
        lede="Hodetelefoner på. Lyden går ikke ut i høyttaleren. La det sterkeste ligge mellom -12 og -6. Sjekk den ferdige lyden på en høyttaler etterpå. Hodetelefoner skjuler rommet."
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
        <li>Piping kommer når mikrofonen hører høyttaleren. Skru av høyttaleren.</li>
        <li>Syng og spill så høyt som du skal gjøre på ordentlig.</li>
        <li>Rød stolpe er for sterkt. En stolpe som ikke rører seg, er feil inngang eller dempet mikrofon.</li>
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
      <PanelHead
        title="Trommer"
        lede="Legg trommer etterpå bare hvis du spilte mot klikk, eller tempoet er jevnt. Uten klikk vil trommene dra fra opptaket."
      />
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
      {song.drums !== "ingen" && !song.click ? (
        <p className="mt-3 text-sm text-muted">Klikket er av. Skru det på før du tar opp, ellers passer ikke trommene.</p>
      ) : null}
    </section>
  );
}

function KeyPanel({ song, engine, snap }: Common) {
  const setKey = useStudio((state) => state.setKey);
  const info = keyInfo(song.keyName);
  const [tab, setTab] = useState<"akkorder" | "stemmer">("akkorder");
  const [stringId, setStringId] = useState("A2");
  const [hearing, setHearing] = useState<string | null>(null);
  const target = STRINGS.find((item) => item.id === stringId) ?? STRINGS[1]!;
  const cents = snap.listening && snap.freq ? stringCents(snap.freq, target.freq) : null;
  const near = snap.listening && snap.freq ? nearestString(snap.freq) : null;
  const inTune = cents !== null && Math.abs(cents) <= 8;
  const others = OPEN_CHORDS.filter((chord) => !info.chords.some((own) => own.name === chord.name));

  useEffect(
    () => () => {
      engine.current?.stopListen();
      engine.current?.stopChords();
      engine.current?.reference(null);
    },
    [engine],
  );

  function hearString(id: string) {
    const next = STRINGS.find((item) => item.id === id);
    if (!next) return;
    setStringId(id);
    if (hearing === id) {
      engine.current?.reference(null);
      setHearing(null);
      return;
    }
    engine.current?.reference(next.freq);
    setHearing(id);
  }

  let tuneText = "Velg en streng. Spill den. Nålen skal ligge i midten.";
  if (snap.listening && cents === null) tuneText = "Jeg hører ingenting ennå. Plukk strengen.";
  else if (cents !== null && Math.abs(cents) > 60) {
    tuneText = near && near.id !== target.id ? `Det er ikke denne. Nærmest er ${near.name}.` : "Det er ikke denne strengen.";
  } else if (inTune) tuneText = "Der. Den stemmer.";
  else if (cents !== null && cents < 0) tuneText = "Litt slakk. Stram forsiktig.";
  else if (cents !== null) tuneText = "Litt stram. Slipp forsiktig.";

  return (
    <section>
      <PanelHead
        title="Akkorder og stemming"
        lede="Spill grepa som en gitar, i låtens tempo. Stem strengene mot en tone, ikke mot hukommelsen."
      />
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={tab === "akkorder"}
          onClick={() => setTab("akkorder")}
          className={tab === "akkorder" ? "min-h-11 rounded-md border border-lamp bg-surface-2" : "min-h-11 rounded-md border border-line bg-surface"}
        >
          Akkorder
        </button>
        <button
          type="button"
          aria-pressed={tab === "stemmer"}
          onClick={() => setTab("stemmer")}
          className={tab === "stemmer" ? "min-h-11 rounded-md border border-lamp bg-surface-2" : "min-h-11 rounded-md border border-line bg-surface"}
        >
          Stemmer
        </button>
      </div>
      {tab === "akkorder" ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {KEYS.map((key) => (
              <button
                key={key.id}
                type="button"
                aria-pressed={song.keyName === key.id}
                onClick={() => setKey(song.id, key.id)}
                className={
                  song.keyName === key.id
                    ? "min-h-11 min-w-11 rounded-md border border-lamp bg-surface-2 px-3"
                    : "min-h-11 min-w-11 rounded-md border border-line bg-surface px-3"
                }
              >
                {key.id}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {info.chords.map((chord, index) => (
              <button
                key={chord.name}
                type="button"
                onClick={() => {
                  engine.current?.stopChords();
                  engine.current?.strum(chord.freqs);
                }}
                className={
                  snap.chords && snap.chordIndex === index
                    ? "min-h-16 rounded-md border border-lamp bg-surface-2 font-display text-2xl"
                    : "min-h-16 rounded-md border border-line bg-surface font-display text-2xl"
                }
              >
                {chord.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">Ett grep per takt. {song.bpm} slag.</p>
          <Button
            className="mt-3 w-full"
            onClick={() =>
              snap.chords
                ? engine.current?.stopChords()
                : engine.current?.loopChords(
                    info.chords.map((chord) => chord.freqs),
                    song.bpm,
                  )
            }
          >
            {snap.chords ? "Stopp runden" : "Spill runden"}
          </Button>
          <h3 className="mt-6 text-sm font-medium">Andre grep</h3>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {others.map((chord) => (
              <button
                key={chord.name}
                type="button"
                onClick={() => {
                  engine.current?.stopChords();
                  engine.current?.strum(chord.freqs);
                }}
                className="min-h-12 rounded-md border border-line bg-surface font-display text-lg"
              >
                {chord.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-1.5">
            {STRINGS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={stringId === item.id}
                aria-label={`${item.name}-streng${hearing === item.id ? ", referansetone på" : ""}`}
                onClick={() => hearString(item.id)}
                className={
                  stringId === item.id
                    ? "flex min-h-16 flex-col items-center justify-center rounded-md border border-lamp bg-surface-2"
                    : "flex min-h-16 flex-col items-center justify-center rounded-md border border-line bg-surface"
                }
              >
                <span className="font-display text-xl">{item.name}</span>
                {hearing === item.id || item.id === "E2" || item.id === "E4" ? (
                  <span className={`text-[10px] ${hearing === item.id ? "text-lamp" : "text-muted"}`}>
                    {hearing === item.id ? "lyd" : item.id === "E2" ? "lav" : "lys"}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">Trykk en streng for å høre den. Trykk igjen for å slå den av.</p>
          <div className="relative mt-5 h-3 rounded-full bg-surface">
            <span className="absolute top-0 left-1/2 h-3 w-px bg-lamp" />
            {cents !== null ? (
              <span
                className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${inTune ? "bg-lamp" : "bg-signal"}`}
                style={{ left: `${50 + Math.max(-50, Math.min(50, cents))}%` }}
              />
            ) : null}
          </div>
          <p className="mt-3 font-display text-4xl">
            {snap.listening ? (snap.note ?? "…") : target.name}{" "}
            <span className="text-lg text-muted">{cents === null ? "" : `${cents > 0 ? "+" : ""}${cents} cent`}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{tuneText}</p>
          <Button
            className="mt-4"
            variant={snap.listening ? "quiet" : "primary"}
            onClick={() => (snap.listening ? engine.current?.stopListen() : void engine.current?.startListen())}
          >
            {snap.listening ? "Slutt å lytte" : "Lytt til strengen"}
          </Button>
        </>
      )}
    </section>
  );
}

function LyricsPanel({ song, snap }: Common) {
  const setLyrics = useStudio((state) => state.setLyrics);
  const moving = snap.playing || snap.recording;
  return (
    <section>
      <PanelHead
        title="Tekst"
        lede="Skriv som du vil. Vers og refreng kan stå som overskrifter. Når lyden går, blir linjen som synges cyan. Grepene ligger i båndet under."
      />
      <textarea
        value={song.lyrics}
        onChange={(event) => setLyrics(song.id, event.target.value)}
        rows={8}
        aria-label="Tekst"
        className="w-full rounded-md border border-line px-4 py-3 font-display text-xl leading-snug"
      />
      <LyricRead song={song} position={snap.position} active={moving} />
      <ChordBand song={song} position={snap.position} active={moving} />
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
                    {take.note ? <p className="mb-2 text-sm text-muted">{take.note}</p> : null}
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
      <PanelHead title="Klipp" lede="Kutt stillhet i endene. Fade inn og fade ut gjør starten og slutten myk." />
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
          <Slider
            label="Fade inn"
            min={0}
            max={Math.max(0, Math.min(4, (take.duration - track.trimStart - track.trimEnd) / 2))}
            step={0.1}
            value={track.fadeIn ?? 0}
            display={formatTime(track.fadeIn ?? 0)}
            onChange={(value) => patchTrack(song.id, track.id, { fadeIn: value })}
          />
          <Slider
            label="Fade ut"
            min={0}
            max={Math.max(0, Math.min(4, (take.duration - track.trimStart - track.trimEnd) / 2))}
            step={0.1}
            value={track.fadeOut ?? 0}
            display={formatTime(track.fadeOut ?? 0)}
            onChange={(value) => patchTrack(song.id, track.id, { fadeOut: value })}
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
              max={150}
              value={Math.round(track.volume * 100)}
              display={String(Math.round(track.volume * 100))}
              onChange={(value) => patchTrack(song.id, track.id, { volume: value / 100 })}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="quiet"
                onClick={() => {
                  const take = activeTake(track);
                  if (!take || take.peak < 0.01) return;
                  const volume = Math.min(1.5, Math.max(0.05, 0.5 / take.peak));
                  patchTrack(song.id, track.id, { volume });
                }}
              >
                Løft til -6
              </Button>
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
      <PanelHead title="Romklang" lede="Tale til YouTube skal være tørr og nær. Sang tåler mer. For mye rom er når ordene henger igjen etter at du stopper." />
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
      <PanelHead
        title="Ferdig lyd"
        lede="Et lett løft: litt bunn vekk, litt jevnere topper. Det redder ikke et dårlig opptak. Tung kompresjon, støyfjerning og romklang hører ikke hjemme her."
      />
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
  const { formats, id, setId, format } = useSaveFormats("audio");

  async function render() {
    const engineRef = engine.current;
    if (!engineRef) return null;
    return engineRef.renderBuffer(song);
  }

  async function saveWav() {
    setBusy(true);
    setMessage(null);
    try {
      const buffer = await render();
      if (!buffer) return;
      const wav = audioFormats().find((item) => item.id === "wav");
      if (!wav) return;
      const blob = await encodeAudio(buffer, wav);
      downloadBlob(blob, `${safeName(song.title)}.wav`);
      setMessage("WAV, urørt. Denne er til å jobbe videre med.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage WAV.");
    } finally {
      setBusy(false);
    }
  }

  async function saveYoutube() {
    setBusy(true);
    setMessage(null);
    try {
      const buffer = await render();
      if (!buffer) return;
      const shaped = shapeForYoutube(buffer);
      const mp3 = audioFormats().find((item) => item.id === "mp3");
      if (!mp3) return;
      const blob = await encodeAudio(shaped.buffer, mp3);
      downloadBlob(blob, `${safeName(song.title)}-youtube.mp3`);
      setMessage(shaped.note);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kunne ikke lage MP3.");
    } finally {
      setBusy(false);
    }
  }

  async function makeFile(): Promise<File | null> {
    const engineRef = engine.current;
    if (!engineRef || !format) return null;
    setBusy(true);
    setMessage(null);
    try {
      const buffer = await engineRef.renderBuffer(song);
      const blob = await encodeAudio(buffer, format);
      return new File([blob], `${safeName(song.title)}.${format.ext}`, { type: blob.type || format.mime });
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
    downloadBlob(file, file.name);
    setMessage(`Lydfilen er lastet ned som ${format?.label ?? "fil"}. Uten loudness-justering.`);
  }

  async function share() {
    const file = await makeFile();
    if (!file) return;
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: song.title });
      return;
    }
    downloadBlob(file, file.name);
    setMessage("Deling fra nettleseren finnes ikke her. Filen ble lastet ned i stedet.");
  }

  return (
    <section>
      <PanelHead
        title="Lagre og del"
        lede="WAV er arbeidsfilen, urørt. YouTube-MP3 løftes mot omtrent -14 LUFS, og toppen holdes under -1. MP3 er 320 kbps."
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void saveWav()} disabled={busy}>
          {busy ? "Gjør klar…" : "Lagre WAV"}
        </Button>
        <Button variant="quiet" onClick={() => void saveYoutube()} disabled={busy}>
          Lagre for YouTube
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted">Andre formater, uten loudness-justering. M4A vises hvis nettleseren kan skrive den.</p>
      <div className="mt-3">
        <FormatPick formats={formats} value={id} onChange={setId} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="quiet" onClick={() => void download()} disabled={busy || !format}>
          {busy ? "Gjør klar…" : `Last ned ${format?.label ?? "lyd"}`}
        </Button>
        <Button variant="ghost" onClick={() => void share()} disabled={busy || !format}>
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
