/*
 * Gemeinsame Fahrzeugschlüssel-Anfrage (FA-KERN-02B, A-048): reine Funktionen ohne React. Ein Ablauf für
 * Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad und „Fahrzeug nicht gefunden“; was je Klasse
 * gefragt wird, steht in ANFRAGE_FORMULAR (src/lib/fahrzeuge/anfrage-klassen.ts). Welche Unterlagen Pflicht
 * sind, entscheidet allein die Pflichtregel (src/lib/server/unterlagen-pflicht.ts): Die Seite berechnet die
 * Liste auf dem Server (pflicht.ts) und gibt sie dem Formular mit; der Server prüft beim Absenden noch
 * einmal. Hier steht nur, wie das Formular einen Eintrag der Liste im Browser erkennt.
 */

import {
  ANFRAGE_FORMULAR,
  ANFRAGE_KLASSEN_DATEN,
  ERSATZNACHWEISE,
  FAHRZEUG_ANFRAGE_QUELLE,
  type ErsatznachweisArt,
  type FormularKlasse,
  type RollerNachweis,
} from '@/lib/fahrzeuge/anfrage-klassen';
import { LIEFERLAND } from '@/lib/kasse';
import { beschreibungGueltig, BESCHREIBUNG_MAX, BESCHREIBUNG_MIN, SCHLUESSEL_STECKPLAETZE } from '@/lib/wege/nachweis';
import type { ContactDetails, ImageSlot, SummarySection, UploadRef } from '@/lib/types';
// Nur der Typ: Zur Laufzeit lädt das Formular nichts aus lib/server.
import type { FehlendeUnterlage } from '@/lib/server/unterlagen-pflicht';

export { BESCHREIBUNG_MAX, BESCHREIBUNG_MIN };
export type { FehlendeUnterlage };

export type TransponderAntwort = 'ja' | 'nein' | 'unklar';
export type SchluesselStand = 'vorhanden' | 'keiner';
export type AnfrageSchritt = 'fahrzeug' | 'schluessel' | 'unterlagen' | 'beschreibung' | 'kontakt' | 'absenden';

export const SCHRITT_FOLGE: readonly AnfrageSchritt[] = ['fahrzeug', 'schluessel', 'unterlagen', 'beschreibung', 'kontakt', 'absenden'];

export interface FahrzeugAnfrageDaten {
  hersteller: string;
  modell: string;
  baujahr: string;
  /** Roller: zugelassen (Fahrzeugschein) oder mit Versicherungskennzeichen. */
  roller: RollerNachweis | '';
  /** Fahrrad: Hersteller und Schlüsselnummer des Schlosses. */
  schlossHersteller: string;
  schluesselnummer: string;
  /** Noch ein Schlüssel da (auch defekt) oder ausdrücklich keiner mehr. */
  schluessel: SchluesselStand | '';
  transponder: TransponderAntwort | '';
  /** Art des Ersatznachweises (nur auf dem Ersatzweg). */
  ersatznachweis: ErsatznachweisArt | '';
  /** Fahrzeug-Identifizierungsnummer statt des Typenschild-Fotos. */
  fin: string;
  /** Ausdrücklich bestätigt: Das Fahrzeug hat kein Typenschild. */
  keinTypenschild: boolean;
  beschreibung: string;
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
}

export const INITIAL: FahrzeugAnfrageDaten = {
  hersteller: '',
  modell: '',
  baujahr: '',
  roller: '',
  schlossHersteller: '',
  schluesselnummer: '',
  schluessel: '',
  transponder: '',
  ersatznachweis: '',
  fin: '',
  keinTypenschild: false,
  beschreibung: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
};

/** Grenzen der Schlossangaben wie in der Pflichtregel. */
export const MAX_SCHLOSS_HERSTELLER = 60;
export const MAX_SCHLUESSELNUMMER = 40;
export const BAUJAHR_ERSTES = 1950;

