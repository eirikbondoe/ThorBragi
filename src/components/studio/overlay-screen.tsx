import { useEffect, useRef, useState } from "react";
import { useP2PRoom } from "@/lib/multiplayer";
import { isLyricCue, roomId, type LyricCue } from "./lyric-link";

export function OverlayScreen({ code }: { code: string }) {
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ren, setRen] = useState(false);
  const [camera, setCamera] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [cue, setCue] = useState<LyricCue | null>(null);
  const p2p = useP2PRoom({ room: roomId(/^[A-Z0-9]{4}$/.test(clean) ? clean : "VENT"), name: "Bilde" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const textOnly = params.get("ren") === "1";
    const withCamera = params.get("kamera") === "1";
    document.documentElement.classList.toggle("overlay-clear", textOnly || !withCamera);
    setRen(textOnly);
    setCamera(withCamera && !textOnly);
    return () => document.documentElement.classList.remove("overlay-clear");
  }, []);

  useEffect(() => {
    if (!camera) return;
    let stream: MediaStream | null = null;
    let dead = false;
    void navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((next) => {
        if (dead) {
          next.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = next;
        const el = videoRef.current;
        if (!el) return;
        el.srcObject = next;
        void el.play().catch(() => undefined);
      })
      .catch(() => {
        if (!dead) setCamError("Si ja til kameraet i nettleseren, og åpne bildet på nytt.");
      });
    return () => {
      dead = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [camera]);

  useEffect(
    () =>
      p2p.onMessage((_from, data) => {
        if (isLyricCue(data)) setCue(data);
      }),
    [p2p.onMessage],
  );

  const lines = cue?.lines ?? [];
  const line = lines[Math.min(lines.length - 1, Math.max(0, Math.round(cue?.index ?? 0)))] ?? "";
  const title = cue?.title || (p2p.joined ? "Venter på sangen" : "Kobler til…");

  return (
    <main className={camera ? "relative min-h-dvh bg-bg" : "relative min-h-dvh"}>
      {camera ? (
        <video ref={videoRef} className="mirror-x fixed inset-0 h-full w-full object-cover" playsInline muted autoPlay />
      ) : null}
      {ren ? null : (
        <button
          type="button"
          className="absolute top-4 left-4 z-10 min-h-11 rounded-full bg-bg/80 px-4 text-sm"
          onClick={() => void document.documentElement.requestFullscreen?.()}
        >
          Fullskjerm
        </button>
      )}
      {camError ? <p className="absolute inset-x-6 top-1/3 z-10 text-center text-sm">{camError}</p> : null}
      <div className="fixed inset-x-0 bottom-0 z-10 bg-bg/80 px-8 py-6">
        <p className="text-sm font-medium tracking-widest text-lamp uppercase">{title}</p>
        <p className="mt-1 font-display text-4xl leading-tight sm:text-5xl">{line || "Teksten kommer her"}</p>
      </div>
    </main>
  );
}
