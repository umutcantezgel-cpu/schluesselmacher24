import type {
  ElektronikUebernahme,
  FahrzeugReihe,
  FahrzeugTeil,
  GehaeuseBauform,
  KeyKind,
  StandardArticle,
  Teileart,
  UmbauBeispiel,
  UmbauEinsatz,
  UmbauTeil,
} from '@/lib/types';

/* ==========================================================================
   Gehäuse, Ersatzteile und Umbau-Beispiele (FA-SHOP-02): reine Funktionen
   ohne Server-Abhängigkeiten. Backend (Auswahllisten, Prüfungen), Datenschicht
   und Seiten (FA-SHOP-02B: Listen mit Filter, „Mein Fahrzeug“) nutzen sie.

   Grundsatz der Filter: keine falschen Versprechen. Ein Teil passt zu einem
   Merkmal nur, wenn es dieses Merkmal ausdrücklich trägt. Drei Ausnahmen beim
   Fahrzeug, weil ein leeres Feld dort eine breite Passung zusagt:
   - ohne Marke passt ein Teil zu jeder Marke (solange `allgemeineTeile` nicht
     abgeschaltet ist); bei Teilen mit Passform (`TEILEARTEN_MIT_MARKE`) ist
     die Marke Pflicht, ohne Marke passen sie zu keinem Fahrzeug,
   - ohne Reihen passt es zu allen Reihen der Marke,
   - ohne Baujahre passt es zu jedem Baujahr.
   ========================================================================== */

/* ---------- Auswahlwerte ------------------------------------------------- */

export const TEILEARTEN: readonly Teileart[] = [
  'gehaeuse',
  'tasten',
  'gummimatte',
  'batterie',
  'klappmechanismus',
  'schluesselbart',
  'weitere',
];

export const TEILEART_LABEL: Record<Teileart, string> = {
  gehaeuse: 'Gehäuse',
  tasten: 'Tasten',
  gummimatte: 'Gummimatte',
  batterie: 'Batterie',
  klappmechanismus: 'Klappmechanismus',
  schluesselbart: 'Schlüsselbart',
  weitere: 'Weiteres Ersatzteil',
};

/** Bei diesen Teilen ist die Tastenzahl Pflicht; sie bestimmt die Passform. */
export const TEILEARTEN_MIT_TASTEN: readonly Teileart[] = ['gehaeuse', 'tasten', 'gummimatte'];

/**
 * Bei diesen Teilen ist die Fahrzeugmarke Pflicht: Ein Gehäuse, Tasten oder eine
 * Gummimatte passen nie zu allen Marken.
 */
export const TEILEARTEN_MIT_MARKE: readonly Teileart[] = ['gehaeuse', 'tasten', 'gummimatte'];

/** Bei diesen Teilen ist mindestens eine Bauform Pflicht. */
export const TEILEARTEN_MIT_BAUFORM: readonly Teileart[] = ['gehaeuse'];

export const ELEKTRONIK_UEBERNAHMEN: readonly ElektronikUebernahme[] = ['ja', 'nein', 'pruefung'];

/** Kurzer Text für Backend und Auswahl. */
export const ELEKTRONIK_LABEL: Record<ElektronikUebernahme, string> = {
  ja: 'Ja',
  nein: 'Nein',
  pruefung: 'Nur nach Prüfung',
};

/**
 * Ganzer Satz für die Seite des Teils. Die Sätze beschreiben das Teil, nicht einen
 * Umbau durch uns: Der Shopartikel ist nur das Teil. Für „pruefung“ verweist die
 * Seite zusätzlich auf die Anfrage, weil der Kassenweg keinen Prüfschritt hat.
 */
export const ELEKTRONIK_SATZ: Record<ElektronikUebernahme, string> = {
  ja: 'Elektronik und Transponder Ihres Schlüssels lassen sich mit diesem Teil weiter verwenden.',
  nein: 'Elektronik und Transponder Ihres Schlüssels lassen sich mit diesem Teil nicht weiter verwenden.',
  pruefung: 'Ob sich Elektronik und Transponder Ihres Schlüssels weiter verwenden lassen, klären wir vor dem Kauf. Schreiben Sie uns dazu.',
};

/** Schlüsseltypen wie im Fahrzeugbestand (`KeyKind`). */
export const SCHLUESSELTYPEN: readonly KeyKind[] = ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'];

