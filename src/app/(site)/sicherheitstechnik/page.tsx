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
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;

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
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
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


      {/* Interaktiver Kalkulator */}
      <Section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Investitionsplanung"
            title="Sicherheitsbudget vorab kalkulieren"
            lead="Nutzen Sie unseren interaktiven Kalkulator, um ein erstes Gefühl für die Investitionssumme zu erhalten. Die Berechnung berücksichtigt Objektart, Anzahl der Zugänge sowie die Integration elektronischer Erkennungs- und Meldesysteme."
          />
          <div className="mt-12">
            <SecurityBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Detaillierte Fachinhalte - Architektur & Leistungsklassen */}
      <Section tone="muted" className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Architektur moderner Sicherheitstechnik</h2>
            <p className="mt-6 text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Moderne Sicherheitstechnik ist kein isoliertes Gadget, sondern ein holistisches System. Die Architektur stützt sich auf standardisierte Schnittstellen und Protokolle, die sicherstellen, dass Komponenten verschiedener Hersteller (z. B. eine Kamera von Axis, ein Melder von Telenot und ein Zylinder von BKS) über ein zentrales Management-System (Gefahrenmanagementsystem) oder zumindest über eine smarte Zentraleinheit miteinander kommunizieren können.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Planung erfordert eine präzise Risikoanalyse nach DIN EN 50131 (Einbruchmeldeanlagen). Dabei definieren wir nicht nur die Platzierung von Sensoren, sondern berücksichtigen Umweltbedingungen, Fehlalarmrisiken (z.B. durch Haustiere oder starken Luftzug) und die Bedienfreundlichkeit im Alltag. Ein System, das zu komplex in der Handhabung ist, wird nicht genutzt – und bietet damit keinen Schutz.
            </p>

            <h3 className="mt-10 text-xl font-bold text-[oklch(0.16_0.02_260)]">Zertifizierung und VdS-Klassen</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Für gewerbliche Objekte und Gebäude mit hohen Werten fordern Versicherer häufig Anlagen, die nach VdS-Richtlinien zertifiziert sind. Die VdS-Klassen (A, B, C) definieren den Grad des Widerstands gegen Überwindungsversuche. Während Klasse A für Haushalte mit normaler Gefährdung ausreicht, ist für Juweliere, Waffenhandlungen oder sehr exponierte Privatanwesen mindestens Klasse B oder C erforderlich. Wir projektieren und errichten diese Anlagen nach den strengen Vorgaben und übernehmen die notwendige Dokumentation.
            </p>
          </div>
          <div>
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Leistungsklassen & Matrix</h3>
              <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)] mb-6">Eine Übersicht der empfohlenen Schutzmaßnahmen basierend auf der Objektart.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <th className="py-3 font-semibold text-[oklch(0.16_0.02_260)]">Schutzklasse</th>
                      <th className="py-3 font-semibold text-[oklch(0.16_0.02_260)]">Mechanik</th>
                      <th className="py-3 font-semibold text-[oklch(0.16_0.02_260)]">Elektronik & Meldung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.3)]">
                    <tr>
                      <td className="py-4 text-[oklch(0.32_0.02_260)] font-medium">Wohnung (Etage)</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">Sicherheitsbeschlag, Zylinder mit Bohrschutz, ggf. Querriegel.</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">Lokale Alarmanlage (Smart Home), Tür-/Fensterkontakte.</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-[oklch(0.32_0.02_260)] font-medium">Einfamilienhaus</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">Pilzkopfverriegelungen, RC2/RC3 Türen, Lichtschachtrost-Sicherung.</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">VdS-Home zertifizierte Anlage, Außenhautüberwachung, Video.</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-[oklch(0.32_0.02_260)] font-medium">Gewerbe (Büro)</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">Elektronische Zutrittskontrolle, Motorschlösser, RC3/RC4 Türen.</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">VdS Klasse B Anlage, Aufschaltung auf NSL, flächendeckende Videoüberwachung.</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-[oklch(0.32_0.02_260)] font-medium">Gewerbe (Hochrisiko)</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">Tresore, Hochsicherheitstüren, Durchgreifschutz, Schleusen.</td>
                      <td className="py-4 text-[oklch(0.32_0.02_260)]">VdS Klasse C Anlage, seismische Melder, redundante Alarmwege (IP+LTE).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Sektion (>5 Fragen) */}
      <Section tone="muted" className="py-16 md:py-24 lg:py-32 bg-[oklch(0.968_0.004_260)]">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Häufig gestellte Fragen"
            title="Fachliche Antworten zu Sicherheitssystemen"
            lead="Transparenz ist uns wichtig. Hier finden Sie präzise Antworten auf die drängendsten Fragen rund um Installation, Recht und Technik."
          />

          <div className="mt-12 space-y-6">
            {[
              {
                q: 'Was ist der Unterschied zwischen VdS-zertifizierten und Smart-Home-Alarmanlagen?',
                a: 'VdS-zertifizierte Anlagen entsprechen strengsten Prüfrichtlinien der Versicherer bezüglich Sabotagesicherheit, Ausfallsicherheit (Notstrom) und Frequenzstabilität (bei Funk). Smart-Home-Systeme sind primär auf Komfort ausgelegt, lassen sich leicht per App steuern, bieten aber oft nicht den garantierten Widerstand gegen professionelle Manipulationsversuche (z.B. Jamming). Für hohe Sachwerte oder gewerbliche Objekte ist VdS zwingend.'
              },
              {
                q: 'Benötige ich für eine Videoüberwachung am Einfamilienhaus eine Genehmigung?',
                a: 'Eine behördliche Genehmigung ist privat meist nicht nötig, aber die rechtlichen Grenzen sind eng: Kameras dürfen ausschließlich das eigene Grundstück erfassen. Öffentliche Gehwege, Straßen oder das Nachbargrundstück müssen technisch (z.B. durch Privacy-Masking / Verpixelung) zwingend ausgeblendet werden. Wir stellen die Anlage rechtskonform ein und dokumentieren dies.'
              },
              {
                q: 'Wie funktioniert die Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?',
                a: 'Die Alarmanlage überträgt bei Auslösung ein standardisiertes Protokoll (meist über einen gesicherten IP-Weg mit LTE-Backup) an eine 24/7 besetzte Leitstelle. Dort sitzt geschultes Personal, das gemäß einem vorher definierten Maßnahmenplan agiert (z.B. Rückruf beim Inhaber, Entsendung eines Wachdienstes, direkte Alarmierung der Polizei).'
              },
              {
                q: 'Können Haustiere Fehlalarme auslösen?',
                a: 'Ja, bei unzureichender Planung. Wir setzen jedoch spezielle Bewegungsmelder ein (sog. tierimmune oder Pet-Melder), die anhand von Größe, Masse und Bewegungsmuster unterscheiden können, ob sich eine Katze/ein Hund oder ein Mensch im Raum bewegt. Alternativ setzen wir stärker auf die Außenhautüberwachung (Tür-/Fensterkontakte), die ohnehin haustierresistent ist.'
              },
              {
                q: 'Was passiert mit der Sicherheitstechnik bei einem Stromausfall?',
                a: 'Professionelle Einbruchmeldeanlagen verfügen über leistungsstarke, integrierte Notstromakkus. Diese überbrücken Stromausfälle in der Regel für 12 bis 72 Stunden (abhängig von der Anlagengröße und VdS-Klasse). Sobald die Netzspannung abfällt, sendet die Anlage eine Störungsmeldung, bleibt aber voll funktionsfähig.'
              },
              {
                q: 'Ist eine kabelgebundene Anlage immer besser als eine Funkanlage?',
                a: 'In Neubauten oder bei Sanierungen raten wir immer zu verdrahteten Systemen: Sie sind wartungsärmer (kein Batteriewechsel), extrem störsicher und meist günstiger in den Komponenten. Für Bestandsbauten, wo keine Schlitze geklopft werden sollen, sind moderne, verschlüsselte (Rolling Code) Funkalarmanlagen jedoch eine absolut gleichwertige und hochsichere Alternative.'
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
                <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">{faq.q}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</p>
              </div>
            ))}
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
