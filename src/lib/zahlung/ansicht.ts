/* ==========================================================================
   Zahlungszustand für die Kundenseite (/bestellung/[id])
   Reine Funktion: Welcher Hinweis erscheint, und darf der Kunde (erneut)
   bezahlen? Gilt für Bestellungen und Termine.
   ========================================================================== */

import { formatDateTime, formatTime } from '@/lib/format';
import type { BusinessRecord } from '@/lib/types';

export interface ZahlungsAnsicht {
  ton: 'info' | 'success' | 'warning' | 'danger';
  titel: string;
  text: string;
  /** Knopf „Jetzt bezahlen“ bzw. „Erneut bezahlen“ anzeigen. */
  knopf?: 'jetzt' | 'erneut';
  /** Termin verfallen: Link zur neuen Buchung anzeigen. */
  neuBuchen?: boolean;
}

export interface AnsichtsUmfeld {
  /** Ist die Online-Zahlung eingerichtet? */
  online: boolean;
  /** Der Kunde hat auf der Zahlungsseite abgebrochen (`abbruch=1`). */
  abbruch: boolean;
  /** Der Kunde kommt gerade von der Zahlungsseite zurück (`rueckkehr=1`). */
  rueckkehr: boolean;
  jetzt: Date;
}

/** Wie lange ein Termin ohne Checkout-Sitzung noch bezahlt werden kann. */
export const TERMIN_OHNE_SITZUNG_MINUTEN = 45;

/** Darf für diesen Termin noch eine Zahlungsseite geöffnet werden? */
export function terminNochBezahlbar(vorgang: BusinessRecord, jetzt: Date): boolean {
  if (vorgang.kind !== 'termin' || vorgang.status !== 'neu') return false;
  const ablauf = vorgang.payment?.expiresAt;
  if (vorgang.payment?.checkoutSessionId) return Boolean(ablauf && Date.parse(ablauf) > jetzt.getTime());
  return jetzt.getTime() - Date.parse(vorgang.createdAt) < TERMIN_OHNE_SITZUNG_MINUTEN * 60 * 1000;
}

export function zahlungsAnsicht(vorgang: BusinessRecord, umfeld: AnsichtsUmfeld): ZahlungsAnsicht | null {
  const zahlung = vorgang.payment;
  if (!zahlung) return null;
  const termin = vorgang.kind === 'termin';
  const storniert = vorgang.status === 'storniert';

  if (zahlung.status === 'bezahlt') {
    return umfeld.rueckkehr
      ? { ton: 'success', titel: 'Vielen Dank', text: termin ? 'Ihre Anzahlung ist eingegangen.' : 'Ihre Zahlung ist eingegangen.' }
      : null;
  }
  if (zahlung.status === 'erstattet') return null;

  if (!umfeld.online) {
    if (zahlung.status !== 'offen') return null;
    return {
      ton: 'info',
      titel: 'Zahlung noch offen',
      text: 'Ihr Vorgang ist gespeichert. Wir melden uns mit den Zahlungsinformationen zu dieser Vorgangsnummer.',
    };
  }

  if (storniert) {
    return termin
      ? { ton: 'danger', titel: 'Termin nicht mehr reserviert', text: 'Dieser Termin ist storniert. Gern können Sie einen neuen Termin buchen.', neuBuchen: true }
      : { ton: 'danger', titel: 'Vorgang storniert', text: 'Dieser Vorgang ist storniert. Eine Zahlung ist nicht mehr nötig.' };
  }

  if (zahlung.status === 'fehlgeschlagen') {
    return termin
      ? { ton: 'danger', titel: 'Anzahlung nicht abgeschlossen', text: 'Die Anzahlung ist nicht eingegangen. Bitte buchen Sie den Termin neu.', neuBuchen: true }
      : { ton: 'danger', titel: 'Zahlung nicht abgeschlossen', text: 'Die Zahlung wurde nicht abgeschlossen. Sie können sie erneut starten.', knopf: 'erneut' };
  }

  // Zahlung offen.
  if (umfeld.rueckkehr) {
    return {
      ton: 'info',
      titel: 'Zahlung wird bestätigt',
      text:
        'Sie kommen von der Zahlungsseite zurück. Die Bestätigung kann einige Augenblicke dauern — bei Lastschrift '
        + 'auch einige Tage. Laden Sie die Seite später neu; wir informieren Sie zusätzlich per E-Mail.',
    };
  }

  if (termin) {
    if (!terminNochBezahlbar(vorgang, umfeld.jetzt)) {
      return {
        ton: 'danger',
        titel: 'Reservierung abgelaufen',
        text: 'Die Anzahlung ist nicht rechtzeitig eingegangen. Das Zeitfenster wird wieder freigegeben. Bitte buchen Sie den Termin neu.',
        neuBuchen: true,
      };
    }
    const bis = zahlung.expiresAt ? ` bis ${formatTime(zahlung.expiresAt)} Uhr` : '';
    return {
      ton: umfeld.abbruch ? 'warning' : 'info',
      titel: umfeld.abbruch ? 'Zahlung abgebrochen' : 'Anzahlung noch offen',
      text: `Ihr Termin ist${bis} reserviert. Ohne Anzahlung geben wir das Zeitfenster danach wieder frei.`,
      knopf: 'jetzt',
    };
  }

  const abgelaufen = Boolean(zahlung.expiresAt && Date.parse(zahlung.expiresAt) <= umfeld.jetzt.getTime());
  if (umfeld.abbruch) {
    return { ton: 'warning', titel: 'Zahlung abgebrochen', text: 'Ihre Bestellung ist gespeichert. Sie können die Zahlung jederzeit fortsetzen.', knopf: 'jetzt' };
  }
  if (abgelaufen) {
    return { ton: 'warning', titel: 'Zahlungslink abgelaufen', text: 'Ihre Bestellung ist gespeichert. Starten Sie die Zahlung bitte erneut.', knopf: 'erneut' };
  }
  if (!zahlung.checkoutSessionId) {
    return { ton: 'warning', titel: 'Zahlung noch offen', text: 'Die Online-Zahlung wurde noch nicht gestartet.', knopf: 'jetzt' };
  }
  return {
    ton: 'info',
    titel: 'Zahlung noch offen',
    text: `Gefertigt wird erst nach Zahlungseingang.${zahlung.expiresAt ? ` Der Zahlungslink gilt bis ${formatDateTime(zahlung.expiresAt)} Uhr.` : ''}`,
    knopf: 'jetzt',
  };
}
