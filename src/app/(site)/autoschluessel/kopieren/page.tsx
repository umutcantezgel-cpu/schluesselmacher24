import type { Metadata } from 'next';

import { getPageContent } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ServiceArticle } from '@/components/autoschluessel/service-article';

const ROUTE = 'autoschluessel/kopieren';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel kopieren in Wetzlar',
    description:
      page?.seo.description
      ?? 'Wir kopieren den mechanischen Teil Ihres Autoschlüssels nach Vorlage. Der Kopie fehlt '
        + 'der Transponder, darum klären wir vorab, was in Ihrem Fall reicht.',
    alternates: { canonical: '/autoschluessel/kopieren' },
  };
}

const KOPIE_HINT: InfoHint = {
  title: 'Kopie oder vollwertiger Schlüssel?',
  body:
    'Eine Kopie hat nur den mechanischen Bart. Ein vollwertiger Schlüssel hat zusätzlich die '
    + 'Elektronik, die das Fahrzeug erkennt. Was Sie brauchen, hängt davon ab, ob Ihr Fahrzeug eine '
    + 'Wegfahrsperre hat.',
  figure: {
    motif: 'Vergleichsfoto: reiner Bartschlüssel neben vollständigem Funkschlüssel',
    ratio: '3/2',
  },
};

