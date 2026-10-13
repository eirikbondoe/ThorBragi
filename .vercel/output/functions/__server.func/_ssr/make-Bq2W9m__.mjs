import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/make-Bq2W9m__.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function clean(input) {
	const data = input;
	const kind = data.kind === "bilde" || data.kind === "video" ? data.kind : "sang";
	const note = String(data.note ?? "").slice(0, 4e3);
	const images = (Array.isArray(data.images) ? data.images : []).filter((item) => typeof item === "string" && item.startsWith("data:image/")).slice(0, 2).map((item) => item.slice(0, 18e5));
	const image = images[0] || (typeof data.image === "string" && data.image.startsWith("data:image/") ? data.image.slice(0, 18e5) : "");
	if (!note.trim() && !image) throw new Error("Legg inn tekst eller et bilde først.");
	return {
		kind,
		note,
		image,
		images: images.length ? images : image ? [image] : []
	};
}
var startMake_createServerFn_handler = createServerRpc({
	id: "77c64d7ddd1a1ed72798c22d77bd46e3ec73335211a1d62d5d364d11c9378859",
	name: "startMake",
	filename: "src/lib/studio/make.ts"
}, (opts) => startMake.__executeServer(opts));
var startMake = createServerFn({ method: "POST" }).validator(clean).handler(startMake_createServerFn_handler, async ({ data }) => {
	const { runMake } = await import("./make.server-Cl2M6uaB.mjs");
	return runMake(data);
});
var pollMake_createServerFn_handler = createServerRpc({
	id: "de34718db53bdcc8ccff61e454e52e548a17e56e3cb13e2c2a0dfb6eb7170f3c",
	name: "pollMake",
	filename: "src/lib/studio/make.ts"
}, (opts) => pollMake.__executeServer(opts));
var pollMake = createServerFn({ method: "POST" }).validator((input) => {
	const id = String(input.requestId ?? "");
	if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) throw new Error("Ukjent film.");
	return { requestId: id };
}).handler(pollMake_createServerFn_handler, async ({ data }) => {
	const { runPoll } = await import("./make.server-Cl2M6uaB.mjs");
	return runPoll(data.requestId);
});
var planDj_createServerFn_handler = createServerRpc({
	id: "01b4a6d69cc678f50273a6165a92cfc7fea3534a829a35405e7360340ad56ab7",
	name: "planDj",
	filename: "src/lib/studio/make.ts"
}, (opts) => planDj.__executeServer(opts));
var planDj = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const style = data.style === "rap" ? "rap" : "sang";
	const cleanClips = (Array.isArray(data.clips) ? data.clips.slice(0, 4) : []).map((clip) => ({
		name: String(clip.name ?? "lyd").slice(0, 80),
		text: String(clip.text ?? "").slice(0, 300)
	}));
	if (cleanClips.length === 0) throw new Error("Last opp minst én kort lyd.");
	return {
		style,
		note: String(data.note ?? "").slice(0, 800),
		clips: cleanClips
	};
}).handler(planDj_createServerFn_handler, async ({ data }) => {
	const { runDj } = await import("./make.server-Cl2M6uaB.mjs");
	return runDj(data);
});
var speakDj_createServerFn_handler = createServerRpc({
	id: "08c68cf196b6fc6180f8573d98653d4779fb98c247bcd9143184ee4da5a4b1ba",
	name: "speakDj",
	filename: "src/lib/studio/make.ts"
}, (opts) => speakDj.__executeServer(opts));
var speakDj = createServerFn({ method: "POST" }).validator((input) => {
	const text = String(input.text ?? "").trim().slice(0, 600);
	if (text.length < 2) throw new Error("Ingen tekst å lese.");
	return { text };
}).handler(speakDj_createServerFn_handler, async ({ data }) => {
	const { runSpeak } = await import("./make.server-Cl2M6uaB.mjs");
	return runSpeak(data.text);
});
//#endregion
export { planDj_createServerFn_handler, pollMake_createServerFn_handler, speakDj_createServerFn_handler, startMake_createServerFn_handler };
