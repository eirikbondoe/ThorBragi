import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hydrateStudio, songDuration, useStudio } from "@/lib/studio/store";
import { formatTime, whenLabel } from "./bits";
import { Rig } from "./rig-screen";
import { Shell } from "./shell";

export function HomeScreen() {
  const [ready, setReady] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
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

  return (
    <Shell>
      <main className="flex flex-1 flex-col px-5 pb-10">
        <Rig
          footer={
            <section className="mt-8">
              <details className="rounded-md border border-line bg-raised px-4 py-3">
                <summary className="cursor-pointer font-medium">Om appen</summary>
                <div className="mt-3 space-y-3 text-sm text-muted">
                  <p>ThorSound er et hjemmestudio i nettleseren. Du har utstyret. Appen viser hvordan det kobles, og sier ifra når lyden er sterk nok til å tas opp.</p>
                  <p>Utstyr. Du velger mikrofon, lydkort, mikser, kamera, adapter og hodetelefoner. Deretter får du en oppskrift for det oppsettet, og hjelp hvis det er stille.</p>
                  <p>Opptak. Test inngangen først. Måleren skal ligge mellom -12 og -6. Du kan telle fire slag, eller starte med en gang. Du kan ta opp flere spor, sette tempo og klikk, lage en loop, stemme, og la teksten følge sangen med akkorder under.</p>
                  <p>Etterpå. Du kan kutte endene, fade inn og ut, og løfte et spor så det sterkeste ligger rundt -6. Du kan også sette styrke, tone, jevnhet, rom og ekko. Ferdig lyd er et lett løft. Den redder ikke et dårlig opptak. Trommer passer bare hvis du spilte mot klikk. Støy i en samtale kan dempes, og talen kan skrives ut som tekst.</p>
                  <p>Lagring. WAV er urørt, til å jobbe videre med. MP3 for YouTube løftes mot omtrent -14 LUFS, og toppen holdes under -1.</p>
                  <p>Bilde og deling. Du kan ta opp video, og dele en lang film i lengder for TikTok, Instagram og Shorts. En tekstkode lar en annen synge med. OBS og videosamtale får teksten og tittelen. ThorSound sender ikke selv.</p>
                  <p>Utkast. Korte lydfiler kan bli et utkast til sang eller rap. To bilder kan bli et utkast til musikkvideo. Du hører og ser resultatet før du bruker det.</p>
                </div>
              </details>
              <details className="mt-3 rounded-md border border-line bg-raised px-4 py-3">
                <summary className="cursor-pointer font-medium">Om Thor</summary>
                <div className="mt-3 space-y-3 text-sm">
                  <p>Mich-Thor Patrick Jakkobbsen er 19 og et halvt år. Han er 163 cm og har store blonde krøller.</p>
                  <p>Han er fra Myre, men vokste opp i Alta. Foreldrene ville ikke vedkjenne seg ham. Det begynte på en sommerfest i 1990, da Rune Rudberg og Per Heimly møtte Gunvor Hals.</p>
                  <p>Etter årene i Alta, og ufrivillig tett kontakt med onkelen Rune Gregory, dro han til Trondheim på skateboard.</p>
                  <p>Han har hatt brudd i øyehulen, flere alvorlige hårbrister, forstuing, voksesmerter i ørene og anstrengelsesastma.</p>
                  <p>Trenger du noen å snakke med, er det ikke en hjelpetelefon. Setningen er en del av historien: ring Mich-Thor Patrick Jakkobbsen på telefonkiosken ved Trondheim torg, sett deg ned, og vent på elefanten.</p>
                </div>
              </details>
              <div className="mb-2 mt-8 flex items-baseline justify-between">
                <h2 className="text-xs font-medium tracking-widest text-muted uppercase">Når lyden virker</h2>
                <span className="text-xs text-muted tabular-nums">{ready ? list.length : ""}</span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Button variant="quiet" onClick={create}>
                  Ny låt
                </Button>
                <Button variant="quiet" onClick={() => setJoining((open) => !open)}>
                  Tekstkode
                </Button>
              </div>
              {joining ? (
                <form className="panel-in mb-3 space-y-3 rounded-md border border-line bg-raised p-4" onSubmit={join}>
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
              <div className="overflow-hidden rounded-md border border-line bg-raised">
            {!ready ? <p className="px-4 py-6 text-sm text-muted">Henter låtene…</p> : null}
            {ready && list.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted">Ingen låter ennå. Koble utstyret først.</p>
            ) : null}
            <ul>
              {list.map((song) => {
                const length = songDuration(song);
                return (
                  <li key={song.id} className="flex items-center border-b border-line last:border-b-0">
                    <Link to="/sang/$id" params={{ id: song.id }} className="row-link flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
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
                      <ChevronRight className="row-chevron size-4 shrink-0 text-muted" aria-hidden />
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
          }
        />
      </main>
    </Shell>
  );
}
