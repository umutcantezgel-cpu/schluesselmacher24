import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatDuration } from '@/lib/format';
import { ServiceArticle } from '@/components/autoschluessel/service-article';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/smart-key';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Smart Key und Keyless — Ersatz und Programmierung',
    description:
      page?.seo.description
      ?? 'Smart Key und schlüssellose Systeme: Ersatz, Programmierung und Prüfung. Mit Vorlaufzeit '
        + 'und festem Termin.',
    alternates: { canonical: '/autoschluessel/smart-key' },
  };
}

const KEYLESS_HINT: InfoHint = {
  title: 'Smart Key, Keyless — was ist der Unterschied?',
  body:
    'Beide Begriffe beschreiben Systeme, bei denen das Fahrzeug den Schlüssel auf kurze Entfernung '
    + 'erkennt. „Smart Key“ meint meist die Bauform des Schlüssels ohne herausstehenden Bart, '
    + '„Keyless“ die Funktion: öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Welche '
    + 'Variante Ihr Fahrzeug hat, sehen wir an Ihren Schlüsselfotos und den Fahrzeugdaten.',
  figure: {
    motif: 'Produktfoto: Smart Key mit herausgezogenem mechanischem Notschlüssel',
    ratio: '3/2',
  },
};

const NOTSCHLUESSEL_HINT: InfoHint = {
  title: 'Der Notschlüssel im Gehäuse',
  body:
    'In vielen Smart Keys steckt ein kleiner mechanischer Schlüssel. Er ist dafür gedacht, die Tür '
    + 'zu öffnen, wenn die Batterie leer ist. Zum Starten reicht er in der Regel nicht — '
    + 'dafür braucht das Fahrzeug die Elektronik im Schlüssel.',
};

