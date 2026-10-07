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


      {/* Fachliche Vertiefung und Kalkulator */}
      <Section id="methodik-und-kalkulator">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Architektur & Methodik"
              title="Ganzheitliche Sicherheitskonzepte für höchste Ansprüche"
              lead="Die effektive Absicherung von Objekten erfordert mehr als die bloße Aneinanderreihung von Einzelkomponenten. Es bedarf einer architektonischen Methodik, die Mechanik, Elektronik und Organisation nahtlos verwebt."
            />

            <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              <p>
                Unsere Methodik basiert auf dem Prinzip der konzentrischen Sicherheitsringe. Die physische Peripherie bildet die erste und wichtigste Verteidigungslinie. Hochwertige mechanische Sicherungselemente wie Sicherheitszylinder der VdS-Klassen B und C, einbruchhemmende Türen nach DIN EN 1627 (RC2 bis RC6) sowie zertifizierte Fensterbeschläge leisten den primären Widerstand gegen unbefugtes Eindringen. Sie erzwingen einen signifikanten Zeitverlust beim Angreifer und bilden das unverzichtbare Fundament.
              </p>
              <p>
                Auf diesem mechanischen Grundschutz setzen elektronische Überwachungs- und Meldetechnologien auf. Moderne Einbruchmeldeanlagen (EMA) und Videoüberwachungssysteme dienen der Detektion und Verifikation von Gefahrensituationen in Echtzeit. Wir integrieren intelligente Sensortechnik wie Dual-Melder, die Passiv-Infrarot (PIR) mit Mikrowellentechnologie kombinieren, um Fehlalarme zu minimieren und höchste Detektionssicherheit zu gewährleisten. Zutrittskontrollsysteme mit kryptografisch gesicherten Transpondern (Mifare DESFire EV2/EV3) oder biometrischen Verfahren steuern und protokollieren Bewegungen im Objekt.
              </p>
              <p>
                Die Vernetzung dieser Systeme erfolgt über hochsichere, bus-basierte Protokolle, die gegen Manipulationen von außen gehärtet sind. Durch die Integration in übergeordnete Gefahrenmanagementsysteme entsteht eine einheitliche Bedienoberfläche, die es dem Betreiber ermöglicht, komplexe Szenarien intuitiv zu beherrschen. Wir legen größten Wert auf offene Standards und Schnittstellen (z.B. nach ONVIF für IP-Video), um eine langfristige Investitionssicherheit und Erweiterbarkeit der Anlagen zu garantieren.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mb-6">
                Häufig gestellte Fragen (FAQ) zur Sicherheitstechnik
              </h3>
              <dl className="space-y-6">
                <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.988_0.002_260)]">
                  <dt className="font-bold text-[oklch(0.16_0.02_260)]">1. Wie hoch ist der minimale mechanische Schutzbedarf?</dt>
                  <dd className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Der Mindeststandard für private Haushalte wird polizeilich mit der Widerstandsklasse RC2 (Resistance Class 2) nach DIN EN 1627 definiert. Dies beinhaltet einbruchhemmende Fensterbeschläge (z.B. Pilzkopfzapfenverriegelung) und Türen, die Gelegenheitstätern mit einfachen Werkzeugen mindestens 3 Minuten standhalten. Im gewerblichen Bereich oder bei erhöhtem Risiko (z.B. Juweliere, Apotheken) projektieren wir Systeme der Klassen RC3 bis RC6, kombiniert mit VdS-zertifizierter Alarmtechnik.
                  </dd>
                </div>

                <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.988_0.002_260)]">
                  <dt className="font-bold text-[oklch(0.16_0.02_260)]">2. Kann ich Videoüberwachung und Alarmanlage verknüpfen?</dt>
                  <dd className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Ja, dies ist die effektivste Form der Gefahrenverifikation. Wenn ein Sensor (z.B. ein Tür-Kontakt oder ein Bewegungsmelder) auslöst, steuert das System die zugehörige Kamera an. Diese übermittelt sofort eine Videosequenz an das Smartphone des Betreibers oder eine angeschlossene Notruf- und Serviceleitstelle (NSL). So kann umgehend unterschieden werden, ob es sich um einen Echtalarm durch Einbrecher oder einen Falschalarm durch Tiere oder Umwelteinflüsse handelt.
                  </dd>
                </div>

                <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.988_0.002_260)]">
                  <dt className="font-bold text-[oklch(0.16_0.02_260)]">3. Sind elektronische Schließanlagen sicher gegen Hacking?</dt>
                  <dd className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Moderne elektronische Zutrittslösungen arbeiten mit hochsicheren Verschlüsselungsverfahren (AES 128-Bit oder höher) und verwenden Challenge-Response-Authentifizierungen. Es werden keine unverschlüsselten Daten übertragen. Im Gegensatz zu mechanischen Schlüsseln können verlorene Medien (Transponder, Karten) zudem in Sekundenbruchteilen aus dem System gelöscht werden, ohne dass Zylinder ausgetauscht werden müssen. Dies bietet langfristig einen erheblichen Sicherheits- und Kostenvorteil.
                  </dd>
                </div>

                <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.988_0.002_260)]">
                  <dt className="font-bold text-[oklch(0.16_0.02_260)]">4. Was ist bei Stromausfall oder Netzwerksabotage?</dt>
                  <dd className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Professionelle Sicherheitssysteme verfügen über redundante Notstromversorgungen (Akkumulatoren), die den Betrieb bei Netzausfall für mehrere Stunden bis Tage aufrechterhalten. Die Kommunikationstechnik nutzt oft parallele Übertragungswege (Dual-Path), z.B. IP/Ethernet und ein redundantes Mobilfunkmodul (LTE/5G). Wird die kabelgebundene Verbindung sabotiert, schaltet die Anlage automatisch um und meldet die Störung an die Leitstelle. Elektronische Zylinder arbeiten autark mit Batterien.
                  </dd>
                </div>

                <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.988_0.002_260)]">
                  <dt className="font-bold text-[oklch(0.16_0.02_260)]">5. Benötige ich Wartungsverträge für diese Anlagen?</dt>
                  <dd className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Eine regelmäßige Wartung ist essenziell für die Zuverlässigkeit und Langlebigkeit der Systeme. Batterien in Funkmeldern müssen getauscht, Software-Updates eingespielt (Cybersecurity) und die mechanische Gängigkeit geprüft werden. Bei gewerblichen Anlagen oder VdS-zertifizierten Systemen fordern Versicherer häufig einen jährlichen Wartungsnachweis durch einen anerkannten Fachbetrieb. Wir bieten skalierbare Service-Level-Agreements (SLA) an, die genau auf Ihr Risikoprofil abgestimmt sind.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 motion-reduce:transition-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)]">
            <ServiceBudgetCalculator />
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
