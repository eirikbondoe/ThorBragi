/** Peak 0–1 from the input meter, as dBFS. Silence stays at -90. */
export function dbFromLinear(level: number): number {
  if (!Number.isFinite(level) || level <= 0.00001) return -90;
  return 20 * Math.log10(Math.min(1, level));
}

export type GainRead = "ingen" | "svak" | "bra" | "sterk" | "klipp";

/** Strongest moment should sit between -12 and -6 dBFS. Near 0 clips. */
export function readGain(level: number): GainRead {
  if (level < 0.02) return "ingen";
  const db = dbFromLinear(level);
  if (db >= -1) return "klipp";
  if (db > -6) return "sterk";
  if (db >= -12) return "bra";
  return "svak";
}

export function gainSentence(read: GainRead): string {
  if (read === "ingen") return "Måleren rører seg ikke.";
  if (read === "svak") return "Svakt. La det sterkeste ligge mellom -12 og -6.";
  if (read === "bra") return "Bra. Det sterkeste ligger mellom -12 og -6.";
  if (read === "sterk") return "For sterkt. Litt lenger unna, eller skru ned forsterkningen.";
  return "Det klipper. Gå unna mikrofonen før du tar opp.";
}
