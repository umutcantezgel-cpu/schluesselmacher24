import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import type { CityPage, OrtsseitenLage } from '@/lib/types';

/* ==========================================================================
   Was Suchmaschinen sehen dürfen
   Seiten mit Redaktions-Platzhaltern versprechen etwas, das (noch) nicht
   belegt ist — etwa Vor-Ort-Leistungen in einer Stadt. Sie bleiben
   erreichbar, stehen aber auf noindex und nicht in der Sitemap.
   ========================================================================== */

/** Enthält die Stadtseite noch Platzhalter (Einleitung oder Angaben)? */
export function stadtHatPlatzhalter(city: CityPage): boolean {
  const texte = [city.localIntro, city.seo.title, city.seo.description, ...city.localFacts.map((fact) => fact.value)];
  return texte.some((text) => istPlatzhalter(text) || enthaeltPlatzhalter(text));
}

/* --------------------------------------------------------------------------
   Veröffentlichung nur mit Substanz (FA-09, FA-AA-03, FA-AA-06, R2, R3)
   Eine Ortsseite darf nur in Suchmaschinen, wenn
   (a) ihre Einleitung eigener Text ist: kein Platzhalter, Mindestlänge, nicht
       wortgleich mit einer anderen Ortsseite (auch nicht mit nur getauschtem
       Ortsnamen), und
   (b) sie über den Gemeindeschlüssel am Ortsstamm hängt (Landkreis,
       Postleitzahlen), und
   (c) ein plausibler Leistungsweg besteht: Werkstatt im Ort oder Landkreis,
       ein freigeschalteter Partner deckt den Ort ab, oder der Betreiber hat
       eine konkrete Verfügbarkeit eingetragen.
   Die Lage (Werkstatt, Partner, Verfügbarkeit) rechnet src/lib/orte/ortsseiten.ts.
   -------------------------------------------------------------------------- */

/** Mindestlänge der örtlichen Einleitung in Zeichen (etwa zwei Sätze). */
export const EINLEITUNG_MINDESTLAENGE = 160;

/** Mindestlänge einer eingetragenen Verfügbarkeit in Zeichen. */
export const VERFUEGBARKEIT_MINDESTLAENGE = 20;

/** Verknüpfung am Stamm und Leistungsweg einer Ortsseite, wie die Lage sie berechnet. */
export type Leistungsweg = Pick<OrtsseitenLage, 'gemeinde' | 'werkstatt' | 'partnerDeckt' | 'verfuegbarkeit'>;

/**
 * Vergleichsform einer Einleitung: klein, ohne Satzzeichen, die genannten Ortsnamen durch einen Platzhalter
 * ersetzt. Verglichen werden zwei Seiten mit beiden Ortsnamen: So fallen gleiche Texte auf, auch wenn nur der
 * Ortsname getauscht ist.
 */
export function einleitungVergleichsform(text: string, orte: string | readonly string[]): string {
  let form = text.normalize('NFKC').toLowerCase();
  const namen = (typeof orte === 'string' ? [orte] : [...orte])
    .map((ort) => ort.normalize('NFKC').toLowerCase().trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  for (const name of namen) form = form.split(name).join(' ortsname ');
  return form.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** Sind zwei Einleitungen gleich, bis auf die Ortsnamen der beiden Seiten? */
export function einleitungenGleich(a: Pick<CityPage, 'localIntro' | 'city'>, b: Pick<CityPage, 'localIntro' | 'city'>): boolean {
  const namen = [a.city, b.city];
  const formA = einleitungVergleichsform(a.localIntro, namen);
  return formA !== '' && formA === einleitungVergleichsform(b.localIntro, namen);
}

/** Ist eine eingetragene Verfügbarkeit eigener Text (kein Platzhalter, nicht zu kurz)? */
export function verfuegbarkeitEingetragen(text: string | null | undefined): boolean {
  const wert = (text ?? '').trim();
  return wert.length >= VERFUEGBARKEIT_MINDESTLAENGE && !istPlatzhalter(wert) && !enthaeltPlatzhalter(wert);
}

/**
 * Gründe, warum eine Ortsseite nicht indexierbar ist; leer heißt indexierbar. `alle` sind alle
 * veröffentlichten Ortsseiten (Prüfung auf Textgleichheit), `weg` der berechnete Leistungsweg.
 */
export function ortsseiteGruende(city: CityPage, alle: readonly CityPage[], weg: Leistungsweg | null): string[] {
  const gruende: string[] = [];
  if (city.seo.noindex) gruende.push('Im Admin auf „nicht in Suchmaschinen“ gesetzt.');
  if (stadtHatPlatzhalter(city)) gruende.push('Einleitung, Angaben oder Suchmaschinentexte enthalten Platzhalter.');
  const einleitung = city.localIntro.trim();
  if (einleitung.length < EINLEITUNG_MINDESTLAENGE) {
    gruende.push(`Einleitung zu kurz (${einleitung.length} von mindestens ${EINLEITUNG_MINDESTLAENGE} Zeichen).`);
  }
  const gleiche = alle.filter((andere) => andere.id !== city.id && einleitungenGleich(city, andere));
  if (gleiche.length > 0) {
    gruende.push(`Einleitung gleicht der Ortsseite ${gleiche.map((andere) => `„${andere.city}“`).join(', ')} (bis auf den Ortsnamen).`);
  }
  // Stadt, Landkreis und Postleitzahl hängen am Gemeindeschlüssel; ohne ihn ist die Seite nicht verknüpft (FA-09).
  if (!weg?.gemeinde) {
    gruende.push('Gemeindeschlüssel fehlt oder steht nicht im Ortsstamm: Landkreis und Postleitzahlen sind nicht verknüpft.');
  }
  if (!weg || (!weg.werkstatt && !weg.partnerDeckt && !weg.verfuegbarkeit)) {
    gruende.push('Kein Leistungsweg: Werkstatt nicht im Ort oder Landkreis, kein freigeschalteter Partner deckt den Ort ab, keine Verfügbarkeit eingetragen.');
  }
  return gruende;
}

/**
 * Darf die Stadtseite in Suchmaschinen und in der Sitemap erscheinen? Nur mit berechneter Lage ohne
 * Gründe (getCities liefert sie); ohne Lage nie, denn dann ist kein Leistungsweg belegt.
 */
export function stadtIndexierbar(city: CityPage): boolean {
  return !city.seo.noindex && !stadtHatPlatzhalter(city) && city.lage !== undefined && city.lage.gruende.length === 0;
}
