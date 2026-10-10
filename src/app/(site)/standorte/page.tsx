import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, Clock, Truck, FileText } from 'lucide-react';

import { getCities } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { RegionalServiceCalculator } from '@/components/standorte/regional-service-calculator';

export const metadata: Metadata = {
  title: 'Einsatzgebiete',
  description:
    'Vor-Ort-Leistungen in ausgewählten Regionen, Versand von Schlüsseln und Zylindern deutschlandweit. Entdecken Sie unsere Standorte und Services.',
  alternates: { canonical: '/standorte' },
};

export default async function StandortePage() {
  const cities = await getCities();

  return (
    <>
      <PageHeader
        eyebrow="Einsatzgebiete & Regionale Services"
        title="Präzise Sicherheitstechnik vor Ort und deutschlandweit"
        lead="Wir verbinden regionale Erreichbarkeit mit bundesweiter Expertise. Erfahren Sie alles über unsere Vor-Ort-Einsatzgebiete, Anfahrtszeiten und deutschlandweiten Versandservices für Sicherheitstechnik."
        crumbs={[{ href: '/standorte', label: 'Einsatzgebiete' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Architektonische Methodik der Einsatzplanung"
              title="Detaillierte Analyse unserer Einsatzgebiete und Service-Infrastruktur"
              lead="Die Verfügbarkeit von Sicherheitstechnik und die Reaktionszeit im Notfall sind entscheidende Kriterien für die Zuverlässigkeit unserer Dienstleistungen. Unsere Einsatzplanung basiert auf einer architektonischen Methodik, die sowohl regionale Nähe als auch überregionale Skalierbarkeit gewährleistet."
            />

            <div className="mt-6 prose-sm24 max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed space-y-5">
              <p>
                Sicherheit ist nicht nur eine Frage der verbauten Technik, sondern auch der zeitnahen und fachgerechten Implementierung. Unsere dezentrale Service-Infrastruktur ermöglicht es uns, in definierten Kernregionen mit maximaler Effizienz und kurzen Reaktionszeiten zu agieren. Diese Kerngebiete bilden das Rückgrat unserer Vor-Ort-Leistungen, während unser zentral gesteuertes Logistiknetzwerk eine bundesweite Versorgung mit hochpräzisen Schließsystemen und Spezialkomponenten sicherstellt.
              </p>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">Die Zweigleisigkeit unseres Service-Modells</h3>

              <p>
                Wir differenzieren bewusst zwischen Leistungen, die eine physische Präsenz erfordern, und solchen, die digital oder auf dem Versandweg erbracht werden können. Diese strategische Zweiteilung maximiert die Servicequalität für unsere Kunden:
              </p>

              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <strong>Regionale Vor-Ort-Einsätze:</strong> Komplexere Installationen, wie die Einrichtung umfangreicher Schließanlagen in Gewerbeobjekten, die Montage von elektronischen Zutrittskontrollsystemen oder die Fehlerdiagnose an bestehenden Sicherheitstüren, erfordern die Expertise unserer Techniker vor Ort. Für diese Einsätze definieren wir klare Radien um unsere Stützpunkte, um planbare Anfahrtskosten und verbindliche Reaktionszeiten zu garantieren.
                </li>
                <li>
                  <strong>Bundesweite Fernleistungen:</strong> Ein Großteil der Ersatzbeschaffungen und Erweiterungen – etwa die Fertigung von Schlüsseln nach Code, die Lieferung gleichschließender Profilzylinder oder der Ersatz von Transpondern – kann vollkommen autark von Ihrem Standort abgewickelt werden. Hier profitieren Sie deutschlandweit von unserer maschinellen Präzisionsfertigung und unseren gesicherten Logistikprozessen.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">Regionale Sicherheitsanforderungen im Fokus</h3>

              <p>
                Die Sicherheitsanforderungen variieren stark je nach Region und Objekttyp. Ein historisches Altbau-Viertel im urbanen Raum stellt andere Anforderungen an den Einbruchschutz als ein modernes Industriegebiet in der Peripherie. Unsere Techniker sind nicht nur mit den modernsten Systemen vertraut, sondern auch mit den spezifischen regionalen Gegebenheiten, polizeilichen Beratungsstellen und den präferierten Einbruchsmethoden in den jeweiligen Gebieten.
              </p>

              <p>
                Dies ermöglicht uns, in der Beratung vor Ort maßgeschneiderte Konzepte zu entwickeln, die über standardisierte Kataloglösungen hinausgehen. Wir berücksichtigen Aspekte wie die mechanische Belastbarkeit der Bausubstanz, bestehende Flucht- und Rettungswegvorschriften (DIN EN 179 / 1125) sowie die Integration in regionale Gefahrenmeldeanlagen. Die enge Verzahnung von regionalem Know-how und überregionalem technologischen Know-how ist der Garant für unser hohes Sicherheitsniveau.
              </p>
            </div>
          </div>

          <div className="lg:pl-8 flex flex-col justify-center">
            <RegionalServiceCalculator />
          </div>
        </div>
      </Section>

      <Section tone="muted" className="bg-[oklch(0.988_0.002_260)] py-16 md:py-24">
        <SectionHeading
          title="Unsere Kernregionen für Vor-Ort-Einsätze"
          lead="Jede Region wird von spezialisierten Teams betreut, die mit den lokalen Gegebenheiten bestens vertraut sind."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <li key={city.id} className="h-full">
              <Link
                href={`/standorte/${city.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 transition-all hover:border-[oklch(0.52_0.24_260)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.05)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.1)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] group-hover:bg-[oklch(0.52_0.24_260)] group-hover:text-white transition-colors">
                    <MapPin size={20} aria-hidden />
                  </div>
                  <span className="text-[18px] font-bold text-[oklch(0.16_0.02_260)]">
                    {city.city}
                  </span>
                </div>

                <div className="mt-6 flex-1 space-y-3">
                  <div className="flex justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">
                    <span className="text-sm text-[oklch(0.32_0.02_260)]">Bundesland</span>
                    <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">{city.state}</span>
                  </div>
                  <div className="flex justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">
                    <span className="text-sm text-[oklch(0.32_0.02_260)]">Einsatzradius</span>
                    <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">ca. {city.onSiteRadiusKm} km</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-sm text-[oklch(0.32_0.02_260)]">Notdienst</span>
                    <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Auf Anfrage</span>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.24_260)] group-hover:text-[oklch(0.46_0.24_260)]">
                  Regionale Details ansehen
                  <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" title="Ihre Region ist nicht explizit aufgeführt?" className="mt-12">
          Kein Problem. Bestellungen aus dem Onlineshop liefern wir zuverlässig deutschlandweit. Für größere Vor-Ort-Projekte (z.B. die Installation einer Gewerbeschließanlage) außerhalb der aufgeführten Kerngebiete stellen Sie bitte eine{' '}
          <Link href="/service-und-termin/anfrage" className="font-semibold underline text-[oklch(0.52_0.24_260)]">
            allgemeine Anfrage
          </Link>{' '}
          — wir prüfen die Machbarkeit und erstellen Ihnen ein individuelles Angebot.
        </Alert>
      </Section>

      <Section className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Methodischer Vergleich"
          title="Vergleichsmatrix: Vor-Ort-Service vs. Fernleistungen"
          lead="Um Ihnen größtmögliche Transparenz zu bieten, haben wir unsere Leistungsbereiche klar strukturiert. Diese Matrix hilft Ihnen bei der Entscheidung, welcher Servicekanal für Ihr aktuelles Anliegen am besten geeignet ist."
        />

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.05)]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
              <tr>
                <th className="p-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)] w-1/3">Leistungskategorie</th>
                <th className="p-4 font-semibold border-b border-l border-[oklch(0.89_0.008_260/0.55)] w-1/3 bg-[oklch(0.988_0.002_260)]">Regionale Vor-Ort-Leistungen</th>
                <th className="p-4 font-semibold border-b border-l border-[oklch(0.89_0.008_260/0.55)] w-1/3">Deutschlandweite Fernleistungen</th>
              </tr>
            </thead>
            <tbody className="text-[oklch(0.32_0.02_260)] divide-y divide-[oklch(0.89_0.008_260/0.55)]">
              <tr>
                <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">
                  <div className="flex items-center gap-2"><ShieldCheck size={16} /> Beratung & Projektierung</div>
                </td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">Physische Objektbegehung, Schwachstellenanalyse, Aufmaß von Zylindern vor Ort.</td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Digitale Schließplanerstellung, telefonische oder videobasierte Systemberatung.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">
                  <div className="flex items-center gap-2"><FileText size={16} /> Installation & Montage</div>
                </td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">Fachgerechte Montage von Schließzylindern, Beschlägen, elektronischer Zutrittskontrolle und Alarmanlagen.</td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Nicht möglich (erfordert Eigenmontage oder Beauftragung eines lokalen Dienstleisters).</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">
                  <div className="flex items-center gap-2"><Truck size={16} /> Nachbestellungen (Schlüssel/Zylinder)</div>
                </td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">Abholung im Store nach Vereinbarung oder Lieferung durch Servicetechniker im Zuge anderer Arbeiten.</td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Vollautomatisierter Versand via DHL/UPS. Schlüsselfertigung nach Sicherungskarte oder Code.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">
                  <div className="flex items-center gap-2"><Clock size={16} /> Fehlerbehebung & Wartung</div>
                </td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">Akute Türöffnungen, Reparatur verklemmter Mechanik, System-Updates für Zutrittskontrollen.</td>
                <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Remote-Support (Telefon/E-Mail), Fernwartung (sofern das System dies unterstützt), Rückversand defekter Teile.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-[oklch(0.968_0.004_260)] rounded-3xl mb-16">
        <SectionHeading
          eyebrow="Fachwissen & Transparenz"
          title="Umfangreicher FAQ-Bereich zu unseren Standorten"
          lead="Hier beantworten wir die häufigsten Fragen zu unseren Einsatzgebieten, Anfahrtskosten und der Unterscheidung zwischen regionalen und bundesweiten Services."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">
              Warum bieten Sie nicht alle Leistungen bundesweit an?
            </h4>
            <p className="mt-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die Installation komplexer Sicherheitstechnik erfordert höchste handwerkliche Präzision und oft auch eine Begutachtung der Bausubstanz vor Ort. Um unseren Qualitätsanspruch zu halten, beschränken wir Montagedienstleistungen auf Regionen, in denen wir mit eigenen, geschulten Fachkräften agieren können. Die reine Materiallieferung (z.B. Schlüssel nach Code) unterliegt diesen Einschränkungen nicht und erfolgt bundesweit in gleichbleibend hoher Qualität.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">
              Wie berechnen sich die Anfahrtskosten für Vor-Ort-Termine?
            </h4>
            <p className="mt-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die Anfahrtskosten basieren auf einer transparenten Zonen-Berechnung ausgehend von unserem jeweiligen Stützpunkt. Sie setzen sich aus einer Fahrzeugpauschale und der Fahrzeit des Technikers zusammen. Nutzen Sie unseren obenstehenden regionalen Kostenkalkulator, um einen realistischen Richtwert basierend auf Ihrer Entfernung zum nächsten Servicepunkt zu erhalten.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">
              Können Sie auch Gewerbeobjekte außerhalb der Kernregionen betreuen?
            </h4>
            <p className="mt-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
              Ja, für umfangreiche Projekte – wie die Planung und Installation komplexer Schließanlagen für Industrieanlagen, Bürogebäude oder Filialnetze – weiten wir unseren Einsatzradius nach individueller Absprache aus. Solche Projekte werden in der Regel separat kalkuliert und beinhalten spezifische Vereinbarungen zur Anfahrt und Projektlogistik.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">
              Was passiert, wenn ich für ein bundesweit versendetes Produkt Montagehilfe benötige?
            </h4>
            <p className="mt-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
              Unser Onlineshop ist primär auf den Fachhandel und handwerklich versierte Anwender sowie das &quot;Do-it-yourself&quot;-Segment ausgerichtet. Wir legen unseren Lieferungen ausführliche Montageanleitungen bei und bieten telefonischen Support. Sollten Sie dennoch Hilfe bei der Installation (z.B. eines Zylinders) benötigen und außerhalb unseres Einsatzgebietes wohnen, empfehlen wir die Beauftragung eines lokalen Fachbetriebs für Sicherheitstechnik.
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">
              Sind Ihre Vor-Ort-Termine auch außerhalb der regulären Geschäftszeiten möglich?
            </h4>
            <p className="mt-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
              Grundsätzlich finden geplante Montagen und Beratungen während unserer Kernarbeitszeiten statt. Für Notfälle oder spezielle gewerbliche Anforderungen (z.B. Installationen außerhalb der Öffnungszeiten des Kunden, um den Betriebsablauf nicht zu stören) bieten wir nach vorheriger Absprache und gegen entsprechende Aufschläge auch gesonderte Einsatzzeiten an.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
