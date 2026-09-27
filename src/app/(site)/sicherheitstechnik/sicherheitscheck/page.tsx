import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { Sicherheitscheck } from './sicherheitscheck';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

const ROUTE = 'sicherheitstechnik/sicherheitscheck';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitscheck — Bestandsaufnahme Ihres Objekts',
    description:
      page?.seo.description
      ?? 'Geführte Bestandsaufnahme in zehn Schritten: Objekt, Zugänge, Außenbereiche, vorhandene '
        + 'Technik, Schwerpunkte, Netz, Unterlagen, Rahmen und Kontakt.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Verwandte Bereiche am Seitenende — verlangte interne Verlinkung. */
const RELATED_LINKS = [
  { href: '/sicherheitstechnik', label: 'Alle Bereiche der Sicherheitstechnik' },
  { href: '/tuer-und-schliesstechnik', label: 'Mechanischer Grundschutz an der Tür' },
  { href: '/elektronische-zutrittsloesungen', label: 'Elektronische Zutrittslösungen' },
  { href: '/rechtliches/datenschutz', label: 'Hinweise zum Datenschutz' },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitscheckPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <PageHeader
        eyebrow="Sicherheitstechnik"
        title={page?.headline ?? 'Sicherheitscheck'}
        lead={
          page?.subline
          ?? 'Zehn Schritte zu Ihrem Objekt: Wir erfassen, was vorhanden ist und worauf es Ihnen '
            + 'ankommt. Am Ende steht eine Zusammenfassung, aus der wir eine Einschätzung machen.'
        }
        crumbs={[
          { href: '/sicherheitstechnik', label: 'Sicherheitstechnik' },
          { href: `/${ROUTE}`, label: 'Sicherheitscheck' },
        ]}
      >
        <div className="rounded-lg border border-border bg-surface-muted p-5">
          <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
            Ablauf
          </p>
          <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-foreground-muted">
            {process.hint} Ihr Zwischenstand wird im Browser gespeichert, damit Sie den Check
            unterbrechen und später fortsetzen können.
          </p>
        </div>
      </PageHeader>

      <div className="shell py-8 md:py-12">

      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Tiefgehende Analyse Ihrer Sicherheitsinfrastruktur"
          lead="Wir prüfen nicht nur einzelne Kameras, sondern das gesamte Zusammenspiel von Mechanik, Sensorik und Software-Management in Ihrem Gebäude."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Eine moderne Sicherheitsarchitektur erfordert einen ganzheitlichen Ansatz. Wir beginnen unsere Bestandsaufnahme mit einer präzisen Evaluierung des Ist-Zustands, bei der wir sämtliche Zugänge, mechanische Sicherungen und bereits vorhandene elektronische Systeme erfassen. Dieser Schritt ist essenziell, da isolierte Maßnahmen oft Sicherheitslücken aufweisen, die erst in der Gesamtschau sichtbar werden. Unsere Methodik basiert auf jahrzehntelanger Erfahrung im Objektmanagement und integriert neueste technologische Standards, um Ihnen ein Höchstmaß an Sicherheit zu gewährleisten. Wir analysieren Schwachstellen in Echtzeit und entwickeln maßgeschneiderte Lösungsansätze, die exakt auf die spezifischen Anforderungen Ihrer Immobilie zugeschnitten sind.
          </p>
          <p>
            Die Integration moderner Zutrittskontrollsysteme mit hochauflösender Videoüberwachung und intelligenten Alarmanlagen bildet das Fundament unserer Strategie. Wir legen besonderen Wert auf die nahtlose Kommunikation zwischen den verschiedenen Komponenten, um Fehlalarme zu minimieren und im Ernstfall eine schnelle Reaktionszeit sicherzustellen. Darüber hinaus berücksichtigen wir Aspekte der Cybersicherheit, um Ihre Netzwerkinfrastruktur gegen digitale Bedrohungen abzuhärten. Die ständige Weiterentwicklung unserer Analysewerkzeuge ermöglicht es uns, auch subtile Verwundbarkeiten aufzudecken und proaktiv zu beheben, bevor sie ausgenutzt werden können.
          </p>
          <p>
            Ein weiterer zentraler Bestandteil unseres Sicherheitschecks ist die Überprüfung der organisatorischen Prozesse. Wir analysieren, wer wann und wie Zugang zu sensiblen Bereichen hat, und helfen Ihnen bei der Implementierung robuster Richtlinien für das Identitäts- und Zugriffsmanagement. Durch regelmäßige Schulungen und Sensibilisierungsmaßnahmen für Ihre Mitarbeiter stellen wir sicher, dass das Sicherheitsbewusstsein auf allen Ebenen der Organisation verankert ist. Denn die beste Technik ist nur so effektiv wie die Menschen, die sie bedienen. Unsere ganzheitliche Betrachtungsweise garantiert, dass technische und menschliche Faktoren optimal ineinandergreifen, um ein Höchstmaß an Schutz zu erzielen.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Vergleich" title="Leistungsstufen im Überblick" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Basis-Check</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Fundierte Überprüfung mechanischer Grundsicherungen und der wichtigsten Zugangswege.</p>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              <li>✓ Mechanische Schließanlagen</li>
              <li>✓ Tür- und Fensterbeschläge</li>
              <li>✓ Basis-Zutrittskontrolle</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] ring-1 ring-[oklch(0.52_0.24_260)]">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Erweiterte Analyse</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Integration elektronischer Systeme und netzwerkbasierter Überwachung.</p>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              <li>✓ Videoüberwachungssysteme</li>
              <li>✓ Alarmanlagen-Check</li>
              <li>✓ Netzwerkintegrität</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Premium-Audit</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Ganzheitliche 360°-Prüfung inklusive Penetrationstests und IT-Sicherheit.</p>
            <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              <li>✓ Physischer Pentest</li>
              <li>✓ IT-Sicherheitsarchitektur</li>
              <li>✓ Compliance & Datenschutz</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="FAQ" title="Häufig gestellte Fragen (FAQ)" />
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">1. Wie lange dauert der Sicherheitscheck vor Ort?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Die Dauer hängt maßgeblich von der Größe und Komplexität Ihres Objekts ab. Für ein standardmäßiges Einfamilienhaus veranschlagen wir in der Regel etwa 2 bis 3 Stunden. Bei größeren Gewerbeobjekten oder komplexen Industrieanlagen kann die Bestandsaufnahme auch einen ganzen Arbeitstag in Anspruch nehmen. Wir legen großen Wert auf eine präzise und detailgenaue Erfassung, um eine valide Entscheidungsgrundlage für die spätere Planung zu schaffen.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">2. Welche Dokumente sollte ich für den Termin bereithalten?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Um den Prozess so effizient wie möglich zu gestalten, bitten wir Sie, aktuelle Grundrisspläne Ihres Gebäudes bereitzuhalten. Ebenfalls hilfreich sind Unterlagen zu bereits installierten Schließanlagen, Alarmsystemen oder Netzwerkinfrastrukturen (wie z. B. Wartungsprotokolle oder Installationsskizzen). Je mehr Informationen uns vorliegen, desto fundierter kann unsere Analyse erfolgen und desto präziser können wir spätere Lösungskonzepte auf Ihre Bedürfnisse zuschneiden.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">3. Werden während des Checks bauliche Veränderungen vorgenommen?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Nein, der Sicherheitscheck ist eine rein diagnostische Maßnahme. Wir führen eine rein visuelle und messtechnische Bestandsaufnahme durch, ohne in die Bausubstanz oder bestehende Systeme einzugreifen. Unser Ziel ist es, den aktuellen Zustand unvoreingenommen zu bewerten und Schwachstellen aufzuzeigen. Eventuelle bauliche Anpassungen oder Installationen erfolgen erst nach einer ausführlichen Beratung und Ihrer expliziten Freigabe im Rahmen der anschließenden Projektumsetzung.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">4. Ist der Zwischenstand im Browser wirklich sicher?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Ja, der Zwischenstand der geführten Bestandsaufnahme wird ausschließlich lokal im Speicher (LocalStorage) Ihres verwendeten Browsers abgelegt. Es findet keine automatische Übertragung dieser Zwischenergebnisse an unsere Server statt. Erst wenn Sie den Prozess vollständig abgeschlossen und das Formular aktiv absenden, werden die gesammelten Daten verschlüsselt an uns übermittelt. Wir empfehlen jedoch, den Check an einem privaten und geschützten Gerät durchzuführen.</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">5. Was passiert mit den Daten nach Abschluss der Analyse?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)]">Datenschutz und Diskretion haben bei uns höchste Priorität. Ihre Daten werden ausschließlich für die Erstellung des Sicherheitskonzepts und die anschließende Angebotserstellung verwendet. Grundrisse und objektbezogene Informationen werden auf besonders gesicherten Systemen gespeichert und unterliegen strengen Aufbewahrungsfristen (siehe unsere Hinweise zum Datenschutz). Nach Ablauf der gesetzlichen Aufbewahrungsfristen oder auf Ihren ausdrücklichen Wunsch hin werden alle sensiblen Projektdaten DSGVO-konform gelöscht.</p>
          </div>
        </div>
      </Section>

        <ServiceBudgetCalculator />
        <div className="mt-12" />
        <Sicherheitscheck
          retention={{
            floorPlans: settings.retentionDays.floorPlans,
            objectPhotos: settings.retentionDays.projectDocuments,
          }}
        />
      </div>

      <Section tone="muted" tight>
        <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
        <ul className="mt-6 flex flex-wrap gap-3">
          {RELATED_LINKS.map((link) => (
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
          </main>
    </>
  );
}
