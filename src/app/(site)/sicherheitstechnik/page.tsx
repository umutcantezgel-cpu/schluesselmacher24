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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

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


      {/* Fachliche Methodik & Architektur */}
      <Section tight>
        <SectionHeading
          eyebrow="Methodik"
          title="Unsere architektonische Herangehensweise an Sicherheit"
          lead="Eine solide Sicherheitsarchitektur basiert nicht auf isolierten Einzelmaßnahmen, sondern auf einem durchdachten Gesamtkonzept, das Mechanik, Elektronik und Organisation nahtlos integriert."
        />
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          <p>
            Die Konzeption einer modernen Sicherheitsarchitektur beginnt stets mit einer fundierten Schwachstellenanalyse. Wir betrachten jedes Objekt als individuelles System mit spezifischen Risikoprofilen und Nutzungsanforderungen. Mechanische Sicherungen bilden dabei das fundamentale Bollwerk gegen physische Eindringversuche. Sie verlangsamen den Angriff und fordern dem Täter Zeit und Werkzeug ab.
          </p>
          <p>
            Auf diesem mechanischen Grundschutz bauen wir die elektronische Detektionsebene auf. Alarmanlagen und Sensorik dienen nicht primär der Verhinderung eines Einbruchs, sondern der frühzeitigen Erkennung und unmittelbaren Meldung. Jeder gewonnene Moment durch die Mechanik wird durch die Elektronik genutzt, um Interventionskräfte zu alarmieren.
          </p>
          <p>
            Eine oft unterschätzte Komponente ist die Videotechnik, die in unserem Konzept eine doppelte Funktion erfüllt: Sie dient sowohl der präventiven Abschreckung als auch der nachgelagerten forensischen Analyse. Die intelligente Vernetzung dieser drei Ebenen — Mechanik, Alarmierung und Videoüberwachung — führt zu einem synergetischen Sicherheitssystem, das deutlich resistenter ist als die Summe seiner Einzelteile.
          </p>
          <p>
            Darüber hinaus integrieren wir fortschrittliche Zutrittskontrollsysteme, die eine granulare Verwaltung von Berechtigungen ermöglichen. Dies bedeutet nicht nur erhöhte Sicherheit, sondern auch signifikante organisatorische Erleichterungen im Alltag. Verlorene Schlüssel stellen kein Sicherheitsrisiko mehr dar, da elektronische Berechtigungen in Echtzeit entzogen werden können.
          </p>
        </div>
      </Section>

      {/* Leistungsstufen & Matrix */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Leistungsstufen"
          title="Transparente Sicherheitskonzepte für unterschiedliche Anforderungen"
          lead="Wir bieten gestufte Sicherheitskonzepte, die sich an der tatsächlichen Gefährdungslage und Ihren spezifischen Schutzbedürfnissen orientieren."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3 md:grid-rows-[subgrid]">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] md:row-span-3 grid grid-rows-[subgrid]">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Basis-Schutz</h3>
            <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">Mechanische Grundsicherung für Wohnungen und kleinere Gewerbeobjekte.</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[oklch(0.32_0.02_260)]">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> VdS-anerkannte Profilzylinder</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Sicherheitsbeschläge mit Ziehschutz</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Massive Schließbleche</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[oklch(0.52_0.24_260)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_12px_32px_-4px_oklch(0.52_0.24_260/0.15)] relative md:row-span-3 grid grid-rows-[subgrid]">
            <div className="absolute -top-3 right-4 rounded-full bg-[oklch(0.52_0.24_260)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Empfohlen</div>
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Erweiterter Schutz</h3>
            <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">Kombination aus Mechanik und elektronischer Überwachung für Einfamilienhäuser und kritische Gewerbeflächen.</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[oklch(0.32_0.02_260)]">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Alle Basis-Leistungen</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Funk-Alarmanlage (EN 50131 Grad 2)</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Perimetrischer Außenschutz</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Aufschaltung zur Notrufleitstelle</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] md:row-span-3 grid grid-rows-[subgrid]">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Hochsicherheit</h3>
            <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">Vollintegrierte Systeme für hochsensible Anlagen und Industrieobjekte.</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[oklch(0.32_0.02_260)]">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Elektronische Zutrittskontrolle</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> KI-gestützte Videoanalyse</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Redundante Alarmübertragung</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[oklch(0.52_0.24_260)]"/> Integration ins Gebäudemanagement</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Interaktives Modul Platzhalter */}
      <Section tight>
        <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* FAQ Abschnitt */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Fachspezifische Antworten zur Sicherheitstechnik"
          lead="Klären Sie erste Fragen direkt. Für eine detaillierte Beurteilung Ihres Objekts empfehlen wir den persönlichen Sicherheitscheck."
        />
        <div className="mt-8 space-y-4">
          {[
            {
              q: "Wie lange dauert die Installation einer Funk-Alarmanlage?",
              a: "Die Installation einer modernen Funk-Alarmanlage in einem durchschnittlichen Einfamilienhaus ist in der Regel an einem Arbeitstag abgeschlossen. Da keine Kabel verlegt werden müssen, erfolgt die Montage nahezu schmutzfrei und ohne größere Eingriffe in die Bausubstanz."
            },
            {
              q: "Sind elektronische Zylinder sicher gegen Hacking?",
              a: "Hochwertige elektronische Zylinder nutzen verschlüsselte Kommunikation (z.B. AES-128 Bit oder höher) und sind gegen typische digitale Angriffsvektoren abgesichert. Zudem entfällt das Risiko unbemerkt kopierter mechanischer Schlüssel, da Zutrittsrechte zentral verwaltet und bei Verlust sofort gesperrt werden können."
            },
            {
              q: "Was passiert bei einem Stromausfall mit meiner Alarmanlage?",
              a: "Professionelle Einbruchmeldeanlagen verfügen über eine integrierte Notstromversorgung durch Akkus. Diese überbrücken Stromausfälle, je nach Anlagengröße und Norm, für 12 bis 72 Stunden zuverlässig, sodass der Schutz lückenlos aufrechterhalten bleibt."
            },
            {
              q: "Kann ich meine bestehende Schließanlage mit elektronischen Komponenten erweitern?",
              a: "Ja, in den meisten Fällen lassen sich mechatronische Systeme oder rein elektronische Zylinder nahtlos in bestehende mechanische Schließanlagen integrieren. So können hochfrequentierte Türen elektronisch und weniger kritische Bereiche weiterhin mechanisch gesichert werden (hybrides System)."
            },
            {
              q: "Wann ist eine Aufschaltung auf eine Notrufleitstelle sinnvoll?",
              a: "Eine Aufschaltung empfehlen wir generell, wenn im Alarmfall eine sofortige, garantierte Intervention erforderlich ist. Während lokale Sirenen primär abschrecken, stellt die Leitstelle sicher, dass 24/7 gemäß einem vereinbarten Maßnahmenplan reagiert wird (z.B. Benachrichtigung des Wachdienstes oder der Polizei)."
            }
          ].map((faq, idx) => (
            <details key={idx} className="group rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-[oklch(0.16_0.02_260)]">
                {faq.q}
                <span className="transition duration-300 group-open:-rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
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
