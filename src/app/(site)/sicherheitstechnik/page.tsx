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
import { SicherheitsMatrix } from '@/components/sicherheitstechnik/sicherheits-matrix';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
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
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedSearch = await searchParams;

  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
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

      {/* Verbindung zur Mechanik */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12 mt-12 mb-12">
          <div>
             <SectionHeading
                eyebrow="Risikoanalyse"
                title="Sicherheits-Matrix: Gefährdungspotenzial erkennen und bewerten"
                lead="Ein fundiertes Sicherheitskonzept beginnt mit der präzisen Analyse des Gefährdungspotenzials. Berechnen Sie hier den Risiko-Score basierend auf objektiven Faktoren, um die passenden Schutzmaßnahmen abzuleiten. Von der mechanischen Grundsicherung bis zur vernetzten Alarmtechnik – die Matrix hilft bei der Priorisierung."
              />
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground-muted">
                <p>
                  Die Bewertung der Gebäudesicherheit ist kein Ratespiel, sondern folgt einer klaren Methodik.
                  Unser Ansatz basiert auf der systematischen Erfassung von Schwachstellen und der Definition
                  geeigneter Widerstandsklassen (RC). Dabei betrachten wir nicht nur die offensichtlichen
                  Einstiegswege wie Türen und Fenster, sondern auch Lichtschächte, Nebeneingänge und die
                  Fassadenstruktur.
                </p>
                <p>
                  Ein oft unterschätzter Aspekt ist die <strong>kombinierte Sicherheit</strong>. Ein
                  hochwertiges Schließsystem verliert an Wirkung, wenn das Schließblech nicht tief genug im
                  Mauerwerk verankert ist oder die Türbänder leicht auszuhebeln sind. Ebenso ist eine
                  Alarmanlage nur dann wirklich effektiv, wenn die Mechanik dem Angreifer so lange
                  Widerstand leistet, bis eine Intervention (z. B. durch einen Sicherheitsdienst) erfolgen kann.
                </p>
                 <p>
                  <strong>Leistungsstufen im Überblick:</strong><br />
                  - <strong>Stufe 1 (Grundschutz):</strong> Solide Zylinder, Schutzbeschläge und Kernziehschutz.<br />
                  - <strong>Stufe 2 (Erweitert):</strong> Zusätzliche mechanische Sicherungen (Querriegel, Fenstersicherungen).<br />
                  - <strong>Stufe 3 (Elektronik):</strong> Integration von Zutrittskontrollsystemen und Basis-Alarmierung.<br />
                  - <strong>Stufe 4 (Vollschutz):</strong> Vernetzte Systeme mit Videoüberwachung, Aufschaltung und Protokollierung.
                </p>
              </div>
          </div>
          <div className="mt-8 lg:mt-0">
             <SicherheitsMatrix />
          </div>
        </div>

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

      {/* Häufig gestellte Fragen (FAQ) */}
      <Section id="faq" tone="muted">
        <SectionHeading
          eyebrow="Wissen"
          title="Häufig gestellte Fragen zur Sicherheitstechnik"
          lead="Fundierte Antworten auf die wichtigsten Fragen bei der Planung und Umsetzung von Sicherheitskonzepten."
        />
        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">1. Wie hoch sind die Kosten für eine professionelle Alarmanlage?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die Investition hängt stark vom Umfang und der gewünschten Schutzklasse ab. Ein drahtloses Basis-System für eine Wohnung beginnt bei etwa 800 Euro. Für ein vollvernetztes System in einem Einfamilienhaus, inklusive Außensicherung, Videoüberwachung und Aufschaltung zu einem Sicherheitsdienst, kalkulieren wir in der Regel ab 3.500 Euro. Wichtig ist: Zuverlässigkeit kostet Geld – von günstigen Baumarkt-Sets raten wir dringend ab, da Fehlalarme und Sicherheitslücken vorprogrammiert sind.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">2. Was bedeutet RC (Resistance Class) und welche Klasse brauche ich?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die Resistance Class (RC) gibt an, wie lange ein Bauteil (z. B. Fenster oder Tür) einem Einbruchsversuch mit bestimmten Werkzeugen standhält. RC 1 bietet nur einen sehr geringen Grundschutz. Für private Wohnhäuser empfiehlt die Kriminalpolizei mindestens RC 2. Bei erhöhtem Gefährdungspotenzial oder im gewerblichen Bereich planen wir standardmäßig mit RC 3. Jede Klasse wurde unter genormten Bedingungen getestet und zertifiziert.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">3. Kann ich eine Alarmanlage selbst installieren oder brauche ich einen Fachbetrieb?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Wir raten dringend von der Selbstmontage ab. Eine moderne Gefahrenmeldeanlage ist hochkomplex. Falsch platzierte Melder, nicht fachgerecht verlegte Leitungen oder eine inkorrekte Parametrierung der Zentrale führen unweigerlich zu Fehlalarmen. Zudem wird eine Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL) in der Regel nur bei Anlagen akzeptiert, die von einem zertifizierten Fachbetrieb nach DIN EN 50131 geplant und errichtet wurden.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">4. Welche Förderung gibt es für den Einbau von Sicherheitstechnik?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die KfW (Kreditanstalt für Wiederaufbau) bezuschusst den Einbau von einbruchhemmenden Türen, Gittern und Alarmanlagen. Die Förderung (Zuschuss 455-E) kann bis zu 20 % der förderfähigen Kosten betragen, abhängig von der Investitionssumme. Voraussetzung ist zwingend, dass die Maßnahmen von einem Fachunternehmen durchgeführt werden und der Antrag vor Beginn der Arbeiten gestellt wird. Wir unterstützen Sie gerne bei der Zusammenstellung der erforderlichen technischen Unterlagen.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-[17px] font-bold text-foreground">5. Ist eine Videoüberwachung immer sinnvoll?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Nicht immer. Kameras verhindern keinen Einbruch, sie dokumentieren ihn lediglich. Videoüberwachung ist dann sinnvoll, wenn sie als Teil eines Gesamtkonzepts eingesetzt wird – beispielsweise um bei einer Alarmauslösung (durch Bewegungsmelder oder Türkontakte) eine sofortige visuelle Verifikation zu ermöglichen. Eine Aufschaltung zur Leitstelle wird dadurch wesentlich effizienter, da Fehlalarme ausgeschlossen werden können.
            </p>
          </div>
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
