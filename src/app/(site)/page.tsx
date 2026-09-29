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
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';
import { SpatialBentoGrid } from '@/components/showcase/spatial-bento-grid';

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

interface Props {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ params, searchParams }: Props) {
  await params;
  await searchParams;
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

      {/* Einstieg */}
      <section className="border-b border-border bg-surface">
        <div className="shell grid gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-current" aria-hidden />
              Fachbetrieb für Schlüssel- und Schließtechnik
            </p>

            <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">
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
                    {area.highlight?.label ?? `${area.label} entdecken`}
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
            Zum Ratgeber wechseln
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
                  Beitrag lesen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Erweiterte Expertise und Fachmethodik */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Tiefgreifende Sicherheitstechnologie"
          title="Unsere architektonische Methodik für kompromisslose Sicherheit"
          lead="Erfahren Sie im Detail, wie wir komplexe Sicherheitsanforderungen analysieren, konzipieren und mit modernster Schließ- und Zutrittstechnik realisieren."
        />

        <div className="mt-12 text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6 max-w-4xl">
          <p>
            Die Konzeption einer modernen Schließanlage oder eines elektronischen Zutrittskontrollsystems geht weit über die bloße Installation von Hardware hinaus. Es erfordert eine tiefgehende architektonische Methodik, die physische Sicherheitsaspekte mit organisatorischen Abläufen und modernster Technologie nahtlos verbindet. Unsere Vorgehensweise basiert auf jahrzehntelanger Expertise und einer strengen Orientierung an aktuellen Sicherheitsnormen wie der DIN EN 1627. Wir verstehen uns nicht nur als Errichter, sondern als Systemarchitekten für Ihre Sicherheit.
          </p>
          <p>
            Der erste Schritt unserer Methodik ist stets eine umfassende Schwachstellenanalyse vor Ort. Hierbei evaluieren wir nicht nur die offensichtlichen Zugänge, sondern auch potenzielle sekundäre Angriffsvektoren. Diese holistische Betrachtungsweise ermöglicht es uns, ein maßgeschneidertes Sicherheitskonzept zu entwickeln, das genau auf die spezifischen Risikoprofile Ihres Objekts abgestimmt ist. Dabei berücksichtigen wir sowohl mechanische Grundabsicherungen als auch mechatronische und volllelektronische Erweiterungen.
          </p>
          <p>
            Ein Kernaspekt unserer Philosophie ist die Herstellerunabhängigkeit. Anstatt uns auf ein einzelnes System zu beschränken, greifen wir auf ein breites Portfolio an Spitzenprodukten der führenden Hersteller zurück. Dies erlaubt es uns, für jede spezifische Anforderung – sei es maximale Skalierbarkeit für ein wachsendes Unternehmen, höchste Widerstandsklassen für sensible Bereiche oder nahtlose Integration in bestehende Smart-Building-Infrastrukturen – die exakt passende Lösung zu implementieren. Wir evaluieren kontinuierlich neue Technologien am Markt und integrieren diese in unsere Planungen, sofern sie unseren strengen Qualitäts- und Sicherheitskriterien entsprechen.
          </p>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Strukturierte Leistungsstufen und Integration</h3>
          <p>
            Unsere Implementierungsprojekte sind in klar definierte Leistungsstufen unterteilt, um maximale Transparenz und Effizienz zu gewährleisten.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Phase 1: Audit & Bedarfsermittlung:</strong> Detaillierte Aufnahme des Ist-Zustandes, Definition der Schutzziele und Erstellung eines ersten Anforderungsprofils.</li>
            <li><strong>Phase 2: Konzeption & Schließplangestaltung:</strong> Entwicklung der logischen Schließhierarchien, Auswahl der passenden Technologien (mechanisch, mechatronisch, elektronisch) und Erstellung des detaillierten Schließplans.</li>
            <li><strong>Phase 3: Installation & Parametrierung:</strong> Fachgerechte Montage durch zertifizierte Techniker, Konfiguration der elektronischen Komponenten und Integration in übergeordnete Managementsysteme.</li>
            <li><strong>Phase 4: Schulung & Übergabe:</strong> Umfassende Einweisung der Administratoren und Nutzer sowie Übergabe der vollständigen Anlagendokumentation.</li>
            <li><strong>Phase 5: Lifecycle Management:</strong> Kontinuierliche Wartung, regelmäßige Updates und schnelle Anpassungen bei organisatorischen Veränderungen.</li>
          </ul>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Vergleichsmatrix: Mechanik vs. Elektronik</h3>
          <div className="overflow-x-auto mt-6 border border-[oklch(0.89_0.008_260/0.55)] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[oklch(0.968_0.004_260)] border-b border-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Kriterium</th>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Anlagen</th>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Zutrittskontrolle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="p-4 font-medium">Flexibilität bei Schlüsselverlust</td>
                  <td className="p-4">Gering (Zylindertausch oft nötig)</td>
                  <td className="p-4">Sehr hoch (Einfaches Sperren des Mediums)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Zeitliche Zutrittssteuerung</td>
                  <td className="p-4">Nicht möglich</td>
                  <td className="p-4">Uneingeschränkt möglich</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Protokollierung</td>
                  <td className="p-4">Nicht möglich</td>
                  <td className="p-4">Umfassend (Wer, wann, wo)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Initialkosten</td>
                  <td className="p-4">Geringer</td>
                  <td className="p-4">Höher</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Skalierbarkeit</td>
                  <td className="p-4">Begrenzt durch Profilberechnungen</td>
                  <td className="p-4">Nahezu unbegrenzt</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Häufig gestellte Fragen (FAQ) zur Sicherheitstechnik</h3>
          <div className="space-y-6 mt-6">
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Wie lange dauert die Planung und Installation einer neuen Schließanlage?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Die Dauer hängt stark von der Komplexität und Größe des Objekts ab. Eine grundlegende mechanische Anlage für ein Mehrfamilienhaus kann oft innerhalb von 2-3 Wochen nach Auftragserklärung realisiert werden. Komplexe elektronische Systeme für Unternehmensstandorte benötigen in der Regel 4-8 Wochen für eine sorgfältige Planung, Komponentenbeschaffung und Installation.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Können bestehende mechanische Türen mit elektronischen Komponenten nachgerüstet werden?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Ja, in den allermeisten Fällen ist eine Nachrüstung problemlos möglich. Wir nutzen hierfür häufig mechatronische Schließzylinder oder elektronische Türbeschläge, die ohne aufwändige Verkabelung direkt gegen die bestehenden mechanischen Komponenten ausgetauscht werden können. Dies ist besonders bei Bestandsgebäuden oder denkmalgeschützten Immobilien eine sehr effiziente Lösung.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Was passiert bei einem Stromausfall mit meiner elektronischen Zutrittskontrolle?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Moderne elektronische Zylinder und Beschläge sind in der Regel batteriebetrieben und funktionieren völlig unabhängig vom Stromnetz des Gebäudes. Bei vernetzten Online-Systemen mit Wandlesern sorgen integrierte Notstromakkus dafür, dass die Funktion auch bei einem Stromausfall für einen definierten Zeitraum aufrechterhalten bleibt. Flucht- und Rettungswege sind durch entsprechende Panikschlösser ohnehin jederzeit mechanisch von innen zu öffnen.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Wie sicher sind elektronische Transponder gegen Kopieren?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Wir setzen ausschließlich auf hochsichere, verschlüsselte RFID-Technologien (wie MIFARE DESFire EV2/EV3 oder LEGIC Advant). Diese Systeme nutzen komplexe kryptografische Verfahren, die ein einfaches Auslesen oder Kopieren, wie es bei älteren 125kHz-Systemen möglich war, effektiv verhindern. Die Sicherheit entspricht modernsten IT-Standards.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Übernehmen Sie auch die Wartung von Fremdanlagen?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Nach einer vorherigen technischen Prüfung und Systemaufnahme übernehmen wir häufig auch den Service und die Wartung für Anlagen, die nicht ursprünglich von uns installiert wurden. Voraussetzung ist, dass die Systeme unseren Qualitäts- und Sicherheitsstandards entsprechen und wir als Fachpartner vom jeweiligen Hersteller autorisiert sind, Ersatzteile zu beziehen und tiefgreifende Konfigurationen vorzunehmen.</p>
            </div>
          </div>
        </div>

        <SpatialBentoGrid />
      </Section>
    </>
  );
}
