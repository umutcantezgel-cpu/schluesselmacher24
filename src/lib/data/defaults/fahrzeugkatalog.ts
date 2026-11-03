import { reihenAusBestand } from '../../fahrzeuge/katalog';
import type { FahrzeugReihe } from '../../types';

import { vehicleMakes } from './vehicles';

/** Ohne Datenbank und ohne content/fahrzeugkatalog.json: die gepflegten Modelle des Bestands (A-009). */
export function fahrzeugkatalog(): FahrzeugReihe[] {
  return reihenAusBestand(vehicleMakes());
}
