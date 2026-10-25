import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getCollection, getSettings } from '@/lib/data';
import { paymentStatus } from '@/lib/integrations';
import { cn } from '@/lib/cn';
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

/**
 * Die Links der Rechtlichen Hinweise als Haarlinienliste. `seite` ist die Fassung der
 * Seitenspalte neben dem leeren Warenkorb (ab `lg`): einspaltig, ohne Rand rechts vom Text.
 */
function RechtlicheLinks({ seite = false }: { seite?: boolean }) {
  return (
    <ul
      className={
        seite ? 'mt-4 border-t border-border' : 'mt-4 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4'
      }
    >
      {RECHTLICHES.map((link) => (
        <li key={link.href} className="border-b border-border">
          <Link
            href={link.href}
            className={cn(
              'group inline-flex min-h-touch w-full items-center justify-between gap-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary',
              !seite && 'pr-4',
            )}
          >
            {link.label}
            <GlyphPfeilRechts
              size={16}
              className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard group-hover:text-primary group-focus-visible:text-primary zeiger:group-hover:translate-x-1"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

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

  // Ein Wrapper für die ganze Seite, damit die Nummern der Abschnitte durchlaufen (CSS-Zähler).
  // Der Gruppenname gilt für `korb-leer:`: Im leeren Zustand (`.sm24-leerzustand`) stehen die
  // Rechtlichen Hinweise in der Seitenspalte, sonst als Band unten.
  return (
    <div className="group/warenkorb sm24-zaehlung">
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

      <div className="shell py-8 md:py-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-gutter">
        <KasseFormular
          shipping={settings.shipping}
          codeLines={codeLines}
          standardArticles={standardArticles}
          catalog={catalog}
          paymentConfigured={zahlung.configured}
        />

        <section aria-labelledby="kasse-rechtliches-leer" className="hidden lg:col-span-4 korb-leer:lg:block">
          <p className="eyebrow">
            <span className="sm24-nummer tabular-nums text-foreground-muted" />
          </p>
          <h2 id="kasse-rechtliches-leer" className="mt-1 text-title-sm font-semibold text-foreground">
            Rechtliche Hinweise
          </h2>
          <RechtlicheLinks seite />
        </section>
      </div>

      <Section tone="muted" tight labelledBy="kasse-rechtliches" className="korb-leer:lg:hidden">
        <p className="eyebrow">
          <span className="sm24-nummer tabular-nums text-foreground-muted" />
        </p>
        <h2 id="kasse-rechtliches" className="mt-1 text-title font-semibold text-foreground">
          Rechtliche Hinweise
        </h2>
        <RechtlicheLinks />
      </Section>
    </div>
  );
}
