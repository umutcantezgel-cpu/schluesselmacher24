import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { ServiceArticle } from '@/components/autoschluessel/service-article';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/nachmachen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel nachmachen — Zweit- und Ersatzschlüssel',
    description:
      page?.seo.description
      ?? 'Zweitschlüssel und Ersatzschlüssel für Ihr Fahrzeug anfertigen lassen — mit '
        + 'Schlüsselfotos, Preisangabe und fester Terminbuchung.',
    alternates: { canonical: '/autoschluessel/nachmachen' },
  };
}

export default async function NachmachenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Autoschlüssel nachmachen',
        subline: 'Zweitschlüssel und Ersatzschlüssel für Ihr Fahrzeug.',
        intro:
          'Ein nachgemachter Autoschlüssel ist ein vollwertiger weiterer Schlüssel: mechanisch '
          + 'gefertigt und elektronisch am Fahrzeug angelernt.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/nachmachen', label: 'Nachmachen' },
      ]}
      image={{
        motif: 'Werkstattfoto: fertig gefräster Autoschlüssel neben dem Original auf der Werkbank',
        ratio: '4/3',
        note: 'Eigene Aufnahme. Kennzeichnungen und Schlüsselnummern unkenntlich machen.',
      }}
      what={{
        title: 'Was heißt „Autoschlüssel nachmachen“?',
        paragraphs: [
          'Nachmachen umfasst beide Teile eines Autoschlüssels: den mechanischen Bart, der in Tür '
          + 'und Zündschloss passt, und die Elektronik, die das Fahrzeug erkennt. Erst wenn beide '
          + 'Teile stimmen, öffnet der Schlüssel das Fahrzeug und startet den Motor.',
          'Wie aufwendig das ist, hängt vor allem von einer Frage ab: Ist noch ein funktionierender '
          + 'Schlüssel vorhanden? Wenn ja, lässt sich der neue Schlüssel in aller Regel zügig '
          + 'anlegen. Wenn nicht, ist der Weg länger, weil zuerst die Berechtigung und die '
          + 'Fahrzeugdaten geklärt werden müssen.',
          'Wir sagen Ihnen vor der Terminbestätigung, was in Ihrem Fall möglich ist und was es '
          + 'kostet. Das kann ein fester Preis sein, ein Preisrahmen oder der Hinweis, dass wir '
          + 'Ihre Unterlagen zuerst manuell prüfen.',
        ],
      }}
      when={{
        title: 'Wann brauchen Sie einen nachgemachten Schlüssel?',
        lead: 'Die folgenden Fälle kommen am häufigsten vor.',
        items: [
          {
            title: 'Sie haben nur noch einen Schlüssel',
            body:
              'Der klassische Zweitschlüssel. Solange ein funktionierender Schlüssel vorhanden ist, '
              + 'ist dieser Weg der einfachste und planbarste.',
          },
          {
            title: 'Ein Schlüssel ist verloren gegangen',
            body:
              'Dann geht es nicht nur um einen neuen Schlüssel, sondern auch um die Frage, ob der '
              + 'verlorene aus dem Fahrzeug entfernt werden soll. Beides klären wir gemeinsam.',
          },
          {
            title: 'Es ist kein Schlüssel mehr da',
            body:
              'Ein Sonderfall mit deutlich höherem Aufwand. Wir prüfen Ihre Unterlagen und die '
              + 'Machbarkeit, bevor ein Termin bestätigt wird.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Der vorhandene Schlüssel ist beschädigt',
            body:
              'Gebrochener Bart, defekte Elektronik oder Wasserschaden. Je nach Befund reicht eine '
              + 'Reparatur, sonst wird ein neuer Schlüssel angelegt.',
          },
          {
            title: 'Mehrere Personen nutzen das Fahrzeug',
            body:
              'Familie, Betrieb oder Fahrgemeinschaft — ein weiterer Schlüssel macht den Alltag '
              + 'einfacher und verhindert Übergabeprobleme.',
          },
          {
            title: 'Gebrauchtwagen mit nur einem Schlüssel',
            body:
              'Bei einem Fahrzeugkauf fehlt oft der zweite Schlüssel. Ein Nachbau lohnt sich, bevor '
              + 'der letzte Schlüssel verloren geht.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Je vollständiger Ihre Angaben sind, desto genauer können wir Preis und Termin nennen. '
          + 'Alles wird im geführten Ablauf abgefragt.',
        items: [
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell, Baujahr und — soweit bekannt — die Schlüsselart.',
          },
          {
            title: 'Fotos Ihres Schlüssels',
            body:
              'Drei Aufnahmen aus unterschiedlichen Richtungen: Vorderseite, Rückseite und der Bart '
              + 'von der Seite. Daran erkennen wir Gehäuse, Rohling und Elektronik.',
          },
          {
            title: 'Fahrzeugschein',
            body:
              'Eine lesbare Aufnahme der Zulassungsbescheinigung Teil I. Sie ordnet das Fahrzeug '
              + 'eindeutig zu.',
          },
          {
            title: 'Anzahl der funktionierenden Schlüssel',
            body:
              'Diese Angabe entscheidet über Aufwand und Ablauf. Bitte geben Sie sie ehrlich an — '
              + 'sie ändert nichts an der Bearbeitung, aber viel an der Planung.',
          },
          {
            title: 'Nachweis der Verfügungsberechtigung beim Termin',
            body:
              'Ausweisdokument und Fahrzeugschein. Ohne diesen Nachweis fertigen wir keinen '
              + 'Fahrzeugschlüssel an.',
          },
        ],
        note:
          `Ihre Unterlagen werden nur für diesen Vorgang verwendet. Schlüsselfotos bewahren wir `
          + `${settings.retentionDays.keyPhotos} Tage auf, Aufnahmen des Fahrzeugscheins `
          + `${settings.retentionDays.vehicleRegistration} Tage. Danach werden sie gelöscht.`,
      }}
      boundary={{
        title: 'Abgrenzung — was hier nicht gemeint ist',
        lead: 'Die Begriffe werden im Alltag oft vermischt. Diese Leistungen sind etwas anderes.',
        items: [
          {
            title: 'Kopieren ist nicht dasselbe',
            body:
              'Eine Kopie bildet nur den mechanischen Bart ab. Bei Fahrzeugen mit Wegfahrsperre '
              + 'öffnet sie höchstens die Tür, startet aber den Motor nicht.',
          },
          {
            title: 'Programmieren allein reicht nicht',
            body:
              'Ist noch gar kein passender Rohling vorhanden, muss zuerst der Bart gefertigt werden. '
              + 'Programmieren ist der zweite Schritt, nicht der erste.',
          },
          {
            title: 'Fahrzeugöffnung ist eine eigene Leistung',
            body:
              'Wenn der Schlüssel im Fahrzeug liegt, hilft zunächst die Öffnung. Ein Ersatzschlüssel '
              + 'entsteht dabei nicht.',
          },
          {
            title: 'Kein Versandschlüssel bei Anlernpflicht',
            body:
              'Muss der Schlüssel am Fahrzeug angelernt werden, lässt sich das nicht per Post lösen. '
              + 'Dann ist ein Termin mit Fahrzeug der richtige Weg.',
          },
        ],
      }}
      faq={[
        {
          question: 'Wie lange dauert es, bis ich den neuen Schlüssel habe?',
          answer:
            `Der früheste Termin liegt etwa ${leadDays} Tage in der Zukunft. Diese Zeit brauchen wir, `
            + 'um den passenden Schlüssel zu beschaffen. Bei Fahrzeugen mit aufwendigeren Systemen '
            + 'kann der Vorlauf länger sein — den genauen Wert sehen Sie im geführten Ablauf, bevor '
            + 'Sie buchen.',
        },
        {
          question: 'Warum ist eine Anzahlung nötig?',
          answer:
            `Die Anzahlung von standardmäßig ${deposit} sichert Ihren Termin und die Beschaffung des `
            + 'Schlüssels. Sie wird vollständig auf den Gesamtpreis angerechnet.',
        },
        {
          question: 'Kann ich einen Schlüssel aus dem Internet mitbringen?',
          answer:
            'Bringen Sie ihn gern zum Termin mit. Ob er zu Ihrem Fahrzeug passt und sich anlernen '
            + 'lässt, prüfen wir vor Ort. Passt er nicht, entfällt dadurch nicht der Aufwand für die '
            + 'Prüfung — deshalb sagen Sie uns bitte vorher Bescheid, damit wir das einplanen.',
        },
        {
          question: 'Muss ich alle vorhandenen Schlüssel mitbringen?',
          answer:
            'Ja, bitte bringen Sie alle Schlüssel mit, die zum Fahrzeug gehören. Bei manchen '
            + 'Fahrzeugen werden beim Anlernen alle Schlüssel neu erfasst. Fehlt einer, funktioniert '
            + 'er danach unter Umständen nicht mehr.',
        },
        {
          question: 'Was ist, wenn ich den verlorenen Schlüssel wiederfinde?',
          answer:
            'Sagen Sie uns bitte Bescheid, bevor der Termin stattfindet. Je nach Fahrzeug und '
            + 'gewähltem Umfang ändert das den Ablauf und teilweise auch den Preis.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Wählen Sie Ihr Fahrzeug aus und laden Sie Ihre Fotos hoch. Sie sehen Preis oder '
          + 'Preisrahmen, bevor Sie etwas verbindlich buchen.',
        primary: { href: '/autoschluessel/anfrage', label: 'Fahrzeug auswählen' },
        secondary: { href: '/autoschluessel/marken', label: 'Erst Fahrzeug nachschlagen' },
      }}
      related={[
        { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren', description: 'Was eine mechanische Kopie leistet' },
        { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen', description: 'Der mechanische Teil im Detail' },
        { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Autoschlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
