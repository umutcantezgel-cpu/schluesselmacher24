/**
 * Schriftfeld der Ortsseite: Kurze Werte mit Ziffern („35 km“, „ab 9 Uhr“) bleiben in einer Zeile.
 * Längere Werte mit Ziffern, etwa eine Anschrift, dürfen umbrechen. Ohne das lief „Langgasse 61,
 * 35576 Wetzlar“ bei jeder Fensterbreite über die eigene Zelle hinaus in die Nachbarzelle
 * (Sichtprobe der Abnahme von FA-PLATTFORM-03B; die Zellen sind 137 bis 180 px breit).
 */
export const ANGABE_EINZEILIG_BIS = 14;

export function angabeEinzeilig(wert: string): boolean {
  const text = wert.trim();
  return /\d/.test(text) && text.length <= ANGABE_EINZEILIG_BIS;
}

/**
 * Spalten des Schriftfelds ab 640 px: so viele wie Angaben, höchstens vier. Darunter bleiben es zwei.
 * Die Klassen stehen ausgeschrieben, damit Tailwind sie findet.
 */
const SPALTEN: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

export function angabenSpalten(anzahl: number): string {
  return SPALTEN[Math.min(Math.max(Math.trunc(anzahl) || 1, 1), 4)];
}
