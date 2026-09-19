import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  KeyRound,
  Layers,
  Package,
  ScanLine,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

import { getGuides, getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS, PROCESS_LABELS, QUICK_ENTRIES } from '@/lib/navigation';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema, faqSchema } from '@/components/seo/json-ld';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('');
  return {
    // Der Titel der Startseite trägt den Markennamen bereits selbst,
    // deshalb greift die Vorlage aus dem Wurzel-Layout hier nicht.
    title: { absolute: page?.seo.title ?? 'SCHLÜSSELMACHER24' },
    description: page?.seo.description,
    alternates: { canonical: '/' },
  };
}

const AREA_ICONS: Record<string, typeof KeyRound> = {
  autoschluessel: KeyRound,
  'schluessel-nach-vorlage': ScanLine,
  'schluessel-nach-code': Package,
  'gleichschliessende-zylinder': Layers,
  schliessanlagen: ClipboardList,
  'elektronische-zutrittsloesungen': ShieldCheck,
  'tuer-und-schliesstechnik': Wrench,
  sicherheitstechnik: ShieldCheck,
  'service-und-termin': CalendarClock,
};

const TRUST_POINTS = [
  {
    title: 'Fachbetrieb mit eigener Werkstatt',
    body: 'Die Arbeiten erfolgen im eigenen Betrieb mit den dafür vorgesehenen Maschinen — nicht unterwegs im Fahrzeug.',
  },
  {
    title: 'Erst prüfen, dann buchen',
    body: 'Wir sagen Ihnen vor der Terminbestätigung, was machbar ist und was es kostet. Keine Überraschung vor Ort.',
  },
  {
    title: 'Nachvollziehbare Abläufe',
    body: 'Jeder Vorgang bekommt eine Nummer. Den Stand können Sie jederzeit selbst abrufen.',
  },
  {
    title: 'Sichere Zahlung',
    body: 'Die Anzahlung wird vollständig auf den Gesamtpreis angerechnet. Beleg und Vorgang gehören zusammen.',
  },
];

export default async function HomePage() {
  const [page, settings, guides] = await Promise.all([
    getPageContent(''),
    getSettings(),
    getGuides(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const carKeySteps = [
    { title: 'Fahrzeug wählen', body: 'Marke, Modell, Baujahr und Schlüsselart.' },
    { title: 'Fotos hochladen', body: 'Schlüssel aus drei Richtungen und den Fahrzeugschein.' },
    { title: 'Preis oder Prüfung', body: 'Fester Preis, Preisrahmen oder Hinweis auf manuelle Prüfung.' },
    { title: 'Anzahlung', body: `Standard ${deposit}, wird voll angerechnet.` },
    { title: 'Termin buchen', body: `Frühester Termin nach etwa ${leadDays} Tagen Vorlauf.` },
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />
      <JsonLd data={faqSchema(guides.map((g) => ({ question: g.title, answer: g.excerpt })))} />

      {/* Einstieg */}
      <section className="border-b border-border bg-surface">
        <div className="shell grid gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-current" aria-hidden />
              Fachbetrieb für Schlüssel- und Schließtechnik
            </p>

            <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">Autoschlüssel, Schließtechnik und Sicherheitstechnik -
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {page?.subline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Fahrzeug auswählen und Termin starten
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/schluessel-nach-code" size="lg" variant="outline">
                Schlüssel nach Code bestellen
              </ButtonLink>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Anzahlung
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Vorlauf
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">
                  ca. {leadDays} Tage
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Versand
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">
                  deutschlandweit
                </dd>
              </div>
            </dl>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung',
              ratio: '4/3',
              note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto.',
            }}
          />
        </div>
      </section>

      {/* Schnelleinstiege */}
      <Section tight>
        <SectionHeading
          eyebrow="Schnelleinstieg"
          title="Wobei können wir helfen?"
          lead="Jeder Bereich hat einen klaren Ablauf — vom direkten Kauf bis zur Projektplanung."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ENTRIES.map((area) => {
            const Icon = AREA_ICONS[area.key] ?? KeyRound;
            return (
              <li key={area.key}>
                <Link
                  href={area.href}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {area.label}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {area.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground-subtle">
                    {PROCESS_LABELS[area.process].label}
                    <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Autoschlüssel-Ablauf */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Schwerpunkt Autoschlüssel"
              title="So läuft Ihr Autoschlüssel-Auftrag ab"
              lead="Fünf Schritte, mobil bedienbar. Sie geben nur die Daten an, die für Ihr Fahrzeug gebraucht werden."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/autoschluessel/anfrage">Ablauf starten</ButtonLink>
              <ButtonLink href="/autoschluessel" variant="outline">
                Alle Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <ol className="relative space-y-4 border-l border-border pl-7">
            {carKeySteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                >
                  {index + 1}
                </span>
                <p className="text-[15px] font-bold text-foreground">{step.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Vertrauen */}
      <Section>
        <SectionHeading
          eyebrow="Warum wir"
          title="Sachlich, nachvollziehbar, ohne Überraschungen"
          lead="Wir arbeiten wie ein Fachbetrieb, nicht wie ein Vermittler."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {TRUST_POINTS.map((point) => (
            <li key={point.title}>
              <Card className="h-full">
                <CardBody>
                  <p className="text-[15px] font-bold text-foreground">{point.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">{point.body}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Shop-Teaser */}
      <Section tone="muted" tight>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/schluessel-nach-code"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Direkt kaufen
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Schlüssel nach Code</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
              Codelinien ansehen
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/gleichschliessende-zylinder/konfigurator"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Direkt kaufen
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Gleichschließende Zylinder</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Mehrere Türen mit einem Schlüssel. Bauform, Maße und Schlüsselanzahl selbst
                zusammenstellen.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
              Zum Konfigurator
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </Section>

      {/* Projektbereiche */}
      <Section>
        <SectionHeading
          eyebrow="Projekte"
          title="Größere Vorhaben planen wir strukturiert"
          lead="Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik erfassen wir über geführte Konfiguratoren. Am Ende steht eine Zusammenfassung, aus der ein belastbares Angebot wird."
        />

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {NAV_AREAS.filter((a) =>
            ['schliessanlagen', 'elektronische-zutrittsloesungen', 'sicherheitstechnik'].includes(a.key),
          ).map((area) => (
            <li key={area.key}>
              <Card className="group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
                <CardBody className="flex flex-1 flex-col">
                  <p className="text-[15px] font-bold text-foreground">{area.label}</p>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                    {area.summary}
                  </p>
                  <Link
                    href={area.highlight?.href ?? area.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                  >
                    {area.highlight?.label ?? 'Mehr erfahren'}
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ratgeber */}
      <Section tone="muted" tight>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Ratgeber"
            title="Antworten auf die häufigsten Fragen"
            className="max-w-xl"
          />
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
          >
            Alle Beiträge
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <li key={guide.id}>
              <Link
                href={`/ratgeber/${guide.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {guide.title}
                </span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {guide.excerpt}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Lesen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
