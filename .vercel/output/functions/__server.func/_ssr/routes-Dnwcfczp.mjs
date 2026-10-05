import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as ChevronRight, c as Trash2 } from "../_libs/lucide-react.mjs";
import { _ as songDuration, h as hydrateStudio, p as formatTime, t as Button, v as useStudio, y as whenLabel } from "./mark-lLZAXZY-.mjs";
import { n as Shell, t as GearGuide } from "./shell-K9lprTdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dnwcfczp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeScreen() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [joining, setJoining] = (0, import_react.useState)(false);
	const [gear, setGear] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const songs = useStudio((state) => state.songs);
	const createSong = useStudio((state) => state.createSong);
	const deleteSong = useStudio((state) => state.deleteSong);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		hydrateStudio().then(() => setReady(true));
	}, []);
	function create() {
		const id = createSong();
		navigate({
			to: "/sang/$id",
			params: { id }
		});
	}
	function join(event) {
		event.preventDefault();
		const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
		if (clean.length !== 4) return;
		navigate({
			to: "/sammen/$code",
			params: { code: clean }
		});
	}
	const list = ready ? [...songs].sort((a, b) => b.updatedAt - a.updatedAt) : [];
	const latest = list[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col px-5 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Sitt. Syng. La banen vente."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [
					latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						className: "col-span-2",
						onClick: () => void navigate({
							to: "/sang/$id",
							params: { id: latest.id }
						}),
						children: ["Fortsett ", latest.title || "låten"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "col-span-2",
						onClick: create,
						children: "Ny låt"
					}),
					latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: create,
						children: "Ny låt"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						className: latest ? "" : "col-span-1",
						onClick: () => setGear((open) => !open),
						children: gear ? "Skjul" : "Utstyr"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						className: latest ? "col-span-2" : "",
						onClick: () => setJoining((open) => !open),
						children: "Tekstkode"
					})
				]
			}),
			gear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-md border border-line bg-raised px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearGuide, { titled: false })
			}) : null,
			joining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3 rounded-md border border-line bg-raised p-4",
				onSubmit: join,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm text-muted",
						htmlFor: "room-code",
						children: "Koden fra den som spiller"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "room-code",
						"aria-label": "Kode",
						value: code,
						autoCapitalize: "characters",
						autoCorrect: "off",
						spellCheck: false,
						maxLength: 4,
						onChange: (event) => setCode(event.target.value.toUpperCase()),
						className: "code-mark w-full min-h-14 rounded-md border border-line bg-surface text-center font-display text-4xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						type: "submit",
						disabled: code.replace(/[^A-Za-z0-9]/g, "").length !== 4,
						children: "Se teksten"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: "Låtene"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted tabular-nums",
						children: ready ? list.length : ""
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-md border border-line bg-raised",
					children: [
						!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-sm text-muted",
							children: "Henter låtene…"
						}) : null,
						ready && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-sm text-muted",
							children: "Ingen låter ennå. Banen er der ute. Du er her inne."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((song) => {
							const length = songDuration(song);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center border-b border-line last:border-b-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/sang/$id",
									params: { id: song.id },
									className: "flex min-w-0 flex-1 items-center gap-3 px-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-10 shrink-0 place-items-center rounded-md bg-surface font-display text-sm text-crystal",
											children: song.keyName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate font-medium",
												children: song.title || "Uten navn"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-0.5 block truncate text-sm text-muted",
												children: [
													song.bpm,
													" slag · ",
													song.tracks.length,
													" spor",
													length > 0 ? ` · ${formatTime(length)}` : "",
													" · ",
													whenLabel(song.updatedAt)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											className: "size-4 shrink-0 text-muted",
											"aria-hidden": true
										})
									]
								}), confirmId === song.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 gap-1 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "danger",
										onClick: () => {
											deleteSong(song.id);
											setConfirmId(null);
										},
										children: "Slett"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => setConfirmId(null),
										children: "Nei"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Slett ${song.title || "låten"}`,
									onClick: () => setConfirmId(song.id),
									className: "mr-2 grid size-11 shrink-0 place-items-center text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}, song.id);
						}) })
					]
				})]
			})
		]
	}) });
}
var SplitComponent = HomeScreen;
//#endregion
export { SplitComponent as component };
