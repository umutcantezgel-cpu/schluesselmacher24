/*
 * Prüfliste vor der Freischaltung eines Partnerbetriebs (FA-PLATTFORM-01B, FA-07-13 bis FA-07-18).
 *
 * Vorgabe des Inhabers (Arbeitsanweisung vom 11.11.2026, Abschnitt 07): Betrieb und Identität prüfen,
 * Leistungsumfang und Fahrzeugabdeckung dokumentieren, Maschinen, Programmiergeräte und
 * Werkstattausstattung erfassen, Region und mobilen Einsatzradius erfassen, vor der endgültigen
 * Freischaltung den Betrieb nach Möglichkeit persönlich besuchen, den Qualitätsstandard schriftlich
 * festhalten. Nur geeignete Betriebe werden als aktive Partner geführt.
 *
 * Je Punkt: erledigt, Datum, Prüfer, Notiz. Der Besuch vor Ort ist Pflicht, außer das Team vermerkt
 * ausdrücklich „Besuch nicht möglich“ mit Grund. Betriebe, die vor der Prüfliste freigeschaltet waren,
 * tragen den Vermerk `vorEinfuehrung` (setzt nur die Migration) und bleiben freigeschaltet.
 *
 * Reine Daten und Funktionen, nur relative Importe.
 */

/** Die einfachen Punkte der Prüfliste in der Reihenfolge des Inhabers. */
export const PRUEFLISTE_PUNKTE = [
  { name: 'identitaet', label: 'Identität und Betrieb' },
  { name: 'leistungsumfang', label: 'Leistungsumfang und Fahrzeugabdeckung' },
  { name: 'ausstattung', label: 'Maschinen, Programmiergeräte, Werkstatt' },
  { name: 'region', label: 'Region und Radius' },
] as const;

export type PrueflistePunktName = (typeof PRUEFLISTE_PUNKTE)[number]['name'];

export interface PrueflistePunkt {
  erledigt?: boolean | null;
  am?: string | null;
  pruefer?: string | null;
  notiz?: string | null;
}

/** Ergebnis des Besuchs vor Ort. Nur „geeignet“ und „geeignet mit Auflagen“ erlauben die Freischaltung. */
export const BESUCH_ERGEBNISSE = [
  { label: 'geeignet', value: 'geeignet' },
  { label: 'geeignet mit Auflagen', value: 'auflagen' },
  { label: 'nicht geeignet', value: 'nicht-geeignet' },
] as const;

export type BesuchErgebnis = (typeof BESUCH_ERGEBNISSE)[number]['value'];

export interface Besuch {
  am?: string | null;
  /** Wer den Betrieb besucht hat. */
  pruefer?: string | null;
  ergebnis?: BesuchErgebnis | null;
  notiz?: string | null;
  /** Fotos als interne Dateien (Kennungen oder geladene Dokumente). */
  fotos?: unknown[] | null;
  nichtMoeglich?: boolean | null;
  nichtMoeglichGrund?: string | null;
}

export interface Qualitaetsstandard extends PrueflistePunkt {
  /** Interne Datei mit dem schriftlichen Standard. */
  datei?: unknown;
  /** Verweis auf den Vertrag oder eine Anlage, etwa „Partnervertrag, Anlage 2“. */
  vertragsverweis?: string | null;
}

export interface Pruefliste {
  identitaet?: PrueflistePunkt | null;
  leistungsumfang?: PrueflistePunkt | null;
  ausstattung?: PrueflistePunkt | null;
  region?: PrueflistePunkt | null;
  besuch?: Besuch | null;
  standard?: Qualitaetsstandard | null;
  /** Vor Einführung der Prüfliste freigeschaltet (nur die Migration setzt das). */
  vorEinfuehrung?: boolean | null;
}

export const VOR_EINFUEHRUNG_TEXT = 'vor Einführung der Prüfliste freigeschaltet';

export const PRUEFLISTE_MELDUNG = {
  besuchOhneGrund: 'Bei „Besuch nicht möglich“ bitte den Grund eintragen.',
  besuchMitErgebnis:
    'Der Besuch ist mit einem Ergebnis erfasst. „Besuch nicht möglich“ passt dazu nicht; bitte eines von beiden entfernen.',
} as const;

const text = (wert: unknown): string => (typeof wert === 'string' ? wert.trim() : '');
const gesetzt = (wert: unknown): boolean => wert !== null && wert !== undefined && wert !== '' && !(Array.isArray(wert) && wert.length === 0);

/** Ein einfacher Punkt gilt als erledigt mit Haken, Datum und Prüfer. */
export function punktErledigt(p: PrueflistePunkt | null | undefined): boolean {
  return Boolean(p?.erledigt && gesetzt(p.am) && text(p.pruefer));
}

/**
 * Besuch erledigt: Datum, wer und ein geeignetes Ergebnis; oder ausdrücklich nicht möglich mit Grund.
 * Ein Besuch mit Ergebnis „nicht geeignet“ sperrt die Freischaltung immer, auch mit „Besuch nicht möglich“
 * (nur geeignete Betriebe werden als aktive Partner geführt).
 */
