import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronLeft, C as Headphones, D as Columns2, E as Drum, F as AudioLines, I as ArrowUp, L as ArrowDown, M as Captions, N as Cable, O as Circle, P as Bot, R as Activity, S as ListMusic, T as Ear, _ as Radio, a as Users, b as Mic, c as Trash2, d as Sparkles, f as SlidersHorizontal, g as Repeat, h as Scissors, i as Video, j as Cast, k as ChevronRight, l as Timer, m as ScrollText, n as Waves, o as Tv, p as Share2, r as WandSparkles, t as Wind, u as Square, v as Play, w as FileAudio, x as MessageSquare, y as Music2 } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-CcE4xOFd.mjs";
import { _ as songDuration, a as Meter, c as Slider, d as activeTake, f as activeVideoTake, g as putAudio, h as hydrateStudio, l as TrackChips, m as getAudio, n as Choices, o as PanelHead, p as formatTime, r as KIND_LABEL, s as SECTION_LABEL, t as Button, u as Wave, v as useStudio } from "./mark-Dbp9pnc0.mjs";
import { i as SammenPanel, l as useLyricLink, n as LyricLink, o as lyricIndex, r as Prompter, s as lyricLines } from "./lyric-link-DpThLPER.mjs";
import { n as Shell, t as GearGuide } from "./shell--g2eojab.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sang._id-CWaEr59K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function producerAdvice(song) {
	const notes = [];
	const withAudio = song.tracks.filter((track) => activeTake(track));
	if (song.tracks.length === 0) notes.push({
		id: "start",
		title: "Begynn i ett spor",
		text: "Syng og spill i ett opptak. Headset på, så høyttaleren ikke blir med.",
		job: "opptak"
	});
	for (const track of withAudio) {
		const take = activeTake(track);
		if (!take) continue;
		if (take.peak > .94) notes.push({
			id: `hot-${track.id}`,
			title: `${track.name} er for sterk`,
			text: "Lydnivået slo i taket. Hold mikrofonen litt lenger unna, og ta opp på nytt.",
			job: "opptak"
		});
		else if (take.peak < .06 && take.duration > .8) notes.push({
			id: `quiet-${track.id}`,
			title: `${track.name} er nesten borte`,
			text: "Hold mikrofonen nærmere, eller skru sporet opp i Balanse.",
			job: "balanse"
		});
		if (take.peaks.slice(0, 4).every((p) => p < .04) && take.peaks.some((p) => p > .18)) notes.push({
			id: `trim-${track.id}`,
			title: `Stille før ${track.name.toLowerCase()}`,
			text: "Det er stille før lyden starter. Klipp det vekk.",
			job: "klipp"
		});
	}
	const vocal = withAudio.find((t) => t.kind === "stemme" || t.kind === "samtidig" || t.kind === "kor");
	const guitar = withAudio.find((t) => t.kind === "gitar");
	if (vocal && guitar && vocal.volume + .12 < guitar.volume) notes.push({
		id: "mask",
		title: "Gitaren tar stemmen",
		text: "Skru stemmen opp, eller gitaren ned, i Balanse.",
		job: "balanse"
	});
	if (vocal && vocal.room === "tort") notes.push({
		id: "room",
		title: "Stemmen er tørr",
		text: "Velg Stue under Romklang hvis stemmen høres tørr ut.",
		job: "rom"
	});
	if (song.tracks.length === 1 && song.tracks[0]?.kind !== "samtidig" && withAudio.length === 1) notes.push({
		id: "layer",
		title: "Ett lag til",
		text: "Ta opp det som mangler oppå det du har. Headset på.",
		job: "opptak"
	});
	if (!activeVideoTake(song)) notes.push({
		id: "video",
		title: "Film det samtidig",
		text: "Kamera og mikrofon i samme opptak. Filmen lagres på telefonen.",
		job: "bilde"
	});
	else notes.push({
		id: "koble",
		title: "Bilde til OBS eller Prism",
		text: "En lenke OBS eller Prism kan legge oppå kameraet. ThorSound sender ikke.",
		job: "koble"
	});
	if (song.lyrics.trim()) notes.push({
		id: "sammen",
		title: "Flere kan se teksten",
		text: "Si koden. Teksten går nedover på de andre skjermene.",
		job: "sammen"
	});
	if (withAudio.length > 0 || activeVideoTake(song)) notes.push({
		id: "ut",
		title: "Klar til å legge ut",
		text: "YouTube, Smule eller en kort film. Du limer inn selv.",
		job: "ut"
	});
	if (!song.lyrics.trim()) notes.push({
		id: "lyrics",
		title: "Teksten er tom",
		text: "Skriv linjene. De vises store neste gang du tar opp.",
		job: "tekst"
	});
	if (song.sections.length === 0) notes.push({
		id: "form",
		title: "Låten har ingen deler",
		text: "Merk vers og refreng, så formen er synlig.",
		job: "deler"
	});
	if (song.bpm >= 140) notes.push({
		id: "bpm",
		title: "Tempoet er høyt",
		text: "Det går fort. Senk tempoet hvis ordene ikke rekker fram.",
		job: "tempo"
	});
	if (withAudio.length > 0 && notes.filter((n) => n.id !== "lyrics" && n.id !== "form").length === 0) notes.push({
		id: "finish",
		title: "Klar for å høres ferdig ut",
		text: "Velg Ferdig lyd, og hør før og etter.",
		job: "ferdig"
	});
	return notes.slice(0, 5);
}
var JOBS = [
	{
		id: "opptak",
		title: "Ta opp",
		text: "Stemme, gitar eller begge. Du kan ta flere forsøk.",
		icon: Mic
	},
	{
		id: "utstyr",
		title: "Koble utstyr",
		text: "Headset først, så mikrofon, så gitar.",
		icon: Cable
	},
	{
		id: "ai",
		title: "Rådgiver",
		text: "Hører på låten her i telefonen. Ingenting sendes ut.",
		icon: Bot
	},
	{
		id: "prov",
		title: "Prøv noe",
		text: "Telefon, kor eller robot. Trykk en gang til for å angre.",
		icon: WandSparkles
	},
	{
		id: "bilde",
		title: "Bilde og lyd",
		text: "Film og mikrofon samtidig.",
		icon: Video
	},
	{
		id: "sending",
		title: "Sending",
		text: "Tittel og tekst oppå bildet. Ingenting går ut.",
		icon: Radio
	},
	{
		id: "koble",
		title: "Koble bilde",
		text: "OBS, Prism eller videosamtale. De sender.",
		icon: Cast
	},
	{
		id: "filmklipp",
		title: "Klipp filmen",
		text: "Kutt starten og slutten.",
		icon: Scissors
	},
	{
		id: "filmlagre",
		title: "Lagre filmen",
		text: "Klipp og tekst blir med i filen på telefonen.",
		icon: Share2
	},
	{
		id: "monitor",
		title: "Sjekk mikrofon",
		text: "Viser om lyden er for svak eller for sterk.",
		icon: Headphones
	},
	{
		id: "rens",
		title: "Rens og tekst",
		text: "Demper støy, løfter stemmer, skriver teksten.",
		icon: FileAudio
	},
	{
		id: "tempo",
		title: "Tempo og klikk",
		text: "Hvor fort låten går, og et klikk å spille mot.",
		icon: Timer
	},
	{
		id: "trommer",
		title: "Trommer",
		text: "En rytme under. Kan skrus av.",
		icon: Drum
	},
	{
		id: "grep",
		title: "Akkorder og stemming",
		text: "Spill grepa. Stem de seks strengene.",
		icon: Music2
	},
	{
		id: "tekst",
		title: "Tekst",
		text: "Ordene vises store mens du tar opp.",
		icon: ScrollText
	},
	{
		id: "sammen",
		title: "Sammen",
		text: "Samme tekst på flere skjermer. Den går av seg selv.",
		icon: Captions
	},
	{
		id: "ut",
		title: "Legg ut",
		text: "YouTube, Smule eller en kort film. Du limer inn selv.",
		icon: Tv
	},
	{
		id: "deler",
		title: "Delene i låten",
		text: "Vers, refreng og bro.",
		icon: ListMusic
	},
	{
		id: "forsok",
		title: "Velg forsøk",
		text: "Velg hvilket opptak som skal høres.",
		icon: Sparkles
	},
	{
		id: "klipp",
		title: "Klipp",
		text: "Kutt stillhet før og etter.",
		icon: Scissors
	},
	{
		id: "balanse",
		title: "Balanse",
		text: "Hvor høyt hvert spor skal være.",
		icon: SlidersHorizontal
	},
	{
		id: "tone",
		title: "Tone",
		text: "Varm, klar eller radio.",
		icon: AudioLines
	},
	{
		id: "jevn",
		title: "Jevn lyd",
		text: "Hvisking og roping blir likere.",
		icon: Activity
	},
	{
		id: "rom",
		title: "Romklang",
		text: "Tørt, stue, scene eller kirke.",
		icon: Waves
	},
	{
		id: "ekko",
		title: "Ekko",
		text: "Et kort svar bak stemmen.",
		icon: Repeat
	},
	{
		id: "sus",
		title: "Sus og romling",
		text: "Tar brum. Lar pusten være.",
		icon: Wind
	},
	{
		id: "tvilling",
		title: "Tvillingstemme",
		text: "En myk kopi ved siden av stemmen.",
		icon: Users
	},
	{
		id: "ab",
		title: "Før og etter",
		text: "Hør rått, og hør med lyden på.",
		icon: Columns2
	},
	{
		id: "ferdig",
		title: "Ferdig lyd",
		text: "Hjemme, radio eller myk. Ett valg.",
		icon: Ear
	},
	{
		id: "rad",
		title: "Produsentens råd",
		text: "Korte beskjeder om det som ligger i låten.",
		icon: MessageSquare
	},
	{
		id: "del",
		title: "Lagre og del",
		text: "En lydfil du kan sende.",
		icon: Share2
	}
];
var JOB_GROUPS = [
	{
		title: "Start",
		ids: [
			"opptak",
			"utstyr",
			"monitor",
			"rens"
		]
	},
	{
		title: "Låten",
		ids: [
			"tempo",
			"trommer",
			"grep",
			"tekst",
			"deler",
			"sammen"
		]
	},
	{
		title: "Lyden",
		ids: [
			"forsok",
			"klipp",
			"balanse",
			"tone",
			"jevn",
			"rom",
			"ekko",
			"sus",
			"tvilling",
			"prov",
			"ab",
			"ferdig"
		]
	},
	{
		title: "Bildet",
		ids: [
			"bilde",
			"sending",
			"koble",
			"filmklipp",
			"filmlagre"
		]
	},
	{
		title: "Ut",
		ids: [
			"ai",
			"rad",
			"ut",
			"del"
		]
	}
];
var KEYS = [
	{
		id: "C",
		root: 261.63,
		chords: [
			{
				name: "C",
				freqs: [
					261.63,
					329.63,
					392
				]
			},
			{
				name: "F",
				freqs: [
					174.61,
					220,
					261.63
				]
			},
			{
				name: "G",
				freqs: [
					196,
					246.94,
					293.66
				]
			},
			{
				name: "Am",
				freqs: [
					220,
					261.63,
					329.63
				]
			}
		]
	},
	{
		id: "G",
		root: 196,
		chords: [
			{
				name: "G",
				freqs: [
					196,
					246.94,
					293.66
				]
			},
			{
				name: "C",
				freqs: [
					261.63,
					329.63,
					392
				]
			},
			{
				name: "D",
				freqs: [
					146.83,
					185,
					220
				]
			},
			{
				name: "Em",
				freqs: [
					164.81,
					196,
					246.94
				]
			}
		]
	},
	{
		id: "D",
		root: 293.66,
		chords: [
			{
				name: "D",
				freqs: [
					146.83,
					185,
					220
				]
			},
			{
				name: "G",
				freqs: [
					196,
					246.94,
					293.66
				]
			},
			{
				name: "A",
				freqs: [
					220,
					277.18,
					329.63
				]
			},
			{
				name: "Bm",
				freqs: [
					246.94,
					293.66,
					369.99
				]
			}
		]
	},
	{
		id: "A",
		root: 220,
		chords: [
			{
				name: "A",
				freqs: [
					220,
					277.18,
					329.63
				]
			},
			{
				name: "D",
				freqs: [
					146.83,
					185,
					220
				]
			},
			{
				name: "E",
				freqs: [
					164.81,
					207.65,
					246.94
				]
			},
			{
				name: "F#m",
				freqs: [
					185,
					220,
					277.18
				]
			}
		]
	},
	{
		id: "E",
		root: 164.81,
		chords: [
			{
				name: "E",
				freqs: [
					164.81,
					207.65,
					246.94
				]
			},
			{
				name: "A",
				freqs: [
					220,
					277.18,
					329.63
				]
			},
			{
				name: "B",
				freqs: [
					246.94,
					311.13,
					369.99
				]
			},
			{
				name: "C#m",
				freqs: [
					138.59,
					164.81,
					207.65
				]
			}
		]
	},
	{
		id: "B",
		root: 246.94,
		chords: [
			{
				name: "B",
				freqs: [
					246.94,
					311.13,
					369.99
				]
			},
			{
				name: "F#",
				freqs: [
					185,
					233.08,
					277.18
				]
			},
			{
				name: "G#m",
				freqs: [
					207.65,
					246.94,
					311.13
				]
			},
			{
				name: "E",
				freqs: [
					164.81,
					207.65,
					246.94
				]
			}
		]
	},
	{
		id: "Am",
		root: 220,
		chords: [
			{
				name: "Am",
				freqs: [
					220,
					261.63,
					329.63
				]
			},
			{
				name: "F",
				freqs: [
					174.61,
					220,
					261.63
				]
			},
			{
				name: "C",
				freqs: [
					261.63,
					329.63,
					392
				]
			},
			{
				name: "G",
				freqs: [
					196,
					246.94,
					293.66
				]
			}
		]
	},
	{
		id: "Em",
		root: 164.81,
		chords: [
			{
				name: "Em",
				freqs: [
					164.81,
					196,
					246.94
				]
			},
			{
				name: "C",
				freqs: [
					261.63,
					329.63,
					392
				]
			},
			{
				name: "G",
				freqs: [
					196,
					246.94,
					293.66
				]
			},
			{
				name: "D",
				freqs: [
					146.83,
					185,
					220
				]
			}
		]
	}
];
function keyInfo(name) {
	return KEYS.find((k) => k.id === name) ?? KEYS[1];
}
var NOTE_NAMES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];
function detectPitch(samples, sampleRate) {
	const size = samples.length;
	if (size < 256) return null;
	let rms = 0;
	for (let i = 0; i < size; i++) rms += samples[i] * samples[i];
	rms = Math.sqrt(rms / size);
	if (rms < .012) return null;
	const minLag = Math.floor(sampleRate / 880);
	const maxLag = Math.min(Math.floor(sampleRate / 70), size - 2);
	let bestLag = -1;
	let best = 0;
	for (let lag = minLag; lag <= maxLag; lag++) {
		let sum = 0;
		for (let i = 0; i < size - lag; i += 2) sum += samples[i] * samples[i + lag];
		if (sum > best) {
			best = sum;
			bestLag = lag;
		}
	}
	if (bestLag < 0) return null;
	const freq = sampleRate / bestLag;
	if (freq < 70 || freq > 880) return null;
	const midi = Math.round(69 + 12 * Math.log2(freq / 440));
	const exact = 69 + 12 * Math.log2(freq / 440);
	const cents = Math.round((exact - midi) * 100);
	return {
		note: NOTE_NAMES[(midi % 12 + 12) % 12] ?? "?",
		cents,
		freq
	};
}
function pitchHint(cents) {
	if (Math.abs(cents) <= 12) return "treffer";
	return cents < 0 ? "litt under" : "litt over";
}
var STRINGS = [
	{
		id: "E2",
		name: "E",
		freq: 82.41
	},
	{
		id: "A2",
		name: "A",
		freq: 110
	},
	{
		id: "D3",
		name: "D",
		freq: 146.83
	},
	{
		id: "G3",
		name: "G",
		freq: 196
	},
	{
		id: "B3",
		name: "B",
		freq: 246.94
	},
	{
		id: "E4",
		name: "E",
		freq: 329.63
	}
];
var OPEN_CHORDS = [
	{
		name: "C",
		freqs: [
			261.63,
			329.63,
			392
		]
	},
	{
		name: "D",
		freqs: [
			146.83,
			185,
			220
		]
	},
	{
		name: "E",
		freqs: [
			164.81,
			207.65,
			246.94
		]
	},
	{
		name: "F",
		freqs: [
			174.61,
			220,
			261.63
		]
	},
	{
		name: "G",
		freqs: [
			196,
			246.94,
			293.66
		]
	},
	{
		name: "A",
		freqs: [
			220,
			277.18,
			329.63
		]
	},
	{
		name: "B",
		freqs: [
			246.94,
			311.13,
			369.99
		]
	},
	{
		name: "Am",
		freqs: [
			220,
			261.63,
			329.63
		]
	},
	{
		name: "Dm",
		freqs: [
			146.83,
			174.61,
			220
		]
	},
	{
		name: "Em",
		freqs: [
			164.81,
			196,
			246.94
		]
	},
	{
		name: "F#m",
		freqs: [
			185,
			220,
			277.18
		]
	},
	{
		name: "Bm",
		freqs: [
			246.94,
			293.66,
			369.99
		]
	}
];
function nearestString(freq) {
	let best = STRINGS[0];
	let bestGap = Infinity;
	for (const string of STRINGS) {
		const gap = Math.abs(1200 * Math.log2(freq / string.freq));
		if (gap < bestGap) {
			bestGap = gap;
			best = string;
		}
	}
	return bestGap < 70 ? best : null;
}
function stringCents(freq, target) {
	return Math.round(1200 * Math.log2(freq / target));
}
var LOOK_FILTER = {
	rett: "none",
	varm: "sepia(0.28) saturate(1.2) contrast(1.04)",
	kveld: "contrast(1.08) saturate(0.8) brightness(0.9)",
	svartkvitt: "grayscale(1) contrast(1.08)"
};
function frameSize(frame) {
	return frame === "skjerm" ? {
		width: 1280,
		height: 720
	} : {
		width: 720,
		height: 1280
	};
}
function lyricLine(lyrics, ratio) {
	const lines = lyrics.split("\n").map((line) => line.trim()).filter(Boolean);
	if (lines.length === 0) return "";
	return lines[Math.min(lines.length - 1, Math.max(0, Math.floor(ratio * lines.length)))] ?? "";
}
function pickVideoMime() {
	if (typeof MediaRecorder === "undefined") return "";
	return [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm",
		"video/mp4"
	].find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}
