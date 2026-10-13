export type GearKind = "mikrofon" | "lydkort" | "mikser" | "kamera" | "adapter" | "hodetelefon" | "vert";

export type Goal = "hore" | "stemme" | "gitar" | "film" | "samtale";

export type Piece = {
  id: string;
  kind: GearKind;
  name: string;
  into: string;
  note: string;
};

export type Step = { title: string; text: string };

export type Guide = {
  id: string;
  title: string;
  goals: Goal[];
  needs: string[];
  result: string;
  steps: Step[];
};

export type Fault = { id: string; title: string; signs: string; checks: string[] };

export type Trial = {
  id: string;
  guideId: string;
  gear: string;
  step: string;
  note: string;
  at: number;
};

export const KIND_LABEL: Record<GearKind, string> = {
  vert: "Hvor lyden skal inn",
  mikrofon: "Mikrofoner",
  lydkort: "Lydkort",
  mikser: "Miksere",
  kamera: "Kameraer",
  adapter: "Adaptere og kabler",
  hodetelefon: "Hodetelefoner",
};

export const GOALS: { id: Goal; label: string; text: string }[] = [
  { id: "hore", label: "Høre meg selv", text: "Uten ekko, uten at høyttaleren blir med." },
  { id: "stemme", label: "Ta opp stemme", text: "Snakke eller synge inn i én mikrofon." },
  { id: "gitar", label: "Stemme og gitar", text: "Begge deler, samtidig." },
  { id: "film", label: "Filme", text: "Bilde og lyd som hører sammen." },
  { id: "samtale", label: "Være i en samtale", text: "Video eller telefon, uten dobbel lyd." },
];

export const PIECES: Piece[] = [
  { id: "telefon", kind: "vert", name: "Telefon", into: "Lyden skal inn i telefonen.", note: "Mikrofonen sitter som regel ved ladeporten." },
  { id: "data", kind: "vert", name: "Datamaskin", into: "Lyden skal inn i en USB-port.", note: "Etter at du har plugget i, må du velge den enheten som inngang." },
  { id: "mic-innebygd", kind: "mikrofon", name: "Mikrofonen i telefonen", into: "Sitter allerede i telefonen.", note: "Pek den mot munnen. En lomme demper den." },
  { id: "mic-usb", kind: "mikrofon", name: "USB-mikrofon", into: "USB rett i datamaskinen, eller i telefonen hvis kontakten passer.", note: "Den trenger ikke et eget lydkort. Den er lydkortet." },
  { id: "mic-xlr", kind: "mikrofon", name: "Mikrofon med XLR", into: "XLR-kabel inn i lydkort eller mikser. Ikke rett i telefonen.", note: "De fleste mikrofoner med tykk kabel er denne typen." },
  { id: "lydkort", kind: "lydkort", name: "USB-lydkort", into: "USB til datamaskin eller telefon. Mikrofon og gitar inn i kortet.", note: "Når kortet er i bruk, skal hodetelefonene sitte i kortet." },
  { id: "mikser-usb", kind: "mikser", name: "Mikser med USB", into: "USB til datamaskinen. Den kan gjøre jobben til et lydkort.", note: "Kanalen og USB-utgangen må være skrudd opp. Ellers er den stille." },
  { id: "mikser", kind: "mikser", name: "Mikser uten USB", into: "Utgangen må videre til et lydkort. En mikser alene når ikke telefonen.", note: "Main out er sterkt. Det skal inn på line, ikke mic, hvis lydkortet har begge." },
  { id: "kamera-tlf", kind: "kamera", name: "Telefonen som kamera", into: "Samme telefon kan ta bilde og lyd.", note: "To telefoner, én til bilde og én til lyd, er også et oppsett." },
  { id: "kamera", kind: "kamera", name: "Eget kamera", into: "Tar bildet. Lyden tas ofte opp ved siden av.", note: "En klapp i starten gjør det lettere å legge lyden på bildet etterpå." },
  { id: "webkamera", kind: "kamera", name: "Webkamera", into: "USB i datamaskinen.", note: "Mikrofonen i kameraet er ofte tynn. En egen mikrofon er tydeligere." },
  { id: "usb-c", kind: "adapter", name: "USB-C-adapter", into: "Mellom en USB-A-plugg og en port som bare er USB-C.", note: "En adapter som bare lader, sender ikke lyd. Den må føre data." },
  { id: "trrs", kind: "adapter", name: "3,5 mm med fire deler", into: "Én plugg til både hodetelefon og mikrofon.", note: "En plugg med tre deler har lyd ut, men ingen mikrofon." },
  { id: "jack", kind: "adapter", name: "6,3 mm til 3,5 mm", into: "Gjør en stor hodetelefonplugg om til en liten.", note: "Den flytter ikke en mikrofon. Den endrer bare størrelsen." },
  { id: "xlr", kind: "adapter", name: "XLR-kabel", into: "Fra mikrofon til lydkort eller mikser.", note: "Endene er ulike. De passer bare én vei." },
  { id: "hodetelefon", kind: "hodetelefon", name: "Kablede hodetelefoner", into: "I telefonen, eller i lydkortet hvis lydkortet er i bruk.", note: "En lukket kopp lekker mindre inn i mikrofonen." },
  { id: "headset", kind: "hodetelefon", name: "Headset med mikrofon og kabel", into: "I telefonens 3,5 mm, eller i USB hvis headsettet er USB.", note: "Mikrofonen på ledningen skal peke mot munnen." },
  { id: "bluetooth", kind: "hodetelefon", name: "Bluetooth-hodetelefoner", into: "Trådløst. Bruk dem til å høre, ikke til å ta opp.", note: "Lyden kommer sent. Opptak med dem blir ofte tynt." },
];