export function besuchErledigt(b: Besuch | null | undefined): boolean {
  if (!b) return false;
  if (b.ergebnis === 'nicht-geeignet') return false;
  if (b.nichtMoeglich) return Boolean(text(b.nichtMoeglichGrund));
  return gesetzt(b.am) && Boolean(text(b.pruefer)) && (b.ergebnis === 'geeignet' || b.ergebnis === 'auflagen');
}

/** Qualitätsstandard erledigt: wie ein Punkt, dazu eine Datei oder ein Vertragsverweis. */
export function standardErledigt(s: Qualitaetsstandard | null | undefined): boolean {
  return punktErledigt(s) && (gesetzt(s?.datei) || Boolean(text(s?.vertragsverweis)));
}

/**
 * Was auf der Prüfliste vor der Freischaltung fehlt (leer = alles da). Betriebe mit dem Vermerk „vor
 * Einführung der Prüfliste freigeschaltet“ brauchen sie nicht, außer `ohneAltbestand` (nach einer Sperre).
 */
export function prueflisteFehlt(liste: Pruefliste | null | undefined, optionen: { ohneAltbestand?: boolean } = {}): string[] {
  const l = liste ?? {};
  if (l.vorEinfuehrung && !optionen.ohneAltbestand) return [];
  const fehlt: string[] = [];
  for (const punkt of PRUEFLISTE_PUNKTE) {
    if (!punktErledigt(l[punkt.name])) fehlt.push(`Prüfliste: ${punkt.label}`);
  }
  if (!besuchErledigt(l.besuch)) {
    fehlt.push(
      l.besuch?.ergebnis === 'nicht-geeignet'
        ? 'Prüfliste: Besuch vor Ort mit Ergebnis „geeignet“'
        : 'Prüfliste: Besuch vor Ort (oder „Besuch nicht möglich“ mit Grund)',
    );
  }
  if (!standardErledigt(l.standard)) fehlt.push('Prüfliste: Qualitätsstandard schriftlich (Datei oder Vertragsverweis)');
  return fehlt;
}

/**
 * Prüfung beim Speichern, unabhängig vom Stand: „Besuch nicht möglich“ nur mit Grund und nicht zusammen mit
 * einem erfassten Besuchsergebnis.
 */
export function prueflisteSpeichernPruefen(liste: Pruefliste | null | undefined): string | null {
  const b = liste?.besuch;
  if (b?.nichtMoeglich && !text(b.nichtMoeglichGrund)) return PRUEFLISTE_MELDUNG.besuchOhneGrund;
  if (b?.nichtMoeglich && gesetzt(b.ergebnis)) return PRUEFLISTE_MELDUNG.besuchMitErgebnis;
  return null;
}

type Daten = Record<string, unknown>;

function gruppe(wert: unknown): Daten {
  return wert && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Daten) : {};
}

/**
 * Prüfliste aus gespeichertem Stand und Änderung zusammenführen, je Punkt Feld für Feld (ein Teilupdate
 * leert keine anderen Angaben). Wird ein Punkt neu abgehakt, setzt der Server Datum und Prüfer, wenn sie
 * leer sind. Den Vermerk `vorEinfuehrung` übernimmt er nur aus dem gespeicherten Stand.
 */
export function prueflisteZusammenfuehren(
  neu: unknown,
  alt: unknown,
  k: { jetzt: string; bearbeiter: string },
): Pruefliste {
  const n = gruppe(neu);
  const a = gruppe(alt);
  const ergebnis: Daten = {};
  for (const name of ['identitaet', 'leistungsumfang', 'ausstattung', 'region', 'besuch', 'standard'] as const) {
    ergebnis[name] = { ...gruppe(a[name]), ...gruppe(n[name]) };
  }
  for (const name of ['identitaet', 'leistungsumfang', 'ausstattung', 'region', 'standard'] as const) {
    const punkt = ergebnis[name] as PrueflistePunkt;
    const vorher = gruppe(a[name]) as PrueflistePunkt;
    if (punkt.erledigt && !vorher.erledigt) {
      if (!gesetzt(punkt.am)) punkt.am = k.jetzt;
      if (!text(punkt.pruefer)) punkt.pruefer = k.bearbeiter;
    }
  }
  ergebnis.vorEinfuehrung = a.vorEinfuehrung === true;
  return ergebnis as Pruefliste;
}

/** Kurzer Stand der Prüfliste für die Anzeige am Partnerbetrieb. */
export function prueflisteStandText(liste: Pruefliste | null | undefined, status?: string | null): string {
  const fehlt = prueflisteFehlt(liste, { ohneAltbestand: true });
  if (liste?.vorEinfuehrung && fehlt.length) {
    return `${VOR_EINFUEHRUNG_TEXT[0].toUpperCase()}${VOR_EINFUEHRUNG_TEXT.slice(1)}. Offen: ${fehlt.map((f) => f.replace('Prüfliste: ', '')).join(', ')}.`;
  }
  if (!fehlt.length) return 'Prüfliste vollständig.';
  const offen = `Offen: ${fehlt.map((f) => f.replace('Prüfliste: ', '')).join(', ')}.`;
  return status === 'freigeschaltet' ? offen : `${offen} Erst danach lässt sich der Betrieb freischalten.`;
}
