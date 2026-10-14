import type { Metadata } from 'next';
import Link from 'next/link';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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


      {/* Budget-Kalkulator (Interaktives Modul) */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Planung"
          title="Kosten transparent kalkulieren"
          lead="Nutzen Sie unseren interaktiven Rechner, um einen ersten Richtwert für Ihr Projekt zu erhalten."
        />
        <div className="mt-8 max-w-xl mx-auto">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* Fachlicher Deep Dive */}
      <Section tight>
        <SectionHeading
          eyebrow="Methodik und Technologie"
          title="Unsere architektonische Herangehensweise"
          lead="Wir betrachten Sicherheit nicht isoliert, sondern als ganzheitliches System."
        />
        <div className="prose-sm24 mt-8">
          <h2>1. Fundamentale Sicherheitsprinzipien in der modernen Schließtechnik</h2>
          <p>
            In einer Zeit, in der physische und digitale Sicherheit zunehmend verschmelzen, ist ein rein mechanischer Ansatz oftmals nicht mehr ausreichend. Die moderne Schließtechnik erfordert ein tiefes Verständnis für komplexe architektonische Zusammenhänge, Materialwissenschaften und bei elektronischen Systemen auch für Kryptografie und Netzwerksicherheit. Unser Ansatz basiert auf der strikten Einhaltung der &quot;Defense in Depth&quot;-Strategie, bei der mehrere Sicherheitsebenen so kombiniert werden, dass der Ausfall oder die Überwindung einer einzelnen Ebene nicht zum vollständigen Systemversagen führt.
            Ein mechanischer Schließzylinder der höchsten Sicherheitsklasse bietet exzellenten Widerstand gegen zerstörende (Bohren, Ziehen, Fräsen) und zerstörungsfreie (Picking, Schlagschlüssel) Angriffsmethoden. Doch erst durch die Kombination mit einem soliden Schutzbeschlag, der den Zylinder bündig abdeckt, einem widerstandsfähigen Einsteckschloss und einem Schließblech, das fest im Mauerwerk verankert ist, entsteht eine echte Sicherheitsbarriere. Wir analysieren jede Komponente auf ihre spezifischen Schwachstellen und wählen Materialien und Bauformen, die optimal aufeinander abgestimmt sind.
          </p>

          <h2>2. Elektronische Zutrittskontrollsysteme (EAC) und Kryptografische Standards</h2>
          <p>
            Die Migration von rein mechanischen zu mechatronischen oder vollelktronischen Zutrittslösungen (Electronic Access Control - EAC) stellt völlig neue Anforderungen an die Sicherheitsarchitektur. Wir implementieren Systeme, die auf modernsten kryptografischen Verfahren basieren, insbesondere AES-128 oder AES-256 (Advanced Encryption Standard) für die sichere Datenübertragung zwischen Identmedium (z.B. RFID-Transponder, Smartphone via BLE/NFC) und Leseeinheit.
            Besondere Aufmerksamkeit widmen wir der Verhinderung von Replay-Attacken und Relay-Station-Angriffen (oft bei passiven Entry-Systemen in Fahrzeugen beobachtet). Durch den Einsatz von Challenge-Response-Authentifizierungsverfahren stellen wir sicher, dass jedes Funksignal einzigartig ist und ein abgefangener Code für einen Angreifer wertlos bleibt. Bei vernetzten Offline-Systemen (Data-on-Card) stellen wir durch kryptografisch gesicherte Zertifikatsketten sicher, dass Berechtigungsänderungen und Blacklists fälschungssicher und zeitnah an die Endgeräte (Zylinder, Beschläge) verteilt werden.
          </p>

          <h2>3. Integration und Skalierbarkeit von Schließanlagen</h2>
          <p>
            Die Planung einer komplexen Schließanlage – sei es ein Zentralschlosssystem für Mehrfamilienhäuser (Z-Anlage), eine Hauptschlüsselanlage (HS) für Schulen oder eine Generalhauptschlüsselanlage (GHS) für große Unternehmensstrukturen – erfordert eine präzise mathematische Modellierung des Schließplans. Wir nutzen hochentwickelte Algorithmen, um die Permutationen der Schließungen so zu berechnen, dass Überschneidungen (Ghost Keys) mathematisch ausgeschlossen sind.
            Zudem planen wir von Beginn an eine Skalierbarkeitsreserve ein. Jedes Unternehmen wächst, Abteilungen werden umstrukturiert, neue Gebäude kommen hinzu. Eine schlecht geplante Anlage ist nach wenigen Jahren &quot;voll&quot; und erfordert einen teuren Komplettaustausch. Unsere Architekturmatrizen stellen sicher, dass auch in zehn Jahren noch Zylinder und Schlüssel mit neuen, logisch getrennten Berechtigungen in das bestehende System integriert werden können, ohne die Integrität der Anlage zu gefährden.
          </p>

          <h2>4. Materialwissenschaftliche Aspekte in der Schlüsselfertigung</h2>
          <p>
            Die Lebensdauer und Zuverlässigkeit eines Schlüssels und des zugehörigen Zylinders hängen maßgeblich von den verwendeten Materialien ab. Wir setzen bei hochwertigen Kopien und Neuanfertigungen bevorzugt auf Neusilber (eine Legierung aus Kupfer, Nickel und Zink). Neusilber bietet gegenüber herkömmlichem Messing signifikante Vorteile: Es ist deutlich verschleißfester, bietet eine höhere Torsionsfestigkeit (wichtig gegen das Abbrechen im Schloss) und besitzt ausgezeichnete Gleiteigenschaften, was den Verschleiß der Stiftzuhaltungen im Zylinder minimiert.
            Beim Fräsen von Schlüsseln nach Code oder Vorlage arbeiten wir mit computergesteuerten CNC-Maschinen, die Toleranzen im Bereich von Hundertstelmillimetern einhalten. Ein zu tief gefräster Einschnitt kann dazu führen, dass der Stift nicht exakt an der Scherlinie positioniert wird, was das Schloss hakelig macht oder im schlimmsten Fall zum Blockieren führt. Unsere Kalibrierungsprozesse und die anschließende optische Inspektion garantieren, dass jede von uns gefertigte Kopie exakt den Spezifikationen des Originalherstellers entspricht.
          </p>

          <h2>5. Detaillierte FAQ zur Sicherheitstechnik</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Warum reicht ein Standardzylinder oft nicht aus?</h3>
              <p>Standardzylinder bieten oft nur rudimentären Schutz gegen Manipulationen. Kriminelle können diese mit einfachen Werkzeugen (Lockpicking) oder roher Gewalt in Sekunden überwinden. Ein Hochsicherheitszylinder integriert Bohr- und Ziehschutz sowie komplexe Profile, die illegale Kopien verhindern.</p>
            </div>
            <div>
              <h3 className="font-bold">Wie sicher sind elektronische Türschlösser im Vergleich zu mechanischen?</h3>
              <p>Beide Systeme haben spezifische Stärken. Elektronische Schlösser bieten Flexibilität (einfaches Sperren verlorener Schlüssel, Protokollierung), erfordern aber Absicherung gegen Cyber-Angriffe und eine verlässliche Stromversorgung. Mechanik ist unabhängig von Strom und Elektronik, aber bei Schlüsselverlust unflexibel. Oft ist ein hybrider Ansatz optimal.</p>
            </div>
            <div>
              <h3 className="font-bold">Was bedeutet VdS-Zertifizierung und warum ist sie wichtig?</h3>
              <p>Die VdS (Vertrauen durch Sicherheit) ist ein unabhängiges Prüfinstitut. VdS-zertifizierte Komponenten wurden unter realistischen Bedingungen auf ihre Widerstandsfähigkeit gegen Einbruchversuche getestet. Versicherungen verlangen oft VdS-zertifizierte Schließtechnik, um im Schadensfall vollen Versicherungsschutz zu gewähren.</p>
            </div>
            <div>
              <h3 className="font-bold">Wie oft sollte eine Schließanlage gewartet werden?</h3>
              <p>Für stark frequentierte Türen (z.B. Hauseingänge, Gewerbe) empfehlen wir eine jährliche Inspektion und Wartung mit speziellen, harzfreien Pflegesprays. Graphit oder herkömmliche Öle (wie WD-40) dürfen keinesfalls verwendet werden, da sie verkleben und den Zylinder dauerhaft beschädigen können.</p>
            </div>
            <div>
              <h3 className="font-bold">Was ist der Unterschied zwischen Einbruchhemmung und Einbruchsicherheit?</h3>
              <p>Absolute &quot;Sicherheit&quot; gibt es nicht, nur Zeit. Einbruchhemmende Komponenten sind nach Widerstandsklassen (RC - Resistance Class) genormt. Eine Tür der Klasse RC2 widersteht einem Gelegenheitstäter mit einfachen Werkzeugen für mindestens 3 Minuten. RC3 bietet Schutz für 5 Minuten gegen Täter mit Hebelwerkzeugen. Unser Ziel ist es, den Aufwand für den Täter so zu maximieren, dass er den Versuch abbricht.</p>
            </div>
          </div>
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
    </>
  );
}
