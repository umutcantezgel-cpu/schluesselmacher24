import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { ServiceArticle } from '@/components/autoschluessel/service-article';

const ROUTE = 'autoschluessel/funkschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Funkschlüssel und Funkfernbedienung',
    description:
      page?.seo.description
      ?? 'Funkschlüssel reparieren, Gehäuse und Tasten tauschen, Funkfunktion prüfen und Ersatz '
        + 'anfertigen lassen.',
    alternates: { canonical: '/autoschluessel/funkschluessel' },
  };
}

const AUFBAU_HINT: InfoHint = {
  title: 'Woraus ein Funkschlüssel besteht',
  body:
    'Ein Funkschlüssel vereint mehrere Bauteile: Gehäuse und Tasten außen, darunter eine Platine '
    + 'mit Sender, eine Batterie, der Transponder für die Wegfahrsperre und der mechanische Bart. '
    + 'Jedes dieser Teile kann einzeln ausfallen — deshalb grenzen wir die Ursache ein, bevor wir '
    + 'etwas tauschen.',
  figure: {
    motif: 'Explosionsdarstellung: geöffneter Funkschlüssel mit Gehäuse, Platine, Batterie und Bart',
    ratio: '3/2',
    note: 'Eigene Aufnahme aller Bauteile nebeneinander auf neutralem Grund.',
  },
};