/**
 * Pflichtunterlagen je Fall, wie die Pflichtregel sie auf dem Server ausgibt: je Nachweisweg (beim Roller
 * die Wahl; sonst gilt `zulassung`) und je Schlüsselstand. Die Seite berechnet die Tabelle mit der Regel.
 */
export type PflichtTabelle = Record<RollerNachweis, Record<SchluesselStand, FehlendeUnterlage[]>>;

/** Liste des aktuellen Falls. Ohne Antwort zum Schlüssel gilt „vorhanden“ (die strengere Liste). */
export function pflichtFuer(tabelle: PflichtTabelle, daten: Pick<FahrzeugAnfrageDaten, 'roller' | 'schluessel'>): FehlendeUnterlage[] {
  return tabelle[daten.roller || 'zulassung'][daten.schluessel === 'keiner' ? 'keiner' : 'vorhanden'];
}

/* ---------- Fahrzeug-Identifizierungsnummer -------------------------------- */

/**
 * FIN nach ISO 3779, gleich der Regel auf dem Server (unterlagen-pflicht.ts, FIN_MUSTER): 17 Zeichen ohne
 * I, O und Q. Ein Test sichert, dass beide dieselben Werte annehmen.
 */
const FIN_MUSTER = /^[A-HJ-NPR-Z0-9]{17}$/i;

export function finGueltig(text: string): boolean {
  return FIN_MUSTER.test(text.trim());
}

/* ---------- Ausgewählte Dateien je Steckplatz ------------------------------- */

/** Ausgewählte Datei, wie sie das Upload-Feld meldet (photo-upload.tsx, PickedFile). */
export interface DateiAngabe {
  id: string;
  name: string;
}

export type FotoPlatz = (typeof SCHLUESSEL_STECKPLAETZE)[number];

export interface UnterlagenDateien<D extends DateiAngabe = DateiAngabe> {
  fahrzeugschein: D[];
  ersatznachweis: D[];
  typenschild: D[];
  fotos: Record<FotoPlatz, D[]>;
}

export function leereUnterlagen<D extends DateiAngabe>(): UnterlagenDateien<D> {
  return {
    fahrzeugschein: [],
    ersatznachweis: [],
    typenschild: [],
    fotos: { 'schluessel-vorderseite': [], 'schluessel-rueckseite': [], 'schluessel-spitze': [] },
  };
}

/** Einträge der Liste, die zum Schritt Unterlagen gehören; Beschreibung und Schloss haben eigene Schritte. */
const IM_UNTERLAGENSCHRITT: ReadonlySet<FehlendeUnterlage> = new Set<FehlendeUnterlage>([
  'fahrzeugschein',
  'ersatznachweis',
  'ersatznachweis-art',
  'typenschild',
  'schluessel-vorderseite',
  'schluessel-rueckseite',
  'schluessel-spitze',
]);

/** Ist ein Eintrag der Pflichtliste im Formular erfüllt? Dieselben Bedingungen wie in der Regel. */
export function eintragErfuellt(
  klasse: FormularKlasse,
  eintrag: FehlendeUnterlage,
  daten: FahrzeugAnfrageDaten,
  dateien: UnterlagenDateien,
): boolean {
  switch (eintrag) {
    case 'fahrzeugschein':
      return dateien.fahrzeugschein.length > 0;
    case 'ersatznachweis':
      return dateien.ersatznachweis.length > 0;
    case 'ersatznachweis-art':
      return daten.ersatznachweis !== '' && ANFRAGE_KLASSEN_DATEN[klasse].ersatznachweise.includes(daten.ersatznachweis);
    case 'typenschild':
      return finGueltig(daten.fin) || daten.keinTypenschild || dateien.typenschild.length > 0;
    case 'schloss-angaben':
      return schlossAngabenGueltig(daten);
    case 'schluessel-vorderseite':
    case 'schluessel-rueckseite':
    case 'schluessel-spitze':
      return dateien.fotos[eintrag].length > 0;
    case 'beschreibung':
      return beschreibungGueltig(daten.beschreibung);
  }
}

