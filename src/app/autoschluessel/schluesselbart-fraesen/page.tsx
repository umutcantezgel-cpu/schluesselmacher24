import type { Metadata } from 'next';

import { getPageContent } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { ServiceArticle } from '@/components/autoschluessel/service-article';

const ROUTE = 'autoschluessel/schluesselbart-fraesen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüsselbart fräsen nach Vorlage oder Fahrzeugdaten',
    description:
      page?.seo.description
      ?? 'Schlüsselbart für Autoschlüssel fräsen lassen — nach Original oder geeigneten '
        + 'Fahrzeugdaten.',
    alternates: { canonical: '/autoschluessel/schluesselbart-fraesen' },
  };
}

const BART_HINT: InfoHint = {
  title: 'Was genau ist der Bart?',
  body:
    'Der Bart ist der metallene Teil des Schlüssels mit den Einschnitten. Er allein entscheidet, ob '
    + 'der Schlüssel mechanisch ins Schloss passt und sich drehen lässt. Die Elektronik im Griff hat '
    + 'damit nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnittpositionen und Tiefenangaben',
    ratio: '3/2',
    note: 'Technische Zeichnung, keine Fotomontage.',
  },
};

const VORLAGE_HINT: InfoHint = {
  title: 'Nach Vorlage oder nach Daten?',
  body:
    'Nach Vorlage heißt: Wir übertragen die Einschnitte eines vorhandenen Schlüssels. Nach Daten '
    + 'heißt: Wir fertigen anhand geeigneter Fahrzeugunterlagen, wenn kein Schlüssel mehr da ist. '
    + 'Welcher Weg in Ihrem Fall gangbar ist, prüfen wir vorab.',
};

