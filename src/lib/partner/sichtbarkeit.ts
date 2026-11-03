/*
 * Was ein Partner von einem vermittelten Auftrag sehen darf (Zugriffsrechte, Datenminimierung):
 * nur Vorgänge, die ihm vermittelt und von ihm angenommen sind, und davon nur die Angaben für die
 * Ausführung. Nie Zahlungsdaten, interne Notizen, Provisionen oder andere Partner.
 */

import type { BusinessRecord } from '../types';

export const PARTNER_SICHTBARE_STATUS = ['partner-angefragt', 'angenommen', 'erledigt'] as const;

export function partnerSiehtVorgang(partnerId: string, vorgang: Pick<BusinessRecord, 'referral'>): boolean {
  const r = vorgang.referral;
  return Boolean(r && r.partnerId === partnerId && (PARTNER_SICHTBARE_STATUS as readonly string[]).includes(r.status ?? ''));
}

export interface PartnerAuftrag {
  nummer: string;
  bereich: string;
  angaben: Array<{ titel?: string; zeilen: Array<{ label: string; value: string }> }>;
  kontakt: { name: string; telefon?: string; anschrift: string };
  termin?: { datum: string; zeit: string };
}

/** Auszug für den Partner: Kontaktdaten erst ab „angenommen“ (vorher nur Ort und Leistung). */
export function partnerAuszug(vorgang: BusinessRecord): PartnerAuftrag {
  const k = vorgang.contact;
  const angenommen = vorgang.referral?.status === 'angenommen' || vorgang.referral?.status === 'erledigt';
  const ort = [k.postalCode, k.city].filter(Boolean).join(' ');
  return {
    nummer: vorgang.reference,
    bereich: vorgang.area,
    angaben: vorgang.summary.map((s) => ({ ...(s.title ? { titel: s.title } : {}), zeilen: s.rows.map((r) => ({ label: r.label, value: r.value })) })),
    kontakt: angenommen
      ? { name: [k.firstName, k.lastName].filter(Boolean).join(' '), ...(k.phone ? { telefon: k.phone } : {}), anschrift: [k.street, ort].filter(Boolean).join(', ') }
      : { name: '', anschrift: ort },
    ...(vorgang.appointment ? { termin: { datum: vorgang.appointment.date, zeit: vorgang.appointment.time } } : {}),
  };
}
