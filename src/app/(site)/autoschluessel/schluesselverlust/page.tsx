import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import { LeistungsArtikel } from '@/components/seo/seiten-daten';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

/*
 * Leistungsseite Schlüsselverlust (FA-05-07). Inhalt nur aus dem Bestand (R4): die Abschnitte zum
 * Verlust auf „Nachmachen“, der Ratgeber „Autoschlüssel verloren“ und die buchbare Leistung
 * „Ersatzschlüssel bei Verlust“. Kein Preis, keine Frist, keine Erreichbarkeit (R9); der Nachweis
 * steht wie auf den Nachbarseiten (R13). Zur Versicherung nur der Verweis auf den eigenen Vertrag.
 */

const ROUTE = 'autoschluessel/schluesselverlust';

/** Einstieg in den Termin-Assistenten mit vorgewählter Leistung (leistung-vorwahl.ts). */
const ANFRAGE = '/autoschluessel/anfrage?leistung=ersatz-bei-verlust';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel verloren: Ersatzschlüssel',
    description:
      page?.seo.description
      ?? 'Ihr Autoschlüssel ist verloren? Wir fertigen einen Ersatzschlüssel. Ist keiner mehr da, '
        + 'prüfen wir Ihre Unterlagen und den Fall zuerst einzeln.',
    alternates: { canonical: '/autoschluessel/schluesselverlust' },
  };
}

export default async function SchluesselverlustPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  return (
    <LeistungsArtikel
      pfad={`/${ROUTE}`}
      content={page}
      fallback={{
        headline: 'Autoschlüssel verloren',
        subline: 'Wir fertigen einen Ersatzschlüssel für Ihr Fahrzeug.',
        intro:
          'Prüfen Sie zuerst, was noch vorhanden ist. Funktioniert noch ein Schlüssel, ist der Aufwand '
          + 'deutlich geringer. Ist keiner mehr da, prüfen wir Ihren Fall zuerst einzeln.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/schluesselverlust', label: 'Schlüsselverlust' },
      ]}
      image={{
        motif: 'Werkstattfoto: neuer Autoschlüssel auf der Werkbank, daneben der Fahrzeugschein',
        ratio: '4/3',
        note: 'Eigene Aufnahme. Kennzeichen, Namen und Schlüsselnummern unkenntlich machen.',
      }}
      what={{
        title: 'Was wir machen',
        paragraphs: [
          'Ist ein Autoschlüssel verloren, fertigen wir einen Ersatzschlüssel. Wir fräsen den Bart und '
          + 'machen den Schlüssel dem Fahrzeug bekannt. Das nennt man Anlernen.',
          'Dabei klären wir mit Ihnen, ob der verlorene Schlüssel aus dem Fahrzeug entfernt werden '
          + 'soll.',
          'Vor der Terminbestätigung sagen wir Ihnen, was möglich ist und was es kostet. Das ist ein '
          + 'fester Preis, ein Preisrahmen oder der Hinweis, dass wir Ihre Unterlagen zuerst von Hand '
          + 'prüfen.',
        ],
      }}
      when={{
        title: 'Was noch da ist',
        lead: 'Suchen Sie zuerst gründlich. Ein wiedergefundener Schlüssel ist immer die günstigste Lösung.',
        items: [
          {
            title: 'Es funktioniert noch ein Schlüssel',
            body:
              'Dann ist der Aufwand für den Ersatz deutlich geringer. Ihr vorhandener Schlüssel dient '
              + 'uns als Vorlage.',
          },
          {
            title: 'Es ist kein Schlüssel mehr da',
            body:
              'Das ist deutlich aufwendiger. Wir prüfen Ihre Unterlagen und ob es machbar ist, bevor '
              + 'wir einen Termin bestätigen.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Beim Schlüssel lagen Unterlagen mit Ihrer Adresse',
            body:
              'Dann sprechen Sie mit uns über das weitere Vorgehen. In manchen Fällen ist es sinnvoll, '
              + 'den verlorenen Schlüssel aus dem Fahrzeug zu entfernen.',
          },
          {
            title: 'Der Schlüssel liegt im verschlossenen Fahrzeug',
            body:
              'Dann hilft zuerst eine Fahrzeugöffnung. Danach haben Sie Ihren Schlüssel wieder.',
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
            title: 'Wie viele Schlüssel noch funktionieren',
            body:
              'Diese Zahl bestimmt Aufwand und Ablauf. Bitte geben Sie sie genau an.',
          },
          {
            title: 'Fotos des vorhandenen Schlüssels',
            body:
              'Gibt es noch einen Schlüssel, schicken Sie uns Fotos davon. Sind alle Schlüssel '
              + 'verloren, entfallen die Fotos.',
          },
          {
            title: 'Ein Foto des Fahrzeugscheins',
            body:
              'Eine gut lesbare Aufnahme der Zulassungsbescheinigung Teil I. Damit ordnen wir das '
              + 'Fahrzeug eindeutig zu. Ohne Fahrzeugschein nehmen wir die Anfrage nicht an.',
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
          {
            title: 'Keine Auskunft zu Ihrer Versicherung',
            body:
              'Ob eine Versicherung Kosten übernimmt, regelt Ihr eigener Vertrag. Bitte fragen Sie '
              + 'dort nach.',
          },
        ],
      }}
      faq={[
        {
          question: 'Was ist, wenn ich den verlorenen Schlüssel wiederfinde?',
          answer:
            'Sagen Sie uns bitte vor dem Termin Bescheid. Je nach Fahrzeug und Umfang ändern sich '
            + 'dann der Ablauf und teilweise auch der Preis.',
        },
        {
          question: 'Muss ich alle vorhandenen Schlüssel mitbringen?',
          answer:
            'Ja, bitte bringen Sie alle Schlüssel des Fahrzeugs mit. Bei manchen Fahrzeugen werden '
            + 'beim Anlernen alle Schlüssel neu erfasst. Ein fehlender Schlüssel funktioniert danach '
            + 'unter Umständen nicht mehr.',
        },
        {
          question: 'Zahlt meine Versicherung den neuen Schlüssel?',
          answer:
            'Das steht in Ihrem eigenen Versicherungsvertrag. Bitte fragen Sie bei Ihrer Versicherung '
            + 'nach. Dazu können wir keine Auskunft geben.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Geben Sie Ihr Fahrzeug an. Die Leistung „Ersatzschlüssel bei Verlust“ ist dabei schon '
          + 'ausgewählt. Funktioniert noch ein Schlüssel, wählen Sie „Zweitschlüssel anfertigen“. '
          + 'Preis oder Preisrahmen sehen Sie, bevor Sie verbindlich buchen.',
        primary: { href: ANFRAGE, label: 'Termin anfragen' },
        secondary: { href: '/autoschluessel/marken', label: 'Fahrzeug nachschlagen' },
      }}
      related={[
        { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Autoschlüssel verloren', description: 'Was Sie jetzt in welcher Reihenfolge tun' },
        { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen', description: 'Zweitschlüssel und Ersatzschlüssel im Überblick' },
        { href: '/autoschluessel/fahrzeugoeffnung', label: 'Fahrzeugöffnung', description: 'Wenn der Schlüssel im Fahrzeug liegt' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
