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

export interface Props {
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


      {/* Fachlicher Tiefgang & FAQ (Expanded Content > 800 W.) */}
      <Section id="architektur-methodik" tone="muted">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Die ganzheitliche Planung von Sicherheitssystemen"
          lead="Eine effektive Sicherheitsarchitektur ist niemals ein Zufallsprodukt. Sie entsteht aus der methodischen Analyse von Schwachstellen, Täterprofilen und der spezifischen Nutzung eines Objektes."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed text-[16px]">
            <p>
              Die Basis jeder robusten Sicherheitstechnik ist die physische Mechanik. Ohne mechanischen Widerstand wird elektronische Meldetechnik zu einer reinen Dokumentationsmaßnahme. Wenn ein Täter in wenigen Sekunden durch eine unzureichend gesicherte Tür eindringen kann, ist der Zeitvorsprung der Alarmierung meist wertlos. Daher beginnen wir jede Konzeption mit der Analyse der Gebäudehülle.
            </p>
            <p>
              Moderne Schließanlagen, Hochsicherheitszylinder und zertifizierte Beschläge (wie Profilzylinder nach DIN EN 1303 mit Bohr- und Ziehschutz) bilden die erste Barriere. Die mechanische Sicherheit hat dabei nur ein Ziel: den Einbruchsversuch so lange zu verzögern und den Aufwand (sowie den Lärmpegel) für den Täter so massiv zu erhöhen, dass er sein Vorhaben abbricht. Fachsprachlich spricht man hier vom &quot;Verzögerungswert&quot;.
            </p>
            <p>
              Erst auf diesem Fundament entfaltet die elektronische Sicherheitstechnik ihr volles Potenzial. Die Alarmtechnik – bestehend aus Öffnungsmeldern, Glasbruchsensoren, Bewegungsmeldern und komplexer Sensorik – bildet das nervöse System des Gebäudes. Sie reagiert präzise auf den Versuch der Überwindung der mechanischen Barrieren. Die Verschaltung dieser Sensoren muss intelligent erfolgen, um Falschalarme (z.B. durch Haustiere oder Zugluft) zu eliminieren, während gleichzeitig eine 100%ige Detektionswahrscheinlichkeit bei echten Einbruchsversuchen garantiert bleibt.
            </p>
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Wartung & Lebenszyklus</h3>
            <p>
              Eine oft unterschätzte Komponente ist der Lebenszyklus der Anlage. Sicherheitssysteme müssen 24/7 unterbrechungsfrei funktionieren. Dies erfordert regelmäßige Wartungsintervalle zur Prüfung von Akku-Zuständen in funkbasierten Systemen, Software-Updates zum Schließen von Cyber-Sicherheitslücken in vernetzten Alarmanlagen und die Re-Kalibrierung von Kamerasensorik.
            </p>
            <p>
              Im Durchschnitt planen wir bei elektronischen Systemen mit einem Lebenszyklus von 7 bis 10 Jahren, während hochwertige mechanische Komponenten bei entsprechender Pflege (Graphitöl für Zylinder, Nachjustierung von Türbändern) oft Jahrzehnte ihren Dienst verrichten. Diese Investitionsplanung machen wir für unsere Kunden transparent.
            </p>
          </div>

          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed text-[16px]">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mb-4">Mechanik vs. Elektronik (Tiefgang)</h3>
            <p>
              Oft werden wir gefragt: &quot;Reicht nicht eine Alarmanlage?&quot;. Die fachliche Antwort lautet stets &quot;Nein&quot;. Die Alarmanlage (Einbruchmeldeanlage, EMA) verhindert keinen Einbruch, sie meldet ihn nur. Es ist das Zusammenspiel, die sogenannte &quot;Detektion und Verzögerung&quot;, die das Risiko minimiert.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 mb-8">
              <li><strong>Mechanik:</strong> Physischer Widerstand, Verriegelungen, Pilzkopfzapfen in Fenstern. Ziel: Zeitgewinn.</li>
              <li><strong>Meldetechnik:</strong> Sensoren (Magnetkontakte, Körperschallmelder). Ziel: Früheste Erkennung vor dem eigentlichen Eindringen.</li>
              <li><strong>Alarmierung:</strong> Örtliche Signalgeber (Sirenen), Fernübertragung zur Leitstelle (Wachdienst). Ziel: Intervention.</li>
              <li><strong>Videoüberwachung:</strong> Visuelle Verifikation. Ziel: Täteridentifikation und Beweissicherung.</li>
            </ul>