export const GUIDES: Guide[] = [
  {
    id: "telefon-headset",
    title: "Telefon og headset",
    goals: ["hore", "stemme", "samtale"],
    needs: ["telefon", "headset"],
    result: "Du hører deg selv i headsettet. Telefonen tar opp.",
    steps: [
      { title: "Kabelen i telefonen først", text: "Sett i headsettet før du åpner noe annet. Skru av Bluetooth." },
      { title: "Mikrofonen mot munnen", text: "Pinnen på ledningen skal peke mot munnen, ikke ligge på brystet." },
      { title: "Si ja til mikrofon", text: "Når telefonen spør, velg Tillat. Uten ja kommer det ingen lyd." },
      { title: "Snakk i vanlig styrke", text: "Lyden skal være tydelig. Er den svak, flytt mikrofonen nærmere munnen." },
    ],
  },
  {
    id: "usb-mic",
    title: "USB-mikrofon til datamaskin",
    goals: ["hore", "stemme", "samtale"],
    needs: ["data", "mic-usb"],
    result: "Datamaskinen bruker USB-mikrofonen, ikke den innebygde.",
    steps: [
      { title: "Mikrofonen rett i USB", text: "Bruk en USB-C-adapter bare hvis kontaktene ikke passer. Adapteren må føre data." },
      { title: "Hodetelefonene i mikrofonen", text: "Hvis den har et hull til hodetelefon, bruk det. Da hører du lyden du tar opp." },
      { title: "Velg den som inngang", text: "Innstillinger, lyd, inngang: USB-mikrofonen. Ikke den innebygde." },
      { title: "Én app om gangen", text: "Lukk andre programmer som bruker mikrofonen. To programmer gir stillhet eller ekko." },
    ],
  },
  {
    id: "xlr",
    title: "XLR-mikrofon og lydkort",
    goals: ["hore", "stemme"],
    needs: ["mic-xlr", "lydkort", "xlr"],
    result: "Mikrofonen går gjennom lydkortet. Hodetelefonene sitter i lydkortet.",
    steps: [
      { title: "XLR i mikrofonen", text: "Trykk den i til den sitter." },
      { title: "Andre enden i mic-inngangen", text: "Inngang merket mic eller 1. Ikke inngangen merket instrument." },
      { title: "48 V bare hvis mikrofonen krever det", text: "Dynamiske mikrofoner skal vanligvis ikke ha 48 V. Kondensatormikrofoner skal. Står det ikke på mikrofonen, la den stå av." },
      { title: "Lydkortet i USB", text: "Til datamaskin eller telefon. Hodetelefonene i lydkortet, ikke i telefonen." },
      { title: "Skru gain mens du snakker", text: "Stemmen skal være tydelig. Et rødt lys som står på, betyr at det er for sterkt." },
    ],
  },
  {
    id: "gitar",
    title: "Gitar inn i lydkort",
    goals: ["gitar"],
    needs: ["lydkort", "hodetelefon"],
    result: "Gitaren går i instrument-inngangen. Ikke rett i telefonen.",
    steps: [
      { title: "Vanlig instrumentkabel", text: "6,3 mm, fra gitaren." },
      { title: "Inn i instrument eller hi-z", text: "Mic-inngangen er feil hull for en gitar alene." },
      { title: "Lydkortet i USB", text: "Datamaskin, eller telefon hvis kontakten og telefonen støtter det." },
      { title: "Hodetelefon i lydkortet", text: "Ellers hører du gitaren sent, eller ikke i det hele tatt." },
    ],
  },
  {
    id: "stemme-gitar",
    title: "Stemme og gitar i samme kort",
    goals: ["gitar", "stemme"],
    needs: ["mic-xlr", "lydkort", "xlr", "hodetelefon"],
    result: "Mikrofon i mic. Gitar i instrument. Ett lydkort til datamaskinen.",
    steps: [
      { title: "Mikrofonen i mic", text: "XLR-kabel. 48 V bare hvis mikrofonen krever det." },
      { title: "Gitaren i instrument", text: "Eget hull. Ikke samme hull som mikrofonen." },
      { title: "To knotter", text: "Skru mic-gain og instrument-gain hver for seg, til begge er tydelige." },
      { title: "Hodetelefon i lydkortet", text: "Én utgang. Da hører du begge." },
      { title: "USB til datamaskin eller telefon", text: "Velg lydkortet som inngang. Ikke den innebygde mikrofonen." },
    ],
  },
  {
    id: "mikser-usb",
    title: "Mikser med USB",
    goals: ["hore", "stemme", "gitar"],
    needs: ["mikser-usb", "data"],
    result: "Mikseren er lydkortet. Datamaskinen ser den som én inngang.",
    steps: [
      { title: "USB mellom mikser og datamaskin", text: "Rett kabel. Adapter bare hvis kontaktene krever det, og den må føre data." },
      { title: "Kanalen opp", text: "Gain og skyveknapp på den kanalen du bruker, over null." },
      { title: "USB-veien på", text: "Hvis mikseren har en knapp merket USB, skal kanalen gå til USB. Uten den er datamaskinen stille." },
      { title: "Hodetelefon i mikseren", text: "Ikke i datamaskinen." },
      { title: "Velg mikseren som inngang", text: "I lydinnstillingene på datamaskinen." },
    ],
  },
  {
    id: "mikser-line",
    title: "Mikser uten USB",
    goals: ["stemme", "gitar"],
    needs: ["mikser", "lydkort"],
    result: "Mikserens utgang går inn i lydkortet. Lydkortet går i datamaskinen.",
    steps: [
      { title: "Mikrofon eller gitar inn i mikseren", text: "Riktig kanal. Gain opp, skyveknapp opp." },
      { title: "Main out til lydkortets line-inngang", text: "Main out er sterkt. Line, ikke mic, hvis kortet har begge." },
      { title: "Lydkortet i USB", text: "Til datamaskinen. Hodetelefonene i lydkortet eller mikseren, ett sted." },
      { title: "Velg lydkortet", text: "Datamaskinen skal ikke lytte til sin egen mikrofon." },
    ],
  },
  {
    id: "film-telefon",
    title: "Film med telefonen",
    goals: ["film"],
    needs: ["telefon", "kamera-tlf"],
    result: "Samme telefon tar bilde og lyd.",
    steps: [
      { title: "Headset med kabel", text: "Så høyttaleren ikke blir med på opptaket. Bluetooth av." },
      { title: "Mikrofonen fri", text: "Ikke dekk ladeporten med hånden. Det er der lyden kommer inn, hvis du bruker telefonens mikrofon." },
      { title: "Én telefon", text: "Bilde og lyd i samme telefon treffer hverandre. To telefoner må legges sammen etterpå." },
      { title: "Start begge når du er klar", text: "Si eller klapp én gang først, så du ser hvor lyden starter." },
    ],
  },
  {
    id: "film-kamera",
    title: "Kamera til bildet, lyd ved siden av",
    goals: ["film"],
    needs: ["kamera", "lydkort"],
    result: "Kameraet tar bildet. Lydkortet tar lyden. Du legger dem sammen etterpå.",
    steps: [
      { title: "Ikke vent at kameraet hører lydkortet", text: "De er to bokser. Lyden ligger på datamaskinen. Bildet ligger i kameraet." },
      { title: "Klapp én gang", text: "Begge må gå. Klappen er merket du bruker for å legge dem på samme sted." },
      { title: "Hodetelefon i lydkortet", text: "Så du hører at lyden faktisk blir tatt opp." },
      { title: "Mikrofonen mot munnen", text: "Samme avstand hele tiden. Kameraet kan stå lenger unna." },
    ],
  },
  {
    id: "samtale-headset",
    title: "Videosamtale med headset",
    goals: ["samtale", "hore"],
    needs: ["headset"],
    result: "Ett headset. Ikke høyttaler og mikrofon samtidig.",
    steps: [
      { title: "Kabel, ikke Bluetooth", text: "Bluetooth kommer sent og gjør at dere snakker i munnen på hverandre." },
      { title: "Velg headsettet i samtalen", text: "Både mikrofon og høyttaler. Ikke mikrofonen i telefonen og lyden i headsettet, med mindre det er meningen." },
      { title: "Skru av den andre mikrofonen", text: "To mikrofoner på en gang gir ekko hos den andre." },
      { title: "Hodetelefon på", text: "Høyttaler gjør at mikrofonen tar opp den andre personen også." },
    ],
  },
];

