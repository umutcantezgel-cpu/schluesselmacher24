/*
 * Partner-Bewerbung als Statusautomat (G-39, MA-16, Erg. Leitfaden §7). Freigeschaltet wird nur nach
 * Prüfung von Gewerbe, Identität und fachlicher Eignung und mit unterschriebenem Vertrag; die
 * Freischaltung setzt immer ein Mensch. Reine Funktionen.
 */

export type BewerbungStatus =
  | 'eingegangen'
  | 'in-pruefung'
  | 'nachweise-fehlen'
  | 'vertrag-versendet'
  | 'vertrag-unterschrieben'
  | 'freigeschaltet'
  | 'pausiert'
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
  freigeschaltet: ['pausiert', 'beendet'],
  pausiert: ['freigeschaltet', 'beendet'],
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
}

/** Was vor der Freischaltung fehlt (leer = alles da). */
export function fehltFuerFreischaltung(p: Pruefung): string[] {
  const fehlt: string[] = [];
  if (!p.gewerbeGeprueft) fehlt.push('Gewerbenachweis prüfen');
  if (!p.identitaetGeprueft) fehlt.push('Identität prüfen');
  if (!p.eignungGeprueft) fehlt.push('fachliche Eignung prüfen');
  if (!p.vertragUnterschrieben) fehlt.push('unterschriebenen Vertrag hinterlegen');
  return fehlt;
}

/** Prüft einen gewünschten Statuswechsel; Meldung oder `null`. */
export function statuswechselPruefen(von: BewerbungStatus, nach: BewerbungStatus, pruefung: Pruefung): string | null {
  if (!uebergangErlaubt(von, nach)) return `Von „${von}“ nach „${nach}“ geht es nicht direkt.`;
  if (nach === 'freigeschaltet') {
    const fehlt = fehltFuerFreischaltung(pruefung);
    if (fehlt.length) return `Vor der Freischaltung fehlt: ${fehlt.join(', ')}.`;
  }
  return null;
}
