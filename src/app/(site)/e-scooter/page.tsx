import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { EinstiegSeite, seitenMetadata, type EinstiegAbschnitt } from '@/components/fahrzeug-anfrage/einstieg';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { getPageContent, getRubrik } from '@/lib/data';
import { KlassenSeitenDaten } from '@/components/seo/seiten-daten';
import { PasstDazu } from '@/components/seo/passt-dazu';

/*
 * Eigener Inhalt dieser Seite (R3): E-Scooter haben keinen Fahrzeugschein; Nachweis, Typenschild und die
 * Frage, welches Schloss gemeint ist. Keine Preise, keine Zeiten, keine Modellversprechen (R4).
 */
const ABSCHNITTE: EinstiegAbschnitt[] = [
  {
    titel: 'Was wir für Sie tun',
    absaetze: [
      'Sie brauchen einen weiteren Schlüssel für Ihren E-Scooter oder ein ähnliches Elektrofahrzeug? Sie senden uns Ihre Angaben, Fotos und einen Nachweis. Wir prüfen, was möglich ist, und melden uns mit Preis und Termin oder einer Rückfrage.',
    ],
  },
  {
    titel: 'Nachweis statt Fahrzeugschein',
    absaetze: [
      'E-Scooter werden nicht zugelassen und haben deshalb keinen Fahrzeugschein. Als Nachweis genügt zum Beispiel die Betriebserlaubnis oder Datenbestätigung, die Versicherungsbescheinigung oder der Kaufbeleg.',
      'Dazu fotografieren Sie das Typenschild mit Hersteller und Fahrzeug-Identifizierungsnummer. Sie können die Nummer auch eintippen. Hat Ihr Fahrzeug kein Typenschild, sagen Sie es uns in der Anfrage.',
    ],
  },
  {
    titel: 'Welches Schloss?',
    absaetze: [
      'Manche Elektrofahrzeuge haben ein Zündschloss, andere nur ein Schloss am Akku. Schreiben Sie in die Beschreibung, für welches Schloss Sie den Schlüssel brauchen.',
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('e-scooter', 'einstieg')), alternates: { canonical: ANFRAGE_FORMULAR['e-scooter'].einstieg ?? undefined } };
}

/** Einstiegsseite E-Scooter und ähnliche Elektrofahrzeuge (FA-KERN-02B). */
export default async function EScooterPage() {
  const ablauf = (
    <RubrikAblaufAbschnitt
      rubrik={await getRubrik('e-scooter')}
      nummer={String(ABSCHNITTE.length + 1).padStart(2, '0')}
      titel="So läuft Ihre Anfrage ab"
    />
  );
  return (
    <>
      <KlassenSeitenDaten klasse="e-scooter" art="einstieg" />
      <EinstiegSeite klasse="e-scooter" abschnitte={ABSCHNITTE} ablauf={ablauf} />
      {/* Verweisliste aus den Daten: eigene Links und Gegenrichtung (FA-SEO-01C) */}
      <PasstDazu pfad="/e-scooter" eigene={(await getPageContent('e-scooter'))?.seo.internalLinks} />
    </>
  );
}
