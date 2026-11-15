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
    'Der Bart ist der metallene Teil des Schlüssels mit den Einschnitten. Nur er entscheidet, ob '
    + 'der Schlüssel ins Schloss passt und sich drehen lässt. Mit der Elektronik im Griff hat er '
    + 'nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnittpositionen und Tiefenangaben',
    ratio: '3/2',
    note: 'Technische Zeichnung, keine Fotomontage.',
  },
};

const VORLAGE_HINT: InfoHint = {
  title: 'Nach Vorlage oder nach Daten?',
  body:
    'Nach Vorlage heißt, wir übertragen die Einschnitte eines vorhandenen Schlüssels. Nach Daten '
    + 'heißt, wir fertigen nach geeigneten Fahrzeugunterlagen, wenn kein Schlüssel mehr da ist. '
    + 'Welcher Weg in Ihrem Fall möglich ist, prüfen wir vorab.',
};

export default async function SchluesselbartFraesenPage() {
  const page = await getPageContent(ROUTE);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Schlüsselbart fräsen',
        subline: 'Wir fräsen den Bart Ihres Autoschlüssels nach Vorlage oder nach Fahrzeugdaten.',
        intro:
          'Der Bart ist der metallene Teil mit den Einschnitten, der ins Schloss passt. Als Vorlage '
          + 'dient ein vorhandener Schlüssel oder geeignete Fahrzeugdaten. Die Elektronik ist davon '
          + 'unabhängig.',
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
        title: 'So läuft es ab',
        paragraphs: [
          'Wir spannen einen passenden Rohling ein, also einen noch ungefrästen Schlüssel. Dann '
          + 'fräsen wir die Einschnitte maßgenau ein. Wichtig sind der richtige Rohling und eine '
          + 'brauchbare Vorlage.',
          'Die Vorlage ist meist ein vorhandener Schlüssel. Ist keiner mehr da, nutzen wir geeignete '
          + 'Fahrzeugunterlagen. Das ist aufwendiger, weil wir erst klären, ob und woher wir die '
          + 'Angaben bekommen.',
          'Fräsen betrifft nur die Mechanik. Ob der Schlüssel den Motor startet, hängt von der '
          + 'Elektronik ab. Je nach Fahrzeug muss er dafür zusätzlich programmiert werden.',
        ],
      }}
      when={{
        title: 'Wann ein neuer Bart nötig ist',
        items: [
          {
            title: 'Der Bart ist abgebrochen',
            body: 'Das Funkteil ist in Ordnung, nur der Bart fehlt. Dann ersetzen wir nur ihn.',
            hint: BART_HINT,
          },
          {
            title: 'Der Schlüssel ist abgenutzt',
            body:
              'Ein schwergängiger Schlüssel kann im Schloss abbrechen. Ein sauber gefräster Bart '
              + 'beugt dem vor.',
          },
          {
            title: 'Ein Funkteil ohne passenden Bart',
            body:
              'Sie haben ein Gehäuse mit Elektronik, aber der Bart ist nicht passend gefräst. Den '
              + 'fräsen wir ein.',
          },
          {
            title: 'Es ist kein Schlüssel mehr da',
            body:
              'Dann fertigen wir nach geeigneten Fahrzeugunterlagen, sofern sie sich beschaffen '
              + 'lassen.',
            hint: VORLAGE_HINT,
          },
          {
            title: 'Ein Schlüssel nur zum Öffnen',
            body:
              'Etwa ein Reserveschlüssel für die Tür. Auch Dachbox, Anhängerkupplung oder '
              + 'Werkzeugkasten haben oft eigene Schlösser ohne Elektronik.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Für einen passgenauen Bart brauchen wir eine brauchbare Grundlage.',
        items: [
          {
            title: 'Fotos des vorhandenen Schlüssels',
            body:
              'Vor allem den Bart von der Seite, scharf und bildfüllend. Daran erkennen wir Profil '
              + 'und Rohling.',
          },
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr.',
          },
          {
            title: 'Schlüsselnummer, falls vorhanden',
            body:
              'Manche Schlüssel und Schlösser tragen eine eingeprägte Nummer. Sie hilft uns, den '
              + 'Rohling zuzuordnen.',
          },
          {
            title: 'Ob der Schlüssel starten soll',
            body:
              'Sagen Sie uns, ob er nur öffnen oder auch starten soll. Davon hängt ab, ob zusätzlich '
              + 'angelernt werden muss.',
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
        title: 'Was nicht dazugehört',
        items: [
          {
            title: 'Fräsen ist nicht Programmieren',
            body:
              'Viele Fahrzeuge haben eine Wegfahrsperre, die den Motor nur mit einem angemeldeten '
              + 'Schlüssel freigibt. Dort startet ein neuer Bart ohne passende Elektronik den Motor '
              + 'nicht. Auch Funktasten entstehen beim Fräsen nicht.',
          },
          {
            title: 'Kein Nachbau einer unbrauchbaren Vorlage',
            body:
              'Ist der vorhandene Bart verbogen oder stark abgenutzt, würde der neue Bart den Fehler '
              + 'übernehmen. Wir sagen es Ihnen vorher, wenn die Vorlage nicht taugt.',
          },
          {
            title: 'Keine Zusage ohne Daten',
            body:
              'Ohne Schlüssel und ohne beschaffbare Fahrzeugdaten lässt sich kein Bart fertigen. '
              + 'Solche Fälle prüfen wir und geben Ihnen eine klare Antwort.',
          },
        ],
      }}
      faq={[
        {
          question: 'Brauchen Sie meinen Originalschlüssel dafür?',
          answer:
            'Für die Einschätzung reichen in vielen Fällen Fotos. Ob wir das Original für die '
            + 'Anfertigung brauchen, sagen wir Ihnen nach der Prüfung.',
        },
        {
          question: 'Kann ein Bart auch ohne vorhandenen Schlüssel gefertigt werden?',
          answer:
            'Das hängt davon ab, ob sich geeignete Fahrzeugunterlagen beschaffen lassen. Wir prüfen '
            + 'den Einzelfall und sagen Ihnen ehrlich, ob der Weg möglich ist.',
        },
        {
          question: 'Startet der Motor mit dem neuen Bart?',
          answer:
            'Nur wenn die Elektronik stimmt. Bei Fahrzeugen mit Wegfahrsperre muss der Schlüssel '
            + 'zusätzlich angelernt werden. Was in Ihrem Fall dazugehört, sagen wir Ihnen vorher.',
        },
        {
          question: 'Kann ich meinen Schlüssel einschicken?',
          answer:
            'Für reine Fräsarbeiten geht das in vielen Fällen. Muss danach am Fahrzeug angelernt '
            + 'werden, brauchen Sie einen Termin mit Fahrzeug.',
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
        { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren', description: 'Anfertigung nach vorhandener Vorlage' },
        { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Der elektronische Teil' },
        { href: '/ratgeber/schluesselcode-finden', label: 'Wo finde ich den Schlüsselcode?', description: 'Typische Fundstellen' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
