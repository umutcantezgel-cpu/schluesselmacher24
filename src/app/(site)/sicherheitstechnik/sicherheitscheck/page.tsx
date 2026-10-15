import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { Sicherheitscheck } from './sicherheitscheck';
import { SecurityCheckCalculator } from '@/components/calculator/security-check-calculator';

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

export default async function SicherheitscheckPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
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
        <Sicherheitscheck
          retention={{
            floorPlans: settings.retentionDays.floorPlans,
            objectPhotos: settings.retentionDays.projectDocuments,
          }}
        />

        <SecurityCheckCalculator />
      </div>

      <Section>
        <SectionHeading
          title="Warum ein professioneller Sicherheitscheck entscheidend ist"
          lead="Die architektonische Methodik unserer Bestandsaufnahme"
        />
        <div className="mt-8 prose-sm24 text-[oklch(0.32_0.02_260)] leading-relaxed max-w-4xl">
          <p>Ein fundierter Sicherheitscheck bildet das absolute Fundament für jede seriöse sicherheitstechnische Planung. In der modernen Gebäudesicherheit reicht es längst nicht mehr aus, punktuell auf vermeintliche Schwachstellen zu reagieren. Stattdessen erfordert die komplexe Bedrohungslage unserer Zeit einen ganzheitlichen, methodisch durchdachten Ansatz. Unsere Bestandsaufnahme folgt strengen architektonischen Prinzipien, um eine lückenlose Analyse Ihres Objekts zu gewährleisten.</p>

          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold text-xl mt-8 mb-4">Die Methodik der konzentrischen Sicherheitsringe</h3>
          <p>Unsere Analyse basiert auf dem bewährten Prinzip der konzentrischen Sicherheitsringe. Dies bedeutet, dass wir den Schutz Ihres Objekts nicht als einzelne Barriere betrachten, sondern als ein System ineinandergreifender Schutzschichten. Der äußerste Ring umfasst die Grundstücksgrenze und die Peripherie. Hier evaluieren wir Zäune, Tore, Beleuchtungssysteme und die natürliche Überwachung durch die Umgebung. Der zweite Ring konzentriert sich auf die Außenhaut des Gebäudes – Fassaden, Fenster, Türen und Lichtschächte. Der innerste Ring schließlich widmet sich den sensibelsten Bereichen innerhalb des Objekts, wie Tresorräumen, Serverräumen oder privaten Rückzugsorten.</p>
          <p>Durch diese systematische Schichtung stellen wir sicher, dass ein potenzieller Angreifer nicht nur eine, sondern mehrere voneinander unabhängige Hürden überwinden muss. Dies erhöht nicht nur den physischen Widerstand, sondern auch die Entdeckungswahrscheinlichkeit erheblich. Jeder Ring wird dabei mit modernster Sensorik und robuster Mechanik ausgestattet, um eine lückenlose Überwachungskette zu etablieren.</p>

          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold text-xl mt-8 mb-4">Technologische und mechanische Symbiose</h3>
          <p>Die effektivste Sicherheitslösung entsteht an der Schnittstelle von robuster Mechanik und intelligenter Elektronik. Bei unserem Sicherheitscheck analysieren wir präzise, wie diese beiden Welten in Ihrem spezifischen Fall optimal zusammenwirken können. Eine massive einbruchhemmende Tür (Widerstandsklasse RC3 oder höher) bietet exzellenten physischen Schutz. Kombiniert man diese jedoch mit einer mechatronischen Schließanlage und verdeckten Magnetkontakten, entsteht ein hochintelligentes Zugangssystem, das nicht nur unbefugten Zutritt physisch verhindert, sondern auch jeden Öffnungsversuch manipulationssicher protokolliert und in Echtzeit an ein Gefahrenmanagementsystem meldet.</p>

          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold text-xl mt-8 mb-4">Leistungsstufen und Schutzklassen</h3>
          <p>Um Ihnen maximale Transparenz zu bieten, strukturieren wir unsere Empfehlungen nach klar definierten Leistungsstufen, die sich an den europäischen Normen (DIN EN 1627-1630) orientieren:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Basisschutz (RC2):</strong> Ausreichend für durchschnittliches Risiko. Umfasst Pilzkopfverriegelungen, einbruchhemmende Verglasung und grundlegende mechanische Sicherungen.</li>
            <li><strong>Erweiterter Schutz (RC3):</strong> Empfohlen für Objekte mit erhöhtem Gefährdungspotenzial. Beinhaltet verstärkte Beschläge, massive Schließbleche und erweiterte elektronische Überwachungskomponenten.</li>
            <li><strong>Hochsicherheit (RC4 und höher):</strong> Notwendig für extrem sensible Bereiche wie Juweliere, Banken oder hochgefährdete Privatanwesen. Erfordert Spezialtüren, ballistischen Schutz und komplexe, redundante Alarmsysteme.</li>
          </ul>

          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold text-xl mt-8 mb-4">Detaillierte Schwachstellenanalyse</h3>
          <p>Ein Kernbestandteil unseres Sicherheitschecks ist die forensische Schwachstellenanalyse. Wir betrachten Ihr Objekt aus der Perspektive potenzieller Täter (Red-Teaming-Ansatz). Wie verhält sich die Gebäudestruktur bei einem Hebelangriff? Gibt es uneinsehbare Winkel, die einen unbemerkten Zugang erleichtern? Wie widerstandsfähig ist die vorhandene Bausubstanz gegenüber thermischen oder kinetischen Angriffen? Diese detaillierte Evaluation ermöglicht es uns, maßgeschneiderte Präventivmaßnahmen zu entwickeln, die exakt auf die spezifischen Verwundbarkeiten Ihres Objekts zugeschnitten sind.</p>

          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold text-xl mt-8 mb-4">Häufig gestellte Fragen (FAQ) zur Bestandsaufnahme</h3>
          <div className="space-y-6 mt-6">
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">1. Wie lange dauert der Vor-Ort-Sicherheitscheck in der Regel?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Die Dauer variiert stark je nach Objektgröße und Komplexität. Für ein durchschnittliches Einfamilienhaus kalkulieren wir etwa 1,5 bis 2 Stunden. Bei größeren Gewerbeobjekten kann die detaillierte Bestandsaufnahme einen kompletten Arbeitstag in Anspruch nehmen, da jeder Zugangspunkt und jede potenzielle Schwachstelle minutiös dokumentiert wird.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">2. Muss ich zur Vorbereitung bestimmte Unterlagen bereitlegen?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Es ist sehr hilfreich, wenn Sie vorab Grundrisspläne, Detailzeichnungen der Türen und Fenster (falls vorhanden) sowie Dokumentationen eventuell bereits verbauter Sicherheitstechnik (Alarmanlagen, Schließpläne) bereithalten. Dies beschleunigt den Prozess und ermöglicht eine präzisere Analyse der architektonischen Gegebenheiten.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">3. Sind die Empfehlungen aus dem Sicherheitscheck bindend?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Nein, unsere Empfehlungen sind als fundierte, fachliche Beratung zu verstehen. Wir zeigen Ihnen auf, wo objektive Sicherheitsrisiken bestehen und wie diese technisch mitigiert werden können. Die finale Entscheidung, welche Maßnahmen in welchem zeitlichen Rahmen umgesetzt werden, obliegt selbstverständlich Ihnen, passend zu Ihrem Budget und Ihrem persönlichen Sicherheitsbedürfnis.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">4. Berücksichtigen Sie bei der Planung auch Aspekte des Denkmalschutzes?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Absolut. Die Absicherung historischer oder denkmalgeschützter Gebäude erfordert eine besondere Expertise. Wir arbeiten mit speziellen, nicht-invasiven Befestigungssystemen und unsichtbarer Sensorik, um den Eingriff in die historische Bausubstanz auf ein absolutes Minimum zu reduzieren, ohne dabei Kompromisse bei der Sicherheit einzugehen.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">5. Wird die Funktionalität elektronischer Systeme im Rahmen des Checks geprüft?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Soweit möglich, ja. Wir evaluieren den Zustand und die Leistungsfähigkeit bestehender elektronischer Komponenten wie Zutrittskontrollsysteme oder Videoüberwachung. Dabei prüfen wir Schnittstellen, Kabelwege und die generelle Systemarchitektur, um festzustellen, ob diese Systeme erweitert, integriert oder durch modernere, sicherere Alternativen ersetzt werden sollten.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">6. Was geschieht mit meinen Daten und Plänen nach dem Check?</h4>
              <p className="mt-1 text-[oklch(0.32_0.02_260)]">Diskretion und Datensicherheit haben bei uns höchste Priorität. Alle erhobenen Daten, Fotos und Grundrisse werden auf verschlüsselten, offline-fähigen Datenträgern gespeichert und streng vertraulich behandelt. Nach Abschluss des Projekts oder Ablauf der gesetzlichen Aufbewahrungsfristen werden diese sensiblen Informationen DSGVO-konform und restlos vernichtet.</p>
            </div>
          </div>
        </div>
      </Section>


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
    </>
  );
}
