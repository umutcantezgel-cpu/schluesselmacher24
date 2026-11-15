import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { FahrzeugAnfrageSeite, seitenMetadata } from '@/components/fahrzeug-anfrage/seiten';
import { KlassenSeitenDaten } from '@/components/seo/seiten-daten';

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('nicht-gefunden', 'anfrage')), alternates: { canonical: ANFRAGE_FORMULAR['nicht-gefunden'].anfrage } };
}

/**
 * „Fahrzeug nicht gefunden?“ (FA-KERN-02B): Auto oder anderes Fahrzeug, das die Suche nicht kennt. Marke,
 * Modell und Baujahr als freie Angaben, Fahrzeugschein, drei Schlüsselfotos und Beschreibung. Vorbelegung
 * aus ?marke=, ?modell= oder ?fahrzeug= der Fahrzeugsuche.
 */
export default async function FahrzeugNichtGefundenPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const suchparameter = await props.searchParams;
  return (
    <>
      <KlassenSeitenDaten klasse="nicht-gefunden" art="anfrage" />
      <FahrzeugAnfrageSeite klasse="nicht-gefunden" suchparameter={suchparameter} />
    </>
  );
}
