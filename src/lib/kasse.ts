import type { CartItem } from '@/lib/types';

/* Regeln der Kasse, gemeinsam für Formular (Browser) und Server. */

/** Lieferung nur innerhalb Deutschlands (Versandpreise und 19 % USt. gelten nur hier). */
export const LIEFERLAND = 'Deutschland';

/**
 * Anfertigung nach Kundenangaben — Schlüssel nach Code und gleichschließende
 * Zylinder. Für sie besteht kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB);
 * Standardartikel sind vorgefertigt.
 */
export function istSonderanfertigung(item: Pick<CartItem, 'kind'>): boolean {
  return item.kind === 'code-schluessel' || item.kind === 'zylinder-schliessung';
}
