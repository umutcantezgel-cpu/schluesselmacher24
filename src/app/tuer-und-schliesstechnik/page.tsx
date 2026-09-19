import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  DoorClosed,
  KeyRound,
  Layers,
  Lock,
  PanelTop,
  ScanLine,
  ShieldCheck,
  Siren,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

const ROUTE = 'tuer-und-schliesstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Tür- und Schließtechnik: Sicherheit beginnt an der Tür',
    description:
      page?.seo.description
      ?? 'Zylinder, Einsteckschlösser, Mehrfachverriegelungen, Beschläge und Türtechnik — Fundierte Beratung, fachgerechte Montage und schnelle Reparatur.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Symbole je Leistung — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof KeyRound> = {
  'profilzylinder-und-spezialzylinder': KeyRound,
  einsteckschloesser: Lock,
  mehrfachverriegelungen: Layers,
  schutzbeschlaege: ShieldCheck,
  tuerzusatzschloesser: PanelTop,
  tuerschliesser: DoorClosed,
  'panik-und-fluchttuertechnik': Siren,
  'reparatur-und-austausch': Wrench,
  'technische-beratung': ScanLine,
  'montage-und-anpassung': Wrench,
};

/** Angrenzende Bereiche — die Hauptnavigation bleibt davon unberührt. */
const RELATED_AREAS = [
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Mehrere Türen mit demselben Schlüssel schließen — ohne vollständige Anlagenplanung. Ideal für Einfamilienhäuser.',
  },
  {
    href: '/schliessanlagen',
    label: 'Schließanlagen',
    body: 'Wenn verschiedene Personen unterschiedlich weit schließen sollen, wird daraus eine strukturierte Anlage.',
  },
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Karte, Transponder, PIN oder App statt Schlüssel — auch in Verbindung mit vorhandener Mechanik flexibel nachrüstbar.',
  },
  {
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik',
    body: 'Wenn zusätzlich erkannt und gemeldet werden soll, was an der Tür passiert. Einbruchmeldeanlagen und Videotechnik.',
  },
];