export const FAULTS: Fault[] = [
  {
    id: "stille",
    title: "Ingen lyd",
    signs: "Ingenting rører seg når du snakker.",
    checks: [
      "Er kabelen i helt, i begge ender?",
      "Sa du ja da maskinen spurte om mikrofon?",
      "Er riktig enhet valgt, ikke den innebygde?",
      "Står gain eller skyveknappen over null?",
      "Sitter hodetelefonene i samme boks som mikrofonen?",
    ],
  },
  {
    id: "ekko",
    title: "Jeg hører meg dobbelt",
    signs: "Et ekko, eller den andre personen hører et ekko.",
    checks: [
      "Skru av høyttaleren. Bruk hodetelefon.",
      "La bare én mikrofon være på.",
      "Lukk andre programmer som også bruker mikrofonen.",
      "Skru av Bluetooth hvis du bruker kabel.",
    ],
  },
  {
    id: "svak",
    title: "Lyden er for svak",
    signs: "Du hører det, men det er tynt.",
    checks: [
      "Flytt mikrofonen nærmere munnen. En neve unna er et vanlig sted.",
      "Skru gain opp til det er tydelig, men ikke rødt hele tiden.",
      "Sjekk at du ikke har dempet kanalen.",
      "En mikrofon bak gitaren hører gitaren mer enn stemmen. Flytt den.",
    ],
  },
  {
    id: "sterk",
    title: "Det spraker",
    signs: "Rødt lys, eller lyden brekker.",
    checks: [
      "Skru gain ned.",
      "Flytt mikrofonen litt lenger fra munnen.",
      "48 V skal være av på en dynamisk mikrofon.",
      "Ikke kjør main out fra en mikser inn i en mic-inngang.",
    ],
  },
  {
    id: "ser-ikke",
    title: "Telefonen ser ikke mikrofonen",
    signs: "USB-mikrofonen eller lydkortet vises ikke.",
    checks: [
      "Prøv kabelen rett i, uten adapter.",
      "Hvis du må bruke adapter: den må føre data, ikke bare lading.",
      "Noen telefoner tar ikke imot USB-lyd. Da er det telefonen, ikke mikrofonen.",
      "Trekk ut, tell til tre, sett i igjen, og se på listen én gang til.",
    ],
  },
  {
    id: "brumm",
    title: "Det brummer",
    signs: "En jevn summ under stemmen eller gitaren.",
    checks: [
      "Prøv en annen kabel.",
      "Flytt lydkortet bort fra laderen og skjermen.",
      "XLR skal klikke helt i.",
      "Hvis brummen forsvinner når du tar i en metalldel, er det jord. Prøv et annet strømuttak.",
    ],
  },
  {
    id: "kamera",
    title: "Kameraet har ikke lyden",
    signs: "Bildet er der. Lyden mangler, eller er tynn.",
    checks: [
      "Kameraets egen mikrofon hører rommet, ikke stemmen tett på.",
      "Et lydkort sender ikke lyd til kameraet av seg selv.",
      "Ta lyden på lydkortet og bildet på kameraet. Klapp én gang så de kan legges sammen.",
    ],
  },
  {
    id: "hull",
    title: "Hodetelefonene sitter i feil hull",
    signs: "Du hører ingenting, eller du hører den innebygde lyden.",
    checks: [
      "Lydkort eller mikser i bruk: hodetelefonene i den boksen.",
      "Bare telefon: hodetelefonene i telefonen.",
      "Et hull merket output eller phones er riktig. Mic er inngang, ikke ørene.",
    ],
  },
  {
    id: "bluetooth",
    title: "Bluetooth kommer for sent",
    signs: "Du hører deg selv etter at du har sunget, eller samtalen hakker.",
    checks: [
      "Bruk kabel når du tar opp eller snakker sammen.",
      "Bluetooth er til å høre ferdig lyd, ikke til å spille inn.",
      "Skru Bluetooth av, så telefonen ikke hopper tilbake til det.",
    ],
  },
];

