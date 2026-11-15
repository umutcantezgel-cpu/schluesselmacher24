import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatDuration } from '@/lib/format';
import { LeistungsArtikel } from '@/components/seo/seiten-daten';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/programmieren';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel anlernen in Wetzlar',
    description:
      page?.seo.description
      ?? 'Wir machen einen neuen oder vorhandenen Schlüssel Ihrem Fahrzeug bekannt. Zum Anlernen '
        + 'in Wetzlar brauchen wir in aller Regel Ihr Fahrzeug.',
    alternates: { canonical: '/autoschluessel/programmieren' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Der Transponder ist ein kleiner Chip im Schlüssel. Beim Starten fragt das Fahrzeug ihn ab. '
    + 'Antwortet er nicht richtig, bleibt die Wegfahrsperre aktiv. Dann springt der Motor nicht an, '
    + 'auch wenn der Bart passt und die Tür aufgeht.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
  },
};

const FUNK_HINT: InfoHint = {
  title: 'Funk und Wegfahrsperre sind zwei Dinge',
  body:
    'Die Funktasten ver- und entriegeln die Türen. Die Wegfahrsperre entscheidet, ob der Motor '
    + 'startet. Beides wird getrennt angelernt. Es kann also sein, dass die Tasten gehen und der '
    + 'Motor nicht anspringt. Auch das Umgekehrte kommt vor.',
};

