import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatDuration } from '@/lib/format';
import { ServiceArticle } from '@/components/autoschluessel/service-article';
import { ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/programmieren';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel programmieren und anlernen',
    description:
      page?.seo.description
      ?? 'Transponder, Wegfahrsperre, Funkfernbedienung und Smart Key anlernen lassen. '
        + 'Termin mit Fahrzeug vor Ort.',
    alternates: { canonical: '/autoschluessel/programmieren' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Der Transponder ist ein kleiner Chip im Schlüssel. Beim Starten fragt das Fahrzeug ihn ab. '
    + 'Antwortet er nicht richtig, bleibt die Wegfahrsperre aktiv und der Motor springt nicht an — '
    + 'selbst dann, wenn der Bart passt und die Tür aufgeht.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
  },
};

const FUNK_HINT: InfoHint = {
  title: 'Funk und Wegfahrsperre sind zwei Dinge',
  body:
    'Die Funkfernbedienung ver- und entriegelt die Türen. Die Wegfahrsperre entscheidet, ob der '
    + 'Motor startet. Beide Funktionen werden getrennt angelernt — es kann also sein, dass die Tasten '
    + 'arbeiten, der Motor aber nicht anspringt, oder umgekehrt.',
};

export default async function ProgrammierenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const slot = formatDuration(settings.booking.slotMinutes);

  return (
    <ServiceArticle
      content={page}
      fallback={{
        headline: 'Autoschlüssel programmieren und anlernen',
        subline: 'Transponder, Funk und Smart Key elektronisch am Fahrzeug anlernen.',
        intro:
          'Beim Programmieren wird ein Schlüssel dem Fahrzeug bekannt gemacht. Dafür ist in aller '
          + 'Regel Zugriff auf das Fahrzeug nötig.',
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
        title: 'Was beim Programmieren passiert',
        paragraphs: [
          'Ein Autoschlüssel wird vom Fahrzeug nicht automatisch akzeptiert. Er muss im Steuergerät '
          + 'hinterlegt werden. Dieser Vorgang heißt Anlernen oder Programmieren und läuft über die '
          + 'Diagnoseschnittstelle des Fahrzeugs.',
          'Dabei werden zwei Funktionen getrennt behandelt: die Funkfernbedienung für das Ver- und '
          + 'Entriegeln und die Wegfahrsperre für den Start. Beide können unabhängig voneinander in '
          + 'Ordnung oder gestört sein.',
          'Weil das Fahrzeug dafür angeschlossen werden muss, ist ein Termin mit Fahrzeug bei uns '
          + `erforderlich. Planen Sie dafür Zeit ein — die Standard-Terminlänge liegt bei ${slot}, `
          + 'bei aufwendigeren Systemen wird sie im Ablauf entsprechend länger angesetzt.',
        ],
      }}
      when={{
        title: 'Wann ist ein Anlernen nötig?',
        items: [
          {
            title: 'Ein neuer Schlüssel kommt dazu',
            body:
              'Jeder zusätzliche Schlüssel muss dem Fahrzeug bekannt gemacht werden, bevor er den '
              + 'Motor startet.',
            hint: TRANSPONDER_HINT,
          },
          {
            title: 'Ein gebrauchter Schlüssel soll übernommen werden',
            body:
              'Ein Schlüssel aus einer anderen Quelle trägt noch die Daten seines früheren '
              + 'Fahrzeugs. Ob er sich übernehmen lässt, prüfen wir am Fahrzeug.',
          },
          {
            title: 'Die Fernbedienung reagiert nicht mehr',
            body:
              'Wenn Batterie und Taster in Ordnung sind, kann die Funkverbindung neu angelernt '
              + 'werden müssen.',
            hint: FUNK_HINT,
          },
          {
            title: 'Ein Schlüssel ist verloren gegangen',
            body:
              'Auf Wunsch entfernen wir den verlorenen Schlüssel aus dem Fahrzeug, damit er nicht '
              + 'mehr angenommen wird. Ob das bei Ihrem Fahrzeug möglich ist, prüfen wir vorab.',
          },
          {
            title: 'Nach einem Steuergerätetausch',
            body:
              'Wurde am Fahrzeug ein Steuergerät getauscht, müssen die vorhandenen Schlüssel oft '
              + 'erneut zugeordnet werden.',
          },
          {
            title: 'Der Motor startet nicht, die Tür geht auf',
            body:
              'Ein typisches Bild bei fehlender oder gestörter Wegfahrsperren-Kennung. Die Ursache '
              + 'grenzen wir am Fahrzeug ein.',
          },
        ],
      }}
      need={{
        title: 'Was wir von Ihnen brauchen',
        lead: 'Ohne Fahrzeug lässt sich das Anlernen nicht durchführen. Bitte bringen Sie alles mit.',
        items: [
          {
            title: 'Das Fahrzeug selbst',
            body:
              'Es muss fahrbereit oder zumindest bei uns abstellbar sein und über eine nutzbare '
              + 'Bordspannung verfügen.',
            hint: ON_SITE_HINT,
          },
          {
            title: 'Alle vorhandenen Schlüssel',
            body:
              'Bei manchen Fahrzeugen werden beim Anlernen sämtliche Schlüssel neu erfasst. Fehlt '
              + 'einer, wird er danach unter Umständen nicht mehr angenommen.',
          },
          {
            title: 'Fahrzeugschein und Ausweisdokument',
            body:
              'Wir arbeiten nur an Fahrzeugen, über die Sie nachweislich verfügen dürfen. Der '
              + 'Nachweis erfolgt beim Termin.',
          },
          {
            title: 'Angaben zum Fehlerbild',
            body:
              'Beschreiben Sie möglichst genau, was funktioniert und was nicht: Türen, Tasten, '
              + 'Startvorgang, Kontrollleuchten. Das verkürzt die Eingrenzung.',
          },
          {
            title: 'Fotos Ihres Schlüssels',
            body:
              'Drei Aufnahmen aus unterschiedlichen Richtungen. So wissen wir vorher, welches System '
              + 'vorliegt und was wir vorbereiten müssen.',
          },
        ],
      }}
      boundary={{
        title: 'Abgrenzung — was Programmieren nicht leistet',
        items: [
          {
            title: 'Kein Ersatz für den mechanischen Bart',
            body:
              'Programmieren betrifft nur die Elektronik. Passt der Bart nicht ins Schloss, muss er '
              + 'zusätzlich gefräst werden.',
          },
          {
            title: 'Nicht per Versand möglich',
            body:
              'Das Anlernen erfolgt am Fahrzeug. Ein eingeschickter Schlüssel lässt sich damit nicht '
              + 'fahrbereit machen.',
          },
          {
            title: 'Keine Zusage ohne Prüfung',
            body:
              'Bei einzelnen Fahrzeugen ist der Zugang zum Steuergerät an den Hersteller gebunden. '
              + 'Solche Fälle prüfen wir vorab und sagen Ihnen ehrlich, ob wir sie übernehmen können.',
          },
          {
            title: 'Keine Reparatur der Fahrzeugelektronik',
            body:
              'Liegt die Ursache nicht am Schlüssel, sondern am Fahrzeug, grenzen wir das ein und '
              + 'sagen es Ihnen. Die Instandsetzung am Fahrzeug selbst gehört nicht zu dieser '
              + 'Leistung.',
          },
        ],
      }}
      faq={[
        {
          question: 'Kann ich den Schlüssel nicht selbst anlernen?',
          answer:
            'Bei einigen älteren Fahrzeugen gibt es Anlernvorgänge, die ohne Gerät auskommen. Bei den '
            + 'meisten Fahrzeugen ist der Zugriff über die Diagnoseschnittstelle nötig. Was für Ihr '
            + 'Fahrzeug gilt, sagen wir Ihnen vorab.',
        },
        {
          question: 'Wie lange dauert das Anlernen?',
          answer:
            `Die Standard-Terminlänge liegt bei ${slot}. Bei aufwendigeren Systemen planen wir mehr `
            + 'Zeit ein. Die für Ihren Fall vorgesehene Dauer sehen Sie im geführten Ablauf, bevor '
            + 'Sie den Termin bestätigen.',
        },
        {
          question: 'Verliert mein alter Schlüssel dabei seine Funktion?',
          answer:
            'Das hängt vom Fahrzeug ab. Bei manchen Systemen werden beim Anlernen alle Schlüssel neu '
            + 'erfasst — deshalb bitten wir darum, sämtliche vorhandenen Schlüssel mitzubringen.',
        },
        {
          question: 'Kann ein verlorener Schlüssel gesperrt werden?',
          answer:
            'Bei vielen Fahrzeugen lässt sich ein Schlüssel aus dem Steuergerät entfernen, sodass er '
            + 'nicht mehr angenommen wird. Ob das bei Ihrem Fahrzeug möglich ist, prüfen wir vor dem '
            + 'Termin.',
        },
        {
          question: 'Ich habe einen Schlüssel online gekauft. Können Sie ihn anlernen?',
          answer:
            'Bringen Sie ihn gern mit. Ob er zum Fahrzeug passt und sich anlernen lässt, zeigt sich '
            + 'erst am Fahrzeug. Sagen Sie uns bitte vorher Bescheid, damit wir den Fall richtig '
            + 'einplanen.',
        },
      ]}
      next={{
        title: 'Der nächste Schritt',
        lead:
          'Buchen Sie einen Termin mit Fahrzeug. Vorher sehen Sie, welche Angaben nötig sind und '
          + 'welcher Preis oder Preisrahmen gilt.',
        primary: { href: '/autoschluessel/anfrage', label: 'Termin mit Fahrzeug starten' },
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
