//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-CyJuJx3X.js
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
			"/assets/index-BhFZTQcN.js",
			"/assets/rolldown-runtime-CbXtAM7H.js",
			"/assets/link-Cov37-hO.js",
			"/assets/preload-helper-B42GTaq_.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-BhFZTQcN.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DoHLwfK9.js",
			"/assets/shell-Czl3tMiM.js",
			"/assets/mark-CFTytOJy.js"
		]
	},
	"/lag/$code": {
		filePath: "/workspace/src/routes/lag.$code.tsx",
		children: void 0,
		preloads: ["/assets/lag._code-e9RYugTD.js", "/assets/lyric-link-Ddmk1snj.js"]
	},
	"/sammen/$code": {
		filePath: "/workspace/src/routes/sammen.$code.tsx",
		children: void 0,
		preloads: ["/assets/sammen._code-D4EIg0Me.js", "/assets/lyric-link-Ddmk1snj.js"]
	},
	"/sang/$id": {
		filePath: "/workspace/src/routes/sang.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/sang._id-CawOJkGD.js",
			"/assets/shell-Czl3tMiM.js",
			"/assets/mark-CFTytOJy.js",
			"/assets/lyric-link-Ddmk1snj.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
