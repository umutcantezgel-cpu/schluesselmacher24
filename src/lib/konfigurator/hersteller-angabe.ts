/*
 * Herstellerwahl im Konfigurator für gleichschließende Zylinder (FA-SHOP-04B, Abschnitt 15:
 * „BKS und ABUS als Hauptpartner beziehungsweise angebotene Systeme sichtbar darstellen“).
 *
 * Zwei Fälle, ein Preispfad:
 * - Bietet der Zylinderkatalog Hersteller an, gilt seine Preisregel wie im Bestand (Aufpreis,
 *   Zusatzkomponenten, `manufacturerId`).
 * - Sonst sind die Hersteller der Stammliste mit dem Bereich „Sperrschließungen“ wählbar. Die Wahl ist
 *   eine Angabe für die Werkstatt (`herstellerAngabe`), ohne Preiswirkung: `priceCylinderOrder` kennt
 *   sie nicht, der feste Preis bleibt fest und wird nicht still zum Angebot.
 *
 * Reine Funktionen; die Kasse prüft den Namen gegen die Stammliste.
 */

import { freigegebenesLogo, herstellerFuerAnzeige } from '../../components/hersteller/bereiche';
import { aktiveHersteller } from '../cylinder-rules';
import type { CylinderCatalog, CylinderOrderDraft, MediaImage, ShopHersteller } from '../types';

/** Ein wählbares System für die Sperrschließung aus der Stammliste. */
export interface HerstellerSystem {
  id: string;
  name: string;
  /** Nur mit Freigabe im Stamm (R12); sonst erscheint der Name als Schriftzug. */
  logo?: MediaImage;
}

/** Wert im Zwischenstand für „keine Vorgabe, die Werkstatt wählt“. */
export const KEINE_HERSTELLER_VORGABE = 'keine-vorgabe';

/** Satz zur Wahl ohne Herstellerpreise. */
export const HERSTELLER_ANGABE_SATZ = 'Ihre Wahl geben wir an die Werkstatt weiter. Sie ändert die Summe nicht.';

/** Angebotene Hersteller der Stammliste mit dem Bereich „Sperrschließungen“, in ihrer Reihenfolge. */
export function systemeFuerSperrschliessung(stamm: ShopHersteller[]): HerstellerSystem[] {
  const logos = new Map(stamm.map((h) => [h.id, freigegebenesLogo(h.logo)]));
  return herstellerFuerAnzeige(stamm, 'sperrschliessung').map((eintrag) => {
    const logo = logos.get(eintrag.id);
    return { id: eintrag.id, name: eintrag.name, ...(logo ? { logo } : {}) };
  });
}

/**
 * Welche Herstellerwahl zeigt der Konfigurator? `katalog`: Einträge des Zylinderkatalogs mit
 * Preisregel; `angabe`: Systeme aus der Stammliste ohne Preiswirkung; `keine`: kein Schritt.
 */
export function herstellerModus(katalog: Pick<CylinderCatalog, 'manufacturers'>, systeme: HerstellerSystem[]): 'katalog' | 'angabe' | 'keine' {
  if (aktiveHersteller(katalog).length > 0) return 'katalog';
  return systeme.length > 0 ? 'angabe' : 'keine';
}

/**
 * Prüfung der Kasse: Eine Herstellerangabe muss ein System aus der Stammliste sein und darf nur stehen,
 * solange der Zylinderkatalog keinen Hersteller anbietet. Sonst eine Meldung mit Ausweg, ohne Angabe null.
 */
export function herstellerAngabeProblem(
  entwurf: Pick<CylinderOrderDraft, 'herstellerAngabe'>,
  katalog: Pick<CylinderCatalog, 'manufacturers'>,
  systeme: HerstellerSystem[],
): string | null {
  const angabe = entwurf.herstellerAngabe?.trim();
  if (!angabe) return null;
  if (aktiveHersteller(katalog).length > 0 || !systeme.some((s) => s.name === angabe)) {
    // Gilt für beide Wege in den Warenkorb (Konfigurator und Schließplan-Planer); der Planer kann den Hersteller nicht ändern.
    return `Den Hersteller „${angabe}“ können wir für diese Zusammenstellung nicht übernehmen. Bitte entfernen Sie die Position und stellen Sie die Zylinder im Konfigurator neu zusammen, oder schicken Sie uns eine Anfrage.`;
  }
  return null;
}
