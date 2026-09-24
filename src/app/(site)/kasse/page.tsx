import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { paymentStatus } from '@/lib/integrations';
import { PageHeader } from '@/components/layout/page-header';
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

      <section className="border-t border-border bg-surface-muted">
        <div className="shell py-8 md:py-10">
          <h2 className="text-lg font-bold text-foreground">Rechtliche Hinweise</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {RECHTLICHES.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-primary hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
