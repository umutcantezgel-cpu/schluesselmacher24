import type { Metadata } from 'next';

import { EigentextSeite } from '@/components/recht/eigentext';
import { Rechtstext } from '@/components/recht/rechtstext';
import { getSettings } from '@/lib/data';
import { formatDateShort } from '@/lib/format';
import { RECHTSTEXTE_FASSUNG, agbAbschnitte } from '@/lib/rechtliches/texte';
import { onlineZahlarten } from '@/lib/rechtliches/zahlarten';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'Allgemeine Geschäftsbedingungen von SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function AgbPage() {
  const settings = await getSettings();

  // Eine im Backend hinterlegte Fassung ersetzt den eingebauten Entwurf.
  const eigentext = settings.legalTexts?.terms;
  if (eigentext) return <EigentextSeite titel="Allgemeine Geschäftsbedingungen" dokument={eigentext} />;

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Allgemeine Geschäftsbedingungen</h1>
      <p className="mt-3">Stand: {formatDateShort(RECHTSTEXTE_FASSUNG)}</p>
      <Rechtstext abschnitte={agbAbschnitte({ settings, zahlarten: onlineZahlarten() })} />
    </>
  );
}
