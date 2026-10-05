import { useEffect, useState } from "react";

const VISIBLE = 6;
const STEP = 5;

export function Prompter({ lines, index, compact = false }: { lines: string[]; index: number; compact?: boolean }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const safe = lines.length > 0 ? lines : ["Skriv teksten først"];
  const max = Math.max(0, safe.length - 1);
  const cursor = Math.min(max, Math.max(0, index));
  const step = compact ? 3 : STEP;
  const page = Math.floor(cursor / step);
  const start = page * step;
  const shown = safe.slice(start, start + (compact ? 4 : VISIBLE));
  const local = reduce ? Math.round(cursor - start) : cursor - start;
  const current = safe[Math.min(max, Math.round(cursor))] ?? "";

  return (
    <div className={compact ? "prompter prompter-compact" : "prompter"}>
      <p className="sr-only" aria-live="polite">
        {current}
      </p>
      <div className="prompter-bar" style={{ transform: `translateY(${local * 4.75}rem)` }} aria-hidden />
      <div aria-hidden>
        {shown.map((line, row) => {
          const on = Math.abs(row - local) < 0.65;
          return (
            <p key={start + row} className={on ? "prompter-line is-on" : "prompter-line"}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
