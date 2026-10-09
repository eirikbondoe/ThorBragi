export type SttWord = { text?: string; speaker?: string | number };
export type SttBody = { text?: string; words?: SttWord[] };

export function formatTranscript(data: SttBody) {
  const words = (data.words ?? []).filter((word) => word.text);
  const labeled = words.some((word) => word.speaker != null && word.speaker !== "");
  if (!words.length || !labeled) return (data.text ?? "").trim();
  const lines: string[] = [];
  let speaker = "";
  let line = "";
  for (const word of words) {
    const who = String(word.speaker ?? "");
    if (who !== speaker) {
      if (line) lines.push(line.trim());
      speaker = who;
      const digits = who.replace(/\D/g, "");
      const n = digits === "" ? NaN : Number(digits);
      lines.push(Number.isFinite(n) ? `Stemme ${n + 1}` : `Stemme ${who}`);
      line = word.text ?? "";
    } else {
      line += `${line ? " " : ""}${word.text ?? ""}`;
    }
  }
  if (line) lines.push(line.trim());
  return lines.join("\n");
}
