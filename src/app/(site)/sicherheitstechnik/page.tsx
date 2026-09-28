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
import { SecurityAuditCalculator } from '@/components/sicherheitstechnik/security-audit-calculator';

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
  await params;
  await searchParams;
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

      {/* TIEFEN-ANALYSE & INTERAKTIVES MODUL: SICHERHEITSTECHNIK */}
  <Section id="tiefen-analyse">
    <SectionHeading
      eyebrow="Architektur & Methodik"
      title="Ganzheitliche Sicherheitsarchitektur: Von der Physis zur digitalen Resilienz"
      lead="Sicherheit ist kein Zustand, sondern ein dynamischer Prozess. Eine wirksame Sicherheitsarchitektur erfordert die lückenlose Integration mechanischer Barrieren, präziser Meldetechnik und ausfallsicherer Alarmierungssysteme."
    />

    <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-8 text-[oklch(0.32_0.02_260)] leading-relaxed text-[16px]">
        <p>
          Moderne Sicherheitstechnik basiert auf dem Prinzip des <strong>Zwiebelschalenmodells (Defense in Depth)</strong>.
          Jede Ebene der Absicherung &ndash; von der Grundstücksgrenze über die Außenhaut des Gebäudes bis hin zur
          inneren Kernzone &ndash; muss spezifische Widerstandswerte aufweisen. Der fundamentale Irrtum vieler
          Sicherheitskonzepte besteht darin, elektronische Überwachung als Ersatz für physischen Widerstand
          zu betrachten. Tatsächlich gilt: <em>Elektronik meldet, Mechanik hält auf.</em>
        </p>
        <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Mechanische Grundsicherung (Die Physische Barriere)</h3>
        <p>
          Die mechanische Absicherung bildet das unerschütterliche Fundament jeder Sicherheitsstrategie.
          Einbrecher arbeiten unter extremem Zeitdruck. Dauert die Überwindung einer Barriere (z.B. einer
          Eingangstür oder eines Fensters im Erdgeschoss) länger als drei bis fünf Minuten, wird der Versuch
          in über 80% der Fälle abgebrochen. Hier kommen hochresistente Materialien zum Einsatz:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Profilzylinder mit Zieh- und Bohrschutz:</strong> Gehärtete Stahlstifte verhindern das Aufbohren, während die Zylinderkonstruktion ein Abbrechen oder Herausziehen durch Spezialwerkzeuge unmöglich macht.</li>
          <li><strong>Schutzbeschläge (ES1 bis ES3):</strong> Massive Stahlschilder, die den Zylinder komplett abdecken und von innen unsichtbar verschraubt sind.</li>
          <li><strong>Pilzkopfverriegelungen an Fenstern:</strong> Diese greifen beim Verschließen tief in massive Stahlschließbleche ein und verhindern das sekundenschnelle Aufhebeln des Fensterflügels, der häufigsten Einbruchsmethode.</li>
        </ul>

        <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Elektronische Detektion (Die Sensorik)</h3>
        <p>
          Erst wenn der mechanische Grundschutz gewährleistet ist, entfaltet die elektronische Meldetechnik
          ihre volle Wirkung. Einbruchmeldeanlagen (EMA) und Videoüberwachungssysteme dienen nicht der
          Verhinderung des Eindringens, sondern der sofortigen Erkennung und Dokumentation.
        </p>
        <p className="mt-4">
          Wir unterscheiden zwischen der <strong>Außenhautüberwachung</strong> (Magnetkontakte an Fenstern und Türen,
          die anschlagen, bevor der Täter im Gebäude ist) und der <strong>Fallenüberwachung</strong> (Infrarot- und
          Mikrowellen-Bewegungsmelder im Inneren). Moderne Anlagen nutzen Dual-Melder-Technologie, um
          Fehlalarme durch Haustiere oder thermische Schwankungen drastisch zu reduzieren.
        </p>

        <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Ausfallsicherheit und Redundanz</h3>
        <p>
          Eine professionelle Sicherheitsarchitektur darf keinen Single Point of Failure aufweisen.
          Alarmzentralen müssen über redundante Übertragungswege (z.B. IP/LAN gekoppelt mit LTE/GSM-Mobilfunk)
          verfügen. Bei einem Stromausfall oder der gezielten Manipulation der Zuleitung muss das System
          durch Notstromakkumulatoren (USV) für mindestens 12 bis 60 Stunden (je nach VdS-Klasse) vollständig
          betriebsbereit bleiben.
        </p>
      </div>

      <div className="lg:sticky lg:top-24 h-fit">
        <SecurityAuditCalculator />
      </div>
    </div>
  </Section>

  {/* FAQ SEKTION */}
  <Section tone="muted">
    <SectionHeading
      eyebrow="Fachwissen"
      title="Häufige Fragen zur Sicherheitsarchitektur"
      lead="Fundierte Antworten auf die wichtigsten technischen und konzeptionellen Fragen."
    />
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
        <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet VdS-Zertifizierung und warum ist sie wichtig?</h4>
        <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Die VdS Schadenverhütung GmbH ist Europas führendes Institut für Unternehmenssicherheit.
          Eine VdS-Anerkennung bedeutet, dass Komponenten und Errichter strengste Qualitäts- und
          Sabotageschutz-Kriterien erfüllen. Für gewerbliche Objekte fordern Versicherer häufig
          eine Anlage nach VdS Klasse B oder C.
        </p>
      </div>
      <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
        <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Kann eine Alarmanlage kabellos (Funk) installiert werden?</h4>
        <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Ja. Moderne professionelle Funksysteme arbeiten auf geschützten Frequenzen (z.B. 868 MHz)
          und nutzen Rolling-Code-Verschlüsselung sowie bidirektionale Kommunikation. Sie sind resistent
          gegen &quot;Jamming&quot; (Störsender). Bei Neubauten oder Kernsanierungen raten wir dennoch zur
          verkabelten Bus-Technologie (höchste Ausfallsicherheit, keine Batteriewechsel).
        </p>
      </div>
      <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
        <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Was ist der Unterschied zwischen Außenhaut- und Fallenüberwachung?</h4>
        <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Die Außenhautüberwachung detektiert den Täter bereits am Fenster oder der Tür (bevor er im Objekt ist),
          was eine frühe Alarmierung ermöglicht und ideal für Anwesenheitsschutz ist (Sie können sich im Haus frei bewegen).
          Die Fallenüberwachung sichert Innenräume (Bewegungsmelder) und löst aus, wenn der Täter bereits eingedrungen ist.
        </p>
      </div>
      <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
        <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Darf ich Überwachungskameras beliebig aufhängen?</h4>
        <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Nein. Aus Datenschutzgründen (DSGVO) dürfen Kameras ausschließlich das eigene Grundstück erfassen.
          Öffentliche Wege (Gehwege, Straßen) oder das Nachbargrundstück müssen zwingend durch Privacy-Masking
          (digitale Schwärzung im Kamerabild) oder physische Blenden ausgeblendet werden.
        </p>
      </div>
      <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 md:col-span-2">
        <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Wie funktioniert eine Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?</h4>
        <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Eine bloße Sirene am Haus wird oft ignoriert. Bei einer Aufschaltung sendet die Zentrale im Alarmfall ein
          verschlüsseltes Protokoll an eine 24/7 besetzte, hochsichere Leitstelle. Dort wird der vereinbarte
          Interventionsplan abgearbeitet: Objekt anrufen, Bildverifizierung prüfen (falls Kameras gekoppelt sind),
          Interventionsdienst (Wachschutz) oder direkt die Polizei alarmieren.
        </p>
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
