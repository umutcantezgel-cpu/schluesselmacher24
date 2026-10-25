/**
 * Adresse aus einem Namen. Deutsche Umlaute werden umschrieben, übrige
 * Akzente entfernt (Škoda → skoda, Mégane → megane) — sonst fiele der
 * Buchstabe samt Akzent weg („koda“, „m-gane“). Ohne Abhängigkeiten, damit
 * auch der Browser sie nutzen kann (Kategorie- und Herstelleradressen im Shop).
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