export default async function SmartKeyPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const leadDays = settings.booking.leadTimeDays;
  const slot = formatDuration(settings.booking.slotMinutes);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Smart Key und Keyless',
        subline: 'Schlüsselloser Zugang und Start — je nach Fahrzeug.',
        intro:
          'Smart-Key-Systeme erkennen den Schlüssel in der Nähe des Fahrzeugs. Beschaffung und '
          + 'Anlernen sind aufwendiger als bei einfachen Funkschlüsseln.',
      }}
      eyebrow="Schlüsselart"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/smart-key', label: 'Smart Key' },
      ]}
      image={{
        motif: 'Werkstattfoto: Smart Key neben Diagnosegerät während des Anlernvorgangs',
        ratio: '4/3',
        note: 'Eigene Aufnahme, Display des Geräts ohne Fahrzeugdaten.',
      }}
      what={{
        title: 'Wie schlüssellose Systeme arbeiten',
        paragraphs: [
          'Bei einem Smart Key tauschen Fahrzeug und Schlüssel ständig kurze Funksignale aus. '
          + 'Erkennt das Fahrzeug den Schlüssel in seiner Nähe, lassen sich Türen öffnen und der '
          + 'Motor über einen Startknopf starten — der Schlüssel kann in der Tasche bleiben.',
          'Für uns bedeutet das zwei Dinge: Die Beschaffung des passenden Schlüssels braucht mehr '
          + 'Vorlauf, und das Anlernen am Fahrzeug dauert länger als bei einem einfachen '
          + 'Funkschlüssel. Beides planen wir vor der Terminbestätigung ein.',
          `Rechnen Sie bei diesen Systemen mit mindestens ${leadDays} Tagen Vorlauf und mit einer `
          + `Terminlänge über der Standarddauer von ${slot}. Die für Ihren Fall vorgesehenen Werte `
          + 'sehen Sie im geführten Ablauf, bevor Sie buchen.',
        ],
      }}
      when={{
        title: 'Wann Sie uns brauchen',
        items: [
          {
            title: 'Sie möchten einen zweiten Smart Key',
            body:
              'Solange ein funktionierender Schlüssel vorhanden ist, ist das der planbarste Fall.',
            hint: KEYLESS_HINT,
          },
          {
            title: 'Ein Smart Key ist verloren gegangen',
            body:
              'Wir prüfen, ob der verlorene Schlüssel aus dem Fahrzeug entfernt werden kann und was '
              + 'ein Ersatz erfordert.',
          },
          {
            title: 'Das Fahrzeug erkennt den Schlüssel nicht mehr',
            body:
              'Häufig ist die Batterie schwach. Bleibt das Problem danach bestehen, grenzen wir es '
              + 'am Fahrzeug weiter ein.',
            hint: NOTSCHLUESSEL_HINT,
          },
          {
            title: 'Der Startknopf reagiert nicht',
            body:
              'Ein typisches Bild, wenn die Kennung des Schlüssels nicht ankommt. Ursache kann der '
              + 'Schlüssel oder das Fahrzeug sein.',
          },
          {
            title: 'Das Gehäuse ist beschädigt',
            body:
              'Bei Smart Keys sitzt die Elektronik eng im Gehäuse. Ob ein Tausch möglich ist, prüfen '
              + 'wir anhand Ihrer Fotos.',
          },
          {
            title: 'Fahrzeugkauf mit nur einem Schlüssel',
            body:
              'Bei schlüssellosen Systemen ist ein zweiter Schlüssel besonders sinnvoll, weil der '
              + 'Ersatz aufwendiger ist als bei mechanischen Schlüsseln.',
            hint: ON_SITE_HINT,
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Bei schlüssellosen Systemen sind vollständige Angaben besonders wichtig, weil wir den '
          + 'Schlüssel vor dem Termin beschaffen müssen.',
        items: [
          {
            title: 'Fahrzeugdaten',
            body:
              'Marke, Modell und Baujahr. Bei diesen Systemen entscheidet schon das Baujahr über die '
              + 'Beschaffung.',
          },
          {
            title: 'Fotos Ihres Schlüssels',
            body:
              'Vorderseite, Rückseite und die Seite mit dem Notschlüssel. Aufdrucke auf der Rückseite '
              + 'bitte lesbar aufnehmen.',
          },
          {
            title: 'Fahrzeugschein',
            body: 'Eine lesbare Aufnahme der Zulassungsbescheinigung Teil I.',
          },
          {
            title: 'Alle vorhandenen Schlüssel beim Termin',
            body:
              'Bei manchen Fahrzeugen werden beim Anlernen sämtliche Schlüssel neu erfasst.',
          },
          {
            title: 'Das Fahrzeug beim Termin',
            body:
              'Schlüssellose Systeme lassen sich nicht per Versand einrichten. Das Fahrzeug muss bei '
              + 'uns stehen.',
            hint: ON_SITE_HINT,
          },
        ],
      }}
      boundary={{
        title: 'Abgrenzung — was dabei zu beachten ist',
        items: [
          {
            title: 'Ein Smart Key ist kein Funkschlüssel',
            body:
              'Bauform und Beschaffung unterscheiden sich deutlich. Ein Ersatz ist aufwendiger und '
              + 'braucht mehr Vorlauf.',
          },
          {
            title: 'Der Notschlüssel startet den Motor nicht',
            body:
              'Er ist dafür gedacht, die Tür zu öffnen. Zum Starten braucht das Fahrzeug die '
              + 'Elektronik im Schlüssel.',
          },
          {
            title: 'Keine Zusage vor der Prüfung',
            body:
              'Bei einzelnen Fahrzeugen ist der Zugang an den Hersteller gebunden. Solche Fälle '
              + 'prüfen wir und sagen Ihnen ehrlich, ob wir sie übernehmen können.',
          },
          {
            title: 'Kein Termin ohne Beschaffung',
            body:
              'Der passende Schlüssel muss vor dem Termin da sein. Deshalb ist der Vorlauf bei '
              + 'diesen Systemen nicht verkürzbar.',
          },
        ],
      }}
      faq={[
        {
          question: 'Warum dauert ein Smart Key länger als ein normaler Schlüssel?',
          answer:
            'Weil zwei Dinge zusammenkommen: Der passende Schlüssel muss beschafft werden, und das '
            + 'Anlernen am Fahrzeug nimmt mehr Zeit in Anspruch. Beides planen wir vorher ein, damit '
            + 'der Termin hält.',
        },
        {
          question: 'Kann ich einen gebrauchten Smart Key verwenden?',
          answer:
            'Manchmal ja. Ob sich ein gebrauchter Schlüssel für Ihr Fahrzeug übernehmen lässt, zeigt '
            + 'sich erst bei der Prüfung am Fahrzeug. Sagen Sie uns vorher Bescheid, damit wir das '
            + 'einplanen.',
        },
        {
          question: 'Was mache ich, wenn die Batterie im Smart Key leer ist?',
          answer:
            'Viele Fahrzeuge lassen sich dann über den Notschlüssel öffnen und haben eine '
            + 'Ersatzposition zum Starten. Wie das bei Ihrem Fahrzeug vorgesehen ist, steht in der '
            + 'Bedienungsanleitung des Herstellers.',
        },
        {
          question: 'Kann ein verlorener Smart Key gesperrt werden?',
          answer:
            'Bei vielen Fahrzeugen lässt sich ein Schlüssel aus dem Steuergerät entfernen. Ob das '
            + 'bei Ihrem Fahrzeug möglich ist, prüfen wir vor dem Termin.',
        },
        {
          question: 'Brauche ich das Fahrzeug wirklich vor Ort?',
          answer:
            'Ja. Das Anlernen erfolgt über die Diagnoseschnittstelle des Fahrzeugs. Ohne Fahrzeug '
            + 'lässt sich ein schlüsselloses System nicht einrichten.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Wählen Sie Ihr Fahrzeug aus. Sie sehen Vorlauf, Terminlänge und Preis oder Preisrahmen, '
          + 'bevor Sie verbindlich buchen.',
        primary: { href: '/autoschluessel/anfrage', label: 'Fahrzeug auswählen' },
        secondary: { href: '/autoschluessel/marken', label: 'Fahrzeug nachschlagen' },
      }}
      related={[
        { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Wie das Anlernen abläuft' },
        { href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel', description: 'Der Unterschied zum einfachen Funkschlüssel' },
        { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen', description: 'Zweit- und Ersatzschlüssel' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
