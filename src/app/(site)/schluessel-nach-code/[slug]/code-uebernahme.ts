import { codePasst } from '@/lib/code-pattern';

/** Höchstlänge eines Codes, der über die Adresse übernommen wird. */
export const CODE_UEBERNAHME_MAX = 40;

/**
 * Bereinigt eine Eingabe für die Adresse: ohne Leerraum am Rand, höchstens
 * 40 Zeichen. Leer oder zu lang ergibt `null`.
 */
export function codeFuerAdresse(eingabe: string): string | null {
  const code = eingabe.trim();
  if (code === '' || code.length > CODE_UEBERNAHME_MAX) return null;
  return code;
}

/**
 * Adresse der Produktseite mit übernommenem Code, etwa
 * `/schluessel-nach-code/<slug>?code=C214`. `null`, wenn der Code nicht übernommen werden kann.
 */
export function nachCodeHref(slug: string, eingabe: string): string | null {
  const code = codeFuerAdresse(eingabe);
  if (code === null) return null;
  return `/schluessel-nach-code/${slug}?code=${encodeURIComponent(code)}`;
}

/**
 * Übernimmt den Parameter `code` nur, wenn er zum Codeformat der Linie passt.
 * Wie im Bestellformular gilt die Großschreibung, wenn sie zum Muster passt.
 * Alles andere wird verworfen und ergibt `null`.
 */
export function codeAusAdresse(wert: string | null | undefined, codePattern: string): string | null {
  if (typeof wert !== 'string') return null;
  const code = codeFuerAdresse(wert);
  if (code === null) return null;
  if (codePasst(codePattern, code)) return code;
  const gross = code.toUpperCase();
  return codePasst(codePattern, gross) ? gross : null;
}
