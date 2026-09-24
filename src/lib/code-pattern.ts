/**
 * Prüfmuster für Schlüsselcodes, die der Betreiber im Backend pflegt.
 *
 * Ein fehlerhaftes Muster würde sonst erst beim Kunden auffallen — oder die
 * Seite mit einem sehr langsamen Muster lahmlegen. Deshalb gelten beim
 * Speichern feste Regeln.
 */

export const MAX_MUSTER_LAENGE = 120;

/** Gruppe mit Wiederholung darin, die selbst wiederholt wird: `(a+)+`, `(\d*){2,}`. */
const VERSCHACHTELTE_WIEDERHOLUNG = /\((?:[^()\\]|\\.)*(?:[+*]|\{\d+,\d*\})(?:[^()\\]|\\.)*\)(?:[+*]|\{\d+,\d*\})/;

/** Rückverweise wie `\1` oder `\k<name>`. */
const RUECKVERWEIS = /\\(?:[1-9]|k<)/;

export function pruefeCodeMuster(muster: unknown): true | string {
  if (typeof muster !== 'string' || !muster.trim()) return 'Bitte ein Prüfmuster eintragen.';
  if (muster.length > MAX_MUSTER_LAENGE) {
    return `Das Prüfmuster ist zu lang (höchstens ${MAX_MUSTER_LAENGE} Zeichen).`;
  }
  if (!muster.startsWith('^') || !muster.endsWith('$')) {
    return 'Das Prüfmuster muss mit ^ beginnen und mit $ enden, damit der ganze Code geprüft wird.';
  }
  if (VERSCHACHTELTE_WIEDERHOLUNG.test(muster)) {
    return 'Verschachtelte Wiederholungen wie (a+)+ sind nicht erlaubt — sie können die Seite verlangsamen.';
  }
  if (RUECKVERWEIS.test(muster)) return 'Rückverweise wie \\1 sind nicht erlaubt.';
  try {
    new RegExp(muster);
  } catch {
    return 'Das Prüfmuster ist fehlerhaft. Bitte die Schreibweise prüfen.';
  }
  return true;
}

/** Prüft einen Code gegen ein gespeichertes Muster; fehlerhafte Muster lehnen ab. */
export function codePasst(muster: string, code: string): boolean {
  if (pruefeCodeMuster(muster) !== true) return false;
  try {
    return new RegExp(muster).test(code);
  } catch {
    return false;
  }
}