export default async function SchluesselbartFraesenPage() {
  const page = await getPageContent(ROUTE);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Schlüsselbart fräsen',
        subline: 'Mechanische Fertigung nach Vorlage oder geeigneten Fahrzeugdaten.',
        intro:
          'Der Bart ist der mechanische Teil des Schlüssels. Wir fräsen ihn nach einem vorhandenen '
          + 'Schlüssel oder anhand geeigneter Fahrzeugdaten.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen' },
      ]}
      image={{
        motif: 'Werkstattfoto: Schlüsselfräse im Betrieb, Rohling eingespannt, Späne sichtbar',
        ratio: '4/3',
        note: 'Eigene Aufnahme aus der Werkstatt. Kein Stockfoto.',
      }}
      what={{
        title: 'Wie das Fräsen abläuft',
        paragraphs: [
          'Beim Fräsen wird ein passender Rohling eingespannt und die Einschnitte werden maßgenau '
          + 'eingearbeitet. Entscheidend sind zwei Dinge: der richtige Rohling für Ihr Fahrzeug und '
          + 'eine brauchbare Grundlage für die Einschnitte.',
          'Diese Grundlage kann ein vorhandener Schlüssel sein oder — wenn keiner mehr da ist — '
          + 'geeignete Fahrzeugunterlagen. Der zweite Weg ist aufwendiger, weil zuerst geprüft '
          + 'werden muss, ob und woher die nötigen Angaben zu bekommen sind.',
          'Das Fräsen betrifft ausschließlich die Mechanik. Ob der fertige Schlüssel den Motor '
          + 'startet, entscheidet die Elektronik — und damit die Frage, ob zusätzlich programmiert '
          + 'werden muss.',
        ],
      }}
      when={{
        title: 'Wann ein neuer Bart nötig ist',
        items: [
          {
            title: 'Der Bart ist abgebrochen',
            body:
              'Das Funkteil ist in Ordnung, nur der mechanische Teil fehlt. Dann wird allein der '
              + 'Bart ersetzt.',
            hint: BART_HINT,
          },
          {
            title: 'Der Schlüssel ist abgenutzt',
            body:
              'Ein Schlüssel, der schwergängig geworden ist, kann im Schloss abbrechen. Ein sauber '
              + 'gefräster Bart beugt dem vor.',
          },
          {
            title: 'Ein Rohling soll zum vorhandenen Funkteil passen',
            body:
              'Sie haben ein Gehäuse mit Elektronik, aber keinen passend gefrästen Bart. Den '
              + 'arbeiten wir ein.',
          },
          {
            title: 'Es ist kein Schlüssel mehr vorhanden',
            body:
              'Dann fertigen wir nach geeigneten Fahrzeugunterlagen — sofern diese beschaffbar sind.',
            hint: VORLAGE_HINT,
          },
          {
            title: 'Sie brauchen einen rein mechanischen Reserveschlüssel',
            body:
              'Ein Schlüssel, der nur die Tür öffnen soll, kommt ohne Elektronik aus.',
          },
          {
            title: 'Zubehör mit eigener Schließung',
            body:
              'Dachbox, Anhängerkupplung oder Werkzeugkasten haben oft eigene Schlösser ohne '
              + 'Fahrzeugelektronik.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Ohne eine brauchbare Grundlage lässt sich kein maßhaltiger Bart fertigen.',
        items: [
          {
            title: 'Fotos des vorhandenen Schlüssels',
            body:
              'Besonders wichtig: der Bart von der Seite, scharf und formatfüllend. Daran erkennen '
              + 'wir Profil und Rohling.',
          },
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr.',
          },
          {
            title: 'Schlüssel- oder Schlüsselnummer, falls vorhanden',
            body:
              'Manche Schlüssel und Schlösser tragen eine eingeprägte Nummer. Sie erleichtert die '
              + 'Zuordnung des Rohlings.',
          },
          {
            title: 'Angabe, ob der Schlüssel starten soll',
            body:
              'Nur öffnen oder auch fahren? Davon hängt ab, ob zusätzlich angelernt werden muss.',
          },
          {
            title: 'Nachweis der Verfügungsberechtigung',
            body: 'Ausweisdokument und Fahrzeugschein beim Termin oder bei der Abholung.',
          },
        ],
      }}
      boundary={{
        title: 'Abgrenzung — was Fräsen nicht einschließt',
        items: [
          {
            title: 'Fräsen ist nicht Programmieren',
            body:
              'Ein gefräster Bart ohne passende Elektronik startet bei Fahrzeugen mit Wegfahrsperre '
              + 'den Motor nicht.',
          },
          {
            title: 'Keine Funkfunktion',
            body:
              'Ver- und Entriegeln per Knopfdruck entsteht beim Fräsen nicht. Das ist ein '
              + 'elektronischer Teil.',
          },
          {
            title: 'Kein Nachbau bei unbrauchbarer Vorlage',
            body:
              'Ist der vorhandene Bart verbogen oder stark abgenutzt, übernähme die Anfertigung den '
              + 'Fehler. Wir sagen Ihnen vorher, wenn die Vorlage nicht taugt.',
          },
          {
            title: 'Keine Zusage bei fehlenden Daten',
            body:
              'Ohne Schlüssel und ohne beschaffbare Fahrzeugdaten lässt sich kein Bart fertigen. '
              + 'Solche Fälle prüfen wir und melden uns mit einer klaren Aussage.',
          },
        ],
      }}
      faq={[
        {
          question: 'Brauchen Sie meinen Originalschlüssel dafür?',
          answer:
            'Für die Einschätzung reichen in vielen Fällen Fotos. Ob wir für die Anfertigung das '
            + 'Original benötigen, sagen wir Ihnen nach der Prüfung.',
        },
        {
          question: 'Kann ein Bart auch ohne vorhandenen Schlüssel gefertigt werden?',
          answer:
            'Das kommt darauf an, ob sich geeignete Fahrzeugunterlagen beschaffen lassen. Wir prüfen '
            + 'das im Einzelfall und sagen Ihnen ehrlich, ob der Weg gangbar ist.',
        },
        {
          question: 'Startet der Motor mit dem neuen Bart?',
          answer:
            'Nur, wenn die Elektronik stimmt. Bei Fahrzeugen mit Wegfahrsperre ist zusätzlich das '
            + 'Anlernen nötig. Wir sagen Ihnen vorher, was in Ihrem Fall dazugehört.',
        },
        {
          question: 'Kann ich meinen Schlüssel einschicken?',
          answer:
            'Für reine Fräsarbeiten ist das in vielen Fällen möglich. Muss anschließend am Fahrzeug '
            + 'angelernt werden, ist ein Termin mit Fahrzeug der richtige Weg.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Für Fahrzeugschlüssel führt der Weg über den geführten Ablauf. Für Schlüssel ohne '
          + 'Fahrzeugbezug nutzen Sie die Anfrage nach Vorlage.',
        primary: { href: '/autoschluessel/anfrage', label: 'Fahrzeug auswählen' },
        secondary: { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' },
      }}
      related={[
        { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren', description: 'Anfertigung nach vorhandener Vorlage' },
        { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Der elektronische Teil' },
        { href: '/ratgeber/schluesselcode-finden', label: 'Wo finde ich den Schlüsselcode?', description: 'Typische Fundstellen' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