export const SCHLUESSELTYP_LABEL: Record<KeyKind, string> = {
  mechanisch: 'Mechanisch',
  funk: 'Funk',
  klappschluessel: 'Klappschlüssel',
  'smart-key': 'Smart Key',
  keyless: 'Keyless',
};

export const UMBAU_TEILE: readonly UmbauTeil[] = ['elektronik', 'transponder', 'tasten', 'schluesselbart', 'weitere'];

export const UMBAU_TEIL_LABEL: Record<UmbauTeil, string> = {
  elektronik: 'Elektronik',
  transponder: 'Transponder',
  tasten: 'Tasten',
  schluesselbart: 'Schlüsselbart',
  weitere: 'Weitere Teile',
};

export const UMBAU_EINSAETZE: readonly UmbauEinsatz[] = ['customizing', 'gehaeuse', 'reparatur'];

export const UMBAU_EINSATZ_LABEL: Record<UmbauEinsatz, string> = {
  customizing: 'Customizing',
  gehaeuse: 'Gehäuse',
  reparatur: 'Reparatur',
};

/** Grenzen der Eingaben, gleich im Backend und beim Lesen der Adresse. */
export const TASTEN_MAX = 12;
export const BAUJAHR_MIN = 1950;
export const BAUJAHR_MAX = 2100;

/* ---------- Prüfungen (Backend) ----------------------------------------- */

/** Baujahre: beide optional; sind beide gesetzt, darf „bis“ nicht vor „von“ liegen. */
export function baujahrePruefen(von: unknown, bis: unknown): true | string {
  const v = typeof von === 'number' ? von : undefined;
  const b = typeof bis === 'number' ? bis : undefined;
  if (v !== undefined && b !== undefined && b < v) return 'Das Baujahr „bis“ darf nicht vor „von“ liegen.';
  return true;
}

export type TeilFeld = 'teileart' | 'kompatibilitaet' | 'elektronik' | 'tastenzahl' | 'bauformen' | 'marke';

/**
 * Pflichtangaben eines Fahrzeugteils, unabhängig vom Backend prüfbar.
 * Gibt je Feld eine Meldung zurück; leer heißt vollständig.
 */
export function fahrzeugteilLuecken(teil: {
  teileart?: unknown;
  kompatibilitaet?: unknown;
  elektronik?: unknown;
  tastenzahl?: unknown;
  bauformen?: unknown;
  marke?: unknown;
}): Partial<Record<TeilFeld, string>> {
  const luecken: Partial<Record<TeilFeld, string>> = {};
  const art = TEILEARTEN.includes(teil.teileart as Teileart) ? (teil.teileart as Teileart) : undefined;
  if (!art) luecken.teileart = 'Bitte die Art des Teils wählen.';
  if (typeof teil.kompatibilitaet !== 'string' || !teil.kompatibilitaet.trim()) {
    luecken.kompatibilitaet = 'Bitte den Kompatibilitätshinweis eintragen: was übernommen wird und was nicht passt.';
  }
  if (!ELEKTRONIK_UEBERNAHMEN.includes(teil.elektronik as ElektronikUebernahme)) {
    luecken.elektronik = 'Bitte angeben, ob Elektronik und Transponder übernommen werden.';
  }
  if (art && TEILEARTEN_MIT_TASTEN.includes(art) && typeof teil.tastenzahl !== 'number') {
    luecken.tastenzahl = 'Bitte die Tastenzahl eintragen (0 bei Schlüsseln ohne Tasten).';
  }
  const bauformen = Array.isArray(teil.bauformen) ? teil.bauformen.filter(Boolean) : [];
  if (art && TEILEARTEN_MIT_BAUFORM.includes(art) && bauformen.length === 0) {
    luecken.bauformen = 'Bitte mindestens eine Bauform wählen.';
  }
  if (art && TEILEARTEN_MIT_MARKE.includes(art) && (typeof teil.marke !== 'string' || !teil.marke.trim())) {
    luecken.marke = `Bitte die Fahrzeugmarke eintragen. ${art === 'gehaeuse' ? 'Ein Gehäuse' : 'Dieses Teil'} passt nie zu allen Marken.`;
  }
  return luecken;
}