export default async function KopierenPage() {
  const page = await getPageContent(ROUTE);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Autoschlüssel kopieren',
        subline: 'Wir kopieren den mechanischen Teil Ihres Autoschlüssels nach Vorlage.',
        intro:
          'Die Kopie passt ins Schloss und öffnet bei vielen Fahrzeugen die Tür. Den Motor startet '
          + 'sie dort aber nicht. Der Kopie fehlt der Transponder, ein kleiner Chip im Schlüssel. Ohne ihn '
          + 'gibt die Wegfahrsperre den Motor nicht frei. Was in Ihrem Fall reicht, klären wir vorab.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/kopieren', label: 'Kopieren' },
      ]}
      image={{
        motif: 'Werkstattfoto: Kopierfräse mit eingespanntem Originalschlüssel und Rohling',
        ratio: '4/3',
        note: 'Eigene Aufnahme, Original und Rohling nebeneinander im Spannfutter.',
      }}
      what={{
        title: 'Was wir machen',
        paragraphs: [
          'Wir übertragen die Einschnitte Ihres Schlüssels auf einen passenden Rohling, also einen '
          + 'noch ungefrästen Schlüssel. Die Kopie arbeitet mechanisch genauso wie das Original.',
          'Die Elektronik wird nicht mitkopiert. Deshalb startet die Kopie den Motor oft nicht. Das '
          + 'ist kein Fehler, so soll die Wegfahrsperre wirken.',
          'Wir klären vorab, welches System Ihr Fahrzeug hat. Dann sagen wir Ihnen, ob eine Kopie '
          + 'reicht oder ob zusätzlich programmiert werden muss.',
        ],
      }}
      when={{
        title: 'Wann eine Kopie reicht',
        items: [
          {
            title: 'Ihr Fahrzeug hat keine Wegfahrsperre',
            body:
              'Bei älteren Fahrzeugen ohne elektronische Wegfahrsperre ist die Kopie ein vollwertiger '
              + 'Schlüssel.',
            hint: KOPIE_HINT,
          },
          {
            title: 'Der Schlüssel soll nur aufschließen',
            body:
              'Etwa für Türen, Heckklappe oder Handschuhfach oder als Reserve für den Notfall. Zubehör '
              + 'wie Dachbox oder Anhängerkupplung hat oft eigene Schlösser. Auch diese Schlüssel '
              + 'kopieren wir.',
          },
          {
            title: 'Der Originalbart ist abgenutzt',
            body:
              'Ein schwergängiger Schlüssel kann im Schloss abbrechen. Ein sauber gefräster Bart '
              + 'beugt dem vor.',
          },
          {
            title: 'Als erster Schritt zum vollwertigen Schlüssel',
            body:
              'Zuerst fräsen wir den Bart, danach kommt die Elektronik dazu. So laufen viele Aufträge '
              + 'ab.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Für eine Kopie brauchen wir eine gute Vorlage.',
        items: [
          {
            title: 'Drei Fotos des Schlüssels',
            body:
              'Vorderseite, Rückseite und den Bart von der Seite. Bitte scharf und gut ausgeleuchtet.',
          },
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr. Daran sehen wir, ob Elektronik im Spiel ist.',
          },
          {
            title: 'Schlüsselnummer, falls vorhanden',
            body:
              'Manche Schlüssel und Schlösser tragen eine eingeprägte Nummer. Sie kann die '
              + 'Anfertigung erleichtern.',
          },
          {
            title: 'Wofür der Schlüssel gedacht ist',
            body:
              'Sagen Sie uns, ob er nur öffnen oder auch starten soll. Davon hängt ab, ob eine Kopie '
              + 'reicht.',
          },
          {
            title: 'Ihr Nachweis beim Termin oder bei der Abholung',
            body:
              'Sie zeigen uns Ihren Ausweis und den Fahrzeugschein. Steht das Fahrzeug nicht auf '
              + 'Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters.',
          },
        ],
      }}
      boundary={{
        title: 'Was eine Kopie nicht kann',
        items: [
          {
            title: 'Kein Transponder',
            body:
              'Der Chip des Originals wird nicht mitkopiert. Bei Fahrzeugen mit Wegfahrsperre startet '
              + 'der Motor deshalb nicht.',
          },
          {
            title: 'Keine Funktasten',
            body:
              'Ver- und Entriegeln per Knopfdruck ist eine elektronische Funktion. Sie entsteht beim '
              + 'Kopieren nicht.',
          },
          {
            title: 'Keine Kopie ohne Vorlage',
            body:
              'Ist kein Schlüssel mehr da, gibt es nichts zu kopieren. Dann führt der Weg über Ersatz '
              + 'und Programmierung.',
          },
          {
            title: 'Keine Kopie einer beschädigten Vorlage',
            body:
              'Ist der Bart verbogen oder stark abgenutzt, würde die Kopie den Fehler übernehmen. Wir '
              + 'sagen es Ihnen vorher, wenn die Vorlage nicht taugt.',
          },
        ],
      }}
      faq={[
        {
          question: 'Woran erkenne ich, ob mein Fahrzeug eine Wegfahrsperre hat?',
          answer:
            'Ein Hinweis ist das Baujahr. Bei neueren Fahrzeugen ist eine elektronische Wegfahrsperre '
            + 'die Regel. Sicher sagen wir es anhand von Marke, Modell, Baujahr und Ihren '
            + 'Schlüsselfotos.',
        },
        {
          question: 'Kann ich später noch programmieren lassen?',
          answer:
            'Ja, wenn der Rohling passt und die nötige Elektronik aufnehmen kann. Dafür brauchen Sie '
            + 'dann einen Termin mit Fahrzeug.',
        },
        {
          question: 'Muss ich meinen Originalschlüssel einschicken?',
          answer:
            'In vielen Fällen nicht. Für die erste Einschätzung reichen Fotos. Ob wir das Original '
            + 'brauchen, sagen wir Ihnen nach der Prüfung.',
        },
        {
          question: 'Kopieren Sie jeden Autoschlüssel?',
          answer:
            'Wir prüfen jeden Fall einzeln. Es kommt auf die Bauform, einen passenden Rohling und '
            + 'Ihren Nachweis an. Können wir etwas nicht anfertigen, sagen wir es vor der Beauftragung.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Für Fahrzeugschlüssel nutzen Sie die geführte Anfrage. Für Schlüssel ohne Fahrzeugbezug '
          + 'ist die Anfrage nach Vorlage der richtige Weg.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin anfragen' },
        secondary: { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' },
      }}
      related={[
        { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen', description: 'Fertigung ohne vorhandene Kopiervorlage' },
        { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Der elektronische Teil' },
        { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    >
      {/* Abgrenzung als eigener, deutlich sichtbarer Hinweis */}
      <Section>
        <SectionHeading
          eyebrow="Kurz zusammengefasst"
          title="Öffnen und Starten sind zwei verschiedene Dinge"
          className="max-w-2xl"
        />
        <Alert tone="warning" title="Bitte vor der Beauftragung lesen" className="mt-6">
          Eine Kopie öffnet bei vielen Fahrzeugen die Tür, startet aber den Motor nicht. Wollen Sie
          mit dem Schlüssel auch fahren, muss zusätzlich die Elektronik angelernt werden. Was Ihr
          Fahrzeug braucht, sagen wir Ihnen vor der Beauftragung.
        </Alert>
      </Section>
    </ServiceArticle>
  );
}