export default async function ProgrammierenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const slot = formatDuration(settings.booking.slotMinutes);

  return (
    <LeistungsArtikel
      pfad={`/${ROUTE}`}
      content={page}
      fallback={{
        headline: 'Autoschlüssel programmieren und anlernen',
        subline: 'Wir machen einen neuen oder vorhandenen Schlüssel Ihrem Fahrzeug bekannt.',
        intro:
          'Zum Anlernen brauchen wir in aller Regel Ihr Fahrzeug. Per Versand lässt sich das nicht lösen.',
      }}
      eyebrow="Leistung"
      crumbs={[
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: '/autoschluessel/programmieren', label: 'Programmieren' },
      ]}
      image={{
        motif: 'Werkstattfoto: Diagnosegerät an der Schnittstelle im Fußraum eines Fahrzeugs',
        ratio: '4/3',
        note: 'Eigene Aufnahme. Kennzeichen und Fahrgestellnummer unkenntlich machen.',
      }}
      what={{
        title: 'Was wir machen',
        paragraphs: [
          'Ein Fahrzeug nimmt nicht jeden Schlüssel an. Wir tragen den Schlüssel im Steuergerät ein, '
          + 'also im Rechner des Fahrzeugs. Das geht über die Diagnoseschnittstelle, einen Anschluss '
          + 'im Fahrzeug. Diesen Vorgang nennt man Anlernen oder Programmieren.',
          'Dabei geht es um zwei getrennte Dinge. Die Funktasten öffnen und schließen die Türen. Der '
          + 'Transponder ist ein kleiner Chip im Schlüssel. Nur wenn das Fahrzeug ihn erkennt, gibt '
          + 'die Wegfahrsperre den Motor frei.',
          `Planen Sie für den Termin Zeit ein. Ein Standardtermin dauert ${slot}. Bei aufwendigeren `
          + 'Systemen planen wir in der Anfrage mehr Zeit ein.',
        ],
      }}
      when={{
        title: 'Wann ein Anlernen nötig ist',
        items: [
          {
            title: 'Ein neuer Schlüssel kommt dazu',
            body: 'Jeder weitere Schlüssel muss angelernt werden, bevor er den Motor startet.',
            hint: TRANSPONDER_HINT,
          },
          {
            title: 'Die Funktasten reagieren nicht mehr',
            body:
              'Sind Batterie und Tasten in Ordnung, muss die Funkverbindung vielleicht neu angelernt '
              + 'werden.',
            hint: FUNK_HINT,
          },
          {
            title: 'Ein Schlüssel ist verloren gegangen',
            body:
              'Auf Wunsch entfernen wir ihn aus dem Fahrzeug. Dann wird er nicht mehr angenommen. Ob '
              + 'das bei Ihrem Fahrzeug geht, prüfen wir vorab.',
          },
          {
            title: 'Die Tür geht auf, aber der Motor startet nicht',
            body:
              'Das deutet oft auf eine fehlende oder gestörte Kennung für die Wegfahrsperre hin. Die '
              + 'Ursache suchen wir am Fahrzeug.',
          },
          {
            title: 'Ein Steuergerät wurde getauscht',
            body: 'Dann müssen die vorhandenen Schlüssel oft neu angelernt werden.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Ohne Fahrzeug geht es nicht. Bitte bringen Sie zum Termin alles mit.',
        items: [
          {
            title: 'Ihr Fahrzeug',
            body:
              'Es muss fahrbereit sein oder bei uns abgestellt werden können. Die Fahrzeugbatterie '
              + 'muss genug Spannung haben.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Alle vorhandenen Schlüssel',
            body:
              'Manche Fahrzeuge erfassen beim Anlernen alle Schlüssel neu. Ein fehlender Schlüssel '
              + 'wird danach unter Umständen nicht mehr angenommen.',
          },
          {
            title: 'Ihr Nachweis beim Termin',
            body:
              'Wir arbeiten nur an Fahrzeugen, über die Sie nachweislich verfügen dürfen. Sie zeigen '
              + 'uns Ihren Ausweis und den Fahrzeugschein. Steht das Fahrzeug nicht auf Ihren Namen, '
              + 'brauchen wir zusätzlich eine Vollmacht des Halters.',
          },
          {
            title: 'Was genau nicht funktioniert',
            body:
              'Beschreiben Sie, was noch geht und was nicht. Zum Beispiel Türen, Tasten, Motorstart '
              + 'oder Kontrollleuchten. So finden wir die Ursache schneller.',
          },
          {
            title: 'Drei Fotos Ihres Schlüssels',
            body:
              'Aus verschiedenen Richtungen aufgenommen. So wissen wir vorher, welches System Sie '
              + 'haben, und können uns vorbereiten.',
          },
        ],
      }}
      boundary={{
        title: 'Was nicht dazugehört',
        items: [
          {
            title: 'Kein neuer Bart',
            body:
              'Anlernen betrifft nur die Elektronik. Passt der Bart nicht ins Schloss, muss er '
              + 'zusätzlich gefräst werden.',
          },
          {
            title: 'Nicht per Versand',
            body:
              'Das Anlernen geht nur am Fahrzeug. Ein eingeschickter Schlüssel wird dadurch nicht '
              + 'fahrbereit.',
          },
          {
            title: 'Keine Zusage ohne Prüfung',
            body:
              'Bei einzelnen Fahrzeugen gibt nur der Hersteller den Zugang zum Steuergerät frei. '
              + 'Solche Fälle prüfen wir vorab. Wir sagen Ihnen ehrlich, ob wir sie übernehmen können.',
          },
          {
            title: 'Keine Reparatur am Fahrzeug',
            body:
              'Liegt der Fehler am Fahrzeug und nicht am Schlüssel, finden wir das heraus und sagen es '
              + 'Ihnen. Die Reparatur am Fahrzeug gehört nicht zu dieser Leistung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Kann ich den Schlüssel nicht selbst anlernen?',
          answer:
            'Bei einigen älteren Fahrzeugen geht das ohne Gerät. Bei den meisten Fahrzeugen braucht '
            + 'man die Diagnoseschnittstelle. Was für Ihr Fahrzeug gilt, sagen wir Ihnen vorab.',
        },
        {
          question: 'Wie lange dauert das Anlernen?',
          answer:
            `Ein Standardtermin dauert ${slot}. Bei aufwendigeren Systemen planen wir mehr Zeit ein. `
            + 'Die Dauer für Ihren Fall sehen Sie in der Anfrage, bevor Sie den Termin bestätigen.',
        },
        {
          question: 'Verliert mein alter Schlüssel dabei seine Funktion?',
          answer:
            'Das hängt vom Fahrzeug ab. Manche Systeme erfassen beim Anlernen alle Schlüssel neu. '
            + 'Bringen Sie deshalb bitte alle vorhandenen Schlüssel mit.',
        },
        {
          question: 'Ich habe einen Schlüssel online gekauft. Können Sie ihn anlernen?',
          answer:
            'Bringen Sie ihn gern mit. Ein gebrauchter Schlüssel trägt oft noch die Daten seines '
            + 'früheren Fahrzeugs. Ob er passt und sich anlernen lässt, zeigt sich erst am Fahrzeug. '
            + 'Sagen Sie uns bitte vorher Bescheid, damit wir das einplanen.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Fragen Sie einen Termin mit Fahrzeug an. Vorher sehen Sie, welche Angaben nötig sind und '
          + 'welcher Preis oder Preisrahmen gilt.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin anfragen' },
        secondary: { href: '/autoschluessel/marken', label: 'Fahrzeug nachschlagen' },
      }}
      related={[
        { href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless', description: 'Besonderheiten schlüsselloser Systeme' },
        { href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel', description: 'Wenn die Tasten nicht mehr reagieren' },
        { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
        { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen', description: 'Zurück zur Übersicht' },
      ]}
    />
  );
}
