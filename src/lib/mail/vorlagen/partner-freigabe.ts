/**
 * Freigabe einer Partner-Anfrage ohne Festpreis (FA-KERN-03, A-049): Das Team nennt den Gesamtpreis,
 * der Kunde erhält den persönlichen Zahlungslink über den Gesamtbetrag. Erst mit der Zahlung ist der
 * Auftrag verbindlich und wird an den Partnerbetrieb weitergegeben. Reine Funktion, relative Importe.
 */

import { terminortZeile } from '../../auftragsweg';
import { formatCents } from '../../format';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, nummerBaustein, statusLink, type VorlagenKontext } from './gemeinsam';

export interface PartnerFreigabeDaten {
  vorgang: BusinessRecord;
  nachricht?: string;
  kontext: VorlagenKontext;
  /** Persönlicher Link zur Zahlung, nur mit Online-Zahlung. */
  zahlungsLink?: string;
}

export function partnerFreigabeMail({ vorgang, nachricht, kontext, zahlungsLink }: PartnerFreigabeDaten): MailInhalt {
  const betrag = vorgang.payment?.scope === 'gesamt' ? vorgang.payment.amountCents : vorgang.remainder?.totalCents;
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text:
        'wir haben Ihre Anfrage geprüft und können den Auftrag über einen Partnerbetrieb in Ihrer Region ausführen. '
        + 'Verbindlich wird er mit Ihrer Zahlung. Danach geben wir ihn an den Partnerbetrieb weiter, der den genauen Termin mit Ihnen abstimmt.',
    },
    nummerBaustein(vorgang),
    { art: 'absatz', text: `${terminortZeile('partner')}.` },
  ];
  if (typeof betrag === 'number' && betrag > 0) {
    bausteine.push({ art: 'felder', zeilen: [['Gesamtpreis', formatCents(betrag)], ['Jetzt fällig', formatCents(betrag)]] });
  }
  const text = nachricht?.trim();
  if (text) bausteine.push({ art: 'nachricht', titel: 'Nachricht von uns', text: text.slice(0, 4000) });
  if (zahlungsLink) {
    bausteine.push(
      { art: 'knopf', href: zahlungsLink, label: 'Gesamtbetrag bezahlen' },
      { art: 'absatz', text: 'Über diesen persönlichen Link bezahlen Sie sicher online. Bitte geben Sie ihn nicht weiter.' },
    );
  } else {
    bausteine.push(
      { art: 'hinweis', titel: 'Zahlung', text: 'Die Zahlungsinformationen erhalten Sie von uns zu Ihrer Vorgangsnummer.' },
      { art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' },
    );
  }
  bausteine.push(ANTWORT_HINWEIS);
  return baueMail({
    betreff: `Ihr Auftrag ist freigegeben – ${vorgang.reference}`,
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}
