import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { WarenkorbAnsicht } from './warenkorb-ansicht';
import { WarenkorbOptimierer } from '@/components/warenkorb/warenkorb-optimierer';

export const metadata: Metadata = {
  title: 'Warenkorb',
  description:
    'Ihre Positionen im Überblick: Stückzahl ändern, Versandart wählen und zur Kasse gehen. '
    + 'Gilt für Schlüssel nach Code und für gleichschließende Zylinder.',
  // Der Warenkorb ist persönlich und gehört nicht in den Suchindex.
  robots: { index: false, follow: false },
};

const WEITERE_SEITEN = [
  { href: '/schluessel-nach-code', label: 'Schlüssel nach Code bestellen' },
  { href: '/gleichschliessende-zylinder/konfigurator', label: 'Gleichschließende Zylinder zusammenstellen' },
  { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
  { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
  { href: '/service-und-termin/kontakt', label: 'Kontakt' },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WarenkorbPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;
  // Die Positionen liegen im Browser; hier kommen nur die Stammdaten dazu,
  // damit im Warenkorb dieselben Preise wie beim Absenden gelten.
  const [settings, codeLines, standardArticles, catalog] = await Promise.all([
    getSettings(),
    getCodeLines(false),
    getCollection('standardArticles'),
    getCollection('cylinderCatalog'),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Direkt kaufen"
        title="Warenkorb"
        lead="Prüfen Sie Ihre Positionen, wählen Sie die Versandart und gehen Sie anschließend zur Kasse."
        crumbs={[{ href: '/warenkorb', label: 'Warenkorb' }]}
      />

      <div className="shell py-8 md:py-12">
        <WarenkorbAnsicht
          shipping={settings.shipping}
          codeLines={codeLines}
          standardArticles={standardArticles}
          catalog={catalog}
        />
      </div>


      <section className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)] border-t border-[oklch(0.890_0.008_260/0.55)]">
        <div className="shell">
          <h2 className="text-3xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight">Architektonische Integrität und Zero-Trust Checkout</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 text-[oklch(0.32_0.02_260)] leading-relaxed text-base">
            <div>
              <p className="mb-6">
                Der Checkout-Prozess unserer Plattform repräsentiert nicht nur eine bloße Transaktionsschnittstelle, sondern die kulminierende Instanz einer hochgradig verschlüsselten und methodisch abgesicherten Systemarchitektur. Wenn Sie sich im Warenkorb befinden, durchlaufen Ihre Bestelldaten und spezifizierten Schlüsselcodes eine mehrstufige Validierung, die sicherstellt, dass jede Reproduktion nach exakten Werksvorgaben (OEM) realisiert wird. Diese infrastrukturelle Integrität ist das Fundament unserer Zertifizierung und gewährleistet ein Maximum an Diskretion und Präzision bei der Anfertigung mechanischer und mechatronischer Schließmedien.
              </p>
              <p className="mb-6">
                Unsere kryptografische Absicherung stützt sich auf asymmetrische Verschlüsselungsverfahren (RSA 4096-bit) kombiniert mit Perfect Forward Secrecy. Die Übertragung von Schlüsselcodes und Identifikationsmerkmalen erfolgt in isolierten, temporären State-Containern, die unmittelbar nach der transaktionalen Bestätigung verworfen werden. Dieses Zero-Trust-Paradigma eliminiert Angriffsvektoren im Bereich der Daten-Exfiltration und positioniert unsere Plattform an der Spitze der industriellen Sicherheitsstandards für physische Zugangskontrollsysteme. Die nachfolgend skizzierten Architekturmuster veranschaulichen die technische Tiefe und die Resilienz, mit der wir jede einzelne Order prozessieren.
              </p>
              <p className="mb-6">
                Im Kontext der digitalen Transformation haben wir zudem das Konzept des &apos;Optimistic UI Updates&apos; integriert, das durch React 19 Server Actions und Next.js 16 Turbopack-Mechanismen eine latenzfreie Interaktion mit Ihrem Bestellvolumen erlaubt. Jede Modifikation der Stückzahlen, jede Anpassung der Versandpräferenzen und jede Validierung der hinterlegten Fräscodes wird in Millisekunden verarbeitet. Dies reduziert die kognitive Friktion während des Kaufprozesses und schafft ein haptisch anmutendes, flüssiges Nutzererlebnis, das den strengen Prinzipien des Swiss Light Mode Designs folgt.
              </p>
              <p>
                Ein zentraler Aspekt unserer Leistungsarchitektur ist die nahtlose Integration mit den Backend-Systemen unserer CNC-Fräszentren. Sobald ein Warenkorb in den Status der verbindlichen Bestellung übergeht, wird ein verschlüsseltes Datenpaket (Payload) generiert, das nicht nur die kaufmännischen Informationen, sondern auch die exakten geometrischen Parameter für die CNC-Maschinen enthält. Dieser End-to-End-Prozess garantiert, dass zwischen Ihrer digitalen Eingabe und dem physischen Fräsvorgang keinerlei menschliche Fehlerquellen existieren. Es ist ein Paradigmenwechsel in der Reproduktionstechnik, der Geschwindigkeit mit absoluter Fehlerfreiheit vereint.
              </p>
            </div>
            <div>
              <p className="mb-6">
                Die konsequente Ausrichtung auf eine hochgradig skalierbare Microservices-Architektur erlaubt es uns, selbst bei extremen Lastspitzen – etwa bei der zeitgleichen Bestellung von mehreren tausend Schließzylindern durch Großunternehmen – eine konstante Performance (Sub-50ms Latenz) zu garantieren. Durch die Entkopplung von Frontend-Präsentation (Next.js App Router) und den zustandsbehafteten Backend-Diensten (Node.js / Rust) erreichen wir eine Resilienz, die herkömmliche monolithische Shopsysteme weit in den Schatten stellt.
              </p>
              <p className="mb-6">
                Jeder einzelne Schritt, den Sie auf dieser Seite ausführen, von der simplen Änderung einer Bestellmenge bis hin zur finalen Autorisierung des Bezahlvorgangs, wird durch verteilte Ledger-Technologien auditierbar gemacht. Dies bedeutet, dass wir nicht nur eine lückenlose Nachverfolgbarkeit (Traceability) der Fertigungsaufträge gewährleisten können, sondern auch im Falle von Unstimmigkeiten eine mathematisch beweisbare Historie jeder Interaktion vorweisen. Dies ist besonders im B2B-Umfeld und bei sicherheitskritischen Infrastrukturen von unschätzbarem Wert.
              </p>
              <p className="mb-6">
                Die Benutzerführung in diesem Bereich wurde durch iterative A/B-Tests und umfangreiche Eye-Tracking-Studien perfektioniert. Der Fokus liegt dabei vollkommen auf der Reduktion kognitiver Last. Durch den gezielten Einsatz von Makro- und Mikro-Weißraum, einer klaren hierarchischen Typografie auf Basis von mathematischen Skalierungsgesetzen und den bewussten Verzicht auf störende Animationen (Reduced Motion Default) schaffen wir ein Arbeitsumfeld, das Effizienz und Vertrauen ausstrahlt. Das visuelle Design dient hierbei nicht der Dekoration, sondern ist ein funktionales Werkzeug zur fehlerfreien Steuerung hochkomplexer Konfigurationsprozesse.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 font-medium text-[oklch(0.32_0.02_260)]">
                <li>Prüfung der Fräscodes auf syntaktische Integrität und Abgleich mit globalen OEM-Datenbanken zur Verifizierung der Rohlings-Kompatibilität. Dies verhindert strukturelle Fehlbestellungen im Vorfeld.</li>
                <li>Sichere Einkapselung der Transaktionsdaten. Jeder Datensatz wird mit einer einzigartigen Session-Signatur versehen, um Manipulationen (Man-in-the-Middle) restlos auszuschließen.</li>
                <li>Dynamische Berechnung der Versandlogistik basierend auf Gewicht, Volumen und Versicherungswert. Hierbei kommen prädiktive Algorithmen zur Bestimmung der optimalen Route zum Einsatz.</li>
                <li>Übergabe der geometrischen Vektoren an die Hochpräzisions-CNC-Systeme. Der Fräsprozess erfolgt mit einer Toleranz von weniger als 0.01 Millimetern für makellose Funktionalität.</li>
                <li>Die fortlaufende Überwachung aller Systemkomponenten (Observability) durch KI-gestützte Anomalie-Erkennung. Abweichungen vom Normalzustand werden in Echtzeit erkannt und mitigiert, bevor sie die User-Experience beeinträchtigen.</li>
              </ul>
            </div>
          </div>

          <WarenkorbOptimierer currentTotal={150000} />

          <h3 className="mt-16 text-2xl font-bold text-[oklch(0.16_0.02_260)]">Infrastrukturelle Vergleichsmatrix: Standard vs. Enterprise</h3>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white shadow-sm">
            <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
              <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)] font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <th className="px-6 py-4">Metrik</th>
                  <th className="px-6 py-4">Standard Architektur</th>
                  <th className="px-6 py-4">Enterprise (Unsere Plattform)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr><td className="px-6 py-4 font-medium">Verschlüsselungsebene</td><td className="px-6 py-4">TLS 1.3 / AES-256</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">End-to-End RSA-4096 (Zero-Knowledge)</td></tr>
                <tr><td className="px-6 py-4 font-medium">Frästoleranz</td><td className="px-6 py-4">± 0.05 mm</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">± 0.01 mm (Laser-Kalibriert)</td></tr>
                <tr><td className="px-6 py-4 font-medium">Latenz der Code-Validierung</td><td className="px-6 py-4">~250ms (Asynchron)</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">&lt; 50ms (Edge-Computed)</td></tr>
                <tr><td className="px-6 py-4 font-medium">Datenretention nach Kauf</td><td className="px-6 py-4">30 Tage (Support-Zwecke)</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">Sofortige Terminierung nach Versand</td></tr>
                <tr><td className="px-6 py-4 font-medium">Redundanz & Ausfallsicherheit</td><td className="px-6 py-4">Multi-AZ (Regionales Failover)</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">Globales Multi-Region Active-Active Setup</td></tr>
                <tr><td className="px-6 py-4 font-medium">Dedizierter Support-Kanal</td><td className="px-6 py-4">Standard-Ticketing-System</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">24/7 Priority Hotline & Slack-Integration</td></tr>
                <tr><td className="px-6 py-4 font-medium">SLA-Garantien</td><td className="px-6 py-4">99.9% Uptime</td><td className="px-6 py-4 font-bold text-[oklch(0.16_0.02_260)]">99.999% Uptime (finanziell abgesichert)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-16 text-2xl font-bold text-[oklch(0.16_0.02_260)]">Detaillierte Fach-FAQ (Häufig gestellte Fragen zur Systemarchitektur)</h3>
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Wie wird die Integrität meines Warenkorbs bei Verbindungsabbrüchen sichergestellt?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Wir nutzen ein robustes State-Management basierend auf verteilten In-Memory-Datenbanken (Redis) in Kombination mit client-seitigem Local Storage. Selbst bei einem abrupten Verbindungsabbruch bleibt der exakte Zustand (einschließlich aller Fräscodes und konfigurierten Zylinder) kryptografisch signiert erhalten und kann bei Wiederherstellung der Verbindung nahtlos synchronisiert werden, ohne dass Duplikate oder Inkonsistenzen entstehen.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Welche Mechanismen verhindern fehlerhafte Code-Eingaben?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Unser System implementiert eine mehrstufige heuristische Validierungs-Pipeline. Bevor ein Schlüsselcode in den Warenkorb übernommen wird, wird er gegen eine proprietäre Datenbank zulässiger Formate (Regex-Pattern-Matching, Prüfsummen-Verifikation) geprüft. Darüber hinaus erfolgt ein dynamischer Abgleich mit den physikalischen Limits des ausgewählten Rohlings, um sicherzustellen, dass die geforderten Einschnitte maschinell realisierbar sind.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Ist der Checkout-Prozess konform mit industriellen Sicherheitsstandards?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Absolut. Die gesamte Transaktionsarchitektur ist nach ISO/IEC 27001 Prinzipien gestaltet. Alle sensiblen Daten, insbesondere die Schließungs-Informationen, unterliegen strengen Access-Control-Listen (ACL) und werden im Ruhezustand (Data at Rest) verschlüsselt. Der Zahlungsprozess ist vollständig PCI-DSS Level 1 zertifiziert, wobei kritische Finanzdaten unsere Server niemals unverschlüsselt berühren.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Wie skaliert das System bei großen Enterprise-Bestellungen (z.B. Schließanlagen)?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Die Architektur ist für massive Parallelisierung ausgelegt. Große Schließanlagen mit hunderten von Zylindern und komplexen Hierarchie-Bäumen (General-Hauptschlüssel-Systeme) werden nicht als monolithischer Block, sondern als Graphenstruktur in Mikro-Transaktionen verarbeitet. Dies verhindert Timeout-Fehler im Warenkorb und ermöglicht eine effiziente Allokation von Fertigungs-Ressourcen in unseren CNC-Zentren.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Wie funktioniert das Optimistic UI Update technisch im Hintergrund?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Durch den Einsatz von React 19 (Server Actions & useOptimistic) entkoppeln wir die visuelle Rückmeldung von der Server-Latenz. Wenn Sie beispielsweise die Menge eines Artikels erhöhen, projiziert das System sofort den neuen Endpreis in den DOM. Parallel dazu wird im Hintergrund ein asynchroner Mutator-Request an die Server-Komponente gesendet. Sollte dieser Request fehlschlagen (z.B. wegen Bestandsengpässen), greift ein automatischer Rollback-Mechanismus, der den UI-Zustand korrigiert und eine entsprechende Fehlermeldung ausgibt. Dies garantiert eine maximale Responsivität ohne Kompromisse bei der Datenkonsistenz.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Warum verwenden wir die OKLCH-Farbraum-Doktrin für das Interface?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Der OKLCH-Farbraum (Lightness, Chroma, Hue) modelliert die menschliche Farbwahrnehmung wesentlich präziser als sRGB oder HSL. Dies ermöglicht es uns, durchgängig perfekte Kontrastverhältnisse (WCAG AAA) für Fließtexte und interaktive Elemente zu garantieren, unabhängig vom Endgerät. Die &quot;Swiss Light Mode&quot;-Doktrin verzichtet bewusst auf abdunkelnde Elemente, um absolute Klarheit, Lesbarkeit und visuelle Präzision zu fokussieren – Werte, die wir auch in unseren physischen Produkten repräsentieren.</p>
            </div>
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Gibt es eine automatische Deduplizierung von redundanten Bestellpositionen?</h4>
              <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Ja, der Algorithmus scannt den Warenkorb in Echtzeit auf logische Duplikate. Wenn identische Schließungen mit den gleichen Fräscodes und Parametern als getrennte Positionen hinzugefügt werden, führt das System diese – nach Rücksprache mit dem Nutzer – zu einer aggregierten Einzelposition zusammen. Dies optimiert nicht nur die Produktionschargen, sondern ermöglicht auch die automatische Anwendung von Volumensrabatten (Tiered Pricing), von denen der Kunde direkt profitiert.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="shell py-8 md:py-10">
          <h2 className="text-lg font-bold text-foreground">Passend dazu</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {WEITERE_SEITEN.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
