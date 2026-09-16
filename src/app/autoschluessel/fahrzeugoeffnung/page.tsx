import type { Metadata } from 'next';

import { getPageContent } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ServiceArticle } from '@/components/autoschluessel/service-article';

const ROUTE = 'autoschluessel/fahrzeugoeffnung';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Fahrzeugöffnung — zerstörungsfrei',
    description:
      page?.seo.description
      ?? 'Zerstörungsfreie Fahrzeugöffnung als eigene Serviceleistung. Nachweis der '
        + 'Verfügungsberechtigung erforderlich.',
    alternates: { canonical: '/autoschluessel/fahrzeugoeffnung' },
  };
}

const ZERSTOERUNGSFREI_HINT: InfoHint = {
  title: 'Was „zerstörungsfrei“ bedeutet',
  body:
    'Zerstörungsfrei heißt, dass wir ohne Beschädigung von Scheibe, Schloss oder Dichtung arbeiten. '
    + 'Ob das bei einem Fahrzeug gelingt, hängt von Bauart und Zustand ab. Wenn wir absehen, dass es '
    + 'nicht ohne Schaden geht, sagen wir das vorher und Sie entscheiden.',
};

export default async function FahrzeugoeffnungPage() {
  const page = await getPageContent(ROUTE);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Fahrzeugöffnung',
        subline: 'Wenn der Schlüssel im Fahrzeug liegt.',
        intro:
          'Wir öffnen Fahrzeuge zerstörungsfrei. Vor Ort weisen Sie bitte nach, dass Sie über das '
          + 'Fahrzeug verfügen dürfen.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/fahrzeugoeffnung', label: 'Fahrzeugöffnung' },
      ]}
      image={{
        motif: 'Werkstattfoto: Öffnungswerkzeug an der Fahrertür, Lackschutz angelegt',
        ratio: '4/3',
        note: 'Eigene Aufnahme. Kennzeichen unkenntlich machen.',
      }}
      what={{
        title: 'Was die Fahrzeugöffnung umfasst',
        paragraphs: [
          'Bei der Fahrzeugöffnung verschaffen wir Ihnen wieder Zugang zu Ihrem Fahrzeug, ohne '
          + 'Scheibe, Schloss oder Dichtung zu beschädigen. Eingesetzt werden dafür Werkzeuge, die '
          + 'auf die jeweilige Türkonstruktion abgestimmt sind.',
          'Die Öffnung ist eine eigenständige Leistung. Sie verschafft Ihnen Zugang — einen neuen '
          + 'Schlüssel erzeugt sie nicht. Liegt der Schlüssel im Fahrzeug, haben Sie ihn danach '
          + 'wieder. Ist er verloren, folgt als zweiter Schritt die Anfertigung eines '
          + 'Ersatzschlüssels.',
          'Bevor wir ein Fahrzeug öffnen, klären wir die Verfügungsberechtigung. Das ist kein '
          + 'Misstrauen Ihnen gegenüber, sondern Voraussetzung für diese Arbeit.',
        ],
      }}
      when={{
        title: 'Wann diese Leistung passt',
        items: [
          {
            title: 'Der Schlüssel liegt im Fahrzeug',
            body:
              'Der häufigste Fall. Nach der Öffnung haben Sie Ihren Schlüssel wieder und brauchen '
              + 'nichts weiter.',
            hint: ZERSTOERUNGSFREI_HINT,
          },
          {
            title: 'Der Schlüssel ist verloren',
            body:
              'Die Öffnung verschafft Zugang. Für die Weiterfahrt ist danach ein Ersatzschlüssel '
              + 'nötig.',
          },
          {
            title: 'Der Schlüssel ist abgebrochen',
            body:
              'Steckt ein Teil im Schloss, gehört zur Öffnung auch die Frage, wie das Bruchstück '
              + 'entfernt wird.',
          },
          {
            title: 'Die Zentralverriegelung hat verriegelt',
            body:
              'Manche Fahrzeuge verriegeln selbsttätig. Wenn der Schlüssel dabei innen liegt, hilft '
              + 'die Öffnung.',
          },
          {
            title: 'Das Fahrzeug steht bei uns',
            body:
              'Ist das Fahrzeug fahrbereit oder wird es gebracht, erledigen wir die Öffnung im '
              + 'Betrieb.',
          },
          {
            title: 'Zugang zu Kofferraum oder Heckklappe',
            body:
              'Auch getrennt verriegelte Bereiche lassen sich in vielen Fällen zerstörungsfrei '
              + 'öffnen.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Ohne Nachweis der Verfügungsberechtigung öffnen wir kein Fahrzeug. Bitte halten Sie die '
          + 'Unterlagen bereit.',
        items: [
          {
            title: 'Ausweisdokument',
            body: 'Ein gültiges amtliches Ausweisdokument der Person, die den Auftrag erteilt.',
          },
          {
            title: 'Fahrzeugschein',
            body:
              'Die Zulassungsbescheinigung Teil I. Bei Leasing- oder Firmenfahrzeugen zusätzlich ein '
              + 'Nachweis, dass Sie das Fahrzeug nutzen dürfen.',
          },
          {
            title: 'Fahrzeugdaten',
            body:
              'Marke, Modell und Baujahr. Daraus ergibt sich, welche Technik an der Tür verbaut ist.',
          },
          {
            title: 'Standort und Erreichbarkeit',
            body:
              'Wo steht das Fahrzeug, und wie erreichen wir Sie? Bitte geben Sie eine Nummer an, '
              + 'unter der Sie zu erreichen sind.',
          },
          {
            title: 'Angabe zum Schlüssel',
            body:
              'Liegt er im Fahrzeug, ist er verloren oder abgebrochen? Davon hängt ab, was nach der '
              + 'Öffnung nötig ist.',
          },
        ],
        note:
          'Die Prüfung der Verfügungsberechtigung erfolgt vor Beginn der Arbeit. Können Sie sie '
          + 'nicht belegen, dürfen wir das Fahrzeug nicht öffnen — unabhängig davon, wie eindeutig '
          + 'die Lage für Sie erscheint.',
      }}
      boundary={{
        title: 'Abgrenzung — was die Öffnung nicht leistet',
        items: [
          {
            title: 'Kein Ersatz für einen Schlüssel',
            body:
              'Die Öffnung verschafft Zugang. Ist Ihr Schlüssel verloren, brauchen Sie danach '
              + 'zusätzlich einen Ersatzschlüssel.',
          },
          {
            title: 'Keine Öffnung ohne Nachweis',
            body:
              'Wir arbeiten ausschließlich für Personen, die ihre Verfügungsberechtigung über das '
              + 'Fahrzeug belegen können.',
          },
          {
            title: 'Keine Zusage auf Schadenfreiheit ohne Prüfung',
            body:
              'Wir arbeiten zerstörungsfrei. Ob das bei einem bestimmten Fahrzeug und Zustand '
              + 'gelingt, sehen wir erst vor Ort und sagen es Ihnen offen.',
          },
          {
            title: 'Keine Arbeiten an der Fahrzeugelektronik',
            body:
              'Liegt die Ursache nicht am Zugang, sondern an der Fahrzeugtechnik, gehört die '
              + 'Instandsetzung nicht zu dieser Leistung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Wird bei der Öffnung etwas beschädigt?',
          answer:
            'Wir arbeiten mit Werkzeugen, die auf zerstörungsfreies Öffnen ausgelegt sind. Sollte '
            + 'sich abzeichnen, dass es im Einzelfall nicht ohne Schaden geht, sagen wir Ihnen das '
            + 'vorher, und Sie entscheiden über das weitere Vorgehen.',
        },
        {
          question: 'Warum brauchen Sie meinen Ausweis?',
          answer:
            'Eine Fahrzeugöffnung darf nur für Berechtigte erfolgen. Der Nachweis schützt Sie '
            + 'ebenso wie uns und ist Voraussetzung für den Auftrag.',
        },
        {
          question: 'Können Sie auch ein Leasing- oder Firmenfahrzeug öffnen?',
          answer:
            'Ja, wenn Sie belegen können, dass Sie das Fahrzeug nutzen dürfen — etwa über den '
            + 'Fahrzeugschein zusammen mit einer entsprechenden Bestätigung des Halters.',
        },
        {
          question: 'Bekomme ich nach der Öffnung gleich einen neuen Schlüssel?',
          answer:
            'Nicht automatisch. Ein Ersatzschlüssel muss beschafft und in aller Regel am Fahrzeug '
            + 'angelernt werden. Beides planen wir als eigenen Vorgang.',
        },
        {
          question: 'Wie erreiche ich Sie für eine Öffnung?',
          answer:
            'Über die Anfrage zur Fahrzeugöffnung oder über unsere Kontaktseite. Dort finden Sie '
            + 'unsere Erreichbarkeit.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Schildern Sie uns kurz die Lage und Ihre Fahrzeugdaten. Wir melden uns mit dem weiteren '
          + 'Vorgehen.',
        primary: {
          href: '/service-und-termin/anfrage?thema=fahrzeugoeffnung',
          label: 'Fahrzeugöffnung anfragen',
        },
        secondary: { href: '/service-und-termin/kontakt', label: 'Kontakt und Erreichbarkeit' },
      }}
      related={[
        { href: '/autoschluessel/nachmachen', label: 'Ersatzschlüssel anfertigen', description: 'Der Schritt nach der Öffnung' },
        { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Autoschlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
        { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen', description: 'Was wir beim Kunden erledigen' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    >
      <Section>
        <SectionHeading
          eyebrow="Voraussetzung"
          title="Verfügungsberechtigung"
          className="max-w-2xl"
        />
        <Alert tone="legal" title="Ohne Nachweis keine Öffnung" className="mt-6">
          Wir öffnen ein Fahrzeug nur, wenn die auftraggebende Person nachweisen kann, dass sie über
          das Fahrzeug verfügen darf. Dafür brauchen wir ein amtliches Ausweisdokument und die
          Zulassungsbescheinigung Teil I, bei Leasing- und Firmenfahrzeugen zusätzlich eine
          Bestätigung des Halters. Diese Prüfung findet vor Beginn der Arbeit statt.
        </Alert>
      </Section>
    </ServiceArticle>
  );
}
