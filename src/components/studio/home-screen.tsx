import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hydrateStudio, songDuration, useStudio } from "@/lib/studio/store";
import { formatTime, whenLabel } from "./bits";
import { GearGuide } from "./gear-guide";
import { Shell } from "./shell";

export function HomeScreen() {
  const [ready, setReady] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [gear, setGear] = useState(false);
  const [code, setCode] = useState("");
  const songs = useStudio((state) => state.songs);
  const createSong = useStudio((state) => state.createSong);
  const deleteSong = useStudio((state) => state.deleteSong);
  const navigate = useNavigate();

  useEffect(() => {
    void hydrateStudio().then(() => setReady(true));
  }, []);

  function create() {
    const id = createSong();
    void navigate({ to: "/sang/$id", params: { id } });
  }

  function join(event: FormEvent) {
    event.preventDefault();
    const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    if (clean.length !== 4) return;
    void navigate({ to: "/sammen/$code", params: { code: clean } });
  }

  const list = ready ? [...songs].sort((a, b) => b.updatedAt - a.updatedAt) : [];
  const latest = list[0];

  return (
    <Shell>
      <main className="flex flex-1 flex-col px-5 pb-10">
        <p className="text-sm text-muted">Ett steg om gangen.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {latest ? (
            <Button
              size="lg"
              className="col-span-2"
              onClick={() => void navigate({ to: "/sang/$id", params: { id: latest.id } })}
            >
              Fortsett {latest.title || "låten"}
            </Button>
          ) : (
            <Button size="lg" className="col-span-2" onClick={create}>
              Ny låt
            </Button>
          )}
          {latest ? (
            <Button variant="quiet" onClick={create}>
              Ny låt
            </Button>
          ) : null}
          <Button variant="quiet" className={latest ? "" : "col-span-1"} onClick={() => setGear((open) => !open)}>
            {gear ? "Skjul" : "Utstyr"}
          </Button>
          <Button variant="quiet" className={latest ? "col-span-2" : ""} onClick={() => setJoining((open) => !open)}>
            Tekstkode
          </Button>
        </div>
        {gear ? (
          <div className="mt-4 rounded-md border border-line bg-raised px-4">
            <GearGuide titled={false} />
          </div>
        ) : null}
        {joining ? (
          <form className="mt-4 space-y-3 rounded-md border border-line bg-raised p-4" onSubmit={join}>
            <label className="block text-sm text-muted" htmlFor="room-code">
              Koden fra den som spiller
            </label>
            <input
              id="room-code"
              aria-label="Kode"
              value={code}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              maxLength={4}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              className="code-mark w-full min-h-14 rounded-md border border-line bg-surface text-center font-display text-4xl"
            />
            <Button size="lg" className="w-full" type="submit" disabled={code.replace(/[^A-Za-z0-9]/g, "").length !== 4}>
              Se teksten
            </Button>
          </form>
        ) : null}

        <section className="mt-8">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-xs font-medium tracking-widest text-muted uppercase">Låtene</h2>
            <span className="text-xs text-muted tabular-nums">{ready ? list.length : ""}</span>
          </div>
          <div className="overflow-hidden rounded-md border border-line bg-raised">
            {!ready ? <p className="px-4 py-6 text-sm text-muted">Henter låtene…</p> : null}
            {ready && list.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted">Ingen låter ennå. Banen er der ute. Du er her inne.</p>
            ) : null}
            <ul>
              {list.map((song) => {
                const length = songDuration(song);
                return (
                  <li key={song.id} className="flex items-center border-b border-line last:border-b-0">
                    <Link to="/sang/$id" params={{ id: song.id }} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface font-display text-sm text-crystal">
                        {song.keyName}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{song.title || "Uten navn"}</span>
                        <span className="mt-0.5 block truncate text-sm text-muted">
                          {song.bpm} slag · {song.tracks.length} spor
                          {length > 0 ? ` · ${formatTime(length)}` : ""} · {whenLabel(song.updatedAt)}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
                    </Link>
                    {confirmId === song.id ? (
                      <span className="flex shrink-0 gap-1 pr-2">
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteSong(song.id);
                            setConfirmId(null);
                          }}
                        >
                          Slett
                        </Button>
                        <Button variant="ghost" onClick={() => setConfirmId(null)}>
                          Nei
                        </Button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Slett ${song.title || "låten"}`}
                        onClick={() => setConfirmId(song.id)}
                        className="mr-2 grid size-11 shrink-0 place-items-center text-muted"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
    </Shell>
  );
}
