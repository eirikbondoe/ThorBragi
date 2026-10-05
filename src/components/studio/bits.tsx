import { cn } from "@/lib/cn";
import type { Song } from "@/lib/studio/types";

export function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const rest = Math.floor(safe % 60);
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function whenLabel(ts: number): string {
  const delta = Date.now() - ts;
  if (delta < 60_000) return "nå nettopp";
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} min siden`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)} t siden`;
  return new Date(ts).toLocaleDateString("nb-NO");
}

export function PanelHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="mb-5">
      <h2 className="font-display text-3xl font-medium">{title}</h2>
      <p className="mt-2 max-w-prose text-muted">{lede}</p>
    </header>
  );
}

export function Meter({ level }: { level: number }) {
  const hot = level > 0.9;
  const width = Math.min(100, Math.round(level * 140));
  return (
    <div className="h-3 overflow-hidden rounded-full bg-raised" aria-hidden>
      <div className={cn("h-full rounded-full", hot ? "bg-signal" : "bg-lamp")} style={{ width: `${width}%` }} />
    </div>
  );
}

export function Wave({ peaks }: { peaks: number[] }) {
  return (
    <div className="flex h-14 items-end gap-px" aria-hidden>
      {peaks.map((peak, index) => (
        <span
          key={index}
          className="min-w-0 flex-1 bg-fg"
          style={{ height: `${Math.max(8, Math.round(peak * 100))}%` }}
        />
      ))}
    </div>
  );
}

export function Choices<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { id: T; label: string; text?: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div>
      {label ? <p className="mb-2 text-sm text-muted">{label}</p> : null}
      <div className="grid gap-2">
        {options.map((option) => {
          const on = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(option.id)}
              className={cn(
                "min-h-11 rounded-md border px-4 py-3 text-left",
                on ? "border-lamp bg-surface-2" : "border-line bg-surface",
              )}
            >
              <span className="block font-medium">{option.label}</span>
              {option.text ? <span className="mt-1 block text-sm text-muted">{option.text}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted">{display}</span>
      </span>
      <input
        className="studio-range w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function TrackChips({
  song,
  trackId,
  onPick,
}: {
  song: Song;
  trackId: string | null;
  onPick: (id: string) => void;
}) {
  if (song.tracks.length === 0) return <p className="text-muted">Ingen spor ennå. Gå til Ta opp.</p>;
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {song.tracks.map((track) => {
        const on = track.id === trackId;
        return (
          <button
            key={track.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(track.id)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm",
              on ? "border-lamp bg-surface-2 text-fg" : "border-line bg-surface text-fg",
            )}
          >
            {track.name}
          </button>
        );
      })}
    </div>
  );
}
