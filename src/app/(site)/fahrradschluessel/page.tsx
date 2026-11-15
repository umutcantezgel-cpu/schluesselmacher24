import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { EinstiegSeite, seitenMetadata, type EinstiegAbschnitt } from '@/components/fahrzeug-anfrage/seiten';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { getRubrik } from '@/lib/data';

/*
 * Eigener Inhalt dieser Seite (R3): Beim Fahrrad zählt das Schloss; Hersteller, Schlüsselnummer und
 * Codekarte. Keine Preise, keine Zeiten, keine Markenversprechen (R4).
 */
const ABSCHNITTE: EinstiegAbschnitt[] = [
  {
    titel: 'Was wir für Sie tun',
    absaetze: [
      'Sie brauchen einen weiteren Schlüssel für Ihr Fahrradschloss? Sie senden uns die Angaben zum Schloss, Fotos und einen Nachweis. Wir prüfen, ob wir den Schlüssel anfertigen können, und melden uns mit Preis und Termin oder einer Rückfrage.',
    ],
  },
  {
    titel: 'Es zählt das Schloss',
    absaetze: [
      'Für den Schlüssel ist nicht das Fahrrad wichtig, sondern das Schloss: Rahmenschloss, Bügelschloss, Faltschloss oder das Schloss am Akku eines E-Bikes. Bitte nennen Sie uns den Hersteller des Schlosses und die Schlüsselnummer.',
      'Die Schlüsselnummer steht oft auf dem Schlüssel oder auf dem Schloss. Manche Schlösser haben eine Codekarte, die beim Kauf dabei war.',
    ],
  },
  {
    titel: 'Nachweis',
    absaetze: [
      'Für ein Fahrrad gibt es keinen Fahrzeugschein. Als Nachweis genügt der Kaufbeleg oder die Codekarte des Schlosses.',
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('fahrrad', 'einstieg')), alternates: { canonical: ANFRAGE_FORMULAR['fahrrad'].einstieg ?? undefined } };
}

/** Einstiegsseite Fahrradschlüssel (FA-KERN-02B). */
export default async function FahrradschluesselPage() {
  const ablauf = (
    <RubrikAblaufAbschnitt
      rubrik={await getRubrik('fahrradschluessel')}
      nummer={String(ABSCHNITTE.length + 1).padStart(2, '0')}
      titel="So läuft Ihre Anfrage ab"
    />
  );
  return <EinstiegSeite klasse="fahrrad" abschnitte={ABSCHNITTE} ablauf={ablauf} />;
}
