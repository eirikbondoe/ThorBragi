import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$2 } from "./router-BRYx0h_P.mjs";
import { a as isLyricCue, c as roomId, u as useP2PRoom } from "./lyric-link-D151QNXi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lag._code-RD20XTXP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OverlayScreen({ code }) {
	const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
	const videoRef = (0, import_react.useRef)(null);
	const [ren, setRen] = (0, import_react.useState)(false);
	const [camera, setCamera] = (0, import_react.useState)(false);
	const [camError, setCamError] = (0, import_react.useState)(null);
	const [cue, setCue] = (0, import_react.useState)(null);
	const p2p = useP2PRoom({
		room: roomId(/^[A-Z0-9]{4}$/.test(clean) ? clean : "VENT"),
		name: "Bilde"
	});
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		const textOnly = params.get("ren") === "1";
		const withCamera = params.get("kamera") === "1";
		document.documentElement.classList.toggle("overlay-clear", textOnly || !withCamera);
		setRen(textOnly);
		setCamera(withCamera && !textOnly);
		return () => document.documentElement.classList.remove("overlay-clear");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!camera) return;
		let stream = null;
		let dead = false;
		navigator.mediaDevices.getUserMedia({
			video: { facingMode: "user" },
			audio: false
		}).then((next) => {
			if (dead) {
				next.getTracks().forEach((track) => track.stop());
				return;
			}
			stream = next;
			const el = videoRef.current;
			if (!el) return;
			el.srcObject = next;
			el.play().catch(() => void 0);
		}).catch(() => {
			if (!dead) setCamError("Si ja til kameraet i nettleseren, og åpne bildet på nytt.");
		});
		return () => {
			dead = true;
			stream?.getTracks().forEach((track) => track.stop());
		};
	}, [camera]);
	(0, import_react.useEffect)(() => p2p.onMessage((_from, data) => {
		if (isLyricCue(data)) setCue(data);
	}), [p2p.onMessage]);
	const lines = cue?.lines ?? [];
	const line = lines[Math.min(lines.length - 1, Math.max(0, Math.round(cue?.index ?? 0)))] ?? "";
	const title = cue?.title || (p2p.joined ? "Venter på sangen" : "Kobler til…");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: camera ? "relative min-h-dvh bg-bg" : "relative min-h-dvh",
		children: [
			camera ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: "mirror-x fixed inset-0 h-full w-full object-cover",
				playsInline: true,
				muted: true,
				autoPlay: true
			}) : null,
			ren ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute top-4 left-4 z-10 min-h-11 rounded-full bg-bg/80 px-4 text-sm",
				onClick: () => void document.documentElement.requestFullscreen?.(),
				children: "Fullskjerm"
			}),
			camError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute inset-x-6 top-1/3 z-10 text-center text-sm",
				children: camError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 bottom-0 z-10 bg-bg/80 px-8 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-widest text-lamp uppercase",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-4xl leading-tight sm:text-5xl",
					children: line || "Teksten kommer her"
				})]
			})
		]
	});
}
function LagRoute() {
	const { code } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayScreen, { code });
}
//#endregion
export { LagRoute as component };
