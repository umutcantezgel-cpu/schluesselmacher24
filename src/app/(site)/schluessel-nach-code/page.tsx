import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen, ShieldCheck, KeyRound, Clock, Factory } from 'lucide-react';

import { getCodeLines, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

import { ShopListe } from './shop-liste';
import { CodeValidatorInteractive } from '@/components/schluessel-nach-code/code-validator';
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
        lead={page?.subline ?? 'Code eingeben, Stückzahl wählen, bestellen. Die smarte Art, Nachschlüssel ohne Original zu fertigen.'}
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

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Architektur der Nachfertigung"
              title="Präzisionsfertigung ohne Originalschlüssel"
              lead="Die Anfertigung eines Schlüssels nach Code repräsentiert die Spitze der modernen Schließtechnik-Logistik. Anstatt den physischen Schlüssel mechanisch abzutasten und zu kopieren, rekonstruieren wir die exakte Schließfräsung rein datenbasiert."
            />
            <div className="mt-8 prose-sm24">
              <p>
                Ein mechanischer Schlüssel ist letztlich der physische Träger eines mathematischen Algorithmus. Jede Kerbe, jede Bohrmulde und jedes Profilmerkmal entspricht spezifischen Zuhaltungsstiften im Zylinder. Der sogenannte &quot;Schlüsselcode&quot; (auch Schließungscode oder Werksnummer genannt) ist die alphanumerische Übersetzung dieser komplexen Geometrie. Durch unsere hochpräzisen CNC-Schlüsselfräsmaschinen können wir diesen Datensatz mit mikrometergenauer Toleranz wieder in physisches Metall übersetzen.
              </p>

              <h2 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Ihre Vorteile im Überblick</h2>
              <div className="grid gap-6 sm:grid-cols-2 mt-4">
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[oklch(0.52_0.24_260)] mb-3" />
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Absolute Sicherheit</h3>
                  <p className="text-sm text-[oklch(0.32_0.02_260)]">Ihr Originalschlüssel verlässt niemals Ihre Hände. Das Risiko eines Verlustes auf dem Postweg oder einer illegalen Zwischenkopie ist bei null.</p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-sm">
                  <Factory className="h-6 w-6 text-[oklch(0.52_0.24_260)] mb-3" />
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Werksqualität</h3>
                  <p className="text-sm text-[oklch(0.32_0.02_260)]">Im Gegensatz zu manuellen Kopien (die oft mit Toleranzen behaftet sind), entspricht ein Code-Schlüssel exakt dem Neuzustand. Kein Haken, kein Klemmen.</p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-sm">
                  <Clock className="h-6 w-6 text-[oklch(0.52_0.24_260)] mb-3" />
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Kein Nutzungsausfall</h3>
                  <p className="text-sm text-[oklch(0.32_0.02_260)]">Sie müssen Ihren einzigen verbleibenden Schlüssel nicht einsenden, sondern können Ihre Türen weiterhin wie gewohnt sichern.</p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 shadow-sm">
                  <KeyRound className="h-6 w-6 text-[oklch(0.52_0.24_260)] mb-3" />
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Jederzeit erweiterbar</h3>
                  <p className="text-sm text-[oklch(0.32_0.02_260)]">Solange Sie Ihren Code (oder Ihre Sicherungskarte) besitzen, können Sie jederzeit und in beliebiger Stückzahl nachbestellen.</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4">Technische Methodik der Validierung</h2>
              <p>
                Bevor ein Fräsauftrag unsere Maschinen erreicht, durchläuft er einen mehrstufigen Validierungsprozess. Die Schließungsnummer wird auf syntaktische Korrektheit (Format, Länge, Prüfziffern) sowie auf semantische Gültigkeit (existiert dieser Code in der jeweiligen Profilserie?) geprüft.
              </p>
              <p className="mt-4">
                Bei registrierten Schließanlagen oder geschützten Profilen ist zusätzlich die Autorisierung zwingend erforderlich. Hierbei wird die von Ihnen hochgeladene oder per Post übersandte Sicherungskarte (Security Card) mit den Stammdaten des Herstellers abgeglichen. Nur wenn Code, Anlage und Berechtigungsnachweis kryptografisch und administrativ übereinstimmen, erfolgt die Freigabe zur Produktion.
              </p>
            </div>
          </div>

          <div className="sticky top-24">
            <CodeValidatorInteractive />
          </div>
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow={`${lines.length} Systeme verfügbar`}
          title="Passende Profilserie wählen"
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
          eyebrow="Fachwissen & Expertise"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Detaillierte Antworten zur Nachfertigung von Schlüsseln per Code und Sicherungskarte."
        />
        <div className="mt-10 grid gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <h3 className="font-semibold text-lg text-[oklch(0.16_0.02_260)]">Wo finde ich meinen Schlüsselcode genau?</h3>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">Der Schlüsselcode ist typischerweise direkt auf dem Schlüsselkopf oder dem Schlüsselschaft eingraviert (z.B. eine Buchstaben-Zahlen-Kombination). Bei Zylindern mit Sicherungskarte finden Sie den Code meist sowohl auf der Karte als auch auf dem Zylindergehäuse selbst eingestanzt.</p>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <h3 className="font-semibold text-lg text-[oklch(0.16_0.02_260)]">Was bedeutet &quot;Einsendung der Sicherungskarte&quot;?</h3>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">Einige Hersteller (wie z.B. KESO oder bestimmte DOM-Anlagen) erfordern zur Legitimation zwingend die Vorlage der originalen, physischen Sicherungskarte. Ein Foto reicht hier nicht aus. In diesen Fällen müssen Sie uns die Karte nach der Bestellung per Einschreiben zusenden. Die Karte erhalten Sie selbstverständlich zusammen mit den neuen Schlüsseln zurück.</p>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <h3 className="font-semibold text-lg text-[oklch(0.16_0.02_260)]">Ist ein Nachschlüssel per Code wirklich so präzise wie das Original?</h3>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">Er ist nicht nur so präzise, er ist faktisch ein neues Original. Eine mechanische Kopie, bei der Ihr Schlüssel abgetastet wird, übernimmt unweigerlich auch die Abnutzungserscheinungen Ihres alten Schlüssels (Toleranzaddition). Ein Schlüssel nach Code wird hingegen exakt nach den Werksvorgaben (Null-Maß) neu gefräst.</p>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <h3 className="font-semibold text-lg text-[oklch(0.16_0.02_260)]">Wie lange dauert die Fertigung in der Regel?</h3>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">Die Dauer hängt stark vom Profiltyp ab. Viele gängige Standardprofile fertigen wir innerhalb von 24 bis 48 Stunden in unserer eigenen Werkstatt. Handelt es sich um geschützte Sonderprofile, die wir direkt beim Hersteller bestellen müssen (sog. Werksbestellungen), kann die Lieferzeit zwischen 5 und 15 Werktagen betragen.</p>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <h3 className="font-semibold text-lg text-[oklch(0.16_0.02_260)]">Kann ich einen Code-Schlüssel zurückgeben, wenn er nicht passt?</h3>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">Nachschlüssel nach Code sind kundenspezifische Maßanfertigungen (gemäß § 312g Abs. 2 Nr. 1 BGB) und daher grundsätzlich vom gesetzlichen Widerrufsrecht ausgeschlossen. Sollte uns jedoch bei der Fertigung ein Fehler unterlaufen sein und der Schlüssel nicht den Werksvorgaben des Codes entsprechen, greift selbstverständlich die gesetzliche Gewährleistung.</p>
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
