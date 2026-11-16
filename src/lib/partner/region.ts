/*
 * Region der Partnerbetriebe (FA-PLATTFORM-01B, FA-22-40): Welche freigeschalteten Partner decken eine
 * Postleitzahl für eine Leistung ab?
 *
 * Ausgewertet werden der Stand (nur „freigeschaltet“; pausiert, gesperrt, beendet und alles in Prüfung
 * fallen heraus), die Leistungen (`decktAuftragsart`) und die Postleitzahlen-Muster des Einsatzgebiets
 * (`plzPasst`). Den Umkreis wertet die Funktion nicht aus: Zur Postleitzahl gibt es noch keine Geodaten
 * (kommt mit der Ortsdatenbasis, FA-PLATTFORM-03). Ohne Postleitzahlen deckt ein Partner nichts ab.
 * Die Zuordnung zu Orten und Landkreisen am Partnerbetrieb ist bis dahin nur Dokumentation.
 *
 * Anders als `passendePartner` (src/lib/auftragsweg.ts, Partnerweg für Kunden) zählt hier das
 * Abrechnungsmodell nicht: Die Funktion beantwortet die Frage des Teams nach der Abdeckung.
 *
 * Reine Funktion, nur relative Importe.
 */

import { plzMusterAusText, plzPasst } from '../auftragsweg';

import type { BewerbungStatus } from './bewerbung';
import { AUFTRAGSART_OPTIONEN, auftragsartFuerLeistung } from './leistungen';
import { darfVermitteln } from './vermittlung';

const AUFTRAGSARTEN = new Set(AUFTRAGSART_OPTIONEN.map((o) => o.value));

export interface PartnerFuerRegion {
  id: string;
  status: BewerbungStatus;
  /** Einsatzgebiet als Text wie im Admin („35*, 36043“) oder schon als Muster. */
  postleitzahlen: string | readonly string[] | null | undefined;
  auftragsarten: readonly string[] | null | undefined;
}

/**
 * Freigeschaltete Partner, die die Postleitzahl für diese Leistung abdecken. `leistung` ist eine der neun
 * Leistungen des Netzes, der Sammelwert, ein früherer Wert oder eine Leistung des Assistenten (`serviceId`, wird zugeordnet).
 */
export function deckendePartner<T extends PartnerFuerRegion>(postleitzahl: string, leistung: string, partner: readonly T[]): T[] {
  const art = AUFTRAGSARTEN.has(leistung) ? leistung : auftragsartFuerLeistung(leistung);
  return partner.filter((p) => {
    const muster = typeof p.postleitzahlen === 'string' || !p.postleitzahlen ? plzMusterAusText(p.postleitzahlen as string | null | undefined) : [...p.postleitzahlen];
    return darfVermitteln({ status: p.status, auftragsarten: [...(p.auftragsarten ?? [])] }, art) && plzPasst(postleitzahl, muster);
  });
}
