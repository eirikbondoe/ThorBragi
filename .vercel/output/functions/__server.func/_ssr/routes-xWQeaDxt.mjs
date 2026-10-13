import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Trash2, k as ChevronRight } from "../_libs/lucide-react.mjs";
import { b as whenLabel, g as hydrateStudio, m as formatTime, t as Button, v as songDuration, y as useStudio } from "./mark-DIabbQ3z.mjs";
import { n as Shell, t as Rig } from "./shell-Bcg0cluM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xWQeaDxt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeScreen() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [joining, setJoining] = (0, import_react.useState)(false);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex flex-1 flex-col px-5 pb-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, { footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded-md border border-line bg-raised px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: "Om appen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ThorSound er et hjemmestudio i nettleseren. Du har utstyret. Appen viser hvordan det kobles, og sier ifra når lyden er sterk nok til å tas opp." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Utstyr. Du velger mikrofon, lydkort, mikser, kamera, adapter og hodetelefoner. Deretter får du en oppskrift for det oppsettet, og hjelp hvis det er stille." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opptak. Test inngangen først. Måleren skal ligge mellom -12 og -6. Du kan telle fire slag, eller starte med en gang. Du kan ta opp flere spor, sette tempo og klikk, lage en loop, stemme, og la teksten følge sangen med akkorder under." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Etterpå. Du kan kutte endene, fade inn og ut, og løfte et spor så det sterkeste ligger rundt -6. Du kan også sette styrke, tone, jevnhet, rom og ekko. Ferdig lyd er et lett løft. Den redder ikke et dårlig opptak. Trommer passer bare hvis du spilte mot klikk. Støy i en samtale kan dempes, og talen kan skrives ut som tekst." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Lagring. WAV er urørt, til å jobbe videre med. MP3 for YouTube løftes mot omtrent -14 LUFS, og toppen holdes under -1." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bilde og deling. Du kan ta opp video, og dele en lang film i lengder for TikTok, Instagram og Shorts. En tekstkode lar en annen synge med. OBS og videosamtale får teksten og tittelen. ThorSound sender ikke selv." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Utkast. Korte lydfiler kan bli et utkast til sang eller rap. To bilder kan bli et utkast til musikkvideo. Du hører og ser resultatet før du bruker det." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-3 rounded-md border border-line bg-raised px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: "Om Thor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mich-Thor Patrick Jakkobbsen er 19 og et halvt år. Han er 163 cm og har store blonde krøller." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Han er fra Myre, men vokste opp i Alta. Foreldrene ville ikke vedkjenne seg ham. Det begynte på en sommerfest i 1990, da Rune Rudberg og Per Heimly møtte Gunvor Hals." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Etter årene i Alta, og ufrivillig tett kontakt med onkelen Rune Gregory, dro han til Trondheim på skateboard." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Han har hatt brudd i øyehulen, flere alvorlige hårbrister, forstuing, voksesmerter i ørene og anstrengelsesastma." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Trenger du noen å snakke med, er det ikke en hjelpetelefon. Setningen er en del av historien: ring Mich-Thor Patrick Jakkobbsen på telefonkiosken ved Trondheim torg, sett deg ned, og vent på elefanten." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 mt-8 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: "Når lyden virker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted tabular-nums",
						children: ready ? list.length : ""
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: create,
						children: "Ny låt"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: () => setJoining((open) => !open),
						children: "Tekstkode"
					})]
				}),
				joining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "panel-in mb-3 space-y-3 rounded-md border border-line bg-raised p-4",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-md border border-line bg-raised",
					children: [
						!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-sm text-muted",
							children: "Henter låtene…"
						}) : null,
						ready && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-sm text-muted",
							children: "Ingen låter ennå. Koble utstyret først."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((song) => {
							const length = songDuration(song);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center border-b border-line last:border-b-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/sang/$id",
									params: { id: song.id },
									className: "row-link flex min-w-0 flex-1 items-center gap-3 px-3 py-3",
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
											className: "row-chevron size-4 shrink-0 text-muted",
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
				})
			]
		}) })
	}) });
}
var SplitComponent = HomeScreen;
//#endregion
export { SplitComponent as component };
