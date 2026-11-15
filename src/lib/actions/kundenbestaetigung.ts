'use server';

import { getRecord, vorgangAendern } from '@/lib/data';
import { BESTAETIGUNG_MELDUNG, bestaetigungsLage, kundenbestaetigungAnwenden } from '@/lib/partner/kundenbestaetigung';
import { verifyAccessToken } from '@/lib/server/access-token';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

export interface KundenbestaetigungErgebnis {
  ok: boolean;
  meldung: string;
}

/**
 * Der Kunde bestätigt die Ausführung eines vermittelten Auftrags (FA-KERN-04, A-049 Nr. 4). Der Schlüssel aus
 * dem Link wird unter der Sperre des Vorgangs erneut geprüft und danach gelöscht: ein gefälschter oder schon
 * benutzter Link ändert nichts. Bestätigt wird erst mit dem Knopf, nicht schon beim Öffnen des Links (Mailprogramme
 * rufen Links zur Vorschau ab).
 */
export async function ausfuehrungBestaetigen(eingabe: { recordId: string; key: string }): Promise<KundenbestaetigungErgebnis> {
  if (!(await allowRequest(LIMITS.status))) return { ok: false, meldung: RATE_LIMIT_MESSAGE };
  const { recordId, key } = eingabe ?? {};
  if (typeof recordId !== 'string' || typeof key !== 'string' || recordId.length > 40 || key.length > 128) {
    return { ok: false, meldung: BESTAETIGUNG_MELDUNG.ungueltig };
  }
  const vorher = await getRecord(recordId);
  if (!vorher) return { ok: false, meldung: BESTAETIGUNG_MELDUNG.ungueltig };

  let bestaetigt = false;
  const jetzt = new Date().toISOString();
  const nachher = await vorgangAendern(recordId, (v) => {
    const aenderung = kundenbestaetigungAnwenden(v, verifyAccessToken(key, v.referral?.confirmTokenHash), jetzt);
    bestaetigt = aenderung !== null;
    return aenderung;
  });
  if (bestaetigt) return { ok: true, meldung: 'Vielen Dank. Sie haben bestätigt, dass Ihr Auftrag ausgeführt wurde.' };
  const lage = bestaetigungsLage(nachher, verifyAccessToken(key, nachher?.referral?.confirmTokenHash));
  return {
    ok: false,
    meldung: lage === 'nicht-offen' ? BESTAETIGUNG_MELDUNG.nichtOffen : BESTAETIGUNG_MELDUNG.ungueltig,
  };
}
