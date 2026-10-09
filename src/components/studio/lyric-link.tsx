import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useP2PRoom, type PeerInfo } from "@/lib/multiplayer";
import type { EngineSnap } from "@/lib/studio/audio";
import { lyricIndex, lyricLines } from "@/lib/studio/lyrics";
import type { Song } from "@/lib/studio/types";
import { Button } from "@/components/ui/button";
import { PanelHead } from "./bits";
import { Logo } from "./mark";
import { Prompter } from "./prompter";

export type LyricCue = {
  lead: true;
  title: string;
  lines: string[];
  index: number;
  playing: boolean;
};

type LinkValue = {
  code: string;
  joined: boolean;
  peers: PeerInfo[];
  lines: string[];
  index: number;
  playing: boolean;
};

const Ctx = createContext<LinkValue | null>(null);

export function roomId(code: string): string {
  return `lv-${code}`;
}

export function LyricLink({ song, snap, children }: { song: Song; snap: EngineSnap; children: ReactNode }) {
  const code = song.roomCode || "VENT";
  const p2p = useP2PRoom({ room: roomId(code), name: "Leder" });
  const lines = lyricLines(song.lyrics);
  const index = lyricIndex(song, snap.position);
  const playing = snap.playing || snap.recording;
  const cue = useRef<LyricCue>({ lead: true, title: song.title, lines, index, playing });
  cue.current = { lead: true, title: song.title || "Uten navn", lines, index, playing };

  useEffect(() => {
    let last = 0;
    let frame = 0;
    const loop = (now: number) => {
      if (now - last >= 120) {
        p2p.broadcast(cue.current);
        last = now;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [p2p.broadcast]);

  const value: LinkValue = {
    code,
    joined: p2p.joined,
    peers: p2p.peers,
    lines,
    index,
    playing,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLyricLink(): LinkValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("Teksten er ikke knyttet.");
  return value;
}

export function isLyricCue(data: unknown): data is LyricCue {
  if (!data || typeof data !== "object") return false;
  const cue = data as Partial<LyricCue>;
  return cue.lead === true && Array.isArray(cue.lines) && typeof cue.index === "number";
}

export function SammenPanel({ song }: { song: Song }) {
  const link = useLyricLink();
  const [note, setNote] = useState<string | null>(null);
  const withUs = link.peers.filter((peer) => peer.connectionState === "connected");
  const waiting = link.peers.filter((peer) => peer.connectionState !== "connected" && !peer.connectionState.includes("fail"));

  async function share() {
    const url = `${window.location.origin}/sammen/${link.code}`;
    const text = `Kode ${link.code}. Teksten går av seg selv.`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    try {
      if (nav.share) {
        await nav.share({ title: song.title || "ThorSound", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setNote("Lenken er kopiert.");
    } catch {
      setNote(url);
    }
  }

  return (
    <section>
      <PanelHead
        title="Sammen"
        lede="Si koden. De andre skriver den på forsiden. Når du spiller, går teksten av seg selv. De slipper å løpe etter den."
      />
      <p className="code-mark font-display text-5xl text-lamp">{link.code}</p>
      <p className="mt-2 text-sm text-muted">
        {link.joined ? "Klar til å følge." : "Kobler sammen…"}
        {withUs.length > 0 ? ` ${withUs.map((peer) => peer.name || "Med").join(", ")} er med.` : " Ingen andre ennå."}
        {waiting.length > 0 ? " Noen er på vei inn." : ""}
      </p>
      <div className="mt-3">
        <Button variant="quiet" onClick={() => void share()}>
          Del koden
        </Button>
      </div>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
      <div className="mt-4">
        <Prompter lines={link.lines} index={link.playing ? link.index : link.index} />
      </div>
      <p className="mt-3 text-sm text-muted">Trykk spill nederst. Teksten følger låten.</p>
    </section>
  );
}

export function FollowScreen({ code }: { code: string }) {
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const [name, setName] = useState("");
  const [go, setGo] = useState(false);
  if (!/^[A-Z0-9]{4}$/.test(clean)) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-3xl px-5 pt-8">
        <Link to="/" className="text-sm text-muted">
          Til forsiden
        </Link>
        <h1 className="mt-4 font-display text-4xl">Koden er fire tegn</h1>
      </main>
    );
  }
  if (!go) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-8">
        <Link to="/" className="inline-flex min-h-11 items-center text-sm text-muted">
          Til forsiden
        </Link>
        <div className="mt-6">
          <Logo />
        </div>
        <p className="code-mark mt-6 font-display text-5xl text-lamp">{clean}</p>
        <h1 className="mt-4 font-display text-4xl">Hva heter du?</h1>
        <p className="mt-2 text-muted">Den som spiller ser navnet. Teksten går av seg selv etterpå.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setGo(true);
          }}
        >
          <input
            aria-label="Navnet ditt"
            value={name}
            onChange={(event) => setName(event.target.value.slice(0, 24))}
            className="w-full min-h-14 rounded-md border border-line bg-surface px-4 text-xl"
            placeholder="For eksempel Mamma"
          />
          <Button size="lg" className="w-full" type="submit">
            Se teksten
          </Button>
        </form>
      </main>
    );
  }
  return <FollowerRoom code={clean} name={name.trim() || "Med"} />;
}

function FollowerRoom({ code, name }: { code: string; name: string }) {
  const p2p = useP2PRoom({ room: roomId(code), name });
  const [cue, setCue] = useState<LyricCue | null>(null);
  useEffect(
    () =>
      p2p.onMessage((_from, data) => {
        if (isLyricCue(data)) setCue(data);
      }),
    [p2p.onMessage],
  );
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-5 pb-8">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="inline-flex min-h-11 items-center text-sm text-muted">
          Ut
        </Link>
        <p className="code-mark text-sm text-lamp">{code}</p>
      </div>
      <h1 className="mt-2 font-display text-3xl">{cue?.title || "Venter på teksten"}</h1>
      <p className="mt-1 text-sm text-muted">
        {!p2p.joined ? "Kobler sammen…" : cue ? "Teksten følger den som spiller. Du trenger ikke trykke." : "Be den som har sangen trykke spill."}
      </p>
      <div className="mt-4">
        <Prompter lines={cue?.lines ?? ["Venter…"]} index={cue?.playing ? cue.index : (cue?.index ?? 0)} />
      </div>
    </main>
  );
}
