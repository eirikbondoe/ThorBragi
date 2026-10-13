//#region node_modules/.nitro/vite/services/ssr/assets/make.server-Cl2M6uaB.js
function apiKey() {
	const key = process.env.XAI_API_KEY;
	if (!key) throw new Error("AI er ikke tilgjengelig her.");
	return key;
}
async function xai(path, body) {
	const res = await fetch(`https://api.x.ai${path}`, {
		method: body ? "POST" : "GET",
		headers: {
			Authorization: `Bearer ${apiKey()}`,
			...body ? { "Content-Type": "application/json" } : {}
		},
		body: body ? JSON.stringify(body) : void 0,
		signal: AbortSignal.timeout(body ? 45e3 : 15e3)
	});
	if (!res.ok) {
		let detail = "";
		try {
			const payload = await res.json();
			detail = typeof payload.error === "string" ? payload.error : payload.error?.message ?? "";
		} catch {
			detail = "";
		}
		throw new Error(detail.slice(0, 180) || "Fikk ikke svar.");
	}
	return res.json();
}
function songPrompt(note) {
	return [
		"Skriv en kort sang noen kan synge inn hjemme.",
		"Bruk språket i teksten under. Hvis det ikke er noe språk, skriv norsk.",
		"Svar bare slik, uten forklaring:",
		"TITTEL: navn",
		"TEKST:",
		"linjene, maks 16",
		"GREP:",
		"fire akkorder",
		"",
		note.trim() || "En rolig sang."
	].join("\n");
}
function parseSong(text) {
	const title = text.match(/TITTEL:\s*(.+)/i)?.[1]?.trim().slice(0, 80) || "Ny sang";
	const lyrics = text.split(/TEKST:\s*/i)[1]?.split(/GREP:\s*/i)[0]?.trim() || text.trim();
	const chords = text.split(/GREP:\s*/i)[1]?.trim().slice(0, 200) || "";
	return {
		title,
		lyrics: lyrics.slice(0, 2e3),
		chords
	};
}
function coverPrompt(note) {
	return `Forsidebilde til en sang om dette: ${(note.trim() || "et rolig hjemmeopptak").slice(0, 500)}. Ingen tekst i bildet.`;
}
async function runMake(input) {
	try {
		if (input.kind === "sang") {
			const content = [{
				type: "text",
				text: songPrompt(input.note)
			}];
			if (input.image) content.push({
				type: "image_url",
				image_url: { url: input.image }
			});
			const text = (await xai("/v1/chat/completions", {
				model: "grok-4.5",
				max_tokens: 700,
				messages: [{
					role: "user",
					content: input.image ? content : songPrompt(input.note)
				}]
			})).choices?.[0]?.message?.content ?? "";
			if (!text.trim()) return {
				ok: false,
				error: "Fikk ingen tekst."
			};
			return {
				ok: true,
				kind: "sang",
				...parseSong(text)
			};
		}
		if (input.kind === "bilde") {
			const prompt = coverPrompt(input.note);
			const first = (input.image ? await xai("/v1/images/edits", {
				model: "grok-imagine-image",
				prompt,
				response_format: "b64_json",
				image: {
					url: input.image,
					type: "image_url"
				}
			}) : await xai("/v1/images/generations", {
				model: "grok-imagine-image",
				prompt,
				n: 1,
				response_format: "b64_json"
			})).data?.[0];
			const image = first?.b64_json ? `data:image/jpeg;base64,${first.b64_json}` : first?.url ?? "";
			if (!image) return {
				ok: false,
				error: "Fikk ikke et bilde."
			};
			return {
				ok: true,
				kind: "bilde",
				image
			};
		}
		const photos = (input.images?.length ? input.images : input.image ? [input.image] : []).slice(0, 2);
		const note = input.note.trim().slice(0, 400);
		const prompt = photos.length >= 2 ? `A short vertical music video in a warm room. The person from <IMAGE_0> and the person from <IMAGE_1> play music together. Keep both faces like the photos. One sings, the other plays. Slow camera. No written text. ${note}` : `A short vertical music video in a warm room. ${note || "A person plays music."} No written text. Keep the face like the photo if one is attached.`;
		const body = await xai("/v1/videos/generations", {
			model: photos.length >= 2 ? "grok-imagine-video-1.5" : "grok-imagine-video-1.5-lite",
			prompt,
			duration: 6,
			aspect_ratio: "9:16",
			resolution: photos.length >= 2 ? "720p" : "480p",
			...photos.length >= 2 ? { reference_images: photos.map((url) => ({ url })) } : photos[0] ? { image: { url: photos[0] } } : {}
		});
		const requestId = String(body.request_id ?? "");
		if (!requestId) return {
			ok: false,
			error: "Fikk ikke startet filmen."
		};
		return {
			ok: true,
			kind: "video",
			requestId
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Fikk ikke laget det."
		};
	}
}
async function runPoll(requestId) {
	try {
		const body = await xai(`/v1/videos/${encodeURIComponent(requestId)}`);
		const status = String(body.status ?? "");
		const url = body.video?.url || String(body.url ?? "");
		if (status === "failed" || status === "expired") return {
			ok: false,
			error: "Filmen ble ikke laget."
		};
		return {
			ok: true,
			kind: "status",
			status,
			url
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Fikk ikke sjekket filmen."
		};
	}
}
async function runDj(input) {
	try {
		const lines = input.clips.map((clip, index) => `${index}. ${clip.name}: ${clip.text.slice(0, 280) || "ingen ord"}`).join("\n");
		const text = (await xai("/v1/chat/completions", {
			model: "grok-4.5",
			max_tokens: 700,
			messages: [{
				role: "user",
				content: [
					input.style === "rap" ? "Lag en kort rap." : "Lag en kort sang.",
					"Bruk språket i lydene. Hvis det ikke er noe språk, skriv norsk.",
					"Svar bare med JSON:",
					"{\"title\":\"\",\"bpm\":96,\"lyrics\":\"linje\\nlinje\",\"order\":[0,1,0]}",
					"bpm mellom 80 og 140. lyrics maks 12 linjer. order er hvilke lydnummer som kommer etter hverandre, maks 8, hver varer to takter.",
					input.note.trim() ? `Ekstra: ${input.note.trim().slice(0, 800)}` : "",
					lines
				].filter(Boolean).join("\n")
			}]
		})).choices?.[0]?.message?.content ?? "";
		if (!text.trim()) return {
			ok: false,
			error: "Fikk ingen plan."
		};
		return {
			ok: true,
			text
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Fikk ikke laget planen."
		};
	}
}
async function runSpeak(text) {
	try {
		const key = apiKey();
		const res = await fetch("https://api.x.ai/v1/tts", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				text: text.slice(0, 600),
				voice_id: "eve"
			}),
			signal: AbortSignal.timeout(45e3)
		});
		if (!res.ok) return {
			ok: false,
			error: "Fikk ikke lest teksten høyt."
		};
		if ((res.headers.get("content-type") ?? "").includes("json")) {
			const payload = await res.json();
			if (!payload.url) return {
				ok: false,
				error: "Fikk ikke lest teksten høyt."
			};
			const audio = await fetch(payload.url);
			return {
				ok: true,
				audioBase64: bytesToBase64(new Uint8Array(await audio.arrayBuffer()))
			};
		}
		const bytes = new Uint8Array(await res.arrayBuffer());
		if (bytes.length < 100) return {
			ok: false,
			error: "Stemmen ble tom."
		};
		return {
			ok: true,
			audioBase64: bytesToBase64(bytes)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Fikk ikke lest teksten høyt."
		};
	}
}
function bytesToBase64(bytes) {
	let bin = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(bin);
}
//#endregion
export { runDj, runMake, runPoll, runSpeak };
