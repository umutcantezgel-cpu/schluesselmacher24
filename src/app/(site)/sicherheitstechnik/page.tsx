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
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';

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
  zutrittskontrolle: Lock,
  smart_home_sicherheit: Smartphone,
  gebaeudeleittechnik: Layers,
  panik_und_alarmtaster: BellRing,
};

const process = PROCESS_LABELS['gefuehrte-anfrage'];

/**
 * Einordnung / Leitgedanke der Sicherheitstechnik.
 * Mechanik hält auf, Melder erkennen, Alarm informiert.
 */
const PRINCIPLE = [
  {
    term: 'Mechanischer Grundschutz',
    body: 'Die erste Verteidigungslinie. Ohne massive Widerstandskräfte wie Sicherheitszylinder, Schließbleche mit Mauerankern und gehärtete Beschläge bringt die beste Elektronik nichts. Mechanik zwingt den Täter zum Werkzeugeinsatz, kostet ihn Zeit und erzeugt Lärm.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Tür- und Schließtechnik',
  },
  {
    term: 'Elektronische Meldetechnik',
    body: 'Die Nervenzentren der Absicherung. Sensoren wie Glasbruchmelder, Bewegungsmelder und Öffnungskontakte erkennen den Versuch eines Eindringens in dem Moment, in dem die Mechanik belastet wird. Sie übergeben das Signal ohne Verzögerung an die Zentrale.',
    href: `/${ROUTE}/alarmtechnik`,
    linkLabel: 'Zur Alarmtechnik',
  },
  {
    term: 'Alarmierung & Intervention',
    body: 'Ein erkannter Einbruchsversuch muss zwingend Folgen haben. Lokale Sirenen dienen der Täterabschreckung. Die stille Alarmierung über redundante Übertragungswege (IP/Mobilfunk) an eine Notruf- und Serviceleitstelle (NSL) stellt die Intervention sicher.',
    href: `/${ROUTE}/panik-und-alarmtaster`,
    linkLabel: 'Zu Panik- und Alarmtastern',
  },
];

