//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-Tp11wmIO.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/api/rtc",
			"/api/transcribe",
			"/lag/$code",
			"/sammen/$code",
			"/sang/$id"
		],
		preloads: [
			"/assets/index-B2zKu7DQ.js",
			"/assets/rolldown-runtime-CbXtAM7H.js",
			"/assets/link-Cov37-hO.js",
			"/assets/preload-helper-B42GTaq_.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-B2zKu7DQ.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DdTCVOIR.js",
			"/assets/shell-Buwqp02A.js",
			"/assets/mark-BKDyrXdz.js"
		]
	},
	"/lag/$code": {
		filePath: "/workspace/src/routes/lag.$code.tsx",
		children: void 0,
		preloads: ["/assets/lag._code-CMtC65zY.js", "/assets/lyric-link-BaobI9Rp.js"]
	},
	"/sammen/$code": {
		filePath: "/workspace/src/routes/sammen.$code.tsx",
		children: void 0,
		preloads: ["/assets/sammen._code-aTyCoTLO.js", "/assets/lyric-link-BaobI9Rp.js"]
	},
	"/sang/$id": {
		filePath: "/workspace/src/routes/sang.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/sang._id-CNQaevC_.js",
			"/assets/shell-Buwqp02A.js",
			"/assets/mark-BKDyrXdz.js",
			"/assets/lyric-link-BaobI9Rp.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
