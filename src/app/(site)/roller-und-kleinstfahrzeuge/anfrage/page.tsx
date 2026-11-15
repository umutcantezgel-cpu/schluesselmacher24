import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { FahrzeugAnfrageSeite, seitenMetadata } from '@/components/fahrzeug-anfrage/seiten';
import { KlassenSeitenDaten } from '@/components/seo/seiten-daten';

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('roller', 'anfrage')), alternates: { canonical: ANFRAGE_FORMULAR['roller'].anfrage } };
}

/** Anfrage der Klasse „roller“ im gemeinsamen Ablauf (FA-KERN-02B). */
export default async function AnfragePage() {
  return (
    <>
      <KlassenSeitenDaten klasse="roller" art="anfrage" />
      <FahrzeugAnfrageSeite klasse="roller" />
    </>
  );
}
