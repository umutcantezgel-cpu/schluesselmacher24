import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
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
