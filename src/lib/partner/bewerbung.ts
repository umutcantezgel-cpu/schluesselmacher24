/*
 * Partner-Bewerbung als Statusautomat (G-39, MA-16, Erg. Leitfaden §7). Freigeschaltet wird nur nach
 * Prüfung von Gewerbe, Identität und fachlicher Eignung, mit unterschriebenem Vertrag und mit der
 * Prüfliste samt Besuch vor Ort (FA-PLATTFORM-01B); die Freischaltung setzt immer ein Mensch.
 * Pausieren und Sperren (neu, FA-07-19) nur mit Grund. Reine Funktionen.
 */

import { prueflisteFehlt, type Pruefliste } from './pruefliste';

export type BewerbungStatus =
  | 'eingegangen'
  | 'in-pruefung'
  | 'nachweise-fehlen'
  | 'vertrag-versendet'
  | 'vertrag-unterschrieben'
  | 'freigeschaltet'
  | 'pausiert'
  | 'gesperrt'
  | 'abgelehnt'
  | 'beendet';

export const BEWERBUNG_STATUS: ReadonlyArray<{ value: BewerbungStatus; label: string }> = [
  { value: 'eingegangen', label: 'Eingegangen' },
  { value: 'in-pruefung', label: 'In Prüfung' },
  { value: 'nachweise-fehlen', label: 'Nachweise fehlen' },
  { value: 'vertrag-versendet', label: 'Vertrag versendet' },
  { value: 'vertrag-unterschrieben', label: 'Vertrag unterschrieben' },
  { value: 'freigeschaltet', label: 'Freigeschaltet' },
  { value: 'pausiert', label: 'Pausiert' },
  { value: 'gesperrt', label: 'Gesperrt' },
  { value: 'abgelehnt', label: 'Abgelehnt' },
  { value: 'beendet', label: 'Beendet' },
];

/** Erlaubte Übergänge; alles andere lehnt `uebergangErlaubt` ab. */
export const BEWERBUNG_UEBERGAENGE: Readonly<Record<BewerbungStatus, readonly BewerbungStatus[]>> = {
  eingegangen: ['in-pruefung', 'abgelehnt'],
  'in-pruefung': ['nachweise-fehlen', 'vertrag-versendet', 'abgelehnt'],
  'nachweise-fehlen': ['in-pruefung', 'abgelehnt'],
  'vertrag-versendet': ['vertrag-unterschrieben', 'in-pruefung', 'abgelehnt'],
  'vertrag-unterschrieben': ['freigeschaltet', 'in-pruefung'],
  freigeschaltet: ['pausiert', 'gesperrt', 'beendet'],
  pausiert: ['freigeschaltet', 'gesperrt', 'beendet'],
  // Nach einer Sperre geht es nur mit vollständiger Prüfliste zurück, auch für Betriebe aus der Zeit davor.
  gesperrt: ['freigeschaltet', 'beendet'],
  abgelehnt: [],
  beendet: [],
};

export function uebergangErlaubt(von: BewerbungStatus, nach: BewerbungStatus): boolean {
  return von === nach || BEWERBUNG_UEBERGAENGE[von].includes(nach);
}

export interface Pruefung {
  gewerbeGeprueft?: boolean;
  identitaetGeprueft?: boolean;
  eignungGeprueft?: boolean;
  vertragUnterschrieben?: boolean;
  /** Prüfliste (FA-PLATTFORM-01B); fehlt sie, fehlen alle ihre Punkte. */
  pruefliste?: Pruefliste | null;
  /** Grund für Pausieren oder Sperren (Gruppe `sperre`). */
  sperrGrund?: string | null;
}

/**
 * Was vor der Freischaltung fehlt (leer = alles da). `ohneAltbestand`: Der Vermerk „vor Einführung der
 * Prüfliste freigeschaltet“ zählt nicht (Rückkehr aus einer Sperre).
 */
export function fehltFuerFreischaltung(p: Pruefung, optionen: { ohneAltbestand?: boolean } = {}): string[] {
  const fehlt: string[] = [];
  if (!p.gewerbeGeprueft) fehlt.push('Gewerbenachweis prüfen');
  if (!p.identitaetGeprueft) fehlt.push('Identität prüfen');
  if (!p.eignungGeprueft) fehlt.push('fachliche Eignung prüfen');
  if (!p.vertragUnterschrieben) fehlt.push('unterschriebenen Vertrag hinterlegen');
  fehlt.push(...prueflisteFehlt(p.pruefliste, optionen));
  return fehlt;
}

/** Stände, die einen Partnerbetrieb von jeder neuen Zuordnung ausschließen und einen Grund verlangen. */
export const STAENDE_MIT_GRUND: readonly BewerbungStatus[] = ['pausiert', 'gesperrt'];

export const MELDUNG_OHNE_SPERRGRUND = 'Bitte den Grund für Pausieren oder Sperren eintragen (Gruppe „Pausieren oder sperren“).';

/** Prüft einen gewünschten Statuswechsel; Meldung oder `null`. */
export function statuswechselPruefen(von: BewerbungStatus, nach: BewerbungStatus, pruefung: Pruefung): string | null {
  if (!uebergangErlaubt(von, nach)) return `Von „${von}“ nach „${nach}“ geht es nicht direkt.`;
  if (nach === 'freigeschaltet') {
    const fehlt = fehltFuerFreischaltung(pruefung, { ohneAltbestand: von === 'gesperrt' });
    if (fehlt.length) return `Vor der Freischaltung fehlt: ${fehlt.join(', ')}.`;
  }
  if (von !== nach && STAENDE_MIT_GRUND.includes(nach) && !(pruefung.sperrGrund ?? '').trim()) return MELDUNG_OHNE_SPERRGRUND;
  return null;
}

export interface Sperre {
  grund?: string | null;
  seit?: string | null;
  von?: string | null;
}

/**
 * Sperre oder Pause beim Statuswechsel festhalten (FA-07-19): Beim Eintritt in „pausiert“ oder „gesperrt“
 * setzt der Server Datum und Bearbeiter. Beim Verlassen kommt der Eintrag als Zeile in die interne Notiz,
 * und die Gruppe wird geleert, damit die nächste Pause einen eigenen Grund braucht.
 */
export function sperreBeimWechsel(
  von: BewerbungStatus,
  nach: BewerbungStatus,
  sperre: Sperre,
  k: { jetzt: string; bearbeiter: string },
): { sperre: Sperre; notizZeile?: string } {
  if (von === nach) return { sperre };
  if (STAENDE_MIT_GRUND.includes(nach)) {
    return { sperre: { grund: (sperre.grund ?? '').trim(), seit: k.jetzt, von: k.bearbeiter } };
  }
  if (STAENDE_MIT_GRUND.includes(von)) {
    const label = BEWERBUNG_STATUS.find((s) => s.value === von)?.label ?? von;
    const zeile = `${label} seit ${(sperre.seit ?? '').slice(0, 10) || 'unbekannt'} (${sperre.von || 'Team'}): ${(sperre.grund ?? '').trim() || 'ohne Grund'}. Aufgehoben am ${k.jetzt.slice(0, 10)} (${k.bearbeiter}).`;
    return { sperre: { grund: null, seit: null, von: null }, notizZeile: zeile };
  }
  return { sperre };
}
