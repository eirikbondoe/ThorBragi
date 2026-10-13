import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { audioFormats, videoFormats, type SaveFormat } from "@/lib/studio/formats";

export function useSaveFormats(kind: "audio" | "video") {
  const [formats, setFormats] = useState<SaveFormat[]>(() => (kind === "audio" ? audioFormats().slice(0, 2) : []));
  const [id, setId] = useState(kind === "audio" ? "wav" : "webm");
  useEffect(() => {
    const next = kind === "audio" ? audioFormats() : videoFormats();
    setFormats(next);
    setId((current) => (next.some((format) => format.id === current) ? current : (next[0]?.id ?? current)));
  }, [kind]);
  const format = formats.find((item) => item.id === id) ?? formats[0];
  return { formats, id, setId, format };
}

export function FormatPick({
  formats,
  value,
  onChange,
}: {
  formats: SaveFormat[];
  value: string;
  onChange: (id: string) => void;
}) {
  if (formats.length === 0) return <p className="text-sm text-muted">Denne nettleseren kan ikke lage en filmfil.</p>;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filformat">
      {formats.map((format) => (
        <Button
          key={format.id}
          variant={value === format.id ? "primary" : "quiet"}
          aria-pressed={value === format.id}
          onClick={() => onChange(format.id)}
        >
          {format.label}
        </Button>
      ))}
    </div>
  );
}