/** Was im Schritt Unterlagen noch fehlt, in der Reihenfolge der Regel. */
export function fehltImUnterlagenschritt(
  klasse: FormularKlasse,
  pflicht: readonly FehlendeUnterlage[],
  daten: FahrzeugAnfrageDaten,
  dateien: UnterlagenDateien,
): FehlendeUnterlage[] {
  return pflicht.filter((eintrag) => IM_UNTERLAGENSCHRITT.has(eintrag) && !eintragErfuellt(klasse, eintrag, daten, dateien));
}

/** Kurze, verständliche Namen für die Meldung „Es fehlt noch …“ im Formular. */
export const FEHLT_IM_FORMULAR: Record<FehlendeUnterlage, string> = {
  fahrzeugschein: 'der Fahrzeugschein',
  ersatznachweis: 'ein Foto oder PDF Ihres Nachweises',
  'ersatznachweis-art': 'die Angabe, welchen Nachweis Sie haben',
  typenschild: 'ein Foto des Typenschilds, die Fahrzeug-Identifizierungsnummer oder Ihre Bestätigung, dass es keines gibt',
  'schloss-angaben': 'Hersteller und Schlüsselnummer des Schlosses',
  'schluessel-vorderseite': 'das Foto der Vorderseite Ihres Schlüssels',
  'schluessel-rueckseite': 'das Foto der Rückseite Ihres Schlüssels',
  'schluessel-spitze': 'das Foto der Spitze beziehungsweise des Profils von vorne',
  beschreibung: `eine kurze Beschreibung (mindestens ${BESCHREIBUNG_MIN} Zeichen)`,
};

/** Ein Satz, der sagt, was fehlt. */
export function fehltSatz(fehlt: readonly FehlendeUnterlage[]): string {
  const teile = fehlt.map((eintrag) => FEHLT_IM_FORMULAR[eintrag]);
  if (teile.length === 0) return '';
  const liste = teile.length === 1 ? teile[0] : `${teile.slice(0, -1).join(', ')} und ${teile.at(-1)}`;
  return `Es fehlt noch ${liste}.`;
}

/* ---------- Schritte ----------------------------------------------------- */

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Genau vier Ziffern, zwischen 1950 und dem Jahr nach dem laufenden Jahr. */
export function baujahrGueltig(text: string, jahr: number = new Date().getFullYear()): boolean {
  const zahl = text.trim();
  if (!/^\d{4}$/.test(zahl)) return false;
  const wert = Number(zahl);
  return wert >= BAUJAHR_ERSTES && wert <= jahr + 1;
}

function feldGueltig(wert: string, feld: { pflicht: boolean; max: number } | null): boolean {
  if (!feld) return true;
  const laenge = wert.trim().length;
  return laenge <= feld.max && (!feld.pflicht || laenge >= 1);
}

export function schlossAngabenGueltig(daten: Pick<FahrzeugAnfrageDaten, 'schlossHersteller' | 'schluesselnummer'>): boolean {
  const hersteller = daten.schlossHersteller.trim().length;
  const nummer = daten.schluesselnummer.trim().length;
  return hersteller >= 1 && hersteller <= MAX_SCHLOSS_HERSTELLER && nummer >= 1 && nummer <= MAX_SCHLUESSELNUMMER;
}

/**
 * Prüft die Angaben eines Schritts. Die Unterlagen prüft `fehltImUnterlagenschritt` mit der Pflichtliste;
 * hier steht dafür nur, was ohne Dateien zu sagen ist.
 */
