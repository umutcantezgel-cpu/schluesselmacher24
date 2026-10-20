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
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
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

            {/* Tiefgehende methodische Sektion */}
      <Section id="architektur-methodik" tone="muted">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Ganzheitliche Sicherheitskonzepte statt Insellösungen"
          lead="Moderne Sicherheitstechnik basiert auf dem Ineinandergreifen verschiedener Gewerke. Unsere Methodik verbindet mechanischen Grundschutz mit elektronischer Früherkennung und intelligenter Alarmierung zu einem kohärenten System."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-4">Mechanische Prävention</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die Basis jedes Sicherheitskonzepts ist die mechanische Widerstandsfähigkeit. Wir analysieren Schwachstellen an Türen, Fenstern und Lichtschächten. Hochwertige Schließzylinder, Mehrfachverriegelungen und Schutzbeschläge erhöhen den Zeitaufwand für Täter signifikant. In der Praxis zeigt sich: Bricht ein Täter nicht innerhalb weniger Minuten ein, bricht er den Versuch meist ab.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-4">Perimeterschutz & Früherkennung</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Noch bevor ein mechanischer Angriff stattfindet, detektiert die Außenhautsicherung unbefugtes Annähern. Moderne Videoanalyse unterscheidet zuverlässig zwischen Tieren, Witterungseinflüssen und Personen. Durch virtuelle Zäune (Line Crossing) und Bereichsüberwachung generieren wir Vorwarnzeiten, die Interventionen ermöglichen, bevor ein Schaden am Objekt entsteht.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-4">Intervention & Alarmierung</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die intelligente Vernetzung von Einbruchmeldeanlagen (EMA) mit der Videoüberwachung ermöglicht eine sofortige Verifikation durch Notruf- und Serviceleitstellen (NSL). Falschalarme werden minimiert, während echte Gefahren sofort zu polizeilicher oder privater Intervention führen. Die Alarmierung erfolgt redundant über verschiedene Übertragungswege.
            </p>
          </div>
        </div>
      </Section>

      {/* Calculator Section */}
      <Section id="kalkulator" tight>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Transparenz"
              title="Planen Sie Ihr Sicherheitsbudget"
              lead="Nutzen Sie unseren interaktiven Kalkulator für eine erste grobe Einschätzung der Investitionskosten basierend auf der Anzahl der zu sichernden Bereiche und dem geschätzten Installationsaufwand."
            />
            <div className="mt-6 space-y-4">
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Diese Kalkulation dient als erster Richtwert. Die tatsächlichen Kosten hängen stark von den spezifischen baulichen Gegebenheiten, der gewünschten Sicherheitsklasse (z.B. nach DIN EN 50131) und der Komplexität der Vernetzung ab.
              </p>
              <ul className="list-disc pl-5 text-[oklch(0.32_0.02_260)] space-y-2">
                <li>Berücksichtigt Basis-Hardware für die ausgewählten Bereiche</li>
                <li>Beinhaltet geschätzte Arbeitszeit für Installation und Inbetriebnahme</li>
                <li>Konfigurations- und Einweisungsaufwand inklusive</li>
              </ul>
            </div>
          </div>
          <div>
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Wissensdatenbank"
          title="Häufige Fragen zur Sicherheitstechnik"
          lead="Fundierte Antworten auf die wichtigsten Fragen bei der Planung von Sicherheitskonzepten für Gewerbe und Privat."
        />

        <div className="mt-10 space-y-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">Kabelgebunden oder Funk – was ist sicherer?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Kabelgebundene Systeme (Bus-Systeme) bieten die höchste Ausfallsicherheit und sind immun gegen Jamming (Störsender). Bei Neubauten oder Kernsanierungen sind sie die erste Wahl. Moderne Funk-Alarmanlagen nutzen jedoch dedizierte Frequenzen und wechselnde Kanäle, wodurch sie ein sehr hohes Sicherheitsniveau erreichen. Sie eignen sich besonders zur Nachrüstung in Bestandsgebäuden, wo eine unsichtbare Kabelverlegung unverhältnismäßig aufwändig wäre.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet Aufschaltung auf eine Notrufleitstelle (NSL)?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Bei einer Aufschaltung werden Alarmmeldungen (Einbruch, Überfall, Feuer, Sabotage) digital an eine 24/7 besetzte, zertifizierte Notruf- und Serviceleitstelle übertragen. Das geschulte Personal dort bewertet die Meldung (oft mittels Video-Vorprüfung zur Vermeidung von Falschalarmen) und leitet den vorher definierten Interventionsplan ein – z.B. die Alarmierung der Polizei, des Sicherheitsdienstes oder des Eigentümers.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">Sind Videoüberwachungssysteme im Außenbereich datenschutzkonform?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Ja, wenn sie richtig geplant sind. Die Kameras dürfen ausschließlich das eigene Grundstück erfassen. Öffentlicher Raum (Bürgersteige, Straßen) oder Nachbargrundstücke müssen zwingend mittels Privacy-Masking (Schwarzschaltung spezifischer Bildbereiche) in der Kamera ausgeblendet werden. Zudem muss auf die Überwachung hingewiesen werden (z.B. durch Piktogramme) und die Speicherdauer der Aufzeichnungen ist auf das absolut notwendige Minimum (oft 48-72 Stunden) zu begrenzen.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">Wie oft muss Sicherheitstechnik gewartet werden?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Für Gewerbeobjekte und Anlagen, die polizeilich oder bei Versicherungen anerkannt sind, ist eine jährliche Wartung durch einen Fachbetrieb vorgeschrieben (gemäß VdS/DIN VDE 0833). Bei reinen Privatobjekten empfehlen wir ebenfalls einen jährlichen Turnus, um die Funktion der Akkus/Batterien, der Melder und der Übertragungswege sicherzustellen. Mechanische Komponenten sollten regelmäßig geschmiert und auf Schließzwang geprüft werden.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">Was ist der Unterschied zwischen Außenhaut- und Fallenüberwachung?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Außenhautüberwachung sichert die Gebäudehülle (Türen, Fenster) durch Öffnungs- und Glasbruchmelder. Der Alarm wird ausgelöst, *bevor* oder *während* der Täter eindringt. Die Fallenüberwachung nutzt Bewegungsmelder im Gebäudeinneren und löst aus, wenn der Täter bereits im Objekt ist. Ein gutes Konzept kombiniert beide Ansätze: Die Außenhautüberwachung ermöglicht es, die Anlage auch bei Anwesenheit im Gebäude (z.B. nachts) scharfzuschalten, während die Fallenüberwachung als zweite Linie dient.
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
    </main>
  );
}
