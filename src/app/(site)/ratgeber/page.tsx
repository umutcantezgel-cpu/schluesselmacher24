import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';

export const metadata: Metadata = {
  title: 'Ratgeber',
  description:
    'Antworten auf die häufigsten Fragen rund um Autoschlüssel, Schlüssel, Schließtechnik und '
    + 'Einbruchschutz — jeweils mit einem klaren nächsten Schritt.',
  alternates: { canonical: '/ratgeber' },
};

export default async function RatgeberPage() {
  const guides = await getGuides();

  // Nach Themenbereich gruppieren, damit die Übersicht der Navigation folgt.
  const grouped = NAV_AREAS.map((area) => ({
    area,
    guides: guides.filter((g) => g.topic === area.key),
  })).filter((group) => group.guides.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Ratgeber"
        title="Antworten auf die häufigsten Fragen"
        lead="Jeder Beitrag beantwortet eine konkrete Frage und sagt Ihnen, was Sie danach tun können."
        crumbs={[{ href: '/ratgeber', label: 'Ratgeber' }]}
      />

      <Section>
        <div className="space-y-12">
          {grouped.map((group) => (
            <div key={group.area.key}>
              <h2 className="text-lg font-bold text-foreground">{group.area.label}</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((guide) => (
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
                        Lesen
                        <ArrowRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="mt-16 bg-[oklch(0.988_0.002_260)] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-6">
              Institutionelle Leistungsübersicht und Systemarchitektur
            </h2>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
              Die Planung und Umsetzung moderner Schließanlagen und Zutrittskontrollsysteme erfordert ein Höchstmaß an architektonischem und sicherheitstechnischem Verständnis. In einer Zeit, in der physische und digitale Bedrohungen zunehmend konvergieren, ist die Wahl der richtigen Systemarchitektur entscheidend für die langfristige Integrität von Gebäuden und Anlagen. Unsere methodische Herangehensweise basiert auf einer detaillierten Risikoanalyse und der Implementierung mehrschichtiger Sicherheitskonzepte, die sowohl präventive als auch reaktive Maßnahmen umfassen.
            </p>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
              Jedes Sicherheitssystem wird als kohärentes Ganzes betrachtet, bei dem mechanische Komponenten, elektronische Zutrittskontrollen und softwarebasierte Management-Tools nahtlos ineinandergreifen. Diese holistische Perspektive gewährleistet nicht nur einen optimalen Schutz, sondern auch eine hohe Benutzerfreundlichkeit und administrative Effizienz. Die Skalierbarkeit der Systeme ist dabei ein zentraler Aspekt, um auch zukünftigen Anforderungen und Erweiterungen gerecht zu werden.
            </p>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
              Darüber hinaus legen wir großen Wert auf die Einhaltung aktueller Normen und Zertifizierungen. Unsere Lösungen entsprechen den strengsten Anforderungen der relevanten DIN- und EN-Standards und bieten somit eine belastbare Grundlage für den Versicherungsschutz. Die kontinuierliche Schulung unserer Techniker und die enge Zusammenarbeit mit führenden Herstellern garantieren, dass wir stets auf dem neuesten Stand der Technik agieren.
            </p>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
              Ein weiterer wesentlicher Baustein unserer Architektur ist die Integration von Monitoring- und Alarmierungssystemen. Durch die Echtzeitüberwachung von Zugangsereignissen und Systemzuständen können Anomalien frühzeitig erkannt und entsprechende Gegenmaßnahmen eingeleitet werden. Die detaillierte Protokollierung aller Vorgänge unterstützt zudem bei der forensischen Analyse von Vorfällen und der kontinuierlichen Optimierung der Sicherheitsprozesse.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-6">
              Methodischer Transformationsprozess in vier auditierbaren Phasen
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mb-3">1. Assessment & Auditierung</h3>
                <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                  Der erste Schritt umfasst eine umfassende Bestandsaufnahme der bestehenden Sicherheitsinfrastruktur. Wir analysieren Schwachstellen, bewerten die aktuellen Risiken und definieren die spezifischen Schutzziele in enger Abstimmung mit den Stakeholdern. Dieser Prozess wird durch standardisierte Audit-Protokolle dokumentiert.
                </p>
              </div>
              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mb-3">2. Architektonisches Design</h3>
                <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                  Auf Basis der Audit-Ergebnisse entwickeln wir ein maßgeschneidertes Sicherheitskonzept. Dies beinhaltet die Auswahl der geeigneten Hardware- und Software-Komponenten, die Planung der Netzwerkarchitektur und die Definition der Zutrittsrechte. Das Design wird in einem detaillierten Pflichtenheft festgehalten.
                </p>
              </div>
              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mb-3">3. Implementierung & Integration</h3>
                <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                  Die Umsetzung erfolgt durch unsere zertifizierten Systemintegratoren. Wir koordinieren die Installation der mechanischen und elektronischen Komponenten, richten die Software-Plattformen ein und integrieren das System in die bestehende IT-Infrastruktur. Ein striktes Projektmanagement sichert die termingerechte Fertigstellung.
                </p>
              </div>
              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mb-3">4. Verifikation & Handover</h3>
                <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                  Vor der Übergabe durchläuft das System einen rigorosen Testprozess. Wir simulieren verschiedene Angriffsszenarien und überprüfen die Zuverlässigkeit der Alarmierungsketten. Nach erfolgreichem Abschluss erfolgt die Einweisung der Administratoren und die Übergabe der vollständigen Systemdokumentation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <EnterpriseRoiCalculator />
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
              Detaillierte Fach-FAQ mit tiefgreifenden Erläuterungen
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Welche Vorteile bietet ein elektronisches Zutrittskontrollsystem im Vergleich zu einer mechanischen Schließanlage?",
                  a: "Elektronische Systeme bieten eine ungleich höhere Flexibilität und Sicherheit. Bei Verlust eines Transponders kann dieser sofort gesperrt werden, ohne dass Zylinder ausgetauscht werden müssen. Zudem ermöglichen sie eine detaillierte Protokollierung der Zutrittsereignisse und die zeitliche Befristung von Berechtigungen. Die Skalierbarkeit erlaubt es, das System jederzeit an veränderte Unternehmensstrukturen anzupassen. Auch die Integration in andere Gebäudemanagementsysteme (z.B. Zeiterfassung, Alarmtechnik) ist problemlos möglich, was die Gesamteffizienz deutlich steigert."
                },
                {
                  q: "Wie wird die Ausfallsicherheit bei stromgeführten Systemen gewährleistet?",
                  a: "Die Ausfallsicherheit wird durch redundante Energieversorgungskonzepte sichergestellt. Dies umfasst in der Regel eine unterbrechungsfreie Stromversorgung (USV) für die zentralen Steuerungskomponenten sowie Batterie-Backups in den dezentralen Lesegeräten und Beschlägen. Darüber hinaus sind die Systeme so konzipiert, dass bei einem kompletten Energieausfall mechanische Rückfallebenen (z.B. Profilzylinder) zur Verfügung stehen, um die Fluchtwege stets offenzuhalten und den Zutritt für berechtigte Personen sicherzustellen."
                },
                {
                  q: "Welche Verschlüsselungsstandards werden bei der Datenübertragung verwendet?",
                  a: "Moderne Zutrittskontrollsysteme nutzen hochsichere Verschlüsselungsalgorithmen wie AES (Advanced Encryption Standard) mit Schlüssellängen von mindestens 128 Bit, oftmals auch 256 Bit. Dies gilt sowohl für die Kommunikation zwischen den Transpondern und Lesegeräten (z.B. MIFARE DESFire EV2/EV3) als auch für die Datenübertragung zwischen den Lesern und den zentralen Controllern (z.B. OSDP v2 mit Secure Channel). Die Speicherung der Daten in der Datenbank erfolgt ebenfalls verschlüsselt, um höchste Datensicherheit zu gewährleisten."
                },
                {
                  q: "Wie lassen sich bestehende Systeme in eine neue Architektur migrieren?",
                  a: "Eine Migration erfordert eine sorgfältige Planung, um Betriebsunterbrechungen zu minimieren. In vielen Fällen ist eine schrittweise Umrüstung möglich, bei der alte und neue Systeme parallel betrieben werden. Intelligente Controller können oft verschiedene Leser-Technologien gleichzeitig verarbeiten. Wichtig ist eine detaillierte Bestandsaufnahme der vorhandenen Hardware und Kabelwege, um zu prüfen, welche Komponenten weiterverwendet werden können. Die Übernahme der Nutzerdaten aus der alten Datenbank in das neue System erfolgt durch automatisierte Skripte."
                },
                {
                  q: "Welche Rolle spielt die Netzwerksicherheit (Cybersecurity) bei IP-basierten Systemen?",
                  a: "Da moderne Systeme zunehmend IP-basiert sind, ist Cybersecurity von entscheidender Bedeutung. Die Controller und Server müssen in separaten, abgeschotteten VLANs (Virtual Local Area Networks) betrieben werden. Strikte Firewall-Regeln kontrollieren den Datenverkehr. Regelmäßige Firmware-Updates schließen bekannte Sicherheitslücken. Zudem wird die Authentifizierung der Geräte im Netzwerk (z.B. nach IEEE 802.1X) und der Administratoren (Multi-Faktor-Authentifizierung) zwingend empfohlen, um unbefugte Zugriffe auf die Management-Software zu verhindern."
                },
                {
                  q: "Wie hoch ist der Wartungsaufwand für ein Enterprise-Zutrittskontrollsystem?",
                  a: "Der Wartungsaufwand hängt stark von der Systemgröße und -komplexität ab. Elektronische Systeme erfordern regelmäßige Software-Updates und Backups der Datenbanken. Die Batterien der mechatronischen Zylinder und Beschläge müssen turnusmäßig (meist alle 1-3 Jahre) gewechselt werden. Viele Systeme bieten hierfür proaktive Warnmeldungen. Die mechanischen Komponenten, wie Türschließer und Schlösser, sollten jährlich auf Verschleiß und Funktionstüchtigkeit geprüft werden. Ein professioneller Wartungsvertrag stellt die langfristige Verfügbarkeit und Sicherheit des Systems sicher."
                }
              ].map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)] mb-2">{faq.q}</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
