/*
 * Vermittlung eines Auftrags an einen Partner (G-40, FA-KERN-04, A-049): Stände in der Reihenfolge des
 * Inhabers von „an Partner vermittelt“ bis „ausgezahlt“, erlaubte Wechsel, Prüfung jedes Wechsels,
 * Auszahlungsstand und Beträge. Vermittlung nur an freigeschaltete Partner mit passender Auftragsart.
 * Reine Funktionen; erzwungen werden sie am Vorgang vom Hook `vermittlungVorAenderung`.
 */

import { formatCents, formatDateTime } from '../format';
import type { BusinessRecord, PaymentInfo, PayoutStatus, ReferralStatus } from '../types';

import { abrechnen, type Abrechnungsmodell, type Provision } from './abrechnung';
import type { BewerbungStatus } from './bewerbung';
import { decktAuftragsart } from './leistungen';

/** Erlaubte Wechsel. Ein Schritt zurück auf „geprüft“ geht bis zur Ausführung (anderer Partner). */
export const VERMITTLUNG_UEBERGAENGE: Readonly<Record<ReferralStatus, readonly ReferralStatus[]>> = {
  neu: ['geprueft'],
  geprueft: ['partner-angefragt', 'neu'],
  'partner-angefragt': ['angenommen', 'geprueft'],
  // Direkt auf „ausgeführt“ bleibt nur ohne zentrale Zahlung erlaubt (Modell A, Bestand). Bei zentraler
  // Zahlung verlangt `vermittlungsWechselPruefen` vorher „Termin bestätigt“ (Reihenfolge des Inhabers).
  angenommen: ['termin-bestaetigt', 'erledigt', 'geprueft'],
  'termin-bestaetigt': ['erledigt', 'geprueft'],
  erledigt: ['kunde-bestaetigt', 'auszahlung-freigegeben', 'provision-abgerechnet'],
  'kunde-bestaetigt': ['auszahlung-freigegeben'],
  'auszahlung-freigegeben': ['ausgezahlt'],
  ausgezahlt: [],
  'provision-abgerechnet': [],
};

/** Anzeige im Admin, Wortlaut des Inhabers (Arbeitsanweisung Abschnitt 05). */
export const VERMITTLUNG_LABEL: Readonly<Record<ReferralStatus, string>> = {
  neu: 'neu',
  geprueft: 'geprüft',
  'partner-angefragt': 'an Partner vermittelt',
  angenommen: 'vom Partner angenommen',
  'termin-bestaetigt': 'Termin bestätigt',
  erledigt: 'ausgeführt',
  'kunde-bestaetigt': 'Kunde bestätigt',
  'auszahlung-freigegeben': 'zur Auszahlung freigegeben',
  ausgezahlt: 'ausgezahlt',
  'provision-abgerechnet': 'Provision abgerechnet (Modell A)',
};

export const VERMITTLUNG_STAENDE = Object.keys(VERMITTLUNG_UEBERGAENGE) as ReferralStatus[];

export function istVermittlungsStand(wert: unknown): wert is ReferralStatus {
  return typeof wert === 'string' && (VERMITTLUNG_STAENDE as string[]).includes(wert);
}

export function vermittlungWechselErlaubt(von: ReferralStatus | undefined, nach: ReferralStatus): boolean {
  if (!von) return nach === 'neu';
  return von === nach || VERMITTLUNG_UEBERGAENGE[von].includes(nach);
}

export interface PartnerKurz {
  status: BewerbungStatus;
  auftragsarten: string[];
}

/**
 * Ob ein Partner diesen Auftrag bekommen darf (MA-16: nur freigeschaltet, nicht pausiert, nur passende Art).
 * Den Sammelwert „Autoschlüssel allgemein“ (`autoschluessel-vor-ort`) deckt jede der neun Leistungen ab (FA-PLATTFORM-01).
 */
export function darfVermitteln(partner: PartnerKurz, auftragsart: string): boolean {
  return partner.status === 'freigeschaltet' && decktAuftragsart(partner.auftragsarten, auftragsart);
}