const OWN_KEY = "thorsound-rig-own";
const TRIAL_KEY = "thorsound-rig-tests";

export function pieceById(id: string) {
  return PIECES.find((piece) => piece.id === id);
}

export function guideById(id: string) {
  return GUIDES.find((guide) => guide.id === id);
}

export function matchGuides(goal: Goal, owned: string[]) {
  return GUIDES.filter((guide) => guide.goals.includes(goal) && guide.needs.every((id) => owned.includes(id))).sort(
    (a, b) => b.needs.length - a.needs.length,
  );
}

export function closestGuide(goal: Goal, owned: string[]) {
  const ranked = GUIDES.filter((guide) => guide.goals.includes(goal))
    .map((guide) => ({ guide, missing: guide.needs.filter((id) => !owned.includes(id)) }))
    .sort((a, b) => a.missing.length - b.missing.length || b.guide.needs.length - a.guide.needs.length);
  return ranked[0] ?? null;
}

export function loadOwned(): string[] {
  try {
    const raw = localStorage.getItem(OWN_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => PIECES.some((piece) => piece.id === id)) : [];
  } catch {
    return [];
  }
}

export function saveOwned(ids: string[]) {
  localStorage.setItem(OWN_KEY, JSON.stringify(ids));
}

export function loadTrials(): Trial[] {
  try {
    const raw = localStorage.getItem(TRIAL_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Trial[]) : [];
  } catch {
    return [];
  }
}

export function saveTrial(trial: Trial) {
  const next = [trial, ...loadTrials()].slice(0, 40);
  localStorage.setItem(TRIAL_KEY, JSON.stringify(next));
  return next;
}
