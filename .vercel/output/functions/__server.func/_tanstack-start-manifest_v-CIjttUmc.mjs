//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-CIjttUmc.js
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
			"/assets/index-CAD5cKzg.js",
			"/assets/rolldown-runtime-CbXtAM7H.js",
			"/assets/link-Cov37-hO.js",
			"/assets/preload-helper-B42GTaq_.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-CAD5cKzg.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BNROBdGD.js",
			"/assets/shell-CHvtKoay.js",
			"/assets/mark-BWBpjs6D.js"
		]
	},
	"/lag/$code": {
		filePath: "/workspace/src/routes/lag.$code.tsx",
		children: void 0,
		preloads: ["/assets/lag._code-B3EJPHnc.js", "/assets/lyric-link-BV_X7Srd.js"]
	},
	"/sammen/$code": {
		filePath: "/workspace/src/routes/sammen.$code.tsx",
		children: void 0,
		preloads: ["/assets/sammen._code-D55_UIjT.js", "/assets/lyric-link-BV_X7Srd.js"]
	},
	"/sang/$id": {
		filePath: "/workspace/src/routes/sang.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/sang._id-B6QwTH8u.js",
			"/assets/shell-CHvtKoay.js",
			"/assets/mark-BWBpjs6D.js",
			"/assets/lyric-link-BV_X7Srd.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
