import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { WarenkorbAnsicht } from './warenkorb-ansicht';

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

export default async function WarenkorbPage() {
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
        art="arbeit"
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

      <section className="border-t border-border bg-surface-muted">
        <div className="shell py-8 md:py-10">
          <h2 className="text-title-sm font-semibold text-foreground">Passend dazu</h2>
          {/* Haarlinienliste: die ganze Zeile ist der Link, der Pfeil rückt bei feinem Zeiger vor (B-06). */}
          <ul className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-gutter lg:grid-cols-3">
            {WEITERE_SEITEN.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-primary hover:underline"
                >
                  {link.label}
                  <GlyphPfeilRechts
                    size={16}
                    className="shrink-0 transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
