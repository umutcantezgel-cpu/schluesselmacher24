/**
 * Reine Rechenfunktionen der Orientierungsrechner. Sie laufen im Browser auf
 * den Richtwerten, die die Seite mitgibt — es gibt keinen Serverweg und damit
 * nichts, was ein Browser verfälschen könnte.
 */
import type {
  AuswahlZeile,
  RichtwertErgebnis,
  RichtwertPosition,
  ServiceEinsatzAuswahl,
  ServiceEinsatzWerte,
  Spanne,
  TuerAbsicherungAuswahl,
  TuerAbsicherungWerte,
} from './typen';

/** Größere Vorhaben gehören in ein Angebot, nicht in einen Rechner. */
export const MAX_TUEREN = 99;

const UNVOLLSTAENDIG: RichtwertErgebnis = { art: 'unvollstaendig' };
const PLATZHALTER: RichtwertErgebnis = { art: 'kein-richtwert', grund: 'platzhalter' };
const BETRAG_FEHLT: RichtwertErgebnis = { art: 'kein-richtwert', grund: 'betrag-fehlt' };

/** Gewählte Positionen in der gepflegten Reihenfolge; Doppelte zählen einmal. */
function gewaehlt<P extends RichtwertPosition>(positionen: P[], kennungen: readonly string[]): P[] {
  const auswahl = new Set(kennungen);
  return positionen.filter((p) => auswahl.has(p.kennung));
}

/** Fehlt eine einzige Spanne, gibt es keine Summe. */
function summe(spannen: Array<Spanne | null>): Spanne | null {
  let vonCent = 0;
  let bisCent = 0;
  for (const spanne of spannen) {
    if (!spanne) return null;
    vonCent += spanne.vonCent;
    bisCent += spanne.bisCent;
  }
  return { vonCent, bisCent };
}

const mal = (spanne: Spanne | null, faktor: number): Spanne | null =>
  spanne && { vonCent: spanne.vonCent * faktor, bisCent: spanne.bisCent * faktor };

const gueltigeTueren = (anzahl: number): boolean => Number.isInteger(anzahl) && anzahl >= 1;

/** Türabsicherung = Spanne der Türart + Summe der gewählten Maßnahmen. */
export function tuerAbsicherungBerechnen(
  werte: TuerAbsicherungWerte,
  auswahl: TuerAbsicherungAuswahl,
): RichtwertErgebnis {
  const tuerart = werte.tuerarten.find((t) => t.kennung === auswahl.tuerart);
  const massnahmen = gewaehlt(werte.massnahmen, auswahl.massnahmen);
  if (!tuerart || massnahmen.length === 0) return UNVOLLSTAENDIG;
  if (werte.platzhalter) return PLATZHALTER;

  const gesamt = summe([tuerart.spanne, ...massnahmen.map((m) => m.spanne)]);
  return gesamt ? { art: 'spanne', spanne: gesamt } : BETRAG_FEHLT;
}

/** Serviceeinsatz = Σ Leistungen (je Tür × Anzahl Türen) + Anfahrt. */
export function serviceEinsatzBerechnen(
  werte: ServiceEinsatzWerte,
  auswahl: ServiceEinsatzAuswahl,
): RichtwertErgebnis {
  const leistungen = gewaehlt(werte.leistungen, auswahl.leistungen);
  if (leistungen.length === 0) return UNVOLLSTAENDIG;

  const jeTuer = leistungen.some((l) => l.einheit === 'je-tuer');
  const tueren = auswahl.anzahlTueren;
  if (jeTuer && !gueltigeTueren(tueren)) return UNVOLLSTAENDIG;
  if (werte.platzhalter) return PLATZHALTER;
  if (jeTuer && tueren > MAX_TUEREN) return { art: 'kein-richtwert', grund: 'umfang' };

  const gesamt = summe([
    ...leistungen.map((l) => (l.einheit === 'je-tuer' ? mal(l.spanne, tueren) : l.spanne)),
    werte.anfahrt,
  ]);
  return gesamt ? { art: 'spanne', spanne: gesamt } : BETRAG_FEHLT;
}

/* ---------- Anzeige ------------------------------------------------------ */

const EURO_GANZ = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

/**
 * „ca. 120 – 180 €“ in ganzen Euro. Die Untergrenze wird ab-, die Obergrenze
 * aufgerundet — die angezeigte Spanne schließt die gerechnete immer ein.
 */
export function spanneText(spanne: Spanne): string {
  const von = Math.floor(spanne.vonCent / 100);
  const bis = Math.ceil(spanne.bisCent / 100);
  const euro = (wert: number) => `${EURO_GANZ.format(wert)} €`;
  return von === bis ? `ca. ${euro(bis)}` : `ca. ${EURO_GANZ.format(von)} – ${euro(bis)}`;
}

/** Der gepflegte Hinweis — und in jedem Fall „unverbindliche Orientierung“. */
export function orientierungsHinweis(hinweis: string | null): string {
  const text = hinweis?.trim();
  if (!text) return 'Unverbindliche Orientierung.';
  return /unverbindlich/i.test(text) ? text : `Unverbindliche Orientierung. ${text}`;
}

export function tuerAbsicherungZusammenfassung(
  werte: TuerAbsicherungWerte,
  auswahl: TuerAbsicherungAuswahl,
): AuswahlZeile[] {
  const tuerart = werte.tuerarten.find((t) => t.kennung === auswahl.tuerart);
  const massnahmen = gewaehlt(werte.massnahmen, auswahl.massnahmen);
  return [
    { label: 'Türart', wert: tuerart?.label ?? 'noch nicht gewählt' },
    {
      label: massnahmen.length === 1 ? 'Maßnahme' : 'Maßnahmen',
      wert: massnahmen.length ? massnahmen.map((m) => m.label).join(', ') : 'noch keine gewählt',
    },
  ];
}

export function serviceEinsatzZusammenfassung(
  werte: ServiceEinsatzWerte,
  auswahl: ServiceEinsatzAuswahl,
): AuswahlZeile[] {
  const leistungen = gewaehlt(werte.leistungen, auswahl.leistungen);
  const zeilen: AuswahlZeile[] = [
    {
      label: leistungen.length === 1 ? 'Leistung' : 'Leistungen',
      wert: leistungen.length
        ? leistungen.map((l) => `${l.label} (${l.einheit === 'je-tuer' ? 'je Tür' : 'pauschal'})`).join(', ')
        : 'noch keine gewählt',
    },
  ];
  if (leistungen.some((l) => l.einheit === 'je-tuer') && gueltigeTueren(auswahl.anzahlTueren)) {
    zeilen.push({ label: 'Anzahl Türen', wert: String(auswahl.anzahlTueren) });
  }
  return zeilen;
}
