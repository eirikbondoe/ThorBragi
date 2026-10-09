import { createFileRoute } from "@tanstack/react-router";
import { formatTranscript, type SttBody } from "@/lib/studio/transcript";

async function transcribe({ request }: { request: Request }) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return Response.json({ ok: false, error: "Teksten er ikke tilgjengelig her." }, { status: 503 });
  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Mangler lyd." }, { status: 400 });
  }
  const file = incoming.get("file");
  if (!(file instanceof File)) return Response.json({ ok: false, error: "Mangler lyd." }, { status: 400 });
  if (file.size > 40 * 1024 * 1024) return Response.json({ ok: false, error: "Filen er for stor." }, { status: 400 });
  const body = new FormData();
  body.append("language", "nb");
  body.append("format", "true");
  body.append("diarize", "true");
  body.append("file", file, "tale.wav");
  const res = await fetch("https://api.x.ai/v1/stt", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body,
  });
  if (!res.ok) return Response.json({ ok: false, error: "Fikk ikke skrevet teksten." }, { status: 502 });
  const data = (await res.json()) as SttBody;
  const text = formatTranscript(data);
  if (!text) return Response.json({ ok: false, error: "Jeg hørte ingen ord." }, { status: 422 });
  return Response.json({ ok: true, text });
}

export const Route = createFileRoute("/api/transcribe")({
  server: { handlers: { POST: transcribe } },
});
