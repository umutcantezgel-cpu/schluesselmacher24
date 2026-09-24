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
    title: page?.seo.title ?? 'Autoschlüssel kopieren — was mechanisch möglich ist',
    description:
      page?.seo.description
      ?? 'Mechanische Kopie von Autoschlüsseln nach Vorlage. Wir erklären, wann eine Kopie reicht '
        + 'und wann zusätzlich programmiert werden muss.',
    alternates: { canonical: '/autoschluessel/kopieren' },
  };
}

const KOPIE_HINT: InfoHint = {
  title: 'Kopie oder vollwertiger Schlüssel?',
  body:
    'Eine Kopie bildet allein den mechanischen Bart ab. Ein vollwertiger Schlüssel enthält '
    + 'zusätzlich die Elektronik, die das Fahrzeug erkennt. Welche Variante Sie brauchen, hängt '
    + 'davon ab, ob Ihr Fahrzeug eine Wegfahrsperre hat.',
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
        subline: 'Mechanische Kopie nach Vorlage — und was sie leistet.',
        intro:
          'Eine mechanische Kopie bildet den Bart des Originals ab. Ob sie in Ihrem Fall ausreicht, '
          + 'hängt vom Fahrzeug ab.',
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
        title: 'Was eine Kopie genau ist',
        paragraphs: [
          'Beim Kopieren übertragen wir die Einschnitte eines vorhandenen Schlüssels auf einen '
          + 'passenden Rohling. Das Ergebnis ist ein Schlüssel, der mechanisch genauso arbeitet wie '
          + 'das Original: Er passt in dasselbe Schloss.',
          'Die Elektronik wird dabei nicht übertragen. Hat Ihr Fahrzeug eine Wegfahrsperre, öffnet '
          + 'die Kopie in vielen Fällen zwar die Tür, startet aber den Motor nicht. Das ist kein '
          + 'Fehler der Kopie, sondern die beabsichtigte Wirkung der Wegfahrsperre.',
          'Deshalb klären wir vorab, welches System Ihr Fahrzeug hat. Auf dieser Grundlage sagen wir '
          + 'Ihnen, ob eine Kopie für Ihren Zweck genügt oder ob zusätzlich programmiert werden muss.',
        ],
      }}
      when={{
        title: 'Wann reicht eine Kopie aus?',
        lead: 'In diesen Fällen ist die rein mechanische Anfertigung der richtige Weg.',
        items: [
          {
            title: 'Fahrzeuge ohne Wegfahrsperre',
            body:
              'Bei älteren Fahrzeugen ohne elektronische Wegfahrsperre ist die Kopie ein vollwertiger '
              + 'Schlüssel.',
            hint: KOPIE_HINT,
          },
          {
            title: 'Zweitschlüssel nur zum Aufschließen',
            body:
              'Wenn der Schlüssel ausschließlich Türen, Heckklappe oder Handschuhfach öffnen soll '
              + 'und nicht zum Starten gedacht ist.',
          },
          {
            title: 'Reserveschlüssel für den Notfall',
            body:
              'Ein mechanischer Schlüssel, der zu Hause liegt und im Ernstfall wenigstens den Zugang '
              + 'zum Fahrzeug sichert.',
          },
          {
            title: 'Abgenutzter Originalbart',
            body:
              'Wenn der vorhandene Schlüssel schwergängig geworden ist, hilft ein sauber gefräster '
              + 'Bart — bevor er im Schloss abbricht.',
          },
          {
            title: 'Zusatzschlüssel für Anhängerkupplung oder Dachbox',
            body:
              'Zubehör am Fahrzeug hat häufig eigene Schließungen ohne jede Elektronik.',
          },
          {
            title: 'Als Vorstufe zum vollwertigen Schlüssel',
            body:
              'Der Bart wird gefräst, die Elektronik kommt in einem zweiten Schritt dazu. Das ist bei '
              + 'vielen Aufträgen der übliche Ablauf.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Für eine Kopie ist eine brauchbare Vorlage entscheidend.',
        items: [
          {
            title: 'Fotos des vorhandenen Schlüssels',
            body:
              'Drei Aufnahmen: Vorderseite, Rückseite und der Bart von der Seite, möglichst scharf '
              + 'und gut ausgeleuchtet.',
          },
          {
            title: 'Fahrzeugdaten',
            body:
              'Marke, Modell und Baujahr. Daraus ergibt sich, ob und welche Elektronik im Spiel ist.',
          },
          {
            title: 'Schlüsselnummer, falls vorhanden',
            body:
              'Manche Schlüssel und Schlösser tragen eine eingeprägte Nummer. Sie kann die '
              + 'Anfertigung erleichtern.',
          },
          {
            title: 'Angabe, wofür der Schlüssel gedacht ist',
            body:
              'Nur öffnen oder auch starten? Diese Angabe entscheidet darüber, ob eine Kopie '
              + 'ausreicht.',
          },
          {
            title: 'Nachweis der Verfügungsberechtigung',
            body:
              'Ausweisdokument und Fahrzeugschein beim Termin oder bei der Abholung.',
          },
        ],
      }}
      boundary={{
        title: 'Abgrenzung — was eine Kopie nicht kann',
        lead: 'Diese Punkte sind der häufigste Grund für Missverständnisse. Bitte lesen Sie sie.',
        items: [
          {
            title: 'Eine Kopie ersetzt keinen Transponder',
            body:
              'Der Chip im Original wird nicht mitkopiert. Bei Fahrzeugen mit Wegfahrsperre '
              + 'startet der Motor deshalb nicht.',
          },
          {
            title: 'Keine Funkfunktion',
            body:
              'Ver- und Entriegeln per Knopfdruck ist eine elektronische Funktion. Sie entsteht beim '
              + 'Kopieren nicht.',
          },
          {
            title: 'Kein Ersatz bei Totalverlust',
            body:
              'Ohne vorhandenen Schlüssel gibt es keine Vorlage. Dann ist der Weg über Ersatz und '
              + 'Programmierung der richtige.',
          },
          {
            title: 'Kein Nachbau bei beschädigter Vorlage',
            body:
              'Ist der Bart verbogen oder stark abgenutzt, würde die Kopie den Fehler übernehmen. '
              + 'Wir sagen Ihnen vorher, wenn die Vorlage nicht taugt.',
          },
        ],
      }}
      faq={[
        {
          question: 'Woran erkenne ich, ob mein Fahrzeug eine Wegfahrsperre hat?',
          answer:
            'Ein Anhaltspunkt ist das Baujahr: Bei neueren Fahrzeugen ist eine elektronische '
            + 'Wegfahrsperre die Regel. Sicher sagen können wir es anhand von Marke, Modell, Baujahr '
            + 'und Ihren Schlüsselfotos.',
        },
        {
          question: 'Kann ich später noch programmieren lassen?',
          answer:
            'Ja. Wenn der Rohling passt und die nötige Elektronik aufgenommen werden kann, ist die '
            + 'Programmierung als zweiter Schritt möglich. Dafür ist dann ein Termin mit Fahrzeug '
            + 'erforderlich.',
        },
        {
          question: 'Muss ich meinen Originalschlüssel einschicken?',
          answer:
            'In vielen Fällen nicht. Für die erste Einschätzung reichen Fotos. Ob wir für die '
            + 'Anfertigung das Original benötigen, sagen wir Ihnen nach der Prüfung.',
        },
        {
          question: 'Kopieren Sie jeden Autoschlüssel?',
          answer:
            'Wir prüfen jeden Fall einzeln. Maßgeblich sind die Bauform, die Verfügbarkeit eines '
            + 'passenden Rohlings und Ihr Nachweis der Verfügungsberechtigung. Wenn wir etwas nicht '
            + 'anfertigen können, sagen wir das vor der Beauftragung.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Für Fahrzeugschlüssel nutzen Sie den geführten Ablauf. Für Schlüssel ohne Fahrzeugbezug '
          + 'ist die Anfrage nach Vorlage der passende Weg.',
        primary: { href: '/autoschluessel/anfrage', label: 'Fahrzeug auswählen' },
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
          Eine mechanische Kopie öffnet bei vielen Fahrzeugen die Tür, startet aber den Motor nicht.
          Wenn Sie einen Schlüssel brauchen, mit dem Sie auch fahren können, ist zusätzlich das
          Anlernen der Elektronik nötig. Was Ihr Fahrzeug benötigt, sagen wir Ihnen, bevor Sie
          beauftragen.
        </Alert>
      </Section>
    </ServiceArticle>
  );
}
