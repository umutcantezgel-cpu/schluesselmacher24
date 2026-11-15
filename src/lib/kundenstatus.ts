/* ==========================================================================
   Kundenstatus in einfacher Sprache (E6-OPUS-04, G-25)

   Eine Quelle für Name, Erklärung und Seitentitel eines Status: Vorgangsseite
   und Terminstatus sprechen dieselben Wörter, der Kundenverlauf nutzt sie für
   alle Vorgänge außer der Foto-Prüfung (dort bleiben deren Sätze). Foto-Anfragen
   und Einsendungen haben eigene Texte, wo der allgemeine nicht passt. Keine
   Zusage zu Zeiten oder Preisen (R4, R9).

   Reine Funktionen, nur relative Importe: Der Backend-Hook nutzt sie auch.
   ========================================================================== */

import { EINSENDE_STATUS, istEinsendung } from './einsenden/vorgang';
import { fotoanfrageVerlauf, istFotoanfrage } from './foto-freigabe';
import { DIENSTLEISTER, verfolgungsLink } from './mail/vorlagen/status';
import { formatCents } from './format';
import type { BusinessRecord, RecordKind, RecordStatus } from './types';
import { ERLEDIGTE_STATUS } from './vorgang-status';

export interface KundenStatus {
  /** Kurzer Name, etwa im Status-Abzeichen. */
  label: string;
  /** Ein bis zwei Sätze: was gerade geschieht. */
  text: string;
  /** Seitentitel der Vorgangsseite. */
  titel: string;
  /** Kein weiterer Schritt von uns geplant (abgeschlossen, storniert, nicht möglich). */
  erledigt: boolean;
}

type Vorgang = Pick<BusinessRecord, 'kind' | 'area' | 'status'> & {
  payload?: Record<string, unknown>;
  /** Freigabe der Foto-Prüfung: Nur mit Preis nennt der Status Preis und Zahlung. */
  approval?: { priceCents?: number };
};

/** Name der Vorgangsart für Kunden. */
export const ART_FUER_KUNDEN: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  anfrage: 'Anfrage',
  termin: 'Termin',
  projekt: 'Projekt',
  partner: 'Partner-Bewerbung',
};

type Eintrag = { label: string; text: string };

const ALLGEMEIN: Record<RecordStatus, Eintrag> = {
  neu: { label: 'Eingegangen', text: 'Ihre Angaben sind bei uns eingegangen. Wir sehen sie uns an und melden uns bei Ihnen.' },
  'in-pruefung': { label: 'In Prüfung', text: 'Wir prüfen Ihre Angaben und Unterlagen. Sie müssen dafür nichts tun.' },
  geprueft: { label: 'Geprüft', text: 'Wir haben Ihre Angaben geprüft. Sie hören von uns.' },
  freigegeben: { label: 'Freigegeben', text: 'Wir haben Ihre Anfrage geprüft. Was Sie jetzt tun können, steht in unserer E-Mail.' },
  'nicht-moeglich': {
    label: 'Nicht möglich',
    text: 'Nach unserer Prüfung können wir diesen Auftrag leider nicht ausführen. Einzelheiten stehen in unserer E-Mail.',
  },
  'wartet-auf-kunde': {
    label: 'Rückfrage an Sie',
    text: 'Wir brauchen noch eine Angabe oder eine Unterlage von Ihnen. Was genau, steht in unserer E-Mail.',
  },
  'in-fertigung': { label: 'In Arbeit', text: 'Wir arbeiten an Ihrem Auftrag. Sie müssen nichts tun.' },
  terminiert: { label: 'Termin vereinbart', text: 'Ihr Termin ist verbindlich eingeplant.' },
  versendet: { label: 'Versendet', text: 'Ihre Sendung ist auf dem Weg zu Ihnen.' },
  abgeschlossen: { label: 'Abgeschlossen', text: 'Wir haben alles erledigt. Sie müssen nichts mehr tun.' },
  storniert: { label: 'Storniert', text: 'Ihre Anfrage wurde storniert.' },
};

const BESTELLUNG: Partial<Record<RecordStatus, Eintrag>> = {
  'in-pruefung': { label: 'In Prüfung', text: 'Wir prüfen Ihre Bestellung. Sie müssen dafür nichts tun.' },
  storniert: { label: 'Storniert', text: 'Ihre Bestellung wurde storniert.' },
  'in-fertigung': { label: 'In Anfertigung', text: 'Wir fertigen Ihre Bestellung an.' },
  versendet: { label: 'Versendet', text: 'Ihre Bestellung ist auf dem Weg zu Ihnen.' },
};

