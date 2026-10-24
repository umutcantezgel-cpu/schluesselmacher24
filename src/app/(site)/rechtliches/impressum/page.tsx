import type { Metadata } from 'next';

import { RedaktionsHinweis } from '@/components/recht/redaktions-hinweis';
import { getSettings } from '@/lib/data';
import { firmaVeroeffentlichbar } from '@/lib/rechtliches/firma';

import { ImpressumInhalt } from './impressum-inhalt';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Anbieterkennzeichnung von SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function ImpressumPage() {
  const { company } = await getSettings();

  return (
    <ImpressumInhalt
      company={company}
      hinweis={
        !firmaVeroeffentlichbar(company) && (
          <RedaktionsHinweis title="Firmendaten fehlen" className="mt-6">
            Die Firmendaten sind im Backend noch als Platzhalter markiert. Anschrift, Kontakt und
            Berufsangaben erscheinen erst, wenn sie unter „Einstellungen → Firma“ gepflegt sind und
            der Haken „Platzhalter“ entfernt ist.
          </RedaktionsHinweis>
        )
      }
    />
  );
}
