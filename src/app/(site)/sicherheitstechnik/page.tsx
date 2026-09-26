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
import { SicherheitRechner } from '@/components/calculator/sicherheit-rechner';
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


      {/* Fachliche Einordnung & Methodik */}
      <Section tight>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Ganzheitliche Sicherheitskonzepte für den anspruchsvollen Objektschutz"
          lead="Moderne Sicherheitstechnik ist kein isoliertes Gewerk, sondern eine orchestrierte Symphonie aus mechanischem Grundschutz, intelligenter Sensorik und zuverlässiger Alarmierung."
        />
        <div className="mt-8 prose prose-lg prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Die Konzeption effektiver Sicherheitssysteme erfordert ein tiefgreifendes Verständnis der physikalischen Gegebenheiten sowie der potenziellen Angriffsvektoren. Unser Ansatz basiert auf der strikten Trennung und anschließenden Synthese von Prävention, Detektion und Intervention. Mechanische Barrieren wie RC3-klassifizierte Sicherheitstüren, Pilzkopfverriegelungen und Ziehschutzrosetten bilden das Fundament. Sie erhöhen den Zeitaufwand und das Risiko für Eindringlinge signifikant.
          </p>
          <p>
            Erst wenn die Peripherie mechanisch gehärtet ist, implementieren wir die elektronische Detektionsebene. Diese umfasst nicht nur klassische Magnetkontakte und Glasbruchsensoren, sondern auch volumetrische Raumüberwachung durch Dual-Melder (Passiv-Infrarot und Mikrowelle), die selbst bei widrigen thermischen Bedingungen eine verschwindend geringe Falschalarmquote garantieren.
          </p>
          <p>
            Ein weiterer essenzieller Baustein ist die Videoüberwachung. Wir setzen auf hochauflösende IP-Kamerasysteme mit integrierter Videoanalytik (VCA). Algorithmen zur Perimeterüberwachung können zwischen menschlichen Akteuren, Tieren und witterungsbedingten Bewegungen unterscheiden. Dies reduziert die kognitive Belastung für das Sicherheitspersonal und stellt sicher, dass Interventionen nur bei echten Bedrohungen initiiert werden.
          </p>
          <p>
            Die Alarmierung erfolgt schließlich über redundante Übertragungswege (IP, GSM/LTE, PSTN) an zertifizierte Notruf- und Serviceleitstellen (NSL). Die Aufschaltung garantiert eine 24/7-Reaktion gemäß den VdS-Richtlinien. Darüber hinaus implementieren wir lokale Alarmierungen mittels hochpegeliger Sirenen und optischer Signalgeber, um einen massiven psychologischen Druck auf Täter auszuüben und die unmittelbare Umgebung zu sensibilisieren.
          </p>
          <p>
            Zusammenfassend lässt sich sagen, dass nur die nahtlose Integration dieser Disziplinen – Mechanik, Elektronik und Organisation – eine resiliente Sicherheitsarchitektur schafft. Wir begleiten Sie von der initialen Schwachstellenanalyse über die Fachplanung und Installation bis hin zur regelmäßigen Wartung und Revision der Systeme.
          </p>
          <p>
            Unsere Planungsmethodik folgt dabei stets dem Prinzip der Verhältnismäßigkeit und des Datenschutzes (&quot;Privacy by Design&quot;). Jede Kamera, jeder Sensor wird exakt so konfiguriert, dass nur das erfasst wird, was für den definierten Schutzzweck absolut notwendig ist. So stellen wir sicher, dass Ihre Sicherheitstechnik nicht nur effektiv, sondern auch rechtssicher betrieben wird.
          </p>
          <p>
            Die Vernetzung der Gewerke untereinander eröffnet zudem enorme Synergiepotenziale. Eine Einbruchmeldeanlage kann im Alarmfall nicht nur die Sirenen aktivieren, sondern auch die Videoüberwachung triggern, um Pre-Alarm-Bilder an die Leitstelle zu übertragen. Gleichzeitig können elektronische Schließzylinder blockiert und die Beleuchtung im Objekt auf volle Leistung geschaltet werden. Dieses Zusammenspiel verwandelt ein reaktives System in einen aktiven Abwehrmechanismus.
          </p>
          <p>
             Wir verwenden ausschließlich Komponenten renommierter Hersteller, die sich durch Langlebigkeit, Update-Fähigkeit und offene Schnittstellen (z.B. ONVIF bei Kameras) auszeichnen. Proprietäre Insellösungen lehnen wir ab, da sie die Zukunftsfähigkeit und Erweiterbarkeit Ihrer Investition gefährden. Vertrauen Sie auf unsere Expertise für maßgeschneiderte Sicherheitslösungen, die exakt auf Ihr Risikoprofil und Ihre betrieblichen Abläufe abgestimmt sind.
          </p>
        </div>
      </Section>

      {/* Leistungsstufen / Vergleichsmatrix */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architekturstufen"
          title="Klassifizierung unserer Sicherheitskonzepte"
          lead="Wir strukturieren unsere Lösungen in drei aufsteigende Leistungsstufen, die sich am individuellen Risikoprofil orientieren."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid grid-rows-[auto_1fr_auto]">
            <div>
               <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Basis-Schutz</h3>
               <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">Grundlegende mechanische Absicherung für Privathaushalte und kleine Gewerbeobjekte.</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
               <li>• Mechanische Grundsicherung (RC2/RC3)</li>
               <li>• Schließanlage mit Sicherungskarte</li>
               <li>• Lokale Alarmierung (Stand-alone)</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
               <span className="text-xs font-semibold uppercase text-[oklch(0.52_0.24_260)]">Geeignet für: Niedriges Risiko</span>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[oklch(0.52_0.24_260)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_12px_32px_-4px_oklch(0.52_0.24_260/0.12)] grid grid-rows-[auto_1fr_auto] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[oklch(0.52_0.24_260)] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              Empfohlener Standard
            </div>
            <div>
               <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Erweiterter Schutz</h3>
               <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">Kombination aus Mechanik und elektronischer Detektion für gehobene Ansprüche.</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
               <li>• Alles aus Basis-Schutz</li>
               <li>• Vernetzte Einbruchmeldeanlage</li>
               <li>• App-Steuerung & Fernzugriff</li>
               <li>• Aufschaltung auf Wachdienst</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
               <span className="text-xs font-semibold uppercase text-[oklch(0.52_0.24_260)]">Geeignet für: Mittleres Risiko</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid grid-rows-[auto_1fr_auto]">
            <div>
               <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">High-Security</h3>
               <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">Vollumfängliche Integration für hochsensible Anlagen und Werte.</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
               <li>• Alles aus Erweitertem Schutz</li>
               <li>• Perimeterschutz & Videoanalytik</li>
               <li>• Elektronische Zutrittskontrolle</li>
               <li>• Redundante Alarmübertragung (VdS)</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
               <span className="text-xs font-semibold uppercase text-[oklch(0.52_0.24_260)]">Geeignet für: Hohes Risiko</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Interaktiver Rechner */}
      <Section tight>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="Planungswerkzeug"
              title="Budget-Kalkulator für Ihr Sicherheitsprojekt"
              lead="Nutzen Sie unseren interaktiven Rechner, um eine erste Einschätzung der benötigten Investition für Ihr Objekt zu erhalten. Die Kalkulation basiert auf Erfahrungswerten und dient als solide Diskussionsgrundlage für unsere Fachplanung."
            />
            <p className="mt-4 text-[oklch(0.32_0.02_260)]">
              Verschieben Sie einfach die Regler, um den Projektumfang und die Anzahl der gewünschten Kameramodule anzupassen. Die Berechnung erfolgt in Echtzeit und gibt Ihnen ein klares Gefühl für die Dimensionierung.
            </p>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.52_0.24_260/0.1)] to-transparent rounded-3xl -z-10 blur-xl"></div>
             <SicherheitRechner />
          </div>
        </div>
      </Section>

      {/* FAQ Block */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Wissensdatenbank"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Expertenantworten auf die wichtigsten Fragen rund um die moderne Sicherheitstechnik."
        />
        <div className="mt-8 space-y-4 max-w-3xl mx-auto">
          {[
            { q: 'Was ist der Unterschied zwischen einer Alarmanlage und einer Einbruchmeldeanlage (EMA)?', a: 'Eine Alarmanlage ist ein umgangssprachlicher Begriff. Fachlich korrekt spricht man von einer Einbruchmeldeanlage (EMA). Eine EMA ist ein komplexes, normiertes System (z.B. nach DIN VDE 0833), das nicht nur lokal alarmiert, sondern auch mit Leitstellen kommuniziert, Sabotage erkennt und verschiedene Meldergruppen verwaltet.' },
            { q: 'Benötige ich für eine Videoüberwachung zwingend Hinweisschilder?', a: 'Ja, absolut. Gemäß DSGVO und BDSG muss eine Videoüberwachung transparent gemacht werden, bevor eine Person den erfassten Bereich betritt. Das Hinweisschild muss den Zweck der Überwachung, die verantwortliche Stelle und die Kontaktdaten des Datenschutzbeauftragten enthalten.' },
            { q: 'Wie oft muss eine Sicherheitstechnik gewartet werden?', a: 'Wir empfehlen dringend eine jährliche Wartung durch einen qualifizierten Errichter. Bei gewerblichen Anlagen oder Systemen, die auf eine VdS-anerkannte Leitstelle aufgeschaltet sind, ist eine regelmäßige Wartung (oft 1- bis 4-mal jährlich) sogar zwingend vorgeschrieben, um den Versicherungsschutz aufrechtzuerhalten.' },
            { q: 'Was bedeutet die Abkürzung "RC" bei Sicherheitstüren und Fenstern?', a: 'RC steht für "Resistance Class" (Widerstandsklasse) gemäß der Norm DIN EN 1627. Sie definiert, wie lange ein Bauteil einem Einbruchversuch mit bestimmten Werkzeugen standhält. Für Privathaushalte wird mindestens RC2, besser RC3 empfohlen.' },
            { q: 'Kann ich meine bestehende mechanische Schließanlage in ein elektronisches System integrieren?', a: 'Ja, das ist in der Regel problemlos möglich. Wir nutzen sogenannte Mechatronik-Zylinder oder hybride Systeme, bei denen ein mechanischer Schlüssel zusätzlich einen RFID-Transponderchip im Reiden enthält. So können mechanische und elektronische Türen nahtlos miteinander kombiniert werden.' }
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
               <h4 className="font-bold text-[oklch(0.16_0.02_260)] text-lg">{faq.q}</h4>
               <p className="mt-2 text-[oklch(0.32_0.02_260)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

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
    </main>
  );
}
