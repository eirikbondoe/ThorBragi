import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as Logo, o as PanelHead, t as Button } from "./mark-Dbp9pnc0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell--g2eojab.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		title: "Headset før alt annet",
		text: "Kabel i telefonen, øreproppene i ørene. Høyttaleren har anstrengelsesastma og havner på opptaket hvis den er på."
	},
	{
		title: "Mikrofonen på telefonen",
		text: "Den sitter som regel i bunnen. Pek den mot munnen, ikke mot lomma. Når nettleseren spør, si ja til mikrofon.",
		job: "monitor",
		action: "Sjekk nivået"
	},
	{
		title: "En mikrofon med kabel",
		text: "Plugg den i telefonen, eller i en liten boks som igjen plugges i telefonen. Da hører appen den, ikke den tynne i bunnen."
	},
	{
		title: "Akustisk gitar",
		text: "Gitaren mellom deg og telefonen. Mikrofonen litt nærmere munnen enn lydhullet, ellers spiser gitaren stemmen."
	},
	{
		title: "Gitar med kabel",
		text: "Elektrisk gitar rett i telefonen virker nesten aldri. Bruk et lite lydkort med USB. Det dukker opp som mikrofon."
	},
	{
		title: "Bluetooth",
		text: "Fint til å høre på. Dårlig til å ta opp. Det kommer seint, og mikrofonen i headsettet blir ofte tynn. Bruk kabel når du tar opp."
	},
	{
		title: "To stykker",
		text: "Én telefon tar opp. Den andre får koden og ser teksten. Bluetooth sender ikke opptaket mellom dem.",
		job: "sammen",
		action: "Åpne sammen"
	},
	{
		title: "Så tar du opp",
		text: "Nivået skal danse i midten, ikke ligge dødt og ikke slå i taket. Fire slag, så er du i gang.",
		job: "opptak",
		action: "Ta opp"
	}
];
function GearGuide({ go, titled = true }) {
	const [done, setDone] = (0, import_react.useState)(() => STEPS.map(() => false));
	const finished = done.filter(Boolean).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		titled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Koble utstyr",
			lede: "Åtte steg. Du trenger ikke en mikser. Du trenger kabel, og å peke mikrofonen riktig vei."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Åtte steg. Kabel, ikke bluetooth, når du tar opp."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted tabular-nums",
			children: [
				finished,
				" av ",
				STEPS.length,
				" gjort"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "divide-y divide-line border-y border-line",
			children: STEPS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": done[index],
					onClick: () => setDone((current) => current.map((item, itemIndex) => itemIndex === index ? !item : item)),
					className: "flex w-full items-start gap-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: done[index] ? "mt-0.5 flex size-7 shrink-0 items-center justify-center bg-fg text-xs text-ink" : "mt-0.5 flex size-7 shrink-0 items-center justify-center border border-line text-xs",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: done[index] ? "block font-medium text-muted line-through" : "block font-medium",
						children: step.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: step.text
					})] })]
				}), step.job && go ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					variant: "quiet",
					onClick: () => go(step.job),
					children: step.action
				}) : null]
			}, step.title))
		})
	] });
}
function Shell({ children, back }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 bg-bg/95 px-5 pt-2 backdrop-blur-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "crystal-rule -mx-5 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pb-3",
				children: [back ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: back.to,
					className: "inline-flex min-h-11 items-center gap-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						className: "size-4",
						"aria-hidden": true
					}), back.label]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), back ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "Bondova"
				})]
			})]
		}), children]
	});
}
//#endregion
export { Shell as n, GearGuide as t };
