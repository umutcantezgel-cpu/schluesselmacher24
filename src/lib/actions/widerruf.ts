'use server';

import { getSettings } from '@/lib/data';
import { HONIGTOPF_FELD, START_FELD } from '@/lib/formular-schutz';
import { kontakt } from '@/lib/rechtliches/firma';
import { widerrufAufnehmen, type WiderrufErgebnis } from '@/lib/rechtliches/widerruf-aufnahme';
import { WIDERRUF_ERKLAERUNG } from '@/lib/rechtliches/widerruf-typen';
import {
  widerrufAmVorgangVermerken,
  widerrufBestaetigungVermerken,
  widerrufSpeichern,
  widerrufVorgangFinden,
} from '@/lib/rechtliches/widerruf-speicher';
import { nachDerAntwort, sendeWiderrufBetrieb, sendeWiderrufEingang } from '@/lib/server/benachrichtigungen';
import { botVerdachtMelden, formularSchutzPruefen } from '@/lib/server/formular-schutz';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import { mitDatenbank } from '@/lib/umgebung';

/** Formularwert als Text; fehlende Felder bleiben `undefined`. */
function feld(formData: FormData, name: string): string | undefined {
  const wert = formData.get(name);
  return typeof wert === 'string' ? wert : undefined;
}

/** Freie Angaben ohne den vorangestellten Erklärungssatz (für beide Mails). */
function angabenAus(erklaerung: string): string | undefined {
  const rest = erklaerung.startsWith(WIDERRUF_ERKLAERUNG) ? erklaerung.slice(WIDERRUF_ERKLAERUNG.length) : erklaerung;
  return rest.trim() || undefined;
}

/**
 * Widerrufsbutton: nimmt die Erklärung aus dem Formular
 * `/rechtliches/widerruf/erklaeren` entgegen (für `useActionState`).
 * Speichert jede gültige Erklärung mit Eingangszeit, storniert nie selbst.
 * Eingangsbestätigung an den Kunden und Meldung an den Betrieb kommen aus
 * den Mailvorlagen (src/lib/server/benachrichtigungen.ts).
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

  // Bot-Schutz: Nur der ausgefüllte Honigtopf wird still verworfen.
  const befund = formularSchutzPruefen({
    start: feld(formData, START_FELD),
    [HONIGTOPF_FELD]: feld(formData, HONIGTOPF_FELD),
  });
  if (befund === 'honigtopf') {
    botVerdachtMelden('widerrufErklaeren', befund);
    const vorgangsnummer = feld(formData, 'vorgangsnummer')?.trim().toUpperCase().slice(0, 40);
    return {
      status: 'eingegangen',
      eingangAm: new Date().toISOString(),
      name: (feld(formData, 'name') ?? '').trim().slice(0, 120),
      email: (feld(formData, 'email') ?? '').trim().slice(0, 254),
      ...(vorgangsnummer ? { vorgangsnummer } : {}),
      mailGesendet: false,
    };
  }
  // Fehlender oder unpassender Startzeitpunkt (etwa ohne JavaScript): Die
  // Erklärung ist trotzdem wirksam und wird gespeichert, der Betrieb erfährt
  // davon. Nur die Eingangsbestätigung an die eingegebene Adresse entfällt —
  // sonst ließe sich unsere Domain als Mailverteiler missbrauchen.
  const verdacht = befund !== 'ok';
  if (verdacht) botVerdachtMelden('widerrufErklaeren', befund, 'gespeichert, ohne Mail an den Kunden');
  const notiz = verdacht
    ? `Bot-Schutz: ${befund} (Startzeitpunkt fehlt oder passt nicht, etwa ohne JavaScript). Keine Eingangsbestätigung `
      + 'an die angegebene Adresse versendet — bitte prüfen und den Eingang bei Bedarf von Hand bestätigen.'
    : undefined;

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
      jetzt: () => new Date(),
      vorgangFinden: widerrufVorgangFinden,
      speichern: notiz ? (datensatz) => widerrufSpeichern({ ...datensatz, notiz }) : widerrufSpeichern,
      bestaetigungVermerken: widerrufBestaetigungVermerken,
      vorgangVermerken: widerrufAmVorgangVermerken,
      bestaetigungSenden: async (datensatz) => {
        if (verdacht) return { ergebnis: 'nicht-eingerichtet' };
        // Mit dem Inhalt der Erklärung; die Vorlage escapt und kürzt alle Eingaben.
        const eintrag = await sendeWiderrufEingang({
          an: datensatz.email,
          name: datensatz.name,
          vorgangsnummer: datensatz.vorgangsnummer,
          angaben: angabenAus(datensatz.erklaerung),
          eingegangenAm: datensatz.eingegangenAm,
          settings,
        });
        return {
          ergebnis: eintrag.result,
          ...(eintrag.providerId ? { anbieterId: eintrag.providerId } : {}),
          ...(eintrag.error ? { fehler: eintrag.error } : {}),
        };
      },
      // Nach der Antwort: Der Kunde wartet nicht auf die Mail an den Betrieb.
      betriebInformieren: (datensatz, id) =>
        nachDerAntwort(() =>
          sendeWiderrufBetrieb({
            widerrufId: id,
            name: datensatz.name,
            email: datensatz.email,
            vorgangsnummer: datensatz.vorgangsnummer,
            eingegangenAm: datensatz.eingegangenAm,
            zugeordnet: datensatz.zuordnung === 'zugeordnet',
            angaben: angabenAus(datensatz.erklaerung),
            settings,
          }),
        ),
    },
  );
}
