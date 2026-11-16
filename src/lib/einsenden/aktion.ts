'use server';

import { getRecord, getSettings, vorgangAendern } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { verifyAccessToken } from '@/lib/server/access-token';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

import { einsendeAngebotFuerVorgang } from './schein';
import { SENDUNGSNUMMER_MELDUNG, sendungsnummerAnwenden, type SendungsnummerErgebnis } from './sendung';

export interface SendungsnummerAntwort {
  ok: boolean;
  meldung: string;
  /** Gespeicherte, bereinigte Nummer. */
  nummer?: string;
}

/**
 * Der Kunde trägt auf seiner Vorgangsseite die Sendungsnummer seiner Sendung an uns ein (FA-SHOP-03B).
 * Zugang wie „Jetzt bezahlen“: der Link-Schlüssel des Vorgangs, unter der Sperre des Vorgangs erneut
 * geprüft; ein fremder oder falscher Schlüssel ändert nichts. Begrenzung der Versuche wie beim
 * Statusabruf. Bei der Freigabe mit Einsendung wird die gewählte Variante mitgespeichert; sie muss eine
 * sein, die die Vorgangsseite anbietet (Sonderfall nur mit Freigabe).
 */
export async function sendungsnummerEintragen(eingabe: {
  recordId: string;
  token: string;
  nummer: string;
  variante?: string;
}): Promise<SendungsnummerAntwort> {
  if (!(await allowRequest(LIMITS.status))) return { ok: false, meldung: RATE_LIMIT_MESSAGE };
  const { recordId, token, nummer, variante } = eingabe ?? {};
  if (
    typeof recordId !== 'string'
    || typeof token !== 'string'
    || typeof nummer !== 'string'
    || (variante !== undefined && typeof variante !== 'string')
    || recordId.length > 40
    || token.length > 128
  ) {
    return { ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang };
  }
  const vorher = await getRecord(recordId);
  // Unbekannter Vorgang und falscher Schlüssel sehen gleich aus.
  if (!vorher || !verifyAccessToken(token, vorher.accessTokenHash)) return { ok: false, meldung: SENDUNGSNUMMER_MELDUNG.zugang };

  try {
    const einstellungen = (await getSettings().catch(() => null))?.sendIn ?? defaults.settings().sendIn!;
    let ergebnis: SendungsnummerErgebnis = { ok: false, grund: 'zugang' };
    const jetzt = new Date().toISOString();
    await vorgangAendern(recordId, (v) => {
      const angeboten = einsendeAngebotFuerVorgang(v, einstellungen).optionen.map((o) => o.art);
      ergebnis = sendungsnummerAnwenden(v, {
        zugangGueltig: verifyAccessToken(token, v.accessTokenHash),
        nummer,
        variante,
        angeboten,
        jetzt,
      });
      return ergebnis.ok ? ergebnis.aenderung : null;
    });
    const fertig = ergebnis as SendungsnummerErgebnis;
    if (!fertig.ok) return { ok: false, meldung: SENDUNGSNUMMER_MELDUNG[fertig.grund] };
    return { ok: true, meldung: SENDUNGSNUMMER_MELDUNG.gespeichert, nummer: fertig.nummer };
  } catch (error) {
    console.error('[einsenden] Sendungsnummer nicht gespeichert', error);
    return { ok: false, meldung: SENDUNGSNUMMER_MELDUNG.fehler };
  }
}