const TERMIN: Partial<Record<RecordStatus, Eintrag>> = {
  'in-pruefung': { label: 'In Prüfung', text: 'Wir prüfen Ihre Angaben zum Termin.' },
  storniert: { label: 'Storniert', text: 'Der Termin wurde storniert.' },
};

const FOTO: Partial<Record<RecordStatus, Eintrag>> = {
  'in-pruefung': { label: 'In Prüfung', text: 'Wir prüfen Ihre Fotos.' },
  geprueft: { label: 'Geprüft', text: 'Die Prüfung ist abgeschlossen. Das Ergebnis erhalten Sie per E-Mail.' },
  freigegeben: {
    label: 'Freigegeben',
    text:
      'Wir können Ihren Schlüssel nach Ihrer Vorlage anfertigen. Preis und Zahlung finden Sie auf der Seite zu Ihrer Anfrage '
      + 'und in unserer E-Mail. Den Auftrag erteilen Sie mit der Zahlung.',
  },
  'nicht-moeglich': {
    label: 'Nicht möglich',
    text: 'Nach unserer Prüfung können wir diesen Schlüssel leider nicht nach Ihrer Vorlage anfertigen. Einzelheiten stehen in unserer E-Mail.',
  },
  'wartet-auf-kunde': {
    label: 'Rückfrage an Sie',
    text: 'Wir brauchen noch eine Angabe oder ein weiteres Foto von Ihnen. Was genau, steht in unserer E-Mail.',
  },
  'in-fertigung': { label: 'In Anfertigung', text: 'Wir fertigen Ihren Schlüssel an.' },
  versendet: { label: 'Versendet', text: 'Ihr Schlüssel ist auf dem Weg zu Ihnen.' },
};

const EINSENDUNG: Partial<Record<RecordStatus, Eintrag>> = {
  ...EINSENDE_STATUS,
  freigegeben: {
    label: 'Freigegeben',
    text:
      'Wir können Kopien Ihres Schlüssels anfertigen. Preis und Zahlung finden Sie auf der Seite zu Ihrer Anfrage '
      + 'und in unserer E-Mail. Den Auftrag erteilen Sie mit der Zahlung.',
  },
  'wartet-auf-kunde': {
    label: 'Rückfrage an Sie',
    text: 'Wir brauchen noch eine Angabe von Ihnen. Was genau, steht in unserer E-Mail.',
  },
  'in-fertigung': { label: 'In Anfertigung', text: 'Wir fertigen Ihre Kopien an. Ihr Original liegt bei uns.' },
  versendet: { label: 'Versendet', text: 'Ihr Original und die Kopien sind auf dem Weg zu Ihnen.' },
};

/** Freigabe ohne Preis: Den Preis nennt das Team gesondert, die Seite verspricht ihn nicht (R4). */
const OHNE_PREIS: Eintrag = { label: 'Freigegeben', text: 'Wir können Ihren Schlüssel nach Ihrer Vorlage anfertigen. Den Preis nennen wir Ihnen gesondert.' };
const OHNE_PREIS_EINSENDUNG: Eintrag = { label: 'Freigegeben', text: 'Wir können Kopien Ihres Schlüssels anfertigen. Den Preis nennen wir Ihnen gesondert.' };

function eintrag(vorgang: Vorgang, status: RecordStatus): Eintrag {
  const ohnePreis = status === 'freigegeben' && !((vorgang.approval?.priceCents ?? 0) > 0);
  if (ohnePreis && istEinsendung(vorgang)) return OHNE_PREIS_EINSENDUNG;
  if (ohnePreis && istFotoanfrage(vorgang)) return OHNE_PREIS;
  if (istEinsendung(vorgang)) return EINSENDUNG[status] ?? FOTO[status] ?? ALLGEMEIN[status];
  if (istFotoanfrage(vorgang)) return FOTO[status] ?? ALLGEMEIN[status];
  if (vorgang.kind === 'bestellung') return BESTELLUNG[status] ?? ALLGEMEIN[status];
  if (vorgang.kind === 'termin') return TERMIN[status] ?? ALLGEMEIN[status];
  return ALLGEMEIN[status];
}