/** Zahlung eingegangen, auch wenn danach ein Teil erstattet wurde. */
export function zahlungEingegangen(status: PaymentInfo['status'] | null | undefined): boolean {
  return status === 'bezahlt' || status === 'teilweise-erstattet';
}

/** Zahlungsstand nach einer Erstattung (ganz oder teilweise). */
export function erstattungsStand(zahlungsstand: PaymentInfo['status'] | null | undefined): boolean {
  return zahlungsstand === 'erstattet' || zahlungsstand === 'teilweise-erstattet';
}

/**
 * Zum Vorgang ist eine Erstattung erfasst (ganz oder teilweise): Die Auszahlung an den Partner ist gesperrt.
 * Maßgeblich ist der Zahlungsstand oder ein erstatteter Betrag; so bleibt die Sperre auch dann, wenn der
 * Zahlungsstand später geändert würde.
 */
export function auszahlungGesperrt(zahlungsstand: PaymentInfo['status'] | null | undefined, erstattetCents?: number | null): boolean {
  return erstattungsStand(zahlungsstand) || (typeof erstattetCents === 'number' && erstattetCents > 0);
}

/* ---------- Meldungen ---------------------------------------------------- */

export const MELDUNG = {
  nichtDirekt: (von: ReferralStatus | undefined, nach: ReferralStatus) =>
    `Von „${von ? VERMITTLUNG_LABEL[von] : 'leer'}“ nach „${VERMITTLUNG_LABEL[nach]}“ geht es nicht direkt.`,
  ohneZahlung: 'An den Partner vermitteln geht erst, wenn der Gesamtbetrag bezahlt ist.',
  ohnePartner: 'Bitte zuerst den Partnerbetrieb wählen.',
  ohneAuftragsart: 'Bitte die Auftragsart der Vermittlung wählen.',
  partnerGesperrt: 'Dieser Partnerbetrieb ist nicht freigeschaltet, ist pausiert oder übernimmt diese Auftragsart nicht.',
  ohneBetraege: 'Bitte Gesamtbetrag und Plattformanteil eintragen. Sie werden mit „ausgeführt“ festgeschrieben.',
  nurKunde: 'Den Stand „Kunde bestätigt“ setzt nur der Kunde über seinen Link.',
  ohneGrund:
    'Ohne Bestätigung des Kunden geht die Freigabe nur mit einem Grund im Feld „Bestätigung durch das Team“.',
  gesperrt: 'Die Auszahlung ist gesperrt, weil zu diesem Auftrag eine Erstattung erfasst ist.',
  festgeschrieben: 'Gesamtbetrag und Plattformanteil sind seit „ausgeführt“ festgeschrieben.',
  ohneTermin: 'Bitte zuerst „Termin bestätigt“ setzen. Danach geht „ausgeführt“.',
  anteilZuHoch: 'Der Plattformanteil darf nicht höher sein als der Gesamtbetrag.',
} as const;

/* ---------- Prüfung eines Wechsels -------------------------------------- */

export interface VermittlungsWechsel {
  von: ReferralStatus | undefined;
  nach: ReferralStatus;
  /** Gesamtbetrag zentral über Schlüsselmacher24 (Partnerweg oder Modell B). */
  zentraleZahlung: boolean;
  zahlung?: Pick<PaymentInfo, 'status' | 'scope'> | null;
  /** Summe der erfassten Erstattungen in Cent; mehr als null sperrt die Auszahlung. */
  erstattetCents?: number | null;
  /** Gewählter Partnerbetrieb, frisch aus der Datenbank; `null` ohne Auswahl. */
  partner: PartnerKurz | null;
  auftragsart?: string | null;
  gesamtCents?: number | null;
  plattformanteilCents?: number | null;
  /** Grund für die Bestätigung durch das Team (statt des Kunden). */
  teamGrund?: string | null;
  /** Wechsel kommt vom Kunden (Link), nicht vom Team. */
  durchKunde?: boolean;
}

