/**
 * Betriebswarnung an das Team (Mail-Art `team-hinweis`): Grenzen des
 * Supabase-Free-Plans werden knapp oder die nächtliche Sicherung bleibt aus
 * (docs/SUPABASE.md, Überwachung). Nur Kennzahlen, keine Kundendaten.
 * Reine Funktion, relative Importe.
 */

import type { Befund } from '../../betrieb/zustand';
import { baueMail, type MailInhalt } from '../html';
import type { VorlagenKontext } from './gemeinsam';

const STUFE_LABEL = { kritisch: 'Dringend', warnung: 'Hinweis' } as const;

export interface BetriebWarnungDaten {
  befunde: Befund[];
  /** Tag der Prüfung (JJJJ-MM-TT, deutsche Zeit). */
  stand: string;
  kontext: VorlagenKontext;
}

export function betriebWarnung({ befunde, stand, kontext }: BetriebWarnungDaten): MailInhalt {
  const dringend = befunde.some((befund) => befund.stufe === 'kritisch');
  return baueMail({
    betreff: `${dringend ? 'Dringend' : 'Hinweis'}: Betrieb der Website prüfen (${stand})`,
    vorschau: befunde[0]?.text,
    anrede: 'Hallo Team,',
    bausteine: [
      {
        art: 'absatz',
        text: `die tägliche Prüfung vom ${stand} hat ${befunde.length === 1 ? 'einen Befund' : `${befunde.length} Befunde`} ergeben:`,
      },
      {
        art: 'felder',
        zeilen: befunde.map((befund): [string, string] => [STUFE_LABEL[befund.stufe], befund.text]),
      },
      {
        art: 'hinweis',
        titel: 'Was tun?',
        text:
          'Die Schritte stehen in docs/SUPABASE.md (Abschnitte „Kontingente“ und „Sicherung“). '
          + 'Bei vollem Speicher alte Dateien löschen lassen oder auf Supabase Pro wechseln; bei '
          + 'ausgebliebener Sicherung den Workflow „Sicherung“ in GitHub Actions ansehen.',
      },
    ],
    site: kontext.site,
  });
}
