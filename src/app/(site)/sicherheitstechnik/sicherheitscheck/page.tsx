import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';

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

      <div className="shell py-8 md:py-12">
        <Sicherheitscheck
          retention={{
            floorPlans: settings.retentionDays.floorPlans,
            objectPhotos: settings.retentionDays.projectDocuments,
          }}
        />
      </div>


      <Section tight>
        <div className="prose prose-slate max-w-none prose-headings:text-[oklch(0.16_0.02_260)] prose-p:text-[oklch(0.32_0.02_260)] prose-a:text-primary">
          <h2>Warum ein professioneller Sicherheitscheck unerlässlich ist</h2>
          <p>
            Ein effektives Sicherheitskonzept beginnt lange vor der Installation der ersten Überwachungskamera oder des ersten Schließzylinders. Es erfordert eine tiefgreifende Analyse der bestehenden Infrastruktur, der potenziellen Schwachstellen und der spezifischen Anforderungen Ihres Objekts. Unser umfassender Sicherheitscheck bildet das fundamentale Rückgrat für jede seriöse Planung im Bereich der Sicherheitstechnik. Wir betrachten Ihr Gebäude nicht als isoliertes Objekt, sondern als ein komplexes System aus physischen Barrieren, elektronischen Überwachungssystemen und organisatorischen Abläufen.
          </p>
          <p>
            Die Kriminalstatistik zeigt deutlich: Ein Großteil der Einbrüche und unbefugten Zutritte erfolgt durch Schwachstellen, die durch eine professionelle Vorab-Analyse leicht identifizierbar und behebbar gewesen wären. Veraltete Schließanlagen, ungesicherte Nebeneingänge, unzureichende Beleuchtung oder blinde Flecken in der Videoüberwachung sind typische Einfallstore. Unser Sicherheitscheck deckt genau diese Defizite auf. Wir kombinieren jahrzehntelange Erfahrung in der mechanischen und elektronischen Absicherung mit modernster Analysetechnik, um ein holistisches Bild Ihres Sicherheitsniveaus zu zeichnen.
          </p>
          <p>
            Darüber hinaus berücksichtigen wir die individuellen Risikoprofile. Ein Juweliergeschäft erfordert andere Sicherheitsmaßnahmen als ein privates Wohnhaus oder ein industrieller Fertigungsbetrieb. Die Wertdichte, die Lage des Objekts, die Fluktuationsrate von Personen und die spezifischen Betriebsablaufe fließen in unsere Bewertung ein. Nur so können wir ein maßgeschneidertes Sicherheitskonzept entwickeln, das nicht nur maximalen Schutz bietet, sondern auch praxistauglich und wirtschaftlich ist.
          </p>

          <h2>Unsere methodische Vorgehensweise im Detail</h2>
          <p>
            Der Sicherheitscheck ist ein strukturierter, mehrstufiger Prozess, der höchste Präzision und Vollständigkeit garantiert. Er gliedert sich in folgende Kernphasen:
          </p>

          <h3>1. Objekt- und Umgebungsanalyse</h3>
          <p>
            Die erste Phase umfasst eine detaillierte Erfassung der äußeren Rahmenbedingungen. Wir analysieren die Lage des Objekts, die Zugänglichkeit von verschiedenen Seiten, die Einsehbarkeit durch Nachbarn oder Passanten sowie die Beleuchtungssituation bei Nacht. Auch die Beschaffenheit des Geländes (z.B. versteckte Bereiche durch Bepflanzung) wird dokumentiert. Diese Faktoren beeinflussen maßgeblich die Wahrscheinlichkeit eines Einbruchsversuchs und die Wahl der geeigneten Gegenmaßnahmen.
          </p>

          <h3>2. Überprüfung der Gebäudehülle</h3>
          <p>
            Dies ist oft der kritischste Teil des Checks. Wir prüfen sämtliche Fenster, Türen, Kellerschächte, Dachluken und andere potenzielle Zugänge. Dabei bewerten wir die Qualität der Rahmen, der Verglasung, der Beschläge und der Schließzylinder. Wir achten auf typische Schwachstellen wie nicht abschließbare Fenstergriffe, veraltete Rolladen oder fehlende Aushebelsicherungen an Terrassentüren. Die mechanische Grundsicherung muss den aktuellen DIN-Normen und den Empfehlungen der Kriminalpolizei entsprechen.
          </p>

          <h3>3. Analyse der internen Sicherheitsstruktur</h3>
          <p>
            Sicherheit endet nicht an der Haustür. Wir untersuchen die internen Abläufe und die Raumaufteilung. Wo werden Wertsachen aufbewahrt? Gibt es besonders schützenswerte Bereiche (z.B. Serverräume, Tresorräume)? Wie ist die Zutrittskontrolle innerhalb des Gebäudes geregelt? Wir prüfen auch das Vorhandensein und die Funktionalität von Wertschutzschränken und die Integration in ein übergeordnetes Sicherheitskonzept.
          </p>

          <h3>4. Bestandsaufnahme der elektronischen Systeme</h3>
          <p>
            Falls bereits Sicherheitstechnik installiert ist, unterziehen wir diese einer strengen Prüfung. Wir testen Alarmanlagen (Einbruchmeldeanlagen), Videoüberwachungssysteme, elektronische Zutrittskontrollen und Gefahrenwarnanlagen (z.B. Rauchmelder). Wir prüfen die Kompatibilität der Systeme, die Aktualität der Software, die Positionierung der Sensoren und Kameras sowie die Alarmweiterleitung. Oft stellen wir fest, dass bestehende Systeme veraltet sind oder nicht optimal aufeinander abgestimmt sind.
          </p>

          <h2>Die Vorteile unseres digitalen Sicherheitschecks</h2>
          <p>
            Der von uns entwickelte digitale Sicherheitscheck bietet Ihnen signifikante Vorteile gegenüber traditionellen Methoden:
          </p>
          <ul>
            <li><strong>Effizienz und Zeitersparnis:</strong> Sie können die erste Erfassung bequem von zu Hause oder vom Büro aus durchführen, wann immer es Ihnen passt. Sie müssen nicht auf einen Vor-Ort-Termin warten, um den Prozess zu starten.</li>
            <li><strong>Strukturierte Datenerfassung:</strong> Unser interaktiver Fragebogen führt Sie systematisch durch alle relevanten Bereiche. Nichts wird vergessen, und die Daten werden direkt in einer strukturierten Form erfasst, die eine schnelle und präzise Auswertung ermöglicht.</li>
            <li><strong>Transparenz:</strong> Sie erhalten einen klaren Überblick über die abgefragten Informationen und können den Fortschritt jederzeit verfolgen. Die Zusammenfassung am Ende gibt Ihnen eine sofortige Übersicht über die erfassten Daten.</li>
            <li><strong>Optimale Vorbereitung:</strong> Die detaillierten Vorab-Informationen ermöglichen es unseren Experten, sich optimal auf einen eventuellen Vor-Ort-Termin vorzubereiten. Wir wissen bereits, worauf wir unser Augenmerk legen müssen, und können gezielt Lösungsvorschläge erarbeiten.</li>
          </ul>

          <h2>Vergleich: Mechanische vs. Elektronische Absicherung</h2>
          <p>
            Eine häufige Frage im Rahmen des Sicherheitschecks ist die nach dem optimalen Verhältnis von mechanischer und elektronischer Absicherung. Die Antwort ist eindeutig: Eine Kombination aus beiden Bereichen bietet den bestmöglichen Schutz.
          </p>
          <div className="my-8 overflow-x-auto rounded-lg border border-[oklch(0.89_0.008_260/0.55)]">
            <table className="min-w-full divide-y divide-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-sm">
              <thead>
                <tr className="bg-[oklch(0.968_0.004_260)]">
                  <th className="px-4 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Kriterium</th>
                  <th className="px-4 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Sicherheit</th>
                  <th className="px-4 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Sicherheit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Primäre Funktion</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Verzögerung / Verhinderung des Eindringens</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Meldung / Aufzeichnung von Ereignissen</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Wirkungsweise</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Physischer Widerstand (Schlösser, Riegel, Panzerriegel)</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Sensorische Erfassung (Bewegung, Glasbruch) und Alarmierung</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Abschreckungseffekt</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Hoch (sichtbare Zusatzschlösser)</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Hoch (sichtbare Kameras, Sirenen)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Abhängigkeiten</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Keine (funktioniert immer)</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Stromversorgung / Netzwerkverbindung erforderlich</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Beispiele</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Sicherheitszylinder, Stangenschlösser, Fensterstangenschlösser</td>
                  <td className="px-4 py-3 text-[oklch(0.32_0.02_260)]">Alarmanlagen, Videoüberwachung, Zutrittskontrollsysteme</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Die mechanische Sicherung bildet das Fundament. Sie muss dem Täter physischen Widerstand entgegensetzen und den Einbruchversuch so lange verzögern, bis dieser idealerweise aufgibt. Die Kriminalstatistik belegt, dass die meisten Einbruchsversuche abgebrochen werden, wenn sie nicht innerhalb weniger Minuten erfolgreich sind. Elektronische Systeme ergänzen diesen Schutz, indem sie den Einbruchsversuch detektieren, Alarm auslösen, Hilfe rufen (z.B. über eine Aufschaltung zu einem Wachdienst) und Beweismaterial sichern.
          </p>

          <h2>Häufig gestellte Fragen (FAQ) zum Sicherheitscheck</h2>

          <div className="mt-8 space-y-6">
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-lg">1. Wie lange dauert der digitale Sicherheitscheck?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Die Dauer hängt von der Komplexität Ihres Objekts und der Detailtiefe Ihrer Angaben ab. In der Regel benötigen Sie für den ersten Durchlauf etwa 15 bis 30 Minuten. Da Ihr Fortschritt im Browser gespeichert wird, können Sie den Check jederzeit unterbrechen und später fortsetzen, falls Sie beispielsweise noch Informationen einholen oder Fotos machen müssen.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-lg">2. Was passiert mit meinen hochgeladenen Fotos und Grundrissen?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Datenschutz hat bei uns höchste Priorität. Ihre hochgeladenen Dokumente und Fotos werden streng vertraulich behandelt und ausschließlich zur Auswertung Ihres Sicherheitschecks und zur Erstellung eines Angebots verwendet. Nach Ablauf der gesetzlichen oder vereinbarten Aufbewahrungsfristen (z.B. 30 Tage für Grundrisse, wenn kein Auftrag zustande kommt) werden die Daten automatisch und unwiderruflich gelöscht.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-lg">3. Ist der Sicherheitscheck verbindlich oder kostenpflichtig?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Die Nutzung des digitalen Sicherheitschecks auf unserer Website ist für Sie völlig kostenlos und unverbindlich. Er dient der ersten Bestandsaufnahme. Erst wenn Sie auf Basis unserer Auswertung ein konkretes Angebot anfordern und annehmen, entstehen Kosten für die Installation von Sicherheitstechnik.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-lg">4. Muss ich alle Fragen beantworten, auch wenn ich die Antwort nicht genau weiß?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Nein, Sie müssen nur die Pflichtfelder (z.B. Kontaktdaten) ausfüllen. Wenn Sie bei bestimmten technischen Details unsicher sind, können Sie diese überspringen oder im Freitextfeld vermerken, dass Sie sich nicht sicher sind. Genau dafür sind wir da: Wir klären diese Punkte dann gemeinsam bei einem Vor-Ort-Termin oder in einem Beratungsgespräch.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-lg">5. Bekomme ich direkt nach dem Check einen Preis genannt?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Da seriöse Sicherheitstechnik immer maßgeschneidert ist, können wir Ihnen nicht sofort einen pauschalen Preis nennen. Wir werten Ihre Angaben detailliert aus und melden uns dann bei Ihnen mit einer ersten Einschätzung und, falls möglich, mit einem groben Kostenrahmen. Ein verbindliches Angebot erstellen wir in der Regel erst nach einer persönlichen Beratung oder einem Vor-Ort-Termin.
              </p>
            </div>
          </div>
        </div>
      </Section>


      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="prose prose-slate max-w-none prose-headings:text-[oklch(0.16_0.02_260)] prose-p:text-[oklch(0.32_0.02_260)] prose-a:text-primary">
            <h2>Kostenrechner für Sicherheitstechnik</h2>
            <p>
              Transparenz ist uns wichtig. Deshalb bieten wir Ihnen hier die Möglichkeit, einen ersten groben Kostenrahmen für die Absicherung Ihres Objekts zu kalkulieren. Bitte beachten Sie, dass dies nur Richtwerte sind. Ein verbindliches Angebot erstellen wir nach dem detaillierten Sicherheitscheck.
            </p>
            <p>
              Die Kosten setzen sich zusammen aus den Materialkosten für mechanische und elektronische Komponenten sowie dem Aufwand für die fachgerechte Montage und Inbetriebnahme durch unsere Experten.
            </p>
          </div>
          <div>
            <SecurityBudgetCalculator />
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
