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
    'Außen sitzen Gehäuse und Tasten. Innen liegen eine Platine mit Sender, eine Batterie und der '
    + 'Transponder für die Wegfahrsperre. Dazu kommt der mechanische Bart. Jedes dieser Teile kann '
    + 'einzeln ausfallen. Deshalb suchen wir erst die Ursache und tauschen dann.',
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
        subline: 'Wir reparieren Tasten, Gehäuse und Funk oder fertigen einen neuen Schlüssel.',
        intro:
          'Reagiert das Fahrzeug nicht mehr auf Knopfdruck, liegt das nicht immer am Schlüssel. Wir '
          + 'prüfen, ob Batterie, Tasten, Elektronik oder das Anlernen am Fahrzeug die Ursache ist.',
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
        title: 'Was wir machen',
        paragraphs: [
          'Ein Funkschlüssel hat Tasten zum Ver- und Entriegeln. Dafür sitzt ein kleiner Sender auf '
          + 'der Platine, der Elektronik im Gehäuse. Getrennt davon arbeiten der Bart und der '
          + 'Transponder. Das ist ein Chip, ohne den die Wegfahrsperre den Motor nicht freigibt.',
          'Das erklärt die meisten Fehler. Gehen die Tasten nicht, startet der Motor aber, liegt es '
          + 'am Funk. Umgekehrt können die Tasten gehen, während der Motor nicht anspringt.',
          'Wir prüfen zuerst, welches Teil ausgefallen ist. Oft reicht ein neues Gehäuse, neue Tasten '
          + 'oder eine neue Batterie. Die Elektronik bleibt dann erhalten. Das ist günstiger als ein '
          + 'ganz neuer Schlüssel.',
        ],
      }}
      when={{
        title: 'Typische Fälle',
        items: [
          {
            title: 'Die Tasten reagieren schlecht oder gar nicht',
            body:
              'Oft ist die Batterie schwach oder eine Taste ausgeschlagen. Lässt nur die Reichweite '
              + 'nach, kann auch eine gelöste Lötstelle die Ursache sein. Das lässt sich in vielen '
              + 'Fällen ohne neuen Schlüssel beheben.',
            hint: AUFBAU_HINT,
          },
          {
            title: 'Das Gehäuse ist gebrochen',
            body: 'Wir setzen die Platine in ein neues Gehäuse um.',
          },
          {
            title: 'Der Schlüssel war nass',
            body:
              'Feuchtigkeit greift die Platine an. Je früher wir den Schlüssel sehen, desto eher lässt '
              + 'sich die Elektronik retten.',
          },
          {
            title: 'Sie brauchen einen zweiten Funkschlüssel',
            body: 'Wir fertigen ihn und lernen ihn danach am Fahrzeug an.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Für eine erste Einschätzung reichen meist Fotos und ein paar Angaben.',
        items: [
          {
            title: 'Fotos des Schlüssels',
            body:
              'Vorderseite, Rückseite und den Bart von der Seite. Ist das Gehäuse gebrochen, bitte '
              + 'auch die Bruchstelle.',
          },
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr. Daraus ergibt sich das verbaute System.',
          },
          {
            title: 'Was nicht mehr funktioniert',
            body:
              'Schreiben Sie kurz, was noch geht und was nicht. Zum Beispiel Türen, Motorstart oder '
              + 'eine Kontrollleuchte. Sagen Sie uns auch, ob Sie die Batterie schon getauscht haben.',
          },
          {
            title: 'Ihr Nachweis beim Termin',
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
            title: 'Ein neues Gehäuse ist kein neuer Schlüssel',
            body:
              'Beim Gehäusetausch übernehmen wir Ihre Elektronik. Ein zusätzlicher Schlüssel entsteht '
              + 'dabei nicht.',
          },
          {
            title: 'Keine pauschale Zusage beim Batteriewechsel',
            body:
              'Bei den meisten Fahrzeugen bleibt die Programmierung beim Batteriewechsel erhalten. Ob '
              + 'das bei Ihrem Fahrzeug gilt, prüfen wir vorher. Pauschal versprechen wir es nicht.',
          },
          {
            title: 'Keine Reparatur bei zerstörter Platine',
            body:
              'Ist die Platine durchkorrodiert oder zerbrochen, ist ein neuer Schlüssel der ehrlichere '
              + 'Weg. Das sagen wir Ihnen nach der Prüfung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Lohnt sich eine Reparatur überhaupt?',
          answer:
            'In vielen Fällen ja, vor allem bei Gehäuse, Tasten oder Batterie. Ist die Platine '
            + 'beschädigt, kann ein neuer Schlüssel sinnvoller sein. Wir nennen Ihnen beide Wege, '
            + 'bevor Sie entscheiden.',
        },
        {
          question: 'Kann ich meinen Funkschlüssel einschicken?',
          answer:
            'Für Arbeiten an Gehäuse und Tasten geht das in vielen Fällen. Muss der Schlüssel danach '
            + 'am Fahrzeug angelernt werden, brauchen Sie einen Termin mit Fahrzeug.',
        },
        {
          question: 'Fällt auch bei einer Reparatur eine Anzahlung an?',
          answer:
            `Für Termine im Autoschlüssel-Bereich gilt standardmäßig eine Anzahlung von ${deposit}. `
            + 'Wir rechnen sie vollständig auf den Gesamtpreis an. Was für Ihren Fall gilt, sehen Sie '
            + 'in der Anfrage, bevor Sie buchen.',
        },
        {
          question: 'Wechseln Sie auch nur die Batterie?',
          answer:
            'Ja. Nennen Sie uns vorher Fahrzeug und Schlüsselart. Dann haben wir die passende Batterie '
            + 'vorrätig.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Laden Sie Fotos Ihres Schlüssels hoch und beschreiben Sie kurz den Fehler. Wir sagen Ihnen, '
          + 'ob eine Reparatur reicht.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin anfragen' },
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
