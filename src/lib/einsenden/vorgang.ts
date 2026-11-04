/*
 * Schlüssel einschicken (G-24 bis G-26, E6-OPUS-02): die Angaben einer Einsendung, ihre Prüfung auf dem
 * Server und die Texte für Zusammenfassung und Status.
 *
 * Eine Einsendung ist ein Vorgang „Schlüssel nach Vorlage“ (kind anfrage, area schluessel-nach-vorlage)
 * mit der Quelle „einsenden“; die Vorlage ist hier der eingeschickte Schlüssel statt der Fotos. Damit
 * gelten Freigabe mit Preis und Zahlungslink, der Nachweis der Sicherungskarte (R13) und die Statusseite
 * wie bei der Foto-Anfrage, ohne einen Zahlungsablauf zu verändern (G9). Gewünschte Kopien stehen wie
 * dort in `stueckzahl`.
 *
 * Reine Funktionen ohne Seiteneffekte, im Browser und auf dem Server nutzbar.
 */

import { istFotoanfrage } from '@/lib/foto-freigabe';
import type { BusinessRecord, ContactDetails, RecordStatus, SummarySection } from '@/lib/types';
import type { VersandArt } from '@/lib/versand/typen';
import { KARTEN_LABEL, kartenAntwort } from '@/lib/wege/nachweis';

export const EINSENDE_QUELLE = 'einsenden';
export const MAX_ORIGINALE = 10;
export const MAX_KOPIEN = 20;
export const BESCHRIFTUNG_HOECHSTENS = 80;
export const HINWEIS_HOECHSTENS = 1000;

export const VERSAND_LABEL: Record<VersandArt, string> = {
  versichert: 'versichert',
  unversichert: 'unversichert',
};

/** Die geprüften Angaben einer Einsendung, wie sie im Vorgang stehen. */
export interface EinsendePayload {
  quelle: typeof EINSENDE_QUELLE;
  /** Schlüssel im Umschlag. */
  originale: number;
  /** Gewünschte Kopien insgesamt (Feldname wie bei der Foto-Anfrage). */
  stueckzahl: number;
  beschriftung: string | null;
  hinweis: string | null;
  sicherungskarte: 'ja' | 'nein' | 'unklar';
  versand: VersandArt;
  /** Das Original liegt der Werkstatt vor, sobald die Sendung eingeht. */
  originalEingesendet: true;
}

type Ergebnis = { ok: true; payload: EinsendePayload; summary: SummarySection[] } | { ok: false };

const ganz = (wert: unknown, von: number, bis: number): number | null =>
  typeof wert === 'number' && Number.isInteger(wert) && wert >= von && wert <= bis ? wert : null;

const text = (wert: unknown, hoechstens: number): string | null | false => {
  if (wert === null || wert === undefined) return null;
  if (typeof wert !== 'string') return false;
  const getrimmt = wert.trim();
  if (getrimmt.length > hoechstens) return false;
  return getrimmt || null;
};

/** Rücksendeanschrift vollständig: Straße, fünfstellige Postleitzahl, Ort. */
export function ruecksendeanschriftVollstaendig(contact: Pick<ContactDetails, 'street' | 'postalCode' | 'city'>): boolean {
  return Boolean(contact.street?.trim()) && /^\d{5}$/.test(contact.postalCode?.trim() ?? '') && Boolean(contact.city?.trim());
}

/** Was im Umschlag liegt, für Begleitschein und Zusammenfassung: „2 Schlüssel zum Nachmachen“. */
export function inhaltText(p: Pick<EinsendePayload, 'originale'>): string {
  return `${p.originale} Schlüssel zum Nachmachen`;
}

/** Zusammenfassung für Vorgang, Bestätigung und Vorgangsblatt; gebaut aus geprüften Angaben. */
export function einsendeZusammenfassung(p: EinsendePayload, contact: ContactDetails): SummarySection[] {
  const anschrift = [contact.street, [contact.postalCode, contact.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return [
    {
      title: 'Einsendung',
      rows: [
        { label: 'Im Umschlag', value: inhaltText(p) },
        { label: 'Gewünschte Kopien', value: String(p.stueckzahl) },
        { label: 'Beschriftung', value: p.beschriftung ?? 'keine Angabe' },
        { label: 'Sicherungskarte', value: KARTEN_LABEL[p.sicherungskarte] },
        { label: 'Versand', value: VERSAND_LABEL[p.versand] },
        ...(p.hinweis ? [{ label: 'Hinweis', value: p.hinweis }] : []),
      ],
    },
    {
      title: 'Kontakt und Rücksendung',
      rows: [
        { label: 'Name', value: [contact.salutation, contact.firstName, contact.lastName].filter(Boolean).join(' ') },
        ...(contact.company ? [{ label: 'Firma', value: contact.company }] : []),
        { label: 'E-Mail', value: contact.email },
        { label: 'Telefon', value: contact.phone },
        { label: 'Rücksendung an', value: anschrift },
      ],
    },
  ];
}

/**
 * Prüft die Angaben aus dem Browser und baut daraus Payload und Zusammenfassung neu; nichts davon
 * wird ungeprüft übernommen. Ohne vollständige Rücksendeanschrift keine Einsendung.
 */
export function einsendeVorgang(roh: Record<string, unknown>, contact: ContactDetails): Ergebnis {
  if (roh.quelle !== EINSENDE_QUELLE) return { ok: false };
  const originale = ganz(roh.originale, 1, MAX_ORIGINALE);
  const stueckzahl = ganz(roh.stueckzahl, 1, MAX_KOPIEN);
  const beschriftung = text(roh.beschriftung, BESCHRIFTUNG_HOECHSTENS);
  const hinweis = text(roh.hinweis, HINWEIS_HOECHSTENS);
  const sicherungskarte = kartenAntwort(roh.sicherungskarte);
  const versand = roh.versand === 'versichert' || roh.versand === 'unversichert' ? roh.versand : null;
  if (originale === null || stueckzahl === null || beschriftung === false || hinweis === false || !sicherungskarte || !versand) return { ok: false };
  if (!ruecksendeanschriftVollstaendig(contact)) return { ok: false };
  const payload: EinsendePayload = {
    quelle: EINSENDE_QUELLE,
    originale,
    stueckzahl,
    beschriftung,
    hinweis,
    sicherungskarte,
    versand,
    originalEingesendet: true,
  };
  return { ok: true, payload, summary: einsendeZusammenfassung(payload, contact) };
}

/** Ist der Vorgang eine Einsendung? Nur Foto-Anfragen mit der Quelle „einsenden“. */
export function istEinsendung(vorgang: Pick<BusinessRecord, 'kind' | 'area'> & { payload?: Record<string, unknown> }): boolean {
  return istFotoanfrage(vorgang) && vorgang.payload?.quelle === EINSENDE_QUELLE;
}

/** Status, die bei einer Einsendung anders heißen als bei der Foto-Anfrage: Erst kommt der Schlüssel an. */
export const EINSENDE_STATUS: Partial<Record<RecordStatus, { label: string; text: string }>> = {
  neu: {
    label: 'Angemeldet',
    text: 'Wir erwarten Ihren Schlüssel. Bitte legen Sie den Begleitschein in den Umschlag.',
  },
  'in-pruefung': {
    label: 'Schlüssel eingegangen',
    text: 'Ihr Schlüssel ist bei uns angekommen und wird geprüft.',
  },
  'nicht-moeglich': {
    label: 'Nicht möglich',
    text: 'Eine Kopie ist nicht möglich. Ihr Original schicken wir Ihnen zurück.',
  },
};