/** Meldung, wenn der Wechsel nicht erlaubt ist, sonst `null`. */
export function vermittlungsWechselPruefen(w: VermittlungsWechsel): string | null {
  if (w.von === w.nach) return null;
  if (!vermittlungWechselErlaubt(w.von, w.nach)) return MELDUNG.nichtDirekt(w.von, w.nach);
  const gesperrt = auszahlungGesperrt(w.zahlung?.status, w.erstattetCents);
  switch (w.nach) {
    case 'partner-angefragt': {
      if (w.zentraleZahlung && !(w.zahlung?.status === 'bezahlt' && w.zahlung.scope === 'gesamt')) return MELDUNG.ohneZahlung;
      if (!w.partner) return MELDUNG.ohnePartner;
      if (!w.auftragsart) return MELDUNG.ohneAuftragsart;
      if (!darfVermitteln(w.partner, w.auftragsart)) return MELDUNG.partnerGesperrt;
      return null;
    }
    case 'angenommen':
    case 'termin-bestaetigt': {
      // Pausiert oder gesperrt, während der Auftrag läuft: nicht weiterführen, sondern neu vermitteln.
      if (w.partner && w.auftragsart && !darfVermitteln(w.partner, w.auftragsart)) return MELDUNG.partnerGesperrt;
      return null;
    }
    case 'erledigt': {
      if (w.zentraleZahlung && w.von === 'angenommen') return MELDUNG.ohneTermin;
      if (w.zentraleZahlung && (typeof w.gesamtCents !== 'number' || typeof w.plattformanteilCents !== 'number')) {
        return MELDUNG.ohneBetraege;
      }
      return null;
    }
    case 'kunde-bestaetigt':
      return w.durchKunde ? null : MELDUNG.nurKunde;
    case 'auszahlung-freigegeben': {
      if (gesperrt) return MELDUNG.gesperrt;
      if (w.von === 'erledigt' && !(w.teamGrund ?? '').trim()) return MELDUNG.ohneGrund;
      if (typeof w.gesamtCents !== 'number' || typeof w.plattformanteilCents !== 'number') return MELDUNG.ohneBetraege;
      return null;
    }
    case 'ausgezahlt':
      return gesperrt ? MELDUNG.gesperrt : null;
    default:
      return null;
  }
}

/* ---------- Auszahlungsstand -------------------------------------------- */

export const VOR_DER_FREIGABE: readonly ReferralStatus[] = ['partner-angefragt', 'angenommen', 'termin-bestaetigt', 'erledigt', 'kunde-bestaetigt'];

/**
 * Auszahlungsstand aus dem Stand der Vermittlung und dem Zahlungsstand. Nur bei zentraler Zahlung; ohne
 * Vermittlung `undefined`. Eine erfasste Erstattung sperrt jede Auszahlung, die noch nicht erfolgt ist.
 */
export function auszahlungsStand(
  status: ReferralStatus | null | undefined,
  zahlungsstand: PaymentInfo['status'] | null | undefined,
  zentraleZahlung: boolean,
  erstattetCents?: number | null,
): PayoutStatus | undefined {
  if (!status || !zentraleZahlung) return undefined;
  if (status === 'ausgezahlt') return 'ausgezahlt';
  if (auszahlungGesperrt(zahlungsstand, erstattetCents) && (status === 'auszahlung-freigegeben' || VOR_DER_FREIGABE.includes(status))) return 'gesperrt';
  if (status === 'auszahlung-freigegeben') return 'freigegeben';
  if (VOR_DER_FREIGABE.includes(status)) return 'offen';
  return undefined;
}

export const AUSZAHLUNG_LABEL: Readonly<Record<PayoutStatus, string>> = {
  offen: 'offen',
  freigegeben: 'freigegeben',
  ausgezahlt: 'ausgezahlt',
  gesperrt: 'gesperrt (Erstattung)',
};

