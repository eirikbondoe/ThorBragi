import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as Logo, n as Button, t as BondovaMark } from "./mark-B4inB7NG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-qQgO9_d-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	vert: "Hvor lyden skal inn",
	mikrofon: "Mikrofoner",
	lydkort: "Lydkort",
	mikser: "Miksere",
	hoyttaler: "Høyttalere",
	kamera: "Kameraer",
	adapter: "Adaptere og kabler",
	hodetelefon: "Hodetelefoner"
};
var GOALS = [
	{
		id: "hore",
		label: "Høre oss",
		text: "Lyden i høyttalerne. Ingenting tas opp."
	},
	{
		id: "stemme",
		label: "Ta opp stemme",
		text: "Én mikrofon. Snakke eller synge."
	},
	{
		id: "gitar",
		label: "Ta opp gitar og stemme",
		text: "Begge samtidig."
	},
	{
		id: "karaoke",
		label: "YouTube-karaoke på iPad",
		text: "Videoen med tekst blir på iPaden. Dette oppsettet heter Evensenmodus."
	},
	{
		id: "film",
		label: "Filme",
		text: "Bilde og lyd som hører sammen."
	},
	{
		id: "samtale",
		label: "Snakke i en samtale",
		text: "Video eller telefon. Én lyd, ikke to."
	}
];
var PIECES = [
	{
		id: "telefon",
		kind: "vert",
		name: "Telefon",
		into: "Lyden skal inn i telefonen.",
		note: "Mikrofonen sitter som regel ved ladeporten."
	},
	{
		id: "ipad",
		kind: "vert",
		name: "iPad med YouTube-karaoke",
		into: "Videoen med tekst blir på skjermen. Lyden går i AUX.",
		note: "Eget valg i oppsettet. Bluetooth av. Dette er starten på Evensenmodus."
	},
	{
		id: "data",
		kind: "vert",
		name: "Datamaskin",
		into: "Lyden skal inn i en USB-port.",
		note: "Etter at du har plugget i, må du velge den enheten som inngang."
	},
	{
		id: "mic-innebygd",
		kind: "mikrofon",
		name: "Mikrofonen i telefonen",
		into: "Sitter allerede i telefonen.",
		note: "Pek den mot munnen. En lomme demper den."
	},
	{
		id: "mic-usb",
		kind: "mikrofon",
		name: "USB-mikrofon",
		into: "USB rett i datamaskinen, eller i telefonen hvis kontakten passer.",
		note: "Den trenger ikke et eget lydkort. Den er lydkortet."
	},
	{
		id: "mic-xlr",
		kind: "mikrofon",
		name: "Mikrofon med XLR",
		into: "XLR-kabel inn i lydkort eller mikser. Ikke rett i telefonen.",
		note: "De fleste mikrofoner med tykk kabel er denne typen."
	},
	{
		id: "lydkort",
		kind: "lydkort",
		name: "USB-lydkort",
		into: "USB til datamaskin eller telefon. Mikrofon og gitar inn i kortet.",
		note: "Når kortet er i bruk, skal hodetelefonene sitte i kortet."
	},
	{
		id: "mikser-usb",
		kind: "mikser",
		name: "Mikser med USB",
		into: "USB til datamaskinen. Den kan gjøre jobben til et lydkort.",
		note: "Kanalen og USB-utgangen må være skrudd opp. Ellers er den stille."
	},
	{
		id: "mikser",
		kind: "mikser",
		name: "Mikser uten USB",
		into: "Utgangen må videre til et lydkort. En mikser alene når ikke telefonen.",
		note: "Main out er sterkt. Det skal inn på line, ikke mic, hvis lydkortet har begge."
	},
	{
		id: "peavey-mp400",
		kind: "mikser",
		name: "Peavey MP 400",
		into: "Fire kanaler. XLR er mikrofon. 6,3 mm er gitar. Ingen USB, så PC-en ser den ikke.",
		note: "Bak står det 80 watt i 4 ohm, 50 watt i 8 ohm. Laveste last er 4 ohm. De to høyttalerutgangene er parallellkoblet."
	},
	{
		id: "peavey-hoyttaler",
		kind: "hoyttaler",
		name: "To Peavey-høyttalere",
		into: "To kasser. Hver får sin kabel fra høyttalerutgangene bak på MP 400.",
		note: "Ikke i AUX, MAIN eller OUTPUT foran. To kasser på 8 ohm er greit. To på 4 ohm er for lavt. Da bruker du bare én."
	},
	{
		id: "kamera-tlf",
		kind: "kamera",
		name: "Telefonen som kamera",
		into: "Samme telefon kan ta bilde og lyd.",
		note: "To telefoner, én til bilde og én til lyd, er også et oppsett."
	},
	{
		id: "kamera",
		kind: "kamera",
		name: "Eget kamera",
		into: "Tar bildet. Lyden tas ofte opp ved siden av.",
		note: "En klapp i starten gjør det lettere å legge lyden på bildet etterpå."
	},
	{
		id: "webkamera",
		kind: "kamera",
		name: "Webkamera",
		into: "USB i datamaskinen.",
		note: "Mikrofonen i kameraet er ofte tynn. En egen mikrofon er tydeligere."
	},
	{
		id: "usb-c",
		kind: "adapter",
		name: "USB-C-adapter",
		into: "Mellom en USB-A-plugg og en port som bare er USB-C.",
		note: "En adapter som bare lader, sender ikke lyd. Den må føre data."
	},
	{
		id: "trrs",
		kind: "adapter",
		name: "3,5 mm med fire deler",
		into: "Én plugg til både hodetelefon og mikrofon.",
		note: "En plugg med tre deler har lyd ut, men ingen mikrofon."
	},
	{
		id: "jack",
		kind: "adapter",
		name: "6,3 mm til 3,5 mm",
		into: "Gjør en stor hodetelefonplugg om til en liten.",
		note: "Den flytter ikke en mikrofon. Den endrer bare størrelsen."
	},
	{
		id: "xlr",
		kind: "adapter",
		name: "XLR-kabel",
		into: "Fra mikrofon til lydkort eller mikser.",
		note: "Endene er ulike. De passer bare én vei."
	},
	{
		id: "hodetelefon",
		kind: "hodetelefon",
		name: "Kablede hodetelefoner",
		into: "I telefonen, eller i lydkortet hvis lydkortet er i bruk.",
		note: "En lukket kopp lekker mindre inn i mikrofonen."
	},
	{
		id: "headset",
		kind: "hodetelefon",
		name: "Headset med mikrofon og kabel",
		into: "I telefonens 3,5 mm, eller i USB hvis headsettet er USB.",
		note: "Mikrofonen på ledningen skal peke mot munnen."
	},
	{
		id: "bluetooth",
		kind: "hodetelefon",
		name: "Bluetooth-hodetelefoner",
		into: "Trådløst. Bruk dem til å høre, ikke til å ta opp.",
		note: "Lyden kommer sent. Opptak med dem blir ofte tynt."
	}
];
var GUIDES = [
	{
		id: "telefon-headset",
		title: "Telefon og headset",
		goals: [
			"hore",
			"stemme",
			"samtale"
		],
		needs: ["telefon", "headset"],
		result: "Du hører deg selv i headsettet. Telefonen tar opp.",
		steps: [
			{
				title: "Kabelen i telefonen først",
				text: "Sett i headsettet før du åpner noe annet. Skru av Bluetooth."
			},
			{
				title: "Mikrofonen mot munnen",
				text: "Pinnen på ledningen skal peke mot munnen, ikke ligge på brystet."
			},
			{
				title: "Si ja til mikrofon",
				text: "Når telefonen spør, velg Tillat. Uten ja kommer det ingen lyd."
			},
			{
				title: "Snakk i vanlig styrke",
				text: "Lyden skal være tydelig. Er den svak, flytt mikrofonen nærmere munnen."
			}
		]
	},
	{
		id: "usb-mic",
		title: "USB-mikrofon til datamaskin",
		goals: [
			"hore",
			"stemme",
			"samtale"
		],
		needs: ["data", "mic-usb"],
		result: "Datamaskinen bruker USB-mikrofonen, ikke den innebygde.",
		steps: [
			{
				title: "Mikrofonen rett i USB",
				text: "Bruk en USB-C-adapter bare hvis kontaktene ikke passer. Adapteren må føre data."
			},
			{
				title: "Hodetelefonene i mikrofonen",
				text: "Hvis den har et hull til hodetelefon, bruk det. Da hører du lyden du tar opp."
			},
			{
				title: "Velg den som inngang",
				text: "Innstillinger, lyd, inngang: USB-mikrofonen. Ikke den innebygde."
			},
			{
				title: "Én app om gangen",
				text: "Lukk andre programmer som bruker mikrofonen. To programmer gir stillhet eller ekko."
			}
		]
	},
	{
		id: "xlr",
		title: "XLR-mikrofon og lydkort",
		goals: ["hore", "stemme"],
		needs: [
			"mic-xlr",
			"lydkort",
			"xlr"
		],
		result: "Mikrofonen går gjennom lydkortet. Hodetelefonene sitter i lydkortet.",
		steps: [
			{
				title: "XLR i mikrofonen",
				text: "Trykk den i til den sitter."
			},
			{
				title: "Andre enden i mic-inngangen",
				text: "Inngang merket mic eller 1. Ikke inngangen merket instrument."
			},
			{
				title: "48 V bare hvis mikrofonen krever det",
				text: "Dynamiske mikrofoner skal vanligvis ikke ha 48 V. Kondensatormikrofoner skal. Står det ikke på mikrofonen, la den stå av."
			},
			{
				title: "Lydkortet i USB",
				text: "Til datamaskin eller telefon. Hodetelefonene i lydkortet, ikke i telefonen."
			},
			{
				title: "Skru gain mens du snakker",
				text: "Stemmen skal være tydelig. Et rødt lys som står på, betyr at det er for sterkt."
			}
		]
	},
	{
		id: "gitar",
		title: "Gitar inn i lydkort",
		goals: ["gitar"],
		needs: ["lydkort", "hodetelefon"],
		result: "Gitaren går i instrument-inngangen. Ikke rett i telefonen.",
		steps: [
			{
				title: "Vanlig instrumentkabel",
				text: "6,3 mm, fra gitaren."
			},
			{
				title: "Inn i instrument eller hi-z",
				text: "Mic-inngangen er feil hull for en gitar alene."
			},
			{
				title: "Lydkortet i USB",
				text: "Datamaskin, eller telefon hvis kontakten og telefonen støtter det."
			},
			{
				title: "Hodetelefon i lydkortet",
				text: "Ellers hører du gitaren sent, eller ikke i det hele tatt."
			}
		]
	},
	{
		id: "stemme-gitar",
		title: "Stemme og gitar i samme kort",
		goals: ["gitar", "stemme"],
		needs: [
			"mic-xlr",
			"lydkort",
			"xlr",
			"hodetelefon"
		],
		result: "Mikrofon i mic. Gitar i instrument. Ett lydkort til datamaskinen.",
		steps: [
			{
				title: "Mikrofonen i mic",
				text: "XLR-kabel. 48 V bare hvis mikrofonen krever det."
			},
			{
				title: "Gitaren i instrument",
				text: "Eget hull. Ikke samme hull som mikrofonen."
			},
			{
				title: "To knotter",
				text: "Skru mic-gain og instrument-gain hver for seg, til begge er tydelige."
			},
			{
				title: "Hodetelefon i lydkortet",
				text: "Én utgang. Da hører du begge."
			},
			{
				title: "USB til datamaskin eller telefon",
				text: "Velg lydkortet som inngang. Ikke den innebygde mikrofonen."
			}
		]
	},
	{
		id: "mikser-usb",
		title: "Mikser med USB",
		goals: [
			"hore",
			"stemme",
			"gitar"
		],
		needs: ["mikser-usb", "data"],
		result: "Mikseren er lydkortet. Datamaskinen ser den som én inngang.",
		steps: [
			{
				title: "USB mellom mikser og datamaskin",
				text: "Rett kabel. Adapter bare hvis kontaktene krever det, og den må føre data."
			},
			{
				title: "Kanalen opp",
				text: "Gain og skyveknapp på den kanalen du bruker, over null."
			},
			{
				title: "USB-veien på",
				text: "Hvis mikseren har en knapp merket USB, skal kanalen gå til USB. Uten den er datamaskinen stille."
			},
			{
				title: "Hodetelefon i mikseren",
				text: "Ikke i datamaskinen."
			},
			{
				title: "Velg mikseren som inngang",
				text: "I lydinnstillingene på datamaskinen."
			}
		]
	},
	{
		id: "mikser-line",
		title: "Mikser uten USB",
		goals: ["stemme", "gitar"],
		needs: ["mikser", "lydkort"],
		result: "Mikserens utgang går inn i lydkortet. Lydkortet går i datamaskinen.",
		steps: [
			{
				title: "Mikrofon eller gitar inn i mikseren",
				text: "Riktig kanal. Gain opp, skyveknapp opp."
			},
			{
				title: "Main out til lydkortets line-inngang",
				text: "Main out er sterkt. Line, ikke mic, hvis kortet har begge."
			},
			{
				title: "Lydkortet i USB",
				text: "Til datamaskinen. Hodetelefonene i lydkortet eller mikseren, ett sted."
			},
			{
				title: "Velg lydkortet",
				text: "Datamaskinen skal ikke lytte til sin egen mikrofon."
			}
		]
	},
	{
		id: "peavey-hore",
		title: "Peavey MP 400 i rommet",
		goals: [
			"hore",
			"stemme",
			"gitar"
		],
		needs: ["peavey-mp400"],
		result: "Du hører mikrofon og gitar i begge Peavey-høyttalerne. Ingenting går til PC-en.",
		steps: [
			{
				title: "Grønt lys",
				text: "POWER på. Lyset betyr strøm, ikke at lyden er oppe."
			},
			{
				title: "Mikrofon i XLR",
				text: "LOW Z på kanal 1, 2, 3 eller 4. Ikke i AUX, INPUTS eller REMOTE SWITCH ved master."
			},
			{
				title: "Gitar i 6,3 mm",
				text: "HIGH Z på en annen kanal. Samme kanal tar ikke imot XLR og 6,3 mm samtidig."
			},
			{
				title: "XLR har 15 volt alltid",
				text: "Bare en balansert mikrofon der. En gitarplugg skal ikke i XLR."
			},
			{
				title: "LEVEL, så MASTER LEVEL",
				text: "Kanalen først, omtrent midt på. MASTER LEVEL etterpå. Ikke start med master på fullt."
			},
			{
				title: "EQ i midten",
				text: "MASTER EQUALIZATION, LOW, MID og HIGH, i midtstilling. Det er flatt."
			},
			{
				title: "REVERB på null",
				text: "Både kanalens reverb og MASTER REVERB. Skru det opp etter at stemmen høres."
			},
			{
				title: "To høyttalere bak",
				text: "Begge kablene sitter i utgangene bak. De er parallellkoblet. Samlet last skal ikke under 4 ohm. 8 ohm på begge kasser blir 4, og det er greit. 4 ohm på begge blir 2, og det er for lavt. Tallet på kassen står ved kontakten, ikke på mikseren."
			}
		]
	},
	{
		id: "peavey-pc",
		title: "Peavey MP 400 til PC",
		goals: ["stemme", "gitar"],
		needs: [
			"peavey-mp400",
			"lydkort",
			"data"
		],
		result: "Mikseren lager miksen. Lydkortet tar linje-utgangen inn i PC-en.",
		steps: [
			{
				title: "Kanalene først",
				text: "Mikrofon i XLR. Gitar i 6,3 mm på en annen kanal. LEVEL opp."
			},
			{
				title: "OUTPUT foran",
				text: "Linje-utgangen foran. Ikke høyttalerutgangen bak."
			},
			{
				title: "Inn i lydkortets line",
				text: "Ikke mic-inngangen. Main out er sterkt."
			},
			{
				title: "Lydkortet i USB",
				text: "Velg lydkortet som inngang på PC-en. Ikke den innebygde mikrofonen."
			},
			{
				title: "MASTER LEVEL lavt",
				text: "Skru opp til stemmen er tydelig. Stopp før det spraker."
			},
			{
				title: "Rød plugg",
				text: "En plugg i AUX eller INPUTS ved master er ikke mikrofonkanalen."
			}
		]
	},
	{
		id: "peavey-karaoke",
		title: "Evensenmodus",
		goals: [
			"karaoke",
			"hore",
			"gitar",
			"stemme"
		],
		needs: [
			"peavey-mp400",
			"peavey-hoyttaler",
			"ipad"
		],
		result: "iPaden spiller videoen med tekst. Gitar og mikrofon går i hver sin kanal. Lyden kommer i begge Peavey-høyttalerne.",
		steps: [
			{
				title: "Videoen på iPaden",
				text: "Åpne karaokevideoen på YouTube. Teksten blir på skjermen. Skru av Bluetooth."
			},
			{
				title: "iPad inn i AUX",
				text: "AUX står under INPUTS ved master, ikke under OUTPUTS. Hodetelefonutgangen på iPaden dit. USB-C trenger adapter til 3,5 mm, og den til 6,3 mm hvis hullet er stort. Volum på iPaden omtrent halvveis. MAIN er en utgang. Ikke sett iPaden der."
			},
			{
				title: "Gitar på egen kanal",
				text: "Kabel fra gitaren til LINE, merket HIGH Z, for eksempel kanal 1. Ikke i AUX. Ikke i XLR."
			},
			{
				title: "Mikrofon i XLR",
				text: "MIC, merket LOW Z, på en annen kanal. Der er det 15 volt, ikke 48. En vanlig mikrofon tåler det. En studiomikrofon som krever 48 volt blir ofte stille. Ikke gjennom iPaden."
			},
			{
				title: "LEVEL, så MASTER LEVEL",
				text: "Gitar og mikrofon hver for seg, omtrent midt på. MASTER LEVEL etterpå. Karaoke for høy: skru ned iPaden, ikke gitaren."
			},
			{
				title: "REVERB på null",
				text: "Til gitar og stemme sitter. Karaoke tåler lite romklang."
			},
			{
				title: "To Peavey-høyttalere",
				text: "Begge kablene sitter allerede i utgangene bak. Mikseren sier 4 ohm som laveste last, og at utgangene er parallellkoblet. 8 ohm på begge kasser er greit. 4 ohm på begge er for lavt. Tallet står på kassen, ved kontakten."
			},
			{
				title: "Start videoen",
				text: "Du skal høre karaoke, gitar og stemme i begge høyttalerne. Teksten leses på iPaden."
			}
		]
	},
	{
		id: "film-telefon",
		title: "Film med telefonen",
		goals: ["film"],
		needs: ["telefon", "kamera-tlf"],
		result: "Samme telefon tar bilde og lyd.",
		steps: [
			{
				title: "Headset med kabel",
				text: "Så høyttaleren ikke blir med på opptaket. Bluetooth av."
			},
			{
				title: "Mikrofonen fri",
				text: "Ikke dekk ladeporten med hånden. Det er der lyden kommer inn, hvis du bruker telefonens mikrofon."
			},
			{
				title: "Én telefon",
				text: "Bilde og lyd i samme telefon treffer hverandre. To telefoner må legges sammen etterpå."
			},
			{
				title: "Start begge når du er klar",
				text: "Si eller klapp én gang først, så du ser hvor lyden starter."
			}
		]
	},
	{
		id: "film-kamera",
		title: "Kamera til bildet, lyd ved siden av",
		goals: ["film"],
		needs: ["kamera", "lydkort"],
		result: "Kameraet tar bildet. Lydkortet tar lyden. Du legger dem sammen etterpå.",
		steps: [
			{
				title: "Ikke vent at kameraet hører lydkortet",
				text: "De er to bokser. Lyden ligger på datamaskinen. Bildet ligger i kameraet."
			},
			{
				title: "Klapp én gang",
				text: "Begge må gå. Klappen er merket du bruker for å legge dem på samme sted."
			},
			{
				title: "Hodetelefon i lydkortet",
				text: "Så du hører at lyden faktisk blir tatt opp."
			},
			{
				title: "Mikrofonen mot munnen",
				text: "Samme avstand hele tiden. Kameraet kan stå lenger unna."
			}
		]
	},
	{
		id: "samtale-headset",
		title: "Videosamtale med headset",
		goals: ["samtale", "hore"],
		needs: ["headset"],
		result: "Ett headset. Ikke høyttaler og mikrofon samtidig.",
		steps: [
			{
				title: "Kabel, ikke Bluetooth",
				text: "Bluetooth kommer sent og gjør at dere snakker i munnen på hverandre."
			},
			{
				title: "Velg headsettet i samtalen",
				text: "Både mikrofon og høyttaler. Ikke mikrofonen i telefonen og lyden i headsettet, med mindre det er meningen."
			},
			{
				title: "Skru av den andre mikrofonen",
				text: "To mikrofoner på en gang gir ekko hos den andre."
			},
			{
				title: "Hodetelefon på",
				text: "Høyttaler gjør at mikrofonen tar opp den andre personen også."
			}
		]
	}
];
var FAULTS = [
	{
		id: "stille",
		title: "Ingen lyd",
		signs: "Ingenting rører seg når du snakker.",
		checks: [
			"Er kabelen i helt, i begge ender?",
			"Sa du ja da maskinen spurte om mikrofon?",
			"Er riktig enhet valgt, ikke den innebygde?",
			"Står gain eller skyveknappen over null?",
			"Sitter hodetelefonene i samme boks som mikrofonen?"
		]
	},
	{
		id: "ekko",
		title: "Jeg hører meg dobbelt",
		signs: "Et ekko, eller den andre personen hører et ekko.",
		checks: [
			"Skru av høyttaleren. Bruk hodetelefon.",
			"La bare én mikrofon være på.",
			"Lukk andre programmer som også bruker mikrofonen.",
			"Skru av Bluetooth hvis du bruker kabel."
		]
	},
	{
		id: "svak",
		title: "Lyden er for svak",
		signs: "Du hører det, men det er tynt.",
		checks: [
			"Flytt mikrofonen nærmere munnen. En neve unna er et vanlig sted.",
			"Skru gain opp til det er tydelig, men ikke rødt hele tiden.",
			"Sjekk at du ikke har dempet kanalen.",
			"En mikrofon bak gitaren hører gitaren mer enn stemmen. Flytt den."
		]
	},
	{
		id: "sterk",
		title: "Det spraker",
		signs: "Rødt lys, eller lyden brekker.",
		checks: [
			"Skru gain ned.",
			"Flytt mikrofonen litt lenger fra munnen.",
			"48 V skal være av på en dynamisk mikrofon.",
			"Ikke kjør main out fra en mikser inn i en mic-inngang."
		]
	},
	{
		id: "ser-ikke",
		title: "Telefonen ser ikke mikrofonen",
		signs: "USB-mikrofonen eller lydkortet vises ikke.",
		checks: [
			"Prøv kabelen rett i, uten adapter.",
			"Hvis du må bruke adapter: den må føre data, ikke bare lading.",
			"Noen telefoner tar ikke imot USB-lyd. Da er det telefonen, ikke mikrofonen.",
			"Trekk ut, tell til tre, sett i igjen, og se på listen én gang til."
		]
	},
	{
		id: "brumm",
		title: "Det brummer",
		signs: "En jevn summ under stemmen eller gitaren.",
		checks: [
			"Prøv en annen kabel.",
			"Flytt lydkortet bort fra laderen og skjermen.",
			"XLR skal klikke helt i.",
			"Hvis brummen forsvinner når du tar i en metalldel, er det jord. Prøv et annet strømuttak."
		]
	},
	{
		id: "kamera",
		title: "Kameraet har ikke lyden",
		signs: "Bildet er der. Lyden mangler, eller er tynn.",
		checks: [
			"Kameraets egen mikrofon hører rommet, ikke stemmen tett på.",
			"Et lydkort sender ikke lyd til kameraet av seg selv.",
			"Ta lyden på lydkortet og bildet på kameraet. Klapp én gang så de kan legges sammen."
		]
	},
	{
		id: "hull",
		title: "Hodetelefonene sitter i feil hull",
		signs: "Du hører ingenting, eller du hører den innebygde lyden.",
		checks: [
			"Lydkort eller mikser i bruk: hodetelefonene i den boksen.",
			"Bare telefon: hodetelefonene i telefonen.",
			"Et hull merket output eller phones er riktig. Mic er inngang, ikke ørene."
		]
	},
	{
		id: "peavey",
		title: "Peavey MP 400 er stille",
		signs: "Grønt lys, men ingen lyd. Eller PC-en hører ingenting.",
		checks: [
			"LEVEL på kanalen og MASTER LEVEL må begge være oppe.",
			"Mikrofonen skal i XLR på kanal 1 til 4. Ikke i AUX ved master.",
			"XLR og 6,3 mm på samme kanal virker ikke samtidig.",
			"Denne mikseren har ingen USB. PC-en ser den ikke.",
			"Til PC: OUTPUT foran, inn i et lydkort på line, lydkortet i USB.",
			"De to utgangene bak går til hver sin Peavey-kasse. Ikke til AUX foran."
		]
	},
	{
		id: "bluetooth",
		title: "Bluetooth kommer for sent",
		signs: "Du hører deg selv etter at du har sunget, eller samtalen hakker.",
		checks: [
			"Bruk kabel når du tar opp eller snakker sammen.",
			"Bluetooth er til å høre ferdig lyd, ikke til å spille inn.",
			"Skru Bluetooth av, så telefonen ikke hopper tilbake til det."
		]
	}
];
var OWN_KEY = "thorsound-rig-own";
var TRIAL_KEY = "thorsound-rig-tests";
function pieceById(id) {
	return PIECES.find((piece) => piece.id === id);
}
function matchGuides(goal, owned) {
	return GUIDES.filter((guide) => guide.goals.includes(goal) && guide.needs.every((id) => owned.includes(id))).sort((a, b) => b.needs.length - a.needs.length);
}
function closestGuide(goal, owned) {
	return GUIDES.filter((guide) => guide.goals.includes(goal)).map((guide) => ({
		guide,
		missing: guide.needs.filter((id) => !owned.includes(id))
	})).sort((a, b) => a.missing.length - b.missing.length || b.guide.needs.length - a.guide.needs.length)[0] ?? null;
}
function loadOwned() {
	try {
		const raw = localStorage.getItem(OWN_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((id) => PIECES.some((piece) => piece.id === id)) : [];
	} catch {
		return [];
	}
}
function saveOwned(ids) {
	localStorage.setItem(OWN_KEY, JSON.stringify(ids));
}
function loadTrials() {
	try {
		const raw = localStorage.getItem(TRIAL_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function saveTrial(trial) {
	const next = [trial, ...loadTrials()].slice(0, 40);
	localStorage.setItem(TRIAL_KEY, JSON.stringify(next));
	return next;
}
var ORDER = [
	"vert",
	"mikrofon",
	"lydkort",
	"mikser",
	"hoyttaler",
	"kamera",
	"adapter",
	"hodetelefon"
];
var EVENSEN = [
	"ipad",
	"peavey-mp400",
	"peavey-hoyttaler",
	"mic-xlr"
];
var ASK = {
	karaoke: EVENSEN,
	hore: [
		"mic-xlr",
		"mic-usb",
		"mic-innebygd",
		"peavey-mp400",
		"peavey-hoyttaler",
		"headset",
		"telefon"
	],
	stemme: [
		"mic-xlr",
		"mic-usb",
		"mic-innebygd",
		"lydkort",
		"telefon",
		"data",
		"peavey-mp400"
	],
	gitar: [
		"mic-xlr",
		"lydkort",
		"peavey-mp400",
		"peavey-hoyttaler",
		"ipad",
		"data",
		"telefon"
	],
	film: [
		"telefon",
		"kamera-tlf",
		"kamera",
		"mic-xlr"
	],
	samtale: [
		"telefon",
		"headset",
		"bluetooth"
	]
};
var PATH = [
	"iPad → AUX",
	"Gitar → LINE",
	"Mikrofon → XLR",
	"Bak → to høyttalere"
];
function Rig({ footer, go }) {
	const [view, setView] = (0, import_react.useState)("home");
	const [kind, setKind] = (0, import_react.useState)("alle");
	const [goal, setGoal] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)(1);
	const [owned, setOwned] = (0, import_react.useState)([]);
	const [guide, setGuide] = (0, import_react.useState)(null);
	const [built, setBuilt] = (0, import_react.useState)(false);
	const [faultId, setFaultId] = (0, import_react.useState)(null);
	const [trials, setTrials] = (0, import_react.useState)([]);
	const [gearNote, setGearNote] = (0, import_react.useState)("");
	const [stepNote, setStepNote] = (0, import_react.useState)("");
	const [what, setWhat] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setOwned(loadOwned());
		setTrials(loadTrials());
	}, []);
	function openGuide(next) {
		setGuide(next);
		setView("guide");
		setSaved("");
		setStepNote(next.steps[0]?.title ?? "");
	}
	function toggle(id) {
		setOwned((current) => {
			const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
			saveOwned(next);
			return next;
		});
	}
	function back() {
		setBuilt(false);
		setFaultId(null);
		setView("home");
	}
	if (view === "guide" && guide) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
			onClick: back,
			label: "Tilbake"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl",
			children: guide.title
		}),
		guide.id === "peavey-karaoke" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { children: "iPaden viser teksten. Mikseren blander gitar, mikrofon og videoen. De to Peavey-høyttalerne spiller det." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Path, { items: PATH })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: guide.result
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "step-list mt-4 divide-y divide-line border-y border-line",
			children: guide.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: step.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs font-medium tracking-widest text-muted uppercase",
						children: "Derfor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: step.text
					})
				]
			}, step.title))
		}),
		go ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			onClick: () => go("opptak"),
			children: "Lyden virker. Ta opp"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			variant: "quiet",
			onClick: () => setView("prove"),
			children: "Jeg prøvde dette med mitt utstyr"
		})
	] });
	if (view === "prove" && guide) {
		const mine = trials.filter((trial) => trial.guideId === guide.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
				onClick: () => setView("guide"),
				label: "Tilbake til oppskriften"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Prøv med ditt utstyr"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Skriv hva du faktisk hadde, og hvor det stoppet. Notatet blir liggende på denne telefonen."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-sm",
				children: ["Utstyret jeg brukte", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: gearNote,
					onChange: (event) => setGearNote(event.target.value),
					className: "mt-1 w-full min-h-11 rounded-md border border-line bg-surface px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["Steget som stoppet", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: stepNote,
					onChange: (event) => setStepNote(event.target.value),
					className: "mt-1 w-full min-h-11 rounded-md border border-line bg-surface px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Ingen. Det virket.",
						children: "Ingen. Det virket."
					}), guide.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: step.title }, step.title))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["Hva som skjedde", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: what,
					onChange: (event) => setWhat(event.target.value),
					rows: 4,
					className: "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				disabled: !gearNote.trim(),
				onClick: () => {
					const next = saveTrial({
						id: crypto.randomUUID(),
						guideId: guide.id,
						gear: gearNote.trim(),
						step: stepNote || "Ingen. Det virket.",
						note: what.trim(),
						at: Date.now()
					});
					setTrials(next);
					setSaved("Notatet er lagret på denne telefonen.");
					setWhat("");
				},
				children: "Lagre notatet"
			}),
			saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: saved
			}) : null,
			mine.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-y border-line",
				children: mine.map((trial) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: trial.gear
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: trial.step
						}),
						trial.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: trial.note
						}) : null
					]
				}, trial.id))
			}) : null
		] });
	}
	if (view === "katalog") {
		const list = PIECES.filter((piece) => kind === "alle" || piece.kind === kind);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
				onClick: back,
				label: "Tilbake"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Utstyr"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Dette er typer, ikke en butikk. Samme type kobles på samme måte."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					onClick: () => setKind("alle"),
					on: kind === "alle",
					label: "Alle"
				}), ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					onClick: () => setKind(id),
					on: kind === id,
					label: KIND_LABEL[id]
				}, id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line border-y border-line",
				children: list.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-muted uppercase",
							children: KIND_LABEL[piece.kind]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: piece.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: piece.into
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: piece.note
						})
					]
				}, piece.id))
			})
		] });
	}
	if (view === "guider") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
			onClick: back,
			label: "Tilbake"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl",
			children: "Oppsett"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Ett oppsett om gangen. Følg stegene i rekkefølge."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y divide-line border-y border-line",
			children: [...GUIDES].sort((a, b) => Number(b.id === "peavey-karaoke") - Number(a.id === "peavey-karaoke")).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => openGuide(item),
				className: "w-full py-4 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-muted",
					children: item.result
				})]
			}) }, item.id))
		})
	] });
	if (view === "feil") {
		const fault = FAULTS.find((item) => item.id === faultId) ?? null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
			onClick: () => fault ? setFaultId(null) : back(),
			label: "Tilbake"
		}), fault ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: fault.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: fault.signs
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "step-list mt-4 divide-y divide-line border-y border-line",
				children: fault.checks.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: check
					})
				}, check))
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Noe virker ikke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Velg det som ligner. Sjekk ett punkt, så det neste."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-y border-line",
				children: FAULTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFaultId(item.id),
					className: "w-full py-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: item.signs
					})]
				}) }, item.id))
			})
		] })] });
	}
	if (view === "bygger") {
		const found = goal ? matchGuides(goal, owned) : [];
		const near = goal && built && found.length === 0 ? closestGuide(goal, owned) : null;
		const choices = goal ? ASK[goal] : [];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {
				onClick: back,
				label: "Tilbake"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Lag oppsett"
			}),
			q === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-5 font-medium",
					children: "Hva skal dere gjøre?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { children: "Velg én. Du kan gå tilbake og bytte." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: GOALS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": goal === item.id,
						onClick: () => {
							setGoal(item.id);
							setBuilt(false);
							if (item.id === "karaoke") setOwned((current) => {
								const next = [.../* @__PURE__ */ new Set([...current, ...EVENSEN])];
								saveOwned(next);
								return next;
							});
						},
						className: goal === item.id ? "rounded-md border border-lamp bg-surface-2 px-4 py-3 text-left" : "rounded-md border border-line bg-surface px-4 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: item.text
						})]
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					disabled: !goal,
					onClick: () => setQ(2),
					children: "Neste"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: ["Valgt: ", GOALS.find((item) => item.id === goal)?.label]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-1 min-h-11 text-sm text-crystal",
					onClick: () => setQ(1),
					children: "Bytt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 font-medium",
					children: "Hva har dere her?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { children: goal === "karaoke" ? "Evensenmodus bruker disse. De er huket av. Ta bort det som ikke stemmer." : "Trykk på det dere har. Lys kant betyr valgt. Du trenger ikke alt." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: choices.map((id) => {
						const piece = pieceById(id);
						if (!piece) return null;
						const on = owned.includes(id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => toggle(id),
							className: on ? "rounded-md border border-lamp bg-surface-2 px-4 py-3 text-left" : "rounded-md border border-line bg-surface px-4 py-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: piece.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm text-muted",
								children: piece.into
							})]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					onClick: () => setBuilt(true),
					children: "Vis oppskriften"
				})
			] }),
			built && found[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-line bg-raised p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: "Dette passer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: found[0].title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: found[0].result
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						onClick: () => openGuide(found[0]),
						children: "Åpne stegene"
					})
				]
			}) : null,
			built && near && near.missing.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-line bg-raised p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Ingen ferdig oppskrift med akkurat det du huket av."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Nærmest er ",
						near.guide.title,
						". Du mangler ",
						near.missing.map((id) => pieceById(id)?.name ?? id).join(", "),
						"."
					]
				})]
			}) : null
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Fra utstyret du har, til lyd som virker."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: "Bondova. Mennesker og muligheter."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => {
				const next = GUIDES.find((item) => item.id === "peavey-karaoke");
				if (next) openGuide(next);
			},
			className: "mt-4 w-full rounded-md border border-lamp bg-surface-2 p-4 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "Oppsett"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl",
					children: "Evensenmodus"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: "iPad med YouTube-karaoke, gitar og mikrofon inn i Peavey MP 400."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Path, { items: PATH })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					onClick: () => {
						setQ(1);
						setBuilt(false);
						setView("bygger");
					},
					children: "Lag et oppsett"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setView("guider"),
					children: "Ferdige oppsett"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setView("katalog"),
					children: "Utstyrskatalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setView("feil"),
					children: "Noe virker ikke"
				})
			]
		}),
		footer
	] });
}
function Back({ onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "mb-3 inline-flex min-h-11 items-center gap-1 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
			className: "size-4",
			"aria-hidden": true
		}), label]
	});
}
function Filter({ on, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: on ? "min-h-11 shrink-0 rounded-md border border-lamp bg-surface-2 px-3 text-sm" : "min-h-11 shrink-0 rounded-md border border-line bg-surface px-3 text-sm",
		children: label
	});
}
function Info({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 rounded-md border border-line bg-raised px-3 py-3 text-sm text-muted",
		children
	});
}
function Path({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-3 grid gap-2",
		children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-6 shrink-0 place-items-center rounded-full border border-lamp text-xs text-crystal",
				children: index + 1
			}), item]
		}, item))
	});
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
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), back ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BondovaMark, {})]
			})]
		}), children]
	});
}
//#endregion
export { Shell as n, Rig as t };
