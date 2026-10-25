import { getCodeLines, getGuide, getSettings } from '@/lib/data';
import { codeFamilien, codeHersteller } from '@/lib/codelinie';

/** Ratgeber, aus dem die Fundstelle des Codes je Anwendungsfamilie stammt. */
export const RATGEBER_FUNDSTELLE = 'schluesselcode-finden';

/**
 * Alles, was die Seiten des Code-Shops für ihre Texte brauchen: aktive
 * Linien, Versandarten, Ratgeber, Familien und gepflegte Hersteller.
 */
export async function shopDaten() {
  const [lines, settings, ratgeber] = await Promise.all([
    getCodeLines(),
    getSettings(),
    getGuide(RATGEBER_FUNDSTELLE),
  ]);
  return {
    lines,
    settings,
    ratgeber,
    familien: codeFamilien(lines),
    hersteller: codeHersteller(lines),
  };
}
