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
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';
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

      {/* Methodik und Architektur */}
      <Section tight>
        <div className="mx-auto max-w-4xl space-y-12 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] md:p-12">
          <header className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] md:text-4xl">
              Architektonische Methodik & Technologische Infrastruktur
            </h2>
            <p className="text-lg leading-relaxed text-[oklch(0.32_0.02_260)]">
              Unsere Sicherheitslösungen basieren auf einer modularen, zukunftssicheren Architektur,
              die es uns ermöglicht, von der einfachen Schließanlage bis zum komplexen, vernetzten
              Zutrittssystem alles präzise abzubilden. Wir betrachten Gebäude nicht als eine Ansammlung
              von Türen, sondern als dynamische Ökosysteme.
            </p>
          </header>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">
                Das Prinzip der tiefen Integration
              </h3>
              <p className="leading-relaxed text-[oklch(0.32_0.02_260)]">
                Ein physischer Schlüssel oder ein RFID-Transponder ist lediglich das Interface zu einem
                hochkomplexen Berechtigungssystem. Bei der Planung einer Schließanlage beginnen wir mit
                einer umfassenden Bedrohungs- und Nutzungsanalyse. Wir definieren Sicherheitszonen,
                Zugriffsebenen und Eskalationspfade. Durch die Kombination von mechanischen Hochsicherheitszylindern
                für die Außenhülle und mechatronischen Komponenten für interne Barrieren erreichen wir ein
                optimum an Sicherheit und Flexibilität.
              </p>
              <p className="leading-relaxed text-[oklch(0.32_0.02_260)]">
                Jedes Projekt wird durchgängig digital dokumentiert. Dies beginnt beim Aufmaß mit digitalen
                Tools und endet bei der verschlüsselten Hinterlegung der Schließpläne in unseren sicheren
                Datenbanken. Sollte eine Erweiterung der Anlage notwendig werden, können wir jederzeit auf
                die exakten Parameter der Erstinstallation zurückgreifen und nahtlos anknüpfen.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">
                Leistungsstufen und Skalierbarkeit
              </h3>
              <p className="leading-relaxed text-[oklch(0.32_0.02_260)]">
                Wir differenzieren unsere Lösungen in drei primäre Leistungsstufen, die sich nach dem
                individuellen Risikoprofil und den betrieblichen Anforderungen richten:
              </p>
              <ul className="list-inside list-disc space-y-2 text-[oklch(0.32_0.02_260)]">
                <li>
                  <strong className="font-semibold text-[oklch(0.16_0.02_260)]">Level 1 - Mechanische Grundsicherung:</strong>{' '}
                  Einsatz zertifizierter Wendeschlüsselsysteme mit technischem und rechtlichem Kopierschutz.
                  Ideal für kleine bis mittlere Wohnkomplexe und grundlegende gewerbliche Anforderungen.
                </li>
                <li>
                  <strong className="font-semibold text-[oklch(0.16_0.02_260)]">Level 2 - Mechatronische Hybridsysteme:</strong>{' '}
                  Kombination aus mechanischer Verriegelung und elektronischer Verifikation. Ermöglicht die
                  zeitliche Befristung von Zutrittsrechten und die lückenlose Protokollierung von Zutrittsereignissen.
                </li>
                <li>
                  <strong className="font-semibold text-[oklch(0.16_0.02_260)]">Level 3 - Enterprise Access Management:</strong>{' '}
                  Vollständig vernetzte Online-Systeme mit Echtzeit-Kontrolle. Integration in bestehende
                  IT-Infrastrukturen, Active Directory Anbindung und dynamisches Berechtigungsmanagement über
                  verschlüsselte Cloud-Plattformen.
                </li>
              </ul>
              <p className="leading-relaxed text-[oklch(0.32_0.02_260)]">
                Unsere Systeme sind inhärent skalierbar konzipiert. Ein mechanisches Basis-System kann
                zu einem späteren Zeitpunkt problemlos durch elektronische Komponenten ergänzt werden,
                ohne dass die gesamte Anlage ausgetauscht werden muss (Retrofitting).
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">
                Vergleichsmatrix: Sicherheitstechnologien im Überblick
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)]">
                    <tr>
                      <th className="pb-3 pr-4 font-semibold">Technologie</th>
                      <th className="pb-3 pr-4 font-semibold">Rechteentzug</th>
                      <th className="pb-3 pr-4 font-semibold">Protokollierung</th>
                      <th className="pb-3 pr-4 font-semibold">Wartungsaufwand</th>
                      <th className="pb-3 font-semibold">Initiale Kosten</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.32_0.02_260)]">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[oklch(0.16_0.02_260)]">Rein mechanisch</td>
                      <td className="py-3 pr-4">Zylindertausch nötig</td>
                      <td className="py-3 pr-4">Nicht möglich</td>
                      <td className="py-3 pr-4">Sehr gering</td>
                      <td className="py-3">Niedrig</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[oklch(0.16_0.02_260)]">Offline elektronisch</td>
                      <td className="py-3 pr-4">Mit Masterkarte vor Ort</td>
                      <td className="py-3 pr-4">Lokal auslesbar</td>
                      <td className="py-3 pr-4">Mittel (Batterien)</td>
                      <td className="py-3">Mittel</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[oklch(0.16_0.02_260)]">Online / Cloud</td>
                      <td className="py-3 pr-4">Echtzeit (Remote)</td>
                      <td className="py-3 pr-4">Echtzeit-Dashboard</td>
                      <td className="py-3 pr-4">Mittel</td>
                      <td className="py-3">Hoch</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
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

      {/* Interaktiver Kalkulator */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <EnterpriseRoiCalculator />
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

      {/* Fachspezifischer FAQ-Abschnitt */}
      <Section>
        <SectionHeading
          eyebrow="Häufig gestellte Fragen"
          title="Expertenantworten zu unseren Sicherheitslösungen"
          lead="Detaillierte Einblicke in technische Details, Prozesse und Sicherheitsstandards."
        />

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">
              1. Welche Zertifizierungen müssen mechanische Hochsicherheitszylinder erfüllen?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Hochsicherheitszylinder in unseren Enterprise-Anlagen entsprechen zwingend der DIN EN 1303 sowie
              der DIN 18252. Diese Normen definieren strenge Anforderungen an den Verschlusssicherheitszylinder,
              insbesondere im Hinblick auf den Widerstand gegen Aufbohren, Ziehen und Picking. Darüber hinaus
              setzen wir auf Systeme mit VdS-Anerkennung, oft in der Klasse B oder C. Dies gewährleistet einen
              geprüften Einbruchschutz, der auch den strengen Richtlinien von Sachversicherern standhält.
              Zusätzlich implementieren wir einen patentrechtlichen Schlüsselschutz, der das unautorisierte
              Kopieren von Schlüsseln mittels 3D-Druck oder herkömmlichen Fräsmaschinen technologisch und
              rechtlich unterbindet.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">
              2. Wie wird der Ausfall elektronischer Schließsysteme bei Stromverlust verhindert?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Elektronische Zutrittskontrollsysteme sind auf maximale Resilienz ausgelegt. Bei offline- und
              mechatronischen Systemen (z. B. elektronische Zylinder oder smarte Türbeschläge) erfolgt die
              Energieversorgung über dezentrale, hochleistungsfähige Lithium-Batterien direkt in der Komponente,
              sodass die Schließfunktion vollkommen unabhängig vom Gebäudestromnetz bleibt. Die Batterielaufzeiten
              betragen oft mehrere Jahre (bis zu 100.000 Schließzyklen). Online-Systeme (Wandleser) verfügen über
              integrierte USV-Anlagen (Unterbrechungsfreie Stromversorgung) im Steuergerät. Bei einem totalen
              Netzausfall wird die Funktionalität für mehrere Stunden aufrechterhalten. Zudem lassen sich
              Fail-Secure (im stromlosen Zustand verriegelt, für Außentüren) und Fail-Safe (im stromlosen
              Zustand entriegelt, für Fluchtwege) Szenarien präzise nach den Vorgaben des Brandschutzkonzepts
              konfigurieren.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">
              3. Lassen sich bestehende mechanische Anlagen in smarte Systeme integrieren?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Ja, die schrittweise Migration (Retrofitting) ist ein zentraler Bestandteil unserer Methodik.
              Wir nutzen mechatronische Schließzylinder, die exakt in die bestehenden Europrofil-Aussparungen
              mechanischer Schlösser passen. Der Austausch erfolgt ohne Bohrungen oder Änderungen an der Türsubstanz.
              Dadurch können hochfrequentierte Zonen (z. B. Haupteingang, Serverraum) elektronisch mit
              Echtzeit-Protokollierung und temporären Zugangsrechten aufgerüstet werden, während weniger
              kritische Innentüren im selben Gebäude weiterhin über das etablierte mechanische
              Wendeschlüsselsystem bedient werden. Wir können sogar Hybrid-Schlüssel programmieren, die
              sowohl eine mechanische Fräsung für die Bestandsanlage als auch einen integrierten RFID-Chip
              für die neuen elektronischen Zylinder enthalten.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">
              4. Wie läuft der Prozess von der Analyse bis zur Inbetriebnahme einer Enterprise-Anlage ab?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Der Prozess gliedert sich in fünf deterministische Phasen.
              <strong>Phase 1: Auditing.</strong> Wir analysieren die baulichen Gegebenheiten, das bestehende
              Brandschutzkonzept und die organisatorische Struktur des Unternehmens.
              <strong>Phase 2: Architektur-Design.</strong> Entwicklung eines hierarchischen Schließplans und
              eines Zonen-Modells.
              <strong>Phase 3: Digitales Aufmaß.</strong> Präzise Vermessung aller Türstärken, Dornmaße und
              Beschlagsarten.
              <strong>Phase 4: Fertigung & Bereitstellung.</strong> Die Komponenten werden bestellt, codiert
              und in unserer Werkstatt vorkonfiguriert.
              <strong>Phase 5: Rollout & Schulung.</strong> Die physische Installation erfolgt durch unser
              zertifiziertes Personal. Abschließend integrieren wir die Software in Ihre IT und schulen die
              zuständigen Administratoren im Umgang mit der Verwaltungssoftware und der Rechtevergabe.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">
              5. Welche Daten werden bei Cloud-basierten Schließanlagen erfasst und wo werden diese gespeichert?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Cloud-basierte Zutrittskontrollsysteme protokollieren standardmäßig die UUID des Transponders,
              den Zeitstempel des Zugriffs und den spezifischen Zugangspunkt (Zylinder/Leser). Bei
              Fehlversuchen (z. B. unautorisierter Transponder) wird zudem der Grund der Abweisung protokolliert.
              Wir setzen ausschließlich auf Enterprise-Lösungen (wie z.B. von Salto, SimonsVoss oder Assa Abloy),
              welche eine End-to-End-Verschlüsselung (AES-256) der Übertragungswege nutzen. Die Daten werden
              in ISO-27001-zertifizierten Rechenzentren innerhalb der Europäischen Union gehostet, um eine
              strikte DSGVO-Konformität zu gewährleisten. Administratoren können Rollen- und Rechtekonzepte
              so konfigurieren, dass Protokolle automatisch nach einer definierten Frist überschrieben werden
              und sensible Daten im Einklang mit betrieblichen Datenschutzvereinbarungen verarbeitet werden.
            </p>
          </div>
        </div>
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
