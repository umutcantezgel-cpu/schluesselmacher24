import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Camera,
  Layers,
  Lock,
  ShieldCheck,
  Siren,
  Smartphone,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ServiceBudgetCalculator } from '@/components/sicherheitstechnik/service-budget-calculator';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitstechnik',
    description:
      page?.seo.description
      ?? 'Videoüberwachung, Alarmtechnik, Sicherung der Außenhaut, mechanischer Schutz und kombinierte Konzepte.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Symbole je Bereich — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof ShieldCheck> = {
  videoueberwachung: Camera,
  alarmtechnik: Siren,
  aussenhautsicherung: ShieldCheck,
  'mechanischer-schutz': Lock,
  'smarte-funktionen': Smartphone,
  'panik-und-alarmtaster': BellRing,
  'kombinierte-konzepte': Layers,
};

/** Der Grundsatz, nach dem wir die Bereiche zusammenstellen. */
const PRINCIPLE = [
  {
    term: 'Mechanik hält auf',
    body:
      'Zylinder, Schlösser, Beschläge und Zusatzsicherungen kosten Zeit und Kraft. Ohne diesen '
      + 'Grundschutz meldet jede Elektronik nur, dass bereits etwas passiert ist.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Tür- und Schließtechnik',
  },
  {
    term: 'Meldetechnik erkennt',
    body:
      'Melder, Kontakte und Kameras erkennen, dass an einer Stelle etwas geschieht — an der Tür, '
      + 'am Fenster, an der Scheibe oder im Raum.',
    href: `/${ROUTE}/alarmtechnik`,
    linkLabel: 'Zur Alarmtechnik',
  },
  {
    term: 'Alarmierung informiert',
    body:
      'Signalgeber und Benachrichtigungen bringen die Information dorthin, wo jemand darauf '
      + 'reagieren kann. Der Weg wird vorab festgelegt.',
    href: `/${ROUTE}/panik-und-alarmtaster`,
    linkLabel: 'Zu Panik- und Alarmtastern',
  },
];

interface Props {
  params: Promise<{ [key: string]: string | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <div style={{ display: 'none' }} data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} />
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Sicherheitstechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Sicherheitstechnik'}
        lead={page?.subline}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Grundsatz */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Einordnung"
              title="Mechanik hält auf, Meldetechnik erkennt, Alarmierung informiert"
              lead={page?.intro}
            />

