import type { ShopHersteller } from '@/lib/types';

/**
 * Startbestand der Hersteller-Stammliste: leer. Der Bestand belegt keinen
 * Hersteller (alle Codelinien tragen den Platzhalter, Zylinderkatalog und
 * Artikel nennen keinen); erfunden wird keiner (R4). Der Betrieb legt die
 * Hersteller im Backend an (Sammlung „Hersteller“); ohne Datenbank gilt
 * `content/hersteller.json`.
 */
export function hersteller(): ShopHersteller[] {
  return [];
}
