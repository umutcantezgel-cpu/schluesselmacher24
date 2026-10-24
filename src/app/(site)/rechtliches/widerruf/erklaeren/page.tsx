import type { Metadata } from 'next';
import Link from 'next/link';

import { getSettings } from '@/lib/data';
import { mailStatus } from '@/lib/integrations';
import { anbieterEinzeilig, firmaVeroeffentlichbar, kontakt } from '@/lib/rechtliches/firma';

import { WiderrufFormular } from './widerruf-formular';

export const metadata: Metadata = {
  title: 'Vertrag widerrufen',
  description: 'Widerruf eines Vertrags mit SCHLÜSSELMACHER24 online erklären – mit sofortiger Eingangsbestätigung.',
  robots: { index: false, follow: true },
};

interface WiderrufErklaerenProps {
  /** In Next.js 16 sind Suchparameter ein Promise. */
  searchParams: Promise<{ nummer?: string | string[] }>;
}

export default async function WiderrufErklaerenPage(props: WiderrufErklaerenProps) {
  const [{ nummer }, settings] = await Promise.all([props.searchParams, getSettings()]);
  // Vorbelegung, etwa aus der Bestellbestätigung: nur Zeichen einer Vorgangsnummer.
  const vorbelegung = typeof nummer === 'string' ? nummer.replace(/[^A-Za-z0-9-]/g, '').slice(0, 40).toUpperCase() : '';
  const { company } = settings;
  const { email } = kontakt(company);

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Vertrag widerrufen</h1>
      <p className="mt-3">
        Hier erklären Sie den Widerruf eines Vertrags, den Sie mit uns über diese Website
        geschlossen haben – etwa einer Bestellung oder eines Autoschlüssel-Termins. Nach dem
        Absenden sehen Sie sofort den Zeitpunkt des Eingangs
        {mailStatus().configured ? '; zusätzlich senden wir eine Bestätigung an Ihre E-Mail-Adresse' : ''}.
      </p>
      <p>
        Für die Frist genügt es, dass Sie die Erklärung rechtzeitig absenden. Wann ein
        Widerrufsrecht besteht und welche Ausnahmen gelten, steht unter{' '}
        <Link href="/rechtliches/widerruf">Widerruf und Rückgabe</Link>.
      </p>

      <WiderrufFormular vorgangsnummer={vorbelegung} />

      <h2>Andere Wege</h2>
      <p>
        Sie können den Widerruf auch formlos
        {email ? (
          <>
            {' '}per E-Mail an <a href={`mailto:${email}`}>{email}</a>
          </>
        ) : null}
        {firmaVeroeffentlichbar(company) ? <> oder per Brief an {anbieterEinzeilig(company)}</> : null}{' '}
        erklären, zum Beispiel mit dem{' '}
        <Link href="/rechtliches/widerruf#muster-widerrufsformular">Muster-Widerrufsformular</Link>.
      </p>
    </>
  );
}
