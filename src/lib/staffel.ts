/**
 * Mengenstaffeln werden als Rabatt in Prozent gepflegt. So folgen alle
 * Staffelpreise automatisch, wenn der Betreiber den Grundpreis ändert.
 */

/** Staffelpreis in Cent aus Grundpreis und Rabatt. */
export function staffelPreis(grundCents: number, rabattProzent: number): number {
  return Math.round((grundCents * (100 - rabattProzent)) / 100);
}

/**
 * Rabatt, der aus dem Grundpreis exakt den bisherigen Staffelpreis ergibt —
 * mit so wenigen Nachkommastellen wie möglich. Für die Übernahme alter Daten.
 */
export function rabattAusPreis(grundCents: number, staffelCents: number): number {
  if (grundCents <= 0) return 0;
  const genau = (1 - staffelCents / grundCents) * 100;
  for (let stellen = 0; stellen <= 6; stellen += 1) {
    const faktor = 10 ** stellen;
    const kandidat = Math.round(genau * faktor) / faktor;
    if (staffelPreis(grundCents, kandidat) === staffelCents) return kandidat;
  }
  return genau;
}
