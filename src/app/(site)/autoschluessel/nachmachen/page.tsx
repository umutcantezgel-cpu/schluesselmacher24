import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { ServiceArticle } from '@/components/autoschluessel/service-article';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/nachmachen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Zweitschlüssel fürs Auto in Wetzlar',
    description:
      page?.seo.description
      ?? 'Wir fertigen einen Zweitschlüssel oder Ersatzschlüssel für Ihr Fahrzeug in Wetzlar. Ist '
        + 'kein Schlüssel mehr da, prüfen wir Ihren Fall zuerst einzeln.',
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
        subline: 'Wir fertigen einen Zweitschlüssel oder Ersatzschlüssel für Ihr Fahrzeug.',
        intro:
          'Am günstigsten ist ein neuer Schlüssel, solange noch einer funktioniert. Ist keiner mehr '
          + 'da, prüfen wir Ihren Fall zuerst einzeln. Der Aufwand ist dann deutlich höher.',
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
        title: 'Was wir machen',
        paragraphs: [
          'Ein Autoschlüssel hat zwei Teile. Der Bart ist das Metallteil mit den Einschnitten, es '
          + 'passt ins Schloss. Die Elektronik sorgt dafür, dass das Fahrzeug den Schlüssel erkennt. '
          + 'Erst wenn beides stimmt, öffnet der Schlüssel das Fahrzeug und startet den Motor.',
          'Wir fräsen den Bart und machen den Schlüssel dem Fahrzeug bekannt. Das nennt man '
          + 'Anlernen.',
          'Vor der Terminbestätigung sagen wir Ihnen, was möglich ist und was es kostet. Das ist ein '
          + 'fester Preis, ein Preisrahmen oder der Hinweis, dass wir Ihre Unterlagen zuerst von Hand '
          + 'prüfen.',
        ],
      }}
      when={{
        title: 'Wann Sie einen weiteren Schlüssel brauchen',
        items: [
          {
            title: 'Sie haben nur noch einen Schlüssel',
            body:
              'Etwa nach dem Kauf eines Gebrauchtwagens oder wenn mehrere Personen das Fahrzeug '
              + 'nutzen. Solange ein Schlüssel funktioniert, ist das der einfachste Fall.',
          },
          {
            title: 'Ein Schlüssel ist verloren gegangen',
            body:
              'Wir fertigen einen neuen Schlüssel. Dabei klären wir mit Ihnen, ob der verlorene aus '
              + 'dem Fahrzeug entfernt werden soll.',
          },
          {
            title: 'Es ist kein Schlüssel mehr da',
            body:
              'Das ist deutlich aufwendiger. Wir prüfen Ihre Unterlagen und ob es machbar ist, bevor '
              + 'wir einen Termin bestätigen.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Der Schlüssel ist beschädigt',
            body:
              'Zum Beispiel ein gebrochener Bart, defekte Elektronik oder ein Wasserschaden. '
              + 'Manchmal reicht eine Reparatur. Sonst fertigen wir einen neuen Schlüssel.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead:
          'Alles fragen wir Schritt für Schritt in der Anfrage ab. Je genauer Ihre Angaben sind, desto '
          + 'genauer nennen wir Preis und Termin.',
        items: [
          {
            title: 'Fahrzeugdaten',
            body: 'Marke, Modell und Baujahr. Wenn Sie es wissen, auch die Art des Schlüssels.',
          },
          {
            title: 'Drei Fotos Ihres Schlüssels',
            body:
              'Vorderseite, Rückseite und den Bart von der Seite. Daran erkennen wir Gehäuse, '
              + 'Elektronik und den passenden Rohling, also den noch ungefrästen Schlüssel.',
          },
          {
            title: 'Ein Foto des Fahrzeugscheins',
            body:
              'Eine gut lesbare Aufnahme der Zulassungsbescheinigung Teil I. Damit ordnen wir das '
              + 'Fahrzeug eindeutig zu.',
          },
          {
            title: 'Wie viele Schlüssel noch funktionieren',
            body:
              'Diese Zahl bestimmt Aufwand und Ablauf. Bitte geben Sie sie genau an. An der '
              + 'Bearbeitung ändert sie nichts, an der Planung viel.',
          },
          {
            title: 'Ihr Nachweis beim Termin',
            body:
              'Sie zeigen uns Ihren Ausweis und den Fahrzeugschein. Steht das Fahrzeug nicht auf '
              + 'Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters. Ohne diesen '
              + 'Nachweis fertigen wir keinen Fahrzeugschlüssel an.',
          },
        ],
        note:
          `Ihre Unterlagen werden nur für diesen Vorgang verwendet. Schlüsselfotos bewahren wir `
          + `${settings.retentionDays.keyPhotos} Tage auf, Aufnahmen des Fahrzeugscheins `
          + `${settings.retentionDays.vehicleRegistration} Tage. Danach werden sie gelöscht.`,
      }}
      boundary={{
        title: 'Was nicht dazugehört',
        items: [
          {
            title: 'Eine Kopie ist kein vollwertiger Schlüssel',
            body:
              'Eine Kopie hat nur den Bart. Viele Fahrzeuge haben eine Wegfahrsperre, die den Motor '
              + 'nur mit einem angemeldeten Schlüssel freigibt. Dort öffnet eine Kopie höchstens die '
              + 'Tür.',
          },
          {
            title: 'Fahrzeugöffnung ist eine eigene Leistung',
            body:
              'Liegt der Schlüssel im Fahrzeug, hilft zuerst eine Öffnung. Ein Ersatzschlüssel '
              + 'entsteht dabei nicht.',
          },
          {
            title: 'Kein Versand, wenn angelernt werden muss',
            body:
              'Das Anlernen geht nur am Fahrzeug. Dann brauchen Sie einen Termin mit Fahrzeug.',
          },
        ],
      }}
      faq={[
        {
          question: 'Wie lange dauert es, bis ich den neuen Schlüssel habe?',
          answer:
            `Der früheste Termin liegt etwa ${leadDays} Tage in der Zukunft. So lange brauchen wir, `
            + 'um den passenden Schlüssel zu beschaffen. Bei aufwendigeren Systemen kann es länger '
            + 'dauern. Den genauen Wert sehen Sie in der Anfrage, bevor Sie buchen.',
        },
        {
          question: 'Warum ist eine Anzahlung nötig?',
          answer:
            `Die Anzahlung beträgt standardmäßig ${deposit}. Sie sichert Ihren Termin und die `
            + 'Beschaffung des Schlüssels. Wir rechnen sie vollständig auf den Gesamtpreis an.',
        },
        {
          question: 'Kann ich einen Schlüssel aus dem Internet mitbringen?',
          answer:
            'Ja, bringen Sie ihn gern zum Termin mit. Ob er passt und sich anlernen lässt, prüfen wir '
            + 'vor Ort. Passt er nicht, bleibt der Aufwand für die Prüfung trotzdem. Sagen Sie uns '
            + 'deshalb bitte vorher Bescheid.',
        },
        {
          question: 'Muss ich alle vorhandenen Schlüssel mitbringen?',
          answer:
            'Ja, bitte bringen Sie alle Schlüssel des Fahrzeugs mit. Bei manchen Fahrzeugen werden '
            + 'beim Anlernen alle Schlüssel neu erfasst. Ein fehlender Schlüssel funktioniert danach '
            + 'unter Umständen nicht mehr.',
        },
        {
          question: 'Was ist, wenn ich den verlorenen Schlüssel wiederfinde?',
          answer:
            'Sagen Sie uns bitte vor dem Termin Bescheid. Je nach Fahrzeug und Umfang ändern sich '
            + 'dann der Ablauf und teilweise auch der Preis.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Wählen Sie Ihr Fahrzeug aus und laden Sie die Fotos hoch. Preis oder Preisrahmen sehen '
          + 'Sie, bevor Sie verbindlich buchen.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin anfragen' },
        secondary: { href: '/autoschluessel/marken', label: 'Fahrzeug nachschlagen' },
      }}
      related={[
        { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren', description: 'Was eine mechanische Kopie leistet' },
        { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen', description: 'Der mechanische Teil im Detail' },
        { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Autoschlüssel verloren', description: 'Was Sie jetzt in welcher Reihenfolge tun' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
