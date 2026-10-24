import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import type { CityPage } from '@/lib/types';

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

/** Darf die Stadtseite in Suchmaschinen und in der Sitemap erscheinen? */
export function stadtIndexierbar(city: CityPage): boolean {
  return !city.seo.noindex && !stadtHatPlatzhalter(city);
}