export function schrittGueltig(
  klasse: FormularKlasse,
  daten: FahrzeugAnfrageDaten,
  schritt: AnfrageSchritt,
  jahr: number = new Date().getFullYear(),
): boolean {
  const formular = ANFRAGE_FORMULAR[klasse];
  switch (schritt) {
    case 'fahrzeug':
      return (
        feldGueltig(daten.hersteller, formular.hersteller)
        && feldGueltig(daten.modell, formular.modell)
        && (formular.baujahr !== 'pflicht' || baujahrGueltig(daten.baujahr, jahr))
        && (formular.baujahr !== 'freiwillig' || daten.baujahr.trim() === '' || baujahrGueltig(daten.baujahr, jahr))
        && (klasse !== 'roller' || daten.roller !== '')
        && (!ANFRAGE_KLASSEN_DATEN[klasse].schloss || schlossAngabenGueltig(daten))
      );
    case 'schluessel':
      return daten.schluessel !== '' && (!formular.chip || daten.transponder !== '');
    case 'beschreibung':
      return beschreibungGueltig(daten.beschreibung);
    case 'kontakt':
      return (
        daten.vorname.trim().length > 1
        && daten.nachname.trim().length > 1
        && EMAIL_MUSTER.test(daten.email.trim())
        && daten.telefon.replace(/\D/g, '').length >= 6
        && (!daten.plz.trim() || /^\d{5}$/.test(daten.plz.trim()))
      );
    default:
      return true;
  }
}

/** Der erste Schritt, der noch nicht erfüllt ist; `null`, wenn alle Angaben stehen (Prüfung beim Absenden). */
export function ersterOffenerSchritt(
  klasse: FormularKlasse,
  pflicht: readonly FehlendeUnterlage[],
  daten: FahrzeugAnfrageDaten,
  dateien: UnterlagenDateien,
  jahr?: number,
): AnfrageSchritt | null {
  for (const schritt of SCHRITT_FOLGE) {
    if (!schrittGueltig(klasse, daten, schritt, jahr)) return schritt;
    if (schritt === 'unterlagen' && fehltImUnterlagenschritt(klasse, pflicht, daten, dateien).length > 0) return schritt;
  }
  return null;
}

/* ---------- Texte und Beispielbilder -------------------------------------- */

export const TRANSPONDER_OPTIONEN: ReadonlyArray<{ wert: TransponderAntwort; titel: string; satz: string }> = [
  { wert: 'ja', titel: 'Ja, mit Chip', satz: 'Der Schlüssel hat einen Chip, der in der Wegfahrsperre erkannt wird.' },
  { wert: 'nein', titel: 'Nein, ohne Chip', satz: 'Der Schlüssel hat keinen Chip.' },
  { wert: 'unklar', titel: 'Weiß ich nicht', satz: 'Wir klären es anhand Ihrer Fotos.' },
];

export const TRANSPONDER_TEXT: Record<TransponderAntwort, string> = {
  ja: 'mit Chip',
  nein: 'ohne Chip',
  unklar: 'unklar, bitte prüfen',
};

export const SCHLUESSEL_OPTIONEN: ReadonlyArray<{ wert: SchluesselStand; titel: string; satz: string }> = [
  { wert: 'vorhanden', titel: 'Ich habe noch einen Schlüssel', satz: 'Auch ein defekter oder abgebrochener Schlüssel zählt. Sie fotografieren ihn gleich von drei Seiten.' },
  { wert: 'keiner', titel: 'Ich habe keinen Schlüssel mehr', satz: 'Dann entfallen die Fotos des Schlüssels. Die übrigen Unterlagen bleiben nötig.' },
];

export const ROLLER_OPTIONEN: ReadonlyArray<{ wert: RollerNachweis; titel: string; satz: string }> = [
  { wert: 'zulassung', titel: 'Mit Fahrzeugschein', satz: 'Das Fahrzeug hat ein amtliches Kennzeichen und eine Zulassungsbescheinigung Teil I.' },
  {
    wert: 'versicherungskennzeichen',
    titel: 'Mit Versicherungskennzeichen',
    satz: 'Das kleine Kennzeichen der Versicherung, das jedes Jahr neu kommt. Dann gibt es keinen Fahrzeugschein.',
  },
];

