import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { EinstiegSeite, seitenMetadata, type EinstiegAbschnitt } from '@/components/fahrzeug-anfrage/seiten';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { getRubrik } from '@/lib/data';

/*
 * Eigener Inhalt dieser Seite (R3): Seniorenmobile haben meist keinen Fahrzeugschein, und das Fahrzeug
 * gehört nicht immer dem Fahrer. Keine Preise, keine Zeiten, keine Modellversprechen (R4).
 */
const ABSCHNITTE: EinstiegAbschnitt[] = [
  {
    titel: 'Was wir für Sie tun',
    absaetze: [
      'Der Schlüssel Ihres Seniorenmobils, Elektromobils oder Krankenfahrstuhls ist verloren oder Sie möchten einen zweiten? Sie senden uns Ihre Angaben, Fotos und einen Nachweis. Wir prüfen, was möglich ist, und melden uns mit Preis und Termin oder einer Rückfrage.',
    ],
  },
  {
    titel: 'Nachweis statt Fahrzeugschein',
    absaetze: [
      'Diese Fahrzeuge haben meist keinen Fahrzeugschein. Als Nachweis genügt zum Beispiel die Betriebserlaubnis, die Versicherungsbescheinigung oder der Kaufbeleg. Dazu kommt ein Foto des Typenschilds oder die Fahrzeug-Identifizierungsnummer, wenn Ihr Fahrzeug ein Typenschild hat.',
    ],
  },
  {
    titel: 'Wem gehört das Fahrzeug?',
    absaetze: [
      'Gehört das Fahrzeug nicht Ihnen, etwa weil es Ihnen nur überlassen wurde, klären Sie die Anfertigung bitte vorher mit dem Eigentümer.',
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('seniorenmobil', 'einstieg')), alternates: { canonical: ANFRAGE_FORMULAR['seniorenmobil'].einstieg ?? undefined } };
}

/** Einstiegsseite Seniorenmobile und vergleichbare Fahrzeuge (FA-KERN-02B). */
export default async function SeniorenmobilePage() {
  const ablauf = (
    <RubrikAblaufAbschnitt
      rubrik={await getRubrik('seniorenmobile')}
      nummer={String(ABSCHNITTE.length + 1).padStart(2, '0')}
      titel="So läuft Ihre Anfrage ab"
    />
  );
  return <EinstiegSeite klasse="seniorenmobil" abschnitte={ABSCHNITTE} ablauf={ablauf} />;
}
