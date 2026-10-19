import { useState } from "react";
import { Button } from "@/components/ui/button";
import { consult, type Ask, type Move } from "@/lib/studio/advisor";
import { useStudio } from "@/lib/studio/store";
import type { JobId, Song, Track, Trick } from "@/lib/studio/types";
import { Choices, PanelHead, TrackChips } from "./bits";

const ASKS: { id: Ask; label: string }[] = [
  { id: "hor", label: "Hva hører du?" },
  { id: "frekk", label: "Gjør den frekkere" },
  { id: "klar", label: "Klar for å legge ut?" },
  { id: "prov", label: "Gi meg noe å prøve" },
];

export function applyMove(song: Song, move: Move, go?: (job: JobId) => void) {
  const { patchTrack, setDrums, setMaster } = useStudio.getState();
  if (move.drums) setDrums(song.id, move.drums);
  if (move.master) setMaster(song.id, move.master);
  const patch: Partial<Track> = {};
  if (move.trick) patch.trick = move.trick;
  if (move.room) patch.room = move.room;
  if (move.echo) patch.echo = move.echo;
  if (move.tone) patch.tone = move.tone;
  if (typeof move.twin === "number") patch.twin = move.twin;
  if (typeof move.even === "number") patch.even = move.even;
  if (Object.keys(patch).length > 0) {
    for (const track of song.tracks) patchTrack(song.id, track.id, patch);
  }
  if (move.job && go) go(move.job);
}

export function AdvisorPanel({ song, go }: { song: Song; go: (job: JobId) => void }) {
  const [ask, setAsk] = useState<Ask>("hor");
  const [shown, setShown] = useState(false);
  const answer = consult(song, ask);

  return (
    <section>
      <PanelHead
        title="Rådgiveren"
        lede="ThorBragi hører på det som ligger i låten og sier ifra. Han sitter i telefonen. Ingenting sendes ut."
      />
      <div className="grid gap-2">
        {ASKS.map((item) => (
          <Button
            key={item.id}
            variant={shown && ask === item.id ? "primary" : "quiet"}
            onClick={() => {
              setAsk(item.id);
              setShown(true);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {shown ? (
        <div className="mt-5 border-l-2 border-lamp pl-4">
          <p className="text-xs font-medium tracking-widest text-lamp uppercase">ThorBragi sier</p>
          <p className="mt-2 text-lg leading-snug">{answer.text}</p>
          {answer.moves.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {answer.moves.map((move) => (
                <Button key={move.id} variant="quiet" onClick={() => applyMove(song, move, go)}>
                  {move.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 text-muted">Spør ham. Han svarer ut fra denne låten, ikke ut fra en generell tale.</p>
      )}
    </section>
  );
}

export function TryPanel({
  song,
  focusId,
  setFocusId,
}: {
  song: Song;
  focusId: string | null;
  setFocusId: (id: string) => void;
}) {
  const patchTrack = useStudio((state) => state.patchTrack);
  const track = song.tracks.find((item) => item.id === focusId) ?? song.tracks[0] ?? null;
  const ideas = consult(song, "prov").moves;

  return (
    <section>
      <PanelHead
        title="Prøv noe"
        lede="Ett trykk, så hører du det. Telefon, kor eller robot. Angre er det samme trykket en gang til, på Ingen."
      />
      {track ? (
        <>
          <TrackChips song={song} trackId={track.id} onPick={setFocusId} />
          <Choices
            label={track.name}
            value={track.trick ?? "ingen"}
            onChange={(trick) => patchTrack(song.id, track.id, { trick: trick as Trick })}
            options={[
              { id: "ingen", label: "Ingen", text: "Slik sporet er, uten påfunn" },
              { id: "telefon", label: "Telefon", text: "Smalt og nært, som et anrop fra banen" },
              { id: "kor", label: "Kor", text: "Deg, litt sein, så det blir bredt" },
              { id: "robot", label: "Robot", text: "En metallisk pust under stemmen" },
            ]}
          />
        </>
      ) : (
        <p className="text-muted">Ta opp noe først. Trommene under kan du likevel vekke.</p>
      )}
      <h3 className="mt-6 text-lg">Hele stemningen</h3>
      <p className="mt-1 text-sm text-muted">Disse rører alle sporene, pluss rytme og ferdig lyd.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ideas.map((move) => (
          <Button key={move.id} variant="quiet" onClick={() => applyMove(song, move)}>
            {move.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
