/*
 * Versand-Adapter (G-24, G-25, A-010): wählt den Anbieter nach Umgebung und Einstellungen.
 * VERSAND_PROVIDER=attrappe für Tests und Probeläufe (G5), =dhl-retoure nur mit Vertrag,
 * Zugangsdaten und Schalter „Retourenlabel aktiv“; sonst der Begleitschein. Fällt DHL aus,
 * bekommt der Kunde den Begleitschein (nie eine leere Seite).
 */

import type { EinsendeEinstellungen } from '../types';

import { begleitschein } from './begleitschein';
import { dhlRetoure, dhlZugang } from './dhl-retoure';
import type { Sendung, VersandAnbieter, Versandschein } from './typen';

export { einsendeAngebot } from './angebot';
export type { Anschrift, Sendung, VersandArt, Versandschein } from './typen';

type Umgebung = Record<string, string | undefined>;

export interface AnbieterWahl {
  einstellungen: EinsendeEinstellungen;
  env?: Umgebung;
  fetchImpl?: typeof fetch;
}

/** Ob ein echtes Retourenlabel möglich ist (Schalter an und Zugang vollständig), oder die Attrappe läuft. */
export function labelEingerichtet({ einstellungen, env = process.env }: AnbieterWahl): boolean {
  const wahl = env.VERSAND_PROVIDER?.trim();
  if (wahl === 'attrappe') return true;
  return wahl === 'dhl-retoure' && einstellungen.labelAktiv && dhlZugang(env) !== null;
}

export function versandAnbieter({ einstellungen, env = process.env, fetchImpl }: AnbieterWahl): VersandAnbieter {
  const wahl = env.VERSAND_PROVIDER?.trim();
  if (wahl === 'attrappe') return begleitschein(einstellungen, { attrappe: true });
  if (wahl === 'dhl-retoure' && einstellungen.labelAktiv) {
    const zugang = dhlZugang(env);
    if (zugang) return dhlRetoure(zugang, fetchImpl);
  }
  return begleitschein(einstellungen);
}

/** Versandschein erzeugen; scheitert das Label, folgt der Begleitschein. */
export async function erstelleVersandschein(sendung: Sendung, wahl: AnbieterWahl): Promise<Versandschein> {
  const anbieter = versandAnbieter(wahl);
  try {
    return await anbieter.erstelle(sendung);
  } catch (error) {
    if (anbieter.name === 'begleitschein') throw error;
    console.error('[versand] Label fehlgeschlagen, Begleitschein folgt', error);
    return begleitschein(wahl.einstellungen).erstelle(sendung);
  }
}
