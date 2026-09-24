/**
 * Richtwerte der Orientierungsrechner — Beträge in Cent.
 *
 * Eine Spanne ist entweder vollständig gepflegt (von und bis, von ≤ bis) oder
 * fehlt (`null`). Halbe Angaben gelten als fehlend: Die Rechner nennen dann
 * lieber keinen Betrag als einen geratenen.
 */

export interface Spanne {
  vonCent: number;
  bisCent: number;
}

export interface RichtwertPosition {
  /** Feste Kennung aus dem Backend, dient als Schlüssel der Auswahl. */
  kennung: string;
  label: string;
  beschreibung: string | null;
  spanne: Spanne | null;
}

export type Einheit = 'pauschal' | 'je-tuer';

export interface ServiceLeistung extends RichtwertPosition {
  einheit: Einheit;
}

interface RechnerGrundlage {
  /** Solange gesetzt, nennen die Rechner keine Beträge. */
  platzhalter: boolean;
  /** Hinweistext unter jedem Ergebnis, im Backend gepflegt. */
  hinweis: string | null;
}

export interface TuerAbsicherungWerte extends RechnerGrundlage {
  tuerarten: RichtwertPosition[];
  massnahmen: RichtwertPosition[];
}

export interface ServiceEinsatzWerte extends RechnerGrundlage {
  leistungen: ServiceLeistung[];
  anfahrt: Spanne | null;
}

/** Alles, was die Seite für beide Rechner braucht. */
export interface RechnerRichtwerte {
  tuerAbsicherung: TuerAbsicherungWerte;
  serviceEinsatz: ServiceEinsatzWerte;
}

export interface TuerAbsicherungAuswahl {
  tuerart: string | null;
  massnahmen: readonly string[];
}

export interface ServiceEinsatzAuswahl {
  leistungen: readonly string[];
  anzahlTueren: number;
}

/**
 * - `spanne`: alle benötigten Beträge sind gepflegt.
 * - `kein-richtwert`: Auswahl vollständig, aber kein Betrag nennbar.
 * - `unvollstaendig`: Es fehlt noch eine Angabe der Kundin oder des Kunden.
 */
export type RichtwertErgebnis =
  | { art: 'spanne'; spanne: Spanne }
  | { art: 'kein-richtwert'; grund: 'platzhalter' | 'betrag-fehlt' | 'umfang' }
  | { art: 'unvollstaendig' };

export interface AuswahlZeile {
  label: string;
  wert: string;
}
