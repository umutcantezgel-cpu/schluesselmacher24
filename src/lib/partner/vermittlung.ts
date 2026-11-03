/*
 * Vermittlung eines Auftrags an einen Partner (G-40): Zustände wie im Bestand (Gruppe
 * `vermittlung` der Vorgänge), erlaubte Wechsel, Vermittlung nur an freigeschaltete Partner mit
 * passender Auftragsart. Reine Funktionen.
 */

import type { ReferralStatus } from '../types';

import type { BewerbungStatus } from './bewerbung';

export const VERMITTLUNG_UEBERGAENGE: Readonly<Record<ReferralStatus, readonly ReferralStatus[]>> = {
  neu: ['geprueft'],
  geprueft: ['partner-angefragt', 'neu'],
  'partner-angefragt': ['angenommen', 'geprueft'],
  angenommen: ['erledigt', 'geprueft'],
  erledigt: ['provision-abgerechnet'],
  'provision-abgerechnet': [],
};

export function vermittlungWechselErlaubt(von: ReferralStatus | undefined, nach: ReferralStatus): boolean {
  if (!von) return nach === 'neu';
  return von === nach || VERMITTLUNG_UEBERGAENGE[von].includes(nach);
}

export interface PartnerKurz {
  status: BewerbungStatus;
  auftragsarten: string[];
}

/** Ob ein Partner diesen Auftrag bekommen darf (MA-16: nur freigeschaltet, nur passende Art). */
export function darfVermitteln(partner: PartnerKurz, auftragsart: string): boolean {
  return partner.status === 'freigeschaltet' && partner.auftragsarten.includes(auftragsart);
}
