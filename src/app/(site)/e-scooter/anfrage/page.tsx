import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { FahrzeugAnfrageSeite, seitenMetadata } from '@/components/fahrzeug-anfrage/seiten';

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('e-scooter', 'anfrage')), alternates: { canonical: ANFRAGE_FORMULAR['e-scooter'].anfrage } };
}

/** Anfrage der Klasse „e-scooter“ im gemeinsamen Ablauf (FA-KERN-02B). */
export default async function AnfragePage() {
  return <FahrzeugAnfrageSeite klasse="e-scooter" />;
}
