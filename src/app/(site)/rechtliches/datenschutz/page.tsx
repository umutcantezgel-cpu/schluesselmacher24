import type { Metadata } from 'next';

import { EigentextSeite } from '@/components/recht/eigentext';
import { RedaktionsHinweis } from '@/components/recht/redaktions-hinweis';
import { getSettings } from '@/lib/data';
import { firmaVeroeffentlichbar } from '@/lib/rechtliches/firma';
import { gaMessId } from '@/lib/statistik';
import { istProduktion } from '@/lib/umgebung';

import { DatenschutzInhalt } from './datenschutz-inhalt';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung personenbezogener Daten bei SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function DatenschutzPage() {
  const settings = await getSettings();

  // Eine im Backend hinterlegte Fassung ersetzt den eingebauten Entwurf.
  const eigentext = settings.legalTexts?.privacy;
  if (eigentext) return <EigentextSeite titel="Datenschutzerklärung" dokument={eigentext} />;

  return (
    <DatenschutzInhalt
      settings={settings}
      pruefhinweise={!istProduktion()}
      statistik={Boolean(gaMessId())}
      hinweis={
        !firmaVeroeffentlichbar(settings.company) && (
          <RedaktionsHinweis title="Firmendaten fehlen" className="mt-6">
            Der Verantwortliche erscheint erst vollständig, wenn die Firmendaten im Backend gepflegt
            und nicht mehr als Platzhalter markiert sind.
          </RedaktionsHinweis>
        )
      }
    />
  );
}
