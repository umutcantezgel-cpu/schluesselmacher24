import type { Metadata } from 'next';

import { EigentextSeite } from '@/components/recht/eigentext';
import { getSettings } from '@/lib/data';
import { onlineZahlarten } from '@/lib/rechtliches/zahlarten';

import { VersandInhalt } from './versand-inhalt';

export const metadata: Metadata = {
  title: 'Zahlung und Versand',
  description: 'Zahlungsarten, Versandarten, Kosten und Lieferzeiten bei SCHLÜSSELMACHER24.',
  alternates: { canonical: '/rechtliches/versand-und-zahlung' },
};

export default async function VersandUndZahlungPage() {
  const settings = await getSettings();

  // Eine im Backend hinterlegte Fassung ersetzt den eingebauten Entwurf.
  const eigentext = settings.legalTexts?.shippingAndPayment;
  if (eigentext) return <EigentextSeite titel="Zahlung und Versand" dokument={eigentext} />;

  return <VersandInhalt settings={settings} zahlarten={onlineZahlarten()} />;
}
