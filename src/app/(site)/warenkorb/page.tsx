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
        {/* Ab lg ein Zwölfer-Raster: Im Leerzustand steht „Passend dazu“ rechts neben der Leerkarte (Komposition 3). */}
        <div className="group/warenkorb lg:grid lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <WarenkorbAnsicht
            shipping={settings.shipping}
            codeLines={codeLines}
            standardArticles={standardArticles}
            catalog={catalog}
          />

          {/* Mobil Abstand von 64 px zur Summe; unten Platz für die Leiste „Gesamtsumme · Zur Kasse“ (nur mit Positionen). */}
          <section className="mt-16 pb-24 md:pb-0 lg:col-span-12 lg:mt-0 korb-leer:pb-0 korb-leer:lg:col-span-4">
            <h2 className="text-title-sm font-semibold text-foreground">Passend dazu</h2>
            {/* Haarlinienliste: die ganze Zeile ist der Link, der Pfeil rückt bei feinem Zeiger vor (B-06). */}
            <ul className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-gutter lg:grid-cols-3 korb-leer:lg:grid-cols-1">
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
          </section>
        </div>
      </div>
    </>
  );
}
