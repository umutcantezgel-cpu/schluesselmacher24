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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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


      {/* Fachlicher Deep Dive - > 800 WÖRTER */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Ganzheitliche Sicherheitskonzepte für private und gewerbliche Objekte"
          lead="Moderne Sicherheitstechnik ist kein Produkt aus dem Regal, sondern eine maßgeschneiderte Architektur, die Mechanik, Elektronik und digitale Prozesse in einem durchdachten Konzept vereint. Wir entwickeln Lösungen, die präventiv schützen, im Ernstfall zuverlässig alarmieren und gleichzeitig den täglichen Betriebsablauf nicht behindern."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Mechanischer Grundschutz als Fundament</h3>
            <p>
              Jedes professionelle Sicherheitskonzept beginnt mit dem physischen Grundschutz. Elektronik kann melden und dokumentieren, aber nur solide Mechanik kann einen Einbruchsversuch physisch stoppen oder entscheidend verzögern. In der Praxis bedeutet das:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Hochsicherheitszylinder:</strong> Einsatz von patentierten Schließzylindern mit Bohrschutz, Ziehschutz und Schlagschlüsselsicherheit nach höchsten VdS-Klassen.</li>
              <li><strong>Sicherheitsbeschläge:</strong> Massive Schutzbeschläge (ES1, ES2, ES3), die den Zylinder vollständig umschließen und das gewaltsame Abdrehen oder Ziehen verhindern.</li>
              <li><strong>Mehrfachverriegelungen:</strong> Türschlösser, die nicht nur an einer Stelle, sondern an drei bis fünf Punkten gleichzeitig im Schließblech verankern.</li>
              <li><strong>Zusatzsicherungen:</strong> Panzerriegel, Stangenschlösser und Scharnierseitensicherungen, die die mechanische Widerstandskraft einer Tür exponentiell erhöhen.</li>
            </ul>
            <p>
              Unsere Experten analysieren die Bausubstanz und empfehlen mechanische Nachrüstungen, die exakt auf das Risikoprofil Ihres Objekts abgestimmt sind. Wir arbeiten ausschließlich mit Herstellern, die sich in unabhängigen Tests und in der harten Realität bewährt haben.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Elektronische Zutrittskontrolle & Schließanlagen</h3>
            <p>
              Wo früher der mechanische Schlüssel regierte, dominieren heute intelligente, elektronische Zutrittslösungen. Diese Systeme bieten nicht nur ein Höchstmaß an Sicherheit, sondern auch beispiellosen Komfort und maximale Flexibilität in der Verwaltung.
            </p>
            <p>
              Die Vorteile einer elektronischen Anlage liegen auf der Hand: Bei Schlüsselverlust muss nicht mehr der Zylinder ausgetauscht werden &ndash; der verlorene Transponder wird einfach per Mausklick gesperrt. Zutrittsrechte können temporär vergeben werden (z.B. für Reinigungskräfte oder Handwerker) und lückenlos protokolliert werden.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Alarmierung & Meldetechnik</h3>
            <p>
              Eine Einbruchmeldeanlage (EMA) ist die perfekte Ergänzung zur mechanischen Absicherung. Sie überwacht das Objekt lückenlos und meldet jeden unbefugten Eindringversuch sofort. Wir konzipieren Anlagen, die exakt auf Ihre Bedürfnisse zugeschnitten sind &ndash; von der einfachen Funk-Alarmanlage für die Privatwohnung bis zum komplexen, VdS-zertifizierten System für Gewerbeobjekte.
            </p>
            <p>
              Moderne Systeme integrieren sich nahtlos in Smart-Home-Umgebungen und ermöglichen die Steuerung per App von überall auf der Welt. Im Alarmfall erfolgt die Benachrichtigung wahlweise auf Ihr Smartphone, an eine zertifizierte Notruf- und Serviceleitstelle (NSL) oder durch laute akustische und optische Signalgeber vor Ort.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Häufig gestellte Fragen (FAQ)</h3>
            <div className="space-y-4">
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5">
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Welche Sicherheitsklasse (Widerstandsklasse) empfehlen Sie?</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Für den privaten Bereich empfehlen wir mindestens RC2 (Resistance Class 2) nach DIN EN 1627. Bei höherem Gefährdungspotenzial oder gewerblichen Objekten raten wir zu RC3 oder RC4.</p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5">
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Können mechanische und elektronische Systeme kombiniert werden?</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Ja, absolut. Diese Kombination (Mechatronik) bietet das höchste Sicherheitsniveau. Ein mechatronischer Zylinder vereint die mechanische Aufsperrsicherheit mit der intelligenten Zutrittskontrolle.</p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5">
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Was tun bei Schlüsselverlust?</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Bei mechanischen Systemen raten wir zum sofortigen Zylindertausch. Bei elektronischen Systemen sperren wir den verlorenen Transponder umgehend im System &ndash; die Sicherheit ist sofort wiederhergestellt.</p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5">
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Gibt es Fördermittel für Einbruchschutz?</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Ja, die KfW (Kreditanstalt für Wiederaufbau) bezuschusst Maßnahmen zum Einbruchschutz. Wir beraten Sie gerne zu den aktuellen Förderprogrammen und den technischen Voraussetzungen.</p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5">
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">Wie lange dauert die Installation einer Alarmanlage?</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Dank moderner Funktechnik können wir Alarmsysteme im Privatbereich oft an einem einzigen Tag staub- und schmutzfrei installieren. Bei kabelgebundenen Systemen hängt der Aufwand von der Gebäudegröße ab.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Interaktiver Rechner */}
      <Section>
        <SectionHeading
          eyebrow="Budgetplanung"
          title="Kalkulieren Sie Ihr Sicherheitsbudget"
          lead="Nutzen Sie unseren interaktiven Rechner, um einen ersten Richtwert für die Absicherung Ihres Objekts zu erhalten."
        />
        <div className="mt-12 max-w-2xl mx-auto">
          <ServiceBudgetCalculator />
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
