/**
 * Werte aus den Inhalten in eckigen Klammern (etwa „[Hersteller eintragen]“) sind
 * Redaktions-Platzhalter und werden nie als Fakt angezeigt (MENSCHEN M-03).
 */
export function istPlatzhalter(wert: string | null | undefined): boolean {
  return !wert || wert.trim() === '' || wert.trim().startsWith('[');
}
