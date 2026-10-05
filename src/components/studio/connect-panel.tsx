import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Song } from "@/lib/studio/types";
import { PanelHead } from "./bits";
import { useLyricLink } from "./lyric-link";

type Target = "obs" | "prism" | "samtale" | "direkte";

const TARGETS: { id: Target; label: string; text: string }[] = [
  { id: "obs", label: "OBS Studio", text: "Teksten som et gjennomsiktig lag oppå kameraet ditt." },
  { id: "prism", label: "Prism", text: "Samme lag på telefon eller PC. Prism tar skjermen og sender." },
  { id: "samtale", label: "Videosamtale", text: "Meet, Zoom eller Discord. Teksten kan ligge oppå samtalen." },
  { id: "direkte", label: "Direkte", text: "YouTube og andre. OBS eller Prism sender. Thorøisjen gjør det ikke." },
];

export function KoblePanel({ song }: { song: Song }) {
  const link = useLyricLink();
  const live = useRef(link);
  live.current = link;
  const [target, setTarget] = useState<Target>("obs");
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const wide = song.video.frame === "skjerm";
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const obsUrl = `${origin}/lag/${link.code}?ren=1`;
  const pictureUrl = `${origin}/lag/${link.code}?kamera=1`;

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setNote("Lenken er kopiert. Lim den inn i programmet.");
    } catch {
      setNote(url);
    }
  }

  async function floatText() {
    const api = (window as Window & {
      documentPictureInPicture?: { requestWindow: (opts: { width: number; height: number }) => Promise<Window> };
    }).documentPictureInPicture;
    if (!api) {
      setNote("Her kan ikke teksten flyte oppå. Del fanen i samtalen, så ser de bildet.");
      return;
    }
    const pip = await api.requestWindow({ width: 640, height: 320 });
    const body = pip.document.body;
    body.style.margin = "0";
    body.style.background = "#0a1128";
    body.style.color = "#f4efea";
    body.style.fontFamily = "sans-serif";
    body.style.height = "100vh";
    body.style.display = "flex";
    body.style.flexDirection = "column";
    body.style.justifyContent = "flex-end";
    body.style.padding = "24px";
    const title = pip.document.createElement("p");
    title.style.margin = "0";
    title.style.color = "#2ec8e6";
    title.style.letterSpacing = "0.14em";
    title.style.textTransform = "uppercase";
    title.style.fontSize = "14px";
    const line = pip.document.createElement("p");
    line.style.margin = "8px 0 0";
    line.style.fontSize = "32px";
    line.style.lineHeight = "1.15";
    body.replaceChildren(title, line);
    const timer = window.setInterval(() => {
      const now = live.current;
      const lines = now.lines;
      const index = Math.min(lines.length - 1, Math.max(0, Math.round(now.index)));
      title.textContent = song.title || "Uten navn";
      line.textContent = lines[index] ?? "";
    }, 200);
    pip.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
    setNote("Teksten ligger oppå de andre vinduene. Del fanen hvis samtalen skal se bildet.");
  }

  return (
    <section>
      <PanelHead
        title="Koble bilde"
        lede="OBS, Prism og videosamtale tar imot et bilde. Thorøisjen gir dem teksten og tittelen. Selve sendingen gjør de."
      />
      <div className="grid gap-2">
        {TARGETS.map((item) => {
          const on = target === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setTarget(item.id);
                setCopied(false);
                setNote(null);
              }}
              className={`min-h-11 rounded-md border px-4 py-3 text-left ${on ? "border-lamp bg-surface-2" : "border-line bg-surface"}`}
            >
              <span className="block font-medium">{item.label}</span>
              <span className="mt-1 block text-sm text-muted">{item.text}</span>
            </button>
          );
        })}
      </div>

      {target === "obs" ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>Åpne bildet. Si ja til kameraet. Trykk fullskjerm.</li>
          <li>I OBS: Kilder, Vindusfangst, og velg det vinduet.</li>
          <li>Har du kamera i OBS fra før, kopier tekstlaget i stedet. Nettleserkilde, {wide ? "1920 × 1080" : "1080 × 1920"}, gjennomsiktig.</li>
        </ol>
      ) : null}
      {target === "prism" ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>Åpne bildet og trykk fullskjerm.</li>
          <li>I Prism: ta skjermen, ikke bare kameraet. Da følger teksten med.</li>
        </ol>
      ) : null}
      {target === "samtale" ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>Åpne bildet. Det er det de skal se.</li>
          <li>I Meet, Zoom eller Discord: del det vinduet.</li>
          <li>Tekst oppå samtalen er til deg, så du ser ordene mens du snakker.</li>
        </ol>
      ) : null}
      {target === "direkte" ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>Koble teksten til OBS eller Prism, som over.</li>
          <li>Der velger du YouTube eller en annen kanal og trykker send.</li>
          <li>Thorøisjen ber ikke om strømmenøkkel, og sender ikke selv.</li>
        </ol>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => window.open(pictureUrl, "lydvenn-bilde", "width=1280,height=720")}>Åpne bildet</Button>
        <Button variant="quiet" onClick={() => void copy(target === "obs" ? obsUrl : pictureUrl)}>
          {copied ? "Kopiert" : target === "obs" ? "Kopier tekstlag" : "Kopier lenken"}
        </Button>
        {target === "samtale" ? (
          <Button variant="quiet" onClick={() => void floatText()}>
            Tekst oppå samtalen
          </Button>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-muted">Hold sangen åpen her, og trykk spill. Teksten i det andre programmet følger med.</p>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
    </section>
  );
}
