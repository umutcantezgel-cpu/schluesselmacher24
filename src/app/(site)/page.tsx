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
import { PROCESS_LABELS, QUICK_ENTRIES } from '@/lib/navigation';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';
import { FeatureGrid } from '@/components/ui/feature-grid';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('');
  return {
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


interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const [page, settings, guides] = await Promise.all([
    getPageContent(''),
    getSettings(),
    getGuides(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const carKeySteps = [
    { title: 'Fahrzeug wählen', body: 'Wählen Sie Marke, Modell, Baujahr und die benötigte Schlüsselart sorgfältig aus, um eine präzise Grundlage zu schaffen.' },
    { title: 'Fotos hochladen', body: 'Übermitteln Sie Bilder Ihres Schlüssels aus drei Richtungen sowie einen Scan oder ein klares Foto des Fahrzeugscheins.' },
    { title: 'Preis oder Prüfung', body: 'Erhalten Sie umgehend einen festen Preis, einen detaillierten Preisrahmen oder einen Hinweis auf eine notwendige manuelle Prüfung.' },
    { title: 'Anzahlung', body: `Leisten Sie eine Standard-Anzahlung in Höhe von ${deposit}, welche vollständig auf den späteren Gesamtpreis angerechnet wird.` },
    { title: 'Termin buchen', body: `Buchen Sie Ihren Wunschtermin. Bitte beachten Sie den Vorlauf von etwa ${leadDays} Tagen für eine optimale Einplanung.` },
  ];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd data={localBusinessSchema(settings)} />

      {/* Einstieg */}
      <section className="border-b border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">
        <div className="shell grid gap-10 py-16 md:py-24 lg:py-32 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow text-[oklch(0.32_0.02_260)]">
              <span className="h-px w-6 bg-current" aria-hidden />
              Fachbetrieb für Schlüssel- und Schließtechnik
            </p>

            <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.1] md:text-[3.5rem] text-[oklch(0.16_0.02_260)] tracking-tight">
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h1>

            <div className="mt-8 space-y-6 text-[1.125rem] leading-relaxed text-[oklch(0.32_0.02_260)]">
              <p>
                Willkommen bei SCHLÜSSELMACHER24, Ihrem kompetenten Partner für modernste Schließ- und Sicherheitstechnik.
                Wir haben uns darauf spezialisiert, verlorene oder defekte Autoschlüssel fachgerecht, schnell und sicher zu ersetzen.
                Unsere Expertise umfasst dabei nicht nur mechanische Fräsarbeiten auf hochpräzisen CNC-Maschinen, sondern auch die
                komplexe Programmierung von Transpondern und Wegfahrsperren für nahezu alle Fahrzeugmarken.
              </p>
              <p>
                In unserer eigenen Meisterwerkstatt verbinden wir traditionelles Handwerk mit modernster Diagnose-Software.
                Dies ermöglicht es uns, auch bei komplizierten elektronischen Zugangssystemen, wie Keyless-Go oder Smart-Keys,
                eine exakte Replikation nach Herstellervorgaben durchzuführen – oftmals deutlich schneller und kostengünstiger
                als in einer markengebundenen Vertragswerkstatt. Wir garantieren Ihnen dabei höchste Datensicherheit und Diskretion
                bei allen Codierungsvorgängen.
              </p>
              <p>
                Unsere Arbeitsweise zeichnet sich durch absolute Transparenz aus. Bevor wir tätig werden, prüfen wir Ihr Anliegen
                kostenfrei und unverbindlich. Sie erhalten von uns eine klare Preisstruktur ohne versteckte Kosten. Egal ob Sie
                einen Ersatzschlüssel benötigen, ein defektes Gehäuse reparieren lassen wollen oder eine umfassende Schließanlage
                für Ihr Unternehmen planen – wir stehen Ihnen mit Rat und Tat zur Seite. Verlassen Sie sich auf zertifizierte
                Qualität, langjährige Erfahrung und einen Kundenservice, der Sie in den Mittelpunkt stellt.
              </p>
            </div>

            <dl className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-10">
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] opacity-70">
                  Stationär
                </dt>
                <dd className="mt-1 font-display text-[1.125rem] font-bold text-[oklch(0.16_0.02_260)]">
                  Mönchengladbach
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] opacity-70">
                  Versand
                </dt>
                <dd className="mt-1 font-display text-[1.125rem] font-bold text-[oklch(0.16_0.02_260)]">
                  deutschlandweit
                </dd>
              </div>
            </dl>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung',
              ratio: '4/3',
              note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto. Sichtbare Präzisionsmaschinen.',
            }}
          />
        </div>
      </section>

      {/* Interactive Feature Grid Section */}
      <Section className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <div className="mb-10 max-w-3xl">
          <SectionHeading
            eyebrow="Technologische Exzellenz"
            title="Interaktive Leistungsübersicht"
            lead="Entdecken Sie unsere Kernkompetenzen. Durch unser dynamisches Leistungsspektrum bieten wir maßgeschneiderte Lösungen für private und gewerbliche Anforderungen. Klicken Sie auf 'Alle Features', um tiefer einzutauchen."
          />
        </div>
        <FeatureGrid />
      </Section>

      {/* Schnelleinstiege */}
      <Section tight className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Schnelleinstieg"
          title="Wobei können wir helfen?"
          lead="Jeder Bereich hat einen klaren Ablauf — vom direkten Kauf über unseren Webshop bis hin zur detaillierten Projektplanung für komplexe Schließanlagen. Wählen Sie Ihre Kategorie für spezifische Informationen."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ENTRIES.map((area) => {
            const Icon = AREA_ICONS[area.key] ?? KeyRound;
            return (
              <li key={area.key}>
                <Link
                  href={area.href}
                  className="group flex h-full flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 transition-all hover:border-[oklch(0.52_0.24_260)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)]">
                    <Icon size={24} aria-hidden strokeWidth={1.5} />
                  </span>
                  <span className="mt-5 block text-[1.125rem] font-bold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                    {area.label}
                  </span>
                  <span className="mt-2 block flex-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    {area.summary}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[oklch(0.52_0.015_260)] opacity-80">
                    {PROCESS_LABELS[area.process].label}
                    <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Autoschlüssel-Ablauf */}
      <Section tone="muted" className="py-16 md:py-24 bg-[oklch(0.968_0.004_260)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Schwerpunkt Autoschlüssel"
              title="Systematischer Ablauf für Ihren neuen Autoschlüssel"
              lead="Ein hochgradig optimierter, fünfstufiger Prozess garantiert maximale Effizienz. Unsere mobile Plattform leitet Sie durch die Datenerfassung – Sie geben nur exakt die Informationen an, die für Ihr spezifisches Fahrzeugmodell zwingend benötigt werden."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/autoschluessel/anfrage" className="bg-[oklch(0.52_0.24_260)] text-white hover:bg-[oklch(0.46_0.24_260)] rounded-xl px-6 py-3 font-semibold transition-all shadow-sm">
                Ablauf starten
              </ButtonLink>
              <ButtonLink href="/autoschluessel" variant="outline" className="rounded-xl px-6 py-3 font-semibold border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)] hover:bg-[oklch(0.988_0.002_260)]">
                Alle Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <ol className="relative space-y-8 border-l-2 border-[oklch(0.89_0.008_260/0.55)] pl-8 ml-4">
            {carKeySteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[43px] flex h-9 w-9 items-center justify-center rounded-full border-2 border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] font-display text-[14px] font-bold text-[oklch(0.52_0.24_260)] shadow-sm"
                >
                  {index + 1}
                </span>
                <p className="text-[1.125rem] font-bold text-[oklch(0.16_0.02_260)]">{step.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* FAQ / Ratgeber */}
      <Section className="py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Ratgeber & FAQ"
            title="Fundiertes Fachwissen zu Ihren häufigsten Fragen"
            lead="Wir teilen unser Know-how. Erfahren Sie technische Details, rechtliche Rahmenbedingungen und praktische Tipps rund um Schlüssel, Schließanlagen und Sicherheitstechnik."
            className="max-w-2xl"
          />
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
          >
            Zum Ratgeber wechseln
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {guides.slice(0, 3).map((guide) => (
            <Link
              key={guide.id}
              href={`/ratgeber/${guide.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 transition-all hover:border-[oklch(0.52_0.24_260)] shadow-sm hover:shadow-md"
            >
              <span className="text-[1.125rem] font-bold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                {guide.title}
              </span>
              <span className="mt-3 flex-1 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {guide.excerpt}
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[oklch(0.52_0.24_260)]">
                Beitrag lesen
                <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 md:p-12">
          <h3 className="text-2xl font-bold text-[oklch(0.16_0.02_260)] mb-8">Häufig gestellte Fragen (FAQ)</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-[1.125rem] font-semibold text-[oklch(0.16_0.02_260)]">Muss ich mit meinem Auto zwingend bei Ihnen vor Ort vorbeikommen?</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Für die Codierung der Wegfahrsperre und der Fernbedienung ist es in den meisten Fällen notwendig, dass das Fahrzeug physisch bei uns in der Werkstatt ist, da die Programmierung über die OBD-Schnittstelle des Autos erfolgt. Bei reinen mechanischen Kopien nach Code reicht oft der Versand.
              </p>
            </div>
            <div className="h-px bg-[oklch(0.89_0.008_260/0.55)] w-full" />
            <div>
              <h4 className="text-[1.125rem] font-semibold text-[oklch(0.16_0.02_260)]">Wie lange dauert die Anfertigung eines neuen Autoschlüssels?</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Wenn wir den entsprechenden Schlüsselrohling auf Lager haben – was bei ca. 95% der gängigen Modelle der Fall ist – dauert das Fräsen und Programmieren vor Ort in der Regel zwischen 30 und 60 Minuten.
              </p>
            </div>
            <div className="h-px bg-[oklch(0.89_0.008_260/0.55)] w-full" />
            <div>
              <h4 className="text-[1.125rem] font-semibold text-[oklch(0.16_0.02_260)]">Was benötige ich, um einen Schlüssel nachmachen zu lassen?</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Aus Sicherheitsgründen benötigen wir zwingend Ihren Personalausweis sowie die Zulassungsbescheinigung Teil I (Fahrzeugschein), um sicherzustellen, dass Sie berechtigt sind, einen Schlüssel für dieses Fahrzeug anfertigen zu lassen.
              </p>
            </div>
            <div className="h-px bg-[oklch(0.89_0.008_260/0.55)] w-full" />
            <div>
              <h4 className="text-[1.125rem] font-semibold text-[oklch(0.16_0.02_260)]">Können Sie auch Keyless-Go-Schlüssel programmieren?</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Ja, unsere moderne Diagnosesoftware erlaubt uns die Programmierung von hochkomplexen Smart-Keys und Keyless-Go-Systemen für eine Vielzahl von Herstellern, inklusive der Neusynchronisation mit den Steuergeräten.
              </p>
            </div>
            <div className="h-px bg-[oklch(0.89_0.008_260/0.55)] w-full" />
            <div>
              <h4 className="text-[1.125rem] font-semibold text-[oklch(0.16_0.02_260)]">Mein Schlüsselgehäuse ist defekt, die Elektronik funktioniert aber noch. Was tun?</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                In diesem Fall bieten wir eine kostengünstige Reparatur an. Wir transplantieren die intakte Platine und den Transponder sorgfältig in ein neues, hochwertiges Gehäuse und fräsen den Schlüsselbart bei Bedarf neu.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