/* ---------- Teile aus den Artikeln --------------------------------------- */

export type Fahrzeugartikel = StandardArticle & { fahrzeugteil: FahrzeugTeil };

export function istFahrzeugteil(artikel: StandardArticle): artikel is Fahrzeugartikel {
  return Boolean(artikel.fahrzeugteil);
}

/** Nur die Artikel mit Fahrzeugbezug, Reihenfolge unverändert. */
export function fahrzeugteile(artikel: StandardArticle[]): Fahrzeugartikel[] {
  return artikel.filter(istFahrzeugteil);
}

/* ---------- Filter ------------------------------------------------------- */

export interface FahrzeugteilFilter {
  /** Marke wie im Fahrzeugkatalog; Groß- und Kleinschreibung zählt nicht. */
  marke?: string;
  /** Kennung der Reihe aus dem Fahrzeugkatalog; nur zusammen mit `marke` sinnvoll. */
  reihe?: string;
  baujahr?: number;
  /** Kennung der Bauform. */
  bauform?: string;
  tastenzahl?: number;
  teileart?: Teileart;
  schluesselart?: KeyKind;
}

export interface FilterOptionen {
  /** Teile ohne Marke (markenübergreifend) passen zu jeder Marke. Standard: ja. */
  allgemeineTeile?: boolean;
}

const gleich = (a: string, b: string) => a.localeCompare(b, 'de', { sensitivity: 'base' }) === 0;

/**
 * Wie genau ein Teil zum Fahrzeug passt:
 * - `reihe`: die Reihe ist ausdrücklich genannt,
 * - `marke`: die Marke stimmt, Reihen sind nicht eingeschränkt,
 * - `allgemein`: markenübergreifendes Teil,
 * - `keine`: passt nicht.
 * Ohne Marke im Filter ist jedes Teil `allgemein`. Ein Teil mit Passform ohne
 * Marke (unvollständig gepflegt) passt zu keiner Marke.
 */
export type Passung = 'reihe' | 'marke' | 'allgemein' | 'keine';

export function fahrzeugPassung(teil: FahrzeugTeil, filter: Pick<FahrzeugteilFilter, 'marke' | 'reihe' | 'baujahr'>): Passung {
  if (typeof filter.baujahr === 'number') {
    if (typeof teil.baujahrVon === 'number' && filter.baujahr < teil.baujahrVon) return 'keine';
    if (typeof teil.baujahrBis === 'number' && filter.baujahr > teil.baujahrBis) return 'keine';
  }
  if (!filter.marke) {
    // Reihe ohne Marke: nur, wo die Reihe ausdrücklich steht.
    if (filter.reihe) return teil.reihen.includes(filter.reihe) ? 'reihe' : 'keine';
    return 'allgemein';
  }
  if (!teil.marke) return TEILEARTEN_MIT_MARKE.includes(teil.teileart) ? 'keine' : 'allgemein';
  if (!gleich(teil.marke, filter.marke)) return 'keine';
  if (!filter.reihe) return teil.reihen.length ? 'reihe' : 'marke';
  if (teil.reihen.length === 0) return 'marke';
  return teil.reihen.includes(filter.reihe) ? 'reihe' : 'keine';
}

/** Ob ein Teil zu allen gesetzten Merkmalen des Filters passt. */
export function passtZumFilter(teil: FahrzeugTeil, filter: FahrzeugteilFilter, optionen: FilterOptionen = {}): boolean {
  const passung = fahrzeugPassung(teil, filter);
  if (passung === 'keine') return false;
  if (passung === 'allgemein' && filter.marke && optionen.allgemeineTeile === false) return false;
  if (filter.teileart && teil.teileart !== filter.teileart) return false;
  if (filter.bauform && !teil.bauformen.includes(filter.bauform)) return false;
  if (typeof filter.tastenzahl === 'number' && teil.tastenzahl !== filter.tastenzahl) return false;
  if (filter.schluesselart && !teil.schluesselarten.includes(filter.schluesselart)) return false;
  return true;
}

const PASSUNG_RANG: Record<Passung, number> = { reihe: 0, marke: 1, allgemein: 2, keine: 3 };

/**
 * Teile zum Filter. Mit Fahrzeug im Filter stehen genau passende Teile vorn
 * (Reihe vor Marke vor markenübergreifend), sonst bleibt die Reihenfolge.
 */