function measureVideo(blob) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const video = document.createElement("video");
		video.preload = "metadata";
		video.onloadedmetadata = () => {
			const duration = video.duration;
			URL.revokeObjectURL(url);
			if (!Number.isFinite(duration)) reject(/* @__PURE__ */ new Error("Fant ikke lengden på filmen."));
			else resolve(duration);
		};
		video.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Klarte ikke å lese filmen."));
		};
		video.src = url;
	});
}
function drawCover(ctx, video, width, height, mirror) {
	const sourceWidth = video.videoWidth || width;
	const sourceHeight = video.videoHeight || height;
	const scale = Math.max(width / sourceWidth, height / sourceHeight);
	const drawWidth = sourceWidth * scale;
	const drawHeight = sourceHeight * scale;
	const x = (width - drawWidth) / 2;
	const y = (height - drawHeight) / 2;
	ctx.save();
	if (mirror) {
		ctx.translate(width, 0);
		ctx.scale(-1, 1);
	}
	ctx.drawImage(video, x, y, drawWidth, drawHeight);
	ctx.restore();
}
function drawCaption(ctx, width, height, title, line) {
	const bar = Math.round(height * .16);
	ctx.fillStyle = "rgba(10, 17, 40, 0.82)";
	ctx.fillRect(0, height - bar, width, bar);
	ctx.fillStyle = "#2ec8e6";
	ctx.fillRect(0, height - bar, Math.max(4, Math.round(width * .008)), bar);
	ctx.fillStyle = "#f4efea";
	ctx.font = `500 ${Math.round(width * .04)}px Montserrat, sans-serif`;
	ctx.fillText(title.slice(0, 42), Math.round(width * .04), height - bar + bar * .42);
	if (!line) return;
	ctx.fillStyle = "#f4efea";
	ctx.font = `400 ${Math.round(width * .03)}px Inter, sans-serif`;
	ctx.fillText(line.slice(0, 64), Math.round(width * .04), height - bar + bar * .76);
}
async function renderEditedVideo(options) {
	if (typeof HTMLCanvasElement.prototype.captureStream !== "function") throw new Error("Denne nettleseren kan ikke brenne tekst og klipp inn i filmen. Prøv Chrome.");
	const url = URL.createObjectURL(options.blob);
	const video = document.createElement("video");
	video.src = url;
	video.playsInline = true;
	video.volume = .8;
	await new Promise((resolve, reject) => {
		video.onloadeddata = () => resolve();
		video.onerror = () => reject(/* @__PURE__ */ new Error("Klarte ikke å åpne filmen."));
	});
	const end = Math.max(options.trimStart + .2, video.duration - options.trimEnd);
	video.currentTime = options.trimStart;
	await new Promise((resolve) => {
		video.onseeked = () => resolve();
	});
	const { width, height } = frameSize(options.frame);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Klarte ikke å tegne filmen.");
	const picture = canvas.captureStream(30);
	const audioCtx = new AudioContext();
	const source = audioCtx.createMediaElementSource(video);
	const dest = audioCtx.createMediaStreamDestination();
	source.connect(dest);
	const mixed = new MediaStream([...picture.getVideoTracks(), ...dest.stream.getAudioTracks()]);
	const mime = pickVideoMime();
	const recorder = new MediaRecorder(mixed, mime ? {
		mimeType: mime,
		videoBitsPerSecond: 25e5
	} : void 0);
	const chunks = [];
	recorder.ondataavailable = (event) => {
		if (event.data.size) chunks.push(event.data);
	};
	const stopped = new Promise((resolve) => {
		recorder.onstop = () => resolve();
	});
	recorder.start(200);
	await video.play();
	await new Promise((resolve) => {
		const draw = () => {
			if (video.ended || video.currentTime >= end - .03) {
				resolve();
				return;
			}
			ctx.filter = LOOK_FILTER[options.look];
			drawCover(ctx, video, width, height, options.mirror);
			ctx.filter = "none";
			if (options.showTitle || options.showLyrics) {
				const span = Math.max(.1, end - options.trimStart);
				const ratio = (video.currentTime - options.trimStart) / span;
				drawCaption(ctx, width, height, options.showTitle ? options.title || "Uten navn" : "", options.showLyrics ? lyricLine(options.lyrics, ratio) : "");
			}
			requestAnimationFrame(draw);
		};
		draw();
	});
	video.pause();
	if (recorder.state !== "inactive") recorder.stop();
	await stopped;
	source.disconnect();
	await audioCtx.close();
	URL.revokeObjectURL(url);
	const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
	if (blob.size < 500) throw new Error("Filmen ble tom. Prøv en gang til.");
	return blob;
}
async function posterJpeg(blob, atSeconds, mirror) {
	const url = URL.createObjectURL(blob);
	const video = document.createElement("video");
	video.src = url;
	video.muted = true;
	video.playsInline = true;
	try {
		await new Promise((resolve, reject) => {
			video.onloadeddata = () => resolve();
			video.onerror = () => reject(/* @__PURE__ */ new Error("Klarte ikke å lage forsidebildet."));
		});
		const at = Math.min(Math.max(0, atSeconds), Math.max(0, (video.duration || 1) - .05));
		if (at > 0) {
			video.currentTime = at;
			await new Promise((resolve) => {
				video.onseeked = () => resolve();
			});
		}
		const canvas = document.createElement("canvas");
		canvas.width = 1280;
		canvas.height = 720;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Klarte ikke å lage forsidebildet.");
		drawCover(ctx, video, 1280, 720, mirror);
		const jpeg = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .86));
		if (!jpeg) throw new Error("Klarte ikke å lage forsidebildet.");
		return jpeg;
	} finally {
		URL.revokeObjectURL(url);
	}
}
var LOOKS = [
	{
		id: "rett",
		label: "Rett",
		text: "Slik kameraet ser deg"
	},
	{
		id: "varm",
		label: "Varm",
		text: "Litt kveldslampe"
	},
	{
		id: "kveld",
		label: "Kveld",
		text: "Mørkere, roligere"
	},
	{
		id: "svartkvitt",
		label: "Svart-hvitt",
		text: "Uten farger"
	}
];
function useBlobUrl(id) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!id) {
			setUrl(null);
			return;
		}
		let dead = false;
		let current = null;
		getAudio(id).then((blob) => {
			if (dead || !blob) return;
			current = URL.createObjectURL(blob);
			setUrl(current);
		});
		return () => {
			dead = true;
			if (current) URL.revokeObjectURL(current);
		};
	}, [id]);
	return url;
}
function sleep$1(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function cameraError(err) {
	const name = err instanceof DOMException ? err.name : "";
	if (name === "NotAllowedError" || name === "PermissionDeniedError") return "Kamera eller mikrofon er ikke tillatt. Si ja i nettleseren, og prøv igjen.";
	if (name === "NotFoundError") return "Fant ikke kamera.";
	return "Fikk ikke tak i kamera og mikrofon.";
}
function Stage({ frame, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative mx-auto overflow-hidden rounded-2xl bg-raised ${frame === "skjerm" ? "frame-skjerm" : "frame-telefon"}`,
		children
	});
}
function LowerThird({ title, line }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 bg-bg/80 px-3 py-3",
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: title
		}) : null, line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: line
		}) : null]
	});
}
function FilmPreview({ song, video, url }) {
	const ref = (0, import_react.useRef)(null);
	const [ratio, setRatio] = (0, import_react.useState)(0);
	const take = activeVideoTake(song);
	const end = Math.max(.2, (take?.duration ?? 0) - video.trimEnd);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stage, {
		frame: video.frame,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref,
				src: url,
				playsInline: true,
				className: `h-full w-full object-cover look-${video.look} ${video.mirror ? "mirror-x" : ""}`,
				onPlay: () => {
					const el = ref.current;
					if (el && el.currentTime < video.trimStart) el.currentTime = video.trimStart;
				},
				onTimeUpdate: () => {
					const el = ref.current;
					if (!el || !take) return;
					if (el.currentTime >= end) el.currentTime = video.trimStart;
					const span = Math.max(.1, end - video.trimStart);
					setRatio(Math.min(1, Math.max(0, (el.currentTime - video.trimStart) / span)));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute top-3 left-3 min-h-11 rounded-full bg-bg/80 px-4 text-sm",
				onClick: () => {
					const el = ref.current;
					if (!el) return;
					if (el.paused) el.play();
					else el.pause();
				},
				children: "Spill filmen"
			}),
			video.showTitle || video.showLyrics ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LowerThird, {
				title: video.showTitle ? song.title || "Uten navn" : "",
				line: video.showLyrics ? lyricLine(song.lyrics, ratio) : ""
			}) : null
		]
	});
}
function VideoBooth({ song, engine, snap, graphics }) {
	const liveRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const recRef = (0, import_react.useRef)(null);
	const chunks = (0, import_react.useRef)([]);
	const cancel = (0, import_react.useRef)(false);
	const discard = (0, import_react.useRef)(false);
	const countToken = (0, import_react.useRef)(0);
	const songId = (0, import_react.useRef)(song.id);
	songId.current = song.id;
	const [phase, setPhase] = (0, import_react.useState)("off");
	const [count, setCount] = (0, import_react.useState)(null);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const [ratio, setRatio] = (0, import_react.useState)(0);
	const addVideoTake = useStudio((state) => state.addVideoTake);
	const video = song.video;
	const take = activeVideoTake(song);
	const savedUrl = useBlobUrl(phase === "off" ? take?.videoId ?? null : null);
	(0, import_react.useEffect)(() => {
		return () => {
			cancel.current = true;
			countToken.current += 1;
			if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
			streamRef.current?.getTracks().forEach((track) => track.stop());
		};
	}, []);
	async function arm() {
		setError(null);
		if (snap.recording || snap.counting) {
			setError("Stopp lydopptaket først. Kameraet trenger mikrofonen alene.");
			return;
		}
		engine.current?.stopListen();
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false
				},
				video: { facingMode: "user" }
			});
			streamRef.current = stream;
			setPhase("live");
		} catch (err) {
			setError(cameraError(err));
		}
	}
	(0, import_react.useEffect)(() => {
		const el = liveRef.current;
		const stream = streamRef.current;
		if (!el || !stream || phase === "off") return;
		el.srcObject = stream;
		el.play().catch(() => void 0);
	}, [phase]);
	function disarm() {
		countToken.current += 1;
		discard.current = true;
		setCount(null);
		if (recRef.current && recRef.current.state !== "inactive") {
			recRef.current.stop();
			return;
		}
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		setPhase("off");
	}
	async function record() {
		const stream = streamRef.current;
		if (!stream) return;
		const token = ++countToken.current;
		setPhase("count");
		for (const n of [
			3,
			2,
			1
		]) {
			if (token !== countToken.current) return;
			setCount(n);
			await sleep$1(700);
		}
		if (token !== countToken.current) return;
		setCount(null);
		const mime = pickVideoMime();
		let recorder;
		try {
			recorder = new MediaRecorder(stream, mime ? {
				mimeType: mime,
				videoBitsPerSecond: 2e6
			} : void 0);
		} catch {
			recorder = new MediaRecorder(stream);
		}
		chunks.current = [];
		recorder.ondataavailable = (event) => {
			if (event.data.size) chunks.current.push(event.data);
		};
		recorder.onstop = () => {
			save(recorder.mimeType || mime || "video/webm");
		};
		recorder.start(250);
		recRef.current = recorder;
		setPhase("rec");
		const started = performance.now();
		const timer = window.setInterval(() => {
			const elapsed = (performance.now() - started) / 1e3;
			setSeconds(elapsed);
			setRatio(Math.min(1, elapsed / 45));
			if (elapsed >= 180 && recRef.current?.state === "recording") recRef.current.stop();
		}, 200);
		recorder.addEventListener("stop", () => {
			window.clearInterval(timer);
		}, { once: true });
		engine.current?.play(0);
	}
	async function save(mime) {
		engine.current?.pause();
		const dropped = discard.current;
		discard.current = false;
		if (cancel.current || dropped) {
			streamRef.current?.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
			if (!cancel.current) setPhase("off");
			return;
		}
		setPhase("saving");
		try {
			const blob = new Blob(chunks.current, { type: mime });
			if (blob.size < 800) throw new Error("Opptaket ble tomt. Prøv en gang til.");
			const duration = await measureVideo(blob);
			const videoId = crypto.randomUUID();
			await putAudio(videoId, blob);
			addVideoTake(songId.current, {
				id: crypto.randomUUID(),
				videoId,
				duration,
				createdAt: Date.now()
			});
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Kunne ikke lagre filmen.");
		} finally {
			if (streamRef.current) setPhase("live");
			else setPhase("off");
			setSeconds(0);
		}
	}
	const showLive = phase !== "off";
	const graphicsOn = graphics && video;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			showLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stage, {
				frame: video.frame,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: liveRef,
						muted: true,
						playsInline: true,
						autoPlay: true,
						className: `h-full w-full object-cover look-${graphicsOn ? video.look : "rett"} ${graphicsOn && video.mirror ? "mirror-x" : ""}`
					}),
					phase === "count" && count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute inset-0 flex items-center justify-center font-display text-7xl text-lamp",
						children: count
					}) : null,
					phase === "rec" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute top-3 right-3 rounded-full bg-signal px-3 py-2 text-sm text-signal-ink tabular-nums",
						children: formatTime(seconds)
					}) : null,
					graphicsOn && (video.showTitle || video.showLyrics) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LowerThird, {
						title: video.showTitle ? song.title || "Uten navn" : "",
						line: video.showLyrics ? lyricLine(song.lyrics, ratio) : ""
					}) : null
				]
			}) : savedUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilmPreview, {
				song,
				video,
				url: savedUrl
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-line bg-surface px-4 py-8 text-center text-sm text-muted",
				children: "Kameraet er av. Skru det på når du vil synge og filme på en gang."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					phase === "off" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void arm(),
						children: "Skru på kamera"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: disarm,
						children: "Slå av kamera"
					}),
					phase === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "signal",
						onClick: () => void record(),
						children: "Ta opp bilde og lyd"
					}) : null,
					phase === "count" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: () => {
							countToken.current += 1;
							setPhase("live");
							setCount(null);
						},
						children: "Avbryt"
					}) : null,
					phase === "rec" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "signal",
						onClick: () => recRef.current?.stop(),
						children: "Stopp"
					}) : null,
					phase === "saving" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Lagrer filmen…"
					}) : null
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-signal",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Headset på. Sangen spiller mens du filmer, så høyttaleren ikke blir med i opptaket. Vi sender ikke dette ut på nettet."
			})
		]
	});
}
function TakeList({ song }) {
	const useVideoTake = useStudio((state) => state.useVideoTake);
	const removeVideoTake = useStudio((state) => state.removeVideoTake);
	if (song.video.takes.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Ingen filmforsøk ennå."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: song.video.takes.map((take, index) => {
			const on = take.id === song.video.activeTakeId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm",
						children: [
							"Forsøk ",
							index + 1,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: formatTime(take.duration)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: on ? "primary" : "quiet",
						"aria-pressed": on,
						onClick: () => useVideoTake(song.id, take.id),
						children: on ? "Brukes nå" : "Bruk denne"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						"aria-label": "Slett filmforsøk",
						onClick: () => removeVideoTake(song.id, take.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, take.id);
		})
	});
}
function BildePanel(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Bilde og lyd",
			lede: "Kamera og mikrofon tar opp samtidig, mens låten spiller i headsettet. Ett forsøk er en hel fremføring. Tre minutter er maks."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoBooth, {
			...props,
			graphics: false
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TakeList, { song: props.song })
		})
	] });
}
function SendingPanel(props) {
	const patchVideo = useStudio((state) => state.patchVideo);
	const video = props.song.video;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Sending",
			lede: "Slik en sending ser ut: tittel, tekst og et utseende oppå bildet. Du øver her. Filmen lagres på telefonen. Ingenting går ut på nett før du selv legger den ut."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: video.frame === "telefon" ? "primary" : "quiet",
					"aria-pressed": video.frame === "telefon",
					onClick: () => patchVideo(props.song.id, { frame: "telefon" }),
					children: "Telefon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: video.frame === "skjerm" ? "primary" : "quiet",
					"aria-pressed": video.frame === "skjerm",
					onClick: () => patchVideo(props.song.id, { frame: "skjerm" }),
					children: "Skjerm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: video.mirror ? "primary" : "quiet",
					"aria-pressed": video.mirror,
					onClick: () => patchVideo(props.song.id, { mirror: !video.mirror }),
					children: "Speil"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: video.showTitle ? "primary" : "quiet",
					"aria-pressed": video.showTitle,
					onClick: () => patchVideo(props.song.id, { showTitle: !video.showTitle }),
					children: "Tittel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: video.showLyrics ? "primary" : "quiet",
					"aria-pressed": video.showLyrics,
					onClick: () => patchVideo(props.song.id, { showLyrics: !video.showLyrics }),
					children: "Tekst"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
			value: video.look,
			onChange: (look) => patchVideo(props.song.id, { look }),
			options: LOOKS
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoBooth, {
				...props,
				graphics: true
			})
		})
	] });
}
function FilmklippPanel({ song }) {
	const patchVideo = useStudio((state) => state.patchVideo);
	const take = activeVideoTake(song);
	const url = useBlobUrl(take?.videoId ?? null);
	const video = song.video;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Klipp filmen",
		lede: "Kutt stillhet før du begynner, og det som henger igjen etterpå. Bildet og lyden klippes sammen."
	}), take && url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilmPreview, {
				song,
				video,
				url
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Kutt starten",
				min: 0,
				max: Math.max(0, take.duration - video.trimEnd - .2),
				step: .1,
				value: video.trimStart,
				display: formatTime(video.trimStart),
				onChange: (value) => patchVideo(song.id, { trimStart: value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Kutt slutten",
				min: 0,
				max: Math.max(0, take.duration - video.trimStart - .2),
				step: .1,
				value: video.trimEnd,
				display: formatTime(video.trimEnd),
				onChange: (value) => patchVideo(song.id, { trimEnd: value })
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Ta opp et bilde først."
	})] });
}
function FilmLagrePanel({ song }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	const take = activeVideoTake(song);
	async function download() {
		if (!take) return;
		setBusy(true);
		setMessage(null);
		try {
			const blob = await getAudio(take.videoId);
			if (!blob) throw new Error("Fant ikke filmen på telefonen.");
			const edited = await renderEditedVideo({
				blob,
				trimStart: song.video.trimStart,
				trimEnd: song.video.trimEnd,
				look: song.video.look,
				frame: song.video.frame,
				mirror: song.video.mirror,
				title: song.title,
				lyrics: song.lyrics,
				showTitle: song.video.showTitle,
				showLyrics: song.video.showLyrics
			});
			const name = `${song.title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "film"}.webm`;
			const file = new File([edited], name, { type: edited.type || "video/webm" });
			const nav = navigator;
			if (nav.share && nav.canShare?.({ files: [file] })) {
				await nav.share({
					files: [file],
					title: song.title
				});
				setMessage("Filmen er klar til å sendes.");
				return;
			}
			const url = URL.createObjectURL(edited);
			const link = document.createElement("a");
			link.href = url;
			link.download = name;
			link.click();
			URL.revokeObjectURL(url);
			setMessage("Filmen er lastet ned, med klipp, utseende og tekst.");
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Kunne ikke lage filmen.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Lagre filmen",
			lede: "Klippet, utseendet og teksten brennes inn i en fil du kan legge ut selv. ThorSound sender ikke direkte."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void download(),
			disabled: busy || !take,
			children: busy ? "Klipper…" : "Last ned filmen"
		}),
		!take ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Ta opp et bilde først."
		}) : null,
		message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: message
		}) : null
	] });
}
var COMMUNITIES = [
	{
		id: "youtube",
		label: "YouTube",
		text: "Liggende bilde, tittel og en tekst til under videoen.",
		frame: "skjerm",
		look: "varm",
		lyrics: true,
		mirror: true,
		maxSeconds: null
	},
	{
		id: "shorts",
		label: "Shorts",
		text: "Stående film til YouTube. Helst under tre minutter.",
		frame: "telefon",
		look: "rett",
		lyrics: true,
		mirror: true,
		maxSeconds: 180
	},
	{
		id: "smule",
		label: "Smule",
		text: "Karaoke på høykant. Teksten ligger i bildet, og noen kan synge med.",
		frame: "telefon",
		look: "varm",
		lyrics: true,
		mirror: true,
		maxSeconds: null
	},
	{
		id: "kort",
		label: "Korte filmer",
		text: "TikTok, Reels og lignende. Stående, helst under ett minutt.",
		frame: "telefon",
		look: "rett",
		lyrics: true,
		mirror: true,
		maxSeconds: 60
	}
];
function communityPreset(id) {
	return COMMUNITIES.find((item) => item.id === id) ?? COMMUNITIES[0];
}
function lyricBlock(lyrics, maxLines) {
	return lyrics.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, maxLines).join("\n");
}
function communityPack(song, id) {
	const name = (song.title || "Min sang").trim().slice(0, 90);
	const lines = lyricBlock(song.lyrics, id === "kort" ? 2 : 8);
	const hook = lines.split("\n")[0] || name;
	if (id === "smule") return {
		title: name,
		body: `${lines}\n\nSyng med meg. Kode ${song.roomCode}.\nÅpne ThorSound, trykk Tekstkode, og skriv koden.`.trim()
	};
	if (id === "kort") return {
		title: hook.slice(0, 80),
		body: `${hook}\n\n#sang #musikk`.trim()
	};
	if (id === "shorts") return {
		title: name.slice(0, 70),
		body: `${lines}\n\n#shorts #sang`.trim()
	};
	return {
		title: name,
		body: `${lines}\n\nSpilt inn hjemme.\n\nmusikk, sang, original`.trim()
	};
}
function keptSeconds(duration, trimStart, trimEnd) {
	return Math.max(0, duration - trimStart - trimEnd);
}
function trimEndForMax(duration, trimStart, maxSeconds) {
	return Math.max(0, duration - trimStart - maxSeconds);
}
function fileSafe(title) {
	return title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "lat";
}
function saveBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	URL.revokeObjectURL(url);
}
function UtPanel({ song, engine }) {
	const patchSong = useStudio((state) => state.patchSong);
	const patchVideo = useStudio((state) => state.patchVideo);
	const setMaster = useStudio((state) => state.setMaster);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const choice = song.outlet;
	const preset = choice ? communityPreset(choice) : null;
	const pack = choice ? communityPack(song, choice) : null;
	const take = activeVideoTake(song);
	const seconds = take ? keptSeconds(take.duration, song.video.trimStart, song.video.trimEnd) : songDuration(song);
	function choose(id) {
		const next = communityPreset(id);
		patchSong(song.id, {
			outlet: id,
			compareDry: false
		});
		setMaster(song.id, "radio");
		patchVideo(song.id, {
			frame: next.frame,
			look: next.look,
			showTitle: true,
			showLyrics: next.lyrics,
			mirror: next.mirror
		});
		setMessage(null);
		setCopied(null);
	}
	function fit() {
		if (!take || !preset?.maxSeconds) return;
		patchVideo(song.id, { trimEnd: trimEndForMax(take.duration, song.video.trimStart, preset.maxSeconds) });
	}
	async function copy(kind, value) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(kind);
		} catch {
			setMessage("Merk teksten og kopier den selv.");
		}
	}
	async function downloadFilm() {
		if (!take || !preset) return;
		setBusy("film");
		setMessage(null);
		try {
			const blob = await getAudio(take.videoId);
			if (!blob) throw new Error("Fant ikke filmen på telefonen.");
			saveBlob(await renderEditedVideo({
				blob,
				trimStart: song.video.trimStart,
				trimEnd: song.video.trimEnd,
				look: song.video.look,
				frame: song.video.frame,
				mirror: song.video.mirror,
				title: song.title,
				lyrics: song.lyrics,
				showTitle: true,
				showLyrics: preset.lyrics
			}), `${fileSafe(song.title)}-${preset.id}.webm`);
			setMessage("Filmen er lastet ned i riktig format. Lim inn tittel og tekst i appen.");
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Kunne ikke lage filmen.");
		} finally {
			setBusy(null);
		}
	}
	async function downloadAudio() {
		const engineRef = engine.current;
		if (!engineRef || !preset) return;
		setBusy("lyd");
		setMessage(null);
		try {
			saveBlob(await engineRef.renderWav(song), `${fileSafe(song.title)}-${preset.id}.wav`);
			setMessage("Lyden er lastet ned, ferdig og samlet, slik den ligger ved siden av andre sanger.");
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Kunne ikke lage lydfilen.");
		} finally {
			setBusy(null);
		}
	}
	async function downloadPoster() {
		if (!take) return;
		setBusy("bilde");
		setMessage(null);
		try {
			const blob = await getAudio(take.videoId);
			if (!blob) throw new Error("Fant ikke filmen på telefonen.");
			saveBlob(await posterJpeg(blob, song.video.trimStart + 1, song.video.mirror), `${fileSafe(song.title)}-forside.jpg`);
			setMessage("Forsidebildet er lastet ned. Det passer under videoen på YouTube.");
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Kunne ikke lage forsidebildet.");
		} finally {
			setBusy(null);
		}
	}
	const tooLong = preset?.maxSeconds != null && seconds > preset.maxSeconds + .2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Legg ut",
			lede: "Velg hvor sangen skal bo. Bildet, lengden og teksten tilpasses. ThorSound legger ikke ut selv. Du limer inn."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: COMMUNITIES.map((item) => {
				const on = choice === item.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": on,
					onClick: () => choose(item.id),
					className: `min-h-11 rounded-md border px-4 py-3 text-left ${on ? "border-lamp bg-surface-2" : "border-line bg-surface"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: item.text
					})]
				}, item.id);
			})
		}),
		preset && pack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						preset.frame === "skjerm" ? "Liggende bilde." : "Stående bilde.",
						" Lyden settes til Radio, så den sitter sammen med andre sanger.",
						seconds > 0 ? ` Lengde nå: ${formatTime(seconds)}.` : ""
					]
				}),
				tooLong && preset.maxSeconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-lamp/40 bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Denne er ",
							formatTime(seconds),
							". ",
							preset.label,
							" treffer best under ",
							formatTime(preset.maxSeconds),
							"."
						]
					}), take ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						variant: "quiet",
						onClick: fit,
						children: ["Kutt til ", formatTime(preset.maxSeconds)]
					}) : null]
				}) : null,
				choice === "youtube" && seconds > 0 && seconds < 60 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Den er kort nok til Shorts, hvis du heller vil ha den stående."
				}) : null,
				choice === "smule" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Kode ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "code-mark text-lamp",
							children: song.roomCode
						}),
						". Den som vil synge med, skriver den på forsiden. Teksten går av seg selv."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm text-muted",
					htmlFor: "ut-tittel",
					children: "Tittel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "ut-tittel",
					readOnly: true,
					rows: 2,
					value: pack.title,
					className: "w-full rounded-md border border-line bg-surface px-4 py-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => void copy("tittel", pack.title),
					children: copied === "tittel" ? "Tittelen er kopiert" : "Kopier tittel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm text-muted",
					htmlFor: "ut-tekst",
					children: "Tekst til innlegget"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "ut-tekst",
					readOnly: true,
					rows: 6,
					value: pack.body,
					className: "w-full rounded-md border border-line bg-surface px-4 py-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => void copy("tekst", pack.body),
					children: copied === "tekst" ? "Teksten er kopiert" : "Kopier tekst"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void downloadFilm(),
							disabled: busy !== null || !take,
							children: busy === "film" ? "Klipper…" : "Last ned filmen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => void downloadAudio(),
							disabled: busy !== null,
							children: busy === "lyd" ? "Gjør klar…" : "Last ned lyden"
						}),
						choice === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => void downloadPoster(),
							disabled: busy !== null || !take,
							children: busy === "bilde" ? "Lager bilde…" : "Forsidebilde"
						}) : null
					]
				}),
				!take ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Uten kamera får du lyden. Ta opp bilde og lyd hvis du vil ha en film."
				}) : null
			]
		}) : null,
		message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: message
		}) : null
	] });
}
var TARGETS = [
	{
		id: "obs",
		label: "OBS Studio",
		text: "Teksten som et gjennomsiktig lag oppå kameraet ditt."
	},
	{
		id: "prism",
		label: "Prism",
		text: "Samme lag på telefon eller PC. Prism tar skjermen og sender."
	},
	{
		id: "samtale",
		label: "Videosamtale",
		text: "Meet, Zoom eller Discord. Teksten kan ligge oppå samtalen."
	},
	{
		id: "direkte",
		label: "Direkte",
		text: "YouTube og andre. OBS eller Prism sender. ThorSound gjør det ikke."
	}
];
function KoblePanel({ song }) {
	const link = useLyricLink();
	const live = (0, import_react.useRef)(link);
	live.current = link;
	const [target, setTarget] = (0, import_react.useState)("obs");
	const [note, setNote] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const wide = song.video.frame === "skjerm";
	const origin = typeof window === "undefined" ? "" : window.location.origin;
	const obsUrl = `${origin}/lag/${link.code}?ren=1`;
	const pictureUrl = `${origin}/lag/${link.code}?kamera=1`;
	async function copy(url) {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setNote("Lenken er kopiert. Lim den inn i programmet.");
		} catch {
			setNote(url);
		}
	}
	async function floatText() {
		const api = window.documentPictureInPicture;
		if (!api) {
			setNote("Her kan ikke teksten flyte oppå. Del fanen i samtalen, så ser de bildet.");
			return;
		}
		const pip = await api.requestWindow({
			width: 640,
			height: 320
		});
		const body = pip.document.body;
		body.style.margin = "0";
		body.style.background = "#0a1128";
		body.style.color = "#f4efea";
		body.style.fontFamily = "sans-serif";
		body.style.height = "100vh";
		body.style.display = "flex";
		body.style.flexDirection = "column";
		body.style.justifyContent = "flex-end";
		body.style.padding = "24px";
		const title = pip.document.createElement("p");
		title.style.margin = "0";
		title.style.color = "#2ec8e6";
		title.style.letterSpacing = "0.14em";
		title.style.textTransform = "uppercase";
		title.style.fontSize = "14px";
		const line = pip.document.createElement("p");
		line.style.margin = "8px 0 0";
		line.style.fontSize = "32px";
		line.style.lineHeight = "1.15";
		body.replaceChildren(title, line);
		const timer = window.setInterval(() => {
			const now = live.current;
			const lines = now.lines;
			const index = Math.min(lines.length - 1, Math.max(0, Math.round(now.index)));
			title.textContent = song.title || "Uten navn";
			line.textContent = lines[index] ?? "";
		}, 200);
		pip.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
		setNote("Teksten ligger oppå de andre vinduene. Del fanen hvis samtalen skal se bildet.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Koble bilde",
			lede: "OBS, Prism og videosamtale tar imot et bilde. ThorSound gir dem teksten og tittelen. Selve sendingen gjør de."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: TARGETS.map((item) => {
				const on = target === item.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": on,
					onClick: () => {
						setTarget(item.id);
						setCopied(false);
						setNote(null);
					},
					className: `min-h-11 rounded-md border px-4 py-3 text-left ${on ? "border-lamp bg-surface-2" : "border-line bg-surface"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: item.text
					})]
				}, item.id);
			})
		}),
		target === "obs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Åpne bildet. Si ja til kameraet. Trykk fullskjerm." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "I OBS: Kilder, Vindusfangst, og velg det vinduet." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Har du kamera i OBS fra før, kopier tekstlaget i stedet. Nettleserkilde, ",
					wide ? "1920 × 1080" : "1080 × 1920",
					", gjennomsiktig."
				] })
			]
		}) : null,
		target === "prism" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Åpne bildet og trykk fullskjerm." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "I Prism: ta skjermen, ikke bare kameraet. Da følger teksten med." })]
		}) : null,
		target === "samtale" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Åpne bildet. Det er det de skal se." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "I Meet, Zoom eller Discord: del det vinduet." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tekst oppå samtalen er til deg, så du ser ordene mens du snakker." })
			]
		}) : null,
		target === "direkte" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Koble teksten til OBS eller Prism, som over." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Der velger du YouTube eller en annen kanal og trykker send." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ThorSound ber ikke om strømmenøkkel, og sender ikke selv." })
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => window.open(pictureUrl, "lydvenn-bilde", "width=1280,height=720"),
					children: "Åpne bildet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => void copy(target === "obs" ? obsUrl : pictureUrl),
					children: copied ? "Kopiert" : target === "obs" ? "Kopier tekstlag" : "Kopier lenken"
				}),
				target === "samtale" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => void floatText(),
					children: "Tekst oppå samtalen"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Hold sangen åpen her, og trykk spill. Teksten i det andre programmet følger med."
		}),
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: note
		}) : null
	] });
}
function consult(song, ask) {
	const heard = song.tracks.filter((track) => activeTake(track));
	const name = song.title.trim() || "låten";
	const vocal = heard.find((track) => track.kind === "stemme" || track.kind === "samtidig" || track.kind === "kor");
	const hot = heard.find((track) => (activeTake(track)?.peak ?? 0) > .94);
	const quiet = heard.find((track) => {
		const take = activeTake(track);
		return !!take && take.peak < .06 && take.duration > .8;
	});
	const seconds = songDuration(song);
	if (ask === "hor") {
		if (heard.length === 0) return {
			text: "Jeg hører ingenting. Det er ikke anstrengelsesastma, det er et tomt spor. Ta opp stemmen, så kan jeg være frekk med grunn.",
			moves: [{
				id: "opp",
				label: "Ta opp",
				job: "opptak"
			}]
		};
		const notes = [
			hot ? `${hot.name} slår i taket.` : "",
			quiet ? `${quiet.name} er nesten borte.` : "",
			song.bpm >= 140 ? "Tempoet er en bakke." : "",
			!song.lyrics.trim() ? "Teksten er tom." : "",
			vocal?.room === "tort" ? "Stemmen står i et skap." : "",
			vocal?.trick && vocal.trick !== "ingen" ? `Du har allerede ${vocal.trick} på stemmen.` : ""
		].filter(Boolean);
		return {
			text: notes.length ? `Jeg har hørt på ${name}. ${notes.join(" ")} Resten kan få være. Frisbeegolf hadde vært verre.` : `Jeg har hørt på ${name}. Den står. Ikke rot den til med en runde til. Vil du, gjør vi den frekkere.`,
			moves: [
				...hot ? [{
					id: "nytt",
					label: "Ta et nytt forsøk",
					job: "opptak"
				}] : [],
				...quiet ? [{
					id: "bal",
					label: "Åpne balanse",
					job: "balanse"
				}] : [],
				{
					id: "frekk",
					label: "Gjør den frekk",
					tone: "radio",
					echo: "kort",
					twin: .4,
					even: .55,
					master: "radio"
				}
			]
		};
	}
	if (ask === "frekk") return {
		text: "Frekk er ikke høyere. Frekk er tettere. Radio på klangen, et kort ekko, og en tvilling rett bak deg. Du blir sittende. Det er poenget.",
		moves: [{
			id: "frekk",
			label: "Legg på det frekke",
			tone: "radio",
			echo: "kort",
			twin: .42,
			even: .55,
			master: "radio",
			room: "stue"
		}]
	};
	if (ask === "klar") {
		const gaps = [
			heard.length === 0 ? "Det finnes ikke noe å legge ut ennå." : "",
			seconds > 180 ? "Den er lengre enn tre minutter. Korte filmer orker ikke det." : "",
			!song.lyrics.trim() ? "Uten tekst blir Smule bare en film av deg som mimrer." : "",
			!activeVideoTake(song) ? "Det er lyd, men ikke bilde." : "",
			hot ? "Noe slår i taket. Det høres ikke dyrt ut, det høres ødelagt ut." : ""
		].filter(Boolean);
		return {
			text: gaps.length ? `${name} er ikke klar. ${gaps.join(" ")}` : `${name} kan gå. Velg hvor den skal bo, og lim inn selv. Jeg sender ingenting.`,
			moves: [
				...seconds > 180 ? [{
					id: "klipp",
					label: "Klipp den ned",
					job: "klipp"
				}] : [],
				...!song.lyrics.trim() ? [{
					id: "tekst",
					label: "Skriv teksten",
					job: "tekst"
				}] : [],
				...!activeVideoTake(song) ? [{
					id: "bilde",
					label: "Ta bilde",
					job: "bilde"
				}] : [],
				{
					id: "ut",
					label: "Velg sted",
					job: "ut"
				}
			]
		};
	}
	return {
		text: "Tre ting du kan prøve uten å reise deg. Telefonen ringer fra hull sju. Koret er deg, litt sein. Roboten puster i takt og trenger ikke inhalator. Nattkjøkkenet er stort og mykt.",
		moves: [
			{
				id: "telefon",
				label: "Anrop fra banen",
				trick: "telefon",
				room: "tort",
				tone: "radio"
			},
			{
				id: "kor",
				label: "To av deg",
				trick: "kor",
				room: "stue",
				twin: .35
			},
			{
				id: "robot",
				label: "Metallpust",
				trick: "robot",
				even: .35
			},
			{
				id: "natt",
				label: "Nattkjøkken",
				trick: "ingen",
				room: "kirke",
				echo: "syng",
				master: "myk",
				drums: "ballade"
			}
		]
	};
}
var ASKS = [
	{
		id: "hor",
		label: "Hva hører du?"
	},
	{
		id: "frekk",
		label: "Gjør den frekkere"
	},
	{
		id: "klar",
		label: "Klar for å legge ut?"
	},
	{
		id: "prov",
		label: "Gi meg noe å prøve"
	}
];
function applyMove(song, move, go) {
	const { patchTrack, setDrums, setMaster } = useStudio.getState();
	if (move.drums) setDrums(song.id, move.drums);
	if (move.master) setMaster(song.id, move.master);
	const patch = {};
	if (move.trick) patch.trick = move.trick;
	if (move.room) patch.room = move.room;
	if (move.echo) patch.echo = move.echo;
	if (move.tone) patch.tone = move.tone;
	if (typeof move.twin === "number") patch.twin = move.twin;
	if (typeof move.even === "number") patch.even = move.even;
	if (Object.keys(patch).length > 0) for (const track of song.tracks) patchTrack(song.id, track.id, patch);
	if (move.job && go) go(move.job);
}
function AdvisorPanel({ song, go }) {
	const [ask, setAsk] = (0, import_react.useState)("hor");
	const [shown, setShown] = (0, import_react.useState)(false);
	const answer = consult(song, ask);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Rådgiveren",
			lede: "ThorSound hører på det som ligger i låten og sier ifra. Han sitter i telefonen. Ingenting sendes ut."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: ASKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: shown && ask === item.id ? "primary" : "quiet",
				onClick: () => {
					setAsk(item.id);
					setShown(true);
				},
				children: item.label
			}, item.id))
		}),
		shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 border-l-2 border-lamp pl-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-lamp uppercase",
					children: "ThorSound sier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-lg leading-snug",
					children: answer.text
				}),
				answer.moves.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: answer.moves.map((move) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: () => applyMove(song, move, go),
						children: move.label
					}, move.id))
				}) : null
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 text-muted",
			children: "Spør ham. Han svarer ut fra denne låten, ikke ut fra en generell tale."
		})
	] });
}
function TryPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = song.tracks.find((item) => item.id === focusId) ?? song.tracks[0] ?? null;
	const ideas = consult(song, "prov").moves;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Prøv noe",
			lede: "Ett trykk, så hører du det. Telefon, kor eller robot. Angre er det samme trykket en gang til, på Ingen."
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track.id,
			onPick: setFocusId
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
			label: track.name,
			value: track.trick ?? "ingen",
			onChange: (trick) => patchTrack(song.id, track.id, { trick }),
			options: [
				{
					id: "ingen",
					label: "Ingen",
					text: "Slik sporet er, uten påfunn"
				},
				{
					id: "telefon",
					label: "Telefon",
					text: "Smalt og nært, som et anrop fra banen"
				},
				{
					id: "kor",
					label: "Kor",
					text: "Deg, litt sein, så det blir bredt"
				},
				{
					id: "robot",
					label: "Robot",
					text: "En metallisk pust under stemmen"
				}
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Ta opp noe først. Trommene under kan du likevel vekke."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-6 text-lg",
			children: "Hele stemningen"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Disse rører alle sporene, pluss rytme og ferdig lyd."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: ideas.map((move) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				onClick: () => applyMove(song, move),
				children: move.label
			}, move.id))
		})
	] });
}
function encodeWav(buffer) {
	const channels = Math.min(2, buffer.numberOfChannels);
	const sampleRate = buffer.sampleRate;
	const length = buffer.length;
	const block = channels * 2;
	const dataSize = length * block;
	const out = new ArrayBuffer(44 + dataSize);
	const view = new DataView(out);
	writeStr(view, 0, "RIFF");
	view.setUint32(4, 36 + dataSize, true);
	writeStr(view, 8, "WAVE");
	writeStr(view, 12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, channels, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * block, true);
	view.setUint16(32, block, true);
	view.setUint16(34, 16, true);
	writeStr(view, 36, "data");
	view.setUint32(40, dataSize, true);
	const chans = [];
	for (let c = 0; c < channels; c++) chans.push(buffer.getChannelData(c));
	let offset = 44;
	for (let i = 0; i < length; i++) for (let c = 0; c < channels; c++) {
		const sample = Math.max(-1, Math.min(1, chans[c][i] ?? 0));
		view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
		offset += 2;
	}
	return new Blob([out], { type: "audio/wav" });
}
function writeStr(view, offset, text) {
	for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}
