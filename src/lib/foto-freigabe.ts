/* ==========================================================================
   Foto-Freigabe bei „Schlüssel nach Vorlage“ (Erg. Leitfaden §1/§2, PL 07)
   Ablauf: eingegangen (`neu`) → geprüft (`in-pruefung`/`geprueft`) →
   `freigegeben` / Rückfrage (`wartet-auf-kunde`) / `nicht-moeglich` →
   Bestellung. Mit der Freigabe nennt das Team den Preis; der Kunde erteilt
   den Auftrag, indem er über den persönlichen Link bezahlt. Erst dann wird
   gefertigt (`in-fertigung`).

   Reine Funktionen, nur relative Importe — der Backend-Hook nutzt sie auch.
   ========================================================================== */

import type { BusinessRecord, RecordStatus } from './types';

/** Ist der Vorgang eine Fotoanfrage („Schlüssel nach Vorlage“)? */
export function istFotoanfrage(vorgang: Pick<BusinessRecord, 'kind' | 'area'>): boolean {
  return vorgang.kind === 'anfrage' && vorgang.area === 'schluessel-nach-vorlage';
}

/** Bezeichnung der Zahlung (Stripe-Position, Kontoauszug). */
export const FOTOANFRAGE_ZAHLUNG = 'Anfertigung Schlüssel nach Vorlage';

/**
 * Freigegeben, Betrag festgelegt und noch nicht bezahlt: Der Kunde kann den
 * Auftrag jetzt mit der Zahlung erteilen.
 */
export function freigabeZahlbar(vorgang: BusinessRecord): boolean {
  const zahlung = vorgang.payment;
  return (
    istFotoanfrage(vorgang)
    && vorgang.status === 'freigegeben'
    && Boolean(zahlung && zahlung.amountCents > 0 && (zahlung.status === 'offen' || zahlung.status === 'fehlgeschlagen'))
  );
}

/** Gewünschte Stückzahl aus dem Formular, falls angegeben. */
export function gewuenschteStueckzahl(vorgang: Pick<BusinessRecord, 'payload'>): number | undefined {
  const wert = vorgang.payload?.stueckzahl;
  return typeof wert === 'number' && Number.isSafeInteger(wert) && wert > 0 ? wert : undefined;
}

/**
 * Kundensichtbare Verlaufseinträge zu den Schritten der Foto-Prüfung. Die
 * übrigen Statuswechsel stehen nur in den internen Notizen.
 */
export function fotoanfrageVerlauf(status: RecordStatus, mitPreis: boolean): string | null {
  switch (status) {
    case 'in-pruefung':
      return 'Wir prüfen Ihre Fotos.';
    case 'geprueft':
      return 'Prüfung abgeschlossen. Das Ergebnis erhalten Sie in Kürze.';
    case 'freigegeben':
      return mitPreis
        ? 'Freigegeben: Die Anfertigung ist möglich. Den Auftrag erteilen Sie mit der Zahlung.'
        : 'Freigegeben: Die Anfertigung ist möglich. Den Preis nennen wir Ihnen gesondert.';
    case 'wartet-auf-kunde':
      return 'Rückfrage: Für die Prüfung brauchen wir noch eine Angabe von Ihnen.';
    case 'nicht-moeglich':
      return 'Geprüft: Eine Anfertigung nach Ihrer Vorlage ist leider nicht möglich.';
    default:
      return null;
  }
}

/** Verlauf nach der Zahlung einer freigegebenen Fotoanfrage. */
export function auftragErteiltVerlauf(einsenden: boolean): string {
  return einsenden
    ? 'Auftrag erteilt. Sobald Ihr Originalschlüssel bei uns eingegangen ist, fertigen wir Ihren Schlüssel.'
    : 'Auftrag erteilt. Wir fertigen Ihren Schlüssel.';
}
