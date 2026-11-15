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
    title: page?.seo.title ?? 'Smart Key und Keyless in Wetzlar',
    description:
      page?.seo.description
      ?? 'Ein Smart Key ist ein Schlüssel, den das Fahrzeug in der Nähe erkennt. Wir beschaffen '
        + 'Ersatz für Ihren Smart Key und lernen ihn an Ihrem Fahrzeug an.',
    alternates: { canonical: '/autoschluessel/smart-key' },
  };
}

const KEYLESS_HINT: InfoHint = {
  title: 'Smart Key oder Keyless?',
  body:
    'Bei beiden erkennt das Fahrzeug den Schlüssel auf kurze Entfernung. „Smart Key“ meint meist '
    + 'die Bauform des Schlüssels ohne herausstehenden Bart. „Keyless“ meint die Funktion, also '
    + 'öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Welche Variante Ihr Fahrzeug '
    + 'hat, sehen wir an Ihren Schlüsselfotos und den Fahrzeugdaten.',
  figure: {
    motif: 'Produktfoto: Smart Key mit herausgezogenem mechanischem Notschlüssel',
    ratio: '3/2',
  },
};

const NOTSCHLUESSEL_HINT: InfoHint = {
  title: 'Der Notschlüssel im Gehäuse',
  body:
    'In vielen Smart Keys steckt ein kleiner mechanischer Schlüssel. Mit ihm öffnen Sie die Tür, '
    + 'wenn die Batterie leer ist. Zum Starten reicht er in der Regel nicht. Dafür braucht das '
    + 'Fahrzeug die Elektronik im Schlüssel.',
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
        subline: 'Wir beschaffen Ersatz für Ihren Smart Key und lernen ihn an Ihrem Fahrzeug an.',
        intro:
          'Ein Smart Key ist ein Schlüssel, den das Fahrzeug in der Nähe erkennt. Keyless heißt, Sie '
          + 'öffnen und starten, ohne ihn in die Hand zu nehmen. Beschaffung und Anlernen sind '
          + 'aufwendiger als bei einem einfachen Funkschlüssel.',
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
        title: 'Was wir machen',
        paragraphs: [
          'Fahrzeug und Smart Key tauschen ständig kurze Funksignale aus. Ist der Schlüssel in der '
          + 'Nähe, lassen sich die Türen öffnen und der Motor per Knopf starten. Der Schlüssel kann '
          + 'in der Tasche bleiben.',
          'Den passenden Schlüssel beschaffen wir vor dem Termin. Das Anlernen am Fahrzeug dauert '
          + 'länger als bei einem einfachen Funkschlüssel.',
          `Rechnen Sie mit mindestens ${leadDays} Tagen Vorlauf. Der Termin dauert länger als ein `
          + `Standardtermin von ${slot}. Die Werte für Ihren Fall sehen Sie in der Anfrage, bevor Sie `
          + 'buchen.',
        ],
      }}
      when={{
        title: 'Wann Sie das brauchen',
        items: [
          {
            title: 'Sie möchten einen zweiten Smart Key',
            body:
              'Solange ein Schlüssel funktioniert, ist das der am besten planbare Fall. Nach einem '
              + 'Fahrzeugkauf mit nur einem Schlüssel lohnt sich das besonders. Ersatz ist hier '
              + 'aufwendiger als bei mechanischen Schlüsseln.',
            hint: KEYLESS_HINT,
          },
          {
            title: 'Ein Smart Key ist verloren gegangen',
            body:
              'Wir prüfen, ob sich der verlorene Schlüssel aus dem Fahrzeug entfernen lässt und was '
              + 'ein Ersatz erfordert.',
          },
          {
            title: 'Das Fahrzeug erkennt den Schlüssel nicht mehr',
            body:
              'Oft ist die Batterie schwach. Bleibt der Fehler danach, suchen wir die Ursache am '
              + 'Fahrzeug.',
            hint: NOTSCHLUESSEL_HINT,
          },
          {
            title: 'Der Startknopf reagiert nicht',
            body:
              'Das passiert, wenn die Kennung des Schlüssels nicht ankommt. Die Ursache kann im '
              + 'Schlüssel oder im Fahrzeug liegen.',
          },
          {
            title: 'Das Gehäuse ist beschädigt',
            body:
              'Bei Smart Keys sitzt die Elektronik eng im Gehäuse. Ob ein Tausch möglich ist, prüfen '
              + 'wir anhand Ihrer Fotos.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Wir müssen den Schlüssel vor dem Termin beschaffen. Deshalb sind vollständige Angaben hier '
          + 'besonders wichtig.',
        items: [
          {
            title: 'Fahrzeugdaten',
            body:
              'Marke, Modell und Baujahr. Schon das Baujahr entscheidet hier über die Beschaffung.',
          },
          {
            title: 'Fotos Ihres Schlüssels',
            body:
              'Vorderseite, Rückseite und die Seite mit dem Notschlüssel. Bitte nehmen Sie Aufdrucke '
              + 'auf der Rückseite gut lesbar auf.',
          },
          {
            title: 'Ein Foto des Fahrzeugscheins',
            body: 'Eine gut lesbare Aufnahme der Zulassungsbescheinigung Teil I.',
          },
          {
            title: 'Ihr Fahrzeug und alle Schlüssel beim Termin',
            body:
              'Ein Smart Key lässt sich nicht per Versand einrichten. Bringen Sie alle Schlüssel mit. '
              + 'Manche Fahrzeuge erfassen beim Anlernen alle Schlüssel neu.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Ihr Nachweis beim Termin',
            body:
              'Sie zeigen uns Ihren Ausweis und den Fahrzeugschein. Steht das Fahrzeug nicht auf '
              + 'Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters. Ohne diesen '
              + 'Nachweis lernen wir keinen Schlüssel an.',
          },
        ],
      }}
      boundary={{
        title: 'Worauf Sie achten sollten',
        items: [
          {
            title: 'Ein Smart Key ist kein einfacher Funkschlüssel',
            body:
              'Bauform und Beschaffung unterscheiden sich deutlich. Der Schlüssel muss vor dem Termin '
              + 'bei uns sein. Deshalb lässt sich der Vorlauf nicht verkürzen.',
          },
          {
            title: 'Der Notschlüssel startet den Motor nicht',
            body:
              'Er ist zum Öffnen der Tür gedacht. Zum Starten braucht das Fahrzeug die Elektronik im '
              + 'Schlüssel.',
          },
          {
            title: 'Keine Zusage vor der Prüfung',
            body:
              'Bei einzelnen Fahrzeugen gibt nur der Hersteller den Zugang frei. Solche Fälle prüfen '
              + 'wir. Wir sagen Ihnen ehrlich, ob wir sie übernehmen können.',
          },
        ],
      }}
      faq={[
        {
          question: 'Warum dauert ein Smart Key länger als ein normaler Schlüssel?',
          answer:
            'Zwei Dinge kommen zusammen. Der passende Schlüssel muss beschafft werden, und das '
            + 'Anlernen am Fahrzeug dauert länger. Beides planen wir vorher ein, damit der Termin hält.',
        },
        {
          question: 'Kann ich einen gebrauchten Smart Key verwenden?',
          answer:
            'Manchmal ja. Ob er sich für Ihr Fahrzeug übernehmen lässt, zeigt erst die Prüfung am '
            + 'Fahrzeug. Sagen Sie uns vorher Bescheid, damit wir das einplanen.',
        },
        {
          question: 'Was mache ich, wenn die Batterie im Smart Key leer ist?',
          answer:
            'Viele Fahrzeuge lassen sich dann mit dem Notschlüssel öffnen und haben eine '
            + 'Ersatzposition zum Starten. Wie das bei Ihrem Fahrzeug geht, steht in der '
            + 'Bedienungsanleitung des Herstellers.',
        },
        {
          question: 'Brauche ich das Fahrzeug wirklich vor Ort?',
          answer:
            'Ja. Das Anlernen läuft über die Diagnoseschnittstelle, einen Anschluss im Fahrzeug. Ohne '
            + 'Fahrzeug lässt sich ein Smart Key nicht einrichten.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Wählen Sie Ihr Fahrzeug aus. Vorlauf, Termindauer und Preis oder Preisrahmen sehen Sie, '
          + 'bevor Sie verbindlich buchen.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin anfragen' },
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
