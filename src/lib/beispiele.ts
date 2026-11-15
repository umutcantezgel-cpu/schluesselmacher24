/*
 * Beispiel-Einträge (A-046, FA-SOFORT-04): Codelinien und Standardartikel mit `example: true` sind
 * Musterdaten für Tests und lokale Entwicklung. Auf der öffentlichen Seite erscheinen sie nie:
 * nicht in Listen, Kategorien, Hersteller- und Detailseiten, Suche, Sitemap, llms.txt,
 * Strukturdaten, Warenkorb und Bestellung. Die Regel greift an einer Stelle, in der Datenschicht
 * (`getCollection` in src/lib/data/index.ts).
 *
 * Sichtbar werden sie nur mit `SM24_BEISPIELE=1`. Das setzen allein die Testkonfigurationen
 * (vitest.config.ts, vitest.db.config.ts), nie der Build und nie die Datenweiche. Der Seed legt
 * Beispiel-Einträge unabhängig davon nie in einer Datenbank an.
 *
 * Reine Funktionen ohne Server-Abhängigkeiten.
 */

/** Sind Beispiel-Einträge sichtbar? Nur wenn `SM24_BEISPIELE` genau `1` ist. */
export function beispieleSichtbar(env: Record<string, string | undefined> = process.env): boolean {
  return env.SM24_BEISPIELE === '1';
}

/** Ist dieser Eintrag ein Beispiel (Codelinie oder Standardartikel)? */
export function istBeispiel(eintrag: { example?: boolean | null }): boolean {
  return eintrag.example === true;
}

/** Ohne Beispiel-Einträge. */
export function ohneBeispiele<T extends { example?: boolean | null }>(eintraege: readonly T[]): T[] {
  return eintraege.filter((eintrag) => !istBeispiel(eintrag));
}

/** Was die öffentliche Seite sieht: ohne Beispiele, außer `SM24_BEISPIELE=1` ist gesetzt. */
export function oeffentlicheEintraege<T extends { example?: boolean | null }>(
  eintraege: readonly T[],
  env: Record<string, string | undefined> = process.env,
): T[] {
  return beispieleSichtbar(env) ? [...eintraege] : ohneBeispiele(eintraege);
}
