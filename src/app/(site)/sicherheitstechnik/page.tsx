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
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

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

      {/* Security Calculator */}
      <Section tight>
        <SectionHeading
          eyebrow="Investitionsrahmen"
          title="Sicherheits-Budget Kalkulator"
          lead="Berechnen Sie den geschätzten Investitionsrahmen für Ihr Sicherheitstechnik-Projekt. Diese Kostenschätzung dient als erste Orientierung für Ihre Planung."
        />
        <div className="mt-8">
          <SecurityBudgetCalculator />
        </div>
      </Section>

      {/* Detaillierte Fachkompetenz */}
      <Section id="architektur-methodik">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Unsere technische Methodik für ganzheitliche Sicherheit"
          lead="Eine fundierte Sicherheitsarchitektur entsteht nicht durch die bloße Aneinanderreihung von Komponenten. Es erfordert eine tiefgreifende Methodik, die Mechanik, Elektronik und Prozesslogik nahtlos verzahnt."
        />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
            <p>
              Die Basis unserer Methodik ist das Schichtenmodell der Sicherheit. Wir beginnen immer am Perimeter – der äußersten Grenze Ihres Objekts. Hier geht es um die <strong>Außenhautsicherung</strong>, bei der robuste mechanische Barrieren mit intelligenter Detektionstechnik kombiniert werden. Jeder Zutrittspunkt, sei es eine Tür, ein Fenster oder ein Tor, wird analysiert und entsprechend seinem spezifischen Risikoprofil abgesichert.
            </p>
            <p>
              Auf der zweiten Ebene greift die <strong>Meldetechnik</strong>. Einbruchmeldeanlagen (EMA) und Videoüberwachungssysteme arbeiten hier Hand in Hand. Unsere Philosophie: Detektion muss vor der Intervention stattfinden. Durch präzise Sensorik und KI-gestützte Bildauswertung minimieren wir Falschalarme drastisch, während echte Bedrohungen in Millisekunden erfasst werden.
            </p>
            <p>
              Die dritte Schicht bildet das <strong>Alarmierungs- und Interventionsmanagement</strong>. Ein erkannter Vorfall muss unmittelbar die richtigen Reaktionen auslösen. Dies reicht von der stillen Alarmierung einer Leitstelle über die Aktivierung von optisch-akustischen Signalgebern bis hin zur Steuerung von Smart-Home-Komponenten, die beispielsweise die Beleuchtung maximieren und Fluchtwege sichern.
            </p>
          </div>
          <div className="space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
             <p>
              Darüber hinaus legen wir größten Wert auf <strong>Systemintegration und Ausfallsicherheit</strong>. Isolierte Lösungen sind anfällig. Wir integrieren Brandmeldetechnik, Zutrittskontrolle und Einbruchmeldesysteme in eine zentrale, redundante Management-Plattform. Dies gewährleistet nicht nur eine komfortable Bedienung, sondern auch höchste Zuverlässigkeit selbst bei Strom- oder Netzwerkausfällen durch entsprechende Notstromkonzepte.
            </p>
            <p>
              Die <strong>Kryptografie und Netzwerksicherheit</strong> bildet das unsichtbare Rückgrat. In einer Zeit, in der Angriffe zunehmend digital erfolgen, härten wir alle IP-basierten Systeme ab. AES-256 Verschlüsselung für die Datenübertragung, segmentierte VLANs für Sicherheitstechnik und strikte Zugangskontrollen auf Netzwerkebene sind bei uns Standard, nicht Option.
            </p>
            <p>
              Schließlich ist die <strong>Wartung und Lebenszyklusbetrachtung</strong> essenziell. Sicherheit ist kein Zustand, sondern ein Prozess. Durch kontinuierliches Monitoring, regelmäßige Firmware-Updates und präventive Wartungsintervalle stellen wir sicher, dass das System auch nach Jahren noch exakt die Schutzwirkung bietet, die am ersten Tag definiert wurde.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
           <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Vergleichsmatrix: Schutzklassen & Standards</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
               <thead className="border-b border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)]">
                 <tr>
                   <th className="py-3 px-4 font-semibold">Schutzklasse (VdS)</th>
                   <th className="py-3 px-4 font-semibold">Zielgruppe / Risiko</th>
                   <th className="py-3 px-4 font-semibold">Mechanische Basis</th>
                   <th className="py-3 px-4 font-semibold">Elektronische Überwachung</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                 <tr>
                   <td className="py-3 px-4 font-medium text-[oklch(0.16_0.02_260)]">Klasse A / Home</td>
                   <td className="py-3 px-4">Privathaushalte mit normalem Risiko</td>
                   <td className="py-3 px-4">RC2 Fenster & Türen, Grundsicherung</td>
                   <td className="py-3 px-4">Einfache EMA, Bewegungsmelder, optional Video</td>
                 </tr>
                 <tr>
                   <td className="py-3 px-4 font-medium text-[oklch(0.16_0.02_260)]">Klasse B / Business</td>
                   <td className="py-3 px-4">Gewerbe, erhöhte private Werte</td>
                   <td className="py-3 px-4">RC3, Schließanlagen mit Kopierschutz</td>
                   <td className="py-3 px-4">Erweiterte EMA, flächendeckende Sensorik, Aufschaltung</td>
                 </tr>
                 <tr>
                   <td className="py-3 px-4 font-medium text-[oklch(0.16_0.02_260)]">Klasse C / High Security</td>
                   <td className="py-3 px-4">Banken, Juweliere, Hochrisikoobjekte</td>
                   <td className="py-3 px-4">RC4-RC6, Wertschutzräume, mechatronische Sperren</td>
                   <td className="py-3 px-4">Hochkomplexe EMA, redundante Übertragungswege, 24/7 Video-Leitstelle</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading
          eyebrow="Fachspezifische Fragen"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Wir beantworten die wichtigsten technischen und konzeptionellen Fragen rund um die Integration von Sicherheitstechnik in Ihr Objekt."
        />
        <dl className="mt-8 space-y-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-[oklch(0.988_0.002_260)] shadow-sm">
            <dt className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Wie verhält sich die Sicherheitstechnik bei einem längeren Stromausfall?</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Alle von uns verbauten VdS-zertifizierten Einbruchmeldeanlagen verfügen über eine normgerechte Notstromversorgung. Diese basiert auf wartungsfreien Blei-Gel-Akkumulatoren, die je nach Systemgröße und Ausbaustufe eine Überbrückungszeit von 12 bis 60 Stunden gewährleisten. Bei kritischen Infrastrukturen können zusätzliche USV-Anlagen (Unterbrechungsfreie Stromversorgung) oder Netzersatzanlagen integriert werden, um auch die Videoüberwachung und aktive Netzkomponenten langfristig aufrechtzuerhalten.
            </dd>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-[oklch(0.988_0.002_260)] shadow-sm">
            <dt className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Können bestehende mechanische Schließanlagen mit neuen elektronischen Systemen kombiniert werden?</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Ja, die mechatronische Integration ist eine unserer Kernkompetenzen. Wir nutzen sogenannte hybride Zylinder oder intelligente Beschlagsleser, die sowohl den rein mechanischen Schlüssel als auch elektronische Transponder (RFID/NFC) oder Bluetooth-Credentials verarbeiten können. So können Sie beispielsweise die Außenhülle elektronisch hochsicher ausstatten und im Innenbereich die vorhandene Mechanik weiternutzen – verwaltet über eine zentrale Softwareplattform.
            </dd>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-[oklch(0.988_0.002_260)] shadow-sm">
            <dt className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Welche Netzwerkanforderungen stellt eine moderne Videoüberwachung (CCTV)?</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Moderne IP-Kameras mit 4K-Auflösung und KI-Analyse benötigen eine robuste Netzwerkinfrastruktur. Wir empfehlen ein dediziertes, physikalisch oder logisch (VLAN) getrenntes Netzwerk für die Sicherheitstechnik. Die Bandbreitenanforderung pro Kamera liegt je nach Komprimierung (H.265+) bei 2-8 Mbit/s. Zudem muss die Stromversorgung (PoE - Power over Ethernet) ausreichend dimensioniert sein. Wir übernehmen die komplette Berechnung der Bandbreiten- und Storage-Anforderungen.
            </dd>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-[oklch(0.988_0.002_260)] shadow-sm">
            <dt className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Wie wird der Datenschutz (DSGVO) bei der Installation von Kamerasystemen gewährleistet?</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Datenschutz by Design ist bei uns zwingend. Wir konfigurieren Kameras so, dass öffentliche Bereiche (Gehwege, Straßen) oder Nachbargrundstücke durch sogenannte Privacy-Masking-Zonen (geschwärzte Bereiche direkt im Bildsensor) physisch nicht erfasst werden können. Die Speicherdauer wird auf das rechtlich erforderliche Minimum (meist 48-72 Stunden) begrenzt und der Zugriff auf die Aufnahmen erfordert ein mehrstufiges Berechtigungskonzept (Vier-Augen-Prinzip) inklusive lückenlosem Audit-Log.
            </dd>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-[oklch(0.988_0.002_260)] shadow-sm">
            <dt className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Aufschaltung bedeutet, dass Ihre Alarm- und Videotechnik über hochsichere, redundante Übertragungswege (z.B. IP und LTE-Backup) mit einer VdS-zertifizierten Leitstelle verbunden ist. Löst ein Sensor aus, empfangen die Leitstellen-Operatoren das Signal in Sekundenbruchteilen. Bei Video-Verifikation können sie live ins Objekt schauen, die Situation bewerten und zielgerichtet die Polizei, Feuerwehr oder einen Wachdienst alarmieren, ohne dass Sie selbst nachts oder im Urlaub aktiv werden müssen.
            </dd>
          </div>
        </dl>
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
