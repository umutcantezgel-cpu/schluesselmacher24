import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { FahrzeugAnfrageSeite, seitenMetadata } from '@/components/fahrzeug-anfrage/seiten';

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('seniorenmobil', 'anfrage')), alternates: { canonical: ANFRAGE_FORMULAR['seniorenmobil'].anfrage } };
}

/** Anfrage der Klasse „seniorenmobil“ im gemeinsamen Ablauf (FA-KERN-02B). */
export default async function AnfragePage() {
  return <FahrzeugAnfrageSeite klasse="seniorenmobil" />;
}