/* ---------- Beträge ------------------------------------------------------ */

/** Partnerbetrag: Gesamtbetrag minus Plattformanteil, nie unter null; ohne beide Werte `undefined`. */
export function partnerbetragCents(gesamtCents: number | null | undefined, plattformanteilCents: number | null | undefined): number | undefined {
  if (typeof gesamtCents !== 'number' || typeof plattformanteilCents !== 'number') return undefined;
  return Math.max(0, Math.round(gesamtCents) - Math.round(plattformanteilCents));
}

/**
 * Vorschlag für den Plattformanteil aus der Provision des Partnerbetriebs (`abrechnen()`). Provisionssätze
 * stehen nur in der Datenbank (G13). Ohne hinterlegte Provision gibt es keinen Betrag, sondern einen Hinweis.
 */
export function plattformanteilVorschlag(eingabe: {
  modell: Abrechnungsmodell;
  gesamtCents: number;
  provision: Provision | undefined;
  modellBFreigegeben: boolean;
}): { cents: number } | { hinweis: string } {
  const ergebnis = abrechnen({
    modell: eingabe.modell,
    auftragswertCents: eingabe.gesamtCents,
    provision: eingabe.provision,
    modellBFreigegeben: eingabe.modellBFreigegeben,
  });
  if ('fehlt' in ergebnis) return { hinweis: ergebnis.fehlt };
  return { cents: ergebnis.modell === 'B' ? ergebnis.einbehaltCents : ergebnis.provisionCents };
}

/* ---------- Zeilen für Vorgangsblatt und Druckansicht ------------------- */

/**
 * Vermittlung, Beträge, Auszahlung und Erstattung (FA-KERN-04) für Vorgangsblatt und Druckansicht. Nur Zeilen
 * mit Wert; ohne Vermittlung und ohne Erstattung leer.
 */
export function vermittlungZeilen(vorgang: Pick<BusinessRecord, 'referral' | 'payout' | 'refund'>): Array<[string, string]> {
  const zeilen: Array<[string, string]> = [];
  const r = vorgang.referral;
  if (r?.status) zeilen.push(['Stand der Vermittlung', VERMITTLUNG_LABEL[r.status]]);
  if (typeof r?.totalCents === 'number') zeilen.push(['Gesamtbetrag', formatCents(r.totalCents)]);
  if (typeof r?.platformCents === 'number') zeilen.push(['Plattformanteil', formatCents(r.platformCents)]);
  if (typeof r?.partnerCents === 'number') zeilen.push(['Partnerbetrag', formatCents(r.partnerCents)]);
  if (r?.customerConfirmedAt) zeilen.push(['Kunde bestätigt am', `${formatDateTime(r.customerConfirmedAt)} Uhr`]);
  const a = vorgang.payout;
  if (a?.status) zeilen.push(['Auszahlungsstand', AUSZAHLUNG_LABEL[a.status]]);
  if (a?.releasedAt) zeilen.push(['Auszahlung freigegeben am', `${formatDateTime(a.releasedAt)} Uhr${a.releasedBy ? ` (${a.releasedBy})` : ''}`]);
  if (a?.paidAt) zeilen.push(['Ausgezahlt am', `${formatDateTime(a.paidAt)} Uhr`]);
  if (a?.method) zeilen.push(['Weg der Auszahlung', a.method === 'zahlungsdienst' ? 'Zahlungsdienst' : 'Überweisung']);
  if (a?.reference) zeilen.push(['Beleg der Auszahlung', a.reference]);
  const e = vorgang.refund;
  if (e?.kind && typeof e.amountCents === 'number') {
    zeilen.push(['Erstattung', `${e.kind === 'ganz' ? 'ganz' : 'teilweise'}, ${formatCents(e.amountCents)}${e.at ? ` am ${formatDateTime(e.at)} Uhr` : ''}`]);
    if (e.reason) zeilen.push(['Grund der Erstattung', e.reason]);
  }
  return zeilen;
}
