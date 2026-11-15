/* ==========================================================================
   Breite eines Seitentitels im Suchergebnis (FA-SEO-01B, FA-25)

   Die Projektgrenze für Titel ist eine Breite: höchstens 580 px in 20px Arial,
   gemessen wie in `_werkstatt/ausbau/werkzeuge/snippet.mjs` und `onpage.mjs`
   (canvas.measureText). Daneben gilt der Rückfall von 60 Zeichen.

   Die Generatoren (Marken, Modelle, Codelinien) wählen ihren Titel danach,
   ohne Browser: Hier stehen die Vorschubbreiten von Arial in Tausendstel der
   Schriftgröße. Unterschneidung bleibt unberücksichtigt; sie macht Text nur
   schmaler. Die Summe ist darum eine obere Schranke der gemessenen Breite
   (gegengeprüft mit Chromium, Abweichung höchstens 4 px nach unten).
   Unbekannte Zeichen zählen mit voller Geviertbreite.
   ========================================================================== */

/** Markenzusatz der Titelvorlage im Wurzel-Layout („%s | SCHLÜSSELMACHER24“). */
export const MARKENZUSATZ = ' | SCHLÜSSELMACHER24';
/** Höchstbreite des fertigen Titels in Pixel (20px Arial). */
export const TITEL_MAX_PX = 580;
/** Höchstlänge des fertigen Titels in Zeichen (Rückfall ohne Messung). */
export const TITEL_MAX_ZEICHEN = 60;

const SCHRIFTGROESSE = 20;

/** Vorschubbreiten von Arial in 1/1000 em. */
const BREITEN: Readonly<Record<string, number>> = {
  ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191, '(': 333, ')': 333,
  '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278, ':': 278, ';': 278, '<': 584, '=': 584,
  '>': 584, '?': 556, '@': 1015, '[': 278, '\\': 278, ']': 278, '^': 469, _: 556, '`': 333, '{': 334,
  '|': 260, '}': 334, '~': 584,
  0: 556, 1: 556, 2: 556, 3: 556, 4: 556, 5: 556, 6: 556, 7: 556, 8: 556, 9: 556,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833,
  N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  ä: 556, ö: 556, ü: 556, Ä: 667, Ö: 778, Ü: 722, ß: 611,
  à: 556, á: 556, â: 556, ç: 500, è: 556, é: 556, ê: 556, ë: 556, í: 278, ï: 278, ñ: 556, ó: 556, ú: 556,
  ÿ: 500, Á: 667, É: 667, Í: 278, Ó: 778, Ú: 722, Č: 722, č: 500, Ř: 722, ř: 333, Š: 667, š: 500,
  Ž: 611, ž: 500, æ: 889, œ: 944,
  '„': 333, '“': 333, '”': 333, '‚': 222, '‘': 222, '’': 222, '–': 556, '—': 1000, '…': 1000, '€': 556,
  '·': 333, '•': 350, '°': 400, ' ': 278,
};

/** Breite eines Textes in Pixel bei 20px Arial (obere Schranke, siehe oben). */
export function titelBreitePx(text: string): number {
  let summe = 0;
  for (const zeichen of text) summe += BREITEN[zeichen] ?? 1000;
  return (summe * SCHRIFTGROESSE) / 1000;
}

/** Der Titel, wie er im Kopf der Seite steht: mit Markenzusatz der Vorlage. */
export function fertigerTitel(titel: string): string {
  return `${titel}${MARKENZUSATZ}`;
}

/** Passt der Titel samt Markenzusatz in 580 px und 60 Zeichen? */
export function titelPasst(titel: string): boolean {
  const fertig = fertigerTitel(titel);
  return [...fertig].length <= TITEL_MAX_ZEICHEN && titelBreitePx(fertig) <= TITEL_MAX_PX;
}
