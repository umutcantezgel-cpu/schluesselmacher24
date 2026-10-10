import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';

import { getCodeLines, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

import { ShopListe } from './shop-liste';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { CodeKeyCalculator } from '@/components/calculator/code-key-calculator';

const ROUTE = 'schluessel-nach-code';

/** Interne Verlinkung am Seitenende — feste Ziele plus gepflegte Ziele aus der Datenschicht. */
const BASE_LINKS: NavLink[] = [
  {
    href: '/schluessel-nach-vorlage',
    label: 'Kein Code vorhanden? Schlüssel nach Vorlage',
    description: 'Drei Fotos hochladen, wir prüfen Machbarkeit und Preis.',
  },
  {
    href: '/ratgeber/schluesselcode-finden',
    label: 'Wo finde ich den Schlüsselcode?',
    description: 'Typische Fundstellen auf Schloss, Schlüssel und Unterlagen.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Mehrere Türen mit einem Schlüssel',
    description: 'Gleichschließende Zylinder selbst zusammenstellen.',
  },
  {
    href: '/rechtliches/versand-und-zahlung',
    label: 'Zahlung und Versand',
    description: 'Welche Versandarten und Zahlungswege zur Verfügung stehen.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Code bestellen - Der Experten-Guide',
    description:
      page?.seo.description
      ?? 'Bestellen Sie Original-Nachschlüssel direkt nach Code. Höchste Präzision, garantierte Sicherheit und schnelle Lieferung – ganz ohne Einsenden des Originals.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

export default async function SchluesselNachCodePage() {
  const [page, lines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);

  // Gepflegte interne Links ergänzen die festen Ziele, ohne sie zu doppeln.
  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-code',
          name: page?.headline ?? 'Schlüssel nach Code',
          description: page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }],
        })}
      />

      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Schlüssel nach Code bestellen – Maximale Präzision ohne Original'}
        lead={page?.subline ?? 'Erhalten Sie 100% passgenaue Original-Nachschlüssel direkt vom Hersteller – sicher, schnell und bequem von zu Hause aus.'}
        crumbs={[{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }]}
      >
        <Alert tone="info" title="Ihr Originalschlüssel bleibt sicher bei Ihnen">
          <p>
            Der größte Vorteil unserer fortschrittlichen CNC-Frästechnik: Sie müssen Ihren Originalschlüssel <strong>niemals aus der Hand geben oder per Post versenden</strong>. Wir fertigen Ihren Nachschlüssel exklusiv anhand der spezifischen Schließungsnummer (Code). So bleibt Ihr Schloss während der gesamten Produktionszeit voll einsatzfähig und Ihr Schlüssel sicher an Ihrem Bund.
          </p>
          <p className="mt-2">
            Sie finden keinen Code auf Ihrem Schlüssel oder der Sicherungskarte?{' '}
            <Link href="/schluessel-nach-vorlage" className="font-semibold text-primary hover:underline">
              Nutzen Sie unseren innovativen &quot;Schlüssel nach Vorlage&quot;-Service.
            </Link>
          </p>
        </Alert>
      </PageHeader>

      <Section className="bg-[oklch(0.988_0.002_260)] py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Preis & Machbarkeit"
          title="Sofortige Prüfung Ihres Schlüsselcodes"
          lead="Nutzen Sie unser interaktives Modul, um Ihren Code direkt zu validieren und den exakten Preis für Ihren Nachschlüssel zu ermitteln."
        />
        <div className="mt-12 max-w-2xl mx-auto">
          <CodeKeyCalculator />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Die architektonische Methodik"
          title="Wie funktioniert die Nachfertigung nach Code?"
          lead="Ein Blick hinter die Kulissen unserer mechatronischen Präzisionsfertigung, die garantiert, dass jeder Nachschlüssel exakt dem Original entspricht."
        />

        <div className="mt-8 prose-sm24 max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
          <p>
            Die Bestellung eines Schlüssels nach Code repräsentiert den modernsten und sichersten Weg der Schlüsselkopie. Im Gegensatz zum traditionellen mechanischen Kopierverfahren, bei dem ein physischer Schlüssel als Vorlage dient und Toleranzen abgetastet werden, ist der Prozess &quot;Nach Code&quot; eine exakte Reproduktion der originalen Werksspezifikationen. Wir sprechen hier nicht von einer Kopie, sondern von der Herstellung eines echten Originals.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">1. Die digitale Decodierung</h3>
          <p>
            Der Code auf Ihrem Schlüssel (oft eine Kombination aus Buchstaben und Zahlen) ist im Grunde ein hochkomplexer, verschlüsselter Bauplan. Er enthält präzise geometrische Daten: Die genauen Frästiefen, die spezifischen Winkel der Einschnitte, die Abstände zwischen den Stiftzuhaltungen und das genaue Profil des Schlüsselbarts. Unsere geschützten Software-Systeme übersetzen diesen alphanumerischen Code in einen detaillierten, dreidimensionalen CAD-Datensatz.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">2. Präzisions-CNC-Fertigung</h3>
          <p>
            Dieser Datensatz wird direkt an unsere computergesteuerten (CNC) Fräsmaschinen übertragen. Diese Maschinen arbeiten mit Toleranzen im Mikrometerbereich. Das Ergebnis ist ein Schlüssel, der nicht die Abnutzungserscheinungen oder mikroskopischen Fehler aufweist, die unweigerlich entstehen, wenn man einen gebrauchten Schlüssel mechanisch kopiert. Ein nach Code gefertigter Schlüssel schont den Schließzylinder, da er nicht hakt oder klemmt, und maximiert so die Lebensdauer Ihrer gesamten Schließanlage.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">3. Der Sicherheitsaspekt (Sicherungskarten)</h3>
          <p>
            Viele Hochsicherheitsschlüssel verfügen über eine Sicherungskarte (Sicherheitsausweis). Dieser kryptographische Schutzmechanismus stellt sicher, dass Codes nicht unautorisiert ausgelesen oder bestellt werden können. Bei diesen Profilen ist die Vorlage (als Upload oder Kopie) zwingend erforderlich, um den rechtmäßigen Besitz zu legitimieren. Dies bildet eine fundamentale Barriere gegen die illegale Duplikation von Schlüsseln und schützt die Integrität Ihres Sicherheitssystems.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">4. Hersteller-Direktanbindung vs. Eigene Fertigung</h3>
          <p>
            Während wir viele Standard- und Sonderprofile in unserer eigenen High-Tech-Werkstatt anhand des Codes fräsen können, gibt es patentrechtlich stark geschützte Profilserien, deren Rohlinge nicht auf dem freien Markt verfügbar sind. In diesen Fällen greift unsere direkte, verschlüsselte API-Anbindung an die Systeme der Originalhersteller (wie ABUS, BKS, DOM, KESO). Ihre Bestellung wird in Echtzeit und datenschutzkonform an die Werksfertigung übermittelt, dort produziert und direkt an Sie versendet.
          </p>
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow={`${lines.length} Codelinien`}
          title="Finden Sie Ihre spezifische Codelinie"
          lead={
            page?.intro
            ?? 'Durchsuchen Sie unsere umfangreiche Datenbank nach Anwendung, Schlüsseltyp oder Hersteller und grenzen Sie das Ergebnis präzise ein.'
          }
        />

        <ShopListe lines={lines} className="mt-8" />
      </Section>

      <Section className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Fachwissen kompakt"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Detaillierte Antworten unserer Sicherheitstechnik-Experten auf die wichtigsten Fragen zur Bestellung von Schlüsseln nach Code."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Wo genau finde ich den erforderlichen Code?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)]">
              Der Code, auch Schließungsnummer genannt, befindet sich meist eingraviert auf dem Schlüsselkopf selbst. Bei Anlagen- oder Hochsicherheitsschlüsseln steht er primär auf der dazugehörigen Sicherungskarte. Auch auf den Original-Kaufbelegen oder der Verpackung des Zylinders ist dieser oft vermerkt.
            </p>
          </div>

          <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Ist ein Schlüssel nach Code qualitativ besser als eine Kopie beim Schlüsseldienst vor Ort?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)]">
              Definitiv. Bei einer klassischen Kopie wird der abgenutzte Schlüssel abgetastet – jede Verschleißspur wird somit als &quot;Fehler&quot; mitkopiert. Eine Nachfertigung nach Code generiert einen fabrikneuen Schlüssel, exakt nach den originalen Konstruktionsdaten des Herstellers, ohne jeglichen Verschleiß.
            </p>
          </div>

          <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Wie lange dauert die Fertigung und Lieferung?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)]">
              Schlüssel, die wir in unserer eigenen Werkstatt fräsen können, verlassen unser Haus oft noch am selben Werktag. Bei geschützten Profilen, die direkt beim Herstellerwerk in Auftrag gegeben werden müssen, variiert die Lieferzeit je nach Marke zwischen 3 und 10 Werktagen.
            </p>
          </div>

          <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Was mache ich, wenn ich die Sicherungskarte verloren habe?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)]">
              Wenn Sie Ihre Sicherungskarte nicht mehr auffinden können, bieten wir spezielle Formulare zur Beantragung einer Ersatzkarte oder einer Freigabeerklärung an. Dies ist ein formaler, streng geregelter Prozess, um sicherzustellen, dass nur der rechtmäßige Eigentümer Schlüssel nachbestellen kann.
            </p>
          </div>

          <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">Funktioniert dieser Service auch für Autoschlüssel oder Briefkastenschlüssel?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)]">
              Ja, die Nachfertigung nach Code ist für viele Schlüsselarten möglich. Besonders bei Briefkastenanlagen (z.B. RENZ oder JU), Dachboxen (Thule) oder Möbelzylindern ist der Code oft direkt auf dem Schloss eingraviert, sodass Sie nicht einmal den Originalschlüssel benötigen. Für Autoschlüssel prüfen Sie bitte unsere spezifische Fahrzeugrubrik.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiterlesen"
          title="Passende Bereiche und Erklärungen"
          lead="Wenn der Code fehlt oder mehrere Türen zusammengehören, führen diese Wege weiter."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-start gap-3 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <PackageOpen size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
                      {link.description}
                    </span>
                  )}
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