export const BEISPIEL_FAHRZEUGSCHEIN: ImageSlot = {
  motif: 'Beispielfoto: Fahrzeugschein flach aufgelegt, alle vier Ecken im Bild',
  ratio: '3/2',
  note: 'Scharf und ohne Spiegelung. Die Angaben müssen lesbar sein.',
};

export const BEISPIEL_ERSATZNACHWEIS: ImageSlot = {
  motif: 'Beispielfoto: Nachweis flach aufgelegt, ganzes Blatt im Bild, Name und Fahrzeug lesbar',
  ratio: '3/2',
  note: 'Als Foto oder PDF. Ihr Name und die Angaben zum Fahrzeug oder Schloss müssen lesbar sein.',
};

export const BEISPIEL_TYPENSCHILD: ImageSlot = {
  motif: 'Beispielfoto: Typenschild am Fahrzeug, Hersteller und Nummer lesbar',
  ratio: '4/3',
  note: 'Nah genug, dass jede Zeile lesbar ist. Ohne Blitz.',
};

/* ---------- Zusammenfassung, Kontakt, Nutzlast ----------------------------- */

function nachweisweg(klasse: FormularKlasse, daten: Pick<FahrzeugAnfrageDaten, 'roller'>): 'zulassung' | 'ersatz' {
  const nachweis = ANFRAGE_KLASSEN_DATEN[klasse].nachweis;
  if (nachweis === 'wahl') return daten.roller === 'versicherungskennzeichen' ? 'ersatz' : 'zulassung';
  return nachweis === 'ersatz' ? 'ersatz' : 'zulassung';
}

/** Zusammenfassung für Vorschau, Bestätigung, Vorgangsblatt und Mail an das Team. */
export function zusammenfassung(klasse: FormularKlasse, daten: FahrzeugAnfrageDaten): SummarySection[] {
  const formular = ANFRAGE_FORMULAR[klasse];
  const klassenDaten = ANFRAGE_KLASSEN_DATEN[klasse];
  const ersatz = nachweisweg(klasse, daten) === 'ersatz';
  const anschrift = [daten.plz.trim(), daten.ort.trim()].filter(Boolean).join(' ');
  const zeilen: SummarySection['rows'] = [{ label: 'Fahrzeugklasse', value: klassenDaten.bezeichnung }];
  if (formular.hersteller) zeilen.push({ label: formular.hersteller.label, value: daten.hersteller.trim() || 'keine Angabe' });
  if (klassenDaten.schloss) {
    zeilen.push({ label: 'Hersteller des Schlosses', value: daten.schlossHersteller.trim() || 'fehlt noch' });
    zeilen.push({ label: 'Schlüsselnummer', value: daten.schluesselnummer.trim() || 'fehlt noch' });
  }
  if (formular.modell) zeilen.push({ label: formular.modell.label.replace(' (freiwillig)', ''), value: daten.modell.trim() || 'keine Angabe' });
  if (formular.baujahr) zeilen.push({ label: 'Baujahr', value: daten.baujahr.trim() || 'keine Angabe' });
  if (klasse === 'roller') {
    zeilen.push({ label: 'Nachweis', value: daten.roller === 'versicherungskennzeichen' ? 'Versicherungskennzeichen' : daten.roller === 'zulassung' ? 'Fahrzeugschein' : 'noch offen' });
  }
  if (ersatz) {
    zeilen.push({ label: 'Art des Nachweises', value: daten.ersatznachweis ? ERSATZNACHWEISE[daten.ersatznachweis].titel : 'noch offen' });
    if (klassenDaten.typenschild) {
      zeilen.push({
        label: 'Typenschild',
        value: finGueltig(daten.fin) ? `Fahrzeug-Identifizierungsnummer ${daten.fin.trim().toUpperCase()}` : daten.keinTypenschild ? 'kein Typenschild vorhanden' : 'Foto',
      });
    }
  }
  if (formular.chip) zeilen.push({ label: 'Chip im Schlüssel', value: daten.transponder ? TRANSPONDER_TEXT[daten.transponder] : 'noch offen' });
  zeilen.push({
    label: 'Schlüssel',
    value: daten.schluessel === 'keiner' ? 'kein Schlüssel mehr vorhanden' : daten.schluessel === 'vorhanden' ? 'vorhanden, drei Fotos' : 'noch offen',
  });
  zeilen.push({ label: 'Ihr Anliegen', value: daten.beschreibung.trim() || 'fehlt noch' });

  return [
    { title: klassenDaten.bezeichnung, rows: zeilen },
    {
      title: 'Kontakt',
      rows: [
        { label: 'Name', value: [daten.anrede.trim(), daten.vorname.trim(), daten.nachname.trim()].filter(Boolean).join(' ') },
        { label: 'E-Mail', value: daten.email.trim() },
        { label: 'Telefon', value: daten.telefon.trim() },
        { label: 'Anschrift', value: anschrift || 'keine Angabe' },
        { label: 'Versandland', value: LIEFERLAND || 'keine Angabe' },
      ],
    },
  ];
}