            <dl className="mt-6 space-y-4">
              {PRINCIPLE.map((item) => (
                <div key={item.term} className="rounded-lg border border-border bg-surface p-5">
                  <dt className="text-[15px] font-bold text-foreground">{item.term}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {item.body}
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <ImagePlaceholder
              slot={{
                motif: 'Objektfoto: Hauseingang mit Außenkamera, Türkontakt und Sicherheitsbeschlag',
                ratio: '4/3',
                note: 'Eigene Aufnahme aus einem abgeschlossenen Projekt. Kein Stockfoto.',
              }}
            />

            <div className="rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline">
                  Bestandsaufnahme starten
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Bereiche */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Bereiche"
          title="Sieben Bereiche, die zusammen gedacht werden"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? ShieldCheck;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {service.title}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {service.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground-subtle">
                    Zum Bereich
                    <ArrowRight
                      size={13}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Recht und Verantwortung */}
      <Section id="recht-und-verantwortung">
        <SectionHeading
          eyebrow="Recht und Verantwortung"
          title="Was Sie beim Betrieb von Video, Audio und Protokollen beachten müssen"
          lead="Diese Punkte klären wir vor der Planung, damit die Technik so aufgebaut wird, wie Sie sie später auch betreiben dürfen."
        />

        <Alert
          tone="legal"
          title="Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage"
          className="mt-8"
        >
          <ul className="space-y-2">
            <li>
              Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren
              rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.
              Wir liefern und montieren die Technik und beraten technisch; eine Rechtsberatung ist
              das ausdrücklich nicht.
            </li>
            <li>
              Kameras dürfen öffentliche Flächen wie Gehwege und Straßen sowie Nachbargrundstücke
              nicht erfassen. Wir planen Aufstellort, Blickfeld und Begrenzung des Bildausschnitts
              entsprechend und halten das Ergebnis bei der Übergabe fest.
            </li>
            <li>
              Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Mikrofone und
              Aufzeichnung von Ton sind im Regelfall abgeschaltet.
            </li>
            <li>
              Gegensprech- und Alarmfunktionen richten wir nur für zulässige Einsatzzwecke ein,
              etwa für die Kommunikation an der eigenen Tür oder für eine vereinbarte Alarmierung.
            </li>
            <li>
              Protokollfunktionen — etwa Zutritts-, Ereignis- oder Bedienprotokolle — erfassen
              personenbezogene Daten. Zweck, Speicherdauer und Zugriffsberechtigung legen Sie vorab
              fest; im Beschäftigtenkontext ist zusätzlich die betriebliche Mitbestimmung zu
              beachten.
            </li>
          </ul>

          <p className="mt-3">
            <Link
              href="/rechtliches/datenschutz"
              className="font-semibold text-primary hover:underline"
            >
              Hinweise zum Datenschutz
            </Link>
          </p>
        </Alert>
      </Section>


      {/* Interactive Budget Calculator */}
      <Section id="kalkulator">
        <SectionHeading
          eyebrow="Interaktives Modul"
          title="Sicherheitskonzept Budget-Kalkulator"
          lead="Berechnen Sie unverbindlich einen ersten Richtwert für die technische Absicherung Ihres Objekts basierend auf Umfang und Schutzniveau."
        />
        <div className="mt-8 mx-auto max-w-2xl">
          <ServiceBudgetCalculator />
        </div>
      </Section>

{/* Verbindung zur Mechanik */}

      {/* Fachlicher Tiefen-Content (> 800 Wörter) */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Architektonische Methodik"
            title="Die mehrschichtige Sicherheitsarchitektur im Detail"
            lead="Sicherheitstechnik ist kein Produkt, sondern ein Konzept. Wir betrachten Gebäude als Zwiebelmodell, bei dem jede Schicht spezifische Schutzziele erfüllt. Ein einzelnes System ist anfällig; erst das Zusammenspiel aus mechanischer Barriere, elektronischer Detektion und alarmierender Meldung bildet ein valides Schutzkonzept."
          />

          <div className="prose mt-8 text-[oklch(0.32_0.02_260)]">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">1. Die Perimetersicherheit: Frühe Erkennung am Objektmantel</h3>
            <p>
              Die erste Verteidigungslinie beginnt nicht an der Tür, sondern am Grundstücksrand oder der Außenhaut des Gebäudes. Durch den Einsatz von Freilandüberwachungssystemen, Infrarot-Lichtschranken und intelligenten Videokameras mit KI-gestützter Analytik (z.B. Line-Crossing-Detection) detektieren wir Annäherungsversuche, bevor eine mechanische Manipulation am Gebäude stattfindet. Dieser Zeitvorsprung ist für die Alarmierung von Interventionskräften entscheidend.
            </p>
            <p>
              Besonderes Augenmerk legen wir dabei auf die Reduzierung von Falschalarmen (False Positives). Moderne Systeme unterscheiden zuverlässig zwischen witterungsbedingten Bewegungen, Kleintieren und tatsächlichen Personen. Die Koppelung mit einer zonierten Beleuchtungssteuerung schreckt oft bereits im Vorfeld ab.
            </p>

            <h3 className="mt-8 text-xl font-bold text-[oklch(0.16_0.02_260)]">2. Der mechanische Grundschutz: Widerstandszeitkapazität</h3>
            <p>
              Elektronik allein verhindert keinen Einbruch. Die Basis jeder Sicherheitsarchitektur bildet die Mechanik. Die sogenannte Widerstandszeit – also die Zeit, die ein Täter benötigt, um eine Barriere zu überwinden – muss maximiert werden. Wir evaluieren und ertüchtigen bestehende Türen und Fenster nach den europäischen Normen (DIN EN 1627) und rüsten bei Bedarf auf Widerstandsklassen (RC2, RC3) nach.
            </p>
            <p>
              Hierbei integrieren wir Schließbleche, Bänder, Pilzkopfverriegelungen und hochsichere Schließzylinder. Diese mechanischen Komponenten bilden das Fundament. Wenn die Widerstandszeit höher ist als die Reaktionszeit der Interventionskräfte nach einer Alarmierung, ist das Schutzkonzept erfolgreich.
            </p>

            <h3 className="mt-8 text-xl font-bold text-[oklch(0.16_0.02_260)]">3. Elektronische Detektion und Alarmverifikation</h3>
            <p>
              Sobald die Außenhautkomponenten (Glasbruchmelder, Magnetkontakte, Erschütterungssensoren) oder die Volumensicherung im Inneren (Dual-Bewegungsmelder aus PIR und Mikrowelle) eine Gefährdung registrieren, muss das Ereignis verifiziert werden. Eine reine Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL) reicht heute oft nicht mehr aus.
            </p>
            <p>
              Wir setzen auf visuelle Alarmverifikation. Im Alarmfall übermittelt das System nicht nur das Signal, sondern auch eine verschlüsselte Videosequenz des Ereignisses an die NSL. Der Operator kann sofort die Lage beurteilen und entsprechende Maßnahmen (z.B. direkte Polizei-Intervention) einleiten. Dies verhindert Kosten durch Falscheinsätze und priorisiert die Meldung bei den Behörden.
            </p>

            <h3 className="mt-8 text-xl font-bold text-[oklch(0.16_0.02_260)]">4. Zutrittsmanagement und Nachvollziehbarkeit</h3>
            <p>
              Sicherheit bedeutet auch Kontrolle über den autorisierten Zugang. Mechanische Schließanlagen stoßen bei Schlüsselverlusten oder wechselndem Personal schnell an ihre Grenzen. Elektronische Zutrittskontrollsysteme (ZKS) erlauben eine granulare Steuerung: Wer darf wann wohin?
            </p>
            <p>
              Ob über RFID-Transponder, mobile Credentials auf dem Smartphone (BLE/NFC) oder biometrische Leseverfahren – die Berechtigungen lassen sich in Echtzeit entziehen oder erteilen. Zudem bieten ZKS ein manipulationssicheres Audit-Log, welches im Ereignisfall die forensische Aufarbeitung ermöglicht. Dabei implementieren wir strikt nach dem Prinzip der Datenminimierung und gemäß DSGVO.
            </p>

            <h3 className="mt-8 text-xl font-bold text-[oklch(0.16_0.02_260)]">Fachliche FAQ & Expertise</h3>
            <dl className="mt-6 space-y-4">
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="font-bold text-[oklch(0.16_0.02_260)]">Wie funktioniert eine Aufschaltung auf eine NSL (Notruf- und Serviceleitstelle)?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Die Gefahrenmeldeanlage kommuniziert über gesicherte und redundante Übertragungswege (IP mit LTE-Backup nach DIN EN 50136) mit der Leitstelle. Bei einem Alarm arbeitet der Operator dort einen vorab mit Ihnen definierten Maßnahmenplan ab. Dies reicht von der telefonischen Rückfrage über die Entsendung eines Revierfahrers bis hin zur direkten Alarmierung der Polizei bei verifizierten Einbrüchen.
                </dd>
              </div>
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="font-bold text-[oklch(0.16_0.02_260)]">Welchen Übertragungsweg nutzt eine moderne Alarmanlage?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Wir setzen ausschließlich auf redundante Systeme. Der Primärweg ist das bestehende IP-Netzwerk (Glasfaser/DSL). Fällt dieser Weg aus (z.B. durch Sabotage oder Stromausfall), übernimmt nahtlos das integrierte Mobilfunkmodul (LTE/5G) mit einer Roaming-SIM, die sich stets in das stärkste verfügbare Netz einbucht. Regelmäßige Polling-Routinen überwachen die Verbindung permanent.
                </dd>
              </div>
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="font-bold text-[oklch(0.16_0.02_260)]">Sind funkbasierte Systeme genau so sicher wie verkabelte?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Professionelle Funksysteme (nach DIN EN 50131 Grad 2) stehen hybriden oder verkabelten Anlagen in der Zuverlässigkeit kaum nach. Sie nutzen verschlüsselte bidirektionale Kommunikation auf dedizierten Frequenzen (z.B. 868 MHz) und verfügen über Anti-Jamming-Erkennung. Bei Sanierungen oder Nachrüstungen sind sie oft die wirtschaftlichste und eingriffsärmste Lösung. Wo möglich, präferieren wir jedoch bei Neubauten oder Kernsanierungen einen verkabelten Backbone.
                </dd>
              </div>
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet VdS-Anerkennung und brauche ich sie?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Die VdS Schadenverhütung GmbH ist eine unabhängige Institution, die Sicherheitstechnik zertifiziert. Eine VdS-Anerkennung bürgt für höchste Qualität und Ausfallsicherheit. Ob Sie eine VdS-zertifizierte Anlage benötigen, hängt meist von den Auflagen Ihres Sachversicherers ab (besonders bei Gewerbeobjekten oder hohen Versicherungssummen). Für viele private Haushalte reicht eine Anlage nach DIN EN 50131 Grad 2 aus, die ebenfalls hohe Standards erfüllt.
                </dd>
              </div>
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="font-bold text-[oklch(0.16_0.02_260)]">Wie sicher sind smarte Alarmanlagen und App-Bedienung?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Der Komfort einer App-Steuerung darf niemals zulasten der Sicherheit gehen. Unsere Systeme nutzen Ende-zu-Ende verschlüsselte Verbindungen (AES-256) und kommunizieren meist über abgesicherte Cloud-Server europäischer Hersteller (ISO 27001 zertifiziert). Die Kernlogik der Anlage läuft jedoch immer lokal – auch ohne Internetverbindung arbeitet die Alarmanlage autark weiter und löst lokale Sirenen aus.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

<Section tone="muted" tight>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Grundschutz zuerst
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Tür- und Schließtechnik</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zylinder, Schlösser, Beschläge und Zusatzsicherungen sind die Grundlage. Erst darauf
                setzen wir Melde- und Alarmtechnik auf.
              </p>
              <Link
                href="/tuer-und-schliesstechnik"
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Zur Tür- und Schließtechnik
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>

          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Bestandsaufnahme
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Sicherheitscheck</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zehn Schritte zu Objekt, Zugängen, vorhandener Technik, Schwerpunkten und
                Unterlagen. Ihr Zwischenstand bleibt erhalten.
              </p>
              <Link
                href={`/${ROUTE}/sicherheitscheck`}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Sicherheitscheck starten
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
