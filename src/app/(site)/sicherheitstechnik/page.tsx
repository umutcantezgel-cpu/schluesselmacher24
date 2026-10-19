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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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

export default async function SicherheitstechnikPage() {
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


      {/* Fachliche Erweiterung & Interaktives Modul */}
      <Section id="umfassender-einbruchschutz" tight className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">

          <div className="space-y-8">
            <SectionHeading
              eyebrow="Tiefgreifende Sicherheit"
              title="Modernster Einbruchschutz und smarte Überwachungssysteme"
              lead="In einer zunehmend komplexen Welt reicht einfache Mechanik oft nicht mehr aus. Ein ganzheitliches Sicherheitskonzept kombiniert physische Barrieren mit intelligenter Sensorik und proaktiver Alarmierung."
            />

            <div className="prose prose-sm text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
              <p>
                Die Architektur moderner Sicherheitssysteme basiert auf dem Prinzip der konzentrischen Ringe. Der äußere Ring (Perimeterschutz) schreckt ab und meldet Annäherungen. Der mittlere Ring (Gebäudehülle) leistet massiven physischen Widerstand durch einbruchhemmende Türen, Fenster und Sicherheitsbeschläge. Der innere Ring (Raumüberwachung) detektiert Bewegungen und sichert sensible Bereiche wie Serverräume oder Wertgelasse.
              </p>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Mechanische Grundsicherung: Das Fundament</h3>
              <p>
                Ohne eine solide Mechanik ist jede elektronische Anlage wertlos. Wir setzen auf Hochsicherheitszylinder mit Kopierschutz, Kernziehschutzbeschläge und massive Mehrfachverriegelungen. Diese Komponenten verlängern die Zeit, die ein Täter zum Eindringen benötigt, signifikant. Die sogenannte &quot;Widerstandszeit&quot; ist die kritischste Metrik im Einbruchschutz.
              </p>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Elektronische Detektion und Alarmierung</h3>
              <p>
                Moderne Gefahrenmeldeanlagen (GMA) arbeiten mit einer Vielzahl von Sensoren: Glasbruchmelder, Magnetkontakte an Türen und Fenstern, sowie Dual-Bewegungsmelder (Infrarot und Mikrowelle), die Fehlalarme minimieren. Im Ernstfall wird nicht nur eine lokale Sirene aktiviert, sondern über verschlüsselte IP/GSM-Pfade eine Notruf- und Serviceleitstelle (NSL) informiert, die sofortige Interventionsmaßnahmen einleitet.
              </p>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Intelligente Videoüberwachung (CCTV)</h3>
              <p>
                Kamerasysteme dienen heute nicht mehr nur der Aufzeichnung nach einem Vorfall. Durch den Einsatz von KI-basierter Videoanalytik können Personen von Tieren oder Fahrzeugen unterschieden werden. Virtuelle Stolperdrähte (&quot;Tripwires&quot;) lösen Alarme aus, bevor der Täter überhaupt das Gebäude erreicht. Wir integrieren hochauflösende IP-Kameras mit Starlight-Technologie für farbige Bilder auch bei minimaler Resthelligkeit.
              </p>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Häufig gestellte Fragen (FAQ)</h3>
              <dl className="space-y-4">
                <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                  <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie oft muss eine Alarmanlage gewartet werden?</dt>
                  <dd className="mt-2">Nach DIN VDE 0833 ist eine jährliche Wartung durch eine Fachfirma vorgeschrieben, bei gewerblichen Anlagen oft vierteljährlich, um die volle Funktionalität der Sensoren und Akkus zu gewährleisten.</dd>
                </div>
                <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                  <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Können Haustiere Fehlalarme auslösen?</dt>
                  <dd className="mt-2">Wir verwenden spezielle &quot;Pet-immune&quot; Bewegungsmelder, die Tiere bis zu einer bestimmten Größe und Gewichtsklasse (z.B. bis 30kg) ignorieren, aber auf menschliche Bewegungsmuster reagieren.</dd>
                </div>
                <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                  <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Ist eine Videoüberwachung rechtlich immer erlaubt?</dt>
                  <dd className="mt-2">Nein. Es gilt der Grundsatz der Verhältnismäßigkeit und die DSGVO. Öffentlicher Grund (Gehwege, Straßen) und Nachbargrundstücke dürfen nicht erfasst werden. Entsprechende Bereiche müssen in der Software der Kamera &quot;maskiert&quot; (geschwärzt) werden.</dd>
                </div>
                <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                  <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Was bedeutet &quot;Aufschaltung&quot;?</dt>
                  <dd className="mt-2">Die Aufschaltung bezeichnet die permanente Kommunikationsverbindung zwischen Ihrer Einbruchmeldeanlage und einer 24/7 besetzten Notruf- und Serviceleitstelle (NSL), die im Alarmfall sofort reagiert.</dd>
                </div>
                <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                  <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Gibt es Förderungen für Einbruchschutz?</dt>
                  <dd className="mt-2">Ja, die KfW-Bank fördert einbruchhemmende Maßnahmen (Zuschuss 455-E). Wichtig ist, dass der Antrag vor Beginn der Maßnahmen gestellt wird und die Ausführung durch einen Fachbetrieb erfolgt.</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="sticky top-24">
            <ServiceBudgetCalculator />
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