/** Kontakt für den Vorgang; das Land ist immer das Lieferland. */
export function kontaktAus(daten: FahrzeugAnfrageDaten): ContactDetails {
  return {
    salutation: daten.anrede.trim() || undefined,
    firstName: daten.vorname.trim(),
    lastName: daten.nachname.trim(),
    email: daten.email.trim(),
    phone: daten.telefon.trim(),
    postalCode: daten.plz.trim() || undefined,
    city: daten.ort.trim() || undefined,
    country: LIEFERLAND,
  };
}

/**
 * Nutzlast des Vorgangs: Quelle `fahrzeug-anfrage` mit der Klasse als auswertbarem Feld. Der Server prüft
 * damit die Pflichtregel; Angaben, nach denen im Fall nicht gefragt wurde, gehen nicht mit.
 */
export function payloadAus(klasse: FormularKlasse, daten: FahrzeugAnfrageDaten): Record<string, unknown> {
  const formular = ANFRAGE_FORMULAR[klasse];
  const klassenDaten = ANFRAGE_KLASSEN_DATEN[klasse];
  const ersatz = nachweisweg(klasse, daten) === 'ersatz';
  const baujahr = daten.baujahr.trim();
  const fin = daten.fin.trim().toUpperCase();
  return {
    quelle: FAHRZEUG_ANFRAGE_QUELLE,
    klasse,
    ...(formular.hersteller ? { hersteller: daten.hersteller.trim() } : {}),
    ...(formular.modell ? { modell: daten.modell.trim() } : {}),
    ...(formular.baujahr && /^\d{4}$/.test(baujahr) ? { baujahr: Number(baujahr) } : {}),
    ...(klasse === 'roller' && daten.roller ? { roller: daten.roller } : {}),
    ...(klassenDaten.schloss ? { schlossHersteller: daten.schlossHersteller.trim(), schluesselnummer: daten.schluesselnummer.trim() } : {}),
    ...(formular.chip ? { transponder: daten.transponder || 'unklar' } : {}),
    ...(ersatz && daten.ersatznachweis ? { ersatznachweis: daten.ersatznachweis } : {}),
    ...(ersatz && klassenDaten.typenschild && finGueltig(fin) ? { fin } : {}),
    ...(ersatz && klassenDaten.typenschild && daten.keinTypenschild ? { keinTypenschild: true } : {}),
    beschreibung: daten.beschreibung.trim(),
    keinSchluesselMehr: daten.schluessel === 'keiner',
  };
}

