import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { SecurityNeedsAnalyzer } from '@/components/calculator/security-needs-analyzer';

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Ratgeber für Schließ- & Sicherheitstechnik | SCHLÜSSELMACHER24',
  description:
    'Umfassendes Fachwissen zu Autoschlüsseln, Schließanlagen, elektronischem Zutritt und modernem Einbruchschutz. Fundierte Beratung, methodische Ansätze und interaktive Analysen für maximale Sicherheit.',
  alternates: { canonical: '/ratgeber' },
};

const FAQ_ITEMS = [
  {
    question: 'Wie unterscheidet sich ein herkömmlicher mechanischer Zylinder von einem elektronischen Schließsystem?',
    answer: 'Mechanische Schließzylinder basieren auf rein physischen Zuhaltungen (Stifte und Federn), die durch einen exakt gefrästen Schlüsselbart bewegt werden. Elektronische Systeme hingegen nutzen RFID, Bluetooth oder biometrische Daten zur Authentifizierung. Während mechanische Systeme bei Schlüsselverlust oft den kompletten Tausch des Zylinders erfordern, lassen sich bei elektronischen Anlagen verlorene Transponder einfach und kostengünstig ausprogrammieren. Zudem protokollieren elektronische Systeme Zutritte und erlauben zeitlich befristete Zugänge, was sie besonders für Gewerbeobjekte und komplexe Wohnanlagen ideal macht.'
  },
  {
    question: 'Welche Maßnahmen sind essenziell für einen zeitgemäßen und effektiven Einbruchschutz?',
    answer: 'Ein effektiver Einbruchschutz erfordert ein ganzheitliches Konzept, das mechanische und elektronische Komponenten vereint. Primär müssen alle Schwachstellen der Gebäudehülle gesichert werden. Dazu gehören VdS-zertifizierte Schließzylinder (mindestens Klasse BZ+), massive Schutzbeschläge mit Zylinderabdeckung, einbruchhemmende Mehrfachverriegelungen für Haus- und Wohnungstüren sowie Pilzkopfzapfenverriegelungen für Fenster. Ergänzt wird die mechanische Grundsicherung durch elektronische Komponenten wie Alarmanlagen (Einbruchmeldeanlagen nach DIN EN 50131) und hochauflösende Videoüberwachung. Die Prävention beginnt jedoch bei der korrekten Planung und der fachgerechten Montage durch zertifizierte Sicherheitstechniker.'
  },
  {
    question: 'Was ist bei der Planung einer neuen Schließanlage für ein Mehrfamilienhaus oder Gewerbeobjekt zu beachten?',
    answer: 'Die Planung einer komplexen Schließanlage erfordert höchste Präzision und eine detaillierte Bedarfsanalyse. Zu Beginn muss ein umfassender Schließplan (Matrix) erstellt werden, der exakt definiert, welche Personengruppe zu welchen Zeiten Zugang zu welchen Bereichen erhält. Es muss entschieden werden, ob eine Zentralschlossanlage, eine Hauptschlüsselanlage oder eine Generalhauptschlüsselanlage (GHS) am besten geeignet ist. Bei wachsenden Strukturen oder hoher Fluktuation empfehlen wir dringend den Einsatz hybrider oder rein elektronischer Systeme, da diese eine dynamische Anpassung der Berechtigungen erlauben und die Folgekosten bei Schlüsselverlusten drastisch minimieren.'
  },
  {
    question: 'Mein Autoschlüssel ist defekt oder verloren gegangen. Wie läuft die professionelle Nachfertigung ab?',
    answer: 'Die Nachfertigung eines modernen Autoschlüssels ist ein hochkomplexer technologischer Prozess. Zunächst muss der mechanische Schlüsselbart per CNC-Fräse präzise nach Code oder Vorlage geschnitten werden. Der entscheidende Schritt ist jedoch die Programmierung des Transponders (Wegfahrsperre) und der Funkfernbedienung. Hierfür verbinden wir unsere speziellen Diagnosegeräte über die OBD-Schnittstelle direkt mit dem Steuergerät (ECU) Ihres Fahrzeugs. Bei Smart-Keys oder Keyless-Go-Systemen ist ein tiefer Eingriff in die Fahrzeugsicherheitsprotokolle notwendig. Bei einem Komplettverlust können wir in den meisten Fällen durch das Auslesen der Steuergeräte-Daten oder die mechanische Decodierung des Türschlosses einen vollständig neuen Schlüssel generieren.'
  },
  {
    question: 'Woran erkenne ich einen seriösen Schlüsseldienst und wie schütze ich mich vor betrügerischen Angeboten?',
    answer: 'Ein seriöser Fachbetrieb zeichnet sich durch absolute Transparenz, einen festen lokalen Standort und eine klare Preisstruktur aus. Wir bei SCHLÜSSELMACHER24 kommunizieren alle Preise vorab – ohne versteckte Kosten oder überzogene Wochenendzuschläge. Seriöse Techniker identifizieren sich vor Ort, fragen nach Ihrer Legitimation (Ausweis) und versuchen immer zuerst zerstörungsfreie Öffnungsmethoden (z.B. Pick-Werkzeuge, Türfallengleiter). Vorsicht ist geboten bei Anbietern mit 0800-Nummern ohne Impressum, Lockangeboten ab 9 Euro oder wenn sofortiges Aufbohren des Zylinders gefordert wird, obwohl die Tür nur zugefallen ist.'
  }
];

