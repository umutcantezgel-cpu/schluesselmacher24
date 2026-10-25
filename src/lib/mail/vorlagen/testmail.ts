/** Testmail aus dem Backend („Testmail an mich“) — prüft Zugang, Absender und Darstellung. */

import { formatDateTime } from '../../format';
import { baueMail, type MailInhalt } from '../html';
import type { VorlagenKontext } from './gemeinsam';

export function testmail({ kontext, jetzt }: { kontext: VorlagenKontext; jetzt: string }): MailInhalt {
  return baueMail({
    betreff: 'Testmail von SCHLÜSSELMACHER24',
    anrede: 'Guten Tag,',
    bausteine: [
      {
        art: 'absatz',
        text: `diese Testmail wurde am ${formatDateTime(jetzt)} Uhr aus dem Backend versendet. Der Mailversand funktioniert.`,
      },
      {
        art: 'hinweis',
        titel: 'Bitte prüfen',
        text: 'Kommt die Mail im Posteingang an (nicht im Spam)? Stimmen Absender und Antwortadresse?',
      },
    ],
    firma: kontext.firma,
    site: kontext.site,
  });
}
