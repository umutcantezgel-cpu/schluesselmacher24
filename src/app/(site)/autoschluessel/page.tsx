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
import { CarKeyCalculator } from '@/components/calculator/car-key-calculator';
import { KEY_KIND_HINT, ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';
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

export default async function AutoschluesselHubPage() {
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
    <>
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
            <div className="prose-sm24 mt-5 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem
                mechanischen Bart und der Elektronik. Für Ihren Auftrag ist entscheidend, welcher der
                beiden Teile bearbeitet werden muss — davon hängen Aufwand, Termin und Preis ab.
              </p>
              <h3 className="text-[oklch(0.16_0.02_260)] font-semibold mt-8 mb-4 text-xl">Architektonische Methodik der Autoschlüssel-Programmierung</h3>
              <p>
                Die technologische Evolution von Fahrzeugschlüsseln hat in den letzten zwei Jahrzehnten
                einen Paradigmenwechsel vollzogen. Wo früher ein rein mechanischer Schließzylinder das Maß der Dinge war,
                ist heute ein hochkomplexes, kryptografisch abgesichertes System getreten.
                Jeder moderne Autoschlüssel, selbst solche, die auf den ersten Blick rein mechanisch wirken,
                beherbergt einen Transponderchip. Dieser Chip kommuniziert über ein RFID-Signal (Radio Frequency Identification)
                mit der Wegfahrsperre des Fahrzeugs. Wenn der Schlüssel in das Zündschloss eingeführt oder in die
                Nähe der Lesespule gebracht wird, sendet das Fahrzeug ein elektromagnetisches Feld aus, welches den Transponder
                im Schlüssel mit Energie versorgt. Der Chip sendet daraufhin einen verschlüsselten Code zurück an das
                Motorsteuergerät (ECU) oder das Wegfahrsperren-Modul (Immobilizer). Nur wenn dieser kryptografische Handshake
                erfolgreich ist, wird die Kraftstoffzufuhr und die Zündung freigegeben.
              </p>
              <p className="mt-4">
                Die Methodik zur Duplikation oder Neuprogrammierung dieser Schlüssel variiert je nach Generation und
                Sicherheitsarchitektur des Herstellers. Wir unterscheiden grundlegend drei Verfahren:
                Cloning, On-Board Programming (OBP) und EEPROM-Programmierung.
                Beim Cloning wird die Signatur des existierenden Schlüssels 1:1 auf einen leeren Transponder (z.B. Superchip)
                kopiert. Dies ist das schnellste Verfahren, jedoch bei vielen modernen Rolling-Code-Systemen (wie Megamos Crypto
                oder NXP Hitag) nicht mehr möglich, da sich der Code bei jedem Startvorgang ändert.
              </p>
              <p className="mt-4">
                Das On-Board Programming erfolgt über die OBD2-Schnittstelle (On-Board Diagnostics) des Fahrzeugs.
                Hierbei verbinden wir unsere hochspezialisierten Diagnosegeräte mit dem CAN-Bus-System des Autos.
                Nach der Authentifizierung – oft unter Umgehung zeitbasierter Sicherheitssperren (Security Access Delays)
                oder durch die Berechnung von PIN/Outcode/Incode-Algorithmen – wird das neue Schlüssel-Zertifikat direkt
                im Speicher der Wegfahrsperre hinterlegt. Dieses Verfahren ist bei über 80% der modernen Fahrzeuge der Standard.
              </p>
              <p className="mt-4">
                Die EEPROM-Programmierung (Electrically Erasable Programmable Read-Only Memory) ist die Königsdisziplin
                und kommt dann zum Einsatz, wenn alle Schlüssel verloren wurden (All Keys Lost - AKL) und der Zugriff über
                OBD blockiert ist. Hierbei wird das Wegfahrsperren-Modul (z.B. CAS/FEM bei BMW, EZS bei Mercedes-Benz oder
                BCM bei VAG) ausgebaut, geöffnet und der Mikroprozessor oder EEPROM-Chip direkt auf der Platine ausgelesen.
                Mit speziellen Hex-Editoren und Kryptografie-Software generieren wir aus diesem Speicherabzug (Dump) einen
                sogenannten Dealer-Key, der anschließend sofort das Fahrzeug startet.
              </p>
              <h3 className="text-[oklch(0.16_0.02_260)] font-semibold mt-8 mb-4 text-xl">Vergleichsmatrix: Mechanisch, Funk und Smart Key</h3>
              <div className="my-8 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] overflow-x-auto shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)] font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">
                    <tr>
                      <th className="px-6 py-4">Technologie</th>
                      <th className="px-6 py-4">Sicherheitsebene</th>
                      <th className="px-6 py-4">Programmierungsart</th>
                      <th className="px-6 py-4">Zeitaufwand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.32_0.02_260)] bg-[oklch(0.988_0.002_260)]">
                    <tr>
                      <td className="px-6 py-4 font-medium">Transponder (ohne Funk)</td>
                      <td className="px-6 py-4">RFID (Festcode / Krypto)</td>
                      <td className="px-6 py-4">Cloning oder OBD</td>
                      <td className="px-6 py-4">15 - 30 Min.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Funkschlüssel (Remote)</td>
                      <td className="px-6 py-4">Rolling Code + Transponder</td>
                      <td className="px-6 py-4">OBD-Zusatzprogrammierung</td>
                      <td className="px-6 py-4">30 - 45 Min.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Smart Key (Keyless Go)</td>
                      <td className="px-6 py-4">Proximity 3D Antennen + Krypto AES</td>
                      <td className="px-6 py-4">Advanced OBD / EEPROM</td>
                      <td className="px-6 py-4">45 - 90 Min.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Die Wahl der korrekten Rohlinge ist ebenfalls von entscheidender Bedeutung. Originalhersteller (OEM) verwenden
                spezifische Legierungen wie Neusilber (Kupfer-Nickel-Zink) oder Messing, um eine hohe Langlebigkeit bei gleichzeitigem
                Schutz der Zuhaltungen im Schließzylinder zu gewährleisten. Wir fräsen diese Hochsicherheits-Bahnenschlüssel (Laser-Cut)
                auf computergesteuerten CNC-Fräsmaschinen (z.B. von Silca oder Keyline) mit einer Toleranz von weniger als 0,02 Millimetern.
                Dies stellt sicher, dass der Schlüssel exakt den Werksspezifikationen (Bitting Code) entspricht und ein hakenfreies,
                seidiges Drehen im Schloss garantiert ist. Abnutzungen, die bei mechanischen Kopiervorgängen von einem ohnehin schon
                verschlissenen Schlüssel übertragen würden, werden durch unseren Code-Fräsprozess komplett eliminiert.
                Sie erhalten somit mechanisch einen Schlüssel im absoluten Neuzustand.
              </p>
              <p className="mt-4">
                Darüber hinaus spielt die Batterie-Technologie in Smart Keys eine immer wichtigere Rolle. Durch die permanente
                Kommunikationsbereitschaft ziehen diese Schlüssel konstant Strom. Während ein klassischer Funkschlüssel oft 5 bis 7 Jahre
                mit einer CR2032-Knopfzelle auskommt, verlangen moderne Keyless-Go-Schlüssel oft schon nach ein bis zwei Jahren nach einem
                Austausch. Wir überprüfen bei jedem Service die Signalstärke (Frequency Test bei 433 MHz oder 868 MHz) und die Infrarot-Emission
                (speziell bei Mercedes-Benz FBS3/FBS4 Systemen), um einen Ausfall nach der Neuprogrammierung sicher auszuschließen.
              </p>
              <p className="mt-4">
                Im Falle eines totalen Schlüsselverlusts (All Keys Lost) wird nicht nur ein neuer Schlüssel generiert,
                sondern das Fahrzeug sicherheitstechnisch neu abgeriegelt. Alle bisherigen, verlorenen Schlüssel werden im
                Speicher des Fahrzeugs unwiderruflich gelöscht oder blockiert. Selbst wenn der unehrliche Finder Ihres alten
                Schlüssels das Auto entdeckt, kann er dieses weder per Funk öffnen, noch den Motor starten. Der mechanische
                Schließzylinder in der Fahrertür bleibt zwar prinzipiell sperrbar, durch den Eingriff in die Elektronik ist
                das Fahrzeug jedoch gegen unbefugte Inbetriebnahme vollständig immunisiert.
              </p>
            </div>
            <CarKeyCalculator />
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
        <Accordion items={[
  {
    question: "Was ist der Unterschied zwischen Kopieren und Programmieren?",
    answer: "Beim Kopieren wird die elektronische Signatur Ihres vorhandenen Schlüssels 1:1 auf einen Leer-Transponder übertragen. Dies ist meist bei älteren Fahrzeugen möglich. Beim Programmieren wird ein völlig neuer Schlüssel mit einer eigenen, neuen Signatur direkt am Steuergerät (OBD) Ihres Fahrzeugs angemeldet. Für 90% der modernen Fahrzeuge ist eine Programmierung zwingend erforderlich."
  },
  {
    question: "Kann mein Fahrzeug auch gestartet werden, wenn die Batterie im Smart Key leer ist?",
    answer: "Ja. Jeder Smart Key verfügt über einen passiven Transponder als Notlauf-Ebene, der keine eigene Stromversorgung benötigt. Sie müssen den Schlüssel in diesem Fall direkt an die dafür vorgesehene Lesespule halten (z.B. am Start-Knopf oder an der Lenksäule), damit das elektromagnetische Feld des Autos den Chip mit Energie versorgt."
  },
  {
    question: "Warum müssen bei Keyless Go Schlüsseln oft alle alten Schlüssel gelöscht werden?",
    answer: "Viele Hersteller schreiben aus Sicherheitsgründen vor, dass bei der Anlernung eines neuen Schlüssels das gesamte Schließsystem neu initialisiert wird. Dies verhindert, dass verlorene Schlüssel weiterhin Zugang zum Fahrzeug haben. Alle Schlüssel, die Sie behalten möchten, müssen zwingend zum Programmiertermin mitgebracht werden."
  },
  {
    question: "Ist ein Nachbauschlüssel qualitativ schlechter als ein Originalschlüssel vom Hersteller?",
    answer: "Nein, nicht wenn hochwertige Aftermarket-Platinen und Gehäuse verwendet werden. Wir verwenden ausschließlich NXP-Chips und Hochfrequenz-Komponenten, die exakt denen der Erstausrüster entsprechen. Die mechanische Fräsung erfolgt auf identischen CNC-Maschinen nach den werksseitigen Code-Vorgaben."
  },
  {
    question: "Muss mein Auto für die Anfertigung eines Schlüssels bei Ihnen vor Ort sein?",
    answer: "In den meisten Fällen ja. Eine direkte Programmierung über die OBD-Schnittstelle erfordert physischen Zugang zum Fahrzeug. Ausnahmen bilden reine mechanische Nachschlüssel ohne Transponder oder spezifische Module (wie EWS/CAS), die Sie im ausgebauten Zustand per Post zu uns senden können."
  }
]} className="mt-8" />
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
    </>
  );
}
