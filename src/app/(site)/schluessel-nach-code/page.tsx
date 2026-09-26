import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';

import { getCodeLines, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';

import { ShopListe } from './shop-liste';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { CodeAnalysisCalculator } from '@/components/calculator/code-analysis-calculator';

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

const CODE_FAQ = [
  {
    question: 'Wie wird aus einem alphanumerischen Code ein physischer Schlüssel generiert?',
    answer: 'Der Prozess basiert auf präzisen Herstellermatritzen (wie SILCA oder InstaCode). Jeder Code in der Datenbank eines Schlossherstellers ist mit exakten Einschnitttiefen und Abständen (Bitting) sowie dem passenden Schlüsselprofil verknüpft. Sobald Sie den Code angeben, gleicht unser System diesen mit der Datenbank ab und sendet die Fräsdaten digital an eine hochpräzise CNC-Fräsmaschine. Diese schneidet den Schlüsselrohling exakt nach den originalen Werksvorgaben.'
  },
  {
    question: 'Gibt es ein Sicherheitsrisiko, wenn ich meinen Schlüssel nach Code bestelle?',
    answer: 'Die reine Code-Bestellung ist sicher, solange der Code nicht in falsche Hände gerät. Wir empfehlen, den Code an Schlüsseln (sofern eingraviert) unkenntlich zu machen, wenn sie an Dritte (wie Werkstätten) übergeben werden. Für Hochsicherheitsschließanlagen erfordert die Nachbestellung zusätzlich eine Sicherungskarte, um unbefugte Kopien auszuschließen.'
  },
  {
    question: 'Was ist der Unterschied zwischen indirekten und direkten Schlüsselcodes?',
    answer: 'Ein direkter Code verrät unmittelbar die Einschnitttiefen (z. B. 1234 bedeutet Frästiefen 1, 2, 3 und 4). Ein indirekter Code (häufig bei Autos oder Möbeln) ist eine Zufallsfolge (z. B. XZ104), die erst über eine geschützte Software-Datenbank in physische Fräsparameter übersetzt werden kann. Wir verarbeiten beide Code-Arten vollautomatisiert.'
  },
  {
    question: 'Kann jeder Schlüssel nach Code nachgemacht werden?',
    answer: 'Grundsätzlich können wir für die meisten Standardprofile (Briefkasten, Spind, Dachbox) sowie viele Fahrzeugschlüssel anhand der Codelinien exakte Nachschlüssel fertigen. Ausnahmen bilden stark veraltete Systeme ohne digitalisierte Aufzeichnungen oder patengeschützte Hochsicherheitssysteme, die zwingend über den Fachhändler mit Sicherungskarte abgewickelt werden müssen.'
  },
  {
    question: 'Warum erhalte ich bei einer Bestellung nach Code eine höhere Präzision?',
    answer: 'Beim klassischen Kopieren wird ein bereits abgenutzter Schlüssel als Vorlage verwendet, wodurch sich Verschleiß auf den neuen Schlüssel überträgt (Generationsverlust). Bei der Fertigung nach Code entsteht hingegen ein „Schlüssel der ersten Generation“, da er mit den exakten, mathematischen Ursprungsmaßen des Schlosses gefräst wird.'
  }
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Code bestellen',
    description:
      page?.seo.description
      ?? 'Nachschlüssel nach Code bestellen — ohne Einsendung des Originalschlüssels.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchluesselNachCodePage({ params, searchParams }: Props) {
  const [page, lines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  // Gepflegte interne Links ergänzen die festen Ziele, ohne sie zu doppeln.
  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-code',
          name: page?.headline ?? 'Schlüssel nach Code',
          description: page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }],
          faq: CODE_FAQ,
        })}
      />

      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Schlüssel nach Code'}
        lead={page?.subline ?? 'Code eingeben, Stückzahl wählen, bestellen.'}
        crumbs={[{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }]}
      >
        <Alert tone="info" title="Ihr Originalschlüssel bleibt bei Ihnen">
          <p>
            Bei allen Artikeln in diesem Bereich ist <strong>keine Einsendung des
            Originalschlüssels</strong> nötig. Wir fertigen den Schlüssel allein anhand des Codes,
            den Sie bei der Bestellung angeben. Sie können Ihr Schloss also weiter benutzen,
            während der Nachschlüssel entsteht.
          </p>
          <p className="mt-2">
            Kein Code vorhanden?{' '}
            <Link href="/schluessel-nach-vorlage" className="font-semibold text-primary hover:underline">
              Dann geht es über Schlüssel nach Vorlage weiter.
            </Link>
          </p>
        </Alert>
      </PageHeader>

      <Section tight>
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Präzise Fertigung aus digitalen Fräsdaten"
          lead="Erfahren Sie, wie wir aus einer alphanumerischen Zeichenfolge einen hochpräzisen, physischen Schlüssel in Erstausrüsterqualität generieren."
        />
        <div className="prose prose-slate mt-6 max-w-3xl text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Die Anfertigung eines Schlüssels anhand eines Codes stellt technologisch den präzisesten Weg dar, einen Nachschlüssel zu produzieren. Im Gegensatz zum herkömmlichen Kopierverfahren, bei dem ein physischer (und oft bereits abgenutzter) Schlüssel als mechanische oder optische Vorlage dient, greift die Code-Fertigung direkt auf die mathematischen Ursprungsdaten des Schlosses zurück.
          </p>
          <p>
            Jedes Zylinderschloss oder Briefkastenschloss wird ab Werk mit einem spezifischen Schließplan und definierten Einschnitttiefen produziert. Ein auf dem Schlüssel oder dem Schloss eingravierter Code repräsentiert diese Konfiguration.
          </p>
          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold mt-8 mb-4">Digitale Transformation: Vom Code zur CNC-Maschine</h3>
          <p>
            Wenn Sie uns Ihren Code übermitteln (z.B. „FH1234“), wird dieser in unserer Softwarearchitektur verarbeitet. Das System nutzt fortschrittliche Datenbank-APIs (wie SILCA- oder InstaCode-Strukturen), um den Code zu decodieren.
          </p>
          <p>
            Das Ergebnis ist das sogenannte „Bitting“: Eine exakte Matrix aus Abstandswerten (Positionen auf dem Schlüsselbart) und Frästiefen (auf den Hundertstelmillimeter genau). Gleichzeitig ermittelt die Datenbank das spezifische Rohlingsprofil (die Rillenstruktur des Schlüssels), das für das jeweilige Schloss benötigt wird.
          </p>
          <p>
            Diese digitalen Fräsparameter werden direkt an eine computergesteuerte (CNC) Hochpräzisions-Fräsmaschine übertragen. Die Maschine schneidet den Rohling nicht nach Augenmaß oder Kopierfühler, sondern führt die X- und Y-Achsen exakt nach den digitalen Herstellerkoordinaten.
          </p>
          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold mt-8 mb-4">Der Vorteil der Ersten Generation</h3>
          <p>
            Das Resultat dieses Prozesses ist ein Nachschlüssel der „ersten Generation“. Er weist keinerlei Kopiertoleranzen oder Verschleißübertragungen auf. Er ist physisch identisch mit dem Schlüssel, der bei der Erstauslieferung des Schlosses beilag. Dies garantiert eine maximale Lebensdauer für das Schloss, da keine unpräzisen Kanten die empfindlichen Zuhaltungsstifte im Zylinder beanspruchen.
          </p>
          <p>
            Dieses Verfahren wenden wir für alle in unserem Shop verfügbaren Codelinien an – von einfachen Briefkastenschlüsseln bis hin zu komplexen Autoschlüsseln mit Innenbahnprofilen.
          </p>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Leistungsstufen"
          title="Sicherheits- und Komplexitätsstufen im Vergleich"
          lead="Je nach Schlosstyp und Anwendung unterscheiden sich die Sicherheitsanforderungen und die Code-Struktur grundlegend."
        />
        <div className="mt-8 overflow-hidden rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
          <div className="table-scroll">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[oklch(0.968_0.004_260)] border-b border-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Kategorie</th>
                  <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Anwendungsbereich</th>
                  <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Code-Struktur</th>
                  <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Mechanischer Schutz</th>
                  <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Fertigungsmethodik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr className="hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Low Security</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Spinde, Briefkästen, Möbel, einfache Dachboxen</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Meist 3 bis 5 Ziffern (oft direkt graviert)</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Basisschutz, Plättchenzuhaltungen</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Standard-Zackenprofil-Fräsung</td>
                </tr>
                <tr className="hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">Medium Security</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Wohnungstüren, Schreibtische, Fahrräder</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Alphanumerisch (z.B. XA12345)</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Zylinderstifte, Anbohrschutz</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Präzisions-Zacken oder Bohr-Muldenschlüssel</td>
                </tr>
                <tr className="hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="py-4 px-6 font-medium text-[oklch(0.16_0.02_260)]">High Security</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Autoschlüssel, Hochsicherheitszylinder</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Komplex (oft verdeckt, erfordert Decoder/Karte)</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Magnetcodierung, Innenbahn, aktive Elemente</td>
                  <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Lasercut (Innenbahn) & Transponder-Codierung</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow="Formatprüfung"
          title="Code-Struktur analysieren"
          lead="Überprüfen Sie sofort, ob Ihr abgelesener Code unserem System bekannt ist und in welchem Bereich er üblicherweise eingesetzt wird."
        />
        <div className="mt-8">
          <CodeAnalysisCalculator />
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow={`${lines.length} Codelinien`}
          title="Passende Codelinie finden"
          lead={
            page?.intro
            ?? 'Suchen Sie nach Anwendung, Schlüsseltyp oder Hersteller und grenzen Sie das '
              + 'Ergebnis über die Filter ein.'
          }
        />

        <ShopListe lines={lines} className="mt-8" />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Fachwissen"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Tiefergehende technische und methodische Antworten zur Schlüsselfertigung nach Code."
        />
        <Accordion
          items={CODE_FAQ}
          className="mt-8 max-w-4xl mx-auto"
        />
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
    </main>
  );
}
