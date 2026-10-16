import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { paymentStatus } from '@/lib/integrations';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { KasseFormular } from './kasse-formular';

export const metadata: Metadata = {
  title: 'Kasse',
  description:
    'Kontakt- und Lieferdaten angeben, Bestellübersicht prüfen und die Bestellung abschließen.',
  // Die Kasse ist persönlich und gehört nicht in den Suchindex.
  robots: { index: false, follow: false },
};

const RECHTLICHES = [
  { href: '/rechtliches/agb', label: 'AGB' },
  { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
  { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
  { href: '/rechtliches/datenschutz', label: 'Datenschutz' },
];

export default async function KassePage() {
  const [settings, codeLines, standardArticles, catalog] = await Promise.all([
    getSettings(),
    getCodeLines(false),
    getCollection('standardArticles'),
    getCollection('cylinderCatalog'),
  ]);

  // Ohne angebundenen Zahlungsdienstleister wird die Bestellung mit dem
  // Zahlungsstatus „offen“ angelegt. Das gehört auf die Seite.
  const zahlung = paymentStatus();

  return (
    <>
      <PageHeader
        eyebrow="Direkt kaufen"
        art="arbeit"
        title="Kasse"
        lead="Bitte geben Sie Ihre Kontakt- und Lieferdaten an. Danach sehen Sie die vollständige Bestellübersicht."
        crumbs={[
          { href: '/warenkorb', label: 'Warenkorb' },
          { href: '/kasse', label: 'Kasse' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <KasseFormular
          shipping={settings.shipping}
          codeLines={codeLines}
          standardArticles={standardArticles}
          catalog={catalog}
          defaultCountry={settings.company.country}
          paymentConfigured={zahlung.configured}
        />
      </div>

      <Section tone="muted" tight labelledBy="kasse-rechtliches">
        <h2 id="kasse-rechtliches" className="text-title-sm font-semibold text-foreground">
          Rechtliche Hinweise
        </h2>
        <ul className="mt-4 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {RECHTLICHES.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group inline-flex min-h-touch w-full items-center justify-between gap-3 pr-4 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
              >
                {link.label}
                <GlyphPfeilRechts
                  size={16}
                  className="shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