export default async function SicherheitstechnikPage(props: { params: Promise<Record<string, unknown>>, searchParams: Promise<Record<string, unknown>> }) {
  const resolvedParams = await props.params;
  const resolvedSearch = await props.searchParams;
  void resolvedParams;
  void resolvedSearch;

  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.seo.title ?? 'Sicherheitstechnik',
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

      {/* Fachlicher Tiefgang & FAQ */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight">Architektonische Methodik & Sicherheitskonzepte</h2>
          <div className="mt-6 text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
            <p>
              Ein ganzheitliches Sicherheitskonzept basiert auf der systematischen Analyse potenzieller Bedrohungen und Schwachstellen eines Objekts. Wir betrachten Sicherheit nicht als Ansammlung einzelner Komponenten, sondern als orchestriertes System, in dem Mechanik, Elektronik und Organisation nahtlos ineinandergreifen. Dieser Schalenaufbau stellt sicher, dass selbst bei Überwindung einer Barriere weitere Schutzmechanismen greifen. Die Integration moderner Sensorik in Kombination mit massiven physischen Widerständen bietet hierbei den bestmöglichen Schutz vor Einbruch, Vandalismus und unbefugtem Zutritt.
            </p>
            <p>
              Die Planung beginnt mit der Perimeterabsicherung, welche die Grundstücksgrenze definiert. Darauf folgt die Außenhautabsicherung, die Fassaden, Fenster und Türen umfasst. Im Inneren des Gebäudes sorgt die Raum- und Objektüberwachung für die finale Detektion. Jeder dieser Ringe erfordert spezifische Technologien – von der Lichtschranke über den Dual-Bewegungsmelder bis hin zur hochauflösenden Videoanalyse mit künstlicher Intelligenz. Unsere Expertise liegt darin, diese Systeme exakt auf das individuelle Gefährdungspotenzial und die Nutzungsgewohnheiten abzustimmen, ohne den täglichen Ablauf unnötig zu erschweren.
            </p>
            <p>
              Besonderes Augenmerk legen wir auf die Redundanz der Systeme. Stromausfälle, Sabotageversuche oder Netzwerkstörungen dürfen die Funktionstüchtigkeit der Anlage nicht beeinträchtigen. Notstromakkus, Sabotagekontakte in den Gehäusen und duale Übertragungswege zur Leitstelle garantieren eine lückenlose Alarmierungskette. Gleichzeitig müssen die Systeme normgerecht installiert werden, um sowohl den Anforderungen von Versicherern (VdS) als auch den Vorgaben des Datenschutzes (DSGVO) zu entsprechen. Eine transparente Dokumentation und eine saubere Übergabe sind für uns selbstverständlich.
            </p>
            <p>
              Die Konvergenz von Sicherheitstechnik und Gebäudeautomation eröffnet zudem neue Möglichkeiten. Ein Alarmfall kann beispielsweise nicht nur die Sirene auslösen, sondern zeitgleich die Beleuchtung im gesamten Gebäude aktivieren und Rollos hochfahren, um maximale Sichtbarkeit zu schaffen und den Täter zu desorientieren. Ebenso lassen sich Zutrittskontrollsysteme mit der Zeiterfassung und der Klimasteuerung koppeln. Solche intelligenten Vernetzungen erhöhen nicht nur das Sicherheitsniveau, sondern tragen auch maßgeblich zur Energieeffizienz und zum Komfort bei.
            </p>
            <p>
              Wartung und Instandhaltung sind essenziell für die Langlebigkeit und Zuverlässigkeit der installierten Anlagen. Elektronische Bauteile altern, Batterien verlieren an Kapazität und Software benötigt Updates, um gegen neue Cyberbedrohungen gewappnet zu sein. Daher bieten wir maßgeschneiderte Serviceverträge an, die regelmäßige Inspektionen, Fernwartung und einen 24/7-Notdienst umfassen. So stellen wir sicher, dass Ihre Investition in die Sicherheit auch über Jahre hinweg den gewünschten Schutz bietet und im Ernstfall fehlerfrei funktioniert.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">Häufig gestellte Fragen (FAQ)</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Welche Sicherheitsstufe ist für mein Objekt angemessen?</h4>
                <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                  Die angemessene Sicherheitsstufe (z.B. VdS-Klassen A, B oder C) richtet sich nach dem individuellen Gefährdungspotenzial, den Werten im Objekt und den Anforderungen der Versicherung. Eine präzise Risikoanalyse vor Ort bildet die Grundlage für unsere Empfehlung.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Lassen sich bestehende mechanische Sicherungen in ein neues elektronisches System integrieren?</h4>
                <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                  Ja, in den meisten Fällen können vorhandene, hochwertige mechanische Komponenten (wie Schließzylinder oder Mehrfachverriegelungen) durch mechatronische Elemente oder Sensoren ergänzt und in ein übergeordnetes elektronisches Sicherheitssystem eingebunden werden.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Wie sicher sind funkbasierte Alarmanlagen gegen Manipulation?</h4>
                <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                  Moderne, zertifizierte Funk-Alarmanlagen nutzen bidirektionale Kommunikation und rotierende Verschlüsselungscodes. Zudem überwachen sie permanent das Frequenzband (Anti-Jamming). Bei Störversuchen wird sofort ein Alarm ausgelöst, was sie extrem sicher macht.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Wer hat Zugriff auf die Aufzeichnungen der Videoüberwachung?</h4>
                <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                  Der Zugriff wird durch strikte Rollen- und Rechtekonzepte gesteuert. Nur autorisierte Personen mit persönlichen Zugangsdaten können das Material sichten. Alle Zugriffe werden revisionssicher protokolliert, um den Vorgaben des Datenschutzes zu entsprechen.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Was passiert bei einem Stromausfall im Gebäude?</h4>
                <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                  Professionelle Sicherheitssysteme verfügen über integrierte Notstromakkus, die den Betrieb der Anlage bei einem Stromausfall für mehrere Stunden bis zu Tagen (je nach Auslegung und Norm) lückenlos aufrechterhalten. Auch die Übertragungsmittel bleiben aktiv.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Calculator */}
      <Section tone="muted">
        <div className="mx-auto max-w-2xl w-full" style={{ viewTransitionName: 'security-calculator-transition' }}>
            <SecurityBudgetCalculator />
        </div>
      </Section>

      {/* Bereiche */}
      <Section>
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