export function fahrzeugteileFiltern<T extends Fahrzeugartikel>(artikel: T[], filter: FahrzeugteilFilter, optionen: FilterOptionen = {}): T[] {
  const treffer = artikel.filter((a) => passtZumFilter(a.fahrzeugteil, filter, optionen));
  if (!filter.marke && !filter.reihe) return treffer;
  return treffer
    .map((a, index) => ({ a, index, rang: PASSUNG_RANG[fahrzeugPassung(a.fahrzeugteil, filter)] }))
    .sort((x, y) => x.rang - y.rang || x.index - y.index)
    .map(({ a }) => a);
}

/** Filter „Mein Fahrzeug“ aus einer Reihe des Fahrzeugkatalogs (Fahrzeugsuche). */
export function fahrzeugFilter(reihe: Pick<FahrzeugReihe, 'id' | 'marke'>, baujahr?: number): FahrzeugteilFilter {
  const filter: FahrzeugteilFilter = { marke: reihe.marke, reihe: reihe.id };
  if (typeof baujahr === 'number' && Number.isInteger(baujahr)) filter.baujahr = baujahr;
  return filter;
}

export interface FilterAuswahl {
  /** Marken, die bei mindestens einem Teil gepflegt sind. */
  marken: string[];
  /** Reihen-Kennungen je Marke. */
  reihen: Record<string, string[]>;
  bauformen: string[];
  tastenzahlen: number[];
  teilearten: Teileart[];
  schluesselarten: KeyKind[];
}

/** Nur Werte, die es bei den Teilen gibt: Kein Filter führt in eine leere Liste. */
export function filterAuswahl(artikel: Fahrzeugartikel[]): FilterAuswahl {
  const marken = new Map<string, string>();
  const reihen = new Map<string, Set<string>>();
  const bauformen = new Set<string>();
  const tasten = new Set<number>();
  const arten = new Set<Teileart>();
  const typen = new Set<KeyKind>();
  for (const { fahrzeugteil: t } of artikel) {
    arten.add(t.teileart);
    if (typeof t.tastenzahl === 'number') tasten.add(t.tastenzahl);
    t.bauformen.forEach((b) => bauformen.add(b));
    t.schluesselarten.forEach((s) => typen.add(s));
    if (!t.marke) continue;
    const schluessel = t.marke.toLocaleLowerCase('de');
    if (!marken.has(schluessel)) marken.set(schluessel, t.marke);
    const name = marken.get(schluessel)!;
    const liste = reihen.get(name) ?? new Set<string>();
    t.reihen.forEach((r) => liste.add(r));
    reihen.set(name, liste);
  }
  const markenListe = [...marken.values()].sort((a, b) => a.localeCompare(b, 'de'));
  return {
    marken: markenListe,
    reihen: Object.fromEntries(markenListe.map((m) => [m, [...(reihen.get(m) ?? [])].sort()])),
    bauformen: [...bauformen].sort(),
    tastenzahlen: [...tasten].sort((a, b) => a - b),
    teilearten: TEILEARTEN.filter((a) => arten.has(a)),
    schluesselarten: SCHLUESSELTYPEN.filter((s) => typen.has(s)),
  };
}

/* ---------- Filter in der Adresse ---------------------------------------- */

/** Namen der Suchparameter; Filter funktionieren so auch ohne JavaScript. */
export const FILTER_PARAMETER = {
  marke: 'marke',
  reihe: 'reihe',
  baujahr: 'baujahr',
  bauform: 'bauform',
  tastenzahl: 'tasten',
  teileart: 'teil',
  schluesselart: 'typ',
} as const satisfies Record<keyof FahrzeugteilFilter, string>;

const KENNUNG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MARKE_MAX = 60;

type Suchparameter = URLSearchParams | Record<string, string | string[] | undefined>;

function erster(params: Suchparameter, name: string): string | undefined {
  const wert = params instanceof URLSearchParams ? params.get(name) ?? undefined : params[name];
  const text = Array.isArray(wert) ? wert[0] : wert;
  const sauber = typeof text === 'string' ? text.trim() : '';
  return sauber || undefined;
}

