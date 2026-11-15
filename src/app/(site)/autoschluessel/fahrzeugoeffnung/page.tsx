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
    'Zerstörungsfrei heißt, wir beschädigen weder Scheibe noch Schloss noch Dichtung. Ob das '
    + 'gelingt, hängt von Bauart und Zustand des Fahrzeugs ab. Sehen wir vorher, dass es nicht ohne '
    + 'Schaden geht, sagen wir es Ihnen. Dann entscheiden Sie.',
};

export default async function FahrzeugoeffnungPage() {
  const page = await getPageContent(ROUTE);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Fahrzeugöffnung',
        subline: 'Wir öffnen Ihr Fahrzeug, wenn Sie ausgesperrt sind.',
        intro:
          'Wir arbeiten zerstörungsfrei. Vor Ort weisen Sie bitte nach, dass Sie über das Fahrzeug '
          + 'verfügen dürfen. Die Öffnung ist eine eigene Leistung und ersetzt keinen '
          + 'Ersatzschlüssel.',
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
        title: 'Was wir machen',
        paragraphs: [
          'Wir öffnen Ihr Fahrzeug ohne Schaden an Scheibe, Schloss oder Dichtung. Dafür nutzen wir '
          + 'Werkzeuge, die zur jeweiligen Tür passen.',
          'Liegt der Schlüssel im Fahrzeug, haben Sie ihn danach wieder. Ist er verloren, brauchen '
          + 'Sie zum Weiterfahren einen Ersatzschlüssel. Den fertigen wir in einem zweiten Schritt.',
          'Vor der Öffnung prüfen wir, ob Sie über das Fahrzeug verfügen dürfen. Das ist kein '
          + 'Misstrauen Ihnen gegenüber, sondern Voraussetzung für diese Arbeit.',
        ],
      }}
      when={{
        title: 'Wann diese Leistung passt',
        items: [
          {
            title: 'Der Schlüssel liegt im Fahrzeug',
            body:
              'Das ist der häufigste Fall, auch wenn das Fahrzeug von selbst verriegelt hat. Nach der '
              + 'Öffnung haben Sie Ihren Schlüssel wieder und brauchen nichts weiter.',
            hint: ZERSTOERUNGSFREI_HINT,
          },
          {
            title: 'Der Schlüssel ist verloren',
            body:
              'Die Öffnung bringt Sie ins Fahrzeug. Zum Weiterfahren brauchen Sie danach einen '
              + 'Ersatzschlüssel.',
          },
          {
            title: 'Der Schlüssel ist abgebrochen',
            body:
              'Steckt ein Teil im Schloss, klären wir auch, wie das Bruchstück herauskommt.',
          },
          {
            title: 'Kofferraum oder Heckklappe',
            body:
              'Auch getrennt verriegelte Bereiche lassen sich in vielen Fällen zerstörungsfrei '
              + 'öffnen.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Ohne Nachweis, dass Sie über das Fahrzeug verfügen dürfen, öffnen wir kein Fahrzeug. '
          + 'Bitte halten Sie die Unterlagen bereit.',
        items: [
          {
            title: 'Ihr Ausweis',
            body: 'Ein gültiger amtlicher Ausweis der Person, die den Auftrag erteilt.',
          },
          {
            title: 'Fahrzeugschein',
            body:
              'Die Zulassungsbescheinigung Teil I. Steht das Fahrzeug nicht auf Ihren Namen, brauchen '
              + 'wir zusätzlich eine Vollmacht oder Bestätigung des Halters. Das gilt auch für Leasing- '
              + 'und Firmenfahrzeuge.',
          },
          {
            title: 'Fahrzeugdaten',
            body:
              'Marke, Modell und Baujahr. Daran sehen wir, welche Technik in der Tür verbaut ist.',
          },
          {
            title: 'Standort und Telefonnummer',
            body:
              'Sagen Sie uns, wo das Fahrzeug steht und unter welcher Nummer wir Sie erreichen.',
          },
          {
            title: 'Was mit dem Schlüssel ist',
            body:
              'Sagen Sie uns, ob er im Fahrzeug liegt, verloren oder abgebrochen ist. Davon hängt ab, '
              + 'was nach der Öffnung nötig ist.',
          },
        ],
        note:
          'Wir prüfen den Nachweis, bevor wir mit der Arbeit beginnen. Können Sie ihn nicht '
          + 'erbringen, dürfen wir das Fahrzeug nicht öffnen. Das gilt auch dann, wenn die Lage für '
          + 'Sie eindeutig ist.',
      }}
      boundary={{
        title: 'Was nicht dazugehört',
        items: [
          {
            title: 'Keine Öffnung ohne Nachweis',
            body:
              'Wir arbeiten nur für Personen, die belegen können, dass sie über das Fahrzeug '
              + 'verfügen dürfen.',
          },
          {
            title: 'Keine Zusage ohne Prüfung vor Ort',
            body:
              'Wir arbeiten zerstörungsfrei. Ob das bei einem bestimmten Fahrzeug gelingt, sehen wir '
              + 'erst vor Ort. Das sagen wir Ihnen offen.',
          },
          {
            title: 'Keine Arbeiten an der Fahrzeugelektronik',
            body:
              'Liegt das Problem nicht am Zugang, sondern an der Technik des Fahrzeugs, gehört die '
              + 'Reparatur nicht zu dieser Leistung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Wird bei der Öffnung etwas beschädigt?',
          answer:
            'Unsere Werkzeuge sind für das zerstörungsfreie Öffnen gemacht. Zeichnet sich ab, dass es '
            + 'im Einzelfall nicht ohne Schaden geht, sagen wir es Ihnen vorher. Dann entscheiden Sie, '
            + 'wie es weitergeht.',
        },
        {
          question: 'Warum brauchen Sie meinen Ausweis?',
          answer:
            'Ein Fahrzeug dürfen wir nur für Berechtigte öffnen. Der Nachweis schützt Sie ebenso wie '
            + 'uns. Ohne ihn können wir den Auftrag nicht annehmen.',
        },
        {
          question: 'Können Sie auch ein Leasing- oder Firmenfahrzeug öffnen?',
          answer:
            'Ja, wenn Sie belegen, dass Sie das Fahrzeug nutzen dürfen. Das geht zum Beispiel mit dem '
            + 'Fahrzeugschein und einer Bestätigung des Halters.',
        },
        {
          question: 'Bekomme ich nach der Öffnung gleich einen neuen Schlüssel?',
          answer:
            'Nicht automatisch. Ein Ersatzschlüssel muss beschafft und in aller Regel am Fahrzeug '
            + 'angelernt werden. Beides planen wir als eigenen Auftrag.',
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
          'Schildern Sie uns kurz die Lage und nennen Sie Ihre Fahrzeugdaten. Wir melden uns mit dem '
          + 'weiteren Vorgehen.',
        primary: {
          href: '/service-und-termin/anfrage?thema=fahrzeugoeffnung',
          label: 'Fahrzeugöffnung anfragen',
        },
        secondary: { href: '/service-und-termin/kontakt', label: 'Kontakt und Erreichbarkeit' },
      }}
      related={[
        { href: '/autoschluessel/nachmachen', label: 'Ersatzschlüssel anfertigen', description: 'Der Schritt nach der Öffnung' },
        { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Autoschlüssel verloren', description: 'Was Sie jetzt in welcher Reihenfolge tun' },
        { href: '/service-und-termin/vor-ort', label: 'Service vor Ort nach Termin', description: 'Was wir beim Kunden erledigen' },
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
