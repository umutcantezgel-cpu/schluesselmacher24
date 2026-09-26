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
import { InteractiveCodeFinder } from '@/components/calculator/interactive-code-finder';

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
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const [page, lines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              Die Architektur der Code-basierten Schlüsselfertigung
            </h2>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die Fertigung eines Schlüssels nach Code ist ein hochpräziser Vorgang, bei dem wir modernste CNC-Frästechnologie (Computer Numerical Control) einsetzen. Anders als bei einer mechanischen Kopie, bei der ein vorhandener Schlüssel als physische Schablone abgetastet wird, basiert die Code-Fertigung auf den mathematischen Originalspezifikationen des Herstellers. Der Schlüsselcode, den Sie uns übermitteln, ist im Grunde ein kryptografischer Schlüssel, der sich auf eine spezifische Einschnitttabelle bezieht. Jede Position auf dem Schlüsselbart und jede zugehörige Tiefe wird durch diesen Code exakt definiert.
            </p>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Wenn wir Ihren Code in unsere Maschinen eingeben, greift die Software auf eine umfangreiche, stets aktualisierte Datenbank zu. Diese Datenbank enthält die exakten Fräsparameter für nahezu alle gängigen und viele seltene Schließzylinder, Vorhangschlösser, Briefkastenschlösser und Fahrzeugschlösser. Der Rohling wird in die Maschine eingespannt, und ein hochdrehender Fräskopf schneidet das Profil mit einer Toleranz von wenigen Hundertstelmillimetern. Das Ergebnis ist kein Duplikat eines womöglich bereits abgenutzten Schlüssels, sondern ein &quot;Originalschlüssel&quot;, der exakt den Spezifikationen entspricht, als hätte er das Werk des Herstellers soeben erst verlassen.
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8">
              Vergleichsmatrix: Code-Fertigung vs. Herkömmliche Kopie
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[oklch(0.89_0.008_260/0.55)]">
              <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
                <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                  <tr>
                    <th className="p-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Eigenschaft</th>
                    <th className="p-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Fertigung nach Code</th>
                    <th className="p-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Mechanische Kopie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                  <tr>
                    <td className="p-4 font-medium">Präzision</td>
                    <td className="p-4">100% Werkszustand (Toleranz &lt; 0.02mm)</td>
                    <td className="p-4">Übernimmt Abnutzung des Originals</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Logistik</td>
                    <td className="p-4">Kein Versand des Originals nötig</td>
                    <td className="p-4">Original muss vorliegen</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Sicherheit</td>
                    <td className="p-4">Maximal (Schloss bleibt nutzbar)</td>
                    <td className="p-4">Risiko des Verlusts beim Versand</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Verschleiß-Korrektur</td>
                    <td className="p-4">Ja, eliminiert vorherigen Verschleiß</td>
                    <td className="p-4">Nein, verschlechtert oft die Toleranz</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8">
              Unsere Methodik für höchste Sicherheit und Qualität
            </h2>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Die Sicherheit unserer Kunden hat für uns höchste Priorität. Daher durchläuft jede Bestellung nach Code einen strengen, mehrstufigen Verifizierungsprozess. Zunächst wird der eingegebene Code algorithmisch auf Plausibilität und Checksummen-Übereinstimmung geprüft. Bei Schließanlagen oder sicherheitsrelevanten Schlüsseln fordern wir zusätzlich die Vorlage einer Sicherungskarte. Erst nach erfolgreicher Validierung aller Parameter wird der Fräsauftrag an die Produktion übergeben.
            </p>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
              Nach dem Fräsen durchläuft jeder Schlüssel eine optische Qualitätskontrolle, bei der die Einschnitte gegen die digitalen Referenzdaten abgeglichen werden. Anschließend werden die Schlüssel maschinell entgratet, um ein hakeliges Schließen im Zylinder zu vermeiden. Der Versand erfolgt neutral verpackt, um keinen Rückschluss auf den Inhalt oder den Schließort zuzulassen. Durch diese durchgängige Qualitätssicherung stellen wir sicher, dass Ihr neuer Schlüssel vom ersten Moment an butterweich und zuverlässig schließt. Die gesamte Prozesskette ist darauf ausgelegt, Reibungsverluste zu minimieren und maximale Sicherheit zu gewährleisten. Wir verstehen die Verantwortung, die mit der Anfertigung von Schlüsseln einhergeht, und haben unsere Systeme entsprechend robust und transparent gestaltet. Dieser Ansatz unterscheidet uns maßgeblich von konventionellen Schlüsseldiensten und garantiert eine Servicequalität auf Industrieniveau, die auch den höchsten Ansprüchen unserer B2B- und B2C-Kunden gerecht wird.
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8">
              Häufig gestellte Fragen (FAQ) zur Code-Fertigung
            </h2>
            <div className="space-y-6 mt-4">
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-[0_2px_12px_-4px_oklch(0.16_0.02_260/0.03)] bg-white">
                <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">1. Wie sicher ist es, einen Schlüssel nach Code zu bestellen?</h3>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
                  Es ist extrem sicher. Da Sie uns nicht mitteilen, wo sich das zugehörige Schloss befindet, und wir die Sendungen neutral verpacken, kann selbst bei einem theoretischen Verlust auf dem Postweg niemand den Schlüssel zuordnen. Zudem nutzen wir für die Datenübertragung modernste Verschlüsselung, sodass Ihr Code stets geschützt bleibt.
                </p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-[0_2px_12px_-4px_oklch(0.16_0.02_260/0.03)] bg-white">
                <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">2. Was passiert, wenn der bestellte Schlüssel nicht passt?</h3>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
                  Durch unsere CNC-gestützte Fertigung passiert dies äußerst selten. Sollte es dennoch einmal haken, prüfen wir den Vorgang umgehend. Oftmals liegt es an einem abgenutzten Zylinder, der sich an den verschlissenen Originalschlüssel &quot;gewöhnt&quot; hat. Wir finden in jedem Fall eine kulante und schnelle Lösung für Sie, bis das System wieder reibungslos funktioniert.
                </p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-[0_2px_12px_-4px_oklch(0.16_0.02_260/0.03)] bg-white">
                <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">3. Kann ich auch Sicherheitsschlüssel mit Sicherungskarte bestellen?</h3>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
                  Ja, absolut. Wenn das System eine Sicherungskarte vorschreibt, werden Sie im Bestellprozess aufgefordert, ein Foto oder einen Scan der Karte hochzuladen. Ohne diese Legitimation ist eine Fertigung technisch und rechtlich ausgeschlossen.
                </p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-[0_2px_12px_-4px_oklch(0.16_0.02_260/0.03)] bg-white">
                <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">4. Wie lange dauert die Anfertigung und Lieferung?</h3>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
                  Die meisten Code-Schlüssel werden innerhalb von 24 Stunden nach Auftragseingang (werktags) gefräst und an unseren Versandpartner übergeben. Sie erhalten den Schlüssel in der Regel nach 1-3 Werktagen. Bei seltenen Profilen kann es minimal länger dauern.
                </p>
              </div>
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-[0_2px_12px_-4px_oklch(0.16_0.02_260/0.03)] bg-white">
                <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">5. Wo genau finde ich den Schlüsselcode auf meinem Schlüssel?</h3>
                <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
                  Der Code ist meistens auf der Reide (dem Kopf des Schlüssels) eingraviert. Er besteht typischerweise aus einer Kombination von Buchstaben und Zahlen. Manchmal befindet sich der Code auch direkt auf dem Schloss (z.B. bei Briefkästen oder Dachboxen) oder in den Unterlagen zum Produkt. Unser Ratgeber bietet hierzu bebilderte Hilfestellungen.
                </p>
              </div>
            </div>

          </div>
          <div className="lg:col-span-1">
             <div className="sticky top-24">
               <InteractiveCodeFinder />
             </div>
          </div>
        </div>
      </Section>

      <Section tight className="mt-12">
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