            <p>
              Ein Beispiel aus der Praxis: Eine Terrassentür mit Standardbeschlägen lässt sich mit einem einfachen Schraubendreher in 10-15 Sekunden aufhebeln. Rüstet man hier Pilzkopfzapfenverriegelungen (nach DIN 18104-2) nach, steigt der Zeitaufwand für den Täter auf mehrere Minuten und erfordert schweres Werkzeug. Kombiniert man dies nun mit einem Erschütterungssensor, der auf die Hebelversuche reagiert, schlägt das System Alarm, *bevor* die Mechanik nachgibt. Der Täter flieht, der Einbruchsversuch scheitert.
            </p>

            <div className="mt-12">
               <ServiceBudgetCalculator />
            </div>
          </div>
        </div>
      </Section>

      {/* Detaillierter FAQ-Bereich */}
      <Section id="faq">
        <SectionHeading
          eyebrow="Häufige Fragen (FAQ)"
          title="Klarheit für Ihre Sicherheit"
          lead="Antworten auf die wichtigsten Fragen zur Konzeption, Installation und rechtlichen Aspekten von Sicherheitstechnik."
        />

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">1. Wie schnell sind Sie im Falle eines technischen Defekts vor Ort?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Für unsere Bestandskunden mit Wartungsvertrag garantieren wir eine Reaktionszeit von unter 4 Stunden, 24/7, an 365 Tagen im Jahr. Für Neukunden bemühen wir uns um schnellstmögliche Hilfe, oft noch am selben Tag.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">2. Ist eine Videoüberwachung auf meinem Privatgrundstück erlaubt?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Ja, jedoch nur, wenn die Kameras ausschließlich Ihr eigenes Grundstück erfassen. Öffentliche Wege, Straßen oder das Nachbargrundstück (selbst teilweise) dürfen nicht im Erfassungsbereich liegen. Moderne IP-Kameras erlauben das Schwärzen sensibler Bereiche (Privacy Masking) direkt in der Software.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">3. Welche Kosten kommen bei einer Alarmanlage auf mich zu?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Die Kosten variieren stark nach Objektgröße und Sicherheitsstufe. Eine professionelle, drahtlose Basisabsicherung für eine Wohnung beginnt meist bei ca. 1.500 bis 2.500 Euro. Nutzen Sie gerne unseren Budget-Kalkulator weiter oben für eine erste grobe Einschätzung.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">4. Funktioniert das Sicherheitssystem auch bei Stromausfall?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Ja. Professionelle Einbruchmeldeanlagen (EMA) verfügen über Notstromakkus, die das System je nach Konfiguration für 12 bis 72 Stunden aufrechterhalten. Auch die Alarmübertragung (z.B. via Mobilfunk/GSM-Modul) funktioniert autonom vom Hausstrom und Internet.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">5. Kabelgebunden oder Funk-Alarmanlage - was ist besser?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Beide Systeme bieten höchste Sicherheit. Kabelgebundene Systeme sind in der Hardware oft günstiger und wartungsärmer (kein Batteriewechsel), jedoch ist die Installation im Altbau sehr aufwendig. Funksysteme eignen sich perfekt zur Nachrüstung, da sie ohne Schmutz und Kabelverlegung installiert werden können. Moderne Funkanlagen sind dank rollierender Codes und Anti-Jamming-Funktionen absolut sicher gegen Manipulationen.</p>
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
