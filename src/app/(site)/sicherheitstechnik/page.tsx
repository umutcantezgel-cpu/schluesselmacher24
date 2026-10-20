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
import { SecurityCheckCalculator } from '@/components/calculator/security-check-calculator';

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


      {/* Fachliche Vertiefung und Interaktiver Rechner (800+ words expansion) */}
      <Section tight>
        <div className="mx-auto max-w-4xl space-y-12">

          <div className="prose prose-lg prose-headings:text-[oklch(0.16_0.02_260)] prose-p:text-[oklch(0.32_0.02_260)] prose-li:text-[oklch(0.32_0.02_260)]">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Umfassende Sicherheitsarchitektur: Ein tieferer Einblick</h2>
            <p className="leading-relaxed mb-6">
              Die Planung und Implementierung effektiver Sicherheitstechnik ist weit mehr als die bloße Installation von Hardware. Sie erfordert eine holistische Betrachtung des Objekts, der individuellen Gefährdungslage und der spezifischen Bedürfnisse der Nutzer. Eine moderne Sicherheitsarchitektur basiert auf dem bewährten Prinzip des Zwiebelschalenmodells: Verschiedene, sich ergänzende Sicherheitsebenen werden so kombiniert, dass ein Eindringen erschwert, Verzögerungen maximiert und Täter frühzeitig detektiert werden. Dieses Prinzip ist fundamental für private Wohnobjekte ebenso wie für gewerbliche und industrielle Komplexe.
            </p>
            <p className="leading-relaxed mb-6">
              Im Kern jeder robusten Absicherung steht die <strong>mechanische Grundsicherung</strong>. Sie ist das Fundament, auf dem alle weiteren Maßnahmen aufbauen. Mechanik hat primär die Aufgabe, physischen Widerstand zu leisten und den Zeitaufwand für einen Einbruchsversuch signifikant zu erhöhen. Täter arbeiten unter enormem Zeitdruck; jeder zusätzliche Widerstand, der den Einbruch um wertvolle Minuten verzögert, erhöht das Entdeckungsrisiko drastisch und führt häufig zum Abbruch des Versuchs. Hierzu zählen hochwertige Schließzylinder mit Bohr- und Ziehschutz, massive Sicherheitsschließbleche, Panzerriegel und vor allem einbruchhemmende Fensterbeschläge (wie Pilzkopfverriegelungen) und Türen entsprechend den DIN EN 1627 Normen (Widerstandsklassen RC2 oder RC3 für den Privatbereich).
            </p>

            <h3 className="text-2xl font-semibold mt-10 mb-4">Meldetechnik und Detektion: Der elektronische Ring</h3>
            <p className="leading-relaxed mb-6">
              Während die Mechanik den Widerstand leistet, ist die <strong>elektronische Meldetechnik</strong> (Einbruchmeldeanlagen, EMA) dafür zuständig, einen dennoch erfolgten oder versuchten Einbruch zu erkennen und zu melden. Wichtig zu verstehen ist: Eine Alarmanlage verhindert keinen Einbruch physisch, sie meldet ihn nur. Daher ist die Kombination aus Mechanik (Verzögerung) und Elektronik (Erkennung) entscheidend. Moderne Systeme nutzen eine Kombination aus Außenhautüberwachung (Magnetkontakte an Fenstern und Türen, Glasbruchmelder) und Fallenüberwachung (Bewegungsmelder im Innenbereich). Die Alarmierung erfolgt meist dual: lokal über akustische und optische Signalgeber (Sirenen und Blitzleuchten) zur Abschreckung des Täters sowie zur Alarmierung der direkten Umgebung, und als Fernalarmierung via GSM/IP an einen zertifizierten Wachdienst, der vordefinierte Interventionsmaßnahmen einleitet.
            </p>

            <h3 className="text-2xl font-semibold mt-10 mb-4">Videoüberwachung und Zutrittskontrolle: Prävention und Protokollierung</h3>
            <p className="leading-relaxed mb-6">
              Die dritte Schicht umfasst <strong>Videoüberwachungssysteme (CCTV)</strong> und <strong>elektronische Zutrittskontrollen</strong>. Kamerasysteme wirken hochgradig präventiv und dienen nach einem Vorfall der Aufklärung und Beweissicherung. Dank hochauflösender IP-Kameras, intelligenter Videoanalytik (z.B. KI-gestützte Erkennung von Personen oder Fahrzeugen vs. Tieren oder witterungsbedingten Bewegungen) und Infrarot-Nachtsicht liefern moderne Anlagen rund um die Uhr verlässliches Bildmaterial. Bei der Planung ist der Datenschutz jedoch zwingend zu beachten; öffentliche Bereiche dürfen nicht erfasst werden.
            </p>
            <p className="leading-relaxed mb-6">
              Elektronische Zutrittskontrollsysteme ersetzen den klassischen mechanischen Schlüssel durch RFID-Transponder, Smartcards, PIN-Codes oder biometrische Merkmale (z.B. Fingerabdruck). Der immense Vorteil liegt in der Flexibilität: Berechtigungen können zeitlich und räumlich individuell vergeben, bei Verlust eines Transponders dieser sofort gesperrt und Zutrittsereignisse lückenlos protokolliert werden. Dies ist besonders im gewerblichen Umfeld mit wechselndem Personal oder in Mehrfamilienhäusern von unschätzbarem Wert.
            </p>

            <h3 className="text-2xl font-semibold mt-10 mb-4">Häufig gestellte Fragen (FAQ) zur Sicherheitstechnik</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2">1. Was ist wichtiger: Mechanik oder Elektronik?</h4>
                <p className="leading-relaxed">Ganz klar: Die Mechanik. Sie ist der physische Widerstand. Elektronik ist eine sinnvolle und oft notwendige Ergänzung, kann aber fehlende mechanische Sicherheit (z.B. ein Fenster, das man mit einem Schraubenzieher in Sekunden aufhebeln kann) niemals kompensieren. Die Mechanik hält den Täter draußen, die Elektronik meldet, dass er da ist.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">2. Lohnt sich eine Alarmanlage für eine normale Wohnung?</h4>
                <p className="leading-relaxed">Ja, absolut. Insbesondere Wohnungen im Erdgeschoss oder mit leicht erreichbaren Balkonen sind gefährdet. Eine professionelle, drahtlose Einbruchmeldeanlage lässt sich heute ohne großen baulichen Aufwand (Schmutz, Kabelziehen) installieren und bei einem Umzug problemlos mitnehmen. Die abschreckende Wirkung ist enorm.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">3. Sind Smart-Home-Alarmanlagen aus dem Baumarkt ausreichend?</h4>
                <p className="leading-relaxed">Für einen rudimentären Schutz oder reine Informationszwecke mögen diese Systeme ausreichen. Sie erfüllen jedoch in der Regel nicht die strengen normativen Anforderungen an professionelle Einbruchmeldeanlagen (z.B. VdS-Klassen oder EN 50131). Professionelle Systeme bieten redundante Übertragungswege, Notstromversorgung, Sabotageschutz auf allen Komponenten und eine garantierte Zuverlässigkeit, die bei DIY-Systemen oft fehlt.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">4. Darf ich Kameras auf meinem Grundstück frei installieren?</h4>
                <p className="leading-relaxed">Nein. Sie dürfen ausschließlich Ihr eigenes, privates Grundstück überwachen. Der Erfassungsbereich der Kamera darf öffentliche Gehwege, Straßen oder das Nachbargrundstück nicht tangieren. Auch Hinweisschilder (&quot;Achtung Videoüberwachung&quot;) sind in der Regel gesetzlich vorgeschrieben, wenn Dritte (z.B. Postboten, Besucher) das Grundstück betreten können.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">5. Was kostet eine vernünftige Absicherung?</h4>
                <p className="leading-relaxed">Das lässt sich seriös nicht pauschal beantworten, da es stark von der Objektgröße, den vorhandenen Schwachstellen und dem individuellen Schutzbedürfnis abhängt. Eine solide mechanische Grundsicherung einer Tür beginnt bei wenigen hundert Euro, eine umfassende Absicherung eines Einfamilienhauses inkl. Fenstern und professioneller Alarmanlage liegt oft im mittleren vierstelligen Bereich. Eine Vor-Ort-Analyse ist unerlässlich für ein verlässliches Angebot.</p>
              </div>
            </div>
          </div>

          <SecurityCheckCalculator />

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
