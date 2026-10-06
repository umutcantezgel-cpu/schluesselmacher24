import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { SecurityRoiCalculator } from '@/components/calculator/security-roi-calculator';
import { Sicherheitscheck } from './sicherheitscheck';

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


      <div className="shell py-12 md:py-16">
        <div className="prose prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed mb-16">
          <h2 className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] mb-6 tracking-tight">Die Architektonische Methodik des Sicherheitschecks</h2>
          <p>
            Ein effektives Sicherheitskonzept für gewerbliche und private Objekte beginnt niemals mit dem blinden Kauf von Hardware. Es erfordert eine systematische architektonische Methodik, die wir im Rahmen unseres umfassenden Sicherheitschecks anwenden. Dieser Check ist kein oberflächliches Frage-Antwort-Spiel, sondern eine tiefgreifende Analyse Ihrer physischen Gebäudehülle, der internen Raumstrukturen und der operativen Abläufe.
          </p>
          <p>
            Wir betrachten Ihr Objekt in konzentrischen Sicherheitszonen (Zwiebelschalenprinzip). Die Peripherie bildet die erste Verteidigungslinie, gefolgt von der Gebäudehülle (Fassade, Fenster, Türen) und schließlich den sensiblen Kernbereichen im Inneren. Jeder dieser Bereiche erfordert eine spezifische, auf die dortigen Risiken abgestimmte Widerstandsklasse (Resistance Class, RC) gemäß DIN EN 1627.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4 tracking-tight">Drei Säulen der Objektsicherheit</h3>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li><strong>Mechanische Grundsicherung:</strong> Der unverzichtbare physische Widerstand gegen Einbruchversuche. Hierzu zählen hochwertige Profilzylinder mit Bohr- und Ziehschutz, Schutzbeschläge der Klasse ES2/ES3 sowie Pilzkopfzapfenverriegelungen an Fenstern. Die Mechanik ist das Fundament; sie zwingt Täter zu hohem Zeitaufwand und starker Lärmentwicklung.</li>
            <li><strong>Elektronische Detektion und Alarmierung:</strong> Einbruchmeldeanlagen (EMA) und Videoüberwachungssysteme, die unbefugte Eindringversuche frühzeitig erkennen und melden. Sie ergänzen die Mechanik durch die Komponente der Entdeckungswahrscheinlichkeit und raschen Intervention.</li>
            <li><strong>Organisatorische und mechatronische Zutrittskontrolle:</strong> Intelligente Schließsysteme, die definieren, <em>wer</em> zu <em>welcher Zeit</em> an <em>welchem Ort</em> Zutritt hat. Der Verlust von Schlüsseln führt hier nicht zum teuren Austausch von Zylindern, sondern lediglich zum sofortigen Entzug der digitalen Berechtigung.</li>
          </ul>

          <h2 className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] mb-6 tracking-tight">Systematische Schwachstellenanalyse</h2>
          <p>
            Täter suchen stets den Weg des geringsten Widerstands. Statistiken belegen, dass bei Einfamilienhäusern über 80% der Einbrüche über leicht erreichbare Fenster und Fenstertüren (Terrassen-/Balkontüren) erfolgen. Bei Mehrfamilienhäusern hingegen verlagert sich der Schwerpunkt auf die Wohnungseingangstüren, während bei Gewerbeobjekten oft unzureichend gesicherte Nebeneingänge oder Lichtschächte im Fokus stehen.
          </p>
          <p>
            In unserem digitalen Check erfassen wir diese spezifischen Parameter Ihres Objekts. Wir evaluieren die Zugänglichkeit von außen (Gibt es Aufstiegshilfen wie Mülltonnen oder Rankgerüste?), den Zustand der vorhandenen Beschläge und die strukturelle Integrität der Türblätter und Zargen. Ein hochwertiges Sicherheitsschloss ist nutzlos, wenn die Zarge bei Gewalteinwirkung aus dem Mauerwerk bricht oder das Türblatt selbst nachgibt.
          </p>
        </div>

        <SecurityRoiCalculator />

        <div className="prose prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed mt-16 mb-12">
          <h2 className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] mb-6 tracking-tight">Ganzheitliche Integration statt Insellösungen</h2>
          <p>
            Moderne Sicherheitstechnik entfaltet ihre maximale Wirkung nur durch intelligente Integration. Eine Alarmanlage sollte nahtlos mit der elektronischen Zutrittskontrolle kommunizieren. Wenn der letzte Mitarbeiter das Gebäude verlässt und die Tür elektronisch verriegelt, muss das System die Scharfschaltung der Einbruchmeldeanlage automatisch initiieren oder zumindest auf offene Fenster (Zwangsläufigkeit) prüfen.
          </p>
          <p>
            Unsere Planung berücksichtigt diese Synergien von Beginn an. Der Sicherheitscheck liefert die notwendige Datenbasis, um Insellösungen zu vermeiden und ein kohärentes, skalierbares Ökosystem für Ihre Objektsicherheit zu entwerfen. Wir setzen dabei konsequent auf offene Standards und Herstellerunabhängigkeit, um Ihre Investition zukunftssicher zu gestalten.
          </p>

          <h2 className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] mb-6 mt-12 tracking-tight">Häufig gestellte Fragen (FAQ) zur Methodik</h2>
          <div className="space-y-6">
            <div className="bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">1. Ersetzt der Online-Check eine Vor-Ort-Begehung?</h4>
              <p className="text-sm">Nein. Der Online-Check dient der fundierten Vorqualifizierung und Datenerfassung. Er ermöglicht es unseren Ingenieuren, bereits mit einer konkreten Schwachstellenanalyse und ersten Lösungsansätzen in das anschließende Vor-Ort-Audit zu gehen, was den Prozess enorm beschleunigt und präzisiert.</p>
            </div>
            <div className="bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">2. Wie werden meine sensiblen Gebäudedaten geschützt?</h4>
              <p className="text-sm">Wir behandeln Ihre Sicherheitsinfrastruktur mit höchster Vertraulichkeit. Alle im Check eingegebenen Daten werden verschlüsselt übertragen und streng zweckgebunden verarbeitet. Detaillierte Grundrisse oder Objektfotos unterliegen definierten Löschfristen (Retention Policies), die Sie in den Datenschutzeinstellungen des Tools einsehen können.</p>
            </div>
            <div className="bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">3. Welche Standards liegen den Empfehlungen zugrunde?</h4>
              <p className="text-sm">Unsere Empfehlungen basieren auf den aktuellen DIN- und EN-Normen (insbesondere DIN EN 1627 für einbruchhemmende Bauteile und DIN VDE 0833 für Gefahrenmeldeanlagen) sowie den Richtlinien des VdS (Vertrauen durch Sicherheit) und der polizeilichen Kriminalprävention (K-EINBRUCH).</p>
            </div>
            <div className="bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">4. Lohnt sich die Nachrüstung älterer Fenster und Türen?</h4>
              <p className="text-sm">In den meisten Fällen ja. Eine fachgerechte Nachrüstung nach DIN 18104 (z.B. mit aufschraubbaren oder verdeckt liegenden Nachrüstprodukten) kann den mechanischen Widerstandswert erheblich steigern und ist oft wirtschaftlicher als der komplette Austausch der Bauelemente, sofern die Grundsubstanz intakt ist.</p>
            </div>
            <div className="bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">5. Wie fließt die IT-Sicherheit in elektronische Schließanlagen ein?</h4>
              <p className="text-sm">Mechatronische und elektronische Komponenten sind IoT-Geräte. Wir bewerten daher nicht nur den physischen Manipulationsschutz, sondern auch die kryptografische Absicherung der Kommunikation (z.B. AES-128 Verschlüsselung bei Transpondern, sichere Protokolle bei der Vernetzung von Controllern) gegen Cyber-Angriffe.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mb-6 tracking-tight">Starten Sie nun die detaillierte Bestandsaufnahme</h2>
          <Sicherheitscheck
            retention={{
              floorPlans: settings.retentionDays.floorPlans,
              objectPhotos: settings.retentionDays.projectDocuments,
            }}
          />
        </div>
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
    </>
  );
}
