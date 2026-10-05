import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { JobId } from "@/lib/studio/types";
import { PanelHead } from "./bits";

const STEPS: { title: string; text: string; job?: JobId; action?: string }[] = [
  {
    title: "Headset før alt annet",
    text: "Kabel i telefonen, øreproppene i ørene. Høyttaleren har anstrengelsesastma og havner på opptaket hvis den er på.",
  },
  {
    title: "Mikrofonen på telefonen",
    text: "Den sitter som regel i bunnen. Pek den mot munnen, ikke mot lomma. Når nettleseren spør, si ja til mikrofon.",
    job: "monitor",
    action: "Sjekk nivået",
  },
  {
    title: "En mikrofon med kabel",
    text: "Plugg den i telefonen, eller i en liten boks som igjen plugges i telefonen. Da hører appen den, ikke den tynne i bunnen.",
  },
  {
    title: "Akustisk gitar",
    text: "Gitaren mellom deg og telefonen. Mikrofonen litt nærmere munnen enn lydhullet, ellers spiser gitaren stemmen.",
  },
  {
    title: "Gitar med kabel",
    text: "Elektrisk gitar rett i telefonen virker nesten aldri. Bruk et lite lydkort med USB. Det dukker opp som mikrofon.",
  },
  {
    title: "Bluetooth",
    text: "Fint til å høre på. Dårlig til å ta opp. Det kommer seint, og mikrofonen i headsettet blir ofte tynn. Bruk kabel når du tar opp.",
  },
  {
    title: "To stykker",
    text: "Én telefon tar opp. Den andre får koden og ser teksten. Bluetooth sender ikke opptaket mellom dem.",
    job: "sammen",
    action: "Åpne sammen",
  },
  {
    title: "Så tar du opp",
    text: "Nivået skal danse i midten, ikke ligge dødt og ikke slå i taket. Fire slag, så er du i gang.",
    job: "opptak",
    action: "Ta opp",
  },
];

export function GearGuide({ go, titled = true }: { go?: (job: JobId) => void; titled?: boolean }) {
  const [done, setDone] = useState<boolean[]>(() => STEPS.map(() => false));
  const finished = done.filter(Boolean).length;

  return (
    <section>
      {titled ? (
        <PanelHead
          title="Koble utstyr"
          lede="Åtte steg. Du trenger ikke en mikser. Du trenger kabel, og å peke mikrofonen riktig vei."
        />
      ) : (
        <p className="text-muted">Åtte steg. Kabel, ikke bluetooth, når du tar opp.</p>
      )}
      <p className="mb-3 text-sm text-muted tabular-nums">
        {finished} av {STEPS.length} gjort
      </p>
      <ol className="divide-y divide-line border-y border-line">
        {STEPS.map((step, index) => (
          <li key={step.title} className="py-4">
            <button
              type="button"
              aria-pressed={done[index]}
              onClick={() =>
                setDone((current) => current.map((item, itemIndex) => (itemIndex === index ? !item : item)))
              }
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={
                  done[index]
                    ? "mt-0.5 flex size-7 shrink-0 items-center justify-center bg-fg text-xs text-ink"
                    : "mt-0.5 flex size-7 shrink-0 items-center justify-center border border-line text-xs"
                }
              >
                {index + 1}
              </span>
              <span>
                <span className={done[index] ? "block font-medium text-muted line-through" : "block font-medium"}>
                  {step.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{step.text}</span>
              </span>
            </button>
            {step.job && go ? (
              <Button className="mt-3" variant="quiet" onClick={() => go(step.job!)}>
                {step.action}
              </Button>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