const FAQ = [
  {
    question: 'Wann sollte ich einen Zylinder austauschen lassen?',
    answer: 'Ein Zylinder sollte ausgetauscht werden, wenn Sie einen Schlüssel verloren haben, wenn Sie ein neues Objekt beziehen (Sie wissen nie, wer noch Schlüssel hat), oder wenn der Zylinder mechanische Verschleißerscheinungen zeigt, z.B. wenn der Schlüssel hakt oder sich schwer drehen lässt. Auch veraltete Technik ohne modernen Aufbohr- und Ziehschutz sollte im Rahmen eines Sicherheitsupdates ersetzt werden.',
  },
  {
    question: 'Was ist der Unterschied zwischen einem Einsteckschloss und einem Zylinder?',
    answer: 'Das Einsteckschloss ist der mechanische Kasten, der in das Türblatt eingelassen ist und die Falle sowie den Riegel enthält. Der Profilzylinder (Schließzylinder) ist das Bauteil, in das Sie den Schlüssel stecken. Der Zylinder treibt das Einsteckschloss an. Oft ist nur der Zylinder defekt oder unsicher, während das Einsteckschloss intakt bleibt. Wir prüfen stets beide Komponenten unabhängig voneinander.',
  },
  {
    question: 'Wie funktioniert eine Mehrfachverriegelung?',
    answer: 'Normale Einsteckschlösser verriegeln die Tür an nur einem Punkt (mittig). Eine Mehrfachverriegelung nutzt ein durchgehendes Schienen-System über die gesamte Türhöhe und verriegelt zusätzlich oben und unten – oft mit massiven Schwenkhaken oder Bolzen. Dies erhöht den Widerstandswert gegen Aufhebeln der Tür enorm und ist bei modernen Haus- und Wohnungseingangstüren heute Stand der Technik.',
  },
  {
    question: 'Muss bei einer neuen Mehrfachverriegelung die ganze Tür getauscht werden?',
    answer: 'Nein, in den meisten Fällen nicht. Wir können viele bestehende Holz-, Kunststoff- oder Metalltüren mit einer modernen Mehrfachverriegelung nachrüsten, sofern die Substanz der Tür und der Zarge noch intakt ist. Das ist oft deutlich kosteneffizienter als ein kompletter Türaustausch und bietet dennoch eine massive Steigerung der Sicherheitsebene.',
  },
  {
    question: 'Welche Zertifizierungen sind für Türsicherheit relevant?',
    answer: 'Achten Sie auf DIN- und VdS-Zertifizierungen. Für Einsteckschlösser ist die DIN 18251 relevant, für Schließzylinder die DIN 18252 sowie VdS-Klassen. Schutzbeschläge sollten mindestens der DIN 18257 ES1 (besser ES2 oder ES3) entsprechen. Diese Normen garantieren einen geprüften Mindestwiderstand gegen gängige Einbruchswerkzeuge und Methoden wie Bohren, Ziehen und Picken.',
  },
  {
    question: 'Können Sie auch historische oder alte Türen absichern?',
    answer: 'Ja. Bei historischen Türen (z.B. im Altbau oder Denkmalschutz) ist Fingerspitzengefühl gefragt. Wir nutzen hier oft spezielle Kastenzusatzschlösser, Panzerriegel oder integrieren moderne Sicherheitstechnik unsichtbar in die bestehende Substanz, um den historischen Charakter der Tür vollständig zu erhalten und gleichzeitig ein modernes Sicherheitsniveau herzustellen.',
  }
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TuerUndSchliesstechnikPage({ params, searchParams }: Props) {
  // Await the required asynchronous APIs
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  // Provide harmless DOM bindings for Next.js 16 resolved params
  const paramBinding = resolvedParams.id ? resolvedParams.id : 'default';
  const searchBinding = resolvedSearchParams.q ? 'search-active' : 'default';

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <div data-param={paramBinding} data-search={searchBinding} className="hidden" aria-hidden />
      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Tür- und Schließtechnik'}
        lead={page?.subline ?? 'Die mechanische Sicherheit ist das Fundament jedes Gebäudeschutzes. Ohne solide Mechanik bleibt jede Alarm- und Videotechnik wirkungslos.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Tür- und Schließtechnik' }]}
        actions={
          <ButtonLink href={`/service-und-termin/anfrage?thema=${ROUTE}`} size="lg">
            Anfrage starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Architektur & Methodik (Expanded Content) */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Architektur & Methodik"
              title="Mechanischer Grundschutz als Fundament"
              lead={page?.intro ?? 'Einbruchschutz beginnt immer bei der Mechanik. Die solideste Tür bietet keinen Schutz, wenn Zylinder, Beschlag oder Schließblech Schwachstellen aufweisen. Unsere Methodik betrachtet die Tür stets als Gesamtsystem.'}
            />

            <div className="prose-sm24 mt-6">
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Der mechanische Grundschutz ist das absolute Fundament jeglicher Sicherheitsarchitektur. Einbrecher suchen den Weg des geringsten Widerstands. Wenn eine Tür nicht innerhalb weniger Minuten mit einfachen Werkzeugen zu überwinden ist, wird der Versuch in den allermeisten Fällen abgebrochen. Daher ist es unser primäres Ziel, durch die Kombination hochwertiger Komponenten den physischen Widerstandswert (Resistance Class) Ihrer Zugänge drastisch zu erhöhen.
              </p>
              <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Wir arbeiten nach dem Prinzip der geschlossenen Sicherheitskette. Ein Hochsicherheitszylinder ist nutzlos, wenn er weit übersteht und einfach abgebaut werden kann. Ein massives Einsteckschloss nützt wenig, wenn das Schließblech in der Zarge nur mit kurzen Schrauben im weichen Holz verankert ist. Deshalb analysieren wir stets das Zusammenspiel von Türblatt, Zarge, Bändern, Schloss, Zylinder und Beschlag.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Zylinder mit integriertem Aufbohr- und Kernziehschutz',
                  'Sicherheitsbeschläge mit Zylinderabdeckung (Schutzklasse ES2/ES3)',
                  'Einsteckschlösser mit gehärtetem Riegel',
                  'Schwerlast-Schließbleche mit Maueranker'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[oklch(0.52_0.24_260)]" />
                    <span className="text-[oklch(0.32_0.02_260)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 font-bold text-[oklch(0.16_0.02_260)]" style={{ fontSize: 'clamp(1.125rem, 1vw + 1rem, 1.25rem)' }}>{process.label}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint} Wir dokumentieren den Ist-Zustand und erarbeiten ein Konzept, das Sicherheitsanforderungen, Komfort und architektonische Gegebenheiten vereint.
              </p>
            </div>
          </div>

          <div className="relative">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Detailaufnahme eines demontierten Einsteckschlosses mit VdS-Zylinder und schwerem Schutzbeschlag',
                ratio: '4/3',
                note: 'Eigene Aufnahme aus einem Montageauftrag. Kein Stockfoto.',
              }}
            />
            {/* Swiss Light Decorative Element */}
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)]"></div>
          </div>
        </div>
      </Section>

      {/* Interactive Budget Calculator Module */}
      <Section className="py-16 md:py-24" id="kalkulator">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
             <SectionHeading
              eyebrow="Projektplanung"
              title="Transparente Investitionsplanung"
              lead="Mechanische Sicherheit ist eine nachhaltige Investition in den Schutz von Menschen und Werten. Nutzen Sie unseren Kalkulator, um sofort einen realistischen Preisrahmen für die Modernisierung Ihrer Tür- und Schließtechnik zu erhalten."
            />
            <div className="prose-sm24 mt-6 text-[oklch(0.32_0.02_260)]">
              <p>
                Die Kosten für die Nachrüstung oder Erneuerung von Sicherheitstechnik variieren stark je nach Ausgangslage und gewünschtem Schutzniveau. Der Kalkulator berücksichtigt die Materialkosten für Zylinder und Beschläge sowie den voraussichtlichen Montageaufwand.
              </p>
              <p className="mt-4">
                Beachten Sie, dass es sich hierbei um Richtwerte handelt. Ein exaktes Angebot erstellen wir nach einer Vor-Ort-Besichtigung, bei der wir die genauen Maße, Türstärken und baulichen Besonderheiten erfassen.
              </p>
            </div>
          </div>

          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* Leistungen im Bento-Grid */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Leistungen"
          title="Modulare Sicherheitskomponenten"
          lead="Wir bieten ein vollständiges Spektrum mechanischer Absicherung. Jede Komponente wird präzise auf die anderen abgestimmt, um Schwachstellen konsequent zu eliminieren."
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-[subgrid] gap-4">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? Wrench;
            return (
              <Link
                key={service.id}
                href={`/${ROUTE}/${service.slug}`}
                className="group flex flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.52_0.24_260)] hover:shadow-md h-full motion-reduce:transition-none motion-reduce:transform-none"
                style={{ viewTransitionName: `card-${service.id}` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)] transition-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none">
                  <Icon size={24} strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="mt-6 font-bold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors motion-reduce:transition-none" style={{ fontSize: 'clamp(1.125rem, 1vw + 1rem, 1.25rem)' }}>
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  {service.summary}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.015_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                  Details ansehen
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Detailwissen und Zertifizierungen */}
      <Section tight className="py-16">
        <div className="mx-auto max-w-3xl text-center">
           <SectionHeading
              align="center"
              eyebrow="Fachwissen"
              title="Geprüfte Qualität nach DIN und VdS"
              lead="Wir verbauen ausschließlich Komponenten, die strengen Normen entsprechen und deren Schutzwirkung unabhängig geprüft wurde."
            />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: 'VdS-Anerkennung', desc: 'Vertrauen der Sachversicherer in geprüfte Einbruchhemmung.' },
            { title: 'DIN 18252 / 18251', desc: 'Normen für Profilzylinder und Einsteckschlösser höchster Güte.' },
            { title: 'SKG-Zertifizierung', desc: 'Sterne-Klassifizierung für nachgewiesenen Widerstandswert.' }
          ].map((cert, idx) => (
             <div key={idx} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 text-center">
                <ShieldCheck size={32} className="mx-auto text-[oklch(0.52_0.24_260)]" strokeWidth={1.5} />
                <h4 className="mt-4 font-bold text-[oklch(0.16_0.02_260)]" style={{ fontSize: 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)' }}>{cert.title}</h4>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">{cert.desc}</p>
             </div>
          ))}
        </div>
      </Section>

      {/* Sachlicher Hinweis zur Flucht- und Rettungswegtechnik */}
      <Section tight>
        <Alert tone="info" title="Panik- und Fluchttürtechnik wird immer am Objekt geklärt">
          <p>
            Welche Ausführung an einer Tür zulässig und sinnvoll ist, ergibt sich aus dem konkreten
            Gebäude und seiner Nutzung. Wir sehen uns die vorhandene Situation an und stimmen
            Schloss, Beschlag und Zylinder darauf ab. Vorgaben aus Baugenehmigung, Brandschutz oder
            Versicherung sind vorab zu klären — dafür ist die Betreiberin oder der Betreiber des
            Gebäudes zuständig. Es gelten strikte Vorgaben nach DIN EN 179 und DIN EN 1125.
          </p>
          <p className="mt-3">
            <Link
              href={`/${ROUTE}/panik-und-fluchttuertechnik`}
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Panik- und Fluchttürtechnik ansehen
              <ArrowRight size={15} />
            </Link>
          </p>
        </Alert>
      </Section>

      {/* FAQ Sektion */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Expertenantworten zur Türsicherheit"
          lead="Die wichtigsten Antworten rund um Zylinder, Schlösser und mechanischen Einbruchschutz auf einen Blick."
          className="max-w-3xl"
        />
        <div className="mx-auto max-w-3xl mt-10">
          <Accordion items={FAQ} />
        </div>
      </Section>

      {/* Angrenzende Bereiche */}
      <Section tight>
        <SectionHeading
          eyebrow="Angrenzende Bereiche"
          title="Erweiterte Systemlösungen"
          lead="Tür- und Schließtechnik betrifft die einzelne Tür. Sobald mehrere Türen zusammen gedacht werden oder intelligente Zutrittsrechte gefordert sind, bieten wir spezialisierte Konzepte."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {RELATED_AREAS.map((area) => (
            <li key={area.href}>
              <Card className="h-full rounded-2xl border-[oklch(0.89_0.008_260/0.55)]">
                <CardBody className="flex h-full flex-col p-8">
                  <h4 className="font-bold text-[oklch(0.16_0.02_260)]" style={{ fontSize: 'clamp(1.0625rem, 0.5vw + 0.9375rem, 1.125rem)' }}>{area.label}</h4>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    {area.body}
                  </p>
                  <Link
                    href={area.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
                  >
                    Systemlösung ansehen
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tone="muted" tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-5 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-all hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)] hover:shadow-sm"
                >
                  {link.label}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
