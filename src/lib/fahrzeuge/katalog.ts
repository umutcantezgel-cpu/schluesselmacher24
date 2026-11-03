/* Fahrzeugkatalog (G-14, G-17, G-18, A-009): Auswahlwerte und Regeln. Reine Funktionen. */

import type { FahrzeugLeistung, FahrzeugReihe, GehaeuseStand, Klonbarkeit, VehicleMake } from '../types';

export const KLONBARKEIT: ReadonlyArray<{ value: Klonbarkeit; label: string }> = [
  { value: 'unbekannt', label: 'Unbekannt' },
  { value: 'bestaetigt', label: 'Bestätigt (Bogen KLONBAR)' },
  { value: 'nein', label: 'Nicht klonbar' },
];

export const GEHAEUSE: ReadonlyArray<{ value: GehaeuseStand; label: string }> = [
  { value: 'unbekannt', label: 'Unbekannt' },
  { value: 'verfuegbar', label: 'Gehäuse lieferbar' },
  { value: 'nicht-verfuegbar', label: 'Kein Gehäuse' },
];

export const LEISTUNGEN: ReadonlyArray<{ value: FahrzeugLeistung; label: string }> = [
  { value: 'nachmachen', label: 'Schlüssel nachmachen' },
  { value: 'programmieren', label: 'Programmieren' },
  { value: 'gehaeuse-tausch', label: 'Gehäuse tauschen' },
  { value: 'transponder-kopie', label: 'Transponder kopieren' },
];

/** Kennung einer Reihe aus Marke und Reihe, etwa „volkswagen-golf“. */
export function reiheKennung(marke: string, reihe: string): string {
  return `${marke} ${reihe}`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Klonbarkeit nur zeigen, wenn der Inhaber sie bestätigt hat (G-18, R4). */
export function klonbarSichtbar(reihe: Pick<FahrzeugReihe, 'klonbar'>): boolean {
  return reihe.klonbar === 'bestaetigt';
}

/** Katalogzeilen aus den gepflegten Modellen des Bestands (Startwert vor dem KBA-Import). */
export function reihenAusBestand(marken: VehicleMake[]): FahrzeugReihe[] {
  return marken.flatMap((marke) =>
    marke.models.map((modell) => {
      const reihe: FahrzeugReihe = {
        id: reiheKennung(marke.name, modell.name),
        marke: marke.name,
        reihe: modell.name,
        quelle: 'Bestand: content/vehicles.json',
        bestandsModell: `${marke.slug}/${modell.slug}`,
        klonbar: 'unbekannt',
        gehaeuse: 'unbekannt',
        leistungen: [],
        sichtbar: true,
      };
      if (typeof modell.yearFrom === 'number') {
        reihe.baujahrVon = modell.yearFrom;
        reihe.baujahrQuelle = 'Bestand: content/vehicles.json';
      }
      return reihe;
    }),
  );
}