function measureBuffer(buffer, bars = 72) {
	const data = buffer.getChannelData(0);
	const size = Math.max(1, Math.floor(data.length / bars));
	const peaks = [];
	let peak = 0;
	for (let i = 0; i < bars; i++) {
		let max = 0;
		const start = i * size;
		const end = Math.min(data.length, start + size);
		for (let j = start; j < end; j += 8) max = Math.max(max, Math.abs(data[j] ?? 0));
		peaks.push(max);
		peak = Math.max(peak, max);
	}
	return {
		peaks,
		peak
	};
}
var MAX_SECONDS = 1200;
async function cleanSpeech(blob) {
	const ctx = new AudioContext();
	try {
		const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
		if (decoded.duration > MAX_SECONDS) throw new Error("For langt. Klipp det ned til tjue minutter.");
		const lifted = gateAndLift(await filterVoice(mixMono(decoded), decoded.sampleRate), decoded.sampleRate);
		const listenBuf = ctx.createBuffer(1, lifted.length, decoded.sampleRate);
		listenBuf.getChannelData(0).set(lifted);
		const speechBuf = speechBuffer(resampleLinear(lifted, decoded.sampleRate, 16e3), 16e3);
		return {
			listen: encodeWav(listenBuf),
			speech: encodeWav(speechBuf),
			duration: decoded.duration
		};
	} finally {
		await ctx.close();
	}
}
function mixMono(buffer) {
	const out = new Float32Array(buffer.length);
	const channels = buffer.numberOfChannels;
	for (let c = 0; c < channels; c++) {
		const data = buffer.getChannelData(c);
		for (let i = 0; i < data.length; i++) out[i] += data[i] / channels;
	}
	return out;
}
async function filterVoice(samples, sampleRate) {
	const offline = new OfflineAudioContext(1, samples.length, sampleRate);
	const buffer = offline.createBuffer(1, samples.length, sampleRate);
	buffer.getChannelData(0).set(samples);
	const src = offline.createBufferSource();
	src.buffer = buffer;
	const high = offline.createBiquadFilter();
	high.type = "highpass";
	high.frequency.value = 110;
	high.Q.value = .7;
	const mud = offline.createBiquadFilter();
	mud.type = "peaking";
	mud.frequency.value = 240;
	mud.gain.value = -4;
	mud.Q.value = .7;
	const presence = offline.createBiquadFilter();
	presence.type = "peaking";
	presence.frequency.value = 2800;
	presence.gain.value = 4.5;
	presence.Q.value = .9;
	const low = offline.createBiquadFilter();
	low.type = "lowpass";
	low.frequency.value = 7200;
	const comp = offline.createDynamicsCompressor();
	comp.threshold.value = -26;
	comp.knee.value = 12;
	comp.ratio.value = 5;
	comp.attack.value = .004;
	comp.release.value = .22;
	src.connect(high).connect(mud).connect(presence).connect(low).connect(comp).connect(offline.destination);
	src.start();
	return (await offline.startRendering()).getChannelData(0).slice();
}
function gateAndLift(samples, sampleRate) {
	const hop = Math.max(1, Math.floor(sampleRate * .01));
	const frame = hop * 2;
	const rms = [];
	for (let i = 0; i < samples.length; i += hop) {
		let sum = 0;
		const end = Math.min(samples.length, i + frame);
		for (let j = i; j < end; j++) sum += samples[j] * samples[j];
		rms.push(Math.sqrt(sum / (end - i)));
	}
	const sorted = [...rms].sort((a, b) => a - b);
	const noise = sorted[Math.floor(sorted.length * .2)] ?? .01;
	const open = Math.max(noise * 2.6, .012);
	const out = new Float32Array(samples.length);
	let gain = .08;
	for (let i = 0; i < samples.length; i++) {
		const target = (rms[Math.min(rms.length - 1, Math.floor(i / hop))] ?? 0) < open ? .05 : 1;
		gain += (target - gain) * (target > gain ? .03 : .004);
		out[i] = samples[i] * gain;
	}
	let peak = 0;
	for (let i = 0; i < out.length; i++) peak = Math.max(peak, Math.abs(out[i]));
	const lift = peak > .001 ? Math.min(.82 / peak, 4) : 1;
	for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i] * lift);
	return out;
}
function resampleLinear(samples, from, to) {
	const length = Math.max(1, Math.ceil(samples.length / from * to));
	const out = new Float32Array(length);
	const ratio = from / to;
	const last = samples.length - 1;
	for (let i = 0; i < length; i++) {
		const pos = Math.min(last, i * ratio);
		const i0 = Math.floor(pos);
		const i1 = Math.min(last, i0 + 1);
		const frac = pos - i0;
		out[i] = samples[i0] * (1 - frac) + samples[i1] * frac;
	}
	return out;
}
function speechBuffer(samples, sampleRate) {
	const buffer = new OfflineAudioContext(1, samples.length, sampleRate).createBuffer(1, samples.length, sampleRate);
	buffer.getChannelData(0).set(samples);
	return buffer;
}
function CleanPanel({ song, go }) {
	const setLyrics = useStudio((state) => state.setLyrics);
	const [source, setSource] = (0, import_react.useState)(null);
	const [sourceName, setSourceName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [listenUrl, setListenUrl] = (0, import_react.useState)("");
	const [listenBlob, setListenBlob] = (0, import_react.useState)(null);
	const urlRef = (0, import_react.useRef)("");
	const takes = song.tracks.flatMap((track) => track.takes.map((take) => ({
		id: take.audioId,
		label: `${track.name} · ${Math.round(take.duration)}s`
	})));
	(0, import_react.useEffect)(() => () => {
		if (urlRef.current) URL.revokeObjectURL(urlRef.current);
	}, []);
	async function run() {
		if (!source || busy) return;
		setBusy("Renser…");
		setError("");
		setNote("");
		try {
			const cleaned = await cleanSpeech(source);
			if (urlRef.current) URL.revokeObjectURL(urlRef.current);
			const url = URL.createObjectURL(cleaned.listen);
			urlRef.current = url;
			setListenBlob(cleaned.listen);
			setListenUrl(url);
			setBusy("Skriver teksten…");
			const form = new FormData();
			form.append("file", cleaned.speech, "tale.wav");
			const res = await fetch("/api/transcribe", {
				method: "POST",
				body: form
			});
			const body = await res.json();
			if (!res.ok || !body.ok || !body.text) {
				setText("");
				setError(body.error || "Lyden er renset. Teksten kom ikke.");
				return;
			}
			setText(body.text);
			setNote("Lyden er renset. Les gjennom teksten før du bruker den.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Klarte ikke å lese filen.");
		} finally {
			setBusy("");
		}
	}
	async function mail() {
		const title = song.title || "Samtale";
		const body = `${title}\n\n${text}`;
		if (body.length > 1800) {
			await navigator.clipboard.writeText(body);
			window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Teksten er kopiert. Lim den inn her.")}`;
			setNote("Teksten var lang, så den ligger i utklippstavlen. Lim den inn i e-posten.");
			return;
		}
		window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Rens og tekst",
			lede: "Lomme, asfalt og den som puster i mikrofonen blir svakere. Stemmene blir stående. Teksten kan bli sangtekst, eller en e-post. Opptil tjue minutter."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block text-sm",
			children: ["Lydfil", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "audio/*",
				className: "mt-1 block w-full text-sm",
				onChange: (event) => {
					const file = event.target.files?.[0] ?? null;
					setSource(file);
					setSourceName(file?.name ?? "");
					setError("");
				}
			})]
		}),
		takes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Eller et opptak i låten"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: takes.map((take) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: sourceName === take.label ? "primary" : "quiet",
					onClick: () => {
						getAudio(take.id).then((blob) => {
							if (!blob) {
								setError("Fant ikke opptaket.");
								return;
							}
							setSource(blob);
							setSourceName(take.label);
							setError("");
						});
					},
					children: take.label
				}, take.id))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: sourceName || "Ingen lyd valgt."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			disabled: !source || Boolean(busy),
			onClick: () => void run(),
			children: busy || "Rens og skriv tekst"
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-signal",
			children: error
		}) : null,
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: note
		}) : null,
		listenUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			className: "mt-4 w-full",
			controls: true,
			src: listenUrl
		}) : null,
		listenBlob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-2",
			variant: "quiet",
			onClick: () => {
				const url = URL.createObjectURL(listenBlob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${song.title || "samtale"}-rent.wav`;
				link.click();
				URL.revokeObjectURL(url);
			},
			children: "Last ned ren lyd"
		}) : null,
		text || listenUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: text,
			onChange: (event) => setText(event.target.value),
			rows: 10,
			"aria-label": "Tekst fra samtalen",
			placeholder: "Teksten kommer her.",
			className: "mt-4 w-full rounded-md border border-line px-4 py-3 text-sm leading-relaxed"
		}) : null,
		text ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setLyrics(song.id, text);
					go("tekst");
				},
				children: "Bruk som sangtekst"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				onClick: () => void mail(),
				children: "Send på e-post"
			})]
		}) : null
	] });
}
var KINDS = [
	{
		id: "samtidig",
		label: "Samtidig",
		text: "Syng og spill i ett opptak"
	},
	{
		id: "stemme",
		label: "Bare stemme",
		text: "Mikrofonen nær munnen"
	},
	{
		id: "gitar",
		label: "Bare gitar",
		text: "Et spor du kan legge sang oppå"
	},
	{
		id: "piano",
		label: "Piano",
		text: "Eller et annet tangentinstrument"
	},
	{
		id: "kor",
		label: "Kor",
		text: "En stemme til, over eller under"
	},
	{
		id: "annet",
		label: "Annet",
		text: "Det instrumentet du har i hånda"
	}
];
var SECTION_NAMES = [
	"intro",
	"vers",
	"refreng",
	"bro",
	"outro"
];
function focusedTrack(song, focusId) {
	return song.tracks.find((track) => track.id === focusId) ?? song.tracks[0] ?? null;
}
function levelText(level, listening) {
	if (!listening) return "Trykk under, og snakk eller spill som du skal gjøre på opptaket.";
	if (level > .9) return "For sterkt. Litt lenger unna mikrofonen.";
	if (level < .06) return "Vi hører nesten ingenting. Kom nærmere.";
	return "Bra styrke. Sånn skal det ligge.";
}
function JobPanel({ job, ...props }) {
	switch (job) {
		case "opptak": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordPanel, { ...props });
		case "monitor": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorPanel, { ...props });
		case "tempo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TempoPanel, { ...props });
		case "trommer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrumPanel, { ...props });
		case "grep": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyPanel, { ...props });
		case "tekst": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsPanel, { ...props });
		case "sammen": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SammenPanel, { song: props.song });
		case "ut": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtPanel, {
			song: props.song,
			engine: props.engine
		});
		case "koble": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KoblePanel, { song: props.song });
		case "prov": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TryPanel, {
			song: props.song,
			focusId: props.focusId,
			setFocusId: props.setFocusId
		});
		case "ai": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvisorPanel, {
			song: props.song,
			go: props.go
		});
		case "utstyr": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearGuide, { go: props.go });
		case "rens": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CleanPanel, {
			song: props.song,
			go: props.go
		});
		case "deler": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionsPanel, { ...props });
		case "forsok": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TakesPanel, { ...props });
		case "klipp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrimPanel, { ...props });
		case "balanse": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalancePanel, { ...props });
		case "tone": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TonePanel, { ...props });
		case "jevn": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvenPanel, { ...props });
		case "rom": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomPanel, { ...props });
		case "ekko": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EchoPanel, { ...props });
		case "sus": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HushPanel, { ...props });
		case "tvilling": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TwinPanel, { ...props });
		case "ab": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparePanel, { ...props });
		case "ferdig": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterPanel, { ...props });
		case "rad": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvicePanel, { ...props });
		case "del": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SharePanel, { ...props });
		case "bilde": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BildePanel, { ...props });
		case "sending": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendingPanel, { ...props });
		case "filmklipp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilmklippPanel, { ...props });
		case "filmlagre": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilmLagrePanel, { ...props });
		default: return null;
	}
}
function RecordPanel({ song, engine, snap }) {
	const [kind, setKind] = (0, import_react.useState)("samtidig");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [localError, setLocalError] = (0, import_react.useState)(null);
	const trackRef = (0, import_react.useRef)(null);
	const ensureTrack = useStudio((state) => state.ensureTrack);
	const addTrack = useStudio((state) => state.addTrack);
	const addTake = useStudio((state) => state.addTake);
	const vocal = kind === "stemme" || kind === "kor" || kind === "samtidig";
	async function start(asNew) {
		setLocalError(null);
		trackRef.current = asNew ? addTrack(song.id, kind) : ensureTrack(song.id, kind);
		await engine.current?.beginRecord();
	}
	async function finish() {
		setSaving(true);
		setLocalError(null);
		try {
			const blob = await engine.current?.endRecord();
			const trackId = trackRef.current;
			if (!blob || !trackId) throw new Error("Opptaket ble tomt. Prøv en gang til.");
			const meta = await engine.current.decodeTake(blob);
			addTake(song.id, trackId, {
				id: crypto.randomUUID(),
				createdAt: Date.now(),
				...meta
			});
		} catch (err) {
			setLocalError(err instanceof Error ? err.message : "Kunne ikke lagre opptaket.");
		} finally {
			setSaving(false);
		}
	}
	const busy = snap.counting || snap.recording || saving;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Ta opp",
			lede: "Headset på, så høyttaleren ikke blir med. Telefonen teller fire slag. Så tar den opp."
		}),
		!busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 grid grid-cols-2 gap-2",
			children: KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": kind === item.id,
				onClick: () => setKind(item.id),
				className: kind === item.id ? "min-h-11 rounded-md border border-lamp bg-surface-2 px-3 py-3 text-left" : "min-h-11 rounded-md border border-line bg-surface px-3 py-3 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-medium",
					children: item.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-muted",
					children: item.text
				})]
			}, item.id))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center gap-4 py-4",
			children: snap.counting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-6xl tabular-nums text-lamp",
					children: snap.countLeft ?? 4
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Gjør deg klar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => engine.current?.cancelRecord(),
					children: "Avbryt"
				})
			] }) : snap.recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-28 items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink",
				onClick: () => void finish(),
				children: "Stopp"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordClock, {})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-28 items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink",
				onClick: () => void start(false),
				disabled: saving,
				children: "Ta opp"
			})
		}),
		(snap.listening || snap.recording || snap.counting) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { level: snap.level }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: levelText(snap.level, true)
				}),
				vocal && snap.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-2xl",
					children: [
						snap.note,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base text-muted",
							children: snap.hint
						})
					]
				}) : null
			]
		}),
		localError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-signal",
			children: localError
		}) : null,
		song.lyrics.trim() && (snap.recording || snap.counting || snap.playing) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prompter, {
				compact: true,
				lines: lyricLines(song.lyrics),
				index: lyricIndex(song, snap.position)
			})
		}) : null,
		!busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => void start(true),
				children: "Legg som nytt spor"
			})
		}) : null
	] });
}
function RecordClock() {
	const started = (0, import_react.useRef)(performance.now());
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setSeconds((performance.now() - started.current) / 1e3), 200);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "tabular-nums text-muted",
		children: formatTime(seconds)
	});
}
function MonitorPanel({ engine, snap }) {
	(0, import_react.useEffect)(() => () => engine.current?.stopListen(), [engine]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Sjekk mikrofon",
			lede: "Lyden går ikke ut i høyttaleren. Stolpen skal ligge i midten når du snakker normalt."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: snap.listening ? "quiet" : "primary",
			onClick: () => snap.listening ? engine.current?.stopListen() : void engine.current?.startListen(),
			children: snap.listening ? "Slutt å lytte" : "Lytt til mikrofonen"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { level: snap.level }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: levelText(snap.level, snap.listening)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-6 space-y-2 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Headset på hodet, ikke mikrofonen mot en høyttaler." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Syng og spill så høyt som du skal gjøre på ordentlig." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Rød stolpe betyr for nærme. Nesten tom stolpe betyr for langt unna." })
			]
		})
	] });
}
function TempoPanel({ song }) {
	const setBpm = useStudio((state) => state.setBpm);
	const setClick = useStudio((state) => state.setClick);
	const taps = (0, import_react.useRef)([]);
	function tap() {
		const now = performance.now();
		taps.current = [...taps.current.filter((time) => now - time < 2200), now];
		if (taps.current.length < 2) return;
		const gaps = [];
		for (let i = 1; i < taps.current.length; i++) gaps.push(taps.current[i] - taps.current[i - 1]);
		const avg = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
		setBpm(song.id, Math.round(6e4 / avg));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Tempo og klikk",
			lede: "Tempo er hvor fort låten går. Ikke hvor fort du kommer deg til hull fire. Klikket er noe å spille mot, sittende."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-6xl tabular-nums",
			children: song.bpm
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: "slag i minuttet"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			label: "Tempo",
			min: 60,
			max: 180,
			value: song.bpm,
			display: String(song.bpm),
			onChange: (value) => setBpm(song.id, value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				onClick: tap,
				children: "Bank tempo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: song.click ? "primary" : "quiet",
				onClick: () => setClick(song.id, !song.click),
				"aria-pressed": song.click,
				children: song.click ? "Klikk er på" : "Klikk er av"
			})]
		})
	] });
}
function DrumPanel({ song }) {
	const setDrums = useStudio((state) => state.setDrums);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Trommer",
		lede: "En rytme å hvile sangen på. Skru dem av når du vil være alene. De klager ikke, og de peser ikke."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
		value: song.drums,
		onChange: (drums) => setDrums(song.id, drums),
		options: [
			{
				id: "ingen",
				label: "Ingen",
				text: "Bare det du spiller selv"
			},
			{
				id: "ro",
				label: "Ro",
				text: "Jevn og stille, fin til sang og gitar"
			},
			{
				id: "sprett",
				label: "Sprett",
				text: "Lettere på tå, mer fart"
			},
			{
				id: "ballade",
				label: "Ballade",
				text: "Store slag, god plass mellom"
			}
		]
	})] });
}
function KeyPanel({ song, engine, snap }) {
	const setKey = useStudio((state) => state.setKey);
	const info = keyInfo(song.keyName);
	const [tab, setTab] = (0, import_react.useState)("akkorder");
	const [stringId, setStringId] = (0, import_react.useState)("A2");
	const [hearing, setHearing] = (0, import_react.useState)(null);
	const target = STRINGS.find((item) => item.id === stringId) ?? STRINGS[1];
	const cents = snap.listening && snap.freq ? stringCents(snap.freq, target.freq) : null;
	const near = snap.listening && snap.freq ? nearestString(snap.freq) : null;
	const inTune = cents !== null && Math.abs(cents) <= 8;
	const others = OPEN_CHORDS.filter((chord) => !info.chords.some((own) => own.name === chord.name));
	(0, import_react.useEffect)(() => () => {
		engine.current?.stopListen();
		engine.current?.stopChords();
		engine.current?.reference(null);
	}, [engine]);
	function hearString(id) {
		const next = STRINGS.find((item) => item.id === id);
		if (!next) return;
		setStringId(id);
		if (hearing === id) {
			engine.current?.reference(null);
			setHearing(null);
			return;
		}
		engine.current?.reference(next.freq);
		setHearing(id);
	}
	let tuneText = "Velg en streng. Spill den. Nålen skal ligge i midten.";
	if (snap.listening && cents === null) tuneText = "Jeg hører ingenting ennå. Plukk strengen.";
	else if (cents !== null && Math.abs(cents) > 60) tuneText = near && near.id !== target.id ? `Det er ikke denne. Nærmest er ${near.name}.` : "Det er ikke denne strengen.";
	else if (inTune) tuneText = "Der. Den stemmer.";
	else if (cents !== null && cents < 0) tuneText = "Litt slakk. Stram forsiktig.";
	else if (cents !== null) tuneText = "Litt stram. Slipp forsiktig.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Akkorder og stemming",
			lede: "Spill grepa som en gitar, i låtens tempo. Stem strengene mot en tone, ikke mot hukommelsen."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": tab === "akkorder",
				onClick: () => setTab("akkorder"),
				className: tab === "akkorder" ? "min-h-11 rounded-md border border-lamp bg-surface-2" : "min-h-11 rounded-md border border-line bg-surface",
				children: "Akkorder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": tab === "stemmer",
				onClick: () => setTab("stemmer"),
				className: tab === "stemmer" ? "min-h-11 rounded-md border border-lamp bg-surface-2" : "min-h-11 rounded-md border border-line bg-surface",
				children: "Stemmer"
			})]
		}),
		tab === "akkorder" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": song.keyName === key.id,
					onClick: () => setKey(song.id, key.id),
					className: song.keyName === key.id ? "min-h-11 min-w-11 rounded-md border border-lamp bg-surface-2 px-3" : "min-h-11 min-w-11 rounded-md border border-line bg-surface px-3",
					children: key.id
				}, key.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-2",
				children: info.chords.map((chord, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						engine.current?.stopChords();
						engine.current?.strum(chord.freqs);
					},
					className: snap.chords && snap.chordIndex === index ? "min-h-16 rounded-md border border-lamp bg-surface-2 font-display text-2xl" : "min-h-16 rounded-md border border-line bg-surface font-display text-2xl",
					children: chord.name
				}, chord.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"Ett grep per takt. ",
					song.bpm,
					" slag."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3 w-full",
				onClick: () => snap.chords ? engine.current?.stopChords() : engine.current?.loopChords(info.chords.map((chord) => chord.freqs), song.bpm),
				children: snap.chords ? "Stopp runden" : "Spill runden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-medium",
				children: "Andre grep"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-4 gap-2",
				children: others.map((chord) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						engine.current?.stopChords();
						engine.current?.strum(chord.freqs);
					},
					className: "min-h-12 rounded-md border border-line bg-surface font-display text-lg",
					children: chord.name
				}, chord.name))
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-6 gap-1.5",
				children: STRINGS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": stringId === item.id,
					"aria-label": `${item.name}-streng${hearing === item.id ? ", referansetone på" : ""}`,
					onClick: () => hearString(item.id),
					className: stringId === item.id ? "flex min-h-16 flex-col items-center justify-center rounded-md border border-lamp bg-surface-2" : "flex min-h-16 flex-col items-center justify-center rounded-md border border-line bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: item.name
					}), hearing === item.id || item.id === "E2" || item.id === "E4" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[10px] ${hearing === item.id ? "text-lamp" : "text-muted"}`,
						children: hearing === item.id ? "lyd" : item.id === "E2" ? "lav" : "lys"
					}) : null]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Trykk en streng for å høre den. Trykk igjen for å slå den av."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 h-3 rounded-full bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 left-1/2 h-3 w-px bg-lamp" }), cents !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${inTune ? "bg-lamp" : "bg-signal"}`,
					style: { left: `${50 + Math.max(-50, Math.min(50, cents))}%` }
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-display text-4xl",
				children: [
					snap.listening ? snap.note ?? "…" : target.name,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg text-muted",
						children: cents === null ? "" : `${cents > 0 ? "+" : ""}${cents} cent`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: tuneText
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				variant: snap.listening ? "quiet" : "primary",
				onClick: () => snap.listening ? engine.current?.stopListen() : void engine.current?.startListen(),
				children: snap.listening ? "Slutt å lytte" : "Lytt til strengen"
			})
		] })
	] });
}
function LyricsPanel({ song }) {
	const setLyrics = useStudio((state) => state.setLyrics);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Tekst",
		lede: "Skriv som du vil. Vers og refreng kan stå som overskrifter. Teksten blir stor når du tar opp, så du slipper å huske den i motvind."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value: song.lyrics,
		onChange: (event) => setLyrics(song.id, event.target.value),
		rows: 12,
		"aria-label": "Tekst",
		className: "w-full rounded-md border border-line px-4 py-3 font-display text-xl leading-snug"
	})] });
}
function SectionsPanel({ song }) {
	const addSection = useStudio((state) => state.addSection);
	const updateSection = useStudio((state) => state.updateSection);
	const moveSection = useStudio((state) => state.moveSection);
	const removeSection = useStudio((state) => state.removeSection);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Delene i låten",
			lede: "Formen er kartet. Åtte takter er et vanlig vers. Du kan flytte delene opp og ned."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-3",
			children: song.sections.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							"aria-label": `Del ${index + 1}`,
							value: section.name,
							onChange: (event) => updateSection(song.id, section.id, { name: event.target.value }),
							className: "min-h-11 rounded-full border border-line px-3",
							children: SECTION_NAMES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: name,
								children: SECTION_LABEL[name]
							}, name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted tabular-nums",
							children: [section.bars, " takter"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => updateSection(song.id, section.id, { bars: Math.max(1, section.bars - 1) }),
							children: "Færre"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => updateSection(song.id, section.id, { bars: Math.min(32, section.bars + 1) }),
							children: "Flere"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							"aria-label": "Flytt opp",
							onClick: () => moveSection(song.id, section.id, -1),
							disabled: index === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							"aria-label": "Flytt ned",
							onClick: () => moveSection(song.id, section.id, 1),
							disabled: index === song.sections.length - 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => removeSection(song.id, section.id),
							children: "Fjern"
						})
					]
				})]
			}, section.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: SECTION_NAMES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "quiet",
				onClick: () => addSection(song.id, name),
				children: ["Legg til ", SECTION_LABEL[name].toLowerCase()]
			}, name))
		})
	] });
}
function TakesPanel({ song }) {
	const useTake = useStudio((state) => state.useTake);
	const removeTake = useStudio((state) => state.removeTake);
	if (song.tracks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Velg forsøk",
		lede: "Når du har tatt opp mer enn én gang, velger du hvilken som skal være med."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Ingen spor ennå."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Velg forsøk",
		lede: "Et forsøk er ett opptak. Den som er merket, er den som høres. De andre blir liggende."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: song.tracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-lg",
				children: track.name
			}),
			track.takes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Ingen opptak."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: track.takes.map((take, index) => {
					const on = take.id === track.activeTakeId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-line bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Forsøk ", index + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-muted",
									children: formatTime(take.duration)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wave, { peaks: take.peaks }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: on ? "primary" : "quiet",
									onClick: () => useTake(song.id, track.id, take.id),
									"aria-pressed": on,
									children: on ? "Brukes nå" : "Bruk denne"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									"aria-label": "Slett forsøk",
									onClick: () => removeTake(song.id, track.id, take.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})
						]
					}, take.id);
				})
			})
		] }, track.id))
	})] });
}
function TrimPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	const take = track ? activeTake(track) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Klipp",
			lede: "Dra bort det som er stille før du begynner, og det som henger igjen etterpå. Selve spillet blir liggende."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track && take ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wave, { peaks: take.peaks }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					label: "Kutt starten",
					min: 0,
					max: Math.max(0, take.duration - track.trimEnd - .1),
					step: .1,
					value: track.trimStart,
					display: formatTime(track.trimStart),
					onChange: (value) => patchTrack(song.id, track.id, { trimStart: value })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					label: "Kutt slutten",
					min: 0,
					max: Math.max(0, take.duration - track.trimStart - .1),
					step: .1,
					value: track.trimEnd,
					display: formatTime(track.trimEnd),
					onChange: (value) => patchTrack(song.id, track.id, { trimEnd: value })
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Dette sporet har ikke et opptak å klippe."
		})
	] });
}
function BalancePanel({ song }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const removeTrack = useStudio((state) => state.removeTrack);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Balanse",
			lede: "Stemmen skal som regel sitte foran gitaren. Hysj skrur et spor av. Bare denne hører du alene."
		}),
		song.tracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Ingen spor ennå."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-4",
			children: song.tracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: track.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: KIND_LABEL[track.kind]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Styrke",
						min: 0,
						max: 100,
						value: Math.round(track.volume * 100),
						display: String(Math.round(track.volume * 100)),
						onChange: (value) => patchTrack(song.id, track.id, { volume: value / 100 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: track.muted ? "primary" : "quiet",
								"aria-pressed": track.muted,
								onClick: () => patchTrack(song.id, track.id, { muted: !track.muted }),
								children: track.muted ? "Er stille" : "Hysj"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: track.solo ? "primary" : "quiet",
								"aria-pressed": track.solo,
								onClick: () => patchTrack(song.id, track.id, { solo: !track.solo }),
								children: "Bare denne"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => removeTrack(song.id, track.id),
								children: "Slett spor"
							})
						]
					})
				]
			}, track.id))
		})
	] });
}
function TonePanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Tone",
			lede: "Dette er klang, ikke volum. Varm er mørkere. Klar løfter stemmen. Radio er den som skjærer gjennom."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
			value: track.tone,
			onChange: (tone) => patchTrack(song.id, track.id, { tone }),
			options: [
				{
					id: "rett",
					label: "Rett",
					text: "Slik mikrofonen hørte det"
				},
				{
					id: "varm",
					label: "Varm",
					text: "Mer kropp, mindre skarphet"
				},
				{
					id: "klar",
					label: "Klar",
					text: "Ordene blir lettere å høre"
				},
				{
					id: "radio",
					label: "Radio",
					text: "Tett og tydelig, litt mer push"
				}
			]
		}) : null
	] });
}
function EvenPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Jevn lyd",
			lede: "Hvisking og roping kommer nærmere hverandre. Mye jevning kan høres klemt ut. Litt er ofte nok."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			label: "Hvor jevnt",
			min: 0,
			max: 100,
			value: Math.round(track.even * 100),
			display: Math.round(track.even * 100) < 25 ? "lite" : Math.round(track.even * 100) > 70 ? "mye" : "passe",
			onChange: (value) => patchTrack(song.id, track.id, { even: value / 100 })
		}) : null
	] });
}
function RoomPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Romklang",
			lede: "Et tørt opptak høres ut som et skap. Stue er det de fleste sanger vil ha. Kirke er til det som skal være stort."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
			value: track.room,
			onChange: (room) => patchTrack(song.id, track.id, { room }),
			options: [
				{
					id: "tort",
					label: "Tørt",
					text: "Ingen ekstra rom"
				},
				{
					id: "stue",
					label: "Stue",
					text: "Litt luft rundt stemmen"
				},
				{
					id: "scene",
					label: "Scene",
					text: "Som et lite lokale"
				},
				{
					id: "kirke",
					label: "Kirke",
					text: "Langt og stort"
				}
			]
		}) : null
	] });
}
function EchoPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Ekko",
			lede: "Et kort ekko svarer med en gang. Syng-med følger tempoet, som en stemme et lite stykke bak."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
			value: track.echo,
			onChange: (echo) => patchTrack(song.id, track.id, { echo }),
			options: [
				{
					id: "av",
					label: "Av",
					text: "Ingen ekko"
				},
				{
					id: "kort",
					label: "Kort",
					text: "Et raskt svar"
				},
				{
					id: "syng",
					label: "Syng-med",
					text: "Følger slagene i låten"
				}
			]
		}) : null
	] });
}
function HushPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Sus og romling",
			lede: "Tar ned brum fra rommet og smålyder mellom setningene. For mye spiser av gitaren og pusten."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			label: "Hvor mye som dempes",
			min: 0,
			max: 100,
			value: Math.round(track.hush * 100),
			display: String(Math.round(track.hush * 100)),
			onChange: (value) => patchTrack(song.id, track.id, { hush: value / 100 })
		}) : null
	] });
}
function TwinPanel({ song, focusId, setFocusId }) {
	const patchTrack = useStudio((state) => state.patchTrack);
	const track = focusedTrack(song, focusId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Tvillingstemme",
			lede: "Ikke automatisk rensing av toner. En myk kopi like ved siden av, så én stemme høres fyldigere ut. Ekte kor tar du opp selv."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackChips, {
			song,
			trackId: track?.id ?? null,
			onPick: setFocusId
		}),
		track ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			label: "Hvor tydelig tvillingen er",
			min: 0,
			max: 100,
			value: Math.round(track.twin * 100),
			display: String(Math.round(track.twin * 100)),
			onChange: (value) => patchTrack(song.id, track.id, { twin: value / 100 })
		}) : null
	] });
}
function ComparePanel({ song }) {
	const setCompareDry = useStudio((state) => state.setCompareDry);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Før og etter",
		lede: "Samme opptak. Før er uten klang, jevning og ferdig lyd. Etter er slik produsenten har satt det. Balanse og trommer blir."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
		value: song.compareDry ? "for" : "etter",
		onChange: (value) => setCompareDry(song.id, value === "for"),
		options: [{
			id: "etter",
			label: "Etter",
			text: "Med tone, rom, jevning og ferdig lyd"
		}, {
			id: "for",
			label: "Før",
			text: "Rått opptak, bare styrke"
		}]
	})] });
}
function MasterPanel({ song }) {
	const setMaster = useStudio((state) => state.setMaster);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Ferdig lyd",
		lede: "Det siste en produsent gjør: få låten til å sitte samlet, uten at du drar i ti knotter."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choices, {
		value: song.master,
		onChange: (master) => setMaster(song.id, master),
		options: [
			{
				id: "hjemme",
				label: "Hjemme",
				text: "Nær og ærlig, lite pynt"
			},
			{
				id: "radio",
				label: "Radio",
				text: "Tydeligere og mer samlet"
			},
			{
				id: "myk",
				label: "Myk",
				text: "Varmere, mindre skarp"
			}
		]
	})] });
}
function AdvicePanel({ song, go }) {
	const notes = producerAdvice(song);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
		title: "Produsentens råd",
		lede: "Ikke en fasit. Bare det jeg hadde sagt hvis jeg satt ved siden av deg."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-3",
		children: notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => go(note.job),
			className: "w-full rounded-md border border-line bg-surface px-4 py-3 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-medium",
				children: note.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-muted",
				children: note.text
			})]
		}) }, note.id))
	})] });
}
function SharePanel({ song, engine }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	async function makeFile() {
		const engineRef = engine.current;
		if (!engineRef) return null;
		setBusy(true);
		setMessage(null);
		try {
			const blob = await engineRef.renderWav(song);
			const name = `${safeName(song.title)}.wav`;
			return new File([blob], name, { type: "audio/wav" });
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Kunne ikke lage lydfilen.");
			return null;
		} finally {
			setBusy(false);
		}
	}
	async function download() {
		const file = await makeFile();
		if (!file) return;
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = file.name;
		link.click();
		URL.revokeObjectURL(url);
		setMessage("Lydfilen er lastet ned, slik låten høres ut nå.");
	}
	async function share() {
		const file = await makeFile();
		if (!file) return;
		const nav = navigator;
		if (nav.share && nav.canShare?.({ files: [file] })) {
			await nav.share({
				files: [file],
				title: song.title
			});
			return;
		}
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = file.name;
		link.click();
		URL.revokeObjectURL(url);
		setMessage("Deling fra nettleseren finnes ikke her. Filen ble lastet ned i stedet.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Lagre og del",
			lede: "Låtene blir liggende i denne nettleseren, på telefonen. En lydfil kan du sende til noen, eller ta med videre."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void download(),
				disabled: busy,
				children: busy ? "Gjør klar…" : "Last ned lydfil"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				onClick: () => void share(),
				disabled: busy,
				children: "Del"
			})]
		}),
		message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: message
		}) : null
	] });
}
function safeName(title) {
	return title.replace(/[^\p{L}\p{N}\-_ ]/gu, "").trim() || "lat";
}
var EMPTY_SNAP = {
	playing: false,
	recording: false,
	counting: false,
	listening: false,
	countLeft: null,
	position: 0,
	level: 0,
	note: null,
	hint: null,
	freq: null,
	chords: false,
	chordIndex: -1,
	error: null,
	notice: null
};
var PATTERNS = {
	ingen: {
		kick: [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		hat: [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		]
	},
	ro: {
		kick: [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0
		],
		hat: [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0
		]
	},
	sprett: {
		kick: [
			1,
			0,
			0,
			1,
			0,
			0,
			1,
			0
		],
		snare: [
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0
		],
		hat: [
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1
		]
	},
	ballade: {
		kick: [
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1
		]
	}
};
function createContext$1() {
	const w = window;
	const Ctor = window.AudioContext ?? w.webkitAudioContext;
	if (!Ctor) throw new Error("Denne nettleseren kan ikke spille lyd.");
	return new Ctor();
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function micError(err) {
	const name = err instanceof DOMException ? err.name : "";
	if (name === "NotAllowedError" || name === "PermissionDeniedError") return "Mikrofonen er ikke tillatt. Si ja til mikrofon i nettleseren, og prøv igjen.";
	if (name === "NotFoundError") return "Fant ingen mikrofon.";
	return "Fikk ikke tak i mikrofonen. Sjekk at den er koblet til.";
}
function pickMime() {
	if (typeof MediaRecorder === "undefined") return "";
	return [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4"
	].find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}
function makeNoise(ctx) {
	const len = Math.floor(ctx.sampleRate * .5);
	const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
	return buffer;
}
function makeImpulse(ctx) {
	const len = Math.floor(ctx.sampleRate * 2.2);
	const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
	for (let c = 0; c < 2; c++) {
		const data = buffer.getChannelData(c);
		for (let i = 0; i < len; i++) {
			const t = i / len;
			data[i] = (Math.random() * 2 - 1) * (1 - t) ** 2.4;
		}
	}
	return buffer;
}
function glide(param, value, ctx) {
	if (typeof OfflineAudioContext !== "undefined" && ctx instanceof OfflineAudioContext) {
		param.setValueAtTime(value, 0);
		return;
	}
	param.setTargetAtTime(value, ctx.currentTime, .04);
}
function structureKey(song) {
	return JSON.stringify({
		bpm: song.bpm,
		click: song.click,
		drums: song.drums,
		tracks: song.tracks.map((track) => [
			track.id,
			track.activeTakeId,
			track.trimStart,
			track.trimEnd
		])
	});
}
function envGain(ctx, when, peak, dur) {
	const gain = ctx.createGain();
	gain.gain.setValueAtTime(1e-4, when);
	gain.gain.exponentialRampToValueAtTime(peak, when + .008);
	gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	return gain;
}
function toneGains(tone) {
	if (tone === "varm") return {
		low: 4,
		mid: -1,
		high: -2.5
	};
	if (tone === "klar") return {
		low: -1.5,
		mid: 3.2,
		high: 2
	};
	if (tone === "radio") return {
		low: -2,
		mid: 4,
		high: 3.2
	};
	return {
		low: 0,
		mid: 0,
		high: 0
	};
}
function roomSend(room) {
	if (room === "stue") return .18;
	if (room === "scene") return .34;
	if (room === "kirke") return .52;
	return 0;
}
function echoSettings(echo, bpm) {
	if (echo === "kort") return {
		time: .16,
		fb: .22,
		mix: .22
	};
	if (echo === "syng") return {
		time: Math.min(1.2, 60 / bpm * .75),
		fb: .36,
		mix: .28
	};
	return {
		time: .16,
		fb: 0,
		mix: 0
	};
}
function masterSettings(style) {
	if (style === "radio") return {
		low: .4,
		high: 2.6,
		threshold: -18,
		ratio: 3.6,
		out: 1.2
	};
	if (style === "myk") return {
		low: 3,
		high: -2.2,
		threshold: -14,
		ratio: 1.7,
		out: 1
	};
	return {
		low: 1.4,
		high: .6,
		threshold: -12,
		ratio: 2,
		out: 1.05
	};
}
function audioLength(song, buffers) {
	let max = 0;
	for (const track of song.tracks) {
		const take = activeTake(track);
		if (!take) continue;
		const total = buffers.get(take.audioId)?.duration ?? take.duration;
		max = Math.max(max, total - track.trimStart - track.trimEnd);
	}
	return Math.max(0, max);
}
function arrangementLength(song) {
	return (song.sections.reduce((sum, section) => sum + section.bars, 0) || 8) * 4 * (60 / song.bpm);
}
function hit(ctx, dest, noise, song, index, when, hold) {
	const step = index % 8;
	const pattern = PATTERNS[song.drums];
	if (pattern.kick[step]) {
		const osc = ctx.createOscillator();
		const gain = envGain(ctx, when, .85, .22);
		osc.type = "sine";
		osc.frequency.setValueAtTime(148, when);
		osc.frequency.exponentialRampToValueAtTime(46, when + .09);
		osc.connect(gain).connect(dest);
		osc.start(when);
		osc.stop(when + .24);
		hold.push(osc);
	}
	if (pattern.snare[step]) {
		const src = ctx.createBufferSource();
		src.buffer = noise;
		const filter = ctx.createBiquadFilter();
		filter.type = "bandpass";
		filter.frequency.value = 1800;
		filter.Q.value = .7;
		const gain = envGain(ctx, when, .45, .16);
		src.connect(filter).connect(gain).connect(dest);
		src.start(when);
		src.stop(when + .18);
		hold.push(src);
	}
	if (pattern.hat[step]) {
		const src = ctx.createBufferSource();
		src.buffer = noise;
		const filter = ctx.createBiquadFilter();
		filter.type = "highpass";
		filter.frequency.value = 7e3;
		const gain = envGain(ctx, when, .16, .05);
		src.connect(filter).connect(gain).connect(dest);
		src.start(when);
		src.stop(when + .06);
		hold.push(src);
	}
	if (song.click && step % 2 === 0) {
		const osc = ctx.createOscillator();
		const accent = step === 0;
		const gain = envGain(ctx, when, accent ? .14 : .07, .04);
		osc.type = "square";
		osc.frequency.value = accent ? 1400 : 900;
		osc.connect(gain).connect(dest);
		osc.start(when);
		osc.stop(when + .05);
		hold.push(osc);
	}
}
function scheduleSpan(ctx, dest, noise, song, offset, duration, t0, hold) {
	if (duration <= 0) return;
	if (song.drums === "ingen" && !song.click) return;
	const step = 60 / song.bpm / 2;
	const first = Math.floor(offset / step + 1e-6);
	const last = Math.ceil((offset + duration) / step - 1e-6);
	for (let i = first; i <= last; i++) {
		const when = t0 + (i * step - offset);
		if (when < t0 - .001) continue;
		hit(ctx, dest, noise, song, i, when, hold);
	}
}
var StudioEngine = class {
	onChange;
	ctx = null;
	song = null;
	buffers = /* @__PURE__ */ new Map();
	live = null;
	hold = [];
	noise = null;
	drumTimer = null;
	raf = 0;
	dead = false;
	gen = 0;
	playing = false;
	looping = false;
	recording = false;
	counting = false;
	listening = false;
	recordAbort = false;
	startedCtx = 0;
	startedOffset = 0;
	pausedAt = 0;
	recordStarted = 0;
	countLeft = null;
	level = 0;
	note = null;
	hint = null;
	freq = null;
	chordOn = false;
	chordIndex = -1;
	chordGen = 0;
	chordTimer = null;
	refOsc = null;
	error = null;
	notice = null;
	stream = null;
	recorder = null;
	chunks = [];
	analyser = null;
	meterSource = null;
	meterData = /* @__PURE__ */ new Float32Array(2048);
	gateReady = false;
	lastEmit = 0;
	constructor(onChange) {
		this.onChange = onChange;
		this.raf = requestAnimationFrame(this.tick);
	}
	dispose() {
		this.dead = true;
		this.gen += 1;
		this.recordAbort = true;
		cancelAnimationFrame(this.raf);
		this.stopChords();
		this.reference(null);
		this.stopPerformance();
		this.stopStream();
		this.ctx?.close();
	}
	setSong(song) {
		const prev = this.song;
		this.song = song;
		if (!prev || !this.playing || !this.live) return;
		if (structureKey(prev) !== structureKey(song)) {
			const pos = this.position();
			this.play(Math.max(0, pos));
		} else this.applyMix(song);
	}
	async toggle() {
		if (this.playing) this.pause();
		else await this.play(this.pausedAt);
	}
	async seek(position) {
		const pos = Math.max(0, position);
		this.pausedAt = pos;
		if (this.playing) await this.play(pos);
		else this.emit();
	}
	async play(offset = 0) {
		const song = this.song;
		if (!song || this.dead) return;
		const token = ++this.gen;
		try {
			const ctx = this.ensureCtxSync();
			await this.ensureBuffers(this.song ?? song);
			const current = this.song;
			if (!current || token !== this.gen || this.dead) return;
			const length = audioLength(current, this.buffers);
			const musical = current.drums !== "ingen" || current.click;
			if (length < .05 && !musical) {
				this.playing = false;
				this.notice = "Ingenting å spille av ennå. Ta opp, eller skru på trommer.";
				this.emit();
				return;
			}
			this.stopPerformance();
			this.notice = null;
			this.error = null;
			this.looping = length < .05;
			this.playing = true;
			this.startedOffset = offset;
			this.startedCtx = ctx.currentTime;
			this.pausedAt = offset;
			const when = ctx.currentTime + .05;
			const hold = [];
			this.hold = hold;
			this.live = this.build(ctx, current, this.noise, ctx.destination, when, offset, this.looping ? 0 : Math.max(0, length - offset), hold);
			if (this.looping && this.live) this.startLoop(current, this.live.drum);
			this.emit();
		} catch (err) {
			this.playing = false;
			this.error = err instanceof Error ? err.message : "Kunne ikke spille av.";
			this.emit();
		}
	}
	pause() {
		if (!this.playing && !this.live) {
			this.emit();
			return;
		}
		const pos = this.playing ? this.position() : this.pausedAt;
		const length = this.song ? audioLength(this.song, this.buffers) : 0;
		this.pausedAt = this.looping ? 0 : Math.max(0, Math.min(pos, length || pos));
		this.playing = false;
		this.looping = false;
		this.stopPerformance();
		this.emit();
	}
	async beginRecord() {
		if (this.recording || this.counting || !this.song) return;
		if (typeof MediaRecorder === "undefined") {
			this.error = "Denne nettleseren kan ikke ta opp lyd.";
			this.emit();
			return;
		}
		this.recordAbort = false;
		this.pause();
		this.ensureCtxSync();
		try {
			if (!this.stream) {
				this.stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false
				} });
				this.attachMeter(this.stream);
			}
		} catch (err) {
			this.error = micError(err);
			this.emit();
			return;
		}
		this.listening = true;
		this.counting = true;
		this.error = null;
		this.emit();
		await this.countIn(this.song);
		if (this.recordAbort || this.dead) {
			this.counting = false;
			this.countLeft = null;
			this.emit();
			return;
		}
		const mime = pickMime();
		const rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : void 0);
		this.chunks = [];
		rec.ondataavailable = (event) => {
			if (event.data.size) this.chunks.push(event.data);
		};
		this.recorder = rec;
		rec.start();
		this.counting = false;
		this.countLeft = null;
		this.recording = true;
		this.recordStarted = performance.now();
		this.emit();
		await this.play(0);
	}
	async endRecord() {
		const rec = this.recorder;
		if (!rec) {
			this.recording = false;
			this.counting = false;
			this.emit();
			return null;
		}
		const blob = await new Promise((resolve) => {
			rec.addEventListener("stop", () => resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" })), { once: true });
			if (rec.state !== "inactive") rec.stop();
			else resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" }));
		});
		this.recorder = null;
		this.recording = false;
		this.pause();
		this.stopStream();
		this.emit();
		return blob.size > 0 ? blob : null;
	}
	cancelRecord() {
		this.recordAbort = true;
		const rec = this.recorder;
		this.recorder = null;
		this.chunks = [];
		if (rec && rec.state !== "inactive") rec.stop();
		this.recording = false;
		this.counting = false;
		this.countLeft = null;
		this.pause();
		this.stopStream();
		this.emit();
	}
	async startListen() {
		if (this.recording || this.counting) return;
		this.ensureCtxSync();
		try {
			if (!this.stream) {
				this.stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false
				} });
				this.attachMeter(this.stream);
			}
			this.listening = true;
			this.error = null;
			this.emit();
		} catch (err) {
			this.error = micError(err);
			this.emit();
		}
	}
	stopListen() {
		if (this.recording || this.counting) return;
		this.listening = false;
		this.stopStream();
		this.emit();
	}
	previewChord(freqs) {
		this.strum(freqs);
	}
	strum(freqs) {
		this.playStrum(freqs);
	}
	loopChords(chords, bpm) {
		this.stopChords();
		const playable = chords.filter((chord) => chord.length > 0);
		if (!playable.length) return;
		const gen = ++this.chordGen;
		this.chordOn = true;
		const bar = 60 / Math.max(40, Math.min(220, bpm)) * 4 * 1e3;
		let index = 0;
		const step = () => {
			if (this.dead || this.chordGen !== gen) return;
			this.chordIndex = index % playable.length;
			this.playStrum(playable[this.chordIndex]);
			this.emit();
			index += 1;
			this.chordTimer = window.setTimeout(step, bar);
		};
		step();
	}
	stopChords() {
		this.chordGen += 1;
		if (this.chordTimer !== null) window.clearTimeout(this.chordTimer);
		this.chordTimer = null;
		this.chordOn = false;
		this.chordIndex = -1;
		this.emit();
	}
	reference(freq) {
		try {
			this.refOsc?.stop();
		} catch {}
		this.refOsc?.disconnect();
		this.refOsc = null;
		if (freq == null || this.dead) return;
		const ctx = this.ensureCtxSync();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = freq;
		gain.gain.value = .12;
		osc.connect(gain).connect(ctx.destination);
		osc.start();
		this.refOsc = osc;
	}
	playStrum(freqs) {
		const ctx = this.ensureCtxSync();
		const now = ctx.currentTime + .02;
		const bus = ctx.createGain();
		const filter = ctx.createBiquadFilter();
		bus.gain.value = .34;
		filter.type = "lowpass";
		filter.frequency.value = 2200;
		bus.connect(filter).connect(ctx.destination);
		freqs.forEach((freq, index) => {
			const osc = ctx.createOscillator();
			const body = ctx.createOscillator();
			const gain = ctx.createGain();
			const start = now + index * .03;
			osc.type = "triangle";
			body.type = "sine";
			osc.frequency.value = freq;
			body.frequency.value = freq * 2;
			gain.gain.setValueAtTime(1e-4, start);
			gain.gain.exponentialRampToValueAtTime(.42, start + .018);
			gain.gain.exponentialRampToValueAtTime(1e-4, start + 1.35);
			osc.connect(gain);
			body.connect(gain);
			gain.connect(bus);
			osc.start(start);
			body.start(start);
			osc.stop(start + 1.4);
			body.stop(start + 1.4);
		});
	}
	async decodeTake(blob) {
		const ctx = this.ensureCtxSync();
		const raw = await blob.arrayBuffer();
		const audio = await ctx.decodeAudioData(raw.slice(0));
		const { peaks, peak } = measureBuffer(audio);
		const audioId = crypto.randomUUID();
		await putAudio(audioId, blob);
		this.buffers.set(audioId, audio);
		return {
			audioId,
			duration: audio.duration,
			peak,
			peaks
		};
	}
	async renderWav(song) {
		const live = this.ensureCtxSync();
		await this.ensureBuffers(song);
		const recorded = audioLength(song, this.buffers);
		const span = recorded > .05 ? recorded : arrangementLength(song);
		const rate = live.sampleRate;
		const offline = new OfflineAudioContext(2, Math.max(1, Math.ceil((span + 1.4) * rate)), rate);
		const noise = makeNoise(offline);
		this.build(offline, song, noise, offline.destination, .02, 0, span, []);
		return encodeWav(await offline.startRendering());
	}
	ensureCtxSync() {
		if (!this.ctx) {
			this.ctx = createContext$1();
			this.ctx.audioWorklet.addModule("/worklets/gate.js").then(() => {
				this.gateReady = true;
			}).catch(() => {
				this.gateReady = false;
			});
			this.noise = makeNoise(this.ctx);
		}
		this.ctx.resume();
		return this.ctx;
	}
	async ensureBuffers(song) {
		const ctx = this.ensureCtxSync();
		for (const track of song.tracks) {
			const take = activeTake(track);
			if (!take || this.buffers.has(take.audioId)) continue;
			const blob = await getAudio(take.audioId);
			if (!blob) continue;
			const raw = await blob.arrayBuffer();
			try {
				const audio = await ctx.decodeAudioData(raw.slice(0));
				this.buffers.set(take.audioId, audio);
			} catch {
				this.notice = `Klarte ikke å lese ${track.name}. Ta opp det sporet på nytt.`;
			}
		}
	}
	async countIn(song) {
		const ctx = this.ensureCtxSync();
		const beat = 60 / Math.max(60, song.bpm);
		const gain = ctx.createGain();
		gain.gain.value = .9;
		gain.connect(ctx.destination);
		for (let i = 0; i < 4; i++) {
			if (this.recordAbort || this.dead) return;
			this.countLeft = 4 - i;
			this.emit();
			const osc = ctx.createOscillator();
			const env = envGain(ctx, ctx.currentTime, i === 0 ? .16 : .1, .05);
			osc.type = "square";
			osc.frequency.value = 1200;
			osc.connect(env).connect(gain);
			osc.start();
			osc.stop(ctx.currentTime + .06);
			await sleep(beat * 1e3);
		}
		gain.disconnect();
	}
	build(ctx, song, noise, destination, when, offset, span, hold) {
		const bus = ctx.createGain();
		const masterLow = ctx.createBiquadFilter();
		masterLow.type = "lowshelf";
		masterLow.frequency.value = 220;
		const masterHigh = ctx.createBiquadFilter();
		masterHigh.type = "highshelf";
		masterHigh.frequency.value = 6500;
		const masterComp = ctx.createDynamicsCompressor();
		masterComp.attack.value = .012;
		masterComp.release.value = .24;
		masterComp.knee.value = 10;
		const limiter = ctx.createDynamicsCompressor();
		limiter.threshold.value = -2.2;
		limiter.knee.value = 0;
		limiter.ratio.value = 12;
		limiter.attack.value = .003;
		limiter.release.value = .12;
		const out = ctx.createGain();
		const verb = ctx.createConvolver();
		verb.buffer = makeImpulse(ctx);
		const verbTone = ctx.createBiquadFilter();
		verbTone.type = "lowpass";
		verbTone.frequency.value = 6500;
		verb.connect(verbTone).connect(bus);
		const drum = ctx.createGain();
		drum.gain.value = .4;
		drum.connect(bus);
		bus.connect(masterLow).connect(masterHigh).connect(masterComp).connect(out).connect(limiter).connect(destination);
		const live = {
			tracks: /* @__PURE__ */ new Map(),
			masterLow,
			masterHigh,
			masterComp,
			out,
			drum
		};
		for (const track of song.tracks) {
			const take = activeTake(track);
			if (!take) continue;
			const buffer = this.buffers.get(take.audioId);
			if (!buffer) continue;
			const start = track.trimStart + offset;
			const dur = buffer.duration - track.trimStart - track.trimEnd - offset;
			if (dur <= .03 || start >= buffer.duration) continue;
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			const nodes = this.wireTrack(ctx, verb, bus);
			source.connect(nodes.hp);
			source.start(when, start, dur);
			hold.push(source);
			live.tracks.set(track.id, nodes);
			hold.push(...nodes.extras);
		}
		if (span > 0) scheduleSpan(ctx, drum, noise, song, offset, span, when, hold);
		this.applyMix(song, live, ctx);
		return live;
	}
	wireTrack(ctx, verb, bus) {
		const hp = ctx.createBiquadFilter();
		hp.type = "highpass";
		hp.frequency.value = 70;
		hp.Q.value = .7;
		const low = ctx.createBiquadFilter();
		low.type = "lowshelf";
		low.frequency.value = 240;
		const mid = ctx.createBiquadFilter();
		mid.type = "peaking";
		mid.frequency.value = 2800;
		mid.Q.value = .8;
		const high = ctx.createBiquadFilter();
		high.type = "highshelf";
		high.frequency.value = 8e3;
		const comp = ctx.createDynamicsCompressor();
		comp.attack.value = .015;
		comp.release.value = .2;
		comp.knee.value = 14;
		const makeup = ctx.createGain();
		const fader = ctx.createGain();
		const dry = ctx.createGain();
		dry.gain.value = 1;
		const twinDelay = ctx.createDelay(.1);
		twinDelay.delayTime.value = .024;
		const twin = ctx.createGain();
		twin.gain.value = 0;
		const echoDelay = ctx.createDelay(1.5);
		const echoFb = ctx.createGain();
		const echoMix = ctx.createGain();
		const verbSend = ctx.createGain();
		const phone = ctx.createBiquadFilter();
		phone.type = "bandpass";
		phone.frequency.value = 1400;
		phone.Q.value = .85;
		const phoneMix = ctx.createGain();
		phoneMix.gain.value = 0;
		const chorusDelay = ctx.createDelay(.05);
		chorusDelay.delayTime.value = .018;
		const chorusLfo = ctx.createOscillator();
		chorusLfo.frequency.value = .33;
		const chorusDepth = ctx.createGain();
		chorusDepth.gain.value = .005;
		const chorusMix = ctx.createGain();
		chorusMix.gain.value = 0;
		const ring = ctx.createGain();
		ring.gain.value = 0;
		const ringOsc = ctx.createOscillator();
		ringOsc.frequency.value = 48;
		const ringMix = ctx.createGain();
		ringMix.gain.value = 0;
		let gate;
		let head = hp;
		if (this.gateReady && ctx instanceof AudioContext) {
			gate = new AudioWorkletNode(ctx, "lydvenn-gate");
			hp.connect(gate);
			head = gate;
		}
		head.connect(low).connect(mid).connect(high).connect(comp).connect(makeup).connect(fader);
		fader.connect(dry).connect(bus);
		fader.connect(phone).connect(phoneMix).connect(bus);
		chorusLfo.connect(chorusDepth).connect(chorusDelay.delayTime);
		fader.connect(chorusDelay).connect(chorusMix).connect(bus);
		ringOsc.connect(ring.gain);
		fader.connect(ring).connect(ringMix).connect(bus);
		const started = ctx.currentTime;
		chorusLfo.start(started);
		ringOsc.start(started);
		fader.connect(twinDelay).connect(twin);
		twin.connect(bus);
		fader.connect(echoDelay);
		echoDelay.connect(echoFb).connect(echoDelay);
		echoDelay.connect(echoMix);
		echoMix.connect(bus);
		fader.connect(verbSend).connect(verb);
		return {
			low,
			mid,
			high,
			hp,
			comp,
			makeup,
			fader,
			dry,
			twin,
			echoMix,
			echoFb,
			echoDelay,
			verbSend,
			phoneMix,
			chorusMix,
			ringMix,
			extras: [chorusLfo, ringOsc],
			gate
		};
	}
	applyMix(song, live = this.live, ctx = this.ctx) {
		if (!live || !ctx) return;
		const dry = song.compareDry;
		const anySolo = song.tracks.some((track) => track.solo);
		for (const track of song.tracks) {
			const nodes = live.tracks.get(track.id);
			if (!nodes) continue;
			const on = !track.muted && (!anySolo || track.solo);
			glide(nodes.fader.gain, on ? track.volume : 0, ctx);
			const tone = dry ? {
				low: 0,
				mid: 0,
				high: 0
			} : toneGains(track.tone);
			glide(nodes.low.gain, tone.low, ctx);
			glide(nodes.mid.gain, tone.mid, ctx);
			glide(nodes.high.gain, tone.high, ctx);
			glide(nodes.hp.frequency, dry ? 45 : 45 + track.hush * 190, ctx);
			const even = dry ? 0 : track.even;
			glide(nodes.comp.threshold, -8 - even * 24, ctx);
			glide(nodes.comp.ratio, 1 + even * 5, ctx);
			glide(nodes.makeup.gain, 1 + even * 1.15, ctx);
			glide(nodes.twin.gain, dry ? 0 : track.twin * .5, ctx);
			const trick = dry ? "ingen" : track.trick ?? "ingen";
			glide(nodes.dry.gain, trick === "telefon" ? .16 : trick === "robot" ? .72 : 1, ctx);
			glide(nodes.phoneMix.gain, trick === "telefon" ? .95 : 0, ctx);
			glide(nodes.chorusMix.gain, trick === "kor" ? .5 : 0, ctx);
			glide(nodes.ringMix.gain, trick === "robot" ? .32 : 0, ctx);
			const echo = dry ? {
				time: .16,
				fb: 0,
				mix: 0
			} : echoSettings(track.echo, song.bpm);
			glide(nodes.echoDelay.delayTime, echo.time, ctx);
			glide(nodes.echoFb.gain, echo.fb, ctx);
			glide(nodes.echoMix.gain, echo.mix, ctx);
			glide(nodes.verbSend.gain, dry ? 0 : roomSend(track.room), ctx);
			nodes.gate?.port.postMessage({ threshold: dry ? 0 : track.hush * .04 });
		}
		const master = dry ? {
			low: 0,
			high: 0,
			threshold: 0,
			ratio: 1,
			out: 1
		} : masterSettings(song.master);
		glide(live.masterLow.gain, master.low, ctx);
		glide(live.masterHigh.gain, master.high, ctx);
		glide(live.masterComp.threshold, master.threshold, ctx);
		glide(live.masterComp.ratio, master.ratio, ctx);
		glide(live.out.gain, master.out, ctx);
	}
	startLoop(song, drum) {
		const ctx = this.ctx;
		const noise = this.noise;
		if (!ctx || !noise) return;
		let index = 0;
		let next = ctx.currentTime + .08;
		this.drumTimer = window.setInterval(() => {
			if (!this.playing || !this.looping || !this.song) return;
			const step = 60 / this.song.bpm / 2;
			const horizon = ctx.currentTime + .28;
			while (next < horizon) {
				hit(ctx, drum, noise, this.song ?? song, index, next, this.hold);
				index += 1;
				next += step;
				if (this.hold.length > 80) this.hold.splice(0, 40);
			}
		}, 40);
	}
	stopPerformance() {
		if (this.drumTimer != null) {
			window.clearInterval(this.drumTimer);
			this.drumTimer = null;
		}
		for (const node of this.hold) try {
			node.stop();
		} catch {}
		this.hold = [];
		this.live?.out.disconnect();
		this.live = null;
	}
	attachMeter(stream) {
		if (!this.ctx || this.analyser) return;
		const source = this.ctx.createMediaStreamSource(stream);
		const analyser = this.ctx.createAnalyser();
		analyser.fftSize = 2048;
		source.connect(analyser);
		this.meterSource = source;
		this.analyser = analyser;
		this.meterData = new Float32Array(analyser.fftSize);
	}
	stopStream() {
		this.stream?.getTracks().forEach((track) => track.stop());
		this.stream = null;
		this.listening = false;
		this.meterSource?.disconnect();
		this.meterSource = null;
		this.analyser = null;
		this.level = 0;
		this.note = null;
		this.hint = null;
		this.freq = null;
	}
	readMeter() {
		if (!this.analyser || !this.ctx) return;
		this.analyser.getFloatTimeDomainData(this.meterData);
		let peak = 0;
		for (let i = 0; i < this.meterData.length; i += 4) peak = Math.max(peak, Math.abs(this.meterData[i] ?? 0));
		this.level = peak;
		const pitch = detectPitch(this.meterData, this.ctx.sampleRate);
		this.note = pitch?.note ?? null;
		this.hint = pitch ? pitchHint(pitch.cents) : null;
		this.freq = pitch?.freq ?? null;
	}
	position() {
		if (!this.playing || !this.ctx) return this.pausedAt;
		return this.startedOffset + (this.ctx.currentTime - this.startedCtx);
	}
	tick = () => {
		if (this.dead) return;
		this.readMeter();
		if (this.playing && !this.looping && this.song) {
			const length = audioLength(this.song, this.buffers);
			if (length > .05 && this.position() >= length + .35) this.pause();
		}
		const active = this.playing || this.recording || this.counting || this.listening || this.chordOn;
		const now = performance.now();
		if (active && now - this.lastEmit > 80) {
			this.lastEmit = now;
			this.emit();
		}
		this.raf = requestAnimationFrame(this.tick);
	};
	emit() {
		if (this.dead) return;
		this.lastEmit = performance.now();
		this.onChange(this.snapshot());
	}
	snapshot() {
		return {
			playing: this.playing,
			recording: this.recording,
			counting: this.counting,
			listening: this.listening,
			countLeft: this.countLeft,
			position: this.position(),
			level: this.level,
			note: this.note,
			hint: this.hint,
			freq: this.freq,
			chords: this.chordOn,
			chordIndex: this.chordIndex,
			error: this.error,
			notice: this.notice
		};
	}
};
function useEngine(song) {
	const [snap, setSnap] = (0, import_react.useState)(EMPTY_SNAP);
	const engine = (0, import_react.useRef)(null);
	const songRef = (0, import_react.useRef)(song);
	songRef.current = song;
	(0, import_react.useEffect)(() => {
		const next = new StudioEngine(setSnap);
		engine.current = next;
		if (songRef.current) next.setSong(songRef.current);
		return () => next.dispose();
	}, []);
	(0, import_react.useEffect)(() => {
		if (song) engine.current?.setSong(song);
	}, [song]);
	return {
		snap,
		engine
	};
}
function StudioScreen({ id }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [job, setJob] = (0, import_react.useState)(null);
	const [more, setMore] = (0, import_react.useState)(false);
	const openedFor = (0, import_react.useRef)(null);
	const [focusId, setFocusId] = (0, import_react.useState)(null);
	const song = useStudio((state) => state.songs.find((item) => item.id === id) ?? null);
	const renameSong = useStudio((state) => state.renameSong);
	const { snap, engine } = useEngine(song);
	(0, import_react.useEffect)(() => {
		hydrateStudio().then(() => setReady(true));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!song) return;
		if (focusId && song.tracks.some((track) => track.id === focusId)) return;
		setFocusId(song.tracks[0]?.id ?? null);
	}, [song, focusId]);
	(0, import_react.useEffect)(() => {
		if (!song || openedFor.current === song.id) return;
		openedFor.current = song.id;
		setMore(false);
		setJob(null);
	}, [song]);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [job]);
	if (!ready || !song) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh w-full max-w-3xl px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "inline-flex min-h-11 items-center text-sm text-muted",
				children: "Til sangene"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-3xl",
				children: ready ? "Fant ikke sangen" : "ThorSound"
			}),
			ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Den kan ha blitt slettet i denne nettleseren."
			}) : null
		]
	}) });
	const length = songDuration(song);
	const looping = length < .05 && (song.drums !== "ingen" || song.click);
	const advice = producerAdvice(song)[0];
	const locked = snap.recording || snap.counting;
	const hasAudio = length >= .05;
	const groups = hasAudio || more ? JOB_GROUPS : JOB_GROUPS.filter((group) => group.title === "Start");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricLink, {
		song,
		snap,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
			back: {
				to: "/",
				label: "Sanger"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-3xl flex-1 flex-col px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Navn på sangen",
						placeholder: "Uten navn",
						value: song.title,
						onChange: (event) => renameSong(song.id, event.target.value),
						className: "w-full min-h-12 bg-transparent font-display text-3xl leading-tight text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							song.keyName,
							" · ",
							song.bpm,
							" slag · ",
							song.tracks.length,
							" spor"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex-1 pb-4",
						children: job ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setJob(null),
							className: "mb-2 inline-flex min-h-11 items-center gap-1 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Tilbake"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-line bg-raised p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobPanel, {
								job,
								song,
								engine,
								snap,
								focusId,
								setFocusId,
								go: setJob
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							advice && hasAudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setJob(advice.job),
								className: "mb-3 w-full rounded-md border border-line bg-raised px-4 py-3 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium tracking-widest text-lamp uppercase",
										children: "Neste"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block font-medium",
										children: advice.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-sm text-muted",
										children: advice.text
									})
								]
							}) : null,
							length < .05 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 rounded-md border border-line bg-raised p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "Ingen lyd ennå"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: "Trykk Ta opp. Telefonen spør om mikrofonen. Den teller fire slag, så starter opptaket."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setJob("opptak"),
										className: "mt-4 flex min-h-12 w-full items-center justify-center rounded-md bg-signal text-sm font-medium text-signal-ink",
										children: "Ta opp"
									})
								]
							}) : null,
							groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xs font-medium tracking-widest text-muted uppercase",
									children: group.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "overflow-hidden rounded-md border border-line bg-raised",
									children: group.ids.map((id) => {
										const item = JOBS.find((jobItem) => jobItem.id === id);
										if (!item) return null;
										const Icon = item.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "border-b border-line last:border-b-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setJob(item.id),
												className: "flex w-full items-center gap-3 px-3 py-3 text-left",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "grid size-10 shrink-0 place-items-center rounded-md bg-surface text-crystal",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
															className: "size-5",
															"aria-hidden": true
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "block font-medium",
															children: item.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-0.5 block truncate text-sm text-muted",
															children: item.text
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
														className: "size-4 shrink-0 text-muted",
														"aria-hidden": true
													})
												]
											})
										}, item.id);
									})
								})]
							}, group.title)),
							!hasAudio && !more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMore(true),
								className: "mb-4 min-h-11 text-sm text-muted",
								children: "Vis alle verktøy"
							}) : null
						] })
					}),
					snap.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mb-2 text-sm text-signal",
						children: snap.error
					}) : null,
					snap.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mb-2 text-sm text-muted",
						children: snap.notice
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky bottom-0 z-10 -mx-5 mt-auto border-t border-line bg-raised/95 px-5 py-3 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": snap.recording ? "Opptak pågår" : "Ta opp",
									onClick: () => setJob("opptak"),
									className: "flex size-12 shrink-0 items-center justify-center rounded-md bg-signal text-signal-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-4 fill-current" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: locked,
									"aria-label": snap.playing ? "Stopp" : "Spill",
									onClick: () => void engine.current?.toggle(),
									className: "flex size-12 shrink-0 items-center justify-center rounded-md bg-fg text-ink disabled:opacity-40",
									children: snap.playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "studio-range w-full",
										type: "range",
										min: 0,
										max: Math.max(length, .1),
										step: .1,
										disabled: looping || locked || length < .05,
										value: Math.min(snap.position, Math.max(length, .1)),
										"aria-label": "Hvor i låten",
										onChange: (event) => void engine.current?.seek(Number(event.target.value))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs text-muted tabular-nums",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(snap.position) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: looping ? "Trommene går til du stopper" : formatTime(length) })]
									})]
								})
							]
						})
					})
				]
			})
		})
	});
}
function SongRoute() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioScreen, { id });
}
//#endregion
export { SongRoute as component };
