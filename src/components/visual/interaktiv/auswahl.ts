/**
 * Reine Helfer der interaktiven Grafiken: Texte für Screenreader und die
 * Tastaturbedienung von Registerkarten. Ohne React, damit sie testbar sind.
 */

export interface PlanSchluessel {
  kennung: string;
  kuerzel: string;
  tueren: string[];
}

/** „t3“ → „Tür 3“, „z1“ → „Zentraltür 1“. */
export function tuerName(kennung: string): string {
  const treffer = /^([tz])(\d+)$/.exec(kennung);
  if (!treffer) return kennung;
  return `${treffer[1] === 'z' ? 'Zentraltür' : 'Tür'} ${treffer[2]}`;
}

/** Aufzählung mit „und“ vor dem letzten Glied. */
export function aufzaehlung(teile: string[]): string {
  if (teile.length <= 1) return teile.join('');
  return `${teile.slice(0, -1).join(', ')} und ${teile[teile.length - 1]}`;
}

/** „HGS 1 schließt 2 Türen: Tür 1 und Tür 2.“ */
export function schliessBeschreibung(schluessel: PlanSchluessel): string {
  const anzahl = schluessel.tueren.length;
  const namen = aufzaehlung(schluessel.tueren.map(tuerName));
  return `${schluessel.kuerzel} schließt ${anzahl} ${anzahl === 1 ? 'Tür' : 'Türen'}: ${namen}.`;
}

/** Alle Schlüssel, die eine Tür öffnen. */
export function oeffnendeSchluessel(alle: PlanSchluessel[], tuer: string): PlanSchluessel[] {
  return alle.filter((s) => s.tueren.includes(tuer));
}

/** „Tür 3 öffnen: HS und ES 3.“ */
export function tuerBeschreibung(alle: PlanSchluessel[], tuer: string): string {
  const schluessel = oeffnendeSchluessel(alle, tuer).map((s) => s.kuerzel);
  if (schluessel.length === 0) return `${tuerName(tuer)}: kein Schlüssel im Plan.`;
  return `${tuerName(tuer)} öffnen: ${aufzaehlung(schluessel)}.`;
}

/** Alle Türkennungen des Plans in Reihenfolge (Zentraltüren zuerst). */
export function alleTueren(alle: PlanSchluessel[]): string[] {
  const menge = new Set(alle.flatMap((s) => s.tueren));
  return [...menge].sort((a, b) => {
    if (a[0] !== b[0]) return a[0] === 'z' ? -1 : 1;
    return Number(a.slice(1)) - Number(b.slice(1));
  });
}

/**
 * Nächste Registerkarte nach WAI-ARIA-Muster: Pfeile wandern ringsum,
 * Pos1/Ende springen an den Rand. Andere Tasten ergeben `null`.
 */
export function naechsterIndex(index: number, taste: string, anzahl: number): number | null {
  if (anzahl <= 0) return null;
  switch (taste) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % anzahl;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index - 1 + anzahl) % anzahl;
    case 'Home':
      return 0;
    case 'End':
      return anzahl - 1;
    default:
      return null;
  }
}
