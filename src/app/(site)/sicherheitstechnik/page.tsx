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

export default async function SicherheitstechnikPage({
  params,
  searchParams,
}: {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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


      {/* Interactive Budget Calculator */}
      <Section id="budget-calculator" tight>
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Kalkulation"
            title="Transparente Kostenplanung für Ihre Sicherheit"
            lead="Planen Sie Ihr Budget für mechanische und elektronische Absicherungen vorab. Der Rechner gibt Ihnen eine erste Orientierung basierend auf unserer langjährigen Erfahrung."
          />
          <div className="mt-8">
            <SecurityBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Tiefgreifende Fachkompetenz und Methodik */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Ganzheitliche Sicherheitsarchitektur auf Enterprise-Niveau"
          lead="Wir betrachten Sicherheit nicht als isoliertes Produkt, sondern als durchdachtes System ineinandergreifender Ebenen, die sich nahtlos in Ihre Prozesse integrieren."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Das Zwiebelschalenprinzip moderner Objektsicherheit</h3>
            <p>
              Moderne Sicherheitstechnik basiert auf dem Zwiebelschalenprinzip, das mehrere Verteidigungslinien (Perimeter, Gebäudehülle, Innenraum, Wertschutz) aufbaut. Dieses mehrstufige Konzept stellt sicher, dass selbst bei Überwindung einer Barriere das Gesamtsystem weiterhin Schutz bietet und ausreichend Reaktionszeit für Interventionskräfte schafft.
            </p>
            <p>
              Die erste Linie bildet der <strong>Perimeterschutz</strong>, der bereits das Grundstück absichert. Hier kommen hochauflösende Videoüberwachungssysteme mit intelligenter Videoanalytik (IVA) zum Einsatz, die zwischen relevanten Bedrohungen und Störgrößen (wie Tieren oder Witterung) unterscheiden können. Flankiert wird dies durch mechanische Barrieren und Zutrittskontrollsysteme an den Außengrenzen.
            </p>
            <p>
              Die <strong>Gebäudehülle</strong> als zweite Schicht fokussiert sich auf die mechanische Widerstandsfähigkeit von Türen, Fenstern und Toren. Hier setzen wir auf zertifizierte Sicherheitselemente nach DIN EN 1627 (Resistance Class - RC), kombiniert mit mechatronischen Schließkomponenten und elektronischer Verschlussüberwachung. Eine Alarmanlage (Einbruchmeldeanlage - EMA) detektiert Einbruchsversuche an der Hülle, bevor diese physisch durchdrungen wird.
            </p>
          </div>

          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Integration von Mechanik und Mechatronik</h3>
            <p>
              Ein häufiger Fehler in der Sicherheitsplanung ist die Trennung von Mechanik und Elektronik. Wir konzipieren Systeme, bei denen elektronische Zylinder und smarte Türdrücker nahtlos mit der Alarmtechnik kommunizieren. Eine Zwangsläufigkeit stellt dabei sicher, dass ein Gebäude nur bei unscharf geschalteter Alarmanlage betreten werden kann, was Falschalarme (sogenannte Falschalarme durch Betreiberfehler) drastisch reduziert.
            </p>
            <p>
              Zudem integrieren wir moderne <strong>Zutrittskontrollsysteme (ZKS)</strong>, die nicht nur den physischen Zugang regulieren, sondern auch Raumzonenkonzepte abbilden. Biometrische Merkmale, RFID-Transponder oder mobile Credentials via Smartphone (BLE/NFC) bieten skalierbare Lösungen für Unternehmen jeder Größe. Die nahtlose Protokollierung erfüllt dabei stets die strengsten Anforderungen des Datenschutzes (DSGVO) und der betrieblichen Mitbestimmung.
            </p>
             <p>
              Die <strong>Gefahrenmanagement-Ebene</strong> führt schließlich alle Subsysteme – Video, Alarm, Zutritt und Brandschutz – in einer zentralen Benutzeroberfläche zusammen. Dies ermöglicht dem Sicherheitspersonal oder der externen Notruf- und Serviceleitstelle (NSL) eine sofortige Lagebeurteilung und zielgerichtete Intervention im Ereignisfall.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-[oklch(0.988_0.002_260)] rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] p-8 lg:p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-[oklch(0.16_0.02_260)] mb-8">Häufig gestellte Fragen (FAQ) zur Sicherheitstechnik</h3>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie lange dauert die Installation einer modernen Alarmanlage?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Dank moderner Funktechnologie (z.B. nach EN 50131 Grad 2) können wir drahtlose Alarmsysteme in Wohngebäuden oder kleinen Gewerbeobjekten oft innerhalb eines Tages staub- und schmutzfrei installieren. Bei verdrahteten Systemen oder komplexen Gebäudeleittechnik-Integrationen in großen Objekten planen wir in der Regel mehrere Tage ein. Der genaue Zeitplan wird nach der detaillierten Bestandsaufnahme festgelegt.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Ist eine Aufschaltung auf einen Sicherheitsdienst zwingend erforderlich?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Sie ist nicht zwingend, wird aber von uns dringend empfohlen. Eine lokale Alarmierung (Sirene) schreckt zwar ab, garantiert aber keine professionelle Reaktion. Die Aufschaltung auf eine VdS-anerkannte Notruf- und Serviceleitstelle (NSL) stellt sicher, dass Alarme 24/7 von geschultem Personal bewertet und entsprechende Interventionsmaßnahmen (Wachdienst, Polizei) nach einem fest definierten Maßnahmeplan eingeleitet werden.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie verhält es sich mit dem Datenschutz bei Videoüberwachungssystemen?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Der Einsatz von Videotechnik unterliegt strengen DSGVO-Auflagen. Öffentliche Bereiche (wie Gehwege) oder Nachbargrundstücke dürfen nicht erfasst werden (sogenanntes &quot;Schwärzen&quot; oder &quot;Privacy Masking&quot;). Wir beraten Sie nicht nur technisch, sondern implementieren Systeme, die durch automatische Löschroutinen nach x Stunden und strikte rollenbasierte Zugriffskontrollen den datenschutzrechtlichen Anforderungen technisch (Privacy by Design) gerecht werden.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Resistance Class (RC) wird für mein Gebäude empfohlen?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Für Privathaushalte empfiehlt die Kriminalpolizei mindestens Fenster und Türen der Widerstandsklasse RC 2 (besser RC 3). Diese leisten Gelegenheitstätern, die einfache Werkzeuge verwenden, ausreichend lange Widerstand (mindestens 3 bzw. 5 Minuten). Im gewerblichen Bereich mit hohen Werten oder kritischer Infrastruktur planen wir je nach Risikobewertung mit RC 4 bis RC 6 Elementen, die auch massiven Angriffen mit Elektrowerkzeugen standhalten.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Kann ich mein Smartphone als digitalen Schlüssel nutzen?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Ja, moderne mechatronische Schließanlagen und Zutrittskontrollsysteme ermöglichen die sichere Authentifizierung via Smartphone (Mobile Credentials) über Bluetooth Low Energy (BLE) oder NFC. Diese Lösung bietet enormen Komfort und Flexibilität, da Berechtigungen aus der Ferne vergeben und entzogen werden können (&quot;Over the Air&quot;). Die Kommunikation ist durch starke asymmetrische Verschlüsselungsverfahren abgesichert.
              </p>
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
