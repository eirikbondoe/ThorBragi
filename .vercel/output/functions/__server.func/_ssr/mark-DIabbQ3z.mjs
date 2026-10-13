import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mark-DIabbQ3z.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var styles = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,scale] duration-150 active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			primary: "bg-fg text-ink",
			quiet: "border border-line bg-surface text-fg",
			ghost: "bg-transparent text-muted",
			signal: "bg-signal text-signal-ink",
			danger: "border border-line bg-transparent text-signal"
		},
		size: {
			md: "min-h-11 px-4 text-sm",
			lg: "min-h-14 px-5 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(styles({
			variant,
			size
		}), className),
		...props
	});
}
var DB_NAME = "lydvenn";
var STORE = "audio";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Kunne ikke åpne lydlageret"));
	});
}
async function putAudio(id, blob) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Kunne ikke lagre lyden"));
	});
	db.close();
}
async function getAudio(id) {
	const db = await openDb();
	const blob = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Kunne ikke hente lyden"));
	});
	db.close();
	return blob;
}
async function deleteAudio(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Kunne ikke slette lyden"));
	});
	db.close();
}
function uid$1() {
	return crypto.randomUUID();
}
function video() {
	return {
		takes: [],
		activeTakeId: null,
		trimStart: 0,
		trimEnd: 0,
		look: "varm",
		frame: "telefon",
		mirror: true,
		showTitle: true,
		showLyrics: true
	};
}
function code() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	let out = "";
	for (const byte of bytes) out += alphabet[byte % 32];
	return out;
}
function track(kind, name) {
	return {
		id: uid$1(),
		kind,
		name,
		takes: [],
		activeTakeId: null,
		trimStart: 0,
		trimEnd: 0,
		fadeIn: 0,
		fadeOut: 0,
		volume: kind === "gitar" ? .78 : .9,
		muted: false,
		solo: false,
		tone: kind === "stemme" ? "varm" : "rett",
		even: kind === "stemme" ? .45 : .25,
		room: kind === "stemme" ? "stue" : "tort",
		echo: "av",
		hush: .2,
		twin: 0,
		trick: "ingen"
	};
}
function part(name, bars) {
	return {
		id: uid$1(),
		name,
		bars
	};
}
function sheet(slug, title, bpm, keyName, lyrics, sections) {
	const now = Date.now();
	return {
		id: `ovelse-${slug}`,
		title,
		bpm,
		keyName,
		click: true,
		drums: "ingen",
		lyrics,
		loop: null,
		sections,
		tracks: [track("gitar", "Gitar"), track("stemme", "Stemme")],
		master: "hjemme",
		compareDry: false,
		video: video(),
		roomCode: code(),
		outlet: null,
		updatedAt: now,
		createdAt: now
	};
}
function practiceSongs() {
	return [
		sheet("cycling-trivialities", "Cycling Trivialities", 108, "B", "Øving\nJosé González. Cycling Trivialities.\nToneart B. 108 slag her, eller tell halvparten.\nStandard stemming. Uten capo.\n\nVers\nF#  ·  G#m  ·  E\nFire rolige slag på hver. Fingerplukk.\n\nRefreng\nSamme tre grep, ikke større.\nOriginalteksten er vernet og ligger ikke her. Skriv linjene du øver på, under.", [
			part("intro", 4),
			part("vers", 8),
			part("refreng", 8)
		]),
		sheet("harvest", "Harvest", 63, "Em", "Øving\nOpeth. Harvest.\nE-moll. 63 slag. Tell i tre: én-to-tre.\nStandard stemming.\n\nIntro\nEm, langt og stille.\n\nVers\nCm · Csus2 · Ab · Gm · G\nAppen har ikke alle disse som knapper. Teksten er kartet.\n\nRefreng\nAm · Bm · Em\nOriginalteksten er vernet. Skriv den selv hvis du vil ha den i teleprompteren.", [
			part("intro", 8),
			part("vers", 8),
			part("refreng", 8)
		]),
		sheet("know-how", "Know-How", 80, "D", "Øving\nKings of Convenience. Know-How.\nOmtrent 80 slag. De bruker ofte capo.\nAppen øver i D, så fingrene har et sted å lande.\n\nVers\nRolige plukk. To gitarer blir to spor: ta den ene, så den andre oppå.\n\nRefreng\nHold det lite. Ikke et korps.\nOriginalteksten er vernet og ligger ikke her. Lim inn linjene du øver på.", [part("vers", 8), part("refreng", 8)])
	];
}
var KIND_LABEL = {
	samtidig: "Stemme og gitar",
	stemme: "Stemme",
	gitar: "Gitar",
	piano: "Piano",
	kor: "Kor",
	annet: "Annet"
};
var SECTION_LABEL = {
	intro: "Intro",
	vers: "Vers",
	refreng: "Refreng",
	bro: "Bro",
	outro: "Outro"
};
function uid() {
	return crypto.randomUUID();
}
function makeTrack(kind, name) {
	return {
		id: uid(),
		kind,
		name,
		takes: [],
		activeTakeId: null,
		trimStart: 0,
		trimEnd: 0,
		fadeIn: 0,
		fadeOut: 0,
		volume: kind === "gitar" ? .78 : .9,
		muted: false,
		solo: false,
		tone: kind === "stemme" || kind === "kor" ? "varm" : "rett",
		even: kind === "stemme" || kind === "kor" || kind === "samtidig" ? .45 : .25,
		room: kind === "stemme" || kind === "kor" || kind === "samtidig" ? "stue" : "tort",
		echo: "av",
		hush: .2,
		twin: 0,
		trick: "ingen"
	};
}
function makeSong(title) {
	const now = Date.now();
	const sections = [{
		id: uid(),
		name: "vers",
		bars: 8
	}, {
		id: uid(),
		name: "refreng",
		bars: 8
	}];
	return {
		id: uid(),
		title,
		bpm: 96,
		keyName: "G",
		click: false,
		drums: "ro",
		lyrics: "Vers\nJeg skulle gått en runde\nmen beina sa nei\n\nRefreng\nJeg blir her\njeg synger i stedet\nfrisbeegolf får vente",
		loop: null,
		sections,
		tracks: [],
		master: "hjemme",
		compareDry: false,
		video: emptyVideo(),
		roomCode: makeRoomCode(),
		outlet: null,
		updatedAt: now,
		createdAt: now
	};
}
function emptyVideo() {
	return {
		takes: [],
		activeTakeId: null,
		trimStart: 0,
		trimEnd: 0,
		look: "varm",
		frame: "telefon",
		mirror: true,
		showTitle: true,
		showLyrics: true
	};
}
function ensureVideo(song) {
	if (song.video?.takes && song.video.look && song.video.frame) return song;
	return {
		...song,
		video: {
			...emptyVideo(),
			...song.video
		}
	};
}
function makeRoomCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	let code = "";
	for (const byte of bytes) code += alphabet[byte % 32];
	return code;
}
function ensureRoom(song) {
	let next = ensureVideo(song);
	if (!/^[A-Z0-9]{4}$/.test(next.roomCode ?? "")) next = {
		...next,
		roomCode: makeRoomCode()
	};
	const outlet = next.outlet;
	if (!(outlet === null || outlet === "youtube" || outlet === "shorts" || outlet === "smule" || outlet === "kort")) next = {
		...next,
		outlet: null
	};
	if (!next.loop || next.loop.end <= next.loop.start) next = {
		...next,
		loop: null
	};
	const tracks = next.tracks.map((track) => {
		if (track.trick === "ingen" || track.trick === "telefon" || track.trick === "kor" || track.trick === "robot") return track;
		return {
			...track,
			trick: "ingen"
		};
	});
	if (tracks.some((track, index) => track !== next.tracks[index])) next = {
		...next,
		tracks
	};
	return next;
}
function nextTrackName(song, kind) {
	const count = song.tracks.filter((t) => t.kind === kind).length;
	const base = KIND_LABEL[kind];
	return count === 0 ? base : `${base} ${count + 1}`;
}
function touch(song, patch) {
	return {
		...song,
		...patch,
		updatedAt: Date.now()
	};
}
function mapSong(songs, id, fn) {
	return songs.map((song) => song.id === id ? fn(song) : song);
}
var memoryStorage = {
	length: 0,
	clear: () => void 0,
	getItem: () => null,
	key: () => null,
	removeItem: () => void 0,
	setItem: () => void 0
};
var useStudio = create()(persist((set, get) => ({
	songs: [],
	seeded: false,
	seed: () => {
		if (get().seeded) return;
		set({
			songs: [makeSong("Første låt")],
			seeded: true
		});
	},
	createSong: (title) => {
		const song = makeSong(title?.trim() || "Ny sang");
		set({
			songs: [song, ...get().songs],
			seeded: true
		});
		return song.id;
	},
	deleteSong: (id) => {
		const song = get().songs.find((s) => s.id === id);
		song?.tracks.forEach((track) => {
			track.takes.forEach((take) => {
				deleteAudio(take.audioId);
			});
		});
		song?.video?.takes.forEach((take) => {
			deleteAudio(take.videoId);
		});
		set({ songs: get().songs.filter((s) => s.id !== id) });
	},
	renameSong: (id, title) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { title })) }),
	patchSong: (id, patch) => set({ songs: mapSong(get().songs, id, (s) => touch(s, patch)) }),
	setBpm: (id, bpm) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { bpm: Math.max(60, Math.min(180, Math.round(bpm))) })) }),
	setKey: (id, keyName) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { keyName })) }),
	setDrums: (id, drums) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { drums })) }),
	setClick: (id, click) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { click })) }),
	setMaster: (id, master) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { master })) }),
	setCompareDry: (id, compareDry) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { compareDry })) }),
	setLyrics: (id, lyrics) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { lyrics })) }),
	addSection: (id, name) => set({ songs: mapSong(get().songs, id, (s) => touch(s, { sections: [...s.sections, {
		id: uid(),
		name,
		bars: 8
	}] })) }),
	updateSection: (songId, sectionId, patch) => set({ songs: mapSong(get().songs, songId, (s) => touch(s, { sections: s.sections.map((section) => section.id === sectionId ? {
		...section,
		...patch
	} : section) })) }),
	moveSection: (songId, sectionId, dir) => set({ songs: mapSong(get().songs, songId, (s) => {
		const index = s.sections.findIndex((section) => section.id === sectionId);
		const next = index + dir;
		if (index < 0 || next < 0 || next >= s.sections.length) return s;
		const sections = s.sections.slice();
		const [item] = sections.splice(index, 1);
		sections.splice(next, 0, item);
		return touch(s, { sections });
	}) }),
	removeSection: (songId, sectionId) => set({ songs: mapSong(get().songs, songId, (s) => touch(s, { sections: s.sections.filter((section) => section.id !== sectionId) })) }),
	addTrack: (songId, kind) => {
		let trackId = "";
		set({ songs: mapSong(get().songs, songId, (s) => {
			const track = makeTrack(kind, nextTrackName(s, kind));
			trackId = track.id;
			return touch(s, { tracks: [...s.tracks, track] });
		}) });
		return trackId;
	},
	ensureTrack: (songId, kind) => {
		const existing = get().songs.find((s) => s.id === songId)?.tracks.find((t) => t.kind === kind);
		if (existing) return existing.id;
		return get().addTrack(songId, kind);
	},
	removeTrack: (songId, trackId) => {
		(get().songs.find((s) => s.id === songId)?.tracks.find((t) => t.id === trackId))?.takes.forEach((take) => {
			deleteAudio(take.audioId);
		});
		set({ songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.filter((t) => t.id !== trackId) })) });
	},
	patchTrack: (songId, trackId, patch) => set({ songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.map((track) => track.id === trackId ? {
		...track,
		...patch
	} : track) })) }),
	addTake: (songId, trackId, take) => set({ songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.map((track) => track.id === trackId ? {
		...track,
		takes: [...track.takes, take],
		activeTakeId: take.id,
		trimStart: 0,
		trimEnd: 0
	} : track) })) }),
	useTake: (songId, trackId, takeId) => set({ songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.map((track) => track.id === trackId ? {
		...track,
		activeTakeId: takeId,
		trimStart: 0,
		trimEnd: 0
	} : track) })) }),
	removeTake: (songId, trackId, takeId) => {
		const take = get().songs.find((s) => s.id === songId)?.tracks.find((t) => t.id === trackId)?.takes.find((t) => t.id === takeId);
		if (take) deleteAudio(take.audioId);
		set({ songs: mapSong(get().songs, songId, (s) => touch(s, { tracks: s.tracks.map((track) => {
			if (track.id !== trackId) return track;
			const takes = track.takes.filter((item) => item.id !== takeId);
			const activeTakeId = track.activeTakeId === takeId ? takes[takes.length - 1]?.id ?? null : track.activeTakeId;
			return {
				...track,
				takes,
				activeTakeId,
				trimStart: 0,
				trimEnd: 0
			};
		}) })) });
	},
	patchVideo: (songId, patch) => set({ songs: mapSong(get().songs, songId, (song) => touch(ensureVideo(song), { video: {
		...ensureVideo(song).video,
		...patch
	} })) }),
	addVideoTake: (songId, take) => set({ songs: mapSong(get().songs, songId, (song) => {
		const video = ensureVideo(song).video;
		return touch(song, { video: {
			...video,
			takes: [...video.takes, take],
			activeTakeId: take.id,
			trimStart: 0,
			trimEnd: 0
		} });
	}) }),
	useVideoTake: (songId, takeId) => set({ songs: mapSong(get().songs, songId, (song) => touch(song, { video: {
		...ensureVideo(song).video,
		activeTakeId: takeId,
		trimStart: 0,
		trimEnd: 0
	} })) }),
	removeVideoTake: (songId, takeId) => {
		const take = get().songs.find((item) => item.id === songId)?.video?.takes.find((item) => item.id === takeId);
		if (take) deleteAudio(take.videoId);
		set({ songs: mapSong(get().songs, songId, (current) => {
			const video = ensureVideo(current).video;
			const takes = video.takes.filter((item) => item.id !== takeId);
			const activeTakeId = video.activeTakeId === takeId ? takes[takes.length - 1]?.id ?? null : video.activeTakeId;
			return touch(current, { video: {
				...video,
				takes,
				activeTakeId,
				trimStart: 0,
				trimEnd: 0
			} });
		}) });
	}
}), {
	name: "lydvenn-v1",
	skipHydration: true,
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
	partialize: (state) => ({
		songs: state.songs,
		seeded: state.seeded
	})
}));
var readyPromise = null;
function hydrateStudio() {
	if (typeof window === "undefined") return Promise.resolve();
	if (!readyPromise) readyPromise = (async () => {
		if (!useStudio.persist.hasHydrated()) await useStudio.persist.rehydrate();
		const base = useStudio.getState().songs.map(ensureRoom);
		const withFirst = useStudio.getState().seeded ? base : [makeSong("Første låt"), ...base];
		const have = new Set(withFirst.map((song) => song.id));
		const songs = [...practiceSongs().filter((song) => !have.has(song.id)), ...withFirst];
		useStudio.setState({
			songs,
			seeded: true
		});
	})();
	return readyPromise;
}
function activeTake(track) {
	return track.takes.find((take) => take.id === track.activeTakeId) ?? track.takes[track.takes.length - 1] ?? null;
}
function trimmedDuration(track) {
	const take = activeTake(track);
	if (!take) return 0;
	return Math.max(0, take.duration - track.trimStart - track.trimEnd);
}
function songDuration(song) {
	return Math.max(0, ...song.tracks.map((track) => trimmedDuration(track)));
}
function activeVideoTake(song) {
	const video = song.video;
	if (!video) return null;
	return video.takes.find((take) => take.id === video.activeTakeId) ?? video.takes[video.takes.length - 1] ?? null;
}
function formatTime(seconds) {
	const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
	return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}
