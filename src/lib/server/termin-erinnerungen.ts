import 'server-only';

import { heuteInBerlin } from '@/lib/berliner-zeit';
import { getAppointments, getSettings, vorgangAendern } from '@/lib/data';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '@/lib/mail/versand';
import { kundeErinnerung, terminKalender } from '@/lib/mail/vorlagen/erinnerung';
import { erinnerungAuswahl, erinnerungsZieltag, tagPlus } from '@/lib/termin-erinnerung';
import type { BusinessRecord, MailLogEntry } from '@/lib/types';
import { mailKonfiguration } from '@/lib/umgebung';

/* ==========================================================================
   Termin-Erinnerungen versenden (Leitfaden Kap. 17)
   Aufgerufen vom täglichen Cron. Welche Termine fällig sind, entscheidet
   `src/lib/termin-erinnerung.ts`; hier wird versendet und am Vorgang
   protokolliert (Mailprotokoll, Art „erinnerung“). Der Idempotenz-Schlüssel
   enthält Datum und Uhrzeit des Termins — ein zweiter Lauf am selben Tag
   verschickt bei Resend nichts doppelt, ein verschobener Termin bekommt eine
   neue Erinnerung.
   ========================================================================== */

export interface ErinnerungsErgebnis {
  /** Einstellung „Tage vorher“; 0 = Erinnerung aus. */
  tageVorher: number;
  /** Tag der Termine, an die erinnert wurde. */
  termintag: string | null;
  /** Passende Termine an diesem Tag. */
  termine: number;
  gesendet: number;
  /** Schon erinnert (etwa bei einem zweiten Lauf am selben Tag). */
  bereitsErinnert: number;
  fehlgeschlagen: number;
  /** Ohne Mailversand wird nichts gesendet und nichts protokolliert. */
  mailNichtEingerichtet?: boolean;
}

/** Sendet eine Erinnerung und vermerkt sie am Vorgang. Wirft nie. */
async function erinnern(
  vorgang: BusinessRecord,
  kontext: ReturnType<typeof vorlagenKontext>,
  antwortAn: string | undefined,
  jetzt: Date,
): Promise<MailLogEntry['result']> {
  try {
    const termin = vorgang.appointment!;
    const eintrag = await sendeVorlage({
      art: 'erinnerung',
      an: vorgang.contact.email,
      inhalt: kundeErinnerung({ vorgang, kontext }),
      antwortAn,
      idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'erinnerung', `${termin.date}-${termin.time}`),
      anhaenge: [terminKalender({ vorgang, kontext }, jetzt)],
    });
    await vorgangAendern(vorgang.id, (v) => ({
      mailLog: [...(v.mailLog ?? []), eintrag],
      ...(eintrag.result === 'gesendet'
        ? { timeline: [...v.timeline, { at: eintrag.at, actor: 'system' as const, message: 'Terminerinnerung per E-Mail versendet.' }] }
        : {}),
    }));
    if (eintrag.result !== 'gesendet') {
      console.warn(`[erinnerung] ${vorgang.reference}: ${eintrag.result}${eintrag.error ? ` (${eintrag.error})` : ''}`);
    }
    return eintrag.result;
  } catch (error) {
    console.error(`[erinnerung] ${vorgang.reference}: Erinnerung nicht versendet`, error);
    return 'fehlgeschlagen';
  }
}

/** Erinnert an die Termine in `reminderDaysBefore` Tagen (deutsche Zeit). */
export async function terminErinnerungenSenden(jetzt: Date = new Date()): Promise<ErinnerungsErgebnis> {
  const settings = await getSettings();
  const tageVorher = settings.booking.reminderDaysBefore ?? 0;
  const heute = heuteInBerlin(jetzt);
  const termintag = erinnerungsZieltag(heute, tageVorher);
  const ergebnis: ErinnerungsErgebnis = { tageVorher, termintag, termine: 0, gesendet: 0, bereitsErinnert: 0, fehlgeschlagen: 0 };
  if (!termintag) return ergebnis;

  // Von morgen bis zum Zieltag: Ausgefallene Läufe oder Versandfehler holt der nächste Lauf nach.
  const auswahl = erinnerungAuswahl(await getAppointments(tagPlus(heute, 1), termintag), { heute, tageVorher });
  ergebnis.termine = auswahl.faellig.length + auswahl.bereitsErinnert.length;
  ergebnis.bereitsErinnert = auswahl.bereitsErinnert.length;
  if (auswahl.faellig.length === 0) return ergebnis;
  if (!mailKonfiguration()) return { ...ergebnis, mailNichtEingerichtet: true };

  const kontext = vorlagenKontext(settings);
  const antwortAn = antwortAdresse(settings.company);
  // Nacheinander: Resend begrenzt die Anfragen je Sekunde, und es sind wenige Termine am Tag.
  for (const vorgang of auswahl.faellig) {
    const resultat = await erinnern(vorgang, kontext, antwortAn, jetzt);
    if (resultat === 'gesendet') ergebnis.gesendet += 1;
    else ergebnis.fehlgeschlagen += 1;
  }
  return ergebnis;
}
