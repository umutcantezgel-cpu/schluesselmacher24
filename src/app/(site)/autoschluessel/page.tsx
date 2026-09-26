import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, KeyRound, Wrench } from 'lucide-react';

import { getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { KEY_KIND_HINT, ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';
import { ServiceBudgetCalculator } from '@/components/autoschluessel/calculator/service-budget-calculator';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'autoschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel — Leistungen im Überblick',
    description:
      page?.seo.description
      ?? 'Autoschlüssel nachmachen, kopieren, programmieren und reparieren. Alle Leistungen, '
        + 'der Ablauf und die passenden Fahrzeugmarken im Überblick.',
    alternates: { canonical: '/autoschluessel' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Im Schlüssel sitzt ein kleiner Chip, der Transponder. Beim Starten fragt das Fahrzeug diesen '
    + 'Chip ab. Passt die Antwort nicht, bleibt die Wegfahrsperre aktiv und der Motor springt nicht '
    + 'an — auch dann, wenn der mechanische Bart passt und die Tür aufgeht.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
    note: 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.',
  },
};

const BART_HINT: InfoHint = {
  title: 'Was ist der Schlüsselbart?',
  body:
    'Der Bart ist der metallene Teil des Schlüssels, der in das Schloss passt. Er wird nach einer '
    + 'Vorlage oder nach geeigneten Fahrzeugdaten gefräst. Mit der Elektronik im Schlüssel hat er '
    + 'nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnitten und Bezeichnung der Positionen',
    ratio: '3/2',
  },
};

const SMART_KEY_HINT: InfoHint = {
  title: 'Smart Key und Keyless',
  body:
    'Bei diesen Systemen erkennt das Fahrzeug den Schlüssel, sobald er sich in der Nähe befindet. '
    + 'Sie öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Beschaffung und Anlernen '
    + 'sind aufwendiger als bei einem einfachen Funkschlüssel.',
};

interface Topic {
  term: string;
  href: string;
  body: string;
  hint?: InfoHint;
}

interface TopicGroup {
  title: string;
  lead: string;
  icon: typeof KeyRound;
  topics: Topic[];
}

const TOPIC_GROUPS: TopicGroup[] = [
  {
    title: 'Schlüssel anfertigen',
    lead: 'Alles, was einen zusätzlichen oder neuen Schlüssel für Ihr Fahrzeug betrifft.',
    icon: KeyRound,
    topics: [
      {
        term: 'Autoschlüssel nachmachen',
        href: '/autoschluessel/nachmachen',
        body: 'Ein vollständiger weiterer Schlüssel — mechanisch gefertigt und elektronisch angelernt.',
      },
      {
        term: 'Zweitschlüssel',
        href: '/autoschluessel/nachmachen',
        body: 'Ein zusätzlicher Schlüssel, solange mindestens ein funktionierender vorhanden ist.',
      },
      {
        term: 'Ersatzschlüssel nach Verlust',
        href: '/autoschluessel/nachmachen',
        body: 'Kein Schlüssel mehr vorhanden. Umfang und Machbarkeit prüfen wir im Einzelfall.',
      },
      {
        term: 'Autoschlüssel kopieren',
        href: '/autoschluessel/kopieren',
        body: 'Mechanische Kopie nach Vorlage. Ohne Elektronik startet sie das Fahrzeug nicht.',
      },
      {
        term: 'Schlüsselbart fräsen',
        href: '/autoschluessel/schluesselbart-fraesen',
        body: 'Der metallene Teil des Schlüssels — nach Vorlage oder geeigneten Fahrzeugdaten.',
        hint: BART_HINT,
      },
    ],
  },
  {
    title: 'Elektronik und Programmierung',
    lead: 'Damit das Fahrzeug den Schlüssel erkennt und annimmt.',
    icon: Wrench,
    topics: [
      {
        term: 'Programmieren und anlernen',
        href: '/autoschluessel/programmieren',
        body: 'Der Schlüssel wird dem Fahrzeug bekannt gemacht. Dafür ist Zugriff auf das Fahrzeug nötig.',
        hint: ON_SITE_HINT,
      },
      {
        term: 'Transponder und Wegfahrsperre',
        href: '/autoschluessel/programmieren',
        body: 'Der Chip im Schlüssel entscheidet darüber, ob der Motor startet.',
        hint: TRANSPONDER_HINT,
      },
      {
        term: 'Funkschlüssel',
        href: '/autoschluessel/funkschluessel',
        body: 'Fernbedienung zum Ver- und Entriegeln. Funk und Wegfahrsperre sind getrennte Funktionen.',
      },
      {
        term: 'Smart Key und Keyless',
        href: '/autoschluessel/smart-key',
        body: 'Schlüsselloser Zugang und Start. Mehr Vorlauf und mehr Zeit am Fahrzeug einplanen.',
        hint: SMART_KEY_HINT,
      },
    ],
  },
  {
    title: 'Reparatur und Sonderfälle',
    lead: 'Wenn der vorhandene Schlüssel nicht mehr richtig arbeitet oder gar nicht greifbar ist.',
    icon: Car,
    topics: [
      {
        term: 'Gehäuse, Tasten und Batterie',
        href: '/autoschluessel/funkschluessel',
        body: 'Gebrochenes Gehäuse, klemmende Tasten oder schwache Batterie — die Elektronik bleibt erhalten.',
      },
      {
        term: 'Schlüsselverlust',
        href: '/autoschluessel/nachmachen',
        body: 'Die richtige Reihenfolge spart Zeit: erst prüfen, was noch vorhanden ist, dann beauftragen.',
      },
      {
        term: 'Fahrzeugöffnung',
        href: '/autoschluessel/fahrzeugoeffnung',
        body: 'Zerstörungsfreies Öffnen als eigene Leistung. Sie ersetzt keinen Ersatzschlüssel.',
      },
    ],
  },
];

