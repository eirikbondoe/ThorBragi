import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  closestGuide,
  FAULTS,
  GOALS,
  GUIDES,
  KIND_LABEL,
  loadOwned,
  loadTrials,
  matchGuides,
  PIECES,
  pieceById,
  saveOwned,
  saveTrial,
  type GearKind,
  type Goal,
  type Guide,
  type Trial,
} from "@/lib/studio/rig";
import type { JobId } from "@/lib/studio/types";

type View = "home" | "katalog" | "guider" | "bygger" | "feil" | "guide" | "prove";

const ORDER: GearKind[] = ["vert", "mikrofon", "lydkort", "mikser", "kamera", "adapter", "hodetelefon"];

export function Rig({ footer, go }: { footer?: ReactNode; go?: (job: JobId) => void }) {
  const [view, setView] = useState<View>("home");
  const [kind, setKind] = useState<GearKind | "alle">("alle");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [owned, setOwned] = useState<string[]>([]);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [built, setBuilt] = useState(false);
  const [faultId, setFaultId] = useState<string | null>(null);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [gearNote, setGearNote] = useState("");
  const [stepNote, setStepNote] = useState("");
  const [what, setWhat] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setOwned(loadOwned());
    setTrials(loadTrials());
  }, []);

  function openGuide(next: Guide) {
    setGuide(next);
    setView("guide");
    setSaved("");
    setStepNote(next.steps[0]?.title ?? "");
  }

  function toggle(id: string) {
    setOwned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      saveOwned(next);
      return next;
    });
  }

  function back() {
    setBuilt(false);
    setFaultId(null);
    setView("home");
  }

  if (view === "guide" && guide) {
    return (
      <section>
        <Back onClick={back} label="Tilbake" />
        <h2 className="font-display text-3xl">{guide.title}</h2>
        <p className="mt-2 text-sm text-muted">{guide.result}</p>
        <ol className="step-list mt-4 divide-y divide-line border-y border-line">
          {guide.steps.map((step) => (
            <li key={step.title} className="py-4">
              <p className="font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        {go ? (
          <Button className="mt-4" onClick={() => go("opptak")}>
            Lyden virker. Ta opp
          </Button>
        ) : null}
        <Button className="mt-3" variant="quiet" onClick={() => setView("prove")}>
          Jeg prøvde dette med mitt utstyr
        </Button>
      </section>
    );
  }

  if (view === "prove" && guide) {
    const mine = trials.filter((trial) => trial.guideId === guide.id);
    return (
      <section>
        <Back onClick={() => setView("guide")} label="Tilbake til oppskriften" />
        <h2 className="font-display text-3xl">Prøv med ditt utstyr</h2>
        <p className="mt-2 text-sm text-muted">Skriv hva du faktisk hadde, og hvor det stoppet. Notatet blir liggende på denne telefonen.</p>
        <label className="mt-4 block text-sm">
          Utstyret jeg brukte
          <input
            value={gearNote}
            onChange={(event) => setGearNote(event.target.value)}
            className="mt-1 w-full min-h-11 rounded-md border border-line bg-surface px-3"
          />
        </label>
        <label className="mt-3 block text-sm">
          Steget som stoppet
          <select
            value={stepNote}
            onChange={(event) => setStepNote(event.target.value)}
            className="mt-1 w-full min-h-11 rounded-md border border-line bg-surface px-3"
          >
            <option value="Ingen. Det virket.">Ingen. Det virket.</option>
            {guide.steps.map((step) => (
              <option key={step.title}>{step.title}</option>
            ))}
          </select>
        </label>
        <label className="mt-3 block text-sm">
          Hva som skjedde
          <textarea
            value={what}
            onChange={(event) => setWhat(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2"
          />
        </label>
        <Button
          className="mt-3"
          disabled={!gearNote.trim()}
          onClick={() => {
            const next = saveTrial({
              id: crypto.randomUUID(),
              guideId: guide.id,
              gear: gearNote.trim(),
              step: stepNote || "Ingen. Det virket.",
              note: what.trim(),
              at: Date.now(),
            });
            setTrials(next);
            setSaved("Notatet er lagret på denne telefonen.");
            setWhat("");
          }}
        >
          Lagre notatet
        </Button>
        {saved ? <p className="mt-3 text-sm text-muted">{saved}</p> : null}
        {mine.length ? (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {mine.map((trial) => (
              <li key={trial.id} className="py-3 text-sm">
                <p className="font-medium">{trial.gear}</p>
                <p className="mt-1 text-muted">{trial.step}</p>
                {trial.note ? <p className="mt-1">{trial.note}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  if (view === "katalog") {
    const list = PIECES.filter((piece) => kind === "alle" || piece.kind === kind);
    return (
      <section>
        <Back onClick={back} label="Tilbake" />
        <h2 className="font-display text-3xl">Utstyr</h2>
        <p className="mt-2 text-sm text-muted">Dette er typer, ikke en butikk. Samme type kobles på samme måte.</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Filter onClick={() => setKind("alle")} on={kind === "alle"} label="Alle" />
          {ORDER.map((id) => (
            <Filter key={id} onClick={() => setKind(id)} on={kind === id} label={KIND_LABEL[id]} />
          ))}
        </div>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {list.map((piece) => (
            <li key={piece.id} className="py-4">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">{KIND_LABEL[piece.kind]}</p>
              <p className="mt-1 font-medium">{piece.name}</p>
              <p className="mt-1 text-sm">{piece.into}</p>
              <p className="mt-1 text-sm text-muted">{piece.note}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (view === "guider") {
    return (
      <section>
        <Back onClick={back} label="Tilbake" />
        <h2 className="font-display text-3xl">Oppsett</h2>
        <p className="mt-2 text-sm text-muted">Ett oppsett om gangen. Følg stegene i rekkefølge.</p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {GUIDES.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => openGuide(item)} className="w-full py-4 text-left">
                <span className="block font-medium">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.result}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (view === "feil") {
    const fault = FAULTS.find((item) => item.id === faultId) ?? null;
    return (
      <section>
        <Back onClick={() => (fault ? setFaultId(null) : back())} label="Tilbake" />
        {fault ? (
          <>
            <h2 className="font-display text-3xl">{fault.title}</h2>
            <p className="mt-2 text-sm text-muted">{fault.signs}</p>
            <ol className="step-list mt-4 divide-y divide-line border-y border-line">
              {fault.checks.map((check) => (
                <li key={check} className="py-4">
                  <p className="text-sm">{check}</p>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl">Noe virker ikke</h2>
            <p className="mt-2 text-sm text-muted">Velg det som ligner. Sjekk ett punkt, så det neste.</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {FAULTS.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setFaultId(item.id)} className="w-full py-4 text-left">
                    <span className="block font-medium">{item.title}</span>
                    <span className="mt-1 block text-sm text-muted">{item.signs}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    );
  }

  if (view === "bygger") {
    const found = goal ? matchGuides(goal, owned) : [];
    const near = goal && built && found.length === 0 ? closestGuide(goal, owned) : null;
    return (
      <section>
        <Back onClick={back} label="Tilbake" />
        <h2 className="font-display text-3xl">Lag oppsett</h2>
        <p className="mt-2 text-sm text-muted">Først hva du vil få til. Så hva du har. Så en oppskrift.</p>
        <h3 className="mt-5 text-sm font-medium">1. Hva vil du få til?</h3>
        <div className="mt-2 grid gap-2">
          {GOALS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={goal === item.id}
              onClick={() => {
                setGoal(item.id);
                setBuilt(false);
              }}
              className={
                goal === item.id
                  ? "rounded-md border border-lamp bg-surface-2 px-4 py-3 text-left"
                  : "rounded-md border border-line bg-surface px-4 py-3 text-left"
              }
            >
              <span className="block font-medium">{item.label}</span>
              <span className="mt-1 block text-sm text-muted">{item.text}</span>
            </button>
          ))}
        </div>
        <h3 className="mt-6 text-sm font-medium">2. Hva har du?</h3>
        {ORDER.map((group) => (
          <div key={group} className="mt-4">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">{KIND_LABEL[group]}</p>
            <div className="mt-2 grid gap-2">
              {PIECES.filter((piece) => piece.kind === group).map((piece) => {
                const on = owned.includes(piece.id);
                return (
                  <button
                    key={piece.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(piece.id)}
                    className={
                      on
                        ? "min-h-11 rounded-md border border-lamp bg-surface-2 px-3 text-left text-sm"
                        : "min-h-11 rounded-md border border-line bg-surface px-3 text-left text-sm"
                    }
                  >
                    {piece.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <Button className="mt-5 w-full" disabled={!goal} onClick={() => setBuilt(true)}>
          Vis oppskriften
        </Button>
        {built && found[0] ? (
          <div className="mt-4 rounded-md border border-line bg-raised p-4">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">Dette passer</p>
            <p className="mt-1 font-medium">{found[0].title}</p>
            <p className="mt-1 text-sm text-muted">{found[0].result}</p>
            <Button className="mt-3" onClick={() => openGuide(found[0]!)}>
              Åpne stegene
            </Button>
          </div>
        ) : null}
        {built && near && near.missing.length > 0 ? (
          <div className="mt-4 rounded-md border border-line bg-raised p-4">
            <p className="font-medium">Ingen ferdig oppskrift med akkurat det du huket av.</p>
            <p className="mt-2 text-sm text-muted">
              Nærmest er {near.guide.title}. Du mangler{" "}
              {near.missing.map((id) => pieceById(id)?.name ?? id).join(", ")}.
            </p>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section>
      <p className="text-sm text-muted">Fra utstyret du har, til lyd som virker.</p>
      <div className="signal-path mt-4" aria-hidden="true">
        <svg viewBox="0 0 360 36" className="h-9 w-full">
          <path className="signal-track" d="M18 18 H342" />
          <path className="signal-live" d="M18 18 H342" />
          <circle className="signal-node" cx="18" cy="18" r="6" />
          <circle className="signal-node" cx="126" cy="18" r="6" />
          <circle className="signal-node" cx="234" cy="18" r="6" />
          <circle className="signal-node" cx="342" cy="18" r="6" />
        </svg>
        <div className="grid grid-cols-4 text-center text-xs text-muted">
          <span>Utstyr</span>
          <span>Kabel</span>
          <span>App</span>
          <span>Lyd</span>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <Button size="lg" className="w-full" onClick={() => setView("bygger")}>
          Lag et oppsett
        </Button>
        <Button variant="quiet" onClick={() => setView("guider")}>
          Ferdige oppsett
        </Button>
        <Button variant="quiet" onClick={() => setView("katalog")}>
          Utstyrskatalog
        </Button>
        <Button variant="quiet" onClick={() => setView("feil")}>
          Noe virker ikke
        </Button>
      </div>
      {footer}
    </section>
  );
}

function Back({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="mb-3 inline-flex min-h-11 items-center gap-1 text-sm text-muted">
      <ChevronLeft className="size-4" aria-hidden />
      {label}
    </button>
  );
}

function Filter({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={
        on
          ? "min-h-11 shrink-0 rounded-md border border-lamp bg-surface-2 px-3 text-sm"
          : "min-h-11 shrink-0 rounded-md border border-line bg-surface px-3 text-sm"
      }
    >
      {label}
    </button>
  );
}