export default async function RatgeberPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const guides = await getGuides();

  const grouped = NAV_AREAS.map((area) => ({
    area,
    guides: guides.filter((g) => g.topic === area.key),
  })).filter((group) => group.guides.length > 0);

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} className="bg-[oklch(0.988_0.002_260)] min-h-screen">
      <PageHeader
        eyebrow="Tiefgreifendes Fachwissen"
        title="Das Kompendium für Schließtechnik & Sicherheit"
        lead="Entdecken Sie unsere fundierten Fachartikel, detaillierten Anleitungen und methodischen Analysen. Vom präzisen Autoschlüssel-Fräsen bis zur architektonischen Planung hochkomplexer Schließanlagen – hier finden Sie die Expertise für Ihre maximale Sicherheit."
        crumbs={[{ href: '/ratgeber', label: 'Ratgeber' }]}
      />

      <Section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
            Wissenschaftlich fundierte Sicherheitsarchitektur
          </h2>
          <p>
            Die Konzeption und Implementierung moderner Sicherheitssysteme erfordert heute ein tiefes Verständnis sowohl mechanischer Toleranzen als auch komplexer elektronischer Verschlüsselungsprotokolle. In unserem Ratgeber bündeln wir Jahrzehnte der operativen Erfahrung in der Schließtechnik mit den neuesten Erkenntnissen der digitalen Zugangskontrolle. Unsere methodischen Ansätze basieren auf strengen VdS-Richtlinien und DIN-Normen, um nicht nur subjektive Sicherheit zu vermitteln, sondern objektiv messbare und zertifizierbare Schutzkonzepte zu realisieren.
          </p>
          <p>
            Jeder Fachbeitrag in diesem Kompendium wurde von zertifizierten Sicherheitstechnikern verfasst. Wir beleuchten die mikroskopischen Details von Zylinderstiften ebenso präzise wie die kryptographischen Algorithmen (z.B. AES-128) in Smart-Home-Zutrittslösungen. Unser Ziel ist es, Ihnen die architektonischen Zusammenhänge aufzuzeigen, damit Sie fundierte Entscheidungen für den Schutz Ihrer Werte, Ihrer Daten und vor allem Ihrer Familie oder Ihrer Mitarbeiter treffen können.
          </p>
          <p>
            Ein zentraler Aspekt unserer Philosophie ist die Prävention durch Aufklärung. Wir analysieren gängige Einbruchsmethoden – vom klassischen »Lockpicking« über »Bumping« bis hin zu gewaltsamen Zylinderabrissen – und stellen detailliert dar, durch welche spezifischen Gegenmaßnahmen (wie Bohr- und Ziehschutz, Kernpanzerung, Schutzbeschläge) diese Angriffsvektoren neutralisiert werden können. Darüber hinaus bieten wir tiefgreifende Einblicke in die Automobil-Sicherheitstechnologie, erklären die Funktionsweise komplexer Wegfahrsperren-Transponder und demystifizieren den Prozess der Programmierung moderner Keyless-Go-Systeme.
          </p>
          <p>
            Zusätzlich zur mechanischen Absicherung gewinnt die smarte Gebäudeautomation zunehmend an Bedeutung. Biometrische Zugangssysteme, Bluetooth-basierte Smart-Locks und cloudgesteuerte Schließanlagen bieten nicht nur ein Höchstmaß an Komfort, sondern ermöglichen auch eine lückenlose Protokollierung von Zutrittsereignissen. In unseren weiterführenden Artikeln analysieren wir die Vor- und Nachteile dieser Technologien, geben konkrete Empfehlungen für verschiedene Anwendungsszenarien – vom Einfamilienhaus bis zum gewerblichen Komplex – und erklären, worauf bei der Integration in bestehende Smart-Home-Ecosysteme zu achten ist, um maximale Interoperabilität und Datensicherheit zu gewährleisten.
          </p>
          <p>
            Die Wahl des richtigen Sicherheitssystems ist eine Investition in die Zukunft. Daher legen wir großen Wert auf skalierbare und zukunftssichere Lösungen. Eine Schließanlage, die heute für ein kleines Start-up konzipiert wird, muss flexibel genug sein, um mit dem Unternehmen mitzuwachsen. Wir zeigen Ihnen auf, wie modulare Systeme konzipiert werden, welche Rolle offene Standards (wie z.B. OSS Standard Offline) spielen und warum die Wahl des richtigen Partners für die langfristige Wartung und Pflege Ihrer Sicherheitsarchitektur ebenso entscheidend ist wie die Hardware selbst.
          </p>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-[oklch(0.968_0.004_260)]">
        <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8 text-center">
                Interaktive Sicherheitsbedarfs-Analyse
            </h2>
            <p className="text-[oklch(0.32_0.02_260)] text-center mb-12">
                Ermitteln Sie mit unserem algorithmischen Analysetool in wenigen Sekunden Ihren spezifischen Schutzbedarf. Basierend auf Ihren Gebäude- und Nutzerparametern kalkulieren wir das optimale Schutzniveau und empfehlen präzise technologische Lösungsansätze.
            </p>
            <SecurityNeedsAnalyzer />
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32">
        <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-12">
            Methodische Fachartikel nach Disziplinen
        </h2>
        <div className="space-y-16">
          {grouped.map((group) => (
            <div key={group.area.key}>
              <h3 className="text-lg font-semibold tracking-tight text-[oklch(0.16_0.02_260)] border-b border-[oklch(0.89_0.008_260/0.55)] pb-3 mb-6">
                  {group.area.label}
              </h3>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 grid-rows-[subgrid] row-span-4">
                {group.guides.map((guide) => (
                  <li key={guide.id} className="row-span-4 grid grid-rows-[subgrid]">
                    <Link
                      href={`/ratgeber/${guide.slug}`}
                      className="group flex flex-col justify-between row-span-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.52_0.24_260)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.08)]"
                      style={{ viewTransitionName: `guide-${guide.id}` }}
                    >
                      <span className="text-[16px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                        {guide.title}
                      </span>
                      <span className="mt-4 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                        {guide.excerpt}
                      </span>
                      <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[oklch(0.52_0.24_260)]">
                        Fachartikel studieren
                        <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8 text-center">
            Häufig gestellte Fragen (FAQ)
          </h2>
          <Accordion items={FAQ_ITEMS} className="border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)]" />
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-[oklch(0.16_0.02_260)] text-white">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
                Bereit für eine maßgeschneiderte Sicherheitsarchitektur?
            </h2>
            <p className="text-[oklch(0.89_0.008_260)] mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam Ihr Projekt analysieren. Unsere Experten beraten Sie herstellerunabhängig und entwickeln eine präzise auf Ihre Bedürfnisse zugeschnittene Lösung – ob mechanisch, elektronisch oder hybrid.
            </p>
            <Link href="/service-und-termin" className="inline-flex items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260)] px-8 py-4 font-semibold text-white transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] shadow-sm">
                Unverbindliche Expertenberatung anfordern
            </Link>
        </div>
      </Section>
    </main>
  );
}
