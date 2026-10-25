import type { Metadata } from 'next';
import Link from 'next/link';

import { EigentextSeite } from '@/components/recht/eigentext';
import { Rechtstext } from '@/components/recht/rechtstext';
import { getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { WIDERRUF_ERKLAEREN_HREF } from '@/lib/navigation';
import { kontakt } from '@/lib/rechtliches/firma';
import {
  ausschlussSonderanfertigung,
  erloeschenDienstleistung,
  musterWiderrufsformular,
  widerrufsbelehrung,
} from '@/lib/rechtliches/texte';

export const metadata: Metadata = {
  title: 'Widerruf und Rückgabe',
  description: 'Widerrufsbelehrung, Muster-Widerrufsformular und Hinweise zur Rückgabe bei SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function WiderrufPage() {
  const settings = await getSettings();
  const { company, booking } = settings;

  // Eine im Backend hinterlegte Fassung ersetzt den eingebauten Entwurf.
  const eigentext = settings.legalTexts?.withdrawal;
  if (eigentext) {
    return (
      <>
        <EigentextSeite titel="Widerruf und Rückgabe" dokument={eigentext} />
        <WiderrufButton />
      </>
    );
  }

  const { email, telefon } = kontakt(company);

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Widerruf und Rückgabe</h1>
      <p className="mt-3">
        Verbraucherinnen und Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Für Käufe im
        Shop und für Autoschlüssel-Termine gelten unterschiedliche Fristen; beide Belehrungen stehen
        unten. Für Waren, die wir nach Ihren Angaben anfertigen, besteht kein Widerrufsrecht.
      </p>

      <WiderrufButton />

      <h2 id="belehrung-waren">1. Widerrufsbelehrung für Käufe im Shop</h2>
      <p>Gilt für Bestellungen von Waren, soweit das Widerrufsrecht nicht nach Abschnitt 3 ausgeschlossen ist.</p>
      <Rechtstext abschnitte={widerrufsbelehrung('waren', company)} />
      <p className="font-semibold">Ende der Widerrufsbelehrung</p>

      <h2 id="belehrung-dienstleistungen">2. Widerrufsbelehrung für Dienstleistungen und Autoschlüssel-Termine</h2>
      <p>Gilt für Verträge über Dienstleistungen, insbesondere für gebuchte Autoschlüssel-Termine.</p>
      <Rechtstext abschnitte={widerrufsbelehrung('dienstleistung', company)} />
      <p className="font-semibold">Ende der Widerrufsbelehrung</p>

      <Rechtstext
        abschnitte={[
          { ...ausschlussSonderanfertigung(), ueberschrift: `3. ${ausschlussSonderanfertigung().ueberschrift}` },
          { ...erloeschenDienstleistung(), ueberschrift: `4. ${erloeschenDienstleistung().ueberschrift}` },
        ]}
      />

      <h2 id="anzahlung">5. Anzahlung auf Autoschlüssel-Termine</h2>
      <p>
        Für Autoschlüssel-Termine erheben wir eine Anzahlung (derzeit{' '}
        <span className="font-mono tabular-nums">{formatCents(booking.depositMinCents)}</span> bis{' '}
        <span className="font-mono tabular-nums">{formatCents(booking.depositMaxCents)}</span>, je nach
        Fahrzeug und Leistung). Sie wird vollständig mit dem Endpreis verrechnet.
      </p>
      <p>
        Widerrufen Sie den Vertrag, erstatten wir die Anzahlung nach den Regeln unter „Folgen des
        Widerrufs“ in Abschnitt 2. Haben Sie verlangt, dass wir vor Ablauf der Widerrufsfrist mit
        der Leistung beginnen, kann ein angemessener Wertersatz anfallen. Was außerhalb des
        Widerrufsrechts bei Absage, Verschiebung oder Nichterscheinen gilt, richtet sich nach der
        individuellen Vereinbarung mit Ihnen.
      </p>

      <Rechtstext
        abschnitte={[{ ...musterWiderrufsformular(company), ueberschrift: '6. Muster-Widerrufsformular' }]}
      />
      <p>
        Sie können das Formular ausdrucken und per Post schicken
        {email ? ` oder den Inhalt per E-Mail an ${email} senden` : ''}. Schneller geht es online über
        die Schaltfläche „Vertrag widerrufen“.
      </p>

      <h2 id="ruecksendung">7. Rücksendung und Mängel</h2>
      <p>
        Bitte legen Sie einer Rücksendung Ihre Vorgangsnummer bei, damit wir sie zuordnen können.
        Eine vorherige Ankündigung
        {telefon || email ? ' per Telefon oder E-Mail' : ''} hilft uns, ist aber keine Voraussetzung
        für Ihren Widerruf.
      </p>
      <p>
        Bei Mängeln gelten die gesetzlichen Rechte. Melden Sie sich in diesem Fall bitte mit Ihrer
        Vorgangsnummer; wir besprechen dann das weitere Vorgehen mit Ihnen.
      </p>

      <h2 id="originalschluessel">8. Eingesandte Originalschlüssel</h2>
      <p>
        Für Schlüssel nach Vorlage genügen in der Regel Fotos. Brauchen wir das Original, fordern
        wir es ausdrücklich an und nennen Ihnen Versandadresse und Umfang. Wählen Sie dann bitte
        einen nachverfolgbaren, möglichst versicherten Versand. Original und neuen Schlüssel senden
        wir Ihnen auf Wunsch getrennt zurück; die Versandart stimmen wir vorher mit Ihnen ab.
      </p>
    </>
  );
}

/**
 * Widerrufsbutton: führt zum Formular für den Online-Widerruf. Als Textlink im
 * Kasten, weil die Lesespalte (`prose-sm24`) jeden Link einheitlich gestaltet.
 */
function WiderrufButton() {
  return (
    <div className="my-6 rounded-lg border border-border-strong bg-surface p-4">
      <p className="font-semibold text-foreground">Sie möchten einen Vertrag widerrufen?</p>
      <p className="mt-1">
        <Link href={WIDERRUF_ERKLAEREN_HREF}>Vertrag widerrufen</Link> – online, mit sofortiger
        Eingangsbestätigung.
      </p>
    </div>
  );
}