/**
 * Dateien für das Absenden, je mit Kategorie und Steckplatz. Nur, was die Pflichtliste des Falls kennt:
 * Auf dem Ersatzweg geht kein Fahrzeugschein mit, bei bestätigtem Totalverlust keine Schlüsselfotos.
 */
export function uploadsAus<D extends DateiAngabe>(
  pflicht: readonly FehlendeUnterlage[],
  dateien: UnterlagenDateien<D>,
  alsUpload: (datei: D, kategorie: UploadRef['category'], steckplatz: UploadRef['steckplatz']) => Omit<UploadRef, 'id' | 'uploadedAt'>,
): Array<Omit<UploadRef, 'id' | 'uploadedAt'>> {
  const liste: Array<Omit<UploadRef, 'id' | 'uploadedAt'>> = [];
  if (pflicht.includes('fahrzeugschein')) liste.push(...dateien.fahrzeugschein.map((d) => alsUpload(d, 'fahrzeugschein', 'fahrzeugschein')));
  if (pflicht.includes('ersatznachweis')) liste.push(...dateien.ersatznachweis.map((d) => alsUpload(d, 'dokument', 'ersatznachweis')));
  if (pflicht.includes('typenschild')) liste.push(...dateien.typenschild.map((d) => alsUpload(d, 'dokument', 'typenschild')));
  for (const platz of SCHLUESSEL_STECKPLAETZE) {
    if (pflicht.includes(platz)) liste.push(...dateien.fotos[platz].map((d) => alsUpload(d, 'schluesselfoto', platz)));
  }
  return liste;
}

/* ---------- Vorbelegung aus der Adresse ----------------------------------- */

/** Nur Buchstaben, Ziffern, Leerzeichen und wenige Zeichen; gekürzt. */
export function adressText(wert: unknown, max: number): string {
  const text = Array.isArray(wert) ? wert[0] : wert;
  if (typeof text !== 'string') return '';
  return text.replace(/[^\p{L}\p{N} .\-/]/gu, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Vorbelegung aus „Fahrzeug nicht gefunden?“: Marke und Modell getrennt (Treffer des Katalogs) oder ein
 * freier Suchtext, dessen erstes Wort als Marke gilt. Der Kunde kann alles ändern.
 */
export function vorbelegungAus(params: { marke?: unknown; modell?: unknown; fahrzeug?: unknown }): Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'> {
  const marke = adressText(params.marke, 60);
  const modell = adressText(params.modell, 80);
  if (marke || modell) return { hersteller: marke, modell };
  const frei = adressText(params.fahrzeug, 80);
  if (!frei) return { hersteller: '', modell: '' };
  const [erstes, ...rest] = frei.split(' ');
  return { hersteller: erstes.slice(0, 60), modell: rest.join(' ').slice(0, 80) };
}

/** Kennung des Zwischenstands je Klasse; Dateien liegen nie im Browserspeicher. */
export function flowKennung(klasse: FormularKlasse): string {
  return `fahrzeug-anfrage-${klasse}`;
}

/**
 * Weicht ein gespeicherter Zwischenstand von der Vorbelegung aus der Suche ab? useFlow legt den Zwischenstand
 * über den Startwert; ein Kunde mit halb ausgefüllter Anfrage sähe sonst ohne Hinweis sein altes Fahrzeug.
 * Ergebnis: Marke und Modell aus der Suche zum Übernehmen, sonst `null` (keine Vorbelegung oder gleich).
 */
export function vorbelegungAbweichung(
  vorbelegung: Partial<Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'>> | undefined,
  daten: Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'>,
): Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'> | null {
  const hersteller = vorbelegung?.hersteller ?? '';
  const modell = vorbelegung?.modell ?? '';
  if (!hersteller && !modell) return null;
  if (daten.hersteller === hersteller && daten.modell === modell) return null;
  return { hersteller, modell };
}
