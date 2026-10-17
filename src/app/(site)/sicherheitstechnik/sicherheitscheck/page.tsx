import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { Sicherheitscheck } from './sicherheitscheck';
import { SecurityRiskCalculator } from '@/components/calculator/security-risk-calculator';

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
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitscheckPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;

  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <PageHeader
        eyebrow="Sicherheitstechnik"
        title={page?.headline ?? 'Umfassender Sicherheitscheck'}
        lead={
          page?.subline
          ?? 'Ein systematisches Vorgehen ist die Grundlage für effektive Sicherheitstechnik. '
            + 'In zehn präzisen Schritten erfassen wir Ihre baulichen Gegebenheiten, analysieren '
            + 'Schwachstellen und definieren gemeinsam ein passgenaues Sicherheitskonzept.'
        }
        crumbs={[
          { href: '/sicherheitstechnik', label: 'Sicherheitstechnik' },
          { href: `/${ROUTE}`, label: 'Sicherheitscheck' },
        ]}
      >
        <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
          <p className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
            Ablauf
          </p>
          <p className="mt-2 text-[15px] font-bold text-[oklch(0.16_0.02_260)]">{process.label}</p>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
            {process.hint} Ihr Zwischenstand wird im Browser gespeichert, damit Sie den Check
            unterbrechen und später fortsetzen können. Dies garantiert, dass Sie alle erforderlichen
            Informationen ohne Zeitdruck zusammentragen können.
          </p>
        </div>
      </PageHeader>

      <section className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1fr_min(400px,100%)]">
          <div className="space-y-8 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-4">
                Methodische Schwachstellenanalyse für maximalen Objektschutz
              </h2>
              <p>
                Die Sicherheit eines Gebäudes ist nur so stark wie sein schwächstes Glied. Unser
                detaillierter Sicherheitscheck basiert auf jahrzehntelanger Expertise in der
                Einbruchsprävention und modernster Sicherheitstechnik. Wir betrachten Ihr Objekt
                nicht isoliert, sondern analysieren das gesamte Ökosystem: von der unmittelbaren
                Umgebung über die Grundstücksgrenzen bis hin zum innersten Kern des Gebäudes.
              </p>
              <p className="mt-4">
                Diese ganzheitliche Betrachtungsweise ermöglicht es uns, maßgeschneiderte
                Sicherheitskonzepte zu entwickeln, die genau auf Ihr individuelles Risikoprofil
                abgestimmt sind. Ein Standardkonzept gibt es bei uns nicht – jede Empfehlung
                resultiert aus einer fundierten, objektiven Analyse der spezifischen Gegebenheiten
                vor Ort.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-4">
                Der architektonische Dreiklang der Sicherheit
              </h3>
              <p>
                Unsere Bewertungsmethodik stützt sich auf einen bewährten Dreiklang der
                Sicherheitsarchitektur:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>
                  <strong>Mechanischer Grundschutz:</strong> Das Fundament jeder
                  Sicherheitsstrategie. Hochwertige Schließzylinder, stabile Schutzbeschläge und
                  einbruchhemmende Türen und Fenster bilden die erste und wichtigste Barriere gegen
                  unbefugtes Eindringen.
                </li>
                <li>
                  <strong>Elektronische Überwachung:</strong> Intelligente Alarm- und
                  Videoüberwachungssysteme detektieren Einbruchsversuche frühzeitig und dokumentieren
                  Vorfälle. Sie dienen sowohl der Abschreckung als auch der zeitnahen Alarmierung
                  von Interventionskräften.
                </li>
                <li>
                  <strong>Organisatorische Maßnahmen:</strong> Klare Zutrittsregelungen,
                  Schlüsselmanagement (oft realisiert durch digitale Schließanlagen) und das
                  Bewusstsein der Nutzer runden das Sicherheitskonzept ab und verhindern, dass
                  technische Maßnahmen durch unachtsames Verhalten umgangen werden.
                </li>
              </ul>
            </div>

            <div className="mt-12">
               <SecurityRiskCalculator />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-6">
                Häufig gestellte Fragen zum Sicherheitscheck
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.16_0.02_260)]">Wie lange dauert die Durchführung des Sicherheitschecks?</h3>
                  <p className="mt-2 text-sm">Die reine Dateneingabe im Online-Formular nimmt etwa 10-15 Minuten in Anspruch. Je genauer Sie die Fragen beantworten und je mehr Informationen (wie Grundrisse oder Fotos) Sie bereitstellen, desto präziser fällt unsere Auswertung aus.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.16_0.02_260)]">Was passiert mit meinen hochgeladenen Dokumenten?</h3>
                  <p className="mt-2 text-sm">Datenschutz und Diskretion haben bei uns oberste Priorität. Alle übermittelten Grundrisse und Objektfotos werden verschlüsselt übertragen und streng nach den gesetzlichen Aufbewahrungsfristen verarbeitet. Nach Abschluss der Projektierung oder Ablauf der definierten Frist (siehe Angaben im Formular) werden diese Daten DSGVO-konform gelöscht.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.16_0.02_260)]">Ist der Sicherheitscheck verbindlich?</h3>
                  <p className="mt-2 text-sm">Nein. Der Online-Sicherheitscheck dient als fundierte Erstaufnahme. Sie erhalten im Anschluss eine unverbindliche Ersteinschätzung und – falls gewünscht – ein darauf basierendes Angebot. Es entstehen durch das Ausfüllen des Formulars keine Kosten oder Verpflichtungen für Sie.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.16_0.02_260)]">Ersetzt der Online-Check eine Beratung vor Ort?</h3>
                  <p className="mt-2 text-sm">Der digitale Check ist ein hervorragendes Werkzeug zur Vorbereitung. Für komplexe Objekte oder hochgradige Sicherheitsanforderungen (wie Alarmanlagen-Zertifizierungen) ist eine physische Begehung durch unsere Experten unumgänglich. Der Online-Check sorgt jedoch dafür, dass dieser Vor-Ort-Termin wesentlich effizienter abläuft.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[oklch(0.16_0.02_260)]">Kann ich den Check zwischenspeichern?</h3>
                  <p className="mt-2 text-sm">Ja, Ihr Fortschritt wird lokal in Ihrem Browser gespeichert. Sie können die Seite jederzeit schließen und zu einem späteren Zeitpunkt an genau der Stelle fortfahren, an der Sie aufgehört haben, vorausgesetzt, Sie nutzen dasselbe Gerät und denselben Browser.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="sticky top-24 h-fit">
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-4">Starten Sie die detaillierte Bestandsaufnahme</h3>
                <p className="text-sm text-[oklch(0.32_0.02_260)] mb-6">Nutzen Sie unser geführtes Formular, um alle relevanten Objektdaten sicher an uns zu übermitteln.</p>
                <div className="w-full">
                  <Sicherheitscheck
                    retention={{
                      floorPlans: settings.retentionDays.floorPlans,
                      objectPhotos: settings.retentionDays.projectDocuments,
                    }}
                  />
                </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="muted" tight className="bg-[oklch(0.988_0.002_260)] border-t border-[oklch(0.89_0.008_260/0.55)]">
        <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
        <ul className="mt-6 flex flex-wrap gap-3">
          {RELATED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] px-4 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-colors hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)]"
              >
                {link.label}
                <ArrowRight size={15} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
