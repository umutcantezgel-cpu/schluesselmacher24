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
import { CodeFormatAnalyzer } from '@/components/code-analyzer/code-format-analyzer';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedSearch = await searchParams;
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


      <Section id="was-ist-ein-schluesselcode">
        <SectionHeading
          eyebrow="Grundlagen"
          title="Was ist ein Schlüsselcode und wie funktioniert die Anfertigung?"
          lead="Die technische Methodik hinter der Schlüsselfertigung nach Code."
        />
        <div className="prose-sm24 mt-6 max-w-none">
          <p>
            Ein Schlüsselcode (oft auch als Schließungsnummer oder Schlüsselnummer bezeichnet) ist ein
            eindeutiger Identifikator, der die genauen Einschnitte, Bohrmulden oder Fräsungen eines
            Schlüssels beschreibt. In der Schließtechnik wird dieser Code verwendet, um einen
            Schlüssel exakt zu reproduzieren, ohne das Original oder das Schloss physisch
            vorliegen zu haben. Die Codes basieren auf herstellerspezifischen Systemen und
            werden in der Regel auf der Sicherungskarte, dem Schlüsselkopf oder direkt auf dem
            Schließzylinder eingraviert.
          </p>
          <p>
            Die Anfertigung erfolgt auf hochpräzisen, computergesteuerten Schlüsselfräsmaschinen.
            Sobald der Code im System erfasst ist, übersetzt die Software diesen in die exakten
            mechanischen Parameter (z.B. Schnitttiefe und Position). Die Fräsmaschine schneidet
            dann den Rohling mikrometergenau. Dies garantiert, dass der neue Schlüssel nicht
            nur eine Kopie der Kopie ist, sondern die exakten Spezifikationen eines
            Originalschlüssels ab Werk aufweist. Dieser Prozess minimiert den Verschleiß am
            Schließzylinder und sorgt für optimale Leichtgängigkeit.
          </p>
          <p>
            Zu den typischen Anwendungsbereichen zählen Profilzylinder für Haustüren,
            Briefkastenschlösser, Möbelschlösser, Dachboxen und Fahrradschlösser. Je nach
            Hersteller (wie ABUS, BKS, DOM, CES, etc.) und Schließsystem kann der Code
            aus einer Kombination von Buchstaben und Zahlen bestehen. Es ist wichtig, den
            Code exakt abzulesen und bei der Bestellung anzugeben.
          </p>
        </div>
      </Section>

      <Section id="vorteile-der-code-fertigung" tone="muted">
        <SectionHeading
          eyebrow="Vergleich"
          title="Die Vorteile der Fertigung nach Code gegenüber der mechanischen Kopie"
          lead="Warum die Code-Fertigung oft die bessere Wahl ist."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Fertigung nach Code</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2">
                <span className="text-[oklch(0.52_0.24_260)]">✓</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Werkseigene Präzision, da nach mathematischen Parametern gefräst wird.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.52_0.24_260)]">✓</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Kein Originalschlüssel erforderlich (Schloss bleibt nutzbar).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.52_0.24_260)]">✓</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Gleicht Verschleißerscheinungen des alten Schlüssels aus.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.52_0.24_260)]">✓</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Ideal bei verlorenen Schlüsseln, sofern der Code bekannt ist.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] opacity-80">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Kopie</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2">
                <span className="text-[oklch(0.32_0.02_260)]">⚠</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Abweichungen durch Abtastung des Originals möglich.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.32_0.02_260)]">⚠</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Originalschlüssel muss physisch vorliegen oder eingesendet werden.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.32_0.02_260)]">⚠</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Kopiert den Verschleiß des Originals (&quot;Kopie der Kopie&quot;).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[oklch(0.32_0.02_260)]">⚠</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)]">Bei hohem Verschleiß kann die Kopie klemmen.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="interaktives-modul">
        <SectionHeading
          eyebrow="Analyse"
          title="Schlüsselcode Format-Prüfer"
          lead="Überprüfen Sie vorab, ob Ihr Code dem typischen Format des Herstellers entspricht."
        />
        <div className="mt-8">
          <CodeFormatAnalyzer />
        </div>
      </Section>

      <Section id="faq" tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Fachspezifische Fragen zur Code-Fertigung"
          lead="Antworten auf die wichtigsten Fragen zur Methodik und zum Ablauf."
        />
        <div className="mt-8 space-y-6">
          {[
            {
              q: "Wie sicher ist die Fertigung eines Schlüssels nach Code?",
              a: "Die Fertigung nach Code ist sehr sicher, da die Schlüsselmaschine den Rohling exakt auf die werkseitigen Parameter fräst. Allerdings erfordert dies, dass der Code vertraulich behandelt wird. Bei Hochsicherheitsschlössern ist zusätzlich die Vorlage der Sicherungskarte zwingend erforderlich, um eine unberechtigte Anfertigung zu verhindern."
            },
            {
              q: "Kann jeder Code von jedem Hersteller gefräst werden?",
              a: "Nein. Zwar decken wir ein sehr breites Spektrum an Herstellern und Profilen ab, jedoch gibt es geschützte Profile, Sonderanfertigungen oder veraltete Systeme, für die keine Rohlinge oder Fräsparameter (Code-Tabellen) mehr verfügbar sind. In solchen Fällen ist oft nur eine mechanische Kopie oder ein Zylindertausch möglich."
            },
            {
              q: "Was bedeutet es, wenn auf meinem Schlüssel kein Code steht?",
              a: "Nicht alle Hersteller gravieren den Code auf den Schlüsselkopf. Oft findet sich die Nummer auf der zugehörigen Sicherungskarte oder dem Schließzylinder selbst. Bei einfachen Zylindern gibt es teilweise gar keine Codes; hier bleibt nur die mechanische Kopie nach Vorlage."
            },
            {
              q: "Warum muss ich bei einigen Codes eine Sicherungskarte vorlegen?",
              a: "Die Sicherungskarte (oft auch als Security Card bezeichnet) dient als Legitimationsnachweis. Sie stellt sicher, dass nur der rechtmäßige Eigentümer oder eine von ihm autorisierte Person Nachschlüssel anfertigen lassen kann. Dies ist ein entscheidender Baustein der Gebäude- und Anlagensicherheit."
            },
            {
              q: "Wie lange dauert die Fertigung nach Code?",
              a: "Bei gängigen Profilen und Standard-Codes erfolgt die Fertigung oft innerhalb von 1-2 Werktagen, da die maschinelle Übersetzung des Codes schnell und präzise abläuft. Bei komplexen Anlagen oder speziellen Herstellern kann sich die Lieferzeit verlängern, da Rohlinge erst beschafft oder Codes vom Werk angefragt werden müssen."
            }
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">{item.q}</h4>
              <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">{item.a}</p>
            </div>
          ))}
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
