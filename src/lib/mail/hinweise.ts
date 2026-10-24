/* Hinweise zum Mailversand für Kundenseiten — aus dem Mailprotokoll des Vorgangs. */

import type { BusinessRecord } from '../types';

export const MAIL_NICHT_EINGERICHTET =
  'Eine automatische Bestätigung per E-Mail ist noch nicht eingerichtet. '
  + 'Notieren Sie sich bitte Ihre Vorgangsnummer.';

export const MAIL_NICHT_VERSENDET =
  'Die Bestätigung per E-Mail konnte gerade nicht versendet werden. '
  + 'Notieren Sie sich bitte Ihre Vorgangsnummer.';

/**
 * Hinweis zur Eingangsbestätigung dieses Vorgangs — oder `null`, wenn sie
 * nachweislich versendet wurde.
 */
export function mailHinweis(record: Pick<BusinessRecord, 'mailLog'>, mailEingerichtet: boolean): string | null {
  const versendet = (record.mailLog ?? []).some((m) => m.kind === 'eingang-kunde' && m.result === 'gesendet');
  if (versendet) return null;
  return mailEingerichtet ? MAIL_NICHT_VERSENDET : MAIL_NICHT_EINGERICHTET;
}