function titel(vorgang: Vorgang, status: RecordStatus, label: string): string {
  const art = ART_FUER_KUNDEN[vorgang.kind];
  const einsendung = istEinsendung(vorgang);
  switch (status) {
    case 'neu':
      return einsendung ? 'Einsendung angemeldet' : `${art} eingegangen`;
    case 'in-pruefung':
      return einsendung ? 'Schlüssel eingegangen' : `${art} eingegangen`;
    case 'geprueft':
      return `${art} geprüft`;
    case 'freigegeben':
      return istFotoanfrage(vorgang) ? 'Anfrage freigegeben' : `${art} freigegeben`;
    case 'nicht-moeglich':
      return 'Leider nicht möglich';
    case 'wartet-auf-kunde':
      return 'Rückfrage an Sie';
    case 'versendet':
      return 'Auf dem Weg zu Ihnen';
    case 'abgeschlossen':
      return `${art} erledigt`;
    case 'storniert':
      return `${art} storniert`;
    default:
      return label;
  }
}

/** Name, Erklärung und Seitentitel des Status, wie der Kunde ihn sieht. */
export function kundenStatus(vorgang: Vorgang, status: RecordStatus = vorgang.status): KundenStatus {
  const { label, text } = eintrag(vorgang, status);
  return { label, text, titel: titel(vorgang, status, label), erledigt: ERLEDIGTE_STATUS.includes(status) };
}

/**
 * Kundensichtbarer Verlaufseintrag zu einem Statuswechsel durch das Team (E-58, G-25). Foto-Anfragen
 * behalten ihre bisherigen Sätze; die übrigen Schritte und Vorgänge bekommen Name und Erklärung.
 * `null` heißt: kein Eintrag (etwa beim Zurücksetzen auf „neu“).
 */
export function kundenVerlauf(vorgang: Vorgang, status: RecordStatus, mitPreis: boolean): string | null {
  if (status === 'neu') return null;
  if (istFotoanfrage(vorgang)) {
    const foto = fotoanfrageVerlauf(status, mitPreis, istEinsendung(vorgang));
    if (foto) return foto;
  }
  const { label, text } = kundenStatus(vorgang, status);
  return `${label}: ${text}`;
}

/** Sendung für Kunden: nur Dienstleister, Nummer und öffentlicher Verfolgungslink, sobald versendet. */
export interface KundenSendung {
  dienstleister?: string;
  nummer?: string;
  link?: string;
}

/**
 * Erstattung in einem ruhigen Satz (FA-KERN-04): ganz oder teilweise, mit Betrag. Ohne Erstattung `null`.
 */
export function kundenErstattung(vorgang: Pick<BusinessRecord, 'payment'>): string | null {
  const zahlung = vorgang.payment;
  if (!zahlung || (zahlung.status !== 'erstattet' && zahlung.status !== 'teilweise-erstattet')) return null;
  const betrag = zahlung.refundedCents ?? (zahlung.status === 'erstattet' ? zahlung.amountCents : undefined);
  if (zahlung.status === 'erstattet') {
    return typeof betrag === 'number'
      ? `Wir haben Ihnen den Betrag von ${formatCents(betrag)} erstattet. Je nach Zahlart dauert es einige Tage, bis er auf Ihrem Konto ist.`
      : 'Wir haben Ihnen den Betrag erstattet. Je nach Zahlart dauert es einige Tage, bis er auf Ihrem Konto ist.';
  }
  return typeof betrag === 'number'
    ? `Wir haben Ihnen ${formatCents(betrag)} erstattet. Je nach Zahlart dauert es einige Tage, bis der Betrag auf Ihrem Konto ist.`
    : 'Wir haben Ihnen einen Teil des Betrags erstattet. Je nach Zahlart dauert es einige Tage, bis er auf Ihrem Konto ist.';
}

export function kundenSendung(vorgang: Pick<BusinessRecord, 'status' | 'shipment'>): KundenSendung | undefined {
  if (vorgang.status !== 'versendet' && vorgang.status !== 'abgeschlossen') return undefined;
  const carrier = vorgang.shipment?.carrier;
  const nummer = vorgang.shipment?.trackingNumber?.trim() || undefined;
  if (!carrier && !nummer) return undefined;
  const link = verfolgungsLink(carrier, nummer) ?? undefined;
  return { dienstleister: carrier ? DIENSTLEISTER[carrier] : undefined, nummer, link };
}
