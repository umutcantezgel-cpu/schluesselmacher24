import type { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { ProjektBudgetKalkulator } from '@/components/calculator/projekt-budget-kalkulator';

export const metadata: Metadata = {
  title: 'Ratgeber',
  description:
    'Antworten auf die häufigsten Fragen rund um Autoschlüssel, Schlüssel, Schließtechnik und '
    + 'Einbruchschutz — jeweils mit einem klaren nächsten Schritt.',
  alternates: { canonical: '/ratgeber' },
};

export default async function RatgeberPage() {
  const guides = await getGuides();

  const grouped = NAV_AREAS.map((area) => ({
    area,
    guides: guides.filter((g) => g.topic === area.key),
  })).filter((group) => group.guides.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Ratgeber"
        title="Antworten auf die häufigsten Fragen"
        lead="Jeder Beitrag beantwortet eine konkrete Frage und sagt Ihnen, was Sie danach tun können. Unsere Methodik basiert auf jahrzehntelanger Expertise in der Schließ- und Sicherheitstechnik."
        crumbs={[{ href: '/ratgeber', label: 'Ratgeber' }]}
      />

      <Section labelledBy="technologische-tiefe" className="py-16 md:py-24 lg:py-32">
        <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <h2 id="technologische-tiefe" className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">
              Tiefgreifende Technologische Expertise
            </h2>
            <div className="mt-6 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Die moderne Sicherheitstechnik durchläuft eine rasante Evolution. Was gestern noch als Standard galt,
                ist heute oftmals nicht mehr ausreichend, um den gestiegenen Anforderungen an Einbruchschutz und
                Zutrittskontrolle gerecht zu werden. Unsere technologische Methodik setzt genau hier an: Wir evaluieren
                kontinuierlich die neuesten Entwicklungen im Bereich der Schließanlagen, mechatronischen Zylinder und
                smarten Zutrittslösungen.
              </p>
              <p>
                Ein wesentlicher Aspekt unserer Arbeit ist die präzise Analyse der bestehenden Infrastruktur.
                Bevor wir eine Empfehlung aussprechen, prüfen wir die mechanische Integrität der Schließbleche,
                die Widerstandsklasse (RC-Klasse) der Türen und die Kompatibilität mit digitalen Systemen.
                Dabei stützen wir uns auf fundierte Metriken wie die Abtastsicherheit von Zylindern, den
                Bohrschutz nach DIN EN 1303 und die Verschlüsselungsprotokolle (z.B. AES-128 oder AES-256)
                bei elektronischen Schlüsseln.
              </p>
              <p>
                Unsere Leistungsarchitektur ist modular aufgebaut. Das bedeutet, dass Kunden nicht zwangsläufig das
                teuerste Komplettsystem erwerben müssen. Oftmals reicht ein gezieltes Upgrade kritischer Komponenten –
                wie der Austausch eines Standardzylinders gegen einen Profilzylinder mit VdS-Anerkennung und
                Sicherungskarte. Diese granulare Herangehensweise ermöglicht es uns, maßgeschneiderte Sicherheitskonzepte
                zu entwickeln, die sowohl höchsten Ansprüchen genügen als auch wirtschaftlich effizient sind.
              </p>
              <p>
                Besonderes Augenmerk legen wir auf die Integration von Fahrzeugschlüsseln in moderne
                Mobilitätskonzepte. Die Programmierung von Transpondern für die Wegfahrsperre erfordert
                tiefgreifendes Wissen über die proprietären Protokolle der Automobilhersteller. Wir nutzen
                hochspezialisierte Diagnosegeräte, um neue Schlüssel nahtlos in das elektronische Steuergerät (ECU)
                des Fahrzeugs einzulernen, ohne die Fahrzeuggarantie zu gefährden. Darüber hinaus beschäftigen wir uns
                intensiv mit den Herausforderungen und Lösungen rund um Smart-Key-Systeme (Keyless Go), welche zunehmend
                von Relay-Attacken bedroht sind. Hier implementieren wir beispielsweise spezielle Schutzschichten, wie
                Bewegungssensoren im Schlüssel (Sleep-Mode), die eine Signalverlängerung durch Diebe effektiv unterbinden,
                sobald der Schlüssel eine Zeit lang unbewegt ruht.
              </p>
              <p>
                Ein weiterer Eckpfeiler unserer technologischen Philosophie ist die vorausschauende Wartung
                und das Lifecycle-Management von komplexen Schließanlagen. Es reicht nicht aus, eine Anlage lediglich
                einmalig fachgerecht zu installieren. Mechanische Bauteile unterliegen einem natürlichen Verschleiß, und
                auch elektronische Komponenten bedürfen regelmäßiger Firmware-Updates, um gegen neu entdeckte
                Sicherheitslücken gewappnet zu sein (Over-the-Air Updates bei smarten Zylindern).
                Wir dokumentieren den Zustand der Anlagen akribisch und setzen auf prädiktive Analytik, um
                Wartungsintervalle bedarfsgerecht zu steuern. So gewährleisten wir, dass die Schließ- und Sicherheitstechnik
                über Jahrzehnte hinweg ihren maximalen Schutzfaktor beibehält, Ausfallzeiten minimiert werden und
                die Total Cost of Ownership (TCO) für unsere Kunden in einem transparenten, planbaren Rahmen bleiben.
              </p>
            </div>

            <div className="mt-12">
               <ProjektBudgetKalkulator />
            </div>

            <div className="mt-16 space-y-8">
              <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">
                Vergleichsmatrix: Schließsysteme
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)] border-collapse">
                  <thead className="bg-[oklch(0.968_0.004_260)] border-b border-[oklch(0.89_0.008_260/0.55)]">
                    <tr>
                      <th className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Kriterium</th>
                      <th className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Mechanisch (Standard)</th>
                      <th className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Mechanisch (Hochsicherheit)</th>
                      <th className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Elektronisch / Mechatronisch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                    <tr>
                      <td className="py-4 px-6 font-medium">Kopierschutz</td>
                      <td className="py-4 px-6">Gering</td>
                      <td className="py-4 px-6">Sehr Hoch (Sicherungskarte)</td>
                      <td className="py-4 px-6">Maximal (Kryptografie)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Bohrschutz</td>
                      <td className="py-4 px-6">Basis</td>
                      <td className="py-4 px-6">Integriert (Hartmetall)</td>
                      <td className="py-4 px-6">Integriert (Hartmetall)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Zutrittsverwaltung</td>
                      <td className="py-4 px-6">Statisch</td>
                      <td className="py-4 px-6">Statisch</td>
                      <td className="py-4 px-6">Dynamisch (Zeitlich/Räumlich)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Schlüsselverlust</td>
                      <td className="py-4 px-6">Zylindertausch nötig</td>
                      <td className="py-4 px-6">Zylindertausch nötig</td>
                      <td className="py-4 px-6">Einfaches Sperren per Software</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Wartungsaufwand</td>
                      <td className="py-4 px-6">Sehr Gering (Pflegespray)</td>
                      <td className="py-4 px-6">Gering</td>
                      <td className="py-4 px-6">Moderat (Batteriewechsel, Updates)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium">Flexibilität bei Umzug</td>
                      <td className="py-4 px-6">Starr</td>
                      <td className="py-4 px-6">Starr</td>
                      <td className="py-4 px-6">Sehr Hoch (Neuprogrammierung)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight mb-8">
                Häufig gestellte Fragen (FAQ)
              </h3>
              <div className="space-y-6">
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Wie hoch ist die Sicherheit bei nachgemachten Autoschlüsseln?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Nachgemachte Autoschlüssel, die durch unsere zertifizierten Techniker programmiert werden, bieten exakt dasselbe
                    Sicherheitsniveau wie die Originalschlüssel des Herstellers. Wir verwenden modernste Kryptografie-Standards
                    (wie AES) zur Programmierung des Transponders, wodurch die Wegfahrsperre das Signal als authentisch erkennt.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Was bedeutet die Widerstandsklasse (RC) bei Türen?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Die Resistance Class (RC) gibt an, wie lange eine Tür einem Einbruchsversuch mit bestimmten Werkzeugen standhält.
                    Für Privathaushalte empfehlen polizeiliche Beratungsstellen mindestens Türen der Klasse RC2. Diese bieten einen
                    soliden Grundschutz gegen Gelegenheitseinbrecher, die einfache Werkzeuge wie Schraubendreher oder Zangen verwenden.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Warum brauche ich eine Sicherungskarte für meinen Zylinder?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Eine Sicherungskarte ist das zentrale Legitimationsdokument für Hochsicherheitszylinder. Ohne Vorlage dieser Karte
                    darf und kann kein Schlüsseldienst Nachschlüssel anfertigen. Dies schützt Sie effektiv vor illegalen Schlüsselkopien,
                    beispielsweise wenn Sie Ihren Schlüssel kurzzeitig aus der Hand geben müssen.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Lassen sich elektronische Zutrittssysteme in bestehende Türen nachrüsten?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Ja, in den allermeisten Fällen ist eine Nachrüstung problemlos möglich. Mechatronische Schließzylinder haben
                    die gleichen Abmessungen (Europrofil) wie rein mechanische Zylinder und können oft innerhalb weniger Minuten
                    ausgetauscht werden – ganz ohne Bohren oder aufwändige Kabelverlegung an der Tür. Moderne Systeme nutzen
                    stromsparende Bluetooth Low Energy (BLE) Technologie und kompakte Knopfzellen, die eine Laufzeit von mehreren
                    Jahren erreichen.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Wie verhalte ich mich bei Verlust eines Schlüssels aus einer Schließanlage?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Bei mechanischen Anlagen sollte umgehend die Hausverwaltung oder der Sicherheitsbeauftragte informiert werden,
                    da oft zentrale Zylinder getauscht werden müssen. Bei elektronischen Anlagen ist der Prozess deutlich
                    einfacher: Der verlorene Transponder oder Chip wird in der Verwaltungssoftware einfach gesperrt und ein
                    neuer wird angelernt. Der physische Tausch von Zylindern entfällt komplett, was enorme Kosten spart.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                  <h4 className="text-lg font-medium text-[oklch(0.16_0.02_260)] mb-2">Sind smarte Türschlösser anfällig für Hackerangriffe?</h4>
                  <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Professionelle Smart-Locks renommierter Hersteller setzen auf End-to-End-Verschlüsselung, ähnlich wie sie beim
                    Online-Banking verwendet wird. Solange Sie regelmäßige Software-Updates (Over-the-Air) durchführen und starke,
                    einzigartige Passwörter für Ihre Konten verwenden, ist das Risiko eines erfolgreichen digitalen Angriffs
                    verschwindend gering und in der Praxis weitaus aufwändiger als das mechanische Aufhebeln einer ungesicherten Tür.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="ratgeber-register">
        <h2 id="ratgeber-register" className="sr-only">
          Beiträge nach Bereich
        </h2>
        <ol className="border-t border-border">
          {grouped.map((group, index) => (
            <li key={group.area.key} className="border-b border-border">
              <AreaScope area={group.area.key}>
                <div className="grid gap-x-gutter gap-y-4 py-8 lg:grid-cols-12">
                  <div className="flex items-start gap-4 lg:col-span-4">
                    <span className="w-6 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <BereichIcon area={group.area.key} size={40} className="shrink-0 text-area-strong" />
                    <h3 className="pt-1.5 text-title font-semibold text-foreground">{group.area.label}</h3>
                  </div>

                  <ul className="lg:col-span-8">
                    {group.guides.map((guide, guideIndex) => (
                      <li key={guide.id} className={cn(guideIndex > 0 && 'border-t border-border')}>
                        <Link
                          href={`/ratgeber/${guide.slug}`}
                          className={cn('group flex flex-col gap-2', guideIndex > 0 ? 'py-5' : 'pb-5 lg:pt-1')}
                        >
                          <span className="flex items-start justify-between gap-3">
                            <span className="text-title-sm font-semibold text-foreground group-hover:text-primary">
                              {guide.title}
                            </span>
                            <GlyphPfeilRechts
                              size={18}
                              className="mt-1 shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                            />
                          </span>
                          <span className="max-w-measure text-small text-foreground-muted">{guide.excerpt}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AreaScope>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
