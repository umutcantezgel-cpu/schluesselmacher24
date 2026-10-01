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
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';

const ROUTE = 'sicherheitstechnik';


interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  // Consume to prevent unused errors
  void resolvedParams;
  void resolvedSearch;
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


      {/* Fachkompetenz und ROI */}
      <Section>
        <SectionHeading
          eyebrow="Wirtschaftlichkeit & ROI"
          title="Prävention als messbarer Wirtschaftsfaktor"
          lead="Sicherheitstechnik ist nicht nur ein reiner Kostenblock. Durch gezielte Prävention lassen sich materielle Schäden, Betriebsunterbrechungen und Vertrauensverluste effektiv minimieren."
        />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="prose prose-sm prose-slate max-w-none text-[oklch(0.32_0.02_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Die Architektur moderner Prävention</h3>
            <p>
              Unsere Methodik beruht auf dem Prinzip der konzentrischen Sicherheitsringe. Anstatt isolierte Maßnahmen zu ergreifen, betrachten wir Ihr Objekt ganzheitlich. Die mechanische Sicherung der Außenhaut bildet dabei das physische Fundament. Sie verzögert den unbefugten Zutritt so lange, bis die elektronische Meldetechnik einen Einbruchversuch sicher detektiert und an eine hilfeleistende Stelle (z.B. Wachdienst oder Polizei) weiterleitet.
            </p>
            <h3 className="mt-8 text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wirtschaftliche Betrachtung</h3>
            <p>
              Die direkten Kosten eines Einbruchs (Diebstahl, Vandalismus) machen oft nur den geringsten Teil des wirtschaftlichen Schadens aus. Weitaus schwerwiegender sind Betriebsunterbrechungen, der Verlust sensibler Daten und die daraus resultierenden Reputationsschäden bei Kunden und Partnern.
            </p>
            <p className="mt-4">
              Eine professionell geplante Sicherheitsarchitektur amortisiert sich in der Regel deutlich schneller als angenommen. Nutzen Sie unseren Enterprise ROI-Kalkulator, um eine erste, unverbindliche Schätzung der Amortisationszeit für Ihr spezifisches Risikoprofil zu erhalten.
            </p>
          </div>
          <div>
            <EnterpriseROICalculator />
          </div>
        </div>
      </Section>

      {/* Detaillierte Fach-FAQ */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Fachwissen"
          title="Häufig gestellte Fragen zur Sicherheitsarchitektur"
          lead="Detaillierte Antworten auf die wichtigsten architektonischen und technischen Fragestellungen."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet der Zwangsläufigkeitsgrundsatz in der Alarmtechnik?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Der Zwangsläufigkeitsgrundsatz ist ein elementares Prinzip der Einbruchmeldetechnik (VdS). Er besagt, dass eine Alarmanlage nur dann scharfgeschaltet werden kann, wenn alle überwachten Öffnungen (Türen, Fenster) physisch verschlossen sind. Gleichzeitig verhindert er das Betreten des gesicherten Bereichs bei scharfgeschalteter Anlage, ohne dass zuvor zwangsläufig eine Unscharfschaltung erfolgt. Dies minimiert das Risiko von Falschalarmen durch Fehlbedienung drastisch.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Welchen Stellenwert hat die Mechanik bei elektronischer Überwachung?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Mechanik und Elektronik schließen sich nicht aus, sie bedingen einander. Eine Einbruchmeldeanlage verhindert keinen Einbruch, sie meldet ihn nur. Ohne ausreichenden mechanischen Widerstandswert (RC2/RC3) der Türen und Fenster steht der Täter im Objekt, bevor die hilfeleistende Stelle reagieren kann. Die Mechanik kauft Zeit, die Elektronik nutzt diese Zeit zur Alarmierung.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Wie wird die Sabotagesicherheit bei vernetzten Systemen gewährleistet?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Professionelle Systeme verfügen über ein mehrstufiges Sabotageschutzkonzept. Dies umfasst die Überwachung aller Gehäusedeckel auf Öffnung, die Überwachung der Leitungsnetze auf Kurzschluss, Unterbrechung und Fremdspannung sowie redundante Übertragungswege (z.B. IP/LAN gekoppelt mit LTE/5G) zur Alarmempfangsstelle (AES).
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Was versteht man unter einer &apos;verdeckten Alarmierung&apos;?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Bei einem Überfall (im Gegensatz zum Einbruch) erfolgt die Alarmierung meist &apos;still&apos;, also ohne akustische oder optische Signalisierung vor Ort, um eine Eskalation durch den Täter zu vermeiden. Dies geschieht über diskret angebrachte Paniktaster, Geldscheinkontakte oder spezielle Bedrohungscodes an der Schalteinrichtung. Der Alarm wird lautlos an eine hilfeleistende Stelle übertragen.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Ist eine Notstromversorgung zwingend erforderlich?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Ja, eine VdS-konforme Einbruchmeldeanlage muss bei einem Netzausfall ihre volle Funktionsfähigkeit für eine definierte Zeit (i.d.R. 12 oder 60 Stunden, je nach Klasse) aufrechterhalten können. Dies wird durch kapazitätsüberwachte Blei-Gel-Akkumulatoren in der Zentrale und den abgesetzten Energieversorgungen sichergestellt.
            </p>
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
