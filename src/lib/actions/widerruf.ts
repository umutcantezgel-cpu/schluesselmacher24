'use server';

import { getSettings } from '@/lib/data';
import { mailStatus, sendMail } from '@/lib/integrations';
import { kontakt } from '@/lib/rechtliches/firma';
import { widerrufAufnehmen, type WiderrufErgebnis } from '@/lib/rechtliches/widerruf-aufnahme';
import {
  widerrufAmVorgangVermerken,
  widerrufBestaetigungVermerken,
  widerrufSpeichern,
  widerrufVorgangFinden,
} from '@/lib/rechtliches/widerruf-speicher';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import { mitDatenbank } from '@/lib/umgebung';

/** Formularwert als Text; fehlende Felder bleiben `undefined`. */
function feld(formData: FormData, name: string): string | undefined {
  const wert = formData.get(name);
  return typeof wert === 'string' ? wert : undefined;
}

/**
 * Widerrufsbutton: nimmt die Erklärung aus dem Formular
 * `/rechtliches/widerruf/erklaeren` entgegen (für `useActionState`).
 * Speichert jede gültige Erklärung mit Eingangszeit, storniert nie selbst.
 */
export async function widerrufErklaeren(
  _vorher: WiderrufErgebnis | null,
  formData: FormData,
): Promise<WiderrufErgebnis> {
  const settings = await getSettings();
  const firmaEmail = kontakt(settings.company).email;

  if (!(await allowRequest(LIMITS.widerruf))) {
    return {
      status: 'fehler',
      meldung: firmaEmail
        ? `${RATE_LIMIT_MESSAGE} Sie können Ihren Widerruf auch per E-Mail an ${firmaEmail} senden.`
        : RATE_LIMIT_MESSAGE,
    };
  }

  return widerrufAufnehmen(
    {
      name: feld(formData, 'name'),
      email: feld(formData, 'email'),
      vorgangsnummer: feld(formData, 'vorgangsnummer'),
      erklaerung: feld(formData, 'erklaerung'),
    },
    {
      mitDatenbank: mitDatenbank(),
      firma: settings.company,
      mailEingerichtet: mailStatus().configured,
      jetzt: () => new Date(),
      vorgangFinden: widerrufVorgangFinden,
      speichern: widerrufSpeichern,
      bestaetigungVermerken: widerrufBestaetigungVermerken,
      vorgangVermerken: widerrufAmVorgangVermerken,
      mailSenden: async (mail) => {
        const antwort = await sendMail(mail);
        // Die Kennung beim Mailanbieter liefert die Resend-Anbindung, sobald vorhanden.
        const { providerId } = antwort as typeof antwort & { providerId?: string };
        return { sent: antwort.sent, message: antwort.message, ...(providerId ? { providerId } : {}) };
      },
    },
  );
}