const FAQ = [
  {
    question: 'Muss mein Fahrzeug für einen neuen Autoschlüssel vor Ort sein?',
    answer:
      'Für rein mechanische Arbeiten am Bart in vielen Fällen nicht. Sobald der Schlüssel elektronisch '
      + 'angelernt werden muss, ist Zugriff auf das Fahrzeug erforderlich. Ob das bei Ihrem Fahrzeug '
      + 'der Fall ist, sehen Sie auf der jeweiligen Modellseite und im geführten Ablauf.',
  },
  {
    question: 'Was kostet ein neuer Autoschlüssel?',
    answer:
      'Das hängt vom Fahrzeug und von der Schlüsselart ab. Im geführten Ablauf erhalten Sie nach der '
      + 'Auswahl Ihres Fahrzeugs entweder einen festen Preis, einen Preisrahmen oder den Hinweis, dass '
      + 'wir Ihren Fall zuerst manuell prüfen. Erst danach buchen Sie einen Termin.',
  },
  {
    question: 'Warum brauchen Sie Fotos von meinem Schlüssel?',
    answer:
      'Die Bauform sagt uns, welches Gehäuse, welcher Rohling und welche Elektronik verbaut sind. '
      + 'Drei Aufnahmen aus unterschiedlichen Richtungen reichen in aller Regel aus. Das erspart '
      + 'Rückfragen und verhindert, dass beim Termin etwas fehlt.',
  },
  {
    question: 'Kann ich meinen Schlüssel einschicken?',
    answer:
      'Für mechanische Arbeiten ist ein Versand in vielen Fällen möglich. Muss der Schlüssel am '
      + 'Fahrzeug angelernt werden, hilft ein Versand nicht weiter — dann ist ein Termin mit Fahrzeug '
      + 'der richtige Weg.',
  },
  {
    question: 'Wofür ist die Anzahlung?',
    answer:
      'Die Anzahlung sichert Ihren Termin und die Beschaffung des passenden Schlüssels. Sie wird '
      + 'vollständig auf den Gesamtpreis angerechnet.',
  },
  {
    question: 'Ich habe meinen Schlüssel im Fahrzeug eingeschlossen. Was jetzt?',
    answer:
      'Dafür gibt es die Fahrzeugöffnung als eigene Leistung. Bitte halten Sie einen Nachweis bereit, '
      + 'dass Sie über das Fahrzeug verfügen dürfen.',
  },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AutoschluesselHubPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  // Der Ablauf ist überall derselbe; Beträge und Vorlauf kommen aus den Einstellungen.
  const steps = [
    {
      title: 'Fahrzeug wählen',
      body: 'Marke, Modell, Baujahr und Schlüsselart. Wir fragen nur ab, was für Ihr Fahrzeug zählt.',
    },
    {
      title: 'Fotos hochladen',
      body: 'Ihren Schlüssel aus drei Richtungen und den Fahrzeugschein.',
    },
    {
      title: 'Preis oder Prüfung',
      body: 'Sie erhalten einen festen Preis, einen Preisrahmen oder den Hinweis auf eine manuelle Prüfung.',
    },
    {
      title: 'Anzahlung',
      body: `Standard ${deposit}. Der Betrag wird vollständig auf den Gesamtpreis angerechnet.`,
    },
    {
      title: 'Termin buchen',
      body: `Der früheste Termin liegt etwa ${leadDays} Tage in der Zukunft, weil wir Ihren Schlüssel vorher beschaffen.`,
    },
  ];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd
        data={pageGraphSchema({
          path: '/autoschluessel',
          name: page?.headline ?? 'Autoschlüssel',
          description: page?.seo.description,
          crumbs: [{ href: '/autoschluessel', label: 'Autoschlüssel' }],
          faq: page?.faq?.length ? page.faq : FAQ,
        })}
      />

      <PageHeader
        eyebrow="Themenwelt Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel'}
        lead={page?.subline ?? 'Nachmachen, programmieren, reparieren — mit klarem Ablauf und festem Termin.'}
        crumbs={[{ href: '/autoschluessel', label: 'Autoschlüssel' }]}
        actions={
          <ButtonLink href="/autoschluessel/anfrage">
            Fahrzeug auswählen und Termin starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Ablauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              {PROCESS_LABELS['termin-mit-anzahlung'].label}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Anzahlung
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Vorlauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              ca. {leadDays} Tage
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Erfasste Modelle
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{modelCount}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* Einordnung */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title="Worum es in diesem Bereich geht" />
            <div className="prose-sm24 mt-5">
              <p>
                {page?.intro
                  ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder '
                    + 'Preisrahmen. Erst dann buchen Sie einen Termin.'}
              </p>
              <p>
                Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem
                mechanischen Bart und der Elektronik. Für Ihren Auftrag ist entscheidend, welcher der
                beiden Teile bearbeitet werden muss — davon hängen Aufwand, Termin und Preis ab.
              </p>
              <p>
                Die folgenden Begriffe führen Sie zu der Seite, die Ihren Fall beschreibt. Wenn Sie
                unsicher sind, beginnen Sie mit dem geführten Ablauf: Dort fragen wir Schritt für
                Schritt genau die Angaben ab, die für Ihr Fahrzeug nötig sind.
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Arbeitsplatz mit Schlüsselfräse und Diagnosegerät',
              ratio: '4/3',
              note: 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Architektonische Methodik */}
      <Section id="architektur" tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title="Architektonische Methodik und Fachexpertise" />
            <div className="prose-sm24 mt-5 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Die moderne Sicherheitstechnik, insbesondere im Bereich der Autoschlüssel, ist ein hochkomplexes
                und technologisches Meisterwerk. Wenn wir über die Bearbeitung oder Neuerstellung von
                Autoschlüsseln sprechen, tauchen wir in eine Welt ein, in der Feinmechanik auf fortschrittlichste
                Mikroelektronik trifft. Dies ist nicht mehr der einfache Vorgang des Nachschleifens eines
                simplen Metallstücks, wie es noch vor wenigen Jahrzehnten der Fall war. Vielmehr handelt es sich
                um einen präzisen, computergestützten Prozess, der ein tiefes Verständnis für verschiedene
                Fahrzeughersteller und deren proprietäre Sicherheitssysteme erfordert.
              </p>
              <p>
                Im Zentrum dieser Entwicklung steht die Wegfahrsperre, ein System, das darauf ausgelegt ist,
                Fahrzeugdiebstähle drastisch zu reduzieren. Der Schlüsselbart mag noch immer die mechanische
                Barriere des Türschlosses überwinden, doch das eigentliche Herzstück der Berechtigung ist der
                Transponder-Chip, der im Schlüsselgehäuse eingebettet ist. Wenn der Schlüssel ins Zündschloss
                gesteckt oder in die Nähe des Startknopfes gebracht wird, findet ein komplexer, kryptografischer
                Austausch zwischen dem Schlüssel und dem Steuergerät des Fahrzeugs statt. Nur wenn dieser
                Handshake erfolgreich ist, wird die Kraftstoffzufuhr und Zündung freigegeben. Das bedeutet, dass
                ein Ersatzschlüssel nicht nur mechanisch perfekt passen muss, sondern auch elektronisch exakt
                auf das spezifische Fahrzeug codiert werden muss.
              </p>
              <p>
                Diese Codierung ist ein Prozess, der als Schlüsselprogrammierung bekannt ist. Hierfür setzen wir
                hochspezialisierte Diagnosegeräte ein, die über die OBD-Schnittstelle (On-Board Diagnostics) mit
                dem Fahrzeug kommunizieren. Es ist eine anspruchsvolle Aufgabe, da jeder Fahrzeughersteller, sei
                es Volkswagen, BMW, Mercedes-Benz oder Toyota, seine eigenen Sicherheitsprotokolle und
                Verschlüsselungsalgorithmen verwendet. Unsere Experten müssen daher kontinuierlich geschult
                werden und die neuesten Software-Updates für unsere Diagnosegeräte nutzen, um mit der rasanten
                Entwicklung der Fahrzeugtechnologie Schritt zu halten.
              </p>
              <p>
                Darüber hinaus gibt es verschiedene Generationen von Schlüsselsystemen. Frühere Systeme nutzten
                einfache Festcodes, während moderne Fahrzeuge Rollcodes oder Krypto-Transponder verwenden, bei
                denen sich der Code bei jedem Startvorgang ändert, um das Abfangen oder Kopieren des Signals zu
                verhindern (sogenannte Replay-Angriffe). Hinzu kommen die Keyless-Go oder Smart-Key-Systeme, die
                auf Nahfeldkommunikation basieren und es ermöglichen, das Fahrzeug zu entriegeln und zu starten,
                ohne den Schlüssel jemals aus der Tasche zu nehmen. Diese Systeme bieten höchsten Komfort,
                stellen aber auch besondere Herausforderungen an die Sicherheit und damit an die Neuprogrammierung
                oder das Kopieren von Schlüsseln.
              </p>
              <p>
                Unsere Vorgehensweise ist strikt prozessorientiert und auf höchste Sicherheit sowie Kundenzufriedenheit
                ausgerichtet. Wenn ein Kunde zu uns kommt, ist der erste Schritt immer eine gründliche Diagnose.
                Wir müssen exakt feststellen, welches System im Fahrzeug verbaut ist und welche Art von Schlüssel
                benötigt wird. Ist es ein einfacher Bartschlüssel mit Transponder? Ein Funkschlüssel? Oder ein
                moderner Smart-Key? Jede dieser Kategorien erfordert eine andere Herangehensweise und
                unterschiedliche Rohlinge sowie Programmierverfahren.
              </p>
              <p>
                Wir legen großen Wert auf Transparenz und Aufklärung. Viele Kunden sind überrascht von der
                Komplexität eines modernen Autoschlüssels und den damit verbundenen Kosten. Wir erklären den
                Prozess im Detail und zeigen auf, warum ein hochwertiger Ersatzschlüssel eine Investition in die
                Sicherheit ihres Fahrzeugs ist. Die Verwendung billiger, nicht zertifizierter Nachbauten kann zu
                Fehlfunktionen der Elektronik führen und im schlimmsten Fall das Steuergerät des Fahrzeugs
                beschädigen, was zu immensen Folgekosten führt.
              </p>
              <p>
                Neben der Neuprogrammierung bieten wir auch die Reparatur von defekten Schlüsseln an. Oft sind es
                nur gebrochene Gehäuse, verschlissene Tasten oder leere Batterien, die einen Schlüssel
                unbrauchbar machen. In vielen Fällen können wir die empfindliche Elektronik aus dem alten Gehäuse
                retten und in ein neues einbauen, was eine kostengünstigere und ressourcenschonendere Alternative
                zum kompletten Neukauf darstellt. Auch das Erneuern von Mikroschaltern auf der Platine gehört zu
                unseren Standardleistungen.
              </p>
              <p>
                Ein weiteres kritisches Szenario ist der vollständige Schlüsselverlust, das &quot;All Keys Lost&quot;-Szenario.
                Dies ist der denkbar ungünstigste Fall, da keine Vorlage für den mechanischen Bart und kein
                funktionierender Transponder für die Codierung vorhanden ist. In diesen Fällen müssen wir oft
                anhand der Fahrgestellnummer (VIN) den mechanischen Code des Schlosses ermitteln oder die
                Türschlösser decodieren, um den Bart zu fräsen. Anschließend muss das Steuergerät des Fahrzeugs
                in einen Lernmodus versetzt werden, was bei modernen Fahrzeugen eine Online-Verbindung zu den
                Servern des Herstellers und spezielle Berechtigungsnachweise erfordert. Dieser Prozess ist
                zeitaufwendig und erfordert höchste Expertise.
              </p>
              <p>
                Um unseren Kunden den besten Service zu bieten, investieren wir kontinuierlich in die neueste
                Fräs- und Diagnosetechnik. Unsere computergesteuerten CNC-Schlüsselfräsmaschinen arbeiten mit
                mikrometergenauer Präzision, um sicherzustellen, dass jeder neu gefertigte Schlüssel absolut
                reibungslos im Schloss schließt. Wir pflegen zudem enge Partnerschaften mit führenden
                Herstellern von Sicherheitstechnik und Diagnose-Hardware, um stets auf dem neuesten Stand der
                Technik zu sein.
              </p>
              <p>
                Zusammenfassend lässt sich sagen, dass unser Service rund um Autoschlüssel weit mehr ist als
                nur das Duplizieren von Metall. Es ist ein hochspezialisiertes Handwerk, das tiefgreifendes Wissen
                über Fahrzeugelektronik, Kryptografie und Feinmechanik erfordert. Wir verstehen uns als Partner
                unserer Kunden, wenn es um die Sicherheit und Mobilität ihrer Fahrzeuge geht, und bieten
                maßgeschneiderte Lösungen, die höchste Qualitäts- und Sicherheitsstandards erfüllen.
              </p>
            </div>
          </div>
          <div>
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Leistungsstufen und Vergleichsmatrix */}
      <Section id="matrix">
        <SectionHeading
          title="Strukturierte Leistungsstufen im Überblick"
          lead="Eine klare Einordnung unserer Services von der Basis-Kopie bis zur Premium-Neuprogrammierung."
        />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
          <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
            <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Leistungsstufe</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Beschreibung</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Technischer Aufwand</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Vorlaufzeit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">
              <tr>
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Basic (Reparatur)</td>
                <td className="px-6 py-4">Gehäusetausch, Tastenwechsel, Batteriewechsel unter Erhalt der Elektronik.</td>
                <td className="px-6 py-4">Gering - Mechanische Feinarbeit</td>
                <td className="px-6 py-4">Sofort möglich</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Standard (Zweitschlüssel)</td>
                <td className="px-6 py-4">Fräsen des Barts und Klonen/Anlernen des Transponders mit vorhandenem Masterschlüssel.</td>
                <td className="px-6 py-4">Mittel - OBD-Zugang erforderlich</td>
                <td className="px-6 py-4">Nach Terminvereinbarung (ca. 30 Min)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Advanced (Smart Key)</td>
                <td className="px-6 py-4">Programmierung von Keyless-Go Systemen und adaptiven Fernbedienungen.</td>
                <td className="px-6 py-4">Hoch - Herstellerspezifische Protokolle</td>
                <td className="px-6 py-4">Mit Termin (ca. 60 Min)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Premium (All Keys Lost)</td>
                <td className="px-6 py-4">Komplette Neugenerierung inkl. Schlossdecodierung und Steuergeräte-Reset ohne Vorlage.</td>
                <td className="px-6 py-4">Sehr Hoch - Online-Anbindung & PIN-Ermittlung</td>
                <td className="px-6 py-4">Individuell (ab 1 Werktag)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Fachspezifischer FAQ */}
      <Section id="deep-faq" tone="muted">
        <SectionHeading
          title="Tiefgehende Fragen zur Fahrzeugsicherheit"
          lead="Detaillierte Antworten zu komplexen Szenarien und technischen Herausforderungen."
        />
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">1. Warum kann ein Baumarkt meinen neuen Autoschlüssel nicht kopieren?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Während traditionelle Schlüsseldienste oder Baumärkte in der Lage sind, den mechanischen Bart eines Autoschlüssels nachzufräsen, fehlt ihnen meist das teure Spezialequipment für die Wegfahrsperre. Fast alle Fahrzeuge ab Baujahr 1995 besitzen einen Transponder-Chip im Schlüsselkopf. Ohne eine korrekte elektronische Programmierung dieses Chips über die OBD-Schnittstelle des Fahrzeugs wird der Wagen nicht anspringen. Unser Betrieb investiert kontinuierlich in diese Diagnose-Hard- und Software, um auch modernste Krypto-Transponder codieren zu können.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">2. Was passiert technisch, wenn alle Autoschlüssel verloren wurden (&quot;All Keys Lost&quot;)?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Ein &quot;All Keys Lost&quot;-Szenario ist die anspruchsvollste Aufgabe in unserem Bereich. Da kein Musterschlüssel vorliegt, müssen wir den mechanischen Schließcode entweder über die Fahrgestellnummer (VIN) vom Hersteller anfordern (falls verfügbar) oder ein Türschloss mit Spezialwerkzeug decodieren. Anschließend fräsen wir den Schlüssel auf einer CNC-Maschine. Für die Elektronik müssen wir in das Motorsteuergerät oder die Wegfahrsperreneinheit eingreifen, oft einen PIN-Code extrahieren oder das System komplett zurücksetzen, bevor neue Schlüssel angelernt werden können. Dies erfordert höchste Fachkompetenz und oft eine Online-Verbindung zu den Herstellerservern.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">3. Sind Aftermarket-Schlüssel genauso sicher wie Originalschlüssel vom Vertragshändler?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Wir verwenden ausschließlich zertifizierte Aftermarket-Schlüssel in Erstausrüsterqualität (OEM-Qualität) oder originale Ersatzteile. Ein hochwertiger Aftermarket-Schlüssel nutzt denselben oder einen kompatiblen Transponder-Chip wie das Original und bietet exakt dieselbe kryptografische Sicherheit. Er kommuniziert auf demselben verschlüsselten Weg mit der Wegfahrsperre. Der Hauptunterschied liegt oft nur im fehlenden Markenlogo auf dem Gehäuse, während die Funktionalität und Sicherheit zu 100 % gewährleistet sind, bei oft deutlich geringeren Kosten.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">4. Wie funktioniert der Diebstahlschutz bei Keyless-Go-Systemen und wie sichern Sie Ersatzschlüssel ab?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Keyless-Go-Systeme senden kontinuierlich ein schwaches Funksignal, das vom Fahrzeug im Nahbereich erkannt wird. Kriminelle versuchen oft, dieses Signal mit &quot;Reichweitenverlängerern&quot; abzufangen. Wenn wir einen neuen Smart Key anlernen, nutzen wir die aktuellsten Verschlüsselungsprotokolle des Herstellers, die oft Ultra-Wideband (UWB) Technologie oder Bewegungssensoren im Schlüssel umfassen, um solche &quot;Relay Attacks&quot; zu verhindern. Zudem löschen wir bei Verlustfällen die alten, verlorenen Schlüssel aus dem Speicher der Wegfahrsperre, sodass diese das Fahrzeug nicht mehr öffnen oder starten können.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">5. Welche Risiken bestehen bei der selbstständigen Programmierung mit günstigen OBD-Dongles aus dem Internet?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Wir raten dringend von DIY-Programmierversuchen ab. Moderne Wegfahrsperren sind hochsensibel. Der Einsatz von nicht verifizierter Software oder billigen OBD-Dongles kann das EEPROM (den Speicher) des Motorsteuergeräts (ECU) oder der zentralen Elektronikeinheit (BSI/BCM) unwiderruflich beschädigen oder das Fahrzeug in einen &quot;Lockout&quot;-Modus versetzen. Im schlimmsten Fall muss dann das gesamte Steuergerät kostenintensiv ausgetauscht werden. Professionelle Werkzeuge haben Schutzmechanismen (wie automatische Backups der Codierung) integriert, die bei günstigen Endkunden-Geräten fehlen.
            </p>
          </div>
        </div>
      </Section>


      {/* Leistungsbegriffe */}
      <Section tone="muted" id="leistungen">
        <SectionHeading
          eyebrow="Leistungen"
          title="Alle Begriffe, sauber getrennt"
          lead="Die Begriffe werden im Alltag oft vermischt. Hier steht, was jeweils gemeint ist und wohin er führt."
        />

        <div className="mt-8 space-y-8">
          {TOPIC_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-foreground">{group.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                      {group.lead}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.topics.map((topic) => (
                    <li key={topic.term}>
                      <Card className="flex h-full flex-col">
                        <CardBody className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-[15px] font-bold text-foreground">{topic.term}</h4>
                            {topic.hint && <InfoTip hint={topic.hint} className="shrink-0" />}
                          </div>
                          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                            {topic.body}
                          </p>
                          <Link
                            href={topic.href}
                            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                          >
                            Zur Seite
                            <ArrowRight size={15} aria-hidden />
                            <span className="sr-only">{topic.term}</span>
                          </Link>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Ablauf in fünf Schritten */}
      <Section id="ablauf">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Ablauf"
              title="In fünf Schritten zum Termin"
              lead="Mobil bedienbar. Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Ablauf starten
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Erst Fahrzeug nachschlagen
              </ButtonLink>
            </div>

            <Alert tone="info" title="Anzahlung und Vorlauf" className="mt-7">
              Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den Gesamtpreis
              angerechnet. Der Vorlauf von etwa {leadDays} Tagen entsteht durch die Beschaffung des
              passenden Schlüssels. Für einzelne Fahrzeuge und Leistungen können abweichende Werte
              gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.
            </Alert>
          </div>

          <ol className="relative space-y-5 border-l border-border pl-7">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                >
                  {index + 1}
                </span>
                <h3 className="text-[15px] font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Fahrzeuge */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Fahrzeuge"
              title="Was für Ihre Marke und Ihr Modell gilt"
              lead={`Zu ${makes.length} Marken und ${modelCount} Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen vor Ort sein muss.`}
            />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/autoschluessel/marken">
                Alle Marken ansehen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {makes.slice(0, 9).map((make) => (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {make.name}
                  <ArrowRight size={14} aria-hidden className="shrink-0 text-foreground-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Was vor dem Auftrag meist offen ist"
          className="max-w-2xl"
        />
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <SectionHeading
          title="Weiterführende Seiten"
          lead="Passend zum Thema Autoschlüssel."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Ablauf', description: 'Fahrzeug wählen, Preis erhalten, Termin buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Schlüsselarten je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
            { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
            { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage', description: 'Für Schlüssel ohne Fahrzeugbezug' },
            { href: '/service-und-termin/terminstatus', label: 'Terminstatus', description: 'Stand Ihres Vorgangs abrufen' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
