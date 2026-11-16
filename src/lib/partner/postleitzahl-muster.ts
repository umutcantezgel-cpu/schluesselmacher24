/*
 * Postleitzahlen-Muster (FA-KERN-03, FA-PLATTFORM-01C): Einsatzgebiet und Eigenbereich als Text wie im Admin
 * („35*, 36043“) und der Vergleich mit einer vollständigen Postleitzahl.
 *
 * Eigenes Modul, damit src/lib/partner/region.ts (Definition der Abdeckung) und src/lib/auftragsweg.ts (Weg und
 * Zahlung) einander nicht gegenseitig importieren. src/lib/auftragsweg.ts gibt beide Funktionen unverändert weiter.
 *
 * Reine Funktionen, keine Importe.
 */

/** „35*, 36043 ,355*“ → `['35*', '36043', '355*']`; nur Ziffern mit optionalem `*` am Ende. */
export function plzMusterAusText(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\s,;]+/)
    .map((teil) => teil.trim())
    .filter((teil) => /^\d{1,5}\*?$/.test(teil));
}

/** Passt eine vollständige deutsche Postleitzahl zu einem der Muster? */
export function plzPasst(postleitzahl: string, muster: readonly string[]): boolean {
  const plz = postleitzahl.trim();
  if (!/^\d{5}$/.test(plz)) return false;
  return muster.some((m) => (m.endsWith('*') ? plz.startsWith(m.slice(0, -1)) : plz === m));
}
