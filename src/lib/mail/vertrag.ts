/* ==========================================================================
   Versand der Vertragsbestätigung — genau einmal je Vorgang
   Ausgelöst beim Zahlungseingang (src/lib/server/benachrichtigungen.ts) und,
   ohne Online-Zahlung, wenn das Team im Backend einen bestätigenden Status
   oder „bezahlt“ setzt (Hook der Sammlung Vorgänge). Ohne 'server-only' und
   nur mit relativen Importen; die Vorlage selbst (mit den Rechtstexten) wird
   erst beim Versand geladen. Wer versendet, schreibt das Protokoll selbst.
   ========================================================================== */

import type { BusinessRecord, MailLogEntry, RecordStatus, Settings } from '../types';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from './versand';

/** Statuswerte, mit denen das Team einen Vorgang annimmt bzw. ausführt. */
export const BESTAETIGENDE_STATUS: readonly RecordStatus[] = ['geprueft', 'in-fertigung', 'terminiert', 'versendet', 'abgeschlossen'];

/**
 * Braucht dieser Vorgang (noch) eine Vertragsbestätigung? Nur Bestellungen
 * und Termine — Anfragen sind unverbindlich. Maßgeblich ist das
 * Mailprotokoll: Ist sie einmal gesendet, nie wieder.
 */
export function vertragsbestaetigungOffen(vorgang: BusinessRecord): boolean {
  if (vorgang.kind !== 'bestellung' && vorgang.kind !== 'termin') return false;
  if (vorgang.status === 'storniert') return false;
  return !(vorgang.mailLog ?? []).some((eintrag) => eintrag.kind === 'vertrag' && eintrag.result === 'gesendet');
}

export interface VertragsbestaetigungSenden {
  vorgang: BusinessRecord;
  settings: Pick<Settings, 'company' | 'shipping' | 'booking' | 'legalTexts'>;
  /** Anzeigetexte der Online-Zahlarten, `null` ohne Online-Zahlung. */
  zahlarten: string[] | null;
}

/**
 * Sendet die Vertragsbestätigung, falls noch offen. Liefert den Eintrag fürs
 * Mailprotokoll, `null`, wenn nichts zu tun ist. Wirft nie. Der feste
 * Idempotenz-Schlüssel verhindert zusätzlich doppelte Zustellung bei
 * gleichzeitigen Auslösern.
 */
export async function sendeVertragsbestaetigung({ vorgang, settings, zahlarten }: VertragsbestaetigungSenden): Promise<MailLogEntry | null> {
  if (!vertragsbestaetigungOffen(vorgang)) return null;
  try {
    const { vertragsbestaetigung } = await import('./vorlagen/vertragsbestaetigung');
    return await sendeVorlage({
      art: 'vertrag',
      an: vorgang.contact.email,
      inhalt: vertragsbestaetigung({ vorgang, kontext: vorlagenKontext(settings), settings, zahlarten }),
      antwortAn: antwortAdresse(settings.company),
      idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'vertrag'),
    });
  } catch (error) {
    console.error('[mail] Vertragsbestätigung nicht erstellt', error instanceof Error ? error.message : error);
    return { kind: 'vertrag', to: vorgang.contact.email, at: new Date().toISOString(), result: 'fehlgeschlagen', error: 'Interner Fehler' };
  }
}
