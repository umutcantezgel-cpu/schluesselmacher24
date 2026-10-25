/**
 * Statusmails aus dem Backend: Das Team setzt einen neuen Status, der Kunde
 * erfährt es per Mail — auf Wunsch mit einer kurzen Nachricht des Teams.
 */

import type { BusinessRecord, ShipmentCarrier } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, nummerBaustein, statusLink, terminZeilen, type VorlagenKontext } from './gemeinsam';

/** Status, zu denen der Kunde eine Mail erhält. */
export const STATUS_MIT_MAIL = ['freigegeben', 'nicht-moeglich', 'wartet-auf-kunde', 'terminiert', 'versendet', 'storniert'] as const;
export type StatusMitMail = (typeof STATUS_MIT_MAIL)[number];

/** Ergebnis der Foto-Prüfung — im Mailprotokoll als Art „freigabe“ vermerkt. */
export const FREIGABE_STATUS = ['freigegeben', 'nicht-moeglich'] as const;

export function mailArtZumStatus(status: StatusMitMail): 'freigabe' | 'status' {
  return (FREIGABE_STATUS as readonly string[]).includes(status) ? 'freigabe' : 'status';
}

export function istStatusMitMail(status: string): status is StatusMitMail {
  return (STATUS_MIT_MAIL as readonly string[]).includes(status);
}

const DIENSTLEISTER: Record<ShipmentCarrier, string> = {
  dhl: 'DHL',
  dpd: 'DPD',
  'deutsche-post': 'Deutsche Post',
  hermes: 'Hermes',
  gls: 'GLS',
  ups: 'UPS',
  sonstige: 'Versanddienstleister',
};

/** Öffentliche Sendungsverfolgung des Dienstleisters — soweit es eine feste Adresse gibt. */
export function verfolgungsLink(carrier: ShipmentCarrier | undefined, nummer: string | undefined): string | null {
  if (!carrier || !nummer) return null;
  const nr = encodeURIComponent(nummer.trim());
  switch (carrier) {
    case 'dhl':
    case 'deutsche-post':
      return `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${nr}`;
    case 'dpd':
      return `https://tracking.dpd.de/status/de_DE/parcel/${nr}`;
    case 'hermes':
      return `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${nr}`;
    case 'gls':
      return `https://gls-group.com/DE/de/paketverfolgung?match=${nr}`;
    case 'ups':
      return `https://www.ups.com/track?loc=de_DE&tracknum=${nr}`;
    default:
      return null;
  }
}

export interface StatusMailDaten {
  vorgang: BusinessRecord;
  status: StatusMitMail;
  /** Optionale Nachricht des Teams aus dem Backend. */
  nachricht?: string;
  kontext: VorlagenKontext;
}

export function statusMail({ vorgang, status, nachricht, kontext }: StatusMailDaten): MailInhalt {
  const bausteine: Baustein[] = [];
  let betreff: string;

  switch (status) {
    // Einfache Fassung; Preis, Einsenden und Bestellweg ergänzt die Feinarbeit der Foto-Freigabe.
    case 'freigegeben':
      betreff = `Ihre Anfrage ist freigegeben – ${vorgang.reference}`;
      bausteine.push({
        art: 'absatz',
        text: 'wir haben Ihre Anfrage geprüft: Die Anfertigung ist möglich. Wir melden uns mit dem nächsten Schritt.',
      });
      break;
    case 'nicht-moeglich':
      betreff = `Ergebnis Ihrer Anfrage – ${vorgang.reference}`;
      bausteine.push({
        art: 'absatz',
        text: 'wir haben Ihre Anfrage geprüft. Leider können wir diesen Schlüssel nicht anfertigen.',
      });
      break;
    case 'wartet-auf-kunde':
      betreff = `Wir brauchen noch etwas von Ihnen – ${vorgang.reference}`;
      bausteine.push({
        art: 'absatz',
        text: 'für Ihren Vorgang brauchen wir noch eine Angabe oder Unterlage von Ihnen. Antworten Sie einfach auf diese E-Mail.',
      });
      break;
    case 'terminiert':
      betreff = `Ihr Termin steht – ${vorgang.reference}`;
      bausteine.push({ art: 'absatz', text: 'Ihr Termin ist bei uns verbindlich eingeplant.' });
      break;
    case 'versendet': {
      betreff = `Ihre Sendung ist unterwegs – ${vorgang.reference}`;
      bausteine.push({ art: 'absatz', text: 'Ihre Bestellung hat unsere Werkstatt verlassen und ist auf dem Weg zu Ihnen.' });
      break;
    }
    case 'storniert':
      betreff = `Ihr Vorgang wurde storniert – ${vorgang.reference}`;
      bausteine.push({
        art: 'absatz',
        text:
          'Ihr Vorgang wurde storniert.'
          + (vorgang.payment?.status === 'bezahlt' ? ' Zu einer bereits geleisteten Zahlung melden wir uns gesondert.' : ''),
      });
      break;
  }

  bausteine.push(nummerBaustein(vorgang));

  const zeilen: Array<[string, string]> = status === 'terminiert' ? terminZeilen(vorgang) : [];
  if (status === 'versendet' && vorgang.shipment) {
    const { carrier, trackingNumber } = vorgang.shipment;
    if (carrier) zeilen.push(['Versand mit', DIENSTLEISTER[carrier]]);
    if (trackingNumber) zeilen.push(['Sendungsnummer', trackingNumber]);
  }
  if (zeilen.length) bausteine.push({ art: 'felder', zeilen });

  const verfolgung = status === 'versendet' ? verfolgungsLink(vorgang.shipment?.carrier, vorgang.shipment?.trackingNumber) : null;
  if (verfolgung) bausteine.push({ art: 'knopf', href: verfolgung, label: 'Sendung verfolgen' });

  const text = nachricht?.trim();
  if (text) bausteine.push({ art: 'nachricht', titel: 'Nachricht von uns', text: text.slice(0, 4000) });

  if (!verfolgung) bausteine.push({ art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' });
  bausteine.push(ANTWORT_HINWEIS);

  return baueMail({ betreff, anrede: anrede(vorgang.contact), bausteine, firma: kontext.firma, site: kontext.site });
}