function whenLabel(ts) {
	const delta = Date.now() - ts;
	if (delta < 6e4) return "nå nettopp";
	if (delta < 36e5) return `${Math.floor(delta / 6e4)} min siden`;
	if (delta < 864e5) return `${Math.floor(delta / 36e5)} t siden`;
	return new Date(ts).toLocaleDateString("nb-NO");
}
function PanelHead({ title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-prose text-muted",
			children: lede
		})]
	});
}
function Meter({ level }) {
	const hot = level > .9;
	const width = Math.min(100, Math.round(level * 140));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-3 overflow-hidden rounded-full bg-raised",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", hot ? "bg-signal" : "bg-lamp"),
			style: { width: `${width}%` }
		})
	});
}
function Wave({ peaks }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-14 items-end gap-px",
		"aria-hidden": true,
		children: peaks.map((peak, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 flex-1 bg-fg",
			style: { height: `${Math.max(8, Math.round(peak * 100))}%` }
		}, index))
	});
}
function Choices({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-sm text-muted",
		children: label
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2",
		children: options.map((option) => {
			const on = option.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": on,
				onClick: () => onChange(option.id),
				className: cn("min-h-11 rounded-md border px-4 py-3 text-left", on ? "border-lamp bg-surface-2" : "border-line bg-surface"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: option.label
				}), option.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-muted",
					children: option.text
				}) : null]
			}, option.id);
		})
	})] });
}
function Slider({ label, value, min, max, step = 1, display, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex items-center justify-between gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted",
				children: display
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "studio-range w-full",
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (event) => onChange(Number(event.target.value))
		})]
	});
}
function TrackChips({ song, trackId, onPick }) {
	if (song.tracks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Ingen spor ennå. Gå til Ta opp."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 flex flex-wrap gap-2",
		children: song.tracks.map((track) => {
			const on = track.id === trackId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": on,
				onClick: () => onPick(track.id),
				className: cn("min-h-11 rounded-full border px-4 text-sm", on ? "border-lamp bg-surface-2 text-fg" : "border-line bg-surface text-fg"),
				children: track.name
			}, track.id);
		})
	});
}
function Mark({ className = "h-12 w-12" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/mark.jpg",
		alt: "",
		className: `${className} rounded-md object-cover`
	});
}
function Swoosh({ className = "h-6 w-16" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 120 36",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M4 28 C28 28 40 8 78 10 C96 11 108 16 116 8",
			fill: "none",
			stroke: "#2ec8e6",
			strokeWidth: "3",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M8 30 C34 26 48 14 86 16 C100 17 110 20 116 14",
			fill: "none",
			stroke: "#f4efea",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			opacity: "0.7"
		})]
	});
}
function Logo({ large = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: large ? "flex items-center gap-4" : "inline-flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: large ? "h-20 w-20 shrink-0" : "h-12 w-12 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: large ? "font-display text-4xl leading-none" : "font-display text-base leading-none",
				children: "ThorSound"
			}), large ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs font-medium tracking-widest text-muted uppercase",
				children: "Bondova · Bondø Human AI"
			}) : null]
		})]
	});
}
//#endregion
export { putAudio as _, Meter as a, whenLabel as b, Slider as c, Wave as d, activeTake as f, hydrateStudio as g, getAudio as h, Logo as i, Swoosh as l, formatTime as m, Choices as n, PanelHead as o, activeVideoTake as p, KIND_LABEL as r, SECTION_LABEL as s, Button as t, TrackChips as u, songDuration as v, useStudio as y };
