import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Logo, o as PanelHead, t as Button, v as songDuration } from "./mark-DIabbQ3z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lyric-link-D151QNXi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FAST_POLL_MS = 400;
var IDLE_POLL_MS = 2e3;
var PING_INTERVAL_MS = 2e3;
var STALL_MS = 1e4;
var MAX_RECOVERY_ATTEMPTS = 3;
var SIGNAL_RETRY_DELAYS_MS = [250, 750];
function defaultIceServers() {
	return [{ urls: ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }];
}
var P2PRoom = class {
	opts;
	peers = /* @__PURE__ */ new Map();
	/** Per-remote-peer signal delivery chains (order-preserving). */
	signalQueues = /* @__PURE__ */ new Map();
	cursor = 0;
	pollTimer = null;
	pingTimer = null;
	closed = false;
	everPolled = false;
	lastPeersFingerprint = "";
	constructor(opts) {
		this.opts = opts;
	}
	/**
	* The first poll IS the join: it registers this peer and returns the
	* roster. A failed first poll (cold DB, offline tab) must not strand the
	* room: the loop and timers start regardless and the next poll retries.
	*/
	async join() {
		try {
			await this.pollOnce();
		} catch {}
		if (this.closed) return;
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
		this.pingTimer = setInterval(() => {
			this.pingAll();
			this.watchdog();
		}, PING_INTERVAL_MS);
	}
	close() {
		this.closed = true;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		if (this.pingTimer) clearInterval(this.pingTimer);
		for (const slot of this.peers.values()) slot.pc.close();
		this.peers.clear();
		fetch("/api/rtc", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				op: "leave",
				room: this.opts.room,
				peer: this.opts.selfId
			}),
			keepalive: true
		}).catch(() => {});
	}
	/** Send on the unreliable game-state channel (drops stale packets). */
	broadcast(data) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		for (const slot of this.peers.values()) if (slot.state?.readyState === "open") slot.state.send(wire);
	}
	/** Send reliably (ordered) to one peer, or to all when peerId is omitted. */
	send(data, peerId) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		const targets = peerId ? [this.peers.get(peerId)] : [...this.peers.values()];
		for (const slot of targets) if (slot?.reliable?.readyState === "open") slot.reliable.send(wire);
	}
	peerList() {
		return [...this.peers.values()].map((s) => ({ ...s.info }));
	}
	schedulePoll(delay) {
		if (this.closed) return;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		this.pollTimer = setTimeout(() => void this.poll(), delay);
	}
	anyPairConnecting() {
		for (const s of this.peers.values()) {
			if (s.terminal) continue;
			if (s.info.connectionState !== "connected") return true;
		}
		return false;
	}
	async pollOnce() {
		const params = new URLSearchParams({
			room: this.opts.room,
			peer: this.opts.selfId,
			name: this.opts.name ?? "",
			since: String(this.cursor)
		});
		const res = await fetch(`/api/rtc?${params}`);
		if (this.closed) return;
		if (!res.ok) throw new Error(`signaling poll failed: ${res.status}`);
		const body = await res.json();
		if (this.closed) return;
		if (!this.everPolled) {
			this.everPolled = true;
			this.opts.onConnected?.();
		}
		this.reconcileRoster(body.peers);
		const roster = new Set(body.peers.map((p) => p.id));
		for (const sig of body.signals) {
			this.cursor = Math.max(this.cursor, sig.id);
			await this.onSignal(sig.from, sig.kind, sig.payload, roster);
			if (this.closed) return;
		}
	}
	async poll() {
		if (this.closed) return;
		try {
			await this.pollOnce();
		} catch {}
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
	}
	reconcileRoster(peers) {
		const alive = new Set(peers.map((p) => p.id));
		for (const p of peers) {
			if (p.id === this.opts.selfId) continue;
			const existing = this.peers.get(p.id);
			if (existing) existing.info.name = p.name;
			else this.connectTo(p.id, p.name, this.opts.selfId > p.id);
		}
		for (const [id, slot] of this.peers) if (!alive.has(id)) {
			slot.pc.close();
			this.peers.delete(id);
		}
		this.emitPeers();
	}
	connectTo(peerId, name, initiator) {
		if (this.closed) return null;
		const pc = new RTCPeerConnection({ iceServers: this.opts.iceServers ?? defaultIceServers() });
		const slot = {
			pc,
			makingOffer: false,
			ignoreOffer: false,
			pendingCandidates: [],
			lastProgressAt: Date.now(),
			recoveryAttempts: 0,
			info: {
				id: peerId,
				name,
				connectionState: pc.connectionState,
				candidateType: null,
				rttMs: null
			}
		};
		this.peers.set(peerId, slot);
		pc.onicecandidate = (e) => {
			if (e.candidate) this.sendSignal(peerId, "ice", e.candidate.toJSON());
		};
		pc.onconnectionstatechange = () => {
			slot.info.connectionState = pc.connectionState;
			if (pc.connectionState === "connecting" || pc.connectionState === "connected") slot.lastProgressAt = Date.now();
			if (pc.connectionState === "connected") {
				slot.recoveryAttempts = 0;
				slot.terminal = false;
				this.readCandidateType(slot);
			}
			this.emitPeers();
			if (pc.connectionState === "failed") pc.restartIce();
			if (pc.connectionState === "failed" || pc.connectionState === "disconnected") this.schedulePoll(FAST_POLL_MS);
		};
		pc.onnegotiationneeded = async () => {
			try {
				slot.makingOffer = true;
				await pc.setLocalDescription();
				await this.sendSignal(peerId, "offer", pc.localDescription.toJSON());
			} catch {} finally {
				slot.makingOffer = false;
			}
		};
		pc.ondatachannel = (e) => this.attachChannel(slot, e.channel);
		if (initiator) {
			this.attachChannel(slot, pc.createDataChannel("state", {
				ordered: false,
				maxRetransmits: 0
			}));
			this.attachChannel(slot, pc.createDataChannel("reliable", { ordered: true }));
		}
		return slot;
	}
	attachChannel(slot, channel) {
		if (channel.label === "state") slot.state = channel;
		else slot.reliable = channel;
		channel.onopen = () => {
			slot.lastProgressAt = Date.now();
		};
		channel.onmessage = (e) => {
			let msg;
			try {
				msg = JSON.parse(e.data);
			} catch {
				return;
			}
			if (msg.t === "ping") {
				if (slot.state?.readyState === "open") slot.state.send(JSON.stringify({ t: "pong" }));
			} else if (msg.t === "pong") {
				if (slot.pingSentAt) {
					slot.info.rttMs = Math.round(performance.now() - slot.pingSentAt);
					slot.pingSentAt = void 0;
					this.emitPeers();
				}
			} else this.opts.onMessage?.(slot.info.id, msg.d, channel.label === "state" ? "state" : "reliable");
		};
	}
	/** Apply buffered ICE candidates once a remote description is in place. */
	async flushPendingCandidates(slot) {
		while (slot.pendingCandidates.length > 0) {
			const candidate = slot.pendingCandidates.shift();
			try {
				await slot.pc.addIceCandidate(candidate);
			} catch (err) {
				if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
			}
			if (this.closed) return;
		}
	}
	async onSignal(from, kind, payload, roster) {
		if (this.closed) return;
		let slot = this.peers.get(from);
		if (!slot) {
			if (!roster.has(from)) return;
			const created = this.connectTo(from, "", false);
			if (!created) return;
			slot = created;
		}
		const polite = this.opts.selfId < from;
		try {
			if (kind === "offer" || kind === "answer") {
				const description = payload;
				const collision = kind === "offer" && (slot.makingOffer || slot.pc.signalingState !== "stable");
				slot.ignoreOffer = !polite && collision;
				if (slot.ignoreOffer) return;
				try {
					await slot.pc.setRemoteDescription(description);
				} catch (err) {
					if (kind !== "offer" || slot.recreatedForOffer) throw err;
					const attempts = slot.recoveryAttempts;
					const name = slot.info.name;
					slot.pc.close();
					this.peers.delete(from);
					const fresh = this.connectTo(from, name, false);
					if (!fresh) return;
					fresh.recoveryAttempts = attempts;
					fresh.recreatedForOffer = true;
					slot = fresh;
					await slot.pc.setRemoteDescription(description);
				}
				if (this.closed) return;
				await this.flushPendingCandidates(slot);
				if (this.closed) return;
				if (kind === "offer") {
					await slot.pc.setLocalDescription();
					if (this.closed) return;
					await this.sendSignal(from, "answer", slot.pc.localDescription.toJSON());
				}
			} else if (kind === "ice") {
				const candidate = payload;
				if (!slot.pc.remoteDescription) {
					slot.pendingCandidates.push(candidate);
					return;
				}
				try {
					await slot.pc.addIceCandidate(candidate);
				} catch (err) {
					if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
				}
			}
		} catch {}
	}
	/**
	* Signals are serialized per remote peer (a candidate must never overtake
	* its SDP into the DB) and retried on failure with short backoff.
	*/
	sendSignal(to, kind, payload) {
		const next = (this.signalQueues.get(to) ?? Promise.resolve()).then(() => this.postSignal(to, kind, payload));
		this.signalQueues.set(to, next.catch(() => {}));
		return next;
	}
	async postSignal(to, kind, payload) {
		for (let attempt = 0;; attempt++) {
			if (this.closed) return;
			try {
				const res = await fetch("/api/rtc", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						op: "signal",
						room: this.opts.room,
						from: this.opts.selfId,
						to,
						kind,
						payload
					})
				});
				if (res.ok) return;
				throw new Error(`signal POST failed: ${res.status}`);
			} catch (err) {
				if (attempt >= SIGNAL_RETRY_DELAYS_MS.length) {
					console.warn(`[p2p] signal ${kind} to ${to} failed after retries`, err);
					return;
				}
				await new Promise((r) => setTimeout(r, SIGNAL_RETRY_DELAYS_MS[attempt]));
			}
		}
	}
	pingAll() {
		const wire = JSON.stringify({ t: "ping" });
		for (const slot of this.peers.values()) {
			if (slot.state?.readyState !== "open") continue;
			const stale = slot.pingSentAt !== void 0 && performance.now() - slot.pingSentAt > 2 * PING_INTERVAL_MS;
			if (slot.pingSentAt === void 0 || stale) {
				slot.pingSentAt = performance.now();
				slot.state.send(wire);
			}
		}
	}
	/**
	* Stuck-pair recovery, piggybacked on the ping interval. A pair that has
	* made no progress for STALL_MS gets rebuilt by the dialer with a FRESH
	* RTCPeerConnection (new DTLS identity — fixes the suspend/resume
	* fingerprint wedge). After MAX_RECOVERY_ATTEMPTS the pair is terminal:
	* visible to the app as its last connectionState, ignored by fast-poll.
	*/
	watchdog() {
		if (this.closed) return;
		const now = Date.now();
		for (const [peerId, slot] of this.peers) {
			const live = slot.pc.connectionState;
			if (live !== slot.info.connectionState) {
				slot.info.connectionState = live;
				if (live === "connecting" || live === "connected") slot.lastProgressAt = now;
				this.emitPeers();
			}
			if (slot.terminal || live === "connected") continue;
			if (now - slot.lastProgressAt <= STALL_MS) continue;
			if (slot.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
				slot.terminal = true;
				this.emitPeers();
				continue;
			}
			slot.recoveryAttempts += 1;
			slot.lastProgressAt = now;
			if (this.opts.selfId > peerId) {
				const { name } = slot.info;
				const attempts = slot.recoveryAttempts;
				slot.pc.close();
				this.peers.delete(peerId);
				const fresh = this.connectTo(peerId, name, true);
				if (fresh) fresh.recoveryAttempts = attempts;
				this.schedulePoll(FAST_POLL_MS);
			}
		}
	}
	async readCandidateType(slot) {
		try {
			const stats = await slot.pc.getStats();
			let selected;
			stats.forEach((s) => {
				if (s.type === "candidate-pair" && s.nominated) selected = s;
			});
			const localId = selected?.localCandidateId;
			if (localId) {
				const local = stats.get(localId);
				slot.info.candidateType = local?.candidateType ?? null;
				this.emitPeers();
			}
		} catch {}
	}
	emitPeers() {
		const list = this.peerList();
		const fingerprint = JSON.stringify(list.map((p) => [
			p.id,
			p.name,
			p.connectionState,
			p.candidateType,
			p.rttMs
		]));
		if (fingerprint === this.lastPeersFingerprint) return;
		this.lastPeersFingerprint = fingerprint;
		this.opts.onPeersChanged?.(list);
	}
};
function defaultRoom() {
	if (typeof window === "undefined") return "room-ssr";
	return `room-${window.location.hostname.split(".")[0]}`.slice(0, 64);
}
function useP2PRoom(options = {}) {
	const [selfId] = (0, import_react.useState)(() => `p-${Math.random().toString(36).slice(2, 10)}`);
	const [room] = (0, import_react.useState)(() => options.room ?? defaultRoom());
	const [name] = (0, import_react.useState)(() => options.name ?? selfId);
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const roomRef = (0, import_react.useRef)(null);
	const listeners = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		const p2p = new P2PRoom({
			room,
			selfId,
			name,
			onPeersChanged: setPeers,
			onMessage: (from, data, channel) => {
				for (const fn of listeners.current) fn(from, data, channel);
			},
			onConnected: () => setJoined(true)
		});
		roomRef.current = p2p;
		p2p.join();
		return () => {
			roomRef.current = null;
			p2p.close();
		};
	}, [
		room,
		selfId,
		name
	]);
	return {
		selfId,
		room,
		peers,
		joined,
		broadcast: (0, import_react.useCallback)((data) => roomRef.current?.broadcast(data), []),
		send: (0, import_react.useCallback)((data, peerId) => roomRef.current?.send(data, peerId), []),
		onMessage: (0, import_react.useCallback)((fn) => {
			listeners.current.add(fn);
			return () => {
				listeners.current.delete(fn);
			};
		}, [])
	};
}
function lyricLines(lyrics) {
	const lines = lyrics.split("\n").map((line) => line.trim()).filter(Boolean);
	return lines.length > 0 ? lines : ["Skriv teksten først"];
}
function lyricSeconds(song) {
	const audio = songDuration(song);
	if (audio > 1) return audio;
	return (song.sections.reduce((sum, section) => sum + section.bars, 0) || 8) * (60 / Math.max(40, song.bpm)) * 4;
}
/** 0 at the first line, lines.length - 1 at the end. */
function lyricIndex(song, position) {
	const lines = lyricLines(song.lyrics);
	if (lines.length <= 1) return 0;
	const span = lyricSeconds(song);
	return (span > 0 ? Math.min(1, Math.max(0, position / span)) : 0) * (lines.length - 1);
}
var VISIBLE = 6;
var STEP = 5;
function Prompter({ lines, index, compact = false }) {
	const [reduce, setReduce] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	const start = Math.floor(cursor / step) * step;
	const shown = safe.slice(start, start + (compact ? 4 : VISIBLE));
	const local = reduce ? Math.round(cursor - start) : cursor - start;
	const current = safe[Math.min(max, Math.round(cursor))] ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: compact ? "prompter prompter-compact" : "prompter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: current
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prompter-bar",
				style: { transform: `translateY(${local * 4.75}rem)` },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				children: shown.map((line, row) => {
					const on = Math.abs(row - local) < .65;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: on ? "prompter-line is-on" : "prompter-line",
						children: line
					}, start + row);
				})
			})
		]
	});
}
var Ctx = (0, import_react.createContext)(null);
function roomId(code) {
	return `lv-${code}`;
}
function LyricLink({ song, snap, children }) {
	const code = song.roomCode || "VENT";
	const p2p = useP2PRoom({
		room: roomId(code),
		name: "Leder"
	});
	const lines = lyricLines(song.lyrics);
	const index = lyricIndex(song, snap.position);
	const playing = snap.playing || snap.recording;
	const cue = (0, import_react.useRef)({
		lead: true,
		title: song.title,
		lines,
		index,
		playing
	});
	cue.current = {
		lead: true,
		title: song.title || "Uten navn",
		lines,
		index,
		playing
	};
	(0, import_react.useEffect)(() => {
		let last = 0;
		let frame = 0;
		const loop = (now) => {
			if (now - last >= 120) {
				p2p.broadcast(cue.current);
				last = now;
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, [p2p.broadcast]);
	const value = {
		code,
		joined: p2p.joined,
		peers: p2p.peers,
		lines,
		index,
		playing
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useLyricLink() {
	const value = (0, import_react.useContext)(Ctx);
	if (!value) throw new Error("Teksten er ikke knyttet.");
	return value;
}
function isLyricCue(data) {
	if (!data || typeof data !== "object") return false;
	const cue = data;
	return cue.lead === true && Array.isArray(cue.lines) && typeof cue.index === "number";
}
function SammenPanel({ song }) {
	const link = useLyricLink();
	const [note, setNote] = (0, import_react.useState)(null);
	const withUs = link.peers.filter((peer) => peer.connectionState === "connected");
	const waiting = link.peers.filter((peer) => peer.connectionState !== "connected" && !peer.connectionState.includes("fail"));
	async function share() {
		const url = `${window.location.origin}/sammen/${link.code}`;
		const text = `Kode ${link.code}. Teksten går av seg selv.`;
		const nav = navigator;
		try {
			if (nav.share) {
				await nav.share({
					title: song.title || "ThorSound",
					text,
					url
				});
				return;
			}
			await navigator.clipboard.writeText(`${text} ${url}`);
			setNote("Lenken er kopiert.");
		} catch {
			setNote(url);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Sammen",
			lede: "Si koden. De andre skriver den på forsiden. Når du spiller, går teksten av seg selv. De slipper å løpe etter den."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "code-mark font-display text-5xl text-lamp",
			children: link.code
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				link.joined ? "Klar til å følge." : "Kobler sammen…",
				withUs.length > 0 ? ` ${withUs.map((peer) => peer.name || "Med").join(", ")} er med.` : " Ingen andre ennå.",
				waiting.length > 0 ? " Noen er på vei inn." : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				onClick: () => void share(),
				children: "Del koden"
			})
		}),
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prompter, {
				lines: link.lines,
				index: link.playing ? link.index : link.index
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Trykk spill nederst. Teksten følger låten."
		})
	] });
}
function FollowScreen({ code }) {
	const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
	const [name, setName] = (0, import_react.useState)("");
	const [go, setGo] = (0, import_react.useState)(false);
	if (!/^[A-Z0-9]{4}$/.test(clean)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh w-full max-w-3xl px-5 pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-sm text-muted",
			children: "Til forsiden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 font-display text-4xl",
			children: "Koden er fire tegn"
		})]
	});
	if (!go) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "inline-flex min-h-11 items-center text-sm text-muted",
				children: "Til forsiden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "code-mark mt-6 font-display text-5xl text-lamp",
				children: clean
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl",
				children: "Hva heter du?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Den som spiller ser navnet. Teksten går av seg selv etterpå."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					setGo(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Navnet ditt",
					value: name,
					onChange: (event) => setName(event.target.value.slice(0, 24)),
					className: "w-full min-h-14 rounded-md border border-line bg-surface px-4 text-xl",
					placeholder: "For eksempel Mamma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					type: "submit",
					children: "Se teksten"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FollowerRoom, {
		code: clean,
		name: name.trim() || "Med"
	});
}
function FollowerRoom({ code, name }) {
	const p2p = useP2PRoom({
		room: roomId(code),
		name
	});
	const [cue, setCue] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => p2p.onMessage((_from, data) => {
		if (isLyricCue(data)) setCue(data);
	}), [p2p.onMessage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex min-h-11 items-center text-sm text-muted",
					children: "Ut"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "code-mark text-sm text-lamp",
					children: code
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl",
				children: cue?.title || "Venter på teksten"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: !p2p.joined ? "Kobler sammen…" : cue ? "Teksten følger den som spiller. Du trenger ikke trykke." : "Be den som har sangen trykke spill."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prompter, {
					lines: cue?.lines ?? ["Venter…"],
					index: cue?.playing ? cue.index : cue?.index ?? 0
				})
			})
		]
	});
}
//#endregion
export { isLyricCue as a, roomId as c, SammenPanel as i, useLyricLink as l, LyricLink as n, lyricIndex as o, Prompter as r, lyricLines as s, FollowScreen as t, useP2PRoom as u };