export default async function FunkschluesselPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const deposit = formatCents(settings.booking.depositCents);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Funkschlüssel und Funkfernbedienung',
        subline: 'Tasten, Funkfunktion, Gehäuse und Ersatz.',
        intro:
          'Wenn das Fahrzeug auf Knopfdruck nicht mehr reagiert, liegt das nicht immer am Schlüssel. '
          + 'Wir grenzen die Ursache ein, bevor etwas getauscht wird.',
      }}
      eyebrow="Schlüsselart"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel' },
      ]}
      image={{
        motif: 'Werkstattfoto: geöffneter Funkschlüssel auf der Reparaturmatte mit Platine und Batterie',
        ratio: '4/3',
        note: 'Eigene Aufnahme, Bauteile deutlich erkennbar.',
      }}
      what={{
        title: 'Was ein Funkschlüssel ist — und was daran kaputtgehen kann',
        paragraphs: [
          'Ein Funkschlüssel ist ein Schlüssel mit Tasten zum Ver- und Entriegeln. Die Funkfunktion '
          + 'arbeitet über einen kleinen Sender im Gehäuse. Der mechanische Bart und der Transponder '
          + 'für die Wegfahrsperre sind davon unabhängig.',
          'Genau diese Trennung erklärt die meisten Fehlerbilder: Wenn die Tasten nichts mehr '
          + 'bewirken, der Motor aber startet, ist die Funkfunktion betroffen und nicht die '
          + 'Wegfahrsperre. Umgekehrt kann die Fernbedienung arbeiten, während der Motor nicht '
          + 'anspringt.',
          'Wir prüfen deshalb zuerst, welches Bauteil ausgefallen ist. Oft genügt ein Tausch von '
          + 'Gehäuse, Tasten oder Batterie, und die vorhandene Elektronik bleibt erhalten. Das ist '
          + 'der günstigere Weg als ein kompletter neuer Schlüssel.',
        ],
      }}
      when={{
        title: 'Typische Fälle',
        items: [
          {
            title: 'Die Tasten reagieren nicht mehr',
            body:
              'Häufig ist die Batterie schwach oder ein Taster ausgeschlagen. Beides lässt sich in '
              + 'vielen Fällen ohne neuen Schlüssel beheben.',
            hint: AUFBAU_HINT,
          },
          {
            title: 'Das Gehäuse ist gebrochen',
            body:
              'Ein Sturz oder jahrelange Nutzung hat das Gehäuse beschädigt. Die Platine wird in ein '
              + 'neues Gehäuse übernommen.',
          },
          {
            title: 'Die Reichweite hat nachgelassen',
            body:
              'Sie müssen näher ans Fahrzeug als früher. Ursache ist oft die Batterie, manchmal eine '
              + 'gelöste Lötstelle auf der Platine.',
          },
          {
            title: 'Der Schlüssel war nass',
            body:
              'Feuchtigkeit greift die Platine an. Je früher wir ihn sehen, desto eher lässt sich '
              + 'die Elektronik retten.',
          },
          {
            title: 'Der Bart ist abgebrochen',
            body:
              'Das Funkteil ist in Ordnung, nur der mechanische Teil fehlt. Dann wird nur der Bart '
              + 'neu gefertigt.',
          },
          {
            title: 'Sie brauchen einen zweiten Funkschlüssel',
            body:
              'Ein zusätzlicher Schlüssel wird gefertigt und anschließend am Fahrzeug angelernt.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Für eine belastbare Einschätzung genügen in den meisten Fällen Fotos und ein paar Angaben.',
        items: [
          {
            title: 'Fotos des Schlüssels',
            body:
              'Vorderseite, Rückseite und der Bart von der Seite. Bei gebrochenem Gehäuse '
              + 'zusätzlich eine Aufnahme der Bruchstelle.',
          },
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr — daraus ergibt sich das verbaute System.',
          },
          {
            title: 'Beschreibung des Fehlerbilds',
            body:
              'Was funktioniert noch, was nicht? Öffnen die Türen? Startet der Motor? Leuchtet eine '
              + 'Kontrollleuchte im Fahrzeug?',
          },
          {
            title: 'Angabe zur Batterie',
            body:
              'Wurde die Batterie schon getauscht? Wenn ja, wann und hat sich das Verhalten dadurch '
              + 'geändert?',
          },
          {
            title: 'Nachweis der Verfügungsberechtigung',
            body: 'Ausweisdokument und Fahrzeugschein beim Termin.',
          },
        ],
      }}
      boundary={{
        title: 'Abgrenzung — was dabei nicht passiert',
        items: [
          {
            title: 'Ein neues Gehäuse ist kein neuer Schlüssel',
            body:
              'Beim Gehäusetausch wird die vorhandene Elektronik übernommen. Es entsteht dadurch '
              + 'kein zusätzlicher Schlüssel.',
          },
          {
            title: 'Funk ist nicht die Wegfahrsperre',
            body:
              'Eine wiederhergestellte Funkfunktion sagt nichts darüber aus, ob der Motor startet. '
              + 'Das ist ein getrennter Teil der Elektronik.',
          },
          {
            title: 'Batteriewechsel ohne Zusage zur Programmierung',
            body:
              'Bei den meisten Fahrzeugen bleibt die Programmierung beim Batteriewechsel erhalten. '
              + 'Ob das bei Ihrem Fahrzeug gilt, prüfen wir vorher — versprechen tun wir es nicht '
              + 'pauschal.',
          },
          {
            title: 'Keine Reparatur bei Totalschaden der Platine',
            body:
              'Ist die Platine durchkorrodiert oder mechanisch zerstört, ist ein neuer Schlüssel der '
              + 'ehrlichere Weg. Wir sagen Ihnen das nach der Prüfung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Lohnt sich eine Reparatur überhaupt?',
          answer:
            'In vielen Fällen ja — vor allem, wenn nur Gehäuse, Tasten oder Batterie betroffen sind. '
            + 'Ist die Platine beschädigt, kann ein neuer Schlüssel sinnvoller sein. Wir nennen '
            + 'Ihnen beide Wege, bevor Sie entscheiden.',
        },
        {
          question: 'Kann ich meinen Funkschlüssel einschicken?',
          answer:
            'Für reine Gehäuse- und Tastenarbeiten ist das in vielen Fällen möglich. Muss der '
            + 'Schlüssel danach am Fahrzeug angelernt werden, ist ein Termin mit Fahrzeug nötig.',
        },
        {
          question: 'Fällt auch bei einer Reparatur eine Anzahlung an?',
          answer:
            `Für Termine im Autoschlüssel-Bereich gilt standardmäßig eine Anzahlung von ${deposit}, `
            + 'die vollständig auf den Gesamtpreis angerechnet wird. Was für Ihren Fall gilt, sehen '
            + 'Sie im geführten Ablauf, bevor Sie buchen.',
        },
        {
          question: 'Wechseln Sie auch nur die Batterie?',
          answer:
            'Ja. Sagen Sie uns vorher, um welches Fahrzeug und welche Schlüsselart es geht, damit wir '
            + 'die passende Batterie vorrätig haben.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Laden Sie Fotos Ihres Schlüssels hoch und beschreiben Sie kurz das Fehlerbild. Wir sagen '
          + 'Ihnen, ob eine Reparatur genügt.',
        primary: { href: '/autoschluessel/anfrage', label: 'Fahrzeug auswählen' },
        secondary: { href: '/autoschluessel/smart-key', label: 'Ich habe einen Smart Key' },
      }}
      related={[
        { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Wenn die Funkverbindung neu angelernt werden muss' },
        { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen', description: 'Wenn ein zusätzlicher Schlüssel sinnvoller ist' },
        { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen', description: 'Bei abgebrochenem Bart' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
