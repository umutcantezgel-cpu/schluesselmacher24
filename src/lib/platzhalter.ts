/**
 * Werte aus den Inhalten in eckigen Klammern (etwa „[Hersteller eintragen]“) sind
 * Redaktions-Platzhalter und werden nie als Fakt angezeigt (MENSCHEN M-03).
 */
export function istPlatzhalter(wert: string | null | undefined): boolean {
  return !wert || wert.trim() === '' || wert.trim().startsWith('[');
}

/**
 * Redaktions-Platzhalter irgendwo im Text, etwa mitten in einem Satz der Stadtseiten
 * („… [Platzhalter: Stadtteile ergänzen] …“). Erkannt werden nur die Muster der
 * Inhalte: „[Platzhalter …]“, „[… eintragen]“, „[… ergänzen]“, „[PLZ]“ und „[Ort]“.
 * Andere eckige Klammern („Serie [2]“) bleiben Text.
 */
export function enthaeltPlatzhalter(text: string | null | undefined): boolean {
  if (!text) return false;
  return /\[(?:Platzhalter\b[^\]]*|[^\]]*\b(?:eintragen|ergänzen)|PLZ|Ort)\]/.test(text);
}
