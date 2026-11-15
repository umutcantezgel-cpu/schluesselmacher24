import type { Metadata } from 'next';

import { getSettings } from '@/lib/data';
import { gewinnungSeite } from '@/lib/partner/gewinnung';
import { GewinnungSeite } from '@/components/partner/gewinnung-seite';

const SEITE = gewinnungSeite('kooperation');

export const metadata: Metadata = {
  title: SEITE.titel,
  description: SEITE.beschreibung,
  alternates: { canonical: SEITE.pfad },
};

export default async function PartnerKooperationPage() {
  const settings = await getSettings();
  return <GewinnungSeite seite={SEITE} telefon={settings.company.phone} />;
}
