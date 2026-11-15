import { getCodeLines, getGuide, getHersteller, getKategorien, getSettings } from '@/lib/data';
import { codeKategorien, herstellerMitSeite, nachHerstellerUndSystem } from '@/lib/codelinie';

/** Ratgeber, aus dem die Fundstelle des Codes je Anwendungsfamilie stammt. */
export const RATGEBER_FUNDSTELLE = 'schluesselcode-finden';

/**
 * Alles, was die Seiten des Code-Shops für ihre Texte brauchen: aktive
 * Linien, Versandarten, Ratgeber, die Hersteller-Stammliste, die Gruppen nach
 * Hersteller und System, die Herstellerseiten und die Unterkategorien aus den
 * Daten (FA-SHOP-01B).
 */
export async function shopDaten() {
  const [lines, settings, ratgeber, stamm, kategorienAlle] = await Promise.all([
    getCodeLines(),
    getSettings(),
    getGuide(RATGEBER_FUNDSTELLE),
    getHersteller(),
    getKategorien(),
  ]);
  return {
    lines,
    settings,
    ratgeber,
    stamm,
    kategorienAlle,
    gruppen: nachHerstellerUndSystem(lines, stamm),
    hersteller: herstellerMitSeite(lines, stamm),
    kategorien: codeKategorien(kategorienAlle, lines),
  };
}