function ganzzahl(wert: string | undefined, min: number, max: number): number | undefined {
  if (!wert || !/^\d{1,4}$/.test(wert)) return undefined;
  const zahl = Number(wert);
  return zahl >= min && zahl <= max ? zahl : undefined;
}

/** Liest einen Filter aus der Adresse. Ungültige Werte entfallen still; eine Reihe gilt nur mit Marke. */
export function filterAusSuchparametern(params: Suchparameter): FahrzeugteilFilter {
  const filter: FahrzeugteilFilter = {};
  const marke = erster(params, FILTER_PARAMETER.marke);
  if (marke && marke.length <= MARKE_MAX) filter.marke = marke;
  const reihe = erster(params, FILTER_PARAMETER.reihe);
  if (filter.marke && reihe && KENNUNG.test(reihe)) filter.reihe = reihe;
  const baujahr = ganzzahl(erster(params, FILTER_PARAMETER.baujahr), BAUJAHR_MIN, BAUJAHR_MAX);
  if (baujahr !== undefined) filter.baujahr = baujahr;
  const bauform = erster(params, FILTER_PARAMETER.bauform);
  if (bauform && KENNUNG.test(bauform)) filter.bauform = bauform;
  const tasten = ganzzahl(erster(params, FILTER_PARAMETER.tastenzahl), 0, TASTEN_MAX);
  if (tasten !== undefined) filter.tastenzahl = tasten;
  const teil = erster(params, FILTER_PARAMETER.teileart);
  if (teil && TEILEARTEN.includes(teil as Teileart)) filter.teileart = teil as Teileart;
  const typ = erster(params, FILTER_PARAMETER.schluesselart);
  if (typ && SCHLUESSELTYPEN.includes(typ as KeyKind)) filter.schluesselart = typ as KeyKind;
  return filter;
}

/** Filter als Suchteil der Adresse in fester Reihenfolge, ohne führendes „?“; leer ohne Filter. */
export function filterZuSuchparametern(filter: FahrzeugteilFilter): string {
  const params = new URLSearchParams();
  for (const feld of Object.keys(FILTER_PARAMETER) as (keyof FahrzeugteilFilter)[]) {
    const wert = filter[feld];
    if (wert === undefined || wert === '') continue;
    params.set(FILTER_PARAMETER[feld], String(wert));
  }
  return params.toString();
}

/** Ob irgendein Merkmal gesetzt ist (eine gefilterte Ansicht ist keine eigene Seite für Suchmaschinen). */
export function filterGesetzt(filter: FahrzeugteilFilter): boolean {
  return Object.values(filter).some((wert) => wert !== undefined && wert !== '');
}

/* ---------- Bauformen ---------------------------------------------------- */

export function bauformenSortiert(bauformen: GehaeuseBauform[]): GehaeuseBauform[] {
  return [...bauformen].sort((a, b) => a.reihenfolge - b.reihenfolge || a.name.localeCompare(b.name, 'de'));
}

/** Namen der Bauformen eines Teils in der Reihenfolge der Liste; unbekannte Kennungen entfallen. */
export function bauformNamen(kennungen: string[], bauformen: GehaeuseBauform[]): string[] {
  return bauformenSortiert(bauformen)
    .filter((b) => kennungen.includes(b.id))
    .map((b) => b.name);
}

/* ---------- Umbau-Beispiele ---------------------------------------------- */

/** Ein Beispiel ist zeigbar, wenn beide Fotos mit Adresse und Beschriftung vorliegen (keine Platzhalter, R4). */
export function umbauBeispielZeigbar(beispiel: Pick<UmbauBeispiel, 'vorher' | 'nachher'>): boolean {
  return [beispiel.vorher, beispiel.nachher].every(
    (bild) => Boolean(bild?.url) && Boolean(bild?.beschriftung?.trim()),
  );
}

/** Zeigbare Beispiele für einen Bereich, nach Reihenfolge. Ohne Beispiele: leere Liste, kein Baustein. */
export function umbauBeispieleFuer(beispiele: UmbauBeispiel[], einsatz: UmbauEinsatz): UmbauBeispiel[] {
  return beispiele
    .filter((b) => b.einsatz.includes(einsatz) && umbauBeispielZeigbar(b))
    .sort((a, b) => a.reihenfolge - b.reihenfolge || a.titel.localeCompare(b.titel, 'de'));
}
