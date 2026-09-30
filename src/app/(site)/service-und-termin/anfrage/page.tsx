import type { Metadata } from 'next';

import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { AllgemeineAnfrage } from './anfrage-formular';
import { InteractiveModule } from '@/components/calculator/interactive-module-35';

export const metadata: Metadata = {
  title: 'Allgemeine Anfrage und Fachexpertise',
  description:
    'Stellen Sie eine Anfrage, wenn Ihr Anliegen in keinen der Fachbereiche passt. Wir melden '
    + 'uns mit einer fundierten Ersteinschätzung zu technischer Machbarkeit, Aufwand und Sicherheitsanforderungen.',
  alternates: { canonical: '/service-und-termin/anfrage' },
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnfragePage({ searchParams }: Props) {
  const resolvedSearch = await searchParams;
  const thema = typeof resolvedSearch.thema === 'string' ? resolvedSearch.thema : undefined;

  const themen = NAV_AREAS.map((area) => ({
    key: area.key,
    label: area.label,
    summary: area.summary,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Geführte Anfrage & Technische Evaluierung"
        title="Allgemeine Anfrage"
        lead="Wenn Ihr technisches oder sicherheitsrelevantes Anliegen in keinen der standardisierten Fachbereiche passt: Beschreiben Sie uns Ihr Szenario. Unsere Sicherheitstechniker und Systemplaner melden sich zeitnah mit einer fundierten Ersteinschätzung."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/anfrage', label: 'Anfrage' },
        ]}
      />

      <div className="shell py-16 md:py-24 lg:py-32">

        {/* Main Grid for content and form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          <div className="lg:col-span-8 flex flex-col gap-16">

            {/* The actual form */}
            <section className="bg-[oklch(0.968_0.004_260)] rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] p-6 md:p-10 shadow-[0_8px_32px_-4px_oklch(0.16_0.02_260/0.05)]">
              <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
                Ihr Anliegen strukturieren
              </h2>
              <AllgemeineAnfrage themen={themen} vorauswahl={thema} />
            </section>

            {/* Deep Content Sektion: Methodik und Architektur */}
            <section className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[oklch(0.16_0.02_260)] prose-p:text-[oklch(0.32_0.02_260)] prose-p:leading-relaxed prose-a:text-[oklch(0.52_0.24_260)] prose-a:no-underline hover:prose-a:underline">
              <h2>Architektonische Methodik bei Sonderanfragen</h2>
              <p>
                Die professionelle Sicherheitstechnik und moderne Schließanlagen-Architektur erfordern oftmals Lösungen,
                die über standardisierte Konfigurationen hinausgehen. Wenn Ihr spezifisches Anliegen, sei es die
                Integration von mechatronischen Hochsicherheitssystemen in historische Bausubstanz, die Konzeption
                von komplexen Fluchtwegsteuerungen nach DIN EN 13637 oder die Entwicklung eines Masterplan-Schließkonzepts
                für verteilte Liegenschaften, nicht in klassische Raster fällt, greift unser erweiterter Evaluierungsprozess.
              </p>

              <p>
                Wir betrachten jede Anfrage als individuelles Systemprojekt. Dies beginnt mit einer präzisen Anforderungsanalyse,
                bei der wir sowohl die physischen Gegebenheiten vor Ort als auch die digitalen und organisatorischen
                Prozesse Ihres Unternehmens oder Ihrer Einrichtung berücksichtigen. Im Gegensatz zu standardisierten
                Baukastensystemen ermöglicht uns dieser Ansatz eine holistische Betrachtung von Sicherheit, Komfort und
                Skalierbarkeit. Unsere Methodik stützt sich auf etablierte Industriestandards und aktuelle VdS-Richtlinien,
                um höchste Resilienz gegen physische und digitale Angriffsvektoren zu gewährleisten.
              </p>

              <h3>Der Evaluierungszyklus</h3>
              <p>
                Sobald Ihre Anfrage bei uns eingeht, durchläuft sie einen mehrstufigen Evaluierungszyklus. Zunächst erfolgt
                eine grobe Kategorisierung (Triage) durch unser Expertenteam, um die Dringlichkeit und das primäre
                Fachgebiet (z. B. Elektronik, Mechanik, Software-Integration) zu bestimmen. Anschließend wird das
                Vorhaben auf technische Machbarkeit geprüft. Dies beinhaltet oft die Konsultation von Herstellerspezifikationen,
                die Prüfung von Kompatibilitätsmatrizen bestehender Systeme und die Bewertung von bauaufsichtlichen
                Zulassungen.
              </p>
              <p>
                In vielen Fällen, insbesondere bei vernetzten Zutrittskontrollsystemen, ist eine nahtlose API-Integration in
                Ihre bestehende IT-Infrastruktur erforderlich. Unsere Systemarchitekten prüfen hierbei Protokolle wie OSDP
                (Open Supervised Device Protocol) oder MQTT, um eine sichere, verschlüsselte Kommunikation der Edge-Devices
                mit den zentralen Management-Plattformen sicherzustellen. Erst nach Abschluss dieser Evaluierung
                unterbreiten wir Ihnen einen strukturierten Lösungsvorschlag inklusive Budgetrahmen.
              </p>

              <h2>Vergleichsmatrix: Standard vs. Spezifische Projektierung</h2>
              <p>
                Um den Unterschied zwischen einem regulären Service-Auftrag und einer spezifischen Systemprojektierung
                zu verdeutlichen, dient die folgende Gegenüberstellung. Sie zeigt, warum komplexe Anfragen eine fundierte
                Planungsphase erfordern.
              </p>
              <div className="not-prose my-8 overflow-x-auto rounded-xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">
                <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
                  <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                    <tr>
                      <th className="border-b border-[oklch(0.890_0.008_260/0.55)] px-4 py-3 font-semibold">Parameter</th>
                      <th className="border-b border-[oklch(0.890_0.008_260/0.55)] px-4 py-3 font-semibold">Standard-Service</th>
                      <th className="border-b border-[oklch(0.890_0.008_260/0.55)] px-4 py-3 font-semibold">Spezifische Projektierung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.890_0.008_260/0.55)]">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Planungshorizont</td>
                      <td className="px-4 py-3">Kurzfristig (1-3 Tage)</td>
                      <td className="px-4 py-3">Mittelfristig (Wochen bis Monate)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Schnittstellen</td>
                      <td className="px-4 py-3">Isoliertes System (z.B. mechanischer Zylinder)</td>
                      <td className="px-4 py-3">Vernetzt (API, Brandmeldeanlage, HR-Software)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Normen & Richtlinien</td>
                      <td className="px-4 py-3">Basis-DIN-Normen</td>
                      <td className="px-4 py-3">VdS, EN 13637, ISO 27001 (für Software)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[oklch(0.16_0.02_260)]">Skalierbarkeit</td>
                      <td className="px-4 py-3">Statisch</td>
                      <td className="px-4 py-3">Dynamisch, Mandantenfähig</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Sicherheitsarchitektur & Physische Resilienz</h2>
              <p>
                Ein wesentlicher Aspekt bei jeder Sonderanfrage ist die Bewertung der physischen und digitalen Resilienz.
                Wir setzen dabei auf das Konzept der &quot;Defense in Depth&quot;, also der mehrschichtigen Verteidigung. Ein einzelner
                hochwertiger Schließzylinder ist wirkungslos, wenn das Schließblech nicht im Mauerwerk verankert ist oder
                die elektronische Ansteuerung durch Replay-Attacken kompromittiert werden kann.
              </p>
              <p>
                Daher analysieren wir bei der Evaluierung Ihres Vorhabens immer den gesamten Systemverbund. Wir prüfen,
                ob elektronische Komponenten kryptografisch abgesichert sind (z.B. durch MIFARE DESFire EV3 mit AES-128
                Verschlüsselung) und ob mechanische Bauteile entsprechenden Widerstandsklassen (RC) nach DIN EN 1627
                genügen. Nur durch diese integrale Betrachtung können wir sicherstellen, dass die vorgeschlagene Lösung
                einem realistischen Bedrohungsszenario standhält und Investitionssicherheit bietet.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="bg-[oklch(0.988_0.002_260)] rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] p-8 mt-4">
              <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
                Häufig gestellte Fragen (FAQ) zur Projektierung
              </h2>
              <div className="space-y-6">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 text-[oklch(0.16_0.02_260)] font-medium border border-[oklch(0.890_0.008_260/0.55)] transition-colors hover:bg-[oklch(0.95_0.004_260)]">
                    Welche Informationen benötigen Sie für eine fundierte Ersteinschätzung?
                    <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-[oklch(0.52_0.24_260)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 px-4 leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Je detaillierter Ihre Angaben, desto präziser unsere Rückmeldung. Hilfreich sind Baupläne, Fotos
                    der bestehenden Situation (Türen, Beschläge), Anforderungen aus Brandschutzkonzepten (z. B. Flucht-
                    und Rettungswegpläne) sowie Spezifikationen zu gewünschten Schnittstellen (z.B. Anbindung an
                    Zeiterfassungssoftware). Auch eine Nennung des gewünschten Sicherheitsniveaus oder relevanter
                    VdS-Klassen beschleunigt den Prozess erheblich.
                  </p>
                </details>

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 text-[oklch(0.16_0.02_260)] font-medium border border-[oklch(0.890_0.008_260/0.55)] transition-colors hover:bg-[oklch(0.95_0.004_260)]">
                    Wie lange dauert die Evaluierung meiner komplexen Anfrage?
                    <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-[oklch(0.52_0.24_260)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 px-4 leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Für Standardanfragen erhalten Sie in der Regel innerhalb von 24 bis 48 Stunden eine Rückmeldung.
                    Bei hochkomplexen Systemplanungen, die eine Abstimmung mit Herstellern erfordern (z. B. Sonderanfertigungen
                    von Mechatronik-Zylindern) oder die Prüfung rechtlicher Rahmenbedingungen (DIN EN 13637 für Fluchttüren)
                    bedingen, kann die Ausarbeitung einer fundierten Projektstudie 5 bis 10 Werktage in Anspruch nehmen.
                    Nutzen Sie hierfür auch unser interaktives Tool zur Ersteinschätzung auf dieser Seite.
                  </p>
                </details>

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 text-[oklch(0.16_0.02_260)] font-medium border border-[oklch(0.890_0.008_260/0.55)] transition-colors hover:bg-[oklch(0.95_0.004_260)]">
                    Können Sie auch Fremdsysteme integrieren oder warten?
                    <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-[oklch(0.52_0.24_260)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 px-4 leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Grundsätzlich ja, vorausgesetzt, die Systeme verfügen über offene Standardschnittstellen (z.B. OSS
                    Standard Offline für Zutrittskontroll-Komponenten) oder gut dokumentierte APIs. Bei geschlossenen,
                    proprietären Systemen (Vendor Lock-in) müssen wir im Einzelfall prüfen, ob eine Übernahme der Wartung
                    oder eine Erweiterung durch Gateways möglich ist. Wir beraten Sie herstellerunabhängig zur besten
                    Migrationsstrategie.
                  </p>
                </details>

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 text-[oklch(0.16_0.02_260)] font-medium border border-[oklch(0.890_0.008_260/0.55)] transition-colors hover:bg-[oklch(0.95_0.004_260)]">
                    Wie gewährleisten Sie Datenschutz bei vernetzten Zutrittssystemen?
                    <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-[oklch(0.52_0.24_260)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 px-4 leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Privacy by Design ist ein integraler Bestandteil unserer Architekturplanung. Wir konzipieren Systeme so,
                    dass sie DSGVO-konform betrieben werden können. Dies umfasst die Minimierung der erhobenen Daten,
                    die Implementierung von Rollen- und Berechtigungskonzepten (RBAC) sowie die Verschlüsselung von
                    Datenströmen (TLS 1.3) und Speichermedien. Bei Bedarf binden wir auch Ihren betrieblichen
                    Datenschutzbeauftragten frühzeitig in die Konzeptionsphase ein.
                  </p>
                </details>

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 text-[oklch(0.16_0.02_260)] font-medium border border-[oklch(0.890_0.008_260/0.55)] transition-colors hover:bg-[oklch(0.95_0.004_260)]">
                    Was passiert, wenn sich meine Anforderungen während des Projekts ändern?
                    <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-[oklch(0.52_0.24_260)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 px-4 leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Wir arbeiten bevorzugt mit agilen oder hybrid-agilen Projektmanagement-Methoden. Das bedeutet, dass wir
                    die Implementierung in Phasen (Milestones) strukturieren. Sollten sich Ihre Anforderungen ändern –
                    beispielsweise durch neue räumliche Gegebenheiten oder geänderte Sicherheitsrichtlinien – können wir
                    diese im Rahmen des Change-Managements in die nächste Phase integrieren. Skalierbare Systeme sind
                    darauf ausgelegt, auch nachträglich flexibel angepasst zu werden.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar / Interactive Module */}
          <div className="lg:col-span-4 sticky top-8">
            <InteractiveModule />
          </div>

        </div>
      </div>
    </>
  );
}
