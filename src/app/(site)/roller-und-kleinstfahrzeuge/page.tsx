import type { Metadata } from 'next';

import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import { EinstiegSeite, seitenMetadata, type EinstiegAbschnitt } from '@/components/fahrzeug-anfrage/einstieg';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { getPageContent, getRubrik } from '@/lib/data';
import { KlassenSeitenDaten } from '@/components/seo/seiten-daten';
import { PasstDazu } from '@/components/seo/passt-dazu';

/*
 * Eigener Inhalt dieser Seite (R3): Roller, Mofa und Moped gibt es mit Fahrzeugschein und mit
 * Versicherungskennzeichen; danach richtet sich der Nachweis. Keine Preise, keine Zeiten (R4).
 */
const ABSCHNITTE: EinstiegAbschnitt[] = [
  {
    titel: 'Was wir für Sie tun',
    absaetze: [
      'Sie brauchen einen Zweitschlüssel, der Schlüssel ist abgebrochen oder verloren? Sie senden uns Ihre Angaben, Fotos und einen Nachweis. Wir prüfen, ob und wie wir einen Schlüssel für Ihr Fahrzeug anfertigen können, und melden uns mit Preis und Termin oder einer Rückfrage.',
    ],
  },
  {
    titel: 'Fahrzeugschein oder Versicherungskennzeichen',
    absaetze: [
      'Kleinkrafträder wie viele Roller, Mofas und Mopeds sind nicht zugelassen. Sie fahren mit einem Versicherungskennzeichen, dem kleinen Schild der Versicherung, und haben keinen Fahrzeugschein.',
      'In der Anfrage wählen Sie, was auf Ihr Fahrzeug zutrifft. Mit Fahrzeugschein laden Sie ihn hoch. Mit Versicherungskennzeichen genügt ein anderer Nachweis, etwa die Versicherungsbescheinigung, dazu ein Foto des Typenschilds oder die Fahrzeug-Identifizierungsnummer, wenn es eines gibt.',
    ],
  },
  {
    titel: 'Chip im Schlüssel',
    absaetze: [
      'Auch ein Roller kann eine Wegfahrsperre haben. Dann springt er ohne den passenden Chip im Schlüssel nicht an. Wenn Sie es nicht wissen, wählen Sie in der Anfrage „Weiß ich nicht“; wir klären es anhand Ihrer Fotos.',
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  // Eigene kanonische Adresse dieser Seite; noindex nach dem Schalter der Klasse (seitenMetadata).
  return { ...(await seitenMetadata('roller', 'einstieg')), alternates: { canonical: ANFRAGE_FORMULAR['roller'].einstieg ?? undefined } };
}

/** Einstiegsseite Roller und Kleinstfahrzeuge (FA-KERN-02B). */
export default async function RollerPage() {
  const ablauf = (
    <RubrikAblaufAbschnitt
      rubrik={await getRubrik('roller-und-kleinstfahrzeuge')}
      nummer={String(ABSCHNITTE.length + 1).padStart(2, '0')}
      titel="So läuft Ihre Anfrage ab"
    />
  );
  return (
    <>
      <KlassenSeitenDaten klasse="roller" art="einstieg" />
      <EinstiegSeite klasse="roller" abschnitte={ABSCHNITTE} ablauf={ablauf} />
      {/* Verweisliste aus den Daten: eigene Links und Gegenrichtung (FA-SEO-01C) */}
      <PasstDazu pfad="/roller-und-kleinstfahrzeuge" eigene={(await getPageContent('roller-und-kleinstfahrzeuge'))?.seo.internalLinks} />
    </>
  );
}
