import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconGleichschliessendeZylinder } from '@/components/visual/icons/gleichschliessende-zylinder';
import { IconSicherungskarte } from '@/components/visual/icons/sicherungskarte';
import { IconSchluesselNachVorlage } from '@/components/visual/icons/schluessel-nach-vorlage';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import { CodeFundstelleGrafik } from '@/components/visual/generators/code-fundstelle';

import { ShopListe } from './shop-liste';
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

/** Fach-Icon je Ziel der Weiterlesen-Liste; ohne eigenes Motiv der Bereich. */
function WeiterIcon({ href }: { href: string }) {
  switch (href) {
    case '/schluessel-nach-vorlage':
      return <IconSchluesselNachVorlage size={32} />;
    case '/ratgeber/schluesselcode-finden':
      return <IconSicherungskarte size={32} />;
    case '/gleichschliessende-zylinder':
      return <IconGleichschliessendeZylinder size={32} />;
    case '/rechtliches/versand-und-zahlung':
      return <IconVersandPaket size={32} />;
    default:
      return <BereichIcon area="schluessel-nach-code" size={32} />;
  }
}

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
        title={page?.headline ?? 'Schlüssel nach Code'}
        lead={page?.subline ?? 'Code eingeben, Stückzahl wählen, bestellen.'}
        crumbs={[{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }]}
        bereich="schluessel-nach-code"
        visual={
          /* Blickfang im Kopf (E4-L-23): die Fundstelle auf Papier, ohne Kartenrahmen */
          <div className="grid gap-4">
            <div>
              <p className="eyebrow">Codefundstelle</p>
              <h2 className="mt-3 text-title-sm font-semibold text-foreground">Wo steht der Code?</h2>
            </div>
            <CodeFundstelleGrafik params={{ ort: 'schluesselkopf' }} title="" className="w-full" />
          </div>
        }
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
            <Link
              href="/schluessel-nach-vorlage"
              className="font-semibold text-primary hover:underline"
            >
              Dann geht es über Schlüssel nach Vorlage weiter.
            </Link>
          </p>
        </Alert>
      </PageHeader>

      <Section tight labelledBy="trefferliste-titel">
        <SectionHeading
          id="trefferliste-titel"
          nummer="01"
          eyebrow="Codelinien"
          title="Passende Codelinie finden"
          lead={
            page?.intro
            ?? 'Suchen Sie nach Anwendung, Schlüsseltyp oder Hersteller und grenzen Sie das '
              + 'Ergebnis über die Filter ein.'
          }
        />

        <ShopListe lines={lines} className="mt-8" />
      </Section>

      {/* Ton wechselt zur Liste darüber (K-006); die Fundstelle steht im Kopf */}
      <Section tone="muted" tight labelledBy="weiter-titel">
        <SectionHeading
          id="weiter-titel"
          nummer="02"
          eyebrow="Weiterlesen"
          title="Passende Bereiche und Erklärungen"
          lead="Wenn der Code fehlt oder mehrere Türen zusammengehören, führen diese Wege weiter."
        />

        {/* Stückliste mit Fach-Icons: die ganze Zeile ist der Link */}
        <ol className="mt-8 border-t border-border">
          {links.map((link, index) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center gap-4 py-6 transition-colors duration-quick ease-standard sm:gap-6"
              >
                <span className="w-6 shrink-0 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="shrink-0 text-area-strong">
                  <WeiterIcon href={link.href} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-title-sm font-semibold text-foreground group-hover:text-area-strong">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="mt-1 block max-w-measure text-small text-foreground-muted">
                      {link.description}
                    </span>
                  )}
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-subtle transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-area-strong"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
